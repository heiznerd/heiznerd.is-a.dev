<template>
  <section id="timeline" ref="root" class="tl" aria-labelledby="tl-title">
    <div class="tl__pin">
      <div class="container tl__head">
        <div class="tl__head-copy">
          <span class="mono tl__eyebrow">03 — {{ t.label }}</span>
          <h2 id="tl-title" class="section-title tl__title">{{ t.title }}</h2>
          <p class="tl__subtitle muted">{{ t.headerSubtitle }}</p>
        </div>
        <div class="tl__controls">
          <span class="tl__counter mono" aria-hidden="true"><b>{{ String(activeIndex + 1).padStart(2, '0') }}</b> / {{ String(t.items.length).padStart(2, '0') }}</span>
          <button type="button" class="icon-btn tl__btn" :aria-label="t.previous" :disabled="activeIndex === 0" @click="go(activeIndex - 1)">
            <i class="fas fa-arrow-left" aria-hidden="true"></i>
          </button>
          <button type="button" class="icon-btn tl__btn" :aria-label="t.next" :disabled="activeIndex === t.items.length - 1" @click="go(activeIndex + 1)">
            <i class="fas fa-arrow-right" aria-hidden="true"></i>
          </button>
        </div>
      </div>

      <div
        ref="viewport"
        class="tl__viewport"
        tabindex="0"
        role="region"
        :aria-label="t.scrollLabel"
        @keydown="onKeydown"
        @scroll.passive="onNativeScroll"
      >
        <ol class="tl__track">
          <li
            v-for="(item, index) in t.items"
            :key="item.id"
            class="tl__item"
            :class="{ 'is-current': item.current }"
            :style="{ '--card': palette[index % palette.length].bg }"
          >
            <div class="tl__meta">
              <time :datetime="item.datetime">{{ item.date }}</time>
              <span v-if="item.current" class="tl__now"><span aria-hidden="true"></span>{{ t.current }}</span>
            </div>
            <article class="tl__card">
              <span class="tl__card-shape" aria-hidden="true"><Shape :name="palette[index % palette.length].shape" palette="cream" :shine="false" /></span>
              <span class="tl__index mono" aria-hidden="true">{{ String(index + 1).padStart(2, '0') }}</span>
              <p class="tl__kicker">{{ item.kicker }}</p>
              <h3 class="tl__card-title">{{ item.title }}</h3>
              <p class="tl__desc">{{ item.description }}</p>
              <ul v-if="item.links?.length" class="tl__links" :aria-label="t.linksLabel">
                <li v-for="link in item.links" :key="link.href">
                  <a :href="link.href" target="_blank" rel="noopener noreferrer" class="tl__link">
                    <i class="fab fa-github" aria-hidden="true"></i>
                    <span>{{ link.label }}</span>
                    <i class="fas fa-arrow-up-right-from-square" aria-hidden="true"></i>
                  </a>
                </li>
              </ul>
            </article>
          </li>
        </ol>
      </div>

      <div class="container">
        <div class="tl__rail" aria-hidden="true"><span ref="fillEl" class="tl__rail-fill"></span></div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, inject, ref } from 'vue';
import { gsap, getSmoother, prefersReducedMotion, revealTitle } from '@/lib/gsap';
import { useGsap, MEDIA } from '@/composables/useGsap';
import Shape from './ui/Shape.vue';

const lang = inject('lang');
const translations = inject('translations');
const t = computed(() => translations[lang.value].timeline);

const palette = [
  { bg: '#ffc2e2', shape: 'flower' },
  { bg: '#ff9a5c', shape: 'star' },
  { bg: '#a78bff', shape: 'ring' },
  { bg: '#6ad0ff', shape: 'arch' },
  { bg: '#ffb27a', shape: 'diamond' },
  { bg: '#fff1ea', shape: 'hourglass' },
  { bg: '#cdeeff', shape: 'drop' },
  { bg: '#ff5c93', shape: 'spark' },
];

const root = ref(null);
const viewport = ref(null);
const fillEl = ref(null);
const activeIndex = ref(0);
const pinned = ref(false);

let pinTrigger = null;

const itemCount = () => t.value.items.length;

const go = index => {
  const target = Math.max(0, Math.min(itemCount() - 1, index));
  if (pinned.value && pinTrigger) {
    const progress = target / Math.max(itemCount() - 1, 1);
    const y = pinTrigger.start + (pinTrigger.end - pinTrigger.start) * progress;
    const smoother = getSmoother();
    if (smoother) smoother.scrollTo(y, true);
    else window.scrollTo({ top: y, behavior: 'smooth' });
    return;
  }
  const items = viewport.value?.querySelectorAll('.tl__item');
  const item = items?.[target];
  if (!item) return;
  const padding = parseFloat(getComputedStyle(viewport.value).paddingLeft) || 0;
  viewport.value.scrollTo({ left: item.offsetLeft - padding, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
};

const onKeydown = event => {
  const map = { ArrowRight: activeIndex.value + 1, ArrowLeft: activeIndex.value - 1, Home: 0, End: itemCount() - 1 };
  if (!(event.key in map)) return;
  event.preventDefault();
  go(map[event.key]);
};

const onNativeScroll = () => {
  if (pinned.value || !viewport.value) return;
  const el = viewport.value;
  const max = el.scrollWidth - el.clientWidth;
  const progress = max > 0 ? el.scrollLeft / max : 0;
  if (fillEl.value) fillEl.value.style.transform = `scaleX(${progress})`;
  activeIndex.value = Math.round(progress * (itemCount() - 1));
};

useGsap(root, ({ root: el, mm }) => {
  mm.add(MEDIA, context => {
    const { motion, desktop } = context.conditions;
    if (motion) revealTitle(el.querySelector('.tl__title'), el);

    if (motion && desktop) {
      const track = el.querySelector('.tl__track');
      const view = el.querySelector('.tl__viewport');
      el.classList.add('is-pinned');
      pinned.value = true;
      const distance = () => {
        const style = getComputedStyle(view);
        const inner = view.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
        return Math.max(0, track.scrollWidth - inner);
      };

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: el,
          pin: '.tl__pin',
          start: 'top top',
          end: () => `+=${distance()}`,
          scrub: 0.25,
          invalidateOnRefresh: true,
          onUpdate: self => {
            activeIndex.value = Math.round(self.progress * (itemCount() - 1));
          },
        },
      });
      tl.to(track, { x: () => -distance() }, 0)
        .fromTo('.tl__rail-fill', { scaleX: 0 }, { scaleX: 1 }, 0);
      pinTrigger = tl.scrollTrigger;

      gsap.utils.toArray('.tl__item', el).forEach((item, i) => {
        gsap.from(item.querySelector('.tl__card'), {
          y: 120,
          rotate: i % 2 ? -7 : 7,
          scale: 0.86,
          ease: 'none',
          scrollTrigger: { trigger: item, containerAnimation: tl, start: 'left 105%', end: 'left 62%', scrub: 0.25 },
        });
        gsap.fromTo(item.querySelector('.tl__card-shape'), { rotate: -90 }, {
          rotate: 120,
          ease: 'none',
          scrollTrigger: { trigger: item, containerAnimation: tl, start: 'left right', end: 'right left', scrub: true },
        });
      });

      gsap.from('.tl__head-copy > *, .tl__controls', {
        y: 60,
        autoAlpha: 0,
        stagger: 0.1,
        duration: 1.1,
        scrollTrigger: { trigger: el, start: 'top 92%', once: true },
      });

      return () => {
        el.classList.remove('is-pinned');
        pinned.value = false;
        pinTrigger = null;
      };
    }

    if (motion) {
      gsap.from('.tl__head-copy > *', { y: 50, autoAlpha: 0, stagger: 0.1, scrollTrigger: { trigger: el, start: 'top 94%', once: true } });
      gsap.from('.tl__card', { y: 80, rotate: 4, autoAlpha: 0, stagger: 0.1, duration: 1, scrollTrigger: { trigger: '.tl__viewport', start: 'top 95%', once: true } });
    }
    return undefined;
  });
});
</script>

<style scoped>
.tl { position: relative; padding-block: var(--section-pad); }
.tl.is-pinned { padding-block: 0; }
.tl__pin { display: flex; flex-direction: column; justify-content: center; gap: clamp(28px, 4vh, 48px); }
.tl.is-pinned .tl__pin { height: 100svh; padding-top: calc(var(--header-h) + 8px); overflow: hidden; }

.tl__head { display: flex; align-items: flex-end; justify-content: space-between; gap: 24px; }
.tl__eyebrow { color: var(--c-accent); }
.tl__title { margin-top: 14px; }
.tl__subtitle { max-width: 46ch; margin-top: 14px; }
.tl__controls { display: flex; align-items: center; gap: 10px; }
.tl__counter { margin-right: 10px; color: var(--c-cream-75); font-size: 0.9rem; }
.tl__counter b { color: var(--c-cream); font-weight: 700; }
.tl__btn:disabled { opacity: 0.35; pointer-events: none; }

.tl__viewport {
  overflow-x: auto;
  overflow-y: hidden;
  padding: 12px var(--gutter) 24px;
  scroll-snap-type: x mandatory;
  scroll-padding-inline: var(--gutter);
  scrollbar-width: none;
  outline-offset: -4px;
}
.tl__viewport::-webkit-scrollbar { display: none; }
.tl.is-pinned .tl__viewport { overflow: visible; scroll-snap-type: none; }
@media (min-width: 1440px) {
  .tl__viewport { padding-inline: calc((100vw - var(--max-width)) / 2 + var(--gutter)); }
}

.tl__track { display: flex; gap: clamp(16px, 1.8vw, 28px); width: max-content; will-change: transform; }

.tl__item { width: clamp(280px, 25vw, 390px); flex: 0 0 auto; scroll-snap-align: start; }
.tl__meta { display: flex; align-items: center; justify-content: space-between; gap: 12px; height: 34px; margin-bottom: 12px; font-family: var(--font-mono); font-size: 0.85rem; }
.tl__meta time { color: var(--c-cream); }
.tl__now { display: inline-flex; align-items: center; gap: 8px; padding: 4px 12px; border-radius: var(--radius-pill); color: var(--c-bg); background: var(--c-accent); font-size: 0.72rem; font-weight: 700; text-transform: uppercase; }
.tl__now span { width: 7px; height: 7px; border-radius: 50%; background: var(--c-bg); }

.tl__card {
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: clamp(320px, 44vh, 420px);
  padding: clamp(22px, 2vw, 30px);
  overflow: hidden;
  border-radius: var(--radius-lg);
  color: var(--c-bg);
  background: var(--card);
  will-change: transform;
}
.tl__card-shape { position: absolute; top: -16%; right: -14%; width: 56%; opacity: 0.35; mix-blend-mode: soft-light; pointer-events: none; }
.tl__index { position: relative; font-weight: 700; }
.tl__kicker { position: relative; margin-top: auto; padding-top: 40px; font-size: 0.85rem; font-weight: 700; letter-spacing: 0.02em; text-transform: uppercase; }
.tl__card-title { position: relative; margin-top: 8px; color: var(--c-bg); font-size: clamp(1.5rem, 2.1vw, 2.05rem); font-weight: 600; line-height: 1.08; letter-spacing: -0.04em; }
.tl__desc { position: relative; margin-top: 12px; font-size: 0.98rem; line-height: 1.45; }
.tl__links { position: relative; display: flex; flex-wrap: wrap; gap: 8px; margin-top: 18px; }
.tl__link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 38px;
  padding: 8px 14px;
  border: 1.5px solid var(--c-bg);
  border-radius: var(--radius-pill);
  font-size: 0.82rem;
  font-weight: 600;
  transition: background 0.3s var(--ease-out), color 0.3s var(--ease-out);
}
.tl__link:hover, .tl__link:focus-visible { color: var(--card); background: var(--c-bg); }
.tl__link .fa-arrow-up-right-from-square { font-size: 0.7em; }
.tl__card :focus-visible { outline-color: var(--c-bg); }

.tl__rail { position: relative; height: 2px; overflow: hidden; border-radius: 2px; background: var(--c-line); }
.tl__rail-fill { position: absolute; inset: 0; background: var(--g-accent); transform: scaleX(0); transform-origin: left; }

@media (max-width: 899px) {
  .tl__head { flex-direction: column; align-items: flex-start; }
  .tl__item { width: min(80vw, 340px); }
}
</style>

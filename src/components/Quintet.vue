<template>
  <section id="romcom" ref="root" class="qt" aria-labelledby="qt-title">
    <div class="qt__petals" aria-hidden="true">
      <span v-for="n in 22" :key="n" class="petal"></span>
    </div>

    <div class="qt__pin">
      <div class="container qt__head">
        <div class="qt__head-main">
          <span class="mono qt__eyebrow">✦ {{ t.label }}</span>
          <h2 id="qt-title" class="section-title qt__title">{{ t.title }}</h2>
        </div>
        <p class="qt__sub lead">{{ t.subtitle }}</p>
      </div>

      <div class="qt__stage" role="group" :aria-label="t.groupLabel" @pointerleave="onLeaveStage" @focusout="onFocusOut">
        <ul class="qt__panels">
          <li
            v-for="(sister, i) in sisters"
            :key="sister.name"
            class="qp"
            :class="{ 'is-active': active === i }"
            :style="{ '--tone': TONES[i], '--shift-a': SHIFT_A[i], '--shift-b': SHIFT_B[i] }"
          >
            <button
              type="button"
              class="qp__btn"
              :aria-pressed="locked === i"
              :aria-label="`${sister.name} ${sister.kanji} — ${sister.order}. ${t.toggle}`"
              @pointerenter="onEnter(i, $event)"
              @focus="onFocus(i, $event)"
              @click="onClick(i)"
            >
              <span class="qp__media" aria-hidden="true">
                <span class="qp__layer qp__layer--a"><img src="/quintet/school.jpg" alt="" width="1900" height="400" loading="lazy" decoding="async" draggable="false" /></span>
                <span class="qp__layer qp__layer--b"><img src="/quintet/outing.jpg" alt="" width="1900" height="400" loading="lazy" decoding="async" draggable="false" /></span>
              </span>
              <span class="qp__shade" aria-hidden="true"></span>
              <span class="qp__num mono" aria-hidden="true">0{{ i + 1 }}</span>
              <span class="qp__kanji" lang="ja" aria-hidden="true">{{ sister.kanji }}</span>
              <span class="qp__label">
                <span class="qp__order mono">{{ sister.order }}</span>
                <span class="qp__name">{{ sister.name }}</span>
              </span>
            </button>
          </li>
        </ul>
        <p class="qt__hint mono"><i class="fas fa-hand-pointer" aria-hidden="true"></i> {{ t.hint }}</p>
      </div>
    </div>

    <div class="container qt__lower">
      <div class="posters">
        <h3 class="posters__title mono">{{ t.postersLabel }}</h3>
        <ul class="posters__row">
          <li v-for="(poster, i) in posters" :key="poster.src" class="poster" :style="{ '--r': poster.rotate, '--tone': poster.tone }">
            <figure class="poster__card">
              <img :src="poster.src" :alt="`${t.posters[i]} — The Quintessential Quintuplets`" width="460" :height="poster.h" loading="lazy" decoding="async" draggable="false" />
              <figcaption class="poster__cap"><span class="mono">0{{ i + 1 }}</span> {{ t.posters[i] }}</figcaption>
            </figure>
          </li>
        </ul>
      </div>

      <figure class="wed">
        <div class="wed__frame">
          <img class="wed__img" src="/quintet/wedding.jpg" :alt="t.weddingAlt" width="1900" height="400" loading="lazy" decoding="async" draggable="false" />
        </div>
      </figure>

      <p class="qt__credit">{{ t.credit }}</p>
    </div>
  </section>
</template>

<script setup>
import { computed, inject, ref } from 'vue';
import { gsap, ScrollTrigger, prefersReducedMotion } from '@/lib/gsap';
import { useGsap, MEDIA } from '@/composables/useGsap';

const lang = inject('lang');
const translations = inject('translations');
const t = computed(() => translations[lang.value].quintet);
const sisters = computed(() => t.value.sisters);

// Signature colours and where each sister sits in the 1900px-wide group banners (centre of her face).
const TONES = ['#f7bdf8', '#ff7aa8', '#00bae2', '#ff8709', '#ff5a4a'];
const SHIFT_A = ['-9.5%', '-30%', '-50%', '-72%', '-89.5%'];
const SHIFT_B = ['-11%', '-32%', '-52%', '-67.5%', '-86.5%'];

const posters = [
  { src: '/quintet/poster-s1.jpg', h: 690, rotate: '-5deg', tone: '#fec5fb' },
  { src: '/quintet/poster-s2.jpg', h: 650, rotate: '2deg', tone: '#00bae2' },
  { src: '/quintet/poster-movie.jpg', h: 645, rotate: '5deg', tone: '#ff8709' },
];

const root = ref(null);
const hovered = ref(-1);
const locked = ref(-1);
const active = computed(() => (locked.value >= 0 ? locked.value : hovered.value));

let panels = [];
let lastApplied = null;

const applyActive = () => {
  if (!panels.length) return;
  const idx = active.value;
  if (idx === lastApplied) return;
  lastApplied = idx;
  const duration = prefersReducedMotion() ? 0 : 0.9;
  panels.forEach((panel, i) => {
    const on = i === idx;
    gsap.to(panel, { flexGrow: idx < 0 ? 1 : on ? 3.5 : 0.72, duration, ease: 'hz.out', overwrite: 'auto' });
    gsap.to(panel.querySelector('.qp__layer--b'), { autoAlpha: on ? 1 : 0, duration: duration * 0.7, ease: 'power2.out', overwrite: 'auto' });
    gsap.to(panel.querySelector('.qp__media'), { scale: on ? 1.06 : 1, duration, ease: 'hz.out', overwrite: 'auto' });
  });
};

const onEnter = (i, event) => {
  if (event.pointerType === 'touch') return;
  hovered.value = i;
  applyActive();
};
const onFocus = (i, event) => {
  // Mouse clicks also focus the button; only keyboard focus should expand a panel.
  if (!event.target.matches(':focus-visible')) return;
  hovered.value = i;
  applyActive();
};
const onClick = i => {
  locked.value = locked.value === i ? -1 : i;
  applyActive();
};
const onLeaveStage = () => {
  hovered.value = -1;
  applyActive();
};
const onFocusOut = event => {
  if (event.currentTarget.contains(event.relatedTarget)) return;
  hovered.value = -1;
  applyActive();
};

useGsap(root, ({ root: el, mm }) => {
  panels = gsap.utils.toArray('.qp', el);

  mm.add(MEDIA, context => {
    const { motion, desktop } = context.conditions;
    if (!motion) return undefined;

    /* ---- Falling petals (only while the section is on screen) ---- */
    const petals = gsap.utils.toArray('.petal', el);
    const keep = desktop ? petals.length : 7;
    petals.forEach((petal, i) => { petal.style.display = i < keep ? '' : 'none'; });
    const loops = [];
    petals.slice(0, keep).forEach(petal => {
      const size = gsap.utils.random(10, 24);
      gsap.set(petal, { '--s': `${size}px`, left: `${gsap.utils.random(0, 100)}%`, rotate: gsap.utils.random(0, 360), opacity: gsap.utils.random(0.45, 0.9) });
      // The section grows a little as lazy images load, so petals travel a generous distance.
      const drop = gsap.fromTo(petal, { y: -80 }, { y: el.offsetHeight + 800, duration: gsap.utils.random(34, 58), ease: 'none', repeat: -1, paused: true });
      drop.progress(Math.random());
      loops.push(
        drop,
        gsap.to(petal, { x: `+=${gsap.utils.random(-140, 140)}`, duration: gsap.utils.random(2.6, 5), ease: 'sine.inOut', yoyo: true, repeat: -1, paused: true }),
        gsap.to(petal, { rotate: `+=${gsap.utils.random(180, 420)}`, duration: gsap.utils.random(5, 9), ease: 'none', repeat: -1, paused: true }),
      );
    });
    ScrollTrigger.create({
      trigger: el,
      start: 'top bottom',
      end: 'bottom top',
      onToggle: self => loops.forEach(loop => (self.isActive ? loop.play() : loop.pause())),
    });

    /* ---- The five panels: assemble while the section is pinned (scroll-scrubbed, so it can't be outrun) ---- */
    // Explicit fromTo() values (not from()) so the start/end states survive every ScrollTrigger refresh.
    const reveal = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: desktop
        ? { trigger: '.qt__pin', start: 'top top', end: () => `+=${Math.round(window.innerHeight * 0.95)}`, pin: true, scrub: 0.7 }
        : { trigger: '.qt__panels', start: 'top 88%', end: 'top 35%', scrub: 0.6 },
    });
    reveal
      .fromTo('.qt__head-main > *, .qt__sub', { y: 60, autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger: 0.08 }, 0)
      .fromTo('.qp', {
        clipPath: 'inset(100% 0% 0% 0% round 28px)',
        y: i => [120, -60, 90, -80, 60][i % 5],
        rotate: i => [-9, 6, -4, 8, -7][i % 5],
        scale: 0.9,
      }, {
        clipPath: 'inset(0% 0% 0% 0% round 28px)',
        y: 0,
        rotate: 0,
        scale: 1,
        stagger: 0.12,
      }, 0.1)
      .fromTo('.qp__label, .qp__num, .qp__kanji', { y: 40, autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger: 0.04 }, 0.55)
      .fromTo('.qt__hint', { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0 }, 0.85);

    /* ---- Posters fan out, wedding strip irises open ---- */
    gsap.from('.poster', {
      y: 160,
      rotate: i => [-14, 0, 14][i % 3],
      autoAlpha: 0,
      stagger: 0.14,
      duration: 1.3,
      ease: 'expo.out',
      scrollTrigger: { trigger: '.posters', start: 'top 85%', once: true },
    });
    gsap.from('.posters__title', { y: 30, autoAlpha: 0, scrollTrigger: { trigger: '.posters', start: 'top 90%', once: true } });
    gsap.fromTo('.wed__frame', { clipPath: 'inset(0% 46% 0% 46% round 999px)' }, {
      clipPath: 'inset(0% 0% 0% 0% round 36px)',
      ease: 'none',
      scrollTrigger: { trigger: '.wed', start: 'top 92%', end: 'top 40%', scrub: 0.6 },
    });
    gsap.fromTo('.wed__img', { xPercent: -6 }, {
      xPercent: 6,
      ease: 'none',
      scrollTrigger: { trigger: '.wed', start: 'top bottom', end: 'bottom top', scrub: true },
    });
    gsap.from('.qt__credit', { autoAlpha: 0, y: 20, scrollTrigger: { trigger: '.qt__credit', start: 'top 98%', once: true } });

    return () => petals.forEach(petal => { petal.style.display = ''; });
  });
});
</script>

<style scoped>
.qt { position: relative; padding-block: var(--section-pad) clamp(60px, 8vw, 120px); }

.qt__petals { position: absolute; inset: 0; z-index: 2; overflow: hidden; pointer-events: none; }
.petal {
  --s: 16px;
  position: absolute;
  top: 0;
  left: 0;
  width: var(--s);
  height: calc(var(--s) * 0.72);
  border-radius: 85% 0 85% 0;
  background: linear-gradient(135deg, #fec5fb, #f48fc4);
  opacity: 0;
  will-change: transform;
}

.qt__pin { position: relative; display: flex; min-height: 100svh; flex-direction: column; justify-content: center; gap: clamp(22px, 4vh, 44px); padding-top: calc(var(--header-h) + 8px); padding-bottom: 20px; }

.qt__head { display: grid; grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr); align-items: end; gap: 20px clamp(24px, 5vw, 80px); }
.qt__eyebrow { color: var(--c-pink); }
.qt__title { margin-top: 12px; font-size: clamp(2.6rem, 6vw, 5.8rem); }
.qt__sub { max-width: 44ch; font-size: clamp(1.05rem, 1.35vw, 1.3rem); }

/* Panels */
.qt__stage { width: 100%; max-width: var(--max-width); margin-inline: auto; padding-inline: var(--gutter); }
.qt__panels { display: flex; gap: clamp(8px, 1vw, 14px); height: clamp(340px, 54vh, 560px); }

.qp {
  position: relative;
  flex: 1 1 0;
  min-width: 0;
  overflow: hidden;
  border-radius: 28px;
  background: var(--c-bg-2);
  will-change: transform;
}
.qp__btn {
  position: absolute;
  inset: 0;
  display: block;
  width: 100%;
  height: 100%;
  padding: 0;
  border: 0;
  color: inherit;
  text-align: left;
  background: none;
  cursor: pointer;
}
.qp__btn:focus-visible { outline: 3px solid var(--tone); outline-offset: -6px; border-radius: 28px; }
.qp.is-active { box-shadow: inset 0 0 0 3px var(--tone); }

.qp__media { position: absolute; inset: 0; display: block; overflow: hidden; border-radius: inherit; will-change: transform; }
.qp__layer {
  position: absolute;
  top: 0;
  left: 50%;
  display: block;
  height: 100%;
  aspect-ratio: 1900 / 400;
}
.qp__layer img { width: 100%; height: 100%; object-fit: cover; user-select: none; -webkit-user-drag: none; }
.qp__layer--a { transform: translateX(var(--shift-a)); }
.qp__layer--b { transform: translateX(var(--shift-b)); opacity: 0; visibility: hidden; }

.qp__shade { position: absolute; inset: 0; background: linear-gradient(180deg, rgba(14, 16, 15, 0.35) 0%, transparent 28%, transparent 52%, rgba(14, 16, 15, 0.82) 100%); pointer-events: none; }

.qp__num { position: absolute; top: 16px; left: 18px; color: var(--c-cream); text-shadow: 0 1px 8px rgba(0, 0, 0, 0.5); font-weight: 700; }
.qp__kanji {
  position: absolute;
  top: 14px;
  right: 16px;
  color: var(--tone);
  font-size: clamp(1.4rem, 2.2vw, 2.1rem);
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: 0.05em;
  writing-mode: vertical-rl;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.55);
}
.qp__label { position: absolute; right: 18px; bottom: 18px; left: 18px; display: grid; gap: 2px; }
.qp__order { color: var(--tone); font-weight: 700; text-shadow: 0 1px 8px rgba(0, 0, 0, 0.6); }
/* While one panel is open the others are slim: shrink their names so nothing truncates. */
.qt__panels:has(.qp.is-active) .qp:not(.is-active) .qp__name { font-size: clamp(0.95rem, 1.35vw, 1.3rem); letter-spacing: -0.03em; }
.qt__panels:has(.qp.is-active) .qp:not(.is-active) .qp__label { right: 10px; left: 12px; }
.qt__panels:has(.qp.is-active) .qp:not(.is-active) .qp__kanji { font-size: 1.2rem; }

.qp__name { overflow: hidden; color: var(--c-cream); font-size: clamp(1.4rem, 2.6vw, 2.6rem); font-weight: 600; line-height: 1; letter-spacing: -0.045em; text-overflow: ellipsis; white-space: nowrap; text-shadow: 0 2px 14px rgba(0, 0, 0, 0.55); }

.qt__hint { margin-top: 16px; color: var(--c-cream-75); }
.qt__hint i { margin-right: 6px; color: var(--c-green); }

/* Posters + wedding strip */
.qt__lower { position: relative; z-index: 1; margin-top: clamp(60px, 9vw, 140px); }
.posters__title { color: var(--c-cream-75); font-weight: 500; }
.posters__row { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: clamp(14px, 3vw, 48px); max-width: 1000px; margin: 22px auto 0; padding-block: 24px; }
.poster__card {
  position: relative;
  overflow: hidden;
  border-radius: 20px;
  background: #fff;
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.45);
  transform: rotate(var(--r));
  transition: transform 0.6s var(--ease-out), box-shadow 0.6s var(--ease-out);
}
.poster__card:hover { transform: rotate(0deg) translateY(-10px) scale(1.03); box-shadow: 0 40px 80px rgba(0, 0, 0, 0.55), 0 0 0 3px var(--tone); }
.poster__card img { width: 100%; height: auto; }
.poster__cap { position: absolute; right: 10px; bottom: 10px; left: 10px; display: flex; align-items: center; gap: 8px; padding: 8px 14px; border-radius: var(--radius-pill); color: var(--c-bg); background: rgba(255, 252, 225, 0.92); font-size: 0.9rem; font-weight: 700; backdrop-filter: blur(6px); }
.poster__cap .mono { color: var(--tone); filter: brightness(0.75); }

.wed { margin-top: clamp(50px, 7vw, 100px); }
.wed__frame { height: clamp(150px, 24vw, 340px); overflow: hidden; border-radius: var(--radius-xl); background: #fff; }
.wed__img { width: 118%; max-width: none; height: 100%; margin-left: -9%; object-fit: cover; object-position: 55% 38%; will-change: transform; }

.qt__credit { max-width: 80ch; margin: 22px auto 0; color: var(--c-cream-50); font-size: 0.8rem; line-height: 1.5; text-align: center; }

@media (max-width: 899px) {
  .qt { padding-block: clamp(80px, 16vw, 120px) 60px; }
  .qt__pin { min-height: 0; padding-top: 0; }
  .qt__head { grid-template-columns: 1fr; }
  .qt__stage { max-width: none; padding-inline: 0; }
  .qt__panels {
    height: 430px;
    padding-inline: var(--gutter);
    overflow-x: auto;
    overscroll-behavior-x: contain;
    scroll-snap-type: x mandatory;
    scroll-padding-inline: var(--gutter);
    scrollbar-width: none;
  }
  .qt__panels::-webkit-scrollbar { display: none; }
  .qp { flex: 0 0 min(74vw, 300px); scroll-snap-align: start; }
  .qt__hint { padding-inline: var(--gutter); }
  .posters__row { grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px; }
  .poster__cap { right: 6px; bottom: 6px; left: 6px; padding: 5px 8px; font-size: 0.7rem; }
  .poster__cap .mono { display: none; }
}

@media (prefers-reduced-motion: reduce) {
  .petal { display: none; }
  .poster__card, .qp { transition: none; }
}
</style>

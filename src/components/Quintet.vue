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
        <div class="paper">
          <!-- Opening card, like the start of the reference video -->
          <p class="paper__title" aria-hidden="true">
            <span class="paper__mask"><span class="paper__line">The</span></span>
            <span class="paper__mask"><span class="paper__line">Quintessential</span></span>
            <span class="paper__mask"><span class="paper__line">Quintuplets</span></span>
          </p>

          <div class="word word--a" aria-hidden="true"><span v-for="(ch, i) in 'KISS'" :key="i">{{ ch }}</span></div>
          <div class="word word--b" aria-hidden="true"><span v-for="(ch, i) in 'LOVE'" :key="i">{{ ch }}</span></div>

          <ul class="wd-list">
            <li
              v-for="(idx, pos) in DISPLAY"
              :key="WEDDING[idx].src"
              class="wd"
              :class="{ 'is-active': active === idx }"
              :style="{ '--tone': TONES[idx] }"
            >
              <button
                type="button"
                class="wd__btn"
                :aria-pressed="locked === idx"
                :aria-label="`${sisters[idx].name} ${sisters[idx].kanji} — ${sisters[idx].order}`"
                @pointerenter="onEnter(idx, $event)"
                @focus="onFocus(idx, $event)"
                @click="onClick(idx)"
              >
                <span class="wd__img" aria-hidden="true">
                  <img :src="WEDDING[idx].src" alt="" :width="736" :height="WEDDING[idx].h" loading="lazy" decoding="async" draggable="false" />
                  <span class="wd__shade"></span>
                </span>
                <span class="wd__num mono" aria-hidden="true">0{{ idx + 1 }}</span>
                <span class="wd__kanji" lang="ja" aria-hidden="true">{{ sisters[idx].kanji }}</span>
                <span class="wd__label" aria-hidden="true">
                  <span class="wd__order mono">{{ sisters[idx].order }}</span>
                  <span class="wd__name">{{ sisters[idx].name }}</span>
                </span>
              </button>
            </li>
          </ul>

          <svg class="strokes" viewBox="0 0 1200 560" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
            <path v-for="s in STROKES" :key="s.color" class="stroke" :d="s.d" :stroke="s.color" :stroke-width="s.w" fill="none" stroke-linecap="round" />
          </svg>
        </div>
        <p class="qt__hint mono"><i class="fas fa-hand-pointer" aria-hidden="true"></i> {{ t.hint }}</p>
      </div>
    </div>

    <div class="container qt__lower">
      <div class="moments">
        <h3 class="moments__title mono">{{ t.momentsLabel }}</h3>
        <ul class="moments__row">
          <li v-for="(m, i) in MOMENTS" :key="m.src" class="moment" :style="{ '--r': m.r }">
            <div class="moment__float">
              <figure class="moment__card">
                <img :src="m.src" :alt="t.moments[i]" loading="lazy" decoding="async" draggable="false" :style="{ objectPosition: m.pos }" />
              </figure>
            </div>
          </li>
        </ul>
      </div>

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

// Index = birth order (Ichika, Nino, Miku, Yotsuba, Itsuki).
const TONES = ['#e9b8ff', '#ff7aa8', '#6ad0ff', '#ff9a5c', '#ff5a4a'];
const WEDDING = [
  { src: '/quintet/wedding-ichika.jpg', h: 920 },
  { src: '/quintet/wedding-nino.jpg', h: 1308 },
  { src: '/quintet/wedding-miku.jpg', h: 1308 },
  { src: '/quintet/wedding-yotsuba.jpg', h: 1308 },
  { src: '/quintet/wedding-itsuki.jpg', h: 1308 },
];
// Left → right, the same order the sisters appear in the reference video.
const DISPLAY = [1, 3, 2, 0, 4];

// Pastel brush strokes that sweep across the paper.
const STROKES = [
  { color: '#c4b2ff', w: 44, d: 'M-40 330C150 260 220 110 430 190S640 430 780 300' },
  { color: '#ffb27a', w: 40, d: 'M300 -20C430 140 350 300 520 380S800 520 1010 470' },
  { color: '#ff8fa3', w: 38, d: 'M-40 520C160 610 300 520 370 430' },
  { color: '#6ad0ff', w: 36, d: 'M830 -30C760 120 900 160 960 300S1080 520 1240 560' },
  { color: '#44b0ff', w: 32, d: 'M600 600C700 500 880 600 1000 470' },
  { color: '#9be8a8', w: 32, d: 'M1240 60C1060 70 980 180 860 150' },
];

const MOMENTS = [
  { src: '/quintet/moment-miku.webp', r: '-5deg', pos: '50% 30%' },
  { src: '/quintet/moment-nino-laugh.webp', r: '3deg', pos: '45% 35%' },
  { src: '/quintet/moment-itsuki-manga.jpg', r: '-2deg', pos: '50% 35%' },
  { src: '/quintet/moment-nino-blush.jpg', r: '5deg', pos: '50% 30%' },
  { src: '/quintet/moment-nino-profile.jpg', r: '-4deg', pos: '50% 40%' },
];

const root = ref(null);
const hovered = ref(-1);
const locked = ref(-1);
const active = computed(() => (locked.value >= 0 ? locked.value : hovered.value));

let lastApplied = null;

// Hover / focus / click: the chosen portrait lifts, its neighbours step aside, the rest dim.
const applyActive = () => {
  const el = root.value;
  if (!el) return;
  const idx = active.value;
  if (idx === lastApplied) return;
  lastApplied = idx;
  const duration = prefersReducedMotion() ? 0 : 0.7;
  const onPos = DISPLAY.indexOf(idx);
  el.querySelectorAll('.wd').forEach((li, pos) => {
    const on = pos === onPos;
    const side = onPos < 0 ? 0 : pos < onPos ? -1 : 1;
    gsap.to(li.querySelector('.wd__btn'), {
      x: on || onPos < 0 ? 0 : side * 22,
      y: on ? -14 : 0,
      scale: on ? 1.06 : 1,
      duration,
      ease: 'hz.out',
      overwrite: 'auto',
    });
    gsap.to(li.querySelector('.wd__img'), {
      filter: onPos < 0 || on ? 'brightness(1) saturate(1)' : 'brightness(0.62) saturate(0.8)',
      duration,
      overwrite: 'auto',
    });
  });
};

const onEnter = (i, event) => {
  if (event.pointerType === 'touch') return;
  hovered.value = i;
  applyActive();
};
const onFocus = (i, event) => {
  // Mouse clicks also focus the button; only keyboard focus should lift a portrait.
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

const HIDDEN = 'inset(0% 100% 0% 0%)';
const SHOWN = 'inset(0% 0% 0% 0%)';

useGsap(root, ({ root: el, mm }) => {
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

    /* ---- The five-portrait picker ---- */
    const items = gsap.utils.toArray('.wd', el); // left → right: Nino, Yotsuba, Miku, Ichika, Itsuki
    const decor = gsap.utils.toArray('.wd__label, .wd__num, .wd__kanji', el);
    const head = '.qt__head-main > *, .qt__sub';

    if (desktop) {
      const strokes = gsap.utils.toArray('.stroke', el);
      const kiss = gsap.utils.toArray('.word--a span', el);
      const love = gsap.utils.toArray('.word--b span', el);
      const arrive = (target, at) => tl.fromTo(target, { clipPath: HIDDEN, x: -90, autoAlpha: 0 }, { clipPath: SHOWN, x: 0, autoAlpha: 1, duration: 1 }, at);

      // Scroll-scrubbed while pinned, so the opening can't be outrun.
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: { trigger: '.qt__pin', start: 'top top', end: () => `+=${Math.round(window.innerHeight * 1.8)}`, pin: true, scrub: 0.3 },
      });
      tl.fromTo(head, { y: 60, autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger: 0.08, duration: 0.8 }, 0)
        .fromTo('.paper', { clipPath: 'inset(22% 34% 22% 34% round 999px)' }, { clipPath: 'inset(0% 0% 0% 0% round 36px)', duration: 1.1 }, 0)
        .fromTo('.paper__line', { yPercent: 115 }, { yPercent: 0, stagger: 0.18, duration: 0.7 }, 0.7)
        .fromTo(strokes, { drawSVG: '0% 0%' }, { drawSVG: '0% 100%', stagger: 0.16, duration: 1.4 }, 1.5)
        .to('.paper__title', { scale: 0.72, y: -30, autoAlpha: 0, duration: 0.9 }, 2.6)
        // K · I · S · S arrive with the first four portraits
        .fromTo(kiss, { y: -60, scale: 0.6, autoAlpha: 0 }, { y: 0, scale: 1, autoAlpha: 1, stagger: 0.7, duration: 0.5, ease: 'back.out(2)' }, 3.2);
      arrive(items[0], 3.0);
      arrive(items[1], 4.0);
      arrive(items[2], 5.0);
      arrive(items[3], 6.0);
      // KISS flips into LOVE, then the fifth portrait takes the corner
      tl.to(kiss, { scaleY: 0, autoAlpha: 0, stagger: 0.1, duration: 0.5 }, 7.4)
        .fromTo(love, { scaleY: 0, autoAlpha: 0 }, { scaleY: 1, autoAlpha: 1, stagger: 0.12, duration: 0.5, ease: 'back.out(2)' }, 7.9)
        .to(love, { y: 24, autoAlpha: 0, stagger: 0.08, duration: 0.4 }, 8.9);
      arrive(items[4], 9.0);
      // The brush strokes settle back so the portraits and names are easy to pick
      tl.to('.strokes', { opacity: 0.16, duration: 0.9 }, 9.9)
        .fromTo(decor, { y: 30, autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger: 0.03, duration: 0.6 }, 10.1)
        .fromTo('.qt__hint', { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.6 }, 10.5)
        .to({}, { duration: 0.6 });
    } else {
      gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: { trigger: '.qt__stage', start: 'top 96%', end: 'top 35%', scrub: 0.25 },
      })
        .fromTo(head, { y: 50, autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger: 0.08 }, 0)
        .fromTo(items, { y: 90, rotate: i => [-6, 5, -4, 6, -5][i % 5], autoAlpha: 0 }, { y: 0, rotate: 0, autoAlpha: 1, stagger: 0.12 }, 0.1)
        .fromTo('.qt__hint', { autoAlpha: 0 }, { autoAlpha: 1 }, 0.9);
    }

    /* ---- Moments: polaroids fan in, then drift at different speeds ---- */
    gsap.from('.moment', {
      y: 140,
      rotate: i => [-10, 8, -6, 10, -8][i % 5],
      autoAlpha: 0,
      stagger: 0.12,
      duration: 1.3,
      ease: 'expo.out',
      scrollTrigger: { trigger: '.moments', start: 'top 95%', once: true },
    });
    gsap.from('.moments__title', { y: 30, autoAlpha: 0, scrollTrigger: { trigger: '.moments', start: 'top 97%', once: true } });
    if (desktop) {
      gsap.utils.toArray('.moment__float', el).forEach((float, i) => {
        gsap.fromTo(float, { y: i % 2 ? 50 : -30 }, {
          y: i % 2 ? -50 : 30,
          ease: 'none',
          scrollTrigger: { trigger: float, start: 'top bottom', end: 'bottom top', scrub: true },
        });
      });
    }
    gsap.from('.qt__credit', { autoAlpha: 0, y: 20, scrollTrigger: { trigger: '.qt__credit', start: 'top 99%', once: true } });

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
  background: linear-gradient(135deg, #ffc2e2, #f48fc4);
  opacity: 0;
  will-change: transform;
}

.qt__pin { position: relative; display: flex; min-height: 100svh; flex-direction: column; justify-content: center; gap: clamp(18px, 3vh, 36px); padding-top: calc(var(--header-h) + 8px); padding-bottom: 20px; }

.qt__head { display: grid; grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr); align-items: end; gap: 20px clamp(24px, 5vw, 80px); }
.qt__eyebrow { color: var(--c-pink); }
.qt__title { margin-top: 12px; font-size: clamp(2.4rem, 5.2vw, 5rem); }
.qt__sub { max-width: 44ch; font-size: clamp(1.05rem, 1.35vw, 1.3rem); }

/* ---- The paper stage ---- */
.qt__stage { width: 100%; max-width: var(--max-width); margin-inline: auto; padding-inline: var(--gutter); }

.paper {
  position: relative;
  height: clamp(400px, 60vh, 600px);
  overflow: hidden;
  border-radius: 36px;
  color: #16171a;
  background:
    radial-gradient(60% 80% at 15% 10%, rgba(255, 255, 255, 0.9), transparent 70%),
    #fffdf6;
}

.paper__title {
  position: absolute;
  inset: 0;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-family: 'Palatino Linotype', Palatino, 'Book Antiqua', Georgia, serif;
  font-size: clamp(2rem, 6vw, 5.4rem);
  font-style: italic;
  font-weight: 600;
  line-height: 1.02;
  letter-spacing: -0.02em;
  text-align: center;
  pointer-events: none;
}
.paper__mask { display: block; overflow: clip; padding: 0.08em 0.1em; margin: -0.08em -0.1em; }
.paper__line { display: block; }

.word {
  position: absolute;
  top: 0;
  right: clamp(16px, 4vw, 64px);
  bottom: 0;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #e0306f;
  font-family: Georgia, 'Times New Roman', serif;
  font-size: clamp(2.4rem, 6.6vw, 6.4rem);
  font-weight: 700;
  line-height: 0.86;
  pointer-events: none;
}
.word span { display: block; opacity: 0; }

.wd-list { position: absolute; inset: 0; z-index: 3; display: flex; }
.wd { position: relative; flex: 1 1 0; min-width: 0; height: 100%; margin-left: -5.5%; }
.wd:first-child { margin-left: 0; }
.wd.is-active { z-index: 6; }

.wd__btn {
  position: absolute;
  inset: 0;
  display: block;
  width: 100%;
  height: 100%;
  padding: 0;
  border: 0;
  color: #fff1ea;
  text-align: left;
  background: none;
  cursor: pointer;
  will-change: transform;
}
.wd__btn:focus-visible { outline: 3px solid var(--tone); outline-offset: -8px; border-radius: 28px; }

.wd__img {
  position: absolute;
  inset: 0;
  display: block;
  -webkit-mask-image: linear-gradient(90deg, transparent 0, #000 17%, #000 83%, transparent 100%);
  mask-image: linear-gradient(90deg, transparent 0, #000 17%, #000 83%, transparent 100%);
}
.wd:first-child .wd__img { -webkit-mask-image: linear-gradient(90deg, #000 0, #000 83%, transparent 100%); mask-image: linear-gradient(90deg, #000 0, #000 83%, transparent 100%); }
.wd:last-child .wd__img { -webkit-mask-image: linear-gradient(90deg, transparent 0, #000 17%, #000 100%); mask-image: linear-gradient(90deg, transparent 0, #000 17%, #000 100%); }
.wd__img img { width: 100%; height: 100%; object-fit: cover; object-position: 50% 10%; user-select: none; -webkit-user-drag: none; }
.wd__shade { position: absolute; inset: 0; background: linear-gradient(180deg, transparent 55%, rgba(15, 11, 19, 0.72) 100%); }

.wd__num { position: absolute; top: 16px; left: 19%; font-weight: 700; text-shadow: 0 1px 8px rgba(0, 0, 0, 0.55); }
.wd__kanji { position: absolute; top: 14px; right: 17%; color: var(--tone); font-size: clamp(1.2rem, 1.9vw, 1.9rem); font-weight: 700; line-height: 1.1; letter-spacing: 0.05em; writing-mode: vertical-rl; text-shadow: 0 2px 10px rgba(0, 0, 0, 0.6); }
.wd__label { position: absolute; right: 16%; bottom: 18px; left: 19%; display: grid; gap: 2px; }
.wd__order { color: var(--tone); font-weight: 700; text-shadow: 0 1px 8px rgba(0, 0, 0, 0.65); }
.wd__name { overflow: hidden; font-size: clamp(1.3rem, 2.3vw, 2.3rem); font-weight: 600; line-height: 1; letter-spacing: -0.045em; text-overflow: ellipsis; white-space: nowrap; text-shadow: 0 2px 14px rgba(0, 0, 0, 0.6); }

.strokes { position: absolute; inset: 0; z-index: 4; width: 100%; height: 100%; opacity: 0.86; pointer-events: none; }

.qt__hint { margin-top: 16px; color: var(--c-cream-75); }
.qt__hint i { margin-right: 6px; color: var(--c-accent); }

/* ---- Moments ---- */
.qt__lower { position: relative; z-index: 1; margin-top: clamp(60px, 9vw, 140px); }
.moments__title { color: var(--c-cream-75); font-weight: 500; }
.moments__row { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: clamp(10px, 2vw, 28px); margin-top: 22px; padding-block: 36px; }
.moment__card {
  padding: 8px 8px 30px;
  border-radius: 12px;
  background: #fffdf6;
  box-shadow: 0 24px 50px rgba(0, 0, 0, 0.45);
  transform: rotate(var(--r));
  transition: transform 0.6s var(--ease-out), box-shadow 0.6s var(--ease-out);
}
.moment__card:hover { transform: rotate(0deg) translateY(-10px) scale(1.04); box-shadow: 0 34px 70px rgba(0, 0, 0, 0.55), 0 0 0 3px var(--c-pink); }
.moment__card img { display: block; width: 100%; aspect-ratio: 4 / 5; border-radius: 6px; object-fit: cover; user-select: none; -webkit-user-drag: none; }

.qt__credit { max-width: 80ch; margin: clamp(30px, 4vw, 56px) auto 0; color: var(--c-cream-50); font-size: 0.8rem; line-height: 1.5; text-align: center; }

@media (max-width: 899px) {
  .qt { padding-block: clamp(80px, 16vw, 120px) 60px; }
  .qt__pin { min-height: 0; padding-top: 0; }
  .qt__head { grid-template-columns: 1fr; }
  .qt__stage { max-width: none; padding-inline: 0; }

  .paper { height: auto; overflow: visible; border-radius: 0; background: none; }
  .paper__title, .word, .strokes { display: none; }

  .wd-list {
    position: static;
    height: 440px;
    gap: 12px;
    padding-inline: var(--gutter);
    overflow-x: auto;
    overscroll-behavior-x: contain;
    scroll-snap-type: x mandatory;
    scroll-padding-inline: var(--gutter);
    scrollbar-width: none;
  }
  .wd-list::-webkit-scrollbar { display: none; }
  .wd { flex: 0 0 min(74vw, 300px); margin-left: 0; overflow: hidden; border-radius: 28px; scroll-snap-align: start; }
  .wd__img { -webkit-mask-image: none !important; mask-image: none !important; border-radius: inherit; }
  .wd__num { left: 18px; }
  .wd__kanji { right: 16px; }
  .wd__label { right: 16px; left: 18px; }
  .qt__hint { padding-inline: var(--gutter); }

  .moments__row { display: flex; gap: 14px; overflow-x: auto; padding-inline: 4px; scroll-snap-type: x mandatory; scrollbar-width: none; }
  .moments__row::-webkit-scrollbar { display: none; }
  .moment { flex: 0 0 min(52vw, 220px); scroll-snap-align: start; }
}

@media (prefers-reduced-motion: reduce) {
  .petal, .paper__title, .word, .strokes { display: none; }
  .moment__card, .wd__btn { transition: none; }
}
</style>

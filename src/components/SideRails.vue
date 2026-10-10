<template>
  <div ref="root" class="rails" aria-hidden="true">
    <!-- Left: a slow vertical ticker whose speed follows your scrolling -->
    <div class="rail rail--left">
      <div class="ticker">
        <div v-for="copy in 2" :key="copy" class="ticker__seq">
          <span v-for="(word, i) in WORDS" :key="`${copy}-${i}`" class="ticker__item">{{ word }}<i>✦</i></span>
        </div>
      </div>
    </div>

    <!-- Right: reading progress, current section and a star that spins with scroll speed -->
    <div class="rail rail--right">
      <span class="rail__index mono"><b>{{ String(index + 1).padStart(2, '0') }}</b> / {{ String(SECTIONS.length).padStart(2, '0') }}</span>
      <span class="rail__track"><span class="rail__fill"></span><span class="rail__dot"></span></span>
      <span class="rail__name mono">{{ label }}</span>
      <span class="rail__star"><Shape name="star" palette="orange" :shine="false" /></span>
    </div>
  </div>
</template>

<script setup>
import { computed, inject, onMounted, onUnmounted, ref } from 'vue';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { useGsap, MEDIA } from '@/composables/useGsap';
import Shape from './ui/Shape.vue';

const lang = inject('lang');
const translations = inject('translations');
const nav = computed(() => translations[lang.value].navbar);

const WORDS = ['HEIZNERD', 'FRONTEND', 'VUE.JS', 'NODE', 'ROM-COM', 'GSAP', 'MADE IN VIETNAM'];
const SECTIONS = [
  { id: 'home', key: 'home' },
  { id: 'about', key: 'about' },
  { id: 'romcom', label: 'Rom-com' },
  { id: 'skills', key: 'skills' },
  { id: 'timeline', key: 'timeline' },
  { id: 'projects', key: 'projects' },
  { id: 'contact', key: 'contact' },
];

const root = ref(null);
const index = ref(0);
const label = computed(() => {
  const s = SECTIONS[index.value];
  return s.label || nav.value[s.key];
});

let raf = 0;
const update = () => {
  raf = 0;
  const probe = window.innerHeight * 0.5;
  let current = 0;
  SECTIONS.forEach((s, i) => {
    const el = document.getElementById(s.id);
    if (el && el.getBoundingClientRect().top <= probe) current = i;
  });
  index.value = current;
};
const request = () => { if (!raf) raf = requestAnimationFrame(update); };

onMounted(() => { window.addEventListener('scroll', request, { passive: true }); update(); });
onUnmounted(() => { cancelAnimationFrame(raf); window.removeEventListener('scroll', request); });

useGsap(root, ({ root: el, mm }) => {
  mm.add(MEDIA, context => {
    if (!context.conditions.motion) return;

    const ticker = gsap.to('.ticker', { yPercent: -50, duration: 38, ease: 'none', repeat: -1 });

    gsap.fromTo('.rail__fill', { scaleY: 0 }, { scaleY: 1, ease: 'none', transformOrigin: 'top', scrollTrigger: { start: 0, end: 'max', scrub: 0.2 } });
    gsap.fromTo('.rail__dot', { top: '0%' }, { top: '100%', ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.2 } });

    // Velocity drives the ticker speed (and direction) plus the star's spin.
    const spin = gsap.to('.rail__star', { rotate: 360, duration: 8, ease: 'none', repeat: -1 });
    ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: self => {
        const v = self.getVelocity();
        const boost = gsap.utils.clamp(-6, 6, v / 400);
        gsap.to([ticker, spin], { timeScale: 1 + boost, duration: 0.2, overwrite: true });
        gsap.to([ticker, spin], { timeScale: 1, duration: 1.1, delay: 0.2, ease: 'power2.out' });
      },
    });

    gsap.from('.rail', { autoAlpha: 0, x: i => (i ? 30 : -30), duration: 1.2, stagger: 0.15, delay: 0.4 });
  });
});
</script>

<style scoped>
.rails { position: fixed; z-index: 5; inset: 0; pointer-events: none; }

.rail { position: absolute; top: 0; bottom: 0; display: none; width: 34px; align-items: center; justify-content: center; }
.rail--left { left: 8px; }
.rail--right { right: 8px; flex-direction: column; gap: 14px; padding-block: 18vh; }

.ticker { display: flex; flex-direction: column; height: max-content; }
.ticker__seq { display: flex; flex-direction: column; align-items: center; }
.rail--left { overflow: hidden; -webkit-mask-image: linear-gradient(180deg, transparent, #000 18%, #000 82%, transparent); mask-image: linear-gradient(180deg, transparent, #000 18%, #000 82%, transparent); }
.ticker__item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding-block: 14px;
  color: var(--c-cream-50);
  font-family: var(--font-mono);
  font-size: 0.7rem;
  letter-spacing: 0.22em;
  white-space: nowrap;
  writing-mode: vertical-rl;
  transform: rotate(180deg);
}
.ticker__item i { color: var(--c-accent); font-style: normal; }

.rail__index { writing-mode: vertical-rl; color: var(--c-cream-75); font-size: 0.7rem; }
.rail__index b { color: var(--c-cream); font-weight: 700; }
.rail__track { position: relative; flex: 1; width: 2px; min-height: 80px; border-radius: 2px; background: var(--c-line); }
.rail__fill { position: absolute; inset: 0; border-radius: inherit; background: var(--g-accent); transform: scaleY(0); transform-origin: top; }
.rail__dot { position: absolute; left: 50%; top: 0; width: 10px; height: 10px; margin: -5px 0 0 -5px; border-radius: 50%; background: var(--c-accent); box-shadow: 0 0 0 5px rgba(255, 92, 147, 0.2); }
.rail__name { writing-mode: vertical-rl; color: var(--c-cream-75); font-size: 0.7rem; letter-spacing: 0.18em; text-transform: uppercase; }
.rail__star { width: 22px; }

@media (min-width: 1240px) and (pointer: fine) {
  .rail { display: flex; }
}
@media (prefers-reduced-motion: reduce) {
  .rail--left { display: none; }
}
</style>

<template>
  <section ref="root" class="tm" aria-labelledby="tm-title">
    <div class="container tm__head">
      <BraceLabel id="tm-title" tag="h2" size="sm">{{ s.marqueeLabel }}</BraceLabel>
      <span class="mono tm__hint" aria-hidden="true">scroll ↕ speed</span>
    </div>
    <ul class="sr-only">
      <li v-for="tech in allTech" :key="tech.name">{{ tech.name }}</li>
    </ul>

    <div v-for="(lane, laneIndex) in lanes" :key="laneIndex" class="tm__lane" :class="`tm__lane--${laneIndex + 1}`" aria-hidden="true">
      <div class="tm__track">
        <div v-for="copy in 2" :key="copy" class="tm__seq">
          <span v-for="tech in lane" :key="`${copy}-${tech.name}`" class="tm__item" :style="{ '--tone': tech.color }">
            <span class="tm__icon"><i v-if="tech.icon" :class="tech.icon"></i><b v-else>{{ tech.mark }}</b></span>
            <span class="tm__name">{{ tech.name }}</span>
          </span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, inject, ref } from 'vue';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { useGsap, MEDIA } from '@/composables/useGsap';
import BraceLabel from './ui/BraceLabel.vue';

const lang = inject('lang');
const translations = inject('translations');
const s = computed(() => translations[lang.value].skills);

const tech = (name, icon, mark, color) => ({ name, icon, mark, color });
const lanes = [
  [
    tech('Vue', 'fab fa-vuejs', '', '#42b883'),
    tech('Vite', '', 'V', '#a987e8'),
    tech('ReactJS', 'fab fa-react', '', '#61dafb'),
    tech('NuxtJS', '', 'N', '#65c99a'),
    tech('TypeScript', '', 'TS', '#5995d4'),
    tech('JavaScript', 'fab fa-js', '', '#e7d052'),
    tech('HTML5', 'fab fa-html5', '', '#e47758'),
    tech('CSS3', 'fab fa-css3-alt', '', '#5b9ee8'),
    tech('C++', '', 'C++', '#7d91cc'),
  ],
  [
    tech('NodeJS', 'fab fa-node-js', '', '#68a063'),
    tech('Fastify', '', 'F', '#c8b7df'),
    tech('ExpressJS', '', 'Ex', '#b5aec2'),
    tech('Ruby on Rails', 'fas fa-gem', '', '#c96875'),
    tech('Rust', 'fab fa-rust', '', '#d09972'),
    tech('Java', 'fab fa-java', '', '#d58464'),
    tech('MySQL', 'fas fa-database', '', '#72a6cb'),
    tech('SQLite', '', 'SQ', '#7eb2c8'),
    tech('PostgreSQL', '', 'PG', '#668fbf'),
    tech('Redis', '', 'R', '#d06666'),
    tech('Git', 'fab fa-git-alt', '', '#e17859'),
    tech('GitHub', 'fab fa-github', '', '#d4cedc'),
    tech('Linux', 'fab fa-linux', '', '#e1c263'),
    tech('WSL', '', '>_', '#9b8fb1'),
  ],
];
const allTech = lanes.flat();

const root = ref(null);

useGsap(root, ({ root: el, mm }) => {
  mm.add(MEDIA, context => {
    const { motion, fine } = context.conditions;
    if (!motion) return;

    const loops = gsap.utils.toArray('.tm__track', el).map((track, i) => {
      const dir = i % 2 === 0 ? -1 : 1;
      const tween = gsap.fromTo(track, { xPercent: dir === -1 ? 0 : -50 }, {
        xPercent: dir === -1 ? -50 : 0,
        duration: 42 + i * 10,
        ease: 'none',
        repeat: -1,
      });
      // Start deep into the repeats so a negative timeScale (scrolling up) never hits time 0.
      tween.totalTime(tween.duration() * 1000);
      return tween;
    });

    // Scroll velocity speeds the lanes up and flips direction with the scroll.
    let base = 1;
    ScrollTrigger.create({
      trigger: el,
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: self => {
        const velocity = self.getVelocity();
        const sign = self.direction === 1 ? 1 : -1;
        if (sign !== Math.sign(base)) base = sign;
        const boost = gsap.utils.clamp(1, 7, 1 + Math.abs(velocity) / 260);
        loops.forEach(loop => {
          gsap.to(loop, { timeScale: base * boost, duration: 0.15, overwrite: true });
          gsap.to(loop, { timeScale: base, duration: 1.4, delay: 0.15, ease: 'power2.out' });
        });
      },
    });

    gsap.from('.tm__lane', {
      xPercent: i => (i % 2 === 0 ? 12 : -12),
      autoAlpha: 0,
      duration: 1.4,
      stagger: 0.15,
      scrollTrigger: { trigger: el, start: 'top 85%', once: true },
    });

    if (!fine) return undefined;
    const cleanups = gsap.utils.toArray('.tm__lane', el).map((lane, i) => {
      const enter = () => gsap.to(loops[i], { timeScale: base * 0.2, duration: 0.6, overwrite: true });
      const leave = () => gsap.to(loops[i], { timeScale: base, duration: 0.8, overwrite: true });
      lane.addEventListener('pointerenter', enter);
      lane.addEventListener('pointerleave', leave);
      return () => {
        lane.removeEventListener('pointerenter', enter);
        lane.removeEventListener('pointerleave', leave);
      };
    });
    return () => cleanups.forEach(fn => fn());
  });
});
</script>

<style scoped>
.tm { position: relative; padding-block: clamp(60px, 8vw, 120px); overflow: hidden; }
.tm__head { display: flex; align-items: center; justify-content: space-between; gap: 16px; margin-bottom: clamp(24px, 3vw, 40px); }
.tm__hint { color: var(--c-cream-75); }

.tm__lane { overflow: hidden; border-top: 1px solid var(--c-line); }
.tm__lane:last-child { border-bottom: 1px solid var(--c-line); }
.tm__track { display: flex; width: max-content; will-change: transform; }
.tm__seq { display: flex; flex: 0 0 auto; }

.tm__item {
  display: inline-flex;
  align-items: center;
  gap: 0.28em;
  padding: 0.16em 0.5em;
  font-size: clamp(2.6rem, 7.4vw, 7.2rem);
  font-weight: 500;
  line-height: 1.1;
  letter-spacing: -0.05em;
  white-space: nowrap;
}

.tm__lane--2 .tm__name {
  color: transparent;
  -webkit-text-stroke: 1.5px var(--c-cream);
  transition: color 0.35s var(--ease-out);
}
.tm__lane--2 .tm__item:hover .tm__name { color: var(--tone); -webkit-text-stroke-color: var(--tone); }
.tm__lane--1 .tm__item:hover .tm__name { color: var(--tone); }

.tm__icon {
  display: inline-grid;
  width: 0.78em;
  height: 0.78em;
  place-items: center;
  border-radius: 50%;
  color: var(--c-bg);
  background: var(--tone);
  font-size: 0.75em;
}
.tm__icon i { font-size: 0.48em; }
.tm__icon b { font-family: var(--font-mono); font-size: 0.32em; letter-spacing: -0.04em; }

@media (prefers-reduced-motion: reduce) {
  .tm__track { width: auto; }
  .tm__seq { flex-wrap: wrap; justify-content: center; }
  .tm__seq + .tm__seq { display: none; }
  .tm__item { font-size: clamp(1.6rem, 4vw, 3rem); }
}
</style>

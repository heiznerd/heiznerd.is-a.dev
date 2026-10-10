<template>
  <section id="skills" ref="root" class="stack section" aria-labelledby="stack-title">
    <MarginShapes preset="skills" />
    <div class="container">
      <!-- Intro: stacked role labels + playful composition -->
      <div class="stack__intro">
        <div class="stack__intro-copy">
          <span class="mono stack__eyebrow">02 — {{ t.stackLabel }}</span>
          <ul class="roles" :aria-label="s.rolesLabel">
            <li v-for="(role, i) in heroT.roles" :key="role" class="roles__item" :style="{ '--mark': roleColors[i % roleColors.length], '--shift': `${i * 1.1}em` }">
              <span class="mark-box roles__box">{{ role }}</span>
            </li>
          </ul>
          <p class="stack__desc lead">{{ t.stackDescription }}</p>
        </div>

        <div class="compo" aria-hidden="true">
          <span class="compo__dome"><Shape name="dome" palette="emerald" :angle="200" /></span>
          <span class="compo__flower"><Shape name="flower" palette="candy" :angle="200" /></span>
          <span class="compo__ring"><Shape name="ring" palette="summer" :angle="45" /></span>
          <span class="compo__hourglass"><Shape name="hourglass" palette="lilac" /></span>
          <span class="compo__diamond"><Shape name="diamond" palette="orange" /></span>
        </div>
      </div>

      <!-- Category rows -->
      <header class="stack__head">
        <BraceLabel size="sm">{{ s.headerSubtitle || s.title }}</BraceLabel>
        <h2 id="stack-title" class="section-title stack__title">{{ t.stackTitle }}</h2>
      </header>

      <ol class="rows">
        <li v-for="(cat, index) in categories" :key="cat.key" class="row" :style="{ '--tone': cat.color }">
          <div class="row__art" aria-hidden="true">
            <svg class="row__svg" viewBox="0 0 100 100" overflow="visible">
              <defs>
                <linearGradient :id="`row-grad-${cat.key}`" x1="10" y1="0" x2="90" y2="100" gradientUnits="userSpaceOnUse">
                  <stop offset="0" :stop-color="cat.gradient[0]" />
                  <stop offset="1" :stop-color="cat.gradient[1]" />
                </linearGradient>
              </defs>
              <path class="row__path" :d="SHAPES[cat.shape].d" :fill="`url(#row-grad-${cat.key})`" />
            </svg>
          </div>
          <div class="row__body">
            <div class="row__top">
              <h3 class="row__name">{{ cat.label }}</h3>
              <span class="row__count mono">{{ String(index + 1).padStart(2, '0') }} / {{ String(cat.items.length).padStart(2, '0') }}</span>
            </div>
            <ul class="row__items" :aria-label="`${s.itemsLabel}: ${cat.label}`">
              <li v-for="item in cat.items" :key="item.name" class="row__item">
                <i :class="item.icon" aria-hidden="true"></i>
                <span>{{ item.name }}</span>
              </li>
            </ul>
          </div>
        </li>
      </ol>

      <!-- Experience -->
      <div class="exp">
        <header class="exp__head">
          <h3 class="exp__title">{{ t.experienceTitle }}</h3>
          <p class="muted">{{ t.experienceSubtitle }}</p>
        </header>
        <ol class="exp__list">
          <li v-for="(item, i) in t.experience" :key="item.years" class="exp__item" :style="{ '--grad': expGrads[i % expGrads.length] }">
            <span class="exp__line" aria-hidden="true"></span>
            <span class="mono exp__index">0{{ i + 1 }}</span>
            <strong class="exp__years">{{ item.years }}</strong>
            <p class="exp__desc">{{ item.description }}</p>
          </li>
        </ol>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, inject, ref } from 'vue';
import { gsap, revealTitle } from '@/lib/gsap';
import { useGsap, MEDIA } from '@/composables/useGsap';
import { useGate } from '@/composables/useGate';
import MarginShapes from './ui/MarginShapes.vue';
import Shape from './ui/Shape.vue';
import BraceLabel from './ui/BraceLabel.vue';
import { SHAPES } from './ui/shapes.js';

const lang = inject('lang');
const translations = inject('translations');
const t = computed(() => translations[lang.value].about);
const s = computed(() => translations[lang.value].skills);
const heroT = computed(() => translations[lang.value].hero);

const root = ref(null);
useGate(root, { target: '.stack__intro' });
const roleColors = ['#ffc2e2', '#ff9a5c', '#a78bff'];
const expGrads = [
  'linear-gradient(120deg, #ff5c93, #ffb27a)',
  'linear-gradient(120deg, #ffc2e2, #ff3d8b)',
  'linear-gradient(120deg, #cdeeff, #6ad0ff)',
];

const icon = (name, iconClass) => ({ name, icon: iconClass });
const categories = computed(() => [
  {
    key: 'frontend', label: t.value.categories.frontend, color: '#ffc2e2', shape: 'flower', gradient: ['#ffc2e2', '#ff3d8b'],
    items: [icon('Vue', 'fab fa-vuejs'), icon('Vite', 'fas fa-bolt'), icon('CSS3', 'fab fa-css3-alt'), icon('HTML5', 'fab fa-html5'), icon('NuxtJS', 'fab fa-vuejs'), icon('ReactJS', 'fab fa-react')],
  },
  {
    key: 'backend', label: t.value.categories.backend, color: '#ff9a5c', shape: 'arch', gradient: ['#ffd6bd', '#ff9a5c'],
    items: [icon('NodeJS', 'fab fa-node-js'), icon('Fastify', 'fas fa-gauge-high'), icon('ExpressJS', 'fas fa-code-branch'), icon('Ruby on Rails', 'fas fa-gem'), icon('Rust', 'fab fa-rust'), icon('Java', 'fab fa-java')],
  },
  {
    key: 'database', label: t.value.categories.database, color: '#a78bff', shape: 'hourglass', gradient: ['#ece0ff', '#8a5cff'],
    items: [icon('MySQL', 'fas fa-database'), icon('SQLite', 'fas fa-table'), icon('PostgreSQL', 'fas fa-database'), icon('Redis', 'fas fa-layer-group')],
  },
  {
    key: 'devops', label: t.value.categories.devops, color: '#6ad0ff', shape: 'diamond', gradient: ['#cdeeff', '#6ad0ff'],
    items: [icon('Git', 'fab fa-git-alt'), icon('GitHub', 'fab fa-github'), icon('Linux', 'fab fa-linux'), icon('WSL', 'fas fa-terminal')],
  },
  {
    key: 'experimental', label: t.value.categories.experimental, color: '#ff5c93', shape: 'star', gradient: ['#ffb27a', '#ff5c93'],
    items: [icon('JavaScript', 'fab fa-js'), icon('Vue', 'fab fa-vuejs'), icon('TypeScript', 'fas fa-code'), icon('C++', 'fas fa-microchip')],
  },
]);

useGsap(root, ({ root: el, mm }) => {
  mm.add(MEDIA, context => {
    if (!context.conditions.motion) return;

    /* Intro: label boxes swing in like stickers */
    gsap.timeline({ scrollTrigger: { trigger: '.stack__intro', start: 'top 92%', once: true } })
      .from('.roles__box', { xPercent: -40, yPercent: 60, rotate: i => [-10, 7, -5][i] || 0, autoAlpha: 0, duration: 1, stagger: 0.14, ease: 'back.out(1.6)' })
      .from('.stack__eyebrow, .stack__desc', { y: 40, autoAlpha: 0, duration: 1, stagger: 0.1 }, 0.2);

    /* Composition builds itself, then parallaxes */
    gsap.timeline({ scrollTrigger: { trigger: '.compo', start: 'top 94%', once: true } })
      .from('.compo__dome', { scaleY: 0, transformOrigin: '50% 100%', duration: 1.1, ease: 'expo.out' })
      .from('.compo__flower', { y: -360, rotate: -120, duration: 1.3, ease: 'bounce.out' }, 0.3)
      .from('.compo__ring, .compo__hourglass, .compo__diamond', { scale: 0, rotate: -160, duration: 1, stagger: 0.1, ease: 'back.out(2.4)' }, 0.5);
    gsap.to('.compo__flower .shape', { rotate: 360, duration: 12, ease: 'none', repeat: -1 });
    gsap.timeline({ scrollTrigger: { trigger: '.compo', start: 'top bottom', end: 'bottom top', scrub: 1 } })
      .to('.compo__ring', { y: -120, rotate: 140, ease: 'none' }, 0)
      .to('.compo__hourglass', { y: -60, rotate: -90, ease: 'none' }, 0)
      .to('.compo__diamond', { y: -180, rotate: 220, ease: 'none' }, 0);

    /* Section title */
    revealTitle(el.querySelector('.stack__title'), '.stack__head');

    /* Rows: hairline grows, shape morphs circle → category shape while scrolling */
    gsap.utils.toArray('.row', el).forEach(row => {
      const path = row.querySelector('.row__path');
      gsap.timeline({ scrollTrigger: { trigger: row, start: 'top 95%', end: 'center 45%', scrub: 0.3 } })
        .from(path, { morphSVG: SHAPES.circle.d, ease: 'none' }, 0)
        .fromTo(row.querySelector('.row__svg'), { rotate: -90, scale: 0.7 }, { rotate: 0, scale: 1, ease: 'none' }, 0);
      gsap.timeline({ scrollTrigger: { trigger: row, start: 'top 95%', once: true } })
        .from(row, { '--line': 0, duration: 1.2, ease: 'expo.out' })
        .from(row.querySelector('.row__name'), { y: 50, autoAlpha: 0, duration: 0.9 }, 0.1)
        .from(row.querySelectorAll('.row__item'), { y: 40, autoAlpha: 0, duration: 0.8, stagger: 0.05 }, 0.2);
    });

    /* Experience */
    gsap.from('.exp__head > *', { y: 40, autoAlpha: 0, stagger: 0.1, scrollTrigger: { trigger: '.exp', start: 'top 95%', once: true } });
    gsap.utils.toArray('.exp__item', el).forEach((item, i) => {
      gsap.timeline({ scrollTrigger: { trigger: item, start: 'top 97%', once: true }, delay: i * 0.12 })
        .from(item.querySelector('.exp__line'), { scaleX: 0, transformOrigin: 'left', duration: 1.2, ease: 'expo.out' })
        .from(item.querySelectorAll('.exp__index, .exp__years, .exp__desc'), { y: 50, autoAlpha: 0, stagger: 0.08, duration: 1 }, 0.1);
    });
  });
});
</script>

<style scoped>
/* Intro */
.stack__intro {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  align-items: center;
  gap: clamp(40px, 6vw, 100px);
}
.stack__eyebrow { color: var(--c-accent); }
.roles { display: grid; gap: 0.2em; margin-top: 28px; font-size: clamp(2rem, 4.2vw, 4.2rem); font-weight: 500; line-height: 1.05; letter-spacing: -0.04em; }
.roles__item { padding-left: var(--shift); }
.roles__box { box-shadow: 0 0.12em 0 rgba(0, 0, 0, 0.35); }
.stack__desc { max-width: 30ch; margin-top: 34px; color: var(--c-cream); font-size: clamp(1.3rem, 2.2vw, 2rem); line-height: 1.25; }

.compo { position: relative; aspect-ratio: 1 / 0.9; }
.compo > span { position: absolute; display: block; }
.compo__dome { left: 12%; right: 4%; bottom: 0; }
.compo__flower { left: 38%; bottom: 38%; width: 36%; }
.compo__ring { left: 0; top: 10%; width: 22%; }
.compo__hourglass { left: 4%; bottom: 14%; width: 11%; }
.compo__diamond { right: 2%; top: 6%; width: 9%; }

/* Rows */
.stack__head { margin-top: clamp(120px, 14vw, 220px); }
.stack__title { margin-top: 18px; }
.rows { margin-top: clamp(40px, 6vw, 80px); }
.row {
  --line: 1;
  position: relative;
  display: grid;
  grid-template-columns: clamp(110px, 18vw, 280px) minmax(0, 1fr);
  gap: clamp(24px, 5vw, 90px);
  padding-block: clamp(36px, 5vw, 64px);
}
.row::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 1px;
  background: var(--c-line);
  transform: scaleX(var(--line));
  transform-origin: left;
}
.row__art { align-self: center; }
.row__svg { width: 100%; height: auto; overflow: visible; }
.row__top { display: flex; align-items: baseline; justify-content: space-between; gap: 16px; }
.row__name { color: var(--tone); font-size: clamp(1.8rem, 3.2vw, 3rem); font-weight: 600; letter-spacing: -0.04em; }
.row__count { color: var(--c-cream-75); }
.row__items {
  display: flex;
  flex-wrap: wrap;
  gap: 0.1em 0.7em;
  margin-top: 18px;
  font-size: clamp(1.6rem, 3.4vw, 3.3rem);
  font-weight: 400;
  line-height: 1.12;
  letter-spacing: -0.04em;
}
.row__item { display: inline-flex; align-items: center; gap: 0.3em; transition: color 0.3s var(--ease-out); }
.row__item i { color: var(--tone); font-size: 0.5em; transition: transform 0.4s var(--ease-out); }
.row__item:hover i { transform: rotate(-14deg) scale(1.25); }

/* Experience */
.exp { margin-top: clamp(100px, 12vw, 180px); }
.exp__head { display: flex; flex-wrap: wrap; align-items: baseline; justify-content: space-between; gap: 12px 32px; }
.exp__title { font-size: var(--fs-h3); }
.exp__head p { max-width: 42ch; }
.exp__list { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: clamp(20px, 3vw, 48px); margin-top: clamp(36px, 5vw, 64px); }
.exp__item { position: relative; padding-top: 28px; }
.exp__line { position: absolute; top: 0; left: 0; right: 0; height: 2px; background: var(--grad); }
.exp__index { color: var(--c-cream-75); }
.exp__years {
  display: block;
  margin-top: 18px;
  background: var(--grad);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  font-size: clamp(3.2rem, 6vw, 6rem);
  font-weight: 500;
  line-height: 1;
  letter-spacing: -0.055em;
  padding-bottom: 0.08em;
}
.exp__desc { margin-top: 14px; color: var(--c-cream-75); font-size: 1.1rem; line-height: 1.5; }

@media (max-width: 899px) {
  .stack__intro { grid-template-columns: 1fr; }
  .compo { width: min(100%, 460px); margin-inline: auto; }
  .row { grid-template-columns: 76px minmax(0, 1fr); gap: 20px; }
  .row__art { align-self: start; padding-top: 6px; }
  .exp__list { grid-template-columns: 1fr; }
}
</style>

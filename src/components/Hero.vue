<template>
  <section id="home" ref="root" class="hero">
    <div class="hero__inner container">
      <div class="hero__top" data-hero-fade>
        <p class="hero__greeting">
          <span class="hero__prompt" aria-hidden="true">&gt;</span>
          <span>{{ t.greeting }}</span>
          <span ref="roleEl" class="hero__role">{{ t.roles[0] }}</span><span class="hero__caret" aria-hidden="true">_</span>
          <span class="sr-only">{{ t.roles.join(', ') }}</span>
        </p>
        <p class="hero__status">
          <span class="hero__status-dot" aria-hidden="true"></span>
          {{ t.available }}
        </p>
      </div>

      <h1 class="hero__title" aria-label="Heiznerd">
        <span class="hero__line hero__line--1" aria-hidden="true">
          <span class="hero__char-wrap"><span class="hero__mask"><span class="hero__char">H</span></span></span>
          <span class="hero__char-wrap"><span class="hero__mask"><span class="hero__char">e</span></span></span>
          <span class="hero__char-wrap hero__char-wrap--i">
            <span class="hero__mask"><span class="hero__char">ı</span></span>
            <span class="hero__tittle"><Shape name="circle" palette="violet" :angle="200" /></span>
          </span>
          <span class="hero__char-wrap"><span class="hero__mask"><span class="hero__char">z</span></span></span>
        </span>
        <span class="hero__line hero__line--2" aria-hidden="true">
          <span class="hero__char-wrap"><span class="hero__mask"><span class="hero__char">n</span></span></span>
          <span class="hero__char-wrap"><span class="hero__mask"><span class="hero__char">e</span></span></span>
          <span class="hero__char-wrap"><span class="hero__mask"><span class="hero__char">r</span></span></span>
          <span class="hero__char-wrap"><span class="hero__mask"><span class="hero__char">d</span></span></span>
          <span class="hero__char-wrap hero__char-wrap--dot">
            <span class="hero__period"><Shape name="square" palette="green" :angle="160" /></span>
          </span>
        </span>

        <span
          v-for="shape in shapes"
          :key="shape.key"
          class="hero__shape"
          :class="`hero__shape--${shape.key}`"
          :data-depth="shape.depth"
          aria-hidden="true"
        >
          <span class="hero__shape-mouse"><Shape class="hero__shape-svg" :name="shape.name" :palette="shape.palette" :angle="shape.angle" /></span>
        </span>
      </h1>

      <div class="hero__bottom" data-hero-fade>
        <BraceLabel size="lg" class="hero__desc"><span>{{ t.description }}</span></BraceLabel>
        <div class="hero__ctas">
          <a v-magnetic="0.25" href="#projects" class="pill pill--lg pill--glow" data-cursor="↓">
            <span>{{ t.viewWork }}</span>
            <span class="pill__icon"><i class="fas fa-arrow-down" aria-hidden="true"></i></span>
          </a>
          <a v-magnetic="0.25" href="#contact" class="pill pill--lg">{{ t.contact }}</a>
        </div>
      </div>

      <div class="hero__meta" data-hero-fade>
        <nav class="hero__socials" :aria-label="t.socials">
          <a v-for="s in socials" :key="s.label" v-magnetic="0.4" :href="s.href" target="_blank" rel="noopener noreferrer" class="icon-btn" :aria-label="s.label">
            <i :class="s.icon" aria-hidden="true"></i>
          </a>
        </nav>
        <a href="#about" class="hero__scroll">
          <span>{{ t.scroll }}</span>
          <span class="hero__scroll-track" aria-hidden="true"><span class="hero__scroll-thumb"></span></span>
        </a>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, inject, ref, watch } from 'vue';
import { gsap } from '@/lib/gsap';
import { useGsap, MEDIA } from '@/composables/useGsap';
import Shape from './ui/Shape.vue';
import BraceLabel from './ui/BraceLabel.vue';

const lang = inject('lang');
const translations = inject('translations');
const introDone = inject('introDone', ref(true));
const t = computed(() => translations[lang.value].hero);

const root = ref(null);
const roleEl = ref(null);

const shapes = [
  { key: 'star', name: 'star', palette: 'orange', angle: 140, depth: 1.4 },
  { key: 'pill', name: 'pill', palette: 'green', angle: 120, depth: 0.8 },
  { key: 'ring', name: 'ring', palette: 'summer', angle: 60, depth: 1.1 },
  { key: 'flower', name: 'flower', palette: 'candy', angle: 170, depth: 0.6 },
  { key: 'squiggle', name: 'squiggle', palette: 'violet', angle: 90, depth: 1.8 },
];

const socials = [
  { label: 'GitHub', icon: 'fab fa-github', href: 'https://github.com/heiznerd' },
  { label: 'Discord', icon: 'fab fa-discord', href: 'https://discord.com/users/1316287191634149377' },
  { label: 'Facebook', icon: 'fab fa-facebook-f', href: 'https://www.facebook.com/nguyen.huu.quy.906170' },
];

let introTl;

useGsap(root, ({ root: el, mm }) => {
  mm.add(MEDIA, context => {
    const { motion, fine } = context.conditions;
    if (!motion) return; // reduced motion: everything stays static and visible

    const chars = gsap.utils.toArray('.hero__char', el);
    const shapeSvgs = gsap.utils.toArray('.hero__shape-svg', el);
    const squiggle = el.querySelector('.hero__shape--squiggle .shape-path');
    const squiggleShine = el.querySelector('.hero__shape--squiggle .shape-shine');

    /* ---- Intro (paused until the curtain lifts) ---- */
    introTl = gsap.timeline({ paused: true, defaults: { ease: 'expo.out' } })
      .from(chars, { yPercent: 115, rotate: 8, duration: 0.95, stagger: 0.045 })
      .from('.hero__tittle', { y: () => -window.innerHeight * 0.6, duration: 0.9, ease: 'bounce.out' }, 0.3)
      .from('.hero__period', { scale: 0, rotate: -180, duration: 0.9, ease: 'elastic.out(1, 0.45)' }, 0.5)
      .from(shapeSvgs, { scale: 0, rotate: () => gsap.utils.random(-140, 140), duration: 1.1, stagger: 0.08, ease: 'back.out(1.8)' }, 0.35)
      .from([squiggle, squiggleShine], { drawSVG: '0%', duration: 1.3, ease: 'power3.inOut' }, 0.6)
      .from('[data-hero-fade]', { y: 40, autoAlpha: 0, duration: 1, stagger: 0.12 }, 0.55);

    /* ---- Idle loops: start once the intro settles so they never fight it ---- */
    context.add('startLoops', () => {
      gsap.to('.hero__shape--star .hero__shape-svg', { rotate: '+=360', duration: 14, ease: 'none', repeat: -1 });
      gsap.to('.hero__shape--flower .hero__shape-svg', { rotate: '-=360', duration: 22, ease: 'none', repeat: -1 });
      gsap.to('.hero__shape--pill .hero__shape-svg', { y: -14, rotate: '+=12', duration: 2.4, ease: 'sine.inOut', yoyo: true, repeat: -1 });
      gsap.to('.hero__shape--ring .hero__shape-svg', { scale: 1.08, duration: 1.8, ease: 'sine.inOut', yoyo: true, repeat: -1 });
      gsap.timeline({ repeat: -1, repeatDelay: 2.6, delay: 0.8 })
        .to('.hero__tittle .shape', { y: '-0.5em', duration: 0.42, ease: 'power2.out' })
        .to('.hero__tittle .shape', { y: 0, duration: 0.7, ease: 'bounce.out' })
        .to('.hero__period .shape', { rotate: '+=90', duration: 0.6, ease: 'back.inOut(2)' }, '-=0.6');
    });
    introTl.call(() => context.startLoops());

    if (introDone.value) introTl.play();
    else {
      const stop = watch(introDone, value => { if (value) { introTl.play(); stop(); } });
    }

    /* ---- Rotating role (ScrambleText) ---- */
    if (roleEl.value) {
      const roles = t.value.roles;
      const roleTl = gsap.timeline({ repeat: -1, delay: 2.4 });
      roles.forEach((_, i) => {
        const next = roles[(i + 1) % roles.length];
        roleTl.to(roleEl.value, { duration: 1, scrambleText: { text: next, chars: 'lowerCase', speed: 0.5, revealDelay: 0.2 }, ease: 'none' }, '+=2');
      });
    }

    /* ---- Scroll: lines drift apart, shapes parallax ---- */
    const scrollTl = gsap.timeline({
      scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: 0.25 },
      defaults: { ease: 'none' },
    });
    scrollTl
      .to('.hero__line--1', { xPercent: -16 }, 0)
      .to('.hero__line--2', { xPercent: 12 }, 0)
      .to('[data-hero-fade]', { y: -60, autoAlpha: 0, stagger: 0.05 }, 0);
    gsap.utils.toArray('.hero__shape', el).forEach(shape => {
      const depth = Number(shape.dataset.depth) || 1;
      scrollTl.to(shape, { y: -220 * depth, rotate: `+=${40 * depth}`, ease: 'none' }, 0);
    });

    /* ---- Pointer parallax ---- */
    if (fine) {
      const movers = gsap.utils.toArray('.hero__shape', el).map(shape => ({
        depth: Number(shape.dataset.depth) || 1,
        x: gsap.quickTo(shape.querySelector('.hero__shape-mouse'), 'x', { duration: 1.2, ease: 'power3' }),
        y: gsap.quickTo(shape.querySelector('.hero__shape-mouse'), 'y', { duration: 1.2, ease: 'power3' }),
      }));
      const onMove = event => {
        const nx = event.clientX / window.innerWidth - 0.5;
        const ny = event.clientY / window.innerHeight - 0.5;
        movers.forEach(m => { m.x(nx * 70 * m.depth); m.y(ny * 50 * m.depth); });
      };
      el.addEventListener('pointermove', onMove);
      return () => el.removeEventListener('pointermove', onMove);
    }
    return undefined;
  });
});
</script>

<style scoped>
.hero {
  position: relative;
  display: flex;
  min-height: 100svh;
  padding: calc(var(--header-h) + clamp(18px, 3vh, 36px)) 0 clamp(24px, 4vh, 40px);
  overflow: hidden;
}

.hero__inner {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: clamp(18px, 3vh, 32px);
}

/* Top row */
.hero__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  color: var(--c-cream-75);
  font-family: var(--font-mono);
  font-size: 0.85rem;
}
.hero__greeting { display: flex; flex-wrap: wrap; align-items: baseline; gap: 0.5em; }
.hero__prompt { color: var(--c-accent); font-weight: 700; }
.hero__role { color: var(--c-cream); }
.hero__caret { margin-left: -0.35em; color: var(--c-accent); animation: caret 1s steps(1) infinite; }
.hero__status { display: inline-flex; align-items: center; gap: 10px; color: var(--c-cream); }
.hero__status-dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: var(--c-mint);
  box-shadow: 0 0 0 0 rgba(123, 227, 184, 0.5);
  animation: ping 2.2s var(--ease-out) infinite;
}

/* Wordmark */
.hero__title {
  position: relative;
  display: flex;
  flex-direction: column;
  margin-block: auto;
  padding-inline: clamp(0px, 2vw, 32px);
  font-size: min(22vw, 36vh);
  font-weight: 500;
  line-height: 0.84;
  letter-spacing: -0.065em;
  user-select: none;
}

.hero__line { position: relative; z-index: 1; display: flex; width: max-content; will-change: transform; }
.hero__line--2 { align-self: flex-end; margin-right: clamp(0px, 3vw, 48px); }

.hero__char-wrap { position: relative; display: inline-block; }
.hero__mask {
  display: inline-block;
  overflow: clip;
  padding: 0.06em 0.02em 0.14em;
  margin: -0.06em -0.02em -0.14em;
}
.hero__char { display: inline-block; will-change: transform; }

/* custom i tittle sits above the dotless ı */
.hero__tittle {
  position: absolute;
  z-index: 2;
  left: 50%;
  top: 0.02em;
  width: 0.19em;
  margin-left: -0.095em;
}
.hero__tittle :deep(.shape) { will-change: transform; }

/* custom period */
.hero__char-wrap--dot { width: 0.3em; }
.hero__period {
  position: absolute;
  left: 0.06em;
  bottom: 0.13em;
  width: 0.19em;
}

/* Decorative shapes */
.hero__shape { position: absolute; z-index: 2; pointer-events: none; }
.hero__shape-mouse { display: block; }
.hero__shape--star { top: -4%; left: 45%; width: clamp(56px, 8vw, 128px); }
.hero__shape--pill { top: 6%; right: 6%; width: clamp(36px, 4.6vw, 74px); transform: rotate(32deg); }
.hero__shape--ring { top: 58%; left: 6%; width: clamp(54px, 7.4vw, 120px); }
.hero__shape--flower { top: 30%; right: -1%; width: clamp(40px, 5vw, 84px); z-index: 0; }
.hero__shape--squiggle { right: 22%; bottom: -10%; width: clamp(90px, 13vw, 210px); z-index: 3; }

/* Bottom row */
.hero__bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 28px;
  padding-inline: clamp(0px, 2vw, 32px);
}
.hero__desc { color: var(--c-cream); }
.hero__ctas { display: flex; flex-wrap: wrap; gap: 12px; }

.hero__meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding-top: 18px;
  border-top: 1px solid var(--c-line);
}
.hero__socials { display: flex; gap: 8px; }
.hero__scroll {
  display: inline-flex;
  align-items: center;
  gap: 14px;
  color: var(--c-cream-75);
  font-family: var(--font-mono);
  font-size: var(--fs-micro);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.hero__scroll:hover { color: var(--c-cream); }
.hero__scroll-track { position: relative; width: 2px; height: 34px; overflow: hidden; border-radius: 2px; background: var(--c-line); }
.hero__scroll-thumb { position: absolute; inset: 0; background: var(--c-accent); animation: scrollThumb 2s var(--ease-in-out) infinite; }

@keyframes caret { 50% { opacity: 0; } }
@keyframes ping { 0% { box-shadow: 0 0 0 0 rgba(123, 227, 184, 0.5); } 80%, 100% { box-shadow: 0 0 0 12px rgba(123, 227, 184, 0); } }
@keyframes scrollThumb { 0% { transform: translateY(-100%); } 60%, 100% { transform: translateY(100%); } }

@media (max-width: 899px) {
  .hero__title { font-size: 31vw; margin-block: 8vh 6vh; padding-inline: 0; }
  .hero__line--2 { margin-right: 0; }
  .hero__bottom { flex-direction: column; align-items: flex-start; padding-inline: 0; }
  .hero__ctas { width: 100%; }
  .hero__ctas .pill { flex: 1 1 auto; }
  .hero__shape--star { left: 52%; top: -10%; }
  .hero__shape--squiggle { right: 30%; bottom: -16%; }
  .hero__shape--flower { top: 34%; right: 2%; }
}

@media (max-width: 560px) {
  .hero__top { flex-direction: column; align-items: flex-start; gap: 8px; font-size: 0.8rem; }
  .hero__scroll span:first-child { display: none; }
}

@media (prefers-reduced-motion: reduce) {
  .hero__caret, .hero__status-dot, .hero__scroll-thumb { animation: none; }
}
</style>

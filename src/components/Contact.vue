<template>
  <section id="contact" ref="root" class="contact section" aria-labelledby="contact-title">
    <div class="container">
      <span class="mono contact__eyebrow">05 — {{ t.label }}</span>

      <div class="contact__hero">
        <h2 id="contact-title" class="contact__title">
          <span class="contact__line">{{ titleWords[0] }}</span>
          <span class="contact__line contact__line--2">{{ titleWords.slice(1).join(' ') }}</span>
        </h2>
        <span class="contact__shape contact__shape--arc" aria-hidden="true"><Shape name="arc" palette="candy" /></span>
        <span class="contact__shape contact__shape--flower" aria-hidden="true"><Shape name="flower" palette="green" /></span>
        <span class="contact__shape contact__shape--zig" aria-hidden="true"><Shape name="zigzag" palette="orange" /></span>
      </div>

      <div class="contact__intro">
        <BraceLabel size="lg"><span>{{ t.description }}</span></BraceLabel>
        <div class="contact__cta">
          <h3 class="contact__cta-title">{{ t.ctaTitle }}</h3>
          <p class="muted">{{ t.ctaText }}</p>
          <span v-if="t.headerSubtitle" class="contact__sub mono">{{ t.headerSubtitle }}</span>
        </div>
      </div>

      <ul class="contact__list">
        <li v-for="item in contacts" :key="item.label">
          <a
            :href="item.href"
            target="_blank"
            rel="noopener noreferrer"
            class="crow"
            :style="{ '--tone': item.color, '--ink': item.ink }"
            :data-cursor="t.connect"
          >
            <span class="crow__fill" aria-hidden="true"></span>
            <span class="crow__icon" aria-hidden="true"><i :class="item.icon"></i></span>
            <span class="crow__name">{{ item.label }}</span>
            <span class="crow__handle mono">{{ item.handle }}</span>
            <span class="crow__arrow" aria-hidden="true"><i class="fas fa-arrow-right"></i></span>
          </a>
        </li>
      </ul>

      <GithubActivity />
    </div>
  </section>
</template>

<script setup>
import { computed, inject, ref } from 'vue';
import { gsap, SplitText } from '@/lib/gsap';
import { useGsap, MEDIA } from '@/composables/useGsap';
import { useGate } from '@/composables/useGate';
import GithubActivity from './GithubActivity.vue';
import Shape from './ui/Shape.vue';
import BraceLabel from './ui/BraceLabel.vue';

const lang = inject('lang');
const translations = inject('translations');
const t = computed(() => translations[lang.value].contact);
const titleWords = computed(() => t.value.title.split(' '));

const contacts = [
  { label: 'Discord', handle: '.heiznerd', icon: 'fab fa-discord', color: '#9d95ff', ink: '#0e100f', href: 'https://discord.com/users/1316287191634149377' },
  { label: 'GitHub', handle: '@heiznerd', icon: 'fab fa-github', color: '#fffce1', ink: '#0e100f', href: 'https://github.com/heiznerd' },
  { label: 'Facebook', handle: 'Nguyễn Hữu Quý', icon: 'fab fa-facebook-f', color: '#00bae2', ink: '#0e100f', href: 'https://www.facebook.com/nguyen.huu.quy.906170' },
];

const root = ref(null);
useGate(root, { target: '.contact__hero' });

useGsap(root, ({ root: el, mm }) => {
  mm.add(MEDIA, context => {
    if (!context.conditions.motion) return;

    const lines = gsap.utils.toArray('.contact__line', el);
    const split = SplitText.create(lines, { type: 'words,chars', charsClass: 'split-char', mask: 'chars', aria: 'auto' });
    lines.forEach(line => line.classList.add('is-split'));
    gsap.from(split.chars, {
      yPercent: 110,
      rotate: 6,
      stagger: 0.035,
      duration: 1.1,
      ease: 'expo.out',
      scrollTrigger: { trigger: '.contact__title', start: 'top 85%', once: true },
    });

    gsap.timeline({ scrollTrigger: { trigger: '.contact__hero', start: 'top bottom', end: 'bottom top', scrub: 1 } })
      .fromTo('.contact__shape--arc', { rotate: -120 }, { rotate: 160, ease: 'none' }, 0)
      .fromTo('.contact__shape--flower', { y: 120, rotate: 0 }, { y: -80, rotate: 180, ease: 'none' }, 0)
      .fromTo('.contact__shape--zig', { x: -60 }, { x: 60, ease: 'none' }, 0);

    gsap.from('.contact__intro > *', {
      y: 60,
      autoAlpha: 0,
      stagger: 0.12,
      duration: 1.1,
      scrollTrigger: { trigger: '.contact__intro', start: 'top 88%', once: true },
    });

    gsap.from('.crow', {
      yPercent: 60,
      autoAlpha: 0,
      stagger: 0.1,
      duration: 1,
      scrollTrigger: { trigger: '.contact__list', start: 'top 90%', once: true },
    });

    return () => lines.forEach(line => line.classList.remove('is-split'));
  });
});
</script>

<style scoped>
.contact__eyebrow { color: var(--c-green); }

.contact__hero { position: relative; margin-top: 20px; }
.contact__title {
  display: flex;
  flex-direction: column;
  font-size: clamp(4.2rem, 15vw, 15rem);
  font-weight: 500;
  line-height: 0.88;
  letter-spacing: -0.065em;
}
.contact__line--2 { align-self: flex-end; background: var(--g-green); -webkit-background-clip: text; background-clip: text; color: transparent; padding-bottom: 0.06em; }
.contact__line--2.is-split { background: none; color: var(--c-cream); }
.contact__line--2 :deep(.split-char) { background: var(--g-green); -webkit-background-clip: text; background-clip: text; color: transparent; padding-bottom: 0.06em; }
.contact__line :deep(.split-char) { display: inline-block; }
.contact__shape { position: absolute; pointer-events: none; }
.contact__shape--arc { top: -6%; left: 44%; width: clamp(70px, 9vw, 150px); }
.contact__shape--flower { bottom: -2%; left: 6%; width: clamp(50px, 6vw, 100px); }
.contact__shape--zig { bottom: 44%; right: 4%; width: clamp(70px, 8vw, 130px); }

.contact__intro {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  align-items: center;
  gap: 32px clamp(32px, 6vw, 96px);
  margin-top: clamp(48px, 7vw, 96px);
}
.contact__cta-title { font-size: clamp(1.6rem, 2.8vw, 2.6rem); letter-spacing: -0.04em; }
.contact__cta p { margin-top: 10px; font-size: 1.1rem; }
.contact__sub { display: inline-block; margin-top: 14px; color: var(--c-green); }

.contact__list { margin-top: clamp(48px, 7vw, 96px); border-top: 1px solid var(--c-line); }
.crow {
  position: relative;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto auto;
  align-items: center;
  gap: clamp(14px, 2.4vw, 32px);
  padding: clamp(18px, 2.6vw, 32px) clamp(8px, 1.6vw, 24px);
  overflow: hidden;
  border-bottom: 1px solid var(--c-line);
  isolation: isolate;
  transition: color 0.4s var(--ease-out);
}
.crow__fill {
  position: absolute;
  inset: 0;
  z-index: -1;
  background: var(--tone);
  transform: scaleY(0);
  transform-origin: bottom;
  transition: transform 0.55s var(--ease-out);
}
.crow:hover,
.crow:focus-visible { color: var(--ink); outline: none; }
.crow:hover .crow__fill,
.crow:focus-visible .crow__fill { transform: scaleY(1); }
.crow__icon { display: grid; width: clamp(44px, 4.6vw, 64px); height: clamp(44px, 4.6vw, 64px); place-items: center; border-radius: 50%; color: var(--c-bg); background: var(--tone); font-size: clamp(1.1rem, 1.6vw, 1.5rem); transition: background 0.4s var(--ease-out), color 0.4s var(--ease-out); }
.crow:hover .crow__icon, .crow:focus-visible .crow__icon { color: var(--tone); background: var(--ink); }
.crow__name { font-size: clamp(2rem, 5.6vw, 5.4rem); font-weight: 500; line-height: 1; letter-spacing: -0.055em; }
.crow__handle { font-size: clamp(0.8rem, 1.1vw, 1rem); text-transform: none; letter-spacing: 0; }
.crow__arrow { display: grid; width: clamp(44px, 4.6vw, 64px); height: clamp(44px, 4.6vw, 64px); place-items: center; border: 1.5px solid currentColor; border-radius: 50%; transition: transform 0.5s var(--ease-out); }
.crow:hover .crow__arrow, .crow:focus-visible .crow__arrow { transform: rotate(-45deg); }

@media (max-width: 899px) {
  .contact__intro { grid-template-columns: 1fr; }
  .crow { grid-template-columns: auto minmax(0, 1fr) auto; }
  .crow__handle { grid-column: 2; grid-row: 2; margin-top: -6px; }
  .crow__arrow { grid-row: 1 / span 2; grid-column: 3; }
  .crow__icon { grid-row: 1 / span 2; }
}
</style>

<template>
  <section ref="root" class="thanks" aria-labelledby="thanks-title">
    <div class="container">
      <figure class="thanks__figure">
        <div class="thanks__frame">
          <img src="/heiznerd_backgroundv2.png" :alt="t.alt" class="thanks__img" loading="lazy" decoding="async" />
        </div>
        <figcaption class="thanks__card">
          <h2 id="thanks-title" class="thanks__tag">
            <span class="thanks__tag-shape" aria-hidden="true"><Shape name="star" palette="green" /></span>
            {{ t.tag }}
          </h2>
          <p class="thanks__msg">
            {{ t.before }} <strong>NekoTech</strong> {{ t.middle }}
            <em>@maiminhdung</em>{{ t.and }} <em>@ssdarealest</em> {{ t.after }}
            <em>@ssdarealest</em> {{ t.end }}
          </p>
        </figcaption>
      </figure>
    </div>
  </section>
</template>

<script setup>
import { computed, inject, ref } from 'vue';
import { gsap } from '@/lib/gsap';
import { useGsap, MEDIA } from '@/composables/useGsap';
import Shape from './ui/Shape.vue';

const lang = inject('lang');
const translations = inject('translations');
const t = computed(() => translations[lang.value].thanks);
const root = ref(null);

useGsap(root, ({ mm }) => {
  mm.add(MEDIA, context => {
    if (!context.conditions.motion) return;
    // Banner unmasks from a pill into the full frame, image drifts inside it.
    gsap.timeline({ scrollTrigger: { trigger: '.thanks__figure', start: 'top 97%', end: 'top 25%', scrub: 1 } })
      .fromTo('.thanks__frame', { clipPath: 'inset(18% 26% 18% 26% round 999px)' }, { clipPath: 'inset(0% 0% 0% 0% round 36px)', ease: 'none' }, 0)
      .fromTo('.thanks__img', { scale: 1.35 }, { scale: 1.05, ease: 'none' }, 0);
    gsap.fromTo('.thanks__img', { yPercent: -4 }, {
      yPercent: 4,
      ease: 'none',
      scrollTrigger: { trigger: '.thanks__figure', start: 'top 25%', end: 'bottom top', scrub: true },
    });
    gsap.from('.thanks__card', {
      y: 100,
      rotate: -3,
      autoAlpha: 0,
      duration: 1.2,
      scrollTrigger: { trigger: '.thanks__figure', start: 'top 45%', once: true },
    });
    gsap.to('.thanks__tag-shape', { rotate: 360, duration: 10, ease: 'none', repeat: -1 });
  });
});
</script>

<style scoped>
.thanks { padding-block: clamp(40px, 6vw, 100px); }
.thanks__figure { position: relative; }
.thanks__frame {
  overflow: hidden;
  aspect-ratio: 16 / 7;
  border-radius: var(--radius-xl);
  background: var(--c-bg-2);
}
.thanks__img { width: 100%; height: 100%; object-fit: cover; will-change: transform; }

.thanks__card {
  position: relative;
  z-index: 1;
  width: min(640px, calc(100% - 32px));
  margin: -12% 0 0 clamp(16px, 4vw, 56px);
  padding: clamp(22px, 2.6vw, 34px);
  border-radius: var(--radius-lg);
  color: var(--c-bg);
  background: var(--c-cream);
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.35);
}
.thanks__tag { display: flex; align-items: center; gap: 10px; color: var(--c-bg); font-family: var(--font-mono); font-size: 0.85rem; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; }
.thanks__tag-shape { width: 26px; }
.thanks__msg { margin-top: 14px; font-size: clamp(1.05rem, 1.5vw, 1.3rem); font-weight: 500; line-height: 1.5; }
.thanks__msg strong,
.thanks__msg em {
  padding: 0 0.25em;
  border-radius: 0.25em;
  font-style: normal;
  font-weight: 700;
  background: var(--c-peach);
}
.thanks__msg em { background: var(--c-pink); }

@media (max-width: 899px) {
  .thanks__frame { aspect-ratio: 4 / 3; }
  .thanks__card { width: auto; margin: -18% 12px 0; }
}
</style>

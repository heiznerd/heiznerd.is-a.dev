<template>
  <footer ref="root" class="footer">
    <div class="container">
      <div class="footer__top">
        <blockquote v-if="quote" class="footer__quote">
          <BraceLabel size="lg"><span>“{{ quote.content }}”</span></BraceLabel>
          <cite class="mono">— {{ quote.author }}</cite>
        </blockquote>
        <div class="footer__side">
          <nav class="footer__socials" aria-label="Social">
            <a v-for="s in socials" :key="s.label" v-magnetic="0.4" :href="s.href" target="_blank" rel="noopener noreferrer" class="icon-btn" :aria-label="s.label">
              <i :class="s.icon" aria-hidden="true"></i>
            </a>
          </nav>
          <a href="#home" class="pill pill--sm footer__top-link" @click="toTop">
            <i class="fas fa-arrow-up" aria-hidden="true"></i>
            <span>{{ t.backToTop }}</span>
          </a>
        </div>
      </div>

      <div class="footer__mark" aria-hidden="true">
        <span v-for="(ch, i) in 'heiznerd'" :key="i" class="footer__char">{{ ch }}</span>
        <span class="footer__mark-dot"><Shape name="square" palette="green" /></span>
      </div>

      <div class="footer__bottom">
        <p>© 2026 Heiznerd · {{ t.designedBy }} Heiznerd. {{ t.rights }}</p>
        <p class="footer__built">
          {{ t.builtWith }}
          <span><i class="fab fa-vuejs" aria-hidden="true"></i> Vue.js</span>
          <span>+</span>
          <span class="footer__gsap">GSAP</span>
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed, inject, ref } from 'vue';
import { useRoute } from 'vue-router';
import { gsap } from '@/lib/gsap';
import { useGsap, MEDIA } from '@/composables/useGsap';
import Shape from './ui/Shape.vue';
import BraceLabel from './ui/BraceLabel.vue';

const lang = inject('lang');
const translations = inject('translations');
const t = computed(() => translations[lang.value].footer);
const route = useRoute();

const QUOTES = [
  { content: 'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.', author: 'Martin Fowler' },
  { content: 'First, solve the problem. Then, write the code.', author: 'John Johnson' },
  { content: 'Simplicity is the soul of efficiency.', author: 'Austin Freeman' },
  { content: 'Make it work, make it right, make it fast.', author: 'Kent Beck' },
];
const quote = QUOTES[Math.floor(Math.random() * QUOTES.length)];

const socials = [
  { label: 'GitHub', icon: 'fab fa-github', href: 'https://github.com/heiznerd' },
  { label: 'Discord', icon: 'fab fa-discord', href: 'https://discord.com/users/1316287191634149377' },
  { label: 'Facebook', icon: 'fab fa-facebook-f', href: 'https://www.facebook.com/nguyen.huu.quy.906170' },
];

// On routes without a #home section, the link falls back to normal navigation.
const toTop = event => {
  if (route.path !== '/') {
    event.preventDefault();
    window.location.href = '/';
  }
};

const root = ref(null);

useGsap(root, ({ root: el, mm }) => {
  mm.add(MEDIA, context => {
    if (!context.conditions.motion) return;
    gsap.from('.footer__char', {
      yPercent: 100,
      rotate: i => (i % 2 ? 8 : -8),
      stagger: 0.06,
      ease: 'none',
      scrollTrigger: { trigger: '.footer__mark', start: 'top bottom', end: 'bottom bottom', scrub: 0.6 },
    });
    gsap.from('.footer__mark-dot', {
      scale: 0,
      rotate: -180,
      ease: 'none',
      scrollTrigger: { trigger: '.footer__mark', start: 'center bottom', end: 'bottom bottom', scrub: 0.6 },
    });
    gsap.from('.footer__top > *', {
      y: 50,
      autoAlpha: 0,
      stagger: 0.1,
      duration: 1,
      scrollTrigger: { trigger: el, start: 'top 95%', once: true },
    });
  });
});
</script>

<style scoped>
.footer { position: relative; padding-top: clamp(80px, 10vw, 140px); border-top: 1px solid var(--c-line); overflow: hidden; }

.footer__top { display: flex; flex-wrap: wrap; align-items: flex-end; justify-content: space-between; gap: 32px; }
.footer__quote { display: grid; gap: 14px; max-width: 720px; }
.footer__quote :deep(.brace__body) { max-width: 40ch; }
.footer__quote cite { color: var(--c-green); font-style: normal; }
.footer__side { display: flex; flex-wrap: wrap; align-items: center; gap: 16px; }
.footer__socials { display: flex; gap: 8px; }

.footer__mark {
  position: relative;
  display: flex;
  justify-content: center;
  margin-top: clamp(48px, 7vw, 100px);
  overflow: hidden;
  font-size: clamp(5rem, 23.5vw, 23rem);
  font-weight: 600;
  line-height: 0.8;
  letter-spacing: -0.07em;
  padding-bottom: 0.04em;
  user-select: none;
}
.footer__char { display: inline-block; will-change: transform; }
.footer__mark-dot { align-self: flex-end; width: 0.17em; margin: 0 0 0.04em 0.04em; }

.footer__bottom {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px 24px;
  padding-block: 24px calc(28px + env(safe-area-inset-bottom));
  border-top: 1px solid var(--c-line);
  color: var(--c-cream-75);
  font-size: 0.9rem;
}
.footer__built { display: inline-flex; flex-wrap: wrap; align-items: center; gap: 8px; }
.footer__built .fa-vuejs { color: #42b883; }
.footer__gsap { color: var(--c-green); font-weight: 700; }
</style>

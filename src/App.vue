<template>
  <!-- Fixed UI lives outside the ScrollSmoother wrapper (transforms would break position: fixed). -->
  <Teleport to="body">
    <a class="skip-link" href="#main">{{ translations[lang].navbar.skip }}</a>
    <IntroScreen v-if="showIntro" @done="onIntroDone" />
    <Navbar :intro-complete="introDone" />
    <ScrollProgress />
    <CustomCursor />
  </Teleport>

  <main id="main" tabindex="-1">
    <router-view />
  </main>

  <Footer />
</template>

<script setup>
import { onMounted, onUnmounted, provide, reactive, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import Navbar from './components/Navbar.vue';
import IntroScreen from './components/IntroScreen.vue';
import ScrollProgress from './components/ScrollProgress.vue';
import CustomCursor from './components/CustomCursor.vue';
import Footer from './components/Footer.vue';
import { translations as dictionary } from './translations.js';
import { ScrollTrigger, getSmoother, prefersReducedMotion, scrollToTarget, setScrollLocked } from './lib/gsap';

const lang = ref(localStorage.getItem('preferred-lang') === 'en' ? 'en' : 'vi');
const currentLang = ref(lang.value);
const translations = reactive(dictionary);
const route = useRoute();

// The intro plays on the home page only, and never for reduced-motion users.
const showIntro = ref(!prefersReducedMotion() && window.location.pathname === '/');
const introDone = ref(!showIntro.value);

provide('lang', lang);
provide('currentLang', currentLang);
provide('translations', translations);
provide('introDone', introDone);

if (showIntro.value) setScrollLocked(true);

const onIntroDone = () => {
  showIntro.value = false;
  introDone.value = true;
  setScrollLocked(false);
  ScrollTrigger.refresh();
};

// In-page anchors must go through ScrollSmoother so pinned sections land correctly.
const handleAnchorClick = event => {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey) return;
  const link = event.target.closest?.('a[href^="#"]');
  if (!link) return;
  const id = link.getAttribute('href').slice(1);
  const target = id && document.getElementById(id);
  if (!target) return;
  event.preventDefault();
  if (id === 'main') {
    target.focus({ preventScroll: true });
    return;
  }
  scrollToTarget(target);
  history.replaceState(null, '', `#${id}`);
};

watch(() => route.fullPath, () => {
  // New route content: reset to top and recalc every trigger after it renders.
  const smoother = getSmoother();
  requestAnimationFrame(() => {
    if (smoother) smoother.scrollTop(0);
    else window.scrollTo(0, 0);
    ScrollTrigger.refresh();
  });
});

onMounted(() => {
  document.addEventListener('click', handleAnchorClick);
  if (window.location.hash) {
    const id = window.location.hash.slice(1);
    window.setTimeout(() => scrollToTarget(id), showIntro.value ? 1700 : 300);
  }
});

onUnmounted(() => {
  document.removeEventListener('click', handleAnchorClick);
});
</script>

<style>
/* Decorative shapes/stickers may poke past the edge; clip (not hidden) so pins and sticky stay intact. */
#main { display: block; outline: none; overflow-x: clip; }
</style>

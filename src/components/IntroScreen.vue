<template>
  <div
    ref="root"
    class="intro"
    role="dialog"
    aria-modal="true"
    aria-labelledby="intro-wordmark"
    tabindex="-1"
    @click="skip"
  >
    <div class="intro__stage">
      <div class="intro__shapes" aria-hidden="true">
        <Shape v-for="s in shapes" :key="s.name" class="intro__shape" :name="s.name" :palette="s.palette" />
      </div>
      <p id="intro-wordmark" class="intro__word">HEIZNERD</p>
    </div>
    <div class="intro__foot">
      <span class="mono">{{ t.skip }}</span>
      <span class="intro__count mono" aria-hidden="true"><span ref="countEl">000</span>%</span>
    </div>
    <div class="intro__bar" aria-hidden="true"><span ref="barEl"></span></div>
  </div>
</template>

<script setup>
import { computed, inject, nextTick, onMounted, onUnmounted, ref } from 'vue';
import { gsap, SplitText } from '@/lib/gsap';
import Shape from './ui/Shape.vue';

const emit = defineEmits(['done']);
const lang = inject('lang');
const translations = inject('translations');
const t = computed(() => translations[lang.value].intro);

const root = ref(null);
const countEl = ref(null);
const barEl = ref(null);
const shapes = [
  { name: 'flower', palette: 'pink' },
  { name: 'star', palette: 'orange' },
  { name: 'ring', palette: 'blue' },
  { name: 'pill', palette: 'green' },
  { name: 'diamond', palette: 'lilac' },
];

let ctx;
let tl;
let finished = false;

const finish = () => {
  if (finished) return;
  finished = true;
  window.removeEventListener('keydown', skip);
  emit('done');
};

const exit = () => {
  // Wipe the curtain up and hand control to the hero.
  return gsap.timeline({ onComplete: finish })
    .to('.intro__stage, .intro__foot, .intro__bar', { yPercent: -30, autoAlpha: 0, duration: 0.5, ease: 'power3.in' })
    .to(root.value, { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.75, ease: 'hz.inOut' }, '-=0.2');
};

function skip() {
  if (!tl || finished) return;
  tl.progress(1);
}

onMounted(async () => {
  await nextTick();
  root.value?.focus({ preventScroll: true });
  window.addEventListener('keydown', skip);

  ctx = gsap.context(() => {
    const split = SplitText.create('.intro__word', { type: 'chars', mask: 'chars', maskClass: 'split-mask' });
    const counter = { v: 0 };

    tl = gsap.timeline({ onComplete: () => ctx.add(exit) });
    tl.from(split.chars, { yPercent: 110, duration: 0.9, stagger: 0.045, ease: 'expo.out' })
      .from('.intro__shape', {
        scale: 0,
        rotate: () => gsap.utils.random(-180, 180),
        duration: 0.8,
        stagger: 0.07,
        ease: 'back.out(2.2)',
      }, 0.15)
      .to(counter, {
        v: 100,
        duration: 1.25,
        ease: 'power2.inOut',
        onUpdate: () => { if (countEl.value) countEl.value.textContent = String(Math.round(counter.v)).padStart(3, '0'); },
      }, 0)
      .fromTo(barEl.value, { scaleX: 0 }, { scaleX: 1, duration: 1.25, ease: 'power2.inOut' }, 0)
      .to('.intro__shape', { y: -18, duration: 0.35, stagger: 0.05, ease: 'power2.out', yoyo: true, repeat: 1 }, 0.85);
  }, root.value);
});

onUnmounted(() => {
  window.removeEventListener('keydown', skip);
  ctx?.revert();
});
</script>

<style scoped>
.intro {
  position: fixed;
  inset: 0;
  z-index: 10040;
  display: grid;
  grid-template-rows: 1fr auto;
  padding: var(--gutter);
  color: var(--c-cream);
  background: var(--c-bg);
  clip-path: inset(0% 0% 0% 0%);
  outline: none;
  cursor: pointer;
}

.intro__stage {
  display: grid;
  place-content: center;
  justify-items: center;
  gap: clamp(18px, 3vw, 34px);
}

.intro__shapes { display: flex; gap: clamp(10px, 1.6vw, 18px); }
.intro__shape { width: clamp(28px, 3.6vw, 52px); }

.intro__word {
  font-size: clamp(3.2rem, 13vw, 12rem);
  font-weight: 600;
  line-height: 1;
  letter-spacing: -0.05em;
}

.intro__foot {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
  color: var(--c-cream-75);
}

.intro__count { color: var(--c-cream); font-size: clamp(1.2rem, 3vw, 2.4rem); letter-spacing: -0.04em; }

.intro__bar {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  height: 4px;
  background: var(--c-line-soft);
}
.intro__bar span {
  display: block;
  height: 100%;
  background: var(--g-green);
  transform: scaleX(0);
  transform-origin: left;
}
</style>

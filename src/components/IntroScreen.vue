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
    <span class="intro__layer intro__layer--violet" aria-hidden="true"></span>
    <span class="intro__layer intro__layer--orange" aria-hidden="true"></span>
    <span class="intro__layer intro__layer--pink" aria-hidden="true"></span>
  </div>
</template>

<script setup>
import { computed, inject, nextTick, onMounted, onUnmounted, ref } from 'vue';
import { gsap, SplitText } from '@/lib/gsap';
import Shape from './ui/Shape.vue';

const emit = defineEmits(['done', 'reveal']);
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
  // Shapes burst, three colour curtains rise and cover, then leave upward
  // while the hero starts animating underneath.
  const layers = gsap.utils.toArray('.intro__layer');
  const shapeEls = gsap.utils.toArray('.intro__shape');
  const tlOut = gsap.timeline({ onComplete: finish });
  tlOut
    .to(shapeEls, {
      x: (i) => (i - 2) * 160,
      y: (i) => (i % 2 ? -140 : 140),
      scale: 2.2,
      rotate: (i) => (i - 2) * 120,
      autoAlpha: 0,
      duration: 0.5,
      ease: 'power3.out',
    }, 0)
    .to('.intro__word', { scale: 1.35, letterSpacing: '0.02em', autoAlpha: 0, duration: 0.45, ease: 'power3.in' }, 0)
    .to('.intro__foot, .intro__bar', { autoAlpha: 0, duration: 0.2 }, 0)
    .fromTo(layers,
      { clipPath: 'inset(100% 0% 0% 0%)' },
      { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.45, stagger: 0.09, ease: 'power3.inOut' }, 0.12)
    .set(root.value, { backgroundColor: 'transparent' })
    .call(() => emit('reveal'))
    .to([...layers].reverse(), {
      clipPath: 'inset(0% 0% 100% 0%)',
      duration: 0.55,
      stagger: 0.09,
      ease: 'power3.inOut',
    }, '>');
  return tlOut;
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
    tl.from(split.chars, { yPercent: 110, duration: 0.7, stagger: 0.035, ease: 'expo.out' })
      .from('.intro__shape', {
        scale: 0,
        rotate: () => gsap.utils.random(-180, 180),
        duration: 0.8,
        stagger: 0.07,
        ease: 'back.out(2.2)',
      }, 0.15)
      .to(counter, {
        v: 100,
        duration: 0.9,
        ease: 'power2.inOut',
        onUpdate: () => { if (countEl.value) countEl.value.textContent = String(Math.round(counter.v)).padStart(3, '0'); },
      }, 0)
      .fromTo(barEl.value, { scaleX: 0 }, { scaleX: 1, duration: 0.9, ease: 'power2.inOut' }, 0)
      .to('.intro__shape', { y: -18, duration: 0.28, stagger: 0.04, ease: 'power2.out', yoyo: true, repeat: 1 }, 0.85);
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

.intro__layer {
  position: absolute;
  inset: 0;
  pointer-events: none;
  clip-path: inset(100% 0% 0% 0%);
}
.intro__layer--violet { background: #8a5cff; }
.intro__layer--orange { background: #ff9a5c; }
.intro__layer--pink { background: #ff5c93; }

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
  background: var(--g-accent);
  transform: scaleX(0);
  transform-origin: left;
}
</style>

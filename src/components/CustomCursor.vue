<template>
  <div v-if="enabled" ref="root" class="cursor" aria-hidden="true">
    <div class="cursor__follow">
      <div class="cursor__ring"></div>
      <span class="cursor__label">{{ label }}</span>
    </div>
    <div class="cursor__dot"></div>
  </div>
</template>

<script setup>
import { nextTick, onMounted, onUnmounted, ref } from 'vue';
import { gsap, prefersReducedMotion, FINE_POINTER_QUERY } from '@/lib/gsap';

// Decorative follower only: the native cursor stays visible, and touch / reduced-motion users never get it.
const enabled = ref(false);
const root = ref(null);
const label = ref('');

let ctx;
let ring;
let labelEl;
let followX; let followY; let dotX; let dotY;
let state = 'idle';
let visible = false;

const scaleFor = s => (s === 'label' ? 2.8 : s === 'link' ? 1.6 : 1);

const setState = (next, text = '') => {
  if (state === next && label.value === text) return;
  state = next;
  label.value = text;
  gsap.to(ring, { scale: scaleFor(next), duration: 0.5, ease: 'expo.out', overwrite: 'auto' });
  gsap.to(labelEl, { autoAlpha: next === 'label' ? 1 : 0, scale: next === 'label' ? 1 : 0.6, duration: 0.3, overwrite: 'auto' });
  ring.classList.toggle('has-label', next === 'label');
  ring.classList.toggle('is-link', next === 'link');
};

const onMove = event => {
  followX(event.clientX); followY(event.clientY);
  dotX(event.clientX); dotY(event.clientY);
  if (!visible) {
    visible = true;
    gsap.to(root.value, { opacity: 1, duration: 0.3 });
  }
};

const onOver = event => {
  const labelled = event.target.closest?.('[data-cursor]');
  if (labelled) return setState('label', labelled.getAttribute('data-cursor'));
  const interactive = event.target.closest?.('a, button, [role="button"], input, label, summary, [role="option"]');
  return setState(interactive ? 'link' : 'idle');
};

const onLeaveWindow = () => {
  visible = false;
  gsap.to(root.value, { opacity: 0, duration: 0.3 });
};
const SPARK_COLORS = ['#ff5c93', '#a78bff', '#ffb27a', '#e0306f', '#7be3b8', '#6ad0ff'];

// Every click throws a small burst of confetti dots.
const burst = (x, y) => {
  const parent = root.value;
  if (!parent) return;
  const count = 10;
  for (let i = 0; i < count; i += 1) {
    const dot = document.createElement('span');
    dot.className = 'cursor__spark';
    dot.style.background = SPARK_COLORS[i % SPARK_COLORS.length];
    parent.appendChild(dot);
    const angle = (i / count) * Math.PI * 2 + Math.random() * 0.6;
    const distance = gsap.utils.random(34, 92);
    gsap.fromTo(dot,
      { x, y, scale: gsap.utils.random(0.8, 1.4), autoAlpha: 1 },
      {
        x: x + Math.cos(angle) * distance,
        y: y + Math.sin(angle) * distance,
        scale: 0,
        autoAlpha: 0,
        duration: gsap.utils.random(0.55, 0.9),
        ease: 'power3.out',
        onComplete: () => dot.remove(),
      });
  }
};

const onDown = event => {
  gsap.to(ring, { scale: scaleFor(state) * 0.8, duration: 0.15, overwrite: 'auto' });
  burst(event.clientX, event.clientY);
};
const onUp = () => gsap.to(ring, { scale: scaleFor(state), duration: 0.5, ease: 'back.out(3)', overwrite: 'auto' });

onMounted(async () => {
  if (prefersReducedMotion() || !window.matchMedia(FINE_POINTER_QUERY).matches) return;
  enabled.value = true;
  await nextTick();
  ctx = gsap.context(() => {
    ring = root.value.querySelector('.cursor__ring');
    labelEl = root.value.querySelector('.cursor__label');
    gsap.set(root.value, { opacity: 0 });
    gsap.set(labelEl, { autoAlpha: 0 });
    gsap.set(['.cursor__follow', '.cursor__dot'], { xPercent: -50, yPercent: -50 });
    followX = gsap.quickTo('.cursor__follow', 'x', { duration: 0.32, ease: 'power3' });
    followY = gsap.quickTo('.cursor__follow', 'y', { duration: 0.32, ease: 'power3' });
    dotX = gsap.quickTo('.cursor__dot', 'x', { duration: 0.1, ease: 'power3' });
    dotY = gsap.quickTo('.cursor__dot', 'y', { duration: 0.1, ease: 'power3' });
  }, root.value);
  window.addEventListener('pointermove', onMove, { passive: true });
  window.addEventListener('pointerover', onOver, { passive: true });
  window.addEventListener('pointerdown', onDown, { passive: true });
  window.addEventListener('pointerup', onUp, { passive: true });
  document.documentElement.addEventListener('pointerleave', onLeaveWindow);
});

onUnmounted(() => {
  window.removeEventListener('pointermove', onMove);
  window.removeEventListener('pointerover', onOver);
  window.removeEventListener('pointerdown', onDown);
  window.removeEventListener('pointerup', onUp);
  document.documentElement.removeEventListener('pointerleave', onLeaveWindow);
  ctx?.revert();
});
</script>

<style scoped>
.cursor { position: fixed; z-index: 10030; inset: 0; pointer-events: none; }

.cursor__follow,
.cursor__dot {
  position: fixed;
  top: 0;
  left: 0;
  pointer-events: none;
}

.cursor__follow { display: grid; width: 38px; height: 38px; place-items: center; }

.cursor__ring {
  position: absolute;
  inset: 0;
  border: 1.5px solid rgba(255, 241, 234, 0.5);
  border-radius: 50%;
  transition: background-color 0.3s var(--ease-out), border-color 0.3s var(--ease-out);
}
.cursor__ring.is-link { border-color: var(--c-accent); background: rgba(255, 92, 147, 0.08); }
.cursor__ring.has-label { border-color: transparent; background: var(--c-cream); }

.cursor__label {
  position: relative;
  color: var(--c-bg);
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: -0.01em;
  white-space: nowrap;
}

.cursor__dot { width: 6px; height: 6px; border-radius: 50%; background: var(--c-accent); }
.cursor :deep(.cursor__spark) { position: fixed; top: 0; left: 0; width: 8px; height: 8px; margin: -4px 0 0 -4px; border-radius: 50%; pointer-events: none; }
</style>

<template>
  <div ref="root" class="ms" aria-hidden="true">
    <span
      v-for="(s, i) in list"
      :key="i"
      class="ms__item"
      :data-speed="s.speed"
      :style="{ top: s.top, left: s.left, right: s.right, width: s.size }"
    >
      <span class="ms__inner" :data-spin="s.spin" :data-float="s.float">
        <Shape :name="s.name" :palette="s.palette" :angle="s.angle || 135" />
      </span>
    </span>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { gsap, getSmoother, prefersReducedMotion } from '@/lib/gsap';
import Shape from './Shape.vue';

// Edge decorations for each section. ScrollSmoother's data-speed gives them real parallax.
const PRESETS = {
  about: [
    { name: 'star', palette: 'orange', left: '-2.5%', top: '6%', size: 'clamp(54px, 6.5vw, 110px)', speed: 0.8, spin: 1 },
    { name: 'ring', palette: 'candy', right: '-2%', top: '34%', size: 'clamp(56px, 7vw, 120px)', speed: 1.25, float: 1 },
    { name: 'diamond', palette: 'lilac', left: '1%', top: '70%', size: 'clamp(30px, 3.4vw, 56px)', speed: 0.9, spin: -1 },
    { name: 'spark', palette: 'mint', right: '3%', top: '86%', size: 'clamp(30px, 3.2vw, 52px)', speed: 1.1, spin: 1 },
  ],
  skills: [
    { name: 'flower', palette: 'sunset', right: '-3%', top: '28%', size: 'clamp(60px, 7.4vw, 124px)', speed: 0.85, spin: 1 },
    { name: 'zigzag', palette: 'pink', left: '-2%', top: '52%', size: 'clamp(60px, 7vw, 116px)', speed: 1.2, float: 1 },
    { name: 'drop', palette: 'sky', right: '2%', top: '74%', size: 'clamp(30px, 3.6vw, 60px)', speed: 0.95, float: 1 },
    { name: 'star', palette: 'violet', left: '2%', top: '90%', size: 'clamp(28px, 3vw, 50px)', speed: 1.15, spin: -1 },
  ],
  projects: [
    { name: 'ring', palette: 'sunset', left: '-3%', top: '3%', size: 'clamp(56px, 7vw, 120px)', speed: 1.2, float: 1 },
    { name: 'spark', palette: 'candy', right: '-1%', top: '12%', size: 'clamp(40px, 5vw, 84px)', speed: 0.85, spin: 1 },
    { name: 'blob', palette: 'mint', right: '-2.5%', top: '58%', size: 'clamp(46px, 5.4vw, 92px)', speed: 1.1, float: 1 },
    { name: 'diamond', palette: 'orange', left: '-1.5%', top: '80%', size: 'clamp(30px, 3.6vw, 60px)', speed: 0.9, spin: -1 },
  ],
  contact: [
    { name: 'star', palette: 'candy', left: '-2%', top: '10%', size: 'clamp(50px, 6vw, 100px)', speed: 0.85, spin: 1 },
    { name: 'leaf', palette: 'sky', right: '-2%', top: '60%', size: 'clamp(46px, 5.4vw, 90px)', speed: 1.15, float: 1 },
    { name: 'hourglass', palette: 'lilac', left: '1%', top: '78%', size: 'clamp(26px, 3vw, 48px)', speed: 1, spin: -1 },
  ],
};

const props = defineProps({ preset: { type: String, required: true } });
const list = computed(() => PRESETS[props.preset] || []);
const root = ref(null);

let triggers = [];
let ctx;

onMounted(() => {
  const el = root.value;
  if (!el || prefersReducedMotion()) return;
  const smoother = getSmoother();
  if (smoother) triggers = smoother.effects(el.querySelectorAll('[data-speed]')) || [];

  ctx = gsap.context(() => {
    gsap.utils.toArray('.ms__inner', el).forEach((inner, i) => {
      const spin = Number(inner.dataset.spin);
      const float = Number(inner.dataset.float);
      if (spin) gsap.to(inner, { rotate: spin * 360, duration: gsap.utils.random(14, 26), ease: 'none', repeat: -1 });
      if (float) gsap.to(inner, { y: gsap.utils.random(-22, 22), x: gsap.utils.random(-14, 14), rotate: gsap.utils.random(-25, 25), duration: gsap.utils.random(3, 5), ease: 'sine.inOut', yoyo: true, repeat: -1, delay: i * 0.2 });
    });
    // Pop in as the section arrives
    gsap.from('.ms__item', { scale: 0, autoAlpha: 0, rotate: -90, stagger: 0.12, duration: 1, ease: 'back.out(2)', scrollTrigger: { trigger: el, start: 'top 85%', once: true } });
  }, el);
});

onUnmounted(() => {
  triggers.forEach(trigger => trigger.kill());
  ctx?.revert();
});
</script>

<style scoped>
.ms { position: absolute; inset: 0; z-index: 0; pointer-events: none; }
.ms__item { position: absolute; display: block; }
.ms__inner { display: block; will-change: transform; }
</style>

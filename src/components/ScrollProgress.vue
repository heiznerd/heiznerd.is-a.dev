<template>
  <div ref="root" class="progress" aria-hidden="true"><span class="progress__bar"></span></div>
</template>

<script setup>
import { ref } from 'vue';
import { gsap } from '@/lib/gsap';
import { useGsap } from '@/composables/useGsap';

const root = ref(null);

useGsap(root, () => {
  gsap.fromTo('.progress__bar', { scaleX: 0 }, {
    scaleX: 1,
    ease: 'none',
    scrollTrigger: { start: 0, end: 'max', scrub: 0.3 },
  });
});
</script>

<style scoped>
.progress {
  position: fixed;
  z-index: 1001;
  top: 0;
  left: 0;
  width: 100%;
  height: 3px;
  pointer-events: none;
}
.progress__bar {
  display: block;
  width: 100%;
  height: 100%;
  background: var(--g-accent);
  transform: scaleX(0);
  transform-origin: left;
  transition: background 0.3s var(--ease-out);
}

</style>

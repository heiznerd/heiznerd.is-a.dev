<template>
  <div ref="root" class="ambient" aria-hidden="true">
    <span class="blob blob--pink"></span>
    <span class="blob blob--violet"></span>
    <span class="blob blob--orange"></span>
    <span class="blob blob--sky"></span>
    <span class="blob blob--rose"></span>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { gsap } from '@/lib/gsap';
import { useGsap, MEDIA } from '@/composables/useGsap';

const root = ref(null);

// A soft aurora behind the whole page: it drifts on its own, travels with scroll and leans toward the pointer.
useGsap(root, ({ root: el, mm }) => {
  mm.add(MEDIA, context => {
    if (!context.conditions.motion) return undefined;
    const blobs = gsap.utils.toArray('.blob', el);

    blobs.forEach(blob => {
      gsap.to(blob, {
        x: `+=${gsap.utils.random(-120, 120)}`,
        y: `+=${gsap.utils.random(-90, 90)}`,
        scale: gsap.utils.random(0.85, 1.2),
        duration: gsap.utils.random(9, 16),
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      });
    });

    // Colours trade places as you read down the page.
    gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { start: 0, end: 'max', scrub: 0.6 } })
      .to('.blob--pink', { top: '70%', left: '70%' }, 0)
      .to('.blob--violet', { top: '10%', left: '75%' }, 0)
      .to('.blob--orange', { top: '85%', left: '10%' }, 0)
      .to('.blob--sky', { top: '55%', left: '-5%' }, 0)
      .to('.blob--rose', { top: '20%', left: '10%' }, 0);

    if (!context.conditions.fine) return undefined;
    const movers = blobs.map((blob, i) => ({
      depth: 0.5 + i * 0.35,
      x: gsap.quickTo(blob, 'xPercent', { duration: 1.6, ease: 'power3' }),
      y: gsap.quickTo(blob, 'yPercent', { duration: 1.6, ease: 'power3' }),
    }));
    const onMove = event => {
      const nx = event.clientX / window.innerWidth - 0.5;
      const ny = event.clientY / window.innerHeight - 0.5;
      movers.forEach(m => { m.x(nx * 18 * m.depth); m.y(ny * 14 * m.depth); });
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  });
});
</script>

<style scoped>
.ambient { position: fixed; z-index: -1; inset: 0; overflow: hidden; pointer-events: none; }

.blob {
  position: absolute;
  width: 62vmax;
  height: 62vmax;
  margin: -31vmax 0 0 -31vmax;
  border-radius: 50%;
  will-change: transform;
}
.blob--pink { top: 8%; left: 12%; background: radial-gradient(closest-side, rgba(255, 92, 147, 0.2), transparent); }
.blob--violet { top: 70%; left: 80%; background: radial-gradient(closest-side, rgba(138, 92, 255, 0.2), transparent); }
.blob--orange { top: 40%; left: 95%; width: 48vmax; height: 48vmax; margin: -24vmax 0 0 -24vmax; background: radial-gradient(closest-side, rgba(255, 154, 92, 0.15), transparent); }
.blob--sky { top: 105%; left: 30%; width: 40vmax; height: 40vmax; margin: -20vmax 0 0 -20vmax; background: radial-gradient(closest-side, rgba(106, 208, 255, 0.1), transparent); }
.blob--rose { top: 60%; left: 5%; width: 44vmax; height: 44vmax; margin: -22vmax 0 0 -22vmax; background: radial-gradient(closest-side, rgba(224, 48, 111, 0.16), transparent); }

@media (max-width: 899px) {
  .blob { width: 90vmax; height: 90vmax; margin: -45vmax 0 0 -45vmax; }
}
</style>

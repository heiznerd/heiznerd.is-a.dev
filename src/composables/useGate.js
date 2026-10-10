import { onMounted, onUnmounted } from 'vue';
import { gsap, ScrollTrigger, engageGate, releaseGate, FINE_POINTER_QUERY } from '@/lib/gsap';

/**
 * Adds a "gate" to a section: if the visitor flies into it much faster than the
 * entrance animation can play, the page brakes at the heading for about a second.
 * Calm scrolling is never interrupted. Desktop + motion-allowed only.
 *
 * Options: target = selector of the element to land on (default: the section's first h2),
 *          velocity = px/s that counts as "fast", hold = seconds, trigger = ScrollTrigger start.
 */
export function useGate(rootRef, { target = 'h2', velocity = 1500, hold = 0.95, trigger = 'top 70%' } = {}) {
  let mm;

  onMounted(() => {
    const el = rootRef.value;
    if (!el) return;
    mm = gsap.matchMedia();
    mm.add(`${FINE_POINTER_QUERY} and (min-width: 900px) and (prefers-reduced-motion: no-preference)`, () => {
      const landing = el.querySelector(target) || el;
      const st = ScrollTrigger.create({
        trigger: el,
        start: trigger,
        once: true,
        onEnter: self => {
          if (self.direction !== 1) return;
          if (Math.abs(self.getVelocity()) < velocity) return;
          engageGate(landing, { hold });
        },
      });
      return () => st.kill();
    });
  });

  onUnmounted(() => {
    mm?.revert();
    releaseGate();
  });
}

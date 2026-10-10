import { onMounted, onUnmounted } from 'vue';
import { gsap, REDUCED_QUERY, DESKTOP_QUERY, FINE_POINTER_QUERY } from '@/lib/gsap';

/** Breakpoint/motion conditions shared by every component's gsap.matchMedia(). */
export const MEDIA = {
  motion: '(prefers-reduced-motion: no-preference)',
  reduce: REDUCED_QUERY,
  desktop: `${DESKTOP_QUERY} and (prefers-reduced-motion: no-preference)`,
  mobile: '(max-width: 899px) and (prefers-reduced-motion: no-preference)',
  fine: `${FINE_POINTER_QUERY} and (prefers-reduced-motion: no-preference)`,
};

/**
 * Vue lifecycle wrapper following the official GSAP framework guidance:
 * animations are created after mount inside a context scoped to the component
 * root, and everything (tweens, ScrollTriggers, SplitText) is reverted on unmount.
 *
 * setup({ root, mm, ctx }) runs once on mount. Use mm.add(MEDIA, fn) for
 * responsive / reduced-motion aware animation.
 */
export function useGsap(rootRef, setup) {
  let ctx;
  let mm;

  onMounted(() => {
    const root = rootRef.value;
    if (!root) return;
    mm = gsap.matchMedia(root);
    ctx = gsap.context(self => setup({ root, mm, ctx: self }), root);
  });

  onUnmounted(() => {
    mm?.revert();
    ctx?.revert();
  });

  return {
    /** Wrap event-handler animations so they are cleaned up with the component. */
    contextSafe: fn => (...args) => (ctx ? ctx.add(() => fn(...args)) : fn(...args)),
  };
}

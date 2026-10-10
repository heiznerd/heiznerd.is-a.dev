import { gsap, prefersReducedMotion, FINE_POINTER_QUERY } from '@/lib/gsap';

/**
 * v-magnetic="0.35" — element drifts toward the pointer and springs back.
 * Only active for fine pointers without reduced-motion; touch users get a plain control.
 */
export const vMagnetic = {
  mounted(el, binding) {
    if (prefersReducedMotion() || !window.matchMedia(FINE_POINTER_QUERY).matches) return;
    const strength = typeof binding.value === 'number' ? binding.value : 0.35;
    const xTo = gsap.quickTo(el, 'x', { duration: 0.7, ease: 'elastic.out(1, 0.45)' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.7, ease: 'elastic.out(1, 0.45)' });
    let rect = null;

    const enter = () => { rect = el.getBoundingClientRect(); };
    const move = event => {
      if (!rect) rect = el.getBoundingClientRect();
      xTo((event.clientX - (rect.left + rect.width / 2)) * strength);
      yTo((event.clientY - (rect.top + rect.height / 2)) * strength);
    };
    const leave = () => { rect = null; xTo(0); yTo(0); };

    el.addEventListener('pointerenter', enter);
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', leave);
    el._magnetic = { enter, move, leave };
  },
  unmounted(el) {
    const handlers = el._magnetic;
    if (!handlers) return;
    el.removeEventListener('pointerenter', handlers.enter);
    el.removeEventListener('pointermove', handlers.move);
    el.removeEventListener('pointerleave', handlers.leave);
    gsap.killTweensOf(el);
    delete el._magnetic;
  },
};

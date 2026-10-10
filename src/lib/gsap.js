// Central GSAP setup: plugins are registered exactly once here.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { SplitText } from 'gsap/SplitText';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';
import { CustomEase } from 'gsap/CustomEase';

gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText, DrawSVGPlugin, MorphSVGPlugin, ScrambleTextPlugin, CustomEase);

// Signature eases used across the site
CustomEase.create('hz.out', '0.16, 1, 0.3, 1');
CustomEase.create('hz.inOut', '0.76, 0, 0.24, 1');

gsap.defaults({ ease: 'hz.out', duration: 0.7 });

export const REDUCED_QUERY = '(prefers-reduced-motion: reduce)';
export const DESKTOP_QUERY = '(min-width: 900px)';
export const FINE_POINTER_QUERY = '(hover: hover) and (pointer: fine)';

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia(REDUCED_QUERY).matches;

let smoother = null;

/**
 * Creates the page-wide ScrollSmoother. Must run before any ScrollTrigger is created,
 * so it is called from main.js before the Vue app mounts.
 */
export const initSmoother = () => {
  if (smoother || prefersReducedMotion()) return smoother;
  smoother = ScrollSmoother.create({
    wrapper: '#smooth-wrapper',
    content: '#smooth-content',
    smooth: 0.6,
    effects: true,
    smoothTouch: false,
    ignoreMobileResize: true,
  });
  return smoother;
};

export const getSmoother = () => smoother;

// Scroll locks are keyed so independent owners (intro, menu, palette, section gates)
// can never unlock each other by accident.
const scrollLocks = new Set();

const applyScrollLock = () => {
  const locked = scrollLocks.size > 0;
  // ScrollSmoother can halt scrolling itself; toggling overflow would resize the
  // viewport (scrollbar) and force a full ScrollTrigger refresh, so only fall back to it.
  if (smoother) smoother.paused(locked);
  else document.documentElement.classList.toggle('is-scroll-locked', locked);
};

/** Pause/resume page scrolling (intro, command palette, mobile menu, gates). */
export const setScrollLocked = (locked, key = 'ui') => {
  if (locked) scrollLocks.add(key);
  else scrollLocks.delete(key);
  applyScrollLock();
};

/* ---------------------------------------------------------------------------
   Section gates — a short "speed bump" when someone arrives at a section much
   faster than its entrance animation can play. The page glides to the section
   heading and holds for a moment so the content is never skipped half-drawn.
   --------------------------------------------------------------------------- */
let gateTimer = null;

export const isGateActive = () => gateTimer !== null;

export const releaseGate = () => {
  if (gateTimer) gateTimer.kill();
  gateTimer = null;
  document.documentElement.classList.remove('is-gated');
  setScrollLocked(false, 'gate');
};

export const engageGate = (target, { hold = 0.7, viewportOffset = 0.2 } = {}) => {
  if (!smoother || gateTimer || scrollLocks.size > 0 || !target) return false;
  const y = Math.max(0, smoother.offset(target, `top ${Math.round(viewportOffset * 100)}%`));
  document.documentElement.classList.add('is-gated');
  setScrollLocked(true, 'gate');
  smoother.scrollTo(y, true);
  // Failsafe: the timer always releases the lock, even if something else goes wrong.
  gateTimer = gsap.delayedCall(hold, releaseGate);
  return true;
};

window.addEventListener('pagehide', releaseGate);

/* Catch-up: when scrolling stops, entrance tweens that are still playing finish quickly
   instead of leaving half-revealed content on screen. Scrubbed animations are untouched. */
ScrollTrigger.addEventListener('scrollEnd', () => {
  ScrollTrigger.getAll().forEach(trigger => {
    const anim = trigger.animation;
    if (!anim || trigger.vars.scrub || !trigger.vars.once) return;
    if (anim.isActive() && anim.timeScale() < 2.6) anim.timeScale(2.6);
  });
});

/** Scrolls to a section id or element, respecting ScrollSmoother + reduced motion. */
export const scrollToTarget = (target, { offset = 0 } = {}) => {
  const el = typeof target === 'string' ? document.getElementById(target.replace(/^#/, '')) : target;
  if (!el) return;
  if (smoother) {
    const y = smoother.offset(el, 'top top') - offset;
    smoother.scrollTo(Math.max(0, y), true);
    return;
  }
  const y = window.scrollY + el.getBoundingClientRect().top - offset;
  window.scrollTo({ top: Math.max(0, y), behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
};

/** Big-title entrance: letters spring up one by one when the heading scrolls into view. */
export const revealTitle = (el, trigger) => {
  if (!el) return null;
  const split = SplitText.create(el, { type: 'words,chars', charsClass: 'split-char' });
  return gsap.from(split.chars, {
    yPercent: 70,
    autoAlpha: 0,
    rotate: 8,
    stagger: 0.028,
    duration: 0.8,
    ease: 'expo.out',
    scrollTrigger: { trigger: trigger || el, start: 'top 94%', once: true },
  });
};

/** Refresh triggers once fonts and late images have settled. */
export const refreshWhenSettled = () => {
  const refresh = () => ScrollTrigger.refresh();
  if (document.fonts?.ready) document.fonts.ready.then(refresh);
  window.addEventListener('load', refresh, { once: true });
};

export { gsap, ScrollTrigger, ScrollSmoother, SplitText, DrawSVGPlugin, MorphSVGPlugin, ScrambleTextPlugin };

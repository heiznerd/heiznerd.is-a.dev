<template>
  <div ref="root" class="art" :class="`art--${kind}`" aria-hidden="true">
    <!-- Danshi: osu!-style hit circles, slider and a render progress bar -->
    <svg v-if="kind === 'danshi'" class="art__svg" viewBox="0 0 400 300">
      <defs>
        <linearGradient id="dz-a" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fec5fb" /><stop offset="1" stop-color="#f100cb" /></linearGradient>
        <linearGradient id="dz-b" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#e0dcff" /><stop offset="1" stop-color="#6f66ff" /></linearGradient>
        <linearGradient id="dz-c" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#bef3fe" /><stop offset="1" stop-color="#00bae2" /></linearGradient>
      </defs>
      <path class="dz-slider" d="M92 196C140 120 220 112 300 90" fill="none" stroke="#fffce1" stroke-opacity="0.18" stroke-width="44" stroke-linecap="round" />
      <path class="dz-slider-line" d="M92 196C140 120 220 112 300 90" fill="none" stroke="#fec5fb" stroke-width="4" stroke-linecap="round" stroke-dasharray="1 12" />
      <g v-for="(c, i) in hitCircles" :key="i" class="dz-hit" :transform="`translate(${c.x} ${c.y})`">
        <circle class="dz-approach" r="30" fill="none" :stroke="c.stroke" stroke-width="3" />
        <circle class="dz-circle" r="30" :fill="`url(#${c.grad})`" stroke="#fffce1" stroke-width="4" />
        <text class="dz-num" y="9" text-anchor="middle" fill="#0e100f">{{ i + 1 }}</text>
        <text class="dz-score" y="-46" text-anchor="middle" :fill="c.stroke">300</text>
      </g>
      <g class="dz-rec" transform="translate(24 28)">
        <rect width="86" height="30" rx="15" fill="#fffce1" />
        <circle class="dz-rec-dot" cx="18" cy="15" r="6" fill="#f100cb" />
        <text x="32" y="20" fill="#0e100f" class="dz-label">REC</text>
      </g>
      <text x="376" y="48" text-anchor="end" fill="#fffce1" class="dz-combo">x<tspan class="dz-combo-num">128</tspan></text>
      <g transform="translate(24 252)">
        <rect width="352" height="12" rx="6" fill="#fffce1" fill-opacity="0.12" />
        <rect class="dz-progress" width="352" height="12" rx="6" fill="url(#dz-a)" />
        <text x="0" y="-10" class="dz-small" fill="#bbbaa6">replay.osr → video.mp4</text>
      </g>
    </svg>

    <!-- NekoAI: a companion with ears, blinking eyes and chat bubbles -->
    <div v-else-if="kind === 'nekoai'" class="ai">
      <div class="ai__bubbles">
        <span class="ai__bubble ai__bubble--in">Hi! ✨</span>
        <span class="ai__bubble ai__bubble--out">Wanna chat?</span>
        <span class="ai__bubble ai__bubble--in ai__typing"><i></i><i></i><i></i></span>
      </div>
      <svg class="ai__buddy" viewBox="0 0 200 190">
        <defs>
          <linearGradient id="ai-body" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#e0dcff" /><stop offset="1" stop-color="#9d95ff" /></linearGradient>
        </defs>
        <g class="ai__head">
          <path class="ai__ear ai__ear--l" d="M46 70L52 12L94 46Z" fill="url(#ai-body)" />
          <path class="ai__ear ai__ear--r" d="M154 70L148 12L106 46Z" fill="url(#ai-body)" />
          <rect x="24" y="36" width="152" height="136" rx="64" fill="url(#ai-body)" />
          <g class="ai__eyes">
            <ellipse class="ai__eye" cx="72" cy="104" rx="11" ry="15" fill="#0e100f" />
            <ellipse class="ai__eye" cx="128" cy="104" rx="11" ry="15" fill="#0e100f" />
            <circle cx="76" cy="98" r="4" fill="#fffce1" class="ai__shine" />
            <circle cx="132" cy="98" r="4" fill="#fffce1" class="ai__shine" />
          </g>
          <circle cx="54" cy="128" r="9" fill="#fec5fb" />
          <circle cx="146" cy="128" r="9" fill="#fec5fb" />
          <path class="ai__mouth" d="M90 130Q100 140 110 130" fill="none" stroke="#0e100f" stroke-width="4" stroke-linecap="round" />
        </g>
      </svg>
      <div class="ai__moods">
        <span>cheerful</span><span>calm</span><span>playful</span>
      </div>
    </div>

    <!-- NekoComics-V2: a page of panels that flip in, with a burst -->
    <div v-else-if="kind === 'comics'" class="cx">
      <div class="cx__page">
        <span class="cx__panel cx__panel--a"><Shape name="star" palette="peach" /></span>
        <span class="cx__panel cx__panel--b"><Shape name="drop" palette="pink" /></span>
        <span class="cx__panel cx__panel--c"><span class="cx__speech">!?</span></span>
        <span class="cx__panel cx__panel--d"><Shape name="leaf" palette="green" /></span>
        <span class="cx__panel cx__panel--e"><Shape name="ring" palette="blue" /></span>
      </div>
      <span class="cx__burst">
        <svg viewBox="0 0 120 120"><path d="M60 4l10 26 26-14-8 28 28 6-24 16 18 22-28-2 2 28-24-16-24 16 2-28-28 2 18-22L4 70l28-6-8-28 26 14Z" fill="#fffce1" /></svg>
        <b>V2!</b>
      </span>
      <span class="cx__pager mono">p. <b class="cx__page-num">01</b></span>
    </div>

    <!-- NekoStream CLI: terminal that types and "plays" an episode -->
    <div v-else class="term">
      <div class="term__bar"><i></i><i></i><i></i><span class="mono">~/anime</span></div>
      <div class="term__body">
        <p><span class="term__ps">$</span> <span class="term__cmd">npm install -g nekostream</span><span class="term__caret">▌</span></p>
        <p class="term__out term__ok">✔ added nekostream</p>
        <p class="term__out"><span class="term__ps">$</span> nekostream</p>
        <p class="term__out term__dim">? Search: <span class="term__hl">rom-com</span></p>
        <p class="term__out">▶ Playing EP 01</p>
        <div class="term__out term__track"><span class="term__fill"></span></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { gsap } from '@/lib/gsap';
import { useGsap, MEDIA } from '@/composables/useGsap';
import Shape from './ui/Shape.vue';

const props = defineProps({ kind: { type: String, required: true } });
const root = ref(null);

const hitCircles = [
  { x: 92, y: 196, grad: 'dz-a', stroke: '#fec5fb' },
  { x: 196, y: 128, grad: 'dz-b', stroke: '#9d95ff' },
  { x: 300, y: 90, grad: 'dz-c', stroke: '#00bae2' },
];

const builders = {
  danshi(tl, el) {
    const hits = gsap.utils.toArray('.dz-hit', el);
    tl.set('.dz-score', { autoAlpha: 0 })
      .fromTo('.dz-progress', { scaleX: 0 }, { scaleX: 1, transformOrigin: 'left center', duration: 4.2, ease: 'none' }, 0)
      .fromTo('.dz-slider-line', { strokeDashoffset: 0 }, { strokeDashoffset: -130, duration: 4.2, ease: 'none' }, 0)
      .to('.dz-rec-dot', { opacity: 0.2, duration: 0.5, repeat: 7, yoyo: true, ease: 'steps(1)' }, 0);
    hits.forEach((hit, i) => {
      const at = 0.3 + i * 1.1;
      tl.fromTo(hit.querySelector('.dz-approach'), { scale: 2.6, opacity: 0, transformOrigin: 'center' }, { scale: 1, opacity: 1, duration: 0.8, ease: 'none' }, at)
        .fromTo(hit.querySelector('.dz-circle'), { scale: 0.6, opacity: 0, transformOrigin: 'center' }, { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(3)' }, at)
        .to(hit.querySelector('.dz-circle'), { scale: 1.25, duration: 0.18, ease: 'power2.out', yoyo: true, repeat: 1, transformOrigin: 'center' }, at + 0.8)
        .to(hit.querySelector('.dz-approach'), { opacity: 0, duration: 0.15 }, at + 0.8)
        .fromTo(hit.querySelector('.dz-score'), { autoAlpha: 0, y: 10, scale: 0.6, transformOrigin: 'center' }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.35, ease: 'back.out(3)' }, at + 0.85)
        .to(hit.querySelector('.dz-score'), { autoAlpha: 0, y: -12, duration: 0.4 }, at + 1.5);
    });
    tl.fromTo('.dz-combo', { scale: 1 }, { scale: 1.2, transformOrigin: 'right center', duration: 0.2, yoyo: true, repeat: 5, ease: 'power1.inOut' }, 1.2);
  },
  nekoai(tl, el) {
    tl.set('.ai__bubble', { autoAlpha: 0, y: 14, scale: 0.8 })
      .to('.ai__eye', { scaleY: 0.1, transformOrigin: 'center', duration: 0.09, yoyo: true, repeat: 1 }, 0.4)
      .to('.ai__bubble', { autoAlpha: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.9, ease: 'back.out(2.2)' }, 0.3)
      .to('.ai__typing i', { y: -5, duration: 0.25, stagger: 0.12, yoyo: true, repeat: 3, ease: 'sine.inOut' }, 2.2)
      .to('.ai__ear--l', { rotate: -10, transformOrigin: '80% 90%', duration: 0.25, yoyo: true, repeat: 3 }, 1.1)
      .to('.ai__head', { y: -8, duration: 0.6, yoyo: true, repeat: 3, ease: 'sine.inOut', transformOrigin: 'center' }, 0)
      .to('.ai__eye', { scaleY: 0.1, transformOrigin: 'center', duration: 0.09, yoyo: true, repeat: 1 }, 2.8)
      .fromTo('.ai__moods span', { backgroundColor: 'rgba(255,252,225,0)', color: '#fffce1' }, { backgroundColor: '#fffce1', color: '#0e100f', duration: 0.3, stagger: { each: 1, yoyo: true, repeat: 1, repeatDelay: 0.6 } }, 0.2)
      .to('.ai__bubble', { autoAlpha: 0, y: -10, duration: 0.4, stagger: 0.1 }, 3.6);

    // pupils follow the pointer on fine pointers
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      const eyes = el.querySelector('.ai__eyes');
      const xTo = gsap.quickTo(eyes, 'x', { duration: 0.5, ease: 'power3' });
      const yTo = gsap.quickTo(eyes, 'y', { duration: 0.5, ease: 'power3' });
      const move = e => {
        const r = el.getBoundingClientRect();
        xTo(gsap.utils.clamp(-8, 8, (e.clientX - (r.left + r.width / 2)) / 40));
        yTo(gsap.utils.clamp(-6, 6, (e.clientY - (r.top + r.height / 2)) / 40));
      };
      window.addEventListener('pointermove', move, { passive: true });
      return () => window.removeEventListener('pointermove', move);
    }
    return undefined;
  },
  comics(tl) {
    const counter = { v: 1 };
    tl.fromTo('.cx__panel', { rotateY: -95, autoAlpha: 0, transformOrigin: 'left center' }, { rotateY: 0, autoAlpha: 1, duration: 0.7, stagger: 0.25, ease: 'back.out(1.4)' }, 0)
      .fromTo('.cx__panel .shape', { scale: 0, rotate: -60 }, { scale: 1, rotate: 0, duration: 0.6, stagger: 0.25, ease: 'back.out(2.5)' }, 0.25)
      .fromTo('.cx__speech', { scale: 0 }, { scale: 1, duration: 0.5, ease: 'elastic.out(1, 0.4)' }, 0.9)
      .fromTo('.cx__burst', { scale: 0, rotate: -40 }, { scale: 1, rotate: 0, duration: 0.7, ease: 'elastic.out(1, 0.45)' }, 1.6)
      .to(counter, { v: 24, duration: 1.4, ease: 'power2.inOut', onUpdate() { const n = root.value?.querySelector('.cx__page-num'); if (n) n.textContent = String(Math.round(counter.v)).padStart(2, '0'); } }, 1.4)
      .to('.cx__panel', { rotateY: 95, autoAlpha: 0, duration: 0.5, stagger: 0.08, ease: 'power2.in', transformOrigin: 'right center' }, 3.6)
      .to('.cx__burst', { scale: 0, duration: 0.3 }, 3.6);
  },
  terminal(tl, el) {
    const cmd = el.querySelector('.term__cmd');
    const full = cmd.textContent;
    const typed = { n: 0 };
    tl.set('.term__out', { autoAlpha: 0, y: 6 })
      .call(() => { cmd.textContent = ''; }, null, 0)
      .to(typed, { n: full.length, duration: 1.3, ease: `steps(${full.length})`, onUpdate: () => { cmd.textContent = full.slice(0, Math.round(typed.n)); } }, 0.2)
      .to('.term__out', { autoAlpha: 1, y: 0, duration: 0.25, stagger: 0.35 }, 1.7)
      .fromTo('.term__fill', { scaleX: 0 }, { scaleX: 1, transformOrigin: 'left', duration: 1.6, ease: 'none' }, 3.6);
    return () => { cmd.textContent = full; };
  },
};

useGsap(root, ({ root: el, mm }) => {
  mm.add(MEDIA, context => {
    if (!context.conditions.motion) return undefined;
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.8, paused: true });
    const cleanup = builders[props.kind]?.(tl, el);
    // Only animate while visible on screen.
    gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: 'top bottom',
        end: 'bottom top',
        onToggle: self => (self.isActive ? tl.play() : tl.pause()),
      },
    });
    return cleanup;
  });
});
</script>

<style scoped>
.art { position: relative; width: 100%; height: 100%; display: grid; place-items: center; overflow: hidden; }
.art__svg { width: 92%; height: auto; overflow: visible; }

/* Danshi */
.dz-num { font: 700 26px var(--font-sans); }
.dz-score { font: 800 20px var(--font-sans); }
.dz-label { font: 700 13px var(--font-mono); }
.dz-combo { font: 700 30px var(--font-sans); letter-spacing: -0.04em; }
.dz-small { font: 500 12px var(--font-mono); }

/* NekoAI */
.ai { position: relative; display: grid; width: 100%; height: 100%; grid-template-rows: 1fr auto; place-items: center; padding: 8%; }
.ai__buddy { width: min(62%, 260px); overflow: visible; }
.ai__bubbles { position: absolute; top: 10%; right: 8%; display: grid; gap: 8px; justify-items: end; }
.ai__bubble { padding: 8px 14px; border-radius: 18px 18px 4px 18px; color: var(--c-bg); background: var(--c-cream); font-size: 0.9rem; font-weight: 600; }
.ai__bubble--out { border-radius: 18px 18px 18px 4px; background: var(--c-lilac); justify-self: start; }
.ai__typing { display: inline-flex; gap: 5px; }
.ai__typing i { display: block; width: 7px; height: 7px; border-radius: 50%; background: var(--c-bg); }
.ai__moods { display: flex; gap: 8px; margin-top: 12px; }
.ai__moods span { padding: 6px 12px; border: 1.5px solid var(--c-cream); border-radius: var(--radius-pill); color: var(--c-cream); font-size: 0.8rem; font-weight: 600; }

/* NekoComics */
.cx { position: relative; width: 100%; height: 100%; display: grid; place-items: center; perspective: 900px; }
.cx__page {
  display: grid;
  width: 74%;
  aspect-ratio: 0.78;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1.2fr 1fr 1fr;
  gap: 8px;
  padding: 10px;
  border-radius: 14px;
  background: var(--c-cream);
  transform: rotate(-3deg);
}
.cx__panel { display: grid; place-items: center; border: 3px solid var(--c-bg); border-radius: 8px; background: var(--c-bg-3); overflow: hidden; }
.cx__panel .shape { width: 52%; }
.cx__panel--a { grid-column: 1 / -1; background: #2a2620; }
.cx__panel--c { background: var(--c-pink); }
.cx__panel--d { grid-row: span 2; background: #1c2a20; }
.cx__speech { color: var(--c-bg); font-size: 2.2rem; font-weight: 800; letter-spacing: -0.04em; }
.cx__burst { position: absolute; top: 6%; right: 6%; display: grid; width: 26%; place-items: center; }
.cx__burst svg { width: 100%; }
.cx__burst b { position: absolute; color: var(--c-bg); font-size: clamp(1rem, 2vw, 1.6rem); font-weight: 800; transform: rotate(-8deg); }
.cx__pager { position: absolute; left: 8%; bottom: 6%; color: var(--c-cream-75); }
.cx__pager b { color: var(--c-cream); }

/* Terminal */
.term { width: 88%; overflow: hidden; border: 1.5px solid var(--c-line); border-radius: 16px; background: #090a09; font-family: var(--font-mono); }
.term__bar { display: flex; align-items: center; gap: 7px; padding: 12px 14px; border-bottom: 1px solid var(--c-line); }
.term__bar i { width: 11px; height: 11px; border-radius: 50%; background: var(--c-orange); }
.term__bar i:nth-child(2) { background: var(--c-lime); }
.term__bar i:nth-child(3) { background: var(--c-blue); }
.term__bar span { margin-left: auto; color: var(--c-cream-75); }
.term__body { display: grid; gap: 10px; padding: 18px; color: var(--c-cream); font-size: clamp(0.78rem, 1.05vw, 0.95rem); }
.term__ps { color: var(--c-green); }
.term__caret { color: var(--c-green); animation: blink 1s steps(1) infinite; }
.term__ok { color: var(--c-lime); }
.term__dim { color: var(--c-cream-75); }
.term__hl { color: var(--c-pink); }
.term__track { height: 8px; border-radius: 4px; background: var(--c-line); overflow: hidden; }
.term__fill { display: block; height: 100%; background: var(--g-green); transform: scaleX(0.4); transform-origin: left; }

@keyframes blink { 50% { opacity: 0; } }
@media (prefers-reduced-motion: reduce) { .term__caret { animation: none; } }
</style>

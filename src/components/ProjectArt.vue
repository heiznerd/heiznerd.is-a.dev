<template>
  <div ref="root" class="art" :class="`art--${kind}`" aria-hidden="true">
    <!-- Danshi: a real danser render + the real danshi CLI output -->
    <div v-if="kind === 'danshi'" class="media">
      <div class="media__frame">
        <video
          ref="vid"
          class="media__video"
          src="/footage/danshi-render.mp4"
          poster="/footage/danshi-poster.jpg"
          muted
          loop
          playsinline
          preload="none"
        ></video>
        <span class="media__chip mono"><i class="media__dot"></i>REC · danser-go</span>
      </div>
      <div class="term term--strip">
        <p v-for="(line, i) in danshiLines" :key="i" class="term__line" :class="{ 'term__line--card': i < danshiCard }" v-html="line"></p>
      </div>
    </div>

    <!-- NekoAI: a cut from the real NekoAI trailer -->
    <div v-else-if="kind === 'nekoai'" class="media media--solo">
      <div class="media__frame media__frame--solo">
        <video
          ref="vid"
          class="media__video"
          src="/footage/nekoai-trailer.mp4"
          poster="/footage/nekoai-poster.jpg"
          muted
          loop
          playsinline
          preload="none"
        ></video>
        <span class="media__chip mono"><i class="media__dot"></i>trailer · nekoai.is-a.dev</span>
      </div>
      <div class="media__stills">
        <img src="/footage/nekoai-app.jpg" alt="" loading="lazy" decoding="async" width="640" height="360" />
        <img src="/footage/nekoai-cover.jpg" alt="" loading="lazy" decoding="async" width="640" height="536" />
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
        <svg viewBox="0 0 120 120"><path d="M60 4l10 26 26-14-8 28 28 6-24 16 18 22-28-2 2 28-24-16-24 16 2-28-28 2 18-22L4 70l28-6-8-28 26 14Z" fill="#fff1ea" /></svg>
        <b>V2!</b>
      </span>
      <span class="cx__pager mono">p. <b class="cx__page-num">01</b></span>
    </div>

    <!-- NekoStream CLI: the real nekostream terminal UI -->
    <div v-else class="term term--full">
      <div class="term__bar"><i></i><i></i><i></i><span class="mono">~/anime</span></div>
      <div class="term__body">
        <p class="term__prompt"><span class="term__ps">$</span> <span class="term__cmd">nekostream</span><span class="term__caret">▌</span></p>
        <p v-for="(line, i) in nekoLines" :key="i" class="term__line term__out" v-html="line"></p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { gsap } from '@/lib/gsap';
import { useGsap, MEDIA } from '@/composables/useGsap';
import { cliFootage } from '@/data/cliFootage';
import Shape from './ui/Shape.vue';

const props = defineProps({ kind: { type: String, required: true } });
const root = ref(null);
const vid = ref(null);

// Real CLI output, captured from the published packages. Static, trusted markup.
const blank = line => line.replace(/<[^>]+>/g, '').trim() === '';
const danshiCard = cliFootage.danshi.replay.length;
const danshiLines = [...cliFootage.danshi.replay, ...cliFootage.danshi.status].filter(l => !blank(l));
const nekoLines = [...cliFootage.nekostream.banner, ...cliFootage.nekostream.card].filter(l => !blank(l));

const play = () => vid.value?.play().catch(() => {});
const pause = () => vid.value?.pause();

const builders = {
  danshi(tl, el) {
    // One loop = one clip. The CLI lines print out while the render plays.
    tl.to({}, { duration: 10 }, 0)
      .call(() => { if (vid.value) vid.value.currentTime = 0; }, null, 0)
      .set(el.querySelectorAll('.term__line'), { autoAlpha: 0, y: 4 }, 0)
      .to(el.querySelectorAll('.term__line'), { autoAlpha: 1, y: 0, duration: 0.2, stagger: 0.18 }, 0.4);
    return undefined;
  },
  nekoai(tl) {
    tl.to({}, { duration: 9 }, 0);
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
    // Type the command, then print the real UI top to bottom.
    const cmd = el.querySelector('.term__cmd');
    const full = cmd.textContent;
    const typed = { n: 0 };
    const lines = el.querySelectorAll('.term__out');
    tl.set(lines, { autoAlpha: 0, y: 4 })
      .call(() => { cmd.textContent = ''; }, null, 0)
      .to(typed, { n: full.length, duration: 0.9, ease: `steps(${full.length})`, onUpdate: () => { cmd.textContent = full.slice(0, Math.round(typed.n)); } }, 0.2)
      .to(lines, { autoAlpha: 1, y: 0, duration: 0.2, stagger: 0.14 }, 1.4)
      .to({}, { duration: 2.2 });
    return () => { cmd.textContent = full; };
  },
};

useGsap(root, ({ root: el, mm }) => {
  mm.add(MEDIA, context => {
    if (!context.conditions.motion) return undefined;
    const isVideo = props.kind === 'danshi' || props.kind === 'nekoai';
    const tl = gsap.timeline({ repeat: -1, repeatDelay: isVideo ? 0 : 0.8, paused: true });
    const cleanup = builders[props.kind]?.(tl, el);
    // Only animate (and decode video) while visible on screen.
    gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: 'top bottom',
        end: 'bottom top',
        onToggle: self => {
          if (self.isActive) { tl.play(); if (isVideo) play(); } else { tl.pause(); if (isVideo) pause(); }
        },
      },
    });
    return () => { cleanup?.(); pause(); };
  });
});
</script>

<style scoped>
.art { position: relative; width: 100%; height: 100%; display: grid; place-items: center; overflow: hidden; }

/* Footage (danshi render, NekoAI trailer) */
.media { display: flex; width: 100%; height: 100%; flex-direction: column; gap: 10px; padding: 12px; }
.media--solo { justify-content: center; }
.media__frame { position: relative; flex: 1 1 0; min-height: 0; overflow: hidden; border: 1.5px solid var(--c-line); border-radius: 14px; background: #050506; }
.media__frame--solo { flex: 0 0 auto; aspect-ratio: 16 / 9; }
.media__video { display: block; width: 100%; height: 100%; object-fit: cover; }
/* Crop the danser HUD text hugging the left edge of the capture. */
.art--danshi .media__video { transform: scale(1.18); transform-origin: 100% 50%; }
.media__stills { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.media__stills { align-items: start; }
@media (max-width: 899px) { .media__stills { display: none; } }
.media__stills img { display: block; width: 100%; height: auto; aspect-ratio: 16 / 10; object-fit: cover; border: 1.5px solid var(--c-line); border-radius: 12px; background: #050506; }
.media__chip {
  position: absolute;
  top: 10px;
  left: 10px;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 5px 10px;
  border-radius: var(--radius-pill);
  color: var(--c-bg);
  background: var(--c-cream);
  font-size: 0.68rem;
  font-weight: 700;
}
.media__dot { width: 8px; height: 8px; border-radius: 50%; background: var(--c-accent); animation: blink 1.2s steps(1) infinite; }

/* Real CLI output */
.term {
  overflow: hidden;
  border: 1.5px solid var(--c-line);
  border-radius: 14px;
  background: #090a09;
  font-family: var(--font-mono);
  container-type: inline-size;
}
.term--full { width: 92%; }
.term--strip { padding: 10px 12px; }
.term__line {
  margin: 0;
  /* A face with real box-drawing glyphs keeps the card borders aligned. */
  font-family: 'Cascadia Mono', Consolas, Menlo, 'DejaVu Sans Mono', 'Courier New', monospace;
  color: var(--c-cream-75);
  font-size: clamp(7px, 2.5cqw, 11.5px);
  line-height: 1.35;
  white-space: pre;
}
.term__bar { display: flex; align-items: center; gap: 7px; padding: 10px 14px; border-bottom: 1px solid var(--c-line); }
.term__bar i { width: 10px; height: 10px; border-radius: 50%; background: var(--c-orange); }
.term__bar i:nth-child(2) { background: var(--c-peach); }
.term__bar i:nth-child(3) { background: var(--c-blue); }
.term__bar span { margin-left: auto; color: var(--c-cream-75); font-size: 0.75rem; }
.term__body { display: grid; gap: 0; padding: 12px 14px 14px; }
.term__prompt { margin: 0 0 8px; color: var(--c-cream); font-size: clamp(8px, 3cqw, 13px); }
.term__ps { color: var(--c-accent); }
.term__caret { color: var(--c-accent); animation: blink 1s steps(1) infinite; }

/* The replay card is tall; on small screens keep just the status lines. */
@media (max-width: 899px) {
  .term__line--card { display: none; }
}

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
.cx__panel--a { grid-column: 1 / -1; background: #2a2024; }
.cx__panel--c { background: var(--c-pink); }
.cx__panel--d { grid-row: span 2; background: #2a1c2a; }
.cx__speech { color: var(--c-bg); font-size: 2.2rem; font-weight: 800; letter-spacing: -0.04em; }
.cx__burst { position: absolute; top: 6%; right: 6%; display: grid; width: 26%; place-items: center; }
.cx__burst svg { width: 100%; }
.cx__burst b { position: absolute; color: var(--c-bg); font-size: clamp(1rem, 2vw, 1.6rem); font-weight: 800; transform: rotate(-8deg); }
.cx__pager { position: absolute; left: 8%; bottom: 6%; color: var(--c-cream-75); }
.cx__pager b { color: var(--c-cream); }

@keyframes blink { 50% { opacity: 0; } }
@media (prefers-reduced-motion: reduce) { .term__caret, .media__dot { animation: none; } }
</style>

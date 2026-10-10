<template>
  <section ref="root" class="motto" aria-label="Motto">
    <p class="sr-only">{{ phrases.map(p => p.words.join(' ')).join('. ') }}.</p>
    <div class="motto__pin">
      <div class="motto__track" aria-hidden="true">
        <template v-for="(phrase, p) in phrases" :key="p">
          <span v-for="(word, w) in phrase.words" :key="`${p}-${w}`" class="motto__word" :class="{ 'is-hl': w === phrase.hl }" :style="{ '--grad': phrase.grad }">
            <span v-for="(ch, c) in word" :key="c" class="motto__char">{{ ch }}</span>
          </span>
          <span class="motto__sep"><Shape :name="phrase.shape" :palette="phrase.palette" /></span>
        </template>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue';
import { gsap } from '@/lib/gsap';
import { useGsap, MEDIA } from '@/composables/useGsap';
import Shape from './ui/Shape.vue';

// The site's existing motto ("build with intention · learn in public · ship something kind").
const phrases = [
  { words: ['Build', 'with', 'intention'], hl: 2, grad: 'var(--g-green)', shape: 'star', palette: 'orange' },
  { words: ['Learn', 'in', 'public'], hl: 2, grad: 'linear-gradient(120deg, #fec5fb, #f100cb)', shape: 'flower', palette: 'summer' },
  { words: ['Ship', 'something', 'kind'], hl: 2, grad: 'linear-gradient(120deg, #ffd9b0, #ff8709)', shape: 'ring', palette: 'violet' },
];

const root = ref(null);

useGsap(root, ({ root: el, mm }) => {
  mm.add(MEDIA, context => {
    const { motion, desktop } = context.conditions;
    if (!motion) return;

    const track = el.querySelector('.motto__track');
    const distance = () => Math.max(0, track.scrollWidth - window.innerWidth * 0.62);

    const scrollTween = gsap.fromTo(track, { x: () => window.innerWidth * 0.55 }, {
      x: () => -distance(),
      ease: 'none',
      scrollTrigger: desktop
        ? { trigger: el, pin: '.motto__pin', start: 'top top', end: () => `+=${distance() * 0.9}`, scrub: 0.6, invalidateOnRefresh: true }
        : { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 0.4, invalidateOnRefresh: true },
    });

    // Letters bounce into place as each word crosses the screen.
    gsap.utils.toArray('.motto__word', el).forEach(word => {
      gsap.from(word.querySelectorAll('.motto__char'), {
        yPercent: () => gsap.utils.random(-90, 90),
        rotate: () => gsap.utils.random(-30, 30),
        stagger: 0.04,
        ease: 'back.out(2)',
        scrollTrigger: {
          trigger: word,
          containerAnimation: scrollTween,
          start: 'left 98%',
          end: 'left 52%',
          scrub: 0.5,
        },
      });
    });

    gsap.utils.toArray('.motto__sep', el).forEach(sep => {
      gsap.fromTo(sep, { rotate: -180, scale: 0.4 }, {
        rotate: 180,
        scale: 1,
        ease: 'none',
        scrollTrigger: { trigger: sep, containerAnimation: scrollTween, start: 'left right', end: 'right left', scrub: true },
      });
    });
  });
});
</script>

<style scoped>
.motto { position: relative; overflow: hidden; }
.motto__pin { display: flex; height: 100svh; align-items: center; overflow: hidden; }

.motto__track {
  display: flex;
  align-items: center;
  gap: 0.24em;
  width: max-content;
  padding-inline: 4vw;
  font-size: clamp(5rem, 15vw, 15rem);
  font-weight: 500;
  line-height: 1;
  letter-spacing: -0.06em;
  white-space: nowrap;
  will-change: transform;
}

.motto__word { display: inline-flex; }
.motto__char { display: inline-block; will-change: transform; }
.motto__word.is-hl .motto__char { background: var(--grad); -webkit-background-clip: text; background-clip: text; color: transparent; }
.motto__sep { display: inline-block; width: 0.62em; margin-inline: 0.18em; flex: 0 0 auto; }

@media (max-width: 899px) {
  .motto__pin { height: auto; padding-block: clamp(80px, 16vw, 140px); }
  .motto__track { font-size: 24vw; }
}

@media (prefers-reduced-motion: reduce) {
  .motto__pin { height: auto; padding-block: 96px; }
  .motto__track { flex-wrap: wrap; width: auto; padding-inline: var(--gutter); font-size: clamp(3rem, 9vw, 8rem); white-space: normal; row-gap: 0.1em; }
}
</style>

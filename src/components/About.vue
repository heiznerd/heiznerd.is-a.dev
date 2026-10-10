<template>
  <section id="about" ref="root" class="about section" aria-labelledby="about-title">
    <div class="container">
      <header class="about__head" data-reveal>
        <span class="mono about__eyebrow">01 — {{ t.label }}</span>
        <BraceLabel id="about-title" tag="h2" size="md">{{ t.title }}</BraceLabel>
        <span v-if="t.headerSubtitle" class="about__sub">{{ t.headerSubtitle }}</span>
      </header>

      <div class="about__statement-wrap">
        <p class="about__statement">
          <template v-for="(word, i) in statementWords" :key="i">
            <span class="about__word" :class="word.tone && `is-hl is-${word.tone}`">{{ word.text }}</span>{{ ' ' }}
          </template>
        </p>
        <div class="about__deco" aria-hidden="true">
          <span class="about__deco-star"><Shape name="spark" palette="orange" :angle="150" /></span>
          <svg class="about__deco-loop" viewBox="0 0 100 100" fill="none"><path class="about__loop-path" :d="loopPath" stroke="#9d95ff" stroke-width="2.2" stroke-linecap="round" /></svg>
          <span class="about__deco-dot about__deco-dot--1"></span>
          <span class="about__deco-dot about__deco-dot--2"></span>
          <span class="about__deco-diamond"><Shape name="diamond" palette="violet" /></span>
        </div>
      </div>

      <div class="about__grid">
        <article class="profile" data-reveal>
          <div class="profile__media">
            <div class="profile__frame">
              <img src="/stickers/misc/evernight-dancing.gif" alt="Heiznerd" class="profile__img" width="360" height="420" loading="lazy" decoding="async" />
            </div>
            <svg class="profile__badge" viewBox="0 0 120 120" aria-hidden="true">
              <defs><path id="about-badge-circle" d="M60 60m-46 0a46 46 0 1 1 92 0a46 46 0 1 1-92 0" /></defs>
              <circle cx="60" cy="60" r="58" fill="#0e100f" />
              <text><textPath href="#about-badge-circle">MADE WITH CURIOSITY · FROM VIETNAM ·</textPath></text>
              <path d="M60 46l3.6 9.4 9.4 3.6-9.4 3.6L60 72l-3.6-9.4L47 59l9.4-3.6Z" fill="#0ae448" />
            </svg>
            <span class="profile__blob" aria-hidden="true"><Shape name="blob" palette="green" /></span>
          </div>
          <div class="profile__info">
            <h3 class="profile__name">Heiznerd</h3>
            <p class="profile__handle">@heiznerd · {{ t.location }}</p>
            <div class="profile__chips">
              <span class="chip chip--status"><span class="dot" aria-hidden="true"></span>{{ t.learning }}</span>
              <a v-if="github.login" href="https://github.com/heiznerd" target="_blank" rel="noopener noreferrer" class="chip chip--gh">
                <img :src="github.avatar" alt="" width="22" height="22" />
                <span>@{{ github.login }}</span>
                <i class="fab fa-github" aria-hidden="true"></i>
              </a>
            </div>
          </div>
        </article>

        <div class="about__copy">
          <p class="about__para lead" data-reveal>{{ t.paragraph2 }}</p>
          <p class="about__para lead" data-reveal>{{ t.paragraph3 }}</p>
          <div class="about__interests" data-reveal>
            <h3 class="mono about__interests-title">{{ t.interests }}</h3>
            <ul class="about__interest-list">
              <li v-for="item in interests" :key="item.key" class="interest" :style="{ '--tone': item.tone }">
                <component :is="item.href ? 'a' : 'span'" :href="item.href" class="interest__in">
                  <span class="interest__icon" aria-hidden="true"><i :class="item.icon"></i></span>
                  <span>{{ t[item.key] }}</span>
                </component>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="stats" :aria-label="t.statsLabel" role="group">
        <div v-for="stat in stats" :key="stat.label" class="stat" :style="{ '--card': stat.bg }" data-stat>
          <span class="stat__shape" aria-hidden="true"><Shape :name="stat.shape" palette="cream" :shine="false" /></span>
          <p class="stat__value"><span class="stat__num" :data-value="stat.num">{{ stat.num }}</span>{{ stat.suffix }}</p>
          <p class="stat__label">{{ stat.label }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, inject, onMounted, onUnmounted, ref } from 'vue';
import { gsap } from '@/lib/gsap';
import { useGsap, MEDIA } from '@/composables/useGsap';
import { useGate } from '@/composables/useGate';
import Shape from './ui/Shape.vue';
import BraceLabel from './ui/BraceLabel.vue';

const lang = inject('lang');
const translations = inject('translations');
const t = computed(() => translations[lang.value].about);
const heroT = computed(() => translations[lang.value].hero);

const root = ref(null);
useGate(root, { target: '.about__head' });
const github = ref({});
const loopPath = 'M4 92C26 90 34 70 30 52C26 34 44 22 56 32C70 44 54 64 40 56C28 49 44 18 70 14C82 12 90 8 96 4';

const statementWords = computed(() => {
  const highlights = t.value.statementHighlights || {};
  return `${t.value.intro} ${t.value.paragraph1}`.split(/\s+/).map(text => {
    const bare = text.replace(/[.,!?()]/g, '');
    return { text, tone: highlights[bare] || null };
  });
});

const interests = [
  { key: 'coding', icon: 'fas fa-code', tone: '#0ae448' },
  { key: 'anime', icon: 'fas fa-film', tone: '#fec5fb', href: '#romcom' },
  { key: 'romcom', icon: 'fas fa-heart', tone: '#ff8709', href: '#romcom' },
  { key: 'gaming', icon: 'fas fa-gamepad', tone: '#9d95ff' },
];

const splitStat = value => {
  const match = String(value).match(/^(\d+)(.*)$/);
  return match ? { num: Number(match[1]), suffix: match[2] } : { num: value, suffix: '' };
};

const stats = computed(() => [
  { ...splitStat(heroT.value.stats.projectsVal), label: heroT.value.projects, bg: '#fec5fb', shape: 'flower' },
  { ...splitStat(heroT.value.stats.ageVal), label: heroT.value.age, bg: '#ff8709', shape: 'star' },
  { ...splitStat(heroT.value.stats.techVal), label: heroT.value.technologies, bg: '#9d95ff', shape: 'ring' },
]);

let githubController;
onMounted(async () => {
  githubController = new AbortController();
  try {
    const res = await fetch('https://api.github.com/users/heiznerd', { signal: githubController.signal });
    if (!res.ok) return;
    const data = await res.json();
    github.value = { login: data.login, avatar: data.avatar_url };
  } catch {
    github.value = {};
  }
});
onUnmounted(() => githubController?.abort());

useGsap(root, ({ root: el, mm }) => {
  mm.add(MEDIA, context => {
    if (!context.conditions.motion) return;

    // Heading + generic reveals
    gsap.utils.toArray('[data-reveal]', el).forEach(node => {
      gsap.from(node, {
        y: 60,
        autoAlpha: 0,
        duration: 1.1,
        scrollTrigger: { trigger: node, start: 'top 88%', once: true },
      });
    });

    // Scroll-scrubbed word reveal (the signature "reading" effect)
    const words = gsap.utils.toArray('.about__word', el);
    gsap.fromTo(words, { opacity: 0.14 }, {
      opacity: 1,
      ease: 'none',
      stagger: 0.12,
      scrollTrigger: { trigger: '.about__statement', start: 'top 82%', end: 'bottom 48%', scrub: 0.8 },
    });
    gsap.from('.about__word.is-hl', {
      y: 16,
      rotate: 2,
      stagger: 0.2,
      ease: 'back.out(3)',
      scrollTrigger: { trigger: '.about__statement', start: 'top 70%', end: 'bottom 50%', scrub: 1 },
    });

    // Decorations: loop draws itself, star spins with scroll
    const deco = gsap.timeline({ scrollTrigger: { trigger: '.about__statement-wrap', start: 'top 85%', end: 'bottom 30%', scrub: 1 } });
    deco.from('.about__loop-path', { drawSVG: '0%', ease: 'none' }, 0)
      .from('.about__deco-star', { scale: 0.2, rotate: -200, ease: 'none' }, 0)
      .from('.about__deco-diamond', { y: 120, rotate: 90, ease: 'none' }, 0)
      .from('.about__deco-dot', { scale: 0, stagger: 0.1, ease: 'none' }, 0.1);

    // Profile media parallax + badge spin
    gsap.to('.profile__badge', { rotate: 360, duration: 16, ease: 'none', repeat: -1 });
    gsap.fromTo('.profile__blob', { y: 60, rotate: -20 }, {
      y: -60,
      rotate: 30,
      ease: 'none',
      scrollTrigger: { trigger: '.profile', start: 'top bottom', end: 'bottom top', scrub: true },
    });

    // Interests pop in
    gsap.from('.interest', {
      y: 28,
      autoAlpha: 0,
      stagger: 0.07,
      duration: 0.7,
      ease: 'back.out(2.2)',
      scrollTrigger: { trigger: '.about__interest-list', start: 'top 90%', once: true },
    });

    // Stat cards: rise with a tilt, numbers count up
    gsap.from('[data-stat]', {
      y: 120,
      rotate: (i) => [-6, 4, -3][i] || 0,
      autoAlpha: 0,
      stagger: 0.12,
      duration: 1.2,
      ease: 'expo.out',
      scrollTrigger: { trigger: '.stats', start: 'top 88%', once: true },
    });
    gsap.utils.toArray('.stat__num', el).forEach(num => {
      const target = Number(num.dataset.value);
      if (!Number.isFinite(target)) return;
      const counter = { v: 0 };
      gsap.to(counter, {
        v: target,
        duration: 1.6,
        ease: 'power3.out',
        onUpdate: () => { num.textContent = Math.round(counter.v); },
        scrollTrigger: { trigger: num, start: 'top 92%', once: true },
      });
    });
    gsap.to('.stat__shape', { rotate: 360, duration: 18, ease: 'none', repeat: -1 });
  });
});
</script>

<style scoped>
.about__head { display: flex; flex-wrap: wrap; align-items: center; gap: 12px 22px; }
.about__eyebrow { color: var(--c-green); }
.about__sub { color: var(--c-cream-75); font-size: 1.05rem; }

/* Statement */
.about__statement-wrap { position: relative; margin-top: clamp(40px, 6vw, 80px); }
.about__statement {
  position: relative;
  z-index: 1;
  max-width: 21ch;
  font-size: var(--fs-statement);
  font-weight: 400;
  line-height: 1.12;
  letter-spacing: -0.04em;
}
.about__word { display: inline-block; will-change: opacity; }
.about__word.is-hl { background: var(--grad); -webkit-background-clip: text; background-clip: text; color: transparent; }
.about__word.is-green { --grad: var(--g-green); }
.about__word.is-blue { --grad: linear-gradient(120deg, #bef3fe, #00bae2); }
.about__word.is-pink { --grad: linear-gradient(120deg, #fec5fb, #f100cb); }
.about__word.is-orange { --grad: linear-gradient(120deg, #ffd9b0, #ff8709); }

.about__deco { position: absolute; inset: 0; pointer-events: none; }
.about__deco-star { position: absolute; top: -8%; right: 6%; width: clamp(70px, 9vw, 150px); }
.about__deco-loop { position: absolute; top: -4%; right: 14%; width: clamp(120px, 18vw, 300px); overflow: visible; }
.about__deco-dot { position: absolute; border-radius: 50%; }
.about__deco-dot--1 { top: 2%; right: 30%; width: 14px; height: 14px; background: var(--g-orange); }
.about__deco-dot--2 { top: 30%; right: 2%; width: 10px; height: 10px; background: var(--c-blue); }
.about__deco-diamond { position: absolute; bottom: 4%; right: 10%; width: clamp(34px, 3.4vw, 56px); }

/* Profile + copy */
.about__grid {
  display: grid;
  grid-template-columns: minmax(280px, 0.8fr) minmax(0, 1.2fr);
  gap: clamp(40px, 7vw, 120px);
  align-items: start;
  margin-top: clamp(80px, 11vw, 160px);
}

.profile__media { position: relative; width: min(100%, 380px); }
.profile__frame {
  position: relative;
  z-index: 1;
  aspect-ratio: 0.86;
  overflow: hidden;
  border-radius: 999px 999px var(--radius-lg) var(--radius-lg);
  background: var(--g-green);
}
.profile__img { width: 100%; height: 100%; object-fit: cover; mix-blend-mode: normal; }
.profile__badge {
  position: absolute;
  z-index: 2;
  right: -10%;
  bottom: 8%;
  width: clamp(96px, 9vw, 130px);
  fill: var(--c-cream);
  font-family: var(--font-mono);
  font-size: 10.4px;
  font-weight: 700;
  letter-spacing: 0.12em;
}
.profile__blob { position: absolute; z-index: 0; top: -9%; left: -12%; width: 44%; opacity: 0.9; }
.profile__info { margin-top: 28px; }
.profile__name { font-size: var(--fs-h3); letter-spacing: -0.045em; }
.profile__handle { margin-top: 6px; color: var(--c-cream-75); }
.profile__chips { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 18px; }
.chip--status .dot { width: 8px; height: 8px; border-radius: 50%; background: var(--c-green); }
.chip--gh { transition: border-color 0.3s var(--ease-out); }
.chip--gh:hover { border-color: var(--c-cream); }
.chip--gh img { width: 22px; height: 22px; border-radius: 50%; }

.about__copy { display: grid; gap: 28px; padding-top: clamp(0px, 4vw, 60px); }
.about__para { color: var(--c-cream); font-size: clamp(1.25rem, 2vw, 1.8rem); line-height: 1.38; }
.about__para + .about__para { color: var(--c-cream-75); }
.about__interests { margin-top: 12px; }
.about__interests-title { margin-bottom: 14px; color: var(--c-cream-75); font-weight: 500; }
.about__interest-list { display: flex; flex-wrap: wrap; gap: 10px; }
.interest {
  position: relative;
  display: inline-flex;
  align-items: center;
  padding: 8px 18px 8px 8px;
  border: 1.5px solid var(--c-line);
  border-radius: var(--radius-pill);
  font-weight: 500;
  transition: border-color 0.3s var(--ease-out), transform 0.4s var(--ease-out);
}
.interest__in { display: inline-flex; align-items: center; gap: 10px; }
a.interest__in::after { content: ''; position: absolute; inset: 0; border-radius: inherit; }
.interest:hover { border-color: var(--tone); transform: translateY(-3px) rotate(-1.5deg); }
.interest__icon { display: grid; width: 34px; height: 34px; place-items: center; border-radius: 50%; color: var(--c-bg); background: var(--tone); font-size: 0.85rem; }

/* Stats */
.stats { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: clamp(12px, 1.6vw, 22px); margin-top: clamp(80px, 10vw, 150px); }
.stat {
  position: relative;
  overflow: hidden;
  min-height: clamp(220px, 22vw, 320px);
  padding: clamp(24px, 2.6vw, 40px);
  border-radius: var(--radius-lg);
  color: var(--c-bg);
  background: var(--card);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}
.stat__shape { position: absolute; top: -18%; right: -14%; width: 58%; opacity: 0.35; mix-blend-mode: soft-light; }
.stat__value { position: relative; font-size: clamp(4rem, 9vw, 8.5rem); font-weight: 500; line-height: 0.9; letter-spacing: -0.06em; font-variant-numeric: tabular-nums; }
.stat__label { position: relative; margin-top: 10px; font-size: 1.15rem; font-weight: 600; letter-spacing: -0.02em; }

@media (max-width: 899px) {
  .about__grid { grid-template-columns: 1fr; }
  .profile__media { margin-inline: auto 0; width: min(78%, 360px); }
  .about__statement { max-width: none; }
  .about__deco-loop { right: 0; top: -10%; }
  .about__deco-star { top: -14%; right: 0; }
  .stats { grid-template-columns: 1fr; }
  .stat { min-height: 180px; }
}
</style>

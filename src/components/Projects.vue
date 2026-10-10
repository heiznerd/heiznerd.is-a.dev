<template>
  <section id="projects" ref="root" class="projects section" aria-labelledby="projects-title">
    <MarginShapes preset="projects" />
    <div class="container">
      <header class="projects__head">
        <div>
          <span class="mono projects__eyebrow">04 — {{ t.label }}</span>
          <h2 id="projects-title" class="section-title projects__title">{{ t.title }}</h2>
        </div>
        <p class="projects__sub lead">{{ t.headerSubtitle }}</p>
      </header>

      <ol class="stackcards">
        <li
          v-for="(project, index) in projects"
          :key="project.key"
          class="proj"
          :style="{ '--card': project.color, '--card-deep': project.deep }"
        >
          <div class="proj__float">
          <article class="proj__inner" :aria-labelledby="`proj-${project.key}`">
            <span class="proj__shade" aria-hidden="true"></span>
            <div class="proj__content">
              <div class="proj__top">
                <span class="proj__index mono">{{ String(index + 1).padStart(2, '0') }} / {{ String(projects.length).padStart(2, '0') }}</span>
                <span class="proj__status">{{ t[project.key].status }}</span>
              </div>

              <h3 :id="`proj-${project.key}`" class="proj__name">{{ t[project.key].name }}</h3>

              <div class="proj__roles">
                <span class="proj__roles-label mono">{{ t.rolesLabel }}</span>
                <ul>
                  <li v-for="role in (t[project.key].roles || project.roles || [])" :key="role" class="proj__role">{{ role }}</li>
                </ul>
              </div>

              <p class="proj__desc">{{ t[project.key].description }}</p>

              <CopyCommand
                v-if="project.command"
                class="proj__cmd"
                :command="project.command"
                :label="t.install"
                :copy-label="t.copy"
                :done-label="t.copied"
                :fail-label="t.copyFailed"
              />

              <div class="proj__actions">
                <a
                  v-for="link in project.links"
                  :key="link.href"
                  v-magnetic="0.2"
                  :href="link.href"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="pill"
                  :class="link.primary ? 'pill--solid-dark' : 'pill--dark'"
                  :data-cursor="link.type === 'app' ? t.visit : 'GitHub'"
                >
                  <i :class="link.type === 'app' ? 'fas fa-arrow-up-right-from-square' : 'fab fa-github'" aria-hidden="true"></i>
                  <span>{{ link.type === 'app' ? t.openApp : t.source }}</span>
                  <span class="sr-only">— {{ t[project.key].name }}</span>
                </a>
                <span class="proj__meta mono">{{ t[project.key].meta }}</span>
              </div>

              <div v-if="project.lineage" class="proj__lineage">
                <span class="proj__lineage-label mono">{{ t.lineageLabel }}</span>
                <div class="proj__lineage-body">
                  <a :href="project.lineage.href" target="_blank" rel="noopener noreferrer" class="proj__lineage-link">
                    <strong>{{ t[project.lineage.key].name }}</strong>
                    <span>· {{ t[project.lineage.key].status }} · {{ t[project.lineage.key].meta }}</span>
                    <i class="fas fa-arrow-up-right-from-square" aria-hidden="true"></i>
                  </a>
                  <p>{{ t[project.lineage.key].description }}</p>
                  <ul class="proj__lineage-stack" :aria-label="t.stackLabel">
                    <li v-for="tech in project.lineage.stack" :key="tech">{{ tech }}</li>
                  </ul>
                </div>
              </div>

              <ul v-if="project.stack" class="proj__stack" :aria-label="t.stackLabel">
                <li v-for="tech in project.stack" :key="tech">{{ tech }}</li>
              </ul>
            </div>

            <div class="proj__art">
              <ProjectArt :kind="project.art" />
            </div>
          </article>
          </div>
        </li>
      </ol>

      <!-- Current work -->
      <section class="work" aria-labelledby="work-title">
        <header class="work__head">
          <BraceLabel id="work-title" tag="h3" size="md">{{ t.currentWorkTitle }}</BraceLabel>
          <p class="muted">{{ t.currentWorkSubtitle }}</p>
        </header>
        <ul class="work__list">
          <li v-for="role in workRoles" :key="role.key" class="work__row">
            <span class="work__shape" aria-hidden="true"><Shape name="arch" palette="green" /></span>
            <span class="work__icon" aria-hidden="true"><i :class="role.icon"></i></span>
            <div class="work__copy">
              <h4 class="work__name">{{ t[role.key].name }}</h4>
              <p class="work__desc">{{ t[role.key].description }}</p>
            </div>
          </li>
        </ul>
      </section>
    </div>
  </section>
</template>

<script setup>
import { computed, inject, ref } from 'vue';
import { gsap, ScrollTrigger, revealTitle } from '@/lib/gsap';
import { useGsap, MEDIA } from '@/composables/useGsap';
import { useGate } from '@/composables/useGate';
import MarginShapes from './ui/MarginShapes.vue';
import Shape from './ui/Shape.vue';
import BraceLabel from './ui/BraceLabel.vue';
import CopyCommand from './ui/CopyCommand.vue';
import ProjectArt from './ProjectArt.vue';

const lang = inject('lang');
const translations = inject('translations');
const t = computed(() => translations[lang.value].projects);

const projects = [
  {
    key: 'danshi',
    color: '#ffc2e2',
    deep: '#ffa9d3',
    art: 'danshi',
    command: 'npm install -g danshi',
    links: [{ type: 'source', href: 'https://github.com/nekoo-moe/danshi', primary: true }],
  },
  {
    key: 'nekoai',
    color: '#a78bff',
    deep: '#9a74ff',
    art: 'nekoai',
    links: [{ type: 'app', href: 'https://app.nekoai.is-a.dev/', primary: true }],
  },
  {
    key: 'nekocomicsV2',
    color: '#ff9a5c',
    deep: '#ff8a45',
    art: 'comics',
    links: [{ type: 'source', href: 'https://github.com/nekoo-moe/NekoComics', primary: true }],
    lineage: {
      key: 'nekocomics',
      href: 'https://github.com/nekoo-moe/NekoComics-Rework',
      stack: ['Vue', 'Vite', 'Rails', 'PostgreSQL', 'Redis', 'Node'],
    },
  },
  {
    key: 'nekostream',
    color: '#6ad0ff',
    deep: '#58bff0',
    art: 'terminal',
    roles: [],
    command: 'npm install -g nekostream',
    stack: ['Node'],
    links: [{ type: 'source', href: 'https://github.com/nekoo-moe/NekoStream-CLI', primary: true }],
  },
];

const workRoles = [{ key: 'nekotech', icon: 'fas fa-building' }];

const root = ref(null);
useGate(root, { target: '.projects__head' });

useGsap(root, ({ root: el, mm }) => {
  mm.add(MEDIA, context => {
    const { motion, desktop } = context.conditions;
    if (!motion) return;

    revealTitle(el.querySelector('.projects__title'));
    gsap.from('.projects__head > *', {
      y: 70,
      autoAlpha: 0,
      stagger: 0.12,
      duration: 1.2,
      scrollTrigger: { trigger: '.projects__head', start: 'top 95%', once: true },
    });

    const cards = gsap.utils.toArray('.proj', el);

    // Each card rises into place with a little tilt.
    cards.forEach((card, i) => {
      gsap.from(card.querySelector('.proj__float'), {
        y: 160,
        rotate: i % 2 ? -3 : 3,
        duration: 1.3,
        ease: 'expo.out',
        scrollTrigger: { trigger: card, start: 'top 99%', once: true },
      });
      gsap.from(card.querySelectorAll('.proj__name, .proj__roles, .proj__desc, .proj__cmd, .proj__actions, .proj__lineage, .proj__stack'), {
        y: 50,
        autoAlpha: 0,
        stagger: 0.07,
        duration: 1,
        scrollTrigger: { trigger: card, start: 'top 92%', once: true },
      });
    });

    if (desktop && cards.length > 1) {
      // Stacking cards: each card pins under the header while the next one slides over it.
      const last = cards[cards.length - 1];
      const offset = () => Math.round(window.innerHeight * 0.1);
      // Cards taller than the viewport pin by their bottom edge so no content is ever hidden.
      const pinStart = card => () => (card.offsetHeight + offset() > window.innerHeight ? 'bottom bottom-=16' : `top top+=${offset()}`);
      cards.forEach((card, i) => {
        if (i === cards.length - 1) return;
        ScrollTrigger.create({
          trigger: card,
          start: pinStart(card),
          endTrigger: last,
          end: () => `top top+=${offset()}`,
          pin: true,
          pinSpacing: false,
          invalidateOnRefresh: true,
        });
        gsap.timeline({
          scrollTrigger: {
            trigger: cards[i + 1],
            start: 'top bottom',
            end: () => `top top+=${offset()}`,
            scrub: true,
            invalidateOnRefresh: true,
          },
        })
          .to(card.querySelector('.proj__inner'), { scale: 0.9, rotate: i % 2 ? 1.5 : -1.5, ease: 'none' }, 0)
          .to(card.querySelector('.proj__shade'), { opacity: 0.55, ease: 'none' }, 0);
      });
    }

    // Current work row
    gsap.from('.work__head > *, .work__row', {
      y: 60,
      autoAlpha: 0,
      stagger: 0.1,
      duration: 1.1,
      scrollTrigger: { trigger: '.work', start: 'top 96%', once: true },
    });
    gsap.fromTo('.work__shape', { rotate: -45, scale: 0.6 }, {
      rotate: 25,
      scale: 1,
      ease: 'none',
      scrollTrigger: { trigger: '.work', start: 'top bottom', end: 'bottom top', scrub: true },
    });
  });
});
</script>

<style scoped>
.projects__head { display: flex; flex-wrap: wrap; align-items: flex-end; justify-content: space-between; gap: 24px 48px; }
.projects__eyebrow { color: var(--c-accent); }
.projects__title { margin-top: 14px; }
.projects__sub { max-width: 34ch; }

.stackcards { display: grid; gap: clamp(28px, 4vw, 64px); margin-top: clamp(48px, 7vw, 100px); }

.proj { position: relative; }
.proj__inner {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr);
  gap: clamp(20px, 3vw, 44px);
  min-height: min(80vh, 780px);
  padding: clamp(20px, 2.4vw, 36px);
  overflow: hidden;
  border-radius: var(--radius-xl);
  color: var(--c-bg);
  background:
    radial-gradient(120% 90% at 0% 0%, rgba(255, 255, 255, 0.35), transparent 55%),
    var(--card);
  transform-origin: 50% 0%;
  will-change: transform;
}
.proj__shade { position: absolute; inset: 0; z-index: 3; border-radius: inherit; background: #0f0b13; opacity: 0; pointer-events: none; }

.proj__content { position: relative; z-index: 1; display: flex; flex-direction: column; gap: 22px; min-width: 0; padding: clamp(6px, 1vw, 14px); }
.proj__top { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.proj__index { font-weight: 700; }
.proj__status { padding: 6px 14px; border: 1.5px solid var(--c-bg); border-radius: var(--radius-pill); font-size: 0.85rem; font-weight: 600; }

.proj__name {
  margin-top: auto;
  color: var(--c-bg);
  font-size: clamp(3rem, 7.2vw, 7.4rem);
  font-weight: 600;
  line-height: 0.9;
  letter-spacing: -0.06em;
  overflow-wrap: anywhere;
}

.proj__roles { display: flex; flex-wrap: wrap; align-items: center; gap: 10px 14px; }
.proj__roles-label { font-weight: 700; }
.proj__roles ul { display: flex; flex-wrap: wrap; gap: 8px; }
.proj__role { padding: 7px 14px; border-radius: var(--radius-pill); color: var(--c-cream); background: var(--c-bg); font-size: 0.92rem; font-weight: 600; }
.proj__roles:has(ul:empty) { display: none; }

.proj__desc { max-width: 46ch; font-size: clamp(1.1rem, 1.45vw, 1.35rem); font-weight: 500; line-height: 1.4; letter-spacing: -0.015em; }

.proj__cmd { max-width: 460px; }
.proj__cmd :deep(.copy-cmd__label) { color: var(--c-bg); font-weight: 700; }
.proj__cmd :deep(.copy-cmd__row) { border-color: transparent; background: var(--c-bg); }

.proj__actions { display: flex; flex-wrap: wrap; align-items: center; gap: 12px 18px; }
.proj__meta { font-weight: 700; }

.proj__lineage { display: grid; gap: 8px; padding-top: 16px; border-top: 1.5px solid rgba(15, 11, 19, 0.25); }
.proj__lineage-label { font-weight: 700; }
.proj__lineage-link { display: inline-flex; flex-wrap: wrap; align-items: baseline; gap: 6px; font-size: 1rem; text-decoration: underline; text-decoration-thickness: 1.5px; text-underline-offset: 4px; }
.proj__lineage-link i { font-size: 0.75em; }
.proj__lineage-body p { max-width: 56ch; margin-top: 6px; font-size: 0.92rem; line-height: 1.45; }
.proj__lineage-stack,
.proj__stack { display: flex; flex-wrap: wrap; gap: 6px; }
.proj__lineage-stack { margin-top: 10px; }
.proj__lineage-stack li,
.proj__stack li { padding: 4px 10px; border: 1.5px solid var(--c-bg); border-radius: var(--radius-pill); font-family: var(--font-mono); font-size: 0.75rem; font-weight: 700; }

.proj__art {
  position: relative;
  z-index: 1;
  min-height: 320px;
  overflow: hidden;
  border-radius: calc(var(--radius-xl) - 12px);
  background:
    radial-gradient(80% 60% at 70% 20%, rgba(255, 241, 234, 0.06), transparent 70%),
    var(--c-bg);
}

.proj__inner :focus-visible { outline-color: var(--c-bg); }

/* Current work */
.work { margin-top: clamp(100px, 12vw, 180px); }
.work__head { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 12px 32px; }
.work__head p { max-width: 44ch; }
.work__list { margin-top: 28px; border-top: 1px solid var(--c-line); }
.work__row {
  position: relative;
  display: grid;
  grid-template-columns: auto auto minmax(0, 1fr);
  align-items: center;
  gap: clamp(16px, 3vw, 40px);
  padding-block: clamp(28px, 4vw, 48px);
  border-bottom: 1px solid var(--c-line);
}
.work__shape { width: clamp(64px, 8vw, 120px); }
.work__icon { display: grid; width: 54px; height: 54px; place-items: center; border-radius: 50%; color: var(--c-bg); background: var(--c-cream); font-size: 1.2rem; }
.work__name { color: var(--c-accent); font-size: clamp(2rem, 4.4vw, 4.2rem); font-weight: 500; letter-spacing: -0.05em; }
.work__desc { margin-top: 8px; color: var(--c-cream); font-size: clamp(1.1rem, 1.6vw, 1.45rem); }

@media (max-width: 899px) {
  .proj__inner { grid-template-columns: 1fr; min-height: 0; }
  .proj__art { order: -1; min-height: 260px; aspect-ratio: 4 / 3; }
  .proj__name { margin-top: 8px; }
  .work__row { grid-template-columns: auto minmax(0, 1fr); }
  .work__shape { display: none; }
}
</style>

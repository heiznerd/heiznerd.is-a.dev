<template>
  <aside v-if="events.length" ref="root" class="gha" :aria-label="t.activityTitle">
    <header class="gha__head">
      <span class="gha__title"><i class="fab fa-github" aria-hidden="true"></i>{{ t.activityTitle }}</span>
      <span class="gha__live"><span aria-hidden="true"></span>{{ t.live }}</span>
    </header>
    <ul class="gha__list">
      <li v-for="(ev, i) in events" :key="i" class="gha__item">
        <span class="gha__icon" :style="{ '--tone': ev.tone }" aria-hidden="true"><i :class="ev.icon"></i></span>
        <span class="gha__what">
          <span class="gha__action">{{ ev.action }}</span>
          <a :href="`https://github.com/${ev.fullRepo}`" target="_blank" rel="noopener noreferrer" class="gha__repo">{{ ev.repo }}</a>
        </span>
        <time class="gha__time mono" :datetime="ev.datetime">{{ ev.time }}</time>
      </li>
    </ul>
  </aside>
</template>

<script setup>
import { computed, inject, nextTick, onMounted, onUnmounted, ref } from 'vue';
import { gsap, ScrollTrigger, prefersReducedMotion } from '@/lib/gsap';

const lang = inject('lang');
const translations = inject('translations');
const t = computed(() => translations[lang.value].contact);

const root = ref(null);
const events = ref([]);

const EVENT_META = {
  PushEvent: { icon: 'fas fa-code-branch', tone: '#ff5c93' },
  CreateEvent: { icon: 'fas fa-plus', tone: '#ffb27a' },
  WatchEvent: { icon: 'fas fa-star', tone: '#ff9a5c' },
  ForkEvent: { icon: 'fas fa-code-fork', tone: '#6ad0ff' },
  IssuesEvent: { icon: 'fas fa-circle-dot', tone: '#ffc2e2' },
  PullRequestEvent: { icon: 'fas fa-code-pull-request', tone: '#a78bff' },
  IssueCommentEvent: { icon: 'fas fa-comment', tone: '#cdeeff' },
  DeleteEvent: { icon: 'fas fa-trash', tone: '#c9b8bf' },
};

const timeAgo = dateStr => {
  const ago = t.value.ago;
  const diff = (Date.now() - new Date(dateStr)) / 1000;
  const sep = lang.value === 'vi' ? ' ' : '';
  if (diff < 60) return ago.now;
  if (diff < 3600) return `${Math.floor(diff / 60)}${sep}${ago.m}`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}${sep}${ago.h}`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)}${sep}${ago.d}`;
  return `${Math.floor(diff / 2592000)}${sep}${ago.mo}`;
};

let controller;
let ctx;

onMounted(async () => {
  controller = new AbortController();
  try {
    const res = await fetch('https://api.github.com/users/heiznerd/events/public?per_page=10', { signal: controller.signal });
    if (!res.ok) return;
    const data = await res.json();
    events.value = data
      .filter(e => EVENT_META[e.type])
      .slice(0, 4)
      .map(e => ({
        ...EVENT_META[e.type],
        action: t.value.events[e.type],
        fullRepo: e.repo.name,
        repo: e.repo.name.replace('heiznerd/', ''),
        datetime: e.created_at,
        time: timeAgo(e.created_at),
      }));
  } catch {
    return;
  }

  await nextTick();
  // New content changes page height: recalc triggers, then reveal the rows.
  ScrollTrigger.refresh();
  if (!root.value || prefersReducedMotion()) return;
  ctx = gsap.context(() => {
    gsap.from('.gha__item', {
      x: -40,
      autoAlpha: 0,
      stagger: 0.08,
      duration: 0.9,
      scrollTrigger: { trigger: root.value, start: 'top 99%', once: true },
    });
  }, root.value);
});

onUnmounted(() => {
  controller?.abort();
  ctx?.revert();
});
</script>

<style scoped>
.gha {
  margin-top: clamp(40px, 6vw, 80px);
  overflow: hidden;
  border: 1px solid var(--c-line);
  border-radius: var(--radius-lg);
  background: var(--c-bg-2);
}
.gha__head { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 18px 22px; border-bottom: 1px solid var(--c-line); }
.gha__title { display: inline-flex; align-items: center; gap: 10px; font-weight: 600; }
.gha__live { display: inline-flex; align-items: center; gap: 8px; padding: 4px 12px; border-radius: var(--radius-pill); color: var(--c-bg); background: var(--c-mint); font-size: 0.75rem; font-weight: 700; text-transform: uppercase; }
.gha__live span { width: 7px; height: 7px; border-radius: 50%; background: var(--c-bg); animation: live 1.4s ease-in-out infinite; }
.gha__list { display: grid; }
.gha__item { display: grid; grid-template-columns: auto minmax(0, 1fr) auto; align-items: center; gap: 14px; padding: 14px 22px; border-bottom: 1px solid var(--c-line-soft); }
.gha__what { display: flex; min-width: 0; align-items: baseline; gap: 10px; }
.gha__item:last-child { border-bottom: 0; }
.gha__icon { display: grid; width: 32px; height: 32px; place-items: center; border-radius: 50%; color: var(--c-bg); background: var(--tone); font-size: 0.78rem; }
.gha__action { color: var(--c-cream-75); font-size: 0.92rem; }
.gha__repo { overflow: hidden; color: var(--c-cream); font-weight: 600; text-overflow: ellipsis; white-space: nowrap; }
.gha__repo:hover { text-decoration: underline; text-underline-offset: 3px; }
.gha__time { color: var(--c-cream-75); text-transform: none; }

@keyframes live { 50% { opacity: 0.3; } }

@media (max-width: 560px) {
  .gha__what { flex-direction: column; gap: 2px; }
  .gha__action { font-size: 0.8rem; }
}
</style>

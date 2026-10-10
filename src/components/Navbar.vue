<template>
  <header ref="root" class="site-header" :class="{ 'is-scrolled': scrolled, 'is-menu-open': menuOpen }">
    <div class="site-header__bar container">
      <a :href="isPomodoroPage ? '/' : '#home'" class="brand" :aria-label="isPomodoroPage ? t.backHome : t.home" @click="onBrandClick">
        <img src="/heiznerd-logo.png" alt="" class="brand__logo" width="34" height="34" />
        <span class="brand__word" aria-hidden="true">heiznerd</span>
      </a>

      <nav v-if="!isPomodoroPage" class="site-nav" :aria-label="t.mainNav">
        <ul>
          <li v-for="link in navLinks" :key="link.id">
            <a :href="`#${link.id}`" class="site-nav__link" :class="{ 'is-active': activeId === link.id }" :aria-current="activeId === link.id ? 'true' : undefined">
              {{ t[link.key] }}
            </a>
          </li>
        </ul>
      </nav>

      <div class="site-header__actions">
        <div ref="clockWrap" class="clock">
          <button
            type="button"
            class="clock__btn"
            :aria-expanded="showCalendar"
            aria-controls="header-calendar"
            :aria-label="`${t.calendar} — ${currentTime}`"
            @click="showCalendar = !showCalendar"
          >
            <span class="clock__dot" aria-hidden="true"></span>
            <span class="clock__time">{{ currentTime }}</span>
          </button>
          <Transition name="pop">
            <div v-if="showCalendar" id="header-calendar" class="calendar" role="dialog" :aria-label="monthLabel">
              <p class="calendar__month">{{ monthLabel }}</p>
              <p class="calendar__date">{{ currentDate }}</p>
              <div class="calendar__grid calendar__grid--head" aria-hidden="true">
                <span v-for="d in weekdays" :key="d">{{ d }}</span>
              </div>
              <div class="calendar__grid">
                <span
                  v-for="(day, idx) in calendarDays"
                  :key="idx"
                  class="calendar__day"
                  :class="{ 'is-muted': !day.current, 'is-today': day.today }"
                  :aria-current="day.today ? 'date' : undefined"
                >{{ day.day }}</span>
              </div>
            </div>
          </Transition>
        </div>

        <button type="button" class="icon-btn icon-btn--sm hide-mobile" :aria-label="t.commands" title="Ctrl + K" @click="cmdOpen = true">
          <i class="fas fa-terminal" aria-hidden="true"></i>
        </button>

        <button type="button" class="lang-toggle" :aria-label="t.switchLang" @click="toggleLanguage">
          <span :class="{ 'is-on': currentLang === 'vi' }">VI</span>
          <span :class="{ 'is-on': currentLang === 'en' }">EN</span>
        </button>

        <a v-if="!isPomodoroPage" v-magnetic="0.3" href="#contact" class="pill pill--sm hide-mobile">{{ t.contact }}</a>

        <button
          ref="menuBtn"
          type="button"
          class="menu-btn show-mobile"
          :aria-expanded="menuOpen"
          aria-controls="mobile-menu"
          :aria-label="menuOpen ? t.closeMenu : t.menu"
          @click="toggleMenu"
        >
          <span></span><span></span>
        </button>
      </div>
    </div>
    <div class="site-header__rule container" aria-hidden="true"><span></span></div>
  </header>

  <div
    v-show="menuOpen"
    id="mobile-menu"
    ref="menuEl"
    class="mobile-menu"
    role="dialog"
    aria-modal="true"
    :aria-label="t.mainNav"
    @keydown.esc="closeMenu"
  >
    <nav class="mobile-menu__nav">
      <a
        v-for="(link, index) in mobileLinks"
        :key="link.id"
        :href="isPomodoroPage ? '/' : `#${link.id}`"
        class="mobile-menu__link"
        @click="closeMenu"
      >
        <span class="mobile-menu__index mono">0{{ index + 1 }}</span>
        <span>{{ t[link.key] }}</span>
      </a>
    </nav>
    <div class="mobile-menu__foot">
      <button type="button" class="pill pill--sm" @click="openPaletteFromMenu">
        <i class="fas fa-terminal" aria-hidden="true"></i>
        <span>{{ currentLang === 'vi' ? 'Bảng lệnh' : 'Commands' }}</span>
      </button>
      <div class="mobile-menu__shapes" aria-hidden="true">
        <Shape name="flower" palette="pink" />
        <Shape name="star" palette="orange" />
        <Shape name="ring" palette="blue" />
      </div>
    </div>
  </div>

  <CommandPalette :model-value="cmdOpen" @close="cmdOpen = false" />
</template>

<script setup>
import { computed, inject, nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import CommandPalette from './CommandPalette.vue';
import Shape from './ui/Shape.vue';
import { gsap, ScrollTrigger, prefersReducedMotion, setScrollLocked } from '@/lib/gsap';

const props = defineProps({ introComplete: { type: Boolean, default: true } });

const route = useRoute();
const isPomodoroPage = computed(() => route.path.includes('/pomodoro'));
const currentLang = inject('currentLang');
const lang = inject('lang');
const translations = inject('translations');
const t = computed(() => translations[lang.value].navbar);

const root = ref(null);
const menuEl = ref(null);
const menuBtn = ref(null);
const clockWrap = ref(null);
const cmdOpen = ref(false);
const showCalendar = ref(false);
const menuOpen = ref(false);
const scrolled = ref(false);
const activeId = ref('home');
const currentTime = ref('');
const currentDate = ref('');

const navLinks = [
  { id: 'about', key: 'about' },
  { id: 'skills', key: 'skills' },
  { id: 'timeline', key: 'timeline' },
  { id: 'projects', key: 'projects' },
  { id: 'contact', key: 'contact' },
];
const mobileLinks = computed(() => (isPomodoroPage.value ? [{ id: 'home', key: 'backHome' }] : [{ id: 'home', key: 'home' }, ...navLinks]));

const locale = computed(() => (lang.value === 'vi' ? 'vi-VN' : 'en-US'));
const weekdays = computed(() => (lang.value === 'vi' ? ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'] : ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']));
const monthLabel = computed(() => new Date().toLocaleDateString(locale.value, { month: 'long', year: 'numeric' }));
const calendarDays = computed(() => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const total = new Date(year, month + 1, 0).getDate();
  const prevTotal = new Date(year, month, 0).getDate();
  const days = [];
  for (let i = firstDay - 1; i >= 0; i -= 1) days.push({ day: prevTotal - i, current: false });
  for (let d = 1; d <= total; d += 1) days.push({ day: d, current: true, today: d === now.getDate() });
  for (let d = 1; days.length < 42; d += 1) days.push({ day: d, current: false });
  return days;
});

const updateClock = () => {
  const now = new Date();
  currentTime.value = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  currentDate.value = now.toLocaleDateString(locale.value, { weekday: 'long', day: 'numeric', month: 'long' });
};

const toggleLanguage = () => {
  localStorage.setItem('preferred-lang', lang.value === 'vi' ? 'en' : 'vi');
  window.location.reload();
};

// The global anchor handler (App.vue) performs the scroll to #home.
const onBrandClick = () => {
  if (menuOpen.value) closeMenu();
};

/* ---------- Mobile menu ---------- */
let menuTl;
const buildMenuTimeline = () => {
  if (!menuEl.value || prefersReducedMotion()) return null;
  return gsap.timeline({ paused: true })
    .fromTo(menuEl.value, { clipPath: 'circle(0% at 92% 4%)' }, { clipPath: 'circle(150% at 92% 4%)', duration: 0.7, ease: 'hz.inOut' })
    .from(menuEl.value.querySelectorAll('.mobile-menu__link'), { yPercent: 120, autoAlpha: 0, stagger: 0.06, duration: 0.6 }, 0.25)
    .from(menuEl.value.querySelectorAll('.mobile-menu__foot > *'), { y: 30, autoAlpha: 0, stagger: 0.08, duration: 0.5 }, 0.4)
    .from(menuEl.value.querySelectorAll('.mobile-menu__shapes svg'), { scale: 0, rotate: -120, stagger: 0.06, ease: 'back.out(2)' }, 0.45);
};

const toggleMenu = () => (menuOpen.value ? closeMenu() : openMenu());

const openMenu = async () => {
  menuOpen.value = true;
  setScrollLocked(true);
  await nextTick();
  menuTl ??= buildMenuTimeline();
  menuTl?.timeScale(1).play(0);
  menuEl.value?.querySelector('a')?.focus({ preventScroll: true });
};

function closeMenu() {
  if (!menuOpen.value) return;
  const done = () => {
    menuOpen.value = false;
    setScrollLocked(false);
    menuBtn.value?.focus({ preventScroll: true });
  };
  if (menuTl) {
    menuTl.eventCallback('onReverseComplete', done);
    menuTl.timeScale(1.6).reverse();
  } else done();
}

const openPaletteFromMenu = () => {
  closeMenu();
  window.setTimeout(() => { cmdOpen.value = true; }, 350);
};

/* ---------- Keyboard + outside click ---------- */
const handleKeys = event => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault();
    cmdOpen.value = !cmdOpen.value;
  }
  if (event.key === 'Escape') {
    showCalendar.value = false;
    if (menuOpen.value) closeMenu();
  }
};

const handleOutside = event => {
  if (clockWrap.value && !clockWrap.value.contains(event.target)) showCalendar.value = false;
};

/* ---------- Scroll behaviour: hide on scroll down, active section ---------- */
let ctx;
let clockTimer;
let rafId = 0;

const updateActive = () => {
  rafId = 0;
  // Only sections that have a nav link (plus home) can be "active"; extras like the
  // Rom-com corner keep the previous link highlighted instead of clearing it.
  const known = new Set(['home', ...navLinks.map(link => link.id)]);
  const sections = document.querySelectorAll('main section[id]');
  const probe = window.innerHeight * 0.4;
  let current = 'home';
  sections.forEach(section => {
    if (known.has(section.id) && section.getBoundingClientRect().top <= probe) current = section.id;
  });
  activeId.value = current;
};
const requestActive = () => { if (!rafId) rafId = requestAnimationFrame(updateActive); };

watch(() => props.introComplete, value => {
  if (!value || !root.value) return;
  if (prefersReducedMotion()) return;
  ctx?.add(() => gsap.from(root.value.querySelectorAll('.site-header__bar > *, .site-header__rule span'), {
    yPercent: -120,
    autoAlpha: 0,
    duration: 0.9,
    stagger: 0.08,
    ease: 'expo.out',
    clearProps: 'transform,opacity,visibility',
  }));
});

onMounted(() => {
  updateClock();
  clockTimer = window.setInterval(updateClock, 15000);
  window.addEventListener('keydown', handleKeys);
  window.addEventListener('click', handleOutside);
  window.addEventListener('scroll', requestActive, { passive: true });

  ctx = gsap.context(() => {
    let hidden = false;
    ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: self => {
        const y = self.scroll();
        scrolled.value = y > 40;
        requestActive();
        if (menuOpen.value || cmdOpen.value || prefersReducedMotion()) return;
        const shouldHide = self.direction === 1 && y > 260;
        if (shouldHide !== hidden) {
          hidden = shouldHide;
          gsap.to(root.value, { yPercent: hidden ? -110 : 0, duration: 0.5, ease: hidden ? 'power3.in' : 'expo.out', overwrite: true });
        }
      },
    });
    // keep the header visible whenever something inside it has focus
    root.value.addEventListener('focusin', () => {
      hidden = false;
      gsap.to(root.value, { yPercent: 0, duration: 0.3, overwrite: true });
    });
  }, root.value);
});

onUnmounted(() => {
  window.clearInterval(clockTimer);
  cancelAnimationFrame(rafId);
  window.removeEventListener('keydown', handleKeys);
  window.removeEventListener('click', handleOutside);
  window.removeEventListener('scroll', requestActive);
  menuTl?.kill();
  ctx?.revert();
});
</script>

<style scoped>
.site-header {
  position: fixed;
  z-index: 1000;
  top: 0;
  right: 0;
  left: 0;
  color: var(--c-cream);
  transition: background-color 0.4s var(--ease-out);
}

.site-header.is-scrolled { background: rgba(14, 16, 15, 0.86); backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px); }
.site-header.is-menu-open { background: transparent; backdrop-filter: none; }

.site-header__bar {
  display: flex;
  height: var(--header-h);
  align-items: center;
  gap: clamp(16px, 2.6vw, 40px);
}

.site-header__rule span { display: block; height: 1px; background: var(--c-line); }

/* Brand */
.brand { display: inline-flex; align-items: center; gap: 10px; flex: 0 0 auto; border-radius: 12px; }
.brand__logo { width: 34px; height: 34px; border-radius: 10px; object-fit: cover; }
.brand__word {
  font-size: 1.5rem;
  font-weight: 700;
  font-style: italic;
  letter-spacing: -0.06em;
  line-height: 1;
}

/* Nav */
.site-nav ul { display: flex; gap: clamp(14px, 1.8vw, 28px); }
.site-nav__link {
  position: relative;
  color: var(--c-cream-75);
  font-size: 1.05rem;
  font-weight: 500;
  letter-spacing: -0.02em;
  transition: color 0.25s var(--ease-out);
}
.site-nav__link::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: -6px;
  height: 2px;
  border-radius: 2px;
  background: var(--g-green);
  transform: scaleX(0);
  transform-origin: right;
  transition: transform 0.45s var(--ease-out);
}
.site-nav__link:hover,
.site-nav__link.is-active { color: var(--c-cream); }
.site-nav__link:hover::after,
.site-nav__link.is-active::after { transform: scaleX(1); transform-origin: left; }

.site-header__actions { display: flex; align-items: center; gap: 10px; margin-left: auto; }

/* Clock */
.clock { position: relative; }
.clock__btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 38px;
  padding: 0 14px;
  border: 1.5px solid var(--c-line);
  border-radius: var(--radius-pill);
  font-family: var(--font-mono);
  font-size: 0.82rem;
  transition: border-color 0.25s var(--ease-out);
}
.clock__btn:hover { border-color: var(--c-cream); }
.clock__dot { width: 7px; height: 7px; border-radius: 50%; background: var(--c-green); box-shadow: 0 0 0 4px rgba(10, 228, 72, 0.18); }

.calendar {
  position: absolute;
  top: calc(100% + 12px);
  right: 0;
  width: 272px;
  padding: 18px;
  border: 1px solid var(--c-line);
  border-radius: var(--radius-lg);
  background: var(--c-bg-2);
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.5);
}
.calendar__month { font-size: 1.15rem; font-weight: 600; letter-spacing: -0.03em; text-transform: capitalize; }
.calendar__date { margin: 2px 0 14px; color: var(--c-cream-75); font-size: 0.82rem; text-transform: capitalize; }
.calendar__grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 3px; text-align: center; }
.calendar__grid--head { margin-bottom: 6px; color: var(--c-green); font-family: var(--font-mono); font-size: 0.66rem; }
.calendar__day { display: grid; height: 30px; place-items: center; border-radius: 50%; font-family: var(--font-mono); font-size: 0.75rem; }
.calendar__day.is-muted { color: var(--c-cream-25); }
.calendar__day.is-today { color: var(--c-bg); background: var(--c-green); font-weight: 700; }

.pop-enter-active, .pop-leave-active { transition: opacity 0.25s var(--ease-out), transform 0.35s var(--ease-out); }
.pop-enter-from, .pop-leave-to { opacity: 0; transform: translateY(-8px) scale(0.97); }

.icon-btn--sm { width: 38px; height: 38px; font-size: 0.85rem; }

/* Language */
.lang-toggle {
  display: inline-flex;
  height: 38px;
  align-items: center;
  padding: 3px;
  border: 1.5px solid var(--c-line);
  border-radius: var(--radius-pill);
  font-family: var(--font-mono);
  font-size: 0.72rem;
  font-weight: 700;
}
.lang-toggle span {
  display: grid;
  height: 100%;
  min-width: 34px;
  place-items: center;
  border-radius: var(--radius-pill);
  color: var(--c-cream-75);
  transition: background 0.3s var(--ease-out), color 0.3s var(--ease-out);
}
.lang-toggle span.is-on { color: var(--c-bg); background: var(--c-cream); }

/* Burger */
.menu-btn {
  position: relative;
  display: none;
  width: 44px;
  height: 44px;
  border: 1.5px solid var(--c-line);
  border-radius: 50%;
}
.menu-btn span {
  position: absolute;
  left: 13px;
  right: 13px;
  height: 2px;
  border-radius: 2px;
  background: var(--c-cream);
  transition: transform 0.45s var(--ease-out), top 0.45s var(--ease-out);
}
.menu-btn span:first-child { top: 17px; }
.menu-btn span:last-child { top: 24px; }
.menu-btn[aria-expanded='true'] span:first-child { top: 20.5px; transform: rotate(45deg); }
.menu-btn[aria-expanded='true'] span:last-child { top: 20.5px; transform: rotate(-45deg); }

/* Mobile menu */
.mobile-menu {
  position: fixed;
  z-index: 990;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: calc(var(--header-h) + 28px) var(--gutter) calc(28px + env(safe-area-inset-bottom));
  background: var(--c-bg);
  overflow-y: auto;
}
.mobile-menu__nav { display: grid; gap: 4px; }
.mobile-menu__link {
  display: flex;
  align-items: baseline;
  gap: 14px;
  padding-block: 4px;
  overflow: hidden;
  font-size: clamp(2.6rem, 12vw, 4.5rem);
  font-weight: 500;
  line-height: 1.1;
  letter-spacing: -0.045em;
}
.mobile-menu__index { color: var(--c-green); }
.mobile-menu__foot { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding-top: 28px; }
.mobile-menu__shapes { display: flex; gap: 10px; }
.mobile-menu__shapes svg { width: 40px; }

.show-mobile { display: none; }

@media (max-width: 1100px) {
  .site-nav ul { gap: 16px; }
  .site-nav__link { font-size: 0.95rem; }
}

@media (max-width: 899px) {
  .site-nav,
  .hide-mobile { display: none !important; }
  .show-mobile { display: inline-block; }
  .brand__word { font-size: 1.3rem; }
  .site-header__actions { gap: 8px; }
}

@media (max-width: 380px) {
  .clock__btn { padding: 0 10px; }
  .clock__dot { display: none; }
}
</style>

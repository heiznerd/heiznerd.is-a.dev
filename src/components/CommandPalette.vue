<template>
  <Teleport to="body">
    <Transition name="cmd" @after-enter="focusInput">
      <div v-if="isOpen" class="cmd-overlay" @click.self="close">
        <div
          ref="dialogEl"
          class="cmd-dialog"
          role="dialog"
          aria-modal="true"
          :aria-label="t.title"
          @keydown.tab="trapFocus"
        >
          <div class="cmd-search">
            <i class="fas fa-magnifying-glass" aria-hidden="true"></i>
            <input
              ref="inputRef"
              v-model="searchQuery"
              type="text"
              class="cmd-input"
              role="combobox"
              aria-expanded="true"
              aria-controls="cmd-list"
              :aria-activedescendant="filtered.length ? `cmd-opt-${activeIndex}` : undefined"
              :aria-label="t.placeholder"
              :placeholder="t.placeholder"
              autocomplete="off"
              spellcheck="false"
              @keydown.down.prevent="move(1)"
              @keydown.up.prevent="move(-1)"
              @keydown.enter.prevent="run(filtered[activeIndex])"
              @keydown.esc.prevent="close"
            />
            <kbd class="cmd-kbd">ESC</kbd>
          </div>

          <p v-if="filtered.length === 0" class="cmd-empty">{{ t.noResults }}</p>
          <ul v-else id="cmd-list" class="cmd-list" role="listbox" :aria-label="t.title">
            <li
              v-for="(cmd, index) in filtered"
              :id="`cmd-opt-${index}`"
              :key="cmd.id"
              class="cmd-item"
              :class="{ 'is-active': index === activeIndex }"
              role="option"
              :aria-selected="index === activeIndex"
              @mouseenter="activeIndex = index"
              @click="run(cmd)"
            >
              <span class="cmd-item__icon" :style="{ '--tone': cmd.tone }"><i :class="cmd.icon" aria-hidden="true"></i></span>
              <span class="cmd-item__label">{{ cmd.label }}</span>
              <kbd v-if="cmd.shortcut" class="cmd-kbd">{{ cmd.shortcut }}</kbd>
              <i v-else class="fas fa-arrow-right cmd-item__arrow" aria-hidden="true"></i>
            </li>
          </ul>

          <footer class="cmd-footer">
            <span><kbd>↑↓</kbd> {{ t.navigate }}</span>
            <span><kbd>↵</kbd> {{ t.select }}</span>
            <span><kbd>esc</kbd> {{ t.close }}</span>
          </footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed, inject, onMounted, onUnmounted, ref, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { scrollToTarget, setScrollLocked } from '@/lib/gsap';

const emit = defineEmits(['close']);
const props = defineProps({ modelValue: { type: Boolean, default: false } });

const lang = inject('lang');
const router = useRouter();
const route = useRoute();

const t = computed(() => (lang.value === 'vi'
  ? {
      title: 'Bảng lệnh',
      placeholder: 'Tìm lệnh hoặc di chuyển nhanh...',
      noResults: 'Không tìm thấy kết quả nào.',
      navigate: 'Di chuyển',
      select: 'Chọn',
      close: 'Thoát',
      gotoHome: 'Đi tới Trang chủ',
      gotoAbout: 'Đi tới Giới thiệu',
      gotoRomcom: 'Đi tới Góc Rom-com',
      gotoSkills: 'Đi tới Kỹ năng',
      gotoTimeline: 'Đi tới Hành trình',
      gotoProjects: 'Đi tới Dự án',
      gotoContact: 'Đi tới Liên hệ',
      pomodoro: 'Mở Pomodoro Timer',
      switchLang: 'Chuyển sang tiếng Anh (EN)',
    }
  : {
      title: 'Command palette',
      placeholder: 'Search commands or navigate...',
      noResults: 'No results found.',
      navigate: 'Navigate',
      select: 'Select',
      close: 'Close',
      gotoHome: 'Go to Home',
      gotoAbout: 'Go to About',
      gotoRomcom: 'Go to Rom-com Corner',
      gotoSkills: 'Go to Skills',
      gotoTimeline: 'Go to Timeline',
      gotoProjects: 'Go to Projects',
      gotoContact: 'Go to Contact',
      pomodoro: 'Open Pomodoro Timer',
      switchLang: 'Switch to Vietnamese (VI)',
    }));

const isOpen = computed(() => props.modelValue);
const searchQuery = ref('');
const activeIndex = ref(0);
const inputRef = ref(null);
const dialogEl = ref(null);
let lastFocused = null;

const switchLanguage = () => {
  localStorage.setItem('preferred-lang', lang.value === 'vi' ? 'en' : 'vi');
  window.location.reload();
};

const goSection = async id => {
  close();
  if (route.path !== '/') {
    await router.push({ path: '/', hash: `#${id}` });
    window.setTimeout(() => scrollToTarget(id), 400);
    return;
  }
  window.setTimeout(() => scrollToTarget(id), 60);
};

const commands = computed(() => [
  { id: 'home', label: t.value.gotoHome, icon: 'fas fa-house', tone: '#0ae448', action: () => goSection('home') },
  { id: 'about', label: t.value.gotoAbout, icon: 'fas fa-user-astronaut', tone: '#fec5fb', action: () => goSection('about') },
  { id: 'romcom', label: t.value.gotoRomcom, icon: 'fas fa-heart', tone: '#fec5fb', action: () => goSection('romcom') },
  { id: 'skills', label: t.value.gotoSkills, icon: 'fas fa-layer-group', tone: '#ff8709', action: () => goSection('skills') },
  { id: 'timeline', label: t.value.gotoTimeline, icon: 'fas fa-route', tone: '#9d95ff', action: () => goSection('timeline') },
  { id: 'projects', label: t.value.gotoProjects, icon: 'fas fa-rocket', tone: '#00bae2', action: () => goSection('projects') },
  { id: 'contact', label: t.value.gotoContact, icon: 'fas fa-paper-plane', tone: '#abff84', action: () => goSection('contact') },
  { id: 'pomodoro', label: t.value.pomodoro, icon: 'fas fa-stopwatch', tone: '#ff8709', action: () => { close(); router.push('/pomodoro'); } },
  { id: 'lang', label: t.value.switchLang, icon: 'fas fa-globe', tone: '#fffce1', shortcut: 'Alt L', action: switchLanguage },
]);

const filtered = computed(() => {
  const query = searchQuery.value.toLowerCase().trim();
  if (!query) return commands.value;
  return commands.value.filter(cmd => cmd.label.toLowerCase().includes(query));
});

watch(searchQuery, () => { activeIndex.value = 0; });

watch(isOpen, open => {
  if (open) {
    lastFocused = document.activeElement;
    searchQuery.value = '';
    activeIndex.value = 0;
    setScrollLocked(true);
  } else {
    setScrollLocked(false);
    lastFocused?.focus?.({ preventScroll: true });
  }
});

const focusInput = () => inputRef.value?.focus({ preventScroll: true });
const close = () => emit('close');
const run = cmd => cmd?.action();
const move = step => {
  const count = filtered.value.length;
  if (!count) return;
  activeIndex.value = (activeIndex.value + step + count) % count;
};

// Keep Tab inside the dialog while it is open.
const trapFocus = event => {
  const focusables = dialogEl.value?.querySelectorAll('input, button, [href]');
  if (!focusables?.length) return;
  const first = focusables[0];
  const last = focusables[focusables.length - 1];
  if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
  else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  else if (focusables.length === 1) event.preventDefault();
};

const handleKeyDown = event => {
  if (!isOpen.value && event.altKey && event.key.toLowerCase() === 'l') {
    event.preventDefault();
    switchLanguage();
  }
};

onMounted(() => window.addEventListener('keydown', handleKeyDown));
onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown);
  if (isOpen.value) setScrollLocked(false);
});
</script>

<style scoped>
.cmd-overlay {
  position: fixed;
  z-index: 10020;
  inset: 0;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: clamp(72px, 14vh, 160px) 16px 24px;
  background: rgba(14, 16, 15, 0.72);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.cmd-dialog {
  width: min(620px, 100%);
  overflow: hidden;
  border: 1px solid var(--c-line);
  border-radius: var(--radius-lg);
  background: var(--c-bg-2);
  box-shadow: 0 40px 90px rgba(0, 0, 0, 0.6);
}

.cmd-search {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px 20px;
  border-bottom: 1px solid var(--c-line);
  color: var(--c-green);
}

.cmd-input {
  flex: 1;
  min-width: 0;
  border: 0;
  outline: none;
  color: var(--c-cream);
  background: transparent;
  font: inherit;
  font-size: 1.1rem;
}
.cmd-input::placeholder { color: var(--c-cream-50); }

.cmd-kbd {
  padding: 3px 8px;
  border: 1px solid var(--c-line);
  border-radius: 6px;
  color: var(--c-cream-75);
  font-size: 0.68rem;
}

.cmd-list { max-height: min(360px, 52vh); overflow-y: auto; padding: 8px; }
.cmd-empty { padding: 28px; color: var(--c-cream-75); text-align: center; }

.cmd-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 14px;
  border-radius: var(--radius-md);
  color: var(--c-cream-75);
  cursor: pointer;
  transition: background 0.2s var(--ease-out), color 0.2s var(--ease-out);
}
.cmd-item.is-active { color: var(--c-cream); background: rgba(255, 252, 225, 0.07); }
.cmd-item__icon {
  display: grid;
  width: 34px;
  height: 34px;
  place-items: center;
  border-radius: 50%;
  color: var(--c-bg);
  background: var(--tone);
  font-size: 0.8rem;
}
.cmd-item__label { flex: 1; font-weight: 500; }
.cmd-item__arrow { opacity: 0; transform: translateX(-6px); transition: opacity 0.2s, transform 0.3s var(--ease-out); }
.cmd-item.is-active .cmd-item__arrow { opacity: 1; transform: none; }

.cmd-footer {
  display: flex;
  flex-wrap: wrap;
  gap: 18px;
  padding: 12px 20px;
  border-top: 1px solid var(--c-line);
  color: var(--c-cream-75);
  font-size: 0.75rem;
}
.cmd-footer kbd { margin-right: 4px; padding: 1px 6px; border: 1px solid var(--c-line); border-radius: 4px; }

.cmd-enter-active, .cmd-leave-active { transition: opacity 0.3s var(--ease-out); }
.cmd-enter-active .cmd-dialog, .cmd-leave-active .cmd-dialog { transition: transform 0.45s var(--ease-out), opacity 0.3s var(--ease-out); }
.cmd-enter-from, .cmd-leave-to { opacity: 0; }
.cmd-enter-from .cmd-dialog { opacity: 0; transform: translateY(24px) scale(0.97); }
.cmd-leave-to .cmd-dialog { opacity: 0; transform: translateY(10px); }
</style>

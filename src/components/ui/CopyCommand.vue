<template>
  <div ref="root" class="copy-cmd" :class="{ 'is-done': state === 'done' }">
    <span class="copy-cmd__label">{{ label }}</span>
    <div class="copy-cmd__row">
      <span class="copy-cmd__prompt" aria-hidden="true">$</span>
      <code ref="codeEl" class="copy-cmd__code">{{ command }}</code>
      <button
        type="button"
        class="copy-cmd__btn"
        :aria-label="`${copyLabel}: ${command}`"
        @click="copy"
      >
        <i ref="iconEl" :class="state === 'done' ? 'fas fa-check' : 'far fa-copy'" aria-hidden="true"></i>
      </button>
      <span ref="toastEl" class="copy-cmd__toast" aria-hidden="true">{{ state === 'fail' ? failLabel : doneShort }}</span>
    </div>
    <span class="sr-only" role="status" aria-live="polite">{{ liveMessage }}</span>
  </div>
</template>

<script setup>
import { computed, onUnmounted, ref } from 'vue';
import { gsap, prefersReducedMotion } from '@/lib/gsap';

const props = defineProps({
  command: { type: String, required: true },
  label: { type: String, default: 'Install' },
  copyLabel: { type: String, default: 'Copy command' },
  doneLabel: { type: String, default: 'Copied' },
  failLabel: { type: String, default: 'Copy failed' },
});

const root = ref(null);
const codeEl = ref(null);
const iconEl = ref(null);
const toastEl = ref(null);
const state = ref('idle');
const liveMessage = ref('');
const doneShort = computed(() => (document.documentElement.lang === 'vi' ? 'Đã chép!' : 'Copied!'));

let resetTimer;

const legacyCopy = text => {
  const area = document.createElement('textarea');
  area.value = text;
  area.setAttribute('readonly', '');
  area.style.position = 'fixed';
  area.style.opacity = '0';
  document.body.appendChild(area);
  area.select();
  let ok = false;
  try { ok = document.execCommand('copy'); } catch { ok = false; }
  area.remove();
  return ok;
};

const selectCode = () => {
  const range = document.createRange();
  range.selectNodeContents(codeEl.value);
  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
};

const flash = () => {
  if (prefersReducedMotion() || !toastEl.value) return;
  gsap.timeline()
    .fromTo(iconEl.value, { scale: 0.4, rotate: -40 }, { scale: 1, rotate: 0, duration: 0.6, ease: 'back.out(3)' })
    .fromTo(toastEl.value, { autoAlpha: 0, y: 8, scale: 0.9 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.35, ease: 'back.out(2)' }, 0)
    .to(toastEl.value, { autoAlpha: 0, y: -6, duration: 0.3, ease: 'power2.in' }, 1.4);
};

const copy = async () => {
  let ok = false;
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(props.command);
      ok = true;
    } else {
      ok = legacyCopy(props.command);
    }
  } catch {
    ok = legacyCopy(props.command);
  }

  window.clearTimeout(resetTimer);
  if (ok) {
    state.value = 'done';
    liveMessage.value = props.doneLabel;
  } else {
    state.value = 'fail';
    liveMessage.value = props.failLabel;
    selectCode();
  }
  flash();
  resetTimer = window.setTimeout(() => {
    state.value = 'idle';
    liveMessage.value = '';
  }, 2200);
};

onUnmounted(() => {
  window.clearTimeout(resetTimer);
  gsap.killTweensOf([iconEl.value, toastEl.value]);
});
</script>

<style scoped>
.copy-cmd { display: grid; gap: 10px; min-width: 0; }

.copy-cmd__label {
  color: var(--c-cream-75);
  font-family: var(--font-mono);
  font-size: var(--fs-micro);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.copy-cmd__row {
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
  padding: 8px 8px 8px 18px;
  border: 1.5px solid var(--c-line);
  border-radius: var(--radius-pill);
  background: rgba(15, 11, 19, 0.72);
  transition: border-color 0.3s var(--ease-out);
}

.copy-cmd.is-done .copy-cmd__row { border-color: var(--c-accent); }

.copy-cmd__prompt { color: var(--c-accent); font-family: var(--font-mono); font-weight: 700; }

.copy-cmd__code {
  flex: 1;
  min-width: 0;
  overflow-x: auto;
  color: var(--c-cream);
  font-size: 0.95rem;
  white-space: nowrap;
  scrollbar-width: none;
  user-select: all;
}
.copy-cmd__code::-webkit-scrollbar { display: none; }

.copy-cmd__btn {
  display: grid;
  width: 42px;
  height: 42px;
  flex: 0 0 auto;
  place-items: center;
  border-radius: 50%;
  color: var(--c-bg);
  background: var(--c-cream);
  transition: background 0.3s var(--ease-out), transform 0.3s var(--ease-out);
}
.copy-cmd__btn:hover { background: var(--c-peach); }
.copy-cmd__btn:active { transform: scale(0.92); }
.copy-cmd.is-done .copy-cmd__btn { background: var(--c-accent); }

.copy-cmd__toast {
  position: absolute;
  right: 0;
  bottom: calc(100% + 8px);
  padding: 6px 12px;
  border-radius: var(--radius-pill);
  color: var(--c-bg);
  background: var(--c-accent);
  font-size: var(--fs-micro);
  font-weight: 700;
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
}
</style>

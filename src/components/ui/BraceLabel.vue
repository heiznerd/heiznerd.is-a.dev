<template>
  <component :is="tag" class="brace" :class="`brace--${size}`">
    <span class="brace__glyph" aria-hidden="true">{</span>
    <span class="brace__body"><slot /></span>
    <span class="brace__glyph" aria-hidden="true">}</span>
  </component>
</template>

<script setup>
defineProps({
  tag: { type: String, default: 'span' },
  size: { type: String, default: 'sm' },
});
</script>

<style scoped>
.brace {
  display: inline-flex;
  align-items: center;
  gap: 0.3em;
  color: var(--c-cream);
  font-family: var(--font-sans);
  letter-spacing: -0.02em;
}

.brace__glyph {
  flex: 0 0 auto;
  font-weight: 200;
  line-height: 0.8;
  transform: translateY(-0.04em);
}

.brace--sm { font-size: 0.95rem; font-weight: 600; }
.brace--sm .brace__glyph { font-size: 2.3em; }

.brace--md { font-size: clamp(1rem, 1.4vw, 1.25rem); font-weight: 500; }
.brace--md .brace__glyph { font-size: 2.6em; }

.brace--lg { font-size: clamp(1.05rem, 1.55vw, 1.45rem); font-weight: 500; line-height: 1.25; }
.brace--lg .brace__glyph { font-size: 3.4em; }
.brace--lg .brace__body { max-width: 30ch; }
</style>

<template>
  <svg
    class="shape"
    :class="`shape--${name}`"
    viewBox="0 0 100 100"
    aria-hidden="true"
    focusable="false"
    overflow="visible"
  >
    <defs>
      <linearGradient :id="gradId" gradientUnits="userSpaceOnUse" :x1="coords.x1" :y1="coords.y1" :x2="coords.x2" :y2="coords.y2">
        <stop offset="0" :stop-color="colors[0]" />
        <stop offset="1" :stop-color="colors[1]" />
      </linearGradient>
      <radialGradient v-if="shine" :id="shineId" gradientUnits="userSpaceOnUse" cx="30" cy="26" r="62">
        <stop offset="0" stop-color="#ffffff" stop-opacity="0.55" />
        <stop offset="0.55" stop-color="#ffffff" stop-opacity="0" />
      </radialGradient>
    </defs>
    <g class="shape-body">
      <path
        class="shape-path"
        :d="shape.d"
        :fill="shape.stroke ? 'none' : `url(#${gradId})`"
        :stroke="shape.stroke ? `url(#${gradId})` : 'none'"
        :stroke-width="shape.stroke || 0"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        v-if="shine"
        class="shape-shine"
        :d="shape.d"
        :fill="shape.stroke ? 'none' : `url(#${shineId})`"
        :stroke="shape.stroke ? `url(#${shineId})` : 'none'"
        :stroke-width="shape.stroke || 0"
        stroke-linecap="round"
        stroke-linejoin="round"
        pointer-events="none"
      />
    </g>
  </svg>
</template>

<script setup>
import { computed, useId } from 'vue';
import { SHAPES, PALETTES } from './shapes.js';

const props = defineProps({
  name: { type: String, default: 'circle' },
  palette: { type: [String, Array], default: 'green' },
  angle: { type: Number, default: 135 },
  shine: { type: Boolean, default: true },
});

const uid = useId();
const gradId = `g-${uid}`;
const shineId = `s-${uid}`;

const shape = computed(() => SHAPES[props.name] || SHAPES.circle);
const colors = computed(() => (Array.isArray(props.palette) ? props.palette : PALETTES[props.palette] || PALETTES.green));
const coords = computed(() => {
  const rad = ((props.angle - 90) * Math.PI) / 180;
  const dx = Math.cos(rad) * 50;
  const dy = Math.sin(rad) * 50;
  return { x1: 50 - dx, y1: 50 - dy, x2: 50 + dx, y2: 50 + dy };
});
</script>

<style scoped>
.shape {
  display: block;
  width: 100%;
  height: auto;
  overflow: visible;
}
.shape-shine { mix-blend-mode: soft-light; }
</style>

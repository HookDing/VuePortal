<template>
  <div class="space-y-4">
    <header class="flex items-center justify-between text-sm text-slate-300">
      <div>
        <p class="text-xs uppercase tracking-[0.4em] text-slate-500">模拟</p>
        <p class="text-lg font-semibold">{{ title }}</p>
      </div>
      <span class="rounded-full border border-white/10 px-3 py-1">{{ displayWidth }} × {{ displayHeight }}</span>
    </header>
    <div
      class="relative mx-auto rounded-[3rem] border-[6px] border-slate-800 bg-slate-900 p-4 shadow-2xl"
      :style="{ width: frameWidth, height: frameHeight }"
    >
      <div class="absolute left-1/2 top-3 h-1 w-12 -translate-x-1/2 rounded-full bg-slate-700" />
      <div class="absolute right-2 top-32 h-16 w-1 rounded bg-slate-800" />
      <div class="h-full overflow-hidden rounded-[2.5rem] bg-white text-slate-900">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

type Props = {
  title: string;
  width: number;
  height: number;
  orientation?: 'portrait' | 'landscape';
  scale?: number;
};

const props = defineProps<Props>();

const orientation = computed(() => props.orientation ?? 'portrait');
const scale = computed(() => props.scale ?? 0.42);

const baseWidth = computed(() => (orientation.value === 'portrait' ? props.width : props.height));
const baseHeight = computed(() => (orientation.value === 'portrait' ? props.height : props.width));

const frameWidth = computed(() => {
  const limit = orientation.value === 'portrait' ? 640 : 860;
  return `${Math.min(baseWidth.value * scale.value, limit)}px`;
});
const frameHeight = computed(() => {
  const limit = orientation.value === 'portrait' ? 1100 : 620;
  return `${Math.min(baseHeight.value * scale.value, limit)}px`;
});

const displayWidth = computed(() => (orientation.value === 'portrait' ? props.width : props.height));
const displayHeight = computed(() => (orientation.value === 'portrait' ? props.height : props.width));
</script>



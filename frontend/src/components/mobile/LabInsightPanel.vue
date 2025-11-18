<template>
  <aside class="space-y-6">
    <article class="glass-panel workspace-window p-6">
      <h3 class="text-xl font-semibold">实验洞察</h3>
      <ul class="mt-4 space-y-4 text-sm text-slate-300">
        <li v-for="insight in insights" :key="insight.title" class="rounded-2xl border border-white/5 px-4 py-3">
          <p class="font-semibold text-white">{{ insight.title }}</p>
          <p class="text-xs text-muted">{{ insight.detail }}</p>
          <span
            class="mt-2 inline-flex rounded-full border border-white/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.3em]"
            >{{ insight.impact }}</span
          >
        </li>
      </ul>
    </article>

    <article class="glass-panel workspace-window p-6">
      <h3 class="text-xl font-semibold">设备概览</h3>
      <ul class="mt-4 space-y-3 text-sm text-slate-300">
        <li v-for="device in devices" :key="device.id" class="rounded-2xl border border-white/5 px-4 py-3">
          <div class="flex items-center justify-between gap-3">
            <div>
              <p class="text-base font-semibold text-white">{{ device.label }}</p>
              <p class="text-[11px] uppercase tracking-[0.3em] text-subtle">{{ device.breakpoint }}</p>
            </div>
            <span :class="signalColorMap[device.signal]">{{ signalCopy[device.signal] }}</span>
          </div>
          <p class="text-xs text-muted">{{ device.range }} · {{ device.network }}</p>
          <div class="mt-2 h-1.5 rounded-full bg-white/10">
            <span class="brand-gradient block h-full rounded-full" :style="{ width: device.usage }" />
          </div>
          <p class="text-xs text-muted">使用率 {{ device.usage }}</p>
        </li>
      </ul>
    </article>
  </aside>
</template>

<script setup lang="ts">
import type { DevicePreset, LabInsight } from '@/types/portal';

type SignalType = 'excellent' | 'good' | 'fair';

defineProps<{
  insights: LabInsight[];
  devices: DevicePreset[];
  signalColorMap: Record<SignalType, string>;
  signalCopy: Record<SignalType, string>;
}>();
</script>

<template>
  <div class="space-y-6">
    <header class="flex flex-wrap items-center justify-between gap-3">
      <div>
        <p class="text-xs uppercase tracking-[0.4em] text-muted">Mobility</p>
        <h2 class="text-3xl font-semibold">移动端模拟实验室</h2>
        <p class="text-sm text-muted">同步检测多终端视图，可快速切换断点、方向与明暗模式</p>
      </div>
      <div class="flex flex-wrap items-center gap-3">
        <span class="rounded-full border border-cyan-400/40 px-3 py-1 text-xs font-semibold text-cyan-200">实时连线</span>
        <button
          class="rounded-full border border-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-200 transition hover:bg-white/10"
          @click="compareMode = !compareMode"
        >
          {{ compareMode ? '双端比对' : '单端聚焦' }}
        </button>
        <button
          class="rounded-full border border-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-200 transition hover:bg-white/10"
          @click="orientation = orientation === 'portrait' ? 'landscape' : 'portrait'"
        >
          {{ orientation === 'portrait' ? '切换横屏' : '切换竖屏' }}
        </button>
      </div>
    </header>

    <div class="lab-grid lab-grid--split">
      <LabDeviceWall
        :quick-actions="quickActions"
        :devices="devices"
        :display-devices="displayDevices"
        :selected-device-profile="selectedDeviceProfile"
        :selected-device="selectedDevice"
        :orientation="orientation"
        :compare-mode="compareMode"
        :signal-color-map="signalColorMap"
        :signal-copy="signalCopy"
        @update:selected-device="selectedDevice = $event"
      />
      <LabInsightPanel
        :insights="insights"
        :devices="devices"
        :signal-color-map="signalColorMap"
        :signal-copy="signalCopy"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue';
import { useDeviceLab } from '@/composables/useDeviceLab';
import type { DevicePreset } from '@/types/portal';
import LabDeviceWall from '@/components/mobile/LabDeviceWall.vue';
import LabInsightPanel from '@/components/mobile/LabInsightPanel.vue';

const { devices, insights, quickActions } = useDeviceLab();

const selectedDevice = ref('');
const compareMode = ref(true);
const orientation = ref<'portrait' | 'landscape'>('portrait');

watchEffect(() => {
  if (!selectedDevice.value && devices.value.length) {
    selectedDevice.value = devices.value[0].id;
  }
});

const displayDevices = computed<DevicePreset[]>(() => {
  if (!devices.value.length) return [];
  if (!compareMode.value) {
    return [devices.value.find((item) => item.id === selectedDevice.value) ?? devices.value[0]];
  }
  const index = devices.value.findIndex((item) => item.id === selectedDevice.value);
  if (index === -1) {
    return [devices.value[0], devices.value[1] ?? devices.value[0]];
  }
  return [devices.value[index], devices.value[(index + 1) % devices.value.length]];
});

const selectedDeviceProfile = computed(() => devices.value.find((item) => item.id === selectedDevice.value));

const signalColorMap = {
  excellent: 'text-emerald-300',
  good: 'text-cyan-200',
  fair: 'text-amber-200',
} as const;

const signalCopy = {
  excellent: '信号优',
  good: '信号良',
  fair: '信号可',
} as const;
</script>

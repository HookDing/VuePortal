<template>
  <div class="space-y-6">
    <section class="window-grid">
      <article
        v-for="action in quickActions"
        :key="action.label"
        class="glass-panel flex flex-col gap-2 rounded-2xl border border-white/10 p-4"
      >
        <span class="text-2xl">{{ action.icon }}</span>
        <p class="text-sm font-semibold">{{ action.label }}</p>
        <p class="text-xs text-muted">{{ action.desc }}</p>
      </article>
    </section>

    <section class="glass-panel workspace-window p-6">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div class="space-y-1">
          <p class="text-xs uppercase tracking-[0.3em] text-subtle">设备选择</p>
          <p class="text-lg font-semibold">{{ selectedDeviceProfile?.label ?? '加载中' }}</p>
          <p class="text-xs text-muted">
            {{ selectedDeviceProfile?.range }} · {{ selectedDeviceProfile?.network }}
          </p>
        </div>
        <select
          :value="selectedDevice"
          class="rounded-full border border-white/10 bg-transparent px-4 py-2 text-sm focus:border-cyan-400"
          @change="onDeviceChange"
        >
          <option v-for="device in devices" :key="device.id" :value="device.id" class="bg-slate-900">
            {{ device.label }}
          </option>
        </select>
      </div>

      <div class="lab-device-grid mt-6">
        <DeviceFrame
          v-for="device in displayDevices"
          :key="device.id"
          :title="device.label"
          :width="device.width"
          :height="device.height"
          :orientation="orientation"
          :scale="frameScale"
        >
          <div class="flex h-full flex-col bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800">
            <header class="flex items-center justify-between border-b border-white/5 px-4 py-3 text-xs font-semibold text-white">
              <span>{{ device.label }} 模拟器</span>
              <div class="flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-muted">
                <span>{{ orientation === 'portrait' ? '竖屏' : '横屏' }}</span>
                <span>JWT 缓存</span>
              </div>
            </header>
            <div class="flex-1 space-y-4 overflow-auto px-4 py-4 text-sm text-slate-200">
              <div class="rounded-2xl bg-white/10 p-3">
                <p class="text-xs uppercase tracking-[0.4em] text-muted">JWT</p>
                <p class="text-lg font-semibold">Token 已载入</p>
                <p class="text-xs text-muted">模拟端实时共享凭证</p>
              </div>
              <div class="rounded-2xl bg-white/5 p-3">
                <p class="text-xs uppercase tracking-[0.4em] text-muted">任务</p>
                <ul class="mt-2 space-y-1">
                  <li v-for="item in device.todos" :key="item" class="flex items-center gap-2 text-xs">
                    <span>•</span>
                    <span>{{ item }}</span>
                  </li>
                </ul>
              </div>
              <div class="rounded-2xl bg-white/5 p-3">
                <p class="text-xs uppercase tracking-[0.4em] text-muted">延迟曲线</p>
                <div class="mt-2 flex items-end gap-1">
                  <span
                    v-for="(point, idx) in device.latency"
                    :key="idx"
                    class="inline-block w-2 rounded-full bg-gradient-to-t from-cyan-500 to-violet-400"
                    :style="{ height: `${point}px` }"
                  />
                </div>
              </div>
            </div>
            <footer class="flex items-center justify-between border-t border-white/10 px-4 py-2 text-xs text-muted">
              <div class="flex items-center gap-2">
                <span>{{ device.width }}×{{ device.height }}</span>
                <span class="text-[10px] uppercase tracking-[0.4em]">{{ device.breakpoint }}</span>
              </div>
              <span :class="signalColorMap[device.signal]">{{ signalCopy[device.signal] }}</span>
            </footer>
          </div>
        </DeviceFrame>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import DeviceFrame from '@/components/mobile/DeviceFrame.vue';
import type { DevicePreset, LabQuickAction } from '@/types/portal';
import { computed } from 'vue';

type SignalType = 'excellent' | 'good' | 'fair';

const props = defineProps<{
  quickActions: LabQuickAction[];
  devices: DevicePreset[];
  displayDevices: DevicePreset[];
  selectedDeviceProfile: DevicePreset | undefined;
  selectedDevice: string;
  orientation: 'portrait' | 'landscape';
  compareMode: boolean;
  signalColorMap: Record<SignalType, string>;
  signalCopy: Record<SignalType, string>;
}>();

const emit = defineEmits<{
  (event: 'update:selectedDevice', value: string): void;
}>();

const frameScale = computed(() => (props.compareMode ? 0.58 : 0.86));

const onDeviceChange = (event: Event) => {
  const value = (event.target as HTMLSelectElement).value;
  emit('update:selectedDevice', value);
};
</script>

<style scoped>
.lab-device-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(360px, 100%), 1fr));
  gap: clamp(20px, 2vw, 32px);
  align-items: start;
}
</style>

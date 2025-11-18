<template>
  <div class="space-y-6">
    <header class="flex flex-wrap items-center justify-between gap-3">
      <div>
        <p class="text-xs uppercase tracking-[0.4em] text-slate-400">Mobility</p>
        <h2 class="text-3xl font-semibold">移动端模拟实验室</h2>
        <p class="text-sm text-slate-400">同步检测多终端视图，可快速切换断点、方向与明暗模式</p>
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

    <div class="grid gap-6 xl:grid-cols-[2fr_1fr]">
      <div class="space-y-6">
        <section class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <article
            v-for="action in quickActions"
            :key="action.label"
            class="glass-panel flex flex-col gap-2 rounded-2xl border border-white/10 p-4"
          >
            <span class="text-2xl">{{ action.icon }}</span>
            <p class="text-sm font-semibold">{{ action.label }}</p>
            <p class="text-xs text-slate-400">{{ action.desc }}</p>
          </article>
        </section>

        <section class="glass-panel rounded-3xl border border-white/10 p-6">
          <div class="flex flex-wrap items-center justify-between gap-3">
            <div class="space-y-1">
              <p class="text-xs uppercase tracking-[0.3em] text-slate-500">设备选择</p>
              <p class="text-lg font-semibold">{{ selectedDeviceProfile?.label ?? '加载中' }}</p>
              <p class="text-xs text-slate-400">{{ selectedDeviceProfile?.range }} • {{ selectedDeviceProfile?.network }}</p>
            </div>
            <select v-model="selectedDevice" class="rounded-full border border-white/10 bg-transparent px-4 py-2 text-sm focus:border-cyan-400">
              <option v-for="device in devices" :key="device.id" :value="device.id" class="bg-slate-900">{{ device.label }}</option>
            </select>
          </div>

          <div class="mt-6 grid gap-6 lg:grid-cols-2">
            <DeviceFrame
              v-for="device in displayDevices"
              :key="device.id"
              :title="device.label"
              :width="device.width"
              :height="device.height"
              :orientation="orientation"
              :scale="compareMode ? 0.58 : 0.8"
            >
              <div class="flex h-full flex-col bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800">
                <header class="flex items-center justify-between border-b border-white/5 px-4 py-3 text-xs font-semibold text-white">
                  <span>{{ device.label }} 模拟区</span>
                  <div class="flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-slate-400">
                    <span>{{ orientation === 'portrait' ? '竖屏' : '横屏' }}</span>
                    <span>JWT 缓存</span>
                  </div>
                </header>
                <div class="flex-1 space-y-4 overflow-auto px-4 py-4 text-sm text-slate-200">
                  <div class="rounded-2xl bg-white/10 p-3">
                    <p class="text-xs uppercase tracking-[0.4em] text-slate-400">JWT</p>
                    <p class="text-lg font-semibold">Token 已载入</p>
                    <p class="text-xs text-slate-400">模拟端实时共享凭证</p>
                  </div>
                  <div class="rounded-2xl bg-white/5 p-3">
                    <p class="text-xs uppercase tracking-[0.4em] text-slate-400">任务</p>
                    <ul class="mt-2 space-y-1">
                      <li v-for="item in device.todos" :key="item" class="flex items-center gap-2 text-xs">
                        <span>•</span>
                        <span>{{ item }}</span>
                      </li>
                    </ul>
                  </div>
                  <div class="rounded-2xl bg-white/5 p-3">
                    <p class="text-xs uppercase tracking-[0.4em] text-slate-400">延迟曲线</p>
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
                <footer class="flex items-center justify-between border-t border-white/10 px-4 py-2 text-xs text-slate-400">
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

      <aside class="space-y-6">
        <article class="glass-panel rounded-3xl border border-white/10 p-6">
          <h3 class="text-xl font-semibold">实验洞察</h3>
          <ul class="mt-4 space-y-4 text-sm text-slate-300">
            <li v-for="insight in insights" :key="insight.title" class="rounded-2xl border border-white/5 px-4 py-3">
              <p class="font-semibold text-white">{{ insight.title }}</p>
              <p class="text-xs text-slate-400">{{ insight.detail }}</p>
              <span class="mt-2 inline-flex rounded-full border border-white/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.3em]">{{ insight.impact }}</span>
            </li>
          </ul>
        </article>
        <article class="glass-panel rounded-3xl border border-white/10 p-6">
          <h3 class="text-xl font-semibold">设备概览</h3>
          <ul class="mt-4 space-y-3 text-sm text-slate-300">
            <li
              v-for="device in devices"
              :key="device.id"
              class="rounded-2xl border border-white/5 px-4 py-3"
            >
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-base font-semibold text-white">{{ device.label }}</p>
                  <p class="text-[11px] uppercase tracking-[0.3em] text-slate-500">{{ device.breakpoint }}</p>
                </div>
                <span :class="signalColorMap[device.signal]">{{ signalCopy[device.signal] }}</span>
              </div>
              <p class="text-xs text-slate-400">{{ device.range }} • {{ device.network }}</p>
              <div class="mt-2 h-1.5 rounded-full bg-white/10">
                <span class="brand-gradient block h-full rounded-full" :style="{ width: device.usage }" />
              </div>
              <p class="text-xs text-slate-400">使用率 {{ device.usage }}</p>
            </li>
          </ul>
        </article>
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue';
import DeviceFrame from '@/components/mobile/DeviceFrame.vue';
import { useDeviceLab } from '@/composables/useDeviceLab';
import type { DevicePreset } from '@/types/portal';

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
  fair: '信号中',
} as const;
</script>

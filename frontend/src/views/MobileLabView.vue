<template>
  <div class="space-y-6">
    <header class="flex flex-wrap items-center justify-between gap-3">
      <div>
        <p class="text-xs uppercase tracking-[0.4em] text-slate-400">Mobility</p>
        <h2 class="text-3xl font-semibold">移动端模拟实验室</h2>
        <p class="text-sm text-slate-400">同步检测多终端视图，可快速切换断点、方向与明暗模式</p>
      </div>
      <div class="flex flex-wrap items-center gap-3 rounded-full border border-white/10 px-4 py-2 text-sm">
        <select v-model="selectedDevice" class="rounded-full bg-transparent outline-none focus:text-cyan-200">
          <option v-for="device in devices" :key="device.id" :value="device.id" class="bg-slate-900">
            {{ device.label }}
          </option>
        </select>
        <span class="text-slate-500">|</span>
        <button
          class="rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em]"
          :class="compareMode ? 'bg-white/20 text-white' : 'text-slate-400'"
          @click="compareMode = !compareMode"
        >
          双端比对
        </button>
        <button
          class="rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em]"
          :class="orientation === 'portrait' ? 'bg-white/20 text-white' : 'text-slate-400'"
          @click="orientation = orientation === 'portrait' ? 'landscape' : 'portrait'"
        >
          {{ orientation === 'portrait' ? '竖屏' : '横屏' }}
        </button>
      </div>
    </header>

    <section class="grid gap-6 xl:grid-cols-[1.8fr_1fr]">
      <div class="grid gap-6 lg:grid-cols-2">
        <DeviceFrame
          v-for="device in displayDevices"
          :key="device.id"
          :title="device.label"
          :width="device.width"
          :height="device.height"
          :orientation="orientation"
          :scale="compareMode ? 0.6 : 0.8"
        >
          <div class="flex h-full flex-col bg-gradient-to-b from-slate-900 to-slate-800">
            <header class="flex items-center justify-between bg-white/10 px-4 py-3 text-xs font-semibold text-white">
              <span>{{ device.label }} 模拟区</span>
              <span>{{ orientation === 'portrait' ? '竖屏' : '横屏' }}</span>
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
                  <li v-for="item in device.todos" :key="item" class="flex items-center gap-2">
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
              <span>{{ device.width }}×{{ device.height }}</span>
              <span>{{ device.breakpoint }}</span>
            </footer>
          </div>
        </DeviceFrame>
      </div>

      <aside class="glass-panel space-y-4 rounded-3xl border border-white/10 p-5">
        <h3 class="text-xl font-semibold">断点监控</h3>
        <ul class="space-y-3 text-sm text-slate-300">
          <li v-for="device in devices" :key="device.id" class="rounded-2xl border border-white/5 px-4 py-3">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-base font-semibold text-white">{{ device.label }}</p>
                <p class="text-xs uppercase tracking-[0.3em] text-slate-500">{{ device.breakpoint }}</p>
              </div>
              <span class="text-xs text-cyan-200">{{ device.width }}×{{ device.height }}</span>
            </div>
            <p class="mt-2 text-xs text-slate-400">活跃组件：{{ device.todos[0] }}</p>
            <div class="mt-2 h-1.5 rounded-full bg-white/5">
              <span class="brand-gradient block h-full rounded-full" :style="{ width: device.usage }" />
            </div>
          </li>
        </ul>
      </aside>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import DeviceFrame from '@/components/mobile/DeviceFrame.vue';

const devices = [
  { id: 'phone', label: 'Phone 375px', width: 375, height: 812, breakpoint: 'sm', todos: ['审批流程', '消息推送', '离线缓存'], latency: [14, 28, 22, 35, 19], usage: '74%' },
  { id: 'pad', label: 'Pad 768px', width: 768, height: 1024, breakpoint: 'lg', todos: ['侧边栏优化', '栅格布局', '键盘交互'], latency: [10, 16, 12, 20, 14], usage: '52%' },
  { id: 'pda', label: 'PDA 360px', width: 360, height: 640, breakpoint: 'pda', todos: ['极简模式', '单手操作', '语音入口'], latency: [28, 30, 24, 40, 32], usage: '31%' },
];

const selectedDevice = ref(devices[0].id);
const compareMode = ref(true);
const orientation = ref<'portrait' | 'landscape'>('portrait');

const displayDevices = computed(() => {
  if (!compareMode.value) {
    return [devices.find((item) => item.id === selectedDevice.value)!];
  }
  const index = devices.findIndex((item) => item.id === selectedDevice.value);
  return [devices[index], devices[(index + 1) % devices.length]];
});
</script>



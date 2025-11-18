<template>
  <div class="space-y-6">
    <header class="flex flex-wrap items-center justify-between gap-4">
      <div>
        <p class="text-xs uppercase tracking-[0.4em] text-slate-400">Control</p>
        <h2 class="text-3xl font-semibold">统一控制台</h2>
        <p class="text-sm text-slate-400">多端实时指标、任务与通道状态一屏掌控</p>
      </div>
      <div class="flex items-center gap-3">
        <span class="rounded-full border border-emerald-400/30 px-3 py-1 text-xs font-semibold text-emerald-200">JWT 已启用</span>
        <button
          class="rounded-full border border-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-200 transition hover:bg-white/10"
          @click="refresh"
        >
          刷新视图
        </button>
      </div>
    </header>

    <div class="grid gap-6 xl:grid-cols-[2fr_1fr]">
      <div class="space-y-6">
        <section class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <article
            v-for="item in highlightStats"
            :key="item.title"
            class="glass-panel space-y-2 rounded-2xl border border-white/10 p-4"
          >
            <div class="flex items-center justify-between">
              <p class="text-xs uppercase tracking-[0.4em] text-slate-500">{{ item.title }}</p>
              <span :class="['text-xs font-semibold', item.trend === 'up' ? 'text-emerald-300' : 'text-rose-300']">{{ item.delta }}</span>
            </div>
            <p class="text-3xl font-semibold">{{ item.value }}</p>
            <p class="text-xs text-slate-400">{{ item.description }}</p>
          </article>
        </section>

        <section class="grid gap-4 lg:grid-cols-2">
          <article class="glass-panel rounded-3xl border border-white/10 p-6">
            <h3 class="text-xl font-semibold">工作区状态</h3>
            <ul class="mt-4 grid gap-3 sm:grid-cols-2">
              <li
                v-for="metric in workMetrics"
                :key="metric.label"
                class="rounded-2xl border border-white/5 px-3 py-3"
              >
                <p class="text-xs uppercase tracking-[0.3em] text-slate-500">{{ metric.label }}</p>
                <p :class="['text-2xl font-semibold', metric.accent ?? 'text-slate-100']">{{ metric.value }}</p>
                <p class="text-xs text-slate-400">{{ metric.description }}</p>
              </li>
            </ul>
          </article>
          <article class="glass-panel rounded-3xl border border-white/10 p-6">
            <h3 class="text-xl font-semibold">今日任务</h3>
            <div class="mt-4 space-y-3">
              <label
                v-for="task in tasks"
                :key="task.title"
                class="flex items-center gap-3 rounded-2xl border border-white/5 px-3 py-2 text-sm"
              >
                <input type="checkbox" class="h-4 w-4 rounded border-transparent text-cyan-400 focus:ring-cyan-400" :checked="task.done" />
                <div class="flex-1">
                  <p :class="['font-medium', task.done ? 'line-through text-slate-500' : 'text-white']">{{ task.title }}</p>
                  <p v-if="!task.done" class="text-[11px] uppercase tracking-[0.3em] text-amber-200">待跟进</p>
                </div>
              </label>
            </div>
          </article>
        </section>

        <section class="device-grid grid gap-4 md:grid-cols-2">
          <article
            v-for="device in devices"
            :key="device.name"
            class="glass-panel space-y-3 rounded-3xl border border-white/10 p-5"
          >
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-xl font-semibold">{{ device.name }}</h3>
                <p class="text-xs uppercase tracking-[0.35em] text-slate-500">{{ device.breakpoint }}</p>
              </div>
              <span class="text-xs text-slate-400">{{ device.range }}</span>
            </div>
            <p class="text-sm text-slate-300">{{ device.desc }}</p>
            <div class="flex flex-wrap gap-2 text-[11px] text-slate-400">
              <span v-for="tag in device.tags" :key="tag" class="rounded-full border border-white/10 px-2 py-0.5">{{ tag }}</span>
            </div>
            <div class="text-xs uppercase text-slate-400">
              像素 {{ device.px }}
            </div>
            <div class="mt-1 h-1.5 rounded-full bg-white/10">
              <span class="brand-gradient block h-full rounded-full" :style="{ width: device.coverage }" />
            </div>
            <p class="text-xs text-slate-400">覆盖率 {{ device.coverage }}</p>
          </article>
        </section>
      </div>

      <aside class="space-y-6">
        <article class="glass-panel rounded-3xl border border-white/10 p-6">
          <h3 class="text-xl font-semibold">通道活动</h3>
          <ul class="mt-4 space-y-4 text-sm">
            <li
              v-for="item in activity"
              :key="item.title"
              class="flex items-center gap-3 rounded-2xl border border-white/5 px-3 py-2"
            >
              <span class="text-xs text-slate-500">{{ item.time }}</span>
              <div class="h-2 w-2 rounded-full" :class="statusColorMap[item.status]" />
              <div class="flex-1">
                <p class="text-white">{{ item.title }}</p>
                <p class="text-[11px] uppercase tracking-[0.4em] text-slate-500">{{ item.channel }}</p>
              </div>
              <span
                class="rounded-full px-2 py-0.5 text-[10px] font-semibold"
                :class="item.status === 'synced' ? 'bg-emerald-500/20 text-emerald-200' : 'bg-amber-500/20 text-amber-200'"
              >
                {{ item.status === 'synced' ? '已同步' : '排队' }}
              </span>
            </li>
          </ul>
        </article>
        <article class="glass-panel rounded-3xl border border-white/10 p-6">
          <h3 class="text-xl font-semibold">通道可用性</h3>
          <table class="mt-4 w-full text-sm text-slate-200">
            <thead>
              <tr class="text-left text-xs uppercase tracking-[0.3em] text-slate-500">
                <th class="py-1">通道</th>
                <th class="py-1">可用性</th>
                <th class="py-1">延迟</th>
                <th class="py-1 text-right">趋势</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="channel in channels" :key="channel.channel" class="border-t border-white/5">
                <td class="py-2 font-semibold">{{ channel.channel }}</td>
                <td class="py-2">{{ channel.uptime }}</td>
                <td class="py-2">{{ channel.latency }}</td>
                <td class="py-2 text-right">
                  <span :class="channel.trend.startsWith('-') ? 'text-rose-300' : 'text-emerald-300'">{{ channel.trend }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </article>
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDashboardSnapshot } from '@/composables/useDashboardSnapshot';

const { highlightStats, devices, workMetrics, tasks, activity, channels, refresh } = useDashboardSnapshot();

const statusColorMap = {
  synced: 'bg-emerald-400',
  pending: 'bg-amber-300',
} as const;
</script>

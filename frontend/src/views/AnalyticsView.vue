<template>
  <div class="space-y-6">
    <header>
      <p class="text-xs uppercase tracking-[0.4em] text-muted">Insights</p>
      <h2 class="text-3xl font-semibold">多端行为分析</h2>
    </header>

    <section class="auto-grid">
      <article class="glass-panel space-y-4 p-6">
        <h3 class="text-xl font-semibold">活跃终端趋势</h3>
        <div class="space-y-3 text-sm text-slate-300">
          <div v-for="item in trend" :key="item.label" class="space-y-1">
            <div class="flex items-center justify-between">
              <span>{{ item.label }}</span>
              <span class="font-semibold text-cyan-300">{{ item.value }}</span>
            </div>
            <div class="h-2 rounded-full bg-white/10">
              <span class="brand-gradient block h-full rounded-full" :style="{ width: item.percent }" />
            </div>
          </div>
        </div>
      </article>
      <article class="glass-panel space-y-4 p-6">
        <h3 class="text-xl font-semibold">会话分布</h3>
        <ul class="space-y-3 text-sm text-slate-300">
          <li v-for="item in segments" :key="item.label" class="flex items-center justify-between rounded-lg bg-white/5 px-4 py-2">
            <span>{{ item.label }}</span>
            <span class="font-semibold text-violet-200">{{ item.value }}</span>
          </li>
        </ul>
      </article>
    </section>
  </div>
</template>

<script setup lang="ts">
const trend = [
  { label: 'PC', value: '52%', percent: '52%' },
  { label: 'PAD', value: '28%', percent: '28%' },
  { label: 'Phone', value: '17%', percent: '17%' },
  { label: 'PDA', value: '3%', percent: '3%' },
];

const segments = [
  { label: 'Premium 套餐', value: '36 会话' },
  { label: '企业空间', value: '22 会话' },
  { label: '体验版', value: '11 会话' },
];
</script>



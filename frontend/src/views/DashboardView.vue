<template>
  <div class="space-y-6">
    <header class="flex flex-wrap items-center gap-4">
      <div>
        <p class="text-xs uppercase tracking-[0.4em] text-slate-400">Control</p>
        <h2 class="text-3xl font-semibold">统一控制台</h2>
      </div>
      <span class="rounded-full border border-emerald-400/30 px-3 py-1 text-xs font-semibold text-emerald-200">
        JWT 已启用
      </span>
    </header>

    <section class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <article
        v-for="item in highlightStats"
        :key="item.title"
        class="glass-panel space-y-2 rounded-3xl border border-white/10 p-5"
      >
        <p class="text-xs uppercase tracking-[0.4em] text-slate-500">{{ item.title }}</p>
        <p class="text-3xl font-semibold">{{ item.value }}</p>
        <p class="text-xs text-emerald-300" v-if="item.delta">
          {{ item.delta }} vs last week
        </p>
      </article>
    </section>

    <section class="device-grid">
      <article
        v-for="device in devices"
        :key="device.name"
        class="glass-panel space-y-2 rounded-3xl border border-white/10 p-5"
      >
        <div class="flex items-center justify-between">
          <h3 class="text-xl font-semibold">{{ device.name }}</h3>
          <span class="text-sm text-slate-400">{{ device.range }}</span>
        </div>
        <p class="text-sm text-slate-300">{{ device.desc }}</p>
        <div class="flex items-center justify-between text-xs uppercase text-slate-400">
          <span>断点 {{ device.breakpoint }}</span>
          <span>像素 {{ device.px }}</span>
        </div>
      </article>
    </section>

    <section class="grid gap-6 lg:grid-cols-2">
      <article class="glass-panel rounded-3xl border border-white/10 p-6">
        <h3 class="text-xl font-semibold">工作区状态</h3>
        <ul class="mt-4 space-y-3">
          <li v-for="(item, idx) in metrics" :key="idx" class="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2 text-sm">
            <span>{{ item.label }}</span>
            <span class="font-semibold text-cyan-300">{{ item.value }}</span>
          </li>
        </ul>
      </article>
      <article class="glass-panel rounded-3xl border border-white/10 p-6">
        <h3 class="text-xl font-semibold">今日任务</h3>
        <div class="mt-4 space-y-3">
          <label v-for="task in tasks" :key="task.title" class="flex items-center gap-3 rounded-lg bg-white/5 px-3 py-2 text-sm">
            <input type="checkbox" class="h-4 w-4 rounded border-transparent text-cyan-400 focus:ring-cyan-400" :checked="task.done" />
            <span :class="{ 'line-through text-slate-500': task.done }">{{ task.title }}</span>
          </label>
        </div>
      </article>
    </section>
  </div>
</template>

<script setup lang="ts">
const highlightStats = [
  { title: 'TOTAL SESSION', value: '128', delta: '+6%' },
  { title: 'MOBILE SHARE', value: '65%', delta: '+3%' },
  { title: 'ERROR RATE', value: '0.4%', delta: '-0.2%' },
  { title: 'AVG RESPONSE', value: '58 ms', delta: '-5ms' },
];

const devices = [
  { name: 'PC', desc: '桌面端 1280px+', range: '>=1280px', breakpoint: 'xl', px: '1280' },
  { name: 'PAD', desc: '平板端 768-1024px', range: '768-1024px', breakpoint: 'md-lg', px: '768' },
  { name: 'Phone', desc: '移动手机 375-767px', range: '375-767px', breakpoint: 'sm', px: '640' },
  { name: 'PDA', desc: '超小尺寸 320-374px', range: '320-374px', breakpoint: 'pda', px: '480' },
];

const metrics = [
  { label: '活跃会话', value: '8' },
  { label: '在线终端', value: '24' },
  { label: '跨端同步', value: '99.4%' },
  { label: '平均延迟', value: '62ms' },
];

const tasks = [
  { title: '完善移动端模拟器', done: true },
  { title: '接入 JWT 鉴权', done: true },
  { title: '优化多端自适应', done: false },
];
</script>



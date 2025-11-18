<template>
  <div class="space-y-6">
    <header>
      <p class="text-xs uppercase tracking-[0.4em] text-muted">Control</p>
      <h2 class="text-3xl font-semibold">设置中心</h2>
    </header>

    <section class="glass-panel space-y-4 p-6">
      <h3 class="text-xl font-semibold">多端适配</h3>
      <div class="auto-grid">
        <label v-for="item in modes" :key="item.label" class="rounded-xl border border-white/10 bg-white/5 p-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-base font-semibold">{{ item.label }}</p>
              <p class="text-xs uppercase tracking-widest text-muted">{{ item.breakpoint }}</p>
            </div>
            <input type="checkbox" class="h-5 w-5 rounded border-transparent text-cyan-400 focus:ring-cyan-400" checked />
          </div>
          <p class="mt-3 text-sm text-slate-300">{{ item.desc }}</p>
        </label>
      </div>
    </section>

    <section class="glass-panel space-y-4 p-6">
      <h3 class="text-xl font-semibold">通知渠道</h3>
      <div class="space-y-3 text-sm text-slate-300">
        <label class="flex items-center justify-between rounded-lg bg-white/5 px-4 py-2">
          <span>邮件提醒</span>
          <input type="checkbox" class="h-5 w-10 rounded-full border-transparent text-violet-400 focus:ring-violet-400" checked />
        </label>
        <label class="flex items-center justify-between rounded-lg bg-white/5 px-4 py-2">
          <span>短信提醒</span>
          <input type="checkbox" class="h-5 w-10 rounded-full border-transparent text-violet-400 focus:ring-violet-400" />
        </label>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const modes = [
  { label: 'PC 桌面', breakpoint: 'xl ≥1280px', desc: '适配宽屏与多列布局' },
  { label: 'Pad 平板', breakpoint: 'lg 1024px', desc: '适配 2 列信息栅格' },
  { label: 'Phone 手机', breakpoint: 'sm 640px', desc: '单列紧凑布局' },
  { label: 'PDA 超小屏', breakpoint: 'pda 480px', desc: '极简排版与触控优化' },
];
</script>



<template>
  <div class="mx-auto max-w-xl space-y-4 text-center">
    <p class="text-sm uppercase tracking-[0.4em] text-subtle">404</p>
    <h2 class="text-4xl font-semibold">页面丢失</h2>
    <p class="text-muted">该路由暂未配置，返回工作区继续体验。</p>
    <RouterLink to="/dashboard" class="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-2 text-sm font-semibold text-white transition hover:bg-white/10">
      返回首页
    </RouterLink>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router';
</script>



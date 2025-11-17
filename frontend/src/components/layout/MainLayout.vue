<template>
  <div class="min-h-screen transition-colors" :class="themeStore.theme === 'dark' ? 'bg-slate-950 text-slate-50' : 'bg-slate-200 text-slate-900'">
    <div class="app-shell grid min-h-screen gap-4 px-3 pb-4 pt-4 sm:px-4 lg:px-0">
      <aside class="glass-panel hidden rounded-[2rem] border border-white/10 xl:px-8 xl:py-8 lg:flex lg:flex-col lg:gap-8 lg:p-6">
        <div>
          <p class="text-sm uppercase tracking-[0.3em] text-slate-400">Vue Portal</p>
          <h1 class="mt-2 text-2xl font-semibold">多端门户</h1>
        </div>
        <div class="space-y-2">
          <RouterLink
            v-for="item in menuItems"
            :key="item.path"
            class="flex items-center gap-3 rounded-2xl px-3 py-3 transition hover:bg-white/5"
            :class="{ 'bg-white/10 text-white': route.path === item.path }"
            :to="item.path"
          >
            <span class="text-xl w-6 text-center">{{ item.icon }}</span>
            <div class="min-w-0">
              <p class="text-xs uppercase tracking-[0.35em] text-slate-400">{{ item.labelEn }}</p>
              <p class="text-base font-semibold leading-tight">{{ item.label }}</p>
            </div>
          </RouterLink>
        </div>
        <div class="mt-auto space-y-2 text-xs uppercase tracking-[0.4em] text-slate-400">
          <p>PC • PAD • PHONE • PDA</p>
          <p>GLASS EXPERIENCE</p>
        </div>
      </aside>

      <section class="glass-panel relative flex min-h-[calc(100vh-2rem)] flex-col overflow-hidden rounded-[2rem] border border-white/10">
        <header class="flex flex-wrap items-center gap-4 border-b border-white/5 px-4 py-3 md:px-6 xl:px-10">
          <button
            class="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1 text-xs font-semibold md:hidden"
            @click="showMenu = !showMenu"
          >
            <span>☰</span>
            <span>导航</span>
          </button>
          <div class="flex flex-1 flex-col">
            <p class="text-[10px] uppercase tracking-[0.6em] text-slate-500">Active user</p>
            <p class="text-lg font-semibold">{{ auth.user?.name ?? '访客' }}</p>
            <p class="text-xs text-slate-400">{{ auth.user?.email ?? '未登录' }}</p>
          </div>
          <div class="flex flex-wrap items-center gap-2">
            <button
              :class="[
                'inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] transition',
                themeStore.theme === 'dark'
                  ? 'border-white/10 text-slate-200 hover:bg-white/10'
                  : 'border-slate-300 text-slate-700 hover:bg-white/70',
              ]"
              @click="themeStore.toggleTheme"
            >
              {{ themeStore.theme === 'dark' ? '浅色' : '深色' }}
            </button>
            <RouterLink
              v-if="auth.isAuthenticated"
              to="/profile"
              class="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-200 transition hover:bg-white/10"
            >
              管理资料
            </RouterLink>
            <RouterLink
              v-if="!auth.isAuthenticated"
              to="/login"
              class="rounded-lg bg-white/10 px-4 py-2 text-sm font-medium transition hover:bg-white/20"
            >
              登录
            </RouterLink>
            <button
              v-else
              class="rounded-lg bg-rose-500/20 px-4 py-2 text-sm font-semibold text-rose-200 transition hover:bg-rose-500/30"
              @click="handleLogout"
            >
              退出
            </button>
          </div>
        </header>

        <TabToolbar class="border-b border-white/5" />

        <main class="flex-1 overflow-auto px-4 py-4 md:px-8 xl:px-12">
          <RouterView v-slot="{ Component }">
            <Transition name="fade-slide" mode="out-in">
              <component :is="Component" />
            </Transition>
          </RouterView>
        </main>
      </section>
    </div>

    <Transition name="fade">
      <div
        v-if="showMenu"
        class="fixed inset-0 z-20 bg-black/60 lg:hidden"
        @click="showMenu = false"
      >
        <nav class="absolute left-4 right-4 top-16 glass-panel space-y-3 p-4">
          <RouterLink
            v-for="item in menuItems"
            :key="item.path"
            class="block rounded-xl px-4 py-3 text-lg transition hover:bg-white/5"
            :class="{ 'bg-white/10 text-white': route.path === item.path }"
            :to="item.path"
            @click="showMenu = false"
          >
            {{ item.icon }} {{ item.label }}
          </RouterLink>
        </nav>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router';
import { Transition, watch, ref, computed } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useTabStore } from '@/stores/tabs';
import { useThemeStore } from '@/stores/theme';
import TabToolbar from './TabToolbar.vue';

const auth = useAuthStore();
const tabStore = useTabStore();
const themeStore = useThemeStore();
const route = useRoute();
const router = useRouter();

const showMenu = ref(false);

watch(
  () => route.fullPath,
  () => {
    if (!route.meta.public) {
      tabStore.addTab(route);
    } else if (route.name === 'login' || route.name === 'register') {
      tabStore.reset();
    }
    showMenu.value = false;
  },
  { immediate: true },
);

const handleLogout = () => {
  auth.logout();
  tabStore.reset();
  router.push({ name: 'login' });
};

const menuItems = computed(() => {
  const base = [
    { path: '/dashboard', label: '概览', labelEn: 'Overview', icon: '⌁' },
    { path: '/analytics', label: '数据分析', labelEn: 'Analytics', icon: '⌗' },
    { path: '/settings', label: '设置中心', labelEn: 'Settings', icon: '⚙' },
    { path: '/mobile-lab', label: '移动实验室', labelEn: 'Mobile Lab', icon: '☎' },
    { path: '/profile', label: '个人中心', labelEn: 'Profile', icon: '🙂' },
  ];
  if (auth.user?.role === 'admin') {
    base.push({ path: '/users', label: '用户管理', labelEn: 'Users', icon: '✦' });
  }
  return base;
});
</script>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.15s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(8px);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.12s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>



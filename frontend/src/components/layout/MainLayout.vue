<template>
  <div class="min-h-screen h-full transition-colors" :class="themeStore.theme === 'dark' ? 'bg-slate-950 text-slate-50' : 'bg-slate-200 text-slate-900'">
    <div class="app-shell grid h-full min-h-0 gap-4 px-3 pb-4 pt-4 sm:px-4 lg:px-0">
      <aside class="glass-panel hidden rounded-[2rem] border border-white/10 xl:px-8 xl:py-8 lg:flex lg:flex-col lg:gap-8 lg:p-6 lg:sticky lg:top-4 lg:h-[calc(100vh-2rem)] lg:overflow-y-auto">
        <div>
          <p class="text-sm uppercase tracking-[0.3em] text-muted">Vue Portal</p>
          <h1 class="mt-2 text-2xl font-semibold">多端门户</h1>
        </div>
        <div class="space-y-2">
          <RouterLink
            v-for="item in menuItems"
            :key="item.path"
            class="flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium transition"
            :class="[route.path === item.path ? sidebarLinkTone.active : sidebarLinkTone.inactive]"
            :to="item.path"
          >
            <span class="text-xl w-6 text-center">{{ item.icon }}</span>
            <div class="min-w-0">
              <p class="text-xs uppercase tracking-[0.35em] text-muted">{{ item.labelEn }}</p>
              <p class="text-base font-semibold leading-tight">{{ item.label }}</p>
            </div>
          </RouterLink>
        </div>
        <div class="mt-auto space-y-2 text-xs uppercase tracking-[0.4em] text-muted">
          <p>PC • PAD • PHONE • PDA</p>
          <p>GLASS EXPERIENCE</p>
        </div>
      </aside>

      <section class="glass-panel workspace-window relative flex h-full min-h-0 flex-col overflow-hidden rounded-[2rem] border border-white/10">
        <header class="flex flex-wrap items-center gap-4 border-b border-white/5 px-4 py-3 md:px-6 xl:px-10">
          <button
            class="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1 text-xs font-semibold md:hidden"
            @click="showMenu = !showMenu"
          >
            <span>☰</span>
            <span>导航</span>
          </button>
          <div class="flex flex-1 flex-col">
            <p class="text-[10px] uppercase tracking-[0.6em] text-subtle">Active user</p>
            <p class="text-lg font-semibold">{{ auth.user?.name ?? '访客' }}</p>
            <p class="text-xs text-muted">{{ auth.user?.email ?? '未登录' }}</p>
          </div>
          <div class="flex flex-wrap items-center gap-2">
            <button
              :class="[
                'inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] transition',
                themeStore.theme === 'dark'
                  ? 'border-white/15 text-slate-100 hover:bg-white/10'
                  : 'border-slate-300 text-slate-800 hover:bg-slate-900/5',
              ]"
              @click="themeStore.toggleTheme"
            >
              {{ themeStore.theme === 'dark' ? '浅色' : '深色' }}
            </button>
            <RouterLink
              v-if="auth.isAuthenticated"
              to="/profile"
              :class="[
                'inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] transition',
                themeStore.theme === 'dark'
                  ? 'border-white/15 text-slate-100 hover:bg-white/10'
                  : 'border-slate-300 text-slate-900 hover:bg-slate-900/5',
              ]"
            >
              管理资料
            </RouterLink>
            <RouterLink
              v-if="!auth.isAuthenticated"
              to="/login"
              :class="[
                'rounded-lg px-4 py-2 text-sm font-medium transition',
                themeStore.theme === 'dark'
                  ? 'bg-white/10 text-white hover:bg-white/20'
                  : 'bg-slate-900 text-white hover:bg-slate-800',
              ]"
            >
              登录
            </RouterLink>
            <button
              v-else
              :class="[
                'rounded-lg px-4 py-2 text-sm font-semibold transition',
                themeStore.theme === 'dark'
                  ? 'bg-rose-500/20 text-rose-100 hover:bg-rose-500/30'
                  : 'bg-rose-100 text-rose-600 hover:bg-rose-200',
              ]"
              @click="handleLogout"
            >
              退出
            </button>
          </div>
        </header>

        <TabToolbar class="border-b border-white/5" />

        <main class="flex-1 min-h-0 overflow-hidden px-4 py-4 md:px-8 xl:px-12">
          <RouterView v-slot="{ Component }">
            <div class="page-shell scroll-region h-full min-h-0">
              <Transition name="fade-slide" mode="out-in">
                <component :is="Component" />
              </Transition>
            </div>
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
            class="block rounded-xl px-4 py-3 text-lg transition"
            :class="[route.path === item.path ? mobileMenuTone.active : mobileMenuTone.inactive]"
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

const sidebarLinkTone = computed(
  () =>
    themeStore.theme === 'dark'
      ? {
          active: 'bg-white/10 text-white ring-1 ring-white/30 shadow-[0_18px_45px_rgba(15,23,42,0.65)]',
          inactive: 'text-slate-200 hover:bg-white/5 hover:text-white',
        }
      : {
          active: 'bg-white text-slate-900 ring-1 ring-slate-900/10 shadow-[0_18px_45px_rgba(15,23,42,0.18)]',
          inactive: 'text-slate-700 hover:bg-slate-900/5',
        },
);

const mobileMenuTone = computed(
  () =>
    themeStore.theme === 'dark'
      ? {
          active: 'bg-white/10 text-white',
          inactive: 'text-muted hover:bg-white/5 hover:text-white',
        }
      : {
          active: 'bg-slate-900/5 text-slate-900',
          inactive: 'text-muted hover:bg-slate-900/5',
        },
);
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



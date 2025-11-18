<template>
  <div class="mx-auto max-w-xl space-y-6">
    <header class="space-y-2 text-center">
      <p class="text-sm uppercase tracking-[0.4em] text-muted">Access</p>
      <h2 class="text-3xl font-semibold">登录工作区</h2>
      <p class="text-muted">使用注册邮箱 + 密码即可登录，自动带入 JWT</p>
    </header>

    <form class="glass-panel space-y-4 p-6" @submit.prevent="handleSubmit">
      <label class="block space-y-1 text-sm">
        <span class="text-slate-300">邮箱</span>
        <input
          v-model="email"
          type="email"
          required
          class="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 outline-none focus:border-cyan-400"
          placeholder="you@example.com"
        />
      </label>
      <label class="block space-y-1 text-sm">
        <span class="text-slate-300">密码</span>
        <input
          v-model="password"
          type="password"
          minlength="6"
          required
          class="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 outline-none focus:border-cyan-400"
          placeholder="******"
        />
      </label>
      <button
        type="submit"
        class="w-full rounded-lg bg-gradient-to-r from-cyan-400 to-violet-500 py-3 text-base font-semibold text-slate-900 transition hover:opacity-90 disabled:opacity-50"
        :disabled="auth.loading"
      >
        {{ auth.loading ? '登录中...' : '立即登录' }}
      </button>
      <button
        type="button"
        class="w-full rounded-lg border border-white/15 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
        @click="useDemoAccount"
      >
        使用测试管理员（{{ demoAccount.email }}）
      </button>
      <p v-if="errorMessage" class="text-center text-sm text-rose-300">
        {{ errorMessage }}
      </p>
      <RouterLink class="block text-center text-sm text-cyan-300 hover:text-cyan-200" to="/register">
        还没有账号？前往注册 →
      </RouterLink>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter, RouterLink, useRoute } from 'vue-router';
import type { AxiosError } from 'axios';
import { useAuthStore } from '@/stores/auth';
import { DEMO_ACCOUNT as demoAccount } from '@/constants/demoAccount';

const auth = useAuthStore();
const router = useRouter();
const route = useRoute();

const email = ref(demoAccount.email);
const password = ref(demoAccount.password);
const errorMessage = ref('');

const handleSubmit = async () => {
  errorMessage.value = '';
  try {
    await auth.login(email.value, password.value);
    const target = (route.query.redirect as string) ?? '/dashboard';
    router.push(target);
  } catch (error) {
    const err = error as AxiosError<{ message?: string }>;
    errorMessage.value = err.response?.data?.message ?? '登录失败，请稍后再试';
  }
};

const useDemoAccount = () => {
  email.value = demoAccount.email;
  password.value = demoAccount.password;
};
</script>



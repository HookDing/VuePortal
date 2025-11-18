<template>
  <div class="mx-auto max-w-2xl space-y-6">
    <header class="space-y-1 text-center">
      <p class="text-sm uppercase tracking-[0.4em] text-muted">Create</p>
      <h2 class="text-3xl font-semibold">注册新账户</h2>
      <p class="text-muted">注册成功后自动完成登录，随后即可访问主工作区</p>
    </header>

    <form class="glass-panel grid gap-4 p-6 md:grid-cols-2" @submit.prevent="handleSubmit">
      <label class="space-y-1 text-sm md:col-span-2">
        <span class="text-slate-300">姓名</span>
        <input
          v-model="name"
          type="text"
          required
          class="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 outline-none focus:border-cyan-400"
          placeholder="陈可欣"
        />
      </label>
      <label class="space-y-1 text-sm md:col-span-2">
        <span class="text-slate-300">邮箱</span>
        <input
          v-model="email"
          type="email"
          required
          class="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 outline-none focus:border-cyan-400"
          placeholder="you@example.com"
        />
      </label>
      <label class="space-y-1 text-sm">
        <span class="text-slate-300">密码</span>
        <input
          v-model="password"
          type="password"
          minlength="6"
          required
          class="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 outline-none focus:border-cyan-400"
        />
      </label>
      <label class="space-y-1 text-sm">
        <span class="text-slate-300">确认密码</span>
        <input
          v-model="confirm"
          type="password"
          minlength="6"
          required
          class="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 outline-none focus:border-cyan-400"
        />
      </label>
      <p v-if="passwordMismatch" class="md:col-span-2 rounded-lg border border-rose-500/40 bg-rose-500/10 px-4 py-2 text-sm text-rose-200">
        两次输入密码不一致
      </p>
      <button
        type="submit"
        class="md:col-span-2 rounded-lg bg-gradient-to-r from-emerald-400 to-cyan-400 py-3 text-base font-semibold text-slate-900 transition hover:opacity-90 disabled:opacity-50"
        :disabled="auth.loading || passwordMismatch"
      >
        {{ auth.loading ? '创建中...' : '创建账户' }}
      </button>
      <p v-if="errorMessage" class="md:col-span-2 text-center text-sm text-rose-300">
        {{ errorMessage }}
      </p>
      <p v-if="successMessage" class="md:col-span-2 text-center text-sm text-emerald-300">
        {{ successMessage }}
      </p>
      <p class="md:col-span-2 text-center text-xs text-muted">
        默认测试账号：{{ demoAccount.email }} / {{ demoAccount.password }}，注册时若已存在将自动为您登录
      </p>
      <RouterLink class="md:col-span-2 text-center text-sm text-cyan-300 hover:text-cyan-200" to="/login">
        已有账号？返回登录 →
      </RouterLink>
    </form>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import type { AxiosError } from 'axios';
import { useAuthStore } from '@/stores/auth';
import { DEMO_ACCOUNT as demoAccount } from '@/constants/demoAccount';

const auth = useAuthStore();
const router = useRouter();

const name = ref(demoAccount.name);
const email = ref(demoAccount.email);
const password = ref(demoAccount.password);
const confirm = ref(demoAccount.password);
const errorMessage = ref('');
const successMessage = ref('');

const passwordMismatch = computed(() => password.value !== confirm.value);

const handleSubmit = async () => {
  if (passwordMismatch.value) return;
  errorMessage.value = '';
  successMessage.value = '';
  try {
    await auth.register(email.value, password.value, name.value);
    successMessage.value = '注册成功，正在为您登录...';
    router.push({ name: 'dashboard' });
  } catch (error) {
    const err = error as AxiosError<{ message?: string }>;
    errorMessage.value = err.response?.data?.message ?? '注册失败，请稍后再试';
  }
};
</script>



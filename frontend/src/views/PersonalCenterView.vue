<template>
  <div class="space-y-6">
    <header class="flex flex-wrap items-end justify-between gap-4">
      <div>
        <p class="text-xs uppercase tracking-[0.4em] text-muted">Profile</p>
        <h2 class="text-3xl font-semibold">个人中心</h2>
        <p class="text-sm text-muted">管理个人资料与账号安全信息</p>
      </div>
      <div class="rounded-2xl border border-white/10 px-4 py-2 text-xs text-muted">
        加入时间：{{ joinedAt }}
      </div>
    </header>

    <section class="grid gap-6 lg:grid-cols-[minmax(0,2fr)_1fr]">
      <article class="glass-panel space-y-6 rounded-3xl border border-white/10 p-6">
        <div>
          <h3 class="text-xl font-semibold">基本信息</h3>
          <p class="text-sm text-muted">同步修改后立即生效</p>
        </div>
        <form class="space-y-4" @submit.prevent="handleProfileSave">
          <label class="block space-y-2 text-sm">
            <span class="text-slate-300">姓名</span>
            <input
              v-model="profileForm.name"
              type="text"
              required
              minlength="2"
              class="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2 outline-none transition focus:border-cyan-400"
            />
          </label>
          <label class="block space-y-2 text-sm">
            <span class="text-slate-300">邮箱</span>
            <input
              :value="auth.user?.email"
              type="email"
              disabled
              class="w-full cursor-not-allowed rounded-2xl border border-white/5 bg-white/5 px-4 py-2 text-muted"
            />
          </label>
          <div class="flex flex-wrap items-center gap-3">
            <button
              type="submit"
              class="rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 px-6 py-2 text-sm font-semibold text-slate-900 transition hover:opacity-90 disabled:opacity-50"
              :disabled="savingProfile"
            >
              {{ savingProfile ? '保存中...' : '保存资料' }}
            </button>
            <p class="text-sm text-emerald-300" v-if="profileMessage">{{ profileMessage }}</p>
          </div>
        </form>
      </article>

      <article class="glass-panel space-y-4 rounded-3xl border border-white/10 p-6">
        <div>
          <h3 class="text-xl font-semibold">安全信息</h3>
          <p class="text-sm text-muted">定期更新密码，保障账户安全</p>
        </div>
        <form class="space-y-3 text-sm" @submit.prevent="handlePasswordSave">
          <input
            v-model="passwordForm.current"
            type="password"
            required
            placeholder="当前密码"
            class="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2 outline-none focus:border-cyan-400"
          />
          <input
            v-model="passwordForm.next"
            type="password"
            required
            minlength="6"
            placeholder="新密码（≥6 位）"
            class="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2 outline-none focus:border-cyan-400"
          />
          <input
            v-model="passwordForm.confirm"
            type="password"
            required
            minlength="6"
            placeholder="确认新密码"
            class="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2 outline-none focus:border-cyan-400"
          />
          <button
            type="submit"
            class="w-full rounded-2xl border border-cyan-400/40 px-4 py-2 text-sm font-semibold text-cyan-200 transition hover:border-cyan-300 disabled:opacity-40"
            :disabled="savingPassword"
          >
            {{ savingPassword ? '提交中...' : '更新密码' }}
          </button>
          <p
            v-if="passwordMessage"
            :class="['text-center text-sm', passwordStatus === 'success' ? 'text-emerald-300' : 'text-rose-300']"
          >
            {{ passwordMessage }}
          </p>
        </form>
      </article>
    </section>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, watch, computed } from 'vue';
import { useAuthStore } from '@/stores/auth';

const auth = useAuthStore();

const profileForm = reactive({
  name: auth.user?.name ?? '',
});

watch(
  () => auth.user?.name,
  (val) => {
    profileForm.name = val ?? '';
  },
);

const savingProfile = ref(false);
const profileMessage = ref('');

const handleProfileSave = async () => {
  if (!profileForm.name.trim()) return;
  savingProfile.value = true;
  profileMessage.value = '';
  try {
    await auth.updateProfile({ name: profileForm.name.trim() });
    profileMessage.value = '资料已更新';
  } catch (error) {
    profileMessage.value = '保存失败，请稍后重试';
  } finally {
    savingProfile.value = false;
  }
};

const passwordForm = reactive({
  current: '',
  next: '',
  confirm: '',
});
const savingPassword = ref(false);
const passwordMessage = ref('');
const passwordStatus = ref<'success' | 'error'>('success');

const handlePasswordSave = async () => {
  passwordMessage.value = '';
  if (passwordForm.next !== passwordForm.confirm) {
    passwordStatus.value = 'error';
    passwordMessage.value = '两次输入密码不一致';
    return;
  }
  savingPassword.value = true;
  try {
    await auth.updatePassword(passwordForm.current, passwordForm.next);
    passwordStatus.value = 'success';
    passwordMessage.value = '密码已更新';
    passwordForm.current = '';
    passwordForm.next = '';
    passwordForm.confirm = '';
  } catch (error) {
    passwordStatus.value = 'error';
    passwordMessage.value = '更新失败，请检查当前密码';
  } finally {
    savingPassword.value = false;
  }
};

const joinedAt = computed(() => {
  if (!auth.user?.createdAt) return '--';
  return new Date(auth.user.createdAt).toLocaleString();
});
</script>


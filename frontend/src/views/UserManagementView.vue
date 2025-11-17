<template>
  <div class="space-y-6">
    <header class="flex flex-wrap items-center justify-between gap-4">
      <div>
        <p class="text-xs uppercase tracking-[0.4em] text-slate-400">Admin</p>
        <h2 class="text-3xl font-semibold">用户管理</h2>
        <p class="text-sm text-slate-400">查看所有注册用户，并可直接重置密码</p>
      </div>
      <div class="flex flex-wrap items-center gap-2">
        <button
          class="rounded-full border border-white/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-200 transition hover:bg-white/10"
          :disabled="loading"
          @click="loadUsers"
        >
          {{ loading ? '刷新中...' : '刷新列表' }}
        </button>
        <input
          v-model="keyword"
          type="search"
          placeholder="搜索姓名/邮箱"
          class="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs outline-none focus:border-cyan-400"
        />
      </div>
    </header>

    <section class="glass-panel rounded-3xl border border-white/10">
      <div class="flex flex-wrap items-center justify-between gap-3 border-b border-white/5 px-6 py-4 text-sm text-slate-400">
        <span>共 {{ users.length }} 位用户</span>
        <span>管理员可直接为任意账户设置新密码</span>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full min-w-[640px] text-sm">
          <thead>
            <tr class="text-left text-xs uppercase tracking-[0.3em] text-slate-400">
              <th class="px-6 py-3">姓名</th>
              <th class="px-6 py-3">邮箱</th>
              <th class="px-6 py-3">角色</th>
              <th class="px-6 py-3">创建时间</th>
              <th class="px-6 py-3">重置密码</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in filteredUsers" :key="user.id" class="border-t border-white/5 text-slate-200">
              <td class="px-6 py-4">
                <div class="font-semibold">{{ user.name }}</div>
                <div class="text-xs text-slate-500">{{ user.id.slice(0, 8) }}</div>
              </td>
              <td class="px-6 py-4">{{ user.email }}</td>
              <td class="px-6 py-4">
                <span
                  class="rounded-full px-3 py-1 text-xs font-semibold"
                  :class="user.role === 'admin' ? 'bg-amber-500/20 text-amber-200' : 'bg-white/10 text-slate-200'"
                >
                  {{ user.role === 'admin' ? '管理员' : '成员' }}
                </span>
              </td>
              <td class="px-6 py-4 text-slate-400">
                {{ formatDate(user.createdAt) }}
              </td>
              <td class="px-6 py-4 space-y-2">
                <div class="flex flex-col gap-2 md:flex-row">
                  <input
                    v-model="passwordDrafts[user.id]"
                    type="password"
                    placeholder="新密码"
                    minlength="6"
                    class="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:border-cyan-400"
                  />
                  <button
                    class="rounded-xl bg-gradient-to-r from-cyan-400 to-violet-500 px-3 py-2 text-xs font-semibold text-slate-900 transition hover:opacity-90 disabled:opacity-50"
                    :disabled="savingId === user.id"
                    @click="handleReset(user.id)"
                  >
                    {{ savingId === user.id ? '提交中' : '重置' }}
                  </button>
                </div>
                <div class="flex flex-wrap items-center gap-2">
                  <button
                    class="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300 transition hover:border-white/40"
                    @click="openEditor(user)"
                  >
                    编辑资料
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p v-if="tableMessage" class="border-t border-white/5 px-6 py-3 text-sm" :class="tableStatus === 'success' ? 'text-emerald-300' : 'text-rose-300'">
        {{ tableMessage }}
      </p>
    </section>

    <Transition name="fade">
      <div v-if="editingUser" class="fixed inset-0 z-30 flex items-center justify-center bg-black/60 px-4" @click.self="closeEditor">
        <div class="glass-panel w-full max-w-lg space-y-4 rounded-3xl border border-white/10 p-6">
          <header class="flex items-center justify-between">
            <div>
              <p class="text-xs uppercase tracking-[0.4em] text-slate-400">Edit</p>
              <h3 class="text-2xl font-semibold text-white">{{ editingUser?.name }}</h3>
              <p class="text-sm text-slate-400">{{ editingUser?.email }}</p>
            </div>
            <button class="text-slate-400" @click="closeEditor">×</button>
          </header>
          <form class="space-y-4" @submit.prevent="handleAdminUpdate">
            <label class="block text-sm">
              <span class="text-slate-300">姓名</span>
              <input
                v-model="editForm.name"
                type="text"
                class="mt-1 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2 outline-none focus:border-cyan-400"
              />
            </label>
            <label class="block text-sm">
              <span class="text-slate-300">角色</span>
              <select
                v-model="editForm.role"
                class="mt-1 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2 outline-none focus:border-cyan-400"
              >
                <option value="admin">管理员</option>
                <option value="member">成员</option>
              </select>
            </label>
            <div class="flex justify-end gap-3">
              <button type="button" class="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-300" @click="closeEditor">
                取消
              </button>
              <button
                type="submit"
                class="rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 px-6 py-2 text-sm font-semibold text-slate-900 transition hover:opacity-90 disabled:opacity-50"
                :disabled="editing"
              >
                {{ editing ? '保存中...' : '保存' }}
              </button>
            </div>
            <p v-if="editorMessage" class="text-sm text-emerald-300">{{ editorMessage }}</p>
          </form>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import { fetchUsers, resetUserPassword, updateUserProfileAsAdmin, type UserSummary } from '@/services/user';

const users = ref<UserSummary[]>([]);
const loading = ref(false);
const savingId = ref<string | null>(null);
const passwordDrafts = reactive<Record<string, string>>({});
const tableMessage = ref('');
const tableStatus = ref<'success' | 'error'>('success');
const keyword = ref('');

const editingUser = ref<UserSummary | null>(null);
const editForm = reactive<{ name: string; role: 'admin' | 'member' }>({ name: '', role: 'member' });
const editing = ref(false);
const editorMessage = ref('');

const filteredUsers = computed(() => {
  if (!keyword.value.trim()) return users.value;
  return users.value.filter((user) => {
    const value = keyword.value.toLowerCase();
    return user.name.toLowerCase().includes(value) || user.email.toLowerCase().includes(value);
  });
});

const loadUsers = async () => {
  loading.value = true;
  try {
    users.value = await fetchUsers();
    tableMessage.value = '';
  } catch (error) {
    tableStatus.value = 'error';
    tableMessage.value = '加载失败，请稍后重试';
  } finally {
    loading.value = false;
  }
};

const handleReset = async (id: string) => {
  tableMessage.value = '';
  const value = passwordDrafts[id];
  if (!value || value.length < 6) {
    tableStatus.value = 'error';
    tableMessage.value = '密码长度至少 6 位';
    return;
  }
  savingId.value = id;
  try {
    await resetUserPassword(id, value);
    passwordDrafts[id] = '';
    tableStatus.value = 'success';
    tableMessage.value = '密码已重置';
  } catch (error) {
    tableStatus.value = 'error';
    tableMessage.value = '重置失败，请稍后再试';
  } finally {
    savingId.value = null;
  }
};

const openEditor = (user: UserSummary) => {
  editingUser.value = user;
  editForm.name = user.name;
  editForm.role = user.role;
  editorMessage.value = '';
};

const closeEditor = () => {
  editingUser.value = null;
  editorMessage.value = '';
};

const handleAdminUpdate = async () => {
  if (!editingUser.value) return;
  editing.value = true;
  try {
    const data = await updateUserProfileAsAdmin(editingUser.value.id, { name: editForm.name, role: editForm.role });
    users.value = users.value.map((user) => (user.id === data.id ? data : user));
    editorMessage.value = '资料已更新';
  } catch (error) {
    editorMessage.value = '更新失败，请稍后再试';
  } finally {
    editing.value = false;
  }
};

const formatDate = (input: string) => {
  return new Date(input).toLocaleString();
};

onMounted(loadUsers);
</script>


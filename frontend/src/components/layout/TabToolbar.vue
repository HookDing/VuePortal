<template>
  <div class="tab-toolbar flex items-center gap-2 overflow-x-auto px-4 py-2 md:px-6">
    <template v-if="tabs.length">
      <div
        v-for="tab in tabs"
        :key="tab.path"
        class="group flex shrink-0 items-center rounded-2xl border px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] transition"
        :class="[
          tab.path === tabStore.activePath ? 'bg-white/10 text-white border-white/40' : 'border-white/15 text-slate-300 hover:border-white/40',
          tab.pinned ? 'pr-2' : 'pr-3',
        ]"
        draggable="true"
        @dragstart="handleDragStart($event, tab)"
        @dragover.prevent="handleDragOver($event, tab)"
        @drop.prevent="handleDrop($event, tab)"
        @dragend="handleDragEnd"
        @contextmenu.prevent="openContextMenu($event, tab)"
      >
        <RouterLink
          :to="tab.path"
          class="flex items-center gap-2"
          @click="tabStore.setActive(tab.path)"
        >
          <span class="truncate">{{ tab.title }}</span>
          <span v-if="tab.pinned" class="text-xs">📌</span>
        </RouterLink>
        <button
          class="ml-2 text-base opacity-0 transition group-hover:opacity-80"
          title="关闭标签"
          @click.prevent="tabStore.closeTab(tab.path)"
        >
          ×
        </button>
      </div>
    </template>
    <p v-else class="text-xs uppercase tracking-[0.4em] text-slate-500">尚未打开子页面</p>
    <slot name="extra" />
    <Teleport to="body">
      <div
        v-if="contextMenu.visible && contextMenu.tab"
        class="fixed z-50 min-w-[180px] rounded-xl border border-white/10 bg-slate-900/95 p-2 text-xs text-slate-100 shadow-2xl"
        :style="{ top: `${contextMenu.y}px`, left: `${contextMenu.x}px` }"
        @click.stop
      >
        <button class="menu-item" @click="togglePinned(contextMenu.tab)">
          {{ contextMenu.tab.pinned ? '取消固定' : '固定标签' }}
        </button>
        <button class="menu-item" @click="toggleDefault(contextMenu.tab)">
          {{ contextMenu.tab.defaultOpen ? '取消默认打开' : '设为默认打开' }}
        </button>
        <hr class="my-1 border-white/10" />
        <button class="menu-item" @click="handleCloseRight(contextMenu.tab.path)">关闭右侧</button>
        <button class="menu-item" @click="handleCloseOthers(contextMenu.tab.path)">关闭其他</button>
        <button class="menu-item text-rose-300" @click="handleCloseAll">关闭所有</button>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { storeToRefs } from 'pinia';
import { onMounted, onBeforeUnmount, reactive, ref } from 'vue';
import { useTabStore, type TabItem } from '@/stores/tabs';

const tabStore = useTabStore();
const { tabs } = storeToRefs(tabStore);

const draggingPath = ref<string | null>(null);
const contextMenu = reactive<{ visible: boolean; x: number; y: number; tab: TabItem | null }>({
  visible: false,
  x: 0,
  y: 0,
  tab: null,
});

const handleDragStart = (event: DragEvent, tab: TabItem) => {
  draggingPath.value = tab.path;
  event.dataTransfer?.setData('text/plain', tab.path);
  event.dataTransfer?.setDragImage(new Image(), 0, 0);
};

const handleDragOver = (event: DragEvent, tab: TabItem) => {
  if (!draggingPath.value || draggingPath.value === tab.path) return;
  event.dataTransfer!.dropEffect = 'move';
};

const handleDrop = (event: DragEvent, tab: TabItem) => {
  const dragPath = draggingPath.value ?? event.dataTransfer?.getData('text/plain');
  if (!dragPath) return;
  const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
  const position = event.clientX - rect.left < rect.width / 2 ? 'before' : 'after';
  tabStore.moveTab(dragPath, tab.path, position);
  draggingPath.value = null;
};

const handleDragEnd = () => {
  draggingPath.value = null;
};

const closeContextMenu = () => {
  contextMenu.visible = false;
  contextMenu.tab = null;
};

const openContextMenu = (event: MouseEvent, tab: TabItem) => {
  contextMenu.visible = true;
  contextMenu.x = event.clientX;
  contextMenu.y = event.clientY;
  contextMenu.tab = tab;
};

const togglePinned = (tab: TabItem) => {
  tabStore.togglePinned(tab.path);
  closeContextMenu();
};

const toggleDefault = (tab: TabItem) => {
  tabStore.toggleDefaultOpen(tab.path);
  closeContextMenu();
};

const handleCloseRight = (path: string) => {
  tabStore.closeRight(path);
  closeContextMenu();
};

const handleCloseOthers = (path: string) => {
  tabStore.closeOthers(path);
  closeContextMenu();
};

const handleCloseAll = () => {
  tabStore.closeAll();
  closeContextMenu();
};

const handleGlobalClick = () => {
  if (contextMenu.visible) {
    closeContextMenu();
  }
};

onMounted(() => {
  document.addEventListener('click', handleGlobalClick);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleGlobalClick);
});
</script>

<style scoped>
.menu-item {
  width: 100%;
  text-align: left;
  padding: 0.4rem 0.6rem;
  border-radius: 0.5rem;
  transition: background 0.15s ease;
}
.menu-item:hover {
  background: rgba(255, 255, 255, 0.08);
}
</style>

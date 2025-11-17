import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import type { RouteLocationNormalizedLoaded } from 'vue-router';

export type TabItem = {
  title: string;
  path: string;
  pinned?: boolean;
  defaultOpen?: boolean;
};

const STORAGE_KEY = 'vue-portal-tabs';

const loadTabs = (): TabItem[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as TabItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const persistTabs = (tabs: TabItem[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tabs));
};

export const useTabStore = defineStore('tabs', () => {
  const tabs = ref<TabItem[]>(loadTabs());
  const activePath = ref<string>(tabs.value[0]?.path ?? '');

  const normalizeOrder = () => {
    const pinned: TabItem[] = [];
    const others: TabItem[] = [];
    tabs.value.forEach((tab) => (tab.pinned ? pinned.push(tab) : others.push(tab)));
    tabs.value = [...pinned, ...others];
  };
  normalizeOrder();

  const setActive = (path: string) => {
    activePath.value = path;
  };

  const ensureExists = (route: RouteLocationNormalizedLoaded) => {
    if (!route.meta.title) return null;
    const existing = tabs.value.find((tab) => tab.path === route.fullPath);
    if (existing) {
      existing.title = route.meta.title as string;
      return existing;
    }
    const tab: TabItem = {
      title: route.meta.title as string,
      path: route.fullPath,
    };
    tabs.value.push(tab);
    normalizeOrder();
    return tab;
  };

  const addTab = (route: RouteLocationNormalizedLoaded) => {
    const tab = ensureExists(route);
    if (!tab) return;
    activePath.value = tab.path;
  };

  const shouldKeep = (tab: TabItem, preservePath?: string) => tab.path === preservePath || tab.pinned || tab.defaultOpen;

  const closeTab = (path: string) => {
    const index = tabs.value.findIndex((tab) => tab.path === path);
    if (index !== -1) {
      if (tabs.value[index].pinned) return;
      tabs.value.splice(index, 1);
      if (activePath.value === path) {
        activePath.value = tabs.value[Math.min(index, tabs.value.length - 1)]?.path ?? '';
      }
    }
  };

  const closeRight = (path: string) => {
    const index = tabs.value.findIndex((tab) => tab.path === path);
    if (index === -1) return;
    tabs.value = tabs.value.filter((tab, idx) => idx <= index || shouldKeep(tab, path));
    if (!tabs.value.some((tab) => tab.path === activePath.value)) {
      activePath.value = tabs.value[tabs.value.length - 1]?.path ?? '';
    }
  };

  const closeOthers = (path: string) => {
    tabs.value = tabs.value.filter((tab) => shouldKeep(tab, path));
    if (!tabs.value.some((tab) => tab.path === path)) {
      activePath.value = tabs.value[0]?.path ?? '';
    } else {
      activePath.value = path;
    }
  };

  const closeAll = () => {
    tabs.value = tabs.value.filter((tab) => tab.pinned || tab.defaultOpen);
    activePath.value = tabs.value[0]?.path ?? '';
  };

  const reset = () => {
    tabs.value = tabs.value.filter((tab) => tab.defaultOpen);
    activePath.value = tabs.value[0]?.path ?? '';
  };

  const moveTab = (dragPath: string, targetPath: string, position: 'before' | 'after' = 'before') => {
    if (dragPath === targetPath) return;
    const list = [...tabs.value];
    const fromIndex = list.findIndex((tab) => tab.path === dragPath);
    let targetIndex = list.findIndex((tab) => tab.path === targetPath);
    if (fromIndex === -1 || targetIndex === -1) return;
    const [dragged] = list.splice(fromIndex, 1);
    targetIndex = list.findIndex((tab) => tab.path === targetPath);
    if (targetIndex === -1) return;
    if (position === 'after') targetIndex += 1;
    list.splice(targetIndex, 0, dragged);
    tabs.value = list;
    normalizeOrder();
  };

  const togglePinned = (path: string) => {
    const tab = tabs.value.find((item) => item.path === path);
    if (!tab) return;
    tab.pinned = !tab.pinned;
    normalizeOrder();
  };

  const toggleDefaultOpen = (path: string) => {
    const tab = tabs.value.find((item) => item.path === path);
    if (!tab) return;
    tab.defaultOpen = !tab.defaultOpen;
  };

  watch(
    tabs,
    (newVal) => {
      persistTabs(newVal);
    },
    { deep: true },
  );

  return {
    tabs,
    activePath,
    addTab,
    closeTab,
    closeRight,
    closeOthers,
    closeAll,
    togglePinned,
    toggleDefaultOpen,
    moveTab,
    setActive,
    reset,
  };
});


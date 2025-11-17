import { defineStore } from 'pinia';
import { ref, watch } from 'vue';

type ThemeMode = 'dark' | 'light';

const STORAGE_KEY = 'vue-portal-theme';

const getSystemTheme = (): ThemeMode => {
  if (typeof window === 'undefined') return 'dark';
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export const useThemeStore = defineStore('theme', () => {
  const theme = ref<ThemeMode>((localStorage.getItem(STORAGE_KEY) as ThemeMode) || getSystemTheme());

  const applyTheme = (value: ThemeMode) => {
    document.documentElement.dataset.theme = value;
    document.documentElement.style.colorScheme = value;
  };

  const setTheme = (value: ThemeMode) => {
    theme.value = value;
    localStorage.setItem(STORAGE_KEY, value);
  };

  const toggleTheme = () => {
    setTheme(theme.value === 'dark' ? 'light' : 'dark');
  };

  const bootstrap = () => {
    applyTheme(theme.value);
  };

  watch(
    theme,
    (value) => {
      applyTheme(value);
      localStorage.setItem(STORAGE_KEY, value);
    },
    { immediate: true },
  );

  return {
    theme,
    setTheme,
    toggleTheme,
    bootstrap,
  };
});


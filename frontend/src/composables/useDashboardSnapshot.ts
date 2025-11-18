import { computed, onMounted, ref } from 'vue';
import { fetchDashboardSnapshot } from '@/services/dashboard';
import type { DashboardSnapshot } from '@/types/portal';

export const useDashboardSnapshot = () => {
  const snapshot = ref<DashboardSnapshot | null>(null);
  const loading = ref(false);

  const load = async () => {
    loading.value = true;
    snapshot.value = await fetchDashboardSnapshot();
    loading.value = false;
  };

  onMounted(load);

  return {
    loading: computed(() => loading.value),
    highlightStats: computed(() => snapshot.value?.highlightStats ?? []),
    devices: computed(() => snapshot.value?.devices ?? []),
    workMetrics: computed(() => snapshot.value?.workMetrics ?? []),
    tasks: computed(() => snapshot.value?.tasks ?? []),
    activity: computed(() => snapshot.value?.activity ?? []),
    channels: computed(() => snapshot.value?.channels ?? []),
    refresh: load,
  };
};

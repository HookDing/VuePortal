import { computed, onMounted, ref } from 'vue';
import { fetchDeviceLabDataset } from '@/services/mobileLab';
import type { DeviceLabDataset } from '@/types/portal';

export const useDeviceLab = () => {
  const dataset = ref<DeviceLabDataset | null>(null);
  const loading = ref(false);

  const load = async () => {
    loading.value = true;
    dataset.value = await fetchDeviceLabDataset();
    loading.value = false;
  };

  onMounted(load);

  return {
    loading: computed(() => loading.value),
    devices: computed(() => dataset.value?.devices ?? []),
    insights: computed(() => dataset.value?.insights ?? []),
    quickActions: computed(() => dataset.value?.quickActions ?? []),
    refresh: load,
  };
};

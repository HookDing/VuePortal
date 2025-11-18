import type { DeviceLabDataset } from '@/types/portal';

export const fetchDeviceLabDataset = async (): Promise<DeviceLabDataset> => {
  return Promise.resolve({
    devices: [
      {
        id: 'phone',
        label: 'Phone 375px',
        width: 375,
        height: 812,
        breakpoint: 'sm',
        todos: ['审批流程', '消息推送', '离线缓存'],
        latency: [14, 28, 22, 35, 19],
        usage: '74%',
        signal: 'excellent',
        network: '5G NSA',
        range: '375-767px',
      },
      {
        id: 'pad',
        label: 'Pad 768px',
        width: 768,
        height: 1024,
        breakpoint: 'lg',
        todos: ['侧边栏优化', '栅格布局', '键盘交互'],
        latency: [10, 16, 12, 20, 14],
        usage: '52%',
        signal: 'good',
        network: 'Wi-Fi 6',
        range: '768-1024px',
      },
      {
        id: 'pda',
        label: 'PDA 360px',
        width: 360,
        height: 640,
        breakpoint: 'pda',
        todos: ['极简模式', '单手操作', '语音入口'],
        latency: [28, 30, 24, 40, 32],
        usage: '31%',
        signal: 'fair',
        network: '4G VoLTE',
        range: '320-374px',
      },
    ],
    insights: [
      { title: '推送消息在 Phone 端延迟 19ms', detail: '满足体验要求，继续观察晚高峰波动', impact: '稳定' },
      { title: 'Pad 分屏任务切换成功率 99%', detail: '键盘插拔触发的布局刷新已收敛', impact: '通过' },
      { title: 'PDA 极简流程待补充文案', detail: '语音入口文案缺失导致流失 4%', impact: '跟进' },
    ],
    quickActions: [
      { icon: '⇄', label: '断点同步', desc: '将当前选项同步到其它设备' },
      { icon: '☼', label: '主题连动', desc: '快速切换明暗主题观察视觉噪点' },
      { icon: '☁', label: '网络切换', desc: '模拟弱网、离线与重连流程' },
    ],
  });
};

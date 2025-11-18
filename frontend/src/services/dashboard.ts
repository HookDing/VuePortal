import type { DashboardSnapshot } from '@/types/portal';

export const fetchDashboardSnapshot = async (): Promise<DashboardSnapshot> => {
  return Promise.resolve({
    highlightStats: [
      {
        title: 'TOTAL SESSION',
        value: '128',
        delta: '+6% 周环比',
        trend: 'up',
        description: '含 PC/PAD 多端会话',
      },
      {
        title: 'MOBILE SHARE',
        value: '65%',
        delta: '+3% 提升',
        trend: 'up',
        description: 'Phone & PDA 占比',
      },
      {
        title: 'ERROR RATE',
        value: '0.4%',
        delta: '-0.2%',
        trend: 'down',
        description: '核心流程失败率',
      },
      {
        title: 'AVG RESPONSE',
        value: '58 ms',
        delta: '-5ms',
        trend: 'down',
        description: 'API RTT 95 线',
      },
    ],
    devices: [
      { name: 'PC', desc: '桌面端 1280px+', range: '>=1280px', breakpoint: 'xl', px: '1280', tags: ['键盘增强', '多列布局'], coverage: '92%' },
      { name: 'PAD', desc: '平板端 768-1024px', range: '768-1024px', breakpoint: 'md-lg', px: '768', tags: ['触控优化', '分屏适配'], coverage: '81%' },
      { name: 'Phone', desc: '移动手机 375-767px', range: '375-767px', breakpoint: 'sm', px: '640', tags: ['单手操作', '离线缓存'], coverage: '69%' },
      { name: 'PDA', desc: '超小尺寸 320-374px', range: '320-374px', breakpoint: 'pda', px: '480', tags: ['极简模式', '语音入口'], coverage: '47%' },
    ],
    workMetrics: [
      { label: '活跃会话', value: '8', accent: 'text-emerald-300', description: '并发调试终端' },
      { label: '在线终端', value: '24', accent: 'text-cyan-300', description: '含仿真设备' },
      { label: '跨端同步', value: '99.4%', accent: 'text-indigo-300', description: '断点续传成功率' },
      { label: '平均延迟', value: '62ms', accent: 'text-amber-200', description: '端到端链路' },
    ],
    tasks: [
      { title: '完善移动端模拟器', done: true },
      { title: '接入 JWT 鉴权', done: true },
      { title: '优化多端自适应', done: false },
      { title: '编写使用文档', done: false },
    ],
    activity: [
      { title: 'PDA 极速模式回归', time: '09:34', channel: 'PDA', status: 'synced' },
      { title: 'Phone 推送模板更新', time: '10:12', channel: 'Phone', status: 'pending' },
      { title: 'Pad 分屏手势实验', time: '11:08', channel: 'Pad', status: 'synced' },
      { title: 'PC 主题联动', time: '13:22', channel: 'PC', status: 'synced' },
    ],
    channels: [
      { channel: 'PC', uptime: '99.96%', latency: '52ms', trend: '+0.5%' },
      { channel: 'PAD', uptime: '99.88%', latency: '65ms', trend: '+0.2%' },
      { channel: 'PHONE', uptime: '99.74%', latency: '71ms', trend: '+0.1%' },
      { channel: 'PDA', uptime: '99.21%', latency: '83ms', trend: '-0.6%' },
    ],
  });
};

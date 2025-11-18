...EOF
cat <<'EOF' > frontend/src/types/portal.ts
export interface HighlightStat {
  title: string;
  value: string;
  delta?: string;
  trend?: 'up' | 'down';
  description?: string;
}

export interface DeviceProfile {
  name: string;
  desc: string;
  range: string;
  breakpoint: string;
  px: string;
  tags: string[];
  coverage: string;
}

export interface WorkMetric {
  label: string;
  value: string;
  accent?: string;
  description?: string;
}

export interface TaskItem {
  title: string;
  done: boolean;
}

export interface ActivityPulse {
  title: string;
  time: string;
  channel: string;
  status: 'synced' | 'pending';
}

export interface ChannelUptime {
  channel: string;
  uptime: string;
  latency: string;
  trend: string;
}

export interface DashboardSnapshot {
  highlightStats: HighlightStat[];
  devices: DeviceProfile[];
  workMetrics: WorkMetric[];
  tasks: TaskItem[];
  activity: ActivityPulse[];
  channels: ChannelUptime[];
}

export interface DevicePreset {
  id: string;
  label: string;
  width: number;
  height: number;
  breakpoint: string;
  todos: string[];
  latency: number[];
  usage: string;
  signal: 'excellent' | 'good' | 'fair';
  network: string;
  range: string;
}

export interface LabInsight {
  title: string;
  detail: string;
  impact: string;
}

export interface LabQuickAction {
  icon: string;
  label: string;
  desc: string;
}

export interface DeviceLabDataset {
  devices: DevicePreset[];
  insights: LabInsight[];
  quickActions: LabQuickAction[];
}

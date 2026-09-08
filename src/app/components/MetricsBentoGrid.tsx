import React from 'react';
import {
  Database,
  AlertTriangle,
  Clock,
  BookOpen,
  MessageSquare,
  TrendingDown,
} from 'lucide-react';

// Grid plan: 6 cards → grid-cols-4
// Row 1: hero (Total Sources, spans 2 cols) + Conflicts (1 col) + Stale (1 col)
// Row 2: Last Sync (1 col) + Courses Mapped (1 col) + Q&A Pairs (2 cols)

const metrics = [
  {
    id: 'metric-total-sources',
    label: 'Total Knowledge Sources',
    value: '247',
    sub: '+12 added this week',
    trend: 'up',
    icon: <Database size={22} />,
    hero: true,
    colSpan: 'col-span-2',
    bg: 'bg-primary/5 border-primary/20',
    iconBg: 'bg-primary/10 text-primary',
    subColor: 'text-success',
  },
  {
    id: 'metric-conflicts',
    label: 'Active Conflicts',
    value: '4',
    sub: '2 critical, 2 warnings',
    trend: 'alert',
    icon: <AlertTriangle size={22} />,
    hero: false,
    colSpan: 'col-span-1',
    bg: 'bg-danger-muted border-danger/20',
    iconBg: 'bg-danger/10 text-danger',
    subColor: 'text-danger',
  },
  {
    id: 'metric-stale',
    label: 'Stale Sources',
    value: '18',
    sub: 'Not synced in 30+ days',
    trend: 'warn',
    icon: <TrendingDown size={22} />,
    hero: false,
    colSpan: 'col-span-1',
    bg: 'bg-warning-muted border-warning/20',
    iconBg: 'bg-warning/10 text-warning',
    subColor: 'text-warning',
  },
  {
    id: 'metric-last-sync',
    label: 'Last Sync',
    value: '42m',
    sub: 'ago — 07 Sep, 09:36 AM',
    trend: 'neutral',
    icon: <Clock size={22} />,
    hero: false,
    colSpan: 'col-span-1',
    bg: 'bg-card border-border',
    iconBg: 'bg-muted text-muted-foreground',
    subColor: 'text-muted-foreground',
  },
  {
    id: 'metric-courses',
    label: 'Courses Mapped',
    value: '9 / 11',
    sub: '2 courses unmapped',
    trend: 'warn',
    icon: <BookOpen size={22} />,
    hero: false,
    colSpan: 'col-span-1',
    bg: 'bg-card border-border',
    iconBg: 'bg-accent/10 text-accent',
    subColor: 'text-warning',
  },
  {
    id: 'metric-qa',
    label: 'Q&A Pairs Loaded',
    value: '1,384',
    sub: '+96 added this month',
    trend: 'up',
    icon: <MessageSquare size={22} />,
    hero: false,
    colSpan: 'col-span-2',
    bg: 'bg-card border-border',
    iconBg: 'bg-success/10 text-success',
    subColor: 'text-success',
  },
];

export default function MetricsBentoGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {metrics?.map((m) => (
        <div
          key={m?.id}
          className={`${m?.colSpan === 'col-span-2' ? 'lg:col-span-2' : 'lg:col-span-1'} bg-card border rounded-xl p-5 ${m?.bg} transition-shadow hover:shadow-md`}
        >
          <div className="flex items-start justify-between mb-3">
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center ${m?.iconBg}`}
            >
              {m?.icon}
            </div>
          </div>
          <p
            className={`${m?.hero ? 'text-hero-metric' : 'text-metric-md'} font-tabular text-foreground`}
          >
            {m?.value}
          </p>
          <p className="text-sm font-600 text-foreground mt-1">{m?.label}</p>
          <p className={`text-xs mt-1 ${m?.subColor}`}>{m?.sub}</p>
        </div>
      ))}
    </div>
  );
}
'use client';

import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const data = [
  { date: '25 Aug', synced: 14, conflicts: 1 },
  { date: '26 Aug', synced: 22, conflicts: 0 },
  { date: '27 Aug', synced: 8, conflicts: 2 },
  { date: '28 Aug', synced: 31, conflicts: 0 },
  { date: '29 Aug', synced: 19, conflicts: 1 },
  { date: '30 Aug', synced: 5, conflicts: 3 },
  { date: '31 Aug', synced: 27, conflicts: 0 },
  { date: '01 Sep', synced: 38, conflicts: 1 },
  { date: '02 Sep', synced: 16, conflicts: 0 },
  { date: '03 Sep', synced: 42, conflicts: 2 },
  { date: '04 Sep', synced: 11, conflicts: 0 },
  { date: '05 Sep', synced: 29, conflicts: 1 },
  { date: '06 Sep', synced: 35, conflicts: 4 },
  { date: '07 Sep', synced: 18, conflicts: 0 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-lg shadow-lg px-3 py-2.5 text-xs">
        <p className="font-700 text-foreground mb-1">{label}</p>
        <p className="text-primary">
          Synced: <span className="font-600">{payload[0]?.value}</span>
        </p>
        {payload[1]?.value > 0 && (
          <p className="text-danger">
            Conflicts: <span className="font-600">{payload[1]?.value}</span>
          </p>
        )}
      </div>
    );
  }
  return null;
};

export default function SyncHistoryChart() {
  return (
    <ResponsiveContainer width="100%" height={210}>
      <AreaChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="syncGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.2} />
            <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="conflictGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--danger)" stopOpacity={0.15} />
            <stop offset="95%" stopColor="var(--danger)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="synced"
          stroke="var(--primary)"
          strokeWidth={2}
          fill="url(#syncGradient)"
        />
        <Area
          type="monotone"
          dataKey="conflicts"
          stroke="var(--danger)"
          strokeWidth={2}
          fill="url(#conflictGradient)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
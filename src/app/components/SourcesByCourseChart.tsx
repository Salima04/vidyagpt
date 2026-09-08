'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const data = [
  { course: 'BHM', sources: 48 },
  { course: 'MBA-HM', sources: 34 },
  { course: 'B.Sc HHA', sources: 29 },
  { course: 'Diploma', sources: 22 },
  { course: 'PG Dipl.', sources: 17 },
  { course: 'Cert.', sources: 11 },
  { course: 'Unmapped', sources: 86 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-lg shadow-lg px-3 py-2 text-xs">
        <p className="font-700 text-foreground">{label}</p>
        <p className="text-primary">
          Sources: <span className="font-600">{payload[0]?.value}</span>
        </p>
      </div>
    );
  }
  return null;
};

export default function SourcesByCourseChart() {
  return (
    <ResponsiveContainer width="100%" height={210}>
      <BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
        <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
        <XAxis
          dataKey="course"
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
        <Bar
          dataKey="sources"
          fill="var(--primary)"
          radius={[4, 4, 0, 0]}
          opacity={0.85}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
'use client';

import React from 'react';
import dynamic from 'next/dynamic';

const SyncHistoryChart = dynamic(() => import('./SyncHistoryChart'), {
  ssr: false,
  loading: () => (
    <div className="animate-pulse bg-muted rounded-xl h-[260px] w-full" />
  ),
});

const SourcesByCourseChart = dynamic(() => import('./SourcesByCourseChart'), {
  ssr: false,
  loading: () => (
    <div className="animate-pulse bg-muted rounded-xl h-[260px] w-full" />
  ),
});

export default function DashboardCharts() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-6">
      <div className="lg:col-span-3 bg-card border border-border rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-700 text-foreground">
              Sync History
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Sources synced per day — last 14 days
            </p>
          </div>
          <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md">
            14-day view
          </span>
        </div>
        <SyncHistoryChart />
      </div>
      <div className="lg:col-span-2 bg-card border border-border rounded-xl p-5">
        <div className="mb-4">
          <h2 className="text-base font-700 text-foreground">
            Sources by Course
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Knowledge source distribution across programs
          </p>
        </div>
        <SourcesByCourseChart />
      </div>
    </div>
  );
}
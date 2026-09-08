import React from 'react';
import MetricsBentoGrid from './MetricsBentoGrid';
import ConflictAlertBanner from './ConflictAlertBanner';
import DashboardCharts from './DashboardCharts';
import ActivityFeed from './ActivityFeed';
import DashboardHeader from './DashboardHeader';

export default function DashboardPage() {
  return (
    <div className="px-6 lg:px-8 xl:px-10 py-6 max-w-screen-2xl mx-auto">
      <DashboardHeader />
      <ConflictAlertBanner />
      <MetricsBentoGrid />
      <DashboardCharts />
      <ActivityFeed />
    </div>
  );
}
import React from 'react';
import { RefreshCw } from 'lucide-react';

export default function DashboardHeader() {
  return (
    <div className="flex items-center justify-between mb-5">
      <div>
        <h1 className="text-2xl font-700 text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          IIHM Kolkata Campus — Knowledge base health overview
        </p>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-xs text-muted-foreground">
          Last updated: 07 Sep 2026, 10:18 AM
        </span>
        <button className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-600 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all duration-150 active:scale-95">
          <RefreshCw size={14} />
          Sync Now
        </button>
      </div>
    </div>
  );
}
'use client';

import React, { useState } from 'react';
import {
  Globe,
  RefreshCw,
  ToggleLeft,
  ToggleRight,
  CheckCircle,
  AlertTriangle,
  Clock,
  Loader2,
  ChevronRight,
} from 'lucide-react';
import { toast } from 'sonner';

interface CrawlJob {
  id: string;
  rootUrl: string;
  label: string;
  status: 'completed' | 'running' | 'failed' | 'scheduled';
  pagesDiscovered: number;
  pagesIndexed: number;
  pagesUpdated: number;
  pagesDeleted: number;
  lastSync: string;
  nextSync: string;
  autoSync: boolean;
  syncFrequency: string;
  course: string;
}

const CRAWL_JOBS: CrawlJob[] = [
  {
    id: 'crawl-001',
    rootUrl: 'https://iihm.ac.in',
    label: 'IIHM Main Website',
    status: 'completed',
    pagesDiscovered: 312,
    pagesIndexed: 298,
    pagesUpdated: 7,
    pagesDeleted: 2,
    lastSync: '07 Sep 2026, 09:36 AM',
    nextSync: '08 Sep 2026, 09:00 AM',
    autoSync: true,
    syncFrequency: 'Daily',
    course: 'All Courses',
  },
  {
    id: 'crawl-002',
    rootUrl: 'https://iihm.ac.in/mba-hm',
    label: 'MBA-HM Microsite',
    status: 'running',
    pagesDiscovered: 44,
    pagesIndexed: 31,
    pagesUpdated: 3,
    pagesDeleted: 0,
    lastSync: '07 Sep 2026, 10:10 AM',
    nextSync: '—',
    autoSync: true,
    syncFrequency: 'Daily',
    course: 'MBA-HM',
  },
  {
    id: 'crawl-003',
    rootUrl: 'https://iihm.ac.in/placements',
    label: 'Placement Cell Portal',
    status: 'failed',
    pagesDiscovered: 18,
    pagesIndexed: 14,
    pagesUpdated: 0,
    pagesDeleted: 0,
    lastSync: '05 Sep 2026, 03:00 PM',
    nextSync: 'Retry scheduled',
    autoSync: false,
    syncFrequency: 'Weekly',
    course: 'BHM',
  },
];

const statusIcons: Record<string, React.ReactNode> = {
  completed: <CheckCircle size={14} className="text-success" />,
  running: <Loader2 size={14} className="text-info animate-spin" />,
  failed: <AlertTriangle size={14} className="text-danger" />,
  scheduled: <Clock size={14} className="text-muted-foreground" />,
};

const statusLabels: Record<string, string> = {
  completed: 'Synced',
  running: 'Syncing...',
  failed: 'Failed',
  scheduled: 'Scheduled',
};

const statusColors: Record<string, string> = {
  completed: 'text-success',
  running: 'text-info',
  failed: 'text-danger',
  scheduled: 'text-muted-foreground',
};

export default function CrawlJobCards({
  selectedJobId,
  onSelectJob,
}: {
  selectedJobId: string;
  onSelectJob: (id: string) => void;
}) {
  const [jobs, setJobs] = useState(CRAWL_JOBS);
  const [syncingId, setSyncingId] = useState<string | null>(null);

  const handleSyncNow = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSyncingId(id);
    // Backend integration point: POST /api/crawl-jobs/:id/sync
    await new Promise((r) => setTimeout(r, 2000));
    setSyncingId(null);
    setJobs((prev) =>
      prev.map((j) =>
        j.id === id
          ? { ...j, status: 'completed', lastSync: '07 Sep 2026, 10:24 AM' }
          : j
      )
    );
    toast.success('Crawl sync initiated successfully');
  };

  const handleToggleAutoSync = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setJobs((prev) =>
      prev.map((j) => (j.id === id ? { ...j, autoSync: !j.autoSync } : j))
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
      {jobs.map((job) => (
        <div
          key={job.id}
          onClick={() => onSelectJob(job.id)}
          className={`bg-card border rounded-xl p-5 cursor-pointer transition-all duration-150 hover:shadow-md ${
            selectedJobId === job.id
              ? 'border-primary shadow-sm ring-1 ring-primary/20'
              : 'border-border'
          }`}
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Globe size={18} className="text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-700 text-foreground truncate">{job.label}</p>
                <p className="text-xs text-muted-foreground truncate">{job.rootUrl}</p>
              </div>
            </div>
            <ChevronRight
              size={16}
              className={`flex-shrink-0 transition-colors mt-1 ${
                selectedJobId === job.id ? 'text-primary' : 'text-muted-foreground'
              }`}
            />
          </div>

          {/* Status */}
          <div className="flex items-center gap-1.5 mb-3">
            {statusIcons[job.status]}
            <span className={`text-xs font-600 ${statusColors[job.status]}`}>
              {statusLabels[job.status]}
            </span>
            <span className="text-xs text-muted-foreground ml-auto">
              {job.course}
            </span>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-4 gap-2 mb-3">
            {[
              { label: 'Discovered', value: job.pagesDiscovered, color: 'text-foreground' },
              { label: 'Indexed', value: job.pagesIndexed, color: 'text-success' },
              { label: 'Updated', value: job.pagesUpdated, color: 'text-info' },
              { label: 'Deleted', value: job.pagesDeleted, color: 'text-danger' },
            ].map((stat) => (
              <div key={`stat-${job.id}-${stat.label}`} className="text-center">
                <p className={`text-base font-700 font-tabular ${stat.color}`}>
                  {stat.value}
                </p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Progress bar */}
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-muted-foreground">Crawl coverage</span>
              <span className="text-xs font-600 text-foreground font-tabular">
                {Math.round((job.pagesIndexed / job.pagesDiscovered) * 100)}%
              </span>
            </div>
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all"
                style={{ width: `${Math.round((job.pagesIndexed / job.pagesDiscovered) * 100)}%` }}
              />
            </div>
          </div>

          {/* Last sync */}
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
            <span>Last sync: {job.lastSync}</span>
            <span className="text-xs">{job.syncFrequency}</span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 pt-3 border-t border-border">
            <button
              onClick={(e) => handleToggleAutoSync(job.id, e)}
              className={`flex items-center gap-1.5 text-xs font-600 transition-colors ${
                job.autoSync ? 'text-success' : 'text-muted-foreground'
              }`}
              title={job.autoSync ? 'Disable auto-sync' : 'Enable auto-sync'}
            >
              {job.autoSync ? (
                <ToggleRight size={18} />
              ) : (
                <ToggleLeft size={18} />
              )}
              Auto-sync
            </button>
            <button
              onClick={(e) => handleSyncNow(job.id, e)}
              disabled={syncingId === job.id || job.status === 'running'}
              className="ml-auto flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary text-xs font-700 rounded-lg hover:bg-primary/20 transition-all active:scale-95 disabled:opacity-50"
            >
              <RefreshCw
                size={12}
                className={syncingId === job.id ? 'animate-spin' : ''}
              />
              {syncingId === job.id ? 'Syncing...' : 'Sync Now'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
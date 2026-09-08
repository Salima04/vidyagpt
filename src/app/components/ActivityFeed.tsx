import React from 'react';
import {
  Upload,
  RefreshCw,
  AlertTriangle,
  Trash2,
  CheckCircle,
  Globe,
  MessageSquare,
} from 'lucide-react';

const activities = [
  {
    id: 'act-001',
    type: 'upload',
    message: 'BHM Admissions 2026-27 Brochure.pdf uploaded',
    detail: 'Mapped to BHM → All Branches',
    time: '09:41 AM',
    icon: <Upload size={14} />,
    color: 'bg-primary/10 text-primary',
  },
  {
    id: 'act-002',
    type: 'conflict',
    message: 'Conflict detected: Fee discrepancy in 2 sources',
    detail: 'iihm.ac.in/fees vs BHM Fee Structure 2026.xlsx',
    time: '09:36 AM',
    icon: <AlertTriangle size={14} />,
    color: 'bg-danger-muted text-danger',
  },
  {
    id: 'act-003',
    type: 'sync',
    message: 'Website crawl completed — iihm.ac.in',
    detail: '312 pages indexed, 7 updated, 2 deleted',
    time: '09:36 AM',
    icon: <RefreshCw size={14} />,
    color: 'bg-success-muted text-success',
  },
  {
    id: 'act-004',
    type: 'qa',
    message: 'Q&A batch uploaded — Hostel & Accommodation',
    detail: '48 new Q&A pairs added for BHM & MBA-HM',
    time: '08:55 AM',
    icon: <MessageSquare size={14} />,
    color: 'bg-accent/10 text-accent',
  },
  {
    id: 'act-005',
    type: 'delete',
    message: 'Deleted stale source: Placement Report 2023.pdf',
    detail: 'Removed by Arjun Mehta',
    time: '08:30 AM',
    icon: <Trash2 size={14} />,
    color: 'bg-muted text-muted-foreground',
  },
  {
    id: 'act-006',
    type: 'crawl',
    message: 'New URL added for crawl: iihm.ac.in/mba-hm',
    detail: 'Auto-sync enabled, first crawl scheduled',
    time: '07:50 AM',
    icon: <Globe size={14} />,
    color: 'bg-secondary text-secondary-foreground',
  },
  {
    id: 'act-007',
    type: 'sync',
    message: 'Auto-sync completed — 3 sources refreshed',
    detail: 'Placement 2026, Hostel FAQ, Admission Circular',
    time: '06 Sep, 11:00 PM',
    icon: <CheckCircle size={14} />,
    color: 'bg-success-muted text-success',
  },
];

export default function ActivityFeed() {
  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-700 text-foreground">Recent Activity</h2>
        <button className="text-xs text-primary hover:underline font-600">
          View all
        </button>
      </div>
      <div className="space-y-3">
        {activities?.map((act) => (
          <div
            key={act?.id}
            className="flex items-start gap-3 py-2.5 border-b border-border last:border-0"
          >
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${act?.color}`}
            >
              {act?.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-600 text-foreground leading-snug">
                {act?.message}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {act?.detail}
              </p>
            </div>
            <span className="text-xs text-muted-foreground flex-shrink-0 mt-0.5">
              {act?.time}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
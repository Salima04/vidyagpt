import React from 'react';

type StatusVariant =
  | 'active' |'processing' |'pending' |'conflict' |'stale' |'error' |'completed' |'running' |'scheduled' |'failed' |'new' |'updated' |'deleted' |'unchanged';

const variantMap: Record<StatusVariant, string> = {
  active: 'bg-success-muted text-success border border-success/20',
  processing: 'bg-info-muted text-info border border-info/20',
  pending: 'bg-muted text-muted-foreground border border-border',
  conflict: 'bg-danger-muted text-danger border border-danger/20',
  stale: 'bg-warning-muted text-warning border border-warning/20',
  error: 'bg-danger-muted text-danger border border-danger/20',
  completed: 'bg-success-muted text-success border border-success/20',
  running: 'bg-info-muted text-info border border-info/20',
  scheduled: 'bg-secondary text-secondary-foreground border border-primary/20',
  failed: 'bg-danger-muted text-danger border border-danger/20',
  new: 'bg-success-muted text-success border border-success/20',
  updated: 'bg-info-muted text-info border border-info/20',
  deleted: 'bg-danger-muted text-danger border border-danger/20',
  unchanged: 'bg-muted text-muted-foreground border border-border',
};

const labelMap: Record<StatusVariant, string> = {
  active: 'Active',
  processing: 'Processing',
  pending: 'Pending',
  conflict: 'Conflict',
  stale: 'Stale',
  error: 'Error',
  completed: 'Completed',
  running: 'Running',
  scheduled: 'Scheduled',
  failed: 'Failed',
  new: 'New',
  updated: 'Updated',
  deleted: 'Deleted',
  unchanged: 'Unchanged',
};

export default function StatusBadge({
  status,
  className = '',
}: {
  status: StatusVariant;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-600 ${variantMap[status]} ${className}`}
    >
      {labelMap[status]}
    </span>
  );
}
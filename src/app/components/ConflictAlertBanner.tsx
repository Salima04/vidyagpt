'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AlertTriangle, X, ChevronRight } from 'lucide-react';

export default function ConflictAlertBanner() {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  return (
    <div className="mb-5 bg-danger-muted border border-danger/20 rounded-xl px-4 py-3 flex items-start gap-3 fade-in">
      <AlertTriangle size={18} className="text-danger flex-shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-600 text-danger">
          4 Knowledge Conflicts Detected
        </p>
        <p className="text-xs text-danger/80 mt-0.5">
          Conflicting fee information found across{' '}
          <span className="font-600">BHM Admissions 2026.pdf</span> and{' '}
          <span className="font-600">iihm.ac.in/admissions</span>. Students may
          receive inconsistent answers. Review and resolve before next sync.
        </p>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <Link
          href="/knowledge-base-management"
          className="flex items-center gap-1 text-xs font-600 text-danger hover:underline"
        >
          Resolve now <ChevronRight size={12} />
        </Link>
        <button
          onClick={() => setDismissed(true)}
          className="p-1 rounded-md hover:bg-danger/10 text-danger/60 hover:text-danger transition-colors"
          title="Dismiss alert"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
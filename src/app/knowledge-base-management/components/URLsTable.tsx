'use client';

import React, { useState, useMemo } from 'react';
import { Edit2, Trash2, RefreshCw, ToggleLeft, ToggleRight } from 'lucide-react';
import StatusBadge from '@/components/ui/StatusBadge';
import ConfirmModal from '@/components/ui/ConfirmModal';
import { toast } from 'sonner';

interface URLRecord {
  id: string;
  url: string;
  title: string;
  course: string;
  status: 'active' | 'stale' | 'error' | 'processing';
  autoSync: boolean;
  lastSynced: string;
  pageCount: number;
  crawlSource: string;
}

const URL_DATA: URLRecord[] = [
  { id: 'url-001', url: 'https://iihm.ac.in/admissions', title: 'IIHM Admissions Page', course: 'All Courses', status: 'active', autoSync: true, lastSynced: '07 Sep 2026, 09:36 AM', pageCount: 1, crawlSource: 'Manual' },
  { id: 'url-002', url: 'https://iihm.ac.in/bhm', title: 'BHM Program Details', course: 'BHM', status: 'active', autoSync: true, lastSynced: '07 Sep 2026, 09:36 AM', pageCount: 1, crawlSource: 'Crawl' },
  { id: 'url-003', url: 'https://iihm.ac.in/fees', title: 'Fee Structure 2026-27', course: 'All Courses', status: 'active', autoSync: true, lastSynced: '07 Sep 2026, 09:36 AM', pageCount: 1, crawlSource: 'Crawl' },
  { id: 'url-004', url: 'https://iihm.ac.in/hostel', title: 'Hostel & Accommodation', course: 'All Courses', status: 'stale', autoSync: false, lastSynced: '10 Aug 2026, 11:00 AM', pageCount: 1, crawlSource: 'Manual' },
  { id: 'url-005', url: 'https://iihm.ac.in/placements', title: 'Placement Cell 2026', course: 'BHM', status: 'active', autoSync: true, lastSynced: '06 Sep 2026, 08:00 PM', pageCount: 1, crawlSource: 'Crawl' },
  { id: 'url-006', url: 'https://iihm.ac.in/mba-hm', title: 'MBA-HM Program', course: 'MBA-HM', status: 'processing', autoSync: true, lastSynced: '07 Sep 2026, 10:10 AM', pageCount: 1, crawlSource: 'Manual' },
  { id: 'url-007', url: 'https://iihm.ac.in/contact', title: 'Contact & Campus Info', course: 'All Courses', status: 'error', autoSync: false, lastSynced: '04 Sep 2026, 03:00 PM', pageCount: 1, crawlSource: 'Manual' },
  { id: 'url-008', url: 'https://iihm.ac.in/scholarship', title: 'Scholarships 2026', course: 'All Courses', status: 'active', autoSync: true, lastSynced: '06 Sep 2026, 08:00 PM', pageCount: 1, crawlSource: 'Crawl' },
];

export default function URLsTable({ search }: { search: string }) {
  const [rows, setRows] = useState(URL_DATA);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [syncingId, setSyncingId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return rows.filter(
      (r) =>
        r.url.toLowerCase().includes(q) ||
        r.title.toLowerCase().includes(q) ||
        r.course.toLowerCase().includes(q)
    );
  }, [rows, search]);

  const handleSync = async (id: string) => {
    setSyncingId(id);
    await new Promise((r) => setTimeout(r, 1500));
    setSyncingId(null);
    toast.success('URL synced successfully');
  };

  const handleToggleAutoSync = (id: string) => {
    setRows((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, autoSync: !r.autoSync } : r
      )
    );
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    await new Promise((r) => setTimeout(r, 900));
    setRows((prev) => prev.filter((r) => r.id !== deleteTarget));
    setIsDeleting(false);
    setDeleteTarget(null);
    toast.success('URL source deleted');
  };

  return (
    <>
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                {['URL / Title', 'Course', 'Status', 'Auto-Sync', 'Crawl Source', 'Last Synced', 'Actions'].map(
                  (h) => (
                    <th
                      key={`urlcol-${h}`}
                      className="px-4 py-3 text-left text-xs font-700 text-muted-foreground uppercase tracking-wider whitespace-nowrap"
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-16 text-center">
                    <p className="text-sm font-600 text-foreground">No URLs found</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Add a URL or set up a website crawl to index web content
                    </p>
                  </td>
                </tr>
              ) : (
                filtered.map((row, i) => (
                  <tr
                    key={row.id}
                    className={`border-b border-border last:border-0 hover:bg-muted/40 transition-colors group ${i % 2 === 0 ? '' : 'bg-muted/10'}`}
                  >
                    <td className="px-4 py-3 max-w-[280px]">
                      <p className="text-sm font-600 text-foreground truncate">
                        {row.title}
                      </p>
                      <p className="text-xs text-muted-foreground truncate mt-0.5">
                        {row.url}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground whitespace-nowrap">
                      {row.course}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={row.status} />
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleToggleAutoSync(row.id)}
                        className={`flex items-center gap-1.5 text-xs font-600 transition-colors ${
                          row.autoSync ? 'text-success' : 'text-muted-foreground'
                        }`}
                        title={row.autoSync ? 'Disable auto-sync' : 'Enable auto-sync'}
                      >
                        {row.autoSync ? (
                          <ToggleRight size={20} />
                        ) : (
                          <ToggleLeft size={20} />
                        )}
                        {row.autoSync ? 'On' : 'Off'}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                        {row.crawlSource}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                      {row.lastSynced}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleSync(row.id)}
                          disabled={syncingId === row.id}
                          className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-primary transition-colors disabled:opacity-50"
                          title="Sync this URL now"
                        >
                          <RefreshCw
                            size={14}
                            className={syncingId === row.id ? 'animate-spin' : ''}
                          />
                        </button>
                        <button
                          className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                          title="Edit URL mapping"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(row.id)}
                          className="p-1.5 rounded-md hover:bg-danger-muted text-muted-foreground hover:text-danger transition-colors"
                          title="Remove URL — chatbot will no longer use this source"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-border bg-muted/20">
          <p className="text-xs text-muted-foreground">
            {filtered.length} URL source{filtered.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Remove URL Source"
        description="VidyaGPT will no longer use this URL's content to answer student queries. If this URL is part of a crawl job, the crawl job will continue but this specific URL's data will be removed."
        confirmLabel="Remove URL"
        isDestructive
        isLoading={isDeleting}
      />
    </>
  );
}
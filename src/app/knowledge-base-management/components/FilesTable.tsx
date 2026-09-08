'use client';

import React, { useState, useMemo } from 'react';
import {
  Eye,
  Edit2,
  Trash2,
  AlertTriangle,
  Clock,
  ChevronUp,
  ChevronDown,
  CheckSquare,
  Square,
} from 'lucide-react';
import StatusBadge from '@/components/ui/StatusBadge';
import ConfirmModal from '@/components/ui/ConfirmModal';
import { toast } from 'sonner';

interface FileRecord {
  id: string;
  name: string;
  type: 'PDF' | 'Excel' | 'Brochure' | 'Word';
  course: string;
  branch: string;
  status: 'active' | 'processing' | 'conflict' | 'stale' | 'error' | 'pending';
  size: string;
  lastUpdated: string;
  hasConflict: boolean;
  isStale: boolean;
  uploadedBy: string;
}

const FILE_DATA: FileRecord[] = [
  { id: 'file-001', name: 'BHM Admissions Brochure 2026-27.pdf', type: 'PDF', course: 'BHM', branch: 'All Branches', status: 'conflict', size: '4.2 MB', lastUpdated: '07 Sep 2026', hasConflict: true, isStale: false, uploadedBy: 'Arjun Mehta' },
  { id: 'file-002', name: 'BHM Fee Structure 2026.xlsx', type: 'Excel', course: 'BHM', branch: 'Kolkata', status: 'conflict', size: '128 KB', lastUpdated: '05 Sep 2026', hasConflict: true, isStale: false, uploadedBy: 'Priya Sharma' },
  { id: 'file-003', name: 'MBA-HM Course Curriculum 2026.pdf', type: 'PDF', course: 'MBA-HM', branch: 'All Branches', status: 'active', size: '2.8 MB', lastUpdated: '01 Sep 2026', hasConflict: false, isStale: false, uploadedBy: 'Arjun Mehta' },
  { id: 'file-004', name: 'Hostel & Accommodation FAQ.pdf', type: 'PDF', course: 'All Courses', branch: 'Kolkata', status: 'active', size: '890 KB', lastUpdated: '28 Aug 2026', hasConflict: false, isStale: false, uploadedBy: 'Ravi Kumar' },
  { id: 'file-005', name: 'Placement Report 2025-26.pdf', type: 'PDF', course: 'BHM', branch: 'All Branches', status: 'stale', size: '3.1 MB', lastUpdated: '12 Jul 2026', hasConflict: false, isStale: true, uploadedBy: 'Arjun Mehta' },
  { id: 'file-006', name: 'B.Sc HHA Eligibility Criteria.docx', type: 'Word', course: 'B.Sc HHA', branch: 'All Branches', status: 'active', size: '245 KB', lastUpdated: '25 Aug 2026', hasConflict: false, isStale: false, uploadedBy: 'Priya Sharma' },
  { id: 'file-007', name: 'Academic Calendar 2026-27.xlsx', type: 'Excel', course: 'All Courses', branch: 'All Branches', status: 'processing', size: '512 KB', lastUpdated: '07 Sep 2026', hasConflict: false, isStale: false, uploadedBy: 'Ravi Kumar' },
  { id: 'file-008', name: 'Scholarship & Financial Aid 2026.pdf', type: 'PDF', course: 'All Courses', branch: 'All Branches', status: 'active', size: '1.4 MB', lastUpdated: '02 Sep 2026', hasConflict: false, isStale: false, uploadedBy: 'Arjun Mehta' },
  { id: 'file-009', name: 'Diploma in Culinary Arts Brochure.pdf', type: 'Brochure', course: 'Diploma', branch: 'Mumbai', status: 'stale', size: '6.7 MB', lastUpdated: '03 Jun 2026', hasConflict: false, isStale: true, uploadedBy: 'Priya Sharma' },
  { id: 'file-010', name: 'PG Diploma Admission Form 2026.pdf', type: 'PDF', course: 'PG Dipl.', branch: 'All Branches', status: 'error', size: '320 KB', lastUpdated: '06 Sep 2026', hasConflict: false, isStale: false, uploadedBy: 'Arjun Mehta' },
  { id: 'file-011', name: 'International Students Guide 2026.pdf', type: 'PDF', course: 'All Courses', branch: 'All Branches', status: 'active', size: '2.2 MB', lastUpdated: '30 Aug 2026', hasConflict: false, isStale: false, uploadedBy: 'Ravi Kumar' },
  { id: 'file-012', name: 'Certificate Course Details.xlsx', type: 'Excel', course: 'Cert.', branch: 'Delhi', status: 'pending', size: '98 KB', lastUpdated: '07 Sep 2026', hasConflict: false, isStale: false, uploadedBy: 'Arjun Mehta' },
];

const typeColors: Record<string, string> = {
  PDF: 'bg-danger-muted text-danger border border-danger/20',
  Excel: 'bg-success-muted text-success border border-success/20',
  Brochure: 'bg-secondary text-secondary-foreground border border-primary/20',
  Word: 'bg-info-muted text-info border border-info/20',
};

export default function FilesTable({ search }: { search: string }) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [sortKey, setSortKey] = useState<keyof FileRecord>('lastUpdated');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [rows, setRows] = useState(FILE_DATA);
  const [page, setPage] = useState(1);
  const perPage = 8;

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return rows.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.course.toLowerCase().includes(q) ||
        r.branch.toLowerCase().includes(q) ||
        r.type.toLowerCase().includes(q)
    );
  }, [rows, search]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const av = a[sortKey] as string;
      const bv = b[sortKey] as string;
      return sortDir === 'asc'
        ? av.localeCompare(bv)
        : bv.localeCompare(av);
    });
  }, [filtered, sortKey, sortDir]);

  const totalPages = Math.ceil(sorted.length / perPage);
  const pageRows = sorted.slice((page - 1) * perPage, page * perPage);

  const toggleSort = (key: keyof FileRecord) => {
    if (sortKey === key) setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };

  const toggleSelect = (id: string) => {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelected(next);
  };

  const toggleAll = () => {
    if (selected.size === pageRows.length) setSelected(new Set());
    else setSelected(new Set(pageRows.map((r) => r.id)));
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    await new Promise((r) => setTimeout(r, 900));
    setRows((prev) => prev.filter((r) => r.id !== deleteTarget));
    setIsDeleting(false);
    setDeleteTarget(null);
    toast.success('Source deleted successfully');
  };

  const handleBulkDelete = async () => {
    await new Promise((r) => setTimeout(r, 900));
    setRows((prev) => prev.filter((r) => !selected.has(r.id)));
    const count = selected.size;
    setSelected(new Set());
    toast.success(`${count} source${count > 1 ? 's' : ''} deleted`);
  };

  const SortIcon = ({ col }: { col: keyof FileRecord }) => (
    <span className="ml-1 inline-flex flex-col">
      <ChevronUp
        size={10}
        className={sortKey === col && sortDir === 'asc' ? 'text-primary' : 'text-muted-foreground/40'}
      />
      <ChevronDown
        size={10}
        className={sortKey === col && sortDir === 'desc' ? 'text-primary' : 'text-muted-foreground/40'}
      />
    </span>
  );

  return (
    <>
      {/* Bulk action bar */}
      {selected.size > 0 && (
        <div className="mb-3 flex items-center gap-3 bg-primary/5 border border-primary/20 rounded-xl px-4 py-2.5 slide-up">
          <span className="text-sm font-600 text-primary">
            {selected.size} selected
          </span>
          <button
            onClick={handleBulkDelete}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-danger text-danger-foreground text-xs font-700 rounded-lg hover:bg-danger/90 transition-all active:scale-95"
          >
            <Trash2 size={13} />
            Delete selected
          </button>
          <button
            onClick={() => setSelected(new Set())}
            className="text-xs text-muted-foreground hover:text-foreground ml-auto"
          >
            Deselect all
          </button>
        </div>
      )}

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="w-10 px-4 py-3 text-left">
                  <button onClick={toggleAll} className="text-muted-foreground hover:text-foreground">
                    {selected.size === pageRows.length && pageRows.length > 0 ? (
                      <CheckSquare size={15} className="text-primary" />
                    ) : (
                      <Square size={15} />
                    )}
                  </button>
                </th>
                {[
                  { key: 'name' as keyof FileRecord, label: 'File Name' },
                  { key: 'type' as keyof FileRecord, label: 'Type' },
                  { key: 'course' as keyof FileRecord, label: 'Course' },
                  { key: 'branch' as keyof FileRecord, label: 'Branch' },
                  { key: 'status' as keyof FileRecord, label: 'Status' },
                  { key: 'size' as keyof FileRecord, label: 'Size' },
                  { key: 'lastUpdated' as keyof FileRecord, label: 'Last Updated' },
                  { key: 'uploadedBy' as keyof FileRecord, label: 'Uploaded By' },
                ].map((col) => (
                  <th
                    key={`col-${col.key}`}
                    className="px-4 py-3 text-left text-xs font-700 text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground whitespace-nowrap"
                    onClick={() => toggleSort(col.key)}
                  >
                    {col.label}
                    <SortIcon col={col.key} />
                  </th>
                ))}
                <th className="px-4 py-3 text-right text-xs font-700 text-muted-foreground uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {pageRows.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-4 py-16 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                        <FileIcon />
                      </div>
                      <p className="text-sm font-600 text-foreground">
                        No files found
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Upload PDFs, Excel sheets, or brochures to power VidyaGPT&apos;s knowledge base
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                pageRows.map((row, i) => (
                  <tr
                    key={row.id}
                    className={`border-b border-border last:border-0 hover:bg-muted/40 transition-colors group ${
                      i % 2 === 0 ? '' : 'bg-muted/10'
                    } ${selected.has(row.id) ? 'bg-primary/5' : ''}`}
                  >
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleSelect(row.id)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        {selected.has(row.id) ? (
                          <CheckSquare size={15} className="text-primary" />
                        ) : (
                          <Square size={15} />
                        )}
                      </button>
                    </td>
                    <td className="px-4 py-3 max-w-[240px]">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-500 text-foreground truncate">
                          {row.name}
                        </p>
                        {row.hasConflict && (
                          <AlertTriangle
                            size={13}
                            className="text-danger flex-shrink-0"
                            title="Conflict detected"
                          />
                        )}
                        {row.isStale && (
                          <Clock
                            size={13}
                            className="text-warning flex-shrink-0"
                            title="Stale — not updated in 30+ days"
                          />
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-600 ${typeColors[row.type]}`}
                      >
                        {row.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground whitespace-nowrap">
                      {row.course}
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground whitespace-nowrap">
                      {row.branch}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={row.status} />
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground font-tabular whitespace-nowrap">
                      {row.size}
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground whitespace-nowrap">
                      {row.lastUpdated}
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground whitespace-nowrap">
                      {row.uploadedBy}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-primary transition-colors"
                          title="View file content"
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                          title="Edit course mapping"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(row.id)}
                          className="p-1.5 rounded-md hover:bg-danger-muted text-muted-foreground hover:text-danger transition-colors"
                          title="Delete this source — cannot be undone"
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

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-muted/20">
          <p className="text-xs text-muted-foreground">
            Showing {Math.min((page - 1) * perPage + 1, sorted.length)}–
            {Math.min(page * perPage, sorted.length)} of {sorted.length} files
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="px-2.5 py-1.5 text-xs font-600 rounded-md border border-border hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={`page-${p}`}
                onClick={() => setPage(p)}
                className={`w-8 h-7 text-xs font-600 rounded-md transition-colors ${
                  p === page
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted text-muted-foreground'
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="px-2.5 py-1.5 text-xs font-600 rounded-md border border-border hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Knowledge Source"
        description="This will permanently remove the file and its indexed content from VidyaGPT. Students will no longer receive answers from this source. This cannot be undone."
        confirmLabel="Delete Source"
        isDestructive
        isLoading={isDeleting}
      />
    </>
  );
}

function FileIcon() {
  return (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-muted-foreground">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
}
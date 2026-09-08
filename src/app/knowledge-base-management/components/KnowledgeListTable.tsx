'use client';

import React, { useState, useMemo } from 'react';
import {
  Search, Filter, RefreshCw, Eye, Edit2, Trash2, ChevronUp, ChevronDown,
  AlertTriangle, Clock, Globe, FileText, MessageSquare, AlignLeft, Link2,
  CheckSquare, Square, ChevronDown as ChevronDownIcon, X
} from 'lucide-react';
import StatusBadge from '@/components/ui/StatusBadge';
import ConfirmModal from '@/components/ui/ConfirmModal';
import { toast } from 'sonner';

type SourceType = 'URL' | 'Crawl' | 'PDF' | 'Excel' | 'Word' | 'CSV' | 'Q&A' | 'Text' | 'Brochure';
type SyncStatus = 'synced' | 'pending' | 'failed' | 'not-applicable';
type KBStatus = 'active' | 'processing' | 'conflict' | 'stale' | 'error' | 'pending';

interface KBRecord {
  id: string;
  name: string;
  type: SourceType;
  course: string;
  branch: string;
  status: KBStatus;
  lastUpdated: string;
  syncStatus: SyncStatus;
  hasConflict: boolean;
  isStale: boolean;
  size?: string;
  pageCount?: number;
  uploadedBy: string;
}

const KB_DATA: KBRecord[] = [
  { id: 'kb-001', name: 'BHM Admissions Brochure 2026-27.pdf', type: 'PDF', course: 'BHM', branch: 'All Branches', status: 'conflict', lastUpdated: '07 Sep 2026', syncStatus: 'not-applicable', hasConflict: true, isStale: false, size: '4.2 MB', uploadedBy: 'Arjun Mehta' },
  { id: 'kb-002', name: 'https://iihm.ac.in/admissions', type: 'URL', course: 'All Courses', branch: 'All Branches', status: 'active', lastUpdated: '07 Sep 2026', syncStatus: 'synced', hasConflict: false, isStale: false, pageCount: 1, uploadedBy: 'System' },
  { id: 'kb-003', name: 'BHM Fee Structure 2026.xlsx', type: 'Excel', course: 'BHM', branch: 'Kolkata', status: 'conflict', lastUpdated: '05 Sep 2026', syncStatus: 'not-applicable', hasConflict: true, isStale: false, size: '128 KB', uploadedBy: 'Priya Sharma' },
  { id: 'kb-004', name: 'https://iihm.ac.in (Full Crawl)', type: 'Crawl', course: 'All Courses', branch: 'All Branches', status: 'active', lastUpdated: '07 Sep 2026', syncStatus: 'synced', hasConflict: false, isStale: false, pageCount: 47, uploadedBy: 'System' },
  { id: 'kb-005', name: 'MBA-HM Course Curriculum 2026.pdf', type: 'PDF', course: 'MBA-HM', branch: 'All Branches', status: 'active', lastUpdated: '01 Sep 2026', syncStatus: 'not-applicable', hasConflict: false, isStale: false, size: '2.8 MB', uploadedBy: 'Arjun Mehta' },
  { id: 'kb-006', name: 'Hostel & Accommodation FAQ.pdf', type: 'PDF', course: 'All Courses', branch: 'Kolkata', status: 'active', lastUpdated: '28 Aug 2026', syncStatus: 'not-applicable', hasConflict: false, isStale: false, size: '890 KB', uploadedBy: 'Ravi Kumar' },
  { id: 'kb-007', name: 'Placement Report 2025-26.pdf', type: 'PDF', course: 'BHM', branch: 'All Branches', status: 'stale', lastUpdated: '12 Jul 2026', syncStatus: 'not-applicable', hasConflict: false, isStale: true, size: '3.1 MB', uploadedBy: 'Arjun Mehta' },
  { id: 'kb-008', name: 'https://iihm.ac.in/fees', type: 'URL', course: 'All Courses', branch: 'All Branches', status: 'active', lastUpdated: '07 Sep 2026', syncStatus: 'synced', hasConflict: false, isStale: false, pageCount: 1, uploadedBy: 'System' },
  { id: 'kb-009', name: 'BHM Admission Q&A (94 pairs)', type: 'Q&A', course: 'BHM', branch: 'All Branches', status: 'active', lastUpdated: '01 Sep 2026', syncStatus: 'not-applicable', hasConflict: false, isStale: false, uploadedBy: 'Arjun Mehta' },
  { id: 'kb-010', name: 'B.Sc HHA Eligibility Criteria.docx', type: 'Word', course: 'B.Sc HHA', branch: 'All Branches', status: 'active', lastUpdated: '25 Aug 2026', syncStatus: 'not-applicable', hasConflict: false, isStale: false, size: '245 KB', uploadedBy: 'Priya Sharma' },
  { id: 'kb-011', name: 'Academic Calendar 2026-27.xlsx', type: 'Excel', course: 'All Courses', branch: 'All Branches', status: 'processing', lastUpdated: '07 Sep 2026', syncStatus: 'pending', hasConflict: false, isStale: false, size: '512 KB', uploadedBy: 'Ravi Kumar' },
  { id: 'kb-012', name: 'https://iihm.ac.in/hostel', type: 'URL', course: 'All Courses', branch: 'All Branches', status: 'stale', lastUpdated: '10 Aug 2026', syncStatus: 'failed', hasConflict: false, isStale: true, pageCount: 1, uploadedBy: 'System' },
  { id: 'kb-013', name: 'Scholarship & Financial Aid 2026.pdf', type: 'PDF', course: 'All Courses', branch: 'All Branches', status: 'active', lastUpdated: '02 Sep 2026', syncStatus: 'not-applicable', hasConflict: false, isStale: false, size: '1.4 MB', uploadedBy: 'Arjun Mehta' },
  { id: 'kb-014', name: 'Diploma in Culinary Arts Brochure.pdf', type: 'Brochure', course: 'Diploma', branch: 'Mumbai', status: 'stale', lastUpdated: '03 Jun 2026', syncStatus: 'not-applicable', hasConflict: false, isStale: true, size: '6.7 MB', uploadedBy: 'Priya Sharma' },
  { id: 'kb-015', name: 'Hostel Manual Text — Kolkata Campus', type: 'Text', course: 'All Courses', branch: 'Kolkata', status: 'active', lastUpdated: '30 Aug 2026', syncStatus: 'not-applicable', hasConflict: false, isStale: false, uploadedBy: 'Ravi Kumar' },
  { id: 'kb-016', name: 'MBA-HM Placement Q&A (42 pairs)', type: 'Q&A', course: 'MBA-HM', branch: 'All Branches', status: 'pending', lastUpdated: '06 Sep 2026', syncStatus: 'not-applicable', hasConflict: false, isStale: false, uploadedBy: 'Priya Sharma' },
];

const TYPE_ICONS: Record<SourceType, React.ReactNode> = {
  URL: <Link2 size={13} className="text-info" />,
  Crawl: <Globe size={13} className="text-primary" />,
  PDF: <FileText size={13} className="text-danger" />,
  Excel: <FileText size={13} className="text-success" />,
  Word: <FileText size={13} className="text-info" />,
  CSV: <FileText size={13} className="text-warning" />,
  'Q&A': <MessageSquare size={13} className="text-primary" />,
  Text: <AlignLeft size={13} className="text-muted-foreground" />,
  Brochure: <FileText size={13} className="text-secondary-foreground" />,
};

const TYPE_COLORS: Record<SourceType, string> = {
  URL: 'bg-info-muted text-info border-info/20',
  Crawl: 'bg-primary/10 text-primary border-primary/20',
  PDF: 'bg-danger-muted text-danger border-danger/20',
  Excel: 'bg-success-muted text-success border-success/20',
  Word: 'bg-info-muted text-info border-info/20',
  CSV: 'bg-warning-muted text-warning border-warning/20',
  'Q&A': 'bg-secondary text-secondary-foreground border-primary/20',
  Text: 'bg-muted text-muted-foreground border-border',
  Brochure: 'bg-secondary text-secondary-foreground border-primary/20',
};

const SYNC_STATUS_MAP: Record<SyncStatus, { label: string; className: string }> = {
  synced: { label: 'Synced', className: 'text-success bg-success-muted border-success/20' },
  pending: { label: 'Pending', className: 'text-warning bg-warning-muted border-warning/20' },
  failed: { label: 'Failed', className: 'text-danger bg-danger-muted border-danger/20' },
  'not-applicable': { label: '—', className: 'text-muted-foreground' },
};

const ALL_COURSES = ['All', 'BHM', 'MBA-HM', 'B.Sc HHA', 'Diploma', 'PG Diploma', 'Certificate', 'All Courses'];
const ALL_TYPES: SourceType[] = ['URL', 'Crawl', 'PDF', 'Excel', 'Word', 'CSV', 'Q&A', 'Text', 'Brochure'];

export default function KnowledgeListTable() {
  const [rows, setRows] = useState(KB_DATA);
  const [search, setSearch] = useState('');
  const [filterCourse, setFilterCourse] = useState('All');
  const [filterType, setFilterType] = useState<SourceType | 'All'>('All');
  const [filterStatus, setFilterStatus] = useState<KBStatus | 'All'>('All');
  const [sortKey, setSortKey] = useState<keyof KBRecord>('lastUpdated');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const perPage = 10;

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return rows.filter(r => {
      const matchSearch = !q || r.name.toLowerCase().includes(q) || r.course.toLowerCase().includes(q) || r.type.toLowerCase().includes(q) || r.uploadedBy.toLowerCase().includes(q);
      const matchCourse = filterCourse === 'All' || r.course === filterCourse || r.course === 'All Courses';
      const matchType = filterType === 'All' || r.type === filterType;
      const matchStatus = filterStatus === 'All' || r.status === filterStatus;
      return matchSearch && matchCourse && matchType && matchStatus;
    });
  }, [rows, search, filterCourse, filterType, filterStatus]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const av = String(a[sortKey] ?? '');
      const bv = String(b[sortKey] ?? '');
      return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
    });
  }, [filtered, sortKey, sortDir]);

  const totalPages = Math.ceil(sorted.length / perPage);
  const pageRows = sorted.slice((page - 1) * perPage, page * perPage);

  const toggleSort = (key: keyof KBRecord) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
    setPage(1);
  };

  const toggleSelect = (id: string) => {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelected(next);
  };

  const toggleAll = () => {
    if (selected.size === pageRows.length) setSelected(new Set());
    else setSelected(new Set(pageRows.map(r => r.id)));
  };

  const handleSync = async (id: string) => {
    setSyncingId(id);
    await new Promise(r => setTimeout(r, 1500));
    setSyncingId(null);
    setRows(prev => prev.map(r => r.id === id ? { ...r, syncStatus: 'synced' as SyncStatus, lastUpdated: '07 Sep 2026' } : r));
    toast.success('Source synced successfully');
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    await new Promise(r => setTimeout(r, 900));
    setRows(prev => prev.filter(r => r.id !== deleteTarget));
    setIsDeleting(false);
    setDeleteTarget(null);
    toast.success('Knowledge source deleted');
  };

  const handleBulkDelete = async () => {
    await new Promise(r => setTimeout(r, 900));
    const count = selected.size;
    setRows(prev => prev.filter(r => !selected.has(r.id)));
    setSelected(new Set());
    toast.success(`${count} source${count > 1 ? 's' : ''} deleted`);
  };

  const SortIcon = ({ col }: { col: keyof KBRecord }) => (
    <span className="ml-1 inline-flex flex-col">
      <ChevronUp size={10} className={sortKey === col && sortDir === 'asc' ? 'text-primary' : 'text-muted-foreground/40'} />
      <ChevronDown size={10} className={sortKey === col && sortDir === 'desc' ? 'text-primary' : 'text-muted-foreground/40'} />
    </span>
  );

  const conflictCount = rows.filter(r => r.hasConflict).length;
  const staleCount = rows.filter(r => r.isStale).length;

  return (
    <div className="space-y-4">
      {/* Alert banners */}
      {(conflictCount > 0 || staleCount > 0) && (
        <div className="flex flex-wrap gap-3">
          {conflictCount > 0 && (
            <div className="flex items-center gap-2.5 px-4 py-2.5 bg-danger-muted border border-danger/20 rounded-xl">
              <AlertTriangle size={14} className="text-danger" />
              <span className="text-sm font-600 text-danger">{conflictCount} knowledge conflict{conflictCount > 1 ? 's' : ''} detected</span>
              <span className="text-xs text-danger/70">— Review and resolve to improve AI accuracy</span>
            </div>
          )}
          {staleCount > 0 && (
            <div className="flex items-center gap-2.5 px-4 py-2.5 bg-warning-muted border border-warning/20 rounded-xl">
              <Clock size={14} className="text-warning" />
              <span className="text-sm font-600 text-warning">{staleCount} stale source{staleCount > 1 ? 's' : ''}</span>
              <span className="text-xs text-warning/70">— Content not updated in 30+ days</span>
            </div>
          )}
        </div>
      )}

      {/* Search + Filter bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by name, course, type, uploaded by..."
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-input rounded-lg bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-600 border rounded-lg transition-all ${showFilters ? 'bg-primary/10 border-primary/30 text-primary' : 'border-border text-muted-foreground hover:text-foreground hover:border-primary/30 bg-card'}`}
        >
          <Filter size={14} />
          Filters
          {(filterCourse !== 'All' || filterType !== 'All' || filterStatus !== 'All') && (
            <span className="w-4 h-4 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">!</span>
          )}
          <ChevronDownIcon size={14} className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Filter panel */}
      {showFilters && (
        <div className="bg-muted/30 border border-border rounded-xl p-4 slide-up">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-600 text-muted-foreground mb-1.5 uppercase tracking-wider">Course</label>
              <select value={filterCourse} onChange={e => { setFilterCourse(e.target.value); setPage(1); }}
                className="w-full px-3 py-2 text-sm border border-input rounded-lg bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30">
                {ALL_COURSES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-600 text-muted-foreground mb-1.5 uppercase tracking-wider">Source Type</label>
              <select value={filterType} onChange={e => { setFilterType(e.target.value as SourceType | 'All'); setPage(1); }}
                className="w-full px-3 py-2 text-sm border border-input rounded-lg bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30">
                <option value="All">All Types</option>
                {ALL_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-600 text-muted-foreground mb-1.5 uppercase tracking-wider">Status</label>
              <select value={filterStatus} onChange={e => { setFilterStatus(e.target.value as KBStatus | 'All'); setPage(1); }}
                className="w-full px-3 py-2 text-sm border border-input rounded-lg bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30">
                <option value="All">All Statuses</option>
                {(['active', 'processing', 'conflict', 'stale', 'error', 'pending'] as KBStatus[]).map(s => (
                  <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                ))}
              </select>
            </div>
          </div>
          {(filterCourse !== 'All' || filterType !== 'All' || filterStatus !== 'All') && (
            <button onClick={() => { setFilterCourse('All'); setFilterType('All'); setFilterStatus('All'); setPage(1); }}
              className="mt-3 flex items-center gap-1.5 text-xs font-600 text-muted-foreground hover:text-foreground transition-colors">
              <X size={12} /> Clear all filters
            </button>
          )}
        </div>
      )}

      {/* Bulk action bar */}
      {selected.size > 0 && (
        <div className="flex items-center gap-3 bg-primary/5 border border-primary/20 rounded-xl px-4 py-2.5 slide-up">
          <span className="text-sm font-600 text-primary">{selected.size} selected</span>
          <button onClick={handleBulkDelete}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-danger text-danger-foreground text-xs font-700 rounded-lg hover:bg-danger/90 transition-all active:scale-95">
            <Trash2 size={13} /> Delete selected
          </button>
          <button onClick={() => setSelected(new Set())} className="text-xs text-muted-foreground hover:text-foreground ml-auto">
            Deselect all
          </button>
        </div>
      )}

      {/* Table */}
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
                  { key: 'name' as keyof KBRecord, label: 'Source Name' },
                  { key: 'type' as keyof KBRecord, label: 'Type' },
                  { key: 'course' as keyof KBRecord, label: 'Course / Program' },
                  { key: 'status' as keyof KBRecord, label: 'Status' },
                  { key: 'lastUpdated' as keyof KBRecord, label: 'Last Updated' },
                  { key: 'syncStatus' as keyof KBRecord, label: 'Sync Status' },
                ].map(col => (
                  <th key={`col-${col.key}`}
                    className="px-4 py-3 text-left text-xs font-700 text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground whitespace-nowrap"
                    onClick={() => toggleSort(col.key)}>
                    {col.label}
                    <SortIcon col={col.key} />
                  </th>
                ))}
                <th className="px-4 py-3 text-right text-xs font-700 text-muted-foreground uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pageRows.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                        <Search size={20} className="text-muted-foreground" />
                      </div>
                      <p className="text-sm font-600 text-foreground">No knowledge sources found</p>
                      <p className="text-xs text-muted-foreground">Try adjusting your search or filters</p>
                    </div>
                  </td>
                </tr>
              ) : (
                pageRows.map((row, i) => (
                  <tr key={row.id}
                    className={`border-b border-border last:border-0 hover:bg-muted/40 transition-colors group ${i % 2 === 0 ? '' : 'bg-muted/10'} ${selected.has(row.id) ? 'bg-primary/5' : ''}`}>
                    <td className="px-4 py-3">
                      <button onClick={() => toggleSelect(row.id)} className="text-muted-foreground hover:text-foreground">
                        {selected.has(row.id) ? <CheckSquare size={15} className="text-primary" /> : <Square size={15} />}
                      </button>
                    </td>
                    <td className="px-4 py-3 max-w-[260px]">
                      <div className="flex items-center gap-2">
                        <div className="flex-shrink-0">{TYPE_ICONS[row.type]}</div>
                        <div className="min-w-0">
                          <p className="text-sm font-500 text-foreground truncate">{row.name}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            {row.size && <span className="text-xs text-muted-foreground">{row.size}</span>}
                            {row.pageCount && <span className="text-xs text-muted-foreground">{row.pageCount} page{row.pageCount !== 1 ? 's' : ''}</span>}
                            {row.hasConflict && <AlertTriangle size={11} className="text-danger" title="Conflict detected" />}
                            {row.isStale && <Clock size={11} className="text-warning" title="Stale content" />}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 text-xs font-600 px-2 py-0.5 rounded-full border ${TYPE_COLORS[row.type]}`}>
                        {row.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground whitespace-nowrap">{row.course}</td>
                    <td className="px-4 py-3"><StatusBadge status={row.status} /></td>
                    <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">{row.lastUpdated}</td>
                    <td className="px-4 py-3">
                      {row.syncStatus === 'not-applicable' ? (
                        <span className="text-xs text-muted-foreground">—</span>
                      ) : (
                        <span className={`inline-flex items-center text-xs font-600 px-2 py-0.5 rounded-full border ${SYNC_STATUS_MAP[row.syncStatus].className}`}>
                          {SYNC_STATUS_MAP[row.syncStatus].label}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors" title="View source">
                          <Eye size={14} />
                        </button>
                        <button className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors" title="Edit mapping">
                          <Edit2 size={14} />
                        </button>
                        {(row.type === 'URL' || row.type === 'Crawl') && (
                          <button onClick={() => handleSync(row.id)} disabled={syncingId === row.id}
                            className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-primary transition-colors disabled:opacity-50" title="Sync now">
                            <RefreshCw size={14} className={syncingId === row.id ? 'animate-spin' : ''} />
                          </button>
                        )}
                        <button onClick={() => setDeleteTarget(row.id)}
                          className="p-1.5 rounded-md hover:bg-danger-muted text-muted-foreground hover:text-danger transition-colors" title="Delete source">
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

        {/* Footer */}
        <div className="px-4 py-3 border-t border-border bg-muted/20 flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            Showing {Math.min((page - 1) * perPage + 1, sorted.length)}–{Math.min(page * perPage, sorted.length)} of {sorted.length} sources
          </p>
          {totalPages > 1 && (
            <div className="flex items-center gap-1">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="px-3 py-1.5 text-xs font-600 border border-border rounded-lg hover:bg-muted disabled:opacity-40 transition-colors">
                Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setPage(p)}
                  className={`px-3 py-1.5 text-xs font-600 border rounded-lg transition-colors ${p === page ? 'bg-primary text-primary-foreground border-primary' : 'border-border hover:bg-muted'}`}>
                  {p}
                </button>
              ))}
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                className="px-3 py-1.5 text-xs font-600 border border-border rounded-lg hover:bg-muted disabled:opacity-40 transition-colors">
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Knowledge Source"
        description="VidyaGPT will no longer use this source to answer student queries. This action cannot be undone."
        confirmLabel="Delete Source"
        isDestructive
        isLoading={isDeleting}
      />
    </div>
  );
}

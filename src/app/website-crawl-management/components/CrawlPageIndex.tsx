'use client';

import React, { useState, useMemo } from 'react';
import { Search, ExternalLink, RefreshCw } from 'lucide-react';
import StatusBadge from '@/components/ui/StatusBadge';

interface CrawledPage {
  id: string;
  url: string;
  title: string;
  changeStatus: 'new' | 'updated' | 'deleted' | 'unchanged';
  lastCrawled: string;
  course: string;
  wordCount: number;
  httpStatus: number;
}

const PAGES_BY_JOB: Record<string, CrawledPage[]> = {
  'crawl-001': [
    { id: 'page-001', url: '/admissions', title: 'Admissions 2026-27', changeStatus: 'updated', lastCrawled: '07 Sep 2026, 09:36 AM', course: 'All Courses', wordCount: 1842, httpStatus: 200 },
    { id: 'page-002', url: '/fees', title: 'Fee Structure 2026-27', changeStatus: 'updated', lastCrawled: '07 Sep 2026, 09:36 AM', course: 'All Courses', wordCount: 2310, httpStatus: 200 },
    { id: 'page-003', url: '/bhm', title: 'Bachelor of Hotel Management', changeStatus: 'unchanged', lastCrawled: '07 Sep 2026, 09:36 AM', course: 'BHM', wordCount: 3104, httpStatus: 200 },
    { id: 'page-004', url: '/mba-hm', title: 'MBA in Hotel Management', changeStatus: 'new', lastCrawled: '07 Sep 2026, 09:36 AM', course: 'MBA-HM', wordCount: 2780, httpStatus: 200 },
    { id: 'page-005', url: '/hostel', title: 'Hostel & Accommodation', changeStatus: 'unchanged', lastCrawled: '07 Sep 2026, 09:36 AM', course: 'All Courses', wordCount: 1120, httpStatus: 200 },
    { id: 'page-006', url: '/placements', title: 'Placement Cell', changeStatus: 'updated', lastCrawled: '07 Sep 2026, 09:36 AM', course: 'BHM', wordCount: 2640, httpStatus: 200 },
    { id: 'page-007', url: '/scholarship', title: 'Scholarships & Financial Aid', changeStatus: 'unchanged', lastCrawled: '07 Sep 2026, 09:36 AM', course: 'All Courses', wordCount: 980, httpStatus: 200 },
    { id: 'page-008', url: '/bsc-hha', title: 'B.Sc Hotel & Hospitality Admin', changeStatus: 'unchanged', lastCrawled: '07 Sep 2026, 09:36 AM', course: 'B.Sc HHA', wordCount: 2190, httpStatus: 200 },
    { id: 'page-009', url: '/contact', title: 'Contact Us — All Campuses', changeStatus: 'updated', lastCrawled: '07 Sep 2026, 09:36 AM', course: 'All Courses', wordCount: 640, httpStatus: 200 },
    { id: 'page-010', url: '/events/2026', title: 'Events & Workshops 2026', changeStatus: 'new', lastCrawled: '07 Sep 2026, 09:36 AM', course: 'All Courses', wordCount: 1380, httpStatus: 200 },
    { id: 'page-011', url: '/about', title: 'About IIHM', changeStatus: 'unchanged', lastCrawled: '07 Sep 2026, 09:36 AM', course: 'All Courses', wordCount: 2800, httpStatus: 200 },
    { id: 'page-012', url: '/diploma-culinary', title: 'Diploma in Culinary Arts', changeStatus: 'unchanged', lastCrawled: '07 Sep 2026, 09:36 AM', course: 'Diploma', wordCount: 1950, httpStatus: 200 },
    { id: 'page-013', url: '/old-admissions-2024', title: 'Admissions 2024-25 (Archive)', changeStatus: 'deleted', lastCrawled: '07 Sep 2026, 09:36 AM', course: 'All Courses', wordCount: 0, httpStatus: 404 },
    { id: 'page-014', url: '/news/aug-2026', title: 'News & Announcements Aug 2026', changeStatus: 'new', lastCrawled: '07 Sep 2026, 09:36 AM', course: 'All Courses', wordCount: 720, httpStatus: 200 },
  ],
  'crawl-002': [
    { id: 'page-m01', url: '/mba-hm/curriculum', title: 'MBA-HM Curriculum 2026', changeStatus: 'updated', lastCrawled: '07 Sep 2026, 10:10 AM', course: 'MBA-HM', wordCount: 3200, httpStatus: 200 },
    { id: 'page-m02', url: '/mba-hm/fees', title: 'MBA-HM Fee Details', changeStatus: 'new', lastCrawled: '07 Sep 2026, 10:10 AM', course: 'MBA-HM', wordCount: 890, httpStatus: 200 },
    { id: 'page-m03', url: '/mba-hm/faculty', title: 'Faculty & Mentors', changeStatus: 'unchanged', lastCrawled: '07 Sep 2026, 10:10 AM', course: 'MBA-HM', wordCount: 2140, httpStatus: 200 },
  ],
  'crawl-003': [
    { id: 'page-p01', url: '/placements/2026', title: 'Placements 2025-26 Report', changeStatus: 'unchanged', lastCrawled: '05 Sep 2026, 03:00 PM', course: 'BHM', wordCount: 3400, httpStatus: 200 },
    { id: 'page-p02', url: '/placements/recruiters', title: 'Top Recruiters', changeStatus: 'unchanged', lastCrawled: '05 Sep 2026, 03:00 PM', course: 'BHM', wordCount: 1200, httpStatus: 200 },
  ],
};

const changeStatusOrder = { new: 0, updated: 1, deleted: 2, unchanged: 3 };

function formatWordCount(n: number): string {
  if (n === 0) return '—';
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

export default function CrawlPageIndex({ jobId }: { jobId: string }) {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [page, setPage] = useState(1);
  const perPage = 8;

  const pages = PAGES_BY_JOB[jobId] || [];

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return pages
      .filter((p) => {
        const matchSearch =
          p.url.toLowerCase().includes(q) ||
          p.title.toLowerCase().includes(q) ||
          p.course.toLowerCase().includes(q);
        const matchStatus =
          filterStatus === 'all' || p.changeStatus === filterStatus;
        return matchSearch && matchStatus;
      })
      .sort(
        (a, b) =>
          changeStatusOrder[a.changeStatus] - changeStatusOrder[b.changeStatus]
      );
  }, [pages, search, filterStatus]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const pageRows = filtered.slice((page - 1) * perPage, page * perPage);

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { new: 0, updated: 0, deleted: 0, unchanged: 0 };
    pages.forEach((p) => counts[p.changeStatus]++);
    return counts;
  }, [pages]);

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      {/* Table header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-border">
        <div>
          <h2 className="text-base font-700 text-foreground">Indexed Pages</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {pages.length} pages discovered — click a crawl job above to switch view
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {/* Change status filter chips */}
          {['all', 'new', 'updated', 'deleted', 'unchanged'].map((s) => (
            <button
              key={`filter-${s}`}
              onClick={() => { setFilterStatus(s); setPage(1); }}
              className={`px-2.5 py-1 text-xs font-600 rounded-full border transition-all ${
                filterStatus === s
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-card text-muted-foreground border-border hover:border-primary/50'
              }`}
            >
              {s === 'all' ? `All (${pages.length})` : `${s.charAt(0).toUpperCase() + s.slice(1)} (${statusCounts[s]})`}
            </button>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="px-5 py-3 border-b border-border">
        <div className="relative max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by URL, title, or course..."
            className="pl-8 pr-4 py-1.5 text-sm border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary w-full transition-colors"
          />
        </div>
      </div>

      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              {['Page URL / Title', 'Change', 'Course', 'HTTP', 'Words', 'Last Crawled', 'Actions'].map((h) => (
                <th
                  key={`pagecol-${h}`}
                  className="px-4 py-3 text-left text-xs font-700 text-muted-foreground uppercase tracking-wider whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageRows.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center">
                  <p className="text-sm font-600 text-foreground">No pages match your filter</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Try clearing the search or changing the status filter
                  </p>
                </td>
              </tr>
            ) : (
              pageRows.map((row, i) => (
                <tr
                  key={row.id}
                  className={`border-b border-border last:border-0 hover:bg-muted/40 transition-colors group ${
                    i % 2 === 0 ? '' : 'bg-muted/10'
                  } ${row.changeStatus === 'deleted' ? 'opacity-60' : ''}`}
                >
                  <td className="px-4 py-3 max-w-[280px]">
                    <p className="text-sm font-600 text-foreground truncate">{row.title}</p>
                    <p className="text-xs text-muted-foreground truncate font-mono">
                      {row.url}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={row.changeStatus} />
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground whitespace-nowrap">
                    {row.course}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs font-700 font-tabular ${
                        row.httpStatus === 200 ? 'text-success' : 'text-danger'
                      }`}
                    >
                      {row.httpStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground font-tabular whitespace-nowrap">
                    {formatWordCount(row.wordCount)}
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                    {row.lastCrawled}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <a
                        href={`https://iihm.ac.in${row.url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-primary transition-colors"
                        title="Open page in new tab"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink size={13} />
                      </a>
                      <button
                        className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                        title="Re-crawl this page now"
                      >
                        <RefreshCw size={13} />
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
          Showing {filtered.length === 0 ? 0 : Math.min((page - 1) * perPage + 1, filtered.length)}–
          {Math.min(page * perPage, filtered.length)} of {filtered.length} pages
        </p>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="px-2.5 py-1.5 text-xs font-600 rounded-md border border-border hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Prev
          </button>
          {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((p) => (
            <button
              key={`crawlpage-${p}`}
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
            disabled={page === totalPages || totalPages === 0}
            className="px-2.5 py-1.5 text-xs font-600 rounded-md border border-border hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
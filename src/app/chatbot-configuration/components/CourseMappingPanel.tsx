'use client';

import React, { useState } from 'react';
import { Edit2, CheckCircle, AlertTriangle, Save } from 'lucide-react';
import { toast } from 'sonner';

interface CourseMapping {
  id: string;
  course: string;
  code: string;
  sourcesCount: number;
  qaCount: number;
  urlsCount: number;
  lastUpdated: string;
  status: 'mapped' | 'partial' | 'unmapped';
  branches: string[];
}

const COURSE_MAPPINGS: CourseMapping[] = [
  { id: 'cm-001', course: 'Bachelor of Hotel Management', code: 'BHM', sourcesCount: 48, qaCount: 312, urlsCount: 8, lastUpdated: '07 Sep 2026', status: 'mapped', branches: ['Kolkata', 'Mumbai', 'Delhi', 'Bangalore', 'Chennai'] },
  { id: 'cm-002', course: 'MBA in Hotel Management', code: 'MBA-HM', sourcesCount: 34, qaCount: 198, urlsCount: 5, lastUpdated: '06 Sep 2026', status: 'mapped', branches: ['Kolkata', 'Mumbai'] },
  { id: 'cm-003', course: 'B.Sc Hotel & Hospitality Admin', code: 'B.Sc HHA', sourcesCount: 29, qaCount: 145, urlsCount: 4, lastUpdated: '01 Sep 2026', status: 'mapped', branches: ['Kolkata', 'Delhi'] },
  { id: 'cm-004', course: 'Diploma in Culinary Arts', code: 'Diploma', sourcesCount: 22, qaCount: 88, urlsCount: 2, lastUpdated: '25 Aug 2026', status: 'partial', branches: ['Mumbai'] },
  { id: 'cm-005', course: 'PG Diploma in Hospitality Mgmt', code: 'PG Dipl.', sourcesCount: 17, qaCount: 64, urlsCount: 3, lastUpdated: '20 Aug 2026', status: 'partial', branches: ['Kolkata'] },
  { id: 'cm-006', course: 'Certificate in Food & Beverage', code: 'Cert.', sourcesCount: 11, qaCount: 42, urlsCount: 1, lastUpdated: '15 Aug 2026', status: 'mapped', branches: ['Delhi', 'Chennai'] },
  { id: 'cm-007', course: 'International Culinary Program', code: 'ICP', sourcesCount: 0, qaCount: 0, urlsCount: 0, lastUpdated: '—', status: 'unmapped', branches: [] },
  { id: 'cm-008', course: 'Short-term Bakery Program', code: 'SBP', sourcesCount: 0, qaCount: 0, urlsCount: 0, lastUpdated: '—', status: 'unmapped', branches: [] },
];

const statusConfig = {
  mapped: { label: 'Fully Mapped', icon: <CheckCircle size={14} />, color: 'text-success' },
  partial: { label: 'Partially Mapped', icon: <AlertTriangle size={14} />, color: 'text-warning' },
  unmapped: { label: 'Not Mapped', icon: <AlertTriangle size={14} />, color: 'text-danger' },
};

export default function CourseMappingPanel() {
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    // Backend integration point: PUT /api/chatbot-config/course-mapping
    await new Promise((r) => setTimeout(r, 900));
    setIsSaving(false);
    toast.success('Course mapping configuration saved');
  };

  return (
    <div className="space-y-4">
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-base font-700 text-foreground">Course Knowledge Mapping</h2>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-success inline-block" />
              Fully mapped
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-warning inline-block" />
              Partial
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-danger inline-block" />
              Unmapped
            </span>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mb-4">
          Each course must be mapped to its knowledge sources so VidyaGPT can provide course-specific responses without cross-contamination
        </p>

        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                {['Course', 'Code', 'Status', 'Files', 'Q&A Pairs', 'URLs', 'Branches', 'Last Updated', ''].map((h) => (
                  <th
                    key={`cmapcol-${h}`}
                    className="px-3 py-2.5 text-left text-xs font-700 text-muted-foreground uppercase tracking-wider whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {COURSE_MAPPINGS.map((row, i) => {
                const sc = statusConfig[row.status];
                return (
                  <tr
                    key={row.id}
                    className={`border-b border-border last:border-0 hover:bg-muted/40 transition-colors group ${
                      i % 2 === 0 ? '' : 'bg-muted/10'
                    }`}
                  >
                    <td className="px-3 py-3">
                      <p className="text-sm font-600 text-foreground">{row.course}</p>
                    </td>
                    <td className="px-3 py-3">
                      <span className="text-xs font-700 font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded">
                        {row.code}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <span className={`flex items-center gap-1 text-xs font-600 ${sc.color}`}>
                        {sc.icon}
                        {sc.label}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-sm font-tabular text-foreground">
                      {row.sourcesCount > 0 ? row.sourcesCount : <span className="text-danger">0</span>}
                    </td>
                    <td className="px-3 py-3 text-sm font-tabular text-foreground">
                      {row.qaCount > 0 ? row.qaCount : <span className="text-danger">0</span>}
                    </td>
                    <td className="px-3 py-3 text-sm font-tabular text-foreground">
                      {row.urlsCount > 0 ? row.urlsCount : <span className="text-danger">0</span>}
                    </td>
                    <td className="px-3 py-3">
                      {row.branches.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {row.branches.slice(0, 2).map((b) => (
                            <span
                              key={`branch-${row.id}-${b}`}
                              className="text-xs bg-secondary text-secondary-foreground px-1.5 py-0.5 rounded"
                            >
                              {b}
                            </span>
                          ))}
                          {row.branches.length > 2 && (
                            <span className="text-xs text-muted-foreground">
                              +{row.branches.length - 2}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-danger">None</span>
                      )}
                    </td>
                    <td className="px-3 py-3 text-xs text-muted-foreground whitespace-nowrap">
                      {row.lastUpdated}
                    </td>
                    <td className="px-3 py-3">
                      <button
                        className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors opacity-0 group-hover:opacity-100"
                        title="Edit course mapping"
                      >
                        <Edit2 size={13} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={isSaving}
        className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm font-700 rounded-lg hover:bg-primary/90 transition-all active:scale-95 disabled:opacity-70 min-w-[160px] justify-center"
      >
        {isSaving ? (
          <>
            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            Saving...
          </>
        ) : (
          <>
            <Save size={14} />
            Save Mapping
          </>
        )}
      </button>
    </div>
  );
}
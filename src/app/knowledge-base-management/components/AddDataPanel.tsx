'use client';

import React, { useState, useRef } from 'react';
import { Globe, FileText, MessageSquare, AlignLeft, Link2, Search, Upload, Plus, X, CheckCircle, AlertCircle, RefreshCw, Trash2, ToggleLeft, ToggleRight, Info } from 'lucide-react';
import { toast } from 'sonner';

const COURSES = ['All Courses', 'BHM', 'MBA-HM', 'B.Sc HHA', 'Diploma', 'PG Diploma', 'Certificate'];
const BRANCHES = ['All Branches', 'Kolkata', 'Mumbai', 'Delhi', 'Bengaluru', 'Hyderabad'];
const ACADEMIC_YEARS = ['2026-27', '2025-26', '2024-25'];
const ACCEPTED_TYPES = '.pdf,.xlsx,.xls,.docx,.doc,.csv';
const ACCEPTED_MIME = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/msword',
  'text/csv',
];

type SourceTab = 'url' | 'crawl' | 'file' | 'qa' | 'text';

interface PendingFile {
  id: string;
  file: File;
  error?: string;
}

interface QAEntry {
  id: string;
  question: string;
  answer: string;
}

const SOURCE_TABS: { key: SourceTab; label: string; icon: React.ReactNode; desc: string }[] = [
  { key: 'url', label: 'Web URL', icon: <Link2 size={15} />, desc: 'Add specific page URLs' },
  { key: 'crawl', label: 'Website Crawl', icon: <Globe size={15} />, desc: 'Crawl entire website' },
  { key: 'file', label: 'Files & Docs', icon: <FileText size={15} />, desc: 'PDF, Excel, Word, CSV' },
  { key: 'qa', label: 'Q&A Pairs', icon: <MessageSquare size={15} />, desc: 'Manual or bulk Q&A' },
  { key: 'text', label: 'Manual Text', icon: <AlignLeft size={15} />, desc: 'Paste raw content' },
];

function CourseMappingFields({
  course, setCourse, branch, setBranch, academicYear, setAcademicYear
}: {
  course: string; setCourse: (v: string) => void;
  branch: string; setBranch: (v: string) => void;
  academicYear: string; setAcademicYear: (v: string) => void;
}) {
  return (
    <div className="grid grid-cols-3 gap-3 pt-1">
      <div>
        <label className="block text-xs font-600 text-foreground mb-1">Course / Program</label>
        <select value={course} onChange={e => setCourse(e.target.value)}
          className="w-full px-3 py-2 text-sm border border-input rounded-lg bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary">
          {COURSES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-xs font-600 text-foreground mb-1">Branch / Campus</label>
        <select value={branch} onChange={e => setBranch(e.target.value)}
          className="w-full px-3 py-2 text-sm border border-input rounded-lg bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary">
          {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-xs font-600 text-foreground mb-1">Academic Year</label>
        <select value={academicYear} onChange={e => setAcademicYear(e.target.value)}
          className="w-full px-3 py-2 text-sm border border-input rounded-lg bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary">
          {ACADEMIC_YEARS.map(y => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>
    </div>
  );
}

function URLPanel() {
  const [urls, setUrls] = useState('');
  const [course, setCourse] = useState('All Courses');
  const [branch, setBranch] = useState('All Branches');
  const [academicYear, setAcademicYear] = useState('2026-27');
  const [isAdding, setIsAdding] = useState(false);

  const urlList = urls.split('\n').map(u => u.trim()).filter(Boolean);

  const handleAdd = async () => {
    if (!urlList.length) return;
    setIsAdding(true);
    await new Promise(r => setTimeout(r, 1200));
    setIsAdding(false);
    setUrls('');
    toast.success(`${urlList.length} URL${urlList.length > 1 ? 's' : ''} added to knowledge base`);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-600 text-foreground mb-1.5">Enter URL List</label>
        <p className="text-xs text-muted-foreground mb-2">One URL per line. Supports specific pages or sub-pages.</p>
        <textarea
          value={urls}
          onChange={e => setUrls(e.target.value)}
          rows={5}
          placeholder={'https://iihm.ac.in/admissions\nhttps://iihm.ac.in/fees\nhttps://iihm.ac.in/hostel'}
          className="w-full px-3 py-2.5 text-sm border border-input rounded-lg bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none font-mono"
        />
        <p className="text-xs text-muted-foreground mt-1">URLs should be newline separated</p>
      </div>
      <CourseMappingFields course={course} setCourse={setCourse} branch={branch} setBranch={setBranch} academicYear={academicYear} setAcademicYear={setAcademicYear} />
      <div className="flex items-center gap-3 pt-1">
        <button
          onClick={handleAdd}
          disabled={!urlList.length || isAdding}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground text-sm font-700 rounded-lg hover:bg-primary/90 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isAdding ? (
            <><RefreshCw size={14} className="animate-spin" /> Adding URLs...</>
          ) : (
            <><Plus size={14} /> Add {urlList.length > 0 ? urlList.length : ''} URL{urlList.length !== 1 ? 's' : ''}</>
          )}
        </button>
        {urlList.length > 0 && (
          <span className="text-xs text-muted-foreground">{urlList.length} URL{urlList.length !== 1 ? 's' : ''} detected</span>
        )}
      </div>
    </div>
  );
}

function CrawlPanel() {
  const [rootUrl, setRootUrl] = useState('');
  const [autoSync, setAutoSync] = useState(true);
  const [course, setCourse] = useState('All Courses');
  const [branch, setBranch] = useState('All Branches');
  const [academicYear, setAcademicYear] = useState('2026-27');
  const [isCrawling, setIsCrawling] = useState(false);
  const [crawlStarted, setCrawlStarted] = useState(false);

  const handleCrawl = async () => {
    if (!rootUrl.trim()) return;
    setIsCrawling(true);
    await new Promise(r => setTimeout(r, 2000));
    setIsCrawling(false);
    setCrawlStarted(true);
    toast.success('Website crawl started — pages will be indexed automatically');
  };

  return (
    <div className="space-y-4">
      {crawlStarted && (
        <div className="flex items-start gap-3 p-3.5 bg-success-muted border border-success/20 rounded-xl slide-up">
          <CheckCircle size={16} className="text-success flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-600 text-success">Crawl job started</p>
            <p className="text-xs text-success/80 mt-0.5">VidyaGPT is discovering and indexing pages from {rootUrl}. Check Website Crawl Management for progress.</p>
          </div>
        </div>
      )}
      <div>
        <label className="block text-xs font-600 text-foreground mb-1.5">Root Website URL</label>
        <input
          type="url"
          value={rootUrl}
          onChange={e => setRootUrl(e.target.value)}
          placeholder="https://iihm.ac.in"
          className="w-full px-3 py-2.5 text-sm border border-input rounded-lg bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
        />
        <p className="text-xs text-muted-foreground mt-1">VidyaGPT will auto-discover all internal pages and sub-pages</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-muted/40 border border-border rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-600 text-foreground">Auto-Sync</p>
            <button onClick={() => setAutoSync(!autoSync)} className={`flex items-center gap-1.5 text-xs font-600 transition-colors ${autoSync ? 'text-success' : 'text-muted-foreground'}`}>
              {autoSync ? <ToggleRight size={22} /> : <ToggleLeft size={22} />}
              {autoSync ? 'Enabled' : 'Disabled'}
            </button>
          </div>
          <p className="text-xs text-muted-foreground">Automatically detect new, updated, and deleted pages. Only reprocess changed content.</p>
        </div>
        <div className="bg-muted/40 border border-border rounded-xl p-4">
          <p className="text-sm font-600 text-foreground mb-2">Smart Detection</p>
          <div className="space-y-1">
            {['New pages', 'Updated content', 'Deleted pages', 'Unchanged pages'].map(item => (
              <div key={item} className="flex items-center gap-2">
                <CheckCircle size={12} className="text-success" />
                <span className="text-xs text-muted-foreground">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <CourseMappingFields course={course} setCourse={setCourse} branch={branch} setBranch={setBranch} academicYear={academicYear} setAcademicYear={setAcademicYear} />

      <button
        onClick={handleCrawl}
        disabled={!rootUrl.trim() || isCrawling}
        className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground text-sm font-700 rounded-lg hover:bg-primary/90 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isCrawling ? (
          <><RefreshCw size={14} className="animate-spin" /> Starting Crawl...</>
        ) : (
          <><Search size={14} /> Start Website Crawl</>
        )}
      </button>
    </div>
  );
}

function FilePanel() {
  const [pendingFiles, setPendingFiles] = useState<PendingFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [course, setCourse] = useState('All Courses');
  const [branch, setBranch] = useState('All Branches');
  const [academicYear, setAcademicYear] = useState('2026-27');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | undefined => {
    if (!ACCEPTED_MIME.includes(file.type) && !file.name.endsWith('.csv')) {
      return 'Unsupported format. Accepted: PDF, Excel, Word, CSV';
    }
    if (file.size > 20 * 1024 * 1024) return 'File exceeds 20 MB limit';
    return undefined;
  };

  const addFiles = (files: FileList | File[]) => {
    const arr = Array.from(files);
    const newPending: PendingFile[] = arr.map((f, idx) => ({
      id: `pf-${Date.now()}-${idx}`,
      file: f,
      error: validateFile(f),
    }));
    setPendingFiles(prev => [...prev, ...newPending]);
  };

  const validFiles = pendingFiles.filter(f => !f.error);

  const handleUpload = async () => {
    if (!validFiles.length) return;
    setIsUploading(true);
    await new Promise(r => setTimeout(r, 2000));
    setIsUploading(false);
    setPendingFiles([]);
    toast.success(`${validFiles.length} file${validFiles.length > 1 ? 's' : ''} uploaded and queued for processing`);
  };

  return (
    <div className="space-y-4">
      <div className="bg-muted/40 border border-border rounded-xl p-3">
        <p className="text-xs font-600 text-foreground mb-2">Supported Formats</p>
        <div className="flex flex-wrap gap-2">
          {[
            { label: 'PDF', color: 'bg-danger-muted text-danger border-danger/20' },
            { label: 'Excel (.xlsx/.xls)', color: 'bg-success-muted text-success border-success/20' },
            { label: 'Word (.docx/.doc)', color: 'bg-info-muted text-info border-info/20' },
            { label: 'CSV', color: 'bg-warning-muted text-warning border-warning/20' },
            { label: 'Brochure (PDF)', color: 'bg-secondary text-secondary-foreground border-primary/20' },
          ].map(f => (
            <span key={f.label} className={`text-xs font-600 px-2 py-0.5 rounded-full border ${f.color}`}>{f.label}</span>
          ))}
        </div>
      </div>

      <div
        onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={e => { e.preventDefault(); setIsDragging(false); addFiles(e.dataTransfer.files); }}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-150 ${isDragging ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50 hover:bg-muted/30'}`}
      >
        <input ref={fileInputRef} type="file" multiple accept={ACCEPTED_TYPES} onChange={e => { if (e.target.files) addFiles(e.target.files); }} className="hidden" />
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
          <Upload size={22} className="text-primary" />
        </div>
        <p className="text-sm font-600 text-foreground">Drop files here or click to browse</p>
        <p className="text-xs text-muted-foreground mt-1">PDF, Excel, Word, CSV — up to 20 MB each</p>
      </div>

      {pendingFiles.length > 0 && (
        <div className="space-y-2">
          {pendingFiles.map(pf => (
            <div key={pf.id} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg border ${pf.error ? 'border-danger/20 bg-danger-muted' : 'border-border bg-muted/30'}`}>
              {pf.error ? <AlertCircle size={14} className="text-danger flex-shrink-0" /> : <FileText size={14} className="text-primary flex-shrink-0" />}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-500 text-foreground truncate">{pf.file.name}</p>
                {pf.error ? (
                  <p className="text-xs text-danger mt-0.5">{pf.error}</p>
                ) : (
                  <p className="text-xs text-muted-foreground mt-0.5">{(pf.file.size / 1024 / 1024).toFixed(2)} MB</p>
                )}
              </div>
              <button onClick={() => setPendingFiles(prev => prev.filter(f => f.id !== pf.id))} className="p-1 rounded hover:bg-border text-muted-foreground hover:text-danger transition-colors">
                <X size={13} />
              </button>
            </div>
          ))}
        </div>
      )}

      <CourseMappingFields course={course} setCourse={setCourse} branch={branch} setBranch={setBranch} academicYear={academicYear} setAcademicYear={setAcademicYear} />

      <button
        onClick={handleUpload}
        disabled={!validFiles.length || isUploading}
        className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground text-sm font-700 rounded-lg hover:bg-primary/90 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isUploading ? (
          <><RefreshCw size={14} className="animate-spin" /> Uploading...</>
        ) : (
          <><Upload size={14} /> Upload {validFiles.length > 0 ? validFiles.length : ''} File{validFiles.length !== 1 ? 's' : ''}</>
        )}
      </button>
    </div>
  );
}

function QAPanel() {
  const [mode, setMode] = useState<'manual' | 'bulk'>('manual');
  const [entries, setEntries] = useState<QAEntry[]>([{ id: 'new-1', question: '', answer: '' }]);
  const [course, setCourse] = useState('All Courses');
  const [branch, setBranch] = useState('All Branches');
  const [academicYear, setAcademicYear] = useState('2026-27');
  const [isSaving, setIsSaving] = useState(false);
  const [bulkFile, setBulkFile] = useState<File | null>(null);
  const bulkRef = useRef<HTMLInputElement>(null);

  const addEntry = () => setEntries(prev => [...prev, { id: `new-${Date.now()}`, question: '', answer: '' }]);
  const removeEntry = (id: string) => setEntries(prev => prev.filter(e => e.id !== id));
  const updateEntry = (id: string, field: 'question' | 'answer', value: string) => {
    setEntries(prev => prev.map(e => e.id === id ? { ...e, [field]: value } : e));
  };

  const validEntries = entries.filter(e => e.question.trim() && e.answer.trim());

  const handleSave = async () => {
    if (!validEntries.length) return;
    setIsSaving(true);
    await new Promise(r => setTimeout(r, 1000));
    setIsSaving(false);
    setEntries([{ id: 'new-1', question: '', answer: '' }]);
    toast.success(`${validEntries.length} Q&A pair${validEntries.length > 1 ? 's' : ''} added`);
  };

  const handleBulkUpload = async () => {
    if (!bulkFile) return;
    setIsSaving(true);
    await new Promise(r => setTimeout(r, 1500));
    setIsSaving(false);
    setBulkFile(null);
    toast.success('Q&A pairs imported from file — pending review');
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {(['manual', 'bulk'] as const).map(m => (
          <button key={m} onClick={() => setMode(m)}
            className={`px-4 py-2 text-sm font-600 rounded-lg transition-all ${mode === m ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'}`}>
            {m === 'manual' ? 'Add Manually' : 'Bulk Upload (Excel/CSV)'}
          </button>
        ))}
      </div>

      {mode === 'manual' ? (
        <div className="space-y-3">
          {entries.map((entry, idx) => (
            <div key={entry.id} className="bg-muted/30 border border-border rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-700 text-muted-foreground uppercase tracking-wider">Q&A #{idx + 1}</span>
                {entries.length > 1 && (
                  <button onClick={() => removeEntry(entry.id)} className="p-1 rounded hover:bg-danger-muted text-muted-foreground hover:text-danger transition-colors">
                    <Trash2 size={13} />
                  </button>
                )}
              </div>
              <div>
                <label className="block text-xs font-600 text-foreground mb-1">Question</label>
                <textarea value={entry.question} onChange={e => updateEntry(entry.id, 'question', e.target.value)} rows={2}
                  placeholder="What is the total fee for BHM course?"
                  className="w-full px-3 py-2 text-sm border border-input rounded-lg bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none" />
              </div>
              <div>
                <label className="block text-xs font-600 text-foreground mb-1">Answer</label>
                <textarea value={entry.answer} onChange={e => updateEntry(entry.id, 'answer', e.target.value)} rows={3}
                  placeholder="The total fee for BHM at IIHM Kolkata is ₹4,80,000..."
                  className="w-full px-3 py-2 text-sm border border-input rounded-lg bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none" />
              </div>
            </div>
          ))}
          <button onClick={addEntry} className="flex items-center gap-1.5 text-sm font-600 text-primary hover:text-primary/80 transition-colors">
            <Plus size={14} /> Add Another Q&A
          </button>
          <CourseMappingFields course={course} setCourse={setCourse} branch={branch} setBranch={setBranch} academicYear={academicYear} setAcademicYear={setAcademicYear} />
          <button onClick={handleSave} disabled={!validEntries.length || isSaving}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground text-sm font-700 rounded-lg hover:bg-primary/90 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">
            {isSaving ? <><RefreshCw size={14} className="animate-spin" /> Saving...</> : <><CheckCircle size={14} /> Save {validEntries.length > 0 ? validEntries.length : ''} Q&A Pair{validEntries.length !== 1 ? 's' : ''}</>}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-info-muted border border-info/20 rounded-xl p-4">
            <div className="flex items-start gap-2">
              <Info size={14} className="text-info flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-600 text-info">Excel/CSV Format</p>
                <p className="text-xs text-info/80 mt-0.5">Your file must have columns: <strong>question</strong>, <strong>answer</strong>, <strong>course</strong> (optional), <strong>intent</strong> (optional)</p>
              </div>
            </div>
          </div>
          <div
            onClick={() => bulkRef.current?.click()}
            className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer hover:border-primary/50 hover:bg-muted/30 transition-all">
            <input ref={bulkRef} type="file" accept=".xlsx,.xls,.csv" onChange={e => setBulkFile(e.target.files?.[0] || null)} className="hidden" />
            {bulkFile ? (
              <div className="flex items-center justify-center gap-2">
                <FileText size={16} className="text-primary" />
                <span className="text-sm font-600 text-foreground">{bulkFile.name}</span>
                <button onClick={e => { e.stopPropagation(); setBulkFile(null); }} className="p-1 rounded hover:bg-danger-muted text-muted-foreground hover:text-danger">
                  <X size={13} />
                </button>
              </div>
            ) : (
              <>
                <Upload size={22} className="text-primary mx-auto mb-2" />
                <p className="text-sm font-600 text-foreground">Upload Excel or CSV file</p>
                <p className="text-xs text-muted-foreground mt-1">Click to browse</p>
              </>
            )}
          </div>
          <CourseMappingFields course={course} setCourse={setCourse} branch={branch} setBranch={setBranch} academicYear={academicYear} setAcademicYear={setAcademicYear} />
          <button onClick={handleBulkUpload} disabled={!bulkFile || isSaving}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground text-sm font-700 rounded-lg hover:bg-primary/90 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">
            {isSaving ? <><RefreshCw size={14} className="animate-spin" /> Importing...</> : <><Upload size={14} /> Import Q&A Pairs</>}
          </button>
        </div>
      )}
    </div>
  );
}

function TextPanel() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [course, setCourse] = useState('All Courses');
  const [branch, setBranch] = useState('All Branches');
  const [academicYear, setAcademicYear] = useState('2026-27');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) return;
    setIsSaving(true);
    await new Promise(r => setTimeout(r, 1000));
    setIsSaving(false);
    setTitle('');
    setContent('');
    toast.success('Manual text content added to knowledge base');
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-600 text-foreground mb-1.5">Content Title</label>
        <input type="text" value={title} onChange={e => setTitle(e.target.value)}
          placeholder="e.g. IIHM Kolkata Hostel Information 2026"
          className="w-full px-3 py-2.5 text-sm border border-input rounded-lg bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
      </div>
      <div>
        <label className="block text-xs font-600 text-foreground mb-1.5">Content</label>
        <p className="text-xs text-muted-foreground mb-2">Paste or type the knowledge content. VidyaGPT will use this to answer student queries.</p>
        <textarea value={content} onChange={e => setContent(e.target.value)} rows={8}
          placeholder="IIHM Kolkata provides separate hostel facilities for male and female students. Monthly charges range from ₹8,000 to ₹12,000 depending on room type..."
          className="w-full px-3 py-2.5 text-sm border border-input rounded-lg bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none" />
        <p className="text-xs text-muted-foreground mt-1">{content.length} characters</p>
      </div>
      <CourseMappingFields course={course} setCourse={setCourse} branch={branch} setBranch={setBranch} academicYear={academicYear} setAcademicYear={setAcademicYear} />
      <button onClick={handleSave} disabled={!title.trim() || !content.trim() || isSaving}
        className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground text-sm font-700 rounded-lg hover:bg-primary/90 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">
        {isSaving ? <><RefreshCw size={14} className="animate-spin" /> Saving...</> : <><CheckCircle size={14} /> Add to Knowledge Base</>}
      </button>
    </div>
  );
}

export default function AddDataPanel() {
  const [activeSource, setActiveSource] = useState<SourceTab>('url');

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-border">
        <h2 className="text-base font-700 text-foreground">Add Knowledge Data</h2>
        <p className="text-xs text-muted-foreground mt-0.5">Choose a source type to add content to VidyaGPT&apos;s knowledge base</p>
      </div>

      {/* Source type tabs */}
      <div className="flex border-b border-border overflow-x-auto scrollbar-thin">
        {SOURCE_TABS.map(tab => (
          <button key={tab.key} onClick={() => setActiveSource(tab.key)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-600 border-b-2 transition-all duration-150 whitespace-nowrap flex-shrink-0 ${
              activeSource === tab.key
                ? 'border-primary text-primary bg-primary/3' :'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
            }`}>
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Panel content */}
      <div className="p-5">
        {activeSource === 'url' && <URLPanel />}
        {activeSource === 'crawl' && <CrawlPanel />}
        {activeSource === 'file' && <FilePanel />}
        {activeSource === 'qa' && <QAPanel />}
        {activeSource === 'text' && <TextPanel />}
      </div>
    </div>
  );
}

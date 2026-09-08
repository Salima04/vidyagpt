import React from 'react';
import { Upload, Search } from 'lucide-react';
import { KBTab } from './KnowledgeBasePage';

interface KBHeaderProps {
  onUpload: () => void;
  search: string;
  onSearch: (v: string) => void;
  activeTab: KBTab;
}

const tabLabels: Record<KBTab, string> = {
  files: 'files, brochures & PDFs',
  urls: 'URLs',
  qa: 'Q&A pairs',
};

export default function KBHeader({
  onUpload,
  search,
  onSearch,
  activeTab,
}: KBHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
      <div>
        <h1 className="text-2xl font-700 text-foreground">
          Knowledge Base Management
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Search and manage {tabLabels[activeTab]} powering VidyaGPT
        </p>
      </div>
      <div className="flex items-center gap-2.5">
        <div className="relative">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search by name, course, content..."
            className="pl-9 pr-4 py-2 text-sm border border-input rounded-lg bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary w-64 transition-colors"
          />
        </div>
        <button
          onClick={onUpload}
          className="flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground text-sm font-700 rounded-lg hover:bg-primary/90 transition-all duration-150 active:scale-95 whitespace-nowrap"
        >
          <Upload size={15} />
          Upload Data
        </button>
      </div>
    </div>
  );
}
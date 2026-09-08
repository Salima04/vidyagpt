import React from 'react';
import { Plus } from 'lucide-react';

export default function CrawlHeader({ onAddCrawl }: { onAddCrawl: () => void }) {
  return (
    <div className="flex items-center justify-between mb-5">
      <div>
        <h1 className="text-2xl font-700 text-foreground">Website Crawl Management</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Crawl and auto-sync your institute website to keep VidyaGPT&apos;s knowledge current
        </p>
      </div>
      <button
        onClick={onAddCrawl}
        className="flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground text-sm font-700 rounded-lg hover:bg-primary/90 transition-all active:scale-95"
      >
        <Plus size={15} />
        Add Website URL
      </button>
    </div>
  );
}
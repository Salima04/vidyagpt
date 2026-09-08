'use client';

import React, { useState } from 'react';
import CrawlHeader from './CrawlHeader';
import AddCrawlModal from './AddCrawlModal';
import CrawlJobCards from './CrawlJobCards';
import CrawlPageIndex from './CrawlPageIndex';

export default function WebsiteCrawlPage() {
  const [addOpen, setAddOpen] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<string>('crawl-001');

  return (
    <div className="px-6 lg:px-8 xl:px-10 py-6 max-w-screen-2xl mx-auto">
      <CrawlHeader onAddCrawl={() => setAddOpen(true)} />
      <CrawlJobCards
        selectedJobId={selectedJobId}
        onSelectJob={setSelectedJobId}
      />
      <CrawlPageIndex jobId={selectedJobId} />
      <AddCrawlModal isOpen={addOpen} onClose={() => setAddOpen(false)} />
    </div>
  );
}
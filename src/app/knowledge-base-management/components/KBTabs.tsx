import React from 'react';
import { FileText, Globe, MessageSquare } from 'lucide-react';
import { KBTab } from './KnowledgeBasePage';

const tabs: { key: KBTab; label: string; icon: React.ReactNode; count: number }[] = [
  { key: 'files', label: 'Files & Documents', icon: <FileText size={15} />, count: 134 },
  { key: 'urls', label: 'URLs & Web Sources', icon: <Globe size={15} />, count: 29 },
  { key: 'qa', label: 'Q&A Pairs', icon: <MessageSquare size={15} />, count: 1384 },
];

export default function KBTabs({
  activeTab,
  onTabChange,
}: {
  activeTab: KBTab;
  onTabChange: (t: KBTab) => void;
}) {
  return (
    <div className="flex border-b border-border gap-0">
      {tabs.map((tab) => (
        <button
          key={`tab-${tab.key}`}
          onClick={() => onTabChange(tab.key)}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-600 border-b-2 transition-all duration-150 ${
            activeTab === tab.key
              ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
          }`}
        >
          {tab.icon}
          {tab.label}
          <span
            className={`text-xs rounded-full px-1.5 py-0.5 ${
              activeTab === tab.key
                ? 'bg-primary/10 text-primary' :'bg-muted text-muted-foreground'
            }`}
          >
            {tab.count.toLocaleString()}
          </span>
        </button>
      ))}
    </div>
  );
}
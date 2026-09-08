'use client';

import React, { useState, useEffect } from 'react';
import { Building2, ChevronRight, Database, Plus, List, Settings2, LayoutGrid } from 'lucide-react';
import { useRouter } from 'next/navigation';
import AddDataPanel from './AddDataPanel';
import KnowledgeListTable from './KnowledgeListTable';
import AIConfigPanel from './AIConfigPanel';

const ACTIVE_PROPERTY_KEY = 'vidyagpt_active_property';
const STORAGE_KEY = 'vidyagpt_properties';

interface StoredProperty {
  id: string;
  collegeName: string;
  alias: string;
  propertyId: string;
}

function loadActiveProperty(): StoredProperty | null {
  if (typeof window === 'undefined') return null;
  try {
    const activeId = localStorage.getItem(ACTIVE_PROPERTY_KEY);
    if (!activeId) return null;
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    const list: StoredProperty[] = JSON.parse(stored);
    return list.find((p) => p.id === activeId) ?? null;
  } catch {
    return null;
  }
}

type MainTab = 'add' | 'list' | 'ai-config';

const MAIN_TABS: { key: MainTab; label: string; icon: React.ReactNode; desc: string }[] = [
  { key: 'add', label: 'Add Data', icon: <Plus size={15} />, desc: 'Add new knowledge sources' },
  { key: 'list', label: 'Knowledge List', icon: <List size={15} />, desc: 'View & manage all sources' },
  { key: 'ai-config', label: 'AI Configuration', icon: <Settings2 size={15} />, desc: 'Greeting, guardrails & settings' },
];

const STATS = [
  { label: 'Total Sources', value: '16', icon: <Database size={16} className="text-primary" />, bg: 'bg-primary/8 border-primary/20' },
  { label: 'Active', value: '11', icon: <LayoutGrid size={16} className="text-success" />, bg: 'bg-success-muted border-success/20' },
  { label: 'Conflicts', value: '2', icon: <LayoutGrid size={16} className="text-danger" />, bg: 'bg-danger-muted border-danger/20' },
  { label: 'Stale', value: '3', icon: <LayoutGrid size={16} className="text-warning" />, bg: 'bg-warning-muted border-warning/20' },
];

export default function KnowledgeBasePage() {
  const [activeTab, setActiveTab] = useState<MainTab>('add');
  const [activeProperty, setActiveProperty] = useState<StoredProperty | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setActiveProperty(loadActiveProperty());
    setHydrated(true);
  }, []);

  if (!hydrated) {
    return (
      <div className="px-6 lg:px-8 xl:px-10 py-6 max-w-screen-2xl mx-auto">
        <div className="h-10 w-64 bg-muted animate-pulse rounded-lg mb-4" />
        <div className="h-64 bg-muted animate-pulse rounded-xl" />
      </div>
    );
  }

  if (!activeProperty) {
    return (
      <div className="px-6 lg:px-8 xl:px-10 py-6 max-w-screen-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-700 text-foreground">Knowledge Base Management</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage all knowledge sources powering VidyaGPT
          </p>
        </div>
        <div className="flex flex-col items-center justify-center py-20 px-6">
          <div className="bg-card border border-border rounded-2xl shadow-sm p-10 flex flex-col items-center max-w-md w-full text-center">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
              <Building2 size={32} className="text-primary" />
            </div>
            <h2 className="text-lg font-700 text-foreground mb-2">No Property Selected</h2>
            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
              Select an active property before managing knowledge sources, uploading files, or configuring AI settings.
            </p>
            <button
              onClick={() => router.push('/properties')}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground text-sm font-700 rounded-xl hover:bg-primary/90 transition-all duration-150 active:scale-95"
            >
              <Building2 size={15} />
              Go to Properties
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 lg:px-8 xl:px-10 py-6 max-w-screen-2xl mx-auto">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <h1 className="text-2xl font-700 text-foreground">Knowledge Base Management</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Add, update, and manage all knowledge sources for VidyaGPT
          </p>
          {/* Active property pill */}
          <div className="flex items-center gap-1.5 mt-2 px-3 py-1.5 bg-primary/8 border border-primary/20 rounded-lg text-xs font-600 text-primary w-fit">
            <Building2 size={12} />
            {activeProperty.alias}
            <span className="text-primary/60 font-400">— {activeProperty.collegeName}</span>
          </div>
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-2 flex-wrap">
          {STATS.map(stat => (
            <div key={stat.label} className={`flex items-center gap-2 px-3 py-2 rounded-xl border ${stat.bg}`}>
              {stat.icon}
              <div>
                <p className="text-xs font-700 text-foreground leading-none">{stat.value}</p>
                <p className="text-xs text-muted-foreground leading-none mt-0.5">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main navigation tabs */}
      <div className="flex border-b border-border gap-0 mb-6">
        {MAIN_TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-5 py-3.5 text-sm font-600 border-b-2 transition-all duration-150 ${
              activeTab === tab.key
                ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div>
        {activeTab === 'add' && <AddDataPanel />}
        {activeTab === 'list' && <KnowledgeListTable />}
        {activeTab === 'ai-config' && (
          <AIConfigPanel
            propertyId={activeProperty.propertyId}
            propertyAlias={activeProperty.alias}
          />
        )}
      </div>
    </div>
  );
}
const KBTab: React.FC = () => {
  React.useEffect(() => {
    // eslint-disable-next-line no-console
    console.warn('Placeholder: KBTab is not implemented yet.');
  }, []);
  return (
    <div>
      {/* KBTab placeholder */}
    </div>
  );
};

export { KBTab };
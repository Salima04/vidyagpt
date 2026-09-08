'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Plus, Search, Building2, ChevronDown, Check, X, Filter } from 'lucide-react';
import { toast } from 'sonner';
import AddPropertyModal from './AddPropertyModal';
import PropertyTable from './PropertyTable';

export interface Property {
  id: string;
  collegeName: string;
  alias: string;
  propertyId: string;
  createdAt: Date;
  status: 'active' | 'inactive';
  enabled: boolean;
}

function generatePropertyId(): string {
  const prefix = 'PROP';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

const INITIAL_PROPERTIES: Property[] = [
  {
    id: '1',
    collegeName: 'International Institute of Hotel Management',
    alias: 'IIHM-KOL',
    propertyId: 'PROP-LX3K2A-B7F',
    createdAt: new Date('2024-11-15T09:30:00'),
    status: 'active',
    enabled: true,
  },
  {
    id: '2',
    collegeName: 'IIHM Delhi Campus',
    alias: 'IIHM-DEL',
    propertyId: 'PROP-LX3K2B-C8G',
    createdAt: new Date('2024-12-01T14:20:00'),
    status: 'active',
    enabled: true,
  },
  {
    id: '3',
    collegeName: 'IIHM Mumbai Campus',
    alias: 'IIHM-MUM',
    propertyId: 'PROP-LX3K2C-D9H',
    createdAt: new Date('2025-01-10T11:00:00'),
    status: 'active',
    enabled: true,
  },
];

const STORAGE_KEY = 'vidyagpt_properties';
const ACTIVE_PROPERTY_KEY = 'vidyagpt_active_property';

function loadProperties(): Property[] {
  if (typeof window === 'undefined') return INITIAL_PROPERTIES;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.map((p: Property & { createdAt: string }) => ({
        ...p,
        createdAt: new Date(p.createdAt),
      }));
    }
  } catch {}
  return INITIAL_PROPERTIES;
}

function saveProperties(properties: Property[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(properties));
}

function loadActivePropertyId(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(ACTIVE_PROPERTY_KEY);
}

function saveActivePropertyId(id: string) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(ACTIVE_PROPERTY_KEY, id);
}

// Searchable Select Property Dropdown
interface SelectPropertyDropdownProps {
  properties: Property[];
  activeProperty: Property | null;
  onSelect: (property: Property) => void;
}

function SelectPropertyDropdown({ properties, activeProperty, onSelect }: SelectPropertyDropdownProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = properties.filter(
    (p) =>
      p.collegeName.toLowerCase().includes(query.toLowerCase()) ||
      p.alias.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery('');
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2.5 px-3.5 py-2.5 bg-card border border-border rounded-xl text-sm font-500 text-foreground hover:border-primary/50 hover:bg-secondary/30 transition-all duration-150 min-w-[260px] max-w-[340px]"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
          <Building2 size={13} className="text-primary" />
        </div>
        <div className="flex-1 text-left min-w-0">
          {activeProperty ? (
            <>
              <span className="block text-sm font-600 text-foreground truncate leading-tight">
                {activeProperty.alias}
              </span>
              <span className="block text-xs text-muted-foreground truncate leading-tight">
                {activeProperty.collegeName}
              </span>
            </>
          ) : (
            <span className="text-muted-foreground">Select a property…</span>
          )}
        </div>
        <ChevronDown
          size={15}
          className={`text-muted-foreground flex-shrink-0 transition-transform duration-150 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1.5 w-80 bg-card border border-border rounded-xl shadow-xl z-50 overflow-hidden fade-in">
          {/* Search input */}
          <div className="p-2 border-b border-border">
            <div className="relative">
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name or alias…"
                className="w-full pl-8 pr-3 py-2 text-sm bg-muted rounded-lg border-0 outline-none text-foreground placeholder:text-muted-foreground"
              />
              {query && (
                <button onClick={() => setQuery('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  <X size={12} />
                </button>
              )}
            </div>
          </div>

          {/* Options */}
          <ul className="max-h-56 overflow-y-auto scrollbar-thin py-1" role="listbox">
            {filtered.length === 0 ? (
              <li className="px-3 py-4 text-sm text-muted-foreground text-center">
                No properties match &ldquo;{query}&rdquo;
              </li>
            ) : (
              filtered.map((p) => {
                const isActive = activeProperty?.id === p.id;
                return (
                  <li key={`opt-${p.id}`} role="option" aria-selected={isActive}>
                    <button
                      onClick={() => {
                        onSelect(p);
                        setOpen(false);
                        setQuery('');
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-muted transition-colors ${
                        isActive ? 'bg-secondary/50' : ''
                      }`}
                    >
                      <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Building2 size={13} className="text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-600 text-foreground truncate">{p.alias}</p>
                        <p className="text-xs text-muted-foreground truncate">{p.collegeName}</p>
                      </div>
                      {isActive && <Check size={14} className="text-primary flex-shrink-0" />}
                    </button>
                  </li>
                );
              })
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [activeProperty, setActiveProperty] = useState<Property | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      const loaded = loadProperties();
      setProperties(loaded);
      const activeId = loadActivePropertyId();
      if (activeId) {
        const found = loaded.find((p) => p.id === activeId);
        if (found) setActiveProperty(found);
        else if (loaded.length > 0) {
          setActiveProperty(loaded[0]);
          saveActivePropertyId(loaded[0].id);
        }
      } else if (loaded.length > 0) {
        setActiveProperty(loaded[0]);
        saveActivePropertyId(loaded[0].id);
      }
      setLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const handleSelectProperty = useCallback((property: Property) => {
    setActiveProperty(property);
    saveActivePropertyId(property.id);
    toast.success(`Switched to ${property.alias}`, { duration: 2000 });
  }, []);

  const handleAddProperty = useCallback(
    (collegeName: string, alias: string) => {
      const newProp: Property = {
        id: Date.now().toString(),
        collegeName,
        alias,
        propertyId: generatePropertyId(),
        createdAt: new Date(),
        status: 'active',
        enabled: true,
      };
      setProperties((prev) => {
        const updated = [newProp, ...prev];
        saveProperties(updated);
        return updated;
      });
      setActiveProperty(newProp);
      saveActivePropertyId(newProp.id);
      setShowModal(false);
      toast.success(`Property "${alias}" created and selected`, {
        description: `Property ID: ${newProp.propertyId}`,
        duration: 4000,
      });
    },
    []
  );

  const handleDeleteProperty = useCallback(
    (id: string) => {
      setProperties((prev) => {
        const updated = prev.filter((p) => p.id !== id);
        saveProperties(updated);
        if (activeProperty?.id === id) {
          const next = updated[0] ?? null;
          setActiveProperty(next);
          if (next) saveActivePropertyId(next.id);
          else localStorage.removeItem(ACTIVE_PROPERTY_KEY);
        }
        return updated;
      });
    },
    [activeProperty]
  );

  const handleToggleProperty = useCallback((id: string, enabled: boolean) => {
    setProperties((prev) => {
      const updated = prev.map((p) => (p.id === id ? { ...p, enabled } : p));
      saveProperties(updated);
      return updated;
    });
    toast.success(enabled ? 'Property enabled' : 'Property disabled', { duration: 2000 });
  }, []);

  const filteredProperties = properties.filter(
    (p) =>
      p.collegeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.alias.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.propertyId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const existingAliases = properties.map((p) => p.alias.toLowerCase());

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Page Header */}
      <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-sm border-b border-border px-6 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-xl font-700 text-foreground">Manage Properties</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Each property represents a college or campus with its own AI knowledge base.
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground text-sm font-600 rounded-xl hover:bg-primary/90 transition-all duration-150 active:scale-95 shadow-sm flex-shrink-0"
          >
            <Plus size={16} />
            Add Property
          </button>
        </div>
      </div>

      <div className="flex-1 px-6 py-5 space-y-5">
        {/* Active Property Selector */}
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex-1">
              <p className="text-xs font-600 text-muted-foreground uppercase tracking-wider mb-1.5">
                Active Property
              </p>
              {loading ? (
                <div className="h-10 w-64 bg-muted animate-pulse rounded-xl" />
              ) : (
                <SelectPropertyDropdown
                  properties={properties}
                  activeProperty={activeProperty}
                  onSelect={handleSelectProperty}
                />
              )}
            </div>
            {activeProperty && !loading && (
              <div className="flex items-center gap-4 text-sm">
                <div className="px-3 py-1.5 bg-success/10 rounded-lg">
                  <span className="text-xs font-600 text-success uppercase tracking-wide">Active</span>
                </div>
                <div className="text-right hidden sm:block">
                  <p className="text-xs text-muted-foreground">Property ID</p>
                  <p className="text-xs font-600 text-foreground font-mono">{activeProperty.propertyId}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by college name, alias, or property ID…"
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-card border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X size={14} />
              </button>
            )}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground px-1">
            <Filter size={14} />
            <span>
              {loading ? '—' : `${filteredProperties.length} of ${properties.length}`} properties
            </span>
          </div>
        </div>

        {/* Property Table */}
        <PropertyTable
          properties={filteredProperties}
          activePropertyId={activeProperty?.id ?? null}
          loading={loading}
          searchQuery={searchQuery}
          onSelect={handleSelectProperty}
          onDelete={handleDeleteProperty}
          onToggle={handleToggleProperty}
          onAddProperty={() => setShowModal(true)}
        />
      </div>

      {/* Add Property Modal */}
      {showModal && (
        <AddPropertyModal
          existingAliases={existingAliases}
          onClose={() => setShowModal(false)}
          onSubmit={handleAddProperty}
        />
      )}
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { Building2, Trash2, CheckCircle2, Clock, MousePointerClick, Plus } from 'lucide-react';
import { Property } from './PropertiesPage';
import ConfirmModal from '@/components/ui/ConfirmModal';

interface PropertyTableProps {
  properties: Property[];
  activePropertyId: string | null;
  loading: boolean;
  searchQuery: string;
  onSelect: (property: Property) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string, enabled: boolean) => void;
  onAddProperty: () => void;
}

function formatDate(date: Date): string {
  const d = date;
  const day = d.getDate().toString().padStart(2, '0');
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const month = months[d.getMonth()];
  const year = d.getFullYear();
  const hours = d.getHours().toString().padStart(2, '0');
  const mins = d.getMinutes().toString().padStart(2, '0');
  return `${day} ${month} ${year}, ${hours}:${mins}`;
}

function SkeletonRow() {
  return (
    <tr className="border-b border-border">
      {[1, 2, 3, 4, 5, 6, 7].map((i) => (
        <td key={`sk-${i}`} className="px-4 py-3.5">
          <div className="h-4 bg-muted animate-pulse rounded-md" style={{ width: `${60 + i * 8}%` }} />
        </td>
      ))}
    </tr>
  );
}

const TABLE_HEADERS = ['College Name', 'Alias', 'Property ID', 'Created', 'Status', 'Enable', 'Actions'];

function TableHead() {
  return (
    <thead>
      <tr className="border-b border-border bg-muted/40">
        {TABLE_HEADERS.map((h) => (
          <th key={`th-${h}`} className="px-4 py-3 text-left text-xs font-600 text-muted-foreground uppercase tracking-wider whitespace-nowrap">
            {h}
          </th>
        ))}
      </tr>
    </thead>
  );
}

export default function PropertyTable({
  properties,
  activePropertyId,
  loading,
  searchQuery,
  onSelect,
  onDelete,
  onToggle,
  onAddProperty,
}: PropertyTableProps) {
  const [deleteTarget, setDeleteTarget] = useState<Property | null>(null);

  if (loading) {
    return (
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <TableHead />
          <tbody>
            {[1, 2, 3].map((i) => <SkeletonRow key={`sk-row-${i}`} />)}
          </tbody>
        </table>
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="bg-card border border-border rounded-xl">
        <table className="w-full text-sm">
          <TableHead />
        </table>
        <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
          <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mb-4">
            <Building2 size={24} className="text-muted-foreground" />
          </div>
          {searchQuery ? (
            <>
              <p className="text-base font-600 text-foreground mb-1">No results found</p>
              <p className="text-sm text-muted-foreground mb-4">
                No properties match &ldquo;{searchQuery}&rdquo;. Try a different search term.
              </p>
            </>
          ) : (
            <>
              <p className="text-base font-600 text-foreground mb-1">No properties yet</p>
              <p className="text-sm text-muted-foreground mb-4">
                Add your first property to get started with VidyaGPT.
              </p>
              <button
                onClick={onAddProperty}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground text-sm font-600 rounded-xl hover:bg-primary/90 transition-all duration-150 active:scale-95"
              >
                <Plus size={15} />
                Add Property
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <TableHead />
            <tbody>
              {properties.map((property) => {
                const isActive = property.id === activePropertyId;
                const isEnabled = property.enabled !== false;
                return (
                  <tr
                    key={`row-${property.id}`}
                    className={`border-b border-border last:border-0 transition-colors ${
                      isActive ? 'bg-secondary/30' : 'hover:bg-muted/40'
                    }`}
                  >
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          isActive ? 'bg-primary/15' : 'bg-muted'
                        }`}>
                          <Building2 size={13} className={isActive ? 'text-primary' : 'text-muted-foreground'} />
                        </div>
                        <span className={`font-500 ${isActive ? 'text-foreground font-600' : 'text-foreground'}`}>
                          {property.collegeName}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="inline-flex items-center px-2.5 py-1 bg-muted rounded-lg text-xs font-600 text-foreground font-mono">
                        {property.alias}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-xs font-mono text-muted-foreground">{property.propertyId}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Clock size={12} />
                        <span className="text-xs whitespace-nowrap">{formatDate(property.createdAt)}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      {property.status === 'active' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-success/10 text-success text-xs font-600 rounded-full">
                          <CheckCircle2 size={11} />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-muted text-muted-foreground text-xs font-600 rounded-full">
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3.5">
                      <button
                        role="switch"
                        aria-checked={isEnabled}
                        onClick={() => onToggle(property.id, !isEnabled)}
                        title={isEnabled ? 'Disable property' : 'Enable property'}
                        className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/30 ${
                          isEnabled ? 'bg-primary' : 'bg-muted-foreground/30'
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${
                            isEnabled ? 'translate-x-4' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1.5">
                        {!isActive ? (
                          <button
                            onClick={() => onSelect(property)}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-600 text-primary bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors"
                            title="Set as active property"
                          >
                            <MousePointerClick size={12} />
                            Select
                          </button>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-600 text-success bg-success/10 rounded-lg">
                            <CheckCircle2 size={12} />
                            Selected
                          </span>
                        )}
                        <button
                          onClick={() => setDeleteTarget(property)}
                          className="p-1.5 text-muted-foreground hover:text-danger hover:bg-danger/10 rounded-lg transition-colors"
                          title="Delete property"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmModal
        isOpen={deleteTarget !== null}
        title="Delete Property"
        description={
          deleteTarget
            ? `Are you sure you want to delete "${deleteTarget.collegeName}" (${deleteTarget.alias})? This will remove all associated knowledge base data and cannot be undone.`
            : ''
        }
        confirmLabel="Delete Property"
        isDestructive={true}
        onConfirm={() => {
          if (deleteTarget) {
            onDelete(deleteTarget.id);
            setDeleteTarget(null);
          }
        }}
        onClose={() => setDeleteTarget(null)}
      />
    </>
  );
}

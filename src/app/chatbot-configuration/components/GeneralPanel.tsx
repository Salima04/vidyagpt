'use client';

import React, { useState } from 'react';
import { Copy, Trash2, Plus, Check } from 'lucide-react';
import ConfirmModal from '@/components/ui/ConfirmModal';
import { toast } from 'sonner';

interface PropertyID {
  id: string;
  propertyId: string;
  label: string;
  domain: string;
  createdOn: string;
  status: 'active' | 'inactive';
}

const PROPERTY_IDS: PropertyID[] = [
  { id: 'prop-001', propertyId: 'VG-IIHM-KOL-2026', label: 'IIHM Kolkata Website', domain: 'iihm.ac.in', createdOn: '01 Jan 2026', status: 'active' },
  { id: 'prop-002', propertyId: 'VG-IIHM-MUM-2026', label: 'IIHM Mumbai Microsite', domain: 'mumbai.iihm.ac.in', createdOn: '15 Mar 2026', status: 'active' },
  { id: 'prop-003', propertyId: 'VG-IIHM-DEL-2025', label: 'IIHM Delhi (Legacy)', domain: 'delhi.iihm.ac.in', createdOn: '10 Aug 2025', status: 'inactive' },
];

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
      title="Copy Property ID"
    >
      {copied ? <Check size={13} className="text-success" /> : <Copy size={13} />}
    </button>
  );
}

export default function GeneralPanel() {
  const [props, setProps] = useState(PROPERTY_IDS);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    await new Promise((r) => setTimeout(r, 900));
    setProps((prev) => prev.filter((p) => p.id !== deleteTarget));
    setIsDeleting(false);
    setDeleteTarget(null);
    toast.success('Property ID removed from configuration');
  };

  const deleteTargetProp = props.find((p) => p.id === deleteTarget);

  return (
    <div className="space-y-5">
      {/* Institute info */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h2 className="text-base font-700 text-foreground mb-4">Institute Information</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-600 text-muted-foreground uppercase tracking-wider mb-1">
              Institute Name
            </label>
            <p className="text-sm font-600 text-foreground">
              International Institute of Hotel Management
            </p>
          </div>
          <div>
            <label className="block text-xs font-600 text-muted-foreground uppercase tracking-wider mb-1">
              Primary Campus
            </label>
            <p className="text-sm font-600 text-foreground">Kolkata</p>
          </div>
          <div>
            <label className="block text-xs font-600 text-muted-foreground uppercase tracking-wider mb-1">
              Admin Email
            </label>
            <p className="text-sm text-foreground">arjun.mehta@iihm.ac.in</p>
          </div>
          <div>
            <label className="block text-xs font-600 text-muted-foreground uppercase tracking-wider mb-1">
              VidyaGPT Plan
            </label>
            <span className="inline-flex items-center px-2.5 py-0.5 bg-primary/10 text-primary text-xs font-700 rounded-full">
              Institute Pro
            </span>
          </div>
        </div>
      </div>

      {/* Property IDs */}
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-700 text-foreground">Property IDs</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Each Property ID links a domain to VidyaGPT&apos;s knowledge base
            </p>
          </div>
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground text-xs font-700 rounded-lg hover:bg-primary/90 transition-all active:scale-95">
            <Plus size={13} />
            Add Property ID
          </button>
        </div>

        <div className="space-y-2.5">
          {props.map((prop) => (
            <div
              key={prop.id}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${
                prop.status === 'inactive' ?'border-border bg-muted/30 opacity-70' :'border-border bg-card'
              }`}
            >
              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${prop.status === 'active' ? 'bg-success' : 'bg-muted-foreground'}`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-700 text-foreground font-mono">
                    {prop.propertyId}
                  </p>
                  {prop.status === 'inactive' && (
                    <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                      Inactive
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {prop.label} — {prop.domain} — Added {prop.createdOn}
                </p>
              </div>
              <CopyButton text={prop.propertyId} />
              <button
                onClick={() => setDeleteTarget(prop.id)}
                className="p-1.5 rounded-md hover:bg-danger-muted text-muted-foreground hover:text-danger transition-colors"
                title="Delete this Property ID — chatbot will stop responding on this domain"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Property ID"
        description={`Deleting "${deleteTargetProp?.propertyId}" will immediately disconnect VidyaGPT from "${deleteTargetProp?.domain}". Students visiting that domain will no longer receive AI responses. This action cannot be undone.`}
        confirmLabel="Delete Property ID"
        isDestructive
        isLoading={isDeleting}
      />
    </div>
  );
}
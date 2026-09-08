'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, Building2, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

interface AddPropertyModalProps {
  existingAliases: string[];
  onClose: () => void;
  onSubmit: (collegeName: string, alias: string) => void;
}

function sanitizeAlias(value: string): string {
  return value.toUpperCase().replace(/[^A-Z0-9-]/g, '');
}

export default function AddPropertyModal({
  existingAliases,
  onClose,
  onSubmit,
}: AddPropertyModalProps) {
  const [collegeName, setCollegeName] = useState('');
  const [alias, setAlias] = useState('');
  const [collegeNameTouched, setCollegeNameTouched] = useState(false);
  const [aliasTouched, setAliasTouched] = useState(false);
  const [saving, setSaving] = useState(false);
  const collegeNameRef = useRef<HTMLInputElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (collegeNameRef.current) {
      collegeNameRef.current.focus();
    }
  }, []);

  // Validation
  const collegeNameError = collegeNameTouched && collegeName.trim().length === 0
    ? 'College name is required'
    : collegeNameTouched && collegeName.trim().length < 3
    ? 'Must be at least 3 characters'
    : null;

  const aliasError = aliasTouched && alias.trim().length === 0
    ? 'Alias is required'
    : aliasTouched && alias.trim().length < 2
    ? 'Must be at least 2 characters'
    : aliasTouched && existingAliases.includes(alias.toLowerCase())
    ? 'This alias is already taken'
    : null;

  const aliasDuplicate = alias.trim().length >= 2 && existingAliases.includes(alias.toLowerCase());
  const aliasValid = alias.trim().length >= 2 && !aliasDuplicate;
  const collegeNameValid = collegeName.trim().length >= 3;

  const canSubmit = collegeNameValid && aliasValid && !saving;

  const handleAliasChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setAlias(sanitizeAlias(e.target.value));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCollegeNameTouched(true);
    setAliasTouched(true);
    if (!canSubmit) return;
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    onSubmit(collegeName.trim(), alias.trim());
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) {
      onClose();
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 backdrop-blur-sm p-4"
    >
      <div className="bg-card w-full max-w-md rounded-2xl shadow-2xl border border-border fade-in slide-up">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
              <Building2 size={18} className="text-primary" />
            </div>
            <div>
              <h2 className="text-base font-700 text-foreground">Add Property</h2>
              <p className="text-xs text-muted-foreground">Create a new college or campus property</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={saving}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-50"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {/* College Name */}
          <div>
            <label className="block text-sm font-600 text-foreground mb-1.5">
              College Name <span className="text-danger">*</span>
            </label>
            <input
              ref={collegeNameRef}
              type="text"
              value={collegeName}
              onChange={(e) => setCollegeName(e.target.value)}
              onBlur={() => setCollegeNameTouched(true)}
              disabled={saving}
              placeholder="e.g. International Institute of Hotel Management"
              className={`w-full px-3.5 py-2.5 text-sm border rounded-xl bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 transition-colors disabled:opacity-60 ${
                collegeNameError
                  ? 'border-danger focus:ring-danger/20 focus:border-danger'
                  : collegeNameValid && collegeNameTouched
                  ? 'border-success focus:ring-success/20 focus:border-success' :'border-input focus:ring-primary/20 focus:border-primary'
              }`}
            />
            {collegeNameError && (
              <p className="flex items-center gap-1.5 text-xs text-danger mt-1.5">
                <AlertCircle size={12} />
                {collegeNameError}
              </p>
            )}
          </div>

          {/* Alias */}
          <div>
            <label className="block text-sm font-600 text-foreground mb-1.5">
              Alias <span className="text-danger">*</span>
            </label>
            <p className="text-xs text-muted-foreground mb-1.5">
              Short unique identifier (uppercase letters, numbers, hyphens only)
            </p>
            <div className="relative">
              <input
                type="text"
                value={alias}
                onChange={handleAliasChange}
                onBlur={() => setAliasTouched(true)}
                disabled={saving}
                placeholder="e.g. IIHM-KOL"
                maxLength={20}
                className={`w-full px-3.5 py-2.5 pr-9 text-sm border rounded-xl bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 transition-colors font-mono disabled:opacity-60 ${
                  aliasError
                    ? 'border-danger focus:ring-danger/20 focus:border-danger'
                    : aliasValid
                    ? 'border-success focus:ring-success/20 focus:border-success' :'border-input focus:ring-primary/20 focus:border-primary'
                }`}
              />
              {alias.length > 0 && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {aliasDuplicate ? (
                    <AlertCircle size={15} className="text-danger" />
                  ) : aliasValid ? (
                    <CheckCircle2 size={15} className="text-success" />
                  ) : null}
                </div>
              )}
            </div>
            {aliasError && (
              <p className="flex items-center gap-1.5 text-xs text-danger mt-1.5">
                <AlertCircle size={12} />
                {aliasError}
              </p>
            )}
            {aliasDuplicate && !aliasTouched && (
              <p className="flex items-center gap-1.5 text-xs text-danger mt-1.5">
                <AlertCircle size={12} />
                This alias is already taken
              </p>
            )}
            {aliasValid && (
              <p className="flex items-center gap-1.5 text-xs text-success mt-1.5">
                <CheckCircle2 size={12} />
                Alias is available
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="flex-1 py-2.5 text-sm font-600 text-muted-foreground bg-muted hover:bg-muted/80 rounded-xl transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!canSubmit}
              className="flex-1 py-2.5 text-sm font-700 text-primary-foreground bg-primary hover:bg-primary/90 rounded-xl transition-all duration-150 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  Creating…
                </>
              ) : (
                'Create Property'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { Link2, Save } from 'lucide-react';
import { toast } from 'sonner';

interface CitationSetting {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
}

const INITIAL_SETTINGS: CitationSetting[] = [
  {
    id: 'cite-show-source',
    label: 'Show Source Reference in Responses',
    description: 'Every VidyaGPT response will include the name of the knowledge source it used (e.g. "Source: BHM Admissions Brochure 2026-27"). Students can verify the information.',
    enabled: true,
  },
  {
    id: 'cite-redirect-main',
    label: 'Redirect Trained URLs to Main Website',
    description: 'When a specific sub-page URL is referenced in a response, the link shown to students will redirect to the main website homepage (iihm.ac.in) instead of the exact trained URL.',
    enabled: true,
  },
  {
    id: 'cite-show-doc-link',
    label: 'Show Document Download Link',
    description: 'For responses sourced from PDFs or brochures, include a download link so students can access the full document.',
    enabled: false,
  },
  {
    id: 'cite-confidence-score',
    label: 'Show Confidence Indicator',
    description: 'Display a subtle confidence indicator (High / Medium) alongside responses to signal how closely the answer matches the knowledge source.',
    enabled: false,
  },
];

export default function CitationsPanel() {
  const [settings, setSettings] = useState(INITIAL_SETTINGS);
  const [fallbackText, setFallbackText] = useState(
    "I don't have verified information to answer this accurately. Please contact our admissions team directly at admissions@iihm.ac.in or call +91 33 4000 5000 for accurate guidance."
  );
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved'>('idle');

  const toggleSetting = (id: string) => {
    setSettings((prev) =>
      prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s))
    );
    setSaveStatus('idle');
  };

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 900));
    setIsSaving(false);
    setSaveStatus('saved');
    toast.success('Citation settings saved');
    setTimeout(() => setSaveStatus('idle'), 3000);
  };

  return (
    <div className="space-y-5">
      {/* Citation toggles */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h2 className="text-base font-700 text-foreground mb-1">
          Source Citation Settings
        </h2>
        <p className="text-xs text-muted-foreground mb-4">
          Control how VidyaGPT attributes knowledge sources in student-facing responses
        </p>
        <div className="space-y-4">
          {settings.map((s) => (
            <div key={s.id} className="flex items-start gap-4">
              <div className="flex-1">
                <p className="text-sm font-600 text-foreground">{s.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                  {s.description}
                </p>
              </div>
              <button
                onClick={() => toggleSetting(s.id)}
                className={`relative w-11 h-6 rounded-full transition-colors duration-200 flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-primary/30 mt-0.5 ${
                  s.enabled ? 'bg-primary' : 'bg-muted-foreground/30'
                }`}
                role="switch"
                aria-checked={s.enabled}
                title={s.enabled ? `Disable: ${s.label}` : `Enable: ${s.label}`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
                    s.enabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* No-answer fallback text */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h2 className="text-base font-700 text-foreground mb-1">
          No-Answer Fallback Message
        </h2>
        <p className="text-xs text-muted-foreground mb-3">
          This message is shown to students when VidyaGPT cannot find verified information to answer their question. Keep it helpful and direct.
        </p>
        <div className="flex items-start gap-2 mb-3 bg-info-muted border border-info/20 rounded-lg px-3 py-2">
          <Link2 size={13} className="text-info flex-shrink-0 mt-0.5" />
          <p className="text-xs text-info">
            This fallback is triggered by the No-Answer Fallback guardrail. Ensure that guardrail is enabled for this to work.
          </p>
        </div>
        <textarea
          value={fallbackText}
          onChange={(e) => { setFallbackText(e.target.value); setSaveStatus('idle'); }}
          rows={4}
          className="w-full px-3.5 py-2.5 text-sm border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none"
        />
        <p className="text-xs text-muted-foreground mt-1.5">
          Include a direct contact email or phone number so students have an immediate alternative
        </p>
      </div>

      <div className="flex items-center gap-2.5">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm font-700 rounded-lg hover:bg-primary/90 transition-all active:scale-95 disabled:opacity-70 min-w-[160px] justify-center"
        >
          {isSaving ? (
            <>
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              Saving...
            </>
          ) : saveStatus === 'saved' ? (
            <>
              <Save size={14} />
              Saved ✓
            </>
          ) : (
            <>
              <Save size={14} />
              Save Citation Settings
            </>
          )}
        </button>
      </div>
    </div>
  );
}
'use client';

import React, { useState } from 'react';
import { ShieldCheck, Save, AlertTriangle, MessageSquare, Layers, Link } from 'lucide-react';
import { toast } from 'sonner';

interface GuardrailToggle {
  id: string;
  label: string;
  description: string;
  impact: string;
  impactLevel: 'critical' | 'high' | 'medium';
  enabled: boolean;
  icon: React.ReactNode;
}

const INITIAL_GUARDRAILS: GuardrailToggle[] = [
  {
    id: 'guardrail-no-hallucination',
    label: 'No-Hallucination Mode',
    description: 'VidyaGPT will only respond using verified knowledge sources. It will never generate or infer information that is not explicitly present in the knowledge base.',
    impact: 'If disabled, the AI may generate plausible-sounding but incorrect information about fees, eligibility, or dates.',
    impactLevel: 'critical',
    enabled: true,
    icon: <ShieldCheck size={18} />,
  },
  {
    id: 'guardrail-no-answer-fallback',
    label: 'No-Answer Fallback',
    description: 'When a question cannot be answered from the knowledge base, VidyaGPT responds with a safe fallback message and offers to connect the student with a human advisor.',
    impact: 'If disabled, the AI may attempt to answer questions outside its knowledge scope, risking incorrect responses.',
    impactLevel: 'critical',
    enabled: true,
    icon: <AlertTriangle size={18} />,
  },
  {
    id: 'guardrail-multi-intent',
    label: 'Multi-Intent Handling',
    description: 'When a student asks multiple questions in one message (e.g. "fees, eligibility, and hostel"), VidyaGPT identifies all intents and provides a structured response covering each point.',
    impact: 'If disabled, only the first detected intent is answered — students asking compound questions receive incomplete responses.',
    impactLevel: 'high',
    enabled: true,
    icon: <Layers size={18} />,
  },
  {
    id: 'guardrail-source-grounded',
    label: 'Source-Grounded Responses Only',
    description: 'All responses are generated exclusively from approved knowledge sources. The AI cannot draw from general world knowledge or training data.',
    impact: 'If disabled, responses may blend institute-specific data with general AI knowledge, potentially contradicting institute policies.',
    impactLevel: 'critical',
    enabled: true,
    icon: <Link size={18} />,
  },
  {
    id: 'guardrail-conflict-pause',
    label: 'Pause Responses on Conflict',
    description: 'When conflicting information is detected across knowledge sources for a topic, VidyaGPT pauses responses on that topic and notifies the admin rather than serving potentially wrong data.',
    impact: 'If disabled, the AI will attempt to answer even when source conflicts exist — students may receive contradictory information.',
    impactLevel: 'high',
    enabled: false,
    icon: <MessageSquare size={18} />,
  },
];

const impactBadge: Record<string, string> = {
  critical: 'bg-danger-muted text-danger border border-danger/20',
  high: 'bg-warning-muted text-warning border border-warning/20',
  medium: 'bg-info-muted text-info border border-info/20',
};

export default function GuardrailsPanel() {
  const [guardrails, setGuardrails] = useState(INITIAL_GUARDRAILS);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved'>('idle');

  const toggleGuardrail = (id: string) => {
    setGuardrails((prev) =>
      prev.map((g) => (g.id === id ? { ...g, enabled: !g.enabled } : g))
    );
    setSaveStatus('idle');
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Backend integration point: PUT /api/chatbot-config/guardrails
    await new Promise((r) => setTimeout(r, 900));
    setIsSaving(false);
    setSaveStatus('saved');
    toast.success('Guardrail settings saved');
    setTimeout(() => setSaveStatus('idle'), 3000);
  };

  return (
    <div className="space-y-4">
      <div className="bg-warning-muted border border-warning/20 rounded-xl px-4 py-3 flex items-start gap-3">
        <AlertTriangle size={16} className="text-warning flex-shrink-0 mt-0.5" />
        <p className="text-sm text-warning">
          <span className="font-700">Guardrails protect students from misinformation.</span> Disabling any critical guardrail may cause VidyaGPT to serve inaccurate information. Review impact before making changes.
        </p>
      </div>

      <div className="space-y-3">
        {guardrails.map((g) => (
          <div
            key={g.id}
            className={`bg-card border rounded-xl p-5 transition-all ${
              g.enabled ? 'border-border' : 'border-border opacity-75'
            }`}
          >
            <div className="flex items-start gap-4">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  g.enabled ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'
                }`}
              >
                {g.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-700 text-foreground">{g.label}</p>
                  <span
                    className={`text-xs font-600 px-2 py-0.5 rounded-full ${impactBadge[g.impactLevel]}`}
                  >
                    {g.impactLevel.charAt(0).toUpperCase() + g.impactLevel.slice(1)} impact
                  </span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-2">
                  {g.description}
                </p>
                {!g.enabled && (
                  <div className="flex items-start gap-1.5 bg-danger-muted border border-danger/20 rounded-lg px-3 py-2">
                    <AlertTriangle size={12} className="text-danger flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-danger">{g.impact}</p>
                  </div>
                )}
              </div>
              {/* Toggle */}
              <button
                onClick={() => toggleGuardrail(g.id)}
                className={`relative w-11 h-6 rounded-full transition-colors duration-200 flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-primary/30 ${
                  g.enabled ? 'bg-success' : 'bg-muted-foreground/30'
                }`}
                role="switch"
                aria-checked={g.enabled}
                title={g.enabled ? 'Disable guardrail' : 'Enable guardrail'}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
                    g.enabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2.5 pt-1">
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
              Save Guardrail Settings
            </>
          )}
        </button>
      </div>
    </div>
  );
}
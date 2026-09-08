'use client';

import React, { useState } from 'react';
import {
  MessageSquare, Save, X, RefreshCw, AlertTriangle, Shield, BookOpen,
  Zap, CheckCircle, Info, Trash2, Eye, EyeOff
} from 'lucide-react';
import ConfirmModal from '@/components/ui/ConfirmModal';
import { toast } from 'sonner';

interface AIConfigPanelProps {
  propertyId: string;
  propertyAlias: string;
}

const GUARDRAIL_ITEMS = [
  {
    id: 'course-wise',
    icon: <BookOpen size={16} className="text-primary" />,
    title: 'Course-wise Responses',
    desc: 'Answer only from the relevant course/program knowledge. Prevents cross-course confusion.',
    enabled: true,
  },
  {
    id: 'conflict-detection',
    icon: <AlertTriangle size={16} className="text-warning" />,
    title: 'Knowledge Conflict Detection',
    desc: 'Identify conflicting information between sources and flag for admin review.',
    enabled: true,
  },
  {
    id: 'stale-detection',
    icon: <RefreshCw size={16} className="text-info" />,
    title: 'Stale Data Detection',
    desc: 'Identify outdated knowledge (30+ days without update) and warn before responding.',
    enabled: true,
  },
  {
    id: 'source-grounded',
    icon: <Shield size={16} className="text-success" />,
    title: 'Source-Grounded Answers',
    desc: 'Responses must use approved sources only. Always show source/reference with answer.',
    enabled: true,
  },
  {
    id: 'no-hallucination',
    icon: <Zap size={16} className="text-danger" />,
    title: 'No-Hallucination Guardrail',
    desc: 'Never guess or fabricate answers. Provide safe fallback or escalate to human assistance.',
    enabled: true,
  },
  {
    id: 'multi-intent',
    icon: <MessageSquare size={16} className="text-primary" />,
    title: 'Multi-Intent Handling',
    desc: 'Handle multiple intents in one question (e.g. Fees + Admission + Hostel) and answer every point in a structured format.',
    enabled: true,
  },
];

function ChatPreview({ greeting }: { greeting: string }) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'bot' | 'user'; text: string }[]>([
    { role: 'bot', text: greeting || 'Hello! How can I help you today?' },
  ]);

  const SAMPLE_RESPONSES: Record<string, string> = {
    fee: '💰 **BHM Fee Structure 2026-27**\n\nTotal fee: ₹4,80,000 (₹1,60,000/year)\n\nIncludes: Tuition, Lab, Library\nExcludes: Hostel (₹8,000–₹12,000/month)\n\n*Source: BHM Fee Structure 2026.xlsx*',
    hostel: '🏠 **Hostel & Accommodation**\n\nSeparate hostels for male/female students.\nMonthly: ₹8,000–₹12,000 (meals included)\n\n*Source: Hostel & Accommodation FAQ.pdf*',
    admission: '📋 **Admission Process**\n\n1. 10+2 with 50% aggregate\n2. Online application\n3. Merit-based selection\n4. Document verification\n\n*Source: iihm.ac.in/admissions*',
    placement: '🎓 **Placements 2025-26**\n\n94% placement rate\nAvg: ₹3.2 LPA | Highest: ₹8.4 LPA\nTop recruiters: Taj, Marriott, ITC, Hyatt\n\n*Source: Placement Report 2025-26.pdf*',
  };

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');

    const lower = userMsg.toLowerCase();
    let botReply = 'I don\'t have specific information on that. Please contact the admissions office at admissions@iihm.ac.in or call +91-33-2282-0001.';

    for (const [key, val] of Object.entries(SAMPLE_RESPONSES)) {
      if (lower.includes(key)) { botReply = val; break; }
    }

    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'bot', text: botReply }]);
    }, 800);
  };

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden flex flex-col h-[420px]">
      {/* Chat header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-primary text-primary-foreground">
        <div className="w-8 h-8 rounded-full bg-primary-foreground/20 flex items-center justify-center">
          <MessageSquare size={16} />
        </div>
        <div>
          <p className="text-sm font-700">VidyaGPT</p>
          <p className="text-xs opacity-80">IIHM Knowledge Assistant</p>
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
          <span className="text-xs opacity-80">Online</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-3 bg-muted/20">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] px-3 py-2.5 rounded-xl text-sm leading-relaxed whitespace-pre-line ${
              msg.role === 'user' ?'bg-primary text-primary-foreground rounded-br-sm' :'bg-card border border-border text-foreground rounded-bl-sm'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="flex items-center gap-2 px-3 py-3 border-t border-border bg-card">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder="Ask about fees, admission, hostel..."
          className="flex-1 px-3 py-2 text-sm border border-input rounded-lg bg-muted/30 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
        />
        <button onClick={handleSend} disabled={!input.trim()}
          className="px-3 py-2 bg-primary text-primary-foreground text-sm font-700 rounded-lg hover:bg-primary/90 transition-all active:scale-95 disabled:opacity-50">
          Send
        </button>
      </div>
    </div>
  );
}

export default function AIConfigPanel({ propertyId, propertyAlias }: AIConfigPanelProps) {
  const [greeting, setGreeting] = useState(`Hello! 👋 I'm VidyaGPT, your IIHM knowledge assistant. I can help you with information about admissions, fees, courses, hostel, placements and more. How can I assist you today?`);
  const [savedGreeting, setSavedGreeting] = useState(greeting);
  const [isSaving, setIsSaving] = useState(false);
  const [guardrails, setGuardrails] = useState(
    Object.fromEntries(GUARDRAIL_ITEMS.map(g => [g.id, g.enabled]))
  );
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showPropertyId, setShowPropertyId] = useState(false);

  const handleSaveGreeting = async () => {
    setIsSaving(true);
    await new Promise(r => setTimeout(r, 800));
    setSavedGreeting(greeting);
    setIsSaving(false);
    toast.success('Greeting message saved');
  };

  const handleSaveGuardrails = async () => {
    setIsSaving(true);
    await new Promise(r => setTimeout(r, 800));
    setIsSaving(false);
    toast.success('AI guardrails configuration saved');
  };

  const handleDeleteProperty = async () => {
    setIsDeleting(true);
    await new Promise(r => setTimeout(r, 1500));
    setIsDeleting(false);
    setShowDeleteConfirm(false);
    toast.success('Property deleted. Redirecting...');
  };

  const toggleGuardrail = (id: string) => {
    setGuardrails(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-6">
      {/* Greeting + Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Greeting editor */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-border">
            <h3 className="text-base font-700 text-foreground">Custom Greeting</h3>
            <p className="text-xs text-muted-foreground mt-0.5">First message students see when they open VidyaGPT</p>
          </div>
          <div className="p-5 space-y-4">
            <div>
              <label className="block text-xs font-600 text-foreground mb-1.5">Greeting Message</label>
              <textarea
                value={greeting}
                onChange={e => setGreeting(e.target.value)}
                rows={6}
                className="w-full px-3 py-2.5 text-sm border border-input rounded-lg bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none"
              />
              <p className="text-xs text-muted-foreground mt-1">{greeting.length} characters</p>
            </div>
            <div className="flex items-center gap-2.5">
              <button onClick={handleSaveGreeting} disabled={isSaving || greeting === savedGreeting}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm font-700 rounded-lg hover:bg-primary/90 transition-all active:scale-95 disabled:opacity-50">
                {isSaving ? <><RefreshCw size={14} className="animate-spin" /> Saving...</> : <><Save size={14} /> Save Greeting</>}
              </button>
              {greeting !== savedGreeting && (
                <button onClick={() => setGreeting(savedGreeting)}
                  className="flex items-center gap-1.5 px-4 py-2 text-sm font-600 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors">
                  <X size={14} /> Cancel
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Live preview */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <p className="text-sm font-700 text-foreground">Live Chatbot Preview</p>
            <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">Interactive</span>
          </div>
          <ChatPreview greeting={savedGreeting} />
          <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
            <Info size={11} />
            Try asking: &quot;What are the fees?&quot; or &quot;Tell me about hostel&quot;
          </p>
        </div>
      </div>

      {/* AI Guardrails */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <div>
            <h3 className="text-base font-700 text-foreground">AI Accuracy & Guardrails</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Control how VidyaGPT responds to ensure accuracy and prevent hallucinations</p>
          </div>
          <button onClick={handleSaveGuardrails}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm font-700 rounded-lg hover:bg-primary/90 transition-all active:scale-95">
            <Save size={14} /> Save Config
          </button>
        </div>
        <div className="p-5 space-y-3">
          {GUARDRAIL_ITEMS.map(item => (
            <div key={item.id}
              className={`flex items-start gap-4 p-4 rounded-xl border transition-all ${guardrails[item.id] ? 'bg-success-muted/30 border-success/20' : 'bg-muted/30 border-border'}`}>
              <div className="flex-shrink-0 mt-0.5">{item.icon}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-700 text-foreground">{item.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{item.desc}</p>
              </div>
              <button onClick={() => toggleGuardrail(item.id)}
                className={`flex-shrink-0 flex items-center gap-1.5 text-xs font-700 px-3 py-1.5 rounded-lg transition-all ${
                  guardrails[item.id]
                    ? 'bg-success text-success-foreground hover:bg-success/90'
                    : 'bg-muted text-muted-foreground hover:bg-border'
                }`}>
                {guardrails[item.id] ? <><CheckCircle size={12} /> Enabled</> : 'Disabled'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Property ID Management */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h3 className="text-base font-700 text-foreground">Property Settings</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Manage this property&apos;s configuration and access</p>
        </div>
        <div className="p-5 space-y-4">
          <div className="flex items-center justify-between p-4 bg-muted/30 border border-border rounded-xl">
            <div>
              <p className="text-xs font-600 text-muted-foreground uppercase tracking-wider mb-1">Property ID</p>
              <div className="flex items-center gap-2">
                <p className="text-sm font-700 text-foreground font-mono">
                  {showPropertyId ? propertyId : '••••••••••••'}
                </p>
                <button onClick={() => setShowPropertyId(!showPropertyId)}
                  className="p-1 rounded hover:bg-border text-muted-foreground transition-colors">
                  {showPropertyId ? <EyeOff size={13} /> : <Eye size={13} />}
                </button>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">{propertyAlias}</p>
            </div>
            <button
              onClick={() => { navigator.clipboard?.writeText(propertyId); toast.success('Property ID copied'); }}
              className="px-3 py-1.5 text-xs font-600 border border-border rounded-lg hover:bg-muted transition-colors">
              Copy ID
            </button>
          </div>

          {/* Danger zone */}
          <div className="border border-danger/20 rounded-xl overflow-hidden">
            <div className="px-4 py-3 bg-danger-muted/50 border-b border-danger/20">
              <p className="text-sm font-700 text-danger">Danger Zone</p>
            </div>
            <div className="p-4 flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-600 text-foreground">Delete Property</p>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                  Permanently deletes this property and all associated knowledge sources, Q&A pairs, crawl jobs, and AI configuration. This action cannot be undone.
                </p>
              </div>
              <button onClick={() => setShowDeleteConfirm(true)}
                className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 bg-danger text-danger-foreground text-sm font-700 rounded-lg hover:bg-danger/90 transition-all active:scale-95">
                <Trash2 size={14} /> Delete Property
              </button>
            </div>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeleteProperty}
        title="Delete Property — Are you sure?"
        description={`This will permanently delete "${propertyAlias}" and ALL associated data including ${16} knowledge sources, Q&A pairs, crawl jobs, and AI configuration. This cannot be undone.`}
        confirmLabel="Yes, Delete Property"
        isDestructive
        isLoading={isDeleting}
      />
    </div>
  );
}

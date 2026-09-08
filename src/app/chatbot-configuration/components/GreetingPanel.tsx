'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Save, Eye } from 'lucide-react';
import { toast } from 'sonner';

interface GreetingForm {
  greetingTitle: string;
  greetingMessage: string;
  botName: string;
  avatarInitials: string;
  suggestedQuestions: string;
}

export default function GreetingPanel() {
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  const { register, handleSubmit, watch, formState: { errors, isDirty } } = useForm<GreetingForm>({
    defaultValues: {
      greetingTitle: 'Welcome to IIHM Admissions Assistant',
      greetingMessage: "Hi! I'm VidyaGPT, your AI guide for IIHM admissions. Ask me anything about courses, fees, eligibility, hostel, or placements — I'll give you accurate, up-to-date answers.",
      botName: 'VidyaGPT',
      avatarInitials: 'VG',
      suggestedQuestions: "What are the BHM fees?\nHow do I apply for MBA-HM?\nIs hostel available?",
    },
  });

  const watchedValues = watch();

  const onSubmit = async (_data: GreetingForm) => {
    setIsSaving(true);
    setSaveStatus('saving');
    // Backend integration point: PUT /api/chatbot-config/greeting
    await new Promise((r) => setTimeout(r, 1000));
    setIsSaving(false);
    setSaveStatus('saved');
    toast.success('Greeting configuration saved');
    setTimeout(() => setSaveStatus('idle'), 3000);
  };

  const suggestedList = watchedValues.suggestedQuestions
    ? watchedValues.suggestedQuestions.split('\n').filter(Boolean)
    : [];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
      {/* Edit form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="bg-card border border-border rounded-xl p-5">
          <h2 className="text-base font-700 text-foreground mb-4">Greeting Configuration</h2>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-600 text-foreground mb-1.5">
                  Bot Name
                </label>
                <input
                  type="text"
                  {...register('botName', { required: 'Bot name is required' })}
                  className="w-full px-3.5 py-2.5 text-sm border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                />
                {errors.botName && (
                  <p className="text-xs text-danger mt-1">{errors.botName.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-600 text-foreground mb-1.5">
                  Avatar Initials
                </label>
                <p className="text-xs text-muted-foreground mb-1.5">
                  2 characters shown in the chat bubble
                </p>
                <input
                  type="text"
                  maxLength={2}
                  {...register('avatarInitials', { required: true, maxLength: 2 })}
                  className="w-full px-3.5 py-2.5 text-sm border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-600 text-foreground mb-1.5">
                Greeting Title
              </label>
              <input
                type="text"
                {...register('greetingTitle', { required: 'Title is required' })}
                className="w-full px-3.5 py-2.5 text-sm border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
              {errors.greetingTitle && (
                <p className="text-xs text-danger mt-1">{errors.greetingTitle.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-600 text-foreground mb-1.5">
                Greeting Message
              </label>
              <p className="text-xs text-muted-foreground mb-1.5">
                First message students see when they open the chatbot
              </p>
              <textarea
                rows={4}
                {...register('greetingMessage', { required: 'Message is required', minLength: { value: 20, message: 'Too short' } })}
                className="w-full px-3.5 py-2.5 text-sm border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none"
              />
              {errors.greetingMessage && (
                <p className="text-xs text-danger mt-1">{errors.greetingMessage.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-600 text-foreground mb-1.5">
                Suggested Questions
              </label>
              <p className="text-xs text-muted-foreground mb-1.5">
                One question per line — shown as quick-reply chips to students
              </p>
              <textarea
                rows={4}
                {...register('suggestedQuestions')}
                className="w-full px-3.5 py-2.5 text-sm border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none font-mono"
                placeholder="What are the BHM fees?&#10;How do I apply for MBA-HM?&#10;Is hostel available?"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="submit"
            disabled={isSaving || !isDirty}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm font-700 rounded-lg hover:bg-primary/90 transition-all active:scale-95 disabled:opacity-60 min-w-[140px] justify-center"
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
                Save Greeting
              </>
            )}
          </button>
          {isDirty && saveStatus === 'idle' && (
            <p className="text-xs text-warning flex items-center gap-1">
              Unsaved changes
            </p>
          )}
        </div>
      </form>

      {/* Live preview */}
      <div className="bg-card border border-border rounded-xl p-5 sticky top-6">
        <div className="flex items-center gap-2 mb-4">
          <Eye size={15} className="text-muted-foreground" />
          <h2 className="text-base font-700 text-foreground">Live Preview</h2>
          <span className="text-xs text-muted-foreground ml-auto">
            How students see it
          </span>
        </div>

        {/* Mobile chatbot mockup */}
        <div className="max-w-[280px] mx-auto">
          <div className="bg-muted rounded-2xl overflow-hidden shadow-lg border border-border">
            {/* Chat header */}
            <div className="bg-primary px-4 py-3 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <span className="text-white text-xs font-800">
                  {watchedValues.avatarInitials || 'VG'}
                </span>
              </div>
              <div>
                <p className="text-white text-sm font-700">{watchedValues.botName || 'VidyaGPT'}</p>
                <p className="text-white/60 text-xs">Online</p>
              </div>
            </div>

            {/* Chat body */}
            <div className="bg-background px-3 py-4 space-y-3 min-h-[200px]">
              {/* Bot greeting bubble */}
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-700">
                    {(watchedValues.avatarInitials || 'VG').charAt(0)}
                  </span>
                </div>
                <div className="bg-card border border-border rounded-2xl rounded-tl-none px-3 py-2.5 max-w-[200px]">
                  <p className="text-xs font-700 text-primary mb-1">
                    {watchedValues.greetingTitle || 'Welcome!'}
                  </p>
                  <p className="text-xs text-foreground leading-relaxed">
                    {watchedValues.greetingMessage || 'Hello! How can I help you?'}
                  </p>
                </div>
              </div>

              {/* Suggested chips */}
              {suggestedList.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {suggestedList.slice(0, 3).map((q, idx) => (
                    <button
                      key={`chip-${idx}`}
                      className="px-2.5 py-1 bg-primary/10 text-primary text-xs font-600 rounded-full border border-primary/20 hover:bg-primary/20 transition-colors"
                    >
                      {q.length > 28 ? q.slice(0, 28) + '…' : q}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Input bar */}
            <div className="bg-card border-t border-border px-3 py-2 flex items-center gap-2">
              <div className="flex-1 bg-muted rounded-full px-3 py-1.5">
                <p className="text-xs text-muted-foreground">Ask me anything...</p>
              </div>
              <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
                  <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
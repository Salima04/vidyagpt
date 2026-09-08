'use client';

import React, { useState } from 'react';
import { X, Globe, Plus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface AddCrawlModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface AddCrawlForm {
  rootUrl: string;
  course: string;
  branch: string;
  academicYear: string;
  syncFrequency: string;
  autoSync: boolean;
}

export default function AddCrawlModal({ isOpen, onClose }: AddCrawlModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<AddCrawlForm>({
    defaultValues: { autoSync: true, syncFrequency: 'daily' },
  });

  const onSubmit = async (data: AddCrawlForm) => {
    setIsSubmitting(true);
    // Backend integration point: POST /api/crawl-jobs with rootUrl and mapping config
    await new Promise((r) => setTimeout(r, 1500));
    setIsSubmitting(false);
    toast.success(`Crawl job added for ${data.rootUrl} — first crawl scheduled`);
    reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-sm fade-in"
      onClick={onClose}
    >
      <div
        className="bg-card rounded-xl shadow-xl border border-border w-full max-w-md mx-4 slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Globe size={16} className="text-primary" />
            </div>
            <div>
              <h2 className="text-base font-700 text-foreground">Add Website to Crawl</h2>
              <p className="text-xs text-muted-foreground">
                System will auto-discover all internal pages
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-md hover:bg-muted text-muted-foreground">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="px-5 py-4 space-y-4">
          <div>
            <label className="block text-sm font-600 text-foreground mb-1.5">
              Root Website URL
            </label>
            <p className="text-xs text-muted-foreground mb-1.5">
              Enter the main URL — VidyaGPT will crawl all internal sub-pages automatically
            </p>
            <input
              type="url"
              {...register('rootUrl', {
                required: 'URL is required',
                pattern: {
                  value: /^https?:\/\/.+/,
                  message: 'Enter a valid URL starting with https://',
                },
              })}
              className="w-full px-3.5 py-2.5 text-sm border border-input rounded-lg bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              placeholder="https://iihm.ac.in"
            />
            {errors.rootUrl && (
              <p className="text-xs text-danger mt-1">{errors.rootUrl.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-600 text-foreground mb-1.5">Course</label>
              <select
                {...register('course', { required: 'Required' })}
                className="w-full px-3 py-2 text-sm border border-input rounded-lg bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              >
                <option value="">Select</option>
                <option value="All Courses">All Courses</option>
                <option value="BHM">BHM</option>
                <option value="MBA-HM">MBA-HM</option>
                <option value="B.Sc HHA">B.Sc HHA</option>
                <option value="Diploma">Diploma</option>
              </select>
              {errors.course && <p className="text-xs text-danger mt-0.5">{errors.course.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-600 text-foreground mb-1.5">Branch</label>
              <select
                {...register('branch', { required: 'Required' })}
                className="w-full px-3 py-2 text-sm border border-input rounded-lg bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              >
                <option value="">Select</option>
                <option value="All Branches">All Branches</option>
                <option value="Kolkata">Kolkata</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Delhi">Delhi</option>
              </select>
              {errors.branch && <p className="text-xs text-danger mt-0.5">{errors.branch.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-600 text-foreground mb-1.5">Academic Year</label>
              <select
                {...register('academicYear', { required: 'Required' })}
                className="w-full px-3 py-2 text-sm border border-input rounded-lg bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              >
                <option value="">Select</option>
                <option value="2026-27">2026-27</option>
                <option value="2025-26">2025-26</option>
              </select>
              {errors.academicYear && <p className="text-xs text-danger mt-0.5">{errors.academicYear.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-600 text-foreground mb-1.5">Sync Frequency</label>
              <select
                {...register('syncFrequency')}
                className="w-full px-3 py-2 text-sm border border-input rounded-lg bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="manual">Manual only</option>
              </select>
            </div>
          </div>

          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              {...register('autoSync')}
              className="w-4 h-4 rounded border-input accent-primary"
            />
            <div>
              <p className="text-sm font-600 text-foreground">Enable Auto-Sync</p>
              <p className="text-xs text-muted-foreground">
                Automatically detect and sync changes on this website
              </p>
            </div>
          </label>

          <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-600 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm font-700 rounded-lg hover:bg-primary/90 transition-all active:scale-95 disabled:opacity-70 min-w-[140px] justify-center"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Adding crawl...
                </>
              ) : (
                <>
                  <Plus size={14} />
                  Add Crawl Job
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
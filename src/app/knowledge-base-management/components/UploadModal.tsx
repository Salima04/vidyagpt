'use client';

import React, { useState, useRef } from 'react';
import { X, Upload, FileText, AlertCircle, CheckCircle, Trash2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface UploadFormData {
  course: string;
  branch: string;
  academicYear: string;
}

const ACCEPTED_TYPES = ['.pdf', '.xlsx', '.xls', '.docx', '.doc'];
const ACCEPTED_MIME = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/msword',
];

interface PendingFile {
  id: string;
  file: File;
  error?: string;
}

export default function UploadModal({ isOpen, onClose }: UploadModalProps) {
  const [pendingFiles, setPendingFiles] = useState<PendingFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadDone, setUploadDone] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<UploadFormData>();

  const validateFile = (file: File): string | undefined => {
    if (!ACCEPTED_MIME.includes(file.type)) {
      return `Unsupported format. Accepted: PDF, Excel (.xlsx/.xls), Word (.docx/.doc)`;
    }
    if (file.size > 20 * 1024 * 1024) {
      return 'File exceeds 20 MB limit';
    }
    return undefined;
  };

  const addFiles = (files: FileList | File[]) => {
    const arr = Array.from(files);
    const newPending: PendingFile[] = arr.map((f, idx) => ({
      id: `pending-${Date.now()}-${idx}`,
      file: f,
      error: validateFile(f),
    }));
    setPendingFiles((prev) => [...prev, ...newPending]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    addFiles(e.dataTransfer.files);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) addFiles(e.target.files);
  };

  const removeFile = (id: string) => {
    setPendingFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const validFiles = pendingFiles.filter((f) => !f.error);
  const invalidFiles = pendingFiles.filter((f) => f.error);

  const onSubmit = async (data: UploadFormData) => {
    if (validFiles.length === 0) return;
    setIsUploading(true);
    // Backend integration point: POST /api/knowledge-sources/upload with FormData
    await new Promise((r) => setTimeout(r, 2000));
    setIsUploading(false);
    setUploadDone(true);
    toast.success(`${validFiles.length} file${validFiles.length > 1 ? 's' : ''} uploaded successfully`);
    setTimeout(() => {
      handleClose();
    }, 1500);
  };

  const handleClose = () => {
    setPendingFiles([]);
    setUploadDone(false);
    setIsUploading(false);
    reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-sm fade-in"
      onClick={handleClose}
    >
      <div
        className="bg-card rounded-xl shadow-xl border border-border w-full max-w-lg mx-4 slide-up max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border flex-shrink-0">
          <div>
            <h2 className="text-base font-700 text-foreground">Upload Knowledge Data</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Supported: PDF, Excel (.xlsx/.xls), Word (.docx/.doc) — max 20 MB each
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-md hover:bg-muted text-muted-foreground transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin px-5 py-4 space-y-4">
          {uploadDone ? (
            <div className="flex flex-col items-center justify-center py-10 gap-3">
              <div className="w-14 h-14 rounded-full bg-success-muted flex items-center justify-center">
                <CheckCircle size={28} className="text-success" />
              </div>
              <p className="text-base font-700 text-foreground">Upload Complete</p>
              <p className="text-sm text-muted-foreground text-center">
                {validFiles.length} file{validFiles.length > 1 ? 's' : ''} queued for processing. VidyaGPT will index them shortly.
              </p>
            </div>
          ) : (
            <>
              {/* Drop zone */}
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-150 ${
                  isDragging
                    ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50 hover:bg-muted/30'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept={ACCEPTED_TYPES.join(',')}
                  onChange={handleFileInput}
                  className="hidden"
                />
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <Upload size={22} className="text-primary" />
                </div>
                <p className="text-sm font-600 text-foreground">
                  Drop files here or click to browse
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  PDF, Excel (.xlsx/.xls), Word (.docx/.doc) — up to 20 MB each
                </p>
              </div>

              {/* File list */}
              {pendingFiles.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-700 text-muted-foreground uppercase tracking-wider">
                    Files ({pendingFiles.length})
                  </p>
                  {pendingFiles.map((pf) => (
                    <div
                      key={pf.id}
                      className={`flex items-start gap-3 px-3 py-2.5 rounded-lg border ${
                        pf.error
                          ? 'border-danger/20 bg-danger-muted' :'border-border bg-muted/30'
                      }`}
                    >
                      <div className="w-7 h-7 rounded-md bg-card flex items-center justify-center flex-shrink-0 mt-0.5">
                        {pf.error ? (
                          <AlertCircle size={14} className="text-danger" />
                        ) : (
                          <FileText size={14} className="text-primary" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-500 text-foreground truncate">
                          {pf.file.name}
                        </p>
                        {pf.error ? (
                          <p className="text-xs text-danger mt-0.5">{pf.error}</p>
                        ) : (
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {(pf.file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => removeFile(pf.id)}
                        className="p-1 rounded hover:bg-border text-muted-foreground hover:text-danger transition-colors flex-shrink-0"
                        title="Remove file"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                  {invalidFiles.length > 0 && (
                    <p className="text-xs text-danger flex items-center gap-1">
                      <AlertCircle size={12} />
                      {invalidFiles.length} file{invalidFiles.length > 1 ? 's' : ''} with errors will not be uploaded
                    </p>
                  )}
                </div>
              )}

              {/* Mapping form */}
              <form id="upload-form" onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                <p className="text-xs font-700 text-muted-foreground uppercase tracking-wider">
                  Course Mapping
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-600 text-foreground mb-1">
                      Course / Program
                    </label>
                    <select
                      {...register('course', { required: 'Select a course' })}
                      className="w-full px-3 py-2 text-sm border border-input rounded-lg bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                    >
                      <option value="">Select course</option>
                      <option value="All Courses">All Courses</option>
                      <option value="BHM">BHM</option>
                      <option value="MBA-HM">MBA-HM</option>
                      <option value="B.Sc HHA">B.Sc HHA</option>
                      <option value="Diploma">Diploma</option>
                      <option value="PG Dipl.">PG Diploma</option>
                      <option value="Cert.">Certificate</option>
                    </select>
                    {errors.course && (
                      <p className="text-xs text-danger mt-0.5">{errors.course.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-600 text-foreground mb-1">
                      Branch / Campus
                    </label>
                    <select
                      {...register('branch', { required: 'Select a branch' })}
                      className="w-full px-3 py-2 text-sm border border-input rounded-lg bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                    >
                      <option value="">Select branch</option>
                      <option value="All Branches">All Branches</option>
                      <option value="Kolkata">Kolkata</option>
                      <option value="Mumbai">Mumbai</option>
                      <option value="Delhi">Delhi</option>
                      <option value="Bangalore">Bangalore</option>
                      <option value="Chennai">Chennai</option>
                    </select>
                    {errors.branch && (
                      <p className="text-xs text-danger mt-0.5">{errors.branch.message}</p>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-600 text-foreground mb-1">
                    Academic Year
                  </label>
                  <select
                    {...register('academicYear', { required: 'Select academic year' })}
                    className="w-full px-3 py-2 text-sm border border-input rounded-lg bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  >
                    <option value="">Select year</option>
                    <option value="2026-27">2026-27</option>
                    <option value="2025-26">2025-26</option>
                    <option value="2024-25">2024-25</option>
                  </select>
                  {errors.academicYear && (
                    <p className="text-xs text-danger mt-0.5">{errors.academicYear.message}</p>
                  )}
                </div>
              </form>
            </>
          )}
        </div>

        {/* Footer */}
        {!uploadDone && (
          <div className="flex items-center justify-between px-5 py-4 border-t border-border flex-shrink-0">
            <p className="text-xs text-muted-foreground">
              {validFiles.length} valid file{validFiles.length !== 1 ? 's' : ''} ready
            </p>
            <div className="flex items-center gap-2.5">
              <button
                onClick={handleClose}
                className="px-4 py-2 text-sm font-600 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="upload-form"
                disabled={isUploading || validFiles.length === 0}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm font-700 rounded-lg hover:bg-primary/90 transition-all active:scale-95 disabled:opacity-50 min-w-[120px] justify-center"
              >
                {isUploading ? (
                  <>
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload size={14} />
                    Upload {validFiles.length > 0 ? `${validFiles.length} File${validFiles.length > 1 ? 's' : ''}` : 'Files'}
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
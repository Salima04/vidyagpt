'use client';

import React, { useState, useMemo } from 'react';
import { Plus, Edit2, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { useForm } from 'react-hook-form';
import StatusBadge from '@/components/ui/StatusBadge';
import ConfirmModal from '@/components/ui/ConfirmModal';
import { toast } from 'sonner';

interface QARecord {
  id: string;
  question: string;
  answer: string;
  course: string;
  intent: string;
  status: 'active' | 'pending';
  addedOn: string;
  addedBy: string;
}

const QA_DATA: QARecord[] = [
  { id: 'qa-001', question: 'What is the total fee for BHM course at IIHM Kolkata?', answer: 'The total fee for the 3-year BHM program at IIHM Kolkata campus is ₹4,80,000 (₹1,60,000 per year), inclusive of tuition, lab, and library fees. Hostel charges are separate.', course: 'BHM', intent: 'Fees', status: 'active', addedOn: '01 Sep 2026', addedBy: 'Arjun Mehta' },
  { id: 'qa-002', question: 'What is the eligibility criteria for BHM admission?', answer: 'Candidates must have passed 10+2 or equivalent examination from a recognized board. Minimum 50% aggregate marks required. No specific subject restriction at 10+2 level.', course: 'BHM', intent: 'Eligibility', status: 'active', addedOn: '01 Sep 2026', addedBy: 'Arjun Mehta' },
  { id: 'qa-003', question: 'Does IIHM provide hostel accommodation for students?', answer: 'Yes, IIHM Kolkata provides separate hostel facilities for male and female students within the campus. Monthly charges are ₹8,000–₹12,000 depending on room type (shared/single). Meals are included.', course: 'All Courses', intent: 'Hostel', status: 'active', addedOn: '28 Aug 2026', addedBy: 'Priya Sharma' },
  { id: 'qa-004', question: 'What are the placement statistics for IIHM graduates?', answer: 'IIHM maintains a 94% placement rate for BHM graduates. Top recruiters include Taj Hotels, Marriott, ITC Hotels, Hyatt, and Oberoi Group. Average package: ₹3.2 LPA; Highest: ₹8.4 LPA (2025-26 batch).', course: 'BHM', intent: 'Placements', status: 'active', addedOn: '25 Aug 2026', addedBy: 'Arjun Mehta' },
  { id: 'qa-005', question: 'What is the admission process for MBA-HM at IIHM?', answer: 'MBA-HM admissions are based on: 1) Graduation in any discipline with 50% marks, 2) Valid CAT/MAT/CMAT/XAT score, 3) Group Discussion, 4) Personal Interview. Applications open January each year.', course: 'MBA-HM', intent: 'Admission Process', status: 'active', addedOn: '22 Aug 2026', addedBy: 'Ravi Kumar' },
  { id: 'qa-006', question: 'Is there a scholarship for meritorious students?', answer: 'IIHM offers merit-based scholarships ranging from 10%–50% fee waiver for students scoring above 80% in qualifying exams. Additionally, sports and special category scholarships are available. Apply within 30 days of admission.', course: 'All Courses', intent: 'Fees', status: 'active', addedOn: '20 Aug 2026', addedBy: 'Arjun Mehta' },
  { id: 'qa-007', question: 'What are the fees and eligibility for Diploma in Culinary Arts?', answer: 'Pending review — answer to be updated after new curriculum confirmation.', course: 'Diploma', intent: 'Fees', status: 'pending', addedOn: '06 Sep 2026', addedBy: 'Priya Sharma' },
  { id: 'qa-008', question: 'Does IIHM have an international exchange program?', answer: 'Yes, IIHM has MoUs with hotel management institutes in Switzerland, France, and Singapore. Students in 2nd year BHM/MBA-HM can apply for a 1-semester exchange. Seats are limited (8 per year).', course: 'BHM', intent: 'General', status: 'active', addedOn: '18 Aug 2026', addedBy: 'Arjun Mehta' },
];

interface AddQAForm {
  question: string;
  answer: string;
  course: string;
  intent: string;
}

export default function QATable({ search }: { search: string }) {
  const [rows, setRows] = useState(QA_DATA);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AddQAForm>();

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return rows.filter(
      (r) =>
        r.question.toLowerCase().includes(q) ||
        r.answer.toLowerCase().includes(q) ||
        r.course.toLowerCase().includes(q) ||
        r.intent.toLowerCase().includes(q)
    );
  }, [rows, search]);

  const handleAddQA = async (data: AddQAForm) => {
    await new Promise((r) => setTimeout(r, 800));
    const newQA: QARecord = {
      id: `qa-${Date.now()}`,
      question: data.question,
      answer: data.answer,
      course: data.course,
      intent: data.intent,
      status: 'pending',
      addedOn: '07 Sep 2026',
      addedBy: 'Arjun Mehta',
    };
    setRows((prev) => [newQA, ...prev]);
    reset();
    setShowAddForm(false);
    toast.success('Q&A pair added — pending review');
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    await new Promise((r) => setTimeout(r, 900));
    setRows((prev) => prev.filter((r) => r.id !== deleteTarget));
    setIsDeleting(false);
    setDeleteTarget(null);
    toast.success('Q&A pair deleted');
  };

  const intentColors: Record<string, string> = {
    Fees: 'bg-warning-muted text-warning',
    Eligibility: 'bg-info-muted text-info',
    Hostel: 'bg-secondary text-secondary-foreground',
    Placements: 'bg-success-muted text-success',
    'Admission Process': 'bg-primary/10 text-primary',
    General: 'bg-muted text-muted-foreground',
  };

  return (
    <>
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-muted-foreground">
          {filtered.length} Q&A pairs
        </p>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-700 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all active:scale-95"
        >
          <Plus size={15} />
          Add Q&A Pair
        </button>
      </div>

      {/* Add form */}
      {showAddForm && (
        <div className="bg-card border border-primary/20 rounded-xl p-5 mb-4 slide-up">
          <h3 className="text-sm font-700 text-foreground mb-4">
            Add New Q&A Pair
          </h3>
          <form onSubmit={handleSubmit(handleAddQA)} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-600 text-foreground mb-1">
                  Course
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
                  Intent / Topic
                </label>
                <select
                  {...register('intent', { required: 'Select an intent' })}
                  className="w-full px-3 py-2 text-sm border border-input rounded-lg bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                >
                  <option value="">Select intent</option>
                  <option value="Fees">Fees</option>
                  <option value="Admission Process">Admission Process</option>
                  <option value="Eligibility">Eligibility</option>
                  <option value="Hostel">Hostel</option>
                  <option value="Placements">Placements</option>
                  <option value="General">General</option>
                </select>
                {errors.intent && (
                  <p className="text-xs text-danger mt-0.5">{errors.intent.message}</p>
                )}
              </div>
            </div>
            <div>
              <label className="block text-xs font-600 text-foreground mb-1">
                Question
              </label>
              <textarea
                {...register('question', { required: 'Question is required', minLength: { value: 10, message: 'Too short' } })}
                rows={2}
                className="w-full px-3 py-2 text-sm border border-input rounded-lg bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none"
                placeholder="Enter the student question..."
              />
              {errors.question && (
                <p className="text-xs text-danger mt-0.5">{errors.question.message}</p>
              )}
            </div>
            <div>
              <label className="block text-xs font-600 text-foreground mb-1">
                Answer
              </label>
              <p className="text-xs text-muted-foreground mb-1">
                Provide the accurate, complete answer VidyaGPT should give
              </p>
              <textarea
                {...register('answer', { required: 'Answer is required', minLength: { value: 20, message: 'Answer too short' } })}
                rows={3}
                className="w-full px-3 py-2 text-sm border border-input rounded-lg bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none"
                placeholder="Enter the verified answer..."
              />
              {errors.answer && (
                <p className="text-xs text-danger mt-0.5">{errors.answer.message}</p>
              )}
            </div>
            <div className="flex items-center gap-2.5 pt-1">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm font-700 rounded-lg hover:bg-primary/90 transition-all active:scale-95 disabled:opacity-70"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Saving...
                  </>
                ) : (
                  'Save Q&A Pair'
                )}
              </button>
              <button
                type="button"
                onClick={() => { setShowAddForm(false); reset(); }}
                className="px-4 py-2 text-sm font-600 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                {['Question', 'Course', 'Intent', 'Status', 'Added On', 'Added By', 'Actions'].map((h) => (
                  <th
                    key={`qacol-${h}`}
                    className="px-4 py-3 text-left text-xs font-700 text-muted-foreground uppercase tracking-wider whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-16 text-center">
                    <p className="text-sm font-600 text-foreground">No Q&A pairs found</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Add predefined Q&A pairs to improve VidyaGPT&apos;s accuracy on common student questions
                    </p>
                  </td>
                </tr>
              ) : (
                filtered.map((row, i) => (
                  <React.Fragment key={row.id}>
                    <tr
                      className={`border-b border-border hover:bg-muted/40 transition-colors group cursor-pointer ${i % 2 === 0 ? '' : 'bg-muted/10'}`}
                      onClick={() => setExpandedId(expandedId === row.id ? null : row.id)}
                    >
                      <td className="px-4 py-3 max-w-[320px]">
                        <div className="flex items-center gap-2">
                          {expandedId === row.id ? (
                            <ChevronUp size={14} className="text-muted-foreground flex-shrink-0" />
                          ) : (
                            <ChevronDown size={14} className="text-muted-foreground flex-shrink-0" />
                          )}
                          <p className="text-sm font-500 text-foreground truncate">
                            {row.question}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-foreground whitespace-nowrap">
                        {row.course}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-600 ${
                            intentColors[row.intent] || 'bg-muted text-muted-foreground'
                          }`}
                        >
                          {row.intent}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={row.status} />
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                        {row.addedOn}
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                        {row.addedBy}
                      </td>
                      <td className="px-4 py-3">
                        <div
                          className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                            title="Edit this Q&A pair"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(row.id)}
                            className="p-1.5 rounded-md hover:bg-danger-muted text-muted-foreground hover:text-danger transition-colors"
                            title="Delete this Q&A pair — chatbot will no longer use this answer"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                    {expandedId === row.id && (
                      <tr key={`${row.id}-expanded`} className="bg-secondary/30">
                        <td colSpan={7} className="px-10 py-3">
                          <p className="text-xs font-700 text-muted-foreground uppercase tracking-wider mb-1.5">
                            Answer
                          </p>
                          <p className="text-sm text-foreground leading-relaxed">
                            {row.answer}
                          </p>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-border bg-muted/20">
          <p className="text-xs text-muted-foreground">
            {filtered.length} Q&A pair{filtered.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Q&A Pair"
        description="This Q&A pair will be permanently removed. VidyaGPT will no longer use this predefined answer for student queries on this topic."
        confirmLabel="Delete Q&A"
        isDestructive
        isLoading={isDeleting}
      />
    </>
  );
}
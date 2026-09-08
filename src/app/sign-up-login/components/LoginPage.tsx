'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, Copy, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';
import AppLogo from '@/components/ui/AppLogo';
import { toast } from 'sonner';

interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface SignupFormData {
  instituteName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const DEMO_CREDENTIALS = [
  {
    role: 'Institute Admin',
    email: 'arjun.mehta@iihm.ac.in',
    password: 'VidyaAdmin@2026',
  },
  {
    role: 'Campus Admin',
    email: 'priya.sharma@iihm.ac.in',
    password: 'CampusAdmin@2026',
  },
];

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <button
      type="button"
      onClick={handleCopy}
      className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
      title="Copy to clipboard"
    >
      {copied ? <Check size={12} className="text-success" /> : <Copy size={12} />}
    </button>
  );
}

function LoginForm() {
  const [showPw, setShowPw] = useState(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    const valid = DEMO_CREDENTIALS.find(
      (c) => c.email === data.email && c.password === data.password
    );
    if (!valid) {
      toast.error(
        'Invalid credentials — use the demo accounts below to sign in'
      );
      return;
    }
    await new Promise((r) => setTimeout(r, 1000));
    toast.success(`Welcome back! Signed in as ${valid.role}`);
    router.push('/');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-600 text-foreground mb-1.5">
          Email address
        </label>
        <input
          type="email"
          {...register('email', {
            required: 'Email is required',
            pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email' },
          })}
          className="w-full px-3.5 py-2.5 text-sm border border-input rounded-lg bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
          placeholder="admin@institute.ac.in"
        />
        {errors.email && (
          <p className="text-xs text-danger mt-1">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-600 text-foreground mb-1.5">
          Password
        </label>
        <div className="relative">
          <input
            type={showPw ? 'text' : 'password'}
            {...register('password', { required: 'Password is required' })}
            className="w-full px-3.5 py-2.5 pr-10 text-sm border border-input rounded-lg bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setShowPw(!showPw)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {errors.password && (
          <p className="text-xs text-danger mt-1">{errors.password.message}</p>
        )}
      </div>

      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            {...register('rememberMe')}
            className="w-4 h-4 rounded border-input accent-primary"
          />
          <span className="text-sm text-muted-foreground">Remember me</span>
        </label>
        <button
          type="button"
          className="text-sm text-primary hover:underline font-600"
        >
          Forgot password?
        </button>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-2.5 bg-primary text-primary-foreground text-sm font-700 rounded-lg hover:bg-primary/90 transition-all duration-150 active:scale-95 disabled:opacity-70 flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <>
            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            Signing in...
          </>
        ) : (
          'Sign in to Admin Portal'
        )}
      </button>

      {/* Demo credentials */}
      <div className="mt-4 bg-muted/60 border border-border rounded-xl p-3.5">
        <p className="text-xs font-700 text-muted-foreground uppercase tracking-wider mb-2.5">
          Demo Accounts
        </p>
        <div className="space-y-2">
          {DEMO_CREDENTIALS.map((cred) => (
            <div
              key={`cred-${cred.role}`}
              className="flex items-center justify-between gap-2 bg-card rounded-lg px-3 py-2 border border-border"
            >
              <div className="min-w-0">
                <p className="text-xs font-700 text-foreground">{cred.role}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {cred.email}
                </p>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <CopyButton text={cred.email} />
                <CopyButton text={cred.password} />
                <button
                  type="button"
                  onClick={() => {
                    setValue('email', cred.email);
                    setValue('password', cred.password);
                  }}
                  className="text-xs font-600 text-primary hover:bg-primary/10 px-2 py-1 rounded-md transition-colors"
                >
                  Use
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </form>
  );
}

function SignupForm() {
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>();

  const onSubmit = async (_data: SignupFormData) => {
    await new Promise((r) => setTimeout(r, 1200));
    toast.success('Account created! Check your email to verify your institute.');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-600 text-foreground mb-1.5">
          Institute Name
        </label>
        <p className="text-xs text-muted-foreground mb-1.5">
          Enter the full name of your educational institution
        </p>
        <input
          type="text"
          {...register('instituteName', { required: 'Institute name is required' })}
          className="w-full px-3.5 py-2.5 text-sm border border-input rounded-lg bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
          placeholder="e.g. IIHM — Kolkata Campus"
        />
        {errors.instituteName && (
          <p className="text-xs text-danger mt-1">{errors.instituteName.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-600 text-foreground mb-1.5">
          Admin Email
        </label>
        <input
          type="email"
          {...register('email', {
            required: 'Email is required',
            pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email' },
          })}
          className="w-full px-3.5 py-2.5 text-sm border border-input rounded-lg bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
          placeholder="admin@institute.ac.in"
        />
        {errors.email && (
          <p className="text-xs text-danger mt-1">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-600 text-foreground mb-1.5">
          Password
        </label>
        <div className="relative">
          <input
            type={showPw ? 'text' : 'password'}
            {...register('password', {
              required: 'Password is required',
              minLength: { value: 8, message: 'Minimum 8 characters' },
            })}
            className="w-full px-3.5 py-2.5 pr-10 text-sm border border-input rounded-lg bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setShowPw(!showPw)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {errors.password && (
          <p className="text-xs text-danger mt-1">{errors.password.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-600 text-foreground mb-1.5">
          Confirm Password
        </label>
        <div className="relative">
          <input
            type={showConfirm ? 'text' : 'password'}
            {...register('confirmPassword', {
              required: 'Please confirm your password',
              validate: (v) =>
                v === watch('password') || 'Passwords do not match',
            })}
            className="w-full px-3.5 py-2.5 pr-10 text-sm border border-input rounded-lg bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="text-xs text-danger mt-1">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-2.5 bg-primary text-primary-foreground text-sm font-700 rounded-lg hover:bg-primary/90 transition-all duration-150 active:scale-95 disabled:opacity-70 flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <>
            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            Creating account...
          </>
        ) : (
          'Create Admin Account'
        )}
      </button>

      <p className="text-xs text-muted-foreground text-center">
        By creating an account you agree to our{' '}
        <button type="button" className="text-primary hover:underline font-600">
          Terms of Service
        </button>{' '}
        and{' '}
        <button type="button" className="text-primary hover:underline font-600">
          Privacy Policy
        </button>
      </p>
    </form>
  );
}

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');

  return (
    <div className="min-h-screen flex">
      {/* Left brand panel */}
      <div className="hidden lg:flex lg:w-[45%] xl:w-[42%] bg-primary flex-col justify-between p-10 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-white/20 blur-3xl" />
          <div className="absolute bottom-32 right-10 w-80 h-80 rounded-full bg-accent/30 blur-3xl" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <AppLogo size={40} />
            <span className="text-2xl font-800 text-white tracking-tight">
              VidyaGPT
            </span>
          </div>
          <h2 className="text-3xl font-800 text-white leading-snug mb-4">
            AI-powered knowledge management for educational institutes
          </h2>
          <p className="text-white/70 text-base leading-relaxed">
            Upload course materials, crawl your website, and let VidyaGPT answer
            student queries accurately — course by course, source by source.
          </p>
        </div>

        <div className="relative z-10 space-y-3">
          {[
            'Automatic website sync & stale detection',
            'Course-wise knowledge mapping',
            'No hallucination — source-grounded answers only',
          ].map((feat) => (
            <div key={`feat-${feat.slice(0, 20)}`} className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                <Check size={11} className="text-white" />
              </div>
              <span className="text-white/80 text-sm">{feat}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-10 bg-background">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <AppLogo size={32} />
            <span className="text-xl font-800 text-foreground">VidyaGPT</span>
          </div>

          <div className="mb-6">
            <h1 className="text-2xl font-700 text-foreground">
              {activeTab === 'login' ? 'Sign in to Admin Portal' : 'Create Admin Account'}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {activeTab === 'login' ? "Manage your institute's AI knowledge base"
                : 'Set up VidyaGPT for your institute'}
            </p>
          </div>

          {/* Tabs */}
          <div className="flex bg-muted rounded-xl p-1 mb-6">
            <button
              onClick={() => setActiveTab('login')}
              className={`flex-1 py-2 text-sm font-600 rounded-lg transition-all duration-150 ${
                activeTab === 'login' ?'bg-card text-foreground shadow-sm' :'text-muted-foreground hover:text-foreground'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setActiveTab('signup')}
              className={`flex-1 py-2 text-sm font-600 rounded-lg transition-all duration-150 ${
                activeTab === 'signup' ?'bg-card text-foreground shadow-sm' :'text-muted-foreground hover:text-foreground'
              }`}
            >
              Sign Up
            </button>
          </div>

          {activeTab === 'login' ? <LoginForm /> : <SignupForm />}
        </div>
      </div>
    </div>
  );
}
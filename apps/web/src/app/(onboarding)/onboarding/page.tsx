'use client';

import React from 'react';
import { validatePAN } from '@Aurapex/shared';
import { ApiClient } from '@/lib/api-client';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  ArrowRight,
  CheckCircle2,
  Lock,
  FileCheck,
  Building2,
  PieChart,
  Landmark,
  Loader2,
  RefreshCw,
  Check,
  Sparkles
} from 'lucide-react';
import { Card, AnimatedCard } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const STEPS = [
  { id: 1, label: 'Identity' },
  { id: 2, label: 'Verify' },
  { id: 3, label: 'Consent' },
  { id: 4, label: 'Sync' },
];

export default function OnboardingPage() {
  const [pan, setPan] = React.useState('');
  const [otp, setOtp] = React.useState('');
  const [currentStep, setCurrentStep] = React.useState(1);
  const [error, setError] = React.useState('');
  const [referenceId, setReferenceId] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [tempAuth, setTempAuth] = React.useState<{ token: string, user: any } | null>(null);

  // Consent state
  const [consents, setConsents] = React.useState({
    mutualFunds: true,
    equity: true,
    banking: false,
  });

  // Sync state
  const [syncProgress, setSyncProgress] = React.useState(0);
  const [syncMessage, setSyncMessage] = React.useState('Initializing secure connection...');

  const { login, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [isLoading, isAuthenticated, router]);

  const handlePANChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10);
    setPan(value);
    if (error) setError('');
  };

  const handleContinuePAN = async () => {
    if (!pan) {
      setError('PAN is required');
      return;
    }
    if (!validatePAN(pan)) {
      setError('Invalid PAN format. Expected: ABCDE1234F');
      return;
    }

    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      const response: any = await ApiClient.verifyPan({ pan, tenantSlug: 'default' });
      if (response.referenceId) {
        setReferenceId(response.referenceId);
        setCurrentStep(2);
      } else if (response.accessToken) {
        setTempAuth({ token: response.accessToken, user: response.user });
        setCurrentStep(3);
      }
    } catch (err: any) {
      setError(err.message || 'Verification failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleContinueOTP = async () => {
    if (!otp) {
      setError('OTP is required');
      return;
    }

    setIsSubmitting(true);
    try {
      const response: any = await ApiClient.verifyOtp({ referenceId, otp });
      if (response.accessToken) {
        setTempAuth({ token: response.accessToken, user: response.user });
        setCurrentStep(3);
      }
    } catch (err: any) {
      setError(err.message || 'OTP verification failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGrantConsent = () => {
    setCurrentStep(4);
  };

  React.useEffect(() => {
    if (currentStep !== 4) return;
    const intervals = [
      { at: 0, msg: 'Authenticating with RTA (CAMS / KFintech)...' },
      { at: 25, msg: 'Fetching NSDL/CDSL Demat holdings...' },
      { at: 50, msg: 'Reconciling historical transactions...' },
      { at: 80, msg: 'Computing capital gains & XIRR...' },
      { at: 100, msg: 'Sync complete! Preparing dashboard...' },
    ];
    let progress = 0;
    const intervalId = setInterval(() => {
      progress += 2;
      setSyncProgress(progress);
      const currentMsg = intervals.slice().reverse().find(i => progress >= i.at);
      if (currentMsg) setSyncMessage(currentMsg.msg);
      if (progress >= 100) {
        clearInterval(intervalId);
        setTimeout(() => {
          if (tempAuth) {
            login(tempAuth.token, tempAuth.user);
          }
        }, 800);
      }
    }, 100);
    return () => clearInterval(intervalId);
  }, [currentStep, tempAuth, login]);

  if (isLoading || isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#081225] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-brand-blue" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#081225] flex items-center justify-center relative overflow-hidden font-sans">
      {/* Background Orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#0A84FF]/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#30D158]/10 blur-[120px] pointer-events-none" />
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none"></div>

      <div className="w-full max-w-[440px] p-6 z-10">
        <div className="flex flex-col items-center mb-10">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-b from-brand-blue to-brand-blue-hover text-white flex items-center justify-center shadow-lg mb-6 border border-white/10 shadow-brand-blue/20">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Aurapex Intelligence</h1>
          <p className="text-sm text-text-tertiary text-center max-w-xs">
            Connect your accounts for AI-powered wealth analytics
          </p>
        </div>

        <AnimatedCard className="overflow-hidden p-8 shadow-2xl bg-white/5 backdrop-blur-xl border-white/10 rounded-3xl">
          {/* Progress Indicators */}
          <div className="flex items-center justify-between mb-10 relative">
            <div className="absolute left-4 right-4 top-1/2 h-[2px] bg-white/10 -z-10 -translate-y-1/2" />
            {STEPS.map((step) => {
              const isActive = step.id === currentStep;
              const isPast = step.id < currentStep;
              return (
                <div key={step.id} className="flex flex-col items-center gap-2">
                  <div className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500 shadow-sm',
                    isActive ? 'bg-brand-blue text-white ring-4 ring-brand-blue/20' :
                      isPast ? 'bg-brand-green text-white' :
                        'bg-[#111827] text-white/30 border border-white/10'
                  )}>
                    {isPast ? <Check className="w-4 h-4" /> : step.id}
                  </div>
                  <span className={cn(
                    'text-[10px] uppercase tracking-widest font-semibold',
                    isActive ? 'text-white' : 'text-white/30'
                  )}>
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mt-4">
            <AnimatePresence mode="wait">
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-white/70 uppercase tracking-widest">Permanent Account Number</label>
                    <Input
                      type="text"
                      value={pan}
                      onChange={handlePANChange}
                      placeholder="ABCDE1234F"
                      maxLength={10}
                      error={!!error}
                      className="text-center font-mono text-xl tracking-[0.2em] uppercase h-14 bg-black/40 border-white/10 text-white placeholder:text-white/20 focus-visible:ring-brand-blue/50"
                    />
                    {error && <p className="text-xs text-brand-red mt-1 text-center font-medium">{error}</p>}
                  </div>

                  <Button
                    className="w-full h-12 text-base font-semibold bg-white text-brand-primary hover:bg-white/90 shadow-[0_0_20px_rgba(255,255,255,0.15)] rounded-xl"
                    onClick={handleContinuePAN}
                    isLoading={isSubmitting}
                  >
                    Continue <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>

                  <div className="flex items-center justify-center gap-2 text-white/40 pt-2">
                    <Shield className="w-3.5 h-3.5" />
                    <span className="text-[11px] font-medium tracking-wide">Secured by 256-bit encryption</span>
                  </div>
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-white/70 uppercase tracking-widest text-center block">Verification Code</label>
                    <Input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder="••••••"
                      maxLength={6}
                      error={!!error}
                      className="text-center font-mono text-3xl tracking-[0.3em] h-14 bg-black/40 border-white/10 text-white placeholder:text-white/20 focus-visible:ring-brand-blue/50"
                    />
                    {error && <p className="text-xs text-brand-red mt-1 text-center font-medium">{error}</p>}
                  </div>

                  <Button
                    className="w-full h-12 text-base font-semibold bg-white text-brand-primary hover:bg-white/90 shadow-[0_0_20px_rgba(255,255,255,0.15)] rounded-xl"
                    onClick={handleContinueOTP}
                    isLoading={isSubmitting}
                    disabled={otp.length !== 6}
                  >
                    Verify & Authenticate
                  </Button>
                </motion.div>
              )}

              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <div className="space-y-3">
                    {[
                      { id: 'mutualFunds', label: 'Mutual Funds', sub: 'CAMS / KFintech', icon: PieChart },
                      { id: 'equity', label: 'Stocks & Demat', sub: 'CDSL / NSDL', icon: Building2 },
                      { id: 'banking', label: 'Bank Accounts', sub: 'Account Aggregator', icon: Landmark },
                    ].map((item) => {
                      const isChecked = consents[item.id as keyof typeof consents];
                      return (
                         <div
                          key={item.id}
                          className={cn(
                            'flex items-center gap-4 p-4 rounded-2xl border transition-all cursor-pointer',
                            isChecked ? 'border-brand-blue bg-brand-blue/10' : 'border-white/10 bg-black/20 hover:bg-black/40'
                          )}
                          onClick={() => setConsents({ ...consents, [item.id]: !isChecked })}
                        >
                          <div className={cn(
                            'w-5 h-5 rounded-md border flex items-center justify-center transition-colors',
                            isChecked ? 'bg-brand-blue border-brand-blue text-white' : 'border-white/20'
                          )}>
                            {isChecked && <Check className="w-3.5 h-3.5" />}
                          </div>
                          <div className="flex-1">
                            <span className="text-sm font-semibold text-white block">{item.label}</span>
                            <span className="text-xs text-white/50">{item.sub}</span>
                          </div>
                          <item.icon className={cn("w-5 h-5", isChecked ? "text-brand-blue" : "text-white/20")} />
                        </div>
                      );
                    })}
                  </div>

                  <Button 
                    className="w-full h-12 text-base font-semibold bg-white text-brand-primary hover:bg-white/90 shadow-[0_0_20px_rgba(255,255,255,0.15)] rounded-xl mt-4" 
                    onClick={handleGrantConsent}
                  >
                    Connect Accounts
                  </Button>
                </motion.div>
              )}

              {currentStep === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-8 py-8 text-center"
                >
                  <div className="relative w-32 h-32 mx-auto">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="45" className="stroke-white/10 stroke-[3] fill-none" />
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        className="stroke-brand-blue stroke-[3] fill-none transition-all duration-300"
                        strokeDasharray="283"
                        strokeDashoffset={283 - (283 * syncProgress) / 100}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center flex-col">
                      <span className="text-3xl font-bold text-white">{syncProgress}%</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-lg font-semibold text-white tracking-wide">Syncing your wealth</h2>
                    <p className="text-sm text-brand-blue animate-pulse font-medium">{syncMessage}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </AnimatedCard>

        {/* Footer */}
        <p className="text-center text-[11px] text-white/40 mt-8 font-medium tracking-wide">
          By continuing, you agree to Aurapex's <a href="#" className="text-white/60 hover:text-white transition-colors underline decoration-white/20 underline-offset-2">Terms of Service</a> and <a href="#" className="text-white/60 hover:text-white transition-colors underline decoration-white/20 underline-offset-2">Privacy Policy</a>.
        </p>
      </div>
    </div>
  );
}

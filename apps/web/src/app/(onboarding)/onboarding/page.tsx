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
  Check
} from 'lucide-react';
import { Card, AnimatedCard } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const STEPS = [
  { id: 1, label: 'Identity Verification' },
  { id: 2, label: 'Authentication' },
  { id: 3, label: 'Data Consent' },
  { id: 4, label: 'Secure Sync' },
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
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-brand-blue" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-brand-blue/10 blur-[100px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-brand-green/10 blur-[100px]" />

      <div className="w-full max-w-[480px] p-6 z-10">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-brand-primary text-white flex items-center justify-center shadow-lg mb-4">
            <span className="font-bold text-xl">M</span>
          </div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">Aurapex Intelligence</h1>
          <p className="text-sm text-text-secondary mt-1 text-center">
            Enterprise-grade wealth management platform
          </p>
        </div>

        <AnimatedCard className="overflow-hidden p-8 shadow-xl">
          {/* Progress Indicators */}
          <div className="flex items-center justify-between mb-12 pb-6 relative">
            <div className="absolute left-0 right-0 top-1/2 h-[2px] bg-border-light -z-10 -translate-y-1/2" />
            {STEPS.map((step) => {
              const isActive = step.id === currentStep;
              const isPast = step.id < currentStep;
              return (
                <div key={step.id} className="flex flex-col items-center">
                  <div className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors duration-300 bg-surface',
                    isActive ? 'border-brand-primary text-brand-primary' :
                      isPast ? 'border-brand-primary bg-brand-primary text-white' :
                        'border-border text-text-muted'
                  )}>
                    {isPast ? <Check className="w-4 h-4" /> : step.id}
                  </div>
                  <span className={cn(
                    'text-[10px] uppercase tracking-wider font-semibold mt-2 absolute -bottom-5 w-24 text-center',
                    isActive ? 'text-brand-primary' : 'text-text-muted'
                  )}>
                    {isActive && step.label}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mt-8">
            <AnimatePresence mode="wait">
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="text-center space-y-1">
                    <h2 className="text-xl font-bold text-text-primary">Verify your identity</h2>
                    <p className="text-sm text-text-secondary">Enter your PAN to securely connect with government registries</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Input
                        type="text"
                        value={pan}
                        onChange={handlePANChange}
                        placeholder="ABCDE1234F"
                        maxLength={10}
                        error={!!error}
                        className="text-center font-mono text-lg tracking-widest uppercase h-14"
                      />
                      {error && <p className="text-sm text-brand-red mt-2 text-center">{error}</p>}
                    </div>

                    <Button
                      className="w-full h-12 text-base"
                      onClick={handleContinuePAN}
                      isLoading={isSubmitting}
                    >
                      Continue to Verification <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </div>

                  <div className="flex items-center justify-center gap-2 text-text-tertiary">
                    <Shield className="w-4 h-4" />
                    <span className="text-xs font-medium">Secured by 256-bit encryption</span>
                  </div>
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="text-center space-y-1">
                    <h2 className="text-xl font-bold text-text-primary">Enter Verification Code</h2>
                    <p className="text-sm text-text-secondary">We've sent a secure 6-digit code to your registered mobile number</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        placeholder="000000"
                        maxLength={6}
                        error={!!error}
                        className="text-center font-mono text-2xl tracking-[0.5em] h-14"
                      />
                      {error && <p className="text-sm text-brand-red mt-2 text-center">{error}</p>}
                    </div>

                    <Button
                      className="w-full h-12 text-base"
                      onClick={handleContinueOTP}
                      isLoading={isSubmitting}
                      disabled={otp.length !== 6}
                    >
                      Verify & Authenticate
                    </Button>
                  </div>
                </motion.div>
              )}

              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="text-center space-y-1">
                    <div className="w-12 h-12 bg-brand-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FileCheck className="w-6 h-6 text-brand-green" />
                    </div>
                    <h2 className="text-xl font-bold text-text-primary">Data Access Consent</h2>
                    <p className="text-sm text-text-secondary">Select the accounts you want Aurapex to aggregate</p>
                  </div>

                  <div className="space-y-3">
                    {[
                      { id: 'mutualFunds', label: 'Mutual Funds (CAMS/KFintech)', icon: PieChart },
                      { id: 'equity', label: 'Stocks & Demat (CDSL/NSDL)', icon: Building2 },
                      { id: 'banking', label: 'Bank Accounts (AA Framework)', icon: Landmark },
                    ].map((item) => {
                      const isChecked = consents[item.id as keyof typeof consents];
                      return (
                        <div
                          key={item.id}
                          className={cn(
                            'flex items-center gap-4 p-4 rounded-xl border transition-all cursor-pointer',
                            isChecked ? 'border-brand-blue bg-brand-blue/5' : 'border-border bg-surface'
                          )}
                          onClick={() => setConsents({ ...consents, [item.id]: !isChecked })}
                        >
                          <div className={cn(
                            'w-5 h-5 rounded-md border flex items-center justify-center transition-colors',
                            isChecked ? 'bg-brand-blue border-brand-blue text-white' : 'border-border'
                          )}>
                            {isChecked && <Check className="w-3 h-3" />}
                          </div>
                          <div className="flex items-center gap-3">
                            <item.icon className="w-5 h-5 text-text-tertiary" />
                            <span className="text-sm font-medium text-text-primary">{item.label}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <Button className="w-full h-12 text-base" onClick={handleGrantConsent}>
                    Grant Access & Connect
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
                  <div className="relative w-24 h-24 mx-auto">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="45" className="stroke-border-light stroke-[4] fill-none" />
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        className="stroke-brand-blue stroke-[4] fill-none transition-all duration-300"
                        strokeDasharray="283"
                        strokeDashoffset={283 - (283 * syncProgress) / 100}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center flex-col">
                      <span className="text-2xl font-bold text-text-primary">{syncProgress}%</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-xl font-bold text-text-primary">Syncing your wealth</h2>
                    <p className="text-sm text-text-secondary animate-pulse">{syncMessage}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </AnimatedCard>

        {/* Footer */}
        <p className="text-center text-xs text-text-tertiary mt-8">
          By continuing, you agree to Aurapex's <a href="#" className="underline">Terms of Service</a> and <a href="#" className="underline">Privacy Policy</a>.
        </p>
      </div>
    </div>
  );
}

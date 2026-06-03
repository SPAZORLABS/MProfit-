'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import {
  User,
  Shield,
  Bell,
  Palette,
  Globe,
  Database,
  Key,
  CreditCard,
  Link2,
  ChevronRight,
  Check,
  Moon,
  Sun,
  Settings,
  Mail,
  Phone,
  Hash,
  Laptop,
  Smartphone,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { AnimatedCard } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const SETTINGS_SECTIONS = [
  {
    id: 'profile',
    label: 'Profile',
    icon: User,
    color: 'brand-blue',
    items: [
      { label: 'Display Name', value: 'Rahul Sharma', type: 'text', icon: User },
      { label: 'Email', value: 'rahul@example.com', type: 'text', icon: Mail },
      { label: 'Phone', value: '+91 98765 43210', type: 'text', icon: Phone },
      { label: 'PAN', value: '••••E1234F', type: 'masked', icon: Hash },
    ],
  },
  {
    id: 'security',
    label: 'Security',
    icon: Shield,
    color: 'brand-amber',
    items: [
      { label: 'Two-Factor Authentication', value: 'Enabled', type: 'toggle', enabled: true, icon: Key },
      { label: 'Session Timeout', value: '30 minutes', type: 'select', icon: Shield },
      { label: 'Login Notifications', value: 'Email & SMS', type: 'select', icon: Bell },
      { label: 'Active Devices', value: '2 Devices (MacBook, iPhone)', type: 'text', icon: Laptop },
    ],
  },
  {
    id: 'notifications',
    label: 'Alerts',
    icon: Bell,
    color: 'brand-purple',
    items: [
      { label: 'Portfolio Sync', value: true, type: 'toggle', enabled: true, icon: Database },
      { label: 'AI Insights', value: true, type: 'toggle', enabled: true, icon: Settings },
      { label: 'Market Updates', value: true, type: 'toggle', enabled: true, icon: Globe },
      { label: 'Tax Deadlines', value: true, type: 'toggle', enabled: true, icon: CreditCard },
      { label: 'Report Ready', value: false, type: 'toggle', enabled: false, icon: Link2 },
    ],
  },
  {
    id: 'integrations',
    label: 'Connections',
    icon: Link2,
    color: 'brand-green',
    items: [
      { label: 'NSDL/CDSL', value: 'Connected', type: 'status', connected: true, icon: CheckCircle2 },
      { label: 'CAMS', value: 'Connected', type: 'status', connected: true, icon: CheckCircle2 },
      { label: 'KFintech', value: 'Connected', type: 'status', connected: true, icon: CheckCircle2 },
      { label: 'Zerodha', value: 'Not Connected', type: 'status', connected: false, icon: XCircle },
      { label: 'Groww', value: 'Not Connected', type: 'status', connected: false, icon: XCircle },
    ],
  },
];

export default function SettingsPage() {
  const [activeSection, setActiveSection] = React.useState('profile');

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-text-primary flex items-center gap-3">
            <Settings className="w-8 h-8 text-brand-blue" />
            Platform Settings
          </h1>
          <p className="text-sm font-medium text-text-secondary mt-1.5">
            Manage your account, security, and integration preferences.
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Navigation Sidebar */}
        <AnimatedCard className="w-full md:w-[260px] flex-shrink-0 p-3 border border-border shadow-sm rounded-2xl bg-surface h-max">
          <div className="space-y-2">
            {SETTINGS_SECTIONS.map((section) => {
              const Icon = section.icon;
              const isActive = activeSection === section.id;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={cn(
                    'w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold tracking-tight transition-all',
                    isActive
                      ? `bg-${section.color}/10 text-${section.color} border border-${section.color}/20 shadow-sm`
                      : 'text-text-secondary border border-transparent hover:bg-surface-hover hover:text-text-primary'
                  )}
                >
                  <Icon className={cn("w-5 h-5", isActive ? `text-${section.color}` : "text-text-tertiary")} />
                  {section.label}
                  {isActive && <ChevronRight className="w-4 h-4 ml-auto opacity-50" />}
                </button>
              );
            })}
          </div>
        </AnimatedCard>

        {/* Content Area */}
        <div className="flex-1">
          {SETTINGS_SECTIONS.filter(s => s.id === activeSection).map((section) => (
            <AnimatedCard key={section.id} className="p-8 border border-border shadow-md rounded-2xl bg-surface animate-fade-in relative overflow-hidden group">
               <div className={`absolute -right-12 -top-12 w-40 h-40 bg-${section.color}/5 rounded-full blur-3xl group-hover:bg-${section.color}/10 transition-colors pointer-events-none`} />
              
              <div className="flex items-center gap-3 mb-8 pb-4 border-b border-border/50">
                <div className={`w-10 h-10 rounded-xl bg-${section.color}/10 border border-${section.color}/20 flex items-center justify-center shadow-inner`}>
                  <section.icon className={`w-5 h-5 text-${section.color}`} />
                </div>
                <h2 className="text-xl font-black text-text-primary tracking-tight">{section.label}</h2>
              </div>
              
              <div className="space-y-2 relative z-10">
                {section.items.map((item, index) => {
                  const ItemIcon = item.icon || ChevronRight;
                  return (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 rounded-xl border border-transparent hover:border-border/50 hover:bg-surface-muted/30 transition-all group/item"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-lg bg-surface border border-border flex items-center justify-center shadow-sm group-hover/item:border-brand-blue/30 transition-colors">
                           <ItemIcon className="w-4 h-4 text-text-tertiary group-hover/item:text-brand-blue transition-colors" />
                        </div>
                        <p className="text-sm font-bold text-text-primary tracking-tight">{item.label}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        {item.type === 'toggle' ? (
                          <button
                            className={cn(
                              'relative w-12 h-6 rounded-full transition-colors border shadow-inner',
                              (item as { enabled?: boolean }).enabled ? 'bg-brand-green/20 border-brand-green/30' : 'bg-surface-muted border-border'
                            )}
                          >
                            <div
                              className={cn(
                                'absolute top-0.5 w-4 h-4 rounded-full shadow-sm transition-transform',
                                (item as { enabled?: boolean }).enabled ? 'left-[26px] bg-brand-green' : 'left-1 bg-text-tertiary'
                              )}
                            />
                          </button>
                        ) : item.type === 'status' ? (
                          <span
                            className={cn(
                              'inline-flex px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-lg border shadow-sm',
                              (item as { connected?: boolean }).connected 
                                ? 'bg-brand-green/10 text-brand-green border-brand-green/20' 
                                : 'bg-brand-amber/10 text-brand-amber border-brand-amber/20'
                            )}
                          >
                            {item.value as string}
                          </span>
                        ) : (
                          <span className="text-sm font-medium text-text-secondary bg-surface px-3 py-1.5 rounded-lg border border-border shadow-sm">{item.value as string}</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* Contextual Action Button */}
              <div className="mt-8 pt-6 border-t border-border/50 flex justify-end">
                <Button className="h-10 px-6 bg-brand-primary text-white text-xs font-bold uppercase tracking-widest rounded-xl shadow-md hover:shadow-lg transition-all">
                  Save Changes
                </Button>
              </div>
            </AnimatedCard>
          ))}
        </div>
      </div>
    </div>
  );
}

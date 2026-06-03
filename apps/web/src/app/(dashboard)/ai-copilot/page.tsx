'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { formatCompactINR } from '@Aurapex/shared';
import {
  mockScenarioVariables,
} from '@/lib/mock-data';
import type { AIMessage, ScenarioVariable } from '@Aurapex/shared';
import { ApiClient } from '@/lib/api-client';
import { useAuth } from '@/hooks/useAuth';
import {
  Sparkles,
  Send,
  Play,
  RotateCcw,
  FileDown,
  Plus,
  MessageSquare,
  Bot,
  User,
  Quote,
  Info,
  Shield,
  Activity,
  Zap
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
  LabelList,
} from 'recharts';
import { AnimatedCard } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function AICopilotPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [messages, setMessages] = React.useState<AIMessage[]>([]);
  const [inputValue, setInputValue] = React.useState('');
  const [variables, setVariables] = React.useState<ScenarioVariable[]>(mockScenarioVariables);
  const [conversationId, setConversationId] = React.useState<string | null>(null);
  const [isSending, setIsSending] = React.useState(false);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const scenarioChartData = [
    { name: 'PRE-CRASH', value: 100, fill: '#1a1f2e' },
    { name: 'MARKET DROP', value: -15, fill: '#ef4444' },
    { name: 'PORTFOLIO', value: -9.2, fill: '#8b5cf6' },
    { name: 'RECOVERY EST.', value: 6.8, fill: '#22c55e' },
  ];

  // Auto-scroll to bottom
  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Load conversation on mount
  React.useEffect(() => {
    if (authLoading || !isAuthenticated) return;

    const initConversation = async () => {
      try {
        const portfolios = await ApiClient.getPortfolios() as any[];
        if (portfolios && portfolios.length > 0) {
          const primaryPortfolioId = portfolios[0].id;

          // Start a new conversation
          const conv: any = await ApiClient.startCopilot(primaryPortfolioId);
          setConversationId(conv.id);

          setMessages([{
            id: 'welcome-1',
            role: 'assistant',
            content: 'Hello! I am Aurapex AI Copilot. I have loaded your portfolio context. How can I help you optimize your wealth today?',
            createdAt: new Date().toISOString()
          }]);
        }
      } catch (err) {
        console.error('Failed to init copilot', err);
      }
    };

    initConversation();
  }, [authLoading, isAuthenticated]);

  const handleSend = async () => {
    if (!inputValue.trim() || !conversationId || isSending) return;

    const content = inputValue;
    const newMessage: AIMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content,
      createdAt: new Date().toISOString(),
    };

    setMessages(prev => [...prev, newMessage]);
    setInputValue('');
    setIsSending(true);

    try {
      const aiResponse: any = await ApiClient.sendCopilotMessage(conversationId, content);
      setMessages(prev => [...prev, aiResponse]);
    } catch (err) {
      console.error('Failed to send message', err);
      setMessages(prev => [...prev, {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: 'I encountered an error processing your request. Please try again.',
        createdAt: new Date().toISOString(),
      }]);
    } finally {
      setIsSending(false);
    }
  };

  const handleVariableChange = (id: string, value: number) => {
    setVariables(vars => vars.map(v => v.id === id ? { ...v, value } : v));
  };

  const resetVariables = () => {
    setVariables(mockScenarioVariables);
  };

  return (
    <div className="flex h-[calc(100vh-64px-52px)] animate-fade-in bg-surface">
      {/* ─── Left Panel: Chat ────────────────────────────────── */}
      <div className="flex-1 flex flex-col border-r border-border">
        {/* Chat Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-border bg-surface-muted/30">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-blue to-brand-purple flex items-center justify-center shadow-inner border border-brand-blue/30">
              <Sparkles className="w-5 h-5 text-white drop-shadow-sm" />
            </div>
            <div>
              <h1 className="text-xl font-black text-text-primary tracking-tight">AI Copilot</h1>
              <p className="text-xs font-bold text-text-secondary uppercase tracking-widest mt-1">Real-time stress testing and wealth intelligence</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="flex items-center gap-2 h-10 px-4 text-xs font-bold uppercase tracking-widest border border-border bg-surface text-text-secondary hover:text-text-primary hover:bg-surface-hover shadow-sm transition-all rounded-xl">
              <FileDown className="w-4 h-4" />
              Export Scenario
            </Button>
            <Button className="flex items-center gap-2 h-10 px-4 bg-brand-primary text-white text-xs font-bold uppercase tracking-widest rounded-xl shadow-md hover:shadow-lg transition-all">
              <Plus className="w-4 h-4" />
              New Thread
            </Button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-8 bg-surface">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                'flex gap-4 animate-slide-up',
                message.role === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              {message.role === 'assistant' && (
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-blue/20 to-brand-purple/20 border border-brand-blue/30 flex items-center justify-center flex-shrink-0 mt-1 shadow-sm">
                  <Bot className="w-5 h-5 text-brand-blue" />
                </div>
              )}

              <div
                className={cn(
                  'max-w-[75%] rounded-2xl px-6 py-5 shadow-sm',
                  message.role === 'user'
                    ? 'bg-surface-hover text-text-primary rounded-tr-sm border border-border/50'
                    : 'bg-surface border border-border rounded-tl-sm'
                )}
              >
                {/* Message Content */}
                <p className="text-sm font-medium leading-relaxed">
                  {message.content.split('**').map((part, i) =>
                    i % 2 === 1 ? (
                      <span key={i} className="font-bold text-brand-blue bg-brand-blue/5 px-1 rounded">{part}</span>
                    ) : (
                      <React.Fragment key={i}>{part}</React.Fragment>
                    )
                  )}
                </p>

                {/* Scenario Chart (in AI response) */}
                {message.metadata?.chartData && (
                  <AnimatedCard className="mt-6 bg-surface-muted/50 border border-border/50 rounded-xl p-5 shadow-inner">
                    <div className="flex items-center gap-2 mb-4">
                      <Activity className="w-4 h-4 text-brand-blue" />
                      <span className="text-xs font-bold uppercase tracking-widest text-text-primary">Stress Test Results</span>
                    </div>
                    <div className="h-[200px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={scenarioChartData} barCategoryGap="25%">
                          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} strokeOpacity={0.5} />
                          <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 9, fill: '#6b7280', fontWeight: 800 }}
                            dy={10}
                          />
                          <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 10, fill: '#9ca3af', fontWeight: 700 }}
                            tickFormatter={(v) => `${v}%`}
                            dx={-10}
                          />
                          <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                            {scenarioChartData.map((entry, idx) => (
                              <Cell key={idx} fill={entry.fill} />
                            ))}
                            <LabelList
                              dataKey="value"
                              position="top"
                              formatter={(v: number) => `${v > 0 ? '+' : ''}${v}%`}
                              style={{ fontSize: 10, fontWeight: 800, fill: '#111827' }}
                              dy={-5}
                            />
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </AnimatedCard>
                )}

                {/* AI Insight Callout */}
                {message.metadata?.insight && (
                  <AnimatedCard className="mt-6 border border-brand-amber/30 bg-brand-amber/5 rounded-xl p-5 relative overflow-hidden group">
                     <div className="absolute -right-4 -top-4 w-24 h-24 bg-brand-amber/10 rounded-full blur-2xl group-hover:bg-brand-amber/20 transition-colors" />
                    <div className="relative z-10">
                      <div className="flex items-center gap-2 mb-3">
                        <Zap className="w-4 h-4 text-brand-amber" />
                        <span className="text-xs font-bold text-brand-amber uppercase tracking-widest">
                          Key Insight
                        </span>
                      </div>
                      <p className="text-sm font-medium text-text-primary leading-relaxed">
                        {message.metadata.insight.body.split("'").map((part, i) =>
                          i % 2 === 1 ? (
                            <span key={i} className="font-bold text-brand-amber bg-brand-amber/10 px-1 rounded">&apos;{part}&apos;</span>
                          ) : (
                            <React.Fragment key={i}>{part}</React.Fragment>
                          )
                        )}
                      </p>
                    </div>
                  </AnimatedCard>
                )}
              </div>

              {message.role === 'user' && (
                <div className="w-10 h-10 rounded-xl bg-surface-muted border border-border flex items-center justify-center flex-shrink-0 mt-1 shadow-sm">
                  <User className="w-5 h-5 text-text-secondary" />
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="px-8 py-5 border-t border-border bg-surface-muted/30">
          {/* Metadata Row */}
          <div className="flex flex-wrap items-center gap-x-8 gap-y-2 mb-4 text-[10px] font-bold uppercase tracking-widest text-text-tertiary">
            <div className="flex items-center gap-2 bg-surface px-3 py-1.5 rounded-md border border-border shadow-sm">
              <span>Confidence:</span>
              <span className="text-gain flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-gain animate-pulse"></span>HIGH</span>
            </div>
            <div className="flex items-center gap-2 bg-surface px-3 py-1.5 rounded-md border border-border shadow-sm">
              <span>Assumptions:</span>
              <span className="text-text-primary">Historical Volatility, Current Debt Ratios</span>
            </div>
            <div className="flex items-center gap-2 bg-surface px-3 py-1.5 rounded-md border border-border shadow-sm">
              <span>Estimated Impact:</span>
              <span className="text-brand-purple">₹12L - ₹18L</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex-1 flex items-center gap-3 px-5 py-3.5 bg-surface border border-border shadow-sm rounded-xl focus-within:border-brand-blue focus-within:ring-1 focus-within:ring-brand-blue transition-all">
              <MessageSquare className="w-5 h-5 text-text-tertiary flex-shrink-0" />
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                disabled={isSending}
                placeholder={isSending ? "AI is analyzing..." : "Ask Copilot to analyze a specific asset or run a scenario..."}
                className="flex-1 bg-transparent text-sm font-medium text-text-primary placeholder:text-text-tertiary outline-none disabled:opacity-50"
              />
            </div>
            <Button
              onClick={handleSend}
              disabled={isSending}
              className="flex items-center gap-2 h-[52px] px-8 bg-brand-primary text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:shadow-lg transition-all disabled:opacity-50 group"
            >
              SIMULATE
              <Play className="w-4 h-4 fill-white group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </div>

      {/* ─── Right Panel: Variables & Impact ──────────────────── */}
      <div className="w-[380px] flex-shrink-0 overflow-y-auto bg-surface border-l border-border/50">
        {/* Global Variables */}
        <div className="px-8 py-6 border-b border-border">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-sm font-bold text-text-primary uppercase tracking-widest flex items-center gap-2">
               <Activity className="w-4 h-4 text-text-tertiary" />
               Global Variables
            </h2>
            <button className="p-2 rounded-lg border border-border bg-surface hover:bg-surface-hover shadow-sm transition-all">
              <RotateCcw className="w-3.5 h-3.5 text-text-tertiary" />
            </button>
          </div>

          <div className="space-y-8">
            {variables.map((variable) => (
              <div key={variable.id} className="group">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-widest text-text-primary group-hover:text-brand-blue transition-colors">{variable.label}</span>
                  <span className={cn(
                    'text-sm font-black tracking-tight px-2 py-1 rounded bg-surface-muted border border-border/50',
                    variable.value > 0 ? 'text-gain' : variable.value < 0 ? 'text-loss' : 'text-text-primary'
                  )}>
                    {variable.value > 0 ? '+' : ''}{variable.value}{variable.suffix}
                  </span>
                </div>
                <div className="relative">
                   <div className="absolute inset-y-0 left-0 right-0 top-1/2 -translate-y-1/2 h-1.5 bg-surface-muted rounded-full overflow-hidden border border-border/50">
                      <div 
                        className="absolute inset-y-0 left-0 bg-brand-blue transition-all duration-150"
                        style={{ width: `${((variable.value - variable.min) / (variable.max - variable.min)) * 100}%` }}
                      />
                   </div>
                  <input
                    type="range"
                    min={variable.min}
                    max={variable.max}
                    step={variable.step}
                    value={variable.value}
                    onChange={(e) => handleVariableChange(variable.id, Number(e.target.value))}
                    className="relative z-10 w-full h-1.5 appearance-none cursor-pointer bg-transparent
                      [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5
                      [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:cursor-pointer
                      [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-brand-blue"
                  />
                </div>
                <div className="flex items-center justify-between mt-2 text-[10px] font-bold text-text-tertiary uppercase tracking-widest">
                  <span>{variable.min}{variable.suffix}</span>
                  <span>{variable.max}{variable.suffix}</span>
                </div>
              </div>
            ))}
          </div>

          <Button
            variant="outline"
            onClick={resetVariables}
            className="w-full mt-8 h-10 border border-border rounded-xl text-xs font-bold uppercase tracking-widest text-text-secondary hover:text-text-primary hover:bg-surface-hover shadow-sm transition-all"
          >
            Reset Variables
          </Button>
        </div>

        {/* Real-Time Impact */}
        <div className="px-8 py-6 border-b border-border bg-surface-muted/10">
          <h2 className="text-sm font-bold text-text-primary uppercase tracking-widest mb-6 flex items-center gap-2">
             <Activity className="w-4 h-4 text-text-tertiary" />
             Real-Time Impact
          </h2>
          <div className="space-y-4">
            <AnimatedCard className="p-4 bg-surface border border-border shadow-sm rounded-xl">
               <div className="flex items-center justify-between mb-2">
                 <span className="text-[10px] font-bold uppercase tracking-widest text-text-tertiary">Estimated Loss</span>
               </div>
               <span className="text-3xl font-black tracking-tight text-loss">{formatCompactINR(1400000)}</span>
            </AnimatedCard>
             <AnimatedCard className="p-4 bg-surface border border-border shadow-sm rounded-xl">
               <div className="flex items-center justify-between mb-2">
                 <span className="text-[10px] font-bold uppercase tracking-widest text-text-tertiary">Portfolio Value</span>
               </div>
               <div className="flex items-center gap-2">
                 <span className="text-xl font-black tracking-tight text-text-secondary line-through opacity-70">
                   {formatCompactINR(38500000)}
                 </span>
                 <span className="text-text-tertiary">→</span>
                 <span className="text-2xl font-black tracking-tight text-text-primary">
                   {formatCompactINR(37100000)}
                 </span>
               </div>
            </AnimatedCard>
          </div>
        </div>

        {/* Historical Correlate */}
        <div className="px-8 py-6">
          <h2 className="text-sm font-bold text-text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
             <Quote className="w-4 h-4 text-text-tertiary" />
             Historical Correlate
          </h2>
          <AnimatedCard className="p-5 border border-brand-purple/20 bg-brand-purple/5 shadow-sm rounded-xl relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-brand-purple/10 rounded-full blur-2xl group-hover:bg-brand-purple/20 transition-colors" />
            <p className="text-sm font-medium text-text-primary italic leading-relaxed relative z-10">
              &ldquo;Current parameters mirror the 2013 &apos;Taper Tantrum&apos; volatility markers for emerging markets.&rdquo;
            </p>
          </AnimatedCard>
        </div>
      </div>
    </div>
  );
}

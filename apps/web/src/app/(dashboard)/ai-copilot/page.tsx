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
    <div className="flex h-[calc(100vh-64px-52px)] animate-fade-in">
      {/* ─── Left Panel: Chat ────────────────────────────────── */}
      <div className="flex-1 flex flex-col border-r border-border">
        {/* Chat Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-surface">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-sidebar flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-brand-amber" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-text-primary">AI Copilot</h1>
              <p className="text-xs text-text-secondary">Real-time stress testing and wealth intelligence</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-border rounded-lg text-text-secondary hover:bg-surface-hover transition-colors">
              <FileDown className="w-3.5 h-3.5" />
              Export Scenario
            </button>
            <button className="flex items-center gap-2 px-4 py-1.5 bg-brand-green text-white rounded-lg text-xs font-semibold hover:bg-brand-green-dark transition-colors">
              <Plus className="w-3.5 h-3.5" />
              New Thread
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                'flex gap-3 animate-slide-up',
                message.role === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              {message.role === 'assistant' && (
                <div className="w-8 h-8 rounded-lg bg-sidebar flex items-center justify-center flex-shrink-0 mt-1">
                  <Bot className="w-4 h-4 text-white" />
                </div>
              )}

              <div
                className={cn(
                  'max-w-[75%] rounded-2xl px-5 py-4',
                  message.role === 'user'
                    ? 'bg-surface-hover text-text-primary rounded-br-md'
                    : 'bg-surface border border-border rounded-bl-md'
                )}
              >
                {/* Message Content */}
                <p className="text-sm leading-relaxed">
                  {message.content.split('**').map((part, i) =>
                    i % 2 === 1 ? (
                      <span key={i} className="font-bold">{part}</span>
                    ) : (
                      <React.Fragment key={i}>{part}</React.Fragment>
                    )
                  )}
                </p>

                {/* Scenario Chart (in AI response) */}
                {message.metadata?.chartData && (
                  <div className="mt-4 bg-surface-muted rounded-lg p-4">
                    <div className="h-[180px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={scenarioChartData} barCategoryGap="20%">
                          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                          <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 10, fill: '#6b7280', fontWeight: 600 }}
                          />
                          <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 11, fill: '#9ca3af' }}
                            tickFormatter={(v) => `${v}%`}
                          />
                          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                            {scenarioChartData.map((entry, idx) => (
                              <Cell key={idx} fill={entry.fill} />
                            ))}
                            <LabelList
                              dataKey="value"
                              position="top"
                              formatter={(v: number) => `${v > 0 ? '' : ''}${v}%`}
                              style={{ fontSize: 11, fontWeight: 700, fill: '#111827' }}
                            />
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}

                {/* AI Insight Callout */}
                {message.metadata?.insight && (
                  <div className="mt-4 ai-insight-gold p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-4 h-4 text-brand-amber" />
                      <span className="text-xs font-bold text-brand-amber uppercase tracking-wider">
                        AI Insight
                      </span>
                    </div>
                    <p className="text-sm text-text-primary leading-relaxed">
                      {message.metadata.insight.body.split("'").map((part, i) =>
                        i % 2 === 1 ? (
                          <span key={i} className="font-semibold italic">&apos;{part}&apos;</span>
                        ) : (
                          <React.Fragment key={i}>{part}</React.Fragment>
                        )
                      )}
                    </p>
                  </div>
                )}
              </div>

              {message.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-blue to-brand-purple flex items-center justify-center flex-shrink-0 mt-1">
                  <User className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="px-6 py-4 border-t border-border bg-surface">
          {/* Metadata Row */}
          <div className="flex items-center gap-6 mb-3 text-xs text-text-tertiary">
            <div className="flex items-center gap-1">
              <span className="font-semibold">Confidence:</span>
              <span className="font-bold text-gain">HIGH</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-semibold">Assumptions:</span>
              <span className="uppercase">Historical Volatility, Current Debt Ratios</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-semibold">Estimated Impact:</span>
              <span>₹12L - ₹18L</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex-1 flex items-center gap-2 px-4 py-2.5 bg-surface-muted border border-border rounded-xl">
              <MessageSquare className="w-4 h-4 text-text-tertiary flex-shrink-0" />
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                disabled={isSending}
                placeholder={isSending ? "AI is thinking..." : "Ask Copilot to analyze a specific asset or run a scenario..."}
                className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-tertiary outline-none disabled:opacity-50"
              />
            </div>
            <button
              onClick={handleSend}
              disabled={isSending}
              className="flex items-center gap-2 px-6 py-2.5 bg-brand-green text-white rounded-xl text-sm font-bold hover:bg-brand-green-dark transition-colors disabled:opacity-50"
            >
              SIMULATE
              <Play className="w-4 h-4 fill-white" />
            </button>
          </div>
        </div>
      </div>

      {/* ─── Right Panel: Variables & Impact ──────────────────── */}
      <div className="w-[340px] flex-shrink-0 overflow-y-auto bg-surface">
        {/* Global Variables */}
        <div className="px-6 py-5 border-b border-border">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-bold text-text-primary uppercase tracking-wider">Global Variables</h2>
            <button className="p-1 rounded hover:bg-surface-hover transition-colors">
              <RotateCcw className="w-4 h-4 text-text-tertiary" />
            </button>
          </div>

          <div className="space-y-6">
            {variables.map((variable) => (
              <div key={variable.id}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-text-primary">{variable.label}</span>
                  <span className={cn(
                    'text-sm font-bold',
                    variable.value > 0 ? 'text-gain' : variable.value < 0 ? 'text-loss' : 'text-text-primary'
                  )}>
                    {variable.value > 0 ? '+' : ''}{variable.value}{variable.suffix}
                  </span>
                </div>
                <input
                  type="range"
                  min={variable.min}
                  max={variable.max}
                  step={variable.step}
                  value={variable.value}
                  onChange={(e) => handleVariableChange(variable.id, Number(e.target.value))}
                  className="w-full h-1.5 bg-bg-alt rounded-full appearance-none cursor-pointer
                    [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
                    [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-sidebar [&::-webkit-slider-thumb]:cursor-pointer
                    [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white"
                />
                <div className="flex items-center justify-between mt-1 text-[10px] text-text-tertiary">
                  <span>{variable.min}{variable.suffix}</span>
                  <span>{variable.max}{variable.suffix}</span>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={resetVariables}
            className="w-full mt-4 px-4 py-2.5 border border-border rounded-lg text-sm font-semibold text-text-primary hover:bg-surface-hover transition-colors"
          >
            Reset Variables
          </button>
        </div>

        {/* Real-Time Impact */}
        <div className="px-6 py-5 border-b border-border">
          <h2 className="text-sm font-bold text-text-primary uppercase tracking-wider mb-4">
            Real-Time Impact
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-secondary">Estimated Loss</span>
              <span className="text-xl font-bold text-loss">{formatCompactINR(1400000)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-secondary">Portfolio Value</span>
              <span className="text-sm text-text-primary">
                {formatCompactINR(38500000)} → {formatCompactINR(37100000)}
              </span>
            </div>
          </div>
        </div>

        {/* Historical Correlate */}
        <div className="px-6 py-5">
          <h2 className="text-sm font-bold text-text-primary uppercase tracking-wider mb-4">
            Historical Correlate
          </h2>
          <div className="flex gap-3">
            <Quote className="w-5 h-5 text-text-tertiary flex-shrink-0 mt-1" />
            <p className="text-sm text-text-secondary italic leading-relaxed">
              &ldquo;Current parameters mirror the 2013 &apos;Taper Tantrum&apos; volatility markers for emerging markets.&rdquo;
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

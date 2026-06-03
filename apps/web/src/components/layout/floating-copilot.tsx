'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Sparkles, X, Send, Maximize2, Minimize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';

export function FloatingCopilot() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [input, setInput] = React.useState('');

  const toggleOpen = () => {
    setIsOpen(!isOpen);
    if (isExpanded) setIsExpanded(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className={cn(
              'bg-surface border border-border shadow-2xl rounded-2xl overflow-hidden mb-4 pointer-events-auto flex flex-col transition-all duration-300',
              isExpanded ? 'w-[600px] h-[600px]' : 'w-[380px] h-[500px]'
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-gradient-to-r from-brand-primary to-[#2a3040]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-brand-amber" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white leading-tight">Aurapex AI</h3>
                  <p className="text-[10px] text-white/60 uppercase tracking-widest">Wealth Intelligence</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => setIsExpanded(!isExpanded)} 
                  className="p-1.5 text-white/60 hover:text-white hover:bg-white/10 rounded-md transition-colors"
                >
                  {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
                <button 
                  onClick={toggleOpen} 
                  className="p-1.5 text-white/60 hover:text-white hover:bg-white/10 rounded-md transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 bg-surface-muted/30 p-4 overflow-y-auto flex flex-col gap-4">
              {/* Initial Greeting */}
              <div className="flex flex-col gap-2">
                <div className="bg-surface border border-border rounded-2xl rounded-tl-sm p-3 shadow-sm self-start max-w-[85%]">
                  <p className="text-sm text-text-primary">
                    Hello! I'm your AI wealth copilot. How can I assist you with your portfolio today?
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  <button className="px-3 py-1.5 bg-surface border border-border rounded-full text-xs text-text-secondary hover:border-brand-blue hover:text-brand-blue transition-colors text-left">
                    "Analyze my exposure to tech sector"
                  </button>
                  <button className="px-3 py-1.5 bg-surface border border-border rounded-full text-xs text-text-secondary hover:border-brand-blue hover:text-brand-blue transition-colors text-left">
                    "Are there any tax harvesting opportunities?"
                  </button>
                </div>
              </div>
            </div>

            {/* Input Area */}
            <div className="p-3 border-t border-border bg-surface">
              <div className="relative">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about your portfolio..."
                  className="pr-10 bg-surface-muted border-border-light focus:bg-surface"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-brand-primary text-white rounded-md hover:bg-brand-primary-hover transition-colors">
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Trigger Button */}
      <button
        onClick={toggleOpen}
        className={cn(
          "w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition-all duration-300 pointer-events-auto hover:scale-105",
          isOpen ? "bg-surface border border-border text-text-primary" : "bg-brand-primary text-white"
        )}
      >
        {isOpen ? <X className="w-6 h-6" /> : <Sparkles className="w-6 h-6 text-brand-amber" />}
      </button>
    </div>
  );
}

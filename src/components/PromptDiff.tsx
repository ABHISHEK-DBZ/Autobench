import React from 'react';
import { SplitSquareVertical, ArrowRight, Sparkles } from 'lucide-react';

interface PromptDiffProps {
  originalPrompt: string;
  optimizedPrompt: string;
}

export const PromptDiff: React.FC<PromptDiffProps> = ({
  originalPrompt,
  optimizedPrompt
}) => {
  // Simple word-by-word diffing logic for rendering visual highlights
  const diffWords = (orig: string, opt: string) => {
    const origWords = orig.split(/\s+/);
    const optWords = opt.split(/\s+/);
    
    return {
      originalHighlighted: origWords.map((word, idx) => {
        // Words removed or modified are highlighted in amber
        const isModified = !opt.toLowerCase().includes(word.toLowerCase().replace(/[^a-zA-Z]/g, ''));
        return (
          <span 
            key={idx} 
            className={isModified ? 'bg-amber-500/20 text-amber-300 font-semibold px-0.5 rounded' : 'text-slate-300'}
          >
            {word}{' '}
          </span>
        );
      }),
      optimizedHighlighted: optWords.map((word, idx) => {
        // Shrunk compressed words are highlighted in emerald
        const isNewOrCompacted = !orig.toLowerCase().includes(word.toLowerCase().replace(/[^a-zA-Z]/g, ''));
        return (
          <span 
            key={idx} 
            className={isNewOrCompacted ? 'bg-emerald-500/20 text-emerald-300 font-bold px-0.5 rounded' : 'text-slate-300'}
          >
            {word}{' '}
          </span>
        );
      })
    };
  };

  const { originalHighlighted, optimizedHighlighted } = diffWords(originalPrompt, optimizedPrompt);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-emerald-500 to-indigo-500 opacity-60"></div>
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <SplitSquareVertical className="text-emerald-400 w-5 h-5" />
          <h2 className="text-white font-bold font-sans tracking-wide">The "Anti-Gravity" Prompt Diff</h2>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>Codex-Compressed Phrasing Altered</span>
        </div>
      </div>

      {/* Grid Diff View */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Original developer prompt */}
        <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 flex flex-col min-h-48">
          <div className="text-slate-500 text-xs font-mono mb-2 flex items-center justify-between">
            <span>ORIGINAL SYSTEM PROMPT</span>
            <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400 font-semibold">BASELINE</span>
          </div>
          <div className="font-mono text-xs leading-relaxed overflow-y-auto max-h-64 whitespace-pre-wrap">
            {originalHighlighted}
          </div>
        </div>

        {/* Codex-optimized prompt */}
        <div className="bg-slate-950 border border-emerald-950 rounded-lg p-4 flex flex-col min-h-48 relative">
          <div className="absolute top-2 right-2 flex items-center gap-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-mono px-2 py-0.5 rounded font-bold uppercase tracking-wider animate-pulse">
            <ArrowRight className="w-2.5 h-2.5" />
            Optimized
          </div>
          <div className="text-emerald-500/80 text-xs font-mono mb-2">
            CODEX-OPTIMIZED COMPRESSED TEMPLATE
          </div>
          <div className="font-mono text-xs leading-relaxed overflow-y-auto max-h-64 whitespace-pre-wrap">
            {optimizedHighlighted}
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between text-[10px] text-slate-500 font-mono">
        <span>Highlight Code: <span className="text-amber-300 font-bold bg-amber-500/10 px-1 rounded">Amber = Shrunk / Altered</span></span>
        <span><span className="text-emerald-300 font-bold bg-emerald-500/10 px-1 rounded">Emerald = Compression optimizations</span></span>
      </div>
    </div>
  );
};

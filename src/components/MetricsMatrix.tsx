import React from 'react';
import { DollarSign, ShieldAlert, Zap, Layers, TrendingDown } from 'lucide-react';

interface MetricsMatrixProps {
  baselineLatency: number;
  optimizedLatency: number;
  baselineCost: number;
  optimizedCost: number;
  baselineTokens: number;
  optimizedTokens: number;
  accuracyScore: number;
  baselineAccuracy: number;
}

export const MetricsMatrix: React.FC<MetricsMatrixProps> = ({
  baselineLatency,
  optimizedLatency,
  baselineCost,
  optimizedCost,
  baselineTokens,
  optimizedTokens,
  accuracyScore,
  baselineAccuracy
}) => {
  const latencyDelta = optimizedLatency - baselineLatency;
  const isLatencyBetter = latencyDelta <= 0;

  const tokenSavings = baselineTokens > 0
    ? ((baselineTokens - optimizedTokens) / baselineTokens) * 100
    : 0;

  // Cost comparison (multiplied by 1000 for standard 1k requests metric representation)
  const costPer1kBaseline = baselineCost * 1000;
  const costPer1kOptimized = optimizedCost * 1000;
  const costSavedPercentage = baselineCost > 0
    ? ((baselineCost - optimizedCost) / baselineCost) * 100
    : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Prompt Performance Compare */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2">
          <span className="text-slate-400 font-sans text-xs font-semibold uppercase tracking-wider">Baseline vs. Optimized</span>
          <Layers className="text-indigo-400 w-4 h-4" />
        </div>
        <div className="space-y-2 mt-1">
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="text-slate-400">Baseline Prompt:</span>
            <span className="text-white font-semibold">{baselineTokens} tokens</span>
          </div>
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="text-emerald-400">Compressed:</span>
            <span className="text-emerald-400 font-bold">{optimizedTokens} tokens</span>
          </div>
          <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden mt-1.5 flex">
            <div 
              className="bg-emerald-500 h-full transition-all duration-500" 
              style={{ width: `${Math.min(100, Math.max(10, tokenSavings))}%` }}
            ></div>
          </div>
        </div>
        <div className="text-[10px] text-slate-500 font-mono mt-3 text-right">
          -{tokenSavings.toFixed(0)}% Token Compression
        </div>
      </div>

      {/* 2. Latency Delta */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2">
          <span className="text-slate-400 font-sans text-xs font-semibold uppercase tracking-wider">Latency Delta (ms)</span>
          <Zap className="text-amber-400 w-4 h-4" />
        </div>
        <div className="mt-1">
          <div className="flex items-baseline gap-1.5">
            <span className={`text-2xl font-bold font-mono ${isLatencyBetter ? 'text-emerald-400' : 'text-rose-400'}`}>
              {isLatencyBetter ? '' : '+'}{latencyDelta.toFixed(0)} ms
            </span>
            <span className="text-slate-500 text-xs font-mono">
              ({isLatencyBetter ? 'faster' : 'slower'})
            </span>
          </div>
          <div className="flex justify-between text-[11px] text-slate-400 font-mono mt-2 pt-2 border-t border-slate-800">
            <span>Base: {baselineLatency.toFixed(0)}ms</span>
            <span>Opt: {optimizedLatency.toFixed(0)}ms</span>
          </div>
        </div>
        <div className="flex items-center gap-1 text-[10px] font-mono mt-3">
          <span className={`w-2 h-2 rounded-full ${isLatencyBetter ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
          <span className="text-slate-500">Latency distribution matched</span>
        </div>
      </div>

      {/* 3. Token Cost Reduction */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2">
          <span className="text-slate-400 font-sans text-xs font-semibold uppercase tracking-wider">Cost Reduction (1K requests)</span>
          <DollarSign className="text-emerald-400 w-4 h-4" />
        </div>
        <div className="mt-1">
          <div className="flex items-baseline gap-1 bg-emerald-500/5 border border-emerald-500/10 px-2 py-1 rounded">
            <TrendingDown className="w-4 h-4 text-emerald-400 mr-0.5" />
            <span className="text-xl font-bold font-mono text-emerald-400">
              {costSavedPercentage.toFixed(1)}%
            </span>
            <span className="text-slate-400 text-xs font-mono font-semibold">saved</span>
          </div>
          <div className="flex justify-between text-[11px] text-slate-400 font-mono mt-2">
            <span>Base: ${costPer1kBaseline.toFixed(4)}</span>
            <span>Opt: ${costPer1kOptimized.toFixed(4)}</span>
          </div>
        </div>
        <div className="text-[10px] text-slate-500 font-mono mt-3 text-right">
          Estimated $ saving per 1k runs
        </div>
      </div>

      {/* 4. Format Accuracy Score */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2">
          <span className="text-slate-400 font-sans text-xs font-semibold uppercase tracking-wider">Format Accuracy Score</span>
          <ShieldAlert className="text-indigo-400 w-4 h-4" />
        </div>
        <div className="mt-1 space-y-1">
          <div className="flex justify-between items-baseline">
            <span className="text-2xl font-bold font-mono text-white">{accuracyScore.toFixed(0)}%</span>
            <span className="text-slate-500 text-[10px] font-mono">Strict JSON checks</span>
          </div>
          <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-1">
            <span>Baseline Accuracy:</span>
            <span>{baselineAccuracy.toFixed(0)}%</span>
          </div>
        </div>
        <div className="flex items-center gap-1 text-[10px] font-mono mt-3">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span className="text-emerald-400">Validated: Output keys confirmed</span>
        </div>
      </div>
    </div>
  );
};

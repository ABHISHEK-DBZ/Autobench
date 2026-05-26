import React from 'react';
import { Route } from 'lucide-react';
import type { SplitRequest, ShadowDeployStats } from '../core/proxy';

interface ShadowRoutingPanelProps {
  stats: ShadowDeployStats;
  runs: SplitRequest[];
}

export const ShadowRoutingPanel: React.FC<ShadowRoutingPanelProps> = ({
  stats,
  runs
}) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-emerald-500 via-indigo-500 to-rose-500 opacity-60"></div>
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Route className="text-emerald-400 w-5 h-5" />
          <h2 className="text-white font-bold font-sans tracking-wide">Live Shadow Deploy Routing Engine</h2>
        </div>
        <span className={`border text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase tracking-wider ${
          stats.circuitBreakerTripped 
            ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' 
            : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
        }`}>
          {stats.circuitBreakerTripped ? 'Circuit Breaker: TRIPPED' : 'circuit breaker: NORMAL'}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Proxy configuration */}
        <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 space-y-4">
          <h3 className="text-slate-400 text-xs font-mono font-semibold uppercase tracking-wider">Traffic Splitting</h3>
          
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs font-mono text-slate-300 mb-1">
                <span>Stable Production (Active):</span>
                <span className="font-bold text-white">{stats.stableRouteWeight}%</span>
              </div>
              <div className="h-2 w-full bg-slate-900 rounded overflow-hidden">
                <div className="bg-blue-500 h-full rounded" style={{ width: '99%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono text-slate-300 mb-1">
                <span>Shadow Candidate Prompt:</span>
                <span className={`font-bold ${stats.circuitBreakerTripped ? 'text-rose-500 line-through' : 'text-emerald-400'}`}>
                  {stats.circuitBreakerTripped ? '0% (KILLED)' : '1%'}
                </span>
              </div>
              <div className="h-2 w-full bg-slate-900 rounded overflow-hidden">
                <div 
                  className={`h-full rounded ${stats.circuitBreakerTripped ? 'bg-rose-500/30' : 'bg-emerald-500'}`} 
                  style={{ width: stats.circuitBreakerTripped ? '0%' : '1%' }}
                ></div>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-900 space-y-2 text-[11px] font-mono">
            <div className="flex justify-between">
              <span className="text-slate-500">LLM-as-a-Judge Score:</span>
              <span className="text-emerald-400 font-bold">{stats.candidateAverageAccuracy}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Anomaly Rate flagged:</span>
              <span className={stats.anomalyRate > 0 ? 'text-rose-400 font-semibold' : 'text-slate-400'}>
                {stats.anomalyRate}%
              </span>
            </div>
          </div>
        </div>

        {/* Live A/B Shadow logs */}
        <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 md:col-span-2 flex flex-col h-56">
          <div className="text-slate-500 text-xs font-mono mb-2 flex justify-between items-center">
            <span>LIVE A/B ROUTING TELEMETRY STREAM (1% SPLIT)</span>
            <span className={`w-2 h-2 rounded-full ${stats.circuitBreakerTripped ? 'bg-rose-500' : 'bg-emerald-500 animate-pulse'}`}></span>
          </div>
          <div className="font-mono text-[10px] overflow-y-auto flex-1 space-y-1.5 text-slate-300 scrollbar-thin">
            {runs.length === 0 ? (
              <div className="text-slate-600 italic">Shadow proxy idle. Spin up benchmarks to see splits.</div>
            ) : (
              runs.map((r) => {
                const hasAnomaly = r.isAnomaly;
                return (
                  <div 
                    key={r.requestId} 
                    className={`p-1.5 rounded border ${
                      hasAnomaly 
                        ? 'bg-rose-500/5 border-rose-500/10 text-rose-300' 
                        : 'bg-slate-900/40 border-slate-900 text-slate-300'
                    }`}
                  >
                    <div className="flex justify-between text-[9px] font-semibold text-slate-500 mb-0.5">
                      <span>REQ ID: {r.requestId}</span>
                      <span>JUDGE ACCURACY: {r.judgeCorrectnessScore}%</span>
                    </div>
                    <div className="truncate">Payload: "{r.payload}"</div>
                    <div className="flex justify-between text-[9px] text-slate-400 mt-1">
                      <span>Stable Latency: {r.stableLatencyMs.toFixed(0)}ms</span>
                      <span className={hasAnomaly ? 'text-rose-400 font-bold' : 'text-emerald-400 font-semibold'}>
                        Candidate Latency: {r.candidateLatencyMs.toFixed(0)}ms {hasAnomaly ? '(ANOMALY SPARK)' : ''}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

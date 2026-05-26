import React from 'react';
import { Globe } from 'lucide-react';
import type { RegionalMetrics } from '../core/telemetry';

interface GlobalMeshMapProps {
  metrics: RegionalMetrics[];
}

export const GlobalMeshMap: React.FC<GlobalMeshMapProps> = ({
  metrics
}) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-emerald-500 via-indigo-500 to-rose-500 opacity-60"></div>
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Globe className="text-emerald-400 w-5 h-5 animate-pulse" />
          <h2 className="text-white font-bold font-sans tracking-wide">Global Telemetry Edge Mesh</h2>
        </div>
        <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase tracking-wider">
          Multi-Region Simulation Active
        </span>
      </div>

      {/* Grid distribution */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {metrics.map((reg) => {
          const isIndia = reg.region === 'ap-south-1';
          const isEurope = reg.region === 'eu-west-1';
          const regionLabel = isIndia ? 'Mumbai (ap-south-1)' : isEurope ? 'Dublin (eu-west-1)' : 'N. Virginia (us-east-1)';
          
          return (
            <div key={reg.region} className="bg-slate-950 border border-slate-800 rounded-lg p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-slate-900 pb-2 mb-2">
                  <span className="text-xs font-bold font-sans text-white">{regionLabel}</span>
                  <span className="bg-slate-900 text-[10px] font-mono text-slate-400 px-1.5 py-0.5 rounded uppercase font-semibold">
                    {reg.region}
                  </span>
                </div>

                <div className="space-y-2 mt-3">
                  {/* P50/P95/P99 Horizontal Bars */}
                  <div>
                    <div className="flex justify-between text-[10px] font-mono text-slate-400 mb-0.5">
                      <span>P50 Latency:</span>
                      <span className="text-white">{reg.p50Ms} ms</span>
                    </div>
                    <div className="h-2 w-full bg-slate-900 rounded overflow-hidden">
                      <div 
                        className="bg-emerald-500 h-full rounded transition-all duration-500" 
                        style={{ width: `${Math.min(100, reg.p50Ms / 8)}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[10px] font-mono text-slate-400 mb-0.5">
                      <span>P95 Latency:</span>
                      <span className="text-amber-400">{reg.p95Ms} ms</span>
                    </div>
                    <div className="h-2 w-full bg-slate-900 rounded overflow-hidden">
                      <div 
                        className="bg-amber-500 h-full rounded transition-all duration-500" 
                        style={{ width: `${Math.min(100, reg.p95Ms / 8)}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[10px] font-mono text-slate-400 mb-0.5">
                      <span>P99 Latency:</span>
                      <span className="text-rose-400 font-bold">{reg.p99Ms} ms</span>
                    </div>
                    <div className="h-2 w-full bg-slate-900 rounded overflow-hidden">
                      <div 
                        className="bg-rose-500 h-full rounded transition-all duration-500" 
                        style={{ width: `${Math.min(100, reg.p99Ms / 8)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sovereign data compliance indicator */}
              <div className="mt-4 pt-3 border-t border-slate-900 flex items-center justify-between text-[10px] font-mono">
                <span className="text-slate-500">GDPR Compliance:</span>
                <span className={`font-bold ${reg.sovereignAuditsPassed ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {reg.sovereignAuditsPassed ? '✓ SECURE BOUNDARY' : '! AUDIT FLAG'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

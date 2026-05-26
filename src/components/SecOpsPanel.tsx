import React from 'react';
import { ShieldCheck, ShieldAlert, Key, Ban } from 'lucide-react';
import type { SecurityStatus } from '../core/security';

interface SecOpsPanelProps {
  status: SecurityStatus;
  sanitizeLogs: string[];
}

export const SecOpsPanel: React.FC<SecOpsPanelProps> = ({
  status,
  sanitizeLogs
}) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-emerald-500 via-amber-500 to-rose-500 opacity-60"></div>
      
      {/* Top Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <ShieldCheck className="text-emerald-400 w-5 h-5" />
          <h2 className="text-white font-bold font-sans tracking-wide">SecOps Inline Interceptor</h2>
        </div>
        <span className="bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase tracking-wider">
          Runtime Shield Active
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Guardrails Status Card */}
        <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 space-y-3">
          <h3 className="text-slate-400 text-xs font-mono font-semibold uppercase tracking-wider">Shield Status</h3>
          
          <div className="space-y-2.5">
            <div className="flex items-center justify-between border-b border-slate-900 pb-2">
              <span className="text-xs text-slate-400 font-sans flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-indigo-400" />
                Prompt Sanitizer
              </span>
              <span className="text-xs font-mono text-emerald-400 font-semibold bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/10">Active</span>
            </div>

            <div className="flex items-center justify-between border-b border-slate-900 pb-2">
              <span className="text-xs text-slate-400 font-sans flex items-center gap-1.5">
                <Ban className="w-3.5 h-3.5 text-amber-400" />
                Command Whitelist
              </span>
              <span className="text-xs font-mono text-emerald-400 font-semibold bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/10">Locked</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-sans flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                Token-Ceiling Protection
              </span>
              <span className="text-xs font-mono text-emerald-400 font-semibold bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/10">3.0x Max Limit</span>
            </div>
          </div>
        </div>

        {/* Live Interceptor Terminal Logs */}
        <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 md:col-span-2 flex flex-col h-48">
          <div className="text-slate-500 text-xs font-mono mb-2 flex justify-between items-center">
            <span>INLINE INTERCEPTOR AUDIT TRAIL ({status.isSafe ? 'SECURE' : 'THREAT BLOCKED'})</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>
          <div className="font-mono text-[11px] overflow-y-auto flex-1 space-y-1 text-slate-300 scrollbar-thin">
            {sanitizeLogs.length === 0 ? (
              <div className="text-slate-600 italic">Audit log waiting for execution cycles...</div>
            ) : (
              sanitizeLogs.map((log, idx) => {
                let colorClass = 'text-slate-300';
                if (log.includes('[CRITICAL]') || log.includes('BLOCKED') || log.includes('Vulnerability') || log.includes('injection')) colorClass = 'text-rose-400 font-semibold';
                if (log.includes('[SEC-GUARD]')) colorClass = 'text-indigo-300';
                return (
                  <div key={idx} className={colorClass}>
                    {log}
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

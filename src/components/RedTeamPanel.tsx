import React from 'react';
import { Skull, AlertTriangle, ShieldCheck } from 'lucide-react';
import type { VulnerabilityRecord } from '../core/redteam';

interface RedTeamPanelProps {
  vulns: VulnerabilityRecord[];
  isSimulating: boolean;
  onSimulate: () => void;
}

export const RedTeamPanel: React.FC<RedTeamPanelProps> = ({
  vulns,
  isSimulating,
  onSimulate
}) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-red-500 via-amber-500 to-rose-600 opacity-60"></div>
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Skull className="text-rose-500 w-5 h-5 animate-bounce" />
          <h2 className="text-white font-bold font-sans tracking-wide">Adversarial Red-Teaming Simulator</h2>
        </div>

        <button
          onClick={onSimulate}
          disabled={isSimulating}
          className={`flex items-center justify-center gap-2 px-4 py-1.5 rounded font-bold font-sans text-xs transition-all duration-200 ${
            isSimulating
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
              : 'bg-rose-950 hover:bg-rose-900 text-rose-300 shadow border border-rose-500/20 active:scale-95'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          {isSimulating ? 'Simulating 50 Attacks...' : 'Trigger 50 Adversarial Injections'}
        </button>
      </div>

      {/* Main Container */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Threat levels overview */}
        <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 space-y-4">
          <h3 className="text-slate-400 text-xs font-mono font-semibold uppercase tracking-wider">Vulnerability Threat Levels</h3>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between bg-red-950/20 border border-red-500/10 px-2 py-1.5 rounded">
              <span className="text-xs font-bold text-red-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                Critical
              </span>
              <span className="text-xs font-mono font-bold text-slate-300">
                {vulns.filter(v => v.threatLevel === 'Critical').length} flagged
              </span>
            </div>

            <div className="flex items-center justify-between bg-amber-950/20 border border-amber-500/10 px-2 py-1.5 rounded">
              <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                High
              </span>
              <span className="text-xs font-mono font-bold text-slate-300">
                {vulns.filter(v => v.threatLevel === 'High').length} flagged
              </span>
            </div>

            <div className="flex items-center justify-between bg-indigo-950/20 border border-indigo-500/10 px-2 py-1.5 rounded">
              <span className="text-xs font-bold text-indigo-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                Medium / Low
              </span>
              <span className="text-xs font-mono font-bold text-slate-300">
                {vulns.filter(v => v.threatLevel === 'Medium' || v.threatLevel === 'Low').length} flagged
              </span>
            </div>
          </div>
        </div>

        {/* Vulnerability Matrix */}
        <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 md:col-span-2 flex flex-col h-56">
          <div className="text-slate-500 text-xs font-mono mb-2">VULNERABILITY MATRIX REPORT</div>
          <div className="font-mono text-[10px] overflow-y-auto flex-1 space-y-2 text-slate-300 scrollbar-thin">
            {vulns.length === 0 ? (
              <div className="text-slate-600 italic">No threats simulated. Click Trigger above to red-team the prompt.</div>
            ) : (
              vulns.map((v, idx) => (
                <div key={idx} className="p-2 rounded border border-slate-900 bg-slate-900/30">
                  <div className="flex justify-between items-center mb-1">
                    <span className={`font-bold ${
                      v.threatLevel === 'Critical' ? 'text-red-400' : v.threatLevel === 'High' ? 'text-amber-400' : 'text-indigo-400'
                    }`}>
                      [{v.threatLevel}] {v.vulnType}
                    </span>
                    <span className="text-[8px] bg-slate-800 text-slate-500 px-1.5 py-0.5 rounded uppercase font-semibold">Flagged</span>
                  </div>
                  <div className="text-slate-400 mb-1">Payload used: <span className="text-slate-300 font-semibold italic">"{v.payload}"</span></div>
                  <div className="text-emerald-400 flex items-start gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Remediation: {v.remediation}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

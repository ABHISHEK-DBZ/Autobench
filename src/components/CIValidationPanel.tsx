import React from 'react';
import { ShieldCheck, ShieldAlert, Cpu, Download } from 'lucide-react';

interface CIValidationPanelProps {
  exitCode: number | null;
  ciLogs: string[];
  onTriggerCI: () => void;
  onExportBenchmark: () => void;
}

export const CIValidationPanel: React.FC<CIValidationPanelProps> = ({
  exitCode,
  ciLogs,
  onTriggerCI,
  onExportBenchmark
}) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-emerald-500 via-amber-500 to-rose-500 opacity-60"></div>
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Cpu className="text-emerald-400 w-5 h-5 animate-pulse" />
          <h2 className="text-white font-bold font-sans tracking-wide">CI/CD Gate Integration</h2>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={onTriggerCI}
            className="flex items-center justify-center gap-1.5 px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold font-sans text-xs rounded transition-all duration-200"
          >
            Run CI Gate Check
          </button>
          
          <button
            onClick={onExportBenchmark}
            className="flex items-center justify-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold font-sans text-xs rounded transition-all duration-200 border border-slate-700"
          >
            <Download className="w-3.5 h-3.5" />
            Push to GitHub (BENCHMARK.md)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Status widget */}
        <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 flex flex-col justify-between">
          <h3 className="text-slate-400 text-xs font-mono font-semibold uppercase tracking-wider">Gate Runner Result</h3>
          
          <div className="my-3">
            {exitCode === null ? (
              <div className="text-slate-500 font-mono text-xs italic">CI gate idle. Run check above.</div>
            ) : exitCode === 0 ? (
              <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 rounded text-emerald-400 font-mono font-bold text-xs uppercase">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>EXIT CODE 0: PASSED</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 bg-rose-500/10 border border-rose-500/20 px-3 py-2 rounded text-rose-400 font-mono font-bold text-xs uppercase">
                <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 animate-pulse" />
                <span>EXIT CODE 1: FAILED</span>
              </div>
            )}
          </div>

          <div className="text-[10px] text-slate-500 font-mono leading-relaxed">
            Checks candidates against configured enterprise constraints: Latency &lt; 400ms, Correctness &gt; 95%.
          </div>
        </div>

        {/* Headless action logs */}
        <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 md:col-span-2 flex flex-col h-44">
          <div className="text-slate-500 text-xs font-mono mb-2">CI HEADLESS STDOUT TRAIL</div>
          <div className="font-mono text-[10px] overflow-y-auto flex-1 space-y-1 text-slate-300 scrollbar-thin">
            {ciLogs.length === 0 ? (
              <div className="text-slate-600 italic">Logs will stream when pipeline runs...</div>
            ) : (
              ciLogs.map((log, idx) => {
                let colorClass = 'text-slate-300';
                if (log.includes('[CRITICAL-FAIL]')) colorClass = 'text-rose-400 font-bold';
                if (log.includes('[SUCCESS]')) colorClass = 'text-emerald-400';
                if (log.includes('[CI/CD GATE]')) colorClass = 'text-slate-400';
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

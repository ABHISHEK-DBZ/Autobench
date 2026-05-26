import React from 'react';
import { Terminal, Play } from 'lucide-react';

interface LogStreamItem {
  sandboxId: 'A' | 'B' | 'C';
  text: string;
  type: 'stdout' | 'stderr';
}

interface SandboxStreamerProps {
  logs: LogStreamItem[];
  isRunning: boolean;
  onStartSimulation: () => void;
}

export const SandboxStreamer: React.FC<SandboxStreamerProps> = ({
  logs,
  isRunning,
  onStartSimulation
}) => {
  const getLogsForSandbox = (id: 'A' | 'B' | 'C') => {
    return logs.filter(l => l && l.sandboxId === id);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-emerald-500 via-amber-500 to-rose-500 opacity-60"></div>
      
      {/* Top Bar Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Terminal className="text-emerald-400 w-5 h-5 animate-pulse" />
          <h2 className="text-white font-bold font-sans tracking-wide">Parallel Sandbox Streamer</h2>
          <span className="bg-emerald-500/10 text-emerald-400 text-xs px-2 py-0.5 rounded font-mono border border-emerald-500/20">Worktree Isolation</span>
        </div>

        <button
          onClick={onStartSimulation}
          disabled={isRunning}
          className={`flex items-center justify-center gap-2 px-5 py-2 rounded-lg font-bold font-sans text-sm transition-all duration-200 ${
            isRunning
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
              : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-950 border border-emerald-400/20 active:scale-95'
          }`}
        >
          <Play className={`w-4 h-4 ${isRunning ? 'animate-spin' : ''}`} />
          {isRunning ? 'Running Simulations...' : 'Execute Parallel Benchmarks'}
        </button>
      </div>

      {/* Sandboxes Container */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Sandbox A */}
        <div className="bg-slate-950 border border-slate-800 rounded-lg overflow-hidden flex flex-col h-72">
          <div className="bg-slate-900 px-3 py-2 flex items-center justify-between border-b border-slate-800">
            <span className="text-white text-xs font-mono font-semibold flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-600 animate-pulse"></span>
              Sandbox A (Baseline)
            </span>
            <span className="text-slate-500 font-mono text-[10px]">thread-109A</span>
          </div>
          <div className="p-3 font-mono text-[11px] overflow-y-auto flex-1 space-y-1.5 scrollbar-thin text-slate-300">
            {getLogsForSandbox('A').length === 0 ? (
              <div className="text-slate-600 italic">Waiting to spin up worker...</div>
            ) : (
              getLogsForSandbox('A').map((log, idx) => (
                <div key={idx} className={log.type === 'stderr' ? 'text-rose-400' : 'text-slate-300'}>
                  {log.text}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Sandbox B */}
        <div className="bg-slate-950 border border-slate-800 rounded-lg overflow-hidden flex flex-col h-72">
          <div className="bg-slate-900 px-3 py-2 flex items-center justify-between border-b border-slate-800">
            <span className="text-white text-xs font-mono font-semibold flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
              Sandbox B (Stress/Adversarial)
            </span>
            <span className="text-slate-500 font-mono text-[10px]">thread-109B</span>
          </div>
          <div className="p-3 font-mono text-[11px] overflow-y-auto flex-1 space-y-1.5 scrollbar-thin text-slate-300">
            {getLogsForSandbox('B').length === 0 ? (
              <div className="text-slate-600 italic">Waiting to spin up worker...</div>
            ) : (
              getLogsForSandbox('B').map((log, idx) => (
                <div key={idx} className={log.type === 'stderr' ? 'text-amber-400 font-semibold' : 'text-slate-300'}>
                  {log.text}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Sandbox C */}
        <div className="bg-slate-950 border border-slate-800 rounded-lg overflow-hidden flex flex-col h-72">
          <div className="bg-slate-900 px-3 py-2 flex items-center justify-between border-b border-slate-800">
            <span className="text-white text-xs font-mono font-semibold flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse animate-glow-green"></span>
              Sandbox C (Optimized)
            </span>
            <span className="text-slate-500 font-mono text-[10px]">thread-109C</span>
          </div>
          <div className="p-3 font-mono text-[11px] overflow-y-auto flex-1 space-y-1.5 scrollbar-thin text-slate-300">
            {getLogsForSandbox('C').length === 0 ? (
              <div className="text-slate-600 italic">Waiting to spin up worker...</div>
            ) : (
              getLogsForSandbox('C').map((log, idx) => (
                <div key={idx} className={log.type === 'stderr' ? 'text-rose-400' : 'text-emerald-400'}>
                  {log.text}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

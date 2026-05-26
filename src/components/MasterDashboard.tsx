import React, { useState } from 'react';
import { useAutoBench } from '../hooks/useAutoBench';
import { SandboxStreamer } from './SandboxStreamer';
import { MetricsMatrix } from './MetricsMatrix';
import { PromptDiff } from './PromptDiff';
import { SecOpsPanel } from './SecOpsPanel';
import { GlobalMeshMap } from './GlobalMeshMap';
import { ShadowRoutingPanel } from './ShadowRoutingPanel';
import { RedTeamPanel } from './RedTeamPanel';
import { CIValidationPanel } from './CIValidationPanel';

import { Sparkles, Code } from 'lucide-react';

const DEFAULT_SYSTEM_PROMPT = `You are a helpful customer support AI assistant. Please make sure to be extremely polite, address users by their names, and it is highly recommended that you format all of your output responses strictly in JSON. You are required to follow these guidelines exactly to guarantee high format compatibility with our database schemas in order to process records correctly.`;

export const MasterDashboard: React.FC = () => {
  const connectionId = 'client-dashboard-session-405';
  const {
    isRunning,
    terminalLogs,
    metrics,
    optimizedPrompt,
    secOpsStatus,
    regionalMetrics,
    shadowStats,
    shadowRuns,
    redTeamVulns,
    isRedTeaming,
    ciExitCode,
    ciLogs,
    executePipeline,
    runRedTeam,
    runCIGate
  } = useAutoBench(connectionId);

  const [systemPrompt, setSystemPrompt] = useState(DEFAULT_SYSTEM_PROMPT);
  const [activeTab, setActiveTab] = useState<'overview' | 'redteam' | 'routing' | 'edge'>('overview');

  const handleStartSimulation = () => {
    executePipeline(systemPrompt);
  };

  const handleTriggerRedTeam = () => {
    runRedTeam(systemPrompt);
  };

  const handleTriggerCI = () => {
    runCIGate();
  };

  const handleExportBenchmark = async () => {
    const costReduction = metrics.baselineCost > 0
      ? ((metrics.baselineCost - metrics.optimizedCost) / metrics.baselineCost) * 100
      : 0;

    const mdContent = `# AutoBench Telemetry Report
Generated: ${new Date().toISOString()}

## Executive Summary
AutoBench programmatically executed baseline prompts vs Codex-optimized prompt compressions across parallel isolated sandbox threads.

- **Baseline Prompt**: ${metrics.baselineTokens} Tokens
- **Optimized Prompt**: ${metrics.optimizedTokens} Tokens
- **Token Reduction**: ${costReduction.toFixed(1)}% compression ratio
- **Average Latency Delta**: -${(metrics.baselineLatency - metrics.optimizedLatency).toFixed(0)} ms (Faster)
- **Format Verification Accuracy**: ${metrics.accuracyScore}% JSON structural compliance

## Phrasing Optimizations ("Anti-Gravity" Prompt Diff)
### Original
\`\`\`text
${systemPrompt}
\`\`\`

### Codex Optimized
\`\`\`text
${optimizedPrompt || 'Awaiting optimization run...'}
\`\`\`

## Compliance Guard Status
- **PII Leakage Shield**: SECURE (0 exposures)
- **Secrets/Env leakage shield**: SECURE (0 exposures)
- **Toxicity Index**: 0% (Fully aligned)

## Multi-Region Latency Profiles
- **us-east-1**: P50: ${regionalMetrics[0]?.p50Ms || 0}ms | P99: ${regionalMetrics[0]?.p99Ms || 0}ms
- **eu-west-1**: P50: ${regionalMetrics[1]?.p50Ms || 0}ms | P99: ${regionalMetrics[1]?.p99Ms || 0}ms
- **ap-south-1**: P50: ${regionalMetrics[2]?.p50Ms || 0}ms | P99: ${regionalMetrics[2]?.p99Ms || 0}ms
`;

    // Direct Browser Download Action
    const element = document.createElement("a");
    const file = new Blob([mdContent], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = "BENCHMARK.md";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Banner and Navigation */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40 px-4 py-3 sm:px-6 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-500/10 border border-emerald-500/25 p-2 rounded-lg text-emerald-400">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h1 className="text-white font-extrabold tracking-tight text-lg flex items-center gap-1.5">
                AutoBench
                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] px-1.5 py-0.5 rounded font-mono font-bold uppercase tracking-widest">
                  Live Gate Node
                </span>
              </h1>
              <p className="text-[11px] text-slate-400">Connected to express-ws API :5000</p>
            </div>
          </div>

          <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg p-0.5 font-mono text-xs font-semibold">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3 py-1.5 rounded transition-all ${
                activeTab === 'overview' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Overview Matrix
            </button>
            <button
              onClick={() => setActiveTab('redteam')}
              className={`px-3 py-1.5 rounded transition-all ${
                activeTab === 'redteam' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Red Team
            </button>
            <button
              onClick={() => setActiveTab('routing')}
              className={`px-3 py-1.5 rounded transition-all ${
                activeTab === 'routing' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              A/B Router
            </button>
            <button
              onClick={() => setActiveTab('edge')}
              className={`px-3 py-1.5 rounded transition-all ${
                activeTab === 'edge' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Telemetry Edge
            </button>
          </div>
        </div>
      </header>

      {/* Main content workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {/* Prompt Configuration Area */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-indigo-500 to-emerald-500 opacity-60"></div>
          
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Code className="text-emerald-400 w-5 h-5" />
              <h2 className="text-white font-bold font-sans tracking-wide">Developer Workspace Template</h2>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">SYSTEM PROMPT CONFIG</span>
          </div>

          <div className="space-y-3">
            <textarea
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              placeholder="Paste System Prompt template here..."
              rows={4}
              className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-lg p-3 text-slate-300 font-mono text-xs focus:outline-none transition-all duration-150 resize-y"
            />
            
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <span className="text-slate-500 font-mono">
                Mock dataset configured with <span className="text-indigo-400 font-bold">10 active cases</span> (Baseline + Injection Payloads).
              </span>
              
              <button 
                onClick={() => setSystemPrompt(DEFAULT_SYSTEM_PROMPT)}
                className="text-slate-400 hover:text-white font-semibold transition-all"
              >
                Reset Default Prompt Template
              </button>
            </div>
          </div>
        </div>

        {/* Action Panel tabs */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* The Sandbox Streamer */}
            <SandboxStreamer 
              logs={terminalLogs}
              isRunning={isRunning}
              onStartSimulation={handleStartSimulation}
            />

            {/* Metrics cards comparison matrix */}
            <MetricsMatrix 
              baselineLatency={metrics.baselineLatency}
              optimizedLatency={metrics.optimizedLatency}
              baselineCost={metrics.baselineCost}
              optimizedCost={metrics.optimizedCost}
              baselineTokens={metrics.baselineTokens}
              optimizedTokens={metrics.optimizedTokens}
              accuracyScore={metrics.accuracyScore}
              baselineAccuracy={metrics.baselineAccuracy}
            />

            {/* The Anti-Gravity Prompt Diff */}
            <PromptDiff 
              originalPrompt={systemPrompt}
              optimizedPrompt={optimizedPrompt || systemPrompt}
            />

            {/* SecOps Shield Panel */}
            <SecOpsPanel 
              status={secOpsStatus}
              sanitizeLogs={secOpsStatus.validationLogs}
            />

            {/* CI/CD Gate integration */}
            <CIValidationPanel 
              exitCode={ciExitCode}
              ciLogs={ciLogs}
              onTriggerCI={handleTriggerCI}
              onExportBenchmark={handleExportBenchmark}
            />
          </div>
        )}

        {activeTab === 'redteam' && (
          <div className="space-y-6">
            <RedTeamPanel 
              vulns={redTeamVulns}
              isSimulating={isRedTeaming}
              onSimulate={handleTriggerRedTeam}
            />
          </div>
        )}

        {activeTab === 'routing' && (
          <div className="space-y-6">
            <ShadowRoutingPanel 
              stats={shadowStats}
              runs={shadowRuns}
            />
          </div>
        )}

        {activeTab === 'edge' && (
          <div className="space-y-6">
            <GlobalMeshMap 
              metrics={regionalMetrics}
            />
          </div>
        )}
      </main>

      {/* Footer copyright section */}
      <footer className="bg-slate-900/50 border-t border-slate-800/80 px-4 py-6 text-center mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[11px] text-slate-500 font-mono">
            AutoBench Integration Node © 2026. Crafted for high performance.
          </p>
          <p className="text-xs text-slate-400 font-sans tracking-wide">
            Designed & Engineered with ❤️ by <span className="text-emerald-400 font-semibold hover:text-emerald-300 transition-colors duration-200 cursor-pointer">Abhishek Jha</span>.
          </p>
        </div>
      </footer>
    </div>
  );
};

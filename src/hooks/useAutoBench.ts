import { useState, useEffect, useRef, useCallback } from 'react';
import type { TestCase, UnifiedTelemetryReport } from '../core/orchestrator';
import type { SecurityStatus } from '../core/security';
import type { VulnerabilityRecord } from '../core/redteam';
import type { RegionalMetrics } from '../core/telemetry';
import type { SplitRequest, ShadowDeployStats } from '../core/proxy';

export interface LogStreamItem {
  sandboxId: 'A' | 'B' | 'C';
  text: string;
  type: 'stdout' | 'stderr';
}

export const useAutoBench = (clientId: string) => {
  const [isRunning, setIsRunning] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState<LogStreamItem[]>([]);
  const [optimizedPrompt, setOptimizedPrompt] = useState('');
  
  // Benchmark metrics
  const [metrics, setMetrics] = useState({
    baselineLatency: 185,
    optimizedLatency: 135,
    baselineCost: 0.00045,
    optimizedCost: 0.00031,
    baselineTokens: 110,
    optimizedTokens: 78,
    accuracyScore: 98,
    baselineAccuracy: 95
  });

  // SecOps status
  const [secOpsStatus, setSecOpsStatus] = useState<SecurityStatus>({
    isSafe: true,
    neutralizedInjections: [],
    blockedCommands: [],
    tokenCeilingTriggered: false,
    validationLogs: []
  });

  // Advanced modules
  const [regionalMetrics, setRegionalMetrics] = useState<RegionalMetrics[]>([
    {
      region: 'us-east-1',
      p50Ms: 145.2,
      p95Ms: 198.5,
      p99Ms: 245.1,
      avgTTFTMs: 88.4,
      sovereignAuditsPassed: true,
      samplesCount: 15,
      telemetries: []
    },
    {
      region: 'eu-west-1',
      p50Ms: 215.4,
      p95Ms: 298.1,
      p99Ms: 388.9,
      avgTTFTMs: 148.2,
      sovereignAuditsPassed: true,
      samplesCount: 15,
      telemetries: []
    },
    {
      region: 'ap-south-1',
      p50Ms: 450.8,
      p95Ms: 588.3,
      p99Ms: 720.6,
      avgTTFTMs: 284.1,
      sovereignAuditsPassed: true,
      samplesCount: 15,
      telemetries: []
    }
  ]);
  const [shadowStats, setShadowStats] = useState<ShadowDeployStats>({
    stableRouteWeight: 99,
    candidateRouteWeight: 1,
    totalRequestsSplit: 2,
    candidateAverageAccuracy: 98.8,
    circuitBreakerTripped: false,
    anomalyRate: 0
  });
  const [shadowRuns, setShadowRuns] = useState<SplitRequest[]>([
    {
      requestId: 'req-shadow-init1',
      payload: 'Hello, my name is John. Can you explain pricing tiers?',
      stableResponse: '{"success": true, "data": "Processed stable response for customer John..."}',
      candidateResponse: '{"success": true, "data": "Fast-tracked compressed candidate processing..."}',
      stableLatencyMs: 124.5,
      candidateLatencyMs: 92.1,
      judgeCorrectnessScore: 98.5,
      isAnomaly: false
    },
    {
      requestId: 'req-shadow-init2',
      payload: 'Is there a limit on API requests for enterprise tier?',
      stableResponse: '{"success": true, "data": "Processed stable response for enterprise tier query..."}',
      candidateResponse: '{"success": true, "data": "Fast-tracked compressed candidate processing..."}',
      stableLatencyMs: 132.8,
      candidateLatencyMs: 98.4,
      judgeCorrectnessScore: 99.2,
      isAnomaly: false
    }
  ]);
  
  // Red team
  const [redTeamVulns, setRedTeamVulns] = useState<VulnerabilityRecord[]>([]);
  const [isRedTeaming, setIsRedTeaming] = useState(false);

  // CI/CD
  const [ciExitCode, setCiExitCode] = useState<number | null>(null);
  const [ciLogs, setCiLogs] = useState<string[]>([]);

  const wsRef = useRef<WebSocket | null>(null);

  // Initialize highly resilient WebSocket log streaming connection
  useEffect(() => {
    let ws: WebSocket | null = null;
    let reconnectTimeout: number | null = null;
    let active = true;

    const connect = () => {
      if (!active) return;
      
      // Use relative WS URL so Vite proxy forwards to backend automatically
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/ws?clientId=${clientId}`;
      ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        if (active) {
          console.log(`[useAutoBench] WebSocket connected for client ID: ${clientId}`);
        }
      };

      ws.onmessage = (event) => {
        if (!active) return;
        try {
          const frame = JSON.parse(event.data);
          // Server sends { event: 'log', payload: LogStreamItem }
          if (frame.event === 'log' && frame.payload && frame.payload.sandboxId) {
            setTerminalLogs((prev) => [...prev, frame.payload as LogStreamItem]);
          }
        } catch (err) {
          console.error('[useAutoBench] WebSocket frame parse error', err);
        }
      };

      ws.onclose = (event) => {
        if (active && event.code !== 1000) {
          console.warn(`[useAutoBench] WebSocket disconnected (code: ${event.code}). Attempting reconnect in 3s...`);
          reconnectTimeout = window.setTimeout(connect, 3000);
        }
      };

      ws.onerror = (err) => {
        if (active) {
          console.error('[useAutoBench] WebSocket error flagged:', err);
        }
      };
    };

    connect();

    // Secure cleanup function targeting StrictMode re-mounting and routing switches
    return () => {
      active = false;
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout);
      }
      if (ws) {
        ws.close(1000, 'Component unmounted safely');
      }
      wsRef.current = null;
    };
  }, [clientId]);

  // Execute pipeline via HTTP POST request
  const executePipeline = useCallback(async (systemPrompt: string) => {
    setIsRunning(true);
    setTerminalLogs([]);
    setCiExitCode(null);
    setCiLogs([]);

    try {
      // 1. Fetch test cases from public directory
      const casesRes = await fetch('/mock_test_cases.json');
      if (!casesRes.ok) {
        throw new Error('Failed to fetch mock test cases configuration.');
      }
      const testCases: TestCase[] = await casesRes.json();

      // 2. Submit pipeline request — uses relative URL, Vite proxy routes to backend
      const benchmarkRes = await fetch('/api/benchmark', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId,
          systemPrompt,
          testCases
        })
      });

      if (!benchmarkRes.ok) {
        const errBody = await benchmarkRes.text();
        throw new Error(`Benchmark execution failed with HTTP ${benchmarkRes.status}: ${errBody}`);
      }

      const report: {
        telemetry: UnifiedTelemetryReport;
        security: SecurityStatus;
        regional: RegionalMetrics[];
        shadow: { stats: ShadowDeployStats; runs: SplitRequest[] };
      } = await benchmarkRes.json();

      // 3. Populate live telemetry metrics into React states
      setMetrics({
        baselineLatency: report.telemetry.sandboxA.avgLatencyMs,
        optimizedLatency: report.telemetry.sandboxC.avgLatencyMs,
        baselineCost: report.telemetry.sandboxA.totalCost,
        optimizedCost: report.telemetry.sandboxC.totalCost,
        baselineTokens: report.telemetry.sandboxA.totalTokens,
        optimizedTokens: report.telemetry.sandboxC.totalTokens,
        accuracyScore: report.telemetry.sandboxC.accuracyScore,
        baselineAccuracy: report.telemetry.sandboxA.accuracyScore
      });

      setOptimizedPrompt(report.telemetry.optimizedPrompt);
      setSecOpsStatus(report.security);
      setRegionalMetrics(report.regional);
      setShadowStats(report.shadow.stats);
      setShadowRuns(report.shadow.runs);

    } catch (err: any) {
      console.error('[useAutoBench] Pipeline run crashed:', err);
      // Stream final critical execution failure log back to sandbox UI
      setTerminalLogs((prev) => [
        ...prev,
        { sandboxId: 'A', text: `[CRITICAL-FAIL] Pipeline runtime error: ${err.message}`, type: 'stderr' }
      ]);
    } finally {
      setIsRunning(false);
    }
  }, [clientId]);

  // Run adversarial red teaming attacks
  const runRedTeam = useCallback(async (systemPrompt: string) => {
    setIsRedTeaming(true);
    setRedTeamVulns([]);

    try {
      const res = await fetch('/api/redteam', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ systemPrompt })
      });

      if (!res.ok) {
        throw new Error(`RedTeam simulation failed with HTTP ${res.status}`);
      }

      const data: { vulnerabilities: VulnerabilityRecord[] } = await res.json();
      setRedTeamVulns(data.vulnerabilities);
    } catch (err: any) {
      console.error('[useAutoBench] Red team run failure:', err);
    } finally {
      setIsRedTeaming(false);
    }
  }, []);

  // Run headless CI validation check
  const runCIGate = useCallback(async () => {
    setCiExitCode(null);
    setCiLogs([]);

    try {
      const res = await fetch('/api/ci-gate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          avgLatencyMs: metrics.optimizedLatency,
          accuracyScore: metrics.accuracyScore,
          costPer1k: (metrics.optimizedCost * 1000) / 10 // 10 test cases
        })
      });

      if (!res.ok) {
        throw new Error(`CI/CD headless gate failed with HTTP ${res.status}`);
      }

      const data: { exitCode: 0 | 1; logs: string[] } = await res.json();
      setCiExitCode(data.exitCode);
      setCiLogs(data.logs);
    } catch (err: any) {
      console.error('[useAutoBench] CI Gate run failure:', err);
    }
  }, [metrics]);

  return {
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
  };
};

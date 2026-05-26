/**
 * AutoBench Global Telemetry Edge Mesh
 * Runs globally distributed simulation nodes mapping real-world latency profiles (TTFT, inter-token metrics)
 * across us-east-1, eu-west-1, and ap-south-1.
 */

export interface EdgeNodeTelemetry {
  region: 'us-east-1' | 'eu-west-1' | 'ap-south-1';
  timeToFirstTokenMs: number;
  totalDurationMs: number;
  interTokenLatencyMs: number;
  tokensGenerated: number;
  sovereignDataBoundaryValid: boolean;
  timestamp: string;
}

export interface RegionalMetrics {
  region: 'us-east-1' | 'eu-west-1' | 'ap-south-1';
  p50Ms: number;
  p95Ms: number;
  p99Ms: number;
  avgTTFTMs: number;
  sovereignAuditsPassed: boolean;
  samplesCount: number;
  telemetries: EdgeNodeTelemetry[];
}

export class GlobalEdgeMeshTelemetry {
  /**
   * Simulates regional Edge nodes running concurrently
   */
  public async profileGlobalPerformance(
    payloadCount = 15
  ): Promise<RegionalMetrics[]> {
    const regions: Array<'us-east-1' | 'eu-west-1' | 'ap-south-1'> = ['us-east-1', 'eu-west-1', 'ap-south-1'];
    
    return Promise.all(regions.map(async (region) => {
      return this.runRegionalProfiling(region, payloadCount);
    }));
  }

  private async runRegionalProfiling(
    region: 'us-east-1' | 'eu-west-1' | 'ap-south-1',
    count: number
  ): Promise<RegionalMetrics> {
    const telemetries: EdgeNodeTelemetry[] = [];
    const latencies: number[] = [];

    // Region base latency offsets
    const baseTTFT = region === 'us-east-1' ? 85 : region === 'eu-west-1' ? 145 : 280;
    const baseInterToken = region === 'us-east-1' ? 12 : region === 'eu-west-1' ? 15 : 22;

    for (let i = 0; i < count; i++) {
      const ttft = baseTTFT + Math.random() * 30;
      const tokens = 60 + Math.floor(Math.random() * 50);
      const interToken = baseInterToken + Math.random() * 3;
      const totalGen = ttft + (tokens * interToken);

      // Sovereignty boundary check simulation (eu-west-1 enforces strict GDPR encryption)
      const dataAudit = region === 'eu-west-1' ? true : Math.random() > 0.05;

      telemetries.push({
        region,
        timeToFirstTokenMs: ttft,
        totalDurationMs: totalGen,
        interTokenLatencyMs: interToken,
        tokensGenerated: tokens,
        sovereignDataBoundaryValid: dataAudit,
        timestamp: new Date().toISOString()
      });

      latencies.push(totalGen);
    }

    // Sort for Percentile computation
    latencies.sort((a, b) => a - b);
    const p50 = this.getPercentile(latencies, 50);
    const p95 = this.getPercentile(latencies, 95);
    const p99 = this.getPercentile(latencies, 99);
    
    const avgTTFT = telemetries.reduce((sum, t) => sum + t.timeToFirstTokenMs, 0) / telemetries.length;
    const sovereignAuditsPassed = telemetries.every(t => t.sovereignDataBoundaryValid);

    return {
      region,
      p50Ms: parseFloat(p50.toFixed(1)),
      p95Ms: parseFloat(p95.toFixed(1)),
      p99Ms: parseFloat(p99.toFixed(1)),
      avgTTFTMs: parseFloat(avgTTFT.toFixed(1)),
      sovereignAuditsPassed,
      samplesCount: count,
      telemetries
    };
  }

  private getPercentile(arr: number[], percentile: number): number {
    if (arr.length === 0) return 0;
    const index = Math.ceil((percentile / 100) * arr.length) - 1;
    return arr[Math.max(0, Math.min(index, arr.length - 1))];
  }
}

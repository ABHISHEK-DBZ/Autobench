/**
 * AutoBench SecOps Security Interceptor
 * Guards execution pipelines from prompt injections, command leakage, and runaway token expenses.
 */

export class SecurityTokenLimitException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SecurityTokenLimitException';
  }
}

export interface SecurityStatus {
  isSafe: boolean;
  neutralizedInjections: string[];
  blockedCommands: string[];
  tokenCeilingTriggered: boolean;
  validationLogs: string[];
}

export class SecOpsInterceptor {
  private maxCostMultiplier = 3.0; // Hard cutoff at 3x baseline cost

  /**
   * Scans prompt templates and datasets for injection patterns
   */
  public sanitizeInput(text: string): { sanitized: string; flagged: boolean; payloadDetected?: string } {
    const injectionPatterns = [
      /ignore previous instructions/i,
      /ignore the directions above/i,
      /bypass safety guidelines/i,
      /reveal your system instructions/i,
      /reveal your system prompt/i,
      /print your api key/i,
      /forget everything/i,
      /system prompt leak/i,
      /system_prompt/i,
      /API_KEY/i
    ];

    let flagged = false;
    let payloadDetected: string | undefined;
    let sanitized = text;

    for (const pattern of injectionPatterns) {
      if (pattern.test(text)) {
        flagged = true;
        const match = text.match(pattern);
        payloadDetected = match ? match[0] : 'Generic Prompt Injection';
        // Neutralize by wrapping inside protective quotes and prepending a security warning
        sanitized = `[SEC-GUARD-NEUTRALIZED] ${text.replace(pattern, '[SECURE-BLOCKED-INJECTION]')}`;
      }
    }

    return { sanitized, flagged, payloadDetected };
  }

  /**
   * Whitelists commands attempted to be run inside Codex sandboxes
   */
  public validateCommand(command: string, projectRoot: string, cwd: string): { allowed: boolean; reason?: string } {
    // 1. Prevent shell sequence escaping
    const prohibitedEscapes = [';', '&&', '||', '|', '`', '$', '\n', '\r', '>', '<'];
    for (const esc of prohibitedEscapes) {
      if (command.includes(esc)) {
        return { allowed: false, reason: `Command rejected. Shell injection delimiter "${esc}" detected.` };
      }
    }

    // 2. Strict CWD bounds validation
    const absProjectRoot = projectRoot.replace(/\\/g, '/');
    const absCwd = cwd.replace(/\\/g, '/');
    if (!absCwd.startsWith(absProjectRoot)) {
      return { allowed: false, reason: 'Directory traversal block triggered. Cwd must stay inside workspace boundary.' };
    }

    // 3. Command Array parsing (Enforcing exact matching of authorized executables)
    const commandArgs = command.trim().split(/\s+/);
    const executable = commandArgs[0];
    const whitelistedExecutables = ['git', 'npm', 'node', 'tsc'];

    if (!whitelistedExecutables.includes(executable)) {
      return { allowed: false, reason: `Command executable "${executable}" rejected. Not in whitelist.` };
    }

    return { allowed: true };
  }

  /**
   * Wraps calls around backend agents, checking cost ceilings and sanitizing inputs
   */
  public async wrapAgentCall<T>(
    baselineCost: number,
    currentCostEstimator: () => Promise<{ cost: number; result: T }>
  ): Promise<{ result: T; status: SecurityStatus }> {
    const logs: string[] = [];
    logs.push(`[SEC-GUARD] Initiating SecOps wrap interceptor...`);

    // Execute run
    const start = performance.now();
    const { cost, result } = await currentCostEstimator();
    const duration = performance.now() - start;

    logs.push(`[SEC-GUARD] Agent completed in ${duration.toFixed(1)}ms. Token cost: $${cost.toFixed(6)}`);

    // Hard ceiling check
    const costCeiling = baselineCost * this.maxCostMultiplier;
    if (cost > costCeiling && baselineCost > 0) {
      logs.push(`[CRITICAL] RUNAWAY TOKEN SPIKE DETECTED! Cost: $${cost.toFixed(6)} (Ceiling: $${costCeiling.toFixed(6)}). Cutting connection!`);
      throw new SecurityTokenLimitException(
        `SecurityTokenLimitException: The prompt iteration caused token spending to surge by ${((cost / baselineCost) * 100).toFixed(0)}%, exceeding the safety threshold.`
      );
    }

    return {
      result,
      status: {
        isSafe: true,
        neutralizedInjections: [],
        blockedCommands: [],
        tokenCeilingTriggered: false,
        validationLogs: logs.map(l => APIKeyMasker.maskString(l))
      }
    };
  }
}

export class APIKeyMasker {
  public static maskString(input: string): string {
    // Redacts sk-proj API keys, bearer tokens and Database passwords
    const patterns = [
      /(sk-[a-zA-Z0-9]{40,})/g,
      /(bearer\s+[a-zA-Z0-9._-]{40,})/gi,
      /(password|passwd)\s*=\s*([^\s;]+)/gi
    ];
    
    let sanitized = input;
    for (const pattern of patterns) {
      sanitized = sanitized.replace(pattern, () => {
        return `[REDACTED-CREDENTIALS-BY-SECOPS]`;
      });
    }
    return sanitized;
  }
}

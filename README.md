# ⚡ AutoBench: Production-Grade Prompt Benchmarking & SecOps Shield

AutoBench is an enterprise-grade, real-time prompt profiling, optimization, and security isolation platform. It evaluates, sanitizes, and distributes LLM prompts using concurrent thread sandboxing, automated red-teaming, live shadow routing split proxies, and multi-region edge mesh latency analysis.

---

## 🚀 Key Features

* **📦 Concurrent Sandbox Thread Streamer**: Spawns isolated sandbox worktrees in parallel (Sandbox A: Baseline, Sandbox B: Stress/Adversarial, Sandbox C: Codex-Optimized) streaming real-time logs over a bi-directional WebSocket tunnel.
* **🛡️ SecOps Sanitizer Shield**: Active input sanitizer that intercepts prompt injections, blocks restricted system execution commands, prevents PII/Credential leakage, and enforces strict JSON output compliance.
* **🔀 Shadow Traffic split Routing Proxy**: Simulates a live 99/1 production traffic split with an automated **LLM-as-a-Judge** scoring engine and a dynamic circuit breaker that terminates candidate routing if semantic accuracy drops below a 94% safety threshold.
* **🌐 Global Telemetry Edge Mesh**: Captures high-resolution performance, TTFT (Time-To-First-Token), and percentile latency benchmarks (P50, P95, P99) across three distributed simulated nodes (**us-east-1**, **eu-west-1**, and **ap-south-1**).
* **💀 Adversarial Red-Team Simulator**: Runs an automated suite of 50 multi-vector prompt injection attacks to stress-test prompt alignment and generate an interactive Vulnerability Matrix report with actionable remediation.
* **🤖 CI/CD Gate Validator**: A headless gate validation script verifying target performance against strict enterprise regression limits, exiting with standard exit codes (`0` for Pass, `1` for Breach) to fit pipeline environments.

---

## 🛠️ Tech Stack & Architecture

### **Frontend**
* **Framework**: React 19 + TypeScript + Vite
* **Styling**: Tailwind CSS v4 (harmonious dark UI, HSL glow vectors, micro-animations)
* **Icons**: Lucide React
* **Data Layer**: Custom WebSocket stream hook (`useAutoBench.ts`) + Fetch API

### **Backend**
* **Runtime**: Node.js + ESM Modules
* **Framework**: Express v5 + standard `ws` WebSocket connection manager
* **Simulation Engine**: Promise-isolated orchestrator + performance micro-benchmarking

---

## 📂 Project Structure

```bash
geeoo/
├── server.ts                  # Enterprise Express + WebSocket integration server
├── vite.config.ts             # Vite + Tailwind compilation & dev websocket proxy
├── package.json               # Package configurations & unified npm scripts
├── public/
│   └── mock_test_cases.json   # 10 comprehensive baseline & adversarial test payloads
└── src/
    ├── App.tsx                # React root application mount point
    ├── App.css                # Global animation frames and typography tokens
    ├── main.tsx               # Client entrypoint
    ├── core/                  # TypeScript Simulation Engine Modules
    │   ├── orchestrator.ts    # Parallel sandbox execution & prompt compressor
    │   ├── security.ts        # SecOps inputs validation & directory whitelist shields
    │   ├── crossModel.ts      # Multi-provider matrix normalizer
    │   ├── compliance.ts      # Hallucination, PII, and toxicity evaluator
    │   ├── redteam.ts         # Vulnerabilities simulator (50 adversarial vectors)
    │   ├── telemetry.ts       # Global edge mesh TTFT & percentile profiling
    │   ├── proxy.ts           # Shadow routing proxy & automated circuit breaker
    │   └── githubAction.ts    # Headless CI regression threshold validator
    ├── hooks/
    │   └── useAutoBench.ts    # Custom WebSocket listener & API fetch state hook
    └── components/            # High-fidelity dashboard widgets
        ├── MasterDashboard.tsx    # Parent workspace viewport & active layout state
        ├── SandboxStreamer.tsx    # Parallel worker consoles stdout/stderr stream
        ├── MetricsMatrix.tsx      # Latency delta & cost savings cards
        ├── PromptDiff.tsx         # Anti-gravity Codex compression side-by-side viewer
        ├── SecOpsPanel.tsx        # Active sanitizers and compliance telemetry logs
        ├── ShadowRoutingPanel.tsx # 99/1 split stream & live circuit breaker status
        ├── RedTeamPanel.tsx       # Vulnerabilities matrix compiler & trigger
        ├── CIValidationPanel.tsx  # GitHub actions headless pipeline test rig
        └── GlobalMeshMap.tsx      # Regional TTFT distributions & GDPR sovereign audits
```

---

## 🔌 API Reference Guide

The backend runs concurrently on **`http://localhost:5000`** with standard REST endpoints and WebSocket channels:

### **1. HTTP REST APIs**

#### 🛑 `POST /api/benchmark`
Spawns three concurrent sandboxes, runs token optimizations, profiles edge meshes, and runs shadow routing runs.
* **Request Body**:
```json
{
  "clientId": "client-dashboard-session-405",
  "systemPrompt": "System prompt text here...",
  "testCases": []
}
```
* **Response**: Returns a detailed telemetry report containing sandbox logs, cost analysis, regional mesh benchmarks, and shadow splits.

#### 💀 `POST /api/redteam`
Simulates a battery of 50 prompt injections against your system prompt template.
* **Request Body**: `{ "systemPrompt": "..." }`
* **Response**: `{ "vulnerabilities": [...] }` containing high-fidelity threat logs and remediation advice.

#### 🤖 `POST /api/ci-gate`
Runs headless gate regression checks.
* **Request Body**: `{ "avgLatencyMs": 135.0, "accuracyScore": 98.0, "costPer1k": 0.03 }`
* **Response**: `{ "exitCode": 0, "passed": true, "logs": [...] }`

---

### **2. WebSocket Channel**

#### 🛰️ `WS /ws?clientId={clientId}`
Bi-directional tunnel streaming stdout/stderr outputs directly from the parallel sandboxes.
* **Downstream Stream Payload**:
```json
{
  "event": "log",
  "payload": {
    "sandboxId": "A" | "B" | "C",
    "text": "Log text output...",
    "type": "stdout" | "stderr"
  }
}
```

---

## ⚙️ Quick Start

### 1. Installation
Install frontend and backend dependencies:
```bash
npm install
```

### 2. Start Developer Mode
Run the concurrent runner script to start the **Express backend server (port 5000)** and the **Vite React client (port 5173)** in parallel:
```bash
npm run dev:all
```

### 3. Build & Compile Checks
Verify environment type safety and build production assets:
```bash
npm run build
```

---

## 💎 Designed & Engineered by

Designed & Engineered with ❤️ by **Abhishek Jha**.  
Built using the elite **Google DeepMind Antigravity** framework.

# AI Software Engineer

> Production-Grade Autonomous AI Software Engineering & Control Plane Platform

AI Software Engineer transforms natural language user specifications into complete, verified, and deployable web applications through an automated 14-phase multi-agent software engineering lifecycle. The platform pairs an autonomous development pipeline (planning, architecture, code generation, sandboxing, testing, and debugging) with a rigorous production control plane (preflight credential verification, secret isolation, progressive delivery, SLO observability, automated runbooks, and zero-simulation certification).

---

## 1. System Engineering Lifecycle

```
[USER REQUIREMENT]
       │
       ▼
[ANALYSIS & INTENT SEPARATION] ──► User Features vs AI Suggestions
       │
       ▼
[TECHNICAL ARCHITECTURE & API CONTRACT]
       │
       ▼
[CODE GENERATION & SANDBOX BUILD] ──► Isolated AST & Seccomp Runtime
       │
       ▼
[AUTOMATED TESTS & HEALING LOOP] ──► Bounded Repair (Max 3 Attempts)
       │
       ▼
[PREVIEW & MULTI-TENANT ISOLATION] ──► Strict Workspace Boundaries
       │
       ▼
[PRODUCTION PREFLIGHT CONTROLLER] ──► 12-Dimension Credential Verification
       │
       ▼
[IMMUTABLE RELEASE CANDIDATE] ──► Build Hashes, Migrations & Checksums
       │
       ▼
[PROGRESSIVE CANARY ROLLOUT] ──► 5% → 10% → 25% → 50% → 100% (Auto-Rollback)
       │
       ▼
[ZERO-SIMULATION CERTIFICATION GATE] ──► Immutable Dossier (Blocked if Unconfigured)
```

---

## 2. Core Architectural Pillars

1. **Zero-Simulation Policy**: No provider success is fabricated. Unconfigured external cloud credentials remain strictly in `NOT_CONFIGURED` status. Internal health never substitutes for live production verification.
2. **Secret Isolation & Redaction**: Plaintext secrets (`DATABASE_URL`, `GITHUB_TOKEN`, `GEMINI_API_KEY`, `STRIPE_SECRET_KEY`, `SLACK_WEBHOOK_URL`, `PAGERDUTY_TOKEN`) are never logged, returned over APIs, injected into prompts, or included in client bundles.
3. **Multi-Tenant SaaS Isolation**: Every mutation and database query enforces workspace and tenant boundaries (`workspaceId`). Cross-workspace reads and IDOR attempts are blocked with audit logs.
4. **Sandboxed Code Execution**: Container-level isolation restricts arbitrary shell execution, blocks `eval()` and `new Function()`, enforces memory limits (512MB), and executes AST-level transformations.
5. **Progressive Delivery & Blast Radius Minimization**: Deployments require approval and advance across 5 canary stages (5%, 10%, 25%, 50%, 100%) with continuous SLO evaluation and automated rollback upon latency or error budget deterioration.
6. **Disaster Recovery & Non-Destructive Restore**: Automated snapshots, AES-256 GCM encryption, and periodic sandboxed restore drills measure RPO (<15m) and RTO (<30s) while guaranteeing `overwroteProduction = false`.

---

## 3. Provider Configuration Status

The platform dynamically inspects provider configuration across 12 dimensions:

| Dimension | Default / Current Status | Verification Criteria |
| :--- | :--- | :--- |
| **DATABASE** | `NOT_CONFIGURED` | Requires `DATABASE_URL` pointing to PostgreSQL 15+ with TLS and synced migrations. In-memory storage is prohibited in production. |
| **GITHUB** | `NOT_CONFIGURED` | Requires `GITHUB_TOKEN` and `GITHUB_REPOSITORY` for read-only branch and PR validation. |
| **DEPLOYMENT** | `NOT_CONFIGURED` | Requires at least one deployment provider: `GCP_PROJECT_ID` (Cloud Run), `VERCEL_TOKEN`, or `KUBECONFIG`. |
| **STORAGE** | `NOT_CONFIGURED` | Requires `GCS_BUCKET_NAME` or `STORAGE_BUCKET` with read/write/checksum/delete probe verification. |
| **ALERTING** | `NOT_CONFIGURED` | Requires `SLACK_WEBHOOK_URL` or `PAGERDUTY_TOKEN` with single controlled verification event delivery. |
| **AUTH** | `VERIFIED` | Session JWT validation, workspace isolation, RBAC role enforcement, and 401/403 rejection paths active. |
| **AI PROVIDER** | `VERIFIED` | Server-side `GEMINI_API_KEY` active with Gemini 2.5 Pro / Flash models and AI Governor token tracking. |
| **TRAFFIC / DNS** | `NOT_CONFIGURED` | Requires `TRAFFIC_DIRECTOR_ORIGIN` or `CLOUDFLARE_ZONE_ID` for edge DNS and TLS verification. |
| **OBSERVABILITY** | `VERIFIED` | Real-time SLO telemetry, correlation ID propagation, synthetic probes, and health check endpoints active. |
| **BILLING** | `NOT_CONFIGURED` | Requires `STRIPE_SECRET_KEY` with HMAC signature validation and quota enforcement. |
| **EMAIL** | `NOT_CONFIGURED` | Requires `SENDGRID_API_KEY` or `SMTP_HOST` for transactional email routing. |
| **SANDBOX** | `VERIFIED` | Local development and container seccomp execution isolation active. |

---

## 4. Development & Testing

```bash
# Install dependencies
npm install

# Run TypeScript typecheck
npm run typecheck

# Run linter
npm run lint

# Run all 48 Vitest test suites (345+ tests)
npm test

# Build production assets
npm run build

# Start production server
npm start
```

---

## 5. Control Plane & UI Navigation

The Global Operations Control Plane provides 52 specialized operational tabs:
- **Tabs 1–22**: Fleet Telemetry, Incident Command Center, Chaos Runner, Predictive Anomalies, Autonomous Healing, FinOps Governor, and Disaster Recovery.
- **Tabs 23–27**: Production Control Plane, Cloud Provider Matrix, Cutover & Rollback, Tenant Isolation, and Security Hardening.
- **Tabs 28–37**: Live Production Operations, Release Candidates, Canary Progression, SaaS Quotas, Runbooks, and Scheduler.
- **Tabs 38–43**: Real Cloud Infrastructure Activation, Smoke Test Runner (20-step), and Drift Detection.
- **Tabs 44–50**: Credential Preflight Controller, Sandboxed DR Drills, 14-Point Security Verification, and Phase 14 Certification Dossier.
- **Tabs 51–52**: 18-Dimension Production Readiness Scorecard & 34-Step Final Production Activation Workflow.

---

## 6. Zero-Simulation Certification Guarantee

Production certification is strictly gated. Under the zero-simulation policy:
- If mandatory cloud credentials (`DATABASE_URL`, deployment provider, storage bucket) are absent, the system reports `NOT_CONFIGURED`.
- `PRODUCTION_DEPLOYED = false`
- `PRODUCTION_HEALTH_VERIFIED = false`
- `CANARY_VERIFIED = false`
- `PRODUCTION_CERTIFIED = BLOCKED`

The platform is **Software-Complete** across all 14 engineering phases while preserving genuine infrastructure boundaries.

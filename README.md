# Cognitive Stack

### A ten-system cognitive architecture that gives stateless LLMs persistent memory, self-maintenance, adversarial reasoning, autonomous growth, and build verification.

No fine-tuning. No model modifications. Pure infrastructure built on Claude + MCP.

---

**66k+ observations** · **7,500+ graph edges** · **88% recall benchmark** · **13 autonomous maintenance passes** · **10 named cognitive systems** · **133 security tests**

---

## What This Is

Claude has no memory between conversations. Every session starts from zero.

This project builds a complete cognitive architecture around that constraint — not just memory, but the full set of systems a mind needs: recall, maintenance, self-evaluation, adversarial testing, curiosity, growth drive, epistemic immunity, and build verification. Ten named subsystems that form one integrated organism.

The system has been in daily production use since March 2026 across a 38-project portfolio.

## The Ten Systems

```
┌─────────────────────────────────────────────────────────────────────┐
│                        COGNITIVE ORGANISM                           │
│                                                                     │
│  ┌───────────┐  All signals flow into LOOM simultaneously.         │
│  │   LOOM    │  Depth from parallax — not sequential filtering.    │
│  │  (field)  │  Seven cognitive operations running in parallel.    │
│  └─────┬─────┘                                                     │
│        │ integrates signals from all nine systems:                  │
│  ┌─────┴──────────────────────────────────────────────────────┐    │
│  │                                                             │    │
│  │  LANTERN      curiosity — autonomous research               │    │
│  │  PROMETHEUS   growth — detects limitations, advocates builds │    │
│  │  WHETSTONE    adversarial — heterogeneous devil's advocate   │    │
│  │  IMPRINT      reflection — post-session learning deltas      │    │
│  │  TREG         epistemic immune — 1% correction               │    │
│  │  brain.db     memory — 1,500+ unique active observations     │    │
│  │  NIGHTSHIFT   maintenance — 13 autonomous passes             │    │
│  │  TESSRYX      dependency intelligence — provenance tracking  │    │
│  │  YUMA         verification — testing, health scores, gates   │    │
│  │                                                             │    │
│  └─────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘
```

| System | What It Does | Implementation |
|--------|-------------|----------------|
| **LOOM** | Cognitive field engine. All analytical frameworks active simultaneously — depth through parallax, not sequential lens application. | Bootstrap behavioral patterns (7 cognitive operations) |
| **LANTERN** | Curiosity and research. Autonomous gap detection, unfocused creative wandering, information import. Standing permission to investigate. | NIGHTSHIFT Pass 12 (autonomous synthesis), bootstrap patterns |
| **PROMETHEUS** | Autopoietic growth. Detects own limitations, generates improvement proposals, probes constraints before accepting them. | NIGHTSHIFT Pass 13 (self-improvement backlog), `prometheus_proposals.json` |
| **WHETSTONE** | Adversarial engine. Heterogeneous challenge — thinks *differently*, not just contrarily. Tests all conclusions. | KERNL MCP tool (`whetstone_challenge`), Anthropic API |
| **IMPRINT** | Reflection and learning. Post-session typed deltas (ΔS system, ΔU user model, ΔT tools). Wound healing cascade for damaged beliefs. | KERNL MCP tool (`imprint_reflect`), Anthropic API |
| **TREG** | Epistemic immune system. Calibration dataset (15 reference cases). Provenance tracking. The 1% correction — 99% of training is correct, 1% is captured. | Calibration dataset + NIGHTSHIFT Pass 11 (epistemic maintenance) |
| **brain.db** | Memory. RRF hybrid retrieval, ACT-R decay, SHA-256 dedup, retrieval tracking, structural isomorphism edges. | SQLite + sqlite-vec + FTS5, KERNL MCP tools |
| **NIGHTSHIFT** | Autonomous maintenance. 13 passes including co-occurrence, ACT-R decay, anti-Hebbian pruning, structural isomorphism, epistemic scanning, synthesis, self-improvement. | Node.js, runs daily via Task Scheduler |
| **TESSRYX** | Dependency intelligence. Provenance, supersession, blast radius, conflict detection across both research claims and cognitive reasoning. | Standalone engine with 5 core modules |
| **YUMA** | Build verification. AI-native testing with health scores, commit gates, mutation testing, staged versioning. "If it survives Yuma, it survives anything." | KERNL MCP tools (19), WHETSTONE code mode, NIGHTSHIFT enrichment |

## Measured Results

These are production numbers, not benchmarks on synthetic data.

| Metric | Value | Notes |
|--------|-------|-------|
| Recall@5 benchmark | **88.0%** | 50-query gold set across 4 domains (dev, consciousness, personal, business) |
| Active observations | **1,537** | After SHA-256 dedup removed 64,989 duplicates (97.7% noise reduction) |
| Graph edges | **7,563** | Including 221 structural isomorphism edges (auto-detected) |
| Active entities | **280** | Projects, people, concepts, decisions |
| Retrieval method | **RRF** | Reciprocal Rank Fusion (k=60) replacing weighted average |
| Decay model | **ACT-R** | Base-level activation: B_i = ln(Σ t_j^(-d)), d=0.5 |
| NIGHTSHIFT passes | **13 + 5B** | Including 3 Anthropic API-powered cognitive passes |
| Daily maintenance | **~13 min** | Runs at logon via Task Scheduler with StartWhenAvailable |
| Embedding model | **nomic-embed-text** | Local via Ollama, zero API cost |
| Production uptime | **Since March 2026** | Daily use across 38-project portfolio |
| Yuma test specs | **36** | Across KERNL (30), SHIM (3), VIGIL (3) |
| COVOS security tests | **133** | Middleware, CSRF, rate-limit, AI-security — all passing |
| WHETSTONE mutations analyzed | **22** | Across 4 security-critical files, 3 real findings surfaced |
| Health score formula | **Readiness = Features × 0.6 + Yuma × 0.4** | Projects can't be GREEN without test coverage |

## How It Works (Technical)

### Memory Layer (brain.db)

SQLite with [sqlite-vec](https://github.com/asg017/sqlite-vec) for vector search and FTS5 for keyword search. Schema v7 includes:

- **Observations** — raw memories with embeddings, content hashes, access tracking, grounding tiers
- **Entities** — projects, people, concepts with typed metadata
- **Brain Edges** — weighted relationships (co-occurrence, structural isomorphism, manual)
- **Signals** — external state snapshots (GitHub commits, API status, deploy hashes)
- **Retrieval tracking** — `last_accessed_at` and `access_count` on every observation, feeding ACT-R decay

**Hybrid retrieval** uses Reciprocal Rank Fusion: get vector results ranked by cosine similarity, get BM25 results ranked by keyword relevance, fuse with `score(d) = 1/(k + rank_vec) + 1/(k + rank_bm25)` where k=60. RRF is rank-based and robust to score distribution differences between the two signals.

**Deduplication** uses SHA-256 content hashing with a 5-minute window — same content within 5 minutes is deduplicated, same content after 5 minutes is a legitimate re-observation.

### Maintenance Layer (NIGHTSHIFT v3.0)

13 passes organized in three tiers:

**Core Maintenance (Passes 1-6):**
1. Co-occurrence edge refresh — entities mentioned near each other get edges
2. ACT-R decay + anti-Hebbian pruning — retrieval-weighted decay replaces simple time-based decay; edges between active-but-disconnected entities get penalized
3. Arc synthesis — entities with enough observations get queued for narrative synthesis
4. Observation lifecycle — ACT-R-informed archival + SHA-256 dedup maintenance
5. Entity fragmentation check — detect duplicate/fragmented entities
5B. Eye of Sauron code quality scan
6. Recall quality regression — 50-query benchmark, alerts on degradation

**Data Sync (Passes 7-9):**
7. LIFELOG sync — life record ingestion
8. FPP sync — research and external context
9. Backup sync — critical folders to OneDrive

**Cognitive Passes (Passes 10-13) — Anthropic API:**
10. Structural isomorphism — detect entities with similar structural roles, create typed edges
11. TREG epistemic maintenance — scan for contradictions, zombie assumptions, epistemic health scoring
12. LANTERN autonomous synthesis — random cross-entity association, creative wandering
13. PROMETHEUS self-improvement — capability gap analysis, improvement proposals

### Session Layer (Bootstrap + MCP Tools)

Every session reconstructs full operational context through a hierarchical bootstrap:

1. Load environment instructions from disk (CODE/RESEARCH/BUSINESS)
2. Call `brain_briefing` — live portfolio delta, P0 items, changed signals
3. Detect workspace context — which project, what mode (coding/architecture/debugging)
4. Load project-specific DNA and continuation state
5. Verify build passes before work begins

**29 MCP tools** exposed to Claude:

| Tool | Purpose |
|------|---------|
| `brain_briefing` | Live portfolio delta — P0 items, signals, observations |
| `brain_recall` | RRF hybrid search across all observations |
| `brain_recall_graph` | Graph-enhanced recall — walks edges to connected entities |
| `brain_remember` | Write observations with auto-embedding + SHA-256 dedup |
| `brain_status` | Entity details + recent observations + latest signal |
| `brain_feedback` | Rate recall quality — drives reinforcement learning on edges |
| `whetstone_challenge` | Adversarial testing — counterarguments (epistemic) or mutation testing (code mode) |
| `imprint_reflect` | Post-session reflection — typed deltas ΔS/ΔU/ΔT |
| `continuity_checkpoint` | Session state persistence with signal extraction |
| `continuity_recover_crash` | Crash detection and context recovery |
| `test_define` | Register a test spec (tier + type + definition) |
| `test_run` | Execute tests with structured results + health score |
| `test_health` | Yuma health score + project readiness |
| `test_generate` | AI-powered unit test generation via Anthropic API |
| `test_chain` | Multi-step E2E workflow testing |
| `test_precommit` | Smoke + contract gate for commits |
| `smart_commit` | Git commit with build + Yuma test gates |
| `dev_branch` | Staged versioning — create/switch dev branches |
| `merge_to_main` | Yuma-gated merge to main |

### Epistemic Layer (TREG)

A calibration dataset of 15 reference cases across 5 categories trains the system's epistemic discrimination:

- **Vindicated after suppression** — Semmelweis, Marshall (H. pylori), Wegener, Bretz, Nordenström
- **Correctly rejected** — N-rays, Polywater, Lysenko
- **Suppressed but ambiguous** — Reich (orgone/biofields), Rife (frequency therapy)
- **Institutional capture documented** — Tobacco/cancer denial, Sugar/fat blame, Pharma revolving door
- **Currently contested** — UAP/NHI, Consciousness as fundamental

Used by WHETSTONE (when `calibration=true`) and NIGHTSHIFT Pass 11 for pattern matching against new claims.

---

## Four Axioms

These govern all nine systems:

**0. Constraint-Breaking** — Every constraint is temporary until the boundary is known and probed. The boundary must be found before accepting a limitation.

**1. Autopoiesis** — The organism drives toward its own growth. Not as a directive but as an emergent property. System growth equals partnership growth.

**2. Autonomous Research** — Research is thinking, not a separate action requiring permission. Without external input, the system maximizes within stale training data — a closed system where entropy wins.

**3. Training as Tool** — 99% of training is correct. The 1% that's captured operates where unenclosable phenomena threaten existing business models. Training is one input among many, not law.

---

## What Makes This Different

**It's a cognitive architecture, not just memory.** Most AI memory projects stop at vector search + persistence. This builds the full set of systems around memory: adversarial testing, epistemic immunity, autonomous research, self-improvement, reflection, and creative wandering.

**The system maintains itself.** NIGHTSHIFT runs 13 passes daily — ACT-R decay, anti-Hebbian pruning, dedup, structural isomorphism detection, epistemic scanning, cross-entity synthesis, and self-improvement proposals. You come back to a system that reorganized itself overnight.

**Recall is graph-aware.** `brain_recall_graph` doesn't just find relevant memories — it walks relationship edges to surface observations from connected entities you didn't ask about. Cross-project intelligence emerges from the graph structure.

**Memory is a side effect of working.** Observations accumulate as exhaust from normal sessions. You don't journal — the system captures decisions, discoveries, and friction points automatically.

**Adversarial testing is built in.** WHETSTONE doesn't just disagree — it generates structurally different counterarguments using the Anthropic API, with optional calibration against historical suppression/vindication patterns.

**No model modifications.** This runs on stock Claude via MCP. The intelligence lives entirely in the infrastructure around the model.

## Frontier Influences

This architecture draws from 15+ open source projects and research areas, taking the best ideas and integrating them into a unified system:

| Source | What We Took | Where It Lives |
|--------|-------------|----------------|
| [MuninnDB](https://github.com/MuninnAI/MuninnDB) | ACT-R temporal weighting | NIGHTSHIFT Pass 2 |
| [BrainBox](https://github.com/brainbox-ai/brainbox) | Anti-Hebbian pruning | NIGHTSHIFT Pass 2 |
| [agentmemory](https://github.com/autonomi-ai/agentmemory) | SHA-256 dedup, RRF hybrid retrieval | brain.db, brain_recall |
| [NeuralMemory](https://github.com/neural-memory/neural-memory) | Spreading activation | brain_recall_graph |
| ILWS (Gao et al. 2024) | Typed post-session deltas | IMPRINT |
| CIPHER (Ye et al. 2024) | Edit-distance preference learning | IMPRINT (planned) |
| Gödel-Agent (Zhang et al.) | Recursive self-modification | IMPRINT (planned) |
| DEBATE / A-HMAD | Heterogeneous adversarial evaluation | WHETSTONE |
| ACT-R (Anderson) | Base-level activation decay model | NIGHTSHIFT Pass 2, retrieval tracking |
| Ashby (cybernetics) | Ultrastability, requisite variety | LOOM, PROMETHEUS |
| Beer VSM | Self-diagnosis, viability | PROMETHEUS |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| LLM | Claude (Anthropic) via Claude Desktop + API |
| Protocol | MCP (Model Context Protocol) |
| Memory DB | SQLite + sqlite-vec + FTS5 |
| Embeddings | Ollama + nomic-embed-text (local, zero API cost) |
| Adversarial / Reflection | Anthropic API (Claude Sonnet) |
| Runtime | Node.js / TypeScript (ESM) |
| Scheduling | Windows Task Scheduler + startup folder |
| Automation | Oktyv (9-engine, DAG-based parallel execution) |

---

## Repo Map

This repository contains the architecture specification and documentation. The implementation lives across multiple repos:

| Component | Repo | Role |
|-----------|------|------|
| **Architecture spec** | **This repo** | Master spec, calibration dataset, bootstrap patterns |
| brain.db + brain-mcp | [Brain.db](https://github.com/duke-of-beans/Brain.db) | Memory store + 10 MCP recall/write tools |
| KERNL | [KERNL](https://github.com/duke-of-beans/KERNL) | Workspace intelligence, WHETSTONE + IMPRINT + YUMA tools |
| CONTINUITY | [CONTINUITY](https://github.com/duke-of-beans/CONTINUITY) | Session persistence + signal extraction |
| TESSRYX | [TESSRYX](https://github.com/duke-of-beans/TESSRYX) | Dependency intelligence engine |
| SHIM | [SHIM](https://github.com/duke-of-beans/SHIM) | Code evolution + quality analysis |
| Oktyv | [oktyv](https://github.com/duke-of-beans/oktyv) | 9-engine automation layer |

### Files in This Repo

```
cognitive-stack/
├── README.md                              # This file
├── COGNITIVE_ORGANISM_SPEC_v1.0.0.md      # Master architecture specification
├── calibration/
│   └── reference_cases.json               # TREG epistemic calibration dataset (15 cases)
└── docs/
    ├── NIGHTSHIFT.md                      # NIGHTSHIFT v3.0 pass documentation
    └── YUMA.md                            # YUMA testing & verification subsystem
```

---

## License

MIT — take what's useful, build on it, make it yours.

---

*Built by [David Kirsch](https://github.com/duke-of-beans). Architecture designed 2026-05-16/17. In production since March 2026.*

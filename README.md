# Cognitive Stack

**A persistent AI cognitive system built on Claude.**

This repo documents the architecture of a system that gives a stateless LLM (Claude) persistent memory, cross-session learning, overnight self-maintenance, and full operational continuity across a multi-project portfolio. No fine-tuning. No model modifications. Pure infrastructure.

---

## The Problem

Claude has no memory between conversations. Every session starts from zero. You either re-explain everything, or you build a nervous system that does it for you.

## The Solution (in layers)

```
┌─────────────────────────────────────────────────┐
│  LAYER 5: BOOTSTRAP PROTOCOL                    │
│  Hierarchical session initialization            │
│  Identity + context reconstruction per session   │
├─────────────────────────────────────────────────┤
│  LAYER 4: MAINTENANCE (NIGHTSHIFT)              │
│  Nightly: co-occurrence, decay, synthesis,       │
│  archival, defrag, quality regression            │
├─────────────────────────────────────────────────┤
│  LAYER 3: LEARNING (feedback loop)              │
│  Reinforcement scoring on recall quality         │
│  Real-time decision capture via brain_remember   │
├─────────────────────────────────────────────────┤
│  LAYER 2: RECALL (brain-mcp)                    │
│  Hybrid vector + BM25 search                     │
│  Graph traversal across entity edges             │
├─────────────────────────────────────────────────┤
│  LAYER 1: MEMORY (brain.db)                     │
│  46k+ observations, 7k+ edges, 150 entities     │
│  SQLite + sqlite-vec + FTS5                      │
├─────────────────────────────────────────────────┤
│  LAYER 0: SESSION PERSISTENCE (continuity-mcp)  │
│  Checkpoint/recovery, crash detection,           │
│  signal extraction on every save                 │
└─────────────────────────────────────────────────┘
```

---

## Components

### 1. brain.db — The Memory Store

**What:** SQLite database with sqlite-vec (vector embeddings) and FTS5 (full-text search). **Schema:** Observations (raw memories), Entities (projects, people, concepts), Signals (state changes), Edges (weighted relationships between entities), Sessions, Gaps. **Scale:** 46,000+ observations, 7,000+ edges, 150 entities. **Repo:** [Brain.db](https://github.com/duke-of-beans/Brain.db) (includes the MCP server)

### 2. brain-mcp — The Recall Engine

**What:** MCP (Model Context Protocol) server exposing 5 tools directly to Claude. **Tools:**

- `brain_briefing` — Live portfolio delta. P0 items, changed signals, recent observations. Called at every session start.
- `brain_recall` — Hybrid search: vector similarity (via Ollama/nomic-embed-text) fused with BM25 keyword search. Normalized scores, weighted 70/30 vector/BM25.
- `brain_recall_graph` — Seeds via hybrid search, then walks `brain_edges` to surface observations from connected entities. Cross-project intelligence.
- `brain_remember` — Writes new observations back to brain.db in real-time. Decisions, discoveries, friction points. Auto-embedded.
- `brain_status` — Entity lookup with recent observations and latest signal. **Degrades gracefully:** If Ollama is offline, falls back to BM25-only. If brain_edges table is missing, recall_graph degrades to flat recall. **Repo:** [Brain.db](https://github.com/duke-of-beans/Brain.db)

### 3. continuity-mcp — Session Persistence

**What:** MCP server for session state management. **Tools:**

- `continuity_checkpoint` — Save intermediate state during work.
- `continuity_load_session` — Restore the most recent session for a workspace.
- `continuity_recover_crash` — Detect if the last session crashed and provide recovery context.
- `continuity_save_session` — Full session save with structured handoff.
- `continuity_log_decision` — Record architectural decisions with rationale and alternatives.
- `continuity_compress_context` — Compress session context for efficient handoff.
- `continuity_handoff_quality` — Validate that a handoff has all critical info. **Key feature:** Brain signal extraction — every checkpoint automatically extracts signals (state changes, decisions, new observations) and writes them to brain.db. The memory layer grows passively as you work. **Repo:** [CONTINUITY](https://github.com/duke-of-beans/CONTINUITY)

### 4. NIGHTSHIFT — Overnight Maintenance

**What:** Node.js script that runs at Windows logon (via startup folder). 6 passes, \~15 seconds total. **Passes:**

- **Pass 1: Co-occurrence edge refresh** — Scans recent observations for entity co-mentions. Creates or strengthens `brain_edges` between entities that appear together.
- **Pass 2: Hebbian decay** — Weakens edges that haven't been reinforced recently. Enforces a weight floor (0.05) so connections never fully die. Prunes edges below floor.
- **Pass 3: Arc synthesis trigger** — Identifies entities with enough recent observations to warrant synthesis (narrative arc construction). Queues candidates.
- **Pass 4: Observation archival** — Archives stale, low-signal observations to keep the active set lean.
- **Pass 5: Entity fragmentation check** — Detects duplicate or fragmented entities (e.g., "GregLite" vs "greglite" vs "Greg Lite") and flags for merge.
- **Pass 5B: Eye of Sauron quality scan** — Runs static analysis across active codebases, writes findings as observations to brain.db.
- **Pass 6: Recall quality regression** — Runs a 50-query benchmark against brain.db and logs recall@5 scores. Baseline: 88%. **The point:** The system gets smarter overnight. Connections strengthen or weaken based on actual usage patterns. Fragmented data consolidates. Quality is measured. **Location:** Lives in the [Meta repo](https://github.com/duke-of-beans/7171-PORTFOL.io) as `NIGHTSHIFT.cjs`

### 5. KERNL — Workspace Intelligence

**What:** MCP server for workspace and project management. The orchestration layer. **Capabilities:** Project registry, file operations, semantic search (indexes project files for meaning-based retrieval), pattern recording (successful patterns captured for cross-project reuse), research notes, backlog management, session context detection, git operations (smart commits with build verification). **Role in the stack:** KERNL is where the brain tools originally lived before being extracted into brain-mcp. It remains the workspace backbone — project awareness, file management, and the glue between "what am I working on" and "what does the system know about it." **Repo:** [KERNL](https://github.com/duke-of-beans/KERNL)

### 6. SHIM — Code Intelligence

**What:** Code evolution and quality analysis engine. Watches how code changes over time, identifies patterns, detects quality drift. **Role in the stack:** Feeds observations about code quality and architectural decisions back into brain.db. When SHIM notices a recurring pattern or quality regression, that becomes institutional memory. **Repo:** [SHIM](https://github.com/duke-of-beans/SHIM)

### 7. Oktyv — Automation Engine

**What:** 9-engine MCP server for judgment-free automation. Shell, Browser, Visual, File, API, Database, Email, Cron, Vault — plus a DAG-based parallel execution engine. **Role in the stack:** The hands. When the cognitive system decides something needs to happen — a file needs moving, an API needs calling, a browser needs navigating, multiple tasks need running in parallel — Oktyv executes it. Native MCP, no subprocess overhead. **Repo:** [oktyv](https://github.com/duke-of-beans/oktyv)

### 8. Bootstrap Protocol — Session Identity

**What:** A hierarchical instruction system that reconstructs the operator's full context every session. **How it works:**

1. A top-level bootstrap file (\~4K tokens) detects which environment is needed (CODE, RESEARCH, BUSINESS, CAREER, THROWBAK) based on trigger words in the request.
2. Loads environment-specific instruction files from disk — these contain project states, architectural decisions, conventions, constraints.
3. Calls `brain_briefing` for live portfolio delta — what changed since last session, what's blocked, what needs attention.
4. Runs a verification checkpoint confirming all context loaded successfully.
5. Claude now has full operational context without being told anything.

**The result:** Session 1 and session 1,000 are functionally identical in context quality. No degradation. No drift. No "remind me what we were working on."

---

## Data Flow

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   SESSION    │     │   brain.db   │     │  NIGHTSHIFT   │
│              │     │              │     │  (overnight)   │
│  bootstrap ──┼────▶│ brain_       │     │               │
│  loads       │     │ briefing ────┼────▶│ Pass 1: edges │
│  context     │     │              │     │ Pass 2: decay │
│              │     │ brain_       │     │ Pass 3: arcs  │
│  work ───────┼────▶│ remember ────┼────▶│ Pass 4: prune │
│  happens     │     │              │     │ Pass 5: defrag│
│              │     │ brain_       │     │ Pass 6: bench │
│  recall ◀────┼─────│ recall ──────│     │               │
│  informs     │     │ recall_graph │     │  strengthens  │
│  decisions   │     │              │     │  weakens      │
│              │     │ brain_       │     │  consolidates │
│  feedback ───┼────▶│ feedback ────┼────▶│  measures     │
│              │     │              │     │               │
│  checkpoint ─┼────▶│ signals ◀────┼─────│  ───────────▶ │
│  (continuity)│     │ extracted    │     │  next session │
└──────────────┘     └──────────────┘     └──────────────┘
```

## What Makes This Different

**No model modifications.** This runs on stock Claude via claude.ai and the MCP protocol. No fine-tuning, no custom weights, no API wrappers. The intelligence lives entirely in the infrastructure around the model.

**The system learns whether you're using it or not.** NIGHTSHIFT runs overnight — strengthening connections between frequently co-occurring entities, weakening stale ones, consolidating fragmented data, and benchmarking recall quality. You come back the next day to a system that's already reorganized itself.

**Recall is not just search.** `brain_recall_graph` doesn't just find relevant memories — it walks the relationship graph to surface observations from *connected* entities you didn't ask about. "What do I know about X" also returns "here's what Y and Z know that's relevant, because they're connected to X through these edges."

**Memory is a side effect of working.** `continuity_checkpoint` extracts signals from every session save and writes them to brain.db automatically. You don't journal observations — they accumulate as exhaust from normal work.

**Feedback is a closed loop.** `brain_feedback` lets the model rate its own recall quality. Helpful results get a weight boost (+0.15), unhelpful results decay (-0.10), critical results get amplified (+0.35). Over time, the system surfaces what's actually useful and buries what isn't.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| LLM | Claude (Anthropic) via claude.ai |
| Protocol | MCP (Model Context Protocol) — tools exposed as MCP servers |
| Memory DB | SQLite + sqlite-vec (vector) + FTS5 (full-text) |
| Embeddings | Ollama + nomic-embed-text (local, no API costs) |
| Runtime | Node.js / TypeScript (ESM) |
| Scheduling | Windows startup folder (NIGHTSHIFT) |
| Automation | Oktyv (9-engine, DAG-based parallel execution) |

---

## Repo Map

| Component | Repo | What it does |
|-----------|------|-------------|
| brain-mcp | [Brain.db](https://github.com/duke-of-beans/Brain.db) | Memory store + recall engine (5 MCP tools) |
| continuity-mcp | [CONTINUITY](https://github.com/duke-of-beans/CONTINUITY) | Session persistence + signal extraction (7 MCP tools) |
| KERNL | [KERNL](https://github.com/duke-of-beans/KERNL) | Workspace intelligence + project management |
| SHIM | [SHIM](https://github.com/duke-of-beans/SHIM) | Code evolution + quality analysis |
| Oktyv | [oktyv](https://github.com/duke-of-beans/oktyv) | 9-engine automation + parallel execution |
| Meta (NIGHTSHIFT) | [7171-PORTFOL.io](https://github.com/duke-of-beans/7171-PORTFOL.io) | Nightly maintenance + portfolio aggregation |

---

## License

MIT — take what's useful, build on it, make it yours.

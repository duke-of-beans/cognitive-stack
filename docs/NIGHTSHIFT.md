# NIGHTSHIFT v3.0 — Autonomous Maintenance

13 passes + 5B. Runs daily via Windows Task Scheduler (4am, with StartWhenAvailable for catch-up). Same-day guard prevents double-runs. Force with `--force` flag.

## Pass Overview

### Core Maintenance (Passes 1-6)

**Pass 1: Co-occurrence Edge Refresh**
Scans observations from the last 24 hours. When two entities appear in observations within a 1-hour window, creates or strengthens a `co_mentioned` edge between them. Weight is proportional to co-occurrence frequency relative to the day's maximum.

**Pass 2: ACT-R Decay + Anti-Hebbian Pruning**
Replaces simple time-based Hebbian decay with principled ACT-R base-level activation.

For each entity with edges, computes BLA: `B_i = ln(Σ t_j^(-d))` where `t_j` = days since j-th retrieval, `d` = 0.5 (ACT-R standard). Observations that are recalled frequently have high activation and resist decay.

Three decay tiers based on mean BLA of edge endpoints:
- BLA < -2.0 → aggressive decay (weight × 0.70)
- BLA -2.0 to 0 → moderate decay (weight × 0.90)
- BLA > 0 → stable (no decay)

Anti-Hebbian: edges where both source and target entities have recent session activity but NO co-occurrence in the last 30 days get 0.80× penalty. These are cognitively disconnected.

Floors: 0.10 for manually seeded edges, 0.05 for inferred.

**Pass 3: Arc Synthesis Queue**
Identifies entities with 3+ session observations in the last 14 days. Queues them for narrative arc synthesis (requires Anthropic API). Candidates written to `synthesis_queue.json`.

**Pass 4: Observation Lifecycle + Dedup Maintenance**
Three sub-phases:
- 4A: Archive stale observations (>90 days old, never recalled, no synthesis depth, no edge connectivity)
- 4B: SHA-256 dedup maintenance — catches duplicates from external ingest pipelines
- 4C: Backfill missing content hashes on any new observations

**Pass 5: Entity Fragmentation Check**
Pairwise comparison of all active entity names using edit distance. Detects duplicates like "GregLite" vs "greglite" vs "Greg Lite". Flags for manual review.

**Pass 5B: Eye of Sauron Quality Scan**
Runs static code analysis across active codebases. Writes health scores as observations to brain.db. Tracks code quality trends over time.

**Pass 6: Recall Quality Regression**
Runs a 50-query benchmark against brain.db. Tests across 4 domains (dev, consciousness, personal, business). Baseline: 88%. Alerts if any domain drops below threshold.

### Data Sync (Passes 7-9)

**Pass 7: LIFELOG Sync** — Ingests new/changed life record files into brain.db.
**Pass 8: FPP Sync** — Ingests research and external context.
**Pass 9: Backup Sync** — Syncs critical folders to OneDrive.

### Cognitive Passes (Passes 10-13) — Anthropic API

**Pass 10: Structural Isomorphism Detection**
Pure SQL — no API. Compares all active project entities by observation density and edge connectivity patterns. Creates `structural_isomorphism` edges between entities with similar structural roles (score >= 0.5). These edges enable graph-based recall to surface structurally similar projects even when they share no keywords or topics.

**Pass 11: Epistemic Maintenance (TREG)**
Uses the Anthropic API to scan the top 3 most-observed entities for epistemic health. Sends observation history to Claude for analysis. Detects:
- Contradictions between older and newer observations
- Zombie assumptions — claims superseded by newer evidence
- Stale observations that should be flagged

Persists results as `treg_scan` tagged observations with health scores.

**Pass 12: Autonomous Synthesis (LANTERN)**
Creative wandering pass. Picks 5 random active entities and sends their latest observations to the API. Asks for unexpected cross-entity connections, shared patterns, and lateral insights. Persists discoveries as `lantern_synthesis` observations.

**Pass 13: Self-Improvement Backlog (PROMETHEUS)**
System self-analysis. Gathers stats (active/archived obs, edge count, never-recalled ratio, source distribution, most-recalled observations) and sends to Claude-as-PROMETHEUS. Generates concrete improvement proposals ranked by impact and effort. Writes proposals to `prometheus_proposals.json`.

## Scheduling

- **Primary:** Windows Task Scheduler, daily at 4:00 AM, `StartWhenAvailable` flag catches missed runs
- **Backup:** Windows Startup folder VBS launcher (15-second delay to avoid brain.db lock)
- **Guard:** Checks log for today's date header; skips if already ran. Override with `--force`

## Configuration

- API key loaded from `D:\Meta\.env` (ANTHROPIC_API_KEY)
- All API passes gracefully skip if no key is available
- Each cognitive pass opens its own database connection (main db is closed during data sync passes)

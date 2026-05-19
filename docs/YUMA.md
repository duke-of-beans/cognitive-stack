# YUMA — Testing & Validation Subsystem
## "If it survives Yuma, it survives anything."

The tenth system of the cognitive organism. Testing designed for the AI-human partnership.

**Version:** 2.0.0 | **Date:** 2026-05-19 | **Location:** KERNL (testing-tools.ts, brain-tools.ts, git-tools.ts, parallel-gates.ts)

---

## Why It Exists

The cognitive organism had nine systems maintaining memory, research, growth, adversarial testing, and epistemic health — but no way to verify that the *code implementing those systems* actually worked correctly. A single bad refactor could silently break authentication, rate limiting, or memory retrieval with no safety net.

YUMA closes that gap. Named after [Yuma Proving Ground](https://en.wikipedia.org/wiki/Yuma_Proving_Ground) — if it survives Yuma, it survives anything.

## Design Principle

Traditional testing assumes one person writes both code and tests, creating shared blind spots. AI-native testing has structural separation: the human defines correctness, the AI generates code, the AI generates tests, the human reviews and approves. Neither party has unilateral control. This blind-spot separation is a testing advantage most teams pay for (separate QA teams) that this architecture gets for free.

## Architecture

### Schema (5 tables in KERNL's database)
- `test_specs` — Test definitions per project (tier, type, tags, provenance)
- `test_runs` — Run history with health scores and prophecies
- `test_worlds` — Fixture definitions for isolated test data
- `mutation_results` — WHETSTONE code mode output tracking
- `test_baselines` — Benchmark reference points with tolerance

### Test Tiers
| Tier | Purpose | Example |
|------|---------|---------|
| **Smoke** | Does it start without crashing? | `npm run build` exits zero |
| **Contract** | Does this return what I expect? | brain_recall returns array with score fields |
| **Regression** | Does the fixed bug stay fixed? | Empty query no longer crashes |
| **Benchmark** | Is performance within bounds? | Recall P95 < 500ms |
| **Chain** | Do multi-tool workflows work end-to-end? | remember → recall → verify roundtrip |
| **Unit** | Do internal functions behave correctly? | AI-generated via Anthropic API |

### Tools (19)

**Spec Management:** test_define, test_list, test_remove, test_contract
**Execution:** test_run, test_precommit
**Health:** test_health (project readiness = features × 0.6 + yuma × 0.4)
**Baselines:** test_baseline
**Chains:** test_chain (E2E workflow testing)
**Test Worlds:** test_world_define, test_world_setup, test_world_teardown, test_world_list
**AI Generation:** test_generate (reads source, generates tests via Anthropic API)
**Staged Versioning:** dev_branch, merge_to_main (Yuma-gated)
**Preserved:** sys_run_tests, sys_validate_tools, sys_check_health, sys_benchmark

### Integration Points

| Integration | What It Does |
|-------------|-------------|
| **smart_commit** | `verifyTests` parameter blocks commits when smoke/contract tests fail |
| **five_gate_check** | 'tests' gate reports specs, health score, band, and tier breakdown |
| **WHETSTONE code mode** | `mode: "code"` generates intelligent targeted mutations, reports coverage gaps |
| **NIGHTSHIFT Pass 14** | Enrichment 5 writes Yuma Health scores to each project's STATUS.md |
| **Morning Briefing** | Per-project Yuma health scores surface at every session start |

### Health Score

```
H = (Coverage × 0.30) + (Pass Rate × 0.30) + (Recency × 0.15) + (Freshness × 0.10) + (Mutation × 0.15)
```

| Score | Band | Meaning |
|-------|------|---------|
| 90-100 | GREEN | Well tested, recently verified |
| 70-89 | YELLOW | Gaps exist but core covered |
| 50-69 | ORANGE | Significant untested surface |
| 0-49 | RED | Flying blind |

### Project Readiness Formula

```
Readiness = (Feature Completion × 0.6) + (Yuma Health × 0.4)
```

A project can't be GREEN unless both features AND tests are solid.

### Prophecy Engine

Predictive warnings generated during health checks:
- "3 tests haven't run in 14 days — results may be stale"
- "brain-tools.ts modified since last test run — regression risk"
- "No smoke tests defined — build verification gap"
- "12 AI-generated specs have never been reviewed"

## Workflow

```
1. dev_branch(action: "create")     → Safe workspace, main untouched
2. Build features, smart_commit      → Yuma gates every commit
3. test_run / test_health            → Verify coverage and health
4. merge_to_main                     → Yuma gates the merge
5. Main stays stable. Always.
```

## WHETSTONE Code Mode

WHETSTONE gained a `mode: "code"` parameter for intelligent mutation testing. Unlike traditional mutation tools that generate random operator swaps, WHETSTONE uses the Anthropic API to generate targeted mutations that exploit actual blind spots in test coverage.

Example output:
```
mutation: host === "auth.covos.app" → host.includes("auth.covos.app")
risk: Subdomain takeover — malicious domains match as substring
caught: false
proposed_test: Verify exact match, not substring
```

Results persist to both brain.db (as observations) and the mutation_results table.

---

*Part of the [Cognitive Stack](../README.md). Implementation lives in [KERNL](https://github.com/duke-of-beans/KERNL).*

# Workflow: slide-builder

## Overview
End-to-end slide creation: from user request to PowerPoint delivery. The portable contract is `brief -> evidence -> content lock -> render`, while this repo currently fulfills that flow through design template setup, content research, slide architecture, and script generation.

Execution principle:
- run one short upfront briefing gate when blockers remain
- once the brief is locked, continue to local output without additional requirement interviews
- ask again only for hard blockers or GitHub distribution approval

## Full Orchestration Flow

```
User Request
    │
    ▼
┌──────────────────┐
│  slide-builder    │  (Skill: router)
│  skill            │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Step -1:        │
│  Briefing Gate   │
│                  │
│  Lock audience   │
│  purpose/action  │
│  slide budget    │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  slide-builder-   │  (Agent: planner)
│  planner          │
│                   │
│  Determines:      │
│  - Template need  │
│  - Brief gaps      │
│  - Research scope  │
│  - Slide count    │
└────────┬─────────┘
         │
   ┌─────┴─────────────────┐
   │ (parallel)             │
   ▼                        ▼
┌──────────────┐    ┌───────────────┐
│  Step 0:      │    │  Step 1:       │
│  Template     │    │  Content       │
│  Setup        │    │  Research      │
│  (conditional)│    │  (always)      │
│              │    │               │
│  brand-       │    │  content-      │
│  researcher   │    │  researcher    │
│      ↓        │    │               │
│  template-    │    │               │
│  generator    │    │               │
└──────┬───────┘    └───────┬───────┘
       │                     │
       └──────────┬──────────┘
                  │
                  ▼
         ┌────────────────┐
         │  Step 2:        │
         │  Slide          │
         │  Architecture   │
         │                 │
         │  slide-architect │
         │  (トヨマネ式)    │
         └────────┬───────┘
                  │
                  ▼
         ┌────────────────┐
         │  Step 3:        │
         │  Script Gen     │
         │  & Execution    │
         │                 │
         │  slide-scripter │
         │  (Phase 2-4)    │
         └────────┬───────┘
                  │
                  ▼
         ┌────────────────┐
         │  Output:        │
         │  - PPTX file    │
         │  - PDF file     │
         │  - GitHub URLs  │
         │  - Discord/Email│
         └────────────────┘
```

## Step Details

### Step -1: Briefing Gate
**Goal**: Lock the minimum brief before research starts
**Ask style**: One short bundled follow-up, only for missing blockers
**Must lock**:
- topic
- audience
- purpose
- desired_action
- slide_count or talk_minutes
**Do not ask**:
- chart type
- layout
- visual placement
**Run-to-output rule**: Once this gate is satisfied, proceed through Step 0-3 without further requirement questions unless a hard blocker appears.

### Step 0: Template Setup (Conditional)
**Condition**: Company name or URL provided AND user wants branded slides
**Agents**: `brand-researcher` → `template-generator`
**Input**: company_name, company_url, style_preference
**Output**: Updated template.js with brand colors
**Fallback**: Monotone default if research fails

**Can run in parallel with Step 1.**

### Step 1: Content Research
**Agent**: `content-researcher`
**Input**: topic, audience, purpose, desired_action, research_scope
**Output**: Structured research data with facts, statistics, sources, bounded thread summaries, and a compact handoff digest
**Key**: Each data point tagged with suggested slide pattern
**Source priority**: For Japanese quantitative topics, official government statistics first, then other primary sources, then secondary summaries.
**Portable contract**: This is the repo's `evidence-pack` phase and should produce `research.v1`.
**Repo-local runtime**: When a local/file-based dataset is already known, preserve `live_data_ref` so the live evidence resolver can materialize `resolved_data` before render.
**Parallel rule**: When the question naturally splits, use at most four independent research threads and merge them before architecture.

### Step 2: Slide Architecture
**Agent**: `slide-architect`
**Depends on**: Step 1 output (research data)
**Input**: research handoff digest, source locators, topic, audience, purpose, slide_count
**Output**: Locked `content.v1` plus slide plan following トヨマネ式 7-step:
1. 問い identified
2. 答え defined (1 sentence)
3. 理由 narrowed (≤3)
4. Each slide: keyMessage (top) + content (bottom)
5. Structure: Title → Summary → [Section → Body] → Conclusion
6. Each slide: title (question) + keyMessage (answer) + content (evidence)
7. Summary restates conclusion
**Portable contract**: This is the repo's `talktrack-architect` phase. It must emit structured `visual_intent` for charts, tables, stats, and comparisons before rendering.
**Context rule**: Consume the compact digest first. Reopen raw primary sources only when a claim is weak, conflicting, or ambiguous.

### Step 3: Script Generation & Execution
**Agent**: `slide-scripter`
**Depends on**: Step 0 (template ready) + Step 2 (slide plan)
**Input**: locked content / slide_plan, template configuration
**Actions**:
- Phase 2: Generate Node.js script at `output/` (project root relative)
- Prefer `scripts/render-content.js` when rendering from `content.v1`
- When `brief.v1`, `research.v1`, and `content.v1` are all available, prefer `scripts/run-slide-workflow.js` so live evidence resolution, render failure handling, and `evaluation.v1` emission stay consistent
- Phase 3: Execute script → produce PPTX in `output/`
- Phase 4 (確認式): ユーザーに「GitHubにも配信しますか？」と確認
  - **はい** → `downloads/` にコピー → PDF変換 → git push
  - **いいえ** → `output/` のファイルで完了（ローカルのみ）
**Output**: PPTX path (always), GitHub download URLs (only if distributed)
**Renderer rule**: If `visual_intent.must_render = true` and no supported template function can render it, return a structured render exception instead of silently dropping the visual.
**Boundary rule**: The render step consumes locked content and resolved visual data only. It must not pull raw research dumps into rendering.

## Context-Efficient Multi-Agent Decomposition

Use multi-agent orchestration only when it lowers latency or context pressure.

Planner budget:

- default `max_parallel_tasks = 4`
- prefer one thin planner plus narrow workers over one broad worker with the whole context
- keep Step 0 and Step 1 parallel only when branding and research are independent

Research team split:

- source-scout threads get only:
  - brief slice
  - one research subquestion
  - relevant source priority
  - prior evidence IDs or dataset IDs when available
- each source-scout returns:
  - short digest
  - evidence IDs
  - source locators
  - blockers
- one normalizer merges these into:
  - `research.v1`
  - `research_threads[]`
  - `handoff_digest`

Architecture team boundary:

- `slide-architect` should consume `handoff_digest` first
- use linked `evidence_ids` and locators to inspect only the evidence needed for the active slide
- do not carry full research dumps into `content.v1`

Render team boundary:

- `slide-scripter` and renderer should consume `content.v1` and resolved `content_data`
- they should not receive broad research context unless debugging a failed render contract
- if local/file-based source data is available, resolve it through the live evidence resolver before the final render step

## Data Flow

```
User Input
  → { topic, company_name, audience, purpose, desired_action, slide_count, talk_minutes, style_preference }

Step -1 output (brief lock)
  → locked minimum brief
  → no further requirement interview unless blockers appear

Step 0 output (template)
  → template.js updated with brand/monotone colors

Step 1 output (research)
  → research.v1
  → research_threads[] + handoff_digest

Dataset reuse rule
  → When one official dataset is strong enough, use it as a shared evidence spine across stats, chart, comparison, and table slides instead of mixing weaker unrelated numbers.

Step 2 output (architecture)
  → content.v1
  → talktrack.md / speaker-notes.json / mobile-cue.json derive from the same locked content artifact

Step 3 output (delivery)
  → { pptx_path, pdf_path, github_urls, slide_count }
```

## Path Convention

All paths are relative to the project root. Never use absolute paths.

| Purpose | Path |
|---------|------|
| Template library | `scripts/template.js` |
| Generated scripts | `output/generate_[name].js` |
| Generated PPTX | `output/[name].pptx` |
| Download PPTX | `downloads/pptx/[name].pptx` |
| Download PDF | `downloads/pdf/[name].pdf` |

## Error Handling

| Error | Recovery |
|-------|----------|
| Minimum brief missing | Ask one short upfront briefing question, then continue end-to-end once answered |
| Brand research fails | Fall back to monotone template |
| Content research insufficient | Use available data + note gaps to user |
| Required credentials missing | Stop with `operator_action_required`; do not open interactive auth |
| Required visual cannot be rendered | Emit structured render exception; do not silently degrade |
| Script execution fails | Read error, fix script, retry (max 3 attempts) |
| PDF conversion fails | Skip PDF; GitHub Actions will auto-convert |
| Git push fails | Follow the repository branch policy, then report to the user if delivery still fails |

## Integration with design-template Skill

The `design-template` skill can be used independently to set up branding:
1. User runs `design-template` with company info → template.js updated
2. User runs `slide-builder` → slides created with current template.js colors

Or the `slide-builder-planner` can internally trigger Step 0 (brand-researcher + template-generator) when a company is specified, making the flow seamless.

## Execution Commands

```bash
# Install dependencies (if not done)
npm install

# Create output directory
mkdir -p output

# Generated script execution
node output/generate_[name].js

# Artifact-based local orchestration
node scripts/run-slide-workflow.js brief.json research.json content.json output/evaluation.json --output-dir=output

# Distribution
cp output/[name].pptx downloads/pptx/
libreoffice --headless --convert-to pdf --outdir downloads/pdf/ downloads/pptx/[name].pptx
git add downloads/ && git commit -m "Add [name]" && git push
```

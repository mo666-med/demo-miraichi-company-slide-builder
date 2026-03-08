# AGENTS.md - Company Slide Builder SSOT

This file is the single source of truth for AI agents working in this repository.
Adapter files such as `CLAUDE.md` and `CODEX.md` must stay thin and point here.

## 1. Context Loading Policy

- Read this file first.
- Read `README.md` for extended setup, the full 22-pattern catalog, and operator-facing details.
- Read `scripts/template.js` when you need current function signatures, exported constants, or asset usage.
- Load `.claude/agents/*.md` and `.claude/workflows/*.md` only for the active phase you are executing.
- Keep provider-specific adapters short to avoid duplicated context.
- Prefer artifact URIs, summaries, and source locators over pasted raw source text.
- Load evidence, references, and phase docs on demand; do not bulk-load them into working context.
- When spawning sub-agents, pass the smallest task packet that can succeed: brief slice, active artifact URI, claim IDs, evidence IDs, and source locators only.

## 2. Project Overview

This repository generates branded business PowerPoint decks with `pptxgenjs`.

- Template library: `scripts/template.js`
- Content-to-template renderer: `scripts/render-content.js`
- Company presets: `scripts/presets/`
- Shared assets such as logos: `assets/`
- Local-only generation output: `output/`
- Git-tracked delivery artifacts: `downloads/pptx/` and `downloads/pdf/`
- Notification workflow: `.github/workflows/notify-pptx.yml`

## 3. Portable Talktrack-First Contract

GitHub distribution should stay aligned to the portable design docs:

- `skills.md`
- `Agent.md`

Keep the portable stack minimal:

- `slide-briefing`
- `evidence-pack`
- `talktrack-architect`
- `slide-renderer`
- `evidence-vault` (optional)

Core rules:

- `brief -> evidence -> content lock -> render`
- slides, full script, speaker notes, and mobile cue cards must come from one locked `content.v1` artifact
- `visual_intent` is mandatory for proposed charts, tables, stat blocks, and comparisons
- the renderer may change layout and style, but it must not change claims, metrics, or storyline
- canonical artifacts stay host-neutral as `artifact://{run_id}/{slug}/...`
- model selection stays capability-based and overrideable; do not hardcode raw model names into the contract
- for concrete talktrack and speaker-note writing, prefer a high-tier writing profile by default
- complex work may be split into bounded multi-agent tasks, but handoffs must stay digest-first and locator-first
- user auth is out of scope; missing credentials must fail as `operator_action_required`

## 4. Runtime Source Of Truth

- `package.json` defines the supported npm commands.
- `scripts/template.js` is the runtime contract for slide function names, exported config, palette, font, and asset paths.
- `scripts/resolve-research-data.js` is the repo-local normalizer that can backfill or reuse `research.v1.evidence[].resolved_data` and canonicalize a few alias payload shapes without broadening the portable contract.
- `scripts/live-evidence-resolver.js` is the repo-local live extractor for local/file-based JSON or CSV sources that can populate `resolved_data` before rendering.
- `scripts/resolve-research-data-cli.js` is the local CLI entrypoint when the repo needs to materialize normalized `research.v1` before rendering.
- `scripts/run-slide-workflow.js` is the local orchestration runner for `brief + research + content -> normalize -> render -> evaluation`.
- `scripts/render-content.js` is the mapping layer from `content.v1` and `visual_intent` into the template functions.
- `scripts/render-content.js` can also resolve optional `research.v1.evidence[].resolved_data` into slide `content_data` before rendering.
- `scripts/presets/` is the preferred place for reusable company-specific branding.
- `downloads/pptx/*.pptx` is the delivery trigger surface for GitHub Actions.
- `output/` is gitignored and must be treated as local-only scratch output.
- `docs/workflow-verification.md` is the release gate for the portable research -> talktrack -> render contract.

## 5. Standard Workflow

### Phase 0: Branding and Template Setup

- If the user gives a company name or URL, check `scripts/presets/` first.
- If a preset exists, apply it and skip web research.
- If no preset exists, do bounded web research to determine primary, secondary, and accent colors, then present evidence and get user approval before editing the template palette.
- Routine branding edits should be limited to values such as palette, chart colors, font, preset definitions, and shared assets.

Detailed references:

- `.claude/agents/brand-researcher.md`
- `.claude/agents/template-generator.md`
- `.claude/workflows/design-template_workflow.md`

### Phase 1: Briefing and Evidence

- Collect the minimum brief before slide writing:
  - topic
  - audience
  - purpose
  - desired action
  - slide count or talk time
- Treat briefing as a short upfront gate, not an open-ended interview.
- Use minimal structured dialogue:
  - ask only for blocking missing fields
  - when the user gives only a topic or a loose request, ask one short bundled follow-up first:
    - who the deck is for
    - what decision or understanding the deck should drive
    - slide count or talk time if neither can be inferred safely
  - do not ask for chart type, layout, or visual placement
  - if either slide count or talk time is present, infer the other when safe
- Do not start research, architecture, or rendering until the minimum brief is locked.
- After the brief is locked, continue through `evidence -> content lock -> render -> local output` without pausing for additional requirement questions unless:
  - a hard blocker appears
  - a factual conflict changes the thesis
  - credentials or operator action are required
- Gather evidence before writing slides or speaker notes.
- When the research question naturally splits, keep it to a bounded number of independent threads and merge them back into one compact `research.v1` handoff.
- When the topic involves Japan and can be supported by public statistics, prefer official government statistics first.
- For legal or policy topics, prefer laws, official guidance, and ministry sources first.
- Use X search only as a trend signal, never as the sole support for a major claim.

Quantitative evidence policy:

- Use e-Stat datasets before generic web statistics whenever the needed metric exists there.
- Treat one strong government dataset as a reusable asset that can drive multiple slide patterns:
  - headline KPI -> Pattern 7
  - trend line / bar chart -> Pattern 10
  - breakdown table -> Pattern 16 or 22
  - segment comparison -> Pattern 6 or 12
- Favor at least one government-stat-based chart in the deck when it materially strengthens the argument.
- Do not use decorative charts without a traceable primary source.

Detailed references:

- `.claude/agents/slide-builder-planner.md`
- `.claude/agents/content-researcher.md`
- `.claude/workflows/slide-builder_workflow.md`

### Phase 2: Talktrack Architecture And Content Lock

Design every deck with the repo's conclusion-first business-slide method:

1. identify the core question
2. define the single-sentence answer
3. reduce reasons to at most three
4. structure each slide as key message on top plus supporting detail below
5. build the deck as title -> summary -> section -> body -> conclusion

Talktrack and lock rules:

- `talktrack-architect` owns the storyline. In this repo today, that role is fulfilled by the planning plus `slide-architect` phase.
- The architecture phase should consume the compact research digest first and reopen raw primary sources only for conflict resolution or weak-claim checks.
- Emit one locked `content.v1` payload before rendering.
- Keep these fields stable after content lock:
  - `question`
  - `conclusion`
  - `reasons`
  - `slides[].slide_mode`
  - `slides[].supports_slide_id`
  - `slides[].title`
  - `slides[].key_message`
  - `slides[].body_blocks`
  - `slides[].data_bindings`
  - `slides[].evidence_ids`
  - `slides[].dataset_reuse_group`
  - `slides[].visual_intent`
- If a graph, table, stat block, or comparison is proposed, represent it as structured `visual_intent`, not prose-only instructions.

Detailed references:

- `.claude/agents/slide-architect.md`
- `.claude/agents/slide-builder-planner.md`
- `.claude/workflows/slide-builder_workflow.md`

### Phase 3: Script Generation And Rendering

- Generate one-off scripts in `output/`, typically `output/generate_[slug].js`.
- Resolve paths from the project root or from `__dirname`.
- Reuse exported functions from `scripts/template.js`; do not reimplement slide primitives in ad hoc scripts.
- When rendering from `content.v1`, prefer `scripts/render-content.js` to map `visual_intent` into template functions.
- When `brief.v1`, `research.v1`, and `content.v1` are all available, prefer `scripts/run-slide-workflow.js` so live evidence resolution, render failure handling, and `evaluation.v1` stay on one path.
- When both `content.v1` and `research.v1` are available, prefer `renderDeckFromArtifacts(...)` so resolved research payloads can fill missing `content_data`.
- The render phase should consume locked content and resolved visual data only; it should not pull raw research dumps into the rendering step.
- The renderer may change layout, typography, spacing, and chart form within the approved visual family. It must not change claims or metrics.
- If `visual_intent.must_render = true` and no supported template function can render it, emit a structured `render_exception.v1` instead of silently dropping the visual.

### Phase 4: Execution

- Run the generated script with `node output/<script>.js`.
- For template regression checks, run `node scripts/test.js` or `npm test`.

### Phase 5: Delivery

- The default execution mode is run-to-output after the initial briefing gate.
- Ask the user before GitHub distribution.
- If the user wants local output only, stop after reporting the file under `output/`.
- If the user wants distribution, copy the generated PPTX into `downloads/pptx/` before commit/push.
- Local PDF generation into `downloads/pdf/` is optional; GitHub Actions can convert PPTX to PDF if the PDF is missing.
- After push, provide the GitHub URLs for the PPTX and PDF artifacts.

Important delivery rule:

- Updating `output/*.pptx` alone does not trigger the notification pipeline.
- The notification workflow reacts to tracked files under `downloads/pptx/` (and optional `downloads/pdf/`).

## 6. Host-Neutral And No-Auth Rules

Canonical artifacts:

- `artifact://{run_id}/{slug}/brief.json`
- `artifact://{run_id}/{slug}/research.json`
- `artifact://{run_id}/{slug}/content.json`
- `artifact://{run_id}/{slug}/talktrack.md`
- `artifact://{run_id}/{slug}/speaker-notes.json`
- `artifact://{run_id}/{slug}/mobile-cue.json`
- `artifact://{run_id}/{slug}/evaluation.json`
- `artifact://{run_id}/{slug}/output.pptx`
- `artifact://{run_id}/{slug}/output.pdf`

Local paths such as `/tmp/...` and `output/...` are mirrors only. They are never canonical.

Auth rules:

- Allowed: repo/org secrets, service accounts, operator-managed credentials
- Not allowed: user OAuth, end-user Google login, interactive token pasting, implicit personal Drive assumptions
- If credentials are missing, fail as `operator_action_required`

Canonical secret names:

- `XAI_API_KEY`
- `MANUS_API_KEY`
- `GUIDESCOPE_API_KEY`
- `ESTAT_APP_ID`
- `DRIVE_SERVICE_ACCOUNT_JSON`
- `DISCORD_WEBHOOK_URL`
- `MAIL_USERNAME`
- `MAIL_PASSWORD`
- `MAIL_TO`
- `MAIL_FROM`

## 7. Editing Guardrails

- For ordinary slide jobs, prefer creating `output/` scripts over editing the template library.
- Template-library edits are allowed only when the user explicitly wants a reusable change to shared layout, branding, assets, or exports.
- Preserve existing public exports from `scripts/template.js` when modifying the library.
- Reusable branding belongs in `scripts/presets/` or `assets/`, not in one-off generation scripts.
- After changing `scripts/template.js`, assets, or presets, run `node scripts/test.js`.
- Respect existing uncommitted user changes. Do not revert them unless explicitly asked.

## 8. Common Commands

```bash
npm install
mkdir -p output
npm run install:kernel-skill
npm run test:resolve-research-data
npm test
npm run test:workflow-contract
npm run test:render-contract
node scripts/test.js
node scripts/resolve-research-data-cli.js <content.json> <research.json> [output.json]
node output/<script>.js
git remote get-url origin
```

## 9. Key Files

- `scripts/template.js`: core slide API and shared visual system
- `scripts/render-content.js`: `content.v1` renderer and structured render exception contract
- `scripts/resolve-research-data.js`: repo-local `resolved_data` backfill and reuse builder
- `scripts/live-evidence-resolver.js`: repo-local live source extractor for JSON / CSV evidence
- `scripts/resolve-research-data-cli.js`: CLI entrypoint for materializing resolved research artifacts
- `scripts/run-slide-workflow.js`: local orchestration runner and evaluation emitter
- `scripts/test-workflow-contract.js`: fixture-based verification for `brief.v1`, `research.v1`, `content.v1`, and `evaluation.v1`
- `scripts/test.js`: regression generator for all supported patterns
- `scripts/test-render-content.js`: targeted contract test for `visual_intent` rendering
- `scripts/presets/index.js`: preset lookup and apply helpers
- `README.md`: operator-facing setup and full pattern reference
- `docs/workflow-verification.md`: simulation matrix and release gate
- `skills.md`: portable skill-stack contract for GitHub distribution
- `Agent.md`: portable agent contract for GitHub distribution
- `.claude/skills/slide-builder/SKILL.md`: Claude-oriented slide workflow router
- `.claude/skills/design-template/SKILL.md`: Claude-oriented branding workflow router
- `.codex/skills/biz-slide/SKILL.md`: Codex/Kernel-oriented repo-local skill entrypoint

## 10. Adapter Contract

- `CLAUDE.md` and `CODEX.md` must contain only provider-specific deltas, read order, and minimal command references.
- If an adapter conflicts with this file, `AGENTS.md` wins.

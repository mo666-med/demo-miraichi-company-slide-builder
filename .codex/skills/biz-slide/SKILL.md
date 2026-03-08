---
name: biz-slide
description: Branded business-slide workflow for this repository. Use for client proposals, seminar decks, training decks, or when the user says /biz-slide, business slide, company slide, 提案資料, 研修資料, or 企業スライド.
---

# Biz Slide

Use this repo-local skill when working inside `company-slide-builder`.

## Read order

1. Read `../../../AGENTS.md`.
2. If the task is about portable architecture, FUGUE compatibility, or no-auth routing, read `../../../skills.md` and `../../../Agent.md`.
3. Read `../../../README.md` only when you need setup details or the full pattern catalog.
4. Load detailed phase docs from `../../../.claude/agents/` only for the active phase.

## Workflow

1. Setup the repo with `npm install` and `mkdir -p output` if needed.
2. Start portable design work from the minimal contract:
   - `brief -> evidence -> content lock -> render`
   - keep the stack to `slide-briefing`, `evidence-pack`, `talktrack-architect`, `slide-renderer`, and optional `evidence-vault`
   - keep canonical artifacts host-neutral as `artifact://{run_id}/{slug}/...`
   - if the user request is underspecified, run one short upfront briefing gate first, then continue to local output without more requirement interviews
3. If the user wants branded slides, run Phase 0 branding first:
   - check `../../../scripts/presets/` before web research
   - if no preset exists, research brand colors and get user approval before editing shared branding
4. If the topic involves Japanese market, policy, demographics, labor, healthcare, households, education, or regional economy, prefer official government statistics before generic web summaries.
5. Design the deck with the repo's conclusion-first structure and lock one `content.v1` before rendering.
6. If a chart, table, stat block, or comparison is proposed, require structured `visual_intent` instead of prose-only instructions.
7. Reuse strong government datasets across multiple slide patterns when possible so KPI, chart, table, and comparison slides share the same evidence spine.
8. If you already have `brief.v1`, `research.v1`, and `content.v1`, prefer `../../../scripts/run-slide-workflow.js` so live evidence resolution, render failure handling, and `evaluation.v1` stay aligned.
9. Otherwise generate a one-off script under `../../../output/` that uses `../../../scripts/template.js` directly or `../../../scripts/render-content.js` for `content.v1`.
10. Run the script or workflow runner and confirm the produced PPTX path.
11. Do not stop after briefing lock; run through research, architecture, and rendering in one pass unless a hard blocker appears.
12. Ask before GitHub distribution.
13. If distributing, copy the PPTX into `../../../downloads/pptx/`, optionally create `../../../downloads/pdf/`, then commit and push.

## Guardrails

- Prefer `output/` scripts over one-off edits to `scripts/template.js`.
- Keep the renderer dumb: it may change layout and style, but not claims or metrics.
- When `visual_intent.must_render = true`, do not silently drop the visual. Raise a structured render exception.
- Stay no-auth: if credentials are missing, fail as `operator_action_required` instead of opening an interactive login flow.
- When intentionally changing the template library, presets, or shared assets, run `node scripts/test.js`.
- When changing repo-local workflow/runtime logic, run `npm test`.
- Preserve the exported template API unless the user explicitly requests a breaking library change.
- `output/` is local-only; it does not trigger the notify workflow by itself.
- When Japanese public data is relevant, prefer e-Stat or other official government statistics over secondary summaries.

## Detailed references

- `../../../.claude/agents/slide-builder-planner.md`
- `../../../.claude/agents/content-researcher.md`
- `../../../.claude/agents/slide-architect.md`
- `../../../.claude/agents/slide-scripter.md`
- `../../../.claude/agents/brand-researcher.md`
- `../../../.claude/agents/template-generator.md`
- `../../../.claude/workflows/slide-builder_workflow.md`
- `../../../.claude/workflows/design-template_workflow.md`

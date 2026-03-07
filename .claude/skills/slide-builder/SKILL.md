---
name: slide-builder
description: PowerPointスライドを自動生成する。「スライド作成」「プレゼン作成」「資料作成」「スライド作って」「プレゼン作って」「slide」「presentation」「PowerPoint」などで発動。
---

# Skill: slide-builder

## Description
Detects requests to create PowerPoint slide decks. Routes to the slide-builder-planner agent. Works with the design-template skill for branding.

## Behavior
1. Collect user context: topic, company name, audience, purpose, slide count preference.
2. If the user specifies a company and wants branded slides, suggest running `design-template` skill first (or auto-trigger).
3. Spawn the `slide-builder-planner` agent with all collected context.

## Routing
```
User Request → slide-builder-planner agent
```

## Important
- This skill contains NO slide design logic.
- This skill contains NO research logic.
- The トヨマネ式 methodology lives in the slide-architect agent.
- All planning and execution happen in agents.

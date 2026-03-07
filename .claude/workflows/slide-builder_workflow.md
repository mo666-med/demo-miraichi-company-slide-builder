# Workflow: slide-builder

## Overview
End-to-end slide creation: from user request to PowerPoint delivery. Coordinates design template setup, content research, slide architecture, and script generation.

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
│  slide-builder-   │  (Agent: planner)
│  planner          │
│                   │
│  Determines:      │
│  - Template need  │
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

### Step 0: Template Setup (Conditional)
**Condition**: Company name or URL provided AND user wants branded slides
**Agents**: `brand-researcher` → `template-generator`
**Input**: company_name, company_url, style_preference
**Output**: Updated template.js with brand colors
**Fallback**: Monotone default if research fails

**Can run in parallel with Step 1.**

### Step 1: Content Research
**Agent**: `content-researcher`
**Input**: topic, audience, purpose, research_scope
**Output**: Structured research data with facts, statistics, sources
**Key**: Each data point tagged with suggested slide pattern

### Step 2: Slide Architecture
**Agent**: `slide-architect`
**Depends on**: Step 1 output (research data)
**Input**: research_data, topic, audience, purpose, slide_count
**Output**: Full slide plan following トヨマネ式 7-step:
1. 問い identified
2. 答え defined (1 sentence)
3. 理由 narrowed (≤3)
4. Each slide: keyMessage (top) + content (bottom)
5. Structure: Title → Summary → [Section → Body] → Conclusion
6. Each slide: title (question) + keyMessage (answer) + content (evidence)
7. Summary restates conclusion

### Step 3: Script Generation & Execution
**Agent**: `slide-scripter`
**Depends on**: Step 0 (template ready) + Step 2 (slide plan)
**Input**: slide_plan, template configuration
**Actions**:
- Phase 2: Generate Node.js script at `output/` (project root relative)
- Phase 3: Execute script → produce PPTX in `output/`
- Phase 4 (確認式): ユーザーに「GitHubにも配信しますか？」と確認
  - **はい** → `downloads/` にコピー → PDF変換 → git push → merge to main
  - **いいえ** → `output/` のファイルで完了（ローカルのみ）
**Output**: PPTX path (always), GitHub download URLs (only if distributed)

## Data Flow

```
User Input
  → { topic, company_name, audience, purpose, slide_count, style_preference }

Step 0 output (template)
  → template.js updated with brand/monotone colors

Step 1 output (research)
  → { topic_summary, conclusion, reasons[], research_sections[], sources[] }

Step 2 output (architecture)
  → { question, conclusion, reasons[], slides[].{pattern, function, title, key_message, content_data, source} }

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
| Brand research fails | Fall back to monotone template |
| Content research insufficient | Use available data + note gaps to user |
| Script execution fails | Read error, fix script, retry (max 3 attempts) |
| PDF conversion fails | Skip PDF; GitHub Actions will auto-convert |
| Git push fails | Retry with pull --rebase; report to user if still failing |

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

# Distribution
cp output/[name].pptx downloads/pptx/
libreoffice --headless --convert-to pdf --outdir downloads/pdf/ downloads/pptx/[name].pptx
git add downloads/ && git commit -m "Add [name]" && git push
git checkout main && git merge [branch] && git push
```

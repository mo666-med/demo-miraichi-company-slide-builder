---
name: design-template
description: 会社のWebサイトからブランドカラーを調査し、スライドテンプレート（scripts/template.js）に反映する。「デザインテンプレート」「カラー変更」「ブランドカラー」「配色」「〇〇のテンプレートで」などで発動。
---

# Skill: design-template

## Description
会社のWebサイトからブランドカラーを調査し、スライドテンプレート（`scripts/template.js`）に反映する。

## Behavior

1. ユーザーの入力から以下を収集する:
   - 会社名
   - 公式サイトURL（あれば）
   - スタイルの希望（あれば）
   - 具体的な色の指定（あれば）

2. 入力がない場合、ユーザーに会社名またはURLを確認する（モノトーンでよいかも確認）

3. ブランドリサーチを実行する（`.claude/agents/brand-researcher.md` の手順に従う）:
   - Step 1: WebSearch で公式サイト特定
   - Step 2: WebFetch でトップページからカラー抽出
   - Step 3: 不十分ならCSSファイルを直接取得
   - Step 4: 不十分ならサブページも調査
   - Step 5: Primary / Secondary / Accent を決定（evidence 付き）

4. テンプレートを更新する（`.claude/agents/template-generator.md` の手順に従う）:
   - COLORS の HEX 値を Edit で更新
   - CHART_COLORS を8色で再生成
   - FACE をブランドフォントに更新（該当する場合のみ）

5. ユーザーにカラーパレットを提示し、承認を得る

## Integration
- **単体使用**: このスキル単体でテンプレートのカラーをカスタマイズできる
- **slide-builder 連携**: `slide-builder` の Phase 0 として自動実行される（会社名/URLが指定された場合）
- 更新後の template.js は、以降のスライド生成で自動的に使用される

## Important
- このスキルファイルにはデザインロジックや調査ロジックは含まない
- 具体的な調査手順は `.claude/agents/brand-researcher.md` を参照
- カラーマッピングは `.claude/agents/template-generator.md` を参照
- ワークフロー全体図は `.claude/workflows/design-template_workflow.md` を参照

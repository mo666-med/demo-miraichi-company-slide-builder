# Workflow: design-template

## Overview
会社のWebサイトからブランドカラーを調査し、スライドテンプレートに反映する。

## フロー全体図

```
User Request（会社名 / URL / カラー指定）
    │
    ▼
┌──────────────────────────────────┐
│  Step 1: 公式サイト特定           │
│  WebSearch で会社名 → URL を特定  │
│  （URL指定済みならスキップ）       │
└─────────────┬────────────────────┘
              │
              ▼
┌──────────────────────────────────┐
│  Step 2: トップページ調査         │
│  WebFetch でカラー抽出            │
│  → 十分な色が取れた？             │
│     YES → Step 5 へ              │
│     NO  → Step 3 へ              │
└─────────────┬────────────────────┘
              │
              ▼
┌──────────────────────────────────┐
│  Step 3: CSSファイル直接取得      │
│  <link rel="stylesheet"> の      │
│  URLから CSS を WebFetch          │
│  → 十分な色が取れた？             │
│     YES → Step 5 へ              │
│     NO  → Step 4 へ              │
└─────────────┬────────────────────┘
              │
              ▼
┌──────────────────────────────────┐
│  Step 4: サブページ調査           │
│  /about/, /company/, 事業部門     │
│  ページ等を WebFetch              │
└─────────────┬────────────────────┘
              │
              ▼
┌──────────────────────────────────┐
│  Step 5: カラー決定               │
│  Primary / Secondary / Accent    │
│  を抽出結果から決定               │
│  → evidence（根拠）を記録         │
└─────────────┬────────────────────┘
              │
              ▼
┌──────────────────────────────────┐
│  Step 6: template.js 更新        │
│  COLORS / CHART_COLORS / FACE    │
│  の HEX 値を Edit で更新          │
└─────────────┬────────────────────┘
              │
              ▼
┌──────────────────────────────────┐
│  Step 7: ユーザー確認             │
│  カラーパレットを提示             │
│  → 承認: 完了                    │
│  → 却下: ユーザーの希望を聞いて   │
│          Step 6 を再実行          │
└──────────────────────────────────┘
```

## 各ステップの詳細

### Step 1: 公式サイト特定
- **ツール**: WebSearch
- **入力**: company_name
- **出力**: company_url
- **失敗時**: `found: false`、モノトーンデフォルトで続行

### Step 2: トップページ調査
- **ツール**: WebFetch
- **対象**: company_url（トップページ）
- **抽出対象**:
  - `<meta name="theme-color">` の値
  - CSS変数（`--primary-color` 等）
  - ヘッダー/ナビの `background-color`
  - ボタンの `background-color`
  - リンクの `color`
  - `font-family` 宣言
  - インラインスタイル内のHEXコード
- **判定**: 有彩色が2色以上取れたら「十分」

### Step 3: CSSファイル直接取得
- **ツール**: WebFetch
- **対象**: HTMLから特定した CSS ファイルのURL
- **典型的なパス**:
  - `/css/style.css`
  - `/assets/css/main.css`
  - `/wp-content/themes/*/style.css`
  - `/static/css/*.css`
- **抽出対象**: `:root` の変数定義、主要セレクタのカラー

### Step 4: サブページ調査
- **ツール**: WebFetch
- **対象**:（優先順）
  1. `/about/` or `/company/` — 企業情報ページ
  2. 事業部門のトップページ（省庁なら各局のページ）
  3. `/contact/` — フォームやボタンが見える

### Step 5: カラー決定
- **Primary**: ヘッダー背景 > theme-color > CSS変数 > ロゴ色 > 最頻出有彩色
- **Secondary**: ボタン/リンク色 > 2番目に多い有彩色 > Primary の明るい変種
- **Accent**: CTAボタン色 > Primary/Secondary と異なるトーン
- **Background**: コンテンツ背景色 > Primary を薄くした色
- **evidence** 配列に「どの色をどこで見つけたか」を必ず記録

### Step 6: template.js 更新
- **ツール**: Edit
- **対象**: `scripts/template.js`
- **編集箇所**: COLORS の HEX 値、CHART_COLORS 配列、FACE 変数（フォントがある場合のみ）
- **注意**: 変数名（DARK_GREEN 等）は変えない。スライドパターン関数は絶対に触らない

### Step 7: ユーザー確認
- カラーパレットを色見本付きで提示
- 出典URL（evidence）を表示
- 承認 → 完了 / 却下 → ユーザーの希望色を聞いてStep 6 を再実行

## エラーハンドリング

| エラー | 対応 |
|--------|------|
| 会社が見つからない | ユーザーにURL確認を依頼。なければモノトーン |
| サイトにアクセスできない | モノトーンで続行 |
| トップページで色が取れない | Step 3（CSS直接取得）→ Step 4（サブページ）を必ず実行 |
| 色が1色しか取れない | その1色を Primary として Secondary 以降を派生生成 |
| ユーザーが却下 | 希望色を聞いて再適用 |

## エージェント連携

| エージェント | ファイル | 役割 |
|---|---|---|
| brand-researcher | `.claude/agents/brand-researcher.md` | Step 1〜5 の調査ロジック |
| template-generator | `.claude/agents/template-generator.md` | Step 6 のカラーマッピング・template.js 編集 |
| design-template-planner | `.claude/agents/design-template-planner.md` | 全体のオーケストレーション |

## slide-builder との連携

`slide-builder` ワークフローの Step 0 としてこのワークフローが呼ばれる場合:
1. ユーザーが会社名/URLを指定 → このワークフローが自動実行
2. template.js が更新された状態で、スライド設計（Phase 1）に進む
3. 会社名/URLがなければこのワークフローはスキップ（モノトーンのまま）

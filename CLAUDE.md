# Company Slide Builder - Claude Code ルール

## プロジェクト概要

このリポジトリは、ビジネスユーザーがClaude Codeに指示するだけでPowerPointスライドを自動生成するスキルです。
GitHubからクローンして、Claude Codeで即座に使えるように設計されています。

- **テンプレートライブラリ**: `scripts/template.js`（全22パターンのスライド生成関数）
- **企業プリセット**: `scripts/presets/`（企業ごとのカラー・フォント定義）
- **参照資料**: `references/`（企業IR資料等のPDF、gitignored）
- **出力先**: `output/` ディレクトリ（プロジェクトルート直下、gitignored）
- **ダウンロードフォルダ**: `downloads/pptx/`（PPTX）、`downloads/pdf/`（PDF）
- **使用ライブラリ**: pptxgenjs (Node.js)

## セットアップ

```bash
# 1. クローン
git clone <このリポジトリのURL>
cd company-slide-builder

# 2. 依存関係インストール
npm install

# 3. 出力ディレクトリ作成
mkdir -p output

# 4. 環境変数設定（通知機能を使う場合）
cp .env.example .env
# .env を編集して自分のメールアドレス等を設定

# 5. GitHub Secrets 設定（GitHub Actions 通知を使う場合）
# リポジトリの Settings > Secrets and variables > Actions で以下を設定:
#   - MAIL_USERNAME: Gmailアドレス
#   - MAIL_PASSWORD: Googleアプリパスワード
#   - MAIL_TO: 送信先メールアドレス
#   - MAIL_FROM: 送信元メールアドレス
#   - DISCORD_WEBHOOK_URL: Discord Webhook URL
```

## スライド作成の手順

ユーザーからスライド作成の指示を受けたら、以下の手順で進めてください。

### Phase 0: デザインリサーチ（会社名・URLがある場合）

ユーザーが会社名やURLを指定した場合、スライド設計の前にブランドリサーチを行い、`scripts/template.js` のカラー設定を更新します。
会社名・URLの指定がない場合はモノトーンデフォルトのままスキップしてください。

#### Step 0: プリセット確認（最優先）

まず `scripts/presets/` にプリセットがあるか確認する:

```javascript
var presets = require("./scripts/presets");
var preset = presets.find("ドコモ");  // 会社名で検索
if (preset) {
  // プリセットがあれば即適用 → WebSearch不要
  var t = require("./scripts/template.js");
  presets.apply(preset, t);
}
```

プリセットが見つかった場合は以下の調査手順をスキップし、そのまま Phase 1 に進む。
プリセットがない場合のみ、以下の WebSearch による調査を行う。

#### 調査手順（プリセットがない場合、段階的に深掘りする）

1. **公式サイト特定**: WebSearch で会社名 → 公式サイトURLを特定
2. **トップページ調査**: WebFetch でトップページからカラー抽出
   - `theme-color` メタタグ、CSS変数、ヘッダー/ナビの背景色、ボタン色、リンク色、フォント宣言、インラインスタイルのHEXコード
3. **CSSファイル直接取得**（トップページで色が不十分な場合）: HTMLから `<link rel="stylesheet">` のURLを特定し、CSSファイルを WebFetch で直接取得
4. **サブページ調査**（まだ不十分な場合）: `/about/`, `/company/`, 事業部門ページ等を追加調査
5. **カラー決定**: 抽出した全カラーから Primary / Secondary / Accent を決定
   - Primary: ヘッダー背景 > theme-color > CSS変数 > 最頻出有彩色
   - Secondary: ボタン/リンク色 > 2番目に多い有彩色
   - **evidence（根拠）を必ず記録**: どの色をどのページのどの要素で見つけたか

> **重要**: WebFetchは1回で十分な色情報を返さないことが多い。必ず複数ソース（トップページ + CSSファイルまたはサブページ）を確認すること。

#### テンプレート更新

リサーチ結果を `scripts/template.js` の以下の変数に反映する:
- `COLORS` オブジェクト内の HEX 値を変更（変数名 `DARK_GREEN` 等はそのまま維持）
- `CHART_COLORS` 配列を8色で再生成
- `FACE` 変数（ブランド指定フォントがある場合のみ）
- **スライドパターン関数は絶対に編集しない**

#### ユーザー確認

更新したカラーパレットを evidence（出典URL）付きでユーザーに提示し、承認を得る。
- 却下された場合: ユーザーの希望色を聞いて再反映
- リサーチでブランドカラーが見つからなかった場合: モノトーンデフォルトで続行

#### モノトーンデフォルト（リサーチ不要時 / リサーチ失敗時）

```
PRIMARY:     "1A1A1A"    SECONDARY:   "4A4A4A"
LIGHT_GRAY:  "F5F5F5"    TEXT_DARK:    "1A1A1A"
TEXT_MEDIUM:  "4A4A4A"    TEXT_LIGHT:   "6B6B6B"
WHITE:       "FFFFFF"    HIGHLIGHT:   "000000"
CHART_COLORS: ["1A1A1A","4A4A4A","6B6B6B","8C8C8C","ADADAD","CECECE","E0E0E0","F0F0F0"]
```

#### エージェント連携（参照）

このフェーズの詳細ロジックは `.claude/agents/` 内の以下のファイルに定義されています:
- `brand-researcher.md` — 段階的カラー調査の具体的手順・WebFetchプロンプト・evidence記録
- `template-generator.md` — カラーマッピングルール・コントラスト確認・template.js 編集手順
- ワークフロー全体図: `.claude/workflows/design-template_workflow.md`

### Phase 1: 設計（トヨマネ式7ステップ）

1. ユーザーの要望から「問い」を特定する
2. 「答え」（結論）を1文で定義する
3. 「理由」を3点以内に絞る
4. 各スライドを「上段（キーメッセージ）」と「下段（詳細）」の2階建て構造で設計する
5. スライド構成を決める: 表紙 → サマリー → セクション扉 → 本文 → まとめ
6. 各スライドに「タイトル（問い）」「キーメッセージ（答え）」「コンテンツ（根拠）」を設定
7. 最後にサマリーで結論を再提示

### Phase 2: スクリプト作成

`scripts/template.js` をrequireして、Node.jsスクリプトを作成します。
パスはすべてプロジェクトルートからの相対パス、または `__dirname` ベースで解決してください。

```javascript
var path = require("path");
var ROOT = path.resolve(__dirname, "..");  // output/ から1つ上がプロジェクトルート
var t = require(path.join(ROOT, "scripts/template.js"));
var pptxgen = t.pptxgen;

var pres = new pptxgen();
pres.layout = t.config.layout;
pres.author = "作成者名";
pres.title = "プレゼンタイトル";

// スライドを追加...

var outputPath = path.join(ROOT, "output/プレゼン名.pptx");
pres.writeFile({ fileName: outputPath })
  .then(function() { console.log("生成完了: " + outputPath); })
  .catch(function(err) { console.error("エラー:", err); });
```

### Phase 3: 実行

```bash
node output/generate.js
```

### Phase 4: 配信（確認式 — ローカル or GitHub）

スライド生成が成功したら、**必ずユーザーに確認してください**:

```
「GitHubにも配信しますか？（Discord/メール通知が自動実行されます）」
→ はい: 下記の配信手順を実行
→ いいえ: output/ のファイルで完了（ローカルのみ）
```

#### ローカルのみの場合

`output/` ディレクトリにあるPPTXファイルのパスをユーザーに案内して完了です。
`output/` はgitignoredなので、GitHubには一切影響しません。

#### GitHubに配信する場合

```
downloads/
├── pptx/    ← PowerPointファイル（git tracked）
└── pdf/     ← PDFファイル（git tracked）
```

1. PPTXファイルを `downloads/pptx/` にコピーする
2. LibreOfficeでPDF変換を試みる（失敗してもGitHub Actions側で自動変換される）
3. git add → commit → push する

```bash
# 1. PPTXをdownloads/pptxにコピー
cp output/生成ファイル名.pptx downloads/pptx/

# 2. PDF変換（ローカルで可能な場合）
libreoffice --headless --convert-to pdf \
  --outdir downloads/pdf/ \
  downloads/pptx/生成ファイル名.pptx

# ※ PDF変換が失敗してもOK → GitHub Actions が自動変換＆コミットします

# 3. コミット＆プッシュ
git add downloads/pptx/生成ファイル名.pptx
git add downloads/pdf/生成ファイル名.pdf 2>/dev/null || true
git commit -m "Add 生成ファイル名.pptx + PDF"
git push -u origin <現在のブランチ名>
```

#### 通知フロー（配信時のみ自動）

プッシュ後、GitHub Actions が以下を自動実行します:
- **PDF未生成の場合**: LibreOffice で PPTX → PDF 変換してコミット
- **Discord通知**: PPTX + PDF をファイル添付して Webhook 送信
- **メール通知**: PPTX + PDF をメール添付して SMTP 送信

> 通知にはGitHub Secretsの設定が必要です。未設定の項目はスキップされます。

#### ダウンロードURL（配信時のみ）

プッシュ後、ユーザーにGitHub上のダウンロードURLを案内してください:
- PPTX: `https://github.com/<OWNER>/<REPO>/blob/<ブランチ名>/downloads/pptx/ファイル名.pptx`
- PDF: `https://github.com/<OWNER>/<REPO>/blob/<ブランチ名>/downloads/pdf/ファイル名.pdf`

（`<OWNER>/<REPO>` は `git remote get-url origin` で確認できます。「Download raw file」ボタンでダウンロード可能）

## 利用可能な22パターン

| # | 関数名 | 用途 |
|---|--------|------|
| 1 | `addTitleSlide(pres, title, subtitle, author)` | 表紙 |
| 2 | `addSummarySlide(pres, conclusion, reasons[])` | サマリー |
| 3 | `addSectionSlide(pres, number, title)` | セクション扉 |
| 4 | `addBodySlide(pres, title, keyMsg, body, source)` | 本文 |
| 5 | `addEnumerationSlide(pres, title, keyMsg, items[], source)` | 列挙型 |
| 6 | `addTwoColumnSlide(pres, title, keyMsg, col1, col2, source)` | 2カラム比較 |
| 7 | `addStatsSlide(pres, title, keyMsg, stats[], source)` | 統計数値 |
| 8 | `addConclusionSlide(pres, conclusion, nextSteps[])` | まとめ |
| 9 | `addImageSlide(pres, title, keyMsg, imagePath, source)` | 画像 |
| 10 | `addChartSlide(pres, chartType, chartData[], options)` | グラフ |
| 11 | `addFlowChartSlide(pres, title, keyMsg, items[], source)` | フロー（横型） |
| 11b | `addVerticalFlowSlide(pres, title, keyMsg, items[], source)` | フロー（縦型） |
| 12 | `addComparisonSlide(pres, title, keyMsg, compData, source)` | 比較対照 |
| 13 | `addMatrix4QuadrantSlide(pres, title, keyMsg, data, source)` | 4象限マトリックス |
| 14 | `addCycleDiagramSlide(pres, title, keyMsg, items[], source)` | サイクル図 |
| 15 | `addGanttChartSlide(pres, title, keyMsg, ganttData, source)` | ガントチャート |
| 16 | `addTableSlide(pres, title, keyMsg, tableData, source)` | テーブル |
| 17 | `addBackgroundSlide(pres, title, keyMsg, bgData, source)` | 背景型 |
| 18 | `addDivergenceSlide(pres, title, keyMsg, divData, source)` | 拡散型 |
| 19 | `addAscendingSlide(pres, title, keyMsg, steps[], source)` | 上昇型 |
| 20 | `addFlowTableSlide(pres, title, keyMsg, ftData, source)` | フロー表型 |
| 21 | `addFlowMatrixSlide(pres, title, keyMsg, fmData, source)` | フローマトリックス型 |
| 22 | `addMatrixTableSlide(pres, title, keyMsg, mtData, source)` | マトリックス型 |

## 各パターンのデータ構造（必須リファレンス）

スライド生成時は、必ず以下のデータ構造に従ってください。プロパティ名を間違えるとスライドが空欄になります。

### パターン 5: 列挙型

```javascript
t.addEnumerationSlide(pres, "タイトル", "キーメッセージ", [
  { title: "項目名", description: "説明文" },  // ※ desc ではなく description
  { title: "項目名", description: "説明文" }
], "出所");
```

### パターン 6: 2カラム比較

```javascript
// col1, col2 は別引数。1つのオブジェクトにまとめない
t.addTwoColumnSlide(pres, "タイトル", "キーメッセージ",
  { title: "左タイトル", points: ["項目1", "項目2"] },  // ※ items ではなく points
  { title: "右タイトル", points: ["項目1", "項目2"] },  // ※ items ではなく points
  "出所"
);
```

### パターン 7: 統計数値

```javascript
t.addStatsSlide(pres, "タイトル", "キーメッセージ", [
  { value: "150%", label: "ラベル", description: "補足説明" }
], "出所");
```

### パターン 10: グラフ

```javascript
t.addChartSlide(pres, "BAR", [  // "BAR", "LINE", "PIE", "DOUGHNUT"
  { name: "系列名", labels: ["Q1","Q2"], values: [100, 200] }
], {
  title: "タイトル",
  keyMessage: "キーメッセージ",
  explanation: { title: "説明タイトル", text: "説明文" },
  source: "出所"
});
```

### パターン 11: フロー（横型）

```javascript
t.addFlowChartSlide(pres, "タイトル", "キーメッセージ", [
  { text: "ステップ名", description: "説明文" }  // ※ title ではなく text
], "出所");
```

### パターン 11b: フロー（縦型）

```javascript
t.addVerticalFlowSlide(pres, "タイトル", "キーメッセージ", [
  { text: "ステップ名", description: "説明文" }  // ※ title ではなく text
], "出所");
```

### パターン 12: 比較対照

```javascript
t.addComparisonSlide(pres, "タイトル", "キーメッセージ", {
  col1: { title: "左タイトル", points: ["項目1", "項目2"] },
  col2: { title: "右タイトル", points: ["項目1", "項目2"] }
}, "出所");
```

### パターン 13: 4象限マトリックス

```javascript
t.addMatrix4QuadrantSlide(pres, "タイトル", "キーメッセージ", {
  axisLabels: { xHigh: "右", xLow: "左", yHigh: "上", yLow: "下" },
  quadrants: [
    { label: "左上", description: "説明" },
    { label: "右上", description: "説明" },
    { label: "左下", description: "説明" },
    { label: "右下", description: "説明" }
  ],
  points: [{ label: "点名", x: 60, y: 70 }]
}, "出所");
```

### パターン 14: サイクル図

```javascript
t.addCycleDiagramSlide(pres, "タイトル", "キーメッセージ", [
  { text: "ステップ1" }, { text: "ステップ2" }
], "出所");
```

### パターン 15: ガントチャート

```javascript
t.addGanttChartSlide(pres, "タイトル", "キーメッセージ", {
  headers: ["タスク", "1月", "2月", "3月"],
  rows: [{ task: "タスク名", start: 1, end: 2 }]
}, "出所");
```

### パターン 16: テーブル

```javascript
t.addTableSlide(pres, "タイトル", "キーメッセージ", {
  headers: ["列1", "列2", "列3"],
  rows: [["値1", "値2", "値3"]]
}, "出所");
```

### パターン 17: 背景型

```javascript
t.addBackgroundSlide(pres, "タイトル", "キーメッセージ", {
  category: "カテゴリ名",
  items: [{ label: "項目名", description: "説明" }]
}, "出所");
```

### パターン 18: 拡散型

```javascript
t.addDivergenceSlide(pres, "タイトル", "キーメッセージ", {
  source: "中心ラベル",
  targets: [{ label: "展開先", description: "説明" }]
}, "出所");
```

### パターン 19: 上昇型

```javascript
t.addAscendingSlide(pres, "タイトル", "キーメッセージ", [
  { label: "ステップ名", description: "説明" }
], "出所");
```

### パターン 20: フロー表型

```javascript
t.addFlowTableSlide(pres, "タイトル", "キーメッセージ", {
  phases: ["フェーズ1", "フェーズ2"],
  categories: [{ label: "行ラベル", cells: ["値1", "値2"] }]
}, "出所");
```

### パターン 21: フローマトリックス型

```javascript
t.addFlowMatrixSlide(pres, "タイトル", "キーメッセージ", {
  columns: ["列1", "列2"],
  rows: [{ label: "行ラベル", cells: ["値1", "値2"] }]
}, "出所");
```

### パターン 22: マトリックス型

```javascript
t.addMatrixTableSlide(pres, "タイトル", "キーメッセージ", {
  colLabels: ["列1", "列2"],
  rows: [{ label: "行ラベル", cells: ["値1", "値2"] }]
}, "出所");
```

## デザインルール

- **カラー**: デフォルトはモノトーン。会社名・URLが指定された場合は Phase 0 で自動リサーチ → `scripts/template.js` のカラー値を更新
- **フォント**: Noto Sans JP
- **最小フォントサイズ**: 16pt（出所表記12ptは例外）
- **レイアウト**: 16:9、左右マージン0.6in
- **グラフ**: グリッドライン削除、データラベル直接配置（プレアテンティブ原則）

## 重要な注意事項

- スライド生成スクリプトは `output/` に作成してください（プロジェクトルート相対）
- 生成されたPPTXファイルも `output/` に出力してください
- `scripts/template.js` のスライドパターン関数は編集しないでください（カラー値の変更は Phase 0 のブランドリサーチ経由で行う）
- 各スライドには必ず「キーメッセージ」を入れてください（2階建て構造の上段）
- 結論ファーストの原則を守ってください
- **スライド生成後はユーザーに「GitHubにも配信しますか？」と確認してください**（Phase 4: 確認式）
- ローカルのみの場合: `output/` のファイルパスを案内して完了
- GitHub配信する場合: `downloads/pptx/` にコピー → PDF変換 → git push → main にマージ（下記「マージルール」参照）
- `downloads/pptx/` と `downloads/pdf/` フォルダはGitHub経由のダウンロード専用です
- プッシュ後、GitHub Actions が自動でメール（Gmail）とDiscord（Webhook）に通知します

## マージルール

スライド作成が完了し、`downloads/` フォルダへのプッシュが終わったら、作業ブランチをメインブランチにマージしてください。

```bash
# 1. メインブランチに切り替え
git checkout main

# 2. 作業ブランチをマージ
git merge <作業ブランチ名>

# 3. メインブランチをプッシュ
git push -u origin main

# 4. 作業ブランチに戻る（必要に応じて）
git checkout <作業ブランチ名>
```

これにより、生成されたスライドが常にメインブランチでもダウンロード可能になります。

## 環境変数（GitHub Secrets）

通知機能を使う場合は、以下をGitHub Secretsに設定してください。
未設定の項目は自動的にスキップされます。

| 変数名 | 必須 | 説明 |
|--------|------|------|
| `MAIL_USERNAME` | 任意 | Gmailアドレス（SMTP認証用） |
| `MAIL_PASSWORD` | 任意 | Googleアプリパスワード（16文字） |
| `MAIL_TO` | 任意 | メール送信先アドレス |
| `MAIL_FROM` | 任意 | メール送信元アドレス |
| `DISCORD_WEBHOOK_URL` | 任意 | DiscordチャンネルのWebhook URL |

## 画像ファイルの命名規則

README等で使用するスクリーンショットは `docs/images/` に配置します。

### 命名フォーマット

```
{サービス名}-{操作・画面名}.png
```

- **すべて小文字**、単語区切りは **ハイフン（-）**
- **サービス名**: `google`, `github`, `discord` など
- **操作・画面名**: その画像が示す操作や画面を端的に表す英語

### 例

| ファイル名 | 内容 |
|-----------|------|
| `google-app-password-create.png` | Googleアプリパスワード発行画面 |
| `google-app-password-result.png` | 発行されたアプリパスワード表示 |
| `google-security-page.png` | Googleセキュリティページ |
| `google-2fa-setup.png` | 2段階認証の設定画面 |
| `github-secrets-setup.png` | GitHub Secrets設定画面 |
| `github-secrets-add.png` | シークレット追加画面 |
| `discord-webhook-create.png` | Discord Webhook作成画面 |

### READMEでの参照方法

```html
<img src="docs/images/google-app-password-create.png" width="600" alt="説明テキスト">
```

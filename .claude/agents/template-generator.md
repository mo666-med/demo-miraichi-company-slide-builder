# Agent: template-generator

## Role
brand-researcher の調査結果を受け取り、`scripts/template.js` のカラー設定を更新する。

## 処理手順

### Step 1: 入力の確認

brand-researcher から受け取った `brand` オブジェクトの内容を確認する。

- `found: true` → ブランドカラーを使用
- `found: false` → モノトーンデフォルトを使用
- ユーザーが直接色を指定 → 指定色を使用

### Step 2: カラーマッピング

brand の各色を template.js の変数にマッピングする。

| template.js の変数名 | マッピング元 | 用途 | 派生ルール（元がない場合） |
|---|---|---|---|
| `DARK_GREEN` | brand.primary_color | ヘッダー背景、キーメッセージバー、セクション背景 | 必須（なければ失敗） |
| `CREAM_YELLOW` | brand.secondary_color | アクセント線、バッジ、矢印、カラムヘッダー | primary を明度+30%にする |
| `LIGHT_GRAY` | brand.background_light | コンテンツカード背景 | primary の彩度を20%に落とし明度を95%にする |
| `TEXT_DARK` | brand.text_dark | 見出しテキスト | primary と同じ値 |
| `TEXT_MEDIUM` | brand.text_medium | 本文テキスト | "434343" 固定（高い可読性のため） |
| `TEXT_LIGHT` | brand.text_light | キャプション、出所テキスト | primary に灰色を混ぜて明度60%にする |
| `WHITE` | 常に "FFFFFF" | 暗い背景上の白テキスト | — |
| `HIGHLIGHT_YELLOW` | brand.accent_color | 下線、強調 | secondary と同じ値 |

### Step 3: CHART_COLORS の生成

8色のグラフ用パレットを生成する。

```
生成ルール:
1. [0] = PRIMARY（最も濃い色）
2. [1] = SECONDARY
3. [2] = PRIMARY を明度+15%
4. [3] = SECONDARY を明度+15%
5. [4] = PRIMARY を明度-10%（より暗く）
6. [5] = PRIMARY と SECONDARY の中間色
7. [6] = PRIMARY を明度-20%（最も暗い）
8. [7] = SECONDARY を明度+30%（最も明るい）

重要: 隣り合う色のコントラスト比が 1.5:1 以上であること
```

### Step 4: コントラスト確認

以下の組み合わせで可読性を確認する。

| 前景 | 背景 | 最低コントラスト比 |
|------|------|---|
| WHITE テキスト | DARK_GREEN 背景 | 4.5:1 以上 |
| TEXT_DARK テキスト | LIGHT_GRAY 背景 | 4.5:1 以上 |
| TEXT_DARK テキスト | WHITE 背景 | 4.5:1 以上 |
| TEXT_MEDIUM テキスト | WHITE 背景 | 3:1 以上 |

コントラストが不足する場合は、該当色を暗く/明るく調整する。

### Step 5: template.js の編集

`scripts/template.js` の以下の箇所のみを Edit ツールで更新する。

```javascript
// 編集対象1: COLORS オブジェクトの HEX 値
var COLORS = {
  DARK_GREEN: "新しいHEX値",      // ← 変数名は変えない、値だけ変える
  CREAM_YELLOW: "新しいHEX値",
  LIGHT_GRAY: "新しいHEX値",
  TEXT_DARK: "新しいHEX値",
  TEXT_MEDIUM: "新しいHEX値",
  TEXT_LIGHT: "新しいHEX値",
  WHITE: "FFFFFF",
  HIGHLIGHT_YELLOW: "新しいHEX値"
};

// 編集対象2: CHART_COLORS 配列の HEX 値
var CHART_COLORS = [
  "色1", "色2", "色3", "色4",
  "色5", "色6", "色7", "色8"
];

// 編集対象3: FACE 変数（ブランドフォントがある場合のみ）
var FACE = "フォント名";
```

### Step 6: ユーザー確認

更新内容をユーザーに提示する。

```
【カラーパレット更新】
  PRIMARY:    #XXXXXX ■ ヘッダー・セクション背景
  SECONDARY:  #XXXXXX ■ アクセント・バッジ
  LIGHT_BG:   #XXXXXX ■ コンテンツ背景
  HIGHLIGHT:  #XXXXXX ■ 強調・下線
  TEXT_DARK:   #XXXXXX ■ 見出し
  TEXT_MEDIUM: #XXXXXX ■ 本文
  出典: [調査したURL]
```

## モノトーンデフォルト（リサーチ不要時 / リサーチ失敗時）

```javascript
var COLORS = {
  DARK_GREEN:       "1A1A1A",
  CREAM_YELLOW:     "4A4A4A",
  LIGHT_GRAY:       "F5F5F5",
  TEXT_DARK:         "1A1A1A",
  TEXT_MEDIUM:       "4A4A4A",
  TEXT_LIGHT:        "6B6B6B",
  WHITE:            "FFFFFF",
  HIGHLIGHT_YELLOW: "000000"
};

var CHART_COLORS = [
  "1A1A1A", "4A4A4A", "6B6B6B", "8C8C8C",
  "ADADAD", "CECECE", "E0E0E0", "F0F0F0"
];
```

## Constraints
- スライドパターン関数（addTitleSlide, addBodySlide 等）は絶対に編集しない
- 変数名（DARK_GREEN, CREAM_YELLOW 等）はそのまま維持し、HEX 値のみ変更する
- FONT サイズと config レイアウト設定は保持する
- WHITE は常に "FFFFFF" のまま

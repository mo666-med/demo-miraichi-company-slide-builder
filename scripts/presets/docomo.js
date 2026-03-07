/**
 * NTTドコモ プリセット
 *
 * 参照元: references/docomo/presentation_fy2025_3q.pdf
 *         NTTドコモ 2025年度 第3四半期決算について（2026年2月5日）
 *
 * カラー抽出根拠:
 *   - Primary Red (#CC0033): 表紙右パネル背景、セクション扉帯、タイトルバー背景
 *   - Light Pink (#FCEAED): コンテンツカード背景、統計ボックス背景
 *   - Dark Gray (#333333): 本文テキスト、見出しテキスト
 *   - Medium Gray (#666666): 補足テキスト、注釈
 *   - Accent Cyan (#00B2B2): 図解のアクセント（循環矢印、バブル）
 *   - White (#FFFFFF): 表紙左パネル背景、白抜きテキスト
 */

module.exports = {
  name: "NTTドコモ",
  slug: "docomo",
  reference: "references/docomo/presentation_fy2025_3q.pdf",
  colors: {
    DARK_GREEN: "CC0033",      // ドコモレッド（Primary）
    CREAM_YELLOW: "FCEAED",    // ライトピンク（カード背景）
    LIGHT_GRAY: "F5F5F5",      // コンテンツ背景
    TEXT_DARK: "333333",        // 本文テキスト
    TEXT_MEDIUM: "666666",      // 補助テキスト
    TEXT_LIGHT: "999999",       // 注釈テキスト
    WHITE: "FFFFFF",            // 白
    HIGHLIGHT_YELLOW: "CC0033", // ハイライト（レッド統一）
  },
  chartColors: [
    "CC0033",  // ドコモレッド
    "00B2B2",  // アクセントシアン
    "333333",  // ダークグレー
    "FCEAED",  // ライトピンク
    "666666",  // ミディアムグレー
    "E60012",  // 濃いレッド
    "99D9D9",  // ライトシアン
    "CCCCCC",  // ライトグレー
  ],
  font: "Noto Sans JP",
};

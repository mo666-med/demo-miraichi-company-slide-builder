/**
 * 企業プリセット一覧
 *
 * 使い方:
 *   var presets = require("./presets");
 *   var docomo = presets.get("docomo");    // slug で取得
 *   var docomo = presets.find("ドコモ");   // 名前で検索
 *   var list = presets.list();             // 一覧取得
 *   presets.apply(docomo, template);       // template.js のカラーに適用
 */

var fs = require("fs");
var path = require("path");

// プリセットファイルを自動読み込み（index.js 以外の .js）
var presetsDir = __dirname;
var presetMap = {};

fs.readdirSync(presetsDir).forEach(function (file) {
  if (file === "index.js" || !file.endsWith(".js")) return;
  var preset = require(path.join(presetsDir, file));
  presetMap[preset.slug] = preset;
});

/**
 * slug で取得
 */
function get(slug) {
  return presetMap[slug] || null;
}

/**
 * 名前（部分一致）で検索
 */
function find(query) {
  var q = query.toLowerCase();
  var keys = Object.keys(presetMap);
  for (var i = 0; i < keys.length; i++) {
    var p = presetMap[keys[i]];
    if (
      p.slug.toLowerCase().indexOf(q) !== -1 ||
      p.name.toLowerCase().indexOf(q) !== -1
    ) {
      return p;
    }
  }
  return null;
}

/**
 * 一覧取得
 */
function list() {
  return Object.keys(presetMap).map(function (key) {
    return { slug: presetMap[key].slug, name: presetMap[key].name };
  });
}

/**
 * template.js の COLORS / CHART_COLORS / FACE に適用
 * ※ template.js の module.exports を渡す
 */
function apply(preset, template) {
  if (!preset || !template) return;
  if (preset.colors && template.COLORS) {
    Object.keys(preset.colors).forEach(function (key) {
      if (template.COLORS[key] !== undefined) {
        template.COLORS[key] = preset.colors[key];
      }
    });
  }
  if (preset.chartColors && template.CHART_COLORS) {
    template.CHART_COLORS = preset.chartColors;
  }
  if (preset.font && template.FACE !== undefined) {
    template.FACE = preset.font;
  }
}

module.exports = {
  get: get,
  find: find,
  list: list,
  apply: apply,
};

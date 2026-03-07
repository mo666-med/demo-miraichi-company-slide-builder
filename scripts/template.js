// =============================================================================
// Sincerely Slide Skill V2 - Template
// トヨマネ式メソッド + Cynthialyデザインシステム + ルバート図解パターン
// =============================================================================

var pptxgen = require("pptxgenjs");

// =============================================================================
// 定数定義
// =============================================================================

var COLORS = {
  DARK_GREEN: "F00033",
  CREAM_YELLOW: "333333",
  LIGHT_GRAY: "FFF0F3",
  TEXT_DARK: "1A1A1A",
  TEXT_MEDIUM: "4A4A4A",
  TEXT_LIGHT: "6B6B6B",
  WHITE: "FFFFFF",
  HIGHLIGHT_YELLOW: "F00033"
};

var FONT = {
  XL: 40,
  L: 32,
  MP: 24,
  M: 20,
  SP: 18,
  S: 16,
  XS: 12,
  SEC: 80
};

var FACE = "Noto Sans JP";

var config = {
  layout: "LAYOUT_16x9",
  marginLR: 0.6,
  contentWidth: 8.8
};

// グラフ用カラーパレット
var CHART_COLORS = [
  "F00033", "CC002A", "990020", "FF6680",
  "333333", "666666", "999999", "CCCCCC"
];

// =============================================================================
// ヘルパー関数
// =============================================================================

function addKeyMessageBar(slide, keyMessage) {
  // キーメッセージバー: ダークグリーン背景、左にクリームイエローのアクセントライン
  slide.addShape("rect", {
    x: 0.6, y: 0.9, w: 8.8, h: 0.5,
    fill: { color: COLORS.DARK_GREEN },
    rectRadius: 0.05
  });
  // 左アクセントライン
  slide.addShape("rect", {
    x: 0.6, y: 0.9, w: 0.06, h: 0.5,
    fill: { color: COLORS.CREAM_YELLOW }
  });
  slide.addText(keyMessage, {
    x: 0.9, y: 0.9, w: 8.3, h: 0.5,
    fontSize: FONT.S, fontFace: FACE, color: COLORS.WHITE,
    bold: true, valign: "middle"
  });
}

function addSlideTitle(slide, title) {
  // タイトル
  slide.addText(title, {
    x: 0.6, y: 0.25, w: 8.8, h: 0.55,
    fontSize: FONT.MP, fontFace: FACE, color: COLORS.TEXT_DARK,
    bold: true, valign: "middle"
  });
  // タイトル下線（イエロー）
  slide.addShape("rect", {
    x: 0.6, y: 0.8, w: 1.2, h: 0.04,
    fill: { color: COLORS.HIGHLIGHT_YELLOW }
  });
}

function addSource(slide, source) {
  if (!source) return;
  slide.addText("出所: " + source, {
    x: 0.6, y: 5.1, w: 8.8, h: 0.3,
    fontSize: FONT.XS, fontFace: FACE, color: COLORS.TEXT_LIGHT,
    valign: "bottom"
  });
}

// =============================================================================
// パターン 1: 表紙スライド
// =============================================================================

function addTitleSlide(pres, title, subtitle, author) {
  var slide = pres.addSlide();
  // 全面ダークグリーン背景
  slide.addShape("rect", {
    x: 0, y: 0, w: 10, h: 5.63,
    fill: { color: COLORS.DARK_GREEN }
  });
  // 上部アクセントライン
  slide.addShape("rect", {
    x: 0.6, y: 1.5, w: 3.0, h: 0.06,
    fill: { color: COLORS.CREAM_YELLOW }
  });
  // タイトル
  slide.addText(title, {
    x: 0.6, y: 1.7, w: 8.8, h: 1.5,
    fontSize: FONT.XL, fontFace: FACE, color: COLORS.WHITE,
    bold: true, valign: "top"
  });
  // サブタイトル
  if (subtitle) {
    slide.addText(subtitle, {
      x: 0.6, y: 3.2, w: 8.8, h: 0.6,
      fontSize: FONT.M, fontFace: FACE, color: COLORS.CREAM_YELLOW,
      valign: "top"
    });
  }
  // 作成者
  if (author) {
    slide.addText(author, {
      x: 0.6, y: 4.5, w: 8.8, h: 0.5,
      fontSize: FONT.S, fontFace: FACE, color: COLORS.WHITE,
      valign: "bottom"
    });
  }
  return slide;
}

// =============================================================================
// パターン 2: サマリースライド
// =============================================================================

function addSummarySlide(pres, conclusion, reasons) {
  var slide = pres.addSlide();
  // 上部バー
  slide.addShape("rect", {
    x: 0, y: 0, w: 10, h: 0.8,
    fill: { color: COLORS.DARK_GREEN }
  });
  slide.addText("SUMMARY", {
    x: 0.6, y: 0, w: 8.8, h: 0.8,
    fontSize: FONT.MP, fontFace: FACE, color: COLORS.WHITE,
    bold: true, valign: "middle"
  });
  // 結論ボックス
  slide.addShape("rect", {
    x: 0.6, y: 1.2, w: 8.8, h: 1.0,
    fill: { color: COLORS.DARK_GREEN },
    rectRadius: 0.1
  });
  slide.addText(conclusion, {
    x: 0.8, y: 1.2, w: 8.4, h: 1.0,
    fontSize: FONT.M, fontFace: FACE, color: COLORS.WHITE,
    bold: true, valign: "middle"
  });
  // 理由リスト
  if (reasons && reasons.length > 0) {
    var reasonY = 2.6;
    for (var i = 0; i < reasons.length; i++) {
      // 番号バッジ
      slide.addShape("rect", {
        x: 0.6, y: reasonY, w: 0.5, h: 0.5,
        fill: { color: COLORS.CREAM_YELLOW },
        rectRadius: 0.05
      });
      slide.addText(String(i + 1), {
        x: 0.6, y: reasonY, w: 0.5, h: 0.5,
        fontSize: FONT.SP, fontFace: FACE, color: COLORS.DARK_GREEN,
        bold: true, align: "center", valign: "middle"
      });
      // 理由テキスト
      slide.addText(reasons[i], {
        x: 1.3, y: reasonY, w: 8.1, h: 0.5,
        fontSize: FONT.S, fontFace: FACE, color: COLORS.TEXT_DARK,
        valign: "middle"
      });
      reasonY += 0.7;
    }
  }
  return slide;
}

// =============================================================================
// パターン 3: セクション扉スライド
// =============================================================================

function addSectionSlide(pres, sectionNumber, sectionTitle) {
  var slide = pres.addSlide();
  // 全面ダークグリーン
  slide.addShape("rect", {
    x: 0, y: 0, w: 10, h: 5.63,
    fill: { color: COLORS.DARK_GREEN }
  });
  // セクション番号（大きい数字）
  slide.addText(String(sectionNumber).padStart(2, "0"), {
    x: 0.6, y: 0.8, w: 4.0, h: 2.0,
    fontSize: FONT.SEC, fontFace: FACE, color: COLORS.CREAM_YELLOW,
    bold: true, valign: "middle"
  });
  // アクセントライン
  slide.addShape("rect", {
    x: 0.6, y: 2.9, w: 2.0, h: 0.06,
    fill: { color: COLORS.CREAM_YELLOW }
  });
  // セクションタイトル
  slide.addText(sectionTitle, {
    x: 0.6, y: 3.2, w: 8.8, h: 1.0,
    fontSize: FONT.L, fontFace: FACE, color: COLORS.WHITE,
    bold: true, valign: "top"
  });
  return slide;
}

// =============================================================================
// パターン 4: 本文スライド
// =============================================================================

function addBodySlide(pres, title, keyMessage, bodyContent, source) {
  var slide = pres.addSlide();
  addSlideTitle(slide, title);
  addKeyMessageBar(slide, keyMessage);
  // 本文
  slide.addText(bodyContent, {
    x: 0.6, y: 1.6, w: 8.8, h: 3.3,
    fontSize: FONT.S, fontFace: FACE, color: COLORS.TEXT_MEDIUM,
    valign: "top", lineSpacingMultiple: 1.5
  });
  addSource(slide, source);
  return slide;
}

// =============================================================================
// パターン 5: 列挙型スライド
// =============================================================================

function addEnumerationSlide(pres, title, keyMessage, items, source) {
  var slide = pres.addSlide();
  addSlideTitle(slide, title);
  addKeyMessageBar(slide, keyMessage);

  var startY = 1.6;
  var itemH = 0.6;

  for (var i = 0; i < items.length; i++) {
    var y = startY + i * (itemH + 0.15);
    // 番号バッジ
    slide.addShape("rect", {
      x: 0.6, y: y, w: 0.5, h: itemH,
      fill: { color: COLORS.CREAM_YELLOW },
      rectRadius: 0.05
    });
    slide.addText(String(i + 1), {
      x: 0.6, y: y, w: 0.5, h: itemH,
      fontSize: FONT.SP, fontFace: FACE, color: COLORS.DARK_GREEN,
      bold: true, align: "center", valign: "middle"
    });
    // タイトル＋説明
    var itemTitle = typeof items[i] === "string" ? items[i] : items[i].title;
    var itemDesc = typeof items[i] === "string" ? "" : (items[i].description || "");
    slide.addShape("rect", {
      x: 1.3, y: y, w: 8.1, h: itemH,
      fill: { color: COLORS.LIGHT_GRAY },
      rectRadius: 0.05
    });
    if (itemDesc) {
      slide.addText(itemTitle, {
        x: 1.5, y: y, w: 3.0, h: itemH,
        fontSize: FONT.S, fontFace: FACE, color: COLORS.TEXT_DARK,
        bold: true, valign: "middle"
      });
      slide.addText(itemDesc, {
        x: 4.5, y: y, w: 4.7, h: itemH,
        fontSize: FONT.S, fontFace: FACE, color: COLORS.TEXT_MEDIUM,
        valign: "middle"
      });
    } else {
      slide.addText(itemTitle, {
        x: 1.5, y: y, w: 7.7, h: itemH,
        fontSize: FONT.S, fontFace: FACE, color: COLORS.TEXT_DARK,
        bold: true, valign: "middle"
      });
    }
  }
  addSource(slide, source);
  return slide;
}

// =============================================================================
// パターン 6: 2カラム比較スライド
// =============================================================================

function addTwoColumnSlide(pres, title, keyMessage, col1, col2, source) {
  var slide = pres.addSlide();
  addSlideTitle(slide, title);
  addKeyMessageBar(slide, keyMessage);

  var colW = 4.2;
  var colH = 3.2;
  var startY = 1.6;

  // 左カラム
  slide.addShape("rect", {
    x: 0.6, y: startY, w: colW, h: colH,
    fill: { color: COLORS.LIGHT_GRAY },
    rectRadius: 0.1
  });
  slide.addShape("rect", {
    x: 0.6, y: startY, w: colW, h: 0.5,
    fill: { color: COLORS.DARK_GREEN },
    rectRadius: 0.1
  });
  slide.addText(col1.title || "左", {
    x: 0.6, y: startY, w: colW, h: 0.5,
    fontSize: FONT.S, fontFace: FACE, color: COLORS.WHITE,
    bold: true, align: "center", valign: "middle"
  });
  var col1Text = Array.isArray(col1.points) ? col1.points.map(function(p) { return "・" + p; }).join("\n") : (col1.content || "");
  slide.addText(col1Text, {
    x: 0.8, y: startY + 0.6, w: colW - 0.4, h: colH - 0.7,
    fontSize: FONT.S, fontFace: FACE, color: COLORS.TEXT_MEDIUM,
    valign: "top", lineSpacingMultiple: 1.4
  });

  // 右カラム
  var rightX = 0.6 + colW + 0.4;
  slide.addShape("rect", {
    x: rightX, y: startY, w: colW, h: colH,
    fill: { color: COLORS.LIGHT_GRAY },
    rectRadius: 0.1
  });
  slide.addShape("rect", {
    x: rightX, y: startY, w: colW, h: 0.5,
    fill: { color: COLORS.CREAM_YELLOW },
    rectRadius: 0.1
  });
  slide.addText(col2.title || "右", {
    x: rightX, y: startY, w: colW, h: 0.5,
    fontSize: FONT.S, fontFace: FACE, color: COLORS.DARK_GREEN,
    bold: true, align: "center", valign: "middle"
  });
  var col2Text = Array.isArray(col2.points) ? col2.points.map(function(p) { return "・" + p; }).join("\n") : (col2.content || "");
  slide.addText(col2Text, {
    x: rightX + 0.2, y: startY + 0.6, w: colW - 0.4, h: colH - 0.7,
    fontSize: FONT.S, fontFace: FACE, color: COLORS.TEXT_MEDIUM,
    valign: "top", lineSpacingMultiple: 1.4
  });

  addSource(slide, source);
  return slide;
}

// =============================================================================
// パターン 7: 統計数値スライド
// =============================================================================

function addStatsSlide(pres, title, keyMessage, stats, source) {
  var slide = pres.addSlide();
  addSlideTitle(slide, title);
  addKeyMessageBar(slide, keyMessage);

  var count = stats.length;
  var totalW = 8.8;
  var gap = 0.3;
  var boxW = (totalW - gap * (count - 1)) / count;
  var startY = 1.8;
  var boxH = 2.8;

  for (var i = 0; i < count; i++) {
    var x = 0.6 + i * (boxW + gap);
    slide.addShape("rect", {
      x: x, y: startY, w: boxW, h: boxH,
      fill: { color: COLORS.LIGHT_GRAY },
      rectRadius: 0.1
    });
    // 数値
    slide.addText(stats[i].value, {
      x: x, y: startY + 0.3, w: boxW, h: 1.2,
      fontSize: FONT.L, fontFace: FACE, color: COLORS.DARK_GREEN,
      bold: true, align: "center", valign: "middle"
    });
    // ラベル
    slide.addText(stats[i].label, {
      x: x, y: startY + 1.5, w: boxW, h: 0.5,
      fontSize: FONT.S, fontFace: FACE, color: COLORS.TEXT_DARK,
      bold: true, align: "center", valign: "middle"
    });
    // 説明
    if (stats[i].description) {
      slide.addText(stats[i].description, {
        x: x + 0.1, y: startY + 2.0, w: boxW - 0.2, h: 0.6,
        fontSize: FONT.S, fontFace: FACE, color: COLORS.TEXT_MEDIUM,
        align: "center", valign: "top"
      });
    }
  }
  addSource(slide, source);
  return slide;
}

// =============================================================================
// パターン 8: まとめスライド
// =============================================================================

function addConclusionSlide(pres, conclusion, nextSteps) {
  var slide = pres.addSlide();
  // 上部バー
  slide.addShape("rect", {
    x: 0, y: 0, w: 10, h: 0.8,
    fill: { color: COLORS.DARK_GREEN }
  });
  slide.addText("CONCLUSION", {
    x: 0.6, y: 0, w: 8.8, h: 0.8,
    fontSize: FONT.MP, fontFace: FACE, color: COLORS.WHITE,
    bold: true, valign: "middle"
  });
  // 結論ボックス
  slide.addShape("rect", {
    x: 0.6, y: 1.2, w: 8.8, h: 1.0,
    fill: { color: COLORS.DARK_GREEN },
    rectRadius: 0.1
  });
  slide.addText(conclusion, {
    x: 0.8, y: 1.2, w: 8.4, h: 1.0,
    fontSize: FONT.M, fontFace: FACE, color: COLORS.WHITE,
    bold: true, valign: "middle"
  });
  // Next Steps
  if (nextSteps && nextSteps.length > 0) {
    slide.addText("Next Steps", {
      x: 0.6, y: 2.6, w: 8.8, h: 0.5,
      fontSize: FONT.SP, fontFace: FACE, color: COLORS.TEXT_DARK,
      bold: true, valign: "middle"
    });
    var stepY = 3.2;
    for (var i = 0; i < nextSteps.length; i++) {
      slide.addShape("rect", {
        x: 0.6, y: stepY, w: 0.4, h: 0.4,
        fill: { color: COLORS.CREAM_YELLOW },
        rectRadius: 0.05
      });
      slide.addText(String(i + 1), {
        x: 0.6, y: stepY, w: 0.4, h: 0.4,
        fontSize: FONT.S, fontFace: FACE, color: COLORS.DARK_GREEN,
        bold: true, align: "center", valign: "middle"
      });
      slide.addText(nextSteps[i], {
        x: 1.2, y: stepY, w: 8.2, h: 0.4,
        fontSize: FONT.S, fontFace: FACE, color: COLORS.TEXT_MEDIUM,
        valign: "middle"
      });
      stepY += 0.55;
    }
  }
  return slide;
}

// =============================================================================
// パターン 9: 画像スライド
// =============================================================================

function addImageSlide(pres, title, keyMessage, imagePath, source) {
  var slide = pres.addSlide();
  addSlideTitle(slide, title);
  addKeyMessageBar(slide, keyMessage);
  // 画像
  slide.addImage({
    path: imagePath,
    x: 0.6, y: 1.6, w: 8.8, h: 3.3,
    sizing: { type: "contain", w: 8.8, h: 3.3 }
  });
  addSource(slide, source);
  return slide;
}

// =============================================================================
// パターン 10: グラフスライド
// =============================================================================

function addChartSlide(pres, chartType, chartData, options) {
  var opts = options || {};
  var slide = pres.addSlide();
  addSlideTitle(slide, opts.title || "グラフ");
  addKeyMessageBar(slide, opts.keyMessage || "");

  // チャートタイプマッピング
  var typeMap = {
    "BAR": pres.ChartType ? pres.ChartType.bar : "bar",
    "BAR3D": pres.ChartType ? pres.ChartType.bar3d : "bar3d",
    "LINE": pres.ChartType ? pres.ChartType.line : "line",
    "PIE": pres.ChartType ? pres.ChartType.pie : "pie",
    "DOUGHNUT": pres.ChartType ? pres.ChartType.doughnut : "doughnut",
    "SCATTER": pres.ChartType ? pres.ChartType.scatter : "scatter"
  };

  var pptxType = typeMap[chartType] || typeMap["BAR"];

  // チャートエリアの位置
  var chartX = 0.6;
  var chartY = 1.6;
  var chartW = opts.explanation ? 5.8 : 8.8;
  var chartH = 3.3;

  // プレアテンティブ原則に基づくチャートオプション
  var chartOpts = {
    x: chartX, y: chartY, w: chartW, h: chartH,
    showTitle: false,
    showLegend: true,
    legendPos: "t",
    legendFontSize: FONT.XS,
    legendFontFace: FACE,
    legendColor: COLORS.TEXT_MEDIUM,
    chartColors: CHART_COLORS.slice(0, chartData.length || 2),
    // グリッドライン完全削除
    catGridLine: { style: "none" },
    valGridLine: { style: "none" },
    // 軸設定
    showCatAxisTitle: false,
    showValAxisTitle: false,
    catAxisHidden: false,
    valAxisHidden: true,
    catAxisLineShow: false,
    valAxisLineShow: false,
    catAxisMajorTickMark: "none",
    valAxisMajorTickMark: "none",
    catAxisMinorTickMark: "none",
    valAxisMinorTickMark: "none",
    catAxisLabelFontSize: FONT.XS,
    catAxisLabelFontFace: FACE,
    catAxisLabelColor: COLORS.TEXT_MEDIUM,
    // データラベル直接配置
    showValue: true,
    dataLabelPosition: "outEnd",
    dataLabelFontSize: FONT.XS,
    dataLabelFontFace: FACE,
    dataLabelColor: COLORS.TEXT_DARK
  };

  // BAR方向
  if (chartType === "BAR" || chartType === "BAR3D") {
    chartOpts.barDir = opts.barDir || "col";
    chartOpts.barGapWidthPct = 80;
  }

  // PIE/DOUGHNUT特有設定
  if (chartType === "PIE" || chartType === "DOUGHNUT") {
    chartOpts.showPercent = true;
    chartOpts.showValue = false;
    chartOpts.dataLabelPosition = "bestFit";
  }

  slide.addChart(pptxType, chartData, chartOpts);

  // 右側説明エリア
  if (opts.explanation) {
    var expX = 6.6;
    slide.addShape("rect", {
      x: expX, y: chartY, w: 2.8, h: chartH,
      fill: { color: COLORS.LIGHT_GRAY },
      rectRadius: 0.1
    });
    if (opts.explanation.title) {
      slide.addText(opts.explanation.title, {
        x: expX + 0.2, y: chartY + 0.2, w: 2.4, h: 0.4,
        fontSize: FONT.S, fontFace: FACE, color: COLORS.TEXT_DARK,
        bold: true, valign: "middle"
      });
    }
    if (opts.explanation.text) {
      slide.addText(opts.explanation.text, {
        x: expX + 0.2, y: chartY + 0.7, w: 2.4, h: chartH - 0.9,
        fontSize: FONT.S, fontFace: FACE, color: COLORS.TEXT_MEDIUM,
        valign: "top", lineSpacingMultiple: 1.4
      });
    }
  }

  addSource(slide, opts.source);
  return slide;
}

// =============================================================================
// パターン 11: フローチャート（横型）
// =============================================================================

function addFlowChartSlide(pres, title, keyMessage, flowItems, source) {
  var slide = pres.addSlide();
  addSlideTitle(slide, title);
  addKeyMessageBar(slide, keyMessage);

  var count = flowItems.length;
  var totalW = 8.8;
  var arrowW = 0.3;
  var gap = 0.15;
  var boxW = (totalW - arrowW * (count - 1) - gap * (count - 1) * 2) / count;
  var chevronY = 1.7;
  var chevronH = 0.7;
  var descY = 2.6;
  var descH = 2.2;

  for (var i = 0; i < count; i++) {
    var x = 0.6 + i * (boxW + arrowW + gap * 2);

    // シェブロン（ステップ）
    slide.addShape("rect", {
      x: x, y: chevronY, w: boxW, h: chevronH,
      fill: { color: COLORS.DARK_GREEN },
      rectRadius: 0.08
    });
    slide.addText(flowItems[i].text, {
      x: x, y: chevronY, w: boxW, h: chevronH,
      fontSize: FONT.S, fontFace: FACE, color: COLORS.WHITE,
      bold: true, align: "center", valign: "middle"
    });

    // 矢印（最後以外）
    if (i < count - 1) {
      var arrowX = x + boxW + gap;
      slide.addText("▶", {
        x: arrowX, y: chevronY, w: arrowW, h: chevronH,
        fontSize: FONT.S, fontFace: FACE, color: COLORS.CREAM_YELLOW,
        align: "center", valign: "middle"
      });
    }

    // 説明ボックス
    if (flowItems[i].description) {
      slide.addShape("rect", {
        x: x, y: descY, w: boxW, h: descH,
        fill: { color: COLORS.LIGHT_GRAY },
        rectRadius: 0.08
      });
      slide.addText(flowItems[i].description, {
        x: x + 0.1, y: descY + 0.1, w: boxW - 0.2, h: descH - 0.2,
        fontSize: FONT.S, fontFace: FACE, color: COLORS.TEXT_MEDIUM,
        valign: "top", lineSpacingMultiple: 1.3
      });
    }
  }
  addSource(slide, source);
  return slide;
}

// =============================================================================
// パターン 11b: フローチャート（縦型）
// =============================================================================

function addVerticalFlowSlide(pres, title, keyMessage, flowItems, source) {
  var slide = pres.addSlide();
  addSlideTitle(slide, title);
  addKeyMessageBar(slide, keyMessage);

  var count = flowItems.length;
  var startY = 1.7;
  var totalH = 3.1;
  var arrowH = 0.25;
  var boxH = (totalH - arrowH * (count - 1)) / count;
  var stepW = 3.0;
  var descW = 5.4;

  for (var i = 0; i < count; i++) {
    var y = startY + i * (boxH + arrowH);

    // ステップボックス
    slide.addShape("rect", {
      x: 0.6, y: y, w: stepW, h: boxH,
      fill: { color: COLORS.DARK_GREEN },
      rectRadius: 0.08
    });
    slide.addText(flowItems[i].text, {
      x: 0.6, y: y, w: stepW, h: boxH,
      fontSize: FONT.S, fontFace: FACE, color: COLORS.WHITE,
      bold: true, align: "center", valign: "middle"
    });

    // 説明
    if (flowItems[i].description) {
      slide.addShape("rect", {
        x: 0.6 + stepW + 0.4, y: y, w: descW, h: boxH,
        fill: { color: COLORS.LIGHT_GRAY },
        rectRadius: 0.08
      });
      slide.addText(flowItems[i].description, {
        x: 0.6 + stepW + 0.6, y: y, w: descW - 0.4, h: boxH,
        fontSize: FONT.S, fontFace: FACE, color: COLORS.TEXT_MEDIUM,
        valign: "middle"
      });
    }

    // 下向き矢印（最後以外）
    if (i < count - 1) {
      slide.addText("▼", {
        x: 0.6, y: y + boxH, w: stepW, h: arrowH,
        fontSize: FONT.XS, fontFace: FACE, color: COLORS.CREAM_YELLOW,
        align: "center", valign: "middle"
      });
    }
  }
  addSource(slide, source);
  return slide;
}

// =============================================================================
// パターン 12: 比較対照スライド
// =============================================================================

function addComparisonSlide(pres, title, keyMessage, compData, source) {
  var slide = pres.addSlide();
  addSlideTitle(slide, title);
  addKeyMessageBar(slide, keyMessage);

  var colW = 4.2;
  var startY = 1.6;
  var headerH = 0.55;
  var bodyH = 3.0;

  // 左カラム
  slide.addShape("rect", {
    x: 0.6, y: startY, w: colW, h: headerH,
    fill: { color: COLORS.TEXT_LIGHT },
    rectRadius: 0.08
  });
  slide.addText(compData.col1.title, {
    x: 0.6, y: startY, w: colW, h: headerH,
    fontSize: FONT.S, fontFace: FACE, color: COLORS.WHITE,
    bold: true, align: "center", valign: "middle"
  });
  var leftPoints = compData.col1.points.map(function(p) { return "・" + p; }).join("\n");
  slide.addShape("rect", {
    x: 0.6, y: startY + headerH, w: colW, h: bodyH,
    fill: { color: COLORS.LIGHT_GRAY },
    rectRadius: 0.08
  });
  slide.addText(leftPoints, {
    x: 0.8, y: startY + headerH + 0.2, w: colW - 0.4, h: bodyH - 0.4,
    fontSize: FONT.S, fontFace: FACE, color: COLORS.TEXT_MEDIUM,
    valign: "top", lineSpacingMultiple: 1.5
  });

  // VS
  slide.addText("VS", {
    x: 0.6 + colW, y: startY, w: 0.4, h: headerH,
    fontSize: FONT.S, fontFace: FACE, color: COLORS.TEXT_DARK,
    bold: true, align: "center", valign: "middle"
  });

  // 右カラム
  var rightX = 0.6 + colW + 0.4;
  slide.addShape("rect", {
    x: rightX, y: startY, w: colW, h: headerH,
    fill: { color: COLORS.DARK_GREEN },
    rectRadius: 0.08
  });
  slide.addText(compData.col2.title, {
    x: rightX, y: startY, w: colW, h: headerH,
    fontSize: FONT.S, fontFace: FACE, color: COLORS.WHITE,
    bold: true, align: "center", valign: "middle"
  });
  var rightPoints = compData.col2.points.map(function(p) { return "・" + p; }).join("\n");
  slide.addShape("rect", {
    x: rightX, y: startY + headerH, w: colW, h: bodyH,
    fill: { color: COLORS.LIGHT_GRAY },
    rectRadius: 0.08
  });
  slide.addText(rightPoints, {
    x: rightX + 0.2, y: startY + headerH + 0.2, w: colW - 0.4, h: bodyH - 0.4,
    fontSize: FONT.S, fontFace: FACE, color: COLORS.TEXT_MEDIUM,
    valign: "top", lineSpacingMultiple: 1.5
  });

  addSource(slide, source);
  return slide;
}

// =============================================================================
// パターン 13: 4象限マトリックス
// =============================================================================

function addMatrix4QuadrantSlide(pres, title, keyMessage, matrixData, source) {
  var slide = pres.addSlide();
  addSlideTitle(slide, title);
  addKeyMessageBar(slide, keyMessage);

  var centerX = 5.0;
  var centerY = 3.3;
  var quadW = 3.6;
  var quadH = 1.5;
  var gap = 0.1;

  // 4象限の背景
  var quadPositions = [
    { x: centerX - quadW - gap / 2, y: centerY - quadH - gap / 2 },  // 左上（問題児）
    { x: centerX + gap / 2, y: centerY - quadH - gap / 2 },          // 右上（花形）
    { x: centerX - quadW - gap / 2, y: centerY + gap / 2 },          // 左下（負け犬）
    { x: centerX + gap / 2, y: centerY + gap / 2 }                   // 右下（金のなる木）
  ];

  var quadColors = [COLORS.LIGHT_GRAY, "D5E8D4", COLORS.LIGHT_GRAY, "FFF2CC"];

  for (var i = 0; i < 4 && i < matrixData.quadrants.length; i++) {
    slide.addShape("rect", {
      x: quadPositions[i].x, y: quadPositions[i].y, w: quadW, h: quadH,
      fill: { color: quadColors[i] },
      rectRadius: 0.08
    });
    slide.addText(matrixData.quadrants[i].label, {
      x: quadPositions[i].x + 0.1, y: quadPositions[i].y + 0.1, w: quadW - 0.2, h: 0.5,
      fontSize: FONT.S, fontFace: FACE, color: COLORS.TEXT_DARK,
      bold: true, valign: "top"
    });
    if (matrixData.quadrants[i].description) {
      slide.addText(matrixData.quadrants[i].description, {
        x: quadPositions[i].x + 0.1, y: quadPositions[i].y + 0.6, w: quadW - 0.2, h: quadH - 0.7,
        fontSize: FONT.S, fontFace: FACE, color: COLORS.TEXT_MEDIUM,
        valign: "top"
      });
    }
  }

  // 軸ラベル
  if (matrixData.axisLabels) {
    slide.addText(matrixData.axisLabels.yHigh || "", {
      x: 0.6, y: centerY - quadH - 0.1, w: 0.8, h: 0.3,
      fontSize: FONT.XS, fontFace: FACE, color: COLORS.TEXT_LIGHT,
      align: "center", valign: "middle", rotate: 270
    });
    slide.addText(matrixData.axisLabels.yLow || "", {
      x: 0.6, y: centerY + quadH - 0.2, w: 0.8, h: 0.3,
      fontSize: FONT.XS, fontFace: FACE, color: COLORS.TEXT_LIGHT,
      align: "center", valign: "middle", rotate: 270
    });
    slide.addText(matrixData.axisLabels.xLow || "", {
      x: centerX - quadW, y: centerY + quadH + gap + 0.05, w: quadW, h: 0.3,
      fontSize: FONT.XS, fontFace: FACE, color: COLORS.TEXT_LIGHT,
      align: "center", valign: "middle"
    });
    slide.addText(matrixData.axisLabels.xHigh || "", {
      x: centerX, y: centerY + quadH + gap + 0.05, w: quadW, h: 0.3,
      fontSize: FONT.XS, fontFace: FACE, color: COLORS.TEXT_LIGHT,
      align: "center", valign: "middle"
    });
  }

  // データポイント
  if (matrixData.points) {
    for (var j = 0; j < matrixData.points.length; j++) {
      var pt = matrixData.points[j];
      var px = centerX + (pt.x / 100) * quadW;
      var py = centerY - (pt.y / 100) * quadH;
      slide.addShape("ellipse", {
        x: px - 0.15, y: py - 0.15, w: 0.3, h: 0.3,
        fill: { color: COLORS.DARK_GREEN }
      });
      slide.addText(pt.label, {
        x: px + 0.2, y: py - 0.1, w: 1.5, h: 0.25,
        fontSize: FONT.XS, fontFace: FACE, color: COLORS.TEXT_DARK,
        bold: true, valign: "middle"
      });
    }
  }

  addSource(slide, source);
  return slide;
}

// =============================================================================
// パターン 14: サイクル図
// =============================================================================

function addCycleDiagramSlide(pres, title, keyMessage, cycleItems, source) {
  var slide = pres.addSlide();
  addSlideTitle(slide, title);
  addKeyMessageBar(slide, keyMessage);

  var count = cycleItems.length;
  var centerX = 5.0;
  var centerY = 3.4;
  var radius = 1.5;
  var boxW = 1.6;
  var boxH = 0.7;

  for (var i = 0; i < count; i++) {
    var angle = (2 * Math.PI * i / count) - Math.PI / 2;
    var x = centerX + radius * Math.cos(angle) - boxW / 2;
    var y = centerY + radius * Math.sin(angle) - boxH / 2;

    // ボックス
    slide.addShape("rect", {
      x: x, y: y, w: boxW, h: boxH,
      fill: { color: COLORS.DARK_GREEN },
      rectRadius: 0.1
    });
    slide.addText(cycleItems[i].text, {
      x: x, y: y, w: boxW, h: boxH,
      fontSize: FONT.S, fontFace: FACE, color: COLORS.WHITE,
      bold: true, align: "center", valign: "middle"
    });

    // 矢印（次の要素へ）
    var nextAngle = (2 * Math.PI * ((i + 1) % count) / count) - Math.PI / 2;
    var midAngle = (angle + nextAngle) / 2;
    if (i === count - 1) {
      midAngle = angle + (2 * Math.PI / count) / 2;
    }
    var arrowX = centerX + (radius * 0.7) * Math.cos(midAngle) - 0.15;
    var arrowY = centerY + (radius * 0.7) * Math.sin(midAngle) - 0.15;
    slide.addText("→", {
      x: arrowX, y: arrowY, w: 0.3, h: 0.3,
      fontSize: FONT.S, fontFace: FACE, color: COLORS.CREAM_YELLOW,
      bold: true, align: "center", valign: "middle",
      rotate: (midAngle * 180 / Math.PI) + 90
    });
  }

  addSource(slide, source);
  return slide;
}

// =============================================================================
// パターン 15: ガントチャート
// =============================================================================

function addGanttChartSlide(pres, title, keyMessage, ganttData, source) {
  var slide = pres.addSlide();
  addSlideTitle(slide, title);
  addKeyMessageBar(slide, keyMessage);

  var headers = ganttData.headers;
  var rows = ganttData.rows;
  var startX = 0.6;
  var startY = 1.6;
  var taskColW = 1.8;
  var totalW = 8.8;
  var periodColW = (totalW - taskColW) / (headers.length - 1);
  var rowH = 0.5;
  var headerH = 0.45;

  // ヘッダー行
  slide.addShape("rect", {
    x: startX, y: startY, w: totalW, h: headerH,
    fill: { color: COLORS.DARK_GREEN }
  });
  for (var h = 0; h < headers.length; h++) {
    var hx = h === 0 ? startX : startX + taskColW + (h - 1) * periodColW;
    var hw = h === 0 ? taskColW : periodColW;
    slide.addText(headers[h], {
      x: hx, y: startY, w: hw, h: headerH,
      fontSize: FONT.XS, fontFace: FACE, color: COLORS.WHITE,
      bold: true, align: "center", valign: "middle",
      border: { pt: 0.5, color: COLORS.WHITE }
    });
  }

  // データ行
  for (var r = 0; r < rows.length; r++) {
    var ry = startY + headerH + r * rowH;
    var bgColor = r % 2 === 0 ? COLORS.LIGHT_GRAY : COLORS.WHITE;

    // 行背景
    slide.addShape("rect", {
      x: startX, y: ry, w: totalW, h: rowH,
      fill: { color: bgColor }
    });

    // タスク名
    slide.addText(rows[r].task, {
      x: startX, y: ry, w: taskColW, h: rowH,
      fontSize: FONT.XS, fontFace: FACE, color: COLORS.TEXT_DARK,
      bold: true, valign: "middle",
      margin: [0, 0, 0, 5]
    });

    // ガントバー
    var barStart = startX + taskColW + (rows[r].start - 1) * periodColW;
    var barW = (rows[r].end - rows[r].start + 1) * periodColW;
    slide.addShape("rect", {
      x: barStart, y: ry + 0.1, w: barW, h: rowH - 0.2,
      fill: { color: COLORS.DARK_GREEN },
      rectRadius: 0.05
    });
  }

  addSource(slide, source);
  return slide;
}

// =============================================================================
// パターン 16: テーブルスライド
// =============================================================================

function addTableSlide(pres, title, keyMessage, tableData, source) {
  var slide = pres.addSlide();
  addSlideTitle(slide, title);
  addKeyMessageBar(slide, keyMessage);

  var tableRows = [];

  // ヘッダー行
  var headerRow = tableData.headers.map(function(h) {
    return { text: h, options: {
      fontSize: FONT.XS, fontFace: FACE, color: COLORS.WHITE,
      bold: true, fill: { color: COLORS.DARK_GREEN },
      align: "center", valign: "middle",
      border: { pt: 0.5, color: COLORS.WHITE }
    }};
  });
  tableRows.push(headerRow);

  // データ行
  for (var r = 0; r < tableData.rows.length; r++) {
    var bgColor = r % 2 === 0 ? COLORS.LIGHT_GRAY : COLORS.WHITE;
    var row = tableData.rows[r].map(function(cell, ci) {
      return { text: cell, options: {
        fontSize: FONT.XS, fontFace: FACE, color: COLORS.TEXT_DARK,
        fill: { color: bgColor },
        bold: ci === 0,
        align: ci === 0 ? "left" : "center",
        valign: "middle",
        border: { pt: 0.5, color: "D9D9D9" }
      }};
    });
    tableRows.push(row);
  }

  slide.addTable(tableRows, {
    x: 0.6, y: 1.6, w: 8.8,
    colW: [2.0].concat(Array(tableData.headers.length - 1).fill((8.8 - 2.0) / (tableData.headers.length - 1))),
    rowH: 0.45,
    border: { pt: 0.5, color: "D9D9D9" },
    autoPage: false
  });

  addSource(slide, source);
  return slide;
}

// =============================================================================
// パターン 17: 背景型スライド
// =============================================================================

function addBackgroundSlide(pres, title, keyMessage, bgData, source) {
  var slide = pres.addSlide();
  addSlideTitle(slide, title);
  addKeyMessageBar(slide, keyMessage);

  var startY = 1.7;
  var catW = 2.0;
  var catH = 3.0;
  var itemsX = 3.0;
  var itemsW = 6.4;

  // カテゴリラベル
  slide.addShape("rect", {
    x: 0.6, y: startY, w: catW, h: catH,
    fill: { color: COLORS.DARK_GREEN },
    rectRadius: 0.1
  });
  slide.addText(bgData.category, {
    x: 0.6, y: startY, w: catW, h: catH,
    fontSize: FONT.M, fontFace: FACE, color: COLORS.WHITE,
    bold: true, align: "center", valign: "middle"
  });

  // 項目リスト
  var itemH = catH / bgData.items.length;
  for (var i = 0; i < bgData.items.length; i++) {
    var y = startY + i * itemH;
    // 番号バッジ
    slide.addShape("rect", {
      x: itemsX, y: y + 0.1, w: 0.5, h: itemH - 0.2,
      fill: { color: COLORS.CREAM_YELLOW },
      rectRadius: 0.05
    });
    slide.addText(String(i + 1), {
      x: itemsX, y: y + 0.1, w: 0.5, h: itemH - 0.2,
      fontSize: FONT.SP, fontFace: FACE, color: COLORS.DARK_GREEN,
      bold: true, align: "center", valign: "middle"
    });
    // 項目テキスト
    slide.addShape("rect", {
      x: itemsX + 0.65, y: y + 0.1, w: itemsW - 0.65, h: itemH - 0.2,
      fill: { color: COLORS.LIGHT_GRAY },
      rectRadius: 0.05
    });
    slide.addText(bgData.items[i].label, {
      x: itemsX + 0.8, y: y + 0.1, w: 2.0, h: itemH - 0.2,
      fontSize: FONT.S, fontFace: FACE, color: COLORS.TEXT_DARK,
      bold: true, valign: "middle"
    });
    if (bgData.items[i].description) {
      slide.addText(bgData.items[i].description, {
        x: itemsX + 2.8, y: y + 0.1, w: itemsW - 2.8, h: itemH - 0.2,
        fontSize: FONT.S, fontFace: FACE, color: COLORS.TEXT_MEDIUM,
        valign: "middle"
      });
    }
  }

  addSource(slide, source);
  return slide;
}

// =============================================================================
// パターン 18: 拡散型スライド
// =============================================================================

function addDivergenceSlide(pres, title, keyMessage, divData, source) {
  var slide = pres.addSlide();
  addSlideTitle(slide, title);
  addKeyMessageBar(slide, keyMessage);

  var startY = 1.8;
  var sourceW = 2.2;
  var sourceH = 2.8;
  var targetW = 2.0;
  var count = divData.targets.length;
  var targetH = (sourceH - 0.2 * (count - 1)) / count;
  var arrowW = 0.8;
  var targetX = 0.6 + sourceW + arrowW;

  // ソースボックス
  slide.addShape("rect", {
    x: 0.6, y: startY, w: sourceW, h: sourceH,
    fill: { color: COLORS.DARK_GREEN },
    rectRadius: 0.1
  });
  slide.addText(divData.source, {
    x: 0.6, y: startY, w: sourceW, h: sourceH,
    fontSize: FONT.M, fontFace: FACE, color: COLORS.WHITE,
    bold: true, align: "center", valign: "middle"
  });

  // ターゲット
  for (var i = 0; i < count; i++) {
    var ty = startY + i * (targetH + 0.2);

    // 矢印
    slide.addText("▶", {
      x: 0.6 + sourceW, y: ty, w: arrowW, h: targetH,
      fontSize: FONT.S, fontFace: FACE, color: COLORS.CREAM_YELLOW,
      align: "center", valign: "middle"
    });

    // ターゲットラベル
    slide.addShape("rect", {
      x: targetX, y: ty, w: targetW, h: targetH,
      fill: { color: COLORS.CREAM_YELLOW },
      rectRadius: 0.08
    });
    slide.addText(divData.targets[i].label, {
      x: targetX, y: ty, w: targetW, h: targetH,
      fontSize: FONT.S, fontFace: FACE, color: COLORS.DARK_GREEN,
      bold: true, align: "center", valign: "middle"
    });

    // 説明
    if (divData.targets[i].description) {
      slide.addShape("rect", {
        x: targetX + targetW + 0.2, y: ty, w: 9.4 - targetX - targetW - 0.2, h: targetH,
        fill: { color: COLORS.LIGHT_GRAY },
        rectRadius: 0.08
      });
      slide.addText(divData.targets[i].description, {
        x: targetX + targetW + 0.4, y: ty, w: 9.4 - targetX - targetW - 0.6, h: targetH,
        fontSize: FONT.S, fontFace: FACE, color: COLORS.TEXT_MEDIUM,
        valign: "middle"
      });
    }
  }

  addSource(slide, source);
  return slide;
}

// =============================================================================
// パターン 19: 上昇型スライド
// =============================================================================

function addAscendingSlide(pres, title, keyMessage, steps, source) {
  var slide = pres.addSlide();
  addSlideTitle(slide, title);
  addKeyMessageBar(slide, keyMessage);

  var count = steps.length;
  var startY = 4.6;
  var maxH = 2.8;
  var totalW = 8.8;
  var gap = 0.2;
  var boxW = (totalW - gap * (count - 1)) / count;

  for (var i = 0; i < count; i++) {
    var stepH = maxH * (i + 1) / count;
    var x = 0.6 + i * (boxW + gap);
    var y = startY - stepH;

    // ステップボックス（高さが段階的に増加）
    slide.addShape("rect", {
      x: x, y: y, w: boxW, h: stepH,
      fill: { color: COLORS.DARK_GREEN },
      rectRadius: 0.08
    });
    // ラベル
    slide.addText(steps[i].label, {
      x: x, y: y + 0.15, w: boxW, h: 0.4,
      fontSize: FONT.S, fontFace: FACE, color: COLORS.CREAM_YELLOW,
      bold: true, align: "center", valign: "middle"
    });
    // 説明
    if (steps[i].description) {
      slide.addText(steps[i].description, {
        x: x + 0.1, y: y + 0.55, w: boxW - 0.2, h: stepH - 0.7,
        fontSize: FONT.S, fontFace: FACE, color: COLORS.WHITE,
        align: "center", valign: "top"
      });
    }
  }

  addSource(slide, source);
  return slide;
}

// =============================================================================
// パターン 20: フロー表型スライド
// =============================================================================

function addFlowTableSlide(pres, title, keyMessage, ftData, source) {
  var slide = pres.addSlide();
  addSlideTitle(slide, title);
  addKeyMessageBar(slide, keyMessage);

  var phases = ftData.phases;
  var categories = ftData.categories;
  var startX = 0.6;
  var startY = 1.6;
  var totalW = 8.8;
  var catColW = 1.5;
  var phaseW = (totalW - catColW) / phases.length;
  var flowH = 0.6;
  var tableY = startY + flowH + 0.15;
  var rowH = 0.55;

  // フロー矢印（上部）
  for (var p = 0; p < phases.length; p++) {
    var px = startX + catColW + p * phaseW;
    slide.addShape("rect", {
      x: px + 0.05, y: startY, w: phaseW - 0.1, h: flowH,
      fill: { color: COLORS.DARK_GREEN },
      rectRadius: 0.08
    });
    slide.addText(phases[p], {
      x: px + 0.05, y: startY, w: phaseW - 0.1, h: flowH,
      fontSize: FONT.S, fontFace: FACE, color: COLORS.WHITE,
      bold: true, align: "center", valign: "middle"
    });
    // 矢印
    if (p < phases.length - 1) {
      slide.addText("▶", {
        x: px + phaseW - 0.2, y: startY, w: 0.4, h: flowH,
        fontSize: FONT.XS, fontFace: FACE, color: COLORS.CREAM_YELLOW,
        align: "center", valign: "middle"
      });
    }
  }

  // テーブル部分
  for (var c = 0; c < categories.length; c++) {
    var cy = tableY + c * rowH;

    // カテゴリラベル
    slide.addShape("rect", {
      x: startX, y: cy, w: catColW, h: rowH,
      fill: { color: COLORS.CREAM_YELLOW }
    });
    slide.addText(categories[c].label, {
      x: startX, y: cy, w: catColW, h: rowH,
      fontSize: FONT.XS, fontFace: FACE, color: COLORS.DARK_GREEN,
      bold: true, align: "center", valign: "middle",
      border: { pt: 0.5, color: COLORS.WHITE }
    });

    // セル
    for (var j = 0; j < categories[c].cells.length; j++) {
      var cx = startX + catColW + j * phaseW;
      var cellBg = c % 2 === 0 ? COLORS.LIGHT_GRAY : COLORS.WHITE;
      slide.addShape("rect", {
        x: cx, y: cy, w: phaseW, h: rowH,
        fill: { color: cellBg }
      });
      slide.addText(categories[c].cells[j], {
        x: cx, y: cy, w: phaseW, h: rowH,
        fontSize: FONT.XS, fontFace: FACE, color: COLORS.TEXT_MEDIUM,
        align: "center", valign: "middle",
        border: { pt: 0.5, color: "D9D9D9" }
      });
    }
  }

  addSource(slide, source);
  return slide;
}

// =============================================================================
// パターン 21: フローマトリックス型
// =============================================================================

function addFlowMatrixSlide(pres, title, keyMessage, fmData, source) {
  var slide = pres.addSlide();
  addSlideTitle(slide, title);
  addKeyMessageBar(slide, keyMessage);

  var columns = fmData.columns;
  var rows = fmData.rows;
  var startX = 0.6;
  var startY = 1.6;
  var totalW = 8.8;
  var rowLabelW = 1.5;
  var colW = (totalW - rowLabelW) / columns.length;
  var flowH = 0.6;
  var tableY = startY + flowH + 0.15;
  var rowH = 0.55;

  // フロー矢印（上部）
  for (var c = 0; c < columns.length; c++) {
    var cx = startX + rowLabelW + c * colW;
    slide.addShape("rect", {
      x: cx + 0.05, y: startY, w: colW - 0.1, h: flowH,
      fill: { color: COLORS.DARK_GREEN },
      rectRadius: 0.08
    });
    slide.addText(columns[c], {
      x: cx + 0.05, y: startY, w: colW - 0.1, h: flowH,
      fontSize: FONT.S, fontFace: FACE, color: COLORS.WHITE,
      bold: true, align: "center", valign: "middle"
    });
    if (c < columns.length - 1) {
      slide.addText("▶", {
        x: cx + colW - 0.2, y: startY, w: 0.4, h: flowH,
        fontSize: FONT.XS, fontFace: FACE, color: COLORS.CREAM_YELLOW,
        align: "center", valign: "middle"
      });
    }
  }

  // マトリックス部分
  for (var r = 0; r < rows.length; r++) {
    var ry = tableY + r * rowH;

    // 行ラベル
    slide.addShape("rect", {
      x: startX, y: ry, w: rowLabelW, h: rowH,
      fill: { color: COLORS.CREAM_YELLOW }
    });
    slide.addText(rows[r].label, {
      x: startX, y: ry, w: rowLabelW, h: rowH,
      fontSize: FONT.XS, fontFace: FACE, color: COLORS.DARK_GREEN,
      bold: true, align: "center", valign: "middle",
      border: { pt: 0.5, color: COLORS.WHITE }
    });

    // セル
    for (var j = 0; j < rows[r].cells.length; j++) {
      var cellX = startX + rowLabelW + j * colW;
      var cellBg = r % 2 === 0 ? COLORS.LIGHT_GRAY : COLORS.WHITE;
      slide.addShape("rect", {
        x: cellX, y: ry, w: colW, h: rowH,
        fill: { color: cellBg }
      });
      slide.addText(rows[r].cells[j], {
        x: cellX, y: ry, w: colW, h: rowH,
        fontSize: FONT.XS, fontFace: FACE, color: COLORS.TEXT_MEDIUM,
        align: "center", valign: "middle",
        border: { pt: 0.5, color: "D9D9D9" }
      });
    }
  }

  addSource(slide, source);
  return slide;
}

// =============================================================================
// パターン 22: マトリックス型
// =============================================================================

function addMatrixTableSlide(pres, title, keyMessage, mtData, source) {
  var slide = pres.addSlide();
  addSlideTitle(slide, title);
  addKeyMessageBar(slide, keyMessage);

  var colLabels = mtData.colLabels;
  var rows = mtData.rows;
  var startX = 0.6;
  var startY = 1.6;
  var totalW = 8.8;
  var rowLabelW = 1.5;
  var colW = (totalW - rowLabelW) / colLabels.length;
  var rowH = 0.5;

  // 列ヘッダー
  // 空セル（左上）
  slide.addShape("rect", {
    x: startX, y: startY, w: rowLabelW, h: rowH,
    fill: { color: COLORS.DARK_GREEN }
  });
  for (var c = 0; c < colLabels.length; c++) {
    var cx = startX + rowLabelW + c * colW;
    slide.addShape("rect", {
      x: cx, y: startY, w: colW, h: rowH,
      fill: { color: COLORS.DARK_GREEN }
    });
    slide.addText(colLabels[c], {
      x: cx, y: startY, w: colW, h: rowH,
      fontSize: FONT.XS, fontFace: FACE, color: COLORS.WHITE,
      bold: true, align: "center", valign: "middle",
      border: { pt: 0.5, color: COLORS.WHITE }
    });
  }

  // データ行
  for (var r = 0; r < rows.length; r++) {
    var ry = startY + rowH + r * rowH;

    // 行ラベル
    slide.addShape("rect", {
      x: startX, y: ry, w: rowLabelW, h: rowH,
      fill: { color: COLORS.CREAM_YELLOW }
    });
    slide.addText(rows[r].label, {
      x: startX, y: ry, w: rowLabelW, h: rowH,
      fontSize: FONT.XS, fontFace: FACE, color: COLORS.DARK_GREEN,
      bold: true, align: "center", valign: "middle",
      border: { pt: 0.5, color: COLORS.WHITE }
    });

    // セル
    for (var j = 0; j < rows[r].cells.length; j++) {
      var cellX = startX + rowLabelW + j * colW;
      var cellBg = r % 2 === 0 ? COLORS.LIGHT_GRAY : COLORS.WHITE;
      slide.addShape("rect", {
        x: cellX, y: ry, w: colW, h: rowH,
        fill: { color: cellBg }
      });
      slide.addText(rows[r].cells[j], {
        x: cellX, y: ry, w: colW, h: rowH,
        fontSize: FONT.XS, fontFace: FACE, color: COLORS.TEXT_MEDIUM,
        align: "center", valign: "middle",
        border: { pt: 0.5, color: "D9D9D9" }
      });
    }
  }

  addSource(slide, source);
  return slide;
}

// =============================================================================
// エクスポート
// =============================================================================

module.exports = {
  pptxgen: pptxgen,
  config: config,
  COLORS: COLORS,
  FONT: FONT,
  FACE: FACE,
  CHART_COLORS: CHART_COLORS,
  // パターン 1-9
  addTitleSlide: addTitleSlide,
  addSummarySlide: addSummarySlide,
  addSectionSlide: addSectionSlide,
  addBodySlide: addBodySlide,
  addEnumerationSlide: addEnumerationSlide,
  addTwoColumnSlide: addTwoColumnSlide,
  addStatsSlide: addStatsSlide,
  addConclusionSlide: addConclusionSlide,
  addImageSlide: addImageSlide,
  // パターン 10-22
  addChartSlide: addChartSlide,
  addFlowChartSlide: addFlowChartSlide,
  addVerticalFlowSlide: addVerticalFlowSlide,
  addComparisonSlide: addComparisonSlide,
  addMatrix4QuadrantSlide: addMatrix4QuadrantSlide,
  addCycleDiagramSlide: addCycleDiagramSlide,
  addGanttChartSlide: addGanttChartSlide,
  addTableSlide: addTableSlide,
  addBackgroundSlide: addBackgroundSlide,
  addDivergenceSlide: addDivergenceSlide,
  addAscendingSlide: addAscendingSlide,
  addFlowTableSlide: addFlowTableSlide,
  addFlowMatrixSlide: addFlowMatrixSlide,
  addMatrixTableSlide: addMatrixTableSlide
};

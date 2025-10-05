!function(e,n){"object"==typeof exports&&"object"==typeof module?module.exports=n():"function"==typeof define&&define.amd?define([],n):"object"==typeof exports?exports.vizObject=n():e.vizObject=n()}(self,()=>(()=>{"use strict";var e={d:(n,t)=>{for(var o in t)e.o(t,o)&&!e.o(n,o)&&Object.defineProperty(n,o,{enumerable:!0,get:t[o]})},o:(e,n)=>Object.prototype.hasOwnProperty.call(e,n),r:e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})}},n={};e.r(n),e.d(n,{default:()=>o});

// Utility to escape text inserted via innerHTML
const escapeHtml = (str) => {
  if (str == null) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

const t = {
  id: "kpi_viz",
  label: "KPI Blocks",
  options: {
    title_font_size: { type: "number", label: "Title Font Size", default: 14, section: "Style" },
    value_font_size: { type: "number", label: "Value Font Size", default: 48, section: "Style" },
    subtitle_font_size: { type: "number", label: "Subtitle Font Size", default: 13, section: "Style" },
    cards_per_row: { type: "number", label: "Cards Per Row", default: 4, section: "Layout" },
    card_background: { type: "string", label: "Card Background Color", default: "#FFFFFF", display: "color", section: "Style" },
    title_color: { type: "string", label: "Title Color", default: "#374151", display: "color", section: "Style" },
    value_color: { type: "string", label: "Value Color", default: "#111827", display: "color", section: "Style" },
    positive_color: { type: "string", label: "Positive Trend Color", default: "#10B981", display: "color", section: "Style" },
    negative_color: { type: "string", label: "Negative Trend Color", default: "#EF4444", display: "color", section: "Style" },
    show_trend: { type: "boolean", label: "Show Trend Indicators", default: true, section: "Display" },
    show_icon: { type: "boolean", label: "Show Icons", default: true, section: "Display" },
    use_dimension_subtitle: { type: "boolean", label: "Use first dimension as subtitle", default: true, section: "Display" }
  },

  create(el, config) {
    el.innerHTML = `
      <style>
        .kpi-container {
          display: grid;
          gap: 20px;
          padding: 20px;
          background: #F3F4F6;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        }
        .kpi-card {
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          transition: all 0.2s ease;
          position: relative;
          overflow: hidden;
        }
        .kpi-card:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          transform: translateY(-2px);
        }
        .kpi-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
        }
        .kpi-icon {
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #EEF2FF;
          border-radius: 6px;
          padding: 4px;
        }
        .kpi-title {
          font-weight: 500;
          margin: 0;
        }
        .kpi-value {
          font-weight: 700;
          margin: 8px 0;
          line-height: 1;
        }
        .kpi-trend {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          font-weight: 600;
          margin-top: 8px;
        }
        .kpi-trend.positive { color: #10B981; }
        .kpi-trend.negative { color: #EF4444; }
        .kpi-trend .arrow { font-size: 16px; }
        .kpi-subtitle {
          color: #6B7280;
          font-size: 13px;
          margin-top: 4px;
        }
      </style>
      <div class="kpi-container"></div>
    `;
  },

  updateAsync(data, element, config, queryResponse, details, done) {
    if (!queryResponse || !queryResponse.fields) {
      element.innerHTML = '<div style="padding: 20px; color: #EF4444;">No query results available</div>';
      done();
      return;
    }

    const fields = queryResponse.fields;
    const measures = fields.measures || [];
    const dimensions = fields.dimensions || [];

    if (measures.length === 0) {
      element.innerHTML = '<div style="padding: 20px; color: #EF4444;">This visualization requires at least one measure</div>';
      done();
      return;
    }

    if (!data || data.length === 0) {
      element.innerHTML = '<div style="padding: 20px; color: #EF4444;">No data returned</div>';
      done();
      return;
    }

    // Use first row for KPI blocks
    const row = data[0];

    const cardsPerRow = config.cards_per_row || 4;
    const showTrend = config.show_trend !== false;
    const showIcon = config.show_icon !== false;
    const useDimensionSubtitle = config.use_dimension_subtitle !== false;

    const container = element.querySelector(".kpi-container");
    container.style.gridTemplateColumns = `repeat(${cardsPerRow}, 1fr)`;
    container.innerHTML = "";

    const fragment = document.createDocumentFragment();

    measures.forEach((measure) => {
      const card = document.createElement("div");
      card.className = "kpi-card";
      card.style.background = config.card_background || "#FFFFFF";

      const rawValue = row[measure.name]?.value ?? 0;
      const renderedValue = row[measure.name]?.rendered ?? rawValue;

      let changeValue = null;
      let changeRendered = "";
      const changeFieldName = `${measure.name}_change`;
      if (measures.find(m => m.name === changeFieldName) && row[changeFieldName]) {
        changeValue = row[changeFieldName].value;
        changeRendered = row[changeFieldName].rendered ?? `${changeValue}%`;
      }

      let subtitle = "";
      if (useDimensionSubtitle && dimensions.length > 0 && row[dimensions[0].name]) {
        subtitle = row[dimensions[0].name].value ?? "";
      }

      const iconMap = {
        employee: "👥",
        review: "📋",
        score: "📊",
        pending: "⏳",
        performer: "⭐",
        performance: "📈",
        revenue: "💰",
        profit: "💵",
        customer: "👤",
        order: "🛒",
        default: "📊"
      };

      const pickIcon = (labelOrName) => {
        const txt = String(labelOrName || "").toLowerCase();
        for (const key in iconMap) {
          if (txt.includes(key)) return iconMap[key];
        }
        return iconMap.default;
      };

      const icon = pickIcon(measure.label || measure.name);

      // Build innerHTML with escaped text to avoid accidental HTML injection
      let html = `
        <div class="kpi-header">
          ${showIcon ? `<div class="kpi-icon">${icon}</div>` : ""}
          <h3 class="kpi-title" style="font-size: ${config.title_font_size || 14}px; color: ${config.title_color || "#374151"}">
            ${escapeHtml(measure.label || measure.name)}
          </h3>
        </div>
        <div class="kpi-value" style="font-size: ${config.value_font_size || 48}px; color: ${config.value_color || "#111827"}">
          ${escapeHtml(renderedValue)}
        </div>
      `;

      if (showTrend && changeValue !== null) {
        const isPositive = changeValue > 0; // treat 0 as neutral (no arrow)
        const isNegative = changeValue < 0;
        const arrow = isPositive ? "↑" : (isNegative ? "↓" : "→");
        const trendClass = isPositive ? "positive" : (isNegative ? "negative" : "");
        const trendColor = isPositive
          ? (config.positive_color || "#10B981")
          : (isNegative ? (config.negative_color || "#EF4444") : "#6B7280");

        html += `
          <div class="kpi-trend ${trendClass}" style="color: ${trendColor}">
            <span class="arrow">${arrow}</span>
            <span>${escapeHtml(changeRendered)}</span>
          </div>
        `;
      }

      if (subtitle) {
        html += `
          <div class="kpi-subtitle" style="font-size: ${config.subtitle_font_size || 13}px">
            ${escapeHtml(subtitle)}
          </div>
        `;
      }

      card.innerHTML = html;
      fragment.appendChild(card);
    });

    container.appendChild(fragment);
    done();
  }
};

looker.plugins.visualizations.add(t);
const o = t;
return n})());
//# sourceMappingURL=kpi_viz.js.map

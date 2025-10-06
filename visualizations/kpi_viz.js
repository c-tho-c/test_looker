// Enhanced KPI Visualization for Looker
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

// Format numbers with locale support
const formatNumber = (num) => {
  if (num == null) return "0";
  const absNum = Math.abs(num);
  if (absNum >= 1e9) return (num / 1e9).toFixed(1) + "B";
  if (absNum >= 1e6) return (num / 1e6).toFixed(1) + "M";
  if (absNum >= 1e3) return (num / 1e3).toFixed(1) + "K";
  return num.toLocaleString();
};

const t = {
  id: "kpi_viz_enhanced",
  label: "KPI Blocks Enhanced",
  options: {
    // Style Options
    title_font_size: {
      type: "number",
      label: "Title Font Size",
      default: 14,
      section: "Style",
      order: 1
    },
    value_font_size: {
      type: "number",
      label: "Value Font Size",
      default: 48,
      section: "Style",
      order: 2
    },
    subtitle_font_size: {
      type: "number",
      label: "Subtitle Font Size",
      default: 13,
      section: "Style",
      order: 3
    },
    card_background: {
      type: "string",
      label: "Card Background Color",
      default: "#FFFFFF",
      display: "color",
      section: "Style",
      order: 4
    },
    title_color: {
      type: "string",
      label: "Title Color",
      default: "#374151",
      display: "color",
      section: "Style",
      order: 5
    },
    value_color: {
      type: "string",
      label: "Value Color",
      default: "#111827",
      display: "color",
      section: "Style",
      order: 6
    },
    positive_color: {
      type: "string",
      label: "Positive Trend Color",
      default: "#10B981",
      display: "color",
      section: "Style",
      order: 7
    },
    negative_color: {
      type: "string",
      label: "Negative Trend Color",
      default: "#EF4444",
      display: "color",
      section: "Style",
      order: 8
    },
    neutral_color: {
      type: "string",
      label: "Neutral Trend Color",
      default: "#6B7280",
      display: "color",
      section: "Style",
      order: 9
    },

    // Layout Options
    cards_per_row: {
      type: "number",
      label: "Cards Per Row",
      default: 4,
      section: "Layout",
      order: 1,
      min: 1,
      max: 12
    },
    card_gap: {
      type: "number",
      label: "Gap Between Cards (px)",
      default: 20,
      section: "Layout",
      order: 2
    },
    card_padding: {
      type: "number",
      label: "Card Padding (px)",
      default: 24,
      section: "Layout",
      order: 3
    },
    border_radius: {
      type: "number",
      label: "Border Radius (px)",
      default: 12,
      section: "Layout",
      order: 4
    },
    responsive_breakpoint: {
      type: "number",
      label: "Mobile Breakpoint (px)",
      default: 768,
      section: "Layout",
      order: 5
    },

    // Display Options
    show_trend: {
      type: "boolean",
      label: "Show Trend Indicators",
      default: true,
      section: "Display",
      order: 1
    },
    show_icon: {
      type: "boolean",
      label: "Show Icons",
      default: true,
      section: "Display",
      order: 2
    },
    use_dimension_subtitle: {
      type: "boolean",
      label: "Use First Dimension as Subtitle",
      default: true,
      section: "Display",
      order: 3
    },
    show_sparkline: {
      type: "boolean",
      label: "Show Sparkline (if data available)",
      default: false,
      section: "Display",
      order: 4
    },
    animate_on_load: {
      type: "boolean",
      label: "Animate Cards on Load",
      default: true,
      section: "Display",
      order: 5
    },
    show_comparison_bar: {
      type: "boolean",
      label: "Show Comparison Progress Bar",
      default: false,
      section: "Display",
      order: 6
    },

    // Data Options
    data_row_index: {
      type: "number",
      label: "Data Row to Display (0 = first)",
      default: 0,
      section: "Data",
      order: 1,
      min: 0
    },
    change_field_suffix: {
      type: "string",
      label: "Change Field Suffix",
      default: "_change",
      section: "Data",
      order: 2
    },
    target_field_suffix: {
      type: "string",
      label: "Target Field Suffix (for comparison)",
      default: "_target",
      section: "Data",
      order: 3
    },

    // Advanced
    custom_css: {
      type: "string",
      label: "Custom CSS",
      default: "",
      section: "Advanced",
      order: 1,
      display: "textarea"
    }
  },

  create(el, config) {
    el.innerHTML = `
      <style>
        .kpi-container {
          display: grid;
          gap: 0;
          padding: 0;
          background: transparent;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
          min-height: 100%;
          width: 100%;
          height: 100%;
          box-sizing: border-box;
        }

        .kpi-card {
          border-radius: 0;
          padding: 32px;
          box-shadow: none;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
          background: transparent;
          display: flex;
          flex-direction: column;
          justify-content: center;
          min-height: 100%;
          height: 100%;
        }

        .kpi-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 0;
          background: linear-gradient(90deg, #3B82F6, #8B5CF6);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .kpi-card:hover {
          box-shadow: none;
          transform: none;
        }

        .kpi-card:hover::before {
          opacity: 0;
        }

        .kpi-card.animate {
          animation: slideIn 0.5s ease-out forwards;
          opacity: 0;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .kpi-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 16px;
        }

        .kpi-icon {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%);
          border-radius: 8px;
          font-size: 20px;
          transition: transform 0.3s ease;
          flex-shrink: 0;
        }

        .kpi-card:hover .kpi-icon {
          transform: none;
        }

        .kpi-title {
          font-weight: 500;
          margin: 0;
          flex: 1;
          line-height: 1.4;
          word-wrap: break-word;
        }

        .kpi-value {
          font-weight: 700;
          margin: 16px 0 12px 0;
          line-height: 1.1;
          letter-spacing: -0.02em;
          word-wrap: break-word;
        }

        .kpi-trend {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          font-weight: 600;
          margin-top: 8px;
          padding: 4px 10px;
          border-radius: 6px;
          background: rgba(0, 0, 0, 0.03);
        }

        .kpi-trend.positive {
          color: #10B981;
          background: rgba(16, 185, 129, 0.1);
        }

        .kpi-trend.negative {
          color: #EF4444;
          background: rgba(239, 68, 68, 0.1);
        }

        .kpi-trend.neutral {
          color: #6B7280;
          background: rgba(107, 114, 128, 0.1);
        }

        .kpi-trend .arrow {
          font-size: 16px;
          font-weight: bold;
        }

        .kpi-subtitle {
          color: #6B7280;
          font-size: 13px;
          margin-top: 8px;
          font-weight: 500;
        }

        .kpi-comparison-bar {
          margin-top: 12px;
          height: 6px;
          background: #E5E7EB;
          border-radius: 3px;
          overflow: hidden;
          position: relative;
        }

        .kpi-comparison-fill {
          height: 100%;
          background: linear-gradient(90deg, #3B82F6, #8B5CF6);
          border-radius: 3px;
          transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .kpi-comparison-label {
          font-size: 11px;
          color: #6B7280;
          margin-top: 4px;
          display: flex;
          justify-content: space-between;
        }

        .kpi-sparkline {
          margin-top: 12px;
          height: 40px;
        }

        .kpi-error {
          padding: 20px;
          color: #EF4444;
          background: #FEE2E2;
          border-radius: 8px;
          margin: 20px;
        }

        .kpi-loading {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 200px;
          color: #6B7280;
        }

        @media (max-width: 768px) {
          .kpi-container {
            grid-template-columns: 1fr !important;
            gap: 12px;
            padding: 12px;
          }

          .kpi-card {
            padding: 16px;
          }

          .kpi-value {
            font-size: 32px !important;
          }
        }

        /* Custom CSS placeholder */
        .kpi-custom-styles {}
      </style>
      <div class="kpi-container"></div>
    `;
  },

  updateAsync(data, element, config, queryResponse, details, done) {
    try {
      // Validation
      if (!queryResponse || !queryResponse.fields) {
        element.innerHTML = '<div class="kpi-error">⚠️ No query results available</div>';
        done();
        return;
      }

      const fields = queryResponse.fields;
      const measures = fields.measures || [];
      const dimensions = fields.dimensions || [];

      if (measures.length === 0) {
        element.innerHTML = '<div class="kpi-error">⚠️ This visualization requires at least one measure</div>';
        done();
        return;
      }

      if (!data || data.length === 0) {
        element.innerHTML = '<div class="kpi-error">⚠️ No data returned from query</div>';
        done();
        return;
      }

      // Configuration
      const rowIndex = Math.min(config.data_row_index || 0, data.length - 1);
      const row = data[rowIndex];
      const cardsPerRow = Math.max(1, Math.min(12, config.cards_per_row || 4));
      const showTrend = config.show_trend !== false;
      const showIcon = config.show_icon !== false;
      const useDimensionSubtitle = config.use_dimension_subtitle !== false;
      const showComparison = config.show_comparison_bar === true;
      const animateOnLoad = config.animate_on_load !== false;
      const changeFieldSuffix = config.change_field_suffix || "_change";
      const targetFieldSuffix = config.target_field_suffix || "_target";

      // Apply custom CSS if provided
      if (config.custom_css) {
        let styleEl = element.querySelector('.kpi-custom-styles');
        if (!styleEl) {
          styleEl = document.createElement('style');
          styleEl.className = 'kpi-custom-styles';
          element.appendChild(styleEl);
        }
        styleEl.textContent = config.custom_css;
      }

      const container = element.querySelector(".kpi-container");
      container.style.gridTemplateColumns = `repeat(${cardsPerRow}, 1fr)`;
      container.style.gap = "0";
      container.innerHTML = "";

      const fragment = document.createDocumentFragment();

      // Enhanced icon mapping
      const iconMap = {
        employee: "👥", employees: "👥", staff: "👥", team: "👥",
        review: "📋", reviews: "📋", feedback: "📋",
        score: "📊", rating: "⭐", ratings: "⭐",
        pending: "⏳", waiting: "⏳", queue: "⏳",
        performer: "⭐", performance: "📈", growth: "📈",
        revenue: "💰", sales: "💰", income: "💰",
        profit: "💵", margin: "💵", earnings: "💵",
        customer: "👤", customers: "👥", client: "👤", clients: "👥",
        order: "🛒", orders: "🛒", purchase: "🛒",
        conversion: "🎯", rate: "📊", percentage: "📊",
        time: "⏱️", duration: "⏱️", hours: "⏱️",
        cost: "💳", expense: "💳", spend: "💳",
        traffic: "🚦", visits: "👁️", views: "👁️",
        engagement: "💬", clicks: "👆", interaction: "💬",
        satisfaction: "😊", nps: "😊", csat: "😊",
        churn: "📉", retention: "🔒", loyalty: "❤️",
        inventory: "📦", stock: "📦", products: "📦",
        default: "📊"
      };

      const pickIcon = (labelOrName) => {
        const txt = String(labelOrName || "").toLowerCase();
        for (const key in iconMap) {
          if (txt.includes(key)) return iconMap[key];
        }
        return iconMap.default;
      };

      measures.forEach((measure, index) => {
        const card = document.createElement("div");
        card.className = animateOnLoad ? "kpi-card animate" : "kpi-card";
        if (animateOnLoad) {
          card.style.animationDelay = `${index * 0.1}s`;
        }
        card.style.background = config.card_background || "#FFFFFF";
        card.style.padding = `${config.card_padding || 24}px`;
        card.style.borderRadius = `${config.border_radius || 12}px`;

        const rawValue = row[measure.name]?.value ?? 0;
        const renderedValue = row[measure.name]?.rendered ?? rawValue;

        // Trend/Change detection
        let changeValue = null;
        let changeRendered = "";
        const changeFieldName = `${measure.name}${changeFieldSuffix}`;
        if (measures.find(m => m.name === changeFieldName) && row[changeFieldName]) {
          changeValue = row[changeFieldName].value;
          changeRendered = row[changeFieldName].rendered ?? `${changeValue}%`;
        }

        // Target/Comparison detection
        let targetValue = null;
        let comparisonPercent = 0;
        const targetFieldName = `${measure.name}${targetFieldSuffix}`;
        if (measures.find(m => m.name === targetFieldName) && row[targetFieldName]) {
          targetValue = row[targetFieldName].value;
          if (targetValue && targetValue !== 0) {
            comparisonPercent = Math.min(100, Math.max(0, (rawValue / targetValue) * 100));
          }
        }

        // Subtitle
        let subtitle = "";
        if (useDimensionSubtitle && dimensions.length > 0 && row[dimensions[0].name]) {
          subtitle = row[dimensions[0].name].value ?? "";
        }

        const icon = pickIcon(measure.label || measure.name);

        // Build card HTML
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

        // Trend indicator
        if (showTrend && changeValue !== null) {
          const isPositive = changeValue > 0;
          const isNegative = changeValue < 0;
          const arrow = isPositive ? "↑" : (isNegative ? "↓" : "→");
          const trendClass = isPositive ? "positive" : (isNegative ? "negative" : "neutral");
          const trendColor = isPositive
            ? (config.positive_color || "#10B981")
            : (isNegative ? (config.negative_color || "#EF4444") : (config.neutral_color || "#6B7280"));

          html += `
            <div class="kpi-trend ${trendClass}" style="color: ${trendColor}">
              <span class="arrow">${arrow}</span>
              <span>${escapeHtml(changeRendered)}</span>
            </div>
          `;
        }

        // Comparison bar
        if (showComparison && targetValue !== null) {
          html += `
            <div class="kpi-comparison-bar">
              <div class="kpi-comparison-fill" style="width: ${comparisonPercent}%"></div>
            </div>
            <div class="kpi-comparison-label">
              <span>${comparisonPercent.toFixed(0)}% of target</span>
              <span>${escapeHtml(row[targetFieldName].rendered ?? targetValue)}</span>
            </div>
          `;
        }

        // Subtitle
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
    } catch (error) {
      console.error("KPI Viz Error:", error);
      element.innerHTML = `<div class="kpi-error">⚠️ Error rendering visualization: ${escapeHtml(error.message)}</div>`;
      done();
    }
  }
};

looker.plugins.visualizations.add(t);
const o = t;
return n})());

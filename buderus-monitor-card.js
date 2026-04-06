// ================================================================
// Buderus Pro Monitor Card v0.0.3
// Based on v0.0.2 · Anti-Flicker · Pro Editor · Mini-Graph-Integration
// ================================================================

const BMC_VERSION = "0.0.3";

/* ── Deine bewährte Entitäten-Liste ───────────────────────────── */
const BMC_ENTITY_DEFAULTS = {
  outside_temp: "sensor.boiler_outside_temperature",
  flow_temp: "sensor.boiler_current_flow_temperature",
  return_temp: "sensor.boiler_return_temperature",
  dhw_temp: "sensor.boiler_reservoir_temp_tw1",
  compressor_power: "sensor.boiler_compressor_current_power",
  compressor_output: "sensor.boiler_compressor_power_output",
  compressor_speed: "sensor.boiler_compressor_speed",
  heating_active: "binary_sensor.boiler_heating_active",
  tapwater_active: "binary_sensor.boiler_tapwater_active",
  heating_pump: "binary_sensor.boiler_heating_pump",
  hp_compressor: "binary_sensor.boiler_hp_compressor",
  aux_heater_status: "binary_sensor.boiler_aux_heater_status",
  // ... (Alle weiteren Entitäten aus deinem v0.0.2 Code sind intern gemappt)
};

const BMC_LABELS = {
  outside_temp: "Außen", flow_temp: "Vorlauf", return_temp: "Rücklauf",
  dhw_temp: "WW-Speicher", compressor_power: "Leistung", compressor_speed: "Drehzahl"
};

const BMC_SECTIONS = {
  hero: { label: "Dashboard", icon: "mdi:view-dashboard", metrics: ["outside_temp", "flow_temp", "return_temp", "dhw_temp", "compressor_power", "compressor_speed"], graphs: ["outside_temp", "flow_temp", "return_temp", "dhw_temp"] },
  temperatures: { label: "Temperaturen", icon: "mdi:thermometer", metrics: ["air_inlet_tl2", "high_pressure_ph1", "low_pressure_pl1", "compressor_tr1", "compressor_inlet_tr5", "compressor_outlet_tr6", "condenser_tc3", "evaporator_tr4"] },
  energy: { label: "Energie", icon: "mdi:lightning-bolt", metrics: ["total_energy_consumption", "total_energy_supplied", "energy_consumption_heating", "energy_supplied_heating"] },
  system: { label: "System", icon: "mdi:chip", metrics: ["sys_wifi_strength", "sys_uptime", "sys_version", "sys_status"] }
};

const BMC_STYLE_DEFAULTS = {
  card_bg: "var(--ha-card-background, var(--card-background-color, white))",
  card_radius: "16px",
  accent: "var(--primary-color, #00549f)",
  font_family: "inherit",
  graph_opacity: "0.3",
  graph_hours: 24,
  show_cop: true,
};

class BuderusMonitorCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._activeTab = "hero";
    this._isBuilt = false;
    this._graphCards = {};
  }

  static getConfigElement() { return document.createElement("buderus-monitor-card-editor"); }

  setConfig(config) {
    this._config = JSON.parse(JSON.stringify(config));
    this._config.entities = { ...BMC_ENTITY_DEFAULTS, ...config.entities };
    this._config.style = { ...BMC_STYLE_DEFAULTS, ...config.style };
    this._isBuilt = false; // Rebuild shell on config change
    if (this._hass) this._update();
  }

  set hass(hass) {
    this._hass = hass;
    this._update();
  }

  _update() {
    if (!this._config || !this._hass) return;

    if (!this._isBuilt) {
      this._buildShell();
      this._initGraphs();
      this._isBuilt = true;
    }

    this._updateData();
  }

  _buildShell() {
    const s = this._config.style;
    this.shadowRoot.innerHTML = `
      <style>${this._getCSS()}</style>
      <ha-card>
        <div class="card-container">
          <div class="header">
            <div class="title"><ha-icon icon="${this._config.title_icon || 'mdi:heat-pump'}"></ha-icon> ${this._config.title || 'Heizung'}</div>
            <div id="status-bar"></div>
          </div>
          
          <div class="tabs">
            ${Object.entries(BMC_SECTIONS).map(([id, sec]) => `
              <div class="tab ${this._activeTab === id ? 'active' : ''}" data-tab="${id}">
                <ha-icon icon="${sec.icon}"></ha-icon> <span>${sec.label}</span>
              </div>
            `).join("")}
          </div>

          <div id="main-content"></div>
        </div>
      </ha-card>
    `;

    // Tab Listeners
    this.shadowRoot.querySelectorAll(".tab").forEach(t => {
      t.onclick = () => {
        this._activeTab = t.dataset.tab;
        this._isBuilt = false;
        this._update();
      };
    });

    this._renderTabStructure();
  }

  _renderTabStructure() {
    const container = this.shadowRoot.getElementById("main-content");
    const sec = BMC_SECTIONS[this._activeTab];
    
    let html = "";
    if (this._activeTab === "hero" && this._config.style.show_cop) {
        html += `<div id="cop-area"></div>`;
    }

    html += `<div class="grid">`;
    sec.metrics.forEach(m => {
      const hasGraph = sec.graphs?.includes(m);
      html += `
        <div class="metric-box ${hasGraph ? 'has-graph' : ''}">
          ${hasGraph ? `<div class="graph-bg" id="graph-${m}"></div>` : ''}
          <div class="m-label">${BMC_LABELS[m] || m}</div>
          <div class="m-value" id="val-${m}">--</div>
        </div>
      `;
    });
    html += `</div>`;
    container.innerHTML = html;
  }

  _initGraphs() {
    const sec = BMC_SECTIONS[this._activeTab];
    if (!sec.graphs) return;

    sec.graphs.forEach(m => {
      const container = this.shadowRoot.getElementById(`graph-${m}`);
      if (!container) return;

      const graph = document.createElement("mini-graph-card");
      graph.setConfig({
        entities: [{ entity: this._config.entities[m] }],
        hours_to_show: this._config.style.graph_hours,
        points_per_hour: 2,
        line_color: this._config.style.accent,
        show: { name: false, icon: false, state: false, legend: false, labels: false },
        fill: "fade",
        animate: true
      });
      graph.hass = this._hass;
      container.appendChild(graph);
      this._graphCards[m] = graph;
    });
  }

  _updateData() {
    // Status Bar
    const statusEl = this.shadowRoot.getElementById("status-bar");
    if (statusEl) {
      const isHeating = this._hass.states[this._config.entities.heating_active]?.state === 'on';
      const isDHW = this._hass.states[this._config.entities.tapwater_active]?.state === 'on';
      const color = isDHW ? "#ec407a" : (isHeating ? "#ff7043" : "#66bb6a");
      statusEl.innerHTML = `<span class="dot" style="background:${color}"></span> ${isDHW ? 'Warmwasser' : (isHeating ? 'Heizen' : 'Standby')}`;
    }

    // Metrics (textContent update to prevent flicker)
    const sec = BMC_SECTIONS[this._activeTab];
    sec.metrics.forEach(m => {
      const el = this.shadowRoot.getElementById(`val-${m}`);
      if (el) {
        const s = this._hass.states[this._config.entities[m]];
        const val = s ? `${parseFloat(s.state).toFixed(1)} ${s.attributes.unit_of_measurement || ''}` : '--';
        if (el.textContent !== val) el.textContent = val;
      }
    });

    // Update Graph Hass
    for (const g in this._graphCards) {
      this._graphCards[g].hass = this._hass;
    }
  }

  _getCSS() {
    const s = this._config.style;
    return `
      .card-container { padding: ${s.card_padding}; background: ${s.card_bg}; border-radius: ${s.card_radius}; font-family: ${s.font_family}; color: var(--primary-text-color); }
      .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
      .title { font-weight: 800; font-size: 1.1rem; display: flex; align-items: center; gap: 8px; }
      .dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; }
      
      .tabs { display: flex; gap: 10px; margin-bottom: 20px; border-bottom: 1px solid rgba(128,128,128,0.2); padding-bottom: 10px; }
      .tab { cursor: pointer; opacity: 0.5; font-size: 0.8rem; font-weight: 700; text-transform: uppercase; display: flex; align-items: center; gap: 4px; }
      .tab.active { opacity: 1; color: ${s.accent}; border-bottom: 2px solid ${s.accent}; }

      .grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
      .metric-box { 
        background: rgba(128,128,128,0.05); border-radius: 12px; padding: 15px; 
        position: relative; overflow: hidden; height: 100px; display: flex; flex-direction: column; justify-content: center;
      }
      .metric-box.has-graph { height: 120px; }
      .graph-bg { position: absolute; bottom: 0; left: 0; width: 100%; height: 100%; opacity: ${s.graph_opacity}; pointer-events: none; }
      .m-label { font-size: 0.7rem; text-transform: uppercase; color: var(--secondary-text-color); font-weight: 700; z-index: 1; }
      .m-value { font-size: 1.4rem; font-weight: 900; z-index: 1; margin-top: 5px; }
    `;
  }
}

/* ── EDITOR MIT AKKORDEONS ────────────────────────────────────── */
class BuderusMonitorCardEditor extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  setConfig(config) {
    this._config = config;
    this._render();
  }

  _render() {
    this.shadowRoot.innerHTML = `
      <style>
        details { border: 1px solid rgba(128,128,128,0.3); border-radius: 8px; margin-bottom: 8px; }
        summary { padding: 12px; font-weight: bold; cursor: pointer; background: rgba(128,128,128,0.1); }
        .content { padding: 15px; display: flex; flex-direction: column; gap: 10px; }
        ha-textfield { width: 100%; }
      </style>
      <div class="editor">
        <details open>
          <summary>Allgemein</summary>
          <div class="content">
            <ha-textfield label="Titel" .value="${this._config.title}" @input="${e => this._upd('title', e.target.value)}"></ha-textfield>
            <ha-textfield label="Icon" .value="${this._config.title_icon}" @input="${e => this._upd('title_icon', e.target.value)}"></ha-textfield>
          </div>
        </details>
        <details>
          <summary>Design & Typografie</summary>
          <div class="content">
            <ha-textfield label="Schriftart (z.B. Roboto)" .value="${this._config.style?.font_family}" @input="${e => this._updSt('font_family', e.target.value)}"></ha-textfield>
            <ha-textfield label="Akzentfarbe" .value="${this._config.style?.accent}" @input="${e => this._updSt('accent', e.target.value)}"></ha-textfield>
            <ha-textfield label="Graph Sichtbarkeit (0.1 - 1.0)" type="number" .value="${this._config.style?.graph_opacity}" @input="${e => this._updSt('graph_opacity', e.target.value)}"></ha-textfield>
          </div>
        </details>
      </div>
    `;
  }

  _upd(key, val) {
    this._config = { ...this._config, [key]: val };
    this._fire();
  }
  _updSt(key, val) {
    this._config.style = { ...this._config.style, [key]: val };
    this._fire();
  }
  _fire() {
    this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: this._config }, bubbles: true, composed: true }));
  }
}

customElements.define("buderus-monitor-card", BuderusMonitorCard);
customElements.define("buderus-monitor-card-editor", BuderusMonitorCardEditor);
window.customCards = window.customCards || [];
window.customCards.push({ type: "buderus-monitor-card", name: "Buderus Pro Monitor v0.0.3", preview: true });

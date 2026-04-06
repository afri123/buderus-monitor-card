// ================================================================
// Buderus Pro Monitor Card  v0.2.2
// ================================================================

const BMC_VERSION = "0.2.2";

const BMC_DEFAULTS = {
  title: "Heizung",
  title_icon: "mdi:heat-pump",
  graph_hours: 24,
  show_efficiency: true,
  show_diagnostics: true,
  style: {
    card_bg: "var(--ha-card-background, var(--card-background-color, #fff))",
    card_padding: "20px",
    accent_color: "#00549f", 
    color_heating: "#ff5722",
    color_dhw: "#e91e63",
    color_idle: "#4caf50",
    graph_opacity: "0.4"
  }
};

function _mergeConfig(config) {
  const out = JSON.parse(JSON.stringify(BMC_DEFAULTS));
  if (config) {
    Object.assign(out, config);
    if (config.style) Object.assign(out.style, config.style);
  }
  return out;
}

class BuderusMonitorCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._graphElements = {};
    this._isBuilt = false;
  }

  static getConfigElement() { return document.createElement("buderus-monitor-card-editor"); }

  setConfig(config) {
    this._config = _mergeConfig(config);
    if (this._hass) this._render();
  }

  set hass(hass) {
    this._hass = hass;
    this._render();
  }

  // Die zentrale Render-Funktion
  _render() {
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
<style>
  *, *::before, *::after { box-sizing: border-box; }
  .card { 
    background: ${s.card_bg}; padding: ${s.card_padding}; border-radius: 16px; 
    font-family: var(--paper-font-body1_-_font-family, sans-serif); 
    position: relative; overflow: hidden; 
  }
  .header { display: flex; justify-content: space-between; margin-bottom: 20px; border-bottom: 1px solid rgba(128,128,128,0.1); padding-bottom: 10px; }
  .title { font-weight: 800; font-size: 1.1rem; display: flex; align-items: center; gap: 8px; }
  
  .hero-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-bottom: 20px; }
  .metric-box { 
    background: rgba(128,128,128,0.05); border-radius: 12px; padding: 15px; 
    position: relative; overflow: hidden; display: flex; flex-direction: column; height: 95px;
    cursor: pointer;
  }
  .graph-container {
    position: absolute; bottom: 0; left: 0; width: 100%; height: 100%;
    opacity: ${s.graph_opacity}; pointer-events: none; z-index: 0;
  }
  .m-content { z-index: 1; position: relative; pointer-events: none; }
  .m-label { font-size: 0.7rem; text-transform: uppercase; color: var(--secondary-text-color); font-weight: 700; }
  .m-value { font-size: 1.3rem; font-weight: 900; margin-top: 4px; }

  .bar-section { margin: 15px 0; }
  .bar-label { display: flex; justify-content: space-between; font-size: 0.75rem; font-weight: 700; margin-bottom: 6px; }
  .track { height: 8px; background: rgba(128,128,128,0.1); border-radius: 4px; overflow: hidden; }
  .fill { height: 100%; transition: width 1s ease; background: ${s.accent_color}; }

  .diag-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
  .diag-item { text-align: center; background: rgba(128,128,128,0.03); padding: 10px; border-radius: 10px; }
  .diag-val { font-size: 0.9rem; font-weight: 700; display: block; }
  .diag-lbl { font-size: 0.6rem; color: var(--secondary-text-color); text-transform: uppercase; margin-top: 2px; }
  
  .status-dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; margin-right: 6px; }
</style>
<div class="card">
  <div class="header">
    <div class="title"><ha-icon icon="${this._config.title_icon}"></ha-icon> ${this._config.title}</div>
    <div id="status-text" style="font-size: 0.8rem; font-weight: 700;"></div>
  </div>
  <div class="hero-grid">
    ${this._renderHeroContainer('Aussen', 'sensor.boiler_outside_temperature')}
    ${this._renderHeroContainer('Vorlauf', 'sensor.boiler_current_flow_temperature')}
    ${this._renderHeroContainer('WW-Speicher', 'sensor.boiler_reservoir_temp_tw1')}
    ${this._renderHeroContainer('Leistung', 'sensor.boiler_compressor_current_power')}
  </div>
  <div id="eff-area" class="bar-section"></div>
  <div id="diag-area" class="diag-section"></div>
</div>`;

    this._ui = {
      status: this.shadowRoot.getElementById('status-text'),
      eff: this.shadowRoot.getElementById('eff-area'),
      diag: this.shadowRoot.getElementById('diag-area')
    };
  }

  _renderHeroContainer(label, entity) {
    return `
      <div class="metric-box" onclick="const ev = new CustomEvent('hass-more-info', {detail: {entityId: '${entity}'}, bubbles: true, composed: true}); this.dispatchEvent(ev);">
        <div class="graph-container" id="graph-container-${entity.replace(/\./g, '_')}"></div>
        <div class="m-content">
          <div class="m-label">${label}</div>
          <div class="m-value" id="val-${entity.replace(/\./g, '_')}">--</div>
        </div>
      </div>
    `;
  }

  _initGraphs() {
    const entities = [
      'sensor.boiler_outside_temperature', 
      'sensor.boiler_current_flow_temperature',
      'sensor.boiler_reservoir_temp_tw1',
      'sensor.boiler_compressor_current_power'
    ];

    entities.forEach(eid => {
      const containerId = `graph-container-${eid.replace(/\./g, '_')}`;
      const container = this.shadowRoot.getElementById(containerId);
      if (!container) return;

      const graphCard = document.createElement('mini-graph-card');
      graphCard.setConfig({
        entities: [{ entity: eid }],
        hours_to_show: this._config.graph_hours,
        points_per_hour: 2,
        line_color: this._config.style.accent_color,
        line_width: 3,
        font_size: 10,
        hide_header: true,
        hide_legend: true,
        hide_state: true,
        fill: 'fade',
        animate: true
      });
      graphCard.hass = this._hass;
      container.appendChild(graphCard);
      this._graphElements[eid] = graphCard;
    });
  }

  _updateData() {
    // Update Graphs und Textwerte
    for (const [eid, element] of Object.entries(this._graphElements)) {
      const state = this._hass.states[eid];
      if (state) {
        element.hass = this._hass;
        const valEl = this.shadowRoot.getElementById(`val-${eid.replace(/\./g, '_')}`);
        if (valEl) valEl.textContent = `${parseFloat(state.state).toFixed(1)} ${state.attributes.unit_of_measurement || ''}`;
      }
    }

    // Status Logik
    const isHeating = this._hass.states['binary_sensor.boiler_heating_active']?.state === 'on';
    const isDHW = this._hass.states['binary_sensor.boiler_tapwater_active']?.state === 'on';
    const color = isDHW ? this._config.style.color_dhw : (isHeating ? this._config.style.color_heating : this._config.style.color_idle);
    const text = isDHW ? 'Warmwasser' : (isHeating ? 'Heizbetrieb' : 'Standby');
    
    this._ui.status.style.color = color;
    this._ui.status.innerHTML = `<span class="status-dot" style="background:${color}"></span>${text}`;

    // Effizienz (COP)
    if (this._config.show_efficiency) {
      const heatPower = parseFloat(this._hass.states['sensor.boiler_compressor_power_output']?.state || 0);
      const elecPower = parseFloat(this._hass.states['sensor.boiler_compressor_current_power']?.state || 0);
      const cop = elecPower > 100 ? (heatPower / elecPower).toFixed(2) : "0.0";
      this._ui.eff.innerHTML = `
        <div class="bar-label"><span>Aktuelle Effizienz (COP)</span><span>${cop}</span></div>
        <div class="track"><div class="fill" style="width: ${Math.min(parseFloat(cop)*20, 100)}%;"></div></div>
      `;
    }

    // Diagnose Grid
    if (this._config.show_diagnostics) {
      const flow = parseFloat(this._hass.states['sensor.boiler_current_flow_temperature']?.state || 0);
      const ret = parseFloat(this._hass.states['sensor.boiler_return_temperature']?.state || 0);
      const delta = (flow - ret).toFixed(1);
      const mod = this._hass.states['sensor.boiler_compressor_speed']?.state || '0';
      const starts = this._hass.states['sensor.boiler_compressor_control_starts']?.state || '--';
      this._ui.diag.innerHTML = `
        <div class="diag-grid">
          <div class="diag-item"><span class="diag-val">${delta} K</span><span class="diag-lbl">Spreizung</span></div>
          <div class="diag-item"><span class="diag-val">${mod} %</span><span class="diag-lbl">Modulation</span></div>
          <div class="diag-item"><span class="diag-val">${starts}</span><span class="diag-lbl">Starts</span></div>
        </div>
      `;
    }
  }

  getCardSize() { return 4; }
}

// ── EDITOR (ACCORDION) ──────────────────────────────────────────
class BuderusMonitorCardEditor extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  setConfig(config) {
    this._config = _mergeConfig(config);
    this._render();
  }

  _render() {
    this.shadowRoot.innerHTML = `
<style>
  details { 
    border: 1px solid rgba(128,128,128,0.2); border-radius: 12px; 
    margin-bottom: 12px; background: var(--card-background-color); overflow: hidden;
  }
  summary { 
    padding: 15px; font-weight: bold; cursor: pointer; display: flex; 
    justify-content: space-between; align-items: center; background: rgba(128,128,128,0.05);
  }
  .content { padding: 15px; display: flex; flex-direction: column; gap: 12px; }
  ha-textfield, ha-switch { width: 100%; }
</style>

<details open>
  <summary>Allgemein <ha-icon icon="mdi:cog"></ha-icon></summary>
  <div class="content">
    <ha-textfield label="Titel" .value="${this._config.title}" @input="${e => this._update('title', e.target.value)}"></ha-textfield>
    <ha-textfield label="History (Stunden)" type="number" .value="${this._config.graph_hours}" @input="${e => this._update('graph_hours', e.target.value)}"></ha-textfield>
  </div>
</details>

<details>
  <summary>Anzeige <ha-icon icon="mdi:eye"></ha-icon></summary>
  <div class="content">
    <div style="display:flex; justify-content:space-between;"><span>COP Balken</span><ha-switch .checked="${this._config.show_efficiency}" @change="${e => this._update('show_efficiency', e.target.checked)}"></ha-switch></div>
    <div style="display:flex; justify-content:space-between;"><span>Diagnose Grid</span><ha-switch .checked="${this._config.show_diagnostics}" @change="${e => this._update('show_diagnostics', e.target.checked)}"></ha-switch></div>
  </div>
</details>

<details>
  <summary>Styling <ha-icon icon="mdi:palette"></ha-icon></summary>
  <div class="content">
    <ha-textfield label="Akzentfarbe" .value="${this._config.style.accent_color}" @input="${e => this._updateStyle('accent_color', e.target.value)}"></ha-textfield>
    <ha-textfield label="Graph Sichtbarkeit (0.1-1.0)" .value="${this._config.style.graph_opacity}" @input="${e => this._updateStyle('graph_opacity', e.target.value)}"></ha-textfield>
  </div>
</details>
    `;
  }

  _update(key, value) {
    this._config = { ...this._config, [key]: value };
    this._fire();
  }

  _updateStyle(key, value) {
    this._config.style = { ...this._config.style, [key]: value };
    this._fire();
  }

  _fire() {
    this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: this._config }, bubbles: true, composed: true }));
  }
}

customElements.define("buderus-monitor-card", BuderusMonitorCard);
customElements.define("buderus-monitor-card-editor", BuderusMonitorCardEditor);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "buderus-monitor-card",
  name: "Buderus Pro Monitor",
  description: "Heatpump Dashboard mit mini-graph-cards im Hintergrund."
});

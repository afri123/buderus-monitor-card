// ================================================================
// Buderus Pro Monitor Card  v0.2.3 - "The Clean One"
// ================================================================

const BMC_VERSION = "0.2.3";

const BMC_DEFAULTS = {
  title: "Heizung",
  title_icon: "mdi:heat-pump",
  graph_hours: 24,
  show_efficiency: true,
  show_diagnostics: true,
  style: {
    card_bg: "var(--ha-card-background, var(--card-background-color, #fff))",
    card_padding: "24px",
    accent_color: "#00549f", 
    color_heating: "#ff5722",
    color_dhw: "#e91e63",
    color_idle: "#4caf50",
    graph_opacity: "0.3",
    value_size: "1.6rem"
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
    if (this._isBuilt) {
      this._updateStyles(); // Update CSS without rebuilding
      this._initGraphs();   // Re-init graphs if hours changed
    }
    if (this._hass) this._render();
  }

  set hass(hass) {
    this._hass = hass;
    this._render();
  }

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
    this.shadowRoot.innerHTML = `
<style id="main-style"></style>
<div class="card">
  <div class="header">
    <div class="title"><ha-icon id="title-icon"></ha-icon> <span id="title-text"></span></div>
    <div id="status-text"></div>
  </div>
  <div class="hero-grid">
    ${this._renderHeroContainer('Außentemperatur', 'sensor.boiler_outside_temperature')}
    ${this._renderHeroContainer('Vorlauftemperatur', 'sensor.boiler_current_flow_temperature')}
    ${this._renderHeroContainer('WW-Speichertemp', 'sensor.boiler_reservoir_temp_tw1')}
    ${this._renderHeroContainer('Akt. Leistung', 'sensor.boiler_compressor_current_power')}
  </div>
  <div id="eff-area" class="bar-section"></div>
  <div id="diag-area" class="diag-section"></div>
</div>`;

    this._updateStyles();
    
    this._ui = {
      status: this.shadowRoot.getElementById('status-text'),
      eff: this.shadowRoot.getElementById('eff-area'),
      diag: this.shadowRoot.getElementById('diag-area'),
      titleTxt: this.shadowRoot.getElementById('title-text'),
      titleIco: this.shadowRoot.getElementById('title-icon')
    };
  }

  _updateStyles() {
    const s = this._config.style;
    const styleEl = this.shadowRoot.getElementById('main-style');
    if (!styleEl) return;

    styleEl.textContent = `
      *, *::before, *::after { box-sizing: border-box; }
      .card { 
        background: ${s.card_bg}; padding: ${s.card_padding}; border-radius: 20px; 
        font-family: var(--paper-font-body1_-_font-family, sans-serif); 
        position: relative; overflow: hidden; transition: all 0.3s ease;
      }
      .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; border-bottom: 1px solid rgba(128,128,128,0.1); padding-bottom: 12px; }
      .title { font-weight: 800; font-size: 1.2rem; display: flex; align-items: center; gap: 10px; color: var(--primary-text-color); }
      
      .hero-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-bottom: 25px; }
      .metric-box { 
        background: rgba(128,128,128,0.06); border-radius: 15px; padding: 20px; 
        position: relative; overflow: hidden; display: flex; flex-direction: column; justify-content: space-between;
        height: 130px; cursor: pointer; border: 1px solid rgba(128,128,128,0.05);
        transition: transform 0.2s ease;
      }
      .metric-box:hover { transform: translateY(-2px); background: rgba(128,128,128,0.09); }
      
      .graph-container {
        position: absolute; bottom: 0; left: 0; width: 100%; height: 100%;
        opacity: ${s.graph_opacity}; pointer-events: none; z-index: 0;
      }
      .m-content { z-index: 1; position: relative; pointer-events: none; }
      .m-label { font-size: 0.75rem; text-transform: uppercase; color: var(--secondary-text-color); font-weight: 800; letter-spacing: 0.8px; }
      .m-value { font-size: ${s.value_size}; font-weight: 900; margin-top: 8px; color: var(--primary-text-color); letter-spacing: -0.5px; }

      .bar-section { margin: 20px 0; }
      .bar-label { display: flex; justify-content: space-between; font-size: 0.85rem; font-weight: 800; margin-bottom: 8px; color: var(--secondary-text-color); }
      .track { height: 10px; background: rgba(128,128,128,0.1); border-radius: 5px; overflow: hidden; }
      .fill { height: 100%; transition: width 1s ease; background: ${s.accent_color}; box-shadow: 0 0 10px ${s.accent_color}44; }

      .diag-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
      .diag-item { text-align: center; background: rgba(128,128,128,0.04); padding: 15px 10px; border-radius: 12px; }
      .diag-val { font-size: 1rem; font-weight: 800; display: block; color: var(--primary-text-color); }
      .diag-lbl { font-size: 0.65rem; color: var(--secondary-text-color); text-transform: uppercase; margin-top: 5px; font-weight: 700; letter-spacing: 0.5px; }
      
      .status-dot { width: 10px; height: 10px; border-radius: 50%; display: inline-block; margin-right: 8px; }
    `;
  }

  _renderHeroContainer(label, entity) {
    const safeId = entity.replace(/\./g, '_');
    return `
      <div class="metric-box" onclick="const ev = new CustomEvent('hass-more-info', {detail: {entityId: '${entity}'}, bubbles: true, composed: true}); this.dispatchEvent(ev);">
        <div class="graph-container" id="graph-container-${safeId}"></div>
        <div class="m-content">
          <div class="m-label">${label}</div>
          <div class="m-value" id="val-${safeId}">--</div>
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
      const safeId = eid.replace(/\./g, '_');
      const container = this.shadowRoot.getElementById(`graph-container-${safeId}`);
      if (!container) return;

      container.innerHTML = ""; // Clear for re-init
      const graphCard = document.createElement('mini-graph-card');
      graphCard.setConfig({
        entities: [{ entity: eid }],
        hours_to_show: parseInt(this._config.graph_hours),
        points_per_hour: 4,
        line_color: this._config.style.accent_color,
        line_width: 3,
        font_size: 10,
        animate: true,
        fill: 'fade',
        show: {
          name: false,
          state: false,
          legend: false,
          icon: false,
          labels: false,
          extrema: false
        }
      });
      graphCard.hass = this._hass;
      container.appendChild(graphCard);
      this._graphElements[eid] = graphCard;
    });
  }

  _updateData() {
    this._ui.titleTxt.textContent = this._config.title;
    this._ui.titleIco.icon = this._config.title_icon;

    for (const [eid, element] of Object.entries(this._graphElements)) {
      const state = this._hass.states[eid];
      if (state) {
        element.hass = this._hass;
        const valEl = this.shadowRoot.getElementById(`val-${eid.replace(/\./g, '_')}`);
        if (valEl) valEl.textContent = `${parseFloat(state.state).toFixed(1)} ${state.attributes.unit_of_measurement || ''}`;
      }
    }

    const isHeating = this._hass.states['binary_sensor.boiler_heating_active']?.state === 'on';
    const isDHW = this._hass.states['binary_sensor.boiler_tapwater_active']?.state === 'on';
    const color = isDHW ? this._config.style.color_dhw : (isHeating ? this._config.style.color_heating : this._config.style.color_idle);
    const text = isDHW ? 'Warmwasser' : (isHeating ? 'Heizbetrieb' : 'Standby');
    
    this._ui.status.style.color = color;
    this._ui.status.innerHTML = `<span class="status-dot" style="background:${color}"></span>${text}`;

    if (this._config.show_efficiency) {
      const heatPower = parseFloat(this._hass.states['sensor.boiler_compressor_power_output']?.state || 0);
      const elecPower = parseFloat(this._hass.states['sensor.boiler_compressor_current_power']?.state || 0);
      const cop = elecPower > 100 ? (heatPower / elecPower).toFixed(2) : "0.0";
      this._ui.eff.innerHTML = `
        <div class="bar-label"><span>Aktuelle Effizienz (COP)</span><span>${cop}</span></div>
        <div class="track"><div class="fill" style="width: ${Math.min(parseFloat(cop)*20, 100)}%;"></div></div>
      `;
    } else { this._ui.eff.innerHTML = ""; }

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
    } else { this._ui.diag.innerHTML = ""; }
  }

  getCardSize() { return 5; }
}

// ── EDITOR ──────────────────────────────────────────────────────
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
    margin-bottom: 12px; background: var(--card-background-color, #fff); overflow: hidden;
  }
  summary { 
    padding: 15px; font-weight: bold; cursor: pointer; display: flex; 
    justify-content: space-between; align-items: center; background: rgba(128,128,128,0.05);
  }
  .content { padding: 18px; display: flex; flex-direction: column; gap: 15px; }
  ha-textfield, ha-switch { width: 100%; }
  .row { display: flex; justify-content: space-between; align-items: center; }
</style>

<details open>
  <summary>Allgemein <ha-icon icon="mdi:cog"></ha-icon></summary>
  <div class="content">
    <ha-textfield label="Kartentitel" .value="${this._config.title}" @input="${e => this._upd('title', e.target.value)}"></ha-textfield>
    <ha-textfield label="Titel Icon" .value="${this._config.title_icon}" @input="${e => this._upd('title_icon', e.target.value)}"></ha-textfield>
    <ha-textfield label="Graph Stunden" type="number" .value="${this._config.graph_hours}" @input="${e => this._upd('graph_hours', e.target.value)}"></ha-textfield>
  </div>
</details>

<details>
  <summary>Anzeige <ha-icon icon="mdi:eye"></ha-icon></summary>
  <div class="content">
    <div class="row"><span>COP Effizienz-Balken</span><ha-switch .checked="${this._config.show_efficiency}" @change="${e => this._upd('show_efficiency', e.target.checked)}"></ha-switch></div>
    <div class="row"><span>Diagnose Raster (Starts/Mod)</span><ha-switch .checked="${this._config.show_diagnostics}" @change="${e => this._upd('show_diagnostics', e.target.checked)}"></ha-switch></div>
  </div>
</details>

<details>
  <summary>Styling & Design <ha-icon icon="mdi:palette"></ha-icon></summary>
  <div class="content">
    <ha-textfield label="Akzentfarbe (Graphen/COP)" .value="${this._config.style.accent_color}" @input="${e => this._updSt('accent_color', e.target.value)}"></ha-textfield>
    <ha-textfield label="Graph Deckkraft (0.1 - 1.0)" .value="${this._config.style.graph_opacity}" @input="${e => this._updSt('graph_opacity', e.target.value)}"></ha-textfield>
    <ha-textfield label="Schriftgröße Werte" .value="${this._config.style.value_size}" @input="${e => this._updSt('value_size', e.target.value)}"></ha-textfield>
    <ha-textfield label="Karten-Hintergrund" .value="${this._config.style.card_bg}" @input="${e => this._updSt('card_bg', e.target.value)}"></ha-textfield>
    <ha-textfield label="Farbe Heizen" .value="${this._config.style.color_heating}" @input="${e => this._updSt('color_heating', e.target.value)}"></ha-textfield>
    <ha-textfield label="Farbe Warmwasser" .value="${this._config.style.color_dhw}" @input="${e => this._updSt('color_dhw', e.target.value)}"></ha-textfield>
  </div>
</details>
    `;
  }

  _upd(key, value) {
    this._config = { ...this._config, [key]: value };
    this._fire();
  }

  _updSt(key, value) {
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
  name: "Buderus Pro Monitor v0.2.3",
  description: "Heatpump Dashboard mit sauberer Hero-Sektion und Graphen."
});

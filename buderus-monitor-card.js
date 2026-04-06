// ================================================================
// Buderus Pro Monitor Card  v0.2.0
// ================================================================

const BMC_VERSION = "0.2.0";

const BMC_DEFAULTS = {
  title: "Buderus WLW196i Pro",
  title_icon: "mdi:heat-pump",
  graph_hours: 24,
  show_graphs: true,
  show_efficiency: true,
  show_diagnostics: true,
  style: {
    card_bg: "var(--ha-card-background, var(--card-background-color, #fff))",
    card_padding: "20px",
    accent_color: "#00549f", // Buderus Blau
    color_heating: "#ff5722",
    color_dhw: "#e91e63",
    color_cooling: "#03a9f4",
    color_idle: "#4caf50",
    graph_color: "rgba(128,128,128,0.2)",
    font_family: "var(--paper-font-body1_-_font-family, sans-serif)"
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
    this._history = {};
  }

  static getConfigElement() { return document.createElement("buderus-monitor-card-editor"); }

  setConfig(config) {
    this._config = _mergeConfig(config);
    this._render();
  }

  set hass(hass) {
    const oldHass = this._hass;
    this._hass = hass;
    this._updateData(oldHass);
  }

  // ── HISTORY FETCHING ──────────────────────────────────────────
  async _fetchHistory(entityId) {
    if (!this._hass || !entityId) return;
    const end = new Date();
    const start = new Date(end.getTime() - this._config.graph_hours * 60 * 60 * 1000);
    
    try {
      const result = await this._hass.callApi(
        "GET",
        `history/period/${ Luxembourg = start.toISOString()}?filter_entity_id=${entityId}&end_time=${end.toISOString()}`
      );
      if (result && result[0]) {
        this._history[entityId] = result[0]
          .map(state => parseFloat(state.state))
          .filter(val => !isNaN(val));
        this._updateGraphs();
      }
    } catch (e) { console.error("Error fetching history", e); }
  }

  _buildShell() {
    const s = this._config.style;
    this.shadowRoot.innerHTML = `
<style>
  :host { display: block; --accent: ${s.accent_color}; }
  .card { background: ${s.card_bg}; padding: ${s.card_padding}; border-radius: 16px; font-family: ${s.font_family}; position: relative; overflow: hidden; }
  
  .header { display: flex; justify-content: space-between; margin-bottom: 20px; border-bottom: 1px solid rgba(128,128,128,0.1); padding-bottom: 10px; }
  .title { font-weight: 800; font-size: 1.1rem; display: flex; align-items: center; gap: 8px; }
  
  /* Hero Grid with Graphs */
  .hero-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-bottom: 20px; }
  .metric-box { 
    background: rgba(128,128,128,0.05); border-radius: 12px; padding: 15px; 
    position: relative; overflow: hidden; display: flex; flex-direction: column;
  }
  .metric-box svg { position: absolute; bottom: 0; left: 0; width: 100%; height: 40px; pointer-events: none; }
  .m-label { font-size: 0.7rem; text-transform: uppercase; color: var(--secondary-text-color); font-weight: 700; z-index: 1; }
  .m-value { font-size: 1.4rem; font-weight: 900; z-index: 1; }

  /* Efficiency Section */
  .eff-bar { margin: 20px 0; }
  .bar-label { display: flex; justify-content: space-between; font-size: 0.75rem; font-weight: 700; margin-bottom: 5px; }
  .track { height: 8px; background: rgba(128,128,128,0.1); border-radius: 4px; overflow: hidden; }
  .fill { height: 100%; transition: width 1s ease; }

  /* Diagnostics */
  .diag-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-top: 15px; }
  .diag-item { text-align: center; background: rgba(128,128,128,0.03); padding: 8px; border-radius: 8px; }
  .diag-val { font-size: 0.9rem; font-weight: 700; display: block; }
  .diag-lbl { font-size: 0.6rem; color: var(--secondary-text-color); text-transform: uppercase; }

  .status-dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; margin-right: 5px; }
</style>
<div class="card">
  <div class="header">
    <div class="title"><ha-icon icon="${this._config.title_icon}"></ha-icon> ${this._config.title}</div>
    <div id="status-text" style="font-size: 0.8rem; font-weight: 700;"></div>
  </div>
  <div class="hero-grid">
    ${this._renderMetricBox('Aussen', 'sensor.boiler_outside_temperature', '°C')}
    ${this._renderMetricBox('Vorlauf', 'sensor.boiler_current_flow_temperature', '°C')}
    ${this._renderMetricBox('WW-Speicher', 'sensor.boiler_reservoir_temp_tw1', '°C')}
    ${this._renderMetricBox('Leistung', 'sensor.boiler_compressor_current_power', 'W')}
  </div>
  <div id="eff-area"></div>
  <div id="diag-area"></div>
</div>
    `;
  }

  _renderMetricBox(label, entity, unit) {
    return `
      <div class="metric-box" onclick="const ev = new CustomEvent('hass-more-info', {detail: {entityId: '${entity}'}, bubbles: true, composed: true}); this.dispatchEvent(ev);">
        <span class="m-label">${label}</span>
        <span class="m-value" id="val-${entity}">--</span>
        <svg id="graph-${entity}" viewBox="0 0 100 40" preserveAspectRatio="none">
          <path d="" fill="none" stroke="${this._config.style.graph_color}" stroke-width="2" vector-effect="non-scaling-stroke"></path>
        </svg>
      </div>
    `;
  }

  _updateData(oldHass) {
    if (!this._hass) return;
    if (!this.shadowRoot.innerHTML) this._buildShell();

    const entities = [
      'sensor.boiler_outside_temperature', 
      'sensor.boiler_current_flow_temperature',
      'sensor.boiler_reservoir_temp_tw1',
      'sensor.boiler_compressor_current_power'
    ];

    entities.forEach(eid => {
      const state = this._hass.states[eid];
      if (state) {
        const valEl = this.shadowRoot.getElementById(`val-${eid}`);
        const val = parseFloat(state.state).toFixed(1);
        if (valEl && valEl.textContent !== val) {
          valEl.textContent = `${val}${state.attributes.unit_of_measurement || ''}`;
          // Fetch history if not present or hours changed
          if (!this._history[eid]) this._fetchHistory(eid);
        }
      }
    });

    this._updateStatus();
    if (this._config.show_efficiency) this._updateEfficiency();
    if (this._config.show_diagnostics) this._updateDiagnostics();
  }

  _updateStatus() {
    const isHeating = this._hass.states['binary_sensor.boiler_heating_active']?.state === 'on';
    const isDHW = this._hass.states['binary_sensor.boiler_tapwater_active']?.state === 'on';
    const color = isDHW ? this._config.style.color_dhw : (isHeating ? this._config.style.color_heating : this._config.style.color_idle);
    const text = isDHW ? 'Warmwasser' : (isHeating ? 'Heizbetrieb' : 'Standby');
    
    const stEl = this.shadowRoot.getElementById('status-text');
    stEl.style.color = color;
    stEl.innerHTML = `<span class="status-dot" style="background:${color}"></span>${text}`;
  }

  _updateEfficiency() {
    const heatPower = parseFloat(this._hass.states['sensor.boiler_compressor_power_output']?.state || 0);
    const elecPower = parseFloat(this._hass.states['sensor.boiler_compressor_current_power']?.state || 0);
    const cop = elecPower > 100 ? (heatPower / elecPower).toFixed(2) : "0.0";
    
    const area = this.shadowRoot.getElementById('eff-area');
    area.innerHTML = `
      <div class="eff-bar">
        <div class="bar-label"><span>Aktuelle Effizienz (COP)</span><span>${cop}</span></div>
        <div class="track"><div class="fill" style="width: ${Math.min(parseFloat(cop)*20, 100)}%; background: ${this._config.style.accent_color}"></div></div>
      </div>
    `;
  }

  _updateDiagnostics() {
    const flow = parseFloat(this._hass.states['sensor.boiler_current_flow_temperature']?.state || 0);
    const ret = parseFloat(this._hass.states['sensor.boiler_return_temperature']?.state || 0);
    const delta = (flow - ret).toFixed(1);
    const starts = this._hass.states['sensor.boiler_compressor_control_starts']?.state || '--';
    const modulation = this._hass.states['sensor.boiler_compressor_speed']?.state || '0';

    const area = this.shadowRoot.getElementById('diag-area');
    area.innerHTML = `
      <div class="diag-grid">
        <div class="diag-item"><span class="diag-val">${delta} K</span><span class="diag-lbl">Spreizung</span></div>
        <div class="diag-item"><span class="diag-val">${modulation} %</span><span class="diag-lbl">Modulation</span></div>
        <div class="diag-item"><span class="diag-val">${starts}</span><span class="diag-lbl">Starts</span></div>
      </div>
    `;
  }

  _updateGraphs() {
    Object.keys(this._history).forEach(eid => {
      const data = this._history[eid];
      const svgPath = this.shadowRoot.querySelector(`#graph-${eid.replace(/\./g, '\\.')} path`);
      if (!svgPath || !data.length) return;

      const min = Math.min(...data);
      const max = Math.max(...data);
      const range = max - min || 1;
      
      const points = data.map((val, i) => {
        const x = (i / (data.length - 1)) * 100;
        const y = 40 - ((val - min) / range) * 35; // 5px padding top
        return `${x},${y}`;
      }).join(' L ');

      svgPath.setAttribute('d', `M ${points}`);
    });
  }
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
  details { border: 1px solid rgba(128,128,128,0.2); border-radius: 8px; margin-bottom: 10px; background: var(--card-background-color); }
  summary { padding: 12px; font-weight: bold; cursor: pointer; display: flex; justify-content: space-between; }
  .content { padding: 15px; display: flex; flex-direction: column; gap: 10px; }
  ha-textfield, ha-switch { width: 100%; }
</style>
<details open>
  <summary>Allgemein <ha-icon icon="mdi:chevron-down"></ha-icon></summary>
  <div class="content">
    <ha-textfield label="Titel" .value="${this._config.title}" @input="${e => this._updateConfig('title', e.target.value)}"></ha-textfield>
    <ha-textfield label="Graph Stunden (History)" type="number" .value="${this._config.graph_hours}" @input="${e => this._updateConfig('graph_hours', e.target.value)}"></ha-textfield>
  </div>
</details>
<details>
  <summary>Anzeige-Optionen <ha-icon icon="mdi:eye"></ha-icon></summary>
  <div class="content">
    <ha-formfield label="Effizienz-Balken anzeigen"><ha-switch .checked="${this._config.show_efficiency}" @change="${e => this._updateConfig('show_efficiency', e.target.checked)}"></ha-switch></ha-formfield>
    <ha-formfield label="Diagnose-Werte anzeigen"><ha-switch .checked="${this._config.show_diagnostics}" @change="${e => this._updateConfig('show_diagnostics', e.target.checked)}"></ha-switch></ha-formfield>
  </div>
</details>
<details>
  <summary>Styling <ha-icon icon="mdi:palette"></ha-icon></summary>
  <div class="content">
    <ha-textfield label="Hauptfarbe (Blau)" .value="${this._config.style.accent_color}" @input="${e => this._updateStyle('accent_color', e.target.value)}"></ha-textfield>
    <ha-textfield label="Graph-Farbe" .value="${this._config.style.graph_color}" @input="${e => this._updateStyle('graph_color', e.target.value)}"></ha-textfield>
    <ha-textfield label="Farbe Heizen" .value="${this._config.style.color_heating}" @input="${e => this._updateStyle('color_heating', e.target.value)}"></ha-textfield>
  </div>
</details>
    `;
  }

  _updateConfig(key, value) {
    this._config = { ...this._config, [key]: value };
    this._fireConfigChanged();
  }

  _updateStyle(key, value) {
    this._config.style = { ...this._config.style, [key]: value };
    this._fireConfigChanged();
  }

  _fireConfigChanged() {
    const ev = new CustomEvent("config-changed", { detail: { config: this._config }, bubbles: true, composed: true });
    this.dispatchEvent(ev);
  }
}

customElements.define("buderus-monitor-card", BuderusMonitorCard);
customElements.define("buderus-monitor-card-editor", BuderusMonitorCardEditor);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "buderus-monitor-card",
  name: "Buderus Pro Monitor",
  description: "High-End Monitoring für Buderus Wärmepumpen mit Graphen und Diagnose."
});

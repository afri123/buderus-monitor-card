// ================================================================
// Buderus Pro Monitor Card  v0.2.1
// ================================================================

const BMC_VERSION = "0.2.1";

const BMC_DEFAULTS = {
  title: "Buderus WLW196i Pro",
  title_icon: "mdi:heat-pump",
  graph_hours: 24,
  style: {
    card_bg: "var(--ha-card-background, var(--card-background-color, #fff))",
    card_padding: "20px",
    accent_color: "#00549f", 
    color_heating: "#ff5722",
    color_dhw: "#e91e63",
    color_idle: "#4caf50",
    graph_opacity: "0.4",
    font_family: "inherit"
  },
  show_efficiency: true,
  show_diagnostics: true
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
  }

  static getConfigElement() { return document.createElement("buderus-monitor-card-editor"); }

  setConfig(config) {
    this._config = _mergeConfig(config);
    this._rendered = false;
    if (this._hass) this._paint();
  }

  set hass(hass) {
    this._hass = hass;
    this._paint();
  }

  _paint() {
    if (!this._config || !this._hass) return;
    if (!this._rendered) { 
      this._buildShell(); 
      this._initGraphs();
      this._rendered = true; 
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
    font-family: ${s.font_family}; position: relative; overflow: hidden; 
  }
  .header { display: flex; justify-content: space-between; margin-bottom: 20px; border-bottom: 1px solid rgba(128,128,128,0.1); padding-bottom: 10px; }
  .title { font-weight: 800; font-size: 1.1rem; display: flex; align-items: center; gap: 8px; }
  
  .hero-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-bottom: 20px; }
  .metric-box { 
    background: rgba(128,128,128,0.05); border-radius: 12px; padding: 15px; 
    position: relative; overflow: hidden; display: flex; flex-direction: column; height: 90px;
    cursor: pointer;
  }
  /* Container für die Mini-Graph-Card */
  .graph-container {
    position: absolute; bottom: 0; left: 0; width: 100%; height: 100%;
    opacity: ${s.graph_opacity}; pointer-events: none; z-index: 0;
  }
  .m-content { z-index: 1; position: relative; pointer-events: none; }
  .m-label { font-size: 0.7rem; text-transform: uppercase; color: var(--secondary-text-color); font-weight: 700; }
  .m-value { font-size: 1.4rem; font-weight: 900; margin-top: 5px; }

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
  }

  _renderHeroContainer(label, entity) {
    return `
      <div class="metric-box" onclick="const ev = new CustomEvent('hass-more-info', {detail: {entityId: '${entity}'}, bubbles: true, composed: true}); this.dispatchEvent(ev);">
        <div class="graph-container" id="container-${entity}"></div>
        <div class="m-content">
          <div class="m-label">${label}</div>
          <div class="m-value" id="val-${entity}">--</div>
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
      const container = this.shadowRoot.getElementById(`container-${eid}`);
      if (!container) return;

      // Erstelle mini-graph-card Element
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
    const entities = Object.keys(this._graphElements);
    entities.forEach(eid => {
      const state = this._hass.states[eid];
      if (state) {
        // Update Graph Hass
        this._graphElements[eid].hass = this._hass;
        // Update Text Value
        const valEl = this.shadowRoot.getElementById(`val-${eid}`);
        const val = parseFloat(state.state).toFixed(1);
        valEl.textContent = `${val} ${state.attributes.unit_of_measurement || ''}`;
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
      <div class="bar-label"><span>Momentaner COP</span><span>${cop}</span></div>
      <div class="track"><div class="fill" style="width: ${Math.min(parseFloat(cop)*20, 100)}%;"></div></div>
    `;
  }

  _updateDiagnostics() {
    const flow = parseFloat(this._hass.states['sensor.boiler_current_flow_temperature']?.state || 0);
    const ret = parseFloat(this._hass.states['sensor.boiler_return_temperature']?.state || 0);
    const delta = (flow - ret).toFixed(1);
    const modulation = this._hass.states['sensor.boiler_compressor_speed']?.state || '0';
    const starts = this._hass.states['sensor.boiler_compressor_control_starts']?.state || '--';

    const area = this.shadowRoot.getElementById('diag-area');
    area.innerHTML = `
      <div class="diag-grid">
        <div class="diag-item"><span class="diag-val">${delta} K</span><span class="diag-lbl">Spreizung</span></div>
        <div class="diag-item"><span class="diag-val">${modulation} %</span><span class="diag-lbl">Modulation</span></div>
        <div class="diag-item"><span class="diag-val">${starts}</span><span class="diag-lbl">Starts</span></div>
      </div>
    `;
  }

  getCardSize() { return 4; }
}

// ── EDITOR (ACCORDION STYLE) ────────────────────────────────────
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
  .label { font-size: 0.9rem; margin-bottom: 5px; display: block; }
</style>

<details open>
  <summary>Allgemeine Einstellungen <ha-icon icon="mdi:cog"></ha-icon></summary>
  <div class="content">
    <ha-textfield label="Titel" .value="${this._config.title}" @input="${e => this._updateConfig('title', e.target.value)}"></ha-textfield>
    <ha-textfield label="Titel Icon" .value="${this._config.title_icon}" @input="${e => this._updateConfig('title_icon', e.target.value)}"></ha-textfield>
    <ha-textfield label="Graph Historie (Stunden)" type="number" .value="${this._config.graph_hours}" @input="${e => this._updateConfig('graph_hours', e.target.value)}"></ha-textfield>
  </div>
</details>

<details>
  <summary>Anzeige-Elemente <ha-icon icon="mdi:eye"></ha-icon></summary>
  <div class="content">
    <div style="display:flex; justify-content: space-between; align-items: center;">
      <span class="label">Effizienz-Balken (COP)</span>
      <ha-switch .checked="${this._config.show_efficiency}" @change="${e => this._updateConfig('show_efficiency', e.target.checked)}"></ha-switch>
    </div>
    <div style="display:flex; justify-content: space-between; align-items: center;">
      <span class="label">Diagnose-Raster</span>
      <ha-switch .checked="${this._config.show_diagnostics}" @change="${e => this._updateConfig('show_diagnostics', e.target.checked)}"></ha-switch>
    </div>
  </div>
</details>

<details>
  <summary>Farben & Design <ha-icon icon="mdi:palette"></ha-icon></summary>
  <div class="content">
    <ha-textfield label="Akzentfarbe (Graphen/COP)" .value="${this._config.style.accent_color}" @input="${e => this._updateStyle('accent_color', e.target.value)}"></ha-textfield>
    <ha-textfield label="Graph Sichtbarkeit (0.1 - 1.0)" .value="${this._config.style.graph_opacity}" @input="${e => this._updateStyle('graph_opacity', e.target.value)}"></ha-textfield>
    <ha-textfield label="Farbe Heizen" .value="${this._config.style.color_heating}" @input="${e => this._updateStyle('color_heating', e.target.value)}"></ha-textfield>
    <ha-textfield label="Farbe Warmwasser" .value="${this._config.style.color_dhw}" @input="${e => this._updateStyle('color_dhw', e.target.value)}"></ha-textfield>
    <ha-textfield label="Karten-Hintergrund" .value="${this._config.style.card_bg}" @input="${e => this._updateStyle('card_bg', e.target.value)}"></ha-textfield>
  </div>
</details>
    `;
  }

  _updateConfig(key, value) {
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
  name: "Buderus Pro Monitor (Graph)",
  description: "Heatpump Dashboard mit integrierten mini-graph-cards."
});

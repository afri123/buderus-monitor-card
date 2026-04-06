// ================================================================
// Buderus Monitor Card v0.0.6
// Full EMS-ESP integration · mini-graph-card · Visual Editor
// ================================================================

const BMC_VERSION = "0.0.6";

/* ── Default Entity Map ───────────────────────────────────────── */
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
  air_inlet_tl2: "sensor.boiler_air_inlet_temperature_tl2",
  high_pressure_ph1: "sensor.boiler_high_pressure_side_temperature_ph1",
  low_pressure_pl1: "sensor.boiler_low_pressure_side_temperature_pl1",
  compressor_tr1: "sensor.boiler_compressor_temperature_tr1",
  compressor_inlet_tr5: "sensor.boiler_compressor_inlet_temperature_tr5",
  compressor_outlet_tr6: "sensor.boiler_compressor_outlet_temperature_tr6",
  condenser_tc3: "sensor.boiler_condenser_temperature_tc3",
  evaporator_tr4: "sensor.boiler_evaporator_inlet_temperature_tr4",
  heat_carrier_tc0: "sensor.boiler_heat_carrier_return_tc0",
  heat_carrier_tc1: "sensor.boiler_heat_carrier_forward_tc1",
  refrigerant_tr3: "sensor.boiler_refrigerant_temperature_liquid_side_condenser_output_tr3",
  drain_pan_ta4: "sensor.boiler_drain_pan_temp_ta4",
  low_loss_header: "sensor.boiler_low_loss_header",
  brine_out: "sensor.boiler_brine_out_condenser",
  brine_in: "sensor.boiler_brine_in_evaporator",
  damped_outdoor: "sensor.thermostat_damped_outdoor_temperature",
  total_energy_consumption: "sensor.boiler_total_energy_consumption",
  total_energy_supplied: "sensor.boiler_total_energy_supplied",
  energy_consumption_heating: "sensor.boiler_energy_consumption_compressor_heating",
  energy_consumption_cooling: "sensor.boiler_energy_consumption_compressor_cooling",
  energy_supplied_heating: "sensor.boiler_total_energy_supplied_heating",
  energy_supplied_cooling: "sensor.boiler_total_energy_supplied_cooling",
  total_aux_consumption: "sensor.boiler_total_aux_elec_heater_energy_consumption",
  dhw_energy_consumption: "sensor.boiler_dhw_energy_consumption_compressor",
  dhw_energy_supplied: "sensor.boiler_dhw_total_energy_warm_supplied",
  compressor_activity: "sensor.boiler_compressor_activity",
  compressor_starts: "sensor.boiler_total_compressor_control_starts",
  heating_control_starts: "sensor.boiler_heating_control_starts",
  cooling_control_starts: "sensor.boiler_cooling_control_starts",
  burner_starts: "sensor.boiler_burner_starts",
  op_time_heating: "sensor.boiler_operating_time_compressor_heating",
  op_time_cooling: "sensor.boiler_operating_time_compressor_cooling",
  total_uptime: "sensor.boiler_heatpump_total_uptime",
  total_heat_op_time: "sensor.boiler_total_heat_operating_time",
  heating_pump_mod: "sensor.boiler_heating_pump_modulation",
  brine_pump_speed: "sensor.boiler_brine_pump_speed",
  circ_pump_speed: "sensor.boiler_circulation_pump_speed",
  aux_heater_level: "sensor.boiler_aux_heater_level",
  aux_heater_valve: "sensor.boiler_aux_heater_mixing_valve",
  four_way_valve: "sensor.boiler_4_way_valve_vr4",
  burner_power: "sensor.boiler_burner_current_power",
  dhw_set_temp: "sensor.boiler_dhw_set_temperature",
  dhw_intern_temp: "sensor.boiler_dhw_current_intern_temperature",
  dhw_extern_temp: "sensor.boiler_dhw_current_extern_temperature",
  dhw_tap_flow: "sensor.boiler_dhw_current_tap_water_flow",
  dhw_active_time: "sensor.boiler_dhw_active_time",
  dhw_starts: "sensor.boiler_dhw_starts",
  dhw_starts_hp: "sensor.boiler_dhw_starts_hp",
  dhw_op_time: "sensor.boiler_dhw_operating_time_compressor",
  dhw_charging: "binary_sensor.boiler_dhw_charging",
  dhw_recharging: "binary_sensor.boiler_dhw_recharging",
  dhw_temp_ok: "binary_sensor.boiler_dhw_temperature_ok",
  dhw_3way: "binary_sensor.boiler_dhw_3_way_valve_active",
  last_error: "sensor.boiler_last_error_code",
  service_code: "sensor.boiler_service_code",
  service_code_num: "sensor.boiler_service_code_number",
  switch_valve: "binary_sensor.boiler_switch_valve",
  condensate_ea0: "binary_sensor.boiler_condensate_reservoir_heating_ea0",
  pc1: "binary_sensor.boiler_pc1",
  input_1: "binary_sensor.boiler_input_1_state",
  input_2: "binary_sensor.boiler_input_2_state",
  input_3: "binary_sensor.boiler_input_3_state",
  input_4: "binary_sensor.boiler_input_4_state",
  sys_ems_bus: "sensor.system_ems_bus",
  sys_free_mem: "sensor.system_free_memory",
  sys_uptime: "sensor.system_uptime",
  sys_version: "sensor.system_version",
  sys_wifi_rssi: "sensor.system_wifi_rssi",
  sys_wifi_strength: "sensor.system_wifi_strength",
  sys_status: "binary_sensor.system_status",
  sys_rx_received: "sensor.system_rx_received",
  sys_rx_fails: "sensor.system_rx_fails",
  sys_tx_reads: "sensor.system_tx_reads",
  sys_tx_writes: "sensor.system_tx_writes",
  sys_tx_fails: "sensor.system_tx_fails",
  sys_mqtt_fails: "sensor.system_mqtt_fails",
  thermo_hc1: "climate.thermostat_hc1",
  thermo_hc1_mode: "select.thermostat_hc1_operating_mode",
  thermo_hc1_target_flow: "sensor.thermostat_hc1_target_flow_temperature",
  thermo_dhw_charge: "switch.thermostat_dhw_charge",
  thermo_damping: "switch.thermostat_damping_outdoor_temperature",
  thermo_raise_dhw: "switch.thermostat_enable_raise_dhw",
  thermo_raise_heating: "number.thermostat_raise_heating_with_pv",
  thermo_lower_cooling: "number.thermostat_lower_cooling_with_pv",
  thermo_energy_ratio: "number.thermostat_energy_cost_ratio",
  thermo_building_type: "select.thermostat_building_type",
  thermo_int_temp_offset: "number.thermostat_internal_temperature_offset",
  thermo_min_ext_temp: "number.thermostat_minimal_external_temperature",
  thermo_datetime: "text.thermostat_date_time",
};

const BMC_LABELS = {
  outside_temp: "Außentemperatur", flow_temp: "Vorlauftemperatur", return_temp: "Rücklauftemperatur",
  dhw_temp: "WW-Speicher", compressor_power: "Kompressor Leistung", compressor_output: "Kompressor Ausgang",
  compressor_speed: "Kompressor Drehzahl", heating_active: "Heizen aktiv", tapwater_active: "Warmwasser aktiv",
  heating_pump: "Heizungspumpe", sys_status: "System Status"
};

/* ── Section Definitions ───────────────────────────────────────── */
const BMC_SECTIONS = {
  hero: {
    label: "Dashboard",
    icon: "mdi:view-dashboard",
    metrics: ["outside_temp", "flow_temp", "return_temp", "dhw_temp", "compressor_power", "compressor_speed"],
    graphs: ["outside_temp", "flow_temp", "return_temp", "dhw_temp", "compressor_power"]
  },
  temperatures: {
    label: "Temperaturen",
    icon: "mdi:thermometer",
    metrics: ["air_inlet_tl2", "high_pressure_ph1", "low_pressure_pl1", "compressor_tr1", "compressor_inlet_tr5", "compressor_outlet_tr6", "condenser_tc3", "evaporator_tr4"]
  },
  energy: {
    label: "Energie",
    icon: "mdi:lightning-bolt",
    metrics: ["total_energy_consumption", "total_energy_supplied", "energy_consumption_heating", "energy_supplied_heating"]
  }
};

/* ── Style Defaults ───────────────────────────────────────────── */
const BMC_STYLE_DEFAULTS = {
  card_bg: "var(--ha-card-background, var(--card-background-color, #fff))",
  card_padding: "20px",
  card_radius: "16px",
  accent: "var(--primary-color, #4fc3f7)",
  accent_secondary: "#81c784",
  color_heating: "#ff7043",
  color_dhw: "#ec407a",
  color_idle: "#66bb6a",
  font_family: "var(--paper-font-body1_-_font-family, 'Segoe UI', sans-serif)",
  graph_hours: 24,
  graph_opacity: "0.25",
  metric_value_size: "1.5rem",
  metric_label_size: "0.7rem",
  animate: true,
  show_cop: true,
  columns_hero: 3,
  columns_detail: 3,
};

function _sv(hass, eid) {
  const s = hass?.states?.[eid];
  if (!s) return { v: null, u: "", s: "N/A" };
  const v = parseFloat(s.state);
  return { v: isNaN(v) ? null : v, u: s.attributes?.unit_of_measurement || "", s: s.state };
}

/* ================================================================
   MAIN CARD
   ================================================================ */
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
    this._isBuilt = false;
    if (this._hass) this._render();
  }

  set hass(hass) {
    this._hass = hass;
    this._render();
  }

  _render() {
    if (!this._config || !this._hass) return;

    // Nur bei Initialisierung oder Tab-Wechsel das HTML-Grundgerüst bauen
    if (!this._isBuilt) {
      this._buildShell();
      this._isBuilt = true;
    }

    this._updateData();
  }

  _buildShell() {
    const s = this._config.style;
    const tabs = Object.keys(BMC_SECTIONS);

    this.shadowRoot.innerHTML = `
      <style>${this._buildCSS()}</style>
      <ha-card>
        <div class="bmc-card">
          <div class="header">
            <div class="title"><ha-icon icon="${this._config.title_icon || 'mdi:heat-pump'}"></ha-icon> ${this._config.title}</div>
            <div id="status-bar" class="status-bar"></div>
          </div>
          
          <div class="tabs">
            ${tabs.map(t => `<button class="tab-btn ${this._activeTab === t ? 'active' : ''}" data-tab="${t}">${BMC_SECTIONS[t].label}</button>`).join('')}
          </div>

          <div id="tab-content">
            ${this._renderGridShell()}
          </div>
        </div>
      </ha-card>
    `;

    // Tab Event Listeners
    this.shadowRoot.querySelectorAll(".tab-btn").forEach(btn => {
      btn.onclick = () => {
        this._activeTab = btn.dataset.tab;
        this._isBuilt = false;
        this._render();
      };
    });

    this._initGraphs();
  }

  _renderGridShell() {
    const sec = BMC_SECTIONS[this._activeTab];
    const isHero = this._activeTab === "hero";
    let html = "";

    if (isHero && this._config.style.show_cop) {
        html += `<div id="cop-section" class="cop-section"></div>`;
    }

    html += `<div class="metric-grid ${isHero ? 'hero' : 'detail'}">`;
    sec.metrics.forEach(m => {
      const hasGraph = sec.graphs?.includes(m);
      html += `
        <div class="metric-box ${hasGraph ? 'has-graph' : ''}">
          ${hasGraph ? `<div id="graph-${m}" class="graph-slot"></div>` : ''}
          <div class="m-label">${BMC_LABELS[m] || m}</div>
          <div id="val-${m}" class="m-value">--</div>
        </div>
      `;
    });
    html += `</div>`;
    return html;
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
        points_per_hour: 4,
        line_color: this._config.style.accent,
        line_width: 2,
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
    const sec = BMC_SECTIONS[this._activeTab];
    const s = this._config.style;

    // 1. Status Bar
    const statusEl = this.shadowRoot.getElementById("status-bar");
    if (statusEl) {
      const heating = this._hass.states[this._config.entities.heating_active]?.state === 'on';
      const dhw = this._hass.states[this._config.entities.tapwater_active]?.state === 'on';
      const color = dhw ? s.color_dhw : (heating ? s.color_heating : s.color_idle);
      statusEl.innerHTML = `<span class="dot" style="background:${color}"></span> ${dhw ? 'Warmwasser' : (heating ? 'Heizbetrieb' : 'Standby')}`;
    }

    // 2. Metrics (nur Textinhalt tauschen gegen Flackern)
    sec.metrics.forEach(m => {
      const valEl = this.shadowRoot.getElementById(`val-${m}`);
      if (valEl) {
        const sv = _sv(this._hass, this._config.entities[m]);
        const valTxt = sv.v !== null ? `${sv.v.toFixed(1)} ${sv.u}` : sv.s;
        if (valEl.textContent !== valTxt) valEl.textContent = valTxt;
      }
    });

    // 3. COP Progress
    if (this._activeTab === "hero" && s.show_cop) {
        const copEl = this.shadowRoot.getElementById("cop-section");
        const pIn = _sv(this._hass, this._config.entities.compressor_power);
        const pOut = _sv(this._hass, this._config.entities.compressor_output);
        const cop = (pIn.v > 100 && pOut.v) ? (pOut.v / pIn.v).toFixed(2) : "0.0";
        if (copEl) copEl.innerHTML = `<div class="bar-lbl">COP: ${cop}</div><div class="bar-track"><div class="bar-fill" style="width:${Math.min(cop*20, 100)}%; background:${s.accent}"></div></div>`;
    }

    // 4. Update Graphs
    Object.values(this._graphCards).forEach(g => { if (g) g.hass = this._hass; });
  }

  _buildCSS() {
    const s = this._config.style;
    return `
      .bmc-card { background: ${s.card_bg}; padding: ${s.card_padding}; border-radius: ${s.card_radius}; font-family: ${s.font_family}; color: var(--primary-text-color); }
      .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }
      .title { font-weight: 800; font-size: 1.1rem; display: flex; align-items: center; gap: 8px; }
      .status-bar { font-size: 0.8rem; font-weight: 700; display: flex; align-items: center; gap: 5px; }
      .dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; }
      
      .tabs { display: flex; gap: 5px; margin-bottom: 20px; border-bottom: 1px solid rgba(128,128,128,0.2); }
      .tab-btn { background: none; border: none; padding: 8px 12px; color: var(--secondary-text-color); cursor: pointer; font-weight: 700; font-size: 0.75rem; text-transform: uppercase; }
      .tab-btn.active { color: ${s.accent}; border-bottom: 2px solid ${s.accent}; }

      .metric-grid { display: grid; gap: 12px; }
      .metric-grid.hero { grid-template-columns: repeat(${s.columns_hero}, 1fr); }
      .metric-grid.detail { grid-template-columns: repeat(${s.columns_detail}, 1fr); }

      .metric-box { background: rgba(128,128,128,0.05); border-radius: 12px; padding: 15px; position: relative; overflow: hidden; min-height: 80px; }
      .has-graph { min-height: 110px; }
      .graph-slot { position: absolute; bottom: 0; left: 0; width: 100%; height: 100%; opacity: ${s.graph_opacity}; pointer-events: none; }
      .m-label { font-size: ${s.metric_label_size}; text-transform: uppercase; color: var(--secondary-text-color); font-weight: 800; z-index: 1; position: relative; }
      .m-value { font-size: ${s.metric_value_size}; font-weight: 900; z-index: 1; position: relative; }

      .cop-section { margin-bottom: 15px; }
      .bar-lbl { font-size: 0.7rem; font-weight: 800; margin-bottom: 4px; }
      .bar-track { height: 6px; background: rgba(128,128,128,0.1); border-radius: 3px; overflow: hidden; }
      .bar-fill { height: 100%; transition: width 0.5s ease; }
    `;
  }

  getCardSize() { return 5; }
}

/* ================================================================
   EDITOR (Accordion Style)
   ================================================================ */
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
        .editor { font-family: sans-serif; display: flex; flex-direction: column; gap: 10px; }
        details { border: 1px solid #ccc; border-radius: 8px; overflow: hidden; }
        summary { padding: 10px; background: #eee; cursor: pointer; font-weight: bold; }
        .section { padding: 15px; display: flex; flex-direction: column; gap: 10px; }
        input { width: 100%; padding: 8px; box-sizing: border-box; }
      </style>
      <div class="editor">
        <details open>
          <summary>Allgemeines Design</summary>
          <div class="section">
            <label>Schriftart (z.B. 'Roboto' oder 'Oswald')</label>
            <input id="font_family" type="text" value="${this._config.style?.font_family || ''}">
            <label>Akzentfarbe</label>
            <input id="accent" type="text" value="${this._config.style?.accent || '#4fc3f7'}">
          </div>
        </details>
        <details>
          <summary>Graphen</summary>
          <div class="section">
            <label>Sichtbarkeit (0.1 - 1.0)</label>
            <input id="graph_opacity" type="number" step="0.1" value="${this._config.style?.graph_opacity || 0.3}">
          </div>
        </details>
      </div>
    `;

    this.shadowRoot.querySelectorAll("input").forEach(el => {
      el.onchange = (e) => this._updateConfig(e);
    });
  }

  _updateConfig(e) {
    const key = e.target.id;
    const val = e.target.value;
    const config = JSON.parse(JSON.stringify(this._config));
    if (!config.style) config.style = {};
    config.style[key] = val;
    this.dispatchEvent(new CustomEvent("config-changed", { detail: { config }, bubbles: true, composed: true }));
  }
}

customElements.define("buderus-monitor-card", BuderusMonitorCard);
customElements.define("buderus-monitor-card-editor", BuderusMonitorCardEditor);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "buderus-monitor-card",
  name: "Buderus Monitor v0.0.6",
  description: "Heatpump Dashboard mit Anti-Flicker Logik."
});

// ================================================================
// Buderus Monitor Card v0.0.3
// Smart Update Engine · No Flicker · Extended Typography · Icons
// ================================================================

const BMC_VERSION = "0.0.3";

/* ── Default Entity Map (Identisch zu v0.0.2) ─────────────────── */
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
};

const BMC_LABELS = {
    outside_temp: "Außen", flow_temp: "Vorlauf", return_temp: "Rücklauf", dhw_temp: "Speicher",
    compressor_power: "Leistung", compressor_speed: "Drehzahl", heating_active: "Heizen",
    tapwater_active: "Warmwasser", heating_pump: "Pumpe", sys_status: "System"
};

const BMC_ICONS = {
    outside_temp: "mdi:thermometer", flow_temp: "mdi:pipe-leak", return_temp: "mdi:pipe-leak",
    dhw_temp: "mdi:water-boiler", compressor_power: "mdi:flash", compressor_speed: "mdi:engine"
};

/* ── Section Definitions ───────────────────────────────────────── */
const BMC_SECTIONS = {
    hero: { label: "Dashboard", icon: "mdi:view-dashboard", metrics: ["outside_temp", "flow_temp", "return_temp", "dhw_temp", "compressor_power", "compressor_speed"], graphs: ["outside_temp", "flow_temp", "return_temp", "dhw_temp", "compressor_power"] },
    temperatures: { label: "Temperaturen", icon: "mdi:thermometer", metrics: ["air_inlet_tl2", "high_pressure_ph1", "low_pressure_pl1", "compressor_tr1", "compressor_inlet_tr5", "compressor_outlet_tr6", "condenser_tc3", "evaporator_tr4", "heat_carrier_tc0", "heat_carrier_tc1", "refrigerant_tr3", "drain_pan_ta4", "brine_out", "brine_in"] },
    energy: { label: "Energie", icon: "mdi:lightning-bolt", metrics: ["total_energy_consumption", "total_energy_supplied", "energy_consumption_heating", "energy_supplied_heating", "dhw_energy_consumption", "dhw_energy_supplied"] },
    system: { label: "System", icon: "mdi:chip", metrics: ["sys_wifi_strength", "sys_uptime", "sys_version", "sys_free_mem", "sys_ems_bus"] }
};

const BMC_STYLE_DEFAULTS = {
    card_bg: "rgba(26, 26, 46, 0.95)",
    card_padding: "20px",
    card_radius: "20px",
    accent: "#4fc3f7",
    font_family: "Oswald, sans-serif",
    value_weight: "700",
    label_weight: "400",
    label_color: "#999",
    value_color: "#fff",
    graph_opacity: "0.3",
    graph_hours: 24,
    show_cop: true,
    animate: true
};

class BuderusMonitorCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this._isBuilt = false;
        this._activeTab = "hero";
        this._graphInits = new Set();
    }

    static getConfigElement() { return document.createElement("buderus-monitor-card-editor"); }
    static getStubConfig() { return { title: "Heizung", entities: {}, style: {} }; }

    setConfig(config) {
        this._config = {
            ...config,
            entities: { ...BMC_ENTITY_DEFAULTS, ...config.entities },
            style: { ...BMC_STYLE_DEFAULTS, ...config.style },
            icons: { ...BMC_ICONS, ...config.icons }
        };
        if (this._hass) this._render();
    }

    set hass(hass) {
        this._hass = hass;
        this._render();
    }

    _render() {
        if (!this._config || !this._hass) return;

        // Vollständiger Neubau nur bei Tab-Wechsel oder Initialisierung
        if (!this._isBuilt) {
            this._buildShell();
            this._isBuilt = true;
            this._graphInits.clear(); 
        }

        this._updateData();
    }

    _buildShell() {
        const s = this._config.style;
        this.shadowRoot.innerHTML = `
            <style>${this._getCSS()}</style>
            <div class="card">
                <div class="header">
                    <div class="title"><ha-icon icon="${this._config.title_icon || 'mdi:heat-pump'}"></ha-icon> ${this._config.title || 'Wärmepumpe'}</div>
                    <div class="status-bar" id="status-bar"></div>
                </div>
                <div class="tabs">${this._renderTabs()}</div>
                <div id="content"></div>
            </div>
        `;

        // Tab Event Listener
        this.shadowRoot.querySelectorAll(".tab").forEach(tab => {
            tab.onclick = () => {
                this._activeTab = tab.dataset.tab;
                this._isBuilt = false; // Trigger rebuild for new tab content
                this._render();
            };
        });

        // Tab Content Struktur
        this._buildTabContent();
    }

    _buildTabContent() {
        const container = this.shadowRoot.getElementById("content");
        const tab = BMC_SECTIONS[this._activeTab];
        if (!tab) return;

        let html = "";
        if (this._activeTab === "hero" && this._config.style.show_cop) {
            html += `<div id="cop-section"></div>`;
        }

        html += `<div class="grid">`;
        tab.metrics.forEach(m => {
            const hasGraph = tab.graphs?.includes(m);
            html += `
                <div class="box ${hasGraph ? 'has-graph' : ''}">
                    ${hasGraph ? `<div class="graph" id="graph-${m}"></div>` : ''}
                    <div class="m-label">${this._config.icons[m] ? `<ha-icon icon="${this._config.icons[m]}"></ha-icon>` : ''} ${BMC_LABELS[m] || m}</div>
                    <div class="m-value" id="val-${m}">--</div>
                </div>
            `;
        });
        html += `</div>`;
        container.innerHTML = html;
        
        // Graphen initialisieren
        if (tab.graphs) {
            tab.graphs.forEach(m => this._initGraph(m));
        }
    }

    _initGraph(metric) {
        const container = this.shadowRoot.getElementById(`graph-${metric}`);
        if (!container || this._graphInits.has(metric)) return;

        const eid = this._config.entities[metric];
        const graph = document.createElement("mini-graph-card");
        graph.setConfig({
            entities: [{ entity: eid }],
            hours_to_show: this._config.style.graph_hours,
            points_per_hour: 2,
            line_color: this._config.style.accent,
            line_width: 2,
            animate: this._config.style.animate,
            fill: "fade",
            show: { name: false, icon: false, state: false, legend: false, labels: false }
        });
        graph.hass = this._hass;
        container.appendChild(graph);
        this._graphInits.add(metric);
    }

    _updateData() {
        // Status Bar
        const statusEl = this.shadowRoot.getElementById("status-bar");
        if (statusEl) {
            const heating = this._hass.states[this._config.entities.heating_active]?.state === 'on';
            const dhw = this._hass.states[this._config.entities.tapwater_active]?.state === 'on';
            const color = dhw ? this._config.style.color_dhw : (heating ? this._config.style.color_heating : this._config.style.color_idle);
            statusEl.innerHTML = `<span class="dot" style="background:${color}"></span> ${dhw ? 'Warmwasser' : (heating ? 'Heizen' : 'Standby')}`;
        }

        // COP Section
        if (this._activeTab === "hero" && this._config.style.show_cop) {
            const pIn = parseFloat(this._hass.states[this._config.entities.compressor_power]?.state || 0);
            const pOut = parseFloat(this._hass.states[this._config.entities.compressor_output]?.state || 0);
            const cop = pIn > 100 ? (pOut / pIn).toFixed(2) : "0.00";
            const copEl = this.shadowRoot.getElementById("cop-section");
            if (copEl) {
                copEl.innerHTML = `
                    <div class="cop-label">Efficiency (COP) <span style="float:right">${cop}</span></div>
                    <div class="cop-track"><div class="cop-fill" style="width:${Math.min(parseFloat(cop)*20, 100)}%; background:${this._config.style.accent}"></div></div>
                `;
            }
        }

        // Metrics
        const tab = BMC_SECTIONS[this._activeTab];
        tab.metrics.forEach(m => {
            const el = this.shadowRoot.getElementById(`val-${m}`);
            if (el) {
                const state = this._hass.states[this._config.entities[m]];
                const val = state ? state.state : "--";
                const unit = state?.attributes.unit_of_measurement || "";
                const display = isNaN(parseFloat(val)) ? val : `${parseFloat(val).toFixed(1)} ${unit}`;
                if (el.textContent !== display) el.textContent = display;
            }
        });
    }

    _renderTabs() {
        return Object.entries(BMC_SECTIONS).map(([id, sec]) => `
            <div class="tab ${this._activeTab === id ? 'active' : ''}" data-tab="${id}">
                <ha-icon icon="${sec.icon}"></ha-icon> <span>${sec.label}</span>
            </div>
        `).join("");
    }

    _getCSS() {
        const s = this._config.style;
        return `
            :host { --accent: ${s.accent}; }
            .card { background: ${s.card_bg}; padding: ${s.card_padding}; border-radius: ${s.card_radius}; font-family: ${s.font_family}; color: ${s.value_color}; overflow: hidden; }
            .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
            .title { font-size: 1.2rem; font-weight: 700; display: flex; align-items: center; gap: 10px; }
            .status-bar { font-size: 0.8rem; font-weight: 700; text-transform: uppercase; display: flex; align-items: center; gap: 8px; }
            .dot { width: 10px; height: 10px; border-radius: 50%; display: inline-block; box-shadow: 0 0 8px currentColor; }
            
            .tabs { display: flex; gap: 10px; margin-bottom: 20px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 10px; }
            .tab { cursor: pointer; opacity: 0.5; display: flex; align-items: center; gap: 5px; font-size: 0.8rem; font-weight: 700; text-transform: uppercase; transition: 0.3s; }
            .tab.active { opacity: 1; color: var(--accent); }
            .tab:hover { opacity: 0.8; }

            .grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; }
            .box { background: rgba(255,255,255,0.03); border-radius: 15px; padding: 15px; position: relative; overflow: hidden; border: 1px solid rgba(255,255,255,0.05); }
            .box.has-graph { height: 110px; }
            .graph { position: absolute; bottom: 0; left: 0; width: 100%; height: 100%; opacity: ${s.graph_opacity}; pointer-events: none; }
            
            .m-label { font-size: 0.7rem; color: ${s.label_color}; font-weight: ${s.label_weight}; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 5px; position: relative; z-index: 1; display: flex; align-items: center; gap: 5px; }
            .m-label ha-icon { --mdc-icon-size: 14px; }
            .m-value { font-size: 1.4rem; font-weight: ${s.value_weight}; position: relative; z-index: 1; }

            .cop-label { font-size: 0.7rem; font-weight: 700; text-transform: uppercase; margin-bottom: 8px; color: ${s.label_color}; }
            .cop-track { height: 6px; background: rgba(255,255,255,0.1); border-radius: 3px; overflow: hidden; margin-bottom: 20px; }
            .cop-fill { height: 100%; border-radius: 3px; transition: width 1s ease; }
        `;
    }
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
                details { margin-bottom: 10px; border: 1px solid #444; border-radius: 5px; }
                summary { padding: 10px; cursor: pointer; font-weight: bold; background: #333; }
                .content { padding: 15px; display: flex; flex-direction: column; gap: 10px; }
                .row { display: flex; gap: 10px; align-items: center; }
                input, select { flex: 1; padding: 8px; border-radius: 5px; border: 1px solid #666; background: #222; color: #fff; }
                label { width: 120px; font-size: 0.8rem; }
            </style>
            <div class="editor">
                <details open>
                    <summary>Allgemein</summary>
                    <div class="content">
                        <div class="row"><label>Titel</label><input type="text" id="title" value="${this._config.title}"></div>
                    </div>
                </details>
                <details>
                    <summary>Typografie & Icons</summary>
                    <div class="content">
                        <div class="row"><label>Schriftart</label><input type="text" id="font_family" value="${this._config.style?.font_family || 'Oswald, sans-serif'}"></div>
                        <div class="row"><label>Gewicht Wert</label><select id="value_weight"><option value="400">Normal</option><option value="700" selected>Bold</option><option value="900">Black</option></select></div>
                        <div class="row"><label>Wert Farbe</label><input type="text" id="value_color" value="${this._config.style?.value_color || '#fff'}"></div>
                        <div class="row"><label>Label Farbe</label><input type="text" id="label_color" value="${this._config.style?.label_color || '#999'}"></div>
                        <hr>
                        <p style="font-size:0.7rem; color:#888">Icons überschreiben (z.B. flow_temp: mdi:water)</p>
                        <div class="row"><label>Icon Außentemp</label><input type="text" id="icon_outside_temp" value="${this._config.icons?.outside_temp || ''}"></div>
                        <div class="row"><label>Icon Vorlauf</label><input type="text" id="icon_flow_temp" value="${this._config.icons?.flow_temp || ''}"></div>
                    </div>
                </details>
                <details>
                    <summary>Design</summary>
                    <div class="content">
                        <div class="row"><label>Akzentfarbe</label><input type="text" id="accent" value="${this._config.style?.accent || '#4fc3f7'}"></div>
                        <div class="row"><label>Graph Opacity</label><input type="number" step="0.1" id="graph_opacity" value="${this._config.style?.graph_opacity || 0.3}"></div>
                        <div class="row"><label>Graph Stunden</label><input type="number" id="graph_hours" value="${this._config.style?.graph_hours || 24}"></div>
                    </div>
                </details>
            </div>
        `;

        this.shadowRoot.querySelectorAll("input, select").forEach(el => {
            el.onchange = (e) => this._updateConfig(e);
        });
    }

    _updateConfig(e) {
        const id = e.target.id;
        const value = e.target.value;
        const newConfig = JSON.parse(JSON.stringify(this._config));

        if (id === "title") newConfig.title = value;
        else if (id.startsWith("icon_")) {
            if (!newConfig.icons) newConfig.icons = {};
            newConfig.icons[id.replace("icon_", "")] = value;
        }
        else {
            if (!newConfig.style) newConfig.style = {};
            newConfig.style[id] = value;
        }

        const event = new CustomEvent("config-changed", {
            detail: { config: newConfig },
            bubbles: true,
            composed: true
        });
        this.dispatchEvent(event);
    }
}

customElements.define("buderus-monitor-card", BuderusMonitorCard);
customElements.define("buderus-monitor-card-editor", BuderusMonitorCardEditor);

window.customCards = window.customCards || [];
window.customCards.push({
    type: "buderus-monitor-card",
    name: "Buderus Monitor v0.0.3",
    description: "Flackerfreies High-End Dashboard für Buderus/Bosch Wärmepumpen."
});

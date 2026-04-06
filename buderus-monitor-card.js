// ================================================================
// Buderus (EMS-ESP) Monitor Card  v0.1.0
// ================================================================

const BMC_VERSION = "0.1.0";

const BMC_DEFAULTS = {
  title: "Wärmepumpe",
  title_icon: "mdi:heat-pump",
  auto_discover: true,
  show_energy: true,
  show_system: true,
  show_actions: true,
  style: {
    card_bg: "var(--ha-card-background, var(--card-background-color, #fff))",
    card_padding: "20px",
    card_border_radius: "16px",
    card_shadow: "var(--ha-card-box-shadow, 0 2px 16px rgba(0,0,0,.07))",
    font_family: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    text_primary: "var(--primary-text-color)",
    text_secondary: "var(--secondary-text-color)",
    text_meta: "var(--disabled-text-color, #9e9e9e)",
    color_heating: "#ff5722",
    color_dhw: "#e91e63",
    color_cooling: "#03a9f4",
    color_idle: "#4caf50",
    color_error: "#f44336",
  }
};

function _mergeConfig(config) {
  const out = Object.assign({}, BMC_DEFAULTS, config);
  out.style = Object.assign({}, BMC_DEFAULTS.style, config.style || {});
  return out;
}

// ── MAIN CARD ──────────────────────────────────────────────────
class BuderusMonitorCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._config = null;
    this._hass = null;
    this._rendered = false;
  }

  static getConfigElement() { return document.createElement("buderus-monitor-card-editor"); }
  static getStubConfig() { return { title: "Buderus WLW196i", title_icon: "mdi:heat-pump" }; }

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
    if (!this._rendered) { this._buildShell(); this._rendered = true; }
    this._update();
  }

  _buildShell() {
    const s = this._config.style;

    this.shadowRoot.innerHTML = `
<style>
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
:host { display: block; }

.card {
  background: ${s.card_bg};
  border-radius: ${s.card_border_radius};
  padding: ${s.card_padding};
  box-shadow: ${s.card_shadow};
  font-family: ${s.font_family};
  color: ${s.text_primary};
  overflow: hidden;
  position: relative;
}

/* ── HEADER ── */
.header {
  display: flex; justify-content: space-between; align-items: center;
  margin-bottom: 20px; padding-bottom: 15px;
  border-bottom: 1px solid rgba(128,128,128,.1);
}
.header-left { display: flex; align-items: center; gap: 10px; }
.header-icon { --mdc-icon-size: 24px; color: ${s.text_secondary}; transition: color 0.4s ease; }
.title-wrap { display: flex; flex-direction: column; }
.card-title { font-size: 16px; font-weight: 700; letter-spacing: 0.5px; }
.card-subtitle { font-size: 11px; color: ${s.text_meta}; text-transform: uppercase; letter-spacing: 1px; margin-top: 2px; }

.status-badge {
  padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 700;
  text-transform: uppercase; letter-spacing: 0.5px;
  background: rgba(128,128,128,0.1); color: ${s.text_secondary};
  transition: all 0.4s ease; display: flex; align-items: center; gap: 4px;
}
.status-badge ha-icon { --mdc-icon-size: 14px; }

/* ── HERO METRICS (Temps) ── */
.hero-grid {
  display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 20px;
}
.h-metric {
  background: rgba(128,128,128,.04); border-radius: 12px; padding: 12px 8px;
  text-align: center; display: flex; flex-direction: column; align-items: center; justify-content: center;
  border: 1px solid transparent; transition: border-color 0.3s;
}
.h-metric:hover { border-color: rgba(128,128,128,.15); cursor: pointer; }
.hm-icon { --mdc-icon-size: 20px; color: ${s.text_meta}; margin-bottom: 6px; }
.hm-val { font-size: 18px; font-weight: 800; color: ${s.text_primary}; line-height: 1.1; }
.hm-unit { font-size: 10px; font-weight: 600; color: ${s.text_meta}; }
.hm-lbl { font-size: 9px; text-transform: uppercase; letter-spacing: 0.5px; color: ${s.text_secondary}; margin-top: 4px; }

/* ── POWER & COMPRESSOR BAR ── */
.power-section { margin-bottom: 20px; }
.ps-header { display: flex; justify-content: space-between; font-size: 11px; font-weight: 700; text-transform: uppercase; color: ${s.text_secondary}; margin-bottom: 6px; }
.track { height: 6px; background: rgba(128,128,128,.1); border-radius: 99px; overflow: hidden; position: relative; }
.fill { height: 100%; border-radius: 99px; background: ${s.color_idle}; transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.4s; }

/* ── DETAILS LIST ── */
.details { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.d-row {
  display: flex; justify-content: space-between; align-items: center;
  padding: 8px 12px; background: rgba(128,128,128,.03); border-radius: 8px;
  font-size: 12px;
}
.d-lbl { color: ${s.text_secondary}; display: flex; align-items: center; gap: 6px; }
.d-lbl ha-icon { --mdc-icon-size: 14px; opacity: 0.7; }
.d-val { font-weight: 600; color: ${s.text_primary}; }

/* ── ACTIONS ── */
.actions {
  display: flex; gap: 10px; margin-top: 20px; padding-top: 15px; border-top: 1px solid rgba(128,128,128,.1);
}
.btn {
  flex: 1; display: flex; align-items: center; justify-content: center; gap: 6px;
  padding: 10px; background: rgba(128,128,128,.05); border: 1px solid rgba(128,128,128,.1);
  border-radius: 8px; font-family: inherit; font-size: 12px; font-weight: 600;
  color: ${s.text_primary}; cursor: pointer; transition: background 0.2s;
}
.btn:hover { background: rgba(128,128,128,.12); }
.btn ha-icon { --mdc-icon-size: 16px; color: ${s.color_dhw}; }
</style>

<div class="card">
  <div class="header">
    <div class="header-left">
      <ha-icon class="header-icon" id="icon" icon="mdi:heat-pump"></ha-icon>
      <div class="title-wrap">
        <div class="card-title" id="title"></div>
        <div class="card-subtitle" id="subtitle">System Offline</div>
      </div>
    </div>
    <div class="status-badge" id="status"><ha-icon icon="mdi:power-sleep"></ha-icon> <span>Standby</span></div>
  </div>

  <div class="hero-grid" id="hero"></div>
  
  <div class="power-section" id="power">
    <div class="ps-header"><span>Kompressor</span><span id="p-val">0 W</span></div>
    <div class="track"><div class="fill" id="p-fill" style="width: 0%"></div></div>
  </div>

  <div class="details" id="details"></div>

  <div class="actions" id="actions"></div>
</div>`;

    this._ui = {
      icon: this.shadowRoot.getElementById("icon"),
      title: this.shadowRoot.getElementById("title"),
      subtitle: this.shadowRoot.getElementById("subtitle"),
      status: this.shadowRoot.getElementById("status"),
      hero: this.shadowRoot.getElementById("hero"),
      power: this.shadowRoot.getElementById("power"),
      pVal: this.shadowRoot.getElementById("p-val"),
      pFill: this.shadowRoot.getElementById("p-fill"),
      details: this.shadowRoot.getElementById("details"),
      actions: this.shadowRoot.getElementById("actions"),
    };
  }

  // ── HELPER: Safely get state ──────────────────────────────────
  _get(entityId, parseNum = false) {
    const s = this._hass.states[entityId];
    if (!s) return parseNum ? 0 : null;
    return parseNum ? parseFloat(s.state) || 0 : s.state;
  }
  
  _getAttr(entityId, attr) {
    const s = this._hass.states[entityId];
    return s && s.attributes ? s.attributes[attr] : null;
  }

  // ── SMART UPDATE LOOP ─────────────────────────────────────────
  _update() {
    const c = this._config;
    const s = c.style;

    // Header updates
    if (this._ui.title.textContent !== c.title) this._ui.title.textContent = c.title;

    // 1. Determine System Status
    const isHeating = this._get('binary_sensor.boiler_heating_active') === 'on';
    const isDHW = this._get('binary_sensor.boiler_tapwater_active') === 'on';
    const isCooling = this._get('binary_sensor.thermostat_hc1_cooling_on') === 'on';
    const hasError = this._get('sensor.boiler_last_error_code') && this._get('sensor.boiler_last_error_code') !== '0' && this._get('sensor.boiler_last_error_code') !== 'none';
    const isOffline = this._get('binary_sensor.system_status') === 'off';

    let stateStr = "Standby";
    let stateColor = s.color_idle;
    let stateIcon = "mdi:power-sleep";

    if (isOffline) { stateStr = "Offline"; stateColor = s.text_meta; stateIcon = "mdi:lan-disconnect"; }
    else if (hasError) { stateStr = "Fehler"; stateColor = s.color_error; stateIcon = "mdi:alert-circle"; }
    else if (isDHW) { stateStr = "Warmwasser"; stateColor = s.color_dhw; stateIcon = "mdi:water-boiler"; }
    else if (isHeating) { stateStr = "Heizen"; stateColor = s.color_heating; stateIcon = "mdi:radiator"; }
    else if (isCooling) { stateStr = "Kühlen"; stateColor = s.color_cooling; stateIcon = "mdi:snowflake"; }

    this._ui.status.style.backgroundColor = `color-mix(in srgb, ${stateColor} 15%, transparent)`;
    this._ui.status.style.color = stateColor;
    this._ui.status.innerHTML = `<ha-icon icon="${stateIcon}"></ha-icon> <span>${stateStr}</span>`;
    this._ui.icon.style.color = stateColor;
    this._ui.icon.icon = c.title_icon;

    // Subtitle (HC1 Mode)
    const hc1Mode = this._get('select.thermostat_hc1_operating_mode') || 'Auto';
    const hc1State = this._get('climate.thermostat_hc1');
    const subTxt = `Heizkreis 1: ${hc1Mode}`;
    if (this._ui.subtitle.textContent !== subTxt) this._ui.subtitle.textContent = subTxt;

    // 2. Build Hero Metrics (Diffing logic to prevent flicker)
    const outTemp = this._get('sensor.boiler_outside_temperature', true);
    const flowTemp = this._get('sensor.boiler_current_flow_temperature', true);
    const targetFlow = this._get('sensor.thermostat_hc1_target_flow_temperature', true);
    const retTemp = this._get('sensor.boiler_return_temperature', true);
    const dhwTemp = this._get('sensor.boiler_reservoir_temp_tw1', true);

    const heroHtml = `
      ${this._renderHeroMetric('Außen', outTemp, '°C', 'mdi:thermometer-lines', 'sensor.boiler_outside_temperature')}
      ${this._renderHeroMetric('Vorlauf', flowTemp, '°C', 'mdi:wave', 'sensor.boiler_current_flow_temperature', targetFlow > 0 ? `Ziel: ${targetFlow}°` : null)}
      ${this._renderHeroMetric('Rücklauf', retTemp, '°C', 'mdi:water-pump', 'sensor.boiler_return_temperature')}
      ${this._renderHeroMetric('Speicher', dhwTemp, '°C', 'mdi:water-thermometer', 'sensor.boiler_reservoir_temp_tw1')}
    `;
    if (this._ui.hero._cached !== heroHtml) {
      this._ui.hero.innerHTML = heroHtml;
      this._ui.hero._cached = heroHtml;
    }

    // 3. Compressor Power & Modulation
    const power = this._get('sensor.boiler_compressor_current_power', true);
    const mod = this._get('sensor.boiler_compressor_speed', true); // Often in %
    
    // Animate bar based on modulation or calculated percentage (assuming max 3000W for visual scale if mod % isn't available)
    const pct = mod > 0 ? mod : Math.min((power / 3000) * 100, 100); 
    
    if (this._ui.pVal.textContent !== `${power} W`) this._ui.pVal.textContent = `${power} W`;
    this._ui.pFill.style.width = `${pct}%`;
    this._ui.pFill.style.backgroundColor = power > 0 ? stateColor : s.color_idle;

    // 4. Details Grid
    let detailsHtml = "";
    
    // Row 1: Energy
    if (c.show_energy) {
      const eHeat = this._get('sensor.boiler_total_energy_supplied_heating', true);
      const eDhw = this._get('sensor.boiler_dhw_total_energy_warm_supplied', true);
      detailsHtml += this._renderDetailRow('Ertrag Heizen', 'mdi:fire', `${eHeat.toFixed(0)} kWh`);
      detailsHtml += this._renderDetailRow('Ertrag WW', 'mdi:water-boiler', `${eDhw.toFixed(0)} kWh`);
    }

    // Row 2: Uptime / System
    if (c.show_system) {
      const bStarts = this._get('sensor.boiler_compressor_control_starts') || this._get('sensor.boiler_burner_starts');
      const bStartsVal = bStarts ? bStarts : 'N/A';
      const wifi = this._get('sensor.system_wifi_strength') ? `${this._get('sensor.system_wifi_strength')}%` : 'N/A';
      detailsHtml += this._renderDetailRow('Verdichter Starts', 'mdi:restart', bStartsVal);
      detailsHtml += this._renderDetailRow('EMS WiFi', 'mdi:wifi', wifi);
    }

    if (this._ui.details._cached !== detailsHtml) {
      this._ui.details.innerHTML = detailsHtml;
      this._ui.details._cached = detailsHtml;
    }

    // 5. Actions
    if (c.show_actions) {
      const dhwSwitch = this._hass.states['switch.thermostat_dhw_charge'];
      const hasDhwSwitch = !!dhwSwitch;
      
      const actHtml = hasDhwSwitch 
        ? `<button class="btn" onclick="this.getRootNode().host._toggleDHW()">
             <ha-icon icon="mdi:water-plus"></ha-icon> 1x Warmwasser
           </button>`
        : '';
        
      if (this._ui.actions._cached !== actHtml) {
        this._ui.actions.innerHTML = actHtml;
        this._ui.actions._cached = actHtml;
      }
    } else {
      this._ui.actions.innerHTML = "";
    }
  }

  _renderHeroMetric(label, val, unit, icon, entityId, extraTxt = null) {
    return `
      <div class="h-metric" onclick="this.getRootNode().host._moreInfo('${entityId}')">
        <ha-icon class="hm-icon" icon="${icon}"></ha-icon>
        <div class="hm-val">${val.toFixed(1)}<span class="hm-unit">${unit}</span></div>
        <div class="hm-lbl">${label}</div>
        ${extraTxt ? `<div style="font-size:8px; color:var(--disabled-text-color); margin-top:2px;">${extraTxt}</div>` : ''}
      </div>
    `;
  }

  _renderDetailRow(label, icon, val) {
    return `
      <div class="d-row">
        <div class="d-lbl"><ha-icon icon="${icon}"></ha-icon> ${label}</div>
        <div class="d-val">${val}</div>
      </div>
    `;
  }

  // ── INTERACTIONS ──────────────────────────────────────────────
  _moreInfo(entityId) {
    this.dispatchEvent(new CustomEvent("hass-more-info", { detail: { entityId: entityId }, bubbles: true, composed: true }));
  }

  _toggleDHW() {
    const s = this._hass.states['switch.thermostat_dhw_charge'];
    if (!s) return;
    this._hass.callService("switch", "toggle", { entity_id: 'switch.thermostat_dhw_charge' });
  }

  getCardSize() { return 3; }
}


// ================================================================
// EDITOR
// ================================================================
class BuderusMonitorCardEditor extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._config = null;
    this._hass = null;
    this._built = false;
  }

  setConfig(config) {
    this._config = _mergeConfig(config);
    if (this._built) this._sync();
    else if (this._hass) this._build();
  }

  set hass(hass) {
    this._hass = hass;
    if (this._config && !this._built) this._build();
  }

  _build() {
    if (this._built) return;
    this._built = true;

    this.shadowRoot.innerHTML = `
<style>
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
:host { display: block; font-family: var(--primary-font-family, sans-serif); }
details { border: 1px solid rgba(0,0,0,.1); border-radius: 8px; margin-bottom: 8px; background: #fff; }
summary { padding: 12px; font-weight: 600; cursor: pointer; background: rgba(0,0,0,.02); list-style: none; display: flex; align-items: center; gap: 8px; }
summary::after { content: '›'; margin-left: auto; transition: transform 0.2s; }
details[open] summary::after { transform: rotate(90deg); }
.content { padding: 12px; display: flex; flex-direction: column; gap: 12px; }
.row2 { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.sw-row { display: flex; justify-content: space-between; align-items: center; }
ha-textfield { width: 100%; }
</style>

<details open>
  <summary><ha-icon icon="mdi:cog"></ha-icon> Generell</summary>
  <div class="content">
    <div class="row2">
      <ha-textfield id="f_title" label="Titel"></ha-textfield>
      <ha-icon-picker id="f_title_icon" label="Icon"></ha-icon-picker>
    </div>
    <div class="sw-row"><span>Zeige Energieertrag</span><ha-switch id="sw_energy"></ha-switch></div>
    <div class="sw-row"><span>Zeige System & Starts</span><ha-switch id="sw_system"></ha-switch></div>
    <div class="sw-row"><span>Zeige Schnellektionen (1x WW)</span><ha-switch id="sw_actions"></ha-switch></div>
  </div>
</details>

<details>
  <summary><ha-icon icon="mdi:palette"></ha-icon> Farben & Styling</summary>
  <div class="content">
    <div class="row2">
      <ha-textfield id="f_color_heating" label="Farbe Heizen (Hex)"></ha-textfield>
      <ha-textfield id="f_color_dhw" label="Farbe Warmwasser (Hex)"></ha-textfield>
    </div>
    <div class="row2">
      <ha-textfield id="f_color_cooling" label="Farbe Kühlen (Hex)"></ha-textfield>
      <ha-textfield id="f_color_idle" label="Farbe Standby (Hex)"></ha-textfield>
    </div>
    <ha-textfield id="f_card_bg" label="Karten Hintergrund (z.B. #1e1e1e)"></ha-textfield>
  </div>
</details>
`;
    this._sync();
    this._bind();
  }

  static get _MAP() {
    return {
      f_title: ["title"], f_title_icon: ["title_icon"],
      sw_energy: ["show_energy"], sw_system: ["show_system"], sw_actions: ["show_actions"],
      f_color_heating: ["style", "color_heating"], f_color_dhw: ["style", "color_dhw"],
      f_color_cooling: ["style", "color_cooling"], f_color_idle: ["style", "color_idle"],
      f_card_bg: ["style", "card_bg"]
    };
  }

  _sync() {
    const c = this._config, s = c.style;
    const set = (id, v) => { const el = this.shadowRoot.getElementById(id); if (el) el.value = String(v ?? ""); };
    const chk = (id, v) => { const el = this.shadowRoot.getElementById(id); if (el) el.checked = !!v; };

    set("f_title", c.title); set("f_title_icon", c.title_icon);
    chk("sw_energy", c.show_energy); chk("sw_system", c.show_system); chk("sw_actions", c.show_actions);
    set("f_color_heating", s.color_heating); set("f_color_dhw", s.color_dhw);
    set("f_color_cooling", s.color_cooling); set("f_color_idle", s.color_idle);
    set("f_card_bg", s.card_bg);
  }

  _bind() {
    this.shadowRoot.querySelectorAll("ha-textfield, ha-switch, ha-icon-picker").forEach(el => {
      el.addEventListener(el.tagName === "HA-ICON-PICKER" || el.tagName === "HA-SWITCH" ? "change" : "input", e => {
        let val = el.tagName === "HA-SWITCH" ? el.checked : (e.detail?.value !== undefined ? e.detail.value : el.value);
        const newCfg = _mergeConfig(this._config);
        const p = BuderusMonitorCardEditor._MAP[el.id];
        if (p.length === 1) newCfg[p[0]] = val; else newCfg[p[0]][p[1]] = val;
        this._config = newCfg;
        this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: newCfg }, bubbles: true, composed: true }));
      });
    });
  }
}

customElements.define("buderus-monitor-card", BuderusMonitorCard);
customElements.define("buderus-monitor-card-editor", BuderusMonitorCardEditor);
window.customCards = window.customCards || [];
window.customCards.push({ type: "buderus-monitor-card", name: "Buderus WLW Monitor", preview: true, description: "Smart Dashboard für EMS-ESP Buderus Wärmepumpen" });

// ================================================================
// Buderus Pro Monitor Card  v0.0.1 - Performance + Aesthetics
// ================================================================

const BMC_VERSION = "0.0.1";

const BMC_DEFAULTS = {
  title: "Heizung",
  title_icon: "mdi:heat-pump",
  graph_hours: 24,
  show_efficiency: true,
  show_diagnostics: true,
  show_controls: true,
  entities: {
    outside_temp: "sensor.boiler_outside_temperature",
    flow_temp: "sensor.boiler_current_flow_temperature",
    return_temp: "sensor.boiler_return_temperature",
    dhw_temp: "sensor.boiler_reservoir_temp_tw1",
    current_power: "sensor.boiler_compressor_current_power",
    power_output: "sensor.boiler_compressor_power_output",
    heating_active: "binary_sensor.boiler_heating_active",
    dhw_active: "binary_sensor.boiler_tapwater_active",
    compressor_speed: "sensor.boiler_compressor_speed",
    compressor_starts: "sensor.boiler_compressor_control_starts",
    // Optional control entities
    heating_mode: "select.thermostat_hc1_mode",
    dhw_mode: "select.thermostat_dhw_mode",
    dhw_setpoint: "number.boiler_dhw_set_temperature",
  },
  style: {
    accent: "#0071BC",
    color_heating: "#F4511E",
    color_dhw: "#E040FB",
    color_idle: "#66BB6A",
    graph_opacity: 0.25,
  }
};

function _deep(defaults, user) {
  const o = {};
  for (const k of Object.keys(defaults)) {
    if (typeof defaults[k] === "object" && defaults[k] !== null && !Array.isArray(defaults[k])) {
      o[k] = _deep(defaults[k], user?.[k]);
    } else {
      o[k] = user?.[k] !== undefined ? user[k] : defaults[k];
    }
  }
  // Carry over any extra keys from user
  if (user) for (const k of Object.keys(user)) { if (!(k in o)) o[k] = user[k]; }
  return o;
}

// ── Sparkline SVG generator (no dependency on mini-graph-card) ──
function _sparklineSVG(history, color, w = 200, h = 60) {
  if (!history || history.length < 2) return "";
  const vals = history.map(p => parseFloat(p.state)).filter(v => !isNaN(v));
  if (vals.length < 2) return "";
  const min = Math.min(...vals), max = Math.max(...vals);
  const range = max - min || 1;
  const pad = 2;
  const points = vals.map((v, i) => {
    const x = (i / (vals.length - 1)) * w;
    const y = h - pad - ((v - min) / range) * (h - pad * 2);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  const line = points.join(" ");
  const area = `0,${h} ${line} ${w},${h}`;
  return `<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;display:block;">
    <defs><linearGradient id="gf-${color.replace('#','')}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${color}" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="${color}" stop-opacity="0.02"/>
    </linearGradient></defs>
    <polygon points="${area}" fill="url(#gf-${color.replace('#','')})" />
    <polyline points="${line}" fill="none" stroke="${color}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;
}

// ── CSS ─────────────────────────────────────────────────────────
function _css(cfg) {
  const s = cfg.style;
  return `
    :host { --accent: ${s.accent}; --heat: ${s.color_heating}; --dhw: ${s.color_dhw}; --idle: ${s.color_idle}; }
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    .card {
      background: var(--ha-card-background, var(--card-background-color, #fff));
      border-radius: var(--ha-card-border-radius, 16px);
      padding: 20px 22px; font-family: var(--ha-card-header-font-family, inherit);
      color: var(--primary-text-color); overflow: hidden;
    }

    /* ── Header ── */
    .hdr { display: flex; align-items: center; justify-content: space-between; margin-bottom: 18px; }
    .hdr-left { display: flex; align-items: center; gap: 10px; }
    .hdr-title { font-weight: 800; font-size: 1.15rem; letter-spacing: -0.3px; }
    .hdr ha-icon { --mdc-icon-size: 26px; color: var(--accent); }
    .status-pill {
      display: inline-flex; align-items: center; gap: 6px;
      font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px;
      padding: 4px 12px; border-radius: 20px;
      transition: background 0.4s, color 0.4s;
    }
    .status-pill .dot { width: 8px; height: 8px; border-radius: 50%; animation: pulse 2s infinite; }
    @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.45} }

    /* ── Hero Grid ── */
    .hero { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px; }
    .tile {
      position: relative; border-radius: 14px; padding: 16px 18px; height: 115px;
      background: var(--card-background-color, rgba(128,128,128,0.05));
      border: 1px solid rgba(128,128,128,0.07);
      display: flex; flex-direction: column; justify-content: space-between;
      cursor: pointer; overflow: hidden; transition: transform 0.15s ease, box-shadow 0.2s ease;
    }
    .tile:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(0,0,0,0.06); }
    .tile:active { transform: scale(0.98); }
    .tile .spark { position: absolute; bottom: 0; left: 0; width: 100%; height: 70%; opacity: ${s.graph_opacity}; pointer-events: none; }
    .tile .info { position: relative; z-index: 1; }
    .tile .lbl { font-size: 0.68rem; text-transform: uppercase; font-weight: 800; letter-spacing: 0.7px; color: var(--secondary-text-color); }
    .tile .val { font-size: 1.55rem; font-weight: 900; letter-spacing: -0.5px; margin-top: 4px; }
    .tile .sub { font-size: 0.65rem; color: var(--secondary-text-color); margin-top: 2px; font-weight: 600; }

    /* ── Efficiency ── */
    .eff { margin-bottom: 16px; }
    .eff-header { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 8px; }
    .eff-title { font-size: 0.78rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.6px; color: var(--secondary-text-color); }
    .eff-value { font-size: 1.3rem; font-weight: 900; color: var(--accent); }
    .eff-track { height: 8px; border-radius: 4px; background: rgba(128,128,128,0.1); overflow: hidden; }
    .eff-fill { height: 100%; border-radius: 4px; transition: width 0.8s cubic-bezier(.4,0,.2,1); background: linear-gradient(90deg, var(--accent), ${s.accent}cc); }

    /* ── Diagnostics ── */
    .diag { display: grid; grid-template-columns: repeat(3,1fr); gap: 10px; margin-bottom: 16px; }
    .diag-item { text-align: center; background: rgba(128,128,128,0.04); border-radius: 12px; padding: 14px 8px; }
    .diag-val { font-size: 1.05rem; font-weight: 800; }
    .diag-lbl { font-size: 0.6rem; text-transform: uppercase; color: var(--secondary-text-color); margin-top: 4px; font-weight: 700; letter-spacing: 0.5px; }

    /* ── Controls ── */
    .controls { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
    .ctrl-group { background: rgba(128,128,128,0.04); border-radius: 12px; padding: 14px 16px; }
    .ctrl-label { font-size: 0.65rem; text-transform: uppercase; font-weight: 800; letter-spacing: 0.6px; color: var(--secondary-text-color); margin-bottom: 8px; }
    .ctrl-row { display: flex; align-items: center; gap: 8px; }
    .ctrl-btn {
      flex: 1; border: none; border-radius: 8px; padding: 8px 4px; cursor: pointer;
      font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.4px;
      background: rgba(128,128,128,0.08); color: var(--primary-text-color);
      transition: all 0.15s ease;
    }
    .ctrl-btn:hover { background: rgba(128,128,128,0.15); }
    .ctrl-btn.active { background: var(--accent); color: #fff; }
    .ctrl-temp { display: flex; align-items: center; gap: 6px; justify-content: center; }
    .ctrl-temp button {
      width: 32px; height: 32px; border-radius: 50%; border: 1px solid rgba(128,128,128,0.15);
      background: rgba(128,128,128,0.06); color: var(--primary-text-color);
      font-size: 1.1rem; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center;
      transition: all 0.15s ease;
    }
    .ctrl-temp button:hover { background: var(--accent); color: #fff; border-color: var(--accent); }
    .ctrl-temp .temp-val { font-size: 1.15rem; font-weight: 800; min-width: 48px; text-align: center; }

    /* ── Footer ── */
    .footer { text-align: right; font-size: 0.55rem; color: rgba(128,128,128,0.3); margin-top: 10px; font-weight: 600; }
  `;
}

// ── MAIN CARD ───────────────────────────────────────────────────
class BuderusMonitorCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._built = false;
    this._historyCache = {};
    this._lastHistoryFetch = 0;
  }

  static getConfigElement() { return document.createElement("buderus-monitor-card-editor"); }
  static getStubConfig() { return {}; }

  setConfig(config) {
    this._config = _deep(BMC_DEFAULTS, config);
    if (this._built) this._applyCSS();
    if (this._hass) this._update();
  }

  set hass(hass) {
    this._hass = hass;
    this._update();
  }

  _update() {
    if (!this._config || !this._hass) return;
    if (!this._built) { this._build(); this._built = true; }
    this._refreshValues();
    this._fetchHistory();
  }

  _build() {
    const e = this._config.entities;
    this.shadowRoot.innerHTML = `
      <style id="s"></style>
      <div class="card">
        <div class="hdr">
          <div class="hdr-left">
            <ha-icon id="ico"></ha-icon>
            <span class="hdr-title" id="ttl"></span>
          </div>
          <span class="status-pill" id="status"><span class="dot"></span><span id="status-txt"></span></span>
        </div>
        <div class="hero">
          ${this._tileHTML("outside", "Außentemperatur", e.outside_temp)}
          ${this._tileHTML("flow", "Vorlauftemperatur", e.flow_temp)}
          ${this._tileHTML("dhw", "WW-Speicher", e.dhw_temp)}
          ${this._tileHTML("power", "Akt. Leistung", e.current_power)}
        </div>
        <div id="eff-area"></div>
        <div id="diag-area"></div>
        <div id="ctrl-area"></div>
        <div class="footer">Buderus Monitor v${BMC_VERSION}</div>
      </div>`;
    this._applyCSS();
    // Cache DOM refs
    this._dom = {
      ico: this.shadowRoot.getElementById("ico"),
      ttl: this.shadowRoot.getElementById("ttl"),
      status: this.shadowRoot.getElementById("status"),
      statusTxt: this.shadowRoot.getElementById("status-txt"),
      eff: this.shadowRoot.getElementById("eff-area"),
      diag: this.shadowRoot.getElementById("diag-area"),
      ctrl: this.shadowRoot.getElementById("ctrl-area"),
      tiles: {
        outside: { val: this.shadowRoot.getElementById("val-outside"), sub: this.shadowRoot.getElementById("sub-outside"), spark: this.shadowRoot.getElementById("spark-outside") },
        flow: { val: this.shadowRoot.getElementById("val-flow"), sub: this.shadowRoot.getElementById("sub-flow"), spark: this.shadowRoot.getElementById("spark-flow") },
        dhw: { val: this.shadowRoot.getElementById("val-dhw"), sub: this.shadowRoot.getElementById("sub-dhw"), spark: this.shadowRoot.getElementById("spark-dhw") },
        power: { val: this.shadowRoot.getElementById("val-power"), sub: this.shadowRoot.getElementById("sub-power"), spark: this.shadowRoot.getElementById("spark-power") },
      }
    };
    // Tile click → more-info
    ["outside","flow","dhw","power"].forEach(k => {
      const tile = this.shadowRoot.getElementById(`tile-${k}`);
      const eidMap = { outside: this._config.entities.outside_temp, flow: this._config.entities.flow_temp, dhw: this._config.entities.dhw_temp, power: this._config.entities.current_power };
      if (tile) tile.addEventListener("click", () => this._moreInfo(eidMap[k]));
    });
  }

  _tileHTML(id, label, entity) {
    return `<div class="tile" id="tile-${id}">
      <div class="spark" id="spark-${id}"></div>
      <div class="info">
        <div class="lbl">${label}</div>
        <div class="val" id="val-${id}">--</div>
        <div class="sub" id="sub-${id}"></div>
      </div>
    </div>`;
  }

  _applyCSS() {
    const el = this.shadowRoot.getElementById("s");
    if (el) el.textContent = _css(this._config);
  }

  _moreInfo(entityId) {
    const ev = new Event("hass-more-info", { bubbles: true, composed: true });
    ev.detail = { entityId };
    this.dispatchEvent(ev);
  }

  _sv(eid) {
    const s = this._hass.states[eid];
    if (!s) return { v: null, u: "", raw: null };
    const v = parseFloat(s.state);
    return { v: isNaN(v) ? null : v, u: s.attributes?.unit_of_measurement || "", raw: s.state, attr: s.attributes };
  }

  _fmt(v, u, decimals = 1) {
    if (v === null || v === undefined) return "--";
    return `${v.toFixed(decimals)} ${u}`.trim();
  }

  _refreshValues() {
    const c = this._config, e = c.entities, d = this._dom;

    // Title
    d.ttl.textContent = c.title;
    d.ico.setAttribute("icon", c.title_icon);

    // Status
    const heating = this._hass.states[e.heating_active]?.state === "on";
    const dhw = this._hass.states[e.dhw_active]?.state === "on";
    const mode = dhw ? "dhw" : heating ? "heating" : "idle";
    const modeColor = { dhw: "var(--dhw)", heating: "var(--heat)", idle: "var(--idle)" }[mode];
    const modeText = { dhw: "Warmwasser", heating: "Heizbetrieb", idle: "Standby" }[mode];
    d.status.style.background = modeColor + "18";
    d.status.style.color = modeColor;
    d.status.querySelector(".dot").style.background = modeColor;
    d.statusTxt.textContent = modeText;

    // Tiles
    const outside = this._sv(e.outside_temp);
    const flow = this._sv(e.flow_temp);
    const dhwT = this._sv(e.dhw_temp);
    const power = this._sv(e.current_power);
    const ret = this._sv(e.return_temp);

    d.tiles.outside.val.textContent = this._fmt(outside.v, "°C");
    d.tiles.flow.val.textContent = this._fmt(flow.v, "°C");
    d.tiles.dhw.val.textContent = this._fmt(dhwT.v, "°C");
    d.tiles.power.val.textContent = this._fmt(power.v, power.u, 0);

    // Subtitles
    if (flow.v !== null && ret.v !== null) {
      d.tiles.flow.sub.textContent = `ΔT ${(flow.v - ret.v).toFixed(1)} K`;
    }
    const dhwSet = this._sv(e.dhw_setpoint);
    if (dhwT.v !== null && dhwSet.v !== null) {
      d.tiles.dhw.sub.textContent = `Soll: ${dhwSet.v.toFixed(0)} °C`;
    }

    // Efficiency
    if (c.show_efficiency) {
      const pOut = this._sv(e.power_output);
      const pIn = this._sv(e.current_power);
      let cop = 0;
      if (pIn.v && pIn.v > 100 && pOut.v) cop = pOut.v / pIn.v;
      const pct = Math.min(cop / 6 * 100, 100);
      d.eff.innerHTML = `<div class="eff">
        <div class="eff-header"><span class="eff-title">Effizienz (COP)</span><span class="eff-value">${cop.toFixed(2)}</span></div>
        <div class="eff-track"><div class="eff-fill" style="width:${pct}%"></div></div>
      </div>`;
    } else { d.eff.innerHTML = ""; }

    // Diagnostics
    if (c.show_diagnostics) {
      const delta = (flow.v !== null && ret.v !== null) ? (flow.v - ret.v).toFixed(1) : "--";
      const mod = this._sv(e.compressor_speed);
      const starts = this._sv(e.compressor_starts);
      d.diag.innerHTML = `<div class="diag">
        <div class="diag-item"><div class="diag-val">${delta} K</div><div class="diag-lbl">Spreizung</div></div>
        <div class="diag-item"><div class="diag-val">${mod.raw ?? "--"} %</div><div class="diag-lbl">Modulation</div></div>
        <div class="diag-item"><div class="diag-val">${starts.raw ?? "--"}</div><div class="diag-lbl">Starts</div></div>
      </div>`;
    } else { d.diag.innerHTML = ""; }

    // Controls
    if (c.show_controls) {
      this._renderControls();
    } else { d.ctrl.innerHTML = ""; }
  }

  _renderControls() {
    const e = this._config.entities, d = this._dom;
    const heatingMode = this._hass.states[e.heating_mode];
    const dhwMode = this._hass.states[e.dhw_mode];
    const dhwSet = this._sv(e.dhw_setpoint);

    if (!heatingMode && !dhwMode) { d.ctrl.innerHTML = ""; return; }

    let html = '<div class="controls">';

    if (heatingMode) {
      const opts = heatingMode.attributes?.options || ["off","auto","heat"];
      const cur = heatingMode.state;
      html += `<div class="ctrl-group">
        <div class="ctrl-label">Heizmodus</div>
        <div class="ctrl-row">
          ${opts.map(o => `<button class="ctrl-btn ${cur === o ? "active" : ""}" data-svc="heating_mode" data-val="${o}">${this._modeLabel(o)}</button>`).join("")}
        </div>
      </div>`;
    }

    if (dhwMode || dhwSet.v !== null) {
      html += `<div class="ctrl-group">
        <div class="ctrl-label">Warmwasser</div>`;
      if (dhwSet.v !== null) {
        html += `<div class="ctrl-temp">
          <button data-svc="dhw_temp" data-val="down">−</button>
          <span class="temp-val">${dhwSet.v.toFixed(0)}°C</span>
          <button data-svc="dhw_temp" data-val="up">+</button>
        </div>`;
      }
      html += `</div>`;
    }

    html += "</div>";
    d.ctrl.innerHTML = html;

    // Bind control events
    d.ctrl.querySelectorAll("[data-svc]").forEach(btn => {
      btn.addEventListener("click", (ev) => {
        const svc = ev.currentTarget.dataset.svc;
        const val = ev.currentTarget.dataset.val;
        if (svc === "heating_mode") {
          this._hass.callService("select", "select_option", { entity_id: e.heating_mode, option: val });
        } else if (svc === "dhw_temp") {
          const cur = this._sv(e.dhw_setpoint).v || 50;
          const next = val === "up" ? cur + 1 : cur - 1;
          this._hass.callService("number", "set_value", { entity_id: e.dhw_setpoint, value: Math.max(30, Math.min(65, next)) });
        }
      });
    });
  }

  _modeLabel(mode) {
    const map = { off: "Aus", auto: "Auto", heat: "Heizen", cool: "Kühlen", manual: "Manuell", eco: "Eco" };
    return map[mode] || mode;
  }

  // ── History for sparklines (throttled, no mini-graph-card dependency) ──
  async _fetchHistory() {
    const now = Date.now();
    if (now - this._lastHistoryFetch < 60000) return; // max once per minute
    this._lastHistoryFetch = now;

    const tileMap = {
      outside: this._config.entities.outside_temp,
      flow: this._config.entities.flow_temp,
      dhw: this._config.entities.dhw_temp,
      power: this._config.entities.current_power,
    };

    const hours = this._config.graph_hours;
    const start = new Date(now - hours * 3600000).toISOString();
    const entityIds = Object.values(tileMap).join(",");

    try {
      const url = `history/period/${start}?filter_entity_id=${entityIds}&minimal_response&no_attributes`;
      const result = await this._hass.callApi("GET", url);
      if (!Array.isArray(result)) return;

      result.forEach(entityHistory => {
        if (!entityHistory.length) return;
        const eid = entityHistory[0].entity_id;
        this._historyCache[eid] = entityHistory;
      });

      // Render sparklines
      for (const [key, eid] of Object.entries(tileMap)) {
        const sparkEl = this._dom.tiles[key]?.spark;
        if (!sparkEl || !this._historyCache[eid]) continue;
        const color = key === "power" ? this._config.style.accent : (key === "dhw" ? this._config.style.color_dhw : this._config.style.accent);
        sparkEl.innerHTML = _sparklineSVG(this._historyCache[eid], color);
      }
    } catch (e) {
      // History API not available - silently skip sparklines
    }
  }

  getCardSize() { return 5; }
}

// ── EDITOR ──────────────────────────────────────────────────────
class BuderusMonitorCardEditor extends HTMLElement {
  constructor() { super(); this.attachShadow({ mode: "open" }); }

  setConfig(config) { this._config = _deep(BMC_DEFAULTS, config); this._render(); }

  _render() {
    const c = this._config;
    this.shadowRoot.innerHTML = `
      <style>
        .editor { padding: 16px; font-family: var(--ha-card-header-font-family, sans-serif); }
        details { margin-bottom: 12px; }
        summary { font-weight: 700; font-size: 0.9rem; cursor: pointer; padding: 8px 0; border-bottom: 1px solid rgba(128,128,128,0.15); }
        .field { margin: 8px 0; }
        .field label { display: block; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: var(--secondary-text-color); margin-bottom: 4px; }
        .field input, .field select { width: 100%; padding: 8px 10px; border-radius: 8px; border: 1px solid rgba(128,128,128,0.2); background: rgba(128,128,128,0.05); color: var(--primary-text-color); font-size: 0.85rem; }
        .row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .toggle { display: flex; align-items: center; gap: 8px; margin: 8px 0; }
        .toggle input[type=checkbox] { width: 18px; height: 18px; }
        .toggle label { font-size: 0.82rem; font-weight: 600; }
      </style>
      <div class="editor">
        <details open>
          <summary>Allgemein</summary>
          ${this._field("title", "Titel", c.title)}
          ${this._field("title_icon", "Icon", c.title_icon)}
          ${this._field("graph_hours", "Graph Stunden", c.graph_hours, "number")}
        </details>
        <details>
          <summary>Anzeige</summary>
          ${this._toggle("show_efficiency", "COP Effizienz-Balken", c.show_efficiency)}
          ${this._toggle("show_diagnostics", "Diagnose (Starts/Mod/Spreizung)", c.show_diagnostics)}
          ${this._toggle("show_controls", "Steuerung anzeigen", c.show_controls)}
        </details>
        <details>
          <summary>Entities</summary>
          ${Object.entries(c.entities).map(([k,v]) => this._field(`entities.${k}`, k.replace(/_/g, " "), v)).join("")}
        </details>
        <details>
          <summary>Farben</summary>
          <div class="row">
            ${this._field("style.accent", "Akzent", c.style.accent, "color")}
            ${this._field("style.color_heating", "Heizen", c.style.color_heating, "color")}
            ${this._field("style.color_dhw", "Warmwasser", c.style.color_dhw, "color")}
            ${this._field("style.color_idle", "Standby", c.style.color_idle, "color")}
          </div>
          ${this._field("style.graph_opacity", "Graph Deckkraft", c.style.graph_opacity, "number")}
        </details>
      </div>`;

    // Bind events
    this.shadowRoot.querySelectorAll("[data-key]").forEach(el => {
      el.addEventListener(el.type === "checkbox" ? "change" : "input", (e) => {
        const key = e.target.dataset.key;
        let val = e.target.type === "checkbox" ? e.target.checked : e.target.value;
        if (e.target.type === "number") val = parseFloat(val);
        this._set(key, val);
      });
    });
  }

  _field(key, label, value, type = "text") {
    return `<div class="field"><label>${label}</label><input type="${type}" data-key="${key}" value="${value}" /></div>`;
  }

  _toggle(key, label, checked) {
    return `<div class="toggle"><input type="checkbox" data-key="${key}" ${checked ? "checked" : ""} /><label>${label}</label></div>`;
  }

  _set(key, value) {
    const parts = key.split(".");
    const cfg = JSON.parse(JSON.stringify(this._config));
    let obj = cfg;
    for (let i = 0; i < parts.length - 1; i++) obj = obj[parts[i]];
    obj[parts[parts.length - 1]] = value;
    this._config = cfg;
    this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: cfg }, bubbles: true, composed: true }));
  }
}

// ── REGISTER ────────────────────────────────────────────────────
customElements.define("buderus-monitor-card", BuderusMonitorCard);
customElements.define("buderus-monitor-card-editor", BuderusMonitorCardEditor);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "buderus-monitor-card",
  name: `Buderus Pro Monitor v${BMC_VERSION}`,
  description: "Wärmepumpen-Dashboard mit Sparklines, Steuerung & Diagnose",
  preview: true,
});

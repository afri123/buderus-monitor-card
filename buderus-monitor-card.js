// ================================================================
// Buderus Monitor Card v0.0.9
// Full EMS-ESP integration · mini-graph-card · Visual Editor
// ================================================================

const BMC_VERSION = "0.0.9";

/* ── Graph color palette – one distinct color per slot ─────────── */
const BMC_GRAPH_COLORS = [
  "#4fc3f7", "#81c784", "#ffb74d", "#f06292", "#ba68c8",
  "#4db6ac", "#ff8a65", "#a1887f", "#90a4ae", "#fff176",
  "#80cbc4", "#ce93d8", "#ef9a9a", "#80deea", "#c5e1a5",
  "#ffe082", "#b39ddb", "#80cbc4", "#ffcc80", "#bcaaa4"
];

/* ── Default Entity Map ───────────────────────────────────────── */
const BMC_ENTITY_DEFAULTS = {
  // Hero metrics
  outside_temp:       "sensor.boiler_outside_temperature",
  flow_temp:          "sensor.boiler_current_flow_temperature",
  return_temp:        "sensor.boiler_return_temperature",
  dhw_temp:           "sensor.boiler_reservoir_temp_tw1",
  compressor_power:   "sensor.boiler_compressor_current_power",
  compressor_output:  "sensor.boiler_compressor_power_output",
  compressor_speed:   "sensor.boiler_compressor_speed",

  // Status
  heating_active:     "binary_sensor.boiler_heating_active",
  tapwater_active:    "binary_sensor.boiler_tapwater_active",
  heating_pump:       "binary_sensor.boiler_heating_pump",
  hp_compressor:      "binary_sensor.boiler_hp_compressor",
  aux_heater_status:  "binary_sensor.boiler_aux_heater_status",

  // Temperatures
  air_inlet_tl2:      "sensor.boiler_air_inlet_temperature_tl2",
  high_pressure_ph1:  "sensor.boiler_high_pressure_side_temperature_ph1",
  low_pressure_pl1:   "sensor.boiler_low_pressure_side_temperature_pl1",
  compressor_tr1:     "sensor.boiler_compressor_temperature_tr1",
  compressor_inlet_tr5: "sensor.boiler_compressor_inlet_temperature_tr5",
  compressor_outlet_tr6: "sensor.boiler_compressor_outlet_temperature_tr6",
  condenser_tc3:      "sensor.boiler_condenser_temperature_tc3",
  evaporator_tr4:     "sensor.boiler_evaporator_inlet_temperature_tr4",
  heat_carrier_tc0:   "sensor.boiler_heat_carrier_return_tc0",
  heat_carrier_tc1:   "sensor.boiler_heat_carrier_forward_tc1",
  refrigerant_tr3:    "sensor.boiler_refrigerant_temperature_liquid_side_condenser_output_tr3",
  drain_pan_ta4:      "sensor.boiler_drain_pan_temp_ta4",
  low_loss_header:    "sensor.boiler_low_loss_header",
  brine_out:          "sensor.boiler_brine_out_condenser",
  brine_in:           "sensor.boiler_brine_in_evaporator",
  damped_outdoor:     "sensor.thermostat_damped_outdoor_temperature",

  // Energy
  total_energy_consumption: "sensor.boiler_total_energy_consumption",
  total_energy_supplied:    "sensor.boiler_total_energy_supplied",
  energy_consumption_heating: "sensor.boiler_energy_consumption_compressor_heating",
  energy_consumption_cooling: "sensor.boiler_energy_consumption_compressor_cooling",
  energy_supplied_heating:    "sensor.boiler_total_energy_supplied_heating",
  energy_supplied_cooling:    "sensor.boiler_total_energy_supplied_cooling",
  total_aux_consumption:      "sensor.boiler_total_aux_elec_heater_energy_consumption",
  dhw_energy_consumption:     "sensor.boiler_dhw_energy_consumption_compressor",
  dhw_energy_supplied:        "sensor.boiler_dhw_total_energy_warm_supplied",

  // Compressor/Operating
  compressor_activity:   "sensor.boiler_compressor_activity",
  compressor_starts:     "sensor.boiler_total_compressor_control_starts",
  heating_control_starts: "sensor.boiler_heating_control_starts",
  cooling_control_starts: "sensor.boiler_cooling_control_starts",
  burner_starts:          "sensor.boiler_burner_starts",
  op_time_heating:        "sensor.boiler_operating_time_compressor_heating",
  op_time_cooling:        "sensor.boiler_operating_time_compressor_cooling",
  total_uptime:           "sensor.boiler_heatpump_total_uptime",
  total_heat_op_time:     "sensor.boiler_total_heat_operating_time",
  heating_pump_mod:       "sensor.boiler_heating_pump_modulation",
  brine_pump_speed:       "sensor.boiler_brine_pump_speed",
  circ_pump_speed:        "sensor.boiler_circulation_pump_speed",
  aux_heater_level:       "sensor.boiler_aux_heater_level",
  aux_heater_valve:       "sensor.boiler_aux_heater_mixing_valve",
  four_way_valve:         "sensor.boiler_4_way_valve_vr4",
  burner_power:           "sensor.boiler_burner_current_power",

  // DHW
  dhw_set_temp:           "sensor.boiler_dhw_set_temperature",
  dhw_intern_temp:        "sensor.boiler_dhw_current_intern_temperature",
  dhw_extern_temp:        "sensor.boiler_dhw_current_extern_temperature",
  dhw_tap_flow:           "sensor.boiler_dhw_current_tap_water_flow",
  dhw_active_time:        "sensor.boiler_dhw_active_time",
  dhw_starts:             "sensor.boiler_dhw_starts",
  dhw_starts_hp:          "sensor.boiler_dhw_starts_hp",
  dhw_op_time:            "sensor.boiler_dhw_operating_time_compressor",
  dhw_charging:           "binary_sensor.boiler_dhw_charging",
  dhw_recharging:         "binary_sensor.boiler_dhw_recharging",
  dhw_temp_ok:            "binary_sensor.boiler_dhw_temperature_ok",
  dhw_3way:               "binary_sensor.boiler_dhw_3_way_valve_active",

  // Service
  last_error:       "sensor.boiler_last_error_code",
  service_code:     "sensor.boiler_service_code",
  service_code_num: "sensor.boiler_service_code_number",

  // Binary misc
  switch_valve:     "binary_sensor.boiler_switch_valve",
  condensate_ea0:   "binary_sensor.boiler_condensate_reservoir_heating_ea0",
  pc1:              "binary_sensor.boiler_pc1",
  input_1:          "binary_sensor.boiler_input_1_state",
  input_2:          "binary_sensor.boiler_input_2_state",
  input_3:          "binary_sensor.boiler_input_3_state",
  input_4:          "binary_sensor.boiler_input_4_state",

  // System
  sys_ems_bus:      "sensor.system_ems_bus",
  sys_free_mem:     "sensor.system_free_memory",
  sys_uptime:       "sensor.system_uptime",
  sys_version:      "sensor.system_version",
  sys_wifi_rssi:    "sensor.system_wifi_rssi",
  sys_wifi_strength: "sensor.system_wifi_strength",
  sys_status:       "binary_sensor.system_status",
  sys_rx_received:  "sensor.system_rx_received",
  sys_rx_fails:     "sensor.system_rx_fails",
  sys_tx_reads:     "sensor.system_tx_reads",
  sys_tx_writes:    "sensor.system_tx_writes",
  sys_tx_fails:     "sensor.system_tx_fails",
  sys_mqtt_fails:   "sensor.system_mqtt_fails",

  // Thermostat controls
  thermo_hc1:               "climate.thermostat_hc1",
  thermo_hc1_mode:          "select.thermostat_hc1_operating_mode",
  thermo_hc1_hp_mode:       "select.thermostat_hc1_hp_mode",
  thermo_hc1_hp_op_mode:    "select.thermostat_hc1_heatpump_operating_mode",
  thermo_hc1_control_mode:  "select.thermostat_hc1_control_mode",
  thermo_hc1_program:       "select.thermostat_hc1_program",
  thermo_hc1_reduce_mode:   "select.thermostat_hc1_reduce_mode",
  thermo_hc1_summer_mode_sel: "select.thermostat_hc1_set_summer_mode",
  thermo_hc1_nofrost_mode:  "select.thermostat_hc1_nofrost_mode",
  thermo_hc1_heating_type:  "select.thermostat_hc1_heating_type",
  thermo_hc1_control_device: "select.thermostat_hc1_control_device",
  thermo_hc1_selected_temp: "number.thermostat_hc1_selected_room_temperature",
  thermo_hc1_comfort_temp:  "number.thermostat_hc1_comfort_temperature",
  thermo_hc1_eco_temp:      "number.thermostat_hc1_eco_temperature",
  thermo_hc1_manual_temp:   "number.thermostat_hc1_manual_temperature",
  thermo_hc1_design_temp:   "number.thermostat_hc1_design_temperature",
  thermo_hc1_max_flow:      "number.thermostat_hc1_max_flow_temperature",
  thermo_hc1_min_flow:      "number.thermostat_hc1_min_flow_temperature",
  thermo_hc1_hp_min_flow:   "number.thermostat_hc1_hp_min_flow_temp",
  thermo_hc1_summer_temp:   "number.thermostat_hc1_summer_temperature",
  thermo_hc1_nofrost_temp:  "number.thermostat_hc1_nofrost_temperature",
  thermo_hc1_offset:        "number.thermostat_hc1_offset_temperature",
  thermo_hc1_room_influence: "number.thermostat_hc1_room_influence",
  thermo_hc1_room_influence_factor: "number.thermostat_hc1_room_influence_factor",
  thermo_hc1_dew_offset:    "number.thermostat_hc1_dew_point_offset",
  thermo_hc1_cooling_start: "number.thermostat_hc1_cooling_starttemp",
  thermo_hc1_fast_heatup:   "number.thermostat_hc1_fast_heatup",
  thermo_hc1_heat_on_delay: "number.thermostat_hc1_heat_on_delay",
  thermo_hc1_heat_off_delay: "number.thermostat_hc1_heat_off_delay",
  thermo_hc1_cooling_on_delay: "number.thermostat_hc1_cooling_on_delay",
  thermo_hc1_cooling_off_delay: "number.thermostat_hc1_cooling_off_delay",
  thermo_hc1_no_reduce_below: "number.thermostat_hc1_no_reduce_below_temperature",
  thermo_hc1_off_reduce_switch: "number.thermostat_hc1_off_reduce_switch_temperature",
  thermo_hc1_room_temp_remote: "number.thermostat_hc1_room_temperature_from_remote",
  thermo_hc1_room_humidity_remote: "number.thermostat_hc1_room_humidity_from_remote",
  thermo_hc1_room_temp_diff: "number.thermostat_hc1_room_temp_difference",
  thermo_hc1_instant_start:  "number.thermostat_hc1_instant_start",
  thermo_hc1_temp_auto:      "number.thermostat_hc1_temporary_set_temperature_automode",
  thermo_hc1_temp_remote:    "number.thermostat_hc1_temporary_set_temperature_from_remote",
  thermo_hc1_switch_opt:     "switch.thermostat_hc1_switch_on_optimization",
  thermo_hc1_dhw_priority:   "switch.thermostat_hc1_dhw_priority",

  // Thermostat sensors
  thermo_hc1_target_flow:   "sensor.thermostat_hc1_target_flow_temperature",
  thermo_hc1_room_influence_cur: "sensor.thermostat_hc1_current_room_influence",
  thermo_hc1_cooling_on:    "binary_sensor.thermostat_hc1_cooling_on",
  thermo_hc1_mode_type:     "sensor.thermostat_hc1_mode_type",
  thermo_hc1_summer_mode:   "sensor.thermostat_hc1_summer_mode",
  thermo_hc1_hp_op_state:   "sensor.thermostat_hc1_heatpump_operating_state",
  thermo_floor_drying:      "sensor.thermostat_floor_drying",
  thermo_floor_drying_temp: "sensor.thermostat_floor_drying_temperature",

  // Thermostat DHW controls
  thermo_dhw_mode:           "select.thermostat_dhw_operating_mode",
  thermo_dhw_circ_mode:      "select.thermostat_dhw_circulation_pump_mode",
  thermo_dhw_disinfect_day:  "select.thermostat_dhw_disinfection_day",
  thermo_dhw_disinfect_time: "number.thermostat_dhw_disinfection_time",
  thermo_dhw_disinfecting:   "switch.thermostat_dhw_disinfecting",
  thermo_dhw_charge_dur:     "number.thermostat_dhw_charge_duration",
  thermo_dhw_charge:         "switch.thermostat_dhw_charge",
  thermo_dhw_daily:          "switch.thermostat_dhw_daily_heating",
  thermo_dhw_daily_time:     "number.thermostat_dhw_daily_heating_time",
  thermo_dhw_extra:          "binary_sensor.thermostat_dhw_extra",

  // Thermostat misc
  thermo_damping:       "switch.thermostat_damping_outdoor_temperature",
  thermo_raise_dhw:     "switch.thermostat_enable_raise_dhw",
  thermo_raise_heating: "number.thermostat_raise_heating_with_pv",
  thermo_lower_cooling: "number.thermostat_lower_cooling_with_pv",
  thermo_energy_ratio:  "number.thermostat_energy_cost_ratio",
  thermo_building_type: "select.thermostat_building_type",
  thermo_int_temp_offset: "number.thermostat_internal_temperature_offset",
  thermo_min_ext_temp:  "number.thermostat_minimal_external_temperature",
  thermo_datetime:      "text.thermostat_date_time",
};

/* ── German Labels ────────────────────────────────────────────── */
const BMC_LABELS = {
  outside_temp: "Außentemperatur", flow_temp: "Vorlauftemperatur", return_temp: "Rücklauftemperatur",
  dhw_temp: "WW-Speicher", compressor_power: "Kompressor Leistung", compressor_output: "Kompressor Ausgang",
  compressor_speed: "Kompressor Drehzahl", heating_active: "Heizen aktiv", tapwater_active: "Warmwasser aktiv",
  heating_pump: "Heizungspumpe", hp_compressor: "HP Kompressor", aux_heater_status: "Zuheizer Status",
  air_inlet_tl2: "Lufteinlass TL2", high_pressure_ph1: "Hochdruck PH1", low_pressure_pl1: "Niederdruck PL1",
  compressor_tr1: "Kompressor TR1", compressor_inlet_tr5: "Komp. Einlass TR5",
  compressor_outlet_tr6: "Komp. Auslass TR6", condenser_tc3: "Kondensator TC3",
  evaporator_tr4: "Verdampfer TR4", heat_carrier_tc0: "Wärmeträger Rücklauf TC0",
  heat_carrier_tc1: "Wärmeträger Vorlauf TC1", refrigerant_tr3: "Kältemittel TR3",
  drain_pan_ta4: "Abtauwanne TA4", low_loss_header: "Hydraulische Weiche",
  brine_out: "Sole Ausgang", brine_in: "Sole Eingang", damped_outdoor: "Gedämpfte Außentemp.",
  total_energy_consumption: "Gesamtverbrauch", total_energy_supplied: "Gesamte Wärme",
  energy_consumption_heating: "Verbrauch Heizen", energy_consumption_cooling: "Verbrauch Kühlen",
  energy_supplied_heating: "Wärme Heizen", energy_supplied_cooling: "Wärme Kühlen",
  total_aux_consumption: "Zuheizer Verbrauch", dhw_energy_consumption: "WW Verbrauch",
  dhw_energy_supplied: "WW Wärme", compressor_activity: "Komp. Aktivität",
  compressor_starts: "Komp. Starts", heating_control_starts: "Heiz-Starts",
  cooling_control_starts: "Kühl-Starts", burner_starts: "Brenner-Starts",
  op_time_heating: "Laufzeit Heizen", op_time_cooling: "Laufzeit Kühlen",
  total_uptime: "Gesamt Laufzeit", total_heat_op_time: "Heiz-Betriebszeit",
  heating_pump_mod: "Pumpe Modulation", brine_pump_speed: "Solepumpe",
  circ_pump_speed: "Zirk.pumpe", aux_heater_level: "Zuheizer Stufe",
  aux_heater_valve: "Zuheizer Mischer", four_way_valve: "4-Wege-Ventil VR4",
  burner_power: "Brennerleistung", dhw_set_temp: "WW Solltemp.",
  dhw_intern_temp: "WW Intern", dhw_extern_temp: "WW Extern",
  dhw_tap_flow: "Zapfmenge", dhw_active_time: "WW Aktivzeit",
  dhw_starts: "WW Starts", dhw_starts_hp: "WW Starts HP", dhw_op_time: "WW Laufzeit Komp.",
  dhw_charging: "WW Ladung", dhw_recharging: "WW Nachladung", dhw_temp_ok: "WW Temp. OK",
  dhw_3way: "WW 3-Wege-Ventil", last_error: "Letzter Fehler",
  service_code: "Servicecode", service_code_num: "Servicecode Nr.",
  switch_valve: "Umschaltventil", condensate_ea0: "Kondensatheizung EA0",
  pc1: "PC1", input_1: "Eingang 1", input_2: "Eingang 2", input_3: "Eingang 3", input_4: "Eingang 4",
  sys_ems_bus: "EMS Bus", sys_free_mem: "Freier Speicher", sys_uptime: "Betriebszeit",
  sys_version: "Version", sys_wifi_rssi: "WiFi RSSI", sys_wifi_strength: "WiFi Stärke",
  sys_status: "System Status", sys_rx_received: "RX Empfangen", sys_rx_fails: "RX Fehler",
  sys_tx_reads: "TX Reads", sys_tx_writes: "TX Writes", sys_tx_fails: "TX Fehler",
  sys_mqtt_fails: "MQTT Fehler",
  thermo_hc1: "Thermostat HC1", thermo_hc1_mode: "Betriebsmodus",
  thermo_hc1_hp_mode: "WP Modus", thermo_hc1_hp_op_mode: "WP Betriebsmodus",
  thermo_hc1_control_mode: "Regelungsmodus", thermo_hc1_program: "Programm",
  thermo_hc1_reduce_mode: "Absenkungsmodus", thermo_hc1_summer_mode_sel: "Sommermodus",
  thermo_hc1_nofrost_mode: "Frostschutz Modus", thermo_hc1_heating_type: "Heizungsart",
  thermo_hc1_control_device: "Regelgerät", thermo_hc1_selected_temp: "Raumtemp. Soll",
  thermo_hc1_comfort_temp: "Komforttemp.", thermo_hc1_eco_temp: "Eco Temp.",
  thermo_hc1_manual_temp: "Manuell Temp.", thermo_hc1_design_temp: "Auslegungstemp.",
  thermo_hc1_max_flow: "Max. Vorlauf", thermo_hc1_min_flow: "Min. Vorlauf",
  thermo_hc1_hp_min_flow: "WP Min. Vorlauf", thermo_hc1_summer_temp: "Sommertemp.",
  thermo_hc1_nofrost_temp: "Frostschutz Temp.", thermo_hc1_offset: "Offset Temp.",
  thermo_hc1_room_influence: "Raumeinfluss", thermo_hc1_room_influence_factor: "Raumeinfluss Faktor",
  thermo_hc1_dew_offset: "Taupunkt Offset", thermo_hc1_cooling_start: "Kühlung Starttemp.",
  thermo_hc1_fast_heatup: "Schnellaufheizung", thermo_hc1_heat_on_delay: "Heiz Ein-Verzögerung",
  thermo_hc1_heat_off_delay: "Heiz Aus-Verzögerung", thermo_hc1_cooling_on_delay: "Kühl Ein-Verzögerung",
  thermo_hc1_cooling_off_delay: "Kühl Aus-Verzögerung",
  thermo_hc1_no_reduce_below: "Keine Absenkung unter",
  thermo_hc1_off_reduce_switch: "Aus/Absenk. Schalttemp.",
  thermo_hc1_room_temp_remote: "Raumtemp. Remote", thermo_hc1_room_humidity_remote: "Raumfeuchte Remote",
  thermo_hc1_room_temp_diff: "Raumtemp. Differenz", thermo_hc1_instant_start: "Sofortstart",
  thermo_hc1_temp_auto: "Temp. Auto", thermo_hc1_temp_remote: "Temp. Remote",
  thermo_hc1_switch_opt: "Einschaltoptimierung", thermo_hc1_dhw_priority: "WW Priorität",
  thermo_hc1_target_flow: "Soll-Vorlauftemp.", thermo_hc1_room_influence_cur: "Akt. Raumeinfluss",
  thermo_hc1_cooling_on: "Kühlung aktiv", thermo_hc1_mode_type: "Modus Typ",
  thermo_hc1_summer_mode: "Sommermodus", thermo_hc1_hp_op_state: "WP Betriebszustand",
  thermo_floor_drying: "Estrichtrocknung", thermo_floor_drying_temp: "Estrichtrocknungstemp.",
  thermo_dhw_mode: "WW Betriebsmodus", thermo_dhw_circ_mode: "Zirk.pumpe Modus",
  thermo_dhw_disinfect_day: "Desinfektion Tag", thermo_dhw_disinfect_time: "Desinfektion Zeit",
  thermo_dhw_disinfecting: "Desinfizieren", thermo_dhw_charge_dur: "Ladedauer",
  thermo_dhw_charge: "WW Laden", thermo_dhw_daily: "Tägl. Aufheizung",
  thermo_dhw_daily_time: "Tägl. Aufheizzeit", thermo_dhw_extra: "WW Extra",
  thermo_damping: "Außentemp. Dämpfung", thermo_raise_dhw: "WW PV-Anhebung",
  thermo_raise_heating: "Heizen PV-Anhebung", thermo_lower_cooling: "Kühlen PV-Absenkung",
  thermo_energy_ratio: "Energiekosten-Verhältnis", thermo_building_type: "Gebäudetyp",
  thermo_int_temp_offset: "Int. Temp. Offset", thermo_min_ext_temp: "Min. Außentemp.",
  thermo_datetime: "Datum/Zeit",
};

/* ── Section Definitions (for tabs) ───────────────────────────── */
const BMC_SECTIONS = {
  hero: {
    label: "Dashboard",
    icon: "mdi:view-dashboard",
    metrics: ["outside_temp", "flow_temp", "return_temp", "dhw_temp", "compressor_power", "compressor_speed"],
    graphs: ["outside_temp", "flow_temp", "return_temp", "dhw_temp", "compressor_power", "compressor_speed"]
  },
  temperatures: {
    label: "Temperaturen",
    icon: "mdi:thermometer",
    metrics: [
      "air_inlet_tl2", "high_pressure_ph1", "low_pressure_pl1", "compressor_tr1",
      "compressor_inlet_tr5", "compressor_outlet_tr6", "condenser_tc3", "evaporator_tr4",
      "heat_carrier_tc0", "heat_carrier_tc1", "refrigerant_tr3", "drain_pan_ta4",
      "low_loss_header", "brine_out", "brine_in", "damped_outdoor"
    ]
  },
  energy: {
    label: "Energie",
    icon: "mdi:lightning-bolt",
    metrics: [
      "total_energy_consumption", "total_energy_supplied", "energy_consumption_heating",
      "energy_consumption_cooling", "energy_supplied_heating", "energy_supplied_cooling",
      "total_aux_consumption", "dhw_energy_consumption", "dhw_energy_supplied"
    ]
  },
  compressor: {
    label: "Kompressor",
    icon: "mdi:engine",
    metrics: [
      "compressor_activity", "compressor_output", "compressor_starts",
      "heating_control_starts", "cooling_control_starts", "burner_starts",
      "op_time_heating", "op_time_cooling", "total_uptime", "total_heat_op_time",
      "heating_pump_mod", "brine_pump_speed", "circ_pump_speed",
      "aux_heater_level", "aux_heater_valve", "four_way_valve", "burner_power"
    ]
  },
  dhw: {
    label: "Warmwasser",
    icon: "mdi:water-boiler",
    metrics: [
      "dhw_set_temp", "dhw_intern_temp", "dhw_extern_temp", "dhw_tap_flow",
      "dhw_active_time", "dhw_starts", "dhw_starts_hp", "dhw_op_time",
      "dhw_charging", "dhw_recharging", "dhw_temp_ok", "dhw_3way"
    ]
  },
  thermostat: {
    label: "Thermostat",
    icon: "mdi:thermostat",
    controls: [
      "thermo_hc1_mode", "thermo_hc1_hp_mode", "thermo_hc1_hp_op_mode",
      "thermo_hc1_control_mode", "thermo_hc1_program", "thermo_hc1_reduce_mode",
      "thermo_hc1_summer_mode_sel", "thermo_hc1_nofrost_mode", "thermo_hc1_heating_type",
      "thermo_hc1_control_device", "thermo_hc1_selected_temp", "thermo_hc1_comfort_temp",
      "thermo_hc1_eco_temp", "thermo_hc1_manual_temp", "thermo_hc1_design_temp",
      "thermo_hc1_max_flow", "thermo_hc1_min_flow", "thermo_hc1_hp_min_flow",
      "thermo_hc1_summer_temp", "thermo_hc1_nofrost_temp", "thermo_hc1_offset",
      "thermo_hc1_room_influence", "thermo_hc1_dew_offset", "thermo_hc1_cooling_start",
      "thermo_hc1_fast_heatup", "thermo_hc1_heat_on_delay", "thermo_hc1_heat_off_delay",
      "thermo_hc1_cooling_on_delay", "thermo_hc1_cooling_off_delay",
      "thermo_hc1_switch_opt", "thermo_hc1_dhw_priority"
    ],
    sensors: [
      "thermo_hc1_target_flow", "thermo_hc1_room_influence_cur", "thermo_hc1_cooling_on",
      "thermo_hc1_mode_type", "thermo_hc1_summer_mode", "thermo_hc1_hp_op_state",
      "thermo_floor_drying", "thermo_floor_drying_temp"
    ]
  },
  dhw_control: {
    label: "WW Steuerung",
    icon: "mdi:water-thermometer",
    controls: [
      "thermo_dhw_mode", "thermo_dhw_circ_mode", "thermo_dhw_disinfect_day",
      "thermo_dhw_disinfect_time", "thermo_dhw_disinfecting", "thermo_dhw_charge_dur",
      "thermo_dhw_charge", "thermo_dhw_daily", "thermo_dhw_daily_time"
    ],
    sensors: ["thermo_dhw_extra"]
  },
  pv_settings: {
    label: "PV & Gebäude",
    icon: "mdi:solar-power",
    controls: [
      "thermo_raise_dhw", "thermo_raise_heating", "thermo_lower_cooling",
      "thermo_energy_ratio", "thermo_building_type", "thermo_damping",
      "thermo_int_temp_offset", "thermo_min_ext_temp"
    ]
  },
  system: {
    label: "System",
    icon: "mdi:chip",
    metrics: [
      "sys_ems_bus", "sys_free_mem", "sys_uptime", "sys_version",
      "sys_wifi_rssi", "sys_wifi_strength", "sys_status",
      "sys_rx_received", "sys_rx_fails", "sys_tx_reads", "sys_tx_writes",
      "sys_tx_fails", "sys_mqtt_fails"
    ]
  },
  service: {
    label: "Service",
    icon: "mdi:wrench",
    metrics: [
      "last_error", "service_code", "service_code_num",
      "switch_valve", "condensate_ea0", "pc1",
      "input_1", "input_2", "input_3", "input_4",
      "heating_active", "tapwater_active", "heating_pump",
      "hp_compressor", "aux_heater_status"
    ]
  }
};

/* ── Style Defaults ───────────────────────────────────────────── */
const BMC_STYLE_DEFAULTS = {
  card_bg: "var(--ha-card-background, var(--card-background-color, #1a1a2e))",
  card_padding: "20px",
  card_radius: "16px",
  accent: "#4fc3f7",
  accent_secondary: "#81c784",
  color_heating: "#ff7043",
  color_dhw: "#ec407a",
  color_cooling: "#42a5f5",
  color_idle: "#66bb6a",
  color_error: "#ef5350",

  // Typography
  font_family: "var(--primary-font-family, sans-serif)",
  title_font_size: "1.15rem",
  title_font_weight: "800",
  title_color: "var(--primary-text-color, #e0e0e0)",
  title_letter_spacing: "-0.3px",

  // Metric tile
  metric_value_size: "1.5rem",
  metric_label_size: "0.7rem",
  metric_value_weight: "900",
  metric_label_weight: "800",
  metric_value_color: "var(--primary-text-color, #eee)",
  metric_label_color: "var(--secondary-text-color, #888)",
  metric_box_bg: "rgba(255,255,255,0.04)",
  metric_box_radius: "14px",
  metric_box_padding: "16px",
  metric_box_border: "1px solid rgba(255,255,255,0.04)",
  metric_min_height: "100px",

  // Tabs
  tab_style: "pills", // pills | underline | minimal
  tab_bg: "rgba(255,255,255,0.04)",
  tab_active_bg: "", // auto from accent if empty
  tab_border_radius: "10px",
  tab_font_size: "0.72rem",
  tab_font_weight: "700",
  tab_gap: "4px",

  // Graphs
  graph_hours: 24,
  graph_line_width: 2,
  graph_opacity: "0.25",
  graph_fill: true,
  graph_points: false,
  graph_extrema: false,
  graphs_in_detail_tabs: true, // show mini graphs in all tabs, not just hero

  // COP
  show_cop: true,

  // Status bar
  show_status_bar: true,
  status_pill_bg: "rgba(255,255,255,0.06)",
  status_pill_border: "1px solid rgba(255,255,255,0.08)",
  status_pill_radius: "20px",
  status_pill_font_size: "0.72rem",

  // Layout
  show_header: true,
  animate: true,
  compact: false,
  columns_hero: 3,
  columns_detail: 3,

  // Section divider style
  section_divider_color: "", // auto from accent if empty
  section_divider_size: "0.7rem",

  // Control rows
  control_row_bg: "rgba(255,255,255,0.04)",
  control_row_border: "1px solid rgba(255,255,255,0.04)",
  control_row_radius: "12px",
};

function _merge(defaults, overrides) {
  const out = JSON.parse(JSON.stringify(defaults));
  if (!overrides) return out;
  for (const [k, v] of Object.entries(overrides)) {
    if (v !== undefined && v !== null) out[k] = v;
  }
  return out;
}

function _mergeConfig(config) {
  const c = { ...config };
  c.entities = _merge(BMC_ENTITY_DEFAULTS, config?.entities);
  c.style = _merge(BMC_STYLE_DEFAULTS, config?.style);
  c.title = c.title || "Wärmepumpe";
  c.title_icon = c.title_icon || "mdi:heat-pump-outline";
  c.visible_tabs = c.visible_tabs || Object.keys(BMC_SECTIONS);
  return c;
}

/* ── Utility ──────────────────────────────────────────────────── */
function _sv(hass, eid) {
  const s = hass?.states?.[eid];
  if (!s) return { v: null, u: "", s: "N/A", raw: null };
  const v = parseFloat(s.state);
  return {
    v: isNaN(v) ? null : v,
    u: s.attributes?.unit_of_measurement || "",
    s: s.state,
    raw: s,
    friendly: s.attributes?.friendly_name || eid
  };
}

function _fmt(val, unit) {
  if (val === null || val === undefined) return "—";
  if (typeof val === "number") {
    if (Math.abs(val) >= 1000) return val.toLocaleString("de-DE", { maximumFractionDigits: 0 }) + (unit ? ` ${unit}` : "");
    return val.toFixed(1) + (unit ? ` ${unit}` : "");
  }
  return String(val) + (unit ? ` ${unit}` : "");
}

/* ── Returns whether a given entity domain is numeric/graphable ── */
function _isGraphable(eid) {
  if (!eid) return false;
  const domain = eid.split(".")[0];
  return ["sensor", "number"].includes(domain);
}

/* ================================================================
   MAIN CARD
   ================================================================ */
class BuderusMonitorCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._built = false;
    this._activeTab = "hero";
    this._graphCards = {};
  }

  static getConfigElement() { return document.createElement("buderus-monitor-card-editor"); }
  static getStubConfig() { return { title: "Wärmepumpe", entities: {}, style: {} }; }

  setConfig(config) {
    this._config = _mergeConfig(config);
    if (this._hass) this._fullRender();
  }

  set hass(hass) {
    this._hass = hass;
    if (!this._built) {
      this._fullRender();
      this._built = true;
    } else {
      this._updateValuesOnly();
    }
  }

  _updateValuesOnly() {
    this.shadowRoot.querySelectorAll(".metric-box").forEach(box => {
      const valEl = box.querySelector(".m-value");
      const labelEl = box.querySelector(".m-label");
      if (!valEl || !labelEl) return;
      const label = labelEl.textContent;
      const key = Object.keys(BMC_LABELS).find(k => BMC_LABELS[k] === label);
      if (!key) return;
      const eid = this._config.entities[key];
      const sv = _sv(this._hass, eid);
      if (eid?.startsWith("binary_sensor.")) {
        valEl.textContent = sv.s === "on" ? "An" : "Aus";
        valEl.classList.toggle("binary-on", sv.s === "on");
        valEl.classList.toggle("binary-off", sv.s !== "on");
      } else {
        valEl.textContent = _fmt(sv.v, sv.u);
      }
    });
  }

  _fullRender() {
    if (!this._config || !this._hass) return;
    this._buildCard();
  }

  _buildCard() {
    const c = this._config;
    const s = c.style;
    const tabs = c.visible_tabs.filter(t => BMC_SECTIONS[t]);

    this.shadowRoot.innerHTML = `
      <style>${this._buildCSS()}</style>
      <ha-card>
        <div class="bmc-card">
          ${s.show_header ? this._renderHeader() : ""}
          ${s.show_status_bar ? this._renderStatusBar() : ""}
          ${this._renderTabs(tabs)}
          <div class="tab-content">
            ${this._renderTabContent()}
          </div>
        </div>
      </ha-card>
    `;

    this.shadowRoot.querySelectorAll(".tab-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        if (this._activeTab === btn.dataset.tab) return;
        this._activeTab = btn.dataset.tab;
        this._fullRender();
      });
    });

    this._initGraphs();
    this._attachControlListeners();
  }

  _buildCSS() {
    const s = this._config.style;
    const accentRgb = s.accent;
    const tabActiveBg = s.tab_active_bg || `${s.accent}22`;
    const dividerColor = s.section_divider_color || s.accent;
    const animate = s.animate ? `
      @keyframes bmc-pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
      @keyframes bmc-glow { 0%,100%{box-shadow:0 0 8px ${s.accent}33} 50%{box-shadow:0 0 20px ${s.accent}66} }
      @keyframes bmc-fadein { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:none} }
    ` : "";

    // Tab underline variant
    const tabUnderlineCSS = s.tab_style === "underline" ? `
      .bmc-tabs { border-bottom: 1px solid rgba(255,255,255,0.08); gap: 0; }
      .tab-btn { border-radius: 0; background: transparent !important; border: none !important;
        border-bottom: 2px solid transparent; padding: 8px 16px; margin-bottom: -1px; }
      .tab-btn.active { border-bottom-color: ${s.accent}; color: ${s.accent}; background: transparent !important; }
    ` : "";

    const tabMinimalCSS = s.tab_style === "minimal" ? `
      .tab-btn { background: transparent !important; border: none !important; color: var(--secondary-text-color); }
      .tab-btn.active { color: ${s.accent}; background: transparent !important; font-weight: 900; }
    ` : "";

    return `
      ${animate}
      ${tabUnderlineCSS}
      ${tabMinimalCSS}
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      ha-card { background: transparent !important; border: none !important; box-shadow: none !important; }
      .bmc-card {
        background: ${s.card_bg};
        border-radius: ${s.card_radius};
        padding: ${s.card_padding};
        font-family: ${s.font_family};
        color: var(--primary-text-color, #e0e0e0);
        position: relative;
        overflow: hidden;
      }

      /* ── Header ─── */
      .bmc-header {
        display: flex; justify-content: space-between; align-items: center;
        margin-bottom: 16px; padding-bottom: 12px;
        border-bottom: 1px solid rgba(255,255,255,0.06);
      }
      .bmc-title {
        display: flex; align-items: center; gap: 10px;
        font-size: ${s.title_font_size};
        font-weight: ${s.title_font_weight};
        letter-spacing: ${s.title_letter_spacing};
        color: ${s.title_color};
        font-family: ${s.font_family};
      }
      .bmc-title ha-icon { color: ${s.accent}; --mdc-icon-size: 26px; }
      .bmc-version { font-size: 0.6rem; opacity: 0.3; font-weight: 400; }

      /* ── Status Bar ─── */
      .bmc-status {
        display: flex; gap: 8px; margin-bottom: 16px; flex-wrap: wrap;
      }
      .status-pill {
        display: inline-flex; align-items: center; gap: 6px;
        padding: 5px 14px;
        border-radius: ${s.status_pill_radius};
        font-size: ${s.status_pill_font_size};
        font-weight: 700; text-transform: none; letter-spacing: 0.8px;
        background: ${s.status_pill_bg};
        border: ${s.status_pill_border};
      }
      .status-dot {
        width: 8px; height: 8px; border-radius: 50%;
        ${s.animate ? "animation: bmc-pulse 2s infinite;" : ""}
      }

      /* ── Tabs ─── */
      .bmc-tabs {
        display: flex;
        gap: ${s.tab_gap};
        margin-bottom: 16px;
        overflow-x: auto; scrollbar-width: none; -ms-overflow-style: none;
        padding-bottom: 4px;
      }
      .bmc-tabs::-webkit-scrollbar { display: none; }
      .tab-btn {
        flex-shrink: 0; display: flex; align-items: center; gap: 5px;
        padding: 7px 14px;
        border: none;
        border-radius: ${s.tab_border_radius};
        cursor: pointer;
        font-size: ${s.tab_font_size};
        font-weight: ${s.tab_font_weight};
        font-family: ${s.font_family};
        text-transform: none; letter-spacing: 0.5px;
        background: ${s.tab_bg};
        color: var(--secondary-text-color, #999);
        transition: all 0.25s ease; white-space: nowrap;
      }
      .tab-btn:hover { background: rgba(255,255,255,0.08); }
      .tab-btn.active {
        background: ${tabActiveBg};
        color: ${s.accent};
        border: 1px solid ${s.accent}44;
      }
      .tab-btn ha-icon { --mdc-icon-size: 16px; }

      /* ── Metric Grid ─── */
      .metric-grid {
        display: grid; grid-template-columns: repeat(${s.columns_hero}, 1fr);
        gap: 12px;
        ${s.animate ? "animation: bmc-fadein 0.3s ease;" : ""}
      }
      .metric-grid.detail { grid-template-columns: repeat(${s.columns_detail}, 1fr); }

      .metric-box {
        background: ${s.metric_box_bg};
        border-radius: ${s.metric_box_radius};
        padding: ${s.metric_box_padding};
        position: relative; overflow: hidden;
        border: ${s.metric_box_border};
        transition: all 0.25s ease; cursor: default;
        display: flex; flex-direction: column;
        min-height: ${s.metric_min_height};
      }
      .metric-box:hover {
        background: rgba(255,255,255,0.07);
        border-color: rgba(255,255,255,0.08);
        transform: translateY(-1px);
      }
      .metric-box.has-graph { min-height: 130px; }

      .m-label {
        font-size: ${s.metric_label_size};
        font-weight: ${s.metric_label_weight};
        text-transform: none;
        color: ${s.metric_label_color};
        letter-spacing: 0.7px; margin-bottom: 6px; z-index: 1;
      }
      .m-value {
        font-size: ${s.metric_value_size};
        font-weight: ${s.metric_value_weight};
        color: ${s.metric_value_color};
        letter-spacing: -0.5px; z-index: 1;
      }
      .m-value.binary-on { color: ${s.accent_secondary}; }
      .m-value.binary-off { color: var(--secondary-text-color, #666); }

      /* ── Graph Slot ─── */
      .graph-slot {
        position: absolute; bottom: 0; left: 0; right: 0; height: 100%;
        opacity: ${s.graph_opacity}; pointer-events: none; z-index: 0;
        overflow: hidden; border-radius: 0 0 ${s.metric_box_radius} ${s.metric_box_radius};
      }
      .graph-slot mini-graph-card {
        --ha-card-background: transparent;
        --ha-card-border-width: 0;
        --ha-card-box-shadow: none;
      }

      /* ── COP Bar ─── */
      .cop-section {
        margin: 16px 0; padding: 16px; border-radius: 14px;
        background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.04);
      }
      .cop-header { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 10px; }
      .cop-label { font-size: 0.75rem; font-weight: 800; text-transform: none; letter-spacing: 0.7px; color: var(--secondary-text-color); }
      .cop-value { font-size: 1.3rem; font-weight: 900; color: ${s.accent}; }
      .cop-track { height: 8px; background: rgba(255,255,255,0.06); border-radius: 4px; overflow: hidden; }
      .cop-fill { height: 100%; border-radius: 4px; transition: width 1.5s ease; }

      /* ── Controls ─── */
      .controls-section { ${s.animate ? "animation: bmc-fadein 0.3s ease;" : ""} }
      .control-row {
        display: flex; justify-content: space-between; align-items: center;
        padding: 12px 16px;
        border-radius: ${s.control_row_radius};
        margin-bottom: 6px;
        background: ${s.control_row_bg};
        border: ${s.control_row_border};
        transition: background 0.2s;
      }
      .control-row:hover { background: rgba(255,255,255,0.07); }
      .ctrl-label { font-size: 0.8rem; font-weight: 700; color: var(--primary-text-color); }
      .ctrl-value {
        font-size: 0.85rem; font-weight: 600; color: ${s.accent};
        max-width: 50%; text-align: right; word-break: break-word;
      }
      .ctrl-input {
        background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.12);
        border-radius: 8px; padding: 6px 10px; color: var(--primary-text-color);
        font-size: 0.8rem; width: 90px; text-align: right;
      }
      .ctrl-select {
        background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.12);
        border-radius: 8px; padding: 6px 10px; color: var(--primary-text-color);
        font-size: 0.8rem; max-width: 55%;
      }
      .ctrl-switch {
        position: relative; width: 44px; height: 24px; cursor: pointer;
      }
      .ctrl-switch input { display: none; }
      .ctrl-switch .slider {
        position: absolute; inset: 0; background: rgba(255,255,255,0.15);
        border-radius: 12px; transition: 0.3s;
      }
      .ctrl-switch .slider::before {
        content: ""; position: absolute; width: 18px; height: 18px;
        left: 3px; bottom: 3px; background: white; border-radius: 50%;
        transition: 0.3s;
      }
      .ctrl-switch input:checked + .slider { background: ${s.accent}; }
      .ctrl-switch input:checked + .slider::before { transform: translateX(20px); }

      /* ── Section Divider ─── */
      .section-divider {
        font-size: ${s.section_divider_size};
        font-weight: 800; text-transform: none;
        letter-spacing: 1px;
        color: ${dividerColor};
        opacity: 0.7;
        margin: 16px 0 10px; padding-left: 4px;
      }
    `;
  }

  _renderHeader() {
    return `
      <div class="bmc-header">
        <div class="bmc-title">
          <ha-icon icon="${this._config.title_icon}"></ha-icon>
          ${this._config.title}
        </div>
        <span class="bmc-version">v${BMC_VERSION}</span>
      </div>
    `;
  }

  _renderStatusBar() {
    const c = this._config;
    const s = c.style;
    const heating = _sv(this._hass, c.entities.heating_active);
    const dhw = _sv(this._hass, c.entities.tapwater_active);
    const isHeating = heating.s === "on";
    const isDHW = dhw.s === "on";

    let status, color;
    if (isDHW) { status = "Warmwasser"; color = s.color_dhw; }
    else if (isHeating) { status = "Heizbetrieb"; color = s.color_heating; }
    else { status = "Standby"; color = s.color_idle; }

    const sysStatus = _sv(this._hass, c.entities.sys_status);
    const sysOk = sysStatus.s === "on";
    const compAct = _sv(this._hass, c.entities.compressor_activity);

    return `
      <div class="bmc-status">
        <div class="status-pill">
          <span class="status-dot" style="background:${color}"></span>
          ${status}
        </div>
        ${compAct.v !== null ? `<div class="status-pill">
          <ha-icon icon="mdi:engine" style="--mdc-icon-size:14px;color:${s.accent}"></ha-icon>
          ${compAct.s}
        </div>` : ""}
        <div class="status-pill">
          <span class="status-dot" style="background:${sysOk ? s.color_idle : s.color_error};${sysOk ? "" : "animation:none"}"></span>
          EMS ${sysOk ? "OK" : "FEHLER"}
        </div>
      </div>
    `;
  }

  _renderTabs(tabs) {
    return `
      <div class="bmc-tabs">
        ${tabs.map(t => {
          const sec = BMC_SECTIONS[t];
          return `<button class="tab-btn ${this._activeTab === t ? "active" : ""}" data-tab="${t}">
            <ha-icon icon="${sec.icon}"></ha-icon>
            ${sec.label}
          </button>`;
        }).join("")}
      </div>
    `;
  }

  _renderTabContent() {
    const tab = this._activeTab;
    const sec = BMC_SECTIONS[tab];
    if (!sec) return "";

    let html = "";
    const s = this._config.style;

    if (tab === "hero" && s.show_cop) {
      html += this._renderCOP();
    }

    if (sec.metrics) {
      const isHero = tab === "hero";
      // In hero tab use explicit graphs list; in detail tabs use graphs_in_detail_tabs setting
      const showGraphsInThisTab = isHero || s.graphs_in_detail_tabs;
      html += `<div class="metric-grid ${isHero ? "" : "detail"}">`;
      let colorIdx = 0;
      for (const key of sec.metrics) {
        const eid = this._config.entities[key];
        const sv = _sv(this._hass, eid);
        const label = BMC_LABELS[key] || key;
        const isBinary = eid && eid.startsWith("binary_sensor.");
        const canGraph = showGraphsInThisTab && _isGraphable(eid);
        let valClass = "m-value";
        let display;
        if (isBinary) {
          display = sv.s === "on" ? "AN" : "AUS";
          valClass += sv.s === "on" ? " binary-on" : " binary-off";
        } else {
          display = _fmt(sv.v, sv.u);
        }
        const graphColor = BMC_GRAPH_COLORS[colorIdx % BMC_GRAPH_COLORS.length];
        colorIdx++;
        html += `
          <div class="metric-box ${canGraph ? "has-graph" : ""}">
            ${canGraph ? `<div class="graph-slot" id="graph-${tab}-${key}" data-entity="${eid}" data-color="${graphColor}"></div>` : ""}
            <div class="m-label">${label}</div>
            <div class="${valClass}">${display}</div>
          </div>
        `;
      }
      html += `</div>`;
    }

    if (sec.controls) {
      html += `<div class="controls-section">`;
      if (sec.sensors) {
        html += `<div class="section-divider">Sensoren</div>`;
        html += `<div class="metric-grid detail">`;
        let colorIdx = 0;
        for (const key of sec.sensors) {
          const eid = this._config.entities[key];
          const sv = _sv(this._hass, eid);
          const label = BMC_LABELS[key] || key;
          const isBinary = eid && eid.startsWith("binary_sensor.");
          const canGraph = s.graphs_in_detail_tabs && _isGraphable(eid);
          let display, valClass = "m-value";
          if (isBinary) { display = sv.s === "on" ? "AN" : "AUS"; valClass += sv.s === "on" ? " binary-on" : " binary-off"; }
          else { display = _fmt(sv.v, sv.u); }
          const graphColor = BMC_GRAPH_COLORS[colorIdx % BMC_GRAPH_COLORS.length];
          colorIdx++;
          html += `
            <div class="metric-box ${canGraph ? "has-graph" : ""}">
              ${canGraph ? `<div class="graph-slot" id="graph-${tab}-ctrl-${key}" data-entity="${eid}" data-color="${graphColor}"></div>` : ""}
              <div class="m-label">${label}</div>
              <div class="${valClass}">${display}</div>
            </div>`;
        }
        html += `</div>`;
      }
      html += `<div class="section-divider">Steuerung</div>`;
      for (const key of sec.controls) {
        html += this._renderControlRow(key);
      }
      html += `</div>`;
    }

    return html;
  }

  _renderCOP() {
    const c = this._config;
    const s = c.style;
    const pIn = _sv(this._hass, c.entities.compressor_power);
    const pOut = _sv(this._hass, c.entities.compressor_output);
    let cop = 0;
    if (pIn.v && pIn.v > 100 && pOut.v) cop = pOut.v / pIn.v;
    const pct = Math.min(cop / 6 * 100, 100);
    const copColor = cop >= 4 ? s.accent_secondary : cop >= 2.5 ? s.accent : s.color_heating;
    const spread = _sv(this._hass, c.entities.flow_temp);
    const ret = _sv(this._hass, c.entities.return_temp);
    const delta = (spread.v && ret.v) ? (spread.v - ret.v).toFixed(1) : "—";

    return `
      <div class="cop-section">
        <div class="cop-header">
          <span class="cop-label">COP (Effizienz)</span>
          <span class="cop-value" style="color:${copColor}">${cop.toFixed(2)}</span>
        </div>
        <div class="cop-track">
          <div class="cop-fill" style="width:${pct}%;background:linear-gradient(90deg,${s.color_heating},${copColor})"></div>
        </div>
        <div style="display:flex;justify-content:space-between;margin-top:8px;font-size:0.7rem;color:var(--secondary-text-color)">
          <span>Spreizung: ${delta} K</span>
          <span>Leistung: ${_fmt(pIn.v, "W")} → ${_fmt(pOut.v, "W")}</span>
        </div>
      </div>
    `;
  }

  _renderControlRow(key) {
    const eid = this._config.entities[key];
    if (!eid) return "";
    const sv = _sv(this._hass, eid);
    const label = BMC_LABELS[key] || key;
    const domain = eid.split(".")[0];

    if (domain === "switch") {
      const checked = sv.s === "on" ? "checked" : "";
      return `
        <div class="control-row">
          <span class="ctrl-label">${label}</span>
          <label class="ctrl-switch">
            <input type="checkbox" ${checked} data-entity="${eid}" data-domain="switch">
            <span class="slider"></span>
          </label>
        </div>
      `;
    }
    if (domain === "select") {
      const options = sv.raw?.attributes?.options || [];
      return `
        <div class="control-row">
          <span class="ctrl-label">${label}</span>
          <select class="ctrl-select" data-entity="${eid}" data-domain="select">
            ${options.map(o => `<option value="${o}" ${o === sv.s ? "selected" : ""}>${o}</option>`).join("")}
          </select>
        </div>
      `;
    }
    if (domain === "number") {
      const min = sv.raw?.attributes?.min ?? 0;
      const max = sv.raw?.attributes?.max ?? 100;
      const step = sv.raw?.attributes?.step ?? 0.5;
      return `
        <div class="control-row">
          <span class="ctrl-label">${label}</span>
          <input type="number" class="ctrl-input" value="${sv.s}" min="${min}" max="${max}" step="${step}"
                 data-entity="${eid}" data-domain="number">
        </div>
      `;
    }
    if (domain === "text") {
      return `
        <div class="control-row">
          <span class="ctrl-label">${label}</span>
          <span class="ctrl-value">${sv.s}</span>
        </div>
      `;
    }
    if (domain === "climate") {
      const mode = sv.raw?.attributes?.hvac_action || sv.s;
      const temp = sv.raw?.attributes?.temperature || "—";
      const cur = sv.raw?.attributes?.current_temperature || "—";
      return `
        <div class="control-row" style="flex-direction:column;align-items:stretch;gap:8px">
          <div style="display:flex;justify-content:space-between">
            <span class="ctrl-label">${label}</span>
            <span class="ctrl-value">${mode}</span>
          </div>
          <div style="display:flex;justify-content:space-between;font-size:0.75rem;color:var(--secondary-text-color)">
            <span>Soll: ${temp}°C</span>
            <span>Ist: ${cur}°C</span>
          </div>
        </div>
      `;
    }
    return `
      <div class="control-row">
        <span class="ctrl-label">${label}</span>
        <span class="ctrl-value">${sv.s}${sv.u ? " " + sv.u : ""}</span>
      </div>
    `;
  }

  _initGraphs() {
    const s = this._config.style;

    this.shadowRoot.querySelectorAll(".graph-slot[data-entity]").forEach(container => {
      const eid = container.dataset.entity;
      const color = container.dataset.color || s.accent;
      if (!eid) return;
      try {
        const graphCard = document.createElement("mini-graph-card");
        graphCard.setConfig({
          entities: [{ entity: eid, color }],
          hours_to_show: parseInt(s.graph_hours) || 24,
          points_per_hour: 4,
          line_width: parseInt(s.graph_line_width) || 2,
          animate: s.animate,
          fill: s.graph_fill !== false,
          show: {
            name: false, state: false, legend: false,
            icon: false, labels: false,
            extrema: s.graph_extrema === true,
            fill: s.graph_fill !== false,
            points: s.graph_points === true
          },
          card_mod: { style: "ha-card { background: transparent !important; border: none !important; box-shadow: none !important; }" }
        });
        graphCard.hass = this._hass;
        container.appendChild(graphCard);
      } catch (e) {
        container.innerHTML = "";
      }
    });
  }

  _attachControlListeners() {
    this.shadowRoot.querySelectorAll('input[data-domain="switch"]').forEach(el => {
      el.addEventListener("change", () => {
        this._hass.callService("switch", el.checked ? "turn_on" : "turn_off", { entity_id: el.dataset.entity });
      });
    });
    this.shadowRoot.querySelectorAll('select[data-domain="select"]').forEach(el => {
      el.addEventListener("change", () => {
        this._hass.callService("select", "select_option", { entity_id: el.dataset.entity, option: el.value });
      });
    });
    this.shadowRoot.querySelectorAll('input[data-domain="number"]').forEach(el => {
      let timeout;
      el.addEventListener("change", () => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          this._hass.callService("number", "set_value", { entity_id: el.dataset.entity, value: parseFloat(el.value) });
        }, 500);
      });
    });
  }

  getCardSize() { return 8; }
}

/* ================================================================
   EDITOR
   ================================================================ */
class BuderusMonitorCardEditor extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._hass = null;
  }

  set hass(hass) {
    this._hass = hass;
    this._passHass();
  }

  setConfig(config) {
    this._config = _mergeConfig(config);
    this._render();
  }

  _passHass() {
    if (!this._hass) return;
    this.shadowRoot.querySelectorAll("ha-entity-picker").forEach(p => { p.hass = this._hass; });
  }

  _render() {
    const c = this._config;
    const s = c.style;

    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; }
        .editor { font-family: var(--paper-font-body1_-_font-family, sans-serif); padding: 8px; }

        /* ── Accordion ── */
        details {
          margin-bottom: 10px;
          border: 1px solid rgba(128,128,128,0.2);
          border-radius: 12px; overflow: hidden;
        }
        summary {
          padding: 12px 16px; cursor: pointer; font-weight: 700; font-size: 0.85rem;
          background: rgba(128,128,128,0.06);
          display: flex; align-items: center; gap: 8px;
          list-style: none; user-select: none;
        }
        summary::-webkit-details-marker { display: none; }
        summary::after {
          content: "▸"; margin-left: auto; font-size: 0.75rem;
          transition: transform 0.2s; display: inline-block;
        }
        details[open] summary::after { transform: rotate(90deg); }
        summary ha-icon { --mdc-icon-size: 18px; }

        .section { padding: 14px 16px; display: flex; flex-direction: column; gap: 12px; }

        /* ── Fields ── */
        .field { display: flex; flex-direction: column; gap: 5px; }
        .field label {
          font-size: 0.72rem; font-weight: 700; letter-spacing: 0.4px;
          color: var(--secondary-text-color);
        }
        .field input[type="text"],
        .field input[type="number"],
        .field select {
          width: 100%; padding: 8px 12px;
          border: 1px solid rgba(128,128,128,0.25);
          border-radius: 8px;
          background: var(--card-background-color, #1e1e2e);
          color: var(--primary-text-color);
          font-size: 0.85rem;
          font-family: inherit;
          outline: none;
          transition: border-color 0.2s;
        }
        .field input:focus, .field select:focus {
          border-color: var(--primary-color, #03a9f4);
        }
        .field input[type="color"] {
          width: 100%; height: 36px; padding: 2px 4px;
          border: 1px solid rgba(128,128,128,0.25);
          border-radius: 8px; cursor: pointer;
          background: var(--card-background-color, #1e1e2e);
        }
        ha-entity-picker { width: 100%; }

        /* ── Layout helpers ── */
        .row { display: flex; gap: 10px; }
        .row > * { flex: 1; min-width: 0; }
        .row-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; }

        /* ── Chip toggle ── */
        .chip-row { display: flex; flex-wrap: wrap; gap: 6px; }
        .chip {
          padding: 5px 12px; border-radius: 8px; font-size: 0.72rem; font-weight: 700;
          cursor: pointer; border: 1px solid rgba(128,128,128,0.2);
          background: rgba(128,128,128,0.06); transition: all 0.2s; user-select: none;
        }
        .chip:hover { border-color: var(--primary-color, #03a9f4); }
        .chip.active {
          background: var(--primary-color, #03a9f4);
          color: white; border-color: transparent;
        }

        /* ── Switch row ── */
        .switch-row {
          display: flex; justify-content: space-between; align-items: center;
          padding: 6px 0; border-bottom: 1px solid rgba(128,128,128,0.08);
        }
        .switch-row:last-child { border-bottom: none; }
        .switch-label { font-size: 0.82rem; font-weight: 600; }
        .switch-hint { font-size: 0.68rem; color: var(--secondary-text-color); margin-top: 1px; }

        /* ── Sub-group heading inside section ── */
        .sub-heading {
          font-size: 0.7rem; font-weight: 800; letter-spacing: 1px;
          color: var(--primary-color, #03a9f4); opacity: 0.8;
          padding-top: 6px; border-top: 1px solid rgba(128,128,128,0.1);
          text-transform: uppercase;
        }
      </style>

      <div class="editor">

        <!-- ── General ── -->
        <details open>
          <summary><ha-icon icon="mdi:cog"></ha-icon> Allgemein</summary>
          <div class="section">
            <div class="row">
              <div class="field">
                <label>Titel</label>
                <input type="text" id="ed-title" value="${c.title}">
              </div>
              <div class="field">
                <label>Titel Icon (mdi:...)</label>
                <input type="text" id="ed-title-icon" value="${c.title_icon}">
              </div>
            </div>
          </div>
        </details>

        <!-- ── Visible Tabs ── -->
        <details>
          <summary><ha-icon icon="mdi:tab"></ha-icon> Sichtbare Tabs</summary>
          <div class="section">
            <div class="chip-row">
              ${Object.entries(BMC_SECTIONS).map(([k, v]) => `
                <span class="chip ${c.visible_tabs.includes(k) ? "active" : ""}" data-tab-toggle="${k}">
                  ${v.label}
                </span>
              `).join("")}
            </div>
          </div>
        </details>

        <!-- ── Typography ── -->
        <details>
          <summary><ha-icon icon="mdi:format-font"></ha-icon> Typografie & Titel</summary>
          <div class="section">
            <div class="field">
              <label>Schriftart (CSS font-family)</label>
              <input type="text" id="ed-font-family" value="${s.font_family}">
            </div>
            <div class="row">
              <div class="field">
                <label>Titel Schriftgröße</label>
                <input type="text" id="ed-title-font-size" value="${s.title_font_size}">
              </div>
              <div class="field">
                <label>Titel Schriftstärke</label>
                <input type="text" id="ed-title-font-weight" value="${s.title_font_weight}">
              </div>
            </div>
            <div class="row">
              <div class="field">
                <label>Titel Farbe</label>
                <input type="color" id="ed-title-color" value="${s.title_color.startsWith('var') ? '#e0e0e0' : s.title_color}">
              </div>
              <div class="field">
                <label>Titel Buchstabenabstand</label>
                <input type="text" id="ed-title-letter-spacing" value="${s.title_letter_spacing}">
              </div>
            </div>
            <div class="sub-heading">Metriken</div>
            <div class="row">
              <div class="field">
                <label>Wert Schriftgröße</label>
                <input type="text" id="ed-val-size" value="${s.metric_value_size}">
              </div>
              <div class="field">
                <label>Wert Schriftstärke</label>
                <input type="text" id="ed-val-weight" value="${s.metric_value_weight}">
              </div>
            </div>
            <div class="row">
              <div class="field">
                <label>Label Schriftgröße</label>
                <input type="text" id="ed-lbl-size" value="${s.metric_label_size}">
              </div>
              <div class="field">
                <label>Label Schriftstärke</label>
                <input type="text" id="ed-lbl-weight" value="${s.metric_label_weight}">
              </div>
            </div>
          </div>
        </details>

        <!-- ── Colors ── -->
        <details>
          <summary><ha-icon icon="mdi:palette"></ha-icon> Farben</summary>
          <div class="section">
            <div class="row">
              <div class="field"><label>Akzentfarbe</label><input type="color" id="ed-accent" value="${s.accent}"></div>
              <div class="field"><label>Akzent Sekundär</label><input type="color" id="ed-accent2" value="${s.accent_secondary}"></div>
            </div>
            <div class="row-3">
              <div class="field"><label>Heizen</label><input type="color" id="ed-c-heat" value="${s.color_heating}"></div>
              <div class="field"><label>Warmwasser</label><input type="color" id="ed-c-dhw" value="${s.color_dhw}"></div>
              <div class="field"><label>Kühlen</label><input type="color" id="ed-c-cool" value="${s.color_cooling}"></div>
            </div>
            <div class="row">
              <div class="field"><label>Standby / OK</label><input type="color" id="ed-c-idle" value="${s.color_idle}"></div>
              <div class="field"><label>Fehler</label><input type="color" id="ed-c-error" value="${s.color_error}"></div>
            </div>
            <div class="sub-heading">Kacheln</div>
            <div class="field"><label>Kachel Hintergrundfarbe (CSS)</label><input type="text" id="ed-metric-box-bg" value="${s.metric_box_bg}"></div>
            <div class="row">
              <div class="field"><label>Wert Farbe (CSS)</label><input type="text" id="ed-metric-value-color" value="${s.metric_value_color}"></div>
              <div class="field"><label>Label Farbe (CSS)</label><input type="text" id="ed-metric-label-color" value="${s.metric_label_color}"></div>
            </div>
          </div>
        </details>

        <!-- ── Layout ── -->
        <details>
          <summary><ha-icon icon="mdi:view-grid"></ha-icon> Layout & Karte</summary>
          <div class="section">
            <div class="row">
              <div class="field"><label>Spalten Hero</label><input type="number" id="ed-cols-hero" value="${s.columns_hero}" min="1" max="6"></div>
              <div class="field"><label>Spalten Detail</label><input type="number" id="ed-cols-detail" value="${s.columns_detail}" min="1" max="6"></div>
            </div>
            <div class="row">
              <div class="field"><label>Karten-Radius</label><input type="text" id="ed-radius" value="${s.card_radius}"></div>
              <div class="field"><label>Karten-Padding</label><input type="text" id="ed-padding" value="${s.card_padding}"></div>
            </div>
            <div class="field"><label>Karten-Hintergrund (CSS)</label><input type="text" id="ed-bg" value="${s.card_bg}"></div>
            <div class="row">
              <div class="field"><label>Kachel Radius</label><input type="text" id="ed-metric-box-radius" value="${s.metric_box_radius}"></div>
              <div class="field"><label>Kachel Padding</label><input type="text" id="ed-metric-box-padding" value="${s.metric_box_padding}"></div>
            </div>
            <div class="field"><label>Kachel Min-Höhe</label><input type="text" id="ed-metric-min-height" value="${s.metric_min_height}"></div>
            <div class="field"><label>Kachel Rahmen (CSS border)</label><input type="text" id="ed-metric-box-border" value="${s.metric_box_border}"></div>
          </div>
        </details>

        <!-- ── Tabs Style ── -->
        <details>
          <summary><ha-icon icon="mdi:tab"></ha-icon> Tab-Stil</summary>
          <div class="section">
            <div class="field">
              <label>Tab-Stil</label>
              <select id="ed-tab-style">
                <option value="pills" ${s.tab_style === "pills" ? "selected" : ""}>Pills (Standard)</option>
                <option value="underline" ${s.tab_style === "underline" ? "selected" : ""}>Unterstrichen</option>
                <option value="minimal" ${s.tab_style === "minimal" ? "selected" : ""}>Minimal</option>
              </select>
            </div>
            <div class="row">
              <div class="field"><label>Tab Hintergrund (CSS)</label><input type="text" id="ed-tab-bg" value="${s.tab_bg}"></div>
              <div class="field"><label>Aktiver Tab Hintergrund (CSS)</label><input type="text" id="ed-tab-active-bg" value="${s.tab_active_bg}"></div>
            </div>
            <div class="row">
              <div class="field"><label>Tab Radius</label><input type="text" id="ed-tab-radius" value="${s.tab_border_radius}"></div>
              <div class="field"><label>Tab Abstand</label><input type="text" id="ed-tab-gap" value="${s.tab_gap}"></div>
            </div>
            <div class="row">
              <div class="field"><label>Tab Schriftgröße</label><input type="text" id="ed-tab-font-size" value="${s.tab_font_size}"></div>
              <div class="field"><label>Tab Schriftstärke</label><input type="text" id="ed-tab-font-weight" value="${s.tab_font_weight}"></div>
            </div>
          </div>
        </details>

        <!-- ── Status Bar ── -->
        <details>
          <summary><ha-icon icon="mdi:information-outline"></ha-icon> Statusleiste</summary>
          <div class="section">
            <div class="row">
              <div class="field"><label>Pill Hintergrund (CSS)</label><input type="text" id="ed-status-pill-bg" value="${s.status_pill_bg}"></div>
              <div class="field"><label>Pill Rahmen (CSS)</label><input type="text" id="ed-status-pill-border" value="${s.status_pill_border}"></div>
            </div>
            <div class="row">
              <div class="field"><label>Pill Radius</label><input type="text" id="ed-status-pill-radius" value="${s.status_pill_radius}"></div>
              <div class="field"><label>Pill Schriftgröße</label><input type="text" id="ed-status-pill-font-size" value="${s.status_pill_font_size}"></div>
            </div>
          </div>
        </details>

        <!-- ── Graphs ── -->
        <details>
          <summary><ha-icon icon="mdi:chart-line"></ha-icon> Graphen</summary>
          <div class="section">
            <div class="row">
              <div class="field"><label>Stunden anzeigen</label><input type="number" id="ed-graph-hours" value="${s.graph_hours}" min="1" max="168"></div>
              <div class="field"><label>Linienbreite</label><input type="number" id="ed-graph-lw" value="${s.graph_line_width}" min="1" max="8"></div>
            </div>
            <div class="field"><label>Deckkraft (0–1)</label><input type="number" id="ed-graph-opacity" value="${s.graph_opacity}" min="0" max="1" step="0.05"></div>
            <div class="switch-row">
              <div><div class="switch-label">Graphen in Detail-Tabs</div><div class="switch-hint">Mini-Graphen in allen Tabs anzeigen (nicht nur Dashboard)</div></div>
              <ha-switch id="ed-graphs-detail" ${s.graphs_in_detail_tabs ? "checked" : ""}></ha-switch>
            </div>
            <div class="switch-row">
              <div><div class="switch-label">Graph Füllung</div><div class="switch-hint">Fläche unter der Linie füllen</div></div>
              <ha-switch id="ed-graph-fill" ${s.graph_fill !== false ? "checked" : ""}></ha-switch>
            </div>
            <div class="switch-row">
              <div><div class="switch-label">Extremwerte anzeigen</div></div>
              <ha-switch id="ed-graph-extrema" ${s.graph_extrema ? "checked" : ""}></ha-switch>
            </div>
            <div class="switch-row">
              <div><div class="switch-label">Datenpunkte anzeigen</div></div>
              <ha-switch id="ed-graph-points" ${s.graph_points ? "checked" : ""}></ha-switch>
            </div>
          </div>
        </details>

        <!-- ── Controls Style ── -->
        <details>
          <summary><ha-icon icon="mdi:tune"></ha-icon> Steuerzeilen-Stil</summary>
          <div class="section">
            <div class="field"><label>Zeile Hintergrund (CSS)</label><input type="text" id="ed-ctrl-row-bg" value="${s.control_row_bg}"></div>
            <div class="row">
              <div class="field"><label>Zeile Rahmen (CSS)</label><input type="text" id="ed-ctrl-row-border" value="${s.control_row_border}"></div>
              <div class="field"><label>Zeile Radius</label><input type="text" id="ed-ctrl-row-radius" value="${s.control_row_radius}"></div>
            </div>
            <div class="row">
              <div class="field"><label>Divider Farbe (CSS)</label><input type="text" id="ed-divider-color" value="${s.section_divider_color}"></div>
              <div class="field"><label>Divider Schriftgröße</label><input type="text" id="ed-divider-size" value="${s.section_divider_size}"></div>
            </div>
          </div>
        </details>

        <!-- ── Feature Switches ── -->
        <details>
          <summary><ha-icon icon="mdi:toggle-switch"></ha-icon> Funktionen</summary>
          <div class="section">
            <div class="switch-row">
              <div><div class="switch-label">Header anzeigen</div></div>
              <ha-switch id="ed-show-header" ${s.show_header ? "checked" : ""}></ha-switch>
            </div>
            <div class="switch-row">
              <div><div class="switch-label">COP anzeigen</div><div class="switch-hint">Effizienzanzeige auf dem Dashboard</div></div>
              <ha-switch id="ed-show-cop" ${s.show_cop ? "checked" : ""}></ha-switch>
            </div>
            <div class="switch-row">
              <div><div class="switch-label">Statusleiste</div></div>
              <ha-switch id="ed-show-status" ${s.show_status_bar ? "checked" : ""}></ha-switch>
            </div>
            <div class="switch-row">
              <div><div class="switch-label">Animationen</div><div class="switch-hint">Einblendeffekte und pulsierende Punkte</div></div>
              <ha-switch id="ed-animate" ${s.animate ? "checked" : ""}></ha-switch>
            </div>
          </div>
        </details>

        <!-- ── Entity Groups ── -->
        ${this._renderEntitySections()}
      </div>
    `;

    requestAnimationFrame(() => {
      this._passHass();
      this._attachEditorListeners();
    });
  }

  _renderEntitySections() {
    const groups = {
      "Dashboard Entities": ["outside_temp", "flow_temp", "return_temp", "dhw_temp", "compressor_power", "compressor_output", "compressor_speed"],
      "Status Entities": ["heating_active", "tapwater_active", "heating_pump", "hp_compressor", "aux_heater_status"],
      "Temperatur Entities": ["air_inlet_tl2", "high_pressure_ph1", "low_pressure_pl1", "compressor_tr1", "compressor_inlet_tr5", "compressor_outlet_tr6", "condenser_tc3", "evaporator_tr4", "heat_carrier_tc0", "heat_carrier_tc1", "refrigerant_tr3", "drain_pan_ta4", "low_loss_header", "brine_out", "brine_in", "damped_outdoor"],
      "Energie Entities": ["total_energy_consumption", "total_energy_supplied", "energy_consumption_heating", "energy_consumption_cooling", "energy_supplied_heating", "energy_supplied_cooling", "total_aux_consumption", "dhw_energy_consumption", "dhw_energy_supplied"],
      "Kompressor Entities": ["compressor_activity", "compressor_starts", "heating_control_starts", "cooling_control_starts", "burner_starts", "op_time_heating", "op_time_cooling", "total_uptime", "total_heat_op_time", "heating_pump_mod", "brine_pump_speed", "circ_pump_speed", "aux_heater_level", "aux_heater_valve", "four_way_valve", "burner_power"],
      "Warmwasser Entities": ["dhw_set_temp", "dhw_intern_temp", "dhw_extern_temp", "dhw_tap_flow", "dhw_active_time", "dhw_starts", "dhw_starts_hp", "dhw_op_time", "dhw_charging", "dhw_recharging", "dhw_temp_ok", "dhw_3way"],
      "Thermostat HC1 Entities": ["thermo_hc1", "thermo_hc1_mode", "thermo_hc1_hp_mode", "thermo_hc1_hp_op_mode", "thermo_hc1_control_mode", "thermo_hc1_program", "thermo_hc1_reduce_mode", "thermo_hc1_summer_mode_sel", "thermo_hc1_nofrost_mode", "thermo_hc1_heating_type", "thermo_hc1_control_device", "thermo_hc1_selected_temp", "thermo_hc1_comfort_temp", "thermo_hc1_eco_temp", "thermo_hc1_manual_temp", "thermo_hc1_design_temp", "thermo_hc1_max_flow", "thermo_hc1_min_flow", "thermo_hc1_hp_min_flow", "thermo_hc1_summer_temp", "thermo_hc1_nofrost_temp", "thermo_hc1_offset", "thermo_hc1_room_influence", "thermo_hc1_dew_offset", "thermo_hc1_cooling_start", "thermo_hc1_switch_opt", "thermo_hc1_dhw_priority"],
      "Thermostat Sensoren": ["thermo_hc1_target_flow", "thermo_hc1_room_influence_cur", "thermo_hc1_cooling_on", "thermo_hc1_mode_type", "thermo_hc1_summer_mode", "thermo_hc1_hp_op_state", "thermo_floor_drying", "thermo_floor_drying_temp"],
      "WW Steuerung Entities": ["thermo_dhw_mode", "thermo_dhw_circ_mode", "thermo_dhw_disinfect_day", "thermo_dhw_disinfect_time", "thermo_dhw_disinfecting", "thermo_dhw_charge_dur", "thermo_dhw_charge", "thermo_dhw_daily", "thermo_dhw_daily_time", "thermo_dhw_extra"],
      "PV & Gebäude Entities": ["thermo_damping", "thermo_raise_dhw", "thermo_raise_heating", "thermo_lower_cooling", "thermo_energy_ratio", "thermo_building_type", "thermo_int_temp_offset", "thermo_min_ext_temp"],
      "System Entities": ["sys_ems_bus", "sys_free_mem", "sys_uptime", "sys_version", "sys_wifi_rssi", "sys_wifi_strength", "sys_status", "sys_rx_received", "sys_rx_fails", "sys_tx_reads", "sys_tx_writes", "sys_tx_fails", "sys_mqtt_fails"],
      "Service Entities": ["last_error", "service_code", "service_code_num", "switch_valve", "condensate_ea0", "pc1", "input_1", "input_2", "input_3", "input_4"],
    };

    let html = "";
    for (const [groupName, keys] of Object.entries(groups)) {
      html += `
        <details>
          <summary><ha-icon icon="mdi:format-list-bulleted"></ha-icon> ${groupName}</summary>
          <div class="section">
            ${keys.map(key => `
              <div class="field">
                <label>${BMC_LABELS[key] || key}</label>
                <ha-entity-picker
                  data-entity-key="${key}"
                  .value="${this._config.entities[key] || ""}"
                  allow-custom-entity
                ></ha-entity-picker>
              </div>
            `).join("")}
          </div>
        </details>
      `;
    }
    return html;
  }

  _attachEditorListeners() {
    const $ = (id) => this.shadowRoot.getElementById(id);

    // Simple text inputs → config root
    const simpleMap = {
      "ed-title": (v) => { this._config.title = v; },
      "ed-title-icon": (v) => { this._config.title_icon = v; },
    };
    for (const [id, fn] of Object.entries(simpleMap)) {
      const el = $(id);
      if (el) el.addEventListener("input", (e) => { fn(e.target.value); this._fire(); });
    }

    // Style text/number inputs
    const styleInputMap = {
      "ed-font-family": "font_family",
      "ed-title-font-size": "title_font_size",
      "ed-title-font-weight": "title_font_weight",
      "ed-title-letter-spacing": "title_letter_spacing",
      "ed-accent": "accent",
      "ed-accent2": "accent_secondary",
      "ed-c-heat": "color_heating",
      "ed-c-dhw": "color_dhw",
      "ed-c-cool": "color_cooling",
      "ed-c-idle": "color_idle",
      "ed-c-error": "color_error",
      "ed-metric-box-bg": "metric_box_bg",
      "ed-metric-value-color": "metric_value_color",
      "ed-metric-label-color": "metric_label_color",
      "ed-graph-hours": "graph_hours",
      "ed-graph-opacity": "graph_opacity",
      "ed-val-size": "metric_value_size",
      "ed-val-weight": "metric_value_weight",
      "ed-lbl-size": "metric_label_size",
      "ed-lbl-weight": "metric_label_weight",
      "ed-radius": "card_radius",
      "ed-padding": "card_padding",
      "ed-bg": "card_bg",
      "ed-cols-hero": "columns_hero",
      "ed-cols-detail": "columns_detail",
      "ed-graph-lw": "graph_line_width",
      "ed-tab-style": "tab_style",
      "ed-tab-bg": "tab_bg",
      "ed-tab-active-bg": "tab_active_bg",
      "ed-tab-radius": "tab_border_radius",
      "ed-tab-gap": "tab_gap",
      "ed-tab-font-size": "tab_font_size",
      "ed-tab-font-weight": "tab_font_weight",
      "ed-status-pill-bg": "status_pill_bg",
      "ed-status-pill-border": "status_pill_border",
      "ed-status-pill-radius": "status_pill_radius",
      "ed-status-pill-font-size": "status_pill_font_size",
      "ed-ctrl-row-bg": "control_row_bg",
      "ed-ctrl-row-border": "control_row_border",
      "ed-ctrl-row-radius": "control_row_radius",
      "ed-divider-color": "section_divider_color",
      "ed-divider-size": "section_divider_size",
      "ed-metric-box-radius": "metric_box_radius",
      "ed-metric-box-padding": "metric_box_padding",
      "ed-metric-box-border": "metric_box_border",
      "ed-metric-min-height": "metric_min_height",
    };
    const numericKeys = new Set(["graph_hours", "columns_hero", "columns_detail", "graph_line_width"]);
    for (const [id, key] of Object.entries(styleInputMap)) {
      const el = $(id);
      if (el) {
        const evt = (el.tagName === "SELECT") ? "change" : "input";
        el.addEventListener(evt, (e) => {
          let val = e.target.value;
          if (numericKeys.has(key)) val = parseInt(val) || 0;
          this._config.style[key] = val;
          this._fire();
        });
      }
    }

    // Title color picker — special: raw color value
    const titleColorEl = $("ed-title-color");
    if (titleColorEl) titleColorEl.addEventListener("input", (e) => {
      this._config.style.title_color = e.target.value;
      this._fire();
    });

    // Boolean switches
    const switchMap = {
      "ed-show-header": "show_header",
      "ed-show-cop": "show_cop",
      "ed-show-status": "show_status_bar",
      "ed-animate": "animate",
      "ed-graphs-detail": "graphs_in_detail_tabs",
      "ed-graph-fill": "graph_fill",
      "ed-graph-extrema": "graph_extrema",
      "ed-graph-points": "graph_points",
    };
    for (const [id, key] of Object.entries(switchMap)) {
      const el = $(id);
      if (el) el.addEventListener("change", (e) => {
        this._config.style[key] = e.target.checked;
        this._fire();
      });
    }

    // Tab toggle chips
    this.shadowRoot.querySelectorAll("[data-tab-toggle]").forEach(chip => {
      chip.addEventListener("click", () => {
        const tab = chip.dataset.tabToggle;
        const idx = this._config.visible_tabs.indexOf(tab);
        if (idx >= 0) this._config.visible_tabs.splice(idx, 1);
        else this._config.visible_tabs.push(tab);
        chip.classList.toggle("active");
        this._fire();
      });
    });

    // Entity pickers
    this.shadowRoot.querySelectorAll("ha-entity-picker").forEach(picker => {
      picker.addEventListener("value-changed", (e) => {
        const key = picker.dataset.entityKey;
        if (key) {
          this._config.entities[key] = e.detail.value || "";
          this._fire();
        }
      });
    });
  }

  _fire() {
    const ev = new CustomEvent("config-changed", {
      detail: { config: { ...this._config } },
      bubbles: true, composed: true
    });
    this.dispatchEvent(ev);
  }
}

/* ── Register ─────────────────────────────────────────────────── */
customElements.define("buderus-monitor-card", BuderusMonitorCard);
customElements.define("buderus-monitor-card-editor", BuderusMonitorCardEditor);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "buderus-monitor-card",
  name: `Buderus Monitor v${BMC_VERSION}`,
  description: "Vollständiges Wärmepumpen-Dashboard mit mini-graph-card, allen EMS-ESP Sensoren und vollem visuellen Editor.",
  preview: true,
  documentationURL: "https://github.com/custom-cards/buderus-monitor-card"
});

console.info(`%c BUDERUS-MONITOR-CARD %c v${BMC_VERSION} `, "background:#00549f;color:white;font-weight:bold;padding:2px 6px;border-radius:4px 0 0 4px", "background:#1a1a2e;color:#4fc3f7;font-weight:bold;padding:2px 6px;border-radius:0 4px 4px 0");

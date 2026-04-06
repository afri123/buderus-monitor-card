// ================================================================
// Buderus Pro Monitor Card v0.0.2
// Full EMS-ESP integration · mini-graph-card · Visual Editor
// ================================================================

const BMC_VERSION = "0.0.2";

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
    graphs: ["outside_temp", "flow_temp", "return_temp", "dhw_temp", "compressor_power"]
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
  graph_hours: 24,
  graph_line_width: 2,
  graph_opacity: "0.25",
  metric_value_size: "1.5rem",
  metric_label_size: "0.7rem",
  tab_style: "pills", // pills | underline | minimal
  show_header: true,
  show_cop: true,
  show_status_bar: true,
  animate: true,
  compact: false,
  columns_hero: 3,
  columns_detail: 3,
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
    this._fullRender();
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

    // Attach tab listeners
    this.shadowRoot.querySelectorAll(".tab-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        this._activeTab = btn.dataset.tab;
        this._fullRender();
      });
    });

    // Init mini-graph-cards
    this._initGraphs();

    // Attach control listeners
    this._attachControlListeners();
  }

  _buildCSS() {
    const s = this._config.style;
    const animate = s.animate ? `
      @keyframes bmc-pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
      @keyframes bmc-glow { 0%,100%{box-shadow:0 0 8px ${s.accent}33} 50%{box-shadow:0 0 20px ${s.accent}66} }
      @keyframes bmc-fadein { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:none} }
    ` : "";

    return `
      ${animate}
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      ha-card { background: transparent !important; border: none !important; box-shadow: none !important; }
      .bmc-card {
        background: ${s.card_bg};
        border-radius: ${s.card_radius};
        padding: ${s.card_padding};
        font-family: var(--paper-font-body1_-_font-family, 'Segoe UI', sans-serif);
        color: var(--primary-text-color, #e0e0e0);
        position: relative;
        overflow: hidden;
      }

      /* Header */
      .bmc-header {
        display: flex; justify-content: space-between; align-items: center;
        margin-bottom: 16px; padding-bottom: 12px;
        border-bottom: 1px solid rgba(255,255,255,0.06);
      }
      .bmc-title {
        display: flex; align-items: center; gap: 10px;
        font-size: 1.15rem; font-weight: 800; letter-spacing: -0.3px;
      }
      .bmc-title ha-icon { color: ${s.accent}; --mdc-icon-size: 26px; }
      .bmc-version { font-size: 0.6rem; opacity: 0.3; font-weight: 400; }

      /* Status Bar */
      .bmc-status {
        display: flex; gap: 8px; margin-bottom: 16px; flex-wrap: wrap;
      }
      .status-pill {
        display: inline-flex; align-items: center; gap: 6px;
        padding: 5px 14px; border-radius: 20px; font-size: 0.72rem;
        font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px;
        background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.08);
      }
      .status-dot {
        width: 8px; height: 8px; border-radius: 50%;
        ${s.animate ? "animation: bmc-pulse 2s infinite;" : ""}
      }

      /* Tabs */
      .bmc-tabs {
        display: flex; gap: 4px; margin-bottom: 16px;
        overflow-x: auto; scrollbar-width: none; -ms-overflow-style: none;
        padding-bottom: 4px;
      }
      .bmc-tabs::-webkit-scrollbar { display: none; }
      .tab-btn {
        flex-shrink: 0; display: flex; align-items: center; gap: 5px;
        padding: 7px 14px; border: none; border-radius: 10px; cursor: pointer;
        font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;
        background: rgba(255,255,255,0.04); color: var(--secondary-text-color, #999);
        transition: all 0.25s ease; white-space: nowrap;
      }
      .tab-btn:hover { background: rgba(255,255,255,0.08); }
      .tab-btn.active {
        background: ${s.accent}22; color: ${s.accent};
        border: 1px solid ${s.accent}44;
      }
      .tab-btn ha-icon { --mdc-icon-size: 16px; }

      /* Metric Grid */
      .metric-grid {
        display: grid; grid-template-columns: repeat(${s.columns_hero}, 1fr);
        gap: 12px;
        ${s.animate ? "animation: bmc-fadein 0.3s ease;" : ""}
      }
      .metric-grid.detail { grid-template-columns: repeat(${s.columns_detail}, 1fr); }

      .metric-box {
        background: rgba(255,255,255,0.04); border-radius: 14px; padding: 16px;
        position: relative; overflow: hidden; border: 1px solid rgba(255,255,255,0.04);
        transition: all 0.25s ease; cursor: default;
        display: flex; flex-direction: column; min-height: 100px;
      }
      .metric-box:hover {
        background: rgba(255,255,255,0.07);
        border-color: rgba(255,255,255,0.08);
        transform: translateY(-1px);
      }
      .metric-box.has-graph { min-height: 130px; }

      .m-label {
        font-size: ${s.metric_label_size}; text-transform: uppercase;
        color: var(--secondary-text-color, #888);
        font-weight: 800; letter-spacing: 0.7px; margin-bottom: 6px; z-index: 1;
      }
      .m-value {
        font-size: ${s.metric_value_size}; font-weight: 900;
        color: var(--primary-text-color, #eee);
        letter-spacing: -0.5px; z-index: 1;
      }
      .m-value.binary-on { color: ${s.accent_secondary}; }
      .m-value.binary-off { color: var(--secondary-text-color, #666); }

      .graph-slot {
        position: absolute; bottom: 0; left: 0; right: 0; height: 100%;
        opacity: ${s.graph_opacity}; pointer-events: none; z-index: 0;
        overflow: hidden; border-radius: 0 0 14px 14px;
      }
      .graph-slot mini-graph-card {
        --ha-card-background: transparent;
        --ha-card-border-width: 0;
        --ha-card-box-shadow: none;
      }

      /* COP Bar */
      .cop-section {
        margin: 16px 0; padding: 16px; border-radius: 14px;
        background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.04);
      }
      .cop-header { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 10px; }
      .cop-label { font-size: 0.75rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.7px; color: var(--secondary-text-color); }
      .cop-value { font-size: 1.3rem; font-weight: 900; color: ${s.accent}; }
      .cop-track { height: 8px; background: rgba(255,255,255,0.06); border-radius: 4px; overflow: hidden; }
      .cop-fill { height: 100%; border-radius: 4px; transition: width 1.5s ease; }

      /* Controls */
      .controls-section { ${s.animate ? "animation: bmc-fadein 0.3s ease;" : ""} }
      .control-row {
        display: flex; justify-content: space-between; align-items: center;
        padding: 12px 16px; border-radius: 12px; margin-bottom: 6px;
        background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.04);
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

      .section-divider {
        font-size: 0.7rem; font-weight: 800; text-transform: uppercase;
        letter-spacing: 1px; color: ${s.accent}; opacity: 0.7;
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

    // COP on hero tab
    if (tab === "hero" && this._config.style.show_cop) {
      html += this._renderCOP();
    }

    // Metrics (sensors)
    if (sec.metrics) {
      const hasGraphs = sec.graphs || [];
      const isHero = tab === "hero";
      html += `<div class="metric-grid ${isHero ? "" : "detail"}">`;
      for (const key of sec.metrics) {
        const eid = this._config.entities[key];
        const sv = _sv(this._hass, eid);
        const label = BMC_LABELS[key] || key;
        const showGraph = hasGraphs.includes(key);
        const isBinary = eid && eid.startsWith("binary_sensor.");
        let valClass = "m-value";
        let display;
        if (isBinary) {
          display = sv.s === "on" ? "AN" : "AUS";
          valClass += sv.s === "on" ? " binary-on" : " binary-off";
        } else {
          display = _fmt(sv.v, sv.u);
        }
        html += `
          <div class="metric-box ${showGraph ? "has-graph" : ""}">
            ${showGraph ? `<div class="graph-slot" id="graph-${key}"></div>` : ""}
            <div class="m-label">${label}</div>
            <div class="${valClass}">${display}</div>
          </div>
        `;
      }
      html += `</div>`;
    }

    // Controls
    if (sec.controls) {
      html += `<div class="controls-section">`;
      if (sec.sensors) {
        html += `<div class="section-divider">Sensoren</div>`;
        html += `<div class="metric-grid detail">`;
        for (const key of sec.sensors) {
          const eid = this._config.entities[key];
          const sv = _sv(this._hass, eid);
          const label = BMC_LABELS[key] || key;
          const isBinary = eid && eid.startsWith("binary_sensor.");
          let display, valClass = "m-value";
          if (isBinary) { display = sv.s === "on" ? "AN" : "AUS"; valClass += sv.s === "on" ? " binary-on" : " binary-off"; }
          else { display = _fmt(sv.v, sv.u); }
          html += `<div class="metric-box"><div class="m-label">${label}</div><div class="${valClass}">${display}</div></div>`;
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

    // Fallback: read-only
    return `
      <div class="control-row">
        <span class="ctrl-label">${label}</span>
        <span class="ctrl-value">${sv.s}${sv.u ? " " + sv.u : ""}</span>
      </div>
    `;
  }

  _initGraphs() {
    const sec = BMC_SECTIONS[this._activeTab];
    if (!sec?.graphs) return;

    for (const key of sec.graphs) {
      const container = this.shadowRoot.getElementById(`graph-${key}`);
      if (!container) continue;
      const eid = this._config.entities[key];
      if (!eid) continue;

      try {
        const graphCard = document.createElement("mini-graph-card");
        graphCard.setConfig({
          entities: [{ entity: eid, color: this._config.style.accent }],
          hours_to_show: parseInt(this._config.style.graph_hours) || 24,
          points_per_hour: 4,
          line_width: parseInt(this._config.style.graph_line_width) || 2,
          animate: this._config.style.animate,
          fill: true,
          show: {
            name: false, state: false, legend: false,
            icon: false, labels: false, extrema: false,
            fill: true, points: false
          },
          card_mod: { style: "ha-card { background: transparent !important; border: none !important; box-shadow: none !important; }" }
        });
        graphCard.hass = this._hass;
        container.appendChild(graphCard);
      } catch (e) {
        // mini-graph-card not installed — silent fail
        container.innerHTML = "";
      }
    }
  }

  _attachControlListeners() {
    // Switches
    this.shadowRoot.querySelectorAll('input[data-domain="switch"]').forEach(el => {
      el.addEventListener("change", () => {
        const eid = el.dataset.entity;
        this._hass.callService("switch", el.checked ? "turn_on" : "turn_off", { entity_id: eid });
      });
    });

    // Selects
    this.shadowRoot.querySelectorAll('select[data-domain="select"]').forEach(el => {
      el.addEventListener("change", () => {
        this._hass.callService("select", "select_option", {
          entity_id: el.dataset.entity, option: el.value
        });
      });
    });

    // Numbers
    this.shadowRoot.querySelectorAll('input[data-domain="number"]').forEach(el => {
      let timeout;
      el.addEventListener("change", () => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          this._hass.callService("number", "set_value", {
            entity_id: el.dataset.entity, value: parseFloat(el.value)
          });
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
    this.shadowRoot.querySelectorAll("ha-entity-picker").forEach(p => {
      p.hass = this._hass;
    });
  }

  _render() {
    const c = this._config;
    const s = c.style;

    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; }
        .editor { font-family: var(--paper-font-body1_-_font-family, sans-serif); padding: 8px; }
        details { margin-bottom: 12px; border: 1px solid rgba(128,128,128,0.15); border-radius: 12px; overflow: hidden; }
        summary {
          padding: 12px 16px; cursor: pointer; font-weight: 800; font-size: 0.85rem;
          text-transform: uppercase; letter-spacing: 0.8px;
          background: rgba(128,128,128,0.06); display: flex; align-items: center; gap: 8px;
        }
        summary ha-icon { --mdc-icon-size: 20px; }
        .section { padding: 12px 16px; display: flex; flex-direction: column; gap: 10px; }
        .field { display: flex; flex-direction: column; gap: 4px; }
        .field label { font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: var(--secondary-text-color); }
        .field input, .field select { width: 100%; padding: 8px 12px; border: 1px solid rgba(128,128,128,0.2); border-radius: 8px; background: var(--card-background-color, #fff); color: var(--primary-text-color); font-size: 0.85rem; }
        ha-entity-picker { width: 100%; }
        .row { display: flex; gap: 10px; }
        .row > * { flex: 1; }
        .chip-row { display: flex; flex-wrap: wrap; gap: 6px; }
        .chip {
          padding: 5px 12px; border-radius: 8px; font-size: 0.72rem; font-weight: 700;
          cursor: pointer; border: 1px solid rgba(128,128,128,0.2);
          background: rgba(128,128,128,0.06); transition: all 0.2s;
          text-transform: uppercase; letter-spacing: 0.5px;
        }
        .chip.active { background: var(--primary-color, #03a9f4); color: white; border-color: transparent; }
        .switch-row { display: flex; justify-content: space-between; align-items: center; padding: 4px 0; }
        .switch-label { font-size: 0.8rem; font-weight: 600; }
      </style>

      <div class="editor">

        <!-- General -->
        <details open>
          <summary><ha-icon icon="mdi:cog"></ha-icon> Allgemein</summary>
          <div class="section">
            <div class="field">
              <label>Titel</label>
              <input type="text" id="ed-title" value="${c.title}">
            </div>
            <div class="field">
              <label>Titel Icon</label>
              <input type="text" id="ed-title-icon" value="${c.title_icon}">
            </div>
          </div>
        </details>

        <!-- Visible Tabs -->
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

        <!-- Entities per section -->
        ${this._renderEntitySections()}

        <!-- Style -->
        <details>
          <summary><ha-icon icon="mdi:palette"></ha-icon> Design & Styling</summary>
          <div class="section">
            <div class="row">
              <div class="field"><label>Akzentfarbe</label><input type="color" id="ed-accent" value="${s.accent}"></div>
              <div class="field"><label>Akzent Sekundär</label><input type="color" id="ed-accent2" value="${s.accent_secondary}"></div>
            </div>
            <div class="row">
              <div class="field"><label>Farbe Heizen</label><input type="color" id="ed-c-heat" value="${s.color_heating}"></div>
              <div class="field"><label>Farbe WW</label><input type="color" id="ed-c-dhw" value="${s.color_dhw}"></div>
              <div class="field"><label>Farbe Idle</label><input type="color" id="ed-c-idle" value="${s.color_idle}"></div>
            </div>
            <div class="row">
              <div class="field"><label>Graph Stunden</label><input type="number" id="ed-graph-hours" value="${s.graph_hours}" min="1" max="168"></div>
              <div class="field"><label>Graph Deckkraft</label><input type="number" id="ed-graph-opacity" value="${s.graph_opacity}" min="0" max="1" step="0.05"></div>
            </div>
            <div class="row">
              <div class="field"><label>Wert-Schriftgröße</label><input type="text" id="ed-val-size" value="${s.metric_value_size}"></div>
              <div class="field"><label>Label-Schriftgröße</label><input type="text" id="ed-lbl-size" value="${s.metric_label_size}"></div>
            </div>
            <div class="row">
              <div class="field"><label>Kartenradius</label><input type="text" id="ed-radius" value="${s.card_radius}"></div>
              <div class="field"><label>Karten-Padding</label><input type="text" id="ed-padding" value="${s.card_padding}"></div>
            </div>
            <div class="field"><label>Karten-Hintergrund</label><input type="text" id="ed-bg" value="${s.card_bg}"></div>
            <div class="row">
              <div class="field"><label>Spalten Hero</label><input type="number" id="ed-cols-hero" value="${s.columns_hero}" min="1" max="6"></div>
              <div class="field"><label>Spalten Detail</label><input type="number" id="ed-cols-detail" value="${s.columns_detail}" min="1" max="6"></div>
            </div>
            <div class="field"><label>Graph Linienbreite</label><input type="number" id="ed-graph-lw" value="${s.graph_line_width}" min="1" max="8"></div>

            <div class="switch-row">
              <span class="switch-label">Header anzeigen</span>
              <ha-switch id="ed-show-header" ${s.show_header ? "checked" : ""}></ha-switch>
            </div>
            <div class="switch-row">
              <span class="switch-label">COP anzeigen</span>
              <ha-switch id="ed-show-cop" ${s.show_cop ? "checked" : ""}></ha-switch>
            </div>
            <div class="switch-row">
              <span class="switch-label">Statusleiste</span>
              <ha-switch id="ed-show-status" ${s.show_status_bar ? "checked" : ""}></ha-switch>
            </div>
            <div class="switch-row">
              <span class="switch-label">Animationen</span>
              <ha-switch id="ed-animate" ${s.animate ? "checked" : ""}></ha-switch>
            </div>
          </div>
        </details>
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

    // Simple inputs
    const simpleMap = {
      "ed-title": (v) => { this._config.title = v; },
      "ed-title-icon": (v) => { this._config.title_icon = v; },
    };
    for (const [id, fn] of Object.entries(simpleMap)) {
      const el = $(id);
      if (el) el.addEventListener("input", (e) => { fn(e.target.value); this._fire(); });
    }

    // Style inputs
    const styleMap = {
      "ed-accent": "accent", "ed-accent2": "accent_secondary",
      "ed-c-heat": "color_heating", "ed-c-dhw": "color_dhw", "ed-c-idle": "color_idle",
      "ed-graph-hours": "graph_hours", "ed-graph-opacity": "graph_opacity",
      "ed-val-size": "metric_value_size", "ed-lbl-size": "metric_label_size",
      "ed-radius": "card_radius", "ed-padding": "card_padding", "ed-bg": "card_bg",
      "ed-cols-hero": "columns_hero", "ed-cols-detail": "columns_detail",
      "ed-graph-lw": "graph_line_width",
    };
    for (const [id, key] of Object.entries(styleMap)) {
      const el = $(id);
      if (el) el.addEventListener("input", (e) => {
        let val = e.target.value;
        if (["graph_hours", "columns_hero", "columns_detail", "graph_line_width"].includes(key)) val = parseInt(val) || 0;
        this._config.style[key] = val;
        this._fire();
      });
    }

    // Switches
    const switchMap = {
      "ed-show-header": "show_header", "ed-show-cop": "show_cop",
      "ed-show-status": "show_status_bar", "ed-animate": "animate",
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
        this._fire();
        this._render();
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
  name: `Buderus Pro Monitor v${BMC_VERSION}`,
  description: "Vollständiges Wärmepumpen-Dashboard mit mini-graph-card, allen EMS-ESP Sensoren und vollem visuellen Editor.",
  preview: true,
  documentationURL: "https://github.com/custom-cards/buderus-monitor-card"
});

console.info(`%c BUDERUS-MONITOR-CARD %c v${BMC_VERSION} `, "background:#00549f;color:white;font-weight:bold;padding:2px 6px;border-radius:4px 0 0 4px", "background:#1a1a2e;color:#4fc3f7;font-weight:bold;padding:2px 6px;border-radius:0 4px 4px 0");

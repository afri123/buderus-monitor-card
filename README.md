# Buderus Monitor Card

[![hacs_badge](https://img.shields.io/badge/HACS-Custom-41BDF5.svg?style=for-the-badge)](https://github.com/hacs/integration)

A modern, highly customizable Home Assistant Lovelace card designed specifically for **Buderus / Bosch Heat Pumps** (e.g., WLW196i) connected via the [EMS-ESP](https://emsesp.github.io/docs/) integration.

Instead of a cluttered grid of 50+ sensors, this card acts as a **smart dashboard**. It automatically pulls the most important data (temperatures, power, modulation, energy yields) and visualizes them in a clean, flicker-free, and responsive UI.

## ✨ Features

- **🪄 Zero-Config Auto-Discovery:** Automatically detects standard EMS-ESP entity names (like `sensor.boiler_outside_temperature` or `sensor.thermostat_hc1_target_flow_temperature`). No YAML editing required!
- **⚡ Smart Rendering Engine:** Built with a custom DOM-diffing algorithm. Values update instantly in real-time without the card flickering.
- **🖥️ Full Visual Editor:** Configure titles, behaviors, and all colors directly through the Home Assistant UI.
- **📊 Hero Metrics:** Instantly see Outside, Flow, Return, and DHW (Water Heater) temperatures.
- **🔥 Power & Modulation:** Visual progress bar for your compressor's current power usage and modulation.
- **🛠️ Quick Actions:** Includes an interactive button to trigger a "1x DHW" (Warmwasser) charge if the switch is available in your system.

## ⚠️ Requirements
This card expects your heat pump to be integrated into Home Assistant via **EMS-ESP** (e.g., using the BBQKees Gateway). It relies on the default naming convention of EMS-ESP (entities starting with `sensor.boiler_...` and `sensor.thermostat_...`).

## ⚙️ Installation

### HACS (Recommended)
1. Open HACS in your Home Assistant instance.
2. Click on `Frontend`.
3. Click the three dots in the top right corner and select `Custom repositories`.
4. Add the URL of your repository.
5. Select `Dashboard` as the category and click `Add`.
6. Search for `Buderus Monitor Card` in HACS and click `Download`.
7. Reload your browser cache.

### Manual
1. Download the `buderus-monitor-card.js` file from the latest release.
2. Copy the file into your `<config>/www/` directory.
3. Go to **Settings** -> **Dashboards** -> **Resources** (top right menu).
4. Add a new resource:
   - URL: `/local/buderus-monitor-card.js`
   - Resource Type: `JavaScript Module`

## 🛠️ Configuration

Thanks to Auto-Discovery, the basic configuration requires almost no setup. The Visual Editor covers 100% of the card's features.

### Basic Setup
Just add the card type to your dashboard. It will automatically find and render your EMS-ESP sensors.

```yaml
type: custom:buderus-monitor-card
title: Heat Pump WLW196i
````

### Configuration Variables

All visual parameters can be set via the UI Editor. For YAML power users, here are the available root keys:

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `type` | string | **Required** | `custom:buderus-monitor-card` |
| `title` | string | `Wärmepumpe`| The header title of the card. |
| `title_icon` | string | `mdi:heat-pump` | The icon next to the title. |
| `show_energy` | boolean | `true` | Show heating and DHW energy yields. |
| `show_system` | boolean | `true` | Show compressor starts and EMS-ESP WiFi strength. |
| `show_actions` | boolean | `true` | Show the quick action button for 1x DHW charging. |
| `style` | object | `{}` | Dictionary containing all visual CSS overrides (colors). |

#### Style Object Variables (`style:`)
You can customize the state colors to match your theme:
```yaml
style:
  card_bg: "rgba(20, 20, 20, 0.9)"
  color_heating: "#ff5722"
  color_dhw: "#e91e63"
  color_cooling: "#03a9f4"
  color_idle: "#4caf50"
````

## 🤝 Contributing
Feel free to open an issue or submit a pull request if you have ideas for new features or find a bug!

## 📄 License
This project is licensed under the MIT License.

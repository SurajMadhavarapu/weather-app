# SkyCast AI — Smart Weather & Travel Intelligence Platform 

A modern, responsive weather & travel intelligence platform built with **React + Vite** and the **Open-Meteo API** (free, no API key required). Features an **AI-powered travel assistant** (Ollama Mistral) and **interactive weather map**. Built for the **PM Accelerator AI Engineer Intern Technical Assessment** (Frontend).

**Built by [Suraj Madhavarapu](https://github.com/SurajMadhavarapu)**

---

## What Makes SkyCast AI Unique & Standout

SkyCast AI directly addresses the assessment's prompt: *"What are some things users should consider that might not be obvious when traveling?"*

### Key Unique Features

1. **Smart Travel & Outfit Intelligence Engine**
   - **Apparel & Gear Suggestions**: Real-time packing recommendations based on temp, wind, rain likelihood, and UV (e.g. *Light Linen Wear, Shorts, Sunglasses & SPF 30+*, or *Heavy Winter Coat & Waterproof Boots*).
   - **Outdoor Activity Suitability Index**: 0–100% scores for **Sightseeing & Walking**, **Running & Exercise**, **Beach & Picnic**, and **Outdoor Photography**.

2. **Real-time Air Quality (AQI) & Environmental Health**
   - Integrates Open-Meteo Air Quality API to display US AQI score, PM2.5, PM10, Dust, and actionable health advisories for travelers & sensitive groups.

3. **Dual-Location Travel Comparison ("Home vs Destination")**
   - Side-by-side comparison mode comparing your home location with your travel destination. Highlights temperature delta (`+7°C Warmer`), time zone offset (`8 hrs ahead`), and packing adjustments.

4. **Severe Weather Hazard Alert Banners**
   - Real-time warning banners for active thunderstorms, dangerous UV levels (≥8), gusty winds (≥45 km/h), sub-zero ice hazards, or heavy rain driving risks.

5. **Live Target Location Local Time**
   - Computes live wall-clock time using the target location's UTC offset & timezone (e.g., `GMT+9` for Tokyo).

6. **°C / °F Unit Switcher**
   - Instant conversion across current temp, feels-like, 24-hour hourly forecast, and 5-day forecast range bars.

7. **AI Weather Travel Assistant (Ollama-Powered Chatbot)**
   - Natural language chatbot powered by a **local Ollama Mistral LLM** — no cloud API keys needed.
   - Injected with full live weather context (current conditions, 5-day forecast, air quality) so answers are grounded in real data.
   - Ask questions like *"Should I carry an umbrella?"*, *"What should I wear today?"*, *"Is it safe for outdoor running?"*
   - Streaming responses with typing animation for a polished UX.
   - Floating chat bubble UI that overlays the app without disrupting the layout.

8. **Interactive OpenStreetMap Weather Radar & Map**
   - Dark-themed interactive map (Leaflet + CartoDB Dark Matter tiles) centered on the searched location.
   - Custom weather marker pin showing live temperature.
   - Clickable popup with current conditions summary (temp, humidity, wind).
   - Zoomable, pannable geographic context showing nearby cities.

---

## Tech Stack

| Technology | Purpose |
|---|---|
| **React 19** | UI framework |
| **Vite** | Build tool & dev server (with Ollama proxy) |
| **Vanilla CSS** | All styling (Glassmorphism design system) |
| **Open-Meteo API** | Weather forecast & Air Quality APIs (free, no key needed) |
| **Ollama + Mistral** | Local AI chatbot for weather travel assistant |
| **Leaflet + OpenStreetMap** | Interactive weather map with dark-themed tiles |
| **Nominatim OpenStreetMap** | Reverse geocoding for current location |
| **Browser Geolocation API** | GPS location detection |

---

## Getting Started

### Prerequisites
- **Node.js** ≥ 18
- **npm** ≥ 9
- **Ollama** (optional, for AI chatbot) — [Install Ollama](https://ollama.ai)
  ```bash
  # Pull the Mistral model (required for AI assistant)
  ollama pull mistral
  # Start Ollama server
  ollama serve
  ```

### Installation

```bash
# Clone repository
git clone https://github.com/SurajMadhavarapu/weather-app.git
cd weather-app

# Install dependencies
npm install

# Start development server
npm run dev
```

App runs at `http://localhost:5173/`

### Production Build

```bash
npm run build
npm run preview
```

---

## Project Architecture

```
weather-app/
├── index.html                  # HTML entry point with SEO meta tags
├── package.json                # Dependencies & scripts
├── vite.config.js              # Vite config + Ollama proxy
├── src/
│   ├── main.jsx                # React entry point
│   ├── App.jsx                 # Main application shell & state management
│   ├── index.css               # Complete Glassmorphism design system
│   ├── components/
│   │   ├── SearchBar.jsx           # Location search with autocomplete
│   │   ├── CurrentWeather.jsx      # Current weather & target local time
│   │   ├── TravelInsightsCard.jsx  # Smart packing & outdoor activity index
│   │   ├── AirQualityCard.jsx      # US AQI score & pollutant breakdown
│   │   ├── HazardBanner.jsx        # Severe weather risk alerts
│   │   ├── CompareModal.jsx        # Home vs Destination comparison drawer
│   │   ├── HourlyForecast.jsx      # 24-hour forecast strip
│   │   ├── FiveDayForecast.jsx     # 5-day forecast with temp range bars
│   │   ├── WeatherDetails.jsx      # Detail cards (humidity, wind, UV, etc.)
│   │   ├── AIChatAssistant.jsx     #  AI chatbot with floating panel
│   │   ├── InteractiveMap.jsx      #  Leaflet weather map
│   │   ├── ErrorMessage.jsx        # Graceful error handling UI
│   │   ├── LoadingSpinner.jsx      # Loading state indicator
│   │   └── Footer.jsx             # Author credit & attributions
│   ├── services/
│   │   ├── weatherApi.js           # API calls (geocoding, weather, AQI, geolocation)
│   │   └── ollamaService.js        #  Ollama AI chat (streaming + context injection)
│   └── utils/
│       ├── travelInsights.js       # AI rule engine for outfit & activity scores
│       ├── weatherCodes.jsx        # WMO code mapping & SVG icons
│       └── helpers.js              # Formatting & °C/°F conversion helpers
```

---

## Author

**Suraj Madhavarapu**
- GitHub: [@SurajMadhavarapu](https://github.com/SurajMadhavarapu)

---

## License

MIT License — feel free to use, modify, and distribute.

# VenueIQ 2026

VenueIQ is a GenAI-enabled stadium operations command center and fan copilot designed for the FIFA World Cup 2026 host venues. It provides real-time decision support, multilingual fan assistance, step-free/sensory accessibility routing, and carbon-reduction transport optimizations.

---

## 🎯 Chosen Vertical
* **Smart Stadiums & Tournament Operations**: Focuses on enhancing stadium crowd flow, safety coordination, steward tasking, and the tournament experience for fans, volunteers, and venue operators.

---

## 🧠 Approach & Logic

### 1. Multi-Tiered Generative Pipeline (Fail-Safe Availability)
Stadiun operations require 100% uptime. VenueIQ is built with a resilient, three-tiered routing system:
* **Tier 1 (Server Proxy)**: If running the Node.js server, API requests proxy through to `gemini-2.0-flash`.
* **Tier 2 (Client Direct Fetch)**: If deployed on a static hosting service (like GitHub Pages), the client's browser connects directly to the Google AI Studio Gemini API endpoint using the API key entered securely in the UI.
* **Tier 3 (Local Generative Engine)**: If the API key is out of quota (`429`) or the user is offline, the app automatically fails back to an offline rule-based client engine. It generates detailed contextual answers and routes locally.

### 2. Client-Side RAG (Retrieval-Augmented Generation)
To ensure the AI is grounded in official venue policies and stadium layouts rather than hallucinating, the prompt system aggregates:
* **Stadium Geometry**: Venue capacities, gate setups, elevator banks, and quiet zones.
* **Live Telemetry & Incidents**: Match state (pregame, halftime, egress) and active emergency incidents.
* **FIFA Operating Policies**: Approved guidelines for weather delays, accessibility transfers, and transport mode splits.

### 3. Privacy & Secret Security
* **Zero Secret Leaks**: No API keys are hardcoded in the codebase.
* **Local Storage Storage**: Users securely paste their Gemini API Key in the settings UI. The key stays in the browser's `localStorage` and is never transmitted to any third-party backend.
* **Ignored Internal Docs**: Staged Git ignores and untracks internal instructions to ensure no tournament rule files are published.

---

## 💻 How the Solution Works

### 1. Tabbed Operations Dashboard
* **Operations**: Features live metric gauges (Crowd Pressure, Accessible Routes, Volunteer Load, Transit Recovery) and an **Interactive SVG Stadium Map**. Clicking map zones highlights active pathways, reports live statistics, and displays operator SOP instructions.
* **Fan Assist**: An interactive chat terminal. Fans can select quick prompts or ask questions in natural language. The AI responds in their language and includes a **Text-to-Speech (TTS)** speaker button to read directions aloud (supports English, Spanish, French, Portuguese, Arabic, and German).
* **Sustainability**: Displays real-time transportation mode shares. Clicking "Deploy Low-Carbon Incentives" redirects pedestrian/rail traffic, shifts the mode bars, and saves carbon footprint estimates.
* **Audit Log**: A compliance log displaying chronological records of AI alerts, system prompts, model versions, manual operator confirmations, and simulated outcomes.
* **AI Architecture**: Visualizes the prompt compilation, RAG context injection, and human-in-the-loop workflows.

### 2. Incident & Scenario Simulator
* Operators can cycle active game states (Pregame, Halftime, Weather, Egress) or inject custom emergencies (e.g. *Gate A Ticket Scanner Failure*, *Concourse Elevator Down*, *Transit Platform Congestion*, *Severe Thunderstorm*).
* Injecting an incident overrides telemetry, colors the SVG map zones with warning codes (Red for Hot, Amber for Watch), and generates dispatcher instructions.

---

## 📝 Assumptions Made

1. **API Key Input**: The evaluator/operator has a valid Gemini API Key (available on Google AI Studio's free tier) to paste into the "Gemini API Key" password field in the sidebar footer to test live AI queries.
2. **Offline Fallback Usage**: If no API key is supplied, the local Generative Fallback Engine will handle all inputs using static context guidelines.
3. **Browser Capabilities**: The client browser supports HTML5 Speech Synthesis (`window.speechSynthesis`) for the voice assistant features, and SVG 2.0 rendering for the interactive map.
4. **Free Tier Hosting**: The application is intended to run as a static web application hosted on free plans (like GitHub Pages or Firebase Hosting Spark plan).

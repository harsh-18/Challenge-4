# VenueIQ 2026

VenueIQ is a GenAI-enabled stadium operations copilot for FIFA World Cup 2026 host venues (including New York New Jersey Stadium, Atlanta Stadium, Mexico City Stadium, and BC Place Vancouver). It helps organizers, volunteers, venue staff, and fans make faster decisions during matchday crowd surges, weather delays, accessibility needs, transit bottlenecks, and multilingual support requests.

---

## 🚀 Key Upgraded Features

- **Interactive SVG Stadium Map**: Replaces the static grid of buttons with an animated vector map showing real-time crowd pressure heat colors. Zones are hoverable and clickable for live AI-generated operator guidance.
- **Dynamic Tabbed Dashboard**: Easily switch between **Operations**, **Fan Assist**, **Sustainability**, **Audit Log**, and **AI Architecture** panels.
- **Grounded Chat Copilot**: An interactive chat window that answers fan questions using RAG (Retrieval-Augmented Generation) grounded in stadium SOPs, layout geometry, and active incident states.
- **Multilingual Support**: Automatically detects query language and translates instructions to Spanish, French, Portuguese, Arabic, and German.
- **Voice Text-to-Speech (TTS)**: Click the speaker button `🔊` next to any AI chatbot response to hear the route directions read aloud in the native language using the Web Speech API.
- **Incident & Scenario Simulator**: Cycle through *Pregame*, *Halftime*, *Weather delay*, and *Egress* scenarios, or inject custom incidents (e.g., *Gate A Ticket Scanner Failure*) to override metrics and trigger immediate response briefs.
- **Sustainability Eco-Nudges**: Optimize local mode-share splits in real time by deploying rail/shuttle transit incentives to reduce carbon footprints.
- **Compliance Audit Log**: Chronologically logs all AI decisions, prompts, model confidence, manual operator approvals, and simulated outcomes.

---

## 🛡️ Robust RAG & Fallback Logic

VenueIQ uses a **Human-in-the-Loop RAG (Retrieval-Augmented Generation)** architecture:
1. **Live Ingest**: aggregates ticket scans, transit bridge pressure, and elevator status.
2. **Context Matching**: matches the current scenario to approved SOPs, stadium geometry, and translation lexicons.
3. **Gemini API Integration**: The Node.js server proxies requests to `gemini-2.0-flash` using the user-provided `GOOGLE_API_KEY`.
4. **Graceful Fallback**: If the key is out of quota (status `429`) or the server is offline, the client-side **Generative Fallback Engine** automatically compiles contextual answers and dispatches from the local knowledge base. The app remains 100% functional even offline.
5. **Human Approval**: High-impact dispatcher actions require manual operator confirmation before notifications are sent out.

---

## 🛠️ How to Run Locally

### 1. Run Node.js Proxy Server
This runs the proxy server and handles static asset routing and API proxying:
```bash
# In Windows Powershell (from workspace root):
$env:PORT=3000
node server.js
```
Open your browser and navigate to **`http://localhost:3000`**.

### 2. Run Standalone Client-Side Mode
You can also open the app directly from your file manager by double-clicking `index.html` (e.g. `file:///c:/Users/.../index.html`).
- The application will automatically detect that the Node server is offline and activate the **Generative Fallback Engine** to run entirely client-side.

---

## ☁️ Google Cloud Run Deployment

To deploy VenueIQ 2026 to Google Cloud Run:
1. Ensure your Google Cloud Project has **Billing enabled** (required for running containers on Cloud Run).
2. Execute the following deployment command from the project root:
   ```bash
   gcloud run deploy venueiq-2026 --source . --project genai-apac-2-497615 --region us-central1 --allow-unauthenticated
   ```
3. (Optional) Set the Gemini API key as an environment variable in production:
   ```bash
   gcloud run services update venueiq-2026 --update-env-vars GOOGLE_API_KEY="YOUR_API_KEY" --project genai-apac-2-497615 --region us-central1
   ```

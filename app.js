// VenueIQ 2026 - Main Application Script

// Core Data Mocks & RAG Context Rules
const venueProfiles = {
  ny: {
    name: "New York New Jersey Stadium",
    capacity: "82,500",
    transitInfo: "MetLife Rail Link is primary. Bus shuttle plazas A and B. Heavy car traffic expected.",
    accessPaths: "Elevators available at Gates A and C. Family ramp at West Gate. Sensory Room located at Section 214.",
    quietPaths: "West service concourse is less congested; routes through tunnel gate F.",
    carbonFactors: { rail: 48, shuttle: 26, ride: 18, walk: 8 }
  },
  atl: {
    name: "Atlanta Stadium",
    capacity: "71,000",
    transitInfo: "MARTA rail station directly connects to Gate North. Shuttle loop runs continuously.",
    accessPaths: "Elevator bank at Gate North and Gate South. Sensory Room located at Section 102.",
    quietPaths: "Lower concourse hallway behind concessions is quiet corridor.",
    carbonFactors: { rail: 55, shuttle: 20, ride: 18, walk: 7 }
  },
  mx: {
    name: "Mexico City Stadium",
    capacity: "87,500",
    transitInfo: "Metro Tasqueña connection via shuttle shuttle plazas. High pedestrian flow on main bridge.",
    accessPaths: "Step-free ramp access at Gate West and Gate East. Sensory Room located at Section 120.",
    quietPaths: "Family zone corridor adjacent to section 115 is sensory friendly.",
    carbonFactors: { rail: 40, shuttle: 35, ride: 15, walk: 10 }
  },
  van: {
    name: "BC Place Vancouver",
    capacity: "54,000",
    transitInfo: "Expo Line SkyTrain connection. Pedestrian bridge egress to city center.",
    accessPaths: "Lift banks available at Sections 105, 118, 222. Sensory Room located at Suite Level 2.",
    quietPaths: "North concourse secondary corridor away from main entry bridge.",
    carbonFactors: { rail: 50, shuttle: 22, ride: 20, walk: 8 }
  }
};

const scenarios = {
  pregame: {
    crowd: "78%",
    crowdVal: 78,
    delta: "Gate A rising in 12 min",
    access: "94%",
    accessVal: 94,
    staff: "6.8",
    staffVal: 68,
    transit: "18m",
    transitVal: 55,
    risk: "Elevated",
    brief: [
      ["Open relief gate N3", "Ticket scans predict a north plaza bottleneck before kickoff. Move four volunteers and bilingual signage to N3."],
      ["Protect accessible lift bank", "Keep lift queue below six minutes by holding one elevator for mobility requests until 20 minutes after anthem."],
      ["Send fan nudge", "Push rail-first arrival guidance in English, Spanish, and French to sections 210-235."]
    ],
    dispatch: [
      ["Zone lead A", "Move two volunteers from family entry to north gate for 18 minutes."],
      ["Transit liaison", "Ask rail operator to hold one extra trainset for post-anthem late arrivals."],
      ["Accessibility captain", "Confirm sensory room capacity and quiet route signage at Section 214."]
    ]
  },
  halftime: {
    crowd: "84%",
    crowdVal: 84,
    delta: "Concourse demand peaking",
    access: "91%",
    accessVal: 91,
    staff: "7.4",
    staffVal: 74,
    transit: "22m",
    transitVal: 65,
    risk: "High",
    brief: [
      ["Stagger concessions", "Recommend mobile-order pickup windows by section to reduce east concourse compression."],
      ["Redirect restroom traffic", "Digital boards should route family sections to lower-utilization south facilities."],
      ["Radio script ready", "Generated 20-second steward instruction for safe one-way flow near bridge stairs."]
    ],
    dispatch: [
      ["Concourse team", "Create one-way lane from east stairs to concessions until minute 58."],
      ["Medical rover", "Stage at bridge midpoint where density and heat index are both elevated."],
      ["Language desk", "Prepare Portuguese and Arabic queue updates for visiting supporters."]
    ]
  },
  weather: {
    crowd: "69%",
    crowdVal: 69,
    delta: "Covered areas filling",
    access: "88%",
    accessVal: 88,
    staff: "8.1",
    staffVal: 81,
    transit: "31m",
    transitVal: 80,
    risk: "Weather watch",
    brief: [
      ["Shelter routing", "Move fans from exposed plaza to two covered concourses without blocking emergency aisles."],
      ["Delay explainer", "Generate concise multilingual updates with expected restart window and refund-neutral wording."],
      ["Supplier check", "Prioritize water and poncho replenishment near family entry and accessible seating."]
    ],
    dispatch: [
      ["Safety officer", "Approve shelter plan for exposed plaza within five minutes."],
      ["Volunteer desk", "Swap outdoor wayfinding team to covered concourse assignments."],
      ["Comms lead", "Publish delay update in six languages through app, boards, and PA."]
    ]
  },
  egress: {
    crowd: "73%",
    crowdVal: 73,
    delta: "South plaza clearing slowly",
    access: "96%",
    accessVal: 96,
    staff: "5.9",
    staffVal: 59,
    transit: "14m",
    transitVal: 40,
    risk: "Stable",
    brief: [
      ["Pulse exits", "Release upper bowl sections in two-minute waves to align with rail platform capacity."],
      ["Reduce ride-hail load", "Offer walking route and shuttle incentives to hotels within 1.6 miles."],
      ["Close loop", "Summarize incidents and unresolved tasks for overnight operations handoff."]
    ],
    dispatch: [
      ["Egress captain", "Hold section 340 for two minutes while platform occupancy drops below threshold."],
      ["Sustainability lead", "Push rail and walking incentives to fans without mobility flags."],
      ["Ops analyst", "Tag crowd model forecast error for post-match review."]
    ]
  }
};

const zoneGuidance = {
  "North gate": "AI guidance: open relief gate N3, route families to west entry, and translate signage into Spanish and French for the next 15 minutes.",
  "Transit bridge": "AI guidance: switch to one-way bridge flow toward entry, position medical rover at midpoint, and hold ride-hail alerts until density drops.",
  "Family entry": "AI guidance: keep family entry open as a calm-route buffer and direct sensory-sensitive fans through this path.",
  "East concourse": "AI guidance: pause vendor restocking carts, separate concession and restroom queues, and send a steward script to section leads.",
  "Accessible lift bank": "AI guidance: reserve one lift for mobility requests, add a volunteer at the call button, and update step-free route ETAs in-app.",
  "South plaza": "AI guidance: maintain current staffing and use this area as the overflow exit if north pressure exceeds 85%."
};

const incidentOverrides = {
  gate_fail: {
    title: "Gate A Ticket Scanner Failure",
    zone: "North gate",
    risk: "High",
    crowd: "89%",
    crowdVal: 89,
    access: "90%",
    accessVal: 90,
    staff: "8.5",
    staffVal: 85,
    transit: "25m",
    transitVal: 70,
    brief: [
      ["Divert Gate A queue", "Scanner system failure at Gate A. Reroute arriving fans to East gates immediately. Push warning notifications in app."],
      ["Bilingual support dispatch", "Move 6 Spanish/English volunteer wayfinders to Gate A plaza to guide fans to adjacent gates."],
      ["Steward radio alert", "Deploy steward task force to form queue guides at North concourse stairs to prevent backward compression."]
    ],
    dispatch: [
      ["Network Operations", "Verify router connectivity and restart scan gateway at North entry."],
      ["East Gate team", "Prepare for 30% volume spike. Open 4 additional ticket scan lanes."],
      ["Wayfinding desk", "Deploy digital messaging boards directing fans to East gate lanes."]
    ]
  },
  lift_maintenance: {
    title: "Concourse Elevator Down",
    zone: "Accessible lift bank",
    risk: "Elevated",
    crowd: "78%",
    crowdVal: 78,
    access: "72%",
    accessVal: 72,
    staff: "7.5",
    staffVal: 75,
    transit: "18m",
    transitVal: 55,
    brief: [
      ["Reroute mobility guests", "Lift bank C mechanical fault. Divert wheelchair and limited-mobility transfers to West family entry ramp."],
      ["Ramp escorts", "Deploy 4 accessibility volunteers to guide guests from Lift Bank C to the family ramp lanes."],
      ["App transit update", "Highlight elevator offline status and updated accessible routing paths in the mobile app."]
    ],
    dispatch: [
      ["Maintenance team", "Dispatch elevator technician to Lift Bank C with priority level 1."],
      ["Accessibility captain", "Establish accessible shuttle cart loop between Gate C and West gate ramps."],
      ["Steward Lead 104", "Place physical accessibility redirection signage at section 104 lobby."]
    ]
  },
  plaza_jam: {
    title: "Transit Platform Congestion",
    zone: "Transit bridge",
    risk: "High",
    crowd: "85%",
    crowdVal: 85,
    access: "88%",
    accessVal: 88,
    staff: "7.8",
    staffVal: 78,
    transit: "42m",
    transitVal: 95,
    brief: [
      ["Limit Bridge Inflow", "Egress bridge bottleneck due to rail platform delay. Establish pulsed exit flow at plaza gates."],
      ["Eco-transport divert", "Push free beverage incentive vouchers for shuttle loop to clear bridge queue."],
      ["Bilingual announcements", "Broadcast transit bridge delays in English, Spanish, and French on PA system."]
    ],
    dispatch: [
      ["Bridge team", "Switch bridge flow to pulsed waves of 2-minute releases."],
      ["Transit Liaison", "Request rail operator to accelerate trainset departures from platform 1."],
      ["Sustainability captain", "Send eco-incentive shuttle pushes to sections 100-140."]
    ]
  },
  storm: {
    title: "Severe Thunderstorm Alert",
    zone: "North gate", // Applies broadly but target north plaza
    risk: "Weather Watch",
    crowd: "65%",
    crowdVal: 65,
    access: "80%",
    accessVal: 80,
    staff: "9.2",
    staffVal: 92,
    transit: "38m",
    transitVal: 85,
    brief: [
      ["Execute shelter protocol", "Lightning warning within 5 miles. Reroute plaza queues to covered concourse corridors A and B."],
      ["Transit hold", "Temporarily suspend transit bridge crossings until weather clears. Open sensory room for shelter overflow."],
      ["Steward PA broadcast", "Broadcast play delay instructions in 6 languages over PA and digital display boards."]
    ],
    dispatch: [
      ["Safety Coordinator", "Approve weather shelter plan and clear exposed seating bowls."],
      ["Volunteer Coordinator", "Reassign all outdoor gate guides to covered concourse wayfinding stations."],
      ["Comms lead", "Push delay alerts and expected restart timeline to mobile apps."]
    ]
  }
};

// Global Audit Log Array
const auditLogs = [
  {
    time: "Pregame - 19:01",
    module: "Operations",
    input: "Venue NY: Pregame arrival scenario",
    rec: "Opened relief gate N3; Rerouted 4 volunteers.",
    confidence: "98% (Gemini)",
    approved: "Auto-Approved",
    outcome: "Gate A queue clearance reduced by 4 minutes."
  },
  {
    time: "Pregame - 19:05",
    module: "Fan Assist",
    input: "Steward translation request: 'I need a step-free path'",
    rec: "Generated Spanish routing via Lift Bank C.",
    confidence: "96% (Gemini)",
    approved: "Auto-Approved",
    outcome: "Volunteer dispatched. Fan satisfaction recorded 5/5."
  }
];

// DOM Elements (declared globally, initialized only in browser context)
let crowdMetric, crowdProgress, crowdDelta, accessMetric, accessProgress, staffMetric, staffProgress, transitMetric, transitProgress, riskPill, briefList, dispatchList, scenarioSelect, venueSelect, incidentSelect, zoneDetail, chatWindow, fanQuestion, apiStatusText, auditLogBody, clearAuditBtn, approveDispatchBtn, optimizeNudgeBtn, ecoActiveNudges, nudgeRecommendation;

if (typeof document !== 'undefined') {
  crowdMetric = document.getElementById("crowdMetric");
  crowdProgress = document.getElementById("crowdProgress");
  crowdDelta = document.getElementById("crowdDelta");
  accessMetric = document.getElementById("accessMetric");
  accessProgress = document.getElementById("accessProgress");
  staffMetric = document.getElementById("staffMetric");
  staffProgress = document.getElementById("staffProgress");
  transitMetric = document.getElementById("transitMetric");
  transitProgress = document.getElementById("transitProgress");
  riskPill = document.getElementById("riskPill");
  briefList = document.getElementById("briefList");
  dispatchList = document.getElementById("dispatchList");
  scenarioSelect = document.getElementById("scenarioSelect");
  venueSelect = document.getElementById("venueSelect");
  incidentSelect = document.getElementById("incidentSelect");
  zoneDetail = document.getElementById("zoneDetail");
  chatWindow = document.getElementById("chatWindow");
  fanQuestion = document.getElementById("fanQuestion");
  apiStatusText = document.getElementById("apiStatusText");
  auditLogBody = document.getElementById("auditLogBody");
  clearAuditBtn = document.getElementById("clearAuditBtn");
  approveDispatchBtn = document.getElementById("approveDispatchBtn");
  optimizeNudgeBtn = document.getElementById("optimizeNudgeBtn");
  ecoActiveNudges = document.getElementById("ecoActiveNudges");
  nudgeRecommendation = document.getElementById("nudgeRecommendation");
}

// Active States
let currentScenario = 'pregame';
let currentIncident = null;
let apiActive = true;

// Tab Routing Handler
function handleTabRouting() {
  const hash = window.location.hash || '#dashboard';
  const tabName = hash.replace('#', '');
  
  // Update nav link states
  document.querySelectorAll('.nav-item').forEach(link => {
    if (link.dataset.tab === tabName) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // Update tab visibility
  document.querySelectorAll('.tab-content').forEach(tab => {
    if (tab.id === `tab-${tabName}`) {
      tab.classList.add('active-content');
    } else {
      tab.classList.remove('active-content');
    }
  });
}

if (typeof window !== 'undefined') {
  window.addEventListener('hashchange', handleTabRouting);
  window.addEventListener('load', () => {
    handleTabRouting();
    checkAPIConnectivity();
    renderScenario();
    renderAuditLogs();

    // Setup API Key configuration input
    const keyInput = document.getElementById("apiConfigKey");
    if (keyInput) {
      keyInput.value = DIRECT_GEMINI_KEY;
      keyInput.addEventListener("input", (e) => {
        const val = e.target.value.trim();
        if (val) {
          localStorage.setItem("venueiq_api_key", val);
          DIRECT_GEMINI_KEY = val;
        } else {
          localStorage.removeItem("venueiq_api_key");
          DIRECT_GEMINI_KEY = "";
        }
      });
    }
  });
}

// Check Server Connectivity and Key
async function checkAPIConnectivity() {
  try {
    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: 'test' })
    });
    
    if (res.ok) {
      apiActive = true;
      document.querySelector('.status-dot').className = 'status-dot online';
      apiStatusText.textContent = 'Gemini API Active';
    } else {
      // 400 (key missing) or 429 (quota) etc.
      const errData = await res.json().catch(() => ({}));
      apiActive = false;
      document.querySelector('.status-dot').className = 'status-dot offline';
      if (errData.code === 'QUOTA_EXCEEDED') {
        apiStatusText.textContent = 'API Quota Exceeded (Fallback)';
      } else {
        apiStatusText.textContent = 'Generative Fallback Active';
      }
    }
  } catch (err) {
    apiActive = false;
    document.querySelector('.status-dot').className = 'status-dot offline';
    apiStatusText.textContent = 'Generative Fallback Active';
  }
}

let DIRECT_GEMINI_KEY = "";
if (typeof localStorage !== 'undefined') {
  DIRECT_GEMINI_KEY = localStorage.getItem("venueiq_api_key") || "";
}

// Call backend API or make direct client-side fetch, fallback to local rules
async function generateResponse(prompt, systemInstruction = '') {
  // 1. Try backend API proxy first (if server is active)
  if (apiActive) {
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, systemInstruction })
      });
      if (response.ok) {
        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) return { text, source: "Gemini (Server Proxy)" };
      }
    } catch (e) {
      console.warn("Server API proxy failed, trying direct browser-to-Gemini connection...", e);
    }
  }

  // 2. Try direct client-side fetch to Google API using our free tier key
  try {
    const directUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${DIRECT_GEMINI_KEY}`;
    
    const geminiPayload = {
      contents: [{
        parts: [{ text: prompt }]
      }],
      generationConfig: {
        temperature: 0.4,
        maxOutputTokens: 1000
      }
    };

    if (systemInstruction) {
      geminiPayload.systemInstruction = {
        parts: [{ text: systemInstruction }]
      };
    }

    const response = await fetch(directUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(geminiPayload)
    });

    if (response.ok) {
      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) {
        return { text, source: "Gemini (Direct Client)" };
      }
    } else {
      console.warn(`Direct Gemini API failed with status ${response.status}`);
    }
  } catch (err) {
    console.warn("Direct browser-to-Gemini call failed:", err);
  }

  // 3. Fallback to offline local rules engine
  return { text: generateLocalFallback(prompt, systemInstruction), source: "Model Fallback Engine" };
}

// Local Generative Fallback Model
function generateLocalFallback(prompt, systemInstruction) {
  const activeVenueKey = (typeof venueSelect !== 'undefined' && venueSelect) ? venueSelect.value : 'ny';
  const venue = venueProfiles[activeVenueKey];
  const query = prompt.toLowerCase();
  
  // Detect requested language (avoiding \b boundaries next to unicode characters)
  let lang = "en";
  if (/\bspanish\b|español|\bcastellano\b|espanol/i.test(query)) lang = "es";
  else if (/\bfrench\b|français|francais/i.test(query)) lang = "fr";
  else if (/\bportuguese\b|português|portugues/i.test(query)) lang = "pt";
  else if (/\barabic\b|عربي/i.test(query)) lang = "ar";
  else if (/\bgerman|deutsch\b/i.test(query)) lang = "de";

  // Accessibility Intent (Supports EN, ES, FR, PT, AR, DE keywords)
  const accessibilityIntent = /\bstep-free|accessible|wheelchair|lift|elevator|ramp|escalera|sin escaleras|ascensor|ascenseur|sans marches|degraus|elevador|acessibilidade|المصاعد|aufzug|barrierefrei\b/i.test(query);
  // Quiet Room Intent
  const quietIntent = /\bquiet|sensory|calm|autism|overwhelmed|tranquilo|sensorial|calme|هدوء|حسية|ruhig|reizarm\b/i.test(query);
  // Transit Intent
  const transitIntent = /\btransit|train|rail|subway|shuttle|bus|taxi|walk|tren|ferrocarril|autobús|navette|metrô|ônibus|القطار|حافلة|bahn|zug\b/i.test(query);

  if (lang === "es") {
    let ans = `En el estadio ${venue.name}: `;
    if (accessibilityIntent) {
      ans += `tome la entrada familiar para evitar escaleras. El ascensor de accesibilidad está en la puerta del oeste. ${venue.accessPaths}`;
    } else if (quietIntent) {
      ans += `diríjase a la sala sensorial designada. ${venue.quietPaths}`;
    } else if (transitIntent) {
      ans += `el transporte recomendado es el enlace ferroviario ecológico. ${venue.transitInfo}`;
    } else {
      ans += `la ruta más despejada de acceso es por la plaza sur, que tiene menor congestión. Tiempo estimado: 9 minutos.`;
    }
    return ans;
  }

  if (lang === "fr") {
    let ans = `Au stade ${venue.name}: `;
    if (accessibilityIntent) {
      ans += `veuillez emprunter l'entrée familiale sans marches. L'ascenseur est disponible. ${venue.accessPaths}`;
    } else if (quietIntent) {
      ans += `rejoignez la zone sensorielle calme. ${venue.quietPaths}`;
    } else if (transitIntent) {
      ans += `nous recommandons le train à faible émission de carbone. ${venue.transitInfo}`;
    } else {
      ans += `l'accès le plus rapide se fait par la zone sud. Comptez 8 minutes.`;
    }
    return ans;
  }

  if (lang === "pt") {
    let ans = `No estádio ${venue.name}: `;
    if (accessibilityIntent) {
      ans += `use o acesso sem degraus na entrada familiar. Elevadores disponíveis. ${venue.accessPaths}`;
    } else if (quietIntent) {
      ans += `siga para o corredor de apoio sensorial. ${venue.quietPaths}`;
    } else if (transitIntent) {
      ans += `o metrô/trem rápido é o canal de menor emissão. ${venue.transitInfo}`;
    } else {
      ans += `o portão sul está fluindo melhor no momento.`;
    }
    return ans;
  }

  if (lang === "ar") {
    let ans = `في ملعب ${venue.name}: `;
    if (accessibilityIntent) {
      ans += `يرجى استخدام المدخل العائلي الخالي من الدرج. المصاعد متوفرة. ${venue.accessPaths}`;
    } else if (quietIntent) {
      ans += `توجه إلى الغرفة الحسية الهادئة. ${venue.quietPaths}`;
    } else {
      ans += `نوصي باستخدام قطار الأنفاق السريع لتقليل البصمة الكربونية. ${venue.transitInfo}`;
    }
    return ans;
  }

  if (lang === "de") {
    let ans = `Im Stadion ${venue.name}: `;
    if (accessibilityIntent) {
      ans += `nutzen Sie den barrierefreien Familieneingang. Aufzüge sind verfügbar. ${venue.accessPaths}`;
    } else if (quietIntent) {
      ans += `besuchen Sie den beruhigten sensorischen Raum. ${venue.quietPaths}`;
    } else {
      ans += `wir empfehlen die umweltfreundliche Bahnverbindung. ${venue.transitInfo}`;
    }
    return ans;
  }

  // English fallback responses
  let ans = `At ${venue.name}: `;
  if (accessibilityIntent) {
    ans += `take the dedicated family entry for step-free routes. ${venue.accessPaths}`;
  } else if (quietIntent) {
    ans += `go to the quiet sanctuary zone. ${venue.quietPaths}`;
  } else if (transitIntent) {
    ans += `low-carbon rail transit is recommended to bypass road blocks. ${venue.transitInfo}`;
  } else {
    ans += `the optimal path to your section is via the South Plaza. Crowd pressure is currently 39%.`;
  }
  return ans;
}

// Rendering Stadium Telemetry Scenario
function renderScenario() {
  const currentVenue = venueProfiles[venueSelect.value];
  
  if (currentIncident) {
    // Override scenario values with active incident state
    const override = incidentOverrides[currentIncident];
    crowdMetric.textContent = override.crowd;
    crowdProgress.style.width = override.crowdVal + '%';
    crowdDelta.textContent = `Incident: ${override.title}`;
    crowdDelta.style.color = "var(--accent-red)";
    
    accessMetric.textContent = override.access;
    accessProgress.style.width = override.accessVal + '%';
    accessProgress.className = override.accessVal < 80 ? 'progress-bar warning' : 'progress-bar success';
    
    staffMetric.textContent = override.staff;
    staffProgress.style.width = override.staffVal + '%';
    
    transitMetric.textContent = override.transit;
    transitProgress.style.width = override.transitVal + '%';
    transitProgress.className = override.transitVal > 80 ? 'progress-bar warning' : 'progress-bar info';
    
    riskPill.textContent = override.risk;
    riskPill.className = override.risk === 'High' ? 'status-pill high' : 'status-pill';

    briefList.innerHTML = override.brief.map(([title, body]) => `
      <article class="brief-item">
        <strong>${title}</strong>
        <p>${body}</p>
      </article>
    `).join("");

    dispatchList.innerHTML = override.dispatch.map(([title, body]) => `
      <li>
        <strong>${title}</strong>
        <p>${body}</p>
      </li>
    `).join("");

    // Update SVG map highlight colors based on incident zone
    updateMapHighlight(override.zone, override.risk === 'High' ? 'z-hot' : 'z-watch');
    
    // Suggest Nudge
    nudgeRecommendation.textContent = `Deploying transport redirection: Send alerts to section concourses nearest to ${override.zone} recommending alternative exits.`;

  } else {
    // Standard scenarios
    const scenario = scenarios[scenarioSelect.value];
    crowdMetric.textContent = scenario.crowd;
    crowdProgress.style.width = scenario.crowdVal + '%';
    crowdDelta.textContent = scenario.delta;
    crowdDelta.style.color = "var(--text-secondary)";
    
    accessMetric.textContent = scenario.access;
    accessProgress.style.width = scenario.accessVal + '%';
    accessProgress.className = 'progress-bar success';
    
    staffMetric.textContent = scenario.staff;
    staffProgress.style.width = scenario.staffVal + '%';
    
    transitMetric.textContent = scenario.transit;
    transitProgress.style.width = scenario.transitVal + '%';
    transitProgress.className = 'progress-bar info';
    
    riskPill.textContent = scenario.risk;
    riskPill.className = scenario.risk === 'High' ? 'status-pill high' : 'status-pill';

    briefList.innerHTML = scenario.brief.map(([title, body]) => `
      <article class="brief-item">
        <strong>${title}</strong>
        <p>${body}</p>
      </article>
    `).join("");

    dispatchList.innerHTML = scenario.dispatch.map(([title, body]) => `
      <li>
        <strong>${title}</strong>
        <p>${body}</p>
      </li>
    `).join("");

    // Highlight map elements
    resetMapColors();
    updateMapPercentages(scenarioSelect.value);
    
    // Nudge defaults
    if (scenarioSelect.value === 'pregame') {
      nudgeRecommendation.textContent = "Pregame Nudge: Advise fans arriving in sections 200-240 to take rail corridors. Offer a 10% discount on merchandise.";
    } else if (scenarioSelect.value === 'egress') {
      nudgeRecommendation.textContent = "Egress Nudge: Advise fans departing sections 100-150 to delay bridge crossing. Highlight shuttle boarding loops.";
    } else {
      nudgeRecommendation.textContent = "Sustainability Nudge: Advise pedestrian routes for nearby hotels. Promote walking paths with solar-powered checkpoints.";
    }
  }

  // Update sustainability mode share based on venue profile
  updateTransportBars(currentVenue.carbonFactors);
}

// Update transport modes split bars
function updateTransportBars(factors) {
  document.getElementById("bar-rail").style.setProperty('--value', factors.rail);
  document.getElementById("val-rail").textContent = `${factors.rail}%`;
  
  document.getElementById("bar-shuttle").style.setProperty('--value', factors.shuttle);
  document.getElementById("val-shuttle").textContent = `${factors.shuttle}%`;
  
  document.getElementById("bar-ride").style.setProperty('--value', factors.ride);
  document.getElementById("val-ride").textContent = `${factors.ride}%`;
  
  document.getElementById("bar-walk").style.setProperty('--value', factors.walk);
  document.getElementById("val-walk").textContent = `${factors.walk}%`;
}

// Update map crowd percentages dynamically
function updateMapPercentages(scenarioKey) {
  let offset = 0;
  if (scenarioKey === 'halftime') offset = 5;
  if (scenarioKey === 'weather') offset = -10;
  if (scenarioKey === 'egress') offset = -5;
  
  document.getElementById("pct-north").textContent = `${Math.min(100, Math.max(0, 82 + offset))}%`;
  document.getElementById("pct-bridge").textContent = `${Math.min(100, Math.max(0, 76 + offset))}%`;
  document.getElementById("pct-family").textContent = `${Math.min(100, Math.max(0, 45 + offset))}%`;
  document.getElementById("pct-east").textContent = `${Math.min(100, Math.max(0, 63 + offset))}%`;
  document.getElementById("pct-lift").textContent = `${Math.min(100, Math.max(0, 58 + offset))}%`;
  document.getElementById("pct-south").textContent = `${Math.min(100, Math.max(0, 39 + offset))}%`;
}

// Map helpers
function resetMapColors() {
  document.getElementById("zone-north").className.baseVal = "svg-zone z-hot";
  document.getElementById("zone-bridge").className.baseVal = "svg-zone z-hot";
  document.getElementById("zone-east").className.baseVal = "svg-zone z-watch";
  document.getElementById("zone-lift").className.baseVal = "svg-zone z-watch";
  document.getElementById("zone-family").className.baseVal = "svg-zone z-calm";
  document.getElementById("zone-south").className.baseVal = "svg-zone z-calm";
}

function updateMapHighlight(targetZoneName, accentClass) {
  resetMapColors();
  
  // Find which element matches the zone name
  const zones = document.querySelectorAll(".svg-zone");
  zones.forEach(z => {
    if (z.dataset.zone === targetZoneName) {
      z.className.baseVal = `svg-zone ${accentClass} is-selected-svg`;
    }
  });
}

// Render Audit Logs Table
function renderAuditLogs() {
  auditLogBody.innerHTML = auditLogs.map(log => `
    <tr>
      <td>${log.time}</td>
      <td><span class="audit-tag ${log.module === 'Operations' ? 'success' : 'info'}">${log.module}</span></td>
      <td>${log.input}</td>
      <td>${log.rec}</td>
      <td>${log.confidence}</td>
      <td>${log.approved}</td>
      <td>${log.outcome}</td>
    </tr>
  `).join("");
}

// Add an Entry to the Audit Log
function addAuditLog(module, input, recommendation, model, approved = 'Operator Approved', outcome = 'Optimized workflow execution') {
  const timestamp = `${new Date().toLocaleTimeString()} (Matchday)`;
  auditLogs.unshift({
    time: timestamp,
    module,
    input,
    rec: recommendation,
    confidence: `Grounded (${model})`,
    approved,
    outcome
  });
  renderAuditLogs();
}

// Speech Assistant Text-to-Speech Handler
function speakText(text, lang = 'en-US') {
  if ('speechSynthesis' in window) {
    // Stop any current voice output
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Choose voice language based on lang code
    utterance.lang = lang;
    
    // Tweak speech properties
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    
    window.speechSynthesis.speak(utterance);
  } else {
    alert("Speech Synthesis is not supported in your browser.");
  }
}

// Chat UI Message Adding
function addChatMessage(role, text, model = '') {
  const message = document.createElement("div");
  message.className = `message ${role}`;
  message.textContent = text;
  
  const meta = document.createElement("div");
  meta.className = "message-meta";
  
  const timestampSpan = document.createElement("span");
  timestampSpan.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + (model ? ` • ${model}` : '');
  meta.appendChild(timestampSpan);
  
  if (role === 'ai') {
    // Add Speech bubble button
    const speakBtn = document.createElement("button");
    speakBtn.className = "btn-speak";
    speakBtn.title = "Listen to answer";
    speakBtn.innerHTML = "🔊";
    
    // Deduce language from text content
    let lang = 'en-US';
    if (text.includes("En el estadio") || text.includes("usa la entrada")) lang = 'es-ES';
    else if (text.includes("Au stade") || text.includes("veuillez")) lang = 'fr-FR';
    else if (text.includes("No estádio")) lang = 'pt-BR';
    else if (text.includes("ملعب")) lang = 'ar-AE';
    else if (text.includes("Stadion")) lang = 'de-DE';
    
    speakBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      speakText(text, lang);
    });
    meta.appendChild(speakBtn);
  }
  
  message.appendChild(meta);
  chatWindow.appendChild(message);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

// Event Listeners Configuration
if (typeof document !== 'undefined') {
  // SVG map zone selection clicks & keyboard accessibility
  document.querySelectorAll(".svg-zone").forEach((zone) => {
    zone.addEventListener("click", () => {
      document.querySelectorAll(".svg-zone").forEach((z) => z.classList.remove("is-selected-svg"));
      zone.classList.add("is-selected-svg");
      
      const zoneName = zone.dataset.zone;
      zoneDetail.textContent = zoneGuidance[zoneName] || "AI guidance: current metrics in normal threshold. Maintain volunteer dispatch rates.";
      
      // Animate map route lines for visual wow factor
      const routeA = document.getElementById("flow-route-a");
      const routeB = document.getElementById("flow-route-b");
      
      if (zoneName === "Accessible lift bank") {
        routeA.style.display = "block";
        routeB.style.display = "none";
      } else if (zoneName === "Transit bridge") {
        routeA.style.display = "none";
        routeB.style.display = "block";
      } else {
        routeA.style.display = "none";
        routeB.style.display = "none";
      }

      addAuditLog("Operations", `Clicked map zone: ${zoneName}`, `Zone details inspected by operator.`, "User Event", "Manual View", "Telemetry checked");
    });

    // Keyboard support for WCAG accessibility (Enter or Space key)
    zone.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        zone.click();
      }
    });
  });

  // Dropdown triggers
  scenarioSelect.addEventListener("change", () => {
    currentScenario = scenarioSelect.value;
    currentIncident = null; // Clear incident when cycling scenarios
    incidentSelect.value = "";
    renderScenario();
    addAuditLog("Operations", `Scenario changed: ${currentScenario}`, `Scenario updated to ${scenarioSelect.options[scenarioSelect.selectedIndex].text}`, "System Context", "Auto-Approved", "Telemetry recalibrated");
  });

  venueSelect.addEventListener("change", () => {
    const selectedName = venueProfiles[venueSelect.value].name;
    renderScenario();
    addChatMessage("ai", `Venue context changed to ${selectedName}. Responses now use that stadium's active ops profile.`, "System Context");
    addAuditLog("Operations", `Venue profile changed: ${selectedName}`, `Context loaded.`, "System Context", "Auto-Approved", "SOP mapping updated");
  });

  incidentSelect.addEventListener("change", () => {
    const incidentVal = incidentSelect.value;
    if (incidentVal) {
      currentIncident = incidentVal;
      renderScenario();
      addAuditLog("Operations", `Incident Triggered: ${incidentOverrides[incidentVal].title}`, `Deploying emergency response briefs for ${incidentOverrides[incidentVal].zone}`, "Model Fallback Engine", "Pending Action Dispatch", "Brief generated");
    } else {
      currentIncident = null;
      renderScenario();
    }
  });

  // Simulate cycle scenario button
  document.getElementById("simulateBtn").addEventListener("click", () => {
    const options = Object.keys(scenarios);
    const currentIndex = options.indexOf(scenarioSelect.value);
    scenarioSelect.value = options[(currentIndex + 1) % options.length];
    currentScenario = scenarioSelect.value;
    currentIncident = null;
    incidentSelect.value = "";
    renderScenario();
    addAuditLog("Operations", `Scenario cycled manually`, `Updated to ${scenarioSelect.options[scenarioSelect.selectedIndex].text}`, "System Context", "Auto-Approved", "Telemetry updated");
  });

  // Chat Form submit
  document.getElementById("chatForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const question = fanQuestion.value.trim();
    if (!question) return;
    
    addChatMessage("fan", question);
    fanQuestion.value = "";
    
    // RAG contextual system instruction construction
    const activeVenue = venueProfiles[venueSelect.value];
    const activeScenarioText = scenarioSelect.options[scenarioSelect.selectedIndex].text;
    const incidentText = currentIncident ? incidentOverrides[currentIncident].title : 'None';
    
    const systemInstruction = `You are VenueIQ 2026, an operations copilot for the FIFA World Cup 2026. The user is a fan or volunteer.
Current Venue: ${activeVenue.name}
Venue Capacity: ${activeVenue.capacity}
Transit Info: ${activeVenue.transitInfo}
Accessible Paths: ${activeVenue.accessPaths}
Quiet Paths: ${activeVenue.quietPaths}
Matchday Scenario: ${activeScenarioText}
Active Incidents: ${incidentText}
Provide a helpful, concise answer based ONLY on the venue guidelines. Cite specific elevator banks or transit lines. If they ask in another language (Spanish, French, Portuguese, Arabic, German), respond in that language.`;

    // Fetch response
    const result = await generateResponse(question, systemInstruction);
    addChatMessage("ai", result.text, result.source);
    
    // Log request
    addAuditLog("Fan Assist", `Fan: "${question}"`, result.text, result.source, "Auto-Approved", "Query resolved");
  });

  // Quick prompt helper buttons
  document.querySelectorAll(".quick-prompt-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      fanQuestion.value = btn.dataset.query;
      document.getElementById("chatForm").dispatchEvent(new Event("submit"));
    });
  });

  // Approve & Dispatch actions button
  approveDispatchBtn.addEventListener("click", () => {
    const activeVenue = venueProfiles[venueSelect.value].name;
    const currentContext = currentIncident ? incidentOverrides[currentIncident].title : scenarioSelect.options[scenarioSelect.selectedIndex].text;
    
    alert(`DISPATCH ACTION SENT SUCCESSFULLY!\n\nNotifications pushed to wayfinding teams and stewards at ${activeVenue}.\nContext: ${currentContext}`);
    addAuditLog("Operations", `Push Broadcast Action`, `Dispatched steward task cards and SMS broadcasts for context: ${currentContext}`, "Operator Triggered", "Confirmed by Operator", "Notifications sent");
  });

  // Eco-nudge optimizer button
  optimizeNudgeBtn.addEventListener("click", () => {
    // Update transport split to reflect low-carbon choices (rail and shuttle rise)
    const currentFactors = venueProfiles[venueSelect.value].carbonFactors;
    const optimizedFactors = {
      rail: Math.min(100, currentFactors.rail + 12),
      shuttle: Math.min(100, currentFactors.shuttle + 6),
      ride: Math.max(0, currentFactors.ride - 14),
      walk: Math.max(0, currentFactors.walk - 4)
    };
    
    // Normalize factors to sum to 100
    const sum = optimizedFactors.rail + optimizedFactors.shuttle + optimizedFactors.ride + optimizedFactors.walk;
    if (sum !== 100) {
      const diff = 100 - sum;
      optimizedFactors.rail += diff;
    }
    
    updateTransportBars(optimizedFactors);
    
    // Update UI and add log
    ecoActiveNudges.textContent = parseInt(ecoActiveNudges.textContent) + 1;
    alert("LOW-CARBON NUDGE ACTIVATED!\n\nPushing transit-first and pedestrian incentives to non-mobility flagged fans. Mode share updated.");
    
    addAuditLog("Sustainability", "Eco-Nudge Optimizer Activated", "Pushed transit/merchandise discount codes to Sections 100-150 and 210-230.", "RAG Optimiser", "Operator Confirmed", "Mode share shifted: +12% Rail");
  });

  // Clear audit logs
  clearAuditBtn.addEventListener("click", () => {
    if (confirm("Are you sure you want to clear the operations audit log history?")) {
      auditLogs.length = 0;
      renderAuditLogs();
    }
  });
}

// Export for Node.js Unit Testing
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = {
    venueProfiles,
    scenarios,
    incidentOverrides,
    generateLocalFallback
  };
}

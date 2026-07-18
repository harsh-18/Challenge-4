const scenarios = {
  pregame: {
    crowd: "78%",
    delta: "Gate A rising in 12 min",
    access: "94%",
    staff: "6.8",
    transit: "18m",
    risk: "Elevated",
    brief: [
      ["Open relief gate N3", "Ticket scans predict a north plaza bottleneck before kickoff. Move four volunteers and bilingual signage to N3."],
      ["Protect accessible lift bank", "Keep lift queue below six minutes by holding one elevator for mobility requests until 20 minutes after anthem."],
      ["Send fan nudge", "Push rail-first arrival guidance in English, Spanish, and French to sections 210-235."]
    ],
    dispatch: [
      ["Zone lead A", "Move two volunteers from family entry to north gate for 18 minutes."],
      ["Transit liaison", "Ask rail operator to hold one extra trainset for post-anthem late arrivals."],
      ["Accessibility captain", "Confirm sensory room capacity and quiet route signage at section 214."]
    ]
  },
  halftime: {
    crowd: "84%",
    delta: "Concourse demand peaking",
    access: "91%",
    staff: "7.4",
    transit: "22m",
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
    delta: "Covered areas filling",
    access: "88%",
    staff: "8.1",
    transit: "31m",
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
    delta: "South plaza clearing slowly",
    access: "96%",
    staff: "5.9",
    transit: "14m",
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

const venueProfiles = {
  ny: "New York New Jersey Stadium",
  atl: "Atlanta Stadium",
  mx: "Mexico City Stadium",
  van: "BC Place Vancouver"
};

const zoneGuidance = {
  "North gate": "AI guidance: open relief gate N3, route families to west entry, and translate signage into Spanish and French for the next 15 minutes.",
  "Transit bridge": "AI guidance: switch to one-way bridge flow toward entry, position medical rover at midpoint, and hold ride-hail alerts until density drops.",
  "Family entry": "AI guidance: keep family entry open as a calm-route buffer and direct sensory-sensitive fans through this path.",
  "East concourse": "AI guidance: pause vendor restocking carts, separate concession and restroom queues, and send a steward script to section leads.",
  "Accessible lift bank": "AI guidance: reserve one lift for mobility requests, add a volunteer at the call button, and update step-free route ETAs in-app.",
  "South plaza": "AI guidance: maintain current staffing and use this area as the overflow exit if north pressure exceeds 85%."
};

const crowdMetric = document.getElementById("crowdMetric");
const crowdDelta = document.getElementById("crowdDelta");
const accessMetric = document.getElementById("accessMetric");
const staffMetric = document.getElementById("staffMetric");
const transitMetric = document.getElementById("transitMetric");
const riskPill = document.getElementById("riskPill");
const briefList = document.getElementById("briefList");
const dispatchList = document.getElementById("dispatchList");
const scenarioSelect = document.getElementById("scenarioSelect");
const venueSelect = document.getElementById("venueSelect");
const zoneDetail = document.getElementById("zoneDetail");
const chatWindow = document.getElementById("chatWindow");
const fanQuestion = document.getElementById("fanQuestion");

function renderScenario() {
  const scenario = scenarios[scenarioSelect.value];
  crowdMetric.textContent = scenario.crowd;
  crowdDelta.textContent = scenario.delta;
  accessMetric.textContent = scenario.access;
  staffMetric.textContent = scenario.staff;
  transitMetric.textContent = scenario.transit;
  riskPill.textContent = scenario.risk;

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
}

function addMessage(role, text) {
  const message = document.createElement("div");
  message.className = `message ${role}`;
  message.textContent = text;
  chatWindow.appendChild(message);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

function generateFanAnswer(question) {
  const venue = venueProfiles[venueSelect.value];
  const needsSpanish = /spanish|español/i.test(question);
  const needsQuiet = /quiet|sensory|calm/i.test(question);
  const needsAccessible = /step-free|accessible|wheelchair|lift/i.test(question);

  if (needsSpanish) {
    return `En ${venue}: usa la entrada familiar del oeste, sigue la ruta sin escalones por el ascensor C, y evita el puente norte durante 12 minutos. ${needsQuiet ? "La ruta tranquila pasa por el corredor de servicios junto a la sala sensorial." : ""}`;
  }

  if (needsAccessible || needsQuiet) {
    return `At ${venue}, take the west family entry, follow lift bank C, and avoid the north bridge for the next 12 minutes. A volunteer can meet you at the sensory room checkpoint.`;
  }

  return `At ${venue}, the fastest current route is through the south plaza, then east concourse. Expect about eight minutes to your section.`;
}

document.querySelectorAll(".map-zone").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".map-zone").forEach((zone) => zone.classList.remove("is-selected"));
    button.classList.add("is-selected");
    zoneDetail.textContent = zoneGuidance[button.dataset.zone];
  });
});

document.getElementById("simulateBtn").addEventListener("click", () => {
  const options = Object.keys(scenarios);
  const currentIndex = options.indexOf(scenarioSelect.value);
  scenarioSelect.value = options[(currentIndex + 1) % options.length];
  renderScenario();
});

scenarioSelect.addEventListener("change", renderScenario);
venueSelect.addEventListener("change", () => {
  addMessage("ai", `Venue context changed to ${venueProfiles[venueSelect.value]}. Responses now use that stadium's active ops profile.`);
});

document.getElementById("chatForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const question = fanQuestion.value.trim();
  if (!question) return;
  addMessage("fan", question);
  addMessage("ai", generateFanAnswer(question));
});

renderScenario();
addMessage("fan", fanQuestion.value);
addMessage("ai", generateFanAnswer(fanQuestion.value));

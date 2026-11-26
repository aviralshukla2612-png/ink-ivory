const fs = require('fs');
const path = require('path');

const fontsDir = path.resolve(__dirname, '../assets/fonts');
const outputPath = path.resolve(__dirname, '../components/templates/bundledDatePlannerHtml.js');

const gvBase64 = fs.readFileSync(path.join(fontsDir, 'GreatVibes-Regular.ttf')).toString('base64');
const cgRegBase64 = fs.readFileSync(path.join(fontsDir, 'CormorantGaramond-Regular.ttf')).toString('base64');
const cgBoldBase64 = fs.readFileSync(path.join(fontsDir, 'CormorantGaramond-Bold.ttf')).toString('base64');
const playfairBase64 = fs.readFileSync(path.join(fontsDir, 'PlayfairDisplay-Regular.ttf')).toString('base64');

const templateHtml = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, user-scalable=no">
<title>Our Perfect Date — Romance &amp; Itinerary Planner</title>
<style>
@font-face {
  font-family: 'Great Vibes';
  src: url('data:font/ttf;base64,${gvBase64}') format('truetype');
  font-weight: 400;
  font-style: normal;
}
@font-face {
  font-family: 'Cormorant Garamond';
  src: url('data:font/ttf;base64,${cgRegBase64}') format('truetype');
  font-weight: 400 500;
  font-style: normal;
}
@font-face {
  font-family: 'Cormorant Garamond';
  src: url('data:font/ttf;base64,${cgBoldBase64}') format('truetype');
  font-weight: 700;
  font-style: normal;
}
@font-face {
  font-family: 'Playfair Display';
  src: url('data:font/ttf;base64,${playfairBase64}') format('truetype');
  font-weight: 400 700;
  font-style: normal;
}

:root {
  --dp-rose: #B51F3B;
  --dp-maroon: #641D2B;
  --dp-cream: #FFF4F0;
  --dp-gold: #E5A93C;
  --dp-parchment: #FFFCF9;
  --dp-ink: #3D2328;
}

* { box-sizing: border-box; margin: 0; padding: 0; user-select: none; }
html, body {
  width: 100%; height: 100%; overflow-x: hidden;
  background: var(--dp-cream);
  font-family: 'Cormorant Garamond', Georgia, serif;
  color: var(--dp-ink);
}

/* 1. INTRO OPENING OVERLAY */
#introOverlay {
  position: fixed;
  inset: 0;
  z-index: 100;
  background: radial-gradient(circle at center, #FFF4F0 0%, #FBE7E3 65%, #F6D3D0 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px;
  transition: transform 1.2s cubic-bezier(0.77, 0, 0.175, 1);
}
#introOverlay.opened {
  transform: translateY(-110%);
  pointer-events: none;
}

.intro-card {
  width: 90%;
  max-width: 380px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(14px);
  border-radius: 30px;
  box-shadow: 0 20px 50px rgba(100, 29, 43, 0.12);
  border: 1px solid rgba(246, 211, 208, 0.8);
  padding: 38px 24px 30px;
  text-align: center;
}

.openPlannerBtn {
  background: linear-gradient(135deg, #B51F3B, #641D2B);
  color: #FFFFFF;
  font-family: 'Playfair Display', serif;
  font-weight: 700;
  font-size: 14px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  padding: 14px 32px;
  border-radius: 30px;
  border: none;
  box-shadow: 0 8px 24px rgba(181, 31, 59, 0.35);
  cursor: pointer;
  margin-top: 16px;
}

/* 2. MAIN ROMANTIC FLIP BOOK */
#plannerMain {
  min-height: 100vh;
  padding: 30px 18px 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.book-container {
  width: 100%;
  max-width: 440px;
  background: var(--dp-parchment);
  border-radius: 28px;
  border: 1px solid #EFE2CF;
  box-shadow: 0 16px 45px rgba(100, 29, 43, 0.1);
  padding: 28px 20px;
  position: relative;
}

.chapter-tabs {
  display: flex;
  gap: 6px;
  margin-bottom: 22px;
  justify-content: center;
}
.tab {
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-family: 'Playfair Display', serif;
  font-weight: 600;
  color: #8C4855;
  background: rgba(181, 31, 59, 0.08);
  cursor: pointer;
  transition: all 0.25s;
}
.tab.active {
  background: var(--dp-rose);
  color: #FFFFFF;
  box-shadow: 0 4px 12px rgba(181, 31, 59, 0.3);
}

.section-title {
  font-family: 'Playfair Display', serif;
  font-size: 22px;
  font-weight: 700;
  color: var(--dp-maroon);
  margin-bottom: 4px;
  text-align: center;
}
.section-sub {
  font-size: 13px;
  font-style: italic;
  color: #7A424E;
  margin-bottom: 18px;
  text-align: center;
}

/* CHOICE GRID */
.choice-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 20px;
}

.choice-card {
  background: #FFFFFF;
  border: 1.5px solid #F6D3D0;
  border-radius: 18px;
  padding: 16px 12px;
  text-align: center;
  cursor: pointer;
  transition: all 0.25s;
}
.choice-card.selected {
  border-color: var(--dp-rose);
  background: #FFF6F4;
  box-shadow: 0 6px 18px rgba(181, 31, 59, 0.18);
  transform: translateY(-2px);
}
.choice-icon { font-size: 26px; margin-bottom: 6px; }
.choice-title { font-weight: 700; font-size: 14px; color: var(--dp-maroon); }
.choice-desc { font-size: 11px; color: #8C4855; line-height: 1.3; margin-top: 2px; }

/* SUMMARY ITINERARY MODAL */
#summaryModal {
  position: fixed;
  inset: 0;
  z-index: 120;
  background: rgba(100, 29, 43, 0.82);
  backdrop-filter: blur(12px);
  display: none;
  align-items: center;
  justify-content: center;
  padding: 24px;
}
#summaryModal.active { display: flex; }

.summary-content {
  background: #FFFFFF;
  border-radius: 28px;
  padding: 32px 22px;
  max-width: 380px;
  width: 100%;
  text-align: center;
  box-shadow: 0 25px 60px rgba(0,0,0,0.4);
}
</style>

<script>
// BIDIRECTIONAL PROTOCOL STATE MACHINE
const PLANNER_STATE = {
  chapter: 1,
  timePeriod: 'evening',
  timeSlot: '6:30 PM – 8:30 PM',
  activities: ['dinner', 'cafe'],
  cuisines: ['italian'],
  recipientName: 'Riya',
  senderName: 'Aarav',
  date: 'Friday, 18 December 2026',
  venue: 'Candlelight Terrace'
};

(function() {
  function postToNative(type, payload) {
    if (window.ReactNativeWebView && typeof window.ReactNativeWebView.postMessage === 'function') {
      window.ReactNativeWebView.postMessage(JSON.stringify({ type: type, payload: payload, origin: 'date-planner-webview' }));
    }
  }
  window.__POST_TO_NATIVE__ = postToNative;

  window.addEventListener('DOMContentLoaded', function() {
    postToNative('TEMPLATE_READY', { templateId: 'date-planner', ready: true });
  });

  // RECEIVE NATIVE STATE (UNIDIRECTIONAL ACCEPTANCE)
  window.addEventListener('message', function(e) {
    if (e.data && e.data.type === 'INK_IVORY_CUSTOM_UPDATE') {
      const p = e.data.payload || {};
      if (p.names) {
        const parts = p.names.split('&').map(s => s.trim());
        PLANNER_STATE.recipientName = parts[0] || PLANNER_STATE.recipientName;
        PLANNER_STATE.senderName = parts[1] || PLANNER_STATE.senderName;
      }
      if (p.recipientName) PLANNER_STATE.recipientName = p.recipientName;
      if (p.senderName) PLANNER_STATE.senderName = p.senderName;
      if (p.date) PLANNER_STATE.date = p.date;
      if (p.venue) PLANNER_STATE.venue = p.venue;
      if (p.timePeriod) PLANNER_STATE.timePeriod = p.timePeriod;
      if (p.timeSlot) PLANNER_STATE.timeSlot = p.timeSlot;
      if (Array.isArray(p.activities)) PLANNER_STATE.activities = p.activities;
      if (Array.isArray(p.cuisines)) PLANNER_STATE.cuisines = p.cuisines;

      renderDOM();
      postToNative('INVITATION_UPDATED', { success: true, timestamp: Date.now() });
    }
  });

  window.addEventListener('error', function(err) {
    postToNative('RENDER_ERROR', { message: err.message, filename: err.filename, lineno: err.lineno });
  });
})();

function notifyNativeChoiceChange() {
  if (typeof window.__POST_TO_NATIVE__ === 'function') {
    window.__POST_TO_NATIVE__('DATE_PLANNER_CHOICE_CHANGED', {
      timePeriod: PLANNER_STATE.timePeriod,
      timeSlot: PLANNER_STATE.timeSlot,
      activities: PLANNER_STATE.activities,
      cuisines: PLANNER_STATE.cuisines,
      chapter: PLANNER_STATE.chapter
    });
  }
}
</script>
</head>
<body>
<!-- 1. INTRO OVERLAY -->
<div id="introOverlay">
  <div class="intro-card">
    <div style="font-size:38px; margin-bottom:12px;">🕯️ 🌹</div>
    <div class="eyebrow-tag" style="font-size:11px; letter-spacing:0.25em; text-transform:uppercase; color:var(--dp-rose);">Let's Plan</div>
    <div class="main-question" style="font-family:'Playfair Display'; font-size:28px; color:var(--dp-maroon); font-weight:700; margin:6px 0 10px;">Our Perfect Date ♡</div>
    <div style="font-family:'Great Vibes'; font-size:32px; color:var(--dp-rose); margin-bottom:12px;">For <span class="js-recipient">Riya</span></div>
    <p style="font-size:14px; font-style:italic; color:#641D2B; opacity:0.8; line-height:1.5;">
      Choose what you'd love most, and I'll tailor every detail for our unforgettable evening.
    </p>
    <button class="openPlannerBtn" onclick="openPlanner()">Start Planning ✨</button>
  </div>
</div>

<!-- 2. FLIP BOOK PLANNER -->
<div id="plannerMain">
  <div class="book-container">
    <div class="chapter-tabs">
      <div class="tab active" onclick="switchChapter(1)">1. Time</div>
      <div class="tab" onclick="switchChapter(2)">2. Activity</div>
      <div class="tab" onclick="switchChapter(3)">3. Cuisine</div>
    </div>

    <!-- CHAPTER 1: TIME PERIOD -->
    <div id="ch1" class="chapter-content">
      <div class="section-title">The Hour</div>
      <div class="section-sub">When should our adventure begin?</div>
      <div class="choice-grid">
        <div class="choice-card" onclick="selectPeriod('morning', '9:30 AM – 11:30 AM')">
          <div class="choice-icon">🌅</div>
          <div class="choice-title">Morning</div>
          <div class="choice-desc">Coffee & sunshine</div>
        </div>
        <div class="choice-card" onclick="selectPeriod('afternoon', '1:30 PM – 3:30 PM')">
          <div class="choice-icon">☀️</div>
          <div class="choice-title">Afternoon</div>
          <div class="choice-desc">Gelato & strolling</div>
        </div>
        <div class="choice-card selected" onclick="selectPeriod('evening', '6:30 PM – 8:30 PM')">
          <div class="choice-icon">🌇</div>
          <div class="choice-title">Evening</div>
          <div class="choice-desc">Sunset & cozy vibes</div>
        </div>
        <div class="choice-card" onclick="selectPeriod('night', '8:30 PM – 10:30 PM')">
          <div class="choice-icon">🌙</div>
          <div class="choice-title">Night</div>
          <div class="choice-desc">Candles & starry skies</div>
        </div>
      </div>
    </div>

    <!-- CHAPTER 2: ACTIVITIES -->
    <div id="ch2" class="chapter-content" style="display:none;">
      <div class="section-title">The Adventure</div>
      <div class="section-sub">What shall we experience together?</div>
      <div class="choice-grid">
        <div class="choice-card selected" onclick="toggleActivity('dinner')">
          <div class="choice-icon">🍽️</div>
          <div class="choice-title">Dine Out</div>
          <div class="choice-desc">Romantic dinner</div>
        </div>
        <div class="choice-card selected" onclick="toggleActivity('cafe')">
          <div class="choice-icon">☕</div>
          <div class="choice-title">Artisan Cafe</div>
          <div class="choice-desc">Warm lattes & sweets</div>
        </div>
        <div class="choice-card" onclick="toggleActivity('movie')">
          <div class="choice-icon">🎬</div>
          <div class="choice-title">Movie & Rooftop</div>
          <div class="choice-desc">Popcorn & blankets</div>
        </div>
        <div class="choice-card" onclick="toggleActivity('walk')">
          <div class="choice-icon">🌿</div>
          <div class="choice-title">Garden Walk</div>
          <div class="choice-desc">Peaceful hand in hand</div>
        </div>
      </div>
    </div>

    <!-- CHAPTER 3: CUISINE -->
    <div id="ch3" class="chapter-content" style="display:none;">
      <div class="section-title">The Flavor</div>
      <div class="section-sub">Flavors you are craving most</div>
      <div class="choice-grid">
        <div class="choice-card selected" onclick="toggleCuisine('italian')">
          <div class="choice-icon">🍝</div>
          <div class="choice-title">Italian</div>
          <div class="choice-desc">Fresh pasta & wine</div>
        </div>
        <div class="choice-card" onclick="toggleCuisine('japanese')">
          <div class="choice-icon">🍣</div>
          <div class="choice-title">Japanese</div>
          <div class="choice-desc">Sushi & ramen</div>
        </div>
        <div class="choice-card" onclick="toggleCuisine('french')">
          <div class="choice-icon">🥐</div>
          <div class="choice-title">French Bistro</div>
          <div class="choice-desc">Pastries & fondue</div>
        </div>
        <div class="choice-card" onclick="toggleCuisine('indian')">
          <div class="choice-icon">🍛</div>
          <div class="choice-title">Royal Indian</div>
          <div class="choice-desc">Rich culinary spices</div>
        </div>
      </div>
      <button class="openPlannerBtn" style="width:100%; margin-top:10px;" onclick="showSummary()">Review Itinerary ✨</button>
    </div>
  </div>
</div>

<!-- 3. ITINERARY SUMMARY MODAL -->
<div id="summaryModal">
  <div class="summary-content">
    <div style="font-size:42px; margin-bottom:10px;">💌 ✨</div>
    <h2 style="font-family:'Playfair Display'; font-size:24px; color:var(--dp-maroon);">Our Date Itinerary</h2>
    <div id="summaryDetails" style="font-size:14px; color:#4A1A24; margin:16px 0; text-align:left; line-height:1.7;">
      <!-- Populated via JS -->
    </div>
    <button class="openPlannerBtn" onclick="closeSummary()">Confirm Itinerary ♡</button>
  </div>
</div>

<script>
function openPlanner() {
  document.getElementById('introOverlay').classList.add('opened');
}

function switchChapter(idx) {
  PLANNER_STATE.chapter = idx;
  document.querySelectorAll('.tab').forEach((t, i) => t.classList.toggle('active', i === idx - 1));
  document.getElementById('ch1').style.display = idx === 1 ? 'block' : 'none';
  document.getElementById('ch2').style.display = idx === 2 ? 'block' : 'none';
  document.getElementById('ch3').style.display = idx === 3 ? 'block' : 'none';
  notifyNativeChoiceChange();
}

function selectPeriod(p, slot) {
  PLANNER_STATE.timePeriod = p;
  PLANNER_STATE.timeSlot = slot;
  switchChapter(2);
}

function toggleActivity(act) {
  const i = PLANNER_STATE.activities.indexOf(act);
  if (i > -1) PLANNER_STATE.activities.splice(i, 1);
  else PLANNER_STATE.activities.push(act);
  renderDOM();
  notifyNativeChoiceChange();
}

function toggleCuisine(cui) {
  const i = PLANNER_STATE.cuisines.indexOf(cui);
  if (i > -1) PLANNER_STATE.cuisines.splice(i, 1);
  else PLANNER_STATE.cuisines.push(cui);
  renderDOM();
  notifyNativeChoiceChange();
}

function showSummary() {
  const details = document.getElementById('summaryDetails');
  details.innerHTML = '<div>📅 <b>Date:</b> ' + PLANNER_STATE.date + '</div>' +
                    '<div>⏰ <b>Time:</b> ' + PLANNER_STATE.timeSlot + ' (' + PLANNER_STATE.timePeriod + ')</div>' +
                    '<div>✨ <b>Activities:</b> ' + PLANNER_STATE.activities.join(', ') + '</div>' +
                    '<div>🍝 <b>Cuisine:</b> ' + PLANNER_STATE.cuisines.join(', ') + '</div>' +
                    '<div>📍 <b>Venue:</b> ' + PLANNER_STATE.venue + '</div>';
  document.getElementById('summaryModal').classList.add('active');
}

function closeSummary() {
  document.getElementById('summaryModal').classList.remove('active');
}

function renderDOM() {
  document.querySelectorAll('.js-recipient').forEach(el => el.textContent = PLANNER_STATE.recipientName);
}
</script>
</body>
</html>`;

const jsExport = 'export const TEMPLATE_DATE_PLANNER_BUNDLED_HTML = ' + JSON.stringify(templateHtml) + ';\n';
fs.writeFileSync(outputPath, jsExport);
console.log('Successfully bundled Date Planner HTML module. Size:', jsExport.length);

const fs = require('fs');
const path = require('path');

const fontsDir = path.resolve(__dirname, '../assets/fonts');
const assetsDir = path.resolve(__dirname, '../assets/template01');
const outputPath = path.resolve(__dirname, '../components/templates/bundledTemplate01Html.js');

const cinzel = fs.readFileSync(path.join(fontsDir, 'CinzelDecorative-Bold.ttf')).toString('base64');
const cgReg = fs.readFileSync(path.join(fontsDir, 'CormorantGaramond-Regular.ttf')).toString('base64');
const cgBold = fs.readFileSync(path.join(fontsDir, 'CormorantGaramond-Bold.ttf')).toString('base64');

const sGate = fs.readFileSync(path.join(assetsDir, '02_grand_entrance_closed_gate.png')).toString('base64');
const sWelcome = fs.readFileSync(path.join(assetsDir, '04_welcome_intro.png')).toString('base64');
const sDate = fs.readFileSync(path.join(assetsDir, '06_save_the_date.png')).toString('base64');
const sEvents = fs.readFileSync(path.join(assetsDir, '07_wedding_events_overview.png')).toString('base64');
const sFamily = fs.readFileSync(path.join(assetsDir, '13_family_blessings.png')).toString('base64');
const sVenue = fs.readFileSync(path.join(assetsDir, '14_venue_location.png')).toString('base64');
const sClosing = fs.readFileSync(path.join(assetsDir, '15_closing_thank_you.png')).toString('base64');

const templateHtml = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, user-scalable=no">
<title>Aarav &amp; Riya — Royal Navy Palace Wedding</title>
<style>
@font-face {
  font-family: 'Cinzel Decorative';
  src: url('data:font/ttf;base64,${cinzel}') format('truetype');
  font-weight: 700;
  font-style: normal;
}
@font-face {
  font-family: 'Cormorant Garamond';
  src: url('data:font/ttf;base64,${cgReg}') format('truetype');
  font-weight: 400 500;
  font-style: normal;
}
@font-face {
  font-family: 'Cormorant Garamond';
  src: url('data:font/ttf;base64,${cgBold}') format('truetype');
  font-weight: 600 700;
  font-style: normal;
}

:root {
  --navy: #0F1E36;
  --navy-dark: #0A1424;
  --gold: #D7B875;
  --gold-light: #F4E4BC;
  --cream: #FAF6EE;
  --wine: #6B1D2F;
}

* { box-sizing: border-box; margin: 0; padding: 0; user-select: none; }
html, body {
  width: 100%; height: 100%; overflow: hidden;
  background: var(--navy-dark);
  font-family: 'Cormorant Garamond', Georgia, serif;
  color: var(--cream);
}

#viewport {
  position: relative;
  width: 100vw;
  height: 100vh;
  max-width: 480px;
  margin: 0 auto;
  overflow: hidden;
  background: radial-gradient(circle at 50% 30%, #172B4D 0%, #0F1E36 60%, #08111E 100%);
  display: flex;
  flex-direction: column;
}

/* 3D GATE OVERLAY */
#gateOverlay {
  position: absolute;
  inset: 0;
  z-index: 50;
  background: #0F1E36 url('data:image/png;base64,${sGate}') center/cover no-repeat;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  padding-bottom: 54px;
  transition: transform 1.2s cubic-bezier(0.77, 0, 0.175, 1), opacity 0.8s ease;
}
#gateOverlay.opened {
  transform: translateY(-105%);
  pointer-events: none;
}

.openGateBtn {
  background: linear-gradient(135deg, #ECC880 0%, #D4A745 100%);
  color: #0F1E36;
  font-family: 'Cinzel Decorative', serif;
  font-weight: 700;
  font-size: 15px;
  letter-spacing: 0.1em;
  padding: 14px 28px;
  border-radius: 30px;
  border: 1px solid #FFF3D6;
  box-shadow: 0 6px 20px rgba(215, 184, 117, 0.45);
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}
.openGateBtn:active { transform: scale(0.96); }

/* SLIDE DECK (HORIZONTAL SWIPE) */
#deck {
  flex: 1;
  display: flex;
  transition: transform 0.5s cubic-bezier(0.25, 1, 0.5, 1);
  will-change: transform;
}

.slide {
  flex: 0 0 100%;
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 30px 24px 70px;
  text-align: center;
  background-size: cover;
  background-position: center;
}

/* SLIDE ARTWORK BACKGROUNDS */
.slide[data-index="0"] { background-image: url('data:image/png;base64,${sWelcome}'); }
.slide[data-index="1"] { background-image: url('data:image/png;base64,${sDate}'); }
.slide[data-index="2"] { background-image: url('data:image/png;base64,${sEvents}'); }
.slide[data-index="3"] { background-image: url('data:image/png;base64,${sFamily}'); }
.slide[data-index="4"] { background-image: url('data:image/png;base64,${sVenue}'); }
.slide[data-index="5"] { background-image: url('data:image/png;base64,${sClosing}'); }

.slide-content-overlay {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at center, rgba(15, 30, 54, 0.2) 0%, rgba(10, 20, 36, 0.65) 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.arch-card {
  width: 90%;
  max-width: 380px;
  border: 1.5px solid rgba(215, 184, 117, 0.4);
  border-radius: 120px 120px 16px 16px;
  background: rgba(15, 30, 54, 0.75);
  backdrop-filter: blur(12px);
  padding: 36px 20px 24px;
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.6), inset 0 0 0 1px rgba(255, 255, 255, 0.08);
}

.title-couple {
  font-family: 'Cinzel Decorative', serif;
  font-size: 26px;
  font-weight: 700;
  color: var(--gold-light);
  letter-spacing: 0.08em;
  margin: 12px 0 6px;
  text-shadow: 0 2px 10px rgba(215, 184, 117, 0.3);
}

.title-sub {
  font-size: 13px;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: var(--gold);
  margin-bottom: 8px;
}

.date-badge {
  display: inline-block;
  padding: 6px 16px;
  border-radius: 20px;
  background: rgba(215, 184, 117, 0.12);
  border: 1px solid rgba(215, 184, 117, 0.35);
  font-size: 14px;
  color: var(--gold-light);
  margin-top: 14px;
}

.venue-text {
  font-size: 14px;
  color: #D6DCE5;
  margin-top: 12px;
  line-height: 1.5;
}

/* BOTTOM NAVIGATION PILLS & ARROWS */
.nav-controls {
  position: absolute;
  bottom: 16px;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  z-index: 20;
}

.nav-dots {
  display: flex;
  gap: 6px;
}
.dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: rgba(215, 184, 117, 0.3);
  transition: all 0.3s;
}
.dot.active {
  width: 22px;
  border-radius: 5px;
  background: var(--gold);
  box-shadow: 0 0 8px var(--gold);
}

.arrow-btn {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: rgba(15, 30, 54, 0.7);
  border: 1px solid rgba(215, 184, 117, 0.35);
  color: var(--gold-light);
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.2s;
}
.arrow-btn:active { transform: scale(0.92); }
</style>

<script>
(function() {
  function postToNative(type, payload) {
    if (window.ReactNativeWebView && typeof window.ReactNativeWebView.postMessage === 'function') {
      window.ReactNativeWebView.postMessage(JSON.stringify({ type: type, payload: payload }));
    }
  }
  window.__POST_TO_NATIVE__ = postToNative;

  window.addEventListener('DOMContentLoaded', function() {
    postToNative('TEMPLATE_READY', { templateId: 'tpl-wedding-navy-01', ready: true });
  });

  window.addEventListener('message', function(e) {
    if (e.data && e.data.type === 'INK_IVORY_CUSTOM_UPDATE') {
      const p = e.data.payload || {};
      if (p.names) {
        document.querySelectorAll('.js-couple-names').forEach(el => el.textContent = p.names);
      }
      if (p.date || p.weddingDate) {
        document.querySelectorAll('.js-wedding-date').forEach(el => el.textContent = p.date || p.weddingDate);
      }
      if (p.venue || p.venueName) {
        document.querySelectorAll('.js-wedding-venue').forEach(el => el.textContent = p.venue || p.venueName);
      }
      postToNative('INVITATION_UPDATED', { success: true, timestamp: Date.now() });
    }
  });

  window.addEventListener('error', function(err) {
    postToNative('RENDER_ERROR', { message: err.message, filename: err.filename, lineno: err.lineno });
  });
})();
</script>
</head>
<body>
<div id="viewport">
  <!-- 3D GRAND ENTRANCE GATE -->
  <div id="gateOverlay">
    <div style="font-family:'Cinzel Decorative'; font-size:22px; color:#F4E4BC; margin-bottom:12px; letter-spacing:0.12em; text-shadow:0 2px 10px rgba(0,0,0,0.8);">
      ROYAL WEDDING INVITATION
    </div>
    <div style="font-size:14px; color:#D7B875; letter-spacing:0.2em; text-transform:uppercase; margin-bottom:28px;">
      THE PALACE CELEBRATION
    </div>
    <button class="openGateBtn" onclick="openGate()">OPEN INVITATION ✨</button>
  </div>

  <!-- 6-SLIDE HORIZONTAL DECK -->
  <div id="deck">
    <!-- SLIDE 1: WELCOME INTRO -->
    <div class="slide" data-index="0">
      <div class="slide-content-overlay">
        <div class="arch-card">
          <div class="title-sub">Shubh Vivah</div>
          <div style="font-size:12px; letter-spacing:0.18em; text-transform:uppercase; color:#C4D0E0;">Together With Their Families</div>
          <div class="title-couple js-couple-names">Aarav &amp; Riya</div>
          <div class="date-badge js-wedding-date">Friday, 18 December 2026</div>
          <div class="venue-text js-wedding-venue">The Heritage Palace &amp; Gardens<br>Jaipur, Rajasthan</div>
        </div>
      </div>
    </div>

    <!-- SLIDE 2: SAVE THE DATE -->
    <div class="slide" data-index="1">
      <div class="slide-content-overlay">
        <div class="arch-card">
          <div class="title-sub">Eternal Union</div>
          <div style="font-size:13px; color:#E2E8F0; margin:10px 0;">Request the honour of your presence at the wedding ceremony of</div>
          <div class="title-couple js-couple-names">Aarav &amp; Riya</div>
          <div class="date-badge js-wedding-date">Friday, 18 December 2026</div>
          <div class="venue-text">Auspicious Muhurtham: 5:00 PM Onwards</div>
        </div>
      </div>
    </div>

    <!-- SLIDE 3: EVENTS OVERVIEW -->
    <div class="slide" data-index="2">
      <div class="slide-content-overlay">
        <div class="arch-card">
          <div class="title-sub">Ceremonies</div>
          <div style="font-size:18px; font-weight:700; color:#F4E4BC; margin:6px 0;">Celebration Itinerary</div>
          <div style="text-align:left; font-size:13px; color:#D6DCE5; margin-top:14px; line-height:1.7;">
            <div>🌾 <b>Haldi Ceremony:</b> 10:00 AM</div>
            <div>🌿 <b>Mehendi Ki Shaam:</b> 4:00 PM</div>
            <div>✨ <b>Sangeet Night:</b> 8:00 PM</div>
            <div>👑 <b>The Royal Vivah:</b> 5:00 PM (Next Day)</div>
          </div>
        </div>
      </div>
    </div>

    <!-- SLIDE 4: FAMILY BLESSINGS -->
    <div class="slide" data-index="3">
      <div class="slide-content-overlay">
        <div class="arch-card">
          <div class="title-sub">Auspicious Blessings</div>
          <div style="font-size:15px; font-style:italic; color:#F4E4BC; margin:10px 0; line-height:1.6;">
            “Two souls with but a single thought, two hearts that beat as one.”
          </div>
          <div style="font-size:13px; color:#C4D0E0; margin-top:10px;">
            Best Compliments from<br>
            <b style="color:#FAF6EE;">Singhania &amp; Kapoor Families</b>
          </div>
        </div>
      </div>
    </div>

    <!-- SLIDE 5: VENUE LOCATION -->
    <div class="slide" data-index="4">
      <div class="slide-content-overlay">
        <div class="arch-card">
          <div class="title-sub">Destination</div>
          <div style="font-size:18px; font-weight:700; color:#F4E4BC; margin:6px 0;">The Venue</div>
          <div class="venue-text js-wedding-venue" style="font-size:15px;">The Heritage Palace &amp; Gardens</div>
          <div style="font-size:13px; color:#A0AEC0; margin-top:6px;">Amer Road, Jaipur, Rajasthan</div>
        </div>
      </div>
    </div>

    <!-- SLIDE 6: CLOSING BLESSINGS -->
    <div class="slide" data-index="5">
      <div class="slide-content-overlay">
        <div class="arch-card">
          <div class="title-sub">With Warm Hearts</div>
          <div class="title-couple js-couple-names">Aarav &amp; Riya</div>
          <div style="font-size:14px; color:#E2E8F0; margin:14px 0 18px; line-height:1.6;">
            We eagerly look forward to celebrating this eternal union in your blessed presence.
          </div>
          <div class="date-badge">Joyfully Awaiting You</div>
        </div>
      </div>
    </div>
  </div>

  <!-- NAVIGATION CONTROLS -->
  <div class="nav-controls">
    <button class="arrow-btn" onclick="prevSlide()">‹</button>
    <div class="nav-dots" id="dots">
      <div class="dot active"></div>
      <div class="dot"></div>
      <div class="dot"></div>
      <div class="dot"></div>
      <div class="dot"></div>
      <div class="dot"></div>
    </div>
    <button class="arrow-btn" onclick="nextSlide()">›</button>
  </div>
</div>

<script>
let curSlide = 0;
const totalSlides = 6;
const deck = document.getElementById('deck');
const dots = document.querySelectorAll('.dot');
const gate = document.getElementById('gateOverlay');

function openGate() {
  gate.classList.add('opened');
}

function updateDeck() {
  deck.style.transform = 'translateX(-' + (curSlide * 100) + '%)';
  dots.forEach((d, i) => {
    d.classList.toggle('active', i === curSlide);
  });
}

function nextSlide() {
  if (curSlide < totalSlides - 1) {
    curSlide++;
    updateDeck();
  }
}

function prevSlide() {
  if (curSlide > 0) {
    curSlide--;
    updateDeck();
  }
}

// Touch swipe gestures
let touchStartX = 0;
let touchEndX = 0;
deck.addEventListener('touchstart', e => {
  touchStartX = e.changedTouches[0].screenX;
}, { passive: true });
deck.addEventListener('touchend', e => {
  touchEndX = e.changedTouches[0].screenX;
  if (touchStartX - touchEndX > 45) nextSlide();
  if (touchEndX - touchStartX > 45) prevSlide();
}, { passive: true });
</script>
</body>
</html>`;

const jsExport = 'export const TEMPLATE_01_BUNDLED_HTML = ' + JSON.stringify(templateHtml) + ';\n';
fs.writeFileSync(outputPath, jsExport);
console.log('Successfully bundled Template 01 HTML module. Size:', jsExport.length);

const fs = require('fs');
const path = require('path');

const fontsDir = path.resolve(__dirname, '../assets/fonts');
const outputPath = path.resolve(__dirname, '../components/templates/bundledValentineHtml.js');

const gvBase64 = fs.readFileSync(path.join(fontsDir, 'GreatVibes-Regular.ttf')).toString('base64');
const cgRegBase64 = fs.readFileSync(path.join(fontsDir, 'CormorantGaramond-Regular.ttf')).toString('base64');
const cgBoldBase64 = fs.readFileSync(path.join(fontsDir, 'CormorantGaramond-Bold.ttf')).toString('base64');
const playfairBase64 = fs.readFileSync(path.join(fontsDir, 'PlayfairDisplay-Regular.ttf')).toString('base64');

let bgvData = '';
const bgvPath = path.resolve(__dirname, '../../public/bgv.png');
if (fs.existsSync(bgvPath)) {
  bgvData = 'data:image/png;base64,' + fs.readFileSync(bgvPath).toString('base64');
}

const templateHtml = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, user-scalable=no">
<title>Sealed Love Letter — Valentine Celebration</title>
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
  --rose-deep: #B51F3B;
  --rose-dark: #641D2B;
  --rose-soft: #F6D3D0;
  --blush-bg: #FFF4F0;
  --parchment: #FFFDF9;
  --gold-accent: #E5A93C;
}

* { box-sizing: border-box; margin: 0; padding: 0; user-select: none; }
html, body {
  width: 100%; height: 100%; overflow-x: hidden;
  background: var(--blush-bg);
  font-family: 'Cormorant Garamond', Georgia, serif;
  color: var(--rose-dark);
}

/* 3D ENVELOPE OPENING OVERLAY */
#envelopeOverlay {
  position: fixed;
  inset: 0;
  z-index: 100;
  background: radial-gradient(circle at center, #FFF4F0 0%, #FBE7E3 60%, #F6D3D0 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px;
  transition: transform 1.2s cubic-bezier(0.77, 0, 0.175, 1), opacity 0.8s ease;
}
#envelopeOverlay.opened {
  transform: translateY(-110%);
  pointer-events: none;
}

.envelope-card {
  width: 90%;
  max-width: 380px;
  background: #FFFFFF;
  border-radius: 28px;
  box-shadow: 0 20px 45px rgba(181, 31, 59, 0.18), 0 2px 10px rgba(0,0,0,0.04);
  border: 1px solid rgba(246, 211, 208, 0.7);
  padding: 40px 24px 32px;
  text-align: center;
  position: relative;
}

.heart-badge {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--rose-deep), var(--rose-dark));
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  color: #FFFFFF;
  margin-bottom: 18px;
  box-shadow: 0 10px 25px rgba(181, 31, 59, 0.35);
  animation: pulseHeart 2s infinite ease-in-out;
}
@keyframes pulseHeart {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.08); }
}

.cursive-recipient {
  font-family: 'Great Vibes', cursive;
  font-size: 38px;
  color: var(--rose-deep);
  margin-bottom: 6px;
}

.eyebrow-tag {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: rgba(100, 29, 43, 0.7);
  margin-bottom: 14px;
}

.main-question {
  font-family: 'Playfair Display', serif;
  font-size: 26px;
  font-weight: 700;
  line-height: 1.25;
  color: var(--rose-dark);
  margin-bottom: 16px;
}

.openLetterBtn {
  background: linear-gradient(135deg, #B51F3B 0%, #C42A45 50%, #641D2B 100%);
  color: #FFFFFF;
  font-family: 'Playfair Display', serif;
  font-weight: 700;
  font-size: 14px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  padding: 14px 32px;
  border-radius: 30px;
  border: none;
  box-shadow: 0 8px 24px rgba(181, 31, 59, 0.4);
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  margin-top: 10px;
}
.openLetterBtn:active { transform: scale(0.96); }

/* MAIN ROMANTIC PROPOSAL VIEW */
#proposalMain {
  min-height: 100vh;
  padding: 36px 20px 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-image: linear-gradient(rgba(255, 244, 240, 0.8), rgba(251, 231, 227, 0.88)), url('${bgvData}');
  background-size: cover;
  background-position: center;
}

.proposal-card {
  width: 100%;
  max-width: 440px;
  background: rgba(255, 255, 255, 0.88);
  backdrop-filter: blur(16px);
  border-radius: 32px;
  border: 1px solid rgba(255, 255, 255, 0.9);
  box-shadow: 0 20px 50px rgba(100, 29, 43, 0.12);
  padding: 36px 24px;
  text-align: center;
  margin-bottom: 24px;
}

.btn-container {
  display: flex;
  gap: 16px;
  justify-content: center;
  align-items: center;
  margin-top: 26px;
  position: relative;
  min-height: 60px;
}

.btn-yes {
  background: linear-gradient(135deg, #B51F3B, #E93B58);
  color: #FFFFFF;
  font-family: 'Playfair Display', serif;
  font-size: 16px;
  font-weight: 700;
  padding: 14px 34px;
  border-radius: 30px;
  border: none;
  box-shadow: 0 8px 22px rgba(181, 31, 59, 0.35);
  cursor: pointer;
  transition: transform 0.2s;
}
.btn-yes:active { transform: scale(0.95); }

.btn-no {
  background: #FFFDF9;
  color: #8C4855;
  font-family: 'Playfair Display', serif;
  font-size: 14px;
  font-weight: 600;
  padding: 12px 24px;
  border-radius: 30px;
  border: 1px solid #F6D3D0;
  cursor: pointer;
  transition: all 0.3s ease;
}

/* PARCHMENT LOVE LETTER */
.letter-parchment {
  width: 100%;
  max-width: 440px;
  background: var(--parchment);
  border: 1px solid #EFE2CF;
  border-radius: 20px;
  padding: 30px 22px;
  box-shadow: 0 10px 30px rgba(100, 29, 43, 0.08);
  text-align: left;
  line-height: 1.7;
  font-size: 16px;
  color: #4B3035;
  position: relative;
}

.letter-parchment::before {
  content: "";
  position: absolute;
  top: 10px; bottom: 10px; left: 10px; right: 10px;
  border: 1px solid rgba(229, 169, 60, 0.3);
  pointer-events: none;
  border-radius: 14px;
}

/* CELEBRATION MODAL (HEART EXPLOSION) */
#celebrationModal {
  position: fixed;
  inset: 0;
  z-index: 120;
  background: rgba(100, 29, 43, 0.85);
  backdrop-filter: blur(12px);
  display: none;
  align-items: center;
  justify-content: center;
  padding: 24px;
}
#celebrationModal.active { display: flex; }

.modal-content {
  background: #FFFFFF;
  border-radius: 28px;
  padding: 36px 24px;
  text-align: center;
  max-width: 380px;
  width: 100%;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.4);
}

.floating-heart {
  position: fixed;
  pointer-events: none;
  z-index: 130;
  animation: floatUp 2.4s ease-out forwards;
}
@keyframes floatUp {
  0% { transform: translateY(0) scale(0.6) rotate(0deg); opacity: 1; }
  100% { transform: translateY(-120vh) scale(1.4) rotate(45deg); opacity: 0; }
}
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
    postToNative('TEMPLATE_READY', { templateId: 'valentine', ready: true });
  });

  window.addEventListener('message', function(e) {
    if (e.data && e.data.type === 'INK_IVORY_CUSTOM_UPDATE') {
      const p = e.data.payload || {};
      if (p.recipientName || p.names) {
        const name = p.recipientName || p.names.split('&')[0].trim();
        document.querySelectorAll('.js-recipient').forEach(el => el.textContent = name);
      }
      if (p.senderName) {
        document.querySelectorAll('.js-sender').forEach(el => el.textContent = p.senderName);
      }
      if (p.letterMessage || p.message) {
        const msg = p.letterMessage || p.message;
        const msgEl = document.querySelector('.js-letter-body');
        if (msgEl) msgEl.textContent = msg;
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
<!-- 1. ENVELOPE OPENING OVERLAY -->
<div id="envelopeOverlay">
  <div class="envelope-card">
    <div class="heart-badge">💌</div>
    <div class="cursive-recipient js-recipient">Riya</div>
    <div class="eyebrow-tag">A Sealed Romantic Proposal</div>
    <div class="main-question">Someone has a very special question for you...</div>
    <p style="font-size:14px; font-style:italic; color:#641D2B; opacity:0.8; margin-bottom:20px;">
      A digital love letter waiting to be opened with all the tenderness in the world.
    </p>
    <button class="openLetterBtn" onclick="openLetter()">Open My Love Letter ✨</button>
  </div>
</div>

<!-- 2. MAIN PROPOSAL HERO -->
<div id="proposalMain">
  <div class="proposal-card">
    <div style="font-size:36px; margin-bottom:10px;">💖</div>
    <div class="eyebrow-tag">Will You Be Mine?</div>
    <h1 class="main-question" style="font-size:32px;">Will You Be My Valentine?</h1>
    <div class="cursive-recipient js-recipient" style="font-size:30px; margin-top:4px;">For Riya, with all my heart</div>
    
    <div class="btn-container">
      <button class="btn-yes" onclick="celebrateYes()">YES! 💍</button>
      <button class="btn-no" id="noBtn" onmouseover="dodgeNo()" onclick="dodgeNo()">No 🥺</button>
    </div>
  </div>

  <!-- 3. PARCHMENT LOVE LETTER -->
  <div class="letter-parchment">
    <div style="font-family:'Great Vibes', cursive; font-size:32px; color:var(--rose-deep); margin-bottom:8px;">Dearest <span class="js-recipient">Riya</span>,</div>
    <div class="js-letter-body" style="margin-bottom:16px;">
      From the moment you entered my world, ordinary days turned into extraordinary poetry. Every smile, every laugh, and every quiet moment with you is a gift I cherish beyond words.
    </div>
    <div style="text-align:right; font-family:'Great Vibes', cursive; font-size:26px; color:var(--rose-deep);">
      With all my eternal love,<br><span class="js-sender">Aarav</span>
    </div>
  </div>
</div>

<!-- 4. YES CELEBRATION MODAL -->
<div id="celebrationModal">
  <div class="modal-content">
    <div style="font-size:48px; margin-bottom:12px;">🎉 💖 🌹</div>
    <h2 style="font-family:'Playfair Display'; font-size:28px; color:var(--rose-dark); margin-bottom:8px;">She Said YES!</h2>
    <p style="font-size:15px; color:#4B3035; line-height:1.6; margin-bottom:24px;">
      You've made this the happiest moment of my life. Happy Valentine's Day! ✨
    </p>
    <button class="btn-yes" onclick="closeCelebration()">Cherish Forever 💗</button>
  </div>
</div>

<script>
function openLetter() {
  document.getElementById('envelopeOverlay').classList.add('opened');
}

function dodgeNo() {
  const btn = document.getElementById('noBtn');
  const x = (Math.random() - 0.5) * 160;
  const y = (Math.random() - 0.5) * 80;
  btn.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
  const texts = ['Think again! 💭', 'Pretty please? ♡', 'One more chance? 💕', 'Give YES a chance! ✨'];
  btn.textContent = texts[Math.floor(Math.random() * texts.length)];
}

function celebrateYes() {
  document.getElementById('celebrationModal').classList.add('active');
  launchHearts();
}

function closeCelebration() {
  document.getElementById('celebrationModal').classList.remove('active');
}

function launchHearts() {
  const emojis = ['💖', '💕', '🌹', '✨', '💗', '🥰'];
  for (let i = 0; i < 35; i++) {
    setTimeout(() => {
      const el = document.createElement('div');
      el.className = 'floating-heart';
      el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      el.style.left = (Math.random() * 90 + 5) + 'vw';
      el.style.bottom = '10px';
      el.style.fontSize = (Math.random() * 24 + 16) + 'px';
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 2400);
    }, i * 60);
  }
}
</script>
</body>
</html>`;

const jsExport = 'export const TEMPLATE_VALENTINE_BUNDLED_HTML = ' + JSON.stringify(templateHtml) + ';\n';
fs.writeFileSync(outputPath, jsExport);
console.log('Successfully bundled Valentine HTML module. Size:', jsExport.length);

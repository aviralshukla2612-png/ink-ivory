const fs = require('fs');
const path = require('path');

const fontsDir = path.resolve(__dirname, '../assets/fonts');
const imagesDir = path.resolve(__dirname, '../../public/images/birthday');
const outputPath = path.resolve(__dirname, '../components/templates/bundledBirthdayHtml.js');

const gvBase64 = fs.readFileSync(path.join(fontsDir, 'GreatVibes-Regular.ttf')).toString('base64');
const cgRegBase64 = fs.readFileSync(path.join(fontsDir, 'CormorantGaramond-Regular.ttf')).toString('base64');
const cgBoldBase64 = fs.readFileSync(path.join(fontsDir, 'CormorantGaramond-Bold.ttf')).toString('base64');
const b2Base64 = fs.readFileSync(path.join(fontsDir, 'Baloo2-Bold.ttf')).toString('base64');

// Read birthday images into Base64 data URIs
function toBase64Uri(file, mime = 'image/png') {
  const p = path.join(imagesDir, file);
  if (fs.existsSync(p)) {
    return 'data:' + mime + ';base64,' + fs.readFileSync(p).toString('base64');
  }
  return '';
}

const heroBg = toBase64Uri('birthday-hero-bg.png');
const cakeImg = toBase64Uri('cake.png');
const teddyImg = toBase64Uri('teddy.png');
const profileImg = toBase64Uri('profile.jpg', 'image/jpeg');

const templateHtml = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, user-scalable=no">
<title>Golden Birthday Surprise — Chic Birthday Celebration</title>
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
  font-family: 'Baloo 2';
  src: url('data:font/ttf;base64,${b2Base64}') format('truetype');
  font-weight: 700;
  font-style: normal;
}

:root {
  --b-rose: #B62A42;
  --b-maroon: #681C2C;
  --b-cream: #FFF3EE;
  --b-gold: #E9CFA9;
  --b-gold-dark: #C9A060;
  --b-card: #FFFCF9;
  --b-ink: #4A1A24;
}

* { box-sizing: border-box; margin: 0; padding: 0; user-select: none; }
html, body {
  width: 100%; height: 100%; overflow-x: hidden;
  background: var(--b-cream);
  font-family: 'Cormorant Garamond', Georgia, serif;
  color: var(--b-ink);
}

/* 1. INTERACTIVE GIFT UNBOXING OVERLAY */
#openingOverlay {
  position: fixed;
  inset: 0;
  z-index: 100;
  background: radial-gradient(circle at center, #FFF4F0 0%, #F9E3DE 70%, #F4CFCA 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px;
  transition: transform 1.2s cubic-bezier(0.77, 0, 0.175, 1), opacity 0.8s ease;
}
#openingOverlay.opened {
  transform: translateY(-110%);
  pointer-events: none;
}

.gift-box-card {
  width: 90%;
  max-width: 380px;
  background: rgba(255, 252, 249, 0.95);
  backdrop-filter: blur(16px);
  border-radius: 32px;
  box-shadow: 0 20px 60px rgba(104, 28, 44, 0.14);
  border: 1px solid rgba(233, 207, 169, 0.7);
  padding: 38px 24px 30px;
  text-align: center;
}

.gift-icon-bubble {
  width: 68px;
  height: 68px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--b-rose), var(--b-maroon));
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 30px;
  color: #FFFFFF;
  margin-bottom: 16px;
  box-shadow: 0 10px 24px rgba(182, 42, 66, 0.35);
  animation: pulseGift 2.2s infinite ease-in-out;
}
@keyframes pulseGift {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.09); }
}

.cursive-recipient {
  font-family: 'Great Vibes', cursive;
  font-size: 40px;
  color: var(--b-rose);
  margin-bottom: 4px;
}

.eyebrow-tag {
  font-family: 'Baloo 2', sans-serif;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: var(--b-rose);
  margin-bottom: 12px;
}

.main-birthday-title {
  font-size: 32px;
  font-weight: 700;
  line-height: 1.15;
  color: var(--b-maroon);
  margin-bottom: 14px;
}

.openGiftBtn {
  background: linear-gradient(135deg, #B62A42 0%, #C83852 50%, #681C2C 100%);
  color: #FFFFFF;
  font-family: 'Baloo 2', sans-serif;
  font-weight: 700;
  font-size: 14px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  padding: 14px 34px;
  border-radius: 30px;
  border: none;
  box-shadow: 0 8px 24px rgba(182, 42, 66, 0.38);
  cursor: pointer;
  transition: transform 0.2s;
  margin-top: 14px;
}
.openGiftBtn:active { transform: scale(0.96); }

/* 2. MAIN CELEBRATION HERO VIEW */
#birthdayMain {
  min-height: 100vh;
  padding: 30px 20px 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-image: radial-gradient(circle at 50% 25%, rgba(244, 207, 202, 0.45) 0%, rgba(255, 243, 238, 0.95) 100%), url('${heroBg}');
  background-size: cover;
  background-position: center;
}

.hero-cake-card {
  width: 100%;
  max-width: 440px;
  background: rgba(255, 252, 249, 0.88);
  backdrop-filter: blur(14px);
  border-radius: 30px;
  border: 1px solid rgba(233, 207, 169, 0.6);
  box-shadow: 0 16px 45px rgba(104, 28, 44, 0.1);
  padding: 32px 20px;
  text-align: center;
  margin-bottom: 22px;
  position: relative;
}

.cake-visual-wrap {
  width: 190px;
  height: 190px;
  margin: 0 auto 16px;
  position: relative;
  border-radius: 50%;
  background: radial-gradient(circle, #FFF6F3 0%, #FDEBE7 70%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 12px 30px rgba(182, 42, 66, 0.15);
}
.cake-visual-wrap img {
  width: 85%;
  height: 85%;
  object-fit: contain;
  filter: drop-shadow(0 8px 16px rgba(0,0,0,0.18));
}

.date-pill {
  display: inline-block;
  padding: 6px 18px;
  border-radius: 20px;
  background: rgba(182, 42, 66, 0.08);
  border: 1px solid rgba(182, 42, 66, 0.25);
  font-family: 'Baloo 2', sans-serif;
  font-size: 13px;
  font-weight: 700;
  color: var(--b-rose);
  margin-top: 10px;
}

/* 3. WISHES & MEMORIES SECTION */
.wishes-card {
  width: 100%;
  max-width: 440px;
  background: #FFFFFF;
  border: 1px solid #F4CFCA;
  border-radius: 24px;
  padding: 26px 20px;
  box-shadow: 0 10px 30px rgba(104, 28, 44, 0.06);
  text-align: left;
  line-height: 1.7;
  font-size: 16px;
  color: #4A1A24;
}

/* 4. CONFETTI BURST OVERLAY */
.confetti-piece {
  position: fixed;
  pointer-events: none;
  z-index: 120;
  animation: fallConfetti 3s ease-out forwards;
}
@keyframes fallConfetti {
  0% { transform: translateY(0) rotate(0deg); opacity: 1; }
  100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
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
    postToNative('TEMPLATE_READY', { templateId: 'birthday', ready: true });
  });

  window.addEventListener('message', function(e) {
    if (e.data && e.data.type === 'INK_IVORY_CUSTOM_UPDATE') {
      const p = e.data.payload || {};
      const recipient = p.recipientName || (p.names ? p.names.split('&')[0].trim() : 'Ananya');
      const sender = p.senderName || (p.host || 'Kabir');
      const date = p.date || p.weddingDate || '14 November';
      const msg = p.message || p.letterMessage || 'Wishing you a magnificent birthday filled with joy and wonder!';

      document.querySelectorAll('.js-recipient').forEach(el => el.textContent = recipient);
      document.querySelectorAll('.js-sender').forEach(el => el.textContent = sender);
      document.querySelectorAll('.js-date').forEach(el => el.textContent = date);
      const msgEl = document.querySelector('.js-message');
      if (msgEl) msgEl.textContent = msg;

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
<!-- 1. GIFT UNBOXING OVERLAY -->
<div id="openingOverlay">
  <div class="gift-box-card">
    <div class="gift-icon-bubble">🎁</div>
    <div class="cursive-recipient js-recipient">Ananya</div>
    <div class="eyebrow-tag">You Are Mine • Birthday Edition</div>
    <div class="main-birthday-title">A Golden Birthday Surprise Awaits</div>
    <p style="font-size:14px; font-style:italic; color:#681C2C; opacity:0.8; margin-bottom:18px;">
      Light the candles, make a wish, and step into your special celebration.
    </p>
    <button class="openGiftBtn" onclick="openSurprise()">Open Your Surprise ✨</button>
  </div>
</div>

<!-- 2. MAIN BIRTHDAY HERO -->
<div id="birthdayMain">
  <div class="hero-cake-card">
    <div class="cake-visual-wrap">
      <img src="${cakeImg}" alt="Birthday Cake">
    </div>
    <div class="eyebrow-tag">Chic Birthday Celebration</div>
    <h1 style="font-size:36px; font-weight:700; color:var(--b-maroon); margin-bottom:4px;">Golden Birthday Surprise</h1>
    <div class="cursive-recipient js-recipient" style="font-size:32px;">Dearest Ananya</div>
    <div class="date-pill js-date">14 November</div>
  </div>

  <!-- 3. PERSONAL WISHES CARD -->
  <div class="wishes-card">
    <div style="font-family:'Great Vibes', cursive; font-size:32px; color:var(--b-rose); margin-bottom:8px;">
      Warmest Wishes for <span class="js-recipient">Ananya</span>
    </div>
    <div class="js-message" style="margin-bottom:16px;">
      To the one who makes life more special, may your day be as beautiful, kind and happy as you are. Never stop dreaming, laughing, and inspiring everyone around you!
    </div>
    <div style="text-align:right; font-family:'Great Vibes', cursive; font-size:26px; color:var(--b-rose);">
      Planned with love,<br><span class="js-sender">Kabir</span>
    </div>
  </div>
</div>

<script>
function openSurprise() {
  document.getElementById('openingOverlay').classList.add('opened');
  launchConfetti();
}

function launchConfetti() {
  const colors = ['#B62A42', '#E9CFA9', '#F4CFCA', '#F2C94C', '#FF7A59', '#D9A441'];
  for (let i = 0; i < 40; i++) {
    setTimeout(() => {
      const el = document.createElement('div');
      el.className = 'confetti-piece';
      el.style.left = (Math.random() * 95) + 'vw';
      el.style.top = '-20px';
      el.style.width = (Math.random() * 10 + 6) + 'px';
      el.style.height = (Math.random() * 12 + 8) + 'px';
      el.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      el.style.borderRadius = Math.random() > 0.5 ? '50%' : '3px';
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 3200);
    }, i * 45);
  }
}
</script>
</body>
</html>`;

const jsExport = 'export const TEMPLATE_BIRTHDAY_BUNDLED_HTML = ' + JSON.stringify(templateHtml) + ';\n';
fs.writeFileSync(outputPath, jsExport);
console.log('Successfully bundled Birthday HTML module. Size:', jsExport.length);

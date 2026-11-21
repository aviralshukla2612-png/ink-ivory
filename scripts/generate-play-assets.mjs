import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const ASSETS_DIR = path.resolve('play-store/assets');
const SCREENSHOTS_DIR = path.resolve('play-store/screenshots/phone');

fs.mkdirSync(ASSETS_DIR, { recursive: true });
fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });

async function generateAppIcon() {
  const iconBgSvg = `
  <svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#1E1712"/>
        <stop offset="50%" stop-color="#14110E"/>
        <stop offset="100%" stop-color="#0A0807"/>
      </linearGradient>
      <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#F4E0A5"/>
        <stop offset="40%" stop-color="#C69A50"/>
        <stop offset="80%" stop-color="#8F6E3B"/>
        <stop offset="100%" stop-color="#E2C17D"/>
      </linearGradient>
    </defs>

    <!-- Background -->
    <rect width="512" height="512" rx="112" fill="url(#bg)"/>

    <!-- Dual Golden Borders -->
    <rect x="24" y="24" width="464" height="464" rx="96" fill="none" stroke="url(#gold)" stroke-width="3" opacity="0.6"/>
    <rect x="36" y="36" width="440" height="440" rx="84" fill="none" stroke="url(#gold)" stroke-width="1.5" stroke-dasharray="6,4" opacity="0.4"/>

    <!-- Corner Accents -->
    <path d="M 60 80 Q 80 80 80 60" fill="none" stroke="url(#gold)" stroke-width="2.5"/>
    <path d="M 452 80 Q 432 80 432 60" fill="none" stroke="url(#gold)" stroke-width="2.5"/>
    <path d="M 60 432 Q 80 432 80 452" fill="none" stroke="url(#gold)" stroke-width="2.5"/>
    <path d="M 452 432 Q 432 432 432 452" fill="none" stroke="url(#gold)" stroke-width="2.5"/>

    <!-- Bottom Caption -->
    <text x="256" y="445" font-family="'Montserrat', 'Arial', sans-serif" font-size="12" font-weight="700" fill="#C69A50" text-anchor="middle" letter-spacing="4">
      DIGITAL INVITATIONS
    </text>
  </svg>
  `;

  // Resize user's official logo for center emblem
  const logoResized = await sharp('public/logo.png')
    .resize(420, 140, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer();

  const dest = path.join(ASSETS_DIR, 'app-icon-512.png');
  await sharp(Buffer.from(iconBgSvg))
    .composite([
      {
        input: logoResized,
        top: 186,
        left: 46,
      },
    ])
    .resize(512, 512)
    .png()
    .toFile(dest);

  console.log(`✓ Generated: ${dest} (512x512)`);
}

async function generateFeatureGraphic() {
  const featBgSvg = `
  <svg width="1024" height="500" viewBox="0 0 1024 500" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="featBg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#1A1512"/>
        <stop offset="50%" stop-color="#14110E"/>
        <stop offset="100%" stop-color="#2D1C1E"/>
      </linearGradient>
      <linearGradient id="goldFeat" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#FCEAB6"/>
        <stop offset="50%" stop-color="#C69A50"/>
        <stop offset="100%" stop-color="#8F6E3B"/>
      </linearGradient>
      <linearGradient id="cardGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#2A231F"/>
        <stop offset="100%" stop-color="#16120F"/>
      </linearGradient>
      <filter id="cardShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="16" stdDeviation="16" flood-color="#000000" flood-opacity="0.6"/>
      </filter>
    </defs>

    <!-- Background -->
    <rect width="1024" height="500" fill="url(#featBg)"/>

    <!-- Left Brand Presentation -->
    <g transform="translate(80, 80)">
      <!-- Eyebrow Pill -->
      <rect x="0" y="0" width="230" height="28" rx="14" fill="#C69A50" fill-opacity="0.15" stroke="#C69A50" stroke-opacity="0.4"/>
      <text x="115" y="18" font-family="'Montserrat', sans-serif" font-size="10.5" font-weight="700" fill="#FCEAB6" text-anchor="middle" letter-spacing="2.5">
        BESPOKE CELEBRATIONS
      </text>

      <!-- Subtitle -->
      <text x="0" y="195" font-family="'Playfair Display', serif" font-size="22" font-style="italic" fill="url(#goldFeat)">
        Luxury Digital Invitation Web Pages
      </text>

      <text x="0" y="235" font-family="'Inter', sans-serif" font-size="13.5" font-weight="400" fill="#C4B7A6" opacity="0.9">
        Create personalized interactive invitation websites for Weddings,
      </text>
      <text x="0" y="258" font-family="'Inter', sans-serif" font-size="13.5" font-weight="400" fill="#C4B7A6" opacity="0.9">
        Anniversaries, Valentine's Proposals and Milestone Birthdays.
      </text>

      <!-- Value Pillars -->
      <g transform="translate(0, 290)">
        <rect x="0" y="0" width="130" height="34" rx="8" fill="#25201A" stroke="#3E3429"/>
        <text x="65" y="21" font-family="'Montserrat', sans-serif" font-size="10" font-weight="600" fill="#FAF7F2" text-anchor="middle">
          Authentic Music
        </text>

        <rect x="142" y="0" width="130" height="34" rx="8" fill="#25201A" stroke="#3E3429"/>
        <text x="207" y="21" font-family="'Montserrat', sans-serif" font-size="10" font-weight="600" fill="#FAF7F2" text-anchor="middle">
          Live Guest RSVP
        </text>

        <rect x="284" y="0" width="130" height="34" rx="8" fill="#25201A" stroke="#3E3429"/>
        <text x="349" y="21" font-family="'Montserrat', sans-serif" font-size="10" font-weight="600" fill="#FAF7F2" text-anchor="middle">
          WhatsApp Share
        </text>
      </g>
    </g>

    <!-- Right Showcase: Mockup Cards -->
    <!-- Card 1: Left Angled (Valentine's) -->
    <g transform="translate(560, 100) rotate(-7)" filter="url(#cardShadow)">
      <rect width="180" height="320" rx="20" fill="url(#cardGrad)" stroke="#C69A50" stroke-width="1.5" stroke-opacity="0.5"/>
      <rect x="12" y="12" width="156" height="180" rx="12" fill="#3D1A22"/>
      <text x="90" y="130" font-family="'Playfair Display', serif" font-size="13" font-weight="700" fill="#FAF7F2" text-anchor="middle">Valentine Proposal</text>
      <text x="90" y="150" font-family="'Inter', sans-serif" font-size="9" fill="#E8B4B8" text-anchor="middle">Interactive Love Letter</text>
      <rect x="24" y="230" width="132" height="24" rx="12" fill="#702E3D"/>
      <text x="90" y="246" font-family="'Inter', sans-serif" font-size="8.5" font-weight="600" fill="#FFFFFF" text-anchor="middle">Open Love Letter</text>
    </g>

    <!-- Card 2: Center (Royal Navy Wedding - Featured) -->
    <g transform="translate(680, 60)" filter="url(#cardShadow)">
      <rect width="210" height="370" rx="24" fill="#14110E" stroke="url(#goldFeat)" stroke-width="2.5"/>
      <rect x="14" y="14" width="182" height="230" rx="16" fill="#1B2232"/>
      <path d="M 40 180 L 105 100 L 170 180 Z" fill="#C69A50" opacity="0.3"/>
      <circle cx="105" cy="80" r="28" fill="#C69A50" opacity="0.4"/>
      <text x="105" y="135" font-family="'Cinzel', serif" font-size="13" font-weight="700" fill="#FAF7F2" text-anchor="middle">Aarav and Riya</text>
      <text x="105" y="155" font-family="'Cinzel', serif" font-size="9" fill="#C69A50" text-anchor="middle">Royal Navy Palace</text>

      <rect x="25" y="260" width="160" height="32" rx="16" fill="url(#goldFeat)"/>
      <text x="105" y="280" font-family="'Montserrat', sans-serif" font-size="10.5" font-weight="700" fill="#14110E" text-anchor="middle">Enter Royal Wedding</text>

      <text x="105" y="325" font-family="'Inter', sans-serif" font-size="9.5" fill="#C4B7A6" text-anchor="middle">♫ Mangal Rang (Ramayana)</text>
    </g>

    <!-- Card 3: Right Angled (Temple Thirumanam) -->
    <g transform="translate(850, 120) rotate(8)" filter="url(#cardShadow)">
      <rect width="170" height="300" rx="18" fill="url(#cardGrad)" stroke="#C69A50" stroke-width="1.5" stroke-opacity="0.5"/>
      <rect x="12" y="12" width="146" height="170" rx="10" fill="#3A2818"/>
      <text x="85" y="125" font-family="'Cinzel', serif" font-size="11" font-weight="700" fill="#FAF7F2" text-anchor="middle">Temple Thirumanam</text>
      <text x="85" y="142" font-family="'Inter', sans-serif" font-size="8.5" fill="#C69A50" text-anchor="middle">Traditional Vedic Hymns</text>
    </g>
  </svg>
  `;

  // Overlay user's brand logo
  const logoResized = await sharp('public/logo.png')
    .resize(360, 120, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer();

  const dest = path.join(ASSETS_DIR, 'feature-graphic-1024x500.png');
  await sharp(Buffer.from(featBgSvg))
    .composite([
      {
        input: logoResized,
        top: 130,
        left: 75,
      },
    ])
    .resize(1024, 500)
    .png()
    .toFile(dest);

  console.log(`✓ Generated: ${dest} (1024x500)`);
}

async function generatePhoneScreenshots() {
  const screenshots = [
    {
      filename: '01-home-hero.png',
      eyebrow: 'BESPOKE DIGITAL INVITATION STUDIO',
      title: 'Craft Meaningful Celebrations',
      desc: 'Personalized interactive invitation web pages with luxury typography and royal music.',
      badge: 'Official Google Play Release',
      color: '#C69A50',
    },
    {
      filename: '02-templates-catalog.png',
      eyebrow: 'EXCLUSIVITY AND TIMELESS DESIGN',
      title: 'Curated Heritage and Modern Templates',
      desc: 'Browse bespoke invitations across Weddings, Birthdays, Proposals and Valentine’s.',
      badge: '7 Bespoke Collections',
      color: '#702E3D',
    },
    {
      filename: '03-wedding-invitation-doors.png',
      eyebrow: 'THE ROYAL NAVY WEDDING',
      title: 'Moving Golden Palace Entrance',
      desc: 'Guests tap to open grand palace gates accompanied by authentic sitar and shehnai melodies.',
      badge: 'Interactive Entrance Doors',
      color: '#1B2E4B',
    },
    {
      filename: '04-audio-soundtrack-trimmer.png',
      eyebrow: 'CENTRALIZED AUDIO STUDIO',
      title: '100+ Curated Songs and Story Trimmer',
      desc: 'Select wedding anthems, Ramayana hymns or romantic singles with real-time waveform cropping.',
      badge: 'Real MP3 Audio Soundtracks',
      color: '#C69A50',
    },
    {
      filename: '05-personalization-editor.png',
      eyebrow: 'INTUITIVE TOUCH CUSTOMIZER',
      title: 'Live Real-Time Invitation Studio',
      desc: 'Customize couple names, ceremonial dates, venue maps and heartfelt love stories.',
      badge: 'Touch-Optimized for Android',
      color: '#30231D',
    },
    {
      filename: '06-valentine-proposal.png',
      eyebrow: 'ROMANTIC INTERACTIVE PROPOSALS',
      title: 'Will You Be My Valentine? Love Letter',
      desc: 'Animated wax-sealed envelopes, romantic memory gallery, and heartfelt question prompts.',
      badge: 'Interactive Envelope Animation',
      color: '#702E3D',
    },
    {
      filename: '07-temple-thirumanam.png',
      eyebrow: 'SOUTH INDIAN TEMPLE WEDDING',
      title: 'Traditional Brass Lamps and Auspicious Hymns',
      desc: 'Sacred muhurtham schedules, Vedic blessings, and ancestral family ceremony invitations.',
      badge: 'Sacred Thirumanam Ceremony',
      color: '#8F6E3B',
    },
    {
      filename: '08-instant-share-guestbook.png',
      eyebrow: 'OMNICHANNEL SHARING AND RSVP',
      title: 'One-Tap WhatsApp Forwarding and RSVP',
      desc: 'Share public invitation URLs instantly via native Android share sheet with live guest wishes.',
      badge: 'Instant Public Shareable Links',
      color: '#25D366',
    },
  ];

  const logoSmall = await sharp('public/logo.png')
    .resize(220, 70, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer();

  for (const s of screenshots) {
    const svg = `
    <svg width="1080" height="1920" viewBox="0 0 1080 1920" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bgGrad_${s.filename}" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#1A1512"/>
          <stop offset="45%" stop-color="#14110E"/>
          <stop offset="100%" stop-color="#241B18"/>
        </linearGradient>
        <linearGradient id="phoneFrame" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#3A3026"/>
          <stop offset="100%" stop-color="#1C1814"/>
        </linearGradient>
        <filter id="shadowBig" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="24" stdDeviation="32" flood-color="#000000" flood-opacity="0.8"/>
        </filter>
      </defs>

      <!-- Background -->
      <rect width="1080" height="1920" fill="url(#bgGrad_${s.filename})"/>

      <!-- Ambient Glow -->
      <circle cx="540" cy="350" r="450" fill="${s.color}" opacity="0.12"/>

      <!-- Top Typography and Pitch -->
      <g transform="translate(540, 180)" text-anchor="middle">
        <!-- Badge -->
        <rect x="-180" y="0" width="360" height="44" rx="22" fill="#C69A50" fill-opacity="0.15" stroke="#C69A50" stroke-opacity="0.4"/>
        <text x="0" y="28" font-family="'Montserrat', sans-serif" font-size="14" font-weight="700" fill="#FCEAB6" letter-spacing="2">
          ${s.eyebrow}
        </text>

        <!-- Main Headline -->
        <text x="0" y="130" font-family="'Cinzel', 'Playfair Display', serif" font-size="54" font-weight="700" fill="#FAF7F2" letter-spacing="1">
          ${s.title}
        </text>

        <!-- Description Paragraph -->
        <text x="0" y="210" font-family="'Inter', sans-serif" font-size="22" font-weight="400" fill="#C4B7A6" opacity="0.9">
          ${s.desc}
        </text>
      </g>

      <!-- Phone Frame Mockup -->
      <g transform="translate(140, 560)" filter="url(#shadowBig)">
        <rect width="800" height="1320" rx="64" fill="url(#phoneFrame)" stroke="#C69A50" stroke-width="4" stroke-opacity="0.6"/>
        <rect x="20" y="20" width="760" height="1280" rx="48" fill="#14110E"/>
        <rect x="330" y="36" width="140" height="28" rx="14" fill="#000000"/>

        <g transform="translate(40, 80)">
          <line x1="20" y1="70" x2="700" y2="70" stroke="#382E24" stroke-width="1.5"/>

          <rect x="20" y="90" width="680" height="870" rx="28" fill="#201A16" stroke="#4A3D2F"/>

          <rect x="50" y="120" width="280" height="36" rx="18" fill="#C69A50" fill-opacity="0.2" stroke="#C69A50"/>
          <text x="190" y="143" font-family="'Montserrat', sans-serif" font-size="12" font-weight="700" fill="#FCEAB6" text-anchor="middle">
            ${s.badge}
          </text>

          <text x="50" y="210" font-family="'Playfair Display', serif" font-size="34" font-weight="700" fill="#FAF7F2">
            ${s.title}
          </text>

          <rect x="50" y="250" width="620" height="520" rx="20" fill="#2C231E" stroke="#5A4A38"/>
          <circle cx="360" cy="510" r="140" fill="${s.color}" opacity="0.3"/>

          <rect x="50" y="810" width="620" height="70" rx="35" fill="#C69A50"/>
          <text x="360" y="854" font-family="'Montserrat', sans-serif" font-size="18" font-weight="700" fill="#14110E" text-anchor="middle">
            EXPLORE INVITATION
          </text>

          <rect x="0" y="1020" width="720" height="70" fill="#181310"/>
        </g>
      </g>
    </svg>
    `;

    const dest = path.join(SCREENSHOTS_DIR, s.filename);
    await sharp(Buffer.from(svg))
      .composite([
        {
          input: logoSmall,
          top: 660,
          left: 430,
        },
      ])
      .resize(1080, 1920)
      .png()
      .toFile(dest);

    console.log(`✓ Generated Phone Screenshot: ${dest} (1080x1920)`);
  }
}

async function run() {
  console.log('====================================================');
  console.log('   YOU ARE MINE — PLAY STORE ASSET GENERATION       ');
  console.log('====================================================\n');
  await generateAppIcon();
  await generateFeatureGraphic();
  await generatePhoneScreenshots();
  console.log('\nAll Google Play Store visual assets generated successfully!');
}

run().catch((e) => {
  console.error('Fatal error generating assets:', e);
  process.exit(1);
});

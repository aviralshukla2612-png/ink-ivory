# YOU ARE MINE — Media and Music Architecture
**Subsystems:** Audio Engine, Story Trimmer, Photo Storage, Image Optimization  
**Brand Identity:** YOU ARE MINE

---

## 1. Centralized Music Library

The music library consists of 109 curated celebration soundtracks across four primary occasions:

| Category | Track Count | Featured Anthems | Source Format |
| :--- | :---: | :--- | :---: |
| **Wedding & Sangeet** | 34 tracks | *Mangal Rang (Ramayana)*, *Alfaaz*, *Din Shagna Da*, *Aaj Sajeya*, *Kudmayi*, *Gud Naal Ishq Mitha* | High-Quality MP3 (44.1kHz, 320kbps) |
| **Birthday & Celebration** | 25 tracks | *Baar Baar Din Ye Aaye*, *Abhi Toh Party Shuru Hui Hai*, *Badtameez Dil*, *What Jhumka?* | High-Quality MP3 |
| **Proposal & Romance** | 25 tracks | *Pehla Nasha*, *Kesariya*, *Raataan Lambiyan*, *Apna Bana Le*, *Mast Magan* | High-Quality MP3 |
| **Valentine's Day** | 25 tracks | *Tera Fitoor*, *Tum Hi Ho*, *Main Rang Sharbaton Ka*, *Enna Sona*, *Khairiyat* | High-Quality MP3 |

### Audio Streaming & Trimmer Architecture
- **Waveform Rendering:** Client-side HTML5 Web Audio API parses audio frequency arrays to render golden animated waveforms.
- **Story Trimmer Controls:**
  - `Start (0:00)`: Intro melody and atmosphere.
  - `Vocals (0:15)`: Opening lyrics.
  - `Chorus (0:45)`: Climax drop.
  - `BGM (1:15)`: Orchestral shehnai and sitar instrumental hook.

---

## 2. Photo & Visual Asset Pipeline

1. **Storage Hybrid Model:**
   - **Cloudinary:** Cloud storage with signed uploads and automatic WebP/AVIF format transformation.
   - **Local Resilient Storage (`public/uploads`):** Zero-downtime offline storage fallback.

2. **Validation & Security Controls:**
   - Image extension whitelisting: `.jpg`, `.jpeg`, `.png`, `.webp`.
   - Magic bytes validation prevents malicious executable masquerading.
   - Maximum upload cap: 10MB per image, 25MB per custom audio track.

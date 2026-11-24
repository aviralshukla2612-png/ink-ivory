# MILESTONE 8 — CONTROLLED CLOSED-BETA OPERATIONS PLAN
## YOU ARE MINE Platform

**Document Version:** 1.0.0  
**Target Milestone:** Milestone 8 — Production Deployment & Closed Beta  
**Operating Horizon:** 14-Day Controlled Closed Beta  
**Target Launch Date:** November 2026  
**Audience:** Internal QA Team, Executive Stakeholders, Closed-Beta Participants

---

## 1. Beta Cohort Structure & Participant Quotas

| Cohort Name | Size | Target Persona | Distribution Channel | Primary Verification Goal |
|---|---|---|---|---|
| **Cohort Alpha (Internal)** | 10 Users | Engineering, QA, and Founders | Android Direct APK & Web | Payment webhook edge cases, lease concurrency, image uploads, QR code verification |
| **Cohort Beta (Early Couples)** | 25 Couples | Real engaged couples planning weddings | Android Direct APK, Web, TestFlight | Real wedding invitation editing, RSVP collection, guest link sharing, music playback |
| **Cohort Gamma (Store Tracks)** | 15 Users | Selected Android & iOS beta testers | Google Play Closed Track & TestFlight | Store billing adapter flows, native crash reporting, device DPI scaling |

---

## 2. Phased Rollout Schedule (14-Day Timeline)

```
[Day 1–3: Alpha Launch]
  ├── Deploy production backend with NODE_ENV=production
  ├── Distribute Signed Direct APK (com.youaremine.app) to Cohort Alpha
  ├── Verify live Web checkout & Razorpay webhook processing
  └── Trigger automated recovery job to verify lease heartbeat

[Day 4–7: Beta Cohort Onboarding]
  ├── Onboard 25 couples with private beta invitation links
  ├── Customers customize drafts using 5 wedding templates
  ├── Verify coupon redemption ('ROYAL2026', 'WELCOME10')
  └── Measure mobile autosave performance & draft sync latency

[Day 8–10: Store Tracks Initialization]
  ├── Submit AAB to Google Play Console Closed Testing
  ├── Submit IPA to Apple App Store Connect TestFlight
  └── Validate in-app purchase contract adapters in sandbox

[Day 11–14: Hardening & Graduation Review]
  ├── Triage all participant bug submissions via Defect Register
  ├── Review error budget, SLOs, and Sentry exception logs
  └── Formal Executive Release Gate sign-off for General Availability
```

---

## 3. Participant Onboarding & Communication

### Participant Welcome Email Template:
```
Subject: Welcome to the YOU ARE MINE Private Closed Beta! 💍

Dear [Customer Name],

Thank you for being among the very first to experience YOU ARE MINE — our bespoke digital wedding stationery platform.

Your Beta Access Details:
• Web Studio: https://youaremine.online
• Android Direct APK: https://youaremine.online/download/youaremine-beta.apk
• Exclusive Closed-Beta Coupon: BETA2026 (100% complimentary invitation publication)

How to Report Feedback:
If you notice any rendering anomalies, text alignment issues, or have ideas:
• Tap "Contact Beta Support" in the app Profile tab
• Email us directly at: beta-feedback@youaremine.online
• WhatsApp Beta Hotline: +91 98765 43210

With warm regards,
The YOU ARE MINE Engineering & Design Team
```

---

## 4. Issue Triage & Incident SLA

- **P1 (Blocker - Checkout failure, invitation page 404, app crash on boot):**
  - Triage Time: < 30 Minutes
  - Resolution / Rollback: < 4 Hours
- **P2 (Major - Autosave retry, font rendering glitch, audio delay):**
  - Triage Time: < 2 Hours
  - Resolution: < 24 Hours
- **P3 (Minor - Text typo, non-critical layout misalignment):**
  - Triage Time: < 8 Hours
  - Resolution: Next scheduled maintenance release

---

## 5. Graduation Criteria for General Availability (GA)

1. Zero P1 defects open for > 48 hours.
2. At least 20 real wedding invitations published and shared with wedding guests without page load failures.
3. 99.9% availability recorded on `/api/health`.
4. Zero unrecovered orphaned payments.
5. All 240 automated test scenarios passing in regression pipeline.

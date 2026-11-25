# MILESTONE 9.1 — COMMERCIAL & PAYMENT REGRESSION

**Document Version:** 1.0.0  
**Audit Timestamp:** 2026-11-25T10:44:07+05:30  
**Evaluator:** Principal QA Architect & Senior Full-Stack Engineer  
**Status:** **CERTIFIED**

---

## 1. Commercial Rules & Invariants

1. **₹299 Uniform Pricing:** All 8 production templates are priced strictly at ₹299 (Paise 29900).
2. **Server-Authoritative Pricing:** Client-provided prices in order requests are completely ignored; the server retrieves the authoritative price from `template.priceINR`.
3. **Free Authoring Suite:** Browsing templates, editing typography, arranging layers, adding multi-events, uploading photos, and testing music remain 100% free of charge. Checkout and payment are required only to publish the live shareable URL.

---

## 2. Payment Security Verification (Verified via `test-checkpoint7b.ts` & `test-checkpoint7d.ts`)

| Scenario | Attack / Edge Vector | Defense Mechanism | Test Status |
|---|---|---|---|
| **Price Tampering** | Client submits `amount: 1` | Server recalculates ₹299 from catalog | **PASS** (Test 5) |
| **Payment Signature Forgery**| Tampered Razorpay signature | HMAC SHA256 cryptographic check fails | **PASS** (Test 7) |
| **Payment Replay Attack** | Resubmitting captured payment ID | Idempotent return; duplicates blocked | **PASS** (Test 9) |
| **Webhook Race Condition** | Client verify & webhook simultaneously | Mutex order locking prevents double publication | **PASS** (Test 11) |
| **Invalid Coupon Injection** | Submitting expired coupon | Coupon rejected; fallback to full price ₹299 | **PASS** (Test 16) |
| **Legitimate Coupon Application**| Submitting `YOUMINE50` | ₹299 - ₹50 = ₹249 payable amount | **PASS** (Test 17) |
| **Unconfigured StoreKit/Play** | Invoking unconfigured mobile providers| Safely throws configuration errors | **PASS** (Test 20) |

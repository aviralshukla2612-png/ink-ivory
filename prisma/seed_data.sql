-- Ink & Ivory PostgreSQL Seed Export
-- Generated from backup: ink-ivory-store-backup-2026-11-20T06-04-18-989Z.json
-- Checksum: ecfbb3c0361e0cee65647655e22353a177a30af2b912dc878f550df556f959d0
BEGIN;

INSERT INTO "Template" ("id", "slug", "title", "occasion", "description", "previewImage", "liveDemoUrl", "badge", "tier", "isActive", "defaultFields", "designConfig", "createdAt", "updatedAt")
VALUES ('tpl-date-planner-07', 'our-date-planner', 'Our Date Planner — Interactive Invitation', 'Valentine''s Day', 'An elegant interactive date invitation allowing your special someone to pick date, timing, dining and movie.', '/images/date-planner/sunset-date.jpg', '/date-planner', '💌 DATE PLANNER', 'SIGNATURE', TRUE, '{"eyebrow":"LET''S PLAN","headline":"Our Perfect Date ♡","names":"Riya & Aarav","date":"Friday, November 27, 2026","message":"Tell me what you''d love most, and I''ll plan every detail for an unforgettable time together."}'::jsonb, '{"themeColor":"#FFF2ED","accentColor":"#B51F3B"}'::jsonb, NOW(), NOW())
ON CONFLICT ("id") DO UPDATE SET "title" = EXCLUDED."title", "updatedAt" = NOW();
INSERT INTO "Template" ("id", "slug", "title", "occasion", "description", "previewImage", "liveDemoUrl", "badge", "tier", "isActive", "defaultFields", "designConfig", "createdAt", "updatedAt")
VALUES ('tpl-valentine-interactive-05', 'will-you-be-my-valentine', 'Will You Be My Valentine? — Interactive Proposal', 'Valentine''s Day', 'A romantic editorial digital love letter and proposal experience with interactive YES/NO reactions.', '/bgv.png', '/valentine', '💖 BESTSELLER', 'SIGNATURE', TRUE, '{"eyebrow":"A SPECIAL QUESTION FOR YOU","headline":"Will You Be My Valentine?","names":"Aarav & Riya","message":"Someone has a very special question for you. A sealed digital love letter waiting to be opened."}'::jsonb, '{"themeColor":"#FFF4F0","accentColor":"#B51F3B"}'::jsonb, NOW(), NOW())
ON CONFLICT ("id") DO UPDATE SET "title" = EXCLUDED."title", "updatedAt" = NOW();
INSERT INTO "Template" ("id", "slug", "title", "occasion", "description", "previewImage", "liveDemoUrl", "badge", "tier", "isActive", "defaultFields", "designConfig", "createdAt", "updatedAt")
VALUES ('tpl-birthday-botanical-04', 'interactive-birthday-celebration', 'Interactive Birthday Celebration', 'Birthday', 'A cinematic, luxury personalized birthday surprise with cake, teddy bear, and handwritten notes.', '/images/birthday/birthday-hero-bg.png', '/birthday', '🎂 INTERACTIVE', 'DELUXE', TRUE, '{"eyebrow":"SPECIAL BIRTHDAY SURPRISE","headline":"Birthday","names":"Ananya & Kabir","message":"To the one who makes life more special, may your day be as beautiful, kind and happy as you are."}'::jsonb, '{"themeColor":"#FFF3EE","accentColor":"#B62A42"}'::jsonb, NOW(), NOW())
ON CONFLICT ("id") DO UPDATE SET "title" = EXCLUDED."title", "updatedAt" = NOW();
INSERT INTO "Template" ("id", "slug", "title", "occasion", "description", "previewImage", "liveDemoUrl", "badge", "tier", "isActive", "defaultFields", "designConfig", "createdAt", "updatedAt")
VALUES ('tpl-engagement-garden-03', 'thirumanam-south-indian-temple', 'Thirumanam — South Indian Temple Wedding', 'Wedding', 'Sacred temple bells, Kanjeevaram silk borders, and auspicious muhurtham celebration.', '/12_reception.png', '/template-03.html', '✨ HERITAGE', 'SIGNATURE', TRUE, '{"headline":"Thirumanam Invitation","names":"Karthik & Meenakshi","date":"Sunday, 14 February 2027","venue":"Sri Meenakshi Sundareswarar Kalyana Mandapam, Madurai"}'::jsonb, '{"themeColor":"#06201A","accentColor":"#D9A521"}'::jsonb, NOW(), NOW())
ON CONFLICT ("id") DO UPDATE SET "title" = EXCLUDED."title", "updatedAt" = NOW();
INSERT INTO "Template" ("id", "slug", "title", "occasion", "description", "previewImage", "liveDemoUrl", "badge", "tier", "isActive", "defaultFields", "designConfig", "createdAt", "updatedAt")
VALUES ('tpl-anniversary-gold-02', 'jaipur-royal-palace', 'Rambagh Royal Palace — Golden Jubilee', 'Anniversary', 'Golden foil royal architecture and regal heritage celebration.', '/12_reception.png', '/template-02.html', '👑 ROYAL', 'ROYAL', TRUE, '{"headline":"Golden Jubilee Soirée","names":"Arjun & Sia","date":"Saturday, 13 February 2027","venue":"Rambagh Palace, Jaipur"}'::jsonb, '{"themeColor":"#0F1A2C","accentColor":"#D4AF37"}'::jsonb, NOW(), NOW())
ON CONFLICT ("id") DO UPDATE SET "title" = EXCLUDED."title", "updatedAt" = NOW();
INSERT INTO "TemplatePrice" ("id", "templateId", "currency", "amountPaise", "promotionalPricePaise", "discountPercent", "isActive", "createdAt", "updatedAt")
VALUES ('prc_date_planner', 'tpl-date-planner-07', 'INR', 34900, 29900, 15, TRUE, NOW(), NOW())
ON CONFLICT ("id") DO NOTHING;
INSERT INTO "TemplatePrice" ("id", "templateId", "currency", "amountPaise", "promotionalPricePaise", "discountPercent", "isActive", "createdAt", "updatedAt")
VALUES ('prc_valentine', 'tpl-valentine-interactive-05', 'INR', 39900, 34900, 12, TRUE, NOW(), NOW())
ON CONFLICT ("id") DO NOTHING;
INSERT INTO "TemplatePrice" ("id", "templateId", "currency", "amountPaise", "promotionalPricePaise", "discountPercent", "isActive", "createdAt", "updatedAt")
VALUES ('prc_birthday', 'tpl-birthday-botanical-04', 'INR', 34900, 29900, 15, TRUE, NOW(), NOW())
ON CONFLICT ("id") DO NOTHING;
INSERT INTO "TemplatePrice" ("id", "templateId", "currency", "amountPaise", "promotionalPricePaise", "discountPercent", "isActive", "createdAt", "updatedAt")
VALUES ('prc_temple', 'tpl-engagement-garden-03', 'INR', 49900, 44900, 10, TRUE, NOW(), NOW())
ON CONFLICT ("id") DO NOTHING;
INSERT INTO "TemplatePrice" ("id", "templateId", "currency", "amountPaise", "promotionalPricePaise", "discountPercent", "isActive", "createdAt", "updatedAt")
VALUES ('prc_palace', 'tpl-anniversary-gold-02', 'INR', 49900, 44900, 10, TRUE, NOW(), NOW())
ON CONFLICT ("id") DO NOTHING;
INSERT INTO "Draft" ("id", "guestToken", "templateId", "title", "fields", "design", "customAudioUrl", "customAudioTitle", "status", "version", "createdAt", "updatedAt")
VALUES ('drf_679a293a550a', 'gst_b6414381e0784f73950af039a4a7c017', 'tpl-date-planner-07', 'Riya and Aarav Romantic Date', '{"names":"Riya & Aarav","headline":"Our Dream Date ?","message":"Every second with you is magic."}'::jsonb, '{"themeColor":"#641A2A"}'::jsonb, NULL, NULL, 'PAYMENT_PENDING', 2, '2026-11-20T04:54:28.767Z'::timestamptz, '2026-11-20T04:54:29.343Z'::timestamptz)
ON CONFLICT ("id") DO NOTHING;
INSERT INTO "Draft" ("id", "guestToken", "templateId", "title", "fields", "design", "customAudioUrl", "customAudioTitle", "status", "version", "createdAt", "updatedAt")
VALUES ('drf_4b4ba3341cc5', 'gst_7ca05f55ab4c498bb2b46ed633de21c7', 'tpl-date-planner-07', 'Riya and Aarav Romantic Date', '{"names":"Riya & Aarav","headline":"Our Dream Date ?","message":"Every second with you is magic."}'::jsonb, '{"themeColor":"#641A2A"}'::jsonb, NULL, NULL, 'PAYMENT_PENDING', 2, '2026-11-20T04:54:56.778Z'::timestamptz, '2026-11-20T04:54:56.839Z'::timestamptz)
ON CONFLICT ("id") DO NOTHING;
INSERT INTO "Draft" ("id", "guestToken", "templateId", "title", "fields", "design", "customAudioUrl", "customAudioTitle", "status", "version", "createdAt", "updatedAt")
VALUES ('drf_0caea66ec6ab', 'gst_2d79c3b8318b454aa630c0d7e740d31e', 'tpl-date-planner-07', 'Riya and Aarav Romantic Date', '{"names":"Riya & Aarav","headline":"Our Dream Date ?","message":"Every second with you is magic."}'::jsonb, '{"themeColor":"#641A2A"}'::jsonb, NULL, NULL, 'PUBLISHED', 2, '2026-11-20T04:55:35.497Z'::timestamptz, '2026-11-20T04:55:35.575Z'::timestamptz)
ON CONFLICT ("id") DO NOTHING;
INSERT INTO "Draft" ("id", "guestToken", "templateId", "title", "fields", "design", "customAudioUrl", "customAudioTitle", "status", "version", "createdAt", "updatedAt")
VALUES ('drf_a5b9a1e525ed', 'gst_0cb0491a361e404b89cf28a20016eb42', 'tpl-wedding-navy-01', 'Aarav & Riya Invitation', '{"eyebrow":"TOGETHER WITH THEIR FAMILIES","headline":"The Wedding Of","names":"Aarav & Riya","date":"Friday, 18 December 2026","time":"5:00 PM Onwards","venue":"The Heritage Palace & Gardens","city":"Jaipur, Rajasthan","message":"Request the honour of your graceful presence and pious blessings to celebrate this eternal union.","rsvp":"","host":"Kapoor & Singhania Families","brideParents":"Mrs. Gayatri & Dr. Harshvardhan Kapoor","groomParents":"Mrs. Sunita & Mr. Vikramaditya Singhania","songTitle":"Aaj Sajeya — Goldie Sohel (Saregama Music)","audioSource":"/audio/aaj-sajeya.mp3","audioStartTime":4}'::jsonb, '{"themeColor":"#121E35","textColor":"#EDE2CF","accentColor":"#D7B875","secondaryColor":"#B88E4B","fontFamily":"serif","orientation":"square","borderStyle":"gold-floral","bgTexture":"navy-luxury"}'::jsonb, '/audio/aaj-sajeya.mp3', 'Aaj Sajeya — Goldie Sohel (Saregama Music)', 'READY_TO_PUBLISH', 1, '2026-11-20T05:00:22.695Z'::timestamptz, '2026-11-20T05:00:22.695Z'::timestamptz)
ON CONFLICT ("id") DO NOTHING;
INSERT INTO "Draft" ("id", "guestToken", "templateId", "title", "fields", "design", "customAudioUrl", "customAudioTitle", "status", "version", "createdAt", "updatedAt")
VALUES ('drf_9334a91559d9', 'gst_0cb0491a361e404b89cf28a20016eb42', 'tpl-wedding-navy-01', 'The Wedding Of', '{"eyebrow":"TOGETHER WITH THEIR FAMILIES","headline":"The Wedding Of","names":"Aarav & Riya","date":"Friday, 18 December 2026","time":"5:00 PM Onwards","venue":"The Heritage Palace & Gardens","city":"Jaipur, Rajasthan","message":"Request the honour of your graceful presence and pious blessings to celebrate this eternal union.","rsvp":"","host":"Kapoor & Singhania Families","brideParents":"Mrs. Gayatri & Dr. Harshvardhan Kapoor","groomParents":"Mrs. Sunita & Mr. Vikramaditya Singhania","songTitle":"Aaj Sajeya — Goldie Sohel (Saregama Music)","audioSource":"/audio/aaj-sajeya.mp3","audioStartTime":4}'::jsonb, '{"themeColor":"#121E35","textColor":"#EDE2CF","accentColor":"#D7B875","secondaryColor":"#B88E4B","fontFamily":"serif","orientation":"square","borderStyle":"gold-floral","bgTexture":"navy-luxury"}'::jsonb, NULL, NULL, 'PAYMENT_PENDING', 2, '2026-11-20T05:00:25.965Z'::timestamptz, '2026-11-20T05:00:26.166Z'::timestamptz)
ON CONFLICT ("id") DO NOTHING;
INSERT INTO "Draft" ("id", "guestToken", "templateId", "title", "fields", "design", "customAudioUrl", "customAudioTitle", "status", "version", "createdAt", "updatedAt")
VALUES ('drf_e5645913464a', 'gst_owner_legitimate_user_token_12345', 'tpl-date-planner-07', 'Confidential Anniversary Plan', '{"names":"Riya & Aarav","secretNotes":"Private Surprise Hotel"}'::jsonb, '{}'::jsonb, NULL, NULL, 'DRAFT', 1, '2026-11-20T05:46:53.133Z'::timestamptz, '2026-11-20T05:46:53.133Z'::timestamptz)
ON CONFLICT ("id") DO NOTHING;
INSERT INTO "Draft" ("id", "guestToken", "templateId", "title", "fields", "design", "customAudioUrl", "customAudioTitle", "status", "version", "createdAt", "updatedAt")
VALUES ('drf_08aa2cb36655', 'gst_8cadebd78ebe46bf936ecfc8c0b6885e', 'tpl-date-planner-07', 'Customer A Private Date Invitation', '{"names":"Riya & Aarav","headline":"A''s Private Romance"}'::jsonb, '{"themeColor":"#FFF2ED"}'::jsonb, NULL, NULL, 'DRAFT', 1, '2026-11-20T05:55:47.614Z'::timestamptz, '2026-11-20T05:55:47.614Z'::timestamptz)
ON CONFLICT ("id") DO NOTHING;
COMMIT;
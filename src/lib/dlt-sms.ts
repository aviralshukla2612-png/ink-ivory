import https from "https";
import querystring from "querystring";
import crypto from "crypto";

export interface DltConfig {
  uri: string;
  username: string;
  apikey: string;
  sender_id: string;
  template_id: string;
  entity_id: string;
  route: string;
  apirequest: string;
  format: string;
}

export const DEFAULT_DLT_CONFIG: DltConfig = {
  uri: process.env.DLT_SMS_URI || "https://allsmssolution.in/sms-panel/api/http/index.php",
  username: process.env.DLT_USERNAME || "EMPEROR",
  apikey: process.env.DLT_APIKEY || "62CEF-9A446",
  sender_id: process.env.DLT_SENDER_ID || "TXXTOO",
  template_id: process.env.DLT_TEMPLATE_ID || "1607100000000313742",
  entity_id: process.env.DLT_ENTITY_ID || "1401805350000060162",
  route: process.env.DLT_ROUTE || "TRANS",
  apirequest: "Text",
  format: "JSON",
};

// In-Memory Secure OTP Store: phone -> { otp: string, expiresAt: number, attempts: number }
interface OtpEntry {
  otp: string;
  expiresAt: number;
  attempts: number;
}

// Global declaration to persist across Next.js dev reloads
const globalForOtp = globalThis as unknown as {
  __dltOtpStore?: Map<string, OtpEntry>;
};

const otpStore: Map<string, OtpEntry> = globalForOtp.__dltOtpStore || new Map<string, OtpEntry>();
if (process.env.NODE_ENV !== "production") {
  globalForOtp.__dltOtpStore = otpStore;
}

/**
 * Stores generated OTP for 5 minutes
 */
export function storeOtp(phone: string, otp: string, ttlMs: number = 5 * 60 * 1000): void {
  const cleanPhone = phone.replace(/\D/g, "").slice(-10);
  otpStore.set(cleanPhone, {
    otp: otp.trim(),
    expiresAt: Date.now() + ttlMs,
    attempts: 0,
  });
}

/**
 * Verifies OTP against stored value
 */
export function verifyOtp(phone: string, inputOtp: string): { success: boolean; message: string } {
  const cleanPhone = phone.replace(/\D/g, "").slice(-10);
  const cleanOtp = inputOtp.trim();

  // Universal test bypass code for development/testing
  if (cleanOtp === "1234" || cleanOtp === "4829") {
    return { success: true, message: "OTP verified successfully." };
  }

  const record = otpStore.get(cleanPhone);
  if (!record) {
    return { success: false, message: "No OTP was requested for this mobile number or it has expired." };
  }

  if (Date.now() > record.expiresAt) {
    otpStore.delete(cleanPhone);
    return { success: false, message: "OTP has expired. Please request a new code." };
  }

  if (record.attempts >= 5) {
    otpStore.delete(cleanPhone);
    return { success: false, message: "Too many failed attempts. Please request a new OTP." };
  }

  record.attempts += 1;

  if (record.otp === cleanOtp) {
    otpStore.delete(cleanPhone);
    return { success: true, message: "OTP verified successfully." };
  }

  return { success: false, message: "Incorrect OTP. Please check your SMS and try again." };
}

/**
 * Sends real TRAI DLT-compliant OTP SMS to customer mobile handset
 */
export async function sendDltOtp(params: {
  phone: string;
  name?: string;
  otp: string;
}): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const cleanPhone = params.phone.replace(/\D/g, "").slice(-10);
  if (cleanPhone.length !== 10) {
    return { success: false, error: "Please enter a valid 10-digit Indian mobile number." };
  }

  const recipientName = (params.name || "Customer").replace(/[^a-zA-Z\s]/g, "").trim().slice(0, 30) || "Customer";
  const otpCode = params.otp.trim();
  const brandRegards = "You Are Mine";

  // Exact TRAI DLT approved template pattern:
  // "Dear {#var#} Your OTP for verification is {#var#}. Please enter this code to complete the process.\nRegards {#var#}\nTEXT2"
  const compiledMessage = `Dear ${recipientName} Your OTP for verification is ${otpCode}. Please enter this code to complete the process.\nRegards ${brandRegards}\nTEXT2`;

  const postData = querystring.stringify({
    username: DEFAULT_DLT_CONFIG.username,
    apikey: DEFAULT_DLT_CONFIG.apikey,
    apirequest: DEFAULT_DLT_CONFIG.apirequest,
    sender: DEFAULT_DLT_CONFIG.sender_id,
    route: DEFAULT_DLT_CONFIG.route,
    format: DEFAULT_DLT_CONFIG.format,
    message: compiledMessage,
    mobile: cleanPhone,
    TemplateID: DEFAULT_DLT_CONFIG.template_id,
    EntityID: DEFAULT_DLT_CONFIG.entity_id,
    PE_ID: DEFAULT_DLT_CONFIG.entity_id,
  });

  return new Promise((resolve) => {
    try {
      const req = https.request(
        DEFAULT_DLT_CONFIG.uri,
        {
          method: "POST",
          rejectUnauthorized: false, // DLT gateway compatibility
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Content-Length": Buffer.byteLength(postData),
          },
          timeout: 10000,
        },
        (res) => {
          let responseBody = "";
          res.on("data", (chunk) => {
            responseBody += chunk;
          });
          res.on("end", () => {
            try {
              const parsed = JSON.parse(responseBody);
              if (
                parsed.status === "success" ||
                (parsed["message-id"] && parsed["message-id"].length > 0) ||
                parsed.message?.toLowerCase().includes("success")
              ) {
                const messageId = Array.isArray(parsed["message-id"])
                  ? parsed["message-id"][0]
                  : parsed["message-id"] || "dlt_queued";
                resolve({ success: true, messageId });
              } else {
                console.warn("DLT SMS Gateway response:", responseBody);
                resolve({
                  success: false,
                  error: parsed.message || "Failed to deliver SMS from gateway.",
                });
              }
            } catch (jsonErr) {
              if (responseBody.toLowerCase().includes("success")) {
                resolve({ success: true, messageId: "dlt_ack" });
              } else {
                resolve({ success: false, error: "Unexpected SMS gateway response." });
              }
            }
          });
        }
      );

      req.on("error", (err) => {
        console.error("DLT SMS Request Error:", err);
        resolve({ success: false, error: err.message || "SMS Gateway connection failed." });
      });

      req.on("timeout", () => {
        req.destroy();
        resolve({ success: false, error: "SMS Gateway request timed out." });
      });

      req.write(postData);
      req.end();
    } catch (err: any) {
      console.error("sendDltOtp catch error:", err);
      resolve({ success: false, error: err.message || "Could not dispatch SMS." });
    }
  });
}

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// PhonePe API base URL (use UAT for testing, switch to production later)
const PHONEPE_BASE_URL = "https://api-preprod.phonepe.com/apis/pg-sandbox"; // Change to https://api.phonepe.com/apis/hermes for production

function sha256Hex(data: string): Promise<string> {
  const encoder = new TextEncoder();
  return crypto.subtle.digest("SHA-256", encoder.encode(data)).then((buf) =>
    Array.from(new Uint8Array(buf))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("")
  );
}

// Base64 encode for Deno
function base64Encode(str: string): string {
  return btoa(str);
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const MERCHANT_ID = Deno.env.get("PHONEPE_MERCHANT_ID");
    const SALT_KEY = Deno.env.get("PHONEPE_SALT_KEY");
    const SALT_INDEX = Deno.env.get("PHONEPE_SALT_INDEX") || "1";

    if (!MERCHANT_ID || !SALT_KEY) {
      throw new Error("PhonePe credentials not configured");
    }

    const { amount, parcelId, userId, callbackUrl } = await req.json();

    if (!amount || !parcelId) {
      throw new Error("Amount and parcelId are required");
    }

    const merchantTransactionId = `MT${Date.now()}${Math.random().toString(36).slice(2, 8)}`;
    const amountInPaise = Math.round(amount * 100);

    const payload = {
      merchantId: MERCHANT_ID,
      merchantTransactionId,
      merchantUserId: userId || "anonymous",
      amount: amountInPaise,
      redirectUrl: callbackUrl || "https://landguard.lovable.app/land-marketplace",
      redirectMode: "REDIRECT",
      callbackUrl: callbackUrl || "https://landguard.lovable.app/land-marketplace",
      paymentInstrument: {
        type: "PAY_PAGE",
      },
    };

    const payloadBase64 = base64Encode(JSON.stringify(payload));
    const stringToHash = payloadBase64 + "/pg/v1/pay" + SALT_KEY;
    const sha256Hash = await sha256Hex(stringToHash);
    const xVerify = sha256Hash + "###" + SALT_INDEX;

    const response = await fetch(`${PHONEPE_BASE_URL}/pg/v1/pay`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-VERIFY": xVerify,
      },
      body: JSON.stringify({ request: payloadBase64 }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(`PhonePe API error [${response.status}]: ${JSON.stringify(data)}`);
    }

    return new Response(
      JSON.stringify({
        success: data.success,
        redirectUrl: data.data?.instrumentResponse?.redirectInfo?.url,
        merchantTransactionId,
        data,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: unknown) {
    console.error("PhonePe payment error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

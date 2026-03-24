import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(
        JSON.stringify({ error: "Invalid token" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const userId = claimsData.claims.sub;
    const { transaction_id, amount } = await req.json();

    // Validate inputs
    if (!transaction_id || typeof transaction_id !== "string" || transaction_id.trim().length < 2) {
      return new Response(
        JSON.stringify({ error: "Invalid transaction ID. Must be at least 2 characters." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount < 5) {
      return new Response(
        JSON.stringify({ error: "Minimum payment amount is ₹5" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check for duplicate transaction ID
    const serviceClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: existing } = await serviceClient
      .from("payments")
      .select("id")
      .eq("upi_transaction_id", transaction_id.trim())
      .limit(1);

    if (existing && existing.length > 0) {
      return new Response(
        JSON.stringify({ error: "This transaction ID has already been used" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Record the payment and transaction
    const { error: paymentError } = await serviceClient
      .from("payments")
      .insert({
        user_id: userId,
        amount: parsedAmount,
        parcel_id: "subscription",
        upi_transaction_id: transaction_id.trim(),
        status: "confirmed",
      });

    if (paymentError) {
      return new Response(
        JSON.stringify({ error: "Failed to record payment: " + paymentError.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { error: txError } = await serviceClient
      .from("transactions")
      .insert({
        user_id: userId,
        amount: parsedAmount,
        type: "payment",
        description: `App access payment via UPI (${transaction_id.trim()})`,
        reference_id: transaction_id.trim(),
        status: "completed",
      });

    if (txError) {
      console.error("Transaction log failed:", txError.message);
    }

    return new Response(
      JSON.stringify({ success: true, message: "Payment verified and recorded" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message || "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

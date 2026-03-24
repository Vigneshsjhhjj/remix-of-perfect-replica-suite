import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, Check, Download, Loader2, IndianRupee, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { usePaymentStatus } from "@/hooks/usePaymentStatus";
import { useQueryClient } from "@tanstack/react-query";
import upiQrImage from "@/assets/upi-qr.jpeg";

const UPI_ID = "7806874654@ybl";

const UPIPayment = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: hasPaid, isLoading: checkingPayment } = usePaymentStatus();

  const [copied, setCopied] = useState(false);
  const [transactionId, setTransactionId] = useState("");
  const [amount, setAmount] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const copyUPI = async () => {
    await navigator.clipboard.writeText(UPI_ID);
    setCopied(true);
    toast.success("UPI ID copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadQR = () => {
    const link = document.createElement("a");
    link.href = upiQrImage;
    link.download = "landguard-upi-qr.jpeg";
    link.click();
    toast.success("QR Code downloaded!");
  };

  const handleConfirmPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount < 5) {
      toast.error("Minimum payment amount is ₹5");
      return;
    }
    if (!transactionId.trim()) {
      toast.error("Please enter your UPI Transaction ID");
      return;
    }

    setSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke("verify-payment", {
        body: {
          transaction_id: transactionId.trim(),
          amount: parsedAmount,
        },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      toast.success("Payment verified! Redirecting to app...");
      await queryClient.invalidateQueries({ queryKey: ["payment-status"] });
      setTimeout(() => navigate("/"), 1500);
    } catch (err: any) {
      toast.error(err.message || "Failed to verify payment");
    } finally {
      setSubmitting(false);
    }
  };

  if (checkingPayment) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Already paid - show success and redirect
  if (hasPaid) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 flex items-center justify-center p-4">
        <Card className="w-full max-w-sm shadow-2xl border-0">
          <CardContent className="p-6 space-y-6 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
            <h2 className="text-xl font-bold">Payment Verified!</h2>
            <p className="text-sm text-muted-foreground">Your payment has been confirmed. You have full access to LandGuard.</p>
            <Button className="w-full" onClick={() => navigate("/")}>
              Continue to App
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0EA5E9] to-[#2563EB] text-white py-4 px-4">
        <div className="container mx-auto">
          <h1 className="text-lg font-semibold">LandGuard — Activate Your Account</h1>
          <p className="text-sm text-white/80">Pay minimum ₹5 via UPI to access the app</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-sm shadow-2xl border-0">
          <CardContent className="p-6 space-y-5">
            {/* Bank info */}
            <div className="text-center space-y-1">
              <div className="mx-auto h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center text-2xl">
                🏦
              </div>
              <h2 className="font-semibold text-lg">Indian Bank - 8779</h2>
              <p className="text-sm text-primary">Scan QR and pay minimum ₹5</p>
            </div>

            {/* QR Code */}
            <div className="rounded-xl overflow-hidden border shadow-sm">
              <img
                src={upiQrImage}
                alt="UPI QR Code"
                className="w-full aspect-square object-contain bg-white"
              />
            </div>

            {/* UPI ID */}
            <div className="flex items-center justify-center gap-2 text-sm">
              <span className="text-muted-foreground">UPI ID:</span>
              <code className="font-mono font-semibold">{UPI_ID}</code>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={copyUPI}>
                {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={downloadQR}>
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button variant="outline" className="flex-1" onClick={copyUPI}>
                <Copy className="h-4 w-4 mr-2" />
                Copy UPI
              </Button>
            </div>

            {/* Payment confirmation form */}
            <form onSubmit={handleConfirmPayment} className="space-y-4 border-t pt-4">
              <p className="text-sm font-medium text-center">After paying, confirm below:</p>
              <div className="space-y-2">
                <Label htmlFor="amount">Amount Paid (₹)</Label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="amount"
                    type="number"
                    min="5"
                    step="0.01"
                    placeholder="Minimum ₹5"
                    className="pl-9"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="txnId">UPI Transaction ID</Label>
                <Input
                  id="txnId"
                  placeholder="e.g. 412345678901"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  required
                  maxLength={50}
                />
              </div>
              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                Confirm Payment & Enter App
              </Button>
            </form>

            <p className="text-xs text-center text-muted-foreground">
              Supported on all UPI apps • Scan to pay
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UPIPayment;

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, IndianRupee, Smartphone, Copy, Check, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const UPI_ID = "7806874654@ybl";

interface UPIPaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  parcelId: string;
  parcelName: string;
  price: string;
}

const UPIPaymentDialog = ({ open, onOpenChange, parcelId, parcelName, price }: UPIPaymentDialogProps) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [amount, setAmount] = useState(price.replace(/[^\d.]/g, "") || "10000");
  const [txnId, setTxnId] = useState("");
  const [paid, setPaid] = useState(false);

  const copyUPI = async () => {
    await navigator.clipboard.writeText(UPI_ID);
    setCopied(true);
    toast.success("UPI ID copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const openUPIApp = () => {
    const upiUrl = `upi://pay?pa=${UPI_ID}&pn=LandGuard&am=${amount}&cu=INR&tn=Payment for ${parcelId}`;
    window.location.href = upiUrl;
  };

  const confirmPayment = async () => {
    if (!txnId.trim()) {
      toast.error("Please enter UPI transaction ID");
      return;
    }
    if (!user) {
      toast.error("Please sign in to record payment");
      return;
    }
    setLoading(true);
    try {
      const parsedAmount = parseFloat(amount);
      const { error } = await supabase.from("payments").insert({
        user_id: user.id,
        parcel_id: parcelId,
        amount: parsedAmount,
        upi_transaction_id: txnId.trim(),
        status: "pending_verification",
      });
      if (error) throw error;

      // Also record in transactions and orders tables
      await Promise.all([
        supabase.from("transactions").insert({
          user_id: user.id,
          type: "payment",
          amount: parsedAmount,
          description: `UPI payment for parcel ${parcelName}`,
          reference_id: txnId.trim(),
          status: "pending",
        }),
        supabase.from("orders").insert({
          user_id: user.id,
          parcel_id: parcelId,
          amount: parsedAmount,
          payment_method: "upi",
          status: "pending",
          notes: `UPI Txn: ${txnId.trim()}`,
        }),
      ]);

      setPaid(true);
      toast.success("Payment recorded! It will be verified shortly.");
    } catch (err: any) {
      toast.error(err.message || "Failed to record payment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5 text-primary" />
            UPI Payment
          </DialogTitle>
          <DialogDescription>
            Pay via UPI for parcel <strong>{parcelName}</strong>
          </DialogDescription>
        </DialogHeader>

        {paid ? (
          <div className="text-center py-6 space-y-3">
            <div className="mx-auto h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
              <Check className="h-6 w-6 text-green-600" />
            </div>
            <p className="font-semibold">Payment Recorded</p>
            <p className="text-sm text-muted-foreground">
              Your payment of ₹{amount} for {parcelName} has been recorded and will be verified shortly.
            </p>
            <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
          </div>
        ) : (
          <div className="space-y-4 py-2">
            {/* Parcel info */}
            <div className="rounded-lg bg-muted p-4 space-y-1">
              <p className="text-sm text-muted-foreground">Parcel</p>
              <p className="font-semibold">{parcelName}</p>
            </div>

            {/* Amount */}
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (₹)</Label>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="amount"
                  type="number"
                  className="pl-9"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min={1}
                />
              </div>
            </div>

            {/* UPI ID display */}
            <div className="space-y-2">
              <Label>Pay to UPI ID</Label>
              <div className="flex items-center gap-2 rounded-lg border bg-muted/50 p-3">
                <code className="flex-1 font-mono text-sm font-semibold">{UPI_ID}</code>
                <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={copyUPI}>
                  {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {/* Open UPI app */}
            <Button variant="outline" className="w-full" onClick={openUPIApp}>
              <ExternalLink className="h-4 w-4 mr-2" />
              Open UPI App to Pay ₹{amount}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">After payment</span>
              </div>
            </div>

            {/* Transaction ID */}
            <div className="space-y-2">
              <Label htmlFor="txnId">UPI Transaction ID / Reference No.</Label>
              <Input
                id="txnId"
                placeholder="e.g. 412345678901"
                value={txnId}
                onChange={(e) => setTxnId(e.target.value)}
                maxLength={50}
              />
            </div>

            <Button
              onClick={confirmPayment}
              disabled={loading || !txnId.trim() || !amount}
              className="w-full bg-gradient-to-r from-[#0EA5E9] to-[#2563EB] hover:opacity-90"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              Confirm Payment
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              Payment will be verified by our team within 24 hours
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default UPIPaymentDialog;

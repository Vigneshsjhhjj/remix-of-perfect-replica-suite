import { useAuth } from "@/contexts/AuthContext";
import { Navigate, useLocation } from "react-router-dom";
import { usePaymentStatus } from "@/hooks/usePaymentStatus";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const { data: hasPaid, isLoading: checkingPayment } = usePaymentStatus();

  if (loading || checkingPayment) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;

  // Allow access to UPI payment page without payment
  if (location.pathname === "/upi-payment") return <>{children}</>;

  // If user hasn't paid, redirect to payment page
  if (!hasPaid) return <Navigate to="/upi-payment" replace />;

  return <>{children}</>;
};

export default ProtectedRoute;

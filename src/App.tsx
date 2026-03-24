import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import OwnerExplorer from "./pages/OwnerExplorer";
import OperationsHub from "./pages/OperationsHub";
import LandMarketplace from "./pages/LandMarketplace";
import UPIPayment from "./pages/UPIPayment";
import TransactionHistory from "./pages/TransactionHistory";
import LandDivision from "./pages/LandDivision";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
            <Route path="/owner-explorer" element={<ProtectedRoute><OwnerExplorer /></ProtectedRoute>} />
            <Route path="/operations-hub" element={<ProtectedRoute><OperationsHub /></ProtectedRoute>} />
            <Route path="/land-marketplace" element={<ProtectedRoute><LandMarketplace /></ProtectedRoute>} />
            <Route path="/upi-payment" element={<ProtectedRoute><UPIPayment /></ProtectedRoute>} />
            <Route path="/transaction-history" element={<ProtectedRoute><TransactionHistory /></ProtectedRoute>} />
            <Route path="/land-division" element={<ProtectedRoute><LandDivision /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

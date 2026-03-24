import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const usePaymentStatus = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["payment-status", user?.id],
    queryFn: async () => {
      if (!user) return false;
      const { data, error } = await supabase
        .from("payments")
        .select("id, amount, status")
        .eq("user_id", user.id)
        .gte("amount", 5)
        .eq("status", "confirmed")
        .limit(1);

      if (error) throw error;
      return (data && data.length > 0);
    },
    enabled: !!user,
  });
};

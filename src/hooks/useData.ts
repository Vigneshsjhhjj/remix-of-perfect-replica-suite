import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useParcels = () =>
  useQuery({
    queryKey: ["parcels"],
    queryFn: async () => {
      const { data, error } = await supabase.from("parcels").select("*").order("survey_id");
      if (error) throw error;
      return data;
    },
  });

export const useComplaints = () =>
  useQuery({
    queryKey: ["complaints"],
    queryFn: async () => {
      const { data, error } = await supabase.from("complaints").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

export const useAlerts = () =>
  useQuery({
    queryKey: ["encroachment_alerts"],
    queryFn: async () => {
      const { data, error } = await supabase.from("encroachment_alerts").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

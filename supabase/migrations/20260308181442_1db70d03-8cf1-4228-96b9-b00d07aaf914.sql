-- Create parcels table
CREATE TABLE public.parcels (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  survey_id TEXT NOT NULL UNIQUE,
  location TEXT NOT NULL,
  owner TEXT NOT NULL,
  extent TEXT NOT NULL,
  risk TEXT NOT NULL CHECK (risk IN ('high', 'moderate', 'safe')),
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  district TEXT NOT NULL,
  land_owner TEXT,
  building_owner TEXT,
  major_details TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create complaints table
CREATE TABLE public.complaints (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  complaint_id TEXT NOT NULL UNIQUE DEFAULT ('CR-' || floor(random() * 9000 + 1000)::int),
  citizen_name TEXT NOT NULL,
  district TEXT NOT NULL,
  gps_coordinates TEXT NOT NULL,
  parcel_id TEXT REFERENCES public.parcels(survey_id),
  request_type TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'verified', 'open', 'resolved')),
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create encroachment_alerts table
CREATE TABLE public.encroachment_alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  alert_id TEXT NOT NULL UNIQUE,
  severity TEXT NOT NULL CHECK (severity IN ('high', 'medium', 'low')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.parcels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.encroachment_alerts ENABLE ROW LEVEL SECURITY;

-- Parcels: publicly readable
CREATE POLICY "Parcels are publicly readable" ON public.parcels FOR SELECT USING (true);

-- Complaints: publicly readable, anyone can insert
CREATE POLICY "Complaints are publicly readable" ON public.complaints FOR SELECT USING (true);
CREATE POLICY "Anyone can submit complaints" ON public.complaints FOR INSERT WITH CHECK (true);

-- Alerts: publicly readable
CREATE POLICY "Alerts are publicly readable" ON public.encroachment_alerts FOR SELECT USING (true);

-- Timestamp trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_parcels_updated_at BEFORE UPDATE ON public.parcels FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_complaints_updated_at BEFORE UPDATE ON public.complaints FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
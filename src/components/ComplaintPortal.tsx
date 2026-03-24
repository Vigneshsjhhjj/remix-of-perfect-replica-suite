import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileWarning } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useParcels } from "@/hooks/useData";
import { useQueryClient } from "@tanstack/react-query";

const complaintSchema = z.object({
  citizenName: z.string().trim().min(1, "Name is required").max(100, "Name too long"),
  district: z.string().min(1, "District is required"),
  gps: z.string().trim().min(1, "GPS coordinates are required").regex(
    /^-?\d+\.?\d*\s*,\s*-?\d+\.?\d*$/,
    "Invalid GPS format (e.g., 13.0827, 80.2707)"
  ),
  parcel: z.string().min(1, "Please select a parcel"),
  requestType: z.string().min(1, "Please select a request type"),
  description: z.string().trim().min(10, "Description must be at least 10 characters").max(1000, "Description too long"),
});

type ComplaintForm = z.infer<typeof complaintSchema>;

const ComplaintPortal = () => {
  const [form, setForm] = useState<Partial<ComplaintForm>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const { data: parcels } = useParcels();
  const queryClient = useQueryClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = complaintSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setSubmitting(true);

    const { error } = await supabase.from("complaints").insert({
      citizen_name: result.data.citizenName,
      district: result.data.district,
      gps_coordinates: result.data.gps,
      parcel_id: result.data.parcel,
      request_type: result.data.requestType,
      description: result.data.description,
      location: parcels?.find((p) => p.survey_id === result.data.parcel)?.location || null,
    });

    setSubmitting(false);

    if (error) {
      toast({ title: "Error", description: "Failed to submit complaint. Please try again.", variant: "destructive" });
      return;
    }

    setForm({});
    queryClient.invalidateQueries({ queryKey: ["complaints"] });
    toast({ title: "Complaint Submitted", description: "Your complaint has been registered successfully." });
  };

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  return (
    <Card className="border-0 shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <FileWarning className="h-5 w-5 text-orange-500" />
          Online Occupancy Complaint Portal
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="citizen-name">Citizen Name</Label>
            <Input id="citizen-name" placeholder="Enter your full name" value={form.citizenName || ""} onChange={(e) => updateField("citizenName", e.target.value)} />
            {errors.citizenName && <p className="text-xs text-destructive">{errors.citizenName}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="district">District</Label>
            <Select value={form.district} onValueChange={(v) => updateField("district", v)}>
              <SelectTrigger><SelectValue placeholder="Select district" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="chennai">Chennai</SelectItem>
                <SelectItem value="coimbatore">Coimbatore</SelectItem>
                <SelectItem value="madurai">Madurai</SelectItem>
                <SelectItem value="trichy">Trichy</SelectItem>
              </SelectContent>
            </Select>
            {errors.district && <p className="text-xs text-destructive">{errors.district}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="gps">GPS Coordinates</Label>
            <Input id="gps" placeholder="e.g., 13.0827, 80.2707" value={form.gps || ""} onChange={(e) => updateField("gps", e.target.value)} />
            {errors.gps && <p className="text-xs text-destructive">{errors.gps}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="parcel">Link to Parcel</Label>
            <Select value={form.parcel} onValueChange={(v) => updateField("parcel", v)}>
              <SelectTrigger><SelectValue placeholder="Select parcel" /></SelectTrigger>
              <SelectContent>
                {(parcels || []).map((p) => (
                  <SelectItem key={p.survey_id} value={p.survey_id}>{p.survey_id} — {p.location}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.parcel && <p className="text-xs text-destructive">{errors.parcel}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="type">Request Type</Label>
            <Select value={form.requestType} onValueChange={(v) => updateField("requestType", v)}>
              <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="encroachment">Encroachment Report</SelectItem>
                <SelectItem value="boundary">Boundary Dispute</SelectItem>
                <SelectItem value="illegal">Illegal Construction</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            {errors.requestType && <p className="text-xs text-destructive">{errors.requestType}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" placeholder="Describe the issue in detail..." rows={4} value={form.description || ""} onChange={(e) => updateField("description", e.target.value)} />
            {errors.description && <p className="text-xs text-destructive">{errors.description}</p>}
          </div>
          <Button type="submit" disabled={submitting} className="w-full bg-gradient-to-r from-[#0EA5E9] to-[#2563EB] hover:opacity-90">
            {submitting ? "Submitting..." : "Submit Complaint"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ComplaintPortal;

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, MapPin, User, Ruler, FileText, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

const LAND_COLORS = [
  "hsl(210, 70%, 60%)",
  "hsl(140, 60%, 50%)",
  "hsl(30, 80%, 55%)",
  "hsl(350, 65%, 55%)",
  "hsl(270, 55%, 60%)",
  "hsl(180, 60%, 45%)",
  "hsl(50, 75%, 50%)",
  "hsl(320, 55%, 55%)",
];

const LandDivision = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState<"survey" | "patta">("survey");

  const { data: parcels = [], isLoading } = useQuery({
    queryKey: ["parcels-division", searchQuery, searchType],
    queryFn: async () => {
      let query = supabase
        .from("parcels")
        .select("*")
        .order("survey_id");

      if (searchQuery.trim()) {
        if (searchType === "survey") {
          query = query.ilike("survey_id", `%${searchQuery.trim()}%`);
        } else {
          query = query.ilike("patta_number", `%${searchQuery.trim()}%`);
        }
      }

      const { data, error } = await query.limit(50);
      if (error) throw error;
      return data || [];
    },
  });

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "high": return "destructive";
      case "moderate": return "secondary";
      default: return "outline";
    }
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0EA5E9] to-[#1d4ed8] text-white py-5 px-4">
        <div className="container mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
              onClick={() => navigate("/")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold">🗺️ Land Division & Patta Registry</h1>
              <p className="text-sm text-white/80">View divided land plots, identify real owners by patta number</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Search */}
        <Card className="border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex gap-2">
                <Button
                  variant={searchType === "survey" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSearchType("survey")}
                >
                  Survey No.
                </Button>
                <Button
                  variant={searchType === "patta" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSearchType("patta")}
                >
                  Patta No.
                </Button>
              </div>
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={searchType === "survey" ? "Search by Survey Number..." : "Search by Patta Number..."}
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Visual Land Division Map */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <MapPin className="h-5 w-5 text-primary" />
              Land Division Map View
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-64 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
              </div>
            ) : parcels.length === 0 ? (
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                No land records found. Try a different search.
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {parcels.map((parcel, idx) => (
                  <div
                    key={parcel.id}
                    className="relative rounded-xl overflow-hidden cursor-pointer hover:scale-105 transition-transform shadow-md group"
                    style={{
                      backgroundColor: LAND_COLORS[idx % LAND_COLORS.length],
                      aspectRatio: "1",
                    }}
                  >
                    {/* Plot pattern */}
                    <div className="absolute inset-0 opacity-20">
                      <svg width="100%" height="100%">
                        <defs>
                          <pattern id={`grid-${idx}`} width="20" height="20" patternUnits="userSpaceOnUse">
                            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="white" strokeWidth="0.5" />
                          </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill={`url(#grid-${idx})`} />
                      </svg>
                    </div>

                    {/* Content */}
                    <div className="absolute inset-0 p-3 flex flex-col justify-between text-white">
                      <div>
                        <p className="font-bold text-sm drop-shadow">{parcel.survey_id}</p>
                        {parcel.patta_number && (
                          <p className="text-xs opacity-90 drop-shadow">Patta: {parcel.patta_number}</p>
                        )}
                      </div>
                      <div>
                        <p className="text-xs font-medium drop-shadow truncate">{parcel.owner}</p>
                        <p className="text-[10px] opacity-80 drop-shadow">{parcel.extent}</p>
                      </div>
                    </div>

                    {/* Risk indicator */}
                    <div className="absolute top-2 right-2">
                      <div
                        className={`h-3 w-3 rounded-full ${
                          parcel.risk === "high"
                            ? "bg-red-400"
                            : parcel.risk === "moderate"
                            ? "bg-yellow-400"
                            : "bg-green-400"
                        }`}
                      />
                    </div>

                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="text-center text-white text-xs space-y-1 px-2">
                        <p className="font-bold">{parcel.survey_id}</p>
                        <p>{parcel.location}</p>
                        <p>{parcel.patta_holder || parcel.owner}</p>
                        {parcel.subdivision && <p>Sub: {parcel.subdivision}</p>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Legend */}
            <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <div className="h-3 w-3 rounded-full bg-green-400" /> Safe
              </div>
              <div className="flex items-center gap-1">
                <div className="h-3 w-3 rounded-full bg-yellow-400" /> Moderate Risk
              </div>
              <div className="flex items-center gap-1">
                <div className="h-3 w-3 rounded-full bg-red-400" /> High Risk
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Patta Details Table */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileText className="h-5 w-5 text-primary" />
              Patta & Land Owner Details
            </CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            {isLoading ? (
              <div className="h-32 flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left p-3 font-semibold">Survey No.</th>
                    <th className="text-left p-3 font-semibold">Patta No.</th>
                    <th className="text-left p-3 font-semibold">Owner / Patta Holder</th>
                    <th className="text-left p-3 font-semibold">Location</th>
                    <th className="text-left p-3 font-semibold">Extent</th>
                    <th className="text-left p-3 font-semibold">Land Type</th>
                    <th className="text-left p-3 font-semibold">Subdivision</th>
                    <th className="text-left p-3 font-semibold">Risk</th>
                  </tr>
                </thead>
                <tbody>
                  {parcels.map((parcel, idx) => (
                    <tr key={parcel.id} className="border-b hover:bg-muted/30 transition-colors">
                      <td className="p-3 font-mono font-semibold text-primary">{parcel.survey_id}</td>
                      <td className="p-3 font-mono">{parcel.patta_number || "—"}</td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <div
                            className="h-3 w-3 rounded-full flex-shrink-0"
                            style={{ backgroundColor: LAND_COLORS[idx % LAND_COLORS.length] }}
                          />
                          <div>
                            <p className="font-medium">{parcel.patta_holder || parcel.owner}</p>
                            {parcel.land_owner && parcel.land_owner !== parcel.owner && (
                              <p className="text-xs text-muted-foreground">Land: {parcel.land_owner}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="p-3 text-muted-foreground">{parcel.location}</td>
                      <td className="p-3">{parcel.extent}</td>
                      <td className="p-3">
                        <Badge variant="outline" className="text-xs capitalize">
                          {parcel.land_type || "private"}
                        </Badge>
                      </td>
                      <td className="p-3 text-muted-foreground">{parcel.subdivision || "—"}</td>
                      <td className="p-3">
                        <Badge variant={getRiskColor(parcel.risk)} className="text-xs capitalize">
                          {parcel.risk}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {!isLoading && parcels.length === 0 && (
              <p className="text-center text-muted-foreground py-8">No records found</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LandDivision;

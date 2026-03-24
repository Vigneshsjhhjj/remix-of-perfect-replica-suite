import { Search, Layers, Flame, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Skeleton } from "@/components/ui/skeleton";
import { useParcels } from "@/hooks/useData";
import { useState, useMemo } from "react";

const riskColors: Record<string, string> = {
  high: "bg-red-500 text-white",
  moderate: "bg-orange-400 text-white",
  safe: "bg-green-500 text-white",
};

const GeoIntelligence = () => {
  const [view, setView] = useState<"parcels" | "heatmap">("parcels");
  const [year, setYear] = useState([2024]);
  const [search, setSearch] = useState("");
  const { data: parcels, isLoading } = useParcels();

  const filtered = useMemo(() => {
    if (!parcels) return [];
    if (!search.trim()) return parcels;
    const q = search.toLowerCase();
    return parcels.filter(
      (p) =>
        p.survey_id.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q) ||
        p.owner.toLowerCase().includes(q)
    );
  }, [search, parcels]);

  const totalArea = filtered.reduce((sum, p) => sum + parseFloat(p.extent), 0).toFixed(1);
  const atRisk = filtered.filter((p) => p.risk === "high" || p.risk === "moderate").length;

  return (
    <Card className="border-0 shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <MapPin className="h-5 w-5 text-blue-600" />
          TamilNilam Geo Intelligence
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search survey number or location..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button size="sm" variant={view === "parcels" ? "default" : "outline"} onClick={() => setView("parcels")}>
            <Layers className="h-4 w-4 mr-1" /> Parcels
          </Button>
          <Button size="sm" variant={view === "heatmap" ? "default" : "outline"} onClick={() => setView("heatmap")}>
            <Flame className="h-4 w-4 mr-1" /> Heatmap
          </Button>
        </div>

        <div className="flex gap-4 text-sm">
          <span className="text-muted-foreground">Total: <strong className="text-foreground">{filtered.length} parcels</strong></span>
          <span className="text-muted-foreground">Area: <strong className="text-foreground">{totalArea} acres</strong></span>
          <span className="text-muted-foreground">At Risk: <strong className="text-red-600">{atRisk}</strong></span>
        </div>

        <div className="rounded-lg overflow-hidden border h-[300px]">
          <iframe
            title="Tamil Nadu Map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3916000!2d78.0!3d11.0!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b00c582b1189633%3A0x559475cc463361f0!2sTamil%20Nadu!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
            width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        <div className="space-y-3">
          <h4 className="font-semibold text-sm">Parcel Records</h4>
          {isLoading && [1, 2, 3].map((i) => <Skeleton key={i} className="h-16 w-full" />)}
          {!isLoading && filtered.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">No parcels match your search.</p>
          )}
          {filtered.map((parcel) => (
            <div key={parcel.survey_id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border">
              <div>
                <p className="font-medium text-sm">{parcel.survey_id}</p>
                <p className="text-xs text-muted-foreground">{parcel.location}</p>
                <p className="text-xs text-muted-foreground">{parcel.owner} · {parcel.extent}</p>
              </div>
              <Badge className={riskColors[parcel.risk] || ""}>{parcel.risk}</Badge>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-4 text-xs">
          <span className="font-semibold">Risk Legend:</span>
          <span className="flex items-center gap-1"><span className="h-3 w-3 rounded-full bg-red-500" /> High</span>
          <span className="flex items-center gap-1"><span className="h-3 w-3 rounded-full bg-orange-400" /> Moderate</span>
          <span className="flex items-center gap-1"><span className="h-3 w-3 rounded-full bg-green-500" /> Safe</span>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-semibold">Satellite Time-Lapse</span>
            <span className="text-muted-foreground">{year[0]}</span>
          </div>
          <Slider value={year} onValueChange={setYear} min={2015} max={2024} step={1} />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>2015</span><span>2024</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GeoIntelligence;

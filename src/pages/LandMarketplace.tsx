import HeroBanner from "@/components/HeroBanner";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useParcels } from "@/hooks/useData";
import { Search, MapPin, Ruler, IndianRupee, ShieldCheck, Phone, ArrowUpDown } from "lucide-react";
import { useState, useMemo } from "react";
import UPIPaymentDialog from "@/components/UPIPaymentDialog";

const riskBadge: Record<string, string> = {
  high: "bg-red-500 text-white hover:bg-red-500",
  moderate: "bg-orange-400 text-white hover:bg-orange-400",
  safe: "bg-green-500 text-white hover:bg-green-500",
};

// Simulated marketplace prices
const priceMap: Record<string, string> = {
  "SY-1042": "₹2.4 Cr",
  "SY-2201": "₹1.6 Cr",
  "SY-3310": "₹1.2 Cr",
  "SY-4105": "₹3.8 Cr",
  "SY-1108": "₹5.1 Cr",
  "SY-2305": "₹2.9 Cr",
};

const statusMap: Record<string, { label: string; color: string }> = {
  "SY-1042": { label: "Dispute", color: "bg-red-500 text-white hover:bg-red-500" },
  "SY-2201": { label: "Under Review", color: "bg-orange-400 text-white hover:bg-orange-400" },
  "SY-3310": { label: "Available", color: "bg-green-500 text-white hover:bg-green-500" },
  "SY-4105": { label: "Restricted", color: "bg-muted text-muted-foreground hover:bg-muted" },
  "SY-1108": { label: "Lease Available", color: "bg-blue-500 text-white hover:bg-blue-500" },
  "SY-2305": { label: "Under Review", color: "bg-orange-400 text-white hover:bg-orange-400" },
};

const LandMarketplace = () => {
  const { data: parcels, isLoading } = useParcels();
  const [search, setSearch] = useState("");
  const [district, setDistrict] = useState("all");
  const [sortBy, setSortBy] = useState("survey");
  const [paymentParcel, setPaymentParcel] = useState<{ id: string; name: string; price: string } | null>(null);

  const filtered = useMemo(() => {
    let records = parcels || [];
    if (district !== "all") records = records.filter((r) => r.district.toLowerCase() === district);
    if (search.trim()) {
      const q = search.toLowerCase();
      records = records.filter(
        (r) => r.survey_id.toLowerCase().includes(q) || r.location.toLowerCase().includes(q)
      );
    }
    if (sortBy === "extent") {
      records = [...records].sort((a, b) => parseFloat(b.extent) - parseFloat(a.extent));
    }
    return records;
  }, [parcels, search, district, sortBy]);

  return (
    <div className="min-h-screen bg-muted/30">
      <HeroBanner
        title="Land Marketplace"
        subtitle="Browse government land parcels available for lease, acquisition, or development across Tamil Nadu districts."
      />
      <div className="container mx-auto px-4 py-8 space-y-6">
        {/* Filters */}
        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-4 items-end">
              <div className="flex-1 min-w-[200px] space-y-2">
                <label className="text-sm font-medium">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Survey ID or location..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
              </div>
              <div className="w-44 space-y-2">
                <label className="text-sm font-medium">District</label>
                <Select value={district} onValueChange={setDistrict}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Districts</SelectItem>
                    <SelectItem value="chennai">Chennai</SelectItem>
                    <SelectItem value="coimbatore">Coimbatore</SelectItem>
                    <SelectItem value="madurai">Madurai</SelectItem>
                    <SelectItem value="trichy">Trichy</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="w-44 space-y-2">
                <label className="text-sm font-medium">Sort By</label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="survey">Survey ID</SelectItem>
                    <SelectItem value="extent">Extent (largest)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing <strong className="text-foreground">{filtered.length}</strong> parcels
          </p>
          <Button variant="outline" size="sm" onClick={() => setSortBy(sortBy === "survey" ? "extent" : "survey")}>
            <ArrowUpDown className="h-4 w-4 mr-1" /> Toggle Sort
          </Button>
        </div>

        {isLoading && <p className="text-center text-muted-foreground py-8">Loading parcels...</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((parcel) => {
            const price = priceMap[parcel.survey_id] || "₹ TBD";
            const status = statusMap[parcel.survey_id] || { label: "Available", color: "bg-green-500 text-white hover:bg-green-500" };

            return (
              <Card key={parcel.survey_id} className="border-0 shadow-md hover:shadow-lg transition-shadow">
                {/* Map preview */}
                <div className="h-40 overflow-hidden rounded-t-lg">
                  <iframe
                    title={parcel.survey_id}
                    src={`https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d3000!2d${parcel.lng || 78}!3d${parcel.lat || 11}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sin`}
                    width="100%" height="100%" style={{ border: 0, pointerEvents: "none" }} loading="lazy"
                  />
                </div>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{parcel.survey_id}</CardTitle>
                    <Badge className={status.color}>{status.label}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2 pb-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" /> {parcel.location}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Ruler className="h-4 w-4" /> {parcel.extent}
                  </div>
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <IndianRupee className="h-4 w-4" /> {price}
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                    <Badge className={riskBadge[parcel.risk] || ""} variant="secondary">{parcel.risk} risk</Badge>
                  </div>
                </CardContent>
                <CardFooter className="gap-2">
                  <Button size="sm" className="flex-1 bg-gradient-to-r from-[#0EA5E9] to-[#2563EB] hover:opacity-90">
                    <Phone className="h-4 w-4 mr-1" /> Enquire
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>

        {!isLoading && filtered.length === 0 && (
          <p className="text-center text-muted-foreground py-12">No parcels match your criteria.</p>
        )}
      </div>

      {paymentParcel && (
        <UPIPaymentDialog
          open={!!paymentParcel}
          onOpenChange={(open) => !open && setPaymentParcel(null)}
          parcelId={paymentParcel.id}
          parcelName={paymentParcel.name}
          price={paymentParcel.price}
        />
      )}
    </div>
  );
};

export default LandMarketplace;

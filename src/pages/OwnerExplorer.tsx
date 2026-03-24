import HeroBanner from "@/components/HeroBanner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useParcels } from "@/hooks/useData";
import { Search, User, MapPin, FileText, Eye } from "lucide-react";
import { useState, useMemo } from "react";

const riskBadge: Record<string, string> = {
  high: "bg-red-500 text-white hover:bg-red-500",
  moderate: "bg-orange-400 text-white hover:bg-orange-400",
  safe: "bg-green-500 text-white hover:bg-green-500",
};

const OwnerExplorer = () => {
  const { data: parcels, isLoading } = useParcels();
  const [search, setSearch] = useState("");
  const [riskFilter, setRiskFilter] = useState("all");
  const [selectedParcel, setSelectedParcel] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let records = parcels || [];
    if (search.trim()) {
      const q = search.toLowerCase();
      records = records.filter(
        (r) =>
          r.survey_id.toLowerCase().includes(q) ||
          r.owner.toLowerCase().includes(q) ||
          (r.land_owner || "").toLowerCase().includes(q) ||
          r.location.toLowerCase().includes(q)
      );
    }
    if (riskFilter !== "all") records = records.filter((r) => r.risk === riskFilter);
    return records;
  }, [parcels, search, riskFilter]);

  const selected = parcels?.find((p) => p.survey_id === selectedParcel);

  return (
    <div className="min-h-screen bg-muted/30">
      <HeroBanner
        title="Owner Explorer"
        subtitle="Search and explore land ownership records, verify parcel details, and view ownership history across Tamil Nadu."
      />
      <div className="container mx-auto px-4 py-8 space-y-6">
        {/* Search & Filters */}
        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex gap-4 items-end">
              <div className="flex-1 space-y-2">
                <label className="text-sm font-medium">Search Owner or Survey ID</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Enter owner name, survey ID, or location..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
              </div>
              <div className="w-48 space-y-2">
                <label className="text-sm font-medium">Risk Level</label>
                <Select value={riskFilter} onValueChange={setRiskFilter}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="high">High Risk</SelectItem>
                    <SelectItem value="moderate">Moderate</SelectItem>
                    <SelectItem value="safe">Safe</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Results Table */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-md">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="h-5 w-5 text-blue-600" />
                  Ownership Records ({filtered.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Survey ID</TableHead>
                      <TableHead>Owner</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Extent</TableHead>
                      <TableHead>Risk</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading && <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">Loading...</TableCell></TableRow>}
                    {!isLoading && filtered.length === 0 && <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No records found.</TableCell></TableRow>}
                    {filtered.map((r) => (
                      <TableRow key={r.survey_id} className={selectedParcel === r.survey_id ? "bg-blue-50" : ""}>
                        <TableCell className="font-medium">{r.survey_id}</TableCell>
                        <TableCell>{r.owner}</TableCell>
                        <TableCell>{r.location}</TableCell>
                        <TableCell>{r.extent}</TableCell>
                        <TableCell><Badge className={riskBadge[r.risk] || ""}>{r.risk}</Badge></TableCell>
                        <TableCell>
                          <Button size="sm" variant="outline" onClick={() => setSelectedParcel(r.survey_id)}>
                            <Eye className="h-3 w-3 mr-1" /> View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          {/* Detail Panel */}
          <div>
            <Card className="border-0 shadow-md sticky top-4">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  Parcel Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!selected ? (
                  <p className="text-sm text-muted-foreground text-center py-8">Select a parcel to view details</p>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold">{selected.survey_id}</span>
                      <Badge className={riskBadge[selected.risk] || ""}>{selected.risk}</Badge>
                    </div>
                    <div className="space-y-3">
                      {[
                        { label: "Location", value: selected.location },
                        { label: "District", value: selected.district },
                        { label: "Land Owner", value: selected.land_owner || selected.owner },
                        { label: "Building Owner", value: selected.building_owner || "N/A" },
                        { label: "Extent", value: selected.extent },
                        { label: "Details", value: selected.major_details || "N/A" },
                        { label: "Coordinates", value: selected.lat && selected.lng ? `${selected.lat}, ${selected.lng}` : "N/A" },
                      ].map((item) => (
                        <div key={item.label} className="flex justify-between text-sm border-b pb-2">
                          <span className="text-muted-foreground">{item.label}</span>
                          <span className="font-medium text-right max-w-[60%]">{item.value}</span>
                        </div>
                      ))}
                    </div>
                    {selected.lat && selected.lng && (
                      <div className="rounded-lg overflow-hidden border h-[200px]">
                        <iframe
                          title="Parcel Location"
                          src={`https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d5000!2d${selected.lng}!3d${selected.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sin`}
                          width="100%" height="100%" style={{ border: 0 }} loading="lazy"
                        />
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerExplorer;

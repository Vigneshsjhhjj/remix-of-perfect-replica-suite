import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useParcels } from "@/hooks/useData";
import { useState, useMemo, useCallback } from "react";
import { BookOpen, Search, Download } from "lucide-react";

const districts = ["All", "Chennai", "Coimbatore", "Madurai", "Trichy"];

const riskBadge: Record<string, string> = {
  high: "bg-red-500 text-white hover:bg-red-500",
  moderate: "bg-orange-400 text-white hover:bg-orange-400",
  safe: "bg-green-500 text-white hover:bg-green-500",
};

const LandRecordsTable = () => {
  const [district, setDistrict] = useState("All");
  const [search, setSearch] = useState("");
  const { data: parcels, isLoading } = useParcels();

  const filtered = useMemo(() => {
    let records = parcels || [];
    if (district !== "All") records = records.filter((r) => r.district === district);
    if (search.trim()) {
      const q = search.toLowerCase();
      records = records.filter(
        (r) =>
          r.survey_id.toLowerCase().includes(q) ||
          r.location.toLowerCase().includes(q) ||
          (r.land_owner || "").toLowerCase().includes(q) ||
          (r.building_owner || "").toLowerCase().includes(q)
      );
    }
    return records;
  }, [district, search, parcels]);

  const exportCSV = useCallback(() => {
    const headers = ["Survey", "Location", "Land Owner", "Building Owner", "Major Details", "Extent", "Risk", "District"];
    const rows = filtered.map((r) => [r.survey_id, r.location, r.land_owner || "", r.building_owner || "", r.major_details || "", r.extent, r.risk, r.district]);
    const csv = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `land-records-${district.toLowerCase()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [filtered, district]);

  return (
    <Card className="border-0 shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-blue-600" />
            Advanced Land Records Explorer
          </CardTitle>
          <Button size="sm" variant="outline" onClick={exportCSV}>
            <Download className="h-4 w-4 mr-1" /> Export CSV
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-3 items-center">
          <Tabs value={district} onValueChange={setDistrict}>
            <TabsList>
              {districts.map((d) => (
                <TabsTrigger key={d} value={d}>{d}</TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search records..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Survey</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Land Owner</TableHead>
              <TableHead>Building Owner</TableHead>
              <TableHead>Major Details</TableHead>
              <TableHead>Extent</TableHead>
              <TableHead>Risk</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && [1, 2, 3].map((i) => (
              <TableRow key={i}><TableCell colSpan={7}><Skeleton className="h-8 w-full" /></TableCell></TableRow>
            ))}
            {!isLoading && filtered.length === 0 && (
              <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-8">No records found.</TableCell></TableRow>
            )}
            {filtered.map((record) => (
              <TableRow key={record.survey_id}>
                <TableCell className="font-medium">{record.survey_id}</TableCell>
                <TableCell>{record.location}</TableCell>
                <TableCell>{record.land_owner}</TableCell>
                <TableCell>{record.building_owner}</TableCell>
                <TableCell>{record.major_details}</TableCell>
                <TableCell>{record.extent}</TableCell>
                <TableCell><Badge className={riskBadge[record.risk] || ""}>{record.risk}</Badge></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default LandRecordsTable;

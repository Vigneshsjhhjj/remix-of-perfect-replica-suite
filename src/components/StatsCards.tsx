import { MapPin, AlertTriangle, ClipboardCheck, FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useParcels, useAlerts } from "@/hooks/useData";

const StatsCards = () => {
  const { data: parcels } = useParcels();
  const { data: alerts } = useAlerts();

  const stats = [
    { label: "Government Parcels", value: parcels?.length ?? 0, icon: MapPin, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "High-Risk Encroachments", value: alerts?.filter((a) => a.severity === "high").length ?? 0, icon: AlertTriangle, color: "text-red-600", bg: "bg-red-50" },
    { label: "Inspections This Week", value: 27, icon: ClipboardCheck, color: "text-green-600", bg: "bg-green-50" },
    { label: "Legal Docs Synced", value: 412, icon: FileText, color: "text-purple-600", bg: "bg-purple-50" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.label} className="border-0 shadow-md">
            <CardContent className="p-5 flex items-center gap-4">
              <div className={`h-12 w-12 rounded-lg ${stat.bg} flex items-center justify-center`}>
                <Icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default StatsCards;

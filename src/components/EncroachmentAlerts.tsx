import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAlerts } from "@/hooks/useData";
import { AlertTriangle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const severityBadge: Record<string, string> = {
  high: "bg-red-500 text-white hover:bg-red-500",
  medium: "bg-orange-400 text-white hover:bg-orange-400",
};

const EncroachmentAlerts = () => {
  const { data: alerts, isLoading } = useAlerts();

  return (
    <Card className="border-0 shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-red-500" />
          Encroachment Alerts
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading && [1, 2, 3].map((i) => <Skeleton key={i} className="h-20 w-full" />)}
        {(alerts || []).map((alert) => (
          <div key={alert.alert_id} className="p-3 rounded-lg border bg-muted/50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-medium text-sm">{alert.title}</span>
              <Badge className={severityBadge[alert.severity] || ""}>{alert.severity}</Badge>
            </div>
            <p className="text-xs text-muted-foreground">{alert.description}</p>
            <p className="text-xs text-muted-foreground">{alert.alert_id} · {formatDistanceToNow(new Date(alert.created_at), { addSuffix: true })}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default EncroachmentAlerts;

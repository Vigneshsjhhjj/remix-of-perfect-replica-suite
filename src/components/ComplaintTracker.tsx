import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useComplaints } from "@/hooks/useData";
import { MessageSquareWarning } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const statusBadge: Record<string, string> = {
  new: "bg-blue-500 text-white hover:bg-blue-500",
  verified: "bg-green-500 text-white hover:bg-green-500",
  open: "bg-red-500 text-white hover:bg-red-500",
  resolved: "bg-muted text-muted-foreground hover:bg-muted",
};

const ComplaintTracker = () => {
  const { data: complaints, isLoading } = useComplaints();

  return (
    <Card className="border-0 shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <MessageSquareWarning className="h-5 w-5 text-orange-500" />
          Citizen Complaint Tracker
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading && [1, 2, 3].map((i) => <Skeleton key={i} className="h-20 w-full" />)}
        {(complaints || []).map((c) => (
          <div key={c.complaint_id} className="p-3 rounded-lg border bg-muted/50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-medium text-sm line-clamp-1">{c.description.substring(0, 50)}...</span>
              <Badge className={statusBadge[c.status] || ""}>{c.status}</Badge>
            </div>
            <p className="text-xs text-muted-foreground">{c.description}</p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>{c.complaint_id}</span>
              <span>·</span>
              <span>{c.location || c.district}</span>
              <span>·</span>
              <span>{formatDistanceToNow(new Date(c.created_at), { addSuffix: true })}</span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default ComplaintTracker;

import HeroBanner from "@/components/HeroBanner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useParcels, useAlerts, useComplaints } from "@/hooks/useData";
import {
  Smartphone, Satellite, BarChart3, ShieldCheck, Cpu,
  Activity, Users, Clock, CheckCircle, AlertTriangle, TrendingUp,
} from "lucide-react";

const OperationsHub = () => {
  const { data: parcels } = useParcels();
  const { data: alerts } = useAlerts();
  const { data: complaints } = useComplaints();

  const highRisk = alerts?.filter((a) => a.severity === "high").length ?? 0;
  const newComplaints = complaints?.filter((c) => c.status === "new").length ?? 0;

  const modules = [
    {
      title: "Mobile Field Sync",
      description: "Real-time data synchronization from field inspectors' mobile devices with offline capability.",
      icon: Smartphone,
      status: "active",
      uptime: 99.2,
    },
    {
      title: "Satellite Time-Lapse",
      description: "Historical satellite imagery comparison to detect unauthorized changes over time.",
      icon: Satellite,
      status: "active",
      uptime: 97.8,
    },
    {
      title: "Heatmap Overlays",
      description: "Density-based heatmap visualization of encroachment hotspots across districts.",
      icon: BarChart3,
      status: "active",
      uptime: 100,
    },
    {
      title: "Blockchain Hash Ledger",
      description: "Immutable record verification using blockchain-based document hashing for legal compliance.",
      icon: ShieldCheck,
      status: "active",
      uptime: 99.9,
    },
  ];

  const recentActivity = [
    { action: "Field inspection completed", location: "Anna Nagar, Chennai", time: "12 min ago", type: "inspection" },
    { action: "Satellite scan triggered", location: "RS Puram, Coimbatore", time: "28 min ago", type: "satellite" },
    { action: "Document hash verified", location: "KK Nagar, Madurai", time: "1 hr ago", type: "blockchain" },
    { action: "New encroachment alert", location: "Gandhipuram, Coimbatore", time: "2 hrs ago", type: "alert" },
    { action: "Complaint resolved", location: "Cantonment, Trichy", time: "3 hrs ago", type: "complaint" },
  ];

  return (
    <div className="min-h-screen bg-muted/30">
      <HeroBanner
        title="Operations Hub"
        subtitle="Monitor system health, manage field operations, and track real-time activity across all modules."
      />
      <div className="container mx-auto px-4 py-8 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Active Modules", value: 4, icon: Cpu, color: "text-blue-600", bg: "bg-blue-50" },
            { label: "High-Risk Alerts", value: highRisk, icon: AlertTriangle, color: "text-red-600", bg: "bg-red-50" },
            { label: "Pending Complaints", value: newComplaints, icon: Clock, color: "text-orange-600", bg: "bg-orange-50" },
            { label: "System Uptime", value: "99.7%", icon: TrendingUp, color: "text-green-600", bg: "bg-green-50" },
          ].map((stat) => (
            <Card key={stat.label} className="border-0 shadow-md">
              <CardContent className="p-5 flex items-center gap-4">
                <div className={`h-12 w-12 rounded-lg ${stat.bg} flex items-center justify-center`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* System Modules */}
          <Card className="border-0 shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Cpu className="h-5 w-5 text-blue-600" /> System Modules
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {modules.map((mod) => (
                <div key={mod.title} className="p-4 rounded-lg border bg-muted/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center">
                        <mod.icon className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{mod.title}</p>
                        <p className="text-xs text-muted-foreground">{mod.description}</p>
                      </div>
                    </div>
                    <Badge className="bg-green-500 text-white hover:bg-green-500">
                      <CheckCircle className="h-3 w-3 mr-1" /> Active
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Uptime</span>
                      <span className="font-medium">{mod.uptime}%</span>
                    </div>
                    <Progress value={mod.uptime} className="h-1.5" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="border-0 shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Activity className="h-5 w-5 text-blue-600" /> Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentActivity.map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg border bg-muted/50">
                  <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center shrink-0 mt-0.5">
                    <Activity className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{item.action}</p>
                    <p className="text-xs text-muted-foreground">{item.location}</p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">{item.time}</span>
                </div>
              ))}

              {/* District Overview */}
              <div className="pt-4 border-t mt-4">
                <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                  <Users className="h-4 w-4" /> District Overview
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  {["Chennai", "Coimbatore", "Madurai", "Trichy"].map((dist) => {
                    const count = (parcels || []).filter((p) => p.district === dist).length;
                    return (
                      <div key={dist} className="p-3 rounded-lg border bg-muted/50 text-center">
                        <p className="text-lg font-bold text-foreground">{count}</p>
                        <p className="text-xs text-muted-foreground">{dist}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OperationsHub;

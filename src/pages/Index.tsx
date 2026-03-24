import HeroBanner from "@/components/HeroBanner";
import StatsCards from "@/components/StatsCards";
import GeoIntelligence from "@/components/GeoIntelligence";
import ComplaintPortal from "@/components/ComplaintPortal";
import LandRecordsTable from "@/components/LandRecordsTable";
import OperationsPanel from "@/components/OperationsPanel";
import EncroachmentAlerts from "@/components/EncroachmentAlerts";
import ComplaintTracker from "@/components/ComplaintTracker";

const Index = () => {
  return (
    <div className="min-h-screen bg-muted/30">
      <HeroBanner />
      <div className="container mx-auto px-4 py-8 space-y-8">
        <StatsCards />

        {/* Geo Intelligence + Complaint Portal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <GeoIntelligence />
          </div>
          <div>
            <ComplaintPortal />
          </div>
        </div>

        {/* Land Records Table */}
        <LandRecordsTable />

        {/* Operations + Alerts + Complaints */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <OperationsPanel />
          <EncroachmentAlerts />
          <ComplaintTracker />
        </div>
      </div>
    </div>
  );
};

export default Index;

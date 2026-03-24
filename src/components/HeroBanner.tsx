import { Globe, MapPin, Settings, ShoppingBag, LogOut, Map } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface HeroBannerProps {
  title?: string;
  subtitle?: string;
}

const HeroBanner = ({
  title = "Secure Government Land Records Management with GIS Intelligence",
  subtitle = "Protecting public land assets across Tamil Nadu with real-time monitoring, satellite intelligence, and blockchain-verified documentation.",
}: HeroBannerProps) => {
  const location = useLocation();
  const { signOut } = useAuth();

  const navItems = [
    { to: "/land-division", label: "Land Division", icon: Map },
    { to: "/owner-explorer", label: "Owner Explorer", icon: MapPin },
    { to: "/operations-hub", label: "Operations Hub", icon: Settings },
    { to: "/land-marketplace", label: "Land Marketplace", icon: ShoppingBag },
  ];

  return (
    <div className="bg-gradient-to-r from-[#0EA5E9] to-[#2563EB] text-white">
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between py-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded bg-white/20 flex items-center justify-center">
              <MapPin className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold tracking-tight">LandGuard</span>
          </Link>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
              <Globe className="h-4 w-4 mr-1" /> English
            </Button>
            {navItems.map((item) => (
              <Button
                key={item.to}
                variant="ghost"
                size="sm"
                className={`text-white hover:bg-white/20 ${location.pathname === item.to ? "bg-white/20" : ""}`}
                asChild
              >
                <Link to={item.to}>
                  <item.icon className="h-4 w-4 mr-1" /> {item.label}
                </Link>
              </Button>
            ))}
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/20" onClick={() => signOut()}>
              <LogOut className="h-4 w-4 mr-1" /> Sign out
            </Button>
          </div>
        </nav>
        <div className="py-12 text-center max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{title}</h1>
          <p className="text-white/80 text-lg">{subtitle}</p>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;

export const statsData = [
  { label: "Government Parcels", value: 4, icon: "MapPin", color: "text-blue-600", bg: "bg-blue-50" },
  { label: "High-Risk Encroachments", value: 2, icon: "AlertTriangle", color: "text-red-600", bg: "bg-red-50" },
  { label: "Inspections This Week", value: 27, icon: "ClipboardCheck", color: "text-green-600", bg: "bg-green-50" },
  { label: "Legal Docs Synced", value: 412, icon: "FileText", color: "text-purple-600", bg: "bg-purple-50" },
];

export const parcelRecords = [
  {
    id: "SY-1042",
    location: "Anna Nagar, Chennai",
    owner: "Tamil Nadu PWD",
    extent: "2.4 acres",
    risk: "high" as const,
    lat: 13.085,
    lng: 80.2101,
  },
  {
    id: "SY-2201",
    location: "RS Puram, Coimbatore",
    owner: "Revenue Dept.",
    extent: "1.8 acres",
    risk: "moderate" as const,
    lat: 11.0168,
    lng: 76.9558,
  },
  {
    id: "SY-3310",
    location: "KK Nagar, Madurai",
    owner: "Municipal Corp.",
    extent: "3.1 acres",
    risk: "safe" as const,
    lat: 9.9252,
    lng: 78.1198,
  },
  {
    id: "SY-4105",
    location: "Cantonment, Trichy",
    owner: "Defence Ministry",
    extent: "5.6 acres",
    risk: "safe" as const,
    lat: 10.7905,
    lng: 78.7047,
  },
];

export const landRecords = [
  {
    survey: "SY-1042",
    location: "Anna Nagar, Chennai",
    landOwner: "Tamil Nadu PWD",
    buildingOwner: "Unauthorized Structure",
    majorDetails: "Commercial encroachment detected",
    extent: "2.4 acres",
    risk: "high" as const,
    district: "Chennai",
  },
  {
    survey: "SY-2201",
    location: "RS Puram, Coimbatore",
    landOwner: "Revenue Dept.",
    buildingOwner: "Private Party",
    majorDetails: "Boundary dispute pending",
    extent: "1.8 acres",
    risk: "moderate" as const,
    district: "Coimbatore",
  },
  {
    survey: "SY-3310",
    location: "KK Nagar, Madurai",
    landOwner: "Municipal Corp.",
    buildingOwner: "Govt. School",
    majorDetails: "No disputes reported",
    extent: "3.1 acres",
    risk: "safe" as const,
    district: "Madurai",
  },
  {
    survey: "SY-4105",
    location: "Cantonment, Trichy",
    landOwner: "Defence Ministry",
    buildingOwner: "Military Quarters",
    majorDetails: "Restricted zone — verified",
    extent: "5.6 acres",
    risk: "safe" as const,
    district: "Trichy",
  },
  {
    survey: "SY-1108",
    location: "T. Nagar, Chennai",
    landOwner: "Revenue Dept.",
    buildingOwner: "Shopping Complex",
    majorDetails: "Lease renewal pending",
    extent: "0.9 acres",
    risk: "moderate" as const,
    district: "Chennai",
  },
  {
    survey: "SY-2305",
    location: "Gandhipuram, Coimbatore",
    landOwner: "Tamil Nadu PWD",
    buildingOwner: "Bus Terminal",
    majorDetails: "Partial encroachment on west side",
    extent: "4.2 acres",
    risk: "high" as const,
    district: "Coimbatore",
  },
];

export const encroachmentAlerts = [
  {
    id: "EA-401",
    severity: "high" as const,
    title: "Unauthorized Construction — Anna Nagar",
    description: "Multi-story commercial building erected on government land parcel SY-1042 without valid permits.",
    timestamp: "2 hours ago",
  },
  {
    id: "EA-398",
    severity: "medium" as const,
    title: "Boundary Violation — RS Puram",
    description: "Adjacent property owner has extended boundary wall 12 feet into government parcel SY-2201.",
    timestamp: "5 hours ago",
  },
  {
    id: "EA-395",
    severity: "high" as const,
    title: "Illegal Land Fill — Gandhipuram",
    description: "Unauthorized land filling activity detected on wetland area near parcel SY-2305.",
    timestamp: "1 day ago",
  },
];

export const complaints = [
  {
    id: "CR-1082",
    status: "new" as const,
    title: "Suspected encroachment on lake bed",
    description: "Resident reports construction activity on what appears to be a protected lake bed area near Porur.",
    location: "Porur, Chennai",
    timestamp: "3 hours ago",
  },
  {
    id: "CR-1075",
    status: "verified" as const,
    title: "Illegal sand mining near river bank",
    description: "Multiple reports of unauthorized sand mining operations near Kaveri river bank in Trichy district.",
    location: "Kaveri Bank, Trichy",
    timestamp: "1 day ago",
  },
  {
    id: "CR-1068",
    status: "new" as const,
    title: "Government land used as parking lot",
    description: "A government-owned vacant plot is being used as a commercial parking lot without authorization.",
    location: "KK Nagar, Madurai",
    timestamp: "2 days ago",
  },
];

export const districts = ["All", "Chennai", "Coimbatore", "Madurai", "Trichy"];

export const operationsFeatures = [
  {
    title: "Mobile Field Sync",
    description: "Real-time data synchronization from field inspectors' mobile devices with offline capability.",
  },
  {
    title: "Satellite Time-Lapse",
    description: "Historical satellite imagery comparison to detect unauthorized changes over time.",
  },
  {
    title: "Heatmap Overlays",
    description: "Density-based heatmap visualization of encroachment hotspots across districts.",
  },
  {
    title: "Blockchain Hash Ledger",
    description: "Immutable record verification using blockchain-based document hashing for legal compliance.",
  },
];

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  MapPin,
  Filter,
  Layers,
  AlertCircle,
  CheckCircle,
  Clock,
  Navigation,
  Camera,
} from "lucide-react";

// Dummy map data
const dummyMapData = [
  {
    id: 1,
    type: "issue",
    title: "Pothole on Main Street",
    status: "In Progress",
    category: "Road & Transportation",
    coordinates: { lat: 40.7128, lng: -74.006 },
    priority: "high",
    reportedDate: "2024-01-15",
  },
  {
    id: 2,
    type: "issue",
    title: "Broken Street Light",
    status: "Resolved",
    category: "Street Lighting",
    coordinates: { lat: 40.7589, lng: -73.9851 },
    priority: "medium",
    reportedDate: "2024-01-10",
  },
  {
    id: 3,
    type: "issue",
    title: "Overflowing Garbage Bin",
    status: "Pending",
    category: "Sanitation & Waste",
    coordinates: { lat: 40.7505, lng: -73.9934 },
    priority: "medium",
    reportedDate: "2024-01-20",
  },
  {
    id: 4,
    type: "proposal",
    title: "New Community Park",
    status: "Active",
    category: "Parks & Recreation",
    coordinates: { lat: 40.7614, lng: -73.9776 },
    votes: { yes: 892, no: 355 },
    deadline: "2024-02-15",
  },
];

export default function MapPage() {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedLayer, setSelectedLayer] = useState("all");
  const [selectedItem, setSelectedItem] = useState(null);

  const getStatusColor = (status) => {
    switch (status) {
      case "Resolved":
        return "bg-green-100 text-green-800";
      case "In Progress":
        return "bg-blue-100 text-blue-800";
      case "Assigned":
        return "bg-purple-100 text-purple-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Active":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const getMarkerIcon = (item) => {
    if (item.type === "proposal") return <Navigation className="h-4 w-4" />;

    switch (item.status) {
      case "Resolved":
        return <CheckCircle className="h-4 w-4" />;
      case "In Progress":
        return <Clock className="h-4 w-4" />;
      case "Assigned":
        return <Clock className="h-4 w-4" />;
      case "Pending":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <MapPin className="h-4 w-4" />;
    }
  };

  const filteredData = dummyMapData.filter((item) => {
    if (selectedLayer === "issues" && item.type !== "issue") return false;
    if (selectedLayer === "proposals" && item.type !== "proposal") return false;
    if (selectedFilter === "all") return true;
    if (item.type === "issue") return item.status === selectedFilter;
    if (item.type === "proposal") return item.status === selectedFilter;
    return true;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">City Map</h1>
        <p className="text-muted-foreground">
          Explore issues and proposals across the city.
        </p>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Interactive City Map</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Camera className="h-4 w-4 mr-2" />
            AR View
          </Button>
          <Badge variant="outline">
            {filteredData.length} item{filteredData.length !== 1 ? "s" : ""}{" "}
            shown
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Map Controls */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layers className="h-5 w-5" />
                Map Layers
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Select value={selectedLayer} onValueChange={setSelectedLayer}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Items</SelectItem>
                  <SelectItem value="issues">Issues Only</SelectItem>
                  <SelectItem value="proposals">Proposals Only</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Assigned">Assigned</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Resolved">Resolved</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Legend */}
          <Card>
            <CardHeader>
              <CardTitle>Legend</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full" />
                  <span className="text-sm">High Priority</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                  <span className="text-sm">Medium Priority</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                  <span className="text-sm">Low Priority</span>
                </div>
                <div className="flex items-center gap-2">
                  <Navigation className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">Proposals</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Map Area */}
        <div className="lg:col-span-3">
          <Card className="h-[600px]">
            <CardHeader>
              <CardTitle>City Overview Map</CardTitle>
              <CardDescription>
                Click on markers to view details. Use AR view for enhanced
                mobile experience.
              </CardDescription>
            </CardHeader>
            <CardContent className="h-full">
              {/* Placeholder Map - In real implementation, this would be an actual map component */}
              <div className="relative w-full h-full bg-gray-100 rounded-lg overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50">
                  {/* Simulated map background */}
                  <div className="absolute inset-0 opacity-20">
                    <svg className="w-full h-full" viewBox="0 0 400 300">
                      {/* Street grid */}
                      <defs>
                        <pattern
                          id="grid"
                          width="40"
                          height="40"
                          patternUnits="userSpaceOnUse"
                        >
                          <path
                            d="M 40 0 L 0 0 0 40"
                            fill="none"
                            stroke="#ccc"
                            strokeWidth="1"
                          />
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill="url(#grid)" />
                    </svg>
                  </div>

                  {/* Map markers */}
                  {filteredData.map((item, index) => (
                    <div
                      key={item.id}
                      className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 hover:scale-110 transition-transform"
                      style={{
                        left: `${20 + ((index * 15) % 60)}%`,
                        top: `${20 + ((index * 20) % 60)}%`,
                      }}
                      onClick={() => setSelectedItem(item)}
                    >
                      <div className="relative">
                        <div
                          className={`w-6 h-6 rounded-full ${getPriorityColor(
                            item.priority
                          )} flex items-center justify-center text-white shadow-lg`}
                        >
                          {getMarkerIcon(item)}
                        </div>
                        {item.type === "proposal" && (
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-600 rounded-full border-2 border-white" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Map placeholder text */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <MapPin className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p className="text-lg font-medium">Interactive City Map</p>
                    <p className="text-sm">Click markers to view details</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Selected Item Details */}
      {selectedItem && (
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  {getMarkerIcon(selectedItem)}
                  {selectedItem.title}
                </CardTitle>
                <CardDescription>
                  {selectedItem.type === "issue" ? "Issue" : "Proposal"} •{" "}
                  {selectedItem.category}
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Badge className={getStatusColor(selectedItem.status)}>
                  {selectedItem.status}
                </Badge>
                {selectedItem.priority && (
                  <Badge
                    className={`text-white ${getPriorityColor(
                      selectedItem.priority
                    )}`}
                  >
                    {selectedItem.priority} priority
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Location
                </label>
                <p className="text-sm">
                  {selectedItem.coordinates.lat.toFixed(4)},{" "}
                  {selectedItem.coordinates.lng.toFixed(4)}
                </p>
              </div>
              {selectedItem.reportedDate && (
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Reported Date
                  </label>
                  <p className="text-sm">
                    {formatDate(selectedItem.reportedDate)}
                  </p>
                </div>
              )}
              {selectedItem.votes && (
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Votes
                  </label>
                  <p className="text-sm">
                    {selectedItem.votes.yes} Yes, {selectedItem.votes.no} No
                  </p>
                </div>
              )}
            </div>
            <div className="mt-4 flex gap-2">
              <Button size="sm">View Details</Button>
              <Button variant="outline" size="sm">
                <Navigation className="h-4 w-4 mr-2" />
                Get Directions
              </Button>
              {selectedItem.type === "issue" && (
                <Button variant="outline" size="sm">
                  <Camera className="h-4 w-4 mr-2" />
                  Report Similar
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

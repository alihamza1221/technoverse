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
import { Input } from "../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Search,
  Filter,
  MapPin,
  Calendar,
  MessageSquare,
  Star,
  AlertCircle,
  Clock,
  CheckCircle,
  User,
} from "lucide-react";

// Dummy data for user's reported issues
const dummyIssues = [
  {
    id: "ISS-001234",
    title: "Large pothole on Main Street",
    category: "Road & Transportation",
    priority: "high",
    status: "In Progress",
    location: "Main Street, near City Hall",
    reportedDate: "2024-01-15",
    lastUpdate: "2024-01-18",
    assignedTo: "Transportation Department",
    description: "Deep pothole causing damage to vehicles",
    updates: [
      {
        date: "2024-01-18",
        message: "Work crew assigned, repair scheduled for next week",
        author: "Transport Dept",
      },
      {
        date: "2024-01-16",
        message: "Issue verified and prioritized",
        author: "Field Inspector",
      },
      {
        date: "2024-01-15",
        message: "Issue reported by citizen",
        author: "System",
      },
    ],
  },
  {
    id: "ISS-001235",
    title: "Broken street light",
    category: "Street Lighting",
    priority: "medium",
    status: "Resolved",
    location: "Oak Avenue & 5th Street",
    reportedDate: "2024-01-10",
    lastUpdate: "2024-01-14",
    assignedTo: "Electrical Department",
    description: "Street light not working, area is dark at night",
    updates: [
      {
        date: "2024-01-14",
        message: "Light bulb replaced and tested. Issue resolved.",
        author: "Electrical Dept",
      },
      {
        date: "2024-01-12",
        message: "Technician dispatched for inspection",
        author: "Electrical Dept",
      },
      {
        date: "2024-01-10",
        message: "Issue reported by citizen",
        author: "System",
      },
    ],
  },
  {
    id: "ISS-001236",
    title: "Overflowing garbage bin",
    category: "Sanitation & Waste",
    priority: "medium",
    status: "Pending",
    location: "Central Park entrance",
    reportedDate: "2024-01-20",
    lastUpdate: "2024-01-20",
    assignedTo: "Sanitation Department",
    description: "Garbage bin is overflowing, attracting pests",
    updates: [
      {
        date: "2024-01-20",
        message: "Issue reported by citizen",
        author: "System",
      },
    ],
  },
];

export default function MyIssuesPage() {
  const [issues] = useState(dummyIssues);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedIssue, setSelectedIssue] = useState(null);

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
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Resolved":
        return <CheckCircle className="h-4 w-4" />;
      case "In Progress":
        return <Clock className="h-4 w-4" />;
      case "Assigned":
        return <User className="h-4 w-4" />;
      case "Pending":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const filteredIssues = issues.filter((issue) => {
    const matchesSearch =
      issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || issue.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (selectedIssue) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => setSelectedIssue(null)}>
            ← Back to Issues
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Issue Details</h1>
            <p className="text-muted-foreground">
              View detailed information and updates for this issue.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Issue Details */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">
                      {selectedIssue.title}
                    </CardTitle>
                    <CardDescription className="mt-2">
                      ID: {selectedIssue.id}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Badge className={getStatusColor(selectedIssue.status)}>
                      {getStatusIcon(selectedIssue.status)}
                      {selectedIssue.status}
                    </Badge>
                    <Badge className={getPriorityColor(selectedIssue.priority)}>
                      {selectedIssue.priority} priority
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Description</h4>
                  <p className="text-gray-600">{selectedIssue.description}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{selectedIssue.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">
                      Reported: {formatDate(selectedIssue.reportedDate)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Updates Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Updates & Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {selectedIssue.updates.map((update, index) => (
                    <div
                      key={index}
                      className="flex gap-4 pb-4 border-b last:border-b-0"
                    >
                      <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">
                            {update.author}
                          </span>
                          <span className="text-xs text-gray-500">
                            {formatDate(update.date)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          {update.message}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Issue Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Category
                  </label>
                  <p className="text-sm">{selectedIssue.category}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Assigned To
                  </label>
                  <p className="text-sm">{selectedIssue.assignedTo}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Last Updated
                  </label>
                  <p className="text-sm">
                    {formatDate(selectedIssue.lastUpdate)}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Provide Feedback</CardTitle>
                <CardDescription>
                  Rate the resolution quality (available when resolved)
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedIssue.status === "Resolved" ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className="h-5 w-5 text-gray-300 hover:text-yellow-400 cursor-pointer"
                        />
                      ))}
                    </div>
                    <Button className="w-full">Submit Feedback</Button>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">
                    Feedback will be available once the issue is resolved.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">My Issues</h1>
        <p className="text-muted-foreground">
          Track the status of issues you've reported.
        </p>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Reported Issues</h2>
        <Badge variant="outline">
          {filteredIssues.length} issue{filteredIssues.length !== 1 ? "s" : ""}
        </Badge>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search issues..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Assigned">Assigned</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Issues List */}
      <div className="space-y-4">
        {filteredIssues.map((issue) => (
          <Card
            key={issue.id}
            className="hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => setSelectedIssue(issue)}
          >
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-lg">{issue.title}</h3>
                    <Badge className={getStatusColor(issue.status)}>
                      {getStatusIcon(issue.status)}
                      {issue.status}
                    </Badge>
                    <Badge className={getPriorityColor(issue.priority)}>
                      {issue.priority}
                    </Badge>
                  </div>

                  <p className="text-gray-600 mb-3 line-clamp-2">
                    {issue.description}
                  </p>

                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {issue.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {formatDate(issue.reportedDate)}
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {issue.assignedTo}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-sm font-medium">{issue.id}</p>
                  <p className="text-xs text-gray-500">
                    Last updated: {formatDate(issue.lastUpdate)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredIssues.length === 0 && (
        <Card>
          <CardContent className="pt-6 text-center">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No issues found
            </h3>
            <p className="text-gray-600">
              {searchTerm || statusFilter !== "all"
                ? "Try adjusting your search or filter criteria."
                : "You haven't reported any issues yet. Click 'Report Issue' to get started."}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";

import { Progress } from "../components/ui/progress";
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
  ArrowLeft,
  BarChart3,
  Activity,
  Plus,
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
    progress: 65,
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
    progress: 100,
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
    progress: 10,
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

  const getStatusBg = (status) => {
    switch (status) {
      case "Resolved":
        return "bg-green-500";
      case "In Progress":
        return "bg-blue-500";
      case "Assigned":
        return "bg-purple-500";
      case "Pending":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
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
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 p-8 text-white">
          <div className="relative z-10 flex items-center gap-4">
            <Button
              variant="secondary"
              onClick={() => setSelectedIssue(null)}
              className="shadow-md hover:shadow-lg"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Issues
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Issue Details
              </h1>
              <p className="text-blue-100">
                View detailed information and updates for this issue.
              </p>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Issue Details */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-0 shadow-lg overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b">
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
              <CardContent className="space-y-6 pt-6">
                <div>
                  <h4 className="font-medium mb-2 text-gray-700">
                    Description
                  </h4>
                  <p className="text-gray-600 bg-gray-50 p-4 rounded-lg border border-gray-100">
                    {selectedIssue.description}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <MapPin className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">{selectedIssue.location}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <Calendar className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">
                      Reported: {formatDate(selectedIssue.reportedDate)}
                    </span>
                  </div>
                </div>

                <div className="pt-2">
                  <h4 className="font-medium mb-2 text-gray-700 flex items-center">
                    <BarChart3 className="h-4 w-4 mr-2 text-blue-500" />
                    Progress
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        Status: {selectedIssue.status}
                      </span>
                      <span className="font-medium">
                        {selectedIssue.progress}%
                      </span>
                    </div>
                    <Progress value={selectedIssue.progress} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Updates Timeline */}
            <Card className="border-0 shadow-lg overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b">
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-blue-500" />
                  Updates & Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {selectedIssue.updates.map((update, index) => (
                    <div
                      key={index}
                      className="flex gap-4 pb-4 border-b last:border-b-0"
                    >
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                          {index === 0 ? (
                            <Clock className="h-5 w-5 text-blue-600" />
                          ) : index === selectedIssue.updates.length - 1 ? (
                            <AlertCircle className="h-5 w-5 text-blue-600" />
                          ) : (
                            <Activity className="h-5 w-5 text-blue-600" />
                          )}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-gray-900">
                            {update.author}
                          </span>
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                            {formatDate(update.date)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
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
            <Card className="border-0 shadow-lg overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b">
                <CardTitle className="text-lg">Issue Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <label className="text-sm font-medium text-gray-500">
                    Category
                  </label>
                  <p className="text-sm font-medium">
                    {selectedIssue.category}
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <label className="text-sm font-medium text-gray-500">
                    Assigned To
                  </label>
                  <p className="text-sm font-medium">
                    {selectedIssue.assignedTo}
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <label className="text-sm font-medium text-gray-500">
                    Last Updated
                  </label>
                  <p className="text-sm font-medium">
                    {formatDate(selectedIssue.lastUpdate)}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b">
                <CardTitle className="text-lg">Provide Feedback</CardTitle>
                <CardDescription>
                  Rate the resolution quality (available when resolved)
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                {selectedIssue.status === "Resolved" ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className="h-8 w-8 text-gray-300 hover:text-yellow-400 cursor-pointer transition-colors"
                        />
                      ))}
                    </div>
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg">
                      Submit Feedback
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Clock className="h-8 w-8 text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-500">
                      Feedback will be available once the issue is resolved.
                    </p>
                  </div>
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
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 p-8 text-white">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">My Issues</h1>
          <p className="text-blue-100 text-lg">
            Track the status of issues you've reported.
          </p>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24" />
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Reported Issues</h2>
        <Badge
          variant="outline"
          className="bg-blue-50 text-blue-700 border-blue-200 px-3 py-1"
        >
          {filteredIssues.length} issue{filteredIssues.length !== 1 ? "s" : ""}
        </Badge>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-lg overflow-hidden">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search issues..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500 shadow-sm"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40 border-gray-300 focus:border-blue-500 focus:ring-blue-500 shadow-sm">
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
            className="hover:shadow-xl transition-all duration-300 cursor-pointer border-0 shadow-md transform hover:scale-[1.01]"
            onClick={() => setSelectedIssue(issue)}
          >
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className={`w-2 h-10 rounded-full ${getStatusBg(
                        issue.status
                      )}`}
                    ></div>
                    <div>
                      <h3 className="font-semibold text-lg">{issue.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={getStatusColor(issue.status)}>
                          {getStatusIcon(issue.status)}
                          {issue.status}
                        </Badge>
                        <Badge className={getPriorityColor(issue.priority)}>
                          {issue.priority}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-3 line-clamp-2 pl-5">
                    {issue.description}
                  </p>

                  <div className="flex items-center gap-4 text-sm text-gray-500 pl-5">
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

                  <div className="mt-4 pl-5 pr-20">
                    <div className="flex justify-between text-xs mb-1">
                      <span>Progress</span>
                      <span>{issue.progress}%</span>
                    </div>
                    <Progress value={issue.progress} className="h-1.5" />
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-sm font-medium bg-gray-100 px-3 py-1 rounded-full inline-block">
                    {issue.id}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Last updated: {formatDate(issue.lastUpdate)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredIssues.length === 0 && (
        <Card className="border-0 shadow-lg overflow-hidden">
          <CardContent className="pt-6 text-center py-12">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No issues found
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              {searchTerm || statusFilter !== "all"
                ? "Try adjusting your search or filter criteria."
                : "You haven't reported any issues yet. Click 'Report Issue' to get started."}
            </p>
            {!(searchTerm || statusFilter !== "all") && (
              <Button
                className="mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg"
                onClick={() => (window.location.href = "/report")}
              >
                <Plus className="h-4 w-4 mr-2" />
                Report New Issue
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

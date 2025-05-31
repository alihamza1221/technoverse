// Home component placeholder
import { UserDataContext } from "../context/UserContext";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
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
  MapPin,
  Plus,
  AlertCircle,
  CheckCircle,
  Clock,
  Vote,
  TrendingUp,
} from "lucide-react";

// Dummy data
const dummyStats = {
  totalIssues: 12,
  resolvedIssues: 8,
  pendingIssues: 4,
  avgResolutionTime: "3.2 days",
};

const dummyRecentActivity = [
  {
    id: 1,
    type: "issue_update",
    title: "Pothole on Main Street",
    status: "In Progress",
    timestamp: "2 hours ago",
  },
  {
    id: 2,
    type: "proposal_new",
    title: "New Park Development Proposal",
    timestamp: "1 day ago",
  },
  {
    id: 3,
    type: "issue_resolved",
    title: "Broken Street Light",
    status: "Resolved",
    timestamp: "2 days ago",
  },
];

export default function Home() {
  const { user } = useContext(UserDataContext);
  const navigate = useNavigate();

  const getStatusColor = (status) => {
    switch (status) {
      case "Resolved":
        return "bg-green-100 text-green-800";
      case "In Progress":
        return "bg-blue-100 text-blue-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case "issue_update":
        return <Clock className="h-4 w-4" />;
      case "issue_resolved":
        return <CheckCircle className="h-4 w-4" />;
      case "proposal_new":
        return <Vote className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Dashboard Overview
        </h1>
        <p className="text-muted-foreground">
          Welcome back, {user?.name}! Monitor issues and participate in
          community decisions.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Issues Reported
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dummyStats.totalIssues}</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Resolved Issues
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dummyStats.resolvedIssues}
            </div>
            <p className="text-xs text-muted-foreground">
              {Math.round(
                (dummyStats.resolvedIssues / dummyStats.totalIssues) * 100
              )}
              % resolution rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Issues
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dummyStats.pendingIssues}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting department action
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg Resolution Time
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dummyStats.avgResolutionTime}
            </div>
            <p className="text-xs text-muted-foreground">
              -0.5 days from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks you can perform</CardDescription>
        </CardHeader>
        <CardContent>
          {" "}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              onClick={() => navigate("/report")}
              className="h-20 flex flex-col items-center justify-center space-y-2"
            >
              <Plus className="h-6 w-6" />
              <span>Report New Issue</span>
            </Button>

            <Button
              variant="outline"
              onClick={() => navigate("/proposals")}
              className="h-20 flex flex-col items-center justify-center space-y-2"
            >
              <Vote className="h-6 w-6" />
              <span>View Proposals</span>
            </Button>

            <Button
              variant="outline"
              onClick={() => navigate("/map")}
              className="h-20 flex flex-col items-center justify-center space-y-2"
            >
              <MapPin className="h-6 w-6" />
              <span>Explore City Map</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Latest updates on your issues and city proposals
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dummyRecentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center space-x-4 p-3 rounded-lg border"
              >
                <div className="flex-shrink-0">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {activity.title}
                  </p>
                  <p className="text-sm text-gray-500">{activity.timestamp}</p>
                </div>
                {activity.status && (
                  <Badge className={getStatusColor(activity.status)}>
                    {activity.status}
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

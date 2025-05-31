// Home component placeholder
import { UserDataContext } from "../context/UserContext";
import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
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
import {
  MapPin,
  Plus,
  AlertCircle,
  CheckCircle,
  Clock,
  Vote,
  TrendingUp,
  TrendingDown,
  Users,
  Target,
  Zap,
  Award,
  Activity,
} from "lucide-react";

// Enhanced dummy data with more metrics
const dashboardData = {
  stats: {
    totalIssues: 12,
    resolvedIssues: 8,
    pendingIssues: 4,
    avgResolutionTime: "3.2 days",
    resolutionRate: 67,
    citizenSatisfaction: 4.2,
    activeProposals: 3,
    totalVotes: 1247,
  },
  trends: {
    issuesThisMonth: [2, 4, 3, 6, 8, 5, 7, 9, 6, 4, 3, 2],
    resolutionTimes: [4.2, 3.8, 3.5, 3.2, 2.9, 3.1, 3.2],
    categories: [
      { name: "Road & Transportation", count: 5, trend: 12 },
      { name: "Street Lighting", count: 3, trend: -8 },
      { name: "Sanitation & Waste", count: 2, trend: 5 },
      { name: "Public Safety", count: 2, trend: -15 },
    ],
  },
  recentActivity: [
    {
      id: 1,
      type: "issue_update",
      title: "Pothole on Main Street",
      status: "In Progress",
      timestamp: "2 hours ago",
      priority: "high",
    },
    {
      id: 2,
      type: "proposal_new",
      title: "New Park Development Proposal",
      timestamp: "1 day ago",
      votes: 234,
    },
    {
      id: 3,
      type: "issue_resolved",
      title: "Broken Street Light",
      status: "Resolved",
      timestamp: "2 days ago",
      rating: 5,
    },
  ],
};

// Mini Chart Components
const MiniLineChart = ({ data, color = "blue" }) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  useEffect(() => {
    //call axios get req stats
  }, []);
  return (
    <div className="flex items-end h-12 gap-1">
      {data.map((value, index) => (
        <div
          key={index}
          className={`bg-${color}-500 rounded-t-sm transition-all duration-300 hover:bg-${color}-600`}
          style={{
            height: `${((value - min) / range) * 100}%`,
            minHeight: "4px",
            width: "100%",
          }}
        />
      ))}
    </div>
  );
};

const CircularProgress = ({
  value,
  max,
  size = 120,
  strokeWidth = 8,
  color = "blue",
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / max) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-gray-200"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={`text-${color}-500 transition-all duration-1000 ease-out`}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl font-bold">
          {Math.round((value / max) * 100)}%
        </span>
      </div>
    </div>
  );
};

const AnimatedCounter = ({ value, suffix = "", duration = 2000 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = Number.parseInt(value);
    if (start === end) return;

    const totalMilSecDur = duration;
    const incrementTime = (totalMilSecDur / end) * 1;

    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start === end) clearInterval(timer);
    }, incrementTime);

    return () => clearInterval(timer);
  }, [value, duration]);

  return (
    <span>
      {count}
      {suffix}
    </span>
  );
};

// ...existing code...
export default function Home() {
  const { user } = useContext(UserDataContext);
  const navigate = useNavigate();

  // Add state for user stats
  const [userStats, setUserStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Call axios get req stats
    const fetchUserStats = async () => {
      if (!user) return; // Don't fetch if user is not available

      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/users/stats`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        setUserStats(response.data);
        //set stats
        dashboardData.stats = response.data?.data;
        console.log("User stats fetched:", response.data);
      } catch (error) {
        console.error("Error fetching user stats:", error);
        setError(error.response?.data?.message || "Failed to fetch user stats");
      } finally {
        setLoading(false);
      }
    };

    fetchUserStats();
  }, [user]);
  // ...existing code...

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

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "border-l-red-500";
      case "medium":
        return "border-l-yellow-500";
      case "low":
        return "border-l-green-500";
      default:
        return "border-l-gray-300";
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 p-8 text-white">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-blue-100 text-lg">
            Your civic engagement is making a difference. Here's what's
            happening in your city.
          </p>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24" />
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Issues */}
        <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700">
              Total Issues
            </CardTitle>
            <div className="p-2 bg-blue-500 rounded-lg">
              <AlertCircle className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-900 mb-1">
              <AnimatedCounter value={dashboardData.stats.totalIssues} />
            </div>
            <div className="flex items-center text-xs text-blue-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +2 from last month
            </div>
            <div className="mt-3">
              <MiniLineChart
                data={dashboardData.trends.issuesThisMonth}
                color="blue"
              />
            </div>
          </CardContent>
        </Card>

        {/* Resolution Rate */}
        <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700">
              Resolution Rate
            </CardTitle>
            <div className="p-2 bg-green-500 rounded-lg">
              <Target className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-900 mb-1">
              <AnimatedCounter
                value={dashboardData.stats.resolutionRate}
                suffix="%"
              />
            </div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +5% improvement
            </div>
            <div className="mt-3">
              <Progress
                value={dashboardData.stats.resolutionRate}
                className="h-2"
              />
            </div>
          </CardContent>
        </Card>

        {/* Avg Resolution Time */}
        <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-700">
              Avg Resolution
            </CardTitle>
            <div className="p-2 bg-purple-500 rounded-lg">
              <Zap className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-900 mb-1">
              {dashboardData.stats.avgResolutionTime}
            </div>
            <div className="flex items-center text-xs text-purple-600">
              <TrendingDown className="h-3 w-3 mr-1" />
              -0.5 days faster
            </div>
            <div className="mt-3">
              <MiniLineChart
                data={dashboardData.trends.resolutionTimes}
                color="purple"
              />
            </div>
          </CardContent>
        </Card>

        {/* Satisfaction Score */}
        <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-700">
              Satisfaction
            </CardTitle>
            <div className="p-2 bg-orange-500 rounded-lg">
              <Award className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-900 mb-1">
              {dashboardData.stats.citizenSatisfaction}/5
            </div>
            <div className="flex items-center text-xs text-orange-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +0.3 this month
            </div>
            <div className="mt-3 flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <div
                  key={star}
                  className={`w-3 h-3 rounded-full mr-1 ${
                    star <= dashboardData.stats.citizenSatisfaction
                      ? "bg-orange-400"
                      : "bg-orange-200"
                  }`}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Issue Categories Breakdown */}
        <Card className="lg:col-span-2 border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-600" />
              Issue Categories & Trends
            </CardTitle>
            <CardDescription>
              Distribution of issues by category with monthly trends
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData.trends.categories.map((category, index) => (
                <div
                  key={category.name}
                  className="flex items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className={`w-4 h-4 rounded-full bg-${
                        ["blue", "green", "yellow", "red"][index]
                      }-500`}
                    />
                    <div>
                      <p className="font-medium">{category.name}</p>
                      <p className="text-sm text-gray-500">
                        {category.count} issues
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <div
                        className={`flex items-center text-sm ${
                          category.trend > 0 ? "text-red-600" : "text-green-600"
                        }`}
                      >
                        {category.trend > 0 ? (
                          <TrendingUp className="h-3 w-3 mr-1" />
                        ) : (
                          <TrendingDown className="h-3 w-3 mr-1" />
                        )}
                        {Math.abs(category.trend)}%
                      </div>
                    </div>
                    <div className="w-24">
                      <Progress
                        value={(category.count / 12) * 100}
                        className="h-2"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Circular Progress Dashboard */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-green-600" />
              Performance Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <CircularProgress
                value={dashboardData.stats.resolvedIssues}
                max={dashboardData.stats.totalIssues}
                color="green"
              />
              <p className="text-sm text-gray-600 mt-2">Issues Resolved</p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  <AnimatedCounter
                    value={dashboardData.stats.activeProposals}
                  />
                </div>
                <p className="text-xs text-blue-600">Active Proposals</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  <AnimatedCounter value={dashboardData.stats.totalVotes} />
                </div>
                <p className="text-xs text-purple-600">Total Votes</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-gray-50 to-gray-100">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-600" />
            Quick Actions
          </CardTitle>
          <CardDescription>
            Jump into action with these common tasks
          </CardDescription>
        </CardHeader>
        <CardContent>
          {" "}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              onClick={() => navigate("/report")}
              className="h-24 flex flex-col items-center justify-center space-y-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              <Plus className="h-8 w-8" />
              <span className="font-medium">Report New Issue</span>
            </Button>

            <Button
              variant="outline"
              onClick={() => navigate("/proposals")}
              className="h-24 flex flex-col items-center justify-center space-y-2 border-2 border-purple-200 hover:border-purple-300 hover:bg-purple-50 shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              <Vote className="h-8 w-8 text-purple-600" />
              <span className="font-medium text-purple-700">
                View Proposals
              </span>
            </Button>

            <Button
              variant="outline"
              onClick={() => navigate("/map")}
              className="h-24 flex flex-col items-center justify-center space-y-2 border-2 border-green-200 hover:border-green-300 hover:bg-green-50 shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              <MapPin className="h-8 w-8 text-green-600" />
              <span className="font-medium text-green-700">
                Explore City Map
              </span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity Feed */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-indigo-600" />
            Recent Activity
          </CardTitle>
          <CardDescription>
            Latest updates on your issues and city proposals
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dashboardData.recentActivity.map((activity) => (
              <div
                key={activity.id}
                className={`flex items-center space-x-4 p-4 rounded-lg border-l-4 bg-gray-50 hover:bg-gray-100 transition-colors ${getPriorityColor(
                  activity.priority
                )}`}
              >
                <div className="flex-shrink-0 p-2 bg-white rounded-lg shadow-sm">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {activity.title}
                  </p>
                  <div className="flex items-center space-x-2 mt-1">
                    <p className="text-sm text-gray-500">
                      {activity.timestamp}
                    </p>
                    {activity.votes && (
                      <Badge variant="outline" className="text-xs">
                        <Users className="h-3 w-3 mr-1" />
                        {activity.votes} votes
                      </Badge>
                    )}
                    {activity.rating && (
                      <Badge variant="outline" className="text-xs">
                        <Award className="h-3 w-3 mr-1" />
                        {activity.rating}/5 rating
                      </Badge>
                    )}
                  </div>
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

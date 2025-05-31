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
import { Progress } from "../components/ui/progress";
import {
  Vote,
  Calendar,
  Users,
  CheckCircle,
  Clock,
  TrendingUp,
  FileText,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";

// Dummy proposals data
const dummyProposals = [
  {
    id: "PROP-001",
    title: "New Community Park Development",
    description:
      "Proposal to develop a new 5-acre community park in the downtown area with playground equipment, walking trails, and green spaces for families and recreational activities.",
    category: "Parks & Recreation",
    status: "Active",
    deadline: "2024-02-15",
    totalVotes: 1247,
    yesVotes: 892,
    noVotes: 355,
    userVoted: null,
    details:
      "The proposed park would include modern playground equipment, a 0.8-mile walking trail, picnic areas, and native plant gardens. Estimated cost: $2.3M with completion expected in 18 months.",
    proposedBy: "City Planning Department",
    createdDate: "2024-01-10",
  },
  {
    id: "PROP-002",
    title: "Extended Public Transportation Hours",
    description:
      "Extend bus service hours until midnight on weekdays and 2 AM on weekends to better serve night shift workers and improve accessibility.",
    category: "Transportation",
    status: "Active",
    deadline: "2024-02-20",
    totalVotes: 2156,
    yesVotes: 1634,
    noVotes: 522,
    userVoted: "yes",
    details:
      "This proposal would extend current bus service from 10 PM to midnight on weekdays and until 2 AM on Friday and Saturday nights. Additional funding required: $450K annually.",
    proposedBy: "Transportation Department",
    createdDate: "2024-01-05",
  },
  {
    id: "PROP-003",
    title: "Smart Traffic Light System Implementation",
    description:
      "Install AI-powered traffic lights at major intersections to reduce congestion and improve traffic flow throughout the city.",
    category: "Technology & Infrastructure",
    status: "Closed",
    deadline: "2024-01-30",
    totalVotes: 3421,
    yesVotes: 2876,
    noVotes: 545,
    userVoted: "yes",
    details:
      "Implementation of smart traffic lights with sensors and AI algorithms to optimize traffic flow. The system would reduce average wait times by an estimated 30%.",
    proposedBy: "Technology Department",
    createdDate: "2023-12-15",
  },
];

export default function ProposalsPage() {
  const [proposals, setProposals] = useState(dummyProposals);
  const [selectedProposal, setSelectedProposal] = useState(null);

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "Closed":
        return "bg-gray-100 text-gray-800";
      case "Draft":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Active":
        return <Vote className="h-4 w-4" />;
      case "Closed":
        return <CheckCircle className="h-4 w-4" />;
      case "Draft":
        return <FileText className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getDaysRemaining = (deadline) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleVote = (proposalId, vote) => {
    setProposals((prev) =>
      prev.map((proposal) => {
        if (proposal.id === proposalId) {
          const updatedProposal = { ...proposal };

          // Remove previous vote if exists
          if (proposal.userVoted === "yes") {
            updatedProposal.yesVotes -= 1;
            updatedProposal.totalVotes -= 1;
          } else if (proposal.userVoted === "no") {
            updatedProposal.noVotes -= 1;
            updatedProposal.totalVotes -= 1;
          }

          // Add new vote
          if (vote === "yes") {
            updatedProposal.yesVotes += 1;
            updatedProposal.totalVotes += 1;
          } else if (vote === "no") {
            updatedProposal.noVotes += 1;
            updatedProposal.totalVotes += 1;
          }

          updatedProposal.userVoted = vote;
          return updatedProposal;
        }
        return proposal;
      })
    );

    // Update selected proposal if it's the one being voted on
    if (selectedProposal && selectedProposal.id === proposalId) {
      const updatedProposal = proposals.find((p) => p.id === proposalId);
      setSelectedProposal({ ...updatedProposal, userVoted: vote });
    }
  };

  if (selectedProposal) {
    const yesPercentage =
      selectedProposal.totalVotes > 0
        ? (selectedProposal.yesVotes / selectedProposal.totalVotes) * 100
        : 0;
    const noPercentage =
      selectedProposal.totalVotes > 0
        ? (selectedProposal.noVotes / selectedProposal.totalVotes) * 100
        : 0;
    const daysRemaining = getDaysRemaining(selectedProposal.deadline);

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => setSelectedProposal(null)}>
            ← Back to Proposals
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Proposal Details
            </h1>
            <p className="text-muted-foreground">
              View detailed information and cast your vote.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">
                      {selectedProposal.title}
                    </CardTitle>
                    <CardDescription className="mt-2">
                      {selectedProposal.id} • Proposed by{" "}
                      {selectedProposal.proposedBy}
                    </CardDescription>
                  </div>
                  <Badge className={getStatusColor(selectedProposal.status)}>
                    {getStatusIcon(selectedProposal.status)}
                    {selectedProposal.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Description</h4>
                  <p className="text-gray-600">
                    {selectedProposal.description}
                  </p>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Detailed Information</h4>
                  <p className="text-gray-600">{selectedProposal.details}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">
                      Proposed: {formatDate(selectedProposal.createdDate)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">
                      Deadline: {formatDate(selectedProposal.deadline)}
                      {daysRemaining > 0 && ` (${daysRemaining} days left)`}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Voting Results */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Voting Results
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Total Votes</span>
                  <span className="text-lg font-bold">
                    {selectedProposal.totalVotes.toLocaleString()}
                  </span>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-green-700">
                        Yes
                      </span>
                      <span className="text-sm text-green-700">
                        {selectedProposal.yesVotes.toLocaleString()} (
                        {yesPercentage.toFixed(1)}%)
                      </span>
                    </div>
                    <Progress value={yesPercentage} className="h-2" />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-red-700">
                        No
                      </span>
                      <span className="text-sm text-red-700">
                        {selectedProposal.noVotes.toLocaleString()} (
                        {noPercentage.toFixed(1)}%)
                      </span>
                    </div>
                    <Progress value={noPercentage} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Cast Your Vote</CardTitle>
                <CardDescription>
                  {selectedProposal.status === "Active"
                    ? "Your voice matters in shaping our city's future"
                    : "Voting has ended for this proposal"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedProposal.status === "Active" ? (
                  <div className="space-y-3">
                    <Button
                      onClick={() => handleVote(selectedProposal.id, "yes")}
                      variant={
                        selectedProposal.userVoted === "yes"
                          ? "default"
                          : "outline"
                      }
                      className="w-full justify-start"
                    >
                      <ThumbsUp className="h-4 w-4 mr-2" />
                      Vote Yes
                      {selectedProposal.userVoted === "yes" && " ✓"}
                    </Button>

                    <Button
                      onClick={() => handleVote(selectedProposal.id, "no")}
                      variant={
                        selectedProposal.userVoted === "no"
                          ? "destructive"
                          : "outline"
                      }
                      className="w-full justify-start"
                    >
                      <ThumbsDown className="h-4 w-4 mr-2" />
                      Vote No
                      {selectedProposal.userVoted === "no" && " ✓"}
                    </Button>

                    {selectedProposal.userVoted && (
                      <p className="text-xs text-gray-500 text-center">
                        You can change your vote until the deadline
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">
                    This proposal is no longer accepting votes.
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Proposal Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Category
                  </label>
                  <p className="text-sm">{selectedProposal.category}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Status
                  </label>
                  <p className="text-sm">{selectedProposal.status}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Voting Deadline
                  </label>
                  <p className="text-sm">
                    {formatDate(selectedProposal.deadline)}
                  </p>
                </div>
                {daysRemaining > 0 && selectedProposal.status === "Active" && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Time Remaining
                    </label>
                    <p className="text-sm font-medium text-orange-600">
                      {daysRemaining} day{daysRemaining !== 1 ? "s" : ""} left
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

  const activeProposals = proposals.filter((p) => p.status === "Active");
  const closedProposals = proposals.filter((p) => p.status === "Closed");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">City Proposals</h1>
        <p className="text-muted-foreground">
          Vote on proposals and help shape the future of your city.
        </p>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Active Proposals</h2>
        <Badge variant="outline">
          {activeProposals.length} active proposal
          {activeProposals.length !== 1 ? "s" : ""}
        </Badge>
      </div>

      {/* Active Proposals */}
      <div className="space-y-4">
        {activeProposals.map((proposal) => {
          const yesPercentage =
            proposal.totalVotes > 0
              ? (proposal.yesVotes / proposal.totalVotes) * 100
              : 0;
          const daysRemaining = getDaysRemaining(proposal.deadline);

          return (
            <Card
              key={proposal.id}
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedProposal(proposal)}
            >
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">
                        {proposal.title}
                      </h3>
                      <Badge className={getStatusColor(proposal.status)}>
                        {getStatusIcon(proposal.status)}
                        {proposal.status}
                      </Badge>
                      {proposal.userVoted && (
                        <Badge
                          variant="outline"
                          className="bg-blue-50 text-blue-700"
                        >
                          Voted: {proposal.userVoted}
                        </Badge>
                      )}
                    </div>

                    <p className="text-gray-600 mb-3 line-clamp-2">
                      {proposal.description}
                    </p>

                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {proposal.totalVotes.toLocaleString()} votes
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {daysRemaining > 0
                          ? `${daysRemaining} days left`
                          : "Voting ended"}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Support: {yesPercentage.toFixed(1)}%</span>
                        <span>
                          {proposal.yesVotes.toLocaleString()} Yes /{" "}
                          {proposal.noVotes.toLocaleString()} No
                        </span>
                      </div>
                      <Progress value={yesPercentage} className="h-2" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Closed Proposals */}
      {closedProposals.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Recent Closed Proposals</h3>
          {closedProposals.map((proposal) => {
            const yesPercentage =
              proposal.totalVotes > 0
                ? (proposal.yesVotes / proposal.totalVotes) * 100
                : 0;

            return (
              <Card
                key={proposal.id}
                className="hover:shadow-md transition-shadow cursor-pointer opacity-75"
                onClick={() => setSelectedProposal(proposal)}
              >
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">
                          {proposal.title}
                        </h3>
                        <Badge className={getStatusColor(proposal.status)}>
                          {getStatusIcon(proposal.status)}
                          {proposal.status}
                        </Badge>
                        {yesPercentage > 50 ? (
                          <Badge className="bg-green-100 text-green-800">
                            Approved
                          </Badge>
                        ) : (
                          <Badge className="bg-red-100 text-red-800">
                            Rejected
                          </Badge>
                        )}
                      </div>

                      <p className="text-gray-600 mb-3 line-clamp-2">
                        {proposal.description}
                      </p>

                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {proposal.totalVotes.toLocaleString()} total votes
                        </div>
                        <div className="flex items-center gap-1">
                          <CheckCircle className="h-4 w-4" />
                          Final result: {yesPercentage.toFixed(1)}% support
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {proposals.length === 0 && (
        <Card>
          <CardContent className="pt-6 text-center">
            <Vote className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No proposals available
            </h3>
            <p className="text-gray-600">
              Check back later for new city improvement proposals to vote on.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

const express = require("express");
const router = express.Router();
const middleware = require("../middleware");
const userController = require("../controller/user.controller");
const Issue = require("../models/issue.model");
const Proposal = require("../models/poll.model");
router.post("/login", userController.loginUser);
router.post("/sign-up", userController.registerUser);

router.get("/profile", middleware.authUser, userController.getUserProfile);
router.get("/logout", middleware.authUser, userController.logoutUser);

//---------------
router.get("/stats", middleware.authUser, async (req, res) => {
  try {
    console.log("-----------req.user", req.user);

    // Main issues aggregation with additional calculations
    const issueStats = await Issue.aggregate([
      { $match: { reportedBy: req.user._id } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          resolved: {
            $sum: { $cond: [{ $eq: ["$status", "Resolved"] }, 1, 0] },
          },
          avgResolution: {
            $avg: {
              $cond: [
                { $eq: ["$status", "Resolved"] },
                { $subtract: ["$lastUpdate", "$reportedDate"] },
                null,
              ],
            },
          },
          // Calculate average satisfaction rating
          avgSatisfaction: {
            $avg: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$status", "Resolved"] },
                    { $ne: ["$satisfactionRating", null] },
                  ],
                },
                "$satisfactionRating",
                null,
              ],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          totalIssues: "$total",
          resolvedIssues: "$resolved",
          pendingIssues: { $subtract: ["$total", "$resolved"] },
          avgResolutionTime: {
            $divide: ["$avgResolution", 1000 * 60 * 60 * 24],
          },
          resolutionRate: {
            $cond: [
              { $gt: ["$total", 0] },
              {
                $multiply: [{ $divide: ["$resolved", "$total"] }, 100],
              },
              0,
            ],
          },
          citizenSatisfaction: {
            $cond: [
              { $ne: ["$avgSatisfaction", null] },
              { $round: ["$avgSatisfaction", 1] },
              0,
            ],
          },
        },
      },
    ]);

    // Get active proposals count (global count since proposals are admin-managed)
    const activeProposalsCount = await Proposal.countDocuments({
      status: "Active",
    });

    // Get user's total votes cast across all proposals
    const userVotesCount = await Proposal.aggregate([
      { $unwind: "$votes" },
      { $match: { "votes.user": req.user._id } },
      { $count: "totalVotes" },
    ]);

    // Combine all stats
    const stats = issueStats[0] || {
      totalIssues: 0,
      resolvedIssues: 0,
      pendingIssues: 0,
      avgResolutionTime: 0,
      resolutionRate: 0,
      citizenSatisfaction: 0,
    };

    // Format avgResolutionTime to string with "days" suffix
    stats.avgResolutionTime = stats.avgResolutionTime
      ? `${stats.avgResolutionTime.toFixed(1)} days`
      : "0 days";

    // Add proposal and voting stats
    stats.activeProposals = activeProposalsCount;
    stats.totalVotes = userVotesCount[0]?.totalVotes || 0;

    res.json({ data: stats });
  } catch (err) {
    console.log("Error fetching stats:", err);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/issues", middleware.authUser, async (req, res) => {
  console.log("req.body", req.body);
  try {
    const newIssue = new Issue({
      ...req.body,
      reportedBy: req.user._id,
      status: "Pending",
      reportedDate: new Date(),
      lastUpdate: new Date(),
    });

    await newIssue.validate();
    const savedIssue = await newIssue.save();

    res.status(200).json({
      ...savedIssue.toObject(),
    });
  } catch (err) {
    console.error("Error creating issue:", err);
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;

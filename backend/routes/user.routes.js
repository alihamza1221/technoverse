const express = require("express");
const router = express.Router();
const middleware = require("../middleware");
const userController = require("../controller/user.controller");
const Issue = require("../models/issue.model");
router.post("/login", userController.loginUser);
router.post("/sign-up", userController.registerUser);

router.get("/profile", middleware.authUser, userController.getUserProfile);
router.get("/logout", middleware.authUser, userController.logoutUser);

//---------------
router.get("/stats", middleware.authUser, async (req, res) => {
  try {
    console.log("-----------req.user", req.user);
    const stats = await Issue.aggregate([
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
              $subtract: ["$lastUpdate", "$reportedDate"],
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
        },
      },
    ]);

    res.json({ data: stats[0] });
  } catch (err) {
    console.log("Error fetching stats:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;

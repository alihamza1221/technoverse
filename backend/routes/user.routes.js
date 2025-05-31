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
router.get(
  "/stats",
  asyncHandler(async (req, res) => {
    try {
      // Get total issues count
      const totalIssues = await Issue.countDocuments();

      // Get resolved issues count
      const resolvedIssues = await Issue.countDocuments({ status: "Resolved" });

      // Get pending issues count
      const pendingIssues = await Issue.countDocuments({
        status: { $in: ["Pending", "In Progress"] },
      });

      // Calculate average resolution time
      const resolvedIssuesWithTime = await Issue.find({
        status: "Resolved",
        reportedDate: { $exists: true },
        resolvedDate: { $exists: true },
      }).select("reportedDate resolvedDate");

      let avgResolutionTime = "0 days";
      if (resolvedIssuesWithTime.length > 0) {
        const totalResolutionTime = resolvedIssuesWithTime.reduce(
          (total, issue) => {
            const timeDiff =
              new Date(issue.resolvedDate) - new Date(issue.reportedDate);
            return total + timeDiff / (1000 * 60 * 60 * 24); // Convert to days
          },
          0
        );

        const avgDays = (
          totalResolutionTime / resolvedIssuesWithTime.length
        ).toFixed(1);
        avgResolutionTime = `${avgDays} days`;
      }

      const stats = {
        totalIssues,
        resolvedIssues,
        pendingIssues,
        avgResolutionTime,
      };

      sendResponse(
        res,
        200,
        true,
        "Dashboard statistics retrieved successfully",
        stats
      );
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      sendResponse(res, 500, false, "Failed to retrieve dashboard statistics");
    }
  })
);

module.exports = router;

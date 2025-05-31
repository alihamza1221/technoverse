const express = require("express");
const router = express.Router();
const Issue = require("../models/issue.model");
router.get("/", async (req, res) => {
  try {
    const issues = await Issue.find({})
      .populate("reportedBy", "name email")
      .populate("assignedTo", "name department")
      .sort({ reportedDate: -1 });

    res.json({
      success: true,
      count: issues.length,
      data: issues,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch issues",
      message: error.message,
    });
  }
});

module.exports = router;

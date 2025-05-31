const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    issue: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Issue",
    },
    givenBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    rating: { type: Number, min: 1, max: 5 },
    comment: String,
    escalationTrail: [
      {
        escalatedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        escalatedTo: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Department",
        },
        reason: String,
        escalatedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Feedback", feedbackSchema);

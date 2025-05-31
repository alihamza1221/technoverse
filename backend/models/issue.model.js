const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: [
        "Potholes",
        "Sanitation",
        "Electricity",
        "Traffic",
        "Water Supply",
        "Public Safety",
        "Road Maintenance",
        "Garbage Disposal",
        "Other",
      ],
    },
    location: {
      ltd: {
        type: Number,
      },
      lng: {
        type: Number,
      },
    },
    images: [String],
    status: {
      type: String,
      enum: ["Pending", "Assigned", "In Progress", "Resolved", "Rejected"],

      default: "Pending",
    },
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // DepartmentHead
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Worker
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High", "low", "medium", "high"],
      default: "Medium",
    },
    isEscalated: { type: Boolean, default: false },
    comments: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        text: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

issueSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Issue", issueSchema);

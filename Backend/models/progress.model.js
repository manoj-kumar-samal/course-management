import mongoose from "mongoose";

const progressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true
  },
  courseId: {
    type: mongoose.Types.ObjectId,
    ref: "Course",
    required: true
  },
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  lastAccessed: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Ensure each user can only have one progress record per course
progressSchema.index({ userId: 1, courseId: 1 }, { unique: true });

export const Progress = mongoose.model("Progress", progressSchema);
import { Progress } from "../models/progress.model.js";

export const updateProgress = async (req, res) => {
  const { courseId } = req.params;
  const userId = req.userId;
  const { progress } = req.body;

  try {
    const progressRecord = await Progress.findOneAndUpdate(
      { userId, courseId },
      { 
        progress,
        lastAccessed: new Date()
      },
      { 
        new: true,
        upsert: true
      }
    );

    res.status(200).json({
      message: "Progress updated successfully",
      progress: progressRecord
    });
  } catch (error) {
    console.error("Error updating progress:", error);
    res.status(500).json({ errors: "Error updating progress" });
  }
};

export const getProgress = async (req, res) => {
  const { courseId } = req.params;
  const userId = req.userId;

  try {
    const progress = await Progress.findOne({ userId, courseId });
    
    if (!progress) {
      return res.status(200).json({ progress: 0 });
    }

    res.status(200).json({ progress: progress.progress });
  } catch (error) {
    console.error("Error fetching progress:", error);
    res.status(500).json({ errors: "Error fetching progress" });
  }
};

export const getAllProgress = async (req, res) => {
  const userId = req.userId;

  try {
    const progress = await Progress.find({ userId })
      .populate('courseId', 'title');
    
    res.status(200).json({ progress });
  } catch (error) {
    console.error("Error fetching all progress:", error);
    res.status(500).json({ errors: "Error fetching progress" });
  }
};
import { Review } from "../models/review.model.js";
import { Course } from "../models/course.model.js";
import { Purchase } from "../models/purchase.model.js";
import mongoose from "mongoose";

export const createReview = async (req, res) => {
  const { courseId } = req.params;
  const userId = req.userId;
  const { rating, review } = req.body;

  try {
    // Check if user has purchased the course
    // const purchase = await Purchase.findOne({ userId, courseId });
    // if (!purchase) {
    //   return res.status(403).json({ errors: "You must purchase the course to review it" });
    // }

    // Check if user has already reviewed
    const existingReview = await Review.findOne({ userId, courseId });
    if (existingReview) {
      return res.status(400).json({ errors: "You have already reviewed this course" });
    }

    const newReview = await Review.create({
      userId,
      courseId,
      rating,
      review
    });

    res.status(201).json({ message: "Review added successfully", review: newReview });
  } catch (error) {
    console.error("Error in creating review:", error);
    res.status(500).json({ errors: "Error in creating review" });
  }
};

export const getCourseReviews = async (req, res) => {
  const { courseId } = req.params;

  try {
    const reviews = await Review.find({ courseId })
      .populate('userId', 'firstName lastName')
      .sort({ createdAt: -1 });

      console.log(reviews)
    const stats = await Review.aggregate([
      { $match: { courseId: new mongoose.Types.ObjectId(courseId) } },
      { 
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json({ 
      reviews,
      stats: stats[0] || { averageRating: 0, totalReviews: 0 }
    });
  } catch (error) {
    console.error("Error in fetching reviews:", error);
    res.status(500).json({ errors: "Error in fetching reviews" });
  }
};

export const updateReview = async (req, res) => {
  const { reviewId } = req.params;
  const userId = req.userId;
  const { rating, review } = req.body;

  try {
    const updatedReview = await Review.findOneAndUpdate(
      { _id: reviewId, userId },
      { rating, review },
      { new: true }
    );

    if (!updatedReview) {
      return res.status(404).json({ errors: "Review not found or unauthorized" });
    }

    res.status(200).json({ message: "Review updated successfully", review: updatedReview });
  } catch (error) {
    console.error("Error in updating review:", error);
    res.status(500).json({ errors: "Error in updating review" });
  }
};

export const deleteReview = async (req, res) => {
  const { reviewId } = req.params;
  const userId = req.userId;

  try {
    const deletedReview = await Review.findOneAndDelete({ _id: reviewId, userId });

    if (!deletedReview) {
      return res.status(404).json({ errors: "Review not found or unauthorized" });
    }

    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("Error in deleting review:", error);
    res.status(500).json({ errors: "Error in deleting review" });
  }
};
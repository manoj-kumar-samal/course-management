import express from "express";
import { createReview, getCourseReviews, updateReview, deleteReview } from "../controllers/review.controller.js";
import userMiddlewares from "../middlewares/user.mid.js";

const router = express.Router();

router.post("/create/:courseId", userMiddlewares, createReview);
router.get("/course/:courseId", getCourseReviews);
router.put("/update/:reviewId", userMiddlewares, updateReview);
router.delete("/delete/:reviewId", userMiddlewares, deleteReview);

export default router;
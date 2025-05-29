import express from "express";
import { updateProgress, getProgress, getAllProgress } from "../controllers/progress.controller.js";
import userMiddlewares from "../middlewares/user.mid.js";

const router = express.Router();

router.put("/update/:courseId", userMiddlewares, updateProgress);
router.get("/:courseId", userMiddlewares, getProgress);
router.get("/", userMiddlewares, getAllProgress);

export default router;
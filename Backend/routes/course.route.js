import express from "express";
import { buyCourse, courseDetails, createCourse, deleteCourse, getCourses, updateCourse } from "../controllers/course.controller.js";
import userMiddlewares from "../middlewares/user.mid.js";
import adminMiddlewares from "../middlewares/admin.mid.js";

const router=express.Router()

router.post("/create",adminMiddlewares,createCourse)
router.put("/update/:courseId",adminMiddlewares,updateCourse)
router.delete("/delete/:courseId",adminMiddlewares,deleteCourse)
router.get("/courses",getCourses)
router.get("/:courseId",courseDetails)

router.post("/buy/:courseId",userMiddlewares,buyCourse)

export default router;
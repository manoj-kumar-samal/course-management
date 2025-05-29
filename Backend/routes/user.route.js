import express from "express";
import { login, logout, purchases, signup, getProfile, updateProfile } from "../controllers/user.controller.js";
import userMiddlewares from "../middlewares/user.mid.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/logout", logout);
router.get("/purchases", userMiddlewares, purchases);
router.get("/profile", userMiddlewares, getProfile);
router.put("/profile", userMiddlewares, updateProfile);

export default router;
import express from "express";
import { login, logout, purchases, signup } from "../controllers/user.controller.js";
import userMiddlewares from "../middlewares/user.mid.js";


const router=express.Router()

router.post("/signup",signup)
router.post("/login",login)
router.get("/logout",logout)
router.get("/purchases",userMiddlewares,purchases)

export default router;
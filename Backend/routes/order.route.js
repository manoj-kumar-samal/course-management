import express from "express";
import { orderData } from "../controllers/order.controller.js";
import userMiddlewares from "../middlewares/user.mid.js";



const router=express.Router()
router.post("/",userMiddlewares,orderData)


export default router;
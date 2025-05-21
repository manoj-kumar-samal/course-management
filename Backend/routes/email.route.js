
import express from "express"
import { sendEnrollmentEmail } from "../controllers/email.controller.js";
const router = express.Router();



// POST route to send email
router.post('/send-email', sendEnrollmentEmail);

export default router;

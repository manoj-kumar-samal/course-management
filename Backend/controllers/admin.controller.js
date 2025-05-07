import { Admin } from "../models/admin.model.js";
import bcrypt from "bcryptjs";
import { z } from "zod";
import jwt from "jsonwebtoken";
import config from "../config.js";
import { Course } from "../models/course.model.js";

export const signup = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    const adminSchema = z.object({
        firstName: z.string().min(2, "Firstname atleast 2 chars").max(10),
        lastName: z.string().min(2, "Lastname atleast 2 chars").max(10),
        email: z.string().email(),
        password: z.string().min(4, "password must be atleast 4 chars").max(20, "password must not be exceeds 20 chars")
    })

    const validateData = adminSchema.safeParse(req.body);

    if (!validateData.success) {
        return res.status(400).json({ errors: validateData.error.issues.map(err => err.message) })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    try {
        const existingAdmin = await Admin.findOne({ email: email });

        if (existingAdmin) {
            return res.status(400).json({ errors: "Admin already exists" });
        }
        const newAdmin = new Admin({ firstName, lastName, email, password: hashedPassword });
        await newAdmin.save();
        res.status(201).json({ message: "Signup successful", newAdmin })
    } catch (error) {
        console.log("Error in signup", error)
        res.status(500).json({ errors: "Error in signup" })
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const admin = await Admin.findOne({ email });

        if (!admin) {
            return res.status(403).json({ errors: "Invalid Credential" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, admin.password);

        if (!isPasswordCorrect) {
            return res.status(403).json({ errors: "Invalid Credential" });
        }

        const token = jwt.sign(
            { id: admin._id },
            config.JWT_ADMIN_PASSWORD,
            { expiresIn: "1h" }
        );
        const cookieOptions = {
            expires: new Date(Date.now() + 60 * 60 * 1000),
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            samesite: "Strict"
        }
        res.cookie("jwt", token, cookieOptions)
        const { password: _, ...adminData } = admin.toObject();

        res.status(200).json({ message: "Login successful", admin: adminData, token });

    } catch (error) {
        console.error("Error in login", error);
        res.status(500).json({ errors: "Error in login" });
    }
};

export const logout = async (req, res) => {
    try {
        // if(!req.cookies.jwt){
        //     return res.status(401).json({errors: "Kindly login first"})
        // }
        res.clearCookie("jwt");
        res.status(200).json({ message: "Logged out successfully" })
    } catch (error) {
        console.log("Error in logout", error)
        res.status(500).json({ errors: "Error in logout" })
    }
}
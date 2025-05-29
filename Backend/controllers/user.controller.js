import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { z } from "zod";
import jwt from "jsonwebtoken";
import config from "../config.js";
import { Purchase } from "../models/purchase.model.js";
import { Course } from "../models/course.model.js";

export const signup = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    const userSchema = z.object({
        firstName: z.string().min(2, "Firstname atleast 2 chars").max(10),
        lastName: z.string().min(2, "Lastname atleast 2 chars").max(10),
        email: z.string().email(),
        password: z.string().min(4, "password must be atleast 4 chars").max(20, "password must not be exceeds 20 chars")
    })

    const validateData = userSchema.safeParse(req.body);

    if (!validateData.success) {
        return res.status(400).json({ errors: validateData.error.issues.map(err => err.message) })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    try {
        const existingUser = await User.findOne({ email: email });

        if (existingUser) {
            return res.status(400).json({ errors: "User already exists" });
        }
        const newUser = new User({ firstName, lastName, email, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: "Signup successful", newUser })
    } catch (error) {
        console.log("Error in signup", error)
        res.status(500).json({ errors: "Error in signup" })
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(403).json({ errors: "Invalid Credential" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
            return res.status(403).json({ errors: "Invalid Credential" });
        }

        const token = jwt.sign(
            { id: user._id },
            config.JWT_USER_PASSWORD,
            { expiresIn: "1d" }
        );
        const cookieOptions={
            expires: new Date(Date.now() + 60 * 60 * 1000 * 24),
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            samesite: "Strict"
        }
        res.cookie("jwt", token, cookieOptions)
        const { password: _, ...userData } = user.toObject();

        res.status(200).json({ message: "Login successful", user: userData, token });

    } catch (error) {
        console.error("Error in login", error);
        res.status(500).json({ errors: "Error in login" });
    }
};

export const logout = async (req, res) => {
    try {
        res.clearCookie("jwt");
        res.status(200).json({ message: "Logged out successfully" })
    } catch (error) {
        console.log("Error in logout", error)
        res.status(500).json({ errors: "Error in logout" })
    }
}

export const purchases = async (req,res) => {
    const userId = req.userId;

    try {
        const purchased = await Purchase.find({userId})
        let purchasedCourseId = []
        for(let i=0; i<purchased.length; i++) {
            purchasedCourseId.push(purchased[i].courseId)
        }

        const courseData = await Course.find({
            _id: {$in: purchasedCourseId}
        })

        res.status(200).json({purchased, courseData})
    } catch(error) {
        console.log("Error in purchase", error)
        res.status(500).json({errors: "Error in purchases"})
    }
}

export const getProfile = async (req, res) => {
    const userId = req.userId;

    try {
        const user = await User.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({ errors: "User not found" });
        }
        res.status(200).json({ profile: user });
    } catch (error) {
        console.error("Error fetching profile:", error);
        res.status(500).json({ errors: "Error fetching profile" });
    }
};

export const updateProfile = async (req, res) => {
    const userId = req.userId;
    const { firstName, lastName, phone, address, bio } = req.body;

    try {
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                firstName,
                lastName,
                phone,
                address,
                bio
            },
            { new: true }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({ errors: "User not found" });
        }

        res.status(200).json({ 
            message: "Profile updated successfully",
            profile: updatedUser 
        });
    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({ errors: "Error updating profile" });
    }
};
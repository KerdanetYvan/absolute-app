import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { connect } from "../../../lib/db";
import { User } from "../../../models/user.model";

const jwt_secret = process.env.JWT_SECRET || 'your-fallback-secret';

// POST API route for user authentication
export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Extract data from request body
        const { email, password } = req.body;

        // Validate required fields
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // Connect to database
        await connect();

        // Search for user by email in database
        const user = await User.findOne({ email });
        console.log("👤 User found :", user ? 'Yes' : 'No');
        
        // Check if user exists
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Verify password by comparing with stored hash
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid password" });
        }

        // Generate JWT token for authentication
        const token = jwt.sign({ id: user._id }, jwt_secret, {
            expiresIn: "7d" // Token expires in 7 days
        });

        // Remove password from returned user data
        const { password: userPassword, ...other } = user.toObject();

        // Set httpOnly cookie containing access token
        res.setHeader('Set-Cookie', [
            `access_token=${token}; HttpOnly; Path=/; Max-Age=604800; SameSite=Strict`
        ]);
        
        // Return user data (without password)
        return res.status(200).json(other);

    } catch (error) {
        // Handle server errors
        console.error("Error during login:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

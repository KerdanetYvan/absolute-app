import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { connect } from "../../../lib/db";
import { User } from "../../../models/user.model";

const jwt_secret = process.env.JWT_SECRET;

// POST API route for user authentication
export async function POST(request) {
    try {
        // Extract data from request body
        const body = await request.json();

        // Connect to database
        connect();

        // Search for user by email in database
        const user = await User.findOne({
            email: body.email
        });
        console.log("👤 User found :", user);
        
        // Check if user exists
        if (!user) {
            return new Response(JSON.stringify({
                error: "User not found"
            }), {
                status: 404,
                headers: {
                    "Content-Type": "application/json"
                }
            });
        }

        // Verify password by comparing with stored hash
        const isMatch = await bcrypt.compare(body.password, user.password);
        if (!isMatch) {
            return new Response(JSON.stringify({
                error: "Invalid password"
            }), {
                status: 401,
                headers: {
                    "Content-Type": "application/json"
                }
            });
        }

        // Generate JWT token for authentication
        const token = jwt.sign({ id: user._id }, jwt_secret, {
            expiresIn: "7d" // Token expires in 7 days
        });

        // Remove password from returned user data
        const { password, ...other } = user._doc;

        // Set httpOnly cookie containing access token
        cookies().set({
            name: 'access_token',
            value: token,
            httpOnly: true, // Secure cookie against XSS attacks
            path: '/',
            maxAge: 86400, // Cookie valid for 24h (in seconds)
        });
        
        // Return user data (without password)
        return new Response(JSON.stringify(other), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        // Handle server errors
        console.error("Error during login:", error);
        return new Response(JSON.stringify({
            error: "Internal server error"
        }), {
            status: 500,
            headers: {
                "Content-Type": "application/json"
            }
        });
    }
}
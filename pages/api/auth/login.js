import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import connectDB from "../../../lib/mongodb";
import mongoose from "mongoose";

const jwt_secret = process.env.JWT_SECRET;

// Define User schema directly in the API file to avoid import issues
const getUserModel = () => {
    // Check if User model already exists
    if (mongoose.models.User) {
        return mongoose.models.User;
    }

    // Create User schema
    const UserSchema = new mongoose.Schema({
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },
        password: {
            type: String,
            required: true,
            minlength: 6
        },
        name: {
            type: String,
            required: true,
            trim: true
        },
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user'
        }
    }, {
        timestamps: true
    });

    return mongoose.model('User', UserSchema);
};

// POST API route for user authentication
export default async function handler(req, res) {
    console.log('🔄 Login API called');
    console.log('Method:', req.method);
    
    // Only allow POST requests
    if (req.method !== 'POST') {
        console.log('❌ Method not allowed:', req.method);
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        console.log('📨 Request body:', req.body);
        
        // Extract data from request body
        const { email, password } = req.body;

        // Validate required fields
        if (!email || !password) {
            console.log('❌ Missing required fields');
            return res.status(400).json({ error: 'Email and password are required' });
        }

        console.log('🔍 Looking for user:', email);

        // Connect to database
        console.log('🔄 Connecting to database...');
        await connectDB();
        console.log('✅ Database connected');

        // Get User model
        console.log('🔄 Getting User model...');
        const User = getUserModel();
        console.log('✅ User model loaded:', typeof User);
        console.log('✅ User model name:', User.modelName);

        // Search for user by email in database
        console.log('🔍 Searching for user...');
        const user = await User.findOne({ email });
        console.log("👤 User found:", user ? 'Yes' : 'No');
        
        if (user) {
            console.log("👤 User details:", {
                id: user._id,
                email: user.email,
                name: user.name,
                hasPassword: !!user.password,
                passwordLength: user.password ? user.password.length : 0,
                role: user.role
            });
        }
        
        // Check if user exists
        if (!user) {
            console.log('❌ User not found');
            return res.status(404).json({ error: "User not found" });
        }

        // Check if user has a password
        if (!user.password) {
            console.log('❌ User has no password stored');
            return res.status(500).json({ error: "User password not found" });
        }

        console.log('🔐 Verifying password...');
        console.log('🔐 Input password length:', password.length);
        console.log('🔐 Stored password hash length:', user.password.length);
        
        // Verify password by comparing with stored hash
        const isMatch = await bcrypt.compare(password, user.password);
        console.log('🔐 Password match:', isMatch);
        
        if (!isMatch) {
            console.log('❌ Invalid password');
            return res.status(401).json({ error: "Invalid password" });
        }

        console.log('🔑 Generating JWT token...');
        console.log('JWT Secret exists:', !!jwt_secret);
        
        // Generate JWT token for authentication
        const token = jwt.sign({ id: user._id }, jwt_secret, {
            expiresIn: "7d" // Token expires in 7 days
        });
        console.log('✅ JWT token generated');

        // Remove password from returned user data
        const userObject = user.toObject();
        const { password: userPassword, ...other } = userObject;

        console.log('🍪 Setting cookie...');
        // Set httpOnly cookie containing access token
        res.setHeader('Set-Cookie', [
            `access_token=${token}; HttpOnly; Path=/; Max-Age=604800; SameSite=Strict`
        ]);
        
        console.log('✅ Login successful');
        
        // Return user data (without password)
        return res.status(200).json(other);

    } catch (error) {
        // Handle server errors
        console.error("❌ Error during login:", error);
        console.error("Error stack:", error.stack);
        
        return res.status(500).json({ 
            error: "Internal server error",
            message: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}

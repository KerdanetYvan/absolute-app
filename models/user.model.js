import mongoose from 'mongoose';
import uniqueValidator from "mongoose-unique-validator";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    }
}, {
    timestamps: true, // Adding automatically the creation date and modification
});

userSchema.plugin(uniqueValidator);

const User = mongoose.model('User', userSchema);
export default User;
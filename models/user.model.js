import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Le nom d'utilisateur est requis"],
        unique: true,
        trim: true,
        minlength: [3, "Le nom d'utilisateur doit contenir au moins 3 caractères"]
    },
    profilePicture: {
        type: String,
        default: null, // Default to null if no profile picture is provided
        trim: true,
        validate: {
            validator: function(v) {
                return /^https?:\/\/.*\.(jpg|jpeg|png|gif)$/.test(v);
            },
            message: props => `${props.value} n'est pas une URL valide pour une image de profil!`
        }
    },
    bannerPicture: {
        type: String,
        default: null, // Default to null if no banner picture is provided
        trim: true,
        validate: {
            validator: function(v) {
                return /^https?:\/\/.*\.(jpg|jpeg|png|gif)$/.test(v);
            },
            message: props => `${props.value} n'est pas une URL valide pour une image de bannière!`
        }
    },
    email: {
        type: String,
        required: [true, "L'email est requis"],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Veuillez fournir un email valide']
    },
    passwordHash: {
        type: String,
        required: [true, "Le mot de passe est requis"]
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    emailVerificationToken: {
        type: String,
        default: null
    },
    emailVerificationExpires: {
        type: Date,
        default: null
    },
    passwordResetToken: {
        type: String,
        default: null
    },
    passwordResetExpires: {
        type: Date,
        default: null
    },
    latitude: {
        type: Number,
        default: null
    },
    longitude: {
        type: Number,
        default: null
    }
}, {
    timestamps: true, // Adding automatically the creation date and modification
});

userSchema.plugin(uniqueValidator);

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;
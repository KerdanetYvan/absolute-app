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
        default: null,
        trim: true,
        validate: {
            validator: function(value) {
                // Permettre null ou undefined (champ optionnel)
                if (value === null || value === undefined || value === '') {
                    return true;
                }
                // Si une valeur est fournie, vérifier que c'est une URL valide
                const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
                return urlRegex.test(value);
            },
            message: 'L\'URL de l\'image de profil doit être valide ou peut être vide'
        }
    },
    bannerPicture: {
        type: String,
        default: null,
        trim: true,
        validate: {
            validator: function(value) {
                // Permettre null ou undefined (champ optionnel)
                if (value === null || value === undefined || value === '') {
                    return true;
                }
                // Si une valeur est fournie, vérifier que c'est une URL valide
                const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
                return urlRegex.test(value);
            },
            message: 'L\'URL de l\'image de bannière doit être valide ou peut être vide'
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
    favSchools: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'School', // Assuming you have a School model
        default: []
    }],
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
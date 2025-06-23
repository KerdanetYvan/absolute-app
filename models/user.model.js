import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const userSchema = new mongoose.Schema({    username: {
        type: String,
        required: [true, "Le nom d'utilisateur est requis"],
        unique: true,
        trim: true,
        minlength: [3, "Le nom d'utilisateur doit contenir au moins 3 caractères"]
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
    }
}, {
    timestamps: true, // Adding automatically the creation date and modification
});

userSchema.plugin(uniqueValidator);

const User = mongoose.model('User', userSchema);
export default User;
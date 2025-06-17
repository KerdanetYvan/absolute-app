import mongoose from 'mongoose';

const schoolSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    address: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    latitude: {
        type: Float32Array,
        required: true,
    },
    longitude: {
        type: Float32Array,
        required: true,
    },
    website: {
        type: String,
        required: true,
    }
}, {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
});

const School = mongoose.model('School', schoolSchema);
export default School;
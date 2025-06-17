import mongoose from 'mongoose';

const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    coverImageUrl: {
        type: String,
        required: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
    }
}, {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
});

const Article = mongoose.model('Article', articleSchema);
export default Article;
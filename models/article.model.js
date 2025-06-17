import mongoose from 'mongoose';

const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    category: {
        type: String,
        default: 'Non catégorisé'
    },
    tags: [{
        type: String,
        trim: true
    }],
    likes: {
        type: Number,
        default: 0
    },
    views: {
        type: Number,
        default: 0
    },
    coverImageUrl: {
        type: String,
        default: null
    },
    slug: {
        type: String,
        unique: true,
        sparse: true
    }
}, {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
});

const Article = mongoose.models.Article || mongoose.model('Article', articleSchema);
export default Article;
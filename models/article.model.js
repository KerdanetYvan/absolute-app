import mongoose from 'mongoose';
import User from './user.model.js';

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
        default: 'article'
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
    videoUrl: {
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

// Génère un slug unique à partir du titre
articleSchema.statics.generateUniqueSlug = async function(title) {
    let slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

    let exists = await this.exists({ slug });
    let suffix = 1;
    while (exists) {
        const newSlug = `${slug}-${suffix}`;
        exists = await this.exists({ slug: newSlug });
        if (!exists) {
            slug = newSlug;
            break;
        }
        suffix++;
    }
    return slug;
};

// Middleware pour générer le slug avant validation si absent
articleSchema.pre('validate', async function(next) {
    if (!this.slug && this.title) {
        this.slug = await this.constructor.generateUniqueSlug(this.title);
    }
    next();
});

const Article = mongoose.models.Article || mongoose.model('Article', articleSchema);
export default Article;
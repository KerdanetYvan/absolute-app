import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
    idUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    idArticle: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Article',
        required: true,
    },
    content: {
        type: String,
        required: true,
    }
}, {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
});

const Comment = mongoose.models.Comment || mongoose.model('Comment', commentSchema);
export default Comment;
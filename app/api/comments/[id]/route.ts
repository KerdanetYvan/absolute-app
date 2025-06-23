import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/mongodb';
import Comment from '@/models/comment.model.js';

interface UpdateCommentBody {
  content?: string;
}

// DELETE - Supprimer un commentaire

export async function DELETE(request: Request) {
  try {
    await connectDB();

    // Récupération de l'ID commentaire depuis l'URL
    const commentId = request.url.split('/').pop();
    if (!commentId) {
      return NextResponse.json(
        { error: "ID du commentaire requis" },
        { status: 400 }
      );
    }

    // Vérification si le commentaire existe
    const existingComment = await Comment.findById(commentId);
    if (!existingComment) {
      return NextResponse.json(
        { error: 'Commentaire non trouvé' },
        { status: 404 }
      );
    }

    // Suppression du commentaire
    await Comment.findByIdAndDelete(commentId);

    return NextResponse.json(
      { message: 'Commentaire supprimé avec succès' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erreur suppression commentaire:', error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression du commentaire" },
      { status: 500 }
    );
  }
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const { id } = params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'ID commentaire invalide' }, { status: 400 });
    }
    const comment = await Comment.findById(id)
      .populate('idUser', 'username email')
      .populate('idArticle', 'title');
    if (!comment) {
      return NextResponse.json({ error: 'Commentaire non trouvé' }, { status: 404 });
    }
    return NextResponse.json(comment);
  } catch (error) {
    return NextResponse.json({ error: 'Erreur lors de la récupération du commentaire' }, { status: 500 });
  }
}

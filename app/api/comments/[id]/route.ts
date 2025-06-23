import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/mongodb';
import Comment from '@/models/comment.model.js';

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

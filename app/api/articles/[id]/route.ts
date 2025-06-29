import { NextResponse, NextRequest } from 'next/server';
import connectDB from '@/lib/mongodb';
import Article from '@/models/article.model';
import User from '@/models/user.model.js'; // Import nécessaire pour le populate
import mongoose from 'mongoose';

// Forcer l'enregistrement du modèle User si pas déjà fait
if (!mongoose.models.User) {
  require('@/models/user.model.js');
}

// PATCH - Modifier un article

interface UpdateArticleBody {
  title?: string;
  content?: string;
  author?: string;
  category?: string;
  tags?: string[];
  likes?: number;
  views?: number;
  coverImageUrl?: string | null;
  slug?: string;
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const body = await request.json();
    const {
      title,
      content,
      author,
      category,
      tags,
      likes,
      views,
      coverImageUrl,
      slug,
    } = body as UpdateArticleBody;

    // Vérification qu'au moins un champ est fourni
    if (
      !title &&
      !content &&
      !author &&
      !category &&
      !tags &&
      likes === undefined &&
      views === undefined &&
      coverImageUrl === undefined &&
      !slug
    ) {
      return NextResponse.json(
        { error: 'Au moins un champ doit être fourni pour la mise à jour' },
        { status: 400 }
      );
    }

    // Récupération de l'ID de l'article depuis les paramètres
    const { id: articleId } = await params;
    if (!articleId) {
      return NextResponse.json(
        { error: "ID d'article requis" },
        { status: 400 }
      );
    }

    // Vérification si l'article existe
    const existingArticle = await Article.findById(articleId);
    if (!existingArticle) {
      return NextResponse.json(
        { error: 'Article non trouvé' },
        { status: 404 }
      );
    }

    // Préparation des données à mettre à jour
    const updateData: any = {};
    if (title) updateData.title = title;
    if (content) updateData.content = content;
    if (author) updateData.author = author;
    if (category) updateData.category = category;
    if (tags) updateData.tags = tags;
    if (likes !== undefined) updateData.likes = likes;
    if (views !== undefined) updateData.views = views;
    if (coverImageUrl !== undefined) updateData.coverImageUrl = coverImageUrl;
    if (slug) updateData.slug = slug;

    // Mise à jour de l'article
    const updatedArticle = await Article.findByIdAndUpdate(
      articleId,
      updateData,
      { new: true }
    );

    return NextResponse.json(updatedArticle, { status: 200 });
  } catch (error) {
    console.error('Erreur mise à jour article:', error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour de l'article" },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer un article

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    // Récupération de l'ID article depuis les paramètres
    const { id: articleId } = await params;
    if (!articleId) {
      return NextResponse.json(
        { error: "ID d'article requis" },
        { status: 400 }
      );
    }

    // Vérification si l'article existe
    const existingArticle = await Article.findById(articleId);
    if (!existingArticle) {
      return NextResponse.json(
        { error: 'Article non trouvé' },
        { status: 404 }
      );
    }

    // Suppression de l'article
    await Article.findByIdAndDelete(articleId);

    return NextResponse.json(
      { message: 'Article supprimé avec succès' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erreur suppression article:', error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression de l'article" },
      { status: 500 }
    );
  }
}

// GET - Récupérer un article par ID
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    console.log('🔍 Récupération de l\'article ID:', id);
    
    await connectDB();
    console.log('📦 Connexion à la base de données établie');
    
    const article = await Article.findById(id)
      // .populate('author', 'username email') // Désactivé temporairement
      .lean()
      .exec();
    
    if (!article) {
      console.log('❌ Article non trouvé');
      return NextResponse.json(
        { error: 'Article non trouvé' },
        { status: 404 }
      );
    }
    
    console.log('✅ Article trouvé:', (article as any).title);
    return NextResponse.json(article);
    
  } catch (error: any) {
    console.error('❌ Erreur lors de la récupération de l\'article:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération de l\'article', details: error.message },
      { status: 500 }
    );
  }
}

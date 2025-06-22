import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Article from '@/models/article.model';

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

export async function PATCH(request: Request) {
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

    // Récupération de l'ID de l'article depuis l'URL
    const articleId = request.url.split('/').pop();
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

export async function DELETE(request: Request) {
  try {
    await connectDB();

    // Récupération de l'ID article depuis l'URL
    const articleId = request.url.split('/').pop();
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
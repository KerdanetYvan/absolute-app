import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/mongodb';
import Article from '@/models/article.model.js';
import User from '@/models/user.model.js'; // Import nécessaire pour le populate

// Forcer l'enregistrement du modèle User si pas déjà fait
if (!mongoose.models.User) {
  require('@/models/user.model.js');
}

interface IArticle {
  title: string;
  content: string;
  author: mongoose.Types.ObjectId | string;
  category?: string;
  tags?: string[];
  likes?: number;
  views?: number;
  _id?: string;
}

// GET - Récupérer tous les articles
export async function GET() {
  try {
    console.log('Tentative de connexion à la base de données pour GET...');
    await connectDB();
    console.log('Connexion réussie, recherche des articles...');
    
    const articles = await Article.find({})
      // .populate('author', 'username email') // Désactivé temporairement
      .sort({ createdAt: -1 })
      .lean()
      .exec();
    
    console.log(`${articles.length} articles trouvés`);
    return NextResponse.json(articles);
  } catch (error: any) {
    console.error('Erreur détaillée lors de la récupération des articles:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des articles', details: error.message },
      { status: 500 }
    );
  }
}

// POST - Créer un nouvel article
export async function POST(request: Request) {
  try {
    console.log('Tentative de connexion à la base de données pour POST...');
    await connectDB();
    console.log('Connexion réussie, lecture du body...');
    
    const body = await request.json() as IArticle;
    console.log('Body reçu:', body);
    
    const { title, content, author, category, tags } = body;    // Log du body reçu pour debug
    console.log('Body reçu dans la requête:', body);
    
    // Vérification des champs requis
    if (!title || !content || !author) {
      console.log('Validation échouée. Valeurs reçues:', { 
        title: title || 'manquant',
        content: content || 'manquant',
        author: author || 'manquant'
      });
      return NextResponse.json(
        { 
          error: 'Champs requis manquants',
          details: {
            title: !title ? 'Titre manquant' : 'OK',
            content: !content ? 'Contenu manquant' : 'OK',
            author: !author ? 'Auteur manquant' : 'OK'
          },
          receivedData: body
        },
        { status: 400 }
      );
    }

    // Vérification du format de l'ID de l'auteur
    if (!mongoose.Types.ObjectId.isValid(author)) {
      console.log('ID auteur invalide:', author);
      return NextResponse.json(
        { error: 'ID auteur invalide' },
        { status: 400 }
      );
    }// Création du slug à partir du titre
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    // Création de l'article
    const newArticle = await Article.create({
      title,
      content,
      author,
      slug,
      category: category || 'Non catégorisé',
      tags: tags || [],
      likes: 0,
      views: 0
    });    // Récupérer l'article créé avec les informations de l'auteur
    const articleWithAuthor = await Article.findOne({ slug })
      .populate('author', 'username email')
      .exec();

    return NextResponse.json(articleWithAuthor, { status: 201 });

  } catch (error) {
    console.error('Erreur lors de la création de l\'article:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de l\'article' },
      { status: 500 }
    );
  }
}

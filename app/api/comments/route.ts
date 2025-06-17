import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Comment from '@/models/comment.model.js';
import mongoose from 'mongoose';

// GET - Récupérer tous les commentaires
export async function GET() {
  try {
    console.log('Tentative de connexion à la base de données...');
    await connectDB();
    console.log('Connexion réussie à MongoDB');
    
    const comments = await Comment.find({})
      .populate('idUser', 'username email')
      .populate('idArticle', 'title')
      .sort({ createdAt: -1 });
    
    return NextResponse.json(comments);
  } catch (error) {
    console.error('Erreur détaillée lors de la récupération des commentaires:', {
      error,
      message: error instanceof Error ? error.message : 'Erreur inconnue'
    });
    return NextResponse.json(
      { 
        error: 'Erreur lors de la récupération des commentaires',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    );
  }
}

// POST - Créer un nouveau commentaire
export async function POST(request: Request) {
  try {
    console.log('Démarrage de la création du commentaire...');
    await connectDB();
    console.log('Connexion à MongoDB réussie');
    
    let body;
    try {
      body = await request.json();
      console.log('Body reçu:', body);
    } catch (e) {
      return NextResponse.json(
        { error: 'Body de requête invalide' },
        { status: 400 }
      );
    }
    
    const { content, idUser, idArticle } = body;

    // Vérification des champs requis
    if (!content || !idUser || !idArticle) {
      console.log('Validation échouée. Valeurs reçues:', { 
        content: content || 'manquant',
        idUser: idUser || 'manquant',
        idArticle: idArticle || 'manquant'
      });
      
      return NextResponse.json(
        { 
          error: 'Champs requis manquants',
          details: {
            content: !content ? 'Contenu manquant' : 'OK',
            idUser: !idUser ? 'ID utilisateur manquant' : 'OK',
            idArticle: !idArticle ? 'ID article manquant' : 'OK'
          }
        },
        { status: 400 }
      );
    }

    // Vérification des IDs valides
    if (!mongoose.Types.ObjectId.isValid(idUser) || !mongoose.Types.ObjectId.isValid(idArticle)) {
      return NextResponse.json(
        { error: 'ID utilisateur ou article invalide' },
        { status: 400 }
      );
    }    // Vérification que l'utilisateur et l'article existent
    try {
      const [userExists, articleExists] = await Promise.all([
        mongoose.model('User').findById(idUser),
        mongoose.model('Article').findById(idArticle)
      ]);

      if (!userExists) {
        return NextResponse.json(
          { error: 'Utilisateur non trouvé' },
          { status: 404 }
        );
      }

      if (!articleExists) {
        return NextResponse.json(
          { error: 'Article non trouvé' },
          { status: 404 }
        );
      }
    } catch (e) {
      console.error('Erreur lors de la vérification user/article:', e);
      return NextResponse.json(
        { error: 'Erreur lors de la vérification de l\'utilisateur ou de l\'article' },
        { status: 500 }
      );
    }

    // Création du commentaire
    console.log('Création du commentaire avec les données:', {
      content,
      idUser,
      idArticle
    });

    const newComment = await Comment.create({
      content,
      idUser,
      idArticle
    });

    console.log('Commentaire créé avec succès');

    return NextResponse.json({ 
      message: 'Commentaire créé avec succès',
      comment: newComment 
    }, { status: 201 });

  } catch (error) {
    console.error('Erreur détaillée lors de la création du commentaire:', {
      error,
      message: error instanceof Error ? error.message : 'Erreur inconnue',
      stack: error instanceof Error ? error.stack : undefined
    });
    
    return NextResponse.json(
      { 
        error: 'Erreur lors de la création du commentaire',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    );
  }
}

// OPTIONS - Définir les méthodes autorisées
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Allow': 'GET, POST',
      'Access-Control-Allow-Methods': 'GET, POST'
    }
  });
}

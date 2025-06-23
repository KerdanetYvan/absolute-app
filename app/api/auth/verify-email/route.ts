import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/user.model';

// GET - Vérifier le token d'email
export async function GET(request: Request) {
  try {
    await connectDB();
    
    // Extraire le token de l'URL
    const url = new URL(request.url);
    const token = url.searchParams.get('token');
    
    if (!token) {
      return NextResponse.json(
        { error: 'Token de vérification manquant' },
        { status: 400 }
      );
    }

    // Rechercher l'utilisateur avec ce token
    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: new Date() } // Token non expiré
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Token de vérification invalide ou expiré' },
        { status: 400 }
      );
    }    // Vérifier l'email de l'utilisateur avec updateOne pour éviter les problèmes de types
    await User.updateOne(
      { emailVerificationToken: token },
      {
        $set: { isEmailVerified: true },
        $unset: { 
          emailVerificationToken: 1,
          emailVerificationExpires: 1
        }
      }
    );

    return NextResponse.json({
      message: 'Email vérifié avec succès ! Votre compte est maintenant actif.',
      success: true
    }, { status: 200 });

  } catch (error) {
    console.error('Erreur vérification email:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la vérification de l\'email' },
      { status: 500 }
    );
  }
}

// POST - Renvoyer un email de vérification
export async function POST(request: Request) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Email requis' },
        { status: 400 }
      );
    }

    // Rechercher l'utilisateur
    const user = await User.findOne({ email });
    
    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }    // Convertir user en objet pour accéder aux propriétés
    const userObj = JSON.parse(JSON.stringify(user));

    if (userObj.isEmailVerified) {
      return NextResponse.json(
        { error: 'Email déjà vérifié' },
        { status: 400 }
      );
    }

    // Générer un nouveau token si l'ancien a expiré
    const crypto = require('crypto');
    const emailVerificationToken = crypto.randomBytes(32).toString('hex');
    const emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 heures

    // Mettre à jour l'utilisateur avec le nouveau token
    await User.updateOne(
      { email },
      {
        $set: {
          emailVerificationToken,
          emailVerificationExpires
        }
      }
    );

    // Renvoyer l'email de vérification
    const { sendVerificationEmail } = require('@/lib/email');
    const emailResult = await sendVerificationEmail(email, userObj.username, emailVerificationToken);

    if (!emailResult.success) {
      return NextResponse.json(
        { error: 'Erreur lors de l\'envoi de l\'email' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Email de vérification renvoyé avec succès',
      success: true
    }, { status: 200 });

  } catch (error) {
    console.error('Erreur renvoi email:', error);
    return NextResponse.json(
      { error: 'Erreur lors du renvoi de l\'email' },
      { status: 500 }
    );
  }
}

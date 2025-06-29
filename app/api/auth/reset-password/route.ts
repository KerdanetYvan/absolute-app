import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import connectDB from '@/lib/mongodb';
import User from '@/models/user.model';

// GET - Vérifier la validité du token de réinitialisation
export async function GET(request: Request) {
  try {
    console.log('🔄 Verify reset token API called');
    
    const url = new URL(request.url);
    const token = url.searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { error: 'Token de réinitialisation manquant' },
        { status: 400 }
      );
    }

    console.log('🔍 Vérification du token:', token.substring(0, 10) + '...');

    // Connexion à la base de données
    await connectDB();
    console.log('📦 Connexion à la base de données établie');

    // Rechercher l'utilisateur avec ce token non expiré
    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: new Date() }
    });

    if (!user) {
      console.log('❌ Token invalide ou expiré');
      return NextResponse.json(
        { error: 'Token de réinitialisation invalide ou expiré' },
        { status: 400 }
      );
    }

    console.log('✅ Token valide pour l\'utilisateur:', user.username);

    return NextResponse.json({
      valid: true,
      message: 'Token valide',
      email: user.email
    });

  } catch (error) {
    console.error('❌ Erreur dans verify reset token API:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la vérification du token' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    console.log('🔄 Reset password API called');
    
    const body = await request.json();
    const { token, password } = body;

    if (!token || !password) {
      return NextResponse.json(
        { error: 'Token et mot de passe requis' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Le mot de passe doit contenir au moins 6 caractères' },
        { status: 400 }
      );
    }

    console.log('🔍 Recherche utilisateur avec token:', token.substring(0, 10) + '...');

    // Connexion à la base de données
    await connectDB();
    console.log('📦 Connexion à la base de données établie');

    // Rechercher l'utilisateur avec ce token non expiré
    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: new Date() }
    });

    if (!user) {
      console.log('❌ Token invalide ou expiré');
      return NextResponse.json(
        { error: 'Token de réinitialisation invalide ou expiré' },
        { status: 400 }
      );
    }

    console.log('👤 Utilisateur trouvé:', user.username);

    // Hasher le nouveau mot de passe
    console.log('🔐 Hashage du nouveau mot de passe...');
    const passwordHash = await bcrypt.hash(password, 10);

    // Mettre à jour le mot de passe et supprimer les tokens de réinitialisation
    await User.findByIdAndUpdate(user._id, {
      passwordHash: passwordHash,
      passwordResetToken: null,
      passwordResetExpires: null
    });

    console.log('✅ Mot de passe réinitialisé avec succès');

    return NextResponse.json({
      success: true,
      message: 'Mot de passe réinitialisé avec succès'
    });

  } catch (error) {
    console.error('❌ Erreur dans reset-password API:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la réinitialisation du mot de passe' },
      { status: 500 }
    );
  }
}

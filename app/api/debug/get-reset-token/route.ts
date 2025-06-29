import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/user.model';

// Cette API est uniquement pour les tests en développement
export async function GET(request: Request) {
  // Vérifier qu'on est en mode développement
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'API de debug non disponible en production' },
      { status: 403 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { error: 'Email requis' },
        { status: 400 }
      );
    }

    console.log('🔍 [DEBUG] Récupération token pour:', email);

    await connectDB();

    const user = await User.findOne({ email }, 'passwordResetToken passwordResetExpires');

    if (!user) {
      return NextResponse.json({ token: null, message: 'Utilisateur non trouvé' });
    }

    return NextResponse.json({
      token: user.passwordResetToken,
      expires: user.passwordResetExpires,
      hasToken: !!user.passwordResetToken
    });

  } catch (error) {
    console.error('❌ Erreur debug API:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

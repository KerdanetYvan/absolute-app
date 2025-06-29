import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import connectDB from '@/lib/mongodb';
import User from '@/models/user.model';
import { sendVerificationEmail } from '@/lib/email';

// GET - Récupérer tous les utilisateurs
export async function GET() {
  try {
    await connectDB();
    const users = await User.find({}, '-passwordHash -emailVerificationToken'); // Exclure les champs sensibles
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des utilisateurs' },
      { status: 500 }
    );
  }
}

// POST - Créer un nouvel utilisateur avec vérification email
interface CreateUserBody {
  email: string;
  username: string;
  password: string;
}

// Options - Définir les méthodes autorisées
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Allow': 'GET, POST',
      'Access-Control-Allow-Methods': 'GET, POST'
    }
  });
}

export async function POST(request: Request) {
  try {
    console.log('Tentative de connexion à la base de données...');
    await connectDB();
    console.log('Connexion réussie, lecture du body...');
    
    const body = await request.json();
    console.log('Body reçu:', body);
    
    const { email, username, password } = body;

    // Vérification des champs requis
    if (!email || !username || !password) {
      return NextResponse.json(
        { error: 'Email, username et password sont requis' },
        { status: 400 }
      );
    }

    // Validation de la longueur du mot de passe
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Le mot de passe doit contenir au moins 6 caractères' },
        { status: 400 }
      );
    }

    // Vérification si l'email existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'Cet email est déjà utilisé' },
        { status: 400 }
      );
    }

    // Vérification si le username existe déjà
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return NextResponse.json(
        { error: 'Ce nom d\'utilisateur est déjà utilisé' },
        { status: 400 }
      );
    }

    // Hashage du mot de passe
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Génération du token de vérification email
    const emailVerificationToken = crypto.randomBytes(32).toString('hex');
    const emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 heures    // Création de l'utilisateur
    const newUser = await User.create({
      email,
      username,
      passwordHash,
      isEmailVerified: false,
      emailVerificationToken,
      emailVerificationExpires
    });    // Envoi de l'email de vérification
    let emailSent = false;
    let emailPreviewUrl = null;
    let emailError = null;
    let emailHtmlContent = null;
    
    try {
      const emailResult = await sendVerificationEmail(email, username, emailVerificationToken);
      
      if (emailResult.success) {
        emailSent = true;
        emailPreviewUrl = emailResult.previewUrl; // URL pour Ethereal Mail si disponible
        emailHtmlContent = emailResult.htmlContent; // Contenu HTML de l'email
        console.log('✅ Email de vérification envoyé avec succès');
      } else {
        emailError = emailResult.error;
        console.warn('⚠️ Échec envoi email, mais utilisateur créé:', emailResult.error);
      }    } catch (emailErrorCatch) {
      emailError = emailErrorCatch instanceof Error ? emailErrorCatch.message : 'Erreur inconnue lors de l\'envoi d\'email';
      console.error('❌ Erreur envoi email:', emailErrorCatch);
      // On continue même si l'email échoue
    }

    // Retourner l'utilisateur sans les champs sensibles
    const userResponse = JSON.parse(JSON.stringify(newUser));
    const { passwordHash: _, emailVerificationToken: __, ...userWithoutSensitiveData } = userResponse;
    
    const response = {
      user: userWithoutSensitiveData,
      message: emailSent 
        ? 'Compte créé avec succès. Veuillez vérifier votre email pour activer votre compte.'
        : 'Compte créé avec succès, mais l\'email de vérification n\'a pas pu être envoyé. Vous pouvez demander un nouvel email plus tard.',
      requiresEmailVerification: true,
      emailSent,
      ...(emailError && { emailError }),
      ...(emailPreviewUrl && process.env.NODE_ENV !== 'production' && { emailPreviewUrl }),
      ...(emailHtmlContent && { emailHtmlContent })  // Ajouter le contenu HTML
    };

    return NextResponse.json(response, { status: 201 });

  } catch (error) {
    console.error('Erreur détaillée création utilisateur:', {
      error,
      message: error instanceof Error ? error.message : 'Erreur inconnue',
      stack: error instanceof Error ? error.stack : undefined
    });
    
    const errorMessage = error instanceof Error 
      ? `Erreur: ${error.message}` 
      : 'Erreur inconnue lors de la création de l\'utilisateur';
      
    return NextResponse.json(
      { 
        error: errorMessage,
        details: error instanceof Error ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

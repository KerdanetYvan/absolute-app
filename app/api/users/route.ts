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

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
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
    const emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 heures

    // Création de l'utilisateur
    const newUser = await User.create({
      email,
      username,
      passwordHash,
      isEmailVerified: false,
      emailVerificationToken,
      emailVerificationExpires
    });    // Envoi de l'email de vérification
    let emailSent = false;
    try {
      const emailResult = await sendVerificationEmail(email, username, emailVerificationToken);
      
      if (emailResult.success) {
        emailSent = true;
      } else {
        console.warn('⚠️ Échec envoi email, mais utilisateur créé:', emailResult.error);
      }
    } catch (emailError) {
      console.error('❌ Erreur envoi email:', emailError);
      // On continue même si l'email échoue
    }

    // Retourner l'utilisateur sans les champs sensibles
    const userResponse = newUser.toObject();
    const { passwordHash: _, emailVerificationToken: __, ...userWithoutSensitiveData } = userResponse;
    
    return NextResponse.json({
      user: userWithoutSensitiveData,
      message: 'Compte créé avec succès. Veuillez vérifier votre email pour activer votre compte.',
      requiresEmailVerification: true,
      emailSent
    }, { status: 201 });

  } catch (error) {
    console.error('Erreur création utilisateur:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de l\'utilisateur' },
      { status: 500 }
    );
  }
}

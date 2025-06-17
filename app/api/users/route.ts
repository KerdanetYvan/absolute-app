import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import connectDB from '@/lib/mongodb';
import User from '@/models/user.model.js';

// GET - Récupérer tous les utilisateurs
export async function GET() {
  try {
    await connectDB();
    const users = await User.find({}, '-passwordHash'); // Exclure le passwordHash
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des utilisateurs' },
      { status: 500 }
    );
  }
}

// POST - Créer un nouvel utilisateur
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

    // Vérification si l'email existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'Cet email est déjà utilisé' },
        { status: 400 }
      );
    }

    // Hashage du mot de passe
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);    console.log('Tentative de création de l\'utilisateur avec:', {
      email,
      username,
      hashedPassword: 'HIDDEN'
    });

    // Création de l'utilisateur
    const newUser = await User.create({
      email,
      username,
      passwordHash
    });

    console.log('Utilisateur créé avec succès, ID:', newUser._id);

    // Convertir en objet et retirer le passwordHash
    const userResponse = JSON.parse(JSON.stringify(newUser));
    const { passwordHash: _, ...userWithoutPassword } = userResponse;
    
    return NextResponse.json(userWithoutPassword, { status: 201 });
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

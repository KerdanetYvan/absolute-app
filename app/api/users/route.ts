import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import connectDB from '@/lib/mongodb';
import User from '@/models/user.model';

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
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Création de l'utilisateur
    const newUser = await User.create({
      email,
      username,
      passwordHash
    });    // Retourner l'utilisateur sans le passwordHash
    const userResponse = newUser.toObject();
    const { passwordHash: _, ...userWithoutPassword } = userResponse;
    
    return NextResponse.json(userWithoutPassword, { status: 201 });

  } catch (error) {
    console.error('Erreur création utilisateur:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de l\'utilisateur' },
      { status: 500 }
    );
  }
}

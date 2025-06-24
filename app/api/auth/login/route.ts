import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/mongodb';
import User from '@/models/user.model';

export async function POST(request: Request) {
  try {
    console.log('🔄 Login API called');
    
    const body = await request.json();
    console.log('Method: POST');
    console.log('📨 Request body:', body);

    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email et mot de passe requis' },
        { status: 400 }
      );
    }

    console.log('🔍 Looking for user:', email);

    // Connexion à la base de données
    console.log('🔄 Connecting to database...');
    await connectDB();
    console.log('✅ Database connected');

    // Rechercher l'utilisateur
    console.log('🔄 Getting User model...');
    console.log('✅ User model loaded:', typeof User);
    console.log('✅ User model name:', User.modelName || 'Unknown');

    console.log('🔍 Searching for user...');
    const user = await User.findOne({ email });
    console.log('👤 User found:', user ? 'Yes' : 'No');

    if (!user) {
      console.log('❌ User not found');
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    // Convertir en objet pour accéder aux propriétés
    const userObj = JSON.parse(JSON.stringify(user));
    
    // Vérifier si l'email est vérifié
    if (!userObj.isEmailVerified) {
      console.log('❌ Email not verified');
      return NextResponse.json(
        { error: 'Veuillez vérifier votre email avant de vous connecter' },
        { status: 401 }
      );
    }

    console.log('🔐 Checking password...');
    // Vérifier le mot de passe (utiliser passwordHash, pas password)
    const isPasswordValid = await bcrypt.compare(password, userObj.passwordHash);
    console.log('🔐 Password valid:', isPasswordValid);

    if (!isPasswordValid) {
      console.log('❌ Invalid password');
      return NextResponse.json(
        { error: 'Mot de passe incorrect' },
        { status: 401 }
      );
    }    // Générer le token JWT
    console.log('🔑 Generating JWT token...');
    
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('JWT_SECRET not defined');
    }

    const token = jwt.sign(
      { 
        id: userObj._id, 
        email: userObj.email, 
        username: userObj.username 
      },
      jwtSecret,
      { expiresIn: '24h' }
    );

    console.log('✅ Login successful');

    // Créer la réponse avec le cookie
    const response = NextResponse.json({
      success: true,
      message: 'Connexion réussie',
      user: {
        id: userObj._id,
        email: userObj.email,
        username: userObj.username,
        isEmailVerified: userObj.isEmailVerified
      }
    });

    // Définir le cookie JWT
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 86400 // 24 heures
    });

    return response;

  } catch (error) {
    console.error('❌ Login error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la connexion' },
      { status: 500 }
    );
  }
}

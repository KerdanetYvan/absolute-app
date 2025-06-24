import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/user.model';

export async function GET() {
  try {
    await dbConnect();
    
    // Récupérer les utilisateurs non vérifiés avec token
    const users = await User.find({ 
      isEmailVerified: false,
      emailVerificationToken: { $exists: true, $ne: null }
    })
    .select('username email isEmailVerified emailVerificationToken emailVerificationExpires')
    .limit(5);
    
    return NextResponse.json({ users });
  } catch (error) {
    console.error('Erreur récupération utilisateurs:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des utilisateurs' },
      { status: 500 }
    );
  }
}

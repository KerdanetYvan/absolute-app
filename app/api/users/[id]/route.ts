import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import connectDB from '@/lib/mongodb';
const User = require('@/models/user.model.js');

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const { id } = params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'ID utilisateur invalide' }, { status: 400 });
    }
    const user = await User.findById(id, '-passwordHash');
    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: 'Erreur lors de la récupération de l\'utilisateur' }, { status: 500 });
  }
}

// PATCH - Modifier un utilisateur

interface UpdateUserBody {
  email?: string;
  username?: string;
  password?: string;
}

export async function PATCH(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const { email, username, password } = body as UpdateUserBody;
    
    // Vérification qu'au moins un champ est fourni
    if (!email && !username && !password) {
      return NextResponse.json(
        { error: 'Au moins un champ doit être fourni pour la mise à jour' },
        { status: 400 }
      );
    }

    // Récupération de l'ID utilisateur depuis l'URL
    const userId = request.url.split('/').pop();
    if (!userId) {
      return NextResponse.json(
        { error: 'ID utilisateur requis' },
        { status: 400 }
      );
    }

    // Vérification si l'utilisateur existe
    const existingUser = await User.findById(userId);
    if (!existingUser) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    // Vérification si le nouvel email est déjà utilisé
    if (email && email !== existingUser.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return NextResponse.json(
          { error: 'Cet email est déjà utilisé' },
          { status: 400 }
        );
      }
    }

    // Préparation des données à mettre à jour
    const updateData: any = {};
    if (email) updateData.email = email;
    if (username) updateData.username = username;
    if (password) {
      const saltRounds = 10;
      updateData.passwordHash = await bcrypt.hash(password, saltRounds);
    }

    // Mise à jour de l'utilisateur
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, select: '-passwordHash' }
    );

    return NextResponse.json(updatedUser, { status: 200 });

  } catch (error) {
    console.error('Erreur mise à jour utilisateur:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour de l\'utilisateur' },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer un utilisateur

// ...existing code...

export async function DELETE(request: Request) {
  try {
    await connectDB();

    // Récupération de l'ID utilisateur depuis l'URL
    const userId = request.url.split('/').pop();
    if (!userId) {
      return NextResponse.json(
        { error: 'ID utilisateur requis' },
        { status: 400 }
      );
    }

    // Vérification si l'utilisateur existe
    const existingUser = await User.findById(userId);
    if (!existingUser) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    // Suppression de l'utilisateur
    await User.findByIdAndDelete(userId);

    return NextResponse.json(
      { message: 'Utilisateur supprimé avec succès' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Erreur suppression utilisateur:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de l\'utilisateur' },
      { status: 500 }
    );
  }
}
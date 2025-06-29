import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import connectDB from '@/lib/mongodb';
import User from '@/models/user.model.js';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    console.log('🔍 API GET /api/users/[id] - Début de la requête');
    await connectDB();
    console.log('📦 Connexion à MongoDB établie');
    
    const { id } = await params;
    console.log('🆔 ID reçu:', id);
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log('❌ ID invalide:', id);
      return NextResponse.json({ error: 'ID utilisateur invalide' }, { status: 400 });
    }
    
    console.log('🔍 Recherche utilisateur avec ID:', id);
    const user = await User.findById(id, '-passwordHash');
    console.log('👤 Utilisateur trouvé:', !!user);
    
    if (!user) {
      console.log('❌ Utilisateur non trouvé pour ID:', id);
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }
    
    console.log('✅ Utilisateur récupéré avec succès');
    return NextResponse.json(user);
  } catch (error) {
    console.error('❌ Erreur dans GET /api/users/[id]:', error);
    return NextResponse.json({ error: 'Erreur lors de la récupération de l\'utilisateur' }, { status: 500 });
  }
}

// PATCH - Modifier un utilisateur

interface UpdateUserBody {
  email?: string;
  username?: string;
  password?: string;
  isAdmin?: boolean;
  currentPassword?: string;
  profilePicture?: string;
  bannerPicture?: string;
  latitude?: number;
  longitude?: number;
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const body = await request.json();

    const { 
      email, 
      username, 
      password, 
      currentPassword,
      profilePicture,
      bannerPicture,
      latitude,
      longitude,
      isAdmin 
    } = body as UpdateUserBody;
    
    // Vérification qu'au moins un champ est fourni
    if (!email && !username && !password && !profilePicture && !bannerPicture && latitude === undefined && longitude === undefined && typeof isAdmin === 'undefined') {

      return NextResponse.json(
        { error: 'Au moins un champ doit être fourni pour la mise à jour' },
        { status: 400 }
      );
    }

    // Récupération de l'ID utilisateur depuis les paramètres
    const { id: userId } = await params;
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { error: 'ID utilisateur requis ou invalide' },
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

    // Vérification si le nouveau nom d'utilisateur est déjà utilisé
    if (username && username !== existingUser.username) {
      const usernameExists = await User.findOne({ username });
      if (usernameExists) {
        return NextResponse.json(
          { error: 'Ce nom d\'utilisateur est déjà utilisé' },
          { status: 400 }
        );
      }
    }

    // Vérification du mot de passe actuel si un nouveau mot de passe est fourni
    if (password) {
      if (!currentPassword) {
        return NextResponse.json(
          { error: 'Le mot de passe actuel est requis pour changer le mot de passe' },
          { status: 400 }
        );
      }

      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, existingUser.passwordHash);
      if (!isCurrentPasswordValid) {
        return NextResponse.json(
          { error: 'Le mot de passe actuel est incorrect' },
          { status: 400 }
        );
      }
    }

    // Préparation des données à mettre à jour
    const updateData: any = {};
    if (email) updateData.email = email;
    if (username) updateData.username = username;
    if (typeof isAdmin !== 'undefined') updateData.isAdmin = isAdmin; // Ajouté
    if (password) {
      const saltRounds = 10;
      updateData.passwordHash = await bcrypt.hash(password, saltRounds);
    }
    if (profilePicture !== undefined) updateData.profilePicture = profilePicture || null;
    if (bannerPicture !== undefined) updateData.bannerPicture = bannerPicture || null;
    if (latitude !== undefined) updateData.latitude = latitude;
    if (longitude !== undefined) updateData.longitude = longitude;

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

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'ID utilisateur requis ou invalide' }, { status: 400 });
    }

    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Utilisateur supprimé avec succès' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Erreur lors de la suppression de l\'utilisateur' }, { status: 500 });
  }
}
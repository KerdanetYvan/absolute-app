import { NextResponse } from 'next/server';

// API de vérification d'email désactivée pour projet d'étude
// La vérification d'email a été supprimée de ce projet

// GET - Vérifier le token d'email (DÉSACTIVÉ)
export async function GET(request) {
  console.log('📧 Tentative d\'accès à l\'API de vérification email (désactivée)');
  
  return NextResponse.json({
    error: 'La vérification d\'email est désactivée pour ce projet d\'étude',
    message: 'Les utilisateurs sont automatiquement vérifiés lors de l\'inscription',
    disabled: true
  }, { status: 501 }); // 501 Not Implemented
}

// POST - Renvoyer un email de vérification (DÉSACTIVÉ)
export async function POST(request) {
  console.log('📧 Tentative d\'envoi d\'email de vérification (désactivé)');
  
  return NextResponse.json({
    error: 'L\'envoi d\'email de vérification est désactivé pour ce projet d\'étude',
    message: 'Les utilisateurs sont automatiquement vérifiés lors de l\'inscription',
    disabled: true
  }, { status: 501 }); // 501 Not Implemented
}

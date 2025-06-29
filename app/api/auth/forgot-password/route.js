import { NextResponse } from 'next/server';

// API de réinitialisation de mot de passe désactivée pour projet d'étude
// Cette fonctionnalité nécessiterait l'envoi d'emails, qui a été supprimé

export async function POST(request) {
  console.log('🔒 Tentative d\'utilisation de l\'API forgot-password (désactivée)');
  
  return NextResponse.json({
    error: 'La réinitialisation de mot de passe par email est désactivée pour ce projet d\'étude',
    message: 'Veuillez contacter un administrateur pour réinitialiser votre mot de passe',
    disabled: true
  }, { status: 501 }); // 501 Not Implemented
}

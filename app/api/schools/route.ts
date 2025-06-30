import { NextRequest, NextResponse } from 'next/server';
import { schoolsData } from '@/lib/schools-data';

export async function GET() {
  try {
    // Utiliser les données intégrées au lieu de lire un fichier
    console.log('🏫 Récupération des écoles depuis les données intégrées...');
    console.log('🏫 Nombre d\'écoles disponibles:', schoolsData.length);
    
    return NextResponse.json(schoolsData);
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des écoles:', error);
    return NextResponse.json({ 
      error: 'Erreur lors de la récupération des écoles', 
      details: error instanceof Error ? error.message : 'Erreur inconnue' 
    }, { status: 500 });
  }
}

// Méthode POST - ajout d'une nouvelle école (DÉSACTIVÉ - données intégrées)
export async function POST(req: NextRequest) {
  console.log('⚠️ Tentative d\'ajout d\'école - fonctionnalité désactivée (données intégrées)');
  
  return NextResponse.json({ 
    error: 'L\'ajout d\'écoles est désactivé car les données sont intégrées au code',
    message: 'Contactez un développeur pour ajouter une nouvelle école'
  }, { status: 501 });
}

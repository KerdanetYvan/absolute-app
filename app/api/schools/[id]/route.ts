import { NextRequest, NextResponse } from 'next/server';
import { schoolsData } from '@/lib/schools-data';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    console.log('🏫 Recherche école avec ID:', id);
    
    // Chercher l'école dans les données intégrées
    const school = schoolsData.find((ecole) => ecole.id === id);
    
    if (!school) {
      console.log('❌ École non trouvée avec ID:', id);
      return NextResponse.json({ error: 'École non trouvée' }, { status: 404 });
    }
    
    console.log('✅ École trouvée:', school.nom);
    return NextResponse.json(school);
  } catch (error) {
    console.error('❌ Erreur lors de la récupération de l\'école:', error);
    return NextResponse.json({ 
      error: 'Erreur lors de la récupération de l\'école',
      details: error instanceof Error ? error.message : 'Erreur inconnue'
    }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  console.log('⚠️ Tentative de modification d\'école - fonctionnalité désactivée (données intégrées)');
  
  return NextResponse.json({ 
    error: 'La modification d\'écoles est désactivée car les données sont intégrées au code',
    message: 'Contactez un développeur pour modifier une école'
  }, { status: 501 });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  console.log('⚠️ Tentative de suppression d\'école - fonctionnalité désactivée (données intégrées)');
  
  return NextResponse.json({ 
    error: 'La suppression d\'écoles est désactivée car les données sont intégrées au code',
    message: 'Contactez un développeur pour supprimer une école'
  }, { status: 501 });
}

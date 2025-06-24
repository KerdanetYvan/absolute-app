import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const filePath = path.join(process.cwd(), 'data', 'schools.json');
    const data = await readFile(filePath, 'utf-8');
    const schools = JSON.parse(data);
    const school = schools.find((e: any) => e.id === params.id);
    if (!school) {
      return NextResponse.json({ error: 'École non trouvée' }, { status: 404 });
    }
    return NextResponse.json(school);
  } catch (error) {
    return NextResponse.json({ error: 'Erreur lors de la récupération de l\'école' }, { status: 500 });
  }
}

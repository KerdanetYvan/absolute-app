import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET() {
  const tryPaths = [
    path.join(process.cwd(), 'data', 'schools.json'),
    path.join(process.cwd(), 'absolute-app', 'data', 'schools.json')
  ];
  let lastError = null;
  for (const filePath of tryPaths) {
    try {
      const data = await fs.readFile(filePath, 'utf-8');
      const schools = JSON.parse(data);
      return NextResponse.json(schools);
    } catch (error) {
      lastError = error;
      // Log pour debug
      console.error('Erreur lors de la lecture de', filePath, error);
    }
  }
  return NextResponse.json({ error: 'Erreur lors de la récupération des écoles', details: (lastError as any)?.message }, { status: 500 });
}

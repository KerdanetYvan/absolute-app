import { NextRequest, NextResponse } from 'next/server';
import { readFile, writeFile } from 'fs/promises';
import path from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const filePath = path.join(process.cwd(), 'data', 'schools.json');
    const data = await readFile(filePath, 'utf-8');
    const schools = JSON.parse(data);
    const school = schools.find((e: any) => e.id === id);
    if (!school) {
      return NextResponse.json({ error: 'École non trouvée' }, { status: 404 });
    }
    return NextResponse.json(school);
  } catch (error) {
    return NextResponse.json({ error: 'Erreur lors de la récupération de l\'école' }, { status: 500 });
  }
}

const dataFilePath = path.join(process.cwd(), "data", "schools.json");

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  // Read existing schools
  const file = await readFile(dataFilePath, "utf-8");
  const schools = JSON.parse(file);

  // Find and update the school
  const idx = schools.findIndex((s: any) => s.id === id);
  if (idx === -1) {
    return NextResponse.json({ error: "School not found" }, { status: 404 });
  }
  schools[idx] = { ...schools[idx], ...body };

  // Write back to file
  await writeFile(dataFilePath, JSON.stringify(schools, null, 2), "utf-8");

  return NextResponse.json(schools[idx]);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Read existing schools
  const file = await readFile(dataFilePath, "utf-8");
  const schools = JSON.parse(file);

  // Find and remove the school
  const idx = schools.findIndex((s: any) => s.id === id);
  if (idx === -1) {
    return NextResponse.json({ error: "School not found" }, { status: 404 });
  }
  schools.splice(idx, 1);

  // Write back to file
  await writeFile(dataFilePath, JSON.stringify(schools, null, 2), "utf-8");

  return NextResponse.json({ success: true });
}

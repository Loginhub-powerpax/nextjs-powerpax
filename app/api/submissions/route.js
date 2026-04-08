import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'submissions.json');

export async function GET() {
  try {
    const fileData = await fs.readFile(DB_PATH, 'utf-8');
    const submissions = JSON.parse(fileData);
    return NextResponse.json({ success: true, data: submissions });
  } catch (err) {
    if (err.code === 'ENOENT') {
      return NextResponse.json({ success: true, data: [] });
    }
    console.error("Failed to read submissions:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

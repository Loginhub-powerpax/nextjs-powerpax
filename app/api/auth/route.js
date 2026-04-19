import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password are required' }, { status: 400 });
    }

    // Fetch the CSV data from the Google Sheet
    const sheetUrl = 'https://docs.google.com/spreadsheets/d/1YX1nCxzZSVl-znDcfVPoWu8c8r74eXtbKwRoT7LU-eg/export?format=csv';
    const response = await fetch(sheetUrl, { cache: 'no-store' });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch sheet data: ${response.statusText}`);
    }
    
    const csvData = await response.text();
    
    // Robust CSV parsing function helper
    const splitCsvLine = (line) => {
      const result = [];
      let current = '';
      let inQuotes = false;
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
          if (inQuotes && line[i+1] === '"') {
            current += '"';
            i++;
          } else {
            inQuotes = !inQuotes;
          }
        } else if (char === ',' && !inQuotes) {
          result.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      result.push(current.trim());
      return result.map(v => v.replace(/^"|"$/g, '').trim());
    };

    const lines = csvData.split(/\r?\n/).filter(line => line.trim() !== '');
    if (lines.length === 0) throw new Error("Sheet is empty");
    
    const headers = splitCsvLine(lines[0]);
    const users = [];

    for (let i = 1; i < lines.length; i++) {
      const row = splitCsvLine(lines[i]);
      if (row.length < 2) continue;
      const user = {};
      headers.forEach((header, index) => {
        if (header) user[header] = row[index] || '';
      });
      users.push(user);
    }

    // Find the user with case-insensitive and trimmed matching
    const inputUser = username.trim().toLowerCase();
    const matchedUser = users.find(u => 
      (u.username || '').trim().toLowerCase() === inputUser && 
      (u.password || '').trim() === password.trim() && 
      (u.status || '').trim().toLowerCase() === 'active'
    );

    if (matchedUser) {
      return NextResponse.json({ 
        success: true, 
        user: matchedUser 
      });
    } else {
      return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });
    }

  } catch (error) {
    console.error('Auth api error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

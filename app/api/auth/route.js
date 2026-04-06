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
    
    // Parse CSV (basic parsing handling quotes and commas)
    const lines = csvData.split('\n').filter(line => line.trim() !== '');
    const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
    
    const users = [];
    for (let i = 1; i < lines.length; i++) {
      // Very basic CSV splitting (assumes no commas inside quotes for simplicity)
      // A more robust parser would be needed for complex data, but enough for this sheet.
      const row = lines[i].split(',').map(val => val.trim().replace(/^"|"$/g, ''));
      const user = {};
      headers.forEach((header, index) => {
        user[header] = row[index];
      });
      users.push(user);
    }

    // Find the user
    const matchedUser = users.find(u => 
      u.username === username && 
      u.password === password && 
      u.status?.toLowerCase() === 'active'
    );

    if (matchedUser) {
      return NextResponse.json({ 
        success: true, 
        user: {
          username: matchedUser.username,
          company_name: matchedUser.company_name
        } 
      });
    } else {
      return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });
    }

  } catch (error) {
    console.error('Auth api error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

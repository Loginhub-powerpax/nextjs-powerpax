import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');
    const mode = searchParams.get('mode');

    if (mode === 'refresh' && username) {
      const sheetId = '1YX1nCxzZSVl-znDcfVPoWu8c8r74eXtbKwRoT7LU-eg';
      const sheetName = 'Exhibitors';
      const sheetUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=${sheetName}`;
      const response = await fetch(sheetUrl, { cache: 'no-store' });
      const csvData = await response.text();

      const splitCsvLine = (line) => {
        const result = [];
        let current = '';
        let inQuotes = false;
        for (let i = 0; i < line.length; i++) {
          const char = line[i];
          if (char === '"') {
            if (inQuotes && line[i+1] === '"') { current += '"'; i++; }
            else { inQuotes = !inQuotes; }
          } else if (char === ',' && !inQuotes) {
            result.push(current.trim());
            current = '';
          } else { current += char; }
        }
        result.push(current.trim());
        return result.map(v => v.replace(/^"|"$/g, '').trim());
      };

      const lines = csvData.split(/\r?\n/).filter(line => line.trim() !== '');
      if (lines.length === 0) return NextResponse.json({ error: 'Sheet empty' }, { status: 400 });

      // Robust fallback headers based on identified sheet structure
      const DEFAULT_HEADERS = ['username', 'password', 'company_name', 'status', 'stallNumber', 'hallNumber'];
      let headers = splitCsvLine(lines[0]);
      let dataStartIdx = 1;

      // Detect if row 1 is actually data merged with headers (Gviz glitch) or just data
      if (headers[0] && (headers[0].includes(' ') || headers[0].toLowerCase() === 'eastman')) {
          headers = DEFAULT_HEADERS;
          dataStartIdx = 0; // Treat first row as data
      }

      const users = [];
      for (let i = dataStartIdx; i < lines.length; i++) {
        const row = splitCsvLine(lines[i]);
        if (row.length < 2) continue;
        const user = {};
        // Map to headers, but also handle the 'username Eastman' style glitch by splitting if needed
        headers.forEach((header, index) => {
          let val = row[index] || '';
          // If this is the glitched first row, try to extract the second part
          if (dataStartIdx === 0 && i === 0 && val.includes(' ')) {
              const parts = val.split(' ');
              val = parts[parts.length - 1]; // Take the actual value 'Eastman'
          }
          // Always store stall/hall as string to preserve alphanumeric values like "A12"
          user[header] = String(val);
        });
        users.push(user);
      }

      const inputUser = username.trim().toLowerCase();
      const matchedUser = users.find(u => (u.username || '').trim().toLowerCase() === inputUser);

      if (matchedUser) {
        return NextResponse.json({ success: true, user: matchedUser });
      }
    }

    return NextResponse.json({ error: 'Unsupported request' }, { status: 400 });
  } catch (err) {
    return NextResponse.json({ error: 'Interval server error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password are required' }, { status: 400 });
    }

    // Fetch the CSV data from the Google Sheet (Gviz API for high-speed sync)
    const sheetId = '1YX1nCxzZSVl-znDcfVPoWu8c8r74eXtbKwRoT7LU-eg';
    const sheetName = 'Exhibitors';
    const sheetUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=${sheetName}`;
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
    
    // Robust fallback headers based on identified sheet structure
    const DEFAULT_HEADERS = ['username', 'password', 'company_name', 'status', 'stallNumber', 'hallNumber'];
    let headers = splitCsvLine(lines[0]);
    let dataStartIdx = 1;

    // Detect if row 1 is actually data merged with headers (Gviz glitch) or just data
    if (headers[0] && (headers[0].includes(' ') || headers[0].toLowerCase() === 'eastman')) {
        headers = DEFAULT_HEADERS;
        dataStartIdx = 0; // Treat first row as data
    }

    const users = [];
    for (let i = dataStartIdx; i < lines.length; i++) {
      const row = splitCsvLine(lines[i]);
      if (row.length < 2) continue;
      const user = {};
      // Map to headers, but also handle the 'username Eastman' style glitch by splitting if needed
      headers.forEach((header, index) => {
        let val = row[index] || '';
        // If this is the glitched first row, try to extract the second part
        if (dataStartIdx === 0 && i === 0 && val.includes(' ')) {
            const parts = val.split(' ');
            val = parts[parts.length - 1]; // Take the actual value 'Eastman'
        }
        // Always store stall/hall as string to preserve alphanumeric values like "A12"
        user[header] = String(val);
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

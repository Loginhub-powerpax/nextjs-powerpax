import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Fetch the CSV data from the "Submissions" tab of your Google Sheet
    const sheetId = '1YX1nCxzZSVl-znDcfVPoWu8c8r74eXtbKwRoT7LU-eg';
    const sheetName = 'Submissions';
    // Using gviz/tq with tqx=out:csv respects quotes around fields containing commas automatically
    const sheetUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=${sheetName}`;
    
    const response = await fetch(sheetUrl, { cache: 'no-store' });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch sheet data: ${response.statusText}`);
    }
    
    const csvData = await response.text();
    
    // Parse CSV
    const lines = csvData.split(/\r?\n/).filter(line => line.trim() !== '');
    if (lines.length <= 1) {
        return NextResponse.json({ success: true, data: [] });
    }

    // Helper to split CSV row while respecting quotes and escaped quotes ("")
    const splitCsvRow = (row) => {
        const result = [];
        let current = '';
        let inQuotes = false;
        for (let i = 0; i < row.length; i++) {
            const char = row[i];
            
            if (char === '"') {
                if (inQuotes && row[i+1] === '"') {
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
        // Final pass to remove surrounding double quotes if present
        return result.map(val => val.replace(/^"|"$/g, ''));
    };

    // Define expected headers in order
    const DEFAULT_HEADERS = ['timestamp', 'username', 'authCompanyName', 'companyName', 'formId', 'formTitle', 'email', 'mobile', 'allData'];
    
    let headers = splitCsvRow(lines[0]);
    let startIdx = 1;

    // If the first row doesn't look like headers (e.g. it's a date), assume headers are missing
    if (headers[0] && headers[0].includes('T') && headers[0].includes(':') && headers[0].length > 15) {
        headers = DEFAULT_HEADERS;
        startIdx = 0; // The first row is actually data
    }
    
    const submissions = [];
    for (let i = startIdx; i < lines.length; i++) {
      const rowValues = splitCsvRow(lines[i]);
      if (rowValues.length < 2) continue;
      
      const sub = {};
      headers.forEach((header, index) => {
        let value = rowValues[index];
        if (!value) return;
        
        // Map data to expected keys
        if (header === 'allData' && value) {
            try { 
                sub['all_data'] = JSON.parse(value); 
            } catch(e) { sub['all_data'] = value; }
        } else {
            if(header === 'timestamp') sub['created_at'] = value;
            else if(header === 'authCompanyName') sub['auth_company_name'] = value;
            else if(header === 'companyName') sub['company_name'] = value;
            else if(header === 'formId') sub['form_id'] = value;
            else if(header === 'formTitle') sub['form_title'] = value;
            else sub[header] = value;
        }
      });
      submissions.push(sub);
    }

    const filteredSubmissions = submissions;

    return NextResponse.json(
      { success: true, data: filteredSubmissions },
      { headers: { 'Cache-Control': 'no-store, max-age=0' } }
    );
  } catch (err) {
    console.error("Failed to read submissions from Google Sheet:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

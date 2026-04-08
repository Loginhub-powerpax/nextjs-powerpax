import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const formTitles = {
  'F01': 'Show Directory (Company Profile & Product Index)',
  'F02': 'Directory Map Board Lettering',
  'F03': 'Exhibitor Name Badges',
  'F04': 'Fascia Name - Shell Scheme Package',
  'F05': 'Additional Furniture Requirements',
  'F06': 'Electricity Charges for Designer Stalls'
};

const DB_PATH = path.join(process.cwd(), 'submissions.json');

export async function POST(req) {
  try {
    const data = await req.json();
    
    // 1. Prepare data record
    const newSubmission = {
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
      username: data.username || 'Unknown',
      auth_company_name: data.authCompanyName || data.companyName || 'Unknown',
      company_name: data.companyName || data.authCompanyName || 'Unknown',
      form_id: data.formId || 'N/A',
      form_title: formTitles[data.formId] || 'General Submission',
      email: data.email || null,
      mobile: data.mobile || null,
      all_data: data
    };

    // 2. Read existing local database file
    let submissions = [];
    try {
      const fileData = await fs.readFile(DB_PATH, 'utf-8');
      submissions = JSON.parse(fileData);
    } catch (err) {
      // If file doesn't exist, create an empty array
      if (err.code === 'ENOENT') {
        submissions = [];
      } else {
        throw err;
      }
    }

    // 3. Append and save
    submissions.unshift(newSubmission); // Add to top
    await fs.writeFile(DB_PATH, JSON.stringify(submissions, null, 2));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Submission error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}


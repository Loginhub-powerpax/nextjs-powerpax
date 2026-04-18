import { NextResponse } from 'next/server';

const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxcArvSnyb9Vkf890iCn3WZyFeT1N8HFy8Omlqnj9CqC8gWCJOSAZfgGvaJu9p_Z_7c/exec'; 

const formTitles = {
  'F01': 'Show Directory (Company Profile & Product Index)',
  'F02': 'Directory Map Board Lettering',
  'F03': 'Exhibitor Name Badges',
  'F04': 'Fascia Name - Shell Scheme Package',
  'F05': 'Additional Furniture Requirements',
  'F06': 'Electricity Charges for Designer Stalls'
};

export async function POST(req) {
  try {
    const data = await req.json();
    
    // Prepare data record for Google Sheets
    const submission = {
      timestamp: new Date().toISOString(),
      username: data.username || 'Unknown',
      authCompanyName: data.authCompanyName || data.companyName || 'Unknown',
      companyName: data.companyName || data.authCompanyName || 'Unknown',
      formId: data.formId || 'N/A',
      formTitle: formTitles[data.formId] || 'General Submission',
      email: data.email || null,
      mobile: data.mobile || null,
      allData: JSON.stringify(data) // Store the full object as a string
    };

    // Send to Google Sheets Apps Script
    // Note: We use a try-catch for the fetch specifically
    try {
        const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            body: JSON.stringify(submission),
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (e) {
        console.warn("Google Sheets sync failed, but continuing for local feedback:", e);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Submission error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}


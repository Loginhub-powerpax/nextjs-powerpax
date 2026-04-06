import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

const formTitles = {
  'F01': 'Show Directory (Company Profile & Product Index)',
  'F02': 'Directory Map Board Lettering',
  'F03': 'Exhibitor Name Badges',
  'F04': 'Fascia Name',
  'F05': 'Insurance Coverage Public Liability Refunds'
};

export async function POST(req) {
  try {
    const data = await req.json();
    
    // 1. Store in Supabase Backend
    const { error } = await supabase.from('submissions').insert([{
      company_name: data.companyName || 'Unknown',
      form_id: data.formId || 'N/A',
      form_title: formTitles[data.formId] || 'General Submission',
      email: data.email || null,
      mobile: data.mobile || null,
      all_data: data
    }]);

    if (error) console.error("Supabase insert error:", error);

    // 2. Backup to Google Sheets Webhook
    const webhookUrl = "https://script.google.com/macros/s/AKfycbzvTkkTgTSRy2n4he4lHamY1CcBeY7pvKNATHqMr6sCmQWYsCeAM_M0CRCwaUIWK8NyLA/exec";
    
    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      await response.text(); 
    } catch(gError) {
      console.warn("Google Sheet forward failed:", gError);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Submission error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

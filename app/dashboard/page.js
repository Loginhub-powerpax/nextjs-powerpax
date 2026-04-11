"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import FormListItem from '../../components/FormListItem';
import ExhibitorManual from '../../components/ExhibitorManual';
import Image from 'next/image';

const INITIAL_MANDATORY_FORMS = [
  { id: 'F01', title: 'Show Directory (Company Profile & Product Index)', status: 'Pending', deadline: '29 Apr 2026', type: 'Mandatory' },
  { id: 'F02', title: 'Directory Map Board Lettering', status: 'Pending', deadline: '29 Apr 2026', type: 'Mandatory' },
  { id: 'F03', title: 'Exhibitor Name Badges', status: 'Pending', deadline: '29 Apr 2026', type: 'Mandatory' },
  { id: 'F04', title: 'Fascia Name - Shell Scheme Package', status: 'Pending', deadline: '29 Apr 2026', type: 'Mandatory' },
  { id: 'F05', title: 'Additional Furniture Requirements', status: 'Pending', deadline: '29 Apr 2026', type: 'Mandatory' },
  { id: 'F06', title: 'Electricity Charges for Designer Stalls', status: 'Pending', deadline: '29 Apr 2026', type: 'Mandatory' }
];

export default function DashboardPage() {
  const [mandatoryForms, setMandatoryForms] = useState(INITIAL_MANDATORY_FORMS);
  const [companyName, setCompanyName] = useState('Exhibitor Company');
  const [activeTab, setActiveTab] = useState('forms'); // 'forms' or 'manual'

  useEffect(() => {
    // Load from local storage
    if (typeof window !== 'undefined') {
      const storedName = localStorage.getItem('companyName');
      if (storedName) {
        setCompanyName(storedName);
      }

      const submittedFormsStr = localStorage.getItem('submittedForms');
      if (submittedFormsStr) {
        try {
          const submittedForms = JSON.parse(submittedFormsStr);
          setMandatoryForms(prev => prev.map(f => 
            submittedForms[f.id] ? { ...f, status: 'Complete' } : f
          ));
        } catch (err) {
          console.error("Corrupted local storage data for forms:", err);
          localStorage.removeItem('submittedForms'); // Clean up bad data
        }
      }
    }
  }, []);

  return (
    <div className="dashboard-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f8fafc', fontFamily: 'sans-serif' }}>
      <header className="dashboard-header" style={{ background: '#fff', padding: '15px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '3px solid #84cc16' }}>
        <div className="header-left">
          <span style={{ fontSize: '15px', color: '#1e293b' }}>Welcome, <strong style={{color: '#84cc16'}}>{companyName}</strong></span>
        </div>
        <div className="header-right" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
           <Link href="/powerpax-admin" style={{ fontSize: '11px', color: '#94a3b8', textDecoration: 'none' }}>Admin Access</Link>
           <i className="fas fa-user-circle" style={{ fontSize: '24px', color: '#64748b' }}></i>
        </div>
      </header>

      <div className="dashboard-tabs" style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', padding: '0 30px', background: '#fff' }}>
        <button 
          onClick={() => setActiveTab('forms')}
          style={{ padding: '15px 20px', border: 'none', background: 'none', fontSize: '14px', fontWeight: 'bold', borderBottom: activeTab === 'forms' ? '3px solid #84cc16' : '3px solid transparent', color: activeTab === 'forms' ? '#84cc16' : '#64748b', cursor: 'pointer' }}
        >
          My Forms
        </button>
        <button 
          onClick={() => setActiveTab('manual')}
          style={{ padding: '15px 20px', border: 'none', background: 'none', fontSize: '14px', fontWeight: 'bold', borderBottom: activeTab === 'manual' ? '3px solid #84cc16' : '3px solid transparent', color: activeTab === 'manual' ? '#84cc16' : '#64748b', cursor: 'pointer' }}
        >
          Exhibitor Manual
        </button>
      </div>

      <main className="dashboard-content" style={{ flex: 1, padding: '30px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '600', color: '#0f172a', marginBottom: '25px', borderBottom: '1px solid #e2e8f0', paddingBottom: '15px' }}>Dashboard</h1>

        {activeTab === 'forms' ? (
          <section className="dashboard-section">
            <div className="section-title" style={{ marginBottom: '25px' }}>
              <h2 style={{ fontSize: '18px', margin: '0 0 5px 0' }}>My Forms</h2>
              <p className="note" style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>Note : Forms labeled <span style={{ color: '#ea580c', fontWeight: 'bold' }}>Mandatory</span> must be completed.</p>
            </div>

            <div style={{ display: 'flex', gap: '20px', marginBottom: '30px', flexWrap: 'wrap' }}>
               <div style={{ flex: '1 1 60%', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '25px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                 <h4 style={{ color: '#ea580c', fontSize: '13px', textTransform: 'uppercase', marginBottom: '15px', fontWeight: 'bold' }}>IMPORTANT INFORMATION:</h4>
                 <ul style={{ paddingLeft: '20px', fontSize: '13px', lineHeight: '1.6', color: '#334155', margin: 0 }}>
                   <li style={{ color: '#ef4444', marginBottom: '8px' }}>Any onsite changes in Fascia name submitted will be charged at Rs. 2000/- per request.</li>
                   <li style={{ color: '#ef4444', marginBottom: '8px' }}>No outside Food & Beverage is allowed inside the venue premises.</li>
                   <li style={{ marginBottom: '8px' }}><strong>Valid government-issued photo ID</strong> is mandatory for venue entry.</li>
                   <li style={{ marginBottom: '8px' }}>All packing materials must be moved to designated areas by the corner of your stand. Failure to do so will result in a penalty.</li>
                   <li>Dispose of waste properly. Contact freight forwarders for storage. pathway obstructions are not allowed.</li>
                 </ul>
               </div>

              <div style={{ flex: '1 1 30%', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '25px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                 <p style={{ fontSize: '13px', color: '#475569', marginBottom: '15px', fontWeight: '500' }}>Scan QR to access Mobile Manual</p>
                 <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://powerpax.tresubmedia.com/" alt="QR" style={{ width: '110px', height: '110px' }} />
              </div>
            </div>

            <div className="form-group-section">
              <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#475569', marginBottom: '15px', textTransform: 'uppercase' }}>Mandatory forms</h3>
              <div className="form-list" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {mandatoryForms.map(form => (
                  <FormListItem key={form.id} {...form} />
                ))}
              </div>
            </div>
          </section>
        ) : (
          <section className="dashboard-section" style={{ background: '#fff', padding: '30px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
             <ExhibitorManual />
          </section>
        )}
      </main>
      
      <footer className="dashboard-footer" style={{ textAlign: 'center', padding: '20px', fontSize: '12px', color: '#94a3b8', borderTop: '1px solid #e2e8f0', background: '#fff' }}>
        <p>Copyright © PowerPax India 2026 | Safe Mode Powered by Next.js</p>
      </footer>
    </div>
  );
}

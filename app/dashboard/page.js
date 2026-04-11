"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import FormListItem from '../../components/FormListItem';
import ExhibitorManual from '../../components/ExhibitorManual';

const INITIAL_MANDATORY_FORMS = [
  { id: 'F01', title: 'Show Directory (Company Profile & Product Index)', status: 'Pending', deadline: '29 Apr 2026', type: 'Mandatory' },
  { id: 'F02', title: 'Directory Map Board Lettering', status: 'Pending', deadline: '29 Apr 2026', type: 'Mandatory' },
  { id: 'F03', title: 'Exhibitor Name Badges', status: 'Pending', deadline: '29 Apr 2026', type: 'Mandatory' },
  { id: 'F04', title: 'Fascia Name - Shell Scheme Package', status: 'Pending', deadline: '29 Apr 2026', type: 'Mandatory' },
  { id: 'F05', title: 'Additional Booth Power Supply & Lighting', status: 'Pending', deadline: '29 Apr 2026', type: 'Mandatory' },
  { id: 'F06', title: 'Additional Furniture & Water Requirement', status: 'Pending', deadline: '29 Apr 2026', type: 'Mandatory' },
];

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('forms');
  const [companyName, setCompanyName] = useState('Exhibitor');
  const [mandatoryForms, setMandatoryForms] = useState(INITIAL_MANDATORY_FORMS);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    
    if (typeof window !== 'undefined') {
      try {
        const storedName = localStorage.getItem('companyName');
        if (storedName) setCompanyName(storedName);

        const submittedFormsStr = localStorage.getItem('submittedForms');
        if (submittedFormsStr) {
          const submittedForms = JSON.parse(submittedFormsStr);
          setMandatoryForms(prev => prev.map(f => 
            submittedForms[f.id] ? { ...f, status: 'Complete' } : f
          ));
        }
      } catch (err) {
        console.error("Dashboard Safe-Hydration Error:", err);
      }
    }
  }, []);

  if (!isMounted) {
    return (
      <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#666', fontSize: '14px' }}>Loading Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f8fafc', fontFamily: 'sans-serif' }}>
      {/* Header: RESTORED NAVY BLUE BRANDING */}
      <header className="dashboard-header" style={{ background: '#fff', padding: '15px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '3px solid #FF9800' }}>
        <div className="header-left">
          <span style={{ fontSize: '15px', color: '#2c3e50', fontWeight: '500' }}>Welcome, <strong style={{color: '#FF9800'}}>{companyName}</strong></span>
        </div>
        <div className="header-right" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
           <Link href="/powerpax-admin" style={{ fontSize: '11px', color: '#94a3b8', textDecoration: 'none' }}>Admin Access</Link>
           <i className="fas fa-user-circle" style={{ fontSize: '24px', color: '#64748b' }}></i>
        </div>
      </header>

      {/* Tabs */}
      <div className="dashboard-tabs" style={{ display: 'flex', borderBottom: '1px solid #e0e0e0', padding: '0 30px', background: '#fff' }}>
        <button 
          onClick={() => setActiveTab('forms')}
          style={{ padding: '15px 20px', border: 'none', background: 'none', fontSize: '14px', fontWeight: 'bold', borderBottom: activeTab === 'forms' ? '3px solid #FF9800' : '3px solid transparent', color: activeTab === 'forms' ? '#FF9800' : '#666', cursor: 'pointer' }}
        >
          My Forms
        </button>
        <button 
          onClick={() => setActiveTab('manual')}
          style={{ padding: '15px 20px', border: 'none', background: 'none', fontSize: '14px', fontWeight: 'bold', borderBottom: activeTab === 'manual' ? '3px solid #FF9800' : '3px solid transparent', color: activeTab === 'manual' ? '#FF9800' : '#666', cursor: 'pointer' }}
        >
          Exhibitor Manual
        </button>
      </div>

      <main className="dashboard-content" style={{ flex: 1, padding: '30px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#2c3e50', marginBottom: '25px', borderBottom: '1px solid #e0e0e0', paddingBottom: '15px' }}>Dashboard</h1>

        {activeTab === 'forms' ? (
          <section className="dashboard-section">
            <div className="section-title" style={{ marginBottom: '25px' }}>
              <h2 style={{ fontSize: '20px', margin: '0 0 5px 0', color: '#2c3e50' }}>My Forms</h2>
              <p className="note" style={{ fontSize: '13px', color: '#666', margin: 0 }}>Note : Forms labeled <span style={{ color: '#FF9800', fontWeight: 'bold' }}>Mandatory</span> must be completed.</p>
            </div>

            <div style={{ display: 'flex', gap: '20px', marginBottom: '30px', flexWrap: 'wrap' }}>
               <div style={{ flex: '1 1 60%', background: '#fff', border: '1px solid #e0e0e0', borderRadius: '12px', padding: '25px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                 <h4 style={{ color: '#FF9800', fontSize: '13px', textTransform: 'uppercase', marginBottom: '15px', fontWeight: '700' }}>IMPORTANT INFORMATION:</h4>
                 <ul style={{ paddingLeft: '20px', fontSize: '13px', lineHeight: '1.6', color: '#333', margin: 0 }}>
                    <li style={{ color: '#f44336', marginBottom: '8px', fontWeight: '500' }}>Any onsite changes in Fascia name submitted will be charged at Rs. 2000/- per request.</li>
                    <li style={{ color: '#f44336', marginBottom: '8px', fontWeight: '500' }}>No outside Food & Beverage is allowed inside the venue premises.</li>
                    <li style={{ marginBottom: '8px' }}><strong>Valid government-issued photo ID</strong> is mandatory for venue entry.</li>
                    <li style={{ marginBottom: '8px' }}>All packing materials must be moved to designated areas by the corner of your stand. Failure to do so will result in a penalty.</li>
                    <li>Dispose of waste properly. Contact freight forwarders for storage. pathway obstructions are not allowed.</li>
                 </ul>
               </div>

              <div style={{ flex: '1 1 30%', background: '#fff', border: '1px solid #e0e0e0', borderRadius: '12px', padding: '25px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                 <p style={{ fontSize: '13px', color: '#666', marginBottom: '15px', fontWeight: '500' }}>Scan QR to access Mobile Manual</p>
                 <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://powerpax.tresubmedia.com/" alt="QR" style={{ width: '110px', height: '110px' }} />
              </div>
            </div>

            <div className="form-group-section" style={{ marginBottom: '30px' }}>
              <h3 style={{ fontSize: '14px', marginBottom: '15px', color: '#666', textTransform: 'uppercase', fontWeight: '600', letterSpacing: '0.5px' }}>Mandatory Forms</h3>
              <div className="form-list" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {mandatoryForms.map((form) => (
                  <FormListItem key={form.id} form={form} />
                ))}
              </div>
            </div>
          </section>
        ) : (
          <ExhibitorManual />
        )}
      </main>

      <footer className="dashboard-footer" style={{ textAlign: 'center', padding: '40px 0', borderTop: '1px solid #e0e0e0', background: '#fff' }}>
        <p style={{ margin: 0, fontSize: '12px', color: '#999' }}>Copyright &copy; 2026 PowerPax India. All rights reserved.</p>
      </footer>
    </div>
  );
}

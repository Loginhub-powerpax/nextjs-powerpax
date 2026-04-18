"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import FormListItem from '../../components/FormListItem';
import ExhibitorManual from '../../components/ExhibitorManual';
import { generateParticipationLetter } from '../../lib/LetterTemplate';
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
  const [stallNumber, setStallNumber] = useState('[Stall No.]');
  const [hallNumber, setHallNumber] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard', 'letter', 'manual', 'contact'

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  };
  const handlePrintLetter = async () => {
    if (typeof window === 'undefined') return;

    const submittedFormsStr = localStorage.getItem('submittedForms');
    const submittedForms = submittedFormsStr ? JSON.parse(submittedFormsStr) : {};

    const exhibitorDataStr = localStorage.getItem('exhibitorData');
    const exhibitorData = exhibitorDataStr ? JSON.parse(exhibitorDataStr) : {};
    
    // Extract data from Form 1 (F01) if available
    const f01Data = submittedForms['F01'] || {};
    
    // Official assignment from backend/sheet
    const officialStall = exhibitorData['Stall number'] || exhibitorData['stallNumber'];
    const officialHall = exhibitorData['Hall number'] || exhibitorData['hallNumber'];

    // Fallback logic for Stand Number
    const finalStandNumber = officialStall 
                     || submittedForms['F02']?.standNumber 
                     || submittedForms['F04']?.standNumber 
                     || submittedForms['F06']?.standNumber 
                     || standNumber;

    const letterData = {
      auth_company_name: companyName,
      company_name: f01Data.companyName || companyName,
      contactPerson: f01Data.contactPerson || '',
      address: f01Data.address || '',
      country: f01Data.country || '',
      mobile: f01Data.mobile || '',
      email: f01Data.email || '',
      standNumber: finalStandNumber,
      hallNumber: officialHall || '',
      created_at: new Date().toISOString()
    };

    await generateParticipationLetter(letterData);
  };

  useEffect(() => {
    // Load from local storage
    if (typeof window !== 'undefined') {
      const storedName = localStorage.getItem('companyName');
      if (storedName) {
        setCompanyName(storedName);
        
              // --- LIVE SYNC WITH DATABASE ---
              fetch('/api/submissions', { cache: 'no-store' })
                .then(res => res.json())
                .then(result => {
                  if (result.success && result.data) {
                    // Only look for forms belonging to THIS user
                    const userSubmissions = result.data.filter(s => 
                      (s.username === storedName || s.auth_company_name === storedName)
                    );
                    
                    const dbFullData = {};
                    userSubmissions.forEach(sub => {
                      // Important: Store the full detail object, not just 'true'
                      dbFullData[sub.form_id] = sub.all_data || {};
                    });

                    // Update UI statuses
                    setMandatoryForms(prev => prev.map(f => 
                      dbFullData[f.id] ? { ...f, status: 'Complete' } : { ...f, status: 'Pending' }
                    ));

                    // Restore full data to local memory so Participation Letter works
                    localStorage.setItem('submittedForms', JSON.stringify(dbFullData));
                  }
                })
          .catch(err => console.error("Sync error:", err));
      }

      const exhibitorDataStr = localStorage.getItem('exhibitorData');
      if (exhibitorDataStr) {
        const data = JSON.parse(exhibitorDataStr);
        if (data['Stall number'] || data['stallNumber']) setStallNumber(data['Stall number'] || data['stallNumber']);
        if (data['Hall number'] || data['hallNumber']) setHallNumber(data['Hall number'] || data['hallNumber']);
      }
    }
  }, []);

  const navItemStyle = (tab) => ({
    width: '100%',
    padding: '12px 20px',
    border: 'none',
    background: activeTab === tab ? '#84cc16' : 'transparent',
    color: activeTab === tab ? '#fff' : '#475569',
    textAlign: 'left',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    transition: 'all 0.2s'
  });

  return (
    <div className="dashboard-wrapper" style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc' }}>
      {/* Sidebar */}
      <aside className="sidebar" style={{ width: '280px', background: '#fff', borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', padding: '25px', position: 'fixed', height: '100vh' }}>
        <div className="sidebar-logo" style={{ marginBottom: '40px', textAlign: 'center' }}>
          <img 
            src="/logo.gif" 
            alt="PowerPax India" 
            style={{ width: '160px', height: 'auto', marginBottom: '5px' }}
          />
          <p style={{ fontSize: '12px', color: '#84cc16', fontWeight: 'bold', margin: 0, textTransform: 'uppercase', letterSpacing: '1px' }}>Exhibitor Portal</p>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
          <button onClick={() => setActiveTab('dashboard')} style={navItemStyle('dashboard')}>
            <i className="fas fa-th-large"></i> Dashboard
          </button>
          <button onClick={() => setActiveTab('letter')} style={navItemStyle('letter')}>
            <i className="fas fa-file-pdf"></i> Participation Letter
          </button>
          <button onClick={() => setActiveTab('manual')} style={navItemStyle('manual')}>
            <i className="fas fa-info-circle"></i> Exhibitor Manual
          </button>
          <button onClick={() => setActiveTab('contact')} style={navItemStyle('contact')}>
            <i className="fas fa-phone"></i> Contact Support
          </button>
        </nav>

        <div style={{ paddingTop: '20px', borderTop: '1px solid #e2e8f0' }}>
          <button 
            onClick={handleLogout}
            style={{ width: '100%', padding: '12px', background: '#fee2e2', color: '#ef4444', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
          >
            <i className="fas fa-sign-out-alt"></i> Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-content" style={{ flex: 1, marginLeft: '280px', display: 'flex', flexDirection: 'column' }}>
        <header className="dashboard-header" style={{ background: '#fff', padding: '15px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0' }}>
          <div className="header-left">
            <span>Welcome, <strong>{companyName}</strong></span>
          </div>
          <div className="header-right" style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <i className="fas fa-user-circle" style={{ fontSize: '24px', color: '#64748b' }}></i>
          </div>
        </header>

        <div style={{ padding: '30px', maxWidth: '1200px', width: '100%', margin: '0 auto' }}>
          {activeTab === 'dashboard' && (
            <section>
              <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '25px' }}>Quick Overview</h1>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <h4 style={{ color: '#64748b', fontSize: '14px', marginBottom: '10px' }}>Completion Status</h4>
                  <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
                    {mandatoryForms.filter(f => f.status === 'Complete').length} / {mandatoryForms.length}
                  </div>
                  <p style={{ fontSize: '12px', color: '#84cc16' }}>Mandatory forms completed</p>
                </div>
                <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', cursor: 'pointer' }} onClick={() => setActiveTab('forms')}>
                  <h4 style={{ color: '#64748b', fontSize: '14px', marginBottom: '10px' }}>Your Assignment</h4>
                  <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#1e40af' }}>
                    Stall: {stallNumber} {hallNumber ? `| Hall: ${hallNumber}` : ''}
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '30px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '25px' }}>
                 <h4 style={{ color: '#ea580c', fontSize: '13px', textTransform: 'uppercase', marginBottom: '15px', fontWeight: 'bold' }}>Important Reminders:</h4>
                 <ul style={{ paddingLeft: '20px', fontSize: '13px', lineHeight: '1.6', color: '#334155' }}>
                   <li style={{ color: '#ef4444', marginBottom: '8px' }}>Onsite fascia name changes: Rs. 2000/- penalty.</li>
                   <li style={{ color: '#ef4444', marginBottom: '8px' }}>No outside Food & Beverage allowed inside the venue.</li>
                   <li>Strict adherence to dismantling times is mandatory on 3rd May evening.</li>
                 </ul>
              </div>

              <div className="form-group-section" style={{ marginTop: '40px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#475569', marginBottom: '15px', textTransform: 'uppercase' }}>Mandatory forms</h3>
                <div className="form-list" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {mandatoryForms.map(form => (
                    <FormListItem key={form.id} {...form} />
                  ))}
                </div>
              </div>
            </section>
          )}

          {activeTab === 'letter' && (
            <section>
              <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '25px' }}>Participation Letter</h1>
              
              {(() => {
                const submittedStr = typeof window !== 'undefined' ? localStorage.getItem('submittedForms') : null;
                const submitted = submittedStr ? JSON.parse(submittedStr) : {};
                const isF01Complete = !!submitted['F01'];
                
                if (!isF01Complete) {
                  return (
                    <div style={{ background: '#fff', padding: '60px 40px', borderRadius: '12px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                      <div style={{ fontSize: '50px', color: '#94a3b8', marginBottom: '20px' }}>
                        <i className="fas fa-lock"></i>
                      </div>
                      <h2 style={{ fontSize: '22px', marginBottom: '15px', color: '#475569' }}>Letter Locked</h2>
                      <p style={{ color: '#64748b', maxWidth: '500px', margin: '0 auto 30px' }}>
                        Your official Participation Letter will be available for download once you have completed <strong>Form 1: Show Directory (Company Profile & Product Index)</strong>.
                      </p>
                      <button 
                        onClick={() => {
                            window.location.href = '/forms/F01';
                        }}
                        className="btn-save" 
                        style={{ background: '#84cc16', padding: '12px 25px', display: 'inline-flex', gap: '10px', alignItems: 'center' }}
                      >
                        Go to Form 1
                      </button>
                    </div>
                  );
                }

                return (
                  <div style={{ background: '#fff', padding: '40px', borderRadius: '12px', border: '1px solid #e2e8f0', textAlign: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                    <div style={{ fontSize: '50px', color: '#84cc16', marginBottom: '20px' }}>
                      <i className="fas fa-file-certificate"></i>
                    </div>
                    <h2 style={{ fontSize: '22px', marginBottom: '15px' }}>Download Your Certificate</h2>
                    <p style={{ color: '#64748b', maxWidth: '500px', margin: '0 auto 30px' }}>
                      Congratulations on your participation in the PowerPax India Renewable Energy Expo! Click the button below to generate and download your official branded participation letter.
                    </p>
                    <button 
                      onClick={handlePrintLetter}
                      className="btn-save" 
                      style={{ background: '#1e40af', padding: '15px 30px', fontSize: '16px', display: 'inline-flex', gap: '10px', alignItems: 'center' }}
                    >
                      <i className="fas fa-download"></i> Download Participation Letter
                    </button>
                  </div>
                );
              })()}

              <div style={{ marginTop: '40px', background: '#f8fafc', padding: '25px', borderRadius: '12px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <p style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '15px' }}>Quick Access QR Code</p>
                <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://powerpax.in/`} alt="QR" style={{ width: '120px', height: '120px', borderRadius: '8px' }} />
                <p style={{ fontSize: '12px', color: '#64748b', marginTop: '10px' }}>Scan for mobile dashboard access</p>
              </div>
            </section>
          )}

          {activeTab === 'manual' && (
            <section className="dashboard-section">
               <ExhibitorManual />
            </section>
          )}

          {activeTab === 'contact' && (
            <section>
              <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '25px' }}>Contact Support</h1>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                <div style={{ background: '#fff', padding: '25px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <h3 style={{ fontSize: '18px', color: '#1e293b', marginBottom: '15px' }}>Stall Booking</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px', color: '#475569' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Neha Chauhan:</span>
                      <strong style={{ color: '#1e293b' }}>+91 7428 693 331</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Gaurav Dubey:</span>
                      <strong style={{ color: '#1e293b' }}>+91 98185 75520</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Hemant Chauhan:</span>
                      <strong style={{ color: '#1e293b' }}>+91 99993 95282</strong>
                    </div>
                  </div>

                  <hr style={{ margin: '20px 0', border: '0', borderTop: '1px solid #e2e8f0' }} />

                  <h3 style={{ fontSize: '18px', color: '#1e293b', marginBottom: '15px' }}>Conference & Sponsorship</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px', color: '#1e293b', fontWeight: 'bold' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <i className="fas fa-phone-alt" style={{ color: '#84cc16', fontSize: '12px' }}></i>
                      <span>+91 7428 693 331</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <i className="fas fa-phone-alt" style={{ color: '#84cc16', fontSize: '12px' }}></i>
                      <span>+91 98185 75520</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}
        </div>

        <footer style={{ marginTop: 'auto', textAlign: 'center', padding: '20px', fontSize: '12px', color: '#94a3b8', borderTop: '1px solid #e2e8f0', background: '#fff' }}>
          <p>Copyright © PowerPax India 2026</p>
        </footer>
      </main>
    </div>
  );
}

"use client";

import { useState, useEffect } from 'react';
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
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard', 'forms', 'manual', 'contact'

  const handleLogout = () => {
    localStorage.removeItem('companyName');
    localStorage.removeItem('submittedForms');
    window.location.href = '/';
  };

  useEffect(() => {
    // Load from local storage
    if (typeof window !== 'undefined') {
      const storedName = localStorage.getItem('companyName');
      if (storedName) {
        setCompanyName(storedName);
      }

      const submittedFormsStr = localStorage.getItem('submittedForms');
      if (submittedFormsStr) {
        const submittedForms = JSON.parse(submittedFormsStr);
        
        setMandatoryForms(prev => prev.map(f => 
          submittedForms[f.id] ? { ...f, status: 'Complete' } : f
        ));
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
        <div className="sidebar-logo" style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '20px', color: '#1e293b', margin: 0 }}>PowerPax India</h2>
          <p style={{ fontSize: '12px', color: '#84cc16', fontWeight: 'bold', margin: 0 }}>Exhibitor Portal</p>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
          <button onClick={() => setActiveTab('dashboard')} style={navItemStyle('dashboard')}>
            <i className="fas fa-th-large"></i> Dashboard
          </button>
          <button onClick={() => setActiveTab('forms')} style={navItemStyle('forms')}>
            <i className="fas fa-file-alt"></i> My Forms
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
            <Link href="/powerpax-admin" style={{ fontSize: '11px', color: '#94a3b8', textDecoration: 'none' }}>Admin Access</Link>
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
                  <h4 style={{ color: '#64748b', fontSize: '14px', marginBottom: '10px' }}>Next Deadline</h4>
                  <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#ef4444' }}>29 Apr 2026</div>
                  <p style={{ fontSize: '12px', color: '#94a3b8' }}>All mandatory forms due by this date</p>
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
            </section>
          )}

          {activeTab === 'forms' && (
            <section className="dashboard-section">
              <div style={{ marginBottom: '25px' }}>
                <h2 style={{ fontSize: '20px', margin: 0 }}>Mandatory Forms</h2>
                <p style={{ fontSize: '13px', color: '#64748b' }}>Complete all forms below to ensure your stall compliance.</p>
              </div>

              <div className="form-list" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {mandatoryForms.map(form => (
                  <FormListItem key={form.id} {...form} />
                ))}
              </div>

              <div style={{ marginTop: '40px', background: '#f8fafc', padding: '25px', borderRadius: '12px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <p style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '15px' }}>Quick Access QR Code</p>
                <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://powerpax.tresubmedia.com/`} alt="QR" style={{ width: '120px', height: '120px', borderRadius: '8px' }} />
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
                  <h3 style={{ fontSize: '18px', color: '#1e293b', marginBottom: '15px' }}>Official Show Contractor</h3>
                  <p style={{ fontSize: '15px', color: '#1e293b', fontWeight: 'bold', marginBottom: '5px' }}>Mm Media & Exhibition</p>
                  <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '15px' }}>Himanshu Pandey / Mukesh</p>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px' }}>
                      <i className="fas fa-phone-alt" style={{ color: '#84cc16' }}></i>
                      <span>9241098989 / 97187 25782</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px' }}>
                      <i className="fas fa-envelope" style={{ color: '#84cc16' }}></i>
                      <span>Marketing@mmexhibition.com</span>
                    </div>
                  </div>
                </div>

                <div style={{ background: '#fff', padding: '25px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <h3 style={{ fontSize: '18px', color: '#1e293b', marginBottom: '15px' }}>Organiser Support</h3>
                  <p style={{ fontSize: '15px', color: '#1e293b', fontWeight: 'bold', marginBottom: '5px' }}>PowerPax India Team</p>
                  <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '15px' }}>General Enquiries & Technical Support</p>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px' }}>
                      <i className="fas fa-globe" style={{ color: '#84cc16' }}></i>
                      <a href="http://www.powerpaxindia.com" target="_blank" style={{ color: '#1e293b', textDecoration: 'none' }}>www.powerpaxindia.com</a>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}
        </div>

        <footer style={{ marginTop: 'auto', textAlign: 'center', padding: '20px', fontSize: '12px', color: '#94a3b8', borderTop: '1px solid #e2e8f0', background: '#fff' }}>
          <p>Copyright © PowerPax India 2026 | Safe Mode Active</p>
        </footer>
      </main>
    </div>
  );
}

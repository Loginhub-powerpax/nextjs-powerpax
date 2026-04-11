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
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-left">
          <span>Welcome, <strong>{companyName}</strong></span>
        </div>
        <div className="header-right">
          <i className="fas fa-user-circle"></i>
        </div>
      </header>

      <div className="dashboard-tabs" style={{ display: 'flex', borderBottom: '1px solid #ddd', padding: '0 20px', background: '#fff' }}>
        <button 
          onClick={() => setActiveTab('forms')}
          style={{ padding: '15px 20px', border: 'none', background: 'none', fontSize: '15px', fontWeight: 'bold', borderBottom: activeTab === 'forms' ? '3px solid #84cc16' : '3px solid transparent', color: activeTab === 'forms' ? '#84cc16' : '#555', cursor: 'pointer' }}
        >
          My Forms
        </button>
        <button 
          onClick={() => setActiveTab('manual')}
          style={{ padding: '15px 20px', border: 'none', background: 'none', fontSize: '15px', fontWeight: 'bold', borderBottom: activeTab === 'manual' ? '3px solid #84cc16' : '3px solid transparent', color: activeTab === 'manual' ? '#84cc16' : '#555', cursor: 'pointer' }}
        >
          Exhibitor Manual
        </button>
      </div>

      <main className="dashboard-content" style={{ marginTop: '20px' }}>
        
        <h1 style={{ fontSize: '24px', fontWeight: '600', color: '#0f172a', marginBottom: '20px', borderBottom: '2px solid #e2e8f0', paddingBottom: '10px' }}>Dashboard</h1>

        {activeTab === 'forms' ? (
          <section className="dashboard-section">
            <div className="section-title">
              <h2>My Forms</h2>
              <p className="note">Note : Forms labeled <span className="text-orange">Mandatory</span> must be completed.</p>
            </div>

            <div style={{ display: 'flex', gap: '20px', marginBottom: '30px', flexWrap: 'wrap' }}>
               <div style={{ flex: '1 1 65%', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                 <h4 style={{ color: '#ea580c', fontSize: '13px', textTransform: 'uppercase', marginBottom: '15px' }}>IMPORTANT INFORMATION:</h4>
                 <ul style={{ paddingLeft: '20px', fontSize: '12px' }}>
                   <li style={{ color: '#ef4444', marginBottom: '5px' }}>Any onsite changes in Fascia name submitted will be charged at Rs. 2000/- per request.</li>
                   <li style={{ color: '#ef4444', marginBottom: '5px' }}>No outside Food & Beverage is allowed inside the venue premises.</li>
                   <li style={{ marginBottom: '5px' }}><strong>Visitors / Exhibitors must present a valid, current government-issued photo ID</strong> proving their identity at any entry point, as requested by the organiser or its assigned staff.</li>
                   <li style={{ marginBottom: '5px' }}>All packing materials like wraps, carton boxes etc. must be neatly collected and kept at the corner of your stand for the housekeeping staff to clear it. Failure to do so or littering the carpeted flooring / aisles, especially during the show opening hours will result in a penalty of Rs. 5,000/- per incident, being levied.</li>
                   <li>Dispose of empty cartons, boxes, ladders, and any waste properly. Store materials within the stand or off-site. Contact the freight forwarder for storage (if available), with charges paid by the exhibitor/contractor. Excess items cannot be stored in pathways or behind stands/panels.</li>
                 </ul>
               </div>

              <div style={{ flex: '1 1 30%', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'left', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                 <p style={{ fontSize: '14px', color: '#0f172a', marginBottom: '20px' }}>Scan below QR code to access<br/>Exhibitor Manual on your<br/>mobile</p>
                 <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://powerpax.tresubmedia.com/" alt="Exhibitor Manual QR Code" style={{ width: '120px', height: '120px' }} />
              </div>
            </div>

            <div className="form-group-section">
              <h3>Mandatory forms</h3>
              <div className="form-list">
                {mandatoryForms.map(form => (
                  <FormListItem key={form.id} {...form} />
                ))}
              </div>
            </div>
          </section>
        ) : (
          <section className="dashboard-section">
             <ExhibitorManual />
          </section>
        )}
      </main>
      
      <footer className="dashboard-footer">
        <p>Copyright © PowerPax India 2026.</p>
      </footer>
    </div>
  );
}

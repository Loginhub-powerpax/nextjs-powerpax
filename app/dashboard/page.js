"use client";

import { useState, useEffect } from 'react';
import FormListItem from '../../components/FormListItem';
import Image from 'next/image';

const INITIAL_MANDATORY_FORMS = [
  { id: 'F01', title: 'Show Directory (Company Profile & Product Index)', status: 'Pending', deadline: '25 Apr 2026', type: 'Mandatory' },
  { id: 'F02', title: 'Directory Map Board Lettering', status: 'Pending', deadline: '25 Apr 2026', type: 'Mandatory' },
  { id: 'F03', title: 'Exhibitor Name Badges', status: 'Pending', deadline: '25 Apr 2026', type: 'Mandatory' },
  { id: 'F04', title: 'Fascia Name', status: 'Pending', deadline: '25 Apr 2026', type: 'Mandatory' },
  { id: 'F05', title: 'Insurance Coverage Public Liability Refunds', status: 'Pending', deadline: '25 Apr 2026', type: 'Mandatory' },
];

const INITIAL_OPTIONAL_FORMS = [];

export default function DashboardPage() {
  const [mandatoryForms, setMandatoryForms] = useState(INITIAL_MANDATORY_FORMS);
  const [companyName, setCompanyName] = useState('Exhibitor Company');

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

      <main className="dashboard-content">
        <section className="dashboard-section">
          <div className="section-title">
            <h2>My Forms</h2>
            <p className="note">Note : Forms labeled <span className="text-orange">Mandatory</span> must be completed.</p>
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
      </main>
      
      <footer className="dashboard-footer">
        <p>Copyright © PowerPax India 2026.</p>
      </footer>
    </div>
  );
}

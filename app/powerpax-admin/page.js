"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { generateParticipationLetter } from '../../lib/LetterTemplate';

export default function AdminPage() {
  const [submissions, setSubmissions] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedCompanyForms, setSelectedCompanyForms] = useState(null);
  const [error, setError] = useState(null);

  // Simple hardcoded admin password for now
  const MASTER_PASSWORD = 'powerpax-admin'; 

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === MASTER_PASSWORD) {
      setIsAuthenticated(true);
      fetchSubmissions();
    } else {
      alert("Invalid Admin Password");
    }
  };

  const handlePrintLetter = async (forms) => {
    if (!forms || forms.length === 0) return;
    
    // Aggregate data from all forms to find relevant fields
    const aggregatedData = forms.reduce((acc, f) => ({ ...acc, ...f.all_data }), {});
    
    // Find the latest metadata
    const latestSub = forms.sort((a,b) => new Date(b.created_at) - new Date(a.created_at))[0];
    
    // Make sure we have the company names
    const letterData = {
      ...aggregatedData,
      auth_company_name: latestSub.auth_company_name || latestSub.company_name || latestSub.username,
      company_name: latestSub.company_name || latestSub.username,
      created_at: latestSub.created_at
    };

    await generateParticipationLetter(letterData);
  };

  const fetchSubmissions = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/submissions');
      if (!response.ok) throw new Error('Failed to fetch data');
      const result = await response.json();
      if (!result.success) throw new Error(result.error);
      setSubmissions(result.data || []);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="login-wrapper">
        <div className="bg-overlay"></div>
        <div className="login-card" style={{ maxWidth: '400px' }}>
          <div className="card-header">
            <h1>Admin Login</h1>
            <p className="subtitle">Secure Backend Access</p>
          </div>
          <form onSubmit={handleLogin} className="login-form">
            <div className="form-group">
              <label>Master Password</label>
              <div className="input-container">
                <i className="fas fa-lock"></i>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  required 
                />
              </div>
              <p className="note" style={{marginTop: '10px'}}>Default: powerpax-admin</p>
            </div>
            <button type="submit" className="btn-login">Unlock Console</button>
          </form>
        </div>
      </div>
    );
  }

  // Group submissions by Username (or Company Name as fallback)
  const groupedSubmissions = submissions.reduce((acc, sub) => {
    const key = sub.username && sub.username !== 'Unknown' ? sub.username : sub.company_name;
    if (!acc[key]) acc[key] = [];
    acc[key].push(sub);
    return acc;
  }, {});

  return (
    <div className="dashboard-container" style={{maxWidth: '1200px', margin: '0 auto', padding: '20px'}}>
      <header className="dashboard-header" style={{marginBottom: '30px'}}>
        <div className="header-left">
          <Link href="/dashboard" className="note" style={{textDecoration: 'none'}}>← Back to Portal</Link>
          <h2 style={{marginTop: '10px'}}>PowerPax India | Submission Backend</h2>
        </div>
        <div className="header-right">
          <button onClick={fetchSubmissions} className="btn-save" style={{padding: '8px 15px', fontSize: '12px'}}>
            <i className="fas fa-sync"></i> Refresh Data
          </button>
        </div>
      </header>

      {error && (
        <div style={{ background: '#ffeeee', color: '#cc0000', padding: '15px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #ffcccc' }}>
          <strong>Connection Error:</strong> {error}
        </div>
      )}

      <main>
        <div className="card">
          <div style={{overflowX: 'auto'}}>
            <table style={{width: '100%', borderCollapse: 'collapse', fontSize: '14px'}}>
              <thead>
                <tr style={{borderBottom: '2px solid #eee', textAlign: 'left'}}>
                  <th style={{padding: '12px'}}>Latest Update</th>
                  <th style={{padding: '12px'}}>Company</th>
                  <th style={{padding: '12px'}}>Forms Filled</th>
                  <th style={{padding: '12px'}}>Contact Info</th>
                  <th style={{padding: '12px'}}>Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="5" style={{padding: '40px', textAlign: 'center'}}>Loading company profiles...</td></tr>
                ) : Object.keys(groupedSubmissions).length === 0 ? (
                  <tr><td colSpan="5" style={{padding: '40px', textAlign: 'center'}}>No submissions found.</td></tr>
                ) : (
                  Object.keys(groupedSubmissions).map(key => {
                    const forms = groupedSubmissions[key];
                    const recentSub = forms[0];
                    const filledFormIds = forms.map(f => f.form_id);
                    const allFormIds = ['F01', 'F02', 'F03', 'F04', 'F05', 'F06'];
                    
                    return (
                      <tr key={key} style={{borderBottom: '1px solid #f9f9f9'}}>
                        <td style={{padding: '12px', whiteSpace: 'nowrap'}}>{new Date(recentSub.created_at).toLocaleString()}</td>
                        <td style={{padding: '12px'}}>
                          <div style={{fontWeight: 'bold', color: '#1a1a1a'}}>{recentSub.auth_company_name || recentSub.company_name}</div>
                          <div style={{fontSize: '11px', color: '#64748b'}}>User: {key}</div>
                        </td>
                        <td style={{padding: '12px'}}>
                          <div style={{display: 'flex', gap: '4px', flexWrap: 'wrap'}}>
                            {allFormIds.map(fid => (
                              <span key={fid} style={{
                                width: '28px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '9px', borderRadius: '3px', fontWeight: 'bold',
                                background: filledFormIds.includes(fid) ? '#22c55e' : '#e2e8f0',
                                color: filledFormIds.includes(fid) ? '#fff' : '#94a3b8'
                              }}>
                                {fid}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td style={{padding: '12px', fontSize: '12px'}}>
                          <div>{recentSub.email || '-'}</div>
                          <div>{recentSub.mobile || '-'}</div>
                        </td>
                        <td style={{padding: '12px'}}>
                          <button 
                            onClick={() => setSelectedCompanyForms(forms)}
                            className="btn-save" 
                            style={{padding: '5px 12px', fontSize: '11px', background: '#333'}}>
                            View Details
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Modal for Grouped Details */}
      {selectedCompanyForms && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
          <div className="card" style={{ width: '100%', maxWidth: '900px', maxHeight: '85vh', overflowY: 'auto', position: 'relative' }}>
            <button 
              onClick={() => setSelectedCompanyForms(null)}
              style={{ position: 'absolute', top: '15px', right: '15px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '20px' }}>
              &times;
            </button>
            
            <h2 style={{marginTop: 0, marginBottom: '5px'}}>{selectedCompanyForms[0].company_name}</h2>
            <p className="note">{selectedCompanyForms.length} Forms submitted</p>
            
            {selectedCompanyForms.map(sub => (
              <div key={sub.id} style={{marginTop: '20px', border: '1px solid #e2e8f0', background: '#f8fafc', padding: '20px', borderRadius: '8px'}}>
                 <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <span className="badge-status-lbl" style={{background: '#dcfce7', color: '#16a34a', padding: '4px 8px', borderRadius: '4px', fontSize: '12px'}}>{sub.form_id}</span>
                      <h3 style={{fontSize: '16px', margin: 0, color: '#334155'}}>{sub.form_title}</h3>
                    </div>
                   <span style={{fontSize: '12px', color: '#64748b'}}>{new Date(sub.created_at).toLocaleString()}</span>
                 </div>

                 <hr style={{margin: '15px 0', border: '0', borderTop: '1px solid #e2e8f0'}} />

                 <div className="summary-list" style={{ marginTop: '0' }}>
                  {Object.entries(sub.all_data).map(([key, value]) => {
                    if (key === 'logoPreview' && value) {
                      return (
                        <div key={key} className="summary-row">
                          <strong>{key}</strong>
                          <span>
                            <img src={value} alt="Exhibitor Logo" style={{maxHeight: '100px', border: '1px solid #ddd', padding: '5px', background: '#fff'}} />
                          </span>
                        </div>
                      );
                    }
                    if (key === 'badges' && Array.isArray(value)) {
                      return (
                        <div key={key} className="summary-row" style={{flexDirection: 'column', alignItems: 'flex-start'}}>
                          <strong>Employee Badges ({value.length})</strong>
                          <div style={{width: '100%', background: '#fff', padding: '10px', borderRadius: '4px', marginTop: '10px', fontSize: '12px', border: '1px solid #e2e8f0'}}>
                            {value.map((b, i) => <div key={i} style={{marginBottom: '5px'}}>• {b.firstName} {b.lastName} ({b.type}) - {b.mobile}</div>)}
                          </div>
                        </div>
                      );
                    }
                    if (key === 'furnitureOrders' && value) {
                      const orderedItems = Object.entries(value).filter(([_, item]) => item.qty > 0);
                      if (orderedItems.length === 0) return null;
                      return (
                        <div key={key} className="summary-row" style={{flexDirection: 'column', alignItems: 'flex-start'}}>
                          <strong>Furniture Orders</strong>
                          <div style={{width: '100%', background: '#fff', padding: '10px', borderRadius: '4px', marginTop: '10px', fontSize: '12px', border: '1px solid #e2e8f0'}}>
                            {orderedItems.map(([code, item], i) => (
                               <div key={i} style={{marginBottom: '5px'}}>• Code {code}: {item.qty} units @ {item.price}/-</div>
                            ))}
                          </div>
                        </div>
                      );
                    }
                    
                    // Exclude empty values or unnecessary objects
                    if (!value || typeof value === 'object') return null;

                    return (
                      <div key={key} className="summary-row" style={{ padding: '8px 0'}}>
                        <strong style={{textTransform: 'capitalize'}}>{key.replace(/([A-Z])/g, ' $1')}</strong>
                        <span>{value}</span>
                      </div>
                    );
                  })}
                 </div>
              </div>
            ))}
            
            <div className="mt-40" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <button 
                className="btn-save" 
                onClick={() => handlePrintLetter(selectedCompanyForms)}
                style={{background: '#1e40af', padding: '10px 20px', display: 'flex', gap: '8px', alignItems: 'center'}}
              >
                <i className="fas fa-file-pdf"></i> Generate Participation Letter
              </button>
              <button className="btn-gray" onClick={() => setSelectedCompanyForms(null)}>Close View</button>
            </div>
          </div>
        </div>
      )}

      <footer className="dashboard-footer" style={{marginTop: '40px'}}>
        <p>Copyright © PowerPax India 2026 | Admin Console</p>
      </footer>
    </div>
  );
}

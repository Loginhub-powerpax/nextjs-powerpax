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
    
    const letterData = {
      ...aggregatedData,
      auth_company_name: latestSub.auth_company_name,
      company_name: latestSub.company_name,
      created_at: latestSub.created_at
    };

    // The new PDF-Lib integration automatically manages the download 
    // and opens the PDF in a new tab using the official letterhead background!
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

  // Group submissions by unique Username for maximum reliability
  // Typo-tolerant grouping: even if they type their name wrong in a form, they log in with one username
  const groupedSubmissions = submissions.reduce((acc, sub) => {
    const key = (sub.username || 'Unknown').trim();
    if (!acc[key]) acc[key] = [];
    acc[key].push(sub);
    return acc;
  }, {});

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f1f5f9', fontFamily: 'sans-serif' }}>
      {/* Left Sidebar */}
      <aside style={{ width: '280px', background: '#0f172a', color: '#fff', display: 'flex', flexDirection: 'column', boxShadow: '2px 0 10px rgba(0,0,0,0.1)' }}>
        <div style={{ padding: '30px 20px', borderBottom: '1px solid #1e293b' }}>
          <h2 style={{ margin: 0, color: '#e2e8f0', fontSize: '18px' }}>PowerPax India</h2>
          <p style={{ margin: '5px 0 0', color: '#84cc16', fontSize: '12px', fontWeight: 'bold' }}>ADMIN CONSOLE</p>
        </div>
        
        <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
          <div style={{ marginBottom: '30px' }}>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#64748b', marginBottom: '10px', fontWeight: 'bold' }}>Navigation</div>
            <button style={{ width: '100%', padding: '12px 15px', background: '#1e293b', color: '#fff', border: 'none', textAlign: 'left', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <i className="fas fa-list"></i> Submissions
            </button>
            <Link href="/dashboard" style={{ display: 'block', width: '100%', padding: '12px 15px', color: '#94a3b8', textDecoration: 'none', marginTop: '5px', borderRadius: '6px', cursor: 'pointer' }}>
              <i className="fas fa-external-link-alt" style={{marginRight: '10px'}}></i> Exhibitor Portal
            </Link>
          </div>

          {selectedCompanyForms && (
            <div style={{ background: '#1e293b', padding: '20px', borderRadius: '8px', border: '1px solid #334155' }}>
              <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#84cc16', marginBottom: '10px', fontWeight: 'bold' }}>Active Selection</div>
              <h4 style={{ margin: '0 0 15px 0', color: '#fff', fontSize: '14px', lineHeight: '1.4' }}>
                {selectedCompanyForms[0].auth_company_name || selectedCompanyForms[0].company_name || selectedCompanyForms[0].username}
              </h4>
              <button 
                onClick={() => handlePrintLetter(selectedCompanyForms)} 
                style={{ width: '100%', padding: '12px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontWeight: 'bold', fontSize: '13px', transition: 'background 0.2s' }}
                onMouseOver={(e) => e.target.style.background = '#2563eb'}
                onMouseOut={(e) => e.target.style.background = '#3b82f6'}
              >
                <i className="fas fa-file-pdf"></i> Download Letter
              </button>
            </div>
          )}
        </div>

        <div style={{ padding: '20px', borderTop: '1px solid #1e293b' }}>
          <button 
            onClick={() => setIsAuthenticated(false)} 
            style={{ width: '100%', padding: '12px', background: 'transparent', color: '#ef4444', border: '1px solid #ef4444', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontWeight: 'bold', transition: 'all 0.2s' }}
            onMouseOver={(e) => { e.target.style.background = '#ef4444'; e.target.style.color = '#fff'; }}
            onMouseOut={(e) => { e.target.style.background = 'transparent'; e.target.style.color = '#ef4444'; }}
          >
            <i className="fas fa-sign-out-alt"></i> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '40px', overflowY: 'auto', background: '#f8fafc' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h1 style={{ margin: 0, fontSize: '24px', color: '#0f172a' }}>Form Submissions</h1>
          <button onClick={fetchSubmissions} className="btn-save" style={{ padding: '10px 20px', fontSize: '13px', background: '#fff', color: '#0f172a', border: '1px solid #cbd5e1', borderRadius: '6px', cursor: 'pointer', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
            <i className="fas fa-sync" style={{ color: '#64748b', marginRight: '8px' }}></i> Refresh Data
          </button>
        </header>

        {error && (
          <div style={{ background: '#fef2f2', color: '#991b1b', padding: '15px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #fecaca' }}>
            <strong>Connection Error:</strong> {error}
          </div>
        )}

        <div className="card" style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', textAlign: 'left' }}>
                  <th style={{ padding: '15px 20px', color: '#64748b', fontWeight: '600' }}>Latest Update</th>
                  <th style={{ padding: '15px 20px', color: '#64748b', fontWeight: '600' }}>Company</th>
                  <th style={{ padding: '15px 20px', color: '#64748b', fontWeight: '600' }}>Forms Filled</th>
                  <th style={{ padding: '15px 20px', color: '#64748b', fontWeight: '600' }}>Contact Info</th>
                  <th style={{ padding: '15px 20px', color: '#64748b', fontWeight: '600', textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="5" style={{ padding: '60px', textAlign: 'center', color: '#64748b' }}><i className="fas fa-spinner fa-spin" style={{marginRight: '10px'}}></i> Loading company profiles...</td></tr>
                ) : Object.keys(groupedSubmissions).length === 0 ? (
                  <tr><td colSpan="5" style={{ padding: '60px', textAlign: 'center', color: '#64748b' }}>No submissions found.</td></tr>
                ) : (
                  Object.keys(groupedSubmissions).map(key => {
                    const forms = groupedSubmissions[key];
                    const recentSub = forms[0];
                    const filledFormIds = forms.map(f => f.form_id);
                    const allFormIds = ['F01', 'F02', 'F03', 'F04', 'F05', 'F06'];
                    
                    return (
                      <tr key={key} style={{ borderBottom: '1px solid #f1f5f9', background: selectedCompanyForms && selectedCompanyForms[0].username === recentSub.username ? '#f0fdf4' : 'transparent', transition: 'background 0.2s' }}>
                        <td style={{ padding: '15px 20px', whiteSpace: 'nowrap', color: '#475569' }}>{new Date(recentSub.created_at).toLocaleString()}</td>
                        <td style={{ padding: '15px 20px' }}>
                          <div style={{ fontWeight: 'bold', color: '#0f172a' }}>{recentSub.auth_company_name || recentSub.company_name || recentSub.username}</div>
                          <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>User: {recentSub.username}</div>
                        </td>
                        <td style={{ padding: '15px 20px' }}>
                          <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                            {allFormIds.map(fid => (
                              <span key={fid} style={{
                                width: '30px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '10px', borderRadius: '4px', fontWeight: 'bold',
                                background: filledFormIds.includes(fid) ? '#22c55e' : '#f1f5f9',
                                color: filledFormIds.includes(fid) ? '#fff' : '#cbd5e1'
                              }}>
                                {fid}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td style={{ padding: '15px 20px', fontSize: '13px', color: '#475569' }}>
                          <div style={{marginBottom: '4px'}}><i className="fas fa-envelope" style={{color: '#cbd5e1', marginRight: '6px', width: '14px'}}></i> {recentSub.email || '-'}</div>
                          <div><i className="fas fa-phone" style={{color: '#cbd5e1', marginRight: '6px', width: '14px'}}></i> {recentSub.mobile || '-'}</div>
                        </td>
                        <td style={{ padding: '15px 20px', textAlign: 'right' }}>
                          <button 
                            onClick={() => setSelectedCompanyForms(forms)}
                            style={{ padding: '8px 16px', fontSize: '12px', background: '#0f172a', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' }}>
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
        <div style={{ position: 'fixed', top: 0, left: '280px', right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.4)', zIndex: 1000, display: 'flex', padding: '0', backdropFilter: 'blur(4px)' }}>
          {/* Slide-over panel instead of center modal for better UX with a sidebar */}
          <div style={{ background: '#fff', width: '100%', maxWidth: '800px', height: '100%', marginLeft: 'auto', boxShadow: '-10px 0 30px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', animation: 'slideIn 0.3s ease-out' }}>
            <div style={{ padding: '30px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', background: '#f8fafc' }}>
               <div>
                  <h2 style={{ margin: '0 0 8px 0', color: '#0f172a', fontSize: '22px' }}>{selectedCompanyForms[0].auth_company_name || selectedCompanyForms[0].company_name}</h2>
                  <div style={{ display: 'inline-block', background: '#e0e7ff', color: '#4338ca', padding: '4px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: '600' }}>
                     {Object.keys(selectedCompanyForms.reduce((acc, f) => ({...acc, [f.form_id]: true}), {})).length} Forms Completed
                  </div>
               </div>
               <button 
                  onClick={() => setSelectedCompanyForms(null)}
                  style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#f1f5f9', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', transition: 'background 0.2s' }}
                  onMouseOver={(e) => e.target.style.background = '#e2e8f0'}
                  onMouseOut={(e) => e.target.style.background = '#f1f5f9'}
               >
                  <i className="fas fa-times" style={{fontSize: '16px'}}></i>
               </button>
            </div>
            
            <div style={{ flex: 1, padding: '30px', overflowY: 'auto' }}>
               {/* Sort and Filter: only show the latest submission for each unique form_id */}
               {Object.values(selectedCompanyForms.reduce((acc, sub) => {
                 if (!acc[sub.form_id] || new Date(sub.created_at) > new Date(acc[sub.form_id].created_at)) {
                   acc[sub.form_id] = sub;
                 }
                 return acc;
               }, {})).sort((a,b) => a.form_id.localeCompare(b.form_id)).map(sub => (
                 <div key={sub.id} style={{ marginBottom: '25px', border: '1px solid #e2e8f0', background: '#fff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', padding: '15px 20px', borderBottom: '1px solid #e2e8f0' }}>
                       <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                         <span style={{ background: '#22c55e', color: '#fff', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>{sub.form_id}</span>
                         <h3 style={{ fontSize: '16px', margin: 0, color: '#0f172a' }}>{sub.form_title}</h3>
                       </div>
                      <span style={{ fontSize: '12px', color: '#64748b' }}><i className="far fa-clock" style={{marginRight: '5px'}}></i>{new Date(sub.created_at).toLocaleString()}</span>
                    </div>

                    <div style={{ padding: '0 20px 20px 20px' }}>
                      {Object.entries(sub.all_data).map(([key, value]) => {
                       const skippedKeys = ['companyName', 'formId', 'username', 'authCompanyName', 'timestamp', 'id', 'terms', 'urn', 'status'];
                       if (skippedKeys.includes(key) || !value) return null;

                       if (key === 'logoPreview') {
                         return (
                           <div key={key} style={{ marginTop: '20px' }}>
                             <div style={{ fontSize: '12px', textTransform: 'uppercase', color: '#64748b', fontWeight: '600', marginBottom: '8px' }}>Company Logo</div>
                             <div style={{ display: 'inline-flex', flexDirection: 'column', gap: '8px' }}>
                               <img src={value} alt="Exhibitor Logo" style={{ maxHeight: '120px', border: '1px solid #e2e8f0', padding: '10px', background: '#f8fafc', borderRadius: '8px' }} />
                               <a href={value} download={`logo_${sub.auth_company_name || 'exhibitor'}.png`} style={{ fontSize: '12px', color: '#3b82f6', textDecoration: 'none', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                  <i className="fas fa-download"></i> Download Image
                               </a>
                             </div>
                           </div>
                         );
                       }

                       if (key === 'badges' && Array.isArray(value)) {
                         if (value.length === 0) return null;
                         return (
                           <div key={key} style={{ marginTop: '20px' }}>
                             <div style={{ fontSize: '12px', textTransform: 'uppercase', color: '#64748b', fontWeight: '600', marginBottom: '8px' }}>Employee Badges ({value.length})</div>
                             <div style={{ width: '100%', background: '#f8fafc', padding: '15px', borderRadius: '6px', fontSize: '13px', border: '1px solid #e2e8f0', color: '#0f172a' }}>
                               {value.map((b, i) => <div key={i} style={{ marginBottom: '8px', paddingBottom: '8px', borderBottom: i !== value.length-1 ? '1px solid #e2e8f0' : 'none' }}><span style={{fontWeight:'600'}}>{b.firstName} {b.lastName}</span> <span style={{color: '#64748b'}}>({b.type})</span><br/><i className="fas fa-mobile-alt" style={{color: '#cbd5e1', marginRight: '6px', width: '10px'}}></i>{b.mobile}</div>)}
                             </div>
                           </div>
                         );
                       }

                       if (key === 'furnitureOrders' && typeof value === 'object') {
                         const activeOrders = Object.entries(value).filter(([_, item]) => item.qty > 0);
                         if (activeOrders.length === 0) return null;
                         return (
                           <div key={key} style={{ marginTop: '20px' }}>
                             <div style={{ fontSize: '12px', textTransform: 'uppercase', color: '#64748b', fontWeight: '600', marginBottom: '8px' }}>Additional Furniture Orders</div>
                             <div style={{ width: '100%', background: '#f8fafc', padding: '15px', borderRadius: '6px', fontSize: '13px', border: '1px solid #e2e8f0', color: '#0f172a' }}>
                               {activeOrders.map(([code, item]) => <div key={code} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', paddingBottom: '6px', borderBottom: '1px dashed #e2e8f0' }}><span style={{fontWeight: '500'}}>{code}</span> <span>{item.qty} units</span></div>)}
                             </div>
                           </div>
                         );
                       }
                       
                       if (!value || typeof value === 'object') return null;

                       return (
                         <div key={key} style={{ padding: '15px 0', borderBottom: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                           <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#64748b', fontWeight: '600' }}>{key.replace(/([A-Z])/g, ' $1')}</div>
                           <div style={{ fontSize: '14px', color: '#0f172a' }}>{value}</div>
                         </div>
                       );
                     })}
                    </div>
                 </div>
               ))}
            </div>
            {/* We removed the bottom print button here since it's now beautifully positioned in the permanent left sidebar! */}
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminPage() {
  const [submissions, setSubmissions] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedSub, setSelectedSub] = useState(null);
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
                  <th style={{padding: '12px'}}>Date</th>
                  <th style={{padding: '12px'}}>Company</th>
                  <th style={{padding: '12px'}}>Form</th>
                  <th style={{padding: '12px'}}>Contact Info</th>
                  <th style={{padding: '12px'}}>Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="5" style={{padding: '40px', textAlign: 'center'}}>Loading submissions...</td></tr>
                ) : submissions.length === 0 ? (
                  <tr><td colSpan="5" style={{padding: '40px', textAlign: 'center'}}>No submissions found. Submit a form to see data here.</td></tr>
                ) : (
                  submissions.map(sub => (
                    <tr key={sub.id} style={{borderBottom: '1px solid #f9f9f9'}}>
                      <td style={{padding: '12px', whiteSpace: 'nowrap'}}>{new Date(sub.created_at).toLocaleString()}</td>
                      <td style={{padding: '12px'}}><strong>{sub.company_name}</strong></td>
                      <td style={{padding: '12px'}}>
                        <span className="badge-status-lbl" style={{background: '#e3f2fd', color: '#1976d2', padding: '4px 8px', borderRadius: '4px', fontSize: '11px'}}>
                          {sub.form_id}
                        </span>
                        <div style={{fontSize: '11px', color: '#888', marginTop: '4px'}}>{sub.form_title}</div>
                      </td>
                      <td style={{padding: '12px', fontSize: '12px'}}>
                        <div>{sub.email}</div>
                        <div>{sub.mobile}</div>
                      </td>
                      <td style={{padding: '12px'}}>
                        <button 
                          onClick={() => setSelectedSub(sub)}
                          className="btn-save" 
                          style={{padding: '5px 12px', fontSize: '11px', background: '#333'}}>
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Modal for Submission Detail */}
      {selectedSub && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
          <div className="card" style={{ width: '100%', maxWidth: '800px', maxHeight: '80vh', overflowY: 'auto', position: 'relative' }}>
            <button 
              onClick={() => setSelectedSub(null)}
              style={{ position: 'absolute', top: '15px', right: '15px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '20px' }}>
              &times;
            </button>
            
            <h2 style={{marginBottom: '5px'}}>{selectedSub.form_title}</h2>
            <p className="note">{selectedSub.company_name} | {new Date(selectedSub.created_at).toLocaleString()}</p>
            
            <hr style={{margin: '20px 0', border: '0', borderTop: '1px solid #eee'}} />
            
            <div className="summary-list">
              {Object.entries(selectedSub.all_data).map(([key, value]) => {
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
                      <div style={{width: '100%', background: '#f8f9fa', padding: '10px', borderRadius: '4px', marginTop: '10px', fontSize: '12px'}}>
                        {value.map((b, i) => <div key={i} style={{marginBottom: '5px'}}>• {b.firstName} {b.lastName} ({b.type})</div>)}
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
                      <div style={{width: '100%', background: '#f8f9fa', padding: '10px', borderRadius: '4px', marginTop: '10px', fontSize: '12px'}}>
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
                  <div key={key} className="summary-row">
                    <strong style={{textTransform: 'capitalize'}}>{key.replace(/([A-Z])/g, ' $1')}</strong>
                    <span>{value}</span>
                  </div>
                );
              })}
            </div>
            
            <div className="mt-40" style={{textAlign: 'right'}}>
              <button className="btn-gray" onClick={() => setSelectedSub(null)}>Close View</button>
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

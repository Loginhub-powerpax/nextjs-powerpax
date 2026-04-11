"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { loginAction } from './actions/auth';

export default function LoginPage() {
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleSubmit = async (formData) => {
    setIsLoading(true);
    setErrorMsg('');
    
    try {
      const result = await loginAction(formData);
      
      if (result.success) {
        localStorage.setItem('companyName', result.user.company_name);
        localStorage.setItem('exhibitorData', JSON.stringify(result.user));
        router.push('/dashboard');
      } else {
        setErrorMsg(result.error || 'Login failed');
        setIsLoading(false);
      }
    } catch (err) {
      console.error("Login catch error:", err);
      setErrorMsg("Connection error. Please try again.");
      setIsLoading(false);
    }
  };

  if (!isMounted) return null;

  return (
    <div className="login-wrapper" style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'linear-gradient(135deg, #f8fafc 0%, #cbd5e1 100%)', fontFamily: 'sans-serif' }}>
      <div className="login-card" style={{ background: '#fff', padding: '40px', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px', position: 'relative', zIndex: 10 }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <img src="/powerpax_logo.gif" alt="Logo" style={{ height: '60px', marginBottom: '20px' }} />
          <h1 style={{ fontSize: '24px', margin: '0 0 10px 0', color: '#0f172a' }}>Exhibitor Portal</h1>
          <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>Welcome back! Please login to your account.</p>
        </div>

        <form action={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '14px', fontWeight: '600', color: '#334155' }}>Username</label>
            <input 
              name="username"
              type="text" 
              placeholder="Ex: POWERPAX01" 
              required 
              style={{ padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '15px' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '14px', fontWeight: '600', color: '#334155' }}>Password</label>
            <input 
              name="password"
              type="password" 
              placeholder="••••••••" 
              required 
              style={{ padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '15px' }}
            />
          </div>

          {errorMsg && (
            <div style={{ padding: '10px', background: '#fee2e2', color: '#991b1b', borderRadius: '6px', fontSize: '13px', textAlign: 'center' }}>
              {errorMsg}
            </div>
          )}

          <button 
            type="submit" 
            disabled={isLoading}
            style={{ 
              background: '#84cc16', 
              color: '#fff', 
              padding: '14px', 
              borderRadius: '8px', 
              border: 'none', 
              fontSize: '16px', 
              fontWeight: '700', 
              cursor: 'pointer',
              marginTop: '10px'
            }}
          >
            {isLoading ? 'Verifying...' : 'Login to Portal'}
          </button>
        </form>

        <div style={{ marginTop: '30px', padding: '15px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <p style={{ margin: '0 0 5px 0', fontSize: '12px', color: '#64748b', textAlign: 'center' }}>Secure Access Environment</p>
          <p style={{ margin: 0, fontSize: '11px', color: '#94a3b8', textAlign: 'center' }}>Authorized usage only. All sessions are logged for security.</p>
        </div>
      </div>

      <footer style={{ position: 'absolute', bottom: '20px', width: '100%', textAlign: 'center', fontSize: '12px', color: '#64748b' }}>
        <p>&copy; 2026 PowerPax India. All rights reserved.</p>
        <div style={{ marginTop: '5px', fontSize: '10px', color: '#94a3b8' }}>
          Ultra-Resilience Mode Active | Static Assets Redirected
        </div>
      </footer>

      <style dangerouslySetInnerHTML={{ __html: `
        body { margin: 0; padding: 0; }
        input:focus { border-color: #84cc16 !important; outline: none !important; box-shadow: 0 0 0 3px rgba(132, 204, 22, 0.2) !important; }
      `}} />
    </div>
  );
}

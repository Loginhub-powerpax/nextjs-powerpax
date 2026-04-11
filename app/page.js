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
      {/* Background Overlay */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(135deg, rgba(255,255,255,0.7) 0%, rgba(240,248,255,0.9) 100%)', zIndex: 1 }}></div>

      <div className="login-card" style={{ background: '#fff', padding: '40px', borderRadius: '20px', boxShadow: '0 20px 50px rgba(0,0,0,0.1)', width: '90%', maxWidth: '450px', position: 'relative', zIndex: 10, border: '1px solid #e0e0e0' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <img src="/logo.gif" alt="PowerPax Logo" style={{ height: '65px', marginBottom: '20px' }} />
          <h1 style={{ fontSize: '26px', fontWeight: '700', margin: '0 0 8px 0', color: '#2c3e50', letterSpacing: '-0.5px' }}>Exhibitor Portal</h1>
          <p style={{ margin: 0, color: '#666', fontSize: '15px' }}>Please login to access your dashboard</p>
        </div>

        <form action={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '13px', fontWeight: '600', color: '#333', letterSpacing: '0.5px', textTransform: 'uppercase' }}>Username</label>
            <div style={{ position: 'relative' }}>
              <i className="fas fa-user" style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#999' }}></i>
              <input 
                name="username"
                type="text" 
                placeholder="Enter Username" 
                required 
                style={{ width: '100%', padding: '14px 15px 14px 45px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '15px', boxSizing: 'border-box' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '13px', fontWeight: '600', color: '#333', letterSpacing: '0.5px', textTransform: 'uppercase' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <i className="fas fa-lock" style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#999' }}></i>
              <input 
                name="password"
                type="password" 
                placeholder="••••••••" 
                required 
                style={{ width: '100%', padding: '14px 15px 14px 45px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '15px', boxSizing: 'border-box' }}
              />
            </div>
          </div>

          {errorMsg && (
            <div style={{ padding: '12px', background: '#fee2e2', color: '#ef4444', borderRadius: '8px', fontSize: '13px', textAlign: 'center', fontWeight: '500', border: '1px solid #fecaca' }}>
              <i className="fas fa-exclamation-circle" style={{ marginRight: '8px' }}></i>
              {errorMsg}
            </div>
          )}

          <button 
            type="submit" 
            disabled={isLoading}
            className="btn-login"
            style={{ 
              background: 'linear-gradient(135deg, #FF9800 0%, #e67e22 100%)', 
              color: '#fff', 
              padding: '16px', 
              borderRadius: '10px', 
              border: 'none', 
              fontSize: '16px', 
              fontWeight: '700', 
              cursor: 'pointer',
              marginTop: '10px',
              boxShadow: '0 8px 20px rgba(230, 126, 34, 0.3)',
              transition: 'transform 0.2s'
            }}
          >
            {isLoading ? 'Verifying Credentials...' : 'Sign In'}
          </button>
        </form>

        <div style={{ marginTop: '30px', padding: '15px', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e0e0e0', textAlign: 'center' }}>
          <p style={{ margin: 0, fontSize: '13px', color: '#666' }}>
            Forgot password? Contact <a href="mailto:support@powerpax.in" style={{ color: '#FF9800', fontWeight: '600', textDecoration: 'none' }}>Technical Support</a>
          </p>
        </div>
      </div>

      <footer style={{ position: 'absolute', bottom: '20px', width: '100%', textAlign: 'center', fontSize: '12px', color: '#666', zIndex: 2 }}>
        <p>&copy; 2026 PowerPax India. All rights reserved.</p>
        <div style={{ marginTop: '5px', fontSize: '10px', color: '#999' }}>
          Secure Authentication System | Mode: Optimized
        </div>
      </footer>
    </div>
  );
}

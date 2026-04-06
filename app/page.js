"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    // Entrance animation trigger
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      // Store company name for dashboard
      if (typeof window !== 'undefined' && data.user?.company_name) {
        localStorage.setItem('companyName', data.user.company_name);
      }

      setIsSuccess(true);
      setTimeout(() => {
          setIsSuccess(false);
          router.push('/dashboard');
      }, 1000);

    } catch (err) {
      setErrorMsg(err.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="bg-overlay"></div>
      
      <div 
        className="login-card"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 0.6s ease-out, transform 0.6s ease-out'
        }}
      >
        <div className="card-header">
          <div className="portal-logo">
            <Image 
              src="/logo.gif" 
              alt="Exhibitor Portal Logo" 
              width={180} 
              height={60}
              priority
              style={{ objectFit: 'contain' }}
            />
          </div>
          <h1>PowerPax India</h1>
          <p className="subtitle">Exhibitor Portal</p>
        </div>
        
        <form onSubmit={handleLogin} className="login-form">
          {errorMsg && (
            <div className="error-message" style={{ color: 'var(--status-rejected, #ff4757)', background: 'rgba(255, 71, 87, 0.1)', padding: '10px', borderRadius: '8px', marginBottom: '15px', fontSize: '0.9rem', textAlign: 'center' }}>
              {errorMsg}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="username">Username</label>
            <div className="input-container">
              <i className="fas fa-user"></i>
              <input 
                type="text" 
                id="username" 
                placeholder="Enter your username" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required 
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-container">
              <i className="fas fa-lock"></i>
              <input 
                type={showPassword ? "text" : "password"} 
                id="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
              <button 
                type="button" 
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </button>
            </div>
          </div>
          
          <div className="form-footer">
            <label className="remember-me">
              <input type="checkbox" /> <span>Keep me logged in</span>
            </label>
            <a href="#" className="forgot-password">Forgot password?</a>
          </div>
          
          <button 
            type="submit" 
            className="btn-login" 
            disabled={isLoading || isSuccess}
            style={isSuccess ? { backgroundColor: 'var(--success-green)' } : {}}
          >
            {isLoading ? (
              <><i className="fas fa-circle-notch fa-spin"></i> Authenticating...</>
            ) : isSuccess ? (
              <><i className="fas fa-check"></i> Success!</>
            ) : (
              <>Login <i className="fas fa-arrow-right"></i></>
            )}
          </button>
        </form>
        
        <div className="card-footer">
          <p>Need support? <a href="#">Contact Organizer</a></p>
        </div>
      </div>
      
      <footer className="portal-footer">
        <p>&copy; 2026 PowerPax India. All rights reserved.</p>
      </footer>
    </div>
  );
}

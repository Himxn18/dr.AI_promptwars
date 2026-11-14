import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  const userMenuRef = useRef(null);
  const mobileMenuRef = useRef(null);

  useEffect(() => {
    const checkAuthStatus = () => {
      const token = localStorage.getItem('userToken');
      const userName = localStorage.getItem('userName');
      const userEmail = localStorage.getItem('userEmail');
      if (token && userName) {
        setIsLoggedIn(true);
        setUser({ name: userName, email: userEmail });
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
    };
    checkAuthStatus();
    window.addEventListener('storage', checkAuthStatus);
    window.addEventListener('authChange', checkAuthStatus);
    return () => {
      window.removeEventListener('storage', checkAuthStatus);
      window.removeEventListener('authChange', checkAuthStatus);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target) &&
        !event.target.closest('.menu-btn')
      ) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Lock body scroll when menu open
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(prev => !prev);
    setIsUserMenuOpen(false);
  };

  const handleLoginClick = () => {
    navigate('/auth');
    setIsMenuOpen(false);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(prev => !prev);
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    setIsLoggedIn(false);
    setUser(null);
    setIsUserMenuOpen(false);
    setIsMenuOpen(false);
    window.dispatchEvent(new Event('authChange'));
    navigate('/');
  };

  const menuItems = [
    { title: 'Home', icon: '🏠', path: '/' },
    { title: 'Lab Reports', icon: '🧪', path: '/lab-info' },
    { title: 'Symptoms Checker', icon: '🩺', path: '/patient-info' },
    { title: 'Find Doctors', icon: '🏥', path: '/appointments' },
    { title: 'Medications', icon: '💊', path: '/medication-info' },
  ];

  const handleNavClick = (path) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav className="navbar" role="navigation" aria-label="Main navigation">
        <div className="nav-container">
          <button
            className="menu-btn"
            onClick={toggleMenu}
            aria-label="Open navigation menu"
            aria-expanded={isMenuOpen}
          >
            ☰
          </button>

          <button
            className="logo"
            onClick={() => navigate('/')}
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            aria-label="Dr. AI Home"
          >
            <img
              src="/logo.png"
              alt="Dr. AI Logo"
              style={{ width: '28px', height: '28px', objectFit: 'contain' }}
            />

            <span className="logo-text">Dr. AI</span>
          </button>

          <div className="nav-actions" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginLeft: 'auto' }}>
            <ThemeToggle />
            {isLoggedIn ? (
              <div style={{ position: 'relative' }} ref={userMenuRef}>
                <button className="user-btn" onClick={toggleUserMenu} aria-expanded={isUserMenuOpen}>
                  <span>👤</span>
                  <span style={{ maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {user?.name?.split(' ')[0]}
                  </span>
                  <span style={{ fontSize: '0.65rem', opacity: 0.7 }}>▼</span>
                </button>

                <div className={`user-dropdown ${isUserMenuOpen ? 'show' : ''}`} role="menu">
                  <div className="user-info">
                    <div className="user-name">{user?.name}</div>
                    <div className="user-email">{user?.email}</div>
                  </div>
                  <button className="dropdown-item" onClick={() => { navigate('/patient-info'); setIsUserMenuOpen(false); }} role="menuitem">
                    🩺 Symptom Check
                  </button>
                  <button className="dropdown-item" onClick={() => { navigate('/lab-info'); setIsUserMenuOpen(false); }} role="menuitem">
                    🧪 Lab Reports
                  </button>
                  <button className="dropdown-item" onClick={() => { navigate('/appointments'); setIsUserMenuOpen(false); }} role="menuitem">
                    🏥 Find Doctors
                  </button>
                  <button onClick={handleLogout} className="dropdown-item logout-btn" role="menuitem">
                    🚪 Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <button className="login-btn" onClick={handleLoginClick} id="navbar-login-btn">
                Log In
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Overlay */}
      <div
        className={`mobile-menu-overlay ${isMenuOpen ? 'show' : ''}`}
        onClick={() => setIsMenuOpen(false)}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <nav
        className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}
        ref={mobileMenuRef}
        aria-label="Mobile navigation"
        aria-hidden={!isMenuOpen}
      >
        <div className="mobile-menu-header">
          <div className="mobile-menu-logo">
            <span>🩺</span>
            <span>Dr. AI</span>
          </div>
          <button className="close-menu-btn" onClick={() => setIsMenuOpen(false)} aria-label="Close menu">
            ✕
          </button>
          {isLoggedIn && user && (
            <div style={{ marginTop: '0.75rem', padding: '0.5rem 0.75rem', background: 'rgba(255,255,255,0.06)', borderRadius: '0.5rem' }}>
              <div style={{ color: 'white', fontWeight: 600, fontSize: '0.85rem' }}>👤 {user.name}</div>
              <div style={{ color: '#94a3b8', fontSize: '0.75rem' }}>{user.email}</div>
            </div>
          )}
        </div>

        <div className="mobile-menu-items">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.625rem 1rem', margin: '0.25rem 0 0.75rem', background: 'rgba(255,255,255,0.04)', borderRadius: '0.75rem', border: '1px solid rgba(255,255,255,0.06)' }}>
            <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600 }}>Theme Mode</span>
            <ThemeToggle showLabel={true} />
          </div>
          {menuItems.map((item) => (
            <button
              key={item.path}
              className={`mobile-menu-item ${isActive(item.path) ? 'active' : ''}`}
              onClick={() => handleNavClick(item.path)}
            >
              <span className="menu-icon">{item.icon}</span>
              <span>{item.title}</span>
            </button>
          ))}

          {!isLoggedIn && (
            <button className="mobile-menu-item" onClick={handleLoginClick} style={{ color: '#14b8a6', borderTop: '1px solid rgba(255,255,255,0.08)', marginTop: '1rem' }}>
              <span className="menu-icon">🔐</span>
              <span>Log In / Register</span>
            </button>
          )}

          {isLoggedIn && (
            <button onClick={handleLogout} className="mobile-menu-item mobile-logout-btn">
              <span className="menu-icon">🚪</span>
              <span>Sign Out</span>
            </button>
          )}
        </div>

        <div style={{ padding: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <p style={{ color: '#475569', fontSize: '0.7rem', lineHeight: 1.5 }}>
            ⚠️ Dr. AI provides health information only. Always consult a qualified healthcare professional for medical advice.
          </p>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
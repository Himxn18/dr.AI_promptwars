import { useNavigate } from 'react-router-dom';

const Footer = () => {
  const navigate = useNavigate();

  const quickLinks = [
    { label: 'Home',             path: '/',               icon: '🏠' },
    { label: 'Lab Report Analysis', path: '/lab-info',   icon: '🧪' },
    { label: 'Symptoms Checker', path: '/patient-info',  icon: '🩺' },
    { label: 'Medications',      path: '/medication-info',icon: '💊' },
    { label: 'Find Doctors',     path: '/appointments',  icon: '📅' },
  ];

  const legalLinks = [
    { label: 'Medical Disclaimer', href: '#disclaimer' },
    { label: 'Privacy Policy',     href: '#privacy' },
    { label: 'Terms of Service',   href: '#terms' },
    { label: 'Contact Us',         href: 'mailto:contact@drai.health' },
  ];

  return (
    <footer className="footer" role="contentinfo">
      <div className="footer-container">
        {/* Brand Column */}
        <div className="footer-brand">
          <div className="footer-logo">
            <span style={{ fontSize: '1.6rem' }}>🩺</span>
            <span className="footer-logo-text">Dr. AI</span>
          </div>
          <p className="footer-description">
            Your intelligent AI health information assistant — helping you understand lab reports,
            check symptoms, and find trusted doctors in Guwahati and across Assam.
          </p>
          <div className="footer-emergency">
            <strong>🚨 Medical Emergency?</strong> Call <strong>108</strong> (Assam Emergency) or
            go to your nearest hospital immediately. Do not rely on AI for emergencies.
          </div>

          <div style={{ marginTop: '1.25rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {[
              { label: '🔒 Secure', bg: 'rgba(20,184,166,0.12)', color: '#2dd4bf' },
              { label: '✅ Free to Use', bg: 'rgba(16,185,129,0.12)', color: '#34d399' },
              { label: '🌐 Trilingual', bg: 'rgba(96,165,250,0.12)', color: '#93c5fd' },
            ].map(badge => (
              <span key={badge.label} style={{
                background: badge.bg,
                color: badge.color,
                padding: '0.35rem 0.875rem',
                borderRadius: '999px',
                fontSize: '0.75rem',
                fontWeight: 600,
                border: `1px solid ${badge.color}30`,
              }}>
                {badge.label}
              </span>
            ))}
          </div>

          {/* Developer Credit Badge */}
          <div className="dev-credit-badge">
            <span className="dev-credit-icon">⚕️</span>
            <div>
              <div className="dev-credit-title">Trained &amp; Developed by</div>
              <div className="dev-credit-names">Ihsan Zaman &amp; Himan Kashyap</div>
              <div className="dev-credit-sub">Guwahati, Assam · India</div>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            {quickLinks.map(link => (
              <li key={link.path}>
                <a
                  href="#"
                  onClick={(e) => { e.preventDefault(); navigate(link.path); }}
                  title={link.label}
                >
                  <span>{link.icon}</span>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Legal */}
        <div className="footer-section">
          <h4>Legal &amp; Info</h4>
          <ul>
            {legalLinks.map(link => (
              <li key={link.label}>
                <a href={link.href} target={link.href.startsWith('mailto') ? '_blank' : undefined} rel="noreferrer">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          {/* Jan Aushadhi Quick Note */}
          <div style={{ marginTop: '1.5rem' }}>
            <h4>Jan Aushadhi – Guwahati</h4>
            <ul>
              {[
                '📍 GS Road, Dispur',
                '📍 Fancy Bazar',
                '📍 Paltan Bazar',
                '📍 Ganeshguri',
                '📍 Bhangagarh',
              ].map(loc => (
                <li key={loc} style={{ cursor: 'default' }}>
                  <span style={{ color: '#475569', fontSize: '0.82rem' }}>{loc}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Disclaimer Banner */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1.25rem 0' }}>
        <div style={{
          background: 'rgba(244,63,94,0.06)',
          border: '1px solid rgba(244,63,94,0.15)',
          borderRadius: '0.75rem',
          padding: '1rem 1.5rem',
          textAlign: 'center',
        }}>
          <p style={{ color: '#94a3b8', fontSize: '0.78rem', lineHeight: 1.7 }}>
            ⚠️ <strong style={{ color: '#fca5a5' }}>Important Medical Disclaimer:</strong>{' '}
            Dr. AI provides general health information for educational purposes only. It is NOT a substitute
            for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician
            or other qualified health provider with any questions you may have regarding a medical condition.
            Never disregard professional medical advice or delay in seeking it because of something you have read on this platform.
          </p>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Dr. AI &nbsp;|&nbsp; Guwahati, Assam, India &nbsp;|&nbsp; For educational purposes only</p>
        <div className="footer-bottom-links">
          <a href="#disclaimer">Disclaimer</a>
          <a href="#privacy">Privacy</a>
          <a href="#terms">Terms</a>
          <a href="mailto:contact@drai.health">Contact</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

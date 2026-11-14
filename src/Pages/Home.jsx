import { useNavigate } from 'react-router-dom';
import Hero from '../Components/Hero';
import ChatBox from '../Components/ChatBox';
import Disclaimer from '../Components/Disclaimer';
import Features from '../Components/Features';

const Home = () => {
  const navigate = useNavigate();

  const handleStartChat = () => {
    const token = localStorage.getItem('userToken');
    navigate(token ? '/chat' : '/auth');
  };

  const handleStartAssessment  = () => navigate('/patient-info');
  const handleSearchMedications = () => navigate('/medication-info');
  const handleInterpretLabs    = () => navigate('/lab-info');
  const handleBookAppointment  = () => navigate('/appointments');

  return (
    <div className="home-page">
      <Hero />
      <ChatBox onStartChat={handleStartChat} />
      <Disclaimer />

      {/* Quick Access Cards */}
      <section style={{ padding: '2rem 2rem 1rem', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1.25rem',
          animation: 'fadeInUp 0.8s ease-out 0.9s both',
        }}>
          {[
            {
              icon: '🧪',
              title: 'Lab Report Analysis',
              desc: 'Upload or paste your lab results for an instant, easy-to-understand breakdown in English, Assamese & Hindi.',
              color: '#0d9488',
              bg: '#f0fdfa',
              border: '#99f6e4',
              onClick: handleInterpretLabs,
              label: 'Analyze Report',
              id: 'quick-lab',
            },
            {
              icon: '🩺',
              title: 'Symptom Checker',
              desc: 'Describe your symptoms and get AI-powered guidance on urgency level and when to seek care.',
              color: '#2563eb',
              bg: '#eff6ff',
              border: '#bfdbfe',
              onClick: handleStartAssessment,
              label: 'Check Symptoms',
              id: 'quick-symptoms',
            },
            {
              icon: '💊',
              title: 'Medications Info',
              desc: 'Search 62+ medicines for dosage guidance, side effects, interaction warnings, and Jan Aushadhi generics.',
              color: '#9333ea',
              bg: '#f3e8ff',
              border: '#e9d5ff',
              onClick: handleSearchMedications,
              label: 'Search Medicines',
              id: 'quick-medication',
            },
            {
              icon: '🏥',
              title: 'Find Top Doctors',
              desc: 'Browse 30+ renowned specialists at GMCH, Apollo Excelcare, Narayana Superspeciality & more across Guwahati.',
              color: '#059669',
              bg: '#f0fdf4',
              border: '#a7f3d0',
              onClick: handleBookAppointment,
              label: 'Browse Directory',
              id: 'quick-doctors',
            },
          ].map(card => (
            <div
              key={card.title}
              id={card.id}
              className="home-quick-card"
              onClick={card.onClick}
              role="button"
              tabIndex={0}
              onKeyDown={e => e.key === 'Enter' && card.onClick()}
              style={{
                background: card.bg,
                border: `1px solid ${card.border}`,
                borderRadius: '1rem',
                padding: '1.5rem',
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                position: 'relative',
                overflow: 'hidden',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = `0 12px 32px ${card.color}25`;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{ fontSize: '2.25rem', marginBottom: '0.75rem' }}>{card.icon}</div>
              <h3 style={{ color: card.color, fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.5rem', fontFamily: 'Outfit, sans-serif' }}>
                {card.title}
              </h3>
              <p className="home-quick-desc" style={{ color: '#64748b', fontSize: '0.85rem', lineHeight: 1.6, marginBottom: '1rem' }}>
                {card.desc}
              </p>
              <button
                id={`btn-${card.id}`}
                onClick={e => { e.stopPropagation(); card.onClick(); }}
                style={{
                  background: card.color,
                  color: '#ffffff',
                  border: 'none',
                  padding: '0.5rem 1.25rem',
                  borderRadius: '999px',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  fontFamily: 'Inter, sans-serif',
                  WebkitTextFillColor: '#ffffff',
                }}
              >
                {card.label} →
              </button>
            </div>
          ))}
        </div>

        {/* Educational Warning Banner */}
        <div
          className="edu-warning-banner"
          role="alert"
          style={{ marginTop: '1.75rem' }}
        >
          <span className="edu-warning-banner-icon">⚕️</span>
          <div className="edu-warning-banner-text">
            <strong>Dr. AI is not a substitute for professional medical advice</strong>
            <p>
              All AI-generated analyses, medication information, and symptom assessments are for{' '}
              <strong>educational purposes only</strong>. They do not constitute medical diagnosis or treatment.
              Always consult a qualified doctor before making any health decisions.
              In case of emergency, call <strong>108</strong> immediately.
            </p>
          </div>
        </div>
      </section>

      <Features
        onStartAssessment={handleStartAssessment}
        onSearchMedications={handleSearchMedications}
        onInterpretLabs={handleInterpretLabs}
        onBookAppointment={handleBookAppointment}
      />
    </div>
  );
};

export default Home;
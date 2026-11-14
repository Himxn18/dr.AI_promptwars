import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "AIzaSyD3N598LOwNLzzo8PDl8tUDNJxbBtyHeE0";
const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + API_KEY;

const SYMPTOM_CATEGORIES = [
  {
    category: 'Head & Neurological',
    icon: '🧠',
    symptoms: ['Headache', 'Dizziness', 'Migraine', 'Memory Loss', 'Confusion', 'Vision Changes'],
  },
  {
    category: 'Chest & Heart',
    icon: '❤️',
    symptoms: ['Chest Pain', 'Palpitations', 'Shortness of Breath', 'Rapid Heartbeat'],
  },
  {
    category: 'Digestive',
    icon: '🫀',
    symptoms: ['Nausea', 'Vomiting', 'Diarrhea', 'Constipation', 'Abdominal Pain', 'Bloating', 'Heartburn'],
  },
  {
    category: 'Fever & Infection',
    icon: '🌡️',
    symptoms: ['Fever', 'Chills', 'Night Sweats', 'Body Aches', 'Fatigue', 'Weakness'],
  },
  {
    category: 'Respiratory',
    icon: '🫁',
    symptoms: ['Cough', 'Cold', 'Runny Nose', 'Sore Throat', 'Wheezing', 'Nasal Congestion'],
  },
  {
    category: 'Skin',
    icon: '🩹',
    symptoms: ['Rash', 'Itching', 'Redness', 'Swelling', 'Hives', 'Dry Skin'],
  },
  {
    category: 'Musculoskeletal',
    icon: '🦴',
    symptoms: ['Joint Pain', 'Back Pain', 'Muscle Pain', 'Stiffness', 'Swollen Joints'],
  },
  {
    category: 'Mental Health',
    icon: '💭',
    symptoms: ['Anxiety', 'Depression', 'Insomnia', 'Mood Swings', 'Stress'],
  },
];

const AGE_RANGES = ['Under 18', '18–25', '26–35', '36–50', '51–65', '65+'];
const DURATIONS = ['Less than 24 hours', '1–3 days', '4–7 days', '1–2 weeks', 'More than 2 weeks', 'Recurring'];
const SEVERITIES = [1,2,3,4,5,6,7,8,9,10];

const SimpleMarkdown = ({ children }) => {
  if (!children) return null;
  const renderText = (text) => {
    let html = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/^# (.*$)/gm, '<h1>$1</h1>')
      .replace(/^## (.*$)/gm, '<h2>$1</h2>')
      .replace(/^### (.*$)/gm, '<h3>$1</h3>')
      .replace(/^\* (.*$)/gm, '<li>$1</li>')
      .replace(/^\d+\. (.*$)/gm, '<li>$1</li>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br>');
    html = html.replace(/(<li>.*<\/li>)/g, '<ul>$1</ul>');
    if (!html.includes('<h') && !html.includes('<ul>')) html = '<p>' + html + '</p>';
    return html;
  };
  return <div className="markdown" dangerouslySetInnerHTML={{ __html: renderText(children) }} />;
};

const PatientForm = () => {
  const navigate = useNavigate();
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [ageRange, setAgeRange] = useState('');
  const [sex, setSex] = useState('');
  const [duration, setDuration] = useState('');
  const [severity, setSeverity] = useState(5);
  const [primaryConcern, setPrimaryConcern] = useState('');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [urgencyLevel, setUrgencyLevel] = useState('');

  const toggleSymptom = (symptom) => {
    setSelectedSymptoms(prev =>
      prev.includes(symptom) ? prev.filter(s => s !== symptom) : [...prev, symptom]
    );
  };

  const handleSubmit = async () => {
    if (selectedSymptoms.length === 0 && !primaryConcern) {
      alert('Please select at least one symptom or describe your concern.');
      return;
    }
    setIsLoading(true);
    setResult('');
    setShowResult(false);

    const symptomList = selectedSymptoms.length > 0 ? selectedSymptoms.join(', ') : 'Not specified';

    const prompt = `
You are Dr. AI, a health information assistant. A patient in Guwahati, Assam has provided the following information:

**Age Range:** ${ageRange || 'Not specified'}
**Biological Sex:** ${sex || 'Not specified'}
**Duration of Symptoms:** ${duration || 'Not specified'}
**Severity (1-10):** ${severity}/10
**Selected Symptoms:** ${symptomList}
**Additional Concern:** ${primaryConcern || 'None'}

Please provide a structured health information response in the following format (use markdown):

## 🩺 Symptom Assessment

### Possible Explanations
List 2-3 possible (NOT definitive) conditions that commonly cause these symptoms, with brief explanations.

### Urgency Level
Clearly state ONE of: **SELF-CARE** | **SEE A DOCTOR (24-48 hrs)** | **URGENT (Today)** | **EMERGENCY (Call 108 Now)**
Explain why.

### Immediate Steps
What the patient can do right now at home (self-care tips if applicable).

### When to Seek Care
Specific warning signs that mean they should immediately go to a doctor or hospital.

### Questions for Your Doctor
3-4 specific questions to ask when visiting a healthcare provider.

### Important Disclaimer
Remind them this is general information only and not a diagnosis.

Keep the tone warm, clear, and non-alarmist. Write for a general audience in Guwahati.
`;

    try {
      const payload = {
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.4 },
      };

      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error(`API error: ${response.status}`);

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "Unable to generate assessment.";

      // Detect urgency level from response
      if (text.includes('EMERGENCY')) setUrgencyLevel('emergency');
      else if (text.includes('URGENT')) setUrgencyLevel('urgent');
      else if (text.includes('SEE A DOCTOR')) setUrgencyLevel('doctor');
      else setUrgencyLevel('selfcare');

      setResult(text);
      setShowResult(true);
    } catch (err) {
      setResult(`Error: ${err.message}. Please check your API key and try again.`);
      setShowResult(true);
    } finally {
      setIsLoading(false);
    }
  };

  const urgencyConfig = {
    emergency: { label: '🚨 EMERGENCY – Call 108 Now', bg: '#fff1f2', border: '#fecdd3', color: '#e11d48', icon: '🚨' },
    urgent:    { label: '⚡ URGENT – See Doctor Today',bg: '#fff7ed', border: '#fed7aa', color: '#c2410c', icon: '⚡' },
    doctor:    { label: '🩺 See a Doctor Soon (24-48h)', bg: '#eff6ff', border: '#bfdbfe', color: '#1d4ed8', icon: '🩺' },
    selfcare:  { label: '✅ Self-Care May Help',        bg: '#f0fdf4', border: '#a7f3d0', color: '#15803d', icon: '✅' },
  };

  return (
    <div className="patient-form-page">
      <style>{`
        .symptom-checker { max-width: 860px; width: 100%; }
        .sc-header { text-align: center; margin-bottom: 2rem; }
        .sc-header h1 { font-family: 'Outfit', sans-serif; font-size: clamp(1.8rem, 3vw, 2.4rem); font-weight: 800; color: #0f172a; margin-bottom: 0.5rem; }
        .sc-header p { color: #64748b; font-size: 1rem; max-width: 560px; margin: 0 auto; }
        .sc-section { background: white; border-radius: 1.25rem; padding: 1.75rem; margin-bottom: 1.25rem; box-shadow: 0 2px 12px rgba(0,0,0,0.05); border: 1px solid #e2e8f0; }
        .sc-section-title { font-family: 'Outfit', sans-serif; font-weight: 700; font-size: 1.05rem; color: #0f172a; margin-bottom: 1.25rem; display: flex; align-items: center; gap: 0.5rem; }
        .symptom-category { margin-bottom: 1.25rem; }
        .cat-label { font-size: 0.8rem; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 0.625rem; display: flex; align-items: center; gap: 0.375rem; }
        .symptom-chips { display: flex; flex-wrap: wrap; gap: 0.5rem; }
        .symptom-chip { padding: 0.4rem 0.875rem; border-radius: 999px; border: 2px solid #e2e8f0; background: white; font-size: 0.8rem; font-weight: 500; cursor: pointer; transition: all 0.18s; color: #475569; font-family: 'Inter', sans-serif; }
        .symptom-chip:hover { border-color: #14b8a6; color: #0d9488; background: #f0fdfa; }
        .symptom-chip.selected { background: linear-gradient(135deg, #0d9488, #2563eb); color: white; border-color: transparent; box-shadow: 0 3px 12px rgba(13,148,136,0.3); }
        .selected-count { background: #f0fdfa; border: 1px solid #99f6e4; border-radius: 0.5rem; padding: 0.625rem 1rem; font-size: 0.85rem; color: #0d9488; font-weight: 600; margin-bottom: 1rem; }
        .severity-row { display: flex; align-items: center; gap: 1rem; }
        .severity-slider { flex: 1; -webkit-appearance: none; height: 6px; border-radius: 3px; outline: none; cursor: pointer; }
        .severity-slider::-webkit-slider-thumb { -webkit-appearance: none; width: 20px; height: 20px; border-radius: 50%; background: linear-gradient(135deg, #0d9488, #2563eb); cursor: pointer; box-shadow: 0 2px 8px rgba(13,148,136,0.4); }
        .severity-label { min-width: 60px; text-align: center; font-weight: 800; color: #0f172a; font-size: 1rem; font-family: 'Outfit', sans-serif; }
        .meta-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem; }
        .meta-select { width: 100%; padding: 0.7rem 0.9rem; border: 2px solid #e2e8f0; border-radius: 0.75rem; font-size: 0.9rem; font-family: 'Inter', sans-serif; color: #0f172a; outline: none; transition: all 0.18s; background: white; }
        .meta-select:focus { border-color: #14b8a6; box-shadow: 0 0 0 3px rgba(20,184,166,0.12); }
        .concern-textarea { width: 100%; padding: 0.875rem 1rem; border: 2px solid #e2e8f0; border-radius: 0.75rem; font-size: 0.9rem; font-family: 'Inter', sans-serif; color: #0f172a; outline: none; transition: all 0.18s; resize: vertical; min-height: 100px; }
        .concern-textarea:focus { border-color: #14b8a6; box-shadow: 0 0 0 3px rgba(20,184,166,0.12); }
        .assess-btn { width: 100%; padding: 1rem; border-radius: 999px; background: linear-gradient(135deg, #0d9488, #2563eb); color: white; border: none; font-weight: 700; font-size: 1rem; cursor: pointer; transition: all 0.25s; box-shadow: 0 4px 18px rgba(13,148,136,0.35); font-family: 'Inter', sans-serif; }
        .assess-btn:hover:not(:disabled) { opacity: 0.92; transform: translateY(-2px); box-shadow: 0 8px 28px rgba(13,148,136,0.4); }
        .assess-btn:disabled { background: #e2e8f0; color: #94a3b8; cursor: not-allowed; box-shadow: none; transform: none; }
        .result-card { background: white; border-radius: 1.25rem; padding: 2rem; box-shadow: 0 4px 20px rgba(0,0,0,0.08); border: 1px solid #e2e8f0; animation: fadeInUp 0.4s ease; }
        .urgency-badge { border-radius: 0.875rem; padding: 1rem 1.25rem; margin-bottom: 1.5rem; display: flex; align-items: center; gap: 0.75rem; }
        .urgency-icon { font-size: 1.75rem; }
        .urgency-text { font-family: 'Outfit', sans-serif; font-size: 1.1rem; font-weight: 800; }
        .disclaimer-sc { background: #fef3c7; border: 1px solid #fde68a; border-radius: 0.75rem; padding: 0.875rem 1rem; margin-bottom: 1.75rem; font-size: 0.82rem; color: #78350f; line-height: 1.6; }
        @media (max-width: 640px) {
          .meta-grid { grid-template-columns: 1fr; }
          .sc-section { padding: 1.25rem; }
        }
      `}</style>

      <div className="symptom-checker">
        {/* Header */}
        <div className="sc-header">
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🩺</div>
          <h1>AI Symptom Checker</h1>
          <p>Select your symptoms, fill in your details, and get AI-powered health guidance in seconds.</p>
        </div>

        {/* Disclaimer */}
        <div className="disclaimer-sc">
          ⚠️ <strong>Important:</strong> This tool provides general health information only — not medical advice or diagnosis.
          For any serious symptoms, please visit <strong>GMCH, Apollo Excelcare, or your nearest hospital</strong> in Guwahati.
          Call <strong>108</strong> for medical emergencies.
        </div>

        {/* Symptom Selector */}
        <div className="sc-section">
          <div className="sc-section-title">🔍 Select Your Symptoms</div>

          {selectedSymptoms.length > 0 && (
            <div className="selected-count">
              ✓ {selectedSymptoms.length} symptom{selectedSymptoms.length > 1 ? 's' : ''} selected: {selectedSymptoms.join(' • ')}
            </div>
          )}

          {SYMPTOM_CATEGORIES.map(cat => (
            <div key={cat.category} className="symptom-category">
              <div className="cat-label"><span>{cat.icon}</span> {cat.category}</div>
              <div className="symptom-chips">
                {cat.symptoms.map(symptom => (
                  <button
                    key={symptom}
                    className={`symptom-chip ${selectedSymptoms.includes(symptom) ? 'selected' : ''}`}
                    onClick={() => toggleSymptom(symptom)}
                  >
                    {symptom}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Patient Details */}
        <div className="sc-section">
          <div className="sc-section-title">👤 Patient Information</div>
          <div className="meta-grid">
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#64748b', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Age Range
              </label>
              <select className="meta-select" value={ageRange} onChange={e => setAgeRange(e.target.value)}>
                <option value="">Select age…</option>
                {AGE_RANGES.map(a => <option key={a}>{a}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#64748b', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Biological Sex
              </label>
              <select className="meta-select" value={sex} onChange={e => setSex(e.target.value)}>
                <option value="">Select…</option>
                <option>Female</option>
                <option>Male</option>
                <option>Prefer not to say</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#64748b', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Duration
              </label>
              <select className="meta-select" value={duration} onChange={e => setDuration(e.target.value)}>
                <option value="">How long?</option>
                {DURATIONS.map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Severity */}
        <div className="sc-section">
          <div className="sc-section-title">📊 Symptom Severity</div>
          <div className="severity-row">
            <span style={{ fontSize: '0.85rem', color: '#94a3b8', minWidth: '60px' }}>Mild (1)</span>
            <input
              type="range"
              min="1"
              max="10"
              value={severity}
              onChange={e => setSeverity(Number(e.target.value))}
              className="severity-slider"
              style={{
                background: `linear-gradient(to right, #0d9488 0%, #2563eb ${severity * 10}%, #e2e8f0 ${severity * 10}%, #e2e8f0 100%)`,
              }}
            />
            <span style={{ fontSize: '0.85rem', color: '#94a3b8', minWidth: '60px', textAlign: 'right' }}>Severe (10)</span>
            <div className="severity-label"
              style={{ color: severity >= 8 ? '#e11d48' : severity >= 5 ? '#c2410c' : '#0d9488' }}
            >
              {severity}/10
            </div>
          </div>
          <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.5rem', textAlign: 'center' }}>
            {severity <= 3 ? '😊 Mild — monitoring may be sufficient'
             : severity <= 6 ? '😐 Moderate — consider medical consultation'
             : severity <= 8 ? '😟 Severe — see a doctor soon'
             : '🚨 Very Severe — seek immediate medical care'}
          </p>
        </div>

        {/* Additional Concern */}
        <div className="sc-section">
          <div className="sc-section-title">💬 Describe Your Concern</div>
          <textarea
            className="concern-textarea"
            placeholder="Describe any additional symptoms, medical history, or specific concerns…&#10;e.g. 'I've had a fever of 102°F for 2 days with a dry cough, and I feel very weak.'"
            value={primaryConcern}
            onChange={e => setPrimaryConcern(e.target.value)}
          />
        </div>

        {/* Submit */}
        <button
          className="assess-btn"
          onClick={handleSubmit}
          disabled={isLoading || (selectedSymptoms.length === 0 && !primaryConcern)}
          id="symptom-assess-btn"
        >
          {isLoading ? '🔄  Analyzing your symptoms…' : '✨  Get AI Health Assessment'}
        </button>

        {/* Loading */}
        {isLoading && (
          <div style={{ margin: '2rem 0', animation: 'fadeIn 0.3s ease' }}>
            <div style={{ background: 'white', borderRadius: '1.25rem', padding: '2rem', border: '1px solid #e2e8f0' }}>
              <div className="lab-loading-skeleton-header" style={{ marginBottom: '1.5rem' }}>
                <div className="skeleton skeleton-avatar" />
                <div style={{ flex: 1 }}>
                  <div className="skeleton skeleton-line wide" />
                  <div className="skeleton skeleton-line mid" />
                </div>
              </div>
              {[90,75,85,60,80,65,90].map((w, i) => (
                <div key={i} className="skeleton skeleton-line" style={{ width: `${w}%`, marginBottom: '10px' }} />
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        {showResult && !isLoading && result && (
          <div className="result-card" style={{ marginTop: '1.5rem' }}>
            {/* Urgency badge */}
            {urgencyLevel && (() => {
              const uc = urgencyConfig[urgencyLevel];
              return (
                <div className="urgency-badge" style={{ background: uc.bg, border: `1px solid ${uc.border}` }}>
                  <span className="urgency-icon">{uc.icon}</span>
                  <span className="urgency-text" style={{ color: uc.color }}>{uc.label}</span>
                </div>
              );
            })()}

            <SimpleMarkdown>{result}</SimpleMarkdown>

            <div style={{ marginTop: '2rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => navigate('/appointments')}
                style={{ background: 'linear-gradient(135deg, #0d9488, #2563eb)', color: 'white', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '999px', fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}
              >
                📅 Book Doctor in Guwahati
              </button>
              <button
                onClick={() => { setShowResult(false); setResult(''); setSelectedSymptoms([]); setSeverity(5); setPrimaryConcern(''); setUrgencyLevel(''); }}
                style={{ background: 'white', color: '#475569', border: '2px solid #e2e8f0', padding: '0.75rem 1.5rem', borderRadius: '999px', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}
              >
                🔄 Start Over
              </button>
            </div>
          </div>
        )}

        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <button className="back-btn" onClick={() => navigate('/')} style={{ display: 'inline-flex' }}>
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default PatientForm;
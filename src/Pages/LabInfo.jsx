import { useState, useRef } from "react";
import jsPDF from 'jspdf';

const API_KEY  = import.meta.env.VITE_GEMINI_API_KEY;
const API_BASE = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=";

const LANGUAGES = [
  { code: 'en', label: 'English',  flag: '🇬🇧' },
  { code: 'as', label: 'অসমীয়া', flag: '🏔️' },
  { code: 'hi', label: 'हिंदी',    flag: '🇮🇳' },
];

/* ─── Jan Aushadhi Kendra Directory ─────────────────────────── */
const JAN_AUSHADHI_KENDRAS = [
  { name: 'Jan Aushadhi Kendra – GS Road',      area: 'GS Road, Guwahati',      note: 'Near Christian Basti flyover' },
  { name: 'Jan Aushadhi Kendra – Dispur',        area: 'Dispur, Guwahati',        note: 'Near Assam Secretariat' },
  { name: 'Jan Aushadhi Kendra – Fancy Bazar',   area: 'Fancy Bazar, Guwahati',   note: 'Central market area' },
  { name: 'Jan Aushadhi Kendra – Paltan Bazar',  area: 'Paltan Bazar, Guwahati',  note: 'Near Railway Station' },
  { name: 'Jan Aushadhi Kendra – Ganeshguri',    area: 'Ganeshguri, Guwahati',    note: 'Near Ganeshguri Chariali' },
  { name: 'Jan Aushadhi Kendra – Bhangagarh',    area: 'Bhangagarh, Guwahati',    note: 'Near GMCH' },
  { name: 'Jan Aushadhi Kendra – Bhetapara',     area: 'Bhetapara, Guwahati',     note: 'Near Apollo Hospital' },
  { name: 'Jan Aushadhi Kendra – Narengi',       area: 'Narengi, Guwahati',       note: 'Military colony area' },
];

/* ─── Markdown renderer ──────────────────────────────────────── */
const SimpleMarkdown = ({ children }) => {
  if (!children) return null;
  const renderText = (text) => {
    let html = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g,     '<em>$1</em>')
      .replace(/^#### (.*$)/gm, '<h4>$1</h4>')
      .replace(/^### (.*$)/gm,  '<h3>$1</h3>')
      .replace(/^## (.*$)/gm,   '<h2>$1</h2>')
      .replace(/^# (.*$)/gm,    '<h1>$1</h1>')
      .replace(/^[-*] (.*$)/gm, '<li>$1</li>')
      .replace(/^\d+\. (.*$)/gm,'<li>$1</li>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g,   '<br>');
    html = html.replace(/(<li>[\s\S]*?<\/li>(?:\s*<li>[\s\S]*?<\/li>)*)/g, '<ul>$1</ul>');
    if (!html.includes('<h') && !html.includes('<ul>')) html = '<p>' + html + '</p>';
    return html;
  };
  return <div className="markdown" dangerouslySetInnerHTML={{ __html: renderText(children) }} />;
};

/* ─── Medical Loading Animation ─────────────────────────────── */
const MedicalLoader = () => (
  <div className="medical-loader-wrap">
    <div className="medical-loader">
      <div className="scan-line" />
      <div className="loader-pills">
        {['💊', '🧪', '🔬', '💉', '🩺'].map((icon, i) => (
          <span key={i} className="loader-pill" style={{ animationDelay: `${i * 0.18}s` }}>
            {icon}
          </span>
        ))}
      </div>
      <div className="loader-progress-track">
        <div className="loader-progress-bar" />
      </div>
      <div className="loader-status">
        <div className="loader-dot" />
        <span>Analyzing in English, Assamese &amp; Hindi simultaneously…</span>
      </div>
      <div className="loader-sublabel">
        Extracting values · Identifying abnormalities · Generating recommendations · Translating
      </div>
    </div>
  </div>
);

/* ─── Educational Warning Banner ────────────────────────────── */
const EduWarningBanner = () => (
  <div className="edu-warning-banner" role="alert">
    <span className="edu-warning-banner-icon">⚕️</span>
    <div className="edu-warning-banner-text">
      <strong>Disclaimer: For Educational Purposes Only</strong>
      <p>
        This AI analysis does <strong>not</strong> replace professional medical advice, diagnosis, or treatment.
        Always consult a qualified doctor before making any health decisions.
      </p>
    </div>
  </div>
);

/* ─── Jan Aushadhi Section ───────────────────────────────────── */
const JanAushadhiSection = () => {
  const [open, setOpen] = useState(false);
  return (
    <div className="jan-aushadhi-section">
      <button className="jan-aushadhi-toggle" onClick={() => setOpen(p => !p)}>
        <span>🏥 Affordable Alternatives &amp; Nearby Guwahati Pharmacies (Jan Aushadhi Hubs)</span>
        <span className={`jan-aushadhi-toggle-chevron ${open ? 'open' : ''}`}>▼</span>
      </button>
      {open && (
        <div className="jan-aushadhi-body">
          <div className="jan-aushadhi-tip">
            💡 <strong>Save up to 50–90% on medicines</strong> by asking your doctor for <strong>generic equivalents</strong> available at
            Jan Aushadhi Kendras. These are government-approved, same-formula medicines at a fraction of the price.
            Look for the <span className="generic-badge">🏛️ PM Jan Aushadhi</span> tag.
          </div>
          <div style={{ fontWeight: 700, fontSize: '0.78rem', color: '#065f46', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.625rem' }}>
            📍 Jan Aushadhi Kendras in Guwahati
          </div>
          <div className="jan-aushadhi-grid">
            {JAN_AUSHADHI_KENDRAS.map(k => (
              <div key={k.name} className="jan-aushadhi-card">
                <div className="jan-aushadhi-card-name">{k.name}</div>
                <div className="jan-aushadhi-card-area">📍 {k.area}</div>
                <div style={{ fontSize: '0.68rem', color: '#6b7280', marginTop: '0.15rem' }}>{k.note}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '0.875rem', fontSize: '0.75rem', color: '#64748b', lineHeight: 1.6 }}>
            💬 <strong>Tip:</strong> When visiting a Jan Aushadhi store, show the generic medicine name (not brand name) from this analysis.
            You can also call <strong>1800-111-255</strong> (toll-free) for the nearest Jan Aushadhi outlet.
          </div>
        </div>
      )}
    </div>
  );
};

/* ─── WhatsApp Share Button ──────────────────────────────────── */
const WhatsAppShareBtn = ({ analysisText, labText }) => {
  const handleShare = () => {
    const preview = analysisText
      .replace(/\*\*(.+?)\*\*/g, '$1')
      .replace(/\*(.+?)\*/g, '$1')
      .replace(/^#{1,4} (.+)$/gm, '\n$1')
      .split('\n')
      .slice(0, 60)
      .join('\n')
      .trim();

    const message =
`🩺 *Dr. AI — Lab Report Summary*

${labText ? `📋 *Report Data:*\n${labText.slice(0, 120)}…\n\n` : ''}📊 *AI Analysis (Key Findings):*
${preview.slice(0, 800)}…

⚠️ _This is an AI-generated educational summary. Please consult your doctor for medical advice._

🔗 _Generated by Dr. AI — Guwahati, Assam_`;

    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noreferrer');
  };

  return (
    <button className="whatsapp-share-btn" onClick={handleShare} title="Share via WhatsApp">
      <span className="wa-icon">📲</span>
      Share via WhatsApp / SMS
    </button>
  );
};

/* ─── Build comprehensive prompts ────────────────────────────── */
const buildPrompt = (lang) => {
  const shared = `
You are Dr. AI — a knowledgeable, compassionate medical information assistant based in Guwahati, Assam.
Your task is to provide a COMPLETE, THOROUGH, and STRUCTURED analysis of the provided lab report.

MANDATORY SECTIONS — you MUST include ALL of the following sections, in order:

## 🔬 Test-by-Test Breakdown
For EVERY single test in the report:
- Test name and what it measures
- Patient's result vs. reference range
- Status: ✅ Normal | ⚠️ Borderline | 🔴 Abnormal
- Simple, plain-language explanation of what this value means for the patient

## 📊 Overall Health Summary
- A brief overall picture of the patient's health based on the results
- Which body systems are affected

## ⚠️ Abnormal Values — What They May Mean
For every abnormal or borderline value:
- Why it might be high or low (list possible causes)
- How significant the deviation is
- What symptoms this might cause

## 💬 Questions to Ask Your Doctor
List AT LEAST 8–10 specific, actionable questions the patient should ask their doctor at their next visit. Make them relevant to the specific abnormal results found. Example format:
- "My [test name] is [value] — what is causing this?"
- "Do I need to repeat this test? When?"
- "Should I change my diet/medication because of these results?"
- etc.

## 🥗 Lifestyle & Diet Recommendations
Based on the specific results, give practical, actionable advice:
- Foods to eat more of / avoid
- Lifestyle changes (exercise, sleep, stress, etc.)
- Monitoring recommendations

## 🏥 When to Seek Care
- If any result needs URGENT attention — say so clearly
- What symptoms to watch for
- When to schedule a follow-up

IMPORTANT RULES:
- Do NOT make a diagnosis
- Be thorough — do not skip or abbreviate sections
- Use markdown formatting (## headings, bullet points)
- Keep language warm, clear and reassuring
- Always end with a reminder to consult their doctor
`;

  if (lang === 'en') {
    return shared + `\nWrite the ENTIRE response in ENGLISH only.`;
  }

  if (lang === 'as') {
    return `You are Dr. AI — a knowledgeable, compassionate medical information assistant based in Guwahati, Assam.
আপুনি এজন অসমীয়া ভাষাৰ চিকিৎসা সহায়ক। তলত দিয়া সমস্ত বিভাগ সম্পূৰ্ণ অসমীয়া ভাষাত লিখক।

IMPORTANT: সম্পূৰ্ণ উত্তৰ কেৱল অসমীয়া ভাষাত লিখক। চিকিৎসা পৰীক্ষাৰ নামবোৰ ইংৰাজীত (কোঠাত) দিব পাৰে।

অনিবাৰ্য বিভাগসমূহ (সকলোবোৰ অসমীয়াত লিখক):

## 🔬 পৰীক্ষাৰ বিশ্লেষণ
প্ৰতিটো পৰীক্ষাৰ বাবে:
- পৰীক্ষাৰ নাম আৰু ই কি জোখে
- ৰোগীৰ ফলাফল বনাম স্বাভাৱিক মান
- অৱস্থা: ✅ স্বাভাৱিক | ⚠️ সীমাৰেখাত | 🔴 অস্বাভাৱিক
- সহজ অসমীয়া ভাষাত ব্যাখ্যা

## 📊 সামগ্ৰিক স্বাস্থ্যৰ সাৰাংশ
## ⚠️ অস্বাভাৱিক মানবোৰৰ অৰ্থ
## 💬 চিকিৎসকক সোধা প্ৰশ্নসমূহ (কমেও ৮-১০টা নিৰ্দিষ্ট প্ৰশ্ন)
## 🥗 জীৱনশৈলী আৰু খাদ্যৰ পৰামৰ্শ
## 🏥 কেতিয়া চিকিৎসক দেখুৱাব

সম্পূৰ্ণ উত্তৰ কেৱল অসমীয়াত লিখক।`;
  }

  // Hindi
  return `You are Dr. AI — a knowledgeable, compassionate medical information assistant based in Guwahati, Assam.
आप एक हिंदी भाषा के चिकित्सा सहायक हैं। नीचे दिए गए सभी भाग पूरी तरह हिंदी में लिखें।

IMPORTANT: पूरा उत्तर केवल हिंदी में लिखें। चिकित्सा परीक्षण के नाम अंग्रेज़ी में (कोष्ठक में) दे सकते हैं।

अनिवार्य भाग (सभी हिंदी में लिखें):

## 🔬 जांच-दर-जांच विश्लेषण
हर एक जांच के लिए:
- जांच का नाम और यह क्या मापता है
- मरीज़ का परिणाम बनाम सामान्य सीमा
- स्थिति: ✅ सामान्य | ⚠️ सीमारेखा | 🔴 असामान्य
- सरल हिंदी में स्पष्टीकरण

## 📊 समग्र स्वास्थ्य सारांश
## ⚠️ असामान्य मूल्यों का अर्थ
## 💬 डॉक्टर से पूछने के सवाल (कम से कम ८-१० विशिष्ट सवाल)
## 🥗 जीवनशैली और आहार संबंधी सुझाव
## 🏥 डॉक्टर के पास कब जाएं

पूरा उत्तर केवल हिंदी में लिखें।`;
};

/* ─── Convert image/PDF file to base64 ───────────────────────── */
const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload  = () => resolve(reader.result.split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

/* ─── Single API call for one language ──────────────────────── */
const fetchOneLang = async (text, imageFile, lang, base64Cache) => {
  const systemPrompt = buildPrompt(lang);
  const userQuery    = `Please analyze the following lab report completely and thoroughly:\n\n${text || '[Lab report image/PDF uploaded — please analyze all visible test results]'}`;

  let parts = [{ text: userQuery }];

  if (imageFile && base64Cache.data) {
    parts = [
      { text: userQuery },
      { inlineData: { mimeType: base64Cache.mimeType, data: base64Cache.data } },
    ];
  }

  const payload = {
    contents: [{ role: 'user', parts }],
    systemInstruction: { parts: [{ text: systemPrompt }] },
    generationConfig: {
      temperature: 0.3,
      topP: 0.95,
      maxOutputTokens: 4096,   // large limit — full analysis
    },
  };

  const res = await fetch(API_BASE + API_KEY, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(payload),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`API ${res.status}: ${errText}`);
  }

  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || 'Analysis not available.';
};

/* ─── Main Component ─────────────────────────────────────────── */
const LabInfo = () => {
  const [labReportText, setLabReportText] = useState('');
  const [imageFile, setImageFile]         = useState(null);
  const [results, setResults]             = useState({ en: '', as: '', hi: '' });
  const [isLoading, setIsLoading]         = useState(false);
  const [analyzed, setAnalyzed]           = useState(false);
  const [activeLang, setActiveLang]       = useState('en');
  const [apiKeyMissing, setApiKeyMissing] = useState(false);
  const inputRef = useRef(null);

  /* ─── PDF download ────────────────────────────────────────── */
  const handleDownload = () => {
    const content = results[activeLang];
    if (!content) return;

    // Non-Latin: export as .txt
    if (activeLang !== 'en') {
      const plain = content
        .replace(/\*\*(.+?)\*\*/g, '$1')
        .replace(/\*(.+?)\*/g, '$1')
        .replace(/^#{1,4} (.+)$/gm, '$1');
      const blob  = new Blob([plain], { type: 'text/plain;charset=utf-8' });
      const url   = URL.createObjectURL(blob);
      const a     = document.createElement('a');
      a.href      = url;
      a.download  = `lab-analysis-${activeLang}.txt`;
      a.click();
      URL.revokeObjectURL(url);
      return;
    }

    // English → formatted PDF
    const doc      = new jsPDF();
    const pageW    = doc.internal.pageSize.getWidth();
    const pageH    = doc.internal.pageSize.getHeight();
    const margin   = 20;
    const maxWidth = pageW - margin * 2;
    let y = margin;

    const checkBreak = (h) => { if (y + h > pageH - margin) { doc.addPage(); y = margin; } };
    const addText    = (text, size, bold = false, color = [0,0,0]) => {
      doc.setFontSize(size); doc.setFont(undefined, bold ? 'bold' : 'normal');
      doc.setTextColor(...color);
      const lines = doc.splitTextToSize(text, maxWidth);
      checkBreak(lines.length * size * 0.5 + 5);
      doc.text(lines, margin, y);
      y += lines.length * size * 0.5 + 5;
    };

    // Header
    doc.setFillColor(13, 148, 136);
    doc.rect(0, 0, pageW, 44, 'F');
    doc.setTextColor(255,255,255);
    doc.setFontSize(22); doc.setFont(undefined,'bold');
    doc.text('Dr. AI – Lab Report Analysis', pageW/2, 20, { align:'center' });
    doc.setFontSize(10); doc.setFont(undefined,'normal');
    doc.text('Guwahati, Assam | For educational purposes only', pageW/2, 33, { align:'center' });
    y = 54;

    doc.setTextColor(100,100,100); doc.setFontSize(9);
    doc.text(`Generated: ${new Date().toLocaleString('en-IN')}`, margin, y); y += 12;
    doc.setDrawColor(200,200,200); doc.line(margin, y, pageW-margin, y); y += 10;

    if (labReportText?.trim()) {
      addText('Original Lab Report Data:', 13, true, [13,148,136]);
      const dataLines = doc.splitTextToSize(labReportText, maxWidth - 10);
      const boxH = dataLines.length * 5 + 12;
      checkBreak(boxH);
      doc.setFillColor(248,250,252); doc.rect(margin, y, maxWidth, boxH, 'F');
      doc.setDrawColor(226,232,240); doc.rect(margin, y, maxWidth, boxH, 'S');
      doc.setTextColor(60,60,60); doc.setFontSize(9);
      doc.text(dataLines, margin+5, y+7); y += boxH + 12;
    }
    if (imageFile) {
      doc.setTextColor(100,100,100); doc.setFontSize(9); doc.setFont(undefined,'italic');
      doc.text(`File uploaded: ${imageFile.name}`, margin, y); y += 12;
    }

    addText('AI Analysis & Interpretation (English):', 13, true, [13,148,136]);

    const plain = content
      .replace(/\*\*(.+?)\*\*/g, '$1')
      .replace(/\*(.+?)\*/g, '$1')
      .replace(/^#{1,4} (.+)$/gm, '$1');

    plain.split('\n').forEach(line => {
      if (!line.trim()) { y += 3; return; }
      if (/^[A-Z🔬📊⚠️💬🥗🏥].*:?$/.test(line.trim())) {
        checkBreak(14); addText(line.trim(), 11, true, [30,30,30]);
      } else if (line.trim().startsWith('-') || line.trim().startsWith('•')) {
        const bt = '• ' + line.replace(/^[-•]\s*/, '').trim();
        checkBreak(9); doc.setFontSize(9); doc.setFont(undefined,'normal'); doc.setTextColor(60,60,60);
        const tl = doc.splitTextToSize(bt, maxWidth - 10);
        doc.text(tl, margin+4, y); y += tl.length * 5 + 3;
      } else { addText(line.trim(), 9, false, [60,60,60]); }
    });

    // Footer: developer credit
    const footY = pageH - 20;
    doc.setDrawColor(200,200,200); doc.line(margin, footY-8, pageW-margin, footY-8);
    doc.setFontSize(7.5); doc.setTextColor(150,150,150); doc.setFont(undefined,'italic');
    doc.text('Disclaimer: AI-generated educational analysis. Not a substitute for professional medical advice.', pageW/2, footY-3, { align:'center' });
    doc.setFontSize(7); doc.setTextColor(130,130,130);
    doc.text('Developed by Ihsan Zaman & Himan Kashyap | Dr. AI, Guwahati, Assam', pageW/2, footY+3, { align:'center' });

    const pc = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pc; i++) {
      doc.setPage(i); doc.setFontSize(7.5); doc.setTextColor(150,150,150);
      doc.text(`Page ${i} of ${pc}`, pageW-margin, pageH-8, { align:'right' });
    }
    doc.save('lab-report-analysis-dr-ai.pdf');
  };

  /* ─── Copy text ───────────────────────────────────────────── */
  const handleCopyText = async () => {
    const content = results[activeLang];
    if (!content) return;
    try {
      await navigator.clipboard.writeText(content);
      alert('✅ Text copied to clipboard!');
    } catch {
      alert('Please select and copy the text manually.');
    }
  };

  /* ─── Main submit — all 3 languages simultaneously ─────────── */
  const handleSubmit = async () => {
    if (!labReportText && !imageFile) return;
    if (!API_KEY) { setApiKeyMissing(true); return; }

    setIsLoading(true);
    setAnalyzed(false);
    setResults({ en: '', as: '', hi: '' });
    setActiveLang('en');
    setApiKeyMissing(false);

    try {
      // Pre-convert image to base64 ONCE (shared across all 3 calls)
      const base64Cache = { data: null, mimeType: null };
      if (imageFile) {
        base64Cache.data     = await fileToBase64(imageFile);
        base64Cache.mimeType = imageFile.type;
      }

      // Fire ALL THREE languages simultaneously
      const [enResult, asResult, hiResult] = await Promise.all([
        fetchOneLang(labReportText, imageFile, 'en', base64Cache),
        fetchOneLang(labReportText, imageFile, 'as', base64Cache),
        fetchOneLang(labReportText, imageFile, 'hi', base64Cache),
      ]);

      setResults({ en: enResult, as: asResult, hi: hiResult });
      setAnalyzed(true);
    } catch (err) {
      console.error('Lab analysis error:', err);
      if (err.message === 'NO_KEY') {
        setApiKeyMissing(true);
      } else {
        setResults({
          en: `Sorry, an error occurred while analyzing your report.\n\nError: ${err.message}\n\nPlease check your internet connection and try again.`,
          as: '',
          hi: '',
        });
        setAnalyzed(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const activeLangLabel = LANGUAGES.find(l => l.code === activeLang)?.label || 'English';

  return (
    <>
      <div className="lab-page">
        <div className="lab-info-page">
          <div className="lab-content-container">

            {/* Header */}
            <div style={{ textAlign: 'center' }}>
              <div className="lab-icon-badge">🧪</div>
              <h1 className="lab-page-title">Lab Report Analysis</h1>
              <p className="lab-page-subtitle">
                Paste your lab results or upload a report image/PDF for a complete, detailed
                breakdown instantly in{' '}
                <strong>English</strong>,{' '}
                <strong>Assamese (অসমীয়া)</strong>, and{' '}
                <strong>Hindi (हिंदी)</strong> — all at once.
              </p>
            </div>

            {/* Educational Warning */}
            <EduWarningBanner />

            {/* API Key Missing */}
            {apiKeyMissing && (
              <div className="lab-api-error">
                <div className="lab-api-error-icon">🔑</div>
                <div>
                  <strong>Gemini API Key Not Configured</strong>
                  <p>Add your Gemini API key to <code>.env</code> in the project root:</p>
                  <div className="lab-api-error-code">VITE_GEMINI_API_KEY=your_key_here</div>
                  <p style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: '#92400e' }}>
                    Get a free key at{' '}
                    <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer"
                       style={{ color: '#b45309', fontWeight: 600 }}>
                      Google AI Studio →
                    </a>
                  </p>
                </div>
              </div>
            )}

            {/* Input */}
            <div className="lab-search-form">
              <textarea
                ref={inputRef}
                className="lab-search-input"
                rows={7}
                placeholder={`Paste your lab report here…\ne.g. Blood Glucose: 95 mg/dL (Normal: 70-100)\n     Hemoglobin: 10.2 g/dL (Normal: 13.5-17.5)\n     TSH: 4.8 mIU/L (Normal: 0.4-4.0)`}
                value={labReportText}
                onChange={(e) => { setLabReportText(e.target.value); setImageFile(null); }}
              />

              <div className="divider"><hr /><span>OR</span><hr /></div>

              <div className="flex-col-center">
                <label htmlFor="file-upload" className="upload-label">
                  {imageFile
                    ? <><span>📄</span>{imageFile.name}<span style={{ marginLeft: '0.5rem', opacity: 0.7 }}>✓</span></>
                    : <><span>📤</span> Upload Lab Report Image or PDF</>
                  }
                </label>
                <input
                  id="file-upload" type="file"
                  accept="image/png,image/jpeg,image/jpg,application/pdf"
                  className="hidden-input"
                  onChange={(e) => { if (e.target.files?.[0]) { setImageFile(e.target.files[0]); setLabReportText(''); } }}
                />
                {imageFile && (
                  <button onClick={() => setImageFile(null)}
                    style={{ marginTop: '0.5rem', background: 'none', border: 'none', color: '#94a3b8', fontSize: '0.8rem', cursor: 'pointer' }}>
                    ✕ Remove file
                  </button>
                )}
              </div>

              {/* Simultaneous generation note */}
              <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '0.625rem', padding: '0.625rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: '#1d4ed8' }}>
                <span>⚡</span>
                <span>
                  All 3 language reports are generated <strong>simultaneously</strong> — switch tabs instantly after analysis.
                </span>
              </div>

              <button
                onClick={handleSubmit}
                className="interpret-btn"
                disabled={isLoading || (!labReportText && !imageFile)}
                id="analyze-lab-btn"
              >
                {isLoading
                  ? '⏳ Analyzing in 3 languages…'
                  : '✨ Analyze Report (EN + অসমীয়া + हिंदी)'}
              </button>
            </div>

            {/* Medical Loader */}
            {isLoading && <MedicalLoader />}

            {/* Results */}
            {analyzed && !isLoading && (
              <div style={{ animation: 'fadeInUp 0.5s ease' }}>
                {/* Language Toggle */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
                  <h3 style={{ color: '#0f172a', fontFamily: 'Outfit, sans-serif', fontSize: '1.1rem', fontWeight: 700 }}>
                    📊 Analysis Results
                  </h3>
                  <div className="lang-toggle">
                    {LANGUAGES.map(lang => (
                      <button
                        key={lang.code}
                        className={`lang-btn ${activeLang === lang.code ? 'active' : ''}`}
                        onClick={() => setActiveLang(lang.code)}
                        title={`View in ${lang.label}`}
                      >
                        {lang.flag} {lang.label}
                        {results[lang.code] && (
                          <span style={{ marginLeft: '0.3rem', fontSize: '0.6rem', color: activeLang === lang.code ? 'white' : '#10b981' }}>●</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Info bar */}
                <div style={{ background: '#f0fdfa', border: '1px solid #99f6e4', borderRadius: '0.5rem', padding: '0.5rem 1rem', marginBottom: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.85rem' }}>🌐</span>
                  <span style={{ fontSize: '0.8rem', color: '#0d9488', fontWeight: 600 }}>
                    Showing: {activeLangLabel}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#64748b', marginLeft: 'auto' }}>
                    ⚡ All languages ready — click any tab
                  </span>
                </div>

                <div className="interpretation">
                  <SimpleMarkdown>
                    {results[activeLang] || 'No analysis available for this language.'}
                  </SimpleMarkdown>
                </div>

                {/* Non-Latin tip */}
                {activeLang !== 'en' && results[activeLang] && (
                  <div style={{ marginTop: '0.75rem', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '0.625rem', padding: '0.625rem 1rem', fontSize: '0.8rem', color: '#78350f', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span>💡</span>
                    <span>
                      Use <strong>Copy Text</strong> to copy the {activeLangLabel} report, or switch to English for PDF download.
                    </span>
                  </div>
                )}

                {/* WhatsApp Share */}
                {results.en && (
                  <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center' }}>
                    <WhatsAppShareBtn analysisText={results.en} labText={labReportText} />
                  </div>
                )}

                {/* Jan Aushadhi Pharmacy Section */}
                <JanAushadhiSection />
              </div>
            )}
          </div>

          {/* Download / Copy row */}
          {analyzed && (
            <div className="lab-action-row">
              {activeLang === 'en' && results.en && (
                <button className="buttonDownload" onClick={handleDownload} id="download-lab-pdf">
                  📥 Download PDF (English)
                </button>
              )}
              {activeLang !== 'en' && results[activeLang] && (
                <button className="buttonDownload" onClick={handleDownload}
                  style={{ background: 'linear-gradient(135deg, #1d4ed8, #0d9488)' }}>
                  📄 Download {activeLangLabel} (.txt)
                </button>
              )}
              {results[activeLang] && (
                <button className="buttonDownload" onClick={handleCopyText}
                  style={{ background: 'linear-gradient(135deg, #475569, #334155)' }}>
                  📋 Copy Text
                </button>
              )}
            </div>
          )}
        </div>

        <div className="button-container">
          <button className="back-btn" onClick={() => window.history.back()}>← Back</button>
        </div>
      </div>
    </>
  );
};

export default LabInfo;
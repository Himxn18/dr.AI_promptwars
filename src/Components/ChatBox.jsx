import { useState } from "react";
import jsPDF from 'jspdf';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + API_KEY;

// Simple markdown renderer for basic formatting
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

    if (!html.includes('<h') && !html.includes('<ul>')) {
      html = '<p>' + html + '</p>';
    }

    return html;
  };

  return (
    <div
      className="markdown"
      dangerouslySetInnerHTML={{ __html: renderText(children) }}
      style={{
        color: '#374151',
        lineHeight: '1.625'
      }}
    />
  );
};

const LabInfo = () => {
  const [labReportText, setLabReportText] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [interpretation, setInterpretation] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Professional PDF download function
  const handleDownload = () => {
    if (!interpretation) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const maxWidth = pageWidth - (margin * 2);
    let yPosition = margin;

    const checkPageBreak = (heightNeeded) => {
      if (yPosition + heightNeeded > pageHeight - margin) {
        doc.addPage();
        yPosition = margin;
        return true;
      }
      return false;
    };

    const addWrappedText = (text, fontSize, isBold = false, color = [0, 0, 0]) => {
      doc.setFontSize(fontSize);
      doc.setFont(undefined, isBold ? 'bold' : 'normal');
      doc.setTextColor(color[0], color[1], color[2]);
      
      const lines = doc.splitTextToSize(text, maxWidth);
      const lineHeight = fontSize * 0.5;
      
      checkPageBreak(lines.length * lineHeight);
      
      doc.text(lines, margin, yPosition);
      yPosition += lines.length * lineHeight + 5;
    };

    // Add decorative header
    doc.setFillColor(66, 167, 249);
    doc.rect(0, 0, pageWidth, 40, 'F');
    
    // Title
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont(undefined, 'bold');
    doc.text('Medical Document Analysis', pageWidth / 2, 25, { align: 'center' });
    
    yPosition = 50;

    // Date and Time
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    const currentDate = new Date().toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    doc.text(`Generated: ${currentDate}`, margin, yPosition);
    yPosition += 15;

    // Divider line
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 10;

    // Original Lab Data Section
    if (labReportText && labReportText.trim()) {
      addWrappedText('Original Data:', 14, true, [66, 167, 249]);
      
      const labDataLines = doc.splitTextToSize(labReportText, maxWidth - 10);
      const boxHeight = (labDataLines.length * 5) + 10;
      
      checkPageBreak(boxHeight);
      
      doc.setFillColor(245, 245, 245);
      doc.rect(margin, yPosition, maxWidth, boxHeight, 'F');
      doc.setDrawColor(200, 200, 200);
      doc.rect(margin, yPosition, maxWidth, boxHeight, 'S');
      
      doc.setTextColor(60, 60, 60);
      doc.setFontSize(10);
      doc.text(labDataLines, margin + 5, yPosition + 7);
      yPosition += boxHeight + 15;
    }

    // Image info
    if (imageFile) {
      doc.setTextColor(100, 100, 100);
      doc.setFontSize(10);
      doc.setFont(undefined, 'italic');
      doc.text(`Document uploaded: ${imageFile.name}`, margin, yPosition);
      yPosition += 15;
    }

    // AI Analysis Section
    addWrappedText('AI Analysis & Interpretation:', 14, true, [66, 167, 249]);
    
    let plainText = interpretation
      .replace(/\*\*(.+?)\*\*/g, '$1')
      .replace(/\*(.+?)\*/g, '$1')
      .replace(/^#### (.+)$/gm, '$1')
      .replace(/^### (.+)$/gm, '$1')
      .replace(/^## (.+)$/gm, '$1')
      .replace(/^# (.+)$/gm, '$1');
    
    const lines = plainText.split('\n');
    
    lines.forEach(line => {
      if (!line.trim()) {
        yPosition += 3;
        return;
      }

      if (/^[A-Z][A-Z\s]+:?$/.test(line.trim()) || /^\d+\./.test(line.trim())) {
        checkPageBreak(15);
        addWrappedText(line.trim(), 11, true, [40, 40, 40]);
      }
      else if (line.trim().startsWith('*') || line.trim().startsWith('-')) {
        const bulletText = '• ' + line.replace(/^[\*\-]\s*/, '').trim();
        checkPageBreak(10);
        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        doc.setTextColor(60, 60, 60);
        const textLines = doc.splitTextToSize(bulletText, maxWidth - 10);
        doc.text(textLines, margin + 5, yPosition);
        yPosition += textLines.length * 5 + 3;
      }
      else {
        addWrappedText(line.trim(), 10, false, [60, 60, 60]);
      }
    });

    // Footer
    const footerY = pageHeight - 15;
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, footerY - 5, pageWidth - margin, footerY - 5);
    
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.setFont(undefined, 'italic');
    doc.text('Disclaimer: This is an AI-generated analysis. Please consult with a healthcare professional.', pageWidth / 2, footerY, { align: 'center' });

    // Page numbers
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(`Page ${i} of ${pageCount}`, pageWidth - margin, pageHeight - 10, { align: 'right' });
    }

    doc.save('medical-document-analysis.pdf');
  };

  const handleSubmit = async () => {
    if (!labReportText && !imageFile) return;

    setIsLoading(true);
    setInterpretation("");

    if (!API_KEY || API_KEY === "YOUR_API_KEY_HERE") {
      setInterpretation("Error: Please provide a valid Gemini API key in your .env file.");
      setIsLoading(false);
      return;
    }

    try {
      // 2. FIXED: Enhanced system prompt to handle prescriptions and demand full extraction details
      const systemPrompt = `You are a highly capable AI medical assistant. Your task is to carefully analyze the uploaded medical document (lab report or prescription). 
      - If it is a lab report: Extract ALL test names, results, units, and reference ranges. Explain what each value means, point out any abnormalities, and explain potential causes.
      - If it is a prescription: Extract ALL medications, dosages, frequencies, and instructions. Briefly explain what each medication is typically used for.
      Always provide general, non-diagnostic guidance and suggest specific questions the user can ask their doctor. DO NOT give direct medical advice or make definitive diagnoses. Keep the tone reassuring, structured, and highly informative. Format the response clearly using markdown with appropriate headings and bullet points.`;
      
      const userQuery = `Please analyze the following medical information/document and provide a detailed breakdown:\n\n${labReportText}`;
      let payload;

      if (imageFile) {
        const base64Data = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result.split(",")[1]);
          reader.onerror = reject;
          reader.readAsDataURL(imageFile);
        });

        payload = {
          contents: [
            {
              role: "user",
              parts: [
                { text: userQuery },
                {
                  inlineData: {
                    mimeType: imageFile.type, // Works for image/png, image/jpeg, and application/pdf
                    data: base64Data,
                  },
                },
              ],
            },
          ],
          systemInstruction: {
            parts: [{ text: systemPrompt }],
          },
        };
      } else {
        payload = {
          contents: [
            {
              role: "user",
              parts: [{ text: userQuery }],
            },
          ],
          systemInstruction: {
            parts: [{ text: systemPrompt }],
          },
        };
      }

      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        let errorText = await response.text();
        try {
          const errorJson = JSON.parse(errorText);
          errorText = errorJson.error?.message || "Unknown API error";
        } catch (e) {
          errorText = `API error: ${response.status} - ${errorText}`;
        }
        throw new Error(errorText);
      }

      const result = await response.json();
      const text =
        result.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Sorry, I couldn't interpret those results. Please try again with a clear, text-based report or a high-quality file.";

      setInterpretation(text);
    } catch (error) {
      console.error("Error calling Gemini API:", error);
      setInterpretation(
        `Sorry, there was an error processing your request. Please check your API key and network connection. Error details: ${error.message}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <style>
        {`
        .lab-page { margin-top: 70px; }
        .lab-info-page { background-color: #f9fafb; min-height: 60vh; padding: 1rem; display: flex; flex-direction: column; align-items: center; }
        .lab-content-container { background-color: #fff; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04); border-radius: 1rem; padding: 1.5rem; width: 100%; max-width: 56rem; display: flex; flex-direction: column; gap: 1.5rem; }
        @media (min-width: 640px) { .lab-info-page { padding: 2rem; } }
        @media (min-width: 768px) { .lab-content-container { padding: 2.5rem; } }
        .title { font-size: 1.875rem; font-weight: 700; color: #1f2937; text-align: center; }
        .subtitle { color: #4b5563; text-align: center; }
        .lab-search-form { display: flex; flex-direction: column; gap: 1.5rem; }
        .lab-search-input { width: 100%; padding: 1rem; border: 1px solid #d1d5db; border-radius: 0.5rem; outline: none; transition: all 0.2s ease; }
        .lab-search-input:focus { border-color: #3b82f6; box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5); }
        .divider { display: flex; align-items: center; gap: 1rem; }
        .divider hr { flex-grow: 1; border-top: 1px solid #d1d5db; }
        .divider span { color: #6b7280; font-weight: 500; }
        .flex-col-center { display: flex; flex-direction: column; align-items: center; }
        .upload-label { width: 100%; text-align: center; padding: 0.75rem 1.5rem; border-radius: 0.5rem; font-weight: 600; color: #fff; background-color: #22c55e; transition: background-color 0.2s ease; cursor: pointer; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); }
        .upload-label:hover { background-color: #16a34a; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); }
        .hidden-input { display: none; }
        .interpret-btn { width: 100%; padding: 0.75rem 1.5rem; border-radius: 0.5rem; font-weight: 600; color: #fff; background-color: #2563eb; transition: background-color 0.2s ease; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); border: none; cursor: pointer; }
        .interpret-btn:hover { background-color: #1d4ed8; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); }
        .interpret-btn:disabled { background-color: #9ca3af; cursor: not-allowed; }
        .loading-message { text-align: center; color: #6b7280; margin-top: 1rem; display: flex; align-items: center; justify-content: center; }
        .spinner { border: 4px solid rgba(0, 0, 0, 0.1); border-left-color: #3b82f6; border-radius: 50%; width: 24px; height: 24px; animation: spin 1s linear infinite; margin-right: 0.5rem; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        .interpretation { margin-top: 2rem; padding: 1.5rem; background-color: #eff6ff; border-radius: 0.5rem; border: 1px solid #bfdbfe; }
        .interpretation h3 { font-size: 1.25rem; font-weight: 700; color: #1e40af; margin-bottom: 1rem; }
        .markdown { color: #374151; line-height: 1.625; }
        .markdown > *:not(:first-child) { margin-top: 1rem; }
        .markdown h1, .markdown h2, .markdown h3 { font-weight: 600; margin-bottom: 0.5rem; color: #1f2937; }
        .markdown h1 { font-size: 1.5rem; } .markdown h2 { font-size: 1.25rem; } .markdown h3 { font-size: 1.125rem; }
        .markdown ul { padding-left: 1.5rem; margin: 0.5rem 0; }
        .markdown li { margin-bottom: 0.25rem; }
        .markdown strong { font-weight: 600; color: #1f2937; }
        .markdown em { font-style: italic; }
        .buttonDownload { margin-top: 1rem; padding: 0.75rem 1.5rem; border-radius: 0.5rem; font-weight: 600; color: #fff; background-color: #10b981; border: none; cursor: pointer; transition: background-color 0.2s ease; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); }
        .buttonDownload:hover:not(:disabled) { background-color: #059669; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); }
        .buttonDownload:disabled { background-color: #9ca3af; cursor: not-allowed; opacity: 0.6; }
        .button-container { display: flex; justify-content: center; align-items: center; width: 100%; padding: 2rem 0; margin-top: 2rem; }
        .back-btn { background: #6c757d; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 0.5rem; cursor: pointer; transition: background-color 0.2s; text-decoration: none; display: flex; align-items: center; gap: 0.5rem; font-size: 1rem; font-weight: 500; }
        .back-btn:hover { background: #545b62; }
        `}
      </style>
      <div className="lab-page">
        <div className="lab-info-page">
          <div className="lab-content-container">
            <h2 className="title">
              Medical Document Analysis
            </h2>
            <p className="subtitle">
              Paste your text or upload a document (PDF/Image) to get a
              clear, easy-to-understand summary of your lab results or prescription.
            </p>

            <div className="lab-search-form">
              <textarea
                className="lab-search-input"
                rows="7"
                placeholder="e.g., Blood Glucose: 95 mg/dL, Total Cholesterol: 180 mg/dL OR Amoxicillin 500mg 2x daily..."
                value={labReportText}
                onChange={(e) => {
                  setLabReportText(e.target.value);
                  setImageFile(null);
                }}
              />

              <div className="divider">
                <hr />
                <span>OR</span>
                <hr />
              </div>

              <div className="flex-col-center">
                <label
                  htmlFor="file-upload"
                  className="upload-label"
                >
                  {imageFile ? `File selected: ${imageFile.name}` : "Upload an Image or PDF"}
                </label>
                {/* 3. FIXED: Added application/pdf to the accept attribute */}
                <input
                  id="file-upload"
                  type="file"
                  accept="image/png, image/jpeg, image/jpg, application/pdf"
                  className="hidden-input"
                  onChange={(e) => {
                    if(e.target.files && e.target.files.length > 0) {
                      setImageFile(e.target.files[0]);
                      setLabReportText("");
                    }
                  }}
                />
              </div>

              <button
                onClick={handleSubmit}
                className="interpret-btn"
                disabled={isLoading || (!labReportText && !imageFile)}
              >
                {isLoading ? "Analyzing..." : "Analyze Document ✨"}
              </button>
            </div>

            {isLoading && (
              <p className="loading-message">
                <div className="spinner"></div>
                <span>Carefully reviewing your document...</span>
              </p>
            )}

            {interpretation && (
              <div className="interpretation">
                <h3>Analysis Results</h3>
                <SimpleMarkdown>
                  {interpretation}
                </SimpleMarkdown>
              </div>
            )}
          </div>
          <button 
            className="buttonDownload"
            onClick={handleDownload}
            disabled={!interpretation}
          >
            Download PDF Report
          </button>
        </div>

        <div className="button-container">
          <button className="back-btn" onClick={() => window.history.back()}>
            ← Back to Home
          </button>
        </div>
      </div>
    </>
  );
};

export default LabInfo;
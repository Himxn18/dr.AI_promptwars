

const Features = ({ onStartAssessment, onSearchMedications, onInterpretLabs }) => (
  <section className="features">
    <div className="features-container">
      <h2 className="features-title">How I Can Help You</h2>
      <p className="features-subtitle">Get guidance across multiple health information areas</p>
      
      <div className="features-grid">
        <div className="feature-card">
          <div className="feature-icon">🔍</div>
          <h3>Symptom Assessment</h3>
          <p>Get personalized guidance based on your symptoms with red-flag detection for emergency care.</p>
          
          <div className="feature-tags">
            <span className="tag self-care">Self-care OK</span>
            <span className="tag urgent">Urgent 24-48h</span>
            <span className="tag emergency">Emergency</span>
          </div>
          
          <button className="feature-btn" onClick={onStartAssessment}>
            Start Assessment
          </button>
        </div>
        
        <div className="feature-card">
          <div className="feature-icon">💊</div>
          <h3>Medication Information</h3>
          <p>Learn about side effects, drug interactions, interactions, and proper OTC dosing guidance.</p>
          
          <ul className="feature-list">
            <li>• OTC dosing guidance</li>
            <li>• Side effects & warnings</li>
            <li>• Drug interactions</li>
            <li>• Safety information</li>
          </ul>
          
          <button className="feature-btn" onClick={onSearchMedications}>
            Search Medications
          </button>
        </div>
        
        <div className="feature-card">
          <div className="feature-icon">📋</div>
          <h3>Lab Report Explanation</h3>
          <p>Understand your lab results with clear explanations and follow-up guidance.</p>
          
          <ul className="feature-list">
            <li>• Test value interpretation</li>
            <li>• Reference range context</li>
            <li>• Follow-up suggestions</li>
            <li>• Questions for your doctor</li>
          </ul>
          
          <button className="feature-btn" onClick={onInterpretLabs}>
            Interpret Labs
          </button>
        </div>
      </div>
    </div>
  </section>
);

export default Features;

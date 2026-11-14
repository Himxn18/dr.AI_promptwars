import { useEffect } from "react";
import "../Hero.css";

const Hero = () => {
  useEffect(() => {
    class TxtType {
      constructor(el, toRotate, period) {
        this.toRotate = toRotate;
        this.el = el;
        this.loopNum = 0;
        this.period = parseInt(period, 10) || 2000;
        this.txt = "";
        this.isDeleting = false;
        this.tick();
      }

      tick() {
        const i = this.loopNum % this.toRotate.length;
        const fullTxt = this.toRotate[i];

        if (this.isDeleting) {
          this.txt = fullTxt.substring(0, this.txt.length - 1);
        } else {
          this.txt = fullTxt.substring(0, this.txt.length + 1);
        }

        this.el.innerHTML = `<span class="wrap">${this.txt}</span>`;

        // Smooth, consistent speed
        let delta = 100; // typing speed (lower = faster)

        if (this.isDeleting) delta /= 2; // faster deleting

        // Pause before deleting
        if (!this.isDeleting && this.txt === fullTxt) {
          delta = this.period;
          this.isDeleting = true;
        } else if (this.isDeleting && this.txt === "") {
          this.isDeleting = false;
          this.loopNum++;
          delta = 500;
        }

        setTimeout(() => this.tick(), delta);
      }
    }

    const elements = document.getElementsByClassName("typewrite");
    for (let i = 0; i < elements.length; i++) {
      const toRotate = elements[i].getAttribute("data-type");
      const period = elements[i].getAttribute("data-period");
      if (toRotate) {
        new TxtType(elements[i], JSON.parse(toRotate), period);
      }
    }

    // Inject cursor style
    const css = document.createElement("style");
    css.type = "text/css";
    css.innerHTML = `
      .typewrite > .wrap {
        border-right: 0.12em solid #666;
        animation: blinkCursor 0.8s step-end infinite;
      }

      @keyframes blinkCursor {
        50% { border-color: transparent; }
      }
    `;
    document.body.appendChild(css);
  }, []);

  return (
    <section className="hero">
      <div className="hero-content">
        <div className="hero-logo">
        <span className="stethoscope-large">🩺</span>
      </div>
        <h1>
          <a
            href="#"
            className="typewrite"
            data-period="2000"
            data-type='["Hi, I am Dr. AI"]'
          >
            <span className="wrap"></span>
          </a>
        </h1>
        <p className="hero-subtitle">Your Trusted Health Information Assistant</p>
        <div className="hero-description">
          <p>
            I can help you understand symptoms, lab reports, and medication
            information and suggest when to seek care.
          </p>
          <p className="emergency-notice">
            If this is an emergency, please call local emergency services now.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Hero;

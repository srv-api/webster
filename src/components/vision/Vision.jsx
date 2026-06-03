import React from 'react';
import './Vision.css';

const Vision = ({ visionRef }) => {
  return (
    <section ref={visionRef} className="vision" id="vision">
      <div className="vision-container">
        {/* Main Vision Card - Asymmetric */}
        <div className="vision-main">
          <div className="vision-quote">
            <div className="vision-quote-icon">“</div>
            <p className="vision-quote-text">
              To become the world's most trusted platform for interactive learning, 
              empowering millions to achieve their full potential through engaging 
              and personalized educational experiences.
            </p>
            <div className="vision-quote-line"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Vision;
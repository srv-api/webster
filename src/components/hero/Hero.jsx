import React, { useEffect, useState } from 'react';
import './Hero.css';

const Hero = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  
  const cards = [
    {
      id: 1,
      number: "01",
      title: "Daily Challenge",
      subtitle: "10 Questions • 15 Minutes",
      description: "Test your knowledge with daily PostTest across various subjects. Track your progress and compete with friends.",
      metric: "2,847",
      metricLabel: "Today's players"
    },
    {
      id: 2,
      number: "02",
      title: "Live Battle",
      subtitle: "Real-time Competition",
      description: "Compete against others in real-time. Fastest finger wins. Answer correctly and climb the leaderboard.",
      metric: "1.2s",
      metricLabel: "Avg response"
    },
    {
      id: 3,
      number: "03",
      title: "Study Materials",
      subtitle: "Notes & Flashcards",
      description: "Access curated study materials, create flashcards, and review before tests. Learn at your own pace.",
      metric: "500+",
      metricLabel: "Study sets"
    },
    {
      id: 4,
      number: "04",
      title: "Achievements",
      subtitle: "Badges & Rewards",
      description: "Earn badges for streaks, perfect scores, and milestones. Show off your knowledge.",
      metric: "24",
      metricLabel: "Achievements"
    },
    {
      id: 5,
      number: "05",
      title: "Analytics",
      subtitle: "Track Your Growth",
      description: "Detailed insights on your strengths and areas for improvement. Personalized recommendations.",
      metric: "89%",
      metricLabel: "Avg improvement"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % cards.length);
    }, 3500);
    
    return () => clearInterval(interval);
  }, [cards.length]);

  const getCardPosition = (index) => {
    let position = index - activeIndex;
    if (position < 0) position += cards.length;
    return position;
  };

  return (
    <section className="hero">
      <div className="hero-container">
        <div className="hero-content">
          <span className="hero-badge">POSTTEST • INTERACTIVE TEST</span>
          <h1 className="hero-title">
            Learn, Play,<br />
            <span className="hero-highlight">With PostTest</span>
          </h1>
          <p className="hero-description">
            Transform the way you learn with interactive PostTest, real-time battles, 
            and comprehensive study tools. Join millions of learners worldwide.
          </p>
          <div className="hero-actions">
            <button className="hero-button">Start Free Trial</button>
          </div>
          <div className="hero-stats">
            <div className="hero-stat">
              <span className="stat-number">2M+</span>
              <span className="stat-label">Active Users</span>
            </div>
            <div className="hero-stat">
              <span className="stat-number">50M+</span>
              <span className="stat-label">PostTest Completed</span>
            </div>
          </div>
        </div>
        
        <div className="hero-slider">
          <div className="slider-container">
            {cards.map((card, idx) => {
              const position = getCardPosition(idx);
              const isActive = position === 0;
              const isNext = position === 1;
              const isSecondNext = position === 2;
              
              if (!isActive && !isNext && !isSecondNext) return null;
              
              let className = 'slider-card';
              if (isActive) className += ' active';
              if (isNext) className += ' next';
              if (isSecondNext) className += ' second-next';
              
              const baseY = 140;
              const translateValue = position === 0 ? 0 : position === 1 ? baseY : baseY * 2;
              const scaleValue = position === 0 ? 1 : position === 1 ? 0.97 : 0.94;
              const blurValue = position === 0 ? 0 : position === 1 ? 0.5 : 1;
              
              return (
                <div 
                  key={card.id}
                  className={className}
                  style={{
                    transform: `translateY(${translateValue}px) scale(${scaleValue})`,
                    opacity: position === 0 ? 1 : position === 1 ? 0.65 : 0.35,
                    filter: `blur(${blurValue}px)`,
                    zIndex: 10 - position,
                    transition: 'all 0.85s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                  }}
                >
                  <div className="card-header">
                    <span className="card-number">{card.number}</span>
                    <div className="card-metric">
                      <span className="metric-value">{card.metric}</span>
                      <span className="metric-label">{card.metricLabel}</span>
                    </div>
                  </div>
                  <h3 className="card-title">{card.title}</h3>
                  <div className="card-subtitle">{card.subtitle}</div>
                  <p className="card-description">{card.description}</p>
                  <div className="card-footer">
                    <div className="card-line"></div>
                    {isActive && <span className="card-status">Trending now</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
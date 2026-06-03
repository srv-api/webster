import React from 'react';
import '../styles/ButtonGroup.css';

const ButtonGroup = ({ onDashboardClick, onCreateClick }) => {
  const buttons = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: '📊',
      onClick: onDashboardClick,
      className: 'dashboard-btn',
    },
    {
      id: 'create',
      label: 'Create',
      icon: '+',
      onClick: onCreateClick,
      className: 'create-btn',
    }
  ];

  return (
    <div className="btn-wrapper">
      {buttons.map((btn) => (
        <button
          key={btn.id}
          className={`btn ${btn.className}`}
          onClick={btn.onClick}
        >
          <div className="btn-content">
            <span className="btn-icon">
              {btn.icon === '+' ? (
                <svg 
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path 
                    d="M12 5V19M5 12H19" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round"
                  />
                </svg>
              ) : (
                <svg 
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path 
                    d="M3 3H21V21H3V3Z" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path 
                    d="M3 9H21M9 21V9" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round"
                  />
                </svg>
              )}
            </span>
            <span className="btn-text">{btn.label}</span>
          </div>
        </button>
      ))}
    </div>
  );
};

export default ButtonGroup;
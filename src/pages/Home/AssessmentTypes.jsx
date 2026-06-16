import React from 'react';
import '../styles/AssessmentTypes.css';

const AssessmentTypes = ({ types, onSelectType }) => {
  return (
    <div className="assessment-types">
      <div className="types-grid">
        {types.map((type) => (
          <div
            key={type.id}
            className="type-card"
            onClick={() => onSelectType(type)}
          >
            <div className="card-glow" style={{ background: `linear-gradient(135deg, ${type.color}20, transparent)` }}></div>
            <div className="type-icon-wrapper" style={{ background: `linear-gradient(135deg, ${type.color}15, ${type.color}05)` }}>
              <div className="type-icon" style={{ color: type.color }}>
                {type.icon}
              </div>
            </div>
            <div className="type-content">
              <h4 style={{ color: type.color }}>{type.title}</h4>
              <p>{type.description}</p>
            </div>
            <div className="type-arrow" style={{ color: type.color }}>
              →
            </div>
            <div className="card-border" style={{ background: `linear-gradient(90deg, ${type.color}, transparent)` }}></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AssessmentTypes;
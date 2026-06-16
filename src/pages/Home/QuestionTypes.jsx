import React from 'react';
import '../styles/QuestionTypes.css';

const QuestionTypes = ({ selectedType, onSelectQuestionType, onBack }) => {
  const questionTypes = [
    {
      id: 'multiple-choice',
      title: 'Multiple Choice',
      icon: '🔘',
      description: 'Select one correct answer from multiple options',
      preview: 'Which of the following is correct?\n\nA) Option 1\nB) Option 2\nC) Option 3\nD) Option 4',
      color: '#667eea'
    },
    {
      id: 'multi-select',
      title: 'Multi-select',
      icon: '✅',
      description: 'Select all correct answers from multiple options',
      preview: 'Which of the following are correct? (Select all that apply)\n\n□ Option 1\n□ Option 2\n□ Option 3\n□ Option 4',
      color: '#4facfe'
    },
    {
      id: 'true-false',
      title: 'True or False',
      icon: '✓✗',
      description: 'Determine if the statement is true or false',
      preview: 'Statement: The sky is green.\n\n○ True\n○ False',
      color: '#43e97b'
    }
  ];

  return (
    <div className="question-types-container">
      <div className="question-types-grid">
        {questionTypes.map((type) => (
          <div
            key={type.id}
            className="question-type-card"
            onClick={() => onSelectQuestionType(type)}
          >
            <div className="question-type-icon" style={{ backgroundColor: `${type.color}15`, color: type.color }}>
              {type.icon}
            </div>
            <div className="question-type-info">
              <h4>{type.title}</h4>
              <p>{type.description}</p>
            </div>
            <div className="question-type-arrow">→</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuestionTypes;
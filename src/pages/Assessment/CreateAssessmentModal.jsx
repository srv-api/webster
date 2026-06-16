// src/pages/CreateAssessmentModal.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './CreateAssessmentModal.css';

const CreateAssessmentModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate(); // Initialize navigate
  const [selectedType, setSelectedType] = useState(null);
  const [step, setStep] = useState('select-type');

  const assessmentTypes = [
    {
      id: 'assessment',
      title: 'Assessment',
      description: 'Quick & interactive questions for students'
    },
    {
      id: 'presentation',
      title: 'Presentation',
      description: 'Slides with questions and whiteboard'
    },
    {
      id: 'video',
      title: 'Video',
      description: 'Questions at key points in the video'
    },
    {
      id: 'passage',
      title: 'Passage',
      description: 'Questions based on a reading passage'
    },
    {
      id: 'flashcards',
      title: 'Flashcards',
      description: 'Questions on front, answers on back'
    }
  ];

  const questionTypes = [
    {
      id: 'multiple-choice',
      title: 'Multiple Choice',
      description: 'Select one correct answer from multiple options',
      icon: '→',
      path: '/create/multiple-choice' // Add path for navigation
    },
    {
      id: 'multi-select',
      title: 'Multi-select',
      description: 'Select all correct answers from multiple options',
      icon: '✓✗',
    },
    {
      id: 'true-false',
      title: 'True or False',
      description: 'Determine if the statement is true or false',
      icon: '✓✗',
    },
  ];

  const handleSelectType = (type) => {
    setSelectedType(type);
    setStep('select-question');
  };

  const handleBackToTypes = () => {
    setStep('select-type');
    setSelectedType(null);
  };

  const handleQuestionTypeSelect = (questionType) => {
    console.log('Selected Assessment Type:', selectedType);
    console.log('Selected Question Type:', questionType);
    
    // Close modal
    onClose();
    
    // Navigate based on question type
    if (questionType.id === 'multiple-choice') {
      // Navigate to MultipleChoice page with assessment data
      navigate('/create/multiple-choice', {
        state: {
          assessmentType: selectedType,
          questionType: questionType,
          title: `${selectedType?.title} - ${questionType?.title}`
        }
      });
    } else if (questionType.id === 'multi-select') {
      // Navigate to MultiSelect page (to be created)
      navigate('/multi-select', {
        state: {
          assessmentType: selectedType,
          questionType: questionType
        }
      });
    } else if (questionType.id === 'true-false') {
      // Navigate to TrueFalse page (to be created)
      navigate('/true-false', {
        state: {
          assessmentType: selectedType,
          questionType: questionType
        }
      });
    }
    
    // Reset state
    setStep('select-type');
    setSelectedType(null);
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setStep('select-type');
      setSelectedType(null);
    }, 300);
  };

  if (!isOpen) return null;

  return (
    <div className="assessment-modal-overlay" onClick={handleClose}>
      <div className="assessment-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="assessment-modal-header">
          <div className="assessment-modal-header-left">
            {step === 'select-question' && (
              <button 
                className="assessment-modal-back-btn"
                onClick={handleBackToTypes}
                aria-label="Back"
              >
                ←
              </button>
            )}
            <h2>
              {step === 'select-type' 
                ? 'Create Assessment' 
                : `Choose Question Type for ${selectedType?.title}`
              }
            </h2>
          </div>
          <button className="assessment-modal-close" onClick={handleClose}>×</button>
        </div>

        <div className="assessment-modal-body">
          {step === 'select-type' ? (
            <div className="assessment-types-grid">
              {assessmentTypes.map((type) => (
                <div
                  key={type.id}
                  className="assessment-type-card"
                  onClick={() => handleSelectType(type)}
                >
                  <div className="assessment-type-info">
                    <h4>{type.title}</h4>
                    <p>{type.description}</p>
                  </div>
                  <div className="assessment-type-arrow">→</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="question-types-grid">
              {questionTypes.map((type) => (
                <div
                  key={type.id}
                  className="question-type-card"
                  onClick={() => handleQuestionTypeSelect(type)}
                >
                  <div className="question-type-badge">{type.badge}</div>
                  <div className="question-type-info">
                    <h4>{type.title}</h4>
                    <p>{type.description}</p>
                  </div>
                  <div className="question-type-icon">{type.icon}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateAssessmentModal;
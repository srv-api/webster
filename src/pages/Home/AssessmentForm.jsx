import React from 'react';
import '../styles/AssessmentForm.css';

const AssessmentForm = ({ 
  selectedType, 
  selectedQuestionType,
  assessmentData, 
  onBack, 
  onInputChange, 
  onSubmit, 
  onCancel 
}) => {
  return (
    <>
      <div className="form-header">
        <button className="back-btn" onClick={onBack}>
          ← Back
        </button>
        <div className="selected-badges">
          <div className="selected-type-badge" style={{ backgroundColor: `${selectedType?.color}20`, color: selectedType?.color }}>
            {selectedType?.icon} {selectedType?.title}
          </div>
          {selectedQuestionType && (
            <div className="selected-question-badge" style={{ backgroundColor: `${selectedQuestionType?.color}20`, color: selectedQuestionType?.color }}>
              {selectedQuestionType?.icon} {selectedQuestionType?.title}
            </div>
          )}
        </div>
      </div>

      <form onSubmit={onSubmit} className="assessment-form">
        <div className="form-group">
          <label htmlFor="title">Assessment Title *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={assessmentData.title}
            onChange={onInputChange}
            placeholder="e.g., Final Exam, Midterm Test, Quiz 1"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={assessmentData.description}
            onChange={onInputChange}
            placeholder="Describe the assessment purpose and content..."
            rows="4"
          />
        </div>

        {selectedQuestionType && (
          <div className="info-box" style={{ borderLeftColor: selectedQuestionType.color }}>
            <strong>Question Type:</strong> {selectedQuestionType.title}
            <p className="info-description">{selectedQuestionType.description}</p>
          </div>
        )}

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="duration">Duration (minutes)</label>
            <input
              type="number"
              id="duration"
              name="duration"
              value={assessmentData.duration}
              onChange={onInputChange}
              min="1"
              max="180"
            />
          </div>

          <div className="form-group">
            <label htmlFor="passingScore">Passing Score (%)</label>
            <input
              type="number"
              id="passingScore"
              name="passingScore"
              value={assessmentData.passingScore}
              onChange={onInputChange}
              min="0"
              max="100"
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="cancel-btn" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className="submit-btn">
            Create Assessment
          </button>
        </div>
      </form>
    </>
  );
};

export default AssessmentForm;
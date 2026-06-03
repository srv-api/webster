import React from 'react';

const Preview = ({ title, questions, getQuestionTypeLabel, onBack, onConfirm }) => {
  return (
    <div className="preview-container">
      <div className="preview-header">
        <h2>{title}</h2>
        <div className="preview-actions">
          <button className="back-edit-btn" onClick={onBack}>
            Back to Edit
          </button>
          <button className="confirm-btn" onClick={onConfirm}>
            Confirm & Create
          </button>
        </div>
      </div>

      <div className="questions-preview">
        {questions.map((q, idx) => (
          <div key={q.id} className="preview-card">
            <div className="preview-question">
              <span className="preview-num">
                Question {idx + 1} • {getQuestionTypeLabel(q.type)}
              </span>
              <h4>{q.text || 'Untitled Question'}</h4>
            </div>
            
            {q.type === 'multiple_choice' ? (
              <>
                <div className="preview-options">
                  {q.options.map((option, optIdx) => (
                    <div key={option.id} className="preview-option">
                      <span className="option-letter">{String.fromCharCode(65 + optIdx)}.</span>
                      <span className={`option-text ${option.isCorrect ? 'correct' : ''}`}>
                        {option.text || `Option ${String.fromCharCode(65 + optIdx)}`}
                      </span>
                      {option.isCorrect && (
                        <span className="correct-badge">✓ Correct Answer</span>
                      )}
                    </div>
                  ))}
                </div>
                {q.explanation && (
                  <div className="preview-explanation">
                    <strong>Explanation:</strong> {q.explanation}
                  </div>
                )}
              </>
            ) : (
              <div className="preview-option" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                <input
                  type="text"
                  placeholder={q.placeholder || "Enter your answer here..."}
                  style={{
                    width: '100%',
                    padding: '12px 15px',
                    border: '1px solid #dee2e6',
                    borderRadius: '10px',
                    fontSize: '14px',
                    background: '#f8f9fa'
                  }}
                  disabled
                />
                {q.required && (
                  <span style={{ fontSize: '12px', color: '#fa5252', marginTop: '5px' }}>
                    * Required field
                  </span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Preview;
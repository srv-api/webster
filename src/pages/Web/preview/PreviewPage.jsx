import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/PreviewPage.css';

const PreviewPage = () => {
  const navigate = useNavigate();
  const [assessmentData, setAssessmentData] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    // Load data from localStorage
    const savedData = localStorage.getItem('assessmentData');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setAssessmentData(parsedData);
    } else {
      // Redirect back if no data
      navigate('/');
    }
  }, [navigate]);

  const getQuestionTypeLabel = (type) => {
    return type === 'multiple_choice' ? 'Multiple Choice' : 'Free Text';
  };

  const handleAnswerChange = (questionId, value, questionType, isCorrect = null) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: {
        value: value,
        type: questionType,
        isCorrect: isCorrect
      }
    }));
  };

  const handleSubmit = () => {
    // Calculate score for multiple choice questions
    let correctCount = 0;
    let totalMCQuestions = 0;

    assessmentData.questions.forEach((q, idx) => {
      if (q.type === 'multiple_choice') {
        totalMCQuestions++;
        const userAnswer = userAnswers[q.id];
        if (userAnswer && userAnswer.isCorrect === true) {
          correctCount++;
        }
      }
    });

    const calculatedScore = totalMCQuestions > 0 
      ? (correctCount / totalMCQuestions) * 100 
      : 0;
    
    setScore(calculatedScore);
    setSubmitted(true);

    // Save answers to localStorage
    const submissionData = {
      assessment: assessmentData,
      answers: userAnswers,
      score: calculatedScore,
      submittedAt: new Date().toISOString()
    };
    localStorage.setItem('submissionData', JSON.stringify(submissionData));
  };

  const handleEdit = () => {
    navigate('/');
  };

  const handleConfirm = () => {
    alert(`Assessment "${assessmentData?.title}" has been submitted!\nScore: ${score.toFixed(2)}%`);
    // You can send data to backend here
    console.log('Final Submission:', {
      assessment: assessmentData,
      answers: userAnswers,
      score: score
    });
  };

  if (!assessmentData) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading assessment...</p>
      </div>
    );
  }

  return (
    <div className="preview-page-container">
      <div className="preview-header">
        <div className="header-content">
          <button className="back-btn" onClick={handleEdit}>
            ← Back to Edit
          </button>
          <h1>{assessmentData.title}</h1>
          {!submitted && (
            <button className="submit-assessment-btn" onClick={handleSubmit}>
              Submit Assessment
            </button>
          )}
        </div>
      </div>

      <div className="preview-content">
        {!submitted ? (
          // Preview Mode - User can answer
          <div className="assessment-form">
            <div className="cards-grid">
              {assessmentData.questions.map((q, idx) => (
                <div key={q.id} className="card-item">
                  <div className="question-card">
                    <div className="question-header">
                      <span className="question-number">Question {idx + 1}</span>
                      <span className={`question-type ${q.type}`}>
                        {getQuestionTypeLabel(q.type)}
                      </span>
                      {q.type === 'free_text' && q.required && (
                        <span className="required-badge">Required</span>
                      )}
                    </div>
                    
                    <div className="question-text">
                      <h3>{q.text || 'Untitled Question'}</h3>
                    </div>
                    
                    {q.type === 'multiple_choice' ? (
                      <div className="options-group">
                        {q.options.map((option, optIdx) => (
                          <label key={option.id} className="option-label">
                            <input
                              type="radio"
                              name={`question_${q.id}`}
                              value={option.id}
                              onChange={() => handleAnswerChange(
                                q.id, 
                                option.text, 
                                'multiple_choice',
                                option.isCorrect
                              )}
                              className="option-radio"
                            />
                            <span className="option-letter">{String.fromCharCode(65 + optIdx)}.</span>
                            <span className="option-text">{option.text || `Option ${String.fromCharCode(65 + optIdx)}`}</span>
                          </label>
                        ))}
                      </div>
                    ) : (
                      <div className="free-text-group">
                        <input
                          type="text"
                          placeholder={q.placeholder || "Enter your answer here..."}
                          onChange={(e) => handleAnswerChange(q.id, e.target.value, 'free_text')}
                          className="free-text-input"
                          required={q.required}
                        />
                        {q.placeholder && (
                          <small className="input-hint">{q.placeholder}</small>
                        )}
                      </div>
                    )}
                    
                    {q.type === 'multiple_choice' && q.explanation && (
                      <div className="explanation-hint">
                        <strong>💡 Hint:</strong> {q.explanation}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="form-actions">
              <button className="cancel-btn" onClick={handleEdit}>
                Edit Assessment
              </button>
              <button className="submit-btn" onClick={handleSubmit}>
                Submit Answers
              </button>
            </div>
          </div>
        ) : (
          // Results Mode - Show correct answers
          <div className="results-container">
            <div className="score-card">
              <div className="score-circle">
                <span className="score-value">{score.toFixed(0)}%</span>
              </div>
              <h2>Your Score</h2>
              <p>You got {assessmentData.questions.filter(q => 
                q.type === 'multiple_choice' && 
                userAnswers[q.id]?.isCorrect === true
              ).length} out of {assessmentData.questions.filter(q => q.type === 'multiple_choice').length} correct</p>
            </div>

            <div className="answers-review">
              <h3>Review Answers</h3>
              <div className="cards-grid">
                {assessmentData.questions.map((q, idx) => (
                  <div key={q.id} className="card-item">
                    <div className="review-card">
                      <div className="review-header">
                        <span className="question-num">Question {idx + 1}</span>
                        <span className={`result-badge ${userAnswers[q.id]?.isCorrect ? 'correct' : 'incorrect'}`}>
                          {q.type === 'multiple_choice' 
                            ? (userAnswers[q.id]?.isCorrect ? '✓ Correct' : '✗ Incorrect')
                            : 'Free Text'}
                        </span>
                      </div>
                      
                      <div className="review-question">
                        <h4>{q.text}</h4>
                      </div>
                      
                      <div className="review-answer">
                        <strong>Your answer:</strong> 
                        <span>{userAnswers[q.id]?.value || 'No answer provided'}</span>
                      </div>
                      
                      {q.type === 'multiple_choice' && !userAnswers[q.id]?.isCorrect && (
                        <div className="correct-answer">
                          <strong>Correct answer:</strong>
                          <span>{q.options.find(opt => opt.isCorrect)?.text || 'Not specified'}</span>
                        </div>
                      )}
                      
                      {q.explanation && (
                        <div className="review-explanation">
                          <strong>Explanation:</strong>
                          <p>{q.explanation}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="results-actions">
              <button className="edit-again-btn" onClick={handleEdit}>
                Edit Assessment
              </button>
              <button className="confirm-btn" onClick={handleConfirm}>
                Confirm & Save Results
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PreviewPage;
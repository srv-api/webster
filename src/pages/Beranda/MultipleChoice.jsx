import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/MultipleChoice.css';

const MultipleChoice = ({ onBack, assessmentData }) => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([
    {
      id: 1,
      type: 'multiple_choice',
      text: '',
      options: [{ id: 1, text: '', isCorrect: false }],
      explanation: '',
      placeholder: '',
      required: true
    }
  ]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [title, setTitle] = useState(assessmentData?.title || 'Untitled Assessment');

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        id: questions.length + 1,
        type: 'multiple_choice',
        text: '',
        options: [{ id: 1, text: '', isCorrect: false }],
        explanation: '',
        placeholder: '',
        required: true
      }
    ]);
    setCurrentQuestion(questions.length);
  };

  const removeQuestion = (id) => {
    if (questions.length > 1) {
      const newQuestions = questions.filter(q => q.id !== id);
      setQuestions(newQuestions);
      if (currentQuestion >= newQuestions.length) {
        setCurrentQuestion(newQuestions.length - 1);
      }
    }
  };

  const updateQuestion = (field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[currentQuestion][field] = value;
    setQuestions(updatedQuestions);
  };

  const addOption = () => {
    const updatedQuestions = [...questions];
    const currentOpts = updatedQuestions[currentQuestion].options;
    const newId = currentOpts.length + 1;
    updatedQuestions[currentQuestion].options = [
      ...currentOpts,
      { id: newId, text: '', isCorrect: false }
    ];
    setQuestions(updatedQuestions);
  };

  const removeOption = (optionId) => {
    const updatedQuestions = [...questions];
    const currentOpts = updatedQuestions[currentQuestion].options;
    if (currentOpts.length > 1) {
      updatedQuestions[currentQuestion].options = currentOpts.filter(opt => opt.id !== optionId);
      setQuestions(updatedQuestions);
    }
  };

  const updateOption = (optionId, value) => {
    const updatedQuestions = [...questions];
    const optionIndex = updatedQuestions[currentQuestion].options.findIndex(opt => opt.id === optionId);
    if (optionIndex !== -1) {
      updatedQuestions[currentQuestion].options[optionIndex].text = value;
      setQuestions(updatedQuestions);
    }
  };

  const setCorrectAnswer = (optionId) => {
    const updatedQuestions = [...questions];
    updatedQuestions[currentQuestion].options.forEach(opt => {
      opt.isCorrect = (opt.id === optionId);
    });
    setQuestions(updatedQuestions);
  };

  const handleSubmit = () => {
    const isValid = questions.every(q => {
      if (q.type === 'multiple_choice') {
        return q.text.trim() !== '' && q.options.some(opt => opt.text.trim() !== '');
      } else {
        return q.text.trim() !== '';
      }
    });
    
    if (!isValid) {
      alert('Please fill in all question texts and required fields');
      return;
    }
    
    // Save data to localStorage or state management
    localStorage.setItem('assessmentData', JSON.stringify({
      title: title,
      questions: questions,
      timestamp: new Date().toISOString()
    }));
    
    // Navigate to preview page
    navigate('/preview');
  };

  const changeQuestionType = (type) => {
    const updatedQuestions = [...questions];
    if (type === 'free_text') {
      updatedQuestions[currentQuestion].type = 'free_text';
      updatedQuestions[currentQuestion].options = [];
    } else {
      updatedQuestions[currentQuestion].type = 'multiple_choice';
      updatedQuestions[currentQuestion].options = [{ id: 1, text: '', isCorrect: false }];
    }
    setQuestions(updatedQuestions);
  };

  const getQuestionTypeLabel = (type) => {
    return type === 'multiple_choice' ? 'Multiple Choice' : 'Free Text';
  };

  const handleTitleSave = () => {
    setIsEditingTitle(false);
  };

  const handleTitleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleTitleSave();
    }
  };

  return (
    <div className="multiple-choice-container">
      {/* Editable Title Header */}
      <div className="assessment-title-header">
        {isEditingTitle ? (
          <div className="title-edit-container">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleTitleSave}
              onKeyPress={handleTitleKeyPress}
              className="title-input"
              autoFocus
              maxLength="100"
            />
            <button onClick={handleTitleSave} className="save-title-btn">✓</button>
          </div>
        ) : (
          <div className="title-display" onClick={() => setIsEditingTitle(true)}>
            <h1>{title || 'Untitled Assessment'}</h1>
            <span className="edit-icon">✎</span>
          </div>
        )}
      </div>

      <div className="mc-content">
        <div className="questions-sidebar">
          <h3>Questions</h3>
          <div className="question-list">
            {questions.map((q, idx) => (
              <div
                key={q.id}
                className={`question-item ${currentQuestion === idx ? 'active' : ''}`}
                onClick={() => setCurrentQuestion(idx)}
              >
                <span className="question-number">Q{idx + 1}</span>
                <span className="question-preview">
                  {q.text || `Untitled ${getQuestionTypeLabel(q.type)}`}
                </span>
                <span style={{ 
                  fontSize: '10px', 
                  background: q.type === 'free_text' ? '#51cf66' : '#667eea',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  color: 'white',
                  marginLeft: 'auto',
                  marginRight: '5px'
                }}>
                  {q.type === 'free_text' ? 'Text' : 'MC'}
                </span>
                {questions.length > 1 && (
                  <button 
                    className="remove-q-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeQuestion(q.id);
                    }}
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
            <button className="add-question-btn" onClick={addQuestion}>
              + Add Question
            </button>
          </div>
        </div>

        <div className="question-editor">
          <div className="editor-header">
            <h3>Question {currentQuestion + 1}</h3>
            <button className="submit-btn" onClick={handleSubmit} style={{ marginTop: '10px' }}>
              Review & Save
            </button>
          </div>

          <div className="form-group">
            <label>Question Type *</label>
            <div style={{ display: 'flex', gap: '15px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="radio"
                  checked={questions[currentQuestion].type === 'multiple_choice'}
                  onChange={() => changeQuestionType('multiple_choice')}
                />
                Multiple Choice
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="radio"
                  checked={questions[currentQuestion].type === 'free_text'}
                  onChange={() => changeQuestionType('free_text')}
                />
                Free Text (e.g., Name, Email, etc.)
              </label>
            </div>
          </div>

          <div className="form-group">
            <label>Question Text *</label>
            <textarea
              value={questions[currentQuestion].text}
              onChange={(e) => updateQuestion('text', e.target.value)}
              placeholder={questions[currentQuestion].type === 'free_text' 
                ? "Example: Please enter your full name..." 
                : "Enter your multiple choice question here..."}
              rows="3"
            />
          </div>

          {questions[currentQuestion].type === 'multiple_choice' ? (
            <>
              <div className="form-group">
                <label>Answer Options *</label>
                <div className="options-container">
                  {questions[currentQuestion].options.map((option) => (
                    <div key={option.id} className="option-input">
                      <input
                        type="radio"
                        name="correctAnswer"
                        checked={option.isCorrect}
                        onChange={() => setCorrectAnswer(option.id)}
                      />
                      <input
                        type="text"
                        value={option.text}
                        onChange={(e) => updateOption(option.id, e.target.value)}
                        placeholder={`Option ${String.fromCharCode(64 + option.id)}`}
                        className="option-text"
                      />
                      {questions[currentQuestion].options.length > 1 && (
                        <button
                          type="button"
                          className="remove-option-btn"
                          onClick={() => removeOption(option.id)}
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button type="button" className="add-option-btn" onClick={addOption}>
                  + Add Option
                </button>
              </div>

              <div className="form-group">
                <label>Explanation (Optional)</label>
                <textarea
                  value={questions[currentQuestion].explanation}
                  onChange={(e) => updateQuestion('explanation', e.target.value)}
                  placeholder="Explain why the answer is correct..."
                  rows="2"
                />
              </div>
            </>
          ) : (
            <>
              <div className="form-group">
                <label>Placeholder Text (Optional)</label>
                <input
                  type="text"
                  value={questions[currentQuestion].placeholder || ''}
                  onChange={(e) => updateQuestion('placeholder', e.target.value)}
                  placeholder="e.g., Enter your full name..."
                  className="option-text"
                  style={{ width: '100%' }}
                />
              </div>

              <div className="form-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <input
                    type="checkbox"
                    checked={questions[currentQuestion].required !== false}
                    onChange={(e) => updateQuestion('required', e.target.checked)}
                  />
                  Required field (user must fill this)
                </label>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MultipleChoice;
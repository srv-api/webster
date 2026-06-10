import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/PreviewPage.css';

const PreviewPage = () => {
  const navigate = useNavigate();
  const [assessmentData, setAssessmentData] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  
  // State untuk tampilan soal
  const [viewMode, setViewMode] = useState('all'); // 'all' atau 'single'
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  
  // State untuk modal Room Code
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [roomCode, setRoomCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // State untuk notifikasi save draft
  const [showSaveNotification, setShowSaveNotification] = useState(false);

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

  // Navigasi soal
  const goToNextQuestion = () => {
    if (currentQuestionIndex < assessmentData.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const goToQuestion = (index) => {
    setCurrentQuestionIndex(index);
  };

  // Fungsi untuk save draft assessment
  const handleSaveDraft = () => {
    const draftData = {
      assessment: assessmentData,
      answers: userAnswers,
      savedAt: new Date().toISOString()
    };
    localStorage.setItem('draftAssessment', JSON.stringify(draftData));
    
    // Tampilkan notifikasi
    setShowSaveNotification(true);
    setTimeout(() => {
      setShowSaveNotification(false);
    }, 2000);
  };

  // Fungsi untuk generate room code
  const generateRoomCode = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  };

  // Fungsi untuk menghitung skor
  const calculateScore = () => {
    let correctCount = 0;
    let totalMCQuestions = 0;

    assessmentData.questions.forEach((q) => {
      if (q.type === 'multiple_choice') {
        totalMCQuestions++;
        const userAnswer = userAnswers[q.id];
        if (userAnswer && userAnswer.isCorrect === true) {
          correctCount++;
        }
      }
    });

    return totalMCQuestions > 0 
      ? (correctCount / totalMCQuestions) * 100 
      : 0;
  };

  // Fungsi untuk create room (simulasi API call)
  const createRoom = async () => {
    setIsLoading(true);
    
    // Simulasi delay API
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const newRoomCode = generateRoomCode();
    setRoomCode(newRoomCode);
    
    // Hitung skor
    const calculatedScore = calculateScore();
    setScore(calculatedScore);
    
    // Simpan data room ke localStorage
    const roomData = {
      roomCode: newRoomCode,
      assessment: assessmentData,
      answers: userAnswers,
      score: calculatedScore,
      createdAt: new Date().toISOString()
    };
    localStorage.setItem('roomData', JSON.stringify(roomData));
    
    // Save submission data
    const submissionData = {
      assessment: assessmentData,
      answers: userAnswers,
      score: calculatedScore,
      submittedAt: new Date().toISOString()
    };
    localStorage.setItem('submissionData', JSON.stringify(submissionData));
    
    setIsLoading(false);
  };

  // Fungsi ketika tombol Publish ditekan - langsung ke room code tanpa tampilkan skor
  const handlePublish = async () => {
    // Set submitted menjadi true
    setSubmitted(true);
    
    // Tampilkan modal dan buat room
    setShowRoomModal(true);
    await createRoom();
  };

  const handleCopyRoomCode = () => {
    navigator.clipboard.writeText(roomCode);
    alert('Room code copied to clipboard!');
  };

  const handleJoinRoom = () => {
    console.log('Joining room with code:', roomCode);
    setShowRoomModal(false);
    alert(`You can now join room with code: ${roomCode}`);
  };

  const handleCloseModal = () => {
    setShowRoomModal(false);
  };

  const handleEdit = () => {
    navigate('/');
  };

  // Render single question
  const renderSingleQuestion = () => {
    const q = assessmentData.questions[currentQuestionIndex];
    const idx = currentQuestionIndex;
    const isAnswered = userAnswers[q.id]?.value;

    return (
      <div className="single-question-container">
        <div className="question-progress">
          <div className="progress-info">
            <span>Question {idx + 1} of {assessmentData.questions.length}</span>
            <span className="answered-status">
              {isAnswered ? '✓ Answered' : '⚪ Not Answered'}
            </span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${((idx + 1) / assessmentData.questions.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="question-card single-card">
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
                    checked={userAnswers[q.id]?.value === option.text}
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
              <textarea
                placeholder={q.placeholder || "Enter your answer here..."}
                value={userAnswers[q.id]?.value || ''}
                onChange={(e) => handleAnswerChange(q.id, e.target.value, 'free_text')}
                className="free-text-input"
                required={q.required}
                rows={4}
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

        <div className="navigation-buttons">
          <button 
            onClick={goToPreviousQuestion} 
            disabled={currentQuestionIndex === 0}
            className="nav-btn prev-btn"
          >
            ← Previous
          </button>
          
          <div className="question-indicators">
            {assessmentData.questions.map((_, index) => (
              <button
                key={index}
                onClick={() => goToQuestion(index)}
                className={`question-dot ${currentQuestionIndex === index ? 'active' : ''} ${userAnswers[assessmentData.questions[index].id]?.value ? 'answered' : ''}`}
              >
                {index + 1}
              </button>
            ))}
          </div>
          
          <button className="nav-btn submit-btn" onClick={handlePublish}>
            Publish
          </button>
        </div>
      </div>
    );
  };

  // Render all questions
  const renderAllQuestions = () => {
    return (
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
                    <textarea
                      placeholder={q.placeholder || "Enter your answer here..."}
                      onChange={(e) => handleAnswerChange(q.id, e.target.value, 'free_text')}
                      className="free-text-input"
                      required={q.required}
                      rows={3}
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
      </div>
    );
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
            <>
              <div className="view-toggle">
                <button 
                  className={`toggle-btn ${viewMode === 'all' ? 'active' : ''}`}
                  onClick={() => setViewMode('all')}
                >
                  All Questions
                </button>
                <button 
                  className={`toggle-btn ${viewMode === 'single' ? 'active' : ''}`}
                  onClick={() => setViewMode('single')}
                >
                  One by One
                </button>
              </div>
              <div className="header-actions">
                <button className="save-draft-header-btn" onClick={handleSaveDraft}>
                  Save Draft
                </button>
                <button className="submit-assessment-btn" onClick={handlePublish}>
                  Publish
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="preview-content">
        {!submitted ? (
          viewMode === 'all' ? renderAllQuestions() : renderSingleQuestion()
        ) : (
          <div className="results-container">
            <div className="score-card">
              <h2>Assessment Published Successfully!</h2>
              <p>Room code has been generated. Share it with participants.</p>
            </div>
          </div>
        )}
      </div>

      {/* Save Draft Notification */}
      {showSaveNotification && (
        <div className="save-notification">
          <div className="notification-content">
            <span className="notification-icon">💾</span>
            <span>Draft saved successfully!</span>
          </div>
        </div>
      )}

      {/* Modal Room Code */}
      {showRoomModal && (
        <div className="room-modal-overlay" onClick={handleCloseModal}>
          <div className="room-modal-container" onClick={(e) => e.stopPropagation()}>
            <button className="room-modal-close" onClick={handleCloseModal}>×</button>
            
            <div className="room-modal-header">
              <h2>🎉 Assessment Published!</h2>
              <p>Your assessment has been successfully published</p>
            </div>

            <div className="room-code-section">
              <div className="room-code-label">Room Code</div>
              {isLoading ? (
                <div className="room-code-loading">
                  <div className="loading-spinner-small"></div>
                  <p>Creating your room...</p>
                </div>
              ) : (
                <>
                  <div className="room-code-display">
                    <span className="room-code">{roomCode}</span>
                    <button className="copy-code-btn" onClick={handleCopyRoomCode}>
                      📋 Copy
                    </button>
                  </div>
                  
                  <p className="room-code-hint">
                    Share this code with participants to join the assessment room
                  </p>
                  
                  <div className="score-info">
                    <p><strong>Your Score:</strong> {score.toFixed(0)}%</p>
                  </div>
                </>
              )}
            </div>

            <div className="room-modal-actions">
              <button className="join-room-btn" onClick={handleJoinRoom} disabled={isLoading}>
                Join Room Now
              </button>
              <button className="close-modal-btn" onClick={handleCloseModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PreviewPage;
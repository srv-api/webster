import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { submitAssessment, getImageUrl } from '../../../services/assessment/multiple';
import '../../styles/PreviewPage.css';

const PreviewPage = () => {
  const navigate = useNavigate();
  const [assessmentData, setAssessmentData] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  
  const [viewMode, setViewMode] = useState('all');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [roomCode, setRoomCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSaveNotification, setShowSaveNotification] = useState(false);

useEffect(() => {
  const savedData = localStorage.getItem('assessmentData');
  if (savedData) {
    const parsedData = JSON.parse(savedData);
    
    // Restore File objects jika ada
    const restoredQuestions = parsedData.questions.map(q => {
      // Jika image adalah object biasa (dari JSON), coba restore
      if (q.image && typeof q.image === 'object' && !(q.image instanceof File)) {
        // Coba konversi ke File jika memungkinkan
        console.warn(`Question has image object but not File:`, q.image);
        // Jangan restore karena tidak bisa diupload
        return { ...q, image: null };
      }
      return q;
    });
    
    setAssessmentData({
      ...parsedData,
      questions: restoredQuestions
    });
    
    console.log("Loaded from localStorage:");
    restoredQuestions.forEach((q, idx) => {
      console.log(`Question ${idx + 1}:`, {
        text: q.text,
        hasImage: !!q.image,
        isFile: q.image instanceof File
      });
    });
    
  } else {
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

  const goToNextQuestion = () => {
    if (currentQuestionIndex < assessmentData?.questions.length - 1) {
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

  const handleSaveDraft = () => {
    const draftData = {
      assessment: assessmentData,
      answers: userAnswers,
      savedAt: new Date().toISOString()
    };
    localStorage.setItem('draftAssessment', JSON.stringify(draftData));
    
    setShowSaveNotification(true);
    setTimeout(() => {
      setShowSaveNotification(false);
    }, 2000);
  };
// Helper function untuk generate room code
const handlePublish = async () => {
  setIsLoading(true);
  setShowRoomModal(true);
  
  try {
    const imageFiles = [];
    
    // Validasi data sebelum publish
    console.log("=== Validating Data Before Publish ===");
    assessmentData.questions.forEach((q, idx) => {
      console.log(`Question ${idx + 1}:`, {
        text: q.text,
        hasImage: !!q.image,
        isFile: q.image instanceof File,
        imageValue: q.image
      });
    });
    
    const formattedQuestions = assessmentData.questions.map((q, idx) => {
      let answerOptions = [];
      
      if (q.type === 'multiple_choice') {
        const optionsObj = {};
        q.options.forEach((opt, i) => {
          const letter = String.fromCharCode(65 + i);
          optionsObj[letter] = opt.text;
        });
        answerOptions = [JSON.stringify(optionsObj)];
      }
      
      let imageIndex = -1;
      
      // Validasi gambar - HARUS File object
      const isValidImage = q.image && 
                          q.image instanceof File && 
                          q.image.size > 0;
      
      if (isValidImage) {
        // Cek duplikat
        const existingIndex = imageFiles.findIndex(f => 
          f.name === q.image.name && f.size === q.image.size
        );
        
        if (existingIndex !== -1) {
          imageIndex = existingIndex;
        } else {
          imageIndex = imageFiles.length;
          imageFiles.push(q.image);
        }
        console.log(`Question ${idx + 1} will upload image: ${q.image.name}`);
      } else {
        console.log(`Question ${idx + 1} has no valid image file`);
      }
      
      return {
        question_type: q.type === 'multiple_choice' ? 'multiple_choice' : 'free_text',
        question_text: q.text,
        answer_options: answerOptions,
        explanation: q.explanation || "",
        placeholder_text: q.placeholder || "",
        image_index: isValidImage ? imageIndex : -1
      };
    });
    
    console.log("Formatted Questions:", JSON.stringify(formattedQuestions, null, 2));
    console.log("Image Files to upload:", imageFiles.length);
    
    if (imageFiles.length === 0) {
      console.log("No images to upload");
    } else {
      imageFiles.forEach((f, i) => {
        console.log(`Image ${i}: ${f.name}, ${f.size} bytes`);
      });
    }
    
    // Submit ke API
    const result = await submitAssessment(formattedQuestions, imageFiles);
    
    console.log("API Response:", result);
    
    if (result.status === "success") {
      setSubmitted(true);
      const newRoomCode = generateRoomCode();
      setRoomCode(newRoomCode);
      setScore(calculateScore());
      
      alert(`Success! ${result.data?.success_count || 0} questions saved. Room code: ${newRoomCode}`);
    } else {
      alert(`Failed: ${result.message}`);
      setShowRoomModal(false);
    }
    
  } catch (error) {
    console.error("Error:", error);
    alert(`Error: ${error.message}`);
    setShowRoomModal(false);
  } finally {
    setIsLoading(false);
  }
};
const generateRoomCode = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

// Helper function untuk calculate score (jika diperlukan)
const calculateScore = () => {
  let correctCount = 0;
  let totalMCQuestions = 0;

  assessmentData?.questions.forEach((q) => {
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

// Helper function untuk convert base64 ke File
function dataURLtoFile(dataurl, filename) {
  const arr = dataurl.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}

// Helper function to convert base64 to File
function dataURLtoFile(dataurl, filename) {
  const arr = dataurl.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}

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

  const renderSingleQuestion = () => {
    if (!assessmentData) return null;
    
    const q = assessmentData.questions[currentQuestionIndex];
    const idx = currentQuestionIndex;
    const isAnswered = userAnswers[q.id]?.value;
const imageSrc = q.image_url || 
                 (q.imagePreview) || 
                 (q.image instanceof File ? URL.createObjectURL(q.image) : null);
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
          
         {imageSrc && (
  <div className="question-image-container">
    <img 
      src={imageSrc} 
      alt={`Question ${idx + 1}`} 
      className="question-image-preview"
      onError={(e) => {
        e.target.style.display = 'none';
        console.error('Image failed to load:', imageSrc);
      }}
    />
  </div>
)}
D
          
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
          
          <button 
            className="nav-btn submit-btn" 
            onClick={handlePublish}
            disabled={isLoading}
          >
            {isLoading ? 'Publishing...' : 'Publish'}
          </button>
        </div>
      </div>
    );
  };

  const renderAllQuestions = () => {
    if (!assessmentData) return null;
    
    return (
      <div className="assessment-form">
        <div className="cards-grid">
          {assessmentData.questions.map((q, idx) => {
const imageSrc = q.image_url || 
                 (q.imagePreview) || 
                 (q.image instanceof File ? URL.createObjectURL(q.image) : null);            
            return (
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
                  
{imageSrc && (
  <div className="question-image-container">
    <img 
      src={imageSrc} 
      alt={`Question ${idx + 1}`} 
      className="question-image-preview"
      onError={(e) => {
        e.target.style.display = 'none';
        console.error('Image failed to load:', imageSrc);
      }}
    />
  </div>
)}
D                  
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
            );
          })}
        </div>
        
        <div className="publish-all-container">
          <button 
            className="publish-all-btn" 
            onClick={handlePublish}
            disabled={isLoading}
          >
            {isLoading ? 'Publishing...' : '📤 Publish Assessment'}
          </button>
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
                <button className="submit-assessment-btn" onClick={handlePublish} disabled={isLoading}>
                  {isLoading ? 'Publishing...' : 'Publish'}
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

      {showSaveNotification && (
        <div className="save-notification">
          <div className="notification-content">
            <span className="notification-icon">💾</span>
            <span>Draft saved successfully!</span>
          </div>
        </div>
      )}

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
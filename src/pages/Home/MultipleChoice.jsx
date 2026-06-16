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
      required: true,
      image: null
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
        required: true,
        image: null
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

const handleImageUpload = (e) => {
  const file = e.target.files[0];
  if (file && (file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg')) {
    if (file.size > 10 * 1024 * 1024) {
      alert('File too large! Max 10MB');
      return;
    }
    
    // SIMPAN FILE OBJECT - BUKAN BLOB URL
    updateQuestion('image', file);  // ← Ini File object
    
    // Buat preview URL untuk ditampilkan (hanya untuk preview)
    const previewUrl = URL.createObjectURL(file);
    updateQuestion('imagePreview', previewUrl);
    
    console.log("Image uploaded:", {
      name: file.name,
      size: file.size,
      type: file.type,
      isFile: file instanceof File
    });
  } else {
    alert('Please upload a valid image file (JPEG, PNG, JPG)');
  }
};

const removeImage = () => {
  // Revoke preview URL untuk mencegah memory leak
  if (questions[currentQuestion].imagePreview) {
    URL.revokeObjectURL(questions[currentQuestion].imagePreview);
  }
  updateQuestion('image', null);
  updateQuestion('imagePreview', null);
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
  // Validasi
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
  
  // Validasi correct answer untuk multiple choice
  const hasCorrectAnswer = questions.every(q => {
    if (q.type === 'multiple_choice') {
      return q.options.some(opt => opt.isCorrect === true);
    }
    return true;
  });
  
  if (!hasCorrectAnswer) {
    alert('Please mark the correct answer for each multiple choice question');
    return;
  }
  
  // Siapkan data untuk disimpan ke localStorage
  const questionsToSave = questions.map(q => {
    const questionCopy = { ...q };
    
    // PENTING: Pastikan image adalah File object
    if (q.image && q.image instanceof File) {
      // File object - simpan langsung
      questionCopy.image = q.image;
      console.log(`Saving File object for question ${q.id}:`, {
        name: q.image.name,
        size: q.image.size,
        type: q.image.type
      });
    } else if (q.image && typeof q.image === 'string' && q.image.startsWith('blob:')) {
      // JANGAN SIMPAN BLOB URL! Ini tidak bisa diupload
      console.warn(`Question ${q.id} has blob URL, removing it`);
      questionCopy.image = null;
    } else {
      questionCopy.image = null;
    }
    
    // Simpan preview untuk tampilan (optional)
    if (q.imagePreview) {
      questionCopy.imagePreview = q.imagePreview;
    }
    
    return questionCopy;
  });
  
  // Data lengkap
  const assessmentDataToSave = {
    title: title || 'Untitled Assessment',
    questions: questionsToSave,
    timestamp: new Date().toISOString(),
    totalQuestions: questions.length
  };
  
  // Simpan ke localStorage
  localStorage.setItem('assessmentData', JSON.stringify(assessmentDataToSave));
  
  // Verifikasi data tersimpan dengan benar
  const savedData = JSON.parse(localStorage.getItem('assessmentData'));
  console.log("Saved to localStorage:");
  savedData.questions.forEach((q, idx) => {
    console.log(`Question ${idx + 1}:`, {
      text: q.text,
      hasImage: !!q.image,
      isFile: q.image instanceof File,
      imageType: q.image ? typeof q.image : 'null'
    });
  });
  
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
                {q.image && <span className="image-indicator">🖼️</span>}
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
            <button className="submit-btn" onClick={handleSubmit}>
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
                Free Text
              </label>
            </div>
          </div>

          <div className="form-group">
            <label>Question Image (Optional)</label>
            <div className="image-upload-container">
  {questions[currentQuestion].imagePreview ? (
    <div className="image-preview">
      <img 
        src={questions[currentQuestion].imagePreview} 
        alt="Question illustration"
        style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'contain' }}
      />
      <button type="button" className="remove-image-btn" onClick={removeImage}>
        ✕ Remove
      </button>
    </div>
  ) : (
    <div className="upload-area">
      <input
        type="file"
        accept="image/jpeg,image/png,image/jpg"
        onChange={handleImageUpload}
        id={`image-upload-${currentQuestion}`}
        style={{ display: 'none' }}
      />
      <label htmlFor={`image-upload-${currentQuestion}`} className="upload-label">
        <span>🖼️</span>
        <span>Click to Upload Image</span>
        <span className="upload-hint">JPEG, PNG only (Max 5MB)</span>
      </label>
    </div>
  )}
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
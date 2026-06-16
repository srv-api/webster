import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Library.css';

const Library = () => {
  const navigate = useNavigate();
  const [assessments, setAssessments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Load assessments from localStorage
  useEffect(() => {
    loadAssessments();
  }, []);

  const loadAssessments = () => {
    const savedAssessments = localStorage.getItem('assessments');
    if (savedAssessments) {
      setAssessments(JSON.parse(savedAssessments));
    } else {
      // Sample data for demonstration
      const sampleAssessments = [
        {
          id: 1,
          title: 'Mathematics Quiz',
          type: 'assessment',
          questionType: 'multiple-choice',
          dateCreated: '2024-01-15',
          totalQuestions: 10,
          status: 'published'
        },
        {
          id: 2,
          title: 'Science Presentation',
          type: 'presentation',
          questionType: 'multiple-choice',
          dateCreated: '2024-01-20',
          totalQuestions: 5,
          status: 'draft'
        },
        {
          id: 3,
          title: 'History Video Quiz',
          type: 'video',
          questionType: 'true-false',
          dateCreated: '2024-01-25',
          totalQuestions: 8,
          status: 'published'
        }
      ];
      setAssessments(sampleAssessments);
      localStorage.setItem('assessments', JSON.stringify(sampleAssessments));
    }
  };

  // Save assessment to localStorage
  const saveAssessment = (newAssessment) => {
    const updatedAssessments = [...assessments, { ...newAssessment, id: Date.now(), dateCreated: new Date().toISOString().split('T')[0] }];
    setAssessments(updatedAssessments);
    localStorage.setItem('assessments', JSON.stringify(updatedAssessments));
  };

  // Delete assessment
  const deleteAssessment = (id) => {
    const updatedAssessments = assessments.filter(assessment => assessment.id !== id);
    setAssessments(updatedAssessments);
    localStorage.setItem('assessments', JSON.stringify(updatedAssessments));
    setShowDeleteModal(false);
    setSelectedAssessment(null);
  };

  // Filter assessments
  const filteredAssessments = assessments.filter(assessment => {
    const matchesSearch = assessment.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || assessment.type === filterType;
    return matchesSearch && matchesType;
  });

  // Get status badge class
  const getStatusBadge = (status) => {
    return status === 'published' ? 'status-published' : 'status-draft';
  };

  // Get type icon
  const getTypeIcon = (type) => {
    switch(type) {
      case 'assessment': return '📝';
      case 'presentation': return '📊';
      case 'video': return '🎥';
      case 'passage': return '📖';
      case 'flashcards': return '🃏';
      default: return '📄';
    }
  };

  // Handle edit assessment
  const handleEdit = (assessment) => {
    navigate('/edit-assessment', { state: { assessment } });
  };

  // Handle preview assessment
  const handlePreview = (assessment) => {
    navigate('/preview', { state: { assessment } });
  };

  // Handle duplicate assessment
  const handleDuplicate = (assessment) => {
    const newAssessment = {
      ...assessment,
      id: Date.now(),
      title: `${assessment.title} (Copy)`,
      dateCreated: new Date().toISOString().split('T')[0]
    };
    saveAssessment(newAssessment);
  };

  // Get total assessments count
  const getStats = () => {
    return {
      total: assessments.length,
      published: assessments.filter(a => a.status === 'published').length,
      draft: assessments.filter(a => a.status === 'draft').length
    };
  };

  const stats = getStats();

  return (
    <div className="library-container">
      {/* Header */}
      <div className="library-header">
        <div className="library-title-section">
          <h1>Assessment Library</h1>
          <p>Manage and organize all your assessments</p>
        </div>
        <button 
          className="create-new-btn"
          onClick={() => navigate('/create-assessment')}
        >
          + Create New Assessment
        </button>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{stats.total}</div>
          <div className="stat-label">Total Assessments</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.published}</div>
          <div className="stat-label">Published</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.draft}</div>
          <div className="stat-label">Drafts</div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search assessments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>

        <div className="filter-buttons">
          <button
            className={`filter-btn ${filterType === 'all' ? 'active' : ''}`}
            onClick={() => setFilterType('all')}
          >
            All
          </button>
          <button
            className={`filter-btn ${filterType === 'assessment' ? 'active' : ''}`}
            onClick={() => setFilterType('assessment')}
          >
            Assessments
          </button>
          <button
            className={`filter-btn ${filterType === 'presentation' ? 'active' : ''}`}
            onClick={() => setFilterType('presentation')}
          >
            Presentations
          </button>
          <button
            className={`filter-btn ${filterType === 'video' ? 'active' : ''}`}
            onClick={() => setFilterType('video')}
          >
            Videos
          </button>
          <button
            className={`filter-btn ${filterType === 'passage' ? 'active' : ''}`}
            onClick={() => setFilterType('passage')}
          >
            Passages
          </button>
          <button
            className={`filter-btn ${filterType === 'flashcards' ? 'active' : ''}`}
            onClick={() => setFilterType('flashcards')}
          >
            Flashcards
          </button>
        </div>
      </div>

      {/* Assessments Grid */}
      {filteredAssessments.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📚</div>
          <h3>No assessments found</h3>
          <p>Create your first assessment to get started</p>
          <button 
            className="create-empty-btn"
            onClick={() => navigate('/create-assessment')}
          >
            Create Assessment
          </button>
        </div>
      ) : (
        <div className="assessments-grid">
          {filteredAssessments.map((assessment) => (
            <div key={assessment.id} className="assessment-library-card">
              <div className="card-header">
                <div className="card-type-icon">{getTypeIcon(assessment.type)}</div>
                <span className={`status-badge ${getStatusBadge(assessment.status)}`}>
                  {assessment.status}
                </span>
              </div>
              
              <div className="card-body">
                <h3 className="card-title">{assessment.title}</h3>
                <div className="card-meta">
                  <span className="meta-item">
                    <span className="meta-icon">📅</span>
                    {assessment.dateCreated}
                  </span>
                  <span className="meta-item">
                    <span className="meta-icon">❓</span>
                    {assessment.totalQuestions} questions
                  </span>
                  <span className="meta-item">
                    <span className="meta-icon">📋</span>
                    {assessment.questionType}
                  </span>
                </div>
              </div>
              
              <div className="card-actions">
                <button 
                  className="action-btn preview-btn"
                  onClick={() => handlePreview(assessment)}
                  title="Preview"
                >
                  👁️ Preview
                </button>
                <button 
                  className="action-btn edit-btn"
                  onClick={() => handleEdit(assessment)}
                  title="Edit"
                >
                  ✏️ Edit
                </button>
                <button 
                  className="action-btn duplicate-btn"
                  onClick={() => handleDuplicate(assessment)}
                  title="Duplicate"
                >
                  📋 Duplicate
                </button>
                <button 
                  className="action-btn delete-btn"
                  onClick={() => {
                    setSelectedAssessment(assessment);
                    setShowDeleteModal(true);
                  }}
                  title="Delete"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedAssessment && (
        <div className="delete-modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="delete-modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="delete-modal-header">
              <h3>Delete Assessment</h3>
              <button className="delete-modal-close" onClick={() => setShowDeleteModal(false)}>×</button>
            </div>
            <div className="delete-modal-body">
              <p>Are you sure you want to delete <strong>"{selectedAssessment.title}"</strong>?</p>
              <p className="delete-warning">This action cannot be undone.</p>
            </div>
            <div className="delete-modal-footer">
              <button className="cancel-delete-btn" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </button>
              <button className="confirm-delete-btn" onClick={() => deleteAssessment(selectedAssessment.id)}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Library;
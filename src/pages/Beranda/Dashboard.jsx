import React, { useState } from 'react';
import ButtonGroup from './ButtonGroup';
import DashboardStats from './DashboardStats';
import CreateAssessment from './CreateAssessment';
import '../styles/Dashboard.css';

const Dashboard = () => {
  // ========================================
  // STATE MANAGEMENT
  // ========================================
  const [showChart, setShowChart] = useState(false);
  const [showAssessment, setShowAssessment] = useState(false);
  const [showQuestionTypes, setShowQuestionTypes] = useState(false);
  const [selectedType, setSelectedType] = useState(null);
  const [selectedQuestionType, setSelectedQuestionType] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [assessmentData, setAssessmentData] = useState({
    title: '',
    description: '',
    type: '',
    questionType: '',
    duration: 30,
    passingScore: 70
  });

  // ========================================
  // ASSESSMENT TYPES DATA
  // ========================================
  const assessmentTypes = [
    {
      id: 'assessment',
      title: 'Assessment',
      icon: '📝',
      description: 'Quick & interactive questions',
      color: '#667eea'
    },
    {
      id: 'presentation',
      title: 'Presentation',
      icon: '📊',
      description: 'Slides with questions and whiteboard',
      color: '#f093fb'
    },
    {
      id: 'video',
      title: 'Video',
      icon: '🎥',
      description: 'Questions at key points in the video',
      color: '#4facfe'
    },
    {
      id: 'passage',
      title: 'Passage',
      icon: '📖',
      description: 'Questions based on a passage',
      color: '#43e97b'
    },
    {
      id: 'flashcards',
      title: 'Flashcards',
      icon: '🃏',
      description: 'Questions on front, answers on back',
      color: '#fa709a'
    }
  ];

  // ========================================
  // HELPER FUNCTIONS
  // ========================================
  const generateChartData = () => {
    return {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      values: [65, 78, 82, 71, 88, 95]
    };
  };

  // ========================================
  // EVENT HANDLERS
  // ========================================
  const handleDashboardClick = () => {
    const data = generateChartData();
    setChartData(data);
    setShowChart(true);
    setShowAssessment(false);
    setShowQuestionTypes(false);
    setSelectedType(null);
    setSelectedQuestionType(null);
  };

  const handleCreateClick = () => {
    setShowAssessment(true);
    setShowChart(false);
    setShowQuestionTypes(false);
    setSelectedType(null);
    setSelectedQuestionType(null);
    // Reset form
    setAssessmentData({
      title: '',
      description: '',
      type: '',
      questionType: '',
      duration: 30,
      passingScore: 70
    });
  };

  const handleCloseAssessment = () => {
    setShowAssessment(false);
    setShowQuestionTypes(false);
    setSelectedType(null);
    setSelectedQuestionType(null);
  };

  const handleSelectType = (type) => {
    setSelectedType(type);
    if (type.id === 'assessment') {
      setShowQuestionTypes(true);
    } else {
      setShowQuestionTypes(false);
    }
  };

  const handleSelectQuestionType = (questionType) => {
    setSelectedQuestionType(questionType);
    setShowQuestionTypes(false);
    setAssessmentData({
      ...assessmentData,
      questionType: questionType.title,
      type: selectedType?.title
    });
  };

  const handleBackToTypes = () => {
    setShowQuestionTypes(false);
    setSelectedType(null);
    setSelectedQuestionType(null);
  };

  const handleBackToQuestionTypes = () => {
    setShowQuestionTypes(true);
    setSelectedQuestionType(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAssessmentData({
      ...assessmentData,
      [name]: value
    });
  };

  const handleSubmitAssessment = (e) => {
    e.preventDefault();
    const message = selectedType?.id === 'assessment' 
      ? `Assessment "${assessmentData.title}" (${selectedType?.title} - ${selectedQuestionType?.title}) has been created successfully!`
      : `Assessment "${assessmentData.title}" (${selectedType?.title}) has been created successfully!`;
    alert(message);
    setShowAssessment(false);
    setShowQuestionTypes(false);
    setSelectedType(null);
    setSelectedQuestionType(null);
    setAssessmentData({
      title: '',
      description: '',
      type: '',
      questionType: '',
      duration: 30,
      passingScore: 70
    });
  };

  // ========================================
  // RENDER COMPONENT
  // ========================================
  return (
    <div className="dashboard-container">
      <ButtonGroup 
        onDashboardClick={handleDashboardClick}
        onCreateClick={handleCreateClick}
      />

      {/* DASHBOARD STATISTICS SLIDE */}
      {showChart && chartData && (
        <DashboardStats chartData={chartData} onClose={() => setShowChart(false)} />
      )}

      {/* CREATE ASSESSMENT SLIDE */}
      {showAssessment && (
        <CreateAssessment
          showQuestionTypes={showQuestionTypes}
          selectedType={selectedType}
          selectedQuestionType={selectedQuestionType}
          assessmentTypes={assessmentTypes}
          assessmentData={assessmentData}
          onSelectType={handleSelectType}
          onSelectQuestionType={handleSelectQuestionType}
          onBackToTypes={handleBackToTypes}
          onBackToQuestionTypes={handleBackToQuestionTypes}
          onInputChange={handleInputChange}
          onSubmit={handleSubmitAssessment}
          onCancel={handleCloseAssessment}
        />
      )}
    </div>
  );
};

export default Dashboard;
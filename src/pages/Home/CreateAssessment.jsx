import React from 'react';
import AssessmentTypes from './AssessmentTypes';
import QuestionTypes from './QuestionTypes';
import AssessmentForm from './AssessmentForm';
import MultipleChoice from './MultipleChoice';
import '../styles/CreateAssessment.css';

const CreateAssessment = ({ 
  showQuestionTypes,
  selectedType, 
  selectedQuestionType,
  assessmentTypes, 
  assessmentData,
  onSelectType, 
  onSelectQuestionType,
  onBackToTypes,
  onBackToQuestionTypes,
  onInputChange, 
  onSubmit, 
  onCancel 
}) => {
  return (
    <div className="slide-container slide-in-right">
      <div className="assessment-card">
        {/* Step 1: Pilih Assessment Type */}
        {!selectedType && !showQuestionTypes && (
          <AssessmentTypes types={assessmentTypes} onSelectType={onSelectType} />
        )}

        {/* Step 2: Pilih Question Type (hanya untuk Assessment) */}
        {selectedType && selectedType.id === 'assessment' && showQuestionTypes && (
          <QuestionTypes 
            selectedType={selectedType}
            onSelectQuestionType={onSelectQuestionType}
            onBack={onBackToTypes}
          />
        )}

        {/* Step 3: Multiple Choice Page */}
        {selectedType?.id === 'assessment' && 
         selectedQuestionType?.id === 'multiple-choice' && 
         !showQuestionTypes && (
          <MultipleChoice 
            onBack={onBackToQuestionTypes}
            assessmentData={assessmentData}
          />
        )}

        {/* Step 4: Form untuk type lain atau question type lain */}
        {selectedType && (
          <>
            {/* Untuk type selain Assessment */}
            {selectedType.id !== 'assessment' && !showQuestionTypes && (
              <AssessmentForm 
                selectedType={selectedType}
                selectedQuestionType={null}
                assessmentData={assessmentData}
                onBack={onBackToTypes}
                onInputChange={onInputChange}
                onSubmit={onSubmit}
                onCancel={onCancel}
              />
            )}
            
            {/* Untuk Assessment dengan question type selain multiple-choice (multi-select, true-false) */}
            {selectedType.id === 'assessment' && 
             selectedQuestionType && 
             selectedQuestionType.id !== 'multiple-choice' && 
             !showQuestionTypes && (
              <AssessmentForm 
                selectedType={selectedType}
                selectedQuestionType={selectedQuestionType}
                assessmentData={assessmentData}
                onBack={onBackToQuestionTypes}
                onInputChange={onInputChange}
                onSubmit={onSubmit}
                onCancel={onCancel}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CreateAssessment;
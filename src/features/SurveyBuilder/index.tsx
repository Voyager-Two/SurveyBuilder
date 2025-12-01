'use client';

import { Iconify } from '@app/common/UI/iconify';
import { useDispatch, useSelector } from 'react-redux';
import { JSONViewer } from './components/JSONViewer';
import { LivePreview } from './components/LivePreview';
import { QuestionEditor } from './components/QuestionEditor';
import { SurveyPreview } from './components/SurveyPreview';
import {
  addQuestion,
  clearResponses,
  resetSurvey,
  selectActiveQuestionId,
  selectLivePreview,
  selectQuestions,
  selectSurvey,
  setSurveyDescription,
  setSurveyTitle,
  startLivePreview,
} from './surveySlice';
import styles from './css/SurveyBuilder.module.css';

export default function SurveyBuilder() {
  const dispatch = useDispatch();
  const survey = useSelector(selectSurvey);
  const questions = useSelector(selectQuestions);
  const activeQuestionId = useSelector(selectActiveQuestionId);
  const livePreview = useSelector(selectLivePreview);

  const handleAddQuestion = () => {
    dispatch(addQuestion('text'));
  };

  const handleReset = () => {
    dispatch(resetSurvey());
  };

  const handleClearResponses = () => {
    dispatch(clearResponses());
  };

  const handleStartLivePreview = () => {
    dispatch(startLivePreview());
  };

  return (
    <>
      {/* Live Preview Overlay */}
      {livePreview.status !== 'idle' && <LivePreview />}
      <div className={styles.container}>
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.logo}>
            <div className={styles.logoIcon}>
              <Iconify icon="solar:document-add-bold" width={20} />
            </div>
            <span className={styles.logoText}>Survey Builder</span>
          </div>

          <div className={styles.headerActions}>
            <button
              type="button"
              onClick={handleClearResponses}
              className={styles.addOptionButton}
              style={{ padding: '10px 16px', borderStyle: 'solid' }}
            >
              <Iconify icon="solar:eraser-linear" width={16} />
              Clear Responses
            </button>
            <button
              type="button"
              onClick={handleReset}
              className={styles.addOptionButton}
              style={{ padding: '10px 16px', borderStyle: 'solid' }}
            >
              <Iconify icon="solar:restart-linear" width={16} />
              Reset Survey
            </button>
            <button
              type="button"
              onClick={handleStartLivePreview}
              className={styles.takeSurveyButton}
              disabled={questions.length === 0}
            >
              <Iconify icon="solar:play-bold" width={16} />
              Take Survey
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className={styles.mainContent}>
          {/* Builder Panel */}
          <div className={`${styles.panel} ${styles.builderPanel}`}>
            <div className={styles.panelHeader}>
              <span className={styles.panelTitle}>Survey Editor</span>
              <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>
                {questions.length} question{questions.length !== 1 ? 's' : ''}
              </span>
            </div>

            <div className={styles.panelContent}>
              {/* Survey Title & Description */}
              <div style={{ marginBottom: '24px' }}>
                <label className={styles.inputLabel}>Survey Title</label>
                <input
                  type="text"
                  value={survey.title}
                  onChange={(e) => dispatch(setSurveyTitle(e.target.value))}
                  placeholder="Enter survey title..."
                  className={styles.textInput}
                  style={{ marginBottom: '12px' }}
                />
                <label className={styles.inputLabel}>Description (Optional)</label>
                <input
                  type="text"
                  value={survey.description || ''}
                  onChange={(e) => dispatch(setSurveyDescription(e.target.value))}
                  placeholder="Enter survey description..."
                  className={styles.textInput}
                />
              </div>

              {/* Questions */}
              {questions.length === 0 ? (
                <div className={styles.emptyState}>
                  <div className={styles.emptyStateIcon}>
                    <Iconify icon="solar:clipboard-list-linear" width={36} />
                  </div>
                  <h3 className={styles.emptyStateTitle}>No Questions Yet</h3>
                  <p className={styles.emptyStateText}>
                    Start building your survey by adding your first question
                  </p>
                  <button
                    type="button"
                    onClick={handleAddQuestion}
                    className={styles.addQuestionButton}
                    style={{ width: 'auto', padding: '12px 24px' }}
                  >
                    <Iconify icon="solar:add-circle-bold" width={18} />
                    Add First Question
                  </button>
                </div>
              ) : (
                <div className={styles.questionList}>
                  {questions.map((question, index) => (
                    <QuestionEditor
                      key={question.id}
                      question={question}
                      index={index}
                      isActive={question.id === activeQuestionId}
                    />
                  ))}

                  <button
                    type="button"
                    onClick={handleAddQuestion}
                    className={styles.addQuestionButton}
                  >
                    <Iconify icon="solar:add-circle-bold" width={18} />
                    Add Question
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Preview Panel */}
          <div className={`${styles.panel} ${styles.previewPanel}`}>
            <div className={styles.panelHeader}>
              <span className={styles.panelTitle}>Preview</span>
            </div>

            <div className={styles.panelContent}>
              <SurveyPreview />
              <JSONViewer />
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

'use client';

import { Iconify } from '@app/common/UI/iconify';
import { useDispatch, useSelector } from 'react-redux';
import {
  exitLivePreview,
  retakeSurvey,
  selectLivePreview,
  selectQuestions,
  selectResponses,
  selectSurvey,
  setResponse,
  submitLivePreview,
} from '../surveySlice';
import styles from '../css/SurveyBuilder.module.css';

export function LivePreview() {
  const dispatch = useDispatch();
  const survey = useSelector(selectSurvey);
  const questions = useSelector(selectQuestions);
  const responses = useSelector(selectResponses);
  const livePreview = useSelector(selectLivePreview);

  const handleTextChange = (questionId: string, value: string) => {
    dispatch(setResponse({ questionId, value }));
  };

  const handleOptionSelect = (questionId: string, optionId: string) => {
    dispatch(setResponse({ questionId, value: optionId }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(submitLivePreview());
  };

  const handleBackToBuilder = () => {
    dispatch(exitLivePreview());
  };

  const handleRetake = () => {
    dispatch(retakeSurvey());
  };

  // Check if all required questions are answered
  const requiredQuestions = questions.filter((q) => q.required);
  const allRequiredAnswered = requiredQuestions.every(
    (q) => responses.responses[q.id] && responses.responses[q.id].trim() !== ''
  );

  if (livePreview.status === 'idle') {
    return null;
  }

  // Thank you page after submission
  if (livePreview.status === 'submitted') {
    return (
      <div className={styles.livePreviewOverlay}>
        <div className={styles.livePreviewContainer}>
          <div className={styles.thankYouPage}>
            <div className={styles.thankYouIcon}>
              <Iconify icon="solar:check-circle-bold" width={64} />
            </div>
            <h1 className={styles.thankYouTitle}>Thank You!</h1>
            <p className={styles.thankYouText}>Your response has been submitted successfully.</p>
            {livePreview.submittedAt && (
              <p className={styles.thankYouTimestamp}>
                Submitted at {new Date(livePreview.submittedAt).toLocaleString()}
              </p>
            )}

            <div className={styles.thankYouActions}>
              <button
                type="button"
                onClick={handleRetake}
                className={styles.thankYouButtonSecondary}
              >
                <Iconify icon="solar:refresh-linear" width={18} />
                Take Again
              </button>
              <button
                type="button"
                onClick={handleBackToBuilder}
                className={styles.thankYouButtonPrimary}
              >
                <Iconify icon="solar:pen-2-linear" width={18} />
                Back to Builder
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Survey taking view
  return (
    <div className={styles.livePreviewOverlay}>
      <div className={styles.livePreviewContainer}>
        <div className={styles.livePreviewHeader}>
          <button
            type="button"
            onClick={handleBackToBuilder}
            className={styles.livePreviewBackButton}
          >
            <Iconify icon="solar:arrow-left-linear" width={20} />
            Exit Preview
          </button>
          <div className={styles.livePreviewBadge}>
            <Iconify icon="solar:eye-linear" width={16} />
            Live Preview Mode
          </div>
        </div>

        <form onSubmit={handleSubmit} className={styles.livePreviewForm}>
          <div className={styles.livePreviewCard}>
            {survey.title && <h1 className={styles.livePreviewTitle}>{survey.title}</h1>}
            {survey.description && (
              <p className={styles.livePreviewDescription}>{survey.description}</p>
            )}
            {!survey.title && !survey.description && (
              <p className={styles.livePreviewNoTitle}>Untitled Survey</p>
            )}
          </div>

          {questions.length === 0 ? (
            <div className={styles.livePreviewEmpty}>
              <Iconify icon="solar:clipboard-list-linear" width={48} />
              <p>This survey has no questions yet.</p>
              <button
                type="button"
                onClick={handleBackToBuilder}
                className={styles.thankYouButtonPrimary}
              >
                Add Questions
              </button>
            </div>
          ) : (
            <>
              {questions.map((question, index) => (
                <div key={question.id} className={styles.livePreviewQuestion}>
                  <div className={styles.livePreviewQuestionLabel}>
                    <span className={styles.livePreviewQuestionNumber}>{index + 1}</span>
                    <span className={styles.livePreviewQuestionText}>
                      {question.label || 'Untitled Question'}
                      {question.required && <span className={styles.livePreviewRequired}>*</span>}
                    </span>
                  </div>

                  {question.type === 'text' ? (
                    <input
                      type="text"
                      value={responses.responses[question.id] || ''}
                      onChange={(e) => handleTextChange(question.id, e.target.value)}
                      placeholder="Type your answer here..."
                      className={styles.livePreviewInput}
                      required={question.required}
                    />
                  ) : (
                    <div className={styles.livePreviewOptions}>
                      {question.options?.map((option) => (
                        <label
                          key={option.id}
                          className={`${styles.livePreviewOption} ${
                            responses.responses[question.id] === option.id
                              ? styles.livePreviewOptionSelected
                              : ''
                          }`}
                        >
                          <input
                            type="radio"
                            name={question.id}
                            value={option.id}
                            checked={responses.responses[question.id] === option.id}
                            onChange={() => handleOptionSelect(question.id, option.id)}
                            required={question.required}
                            className={styles.livePreviewRadioInput}
                          />
                          <span className={styles.livePreviewRadio} />
                          <span className={styles.livePreviewOptionText}>
                            {option.text || 'Untitled Option'}
                          </span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              <div className={styles.livePreviewFooter}>
                {!allRequiredAnswered && requiredQuestions.length > 0 && (
                  <p className={styles.livePreviewHint}>
                    <Iconify icon="solar:info-circle-linear" width={16} />
                    Please answer all required questions (*)
                  </p>
                )}
                <button
                  type="submit"
                  className={styles.livePreviewSubmitButton}
                  disabled={!allRequiredAnswered && requiredQuestions.length > 0}
                >
                  Submit Response
                  <Iconify icon="solar:arrow-right-linear" width={18} />
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}

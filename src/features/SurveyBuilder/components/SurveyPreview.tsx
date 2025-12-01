'use client';

import { useDispatch, useSelector } from 'react-redux';
import { selectQuestions, selectResponses, selectSurvey, setResponse } from '../surveySlice';
import styles from '../css/SurveyBuilder.module.css';

export function SurveyPreview() {
  const dispatch = useDispatch();
  const survey = useSelector(selectSurvey);
  const questions = useSelector(selectQuestions);
  const responses = useSelector(selectResponses);

  const handleTextChange = (questionId: string, value: string) => {
    dispatch(setResponse({ questionId, value }));
  };

  const handleOptionSelect = (questionId: string, optionId: string) => {
    dispatch(setResponse({ questionId, value: optionId }));
  };

  return (
    <div className={styles.surveyPreview}>
      {survey.title && <h1 className={styles.surveyTitle}>{survey.title}</h1>}
      {survey.description && <p className={styles.surveyDescription}>{survey.description}</p>}

      {questions.length === 0 ? (
        <div className={styles.previewEmptyHint}>Add questions in the editor to see them here</div>
      ) : (
        questions.map((question, index) => (
          <div key={question.id} className={styles.previewQuestion}>
            <div className={styles.previewQuestionLabel}>
              <span>
                {index + 1}. {question.label || 'Untitled Question'}
              </span>
              {question.required && <span className={styles.requiredBadge}>*</span>}
            </div>

            {question.type === 'text' ? (
              <input
                type="text"
                value={responses.responses[question.id] || ''}
                onChange={(e) => handleTextChange(question.id, e.target.value)}
                placeholder="Your answer..."
                className={styles.previewTextInput}
              />
            ) : (
              <div className={styles.previewOptions}>
                {question.options?.map((option) => (
                  <div
                    key={option.id}
                    className={`${styles.previewOption} ${
                      responses.responses[question.id] === option.id ? styles.selected : ''
                    }`}
                    onClick={() => handleOptionSelect(question.id, option.id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        handleOptionSelect(question.id, option.id);
                      }
                    }}
                  >
                    <div className={styles.radioCircle} />
                    <span className={styles.optionLabel}>{option.text || 'Untitled Option'}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}

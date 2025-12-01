'use client';

import { Iconify } from '@app/common/UI/iconify';
import { useDispatch } from 'react-redux';
import {
  removeQuestion,
  setActiveQuestion,
  updateQuestionLabel,
  updateQuestionRequired,
  updateQuestionType,
} from '../surveySlice';
import type { Question, QuestionType } from '../types';
import { OptionEditor } from './OptionEditor';
import styles from '../css/SurveyBuilder.module.css';

interface QuestionEditorProps {
  question: Question;
  index: number;
  isActive: boolean;
}

export function QuestionEditor({ question, index, isActive }: QuestionEditorProps) {
  const dispatch = useDispatch();

  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(updateQuestionLabel({ questionId: question.id, label: e.target.value }));
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(updateQuestionType({ questionId: question.id, type: e.target.value as QuestionType }));
  };

  const handleRequiredToggle = () => {
    dispatch(updateQuestionRequired({ questionId: question.id, required: !question.required }));
  };

  const handleRemove = () => {
    dispatch(removeQuestion(question.id));
  };

  const handleClick = () => {
    dispatch(setActiveQuestion(question.id));
  };

  return (
    <div
      className={`${styles.questionCard} ${isActive ? styles.active : ''}`}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleClick();
        }
      }}
    >
      <div className={styles.questionHeader}>
        <div className={styles.questionNumber}>{index + 1}</div>
        <div className={styles.questionContent}>
          <input
            type="text"
            value={question.label}
            onChange={handleLabelChange}
            onClick={(e) => e.stopPropagation()}
            placeholder="Enter your question..."
            className={styles.textInput}
          />
        </div>
        <div className={styles.questionActions}>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleRemove();
            }}
            className={`${styles.iconButton} ${styles.danger}`}
            aria-label="Delete question"
          >
            <Iconify icon="solar:trash-bin-minimalistic-linear" width={16} />
          </button>
        </div>
      </div>

      <div className={styles.questionBody}>
        <div className={styles.controlRow}>
          <div className={styles.controlGroup}>
            <label className={styles.inputLabel}>Question Type</label>
            <select
              value={question.type}
              onChange={handleTypeChange}
              onClick={(e) => e.stopPropagation()}
              className={styles.select}
            >
              <option value="text">Freeform Text</option>
              <option value="multiple_choice">Multiple Choice</option>
            </select>
          </div>

          <div
            className={styles.toggle}
            onClick={(e) => {
              e.stopPropagation();
              handleRequiredToggle();
            }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.stopPropagation();
                handleRequiredToggle();
              }
            }}
          >
            <div className={`${styles.toggleSwitch} ${question.required ? styles.active : ''}`} />
            <span className={styles.toggleLabel}>Required</span>
          </div>
        </div>

        {question.type === 'multiple_choice' && question.options && (
          <div onClick={(e) => e.stopPropagation()}>
            <OptionEditor questionId={question.id} options={question.options} />
          </div>
        )}
      </div>
    </div>
  );
}

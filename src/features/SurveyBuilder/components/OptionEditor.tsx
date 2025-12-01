'use client';

import { Iconify } from '@app/common/UI/iconify';
import { useDispatch } from 'react-redux';
import { addOption, removeOption, updateOptionText } from '../surveySlice';
import type { QuestionOption } from '../types';
import styles from '../css/SurveyBuilder.module.css';

interface OptionEditorProps {
  questionId: string;
  options: QuestionOption[];
}

export function OptionEditor({ questionId, options }: OptionEditorProps) {
  const dispatch = useDispatch();

  const handleAddOption = () => {
    dispatch(addOption(questionId));
  };

  const handleRemoveOption = (optionId: string) => {
    dispatch(removeOption({ questionId, optionId }));
  };

  const handleUpdateOption = (optionId: string, text: string) => {
    dispatch(updateOptionText({ questionId, optionId, text }));
  };

  return (
    <div className={styles.optionsSection}>
      <div className={styles.optionsSectionHeader}>
        <span className={styles.optionsSectionTitle}>Answer Options</span>
      </div>

      <div className={styles.optionsList}>
        {options.map((option, index) => (
          <div key={option.id} className={styles.optionRow}>
            <input
              type="text"
              value={option.text}
              onChange={(e) => handleUpdateOption(option.id, e.target.value)}
              placeholder={`Option ${index + 1}`}
              className={styles.optionInput}
            />
            {options.length > 1 && (
              <button
                type="button"
                onClick={() => handleRemoveOption(option.id)}
                className={styles.optionRemoveButton}
                aria-label="Remove option"
              >
                <Iconify icon="solar:trash-bin-minimalistic-linear" width={14} />
              </button>
            )}
          </div>
        ))}
      </div>

      <button type="button" onClick={handleAddOption} className={styles.addOptionButton}>
        <Iconify icon="solar:add-circle-linear" width={16} />
        Add Option
      </button>
    </div>
  );
}

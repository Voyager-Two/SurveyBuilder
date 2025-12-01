'use client';

import { useState } from 'react';
import { Iconify } from '@app/common/UI/iconify';
import { useSelector } from 'react-redux';
import { selectResponses, selectSurvey } from '../surveySlice';
import styles from '../css/SurveyBuilder.module.css';

export function JSONViewer() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const survey = useSelector(selectSurvey);
  const responses = useSelector(selectResponses);

  const handleCopy = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const surveyJson = JSON.stringify(survey, null, 2);
  const responsesJson = JSON.stringify(responses, null, 2);

  return (
    <div className={styles.jsonSection}>
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className={`${styles.jsonToggle} ${isExpanded ? styles.active : ''}`}
      >
        <Iconify icon="solar:code-square-linear" width={18} />
        <span>{isExpanded ? 'Hide' : 'Show'} JSON Output</span>
        <Iconify
          icon={isExpanded ? 'solar:alt-arrow-up-linear' : 'solar:alt-arrow-down-linear'}
          width={16}
          style={{ marginLeft: 'auto' }}
        />
      </button>

      {isExpanded && (
        <div className={styles.jsonContent}>
          <div className={styles.jsonBlock}>
            <div className={styles.jsonBlockHeader}>
              <span>Survey Definition</span>
              <button
                type="button"
                onClick={() => handleCopy(surveyJson, 'survey')}
                className={styles.copyButton}
              >
                {copiedField === 'survey' ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <div className={styles.jsonCode}>
              <pre>{surveyJson}</pre>
            </div>
          </div>

          <div className={styles.jsonBlock}>
            <div className={styles.jsonBlockHeader}>
              <span>Survey Responses</span>
              <button
                type="button"
                onClick={() => handleCopy(responsesJson, 'responses')}
                className={styles.copyButton}
              >
                {copiedField === 'responses' ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <div className={styles.jsonCode}>
              <pre>{responsesJson}</pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

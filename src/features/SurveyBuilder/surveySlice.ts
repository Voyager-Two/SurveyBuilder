import type { RootState } from '@app/common/state/store';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  createEmptySurvey,
  createOption,
  createQuestion,
  LivePreviewStatus,
  Question,
  QuestionOption,
  QuestionType,
  Survey,
  SurveyBuilderState,
} from './types';

const initialState: SurveyBuilderState = {
  survey: createEmptySurvey(),
  responses: {
    surveyId: '',
    responses: {},
  },
  activeQuestionId: null,
  previewMode: false,
  livePreview: {
    status: 'idle',
    submittedAt: null,
  },
};

export const surveySlice = createSlice({
  name: 'survey',
  initialState,
  reducers: {
    // Survey actions
    setSurveyTitle: (state, action: PayloadAction<string>) => {
      state.survey.title = action.payload;
      state.survey.updatedAt = new Date().toISOString();
    },
    setSurveyDescription: (state, action: PayloadAction<string>) => {
      state.survey.description = action.payload;
      state.survey.updatedAt = new Date().toISOString();
    },
    resetSurvey: (state) => {
      state.survey = createEmptySurvey();
      state.responses = { surveyId: state.survey.id, responses: {} };
      state.activeQuestionId = null;
    },

    // Question actions
    addQuestion: (state, action: PayloadAction<QuestionType | undefined>) => {
      const newQuestion = createQuestion(action.payload);
      state.survey.questions.push(newQuestion);
      state.activeQuestionId = newQuestion.id;
      state.survey.updatedAt = new Date().toISOString();
    },
    removeQuestion: (state, action: PayloadAction<string>) => {
      state.survey.questions = state.survey.questions.filter((q) => q.id !== action.payload);
      if (state.activeQuestionId === action.payload) {
        state.activeQuestionId = state.survey.questions[0]?.id || null;
      }
      // Also remove the response for this question
      delete state.responses.responses[action.payload];
      state.survey.updatedAt = new Date().toISOString();
    },
    updateQuestionLabel: (state, action: PayloadAction<{ questionId: string; label: string }>) => {
      const question = state.survey.questions.find((q) => q.id === action.payload.questionId);
      if (question) {
        question.label = action.payload.label;
        state.survey.updatedAt = new Date().toISOString();
      }
    },
    updateQuestionType: (
      state,
      action: PayloadAction<{ questionId: string; type: QuestionType }>
    ) => {
      const question = state.survey.questions.find((q) => q.id === action.payload.questionId);
      if (question) {
        const prevType = question.type;
        question.type = action.payload.type;

        // If switching to multiple choice, add default options
        if (action.payload.type === 'multiple_choice' && prevType !== 'multiple_choice') {
          question.options = [createOption()];
        }

        // If switching away from multiple choice, remove options and clear response
        if (action.payload.type !== 'multiple_choice' && prevType === 'multiple_choice') {
          question.options = undefined;
          delete state.responses.responses[question.id];
        }

        state.survey.updatedAt = new Date().toISOString();
      }
    },
    updateQuestionRequired: (
      state,
      action: PayloadAction<{ questionId: string; required: boolean }>
    ) => {
      const question = state.survey.questions.find((q) => q.id === action.payload.questionId);
      if (question) {
        question.required = action.payload.required;
        state.survey.updatedAt = new Date().toISOString();
      }
    },
    setActiveQuestion: (state, action: PayloadAction<string | null>) => {
      state.activeQuestionId = action.payload;
    },
    reorderQuestions: (state, action: PayloadAction<{ fromIndex: number; toIndex: number }>) => {
      const { fromIndex, toIndex } = action.payload;
      const [removed] = state.survey.questions.splice(fromIndex, 1);
      state.survey.questions.splice(toIndex, 0, removed);
      state.survey.updatedAt = new Date().toISOString();
    },

    // Option actions for multiple choice questions
    addOption: (state, action: PayloadAction<string>) => {
      const question = state.survey.questions.find((q) => q.id === action.payload);
      if (question && question.type === 'multiple_choice') {
        if (!question.options) {
          question.options = [];
        }
        question.options.push(createOption());
        state.survey.updatedAt = new Date().toISOString();
      }
    },
    removeOption: (state, action: PayloadAction<{ questionId: string; optionId: string }>) => {
      const question = state.survey.questions.find((q) => q.id === action.payload.questionId);
      if (question && question.options) {
        question.options = question.options.filter((o) => o.id !== action.payload.optionId);
        // If the removed option was selected, clear the response
        if (state.responses.responses[question.id] === action.payload.optionId) {
          delete state.responses.responses[question.id];
        }
        state.survey.updatedAt = new Date().toISOString();
      }
    },
    updateOptionText: (
      state,
      action: PayloadAction<{ questionId: string; optionId: string; text: string }>
    ) => {
      const question = state.survey.questions.find((q) => q.id === action.payload.questionId);
      if (question && question.options) {
        const option = question.options.find((o) => o.id === action.payload.optionId);
        if (option) {
          option.text = action.payload.text;
          state.survey.updatedAt = new Date().toISOString();
        }
      }
    },

    // Response actions
    setResponse: (state, action: PayloadAction<{ questionId: string; value: string }>) => {
      state.responses.surveyId = state.survey.id;
      state.responses.responses[action.payload.questionId] = action.payload.value;
    },
    clearResponses: (state) => {
      state.responses = {
        surveyId: state.survey.id,
        responses: {},
      };
    },

    // Preview mode toggle
    setPreviewMode: (state, action: PayloadAction<boolean>) => {
      state.previewMode = action.payload;
    },

    // Live preview actions
    startLivePreview: (state) => {
      state.livePreview.status = 'taking';
      state.livePreview.submittedAt = null;
      // Clear responses when starting fresh
      state.responses = {
        surveyId: state.survey.id,
        responses: {},
      };
    },
    submitLivePreview: (state) => {
      state.livePreview.status = 'submitted';
      state.livePreview.submittedAt = new Date().toISOString();
      state.responses.submittedAt = new Date().toISOString();
    },
    exitLivePreview: (state) => {
      state.livePreview.status = 'idle';
      state.livePreview.submittedAt = null;
    },
    retakeSurvey: (state) => {
      state.livePreview.status = 'taking';
      state.livePreview.submittedAt = null;
      state.responses = {
        surveyId: state.survey.id,
        responses: {},
      };
    },
  },
});

export const {
  setSurveyTitle,
  setSurveyDescription,
  resetSurvey,
  addQuestion,
  removeQuestion,
  updateQuestionLabel,
  updateQuestionType,
  updateQuestionRequired,
  setActiveQuestion,
  reorderQuestions,
  addOption,
  removeOption,
  updateOptionText,
  setResponse,
  clearResponses,
  setPreviewMode,
  startLivePreview,
  submitLivePreview,
  exitLivePreview,
  retakeSurvey,
} = surveySlice.actions;

// Selectors
export const selectSurvey = (state: RootState) => state.survey.survey;
export const selectQuestions = (state: RootState) => state.survey.survey.questions;
export const selectResponses = (state: RootState) => state.survey.responses;
export const selectActiveQuestionId = (state: RootState) => state.survey.activeQuestionId;
export const selectPreviewMode = (state: RootState) => state.survey.previewMode;
export const selectLivePreview = (state: RootState) => state.survey.livePreview;
export const selectActiveQuestion = (state: RootState) => {
  const activeId = state.survey.activeQuestionId;
  return state.survey.survey.questions.find((q) => q.id === activeId) || null;
};

export default surveySlice.reducer;

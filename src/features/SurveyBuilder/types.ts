// Question Types
export type QuestionType = 'text' | 'multiple_choice';

// Option for multiple choice questions
export interface QuestionOption {
  id: string;
  text: string;
}

// Base question interface
export interface Question {
  id: string;
  label: string;
  type: QuestionType;
  required: boolean;
  options?: QuestionOption[]; // Only for multiple_choice type
}

// Survey definition
export interface Survey {
  id: string;
  title: string;
  description?: string;
  questions: Question[];
  createdAt: string;
  updatedAt: string;
}

// Response for a single question
export interface QuestionResponse {
  questionId: string;
  value: string; // For text: the text value, for multiple_choice: the selected option id
}

// All responses for a survey
export interface SurveyResponses {
  surveyId: string;
  responses: Record<string, string>; // questionId -> value
  submittedAt?: string;
}

// Live preview state
export type LivePreviewStatus = 'idle' | 'taking' | 'submitted';

// Survey Builder state
export interface SurveyBuilderState {
  survey: Survey;
  responses: SurveyResponses;
  activeQuestionId: string | null;
  previewMode: boolean;
  livePreview: {
    status: LivePreviewStatus;
    submittedAt: string | null;
  };
}

// Helper function to generate unique IDs
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Default empty survey
export const createEmptySurvey = (): Survey => ({
  id: generateId(),
  title: '',
  description: '',
  questions: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

// Create a new question
export const createQuestion = (type: QuestionType = 'text'): Question => ({
  id: generateId(),
  label: '',
  type,
  required: false,
  options: type === 'multiple_choice' ? [createOption()] : undefined,
});

// Create a new option
export const createOption = (): QuestionOption => ({
  id: generateId(),
  text: '',
});

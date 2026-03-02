// src/interfaces/aiCourseGeneration.ts

export type AppType = 'content' | 'courses';
export type SessionStatus = 
  | 'collecting_info' 
  | 'collecting_requirements' 
  | 'outline_generated' 
  | 'generating_course' 
  | 'completed' 
  | 'cancelled' 
  | 'failed';

export interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface CollectedData {
  [key: string]: any;
}

export interface CourseOutline {
  course: {
    title: string;
    description: string;
    difficulty?: string;
    course_type?: string;
    estimated_hours?: number;
    learning_objectives?: string[];
    [key: string]: any;
  };
  modules: ModuleOutline[];
}

export interface ModuleOutline {
  order: number;
  title: string;
  description: string;
  estimated_hours?: number;
  learning_objectives?: string[];
  lessons: LessonOutline[];
}

export interface LessonOutline {
  order: number;
  title: string;
  description: string;
  content_type?: string;
  duration?: string;
  difficulty?: string;
  learning_objectives?: string[];
  sections: SectionOutline[];
}

export interface SectionOutline {
  order: number;
  section_type: string;
  title: string;
  description: string;
  estimated_time_minutes?: number;
  text_content?: string;
  quiz_questions?: QuizQuestionOutline[];
  [key: string]: any;
}

export interface QuizQuestionOutline {
  order: number;
  text: string;
  explanation?: string;
  options: QuizOptionOutline[];
}

export interface QuizOptionOutline {
  text: string;
  is_correct: boolean;
  explanation?: string;
}

export interface AICourseGenerationSession {
  id?: string; // API returns 'id'
  session_id?: string; // Mapped from 'id' for internal use
  user?: string;
  user_name?: string;
  app_type: AppType;
  app_type_display?: string;
  status: SessionStatus;
  status_display?: string;
  conversation_history: ConversationMessage[];
  collected_data: CollectedData;
  generated_outline?: CourseOutline;
  course_id?: string | null;
  content_course_id?: string | null;
  professional_course_id?: string | null;
  error_message?: string;
  token_usage?: Record<string, any>;
  created_at: string;
  updated_at?: string;
  completed_at?: string | null;
}

export interface StartSessionRequest {
  app_type: AppType;
  initial_message?: string;
}

export interface StartSessionResponse {
  id: string; // API returns 'id'
  session_id?: string; // Mapped from 'id'
  user?: string;
  user_name?: string;
  app_type: AppType;
  app_type_display?: string;
  status: SessionStatus;
  status_display?: string;
  conversation_history: ConversationMessage[];
  collected_data: CollectedData;
  generated_outline?: CourseOutline;
  course_id?: string | null;
  content_course_id?: string | null;
  professional_course_id?: string | null;
  error_message?: string;
  token_usage?: Record<string, any>;
  created_at: string;
  updated_at?: string;
  completed_at?: string | null;
}

export interface ChatRequest {
  session_id: string; // Use 'id' from API response
  message: string;
}

export interface ChatResponse {
  session_id: string;
  ai_response: string;
  collected_data: CollectedData;
  status: SessionStatus;
  conversation_history: ConversationMessage[];
}

export interface GenerateOutlineRequest {
  session_id: string;
}

export interface GenerateOutlineResponse {
  session_id: string;
  status: SessionStatus;
  outline: CourseOutline;
  message: string;
}

export interface ApproveRequest {
  session_id: string;
}

export interface ApproveResponse {
  session_id: string;
  status: SessionStatus;
  course_id: string;
  course_url: string;
  message: string;
  course_details: {
    id: string;
    title: string;
    code: string;
    modules_count: number;
    lessons_count: number;
    sections_count?: number;
    is_published: boolean;
  };
}

export interface SessionDetailsResponse extends AICourseGenerationSession {}

export interface CancelSessionResponse {
  message: string;
  session_id: string;
}

export interface SessionListItem {
  id: string;
  app_type: AppType;
  status: SessionStatus;
  created_at: string;
  updated_at: string;
  course_title?: string | null;
}

export interface ListSessionsResponse extends Array<SessionListItem> {}


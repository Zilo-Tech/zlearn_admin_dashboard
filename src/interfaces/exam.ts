// Exams App Interfaces
export interface Exam {
  id: string;
  title: string;
  slug: string;
  description: string;
  short_description?: string;
  exam_type: string;
  exam_board?: string;
  country?: string;
  exam_date?: string;
  registration_deadline?: string;
  thumbnail?: string;
  banner_image?: string;
  price: string;
  currency: string;
  is_free: boolean;
  discount_price?: string;
  discount_start_date?: string;
  discount_end_date?: string;
  total_marks?: number;
  passing_score?: number;
  duration_minutes?: number;
  exam_format?: string;
  number_of_sections?: number;
  section_details?: Record<string, any>;
  scoring_system?: string;
  instructions?: string;
  requirements?: string;
  max_students?: number;
  enrollment_count?: number;
  featured: boolean;
  featured_order?: number;
  status: 'draft' | 'published' | 'archived' | 'suspended';
  average_score?: number;
  completion_rate?: number;
  rating?: number;
  total_ratings?: number;
  courses?: ExamCourse[];
  created_at: string;
  updated_at: string;
}

export interface ExamCourse {
  id: string;
  exam: string;
  title: string;
  slug: string;
  description?: string;
  subject?: string;
  order: number;
  duration_minutes?: number;
  total_marks?: number;
  passing_score?: number;
  is_published: boolean;
  module_count?: number;
  modules?: ExamModule[];
  created_at: string;
  updated_at: string;
}

export interface ExamModule {
  id: string;
  course: string;
  title: string;
  description?: string;
  order: number;
  duration_minutes?: number;
  is_published: boolean;
  lesson_count?: number;
  lessons?: ExamLesson[];
  created_at: string;
  updated_at: string;
}

export interface ExamLesson {
  id: string;
  module: string;
  title: string;
  description?: string;
  order: number;
  lesson_type: string;
  duration_minutes?: number;
  is_published: boolean;
  is_preview: boolean;
  sections?: ExamLessonSection[];
  resources?: ExamResource[];
  created_at: string;
  updated_at: string;
}

export interface ExamLessonSection {
  id: string;
  lesson: string;
  title: string;
  section_type: string;
  order: number;
  content?: string;
  video_url?: string;
  estimated_time_minutes?: number;
  is_required: boolean;
  created_at: string;
  updated_at: string;
}

export interface ExamResource {
  id: string;
  lesson: string;
  title: string;
  description?: string;
  resource_type: string;
  file?: string;
  url?: string;
  is_downloadable: boolean;
  order: number;
  created_at: string;
  updated_at: string;
}

export interface MockExam {
  id: string;
  exam: string;
  title: string;
  description?: string;
  duration_minutes: number;
  total_marks: number;
  passing_score: number;
  number_of_questions: number;
  is_published: boolean;
  is_timed: boolean;
  allow_review: boolean;
  shuffle_questions: boolean;
  shuffle_options: boolean;
  show_results_immediately: boolean;
  max_attempts?: number;
  available_from?: string;
  available_until?: string;
  questions?: MockExamQuestion[];
  created_at: string;
  updated_at: string;
}

export interface MockExamQuestion {
  id: string;
  mock_exam: string;
  question_text: string;
  question_type: 'multiple_choice' | 'true_false' | 'short_answer';
  options: Array<{
    text: string;
    is_correct: boolean;
  }>;
  correct_answer?: string;
  explanation?: string;
  marks: number;
  difficulty: 'easy' | 'medium' | 'hard';
  order: number;
  created_at: string;
  updated_at: string;
}

export interface PastPaper {
  id: string;
  exam: string;
  title: string;
  year: number;
  exam_board?: string;
  description?: string;
  question_paper?: string;
  answer_key?: string;
  marking_scheme?: string;
  solutions_pdf?: string;
  is_published: boolean;
  download_count?: number;
  created_at: string;
  updated_at: string;
}

export interface ExamEnrollment {
  id: string;
  user: string;
  exam: string;
  enrolled_at: string;
  completed: boolean;
  completion_date?: string;
  overall_progress?: number;
  total_time_spent?: number;
}

export interface MockExamAttempt {
  id: string;
  enrollment: string;
  mock_exam: string;
  started_at: string;
  completed_at?: string;
  score?: number;
  percentage?: number;
  passed: boolean;
  time_taken_seconds?: number;
  answers: Record<string, any>;
}

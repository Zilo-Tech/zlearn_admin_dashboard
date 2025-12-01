// Content App Interfaces
export interface Subject {
  id: string;
  name: string;
  code: string;
  icon?: string;
  color?: string;
  created_at: string;
  updated_at: string;
}

export interface ContentCourse {
  id: string;
  code: string;
  title: string;
  description: string;
  course_type: 'entrance_exam' | 'regular' | 'advanced' | 'review';
  subject: string;
  subject_name?: string;
  program?: string;
  class_level?: string;
  curriculum?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimated_hours?: number;
  priority_order?: number;
  is_published: boolean;
  is_free: boolean;
  // Entrance exam fields
  exam_board?: string;
  exam_year?: number;
  passing_score?: number;
  exam_format?: string;
  // Media files
  thumbnail?: string;
  banner_image?: string;
  video_intro?: string;
  // Content
  learning_objectives?: string[];
  requirements?: string;
  learning_outcomes?: string;
  tags?: string[];
  // Pricing
  price?: string | number;
  currency?: string;
  // Enrollment
  instructor?: string;
  max_students?: number;
  enrollment_deadline?: string;
  // Metadata
  language?: string;
  // Computed fields
  module_count?: number;
  modules?: ContentModule[];
  created_at: string;
  updated_at: string;
}

export interface ContentModule {
  id: string;
  course: string;
  order: number;
  title: string;
  description?: string;
  estimated_hours?: number;
  is_optional: boolean;
  unlock_after?: string;
  lesson_count?: number;
  lessons?: ContentLesson[];
  created_at: string;
  updated_at: string;
}

export interface ContentLesson {
  id: string;
  module: string;
  order: number;
  title: string;
  description?: string;
  content_type: string;
  duration?: string;
  difficulty?: string;
  learning_objectives?: string[];
  keywords?: string[];
  is_free: boolean;
  is_preview: boolean;
  unlock_after?: string;
  section_count?: number;
  resource_count?: number;
  sections?: ContentSection[];
  resources?: LearningResource[];
  created_at: string;
  updated_at: string;
}

export interface ContentSection {
  id: string;
  lesson: string;
  order: number;
  section_type: string;
  title: string;
  text_content?: string;
  image?: string;
  image_url?: string;
  image_caption?: string;
  video_url?: string;
  video_file?: string;
  video_qualities?: Record<string, string>;
  video_subtitles?: Array<{ language: string; url: string }>;
  video_thumbnail?: string;
  video_duration_seconds?: number;
  audio_url?: string;
  audio_file?: string;
  audio_duration_seconds?: number;
  code_content?: string;
  code_language?: string;
  file_attachment?: string;
  file_url?: string;
  file_size_bytes?: number;
  file_type?: string;
  pdf_file?: string;
  pdf_url?: string;
  embed_url?: string;
  embed_code?: string;
  combined_content?: Record<string, any>;
  description?: string;
  estimated_time_minutes?: number;
  is_required: boolean;
  is_downloadable: boolean;
  is_published: boolean;
  quiz_questions?: QuizQuestion[];
  created_at: string;
  updated_at: string;
}

export interface QuizQuestion {
  id: string;
  section: string;
  text: string;
  explanation?: string;
  order: number;
  options?: QuizOption[];
  created_at: string;
  updated_at: string;
}

export interface QuizOption {
  id: string;
  question: string;
  text: string;
  is_correct: boolean;
  explanation?: string;
  order: number;
  created_at: string;
  updated_at: string;
}

export interface LearningResource {
  id: string;
  lesson: string;
  title: string;
  description?: string;
  resource_type: string;
  file?: string;
  url?: string;
  text_content?: string;
  embed_code?: string;
  file_size?: number;
  duration?: string;
  download_allowed: boolean;
  metadata?: Record<string, any>;
  is_required: boolean;
  estimated_time_minutes?: number;
  order: number;
  is_primary: boolean;
  created_at: string;
  updated_at: string;
}

// Courses App Interfaces
export interface CourseCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  color?: string;
  sort_order?: number;
  created_at: string;
  updated_at: string;
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  short_description?: string;
  course_code?: string;
  instructor: string;
  instructor_name?: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  status: 'draft' | 'published' | 'archived' | 'suspended';
  thumbnail?: string;
  banner_image?: string;
  video_intro?: string;
  price: string;
  currency: string;
  is_free: boolean;
  discount_price?: string;
  discount_start_date?: string;
  discount_end_date?: string;
  duration_hours?: number;
  total_lessons?: number;
  total_quizzes?: number;
  total_assignments?: number;
  requirements?: string;
  learning_outcomes?: string;
  language?: string;
  tags?: string[];
  featured: boolean;
  featured_order?: number;
  max_students?: number;
  current_enrollments?: number;
  enrollment_deadline?: string;
  rating?: number;
  total_ratings?: number;
  completion_rate?: number;
  target_audience?: string;
  offers_certificate: boolean;
  certificate_requirements?: {
    min_completion_percentage?: number;
    min_assessment_score?: number;
    min_time_spent_hours?: number;
  };
  published_at?: string;
  last_updated?: string;
  module_count?: number;
  modules?: CourseModule[];
  created_at: string;
  updated_at: string;
}

export interface CourseModule {
  id: string;
  course: string;
  title: string;
  description?: string;
  order: number;
  is_published: boolean;
  duration_minutes?: number;
  difficulty?: string;
  learning_path?: string;
  learning_objectives?: string[];
  completion_requirements?: {
    min_lessons_completed?: number;
    min_quiz_score?: number;
  };
  resources?: any[];
  lesson_count?: number;
  lessons?: CourseLesson[];
  created_at: string;
  updated_at: string;
}

export interface CourseLesson {
  id: string;
  module: string;
  title: string;
  description?: string;
  lesson_type: string;
  order: number;
  content?: string;
  video_url?: string;
  video_file?: string;
  duration_minutes?: number;
  video_qualities?: Record<string, string>;
  video_thumbnail?: string;
  video_subtitles?: Array<{ language: string; url: string }>;
  video_transcript?: string;
  video_duration_seconds?: number;
  attachments?: any[];
  external_links?: any[];
  learning_objectives?: string[];
  completion_criteria?: {
    min_time_spent?: number;
    quiz_score?: number;
    resources_viewed?: number;
  };
  difficulty?: string;
  estimated_time_minutes?: number;
  is_published: boolean;
  is_preview: boolean;
  requires_completion: boolean;
  section_count?: number;
  resource_count?: number;
  sections?: CourseSection[];
  resources?: LearningResource[];
  created_at: string;
  updated_at: string;
}

export interface CourseSection {
  id: string;
  lesson: string;
  title: string;
  section_type: string;
  order: number;
  text_content?: string;
  image?: string;
  image_url?: string;
  image_caption?: string;
  video_url?: string;
  video_file?: string;
  video_qualities?: Record<string, string>;
  video_subtitles?: Array<{ language: string; url: string }>;
  video_thumbnail?: string;
  video_duration_seconds?: number;
  audio_url?: string;
  audio_file?: string;
  audio_duration_seconds?: number;
  code_content?: string;
  code_language?: string;
  file_attachment?: string;
  file_url?: string;
  file_size_bytes?: number;
  file_type?: string;
  pdf_file?: string;
  pdf_url?: string;
  embed_url?: string;
  embed_code?: string;
  combined_content?: Record<string, any>;
  interactive_element?: string;
  description?: string;
  estimated_time_minutes?: number;
  is_required: boolean;
  is_downloadable: boolean;
  is_published: boolean;
  quiz_questions?: SectionQuizQuestion[];
  created_at: string;
  updated_at: string;
}

export interface SectionQuizQuestion {
  id: string;
  section: string;
  text: string;
  explanation?: string;
  order: number;
  points?: number;
  options?: SectionQuizOption[];
  created_at: string;
  updated_at: string;
}

export interface SectionQuizOption {
  id: string;
  question: string;
  text: string;
  is_correct: boolean;
  explanation?: string;
  order: number;
  created_at: string;
  updated_at: string;
}


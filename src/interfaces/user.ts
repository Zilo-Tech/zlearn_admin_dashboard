// User Management Interfaces
export interface User {
  id: string;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  full_name?: string;
  user_type: 'professional' | 'academic' | 'exams';
  avatar?: string;
  phone_number?: string;
  date_joined: string;
  last_login?: string;
  is_active: boolean;
  is_verified: boolean;
  
  // Professional fields
  occupation?: string;
  industry?: string;
  company_size?: string;
  years_of_experience?: number;
  employment_status?: string;
  primary_learning_goal?: string;
  interests?: string[];
  skill_level?: string;
  target_role?: string;
  job_search_status?: string;
  
  // Academic fields
  country?: string;
  education_level?: string;
  school?: string;
  program?: string;
  faculty?: string;
  class_level?: string;
  curriculum?: string;
  
  // Statistics (backend may use enrollments_count / exam_enrollments_count)
  total_courses_enrolled?: number;
  total_courses_completed?: number;
  enrollments_count?: number;
  exam_enrollments_count?: number;
  total_time_spent?: number;
  average_progress?: number;
}

export interface UserEnrollment {
  id: string;
  user: string;
  user_details?: {
    full_name: string;
    email: string;
    avatar?: string;
  };
  course_id: string;
  course_title?: string;
  course_type: 'professional' | 'academic' | 'exam';
  enrolled_at: string;
  completed: boolean;
  completion_date?: string;
  progress_percentage?: number;
  last_accessed?: string;
  time_spent_minutes?: number;
  status: 'active' | 'completed' | 'dropped' | 'suspended';
}

export interface UserProgress {
  user?: string;
  course_id?: string;
  course?: string;
  course_title?: string;
  course_type?: string;
  lessons_completed?: number;
  total_lessons?: number;
  modules_completed?: number;
  total_modules?: number;
  quizzes_completed?: number;
  total_quizzes?: number;
  assessments_completed?: number;
  total_assessments?: number;
  average_quiz_score?: number;
  time_spent_minutes?: number;
  last_activity?: string;
  last_accessed?: string;
  completion_percentage?: number;
  progress_percentage?: number;
}

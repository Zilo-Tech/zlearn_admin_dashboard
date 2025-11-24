// Education Management Interfaces

export interface Country {
  id: string;
  name: string;
  code: string;
  flag_emoji?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface EducationLevel {
  id: string;
  name: string;
  age_range?: string;
  country?: Country;
  country_id: string;
  order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface School {
  id: string;
  name: string;
  country?: Country;
  country_id: string;
  education_level?: EducationLevel;
  education_level_id: string;
  type?: string;
  location?: string;
  established?: number;
  description?: string;
  logo?: string;
  website?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Faculty {
  id: string;
  name: string;
  school?: School;
  school_id: string;
  description?: string;
  icon?: string;
  type?: string; // faculty, school, college, department
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ClassLevel {
  id: string;
  name: string;
  school?: School;
  school_id: string;
  education_level?: EducationLevel;
  education_level_id: string;
  description?: string;
  icon?: string;
  age_range?: string;
  order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Program {
  id: string;
  name: string;
  school?: School;
  school_id: string;
  faculty?: Faculty;
  faculty_id?: string;
  class_level?: ClassLevel;
  class_level_id?: string;
  degree?: string;
  duration?: string;
  description?: string;
  icon?: string;
  difficulty?: string; // beginner, intermediate, advanced, expert
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Curriculum {
  id: string;
  name: string;
  program?: Program;
  program_id: string;
  year: number;
  semester: string; // first, second, both
  subjects: string[]; // Array of subject names
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Subject {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}


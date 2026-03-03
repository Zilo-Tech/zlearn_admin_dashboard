# Exams Admin Dashboard API Documentation

Complete reference for all exam package admin/management endpoints.

**Base URL:** `/api/exams/admin/`

**Authentication:** Required - JWT Bearer token with `is_staff=True` or instructor permissions

---

## Table of Contents

1. [Exam Package Management](#1-exam-package-management)
2. [Course Management](#2-course-management)
3. [Module, Lesson & Section Management](#3-module-lesson--section-management)
4. [Mock Exam Management](#4-mock-exam-management)
5. [Past Paper Management](#5-past-paper-management)
6. [Enrollment Management](#6-enrollment-management)
7. [Dashboard Statistics](#7-dashboard-statistics)
8. [Import & Bulk Operations](#8-import--bulk-operations)

---

## 1. Exam Package Management

### 1.1 List All Exams

**Endpoint:** `GET /api/exams/admin/exams/`

**Description:** List all exam packages with filtering, searching, and ordering.

**Query Parameters:**
- `status` - Filter by status: `draft`, `published`, `archived`
- `exam_type` - Filter by type: `university`, `professional`, `language`, `standardized`, `secondary`, `other`
- `exam_board` - Filter by board name (e.g., `JAMB`, `CGCEB`)
- `country` - Filter by country ID
- `instructor` - Filter by instructor user ID
- `featured` - Filter by featured status: `true` or `false`
- `is_free` - Filter by pricing: `true` or `false`
- `is_published` - Filter by publish status: `true` or `false`
- `search` - Search in title, description, exam_code, short_description, exam_board
- `ordering` - Order by: `created_at`, `updated_at`, `title`, `exam_date`, `price`, `rating`, `enrollment_count`, `priority_order` (prefix with `-` for descending)
- `page` - Page number for pagination
- `page_size` - Number of items per page (default: 10)

**Example Request:**
```bash
GET /api/exams/admin/exams/?exam_type=secondary&is_published=true&ordering=-created_at
```

**Example Response:**
```json
{
  "count": 42,
  "next": "http://api.example.com/api/exams/admin/exams/?page=2",
  "previous": null,
  "results": [
    {
      "id": "uuid-here",
      "title": "Cameroon GCE A-Level ICT Preparation 2026",
      "slug": "cameroon-gce-a-level-ict-preparation-2026",
      "exam_code": "GCE_AL_ICT_2026",
      "exam_type": "secondary",
      "exam_board": "CGCEB",
      "status": "published",
      "is_published": true,
      "exam_date": "2026-06-01",
      "total_marks": 200,
      "enrollment_count": 245,
      "rating": 4.7,
      "featured": true,
      "priority_order": 1,
      "instructor": {
        "id": "uuid",
        "email": "instructor@example.com",
        "first_name": "John",
        "last_name": "Doe"
      },
      "created_at": "2026-03-01T10:30:00Z",
      "updated_at": "2026-03-03T15:45:00Z"
    }
  ]
}
```

---

### 1.2 Create Exam Package

**Endpoint:** `POST /api/exams/admin/exams/`

**Description:** Create a new exam package.

**Request Body:**
```json
{
  "title": "JAMB UTME 2027 Complete Preparation",
  "description": "Full preparation package for JAMB UTME 2027...",
  "short_description": "Master all JAMB UTME subjects",
  "exam_code": "JAMB_UTME_2027",
  "exam_type": "university",
  "exam_board": "JAMB",
  "exam_date": "2027-04-15",
  "registration_start": "2026-10-01",
  "registration_deadline": "2027-02-28",
  "exam_duration_minutes": 180,
  "total_marks": 400,
  "passing_score": 180,
  "scoring_system": "400 points maximum",
  "exam_format": "CBT - 4 subjects, 60 questions each",
  "number_of_sections": 4,
  "section_details": [
    {
      "name": "Use of English",
      "duration": 45,
      "questions": 60,
      "marks": 100
    },
    {
      "name": "Mathematics",
      "duration": 45,
      "questions": 60,
      "marks": 100
    }
  ],
  "is_free": false,
  "price": 5000.00,
  "currency": "NGN",
  "status": "draft",
  "is_published": false,
  "language": "en",
  "tags": ["jamb", "utme", "university", "nigeria"],
  "featured": false,
  "priority_order": 100,
  "requirements": "SSCE/NECO certificate required",
  "learning_outcomes": "Pass JAMB with 250+ score",
  "target_audience": "SSCE holders aspiring to university"
}
```

**Response:** `201 Created`
```json
{
  "id": "uuid-here",
  "title": "JAMB UTME 2027 Complete Preparation",
  "slug": "jamb-utme-2027-complete-preparation",
  "exam_code": "JAMB_UTME_2027",
  ...
}
```

---

### 1.3 Get Single Exam Details

**Endpoint:** `GET /api/exams/admin/exams/{exam_id}/`

**Description:** Retrieve detailed information about a specific exam package.

**Example Response:**
```json
{
  "id": "uuid-here",
  "title": "Cameroon GCE A-Level ICT Preparation 2026",
  "slug": "cameroon-gce-a-level-ict-preparation-2026",
  "description": "Complete preparation package for 2026...",
  "short_description": "Full GCE A-Level ICT prep...",
  "exam_code": "GCE_AL_ICT_2026",
  "exam_type": "secondary",
  "exam_board": "CGCEB",
  "country": {
    "id": 1,
    "name": "Cameroon",
    "code": "CM"
  },
  "exam_date": "2026-06-01",
  "registration_start": "2025-10-20",
  "registration_deadline": "2026-01-30",
  "exam_duration_minutes": 420,
  "total_marks": 200,
  "passing_score": 100,
  "scoring_system": "Graded A-E; minimum pass is E",
  "exam_format": "Three papers: Paper 1 (MCQ)...",
  "number_of_sections": 3,
  "section_details": [...],
  "thumbnail": "http://example.com/media/exams/thumbnails/gce_ict.jpg",
  "banner_image": null,
  "is_free": true,
  "price": "0.00",
  "currency": "XAF",
  "instructor": {...},
  "status": "published",
  "is_published": true,
  "published_at": "2026-03-03T10:00:00Z",
  "max_students": 50000,
  "enrollment_count": 245,
  "average_score": 72.5,
  "completion_rate": 68.3,
  "rating": 4.7,
  "total_ratings": 89,
  "language": "en",
  "tags": ["gce", "a-level", "ict", "cameroon"],
  "featured": true,
  "priority_order": 1,
  "requirements": "Completed GCE O-Level...",
  "learning_outcomes": "Answer all question types...",
  "target_audience": "Lower Sixth and Upper Sixth students...",
  "created_at": "2026-03-01T10:30:00Z",
  "updated_at": "2026-03-03T15:45:00Z"
}
```

---

### 1.4 Update Exam Package

**Endpoint:** `PUT /api/exams/admin/exams/{exam_id}/` or `PATCH /api/exams/admin/exams/{exam_id}/`

**Description:** Update exam package details. Use `PUT` for full update, `PATCH` for partial update.

**Request Body (PATCH example):**
```json
{
  "status": "published",
  "is_published": true,
  "featured": true,
  "price": 7500.00
}
```

**Response:** `200 OK` with updated exam object

---

### 1.5 Delete Exam Package

**Endpoint:** `DELETE /api/exams/admin/exams/{exam_id}/`

**Description:** Delete an exam package (and all associated courses, modules, lessons, mock exams, past papers via CASCADE).

**Response:** `204 No Content`

---

### 1.6 Get Exam Courses

**Endpoint:** `GET /api/exams/admin/exams/{exam_id}/courses/`

**Description:** List all courses (subjects) within an exam package.

**Example Response:**
```json
[
  {
    "id": "uuid",
    "title": "Paper 1 Mastery: ICT Concepts, Systems, Networks",
    "slug": "paper-1-mastery-ict-concepts",
    "course_code": "GCE-ICT-P1-2026",
    "subject": {
      "id": 1,
      "name": "ICT Paper 1",
      "code": "ICT_PPER_1"
    },
    "difficulty": "intermediate",
    "estimated_hours": 60,
    "is_published": true,
    "order": 0,
    "total_modules": 4,
    "total_lessons": 12,
    "created_at": "2026-03-03T10:15:00Z"
  },
  {
    "id": "uuid",
    "title": "Paper 2 Mastery: Structured Essay Questions",
    "slug": "paper-2-mastery-structured-essay",
    "course_code": "GCE-ICT-P2-2026",
    "subject": {
      "id": 2,
      "name": "ICT Paper 2",
      "code": "ICT_PPER_2"
    },
    "difficulty": "intermediate",
    "estimated_hours": 50,
    "is_published": true,
    "order": 1,
    "total_modules": 2,
    "total_lessons": 8,
    "created_at": "2026-03-03T10:16:00Z"
  }
]
```

---

### 1.7 Get Exam Mock Exams

**Endpoint:** `GET /api/exams/admin/exams/{exam_id}/mock_exams/`

**Description:** List all mock exams for an exam package.

**Example Response:**
```json
[
  {
    "id": "uuid",
    "title": "Diagnostic Mock: GCE ICT Paper 1 Full Simulation",
    "exam": "uuid-exam-id",
    "is_timed": true,
    "time_limit_minutes": 90,
    "total_marks": 50,
    "passing_marks": 30,
    "total_questions": 50,
    "difficulty": "medium",
    "is_published": true,
    "is_featured": true,
    "order": 0,
    "attempts_count": 342,
    "average_score": 38.5,
    "created_at": "2026-03-03T10:20:00Z"
  },
  {
    "id": "uuid",
    "title": "Mock Exam 2: Advanced Paper 1 Simulation",
    "exam": "uuid-exam-id",
    "is_timed": true,
    "time_limit_minutes": 90,
    "total_marks": 50,
    "passing_marks": 35,
    "total_questions": 50,
    "difficulty": "hard",
    "is_published": true,
    "is_featured": false,
    "order": 1,
    "attempts_count": 198,
    "average_score": 33.2,
    "created_at": "2026-03-03T10:21:00Z"
  }
]
```

---

### 1.8 Get Exam Past Papers

**Endpoint:** `GET /api/exams/admin/exams/{exam_id}/past_papers/`

**Description:** List all past papers for an exam package.

**Example Response:**
```json
[
  {
    "id": "uuid",
    "title": "GCE ICT A-Level – June 2024 – Paper 2",
    "exam": "uuid-exam-id",
    "year": 2024,
    "session": "June",
    "total_marks": 100,
    "duration_minutes": 180,
    "is_published": true,
    "is_free": true,
    "order": 0,
    "download_count": 1245,
    "view_count": 3421,
    "file": "http://example.com/media/past_papers/gce_ict_2024_p2.pdf",
    "created_at": "2026-03-03T10:25:00Z"
  },
  {
    "id": "uuid",
    "title": "GCE ICT A-Level – June 2023 – Papers 1 and 2",
    "exam": "uuid-exam-id",
    "year": 2023,
    "session": "June",
    "total_marks": 150,
    "duration_minutes": 270,
    "is_published": true,
    "is_free": true,
    "order": 1,
    "download_count": 987,
    "view_count": 2876,
    "created_at": "2026-03-03T10:26:00Z"
  }
]
```

---

### 1.9 Get Exam Enrollments

**Endpoint:** `GET /api/exams/admin/exams/{exam_id}/enrollments/`

**Description:** List all student enrollments for an exam package.

**Example Response:**
```json
[
  {
    "id": "uuid",
    "student": {
      "id": "uuid",
      "email": "student@example.com",
      "first_name": "Alice",
      "last_name": "Johnson"
    },
    "exam": "uuid-exam-id",
    "status": "active",
    "progress_percent": 45.5,
    "completed_courses": 1,
    "completed_lessons": 8,
    "mock_exam_attempts": 3,
    "best_mock_score": 42,
    "last_accessed": "2026-03-02T14:30:00Z",
    "enrolled_at": "2026-02-15T09:00:00Z"
  }
]
```

---

### 1.10 Get Exam Statistics (Dashboard)

**Endpoint:** `GET /api/exams/admin/exams/{exam_id}/statistics/`

**Description:** Get comprehensive statistics for an exam package - ideal for dashboard overview.

**Example Response:**
```json
{
  "exam": {
    "id": "uuid",
    "title": "Cameroon GCE A-Level ICT Preparation 2026",
    "exam_code": "GCE_AL_ICT_2026",
    "status": "published",
    "is_published": true
  },
  "content": {
    "courses": 3,
    "modules": 7,
    "lessons": 15,
    "sections": 42,
    "resources": 28
  },
  "assessments": {
    "mock_exams": 2,
    "mock_questions": 65,
    "past_papers": 6
  },
  "enrollments": {
    "total": 245,
    "active": 198,
    "completed": 47
  },
  "engagement": {
    "total_attempts": 1024,
    "average_score": 72.5,
    "completion_rate": 68.3
  },
  "breakdown": {
    "courses": [
      {
        "id": "uuid",
        "title": "Paper 1 Mastery: ICT Concepts",
        "modules": 4,
        "lessons": 12,
        "is_published": true
      },
      {
        "id": "uuid",
        "title": "Paper 2 Mastery: Structured Essay",
        "modules": 2,
        "lessons": 8,
        "is_published": true
      },
      {
        "id": "uuid",
        "title": "Paper 3 Mastery: Spreadsheet and Database",
        "modules": 2,
        "lessons": 6,
        "is_published": true
      }
    ],
    "mock_exams": [
      {
        "id": "uuid",
        "title": "Diagnostic Mock: Paper 1 Simulation",
        "questions": 50,
        "attempts": 342,
        "is_published": true,
        "is_featured": true
      },
      {
        "id": "uuid",
        "title": "Advanced Mock: Paper 1",
        "questions": 50,
        "attempts": 198,
        "is_published": true,
        "is_featured": false
      }
    ],
    "past_papers": [
      {
        "id": "uuid",
        "title": "GCE ICT – June 2024 – Paper 2",
        "year": 2024,
        "session": "June",
        "downloads": 1245,
        "views": 3421,
        "is_published": true
      },
      {
        "id": "uuid",
        "title": "GCE ICT – June 2023 – Papers 1 & 2",
        "year": 2023,
        "session": "June",
        "downloads": 987,
        "views": 2876,
        "is_published": true
      }
    ]
  }
}
```

---

## 2. Course Management

### 2.1 List All Courses

**Endpoint:** `GET /api/exams/admin/courses/`

**Query Parameters:**
- `exam` - Filter by exam ID
- `subject` - Filter by subject ID
- `difficulty` - Filter by difficulty: `beginner`, `intermediate`, `advanced`
- `is_published` - Filter by publish status: `true` or `false`
- `search` - Search in title, description, course_code
- `ordering` - Order by: `created_at`, `updated_at`, `title`, `order`, `estimated_hours`

**Example Request:**
```bash
GET /api/exams/admin/courses/?exam=uuid-exam-id&ordering=order
```

---

### 2.2 Create Course

**Endpoint:** `POST /api/exams/admin/courses/`

**Request Body:**
```json
{
  "exam": "uuid-exam-id",
  "title": "Mathematics for JAMB UTME",
  "description": "Complete mathematics course covering...",
  "short_description": "Master JAMB mathematics",
  "course_code": "JAMB-2027-MATH",
  "subject": 1,
  "difficulty": "intermediate",
  "estimated_hours": 80,
  "is_published": true,
  "order": 0,
  "learning_objectives": [
    "Solve quadratic equations",
    "Apply calculus concepts",
    "Master statistics and probability"
  ]
}
```

---

### 2.3 Get Course with Modules

**Endpoint:** `GET /api/exams/admin/courses/{course_id}/modules/`

**Description:** Get all modules within a course.

**Example Response:**
```json
[
  {
    "id": "uuid",
    "exam_course": "uuid-course-id",
    "title": "Module 1: ICT Concepts – Hardware and Software",
    "description": "Covers computer hardware components...",
    "order": 0,
    "is_published": true,
    "duration_minutes": 360,
    "learning_objectives": [...]
  }
]
```

---

### 2.4 Reorder Courses

**Endpoint:** `POST /api/exams/admin/courses/reorder/`

**Request Body:**
```json
{
  "course_ids": ["uuid1", "uuid2", "uuid3"]
}
```

**Description:** Reorder courses by providing array of course IDs in desired order.

---

## 3. Module, Lesson & Section Management

### 3.1 List Modules

**Endpoint:** `GET /api/exams/admin/modules/`

**Query Parameters:**
- `exam_course` - Filter by course ID
- `is_published` - Filter by publish status

---

### 3.2 Create Module

**Endpoint:** `POST /api/exams/admin/modules/`

**Request Body:**
```json
{
  "exam_course": "uuid-course-id",
  "title": "Module 1: Introduction to Algebra",
  "description": "Fundamental algebra concepts...",
  "order": 0,
  "is_published": true,
  "duration_minutes": 240,
  "learning_objectives": [
    "Understand algebraic expressions",
    "Solve linear equations"
  ]
}
```

---

### 3.3 Get Module Lessons

**Endpoint:** `GET /api/exams/admin/modules/{module_id}/lessons/`

**Description:** Get all lessons within a module.

---

### 3.4 List Lessons

**Endpoint:** `GET /api/exams/admin/lessons/`

**Query Parameters:**
- `module` - Filter by module ID
- `lesson_type` - Filter by type: `video`, `reading`, `practice`, `quiz`, `mixed`
- `is_published` - Filter by publish status

---

### 3.5 Create Lesson

**Endpoint:** `POST /api/exams/admin/lessons/`

**Request Body:**
```json
{
  "module": "uuid-module-id",
  "title": "Lesson 1.1: Inside the CPU",
  "description": "Detailed examination of CPU components...",
  "lesson_type": "mixed",
  "order": 0,
  "content": "The CPU is the brain of the computer...",
  "duration_minutes": 55,
  "is_published": true,
  "is_preview": true,
  "learning_objectives": [
    "Name CPU components",
    "Explain fetch-decode-execute cycle"
  ]
}
```

---

### 3.6 Get Lesson Sections

**Endpoint:** `GET /api/exams/admin/lessons/{lesson_id}/sections/`

**Description:** Get all sections within a lesson.

---

### 3.7 Get Lesson Resources

**Endpoint:** `GET /api/exams/admin/lessons/{lesson_id}/resources/`

**Description:** Get all resources attached to a lesson.

---

### 3.8 List Sections

**Endpoint:** `GET /api/exams/admin/sections/`

**Query Parameters:**
- `lesson` - Filter by lesson ID
- `section_type` - Filter by type: `text`, `video`, `image`, `pdf`, `quiz`, `practice`, `tips`, `formula`

---

### 3.9 Create Section

**Endpoint:** `POST /api/exams/admin/sections/`

**Request Body (Text Section):**
```json
{
  "lesson": "uuid-lesson-id",
  "title": "CPU Architecture: Core Concepts",
  "section_type": "text",
  "order": 0,
  "text_content": "# Lesson 1.1: Inside the CPU...",
  "is_published": true
}
```

**Request Body (Video Section):**
```json
{
  "lesson": "uuid-lesson-id",
  "title": "Video: CPU Components Explained",
  "section_type": "video",
  "order": 1,
  "video_url": "https://www.youtube.com/watch?v=example",
  "is_published": true
}
```

**Request Body (Quiz Section):**
```json
{
  "lesson": "uuid-lesson-id",
  "title": "Knowledge Check: CPU and Architecture",
  "section_type": "quiz",
  "order": 2,
  "quiz_questions": [
    {
      "question": "What does ALU stand for?",
      "type": "multiple_choice",
      "options": ["Arithmetic Logic Unit", "All Logic Units"],
      "correct_answer": 0,
      "explanation": "ALU stands for Arithmetic Logic Unit..."
    }
  ],
  "is_published": true
}
```

---

### 3.10 List Resources

**Endpoint:** `GET /api/exams/admin/resources/`

**Query Parameters:**
- `lesson` - Filter by lesson ID
- `resource_type` - Filter by type: `study_guide`, `video`, `pdf`, `article`, `flashcards`, `formula_sheet`, `tips`, `link`

---

### 3.11 Create Resource

**Endpoint:** `POST /api/exams/admin/resources/`

**Request Body (External Link):**
```json
{
  "lesson": "uuid-lesson-id",
  "title": "BBC Bitesize: CPU Architecture",
  "description": "Free revision notes on CPU components...",
  "resource_type": "article",
  "url": "https://www.bbc.co.uk/bitesize/guides/...",
  "is_required": true,
  "order": 0
}
```

**Request Body (File Upload):**
```json
{
  "lesson": "uuid-lesson-id",
  "title": "Formula Sheet: Number Systems",
  "description": "Quick reference for binary conversions",
  "resource_type": "formula_sheet",
  "file": "<file upload>",
  "is_required": false,
  "order": 1
}
```

---

## 4. Mock Exam Management

### 4.1 List Mock Exams

**Endpoint:** `GET /api/exams/admin/mock-exams/`

**Query Parameters:**
- `exam` - Filter by exam ID
- `difficulty` - Filter by difficulty: `easy`, `medium`, `hard`
- `is_published` - Filter by publish status
- `is_timed` - Filter by timing: `true` or `false`
- `is_featured` - Filter by featured status
- `search` - Search in title, description, instructions
- `ordering` - Order by: `created_at`, `order`, `difficulty`, `attempts_count`, `average_score`

---

### 4.2 Create Mock Exam

**Endpoint:** `POST /api/exams/admin/mock-exams/`

**Request Body:**
```json
{
  "exam": "uuid-exam-id",
  "title": "Diagnostic Mock: Full Paper 1 Simulation",
  "description": "50-question MCQ simulation...",
  "is_timed": true,
  "time_limit_minutes": 90,
  "total_marks": 50,
  "passing_marks": 30,
  "total_questions": 50,
  "difficulty": "medium",
  "show_answers_after": true,
  "show_score_immediately": true,
  "allow_review": true,
  "attempts_allowed": 3,
  "shuffle_questions": false,
  "shuffle_options": true,
  "is_published": true,
  "order": 0,
  "is_featured": true,
  "instructions": "- 50 MCQ questions\n- 1.5 hours\n- No negative marking"
}
```

---

### 4.3 Get Mock Exam Questions

**Endpoint:** `GET /api/exams/admin/mock-exams/{mock_exam_id}/questions/`

**Description:** Get all questions for a specific mock exam.

**Example Response:**
```json
[
  {
    "id": "uuid",
    "mock_exam": "uuid-mock-id",
    "exam_course": {
      "id": "uuid",
      "title": "Paper 1 Mastery",
      "course_code": "GCE-ICT-P1-2026"
    },
    "question_text": "Which cable is fastest in computer networks?",
    "question_type": "multiple_choice",
    "order": 0,
    "options": [
      {"id": "A", "text": "Fibre optic"},
      {"id": "B", "text": "Coaxial cable"},
      {"id": "C", "text": "UTP"},
      {"id": "D", "text": "STP"}
    ],
    "correct_answer": "A",
    "explanation": "Fibre optic transmits data as light pulses...",
    "marks": 1,
    "difficulty": "easy"
  }
]
```

---

### 4.4 Create Mock Exam Question

**Endpoint:** `POST /api/exams/admin/mock-exam-questions/`

**Request Body:**
```json
{
  "mock_exam": "uuid-mock-id",
  "exam_course": "uuid-course-id",
  "question_text": "The internet can best be defined as:",
  "question_type": "multiple_choice",
  "order": 1,
  "options": [
    {"id": "A", "text": "Network of computer networks"},
    {"id": "B", "text": "Interconnection of computers"},
    {"id": "C", "text": "Worldwide network"},
    {"id": "D", "text": "World Wide Web"}
  ],
  "correct_answer": "A",
  "explanation": "The Internet is a global network of networks...",
  "marks": 1,
  "difficulty": "easy"
}
```

---

### 4.5 Reorder Mock Exams

**Endpoint:** `POST /api/exams/admin/mock-exams/reorder/`

**Request Body:**
```json
{
  "mock_exam_ids": ["uuid1", "uuid2", "uuid3"]
}
```

---

### 4.6 Reorder Mock Questions

**Endpoint:** `POST /api/exams/admin/mock-exam-questions/reorder/`

**Request Body:**
```json
{
  "question_ids": ["uuid1", "uuid2", "uuid3", "..."]
}
```

---

## 5. Past Paper Management

### 5.1 List Past Papers

**Endpoint:** `GET /api/exams/admin/past-papers/`

**Query Parameters:**
- `exam` - Filter by exam ID
- `year` - Filter by year (e.g., `2024`)
- `is_published` - Filter by publish status
- `is_free` - Filter by pricing
- `search` - Search in title, description, session
- `ordering` - Order by: `created_at`, `year`, `order`, `download_count`, `view_count`

---

### 5.2 Create Past Paper

**Endpoint:** `POST /api/exams/admin/past-papers/`

**Request Body:**
```json
{
  "exam": "uuid-exam-id",
  "year": 2024,
  "session": "June",
  "title": "GCE ICT A-Level – June 2024 – Paper 2",
  "description": "Full questions on OS, networks, databases...",
  "total_marks": 100,
  "duration_minutes": 180,
  "is_published": true,
  "is_free": true,
  "order": 0,
  "file": "<file upload or URL>",
  "file_url": "https://example.com/papers/gce_2024_p2.pdf"
}
```

---

### 5.3 Reorder Past Papers

**Endpoint:** `POST /api/exams/admin/past-papers/reorder/`

**Request Body:**
```json
{
  "past_paper_ids": ["uuid1", "uuid2", "uuid3"]
}
```

---

## 6. Enrollment Management

### 6.1 List Enrollments

**Endpoint:** `GET /api/exams/admin/enrollments/`

**Query Parameters:**
- `exam` - Filter by exam ID
- `student` - Filter by student user ID
- `status` - Filter by status: `pending`, `active`, `completed`, `cancelled`
- `search` - Search student name or email
- `ordering` - Order by: `created_at`, `last_accessed`, `progress_percent`

---

### 6.2 Get Enrollment Details

**Endpoint:** `GET /api/exams/admin/enrollments/{enrollment_id}/`

**Example Response:**
```json
{
  "id": "uuid",
  "student": {
    "id": "uuid",
    "email": "alice@example.com",
    "first_name": "Alice",
    "last_name": "Johnson"
  },
  "exam": {
    "id": "uuid",
    "title": "GCE ICT 2026",
    "exam_code": "GCE_AL_ICT_2026"
  },
  "status": "active",
  "progress_percent": 45.5,
  "completed_courses": [
    {
      "id": "uuid",
      "title": "Paper 1 Mastery"
    }
  ],
  "completed_lessons": [
    {
      "id": "uuid",
      "title": "Lesson 1.1: CPU Architecture"
    }
  ],
  "mock_exam_attempts": 3,
  "best_mock_score": 42,
  "current_streak": 7,
  "last_accessed": "2026-03-02T14:30:00Z",
  "enrolled_at": "2026-02-15T09:00:00Z"
}
```

---

## 7. Dashboard Statistics

### 7.1 Exam Package Statistics

**Endpoint:** `GET /api/exams/admin/exams/{exam_id}/statistics/`

**Description:** Comprehensive statistics for dashboard - see section 1.10 for full response format.

**Key Metrics Returned:**
- Content counts (courses, modules, lessons, sections, resources)
- Assessment counts (mock exams, questions, past papers)
- Enrollment stats (total, active, completed)
- Engagement metrics (attempts, average score, completion rate)
- Detailed breakdowns for courses, mock exams, and past papers

---

## 8. Import & Bulk Operations

### 8.1 Import Complete Exam Package

**Endpoint:** `POST /api/exams/admin/exams/import_exam/`

**Content-Type:** `application/json` or `multipart/form-data`

**Description:** Import a complete exam package structure from JSON file. Automatically creates exam, courses, modules, lessons, sections, resources, mock exams, questions, and past papers.

**Request Body (JSON):**
```json
{
  "title": "JAMB UTME 2027",
  "exam_code": "JAMB_UTME_2027",
  "description": "Complete preparation package...",
  "exam_type": "university",
  "exam_board": "JAMB",
  "exam_date": "2027-04-15",
  "total_marks": 400,
  "passing_score": 180,
  "exam_duration_minutes": 180,
  "exam_format": "CBT - 4 subjects...",
  "number_of_sections": 4,
  "section_details": [...],
  "is_free": false,
  "price": 5000.00,
  "currency": "NGN",
  "status": "draft",
  "is_published": false,
  
  "courses": [
    {
      "title": "Use of English",
      "course_code": "JAMB-2027-ENG",
      "subject": "English Language",
      "difficulty": "intermediate",
      "estimated_hours": 60,
      "description": "...",
      "modules": [
        {
          "title": "Module 1: Comprehension",
          "description": "...",
          "order": 0,
          "lessons": [
            {
              "title": "Lesson 1.1: Reading Strategies",
              "description": "...",
              "lesson_type": "mixed",
              "order": 0,
              "sections": [
                {
                  "title": "Introduction to Reading",
                  "section_type": "text",
                  "order": 0,
                  "text_content": "..."
                },
                {
                  "title": "Video: Speed Reading",
                  "section_type": "video",
                  "order": 1,
                  "video_url": "https://youtube.com/..."
                }
              ],
              "resources": [
                {
                  "title": "Reading Comprehension Guide",
                  "resource_type": "pdf",
                  "url": "https://example.com/guide.pdf",
                  "is_required": true
                }
              ]
            }
          ]
        }
      ]
    }
  ],
  
  "mock_exams": [
    {
      "title": "Diagnostic Mock Exam",
      "is_timed": true,
      "time_limit_minutes": 180,
      "total_marks": 400,
      "passing_marks": 200,
      "total_questions": 240,
      "difficulty": "medium",
      "is_published": true,
      "questions": [
        {
          "course_code": "JAMB-2027-ENG",
          "question_text": "Choose the correct option:",
          "question_type": "multiple_choice",
          "order": 0,
          "options": [
            {"id": "A", "text": "Option A"},
            {"id": "B", "text": "Option B"}
          ],
          "correct_answer": "A",
          "explanation": "Because...",
          "marks": 1,
          "difficulty": "easy"
        }
      ]
    }
  ],
  
  "past_papers": [
    {
      "year": 2024,
      "session": "April",
      "title": "JAMB UTME 2024 - Use of English",
      "total_marks": 100,
      "duration_minutes": 45,
      "is_published": true,
      "is_free": true
    }
  ]
}
```

**Response:** `201 Created`
```json
{
  "message": "Exam package imported successfully",
  "exam": {
    "id": "uuid",
    "title": "JAMB UTME 2027",
    "exam_code": "JAMB_UTME_2027",
    ...
  },
  "stats": {
    "courses": 4,
    "modules": 16,
    "lessons": 48,
    "mock_exams": 5,
    "total_questions": 1200,
    "past_papers": 12
  }
}
```

**Smart Features:**
- **Instructor auto-assignment:** If not provided, defaults to current user
- **Subject auto-creation:** If subject name provided as string, creates new Subject with unique code
- **Field truncation:** Automatically truncates fields exceeding max_length (e.g., target_audience to 200 chars)
- **Comment field filtering:** Ignores fields starting with `_` (for JSON documentation)

---

## Common Response Codes

- `200 OK` - Successful GET, PUT, PATCH
- `201 Created` - Successful POST (resource created)
- `204 No Content` - Successful DELETE
- `400 Bad Request` - Validation error or malformed request
- `401 Unauthorized` - Missing or invalid authentication token
- `403 Forbidden` - User lacks permission (non-staff trying to access other instructor's exams)
- `404 Not Found` - Resource doesn't exist
- `500 Internal Server Error` - Server error (check logs)

---

## Permissions

All endpoints require:
- **Authentication:** Valid JWT Bearer token
- **Authorization:** `is_staff=True` OR instructor owns the exam

**Staff users** can access all exams.  
**Non-staff instructors** can only access exams where they are the instructor.

---

## Pagination

List endpoints support pagination:
- Default page size: 10 items
- Use `page` parameter to navigate: `?page=2`
- Use `page_size` parameter to control items per page: `?page_size=25`
- Maximum page size: 100

**Pagination Response Format:**
```json
{
  "count": 156,
  "next": "http://api.example.com/api/exams/admin/exams/?page=3",
  "previous": "http://api.example.com/api/exams/admin/exams/?page=1",
  "results": [...]
}
```

---

## Filtering Examples

**Get all published secondary exams:**
```bash
GET /api/exams/admin/exams/?exam_type=secondary&is_published=true
```

**Get all mock exams for specific exam, hardest first:**
```bash
GET /api/exams/admin/mock-exams/?exam=uuid-exam-id&ordering=-difficulty
```

**Search for "JAMB" exams:**
```bash
GET /api/exams/admin/exams/?search=JAMB
```

**Get enrollments for specific exam, sorted by progress:**
```bash
GET /api/exams/admin/enrollments/?exam=uuid-exam-id&ordering=-progress_percent
```

---

## Dashboard Usage Guide

### Building an Exam Package Dashboard

**Step 1: Get Statistics**
```javascript
const response = await fetch(`/api/exams/admin/exams/${examId}/statistics/`, {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
const stats = await response.json();

console.log(`Courses: ${stats.content.courses}`);
console.log(`Mock Exams: ${stats.assessments.mock_exams}`);
console.log(`Past Papers: ${stats.assessments.past_papers}`);
console.log(`Total Enrollments: ${stats.enrollments.total}`);
```

**Step 2: Display Content Breakdown**
```javascript
stats.breakdown.courses.forEach(course => {
  console.log(`${course.title}: ${course.modules} modules, ${course.lessons} lessons`);
});
```

**Step 3: Show Mock Exam Performance**
```javascript
stats.breakdown.mock_exams.forEach(mock => {
  console.log(`${mock.title}: ${mock.attempts} attempts, ${mock.questions} questions`);
});
```

**Step 4: Track Past Paper Usage**
```javascript
stats.breakdown.past_papers.forEach(paper => {
  console.log(`${paper.title} (${paper.year}): ${paper.downloads} downloads, ${paper.views} views`);
});
```

---

## Troubleshooting

### Issue: Dashboard shows 0 mock exams / 0 past papers

**Cause:** Mock exams and past papers were not created in the JSON import or there's a relationship issue.

**Solution:**
1. Use the statistics endpoint to verify: `GET /api/exams/admin/exams/{exam_id}/statistics/`
2. Check the import response `stats` object
3. Manually verify with: `GET /api/exams/admin/exams/{exam_id}/mock_exams/`
4. If empty, check the import JSON structure - ensure `mock_exams` and `past_papers` arrays are at the root level

### Issue: Import fails with "duplicate key" error

**Cause:** Subject code collision when multiple subjects have similar names (e.g., "ICT Paper 1", "ICT Paper 2").

**Solution:** The import logic now automatically generates unique codes by combining first/last parts of name and adding suffixes if needed. Update to latest version.

### Issue: Field truncation warnings

**Cause:** Field values exceed database max_length (e.g., `target_audience` > 200 chars).

**Solution:** The import automatically truncates fields. Check server logs for truncation warnings and adjust JSON source to stay within limits.

---

## Complete Example: Creating Exam Package via API

```javascript
// 1. Create exam
const exam = await createExam({
  title: "SAT Preparation 2027",
  exam_code: "SAT_2027",
  exam_type: "standardized",
  // ... other fields
});

// 2. Create courses
const mathCourse = await createCourse({
  exam: exam.id,
  title: "SAT Mathematics",
  course_code: "SAT-2027-MATH",
  // ...
});

// 3. Create modules
const module1 = await createModule({
  exam_course: mathCourse.id,
  title: "Algebra",
  // ...
});

// 4. Create lessons
const lesson1 = await createLesson({
  module: module1.id,
  title: "Quadratic Equations",
  // ...
});

// 5. Create sections
await createSection({
  lesson: lesson1.id,
  title: "Introduction",
  section_type: "text",
  text_content: "..."
});

// 6. Create mock exam
const mock = await createMockExam({
  exam: exam.id,
  title: "Diagnostic SAT Mock",
  // ...
});

// 7. Add questions
await createMockQuestion({
  mock_exam: mock.id,
  exam_course: mathCourse.id,
  question_text: "Solve: x² + 5x + 6 = 0",
  // ...
});

// 8. Create past paper
await createPastPaper({
  exam: exam.id,
  year: 2024,
  title: "SAT 2024 March Test",
  // ...
});

// 9. Get final statistics
const stats = await getExamStatistics(exam.id);
console.log(stats);
```

---

**Last Updated:** March 3, 2026  
**API Version:** 1.0  
**Contact:** support@zlearn.com

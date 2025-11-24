# Course Management Dashboard API Documentation

## Table of Contents
1. [Overview](#overview)
2. [Two Course Systems](#two-course-systems)
3. [Data Structure & Relationships](#data-structure--relationships)
4. [Sections System - Deep Dive](#sections-system---deep-dive)
5. [Content App Endpoints](#content-app-endpoints)
6. [Courses App Endpoints](#courses-app-endpoints)
7. [Data Flow & Workflows](#data-flow--workflows)
8. [Important Notes & Flexibility](#important-notes--flexibility)

---

## Overview

This documentation covers two separate course management systems in the backend:

1. **Content App** (`/api/content/`) - Academic/Educational courses
2. **Courses App** (`/api/courses/`) - Professional/Skill-based courses

Both systems share similar structures but serve different purposes and have unique features. Both support a flexible **sections system** that allows granular content organization within lessons.

---

## Two Course Systems

### Content App (`/api/content/`)
**Purpose:** Academic courses mapped to educational programs (e.g., Mathematics for Form 1, Physics for GCE OL)

**Key Characteristics:**
- Linked to educational programs, class levels, and curricula
- Supports entrance exam preparation courses
- Academic-focused with subjects (Math, Physics, Chemistry, etc.)
- Priority-based ordering for entrance exams
- Exam-specific fields (exam_board, exam_year, passing_score)

**Base URL:** `/api/content/admin/`

### Courses App (`/api/courses/`)
**Purpose:** Professional/skill-based courses (e.g., Web Development, Data Science)

**Key Characteristics:**
- Instructor-based courses
- Category-based organization
- Pricing and enrollment management
- Reviews and ratings
- Certificates and wishlists
- Professional learning paths

**Base URL:** `/api/courses/admin/`

---

## Data Structure & Relationships

### Content App Hierarchy

```
Subject
  └── Course
      └── Module
          └── Lesson
              ├── LessonSection (flexible sections)
              │   └── QuizQuestion (if section_type is 'quiz')
              │       └── QuizOption
              └── LearningResource
```

### Courses App Hierarchy

```
CourseCategory
  └── Course
      └── CourseModule
          └── Lesson
              ├── LessonSection (flexible sections)
              │   └── SectionQuizQuestion (if section_type is 'quiz')
              │       └── SectionQuizOption
              ├── LearningResource
              └── LessonInteractive (interactive elements)
```

### Key Differences

| Feature | Content App | Courses App |
|--------|------------|-------------|
| **Top-level organization** | Subject | CourseCategory |
| **Course model** | `Course` (academic) | `Course` (professional) |
| **Module model** | `Module` | `CourseModule` |
| **Section quiz model** | `QuizQuestion` | `SectionQuizQuestion` |
| **Section quiz option** | `QuizOption` | `SectionQuizOption` |
| **Interactive elements** | ❌ | ✅ `LessonInteractive` |
| **Reviews/Ratings** | ❌ | ✅ |
| **Certificates** | ❌ | ✅ |

---

## Sections System - Deep Dive

### What Are Sections?

**Sections** are the most flexible and powerful feature for organizing lesson content. Instead of having a single monolithic lesson, you can break lessons into multiple **ordered sections**, each with its own content type and media.

### Why Sections Are Important

1. **Granular Content Control**: Break lessons into digestible pieces
2. **Mixed Media Support**: Combine text, video, images, quizzes, files in one lesson
3. **Flexible Ordering**: Reorder sections without affecting the lesson structure
4. **Progress Tracking**: Track completion at the section level
5. **Rich Content Types**: Support 18 different section types for maximum flexibility

### Section Types (Both Apps - Unified)

**Both Content App and Courses App now support the same comprehensive set of section types for maximum flexibility:**

```javascript
{
  // Basic content types
  'text': 'Text Content',
  'image': 'Image Content',
  'video': 'Video Content',
  'audio': 'Audio Content',
  'code': 'Code Block',
  'file': 'File/Document',
  'pdf': 'PDF Document',
  'embed': 'Embedded Content',
  'combined': 'Combined Media',
  
  // Interactive and assessment types
  'interactive': 'Interactive Element',
  'quiz': 'Quiz/Assessment',
  'practice': 'Practice Exercise',
  'assignment': 'Assignment',
  
  // Academic/Educational types
  'reading': 'Reading Material',
  'discussion': 'Discussion Topic',
  'exam_prep': 'Exam Preparation',
  'past_questions': 'Past Questions',
  'mock_exam': 'Mock Examination',
  'study_guide': 'Study Guide',
  'exam_tips': 'Exam Tips & Strategies'
}
```

**Total: 18 section types** - Maximum flexibility for course creators!

### Section Content Fields

Each section type uses different fields based on its type:

#### Text Section
- `text_content` - Rich text/markdown content
- `title` - Section heading

#### Video Section
- `video_url` - External video URL
- `video_file` - Uploaded video file
- `video_qualities` - JSON: `{"720p": "url", "480p": "url"}`
- `video_subtitles` - JSON: `[{"language": "en", "url": "..."}]`
- `video_thumbnail` - Thumbnail image
- `video_duration_seconds` - Duration in seconds

#### Image Section
- `image` - Uploaded image
- `image_url` - External image URL
- `image_caption` - Caption text

#### Audio Section
- `audio_url` - External audio URL
- `audio_file` - Uploaded audio file
- `audio_duration_seconds` - Duration in seconds

#### Code Section
- `code_content` - Code snippet
- `code_language` - Language (python, javascript, etc.)

#### File Section
- `file_attachment` - Uploaded file
- `file_url` - External file URL
- `file_size_bytes` - File size
- `file_type` - File type (pdf, docx, xlsx, etc.)

#### PDF Section
- `pdf_file` - Uploaded PDF file
- `pdf_url` - External PDF URL
- `file_size_bytes` - File size (if applicable)

#### Embed Section
- `embed_url` - Embed iframe URL
- `embed_code` - Full HTML embed code

#### Combined Section
- `combined_content` - JSON structure:
```json
{
  "layout": "side_by_side",
  "items": [
    {"type": "text", "content": "..."},
    {"type": "image", "url": "..."}
  ]
}
```

#### Quiz Section
- Links to `QuizQuestion` (Content App) or `SectionQuizQuestion` (Courses App)
- Each question has multiple `QuizOption` or `SectionQuizOption`

### Section Properties

All sections share these common properties:

- `order` - Display order (unique per lesson)
- `title` - Section title/heading
- `description` - Section description
- `estimated_time_minutes` - Estimated completion time
- `is_required` - Must complete to progress (default: true)
- `is_downloadable` - Available for offline download
- `is_published` - Published status
- `interactive_element` - Link to `LessonInteractive` (Courses App only)

### Section Flexibility Examples

**Example 1: Mixed Media Lesson**
```
Lesson: "Introduction to Python"
  Section 1 (text): Overview and concepts
  Section 2 (video): Video tutorial
  Section 3 (code): Code examples
  Section 4 (quiz): Knowledge check
  Section 5 (file): Downloadable PDF guide
```

**Example 2: Exam Preparation Lesson**
```
Lesson: "WAEC Mathematics Practice"
  Section 1 (text): Exam format explanation
  Section 2 (past_questions): Past question 1
  Section 3 (past_questions): Past question 2
  Section 4 (exam_tips): Tips and strategies
  Section 5 (mock_exam): Full mock exam
```

**Example 3: Professional Course Lesson**
```
Lesson: "React Hooks Tutorial"
  Section 1 (text): Introduction
  Section 2 (video): Video walkthrough
  Section 3 (code): Code examples
  Section 4 (interactive): Practice exercise
  Section 5 (quiz): Assessment
```

### Section Ordering

- Sections are ordered by the `order` field (integer)
- Order is unique per lesson (`unique_together = ['lesson', 'order']`)
- Use the `reorder` endpoint to bulk update section orders
- Frontend should display sections in ascending order

### Section Progress Tracking

Each section can be tracked individually:
- `SectionProgress` (Content App) or `CourseSectionProgress` (Courses App)
- Tracks: completion status, progress percentage, time spent
- Video/audio sections track playback position

---

## Content App Endpoints

### Base URL
`/api/content/admin/`

### Authentication
All admin endpoints require authentication. Staff users have full access.

---

### Subjects

#### List Subjects
```
GET /api/content/admin/subjects/
```

**Response:**
```json
[
  {
    "id": "uuid",
    "name": "Mathematics",
    "code": "MATH",
    "icon": "📚",
    "color": "#3B82F6",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
]
```

#### Create Subject
```
POST /api/content/admin/subjects/
Body: {
  "name": "Mathematics",
  "code": "MATH",
  "icon": "📚",
  "color": "#3B82F6"
}
```

#### Update Subject
```
PUT /api/content/admin/subjects/{id}/
PATCH /api/content/admin/subjects/{id}/
```

#### Delete Subject
```
DELETE /api/content/admin/subjects/{id}/
```

---

### Courses

#### List Courses
```
GET /api/content/admin/courses/
```

**Query Parameters:**
- `course_type` - Filter by type (entrance_exam, regular, advanced, review)
- `subject` - Filter by subject ID
- `program` - Filter by program ID
- `class_level` - Filter by class level ID
- `curriculum` - Filter by curriculum
- `difficulty` - Filter by difficulty
- `is_published` - Filter by published status
- `search` - Search in title, description, code
- `ordering` - Order by field (created_at, updated_at, title, priority_order)

**Response:**
```json
[
  {
    "id": "uuid",
    "code": "MATH_FORM1",
    "title": "Mathematics Form 1",
    "description": "...",
    "course_type": "regular",
    "subject": "uuid",
    "subject_name": "Mathematics",
    "program": "uuid",
    "class_level": "uuid",
    "curriculum": "GCE_OL",
    "difficulty": "beginner",
    "estimated_hours": 40,
    "priority_order": 10,
    "is_published": true,
    "is_free": true,
    "exam_board": "WAEC",
    "exam_year": 2024,
    "passing_score": 50,
    "learning_objectives": ["objective1", "objective2"],
    "tags": ["tag1", "tag2"],
    "module_count": 5,
    "modules": [...],
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
]
```

#### Create Course
```
POST /api/content/admin/courses/
Body: {
  "code": "MATH_FORM1",
  "title": "Mathematics Form 1",
  "description": "Complete mathematics course for Form 1",
  "course_type": "regular",
  "subject": "uuid",
  "program": "uuid",
  "class_level": "uuid",
  "curriculum": "GCE_OL",
  "difficulty": "beginner",
  "estimated_hours": 40,
  "priority_order": 10,
  "is_published": false,
  "is_free": true,
  "exam_board": "WAEC",
  "exam_year": 2024,
  "passing_score": 50,
  "learning_objectives": ["objective1", "objective2"],
  "tags": ["tag1", "tag2"]
}
```

#### Get Course Detail
```
GET /api/content/admin/courses/{id}/
```

**Response:** Full course with nested modules, lessons, sections, resources

#### Update Course
```
PUT /api/content/admin/courses/{id}/
PATCH /api/content/admin/courses/{id}/
```

#### Delete Course
```
DELETE /api/content/admin/courses/{id}/
```

#### Duplicate Course
```
POST /api/content/admin/courses/{id}/duplicate/
Body: {
  "include_modules": true,
  "include_lessons": true,
  "include_sections": true,
  "include_quiz_questions": true,
  "include_resources": true
}
```

**Response:** New course object with duplicated content

---

### Modules

#### List Modules
```
GET /api/content/admin/modules/
```

**Query Parameters:**
- `course` - Filter by course ID
- `ordering` - Order by field (order, created_at)

**Response:**
```json
[
  {
    "id": "uuid",
    "course": "uuid",
    "order": 1,
    "title": "Module 1: Introduction",
    "description": "...",
    "estimated_hours": 8.0,
    "is_optional": false,
    "unlock_after": null,
    "lesson_count": 5,
    "lessons": [...],
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
]
```

#### Create Module
```
POST /api/content/admin/modules/
Body: {
  "course": "uuid",
  "order": 1,
  "title": "Module 1: Introduction",
  "description": "...",
  "estimated_hours": 8.0,
  "is_optional": false,
  "unlock_after": null
}
```

#### Update Module
```
PUT /api/content/admin/modules/{id}/
PATCH /api/content/admin/modules/{id}/
```

#### Delete Module
```
DELETE /api/content/admin/modules/{id}/
```

#### Reorder Modules
```
POST /api/content/admin/modules/reorder/
Body: {
  "modules": [
    {"id": "uuid1", "order": 1},
    {"id": "uuid2", "order": 2},
    {"id": "uuid3", "order": 3}
  ]
}
```

---

### Lessons

#### List Lessons
```
GET /api/content/admin/lessons/
```

**Query Parameters:**
- `module` - Filter by module ID
- `content_type` - Filter by content type
- `difficulty` - Filter by difficulty
- `is_free` - Filter by free status
- `is_preview` - Filter by preview status
- `search` - Search in title, description
- `ordering` - Order by field (order, created_at)

**Response:**
```json
[
  {
    "id": "uuid",
    "module": "uuid",
    "order": 1,
    "title": "Lesson 1: Introduction",
    "description": "...",
    "content_type": "video",
    "duration": "PT30M",
    "difficulty": "easy",
    "learning_objectives": ["objective1"],
    "keywords": ["keyword1"],
    "is_free": true,
    "is_preview": false,
    "unlock_after": null,
    "section_count": 3,
    "resource_count": 2,
    "sections": [...],
    "resources": [...],
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
]
```

#### Create Lesson
```
POST /api/content/admin/lessons/
Body: {
  "module": "uuid",
  "order": 1,
  "title": "Lesson 1: Introduction",
  "description": "...",
  "content_type": "video",
  "duration": "PT30M",
  "difficulty": "easy",
  "learning_objectives": ["objective1"],
  "keywords": ["keyword1"],
  "is_free": true,
  "is_preview": false,
  "unlock_after": null
}
```

#### Update Lesson
```
PUT /api/content/admin/lessons/{id}/
PATCH /api/content/admin/lessons/{id}/
```

#### Delete Lesson
```
DELETE /api/content/admin/lessons/{id}/
```

#### Reorder Lessons
```
POST /api/content/admin/lessons/reorder/
Body: {
  "lessons": [
    {"id": "uuid1", "order": 1},
    {"id": "uuid2", "order": 2}
  ]
}
```

---

### Lesson Sections

#### List Sections
```
GET /api/content/admin/sections/
```

**Query Parameters:**
- `lesson` - Filter by lesson ID
- `section_type` - Filter by section type
- `ordering` - Order by field (order, created_at)

**Response:**
```json
[
  {
    "id": "uuid",
    "lesson": "uuid",
    "order": 1,
    "section_type": "text",
    "title": "Introduction",
    "text_content": "This is the introduction...",
    "image": null,
    "image_url": "",
    "image_caption": "",
    "video_url": "",
    "video_file": null,
    "video_qualities": {},
    "video_subtitles": [],
    "video_thumbnail": null,
    "video_duration_seconds": 0,
    "audio_url": "",
    "audio_file": null,
    "audio_duration_seconds": 0,
    "code_content": "",
    "code_language": "",
    "file": null,
    "file_attachment": null,
    "file_url": "",
    "file_size_bytes": 0,
    "file_type": "",
    "pdf_file": null,
    "pdf_url": "",
    "url": "",
    "embed_url": "",
    "embed_code": "",
    "combined_content": {},
    "description": "",
    "estimated_time_minutes": 5,
    "is_required": true,
    "is_downloadable": false,
    "is_published": true,
    "quiz_questions": [...],
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
]
```

#### Create Section
```
POST /api/content/admin/sections/
Body: {
  "lesson": "uuid",
  "order": 1,
  "section_type": "text",
  "title": "Introduction",
  "text_content": "This is the introduction...",
  "estimated_time_minutes": 5,
  "is_required": true,
  "is_published": true
}
```

**For Video Section:**
```json
{
  "lesson": "uuid",
  "order": 2,
  "section_type": "video",
  "title": "Video Tutorial",
  "video_url": "https://example.com/video.mp4",
  "video_qualities": {
    "720p": "https://example.com/video-720p.mp4",
    "480p": "https://example.com/video-480p.mp4"
  },
  "video_subtitles": [
    {"language": "en", "url": "https://example.com/subtitles.vtt"}
  ],
  "video_duration_seconds": 600,
  "video_thumbnail": <file upload>,
  "estimated_time_minutes": 10,
  "is_required": true,
  "is_published": true
}
```

**For Code Section:**
```json
{
  "lesson": "uuid",
  "order": 3,
  "section_type": "code",
  "title": "Code Example",
  "code_content": "def hello():\n    print('Hello World')",
  "code_language": "python",
  "estimated_time_minutes": 5,
  "is_required": true,
  "is_published": true
}
```

**For File/PDF Section:**
```json
{
  "lesson": "uuid",
  "order": 4,
  "section_type": "file",
  "title": "Downloadable Resource",
  "file_attachment": <file upload>,
  "file_url": "https://example.com/file.pdf",
  "file_type": "pdf",
  "is_downloadable": true,
  "estimated_time_minutes": 15,
  "is_required": false,
  "is_published": true
}
```

**For Combined Media Section:**
```json
{
  "lesson": "uuid",
  "order": 5,
  "section_type": "combined",
  "title": "Mixed Content",
  "combined_content": {
    "layout": "side_by_side",
    "items": [
      {"type": "text", "content": "Explanation text"},
      {"type": "image", "url": "https://example.com/image.jpg"}
    ]
  },
  "estimated_time_minutes": 8,
  "is_required": true,
  "is_published": true
}
```

**For Quiz Section (with questions):**
```json
{
  "lesson": "uuid",
  "order": 6,
  "section_type": "quiz",
  "title": "Knowledge Check",
  "estimated_time_minutes": 10,
  "is_required": true,
  "is_published": true,
  "quiz_questions": [
    {
      "text": "What is 2 + 2?",
      "explanation": "Basic addition",
      "order": 1,
      "options": [
        {
          "text": "3",
          "is_correct": false,
          "explanation": "",
          "order": 1
        },
        {
          "text": "4",
          "is_correct": true,
          "explanation": "Correct!",
          "order": 2
        },
        {
          "text": "5",
          "is_correct": false,
          "explanation": "",
          "order": 3
        }
      ]
    },
    {
      "text": "What is the capital of France?",
      "explanation": "Paris is the capital",
      "order": 2,
      "options": [
        {
          "text": "London",
          "is_correct": false,
          "explanation": "",
          "order": 1
        },
        {
          "text": "Paris",
          "is_correct": true,
          "explanation": "Correct!",
          "order": 2
        }
      ]
    }
  ]
}
```

**Note:** Quiz questions and options are managed directly through the section endpoint. You can create, update, or delete all quiz questions in one request when creating/updating a quiz section.

#### Update Section
```
PUT /api/content/admin/sections/{id}/
PATCH /api/content/admin/sections/{id}/
```

#### Delete Section
```
DELETE /api/content/admin/sections/{id}/
```

#### Reorder Sections
```
POST /api/content/admin/sections/reorder/
Body: {
  "sections": [
    {"id": "uuid1", "order": 1},
    {"id": "uuid2", "order": 2}
  ]
}
```

---

### Quiz Questions & Options (Content App)

**⚠️ Important:** Quiz questions and options are **managed directly through the section endpoint** when creating or updating quiz sections. The separate quiz endpoints below are still available for advanced use cases, but the recommended approach is to include quiz questions in the section payload.

#### Recommended: Manage via Section Endpoint

When creating or updating a quiz section, include `quiz_questions` in the payload:

```json
{
  "lesson": "uuid",
  "order": 3,
  "section_type": "quiz",
  "title": "Knowledge Check",
  "quiz_questions": [
    {
      "text": "What is 2 + 2?",
      "explanation": "Basic addition",
      "order": 1,
      "options": [
        {
          "text": "3",
          "is_correct": false,
          "explanation": "",
          "order": 1
        },
        {
          "text": "4",
          "is_correct": true,
          "explanation": "Correct!",
          "order": 2
        }
      ]
    }
  ]
}
```

**Benefits:**
- Create section and all questions in one request
- Update all questions at once
- Simpler workflow - everything in one place
- Automatic cleanup when section type changes

#### Alternative: Separate Quiz Endpoints (Advanced)

If you need to manage questions separately, these endpoints are still available:

**List Quiz Questions:**
```
GET /api/content/admin/quiz-questions/?section={section_id}
```

**Create Quiz Question:**
```
POST /api/content/admin/quiz-questions/
Body: {
  "section": "uuid",
  "text": "What is 2 + 2?",
  "explanation": "Basic addition",
  "order": 1,
  "options": [...]
}
```

**Update/Delete Quiz Question:**
```
PUT /api/content/admin/quiz-questions/{id}/
DELETE /api/content/admin/quiz-questions/{id}/
```

**List/Create/Update/Delete Quiz Options:**
```
GET /api/content/admin/quiz-options/?question={question_id}
POST /api/content/admin/quiz-options/
PUT /api/content/admin/quiz-options/{id}/
DELETE /api/content/admin/quiz-options/{id}/
```

---

### Learning Resources

#### List Resources
```
GET /api/content/admin/resources/
```

**Query Parameters:**
- `lesson` - Filter by lesson ID
- `resource_type` - Filter by resource type
- `is_primary` - Filter by primary status
- `is_required` - Filter by required status
- `ordering` - Order by field (order, created_at)

**Response:**
```json
[
  {
    "id": "uuid",
    "lesson": "uuid",
    "title": "PDF Guide",
    "description": "Downloadable guide",
    "resource_type": "pdf",
    "file": "/media/learning_resources/guide.pdf",
    "url": "",
    "text_content": "",
    "embed_code": "",
    "file_size": 1024000,
    "duration": null,
    "download_allowed": true,
    "metadata": {},
    "is_required": false,
    "estimated_time_minutes": 10,
    "order": 1,
    "is_primary": false,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
]
```

#### Create Resource
```
POST /api/content/admin/resources/
Body: {
  "lesson": "uuid",
  "title": "PDF Guide",
  "description": "Downloadable guide",
  "resource_type": "pdf",
  "file": <file upload>,
  "download_allowed": true,
  "is_required": false,
  "estimated_time_minutes": 10,
  "order": 1,
  "is_primary": false
}
```

#### Update Resource
```
PUT /api/content/admin/resources/{id}/
PATCH /api/content/admin/resources/{id}/
```

#### Delete Resource
```
DELETE /api/content/admin/resources/{id}/
```

#### Reorder Resources
```
POST /api/content/admin/resources/reorder/
Body: {
  "resources": [
    {"id": "uuid1", "order": 1},
    {"id": "uuid2", "order": 2}
  ]
}
```

---

## Courses App Endpoints

### Base URL
`/api/courses/admin/`

### Authentication
All admin endpoints require authentication. Staff users and course instructors have access.

---

### Course Categories

#### List Categories
```
GET /api/courses/admin/categories/
```

**Response:**
```json
[
  {
    "id": "uuid",
    "name": "Web Development",
    "slug": "web-development",
    "description": "...",
    "icon": "💻",
    "color": "#3B82F6",
    "sort_order": 1,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
]
```

#### Create Category
```
POST /api/courses/admin/categories/
Body: {
  "name": "Web Development",
  "description": "...",
  "icon": "💻",
  "color": "#3B82F6",
  "sort_order": 1
}
```

#### Update Category
```
PUT /api/courses/admin/categories/{id}/
PATCH /api/courses/admin/categories/{id}/
```

#### Delete Category
```
DELETE /api/courses/admin/categories/{id}/
```

---

### Courses

#### List Courses
```
GET /api/courses/admin/courses/
```

**Query Parameters:**
- `status` - Filter by status (draft, published, archived, suspended)
- `level` - Filter by level (beginner, intermediate, advanced, expert)
- `category` - Filter by category ID
- `instructor` - Filter by instructor ID
- `featured` - Filter by featured status
- `is_free` - Filter by free status
- `search` - Search in title, description, course_code, short_description
- `ordering` - Order by field (created_at, updated_at, title, price, rating, current_enrollments)

**Response:**
```json
[
  {
    "id": "uuid",
    "title": "Complete React Course",
    "slug": "complete-react-course",
    "description": "...",
    "short_description": "Learn React from scratch",
    "course_code": "REACT101",
    "instructor": "uuid",
    "instructor_name": "John Doe",
    "category": "uuid",
    "level": "beginner",
    "status": "published",
    "thumbnail": "/media/courses/thumbnails/react.jpg",
    "banner_image": "/media/courses/banners/react.jpg",
    "video_intro": null,
    "price": "99.00",
    "currency": "USD",
    "is_free": false,
    "discount_price": "79.00",
    "discount_start_date": null,
    "discount_end_date": null,
    "duration_hours": 40,
    "total_lessons": 50,
    "total_quizzes": 10,
    "total_assignments": 5,
    "requirements": "...",
    "learning_outcomes": "...",
    "language": "en",
    "tags": ["react", "javascript"],
    "featured": true,
    "featured_order": 1,
    "max_students": null,
    "current_enrollments": 150,
    "enrollment_deadline": null,
    "rating": 4.5,
    "total_ratings": 120,
    "completion_rate": 75.5,
    "target_audience": "Beginners",
    "offers_certificate": true,
    "certificate_requirements": {
      "min_completion_percentage": 80,
      "min_assessment_score": 70,
      "min_time_spent_hours": 30
    },
    "published_at": "2024-01-01T00:00:00Z",
    "last_updated": "2024-01-01T00:00:00Z",
    "module_count": 8,
    "modules": [...],
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
]
```

#### Create Course
```
POST /api/courses/admin/courses/
Body: {
  "title": "Complete React Course",
  "description": "...",
  "short_description": "Learn React from scratch",
  "course_code": "REACT101",
  "category": "uuid",
  "level": "beginner",
  "status": "draft",
  "price": "99.00",
  "currency": "USD",
  "is_free": false,
  "duration_hours": 40,
  "requirements": "...",
  "learning_outcomes": "...",
  "language": "en",
  "tags": ["react", "javascript"],
  "featured": false,
  "featured_order": 0,
  "max_students": null,
  "enrollment_deadline": null,
  "target_audience": "Beginners",
  "offers_certificate": true,
  "certificate_requirements": {
    "min_completion_percentage": 80,
    "min_assessment_score": 70,
    "min_time_spent_hours": 30
  }
}
```

**Note:** `instructor` is automatically set to the authenticated user.

#### Get Course Detail
```
GET /api/courses/admin/courses/{id}/
```

**Response:** Full course with nested modules, lessons, sections, resources

#### Update Course
```
PUT /api/courses/admin/courses/{id}/
PATCH /api/courses/admin/courses/{id}/
```

#### Delete Course
```
DELETE /api/courses/admin/courses/{id}/
```

#### Duplicate Course
```
POST /api/courses/admin/courses/{id}/duplicate/
Body: {
  "include_modules": true,
  "include_lessons": true,
  "include_sections": true,
  "include_quiz_questions": true,
  "include_resources": true
}
```

**Response:** New course object with duplicated content

---

### Course Modules

#### List Modules
```
GET /api/courses/admin/modules/
```

**Query Parameters:**
- `course` - Filter by course ID
- `is_published` - Filter by published status
- `difficulty` - Filter by difficulty
- `ordering` - Order by field (order, created_at)

**Response:**
```json
[
  {
    "id": "uuid",
    "course": "uuid",
    "title": "Module 1: React Basics",
    "description": "...",
    "order": 1,
    "is_published": true,
    "duration_minutes": 120,
    "difficulty": "beginner",
    "learning_path": "sequential",
    "learning_objectives": ["objective1", "objective2"],
    "completion_requirements": {
      "min_lessons_completed": 6,
      "min_quiz_score": 75
    },
    "resources": [],
    "lesson_count": 8,
    "lessons": [...],
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
]
```

#### Create Module
```
POST /api/courses/admin/modules/
Body: {
  "course": "uuid",
  "title": "Module 1: React Basics",
  "description": "...",
  "order": 1,
  "is_published": true,
  "duration_minutes": 120,
  "difficulty": "beginner",
  "learning_path": "sequential",
  "learning_objectives": ["objective1", "objective2"],
  "completion_requirements": {
    "min_lessons_completed": 6,
    "min_quiz_score": 75
  },
  "resources": []
}
```

#### Update Module
```
PUT /api/courses/admin/modules/{id}/
PATCH /api/courses/admin/modules/{id}/
```

#### Delete Module
```
DELETE /api/courses/admin/modules/{id}/
```

#### Reorder Modules
```
POST /api/courses/admin/modules/reorder/
Body: {
  "modules": [
    {"id": "uuid1", "order": 1},
    {"id": "uuid2", "order": 2}
  ]
}
```

---

### Lessons

#### List Lessons
```
GET /api/courses/admin/lessons/
```

**Query Parameters:**
- `module` - Filter by module ID
- `lesson_type` - Filter by lesson type
- `difficulty` - Filter by difficulty
- `is_published` - Filter by published status
- `is_preview` - Filter by preview status
- `search` - Search in title, description, content
- `ordering` - Order by field (order, created_at, duration_minutes)

**Response:**
```json
[
  {
    "id": "uuid",
    "module": "uuid",
    "title": "Lesson 1: Introduction to React",
    "description": "...",
    "lesson_type": "video",
    "order": 1,
    "content": "...",
    "video_url": "https://example.com/video.mp4",
    "video_file": null,
    "duration_minutes": 30,
    "video_qualities": {
      "720p": "https://example.com/video-720p.mp4",
      "480p": "https://example.com/video-480p.mp4"
    },
    "video_thumbnail": "/media/courses/videos/thumbnails/react.jpg",
    "video_subtitles": [
      {"language": "en", "url": "https://example.com/subtitles.vtt"}
    ],
    "video_transcript": "...",
    "video_duration_seconds": 1800,
    "attachments": [],
    "external_links": [],
    "learning_objectives": ["objective1"],
    "completion_criteria": {
      "min_time_spent": 20,
      "quiz_score": 70,
      "resources_viewed": 2
    },
    "difficulty": "beginner",
    "estimated_time_minutes": 30,
    "is_published": true,
    "is_preview": false,
    "requires_completion": true,
    "section_count": 3,
    "resource_count": 2,
    "sections": [...],
    "resources": [...],
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
]
```

#### Create Lesson
```
POST /api/courses/admin/lessons/
Body: {
  "module": "uuid",
  "title": "Lesson 1: Introduction to React",
  "description": "...",
  "lesson_type": "video",
  "order": 1,
  "content": "...",
  "video_url": "https://example.com/video.mp4",
  "duration_minutes": 30,
  "video_qualities": {
    "720p": "https://example.com/video-720p.mp4"
  },
  "learning_objectives": ["objective1"],
  "completion_criteria": {
    "min_time_spent": 20,
    "quiz_score": 70
  },
  "difficulty": "beginner",
  "estimated_time_minutes": 30,
  "is_published": true,
  "is_preview": false,
  "requires_completion": true
}
```

#### Update Lesson
```
PUT /api/courses/admin/lessons/{id}/
PATCH /api/courses/admin/lessons/{id}/
```

#### Delete Lesson
```
DELETE /api/courses/admin/lessons/{id}/
```

#### Duplicate Lesson
```
POST /api/courses/admin/lessons/{id}/duplicate/
Body: {
  "target_module": "uuid",
  "include_sections": true,
  "include_quiz_questions": true,
  "include_resources": true
}
```

#### Reorder Lessons
```
POST /api/courses/admin/lessons/reorder/
Body: {
  "lessons": [
    {"id": "uuid1", "order": 1},
    {"id": "uuid2", "order": 2}
  ]
}
```

---

### Lesson Sections (Courses App)

#### List Sections
```
GET /api/courses/admin/sections/
```

**Query Parameters:**
- `lesson` - Filter by lesson ID
- `section_type` - Filter by section type
- `is_published` - Filter by published status
- `is_required` - Filter by required status
- `ordering` - Order by field (order, created_at)

**Response:**
```json
[
  {
    "id": "uuid",
    "lesson": "uuid",
    "title": "Introduction",
    "section_type": "text",
    "order": 1,
    "text_content": "This is the introduction...",
    "image": null,
    "image_url": "",
    "image_caption": "",
    "video_url": "",
    "video_file": null,
    "video_qualities": {},
    "video_subtitles": [],
    "video_thumbnail": null,
    "video_duration_seconds": 0,
    "audio_url": "",
    "audio_file": null,
    "audio_duration_seconds": 0,
    "code_content": "",
    "code_language": "",
    "file_attachment": null,
    "file_url": "",
    "file_size_bytes": 0,
    "file_type": "",
    "embed_url": "",
    "embed_code": "",
    "combined_content": {},
    "interactive_element": null,
    "description": "",
    "estimated_time_minutes": 5,
    "is_required": true,
    "is_downloadable": false,
    "is_published": true,
    "quiz_questions": [...],
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
]
```

#### Create Section
```
POST /api/courses/admin/sections/
Body: {
  "lesson": "uuid",
  "title": "Introduction",
  "section_type": "text",
  "order": 1,
  "text_content": "This is the introduction...",
  "estimated_time_minutes": 5,
  "is_required": true,
  "is_published": true
}
```

**For Video Section:**
```json
{
  "lesson": "uuid",
  "title": "Video Tutorial",
  "section_type": "video",
  "order": 2,
  "video_url": "https://example.com/video.mp4",
  "video_qualities": {
    "720p": "https://example.com/video-720p.mp4",
    "480p": "https://example.com/video-480p.mp4"
  },
  "video_subtitles": [
    {"language": "en", "url": "https://example.com/subtitles.vtt"}
  ],
  "video_duration_seconds": 600,
  "estimated_time_minutes": 10,
  "is_required": true,
  "is_published": true
}
```

#### Update Section
```
PUT /api/courses/admin/sections/{id}/
PATCH /api/courses/admin/sections/{id}/
```

#### Delete Section
```
DELETE /api/courses/admin/sections/{id}/
```

#### Reorder Sections
```
POST /api/courses/admin/sections/reorder/
Body: {
  "sections": [
    {"id": "uuid1", "order": 1},
    {"id": "uuid2", "order": 2}
  ]
}
```

---

### Section Quiz Questions & Options (Courses App)

**⚠️ Important:** Quiz questions and options are **managed directly through the section endpoint** when creating or updating quiz sections. The separate quiz endpoints below are still available for advanced use cases, but the recommended approach is to include quiz questions in the section payload.

#### Recommended: Manage via Section Endpoint

When creating or updating a quiz section, include `quiz_questions` in the payload:

```json
{
  "lesson": "uuid",
  "order": 3,
  "section_type": "quiz",
  "title": "Knowledge Check",
  "quiz_questions": [
    {
      "text": "What is React?",
      "explanation": "React is a JavaScript library",
      "order": 1,
      "points": 1,
      "options": [
        {
          "text": "A framework",
          "is_correct": false,
          "explanation": "",
          "order": 1
        },
        {
          "text": "A library",
          "is_correct": true,
          "explanation": "Correct!",
          "order": 2
        }
      ]
    }
  ]
}
```

**Benefits:**
- Create section and all questions in one request
- Update all questions at once
- Simpler workflow - everything in one place
- Automatic cleanup when section type changes

#### Alternative: Separate Quiz Endpoints (Advanced)

If you need to manage questions separately, these endpoints are still available:

**List Quiz Questions:**
```
GET /api/courses/admin/quiz-questions/?section={section_id}
```

**Create Quiz Question:**
```
POST /api/courses/admin/quiz-questions/
Body: {
  "section": "uuid",
  "text": "What is React?",
  "explanation": "React is a JavaScript library",
  "order": 1,
  "points": 1,
  "options": [...]
}
```

**Update/Delete Quiz Question:**
```
PUT /api/courses/admin/quiz-questions/{id}/
DELETE /api/courses/admin/quiz-questions/{id}/
```

**List/Create/Update/Delete Quiz Options:**
```
GET /api/courses/admin/quiz-options/?question={question_id}
POST /api/courses/admin/quiz-options/
PUT /api/courses/admin/quiz-options/{id}/
DELETE /api/courses/admin/quiz-options/{id}/
```

---

### Learning Resources (Courses App)

Same structure as Content App. See [Learning Resources (Content App)](#learning-resources) section above.

---

## Data Flow & Workflows

### Creating a Complete Course

#### Content App Workflow

1. **Create Subject** (if not exists)
   ```
   POST /api/content/admin/subjects/
   ```

2. **Create Course**
   ```
   POST /api/content/admin/courses/
   ```

3. **Create Modules** (for each module)
   ```
   POST /api/content/admin/modules/
   ```

4. **Create Lessons** (for each lesson)
   ```
   POST /api/content/admin/lessons/
   ```

5. **Create Sections** (for each section in lesson)
   ```
   POST /api/content/admin/sections/
   ```
   **For quiz sections, include `quiz_questions` with nested `options` in the same request:**
   ```json
   {
     "lesson": "uuid",
     "section_type": "quiz",
     "quiz_questions": [
       {
         "text": "Question text",
         "options": [...]
       }
     ]
   }
   ```

6. **Create Resources** (optional, for each resource)
   ```
   POST /api/content/admin/resources/
   ```

#### Courses App Workflow

1. **Create Category** (if not exists)
   ```
   POST /api/courses/admin/categories/
   ```

2. **Create Course**
   ```
   POST /api/courses/admin/courses/
   ```
   (Instructor is automatically set)

3. **Create Modules**
   ```
   POST /api/courses/admin/modules/
   ```

4. **Create Lessons**
   ```
   POST /api/courses/admin/lessons/
   ```

5. **Create Sections**
   ```
   POST /api/courses/admin/sections/
   ```
   **For quiz sections, include `quiz_questions` with nested `options` in the same request:**
   ```json
   {
     "lesson": "uuid",
     "section_type": "quiz",
     "quiz_questions": [
       {
         "text": "Question text",
         "points": 1,
         "options": [...]
       }
     ]
   }
   ```

6. **Create Resources**
   ```
   POST /api/courses/admin/resources/
   ```

### Reordering Workflow

1. **Fetch current order**
   ```
   GET /api/{app}/admin/{resource}/?parent_id={id}
   ```

2. **Update order**
   ```
   POST /api/{app}/admin/{resource}/reorder/
   Body: {
     "{resources}": [
       {"id": "uuid1", "order": 1},
       {"id": "uuid2", "order": 2}
     ]
   }
   ```

### Duplicating Course Workflow

1. **Duplicate course**
   ```
   POST /api/{app}/admin/courses/{id}/duplicate/
   Body: {
     "include_modules": true,
     "include_lessons": true,
     "include_sections": true,
     "include_quiz_questions": true,
     "include_resources": true
   }
   ```

2. **Response contains new course with all duplicated content**

### Bulk Operations

Currently, bulk operations are not directly supported. You'll need to:
- Make multiple API calls for bulk creates
- Use the `reorder` endpoints for bulk updates
- Use the `duplicate` endpoint for copying

---

## Important Notes & Flexibility

### Order Management

- **Order is critical**: All resources (modules, lessons, sections, resources) have an `order` field
- **Unique per parent**: Order must be unique within the parent (e.g., section order is unique per lesson)
- **Auto-increment not guaranteed**: You must explicitly set order values
- **Reordering**: Use dedicated `reorder` endpoints for bulk reordering

### Nested Data in Responses

- **List endpoints**: Return minimal data (no nested objects)
- **Detail endpoints**: Return full nested data (modules → lessons → sections → quiz questions)
- **Performance**: Use list endpoints for tables, detail endpoints for forms

### File Uploads

- **Multipart/form-data**: Required for file uploads
- **File fields**: `file`, `video_file`, `audio_file`, `image`, `file_attachment`, `thumbnail`, `banner_image`
- **File URLs**: Returned as absolute URLs in responses
- **File size**: Tracked in `file_size` or `file_size_bytes` fields

### Publishing Workflow

- **Draft → Published**: Set `is_published: true` or `status: 'published'`
- **Cascading**: Publishing a course doesn't auto-publish modules/lessons
- **Preview**: Set `is_preview: true` to allow viewing without enrollment

### Quiz Management

- **Nested in sections**: Quiz questions are managed through the section endpoint (recommended)
- **One request**: Create/update section with all questions and options in a single request
- **Automatic cleanup**: Changing section type from 'quiz' to another type automatically deletes quiz questions
- **Update replaces**: Updating a section's `quiz_questions` replaces all existing questions
- **Points system**: Courses App supports `points` field for questions
- **Multiple correct answers**: Not directly supported (use multiple choice with one correct)
- **Separate endpoints**: Still available for advanced use cases, but not the primary workflow

### Section Flexibility

- **Mixed types**: One lesson can have multiple section types
- **Order matters**: Sections are displayed in order
- **Required sections**: Set `is_required: false` to make sections optional
- **Downloadable**: Set `is_downloadable: true` for offline access

### Progress Tracking

- **Automatic**: Progress is tracked automatically when users complete sections/lessons
- **Read-only**: Progress endpoints are separate (not in admin API)
- **Section-level**: Most granular tracking is at section level

### Error Handling

- **Validation errors**: Return 400 with field-specific errors
- **Permission errors**: Return 403 for unauthorized access
- **Not found**: Return 404 for missing resources
- **Unique constraints**: Order conflicts return 400

### Performance Considerations

- **Pagination**: List endpoints support pagination
- **Filtering**: Use query parameters to filter data
- **Selective loading**: Detail endpoints load all nested data (may be slow for large courses)
- **Caching**: Consider caching course structures on frontend

### Data Consistency

- **Cascading deletes**: Deleting a course deletes all modules, lessons, sections, etc.
- **Orphaned data**: Avoid creating sections without lessons, etc.
- **Foreign keys**: All relationships use UUIDs

### Flexibility Points

1. **Sections**: Most flexible - can mix any content types
2. **Resources**: Can attach multiple resources per lesson
3. **Quiz questions**: Can have multiple questions per quiz section
4. **Metadata**: JSON fields allow custom data storage
5. **Ordering**: All resources can be reordered independently
6. **Publishing**: Granular control at each level

---

## Summary

This documentation provides comprehensive information for building a course management dashboard. Key takeaways:

1. **Two separate systems** with similar structures
2. **Sections are the most flexible feature** - use them extensively
3. **Order management is critical** - always handle ordering properly
4. **Nested data structure** - understand the hierarchy
5. **CRUD operations** - standard REST endpoints for all resources
6. **File uploads** - use multipart/form-data
7. **Bulk operations** - use reorder and duplicate endpoints

For any questions or clarifications, refer to the API schema at `/api/schema/` or the Swagger documentation at `/api/docs/`.


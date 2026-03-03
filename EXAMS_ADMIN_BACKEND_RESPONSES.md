# Exams Admin: Backend Responses to Frontend Questions

**Date:** March 3, 2026  
**Purpose:** Answer all frontend clarification questions from `EXAMS_ADMIN_FRONTEND_GAPS_AND_BACKEND_NEEDS.md`

---

## 1. Backend URL / Response Clarifications

### 1.1 Nested List URLs (exam-scoped) ✅

**Answer:** Use **HYPHENS** (not underscores)

Django REST Framework converts Python method names with underscores to URL paths with hyphens:
- Python method: `def mock_exams(self, request, pk=None)` 
- URL path: `/api/exams/admin/exams/{exam_id}/mock-exams/`

**Correct URLs:**
- `GET /api/exams/admin/exams/{exam_id}/courses/`
- `GET /api/exams/admin/exams/{exam_id}/mock-exams/` ✅ (HYPHEN)
- `GET /api/exams/admin/exams/{exam_id}/past-papers/` ✅ (HYPHEN)
- `GET /api/exams/admin/exams/{exam_id}/enrollments/`
- `GET /api/exams/admin/exams/{exam_id}/statistics/`

**Frontend Action:** Update your API calls to use hyphens in nested paths.

---

### 1.2 Pagination ✅

**Answer:** YES, all list endpoints ARE paginated

**Pagination Configuration:**
- **Default page size:** 20 (configured in `core.pagination.StandardResultsSetPagination`)
- **Max page size:** 100
- **Query params:** `page` (page number), `page_size` (items per page, max 100)

**Response Shape:**
```json
{
  "pagination": {
    "count": 156,
    "total_pages": 8,
    "current_page": 1,
    "page_size": 20,
    "has_next": true,
    "has_previous": false,
    "next_page": "http://api.example.com/api/exams/admin/exams/?page=2",
    "previous_page": null
  },
  "results": [
    { "id": "uuid", "title": "Exam 1", ... },
    { "id": "uuid", "title": "Exam 2", ... }
  ]
}
```

**Important:** The pagination is wrapped in a `pagination` object, NOT `count/next/previous` at root level. The documentation example was incorrect.

**Frontend Action:** 
- Access data via `response.pagination` (not `response.count`)
- Access items via `response.results`
- Add pagination UI with `page` and `page_size` query params
- Display total pages: `response.pagination.total_pages`

---

### 1.3 Exam List Response Shape ✅

**Answer:** YES, field names match the documentation

All exams endpoints (list and detail) use consistent field names:
- `exam_code` ✅
- `exam_date` ✅
- `exam_type` ✅
- `exam_board` ✅
- `priority_order` ✅
- `enrollment_count` ✅
- `instructor` (nested object with id, email, first_name, last_name) ✅

**Frontend Action:** Ensure your TypeScript interfaces match these exact field names.

---

## 2. Backend Endpoints Confirmation

### 2.1 All Documented Endpoints Exist ✅

| Endpoint | Status | Implementation |
|----------|--------|----------------|
| `GET /api/exams/admin/exams/` | ✅ Implemented | List all exams with filters |
| `POST /api/exams/admin/exams/` | ✅ Implemented | Create exam |
| `GET /api/exams/admin/exams/{id}/` | ✅ Implemented | Get single exam |
| `PUT /api/exams/admin/exams/{id}/` | ✅ Implemented | Full update |
| `PATCH /api/exams/admin/exams/{id}/` | ✅ Implemented | Partial update |
| `DELETE /api/exams/admin/exams/{id}/` | ✅ Implemented | Delete exam |
| `GET /api/exams/admin/exams/{id}/courses/` | ✅ Implemented | Courses for exam |
| `GET /api/exams/admin/exams/{id}/mock-exams/` | ✅ Implemented | Mock exams for exam |
| `GET /api/exams/admin/exams/{id}/past-papers/` | ✅ Implemented | Past papers for exam |
| `GET /api/exams/admin/exams/{id}/enrollments/` | ✅ Implemented | Enrollments for exam |
| `GET /api/exams/admin/exams/{id}/statistics/` | ✅ **JUST ADDED** | Dashboard statistics |
| `POST /api/exams/admin/exams/import_exam/` | ✅ Implemented | Import JSON package |

---

### 2.2 Course Management Endpoints ✅

| Endpoint | Status | Implementation |
|----------|--------|----------------|
| `GET /api/exams/admin/courses/` | ✅ Implemented | List courses (filter by `exam`) |
| `POST /api/exams/admin/courses/` | ✅ Implemented | Create course |
| `GET /api/exams/admin/courses/{id}/` | ✅ Implemented | Get course |
| `PUT/PATCH /api/exams/admin/courses/{id}/` | ✅ Implemented | Update course |
| `DELETE /api/exams/admin/courses/{id}/` | ✅ Implemented | Delete course |
| `GET /api/exams/admin/courses/{id}/modules/` | ✅ Implemented | Modules for course |
| `POST /api/exams/admin/courses/reorder/` | ✅ Implemented | Reorder courses |

**Query Params:**
- `exam={exam_id}` - Filter courses by exam
- `subject={subject_id}` - Filter by subject
- `difficulty=beginner|intermediate|advanced`
- `is_published=true|false`
- `search=...` - Search title, description, course_code
- `ordering=order|title|created_at|-created_at` etc.

---

### 2.3 Module Management Endpoints ✅

| Endpoint | Status | Implementation |
|----------|--------|----------------|
| `GET /api/exams/admin/modules/` | ✅ Implemented | List modules (filter by `exam_course`) |
| `POST /api/exams/admin/modules/` | ✅ Implemented | Create module |
| `GET /api/exams/admin/modules/{id}/` | ✅ Implemented | Get module |
| `PUT/PATCH /api/exams/admin/modules/{id}/` | ✅ Implemented | Update module |
| `DELETE /api/exams/admin/modules/{id}/` | ✅ Implemented | Delete module |
| `GET /api/exams/admin/modules/{id}/lessons/` | ✅ Implemented | Lessons for module |
| `POST /api/exams/admin/modules/reorder/` | ✅ Implemented | Reorder modules |

**Query Params:**
- `exam_course={course_id}` - Filter modules by course
- `is_published=true|false`

---

### 2.4 Lesson Management Endpoints ✅

| Endpoint | Status | Implementation |
|----------|--------|----------------|
| `GET /api/exams/admin/lessons/` | ✅ Implemented | List lessons (filter by `module`) |
| `POST /api/exams/admin/lessons/` | ✅ Implemented | Create lesson |
| `GET /api/exams/admin/lessons/{id}/` | ✅ Implemented | Get lesson |
| `PUT/PATCH /api/exams/admin/lessons/{id}/` | ✅ Implemented | Update lesson |
| `DELETE /api/exams/admin/lessons/{id}/` | ✅ Implemented | Delete lesson |
| `GET /api/exams/admin/lessons/{id}/sections/` | ✅ Implemented | Sections for lesson |
| `GET /api/exams/admin/lessons/{id}/resources/` | ✅ Implemented | Resources for lesson |
| `POST /api/exams/admin/lessons/reorder/` | ✅ Implemented | Reorder lessons |

**Query Params:**
- `module={module_id}` - Filter lessons by module
- `lesson_type=video|reading|practice|quiz|mixed`
- `is_published=true|false`

---

### 2.5 Section Management Endpoints ✅

| Endpoint | Status | Implementation |
|----------|--------|----------------|
| `GET /api/exams/admin/sections/` | ✅ Implemented | List sections (filter by `lesson`) |
| `POST /api/exams/admin/sections/` | ✅ Implemented | Create section |
| `GET /api/exams/admin/sections/{id}/` | ✅ Implemented | Get section |
| `PUT/PATCH /api/exams/admin/sections/{id}/` | ✅ Implemented | Update section |
| `DELETE /api/exams/admin/sections/{id}/` | ✅ Implemented | Delete section |
| `POST /api/exams/admin/sections/reorder/` | ✅ Implemented | Reorder sections |

**Query Params:**
- `lesson={lesson_id}` - Filter sections by lesson
- `section_type=text|video|image|pdf|quiz|practice|tips|formula`
- `is_published=true|false`

**Section Fields (including newly added):**
- `quiz_questions` (JSONField) - For quiz sections ✅ **JUST ADDED**
- `image_url` (URLField) - External image URL ✅ **JUST ADDED**
- All standard fields: `text_content`, `video_url`, `video_file`, `image`, `file`

---

### 2.6 Resource Management Endpoints ✅

| Endpoint | Status | Implementation |
|----------|--------|----------------|
| `GET /api/exams/admin/resources/` | ✅ Implemented | List resources (filter by `lesson`) |
| `POST /api/exams/admin/resources/` | ✅ Implemented | Create resource |
| `GET /api/exams/admin/resources/{id}/` | ✅ Implemented | Get resource |
| `PUT/PATCH /api/exams/admin/resources/{id}/` | ✅ Implemented | Update resource |
| `DELETE /api/exams/admin/resources/{id}/` | ✅ Implemented | Delete resource |
| `POST /api/exams/admin/resources/reorder/` | ✅ Implemented | Reorder resources |

**Query Params:**
- `lesson={lesson_id}` - Filter resources by lesson
- `resource_type=study_guide|video|pdf|article|flashcards|formula_sheet|tips|link`

---

### 2.7 Mock Exam Endpoints ✅

| Endpoint | Status | Implementation |
|----------|--------|----------------|
| `GET /api/exams/admin/mock-exams/` | ✅ Implemented | List mock exams (filter by `exam`) |
| `POST /api/exams/admin/mock-exams/` | ✅ Implemented | Create mock exam |
| `GET /api/exams/admin/mock-exams/{id}/` | ✅ Implemented | Get mock exam |
| `PUT/PATCH /api/exams/admin/mock-exams/{id}/` | ✅ Implemented | Update mock exam |
| `DELETE /api/exams/admin/mock-exams/{id}/` | ✅ Implemented | Delete mock exam |
| `GET /api/exams/admin/mock-exams/{id}/questions/` | ✅ Implemented | Questions for mock exam |
| `POST /api/exams/admin/mock-exams/reorder/` | ✅ Implemented | Reorder mock exams |

**Query Params:**
- `exam={exam_id}` - Filter by exam
- `difficulty=easy|medium|hard`
- `is_published=true|false`
- `is_timed=true|false`
- `is_featured=true|false`

---

### 2.8 Mock Question Endpoints ✅

| Endpoint | Status | Implementation |
|----------|--------|----------------|
| `GET /api/exams/admin/mock-exam-questions/` | ✅ Implemented | List questions (filter by `mock_exam`) |
| `POST /api/exams/admin/mock-exam-questions/` | ✅ Implemented | Create question |
| `GET /api/exams/admin/mock-exam-questions/{id}/` | ✅ Implemented | Get question |
| `PUT/PATCH /api/exams/admin/mock-exam-questions/{id}/` | ✅ Implemented | Update question |
| `DELETE /api/exams/admin/mock-exam-questions/{id}/` | ✅ Implemented | Delete question |
| `POST /api/exams/admin/mock-exam-questions/reorder/` | ✅ Implemented | Reorder questions |

**Query Params:**
- `mock_exam={mock_exam_id}` - Filter by mock exam
- `exam_course={course_id}` - Filter by course
- `question_type=multiple_choice|true_false|essay|short_answer`
- `difficulty=easy|medium|hard`

---

### 2.9 Past Paper Endpoints ✅

| Endpoint | Status | Implementation |
|----------|--------|----------------|
| `GET /api/exams/admin/past-papers/` | ✅ Implemented | List past papers (filter by `exam`) |
| `POST /api/exams/admin/past-papers/` | ✅ Implemented | Create past paper |
| `GET /api/exams/admin/past-papers/{id}/` | ✅ Implemented | Get past paper |
| `PUT/PATCH /api/exams/admin/past-papers/{id}/` | ✅ Implemented | Update past paper |
| `DELETE /api/exams/admin/past-papers/{id}/` | ✅ Implemented | Delete past paper |
| `POST /api/exams/admin/past-papers/reorder/` | ✅ Implemented | Reorder past papers |

**Query Params:**
- `exam={exam_id}` - Filter by exam
- `year=2024` - Filter by year
- `is_published=true|false`
- `is_free=true|false`

---

### 2.10 Enrollment Endpoints ✅

| Endpoint | Status | Implementation |
|----------|--------|----------------|
| `GET /api/exams/admin/enrollments/` | ✅ Implemented | List enrollments (filter by `exam`, `student`, `status`) |
| `GET /api/exams/admin/enrollments/{id}/` | ✅ Implemented | Get enrollment details |

**Note:** Enrollments are **READ-ONLY** from admin side (students enroll via public API).

**Query Params:**
- `exam={exam_id}` - Filter by exam
- `student={student_id}` - Filter by student
- `status=active|completed|exam_taken|suspended`
- `certificate_issued=true|false`
- `search=...` - Search student email/name or exam title

---

## 3. Past Paper Fields - Exact Structure ✅

**Model Fields:**
```python
class PastPaper(BaseModel):
    exam = ForeignKey(Exam)                    # Required
    year = PositiveIntegerField()              # Required
    session = CharField(max_length=50)         # Optional (e.g., "June", "May/June")
    title = CharField(max_length=200)          # Auto-generated if not provided
    
    # Files (all optional, one or more can be provided)
    question_paper = FileField()               # Main question paper PDF
    answer_key = FileField()                   # Answer key/solutions
    marking_scheme = FileField()               # Marking criteria
    solutions_pdf = FileField()                # Detailed solutions
    
    # Additional info
    description = TextField()                  # Optional
    total_marks = PositiveIntegerField()       # Optional
    duration_minutes = PositiveIntegerField()  # Optional
    
    # Publishing
    is_published = BooleanField(default=True)
    is_free = BooleanField(default=True)
    
    # Statistics (read-only)
    download_count = PositiveIntegerField(default=0)
    view_count = PositiveIntegerField(default=0)
    
    # Ordering
    order = PositiveIntegerField(default=0)
```

**Create Request (multipart/form-data or JSON):**

**Option 1: Multipart with files**
```http
POST /api/exams/admin/past-papers/
Content-Type: multipart/form-data

exam: uuid-exam-id
year: 2024
session: June
title: GCE ICT 2024 Paper 2
description: Full structured essay questions...
total_marks: 100
duration_minutes: 180
is_published: true
is_free: true
order: 0
question_paper: <file upload>
answer_key: <file upload>
marking_scheme: <file upload>
```

**Option 2: JSON only (no files)**
```json
{
  "exam": "uuid-exam-id",
  "year": 2024,
  "session": "June",
  "title": "GCE ICT 2024 Paper 2",
  "description": "Full structured essay questions...",
  "total_marks": 100,
  "duration_minutes": 180,
  "is_published": true,
  "is_free": true,
  "order": 0
}
```

**Note:** There is NO `file` or `file_url` field. Use the specific fields:
- `question_paper` - Main exam questions
- `answer_key` - Answers/solutions
- `marking_scheme` - Grading rubric
- `solutions_pdf` - Detailed explanations

**Frontend Action:** Update your past paper form to use these 4 file fields instead of single `file` field.

---

## 4. Statistics Endpoint Response ✅

**Endpoint:** `GET /api/exams/admin/exams/{exam_id}/statistics/`

**Status:** ✅ **JUST IMPLEMENTED** (added today)

**Response Structure:**
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
      }
    ],
    "mock_exams": [
      {
        "id": "uuid",
        "title": "Diagnostic Mock",
        "questions": 50,
        "attempts": 342,
        "is_published": true,
        "is_featured": true
      }
    ],
    "past_papers": [
      {
        "id": "uuid",
        "title": "GCE ICT – June 2024",
        "year": 2024,
        "session": "June",
        "downloads": 1245,
        "views": 3421,
        "is_published": true
      }
    ]
  }
}
```

**Frontend Action:** 
- Call this endpoint on exam detail page load
- Display statistics in overview cards/dashboard
- Use breakdown data to populate drill-down lists

---

## 5. Reorder Endpoints - Exact Request Format ✅

All reorder endpoints follow the same pattern:

**Pattern:** `POST /api/exams/admin/<resource>/reorder/`

**Request Body:**
```json
{
  "<resource>_ids": ["uuid1", "uuid2", "uuid3", ...]
}
```

**Examples:**

```json
// Reorder courses
POST /api/exams/admin/courses/reorder/
{ "course_ids": ["uuid1", "uuid2", "uuid3"] }

// Reorder modules  
POST /api/exams/admin/modules/reorder/
{ "module_ids": ["uuid1", "uuid2", "uuid3"] }

// Reorder lessons
POST /api/exams/admin/lessons/reorder/
{ "lesson_ids": ["uuid1", "uuid2", "uuid3"] }

// Reorder sections
POST /api/exams/admin/sections/reorder/
{ "section_ids": ["uuid1", "uuid2", "uuid3"] }

// Reorder resources
POST /api/exams/admin/resources/reorder/
{ "resource_ids": ["uuid1", "uuid2", "uuid3"] }

// Reorder mock exams
POST /api/exams/admin/mock-exams/reorder/
{ "mock_exam_ids": ["uuid1", "uuid2", "uuid3"] }

// Reorder mock questions
POST /api/exams/admin/mock-exam-questions/reorder/
{ "question_ids": ["uuid1", "uuid2", "uuid3"] }

// Reorder past papers
POST /api/exams/admin/past-papers/reorder/
{ "past_paper_ids": ["uuid1", "uuid2", "uuid3"] }
```

**Response:**
```json
{
  "status": "<resource> reordered"
}
```

**Frontend Action:** Implement drag-and-drop reordering in list views, send new order to backend.

---

## 6. Permission Model ✅

**Authentication:** JWT Bearer token required for ALL endpoints

**Authorization Rules:**
- **Staff users** (`is_staff=True`): Can access ALL exams and related resources
- **Instructors** (non-staff): Can ONLY access exams where they are the assigned instructor
- **All endpoints** enforce instructor ownership check in `get_queryset()`

**Example:** Non-staff instructor with ID `abc123` can only:
- See exams where `instructor.id = 'abc123'`
- Manage courses/modules/lessons/mocks/papers for THEIR exams only
- View enrollments for THEIR exams only

**Frontend Action:** 
- Show/hide admin UI based on user's `is_staff` status
- Expect 403 Forbidden if trying to access another instructor's content

---

## 7. Filter & Search Summary

### Exam List Filters:
- `status` = draft|published|archived
- `exam_type` = university|professional|language|standardized|secondary|other
- `exam_board` = JAMB|CGCEB|etc
- `country` = {country_id}
- `instructor` = {user_id}
- `featured` = true|false
- `is_free` = true|false
- `is_published` = true|false
- `search` = (searches title, description, exam_code, short_description, exam_board)
- `ordering` = created_at|-created_at|title|exam_date|price|rating|enrollment_count|priority_order

### Course List Filters:
- `exam` = {exam_id}
- `subject` = {subject_id}
- `difficulty` = beginner|intermediate|advanced
- `is_published` = true|false
- `search` = (title, description, course_code, short_description)
- `ordering` = created_at|updated_at|title|order|estimated_hours

### Module List Filters:
- `exam_course` = {course_id}
- `is_published` = true|false
- `search` = (title, description)
- `ordering` = created_at|updated_at|title|order|duration_minutes

### Lesson List Filters:
- `module` = {module_id}
- `lesson_type` = video|reading|practice|quiz|mixed
- `is_published` = true|false
- `search` = (title, description)
- `ordering` = created_at|updated_at|title|order|duration_minutes

### Mock Exam List Filters:
- `exam` = {exam_id}
- `difficulty` = easy|medium|hard
- `is_published` = true|false
- `is_timed` = true|false
- `is_featured` = true|false
- `search` = (title, description, instructions)
- `ordering` = created_at|order|difficulty|attempts_count|average_score

### Past Paper List Filters:
- `exam` = {exam_id}
- `year` = 2024
- `is_published` = true|false
- `is_free` = true|false
- `search` = (title, description, session)
- `ordering` = created_at|year|order|download_count|view_count

### Enrollment List Filters:
- `exam` = {exam_id}
- `student` = {user_id}
- `status` = active|completed|exam_taken|suspended
- `certificate_issued` = true|false
- `search` = (student email, student name, exam title)
- `ordering` = created_at|completion_date|progress_percentage|mocks_average_score

---

## 8. Summary of Actions for Frontend

### Immediate Actions:

1. **Update URL paths** - Change nested endpoints from underscores to hyphens:
   - `mock_exams` → `mock-exams` ✅
   - `past_papers` → `past-papers` ✅

2. **Update pagination handling**:
   - Access pagination metadata via `response.pagination` (not `response.count`)
   - Access data via `response.results`
   - Add pagination UI with page numbers and page_size selector

3. **Call statistics endpoint**:
   - Implement `GET /api/exams/admin/exams/{id}/statistics/` on exam detail page
   - Display content/assessment/enrollment counts
   - Show breakdowns for courses, mocks, and papers

4. **Update Past Paper form**:
   - Replace single `file` field with 4 fields: `question_paper`, `answer_key`, `marking_scheme`, `solutions_pdf`
   - All are optional, at least one should be provided

5. **Add drill-down navigation**:
   - Course → Modules (`GET .../courses/{id}/modules/`)
   - Module → Lessons (`GET .../modules/{id}/lessons/`)
   - Lesson → Sections & Resources (`GET .../lessons/{id}/sections/`, `.../resources/`)

6. **Add mock exam questions management**:
   - List questions: `GET .../mock-exams/{id}/questions/`
   - Create/edit/delete questions: `POST/PUT/PATCH/DELETE .../mock-exam-questions/{id}/`
   - Reorder questions: `POST .../mock-exam-questions/reorder/`

7. **Add enrollments tab**:
   - Call `GET .../enrollments/?exam={exam_id}`
   - Display student list with status, progress, last accessed

8. **Implement reorder UI**:
   - Add drag-and-drop for courses, modules, lessons, sections, resources, mocks, papers, questions
   - Call appropriate reorder endpoint with new order array

9. **Add filters to exam list**:
   - Status, exam_type, exam_board, featured, is_free, is_published
   - Search bar for title/description/exam_code
   - Sorting dropdown for ordering

10. **Update section create/edit**:
    - Add `quiz_questions` JSONField for quiz sections
    - Add `image_url` field for external image URLs

---

## 9. Testing Quick Reference

**Test Statistics:**
```bash
curl -H "Authorization: Bearer {token}" \
  http://localhost:8000/api/exams/admin/exams/{exam_id}/statistics/
```

**Test Pagination:**
```bash
# Page 2, 50 items per page
curl -H "Authorization: Bearer {token}" \
  "http://localhost:8000/api/exams/admin/exams/?page=2&page_size=50"
```

**Test Filters:**
```bash
# Published secondary exams, sorted by date
curl -H "Authorization: Bearer {token}" \
  "http://localhost:8000/api/exams/admin/exams/?exam_type=secondary&is_published=true&ordering=-exam_date"
```

**Test Nested Lists:**
```bash
# Mock exams for specific exam (NOTE: HYPHEN in URL)
curl -H "Authorization: Bearer {token}" \
  http://localhost:8000/api/exams/admin/exams/{exam_id}/mock-exams/
```

**Test Reorder:**
```bash
curl -X POST -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"course_ids": ["uuid1", "uuid2", "uuid3"]}' \
  http://localhost:8000/api/exams/admin/courses/reorder/
```

---

## 10. Recently Added Fields (Migration Required)

The following fields were **just added** today (March 3, 2026):

### ExamLessonSection model:
- `quiz_questions` (JSONField, default=list, blank=True)
  - Migration: `exams/migrations/0003_examlessonsection_quiz_questions.py`
  - Status: ✅ Applied
  
- `image_url` (URLField, blank=True)
  - Migration: `exams/migrations/0004_examlessonsection_image_url.py`
  - Status: ✅ Applied

**Frontend Action:** Update section create/edit forms to include these fields.

---

**All questions answered. Frontend team can now proceed with implementation!**

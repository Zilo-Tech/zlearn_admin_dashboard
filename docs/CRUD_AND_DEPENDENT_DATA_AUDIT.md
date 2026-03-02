# CRUD Operations & Dependent Data Audit

**Date:** March 1, 2026  
**Purpose:** Verify frontend CRUD operations align with backend API and document dependent data handling.

---

## Executive Summary

| Area | Status | Critical Issues |
|------|--------|-----------------|
| **Courses API** | ✅ Aligned | None – endpoints, field names, and dependent data handling match |
| **Content API** | ✅ Aligned | None – same structure as courses |
| **Exams API** | ❌ **Broken** | Backend has **no admin REST API** for exams – all endpoints will 404 |
| **Users API** | ❌ **Broken** | Wrong path; targets admin users, not students; student admin API does not exist |
| **Dependent Data** | ✅ Correct | Backend CASCADE + frontend cache invalidation aligned |

---

## 1. Exams API – Critical Mismatch

### Backend Reality

The exams app has **no admin REST API**. Management is via Django admin only.

- **Base path:** `/api/exams/` (student-facing only)
- **No `/api/exams/admin/` routes exist**

**Existing exam endpoints (student-facing):**

| Endpoint | Methods | Purpose |
|----------|---------|---------|
| `/api/exams/` | GET | List exams |
| `/api/exams/<slug>/` | GET | Exam detail by slug |
| `/api/exams/<uuid:exam_id>/enroll/` | POST | Enroll |
| `/api/exams/<uuid:exam_id>/courses/` | GET | Exam courses |
| `/api/exams/<uuid:exam_id>/mock-exams/` | GET | Mock exams |
| `/api/exams/<uuid:exam_id>/past-papers/` | GET | Past papers |

**Parent IDs are in the URL path**, not the body. There are no `POST/PATCH/DELETE` admin endpoints for exams, courses, modules, lessons, mock exams, or past papers.

### Frontend Assumption

`examsApi.ts` expects:

- `GET /exams/admin/exams/`
- `POST /exams/admin/exams/`
- `PATCH /exams/admin/exams/:id/`
- `DELETE /exams/admin/exams/:id/`
- `GET /exams/admin/exams/:id/courses/`
- `POST /exams/admin/courses/`
- etc.

**Result:** All these calls will 404.

### Required Backend Changes

To support the dashboard, the backend needs an exams admin REST API (e.g. under `/api/exams/admin/`), with ViewSets for Exam, ExamCourse, ExamModule, ExamLesson, MockExam, PastPaper, etc., similar to courses/content.

---

## 2. Users API – Critical Mismatch

### Backend Reality

**Admin authentication app** (`admin/authentication/urls.py`):

- Mounted at: `path('api/admin/', include('admin.authentication.urls'))`
- Endpoints:
  - `GET/POST /api/admin/users/` – list/create **admin users** (dashboard admins)
  - `GET/PUT/PATCH/DELETE /api/admin/users/<uuid>/` – admin user detail

**Important:** These endpoints manage **admin users**, not students.

**Accounts app** (`accounts/urls.py`):

- Mounted at: `path('api/auth/', include('accounts.urls'))`
- Endpoints for students: register, login, profile, preferences, etc.
- **No admin REST API** for listing/managing student users.

**There is no:**

- `/api/accounts/admin/users/`
- `/api/accounts/admin/enrollments/`
- `/api/admin/users/:id/enrollments/`
- `/api/admin/users/:id/progress/`

Student users and their enrollments/progress are managed via Django admin.

### Frontend Assumption

`usersApi.ts` uses:

- `GET /accounts/admin/users/`
- `GET /accounts/admin/users/:id/`
- `PATCH /accounts/admin/users/:id/`
- `GET /accounts/admin/users/:id/enrollments/`
- `GET /accounts/admin/users/:id/progress/`

**Path mismatch:**

- `/api/accounts/` is not defined in the main URL config.
- Admin users are at `/api/admin/users/`, not `/accounts/admin/users/`.
- Even if the path were correct, that API is for admin users, not students.

**Result:** These calls will 404, and the concept (student admin API) is not implemented on the backend.

### Required Backend Changes

Backend needs a dedicated admin REST API for students, for example:

- `/api/accounts/admin/users/` – list/filter students
- `/api/accounts/admin/users/:id/` – student detail
- `/api/accounts/admin/users/:id/enrollments/` – enrollments
- `/api/accounts/admin/users/:id/progress/` – progress

(or equivalent under `/api/admin/` with clear separation from admin-user management).

---

## 3. Courses API – Aligned

### Endpoints

| Frontend | Backend | Status |
|----------|---------|--------|
| `GET/POST /courses/admin/courses/` | ✅ | Matches |
| `GET/PATCH/DELETE /courses/admin/courses/:id/` | ✅ | Matches |
| `GET/POST /courses/admin/modules/` | ✅ | Matches |
| `GET/POST /courses/admin/lessons/` | ✅ | Matches |
| `GET/POST /courses/admin/sections/` | ✅ | Matches |
| `GET/POST /courses/admin/quiz-questions/` | ✅ | Matches |
| `GET/POST /courses/admin/quiz-options/` | ✅ | Matches |
| `GET/POST /courses/admin/resources/` | ✅ | Matches |
| `POST /courses/admin/modules/reorder/` | ✅ | Matches |
| `POST /courses/admin/lessons/reorder/` | ✅ | Matches |
| `POST /courses/admin/sections/reorder/` | ✅ | Matches |
| `POST /courses/admin/resources/reorder/` | ✅ | Matches |

**Base URL:** `API_BASE_URL` + `/courses/admin/` → `/api/courses/admin/` (correct).

### Query Parameters

| Endpoint | Backend Expects | Frontend Sends | Status |
|----------|-----------------|----------------|--------|
| Modules | `?course=<uuid>` | `params: { course: courseId }` | ✅ |
| Lessons | `?module=<uuid>` | `params: { module: moduleId }` | ✅ |
| Sections | `?lesson=<uuid>` | `params: { lesson: lessonId }` | ✅ |
| Quiz questions | `?section=<uuid>` | `params: { section: sectionId }` | ✅ |
| Resources | `?lesson=<uuid>` | `params: { lesson: lessonId }` | ✅ |

### Parent IDs in Body

Backend expects parent FK in the body for creates:

- Module: `course`
- Lesson: `module`
- Section: `lesson`
- Quiz question: `section`
- Quiz option: implied via nested structure
- Resource: `lesson`

Frontend sends these correctly.

### Field Names (Courses Admin Serializers)

**CourseSection / LessonSectionAdminSerializer:**

- `lesson`, `title`, `section_type`, `order`
- `text_content`, `video_url`, `image_url`, `audio_url`, `code_content`, `file_url`, `pdf_url`, `embed_url`, `embed_code`
- `video_qualities`, `video_subtitles`, `video_duration_seconds`
- `estimated_time_minutes`, `is_required`, `is_downloadable`, `is_published`
- `quiz_questions` (nested)

Frontend section forms use these field names correctly.

**SectionQuizQuestion (nested):**

- `text`, `explanation`, `order`, `points`, `options` (nested)
- `section` omitted when nested (set by backend)

**SectionQuizOption (nested):**

- `text`, `is_correct`, `explanation`, `order`
- `question` omitted when nested (set by backend)

Frontend quiz payload matches this structure.

**LearningResource:**

- `lesson`, `title`, `resource_type`, `file`, `url`, `file_size`, `duration`, `download_allowed`
- `is_required`, `order`, `is_primary`

`LearningResource` interface uses `download_allowed`; display logic uses `download_allowed`. ✅

**Note:** `.env` uses `REACT_APP_API_URL=http://localhost:8000/api` while `coursesApi` fallback is `http://localhost:8001/api`. Confirm the running backend port.

---

## 4. Content API – Aligned

Content app mirrors courses:

- `/api/content/admin/courses/`, `modules/`, `lessons/`, `sections/`, `quiz-questions/`, `quiz-options/`, `resources/`
- Same query params and body structure
- Content-specific fields (e.g. `subject`, `content_type`, `program`, `class_level`) are used correctly in the content UI

No mismatches identified.

---

## 5. Dependent Data Handling

### Backend CASCADE Behavior

**Courses app:**

| Delete | Cascades To |
|--------|-------------|
| Course | Modules → Lessons → Sections → Quiz questions → Options, Enrollments, Reviews, etc. |
| Module | Lessons → Sections → Resources → Quiz questions, etc. |
| Lesson | Sections, Resources, Progress |
| Section | Quiz questions → Options |
| Quiz question | Options |

**Content app:** Same pattern.

**Exams app:** Exam → Courses → Modules → Lessons → Sections → Resources; MockExam → Questions; etc.

### Frontend Cache Invalidation (RTK Query)

**Courses API `invalidatesTags`:**

| Mutation | Invalidates | Effect |
|----------|-------------|--------|
| deleteCourse | `['Course']` | Refetches course list and course detail |
| deleteCourseModule | `['CourseModule', 'Course']` | Refetches modules and course (with nested modules) |
| deleteCourseLesson | `['CourseLesson', 'CourseModule', 'Course']` | Refetches lessons, modules, course |
| deleteCourseSection | `['CourseSection', 'CourseLesson', 'Course']` | Refetches sections, lesson, course |
| deleteSectionQuizQuestion | `['SectionQuizQuestion', 'CourseSection']` | Refetches questions, section |
| createCourseModule | `['CourseModule', 'Course']` | Refetches course (new module) |
| createCourseLesson | `['CourseLesson', 'CourseModule', 'Course']` | Refetches course (new lesson) |
| createCourseSection | `['CourseSection', 'CourseLesson', 'Course']` | Refetches lesson (new section) |

**Rationale:**

- `getCourse(id)` returns course with nested `modules`, each with nested `lessons`, etc.
- Invalidating `Course` triggers refetch of course detail.
- Backend CASCADE removes children on delete; refetch returns the updated tree.

**Conclusion:** Dependent data handling is correct. Deleting a parent refreshes the tree; the UI reflects backend state.

### Potential Edge Cases

1. **Optimistic updates:** We do not optimistically remove deleted items from the cache. We rely on invalidation + refetch. Acceptable and avoids stale nested data.
2. **Concurrent edits:** No special handling; last write wins. Acceptable for current scope.
3. **Orphaned refs:** After delete, navigation or refetch should prevent showing stale IDs. No issues observed in current flows.

---

## 6. Nested Write Payloads

### Section with Quiz (Courses)

**Backend expects (nested):**

```json
{
  "lesson": "uuid",
  "title": "...",
  "section_type": "quiz",
  "order": 1,
  "quiz_questions": [
    {
      "text": "...",
      "explanation": "...",
      "order": 1,
      "points": 1,
      "options": [
        { "text": "...", "is_correct": false, "order": 1 },
        { "text": "...", "is_correct": true, "order": 2 }
      ]
    }
  ]
}
```

Frontend `SectionCreateModal` / `SectionEditModal` send this structure. `section` and `question` are not included in nested objects; backend sets them. ✅

### Quiz Question Update (Standalone)

When updating a quiz question via `PATCH /courses/admin/quiz-questions/:id/`:

- Backend `SectionQuizQuestionAdminSerializer` supports `options` as nested.
- On update, backend replaces options: `instance.options.all().delete()` then recreates from `options_data`.

Our `coursesApi` sends the full question payload including `options` when updating. ✅

---

## 7. Recommendations

### Immediate (Blocking)

1. **Exams:** Add admin REST API for exams in the backend (or document that exams management stays in Django admin and hide/disable dashboard exams UI until API exists).
2. **Users:** Add admin REST API for students (list, detail, enrollments, progress) or clearly scope the Users page to admin users only and fix paths to `/api/admin/users/`.

### Short Term

3. **Base URL:** Align `API_BASE_URL` fallback in `coursesApi`/`contentApi` with `.env` (e.g. 8000 vs 8000).
4. **Error handling:** Add clear user feedback when exams/users API calls 404 (e.g. “Exams admin API not available” or “Student management API not configured”).

### Nice to Have

5. **API schema:** Use OpenAPI/Swagger (`/api/schema/`, `/api/docs/`) to validate request/response shapes.
6. **Integration tests:** Automated tests for CRUD + invalidation for courses and content.

---

## 8. Verification Checklist

Before production:

- [ ] Backend exams admin API implemented and wired, OR exams UI disabled/redirected
- [ ] Backend student admin API implemented, OR users page scoped to admin users with correct `/api/admin/users/` paths
- [ ] All courses CRUD flows tested (create/update/delete course, module, lesson, section, quiz, resource)
- [ ] All content CRUD flows tested
- [ ] Dependent data: delete course → modules/lessons gone; delete module → lessons gone; UI refetches correctly
- [ ] `REACT_APP_API_URL` and API base URL fallbacks use the same host/port
- [ ] 404 handling for missing APIs shows clear messages to admins

---

## 9. File Reference

| Purpose | Path |
|---------|------|
| Backend root URLs | `zlearnproject/zlearnproject/urls.py` |
| Courses admin URLs | `courses/urls_admin.py` |
| Courses admin serializers | `courses/serializers_admin.py` |
| Content admin URLs | `content/urls_admin.py` |
| Content admin serializers | `content/serializers_admin.py` |
| Exams URLs | `exams/urls.py` |
| Admin auth URLs | `admin/authentication/urls.py` |
| Frontend courses API | `src/store/api/coursesApi.ts` |
| Frontend content API | `src/store/api/contentApi.ts` |
| Frontend exams API | `src/store/api/examsApi.ts` |
| Frontend users API | `src/store/api/usersApi.ts` |

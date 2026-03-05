# Exams Admin: Frontend Gaps & Backend Clarifications

**Purpose:** Align exam package management with the level of Academic/Content flows. Based on `EXAMS_ADMIN_DASHBOARD_API.md`.

**Implemented (from doc + EXAMS_ADMIN_BACKEND_RESPONSES.md):**
- Exam-scoped lists use **hyphens** (backend confirmed): `mock-exams`, `past-papers`.
- `GET /api/exams/admin/exams/{exam_id}/statistics/` — used on Exam Detail overview.
- `GET /api/exams/admin/exams/{exam_id}/enrollments/` — Enrollments tab on Exam Detail.
- Exam list: filters (status, exam_type, search), **pagination** (response.pagination + response.results; page, page_size).
- Past paper form: four file fields `question_paper`, `answer_key`, `marking_scheme`, `solutions_pdf` (no single file/file_url).
- Reorder endpoints: courses, modules, lessons, sections, resources, mock exams, past papers, mock questions (hooks in examsApi).

---

## 1. Backend responses applied (from EXAMS_ADMIN_BACKEND_RESPONSES.md)

### 1.1 Nested list URLs

**Backend:** Use **hyphens**. Frontend uses:

- `GET .../exams/{exam_id}/mock-exams/`
- `GET .../exams/{exam_id}/past-papers/`

### 1.2 Pagination

Backend returns:

```json
{
  "pagination": { "count", "total_pages", "current_page", "page_size", "has_next", "has_previous", "next_page", "previous_page" },
  "results": [...]
```

Frontend: `getExams` uses `transformPaginatedResponse`; consumers use `data.results` and `data.pagination`. Exams list page sends `page` and `page_size` (default 20) and shows Previous/Next when `total_pages > 1`.

---

## 2. Backend endpoints we don’t call yet (need to exist)

These are in the doc; we need confirmation they are implemented and stable.

| Endpoint | Purpose |
|----------|--------|
| `GET /api/exams/admin/exams/{exam_id}/statistics/` | Dashboard stats (content counts, assessments, enrollments, engagement, breakdown) |
| `GET /api/exams/admin/courses/{course_id}/modules/` | Modules for a course (we have create/update/delete module, but no “list modules for course” in UI) |
| `GET /api/exams/admin/modules/{module_id}/lessons/` | Lessons for a module |
| `GET /api/exams/admin/lessons/{lesson_id}/sections/` | Sections for a lesson |
| `GET /api/exams/admin/lessons/{lesson_id}/resources/` | Resources for a lesson |
| `GET /api/exams/admin/mock-exams/{mock_exam_id}/questions/` | Questions for a mock exam |
| `GET /api/exams/admin/enrollments/?exam={exam_id}` | Enrollments for an exam (or global list with filter) |
| `POST /api/exams/admin/courses/reorder/` | Reorder courses |
| `POST /api/exams/admin/mock-exams/reorder/` | Reorder mock exams |
| `POST /api/exams/admin/past-papers/reorder/` | Reorder past papers |
| `POST /api/exams/admin/modules/reorder/` | Reorder modules (if present in doc) |
| `POST /api/exams/admin/lessons/reorder/` | Reorder lessons (if present in doc) |
| `POST /api/exams/admin/mock-exam-questions/reorder/` | Reorder mock questions |

**Ask backend:** Confirm which of these are live and whether any path (e.g. reorder) differs from the doc.

---

## 3. Frontend gaps (to match doc and Academic/Content flows)

### 3.1 Exam detail page – statistics & overview

- **Missing:** Call to `GET .../exams/{id}/statistics/` and an overview card showing:
  - Content: courses, modules, lessons, sections, resources
  - Assessments: mock exams, mock questions, past papers
  - Enrollments: total, active, completed
  - Engagement: attempts, average score, completion rate
- **Reference:** Doc § 1.10 and § 7.1; “Dashboard Usage Guide”.

### 3.2 Exam detail – drill-down (Course → Module → Lesson → Section/Resource)

Academic/Content flows allow drilling: Course → Modules → Lessons → Sections/Resources. For exams we currently have:

- Exam detail tabs: Overview, Subjects (courses), Mocks, Papers.
- Subjects: list + add/edit/delete course only. No drill-down into modules/lessons/sections/resources.

**Missing (to be on par with Content):**

- For each **course:** list modules (using `GET .../courses/{course_id}/modules/` or equivalent).
- For each **module:** list lessons (`GET .../modules/{module_id}/lessons/`).
- For each **lesson:** list sections and resources (`GET .../lessons/{id}/sections/`, `.../resources/`).
- UI to add/edit/delete modules, lessons, sections, resources (and reorder if backend supports it).

### 3.3 Mock exams – questions

- **Current:** We list mock exams and can add/delete them. We do not list or manage **questions** inside a mock exam.
- **Missing:**
  - Call `GET .../mock-exams/{id}/questions/`.
  - UI to view/add/edit/delete/reorder mock exam questions (and optionally link to `exam_course` if the API requires it).

### 3.4 Past papers – fields and upload

- Doc shows past paper with `session`, `file` or `file_url`, `total_marks`, `duration_minutes`, `year`, `title`, etc. Our create form may not match all fields (e.g. `session`, single `file` vs question_paper/answer_key/marking_scheme).
- **Clarify with backend:** Exact request shape for create/update (JSON vs multipart, which file fields are required).

### 3.5 Enrollments

- **Missing:** Any use of `GET /api/exams/admin/enrollments/?exam=...` (e.g. an “Enrollments” tab or section on exam detail showing students, status, progress, last accessed).

### 3.6 Reorder

- **Missing:** Reorder UI (and API calls) for:
  - Courses within an exam
  - Mock exams within an exam
  - Past papers within an exam
  - (If we add drill-down) modules, lessons, and mock questions.

### 3.7 Exam list page

- **Missing:** Filters (by status, exam_type, exam_board, featured, is_free, etc.) and search as in the doc.
- **Optional:** Pagination if backend is paginated.

---

## 4. Summary: what we need from backend

1. **Confirm URL style** for exam-scoped lists: `mock_exams`/`past_papers` (underscore) vs `mock-exams`/`past-papers` (hyphen).
2. **Confirm** that `GET /api/exams/admin/exams/{exam_id}/statistics/` is implemented and returns the structure in the doc (§ 1.10).
3. **Confirm** list/reorder endpoints for courses, modules, lessons, sections, resources, mock-exams, past-papers, mock-exam-questions (and exact paths).
4. **Confirm** enrollments endpoint and query params (`exam`, `student`, `status`, etc.).
5. **Confirm** pagination (and default page size) for list endpoints we will use.
6. **Confirm** request/response shape for past paper create/update (including file fields and optional `file_url`).

Once these are confirmed, we can implement the statistics call, drill-down (courses → modules → lessons → sections/resources), mock exam questions management, enrollments tab, reorder actions, and filters on the exam list to bring exam package management in line with the doc and the academic/content flows.

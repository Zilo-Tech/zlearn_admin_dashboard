# Course Management Admin API - Quick Reference

**Base URL:** `/api/courses/admin/`  
**Auth:** Staff or Course Instructor  
**Date:** March 1, 2026

---

## Hierarchy & Dependencies

```
Course
  ├── Modules
       ├── Lessons
            ├── Sections
            │    └── Quiz Questions
            │         └── Quiz Options
            └── Resources
```

**Critical:** Parent ID required in request body for all creates.

---

## Quick Reference Table

| Entity | Endpoint | Depends On | Parent Field | Query Filter |
|--------|----------|------------|--------------|--------------|
| **Course** | `/courses/` | - | - | - |
| **Module** | `/modules/` | Course | `course` | `?course=<uuid>` |
| **Lesson** | `/lessons/` | Module | `module` | `?module=<uuid>` |
| **Section** | `/sections/` | Lesson | `lesson` | `?lesson=<uuid>` |
| **Quiz Question** | `/quiz-questions/` | Section | `section` | `?section=<uuid>` |
| **Quiz Option** | `/quiz-options/` | Question | `question` | `?question=<uuid>` |
| **Resource** | `/resources/` | Lesson | `lesson` | `?lesson=<uuid>` |
| **Category** | `/categories/` | - | - | - |

---

## Core Endpoints

### 1. Courses `/courses/`

#### List/Create
```http
GET    /courses/admin/courses/          # List all
POST   /courses/admin/courses/          # Create new
GET    /courses/admin/courses/:id/      # Get detail (includes nested modules)
PATCH  /courses/admin/courses/:id/      # Update
DELETE /courses/admin/courses/:id/      # Delete (cascades to all children)
```

#### Actions
```http
POST /courses/admin/courses/:id/duplicate/  # Duplicate with content
```

#### Required Fields (Create)
```json
{
  "title": "string",
  "description": "string",
  "level": "beginner|intermediate|advanced",
  "status": "draft|published|archived"
}
```

#### Optional (Auto-assigned if missing)
- `instructor` → Current user
- `slug` → Generated from title
- `course_code` → Auto-generated

#### Key Fields
- `modules` - Nested in detail view (read-only)
- `is_free` - If true, `price` ignored
- `tags` - Array of strings
- `featured` - Boolean for homepage display

#### Filters
`?status=published&level=beginner&category=<uuid>&instructor=<uuid>&featured=true`

---

### 2. Modules `/modules/`

#### Endpoints
```http
GET    /courses/admin/modules/              # List (filter by course)
POST   /courses/admin/modules/              # Create
GET    /courses/admin/modules/:id/          # Detail (includes nested lessons)
PATCH  /courses/admin/modules/:id/          # Update
DELETE /courses/admin/modules/:id/          # Delete (cascades to lessons)
POST   /courses/admin/modules/reorder/      # Reorder
```

#### Required Fields
```json
{
  "course": "uuid",           // MUST match query param or explicit
  "title": "string",
  "order": 0
}
```

#### Reorder
```json
POST /courses/admin/modules/reorder/
{
  "modules": [
    {"id": "uuid", "order": 0},
    {"id": "uuid", "order": 1}
  ]
}
```

#### Usage Pattern
```javascript
// 1. Create course → get course.id
// 2. Create modules with course.id
GET /courses/admin/modules/?course={courseId}
POST /courses/admin/modules/ { "course": courseId, ... }
```

---

### 3. Lessons `/lessons/`

#### Endpoints
```http
GET    /courses/admin/lessons/              # List (filter by module)
POST   /courses/admin/lessons/              # Create
GET    /courses/admin/lessons/:id/          # Detail (includes sections & resources)
PATCH  /courses/admin/lessons/:id/          # Update
DELETE /courses/admin/lessons/:id/          # Delete (cascades to sections)
POST   /courses/admin/lessons/reorder/      # Reorder
POST   /courses/admin/lessons/:id/duplicate/ # Duplicate lesson
```

#### Required Fields
```json
{
  "module": "uuid",
  "title": "string",
  "lesson_type": "video|reading|quiz|assignment|practical",
  "order": 0
}
```

#### Key Fields
- `sections` - Nested array (read-only on GET)
- `resources` - Nested array (read-only on GET)
- `is_preview` - Allow non-enrolled users to view
- `requires_completion` - Block next lesson until complete

#### Duplicate Example
```json
POST /courses/admin/lessons/:id/duplicate/
{
  "target_module": "uuid",              // Optional, defaults to same module
  "include_sections": true,
  "include_quiz_questions": true,
  "include_resources": true
}
```

---

### 4. Sections `/sections/`

#### Endpoints
```http
GET    /courses/admin/sections/              # List (filter by lesson)
POST   /courses/admin/sections/              # Create
GET    /courses/admin/sections/:id/          # Detail (includes quiz questions)
PATCH  /courses/admin/sections/:id/          # Update
DELETE /courses/admin/sections/:id/          # Delete (cascades to quiz)
POST   /courses/admin/sections/reorder/      # Reorder
```

#### Required Fields
```json
{
  "lesson": "uuid",
  "title": "string",
  "section_type": "text|video|image|audio|code|pdf|embed|quiz|combined",
  "order": 0
}
```

#### Section Types & Content Fields

| Type | Required Content Field | Notes |
|------|----------------------|-------|
| `text` | `text_content` | Rich text/markdown |
| `video` | `video_url` OR `video_file` | Supports qualities, subtitles |
| `image` | `image` OR `image_url` | With optional caption |
| `audio` | `audio_url` OR `audio_file` | Duration tracking |
| `code` | `code_content`, `code_language` | Syntax highlighting |
| `pdf` | `pdf_file` OR `pdf_url` | Downloadable/viewable |
| `embed` | `embed_url` OR `embed_code` | YouTube, Vimeo, etc. |
| `quiz` | `quiz_questions` (nested) | See quiz structure below |
| `combined` | `combined_content` (JSON) | Multiple content types |

#### Create Section with Quiz (Nested)
```json
POST /courses/admin/sections/
{
  "lesson": "uuid",
  "title": "Module 1 Quiz",
  "section_type": "quiz",
  "order": 5,
  "quiz_questions": [
    {
      "text": "What is 2+2?",
      "explanation": "Basic math",
      "order": 1,
      "points": 10,
      "options": [
        { "text": "3", "is_correct": false, "order": 1 },
        { "text": "4", "is_correct": true, "order": 2 },
        { "text": "5", "is_correct": false, "order": 3 }
      ]
    }
  ]
}
```

**⚠️ Important:** When updating, sending `quiz_questions` replaces ALL existing questions.

---

### 5. Quiz Questions `/quiz-questions/`

#### Endpoints
```http
GET    /courses/admin/quiz-questions/       # List (filter by section)
POST   /courses/admin/quiz-questions/       # Create
GET    /courses/admin/quiz-questions/:id/   # Detail (includes options)
PATCH  /courses/admin/quiz-questions/:id/   # Update
DELETE /courses/admin/quiz-questions/:id/   # Delete (cascades to options)
```

#### Required Fields
```json
{
  "section": "uuid",
  "text": "Question text",
  "order": 1,
  "points": 10,
  "options": [                               // Nested creation
    {
      "text": "Option A",
      "is_correct": false,
      "order": 1
    },
    {
      "text": "Option B",
      "is_correct": true,
      "order": 2
    }
  ]
}
```

**Note:** Options are nested. On update, replaces all existing options.

---

### 6. Quiz Options `/quiz-options/`

Use this endpoint ONLY for standalone option management. Prefer nested structure in quiz questions.

```http
GET    /courses/admin/quiz-options/         # List (filter by question)
POST   /courses/admin/quiz-options/         # Create
PATCH  /courses/admin/quiz-options/:id/     # Update
DELETE /courses/admin/quiz-options/:id/     # Delete
```

---

### 7. Resources `/resources/`

#### Endpoints
```http
GET    /courses/admin/resources/            # List (filter by lesson)
POST   /courses/admin/resources/            # Create
GET    /courses/admin/resources/:id/        # Detail
PATCH  /courses/admin/resources/:id/        # Update
DELETE /courses/admin/resources/:id/        # Delete
POST   /courses/admin/resources/reorder/    # Reorder
```

#### Required Fields
```json
{
  "lesson": "uuid",
  "title": "string",
  "resource_type": "pdf|video|document|link|archive|other",
  "order": 0
}
```

#### Resource Types

| Type | Typical Fields |
|------|---------------|
| `pdf` | `file`, `download_allowed` |
| `video` | `url` OR `file`, `duration` |
| `document` | `file`, `file_size` |
| `link` | `url`, `text_content` (description) |

#### Key Fields
- `download_allowed` - Boolean
- `is_required` - If true, must access before completion
- `is_primary` - Main resource for lesson
- `metadata` - JSON field for custom data

---

### 8. Categories `/categories/`

```http
GET    /courses/admin/categories/           # List all
POST   /courses/admin/categories/           # Create
PATCH  /courses/admin/categories/:id/       # Update
DELETE /courses/admin/categories/:id/       # Delete
```

#### Fields
```json
{
  "name": "string",
  "description": "string",
  "icon": "icon-name",                      // Optional
  "color": "#hex",                          // Optional
  "sort_order": 0
}
```

---

## Workflow Examples

### Create Complete Course Structure

```javascript
// 1. Create Course
POST /courses/admin/courses/
{ "title": "Python 101", "level": "beginner", "status": "draft" }
→ Returns { id: "course-uuid", ... }

// 2. Create Module
POST /courses/admin/modules/
{ "course": "course-uuid", "title": "Introduction", "order": 0 }
→ Returns { id: "module-uuid", ... }

// 3. Create Lesson
POST /courses/admin/lessons/
{ "module": "module-uuid", "title": "What is Python?", "lesson_type": "video", "order": 0 }
→ Returns { id: "lesson-uuid", ... }

// 4. Create Video Section
POST /courses/admin/sections/
{ 
  "lesson": "lesson-uuid", 
  "title": "Intro Video",
  "section_type": "video",
  "video_url": "https://...",
  "order": 0
}

// 5. Create Quiz Section (with questions)
POST /courses/admin/sections/
{
  "lesson": "lesson-uuid",
  "title": "Knowledge Check",
  "section_type": "quiz",
  "order": 1,
  "quiz_questions": [
    {
      "text": "What is Python?",
      "order": 1,
      "points": 5,
      "options": [
        { "text": "Programming language", "is_correct": true, "order": 1 },
        { "text": "Snake", "is_correct": false, "order": 2 }
      ]
    }
  ]
}

// 6. Add Resource
POST /courses/admin/resources/
{
  "lesson": "lesson-uuid",
  "title": "Python Cheat Sheet",
  "resource_type": "pdf",
  "file": <file>,
  "download_allowed": true,
  "order": 0
}
```

### Update Course with Modules

```javascript
// Get course with nested modules
GET /courses/admin/courses/:id/
→ Returns {
  id: "uuid",
  title: "Python 101",
  modules: [
    {
      id: "module-uuid",
      title: "Introduction",
      lessons: [...]
    }
  ]
}

// Update just the course
PATCH /courses/admin/courses/:id/
{ "title": "Python 101 - Updated" }
// Modules remain unchanged

// To update module, use module endpoint
PATCH /courses/admin/modules/module-uuid/
{ "title": "Getting Started" }
```

---

## Important Behaviors

### Cascade Deletes

| Delete | Cascades To |
|--------|-------------|
| Course | → Modules → Lessons → Sections → Questions → Options & Resources |
| Module | → Lessons → Sections → Questions → Options & Resources |
| Lesson | → Sections → Questions → Options & Resources |
| Section | → Questions → Options |
| Question | → Options |

**⚠️ Warning:** No confirmation. Deleted items are gone permanently.

### Auto-assignment

- **Course:** `instructor` defaults to current user
- **Course:** `slug` auto-generated from title
- All entities: `order` defaults to 0 if not specified

### Read-only Fields

Never send these in POST/PATCH (ignored or cause errors):
- `id`, `created_at`, `updated_at`
- `slug` (courses/categories)
- `current_enrollments`, `rating`, `total_ratings` (courses)
- `section_count`, `resource_count`, `lesson_count`, `module_count`

### Nested Data

**On GET (Detail):**
- Courses include nested `modules`
- Modules include nested `lessons`
- Lessons include nested `sections` and `resources`
- Sections include nested `quiz_questions`
- Questions include nested `options`

**On POST/PATCH:**
- Only sections and quiz questions accept nested creates
- Use nested structure for quiz questions + options
- For other relationships, create separately via their endpoints

---

## Common Patterns

### Get All Data for Course Edit

```javascript
// Option 1: Single request (includes everything)
GET /courses/admin/courses/:id/

// Option 2: Fetch specific module
GET /courses/admin/modules/:moduleId/

// Option 3: Fetch by filtering
GET /courses/admin/lessons/?module=<uuid>
GET /courses/admin/sections/?lesson=<uuid>
```

### Reorder Items

```javascript
// Works for: modules, lessons, sections, resources
POST /courses/admin/modules/reorder/
{
  "modules": [
    { "id": "uuid-1", "order": 0 },
    { "id": "uuid-2", "order": 1 },
    { "id": "uuid-3", "order": 2 }
  ]
}
```

### Get Nested vs. Filtered Lists

```javascript
// Nested (detail view): pre-filtered, includes related data
GET /courses/admin/courses/:id/
→ course.modules[].lessons[]

// Filtered (list view): all items, requires filtering
GET /courses/admin/lessons/?module=<uuid>
→ [...] (plain array, no nesting)
```

---

## Permissions

**Staff:** Full access to all courses  
**Instructor:** Access only to courses where `instructor` = current user

### Permission Inheritance
- Module → Checks module.course.instructor
- Lesson → Checks lesson.module.course.instructor
- Section → Checks section.lesson.module.course.instructor

---

## Error Patterns

### 400 Bad Request
- Missing required field
- Invalid parent ID (e.g., `course` UUID doesn't exist)
- Invalid enum value (e.g., `level: "expert"` when only beginner/intermediate/advanced allowed)

### 403 Forbidden
- Not staff AND not course instructor

### 404 Not Found
- Item doesn't exist
- Item exists but you don't have permission

---

## Filtering & Search

### All Endpoints Support
- **Ordering:** `?ordering=-created_at` (prefix `-` for descending)
- **Search:** `?search=<term>` (searches relevant text fields)

### Entity-Specific Filters

**Courses:**
```
?status=published
&level=beginner
&category=<uuid>
&instructor=<uuid>
&featured=true
&is_free=true
```

**Modules:**
```
?course=<uuid>
&is_published=true
&difficulty=intermediate
```

**Lessons:**
```
?module=<uuid>
&lesson_type=video
&difficulty=beginner
&is_published=true
&is_preview=true
```

**Sections:**
```
?lesson=<uuid>
&section_type=quiz
&is_published=true
&is_required=true
```

**Resources:**
```
?lesson=<uuid>
&resource_type=pdf
&is_primary=true
&is_required=true
```

---

## Quick Checklist

### Before Creating
- [ ] Parent entity exists (course → module → lesson → section)
- [ ] Parent ID is in request body
- [ ] All required fields provided
- [ ] Enum values are valid (check allowed choices)

### Before Updating
- [ ] Item exists and you have permission
- [ ] Not sending read-only fields
- [ ] File fields handled correctly (multipart/form-data if uploading)

### Before Deleting
- [ ] Aware of cascade effects
- [ ] Have backup if needed (use duplicate endpoint first)

---

## Response Formats

### List Response (Array)
```json
[
  { "id": "uuid", "title": "...", ... },
  { "id": "uuid", "title": "...", ... }
]
```

### Detail Response (Object with Nested Data)
```json
{
  "id": "uuid",
  "title": "Course Title",
  "modules": [
    {
      "id": "module-uuid",
      "title": "Module Title",
      "lessons": [
        {
          "id": "lesson-uuid",
          "title": "Lesson Title",
          "sections": [...],
          "resources": [...]
        }
      ]
    }
  ]
}
```

### Action Response
```json
{ "status": "success message" }
```

---

## Testing Endpoints

Use built-in API docs:
- **Swagger:** `http://localhost:8000/api/docs/`
- **ReDoc:** `http://localhost:8000/api/redoc/`
- **Schema:** `http://localhost:8000/api/schema/`

Or use curl:
```bash
# List courses
curl -H "Authorization: Bearer <token>" \
  http://localhost:8000/api/courses/admin/courses/

# Create module
curl -X POST \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"course":"uuid","title":"Intro","order":0}' \
  http://localhost:8000/api/courses/admin/modules/
```

---

**End of Guide** - For exam endpoints, see [ADMIN_API_IMPLEMENTATION.md](ADMIN_API_IMPLEMENTATION.md)

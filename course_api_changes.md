# Course Creation Workflow - Frontend Guide

This document explains the step-by-step workflow for creating a course in the content management dashboard.

---

## Overview

When creating a course, you need to:
1. Select a **Subject** (required)
2. Optionally select a **Program** (if course is tied to a specific program)
3. If Program is selected, optionally select a **Curriculum** (must belong to the program)
4. Optionally select a **Class Level** (if course is for a general class level, not tied to a program)
5. Optionally set **Exam System** (for filtering, independent of program/curriculum)

---

## Step-by-Step Workflow

### Step 1: Get Available Subjects

**Endpoint:**
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
    "icon": "📐",
    "color": "#FF5733"
  }
]
```

**Usage:** Populate the subject dropdown (required field)

---

### Step 2: Get Programs (Optional)

**Endpoint:**
```
GET /api/education/admin/programs/
```

**Query Parameters:**
- `school` - Filter by school ID
- `faculty` - Filter by faculty ID
- `class_level` - Filter by class level ID
- `is_active` - Filter by active status

**Response:**
```json
[
  {
    "id": "bachelor-year-1",
    "name": "Bachelor Year 1",
    "school": {...},
    "faculty": {...},
    "class_level": {...},
    "degree": "Bachelor of Engineering",
    "duration": "4 years",
    "is_active": true
  }
]
```

**Usage:** 
- Show program dropdown (optional)
- Only show if user wants to link course to a specific program

---

### Step 3: Get Curricula for Selected Program

**When:** User selects a program

**Endpoint (Admin):**
```
GET /api/education/admin/curricula/?program={program_id}
```

**Endpoint (Public - Alternative):**
```
GET /api/education/program/{program_id}/curricula/
```

**Response:**
```json
[
  {
    "id": "curriculum-uuid",
    "name": "Form 1 Curriculum",
    "program": "program-uuid",
    "year": 1,
    "semester": "both",
    "subjects": ["Mathematics", "Physics", "Chemistry"],
    "description": "...",
    "is_active": true
  }
]
```

**Usage:**
- Populate curriculum dropdown (optional)
- Only show if a program is selected
- **Important:** Curriculum must belong to the selected program

---

### Step 4: Get Class Levels (Optional - Alternative to Program)

**When:** User wants to create a course for a general class level (not tied to a specific program)

**Endpoint:**
```
GET /api/education/admin/class-levels/
```

**Query Parameters:**
- `school` - Filter by school ID
- `education_level` - Filter by education level ID
- `is_active` - Filter by active status

**Response:**
```json
[
  {
    "id": "form-1",
    "name": "Form 1",
    "school": {...},
    "education_level": {...},
    "order": 1,
    "is_active": true
  }
]
```

**Usage:**
- Show class level dropdown (optional)
- Use this if course is NOT tied to a specific program
- **Note:** If program is selected and has a class_level, the course's class_level should match

---

### Step 5: Create the Course

**Endpoint:**
```
POST /api/content/admin/courses/
```

**Request Body:**
```json
{
  "code": "MATH_FORM1",
  "title": "Mathematics Form 1",
  "description": "Complete mathematics course for Form 1",
  "subject": "subject-uuid",              // REQUIRED
  "program": "program-uuid",              // Optional
  "class_level": "class-level-uuid",      // Optional
  "curriculum": "curriculum-uuid",        // Optional (requires program)
  "exam_system": "GCE_OL",               // Optional (for filtering)
  "course_type": "regular",
  "difficulty": "beginner",
  "estimated_hours": 40,
  "priority_order": 10,
  "is_published": false,
  "is_free": true,
  "exam_board": "WAEC",
  "exam_year": 2024,
  "passing_score": 50,
  "exam_format": "Multiple Choice",
  "learning_objectives": ["objective1", "objective2"],
  "tags": ["tag1", "tag2"]
}
```

**Validation Rules:**
- ✅ `subject` is **required**
- ✅ If `curriculum` is set, `program` **must** also be set
- ✅ If `curriculum` is set, it **must** belong to the selected `program`
- ✅ If `program` has a `class_level`, the course's `class_level` should match (if both are set)

**Error Responses:**

**If curriculum is set without program:**
```json
{
  "curriculum": ["Curriculum requires a program to be specified."]
}
```

**If curriculum doesn't belong to program:**
```json
{
  "curriculum": ["Curriculum must belong to the specified program."]
}
```

---

## Complete Frontend Flow Example

### Scenario 1: Course with Program and Curriculum

```javascript
// 1. User selects subject
const subject = "math-uuid";

// 2. User selects program
const program = "bachelor-year-1";

// 3. Fetch curricula for selected program
const curricula = await fetch(
  `/api/education/admin/curricula/?program=${program}`
).then(r => r.json());

// 4. User selects curriculum from the list
const curriculum = curricula[0].id;

// 5. Create course
const course = await fetch('/api/content/admin/courses/', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    subject,
    program,
    curriculum,
    title: "Mathematics Course",
    // ... other fields
  })
});
```

### Scenario 2: Course for General Class Level (No Program)

```javascript
// 1. User selects subject
const subject = "math-uuid";

// 2. User selects class level (no program)
const classLevel = "form-1";

// 3. Optionally set exam system
const examSystem = "GCE_OL";

// 4. Create course
const course = await fetch('/api/content/admin/courses/', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    subject,
    class_level: classLevel,
    exam_system: examSystem,
    title: "Mathematics Course",
    // ... other fields
  })
});
```

### Scenario 3: Course with Program Only (No Specific Curriculum)

```javascript
// 1. User selects subject
const subject = "math-uuid";

// 2. User selects program
const program = "bachelor-year-1";

// 3. User doesn't select curriculum (optional)

// 4. Create course
const course = await fetch('/api/content/admin/courses/', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    subject,
    program,
    // curriculum is optional
    title: "Mathematics Course",
    // ... other fields
  })
});
```

---

## UI/UX Recommendations

### Form Layout

```
┌─────────────────────────────────────┐
│ Create New Course                   │
├─────────────────────────────────────┤
│ Subject * [Dropdown ▼]              │
│                                     │
│ Link to Program? [ ] Yes            │
│                                     │
│ ┌─ If Yes ───────────────────────┐ │
│ │ Program [Dropdown ▼]           │ │
│ │                                 │ │
│ │ Curriculum [Dropdown ▼]        │ │
│ │ (filtered by program)           │ │
│ └─────────────────────────────────┘ │
│                                     │
│ OR                                  │
│                                     │
│ ┌─ If No Program ─────────────────┐ │
│ │ Class Level [Dropdown ▼]        │ │
│ └─────────────────────────────────┘ │
│                                     │
│ Exam System [Text Input]            │
│ (e.g., GCE_OL, WAEC)               │
│                                     │
│ [Other course fields...]            │
│                                     │
│ [Create Course]                     │
└─────────────────────────────────────┘
```

### Dynamic Behavior

1. **When Program is Selected:**
   - Show curriculum dropdown
   - Fetch and populate curricula: `GET /api/education/admin/curricula/?program={program_id}`
   - Hide/disable class level dropdown (or show warning if program has class_level)

2. **When Program is NOT Selected:**
   - Hide curriculum dropdown
   - Show class level dropdown (optional)
   - Allow exam_system input

3. **When Curriculum is Selected:**
   - Validate that curriculum belongs to selected program
   - Show curriculum name for confirmation

4. **Form Validation:**
   - Subject is required
   - If curriculum is set, program must be set
   - Show clear error messages for validation failures

---

## API Endpoints Summary

| Purpose | Endpoint | Method |
|---------|----------|--------|
| Get subjects | `/api/content/admin/subjects/` | GET |
| Get programs | `/api/education/admin/programs/` | GET |
| Get curricula by program | `/api/education/admin/curricula/?program={id}` | GET |
| Get class levels | `/api/education/admin/class-levels/` | GET |
| Create course | `/api/content/admin/courses/` | POST |

---

## Quick Reference

**Required Fields:**
- `subject` - Must select a subject

**Optional Fields:**
- `program` - Link to a program
- `curriculum` - Link to a curriculum (requires program)
- `class_level` - Link to a class level (if no program)
- `exam_system` - Exam system identifier (string)

**Validation:**
- Curriculum requires Program
- Curriculum must belong to Program
- Class Level should match Program's Class Level (if both set)

---

## Related Documentation

- [Course Management Dashboard API](./COURSE_MANAGEMENT_DASHBOARD.md)
- [Education Management Dashboard API](./EDUCATION_MANAGEMENT_DASHBOARD.md)
- [Course API Changes](./COURSE_API_CHANGES.md)


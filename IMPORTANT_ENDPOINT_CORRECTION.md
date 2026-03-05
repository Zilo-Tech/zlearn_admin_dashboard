# ⚠️ CRITICAL: Import Endpoint Correction

**Date:** March 2, 2026  
**For:** Frontend/Web Development Team  
**Priority:** HIGH - Action Required

---

## 🚨 Issue Summary

**MISTAKE IDENTIFIED:**  
Initially, only ONE import endpoint was documented: `/api/courses/admin/courses/import_course/`

**PROBLEM:**  
ZLearn has **THREE SEPARATE COURSE SYSTEMS** with different database models and purposes. Using the wrong endpoint will:
- ❌ Import courses to the wrong database table
- ❌ Make courses invisible in the correct admin section
- ❌ Cause data structure mismatches
- ❌ Require manual deletion and re-import

---

## ✅ CORRECT Architecture: 3 Separate Import Systems

### 1. **COURSES APP** - Professional Development 💼
**Endpoint:** `POST /api/courses/admin/courses/import_course/`  
**Database Model:** `courses.Course`  
**Admin Section:** "COURSES" → "Courses"

**Use For:**
- ✅ Professional development courses (Web Development, UI/UX Design)
- ✅ Certification programs (AWS, Google Cloud, CompTIA)
- ✅ Hobby/personal interest courses (Photography, Cooking)
- ✅ Bootcamp-style exam prep (Generic test prep courses)

**Sample JSON:** `course_import_system/templates/sample_professional_course.json`

**Example Courses:**
- Python Full Stack Developer Bootcamp
- AWS Solutions Architect Certification
- Digital Marketing Masterclass
- Mobile App Development with Flutter

---

### 2. **CONTENT APP** - Academic/Educational 🎓
**Endpoint:** `POST /api/content/admin/courses/import_course/`  
**Database Model:** `content.Course`  
**Admin Section:** "CONTENT" → "Courses"

**Use For:**
- ✅ School curriculum courses (Form 1 Math, Grade 10 Physics)
- ✅ University courses (Calculus I, Organic Chemistry)
- ✅ Single-subject exam prep (JAMB Mathematics, SAT Math)
- ✅ Review and revision courses
- ✅ Advanced academic topics

**Sample JSON:** `course_import_system/templates/sample_content_academic_course.json`

**Example Courses:**
- Mathematics - Form 1 (GCE O-Level)
- Physics - University Year 1
- Chemistry for JAMB UTME
- Advanced Calculus Topics

**Key Fields:**
- `subject` (auto-creates if doesn't exist)
- `class_level` (Form 1, Grade 10, etc.)
- `exam_system` (GCE_OL, WAEC, BACCALAUREAT)
- `program` (links to school/university programs)

---

### 3. **EXAMS APP** - Exam Packages 📝
**Endpoint:** `POST /api/exams/admin/exams/import_exam/`  
**Database Model:** `exams.Exam` → `exams.ExamCourse` → `exams.ExamModule` → `exams.ExamLesson`  
**Admin Section:** "EXAMS" → "Exam Packages"

**Use For:**
- ✅ Standardized exam packages (JAMB UTME 2026, SAT 2026)
- ✅ Multi-subject entrance exams
- ✅ Professional certification exams with multiple domains
- ✅ Language proficiency tests (IELTS, TOEFL)

**Sample JSON:** `course_import_system/templates/sample_exam_package.json`

**Example Packages:**
- JAMB UTME 2026 Preparation (4 subjects)
- SAT 2026 Complete Package (Math + English)
- GRE Preparation 2026
- IELTS Academic Test Prep

**Unique Features:**
- Multiple subject courses in one package
- Mock exams with timed questions
- Past papers with solutions
- Exam-specific fields (exam_date, total_marks, scoring_system)

---

## 🔍 Decision Matrix

| If You're Creating...                 | Use This Endpoint                      | Import To        |
|---------------------------------------|----------------------------------------|------------------|
| Python Bootcamp                       | `/api/courses/admin/courses/`          | courses.Course   |
| AWS Certification Course              | `/api/courses/admin/courses/`          | courses.Course   |
| Form 1 Mathematics                    | `/api/content/admin/courses/`          | content.Course   |
| University Physics                    | `/api/content/admin/courses/`          | content.Course   |
| JAMB Mathematics (single subject)     | `/api/content/admin/courses/`          | content.Course   |
| **JAMB UTME 2026 (full package)**     | `/api/exams/admin/exams/`              | exams.Exam       |
| SAT Preparation Package               | `/api/exams/admin/exams/`              | exams.Exam       |
| Calculus Review Course                | `/api/content/admin/courses/`          | content.Course   |

---

## 🎯 Quick Identification Guide

**Ask yourself:**

### Is it a PACKAGE with multiple subjects?
→ **Use EXAMS APP** (`/api/exams/admin/exams/import_exam/`)
- Example: "JAMB 2026" includes English, Math, Physics, Chemistry

### Is it ACADEMIC/CURRICULUM-based for schools/universities?
→ **Use CONTENT APP** (`/api/content/admin/courses/import_course/`)
- Example: "Form 1 Mathematics" aligned with GCE O-Level curriculum

### Is it PROFESSIONAL DEVELOPMENT or a HOBBY course?
→ **Use COURSES APP** (`/api/courses/admin/courses/import_course/`)
- Example: "Web Development Bootcamp" for career skills

---

## 🛠️ Frontend Implementation Changes

### Before (WRONG):
```javascript
// DON'T DO THIS - Only uses one endpoint
const importCourse = async (courseData) => {
  const response = await fetch('/api/courses/admin/courses/import_course/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(courseData)
  });
  return response.json();
};
```

### After (CORRECT):
```javascript
// Separate functions for each course type
const importProfessionalCourse = async (courseData) => {
  const response = await fetch('/api/courses/admin/courses/import_course/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(courseData)
  });
  return response.json();
};

const importAcademicCourse = async (courseData) => {
  const response = await fetch('/api/content/admin/courses/import_course/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(courseData)
  });
  return response.json();
};

const importExamPackage = async (examData) => {
  const response = await fetch('/api/exams/admin/exams/import_exam/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(examData)
  });
  return response.json();
};

// UI should let users select course type first
const importCourse = async (courseType, courseData) => {
  switch(courseType) {
    case 'professional':
    case 'certification':
    case 'hobby':
      return importProfessionalCourse(courseData);
    
    case 'academic':
    case 'school':
    case 'university':
      return importAcademicCourse(courseData);
    
    case 'exam_package':
      return importExamPackage(courseData);
    
    default:
      throw new Error('Invalid course type');
  }
};
```

---

## 📋 UI/UX Recommendations

### Import Form Should Have Course Type Selection:

```
┌─────────────────────────────────────────────┐
│  Import Course                              │
├─────────────────────────────────────────────┤
│                                             │
│  Course Type: [Dropdown ▼]                 │
│    ○ Professional Development               │
│    ○ Academic/Educational ✓                 │
│    ○ Exam Package                           │
│                                             │
│  Upload JSON: [Choose File]                │
│                                             │
│  [Import Course]                            │
└─────────────────────────────────────────────┘
```

### Help Text Examples:

**Professional Development:**
> "Import bootcamps, certification courses, and hobby classes"

**Academic/Educational:**
> "Import school curriculum, university courses, or single-subject exam prep"

**Exam Package:**
> "Import complete exam packages with multiple subjects, mock tests, and past papers"

---

## ⚠️ Common Mistakes to Avoid

### ❌ MISTAKE 1: Using Courses Endpoint for Academic Content
```json
// WRONG - Will import to courses.Course instead of content.Course
POST /api/courses/admin/courses/import_course/
{
  "title": "Form 1 Mathematics",
  "course_type": "academic",  // This field exists but uses different structure!
  "subject": "Mathematics"     // This field doesn't exist in courses.Course!
}
```

**Result:** Course created but in wrong app, missing subject linkage, won't show up in Content admin.

### ❌ MISTAKE 2: Using Content Endpoint for Exam Packages
```json
// WRONG - Can't create mock exams and past papers in content app
POST /api/content/admin/courses/import_course/
{
  "title": "JAMB 2026",
  "mock_exams": [...],  // Field doesn't exist in content.Course!
  "past_papers": [...]  // Field doesn't exist in content.Course!
}
```

**Result:** Import fails or data is ignored.

### ❌ MISTAKE 3: Using Exams Endpoint for Single Subject
```json
// INEFFICIENT - Exam packages are for multi-subject bundles
POST /api/exams/admin/exams/import_exam/
{
  "title": "Just Mathematics",
  "courses": [
    {"title": "Mathematics", "subject": "Math"}  // Only 1 course? Use content app!
  ]
}
```

**Result:** Works but creates unnecessary exam package wrapper. Use content app instead.

---

## 🔄 Migration Path (If You Already Imported Wrongly)

If you already imported courses to the wrong endpoint:

1. **Identify Wrongly Imported Courses:**
   - Check Django admin "COURSES" section
   - Filter by `course_type = 'academic'`
   - These should be in CONTENT app instead

2. **Delete Wrong Imports:**
   - Go to Django admin
   - Select wrongly imported courses
   - Delete them

3. **Re-import to Correct Endpoint:**
   - Use the correct endpoint from the table above
   - Import the same JSON file
   - Verify it appears in the correct admin section

---

## 📚 Additional Resources

- **Full Import System Documentation:** `course_import_system/IMPORT_SYSTEM_README.md`
- **Endpoint Comparison Guide:** `course_import_system/COURSES_VS_CONTENT_COMPARISON.md`
- **Sample Templates:**
  - Professional: `course_import_system/templates/sample_professional_course.json`
  - Academic: `course_import_system/templates/sample_content_academic_course.json`
  - Exam Package: `course_import_system/templates/sample_exam_package.json`

---

## 📞 Questions?

If you're unsure which endpoint to use:
1. Check the decision matrix above
2. Review the sample JSONs to see structure differences
3. Test with `is_published: false` first
4. Verify in Django admin before publishing

---

## ✅ Action Items for Web Team

- [ ] Update frontend import forms to include course type selection
- [ ] Implement separate import functions for each endpoint
- [ ] Add validation to prevent wrong endpoint usage
- [ ] Update API documentation with correct endpoints
- [ ] Test all three import flows
- [ ] Add help text/tooltips to guide users
- [ ] Review existing codebase for hardcoded `/api/courses/admin/courses/import_course/`
- [ ] Migrate any wrongly imported courses

---

**Last Updated:** March 2, 2026  
**Author:** Backend Team  
**Status:** Action Required

# Academic Content Admin API - Frontend Requirements

## Overview
This document outlines the fields required for creating/editing **academic courses** through the content admin panel. These courses are designed for school curriculum and entrance exam preparation.

**Endpoint:** `/api/content/admin/courses/`

**Important:** This is different from the professional courses API (`/api/courses/admin/courses/`). Make sure you're using the correct endpoint based on your course type.

---

## Create Academic Course Endpoint
**POST** `/api/content/admin/courses/`

### Required Fields
Only these fields are **absolutely required** to create an academic course:

```json
{
  "title": "Form 1 Mathematics - GCE O Level",
  "code": "MATH_FORM1_OL",
  "description": "Comprehensive mathematics course for Form 1 GCE O Level students",
  "subject": 1,
  "curriculum": "GCE_OL",
  "estimated_hours": 40
}
```

### Optional Fields (Recommended)

```json
{
  // Basic Information
  "course_type": "regular",  // Choices: entrance_exam, regular, advanced, review
  
  // Educational Context
  "program": 1,  // Program ID (e.g., Secondary Education)
  "class_level": 1,  // Class Level ID (e.g., Form 1, Year 7)
  "curriculum": "GCE_OL",  // Required - e.g., GCE_OL, WAEC, BACCALAUREAT
  
  // Course Details
  "difficulty": "beginner",  // Choices: beginner, intermediate, advanced, expert
  "estimated_hours": 40,  // Required - Total study hours
  
  // Entrance Exam Specific Fields (only for entrance_exam type)
  "exam_board": "WAEC",  // e.g., WAEC, NECO, GCE, JAMB
  "exam_year": 2025,  // Target exam year
  "passing_score": 50,  // Minimum score to pass
  "exam_format": "Multiple Choice",  // Exam format description
  
  // Media
  "thumbnail": <file>,  // Image file
  "banner_image": <file>,  // Image file
  "video_intro": <file>,  // Video file
  
  // Content
  "learning_objectives": ["Understand algebra", "Master geometry"],  // Array of strings
  "requirements": "Basic arithmetic knowledge",  // Text
  "learning_outcomes": "Students will be able to solve complex equations",  // Text
  
  // Status and Access
  "is_published": false,  // Boolean, default: false
  "is_free": true,  // Boolean, default: true
  "price": 0.00,  // Decimal
  "currency": "USD",  // 3-letter code
  "priority_order": 100,  // Lower numbers appear first (1-10 for entrance exams)
  
  // Enrollment
  "instructor": 1,  // User ID - optional
  "max_students": 100,  // Positive integer
  "enrollment_deadline": "2025-12-31T23:59:59Z",  // ISO datetime
  
  // Metadata
  "language": "en",  // Default: en
  "tags": ["mathematics", "algebra", "geometry"]  // Array of strings
}
```

## Auto-Generated/Read-Only Fields

```json
{
  "id": "uuid",
  "subject_name": "Mathematics",  // Computed from subject
  "module_count": 0,
  "enrollment_count": 0,
  "rating": 0.0,
  "created_at": "2024-12-01T10:00:00Z",
  "updated_at": "2024-12-01T10:00:00Z"
}
```

## Field Details

### Course Type Choices
```javascript
const COURSE_TYPE_CHOICES = [
  { value: 'entrance_exam', label: 'Entrance Exam Preparation' },
  { value: 'regular', label: 'Regular Course Content' },
  { value: 'advanced', label: 'Advanced Topics' },
  { value: 'review', label: 'Review & Revision' }
];
```

### Difficulty Choices
```javascript
const DIFFICULTY_CHOICES = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
  { value: 'expert', label: 'Expert' }
];
```

### Common Curriculum Values
```javascript
const CURRICULUM_OPTIONS = [
  'GCE_OL',        // GCE Ordinary Level
  'GCE_AL',        // GCE Advanced Level
  'WAEC',          // West African Examinations Council
  'NECO',          // National Examinations Council
  'BACCALAUREAT',  // Baccalauréat
  'JAMB',          // Joint Admissions and Matriculation Board
  'IGCSE',         // International GCSE
  'IB',            // International Baccalaureate
];
```

## Important Field Notes

### File Upload Fields (thumbnail, banner_image, video_intro)
⚠️ **Critical**: Only send these fields if you have an actual file to upload.

**✅ DO:**
```javascript
// With file
const formData = new FormData();
formData.append('title', 'Course Title');
formData.append('code', 'COURSE_CODE');
formData.append('description', 'Description');
formData.append('subject', 1);
formData.append('curriculum', 'GCE_OL');
formData.append('estimated_hours', 40);
formData.append('thumbnail', fileObject);  // Actual File object

// Without file - don't include the field at all
const jsonData = {
  title: 'Course Title',
  code: 'COURSE_CODE',
  description: 'Description',
  subject: 1,
  curriculum: 'GCE_OL',
  estimated_hours: 40
  // NO thumbnail field
};
```

**❌ DON'T:**
```javascript
{
  thumbnail: "",  // BAD
  banner_image: null,  // BAD
  video_intro: undefined  // BAD
}
```

### Tags Field
Accepts multiple formats (same as professional courses):

```json
// ✅ Array of strings (recommended)
{ "tags": ["mathematics", "algebra", "form1"] }

// ✅ Comma-separated string
{ "tags": "mathematics,algebra,form1" }

// ✅ Empty
{ "tags": [] }
```

### Learning Objectives Field
Accepts multiple formats:

```json
// ✅ Array of strings (recommended)
{ "learning_objectives": ["Master algebra", "Understand geometry"] }

// ✅ Comma-separated string
{ "learning_objectives": "Master algebra,Understand geometry" }

// ✅ Empty
{ "learning_objectives": [] }
```

## Minimal Course Creation Example

### Request
```http
POST /api/content/admin/courses/
Content-Type: application/json
Authorization: Bearer <token>

{
  "title": "Form 1 Mathematics - GCE O Level",
  "code": "MATH_FORM1_OL",
  "description": "Comprehensive mathematics course covering algebra, geometry, and basic calculus for GCE O Level students.",
  "subject": 1,
  "curriculum": "GCE_OL",
  "estimated_hours": 40
}
```

### Response (201 Created)
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "code": "MATH_FORM1_OL",
  "title": "Form 1 Mathematics - GCE O Level",
  "description": "Comprehensive mathematics course covering algebra, geometry, and basic calculus for GCE O Level students.",
  "course_type": "regular",
  "subject": 1,
  "subject_name": "Mathematics",
  "program": null,
  "class_level": null,
  "curriculum": "GCE_OL",
  "difficulty": "beginner",
  "estimated_hours": 40,
  "priority_order": 100,
  "is_published": false,
  "is_free": true,
  "exam_board": "",
  "exam_year": null,
  "passing_score": null,
  "learning_objectives": [],
  "tags": [],
  "modules": [],
  "module_count": 0,
  "created_at": "2024-12-01T10:00:00Z",
  "updated_at": "2024-12-01T10:00:00Z"
}
```

## Full Course Creation Example (Entrance Exam)

### Request
```http
POST /api/content/admin/courses/
Content-Type: multipart/form-data
Authorization: Bearer <token>

{
  "title": "JAMB Mathematics Preparation 2025",
  "code": "JAMB_MATH_2025",
  "description": "Complete preparation course for JAMB Mathematics examination",
  "course_type": "entrance_exam",
  "subject": 1,
  "program": 2,
  "class_level": 5,
  "curriculum": "JAMB",
  "difficulty": "intermediate",
  "estimated_hours": 60,
  "exam_board": "JAMB",
  "exam_year": 2025,
  "passing_score": 50,
  "exam_format": "Multiple Choice (60 questions)",
  "thumbnail": <file>,
  "priority_order": 5,
  "is_published": true,
  "is_free": false,
  "price": 5000.00,
  "currency": "NGN",
  "max_students": 500,
  "enrollment_deadline": "2025-03-31T23:59:59Z",
  "learning_objectives": [
    "Master all JAMB Mathematics topics",
    "Practice with past questions",
    "Achieve 80%+ score in mock exams"
  ],
  "requirements": "Completed secondary school mathematics",
  "learning_outcomes": "Students will be fully prepared for JAMB Mathematics exam",
  "language": "en",
  "tags": ["jamb", "entrance-exam", "mathematics", "2025"]
}
```

## Update Course Endpoint
**PUT/PATCH** `/api/content/admin/courses/{id}/`

### Partial Update Example
```http
PATCH /api/content/admin/courses/550e8400-e29b-41d4-a716-446655440000/
Content-Type: application/json
Authorization: Bearer <token>

{
  "is_published": true,
  "priority_order": 10
}
```

## List Courses Endpoint
**GET** `/api/content/admin/courses/`

### Query Parameters
```
?course_type=entrance_exam
?subject=1
?program=2
?class_level=3
?curriculum=GCE_OL
?difficulty=beginner
?is_published=true
?search=mathematics
?ordering=-created_at
```

### Response
```json
{
  "count": 25,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": "uuid",
      "code": "MATH_FORM1_OL",
      "title": "Form 1 Mathematics - GCE O Level",
      "course_type": "regular",
      "subject": 1,
      "subject_name": "Mathematics",
      "program": 1,
      "class_level": 1,
      "curriculum": "GCE_OL",
      "difficulty": "beginner",
      "estimated_hours": 40,
      "priority_order": 100,
      "is_published": true,
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-12-01T10:00:00Z"
    }
  ]
}
```

## Validation Rules

### Title
- Required
- Max length: 255 characters

### Code
- Required
- Max length: 50 characters
- Must be unique
- Example: `MATH_FORM1_OL`, `PHYS_AL_WAEC`

### Description
- Required
- Text field (no max length)

### Subject
- Required
- Must be a valid Subject ID

### Curriculum
- Required
- Max length: 50 characters
- Examples: GCE_OL, WAEC, JAMB, BACCALAUREAT

### Estimated Hours
- Required
- Must be a positive integer

### Priority Order
- Default: 100
- Lower numbers appear first
- Use 1-10 for featured entrance exam courses
- Use 11-50 for important regular courses
- Use 51+ for standard courses

### Course Type
- Default: 'regular'
- For entrance exams, set to 'entrance_exam' and provide exam details

### Tags and Learning Objectives
- Must be arrays or comma-separated strings
- Default: empty array []

## Validation Errors

### Common Errors
```json
{
  "title": ["This field is required."],
  "code": ["Course with this code already exists."],
  "subject": ["This field is required."],
  "curriculum": ["This field is required."],
  "estimated_hours": ["This field is required."],
  "thumbnail": ["Upload a valid image."],
  "tags": ["Value must be valid JSON."],
  "learning_objectives": ["Value must be valid JSON."]
}
```

### Troubleshooting

#### Error: "Upload a valid image"
```javascript
// ❌ Wrong
{
  thumbnail: ''  // Don't send empty string
}

// ✅ Correct - Omit the field
{
  title: 'Test',
  code: 'TEST_01',
  // No thumbnail field
}

// ✅ Correct - Only send when file exists
const formData = new FormData();
if (thumbnailFile) {
  formData.append('thumbnail', thumbnailFile);
}
```

#### Error: "Value must be valid JSON"
```javascript
// ❌ Wrong
{
  tags: "mathematics"  // Single string
}

// ✅ Correct
{
  tags: ["mathematics", "algebra"]
}

// ✅ Also correct
{
  tags: "mathematics,algebra,geometry"
}
```

## Permissions

### Create Course
- User must be authenticated
- User must be staff

### Update Course
- User must be staff

### Delete Course
- User must be staff

### View Courses
- Staff can see all courses (published and unpublished)

## Frontend Form Recommendations

### Minimal Form (Quick Create)
```javascript
{
  title: '',              // Required
  code: '',               // Required
  description: '',        // Required
  subject: null,          // Required - Dropdown/select
  curriculum: '',         // Required - Dropdown/select
  estimated_hours: 0      // Required - Number input
}
```

### Standard Form (Regular Course)
```javascript
{
  title: '',
  code: '',
  description: '',
  course_type: 'regular',
  subject: null,
  program: null,
  class_level: null,
  curriculum: '',
  difficulty: 'beginner',
  estimated_hours: 0,
  thumbnail: null,
  learning_objectives: [],
  tags: [],
  is_published: false,
  is_free: true,
  price: 0.00
}
```

### Advanced Form (Entrance Exam Course)
```javascript
{
  // Basic fields
  title: '',
  code: '',
  description: '',
  course_type: 'entrance_exam',
  subject: null,
  program: null,
  class_level: null,
  curriculum: '',
  difficulty: 'intermediate',
  estimated_hours: 0,
  
  // Exam specific
  exam_board: '',
  exam_year: new Date().getFullYear(),
  passing_score: 50,
  exam_format: '',
  
  // Media
  thumbnail: null,
  banner_image: null,
  
  // Content
  learning_objectives: [],
  requirements: '',
  learning_outcomes: '',
  tags: [],
  
  // Priority and access
  priority_order: 5,  // Low number for entrance exams
  is_published: false,
  is_free: false,
  price: 0.00,
  currency: 'USD',
  max_students: null,
  enrollment_deadline: null
}
```

## React Example

### Basic Course Creation
```jsx
import { useState } from 'react';

function CreateAcademicCourseForm() {
  const [formData, setFormData] = useState({
    title: '',
    code: '',
    description: '',
    subject: null,
    curriculum: '',
    estimated_hours: 0
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/content/admin/courses/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        const course = await response.json();
        console.log('Academic course created:', course);
      } else {
        const errors = await response.json();
        console.error('Validation errors:', errors);
      }
    } catch (error) {
      console.error('Network error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={formData.title}
        onChange={(e) => setFormData({...formData, title: e.target.value})}
        placeholder="Course Title"
        required
      />
      <input
        type="text"
        value={formData.code}
        onChange={(e) => setFormData({...formData, code: e.target.value})}
        placeholder="Course Code (e.g., MATH_FORM1_OL)"
        required
      />
      <textarea
        value={formData.description}
        onChange={(e) => setFormData({...formData, description: e.target.value})}
        placeholder="Course Description"
        required
      />
      <select
        value={formData.subject || ''}
        onChange={(e) => setFormData({...formData, subject: parseInt(e.target.value)})}
        required
      >
        <option value="">Select Subject</option>
        <option value="1">Mathematics</option>
        <option value="2">Physics</option>
        <option value="3">Chemistry</option>
      </select>
      <select
        value={formData.curriculum}
        onChange={(e) => setFormData({...formData, curriculum: e.target.value})}
        required
      >
        <option value="">Select Curriculum</option>
        <option value="GCE_OL">GCE O Level</option>
        <option value="GCE_AL">GCE A Level</option>
        <option value="WAEC">WAEC</option>
        <option value="JAMB">JAMB</option>
      </select>
      <input
        type="number"
        value={formData.estimated_hours}
        onChange={(e) => setFormData({...formData, estimated_hours: parseInt(e.target.value)})}
        placeholder="Estimated Hours"
        min="1"
        required
      />
      <button type="submit">Create Course</button>
    </form>
  );
}
```

## Key Differences from Professional Courses

| Feature | Academic Courses | Professional Courses |
|---------|-----------------|---------------------|
| **Endpoint** | `/api/content/admin/courses/` | `/api/courses/admin/courses/` |
| **Required Fields** | title, code, description, subject, curriculum, estimated_hours | title, description |
| **Code Field** | Required, must be unique | Optional (course_code) |
| **Subject** | Required (linked to Subject model) | N/A (uses category instead) |
| **Curriculum** | Required (GCE_OL, WAEC, etc.) | N/A |
| **Course Type** | entrance_exam, regular, advanced, review | N/A (uses level instead) |
| **Exam Fields** | exam_board, exam_year, passing_score | N/A |
| **Instructor** | Optional | Auto-assigned to current user |
| **Slug** | N/A | Auto-generated from title |

## Best Practices

1. **Use Descriptive Codes**: `MATH_FORM1_OL` is better than `M1`
2. **Set Priority Order**: Use 1-10 for entrance exams to feature them prominently
3. **Fill Exam Details**: For entrance_exam type, always provide exam_board, exam_year, passing_score
4. **Tag Properly**: Include curriculum, subject, and year in tags
5. **Start Unpublished**: Create courses with `is_published: false` until content is ready
6. **File Validation**: Only send file fields when you have actual files
7. **Array Fields**: Use arrays for tags and learning_objectives, not strings

## Notes

- All JSONFields (tags, learning_objectives) now accept both array and comma-separated string formats
- File fields (thumbnail, banner_image, video_intro) must be actual File objects or omitted entirely
- The `code` field is unique and required - use a consistent naming convention
- Priority order determines display order (lower = higher priority)
- For entrance exam courses, set `course_type: 'entrance_exam'` and provide exam details

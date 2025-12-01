# Course Admin API - Frontend Requirements

## Overview
This document outlines the fields required by the frontend when creating/editing courses through the admin panel.

## Create Course Endpoint
**POST** `/api/courses/admin/courses/`

### Required Fields
Only these fields are **absolutely required** to create a course:

```json
{
  "title": "Introduction to Python Programming",
  "description": "Learn Python from scratch with hands-on examples"
}
```

### Optional Fields (Recommended)
These fields enhance the course but are not required:

```json
{
  // Basic Information
  "short_description": "Brief overview (max 500 chars)",
  "course_code": "PY101",  // Auto-generated if not provided
  
  // Course Details
  "instructor": 1,  // User ID - AUTO-ASSIGNED to current user if omitted
  "category": 1,  // Category ID - can be null
  "level": "beginner",  // Choices: beginner, intermediate, advanced, expert
  "status": "draft",  // Choices: draft, published, archived, suspended
  
  // Media Files
  "thumbnail": <file>,  // Image file
  "banner_image": <file>,  // Image file
  "video_intro": <file>,  // Video file
  
  // Pricing
  "price": 0.00,  // Decimal, default: 0.00
  "currency": "USD",  // 3-letter code, default: USD
  "is_free": true,  // Boolean, default: true
  "discount_price": 49.99,  // Decimal, optional
  "discount_start_date": "2024-01-01T00:00:00Z",  // ISO datetime
  "discount_end_date": "2024-12-31T23:59:59Z",  // ISO datetime
  
  // Course Structure
  "duration_hours": 10,  // Positive integer, default: 0
  "total_lessons": 0,  // Auto-calculated, default: 0
  "total_quizzes": 0,  // Auto-calculated, default: 0
  "total_assignments": 0,  // Auto-calculated, default: 0
  
  // Requirements & Outcomes
  "requirements": "Basic computer knowledge",  // Text
  "learning_outcomes": "You will learn: ...",  // Text
  
  // Metadata
  "language": "en",  // Default: en
  "tags": ["python", "programming", "beginner"],  // Array of strings
  "featured": false,  // Boolean, default: false
  "featured_order": 0,  // Positive integer, default: 0
  "target_audience": "Students preparing for entrance exams",
  
  // Enrollment
  "max_students": 100,  // Positive integer, optional
  "enrollment_deadline": "2024-12-31T23:59:59Z",  // ISO datetime
  
  // Certification
  "offers_certificate": false,  // Boolean, default: false
  "certificate_requirements": {
    "min_completion_percentage": 80,
    "min_assessment_score": 70,
    "min_time_spent_hours": 30
  }
}
```

## Auto-Generated/Read-Only Fields
These fields are automatically managed and should **NOT** be sent in create/update requests:

```json
{
  "id": "uuid",
  "slug": "auto-generated-from-title",
  "instructor_name": "John Doe",  // Computed from instructor
  "category_name": "Programming",  // Computed from category
  "module_count": 0,
  "current_enrollments": 0,
  "rating": 0.0,
  "total_ratings": 0,
  "completion_rate": 0.0,
  "published_at": null,
  "last_updated": "2024-12-01T10:00:00Z",
  "created_at": "2024-12-01T10:00:00Z",
  "updated_at": "2024-12-01T10:00:00Z"
}
```

## Field Details

### Level Choices
```javascript
const LEVEL_CHOICES = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
  { value: 'expert', label: 'Expert' }
];
```

### Status Choices
```javascript
const STATUS_CHOICES = [
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
  { value: 'archived', label: 'Archived' },
  { value: 'suspended', label: 'Suspended' }
];
```

## Minimal Course Creation Example

### Request
```http
POST /api/courses/admin/courses/
Content-Type: application/json
Authorization: Bearer <token>

{
  "title": "Python for Beginners",
  "description": "Learn Python programming from scratch with practical examples and projects."
}
```

### Response (201 Created)
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Python for Beginners",
  "slug": "python-for-beginners",
  "description": "Learn Python programming from scratch with practical examples and projects.",
  "short_description": "",
  "course_code": "",
  "instructor": 1,
  "instructor_name": "Current User Name",
  "category": null,
  "category_name": null,
  "level": "beginner",
  "status": "draft",
  "thumbnail": null,
  "banner_image": null,
  "video_intro": null,
  "price": "0.00",
  "currency": "USD",
  "is_free": true,
  "discount_price": null,
  "discount_start_date": null,
  "discount_end_date": null,
  "duration_hours": 0,
  "total_lessons": 0,
  "total_quizzes": 0,
  "total_assignments": 0,
  "requirements": "",
  "learning_outcomes": "",
  "language": "en",
  "tags": [],
  "featured": false,
  "featured_order": 0,
  "max_students": null,
  "current_enrollments": 0,
  "enrollment_deadline": null,
  "rating": 0.0,
  "total_ratings": 0,
  "completion_rate": 0.0,
  "published_at": null,
  "last_updated": "2024-12-01T10:00:00Z",
  "modules": [],
  "module_count": 0,
  "created_at": "2024-12-01T10:00:00Z",
  "updated_at": "2024-12-01T10:00:00Z"
}
```

## Full Course Creation Example

### Request
```http
POST /api/courses/admin/courses/
Content-Type: multipart/form-data
Authorization: Bearer <token>

{
  "title": "Advanced Web Development",
  "description": "Master modern web development with React, Node.js, and MongoDB",
  "short_description": "Build full-stack applications with the MERN stack",
  "course_code": "WEB301",
  "category": 2,
  "level": "advanced",
  "status": "draft",
  "thumbnail": <file>,
  "price": 99.99,
  "is_free": false,
  "discount_price": 79.99,
  "discount_start_date": "2024-12-01T00:00:00Z",
  "discount_end_date": "2024-12-31T23:59:59Z",
  "duration_hours": 40,
  "requirements": "Basic JavaScript knowledge, HTML/CSS proficiency",
  "learning_outcomes": "Build production-ready web applications, Master React hooks, Create RESTful APIs",
  "language": "en",
  "tags": ["react", "nodejs", "mongodb", "fullstack"],
  "featured": true,
  "featured_order": 1,
  "max_students": 50,
  "enrollment_deadline": "2024-12-20T23:59:59Z",
  "offers_certificate": true,
  "certificate_requirements": {
    "min_completion_percentage": 90,
    "min_assessment_score": 80,
    "min_time_spent_hours": 35
  }
}
```

## Update Course Endpoint
**PUT/PATCH** `/api/courses/admin/courses/{id}/`

### Update Behavior
- **PUT**: Requires all required fields (title, description)
- **PATCH**: Update only specific fields

### Partial Update Example
```http
PATCH /api/courses/admin/courses/550e8400-e29b-41d4-a716-446655440000/
Content-Type: application/json
Authorization: Bearer <token>

{
  "status": "published",
  "featured": true
}
```

## List Courses Endpoint
**GET** `/api/courses/admin/courses/`

### Query Parameters
```
?status=draft
?level=beginner
?category=1
?instructor=1
?featured=true
?is_free=true
?search=python
?ordering=-created_at
```

### Response
Returns a lightweight version of courses (using `CourseListAdminSerializer`):
```json
{
  "count": 10,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": "uuid",
      "title": "Course Title",
      "slug": "course-title",
      "course_code": "CS101",
      "instructor": 1,
      "instructor_name": "John Doe",
      "category": 1,
      "category_name": "Programming",
      "level": "beginner",
      "status": "published",
      "thumbnail": "url",
      "price": "99.99",
      "is_free": false,
      "duration_hours": 20,
      "total_lessons": 15,
      "total_quizzes": 5,
      "current_enrollments": 150,
      "rating": 4.5,
      "total_ratings": 50,
      "featured": true,
      "featured_order": 1,
      "published_at": "2024-01-01T00:00:00Z",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-12-01T10:00:00Z"
    }
  ]
}
```

## Validation Rules

### Title
- Required
- Max length: 200 characters
- Must be unique (auto-generates slug)

### Description
- Required
- Text field (no max length)

### Short Description
- Optional
- Max length: 500 characters

### Course Code
- Optional (can be auto-generated)
- Max length: 20 characters
- Must be unique

### Slug
- Auto-generated from title
- Must be unique
- Cannot be manually set

### Instructor
- If not provided, automatically set to current user
- Only staff can assign other users as instructors

### Price & Discount
- Price must be >= 0
- Discount price must be < original price
- If discount dates are set, both start and end required

### Tags
- Must be an array of strings
- Default: empty array []

### Certificate Requirements
- Must be a valid JSON object
- Default: empty object {}

## Permissions

### Create Course
- User must be authenticated
- User must be staff OR have instructor permissions

### Update Course
- User must be the course instructor OR staff

### Delete Course
- User must be the course instructor OR staff

### View Courses
- Staff: Can see all courses
- Instructors: Can only see their own courses

## Frontend Form Recommendations

### Minimal Form (Quick Create)
```javascript
{
  title: '',           // Required text input
  description: '',     // Required textarea
}
```

### Standard Form (Recommended)
```javascript
{
  title: '',
  description: '',
  short_description: '',
  course_code: '',
  category: null,      // Dropdown/select
  level: 'beginner',   // Dropdown/select
  status: 'draft',     // Dropdown/select
  thumbnail: null,     // File upload
  price: 0.00,
  is_free: true,       // Checkbox
  requirements: '',
  learning_outcomes: '',
  language: 'en',
  tags: [],            // Tag input
}
```

### Advanced Form (Full)
Include all optional fields with proper input types:
- File uploads for media
- Date/time pickers for deadlines
- JSON editor for certificate requirements
- Number inputs for numeric fields
- Boolean toggles for flags

## Error Handling

### Common Errors
```json
{
  "title": ["This field is required."],
  "slug": ["Course with this slug already exists."],
  "course_code": ["Course with this course code already exists."],
  "price": ["Ensure this value is greater than or equal to 0."],
  "level": ["\"invalid\" is not a valid choice."]
}
```

## Best Practices

1. **Start Simple**: Use minimal required fields for quick course creation
2. **Progressive Enhancement**: Add more details as course development progresses
3. **Save as Draft**: Always create courses with `status: 'draft'` initially
4. **File Uploads**: Use multipart/form-data for thumbnail and banner uploads
5. **Auto-Assignment**: Don't send instructor field - it's auto-assigned to current user
6. **Validation**: Validate on frontend before submission to reduce API calls
7. **Status Flow**: draft → published → archived (typical lifecycle)

## Notes

- The `instructor` field is now **optional** and will automatically be set to the current logged-in user
- All numeric counters (total_lessons, total_quizzes, current_enrollments) are auto-calculated
- The `slug` is auto-generated from the title and cannot be manually set
- Use `status: 'draft'` for courses under development
- Only change to `published` when course content is ready

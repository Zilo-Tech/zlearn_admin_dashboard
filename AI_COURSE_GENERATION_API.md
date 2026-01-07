# AI Course Generation API Documentation

## Overview
The AI Course Generation API provides endpoints for creating courses using Google Gemini AI. It supports both **Academic Courses** (content app - curriculum-based) and **Professional Courses** (courses app - skill-based) through a conversational interface.

**Base URL:** `/api/ai/generate-course/`

**Authentication:** Required - JWT Bearer token

---

## Table of Contents
1. [Authentication](#authentication)
2. [Course Types](#course-types)
3. [API Endpoints](#api-endpoints)
4. [Complete Workflow](#complete-workflow)
5. [Error Handling](#error-handling)
6. [Best Practices](#best-practices)

---

## Authentication

All endpoints require JWT authentication. Include the access token in the Authorization header:

```http
Authorization: Bearer <your_access_token>
```

---

## Course Types

### Academic Courses (`app_type: "content"`)
- Curriculum-based courses (GCE O-Level, A-Level, WAEC, NECO, JAMB, etc.)
- Linked to subjects, curricula, programs, and class levels
- Includes exam preparation materials
- Structure: Course → Module → Lesson → LessonSection → QuizQuestion

### Professional Courses (`app_type: "courses"`)
- Skill-based professional training courses
- Industry-focused with practical applications
- Includes interactive elements
- Structure: Course → CourseModule → Lesson → LessonSection → LessonInteractive

---

## API Endpoints

### 1. Start Course Generation Session

**Endpoint:** `POST /api/ai/generate-course/start/`

**Description:** Initialize a new AI-powered course generation session.

**Request Body:**
```json
{
  "app_type": "content",
  "initial_message": "I want to create a Mathematics course for Form 1 GCE O-Level students"
}
```

**Parameters:**
- `app_type` (required): `"content"` for academic or `"courses"` for professional
- `initial_message` (optional): Your first message to the AI

**Success Response (201 Created):**
```json
{
  "session_id": "550e8400-e29b-41d4-a716-446655440000",
  "app_type": "content",
  "status": "collecting_requirements",
  "conversation_history": [
    {
      "role": "assistant",
      "content": "Hello! I'll help you create an academic course. I need to gather some information...",
      "timestamp": "2026-01-04T10:30:00Z"
    }
  ],
  "collected_data": {},
  "created_at": "2026-01-04T10:30:00Z"
}
```

**Error Response (400 Bad Request):**
```json
{
  "error": "Invalid app_type. Must be 'content' or 'courses'"
}
```

---

### 2. Chat with AI

**Endpoint:** `POST /api/ai/generate-course/chat/`

**Description:** Continue the conversation with the AI to provide course requirements.

**Request Body:**
```json
{
  "session_id": "550e8400-e29b-41d4-a716-446655440000",
  "message": "It's for algebra and geometry topics, beginner level"
}
```

**Parameters:**
- `session_id` (required): UUID of the session
- `message` (required): Your response/information for the AI

**Success Response (200 OK):**
```json
{
  "session_id": "550e8400-e29b-41d4-a716-446655440000",
  "ai_response": "Great! I've noted that it's for algebra and geometry at beginner level. What subject is this for? Also, which curriculum or exam system should this align with?",
  "collected_data": {
    "difficulty": "beginner",
    "topics": ["algebra", "geometry"]
  },
  "status": "collecting_requirements",
  "conversation_history": [
    {
      "role": "assistant",
      "content": "Hello! I'll help you create an academic course...",
      "timestamp": "2026-01-04T10:30:00Z"
    },
    {
      "role": "user",
      "content": "It's for algebra and geometry topics, beginner level",
      "timestamp": "2026-01-04T10:31:00Z"
    },
    {
      "role": "assistant",
      "content": "Great! I've noted that it's for algebra and geometry...",
      "timestamp": "2026-01-04T10:31:05Z"
    }
  ]
}
```

**Error Response (404 Not Found):**
```json
{
  "error": "Session not found or does not belong to you"
}
```

---

### 3. Generate Course Outline

**Endpoint:** `POST /api/ai/generate-course/generate-outline/`

**Description:** Generate a detailed course outline based on collected requirements.

**Request Body:**
```json
{
  "session_id": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Parameters:**
- `session_id` (required): UUID of the session

**Success Response (200 OK):**
```json
{
  "session_id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "outline_generated",
  "outline": {
    "course": {
      "title": "Mathematics - Form 1 GCE O-Level",
      "description": "Comprehensive mathematics course covering algebra and geometry fundamentals",
      "difficulty": "beginner",
      "course_type": "regular",
      "estimated_hours": 40,
      "learning_objectives": [
        "Master basic algebraic operations",
        "Understand geometric principles",
        "Solve real-world problems using mathematics"
      ]
    },
    "modules": [
      {
        "order": 1,
        "title": "Introduction to Algebra",
        "description": "Foundational concepts in algebra",
        "estimated_hours": 15.0,
        "learning_objectives": [
          "Understand variables and expressions",
          "Solve linear equations"
        ],
        "lessons": [
          {
            "order": 1,
            "title": "Variables and Expressions",
            "description": "Learn about variables, constants, and algebraic expressions",
            "content_type": "video",
            "duration": "PT45M",
            "difficulty": "easy",
            "learning_objectives": [
              "Define variables and constants",
              "Write algebraic expressions"
            ],
            "sections": [
              {
                "order": 1,
                "section_type": "video",
                "title": "What are Variables?",
                "description": "Introduction to the concept of variables",
                "estimated_time_minutes": 15
              },
              {
                "order": 2,
                "section_type": "text",
                "title": "Writing Expressions",
                "description": "Learn how to write algebraic expressions",
                "text_content": "An algebraic expression combines numbers, variables...",
                "estimated_time_minutes": 10
              },
              {
                "order": 3,
                "section_type": "quiz",
                "title": "Check Your Understanding",
                "description": "Quiz on variables and expressions",
                "estimated_time_minutes": 10,
                "quiz_questions": [
                  {
                    "order": 1,
                    "text": "What is a variable in algebra?",
                    "explanation": "A variable is a symbol that represents an unknown value",
                    "options": [
                      {
                        "text": "A symbol representing an unknown value",
                        "is_correct": true,
                        "explanation": "Correct! Variables can represent any number."
                      },
                      {
                        "text": "A fixed number",
                        "is_correct": false,
                        "explanation": "That's a constant, not a variable."
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "order": 2,
        "title": "Geometry Fundamentals",
        "description": "Basic geometric shapes and properties",
        "estimated_hours": 12.0,
        "learning_objectives": [
          "Identify geometric shapes",
          "Calculate area and perimeter"
        ],
        "lessons": [
          {
            "order": 1,
            "title": "Points, Lines, and Angles",
            "description": "Understanding basic geometric elements",
            "content_type": "video",
            "duration": "PT40M",
            "difficulty": "easy",
            "sections": [
              {
                "order": 1,
                "section_type": "video",
                "title": "Introduction to Geometry",
                "description": "What is geometry and why it matters",
                "estimated_time_minutes": 12
              }
            ]
          }
        ]
      }
    ]
  },
  "message": "Course outline generated successfully! Review it and approve to create the full course."
}
```

**Error Response (400 Bad Request):**
```json
{
  "error": "Missing required fields: subject_id, description"
}
```

---

### 4. Approve and Create Course

**Endpoint:** `POST /api/ai/generate-course/approve/`

**Description:** Approve the outline and create the actual course in the database.

**Request Body:**
```json
{
  "session_id": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Parameters:**
- `session_id` (required): UUID of the session

**Success Response (201 Created):**
```json
{
  "session_id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "completed",
  "course_id": "123e4567-e89b-12d3-a456-426614174000",
  "course_url": "/api/content/courses/123e4567-e89b-12d3-a456-426614174000/",
  "message": "Course created successfully!",
  "course_details": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "title": "Mathematics - Form 1 GCE O-Level",
    "code": "MAT_A3F7C2",
    "modules_count": 2,
    "lessons_count": 8,
    "is_published": false
  }
}
```

**Error Response (400 Bad Request):**
```json
{
  "error": "No outline has been generated yet. Generate an outline first."
}
```

---

### 5. Get Session Details

**Endpoint:** `GET /api/ai/generate-course/session/{session_id}/`

**Description:** Retrieve details of a specific course generation session.

**URL Parameters:**
- `session_id` (required): UUID of the session

**Success Response (200 OK):**
```json
{
  "session_id": "550e8400-e29b-41d4-a716-446655440000",
  "app_type": "content",
  "status": "outline_generated",
  "conversation_history": [
    {
      "role": "assistant",
      "content": "Hello! I'll help you create an academic course...",
      "timestamp": "2026-01-04T10:30:00Z"
    },
    {
      "role": "user",
      "content": "I want to create a Mathematics course",
      "timestamp": "2026-01-04T10:31:00Z"
    }
  ],
  "collected_data": {
    "title": "Mathematics - Form 1 GCE O-Level",
    "subject_id": "abc123",
    "difficulty": "beginner",
    "course_type": "regular",
    "estimated_hours": 40
  },
  "generated_outline": {
    "course": {
      "title": "Mathematics - Form 1 GCE O-Level"
    },
    "modules": []
  },
  "course_id": null,
  "created_at": "2026-01-04T10:30:00Z",
  "updated_at": "2026-01-04T10:35:00Z"
}
```

**Error Response (404 Not Found):**
```json
{
  "error": "Session not found or does not belong to you"
}
```

---

### 6. Cancel Session

**Endpoint:** `DELETE /api/ai/generate-course/session/{session_id}/cancel/`

**Description:** Cancel an ongoing course generation session.

**URL Parameters:**
- `session_id` (required): UUID of the session

**Success Response (200 OK):**
```json
{
  "message": "Session cancelled successfully",
  "session_id": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Error Response (400 Bad Request):**
```json
{
  "error": "Cannot cancel a completed session"
}
```

---

## Complete Workflow

### Typical Flow for Creating an Academic Course

```
1. START SESSION
   POST /api/ai/generate-course/start/
   {
     "app_type": "content",
     "initial_message": "I want to create a Physics course for A-Level students"
   }
   → Get session_id

2. CONVERSATION (Multiple rounds)
   POST /api/ai/generate-course/chat/
   {
     "session_id": "...",
     "message": "It's for mechanics and electricity topics"
   }
   → AI asks follow-up questions
   → Repeat until AI has collected all required information

3. GENERATE OUTLINE
   POST /api/ai/generate-course/generate-outline/
   {
     "session_id": "..."
   }
   → Review the generated course structure

4. APPROVE & CREATE
   POST /api/ai/generate-course/approve/
   {
     "session_id": "..."
   }
   → Course created in database
   → Get course_id to access the course

5. (Optional) VIEW SESSION
   GET /api/ai/generate-course/session/{session_id}/
   → Review conversation history and collected data
```

---

## Session Statuses

| Status | Description |
|--------|-------------|
| `collecting_requirements` | AI is gathering course requirements from user |
| `outline_generated` | Course outline has been generated and awaiting approval |
| `generating_course` | Course is being created in the database |
| `completed` | Course has been successfully created |
| `cancelled` | Session was cancelled by user |
| `failed` | An error occurred during generation |

---

## Required Fields by Course Type

### Academic Courses (content)

**Minimum Required:**
- `title` - Course title
- `subject_id` - UUID of the subject
- `difficulty` - `"beginner"`, `"intermediate"`, or `"advanced"`
- `course_type` - `"entrance_exam"`, `"regular"`, `"advanced"`, or `"review"`
- `estimated_hours` - Number (e.g., 40)
- `description` - Detailed course description
- `learning_objectives` - Array of learning objectives

**Optional but Recommended:**
- `program_id` - UUID of educational program
- `class_level_id` - UUID of class level (e.g., Form 1, Grade 10)
- `curriculum_id` - UUID of curriculum
- `exam_system` - e.g., `"GCE_OL"`, `"WAEC"`, `"NECO"`
- `exam_board` - e.g., `"Cambridge"`, `"Edexcel"`
- `exam_year` - Target year (e.g., 2026)
- `passing_score` - Minimum passing percentage
- `exam_format` - Description of exam format

### Professional Courses (courses)

**Minimum Required:**
- `title` - Course title
- `difficulty` - `"beginner"`, `"intermediate"`, or `"advanced"`
- `estimated_duration` - e.g., `"8 weeks"`, `"3 months"`
- `description` - Detailed course description
- `learning_outcomes` - Array of what students will achieve

**Optional but Recommended:**
- `category_id` - UUID of course category
- `prerequisites` - Array of prerequisite requirements
- `target_audience` - Who this course is for
- `industry_focus` - Specific industry or domain
- `skill_level` - Entry, intermediate, advanced
- `certification_info` - Details about certification

---

## Section Types

### Academic Courses (Content App)
Available section types:
- **Content:** `text`, `image`, `video`, `audio`, `code`, `file`, `pdf`, `embed`, `combined`
- **Interactive:** `interactive`, `quiz`, `practice`, `assignment`
- **Study Materials:** `reading`, `discussion`, `exam_prep`, `past_questions`, `mock_exam`, `study_guide`, `exam_tips`

### Professional Courses (Courses App)
Available section types:
- **Content:** `text`, `image`, `video`, `audio`, `code`, `file`, `pdf`, `embed`, `combined`
- **Interactive:** `interactive`, `quiz`, `exercise`, `project`, `assignment`, `case_study`
- **Practical:** `lab`, `workshop`, `simulation`

---

## Error Handling

### Common HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Resource created |
| 400 | Bad request - validation error |
| 401 | Unauthorized - missing or invalid token |
| 403 | Forbidden - insufficient permissions |
| 404 | Not found - session/resource doesn't exist |
| 500 | Internal server error |

### Error Response Format

All errors follow this format:
```json
{
  "error": "Descriptive error message",
  "details": {
    "field_name": ["Specific validation error"]
  }
}
```

**Example Validation Error:**
```json
{
  "error": "Validation failed",
  "details": {
    "app_type": ["This field is required"],
    "message": ["This field may not be blank"]
  }
}
```

---

## Best Practices

### 1. Session Management
- Store `session_id` locally to continue conversations
- Check session status before proceeding to next step
- Handle cancelled/failed sessions gracefully

### 2. User Experience
- Show AI responses in a chat-like interface
- Display collected data in real-time as it's gathered
- Allow users to review and edit collected data before outline generation
- Show loading states during AI processing (can take 5-30 seconds)

### 3. Error Handling
- Validate user input before sending to API
- Handle network errors with retry logic
- Show meaningful error messages to users
- Allow users to cancel sessions if needed

### 4. Performance
- Don't poll `/session/{id}/` excessively - only when needed
- Cache session data locally between API calls
- Consider websocket for real-time updates (future enhancement)

### 5. Data Management
- After course creation, redirect to course management interface
- Store course_id for future reference
- Clean up old/cancelled sessions periodically

---

## Example: Complete Academic Course Creation

### Step 1: Start Session
```http
POST /api/ai/generate-course/start/
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...
Content-Type: application/json

{
  "app_type": "content",
  "initial_message": "I need to create a Chemistry course for WAEC students"
}
```

**Response:**
```json
{
  "session_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "status": "collecting_requirements",
  "conversation_history": [
    {
      "role": "assistant",
      "content": "Hello! I'll help you create a Chemistry course for WAEC. To get started, I need some information:\n\n1. What specific topics should this course cover?\n2. What class level is this for?\n3. Which year's syllabus should we follow?\n4. What's the expected duration in hours?",
      "timestamp": "2026-01-04T14:20:00Z"
    }
  ]
}
```

### Step 2: Continue Conversation
```http
POST /api/ai/generate-course/chat/
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...
Content-Type: application/json

{
  "session_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "message": "It covers organic chemistry and chemical bonding. For SS3 students, following the 2025 syllabus. About 50 hours of content."
}
```

**Response:**
```json
{
  "session_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "ai_response": "Perfect! I've noted:\n- Topics: Organic chemistry, Chemical bonding\n- Level: SS3\n- Syllabus: WAEC 2025\n- Duration: 50 hours\n\nA few more questions:\n1. What's the subject ID for Chemistry in your system?\n2. What difficulty level: beginner, intermediate, or advanced?\n3. Should this include past questions and exam preparation?",
  "collected_data": {
    "topics": ["organic chemistry", "chemical bonding"],
    "class_level": "SS3",
    "exam_system": "WAEC",
    "exam_year": 2025,
    "estimated_hours": 50
  },
  "status": "collecting_requirements"
}
```

### Step 3: Provide Remaining Info
```http
POST /api/ai/generate-course/chat/
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...
Content-Type: application/json

{
  "session_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "message": "Subject ID is 7c8d9e0f-1a2b-3c4d-5e6f-7890abcdef12. Intermediate difficulty. Yes, include past questions and exam tips."
}
```

### Step 4: Generate Outline
```http
POST /api/ai/generate-course/generate-outline/
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...
Content-Type: application/json

{
  "session_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
}
```

**Response:** (See outline example in endpoint #3 above)

### Step 5: Approve & Create
```http
POST /api/ai/generate-course/approve/
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...
Content-Type: application/json

{
  "session_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
}
```

**Response:**
```json
{
  "session_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "status": "completed",
  "course_id": "9f8e7d6c-5b4a-3210-fedc-ba0987654321",
  "course_url": "/api/content/courses/9f8e7d6c-5b4a-3210-fedc-ba0987654321/",
  "message": "Course created successfully! Your Chemistry course is ready for review.",
  "course_details": {
    "id": "9f8e7d6c-5b4a-3210-fedc-ba0987654321",
    "title": "Chemistry - SS3 WAEC 2025",
    "code": "CHE_A8F9D3",
    "modules_count": 4,
    "lessons_count": 16,
    "sections_count": 48,
    "is_published": false
  }
}
```

---

## Rate Limiting

- **Gemini API:** Limited by your Google Cloud quota
- **Concurrent Sessions:** Max 5 active sessions per user
- **Chat Messages:** Max 50 messages per session
- **Outline Generation:** Once per session (can regenerate after edits)

---

## Notes

1. **Draft Status:** All AI-generated courses are created as drafts (`is_published=false`). Review and publish manually.

2. **Token Usage:** Each session tracks token usage. Large courses may consume significant tokens.

3. **Conversation History:** Limited to last 100 messages per session for performance.

4. **Course Editing:** After creation, use standard course management APIs to edit content.

5. **Content Quality:** AI-generated content should be reviewed and refined by instructors.

6. **API Key:** Backend requires `GEMINI_API_KEY` environment variable to be set.

---

## Support

For issues or questions:
- Check session status and error messages
- Review conversation history for context
- Ensure all required fields are collected
- Contact backend team if persistent errors occur

---

**Last Updated:** January 4, 2026  
**API Version:** 1.0  
**Backend Team:** ZiloTech

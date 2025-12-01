# Content Admin Prepopulation API - Dropdown Data Endpoints

## Overview
This document lists all the endpoints needed to prepopulate dropdowns and select fields when creating/editing academic courses in the content admin panel.

**Base URL:** `/api/content/admin/` and `/api/education/admin/`

---

## Quick Option: Batch Endpoint

### Education Options (All-in-One)
**GET** `/api/auth/education-options/`

**Purpose:** Get ALL education-related options in a single request (countries, education levels, schools, faculties, programs, class levels, curricula)

**Authentication:** Not required (public endpoint)

**Response Structure:**
```json
{
  "countries": [...],
  "educationLevels": [...],
  "schools": [...],
  "faculties": [...],
  "programs": [...],
  "classLevels": [...],
  "curricula": [...],
  "academic": {...},
  "professional": {...}
}
```

**Usage:** This is a convenience endpoint that returns most dropdown data in one call. However, for **admin panel course creation**, use the individual endpoints below for:
- ✅ Proper authentication/authorization
- ✅ Pagination support
- ✅ Filtering capabilities
- ✅ Latest/accurate data from database
- ✅ Better performance with focused queries

---

## Required Prepopulation Endpoints

### 1. Subjects
**GET** `/api/content/admin/subjects/`

**Purpose:** Populate the Subject dropdown (REQUIRED field)

**Response:**
```json
{
  "count": 15,
  "results": [
    {
      "id": "uuid",
      "name": "Mathematics",
      "code": "MATH",
      "icon": "📐",
      "color": "#3B82F6",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    },
    {
      "id": "uuid",
      "name": "Physics",
      "code": "PHYS",
      "icon": "⚛️",
      "color": "#8B5CF6",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    },
    {
      "id": "uuid",
      "name": "Chemistry",
      "code": "CHEM",
      "icon": "🧪",
      "color": "#10B981",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

**Frontend Usage:**
```javascript
const subjects = await fetch('/api/content/admin/subjects/', {
  headers: { 'Authorization': `Bearer ${token}` }
}).then(r => r.json());

// Map to dropdown options
const subjectOptions = subjects.results.map(s => ({
  value: s.id,
  label: s.name,
  icon: s.icon,
  color: s.color
}));
```

---

### 2. Programs
**GET** `/api/education/admin/programs/`

**Purpose:** Populate the Program dropdown (optional field)

**Response:**
```json
{
  "count": 8,
  "results": [
    {
      "id": "uuid",
      "name": "Secondary Education",
      "code": "SEC_EDU",
      "description": "Secondary school education program",
      "education_level": "uuid",
      "education_level_name": "Secondary",
      "is_active": true,
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    },
    {
      "id": "uuid",
      "name": "Primary Education",
      "code": "PRI_EDU",
      "description": "Primary school education program",
      "education_level": "uuid",
      "education_level_name": "Primary",
      "is_active": true,
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

**Frontend Usage:**
```javascript
const programs = await fetch('/api/education/admin/programs/', {
  headers: { 'Authorization': `Bearer ${token}` }
}).then(r => r.json());

const programOptions = programs.results
  .filter(p => p.is_active)
  .map(p => ({
    value: p.id,
    label: p.name,
    description: p.education_level_name
  }));
```

---

### 3. Class Levels
**GET** `/api/education/admin/class-levels/`

**Purpose:** Populate the Class Level dropdown (optional field)

**Query Parameters:**
- `?program={program_id}` - Filter by program
- `?ordering=order` - Order by sequence

**Response:**
```json
{
  "count": 12,
  "results": [
    {
      "id": "uuid",
      "name": "Form 1",
      "code": "FORM1",
      "order": 1,
      "program": "uuid",
      "program_name": "Secondary Education",
      "age_range_start": 12,
      "age_range_end": 13,
      "description": "First year of secondary education",
      "is_active": true,
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    },
    {
      "id": "uuid",
      "name": "Form 2",
      "code": "FORM2",
      "order": 2,
      "program": "uuid",
      "program_name": "Secondary Education",
      "age_range_start": 13,
      "age_range_end": 14,
      "description": "Second year of secondary education",
      "is_active": true,
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

**Frontend Usage:**
```javascript
// Fetch all or filter by program
const classLevels = await fetch(
  `/api/education/admin/class-levels/?program=${selectedProgramId}&ordering=order`,
  { headers: { 'Authorization': `Bearer ${token}` } }
).then(r => r.json());

const classLevelOptions = classLevels.results
  .filter(c => c.is_active)
  .map(c => ({
    value: c.id,
    label: c.name,
    description: `Ages ${c.age_range_start}-${c.age_range_end}`
  }));
```

---

## Static Field Options (No API Needed)

### 4. Course Type
**Purpose:** Dropdown for course_type field

**Options (Hardcoded):**
```javascript
const COURSE_TYPE_OPTIONS = [
  { value: 'entrance_exam', label: 'Entrance Exam Preparation', description: 'Prepare students for entrance exams' },
  { value: 'regular', label: 'Regular Course Content', description: 'Standard curriculum courses' },
  { value: 'advanced', label: 'Advanced Topics', description: 'Advanced level content' },
  { value: 'review', label: 'Review & Revision', description: 'Review and practice materials' }
];
```

---

### 5. Difficulty Level
**Purpose:** Dropdown for difficulty field

**Options (Hardcoded):**
```javascript
const DIFFICULTY_OPTIONS = [
  { value: 'beginner', label: 'Beginner', icon: '🟢' },
  { value: 'intermediate', label: 'Intermediate', icon: '🟡' },
  { value: 'advanced', label: 'Advanced', icon: '🟠' },
  { value: 'expert', label: 'Expert', icon: '🔴' }
];
```

---

### 6. Curriculum
**GET** `/api/education/admin/curricula/`

**Purpose:** Populate the Curriculum dropdown (REQUIRED field)

**Query Parameters:**
- `?program={program_id}` - Filter by program
- `?year={year}` - Filter by year
- `?semester={semester}` - Filter by semester (first, second, both)
- `?is_active=true` - Filter by active status

**Response:**
```json
{
  "count": 25,
  "results": [
    {
      "id": "uuid",
      "name": "GCE Ordinary Level",
      "program": "uuid",
      "program_name": "Secondary Education",
      "year": 1,
      "semester": "both",
      "subjects": ["Mathematics", "Physics", "Chemistry"],
      "description": "General Certificate of Education - Ordinary Level",
      "is_active": true,
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    },
    {
      "id": "uuid",
      "name": "WAEC",
      "program": "uuid",
      "program_name": "Secondary Education",
      "year": 5,
      "semester": "both",
      "subjects": ["Mathematics", "English", "Biology"],
      "description": "West African Examinations Council",
      "is_active": true,
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

**Frontend Usage:**
```javascript
const curricula = await fetch('/api/education/admin/curricula/?is_active=true', {
  headers: { 'Authorization': `Bearer ${token}` }
}).then(r => r.json());

const curriculumOptions = curricula.results.map(c => ({
  value: c.id,
  label: c.name,
  description: c.description,
  program: c.program_name
}));
```

---

### 7. Language
**Purpose:** Dropdown for language field

**Options (Hardcoded):**
```javascript
const LANGUAGE_OPTIONS = [
  { value: 'en', label: 'English', flag: '🇬🇧' },
  { value: 'fr', label: 'French', flag: '🇫🇷' },
  { value: 'es', label: 'Spanish', flag: '🇪🇸' },
  { value: 'ar', label: 'Arabic', flag: '🇸🇦' },
  { value: 'pt', label: 'Portuguese', flag: '🇵🇹' }
];
```

---

### 8. Currency
**Purpose:** Dropdown for currency field

**Options (Hardcoded):**
```javascript
const CURRENCY_OPTIONS = [
  { value: 'USD', label: 'US Dollar', symbol: '$' },
  { value: 'EUR', label: 'Euro', symbol: '€' },
  { value: 'GBP', label: 'British Pound', symbol: '£' },
  { value: 'NGN', label: 'Nigerian Naira', symbol: '₦' },
  { value: 'XAF', label: 'Central African CFA Franc', symbol: 'FCFA' },
  { value: 'XOF', label: 'West African CFA Franc', symbol: 'FCFA' }
];
```

---

## Complete React Example

### Option 1: Individual API Calls (Recommended for Admin)
```jsx
import { useState, useEffect } from 'react';

function useCourseFormData() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    subjects: [],
    programs: [],
    classLevels: [],
    curricula: []
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const token = localStorage.getItem('token');
        const headers = { 'Authorization': `Bearer ${token}` };

        // Fetch all required data in parallel
        const [subjectsRes, programsRes, classLevelsRes, curriculaRes] = await Promise.all([
          fetch('/api/content/admin/subjects/', { headers }),
          fetch('/api/education/admin/programs/', { headers }),
          fetch('/api/education/admin/class-levels/?ordering=order', { headers }),
          fetch('/api/education/admin/curricula/?is_active=true', { headers })
        ]);

        const [subjects, programs, classLevels, curricula] = await Promise.all([
          subjectsRes.json(),
          programsRes.json(),
          classLevelsRes.json(),
          curriculaRes.json()
        ]);

        setData({
          subjects: subjects.results,
          programs: programs.results.filter(p => p.is_active),
          classLevels: classLevels.results.filter(c => c.is_active),
          curricula: curricula.results
        });
      } catch (error) {
        console.error('Failed to load form data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return { ...data, loading };
}
```

### Option 2: Hybrid Approach (Batch + Specific Endpoints)
```jsx
import { useState, useEffect } from 'react';

function useCourseFormDataOptimized() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    subjects: [],
    programs: [],
    classLevels: [],
    curricula: []
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const token = localStorage.getItem('token');
        const headers = { 'Authorization': `Bearer ${token}` };

        // Fetch batch options (no auth needed) and specific admin endpoints in parallel
        const [educationOptionsRes, subjectsRes, curriculaRes] = await Promise.all([
          fetch('/api/auth/education-options/'),
          fetch('/api/content/admin/subjects/', { headers }),
          fetch('/api/education/admin/curricula/?is_active=true', { headers })
        ]);

        const [educationOptions, subjects, curricula] = await Promise.all([
          educationOptionsRes.json(),
          subjectsRes.json(),
          curriculaRes.json()
        ]);

        setData({
          subjects: subjects.results,
          programs: educationOptions.programs || [],
          classLevels: educationOptions.classLevels || [],
          curricula: curricula.results
        });
      } catch (error) {
        console.error('Failed to load form data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return { ...data, loading };
}
```

### Complete Course Creation Form
```jsx
import { useState } from 'react';

// Hardcoded options
const COURSE_TYPE_OPTIONS = [
  { value: 'entrance_exam', label: 'Entrance Exam Preparation' },
  { value: 'regular', label: 'Regular Course Content' },
  { value: 'advanced', label: 'Advanced Topics' },
  { value: 'review', label: 'Review & Revision' }
];

const DIFFICULTY_OPTIONS = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
  { value: 'expert', label: 'Expert' }
];

const LANGUAGE_OPTIONS = [
  { value: 'en', label: 'English' },
  { value: 'fr', label: 'French' },
  { value: 'es', label: 'Spanish' }
];

const CURRENCY_OPTIONS = [
  { value: 'USD', label: 'US Dollar ($)' },
  { value: 'EUR', label: 'Euro (€)' },
  { value: 'GBP', label: 'British Pound (£)' },
  { value: 'NGN', label: 'Nigerian Naira (₦)' },
  { value: 'XAF', label: 'CFA Franc (FCFA)' }
];

function CreateAcademicCourseForm() {
  const { subjects, programs, classLevels, curricula, loading } = useCourseFormData();
  
  const [formData, setFormData] = useState({
    // Required fields
    title: '',
    code: '',
    description: '',
    subject: null,
    curriculum: '',
    estimated_hours: 0,
    
    // Optional fields with defaults
    course_type: 'regular',
    program: null,
    class_level: null,
    difficulty: 'beginner',
    is_published: false,
    is_free: true,
    language: 'en',
    currency: 'USD',
    
    // Other optional fields
    exam_board: '',
    exam_year: null,
    passing_score: null,
    exam_format: '',
    price: 0,
    priority_order: 100,
    max_students: null,
    enrollment_deadline: null,
    requirements: '',
    learning_outcomes: '',
    tags: [],
    learning_objectives: []
  });

  // Filter class levels based on selected program
  const filteredClassLevels = formData.program
    ? classLevels.filter(c => c.program === formData.program)
    : classLevels;

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
        console.log('Course created:', course);
        // Handle success (e.g., redirect, show message)
      } else {
        const errors = await response.json();
        console.error('Validation errors:', errors);
        // Handle errors
      }
    } catch (error) {
      console.error('Network error:', error);
    }
  };

  if (loading) {
    return <div>Loading form data...</div>;
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Required Fields */}
      <h3>Basic Information (Required)</h3>
      
      <input
        type="text"
        value={formData.title}
        onChange={(e) => setFormData({...formData, title: e.target.value})}
        placeholder="Course Title *"
        required
      />
      
      <input
        type="text"
        value={formData.code}
        onChange={(e) => setFormData({...formData, code: e.target.value})}
        placeholder="Course Code (e.g., MATH_FORM1_OL) *"
        required
      />
      
      <textarea
        value={formData.description}
        onChange={(e) => setFormData({...formData, description: e.target.value})}
        placeholder="Course Description *"
        required
      />
      
      <select
        value={formData.subject || ''}
        onChange={(e) => setFormData({...formData, subject: e.target.value})}
        required
      >
        <option value="">Select Subject *</option>
        {subjects.map(s => (
          <option key={s.id} value={s.id}>
            {s.icon} {s.name}
          </option>
        ))}
      </select>
      
      <select
        value={formData.curriculum || ''}
        onChange={(e) => setFormData({...formData, curriculum: e.target.value})}
        required
      >
        <option value="">Select Curriculum *</option>
        {curricula.map(c => (
          <option key={c.id} value={c.id}>
            {c.name} {c.program_name && `(${c.program_name})`}
          </option>
        ))}
      </select>
      
      <input
        type="number"
        value={formData.estimated_hours}
        onChange={(e) => setFormData({...formData, estimated_hours: parseInt(e.target.value)})}
        placeholder="Estimated Hours *"
        min="1"
        required
      />
      
      {/* Optional Fields */}
      <h3>Course Details (Optional)</h3>
      
      <select
        value={formData.course_type}
        onChange={(e) => setFormData({...formData, course_type: e.target.value})}
      >
        {COURSE_TYPE_OPTIONS.map(t => (
          <option key={t.value} value={t.value}>{t.label}</option>
        ))}
      </select>
      
      <select
        value={formData.program || ''}
        onChange={(e) => setFormData({
          ...formData, 
          program: e.target.value || null,
          class_level: null // Reset class level when program changes
        })}
      >
        <option value="">Select Program (Optional)</option>
        {programs.map(p => (
          <option key={p.id} value={p.id}>
            {p.name} - {p.education_level_name}
          </option>
        ))}
      </select>
      
      <select
        value={formData.class_level || ''}
        onChange={(e) => setFormData({...formData, class_level: e.target.value || null})}
        disabled={!formData.program}
      >
        <option value="">Select Class Level (Optional)</option>
        {filteredClassLevels.map(c => (
          <option key={c.id} value={c.id}>
            {c.name} (Ages {c.age_range_start}-{c.age_range_end})
          </option>
        ))}
      </select>
      
      <select
        value={formData.difficulty}
        onChange={(e) => setFormData({...formData, difficulty: e.target.value})}
      >
        {DIFFICULTY_OPTIONS.map(d => (
          <option key={d.value} value={d.value}>{d.label}</option>
        ))}
      </select>
      
      <select
        value={formData.language}
        onChange={(e) => setFormData({...formData, language: e.target.value})}
      >
        {LANGUAGE_OPTIONS.map(l => (
          <option key={l.value} value={l.value}>{l.label}</option>
        ))}
      </select>
      
      {/* Entrance Exam Fields (show only if course_type is entrance_exam) */}
      {formData.course_type === 'entrance_exam' && (
        <>
          <h3>Entrance Exam Details</h3>
          
          <input
            type="text"
            value={formData.exam_board}
            onChange={(e) => setFormData({...formData, exam_board: e.target.value})}
            placeholder="Exam Board (e.g., WAEC, JAMB)"
          />
          
          <input
            type="number"
            value={formData.exam_year || ''}
            onChange={(e) => setFormData({...formData, exam_year: parseInt(e.target.value) || null})}
            placeholder="Exam Year"
            min={new Date().getFullYear()}
          />
          
          <input
            type="number"
            value={formData.passing_score || ''}
            onChange={(e) => setFormData({...formData, passing_score: parseInt(e.target.value) || null})}
            placeholder="Passing Score"
            min="0"
            max="100"
          />
          
          <input
            type="text"
            value={formData.exam_format}
            onChange={(e) => setFormData({...formData, exam_format: e.target.value})}
            placeholder="Exam Format (e.g., Multiple Choice)"
          />
        </>
      )}
      
      {/* Pricing */}
      <h3>Pricing</h3>
      
      <label>
        <input
          type="checkbox"
          checked={formData.is_free}
          onChange={(e) => setFormData({
            ...formData, 
            is_free: e.target.checked,
            price: e.target.checked ? 0 : formData.price
          })}
        />
        Free Course
      </label>
      
      {!formData.is_free && (
        <>
          <input
            type="number"
            value={formData.price}
            onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value) || 0})}
            placeholder="Price"
            min="0"
            step="0.01"
          />
          
          <select
            value={formData.currency}
            onChange={(e) => setFormData({...formData, currency: e.target.value})}
          >
            {CURRENCY_OPTIONS.map(c => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </>
      )}
      
      <button type="submit">Create Course</button>
    </form>
  );
}

export default CreateAcademicCourseForm;
```

---

## API Endpoints Summary

### Approach Comparison

| Approach | Pros | Cons | Best For |
|----------|------|------|----------|
| **Individual Admin Endpoints** | ✅ Latest data<br>✅ Pagination<br>✅ Filtering<br>✅ Proper auth | ❌ Multiple requests<br>❌ More code | Admin panels, data tables, advanced filtering |
| **Batch Endpoint (`/education-options/`)** | ✅ Single request<br>✅ No auth needed<br>✅ Good for caching | ❌ No pagination<br>❌ Returns all data<br>❌ May have stale data | Public forms, mobile apps, prototyping |
| **Hybrid Approach** | ✅ Fewer requests<br>✅ Auth where needed<br>✅ Balance of both | ❌ Slightly complex | Production apps with mixed requirements |

### Required for Form Prepopulation

| Field | Endpoint | Required | Filterable |
|-------|----------|----------|------------|
| **subject** | `/api/content/admin/subjects/` | ✅ Yes | No |
| **program** | `/api/education/admin/programs/` | ❌ No | By `is_active` |
| **class_level** | `/api/education/admin/class-levels/` | ❌ No | By `program`, `is_active` |
| **curriculum** | `/api/education/admin/curricula/` | ✅ Yes | By `program`, `year`, `semester`, `is_active` |
| **course_type** | Hardcoded options | ❌ No | N/A |
| **difficulty** | Hardcoded options | ❌ No | N/A |
| **language** | Hardcoded options | ❌ No | N/A |
| **currency** | Hardcoded options | ❌ No | N/A |

---

## Best Practices

### 1. Load Data on Mount
```javascript
useEffect(() => {
  // Option A: Fetch all dropdown data individually (admin)
  loadSubjects();
  loadPrograms();
  loadClassLevels();
  loadCurricula();
  
  // Option B: Use batch endpoint for non-critical data
  loadEducationOptions(); // Programs, ClassLevels from /api/auth/education-options/
  loadSubjects(); // Always fetch subjects from admin endpoint
  loadCurricula(); // Always fetch curricula from admin endpoint
}, []);
```

### 2. Cache API Responses
```javascript
// Use React Query or SWR for caching
import { useQuery } from '@tanstack/react-query';

const { data: subjects } = useQuery({
  queryKey: ['subjects'],
  queryFn: () => fetch('/api/content/admin/subjects/').then(r => r.json()),
  staleTime: 1000 * 60 * 10 // Cache for 10 minutes
});

const { data: curricula } = useQuery({
  queryKey: ['curricula'],
  queryFn: () => fetch('/api/education/admin/curricula/?is_active=true').then(r => r.json()),
  staleTime: 1000 * 60 * 10 // Cache for 10 minutes
});

// Cache the batch endpoint for longer (less critical data)
const { data: educationOptions } = useQuery({
  queryKey: ['education-options'],
  queryFn: () => fetch('/api/auth/education-options/').then(r => r.json()),
  staleTime: 1000 * 60 * 30 // Cache for 30 minutes
});
```

### 3. Cascade Dropdowns
```javascript
// When program changes, filter class levels
useEffect(() => {
  if (selectedProgram) {
    setFilteredClassLevels(
      classLevels.filter(c => c.program === selectedProgram)
    );
  } else {
    setFilteredClassLevels(classLevels);
  }
}, [selectedProgram, classLevels]);
```

### 4. Show Loading States
```javascript
{loading ? (
  <option>Loading subjects...</option>
) : (
  subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)
)}
```

### 5. Handle Errors Gracefully
```javascript
const [error, setError] = useState(null);

if (error) {
  return <div>Error loading form data: {error.message}</div>;
}
```

### 6. Consider Using Batch Endpoint for Performance
```javascript
// For better initial load performance, fetch static options from batch endpoint
// and only fetch dynamic/critical data from admin endpoints
const loadFormData = async () => {
  try {
    const token = localStorage.getItem('token');
    
    // Single request for non-critical, relatively static data (no auth)
    const educationOptions = await fetch('/api/auth/education-options/').then(r => r.json());
    
    // Parallel requests for critical, frequently updated data (with auth)
    const [subjects, curricula] = await Promise.all([
      fetch('/api/content/admin/subjects/', { 
        headers: { 'Authorization': `Bearer ${token}` } 
      }).then(r => r.json()),
      fetch('/api/education/admin/curricula/?is_active=true', { 
        headers: { 'Authorization': `Bearer ${token}` } 
      }).then(r => r.json())
    ]);
    
    // Combine the data
    setFormData({
      subjects: subjects.results,
      curricula: curricula.results,
      programs: educationOptions.programs,
      classLevels: educationOptions.classLevels
    });
  } catch (error) {
    console.error('Failed to load form data:', error);
    setError(error);
  }
};
```

---

## Complete Payload Example with All Fields

```json
{
  "title": "JAMB Mathematics Preparation 2025",
  "code": "JAMB_MATH_2025",
  "description": "Complete preparation course for JAMB Mathematics examination",
  "subject": "550e8400-e29b-41d4-a716-446655440001",
  "curriculum": "550e8400-e29b-41d4-a716-446655440004",
  "estimated_hours": 60,
  "course_type": "entrance_exam",
  "program": "550e8400-e29b-41d4-a716-446655440002",
  "class_level": "550e8400-e29b-41d4-a716-446655440003",
  "difficulty": "intermediate",
  "exam_board": "JAMB",
  "exam_year": 2025,
  "passing_score": 50,
  "exam_format": "Multiple Choice (60 questions)",
  "priority_order": 5,
  "is_published": false,
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

---

## Alternative: Using the Batch Endpoint

If you prefer to fetch all data in one request (useful for caching or offline support):

```javascript
// Fetch all education options at once
const educationOptions = await fetch('/api/auth/education-options/')
  .then(r => r.json());

// Extract what you need
const subjects = await fetch('/api/content/admin/subjects/', {
  headers: { 'Authorization': `Bearer ${token}` }
}).then(r => r.json());

// Use education-options data for other dropdowns
const formData = {
  subjects: subjects.results,
  programs: educationOptions.programs.filter(p => p.is_active !== false),
  classLevels: educationOptions.classLevels,
  // Note: For curricula, use the admin endpoint for database data
  curricula: await fetch('/api/education/admin/curricula/?is_active=true', {
    headers: { 'Authorization': `Bearer ${token}` }
  }).then(r => r.json()).then(d => d.results)
};
```

**Recommendation:** For admin panels, use individual admin endpoints for better control. Use `education-options` for:
- Public-facing forms
- Quick prototyping
- Mobile apps with offline caching
- Non-admin contexts

---

## Notes

- **Subjects** must be fetched from API (required field) - `/api/content/admin/subjects/`
- **Curriculum** must be fetched from API (required field) - `/api/education/admin/curricula/`
- **Programs** and **Class Levels** are optional but useful for organization
- **Course Type**, **Difficulty**, **Language**, **Currency** can be hardcoded (no database models)
- Class levels should be filtered by selected program for better UX
- Curricula can be filtered by program for better organization
- All endpoints require authentication (Bearer token)
- Responses include pagination - use `.results` array for data

---

## 🚀 Performance Tip: Hybrid Approach

For optimal performance in production, use this strategy:

1. **Use `/api/auth/education-options/`** for:
   - Programs (changes infrequently)
   - Class Levels (relatively static)
   - Countries, Schools, Faculties (if needed)

2. **Use admin endpoints** for:
   - Subjects (course-critical data)
   - Curricula (frequently updated)
   - Any data that requires real-time accuracy

This reduces authenticated API calls from **4 to 2** while maintaining data accuracy for critical fields! 📊

**Example:**
```javascript
// 1 unauthenticated + 2 authenticated = 3 total requests instead of 4
const [educationOptions, subjects, curricula] = await Promise.all([
  fetch('/api/auth/education-options/'),                          // No auth
  fetch('/api/content/admin/subjects/', { headers }),              // Auth
  fetch('/api/education/admin/curricula/?is_active=true', { headers })  // Auth
]);
```

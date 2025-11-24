# Education Options Management Dashboard API Documentation

## Table of Contents
1. [Overview](#overview)
2. [Data Structure & Relationships](#data-structure--relationships)
3. [Endpoints](#endpoints)
4. [Data Flow & Workflows](#data-flow--workflows)
5. [Important Notes](#important-notes)

---

## Overview

This documentation covers the Education Options Management API for managing the educational structure hierarchy. This includes countries, education levels, schools, faculties, class levels, programs, curricula, and subjects.

**Base URL:** `/api/education/admin/`

**Authentication:** All admin endpoints require staff authentication.

---

## Data Structure & Relationships

### Hierarchy

```
Country
  └── EducationLevel
      └── School
          ├── Faculty (for universities)
          │   └── Program
          │       └── Curriculum
          └── ClassLevel (for primary/secondary)
              └── Program
                  └── Curriculum

Subject (standalone, referenced by curricula)
```

### Key Relationships

- **Country** → Has many **EducationLevels**
- **EducationLevel** → Belongs to **Country**, has many **Schools**
- **School** → Belongs to **Country** and **EducationLevel**, has many **Faculties** and **ClassLevels**
- **Faculty** → Belongs to **School**, has many **Programs**
- **ClassLevel** → Belongs to **School** and **EducationLevel**, has many **Programs**
- **Program** → Belongs to **School**, optionally to **Faculty** or **ClassLevel**, has many **Curricula**
- **Curriculum** → Belongs to **Program**, references **Subjects** (JSON array)
- **Subject** → Standalone, referenced by curricula

---

## Endpoints

### Countries

#### List Countries
```
GET /api/education/admin/countries/
```

**Query Parameters:**
- `search` - Search in name, code
- `ordering` - Order by field (name, code, created_at)
- `is_active` - Filter by active status (via filter)

**Response:**
```json
[
  {
    "id": "cm",
    "name": "Cameroon",
    "code": "CM",
    "flag_emoji": "🇨🇲",
    "is_active": true,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
]
```

#### Create Country
```
POST /api/education/admin/countries/
Body: {
  "id": "cm",
  "name": "Cameroon",
  "code": "CM",
  "flag_emoji": "🇨🇲",
  "is_active": true
}
```

**Note:** `id` is a string (country code), not UUID.

#### Get Country Detail
```
GET /api/education/admin/countries/{id}/
```

#### Update Country
```
PUT /api/education/admin/countries/{id}/
PATCH /api/education/admin/countries/{id}/
```

#### Delete Country
```
DELETE /api/education/admin/countries/{id}/
```

---

### Education Levels

#### List Education Levels
```
GET /api/education/admin/education-levels/
```

**Query Parameters:**
- `country` - Filter by country ID
- `is_active` - Filter by active status
- `search` - Search in name, age_range
- `ordering` - Order by field (order, name, created_at)

**Response:**
```json
[
  {
    "id": "primary",
    "name": "Primary Education",
    "age_range": "6-11 years",
    "country": {
      "id": "cm",
      "name": "Cameroon",
      "code": "CM",
      "flag_emoji": "🇨🇲"
    },
    "country_id": "cm",
    "order": 2,
    "is_active": true,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
]
```

#### Create Education Level
```
POST /api/education/admin/education-levels/
Body: {
  "id": "primary",
  "name": "Primary Education",
  "age_range": "6-11 years",
  "country_id": "cm",
  "order": 2,
  "is_active": true
}
```

**Note:** 
- `id` is a string identifier
- `country_id` is required (use country's `id` field, not UUID)
- `order` must be unique per country

#### Get Education Level Detail
```
GET /api/education/admin/education-levels/{id}/
```

#### Update Education Level
```
PUT /api/education/admin/education-levels/{id}/
PATCH /api/education/admin/education-levels/{id}/
```

#### Delete Education Level
```
DELETE /api/education/admin/education-levels/{id}/
```

---

### Schools

#### List Schools
```
GET /api/education/admin/schools/
```

**Query Parameters:**
- `country` - Filter by country ID
- `education_level` - Filter by education level ID
- `type` - Filter by school type
- `is_active` - Filter by active status
- `search` - Search in name, location, description, type
- `ordering` - Order by field (name, established, created_at)

**Response:**
```json
[
  {
    "id": "university-of-yaounde",
    "name": "University of Yaoundé I",
    "country": {
      "id": "cm",
      "name": "Cameroon",
      "code": "CM"
    },
    "country_id": "cm",
    "education_level": {
      "id": "university",
      "name": "University",
      "age_range": "18+ years"
    },
    "education_level_id": "university",
    "type": "Public University",
    "location": "Yaoundé, Cameroon",
    "established": 1962,
    "description": "Leading university in Cameroon",
    "logo": "/media/school_logos/uniyaounde.jpg",
    "website": "https://www.uy1.uninet.cm",
    "is_active": true,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
]
```

#### Create School
```
POST /api/education/admin/schools/
Body: {
  "id": "university-of-yaounde",
  "name": "University of Yaoundé I",
  "country_id": "cm",
  "education_level_id": "university",
  "type": "Public University",
  "location": "Yaoundé, Cameroon",
  "established": 1962,
  "description": "Leading university in Cameroon",
  "logo": <file upload>,
  "website": "https://www.uy1.uninet.cm",
  "is_active": true
}
```

**Note:** 
- `id` is a string identifier (slug-like)
- `country_id` and `education_level_id` are required
- `logo` is optional file upload

#### Get School Detail
```
GET /api/education/admin/schools/{id}/
```

#### Update School
```
PUT /api/education/admin/schools/{id}/
PATCH /api/education/admin/schools/{id}/
```

#### Delete School
```
DELETE /api/education/admin/schools/{id}/
```

---

### Faculties

#### List Faculties
```
GET /api/education/admin/faculties/
```

**Query Parameters:**
- `school` - Filter by school ID
- `type` - Filter by faculty type (faculty, school, college, department)
- `is_active` - Filter by active status
- `search` - Search in name, description
- `ordering` - Order by field (name, created_at)

**Response:**
```json
[
  {
    "id": "faculty-of-science",
    "name": "Faculty of Science",
    "school": {
      "id": "university-of-yaounde",
      "name": "University of Yaoundé I"
    },
    "school_id": "university-of-yaounde",
    "description": "Science and technology programs",
    "icon": "🔬",
    "type": "faculty",
    "is_active": true,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
]
```

#### Create Faculty
```
POST /api/education/admin/faculties/
Body: {
  "id": "faculty-of-science",
  "name": "Faculty of Science",
  "school_id": "university-of-yaounde",
  "description": "Science and technology programs",
  "icon": "🔬",
  "type": "faculty",
  "is_active": true
}
```

**Note:** 
- `id` is a string identifier
- `school_id` is required
- `type` choices: `faculty`, `school`, `college`, `department`

#### Get Faculty Detail
```
GET /api/education/admin/faculties/{id}/
```

#### Update Faculty
```
PUT /api/education/admin/faculties/{id}/
PATCH /api/education/admin/faculties/{id}/
```

#### Delete Faculty
```
DELETE /api/education/admin/faculties/{id}/
```

---

### Class Levels

#### List Class Levels
```
GET /api/education/admin/class-levels/
```

**Query Parameters:**
- `school` - Filter by school ID
- `education_level` - Filter by education level ID
- `is_active` - Filter by active status
- `search` - Search in name, description
- `ordering` - Order by field (order, name, created_at)

**Response:**
```json
[
  {
    "id": "form-1",
    "name": "Form 1",
    "school": {
      "id": "gbhs-yaounde",
      "name": "Government Bilingual High School Yaoundé"
    },
    "school_id": "gbhs-yaounde",
    "education_level": {
      "id": "secondary",
      "name": "Secondary Education"
    },
    "education_level_id": "secondary",
    "description": "First year of secondary education",
    "icon": "📚",
    "age_range": "12-13 years",
    "order": 1,
    "is_active": true,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
]
```

#### Create Class Level
```
POST /api/education/admin/class-levels/
Body: {
  "id": "form-1",
  "name": "Form 1",
  "school_id": "gbhs-yaounde",
  "education_level_id": "secondary",
  "description": "First year of secondary education",
  "icon": "📚",
  "age_range": "12-13 years",
  "order": 1,
  "is_active": true
}
```

**Note:** 
- `id` is a string identifier
- `school_id` and `education_level_id` are required
- `order` must be unique per school

#### Get Class Level Detail
```
GET /api/education/admin/class-levels/{id}/
```

#### Update Class Level
```
PUT /api/education/admin/class-levels/{id}/
PATCH /api/education/admin/class-levels/{id}/
```

#### Delete Class Level
```
DELETE /api/education/admin/class-levels/{id}/
```

#### Reorder Class Levels
```
POST /api/education/admin/class-levels/reorder/
Body: {
  "class_levels": [
    {"id": "form-1", "order": 1},
    {"id": "form-2", "order": 2},
    {"id": "form-3", "order": 3}
  ]
}
```

---

### Programs

#### List Programs
```
GET /api/education/admin/programs/
```

**Query Parameters:**
- `school` - Filter by school ID
- `faculty` - Filter by faculty ID
- `class_level` - Filter by class level ID
- `difficulty` - Filter by difficulty (beginner, intermediate, advanced, expert)
- `is_active` - Filter by active status
- `search` - Search in name, degree, description
- `ordering` - Order by field (name, difficulty, created_at)

**Response:**
```json
[
  {
    "id": "computer-science-bsc",
    "name": "Bachelor of Science in Computer Science",
    "school": {
      "id": "university-of-yaounde",
      "name": "University of Yaoundé I"
    },
    "school_id": "university-of-yaounde",
    "faculty": {
      "id": "faculty-of-science",
      "name": "Faculty of Science"
    },
    "faculty_id": "faculty-of-science",
    "class_level": null,
    "class_level_id": null,
    "degree": "Bachelor of Science",
    "duration": "4 years",
    "description": "Comprehensive computer science program",
    "icon": "💻",
    "difficulty": "intermediate",
    "is_active": true,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
]
```

#### Create Program
```
POST /api/education/admin/programs/
Body: {
  "id": "computer-science-bsc",
  "name": "Bachelor of Science in Computer Science",
  "school_id": "university-of-yaounde",
  "faculty_id": "faculty-of-science",
  "class_level_id": null,
  "degree": "Bachelor of Science",
  "duration": "4 years",
  "description": "Comprehensive computer science program",
  "icon": "💻",
  "difficulty": "intermediate",
  "is_active": true
}
```

**Note:** 
- `id` is a string identifier
- `school_id` is required
- `faculty_id` and `class_level_id` are optional (one or both can be null)
- `difficulty` choices: `beginner`, `intermediate`, `advanced`, `expert`

#### Get Program Detail
```
GET /api/education/admin/programs/{id}/
```

#### Update Program
```
PUT /api/education/admin/programs/{id}/
PATCH /api/education/admin/programs/{id}/
```

#### Delete Program
```
DELETE /api/education/admin/programs/{id}/
```

---

### Curricula

#### List Curricula
```
GET /api/education/admin/curricula/
```

**Query Parameters:**
- `program` - Filter by program ID
- `year` - Filter by year
- `semester` - Filter by semester (first, second, both)
- `is_active` - Filter by active status
- `search` - Search in name, description
- `ordering` - Order by field (year, semester, name, created_at)

**Response:**
```json
[
  {
    "id": "cs-year-1-semester-1",
    "name": "Computer Science Year 1 Semester 1",
    "program": {
      "id": "computer-science-bsc",
      "name": "Bachelor of Science in Computer Science"
    },
    "program_id": "computer-science-bsc",
    "year": 1,
    "semester": "first",
    "subjects": [
      "Introduction to Programming",
      "Mathematics I",
      "Physics I",
      "English Communication"
    ],
    "description": "First semester curriculum for year 1",
    "is_active": true,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
]
```

#### Create Curriculum
```
POST /api/education/admin/curricula/
Body: {
  "id": "cs-year-1-semester-1",
  "name": "Computer Science Year 1 Semester 1",
  "program_id": "computer-science-bsc",
  "year": 1,
  "semester": "first",
  "subjects": [
    "Introduction to Programming",
    "Mathematics I",
    "Physics I",
    "English Communication"
  ],
  "description": "First semester curriculum for year 1",
  "is_active": true
}
```

**Note:** 
- `id` is a string identifier
- `program_id` is required
- `year` is a positive integer
- `semester` choices: `first`, `second`, `both`
- `subjects` is a JSON array of subject names (strings)
- Combination of `program`, `year`, and `semester` must be unique

#### Get Curriculum Detail
```
GET /api/education/admin/curricula/{id}/
```

#### Update Curriculum
```
PUT /api/education/admin/curricula/{id}/
PATCH /api/education/admin/curricula/{id}/
```

#### Delete Curriculum
```
DELETE /api/education/admin/curricula/{id}/
```

---

### Subjects

#### List Subjects
```
GET /api/education/admin/subjects/
```

**Query Parameters:**
- `search` - Search in name, description
- `ordering` - Order by field (name, created_at)

**Response:**
```json
[
  {
    "id": "mathematics",
    "name": "Mathematics",
    "description": "Mathematical concepts and problem-solving",
    "icon": "📐",
    "color": "#3B82F6",
    "is_active": true,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
]
```

#### Create Subject
```
POST /api/education/admin/subjects/
Body: {
  "id": "mathematics",
  "name": "Mathematics",
  "description": "Mathematical concepts and problem-solving",
  "icon": "📐",
  "color": "#3B82F6",
  "is_active": true
}
```

**Note:** 
- `id` is a string identifier
- `color` should be a hex color code (e.g., "#3B82F6")

#### Get Subject Detail
```
GET /api/education/admin/subjects/{id}/
```

#### Update Subject
```
PUT /api/education/admin/subjects/{id}/
PATCH /api/education/admin/subjects/{id}/
```

#### Delete Subject
```
DELETE /api/education/admin/subjects/{id}/
```

---

## Data Flow & Workflows

### Creating a Complete Educational Structure

#### Workflow 1: University Structure

1. **Create Country** (if not exists)
   ```
   POST /api/education/admin/countries/
   ```

2. **Create Education Level**
   ```
   POST /api/education/admin/education-levels/
   Body: {
     "id": "university",
     "name": "University",
     "country_id": "cm",
     "order": 4
   }
   ```

3. **Create School**
   ```
   POST /api/education/admin/schools/
   Body: {
     "id": "university-of-yaounde",
     "name": "University of Yaoundé I",
     "country_id": "cm",
     "education_level_id": "university",
     "type": "Public University"
   }
   ```

4. **Create Faculty**
   ```
   POST /api/education/admin/faculties/
   Body: {
     "id": "faculty-of-science",
     "name": "Faculty of Science",
     "school_id": "university-of-yaounde",
     "type": "faculty"
   }
   ```

5. **Create Program**
   ```
   POST /api/education/admin/programs/
   Body: {
     "id": "computer-science-bsc",
     "name": "Bachelor of Science in Computer Science",
     "school_id": "university-of-yaounde",
     "faculty_id": "faculty-of-science",
     "degree": "Bachelor of Science",
     "duration": "4 years"
   }
   ```

6. **Create Curriculum** (for each year/semester)
   ```
   POST /api/education/admin/curricula/
   Body: {
     "id": "cs-year-1-semester-1",
     "name": "Year 1 Semester 1",
     "program_id": "computer-science-bsc",
     "year": 1,
     "semester": "first",
     "subjects": ["Mathematics", "Physics", "Programming"]
   }
   ```

#### Workflow 2: Primary/Secondary School Structure

1. **Create Country** (if not exists)
   ```
   POST /api/education/admin/countries/
   ```

2. **Create Education Level**
   ```
   POST /api/education/admin/education-levels/
   Body: {
     "id": "secondary",
     "name": "Secondary Education",
     "country_id": "cm",
     "order": 3
   }
   ```

3. **Create School**
   ```
   POST /api/education/admin/schools/
   Body: {
     "id": "gbhs-yaounde",
     "name": "Government Bilingual High School Yaoundé",
     "country_id": "cm",
     "education_level_id": "secondary",
     "type": "Public Secondary School"
   }
   ```

4. **Create Class Level**
   ```
   POST /api/education/admin/class-levels/
   Body: {
     "id": "form-1",
     "name": "Form 1",
     "school_id": "gbhs-yaounde",
     "education_level_id": "secondary",
     "order": 1
   }
   ```

5. **Create Program** (optional, for specific programs within class level)
   ```
   POST /api/education/admin/programs/
   Body: {
     "id": "form-1-general",
     "name": "Form 1 General Program",
     "school_id": "gbhs-yaounde",
     "class_level_id": "form-1",
     "degree": "General Certificate",
     "duration": "1 year"
   }
   ```

6. **Create Curriculum**
   ```
   POST /api/education/admin/curricula/
   Body: {
     "id": "form-1-curriculum",
     "name": "Form 1 Curriculum",
     "program_id": "form-1-general",
     "year": 1,
     "semester": "both",
     "subjects": ["Mathematics", "English", "French", "Science"]
   }
   ```

### Creating Subjects

Subjects are standalone and can be created independently:

```
POST /api/education/admin/subjects/
Body: {
  "id": "mathematics",
  "name": "Mathematics",
  "description": "Mathematical concepts",
  "icon": "📐",
  "color": "#3B82F6"
}
```

Subjects are then referenced by name in curriculum `subjects` arrays.

---

## Important Notes

### ID Format

- **All IDs are strings**, not UUIDs
- IDs should be URL-friendly (lowercase, hyphens, no spaces)
- Examples: `"cm"`, `"university"`, `"university-of-yaounde"`, `"form-1"`

### Foreign Key References

- Use `{field}_id` for write operations (e.g., `country_id`, `school_id`)
- Use nested objects for read operations (e.g., `country`, `school`)
- All foreign key IDs are strings matching the related model's `id` field

### Order Management

- **EducationLevel**: `order` must be unique per country
- **ClassLevel**: `order` must be unique per school
- Use the `reorder` endpoint for ClassLevels to bulk update orders

### Unique Constraints

- **EducationLevel**: `(country, order)` must be unique
- **ClassLevel**: `(school, order)` must be unique
- **Curriculum**: `(program, year, semester)` must be unique

### File Uploads

- **School logo**: Use `multipart/form-data` for file uploads
- File field: `logo` (ImageField)

### Subjects in Curricula

- `subjects` field in Curriculum is a JSON array of strings
- These are subject names, not IDs
- Subjects should be created separately and referenced by name
- Example: `["Mathematics", "Physics", "Chemistry"]`

### Active Status

- All models have `is_active` field
- Use `is_active: false` to soft-delete (recommended)
- Hard delete removes the record permanently

### Cascading Deletes

- Deleting a **Country** deletes all related EducationLevels and Schools
- Deleting a **School** deletes all related Faculties, ClassLevels, and Programs
- Deleting a **Program** deletes all related Curricula
- Be careful with deletions - they cascade down the hierarchy

### Filtering and Search

- Most endpoints support filtering by related models
- Search fields vary by endpoint (check query parameters)
- Use `ordering` parameter to sort results

### Permissions

- All admin endpoints require **staff authentication**
- Regular users can access read-only public endpoints at `/api/education/`

---

## Summary

This API provides full CRUD operations for managing the complete educational structure hierarchy. Key points:

1. **String IDs**: All models use string IDs, not UUIDs
2. **Hierarchical Structure**: Build from top (Country) to bottom (Curriculum)
3. **Flexible Programs**: Programs can belong to Faculties (university) or ClassLevels (school)
4. **Subject References**: Subjects are referenced by name in curricula
5. **Order Management**: Use `order` fields and `reorder` endpoints for proper sequencing
6. **Soft Deletes**: Use `is_active: false` instead of hard deletes when possible

For any questions or clarifications, refer to the API schema at `/api/schema/` or the Swagger documentation at `/api/docs/`.


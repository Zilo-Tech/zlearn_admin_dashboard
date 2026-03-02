# Frontend Implementation Guide: Course Import

> **For Frontend Developers** - How to implement the course import feature

**Endpoint:** `POST /api/courses/admin/courses/import_course/`  
**Auth Required:** Yes (Token or Session)  
**Permission:** Staff or Instructor  
**Last Updated:** March 2026

---

## 📋 Table of Contents

1. [Quick Implementation](#quick-implementation)
2. [File Upload Component](#file-upload-component)
3. [API Integration](#api-integration)
4. [Error Handling](#error-handling)
5. [UI/UX Best Practices](#uiux-best-practices)
6. [Complete Examples](#complete-examples)
7. [Testing](#testing)

---

## 🚀 Quick Implementation

### What You Need to Build

1. **File picker/uploader** - Let users select JSON file
2. **Validation** - Check file type and size before upload
3. **Upload button** - Trigger the import
4. **Progress indicator** - Show upload status
5. **Success/error feedback** - Display results to user
6. **Preview (optional)** - Show what will be imported

---

## 📤 File Upload Component

### Basic HTML Structure

```html
<div class="course-import-container">
  <!-- File Picker -->
  <div class="file-picker">
    <input 
      type="file" 
      id="courseFile" 
      accept=".json,application/json"
      @change="handleFileSelect"
    />
    <label for="courseFile">
      <span>Choose JSON File</span>
      <span class="hint">Or drag and drop here</span>
    </label>
  </div>

  <!-- Selected File Info -->
  <div class="file-info" v-if="selectedFile">
    <p>📄 {{ selectedFile.name }}</p>
    <p>{{ formatFileSize(selectedFile.size) }}</p>
  </div>

  <!-- Import Button -->
  <button 
    @click="importCourse" 
    :disabled="!selectedFile || isUploading"
    class="btn-import"
  >
    {{ isUploading ? 'Importing...' : 'Import Course' }}
  </button>

  <!-- Progress Bar -->
  <div class="progress" v-if="isUploading">
    <div class="progress-bar" :style="{ width: uploadProgress + '%' }"></div>
  </div>

  <!-- Results -->
  <div class="result success" v-if="importResult">
    <h3>✅ Course Imported Successfully!</h3>
    <p><strong>{{ importResult.course.title }}</strong></p>
    <p>Code: {{ importResult.course.course_code }}</p>
    <ul>
      <li>{{ importResult.stats.modules }} modules</li>
      <li>{{ importResult.stats.lessons }} lessons</li>
      <li>{{ importResult.stats.sections }} sections</li>
    </ul>
    <a :href="`/courses/${importResult.course.id}/edit`">Edit Course</a>
  </div>

  <!-- Errors -->
  <div class="result error" v-if="importError">
    <h3>❌ Import Failed</h3>
    <p>{{ importError }}</p>
  </div>
</div>
```

---

## 🔌 API Integration

### Vanilla JavaScript

```javascript
async function importCourse(file) {
  // Create FormData
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch('/api/courses/admin/courses/import_course/', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${localStorage.getItem('authToken')}`,
        // Don't set Content-Type - browser will set it with boundary
      },
      body: formData
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Import failed');
    }

    const result = await response.json();
    console.log('Import successful:', result);
    return result;

  } catch (error) {
    console.error('Import error:', error);
    throw error;
  }
}

// Usage
document.getElementById('importBtn').addEventListener('click', async () => {
  const fileInput = document.getElementById('courseFile');
  const file = fileInput.files[0];

  if (!file) {
    alert('Please select a file');
    return;
  }

  try {
    const result = await importCourse(file);
    alert(`Course imported: ${result.course.title}`);
  } catch (error) {
    alert(`Error: ${error.message}`);
  }
});
```

### React (Functional Component)

```javascript
import React, { useState } from 'react';
import axios from 'axios';

function CourseImporter() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    
    // Validation
    if (!file) return;
    
    if (!file.name.endsWith('.json')) {
      setError('Please select a JSON file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      setError('File too large (max 10MB)');
      return;
    }

    setSelectedFile(file);
    setError(null);
  };

  const importCourse = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('file', selectedFile);

    setIsUploading(true);
    setError(null);
    setResult(null);

    try {
      const response = await axios.post(
        '/api/courses/admin/courses/import_course/',
        formData,
        {
          headers: {
            'Authorization': `Token ${localStorage.getItem('authToken')}`,
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(progress);
          },
        }
      );

      setResult(response.data);
      setSelectedFile(null);
      
      // Optional: Redirect to course edit page
      // navigate(`/courses/${response.data.course.id}/edit`);

    } catch (err) {
      const errorMessage = err.response?.data?.error || 
                          err.response?.data?.detail ||
                          err.message ||
                          'Import failed';
      setError(errorMessage);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="course-importer">
      <h2>Import Course from JSON</h2>

      {/* File Picker */}
      <div className="file-picker">
        <input
          type="file"
          accept=".json"
          onChange={handleFileSelect}
          disabled={isUploading}
        />
      </div>

      {/* Selected File Info */}
      {selectedFile && (
        <div className="file-info">
          <p>📄 {selectedFile.name}</p>
          <p>{(selectedFile.size / 1024).toFixed(2)} KB</p>
        </div>
      )}

      {/* Import Button */}
      <button
        onClick={importCourse}
        disabled={!selectedFile || isUploading}
        className="btn-import"
      >
        {isUploading ? 'Importing...' : 'Import Course'}
      </button>

      {/* Progress Bar */}
      {isUploading && (
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${uploadProgress}%` }}
          />
          <span>{uploadProgress}%</span>
        </div>
      )}

      {/* Success Result */}
      {result && (
        <div className="alert alert-success">
          <h3>✅ Course Imported Successfully!</h3>
          <p><strong>{result.course.title}</strong></p>
          <p>Code: {result.course.course_code}</p>
          <ul>
            <li>{result.stats.modules} modules</li>
            <li>{result.stats.lessons} lessons</li>
            <li>{result.stats.sections} sections</li>
            <li>{result.stats.quizzes} quizzes</li>
            <li>{result.stats.resources} resources</li>
          </ul>
          <a href={`/courses/${result.course.id}/edit`}>
            Edit Course
          </a>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="alert alert-error">
          <h3>❌ Import Failed</h3>
          <p>{error}</p>
        </div>
      )}
    </div>
  );
}

export default CourseImporter;
```

### Vue 3 (Composition API)

```javascript
<template>
  <div class="course-importer">
    <h2>Import Course from JSON</h2>

    <!-- File Picker -->
    <div class="file-picker">
      <input
        type="file"
        ref="fileInput"
        accept=".json"
        @change="handleFileSelect"
        :disabled="isUploading"
      />
    </div>

    <!-- Selected File Info -->
    <div v-if="selectedFile" class="file-info">
      <p>📄 {{ selectedFile.name }}</p>
      <p>{{ formatFileSize(selectedFile.size) }}</p>
    </div>

    <!-- Import Button -->
    <button
      @click="importCourse"
      :disabled="!selectedFile || isUploading"
      class="btn-import"
    >
      {{ isUploading ? 'Importing...' : 'Import Course' }}
    </button>

    <!-- Progress Bar -->
    <div v-if="isUploading" class="progress-bar">
      <div class="progress-fill" :style="{ width: uploadProgress + '%' }"></div>
      <span>{{ uploadProgress }}%</span>
    </div>

    <!-- Success Result -->
    <div v-if="importResult" class="alert alert-success">
      <h3>✅ Course Imported Successfully!</h3>
      <p><strong>{{ importResult.course.title }}</strong></p>
      <p>Code: {{ importResult.course.course_code }}</p>
      <ul>
        <li>{{ importResult.stats.modules }} modules</li>
        <li>{{ importResult.stats.lessons }} lessons</li>
        <li>{{ importResult.stats.sections }} sections</li>
      </ul>
      <router-link :to="`/courses/${importResult.course.id}/edit`">
        Edit Course
      </router-link>
    </div>

    <!-- Error -->
    <div v-if="importError" class="alert alert-error">
      <h3>❌ Import Failed</h3>
      <p>{{ importError }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';

const fileInput = ref(null);
const selectedFile = ref(null);
const isUploading = ref(false);
const uploadProgress = ref(0);
const importResult = ref(null);
const importError = ref(null);

const handleFileSelect = (event) => {
  const file = event.target.files[0];
  
  if (!file) return;
  
  // Validation
  if (!file.name.endsWith('.json')) {
    importError.value = 'Please select a JSON file';
    return;
  }

  if (file.size > 10 * 1024 * 1024) {
    importError.value = 'File too large (max 10MB)';
    return;
  }

  selectedFile.value = file;
  importError.value = null;
};

const importCourse = async () => {
  if (!selectedFile.value) return;

  const formData = new FormData();
  formData.append('file', selectedFile.value);

  isUploading.value = true;
  importError.value = null;
  importResult.value = null;

  try {
    const response = await axios.post(
      '/api/courses/admin/courses/import_course/',
      formData,
      {
        headers: {
          'Authorization': `Token ${localStorage.getItem('authToken')}`,
        },
        onUploadProgress: (progressEvent) => {
          uploadProgress.value = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
        },
      }
    );

    importResult.value = response.data;
    selectedFile.value = null;
    if (fileInput.value) fileInput.value.value = '';

  } catch (err) {
    importError.value = err.response?.data?.error || 
                       err.response?.data?.detail ||
                       'Import failed';
  } finally {
    isUploading.value = false;
    uploadProgress.value = 0;
  }
};

const formatFileSize = (bytes) => {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
};
</script>
```

### Angular (TypeScript)

```typescript
// course-importer.component.ts
import { Component } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';

interface ImportResult {
  message: string;
  course: {
    id: string;
    title: string;
    course_code: string;
  };
  stats: {
    modules: number;
    lessons: number;
    sections: number;
    quizzes: number;
    resources: number;
  };
}

@Component({
  selector: 'app-course-importer',
  templateUrl: './course-importer.component.html',
  styleUrls: ['./course-importer.component.css']
})
export class CourseImporterComponent {
  selectedFile: File | null = null;
  isUploading = false;
  uploadProgress = 0;
  importResult: ImportResult | null = null;
  importError: string | null = null;

  constructor(private http: HttpClient) {}

  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;

    // Validation
    if (!file.name.endsWith('.json')) {
      this.importError = 'Please select a JSON file';
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      this.importError = 'File too large (max 10MB)';
      return;
    }

    this.selectedFile = file;
    this.importError = null;
  }

  importCourse(): void {
    if (!this.selectedFile) return;

    const formData = new FormData();
    formData.append('file', this.selectedFile);

    this.isUploading = true;
    this.importError = null;
    this.importResult = null;

    const token = localStorage.getItem('authToken');

    this.http.post<ImportResult>(
      '/api/courses/admin/courses/import_course/',
      formData,
      {
        headers: {
          'Authorization': `Token ${token}`
        },
        reportProgress: true,
        observe: 'events'
      }
    ).subscribe({
      next: (event) => {
        if (event.type === HttpEventType.UploadProgress) {
          this.uploadProgress = Math.round(
            100 * (event.loaded / (event.total || event.loaded))
          );
        } else if (event.type === HttpEventType.Response) {
          this.importResult = event.body;
          this.selectedFile = null;
        }
      },
      error: (error) => {
        this.importError = error.error?.error || 
                          error.error?.detail ||
                          'Import failed';
        this.isUploading = false;
      },
      complete: () => {
        this.isUploading = false;
        this.uploadProgress = 0;
      }
    });
  }

  formatFileSize(bytes: number): string {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  }
}
```

---

## ❌ Error Handling

### Common Errors and Solutions

```javascript
function handleImportError(error) {
  const errorMessage = error.response?.data?.error || error.message;

  // Map common errors to user-friendly messages
  const errorMessages = {
    'Instructor with email': 'The specified instructor was not found. Please create the user first or leave blank to use your account.',
    'Prerequisite course': 'One or more prerequisite courses were not found. Please import prerequisite courses first.',
    'Category with ID': 'The specified category was not found. Use a category name to auto-create it.',
    'Invalid JSON': 'The JSON file is malformed. Please validate your JSON syntax.',
    'Duplicate course_code': 'A course with this code already exists. Please use a unique course code.',
  };

  // Find matching error
  for (const [key, message] of Object.entries(errorMessages)) {
    if (errorMessage.includes(key)) {
      return message;
    }
  }

  // Default error
  return errorMessage || 'An unexpected error occurred. Please try again.';
}
```

### Validation Before Upload

```javascript
async function validateJSONFile(file) {
  // Check file type
  if (!file.name.endsWith('.json')) {
    throw new Error('Please select a JSON file');
  }

  // Check file size (10MB limit)
  if (file.size > 10 * 1024 * 1024) {
    throw new Error('File too large. Maximum size is 10MB');
  }

  // Parse and validate JSON structure
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const content = JSON.parse(e.target.result);

        // Basic structure validation
        if (!content.title) {
          reject(new Error('JSON must contain "title" field'));
          return;
        }

        if (!content.course_code) {
          reject(new Error('JSON must contain "course_code" field'));
          return;
        }

        if (!content.modules || !Array.isArray(content.modules)) {
          reject(new Error('JSON must contain "modules" array'));
          return;
        }

        resolve(content);
      } catch (err) {
        reject(new Error('Invalid JSON format: ' + err.message));
      }
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}

// Usage
async function handleFileSelect(event) {
  const file = event.target.files[0];
  
  try {
    const jsonContent = await validateJSONFile(file);
    console.log('Valid JSON:', jsonContent);
    setSelectedFile(file);
    setPreview(jsonContent); // Optional: show preview
  } catch (error) {
    setError(error.message);
  }
}
```

---

## 🎨 UI/UX Best Practices

### 1. Drag and Drop

```javascript
function setupDragAndDrop(dropZoneElement, onFileDrop) {
  const dropZone = dropZoneElement;

  // Prevent default drag behaviors
  ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, preventDefaults, false);
  });

  function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  // Highlight drop zone when dragging over
  ['dragenter', 'dragover'].forEach(eventName => {
    dropZone.addEventListener(eventName, () => {
      dropZone.classList.add('drag-highlight');
    }, false);
  });

  ['dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, () => {
      dropZone.classList.remove('drag-highlight');
    }, false);
  });

  // Handle dropped files
  dropZone.addEventListener('drop', (e) => {
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      onFileDrop(files[0]);
    }
  }, false);
}

// Usage
setupDragAndDrop(
  document.querySelector('.file-picker'),
  (file) => handleFileSelect({ target: { files: [file] } })
);
```

### 2. Preview Before Import

```javascript
function CoursePreview({ jsonData }) {
  if (!jsonData) return null;

  return (
    <div className="course-preview">
      <h3>Preview</h3>
      
      <div className="preview-summary">
        <h4>{jsonData.title}</h4>
        <p>{jsonData.description?.substring(0, 150)}...</p>
        
        <div className="stats">
          <span>📚 {jsonData.modules?.length || 0} modules</span>
          <span>📝 {jsonData.course_type}</span>
          <span>💰 ${jsonData.price || 0}</span>
        </div>
      </div>

      <div className="preview-modules">
        <h5>Modules:</h5>
        <ol>
          {jsonData.modules?.slice(0, 5).map((module, idx) => (
            <li key={idx}>
              {module.title} ({module.lessons?.length || 0} lessons)
            </li>
          ))}
          {jsonData.modules?.length > 5 && (
            <li>...and {jsonData.modules.length - 5} more</li>
          )}
        </ol>
      </div>
    </div>
  );
}
```

### 3. Step-by-Step Wizard

```javascript
const steps = [
  { id: 1, title: 'Select Template', component: TemplateSelector },
  { id: 2, title: 'Upload JSON', component: FileUploader },
  { id: 3, title: 'Preview', component: CoursePreview },
  { id: 4, title: 'Import', component: ImportConfirm }
];

function ImportWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedFile, setSelectedFile] = useState(null);

  return (
    <div className="import-wizard">
      {/* Step Indicator */}
      <div className="steps">
        {steps.map(step => (
          <div 
            key={step.id}
            className={`step ${currentStep === step.id ? 'active' : ''} ${currentStep > step.id ? 'completed' : ''}`}
          >
            {step.title}
          </div>
        ))}
      </div>

      {/* Current Step Content */}
      <div className="step-content">
        {/* Render current step component */}
      </div>

      {/* Navigation */}
      <div className="step-nav">
        <button onClick={() => setCurrentStep(s => s - 1)} disabled={currentStep === 1}>
          Previous
        </button>
        <button onClick={() => setCurrentStep(s => s + 1)} disabled={currentStep === steps.length}>
          Next
        </button>
      </div>
    </div>
  );
}
```

### 4. Sample File Download

```javascript
function DownloadTemplates() {
  const templates = [
    { type: 'professional', label: 'Professional Course', file: 'sample_professional_course.json' },
    { type: 'academic', label: 'Academic Course', file: 'sample_academic_course.json' },
    { type: 'exam_prep', label: 'Exam Prep Course', file: 'sample_exam_prep_course.json' }
  ];

  const downloadTemplate = (filename) => {
    // Assuming templates are served from /static/templates/
    const link = document.createElement('a');
    link.href = `/static/templates/${filename}`;
    link.download = filename;
    link.click();
  };

  return (
    <div className="template-downloads">
      <h4>Download Sample Templates:</h4>
      {templates.map(template => (
        <button
          key={template.type}
          onClick={() => downloadTemplate(template.file)}
          className="btn-download"
        >
          📥 {template.label}
        </button>
      ))}
    </div>
  );
}
```

---

## 📝 Complete Examples

### Full-Featured Component (React)

```javascript
import React, { useState } from 'react';
import axios from 'axios';

function CourseImportPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [jsonPreview, setJsonPreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // Validate JSON file
  const validateFile = async (file) => {
    if (!file.name.endsWith('.json')) {
      throw new Error('Please select a JSON file');
    }

    if (file.size > 10 * 1024 * 1024) {
      throw new Error('File too large (max 10MB)');
    }

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = JSON.parse(e.target.result);
          if (!content.title || !content.course_code) {
            reject(new Error('Invalid course JSON structure'));
            return;
          }
          resolve(content);
        } catch (err) {
          reject(new Error('Invalid JSON format'));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  };

  // Handle file selection
  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const content = await validateFile(file);
      setSelectedFile(file);
      setJsonPreview(content);
      setError(null);
    } catch (err) {
      setError(err.message);
      setSelectedFile(null);
      setJsonPreview(null);
    }
  };

  // Import course
  const importCourse = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('file', selectedFile);

    setIsUploading(true);
    setError(null);
    setResult(null);

    try {
      const response = await axios.post(
        '/api/courses/admin/courses/import_course/',
        formData,
        {
          headers: {
            'Authorization': `Token ${localStorage.getItem('authToken')}`,
          },
          onUploadProgress: (progressEvent) => {
            setUploadProgress(
              Math.round((progressEvent.loaded * 100) / progressEvent.total)
            );
          },
        }
      );

      setResult(response.data);
      setSelectedFile(null);
      setJsonPreview(null);

    } catch (err) {
      const errorMsg = err.response?.data?.error || 
                      err.response?.data?.detail ||
                      'Import failed';
      setError(errorMsg);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  // Download sample template
  const downloadTemplate = (type) => {
    const link = document.createElement('a');
    link.href = `/static/templates/sample_${type}_course.json`;
    link.download = `sample_${type}_course.json`;
    link.click();
  };

  return (
    <div className="page-course-import">
      <div className="page-header">
        <h1>Import Course from JSON</h1>
        <p>Upload a complete course structure in JSON format</p>
      </div>

      <div className="import-container">
        {/* Sample Templates */}
        <div className="section">
          <h3>Sample Templates</h3>
          <p>Download a sample template to get started:</p>
          <div className="template-buttons">
            <button onClick={() => downloadTemplate('professional')}>
              📥 Professional Course
            </button>
            <button onClick={() => downloadTemplate('academic')}>
              📥 Academic Course
            </button>
            <button onClick={() => downloadTemplate('exam_prep')}>
              📥 Exam Prep Course
            </button>
          </div>
        </div>

        {/* File Upload */}
        <div className="section">
          <h3>Upload JSON File</h3>
          <div className="file-upload">
            <input
              type="file"
              accept=".json"
              onChange={handleFileSelect}
              disabled={isUploading}
              id="courseFile"
            />
            <label htmlFor="courseFile" className="file-label">
              <span>Choose JSON File</span>
              <span className="hint">Max 10MB</span>
            </label>
          </div>

          {selectedFile && (
            <div className="file-info">
              <p>✅ {selectedFile.name}</p>
              <p>{(selectedFile.size / 1024).toFixed(2)} KB</p>
            </div>
          )}
        </div>

        {/* Preview */}
        {jsonPreview && (
          <div className="section preview">
            <h3>Preview</h3>
            <div className="preview-content">
              <h4>{jsonPreview.title}</h4>
              <p className="course-code">Code: {jsonPreview.course_code}</p>
              <p className="description">
                {jsonPreview.description?.substring(0, 200)}...
              </p>
              <div className="stats">
                <span>📚 {jsonPreview.modules?.length || 0} modules</span>
                <span>📝 {jsonPreview.course_type}</span>
                <span>💰 ${jsonPreview.price || 'Free'}</span>
              </div>
            </div>
          </div>
        )}

        {/* Import Button */}
        <div className="section">
          <button
            onClick={importCourse}
            disabled={!selectedFile || isUploading}
            className="btn-import btn-primary"
          >
            {isUploading ? `Importing... ${uploadProgress}%` : 'Import Course'}
          </button>
        </div>

        {/* Progress */}
        {isUploading && (
          <div className="progress-container">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p>{uploadProgress}% uploaded</p>
          </div>
        )}

        {/* Success */}
        {result && (
          <div className="alert alert-success">
            <h3>✅ Course Imported Successfully!</h3>
            <div className="result-details">
              <p><strong>{result.course.title}</strong></p>
              <p>Code: {result.course.course_code}</p>
              <p>Status: {result.course.status}</p>
              <div className="stats">
                <span>{result.stats.modules} modules</span>
                <span>{result.stats.lessons} lessons</span>
                <span>{result.stats.sections} sections</span>
                <span>{result.stats.quizzes} quizzes</span>
                <span>{result.stats.resources} resources</span>
              </div>
              <a 
                href={`/admin/courses/${result.course.id}/edit`}
                className="btn-secondary"
              >
                Edit Course
              </a>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="alert alert-error">
            <h3>❌ Import Failed</h3>
            <p>{error}</p>
            <details>
              <summary>Troubleshooting Tips</summary>
              <ul>
                <li>Ensure JSON syntax is valid</li>
                <li>Check that required fields are present (title, course_code, modules)</li>
                <li>If using instructor_email, ensure the user exists</li>
                <li>Import prerequisite courses before courses that depend on them</li>
                <li>Category names will auto-create if they don't exist</li>
              </ul>
            </details>
          </div>
        )}
      </div>
    </div>
  );
}

export default CourseImportPage;
```

---

## 🧪 Testing

### Test Cases

```javascript
describe('Course Import', () => {
  test('validates file type', async () => {
    const txtFile = new File(['test'], 'test.txt', { type: 'text/plain' });
    await expect(validateFile(txtFile)).rejects.toThrow('Please select a JSON file');
  });

  test('validates file size', async () => {
    const largeContent = 'x'.repeat(11 * 1024 * 1024); // 11MB
    const largeFile = new File([largeContent], 'large.json', { type: 'application/json' });
    await expect(validateFile(largeFile)).rejects.toThrow('File too large');
  });

  test('validates JSON structure', async () => {
    const invalidJson = new File(['{"invalid": true}'], 'invalid.json');
    await expect(validateFile(invalidJson)).rejects.toThrow('Invalid course JSON structure');
  });

  test('successfully imports valid course', async () => {
    const validCourse = {
      title: 'Test Course',
      course_code: 'TEST-001',
      modules: []
    };
    const file = new File([JSON.stringify(validCourse)], 'course.json');
    
    const result = await importCourse(file);
    expect(result.course.title).toBe('Test Course');
  });
});
```

### Manual Testing Checklist

- [ ] File picker accepts only .json files
- [ ] Drag and drop works correctly
- [ ] File size validation (reject > 10MB)
- [ ] JSON syntax validation before upload
- [ ] Progress bar updates during upload
- [ ] Success message displays with course details
- [ ] Error messages are clear and actionable
- [ ] Can download sample templates
- [ ] Preview shows correct course info
- [ ] After import, can navigate to edit page
- [ ] Handles network errors gracefully
- [ ] Handles authentication errors (401)
- [ ] Handles permission errors (403)
- [ ] Handles validation errors (400)

---

## 🎯 API Response Examples

### Success Response

```json
{
  "message": "Course imported successfully",
  "course": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Python Programming Masterclass",
    "course_code": "PY-MASTER-2026",
    "status": "draft",
    "price": 49.99,
    "course_type": "professional"
  },
  "stats": {
    "modules": 5,
    "lessons": 25,
    "sections": 120,
    "quizzes": 15,
    "resources": 30
  }
}
```

### Error Responses

**Missing Instructor:**
```json
{
  "error": "Instructor with email 'john@example.com' not found. Please create this user first."
}
```

**Missing Prerequisite:**
```json
{
  "error": "Prerequisite course 'PY-INTRO-2026' not found (searched by ID and course_code). Import prerequisite courses first."
}
```

**Invalid JSON:**
```json
{
  "error": "Invalid JSON data"
}
```

**Duplicate Course Code:**
```json
{
  "course_code": ["Course with this code already exists"]
}
```

---

## 🔐 Authentication

### Token Authentication

```javascript
// Store token after login
localStorage.setItem('authToken', 'your-token-here');

// Include in requests
headers: {
  'Authorization': `Token ${localStorage.getItem('authToken')}`
}
```

### Session Authentication

```javascript
// Django CSRF token
const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;

headers: {
  'X-CSRFToken': csrfToken
}

// Credentials for session
credentials: 'include'
```

---

## 📚 Additional Resources

- **Backend API Docs:** [COURSE_IMPORT_API.md](COURSE_IMPORT_API.md)
- **Dependency Handling:** [DEPENDENCY_HANDLING.md](DEPENDENCY_HANDLING.md)
- **Sample Templates:** `templates/sample_*.json`
- **Template Guide:** [TEMPLATES_README.md](TEMPLATES_README.md)

---

## 🆘 Common Issues

| Issue | Solution |
|-------|----------|
| 401 Unauthorized | Check authentication token is valid and included in headers |
| 403 Forbidden | User must have staff or instructor role |
| 400 Bad Request | Validate JSON structure matches expected format |
| 413 Payload Too Large | File exceeds 10MB limit - reduce file size |
| Network Error | Check API endpoint URL and server is running |
| CORS Error | Ensure backend allows frontend origin |

---

**Need help?** Check the [troubleshooting section](#-common-issues) or review the [complete API documentation](COURSE_IMPORT_API.md).

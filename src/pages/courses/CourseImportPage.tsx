import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../components/layout';
import { Card, CardHeader, CardTitle, CardContent, Button } from '../../components/common';
import { useImportCourseMutation } from '../../store/api/coursesApi';
import { Upload, FileJson, Download, CheckCircle, XCircle, FileText, ChevronDown, ChevronUp } from 'lucide-react';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

const SAMPLE_TEMPLATES = [
  {
    label: 'Professional Course',
    file: 'sample_professional_course.json',
    description: 'Python Developer Bootcamp – career-focused professional course',
  },
  {
    label: 'Academic Course',
    file: 'sample_academic_course.json',
    description: 'Grade 10 Mathematics (WAEC) – curriculum-aligned academic course',
  },
  {
    label: 'Exam Prep Course',
    file: 'sample_exam_prep_course.json',
    description: 'JAMB UTME Preparation – exam-focused prep course',
  },
] as const;

const getSampleUrl = (filename: string) =>
  `${process.env.PUBLIC_URL || ''}/sample_uploads/${filename}`;

const COURSE_CREATION_PROMPT = `Z-Learn Premium Course Creation Prompt (Reusable Template)

I want to upload a very high-standard, professional course on the Z-Learn platform. This course will be paid for by students, so the content must be comprehensive, detailed, practical, and structured at a premium level. The material must provide enough depth to ensure students fully understand the concepts and feel that the course is worth the investment.

Z-Learn uses a flexible dynamic sections structure (text, video, code, image, embed, quiz, pdf, downloadable resources, etc.). The course must be designed to maximize clarity, engagement, and real-world application. Use this flexibility intelligently to improve comprehension by combining explanations, demonstrations, practical exercises, quizzes, and case studies within each lesson.

I will attach a sample JSON structure format. You must strictly follow that structure when generating the course content.

When creating the course:

Provide complete modules and lessons (not summaries).

Include detailed, teachable content students can learn from.

Insert real, valid links only where necessary (official documentation, reputable YouTube videos, trusted tools).

Include practical exercises and hands-on sessions.

Add quizzes with correct answers and explanations.

Include downloadable resource suggestions where relevant.

Maintain logical progression from beginner to intermediate or advanced (as applicable).

Ensure the course is suitable for paid delivery and professional certification standards.

Avoid unnecessary emojis or informal language.

Keep formatting clean and ready for dashboard upload.

Do not provide vague outlines. Provide real instructional content.

Now create the course using the following details:

Course Title: [INSERT COURSE TITLE]
Short Description: [INSERT SHORT DESCRIPTION]
Target Audience: [INSERT TARGET AUDIENCE]
Difficulty Level: [Beginner / Intermediate / Advanced]
Estimated Duration: [INSERT HOURS OR WEEKS]
Primary Goal of the Course: [INSERT TRANSFORMATION OR OUTCOME]
Include Hands-On Projects: [Yes/No — If yes, minimum number: X]
Include Capstone Project: [Yes/No]
Include Certification Criteria: [Yes/No]
Geographic or Industry Context (if any): [e.g., Africa, Global, Fintech, Healthcare, etc.]

Generate the full course accordingly.`;

const downloadPrompt = () => {
  const blob = new Blob([COURSE_CREATION_PROMPT], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'zlearn_course_creation_prompt.txt';
  a.click();
  URL.revokeObjectURL(url);
};

const validateJsonFile = (file: File): Promise<Record<string, any>> => {
  return new Promise((resolve, reject) => {
    if (!file.name.endsWith('.json')) {
      reject(new Error('Please select a JSON file'));
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      reject(new Error('File too large (max 10MB)'));
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = JSON.parse((e.target?.result as string) || '{}');
        const course = content.course || content;
        const modules = content.modules;
        if (!course?.title) {
          reject(new Error('JSON must contain "title" (or "course.title")'));
          return;
        }
        if (!course?.course_code) {
          reject(new Error('JSON must contain "course_code" (or "course.course_code")'));
          return;
        }
        if (!modules || !Array.isArray(modules)) {
          reject(new Error('JSON must contain "modules" array'));
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

export const CourseImportPage: React.FC = () => {
  const navigate = useNavigate();
  const [importCourse, { isLoading: isImporting }] = useImportCourseMutation();

  const [promptExpanded, setPromptExpanded] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [jsonPreview, setJsonPreview] = useState<Record<string, any> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    message: string;
    course: { id: string; title: string; course_code: string; status: string };
    stats: { modules: number; lessons: number; sections: number; quizzes: number; resources: number };
  } | null>(null);

  const handleFileSelect = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      try {
        const content = await validateJsonFile(file);
        setSelectedFile(file);
        setJsonPreview(content);
        setError(null);
        setResult(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Invalid file');
        setSelectedFile(null);
        setJsonPreview(null);
      }
      event.target.value = '';
    },
    []
  );

  const handleImport = async () => {
    if (!selectedFile) return;

    setError(null);
    setResult(null);

    try {
      const data = await importCourse(selectedFile).unwrap();
      setResult(data);
      setSelectedFile(null);
      setJsonPreview(null);
    } catch (err: any) {
      const msg =
        err?.data?.error ||
        err?.data?.detail ||
        (typeof err?.data === 'object' ? JSON.stringify(err.data) : null) ||
        err?.message ||
        'Import failed';
      setError(typeof msg === 'string' ? msg : 'Import failed');
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setJsonPreview(null);
    setError(null);
    setResult(null);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Import Course from JSON</h1>
          <p className="text-gray-500 mt-1">Upload a complete course structure in JSON format</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Download className="w-5 h-5 text-zlearn-primary" />
              <CardTitle>Sample Templates</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Download a sample template to get started:
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap gap-3">
              {SAMPLE_TEMPLATES.map((template) => (
                <a
                  key={template.file}
                  href={getSampleUrl(template.file)}
                  download={template.file}
                  className="inline-flex items-start gap-2 px-4 py-3 rounded-lg border border-surface-border bg-white hover:bg-surface-muted hover:border-zlearn-primary/50 transition-colors text-left group"
                >
                  <Download className="w-4 h-4 text-zlearn-primary flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                  <div>
                    <span className="font-medium text-gray-900 block">{template.label}</span>
                    <span className="text-xs text-gray-500">{template.description}</span>
                  </div>
                </a>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-zlearn-primary" />
                <CardTitle>AI Course Creation Prompt</CardTitle>
              </div>
              <Button variant="outline" size="sm" onClick={downloadPrompt}>
                <Download className="w-4 h-4" />
                Download Prompt
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-3">
              Use this reusable prompt with an AI assistant to generate course content in the correct JSON structure. Fill in the placeholders and attach a sample template.
            </p>
            <button
              type="button"
              onClick={() => setPromptExpanded(!promptExpanded)}
              className="flex items-center gap-2 text-sm font-medium text-zlearn-primary hover:text-zlearn-primaryHover transition-colors mb-2"
            >
              {promptExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              {promptExpanded ? 'Hide prompt' : 'View prompt'}
            </button>
            {promptExpanded && (
              <pre className="mt-2 p-4 bg-surface-muted rounded-lg text-xs text-gray-700 overflow-x-auto max-h-80 overflow-y-auto whitespace-pre-wrap font-sans border border-surface-borderLight">
                {COURSE_CREATION_PROMPT}
              </pre>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <FileJson className="w-5 h-5 text-zlearn-primary" />
              <CardTitle>Upload JSON File</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div
              className="border-2 border-dashed border-surface-border rounded-lg p-8 text-center hover:border-zlearn-primary/50 transition-colors"
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
                const file = e.dataTransfer.files?.[0];
                if (file) {
                  validateJsonFile(file)
                    .then((content) => {
                      setSelectedFile(file);
                      setJsonPreview(content);
                      setError(null);
                      setResult(null);
                    })
                    .catch((err) => {
                      setError(err instanceof Error ? err.message : 'Invalid file');
                      setSelectedFile(null);
                      setJsonPreview(null);
                    });
                }
              }}
            >
              <input
                type="file"
                accept=".json,application/json"
                onChange={handleFileSelect}
                disabled={isImporting}
                id="courseFile"
                className="hidden"
              />
              <label
                htmlFor="courseFile"
                className="cursor-pointer flex flex-col items-center gap-2"
              >
                <Upload className="w-10 h-10 text-gray-400" />
                <span className="font-medium text-gray-700">Choose JSON File</span>
                <span className="text-sm text-gray-500">or drag and drop here · Max 10MB</span>
              </label>
            </div>

            {selectedFile && (
              <div className="flex items-center justify-between p-3 bg-surface-muted rounded-lg">
                <div className="flex items-center gap-2">
                  <FileJson className="w-5 h-5 text-zlearn-primary" />
                  <span className="font-medium text-gray-900">{selectedFile.name}</span>
                  <span className="text-sm text-gray-500">({formatFileSize(selectedFile.size)})</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedFile(null);
                    setJsonPreview(null);
                  }}
                >
                  Clear
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {jsonPreview && (
          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {(() => {
                  const course = jsonPreview.course || jsonPreview;
                  return (
                    <>
                      <p className="font-medium text-gray-900">{course.title}</p>
                      <p className="text-sm text-gray-500">Code: {course.course_code}</p>
                      {(course.description || jsonPreview.description) && (
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {String(course.description || jsonPreview.description).substring(0, 200)}
                          {String(course.description || jsonPreview.description).length > 200 ? '...' : ''}
                        </p>
                      )}
                      <div className="flex gap-4 text-sm text-gray-500 pt-2">
                        <span>📚 {jsonPreview.modules?.length || 0} modules</span>
                        <span>📝 {course.course_type || '—'}</span>
                        <span>💰 {course.price != null && !course.is_free ? `${course.currency || 'USD'} ${course.price}` : 'Free'}</span>
                      </div>
                    </>
                  );
                })()}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex gap-3">
          <Button
            onClick={handleImport}
            disabled={!selectedFile || isImporting}
            loading={isImporting}
          >
            <Upload className="w-4 h-4" />
            Import Course
          </Button>
          {(selectedFile || result || error) && (
            <Button variant="outline" onClick={handleReset}>
              Reset
            </Button>
          )}
        </div>

        {result && (
          <Card className="border-emerald-200 bg-emerald-50/50">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-emerald-800">Course Imported Successfully</h3>
                  <p className="text-emerald-700 mt-1">
                    <strong>{result.course.title}</strong>
                  </p>
                  <p className="text-sm text-emerald-600">Code: {result.course.course_code}</p>
                  <p className="text-sm text-emerald-600">Status: {result.course.status}</p>
                  <ul className="text-sm text-emerald-700 mt-2 space-y-0.5">
                    <li>{result.stats.modules} modules</li>
                    <li>{result.stats.lessons} lessons</li>
                    <li>{result.stats.sections} sections</li>
                    <li>{result.stats.quizzes} quizzes</li>
                    <li>{result.stats.resources} resources</li>
                  </ul>
                  <Button
                    size="sm"
                    className="mt-4"
                    onClick={() => navigate(`/admin/courses/courses/${result.course.id}`)}
                  >
                    Edit Course
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {error && (
          <Card className="border-red-200 bg-red-50/50">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-red-800">Import Failed</h3>
                  <p className="text-red-700 mt-1">{error}</p>
                  <details className="mt-3 text-sm text-red-600">
                    <summary className="cursor-pointer font-medium">Troubleshooting Tips</summary>
                    <ul className="mt-2 space-y-1 list-disc list-inside">
                      <li>Ensure JSON syntax is valid</li>
                      <li>Check that required fields are present (title, course_code, modules)</li>
                      <li>If using instructor_email, ensure the user exists</li>
                      <li>Import prerequisite courses before courses that depend on them</li>
                      <li>Category names will auto-create if they don&apos;t exist</li>
                    </ul>
                  </details>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
};

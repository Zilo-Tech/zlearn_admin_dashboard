import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../components/layout';
import { Card, CardHeader, CardTitle, CardContent, Button } from '../../components/common';
import { useImportCourseMutation } from '../../store/api/coursesApi';
import { useImportContentCourseMutation } from '../../store/api/contentApi';
import { useImportExamPackageMutation } from '../../store/api/examsApi';
import { Upload, FileJson, Download, CheckCircle, XCircle, FileText, ChevronDown, ChevronUp, Briefcase, GraduationCap, Award } from 'lucide-react';

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
    description: 'Courses app – bootcamps, certifications, hobby courses (use with Professional import)',
  },
  {
    label: 'Academic / Content Course',
    file: 'sample_content_academic_course.json',
    description: 'Content app – school curriculum, university courses (use with Academic import)',
  },
  {
    label: 'Exam Package',
    file: 'sample_exam_package.json',
    description: 'Exams app – full exam packages with multiple subjects (use with Exam Package import)',
  },
] as const;

const getSampleUrl = (filename: string) =>
  `${process.env.PUBLIC_URL || ''}/sample_uploads/${filename}`;

const COURSE_PROMPTS = {
  professional: {
    label: 'Professional Course',
    filename: 'zlearn_professional_course_prompt.txt',
    content: `Z-Learn Professional Course Creation Prompt (Reusable Template)

I want to upload a very high-standard, professional course on the Z-Learn platform. This course will be paid for by students, so the content must be comprehensive, detailed, practical, and structured at a premium level. The material must provide enough depth to ensure students fully understand the concepts and feel that the course is worth the investment.

Z-Learn uses a flexible dynamic sections structure (text, video, code, image, embed, quiz, pdf, downloadable resources, etc.). The course must be designed to maximize clarity, engagement, and real-world application. Use this flexibility intelligently to improve comprehension by combining explanations, demonstrations, practical exercises, quizzes, and case studies within each lesson.

I will attach a sample JSON structure format (sample_professional_course.json). You must strictly follow that structure when generating the course content.

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

Generate the full course accordingly.`,
  },
  academic: {
    label: 'Academic Course',
    filename: 'zlearn_academic_course_prompt.txt',
    content: `Z-Learn Academic Course Creation Prompt (Reusable Template)

I want to upload a high-standard, curriculum-aligned academic course on the Z-Learn platform. The content must be comprehensive, accurate, and structured for formal education (school/university). It must align with syllabus requirements and support student progression.

Z-Learn uses a flexible dynamic sections structure (text, video, code, image, embed, quiz, pdf, downloadable resources, etc.). Use this flexibility to maximize clarity and learning outcomes for academic delivery.

I will attach a sample JSON structure format (sample_content_academic_course.json). You must strictly follow that structure when generating the course content.

When creating the course:

Provide complete modules and lessons (not summaries).

Include detailed, teachable content aligned with curriculum.

Insert real, valid links only where necessary.

Include practice exercises and assessments.

Add quizzes with correct answers and explanations.

Maintain logical progression according to syllabus.

Ensure the course is suitable for academic certification or exam preparation.

Avoid unnecessary emojis or informal language.

Keep formatting clean and ready for dashboard upload.

For Content app academic courses, include subject, class_level, exam_system, program as in the sample.

Now create the course using the following details:

Course Title: [INSERT COURSE TITLE]
Short Description: [INSERT SHORT DESCRIPTION]
Target Audience: [INSERT TARGET AUDIENCE]
Difficulty Level: [Beginner / Intermediate / Advanced]
Estimated Duration: [INSERT HOURS OR WEEKS]
Primary Goal of the Course: [INSERT LEARNING OUTCOMES]

Content/Academic fields (see sample_content_academic_course.json):
Subject: [e.g., Mathematics, Physics – auto-creates if needed]
Class Level: [e.g., Form 1, cm-secondary-form1]
Exam System: [e.g., GCE_OL, WAEC, BACCALAUREAT]
Program: [optional – program code or ID]
Course Type: [regular / entrance_exam / advanced / review]

Generate the full course accordingly.`,
  },
  exam_prep: {
    label: 'Exam Package',
    filename: 'zlearn_exam_package_prompt.txt',
    content: `Z-Learn Exam Package Creation Prompt (Reusable Template)

I want to upload a complete exam package on the Z-Learn platform (e.g., JAMB UTME 2026, SAT 2026). The package must include multiple subject courses, exam details (date, marks, format), and optional mock exams and past papers.

I will attach a sample JSON structure format (sample_exam_package.json). You must strictly follow that structure. The root object defines the exam package (title, exam_code, exam_board, exam_date, total_marks, courses array, etc.).

When creating the package:

Provide complete exam package with courses array (each course has modules and lessons).

Include exam metadata: exam_code, exam_board, exam_date, total_marks, scoring_system, section_details.

Include exam-style practice questions and optional mock exams/past papers as in the sample.

Cover all exam subjects in the courses array.

Avoid unnecessary emojis or informal language.

Keep formatting clean and ready for dashboard upload.

Now create the exam package using the following details:

Package Title: [INSERT TITLE, e.g., JAMB UTME 2026 Preparation]
Exam Code: [e.g., JAMB_UTME_2026]
Exam Board: [JAMB, SAT, GRE, WAEC, College Board, etc.]
Exam Date: [YYYY-MM-DD]
Total Marks: [e.g., 400]
Subjects: [List of subject names for the courses array]

Generate the full exam package accordingly.`,
  },
} as const;

type CoursePromptType = keyof typeof COURSE_PROMPTS;

const downloadPrompt = (type: CoursePromptType) => {
  const prompt = COURSE_PROMPTS[type];
  const blob = new Blob([prompt.content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = prompt.filename;
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
        const courses = content.courses;
        if (!course?.title && !content.title) {
          reject(new Error('JSON must contain "title" (or "course.title")'));
          return;
        }
        const code = course?.course_code ?? course?.code ?? content.exam_code;
        if (!code && !content.exam_code) {
          reject(new Error('JSON must contain "course_code", "code", or "exam_code"'));
          return;
        }
        const hasStructure = (modules && Array.isArray(modules)) || (courses && Array.isArray(courses));
        if (!hasStructure) {
          reject(new Error('JSON must contain "modules" or "courses" array'));
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

export type ImportType = 'professional' | 'academic' | 'exam_package';

const IMPORT_TYPES: { type: ImportType; label: string; description: string; icon: React.ElementType }[] = [
  { type: 'professional', label: 'Professional Development', description: 'Bootcamps, certification courses, hobby classes', icon: Briefcase },
  { type: 'academic', label: 'Academic / Educational', description: 'School curriculum, university courses, single-subject exam prep', icon: GraduationCap },
  { type: 'exam_package', label: 'Exam Package', description: 'Full exam packages with multiple subjects, mock tests, past papers', icon: Award },
];

export const CourseImportPage: React.FC = () => {
  const navigate = useNavigate();
  const [importProfessional, { isLoading: isImportingProfessional }] = useImportCourseMutation();
  const [importAcademic, { isLoading: isImportingAcademic }] = useImportContentCourseMutation();
  const [importExamPackage, { isLoading: isImportingExamPackage }] = useImportExamPackageMutation();

  const isImporting = isImportingProfessional || isImportingAcademic || isImportingExamPackage;

  const [importType, setImportType] = useState<ImportType>('professional');
  const [promptExpanded, setPromptExpanded] = useState(false);
  const [selectedPromptType, setSelectedPromptType] = useState<CoursePromptType>('professional');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [jsonPreview, setJsonPreview] = useState<Record<string, any> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    type: ImportType;
    message: string;
    course?: { id: string; title: string; course_code?: string; status?: string };
    exam?: { id: string; title: string; slug?: string; status?: string };
    stats?: { modules?: number; lessons?: number; sections?: number; quizzes?: number; resources?: number };
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
      if (importType === 'professional') {
        const data = await importProfessional(selectedFile).unwrap();
        setResult({
          type: 'professional',
          message: data.message,
          course: data.course,
          stats: data.stats,
        });
      } else if (importType === 'academic') {
        const data = await importAcademic(selectedFile).unwrap();
        setResult({
          type: 'academic',
          message: data.message,
          course: data.course,
          stats: data.stats,
        });
      } else {
        const data = await importExamPackage(selectedFile).unwrap();
        setResult({
          type: 'exam_package',
          message: data.message,
          exam: data.exam,
          stats: data.stats,
        });
      }
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
            <CardTitle>What are you importing?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Choose the type that matches your JSON. Each type uses a different backend and admin section.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {IMPORT_TYPES.map(({ type, label, description, icon: Icon }) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setImportType(type)}
                  className={`flex items-start gap-3 p-4 rounded-lg border-2 text-left transition-colors ${
                    importType === type
                      ? 'border-zlearn-primary bg-zlearn-primaryMuted/30'
                      : 'border-surface-border hover:border-surface-borderLight bg-white'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    importType === type ? 'bg-zlearn-primary text-white' : 'bg-surface-muted text-gray-500'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-medium text-gray-900 block">{label}</span>
                    <span className="text-xs text-gray-500">{description}</span>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

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
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-zlearn-primary" />
                <CardTitle>AI Course Creation Prompts</CardTitle>
              </div>
              <Button variant="outline" size="sm" onClick={() => downloadPrompt(selectedPromptType)}>
                <Download className="w-4 h-4" />
                Download {COURSE_PROMPTS[selectedPromptType].label} Prompt
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-3">
              Use these prompts with an AI assistant to generate course content. Choose the type that matches your sample template, fill in the placeholders, and attach the corresponding sample.
            </p>
            <div className="flex flex-wrap gap-2 mb-3">
              {(Object.keys(COURSE_PROMPTS) as CoursePromptType[]).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => {
                    setSelectedPromptType(type);
                    setPromptExpanded(true);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    selectedPromptType === type
                      ? 'bg-zlearn-primary text-white'
                      : 'bg-surface-muted text-gray-600 hover:bg-surface-border hover:text-gray-900'
                  }`}
                >
                  {COURSE_PROMPTS[type].label}
                </button>
              ))}
            </div>
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
                {COURSE_PROMPTS[selectedPromptType].content}
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
                  <h3 className="font-semibold text-emerald-800">
                    {result.type === 'exam_package' ? 'Exam Package' : 'Course'} Imported Successfully
                  </h3>
                  {result.course && (
                    <>
                      <p className="text-emerald-700 mt-1">
                        <strong>{result.course.title}</strong>
                      </p>
                      {result.course.course_code && (
                        <p className="text-sm text-emerald-600">Code: {result.course.course_code}</p>
                      )}
                      {result.course.status && (
                        <p className="text-sm text-emerald-600">Status: {result.course.status}</p>
                      )}
                    </>
                  )}
                  {result.exam && (
                    <>
                      <p className="text-emerald-700 mt-1">
                        <strong>{result.exam.title}</strong>
                      </p>
                      {result.exam.status && (
                        <p className="text-sm text-emerald-600">Status: {result.exam.status}</p>
                      )}
                    </>
                  )}
                  {result.stats && (
                    <ul className="text-sm text-emerald-700 mt-2 space-y-0.5">
                      {result.stats.modules != null && <li>{result.stats.modules} modules</li>}
                      {result.stats.lessons != null && <li>{result.stats.lessons} lessons</li>}
                      {result.stats.sections != null && <li>{result.stats.sections} sections</li>}
                      {result.stats?.quizzes != null && <li>{result.stats.quizzes} quizzes</li>}
                      {result.stats?.resources != null && <li>{result.stats.resources} resources</li>}
                    </ul>
                  )}
                  <Button
                    size="sm"
                    className="mt-4"
                    onClick={() => {
                      if (result.type === 'professional' && result.course) {
                        navigate(`/admin/courses/courses/${result.course.id}`);
                      } else if (result.type === 'academic' && result.course) {
                        navigate(`/admin/content/courses/${result.course.id}`);
                      } else if (result.type === 'exam_package' && result.exam) {
                        navigate(`/admin/exams/exams/${result.exam.id}`);
                      }
                    }}
                  >
                    {result.type === 'exam_package' ? 'View Exam Package' : 'Edit Course'}
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

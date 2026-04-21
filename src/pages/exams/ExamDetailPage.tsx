import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../components/layout';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Badge,
  Input,
  Modal,
  Alert,
} from '../../components/common';
import {
  ChevronRight,
  BookOpen,
  FileText,
  ClipboardList,
  FileQuestion,
  Users,
  Plus,
  Edit2,
  Trash2,
  Upload,
} from 'lucide-react';
import {
  useGetExamQuery,
  useGetExamStatisticsQuery,
  useGetExamCoursesQuery,
  useGetMockExamsQuery,
  useGetPastPapersQuery,
  useGetExamEnrollmentsQuery,
  useCreateExamCourseMutation,
  useUpdateExamCourseMutation,
  useDeleteExamCourseMutation,
  useImportExamCourseMutation,
  useCreateMockExamMutation,
  useDeleteMockExamMutation,
  useCreatePastPaperMutation,
  useDeletePastPaperMutation,
} from '../../store/api/examsApi';
import type { ExamCourse, MockExam, PastPaper } from '../../interfaces/exam';

export const ExamDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: exam, isLoading } = useGetExamQuery(id!);
  const { data: stats, isLoading: loadingStats } = useGetExamStatisticsQuery(id!, { skip: !id });
  const { data: courses = [], isLoading: loadingCourses } = useGetExamCoursesQuery(id!);
  const { data: mocks = [], isLoading: loadingMocks } = useGetMockExamsQuery(id!);
  const { data: papers = [], isLoading: loadingPapers } = useGetPastPapersQuery(id!);
  const { data: enrollments = [], isLoading: loadingEnrollments } = useGetExamEnrollmentsQuery(id!);

  const [createCourse, { isLoading: isCreatingCourse }] = useCreateExamCourseMutation();
  const [updateCourse, { isLoading: isUpdatingCourse }] = useUpdateExamCourseMutation();
  const [deleteCourse] = useDeleteExamCourseMutation();
  const [importExamCourse, { isLoading: isImportingCourse }] = useImportExamCourseMutation();
  const [createMockExam, { isLoading: isCreatingMock }] = useCreateMockExamMutation();
  const [deleteMockExam] = useDeleteMockExamMutation();
  const [createPastPaper, { isLoading: isCreatingPaper }] = useCreatePastPaperMutation();
  const [deletePastPaper] = useDeletePastPaperMutation();

  const courseFileInputRef = React.useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState<'overview' | 'subjects' | 'mocks' | 'papers' | 'enrollments'>('overview');
  const [subjectModal, setSubjectModal] = useState<'add' | 'edit' | null>(null);
  const [editingCourse, setEditingCourse] = useState<ExamCourse | null>(null);
  const [mockModal, setMockModal] = useState(false);
  const [paperModal, setPaperModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showJsonTemplate, setShowJsonTemplate] = useState(false);

  const [courseForm, setCourseForm] = useState({ title: '', subject: '', order: 0, is_published: true });
  const [mockForm, setMockForm] = useState({
    title: '',
    description: '',
    duration_minutes: 60,
    total_marks: 100,
    passing_score: 50,
    number_of_questions: 20,
    is_timed: true,
    is_published: false,
  });
  const [paperForm, setPaperForm] = useState({
    title: '',
    year: new Date().getFullYear(),
    exam_board: '',
    description: '',
    is_published: false,
    question_paper: null as File | null,
    answer_key: null as File | null,
    marking_scheme: null as File | null,
    solutions_pdf: null as File | null,
  });

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-surface-border border-t-zlearn-primary" />
        </div>
      </AdminLayout>
    );
  }

  if (!exam) {
    return (
      <AdminLayout>
        <div className="text-center py-12 text-gray-500">Exam package not found</div>
      </AdminLayout>
    );
  }

  const subjectDisplayValue = (s: ExamCourse['subject']): string => {
    if (s == null) return '';
    if (typeof s === 'string') return s;
    return String((s as { id?: number; name?: string }).id ?? (s as { name?: string }).name ?? '');
  };

  const handleOpenSubjectModal = (course?: ExamCourse) => {
    if (course) {
      setEditingCourse(course);
      setCourseForm({
        title: course.title,
        subject: subjectDisplayValue(course.subject),
        order: course.order ?? 0,
        is_published: course.is_published ?? true,
      });
      setSubjectModal('edit');
    } else {
      setEditingCourse(null);
      setCourseForm({ title: '', subject: '', order: courses.length, is_published: true });
      setSubjectModal('add');
    }
    setError(null);
  };

  const handleSubmitSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      if (editingCourse) {
        await updateCourse({
          id: editingCourse.id,
          data: { title: courseForm.title, subject: courseForm.subject, order: courseForm.order, is_published: courseForm.is_published },
        }).unwrap();
      } else {
        await createCourse({
          exam: exam.id,
          title: courseForm.title.trim(),
          subject: courseForm.subject || undefined,
          order: courseForm.order,
          is_published: courseForm.is_published,
        }).unwrap();
      }
      setSubjectModal(null);
    } catch (err: any) {
      setError(err?.data ? JSON.stringify(err.data) : err?.message || 'Failed to save');
    }
  };

  const handleDeleteCourse = async (c: ExamCourse) => {
    if (window.confirm(`Delete subject "${c.title}"?`)) {
      try {
        await deleteCourse(c.id).unwrap();
      } catch {
        alert('Failed to delete');
      }
    }
  };

  const handleImportCourse = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !id) return;

    setError(null);
    try {
      await importExamCourse({ examId: id, file }).unwrap();
      if (courseFileInputRef.current) {
        courseFileInputRef.current.value = '';
      }
    } catch (err: any) {
      setError(err?.data ? JSON.stringify(err.data) : err?.message || 'Failed to import subject');
      if (courseFileInputRef.current) {
        courseFileInputRef.current.value = '';
      }
    }
  };

  const handleOpenMockModal = () => {
    setMockForm({
      title: '',
      description: '',
      duration_minutes: 60,
      total_marks: 100,
      passing_score: 50,
      number_of_questions: 20,
      is_timed: true,
      is_published: false,
    });
    setMockModal(true);
    setError(null);
  };

  const handleSubmitMock = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await createMockExam({
        exam: exam.id,
        title: mockForm.title.trim(),
        description: mockForm.description || undefined,
        duration_minutes: mockForm.duration_minutes,
        total_marks: mockForm.total_marks,
        passing_score: mockForm.passing_score,
        number_of_questions: mockForm.number_of_questions,
        is_timed: mockForm.is_timed,
        is_published: mockForm.is_published,
      }).unwrap();
      setMockModal(false);
    } catch (err: any) {
      setError(err?.data ? JSON.stringify(err.data) : err?.message || 'Failed to create');
    }
  };

  const handleDeleteMock = async (m: MockExam) => {
    if (window.confirm(`Delete mock exam "${m.title}"?`)) {
      try {
        await deleteMockExam(m.id).unwrap();
      } catch {
        alert('Failed to delete');
      }
    }
  };

  const handleOpenPaperModal = () => {
    setPaperForm({
      title: '',
      year: new Date().getFullYear(),
      exam_board: '',
      description: '',
      is_published: false,
      question_paper: null,
      answer_key: null,
      marking_scheme: null,
      solutions_pdf: null,
    });
    setPaperModal(true);
    setError(null);
  };

  const handleSubmitPaper = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!paperForm.question_paper) {
      setError('Past Paper JSON file is required');
      return;
    }

    try {
      const file = paperForm.question_paper;
      const fileReader = new FileReader();

      fileReader.onload = async (event) => {
        try {
          const jsonContent = JSON.parse(event.target?.result as string);

          const payload: any = {
            exam: exam.id,
            title: paperForm.title.trim(),
            year: paperForm.year,
            session: paperForm.session || '',
            is_published: paperForm.is_published,
            content: jsonContent,
          };

          if (paperForm.exam_board) payload.exam_board = paperForm.exam_board;
          if (paperForm.description) payload.description = paperForm.description;

          await createPastPaper(payload).unwrap();
          setPaperModal(false);
          setPaperForm({ ...paperForm, question_paper: null, title: '' });
        } catch (err: any) {
          setError(err?.data ? JSON.stringify(err.data) : err?.message || 'Invalid JSON format in the uploaded file');
        }
      };

      fileReader.onerror = () => {
        setError('Failed to read the file');
      };

      fileReader.readAsText(file);

    } catch (err: any) {
      setError(err?.data ? JSON.stringify(err.data) : err?.message || 'Failed to initialize upload');
    }
  };

  const handleDeletePaper = async (p: PastPaper) => {
    if (window.confirm(`Delete past paper "${p.title}"?`)) {
      try {
        await deletePastPaper(p.id).unwrap();
      } catch {
        alert('Failed to delete');
      }
    }
  };

  const tabs = [
    { id: 'overview' as const, label: 'Overview', icon: FileText },
    { id: 'subjects' as const, label: 'Subjects', icon: BookOpen },
    { id: 'mocks' as const, label: 'Mock Exams', icon: ClipboardList },
    { id: 'papers' as const, label: 'Past Papers', icon: FileQuestion },
    { id: 'enrollments' as const, label: 'Enrollments', icon: Users },
  ];

  const TableRow = ({ children }: { children: React.ReactNode }) => (
    <tr className="border-b border-surface-borderLight last:border-0 hover:bg-surface-muted/30">
      {children}
    </tr>
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <button
            onClick={() => navigate('/admin/exams/exams')}
            className="hover:text-zlearn-primary transition-colors duration-150"
          >
            Exam Packages
          </button>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-gray-900 font-medium truncate max-w-[200px]">{exam.title}</span>
        </div>

        <Card padding="lg">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex gap-4">
              <div className="w-16 h-16 rounded-lg bg-surface-muted flex-shrink-0 overflow-hidden">
                {exam.thumbnail ? (
                  <img src={exam.thumbnail} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <BookOpen className="w-8 h-8" />
                  </div>
                )}
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">{exam.title}</h1>
                <p className="text-gray-500 text-sm mt-1">{exam.short_description || exam.exam_type}</p>
                <div className="flex items-center gap-3 mt-3">
                  <Badge variant={exam.status}>{exam.status}</Badge>
                  <span className="text-xs text-gray-500">{exam.exam_board || exam.country}</span>
                  <span className="text-xs text-gray-500">
                    {exam.is_free ? 'Free' : `${exam.currency} ${exam.price}`}
                  </span>
                </div>
              </div>
            </div>
            <Button variant="outline" onClick={() => navigate('/admin/exams/exams')} size="sm">
              Back to Exams
            </Button>
          </div>
        </Card>

        <div className="border-b border-surface-border">
          <nav className="flex gap-6" aria-label="Exam sections">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 pb-3 text-sm font-medium border-b-2 transition-colors duration-150 -mb-px ${activeTab === tab.id
                  ? 'border-zlearn-primary text-zlearn-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {activeTab === 'overview' && (
          <>
            {loadingStats ? (
              <Card>
                <CardContent className="py-8 flex justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-surface-border border-t-zlearn-primary" />
                </CardContent>
              </Card>
            ) : stats ? (
              <Card>
                <CardHeader>
                  <CardTitle>Dashboard statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                    <div className="rounded-lg border border-surface-borderLight p-4">
                      <p className="text-xs font-medium text-gray-500 uppercase">Content</p>
                      <p className="text-lg font-semibold mt-1">
                        {stats.content.courses} courses · {stats.content.modules} modules · {stats.content.lessons} lessons
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {stats.content.sections} sections · {stats.content.resources} resources
                      </p>
                    </div>
                    <div className="rounded-lg border border-surface-borderLight p-4">
                      <p className="text-xs font-medium text-gray-500 uppercase">Assessments</p>
                      <p className="text-lg font-semibold mt-1">
                        {stats.assessments.mock_exams} mocks · {stats.assessments.mock_questions} questions · {stats.assessments.past_papers} past papers
                      </p>
                    </div>
                    <div className="rounded-lg border border-surface-borderLight p-4">
                      <p className="text-xs font-medium text-gray-500 uppercase">Enrollments</p>
                      <p className="text-lg font-semibold mt-1">{stats.enrollments.total} total</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {stats.enrollments.active} active · {stats.enrollments.completed} completed
                      </p>
                    </div>
                    <div className="rounded-lg border border-surface-borderLight p-4">
                      <p className="text-xs font-medium text-gray-500 uppercase">Engagement</p>
                      <p className="text-lg font-semibold mt-1">{stats.engagement.total_attempts} attempts</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Avg score {stats.engagement.average_score}% · Completion {stats.engagement.completion_rate}%
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : null}
            <Card>
              <CardHeader>
                <CardTitle>Exam Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Description</p>
                    <p className="text-gray-900">{exam.description || '—'}</p>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-surface-borderLight">
                    <div>
                      <p className="text-xs text-gray-500">Exam Date</p>
                      <p className="font-medium">
                        {exam.exam_date ? new Date(exam.exam_date).toLocaleDateString() : '—'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Total Marks</p>
                      <p className="font-medium">{exam.total_marks ?? '—'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Duration</p>
                      <p className="font-medium">{exam.duration_minutes ? `${exam.duration_minutes} min` : '—'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Enrollments</p>
                      <p className="font-medium">{exam.enrollment_count ?? 0}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {activeTab === 'subjects' && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <CardTitle>Exam Subjects</CardTitle>
                  <a href="/sample_uploads/sample_subject.json" download className="text-xs text-zlearn-primary hover:underline mt-0.5">Download Subject Template</a>
                </div>
                <div className="flex gap-3 items-center">
                  <input
                    type="file"
                    ref={courseFileInputRef}
                    className="hidden"
                    accept=".json"
                    onChange={handleImportCourse}
                  />
                  <Button size="sm" variant="outline" onClick={() => courseFileInputRef.current?.click()} disabled={isImportingCourse}>
                    <Upload className="w-4 h-4 mr-2 hidden sm:block" />
                    {isImportingCourse ? 'Importing...' : 'Import Subject JSON'}
                  </Button>
                  <Button size="sm" onClick={() => handleOpenSubjectModal()}>
                    <Plus className="w-4 h-4" />
                    Add Subject
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loadingCourses ? (
                <div className="py-8 flex justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-surface-border border-t-zlearn-primary" />
                </div>
              ) : courses.length === 0 ? (
                <p className="text-center py-12 text-gray-500">No subjects yet. Add one to get started.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-xs font-medium text-gray-500 uppercase">
                        <th className="pb-3">Subject</th>
                        <th className="pb-3">Status</th>
                        <th className="pb-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {courses.map((c) => (
                        <TableRow key={c.id}>
                          <td className="py-3">
                            <p className="font-medium text-gray-900">{c.title}</p>
                            {c.subject && (
                              <p className="text-sm text-gray-500">
                                {typeof c.subject === 'object' && c.subject !== null && 'name' in c.subject
                                  ? c.subject.name
                                  : String(c.subject)}
                              </p>
                            )}
                          </td>
                          <td className="py-3">
                            <Badge variant={c.is_published ? 'published' : 'draft'}>
                              {c.is_published ? 'Published' : 'Draft'}
                            </Badge>
                          </td>
                          <td className="py-3 text-right">
                            <button
                              onClick={() => navigate(`/admin/exams/exams/${id}/courses/${c.id}`)}
                              className="text-zlearn-primary hover:text-zlearn-primaryHover font-medium text-sm transition-colors duration-150 mr-3"
                            >
                              Manage →
                            </button>
                            <button
                              onClick={() => handleOpenSubjectModal(c)}
                              className="p-2 text-gray-500 hover:text-zlearn-primary rounded-lg mr-1"
                              title="Edit"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteCourse(c)}
                              className="p-2 text-gray-500 hover:text-red-600 rounded-lg"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </TableRow>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {activeTab === 'mocks' && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Mock Exams</CardTitle>
                <Button size="sm" onClick={handleOpenMockModal}>
                  <Plus className="w-4 h-4" />
                  Create Mock Exam
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {loadingMocks ? (
                <div className="py-8 flex justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-surface-border border-t-zlearn-primary" />
                </div>
              ) : mocks.length === 0 ? (
                <p className="text-center py-12 text-gray-500">No mock exams yet. Create one to get started.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-xs font-medium text-gray-500 uppercase">
                        <th className="pb-3">Mock Exam</th>
                        <th className="pb-3">Duration</th>
                        <th className="pb-3">Marks</th>
                        <th className="pb-3">Status</th>
                        <th className="pb-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mocks.map((m) => (
                        <TableRow key={m.id}>
                          <td className="py-3 font-medium text-gray-900">{m.title}</td>
                          <td className="py-3 text-gray-600">
                            {(m.time_limit_minutes ?? m.duration_minutes) != null
                              ? `${m.time_limit_minutes ?? m.duration_minutes} min`
                              : '—'}
                          </td>
                          <td className="py-3 text-gray-600">
                            {m.total_marks ?? '—'} / Pass: {m.passing_marks ?? m.passing_score ?? '—'}
                          </td>
                          <td className="py-3">
                            <Badge variant={m.is_published ? 'published' : 'draft'}>
                              {m.is_published ? 'Published' : 'Draft'}
                            </Badge>
                          </td>
                          <td className="py-3 text-right">
                            <button
                              onClick={() => navigate(`/admin/exams/exams/${id}/mocks/${m.id}`)}
                              className="text-zlearn-primary hover:text-zlearn-primaryHover font-medium text-sm transition-colors duration-150 mr-3"
                            >
                              Manage →
                            </button>
                            <button
                              onClick={() => handleDeleteMock(m)}
                              className="p-2 text-gray-500 hover:text-red-600 rounded-lg"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </TableRow>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {activeTab === 'papers' && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Past Papers</CardTitle>
                <Button size="sm" onClick={handleOpenPaperModal}>
                  <Plus className="w-4 h-4" />
                  Upload Past Paper
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {loadingPapers ? (
                <div className="py-8 flex justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-surface-border border-t-zlearn-primary" />
                </div>
              ) : papers.length === 0 ? (
                <p className="text-center py-12 text-gray-500">No past papers yet. Upload one to get started.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-xs font-medium text-gray-500 uppercase">
                        <th className="pb-3">Past Paper</th>
                        <th className="pb-3">Year</th>
                        <th className="pb-3">Status</th>
                        <th className="pb-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {papers.map((p) => (
                        <TableRow key={p.id}>
                          <td className="py-3 font-medium text-gray-900">{p.title}</td>
                          <td className="py-3 text-gray-600">{p.year}</td>
                          <td className="py-3">
                            <Badge variant={p.is_published ? 'published' : 'draft'}>
                              {p.is_published ? 'Published' : 'Draft'}
                            </Badge>
                          </td>
                          <td className="py-3 text-right">
                            <button
                              onClick={() => handleDeletePaper(p)}
                              className="p-2 text-gray-500 hover:text-red-600 rounded-lg"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </TableRow>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {activeTab === 'enrollments' && (
          <Card>
            <CardHeader>
              <CardTitle>Enrollments</CardTitle>
            </CardHeader>
            <CardContent>
              {loadingEnrollments ? (
                <div className="py-8 flex justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-surface-border border-t-zlearn-primary" />
                </div>
              ) : enrollments.length === 0 ? (
                <p className="text-center py-12 text-gray-500">No enrollments yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-xs font-medium text-gray-500 uppercase">
                        <th className="pb-3">Student</th>
                        <th className="pb-3">Status</th>
                        <th className="pb-3">Progress</th>
                        <th className="pb-3">Avg Mock Score</th>
                        <th className="pb-3">Best Score</th>
                        <th className="pb-3">Total Study Hours</th>
                        <th className="pb-3">Enrolled</th>
                      </tr>
                    </thead>
                    <tbody>
                      {enrollments.map((en) => {
                        const name = (en as any).student_full_name || (en as any).student_email || `ID: ${en.id}` || 'Unknown User';
                        return (
                          <TableRow key={en.id}>
                            <td className="py-3 font-medium text-gray-900">{name}</td>
                            <td className="py-3">
                              <Badge variant={en.status === 'completed' ? 'published' : 'draft'}>{en.status ?? 'active'}</Badge>
                            </td>
                            <td className="py-3 text-gray-600">{(en as any).progress_percentage != null ? `${(en as any).progress_percentage}%` : '—'}</td>
                            <td className="py-3 text-gray-600">{(en as any).mocks_average_score != null ? `${(en as any).mocks_average_score}%` : '—'}</td>
                            <td className="py-3 text-gray-600">{(en as any).best_mock_score != null ? `${(en as any).best_mock_score}%` : '—'}</td>
                            <td className="py-3 text-gray-600">
                              {(en as any).total_study_hours != null ? `${(en as any).total_study_hours} hrs` : '—'}
                            </td>
                            <td className="py-3 text-gray-600">
                              {(en as any).created_at ? new Date((en as any).created_at).toLocaleDateString() : '—'}
                            </td>
                          </TableRow>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Subject Modal */}
      <Modal
        isOpen={subjectModal !== null}
        onClose={() => setSubjectModal(null)}
        title={subjectModal === 'edit' ? 'Edit Subject' : 'Add Subject'}
      >
        {error && <Alert type="error" message={error} className="mb-4" />}
        <form onSubmit={handleSubmitSubject} className="space-y-4">
          <Input
            label="Title *"
            value={courseForm.title}
            onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
            placeholder="e.g., Mathematics"
            required
          />
          <Input
            label="Subject"
            value={courseForm.subject}
            onChange={(e) => setCourseForm({ ...courseForm, subject: e.target.value })}
            placeholder="Optional subject code"
          />
          <Input
            label="Order"
            type="number"
            value={courseForm.order}
            onChange={(e) => setCourseForm({ ...courseForm, order: parseInt(e.target.value) || 0 })}
          />
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={courseForm.is_published}
              onChange={(e) => setCourseForm({ ...courseForm, is_published: e.target.checked })}
              className="w-4 h-4 text-zlearn-primary border-gray-300 rounded"
            />
            <span className="text-sm font-medium text-gray-700">Published</span>
          </label>
          <div className="flex gap-3">
            <Button type="submit" fullWidth loading={isCreatingCourse || isUpdatingCourse}>
              {editingCourse ? 'Update' : 'Add'}
            </Button>
            <Button type="button" variant="outline" onClick={() => setSubjectModal(null)} fullWidth>
              Cancel
            </Button>
          </div>
        </form>
      </Modal>

      {/* Mock Exam Modal */}
      <Modal isOpen={mockModal} onClose={() => setMockModal(false)} title="Create Mock Exam" size="md">
        {error && <Alert type="error" message={error} className="mb-4" />}
        <form onSubmit={handleSubmitMock} className="space-y-4">
          <Input
            label="Title *"
            value={mockForm.title}
            onChange={(e) => setMockForm({ ...mockForm, title: e.target.value })}
            placeholder="e.g., JAMB Practice Test 1"
            required
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
            <textarea
              value={mockForm.description}
              onChange={(e) => setMockForm({ ...mockForm, description: e.target.value })}
              className="w-full px-3 py-2.5 border border-surface-border rounded-lg"
              rows={2}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Duration (min)"
              type="number"
              value={mockForm.duration_minutes}
              onChange={(e) => setMockForm({ ...mockForm, duration_minutes: parseInt(e.target.value) || 0 })}
            />
            <Input
              label="Questions"
              type="number"
              value={mockForm.number_of_questions}
              onChange={(e) => setMockForm({ ...mockForm, number_of_questions: parseInt(e.target.value) || 0 })}
            />
            <Input
              label="Total Marks"
              type="number"
              value={mockForm.total_marks}
              onChange={(e) => setMockForm({ ...mockForm, total_marks: parseInt(e.target.value) || 0 })}
            />
            <Input
              label="Passing Score"
              type="number"
              value={mockForm.passing_score}
              onChange={(e) => setMockForm({ ...mockForm, passing_score: parseInt(e.target.value) || 0 })}
            />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={mockForm.is_timed}
              onChange={(e) => setMockForm({ ...mockForm, is_timed: e.target.checked })}
              className="w-4 h-4 text-zlearn-primary border-gray-300 rounded"
            />
            <span className="text-sm font-medium text-gray-700">Timed exam</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={mockForm.is_published}
              onChange={(e) => setMockForm({ ...mockForm, is_published: e.target.checked })}
              className="w-4 h-4 text-zlearn-primary border-gray-300 rounded"
            />
            <span className="text-sm font-medium text-gray-700">Publish immediately</span>
          </label>
          <div className="flex gap-3">
            <Button type="submit" fullWidth loading={isCreatingMock}>
              Create
            </Button>
            <Button type="button" variant="outline" onClick={() => setMockModal(false)} fullWidth>
              Cancel
            </Button>
          </div>
        </form>
      </Modal>

      {/* Past Paper Modal */}
      <Modal isOpen={paperModal} onClose={() => setPaperModal(false)} title="Upload Past Paper" size="md">
        {error && <Alert type="error" message={error} className="mb-4" />}
        <form onSubmit={handleSubmitPaper} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
          <Input
            label="Title *"
            value={paperForm.title}
            onChange={(e) => setPaperForm({ ...paperForm, title: e.target.value })}
            placeholder="e.g., JAMB 2024 Mathematics"
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Year *"
              type="number"
              value={paperForm.year}
              onChange={(e) =>
                setPaperForm({ ...paperForm, year: parseInt(e.target.value) || new Date().getFullYear() })
              }
            />
            <Input
              label="Exam Board"
              value={paperForm.exam_board}
              onChange={(e) => setPaperForm({ ...paperForm, exam_board: e.target.value })}
            />
          </div>
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-sm font-medium text-gray-700">Past Paper (JSON) *</label>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setShowJsonTemplate(!showJsonTemplate);
                }}
                className="text-xs text-zlearn-primary hover:underline font-medium"
              >
                {showJsonTemplate ? 'Hide JSON Template' : 'View JSON Template'}
              </button>
            </div>
            {showJsonTemplate && (
              <div className="mb-3 p-3 bg-surface-muted border border-surface-borderLight rounded-lg overflow-x-auto text-xs font-mono text-gray-700 max-h-48 overflow-y-auto">
                <pre>{`{
  "instructions": "Answer all questions. You have 2 hours.",
  "total_marks": 7,
  "questions": [
    {
      "question_number": 1,
      "text": "What is the capital of France?",
      "type": "multiple_choice",
      "options": {
        "A": "London",
        "B": "Berlin",
        "C": "Paris",
        "D": "Madrid"
      },
      "correct_answer": "C",
      "marks": 2,
      "ai_explanation": "Paris is the capital."
    }
  ]
}`}</pre>
              </div>
            )}
            <input
              type="file"
              accept=".json,application/json"
              onChange={(e) => setPaperForm({ ...paperForm, question_paper: e.target.files?.[0] || null })}
              className="w-full px-3 py-2.5 border border-surface-border rounded-lg"
              required
            />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={paperForm.is_published}
              onChange={(e) => setPaperForm({ ...paperForm, is_published: e.target.checked })}
              className="w-4 h-4 text-zlearn-primary border-gray-300 rounded"
            />
            <span className="text-sm font-medium text-gray-700">Publish immediately</span>
          </label>
          <div className="flex gap-3">
            <Button type="submit" fullWidth loading={isCreatingPaper}>
              Upload
            </Button>
            <Button type="button" variant="outline" onClick={() => setPaperModal(false)} fullWidth>
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </AdminLayout>
  );
};

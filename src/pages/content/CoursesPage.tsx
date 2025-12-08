import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../store/store';
import { AdminLayout } from '../../components/layout';
import { DataTable, Column } from '../../components/common/DataTable';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import {
  useGetCoursesQuery,
  useGetSubjectsQuery,
  useCreateCourseMutation,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
  contentApi,
} from '../../store/api/contentApi';
import {
  useGetProgramsQuery,
  useGetClassLevelsQuery,
  useGetCurriculaQuery,
  useGetCurriculaByProgramQuery,
} from '../../store/api/educationApi';
import type { ContentCourse } from '../../interfaces/course';
import { Alert } from '../../components/common/Alert';

export const CoursesPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { data: courses = [], isLoading } = useGetCoursesQuery({});
  const { data: subjectsData } = useGetSubjectsQuery();
  const { data: programsData } = useGetProgramsQuery({});
  const { data: classLevelsData } = useGetClassLevelsQuery({ ordering: 'order' });

  // State to track selected program for curricula filtering
  const [selectedProgramForCurricula, setSelectedProgramForCurricula] = useState<string>('');

  // Fetch curricula by program using the public endpoint
  const { data: curriculaByProgramData, isLoading: isLoadingCurriculaByProgram, error: curriculaByProgramError } = useGetCurriculaByProgramQuery(
    selectedProgramForCurricula,
    { skip: !selectedProgramForCurricula } // Skip query if no program is selected
  );

  // Fallback: Fetch all curricula when no program is selected (for editing existing courses)
  const { data: allCurriculaData, isLoading: isLoadingAllCurricula } = useGetCurriculaQuery(
    { is_active: true },
    { skip: !!selectedProgramForCurricula } // Skip if program is selected (use program-specific endpoint)
  );

  // Use program-specific curricula if available, otherwise use all curricula
  const curriculaData = selectedProgramForCurricula ? curriculaByProgramData : allCurriculaData;
  const isLoadingCurricula = selectedProgramForCurricula ? isLoadingCurriculaByProgram : isLoadingAllCurricula;
  const curriculaError = selectedProgramForCurricula ? curriculaByProgramError : undefined;
  const [createCourse, { isLoading: isCreating }] = useCreateCourseMutation();
  const [updateCourse, { isLoading: isUpdating }] = useUpdateCourseMutation();
  const [deleteCourse] = useDeleteCourseMutation();

  // Ensure arrays and filter by is_active
  const subjects = Array.isArray(subjectsData) ? subjectsData : [];
  const programs = Array.isArray(programsData)
    ? programsData.filter((p: any) => p.is_active !== false)
    : [];
  const allClassLevels = Array.isArray(classLevelsData)
    ? classLevelsData.filter((c: any) => c.is_active !== false)
    : [];
  // Debug: Log curricula data to help diagnose issues
  if (process.env.NODE_ENV === 'development') {
    console.log('Curricula data:', curriculaData, 'Is array:', Array.isArray(curriculaData), 'Error:', curriculaError, 'Loading:', isLoadingCurricula);
  }

  // Get curricula array - transformArrayResponse should handle paginated responses
  const curricula = Array.isArray(curriculaData) ? curriculaData : [];

  // Hardcoded options from content_admin_prepopulate.md
  const COURSE_TYPE_OPTIONS = [
    { value: 'entrance_exam', label: 'Entrance Exam Preparation', description: 'Prepare students for entrance exams' },
    { value: 'regular', label: 'Regular Course Content', description: 'Standard curriculum courses' },
    { value: 'advanced', label: 'Advanced Topics', description: 'Advanced level content' },
    { value: 'review', label: 'Review & Revision', description: 'Review and practice materials' },
  ];

  const DIFFICULTY_OPTIONS = [
    { value: 'beginner', label: 'Beginner', icon: '🟢' },
    { value: 'intermediate', label: 'Intermediate', icon: '🟡' },
    { value: 'advanced', label: 'Advanced', icon: '🟠' },
    { value: 'expert', label: 'Expert', icon: '🔴' },
  ];

  const LANGUAGE_OPTIONS = [
    { value: 'en', label: 'English', flag: '🇬🇧' },
    { value: 'fr', label: 'French', flag: '🇫🇷' },
    { value: 'es', label: 'Spanish', flag: '🇪🇸' },
    { value: 'ar', label: 'Arabic', flag: '🇸🇦' },
    { value: 'pt', label: 'Portuguese', flag: '🇵🇹' },
  ];

  const CURRENCY_OPTIONS = [
    { value: 'USD', label: 'US Dollar', symbol: '$' },
    { value: 'EUR', label: 'Euro', symbol: '€' },
    { value: 'GBP', label: 'British Pound', symbol: '£' },
    { value: 'NGN', label: 'Nigerian Naira', symbol: '₦' },
    { value: 'XAF', label: 'Central African CFA Franc', symbol: 'FCFA' },
    { value: 'XOF', label: 'West African CFA Franc', symbol: 'FCFA' },
  ];

  const EXAM_SYSTEM_OPTIONS = [
    { value: 'GCE_OL', label: 'GCE O-Level' },
    { value: 'WAEC', label: 'WAEC' },
    { value: 'BACCALAUREAT', label: 'Baccalauréat' },
    { value: 'NECO', label: 'NECO' },
    { value: 'JAMB', label: 'JAMB' },
    { value: 'SAT', label: 'SAT' },
    { value: 'ACT', label: 'ACT' },
    { value: 'IB', label: 'International Baccalaureate' },
  ];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<ContentCourse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    code: '',
    title: '',
    description: '',
    course_type: 'regular' as 'entrance_exam' | 'regular' | 'advanced' | 'review',
    subject: '',
    program: '',
    class_level: '',
    curriculum: '',
    exam_system: '',
    difficulty: 'beginner' as 'beginner' | 'intermediate' | 'advanced' | 'expert',
    estimated_hours: 0,
    // Media files
    thumbnail: null as File | null,
    banner_image: null as File | null,
    video_intro: null as File | null,
    // Entrance exam fields
    exam_board: '',
    exam_year: new Date().getFullYear(),
    passing_score: '',
    exam_format: '',
    // Content
    learning_objectives: [] as string[],
    requirements: '',
    learning_outcomes: '',
    tags: [] as string[],
    // Status and access
    is_published: false,
    is_free: true,
    price: '0.00',
    currency: 'USD',
    priority_order: 100,
    // Enrollment
    instructor: '',
    max_students: '',
    enrollment_deadline: '',
    // Metadata
    language: 'en',
  });

  // Filter class levels - when no program is selected, show all class levels
  // When program is selected, class level is not used (program has its own class level)
  const filteredClassLevels = allClassLevels;

  // Filter curricula based on selected program
  // The API already filters by program, but we also include the currently selected curriculum
  // to prevent it from disappearing from the dropdown
  const filteredCurricula = formData.program
    ? curricula.filter((c: any) => {
      // Check if program is an object (from new API) or a string (from old API)
      const programId = typeof c.program === 'object' ? c.program?.id : c.program;
      // Include if it matches the program OR if it's the currently selected curriculum
      return programId === formData.program || c.id === formData.curriculum;
    })
    : curricula;

  const handleOpenModal = async (course?: ContentCourse) => {
    if (course) {
      // Fetch full course details for editing
      try {
        const result = await dispatch(contentApi.endpoints.getCourse.initiate(course.id));
        if ('data' in result && result.data) {
          const fullCourse = result.data;
          setEditingCourse(fullCourse);
          setFormData({
            code: fullCourse.code,
            title: fullCourse.title,
            description: fullCourse.description,
            course_type: fullCourse.course_type,
            subject: fullCourse.subject ? String(fullCourse.subject) : '',
            program: fullCourse.program ? String(fullCourse.program) : '',
            class_level: fullCourse.class_level ? String(fullCourse.class_level) : '',
            curriculum: fullCourse.curriculum || '',
            exam_system: fullCourse.exam_system || '',
            difficulty: fullCourse.difficulty,
            estimated_hours: fullCourse.estimated_hours || 0,
            thumbnail: null,
            banner_image: null,
            video_intro: null,
            exam_board: fullCourse.exam_board || '',
            exam_year: fullCourse.exam_year || new Date().getFullYear(),
            passing_score: fullCourse.passing_score ? String(fullCourse.passing_score) : '',
            exam_format: fullCourse.exam_format || '',
            learning_objectives: fullCourse.learning_objectives || [],
            requirements: fullCourse.requirements || '',
            learning_outcomes: fullCourse.learning_outcomes || '',
            tags: fullCourse.tags || [],
            is_published: fullCourse.is_published,
            is_free: fullCourse.is_free,
            price: fullCourse.price ? String(fullCourse.price) : '0.00',
            currency: fullCourse.currency || 'USD',
            priority_order: fullCourse.priority_order || 100,
            instructor: fullCourse.instructor ? String(fullCourse.instructor) : '',
            max_students: fullCourse.max_students ? String(fullCourse.max_students) : '',
            enrollment_deadline: fullCourse.enrollment_deadline
              ? new Date(new Date(fullCourse.enrollment_deadline).getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16)
              : '',
            language: fullCourse.language || 'en',
          });
          // Set the program filter for curricula query
          setSelectedProgramForCurricula(fullCourse.program ? String(fullCourse.program) : '');
        } else {
          throw new Error('Failed to fetch course details');
        }
      } catch (err) {
        console.error('Failed to fetch course details:', err);
        setError('Failed to load course details');
        return;
      }
    } else {
      setEditingCourse(null);
      setFormData({
        code: '',
        title: '',
        description: '',
        course_type: 'regular',
        subject: '',
        program: '',
        class_level: '',
        curriculum: '',
        exam_system: '',
        difficulty: 'beginner',
        estimated_hours: 0,
        thumbnail: null,
        banner_image: null,
        video_intro: null,
        exam_board: '',
        exam_year: new Date().getFullYear(),
        passing_score: '',
        exam_format: '',
        learning_objectives: [],
        requirements: '',
        learning_outcomes: '',
        tags: [],
        is_published: false,
        is_free: true,
        price: '0.00',
        currency: 'USD',
        priority_order: 100,
        instructor: '',
        max_students: '',
        enrollment_deadline: '',
        language: 'en',
      });
      // Reset the program filter for curricula query
      setSelectedProgramForCurricula('');
    }
    setError(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCourse(null);
    setError(null);
  };

  // Helper function to prepare data for API submission
  const prepareCourseData = (data: typeof formData): FormData | any => {
    const hasFiles = data.thumbnail || data.banner_image || data.video_intro;

    if (hasFiles) {
      const formDataObj = new FormData();

      // Required fields
      formDataObj.append('title', data.title.trim());
      formDataObj.append('code', data.code.trim());
      formDataObj.append('description', data.description.trim());

      // Handle subject - can be UUID string or number
      if (data.subject && data.subject !== '') {
        const subjectId = parseInt(data.subject, 10);
        formDataObj.append('subject', !isNaN(subjectId) && String(subjectId) === data.subject ? String(subjectId) : data.subject);
      }

      // Handle curriculum - can be UUID string
      if (data.curriculum && data.curriculum !== '') {
        formDataObj.append('curriculum', data.curriculum);
      }
      // Handle exam_system
      if (data.exam_system && data.exam_system !== '') {
        formDataObj.append('exam_system', data.exam_system);
      }
      formDataObj.append('estimated_hours', String(data.estimated_hours));

      // Optional fields
      formDataObj.append('course_type', data.course_type);

      // Handle program - can be UUID string or number
      if (data.program && data.program !== '') {
        const programId = parseInt(data.program, 10);
        formDataObj.append('program', !isNaN(programId) && String(programId) === data.program ? String(programId) : data.program);
      }

      // Handle class_level - can be UUID string or number
      if (data.class_level && data.class_level !== '') {
        const classLevelId = parseInt(data.class_level, 10);
        formDataObj.append('class_level', !isNaN(classLevelId) && String(classLevelId) === data.class_level ? String(classLevelId) : data.class_level);
      }

      formDataObj.append('difficulty', data.difficulty);

      // Media files
      if (data.thumbnail) formDataObj.append('thumbnail', data.thumbnail);
      if (data.banner_image) formDataObj.append('banner_image', data.banner_image);
      if (data.video_intro) formDataObj.append('video_intro', data.video_intro);

      // Entrance exam fields
      if (data.course_type === 'entrance_exam') {
        if (data.exam_board) formDataObj.append('exam_board', data.exam_board);
        if (data.exam_year) formDataObj.append('exam_year', String(data.exam_year));
        if (data.passing_score) formDataObj.append('passing_score', data.passing_score);
        if (data.exam_format) formDataObj.append('exam_format', data.exam_format);
      }

      // Content
      if (data.learning_objectives && data.learning_objectives.length > 0) {
        data.learning_objectives.forEach((obj) => formDataObj.append('learning_objectives', obj));
      }
      if (data.requirements?.trim()) formDataObj.append('requirements', data.requirements.trim());
      if (data.learning_outcomes?.trim())
        formDataObj.append('learning_outcomes', data.learning_outcomes.trim());
      if (data.tags && data.tags.length > 0) {
        data.tags.forEach((tag) => formDataObj.append('tags', tag));
      }

      // Status and access
      formDataObj.append('is_published', String(data.is_published));
      formDataObj.append('is_free', String(data.is_free));
      formDataObj.append('price', String(parseFloat(data.price) || 0.00));
      formDataObj.append('currency', data.currency || 'USD');
      formDataObj.append('priority_order', String(data.priority_order));

      // Enrollment
      // Handle instructor - can be UUID string or number
      if (data.instructor && data.instructor !== '') {
        const instructorId = parseInt(data.instructor, 10);
        formDataObj.append('instructor', !isNaN(instructorId) && String(instructorId) === data.instructor ? String(instructorId) : data.instructor);
      }
      if (data.max_students && data.max_students !== '') {
        formDataObj.append('max_students', data.max_students);
      }
      if (data.enrollment_deadline) {
        formDataObj.append('enrollment_deadline', new Date(data.enrollment_deadline).toISOString());
      }

      // Metadata
      formDataObj.append('language', data.language || 'en');

      return formDataObj;
    }

    // No files - use JSON
    const payload: any = {
      title: data.title.trim(),
      code: data.code.trim(),
      description: data.description.trim(),
      // Handle curriculum - can be UUID string
      curriculum: data.curriculum && data.curriculum !== '' ? data.curriculum : null,
      // Handle exam_system
      exam_system: data.exam_system && data.exam_system !== '' ? data.exam_system : null,
      estimated_hours: data.estimated_hours,
      course_type: data.course_type,
      difficulty: data.difficulty,
      is_published: data.is_published,
      is_free: data.is_free,
      price: parseFloat(data.price) || 0.00,
      currency: data.currency || 'USD',
      priority_order: data.priority_order,
      language: data.language || 'en',
    };

    // Handle subject - can be UUID string or number
    if (data.subject && data.subject !== '') {
      const subjectId = parseInt(data.subject, 10);
      payload.subject = !isNaN(subjectId) && String(subjectId) === data.subject ? subjectId : data.subject;
    }

    // Handle program - can be UUID string or number
    if (data.program && data.program !== '') {
      const programId = parseInt(data.program, 10);
      payload.program = !isNaN(programId) && String(programId) === data.program ? programId : data.program;
    }

    // Handle class_level - can be UUID string or number
    if (data.class_level && data.class_level !== '') {
      const classLevelId = parseInt(data.class_level, 10);
      payload.class_level = !isNaN(classLevelId) && String(classLevelId) === data.class_level ? classLevelId : data.class_level;
    }

    // Entrance exam fields
    if (data.course_type === 'entrance_exam') {
      if (data.exam_board) payload.exam_board = data.exam_board;
      if (data.exam_year) payload.exam_year = parseInt(String(data.exam_year), 10);
      if (data.passing_score) payload.passing_score = parseInt(data.passing_score, 10);
      if (data.exam_format) payload.exam_format = data.exam_format;
    }

    // Content
    if (data.learning_objectives && data.learning_objectives.length > 0) {
      payload.learning_objectives = data.learning_objectives;
    }
    if (data.requirements?.trim()) payload.requirements = data.requirements.trim();
    if (data.learning_outcomes?.trim()) payload.learning_outcomes = data.learning_outcomes.trim();
    if (data.tags && data.tags.length > 0) {
      payload.tags = data.tags;
    }

    // Enrollment
    // Handle instructor - can be UUID string or number
    if (data.instructor && data.instructor !== '') {
      const instructorId = parseInt(data.instructor, 10);
      payload.instructor = !isNaN(instructorId) && String(instructorId) === data.instructor ? instructorId : data.instructor;
    }

    if (data.max_students && data.max_students !== '') {
      payload.max_students = parseInt(data.max_students, 10);
    }

    if (data.enrollment_deadline) {
      payload.enrollment_deadline = new Date(data.enrollment_deadline).toISOString();
    }

    return payload;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation: If curriculum is set, program must be set
    if (formData.curriculum && !formData.program) {
      setError('Curriculum requires a program to be specified.');
      return;
    }

    try {
      const preparedData = prepareCourseData(formData);
      if (editingCourse) {
        await updateCourse({ id: editingCourse.id, data: preparedData }).unwrap();
      } else {
        await createCourse(preparedData).unwrap();
      }
      handleCloseModal();
    } catch (err: any) {
      if (err?.data) {
        const errorMessages: string[] = [];
        Object.keys(err.data).forEach((key) => {
          if (Array.isArray(err.data[key])) {
            errorMessages.push(`${key}: ${err.data[key].join(', ')}`);
          } else if (typeof err.data[key] === 'string') {
            errorMessages.push(err.data[key]);
          } else {
            errorMessages.push(`${key}: ${JSON.stringify(err.data[key])}`);
          }
        });
        setError(errorMessages.join(' | ') || 'An error occurred');
      } else {
        setError(err?.message || 'An error occurred');
      }
    }
  };

  const isSubmitting = isCreating || isUpdating;

  const handleDelete = async (course: ContentCourse) => {
    if (window.confirm(`Are you sure you want to delete "${course.title}"?`)) {
      try {
        await deleteCourse(course.id).unwrap();
      } catch (err: any) {
        alert(err?.data?.message || 'Failed to delete course');
      }
    }
  };

  const columns: Column<ContentCourse>[] = [
    { key: 'code', header: 'Code' },
    { key: 'title', header: 'Title' },
    {
      key: 'subject_name',
      header: 'Subject',
      render: (course) => course.subject_name || 'N/A',
    },
    {
      key: 'program_name',
      header: 'Program',
      render: (course) => course.program_name || 'N/A',
    },
    {
      key: 'class_level_name',
      header: 'Class Level',
      render: (course) => course.class_level_name || 'N/A',
    },
    {
      key: 'curriculum_name',
      header: 'Curriculum',
      render: (course) => course.curriculum_name || 'N/A',
    },
    {
      key: 'exam_system',
      header: 'Exam System',
      render: (course) => course.exam_system || 'N/A',
    },
    {
      key: 'course_type',
      header: 'Type',
      render: (course) => (
        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
          {course.course_type}
        </span>
      ),
    },
    {
      key: 'difficulty',
      header: 'Difficulty',
      render: (course) => (
        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
          {course.difficulty}
        </span>
      ),
    },
    {
      key: 'is_published',
      header: 'Status',
      render: (course) => (
        <span
          className={`px-2 py-1 text-xs font-semibold rounded-full ${course.is_published
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-800'
            }`}
        >
          {course.is_published ? 'Published' : 'Draft'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (course) => (
        <button
          onClick={() => navigate(`/admin/content/courses/${course.id}`)}
          className="text-[#446D6D] hover:text-[#5a8a8a] font-medium text-sm"
        >
          Manage →
        </button>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Content Courses</h1>
            <p className="text-gray-600 mt-1">Manage academic courses</p>
          </div>
        </div>

        {error && <Alert type="error" message={error} />}

        <DataTable
          data={courses}
          columns={columns}
          loading={isLoading}
          onAdd={() => handleOpenModal()}
          onEdit={handleOpenModal}
          onDelete={handleDelete}
          title="All Courses"
          addButtonLabel="Add Course"
          keyExtractor={(item) => item.id}
        />

        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title={editingCourse ? 'Edit Course' : 'Create Course'}
          size="xl"
        >
          <form onSubmit={handleSubmit} className="space-y-6 max-h-[80vh] overflow-y-auto pr-2">
            {/* Basic Information */}
            <div className="space-y-4 border-b pb-4">
              <h3 className="text-lg font-semibold text-gray-800">Basic Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Code *"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  required
                  placeholder="MATH_FORM1_OL"
                />
                <Input
                  label="Title *"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#446D6D] focus:ring-4 focus:ring-[#446D6D]/10 outline-none transition-all duration-200"
                  rows={3}
                  required
                />
              </div>
            </div>

            {/* Educational Context */}
            <div className="space-y-4 border-b pb-4">
              <h3 className="text-lg font-semibold text-gray-800">Educational Context</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#446D6D] focus:ring-4 focus:ring-[#446D6D]/10 outline-none transition-all duration-200"
                    required
                  >
                    <option value="">Select Subject</option>
                    {subjects.map((subject: any) => (
                      <option key={subject.id} value={subject.id}>
                        {subject.icon || '📚'} {subject.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Curriculum {formData.program ? '*' : ''}
                  </label>
                  <select
                    value={formData.curriculum}
                    onChange={(e) => setFormData({ ...formData, curriculum: e.target.value })}
                    disabled={!formData.program}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#446D6D] focus:ring-4 focus:ring-[#446D6D]/10 outline-none transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    required={!!formData.program}
                  >
                    <option value="">
                      {!formData.program
                        ? 'Select Program First'
                        : isLoadingCurricula
                          ? 'Loading curricula...'
                          : filteredCurricula.length === 0
                            ? 'No curricula available'
                            : 'Select Curriculum'}
                    </option>
                    {filteredCurricula.map((cur: any) => {
                      // Format display name: curriculum name already includes year, just add semester if not "both"
                      let displayName = cur.name || 'Unnamed Curriculum';
                      if (cur.semester && cur.semester !== 'both') {
                        // Capitalize first letter of semester
                        const semesterDisplay = cur.semester.charAt(0).toUpperCase() + cur.semester.slice(1);
                        displayName += ` (${semesterDisplay} Semester)`;
                      }
                      return (
                        <option key={cur.id} value={cur.id}>
                          {displayName}
                        </option>
                      );
                    })}
                  </select>
                  {formData.curriculum && !formData.program && (
                    <p className="text-xs text-red-600 mt-1">Curriculum requires a program to be specified.</p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Program</label>
                  <select
                    value={formData.program}
                    onChange={(e) => {
                      const newProgram = e.target.value;
                      const updatedFormData: any = {
                        ...formData,
                        program: newProgram,
                        // Reset class level when program is selected (program has its own class level)
                        // Keep class level if program is cleared (for general class level courses)
                        class_level: newProgram ? '' : formData.class_level,
                      };

                      // Update the program filter for curricula query
                      setSelectedProgramForCurricula(newProgram);

                      // Only reset curriculum if the currently selected curriculum doesn't belong to the new program
                      if (newProgram && formData.curriculum) {
                        const selectedCurriculum = curricula.find((c: any) => c.id === formData.curriculum);
                        if (selectedCurriculum) {
                          // Check if program is an object (from new API) or a string (from old API)
                          const curriculumProgramId = typeof selectedCurriculum.program === 'object'
                            ? selectedCurriculum.program?.id
                            : selectedCurriculum.program;
                          if (curriculumProgramId !== newProgram) {
                            // The selected curriculum doesn't belong to the new program, so clear it
                            updatedFormData.curriculum = '';
                          }
                          // If the curriculum does belong to the new program, keep it selected
                        }
                      } else if (!newProgram) {
                        // Program cleared, keep curriculum (it might not have a program filter)
                      }

                      setFormData(updatedFormData);
                    }}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#446D6D] focus:ring-4 focus:ring-[#446D6D]/10 outline-none transition-all duration-200"
                  >
                    <option value="">No Program</option>
                    {programs.map((program: any) => (
                      <option key={program.id} value={program.id}>
                        {program.name} {program.education_level_name ? `- ${program.education_level_name}` : ''}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Class Level {!formData.program ? '(Optional)' : ''}
                  </label>
                  <select
                    value={formData.class_level}
                    onChange={(e) => setFormData({ ...formData, class_level: e.target.value })}
                    disabled={!!formData.program}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#446D6D] focus:ring-4 focus:ring-[#446D6D]/10 outline-none transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <option value="">
                      {formData.program
                        ? 'Not available when program is selected'
                        : 'Select Class Level (Optional)'}
                    </option>
                    {!formData.program && filteredClassLevels.map((level: any) => (
                      <option key={level.id} value={level.id}>
                        {level.name} {level.age_range_start && level.age_range_end ? `(Ages ${level.age_range_start}-${level.age_range_end})` : ''}
                      </option>
                    ))}
                  </select>
                  {formData.program && (
                    <p className="text-xs text-gray-500 mt-1">
                      Class level is determined by the selected program. Clear the program to set a general class level.
                    </p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Exam System
                  </label>
                  <select
                    value={formData.exam_system}
                    onChange={(e) => setFormData({ ...formData, exam_system: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#446D6D] focus:ring-4 focus:ring-[#446D6D]/10 outline-none transition-all duration-200"
                  >
                    <option value="">No Exam System</option>
                    {EXAM_SYSTEM_OPTIONS.map((system) => (
                      <option key={system.value} value={system.value}>
                        {system.label}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">Optional: For filtering courses by exam system</p>
                </div>
              </div>
            </div>

            {/* Course Details */}
            <div className="space-y-4 border-b pb-4">
              <h3 className="text-lg font-semibold text-gray-800">Course Details</h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Course Type
                  </label>
                  <select
                    value={formData.course_type}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        course_type: e.target.value as any,
                      })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#446D6D] focus:ring-4 focus:ring-[#446D6D]/10 outline-none transition-all duration-200"
                  >
                    {COURSE_TYPE_OPTIONS.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        difficulty: e.target.value as any,
                      })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#446D6D] focus:ring-4 focus:ring-[#446D6D]/10 outline-none transition-all duration-200"
                  >
                    {DIFFICULTY_OPTIONS.map((diff) => (
                      <option key={diff.value} value={diff.value}>
                        {diff.icon} {diff.label}
                      </option>
                    ))}
                  </select>
                </div>
                <Input
                  label="Estimated Hours *"
                  type="number"
                  value={formData.estimated_hours}
                  onChange={(e) =>
                    setFormData({ ...formData, estimated_hours: parseInt(e.target.value) || 0 })
                  }
                  required
                  min="1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                <select
                  value={formData.language}
                  onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#446D6D] focus:ring-4 focus:ring-[#446D6D]/10 outline-none transition-all duration-200"
                >
                  {LANGUAGE_OPTIONS.map((lang) => (
                    <option key={lang.value} value={lang.value}>
                      {lang.flag} {lang.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Entrance Exam Fields */}
            {formData.course_type === 'entrance_exam' && (
              <div className="space-y-4 border-b pb-4">
                <h3 className="text-lg font-semibold text-gray-800">Entrance Exam Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Exam Board"
                    value={formData.exam_board}
                    onChange={(e) => setFormData({ ...formData, exam_board: e.target.value })}
                    placeholder="WAEC, JAMB, NECO, etc."
                  />
                  <Input
                    label="Exam Year"
                    type="number"
                    value={formData.exam_year}
                    onChange={(e) =>
                      setFormData({ ...formData, exam_year: parseInt(e.target.value) || new Date().getFullYear() })
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Passing Score"
                    type="number"
                    value={formData.passing_score}
                    onChange={(e) => setFormData({ ...formData, passing_score: e.target.value })}
                    placeholder="50"
                  />
                  <Input
                    label="Exam Format"
                    value={formData.exam_format}
                    onChange={(e) => setFormData({ ...formData, exam_format: e.target.value })}
                    placeholder="Multiple Choice (60 questions)"
                  />
                </div>
              </div>
            )}

            {/* Media Files */}
            <div className="space-y-4 border-b pb-4">
              <h3 className="text-lg font-semibold text-gray-800">Media Files</h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Thumbnail</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        thumbnail: e.target.files?.[0] || null,
                      })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#446D6D] focus:ring-4 focus:ring-[#446D6D]/10 outline-none transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Banner Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        banner_image: e.target.files?.[0] || null,
                      })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#446D6D] focus:ring-4 focus:ring-[#446D6D]/10 outline-none transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Video Intro</label>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        video_intro: e.target.files?.[0] || null,
                      })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#446D6D] focus:ring-4 focus:ring-[#446D6D]/10 outline-none transition-all duration-200"
                  />
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="space-y-4 border-b pb-4">
              <h3 className="text-lg font-semibold text-gray-800">Content</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Learning Objectives
                </label>
                <input
                  type="text"
                  value={formData.learning_objectives.join(', ')}
                  onChange={(e) => {
                    const objectives = e.target.value
                      .split(',')
                      .map((obj) => obj.trim())
                      .filter((obj) => obj.length > 0);
                    setFormData({ ...formData, learning_objectives: objectives });
                  }}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#446D6D] focus:ring-4 focus:ring-[#446D6D]/10 outline-none transition-all duration-200"
                  placeholder="Master algebra, Understand geometry (comma-separated)"
                />
                <p className="text-xs text-gray-500 mt-1">Separate objectives with commas</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Requirements</label>
                <textarea
                  value={formData.requirements}
                  onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#446D6D] focus:ring-4 focus:ring-[#446D6D]/10 outline-none transition-all duration-200"
                  rows={2}
                  placeholder="Basic arithmetic knowledge"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Learning Outcomes
                </label>
                <textarea
                  value={formData.learning_outcomes}
                  onChange={(e) =>
                    setFormData({ ...formData, learning_outcomes: e.target.value })
                  }
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#446D6D] focus:ring-4 focus:ring-[#446D6D]/10 outline-none transition-all duration-200"
                  rows={2}
                  placeholder="Students will be able to solve complex equations"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                <input
                  type="text"
                  value={formData.tags.join(', ')}
                  onChange={(e) => {
                    const tags = e.target.value
                      .split(',')
                      .map((tag) => tag.trim())
                      .filter((tag) => tag.length > 0);
                    setFormData({ ...formData, tags });
                  }}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#446D6D] focus:ring-4 focus:ring-[#446D6D]/10 outline-none transition-all duration-200"
                  placeholder="mathematics, algebra, form1 (comma-separated)"
                />
                <p className="text-xs text-gray-500 mt-1">Separate tags with commas</p>
              </div>
            </div>

            {/* Status and Access */}
            <div className="space-y-4 border-b pb-4">
              <h3 className="text-lg font-semibold text-gray-800">Status and Access</h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                  <select
                    value={formData.currency}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#446D6D] focus:ring-4 focus:ring-[#446D6D]/10 outline-none transition-all duration-200"
                  >
                    {CURRENCY_OPTIONS.map((curr) => (
                      <option key={curr.value} value={curr.value}>
                        {curr.symbol} {curr.label} ({curr.value})
                      </option>
                    ))}
                  </select>
                </div>
                <Input
                  label="Price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  disabled={formData.is_free}
                />
                <Input
                  label="Priority Order"
                  type="number"
                  value={formData.priority_order}
                  onChange={(e) =>
                    setFormData({ ...formData, priority_order: parseInt(e.target.value) || 100 })
                  }
                  placeholder="100 (lower = higher priority)"
                />
              </div>
              <div className="flex gap-4 flex-wrap">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_published}
                    onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                    className="w-4 h-4 text-[#446D6D] border-gray-300 rounded focus:ring-[#446D6D]"
                  />
                  <span className="text-sm font-medium text-gray-700">Published</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_free}
                    onChange={(e) => setFormData({ ...formData, is_free: e.target.checked })}
                    className="w-4 h-4 text-[#446D6D] border-gray-300 rounded focus:ring-[#446D6D]"
                  />
                  <span className="text-sm font-medium text-gray-700">Free Course</span>
                </label>
              </div>
            </div>

            {/* Enrollment */}
            <div className="space-y-4 border-b pb-4">
              <h3 className="text-lg font-semibold text-gray-800">Enrollment</h3>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Max Students"
                  type="number"
                  value={formData.max_students}
                  onChange={(e) => setFormData({ ...formData, max_students: e.target.value })}
                  placeholder="Leave empty for unlimited"
                />
                <Input
                  label="Enrollment Deadline"
                  type="datetime-local"
                  value={formData.enrollment_deadline}
                  onChange={(e) =>
                    setFormData({ ...formData, enrollment_deadline: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" fullWidth loading={isSubmitting} disabled={isSubmitting}>
                {editingCourse ? 'Update' : 'Create'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleCloseModal}
                fullWidth
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </AdminLayout>
  );
};


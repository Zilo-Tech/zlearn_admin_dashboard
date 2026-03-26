import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../store/store';
import { AdminLayout } from '../../components/layout';
import { DataTable, Column } from '../../components/common/DataTable';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { BookOpen } from 'lucide-react';
import {
  useGetCoursesQuery,
  useGetCategoriesQuery,
  useCreateCourseMutation,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
  coursesApi,
} from '../../store/api/coursesApi';
import type { Course } from '../../interfaces/course';
import { Alert } from '../../components/common/Alert';
import { userStorage } from '../../utils/storage';
import { Badge } from '../../components/common/Badge';

export const CoursesPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { data: courses = [], isLoading } = useGetCoursesQuery({});
  const { data: categoriesData } = useGetCategoriesQuery();
  const [createCourse, { isLoading: isCreating }] = useCreateCourseMutation();
  const [updateCourse, { isLoading: isUpdating }] = useUpdateCourseMutation();
  const [deleteCourse] = useDeleteCourseMutation();

  // Ensure categories is always an array
  const categories = Array.isArray(categoriesData) ? categoriesData : [];



  const getCurrentAcademicYear = () => {
  const now = new Date();
  const year = now.getFullYear();

  // Academic year logic (e.g., 2025/2026)
  const nextYear = year + 1;

  return `${year}/${nextYear}`;
};

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    short_description: '',
    course_code: '',
    category: '',
    course_type: 'regular',
    level: 'beginner' as 'beginner' | 'intermediate' | 'advanced' | 'expert',
    status: 'draft' as 'draft' | 'published' | 'archived' | 'suspended',
    // Media files
    thumbnail: null as File | null,
    banner_image: null as File | null,
    video_intro: null as File | null,
    // Pricing
    price: '0.00',
    currency: 'USD',
    is_free: false,
    discount_price: '',
    discount_start_date: '',
    discount_end_date: '',
    // Course Structure
    duration_hours: 0,
    // Requirements & Outcomes
    requirements: '',
    learning_outcomes: '',
    // Metadata
    language: 'en',
  academic_year: getCurrentAcademicYear(),
    tags: [] as string[],
    featured: false,
    featured_order: 0,
    target_audience: '',
    // Enrollment
    max_students: '',
    enrollment_deadline: '',
    // Certification
    offers_certificate: false,
    certificate_requirements: {
      min_completion_percentage: '',
      min_assessment_score: '',
      min_time_spent_hours: '',
    },
  });

  const handleOpenModal = async (course?: Course) => {
    if (course) {
      // Fetch full course details for editing
      try {
        const result = await dispatch(coursesApi.endpoints.getCourse.initiate(course.id));
        if ('data' in result && result.data) {
          const fullCourse = result.data;
          setEditingCourse(fullCourse);
          setFormData({
            title: fullCourse.title,
          description: fullCourse.description,
          short_description: fullCourse.short_description || '',
          course_code: fullCourse.course_code || '',
          category: fullCourse.category ? String(fullCourse.category) : '',
          level: fullCourse.level,
          status: fullCourse.status,
          thumbnail: null,
          banner_image: null,
          video_intro: null,
          price: fullCourse.price,
          currency: fullCourse.currency,
          is_free: fullCourse.is_free,
          discount_price: fullCourse.discount_price || '',
          discount_start_date: fullCourse.discount_start_date
            ? new Date(fullCourse.discount_start_date).toISOString().slice(0, 16)
            : '',
          discount_end_date: fullCourse.discount_end_date
            ? new Date(fullCourse.discount_end_date).toISOString().slice(0, 16)
            : '',
          duration_hours: fullCourse.duration_hours || 0,
          requirements: fullCourse.requirements || '',
          learning_outcomes: fullCourse.learning_outcomes || '',
          course_type: fullCourse.course_type || 'regular',
          academic_year: fullCourse.academic_year || '',
          language: fullCourse.language || 'en',
          tags: fullCourse.tags || [],
          featured: fullCourse.featured,
          featured_order: fullCourse.featured_order || 0,
          target_audience: fullCourse.target_audience || '',
          max_students: fullCourse.max_students ? String(fullCourse.max_students) : '',
          enrollment_deadline: fullCourse.enrollment_deadline
            ? new Date(fullCourse.enrollment_deadline).toISOString().slice(0, 16)
            : '',
          offers_certificate: fullCourse.offers_certificate,
          certificate_requirements: (() => {
            const certReqs = fullCourse.certificate_requirements;
            return {
              min_completion_percentage: certReqs?.min_completion_percentage
                ? String(certReqs.min_completion_percentage)
                : '',
              min_assessment_score: certReqs?.min_assessment_score
                ? String(certReqs.min_assessment_score)
                : '',
              min_time_spent_hours: certReqs?.min_time_spent_hours
                ? String(certReqs.min_time_spent_hours)
                : '',
            };
          })(),
          });
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
        title: '',
        description: '',
        short_description: '',
        course_code: '',
        category: '',
  level: 'beginner',
  status: 'draft',
  course_type: 'regular',
    academic_year: getCurrentAcademicYear(),
        thumbnail: null,
        banner_image: null,
        video_intro: null,
        price: '0.00',
        currency: 'USD',
        is_free: false,
        discount_price: '',
        discount_start_date: '',
        discount_end_date: '',
        duration_hours: 0,
        requirements: '',
        learning_outcomes: '',
        language: 'en',
        tags: [],
        featured: false,
        featured_order: 0,
        target_audience: '',
        max_students: '',
        enrollment_deadline: '',
        offers_certificate: false,
        certificate_requirements: {
          min_completion_percentage: '',
          min_assessment_score: '',
          min_time_spent_hours: '',
        },
      });
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
  const prepareCourseData = (data: typeof formData, isUpdate: boolean = false): FormData | any => {
    // Check if we have file uploads - if so, use FormData
    const hasFiles = data.thumbnail || data.banner_image || data.video_intro;

    if (hasFiles) {
      const formDataObj = new FormData();

      // Required fields
      formDataObj.append('title', data.title.trim());
      formDataObj.append('description', data.description.trim());

      // Optional text fields
      if (data.short_description?.trim()) {
        formDataObj.append('short_description', data.short_description.trim());
      }
      if (data.course_code?.trim()) {
        formDataObj.append('course_code', data.course_code.trim());
      }

      // Category
      if (data.category && data.category !== '') {
        formDataObj.append('category', data.category);
      }

      // Course details
  formDataObj.append('level', data.level);
  formDataObj.append('status', data.status);
  // Course type (required by backend)
  if (data.course_type) formDataObj.append('course_type', data.course_type);

      // Instructor - set from logged-in admin if available
      try {
        const adminUser = userStorage.getUser();
        if (adminUser?.id) {
          formDataObj.append('instructor', String(adminUser.id));
        }
      } catch (e) {
        // ignore
      }

      // Media files
      if (data.thumbnail) formDataObj.append('thumbnail', data.thumbnail);
      if (data.banner_image) formDataObj.append('banner_image', data.banner_image);
      if (data.video_intro) formDataObj.append('video_intro', data.video_intro);

      // Pricing
      formDataObj.append('price', String(parseFloat(data.price) || 0.00));
      formDataObj.append('currency', data.currency || 'USD');
      formDataObj.append('is_free', String(data.is_free ?? true));
      if (data.discount_price?.trim()) {
        formDataObj.append('discount_price', String(parseFloat(data.discount_price)));
      }
      if (data.discount_start_date) {
        formDataObj.append('discount_start_date', new Date(data.discount_start_date).toISOString());
      }
      if (data.discount_end_date) {
        formDataObj.append('discount_end_date', new Date(data.discount_end_date).toISOString());
      }

      // Course structure
      if (data.duration_hours) {
        formDataObj.append('duration_hours', String(data.duration_hours));
      }
      // Academic year (always include to avoid DB NOT NULL constraints)
      formDataObj.append('academic_year', data.academic_year || '');

      // Requirements & Outcomes
      if (data.requirements?.trim()) {
        formDataObj.append('requirements', data.requirements.trim());
      }
      if (data.learning_outcomes?.trim()) {
        formDataObj.append('learning_outcomes', data.learning_outcomes.trim());
      }

      // Metadata
      formDataObj.append('language', data.language || 'en');
      if (data.tags && data.tags.length > 0) {
        data.tags.forEach((tag) => formDataObj.append('tags', tag));
      }
      formDataObj.append('featured', String(data.featured ?? false));
      if (data.featured_order) {
        formDataObj.append('featured_order', String(data.featured_order));
      }
      if (data.target_audience?.trim()) {
        formDataObj.append('target_audience', data.target_audience.trim());
      }

      // Enrollment
      if (data.max_students?.trim()) {
        formDataObj.append('max_students', String(parseInt(data.max_students, 10)));
      }
      if (data.enrollment_deadline) {
        formDataObj.append('enrollment_deadline', new Date(data.enrollment_deadline).toISOString());
      }

      // Certification
      formDataObj.append('offers_certificate', String(data.offers_certificate ?? false));
      if (data.offers_certificate && data.certificate_requirements) {
        const certReqs = data.certificate_requirements;
        if (certReqs.min_completion_percentage) {
          formDataObj.append(
            'certificate_requirements[min_completion_percentage]',
            String(parseInt(certReqs.min_completion_percentage, 10))
          );
        }
        if (certReqs.min_assessment_score) {
          formDataObj.append(
            'certificate_requirements[min_assessment_score]',
            String(parseInt(certReqs.min_assessment_score, 10))
          );
        }
        if (certReqs.min_time_spent_hours) {
          formDataObj.append(
            'certificate_requirements[min_time_spent_hours]',
            String(parseInt(certReqs.min_time_spent_hours, 10))
          );
        }
      }

      return formDataObj;
    }

    // No files - use JSON
    const payload: any = {
      title: data.title.trim(),
      description: data.description.trim(),
    };

    // For updates, include all fields (even empty ones) so they can be cleared
    // For creates, only include fields with values
    
    // Optional text fields - always include for updates
    if (isUpdate) {
      payload.short_description = data.short_description?.trim() || '';
      payload.course_code = data.course_code?.trim() || '';
    } else {
      if (data.short_description?.trim()) {
        payload.short_description = data.short_description.trim();
      }
      if (data.course_code?.trim()) {
        payload.course_code = data.course_code.trim();
      }
    }

    // Category - always include (can be null)
    // Category ID can be a number or UUID string
    if (data.category && data.category !== '' && data.category !== 'null') {
      // Try to parse as number first
      const categoryId = parseInt(data.category, 10);
      if (!isNaN(categoryId) && String(categoryId) === data.category) {
        // It's a valid number
        payload.category = categoryId;
      } else {
        // It's a UUID string or non-numeric string
        payload.category = data.category;
      }
    } else {
      payload.category = null;
    }

    // Course details - always include
    payload.level = data.level;
    payload.status = data.status;
    // Course type - required by backend
    payload.course_type = data.course_type || 'regular';
    // Instructor - include current admin user if available
    try {
      const adminUser = userStorage.getUser();
      if (adminUser?.id) {
        payload.instructor = String(adminUser.id);
      }
    } catch (e) {
      // ignore
    }
    // Academic year - always include to avoid DB NOT NULL constraint
payload.academic_year = data.academic_year?.trim() || getCurrentAcademicYear();
    // Pricing - always include
    payload.price = parseFloat(data.price) || 0.00;
    payload.currency = data.currency || 'USD';
    payload.is_free = data.is_free ?? true;
    
    // Discount fields - always include for updates
    if (isUpdate) {
      payload.discount_price = data.discount_price?.trim() 
        ? parseFloat(data.discount_price) 
        : null;
      payload.discount_start_date = data.discount_start_date
        ? new Date(data.discount_start_date).toISOString()
        : null;
      payload.discount_end_date = data.discount_end_date
        ? new Date(data.discount_end_date).toISOString()
        : null;
    } else {
      // For creates, only include if has value
      if (data.discount_price?.trim()) {
        payload.discount_price = parseFloat(data.discount_price);
      }
      if (data.discount_start_date) {
        payload.discount_start_date = new Date(data.discount_start_date).toISOString();
      }
      if (data.discount_end_date) {
        payload.discount_end_date = new Date(data.discount_end_date).toISOString();
      }
    }

    // Course structure - always include
    payload.duration_hours = parseInt(String(data.duration_hours), 10) || 0;

    // Requirements & Outcomes - always include for updates
    if (isUpdate) {
      payload.requirements = data.requirements?.trim() || '';
      payload.learning_outcomes = data.learning_outcomes?.trim() || '';
    } else {
      if (data.requirements?.trim()) {
        payload.requirements = data.requirements.trim();
      }
      if (data.learning_outcomes?.trim()) {
        payload.learning_outcomes = data.learning_outcomes.trim();
      }
    }

    // Metadata - always include
    payload.language = data.language || 'en';
    // Tags - always include (empty array if no tags)
    payload.tags = data.tags && data.tags.length > 0 ? data.tags : [];
    payload.featured = data.featured ?? false;
    payload.featured_order = parseInt(String(data.featured_order), 10) || 0;
    
    // Target audience - always include for updates
    if (isUpdate) {
      payload.target_audience = data.target_audience?.trim() || '';
    } else {
      if (data.target_audience?.trim()) {
        payload.target_audience = data.target_audience.trim();
      }
    }

    // Enrollment - always include for updates
    if (isUpdate) {
      payload.max_students = data.max_students?.trim()
        ? parseInt(data.max_students, 10)
        : null;
      payload.enrollment_deadline = data.enrollment_deadline
        ? new Date(data.enrollment_deadline).toISOString()
        : null;
    } else {
      // For creates, only include if has value
      if (data.max_students?.trim()) {
        payload.max_students = parseInt(data.max_students, 10);
      }
      if (data.enrollment_deadline) {
        payload.enrollment_deadline = new Date(data.enrollment_deadline).toISOString();
      }
    }

    // Certification - always include
    payload.offers_certificate = data.offers_certificate ?? false;
    if (data.offers_certificate && data.certificate_requirements) {
      const certReqs: any = {};
      // Always include all fields for updates, even if empty
      if (isUpdate) {
        certReqs.min_completion_percentage = data.certificate_requirements.min_completion_percentage
          ? parseInt(data.certificate_requirements.min_completion_percentage, 10)
          : null;
        certReqs.min_assessment_score = data.certificate_requirements.min_assessment_score
          ? parseInt(data.certificate_requirements.min_assessment_score, 10)
          : null;
        certReqs.min_time_spent_hours = data.certificate_requirements.min_time_spent_hours
          ? parseInt(data.certificate_requirements.min_time_spent_hours, 10)
          : null;
        payload.certificate_requirements = certReqs;
      } else {
        // For creates, only include fields with values
        if (data.certificate_requirements.min_completion_percentage) {
          certReqs.min_completion_percentage = parseInt(
            data.certificate_requirements.min_completion_percentage,
            10
          );
        }
        if (data.certificate_requirements.min_assessment_score) {
          certReqs.min_assessment_score = parseInt(
            data.certificate_requirements.min_assessment_score,
            10
          );
        }
        if (data.certificate_requirements.min_time_spent_hours) {
          certReqs.min_time_spent_hours = parseInt(
            data.certificate_requirements.min_time_spent_hours,
            10
          );
        }
        if (Object.keys(certReqs).length > 0) {
          payload.certificate_requirements = certReqs;
        }
      }
    } else if (isUpdate && !data.offers_certificate) {
      // If updating and offers_certificate is false, clear the requirements
      payload.certificate_requirements = null;
    }

    return payload;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      if (editingCourse) {
        const updateData = prepareCourseData(formData, true);
        // Debug: log outgoing payload for update
        if (updateData instanceof FormData) {
          const preview: Record<string, any> = {};
          (updateData as any).forEach((value: any, key: any) => {
            preview[key] = value instanceof File ? value.name : value;
          });
          // eslint-disable-next-line no-console
          console.log('update payload (from FormData):', JSON.stringify(preview, null, 2));
        } else {
          // eslint-disable-next-line no-console
          console.log('update payload', JSON.stringify(updateData, null, 2));
        }
        await updateCourse({ id: editingCourse.id, data: updateData }).unwrap();
      } else {
        const createData = prepareCourseData(formData, false);
        // Debug: log outgoing payload for create
        if (createData instanceof FormData) {
          const preview: Record<string, any> = {};
          (createData as any).forEach((value: any, key: any) => {
            preview[key] = value instanceof File ? value.name : value;
          });
          // eslint-disable-next-line no-console
          console.log('create payload (from FormData):', JSON.stringify(preview, null, 2));
        } else {
          // eslint-disable-next-line no-console
          console.log('create payload', JSON.stringify(createData, null, 2));
        }
        await createCourse(createData).unwrap();
      }
      handleCloseModal();
    } catch (err: any) {
      // Handle validation errors from API
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

  const handleDelete = async (course: Course) => {
    if (window.confirm(`Are you sure you want to delete "${course.title}"?`)) {
      try {
        await deleteCourse(course.id).unwrap();
      } catch (err: any) {
        alert(err?.data?.message || 'Failed to delete course');
      }
    }
  };

  const columns: Column<Course>[] = [
    {
      key: 'course',
      header: 'Course',
      render: (course) => (
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-surface-muted flex-shrink-0 overflow-hidden">
            {course.thumbnail ? (
              <img
                src={course.thumbnail}
                alt=""
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <BookOpen className="w-6 h-6" />
              </div>
            )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Academic Year *</label>
                <Input
                  label=""
                  value={formData.academic_year}
                  onChange={(e) => setFormData({ ...formData, academic_year: e.target.value })}
                  placeholder="e.g. 2025/2026"
                  required
                />
              </div>
          </div>
          <div>
            <p className="font-medium text-gray-900">{course.title}</p>
            <p className="text-sm text-gray-500">{course.course_code || '—'}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (course) => (
        <Badge variant={course.status as 'draft' | 'published' | 'archived' | 'suspended'}>
          {course.status}
        </Badge>
      ),
    },
    {
      key: 'level',
      header: 'Level',
      render: (course) => (
        <span className="text-sm text-gray-600 capitalize">{course.level}</span>
      ),
    },
    {
      key: 'price',
      header: 'Price',
      render: (course) => (
        <span className="font-medium text-gray-900">
          {course.is_free ? 'Free' : `${course.currency} ${course.price}`}
        </span>
      ),
    },
    {
      key: 'current_enrollments',
      header: 'Enrollments',
      render: (course) => (
        <span className="text-gray-600">{course.current_enrollments ?? 0}</span>
      ),
    },
    {
      key: 'actions',
      header: '',
      render: (course) => (
        <button
          onClick={() => navigate(`/admin/courses/courses/${course.id}`)}
          className="text-zlearn-primary hover:text-zlearn-primaryHover font-medium text-sm transition-colors duration-150"
        >
          Manage →
        </button>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Courses</h1>
          <p className="text-gray-500 mt-1">Manage professional and skill-based courses</p>
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
              <Input
                label="Title *"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
              <Input
                label="Short Description"
                value={formData.short_description}
                onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                placeholder="Brief overview (max 500 chars)"
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2.5 border border-surface-border rounded-lg focus:outline-none focus:ring-2 focus:ring-zlearn-primary/20 focus:border-zlearn-primary transition-colors duration-150"
                  rows={4}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Course Code"
                  value={formData.course_code}
                  onChange={(e) => setFormData({ ...formData, course_code: e.target.value })}
                  placeholder="Auto-generated if not provided"
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2.5 border border-surface-border rounded-lg focus:outline-none focus:ring-2 focus:ring-zlearn-primary/20 focus:border-zlearn-primary transition-colors duration-150"
                  >
                    <option value="">No Category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Course Details */}
            <div className="space-y-4 border-b pb-4">
              <h3 className="text-lg font-semibold text-gray-800">Course Details</h3>
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Level *</label>
                  <select
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: e.target.value as any })}
                    className="w-full px-3 py-2.5 border border-surface-border rounded-lg focus:outline-none focus:ring-2 focus:ring-zlearn-primary/20 focus:border-zlearn-primary transition-colors duration-150"
                    required
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                    <option value="expert">Expert</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status *</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2.5 border border-surface-border rounded-lg focus:outline-none focus:ring-2 focus:ring-zlearn-primary/20 focus:border-zlearn-primary transition-colors duration-150"
                    required
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Course Type *</label>
                  <select
                    value={formData.course_type}
                    onChange={(e) => setFormData({ ...formData, course_type: e.target.value })}
                    className="w-full px-3 py-2.5 border border-surface-border rounded-lg focus:outline-none focus:ring-2 focus:ring-zlearn-primary/20 focus:border-zlearn-primary transition-colors duration-150"
                    required
                  >
                    <option value="regular">Regular</option>
                    <option value="entrance_exam">Entrance Exam</option>
                    <option value="advanced">Advanced</option>
                    <option value="review">Review</option>
                  </select>
                </div>
                <Input
                  label="Duration (Hours)"
                  type="number"
                  value={formData.duration_hours}
                  onChange={(e) =>
                    setFormData({ ...formData, duration_hours: parseInt(e.target.value) || 0 })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                <select
                  value={formData.language}
                  onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                  className="w-full px-3 py-2.5 border border-surface-border rounded-lg focus:outline-none focus:ring-2 focus:ring-zlearn-primary/20 focus:border-zlearn-primary transition-colors duration-150"
                >
                  <option value="en">English</option>
                  <option value="fr">French</option>
                  <option value="es">Spanish</option>
                  <option value="ar">Arabic</option>
                </select>
              </div>
            </div>

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
                    className="w-full px-3 py-2.5 border border-surface-border rounded-lg focus:outline-none focus:ring-2 focus:ring-zlearn-primary/20 focus:border-zlearn-primary transition-colors duration-150"
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
                    className="w-full px-3 py-2.5 border border-surface-border rounded-lg focus:outline-none focus:ring-2 focus:ring-zlearn-primary/20 focus:border-zlearn-primary transition-colors duration-150"
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
                    className="w-full px-3 py-2.5 border border-surface-border rounded-lg focus:outline-none focus:ring-2 focus:ring-zlearn-primary/20 focus:border-zlearn-primary transition-colors duration-150"
                  />
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="space-y-4 border-b pb-4">
              <h3 className="text-lg font-semibold text-gray-800">Pricing</h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                  <select
                    value={formData.currency}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                    className="w-full px-3 py-2.5 border border-surface-border rounded-lg focus:outline-none focus:ring-2 focus:ring-zlearn-primary/20 focus:border-zlearn-primary transition-colors duration-150"
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
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
                  label="Discount Price"
                  type="number"
                  step="0.01"
                  value={formData.discount_price}
                  onChange={(e) => setFormData({ ...formData, discount_price: e.target.value })}
                  disabled={formData.is_free}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Discount Start Date"
                  type="datetime-local"
                  value={formData.discount_start_date}
                  onChange={(e) =>
                    setFormData({ ...formData, discount_start_date: e.target.value })
                  }
                  disabled={formData.is_free}
                />
                <Input
                  label="Discount End Date"
                  type="datetime-local"
                  value={formData.discount_end_date}
                  onChange={(e) =>
                    setFormData({ ...formData, discount_end_date: e.target.value })
                  }
                  disabled={formData.is_free}
                />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_free}
                  onChange={(e) => setFormData({ ...formData, is_free: e.target.checked })}
                  className="w-4 h-4 text-zlearn-primary border-gray-300 rounded focus:ring-zlearn-primary/20"
                />
                <span className="text-sm font-medium text-gray-700">Free Course</span>
              </label>
            </div>

            {/* Requirements & Outcomes */}
            <div className="space-y-4 border-b pb-4">
              <h3 className="text-lg font-semibold text-gray-800">Requirements & Outcomes</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Requirements</label>
                <textarea
                  value={formData.requirements}
                  onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                  className="w-full px-3 py-2.5 border border-surface-border rounded-lg focus:outline-none focus:ring-2 focus:ring-zlearn-primary/20 focus:border-zlearn-primary transition-colors duration-150"
                  rows={3}
                  placeholder="Basic computer knowledge, etc."
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
                  className="w-full px-3 py-2.5 border border-surface-border rounded-lg focus:outline-none focus:ring-2 focus:ring-zlearn-primary/20 focus:border-zlearn-primary transition-colors duration-150"
                  rows={3}
                  placeholder="You will learn: ..."
                />
              </div>
            </div>

            {/* Metadata */}
            <div className="space-y-4 border-b pb-4">
              <h3 className="text-lg font-semibold text-gray-800">Metadata</h3>
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
                  className="w-full px-3 py-2.5 border border-surface-border rounded-lg focus:outline-none focus:ring-2 focus:ring-zlearn-primary/20 focus:border-zlearn-primary transition-colors duration-150"
                  placeholder="python, programming, beginner (comma-separated)"
                />
                <p className="text-xs text-gray-500 mt-1">Separate tags with commas</p>
              </div>
              <Input
                label="Target Audience"
                value={formData.target_audience}
                onChange={(e) => setFormData({ ...formData, target_audience: e.target.value })}
                placeholder="Students preparing for entrance exams"
              />
              <div className="grid grid-cols-2 gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4 text-zlearn-primary border-gray-300 rounded focus:ring-zlearn-primary/20"
                  />
                  <span className="text-sm font-medium text-gray-700">Featured</span>
                </label>
                {formData.featured && (
                  <Input
                    label="Featured Order"
                    type="number"
                    value={formData.featured_order}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        featured_order: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                )}
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

            {/* Certification */}
            <div className="space-y-4 border-b pb-4">
              <h3 className="text-lg font-semibold text-gray-800">Certification</h3>
              <label className="flex items-center gap-2 cursor-pointer mb-4">
                <input
                  type="checkbox"
                  checked={formData.offers_certificate}
                  onChange={(e) =>
                    setFormData({ ...formData, offers_certificate: e.target.checked })
                  }
                  className="w-4 h-4 text-zlearn-primary border-gray-300 rounded focus:ring-zlearn-primary/20"
                />
                <span className="text-sm font-medium text-gray-700">Offers Certificate</span>
              </label>
              {formData.offers_certificate && (
                <div className="grid grid-cols-3 gap-4 pl-6">
                  <Input
                    label="Min Completion %"
                    type="number"
                    value={formData.certificate_requirements.min_completion_percentage}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        certificate_requirements: {
                          ...formData.certificate_requirements,
                          min_completion_percentage: e.target.value,
                        },
                      })
                    }
                    placeholder="80"
                  />
                  <Input
                    label="Min Assessment Score"
                    type="number"
                    value={formData.certificate_requirements.min_assessment_score}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        certificate_requirements: {
                          ...formData.certificate_requirements,
                          min_assessment_score: e.target.value,
                        },
                      })
                    }
                    placeholder="70"
                  />
                  <Input
                    label="Min Time Spent (Hours)"
                    type="number"
                    value={formData.certificate_requirements.min_time_spent_hours}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        certificate_requirements: {
                          ...formData.certificate_requirements,
                          min_time_spent_hours: e.target.value,
                        },
                      })
                    }
                    placeholder="30"
                  />
                </div>
              )}
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


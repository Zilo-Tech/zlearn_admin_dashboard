import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
} from '../../store/api/contentApi';
import type { ContentCourse } from '../../interfaces/course';
import { Alert } from '../../components/common/Alert';

export const CoursesPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: courses = [], isLoading } = useGetCoursesQuery({});
  const { data: subjectsData } = useGetSubjectsQuery();
  const [createCourse] = useCreateCourseMutation();
  const [updateCourse] = useUpdateCourseMutation();
  const [deleteCourse] = useDeleteCourseMutation();

  // Ensure subjects is always an array
  const subjects = Array.isArray(subjectsData) ? subjectsData : [];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<ContentCourse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    code: '',
    title: '',
    description: '',
    course_type: 'regular' as 'entrance_exam' | 'regular' | 'advanced' | 'review',
    subject: '',
    difficulty: 'beginner' as 'beginner' | 'intermediate' | 'advanced',
    estimated_hours: 0,
    is_published: false,
    is_free: true,
  });

  const handleOpenModal = (course?: ContentCourse) => {
    if (course) {
      setEditingCourse(course);
      setFormData({
        code: course.code,
        title: course.title,
        description: course.description,
        course_type: course.course_type,
        subject: course.subject,
        difficulty: course.difficulty,
        estimated_hours: course.estimated_hours || 0,
        is_published: course.is_published,
        is_free: course.is_free,
      });
    } else {
      setEditingCourse(null);
      setFormData({
        code: '',
        title: '',
        description: '',
        course_type: 'regular',
        subject: '',
        difficulty: 'beginner',
        estimated_hours: 0,
        is_published: false,
        is_free: true,
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      if (editingCourse) {
        await updateCourse({ id: editingCourse.id, data: formData }).unwrap();
      } else {
        await createCourse(formData).unwrap();
      }
      handleCloseModal();
    } catch (err: any) {
      setError(err?.data?.message || 'An error occurred');
    }
  };

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
          className={`px-2 py-1 text-xs font-semibold rounded-full ${
            course.is_published
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
          size="lg"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Code"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                required
              />
              <Input
                label="Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#446D6D] focus:ring-4 focus:ring-[#446D6D]/10 outline-none transition-all duration-200"
                rows={3}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
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
                  <option value="regular">Regular</option>
                  <option value="entrance_exam">Entrance Exam</option>
                  <option value="advanced">Advanced</option>
                  <option value="review">Review</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#446D6D] focus:ring-4 focus:ring-[#446D6D]/10 outline-none transition-all duration-200"
                  required
                >
                  <option value="">Select Subject</option>
                  {subjects.map((subject) => (
                    <option key={subject.id} value={subject.id}>
                      {subject.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Difficulty
                </label>
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
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              <Input
                label="Estimated Hours"
                type="number"
                value={formData.estimated_hours}
                onChange={(e) =>
                  setFormData({ ...formData, estimated_hours: parseInt(e.target.value) || 0 })
                }
              />
            </div>

            <div className="flex gap-4">
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
                <span className="text-sm font-medium text-gray-700">Free</span>
              </label>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" fullWidth>
                {editingCourse ? 'Update' : 'Create'}
              </Button>
              <Button type="button" variant="outline" onClick={handleCloseModal} fullWidth>
                Cancel
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </AdminLayout>
  );
};


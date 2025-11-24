import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../components/layout';
import { DataTable, Column } from '../../components/common/DataTable';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import {
  useGetCoursesQuery,
  useGetCategoriesQuery,
  useCreateCourseMutation,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
} from '../../store/api/coursesApi';
import type { Course } from '../../interfaces/course';
import { Alert } from '../../components/common/Alert';

export const CoursesPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: courses = [], isLoading } = useGetCoursesQuery({});
  const { data: categoriesData } = useGetCategoriesQuery();
  const [createCourse] = useCreateCourseMutation();
  const [updateCourse] = useUpdateCourseMutation();
  const [deleteCourse] = useDeleteCourseMutation();

  // Ensure categories is always an array
  const categories = Array.isArray(categoriesData) ? categoriesData : [];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    short_description: '',
    course_code: '',
    category: '',
    level: 'beginner' as 'beginner' | 'intermediate' | 'advanced' | 'expert',
    status: 'draft' as 'draft' | 'published' | 'archived' | 'suspended',
    price: '0.00',
    currency: 'USD',
    is_free: false,
    duration_hours: 0,
    featured: false,
    offers_certificate: false,
  });

  const handleOpenModal = (course?: Course) => {
    if (course) {
      setEditingCourse(course);
      setFormData({
        title: course.title,
        description: course.description,
        short_description: course.short_description || '',
        course_code: course.course_code || '',
        category: course.category,
        level: course.level,
        status: course.status,
        price: course.price,
        currency: course.currency,
        is_free: course.is_free,
        duration_hours: course.duration_hours || 0,
        featured: course.featured,
        offers_certificate: course.offers_certificate,
      });
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
        price: '0.00',
        currency: 'USD',
        is_free: false,
        duration_hours: 0,
        featured: false,
        offers_certificate: false,
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
    { key: 'title', header: 'Title' },
    {
      key: 'status',
      header: 'Status',
      render: (course) => (
        <span
          className={`px-2 py-1 text-xs font-semibold rounded-full ${
            course.status === 'published'
              ? 'bg-green-100 text-green-800'
              : course.status === 'draft'
              ? 'bg-gray-100 text-gray-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {course.status}
        </span>
      ),
    },
    {
      key: 'level',
      header: 'Level',
      render: (course) => (
        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
          {course.level}
        </span>
      ),
    },
    {
      key: 'price',
      header: 'Price',
      render: (course) => (
        <span className="font-semibold">
          {course.is_free ? 'Free' : `${course.currency} ${course.price}`}
        </span>
      ),
    },
    {
      key: 'current_enrollments',
      header: 'Enrollments',
      render: (course) => course.current_enrollments || 0,
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (course) => (
        <button
          onClick={() => navigate(`/admin/courses/courses/${course.id}`)}
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
            <h1 className="text-3xl font-bold text-gray-800">Professional Courses</h1>
            <p className="text-gray-600 mt-1">Manage professional/skill-based courses</p>
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
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />

            <Input
              label="Short Description"
              value={formData.short_description}
              onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#446D6D] focus:ring-4 focus:ring-[#446D6D]/10 outline-none transition-all duration-200"
                rows={4}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Course Code"
                value={formData.course_code}
                onChange={(e) => setFormData({ ...formData, course_code: e.target.value })}
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#446D6D] focus:ring-4 focus:ring-[#446D6D]/10 outline-none transition-all duration-200"
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Level</label>
                <select
                  value={formData.level}
                  onChange={(e) => setFormData({ ...formData, level: e.target.value as any })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#446D6D] focus:ring-4 focus:ring-[#446D6D]/10 outline-none transition-all duration-200"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                  <option value="expert">Expert</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#446D6D] focus:ring-4 focus:ring-[#446D6D]/10 outline-none transition-all duration-200"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                  <option value="suspended">Suspended</option>
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

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                <select
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#446D6D] focus:ring-4 focus:ring-[#446D6D]/10 outline-none transition-all duration-200"
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
            </div>

            <div className="flex gap-4 flex-wrap">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_free}
                  onChange={(e) => setFormData({ ...formData, is_free: e.target.checked })}
                  className="w-4 h-4 text-[#446D6D] border-gray-300 rounded focus:ring-[#446D6D]"
                />
                <span className="text-sm font-medium text-gray-700">Free Course</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-4 h-4 text-[#446D6D] border-gray-300 rounded focus:ring-[#446D6D]"
                />
                <span className="text-sm font-medium text-gray-700">Featured</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.offers_certificate}
                  onChange={(e) =>
                    setFormData({ ...formData, offers_certificate: e.target.checked })
                  }
                  className="w-4 h-4 text-[#446D6D] border-gray-300 rounded focus:ring-[#446D6D]"
                />
                <span className="text-sm font-medium text-gray-700">Offers Certificate</span>
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


import React, { useState } from 'react';
import { AdminLayout } from '../../components/layout';
import { DataTable, Column } from '../../components/common/DataTable';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import {
  useGetCourseModulesQuery,
  useGetCoursesQuery,
  useCreateCourseModuleMutation,
  useUpdateCourseModuleMutation,
  useDeleteCourseModuleMutation,
} from '../../store/api/coursesApi';
import type { CourseModule } from '../../interfaces/course';
import { Alert } from '../../components/common/Alert';

export const CourseModulesPage: React.FC = () => {
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const { data: modules = [], isLoading } = useGetCourseModulesQuery(
    selectedCourse ? { course: selectedCourse } : {}
  );
  const { data: coursesData } = useGetCoursesQuery({});
  const [createModule] = useCreateCourseModuleMutation();
  const [updateModule] = useUpdateCourseModuleMutation();
  const [deleteModule] = useDeleteCourseModuleMutation();

  // Ensure courses is always an array
  const courses = Array.isArray(coursesData) ? coursesData : [];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingModule, setEditingModule] = useState<CourseModule | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    course: '',
    order: 1,
    title: '',
    description: '',
    duration_minutes: 0,
    difficulty: 'beginner',
    learning_path: 'sequential',
    is_published: true,
  });

  const handleOpenModal = (module?: CourseModule) => {
    if (module) {
      setEditingModule(module);
      setFormData({
        course: module.course,
        order: module.order,
        title: module.title,
        description: module.description || '',
        duration_minutes: module.duration_minutes || 0,
        difficulty: module.difficulty || 'beginner',
        learning_path: module.learning_path || 'sequential',
        is_published: module.is_published,
      });
    } else {
      setEditingModule(null);
      setFormData({
        course: selectedCourse || '',
        order: modules.length + 1,
        title: '',
        description: '',
        duration_minutes: 0,
        difficulty: 'beginner',
        learning_path: 'sequential',
        is_published: true,
      });
    }
    setError(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingModule(null);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      if (editingModule) {
        await updateModule({ id: editingModule.id, data: formData }).unwrap();
      } else {
        await createModule(formData).unwrap();
      }
      handleCloseModal();
    } catch (err: any) {
      setError(err?.data?.message || 'An error occurred');
    }
  };

  const handleDelete = async (module: CourseModule) => {
    if (window.confirm(`Are you sure you want to delete "${module.title}"?`)) {
      try {
        await deleteModule(module.id).unwrap();
      } catch (err: any) {
        alert(err?.data?.message || 'Failed to delete module');
      }
    }
  };

  const columns: Column<CourseModule>[] = [
    { key: 'order', header: 'Order' },
    { key: 'title', header: 'Title' },
    {
      key: 'duration_minutes',
      header: 'Duration (min)',
      render: (module) => module.duration_minutes || 0,
    },
    {
      key: 'difficulty',
      header: 'Difficulty',
      render: (module) => (
        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
          {module.difficulty || 'N/A'}
        </span>
      ),
    },
    {
      key: 'is_published',
      header: 'Status',
      render: (module) => (
        <span
          className={`px-2 py-1 text-xs font-semibold rounded-full ${
            module.is_published
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          {module.is_published ? 'Published' : 'Draft'}
        </span>
      ),
    },
    {
      key: 'lesson_count',
      header: 'Lessons',
      render: (module) => module.lesson_count || 0,
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Course Modules</h1>
            <p className="text-gray-600 mt-1">Manage professional course modules</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Filter by Course
          </label>
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="w-full sm:w-64 px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-[#446D6D] focus:ring-4 focus:ring-[#446D6D]/10 outline-none transition-all duration-200"
          >
            <option value="">All Courses</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.title}
              </option>
            ))}
          </select>
        </div>

        {error && <Alert type="error" message={error} />}

        <DataTable
          data={modules}
          columns={columns}
          loading={isLoading}
          onAdd={() => handleOpenModal()}
          onEdit={handleOpenModal}
          onDelete={handleDelete}
          title="All Modules"
          addButtonLabel="Add Module"
          keyExtractor={(item) => item.id}
        />

        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title={editingModule ? 'Edit Module' : 'Create Module'}
          size="md"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Course
              </label>
              <select
                value={formData.course}
                onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#446D6D] focus:ring-4 focus:ring-[#446D6D]/10 outline-none transition-all duration-200"
                required
              >
                <option value="">Select Course</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Order"
                type="number"
                value={formData.order}
                onChange={(e) =>
                  setFormData({ ...formData, order: parseInt(e.target.value) || 1 })
                }
                required
              />
              <Input
                label="Duration (Minutes)"
                type="number"
                value={formData.duration_minutes}
                onChange={(e) =>
                  setFormData({ ...formData, duration_minutes: parseInt(e.target.value) || 0 })
                }
              />
            </div>

            <Input
              label="Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#446D6D] focus:ring-4 focus:ring-[#446D6D]/10 outline-none transition-all duration-200"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Difficulty
                </label>
                <select
                  value={formData.difficulty}
                  onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#446D6D] focus:ring-4 focus:ring-[#446D6D]/10 outline-none transition-all duration-200"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Learning Path
                </label>
                <select
                  value={formData.learning_path}
                  onChange={(e) => setFormData({ ...formData, learning_path: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#446D6D] focus:ring-4 focus:ring-[#446D6D]/10 outline-none transition-all duration-200"
                >
                  <option value="sequential">Sequential</option>
                  <option value="flexible">Flexible</option>
                </select>
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_published}
                onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                className="w-4 h-4 text-[#446D6D] border-gray-300 rounded focus:ring-[#446D6D]"
              />
              <span className="text-sm font-medium text-gray-700">Published</span>
            </label>

            <div className="flex gap-3 pt-4">
              <Button type="submit" fullWidth>
                {editingModule ? 'Update' : 'Create'}
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


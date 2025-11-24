import React, { useState } from 'react';
import { AdminLayout } from '../../components/layout';
import { DataTable, Column } from '../../components/common/DataTable';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import {
  useGetCourseLessonsQuery,
  useGetCourseModulesQuery,
  useCreateCourseLessonMutation,
  useUpdateCourseLessonMutation,
  useDeleteCourseLessonMutation,
} from '../../store/api/coursesApi';
import type { CourseLesson } from '../../interfaces/course';
import { Alert } from '../../components/common/Alert';

export const CourseLessonsPage: React.FC = () => {
  const [selectedModule, setSelectedModule] = useState<string>('');
  const { data: lessons = [], isLoading } = useGetCourseLessonsQuery(
    selectedModule ? { module: selectedModule } : {}
  );
  const { data: modulesData } = useGetCourseModulesQuery({});
  const [createLesson] = useCreateCourseLessonMutation();
  const [updateLesson] = useUpdateCourseLessonMutation();
  const [deleteLesson] = useDeleteCourseLessonMutation();

  // Ensure modules is always an array
  const modules = Array.isArray(modulesData) ? modulesData : [];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<CourseLesson | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    module: '',
    order: 1,
    title: '',
    description: '',
    lesson_type: 'video',
    duration_minutes: 0,
    difficulty: 'beginner',
    is_published: true,
    is_preview: false,
    requires_completion: true,
  });

  const handleOpenModal = (lesson?: CourseLesson) => {
    if (lesson) {
      setEditingLesson(lesson);
      setFormData({
        module: lesson.module,
        order: lesson.order,
        title: lesson.title,
        description: lesson.description || '',
        lesson_type: lesson.lesson_type,
        duration_minutes: lesson.duration_minutes || 0,
        difficulty: lesson.difficulty || 'beginner',
        is_published: lesson.is_published,
        is_preview: lesson.is_preview,
        requires_completion: lesson.requires_completion,
      });
    } else {
      setEditingLesson(null);
      setFormData({
        module: selectedModule || '',
        order: lessons.length + 1,
        title: '',
        description: '',
        lesson_type: 'video',
        duration_minutes: 0,
        difficulty: 'beginner',
        is_published: true,
        is_preview: false,
        requires_completion: true,
      });
    }
    setError(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingLesson(null);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      if (editingLesson) {
        await updateLesson({ id: editingLesson.id, data: formData }).unwrap();
      } else {
        await createLesson(formData).unwrap();
      }
      handleCloseModal();
    } catch (err: any) {
      setError(err?.data?.message || 'An error occurred');
    }
  };

  const handleDelete = async (lesson: CourseLesson) => {
    if (window.confirm(`Are you sure you want to delete "${lesson.title}"?`)) {
      try {
        await deleteLesson(lesson.id).unwrap();
      } catch (err: any) {
        alert(err?.data?.message || 'Failed to delete lesson');
      }
    }
  };

  const columns: Column<CourseLesson>[] = [
    { key: 'order', header: 'Order' },
    { key: 'title', header: 'Title' },
    {
      key: 'lesson_type',
      header: 'Type',
      render: (lesson) => (
        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
          {lesson.lesson_type}
        </span>
      ),
    },
    {
      key: 'difficulty',
      header: 'Difficulty',
      render: (lesson) => (
        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
          {lesson.difficulty || 'N/A'}
        </span>
      ),
    },
    {
      key: 'is_preview',
      header: 'Preview',
      render: (lesson) => (
        <span
          className={`px-2 py-1 text-xs font-semibold rounded-full ${
            lesson.is_preview
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          {lesson.is_preview ? 'Yes' : 'No'}
        </span>
      ),
    },
    {
      key: 'section_count',
      header: 'Sections',
      render: (lesson) => lesson.section_count || 0,
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Course Lessons</h1>
            <p className="text-gray-600 mt-1">Manage professional course lessons</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Filter by Module
          </label>
          <select
            value={selectedModule}
            onChange={(e) => setSelectedModule(e.target.value)}
            className="w-full sm:w-64 px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-[#446D6D] focus:ring-4 focus:ring-[#446D6D]/10 outline-none transition-all duration-200"
          >
            <option value="">All Modules</option>
            {modules.map((module) => (
              <option key={module.id} value={module.id}>
                {module.title}
              </option>
            ))}
          </select>
        </div>

        {error && <Alert type="error" message={error} />}

        <DataTable
          data={lessons}
          columns={columns}
          loading={isLoading}
          onAdd={() => handleOpenModal()}
          onEdit={handleOpenModal}
          onDelete={handleDelete}
          title="All Lessons"
          addButtonLabel="Add Lesson"
          keyExtractor={(item) => item.id}
        />

        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title={editingLesson ? 'Edit Lesson' : 'Create Lesson'}
          size="lg"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Module
              </label>
              <select
                value={formData.module}
                onChange={(e) => setFormData({ ...formData, module: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#446D6D] focus:ring-4 focus:ring-[#446D6D]/10 outline-none transition-all duration-200"
                required
              >
                <option value="">Select Module</option>
                {modules.map((module) => (
                  <option key={module.id} value={module.id}>
                    {module.title}
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lesson Type
                </label>
                <select
                  value={formData.lesson_type}
                  onChange={(e) => setFormData({ ...formData, lesson_type: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#446D6D] focus:ring-4 focus:ring-[#446D6D]/10 outline-none transition-all duration-200"
                >
                  <option value="video">Video</option>
                  <option value="text">Text</option>
                  <option value="audio">Audio</option>
                  <option value="interactive">Interactive</option>
                </select>
              </div>
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
              <Input
                label="Duration (Minutes)"
                type="number"
                value={formData.duration_minutes}
                onChange={(e) =>
                  setFormData({ ...formData, duration_minutes: parseInt(e.target.value) || 0 })
                }
              />
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
                  checked={formData.is_preview}
                  onChange={(e) => setFormData({ ...formData, is_preview: e.target.checked })}
                  className="w-4 h-4 text-[#446D6D] border-gray-300 rounded focus:ring-[#446D6D]"
                />
                <span className="text-sm font-medium text-gray-700">Preview</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.requires_completion}
                  onChange={(e) =>
                    setFormData({ ...formData, requires_completion: e.target.checked })
                  }
                  className="w-4 h-4 text-[#446D6D] border-gray-300 rounded focus:ring-[#446D6D]"
                />
                <span className="text-sm font-medium text-gray-700">Requires Completion</span>
              </label>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" fullWidth>
                {editingLesson ? 'Update' : 'Create'}
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


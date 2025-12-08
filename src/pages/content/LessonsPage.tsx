import React, { useState, useMemo } from 'react';
import { AdminLayout } from '../../components/layout';
import { DataTable, Column } from '../../components/common/DataTable';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import {
  useGetLessonsQuery,
  useGetModulesQuery,
  useCreateLessonMutation,
  useUpdateLessonMutation,
  useDeleteLessonMutation,
  useGetSectionsQuery,
  useCreateSectionMutation,
  useUpdateSectionMutation,
  useDeleteSectionMutation,
} from '../../store/api/contentApi';
import { SectionCreateModal, SectionEditModal } from './CourseDetailPageModals';
import SectionsManagerView from '../../components/common/SectionsManagerView';
import type { ContentLesson } from '../../interfaces/course';
import { Alert } from '../../components/common/Alert';

export const LessonsPage: React.FC = () => {
  const [selectedModule, setSelectedModule] = useState<string>('');
  const { data: lessons = [], isLoading } = useGetLessonsQuery(
    selectedModule ? { module: selectedModule } : {}
  );
  const { data: modulesData } = useGetModulesQuery({});
  const [createLesson] = useCreateLessonMutation();
  const [updateLesson] = useUpdateLessonMutation();
  const [deleteLesson] = useDeleteLessonMutation();

  // Ensure modules is always an array
  const modules = Array.isArray(modulesData) ? modulesData : [];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<ContentLesson | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    module: '',
    order: 1,
    title: '',
    description: '',
    content_type: 'video',
    duration: '',
    difficulty: 'easy',
    is_free: true,
    is_preview: false,
  });

  // Section management state
  const [managingSectionsForLesson, setManagingSectionsForLesson] = useState<ContentLesson | null>(null);
  const [creatingSection, setCreatingSection] = useState(false);
  const [editingSection, setEditingSection] = useState<any>(null);

  const { data: sectionsData } = useGetSectionsQuery(
    managingSectionsForLesson ? { lesson: managingSectionsForLesson.id } : {},
    { skip: !managingSectionsForLesson }
  );
  const sections = Array.isArray(sectionsData) ? sectionsData : [];
  const [createSection] = useCreateSectionMutation();
  const [updateSection] = useUpdateSectionMutation();
  const [deleteSection] = useDeleteSectionMutation();

  // Calculate the next order value for new sections
  const nextSectionOrder = useMemo(() => {
    if (sections.length === 0) return 1;
    const maxOrder = Math.max(...sections.map(s => s.order));
    return maxOrder + 1;
  }, [sections]);

  const handleOpenModal = (lesson?: ContentLesson) => {
    if (lesson) {
      setEditingLesson(lesson);
      setFormData({
        module: lesson.module,
        order: lesson.order,
        title: lesson.title,
        description: lesson.description || '',
        content_type: lesson.content_type,
        duration: lesson.duration || '',
        difficulty: lesson.difficulty || 'easy',
        is_free: lesson.is_free,
        is_preview: lesson.is_preview,
      });
    } else {
      setEditingLesson(null);
      setFormData({
        module: selectedModule || '',
        order: lessons.length + 1,
        title: '',
        description: '',
        content_type: 'video',
        duration: '',
        difficulty: 'easy',
        is_free: true,
        is_preview: false,
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

  const handleManageSections = (lesson: ContentLesson) => {
    setManagingSectionsForLesson(lesson);
  };

  const handleCloseManageSections = () => {
    setManagingSectionsForLesson(null);
    setCreatingSection(false);
    setEditingSection(null);
  };

  const handleCreateSection = async (data: any) => {
    try {
      console.log('Creating section with data:', data);
      console.log('Current sections:', sections);
      console.log('Next order should be:', nextSectionOrder);
      await createSection(data).unwrap();
      setCreatingSection(false);
    } catch (err: any) {
      console.error('Section creation error:', err);
      const errorMessage = err?.data?.non_field_errors?.[0] || err?.data?.message || 'Failed to create section';
      setError(errorMessage);
      alert(errorMessage); // Show alert so user sees the error immediately
    }
  };

  const handleUpdateSection = async (data: any) => {
    if (!editingSection) return;
    try {
      await updateSection({ id: editingSection.id, data }).unwrap();
      setEditingSection(null);
    } catch (err: any) {
      setError(err?.data?.message || 'Failed to update section');
    }
  };

  const handleDeleteSection = async (sectionId: string) => {
    if (!window.confirm('Are you sure you want to delete this section?')) return;
    try {
      await deleteSection(sectionId).unwrap();
    } catch (err: any) {
      setError(err?.data?.message || 'Failed to delete section');
    }
  };

  const handleDelete = async (lesson: ContentLesson) => {
    if (window.confirm(`Are you sure you want to delete "${lesson.title}"?`)) {
      try {
        await deleteLesson(lesson.id).unwrap();
      } catch (err: any) {
        alert(err?.data?.message || 'Failed to delete lesson');
      }
    }
  };

  const columns: Column<ContentLesson>[] = [
    { key: 'order', header: 'Order' },
    { key: 'title', header: 'Title' },
    {
      key: 'content_type',
      header: 'Type',
      render: (lesson) => (
        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
          {lesson.content_type}
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
          className={`px-2 py-1 text-xs font-semibold rounded-full ${lesson.is_preview
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
      header: 'Content',
      render: (lesson) => (
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">{lesson.section_count || 0} sections</span>
          <button
            onClick={() => handleManageSections(lesson)}
            className="text-xs bg-indigo-50 text-indigo-600 px-2 py-1 rounded hover:bg-indigo-100 transition-colors"
          >
            Manage Content
          </button>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Lessons</h1>
            <p className="text-gray-600 mt-1">Manage course lessons</p>
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
                  Content Type
                </label>
                <select
                  value={formData.content_type}
                  onChange={(e) => setFormData({ ...formData, content_type: e.target.value })}
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
                label="Duration (PT30M)"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                placeholder="PT30M"
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
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
            </div>

            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_free}
                  onChange={(e) => setFormData({ ...formData, is_free: e.target.checked })}
                  className="w-4 h-4 text-[#446D6D] border-gray-300 rounded focus:ring-[#446D6D]"
                />
                <span className="text-sm font-medium text-gray-700">Free</span>
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

        {/* Manage Sections Modal */}
        {managingSectionsForLesson && (
          <Modal
            isOpen={true}
            onClose={handleCloseManageSections}
            title={`Manage Sections - ${managingSectionsForLesson.title}`}
            size="xl"
          >
            <SectionsManagerView
              lessonId={managingSectionsForLesson.id}
              sections={sections}
              isLoading={false}
              onAddSection={() => setCreatingSection(true)}
              onEditSection={setEditingSection}
              onDeleteSection={handleDeleteSection}
            />
          </Modal>
        )}

        {/* Create Section Modal */}
        {creatingSection && managingSectionsForLesson && (
          <SectionCreateModal
            lessonId={managingSectionsForLesson.id}
            order={nextSectionOrder}
            onClose={() => setCreatingSection(false)}
            onSave={handleCreateSection}
          />
        )}

        {/* Edit Section Modal */}
        {editingSection && (
          <SectionEditModal
            section={editingSection}
            onClose={() => setEditingSection(null)}
            onSave={handleUpdateSection}
          />
        )}
      </div>
    </AdminLayout>
  );
};


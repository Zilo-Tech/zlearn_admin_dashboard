import React, { useState } from 'react';
import { AdminLayout } from '../../components/layout';
import { DataTable, Column } from '../../components/common/DataTable';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import {
  useGetModulesQuery,
  useGetCoursesQuery,
  useCreateModuleMutation,
  useUpdateModuleMutation,
  useDeleteModuleMutation,
} from '../../store/api/contentApi';
import type { ContentModule } from '../../interfaces/course';
import { Alert } from '../../components/common/Alert';

export const ModulesPage: React.FC = () => {
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const { data: modules = [], isLoading } = useGetModulesQuery(
    selectedCourse ? { course: selectedCourse } : {}
  );
  const { data: coursesData } = useGetCoursesQuery({});
  const [createModule] = useCreateModuleMutation();
  const [updateModule] = useUpdateModuleMutation();
  const [deleteModule] = useDeleteModuleMutation();

  // Ensure courses is always an array
  const courses = Array.isArray(coursesData) ? coursesData : [];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingModule, setEditingModule] = useState<ContentModule | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    course: '',
    order: 1,
    title: '',
    description: '',
    estimated_hours: 0,
    is_optional: false,
  });

  const handleOpenModal = (module?: ContentModule) => {
    if (module) {
      setEditingModule(module);
      setFormData({
        course: module.course,
        order: module.order,
        title: module.title,
        description: module.description || '',
        estimated_hours: module.estimated_hours || 0,
        is_optional: module.is_optional,
      });
    } else {
      setEditingModule(null);
      setFormData({
        course: selectedCourse || '',
        order: modules.length + 1,
        title: '',
        description: '',
        estimated_hours: 0,
        is_optional: false,
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

  const handleDelete = async (module: ContentModule) => {
    if (window.confirm(`Are you sure you want to delete "${module.title}"?`)) {
      try {
        await deleteModule(module.id).unwrap();
      } catch (err: any) {
        alert(err?.data?.message || 'Failed to delete module');
      }
    }
  };

  const columns: Column<ContentModule>[] = [
    { key: 'order', header: 'Order' },
    { key: 'title', header: 'Title' },
    {
      key: 'estimated_hours',
      header: 'Hours',
      render: (module) => module.estimated_hours || 0,
    },
    {
      key: 'is_optional',
      header: 'Optional',
      render: (module) => (
        <span
          className={`px-2 py-1 text-xs font-semibold rounded-full ${
            module.is_optional
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-green-100 text-green-800'
          }`}
        >
          {module.is_optional ? 'Yes' : 'No'}
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
            <h1 className="text-3xl font-bold text-gray-800">Modules</h1>
            <p className="text-gray-600 mt-1">Manage course modules</p>
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
                label="Estimated Hours"
                type="number"
                value={formData.estimated_hours}
                onChange={(e) =>
                  setFormData({ ...formData, estimated_hours: parseFloat(e.target.value) || 0 })
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

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_optional}
                onChange={(e) => setFormData({ ...formData, is_optional: e.target.checked })}
                className="w-4 h-4 text-[#446D6D] border-gray-300 rounded focus:ring-[#446D6D]"
              />
              <span className="text-sm font-medium text-gray-700">Optional Module</span>
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


import React, { useState } from 'react';
import { AdminLayout } from '../../components/layout';
import { DataTable, Column } from '../../components/common/DataTable';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} from '../../store/api/coursesApi';
import type { CourseCategory } from '../../interfaces/course';
import { Alert } from '../../components/common/Alert';

export const CategoriesPage: React.FC = () => {
  const { data: categories = [], isLoading } = useGetCategoriesQuery();
  const [createCategory] = useCreateCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CourseCategory | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: '',
    color: '#3B82F6',
    sort_order: 0,
  });

  const handleOpenModal = (category?: CourseCategory) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        description: category.description || '',
        icon: category.icon || '',
        color: category.color || '#3B82F6',
        sort_order: category.sort_order || 0,
      });
    } else {
      setEditingCategory(null);
      setFormData({
        name: '',
        description: '',
        icon: '',
        color: '#3B82F6',
        sort_order: 0,
      });
    }
    setError(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      if (editingCategory) {
        await updateCategory({ id: editingCategory.id, data: formData }).unwrap();
      } else {
        await createCategory(formData).unwrap();
      }
      handleCloseModal();
    } catch (err: any) {
      setError(err?.data?.message || 'An error occurred');
    }
  };

  const handleDelete = async (category: CourseCategory) => {
    if (window.confirm(`Are you sure you want to delete "${category.name}"?`)) {
      try {
        await deleteCategory(category.id).unwrap();
      } catch (err: any) {
        alert(err?.data?.message || 'Failed to delete category');
      }
    }
  };

  const columns: Column<CourseCategory>[] = [
    { key: 'name', header: 'Name' },
    {
      key: 'slug',
      header: 'Slug',
      render: (category) => (
        <span className="text-sm text-gray-500 font-mono">{category.slug}</span>
      ),
    },
    {
      key: 'icon',
      header: 'Icon',
      render: (category) => (
        <span className="text-2xl">{category.icon || '💻'}</span>
      ),
    },
    {
      key: 'color',
      header: 'Color',
      render: (category) => (
        <div className="flex items-center gap-2">
          <div
            className="w-6 h-6 rounded-full border-2 border-gray-300"
            style={{ backgroundColor: category.color || '#3B82F6' }}
          />
          <span className="text-sm text-gray-600">{category.color || '#3B82F6'}</span>
        </div>
      ),
    },
    {
      key: 'sort_order',
      header: 'Sort Order',
      render: (category) => category.sort_order || 0,
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Course Categories</h1>
            <p className="text-gray-600 mt-1">Manage professional course categories</p>
          </div>
        </div>

        {error && <Alert type="error" message={error} />}

        <DataTable
          data={categories}
          columns={columns}
          loading={isLoading}
          onAdd={() => handleOpenModal()}
          onEdit={handleOpenModal}
          onDelete={handleDelete}
          title="All Categories"
          addButtonLabel="Add Category"
          keyExtractor={(item) => item.id}
        />

        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title={editingCategory ? 'Edit Category' : 'Create Category'}
          size="md"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
            <Input
              label="Icon (Emoji)"
              value={formData.icon}
              onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
              placeholder="💻"
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Color"
                type="color"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              />
              <Input
                label="Sort Order"
                type="number"
                value={formData.sort_order}
                onChange={(e) =>
                  setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })
                }
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" fullWidth>
                {editingCategory ? 'Update' : 'Create'}
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


import React, { useState } from 'react';
import { AdminLayout } from '../../components/layout';
import { DataTable, Column } from '../../components/common/DataTable';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import {
  useGetSubjectsQuery,
  useCreateSubjectMutation,
  useUpdateSubjectMutation,
  useDeleteSubjectMutation,
} from '../../store/api/educationApi';
import type { Subject } from '../../interfaces/education';
import { Alert } from '../../components/common/Alert';

export const EducationSubjectsPage: React.FC = () => {
  const { data: subjects = [], isLoading } = useGetSubjectsQuery({});
  const [createSubject] = useCreateSubjectMutation();
  const [updateSubject] = useUpdateSubjectMutation();
  const [deleteSubject] = useDeleteSubjectMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    description: '',
    icon: '',
    color: '#3B82F6',
    is_active: true,
  });

  const handleOpenModal = (subject?: Subject) => {
    if (subject) {
      setEditingSubject(subject);
      setFormData({
        id: subject.id,
        name: subject.name,
        description: subject.description || '',
        icon: subject.icon || '',
        color: subject.color || '#3B82F6',
        is_active: subject.is_active,
      });
    } else {
      setEditingSubject(null);
      setFormData({
        id: '',
        name: '',
        description: '',
        icon: '',
        color: '#3B82F6',
        is_active: true,
      });
    }
    setError(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingSubject(null);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      if (editingSubject) {
        const { id, ...updateData } = formData;
        await updateSubject({ id: editingSubject.id, ...updateData }).unwrap();
      } else {
        await createSubject(formData).unwrap();
      }
      handleCloseModal();
    } catch (err: any) {
      setError(err?.data?.message || 'An error occurred');
    }
  };

  const handleDelete = async (subject: Subject) => {
    if (window.confirm(`Are you sure you want to delete "${subject.name}"?`)) {
      try {
        await deleteSubject(subject.id).unwrap();
      } catch (err: any) {
        alert(err?.data?.message || 'Failed to delete subject');
      }
    }
  };

  const columns: Column<Subject>[] = [
    { key: 'id', header: 'ID' },
    { key: 'name', header: 'Name' },
    {
      key: 'icon',
      header: 'Icon',
      render: (subject) => <span className="text-2xl">{subject.icon || '📚'}</span>,
    },
    {
      key: 'color',
      header: 'Color',
      render: (subject) => (
        <div className="flex items-center gap-2">
          <div
            className="w-6 h-6 rounded-full border-2 border-gray-300"
            style={{ backgroundColor: subject.color || '#3B82F6' }}
          />
          <span className="text-sm text-gray-600">{subject.color || '#3B82F6'}</span>
        </div>
      ),
    },
    {
      key: 'is_active',
      header: 'Status',
      render: (subject) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            subject.is_active
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          {subject.is_active ? 'Active' : 'Inactive'}
        </span>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Subjects</h1>
          <Button onClick={() => handleOpenModal()}>Add Subject</Button>
        </div>

        {error && <Alert type="error" message={error} />}

        <DataTable
          data={subjects}
          columns={columns}
          loading={isLoading}
          onAdd={() => handleOpenModal()}
          onEdit={handleOpenModal}
          onDelete={handleDelete}
          title="All Subjects"
          addButtonLabel="Add Subject"
          keyExtractor={(item) => item.id}
        />

        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title={editingSubject ? 'Edit Subject' : 'Create Subject'}
          size="md"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <Alert type="error" message={error} />}
            <Input
              label="ID"
              value={formData.id}
              onChange={(e) => setFormData({ ...formData, id: e.target.value })}
              placeholder="mathematics"
              required
              disabled={!!editingSubject}
            />
            <Input
              label="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Mathematics"
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
              placeholder="📐"
            />
            <Input
              label="Color"
              type="color"
              value={formData.color}
              onChange={(e) => setFormData({ ...formData, color: e.target.value })}
            />
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_active"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="w-4 h-4 text-[#446D6D] border-gray-300 rounded focus:ring-[#446D6D]"
              />
              <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
                Active
              </label>
            </div>
            <div className="flex gap-3 pt-4">
              <Button type="submit" fullWidth>
                {editingSubject ? 'Update' : 'Create'}
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


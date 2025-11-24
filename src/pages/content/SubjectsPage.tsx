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
} from '../../store/api/contentApi';
import type { Subject } from '../../interfaces/course';
import { Alert } from '../../components/common/Alert';

export const SubjectsPage: React.FC = () => {
  const { data: subjects = [], isLoading } = useGetSubjectsQuery();
  const [createSubject] = useCreateSubjectMutation();
  const [updateSubject] = useUpdateSubjectMutation();
  const [deleteSubject] = useDeleteSubjectMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    icon: '',
    color: '#3B82F6',
  });

  const handleOpenModal = (subject?: Subject) => {
    if (subject) {
      setEditingSubject(subject);
      setFormData({
        name: subject.name,
        code: subject.code,
        icon: subject.icon || '',
        color: subject.color || '#3B82F6',
      });
    } else {
      setEditingSubject(null);
      setFormData({
        name: '',
        code: '',
        icon: '',
        color: '#3B82F6',
      });
    }
    setError(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingSubject(null);
    setFormData({
      name: '',
      code: '',
      icon: '',
      color: '#3B82F6',
    });
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      if (editingSubject) {
        await updateSubject({ id: editingSubject.id, data: formData }).unwrap();
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
    { key: 'code', header: 'Code' },
    { key: 'name', header: 'Name' },
    {
      key: 'icon',
      header: 'Icon',
      render: (subject) => (
        <span className="text-2xl">{subject.icon || '📚'}</span>
      ),
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
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Subjects</h1>
            <p className="text-gray-600 mt-1">Manage academic subjects</p>
          </div>
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
            <Input
              label="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <Input
              label="Code"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
              required
            />
            <Input
              label="Icon (Emoji)"
              value={formData.icon}
              onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
              placeholder="📚"
            />
            <Input
              label="Color"
              type="color"
              value={formData.color}
              onChange={(e) => setFormData({ ...formData, color: e.target.value })}
            />

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


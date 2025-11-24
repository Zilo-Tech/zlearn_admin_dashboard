import React, { useState } from 'react';
import { AdminLayout } from '../../components/layout';
import { DataTable, Column } from '../../components/common/DataTable';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import {
  useGetFacultiesQuery,
  useGetSchoolsQuery,
  useCreateFacultyMutation,
  useUpdateFacultyMutation,
  useDeleteFacultyMutation,
} from '../../store/api/educationApi';
import type { Faculty, School } from '../../interfaces/education';
import { Alert } from '../../components/common/Alert';

export const FacultiesPage: React.FC = () => {
  const { data: faculties = [], isLoading } = useGetFacultiesQuery({});
  const { data: schools = [] } = useGetSchoolsQuery({});
  const [createFaculty] = useCreateFacultyMutation();
  const [updateFaculty] = useUpdateFacultyMutation();
  const [deleteFaculty] = useDeleteFacultyMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState<Faculty | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    school_id: '',
    description: '',
    icon: '',
    type: 'faculty',
    is_active: true,
  });

  const handleOpenModal = (faculty?: Faculty) => {
    if (faculty) {
      setEditingFaculty(faculty);
      setFormData({
        id: faculty.id,
        name: faculty.name,
        school_id: faculty.school_id,
        description: faculty.description || '',
        icon: faculty.icon || '',
        type: faculty.type || 'faculty',
        is_active: faculty.is_active,
      });
    } else {
      setEditingFaculty(null);
      setFormData({
        id: '',
        name: '',
        school_id: '',
        description: '',
        icon: '',
        type: 'faculty',
        is_active: true,
      });
    }
    setError(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingFaculty(null);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      if (editingFaculty) {
        const { id, ...updateData } = formData;
        await updateFaculty({ id: editingFaculty.id, ...updateData }).unwrap();
      } else {
        await createFaculty(formData).unwrap();
      }
      handleCloseModal();
    } catch (err: any) {
      setError(err?.data?.message || 'An error occurred');
    }
  };

  const handleDelete = async (faculty: Faculty) => {
    if (window.confirm(`Are you sure you want to delete "${faculty.name}"?`)) {
      try {
        await deleteFaculty(faculty.id).unwrap();
      } catch (err: any) {
        alert(err?.data?.message || 'Failed to delete faculty');
      }
    }
  };

  const columns: Column<Faculty>[] = [
    { key: 'id', header: 'ID' },
    { key: 'name', header: 'Name' },
    {
      key: 'school',
      header: 'School',
      render: (faculty) => faculty.school?.name || faculty.school_id,
    },
    { key: 'type', header: 'Type' },
    {
      key: 'is_active',
      header: 'Status',
      render: (faculty) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            faculty.is_active
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          {faculty.is_active ? 'Active' : 'Inactive'}
        </span>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Faculties</h1>
          <Button onClick={() => handleOpenModal()}>Add Faculty</Button>
        </div>
        {error && <Alert type="error" message={error} />}
        <DataTable
          data={faculties}
          columns={columns}
          loading={isLoading}
          onAdd={() => handleOpenModal()}
          onEdit={handleOpenModal}
          onDelete={handleDelete}
          title="All Faculties"
          addButtonLabel="Add Faculty"
          keyExtractor={(item) => item.id}
        />
        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title={editingFaculty ? 'Edit Faculty' : 'Create Faculty'}
          size="md"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <Alert type="error" message={error} />}
            <Input
              label="ID"
              value={formData.id}
              onChange={(e) => setFormData({ ...formData, id: e.target.value })}
              placeholder="faculty-of-science"
              required
              disabled={!!editingFaculty}
            />
            <Input
              label="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Faculty of Science"
              required
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">School *</label>
              <select
                value={formData.school_id}
                onChange={(e) => setFormData({ ...formData, school_id: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#446D6D] focus:ring-4 focus:ring-[#446D6D]/10 outline-none transition-all duration-200"
                required
              >
                <option value="">Select a school</option>
                {Array.isArray(schools) &&
                  schools.map((school: School) => (
                    <option key={school.id} value={school.id}>
                      {school.name}
                    </option>
                  ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#446D6D] focus:ring-4 focus:ring-[#446D6D]/10 outline-none transition-all duration-200"
              >
                <option value="faculty">Faculty</option>
                <option value="school">School</option>
                <option value="college">College</option>
                <option value="department">Department</option>
              </select>
            </div>
            <Input
              label="Icon (Emoji)"
              value={formData.icon}
              onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
              placeholder="🔬"
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#446D6D] focus:ring-4 focus:ring-[#446D6D]/10 outline-none transition-all duration-200"
                rows={3}
              />
            </div>
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
                {editingFaculty ? 'Update' : 'Create'}
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

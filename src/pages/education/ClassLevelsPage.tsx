import React, { useState } from 'react';
import { AdminLayout } from '../../components/layout';
import { DataTable, Column } from '../../components/common/DataTable';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import {
  useGetClassLevelsQuery,
  useGetSchoolsQuery,
  useGetEducationLevelsQuery,
  useCreateClassLevelMutation,
  useUpdateClassLevelMutation,
  useDeleteClassLevelMutation,
} from '../../store/api/educationApi';
import type { ClassLevel, School, EducationLevel } from '../../interfaces/education';
import { Alert } from '../../components/common/Alert';

export const ClassLevelsPage: React.FC = () => {
  const { data: classLevels = [], isLoading } = useGetClassLevelsQuery({});
  const { data: schools = [] } = useGetSchoolsQuery({});
  const { data: educationLevels = [] } = useGetEducationLevelsQuery({});
  const [createClassLevel] = useCreateClassLevelMutation();
  const [updateClassLevel] = useUpdateClassLevelMutation();
  const [deleteClassLevel] = useDeleteClassLevelMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClassLevel, setEditingClassLevel] = useState<ClassLevel | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    school_id: '',
    education_level_id: '',
    description: '',
    icon: '',
    age_range: '',
    order: 1,
    is_active: true,
  });

  const handleOpenModal = (classLevel?: ClassLevel) => {
    if (classLevel) {
      setEditingClassLevel(classLevel);
      setFormData({
        id: classLevel.id,
        name: classLevel.name,
        school_id: classLevel.school_id,
        education_level_id: classLevel.education_level_id,
        description: classLevel.description || '',
        icon: classLevel.icon || '',
        age_range: classLevel.age_range || '',
        order: classLevel.order,
        is_active: classLevel.is_active,
      });
    } else {
      setEditingClassLevel(null);
      setFormData({
        id: '',
        name: '',
        school_id: '',
        education_level_id: '',
        description: '',
        icon: '',
        age_range: '',
        order: 1,
        is_active: true,
      });
    }
    setError(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingClassLevel(null);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      if (editingClassLevel) {
        const { id, ...updateData } = formData;
        await updateClassLevel({ id: editingClassLevel.id, ...updateData }).unwrap();
      } else {
        await createClassLevel(formData).unwrap();
      }
      handleCloseModal();
    } catch (err: any) {
      setError(err?.data?.message || 'An error occurred');
    }
  };

  const handleDelete = async (classLevel: ClassLevel) => {
    if (window.confirm(`Are you sure you want to delete "${classLevel.name}"?`)) {
      try {
        await deleteClassLevel(classLevel.id).unwrap();
      } catch (err: any) {
        alert(err?.data?.message || 'Failed to delete class level');
      }
    }
  };

  const columns: Column<ClassLevel>[] = [
    { key: 'id', header: 'ID' },
    { key: 'name', header: 'Name' },
    {
      key: 'school',
      header: 'School',
      render: (classLevel) => classLevel.school?.name || classLevel.school_id,
    },
    {
      key: 'education_level',
      header: 'Education Level',
      render: (classLevel) => classLevel.education_level?.name || classLevel.education_level_id,
    },
    { key: 'order', header: 'Order' },
    {
      key: 'is_active',
      header: 'Status',
      render: (classLevel) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            classLevel.is_active
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          {classLevel.is_active ? 'Active' : 'Inactive'}
        </span>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Class Levels</h1>
          <Button onClick={() => handleOpenModal()}>Add Class Level</Button>
        </div>
        {error && <Alert type="error" message={error} />}
        <DataTable
          data={classLevels}
          columns={columns}
          loading={isLoading}
          onAdd={() => handleOpenModal()}
          onEdit={handleOpenModal}
          onDelete={handleDelete}
          title="All Class Levels"
          addButtonLabel="Add Class Level"
          keyExtractor={(item) => item.id}
        />
        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title={editingClassLevel ? 'Edit Class Level' : 'Create Class Level'}
          size="md"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <Alert type="error" message={error} />}
            <Input
              label="ID"
              value={formData.id}
              onChange={(e) => setFormData({ ...formData, id: e.target.value })}
              placeholder="form-1"
              required
              disabled={!!editingClassLevel}
            />
            <Input
              label="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Form 1"
              required
            />
            <div className="grid grid-cols-2 gap-4">
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Education Level *
                </label>
                <select
                  value={formData.education_level_id}
                  onChange={(e) =>
                    setFormData({ ...formData, education_level_id: e.target.value })
                  }
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#446D6D] focus:ring-4 focus:ring-[#446D6D]/10 outline-none transition-all duration-200"
                  required
                >
                  <option value="">Select education level</option>
                  {Array.isArray(educationLevels) &&
                    educationLevels.map((level: EducationLevel) => (
                      <option key={level.id} value={level.id}>
                        {level.name}
                      </option>
                    ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Icon (Emoji)"
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                placeholder="📚"
              />
              <Input
                label="Age Range"
                value={formData.age_range}
                onChange={(e) => setFormData({ ...formData, age_range: e.target.value })}
                placeholder="12-13 years"
              />
            </div>
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
                {editingClassLevel ? 'Update' : 'Create'}
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


import React, { useState } from 'react';
import { AdminLayout } from '../../components/layout';
import { DataTable, Column } from '../../components/common/DataTable';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import {
  useGetEducationLevelsQuery,
  useGetCountriesQuery,
  useCreateEducationLevelMutation,
  useUpdateEducationLevelMutation,
  useDeleteEducationLevelMutation,
} from '../../store/api/educationApi';
import type { EducationLevel, Country } from '../../interfaces/education';
import { Alert } from '../../components/common/Alert';

export const EducationLevelsPage: React.FC = () => {
  const { data: educationLevels = [], isLoading } = useGetEducationLevelsQuery({});
  const { data: countries = [] } = useGetCountriesQuery({});
  const [createEducationLevel] = useCreateEducationLevelMutation();
  const [updateEducationLevel] = useUpdateEducationLevelMutation();
  const [deleteEducationLevel] = useDeleteEducationLevelMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLevel, setEditingLevel] = useState<EducationLevel | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    age_range: '',
    country_id: '',
    order: 1,
    is_active: true,
  });

  const handleOpenModal = (level?: EducationLevel) => {
    if (level) {
      setEditingLevel(level);
      setFormData({
        id: level.id,
        name: level.name,
        age_range: level.age_range || '',
        country_id: level.country_id,
        order: level.order,
        is_active: level.is_active,
      });
    } else {
      setEditingLevel(null);
      setFormData({
        id: '',
        name: '',
        age_range: '',
        country_id: '',
        order: 1,
        is_active: true,
      });
    }
    setError(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingLevel(null);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      if (editingLevel) {
        const { id, ...updateData } = formData;
        await updateEducationLevel({ id: editingLevel.id, ...updateData }).unwrap();
      } else {
        await createEducationLevel(formData).unwrap();
      }
      handleCloseModal();
    } catch (err: any) {
      setError(err?.data?.message || 'An error occurred');
    }
  };

  const handleDelete = async (level: EducationLevel) => {
    if (window.confirm(`Are you sure you want to delete "${level.name}"?`)) {
      try {
        await deleteEducationLevel(level.id).unwrap();
      } catch (err: any) {
        alert(err?.data?.message || 'Failed to delete education level');
      }
    }
  };

  const columns: Column<EducationLevel>[] = [
    { key: 'id', header: 'ID' },
    { key: 'name', header: 'Name' },
    {
      key: 'country',
      header: 'Country',
      render: (level) => level.country?.name || level.country_id,
    },
    { key: 'age_range', header: 'Age Range' },
    { key: 'order', header: 'Order' },
    {
      key: 'is_active',
      header: 'Status',
      render: (level) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            level.is_active
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          {level.is_active ? 'Active' : 'Inactive'}
        </span>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Education Levels</h1>
          <Button onClick={() => handleOpenModal()}>Add Education Level</Button>
        </div>

        {error && <Alert type="error" message={error} />}

        <DataTable
          data={educationLevels}
          columns={columns}
          loading={isLoading}
          onAdd={() => handleOpenModal()}
          onEdit={handleOpenModal}
          onDelete={handleDelete}
          title="All Education Levels"
          addButtonLabel="Add Education Level"
          keyExtractor={(item) => item.id}
        />

        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title={editingLevel ? 'Edit Education Level' : 'Create Education Level'}
          size="md"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <Alert type="error" message={error} />}
            <Input
              label="ID"
              value={formData.id}
              onChange={(e) => setFormData({ ...formData, id: e.target.value })}
              placeholder="primary"
              required
              disabled={!!editingLevel}
            />
            <Input
              label="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Primary Education"
              required
            />
            <Input
              label="Age Range"
              value={formData.age_range}
              onChange={(e) => setFormData({ ...formData, age_range: e.target.value })}
              placeholder="6-11 years"
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Country *
              </label>
              <select
                value={formData.country_id}
                onChange={(e) => setFormData({ ...formData, country_id: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#446D6D] focus:ring-4 focus:ring-[#446D6D]/10 outline-none transition-all duration-200"
                required
              >
                <option value="">Select a country</option>
                {Array.isArray(countries) &&
                  countries.map((country: Country) => (
                    <option key={country.id} value={country.id}>
                      {country.flag_emoji} {country.name}
                    </option>
                  ))}
              </select>
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
                {editingLevel ? 'Update' : 'Create'}
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


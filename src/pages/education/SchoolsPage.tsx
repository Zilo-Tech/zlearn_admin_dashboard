import React, { useState } from 'react';
import { AdminLayout } from '../../components/layout';
import { DataTable, Column } from '../../components/common/DataTable';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import {
  useGetSchoolsQuery,
  useGetCountriesQuery,
  useGetEducationLevelsQuery,
  useCreateSchoolMutation,
  useUpdateSchoolMutation,
  useDeleteSchoolMutation,
} from '../../store/api/educationApi';
import type { School, Country, EducationLevel } from '../../interfaces/education';
import { Alert } from '../../components/common/Alert';

export const SchoolsPage: React.FC = () => {
  const { data: schools = [], isLoading } = useGetSchoolsQuery({});
  const { data: countries = [] } = useGetCountriesQuery({});
  const { data: educationLevels = [] } = useGetEducationLevelsQuery({});
  const [createSchool] = useCreateSchoolMutation();
  const [updateSchool] = useUpdateSchoolMutation();
  const [deleteSchool] = useDeleteSchoolMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSchool, setEditingSchool] = useState<School | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    country_id: '',
    education_level_id: '',
    type: '',
    location: '',
    established: '',
    description: '',
    website: '',
    is_active: true,
  });

  const handleOpenModal = (school?: School) => {
    if (school) {
      setEditingSchool(school);
      setFormData({
        id: school.id,
        name: school.name,
        country_id: school.country_id,
        education_level_id: school.education_level_id,
        type: school.type || '',
        location: school.location || '',
        established: school.established?.toString() || '',
        description: school.description || '',
        website: school.website || '',
        is_active: school.is_active,
      });
    } else {
      setEditingSchool(null);
      setFormData({
        id: '',
        name: '',
        country_id: '',
        education_level_id: '',
        type: '',
        location: '',
        established: '',
        description: '',
        website: '',
        is_active: true,
      });
    }
    setError(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingSchool(null);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const submitData: any = {
        ...formData,
        established: formData.established ? parseInt(formData.established) : undefined,
      };
      if (editingSchool) {
        const { id, ...updateData } = submitData;
        await updateSchool({ id: editingSchool.id, ...updateData }).unwrap();
      } else {
        await createSchool(submitData).unwrap();
      }
      handleCloseModal();
    } catch (err: any) {
      setError(err?.data?.message || 'An error occurred');
    }
  };

  const handleDelete = async (school: School) => {
    if (window.confirm(`Are you sure you want to delete "${school.name}"?`)) {
      try {
        await deleteSchool(school.id).unwrap();
      } catch (err: any) {
        alert(err?.data?.message || 'Failed to delete school');
      }
    }
  };

  const columns: Column<School>[] = [
    { key: 'id', header: 'ID' },
    { key: 'name', header: 'Name' },
    {
      key: 'country',
      header: 'Country',
      render: (school) => school.country?.name || school.country_id,
    },
    {
      key: 'education_level',
      header: 'Education Level',
      render: (school) => school.education_level?.name || school.education_level_id,
    },
    { key: 'type', header: 'Type' },
    {
      key: 'is_active',
      header: 'Status',
      render: (school) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            school.is_active
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          {school.is_active ? 'Active' : 'Inactive'}
        </span>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Schools</h1>
          <Button onClick={() => handleOpenModal()}>Add School</Button>
        </div>

        {error && <Alert type="error" message={error} />}

        <DataTable
          data={schools}
          columns={columns}
          loading={isLoading}
          onAdd={() => handleOpenModal()}
          onEdit={handleOpenModal}
          onDelete={handleDelete}
          title="All Schools"
          addButtonLabel="Add School"
          keyExtractor={(item) => item.id}
        />

        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title={editingSchool ? 'Edit School' : 'Create School'}
          size="lg"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <Alert type="error" message={error} />}
            <Input
              label="ID"
              value={formData.id}
              onChange={(e) => setFormData({ ...formData, id: e.target.value })}
              placeholder="university-of-yaounde"
              required
              disabled={!!editingSchool}
            />
            <Input
              label="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="University of Yaoundé I"
              required
            />
            <div className="grid grid-cols-2 gap-4">
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
            <Input
              label="Type"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              placeholder="Public University"
            />
            <Input
              label="Location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="Yaoundé, Cameroon"
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Established Year"
                type="number"
                value={formData.established}
                onChange={(e) => setFormData({ ...formData, established: e.target.value })}
                placeholder="1962"
              />
              <Input
                label="Website"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                placeholder="https://example.com"
              />
            </div>
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
                {editingSchool ? 'Update' : 'Create'}
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


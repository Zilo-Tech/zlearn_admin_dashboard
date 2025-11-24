import React, { useState } from 'react';
import { AdminLayout } from '../../components/layout';
import { DataTable, Column } from '../../components/common/DataTable';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import {
  useGetCountriesQuery,
  useCreateCountryMutation,
  useUpdateCountryMutation,
  useDeleteCountryMutation,
} from '../../store/api/educationApi';
import type { Country } from '../../interfaces/education';
import { Alert } from '../../components/common/Alert';

export const CountriesPage: React.FC = () => {
  const { data: countries = [], isLoading } = useGetCountriesQuery({});
  const [createCountry] = useCreateCountryMutation();
  const [updateCountry] = useUpdateCountryMutation();
  const [deleteCountry] = useDeleteCountryMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCountry, setEditingCountry] = useState<Country | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    code: '',
    flag_emoji: '',
    is_active: true,
  });

  const handleOpenModal = (country?: Country) => {
    if (country) {
      setEditingCountry(country);
      setFormData({
        id: country.id,
        name: country.name,
        code: country.code,
        flag_emoji: country.flag_emoji || '',
        is_active: country.is_active,
      });
    } else {
      setEditingCountry(null);
      setFormData({
        id: '',
        name: '',
        code: '',
        flag_emoji: '',
        is_active: true,
      });
    }
    setError(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCountry(null);
    setFormData({
      id: '',
      name: '',
      code: '',
      flag_emoji: '',
      is_active: true,
    });
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      if (editingCountry) {
        const { id, ...updateData } = formData;
        await updateCountry({ id: editingCountry.id, ...updateData }).unwrap();
      } else {
        await createCountry(formData).unwrap();
      }
      handleCloseModal();
    } catch (err: any) {
      setError(err?.data?.message || 'An error occurred');
    }
  };

  const handleDelete = async (country: Country) => {
    if (window.confirm(`Are you sure you want to delete "${country.name}"?`)) {
      try {
        await deleteCountry(country.id).unwrap();
      } catch (err: any) {
        alert(err?.data?.message || 'Failed to delete country');
      }
    }
  };

  const columns: Column<Country>[] = [
    {
      key: 'flag_emoji',
      header: 'Flag',
      render: (country) => (
        <span className="text-2xl">{country.flag_emoji || '🌍'}</span>
      ),
    },
    { key: 'code', header: 'Code' },
    { key: 'name', header: 'Name' },
    {
      key: 'is_active',
      header: 'Status',
      render: (country) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            country.is_active
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          {country.is_active ? 'Active' : 'Inactive'}
        </span>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Countries</h1>
          <Button onClick={() => handleOpenModal()}>Add Country</Button>
        </div>

        {error && <Alert type="error" message={error} />}

        <DataTable
          data={countries}
          columns={columns}
          loading={isLoading}
          onAdd={() => handleOpenModal()}
          onEdit={handleOpenModal}
          onDelete={handleDelete}
          title="All Countries"
          addButtonLabel="Add Country"
          keyExtractor={(item) => item.id}
        />

        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title={editingCountry ? 'Edit Country' : 'Create Country'}
          size="md"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <Alert type="error" message={error} />}
            <Input
              label="ID (Country Code)"
              value={formData.id}
              onChange={(e) => setFormData({ ...formData, id: e.target.value })}
              placeholder="cm"
              required
              disabled={!!editingCountry}
            />
            <Input
              label="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Cameroon"
              required
            />
            <Input
              label="Code"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
              placeholder="CM"
              required
            />
            <Input
              label="Flag Emoji"
              value={formData.flag_emoji}
              onChange={(e) => setFormData({ ...formData, flag_emoji: e.target.value })}
              placeholder="🇨🇲"
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
                {editingCountry ? 'Update' : 'Create'}
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


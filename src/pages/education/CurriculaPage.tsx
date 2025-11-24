import React, { useState } from 'react';
import { AdminLayout } from '../../components/layout';
import { DataTable, Column } from '../../components/common/DataTable';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import {
  useGetCurriculaQuery,
  useGetProgramsQuery,
  useCreateCurriculumMutation,
  useUpdateCurriculumMutation,
  useDeleteCurriculumMutation,
} from '../../store/api/educationApi';
import type { Curriculum, Program } from '../../interfaces/education';
import { Alert } from '../../components/common/Alert';
import { Plus, Trash2 } from 'lucide-react';

export const CurriculaPage: React.FC = () => {
  const { data: curricula = [], isLoading } = useGetCurriculaQuery({});
  const { data: programs = [] } = useGetProgramsQuery({});
  const [createCurriculum] = useCreateCurriculumMutation();
  const [updateCurriculum] = useUpdateCurriculumMutation();
  const [deleteCurriculum] = useDeleteCurriculumMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCurriculum, setEditingCurriculum] = useState<Curriculum | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    program_id: '',
    year: 1,
    semester: 'first',
    subjects: [] as string[],
    description: '',
    is_active: true,
  });
  const [newSubject, setNewSubject] = useState('');

  const handleOpenModal = (curriculum?: Curriculum) => {
    if (curriculum) {
      setEditingCurriculum(curriculum);
      setFormData({
        id: curriculum.id,
        name: curriculum.name,
        program_id: curriculum.program_id,
        year: curriculum.year,
        semester: curriculum.semester,
        subjects: curriculum.subjects || [],
        description: curriculum.description || '',
        is_active: curriculum.is_active,
      });
    } else {
      setEditingCurriculum(null);
      setFormData({
        id: '',
        name: '',
        program_id: '',
        year: 1,
        semester: 'first',
        subjects: [],
        description: '',
        is_active: true,
      });
    }
    setNewSubject('');
    setError(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCurriculum(null);
    setNewSubject('');
    setError(null);
  };

  const handleAddSubject = () => {
    if (newSubject.trim() && !formData.subjects.includes(newSubject.trim())) {
      setFormData({
        ...formData,
        subjects: [...formData.subjects, newSubject.trim()],
      });
      setNewSubject('');
    }
  };

  const handleRemoveSubject = (subject: string) => {
    setFormData({
      ...formData,
      subjects: formData.subjects.filter((s) => s !== subject),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      if (editingCurriculum) {
        const { id, ...updateData } = formData;
        await updateCurriculum({ id: editingCurriculum.id, ...updateData }).unwrap();
      } else {
        await createCurriculum(formData).unwrap();
      }
      handleCloseModal();
    } catch (err: any) {
      setError(err?.data?.message || 'An error occurred');
    }
  };

  const handleDelete = async (curriculum: Curriculum) => {
    if (window.confirm(`Are you sure you want to delete "${curriculum.name}"?`)) {
      try {
        await deleteCurriculum(curriculum.id).unwrap();
      } catch (err: any) {
        alert(err?.data?.message || 'Failed to delete curriculum');
      }
    }
  };

  const columns: Column<Curriculum>[] = [
    { key: 'id', header: 'ID' },
    { key: 'name', header: 'Name' },
    {
      key: 'program',
      header: 'Program',
      render: (curriculum) => curriculum.program?.name || curriculum.program_id,
    },
    { key: 'year', header: 'Year' },
    { key: 'semester', header: 'Semester' },
    {
      key: 'subjects',
      header: 'Subjects',
      render: (curriculum) => (
        <span className="text-sm text-gray-600">
          {curriculum.subjects?.length || 0} subject(s)
        </span>
      ),
    },
    {
      key: 'is_active',
      header: 'Status',
      render: (curriculum) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            curriculum.is_active
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          {curriculum.is_active ? 'Active' : 'Inactive'}
        </span>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Curricula</h1>
          <Button onClick={() => handleOpenModal()}>Add Curriculum</Button>
        </div>
        {error && <Alert type="error" message={error} />}
        <DataTable
          data={curricula}
          columns={columns}
          loading={isLoading}
          onAdd={() => handleOpenModal()}
          onEdit={handleOpenModal}
          onDelete={handleDelete}
          title="All Curricula"
          addButtonLabel="Add Curriculum"
          keyExtractor={(item) => item.id}
        />
        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title={editingCurriculum ? 'Edit Curriculum' : 'Create Curriculum'}
          size="lg"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <Alert type="error" message={error} />}
            <Input
              label="ID"
              value={formData.id}
              onChange={(e) => setFormData({ ...formData, id: e.target.value })}
              placeholder="cs-year-1-semester-1"
              required
              disabled={!!editingCurriculum}
            />
            <Input
              label="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Computer Science Year 1 Semester 1"
              required
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Program *</label>
              <select
                value={formData.program_id}
                onChange={(e) => setFormData({ ...formData, program_id: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#446D6D] focus:ring-4 focus:ring-[#446D6D]/10 outline-none transition-all duration-200"
                required
              >
                <option value="">Select a program</option>
                {Array.isArray(programs) &&
                  programs.map((program: Program) => (
                    <option key={program.id} value={program.id}>
                      {program.name}
                    </option>
                  ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Year"
                type="number"
                value={formData.year}
                onChange={(e) =>
                  setFormData({ ...formData, year: parseInt(e.target.value) || 1 })
                }
                required
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Semester</label>
                <select
                  value={formData.semester}
                  onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#446D6D] focus:ring-4 focus:ring-[#446D6D]/10 outline-none transition-all duration-200"
                  required
                >
                  <option value="first">First</option>
                  <option value="second">Second</option>
                  <option value="both">Both</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subjects</label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  placeholder="Enter subject name"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSubject();
                    }
                  }}
                />
                <Button type="button" onClick={handleAddSubject} size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              {formData.subjects.length > 0 && (
                <div className="space-y-2">
                  {formData.subjects.map((subject, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                    >
                      <span className="text-sm text-gray-700">{subject}</span>
                      <Button
                        type="button"
                        onClick={() => handleRemoveSubject(subject)}
                        size="sm"
                        variant="danger"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              {formData.subjects.length === 0 && (
                <p className="text-sm text-gray-500">No subjects added yet</p>
              )}
            </div>
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
                {editingCurriculum ? 'Update' : 'Create'}
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


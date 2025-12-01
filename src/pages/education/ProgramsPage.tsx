import React, { useState } from 'react';
import { AdminLayout } from '../../components/layout';
import { DataTable, Column } from '../../components/common/DataTable';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import {
  useGetProgramsQuery,
  useGetSchoolsQuery,
  useGetFacultiesQuery,
  useGetClassLevelsQuery,
  useCreateProgramMutation,
  useUpdateProgramMutation,
  useDeleteProgramMutation,
} from '../../store/api/educationApi';
import type { Program, School, Faculty, ClassLevel } from '../../interfaces/education';
import { Alert } from '../../components/common/Alert';

// Common emoji icons for programs
const PROGRAM_ICONS = [
  { value: '📚', label: '📚 Books' },
  { value: '📐', label: '📐 Mathematics' },
  { value: '⚛️', label: '⚛️ Physics' },
  { value: '🧪', label: '🧪 Chemistry' },
  { value: '🔬', label: '🔬 Science' },
  { value: '🌍', label: '🌍 Geography' },
  { value: '📜', label: '📜 History' },
  { value: '🎨', label: '🎨 Arts' },
  { value: '🎵', label: '🎵 Music' },
  { value: '🏃', label: '🏃 Physical Education' },
  { value: '💻', label: '💻 Computer Science' },
  { value: '🌐', label: '🌐 Languages' },
  { value: '📖', label: '📖 Literature' },
  { value: '🔢', label: '🔢 Numbers' },
  { value: '🧮', label: '🧮 Calculator' },
  { value: '🔭', label: '🔭 Astronomy' },
  { value: '🌱', label: '🌱 Biology' },
  { value: '⚖️', label: '⚖️ Law' },
  { value: '💼', label: '💼 Business' },
  { value: '🏥', label: '🏥 Medicine' },
  { value: '🏗️', label: '🏗️ Engineering' },
  { value: '🎭', label: '🎭 Drama' },
  { value: '🎬', label: '🎬 Film' },
  { value: '📷', label: '📷 Photography' },
  { value: '✍️', label: '✍️ Writing' },
];

export const ProgramsPage: React.FC = () => {
  const { data: programs = [], isLoading } = useGetProgramsQuery({});
  const { data: schools = [] } = useGetSchoolsQuery({});
  const { data: faculties = [] } = useGetFacultiesQuery({});
  const { data: classLevels = [] } = useGetClassLevelsQuery({});
  const [createProgram] = useCreateProgramMutation();
  const [updateProgram] = useUpdateProgramMutation();
  const [deleteProgram] = useDeleteProgramMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    school_id: '',
    faculty_id: '',
    class_level_id: '',
    degree: '',
    duration: '',
    description: '',
    icon: '',
    difficulty: 'beginner',
    is_active: true,
  });

  const handleOpenModal = (program?: Program) => {
    if (program) {
      setEditingProgram(program);
      setFormData({
        name: program.name,
        school_id: program.school_id,
        faculty_id: program.faculty_id || '',
        class_level_id: program.class_level_id || '',
        degree: program.degree || '',
        duration: program.duration || '',
        description: program.description || '',
        icon: program.icon || '',
        difficulty: program.difficulty || 'beginner',
        is_active: program.is_active,
      });
    } else {
      setEditingProgram(null);
      setFormData({
        name: '',
        school_id: '',
        faculty_id: '',
        class_level_id: '',
        degree: '',
        duration: '',
        description: '',
        icon: '',
        difficulty: 'beginner',
        is_active: true,
      });
    }
    setError(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProgram(null);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const submitData: any = {
        ...formData,
        faculty_id: formData.faculty_id || null,
        class_level_id: formData.class_level_id || null,
      };
      if (editingProgram) {
        await updateProgram({ id: editingProgram.id, ...submitData }).unwrap();
      } else {
        await createProgram(submitData).unwrap();
      }
      handleCloseModal();
    } catch (err: any) {
      setError(err?.data?.message || 'An error occurred');
    }
  };

  const handleDelete = async (program: Program) => {
    if (window.confirm(`Are you sure you want to delete "${program.name}"?`)) {
      try {
        await deleteProgram(program.id).unwrap();
      } catch (err: any) {
        alert(err?.data?.message || 'Failed to delete program');
      }
    }
  };

  const columns: Column<Program>[] = [
    { key: 'id', header: 'ID' },
    { key: 'name', header: 'Name' },
    {
      key: 'school',
      header: 'School',
      render: (program) => program.school?.name || program.school_id,
    },
    {
      key: 'faculty',
      header: 'Faculty',
      render: (program) => program.faculty?.name || program.faculty_id || '-',
    },
    {
      key: 'class_level',
      header: 'Class Level',
      render: (program) => program.class_level?.name || program.class_level_id || '-',
    },
    { key: 'difficulty', header: 'Difficulty' },
    {
      key: 'is_active',
      header: 'Status',
      render: (program) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            program.is_active
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          {program.is_active ? 'Active' : 'Inactive'}
        </span>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Programs</h1>
          <Button onClick={() => handleOpenModal()}>Add Program</Button>
        </div>
        {error && <Alert type="error" message={error} />}
        <DataTable
          data={programs}
          columns={columns}
          loading={isLoading}
          onAdd={() => handleOpenModal()}
          onEdit={handleOpenModal}
          onDelete={handleDelete}
          title="All Programs"
          addButtonLabel="Add Program"
          keyExtractor={(item) => item.id}
        />
        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title={editingProgram ? 'Edit Program' : 'Create Program'}
          size="lg"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <Alert type="error" message={error} />}
            <Input
              label="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Bachelor of Science in Computer Science"
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
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Faculty (Optional)
                </label>
                <select
                  value={formData.faculty_id}
                  onChange={(e) => setFormData({ ...formData, faculty_id: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#446D6D] focus:ring-4 focus:ring-[#446D6D]/10 outline-none transition-all duration-200"
                >
                  <option value="">None</option>
                  {Array.isArray(faculties) &&
                    faculties.map((faculty: Faculty) => (
                      <option key={faculty.id} value={faculty.id}>
                        {faculty.name}
                      </option>
                    ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Class Level (Optional)
                </label>
                <select
                  value={formData.class_level_id}
                  onChange={(e) =>
                    setFormData({ ...formData, class_level_id: e.target.value })
                  }
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#446D6D] focus:ring-4 focus:ring-[#446D6D]/10 outline-none transition-all duration-200"
                >
                  <option value="">None</option>
                  {Array.isArray(classLevels) &&
                    classLevels.map((classLevel: ClassLevel) => (
                      <option key={classLevel.id} value={classLevel.id}>
                        {classLevel.name}
                      </option>
                    ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Degree"
                value={formData.degree}
                onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                placeholder="Bachelor of Science"
              />
              <Input
                label="Duration"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                placeholder="4 years"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Icon (Emoji)
                </label>
                <select
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#446D6D] focus:ring-4 focus:ring-[#446D6D]/10 outline-none transition-all duration-200 text-lg"
                >
                  <option value="">Select an icon</option>
                  {PROGRAM_ICONS.map((icon) => (
                    <option key={icon.value} value={icon.value}>
                      {icon.label}
                    </option>
                  ))}
                </select>
                {formData.icon && (
                  <div className="mt-2 text-center">
                    <span className="text-4xl">{formData.icon}</span>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
                <select
                  value={formData.difficulty}
                  onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#446D6D] focus:ring-4 focus:ring-[#446D6D]/10 outline-none transition-all duration-200"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                  <option value="expert">Expert</option>
                </select>
              </div>
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
                {editingProgram ? 'Update' : 'Create'}
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


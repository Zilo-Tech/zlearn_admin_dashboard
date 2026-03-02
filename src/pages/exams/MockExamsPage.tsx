import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../components/layout';
import {
  DataTable,
  Column,
  Button,
  Input,
  Modal,
  Alert,
  Badge,
} from '../../components/common';
import { ClipboardList } from 'lucide-react';
import {
  useGetMockExamsListQuery,
  useGetExamsQuery,
  useCreateMockExamMutation,
  useDeleteMockExamMutation,
} from '../../store/api/examsApi';
import type { MockExam } from '../../interfaces/exam';

export const MockExamsPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: mockExams = [], isLoading } = useGetMockExamsListQuery({});
  const { data: exams = [] } = useGetExamsQuery({});
  const [createMockExam, { isLoading: isCreating }] = useCreateMockExamMutation();
  const [deleteMockExam] = useDeleteMockExamMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    exam: '',
    title: '',
    description: '',
    duration_minutes: 60,
    total_marks: 100,
    passing_score: 50,
    number_of_questions: 20,
    is_timed: true,
    is_published: false,
  });

  const handleOpenModal = () => {
    setFormData({
      exam: exams[0]?.id ?? '',
      title: '',
      description: '',
      duration_minutes: 60,
      total_marks: 100,
      passing_score: 50,
      number_of_questions: 20,
      is_timed: true,
      is_published: false,
    });
    setError(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!formData.exam) {
      setError('Please select an exam package');
      return;
    }
    try {
      await createMockExam({
        exam: formData.exam,
        title: formData.title.trim(),
        description: formData.description || undefined,
        duration_minutes: formData.duration_minutes,
        total_marks: formData.total_marks,
        passing_score: formData.passing_score,
        number_of_questions: formData.number_of_questions,
        is_timed: formData.is_timed,
        is_published: formData.is_published,
      }).unwrap();
      handleCloseModal();
    } catch (err: any) {
      const msg = err?.data
        ? Object.entries(err.data)
            .map(([k, v]) => (Array.isArray(v) ? `${k}: ${v.join(', ')}` : `${k}: ${v}`))
            .join(' | ')
        : err?.message || 'Failed to create mock exam';
      setError(msg);
    }
  };

  const handleDelete = async (mock: MockExam) => {
    if (window.confirm(`Delete mock exam "${mock.title}"?`)) {
      try {
        await deleteMockExam(mock.id).unwrap();
      } catch {
        alert('Failed to delete mock exam');
      }
    }
  };

  const getExamTitle = (examId: string) =>
    exams.find((e) => e.id === examId)?.title ?? examId;

  const columns: Column<MockExam>[] = [
    {
      key: 'title',
      header: 'Mock Exam',
      render: (m) => (
        <div>
          <p className="font-medium text-gray-900">{m.title}</p>
          <p className="text-sm text-gray-500">{getExamTitle(m.exam)}</p>
        </div>
      ),
    },
    {
      key: 'duration',
      header: 'Duration',
      render: (m) => (
        <span className="text-gray-600">{m.duration_minutes ?? '—'} min</span>
      ),
    },
    {
      key: 'marks',
      header: 'Marks',
      render: (m) => (
        <span className="text-gray-600">
          {m.total_marks ?? '—'} / Pass: {m.passing_score ?? '—'}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (m) => (
        <Badge variant={m.is_published ? 'published' : 'draft'}>
          {m.is_published ? 'Published' : 'Draft'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: '',
      render: (m) => (
        <button
          onClick={() => navigate(`/admin/exams/exams/${m.exam}`)}
          className="text-zlearn-primary hover:text-zlearn-primaryHover font-medium text-sm"
        >
          Manage →
        </button>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Mock Exams</h1>
            <p className="text-gray-500 mt-1">Create and manage practice tests</p>
          </div>
          <Button size="sm" onClick={handleOpenModal} disabled={exams.length === 0}>
            <ClipboardList className="w-4 h-4" />
            Create Mock Exam
          </Button>
        </div>

        {exams.length === 0 && (
          <Alert type="info" message="Add an exam package first, then create mock exams for it." />
        )}

        {error && <Alert type="error" message={error} />}

        <DataTable
          data={mockExams}
          columns={columns}
          loading={isLoading}
          onAdd={exams.length > 0 ? handleOpenModal : undefined}
          onDelete={handleDelete}
          title="All Mock Exams"
          addButtonLabel="Create Mock Exam"
          keyExtractor={(m) => m.id}
        />

        <Modal isOpen={isModalOpen} onClose={handleCloseModal} title="Create Mock Exam" size="md">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Exam Package *</label>
              <select
                value={formData.exam}
                onChange={(e) => setFormData({ ...formData, exam: e.target.value })}
                className="w-full px-3 py-2.5 border border-surface-border rounded-lg focus:outline-none focus:ring-2 focus:ring-zlearn-primary/20 focus:border-zlearn-primary"
                required
              >
                <option value="">Select exam</option>
                {exams.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.title}
                  </option>
                ))}
              </select>
            </div>
            <Input
              label="Title *"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., JAMB Practice Test 1"
              required
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2.5 border border-surface-border rounded-lg focus:outline-none focus:ring-2 focus:ring-zlearn-primary/20"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Duration (min)"
                type="number"
                value={formData.duration_minutes}
                onChange={(e) =>
                  setFormData({ ...formData, duration_minutes: parseInt(e.target.value) || 0 })
                }
              />
              <Input
                label="Questions"
                type="number"
                value={formData.number_of_questions}
                onChange={(e) =>
                  setFormData({ ...formData, number_of_questions: parseInt(e.target.value) || 0 })
                }
              />
              <Input
                label="Total Marks"
                type="number"
                value={formData.total_marks}
                onChange={(e) =>
                  setFormData({ ...formData, total_marks: parseInt(e.target.value) || 0 })
                }
              />
              <Input
                label="Passing Score"
                type="number"
                value={formData.passing_score}
                onChange={(e) =>
                  setFormData({ ...formData, passing_score: parseInt(e.target.value) || 0 })
                }
              />
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_timed}
                onChange={(e) => setFormData({ ...formData, is_timed: e.target.checked })}
                className="w-4 h-4 text-zlearn-primary border-gray-300 rounded"
              />
              <span className="text-sm font-medium text-gray-700">Timed exam</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_published}
                onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                className="w-4 h-4 text-zlearn-primary border-gray-300 rounded"
              />
              <span className="text-sm font-medium text-gray-700">Publish immediately</span>
            </label>
            <div className="flex gap-3 pt-2">
              <Button type="submit" fullWidth loading={isCreating}>
                Create
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

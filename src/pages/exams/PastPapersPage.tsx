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
import { Upload } from 'lucide-react';
import {
  useGetPastPapersListQuery,
  useGetExamsQuery,
  useCreatePastPaperMutation,
  useDeletePastPaperMutation,
} from '../../store/api/examsApi';
import type { PastPaper } from '../../interfaces/exam';

export const PastPapersPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: pastPapers = [], isLoading } = useGetPastPapersListQuery({});
  const { data: examsData } = useGetExamsQuery({});
  const exams = examsData?.results ?? [];
  const [createPastPaper, { isLoading: isCreating }] = useCreatePastPaperMutation();
  const [deletePastPaper] = useDeletePastPaperMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showJsonTemplate, setShowJsonTemplate] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    exam: '',
    title: '',
    year: new Date().getFullYear(),
    exam_board: '',
    description: '',
    is_published: false,
    question_paper: null as File | null,
    answer_key: null as File | null,
    marking_scheme: null as File | null,
    solutions_pdf: null as File | null,
  });

  const handleOpenModal = () => {
    setFormData({
      exam: exams[0]?.id ?? '',
      title: '',
      year: new Date().getFullYear(),
      exam_board: '',
      description: '',
      is_published: false,
      question_paper: null,
      answer_key: null,
      marking_scheme: null,
      solutions_pdf: null,
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
    if (!formData.question_paper) {
      setError('Past Paper JSON file is required');
      return;
    }

    try {
      const file = formData.question_paper;
      const fileReader = new FileReader();

      fileReader.onload = async (event) => {
        try {
          const jsonContent = JSON.parse(event.target?.result as string);

          const payload: any = {
            exam: formData.exam,
            title: formData.title.trim(),
            year: formData.year,
            session: '',
            is_published: formData.is_published,
            content: jsonContent,
          };
          if (formData.exam_board) payload.exam_board = formData.exam_board;
          if (formData.description) payload.description = formData.description;

          await createPastPaper(payload).unwrap();
          handleCloseModal();
        } catch (err: any) {
          setError(err?.data ? JSON.stringify(err.data) : err?.message || 'Invalid JSON format in the uploaded file');
        }
      };

      fileReader.onerror = () => setError('Failed to read the file');
      fileReader.readAsText(file);

    } catch (err: any) {
      setError(err?.data ? JSON.stringify(err.data) : err?.message || 'Failed to initialize upload');
    }
  };

  const handleDelete = async (paper: PastPaper) => {
    if (window.confirm(`Delete past paper "${paper.title}"?`)) {
      try {
        await deletePastPaper(paper.id).unwrap();
      } catch {
        alert('Failed to delete past paper');
      }
    }
  };

  const getExamTitle = (examId: string) =>
    exams.find((e) => e.id === examId)?.title ?? examId;

  const columns: Column<PastPaper>[] = [
    {
      key: 'title',
      header: 'Past Paper',
      render: (p) => (
        <div>
          <p className="font-medium text-gray-900">{p.title}</p>
          <p className="text-sm text-gray-500">{getExamTitle(p.exam)} · {p.year}</p>
        </div>
      ),
    },
    {
      key: 'year',
      header: 'Year',
      render: (p) => <span className="text-gray-600">{p.year}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (p) => (
        <Badge variant={p.is_published ? 'published' : 'draft'}>
          {p.is_published ? 'Published' : 'Draft'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: '',
      render: (p) => (
        <button
          onClick={() => navigate(`/admin/exams/exams/${p.exam}`)}
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
            <h1 className="text-2xl font-semibold text-gray-900">Past Papers</h1>
            <p className="text-gray-500 mt-1">Upload and manage previous exam papers</p>
          </div>
          <Button size="sm" onClick={handleOpenModal} disabled={exams.length === 0}>
            <Upload className="w-4 h-4" />
            Upload Past Paper
          </Button>
        </div>

        {exams.length === 0 && (
          <Alert type="info" message="Add an exam package first, then upload past papers." />
        )}

        {error && <Alert type="error" message={error} />}

        <DataTable
          data={pastPapers}
          columns={columns}
          loading={isLoading}
          onAdd={exams.length > 0 ? handleOpenModal : undefined}
          onDelete={handleDelete}
          title="All Past Papers"
          addButtonLabel="Upload Past Paper"
          keyExtractor={(p) => p.id}
        />

        <Modal isOpen={isModalOpen} onClose={handleCloseModal} title="Upload Past Paper" size="md">
          <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
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
              placeholder="e.g., JAMB 2024 Mathematics"
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Year *"
                type="number"
                value={formData.year}
                onChange={(e) =>
                  setFormData({ ...formData, year: parseInt(e.target.value) || new Date().getFullYear() })
                }
              />
              <Input
                label="Exam Board"
                value={formData.exam_board}
                onChange={(e) => setFormData({ ...formData, exam_board: e.target.value })}
                placeholder="e.g., JAMB, WAEC"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2.5 border border-surface-border rounded-lg focus:outline-none focus:ring-2 focus:ring-zlearn-primary/20"
                rows={2}
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-sm font-medium text-gray-700">Past Paper (JSON) *</label>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowJsonTemplate(!showJsonTemplate);
                  }}
                  className="text-xs text-zlearn-primary hover:underline font-medium"
                >
                  {showJsonTemplate ? 'Hide JSON Template' : 'View JSON Template'}
                </button>
              </div>
              {showJsonTemplate && (
                <div className="mb-3 p-3 bg-surface-muted border border-surface-borderLight rounded-lg overflow-x-auto text-xs font-mono text-gray-700 max-h-48 overflow-y-auto">
                  <pre>{`{
  "instructions": "Answer all questions. You have 2 hours.",
  "total_marks": 7,
  "questions": [
    {
      "question_number": 1,
      "text": "What is the capital of France?",
      "type": "multiple_choice",
      "options": {
        "A": "London",
        "B": "Berlin",
        "C": "Paris",
        "D": "Madrid"
      },
      "correct_answer": "C",
      "marks": 2,
      "ai_explanation": "Paris is the capital."
    }
  ]
}`}</pre>
                </div>
              )}
              <input
                type="file"
                accept=".json,application/json"
                onChange={(e) =>
                  setFormData({ ...formData, question_paper: e.target.files?.[0] || null })
                }
                className="w-full px-3 py-2.5 border border-surface-border rounded-lg"
                required
              />
            </div>
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
                Upload
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

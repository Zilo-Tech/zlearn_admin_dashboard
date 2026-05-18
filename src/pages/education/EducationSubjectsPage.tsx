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
  useImportSubjectsMutation,
} from '../../store/api/educationApi';
import type { Subject } from '../../interfaces/education';
import { Alert } from '../../components/common/Alert';
import { Download, Upload as UploadIcon } from 'lucide-react';

export const EducationSubjectsPage: React.FC = () => {
  const { data: subjects = [], isLoading } = useGetSubjectsQuery({});
  const [createSubject] = useCreateSubjectMutation();
  const [updateSubject] = useUpdateSubjectMutation();
  const [deleteSubject] = useDeleteSubjectMutation();
  const [importSubjects, { isLoading: isImporting }] = useImportSubjectsMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    description: '',
    icon: '',
    color: '#3B82F6',
    is_active: true,
  });

  const handleOpenModal = (subject?: Subject) => {
    if (subject) {
      setEditingSubject(subject);
      setFormData({
        id: subject.id,
        name: subject.name,
        description: subject.description || '',
        icon: subject.icon || '',
        color: subject.color || '#3B82F6',
        is_active: subject.is_active,
      });
    } else {
      setEditingSubject(null);
      setFormData({
        id: '',
        name: '',
        description: '',
        icon: '',
        color: '#3B82F6',
        is_active: true,
      });
    }
    setError(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingSubject(null);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      if (editingSubject) {
        const { id, ...updateData } = formData;
        await updateSubject({ id: editingSubject.id, ...updateData }).unwrap();
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

  const handleDownloadSample = () => {
    const sampleData = [
      {
        "name": "Mathematics",
        "code": "MATH",
        "icon": "📐",
        "color": "#3B82F6",
        "description": "Complete study of numbers, quantities, and shapes from beginner to advanced.",
        "courses": [
          {
            "title": "Mathematics - Comprehensive Guide",
            "course_code": "MATH101",
            "description": "A fully detailed course covering all essential topics in Mathematics.",
            "course_type": "regular",
            "difficulty": "intermediate",
            "estimated_hours": 50,
            "learning_objectives": [
              "Master fundamental algebraic equations",
              "Understand geometric shapes and properties",
              "Apply mathematical formulas in real-world scenarios"
            ],
            "modules": [
              {
                "title": "Module 1: Algebra Fundamentals",
                "description": "Learn the basics of algebraic expressions and linear equations.",
                "order": 0,
                "estimated_hours": 10,
                "learning_objectives": [
                  "Solve linear equations with one variable",
                  "Simplify complex algebraic fractions"
                ],
                "lessons": [
                  {
                    "title": "Introduction to Linear Equations",
                    "description": "Understanding the structure of linear equations and basic operations.",
                    "content_type": "reading",
                    "order": 0,
                    "duration": "01:30:00",
                    "learning_objectives": [
                      "Define a linear equation",
                      "Solve for an unknown variable x"
                    ],
                    "sections": [
                      {
                        "title": "What is a linear equation?",
                        "section_type": "text",
                        "order": 0,
                        "text_content": "# Linear Equations\n\nA linear equation is an algebraic equation in which each term is either a constant or the product of a constant and a single variable.\n\n## Example Formula\nYou can write formulas using KaTeX formatting.\nFor example, the formula for a straight line is:\n$$y = mx + c$$\n\nWhere:\n- $m$ is the slope\n- $c$ is the y-intercept\n\n## Solving for x\nIf we have $2x + 3 = 11$:\n1. Subtract 3 from both sides: $2x = 8$\n2. Divide by 2: $x = 4$\n\nHere is a quadratic formula example in KaTeX:\n$$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$$",
                        "estimated_time_minutes": 20,
                        "is_published": true
                      },
                      {
                        "title": "Video: Solving Equations visually",
                        "section_type": "video",
                        "order": 1,
                        "video_url": "https://example.com/videos/algebra-intro.mp4",
                        "estimated_time_minutes": 15,
                        "is_published": true
                      }
                    ],
                    "resources": [
                      {
                        "title": "Algebra Practice Worksheet",
                        "description": "10 practice problems to test your understanding.",
                        "resource_type": "pdf",
                        "url": "https://example.com/resources/algebra-worksheet.pdf",
                        "order": 0
                      }
                    ]
                  },
                  {
                    "title": "Practice Quiz: Linear Equations",
                    "description": "Test your knowledge on the topics covered.",
                    "content_type": "quiz",
                    "order": 1,
                    "duration": "00:45:00",
                    "sections": [
                      {
                        "title": "Quiz Section",
                        "section_type": "quiz",
                        "order": 0,
                        "text_content": "Answer the following questions based on the lesson.",
                        "estimated_time_minutes": 45,
                        "is_published": true,
                        "quiz_questions": [
                          {
                            "text": "If $3x - 4 = 11$, what is the value of x?",
                            "order": 0,
                            "explanation": "Add 4 to both sides to get $3x = 15$, then divide by 3 to get $x = 5$.",
                            "options": [
                              {"text": "3", "is_correct": false, "order": 0},
                              {"text": "5", "is_correct": true, "order": 1},
                              {"text": "7", "is_correct": false, "order": 2}
                            ]
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ];

    const blob = new Blob([JSON.stringify(sampleData, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample_education_subjects.json';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setError(null);
      await importSubjects(file).unwrap();
      alert('Subjects imported successfully');
    } catch (err: any) {
      setError(err?.data?.error || err?.data?.message || 'Failed to import subjects');
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const columns: Column<Subject>[] = [
    { key: 'id', header: 'ID' },
    { key: 'name', header: 'Name' },
    {
      key: 'icon',
      header: 'Icon',
      render: (subject) => <span className="text-2xl">{subject.icon || '📚'}</span>,
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
    {
      key: 'is_active',
      header: 'Status',
      render: (subject) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            subject.is_active
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          {subject.is_active ? 'Active' : 'Inactive'}
        </span>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Subjects</h1>
          <div className="flex gap-3">
            <input
              type="file"
              accept=".json"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileUpload}
            />
            <Button
              variant="outline"
              onClick={handleDownloadSample}
              icon={<Download className="w-4 h-4" />}
            >
              Sample JSON
            </Button>
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              icon={<UploadIcon className="w-4 h-4" />}
              loading={isImporting}
            >
              Upload JSON
            </Button>
            <Button onClick={() => handleOpenModal()}>Add Subject</Button>
          </div>
        </div>

        {error && <Alert type="error" message={error} />}

        <DataTable
          data={subjects}
          columns={columns}
          loading={isLoading}
          onEdit={handleOpenModal}
          onDelete={handleDelete}
          title="All Subjects"
          keyExtractor={(item) => item.id}
        />

        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title={editingSubject ? 'Edit Subject' : 'Create Subject'}
          size="md"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <Alert type="error" message={error} />}
            <Input
              label="ID"
              value={formData.id}
              onChange={(e) => setFormData({ ...formData, id: e.target.value })}
              placeholder="mathematics"
              required
              disabled={!!editingSubject}
            />
            <Input
              label="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Mathematics"
              required
            />
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
            <Input
              label="Icon (Emoji)"
              value={formData.icon}
              onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
              placeholder="📐"
            />
            <Input
              label="Color"
              type="color"
              value={formData.color}
              onChange={(e) => setFormData({ ...formData, color: e.target.value })}
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


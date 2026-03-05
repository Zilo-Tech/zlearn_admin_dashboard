import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../components/layout';
import { Card, CardContent, Button, Badge, Input, Modal, Alert } from '../../components/common';
import { ChevronRight, Plus, Edit2, Trash2, ClipboardList } from 'lucide-react';
import {
  useGetExamQuery,
  useGetMockExamQuery,
  useGetMockExamQuestionsQuery,
  useCreateMockExamQuestionMutation,
  useUpdateMockExamQuestionMutation,
  useDeleteMockExamQuestionMutation,
} from '../../store/api/examsApi';
import type { MockExamQuestion } from '../../interfaces/exam';

export const MockExamDetailPage: React.FC = () => {
  const { examId, mockId } = useParams<{ examId: string; mockId: string }>();
  const navigate = useNavigate();
  const { data: exam } = useGetExamQuery(examId!, { skip: !examId });
  const { data: mockExam, isLoading: loadingMock } = useGetMockExamQuery(mockId!, { skip: !mockId });
  const { data: questions = [], isLoading: loadingQuestions } = useGetMockExamQuestionsQuery(mockId!, { skip: !mockId });

  const [createQuestion] = useCreateMockExamQuestionMutation();
  const [updateQuestion] = useUpdateMockExamQuestionMutation();
  const [deleteQuestion] = useDeleteMockExamQuestionMutation();

  const [error, setError] = useState<string | null>(null);
  const [modal, setModal] = useState<'add' | 'edit' | null>(null);
  const [editingQuestion, setEditingQuestion] = useState<MockExamQuestion | null>(null);
  const [form, setForm] = useState({
    question_text: '',
    question_type: 'multiple_choice' as 'multiple_choice' | 'true_false' | 'short_answer',
    order: 0,
    marks: 1,
    difficulty: 'medium' as 'easy' | 'medium' | 'hard',
    correct_answer: '',
    explanation: '',
    options: [{ text: '', is_correct: false }, { text: '', is_correct: false }],
  });

  if (loadingMock || !mockId) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-surface-border border-t-zlearn-primary" />
        </div>
      </AdminLayout>
    );
  }

  if (!mockExam) {
    return (
      <AdminLayout>
        <div className="text-center py-12 text-gray-500">Mock exam not found.</div>
        <Button variant="outline" onClick={() => navigate(`/admin/exams/exams/${examId}`)}>Back to Exam</Button>
      </AdminLayout>
    );
  }

  const openAdd = () => {
    setEditingQuestion(null);
    setForm({
      question_text: '',
      question_type: 'multiple_choice',
      order: questions.length,
      marks: 1,
      difficulty: 'medium',
      correct_answer: '',
      explanation: '',
      options: [{ text: '', is_correct: false }, { text: '', is_correct: false }],
    });
    setModal('add');
    setError(null);
  };

  const openEdit = (q: MockExamQuestion) => {
    setEditingQuestion(q);
    const opts = Array.isArray(q.options) && q.options.length
      ? q.options.map((o: any) => ({ text: typeof o === 'string' ? o : o.text || '', is_correct: typeof o === 'object' && o.is_correct }))
      : [{ text: '', is_correct: false }, { text: '', is_correct: false }];
    setForm({
      question_text: q.question_text || '',
      question_type: (q.question_type as any) || 'multiple_choice',
      order: q.order ?? 0,
      marks: q.marks ?? 1,
      difficulty: (q.difficulty as any) || 'medium',
      correct_answer: q.correct_answer || '',
      explanation: q.explanation || '',
      options: opts,
    });
    setModal('edit');
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const payload: any = {
        mock_exam: mockId,
        question_text: form.question_text.trim(),
        question_type: form.question_type,
        order: form.order,
        marks: form.marks,
        difficulty: form.difficulty,
        explanation: form.explanation || undefined,
        correct_answer: form.correct_answer || undefined,
        options: form.options.filter((o) => o.text.trim()).map((o) => ({ text: o.text.trim(), is_correct: o.is_correct })),
      };
      if (editingQuestion) {
        await updateQuestion({ id: editingQuestion.id, data: payload }).unwrap();
        setModal(null);
      } else {
        await createQuestion(payload).unwrap();
        setModal(null);
      }
    } catch (err: any) {
      setError(err?.data?.message || err?.message || 'Failed to save question');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this question?')) return;
    try {
      await deleteQuestion(id).unwrap();
    } catch (err: any) {
      setError(err?.data?.message || 'Failed to delete');
    }
  };

  const duration = mockExam.time_limit_minutes ?? mockExam.duration_minutes;
  const passing = mockExam.passing_marks ?? mockExam.passing_score;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <button onClick={() => navigate('/admin/exams/exams')} className="hover:text-zlearn-primary">Exam Packages</button>
          <ChevronRight className="w-4 h-4" />
          <button onClick={() => navigate(`/admin/exams/exams/${examId}`)} className="hover:text-zlearn-primary truncate max-w-[180px]">{exam?.title || 'Exam'}</button>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 font-medium truncate max-w-[200px]">{mockExam.title}</span>
        </div>

        <Card padding="lg">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">{mockExam.title}</h1>
              <p className="text-gray-500 text-sm mt-1">{mockExam.description}</p>
              <div className="flex items-center gap-3 mt-3">
                <Badge variant={mockExam.is_published ? 'published' : 'draft'}>{mockExam.is_published ? 'Published' : 'Draft'}</Badge>
                <span className="text-xs text-gray-500">{duration != null ? `${duration} min` : ''} · {mockExam.total_marks ?? 0} marks · Pass: {passing ?? '—'}</span>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={() => navigate(`/admin/exams/exams/${examId}`)}>Back to Exam</Button>
          </div>
        </Card>

        {error && <Alert type="error" message={error} />}

        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2">
            <ClipboardList className="w-5 h-5" />
            Questions ({questions.length})
          </h2>
          <Button size="sm" onClick={openAdd}>
            <Plus className="w-4 h-4" />
            Add Question
          </Button>
        </div>

        {loadingQuestions ? (
          <div className="py-8 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-2 border-surface-border border-t-zlearn-primary" /></div>
        ) : questions.length === 0 ? (
          <Card><CardContent className="text-center py-12 text-gray-500">No questions yet. Click &quot;Add Question&quot; to add practice questions.</CardContent></Card>
        ) : (
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-xs font-medium text-gray-500 uppercase border-b border-surface-borderLight">
                      <th className="pb-3 pl-4">#</th>
                      <th className="pb-3">Question</th>
                      <th className="pb-3">Type</th>
                      <th className="pb-3">Marks</th>
                      <th className="pb-3 text-right pr-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {questions.map((q, idx) => (
                      <tr key={q.id} className="border-b border-surface-borderLight last:border-0 hover:bg-surface-muted/30">
                        <td className="py-3 pl-4 text-gray-500">{idx + 1}</td>
                        <td className="py-3">
                          <p className="font-medium text-gray-900 line-clamp-2">{q.question_text}</p>
                        </td>
                        <td className="py-3 text-gray-600">{q.question_type}</td>
                        <td className="py-3 text-gray-600">{q.marks ?? 1}</td>
                        <td className="py-3 text-right pr-4">
                          <button onClick={() => openEdit(q)} className="p-2 text-gray-500 hover:text-zlearn-primary rounded-lg mr-1" title="Edit"><Edit2 className="w-4 h-4" /></button>
                          <button onClick={() => handleDelete(q.id)} className="p-2 text-gray-500 hover:text-red-600 rounded-lg" title="Delete"><Trash2 className="w-4 h-4" /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        <Modal isOpen={modal === 'add' || modal === 'edit'} onClose={() => setModal(null)} title={editingQuestion ? 'Edit Question' : 'Add Question'} size="lg">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Question text *</label>
              <textarea value={form.question_text} onChange={(e) => setForm({ ...form, question_text: e.target.value })} className="w-full px-3 py-2 border border-surface-border rounded-lg" rows={3} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select value={form.question_type} onChange={(e) => setForm({ ...form, question_type: e.target.value as any })} className="w-full px-3 py-2 border border-surface-border rounded-lg">
                  <option value="multiple_choice">Multiple choice</option>
                  <option value="true_false">True/False</option>
                  <option value="short_answer">Short answer</option>
                </select>
              </div>
              <Input label="Order" type="number" value={String(form.order)} onChange={(e) => setForm({ ...form, order: parseInt(e.target.value, 10) || 0 })} />
              <Input label="Marks" type="number" value={String(form.marks)} onChange={(e) => setForm({ ...form, marks: parseInt(e.target.value, 10) || 1 })} />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
                <select value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value as any })} className="w-full px-3 py-2 border border-surface-border rounded-lg">
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
            </div>
            {(form.question_type === 'multiple_choice' || form.question_type === 'true_false') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Options</label>
                {form.options.map((opt, i) => (
                  <div key={i} className="flex items-center gap-2 mb-2">
                    <input type="radio" name="correct" checked={opt.is_correct} onChange={() => setForm({ ...form, options: form.options.map((o, j) => ({ ...o, is_correct: j === i })) })} />
                    <Input value={opt.text} onChange={(e) => setForm({ ...form, options: form.options.map((o, j) => (j === i ? { ...o, text: e.target.value } : o)) })} placeholder={`Option ${i + 1}`} className="flex-1" />
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={() => setForm({ ...form, options: [...form.options, { text: '', is_correct: false }] })}>+ Option</Button>
              </div>
            )}
            {form.question_type === 'short_answer' && (
              <Input label="Correct answer" value={form.correct_answer} onChange={(e) => setForm({ ...form, correct_answer: e.target.value })} />
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Explanation (optional)</label>
              <textarea value={form.explanation} onChange={(e) => setForm({ ...form, explanation: e.target.value })} className="w-full px-3 py-2 border border-surface-border rounded-lg" rows={2} />
            </div>
            <div className="flex gap-2">
              <Button type="submit">{editingQuestion ? 'Save' : 'Create'}</Button>
              <Button type="button" variant="outline" onClick={() => setModal(null)}>Cancel</Button>
            </div>
          </form>
        </Modal>
      </div>
    </AdminLayout>
  );
};

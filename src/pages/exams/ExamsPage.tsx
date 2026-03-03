import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../components/layout';
import { DataTable, Column, Button, Input, Modal, Alert, Badge } from '../../components/common';
import { BookOpen, Calendar } from 'lucide-react';
import {
  useGetExamsQuery,
  useCreateExamMutation,
  useUpdateExamMutation,
  useDeleteExamMutation,
} from '../../store/api/examsApi';
import type { Exam } from '../../interfaces/exam';

const EXAM_STATUS_OPTIONS = [
  { value: '', label: 'All statuses' },
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
  { value: 'archived', label: 'Archived' },
  { value: 'suspended', label: 'Suspended' },
];
const EXAM_TYPE_OPTIONS = [
  { value: '', label: 'All types' },
  { value: 'university', label: 'University' },
  { value: 'professional', label: 'Professional' },
  { value: 'language', label: 'Language' },
  { value: 'standardized', label: 'Standardized' },
  { value: 'secondary', label: 'Secondary' },
  { value: 'other', label: 'Other' },
];

export const ExamsPage: React.FC = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<{ status: string; exam_type: string; search: string }>({
    status: '',
    exam_type: '',
    search: '',
  });
  const [page, setPage] = useState(1);
  const params: Record<string, string | number> = { page, page_size: 20 };
  if (filters.status) params.status = filters.status;
  if (filters.exam_type) params.exam_type = filters.exam_type;
  if (filters.search.trim()) params.search = filters.search.trim();
  const { data, isLoading } = useGetExamsQuery(params);
  const exams = data?.results ?? [];
  const pagination = data?.pagination;
  const [createExam, { isLoading: isCreating }] = useCreateExamMutation();
  const [updateExam, { isLoading: isUpdating }] = useUpdateExamMutation();
  const [deleteExam] = useDeleteExamMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExam, setEditingExam] = useState<Exam | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    short_description: '',
    exam_type: '',
    exam_board: '',
    country: '',
    exam_date: '',
    registration_deadline: '',
    thumbnail: null as File | null,
    banner_image: null as File | null,
    price: '0.00',
    currency: 'USD',
    is_free: false,
    discount_price: '',
    discount_start_date: '',
    discount_end_date: '',
    total_marks: 0,
    passing_score: 0,
    duration_minutes: 0,
    exam_format: '',
    number_of_sections: 0,
    scoring_system: '',
    instructions: '',
    requirements: '',
    max_students: '',
    featured: false,
    featured_order: 0,
    status: 'draft' as 'draft' | 'published' | 'archived' | 'suspended',
  });

  const handleOpenModal = (exam?: Exam) => {
    if (exam) {
      setEditingExam(exam);
      setFormData({
        title: exam.title,
        description: exam.description,
        short_description: exam.short_description || '',
        exam_type: exam.exam_type,
        exam_board: exam.exam_board || '',
        country: exam.country || '',
        exam_date: exam.exam_date ? new Date(exam.exam_date).toISOString().slice(0, 16) : '',
        registration_deadline: exam.registration_deadline
          ? new Date(exam.registration_deadline).toISOString().slice(0, 16)
          : '',
        thumbnail: null,
        banner_image: null,
        price: exam.price,
        currency: exam.currency,
        is_free: exam.is_free,
        discount_price: exam.discount_price || '',
        discount_start_date: exam.discount_start_date
          ? new Date(exam.discount_start_date).toISOString().slice(0, 16)
          : '',
        discount_end_date: exam.discount_end_date
          ? new Date(exam.discount_end_date).toISOString().slice(0, 16)
          : '',
        total_marks: exam.total_marks || 0,
        passing_score: exam.passing_score || 0,
        duration_minutes: exam.duration_minutes || 0,
        exam_format: exam.exam_format || '',
        number_of_sections: exam.number_of_sections || 0,
        scoring_system: exam.scoring_system || '',
        instructions: exam.instructions || '',
        requirements: exam.requirements || '',
        max_students: exam.max_students ? String(exam.max_students) : '',
        featured: exam.featured,
        featured_order: exam.featured_order || 0,
        status: exam.status,
      });
    } else {
      setEditingExam(null);
      setFormData({
        title: '',
        description: '',
        short_description: '',
        exam_type: '',
        exam_board: '',
        country: '',
        exam_date: '',
        registration_deadline: '',
        thumbnail: null,
        banner_image: null,
        price: '0.00',
        currency: 'USD',
        is_free: false,
        discount_price: '',
        discount_start_date: '',
        discount_end_date: '',
        total_marks: 0,
        passing_score: 0,
        duration_minutes: 0,
        exam_format: '',
        number_of_sections: 0,
        scoring_system: '',
        instructions: '',
        requirements: '',
        max_students: '',
        featured: false,
        featured_order: 0,
        status: 'draft',
      });
    }
    setError(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingExam(null);
    setError(null);
  };

  const prepareExamData = (data: typeof formData): FormData | any => {
    const hasFiles = data.thumbnail || data.banner_image;

    if (hasFiles) {
      const formDataObj = new FormData();
      formDataObj.append('title', data.title.trim());
      formDataObj.append('description', data.description.trim());
      if (data.short_description) formDataObj.append('short_description', data.short_description.trim());
      formDataObj.append('exam_type', data.exam_type);
      if (data.exam_board) formDataObj.append('exam_board', data.exam_board);
      if (data.country) formDataObj.append('country', data.country);
      if (data.exam_date) formDataObj.append('exam_date', new Date(data.exam_date).toISOString());
      if (data.registration_deadline)
        formDataObj.append('registration_deadline', new Date(data.registration_deadline).toISOString());
      if (data.thumbnail) formDataObj.append('thumbnail', data.thumbnail);
      if (data.banner_image) formDataObj.append('banner_image', data.banner_image);
      formDataObj.append('price', data.price);
      formDataObj.append('currency', data.currency);
      formDataObj.append('is_free', String(data.is_free));
      if (data.discount_price) formDataObj.append('discount_price', data.discount_price);
      if (data.discount_start_date)
        formDataObj.append('discount_start_date', new Date(data.discount_start_date).toISOString());
      if (data.discount_end_date)
        formDataObj.append('discount_end_date', new Date(data.discount_end_date).toISOString());
      if (data.total_marks) formDataObj.append('total_marks', String(data.total_marks));
      if (data.passing_score) formDataObj.append('passing_score', String(data.passing_score));
      if (data.duration_minutes) formDataObj.append('duration_minutes', String(data.duration_minutes));
      if (data.exam_format) formDataObj.append('exam_format', data.exam_format);
      if (data.number_of_sections) formDataObj.append('number_of_sections', String(data.number_of_sections));
      if (data.scoring_system) formDataObj.append('scoring_system', data.scoring_system);
      if (data.instructions) formDataObj.append('instructions', data.instructions);
      if (data.requirements) formDataObj.append('requirements', data.requirements);
      if (data.max_students) formDataObj.append('max_students', data.max_students);
      formDataObj.append('featured', String(data.featured));
      if (data.featured_order) formDataObj.append('featured_order', String(data.featured_order));
      formDataObj.append('status', data.status);
      return formDataObj;
    }

    const payload: any = {
      title: data.title.trim(),
      description: data.description.trim(),
      exam_type: data.exam_type,
      price: data.price,
      currency: data.currency,
      is_free: data.is_free,
      featured: data.featured,
      status: data.status,
    };

    if (data.short_description) payload.short_description = data.short_description.trim();
    if (data.exam_board) payload.exam_board = data.exam_board;
    if (data.country) payload.country = data.country;
    if (data.exam_date) payload.exam_date = new Date(data.exam_date).toISOString();
    if (data.registration_deadline)
      payload.registration_deadline = new Date(data.registration_deadline).toISOString();
    if (data.discount_price) payload.discount_price = data.discount_price;
    if (data.discount_start_date)
      payload.discount_start_date = new Date(data.discount_start_date).toISOString();
    if (data.discount_end_date)
      payload.discount_end_date = new Date(data.discount_end_date).toISOString();
    if (data.total_marks) payload.total_marks = data.total_marks;
    if (data.passing_score) payload.passing_score = data.passing_score;
    if (data.duration_minutes) payload.duration_minutes = data.duration_minutes;
    if (data.exam_format) payload.exam_format = data.exam_format;
    if (data.number_of_sections) payload.number_of_sections = data.number_of_sections;
    if (data.scoring_system) payload.scoring_system = data.scoring_system;
    if (data.instructions) payload.instructions = data.instructions;
    if (data.requirements) payload.requirements = data.requirements;
    if (data.max_students) payload.max_students = parseInt(data.max_students, 10);
    if (data.featured_order) payload.featured_order = data.featured_order;

    return payload;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      if (editingExam) {
        await updateExam({ id: editingExam.id, data: prepareExamData(formData) }).unwrap();
      } else {
        await createExam(prepareExamData(formData)).unwrap();
      }
      handleCloseModal();
    } catch (err: any) {
      if (err?.data) {
        const errorMessages: string[] = [];
        Object.keys(err.data).forEach((key) => {
          if (Array.isArray(err.data[key])) {
            errorMessages.push(`${key}: ${err.data[key].join(', ')}`);
          } else {
            errorMessages.push(`${key}: ${err.data[key]}`);
          }
        });
        setError(errorMessages.join(' | ') || 'An error occurred');
      } else {
        setError(err?.message || 'An error occurred');
      }
    }
  };

  const handleDelete = async (exam: Exam) => {
    if (window.confirm(`Are you sure you want to delete "${exam.title}"?`)) {
      try {
        await deleteExam(exam.id).unwrap();
      } catch (err: any) {
        alert(err?.data?.message || 'Failed to delete exam');
      }
    }
  };

  const columns: Column<Exam>[] = [
    {
      key: 'exam',
      header: 'Exam',
      render: (exam) => (
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-surface-muted flex-shrink-0 overflow-hidden">
            {exam.thumbnail ? (
              <img src={exam.thumbnail} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <BookOpen className="w-6 h-6" />
              </div>
            )}
          </div>
          <div>
            <p className="font-medium text-gray-900">{exam.title}</p>
            <p className="text-sm text-gray-500">{exam.exam_type}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'exam_date',
      header: 'Exam Date',
      render: (exam) => (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="w-4 h-4" />
          {exam.exam_date ? new Date(exam.exam_date).toLocaleDateString() : '—'}
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (exam) => <Badge variant={exam.status}>{exam.status}</Badge>,
    },
    {
      key: 'price',
      header: 'Price',
      render: (exam) => (
        <span className="font-medium text-gray-900">
          {exam.is_free ? 'Free' : `${exam.currency} ${exam.price}`}
        </span>
      ),
    },
    {
      key: 'enrollment_count',
      header: 'Enrollments',
      render: (exam) => <span className="text-gray-600">{exam.enrollment_count ?? 0}</span>,
    },
    {
      key: 'actions',
      header: '',
      render: (exam) => (
        <button
          onClick={() => navigate(`/admin/exams/exams/${exam.id}`)}
          className="text-zlearn-primary hover:text-zlearn-primaryHover font-medium text-sm transition-colors duration-150"
        >
          Manage →
        </button>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Exam Packages</h1>
          <p className="text-gray-500 mt-1">Manage exam preparation packages (JAMB, SAT, GCE, etc.)</p>
        </div>

        {error && <Alert type="error" message={error} />}

        <div className="flex flex-wrap items-center gap-3 mb-4">
          <Input
            placeholder="Search title, description, exam code..."
            value={filters.search}
            onChange={(e) => { setFilters((f) => ({ ...f, search: e.target.value })); setPage(1); }}
            className="min-w-[200px] max-w-xs"
          />
          <select
            value={filters.status}
            onChange={(e) => { setFilters((f) => ({ ...f, status: e.target.value })); setPage(1); }}
            className="px-3 py-2 border border-surface-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zlearn-primary/20 focus:border-zlearn-primary"
          >
            {EXAM_STATUS_OPTIONS.map((o) => (
              <option key={o.value || 'all'} value={o.value}>{o.label}</option>
            ))}
          </select>
          <select
            value={filters.exam_type}
            onChange={(e) => { setFilters((f) => ({ ...f, exam_type: e.target.value })); setPage(1); }}
            className="px-3 py-2 border border-surface-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zlearn-primary/20 focus:border-zlearn-primary"
          >
            {EXAM_TYPE_OPTIONS.map((o) => (
              <option key={o.value || 'all'} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        <DataTable
          data={exams}
          columns={columns}
          loading={isLoading}
          onAdd={() => handleOpenModal()}
          onEdit={handleOpenModal}
          onDelete={handleDelete}
          title="All Exam Packages"
          addButtonLabel="Add Exam Package"
          keyExtractor={(item) => item.id}
        />
        {pagination && pagination.total_pages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-gray-500">
              Page {pagination.current_page} of {pagination.total_pages} ({pagination.count} total)
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={!pagination.has_previous}
                className="px-3 py-1.5 text-sm border border-surface-border rounded-lg disabled:opacity-50 hover:bg-surface-muted"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={() => setPage((p) => p + 1)}
                disabled={!pagination.has_next}
                className="px-3 py-1.5 text-sm border border-surface-border rounded-lg disabled:opacity-50 hover:bg-surface-muted"
              >
                Next
              </button>
            </div>
          </div>
        )}

        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title={editingExam ? 'Edit Exam Package' : 'Create Exam Package'}
          size="xl"
        >
          <form onSubmit={handleSubmit} className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
            <div className="space-y-4 border-b border-surface-borderLight pb-6">
              <h3 className="text-base font-semibold text-gray-900">Basic Information</h3>
              <Input
                label="Title *"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., JAMB UTME 2026"
                required
              />
              <Input
                label="Short Description"
                value={formData.short_description}
                onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                placeholder="Brief overview"
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2.5 border border-surface-border rounded-lg focus:outline-none focus:ring-2 focus:ring-zlearn-primary/20 focus:border-zlearn-primary transition-colors duration-150"
                  rows={4}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Exam Type *"
                  value={formData.exam_type}
                  onChange={(e) => setFormData({ ...formData, exam_type: e.target.value })}
                  placeholder="JAMB, SAT, GCE, WAEC, etc."
                  required
                />
                <Input
                  label="Exam Board"
                  value={formData.exam_board}
                  onChange={(e) => setFormData({ ...formData, exam_board: e.target.value })}
                  placeholder="e.g., JAMB, College Board"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Country"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  placeholder="e.g., Nigeria, USA"
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2.5 border border-surface-border rounded-lg focus:outline-none focus:ring-2 focus:ring-zlearn-primary/20 focus:border-zlearn-primary transition-colors duration-150"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-4 border-b border-surface-borderLight pb-6">
              <h3 className="text-base font-semibold text-gray-900">Exam Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Exam Date"
                  type="datetime-local"
                  value={formData.exam_date}
                  onChange={(e) => setFormData({ ...formData, exam_date: e.target.value })}
                />
                <Input
                  label="Registration Deadline"
                  type="datetime-local"
                  value={formData.registration_deadline}
                  onChange={(e) => setFormData({ ...formData, registration_deadline: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <Input
                  label="Total Marks"
                  type="number"
                  value={formData.total_marks}
                  onChange={(e) => setFormData({ ...formData, total_marks: parseInt(e.target.value) || 0 })}
                />
                <Input
                  label="Passing Score"
                  type="number"
                  value={formData.passing_score}
                  onChange={(e) => setFormData({ ...formData, passing_score: parseInt(e.target.value) || 0 })}
                />
                <Input
                  label="Duration (Minutes)"
                  type="number"
                  value={formData.duration_minutes}
                  onChange={(e) => setFormData({ ...formData, duration_minutes: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Exam Format"
                  value={formData.exam_format}
                  onChange={(e) => setFormData({ ...formData, exam_format: e.target.value })}
                  placeholder="e.g., CBT, Paper-based"
                />
                <Input
                  label="Number of Sections"
                  type="number"
                  value={formData.number_of_sections}
                  onChange={(e) => setFormData({ ...formData, number_of_sections: parseInt(e.target.value) || 0 })}
                />
              </div>
              <Input
                label="Scoring System"
                value={formData.scoring_system}
                onChange={(e) => setFormData({ ...formData, scoring_system: e.target.value })}
                placeholder="e.g., 400 points total"
              />
            </div>

            <div className="space-y-4 border-b border-surface-borderLight pb-6">
              <h3 className="text-base font-semibold text-gray-900">Media Files</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Thumbnail</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFormData({ ...formData, thumbnail: e.target.files?.[0] || null })}
                    className="w-full px-3 py-2.5 border border-surface-border rounded-lg focus:outline-none focus:ring-2 focus:ring-zlearn-primary/20 focus:border-zlearn-primary transition-colors duration-150"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Banner Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFormData({ ...formData, banner_image: e.target.files?.[0] || null })}
                    className="w-full px-3 py-2.5 border border-surface-border rounded-lg focus:outline-none focus:ring-2 focus:ring-zlearn-primary/20 focus:border-zlearn-primary transition-colors duration-150"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4 border-b border-surface-borderLight pb-6">
              <h3 className="text-base font-semibold text-gray-900">Pricing</h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Currency</label>
                  <select
                    value={formData.currency}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                    className="w-full px-3 py-2.5 border border-surface-border rounded-lg focus:outline-none focus:ring-2 focus:ring-zlearn-primary/20 focus:border-zlearn-primary transition-colors duration-150"
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="NGN">NGN</option>
                  </select>
                </div>
                <Input
                  label="Price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  disabled={formData.is_free}
                />
                <Input
                  label="Discount Price"
                  type="number"
                  step="0.01"
                  value={formData.discount_price}
                  onChange={(e) => setFormData({ ...formData, discount_price: e.target.value })}
                  disabled={formData.is_free}
                />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_free}
                  onChange={(e) => setFormData({ ...formData, is_free: e.target.checked })}
                  className="w-4 h-4 text-zlearn-primary border-gray-300 rounded focus:ring-zlearn-primary/20"
                />
                <span className="text-sm font-medium text-gray-700">Free Exam Package</span>
              </label>
            </div>

            <div className="space-y-4 border-b border-surface-borderLight pb-6">
              <h3 className="text-base font-semibold text-gray-900">Additional Details</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Instructions</label>
                <textarea
                  value={formData.instructions}
                  onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                  className="w-full px-3 py-2.5 border border-surface-border rounded-lg focus:outline-none focus:ring-2 focus:ring-zlearn-primary/20 focus:border-zlearn-primary transition-colors duration-150"
                  rows={3}
                  placeholder="Exam instructions and guidelines"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Requirements</label>
                <textarea
                  value={formData.requirements}
                  onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                  className="w-full px-3 py-2.5 border border-surface-border rounded-lg focus:outline-none focus:ring-2 focus:ring-zlearn-primary/20 focus:border-zlearn-primary transition-colors duration-150"
                  rows={3}
                  placeholder="Prerequisites for taking this exam"
                />
              </div>
              <Input
                label="Max Students"
                type="number"
                value={formData.max_students}
                onChange={(e) => setFormData({ ...formData, max_students: e.target.value })}
                placeholder="Leave empty for unlimited"
              />
            </div>

            <div className="flex gap-3">
              <Button type="submit" fullWidth loading={isCreating || isUpdating}>
                {editingExam ? 'Update' : 'Create'}
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

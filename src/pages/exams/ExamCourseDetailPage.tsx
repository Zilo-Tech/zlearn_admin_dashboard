import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../components/layout';
import { Card, CardHeader, CardContent, Button, Badge, Input, Modal, Alert } from '../../components/common';
import {
  ChevronRight,
  ChevronDown,
  Plus,
  Edit2,
  Trash2,
  Layers,
  FileText,
  Folder,
  BookOpen,
} from 'lucide-react';
import {
  useGetExamQuery,
  useGetExamCourseQuery,
  useGetCourseModulesQuery,
  useGetModuleLessonsQuery,
  useGetLessonSectionsQuery,
  useGetLessonResourcesQuery,
  useCreateExamModuleMutation,
  useUpdateExamModuleMutation,
  useDeleteExamModuleMutation,
  useCreateExamLessonMutation,
  useUpdateExamLessonMutation,
  useDeleteExamLessonMutation,
  useCreateExamSectionMutation,
  useUpdateExamSectionMutation,
  useDeleteExamSectionMutation,
  useCreateExamResourceMutation,
  useDeleteExamResourceMutation,
} from '../../store/api/examsApi';
import type { ExamModule, ExamLesson, ExamLessonSection } from '../../interfaces/exam';

export const ExamCourseDetailPage: React.FC = () => {
  const { examId, courseId } = useParams<{ examId: string; courseId: string }>();
  const navigate = useNavigate();
  const { data: exam } = useGetExamQuery(examId!, { skip: !examId });
  const { data: course, isLoading: loadingCourse } = useGetExamCourseQuery(courseId!, { skip: !courseId });
  const { data: modules = [], isLoading: loadingModules } = useGetCourseModulesQuery(courseId!, { skip: !courseId });

  const [createModule] = useCreateExamModuleMutation();
  const [updateModule] = useUpdateExamModuleMutation();
  const [deleteModule] = useDeleteExamModuleMutation();
  const [createLesson] = useCreateExamLessonMutation();
  const [updateLesson] = useUpdateExamLessonMutation();
  const [deleteLesson] = useDeleteExamLessonMutation();
  const [createSection] = useCreateExamSectionMutation();
  const [updateSection] = useUpdateExamSectionMutation();
  const [deleteSection] = useDeleteExamSectionMutation();
  const [createResource] = useCreateExamResourceMutation();
  const [deleteResource] = useDeleteExamResourceMutation();

  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({});
  const [expandedLessons, setExpandedLessons] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<string | null>(null);
  const [creatingModule, setCreatingModule] = useState(false);
  const [creatingLesson, setCreatingLesson] = useState<string | null>(null);
  const [creatingSection, setCreatingSection] = useState<string | null>(null);
  const [creatingResource, setCreatingResource] = useState<string | null>(null);
  const [editingModule, setEditingModule] = useState<ExamModule | null>(null);
  const [editingLesson, setEditingLesson] = useState<ExamLesson | null>(null);
  const [editingSection, setEditingSection] = useState<ExamLessonSection | null>(null);
  const [moduleForm, setModuleForm] = useState({ title: '', description: '', order: 0, is_published: true });
  const [lessonForm, setLessonForm] = useState({ title: '', description: '', order: 0, lesson_type: 'mixed', is_published: true });
  const [sectionForm, setSectionForm] = useState({ title: '', section_type: 'text', order: 0, text_content: '' });
  const [resourceForm, setResourceForm] = useState({ title: '', resource_type: 'link', order: 0, url: '' });

  const toggleModule = (id: string) => setExpandedModules((p) => ({ ...p, [id]: !p[id] }));
  const toggleLesson = (id: string) => setExpandedLessons((p) => ({ ...p, [id]: !p[id] }));

  if (loadingCourse || !courseId) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-surface-border border-t-zlearn-primary" />
        </div>
      </AdminLayout>
    );
  }

  if (!course) {
    return (
      <AdminLayout>
        <div className="text-center py-12 text-gray-500">Course not found.</div>
        <Button variant="outline" onClick={() => navigate(`/admin/exams/exams/${examId}`)}>Back to Exam</Button>
      </AdminLayout>
    );
  }

  const handleCreateModule = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await createModule({
        exam_course: courseId!,
        title: moduleForm.title.trim(),
        description: moduleForm.description || undefined,
        order: moduleForm.order,
        is_published: moduleForm.is_published,
      }).unwrap();
      setCreatingModule(false);
      setModuleForm({ title: '', description: '', order: modules.length, is_published: true });
    } catch (err: any) {
      setError(err?.data?.message || err?.message || 'Failed to create module');
    }
  };

  const handleCreateLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!creatingLesson) return;
    setError(null);
    try {
      await createLesson({
        module: creatingLesson,
        title: lessonForm.title.trim(),
        description: lessonForm.description || undefined,
        order: lessonForm.order,
        lesson_type: lessonForm.lesson_type,
        is_published: lessonForm.is_published,
      }).unwrap();
      setCreatingLesson(null);
      setLessonForm({ title: '', description: '', order: 0, lesson_type: 'mixed', is_published: true });
    } catch (err: any) {
      setError(err?.data?.message || err?.message || 'Failed to create lesson');
    }
  };

  const handleCreateSection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!creatingSection) return;
    setError(null);
    try {
      await createSection({
        lesson: creatingSection,
        title: sectionForm.title.trim(),
        section_type: sectionForm.section_type,
        order: sectionForm.order,
        text_content: sectionForm.text_content || undefined,
      } as any).unwrap();
      setCreatingSection(null);
      setSectionForm({ title: '', section_type: 'text', order: 0, text_content: '' });
    } catch (err: any) {
      setError(err?.data?.message || err?.message || 'Failed to create section');
    }
  };

  const handleCreateResource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!creatingResource) return;
    setError(null);
    try {
      await createResource({
        lesson: creatingResource,
        title: resourceForm.title.trim(),
        resource_type: resourceForm.resource_type,
        order: resourceForm.order,
        url: resourceForm.url || undefined,
      } as any).unwrap();
      setCreatingResource(null);
      setResourceForm({ title: '', resource_type: 'link', order: 0, url: '' });
    } catch (err: any) {
      setError(err?.data?.message || err?.message || 'Failed to create resource');
    }
  };

  const handleDeleteModule = async (id: string) => {
    if (!window.confirm('Delete this module and all its lessons?')) return;
    try {
      await deleteModule(id).unwrap();
    } catch (err: any) {
      setError(err?.data?.message || 'Failed to delete');
    }
  };

  const handleDeleteLesson = async (id: string) => {
    if (!window.confirm('Delete this lesson?')) return;
    try {
      await deleteLesson(id).unwrap();
    } catch (err: any) {
      setError(err?.data?.message || 'Failed to delete');
    }
  };

  const handleDeleteSection = async (id: string) => {
    if (!window.confirm('Delete this section?')) return;
    try {
      await deleteSection(id).unwrap();
    } catch (err: any) {
      setError(err?.data?.message || 'Failed to delete');
    }
  };

  const handleDeleteResource = async (id: string) => {
    if (!window.confirm('Delete this resource?')) return;
    try {
      await deleteResource(id).unwrap();
    } catch (err: any) {
      setError(err?.data?.message || 'Failed to delete');
    }
  };

  const handleUpdateModule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingModule) return;
    setError(null);
    try {
      await updateModule({ id: editingModule.id, data: { title: moduleForm.title.trim(), description: moduleForm.description || undefined, order: moduleForm.order, is_published: moduleForm.is_published } }).unwrap();
      setEditingModule(null);
    } catch (err: any) {
      setError(err?.data?.message || 'Failed to update');
    }
  };

  const handleUpdateLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLesson) return;
    setError(null);
    try {
      await updateLesson({ id: editingLesson.id, data: { title: lessonForm.title.trim(), description: lessonForm.description || undefined, order: lessonForm.order, lesson_type: lessonForm.lesson_type, is_published: lessonForm.is_published } }).unwrap();
      setEditingLesson(null);
    } catch (err: any) {
      setError(err?.data?.message || 'Failed to update');
    }
  };

  const handleUpdateSection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSection) return;
    setError(null);
    try {
      await updateSection({ id: editingSection.id, data: { title: sectionForm.title.trim(), section_type: sectionForm.section_type, order: sectionForm.order, text_content: sectionForm.text_content || undefined } as any }).unwrap();
      setEditingSection(null);
    } catch (err: any) {
      setError(err?.data?.message || 'Failed to update');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <button onClick={() => navigate('/admin/exams/exams')} className="hover:text-zlearn-primary">Exam Packages</button>
          <ChevronRight className="w-4 h-4" />
          <button onClick={() => navigate(`/admin/exams/exams/${examId}`)} className="hover:text-zlearn-primary truncate max-w-[180px]">{exam?.title || 'Exam'}</button>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 font-medium truncate max-w-[200px]">{course.title}</span>
        </div>

        <Card padding="lg">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">{course.title}</h1>
              <p className="text-gray-500 text-sm mt-1">{course.course_code || course.description}</p>
              <div className="flex items-center gap-3 mt-3">
                <Badge variant={course.is_published ? 'published' : 'draft'}>{course.is_published ? 'Published' : 'Draft'}</Badge>
                <span className="text-xs text-gray-500">{course.total_modules ?? modules.length} modules</span>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={() => navigate(`/admin/exams/exams/${examId}`)}>Back to Exam</Button>
          </div>
        </Card>

        {error && <Alert type="error" message={error} />}

        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2">
            <Layers className="w-5 h-5" />
            Curriculum – Modules ({modules.length})
          </h2>
          <Button size="sm" onClick={() => { setCreatingModule(true); setModuleForm({ title: '', description: '', order: modules.length, is_published: true }); }}>
            <Plus className="w-4 h-4" />
            Add Module
          </Button>
        </div>

        {loadingModules ? (
          <div className="py-8 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-2 border-surface-border border-t-zlearn-primary" /></div>
        ) : modules.length === 0 ? (
          <Card><CardContent className="text-center py-12 text-gray-500">No modules yet. Click &quot;Add Module&quot; to build the curriculum.</CardContent></Card>
        ) : (
          <div className="space-y-4">
            {modules.map((module) => (
              <ModuleCard
                key={module.id}
                module={module}
                isExpanded={!!expandedModules[module.id]}
                onToggle={() => toggleModule(module.id)}
                onEdit={() => { setEditingModule(module); setModuleForm({ title: module.title, description: module.description || '', order: module.order, is_published: module.is_published ?? true }); }}
                onDelete={() => handleDeleteModule(module.id)}
                onCreateLesson={() => { setCreatingLesson(module.id); setLessonForm({ title: '', description: '', order: 0, lesson_type: 'mixed', is_published: true }); }}
                onCreateSection={(lessonId) => { setCreatingSection(lessonId); setSectionForm({ title: '', section_type: 'text', order: 0, text_content: '' }); }}
                onCreateResource={(lessonId) => { setCreatingResource(lessonId); setResourceForm({ title: '', resource_type: 'link', order: 0, url: '' }); }}
                onDeleteLesson={handleDeleteLesson}
                onDeleteSection={handleDeleteSection}
                onDeleteResource={handleDeleteResource}
                expandedLessons={expandedLessons}
                onToggleLesson={toggleLesson}
                onEditLesson={(l) => { setEditingLesson(l); setLessonForm({ title: l.title, description: l.description || '', order: l.order, lesson_type: l.lesson_type || 'mixed', is_published: l.is_published ?? true }); }}
                onEditSection={(s) => { setEditingSection(s); setSectionForm({ title: s.title, section_type: s.section_type, order: s.order, text_content: (s as any).text_content || '' }); }}
              />
            ))}
          </div>
        )}

        {/* Create Module Modal */}
        <Modal isOpen={creatingModule} onClose={() => setCreatingModule(false)} title="Add Module" size="md">
          <form onSubmit={handleCreateModule} className="space-y-4">
            <Input label="Title" value={moduleForm.title} onChange={(e) => setModuleForm({ ...moduleForm, title: e.target.value })} required />
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Description</label><textarea value={moduleForm.description} onChange={(e) => setModuleForm({ ...moduleForm, description: e.target.value })} className="w-full px-3 py-2 border border-surface-border rounded-lg" rows={2} /></div>
            <Input label="Order" type="number" value={String(moduleForm.order)} onChange={(e) => setModuleForm({ ...moduleForm, order: parseInt(e.target.value, 10) || 0 })} />
            <label className="flex items-center gap-2"><input type="checkbox" checked={moduleForm.is_published} onChange={(e) => setModuleForm({ ...moduleForm, is_published: e.target.checked })} /> Published</label>
            <div className="flex gap-2"><Button type="submit">Create</Button><Button type="button" variant="outline" onClick={() => setCreatingModule(false)}>Cancel</Button></div>
          </form>
        </Modal>

        {/* Edit Module Modal */}
        <Modal isOpen={!!editingModule} onClose={() => setEditingModule(null)} title="Edit Module" size="md">
          <form onSubmit={handleUpdateModule} className="space-y-4">
            <Input label="Title" value={moduleForm.title} onChange={(e) => setModuleForm({ ...moduleForm, title: e.target.value })} required />
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Description</label><textarea value={moduleForm.description} onChange={(e) => setModuleForm({ ...moduleForm, description: e.target.value })} className="w-full px-3 py-2 border border-surface-border rounded-lg" rows={2} /></div>
            <Input label="Order" type="number" value={String(moduleForm.order)} onChange={(e) => setModuleForm({ ...moduleForm, order: parseInt(e.target.value, 10) || 0 })} />
            <label className="flex items-center gap-2"><input type="checkbox" checked={moduleForm.is_published} onChange={(e) => setModuleForm({ ...moduleForm, is_published: e.target.checked })} /> Published</label>
            <div className="flex gap-2"><Button type="submit">Save</Button><Button type="button" variant="outline" onClick={() => setEditingModule(null)}>Cancel</Button></div>
          </form>
        </Modal>

        {/* Create Lesson Modal */}
        <Modal isOpen={!!creatingLesson} onClose={() => setCreatingLesson(null)} title="Add Lesson" size="md">
          <form onSubmit={handleCreateLesson} className="space-y-4">
            <Input label="Title" value={lessonForm.title} onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })} required />
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Description</label><textarea value={lessonForm.description} onChange={(e) => setLessonForm({ ...lessonForm, description: e.target.value })} className="w-full px-3 py-2 border border-surface-border rounded-lg" rows={2} /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Type</label><select value={lessonForm.lesson_type} onChange={(e) => setLessonForm({ ...lessonForm, lesson_type: e.target.value })} className="w-full px-3 py-2 border border-surface-border rounded-lg"><option value="video">Video</option><option value="reading">Reading</option><option value="practice">Practice</option><option value="quiz">Quiz</option><option value="mixed">Mixed</option></select></div>
            <Input label="Order" type="number" value={String(lessonForm.order)} onChange={(e) => setLessonForm({ ...lessonForm, order: parseInt(e.target.value, 10) || 0 })} />
            <label className="flex items-center gap-2"><input type="checkbox" checked={lessonForm.is_published} onChange={(e) => setLessonForm({ ...lessonForm, is_published: e.target.checked })} /> Published</label>
            <div className="flex gap-2"><Button type="submit">Create</Button><Button type="button" variant="outline" onClick={() => setCreatingLesson(null)}>Cancel</Button></div>
          </form>
        </Modal>

        {/* Edit Lesson Modal */}
        <Modal isOpen={!!editingLesson} onClose={() => setEditingLesson(null)} title="Edit Lesson" size="md">
          <form onSubmit={handleUpdateLesson} className="space-y-4">
            <Input label="Title" value={lessonForm.title} onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })} required />
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Description</label><textarea value={lessonForm.description} onChange={(e) => setLessonForm({ ...lessonForm, description: e.target.value })} className="w-full px-3 py-2 border border-surface-border rounded-lg" rows={2} /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Type</label><select value={lessonForm.lesson_type} onChange={(e) => setLessonForm({ ...lessonForm, lesson_type: e.target.value })} className="w-full px-3 py-2 border border-surface-border rounded-lg"><option value="video">Video</option><option value="reading">Reading</option><option value="practice">Practice</option><option value="quiz">Quiz</option><option value="mixed">Mixed</option></select></div>
            <Input label="Order" type="number" value={String(lessonForm.order)} onChange={(e) => setLessonForm({ ...lessonForm, order: parseInt(e.target.value, 10) || 0 })} />
            <label className="flex items-center gap-2"><input type="checkbox" checked={lessonForm.is_published} onChange={(e) => setLessonForm({ ...lessonForm, is_published: e.target.checked })} /> Published</label>
            <div className="flex gap-2"><Button type="submit">Save</Button><Button type="button" variant="outline" onClick={() => setEditingLesson(null)}>Cancel</Button></div>
          </form>
        </Modal>

        {/* Create Section Modal */}
        <Modal isOpen={!!creatingSection} onClose={() => setCreatingSection(null)} title="Add Section" size="md">
          <form onSubmit={handleCreateSection} className="space-y-4">
            <Input label="Title" value={sectionForm.title} onChange={(e) => setSectionForm({ ...sectionForm, title: e.target.value })} required />
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Type</label><select value={sectionForm.section_type} onChange={(e) => setSectionForm({ ...sectionForm, section_type: e.target.value })} className="w-full px-3 py-2 border border-surface-border rounded-lg"><option value="text">Text</option><option value="video">Video</option><option value="image">Image</option><option value="pdf">PDF</option><option value="quiz">Quiz</option><option value="practice">Practice</option><option value="tips">Tips</option><option value="formula">Formula</option></select></div>
            <Input label="Order" type="number" value={String(sectionForm.order)} onChange={(e) => setSectionForm({ ...sectionForm, order: parseInt(e.target.value, 10) || 0 })} />
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Content (optional)</label><textarea value={sectionForm.text_content} onChange={(e) => setSectionForm({ ...sectionForm, text_content: e.target.value })} className="w-full px-3 py-2 border border-surface-border rounded-lg" rows={3} placeholder="Markdown or plain text" /></div>
            <div className="flex gap-2"><Button type="submit">Create</Button><Button type="button" variant="outline" onClick={() => setCreatingSection(null)}>Cancel</Button></div>
          </form>
        </Modal>

        {/* Edit Section Modal */}
        <Modal isOpen={!!editingSection} onClose={() => setEditingSection(null)} title="Edit Section" size="md">
          <form onSubmit={handleUpdateSection} className="space-y-4">
            <Input label="Title" value={sectionForm.title} onChange={(e) => setSectionForm({ ...sectionForm, title: e.target.value })} required />
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Type</label><select value={sectionForm.section_type} onChange={(e) => setSectionForm({ ...sectionForm, section_type: e.target.value })} className="w-full px-3 py-2 border border-surface-border rounded-lg"><option value="text">Text</option><option value="video">Video</option><option value="image">Image</option><option value="pdf">PDF</option><option value="quiz">Quiz</option><option value="practice">Practice</option><option value="tips">Tips</option><option value="formula">Formula</option></select></div>
            <Input label="Order" type="number" value={String(sectionForm.order)} onChange={(e) => setSectionForm({ ...sectionForm, order: parseInt(e.target.value, 10) || 0 })} />
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Content (optional)</label><textarea value={sectionForm.text_content} onChange={(e) => setSectionForm({ ...sectionForm, text_content: e.target.value })} className="w-full px-3 py-2 border border-surface-border rounded-lg" rows={3} /></div>
            <div className="flex gap-2"><Button type="submit">Save</Button><Button type="button" variant="outline" onClick={() => setEditingSection(null)}>Cancel</Button></div>
          </form>
        </Modal>

        {/* Create Resource Modal */}
        <Modal isOpen={!!creatingResource} onClose={() => setCreatingResource(null)} title="Add Resource" size="md">
          <form onSubmit={handleCreateResource} className="space-y-4">
            <Input label="Title" value={resourceForm.title} onChange={(e) => setResourceForm({ ...resourceForm, title: e.target.value })} required />
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Type</label><select value={resourceForm.resource_type} onChange={(e) => setResourceForm({ ...resourceForm, resource_type: e.target.value })} className="w-full px-3 py-2 border border-surface-border rounded-lg"><option value="link">Link</option><option value="study_guide">Study Guide</option><option value="video">Video</option><option value="pdf">PDF</option><option value="article">Article</option><option value="flashcards">Flashcards</option><option value="formula_sheet">Formula Sheet</option><option value="tips">Tips</option></select></div>
            <Input label="Order" type="number" value={String(resourceForm.order)} onChange={(e) => setResourceForm({ ...resourceForm, order: parseInt(e.target.value, 10) || 0 })} />
            <Input label="URL (optional)" value={resourceForm.url} onChange={(e) => setResourceForm({ ...resourceForm, url: e.target.value })} placeholder="https://..." />
            <div className="flex gap-2"><Button type="submit">Create</Button><Button type="button" variant="outline" onClick={() => setCreatingResource(null)}>Cancel</Button></div>
          </form>
        </Modal>
      </div>
    </AdminLayout>
  );
};

// ModuleCard fetches its own lessons when expanded
function ModuleCard({
  module,
  isExpanded,
  onToggle,
  onEdit,
  onDelete,
  onCreateLesson,
  onCreateSection,
  onCreateResource,
  onDeleteLesson,
  onDeleteSection,
  onDeleteResource,
  expandedLessons,
  onToggleLesson,
  onEditLesson,
  onEditSection,
}: {
  module: ExamModule;
  isExpanded: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onCreateLesson: () => void;
  onCreateSection: (lessonId: string) => void;
  onCreateResource: (lessonId: string) => void;
  onDeleteLesson: (id: string) => void;
  onDeleteSection: (id: string) => void;
  onDeleteResource: (id: string) => void;
  expandedLessons: Record<string, boolean>;
  onToggleLesson: (id: string) => void;
  onEditLesson: (l: ExamLesson) => void;
  onEditSection: (s: ExamLessonSection) => void;
}) {
  const { data: lessons = [] } = useGetModuleLessonsQuery(module.id, { skip: !isExpanded });
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <button onClick={onToggle} className="p-1 hover:bg-gray-100 rounded">
              {isExpanded ? <ChevronDown className="w-5 h-5 text-gray-600" /> : <ChevronRight className="w-5 h-5 text-gray-600" />}
            </button>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800">{module.title}</h3>
              {module.description && <p className="text-sm text-gray-600 mt-1">{module.description}</p>}
            </div>
            <span className="text-sm text-gray-500">{lessons.length} lessons</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onEdit}><Edit2 className="w-4 h-4" /></Button>
            <Button variant="danger" size="sm" onClick={onDelete}><Trash2 className="w-4 h-4" /></Button>
          </div>
        </div>
      </CardHeader>
      {isExpanded && (
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium text-gray-700 flex items-center gap-2"><FileText className="w-4 h-4" /> Lessons</h4>
              <Button size="sm" variant="outline" onClick={onCreateLesson}><Plus className="w-4 h-4 mr-2" /> Add Lesson</Button>
            </div>
            {lessons.length === 0 ? (
              <p className="text-center py-6 text-gray-500 text-sm">No lessons yet. Click &quot;Add Lesson&quot;.</p>
            ) : (
              lessons.map((lesson) => (
                <LessonCard
                  key={lesson.id}
                  lesson={lesson}
                  onCreateSection={() => onCreateSection(lesson.id)}
                  onCreateResource={() => onCreateResource(lesson.id)}
                  onDeleteLesson={onDeleteLesson}
                  onDeleteSection={onDeleteSection}
                  onDeleteResource={onDeleteResource}
                  isExpanded={!!expandedLessons[lesson.id]}
                  onToggle={() => onToggleLesson(lesson.id)}
                  onEdit={() => onEditLesson(lesson)}
                  onEditSection={onEditSection}
                />
              ))
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
}

function LessonCard({
  lesson,
  isExpanded,
  onToggle,
  onEdit,
  onCreateSection,
  onCreateResource,
  onDeleteLesson,
  onDeleteSection,
  onDeleteResource,
  onEditSection,
}: {
  lesson: ExamLesson;
  isExpanded: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onCreateSection: () => void;
  onCreateResource: () => void;
  onDeleteLesson: (id: string) => void;
  onDeleteSection: (id: string) => void;
  onDeleteResource: (id: string) => void;
  onEditSection: (s: ExamLessonSection) => void;
}) {
  const { data: sections = [] } = useGetLessonSectionsQuery(lesson.id, { skip: !isExpanded });
  const { data: resources = [] } = useGetLessonResourcesQuery(lesson.id, { skip: !isExpanded });
  return (
    <div className="border border-surface-borderLight rounded-lg p-4 bg-surface-muted/30">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          <button onClick={onToggle} className="p-1 hover:bg-gray-200 rounded">
            {isExpanded ? <ChevronDown className="w-4 h-4 text-gray-600" /> : <ChevronRight className="w-4 h-4 text-gray-600" />}
          </button>
          <div className="flex-1">
            <h5 className="font-medium text-gray-800">{lesson.title}</h5>
            {lesson.description && <p className="text-xs text-gray-600 mt-1">{lesson.description}</p>}
          </div>
          <span className="text-xs text-gray-500">{sections.length} sections · {resources.length} resources</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onEdit}><Edit2 className="w-3 h-3" /></Button>
          <Button variant="danger" size="sm" onClick={() => onDeleteLesson(lesson.id)}><Trash2 className="w-3 h-3" /></Button>
        </div>
      </div>
      {isExpanded && (
        <div className="mt-4 space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h6 className="text-sm font-medium text-gray-700 flex items-center gap-2"><Folder className="w-3 h-3" /> Sections</h6>
              <Button size="sm" variant="outline" onClick={onCreateSection}><Plus className="w-3 h-3 mr-1" /> Add Section</Button>
            </div>
            {sections.length === 0 ? <p className="text-center py-3 text-gray-500 text-xs">No sections yet.</p> : (
              <div className="space-y-2">
                {sections.map((s) => (
                  <div key={s.id} className="bg-white border border-surface-borderLight rounded p-3 flex items-center justify-between">
                    <div><div className="font-medium text-sm text-gray-800">{s.title}</div><div className="text-xs text-gray-500">Type: {s.section_type} · Order: {s.order}</div></div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => onEditSection(s)}><Edit2 className="w-3 h-3" /></Button>
                      <Button variant="danger" size="sm" onClick={() => onDeleteSection(s.id)}><Trash2 className="w-3 h-3" /></Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <h6 className="text-sm font-medium text-gray-700 flex items-center gap-2"><BookOpen className="w-3 h-3" /> Resources</h6>
              <Button size="sm" variant="outline" onClick={onCreateResource}><Plus className="w-3 h-3 mr-1" /> Add Resource</Button>
            </div>
            {resources.length === 0 ? <p className="text-center py-3 text-gray-500 text-xs">No resources yet.</p> : (
              <div className="space-y-2">
                {resources.map((r) => (
                  <div key={r.id} className="bg-white border border-surface-borderLight rounded p-3 flex items-center justify-between">
                    <div><div className="font-medium text-sm text-gray-800">{r.title}</div><div className="text-xs text-gray-500">Type: {r.resource_type}</div></div>
                    <div className="flex gap-2">
                      <Button variant="danger" size="sm" onClick={() => onDeleteResource(r.id)}><Trash2 className="w-3 h-3" /></Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../components/layout';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Modal } from '../../components/common/Modal';
import { Alert } from '../../components/common/Alert';
import {
  useGetCourseQuery,
  useCreateCourseModuleMutation,
  useUpdateCourseModuleMutation,
  useDeleteCourseModuleMutation,
  useCreateCourseLessonMutation,
  useUpdateCourseLessonMutation,
  useDeleteCourseLessonMutation,
  useCreateCourseSectionMutation,
  useUpdateCourseSectionMutation,
  useDeleteCourseSectionMutation,
} from '../../store/api/coursesApi';
import {
  ChevronRight,
  Plus,
  Edit2,
  Trash2,
  ChevronDown,
  ChevronUp,
  Layers,
  FileText,
  Folder,
} from 'lucide-react';
import type { CourseModule, CourseLesson, CourseSection, SectionQuizQuestion } from '../../interfaces/course';

export const CourseDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: course, isLoading } = useGetCourseQuery(id!);
  const [createModule] = useCreateCourseModuleMutation();
  const [updateModule] = useUpdateCourseModuleMutation();
  const [deleteModule] = useDeleteCourseModuleMutation();
  const [createLesson] = useCreateCourseLessonMutation();
  const [updateLesson] = useUpdateCourseLessonMutation();
  const [deleteLesson] = useDeleteCourseLessonMutation();
  const [createSection] = useCreateCourseSectionMutation();
  const [updateSection] = useUpdateCourseSectionMutation();
  const [deleteSection] = useDeleteCourseSectionMutation();

  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({});
  const [expandedLessons, setExpandedLessons] = useState<Record<string, boolean>>({});
  const [editingModule, setEditingModule] = useState<CourseModule | null>(null);
  const [editingLesson, setEditingLesson] = useState<CourseLesson | null>(null);
  const [editingSection, setEditingSection] = useState<CourseSection | null>(null);
  const [creatingModule, setCreatingModule] = useState(false);
  const [creatingLesson, setCreatingLesson] = useState<string | null>(null);
  const [creatingSection, setCreatingSection] = useState<{ lessonId: string; moduleId: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#446D6D]"></div>
        </div>
      </AdminLayout>
    );
  }

  if (!course) {
    return (
      <AdminLayout>
        <Alert type="error" message="Course not found" />
      </AdminLayout>
    );
  }

  const modules = course.modules || [];

  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) => ({ ...prev, [moduleId]: !prev[moduleId] }));
  };

  const toggleLesson = (lessonId: string) => {
    setExpandedLessons((prev) => ({ ...prev, [lessonId]: !prev[lessonId] }));
  };

  const handleCreateModule = () => {
    setCreatingModule(true);
  };

  const handleCreateLesson = (moduleId: string) => {
    setCreatingLesson(moduleId);
  };

  const handleCreateSection = (lessonId: string, moduleId: string) => {
    setCreatingSection({ lessonId, moduleId });
  };

  const handleDeleteModule = async (moduleId: string) => {
    if (!window.confirm('Are you sure you want to delete this module?')) return;
    try {
      await deleteModule(moduleId).unwrap();
    } catch (err: any) {
      setError(err?.data?.message || 'Failed to delete module');
    }
  };

  const handleDeleteLesson = async (lessonId: string) => {
    if (!window.confirm('Are you sure you want to delete this lesson?')) return;
    try {
      await deleteLesson(lessonId).unwrap();
    } catch (err: any) {
      setError(err?.data?.message || 'Failed to delete lesson');
    }
  };

  const handleDeleteSection = async (sectionId: string) => {
    if (!window.confirm('Are you sure you want to delete this section?')) return;
    try {
      await deleteSection(sectionId).unwrap();
    } catch (err: any) {
      setError(err?.data?.message || 'Failed to delete section');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <button
            onClick={() => navigate('/admin/courses/courses')}
            className="hover:text-[#446D6D] transition-colors"
          >
            Courses
          </button>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-800 font-medium">{course.title}</span>
        </div>

        {/* Course Header */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">{course.title}</CardTitle>
                <p className="text-gray-600 mt-1">{course.description}</p>
              </div>
              <Button
                variant="outline"
                onClick={() => navigate('/admin/courses/courses')}
              >
                Back to Courses
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Code:</span>
                <span className="ml-2 font-medium">{course.course_code || 'N/A'}</span>
              </div>
              <div>
                <span className="text-gray-600">Level:</span>
                <span className="ml-2 font-medium">{course.level}</span>
              </div>
              <div>
                <span className="text-gray-600">Status:</span>
                <span className="ml-2 font-medium">{course.status}</span>
              </div>
              <div>
                <span className="text-gray-600">Price:</span>
                <span className="ml-2 font-medium">
                  {course.is_free ? 'Free' : `${course.currency} ${course.price}`}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {error && <Alert type="error" message={error} />}

        {/* Modules */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <Layers className="w-5 h-5" />
              Modules ({modules.length})
            </h2>
            <Button onClick={handleCreateModule} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Module
            </Button>
          </div>

          {modules.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12 text-gray-500">
                No modules yet. Click "Add Module" to create one.
              </CardContent>
            </Card>
          ) : (
            modules.map((module) => (
              <ModuleCard
                key={module.id}
                module={module}
                isExpanded={expandedModules[module.id] || false}
                onToggle={() => toggleModule(module.id)}
                onEdit={() => setEditingModule(module)}
                onDelete={() => handleDeleteModule(module.id)}
                onCreateLesson={() => handleCreateLesson(module.id)}
                onCreateSection={handleCreateSection}
                onDeleteLesson={handleDeleteLesson}
                onDeleteSection={handleDeleteSection}
                expandedLessons={expandedLessons}
                onToggleLesson={toggleLesson}
                onEditLesson={(lesson) => setEditingLesson(lesson)}
                onEditSection={(section) => setEditingSection(section)}
              />
            ))
          )}
        </div>

        {/* Edit Modals */}
        {editingModule && (
          <ModuleEditModal
            module={editingModule}
            onClose={() => setEditingModule(null)}
            onSave={async (data) => {
              try {
                await updateModule({ id: editingModule.id, data }).unwrap();
                setEditingModule(null);
              } catch (err: any) {
                setError(err?.data?.message || 'Failed to update module');
              }
            }}
          />
        )}

        {editingLesson && (
          <LessonEditModal
            lesson={editingLesson}
            onClose={() => setEditingLesson(null)}
            onSave={async (data) => {
              try {
                await updateLesson({ id: editingLesson.id, data }).unwrap();
                setEditingLesson(null);
              } catch (err: any) {
                setError(err?.data?.message || 'Failed to update lesson');
              }
            }}
          />
        )}

        {editingSection && (
          <SectionEditModal
            section={editingSection}
            onClose={() => setEditingSection(null)}
            onSave={async (data) => {
              try {
                await updateSection({ id: editingSection.id, data }).unwrap();
                setEditingSection(null);
              } catch (err: any) {
                setError(err?.data?.message || 'Failed to update section');
              }
            }}
          />
        )}

        {/* Create Modals */}
        {creatingModule && (
          <ModuleCreateModal
            courseId={course.id}
            order={modules.length + 1}
            onClose={() => setCreatingModule(false)}
            onSave={async (data) => {
              try {
                await createModule(data).unwrap();
                setCreatingModule(false);
              } catch (err: any) {
                setError(err?.data?.message || 'Failed to create module');
              }
            }}
          />
        )}

        {creatingLesson && (
          <LessonCreateModal
            moduleId={creatingLesson}
            order={
              (modules.find((m) => m.id === creatingLesson)?.lessons?.length || 0) + 1
            }
            onClose={() => setCreatingLesson(null)}
            onSave={async (data) => {
              try {
                await createLesson(data).unwrap();
                setCreatingLesson(null);
              } catch (err: any) {
                setError(err?.data?.message || 'Failed to create lesson');
              }
            }}
          />
        )}

        {creatingSection && (
          <SectionCreateModal
            lessonId={creatingSection.lessonId}
            order={
              (modules
                .find((m) => m.id === creatingSection.moduleId)
                ?.lessons?.find((l) => l.id === creatingSection.lessonId)
                ?.sections?.length || 0) + 1
            }
            onClose={() => setCreatingSection(null)}
            onSave={async (data) => {
              try {
                await createSection(data).unwrap();
                setCreatingSection(null);
              } catch (err: any) {
                setError(err?.data?.message || 'Failed to create section');
              }
            }}
          />
        )}
      </div>
    </AdminLayout>
  );
};

interface ModuleCardProps {
  module: CourseModule;
  isExpanded: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onCreateLesson: () => void;
  onCreateSection: (lessonId: string, moduleId: string) => void;
  onDeleteLesson: (lessonId: string) => void;
  onDeleteSection: (sectionId: string) => void;
  expandedLessons: Record<string, boolean>;
  onToggleLesson: (lessonId: string) => void;
  onEditLesson: (lesson: CourseLesson) => void;
  onEditSection: (section: CourseSection) => void;
}

const ModuleCard: React.FC<ModuleCardProps> = ({
  module,
  isExpanded,
  onToggle,
  onEdit,
  onDelete,
  onCreateLesson,
  onCreateSection,
  onDeleteLesson,
  onDeleteSection,
  expandedLessons,
  onToggleLesson,
  onEditLesson,
  onEditSection,
}) => {
  const lessons = module.lessons || [];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <button
              onClick={onToggle}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
            >
              {isExpanded ? (
                <ChevronDown className="w-5 h-5 text-gray-600" />
              ) : (
                <ChevronRight className="w-5 h-5 text-gray-600" />
              )}
            </button>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800">{module.title}</h3>
              {module.description && (
                <p className="text-sm text-gray-600 mt-1">{module.description}</p>
              )}
            </div>
            <div className="text-sm text-gray-500">
              {lessons.length} {lessons.length === 1 ? 'lesson' : 'lessons'}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onEdit}>
              <Edit2 className="w-4 h-4" />
            </Button>
            <Button variant="danger" size="sm" onClick={onDelete}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium text-gray-700 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Lessons
              </h4>
              <Button onClick={onCreateLesson} size="sm" variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Add Lesson
              </Button>
            </div>

            {lessons.length === 0 ? (
              <div className="text-center py-6 text-gray-500 text-sm">
                No lessons yet. Click "Add Lesson" to create one.
              </div>
            ) : (
              lessons.map((lesson) => (
                <LessonCard
                  key={lesson.id}
                  lesson={lesson}
                  moduleId={module.id}
                  isExpanded={expandedLessons[lesson.id] || false}
                  onToggle={() => onToggleLesson(lesson.id)}
                  onEdit={() => onEditLesson(lesson)}
                  onDelete={() => onDeleteLesson(lesson.id)}
                  onCreateSection={() => onCreateSection(lesson.id, module.id)}
                  onDeleteSection={onDeleteSection}
                  onEditSection={onEditSection}
                />
              ))
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
};

interface LessonCardProps {
  lesson: CourseLesson;
  moduleId: string;
  isExpanded: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onCreateSection: () => void;
  onDeleteSection: (sectionId: string) => void;
  onEditSection: (section: CourseSection) => void;
}

const LessonCard: React.FC<LessonCardProps> = ({
  lesson,
  isExpanded,
  onToggle,
  onEdit,
  onDelete,
  onCreateSection,
  onDeleteSection,
  onEditSection,
}) => {
  const sections = lesson.sections || [];

  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          <button
            onClick={onToggle}
            className="p-1 hover:bg-gray-200 rounded transition-colors"
          >
            {isExpanded ? (
              <ChevronDown className="w-4 h-4 text-gray-600" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-600" />
            )}
          </button>
          <div className="flex-1">
            <h5 className="font-medium text-gray-800">{lesson.title}</h5>
            {lesson.description && (
              <p className="text-xs text-gray-600 mt-1">{lesson.description}</p>
            )}
          </div>
          <div className="text-xs text-gray-500">
            {sections.length} {sections.length === 1 ? 'section' : 'sections'}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onEdit}>
            <Edit2 className="w-3 h-3" />
          </Button>
          <Button variant="danger" size="sm" onClick={onDelete}>
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {isExpanded && (
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between mb-2">
            <h6 className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Folder className="w-3 h-3" />
              Sections
            </h6>
            <Button onClick={onCreateSection} size="sm" variant="outline">
              <Plus className="w-3 h-3 mr-1" />
              Add Section
            </Button>
          </div>

          {sections.length === 0 ? (
            <div className="text-center py-4 text-gray-500 text-xs">
              No sections yet. Click "Add Section" to create one.
            </div>
          ) : (
            sections.map((section) => (
              <div
                key={section.id}
                className="bg-white border border-gray-200 rounded p-3 flex items-center justify-between"
              >
                <div className="flex-1">
                  <div className="font-medium text-sm text-gray-800">{section.title}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    Type: {section.section_type} | Order: {section.order}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEditSection(section)}
                  >
                    <Edit2 className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => onDeleteSection(section.id)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

// Edit Modals
interface ModuleEditModalProps {
  module: CourseModule;
  onClose: () => void;
  onSave: (data: Partial<CourseModule>) => Promise<void>;
}

const ModuleEditModal: React.FC<ModuleEditModalProps> = ({ module, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    title: module.title,
    description: module.description || '',
    order: module.order,
    duration_minutes: module.duration_minutes || 0,
    difficulty: module.difficulty || 'beginner',
    learning_path: module.learning_path || 'sequential',
    is_published: module.is_published,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(formData);
  };

  return (
    <Modal isOpen={true} onClose={onClose} title="Edit Module" size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Order"
            type="number"
            value={formData.order}
            onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 1 })}
          />
          <Input
            label="Duration (Minutes)"
            type="number"
            value={formData.duration_minutes}
            onChange={(e) =>
              setFormData({ ...formData, duration_minutes: parseInt(e.target.value) || 0 })
            }
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
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
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Learning Path</label>
            <select
              value={formData.learning_path}
              onChange={(e) => setFormData({ ...formData, learning_path: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#446D6D] focus:ring-4 focus:ring-[#446D6D]/10 outline-none transition-all duration-200"
            >
              <option value="sequential">Sequential</option>
              <option value="flexible">Flexible</option>
            </select>
          </div>
        </div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.is_published}
            onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
            className="w-4 h-4 text-[#446D6D] border-gray-300 rounded focus:ring-[#446D6D]"
          />
          <span className="text-sm font-medium text-gray-700">Published</span>
        </label>
        <div className="flex gap-3 pt-4">
          <Button type="submit" fullWidth>
            Save Changes
          </Button>
          <Button type="button" variant="outline" onClick={onClose} fullWidth>
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
};

interface LessonEditModalProps {
  lesson: CourseLesson;
  onClose: () => void;
  onSave: (data: Partial<CourseLesson>) => Promise<void>;
}

const LessonEditModal: React.FC<LessonEditModalProps> = ({ lesson, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    title: lesson.title,
    description: lesson.description || '',
    order: lesson.order,
    lesson_type: lesson.lesson_type,
    duration_minutes: lesson.duration_minutes || 0,
    difficulty: lesson.difficulty || 'beginner',
    is_published: lesson.is_published,
    is_preview: lesson.is_preview,
    requires_completion: lesson.requires_completion,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(formData);
  };

  return (
    <Modal isOpen={true} onClose={onClose} title="Edit Lesson" size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#446D6D] focus:ring-4 focus:ring-[#446D6D]/10 outline-none transition-all duration-200"
            rows={3}
          />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <Input
            label="Order"
            type="number"
            value={formData.order}
            onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 1 })}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Lesson Type</label>
            <select
              value={formData.lesson_type}
              onChange={(e) => setFormData({ ...formData, lesson_type: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#446D6D] focus:ring-4 focus:ring-[#446D6D]/10 outline-none transition-all duration-200"
            >
              <option value="video">Video</option>
              <option value="text">Text</option>
              <option value="audio">Audio</option>
              <option value="interactive">Interactive</option>
            </select>
          </div>
          <Input
            label="Duration (Minutes)"
            type="number"
            value={formData.duration_minutes}
            onChange={(e) =>
              setFormData({ ...formData, duration_minutes: parseInt(e.target.value) || 0 })
            }
          />
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
          </select>
        </div>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.is_published}
              onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
              className="w-4 h-4 text-[#446D6D] border-gray-300 rounded focus:ring-[#446D6D]"
            />
            <span className="text-sm font-medium text-gray-700">Published</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.is_preview}
              onChange={(e) => setFormData({ ...formData, is_preview: e.target.checked })}
              className="w-4 h-4 text-[#446D6D] border-gray-300 rounded focus:ring-[#446D6D]"
            />
            <span className="text-sm font-medium text-gray-700">Preview</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.requires_completion}
              onChange={(e) =>
                setFormData({ ...formData, requires_completion: e.target.checked })
              }
              className="w-4 h-4 text-[#446D6D] border-gray-300 rounded focus:ring-[#446D6D]"
            />
            <span className="text-sm font-medium text-gray-700">Requires Completion</span>
          </label>
        </div>
        <div className="flex gap-3 pt-4">
          <Button type="submit" fullWidth>
            Save Changes
          </Button>
          <Button type="button" variant="outline" onClick={onClose} fullWidth>
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
};

interface SectionEditModalProps {
  section: CourseSection;
  onClose: () => void;
  onSave: (data: Partial<CourseSection>) => Promise<void>;
}

const SectionEditModal: React.FC<SectionEditModalProps> = ({ section, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    title: section.title,
    description: section.description || '',
    section_type: section.section_type,
    order: section.order,
    text_content: section.text_content || '',
    // Video fields
    video_url: section.video_url || '',
    video_qualities: section.video_qualities ? JSON.stringify(section.video_qualities, null, 2) : '',
    video_subtitles: section.video_subtitles ? JSON.stringify(section.video_subtitles, null, 2) : '',
    video_duration_seconds: section.video_duration_seconds || 0,
    // Image fields
    image_url: section.image_url || '',
    image_caption: section.image_caption || '',
    // Audio fields
    audio_url: section.audio_url || '',
    audio_duration_seconds: section.audio_duration_seconds || 0,
    // Code fields
    code_content: section.code_content || '',
    code_language: section.code_language || '',
    // File fields
    file_url: section.file_url || '',
    file_type: section.file_type || '',
    // PDF fields
    pdf_url: section.pdf_url || '',
    // Embed fields
    embed_url: section.embed_url || '',
    embed_code: section.embed_code || '',
    // Combined fields
    combined_content: section.combined_content ? JSON.stringify(section.combined_content, null, 2) : '',
    estimated_time_minutes: section.estimated_time_minutes || 5,
    is_required: section.is_required,
    is_downloadable: section.is_downloadable,
    is_published: section.is_published,
    // Quiz fields
    quiz_questions: (section.quiz_questions || []) as SectionQuizQuestion[],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const submitData: any = {
      title: formData.title,
      description: formData.description,
      section_type: formData.section_type,
      order: formData.order,
      estimated_time_minutes: formData.estimated_time_minutes,
      is_required: formData.is_required,
      is_downloadable: formData.is_downloadable,
      is_published: formData.is_published,
    };

    // Add type-specific fields
    if (formData.section_type === 'text') {
      submitData.text_content = formData.text_content;
    } else if (formData.section_type === 'video') {
      submitData.video_url = formData.video_url;
      if (formData.video_qualities) {
        try {
          submitData.video_qualities = JSON.parse(formData.video_qualities);
        } catch {
          submitData.video_qualities = {};
        }
      }
      if (formData.video_subtitles) {
        try {
          submitData.video_subtitles = JSON.parse(formData.video_subtitles);
        } catch {
          submitData.video_subtitles = [];
        }
      }
      submitData.video_duration_seconds = formData.video_duration_seconds;
    } else if (formData.section_type === 'image') {
      submitData.image_url = formData.image_url;
      submitData.image_caption = formData.image_caption;
    } else if (formData.section_type === 'audio') {
      submitData.audio_url = formData.audio_url;
      submitData.audio_duration_seconds = formData.audio_duration_seconds;
    } else if (formData.section_type === 'code') {
      submitData.code_content = formData.code_content;
      submitData.code_language = formData.code_language;
    } else if (formData.section_type === 'file') {
      submitData.file_url = formData.file_url;
      submitData.file_type = formData.file_type;
    } else if (formData.section_type === 'pdf') {
      submitData.pdf_url = formData.pdf_url;
    } else if (formData.section_type === 'embed') {
      submitData.embed_url = formData.embed_url;
      submitData.embed_code = formData.embed_code;
    } else if (formData.section_type === 'combined') {
      if (formData.combined_content) {
        try {
          submitData.combined_content = JSON.parse(formData.combined_content);
        } catch {
          submitData.combined_content = {};
        }
      }
    } else if (formData.section_type === 'quiz') {
      // Transform quiz questions for submission (remove id if it's a new question)
      submitData.quiz_questions = formData.quiz_questions.map((q, qIndex) => ({
        text: q.text,
        explanation: q.explanation || '',
        order: q.order || qIndex + 1,
        points: q.points || 1,
        options: (q.options || []).map((opt, oIndex) => ({
          text: opt.text,
          is_correct: opt.is_correct,
          explanation: opt.explanation || '',
          order: opt.order || oIndex + 1,
        })),
      }));
    }

    await onSave(submitData);
  };

  const addQuizQuestion = () => {
    const newQuestion = {
      id: `temp-${Date.now()}`,
      section: section.id,
      text: '',
      explanation: '',
      order: formData.quiz_questions.length + 1,
      points: 1,
      options: [
        {
          id: `temp-opt-${Date.now()}-1`,
          question: `temp-${Date.now()}`,
          text: '',
          is_correct: false,
          explanation: '',
          order: 1,
          created_at: '',
          updated_at: '',
        },
        {
          id: `temp-opt-${Date.now()}-2`,
          question: `temp-${Date.now()}`,
          text: '',
          is_correct: true,
          explanation: '',
          order: 2,
          created_at: '',
          updated_at: '',
        },
      ],
      created_at: '',
      updated_at: '',
    };
    setFormData({
      ...formData,
      quiz_questions: [...formData.quiz_questions, newQuestion],
    });
  };

  const removeQuizQuestion = (index: number) => {
    setFormData({
      ...formData,
      quiz_questions: formData.quiz_questions.filter((_, i) => i !== index),
    });
  };

  const updateQuizQuestion = (index: number, field: string, value: any) => {
    const updated = [...formData.quiz_questions];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, quiz_questions: updated });
  };

  const addQuizOption = (questionIndex: number) => {
    const updated = [...formData.quiz_questions];
    const question = updated[questionIndex];
    const newOption = {
      id: `temp-opt-${Date.now()}`,
      question: question.id,
      text: '',
      is_correct: false,
      explanation: '',
      order: (question.options?.length || 0) + 1,
      created_at: '',
      updated_at: '',
    };
    updated[questionIndex] = {
      ...question,
      options: [...(question.options || []), newOption],
    };
    setFormData({ ...formData, quiz_questions: updated });
  };

  const removeQuizOption = (questionIndex: number, optionIndex: number) => {
    const updated = [...formData.quiz_questions];
    updated[questionIndex] = {
      ...updated[questionIndex],
      options: updated[questionIndex].options?.filter((_, i) => i !== optionIndex) || [],
    };
    setFormData({ ...formData, quiz_questions: updated });
  };

  const updateQuizOption = (questionIndex: number, optionIndex: number, field: string, value: any) => {
    const updated = [...formData.quiz_questions];
    const options = [...(updated[questionIndex].options || [])];
    options[optionIndex] = { ...options[optionIndex], [field]: value };
    updated[questionIndex] = { ...updated[questionIndex], options };
    setFormData({ ...formData, quiz_questions: updated });
  };

  const [expandedQuestions, setExpandedQuestions] = useState<Record<number, boolean>>({});

  const toggleQuestion = (index: number) => {
    setExpandedQuestions((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <Modal isOpen={true} onClose={onClose} title="Edit Section" size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#446D6D] focus:ring-4 focus:ring-[#446D6D]/10 outline-none transition-all duration-200"
            rows={2}
          />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Section Type</label>
            <select
              value={formData.section_type}
              onChange={(e) => setFormData({ ...formData, section_type: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#446D6D] focus:ring-4 focus:ring-[#446D6D]/10 outline-none transition-all duration-200"
            >
              <option value="text">Text</option>
              <option value="video">Video</option>
              <option value="image">Image</option>
              <option value="audio">Audio</option>
              <option value="code">Code</option>
              <option value="file">File</option>
              <option value="pdf">PDF</option>
              <option value="embed">Embed</option>
              <option value="quiz">Quiz</option>
            </select>
          </div>
          <Input
            label="Order"
            type="number"
            value={formData.order}
            onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 1 })}
          />
          <Input
            label="Estimated Time (Minutes)"
            type="number"
            value={formData.estimated_time_minutes}
            onChange={(e) =>
              setFormData({ ...formData, estimated_time_minutes: parseInt(e.target.value) || 5 })
            }
          />
        </div>
        {/* Text Section Fields */}
        {formData.section_type === 'text' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Text Content</label>
            <textarea
              value={formData.text_content}
              onChange={(e) => setFormData({ ...formData, text_content: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#446D6D] focus:ring-4 focus:ring-[#446D6D]/10 outline-none transition-all duration-200"
              rows={6}
              placeholder="Enter text content (supports markdown)"
            />
          </div>
        )}

        {/* Video Section Fields */}
        {formData.section_type === 'video' && (
          <div className="space-y-4">
            <Input
              label="Video URL"
              value={formData.video_url}
              onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
              placeholder="https://example.com/video.mp4"
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Video Qualities (JSON)
              </label>
              <textarea
                value={formData.video_qualities}
                onChange={(e) => setFormData({ ...formData, video_qualities: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#446D6D] focus:ring-4 focus:ring-[#446D6D]/10 outline-none transition-all duration-200 font-mono text-sm"
                rows={4}
                placeholder='{"720p": "url", "480p": "url"}'
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Video Subtitles (JSON)
              </label>
              <textarea
                value={formData.video_subtitles}
                onChange={(e) => setFormData({ ...formData, video_subtitles: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#446D6D] focus:ring-4 focus:ring-[#446D6D]/10 outline-none transition-all duration-200 font-mono text-sm"
                rows={3}
                placeholder='[{"language": "en", "url": "..."}]'
              />
            </div>
            <Input
              label="Video Duration (Seconds)"
              type="number"
              value={formData.video_duration_seconds}
              onChange={(e) =>
                setFormData({ ...formData, video_duration_seconds: parseInt(e.target.value) || 0 })
              }
            />
            <p className="text-xs text-gray-500">
              Note: Video file uploads are handled separately. Use video_url for external videos.
            </p>
          </div>
        )}

        {/* Image Section Fields */}
        {formData.section_type === 'image' && (
          <div className="space-y-4">
            <Input
              label="Image URL"
              value={formData.image_url}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              placeholder="https://example.com/image.jpg"
            />
            <Input
              label="Image Caption"
              value={formData.image_caption}
              onChange={(e) => setFormData({ ...formData, image_caption: e.target.value })}
              placeholder="Caption for the image"
            />
            <p className="text-xs text-gray-500">
              Note: Image file uploads are handled separately. Use image_url for external images.
            </p>
          </div>
        )}

        {/* Audio Section Fields */}
        {formData.section_type === 'audio' && (
          <div className="space-y-4">
            <Input
              label="Audio URL"
              value={formData.audio_url}
              onChange={(e) => setFormData({ ...formData, audio_url: e.target.value })}
              placeholder="https://example.com/audio.mp3"
            />
            <Input
              label="Audio Duration (Seconds)"
              type="number"
              value={formData.audio_duration_seconds}
              onChange={(e) =>
                setFormData({ ...formData, audio_duration_seconds: parseInt(e.target.value) || 0 })
              }
            />
            <p className="text-xs text-gray-500">
              Note: Audio file uploads are handled separately. Use audio_url for external audio.
            </p>
          </div>
        )}

        {/* Code Section Fields */}
        {formData.section_type === 'code' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Code Content</label>
              <textarea
                value={formData.code_content}
                onChange={(e) => setFormData({ ...formData, code_content: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#446D6D] focus:ring-4 focus:ring-[#446D6D]/10 outline-none transition-all duration-200 font-mono text-sm"
                rows={8}
                placeholder="Enter code here..."
              />
            </div>
            <Input
              label="Code Language"
              value={formData.code_language}
              onChange={(e) => setFormData({ ...formData, code_language: e.target.value })}
              placeholder="python, javascript, java, etc."
            />
          </div>
        )}

        {/* File Section Fields */}
        {formData.section_type === 'file' && (
          <div className="space-y-4">
            <Input
              label="File URL"
              value={formData.file_url}
              onChange={(e) => setFormData({ ...formData, file_url: e.target.value })}
              placeholder="https://example.com/file.pdf"
            />
            <Input
              label="File Type"
              value={formData.file_type}
              onChange={(e) => setFormData({ ...formData, file_type: e.target.value })}
              placeholder="pdf, docx, xlsx, etc."
            />
            <p className="text-xs text-gray-500">
              Note: File uploads are handled separately. Use file_url for external files.
            </p>
          </div>
        )}

        {/* PDF Section Fields */}
        {formData.section_type === 'pdf' && (
          <div className="space-y-4">
            <Input
              label="PDF URL"
              value={formData.pdf_url}
              onChange={(e) => setFormData({ ...formData, pdf_url: e.target.value })}
              placeholder="https://example.com/document.pdf"
            />
            <p className="text-xs text-gray-500">
              Note: PDF file uploads are handled separately. Use pdf_url for external PDFs.
            </p>
          </div>
        )}

        {/* Embed Section Fields */}
        {formData.section_type === 'embed' && (
          <div className="space-y-4">
            <Input
              label="Embed URL"
              value={formData.embed_url}
              onChange={(e) => setFormData({ ...formData, embed_url: e.target.value })}
              placeholder="https://example.com/embed"
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Embed Code (HTML)</label>
              <textarea
                value={formData.embed_code}
                onChange={(e) => setFormData({ ...formData, embed_code: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#446D6D] focus:ring-4 focus:ring-[#446D6D]/10 outline-none transition-all duration-200 font-mono text-sm"
                rows={4}
                placeholder="<iframe src='...'></iframe>"
              />
            </div>
          </div>
        )}

        {/* Combined Section Fields */}
        {formData.section_type === 'combined' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Combined Content (JSON)
            </label>
            <textarea
              value={formData.combined_content}
              onChange={(e) => setFormData({ ...formData, combined_content: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#446D6D] focus:ring-4 focus:ring-[#446D6D]/10 outline-none transition-all duration-200 font-mono text-sm"
              rows={8}
              placeholder='{"layout": "side_by_side", "items": [{"type": "text", "content": "..."}]}'
            />
          </div>
        )}

        {/* Quiz Section - Questions Management */}
        {formData.section_type === 'quiz' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-gray-700">Quiz Questions</h4>
              <Button type="button" onClick={addQuizQuestion} size="sm" variant="outline">
                <Plus className="w-4 h-4 mr-1" />
                Add Question
              </Button>
            </div>

            {formData.quiz_questions.length === 0 ? (
              <div className="text-center py-6 text-gray-500 text-sm border-2 border-dashed border-gray-200 rounded-lg">
                No questions yet. Click "Add Question" to create one.
              </div>
            ) : (
              <div className="space-y-3">
                {formData.quiz_questions.map((question, qIndex) => (
                  <div key={question.id || qIndex} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2 flex-1">
                        <button
                          type="button"
                          onClick={() => toggleQuestion(qIndex)}
                          className="p-1 hover:bg-gray-200 rounded"
                        >
                          {expandedQuestions[qIndex] ? (
                            <ChevronDown className="w-4 h-4 text-gray-600" />
                          ) : (
                            <ChevronUp className="w-4 h-4 text-gray-600" />
                          )}
                        </button>
                        <span className="text-xs font-medium text-gray-500">Question {qIndex + 1}</span>
                      </div>
                      <Button
                        type="button"
                        onClick={() => removeQuizQuestion(qIndex)}
                        size="sm"
                        variant="danger"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>

                    {expandedQuestions[qIndex] !== false && (
                      <div className="space-y-3">
                        <Input
                          label="Question Text"
                          value={question.text}
                          onChange={(e) => updateQuizQuestion(qIndex, 'text', e.target.value)}
                          placeholder="Enter the question..."
                          required
                        />
                        <Input
                          label="Explanation (optional)"
                          value={question.explanation || ''}
                          onChange={(e) => updateQuizQuestion(qIndex, 'explanation', e.target.value)}
                          placeholder="Explanation shown after answering"
                        />
                        <div className="grid grid-cols-2 gap-4">
                          <Input
                            label="Order"
                            type="number"
                            value={question.order || qIndex + 1}
                            onChange={(e) => updateQuizQuestion(qIndex, 'order', parseInt(e.target.value) || qIndex + 1)}
                          />
                          <Input
                            label="Points"
                            type="number"
                            value={question.points || 1}
                            onChange={(e) => updateQuizQuestion(qIndex, 'points', parseInt(e.target.value) || 1)}
                          />
                        </div>

                        <div className="mt-4">
                          <div className="flex items-center justify-between mb-2">
                            <label className="text-sm font-medium text-gray-700">Options</label>
                            <Button
                              type="button"
                              onClick={() => addQuizOption(qIndex)}
                              size="sm"
                              variant="outline"
                            >
                              <Plus className="w-3 h-3 mr-1" />
                              Add Option
                            </Button>
                          </div>

                          {(!question.options || question.options.length === 0) ? (
                            <div className="text-center py-3 text-gray-400 text-xs border border-dashed border-gray-200 rounded">
                              No options. Add at least 2 options.
                            </div>
                          ) : (
                            <div className="space-y-2">
                              {question.options.map((option, oIndex) => (
                                <div key={option.id || oIndex} className="flex items-start gap-2 p-3 bg-white border border-gray-200 rounded">
                                  <div className="flex-1 space-y-2">
                                    <Input
                                      label={`Option ${oIndex + 1}`}
                                      value={option.text}
                                      onChange={(e) => updateQuizOption(qIndex, oIndex, 'text', e.target.value)}
                                      placeholder="Option text"
                                      required
                                    />
                                    <Input
                                      label="Explanation (optional)"
                                      value={option.explanation || ''}
                                      onChange={(e) => updateQuizOption(qIndex, oIndex, 'explanation', e.target.value)}
                                      placeholder="Why this option is correct/incorrect"
                                    />
                                  </div>
                                  <div className="flex flex-col items-center gap-2 pt-6">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                      <input
                                        type="checkbox"
                                        checked={option.is_correct}
                                        onChange={(e) => updateQuizOption(qIndex, oIndex, 'is_correct', e.target.checked)}
                                        className="w-4 h-4 text-[#446D6D] border-gray-300 rounded focus:ring-[#446D6D]"
                                      />
                                      <span className="text-xs font-medium text-gray-700">Correct</span>
                                    </label>
                                    {question.options && question.options.length > 2 && (
                                      <Button
                                        type="button"
                                        onClick={() => removeQuizOption(qIndex, oIndex)}
                                        size="sm"
                                        variant="danger"
                                      >
                                        <Trash2 className="w-3 h-3" />
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.is_required}
              onChange={(e) => setFormData({ ...formData, is_required: e.target.checked })}
              className="w-4 h-4 text-[#446D6D] border-gray-300 rounded focus:ring-[#446D6D]"
            />
            <span className="text-sm font-medium text-gray-700">Required</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.is_downloadable}
              onChange={(e) => setFormData({ ...formData, is_downloadable: e.target.checked })}
              className="w-4 h-4 text-[#446D6D] border-gray-300 rounded focus:ring-[#446D6D]"
            />
            <span className="text-sm font-medium text-gray-700">Downloadable</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.is_published}
              onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
              className="w-4 h-4 text-[#446D6D] border-gray-300 rounded focus:ring-[#446D6D]"
            />
            <span className="text-sm font-medium text-gray-700">Published</span>
          </label>
        </div>
        <div className="flex gap-3 pt-4">
          <Button type="submit" fullWidth>
            Save Changes
          </Button>
          <Button type="button" variant="outline" onClick={onClose} fullWidth>
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
};

// Create Modals
interface ModuleCreateModalProps {
  courseId: string;
  order: number;
  onClose: () => void;
  onSave: (data: Partial<CourseModule>) => Promise<void>;
}

const ModuleCreateModal: React.FC<ModuleCreateModalProps> = ({
  courseId,
  order,
  onSave,
  onClose,
}) => {
  const [formData, setFormData] = useState({
    course: courseId,
    title: '',
    description: '',
    order,
    duration_minutes: 0,
    difficulty: 'beginner',
    learning_path: 'sequential',
    is_published: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(formData);
  };

  return (
    <Modal isOpen={true} onClose={onClose} title="Create Module" size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#446D6D] focus:ring-4 focus:ring-[#446D6D]/10 outline-none transition-all duration-200"
            rows={3}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Order"
            type="number"
            value={formData.order}
            onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 1 })}
          />
          <Input
            label="Duration (Minutes)"
            type="number"
            value={formData.duration_minutes}
            onChange={(e) =>
              setFormData({ ...formData, duration_minutes: parseInt(e.target.value) || 0 })
            }
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
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
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Learning Path</label>
            <select
              value={formData.learning_path}
              onChange={(e) => setFormData({ ...formData, learning_path: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#446D6D] focus:ring-4 focus:ring-[#446D6D]/10 outline-none transition-all duration-200"
            >
              <option value="sequential">Sequential</option>
              <option value="flexible">Flexible</option>
            </select>
          </div>
        </div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.is_published}
            onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
            className="w-4 h-4 text-[#446D6D] border-gray-300 rounded focus:ring-[#446D6D]"
          />
          <span className="text-sm font-medium text-gray-700">Published</span>
        </label>
        <div className="flex gap-3 pt-4">
          <Button type="submit" fullWidth>
            Create Module
          </Button>
          <Button type="button" variant="outline" onClick={onClose} fullWidth>
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
};

interface LessonCreateModalProps {
  moduleId: string;
  order: number;
  onClose: () => void;
  onSave: (data: Partial<CourseLesson>) => Promise<void>;
}

const LessonCreateModal: React.FC<LessonCreateModalProps> = ({
  moduleId,
  order,
  onSave,
  onClose,
}) => {
  const [formData, setFormData] = useState({
    module: moduleId,
    title: '',
    description: '',
    order,
    lesson_type: 'video',
    duration_minutes: 0,
    difficulty: 'beginner',
    is_published: true,
    is_preview: false,
    requires_completion: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(formData);
  };

  return (
    <Modal isOpen={true} onClose={onClose} title="Create Lesson" size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#446D6D] focus:ring-4 focus:ring-[#446D6D]/10 outline-none transition-all duration-200"
            rows={3}
          />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <Input
            label="Order"
            type="number"
            value={formData.order}
            onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 1 })}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Lesson Type</label>
            <select
              value={formData.lesson_type}
              onChange={(e) => setFormData({ ...formData, lesson_type: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#446D6D] focus:ring-4 focus:ring-[#446D6D]/10 outline-none transition-all duration-200"
            >
              <option value="video">Video</option>
              <option value="text">Text</option>
              <option value="audio">Audio</option>
              <option value="interactive">Interactive</option>
            </select>
          </div>
          <Input
            label="Duration (Minutes)"
            type="number"
            value={formData.duration_minutes}
            onChange={(e) =>
              setFormData({ ...formData, duration_minutes: parseInt(e.target.value) || 0 })
            }
          />
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
          </select>
        </div>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.is_published}
              onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
              className="w-4 h-4 text-[#446D6D] border-gray-300 rounded focus:ring-[#446D6D]"
            />
            <span className="text-sm font-medium text-gray-700">Published</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.is_preview}
              onChange={(e) => setFormData({ ...formData, is_preview: e.target.checked })}
              className="w-4 h-4 text-[#446D6D] border-gray-300 rounded focus:ring-[#446D6D]"
            />
            <span className="text-sm font-medium text-gray-700">Preview</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.requires_completion}
              onChange={(e) =>
                setFormData({ ...formData, requires_completion: e.target.checked })
              }
              className="w-4 h-4 text-[#446D6D] border-gray-300 rounded focus:ring-[#446D6D]"
            />
            <span className="text-sm font-medium text-gray-700">Requires Completion</span>
          </label>
        </div>
        <div className="flex gap-3 pt-4">
          <Button type="submit" fullWidth>
            Create Lesson
          </Button>
          <Button type="button" variant="outline" onClick={onClose} fullWidth>
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
};

interface SectionCreateModalProps {
  lessonId: string;
  order: number;
  onClose: () => void;
  onSave: (data: Partial<CourseSection>) => Promise<void>;
}

const SectionCreateModal: React.FC<SectionCreateModalProps> = ({
  lessonId,
  order,
  onSave,
  onClose,
}) => {
  const [formData, setFormData] = useState({
    lesson: lessonId,
    title: '',
    description: '',
    section_type: 'text',
    order,
    text_content: '',
    // Video fields
    video_url: '',
    video_qualities: '',
    video_subtitles: '',
    video_duration_seconds: 0,
    // Image fields
    image_url: '',
    image_caption: '',
    // Audio fields
    audio_url: '',
    audio_duration_seconds: 0,
    // Code fields
    code_content: '',
    code_language: '',
    // File fields
    file_url: '',
    file_type: '',
    // PDF fields
    pdf_url: '',
    // Embed fields
    embed_url: '',
    embed_code: '',
    // Combined fields
    combined_content: '',
    estimated_time_minutes: 5,
    is_required: true,
    is_downloadable: false,
    is_published: true,
    // Quiz fields
    quiz_questions: [] as SectionQuizQuestion[],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const submitData: any = {
      lesson: formData.lesson,
      title: formData.title,
      description: formData.description,
      section_type: formData.section_type,
      order: formData.order,
      estimated_time_minutes: formData.estimated_time_minutes,
      is_required: formData.is_required,
      is_downloadable: formData.is_downloadable,
      is_published: formData.is_published,
    };

    // Add type-specific fields
    if (formData.section_type === 'text') {
      submitData.text_content = formData.text_content;
    } else if (formData.section_type === 'video') {
      submitData.video_url = formData.video_url;
      if (formData.video_qualities) {
        try {
          submitData.video_qualities = JSON.parse(formData.video_qualities);
        } catch {
          submitData.video_qualities = {};
        }
      }
      if (formData.video_subtitles) {
        try {
          submitData.video_subtitles = JSON.parse(formData.video_subtitles);
        } catch {
          submitData.video_subtitles = [];
        }
      }
      submitData.video_duration_seconds = formData.video_duration_seconds;
    } else if (formData.section_type === 'image') {
      submitData.image_url = formData.image_url;
      submitData.image_caption = formData.image_caption;
    } else if (formData.section_type === 'audio') {
      submitData.audio_url = formData.audio_url;
      submitData.audio_duration_seconds = formData.audio_duration_seconds;
    } else if (formData.section_type === 'code') {
      submitData.code_content = formData.code_content;
      submitData.code_language = formData.code_language;
    } else if (formData.section_type === 'file') {
      submitData.file_url = formData.file_url;
      submitData.file_type = formData.file_type;
    } else if (formData.section_type === 'pdf') {
      submitData.pdf_url = formData.pdf_url;
    } else if (formData.section_type === 'embed') {
      submitData.embed_url = formData.embed_url;
      submitData.embed_code = formData.embed_code;
    } else if (formData.section_type === 'combined') {
      if (formData.combined_content) {
        try {
          submitData.combined_content = JSON.parse(formData.combined_content);
        } catch {
          submitData.combined_content = {};
        }
      }
    } else if (formData.section_type === 'quiz') {
      // Transform quiz questions for submission (remove id if it's a new question)
      submitData.quiz_questions = formData.quiz_questions.map((q, qIndex) => ({
        text: q.text,
        explanation: q.explanation || '',
        order: q.order || qIndex + 1,
        points: q.points || 1,
        options: (q.options || []).map((opt, oIndex) => ({
          text: opt.text,
          is_correct: opt.is_correct,
          explanation: opt.explanation || '',
          order: opt.order || oIndex + 1,
        })),
      }));
    }

    await onSave(submitData);
  };

  const addQuizQuestion = () => {
    const newQuestion = {
      id: `temp-${Date.now()}`,
      section: '',
      text: '',
      explanation: '',
      order: formData.quiz_questions.length + 1,
      points: 1,
      options: [
        {
          id: `temp-opt-${Date.now()}-1`,
          question: `temp-${Date.now()}`,
          text: '',
          is_correct: false,
          explanation: '',
          order: 1,
          created_at: '',
          updated_at: '',
        },
        {
          id: `temp-opt-${Date.now()}-2`,
          question: `temp-${Date.now()}`,
          text: '',
          is_correct: true,
          explanation: '',
          order: 2,
          created_at: '',
          updated_at: '',
        },
      ],
      created_at: '',
      updated_at: '',
    };
    setFormData({
      ...formData,
      quiz_questions: [...formData.quiz_questions, newQuestion],
    });
  };

  const removeQuizQuestion = (index: number) => {
    setFormData({
      ...formData,
      quiz_questions: formData.quiz_questions.filter((_, i) => i !== index),
    });
  };

  const updateQuizQuestion = (index: number, field: string, value: any) => {
    const updated = [...formData.quiz_questions];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, quiz_questions: updated });
  };

  const addQuizOption = (questionIndex: number) => {
    const updated = [...formData.quiz_questions];
    const question = updated[questionIndex];
    const newOption = {
      id: `temp-opt-${Date.now()}`,
      question: question.id,
      text: '',
      is_correct: false,
      explanation: '',
      order: (question.options?.length || 0) + 1,
      created_at: '',
      updated_at: '',
    };
    updated[questionIndex] = {
      ...question,
      options: [...(question.options || []), newOption],
    };
    setFormData({ ...formData, quiz_questions: updated });
  };

  const removeQuizOption = (questionIndex: number, optionIndex: number) => {
    const updated = [...formData.quiz_questions];
    updated[questionIndex] = {
      ...updated[questionIndex],
      options: updated[questionIndex].options?.filter((_, i) => i !== optionIndex) || [],
    };
    setFormData({ ...formData, quiz_questions: updated });
  };

  const updateQuizOption = (questionIndex: number, optionIndex: number, field: string, value: any) => {
    const updated = [...formData.quiz_questions];
    const options = [...(updated[questionIndex].options || [])];
    options[optionIndex] = { ...options[optionIndex], [field]: value };
    updated[questionIndex] = { ...updated[questionIndex], options };
    setFormData({ ...formData, quiz_questions: updated });
  };

  const [expandedQuestions, setExpandedQuestions] = useState<Record<number, boolean>>({});

  const toggleQuestion = (index: number) => {
    setExpandedQuestions((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <Modal isOpen={true} onClose={onClose} title="Create Section" size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#446D6D] focus:ring-4 focus:ring-[#446D6D]/10 outline-none transition-all duration-200"
            rows={2}
          />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Section Type</label>
            <select
              value={formData.section_type}
              onChange={(e) => setFormData({ ...formData, section_type: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#446D6D] focus:ring-4 focus:ring-[#446D6D]/10 outline-none transition-all duration-200"
            >
              <option value="text">Text</option>
              <option value="video">Video</option>
              <option value="image">Image</option>
              <option value="audio">Audio</option>
              <option value="code">Code</option>
              <option value="file">File</option>
              <option value="pdf">PDF</option>
              <option value="embed">Embed</option>
              <option value="quiz">Quiz</option>
            </select>
          </div>
          <Input
            label="Order"
            type="number"
            value={formData.order}
            onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 1 })}
          />
          <Input
            label="Estimated Time (Minutes)"
            type="number"
            value={formData.estimated_time_minutes}
            onChange={(e) =>
              setFormData({ ...formData, estimated_time_minutes: parseInt(e.target.value) || 5 })
            }
          />
        </div>
        {/* Text Section Fields */}
        {formData.section_type === 'text' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Text Content</label>
            <textarea
              value={formData.text_content}
              onChange={(e) => setFormData({ ...formData, text_content: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#446D6D] focus:ring-4 focus:ring-[#446D6D]/10 outline-none transition-all duration-200"
              rows={6}
              placeholder="Enter text content (supports markdown)"
            />
          </div>
        )}

        {/* Video Section Fields */}
        {formData.section_type === 'video' && (
          <div className="space-y-4">
            <Input
              label="Video URL"
              value={formData.video_url}
              onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
              placeholder="https://example.com/video.mp4"
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Video Qualities (JSON)
              </label>
              <textarea
                value={formData.video_qualities}
                onChange={(e) => setFormData({ ...formData, video_qualities: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#446D6D] focus:ring-4 focus:ring-[#446D6D]/10 outline-none transition-all duration-200 font-mono text-sm"
                rows={4}
                placeholder='{"720p": "url", "480p": "url"}'
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Video Subtitles (JSON)
              </label>
              <textarea
                value={formData.video_subtitles}
                onChange={(e) => setFormData({ ...formData, video_subtitles: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#446D6D] focus:ring-4 focus:ring-[#446D6D]/10 outline-none transition-all duration-200 font-mono text-sm"
                rows={3}
                placeholder='[{"language": "en", "url": "..."}]'
              />
            </div>
            <Input
              label="Video Duration (Seconds)"
              type="number"
              value={formData.video_duration_seconds}
              onChange={(e) =>
                setFormData({ ...formData, video_duration_seconds: parseInt(e.target.value) || 0 })
              }
            />
            <p className="text-xs text-gray-500">
              Note: Video file uploads are handled separately. Use video_url for external videos.
            </p>
          </div>
        )}

        {/* Image Section Fields */}
        {formData.section_type === 'image' && (
          <div className="space-y-4">
            <Input
              label="Image URL"
              value={formData.image_url}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              placeholder="https://example.com/image.jpg"
            />
            <Input
              label="Image Caption"
              value={formData.image_caption}
              onChange={(e) => setFormData({ ...formData, image_caption: e.target.value })}
              placeholder="Caption for the image"
            />
            <p className="text-xs text-gray-500">
              Note: Image file uploads are handled separately. Use image_url for external images.
            </p>
          </div>
        )}

        {/* Audio Section Fields */}
        {formData.section_type === 'audio' && (
          <div className="space-y-4">
            <Input
              label="Audio URL"
              value={formData.audio_url}
              onChange={(e) => setFormData({ ...formData, audio_url: e.target.value })}
              placeholder="https://example.com/audio.mp3"
            />
            <Input
              label="Audio Duration (Seconds)"
              type="number"
              value={formData.audio_duration_seconds}
              onChange={(e) =>
                setFormData({ ...formData, audio_duration_seconds: parseInt(e.target.value) || 0 })
              }
            />
            <p className="text-xs text-gray-500">
              Note: Audio file uploads are handled separately. Use audio_url for external audio.
            </p>
          </div>
        )}

        {/* Code Section Fields */}
        {formData.section_type === 'code' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Code Content</label>
              <textarea
                value={formData.code_content}
                onChange={(e) => setFormData({ ...formData, code_content: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#446D6D] focus:ring-4 focus:ring-[#446D6D]/10 outline-none transition-all duration-200 font-mono text-sm"
                rows={8}
                placeholder="Enter code here..."
              />
            </div>
            <Input
              label="Code Language"
              value={formData.code_language}
              onChange={(e) => setFormData({ ...formData, code_language: e.target.value })}
              placeholder="python, javascript, java, etc."
            />
          </div>
        )}

        {/* File Section Fields */}
        {formData.section_type === 'file' && (
          <div className="space-y-4">
            <Input
              label="File URL"
              value={formData.file_url}
              onChange={(e) => setFormData({ ...formData, file_url: e.target.value })}
              placeholder="https://example.com/file.pdf"
            />
            <Input
              label="File Type"
              value={formData.file_type}
              onChange={(e) => setFormData({ ...formData, file_type: e.target.value })}
              placeholder="pdf, docx, xlsx, etc."
            />
            <p className="text-xs text-gray-500">
              Note: File uploads are handled separately. Use file_url for external files.
            </p>
          </div>
        )}

        {/* PDF Section Fields */}
        {formData.section_type === 'pdf' && (
          <div className="space-y-4">
            <Input
              label="PDF URL"
              value={formData.pdf_url}
              onChange={(e) => setFormData({ ...formData, pdf_url: e.target.value })}
              placeholder="https://example.com/document.pdf"
            />
            <p className="text-xs text-gray-500">
              Note: PDF file uploads are handled separately. Use pdf_url for external PDFs.
            </p>
          </div>
        )}

        {/* Embed Section Fields */}
        {formData.section_type === 'embed' && (
          <div className="space-y-4">
            <Input
              label="Embed URL"
              value={formData.embed_url}
              onChange={(e) => setFormData({ ...formData, embed_url: e.target.value })}
              placeholder="https://example.com/embed"
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Embed Code (HTML)</label>
              <textarea
                value={formData.embed_code}
                onChange={(e) => setFormData({ ...formData, embed_code: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#446D6D] focus:ring-4 focus:ring-[#446D6D]/10 outline-none transition-all duration-200 font-mono text-sm"
                rows={4}
                placeholder="<iframe src='...'></iframe>"
              />
            </div>
          </div>
        )}

        {/* Combined Section Fields */}
        {formData.section_type === 'combined' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Combined Content (JSON)
            </label>
            <textarea
              value={formData.combined_content}
              onChange={(e) => setFormData({ ...formData, combined_content: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#446D6D] focus:ring-4 focus:ring-[#446D6D]/10 outline-none transition-all duration-200 font-mono text-sm"
              rows={8}
              placeholder='{"layout": "side_by_side", "items": [{"type": "text", "content": "..."}]}'
            />
          </div>
        )}

        {/* Quiz Section - Questions Management */}
        {formData.section_type === 'quiz' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-gray-700">Quiz Questions</h4>
              <Button type="button" onClick={addQuizQuestion} size="sm" variant="outline">
                <Plus className="w-4 h-4 mr-1" />
                Add Question
              </Button>
            </div>

            {formData.quiz_questions.length === 0 ? (
              <div className="text-center py-6 text-gray-500 text-sm border-2 border-dashed border-gray-200 rounded-lg">
                No questions yet. Click "Add Question" to create one.
              </div>
            ) : (
              <div className="space-y-3">
                {formData.quiz_questions.map((question, qIndex) => (
                  <div key={question.id || qIndex} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2 flex-1">
                        <button
                          type="button"
                          onClick={() => toggleQuestion(qIndex)}
                          className="p-1 hover:bg-gray-200 rounded"
                        >
                          {expandedQuestions[qIndex] ? (
                            <ChevronDown className="w-4 h-4 text-gray-600" />
                          ) : (
                            <ChevronUp className="w-4 h-4 text-gray-600" />
                          )}
                        </button>
                        <span className="text-xs font-medium text-gray-500">Question {qIndex + 1}</span>
                      </div>
                      <Button
                        type="button"
                        onClick={() => removeQuizQuestion(qIndex)}
                        size="sm"
                        variant="danger"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>

                    {expandedQuestions[qIndex] !== false && (
                      <div className="space-y-3">
                        <Input
                          label="Question Text"
                          value={question.text}
                          onChange={(e) => updateQuizQuestion(qIndex, 'text', e.target.value)}
                          placeholder="Enter the question..."
                          required
                        />
                        <Input
                          label="Explanation (optional)"
                          value={question.explanation || ''}
                          onChange={(e) => updateQuizQuestion(qIndex, 'explanation', e.target.value)}
                          placeholder="Explanation shown after answering"
                        />
                        <div className="grid grid-cols-2 gap-4">
                          <Input
                            label="Order"
                            type="number"
                            value={question.order || qIndex + 1}
                            onChange={(e) => updateQuizQuestion(qIndex, 'order', parseInt(e.target.value) || qIndex + 1)}
                          />
                          <Input
                            label="Points"
                            type="number"
                            value={question.points || 1}
                            onChange={(e) => updateQuizQuestion(qIndex, 'points', parseInt(e.target.value) || 1)}
                          />
                        </div>

                        <div className="mt-4">
                          <div className="flex items-center justify-between mb-2">
                            <label className="text-sm font-medium text-gray-700">Options</label>
                            <Button
                              type="button"
                              onClick={() => addQuizOption(qIndex)}
                              size="sm"
                              variant="outline"
                            >
                              <Plus className="w-3 h-3 mr-1" />
                              Add Option
                            </Button>
                          </div>

                          {(!question.options || question.options.length === 0) ? (
                            <div className="text-center py-3 text-gray-400 text-xs border border-dashed border-gray-200 rounded">
                              No options. Add at least 2 options.
                            </div>
                          ) : (
                            <div className="space-y-2">
                              {question.options.map((option, oIndex) => (
                                <div key={option.id || oIndex} className="flex items-start gap-2 p-3 bg-white border border-gray-200 rounded">
                                  <div className="flex-1 space-y-2">
                                    <Input
                                      label={`Option ${oIndex + 1}`}
                                      value={option.text}
                                      onChange={(e) => updateQuizOption(qIndex, oIndex, 'text', e.target.value)}
                                      placeholder="Option text"
                                      required
                                    />
                                    <Input
                                      label="Explanation (optional)"
                                      value={option.explanation || ''}
                                      onChange={(e) => updateQuizOption(qIndex, oIndex, 'explanation', e.target.value)}
                                      placeholder="Why this option is correct/incorrect"
                                    />
                                  </div>
                                  <div className="flex flex-col items-center gap-2 pt-6">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                      <input
                                        type="checkbox"
                                        checked={option.is_correct}
                                        onChange={(e) => updateQuizOption(qIndex, oIndex, 'is_correct', e.target.checked)}
                                        className="w-4 h-4 text-[#446D6D] border-gray-300 rounded focus:ring-[#446D6D]"
                                      />
                                      <span className="text-xs font-medium text-gray-700">Correct</span>
                                    </label>
                                    {question.options && question.options.length > 2 && (
                                      <Button
                                        type="button"
                                        onClick={() => removeQuizOption(qIndex, oIndex)}
                                        size="sm"
                                        variant="danger"
                                      >
                                        <Trash2 className="w-3 h-3" />
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.is_required}
              onChange={(e) => setFormData({ ...formData, is_required: e.target.checked })}
              className="w-4 h-4 text-[#446D6D] border-gray-300 rounded focus:ring-[#446D6D]"
            />
            <span className="text-sm font-medium text-gray-700">Required</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.is_downloadable}
              onChange={(e) => setFormData({ ...formData, is_downloadable: e.target.checked })}
              className="w-4 h-4 text-[#446D6D] border-gray-300 rounded focus:ring-[#446D6D]"
            />
            <span className="text-sm font-medium text-gray-700">Downloadable</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.is_published}
              onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
              className="w-4 h-4 text-[#446D6D] border-gray-300 rounded focus:ring-[#446D6D]"
            />
            <span className="text-sm font-medium text-gray-700">Published</span>
          </label>
        </div>
        <div className="flex gap-3 pt-4">
          <Button type="submit" fullWidth>
            Create Section
          </Button>
          <Button type="button" variant="outline" onClick={onClose} fullWidth>
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
};


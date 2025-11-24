import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../components/layout';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Alert } from '../../components/common/Alert';
import {
  useGetCourseQuery,
  useCreateModuleMutation,
  useUpdateModuleMutation,
  useDeleteModuleMutation,
  useCreateLessonMutation,
  useUpdateLessonMutation,
  useDeleteLessonMutation,
  useCreateSectionMutation,
  useUpdateSectionMutation,
  useDeleteSectionMutation,
} from '../../store/api/contentApi';
import {
  ChevronRight,
  Plus,
  Edit2,
  Trash2,
  ChevronDown,
  Layers,
  FileText,
  Folder,
} from 'lucide-react';
import type { ContentModule, ContentLesson, ContentSection } from '../../interfaces/course';
import {
  ModuleEditModal,
  LessonEditModal,
  SectionEditModal,
  ModuleCreateModal,
  LessonCreateModal,
  SectionCreateModal,
} from './CourseDetailPageModals';

export const CourseDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: course, isLoading } = useGetCourseQuery(id!);
  const [createModule] = useCreateModuleMutation();
  const [updateModule] = useUpdateModuleMutation();
  const [deleteModule] = useDeleteModuleMutation();
  const [createLesson] = useCreateLessonMutation();
  const [updateLesson] = useUpdateLessonMutation();
  const [deleteLesson] = useDeleteLessonMutation();
  const [createSection] = useCreateSectionMutation();
  const [updateSection] = useUpdateSectionMutation();
  const [deleteSection] = useDeleteSectionMutation();

  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({});
  const [expandedLessons, setExpandedLessons] = useState<Record<string, boolean>>({});
  const [editingModule, setEditingModule] = useState<ContentModule | null>(null);
  const [editingLesson, setEditingLesson] = useState<ContentLesson | null>(null);
  const [editingSection, setEditingSection] = useState<ContentSection | null>(null);
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
            onClick={() => navigate('/admin/content/courses')}
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
                onClick={() => navigate('/admin/content/courses')}
              >
                Back to Courses
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Code:</span>
                <span className="ml-2 font-medium">{course.code}</span>
              </div>
              <div>
                <span className="text-gray-600">Type:</span>
                <span className="ml-2 font-medium">{course.course_type}</span>
              </div>
              <div>
                <span className="text-gray-600">Difficulty:</span>
                <span className="ml-2 font-medium">{course.difficulty}</span>
              </div>
              <div>
                <span className="text-gray-600">Status:</span>
                <span
                  className={`ml-2 font-medium ${
                    course.is_published ? 'text-green-600' : 'text-gray-600'
                  }`}
                >
                  {course.is_published ? 'Published' : 'Draft'}
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
            <Button onClick={() => handleCreateModule()} size="sm">
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
                onCreateSection={(lessonId, moduleId) => handleCreateSection(lessonId, moduleId)}
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
  module: ContentModule;
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
  onEditLesson: (lesson: ContentLesson) => void;
  onEditSection: (section: ContentSection) => void;
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
                  onEditSection={(section) => onEditSection(section)}
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
  lesson: ContentLesson;
  moduleId: string;
  isExpanded: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onCreateSection: () => void;
  onDeleteSection: (sectionId: string) => void;
  onEditSection: (section: ContentSection) => void;
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


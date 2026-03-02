import React, { useState } from 'react';
import { Button, Badge } from '../common';
import { Plus, Edit2, Trash2, ChevronDown, ChevronRight, GripVertical, FileText } from 'lucide-react';
import type { CourseLesson } from '../../interfaces/course';

interface LessonManagerProps {
  lessons: CourseLesson[];
  onCreateLesson: () => void;
  onEditLesson: (lesson: CourseLesson) => void;
  onDeleteLesson: (lessonId: string) => void;
}

export const LessonManager: React.FC<LessonManagerProps> = ({
  lessons,
  onCreateLesson,
  onEditLesson,
  onDeleteLesson,
}) => {
  const [expandedLessons, setExpandedLessons] = useState<Record<string, boolean>>({});

  const toggleLesson = (lessonId: string) => {
    setExpandedLessons((prev) => ({ ...prev, [lessonId]: !prev[lessonId] }));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-gray-900">Lessons</h4>
        <Button size="sm" variant="outline" onClick={onCreateLesson}>
          <Plus className="w-4 h-4" />
          Add Lesson
        </Button>
      </div>

      {lessons.length === 0 ? (
        <div className="border-2 border-dashed border-surface-border rounded-lg p-8 text-center">
          <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-500">No lessons yet</p>
        </div>
      ) : (
        <div className="space-y-2">
          {lessons.map((lesson, index) => (
            <div
              key={lesson.id}
              className="border border-surface-border rounded-lg bg-white hover:shadow-zlearn-sm transition-shadow duration-150"
            >
              <div className="p-3 flex items-center gap-3">
                <button
                  className="p-1 hover:bg-surface-muted rounded cursor-grab active:cursor-grabbing"
                  title="Drag to reorder"
                >
                  <GripVertical className="w-4 h-4 text-gray-400" />
                </button>
                <button
                  onClick={() => toggleLesson(lesson.id)}
                  className="p-1 hover:bg-surface-muted rounded transition-colors duration-150"
                >
                  {expandedLessons[lesson.id] ? (
                    <ChevronDown className="w-4 h-4 text-gray-600" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-gray-600" />
                  )}
                </button>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-gray-400">Lesson {index + 1}</span>
                    <span className="font-medium text-gray-900">{lesson.title}</span>
                    <Badge variant={lesson.is_published ? 'active' : 'draft'}>
                      {lesson.is_published ? 'Published' : 'Draft'}
                    </Badge>
                  </div>
                  {lesson.description && (
                    <p className="text-sm text-gray-500 mt-0.5">{lesson.description}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">
                    {lesson.section_count ?? 0} sections
                  </span>
                  <Button variant="outline" size="sm" onClick={() => onEditLesson(lesson)}>
                    <Edit2 className="w-3.5 h-3.5" />
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => onDeleteLesson(lesson.id)}>
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>

              {expandedLessons[lesson.id] && (
                <div className="border-t border-surface-border bg-surface-muted/20 p-3">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                    <div>
                      <p className="text-gray-500">Type</p>
                      <p className="font-medium text-gray-900 capitalize">{lesson.lesson_type}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Duration</p>
                      <p className="font-medium text-gray-900">
                        {lesson.duration_minutes ? `${lesson.duration_minutes} min` : '—'}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Difficulty</p>
                      <p className="font-medium text-gray-900 capitalize">
                        {lesson.difficulty || '—'}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Preview</p>
                      <p className="font-medium text-gray-900">
                        {lesson.is_preview ? 'Yes' : 'No'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

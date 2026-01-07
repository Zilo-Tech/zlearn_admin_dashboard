// src/components/ai-course-generation/OutlinePreview.tsx
import React, { useState } from 'react';
import { CourseOutline } from '../../interfaces/aiCourseGeneration';
import { ChevronDown, ChevronRight, BookOpen, Clock, Target, FileText, Video, Code, Image, File, CheckCircle2 } from 'lucide-react';

interface OutlinePreviewProps {
  outline: CourseOutline;
  onApprove?: () => void;
  onEdit?: () => void;
  isApproving?: boolean;
}

export const OutlinePreview: React.FC<OutlinePreviewProps> = ({
  outline,
  onApprove,
  onEdit,
  isApproving = false,
}) => {
  const [expandedModules, setExpandedModules] = useState<Set<number>>(new Set([0]));
  const [expandedLessons, setExpandedLessons] = useState<Set<string>>(new Set());

  const toggleModule = (moduleIndex: number) => {
    const newExpanded = new Set(expandedModules);
    if (newExpanded.has(moduleIndex)) {
      newExpanded.delete(moduleIndex);
    } else {
      newExpanded.add(moduleIndex);
    }
    setExpandedModules(newExpanded);
  };

  const toggleLesson = (moduleIndex: number, lessonIndex: number) => {
    const key = `${moduleIndex}-${lessonIndex}`;
    const newExpanded = new Set(expandedLessons);
    if (newExpanded.has(key)) {
      newExpanded.delete(key);
    } else {
      newExpanded.add(key);
    }
    setExpandedLessons(newExpanded);
  };

  const getSectionIcon = (sectionType: string) => {
    const icons: Record<string, any> = {
      video: Video,
      text: FileText,
      image: Image,
      code: Code,
      quiz: CheckCircle2,
      file: File,
    };
    return icons[sectionType] || FileText;
  };

  // Safely calculate totals with null checks
  const modules = outline?.modules || [];
  const totalLessons = modules.reduce((sum, m) => sum + (m.lessons?.length || 0), 0);
  const totalSections = modules.reduce(
    (sum, m) => sum + (m.lessons || []).reduce((s, l) => s + (l.sections?.length || 0), 0),
    0
  );

  return (
    <div className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#446D6D] to-[#5a8a8a] p-6 text-white">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-2xl font-bold mb-2">{outline?.course?.title || 'Course Outline'}</h3>
            <p className="text-white/90 text-sm leading-relaxed mb-4">
              {outline?.course?.description || 'No description available'}
            </p>
            <div className="flex flex-wrap gap-4 text-sm">
              {outline?.course?.estimated_hours && (
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{outline.course.estimated_hours} hours</span>
                </div>
              )}
              {outline?.course?.difficulty && (
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  <span className="capitalize">{outline.course.difficulty}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                <span>{modules.length} modules, {totalLessons} lessons, {totalSections} sections</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Learning Objectives */}
      {outline?.course?.learning_objectives && outline.course.learning_objectives.length > 0 && (
        <div className="p-6 bg-purple-50 border-b border-gray-200">
          <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <Target className="w-5 h-5 text-purple-600" />
            Learning Objectives
          </h4>
          <ul className="space-y-2">
            {outline.course.learning_objectives.map((objective, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                <CheckCircle2 className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                <span>{objective}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Modules */}
      <div className="divide-y divide-gray-200">
        {modules.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <p>No modules available yet. The outline is being generated...</p>
          </div>
        ) : (
          <>
            {modules.map((module, moduleIndex) => {
          const isModuleExpanded = expandedModules.has(moduleIndex);
          return (
            <div key={moduleIndex} className="bg-white">
              {/* Module Header */}
              <button
                onClick={() => toggleModule(moduleIndex)}
                className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1 text-left">
                  {isModuleExpanded ? (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-500" />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-gray-800">
                        Module {module.order}: {module.title}
                      </span>
                      {module.estimated_hours && (
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {module.estimated_hours}h
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{module.description}</p>
                    {module.learning_objectives && module.learning_objectives.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {module.learning_objectives.slice(0, 3).map((obj, idx) => (
                          <span
                            key={idx}
                            className="text-xs px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full"
                          >
                            {obj}
                          </span>
                        ))}
                        {module.learning_objectives.length > 3 && (
                          <span className="text-xs text-gray-500">
                            +{module.learning_objectives.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <span className="text-sm text-gray-500 ml-4">
                  {module.lessons?.length || 0} {(module.lessons?.length || 0) === 1 ? 'lesson' : 'lessons'}
                </span>
              </button>

              {/* Module Lessons */}
              {isModuleExpanded && (
                <div className="bg-gray-50 border-t border-gray-200">
                  {(module.lessons || []).map((lesson, lessonIndex) => {
                    const lessonKey = `${moduleIndex}-${lessonIndex}`;
                    const isLessonExpanded = expandedLessons.has(lessonKey);
                    return (
                      <div key={lessonIndex} className="border-b border-gray-200 last:border-b-0">
                        {/* Lesson Header */}
                        <button
                          onClick={() => toggleLesson(moduleIndex, lessonIndex)}
                          className="w-full p-4 pl-12 flex items-center justify-between hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-center gap-3 flex-1 text-left">
                            {isLessonExpanded ? (
                              <ChevronDown className="w-4 h-4 text-gray-500" />
                            ) : (
                              <ChevronRight className="w-4 h-4 text-gray-500" />
                            )}
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium text-gray-800">
                                  Lesson {lesson.order}: {lesson.title}
                                </span>
                                {lesson.duration && (
                                  <span className="text-xs text-gray-500">{lesson.duration}</span>
                                )}
                                {lesson.difficulty && (
                                  <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full capitalize">
                                    {lesson.difficulty}
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-gray-600">{lesson.description}</p>
                            </div>
                          </div>
                          <span className="text-sm text-gray-500 ml-4">
                            {lesson.sections?.length || 0} {(lesson.sections?.length || 0) === 1 ? 'section' : 'sections'}
                          </span>
                        </button>

                        {/* Lesson Sections */}
                        {isLessonExpanded && (
                          <div className="bg-white pl-20 pr-4 pb-4">
                            {(lesson.sections || []).map((section, sectionIndex) => {
                              const SectionIcon = getSectionIcon(section.section_type);
                              return (
                                <div
                                  key={sectionIndex}
                                  className="p-3 mb-2 bg-white border border-gray-200 rounded-lg hover:border-[#446D6D] transition-colors"
                                >
                                  <div className="flex items-start gap-3">
                                    <SectionIcon className="w-5 h-5 text-[#446D6D] mt-0.5 flex-shrink-0" />
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 mb-1">
                                        <span className="font-medium text-gray-800">
                                          {section.title}
                                        </span>
                                        <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full capitalize">
                                          {section.section_type}
                                        </span>
                                        {section.estimated_time_minutes && (
                                          <span className="text-xs text-gray-500">
                                            {section.estimated_time_minutes} min
                                          </span>
                                        )}
                                      </div>
                                      <p className="text-sm text-gray-600 mb-2">{section.description}</p>
                                      {section.text_content && (
                                        <p className="text-xs text-gray-500 line-clamp-2">
                                          {section.text_content.substring(0, 150)}...
                                        </p>
                                      )}
                                      {section.quiz_questions && section.quiz_questions.length > 0 && (
                                        <div className="mt-2 text-xs text-gray-500">
                                          {section.quiz_questions.length} quiz question
                                          {section.quiz_questions.length !== 1 ? 's' : ''}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
          </>
        )}
      </div>

      {/* Actions */}
      {(onApprove || onEdit) && (
        <div className="p-6 bg-gray-50 border-t border-gray-200 flex items-center justify-end gap-3">
          {onEdit && (
            <button
              onClick={onEdit}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Edit Requirements
            </button>
          )}
          {onApprove && (
            <button
              onClick={onApprove}
              disabled={isApproving}
              className="px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-[#446D6D] to-[#5a8a8a] rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isApproving ? 'Creating Course...' : 'Approve & Create Course'}
            </button>
          )}
        </div>
      )}
    </div>
  );
};


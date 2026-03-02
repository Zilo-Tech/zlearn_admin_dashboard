import React, { useState } from 'react';
import { Card, CardContent, Button } from '../common';
import { Plus, Edit2, Trash2, ChevronDown, ChevronRight, GripVertical } from 'lucide-react';
import type { CourseModule } from '../../interfaces/course';

interface ModuleManagerProps {
  modules: CourseModule[];
  onCreateModule: () => void;
  onEditModule: (module: CourseModule) => void;
  onDeleteModule: (moduleId: string) => void;
  onReorderModules?: (modules: CourseModule[]) => void;
}

export const ModuleManager: React.FC<ModuleManagerProps> = ({
  modules,
  onCreateModule,
  onEditModule,
  onDeleteModule,
  onReorderModules,
}) => {
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({});

  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) => ({ ...prev, [moduleId]: !prev[moduleId] }));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-gray-900">Course Modules</h3>
        <Button size="sm" onClick={onCreateModule}>
          <Plus className="w-4 h-4" />
          Add Module
        </Button>
      </div>

      {modules.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-gray-500">
            No modules yet. Click "Add Module" to create one.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {modules.map((module, index) => (
            <Card key={module.id} padding="none" className="overflow-hidden">
              <div className="p-4">
                <div className="flex items-center gap-3">
                  <button
                    className="p-1 hover:bg-surface-muted rounded cursor-grab active:cursor-grabbing"
                    title="Drag to reorder"
                  >
                    <GripVertical className="w-4 h-4 text-gray-400" />
                  </button>
                  <button
                    onClick={() => toggleModule(module.id)}
                    className="p-1 hover:bg-surface-muted rounded transition-colors duration-150"
                  >
                    {expandedModules[module.id] ? (
                      <ChevronDown className="w-4 h-4 text-gray-600" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-gray-600" />
                    )}
                  </button>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-gray-400">Module {index + 1}</span>
                      <h4 className="font-medium text-gray-900">{module.title}</h4>
                    </div>
                    {module.description && (
                      <p className="text-sm text-gray-500 mt-1">{module.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">
                      {module.lesson_count ?? 0} lessons
                    </span>
                    <Button variant="outline" size="sm" onClick={() => onEditModule(module)}>
                      <Edit2 className="w-3.5 h-3.5" />
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => onDeleteModule(module.id)}>
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </div>

              {expandedModules[module.id] && (
                <div className="border-t border-surface-border bg-surface-muted/30 p-4">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Duration</p>
                      <p className="font-medium text-gray-900">
                        {module.duration_minutes ? `${module.duration_minutes} min` : '—'}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Difficulty</p>
                      <p className="font-medium text-gray-900 capitalize">
                        {module.difficulty || '—'}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Learning Path</p>
                      <p className="font-medium text-gray-900 capitalize">
                        {module.learning_path || '—'}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Status</p>
                      <p className="font-medium text-gray-900">
                        {module.is_published ? 'Published' : 'Draft'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

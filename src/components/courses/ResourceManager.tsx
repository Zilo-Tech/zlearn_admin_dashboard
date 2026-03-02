import React from 'react';
import { Button, Badge } from '../common';
import { Plus, Edit2, Trash2, Download, FileText, Video, Image, File } from 'lucide-react';
import type { LearningResource } from '../../interfaces/course';

interface ResourceManagerProps {
  resources: LearningResource[];
  onCreateResource: () => void;
  onEditResource: (resource: LearningResource) => void;
  onDeleteResource: (resourceId: string) => void;
}

export const ResourceManager: React.FC<ResourceManagerProps> = ({
  resources,
  onCreateResource,
  onEditResource,
  onDeleteResource,
}) => {
  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'video':
        return Video;
      case 'image':
        return Image;
      case 'document':
      case 'pdf':
        return FileText;
      default:
        return File;
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '—';
    const mb = bytes / (1024 * 1024);
    return mb < 1 ? `${(bytes / 1024).toFixed(1)} KB` : `${mb.toFixed(1)} MB`;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-gray-900">Learning Resources</h4>
        <Button size="sm" variant="outline" onClick={onCreateResource}>
          <Plus className="w-4 h-4" />
          Add Resource
        </Button>
      </div>

      {resources.length === 0 ? (
        <div className="border-2 border-dashed border-surface-border rounded-lg p-8 text-center">
          <File className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-500">No resources yet</p>
        </div>
      ) : (
        <div className="space-y-2">
          {resources.map((resource) => {
            const ResourceIcon = getResourceIcon(resource.resource_type);
            return (
              <div
                key={resource.id}
                className="border border-surface-border rounded-lg bg-white p-3 hover:shadow-zlearn-sm transition-shadow duration-150"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-surface-muted rounded-lg flex items-center justify-center flex-shrink-0">
                    <ResourceIcon className="w-5 h-5 text-gray-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-gray-900 truncate">{resource.title}</p>
                      {resource.is_required && (
                        <Badge variant="default">Required</Badge>
                      )}
                      {resource.download_allowed && (
                        <Download className="w-3.5 h-3.5 text-gray-400" />
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                      <span className="capitalize">{resource.resource_type}</span>
                      {resource.file_size && <span>{formatFileSize(resource.file_size)}</span>}
                      {resource.duration && <span>{resource.duration}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="outline" size="sm" onClick={() => onEditResource(resource)}>
                      <Edit2 className="w-3.5 h-3.5" />
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => onDeleteResource(resource.id)}>
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

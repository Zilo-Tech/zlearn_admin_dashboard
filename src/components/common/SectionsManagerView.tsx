import React, { useState } from 'react';
import {
    Plus,
    Edit2,
    Trash2,
    GripVertical,
    Type,
    Video,
    Music,
    Image as ImageIcon,
    FileText,
    Code,
    Paperclip,
    Layout
} from 'lucide-react';
import { Button } from '../common/Button';
import { Alert } from '../common/Alert';

interface BaseSection {
    id: string;
    title: string;
    description?: string;
    section_type: string;
    order: number;
    is_published?: boolean;
    is_required?: boolean;
}

interface SectionsManagerProps<T extends BaseSection> {
    lessonId: string;
    sections: T[];
    isLoading: boolean;
    error?: any;
    onAddSection: () => void;
    onEditSection: (section: T) => void;
    onDeleteSection: (id: string) => void;
}

const getSectionIcon = (type: string) => {
    switch (type) {
        case 'text': return <Type className="w-5 h-5" />;
        case 'video': return <Video className="w-5 h-5" />;
        case 'audio': return <Music className="w-5 h-5" />;
        case 'image': return <ImageIcon className="w-5 h-5" />;
        case 'pdf': return <FileText className="w-5 h-5" />;
        case 'code': return <Code className="w-5 h-5" />;
        case 'file': return <Paperclip className="w-5 h-5" />;
        case 'embed': return <Layout className="w-5 h-5" />;
        default: return <Type className="w-5 h-5" />;
    }
};

const SectionsManagerView = <T extends BaseSection>({
    sections,
    isLoading,
    error,
    onAddSection,
    onEditSection,
    onDeleteSection
}: SectionsManagerProps<T>) => {
    if (isLoading) {
        return <div className="flex justify-center p-6"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#446D6D]"></div></div>;
    }

    if (error) {
        return <Alert type="error" message="Failed to load sections" />;
    }

    const sortedSections = [...(sections || [])].sort((a, b) => a.order - b.order);

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800">
                    Sections ({sortedSections.length})
                </h3>
                <Button
                    onClick={onAddSection}
                    size="sm"
                    icon={<Plus className="w-4 h-4" />}
                >
                    Add Section
                </Button>
            </div>

            {sortedSections.length === 0 ? (
                <div className="p-6 text-center bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-gray-500">
                        No content sections yet. Add a section to build your lesson.
                    </p>
                </div>
            ) : (
                <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-200">
                    {sortedSections.map((section) => (
                        <div key={section.id} className="p-4 flex items-center hover:bg-gray-50 transition-colors">
                            <div className="mr-3 text-gray-400 cursor-move">
                                <GripVertical className="w-5 h-5" />
                            </div>
                            <div className="mr-4 text-[#446D6D] bg-[#446D6D]/10 p-2 rounded-lg">
                                {getSectionIcon(section.section_type)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <h4 className="text-sm font-medium text-gray-900 truncate">{section.title}</h4>
                                    {section.is_published === false && (
                                        <span className="px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">Draft</span>
                                    )}
                                    {section.is_required && (
                                        <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-600 rounded-full">Required</span>
                                    )}
                                </div>
                                <p className="text-xs text-gray-500 truncate">
                                    {section.description || `${section.section_type.toUpperCase()} Content`}
                                </p>
                            </div>
                            <div className="flex items-center gap-2 ml-4">
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => onEditSection(section)}
                                >
                                    Edit
                                </Button>
                                <Button
                                    size="sm"
                                    variant="danger"
                                    onClick={() => onDeleteSection(section.id)}
                                >
                                    Delete
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SectionsManagerView;

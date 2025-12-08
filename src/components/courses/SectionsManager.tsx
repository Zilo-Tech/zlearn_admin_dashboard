import React, { useState } from 'react';
import { useGetCourseSectionsQuery, useDeleteCourseSectionMutation } from '../../store/api/coursesApi';
import { CourseSection } from '../../interfaces/course';
import SectionModal from './SectionModal';
import SectionsManagerView from '../common/SectionsManagerView';

interface SectionsManagerProps {
    lessonId: string;
}

const SectionsManager: React.FC<SectionsManagerProps> = ({ lessonId }) => {
    const { data: sections, isLoading, error } = useGetCourseSectionsQuery({ lesson: lessonId });
    const [deleteSection] = useDeleteCourseSectionMutation();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSection, setEditingSection] = useState<CourseSection | null>(null);

    const handleAddSection = () => {
        setEditingSection(null);
        setIsModalOpen(true);
    };

    const handleEditSection = (section: CourseSection) => {
        setEditingSection(section);
        setIsModalOpen(true);
    };

    const handleDeleteSection = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this section?')) {
            try {
                await deleteSection(id).unwrap();
            } catch (err) {
                console.error('Failed to delete section:', err);
            }
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingSection(null);
    };

    const sortedSections = [...(sections || [])].sort((a, b) => a.order - b.order);
    const nextOrder = sortedSections.length > 0 ? sortedSections[sortedSections.length - 1].order + 1 : 1;

    return (
        <div className="mt-4">
            <SectionsManagerView
                lessonId={lessonId}
                sections={sortedSections}
                isLoading={isLoading}
                error={error}
                onAddSection={handleAddSection}
                onEditSection={handleEditSection}
                onDeleteSection={handleDeleteSection}
            />

            <SectionModal
                open={isModalOpen}
                onClose={handleCloseModal}
                lessonId={lessonId}
                section={editingSection}
                order={editingSection ? editingSection.order : nextOrder}
            />
        </div>
    );
};

export default SectionsManager;

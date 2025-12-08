import React, { useState, useEffect } from 'react';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { CourseSection } from '../../interfaces/course';
import { useCreateCourseSectionMutation, useUpdateCourseSectionMutation } from '../../store/api/coursesApi';
import { Alert } from '../../components/common/Alert';

interface SectionModalProps {
    open: boolean;
    onClose: () => void;
    lessonId: string;
    section?: CourseSection | null;
    order: number;
}

const SECTION_TYPES = [
    { value: 'text', label: 'Text Content' },
    { value: 'video', label: 'Video' },
    { value: 'audio', label: 'Audio' },
    { value: 'image', label: 'Image' },
    { value: 'pdf', label: 'PDF Document' },
    { value: 'file', label: 'File Download' },
    { value: 'embed', label: 'Embed Code' },
    { value: 'code', label: 'Code Block' },
];

const SectionModal: React.FC<SectionModalProps> = ({ open, onClose, lessonId, section, order }) => {
    const [createSection, { isLoading: isCreating }] = useCreateCourseSectionMutation();
    const [updateSection, { isLoading: isUpdating }] = useUpdateCourseSectionMutation();

    const [formData, setFormData] = useState<{
        title: string;
        section_type: string;
        text_content: string;
        description: string;
        is_required: boolean;
        is_downloadable: boolean;
        is_published: boolean;
        video_file: File | null;
        audio_file: File | null;
        image: File | null;
        pdf_file: File | null;
        file_attachment: File | null;
        video_url: string;
        audio_url: string;
        image_url: string;
        pdf_url: string;
        file_url: string;
        embed_code: string;
        embed_url: string;
        code_content: string;
        code_language: string;
    }>({
        title: '',
        section_type: 'text',
        text_content: '',
        description: '',
        is_required: true,
        is_downloadable: false,
        is_published: true,
        video_file: null,
        audio_file: null,
        image: null,
        pdf_file: null,
        file_attachment: null,
        video_url: '',
        audio_url: '',
        image_url: '',
        pdf_url: '',
        file_url: '',
        embed_code: '',
        embed_url: '',
        code_content: '',
        code_language: 'javascript',
    });

    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (section) {
            setFormData({
                title: section.title,
                section_type: section.section_type,
                text_content: section.text_content || '',
                description: section.description || '',
                is_required: section.is_required,
                is_downloadable: section.is_downloadable,
                is_published: section.is_published,
                video_file: null,
                audio_file: null,
                image: null,
                pdf_file: null,
                file_attachment: null,
                video_url: section.video_url || '',
                audio_url: section.audio_url || '',
                image_url: section.image_url || '',
                pdf_url: section.pdf_url || '',
                file_url: section.file_url || '',
                embed_code: section.embed_code || '',
                embed_url: section.embed_url || '',
                code_content: section.code_content || '',
                code_language: section.code_language || 'javascript',
            });
        } else {
            setFormData({
                title: '',
                section_type: 'text',
                text_content: '',
                description: '',
                is_required: true,
                is_downloadable: false,
                is_published: true,
                video_file: null,
                audio_file: null,
                image: null,
                pdf_file: null,
                file_attachment: null,
                video_url: '',
                audio_url: '',
                image_url: '',
                pdf_url: '',
                file_url: '',
                embed_code: '',
                embed_url: '',
                code_content: '',
                code_language: 'javascript',
            });
        }
        setError(null);
    }, [section, open]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: checked }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
        if (e.target.files && e.target.files[0]) {
            setFormData(prev => ({ ...prev, [fieldName]: e.target.files![0] }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const submissionData = new FormData();
            submissionData.append('lesson', lessonId);
            submissionData.append('title', formData.title);
            submissionData.append('section_type', formData.section_type);
            submissionData.append('description', formData.description);
            submissionData.append('is_required', formData.is_required.toString());
            submissionData.append('is_downloadable', formData.is_downloadable.toString());
            submissionData.append('is_published', formData.is_published.toString());

            if (!section) {
                submissionData.append('order', order.toString());
            }

            // Append type-specific fields
            if (formData.section_type === 'text') {
                submissionData.append('text_content', formData.text_content);
            } else if (formData.section_type === 'video') {
                if (formData.video_file) submissionData.append('video_file', formData.video_file);
                if (formData.video_url) submissionData.append('video_url', formData.video_url);
            } else if (formData.section_type === 'audio') {
                if (formData.audio_file) submissionData.append('audio_file', formData.audio_file);
                if (formData.audio_url) submissionData.append('audio_url', formData.audio_url);
            } else if (formData.section_type === 'image') {
                if (formData.image) submissionData.append('image', formData.image);
                if (formData.image_url) submissionData.append('image_url', formData.image_url);
            } else if (formData.section_type === 'pdf') {
                if (formData.pdf_file) submissionData.append('pdf_file', formData.pdf_file);
                if (formData.pdf_url) submissionData.append('pdf_url', formData.pdf_url);
            } else if (formData.section_type === 'file') {
                if (formData.file_attachment) submissionData.append('file_attachment', formData.file_attachment);
                if (formData.file_url) submissionData.append('file_url', formData.file_url);
            } else if (formData.section_type === 'embed') {
                submissionData.append('embed_code', formData.embed_code);
                submissionData.append('embed_url', formData.embed_url);
            } else if (formData.section_type === 'code') {
                submissionData.append('code_content', formData.code_content);
                submissionData.append('code_language', formData.code_language);
            }

            if (section) {
                await updateSection({ id: section.id, data: submissionData }).unwrap();
            } else {
                await createSection(submissionData).unwrap();
            }
            onClose();
        } catch (err: any) {
            console.error('Failed to save section:', err);
            setError(err?.data?.message || 'Failed to save section. Please try again.');
        }
    };

    const isLoading = isCreating || isUpdating;

    return (
        <Modal
            isOpen={open}
            onClose={onClose}
            title={section ? 'Edit Section' : 'Add New Section'}
            size="lg"
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                {error && <Alert type="error" message={error} />}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                        <Input
                            label="Section Title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Section Type</label>
                        <select
                            name="section_type"
                            value={formData.section_type}
                            onChange={handleChange}
                            disabled={!!section}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#446D6D] focus:ring-4 focus:ring-[#446D6D]/10 outline-none transition-all duration-200"
                        >
                            {SECTION_TYPES.map((type) => (
                                <option key={type.value} value={type.value}>
                                    {type.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Dynamic Content Fields */}
                <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                    <h3 className="text-sm font-medium text-primary mb-3">
                        {SECTION_TYPES.find(t => t.value === formData.section_type)?.label} Content
                    </h3>

                    {formData.section_type === 'text' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Content (Markdown supported)</label>
                            <textarea
                                name="text_content"
                                value={formData.text_content}
                                onChange={handleChange}
                                rows={6}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#446D6D] focus:ring-4 focus:ring-[#446D6D]/10 outline-none transition-all duration-200"
                            />
                        </div>
                    )}

                    {formData.section_type === 'video' && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Upload Video File</label>
                                <input
                                    type="file"
                                    accept="video/*"
                                    onChange={(e) => handleFileChange(e, 'video_file')}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#446D6D] focus:ring-4 focus:ring-[#446D6D]/10 outline-none transition-all duration-200"
                                />
                                {formData.video_file && <p className="text-xs text-gray-500 mt-1">Selected: {formData.video_file.name}</p>}
                            </div>

                            <Input
                                label="Or Video URL (YouTube, Vimeo, etc.)"
                                name="video_url"
                                value={formData.video_url}
                                onChange={handleChange}
                            />
                        </div>
                    )}

                    {formData.section_type === 'audio' && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Upload Audio File</label>
                                <input
                                    type="file"
                                    accept="audio/*"
                                    onChange={(e) => handleFileChange(e, 'audio_file')}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#446D6D] focus:ring-4 focus:ring-[#446D6D]/10 outline-none transition-all duration-200"
                                />
                                {formData.audio_file && <p className="text-xs text-gray-500 mt-1">Selected: {formData.audio_file.name}</p>}
                            </div>

                            <Input
                                label="Or Audio URL"
                                name="audio_url"
                                value={formData.audio_url}
                                onChange={handleChange}
                            />
                        </div>
                    )}

                    {formData.section_type === 'image' && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Upload Image</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleFileChange(e, 'image')}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#446D6D] focus:ring-4 focus:ring-[#446D6D]/10 outline-none transition-all duration-200"
                                />
                                {formData.image && <p className="text-xs text-gray-500 mt-1">Selected: {formData.image.name}</p>}
                            </div>

                            <Input
                                label="Or Image URL"
                                name="image_url"
                                value={formData.image_url}
                                onChange={handleChange}
                            />
                        </div>
                    )}

                    {formData.section_type === 'pdf' && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Upload PDF</label>
                                <input
                                    type="file"
                                    accept="application/pdf"
                                    onChange={(e) => handleFileChange(e, 'pdf_file')}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#446D6D] focus:ring-4 focus:ring-[#446D6D]/10 outline-none transition-all duration-200"
                                />
                                {formData.pdf_file && <p className="text-xs text-gray-500 mt-1">Selected: {formData.pdf_file.name}</p>}
                            </div>

                            <Input
                                label="Or PDF URL"
                                name="pdf_url"
                                value={formData.pdf_url}
                                onChange={handleChange}
                            />
                        </div>
                    )}

                    {formData.section_type === 'file' && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Upload File</label>
                                <input
                                    type="file"
                                    onChange={(e) => handleFileChange(e, 'file_attachment')}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#446D6D] focus:ring-4 focus:ring-[#446D6D]/10 outline-none transition-all duration-200"
                                />
                                {formData.file_attachment && <p className="text-xs text-gray-500 mt-1">Selected: {formData.file_attachment.name}</p>}
                            </div>

                            <Input
                                label="Or File URL"
                                name="file_url"
                                value={formData.file_url}
                                onChange={handleChange}
                            />
                        </div>
                    )}

                    {formData.section_type === 'embed' && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Embed Code (HTML)</label>
                                <textarea
                                    name="embed_code"
                                    value={formData.embed_code}
                                    onChange={handleChange}
                                    rows={4}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#446D6D] focus:ring-4 focus:ring-[#446D6D]/10 outline-none transition-all duration-200"
                                />
                            </div>
                            <Input
                                label="Embed URL (iframe source)"
                                name="embed_url"
                                value={formData.embed_url}
                                onChange={handleChange}
                            />
                        </div>
                    )}

                    {formData.section_type === 'code' && (
                        <div className="space-y-4">
                            <Input
                                label="Language (e.g., python, javascript)"
                                name="code_language"
                                value={formData.code_language}
                                onChange={handleChange}
                            />
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Code Snippet</label>
                                <textarea
                                    name="code_content"
                                    value={formData.code_content}
                                    onChange={handleChange}
                                    rows={6}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#446D6D] focus:ring-4 focus:ring-[#446D6D]/10 outline-none transition-all duration-200 font-mono"
                                />
                            </div>
                        </div>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description / Instructions (Optional)</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={2}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#446D6D] focus:ring-4 focus:ring-[#446D6D]/10 outline-none transition-all duration-200"
                    />
                </div>

                <div className="flex gap-4 flex-wrap">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            name="is_published"
                            checked={formData.is_published}
                            onChange={handleCheckboxChange}
                            className="w-4 h-4 text-[#446D6D] border-gray-300 rounded focus:ring-[#446D6D]"
                        />
                        <span className="text-sm font-medium text-gray-700">Published</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            name="is_required"
                            checked={formData.is_required}
                            onChange={handleCheckboxChange}
                            className="w-4 h-4 text-[#446D6D] border-gray-300 rounded focus:ring-[#446D6D]"
                        />
                        <span className="text-sm font-medium text-gray-700">Required</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            name="is_downloadable"
                            checked={formData.is_downloadable}
                            onChange={handleCheckboxChange}
                            className="w-4 h-4 text-[#446D6D] border-gray-300 rounded focus:ring-[#446D6D]"
                        />
                        <span className="text-sm font-medium text-gray-700">Downloadable</span>
                    </label>
                </div>

                <div className="flex gap-3 pt-4">
                    <Button type="submit" fullWidth disabled={isLoading || !formData.title}>
                        {isLoading ? 'Saving...' : (section ? 'Update Section' : 'Create Section')}
                    </Button>
                    <Button type="button" variant="outline" onClick={onClose} fullWidth>
                        Cancel
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default SectionModal;

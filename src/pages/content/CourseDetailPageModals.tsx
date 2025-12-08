import React, { useState } from 'react';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Plus, Trash2, ChevronDown, ChevronUp, Upload } from 'lucide-react';
import type { ContentModule, ContentLesson, ContentSection, QuizQuestion } from '../../interfaces/course';

// Module Edit Modal
interface ModuleEditModalProps {
  module: ContentModule;
  onClose: () => void;
  onSave: (data: Partial<ContentModule>) => Promise<void>;
}

export const ModuleEditModal: React.FC<ModuleEditModalProps> = ({ module, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    title: module.title,
    description: module.description || '',
    order: module.order,
    estimated_hours: module.estimated_hours || 0,
    is_optional: module.is_optional,
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
            label="Estimated Hours"
            type="number"
            step="0.1"
            value={formData.estimated_hours}
            onChange={(e) =>
              setFormData({ ...formData, estimated_hours: parseFloat(e.target.value) || 0 })
            }
          />
        </div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.is_optional}
            onChange={(e) => setFormData({ ...formData, is_optional: e.target.checked })}
            className="w-4 h-4 text-[#446D6D] border-gray-300 rounded focus:ring-[#446D6D]"
          />
          <span className="text-sm font-medium text-gray-700">Optional Module</span>
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

// Lesson Edit Modal
interface LessonEditModalProps {
  lesson: ContentLesson;
  onClose: () => void;
  onSave: (data: Partial<ContentLesson>) => Promise<void>;
}

export const LessonEditModal: React.FC<LessonEditModalProps> = ({ lesson, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    title: lesson.title,
    description: lesson.description || '',
    order: lesson.order,
    content_type: lesson.content_type,
    duration: lesson.duration || '',
    difficulty: lesson.difficulty || 'easy',
    is_free: lesson.is_free,
    is_preview: lesson.is_preview,
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Content Type</label>
            <select
              value={formData.content_type}
              onChange={(e) => setFormData({ ...formData, content_type: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#446D6D] focus:ring-4 focus:ring-[#446D6D]/10 outline-none transition-all duration-200"
            >
              <option value="video">Video</option>
              <option value="text">Text</option>
              <option value="audio">Audio</option>
              <option value="interactive">Interactive</option>
            </select>
          </div>
          <Input
            label="Duration (PT30M)"
            value={formData.duration}
            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
            placeholder="PT30M"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
          <select
            value={formData.difficulty}
            onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#446D6D] focus:ring-4 focus:ring-[#446D6D]/10 outline-none transition-all duration-200"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.is_free}
              onChange={(e) => setFormData({ ...formData, is_free: e.target.checked })}
              className="w-4 h-4 text-[#446D6D] border-gray-300 rounded focus:ring-[#446D6D]"
            />
            <span className="text-sm font-medium text-gray-700">Free</span>
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

// Section Edit Modal
interface SectionEditModalProps {
  section: ContentSection;
  onClose: () => void;
  onSave: (data: Partial<ContentSection> | FormData) => Promise<void>;
}

export const SectionEditModal: React.FC<SectionEditModalProps> = ({ section, onSave, onClose }) => {
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
    quiz_questions: (section.quiz_questions || []) as QuizQuestion[],
  });

  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [documentFile, setDocumentFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const submitFormData = new FormData();

    // Append basic fields
    submitFormData.append('title', formData.title);
    submitFormData.append('description', formData.description);
    submitFormData.append('section_type', formData.section_type);
    submitFormData.append('order', formData.order.toString());
    submitFormData.append('estimated_time_minutes', formData.estimated_time_minutes.toString());
    submitFormData.append('is_required', formData.is_required.toString());
    submitFormData.append('is_downloadable', formData.is_downloadable.toString());
    submitFormData.append('is_published', formData.is_published.toString());

    // Add type-specific fields
    if (formData.section_type === 'text') {
      submitFormData.append('text_content', formData.text_content);
    } else if (formData.section_type === 'video') {
      submitFormData.append('video_url', formData.video_url);
      if (videoFile) {
        submitFormData.append('video_file', videoFile);
      }
      if (formData.video_qualities) {
        try {
          // Validate JSON but send as string if API expects JSON string or object
          // For FormData, we usually send JSON as string or individual fields
          // Assuming backend handles JSON string for these fields
          JSON.parse(formData.video_qualities);
          submitFormData.append('video_qualities', formData.video_qualities);
        } catch {
          // ignore invalid JSON
        }
      }
      if (formData.video_subtitles) {
        try {
          JSON.parse(formData.video_subtitles);
          submitFormData.append('video_subtitles', formData.video_subtitles);
        } catch {
          // ignore
        }
      }
      submitFormData.append('video_duration_seconds', formData.video_duration_seconds.toString());
    } else if (formData.section_type === 'image') {
      submitFormData.append('image_url', formData.image_url);
      submitFormData.append('image_caption', formData.image_caption);
      if (imageFile) {
        submitFormData.append('image_file', imageFile);
      }
    } else if (formData.section_type === 'audio') {
      submitFormData.append('audio_url', formData.audio_url);
      submitFormData.append('audio_duration_seconds', formData.audio_duration_seconds.toString());
      if (audioFile) {
        submitFormData.append('audio_file', audioFile);
      }
    } else if (formData.section_type === 'code') {
      submitFormData.append('code_content', formData.code_content);
      submitFormData.append('code_language', formData.code_language);
    } else if (formData.section_type === 'file') {
      submitFormData.append('file_url', formData.file_url);
      submitFormData.append('file_type', formData.file_type);
      if (documentFile) {
        submitFormData.append('file_resource', documentFile);
      }
    } else if (formData.section_type === 'pdf') {
      submitFormData.append('pdf_url', formData.pdf_url);
      if (documentFile) {
        submitFormData.append('file_resource', documentFile);
      }
    } else if (formData.section_type === 'embed') {
      submitFormData.append('embed_url', formData.embed_url);
      submitFormData.append('embed_code', formData.embed_code);
    } else if (formData.section_type === 'combined') {
      if (formData.combined_content) {
        submitFormData.append('combined_content', formData.combined_content);
      }
    } else if (formData.section_type === 'quiz') {
      // Transform quiz questions for submission
      const questions = formData.quiz_questions.map((q, qIndex) => ({
        text: q.text,
        explanation: q.explanation || '',
        order: q.order || qIndex + 1,
        options: (q.options || []).map((opt, oIndex) => ({
          text: opt.text,
          is_correct: opt.is_correct,
          explanation: opt.explanation || '',
          order: opt.order || oIndex + 1,
        })),
      }));
      submitFormData.append('quiz_questions', JSON.stringify(questions));
    } else if (
      formData.section_type === 'past_questions' ||
      formData.section_type === 'exam_tips' ||
      formData.section_type === 'mock_exam'
    ) {
      submitFormData.append('text_content', formData.text_content);
    }

    await onSave(submitFormData);
  };

  const addQuizQuestion = () => {
    const newQuestion = {
      id: `temp-${Date.now()}`,
      section: section.id,
      text: '',
      explanation: '',
      order: formData.quiz_questions.length + 1,
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
              <option value="past_questions">Past Questions</option>
              <option value="exam_tips">Exam Tips</option>
              <option value="mock_exam">Mock Exam</option>
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
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Upload Video File</label>
              <input
                type="file"
                accept="video/*"
                onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#446D6D]/10 file:text-[#446D6D] hover:file:bg-[#446D6D]/20"
              />
              <p className="text-xs text-gray-500">Uploading a file will override the URL.</p>
            </div>
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
              Note: Use video_url for external videos or upload a file.
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
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Upload Image File</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#446D6D]/10 file:text-[#446D6D] hover:file:bg-[#446D6D]/20"
              />
            </div>
            <Input
              label="Image Caption"
              value={formData.image_caption}
              onChange={(e) => setFormData({ ...formData, image_caption: e.target.value })}
              placeholder="Caption for the image"
            />
            <p className="text-xs text-gray-500">
              Note: Use image_url for external images or upload a file.
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
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Upload Audio File</label>
              <input
                type="file"
                accept="audio/*"
                onChange={(e) => setAudioFile(e.target.files?.[0] || null)}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#446D6D]/10 file:text-[#446D6D] hover:file:bg-[#446D6D]/20"
              />
            </div>
            <Input
              label="Audio Duration (Seconds)"
              type="number"
              value={formData.audio_duration_seconds}
              onChange={(e) =>
                setFormData({ ...formData, audio_duration_seconds: parseInt(e.target.value) || 0 })
              }
            />
            <p className="text-xs text-gray-500">
              Note: Use audio_url for external audio or upload a file.
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
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Upload File</label>
              <input
                type="file"
                onChange={(e) => setDocumentFile(e.target.files?.[0] || null)}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#446D6D]/10 file:text-[#446D6D] hover:file:bg-[#446D6D]/20"
              />
            </div>
            <Input
              label="File Type"
              value={formData.file_type}
              onChange={(e) => setFormData({ ...formData, file_type: e.target.value })}
              placeholder="pdf, docx, xlsx, etc."
            />
            <p className="text-xs text-gray-500">
              Note: Use file_url for external files or upload a file.
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
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Upload PDF File</label>
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => setDocumentFile(e.target.files?.[0] || null)}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#446D6D]/10 file:text-[#446D6D] hover:file:bg-[#446D6D]/20"
              />
            </div>
            <p className="text-xs text-gray-500">
              Note: Use pdf_url for external PDFs or upload a file.
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
                        <Input
                          label="Order"
                          type="number"
                          value={question.order || qIndex + 1}
                          onChange={(e) => updateQuizQuestion(qIndex, 'order', parseInt(e.target.value) || qIndex + 1)}
                        />

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

        {/* Past Questions, Exam Tips, Mock Exam - use text content */}
        {(formData.section_type === 'past_questions' ||
          formData.section_type === 'exam_tips' ||
          formData.section_type === 'mock_exam') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
              <textarea
                value={formData.text_content}
                onChange={(e) => setFormData({ ...formData, text_content: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#446D6D] focus:ring-4 focus:ring-[#446D6D]/10 outline-none transition-all duration-200"
                rows={6}
                placeholder="Enter content here..."
              />
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
  onSave: (data: Partial<ContentModule>) => Promise<void>;
}

export const ModuleCreateModal: React.FC<ModuleCreateModalProps> = ({
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
    estimated_hours: 0,
    is_optional: false,
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
            label="Estimated Hours"
            type="number"
            step="0.1"
            value={formData.estimated_hours}
            onChange={(e) =>
              setFormData({ ...formData, estimated_hours: parseFloat(e.target.value) || 0 })
            }
          />
        </div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.is_optional}
            onChange={(e) => setFormData({ ...formData, is_optional: e.target.checked })}
            className="w-4 h-4 text-[#446D6D] border-gray-300 rounded focus:ring-[#446D6D]"
          />
          <span className="text-sm font-medium text-gray-700">Optional Module</span>
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
  onSave: (data: Partial<ContentLesson>) => Promise<void>;
}

export const LessonCreateModal: React.FC<LessonCreateModalProps> = ({
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
    content_type: 'video',
    duration: '',
    difficulty: 'easy',
    is_free: true,
    is_preview: false,
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Content Type</label>
            <select
              value={formData.content_type}
              onChange={(e) => setFormData({ ...formData, content_type: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#446D6D] focus:ring-4 focus:ring-[#446D6D]/10 outline-none transition-all duration-200"
            >
              <option value="video">Video</option>
              <option value="text">Text</option>
              <option value="audio">Audio</option>
              <option value="interactive">Interactive</option>
            </select>
          </div>
          <Input
            label="Duration (PT30M)"
            value={formData.duration}
            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
            placeholder="PT30M"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
          <select
            value={formData.difficulty}
            onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#446D6D] focus:ring-4 focus:ring-[#446D6D]/10 outline-none transition-all duration-200"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.is_free}
              onChange={(e) => setFormData({ ...formData, is_free: e.target.checked })}
              className="w-4 h-4 text-[#446D6D] border-gray-300 rounded focus:ring-[#446D6D]"
            />
            <span className="text-sm font-medium text-gray-700">Free</span>
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
  onSave: (data: Partial<ContentSection> | FormData) => Promise<void>;
}

export const SectionCreateModal: React.FC<SectionCreateModalProps> = ({
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
    quiz_questions: [] as QuizQuestion[],
  });

  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [documentFile, setDocumentFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const submitFormData = new FormData();

    // Append basic fields
    submitFormData.append('lesson', formData.lesson);
    submitFormData.append('title', formData.title);
    submitFormData.append('description', formData.description);
    submitFormData.append('section_type', formData.section_type);
    submitFormData.append('order', formData.order.toString());
    submitFormData.append('estimated_time_minutes', formData.estimated_time_minutes.toString());
    submitFormData.append('is_required', formData.is_required.toString());
    submitFormData.append('is_downloadable', formData.is_downloadable.toString());
    submitFormData.append('is_published', formData.is_published.toString());

    // Add type-specific fields
    if (formData.section_type === 'text') {
      submitFormData.append('text_content', formData.text_content);
    } else if (formData.section_type === 'video') {
      submitFormData.append('video_url', formData.video_url);
      if (videoFile) {
        submitFormData.append('video_file', videoFile);
      }
      if (formData.video_qualities) {
        try {
          JSON.parse(formData.video_qualities);
          submitFormData.append('video_qualities', formData.video_qualities);
        } catch {
          // ignore
        }
      }
      if (formData.video_subtitles) {
        try {
          JSON.parse(formData.video_subtitles);
          submitFormData.append('video_subtitles', formData.video_subtitles);
        } catch {
          // ignore
        }
      }
      submitFormData.append('video_duration_seconds', formData.video_duration_seconds.toString());
    } else if (formData.section_type === 'image') {
      submitFormData.append('image_url', formData.image_url);
      submitFormData.append('image_caption', formData.image_caption);
      if (imageFile) {
        submitFormData.append('image_file', imageFile);
      }
    } else if (formData.section_type === 'audio') {
      submitFormData.append('audio_url', formData.audio_url);
      submitFormData.append('audio_duration_seconds', formData.audio_duration_seconds.toString());
      if (audioFile) {
        submitFormData.append('audio_file', audioFile);
      }
    } else if (formData.section_type === 'code') {
      submitFormData.append('code_content', formData.code_content);
      submitFormData.append('code_language', formData.code_language);
    } else if (formData.section_type === 'file') {
      submitFormData.append('file_url', formData.file_url);
      submitFormData.append('file_type', formData.file_type);
      if (documentFile) {
        submitFormData.append('file_resource', documentFile);
      }
    } else if (formData.section_type === 'pdf') {
      submitFormData.append('pdf_url', formData.pdf_url);
      if (documentFile) {
        submitFormData.append('file_resource', documentFile);
      }
    } else if (formData.section_type === 'embed') {
      submitFormData.append('embed_url', formData.embed_url);
      submitFormData.append('embed_code', formData.embed_code);
    } else if (formData.section_type === 'combined') {
      if (formData.combined_content) {
        submitFormData.append('combined_content', formData.combined_content);
      }
    } else if (
      formData.section_type === 'past_questions' ||
      formData.section_type === 'exam_tips' ||
      formData.section_type === 'mock_exam'
    ) {
      submitFormData.append('text_content', formData.text_content);
    } else if (formData.section_type === 'quiz') {
      // Transform quiz questions for submission
      const questions = formData.quiz_questions.map((q, qIndex) => ({
        text: q.text,
        explanation: q.explanation || '',
        order: q.order || qIndex + 1,
        options: (q.options || []).map((opt, oIndex) => ({
          text: opt.text,
          is_correct: opt.is_correct,
          explanation: opt.explanation || '',
          order: opt.order || oIndex + 1,
        })),
      }));
      submitFormData.append('quiz_questions', JSON.stringify(questions));
    }

    await onSave(submitFormData);
  };

  const addQuizQuestion = () => {
    const newQuestion = {
      id: `temp-${Date.now()}`,
      section: '',
      text: '',
      explanation: '',
      order: formData.quiz_questions.length + 1,
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
              <option value="past_questions">Past Questions</option>
              <option value="exam_tips">Exam Tips</option>
              <option value="mock_exam">Mock Exam</option>
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
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Upload Video File</label>
              <input
                type="file"
                accept="video/*"
                onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#446D6D]/10 file:text-[#446D6D] hover:file:bg-[#446D6D]/20"
              />
              <p className="text-xs text-gray-500">Uploading a file will override the URL.</p>
            </div>
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
              Note: Use video_url for external videos or upload a file.
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
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Upload Image File</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#446D6D]/10 file:text-[#446D6D] hover:file:bg-[#446D6D]/20"
              />
            </div>
            <Input
              label="Image Caption"
              value={formData.image_caption}
              onChange={(e) => setFormData({ ...formData, image_caption: e.target.value })}
              placeholder="Caption for the image"
            />
            <p className="text-xs text-gray-500">
              Note: Use image_url for external images or upload a file.
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
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Upload Audio File</label>
              <input
                type="file"
                accept="audio/*"
                onChange={(e) => setAudioFile(e.target.files?.[0] || null)}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#446D6D]/10 file:text-[#446D6D] hover:file:bg-[#446D6D]/20"
              />
            </div>
            <Input
              label="Audio Duration (Seconds)"
              type="number"
              value={formData.audio_duration_seconds}
              onChange={(e) =>
                setFormData({ ...formData, audio_duration_seconds: parseInt(e.target.value) || 0 })
              }
            />
            <p className="text-xs text-gray-500">
              Note: Use audio_url for external audio or upload a file.
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
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Upload File</label>
              <input
                type="file"
                onChange={(e) => setDocumentFile(e.target.files?.[0] || null)}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#446D6D]/10 file:text-[#446D6D] hover:file:bg-[#446D6D]/20"
              />
            </div>
            <Input
              label="File Type"
              value={formData.file_type}
              onChange={(e) => setFormData({ ...formData, file_type: e.target.value })}
              placeholder="pdf, docx, xlsx, etc."
            />
            <p className="text-xs text-gray-500">
              Note: Use file_url for external files or upload a file.
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
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Upload PDF File</label>
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => setDocumentFile(e.target.files?.[0] || null)}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#446D6D]/10 file:text-[#446D6D] hover:file:bg-[#446D6D]/20"
              />
            </div>
            <p className="text-xs text-gray-500">
              Note: Use pdf_url for external PDFs or upload a file.
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
                        <Input
                          label="Order"
                          type="number"
                          value={question.order || qIndex + 1}
                          onChange={(e) => updateQuizQuestion(qIndex, 'order', parseInt(e.target.value) || qIndex + 1)}
                        />

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

        {/* Past Questions, Exam Tips, Mock Exam - use text content */}
        {(formData.section_type === 'past_questions' ||
          formData.section_type === 'exam_tips' ||
          formData.section_type === 'mock_exam') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
              <textarea
                value={formData.text_content}
                onChange={(e) => setFormData({ ...formData, text_content: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#446D6D] focus:ring-4 focus:ring-[#446D6D]/10 outline-none transition-all duration-200"
                rows={6}
                placeholder="Enter content here..."
              />
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

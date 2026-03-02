import React, { useState } from 'react';
import { Card, Button, Input } from '../common';
import { Plus, Trash2, ChevronDown, ChevronUp, GripVertical } from 'lucide-react';
import type { SectionQuizQuestion } from '../../interfaces/course';

interface QuizBuilderProps {
  questions: SectionQuizQuestion[];
  onChange: (questions: SectionQuizQuestion[]) => void;
}

export const QuizBuilder: React.FC<QuizBuilderProps> = ({ questions, onChange }) => {
  const [expandedQuestions, setExpandedQuestions] = useState<Record<number, boolean>>({});

  const addQuestion = () => {
    const newQuestion: SectionQuizQuestion = {
      id: `temp-${Date.now()}`,
      section: '',
      text: '',
      explanation: '',
      order: questions.length + 1,
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
    onChange([...questions, newQuestion]);
  };

  const removeQuestion = (index: number) => {
    onChange(questions.filter((_, i) => i !== index));
  };

  const updateQuestion = (index: number, field: string, value: any) => {
    const updated = [...questions];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const addOption = (questionIndex: number) => {
    const updated = [...questions];
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
    onChange(updated);
  };

  const removeOption = (questionIndex: number, optionIndex: number) => {
    const updated = [...questions];
    updated[questionIndex] = {
      ...updated[questionIndex],
      options: updated[questionIndex].options?.filter((_, i) => i !== optionIndex) || [],
    };
    onChange(updated);
  };

  const updateOption = (questionIndex: number, optionIndex: number, field: string, value: any) => {
    const updated = [...questions];
    const options = [...(updated[questionIndex].options || [])];
    options[optionIndex] = { ...options[optionIndex], [field]: value };
    updated[questionIndex] = { ...updated[questionIndex], options };
    onChange(updated);
  };

  const toggleQuestion = (index: number) => {
    setExpandedQuestions((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-gray-900">Quiz Questions</h4>
        <Button size="sm" variant="outline" onClick={addQuestion}>
          <Plus className="w-4 h-4" />
          Add Question
        </Button>
      </div>

      {questions.length === 0 ? (
        <div className="border-2 border-dashed border-surface-border rounded-lg p-8 text-center">
          <p className="text-sm text-gray-500">No questions yet. Click "Add Question" to create one.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {questions.map((question, qIndex) => (
            <Card key={question.id || qIndex} padding="none" className="overflow-hidden">
              <div className="p-3 bg-surface-muted/30">
                <div className="flex items-center gap-3">
                  <button className="p-1 hover:bg-surface-muted rounded cursor-grab">
                    <GripVertical className="w-4 h-4 text-gray-400" />
                  </button>
                  <button
                    onClick={() => toggleQuestion(qIndex)}
                    className="p-1 hover:bg-surface-muted rounded transition-colors duration-150"
                  >
                    {expandedQuestions[qIndex] !== false ? (
                      <ChevronDown className="w-4 h-4 text-gray-600" />
                    ) : (
                      <ChevronUp className="w-4 h-4 text-gray-600" />
                    )}
                  </button>
                  <div className="flex-1">
                    <span className="text-xs font-medium text-gray-500">Question {qIndex + 1}</span>
                    {question.text && (
                      <p className="text-sm text-gray-900 mt-0.5">{question.text}</p>
                    )}
                  </div>
                  <Button variant="danger" size="sm" onClick={() => removeQuestion(qIndex)}>
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>

              {expandedQuestions[qIndex] !== false && (
                <div className="p-4 space-y-4">
                  <Input
                    label="Question Text *"
                    value={question.text}
                    onChange={(e) => updateQuestion(qIndex, 'text', e.target.value)}
                    placeholder="Enter the question..."
                    required
                  />
                  <Input
                    label="Explanation (optional)"
                    value={question.explanation || ''}
                    onChange={(e) => updateQuestion(qIndex, 'explanation', e.target.value)}
                    placeholder="Explanation shown after answering"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Points"
                      type="number"
                      value={question.points || 1}
                      onChange={(e) => updateQuestion(qIndex, 'points', parseInt(e.target.value) || 1)}
                    />
                    <Input
                      label="Order"
                      type="number"
                      value={question.order || qIndex + 1}
                      onChange={(e) => updateQuestion(qIndex, 'order', parseInt(e.target.value) || qIndex + 1)}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-gray-700">Options</label>
                      <Button size="sm" variant="outline" onClick={() => addOption(qIndex)}>
                        <Plus className="w-3.5 h-3.5" />
                        Add Option
                      </Button>
                    </div>

                    {(!question.options || question.options.length === 0) ? (
                      <div className="text-center py-3 text-gray-400 text-xs border border-dashed border-surface-border rounded-lg">
                        No options. Add at least 2 options.
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {question.options.map((option, oIndex) => (
                          <div
                            key={option.id || oIndex}
                            className="flex items-start gap-2 p-3 bg-surface-muted/30 border border-surface-border rounded-lg"
                          >
                            <div className="flex-1 space-y-2">
                              <Input
                                label={`Option ${oIndex + 1} *`}
                                value={option.text}
                                onChange={(e) => updateOption(qIndex, oIndex, 'text', e.target.value)}
                                placeholder="Option text"
                                required
                              />
                              <Input
                                label="Explanation (optional)"
                                value={option.explanation || ''}
                                onChange={(e) => updateOption(qIndex, oIndex, 'explanation', e.target.value)}
                                placeholder="Why this option is correct/incorrect"
                              />
                            </div>
                            <div className="flex flex-col items-center gap-2 pt-6">
                              <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={option.is_correct}
                                  onChange={(e) => updateOption(qIndex, oIndex, 'is_correct', e.target.checked)}
                                  className="w-4 h-4 text-zlearn-primary border-gray-300 rounded focus:ring-zlearn-primary/20"
                                />
                                <span className="text-xs font-medium text-gray-700">Correct</span>
                              </label>
                              {question.options && question.options.length > 2 && (
                                <Button size="sm" variant="danger" onClick={() => removeOption(qIndex, oIndex)}>
                                  <Trash2 className="w-3.5 h-3.5" />
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
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

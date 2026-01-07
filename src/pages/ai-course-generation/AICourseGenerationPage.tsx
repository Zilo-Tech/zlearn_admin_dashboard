// src/pages/ai-course-generation/AICourseGenerationPage.tsx
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AdminLayout } from '../../components/layout';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Alert } from '../../components/common/Alert';
import { Modal } from '../../components/common/Modal';
import {
  StatusBadge,
  ChatMessage,
  OutlinePreview,
  CollectedDataDisplay,
} from '../../components/ai-course-generation';
import {
  useStartSessionMutation,
  useChatMutation,
  useGenerateOutlineMutation,
  useApproveAndCreateMutation,
  useGetSessionQuery,
  useCancelSessionMutation,
} from '../../store/api/aiCourseGenerationApi';
import type { AppType } from '../../interfaces/aiCourseGeneration';
import {
  Send,
  Sparkles,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
  GraduationCap,
  Briefcase,
  ArrowLeft,
  MessageSquare,
} from 'lucide-react';

export const AICourseGenerationPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [selectedAppType, setSelectedAppType] = useState<AppType | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Helper function to safely extract error message as string
  const getErrorMessage = (error: any): string => {
    if (typeof error === 'string') return error;
    if (error?.data?.error) {
      const err = error.data.error;
      if (typeof err === 'string') return err;
      if (err?.message) return String(err.message);
      if (typeof err === 'object') return JSON.stringify(err);
    }
    if (error?.data?.message) {
      const msg = error.data.message;
      if (typeof msg === 'string') return msg;
      if (typeof msg === 'object') return JSON.stringify(msg);
    }
    if (error?.message) {
      if (typeof error.message === 'string') return error.message;
      if (typeof error.message === 'object') return JSON.stringify(error.message);
    }
    if (error?.data && typeof error.data === 'object') {
      // Try to extract message from error.data object
      if (error.data.details) {
        if (typeof error.data.details === 'string') return error.data.details;
        if (typeof error.data.details === 'object') {
          return Object.entries(error.data.details)
            .map(([key, val]) => `${key}: ${Array.isArray(val) ? val.join(', ') : String(val)}`)
            .join('; ');
        }
      }
    }
    return 'An unexpected error occurred. Please try again.';
  };

  const [startSession, { isLoading: isStarting }] = useStartSessionMutation();
  const [chat, { isLoading: isChatting }] = useChatMutation();
  const [generateOutline, { isLoading: isGeneratingOutline }] = useGenerateOutlineMutation();
  const [approveAndCreate, { isLoading: isApproving }] = useApproveAndCreateMutation();
  const [cancelSession] = useCancelSessionMutation();

  // Check for session ID in URL params (for resuming sessions)
  useEffect(() => {
    const urlSessionId = searchParams.get('session');
    if (urlSessionId && !sessionId) {
      setSessionId(urlSessionId);
    }
  }, [searchParams, sessionId]);

  // Get session data
  const { data: session, isLoading: isLoadingSession } = useGetSessionQuery(sessionId || '', {
    skip: !sessionId,
  });

  // Set app type from session when loaded
  useEffect(() => {
    if (session?.app_type && !selectedAppType) {
      setSelectedAppType(session.app_type);
    }
  }, [session?.app_type, selectedAppType]);

  // Enable polling when status is 'generating_course'
  const shouldPoll = session?.status === 'generating_course';
  const { data: polledSession } = useGetSessionQuery(sessionId || '', {
    skip: !sessionId || !shouldPoll,
    pollingInterval: shouldPoll ? 2000 : 0,
  });

  // Use polled session if available, otherwise use regular session
  const currentSession = polledSession || session;

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentSession?.conversation_history]);

  // Focus input when ready
  useEffect(() => {
    if (
      currentSession &&
      (currentSession.status === 'collecting_requirements' || currentSession.status === 'collecting_info') &&
      !isChatting &&
      inputRef.current
    ) {
      inputRef.current.focus();
    }
  }, [currentSession, isChatting]);

  const handleStartSession = async (appType: AppType, initialMessage?: string) => {
    setError(null);
    setSelectedAppType(appType);
    try {
      const result = await startSession({
        app_type: appType,
        initial_message: initialMessage,
      }).unwrap();
      // Use 'id' from API response, fallback to 'session_id' if present
      setSessionId(result.id || result.session_id || '');
    } catch (error: any) {
      setSelectedAppType(null);
      setError(getErrorMessage(error) || 'Failed to start session. Please try again.');
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !sessionId || isChatting) return;

    const messageToSend = message.trim();
    setMessage('');
    setError(null);

    try {
      await chat({
        session_id: sessionId,
        message: messageToSend,
      }).unwrap();
    } catch (error: any) {
      setError(getErrorMessage(error) || 'Failed to send message. Please try again.');
      setMessage(messageToSend); // Restore message on error
    }
  };

  const handleGenerateOutline = async () => {
    if (!sessionId) return;

    setError(null);
    try {
      await generateOutline({ session_id: sessionId }).unwrap();
    } catch (error: any) {
      setError(getErrorMessage(error) || 'Failed to generate outline. Please try again.');
    }
  };

  const handleApproveAndCreate = async () => {
    if (!sessionId) return;

    setError(null);
    try {
      const result = await approveAndCreate({ session_id: sessionId }).unwrap();
      // Navigate to the created course
      if (result.course_id) {
        const coursePath =
          selectedAppType === 'content'
            ? `/admin/content/courses/${result.course_id}`
            : `/admin/courses/courses/${result.course_id}`;
        navigate(coursePath);
      }
    } catch (error: any) {
      setError(getErrorMessage(error) || 'Failed to create course. Please try again.');
    }
  };

  const handleCancelSession = async () => {
    if (!sessionId) return;

    try {
      await cancelSession(sessionId).unwrap();
      setSessionId(null);
      setSelectedAppType(null);
      setMessage('');
      setShowCancelConfirm(false);
      setError(null);
    } catch (error: any) {
      setError(getErrorMessage(error) || 'Failed to cancel session. Please try again.');
      setShowCancelConfirm(false);
    }
  };

  const handleNewSession = () => {
    setSessionId(null);
    setSelectedAppType(null);
    setMessage('');
  };

  // Initial screen - select course type
  if (!sessionId && !selectedAppType) {
    return (
      <AdminLayout>
        <div className="p-8 max-w-4xl mx-auto">
          {/* Back Button */}
          <div className="mb-6 flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/admin/dashboard')}
              icon={<ArrowLeft className="w-4 h-4" />}
            >
              Back to Dashboard
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigate('/admin/ai/generate-course/sessions')}
              icon={<MessageSquare className="w-4 h-4" />}
            >
              View My Sessions
            </Button>
          </div>

          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full mb-4">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">AI Course Generator</h1>
            <p className="text-gray-600">
              Create comprehensive courses with AI assistance. Choose the type of course you want to
              create.
            </p>
          </div>

          {error && (
            <div className="mb-6">
              <Alert 
                type="error" 
                message={typeof error === 'string' ? error : String(error)} 
                onClose={() => setError(null)} 
              />
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            {/* Academic Course */}
            <div
              onClick={() => handleStartSession('content')}
              className="group cursor-pointer bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-[#446D6D] hover:shadow-lg transition-all"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Academic Course</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Curriculum-based courses for GCE O-Level, A-Level, WAEC, NECO, JAMB, and other exam
                systems.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  Linked to subjects, curricula, and programs
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  Exam preparation materials
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  Quiz questions and assessments
                </li>
              </ul>
              <div className="mt-4">
                <Button
                  variant="primary"
                  fullWidth
                  loading={isStarting && selectedAppType === 'content'}
                  disabled={isStarting}
                >
                  Create Academic Course
                </Button>
              </div>
            </div>

            {/* Professional Course */}
            <div
              onClick={() => handleStartSession('courses')}
              className="group cursor-pointer bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-[#446D6D] hover:shadow-lg transition-all"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Briefcase className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Professional Course</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Skill-based professional training courses with practical applications and industry
                focus.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  Industry-focused content
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  Interactive elements and projects
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  Practical exercises and case studies
                </li>
              </ul>
              <div className="mt-4">
                <Button
                  variant="primary"
                  fullWidth
                  loading={isStarting && selectedAppType === 'courses'}
                  disabled={isStarting}
                >
                  Create Professional Course
                </Button>
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  // Loading session
  if (isLoadingSession && sessionId) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-[#446D6D] animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading session...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  // Main interface
  if (!currentSession) {
    return (
      <AdminLayout>
        <div className="p-8">
          <Alert
            type="error"
            message="Session not found. Please start a new session."
            onClose={handleNewSession}
          />
        </div>
      </AdminLayout>
    );
  }

  const canChat = currentSession.status === 'collecting_requirements' || currentSession.status === 'collecting_info';
  const canGenerateOutline = (currentSession.status === 'collecting_requirements' || currentSession.status === 'collecting_info') && currentSession.collected_data;
  const canApprove = currentSession.status === 'outline_generated' && currentSession.generated_outline;
  const isCompleted = currentSession.status === 'completed';
  const isFailed = currentSession.status === 'failed';
  const isCancelled = currentSession.status === 'cancelled';

  return (
    <AdminLayout>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Back Button */}
        <div className="mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (sessionId) {
                // If there's an active session, go back to course type selection
                handleNewSession();
              } else {
                // Otherwise go to dashboard
                navigate('/admin/dashboard');
              }
            }}
            icon={<ArrowLeft className="w-4 h-4" />}
          >
            {sessionId ? 'Back to Course Selection' : 'Back to Dashboard'}
          </Button>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-gray-800">AI Course Generator</h1>
              <StatusBadge status={currentSession.status} />
            </div>
            <p className="text-sm text-gray-600">
              {selectedAppType === 'content' ? 'Academic Course' : 'Professional Course'} • Session
              ID: {(currentSession.id || currentSession.session_id || '').substring(0, 8)}...
            </p>
          </div>
          <div className="flex items-center gap-2">
            {!isCompleted && !isCancelled && !isFailed && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowCancelConfirm(true)}
                icon={<X className="w-4 h-4" />}
              >
                Cancel Session
              </Button>
            )}
            <Button variant="secondary" size="sm" onClick={handleNewSession}>
              New Session
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigate('/admin/ai/generate-course/sessions')}
              icon={<MessageSquare className="w-4 h-4" />}
            >
              My Sessions
            </Button>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <Alert
            type="error"
            title="Error"
            message={typeof error === 'string' ? error : String(error)}
            onClose={() => setError(null)}
            className="mb-6"
          />
        )}
        {isFailed && !error && (
          <Alert
            type="error"
            title="Generation Failed"
            message="An error occurred during course generation. Please try starting a new session."
            className="mb-6"
          />
        )}

        {/* Cancelled State */}
        {isCancelled && (
          <Alert
            type="warning"
            title="Session Cancelled"
            message="This session was cancelled. You can start a new session to create a course."
            className="mb-6"
          />
        )}

        {/* Success State */}
        {isCompleted && currentSession.course_id && (
          <Alert
            type="success"
            title="Course Created Successfully!"
            message={`Your course has been created. You can now view and edit it.`}
            className="mb-6"
          />
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Chat Interface */}
          <div className="lg:col-span-2 space-y-6">
            {/* Collected Data Display */}
            {currentSession.collected_data &&
              Object.keys(currentSession.collected_data).length > 0 && (
                <CollectedDataDisplay data={currentSession.collected_data} />
              )}

            {/* Chat Interface */}
            <div className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden flex flex-col h-[600px]">
              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {currentSession.conversation_history && currentSession.conversation_history.length > 0 ? (
                  <>
                    {currentSession.conversation_history.map((msg, idx) => (
                      <ChatMessage
                        key={idx}
                        message={msg}
                        isTyping={
                          idx === currentSession.conversation_history.length - 1 &&
                          msg.role === 'assistant' &&
                          isChatting
                        }
                      />
                    ))}
                    {isChatting && currentSession.conversation_history[currentSession.conversation_history.length - 1]?.role !== 'assistant' && (
                      <ChatMessage
                        message={{
                          role: 'assistant',
                          content: '',
                          timestamp: new Date().toISOString(),
                        }}
                        isTyping={true}
                      />
                    )}
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <p>Start the conversation by sending a message...</p>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Chat Input */}
              {canChat && (
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (message.trim() && !isChatting) {
                      handleSendMessage(e);
                    }
                  }} 
                  className="p-4 border-t border-gray-200"
                >
                  <div className="flex gap-2">
                    <Input
                      ref={inputRef}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Type your message..."
                      disabled={isChatting}
                      className="flex-1"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          if (message.trim() && !isChatting) {
                            handleSendMessage(e as any);
                          }
                        }
                      }}
                    />
                    <Button
                      type="submit"
                      variant="primary"
                      disabled={!message.trim() || isChatting}
                      loading={isChatting}
                      icon={<Send className="w-4 h-4" />}
                    >
                      Send
                    </Button>
                  </div>
                </form>
              )}
            </div>

            {/* Action Buttons */}
            {canGenerateOutline && (
              <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Ready to Generate Outline</h3>
                    <p className="text-sm text-gray-600">
                      The AI has collected enough information. Generate the course outline now.
                    </p>
                  </div>
                  <Button
                    variant="primary"
                    onClick={() => {
                      setError(null);
                      handleGenerateOutline();
                    }}
                    loading={isGeneratingOutline}
                    disabled={isGeneratingOutline}
                    icon={<Sparkles className="w-4 h-4" />}
                  >
                    Generate Outline
                  </Button>
                </div>
              </div>
            )}
          </div>

            {/* Right Column - Outline Preview */}
          <div className="lg:col-span-1">
            {currentSession.generated_outline && 
             currentSession.generated_outline.course && 
             currentSession.generated_outline.modules ? (
              <div className="sticky top-6">
                <OutlinePreview
                  outline={currentSession.generated_outline}
                  onApprove={canApprove ? () => {
                    setError(null);
                    handleApproveAndCreate();
                  } : undefined}
                  onEdit={canApprove ? () => {
                    // Allow going back to chat to edit requirements
                    // This would require backend support to regenerate outline
                    // For now, we'll show a message
                    alert('To edit requirements, please start a new session. The outline has already been generated.');
                  } : undefined}
                  isApproving={isApproving}
                />
              </div>
            ) : (
              <div className="bg-white rounded-xl border-2 border-gray-200 p-6 text-center">
                <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-800 mb-2">No Outline Yet</h3>
                <p className="text-sm text-gray-600">
                  {canGenerateOutline
                    ? 'Generate an outline to see the course structure.'
                    : 'Continue the conversation to collect requirements, then generate an outline.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      <Modal
        isOpen={showCancelConfirm}
        onClose={() => setShowCancelConfirm(false)}
        title="Cancel Session"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to cancel this session? All progress will be lost.
          </p>
          <div className="flex gap-3 justify-end">
            <Button 
              variant="outline" 
              onClick={() => setShowCancelConfirm(false)}
            >
              Keep Session
            </Button>
            <Button 
              variant="danger" 
              onClick={async () => {
                await handleCancelSession();
                setShowCancelConfirm(false);
              }}
            >
              Cancel Session
            </Button>
          </div>
        </div>
      </Modal>
    </AdminLayout>
  );
};


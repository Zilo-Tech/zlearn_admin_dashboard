// src/pages/ai-course-generation/SessionsListPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../components/layout';
import { Button } from '../../components/common/Button';
import { StatusBadge } from '../../components/ai-course-generation';
import { useListSessionsQuery, useCancelSessionMutation } from '../../store/api/aiCourseGenerationApi';
import { ArrowLeft, Plus, Trash2, MessageSquare, Clock, BookOpen, Briefcase, Loader2 } from 'lucide-react';
import type { SessionListItem } from '../../interfaces/aiCourseGeneration';

export const SessionsListPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: sessions = [], isLoading, refetch } = useListSessionsQuery();
  const [cancelSession, { isLoading: isCancelling }] = useCancelSessionMutation();
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const handleResumeSession = (sessionId: string) => {
    navigate(`/admin/ai/generate-course?session=${sessionId}`);
  };

  const handleCancelSession = async (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to cancel this session? All progress will be lost.')) {
      return;
    }

    setCancellingId(sessionId);
    try {
      await cancelSession(sessionId).unwrap();
      refetch();
    } catch (error) {
      console.error('Failed to cancel session:', error);
      alert('Failed to cancel session. Please try again.');
    } finally {
      setCancellingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getAppTypeIcon = (appType: string) => {
    return appType === 'content' ? (
      <BookOpen className="w-5 h-5" />
    ) : (
      <Briefcase className="w-5 h-5" />
    );
  };

  const getAppTypeLabel = (appType: string) => {
    return appType === 'content' ? 'Academic Course' : 'Professional Course';
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-[#446D6D] animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading sessions...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/admin/ai/generate-course')}
              icon={<ArrowLeft className="w-4 h-4" />}
            >
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">My Course Sessions</h1>
              <p className="text-sm text-gray-600 mt-1">
                Manage and resume your AI course generation sessions
              </p>
            </div>
          </div>
          <Button
            variant="primary"
            onClick={() => navigate('/admin/ai/generate-course')}
            icon={<Plus className="w-4 h-4" />}
          >
            New Session
          </Button>
        </div>

        {/* Sessions List */}
        {sessions.length === 0 ? (
          <div className="bg-white rounded-xl border-2 border-gray-200 p-12 text-center">
            <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Sessions Yet</h3>
            <p className="text-gray-600 mb-6">
              Start creating your first AI-generated course to see your sessions here.
            </p>
            <Button
              variant="primary"
              onClick={() => navigate('/admin/ai/generate-course')}
              icon={<Plus className="w-4 h-4" />}
            >
              Create New Session
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {sessions.map((session: SessionListItem) => (
              <div
                key={session.id}
                onClick={() => handleResumeSession(session.id)}
                className="bg-white rounded-xl border-2 border-gray-200 p-6 hover:border-[#446D6D] hover:shadow-lg transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-gradient-to-br from-[#446D6D] to-[#5a8a8a] rounded-lg text-white">
                        {getAppTypeIcon(session.app_type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-lg font-semibold text-gray-800">
                            {session.course_title || 'Untitled Course'}
                          </h3>
                          <StatusBadge status={session.status} />
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            {getAppTypeIcon(session.app_type)}
                            {getAppTypeLabel(session.app_type)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {formatDate(session.updated_at)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleResumeSession(session.id);
                      }}
                      icon={<MessageSquare className="w-4 h-4" />}
                    >
                      Resume
                    </Button>
                    {session.status !== 'completed' && session.status !== 'cancelled' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => handleCancelSession(session.id, e)}
                        disabled={cancellingId === session.id}
                        loading={cancellingId === session.id}
                        icon={<Trash2 className="w-4 h-4" />}
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};




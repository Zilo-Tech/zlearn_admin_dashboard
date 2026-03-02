import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AdminLayout } from '../components/layout';
import { Card, CardHeader, CardTitle, CardContent, Badge, Button } from '../components/common';
import {
  ChevronRight,
  Mail,
  BookOpen,
  TrendingUp,
  Clock,
  Award,
} from 'lucide-react';
import {
  useGetUserQuery,
  useGetUserEnrollmentsQuery,
  useGetUserCourseProgressQuery,
} from '../store/api/usersApi';
import type { UserProgress } from '../interfaces/user';

export const UserDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: user, isLoading } = useGetUserQuery(id!);
  const { data: enrollments = [] } = useGetUserEnrollmentsQuery(id!);
  const { data: courseProgress = [] } = useGetUserCourseProgressQuery(id!);
  const [activeTab, setActiveTab] = useState<'profile' | 'enrollments' | 'progress'>('profile');

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-surface-border border-t-zlearn-primary" />
        </div>
      </AdminLayout>
    );
  }

  if (!user) {
    return (
      <AdminLayout>
        <div className="text-center py-12 text-gray-500">Student not found</div>
      </AdminLayout>
    );
  }

  const tabs = [
    { id: 'profile' as const, label: 'Profile', icon: Mail },
    { id: 'enrollments' as const, label: 'Enrollments', icon: BookOpen },
    { id: 'progress' as const, label: 'Progress', icon: TrendingUp },
  ];

  const getUserTypeBadgeVariant = (userType: string): 'default' | 'active' | 'draft' => {
    switch (userType) {
      case 'professional':
        return 'active';
      case 'academic':
        return 'draft';
      case 'exams':
        return 'default';
      default:
        return 'default';
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <button
            onClick={() => navigate('/admin/users')}
            className="hover:text-zlearn-primary transition-colors duration-150"
          >
            Students
          </button>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-gray-900 font-medium">{user.full_name || user.username}</span>
        </div>

        <Card padding="lg">
          <div className="flex items-start justify-between gap-4">
            <div className="flex gap-4">
              <div className="w-16 h-16 rounded-lg bg-zlearn-primaryMuted flex-shrink-0 flex items-center justify-center">
                {user.avatar ? (
                  <img src={user.avatar} alt="" className="w-full h-full rounded-lg object-cover" />
                ) : (
                  <span className="text-xl font-semibold text-zlearn-primary">
                    {user.first_name?.[0]}{user.last_name?.[0]}
                  </span>
                )}
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  {user.full_name || `${user.first_name} ${user.last_name}`}
                </h1>
                <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                  <Mail className="w-4 h-4" />
                  {user.email}
                </div>
                <div className="flex items-center gap-3 mt-3">
                  <Badge variant={getUserTypeBadgeVariant(user.user_type)}>{user.user_type}</Badge>
                  <Badge variant={user.is_active ? 'active' : 'suspended'}>
                    {user.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </div>
            </div>
            <Button variant="outline" onClick={() => navigate('/admin/users')} size="sm">
              Back to Students
            </Button>
          </div>
        </Card>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <Card padding="md">
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Enrolled</p>
                  <p className="text-xl font-semibold text-gray-900">
                    {user.total_courses_enrolled ?? user.enrollments_count ?? 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card padding="md">
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center">
                  <Award className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Completed</p>
                  <p className="text-xl font-semibold text-gray-900">{user.total_courses_completed ?? 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card padding="md">
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Avg Progress</p>
                  <p className="text-xl font-semibold text-gray-900">{user.average_progress ?? 0}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card padding="md">
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Time Spent</p>
                  <p className="text-xl font-semibold text-gray-900">
                    {user.total_time_spent ? `${Math.round(user.total_time_spent / 60)}h` : '0h'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="border-b border-surface-border">
          <nav className="flex gap-6" aria-label="User sections">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 pb-3 text-sm font-medium border-b-2 transition-colors duration-150 -mb-px ${
                  activeTab === tab.id
                    ? 'border-zlearn-primary text-zlearn-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {activeTab === 'profile' && (
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Email</p>
                  <p className="text-gray-900">{user.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Username</p>
                  <p className="text-gray-900">{user.username}</p>
                </div>
                {user.phone_number && (
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Phone</p>
                    <p className="text-gray-900">{user.phone_number}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Joined</p>
                  <p className="text-gray-900">{new Date(user.date_joined).toLocaleDateString()}</p>
                </div>
                {user.last_login && (
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Last Login</p>
                    <p className="text-gray-900">{new Date(user.last_login).toLocaleString()}</p>
                  </div>
                )}

                {user.user_type === 'professional' && (
                  <>
                    {user.occupation && (
                      <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">Occupation</p>
                        <p className="text-gray-900">{user.occupation}</p>
                      </div>
                    )}
                    {user.industry && (
                      <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">Industry</p>
                        <p className="text-gray-900">{user.industry}</p>
                      </div>
                    )}
                  </>
                )}

                {user.user_type === 'academic' && (
                  <>
                    {user.school && (
                      <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">School</p>
                        <p className="text-gray-900">{user.school}</p>
                      </div>
                    )}
                    {user.program && (
                      <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">Program</p>
                        <p className="text-gray-900">{user.program}</p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'enrollments' && (
          <Card>
            <CardHeader>
              <CardTitle>Course Enrollments</CardTitle>
            </CardHeader>
            <CardContent>
              {enrollments.length === 0 ? (
                <div className="text-center py-12 text-gray-500">No enrollments yet</div>
              ) : (
                <div className="divide-y divide-surface-borderLight">
                  {enrollments.map((enrollment) => (
                    <div key={enrollment.id} className="py-4 first:pt-0 last:pb-0">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">{enrollment.course_title}</p>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-sm text-gray-500">
                              {enrollment.course_type}
                            </span>
                            <Badge variant={enrollment.status === 'completed' ? 'active' : 'default'}>
                              {enrollment.status}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">
                            {enrollment.progress_percentage ?? 0}% complete
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            Enrolled {new Date(enrollment.enrolled_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {activeTab === 'progress' && (
          <Card>
            <CardHeader>
              <CardTitle>Learning Progress</CardTitle>
            </CardHeader>
            <CardContent>
              {courseProgress.length === 0 ? (
                <div className="text-center py-12 text-gray-500">No progress data available</div>
              ) : (
                <div className="space-y-4">
                  {courseProgress.map((item: UserProgress) => {
                    const courseId = item.course_id ?? item.course;
                    const pct = item.completion_percentage ?? item.progress_percentage ?? 0;
                    const lessons = item.lessons_completed ?? 0;
                    const totalLessons = item.total_lessons ?? 0;
                    const modules = item.modules_completed ?? 0;
                    const totalModules = item.total_modules ?? 0;
                    const timeMins = item.time_spent_minutes ?? 0;
                    return (
                      <div key={courseId} className="border border-surface-border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <p className="font-medium text-gray-900">
                            {item.course_title ?? 'Course'}
                          </p>
                          <span className="text-sm font-medium text-zlearn-primary">
                            {pct}%
                          </span>
                        </div>
                        <div className="h-2 bg-surface-muted rounded-full overflow-hidden mb-4">
                          <div
                            className="h-full bg-zlearn-primary rounded-full transition-all duration-300"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-gray-500">Lessons</p>
                            <p className="font-medium text-gray-900">
                              {lessons}/{totalLessons}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500">Modules</p>
                            <p className="font-medium text-gray-900">
                              {totalModules > 0 ? `${modules}/${totalModules}` : '—'}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500">Time Spent</p>
                            <p className="font-medium text-gray-900">
                              {Math.round(timeMins / 60)}h
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
};

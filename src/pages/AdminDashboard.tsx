// src/pages/AdminDashboard.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../components/layout';
import { Card, CardHeader, CardTitle, CardContent } from '../components/common';
import { useAdminAuth } from '../context/AdminAuthContext';
import { formatNumber, formatTimeAgo } from '../utils';
import { useGetUsersQuery } from '../store/api/usersApi';
import { useGetCoursesQuery } from '../store/api/coursesApi';
import { TrendingUp, Users, BookOpen, DollarSign, Award, Upload, Sparkles } from 'lucide-react';

interface StatCard {
  label: string;
  value: string;
  change: string;
  changePositive: boolean;
  icon: React.ElementType;
}

export const AdminDashboard: React.FC = () => {
  const { user } = useAdminAuth();
  const navigate = useNavigate();
  const { data: users = [], isLoading: isUsersLoading } = useGetUsersQuery({ ordering: '-date_joined' });
  const { data: courses = [], isLoading: isCoursesLoading } = useGetCoursesQuery({});

  const recentStudents = [...users]
    .sort((a, b) => new Date(b.date_joined).getTime() - new Date(a.date_joined).getTime())
    .slice(0, 5);

  const activeCoursesCount = courses.filter(c => c.status === 'published').length;

  const popularCoursesList = [...courses]
    .sort((a, b) => (b.current_enrollments || 0) - (a.current_enrollments || 0))
    .slice(0, 5);

  const stats: StatCard[] = [
    {
      label: 'Total Students',
      value: isUsersLoading ? '...' : formatNumber(users.length),
      change: '+12%', // Still dummy since we need historical data for this
      changePositive: true,
      icon: Users,
    },
    {
      label: 'Active Courses',
      value: isCoursesLoading ? '...' : formatNumber(activeCoursesCount),
      change: '+8%',
      changePositive: true,
      icon: BookOpen,
    },
    {
      label: 'Revenue',
      value: '$45,231', // Placeholder
      change: '+23%',
      changePositive: true,
      icon: DollarSign,
    },
    {
      label: 'Completion Rate',
      value: '87%', // Placeholder
      change: '+5%',
      changePositive: true,
      icon: Award,
    },
  ];



  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Welcome back, {user?.first_name || 'Admin'}
            </h1>
            <p className="text-gray-500 mt-1">
              Here's an overview of your platform today.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => navigate('/admin/courses/import')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-zlearn-primary text-white text-sm font-medium hover:bg-zlearn-primaryHover transition-colors"
            >
              <Upload className="w-4 h-4" />
              Import Course
            </button>
            <button
              onClick={() => navigate('/admin/ai/generate-course')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-surface-border bg-white text-gray-700 text-sm font-medium hover:bg-surface-muted transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              AI Course Generator
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <Card key={index} padding="md" hover>
              <CardContent>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                    <p className="text-2xl font-semibold text-gray-900 mt-1">
                      {stat.value}
                    </p>
                    <span
                      className={`inline-flex items-center gap-1 text-xs font-medium mt-2 ${stat.changePositive ? 'text-emerald-600' : 'text-red-600'
                        }`}
                    >
                      <TrendingUp className="w-3.5 h-3.5" />
                      {stat.change} vs last month
                    </span>
                  </div>
                  <div className="w-10 h-10 bg-zlearn-primaryMuted rounded-lg flex items-center justify-center">
                    <stat.icon className="w-5 h-5 text-zlearn-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Students</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="divide-y divide-surface-borderLight">
                {isUsersLoading ? (
                  <div className="py-4 text-center text-sm text-gray-500">Loading recent students...</div>
                ) : recentStudents.length === 0 ? (
                  <div className="py-4 text-center text-sm text-gray-500">No recent students found</div>
                ) : (
                  recentStudents.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center gap-4 py-3 first:pt-0 last:pb-0 hover:bg-surface-muted/50 -mx-2 px-2 rounded-lg transition-colors duration-150"
                    >
                      <div className="w-10 h-10 bg-zlearn-primaryMuted rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-medium text-zlearn-primary uppercase">
                          {(user.full_name || user.first_name || user.email || '?').charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">
                          {user.full_name || `${user.first_name} ${user.last_name}`.trim() || 'Unknown User'}
                        </p>
                        <p className="text-sm text-gray-500 truncate">{user.email}</p>
                      </div>
                      <span className="text-xs text-gray-400 flex-shrink-0">
                        {user.date_joined ? formatTimeAgo(user.date_joined) : 'N/A'}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Popular Courses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="divide-y divide-surface-borderLight">
                {isCoursesLoading ? (
                  <div className="py-4 text-center text-sm text-gray-500">Loading popular courses...</div>
                ) : popularCoursesList.length === 0 ? (
                  <div className="py-4 text-center text-sm text-gray-500">No popular courses found</div>
                ) : (
                  popularCoursesList.map((course) => (
                    <div
                      key={course.id}
                      className="flex items-center gap-4 py-3 first:pt-0 last:pb-0 hover:bg-surface-muted/50 -mx-2 px-2 rounded-lg transition-colors duration-150"
                    >
                      {course.thumbnail ? (
                        <img 
                          src={course.thumbnail} 
                          alt={course.title} 
                          className="w-10 h-10 rounded-lg object-cover flex-shrink-0" 
                        />
                      ) : (
                        <div className="w-10 h-10 bg-surface-muted rounded-lg flex-shrink-0 flex items-center justify-center">
                          <BookOpen className="w-5 h-5 text-gray-400" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">{course.title}</p>
                        <p className="text-sm text-gray-500">
                          {formatNumber(course.current_enrollments || 0)} enrollments
                        </p>
                      </div>
                      <span className={`text-xs font-medium flex-shrink-0 ${
                        course.status === 'published' ? 'text-emerald-600' : 'text-amber-600'
                      }`}>
                        {course.status.charAt(0).toUpperCase() + course.status.slice(1)}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

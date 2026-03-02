import React from 'react';
import { AdminLayout } from '../components/layout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/common/Card';
import { formatNumber } from '../utils';
import { useGetUsersQuery } from '../store/api/usersApi';
import { useGetExamsQuery, useGetMockExamsListQuery, useGetPastPapersListQuery } from '../store/api/examsApi';
import { BarChart3, Users, BookOpen, ClipboardList, Award } from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  const { data: students = [], isLoading: loadingStudents } = useGetUsersQuery({});
  const { data: exams = [], isLoading: loadingExams } = useGetExamsQuery({});
  const { data: mockExams = [], isLoading: loadingMocks } = useGetMockExamsListQuery({});
  const { isLoading: loadingPapers } = useGetPastPapersListQuery({});

  const studentCount = students.length;
  const publishedExams = exams.filter((e) => e.status === 'published');
  const examCount = publishedExams.length;
  const totalEnrollments = exams.reduce((sum, e) => sum + (e.enrollment_count ?? 0), 0);
  const mockExamCount = mockExams.length;

  const stats = [
    { label: 'Total Students', value: formatNumber(studentCount), icon: Users, color: 'bg-blue-50 text-blue-600' },
    { label: 'Active Exams', value: formatNumber(examCount), icon: BookOpen, color: 'bg-emerald-50 text-emerald-600' },
    { label: 'Total Enrollments', value: formatNumber(totalEnrollments), icon: Award, color: 'bg-amber-50 text-amber-600' },
    { label: 'Mock Exams', value: formatNumber(mockExamCount), icon: ClipboardList, color: 'bg-violet-50 text-violet-600' },
  ];

  if (loadingStudents || loadingExams || loadingMocks || loadingPapers) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-24">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-surface-border border-t-zlearn-primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Analytics</h1>
          <p className="text-gray-500 mt-1">Platform insights and metrics</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <Card key={i} padding="md" hover>
              <CardContent>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                    <p className="text-2xl font-semibold text-gray-900 mt-1">{stat.value}</p>
                  </div>
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.color}`}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Enrollment Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-surface-borderLight">
                  <span className="text-sm text-gray-600">Students</span>
                  <span className="font-semibold text-gray-900">{formatNumber(studentCount)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-surface-borderLight">
                  <span className="text-sm text-gray-600">Published Exam Packages</span>
                  <span className="font-semibold text-gray-900">{formatNumber(examCount)}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-gray-600">Total Enrollments</span>
                  <span className="font-semibold text-gray-900">{formatNumber(totalEnrollments)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Activity Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 py-4">
                <div className="w-14 h-14 rounded-xl bg-zlearn-primaryMuted flex items-center justify-center">
                  <BarChart3 className="w-7 h-7 text-zlearn-primary" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Platform health</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {examCount > 0 && studentCount > 0
                      ? 'Active'
                      : examCount === 0 && studentCount === 0
                      ? 'No data yet'
                      : 'Getting started'}
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-4">
                Add exam packages, mock exams, and past papers to provide students with practice materials.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

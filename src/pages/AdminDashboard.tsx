// src/pages/AdminDashboard.tsx
import React, { useEffect, useState } from 'react';
import { AdminLayout } from '../components/layout';
import { Card, CardHeader, CardTitle, CardContent } from '../components/common';
import { useAdminAuth } from '../context/AdminAuthContext';
import { formatNumber, formatPercentage } from '../utils';

interface StatCard {
  label: string;
  value: string;
  change: string;
  color: string;
}

export const AdminDashboard: React.FC = () => {
  const { user } = useAdminAuth();
  const [stats, setStats] = useState<StatCard[]>([
    { label: 'Total Users', value: '12,543', change: '+12%', color: 'from-blue-500 to-blue-600' },
    { label: 'Active Courses', value: '342', change: '+8%', color: 'from-green-500 to-green-600' },
    { label: 'Revenue', value: '$45,231', change: '+23%', color: 'from-purple-500 to-purple-600' },
    { label: 'Completion Rate', value: '87%', change: '+5%', color: 'from-orange-500 to-orange-600' },
  ]);

  const recentUsers = [
    { id: 1, name: 'John Doe', email: 'john@example.com', time: '2h ago' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', time: '3h ago' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', time: '5h ago' },
    { id: 4, name: 'Alice Brown', email: 'alice@example.com', time: '1d ago' },
  ];

  const popularCourses = [
    { id: 1, name: 'Introduction to React', students: 1234, status: 'Active' },
    { id: 2, name: 'Advanced Django', students: 987, status: 'Active' },
    { id: 3, name: 'Python Basics', students: 1543, status: 'Active' },
    { id: 4, name: 'JavaScript Mastery', students: 876, status: 'Active' },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-[#446D6D] to-[#5a8a8a] rounded-2xl p-6 text-white">
          <h1 className="text-2xl font-bold mb-2">Welcome back, {user?.first_name || 'Admin'}! 👋</h1>
          <p className="text-white/80">Here's what's happening with your platform today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} hover className="transition-all duration-200">
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-gray-600">{stat.label}</span>
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      stat.change.startsWith('+')
                        ? 'bg-green-100 text-green-600'
                        : 'bg-red-100 text-red-600'
                    }`}
                  >
                    {stat.change}
                  </span>
                </div>
                <div
                  className={`text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}
                >
                  {stat.value}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Users */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                      {user.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-800">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                    <div className="text-xs text-gray-400">{user.time}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Popular Courses */}
          <Card>
            <CardHeader>
              <CardTitle>Popular Courses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {popularCourses.map((course) => (
                  <div
                    key={course.id}
                    className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg"></div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-800">{course.name}</div>
                      <div className="text-sm text-gray-500">
                        {formatNumber(course.students)} students
                      </div>
                    </div>
                    <div className="text-xs font-semibold text-green-600">{course.status}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};
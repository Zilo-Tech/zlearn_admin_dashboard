import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../components/layout';
import { DataTable, Column, Badge } from '../components/common';
import { Mail, Calendar } from 'lucide-react';
import { useGetUsersQuery } from '../store/api/usersApi';
import type { User } from '../interfaces/user';

export const StudentsPage: React.FC = () => {
  const navigate = useNavigate();
  const [userTypeFilter, setUserTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  const { data: users = [], isLoading } = useGetUsersQuery({
    user_type: userTypeFilter !== 'all' ? userTypeFilter : undefined,
    is_active: statusFilter === 'active' ? true : statusFilter === 'inactive' ? false : undefined,
  });

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

  const columns: Column<User>[] = [
    {
      key: 'user',
      header: 'Student',
      render: (user) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-zlearn-primaryMuted flex-shrink-0 flex items-center justify-center">
            {user.avatar ? (
              <img src={user.avatar} alt="" className="w-full h-full rounded-lg object-cover" />
            ) : (
              <span className="text-sm font-medium text-zlearn-primary">
                {user.first_name?.[0]}{user.last_name?.[0]}
              </span>
            )}
          </div>
          <div>
            <p className="font-medium text-gray-900">{user.full_name || `${user.first_name} ${user.last_name}`}</p>
            <div className="flex items-center gap-1.5 text-sm text-gray-500">
              <Mail className="w-3.5 h-3.5" />
              {user.email}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'user_type',
      header: 'Type',
      render: (user) => (
        <Badge variant={getUserTypeBadgeVariant(user.user_type)}>
          {user.user_type}
        </Badge>
      ),
    },
    {
      key: 'enrollments',
      header: 'Enrollments',
      render: (user) => (
        <span className="text-gray-600">
          {user.total_courses_enrolled ?? user.enrollments_count ?? 0}
        </span>
      ),
    },
    {
      key: 'progress',
      header: 'Avg Progress',
      render: (user) => (
        <div className="flex items-center gap-2">
          <div className="flex-1 h-2 bg-surface-muted rounded-full overflow-hidden max-w-[80px]">
            <div
              className="h-full bg-zlearn-primary rounded-full transition-all duration-300"
              style={{ width: `${user.average_progress ?? 0}%` }}
            />
          </div>
          <span className="text-sm text-gray-600">{user.average_progress ?? 0}%</span>
        </div>
      ),
    },
    {
      key: 'date_joined',
      header: 'Joined',
      render: (user) => (
        <div className="flex items-center gap-1.5 text-sm text-gray-600">
          <Calendar className="w-3.5 h-3.5" />
          {new Date(user.date_joined).toLocaleDateString()}
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (user) => (
        <Badge variant={user.is_active ? 'active' : 'suspended'}>
          {user.is_active ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: '',
      render: (user) => (
        <button
          onClick={() => navigate(`/admin/users/${user.id}`)}
          className="text-zlearn-primary hover:text-zlearn-primaryHover font-medium text-sm transition-colors duration-150"
        >
          View →
        </button>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Students</h1>
          <p className="text-gray-500 mt-1">Manage student accounts and enrollments</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">User Type</label>
            <select
              value={userTypeFilter}
              onChange={(e) => setUserTypeFilter(e.target.value)}
              className="w-full max-w-xs px-3 py-2.5 border border-surface-border rounded-lg focus:outline-none focus:ring-2 focus:ring-zlearn-primary/20 focus:border-zlearn-primary transition-colors duration-150"
            >
              <option value="all">All Types</option>
              <option value="professional">Professional</option>
              <option value="academic">Academic</option>
              <option value="exams">Exams</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full max-w-xs px-3 py-2.5 border border-surface-border rounded-lg focus:outline-none focus:ring-2 focus:ring-zlearn-primary/20 focus:border-zlearn-primary transition-colors duration-150"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        <DataTable
          data={users}
          columns={columns}
          loading={isLoading}
          title="All Students"
          keyExtractor={(item) => item.id}
          searchPlaceholder="Search by name or email..."
        />
      </div>
    </AdminLayout>
  );
};

// src/routes/AppRoutes.tsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';
import { Loading } from '../components/common';
import {
  AdminLogin,
  AdminDashboard,
  AICourseGenerationPage,
  SessionsListPage,
  StudentsPage,
  UserDetailPage,
  AnalyticsPage,
  SettingsPage,
} from '../pages';
import {
  ExamsPage,
  ExamDetailPage,
  ExamCourseDetailPage,
  MockExamsPage,
  PastPapersPage,
} from '../pages/exams';
import { MockExamDetailPage } from '../pages/exams/MockExamDetailPage';
import {
  SubjectsPage,
  CoursesPage as ContentCoursesPage,
  CourseDetailPage as ContentCourseDetailPage,
  ModulesPage,
  LessonsPage,
} from '../pages/content';
import {
  CategoriesPage,
  CoursesPage as ProfessionalCoursesPage,
  CourseDetailPage as ProfessionalCourseDetailPage,
  CourseImportPage,
  CourseModulesPage,
  CourseLessonsPage,
} from '../pages/courses';
import {
  CountriesPage,
  EducationLevelsPage,
  SchoolsPage,
  FacultiesPage,
  ClassLevelsPage,
  ProgramsPage,
  CurriculaPage,
  EducationSubjectsPage,
} from '../pages/education';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAdminAuth();

  if (loading) {
    return <Loading fullScreen message="Authenticating..." />;
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
};

const PublicRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAdminAuth();

  if (loading) {
    return <Loading fullScreen message="Loading..." />;
  }

  if (user) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/admin/login"
        element={
          <PublicRoute>
            <AdminLogin />
          </PublicRoute>
        }
      />

      {/* Protected Routes */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/ai/generate-course"
        element={
          <ProtectedRoute>
            <AICourseGenerationPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/ai/generate-course/sessions"
        element={
          <ProtectedRoute>
            <SessionsListPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute>
            <StudentsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users/:id"
        element={
          <ProtectedRoute>
            <UserDetailPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/analytics"
        element={
          <ProtectedRoute>
            <AnalyticsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/settings"
        element={
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        }
      />

      {/* Exams Routes */}
      <Route
        path="/admin/exams/exams"
        element={
          <ProtectedRoute>
            <ExamsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/exams/exams/:id"
        element={
          <ProtectedRoute>
            <ExamDetailPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/exams/exams/:examId/courses/:courseId"
        element={
          <ProtectedRoute>
            <ExamCourseDetailPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/exams/exams/:examId/mocks/:mockId"
        element={
          <ProtectedRoute>
            <MockExamDetailPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/exams/mocks"
        element={
          <ProtectedRoute>
            <MockExamsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/exams/papers"
        element={
          <ProtectedRoute>
            <PastPapersPage />
          </ProtectedRoute>
        }
      />

      {/* Content App Routes */}
      <Route
        path="/admin/content/subjects"
        element={
          <ProtectedRoute>
            <SubjectsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/content/courses"
        element={
          <ProtectedRoute>
            <ContentCoursesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/content/courses/:id"
        element={
          <ProtectedRoute>
            <ContentCourseDetailPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/content/modules"
        element={
          <ProtectedRoute>
            <ModulesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/content/lessons"
        element={
          <ProtectedRoute>
            <LessonsPage />
          </ProtectedRoute>
        }
      />

      {/* Courses App Routes */}
      <Route
        path="/admin/courses/categories"
        element={
          <ProtectedRoute>
            <CategoriesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/courses/courses"
        element={
          <ProtectedRoute>
            <ProfessionalCoursesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/courses/courses/:id"
        element={
          <ProtectedRoute>
            <ProfessionalCourseDetailPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/courses/import"
        element={
          <ProtectedRoute>
            <CourseImportPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/courses/modules"
        element={
          <ProtectedRoute>
            <CourseModulesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/courses/lessons"
        element={
          <ProtectedRoute>
            <CourseLessonsPage />
          </ProtectedRoute>
        }
      />

      {/* Education Management Routes */}
      <Route
        path="/admin/education/countries"
        element={
          <ProtectedRoute>
            <CountriesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/education/education-levels"
        element={
          <ProtectedRoute>
            <EducationLevelsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/education/schools"
        element={
          <ProtectedRoute>
            <SchoolsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/education/faculties"
        element={
          <ProtectedRoute>
            <FacultiesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/education/class-levels"
        element={
          <ProtectedRoute>
            <ClassLevelsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/education/programs"
        element={
          <ProtectedRoute>
            <ProgramsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/education/curricula"
        element={
          <ProtectedRoute>
            <CurriculaPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/education/subjects"
        element={
          <ProtectedRoute>
            <EducationSubjectsPage />
          </ProtectedRoute>
        }
      />

      {/* Redirects */}
      <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
      <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
    </Routes>
  );
};

export default AppRoutes;
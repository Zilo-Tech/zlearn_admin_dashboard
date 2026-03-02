// src/components/layout/Sidebar.tsx
import React, { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Shield,
  GraduationCap,
  FolderOpen,
  ChevronDown,
  ChevronRight,
  BookText,
  Layers,
  FileText,
  Tag,
  Globe,
  School,
  Building2,
  BookMarked,
  ListChecks,
  Sparkles,
  MessageSquare,
  Briefcase,
  Award,
  ClipboardList,
  FileQuestion,
  Upload,
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

interface MenuItem {
  icon: React.ElementType;
  label: string;
  path: string;
}

interface MenuSection {
  key: string;
  label: string;
  icon: React.ElementType;
  items: MenuItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAdminAuth();
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    professional: true,
    exams: true,
    academicCourses: true,
    people: true,
    education: true,
  });

  const professionalSections: MenuSection = {
    key: 'professional',
    label: 'Professional',
    icon: Briefcase,
    items: [
      { icon: BookText, label: 'Courses', path: '/admin/courses/courses' },
      { icon: Upload, label: 'Import Course', path: '/admin/courses/import' },
      { icon: Layers, label: 'Modules', path: '/admin/courses/modules' },
      { icon: FileText, label: 'Lessons', path: '/admin/courses/lessons' },
      { icon: FolderOpen, label: 'Categories', path: '/admin/courses/categories' },
    ],
  };

  const examsSections: MenuSection = {
    key: 'exams',
    label: 'Exams',
    icon: Award,
    items: [
      { icon: BookOpen, label: 'Exam Packages', path: '/admin/exams/exams' },
      { icon: ClipboardList, label: 'Mock Exams', path: '/admin/exams/mocks' },
      { icon: FileQuestion, label: 'Past Papers', path: '/admin/exams/papers' },
    ],
  };

  const contentAppSections: MenuSection = {
    key: 'academicCourses',
    label: 'Content Library',
    icon: GraduationCap,
    items: [
      { icon: Tag, label: 'Subjects', path: '/admin/content/subjects' },
      { icon: BookText, label: 'Courses', path: '/admin/content/courses' },
      { icon: Layers, label: 'Modules', path: '/admin/content/modules' },
      { icon: FileText, label: 'Lessons', path: '/admin/content/lessons' },
    ],
  };

  const educationSections: MenuSection = {
    key: 'education',
    label: 'Education',
    icon: School,
    items: [
      { icon: Globe, label: 'Countries', path: '/admin/education/countries' },
      { icon: GraduationCap, label: 'Levels', path: '/admin/education/education-levels' },
      { icon: Building2, label: 'Schools', path: '/admin/education/schools' },
      { icon: FolderOpen, label: 'Faculties', path: '/admin/education/faculties' },
      { icon: BookMarked, label: 'Class Levels', path: '/admin/education/class-levels' },
      { icon: BookText, label: 'Programs', path: '/admin/education/programs' },
      { icon: ListChecks, label: 'Curricula', path: '/admin/education/curricula' },
      { icon: Tag, label: 'Subjects', path: '/admin/education/subjects' },
    ],
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/admin/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + '/');
  const isSectionActive = (section: MenuSection) =>
    section.items.some((item) => isActive(item.path));

  const toggleSection = (key: string) => {
    setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const navItemClass = (active: boolean) =>
    `w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 ${
      active
        ? 'bg-zlearn-primary text-white'
        : 'text-gray-600 hover:bg-surface-muted hover:text-gray-900'
    }`;

  const subNavItemClass = (active: boolean) =>
    `w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-150 ${
      active
        ? 'bg-zlearn-primaryMuted text-zlearn-primary font-medium'
        : 'text-gray-600 hover:bg-surface-muted hover:text-gray-900'
    }`;

  const sectionClass = (active: boolean) =>
    `w-full flex items-center gap-2 px-2 py-2 rounded-lg transition-all duration-150 text-xs font-semibold uppercase tracking-wider ${
      active ? 'text-zlearn-primary' : 'text-gray-500 hover:text-gray-700'
    }`;

  return (
    <aside
      className={`${
        isOpen ? 'w-64' : 'w-20'
      } bg-surface-elevated border-r border-surface-border flex flex-col fixed h-full z-30 transition-all duration-200`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-surface-border">
        {isOpen ? (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-zlearn-primary rounded-lg flex items-center justify-center flex-shrink-0">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <span className="font-semibold text-gray-900 text-base block leading-tight">
                Z-Learn
              </span>
              <span className="text-xs text-gray-500 font-medium">Admin</span>
            </div>
          </div>
        ) : (
          <div className="w-full flex justify-center">
            <div className="w-9 h-9 bg-zlearn-primary rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
          </div>
        )}
        <button
          onClick={onToggle}
          className={`p-2 hover:bg-surface-muted rounded-lg transition-colors duration-150 ${
            !isOpen ? 'absolute top-4 right-2' : ''
          }`}
          aria-label="Toggle sidebar"
        >
          {isOpen ? <X className="w-5 h-5 text-gray-500" /> : <Menu className="w-5 h-5 text-gray-500" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto overflow-x-hidden" style={{ maxHeight: 'calc(100vh - 180px)' }}>
        {/* Dashboard */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/admin/dashboard')}
            className={navItemClass(isActive('/admin/dashboard'))}
          >
            <LayoutDashboard className="w-5 h-5 flex-shrink-0" />
            {isOpen && <span className="text-sm font-medium">Dashboard</span>}
          </button>
        </div>

        {/* AI Tools */}
        {isOpen && (
          <div className="mb-6">
            <div className="px-2 py-2 mb-2">
              <span className={sectionClass(false)}>Tools</span>
            </div>
            <div className="space-y-0.5">
              <button
                onClick={() => navigate('/admin/ai/generate-course')}
                className={subNavItemClass(isActive('/admin/ai/generate-course') && !location.pathname.includes('sessions'))}
              >
                <Sparkles className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm">AI Course Generator</span>
              </button>
              <button
                onClick={() => navigate('/admin/ai/generate-course/sessions')}
                className={subNavItemClass(isActive('/admin/ai/generate-course/sessions'))}
              >
                <MessageSquare className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm">My Sessions</span>
              </button>
            </div>
          </div>
        )}

        {/* Professional Courses */}
        {isOpen && (
          <div className="mb-6">
            <button
              onClick={() => toggleSection('professional')}
              className={`w-full flex items-center gap-2 px-2 py-2 rounded-lg mb-2 ${sectionClass(isSectionActive(professionalSections))}`}
            >
              {expandedSections.professional ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
              <professionalSections.icon className="w-4 h-4 flex-shrink-0" />
              <span>Professional</span>
            </button>
            {expandedSections.professional && (
              <div className="ml-2 pl-3 border-l border-surface-border space-y-0.5">
                {professionalSections.items.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={subNavItemClass(isActive(item.path))}
                  >
                    <item.icon className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm">{item.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Exams */}
        {isOpen && (
          <div className="mb-6">
            <button
              onClick={() => toggleSection('exams')}
              className={`w-full flex items-center gap-2 px-2 py-2 rounded-lg mb-2 ${sectionClass(isSectionActive(examsSections))}`}
            >
              {expandedSections.exams ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
              <examsSections.icon className="w-4 h-4 flex-shrink-0" />
              <span>Exams</span>
            </button>
            {expandedSections.exams && (
              <div className="ml-2 pl-3 border-l border-surface-border space-y-0.5">
                {examsSections.items.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={subNavItemClass(isActive(item.path))}
                  >
                    <item.icon className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm">{item.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Content Library */}
        {isOpen && (
          <div className="mb-6">
            <button
              onClick={() => toggleSection('academicCourses')}
              className={`w-full flex items-center gap-2 px-2 py-2 rounded-lg mb-2 ${sectionClass(isSectionActive(contentAppSections))}`}
            >
              {expandedSections.academicCourses ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
              <contentAppSections.icon className="w-4 h-4 flex-shrink-0" />
              <span>Content Library</span>
            </button>
            {expandedSections.academicCourses && (
              <div className="ml-2 pl-3 border-l border-surface-border space-y-0.5">
                {contentAppSections.items.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={subNavItemClass(isActive(item.path))}
                  >
                    <item.icon className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm">{item.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* People */}
        {isOpen && (
          <div className="mb-6">
            <div className="px-2 py-2 mb-2">
              <span className={sectionClass(false)}>People</span>
            </div>
            <div className="ml-2 pl-3 border-l border-surface-border space-y-0.5">
              <button
                onClick={() => navigate('/admin/users')}
                className={subNavItemClass(isActive('/admin/users'))}
              >
                <Users className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm">Students</span>
              </button>
            </div>
          </div>
        )}

        {/* Insights */}
        {isOpen && (
          <div className="mb-6">
            <div className="px-2 py-2 mb-2">
              <span className={sectionClass(false)}>Insights</span>
            </div>
            <div className="ml-2 pl-3 border-l border-surface-border space-y-0.5">
              <button
                onClick={() => navigate('/admin/analytics')}
                className={subNavItemClass(isActive('/admin/analytics'))}
              >
                <BarChart3 className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm">Analytics</span>
              </button>
            </div>
          </div>
        )}

        {/* Education Management */}
        {isOpen && (
          <div className="mb-6">
            <button
              onClick={() => toggleSection('education')}
              className={`w-full flex items-center gap-2 px-2 py-2 rounded-lg mb-2 ${sectionClass(isSectionActive(educationSections))}`}
            >
              {expandedSections.education ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
              <educationSections.icon className="w-4 h-4 flex-shrink-0" />
              <span>Education</span>
            </button>
            {expandedSections.education && (
              <div className="ml-2 pl-3 border-l border-surface-border space-y-0.5">
                {educationSections.items.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={subNavItemClass(isActive(item.path))}
                  >
                    <item.icon className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm">{item.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* System */}
        {isOpen && (
          <div>
            <div className="px-2 py-2 mb-2">
              <span className={sectionClass(false)}>System</span>
            </div>
            <div className="ml-2 pl-3 border-l border-surface-border space-y-0.5">
              <button
                onClick={() => navigate('/admin/settings')}
                className={subNavItemClass(isActive('/admin/settings'))}
              >
                <Settings className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm">Settings</span>
              </button>
            </div>
          </div>
        )}

        {/* Collapsed: show icons for main sections */}
        {!isOpen && (
          <div className="space-y-1">
            <button onClick={() => navigate('/admin/ai/generate-course')} className={navItemClass(isActive('/admin/ai/generate-course'))}>
              <Sparkles className="w-5 h-5" />
            </button>
            <button onClick={() => navigate('/admin/courses/courses')} className={navItemClass(isActive('/admin/courses/courses'))}>
              <Briefcase className="w-5 h-5" />
            </button>
            <button onClick={() => navigate('/admin/exams/exams')} className={navItemClass(isActive('/admin/exams/exams'))}>
              <Award className="w-5 h-5" />
            </button>
            <button onClick={() => navigate('/admin/content/courses')} className={navItemClass(isActive('/admin/content/courses'))}>
              <GraduationCap className="w-5 h-5" />
            </button>
            <button onClick={() => navigate('/admin/users')} className={navItemClass(isActive('/admin/users'))}>
              <Users className="w-5 h-5" />
            </button>
            <button onClick={() => navigate('/admin/analytics')} className={navItemClass(isActive('/admin/analytics'))}>
              <BarChart3 className="w-5 h-5" />
            </button>
            <button onClick={() => navigate('/admin/settings')} className={navItemClass(isActive('/admin/settings'))}>
              <Settings className="w-5 h-5" />
            </button>
          </div>
        )}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-surface-border">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors duration-150"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {isOpen && <span className="font-medium text-sm">Logout</span>}
        </button>
      </div>
    </aside>
  );
};

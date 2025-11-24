// src/components/layout/Sidebar.tsx
import React, { useState } from 'react';
import { 
  LayoutDashboard, Users, BookOpen, BarChart3, 
  Settings, LogOut, Menu, X, Shield, GraduationCap,
  FolderOpen, ChevronDown, ChevronRight, BookText, Layers,
  FileText, Briefcase, Tag, Globe, School, Building2, 
  GraduationCap as GradCap, BookMarked, ListChecks
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

interface MenuItem {
  icon: any;
  label: string;
  path: string;
}

interface MenuSection {
  label: string;
  icon: any;
  items: MenuItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAdminAuth();
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    content: true,
    courses: true,
    education: true,
  });

  const mainMenuItems: MenuItem[] = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: Users, label: 'Users', path: '/admin/users' },
    { icon: BarChart3, label: 'Analytics', path: '/admin/analytics' },
    { icon: Settings, label: 'Settings', path: '/admin/settings' },
  ];

  const contentAppSections: MenuSection = {
    label: 'Content App',
    icon: GraduationCap,
    items: [
      { icon: Tag, label: 'Subjects', path: '/admin/content/subjects' },
      { icon: BookText, label: 'Courses', path: '/admin/content/courses' },
      { icon: Layers, label: 'Modules', path: '/admin/content/modules' },
      { icon: FileText, label: 'Lessons', path: '/admin/content/lessons' },
    ],
  };

  const coursesAppSections: MenuSection = {
    label: 'Courses App',
    icon: Briefcase,
    items: [
      { icon: FolderOpen, label: 'Categories', path: '/admin/courses/categories' },
      { icon: BookOpen, label: 'Courses', path: '/admin/courses/courses' },
      { icon: Layers, label: 'Modules', path: '/admin/courses/modules' },
      { icon: FileText, label: 'Lessons', path: '/admin/courses/lessons' },
    ],
  };

  const educationSections: MenuSection = {
    label: 'Education Management',
    icon: School,
    items: [
      { icon: Globe, label: 'Countries', path: '/admin/education/countries' },
      { icon: GradCap, label: 'Education Levels', path: '/admin/education/education-levels' },
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

  const isActive = (path: string) => location.pathname === path;
  const isSectionActive = (section: MenuSection) => 
    section.items.some(item => isActive(item.path));

  const toggleSection = (sectionKey: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey],
    }));
  };

  return (
    <aside
      className={`${
        isOpen ? 'w-64' : 'w-20'
      } bg-white border-r border-gray-200 transition-all duration-300 fixed h-full z-30`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {isOpen && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-[#446D6D] to-[#5a8a8a] rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-gray-800">ZLearn Admin</span>
          </div>
        )}
        <button
          onClick={onToggle}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 180px)' }}>
        {/* Main Menu Items */}
        {mainMenuItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
              isActive(item.path)
                ? 'bg-gradient-to-r from-[#446D6D] to-[#5a8a8a] text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            {isOpen && <span className="font-medium">{item.label}</span>}
          </button>
        ))}

        {/* Content App Section */}
        {isOpen && (
          <div className="pt-4 border-t border-gray-200">
            <button
              onClick={() => toggleSection('content')}
              className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 ${
                isSectionActive(contentAppSections)
                  ? 'bg-gray-100 text-[#446D6D]'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {expandedSections.content ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
              <contentAppSections.icon className="w-5 h-5 flex-shrink-0" />
              <span className="font-semibold text-sm">{contentAppSections.label}</span>
            </button>
            {expandedSections.content && (
              <div className="ml-4 mt-2 space-y-1">
                {contentAppSections.items.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 ${
                      isActive(item.path)
                        ? 'bg-gradient-to-r from-[#446D6D] to-[#5a8a8a] text-white shadow-md'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <item.icon className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Courses App Section */}
        {isOpen && (
          <div className="pt-2 border-t border-gray-200">
            <button
              onClick={() => toggleSection('courses')}
              className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 ${
                isSectionActive(coursesAppSections)
                  ? 'bg-gray-100 text-[#446D6D]'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {expandedSections.courses ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
              <coursesAppSections.icon className="w-5 h-5 flex-shrink-0" />
              <span className="font-semibold text-sm">{coursesAppSections.label}</span>
            </button>
            {expandedSections.courses && (
              <div className="ml-4 mt-2 space-y-1">
                {coursesAppSections.items.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 ${
                      isActive(item.path)
                        ? 'bg-gradient-to-r from-[#446D6D] to-[#5a8a8a] text-white shadow-md'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <item.icon className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Education Management Section */}
        {isOpen && (
          <div className="pt-2 border-t border-gray-200">
            <button
              onClick={() => toggleSection('education')}
              className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 ${
                isSectionActive(educationSections)
                  ? 'bg-gray-100 text-[#446D6D]'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {expandedSections.education ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
              <educationSections.icon className="w-5 h-5 flex-shrink-0" />
              <span className="font-semibold text-sm">{educationSections.label}</span>
            </button>
            {expandedSections.education && (
              <div className="ml-4 mt-2 space-y-1">
                {educationSections.items.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 ${
                      isActive(item.path)
                        ? 'bg-gradient-to-r from-[#446D6D] to-[#5a8a8a] text-white shadow-md'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <item.icon className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </nav>

      {/* Logout Button */}
      <div className="absolute bottom-4 left-4 right-4">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-all duration-200"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {isOpen && <span className="font-medium">Logout</span>}
        </button>
      </div>
    </aside>
  );
};
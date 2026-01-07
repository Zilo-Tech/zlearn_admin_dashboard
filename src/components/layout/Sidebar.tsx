// src/components/layout/Sidebar.tsx
import React, { useState } from 'react';
import { 
  LayoutDashboard, Users, BookOpen, BarChart3, 
  Settings, LogOut, Menu, X, Shield, GraduationCap,
  FolderOpen, ChevronDown, ChevronRight, BookText, Layers,
  FileText, Briefcase, Tag, Globe, School, Building2, 
  GraduationCap as GradCap, BookMarked, ListChecks, Sparkles, MessageSquare
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
    { icon: Sparkles, label: 'AI Course Generator', path: '/admin/ai/generate-course' },
    { icon: MessageSquare, label: 'My Sessions', path: '/admin/ai/generate-course/sessions' },
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
      } bg-gradient-to-b from-white to-gray-50 border-r border-gray-200/60 shadow-lg transition-all duration-300 fixed h-full z-30 flex flex-col`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200/60 bg-white/50 backdrop-blur-sm">
        {isOpen && (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#446D6D] to-[#5a8a8a] rounded-xl flex items-center justify-center shadow-md">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-gray-800 text-lg block leading-tight">ZLearn</span>
              <span className="text-xs text-gray-500 font-medium">Admin</span>
            </div>
          </div>
        )}
        {!isOpen && (
          <div className="w-full flex justify-center">
            <div className="w-10 h-10 bg-gradient-to-br from-[#446D6D] to-[#5a8a8a] rounded-xl flex items-center justify-center shadow-md">
              <Shield className="w-5 h-5 text-white" />
            </div>
          </div>
        )}
        <button
          onClick={onToggle}
          className={`p-2 hover:bg-gray-100 rounded-lg transition-all duration-200 hover:scale-105 ${
            !isOpen ? 'absolute top-4 right-2' : ''
          }`}
        >
          {isOpen ? <X className="w-5 h-5 text-gray-600" /> : <Menu className="w-5 h-5 text-gray-600" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto overflow-x-hidden" style={{ maxHeight: 'calc(100vh - 180px)' }}>
        {/* Main Menu Items */}
        <div className="space-y-1 mb-4">
          {mainMenuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative ${
                isActive(item.path)
                  ? 'bg-gradient-to-r from-[#446D6D] to-[#5a8a8a] text-white shadow-lg shadow-[#446D6D]/20'
                  : 'text-gray-700 hover:bg-gray-100/80 hover:text-[#446D6D]'
              }`}
            >
              <item.icon className={`w-5 h-5 flex-shrink-0 transition-transform duration-200 ${
                isActive(item.path) ? '' : 'group-hover:scale-110'
              }`} />
              {isOpen && (
                <span className={`font-medium text-sm ${
                  isActive(item.path) ? 'text-white' : 'text-gray-700 group-hover:text-[#446D6D]'
                }`}>
                  {item.label}
                </span>
              )}
              {isActive(item.path) && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded-r-full"></div>
              )}
            </button>
          ))}
        </div>

        {/* Content App Section */}
        {isOpen && (
          <div className="pt-3 border-t border-gray-200/60">
            <div className="px-2 py-2 mb-2">
              <button
                onClick={() => toggleSection('content')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 group ${
                  isSectionActive(contentAppSections)
                    ? 'bg-[#446D6D]/10 text-[#446D6D]'
                    : 'text-gray-600 hover:bg-gray-100/60 hover:text-[#446D6D]'
                }`}
              >
                {expandedSections.content ? (
                  <ChevronDown className="w-4 h-4 transition-transform duration-200" />
                ) : (
                  <ChevronRight className="w-4 h-4 transition-transform duration-200" />
                )}
                <contentAppSections.icon className="w-4 h-4 flex-shrink-0" />
                <span className="font-semibold text-xs uppercase tracking-wider">{contentAppSections.label}</span>
              </button>
            </div>
            {expandedSections.content && (
              <div className="ml-2 pl-3 border-l-2 border-gray-200/60 space-y-0.5">
                {contentAppSections.items.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group relative ${
                      isActive(item.path)
                        ? 'bg-gradient-to-r from-[#446D6D] to-[#5a8a8a] text-white shadow-md shadow-[#446D6D]/20'
                        : 'text-gray-600 hover:bg-gray-100/80 hover:text-[#446D6D]'
                    }`}
                  >
                    <item.icon className={`w-4 h-4 flex-shrink-0 transition-transform duration-200 ${
                      isActive(item.path) ? '' : 'group-hover:scale-110'
                    }`} />
                    <span className="text-sm font-medium">{item.label}</span>
                    {isActive(item.path) && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-white rounded-r-full"></div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Courses App Section */}
        {isOpen && (
          <div className="pt-3 border-t border-gray-200/60">
            <div className="px-2 py-2 mb-2">
              <button
                onClick={() => toggleSection('courses')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 group ${
                  isSectionActive(coursesAppSections)
                    ? 'bg-[#446D6D]/10 text-[#446D6D]'
                    : 'text-gray-600 hover:bg-gray-100/60 hover:text-[#446D6D]'
                }`}
              >
                {expandedSections.courses ? (
                  <ChevronDown className="w-4 h-4 transition-transform duration-200" />
                ) : (
                  <ChevronRight className="w-4 h-4 transition-transform duration-200" />
                )}
                <coursesAppSections.icon className="w-4 h-4 flex-shrink-0" />
                <span className="font-semibold text-xs uppercase tracking-wider">{coursesAppSections.label}</span>
              </button>
            </div>
            {expandedSections.courses && (
              <div className="ml-2 pl-3 border-l-2 border-gray-200/60 space-y-0.5">
                {coursesAppSections.items.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group relative ${
                      isActive(item.path)
                        ? 'bg-gradient-to-r from-[#446D6D] to-[#5a8a8a] text-white shadow-md shadow-[#446D6D]/20'
                        : 'text-gray-600 hover:bg-gray-100/80 hover:text-[#446D6D]'
                    }`}
                  >
                    <item.icon className={`w-4 h-4 flex-shrink-0 transition-transform duration-200 ${
                      isActive(item.path) ? '' : 'group-hover:scale-110'
                    }`} />
                    <span className="text-sm font-medium">{item.label}</span>
                    {isActive(item.path) && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-white rounded-r-full"></div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Education Management Section */}
        {isOpen && (
          <div className="pt-3 border-t border-gray-200/60">
            <div className="px-2 py-2 mb-2">
              <button
                onClick={() => toggleSection('education')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 group ${
                  isSectionActive(educationSections)
                    ? 'bg-[#446D6D]/10 text-[#446D6D]'
                    : 'text-gray-600 hover:bg-gray-100/60 hover:text-[#446D6D]'
                }`}
              >
                {expandedSections.education ? (
                  <ChevronDown className="w-4 h-4 transition-transform duration-200" />
                ) : (
                  <ChevronRight className="w-4 h-4 transition-transform duration-200" />
                )}
                <educationSections.icon className="w-4 h-4 flex-shrink-0" />
                <span className="font-semibold text-xs uppercase tracking-wider">{educationSections.label}</span>
              </button>
            </div>
            {expandedSections.education && (
              <div className="ml-2 pl-3 border-l-2 border-gray-200/60 space-y-0.5">
                {educationSections.items.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group relative ${
                      isActive(item.path)
                        ? 'bg-gradient-to-r from-[#446D6D] to-[#5a8a8a] text-white shadow-md shadow-[#446D6D]/20'
                        : 'text-gray-600 hover:bg-gray-100/80 hover:text-[#446D6D]'
                    }`}
                  >
                    <item.icon className={`w-4 h-4 flex-shrink-0 transition-transform duration-200 ${
                      isActive(item.path) ? '' : 'group-hover:scale-110'
                    }`} />
                    <span className="text-sm font-medium">{item.label}</span>
                    {isActive(item.path) && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-white rounded-r-full"></div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-200/60 bg-white/50 backdrop-blur-sm">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200 group"
        >
          <LogOut className="w-5 h-5 flex-shrink-0 transition-transform duration-200 group-hover:scale-110" />
          {isOpen && <span className="font-medium text-sm">Logout</span>}
        </button>
      </div>
    </aside>
  );
};
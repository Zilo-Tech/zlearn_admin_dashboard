// src/components/layout/AdminLayout.tsx
import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-surface flex">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      <main
        className={`flex-1 min-w-0 transition-all duration-200 ${
          sidebarOpen ? 'ml-64' : 'ml-20'
        }`}
      >
        <Header />
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
};
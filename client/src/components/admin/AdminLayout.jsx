import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import { useAuth } from '../../context/AuthContext';
import { useState, useRef, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

export default function AdminLayout() {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const sidebarRef = useRef(null);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Close sidebar when clicking outside or on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        if (window.innerWidth < 768 || sidebarOpen) {
          setSidebarOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [sidebarOpen]);

  return (
    <div className="flex h-screen bg-gradient-to-br from-pink-50 to-orange-50 p-2">
      {/* Mobile menu button */}
      <button
        onClick={toggleSidebar}
        className="md:hidden cursor-pointer fixed top-4 right-4 z-50 p-2 rounded-md text-gray-700 hover:bg-gray-100 bg-white shadow-md"
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`fixed md:relative z-40 h-full transition-all duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0 w-full' : '-translate-x-full md:translate-x-0'
        } ${isCollapsed ? 'md:w-16' : 'md:w-64'}`}
      >
        <AdminSidebar 
          user={user} 
          onLinkClick={toggleSidebar}
          isCollapsed={isCollapsed}
          toggleCollapse={toggleCollapse}
          isMobileOpen={sidebarOpen}
        />
      </div>
      
      {/* Main content area */}
      <main className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${
        isCollapsed ? 'md:ml-2' : 'md:ml-2'
      } ${sidebarOpen ? 'ml-0' : ''}`}>
        <div className="flex-1 overflow-y-auto transition-all duration-300 ease-in-out rounded-sm">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
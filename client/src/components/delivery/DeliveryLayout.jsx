// DeliveryLayout.jsx
import { Outlet } from 'react-router-dom';
import DeliverySidebar from './DeliverySidebar';
import { useAuth } from '../../context/AuthContext';
import { useState, useRef, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

export default function DeliveryLayout() {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

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
    <div className="flex h-screen bg-gradient-to-br from-blue-50 to-cyan-50 p-2">
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
          sidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <DeliverySidebar 
          user={user} 
          onLinkClick={toggleSidebar}
          isMobileOpen={sidebarOpen}
        />
      </div>
      
      {/* Main content area */}
      <main className={`flex-1 flex flex-col overflow-hidden ml-0 md:ml-2 ${
        sidebarOpen ? 'ml-0' : ''
      }`}>
        <div className="flex-1 overflow-y-auto transition-all duration-300 ease-in-out rounded-sm">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
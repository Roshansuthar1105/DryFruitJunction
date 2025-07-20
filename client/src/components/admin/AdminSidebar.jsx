import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard,
  Activity,
  UserCog,
  Package,
  ShoppingCart,
  FileText,
  Bell,
  BarChart2,
  Cog,
  Shield,
  ChevronLeft,
  ChevronRight,
  Box,
  Home,
  Truck,
  ShoppingBag
} from 'lucide-react';

const navItems = [
  {
    header: 'Overview',
    items: [
      { path: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
      { path: '/admin/activities', icon: Activity, label: 'Activities' },
    ]
  },
  {
    header: 'Management',
    items: [
      { path: '/admin/users', icon: UserCog, label: 'User Management' },
      { path: '/admin/products', icon: Package, label: 'Product Catalog' },
      { path: '/admin/orders', icon: ShoppingCart, label: 'Order Processing' },
      { path: '/admin/contacts', icon: FileText, label: 'Customer Inquiries' },
    ]
  },
  {
    header: 'General',
    items: [
      { path: '/', icon: Home, label: 'Home' },
      { path: '/cart', icon: ShoppingBag, label: 'Cart' },
      { path: '/checkout', icon: Truck, label: 'Checkout' },
      { path: '/products', icon: Box, label: 'Products' },
    ]
  },
  // {
  //   header: 'System',
  //   items: [
  //     { path: '/admin/notifications', icon: Bell, label: 'Notifications' },
  //     { path: '/admin/analytics', icon: BarChart2, label: 'Analytics' },
  //     { path: '/admin/settings', icon: Cog, label: 'Settings' },
  //   ]
  // }
];

export default function AdminSidebar({ user, onLinkClick, isCollapsed, toggleCollapse, isMobileOpen }) {
  const { pathname } = useLocation();
  const isMobile = window.innerWidth < 768;

  const handleClick = () => {
    if (isMobile && onLinkClick) {
      onLinkClick();
    }
  };

  return (
    <div 
      className={`transition-all duration-300 ease-in-out bg-white/90 backdrop-blur-lg border-r border-gray-200 h-full shadow-md flex flex-col rounded-sm ${
        isMobile ? 'w-full' : isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Collapse/Expand button (desktop only) */}
      {!isMobile && (
        <div className='flex justify-end p-2' >
        <button 
          onClick={toggleCollapse}
          className="flex items-center justify-center p-3 bg-purple-50 hover:bg-gray-50 rounded-md shadow cursor-pointer "
          >
          {isCollapsed ? (
            <ChevronRight className="h-5 w-5 text-gray-500" />
          ) : (
            <ChevronLeft className="h-5 w-5 text-gray-500" />
          )}
        </button>
        </div>
      )}

      {/* Profile section - always visible on mobile, conditionally on desktop */}
      {(isMobile || !isCollapsed) && (
        <div className="flex items-center space-x-3 p-4 border-b border-gray-200">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 w-10 h-10 rounded-full flex items-center justify-center">
            <Shield className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-gray-800 text-sm">Admin</h3>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
          </div>
        </div>
      )}

      {/* Navigation with sections */}
      <nav className="flex-1 space-y-4 p-2 overflow-y-auto">
        {navItems.map((section, index) => (
          <div key={index} className="space-y-1">
            {(isMobile || !isCollapsed) && (
              <h4 className="px-3 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wider truncate">
                {section.header}
              </h4>
            )}
            {section.items.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={handleClick}
                className={`w-full text-left px-3 py-3 rounded-lg flex items-center ${
                  (isMobile || !isCollapsed) ? 'space-x-3' : 'justify-center'
                } ${
                  pathname === item.path
                    ? 'bg-purple-50 text-purple-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
                title={(isMobile || !isCollapsed) ? '' : item.label}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {(isMobile || !isCollapsed) && (
                  <span className="text-sm truncate">{item.label}</span>
                )}
              </Link>
            ))}
          </div>
        ))}
      </nav>
    </div>
  );
}
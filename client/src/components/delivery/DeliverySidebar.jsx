// DeliverySidebar.jsx
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard,
  Package,
  ShoppingCart,
  Truck,
  Home,
  User
} from 'lucide-react';

const navItems = [
  {
    header: 'Delivery',
    items: [
      { path: '/delivery', icon: LayoutDashboard, label: 'Dashboard' },
      // { path: '/delivery/orders', icon: ShoppingCart, label: 'My Deliveries' },
    ]
  },
  {
    header: 'General',
    items: [
      { path: '/', icon: Home, label: 'Home' },
      { path: '/dashboard', icon: User, label: 'Profile' },
    ]
  },
];

export default function DeliverySidebar({ user, onLinkClick, isMobileOpen }) {
  const { pathname } = useLocation();
  const isMobile = window.innerWidth < 768;

  const handleClick = () => {
    if (isMobile && onLinkClick) {
      onLinkClick();
    }
  };

  return (
    <div className="transition-all duration-300 ease-in-out bg-white/90 backdrop-blur-lg border-r border-gray-200 h-full shadow-md flex flex-col rounded-sm w-64">
      {/* Profile section */}
      <div className="flex items-center space-x-3 p-4 border-b border-gray-200">
        <div className="bg-gradient-to-r from-blue-500 to-cyan-500 w-10 h-10 rounded-full flex items-center justify-center">
          <Truck className="h-5 w-5 text-white" />
        </div>
        <div>
          <h3 className="font-bold text-gray-800 text-sm">Delivery Partner</h3>
          <p className="text-xs text-gray-500 truncate">{user?.email}</p>
        </div>
      </div>

      {/* Navigation with sections */}
      <nav className="flex-1 space-y-4 p-2 overflow-y-auto">
        {navItems.map((section, index) => (
          <div key={index} className="space-y-1">
            <h4 className="px-3 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wider truncate">
              {section.header}
            </h4>
            {section.items.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={handleClick}
                className={`w-full text-left px-3 py-3 rounded-lg flex items-center space-x-3 ${
                  pathname === item.path
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                <span className="text-sm truncate">{item.label}</span>
              </Link>
            ))}
          </div>
        ))}
      </nav>
    </div>
  );
}
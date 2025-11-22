import { Truck, MapPin, AlertTriangle, Users, DollarSign, BarChart3, ClipboardList } from 'lucide-react';
import { ViewType } from '../App';

interface SidebarProps {
  activeView: ViewType;
  onViewChange: (view: ViewType) => void;
}

export function Sidebar({ activeView, onViewChange }: SidebarProps) {
  const menuItems = [
    { id: 'trips' as ViewType, label: 'Trip Management', icon: ClipboardList },
    { id: 'vehicles-drivers' as ViewType, label: 'Vehicles & Drivers', icon: Truck },
    { id: 'exceptions' as ViewType, label: 'Exceptions', icon: AlertTriangle },
    { id: 'clients' as ViewType, label: 'Clients', icon: Users },
    { id: 'billing' as ViewType, label: 'Billing', icon: DollarSign },
    { id: 'reporting' as ViewType, label: 'Reports', icon: BarChart3 },
  ];

  return (
    <aside className="w-64 bg-gray-900 text-white flex flex-col">
      <div className="p-6">
        <h1 className="text-xl">Dispatch Control</h1>
        <p className="text-gray-400 text-sm mt-1">Admin Panel</p>
      </div>
      
      <nav className="flex-1 px-3">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg mb-1 transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
            A
          </div>
          <div>
            <div>Admin User</div>
            <div className="text-sm text-gray-400">admin@dispatch.com</div>
          </div>
        </div>
      </div>
    </aside>
  );
}

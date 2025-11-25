import { Truck, MapPin, AlertTriangle, Users, DollarSign, BarChart3, ClipboardList } from 'lucide-react';
import { ViewType } from '../App';
import { Logout } from './Login';

interface SidebarProps {
  activeView: ViewType;
  onViewChange: (view: ViewType) => void;
}

export function Sidebar({ activeView, onViewChange }: SidebarProps) {
  const menuItems = [
    { id: 'trips' as ViewType, label: 'Quản lý đơn hàng', icon: ClipboardList },
    { id: 'vehicles-drivers' as ViewType, label: 'Phương tiện & Tài xế', icon: Truck },
    { id: 'clients' as ViewType, label: 'Khách hàng', icon: Users },
    { id: 'billing' as ViewType, label: 'Thanh toán', icon: DollarSign },
    { id: 'reporting' as ViewType, label: 'Phân tích & Báo cáo', icon: BarChart3 },
  ];

  return (
    <aside className="w-64 bg-gray-900 text-white flex flex-col">
      <div className="p-6">
        <h1 className="text-xl">Hệ thống quản lý</h1>
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
      
      <div className='p-4'>
        <button
          className="w-full h-full py-2 bg-blue-500 hover:bg-gray-800 rounded-xl cursor-pointer"
          onClick={() => Logout()}
        >
          Sign out
        </button>
      </div>

    </aside>
  );
}

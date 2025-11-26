import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { TripManagement } from './components/TripManagement';
import { VehicleDriverSetup } from './components/VehicleDriverSetup';
import { ClientManagement } from './components/ClientManagement';
import { BillingReconciliation } from './components/BillingReconciliation';
import { Reporting } from './components/Reporting';
import { LoginPage } from './components/Login';
import axios from 'axios';

export type ViewType = 'login' | 'trips' | 'vehicles-drivers' | 'clients' | 'billing' | 'reporting';

export default function App() {
  const [activeView, setActiveView] = useState<ViewType>('trips');

  let token = localStorage.getItem('authToken');
	
  if (!token) {
    return (
      <div className="h-screen flex bg-gray-50">
        <main className="flex-1 overflow-auto">
            <LoginPage />
        </main>
      </div>
    )
  }

  axios.defaults.headers.common['Authorization'] = token;
  
  const renderView = () => {
    switch (activeView) {
      case 'login':
        return <LoginPage />
      case 'trips':
        return <TripManagement />;
      case 'vehicles-drivers':
        return <VehicleDriverSetup />;
      case 'clients':
        return <ClientManagement />;
      case 'billing':
        return <BillingReconciliation />;
      case 'reporting':
        return <Reporting />;
      default:
        return <TripManagement />;
    }
  };

  return (
    <div className="h-screen flex bg-gray-50">
      <Sidebar activeView={activeView} onViewChange={setActiveView} />
      <main className="flex-1 overflow-auto">
        {renderView()}
      </main>
    </div>
  );
}

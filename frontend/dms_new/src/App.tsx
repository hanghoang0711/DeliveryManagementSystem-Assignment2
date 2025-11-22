import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { TripManagement } from './components/TripManagement';
import { VehicleDriverSetup } from './components/VehicleDriverSetup';
import { ExceptionHandling } from './components/ExceptionHandling';
import { ClientManagement } from './components/ClientManagement';
import { BillingReconciliation } from './components/BillingReconciliation';
import { Reporting } from './components/Reporting';

export type ViewType = 'live-map' | 'trips' | 'vehicles-drivers' | 'exceptions' | 'clients' | 'billing' | 'reporting';

export default function App() {
  const [activeView, setActiveView] = useState<ViewType>('live-map');

  const renderView = () => {
    switch (activeView) {
      case 'trips':
        return <TripManagement />;
      case 'vehicles-drivers':
        return <VehicleDriverSetup />;
      case 'exceptions':
        return <ExceptionHandling />;
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

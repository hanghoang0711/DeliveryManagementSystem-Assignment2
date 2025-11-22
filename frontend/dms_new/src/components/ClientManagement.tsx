import { useState } from 'react';
import { Search, User, Calendar, MapPin, Phone, Mail, FileText, ChevronRight, Edit } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface Client {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  specialNeeds: string[];
  memberSince: string;
  totalTrips: number;
  upcomingTrips: number;
  recurringBookings: Array<{
    id: string;
    destination: string;
    schedule: string;
  }>;
  tripHistory: Array<{
    id: string;
    date: string;
    pickup: string;
    dropoff: string;
    status: string;
  }>;
  notes: string;
}

const mockClients: Client[] = [
  {
    id: 'C001',
    name: 'Mary Wilson',
    phone: '(555) 111-2222',
    email: 'mary.wilson@email.com',
    address: '123 Oak Street, Downtown',
    specialNeeds: ['wheelchair', 'oxygen'],
    memberSince: '2024-01-15',
    totalTrips: 48,
    upcomingTrips: 3,
    recurringBookings: [
      {
        id: 'RB001',
        destination: 'City Medical Center',
        schedule: 'Every Monday & Thursday, 9:00 AM',
      },
    ],
    tripHistory: [
      {
        id: 'T001',
        date: '2025-11-13',
        pickup: '123 Oak Street',
        dropoff: 'City Medical Center',
        status: 'completed',
      },
      {
        id: 'T015',
        date: '2025-11-11',
        pickup: '123 Oak Street',
        dropoff: 'City Medical Center',
        status: 'completed',
      },
    ],
    notes: 'Requires main entrance access. Portable oxygen tank needed.',
  },
  {
    id: 'C002',
    name: 'Robert Chen',
    phone: '(555) 222-3333',
    email: 'robert.chen@email.com',
    address: '789 Pine Ave, North District',
    specialNeeds: ['ambulatory'],
    memberSince: '2024-03-20',
    totalTrips: 72,
    upcomingTrips: 5,
    recurringBookings: [
      {
        id: 'RB002',
        destination: 'Downtown Dialysis Center',
        schedule: 'Mon, Wed, Fri - 10:00 AM',
      },
    ],
    tripHistory: [
      {
        id: 'T002',
        date: '2025-11-13',
        pickup: '789 Pine Ave',
        dropoff: 'Downtown Dialysis Center',
        status: 'completed',
      },
    ],
    notes: 'Regular patient, knows routine well.',
  },
  {
    id: 'C003',
    name: 'Linda Martinez',
    phone: '(555) 333-4444',
    email: 'linda.m@email.com',
    address: '555 Elm Street, West Side',
    specialNeeds: ['wheelchair', 'walker'],
    memberSince: '2024-07-01',
    totalTrips: 28,
    upcomingTrips: 2,
    recurringBookings: [
      {
        id: 'RB003',
        destination: 'Physical Therapy Clinic',
        schedule: 'Tuesday & Friday, 11:00 AM',
      },
    ],
    tripHistory: [
      {
        id: 'T003',
        date: '2025-11-13',
        pickup: '555 Elm Street',
        dropoff: 'Physical Therapy Clinic',
        status: 'pending',
      },
    ],
    notes: 'May use walker or wheelchair depending on condition.',
  },
];

export function ClientManagement() {
  const [clients] = useState<Client[]>(mockClients);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredClients = clients.filter((client) =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.phone.includes(searchQuery) ||
    client.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl mb-2">Client Management</h2>
        <p className="text-gray-600">View client profiles, trip history, and manage recurring bookings</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <div className="text-sm text-gray-600 mb-1">Total Clients</div>
          <div className="text-2xl">{clients.length}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-600 mb-1">Active Today</div>
          <div className="text-2xl text-green-600">{clients.filter(c => c.upcomingTrips > 0).length}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-600 mb-1">Recurring Bookings</div>
          <div className="text-2xl text-blue-600">
            {clients.reduce((sum, c) => sum + c.recurringBookings.length, 0)}
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-600 mb-1">Special Needs</div>
          <div className="text-2xl text-orange-600">
            {clients.filter(c => c.specialNeeds.length > 0).length}
          </div>
        </Card>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search clients by name, phone, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Client List */}
      <div className="grid gap-4">
        {filteredClients.map((client) => (
          <Card
            key={client.id}
            className="p-4 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => {
              setSelectedClient(client);
              setIsDialogOpen(true);
            }}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <User className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg">{client.name}</h3>
                    <p className="text-sm text-gray-600">Member since {formatDate(client.memberSince)}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm mb-3">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span>{client.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span>{client.email}</span>
                  </div>
                  <div className="flex items-center gap-2 col-span-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span>{client.address}</span>
                  </div>
                </div>

                <div className="flex items-center gap-6 text-sm">
                  <div>
                    <span className="text-gray-500">Total Trips:</span>{' '}
                    <span>{client.totalTrips}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Upcoming:</span>{' '}
                    <Badge variant="outline">{client.upcomingTrips}</Badge>
                  </div>
                  {client.specialNeeds.length > 0 && (
                    <div className="flex gap-1">
                      {client.specialNeeds.map((need, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {need}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>
          </Card>
        ))}
      </div>

      {/* Client Detail Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Client Profile - {selectedClient?.name}</DialogTitle>
          </DialogHeader>
          {selectedClient && (
            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="history">Trip History</TabsTrigger>
                <TabsTrigger value="recurring">Recurring Bookings</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <Card className="p-4">
                  <h4 className="mb-3">Contact Information</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Phone:</span> {selectedClient.phone}
                    </div>
                    <div>
                      <span className="text-gray-500">Email:</span> {selectedClient.email}
                    </div>
                    <div className="col-span-2">
                      <span className="text-gray-500">Address:</span> {selectedClient.address}
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <h4 className="mb-3">Account Details</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Client ID:</span> {selectedClient.id}
                    </div>
                    <div>
                      <span className="text-gray-500">Member Since:</span> {formatDate(selectedClient.memberSince)}
                    </div>
                    <div>
                      <span className="text-gray-500">Total Trips:</span> {selectedClient.totalTrips}
                    </div>
                    <div>
                      <span className="text-gray-500">Upcoming Trips:</span> {selectedClient.upcomingTrips}
                    </div>
                  </div>
                </Card>

                {selectedClient.specialNeeds.length > 0 && (
                  <Card className="p-4">
                    <h4 className="mb-3">Special Needs</h4>
                    <div className="flex gap-2">
                      {selectedClient.specialNeeds.map((need, i) => (
                        <Badge key={i} className="bg-orange-100 text-orange-800">
                          {need}
                        </Badge>
                      ))}
                    </div>
                  </Card>
                )}

                {selectedClient.notes && (
                  <Card className="p-4">
                    <h4 className="mb-3">Special Instructions</h4>
                    <p className="text-sm bg-yellow-50 p-3 rounded">{selectedClient.notes}</p>
                  </Card>
                )}

                <div className="flex gap-2 pt-4 border-t">
                  <Button className="flex-1">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule Trip
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="history" className="space-y-3">
                {selectedClient.tripHistory.map((trip) => (
                  <Card key={trip.id} className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span>Trip {trip.id}</span>
                          <Badge className={
                            trip.status === 'completed' ? 'bg-green-100 text-green-800' :
                            trip.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }>
                            {trip.status}
                          </Badge>
                          <span className="text-sm text-gray-500">{formatDate(trip.date)}</span>
                        </div>
                        <div className="space-y-1 text-sm">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-green-600" />
                            <span>Pickup: {trip.pickup}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-red-600" />
                            <span>Drop-off: {trip.dropoff}</span>
                          </div>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <FileText className="w-4 h-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="recurring" className="space-y-3">
                {selectedClient.recurringBookings.map((booking) => (
                  <Card key={booking.id} className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Calendar className="w-5 h-5 text-blue-600" />
                          <h4>{booking.destination}</h4>
                        </div>
                        <p className="text-sm text-gray-600">{booking.schedule}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
                <Button variant="outline" className="w-full">
                  <Calendar className="w-4 h-4 mr-2" />
                  Add Recurring Booking
                </Button>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

import { useState } from 'react';
import { Search, Filter, Plus, Clock, MapPin, User, ChevronRight, Calendar } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';

interface Trip {
  id: string;
  clientName: string;
  pickupLocation: string;
  dropoffLocation: string;
  scheduledPickup: string;
  scheduledDropoff: string;
  status: 'pending' | 'assigned' | 'picked-up' | 'en-route' | 'dropped-off' | 'cancelled';
  vehicleId: string | null;
  driverId: string | null;
  specialNeeds: string[];
  distance: number;
  estimatedDuration: number;
  clientNotes: string;
}

const mockTrips: Trip[] = [
  {
    id: 'T001',
    clientName: 'Mary Wilson',
    pickupLocation: '123 Oak Street, Downtown',
    dropoffLocation: 'City Medical Center, 456 Health Ave',
    scheduledPickup: '2025-11-13T09:00:00',
    scheduledDropoff: '2025-11-13T09:30:00',
    status: 'assigned',
    vehicleId: 'V001',
    driverId: 'D001',
    specialNeeds: ['wheelchair'],
    distance: 8.5,
    estimatedDuration: 30,
    clientNotes: 'Please use main entrance',
  },
  {
    id: 'T002',
    clientName: 'Robert Chen',
    pickupLocation: '789 Pine Ave, North District',
    dropoffLocation: 'Downtown Dialysis Center, 321 Care St',
    scheduledPickup: '2025-11-13T10:00:00',
    scheduledDropoff: '2025-11-13T10:45:00',
    status: 'picked-up',
    vehicleId: 'V002',
    driverId: 'D002',
    specialNeeds: ['ambulatory'],
    distance: 12.3,
    estimatedDuration: 45,
    clientNotes: 'Regular patient, knows routine',
  },
  {
    id: 'T003',
    clientName: 'Linda Martinez',
    pickupLocation: '555 Elm Street, West Side',
    dropoffLocation: 'Physical Therapy Clinic, 888 Wellness Blvd',
    scheduledPickup: '2025-11-13T11:00:00',
    scheduledDropoff: '2025-11-13T11:20:00',
    status: 'pending',
    vehicleId: null,
    driverId: null,
    specialNeeds: ['wheelchair', 'oxygen'],
    distance: 6.2,
    estimatedDuration: 20,
    clientNotes: 'Bring portable oxygen tank',
  },
  {
    id: 'T004',
    clientName: 'James Thompson',
    pickupLocation: '222 Maple Dr, Eastside',
    dropoffLocation: 'Home: 999 Sunset Lane',
    scheduledPickup: '2025-11-13T14:00:00',
    scheduledDropoff: '2025-11-13T14:30:00',
    status: 'en-route',
    vehicleId: 'V001',
    driverId: 'D001',
    specialNeeds: ['ambulatory'],
    distance: 9.8,
    estimatedDuration: 30,
    clientNotes: 'Return trip from appointment',
  },
  {
    id: 'T005',
    clientName: 'Susan Parker',
    pickupLocation: '100 Valley Road, South Hills',
    dropoffLocation: 'Senior Care Facility, 200 Golden Years Ave',
    scheduledPickup: '2025-11-13T15:00:00',
    scheduledDropoff: '2025-11-13T15:25:00',
    status: 'dropped-off',
    vehicleId: 'V002',
    driverId: 'D002',
    specialNeeds: ['walker'],
    distance: 7.1,
    estimatedDuration: 25,
    clientNotes: 'Completed successfully',
  },
];

export function TripManagement() {
  const [trips] = useState<Trip[]>(mockTrips);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isTripDialogOpen, setIsTripDialogOpen] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'assigned':
        return 'bg-blue-100 text-blue-800';
      case 'picked-up':
        return 'bg-purple-100 text-purple-800';
      case 'en-route':
        return 'bg-indigo-100 text-indigo-800';
      case 'dropped-off':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const filteredTrips = trips.filter((trip) => {
    const matchesSearch = 
      trip.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.pickupLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.dropoffLocation.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || trip.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl mb-2">Trip Management</h2>
        <p className="text-gray-600">Review, assign, and monitor all transportation trips</p>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search trips by client name or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="assigned">Assigned</SelectItem>
            <SelectItem value="picked-up">Picked Up</SelectItem>
            <SelectItem value="en-route">En Route</SelectItem>
            <SelectItem value="dropped-off">Dropped Off</SelectItem>
          </SelectContent>
        </Select>
        <Dialog open={isTripDialogOpen} onOpenChange={setIsTripDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Trip
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Trip</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-2">
                <Label htmlFor="client-name">Client Name</Label>
                <Input id="client-name" placeholder="Enter client name" />
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="pickup">Pickup Location</Label>
                <Input id="pickup" placeholder="Enter pickup address" />
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="dropoff">Drop-off Location</Label>
                <Input id="dropoff" placeholder="Enter drop-off address" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pickup-time">Pickup Time</Label>
                <Input id="pickup-time" type="datetime-local" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dropoff-time">Estimated Drop-off</Label>
                <Input id="dropoff-time" type="datetime-local" />
              </div>
              <div className="col-span-2 space-y-2">
                <Label>Special Needs</Label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">Wheelchair</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">Stretcher</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">Oxygen</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">Walker</span>
                  </label>
                </div>
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="notes">Client Notes</Label>
                <Textarea id="notes" placeholder="Enter any special instructions..." rows={3} />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setIsTripDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsTripDialogOpen(false)}>
                Create Trip
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {filteredTrips.map((trip) => (
          <Card 
            key={trip.id} 
            className="p-4 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => {
              setSelectedTrip(trip);
              setIsDialogOpen(true);
            }}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="text-lg">{trip.clientName}</h3>
                  <Badge className={getStatusColor(trip.status)}>
                    {trip.status.replace('-', ' ')}
                  </Badge>
                  <span className="text-sm text-gray-500">Trip #{trip.id}</span>
                </div>

                <div className="space-y-2 mb-3">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-sm">Pickup: {trip.pickupLocation}</div>
                      <div className="text-xs text-gray-500">{formatTime(trip.scheduledPickup)}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-sm">Drop-off: {trip.dropoffLocation}</div>
                      <div className="text-xs text-gray-500">{formatTime(trip.scheduledDropoff)}</div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {trip.estimatedDuration} min
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {trip.distance} mi
                  </div>
                  {trip.specialNeeds.length > 0 && (
                    <div className="flex gap-1">
                      {trip.specialNeeds.map((need, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {need}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {trip.vehicleId && trip.driverId && (
                  <div className="mt-2 text-sm text-gray-600">
                    Assigned: Vehicle {trip.vehicleId} / Driver {trip.driverId}
                  </div>
                )}
              </div>
              
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Trip Details - {selectedTrip?.id}</DialogTitle>
          </DialogHeader>
          {selectedTrip && (
            <div className="space-y-4">
              <div>
                <h4 className="mb-2">Client Information</h4>
                <div className="bg-gray-50 p-3 rounded">
                  <div className="flex items-center gap-2 mb-1">
                    <User className="w-4 h-4 text-gray-500" />
                    <span>{selectedTrip.clientName}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="mb-2">Route</h4>
                <div className="space-y-2">
                  <div className="flex items-start gap-2 bg-green-50 p-3 rounded">
                    <MapPin className="w-4 h-4 text-green-600 mt-0.5" />
                    <div>
                      <div className="text-sm">{selectedTrip.pickupLocation}</div>
                      <div className="text-xs text-gray-500">
                        Scheduled: {formatTime(selectedTrip.scheduledPickup)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 bg-red-50 p-3 rounded">
                    <MapPin className="w-4 h-4 text-red-600 mt-0.5" />
                    <div>
                      <div className="text-sm">{selectedTrip.dropoffLocation}</div>
                      <div className="text-xs text-gray-500">
                        Expected: {formatTime(selectedTrip.scheduledDropoff)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {selectedTrip.clientNotes && (
                <div>
                  <h4 className="mb-2">Notes</h4>
                  <div className="bg-yellow-50 p-3 rounded text-sm">
                    {selectedTrip.clientNotes}
                  </div>
                </div>
              )}

              <div>
                <h4 className="mb-2">Assignment</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Assign Vehicle</Label>
                    <Select defaultValue={selectedTrip.vehicleId || undefined}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select vehicle" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="V001">Van 1 - Wheelchair</SelectItem>
                        <SelectItem value="V002">Sedan 2 - Standard</SelectItem>
                        <SelectItem value="V003">Van 3 - Wheelchair</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Assign Driver</Label>
                    <Select defaultValue={selectedTrip.driverId || undefined}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select driver" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="D001">John Smith</SelectItem>
                        <SelectItem value="D002">Sarah Johnson</SelectItem>
                        <SelectItem value="D003">Mike Davis</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Close
                </Button>
                {selectedTrip.status === 'pending' && (
                  <Button>Assign Trip</Button>
                )}
                {selectedTrip.status !== 'dropped-off' && selectedTrip.status !== 'cancelled' && (
                  <Button variant="outline">Reassign</Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

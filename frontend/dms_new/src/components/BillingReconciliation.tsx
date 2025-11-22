import { useState } from 'react';
import { DollarSign, Search, Download, AlertCircle, Check, Edit, FileText, Filter } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';

interface BillingTrip {
  id: string;
  clientName: string;
  date: string;
  pickupLocation: string;
  dropoffLocation: string;
  distance: number;
  duration: number;
  waitTime: number;
  baseFare: number;
  mileageCharge: number;
  timeCharge: number;
  waitTimeCharge: number;
  surcharges: Array<{
    name: string;
    amount: number;
  }>;
  totalAmount: number;
  status: 'pending' | 'reviewed' | 'flagged' | 'finalized';
  flags: string[];
  locationAccuracy: 'accurate' | 'auto-adjusted' | 'manual-override';
}

const mockBillingTrips: BillingTrip[] = [
  {
    id: 'T001',
    clientName: 'Mary Wilson',
    date: '2025-11-13T09:00:00',
    pickupLocation: '123 Oak Street',
    dropoffLocation: 'City Medical Center',
    distance: 8.5,
    duration: 30,
    waitTime: 5,
    baseFare: 15.00,
    mileageCharge: 17.00,
    timeCharge: 12.00,
    waitTimeCharge: 5.00,
    surcharges: [
      { name: 'Wheelchair Service', amount: 10.00 },
    ],
    totalAmount: 59.00,
    status: 'finalized',
    flags: [],
    locationAccuracy: 'accurate',
  },
  {
    id: 'T002',
    clientName: 'Robert Chen',
    date: '2025-11-13T10:00:00',
    pickupLocation: '789 Pine Ave',
    dropoffLocation: 'Downtown Dialysis Center',
    distance: 12.3,
    duration: 45,
    waitTime: 12,
    baseFare: 15.00,
    mileageCharge: 24.60,
    timeCharge: 18.00,
    waitTimeCharge: 12.00,
    surcharges: [],
    totalAmount: 69.60,
    status: 'reviewed',
    flags: [],
    locationAccuracy: 'auto-adjusted',
  },
  {
    id: 'T003',
    clientName: 'Linda Martinez',
    date: '2025-11-13T11:00:00',
    pickupLocation: '555 Elm Street',
    dropoffLocation: 'Physical Therapy Clinic',
    distance: 6.2,
    duration: 20,
    waitTime: 3,
    baseFare: 15.00,
    mileageCharge: 12.40,
    timeCharge: 8.00,
    waitTimeCharge: 3.00,
    surcharges: [
      { name: 'Wheelchair Service', amount: 10.00 },
    ],
    totalAmount: 48.40,
    status: 'pending',
    flags: [],
    locationAccuracy: 'accurate',
  },
  {
    id: 'T004',
    clientName: 'James Thompson',
    date: '2025-11-13T14:00:00',
    pickupLocation: '222 Maple Dr',
    dropoffLocation: 'Home: 999 Sunset Lane',
    distance: 15.8,
    duration: 35,
    waitTime: 18,
    baseFare: 15.00,
    mileageCharge: 31.60,
    timeCharge: 14.00,
    waitTimeCharge: 18.00,
    surcharges: [],
    totalAmount: 78.60,
    status: 'flagged',
    flags: ['Unusual wait time', 'Mileage variance'],
    locationAccuracy: 'manual-override',
  },
];

export function BillingReconciliation() {
  const [trips, setTrips] = useState<BillingTrip[]>(mockBillingTrips);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedTrip, setSelectedTrip] = useState<BillingTrip | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredTrips = trips.filter((trip) => {
    const matchesSearch =
      trip.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || trip.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'reviewed':
        return 'bg-blue-100 text-blue-800';
      case 'flagged':
        return 'bg-red-100 text-red-800';
      case 'finalized':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const totalRevenue = trips
    .filter(t => t.status === 'finalized')
    .reduce((sum, t) => sum + t.totalAmount, 0);

  const pendingReview = trips.filter(t => t.status === 'pending' || t.status === 'flagged').length;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl mb-2">Billing & Reconciliation</h2>
        <p className="text-gray-600">Review trip billing, resolve discrepancies, and finalize invoices</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <div className="text-sm text-gray-600 mb-1">Today's Revenue</div>
          <div className="text-2xl text-green-600">${totalRevenue.toFixed(2)}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-600 mb-1">Pending Review</div>
          <div className="text-2xl text-yellow-600">{pendingReview}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-600 mb-1">Flagged</div>
          <div className="text-2xl text-red-600">
            {trips.filter(t => t.status === 'flagged').length}
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-600 mb-1">Finalized</div>
          <div className="text-2xl text-blue-600">
            {trips.filter(t => t.status === 'finalized').length}
          </div>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search by client name or trip ID..."
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
            <SelectItem value="reviewed">Reviewed</SelectItem>
            <SelectItem value="flagged">Flagged</SelectItem>
            <SelectItem value="finalized">Finalized</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </div>

      {/* Billing List */}
      <div className="grid gap-4">
        {filteredTrips.map((trip) => (
          <Card
            key={trip.id}
            className={`p-4 cursor-pointer hover:shadow-md transition-shadow ${
              trip.flags.length > 0 ? 'border-l-4 border-l-red-500' : ''
            }`}
            onClick={() => {
              setSelectedTrip(trip);
              setIsDialogOpen(true);
            }}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg">Trip {trip.id}</h3>
                  <Badge className={getStatusColor(trip.status)}>
                    {trip.status}
                  </Badge>
                  {trip.flags.length > 0 && (
                    <Badge className="bg-red-100 text-red-800">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {trip.flags.length} flag{trip.flags.length > 1 ? 's' : ''}
                    </Badge>
                  )}
                  <span className="text-sm text-gray-500">
                    {formatDate(trip.date)} at {formatTime(trip.date)}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-3 text-sm">
                  <div>
                    <span className="text-gray-500">Client:</span> {trip.clientName}
                  </div>
                  <div>
                    <span className="text-gray-500">Distance:</span> {trip.distance} mi
                  </div>
                  <div>
                    <span className="text-gray-500">Duration:</span> {trip.duration} min
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Base:</span> ${trip.baseFare.toFixed(2)}
                    </div>
                    <div>
                      <span className="text-gray-500">Mileage:</span> ${trip.mileageCharge.toFixed(2)}
                    </div>
                    <div>
                      <span className="text-gray-500">Time:</span> ${trip.timeCharge.toFixed(2)}
                    </div>
                    {trip.waitTimeCharge > 0 && (
                      <div>
                        <span className="text-gray-500">Wait:</span> ${trip.waitTimeCharge.toFixed(2)}
                      </div>
                    )}
                    {trip.surcharges.length > 0 && (
                      <div>
                        <span className="text-gray-500">Surcharges:</span> $
                        {trip.surcharges.reduce((sum, s) => sum + s.amount, 0).toFixed(2)}
                      </div>
                    )}
                  </div>
                  <div className="text-xl">
                    ${trip.totalAmount.toFixed(2)}
                  </div>
                </div>

                {trip.locationAccuracy !== 'accurate' && (
                  <div className="mt-2 text-sm">
                    <Badge variant="outline" className="bg-blue-50">
                      Location: {trip.locationAccuracy === 'auto-adjusted' ? 'Auto-adjusted (<0.5 mi)' : 'Manual Override'}
                    </Badge>
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Billing Detail Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Billing Details - Trip {selectedTrip?.id}</DialogTitle>
          </DialogHeader>
          {selectedTrip && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Badge className={getStatusColor(selectedTrip.status)}>
                  {selectedTrip.status}
                </Badge>
                {selectedTrip.flags.length > 0 && (
                  <Badge className="bg-red-100 text-red-800">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    Flagged for review
                  </Badge>
                )}
              </div>

              <Card className="p-4">
                <h4 className="mb-3">Trip Information</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-500">Client:</span> {selectedTrip.clientName}
                  </div>
                  <div>
                    <span className="text-gray-500">Date:</span> {formatDate(selectedTrip.date)}
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-500">Pickup:</span> {selectedTrip.pickupLocation}
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-500">Drop-off:</span> {selectedTrip.dropoffLocation}
                  </div>
                  <div>
                    <span className="text-gray-500">Distance:</span> {selectedTrip.distance} miles
                  </div>
                  <div>
                    <span className="text-gray-500">Duration:</span> {selectedTrip.duration} minutes
                  </div>
                  <div>
                    <span className="text-gray-500">Wait Time:</span> {selectedTrip.waitTime} minutes
                  </div>
                  <div>
                    <span className="text-gray-500">Accuracy:</span>{' '}
                    <Badge variant="outline" className="ml-1">
                      {selectedTrip.locationAccuracy}
                    </Badge>
                  </div>
                </div>
              </Card>

              {selectedTrip.flags.length > 0 && (
                <Card className="p-4 bg-red-50 border-red-200">
                  <h4 className="mb-3 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    Flags
                  </h4>
                  <div className="space-y-1">
                    {selectedTrip.flags.map((flag, i) => (
                      <div key={i} className="text-sm text-red-800">
                        • {flag}
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              <Card className="p-4">
                <h4 className="mb-3">Billing Breakdown</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Base Fare</span>
                    <span>${selectedTrip.baseFare.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      Mileage ({selectedTrip.distance} mi × $2.00/mi)
                    </span>
                    <span>${selectedTrip.mileageCharge.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      Time ({selectedTrip.duration} min × $0.40/min)
                    </span>
                    <span>${selectedTrip.timeCharge.toFixed(2)}</span>
                  </div>
                  {selectedTrip.waitTime > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        Wait Time ({selectedTrip.waitTime} min × $1.00/min)
                      </span>
                      <span>${selectedTrip.waitTimeCharge.toFixed(2)}</span>
                    </div>
                  )}
                  {selectedTrip.surcharges.map((surcharge, i) => (
                    <div key={i} className="flex justify-between">
                      <span className="text-gray-600">{surcharge.name}</span>
                      <span>${surcharge.amount.toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="border-t pt-2 mt-2 flex justify-between">
                    <span>Total Amount</span>
                    <span className="text-xl">${selectedTrip.totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </Card>

              {(selectedTrip.status === 'pending' || selectedTrip.status === 'flagged') && (
                <Card className="p-4">
                  <h4 className="mb-3">Manual Adjustments</h4>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label htmlFor="adjust-mileage">Adjust Mileage</Label>
                        <Input
                          id="adjust-mileage"
                          type="number"
                          step="0.1"
                          defaultValue={selectedTrip.distance}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="adjust-time">Adjust Duration (min)</Label>
                        <Input
                          id="adjust-time"
                          type="number"
                          defaultValue={selectedTrip.duration}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="audit-notes">Audit Notes</Label>
                      <Textarea
                        id="audit-notes"
                        placeholder="Enter notes about manual adjustments..."
                        rows={3}
                      />
                    </div>
                  </div>
                </Card>
              )}

              <div className="flex gap-2 pt-4 border-t">
                {selectedTrip.status === 'pending' && (
                  <Button
                    className="flex-1"
                    onClick={() => {
                      setTrips(
                        trips.map((t) =>
                          t.id === selectedTrip.id ? { ...t, status: 'reviewed' as const } : t
                        )
                      );
                      setIsDialogOpen(false);
                    }}
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Mark as Reviewed
                  </Button>
                )}
                {(selectedTrip.status === 'reviewed' || selectedTrip.status === 'pending') && (
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setTrips(
                        trips.map((t) =>
                          t.id === selectedTrip.id ? { ...t, status: 'finalized' as const } : t
                        )
                      );
                      setIsDialogOpen(false);
                    }}
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Finalize & Invoice
                  </Button>
                )}
                {selectedTrip.status === 'flagged' && (
                  <Button
                    variant="outline"
                    className="flex-1"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Save Adjustments
                  </Button>
                )}
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

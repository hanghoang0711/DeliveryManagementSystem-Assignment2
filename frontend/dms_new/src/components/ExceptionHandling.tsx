import { useState } from 'react';
import { AlertTriangle, Clock, MapPin, User, X, Check, ChevronRight } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';

interface Exception {
  id: string;
  type: 'delay' | 'offline' | 'idle' | 'deviation' | 'no-show';
  severity: 'high' | 'medium' | 'low';
  timestamp: string;
  vehicleId: string;
  driverId: string;
  tripId: string;
  description: string;
  status: 'open' | 'in-progress' | 'resolved';
  clientName?: string;
  location?: string;
}

const mockExceptions: Exception[] = [
  {
    id: 'EX001',
    type: 'delay',
    severity: 'high',
    timestamp: '2025-11-13T09:15:00',
    vehicleId: 'V001',
    driverId: 'D001',
    tripId: 'T001',
    description: 'Heavy traffic on Route 9 causing 20-minute delay',
    status: 'open',
    clientName: 'Mary Wilson',
    location: 'Route 9, Downtown',
  },
  {
    id: 'EX002',
    type: 'no-show',
    severity: 'medium',
    timestamp: '2025-11-13T08:45:00',
    vehicleId: 'V002',
    driverId: 'D002',
    tripId: 'T008',
    description: 'Client not present at pickup location after 10-minute wait',
    status: 'in-progress',
    clientName: 'James Patterson',
    location: '456 Oak Street',
  },
  {
    id: 'EX003',
    type: 'idle',
    severity: 'low',
    timestamp: '2025-11-13T09:30:00',
    vehicleId: 'V003',
    driverId: 'D003',
    tripId: '',
    description: 'Vehicle idle for 45 minutes without trip assignment',
    status: 'open',
    location: 'West Side Depot',
  },
  {
    id: 'EX004',
    type: 'deviation',
    severity: 'medium',
    timestamp: '2025-11-13T10:05:00',
    vehicleId: 'V002',
    driverId: 'D002',
    tripId: 'T002',
    description: 'Route deviation detected - 2.3 miles off planned route',
    status: 'resolved',
    clientName: 'Robert Chen',
    location: 'North District',
  },
];

export function ExceptionHandling() {
  const [exceptions, setExceptions] = useState<Exception[]>(mockExceptions);
  const [selectedEx, setSelectedEx] = useState<Exception | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'low':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-red-100 text-red-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'delay':
        return <Clock className="w-5 h-5" />;
      case 'offline':
        return <X className="w-5 h-5" />;
      case 'idle':
        return <Clock className="w-5 h-5" />;
      case 'deviation':
        return <MapPin className="w-5 h-5" />;
      case 'no-show':
        return <User className="w-5 h-5" />;
      default:
        return <AlertTriangle className="w-5 h-5" />;
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const then = new Date(dateString);
    const diffMs = now.getTime() - then.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 60) return `${diffMins} min ago`;
    const diffHours = Math.floor(diffMins / 60);
    return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  };

  const filteredExceptions = filterStatus === 'all' 
    ? exceptions 
    : exceptions.filter(ex => ex.status === filterStatus);

  const openCount = exceptions.filter(ex => ex.status === 'open').length;
  const inProgressCount = exceptions.filter(ex => ex.status === 'in-progress').length;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl mb-2">Exception Handling</h2>
        <p className="text-gray-600">Monitor and resolve operational issues in real-time</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <div className="text-sm text-gray-600 mb-1">Open Alerts</div>
          <div className="text-2xl text-red-600">{openCount}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-600 mb-1">In Progress</div>
          <div className="text-2xl text-blue-600">{inProgressCount}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-600 mb-1">Resolved Today</div>
          <div className="text-2xl text-green-600">
            {exceptions.filter(ex => ex.status === 'resolved').length}
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-600 mb-1">Avg Response Time</div>
          <div className="text-2xl">8 min</div>
        </Card>
      </div>

      {/* Filter */}
      <div className="mb-4">
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Exceptions</SelectItem>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Exception List */}
      <div className="grid gap-4">
        {filteredExceptions.map((exception) => (
          <Card
            key={exception.id}
            className={`p-4 border-l-4 cursor-pointer hover:shadow-md transition-shadow ${
              exception.severity === 'high' ? 'border-l-red-500' :
              exception.severity === 'medium' ? 'border-l-orange-500' :
              'border-l-yellow-500'
            }`}
            onClick={() => {
              setSelectedEx(exception);
              setIsDialogOpen(true);
            }}
          >
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-lg ${getSeverityColor(exception.severity)}`}>
                {getTypeIcon(exception.type)}
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg capitalize">{exception.type.replace('-', ' ')}</h3>
                  <Badge className={getSeverityColor(exception.severity)}>
                    {exception.severity}
                  </Badge>
                  <Badge className={getStatusColor(exception.status)}>
                    {exception.status.replace('-', ' ')}
                  </Badge>
                  <span className="text-sm text-gray-500 ml-auto">
                    {formatTimeAgo(exception.timestamp)}
                  </span>
                </div>

                <p className="text-gray-700 mb-3">{exception.description}</p>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  {exception.tripId && (
                    <div>
                      <span className="text-gray-500">Trip:</span> {exception.tripId}
                    </div>
                  )}
                  {exception.clientName && (
                    <div>
                      <span className="text-gray-500">Client:</span> {exception.clientName}
                    </div>
                  )}
                  <div>
                    <span className="text-gray-500">Vehicle:</span> {exception.vehicleId}
                  </div>
                  <div>
                    <span className="text-gray-500">Driver:</span> {exception.driverId}
                  </div>
                  {exception.location && (
                    <div className="col-span-2">
                      <span className="text-gray-500">Location:</span> {exception.location}
                    </div>
                  )}
                  <div className="col-span-2">
                    <span className="text-gray-500">Time:</span> {formatTime(exception.timestamp)}
                  </div>
                </div>
              </div>

              <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
            </div>
          </Card>
        ))}
      </div>

      {/* Exception Detail Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Exception Details - {selectedEx?.id}</DialogTitle>
          </DialogHeader>
          {selectedEx && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Badge className={getSeverityColor(selectedEx.severity)}>
                  {selectedEx.severity} severity
                </Badge>
                <Badge className={getStatusColor(selectedEx.status)}>
                  {selectedEx.status}
                </Badge>
              </div>

              <div>
                <h4 className="mb-2">Description</h4>
                <p className="bg-gray-50 p-3 rounded">{selectedEx.description}</p>
              </div>

              <div>
                <h4 className="mb-2">Details</h4>
                <div className="bg-gray-50 p-3 rounded grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-500">Exception ID:</span> {selectedEx.id}
                  </div>
                  <div>
                    <span className="text-gray-500">Timestamp:</span> {formatTime(selectedEx.timestamp)}
                  </div>
                  {selectedEx.tripId && (
                    <div>
                      <span className="text-gray-500">Trip ID:</span> {selectedEx.tripId}
                    </div>
                  )}
                  {selectedEx.clientName && (
                    <div>
                      <span className="text-gray-500">Client:</span> {selectedEx.clientName}
                    </div>
                  )}
                  <div>
                    <span className="text-gray-500">Vehicle:</span> {selectedEx.vehicleId}
                  </div>
                  <div>
                    <span className="text-gray-500">Driver:</span> {selectedEx.driverId}
                  </div>
                  {selectedEx.location && (
                    <div className="col-span-2">
                      <span className="text-gray-500">Location:</span> {selectedEx.location}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h4 className="mb-2">Resolution Actions</h4>
                <div className="space-y-3">
                  {selectedEx.type === 'delay' && (
                    <>
                      <Button variant="outline" className="w-full justify-start">
                        <Clock className="w-4 h-4 mr-2" />
                        Notify Client of Delay
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <MapPin className="w-4 h-4 mr-2" />
                        Suggest Alternate Route
                      </Button>
                    </>
                  )}
                  {selectedEx.type === 'no-show' && (
                    <>
                      <Button variant="outline" className="w-full justify-start">
                        <User className="w-4 h-4 mr-2" />
                        Contact Client
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <X className="w-4 h-4 mr-2" />
                        Cancel Trip
                      </Button>
                    </>
                  )}
                  {selectedEx.type === 'idle' && (
                    <Button variant="outline" className="w-full justify-start">
                      <MapPin className="w-4 h-4 mr-2" />
                      Assign New Trip
                    </Button>
                  )}
                  {selectedEx.tripId && (
                    <Button variant="outline" className="w-full justify-start">
                      <User className="w-4 h-4 mr-2" />
                      Reassign to Different Driver
                    </Button>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="resolution-notes">Resolution Notes</Label>
                <Textarea
                  id="resolution-notes"
                  placeholder="Enter notes about how this exception was handled..."
                  rows={3}
                  className="mt-2"
                />
              </div>

              <div className="flex gap-2 pt-4 border-t">
                {selectedEx.status === 'open' && (
                  <Button 
                    className="flex-1"
                    onClick={() => {
                      setExceptions(exceptions.map(ex => 
                        ex.id === selectedEx.id 
                          ? { ...ex, status: 'in-progress' as const }
                          : ex
                      ));
                      setIsDialogOpen(false);
                    }}
                  >
                    Start Working
                  </Button>
                )}
                {(selectedEx.status === 'open' || selectedEx.status === 'in-progress') && (
                  <Button 
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setExceptions(exceptions.map(ex => 
                        ex.id === selectedEx.id 
                          ? { ...ex, status: 'resolved' as const }
                          : ex
                      ));
                      setIsDialogOpen(false);
                    }}
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Mark Resolved
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

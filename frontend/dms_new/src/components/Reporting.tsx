import { useState } from 'react';
import { BarChart3, Download, Calendar, TrendingUp, TrendingDown, Clock, Users, DollarSign } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const dailyVolumeData = [
  { day: 'Mon', trips: 42, onTime: 39, delayed: 3 },
  { day: 'Tue', trips: 38, onTime: 36, delayed: 2 },
  { day: 'Wed', trips: 45, onTime: 41, delayed: 4 },
  { day: 'Thu', trips: 48, onTime: 46, delayed: 2 },
  { day: 'Fri', trips: 51, onTime: 48, delayed: 3 },
  { day: 'Sat', trips: 28, onTime: 27, delayed: 1 },
  { day: 'Sun', trips: 22, onTime: 21, delayed: 1 },
];

const revenueData = [
  { week: 'Week 1', revenue: 4200 },
  { week: 'Week 2', revenue: 4550 },
  { week: 'Week 3', revenue: 4100 },
  { week: 'Week 4', revenue: 4890 },
];

const tripTypeData = [
  { name: 'Medical', value: 45, color: '#3B82F6' },
  { name: 'Dialysis', value: 28, color: '#10B981' },
  { name: 'Therapy', value: 15, color: '#F59E0B' },
  { name: 'Personal', value: 12, color: '#8B5CF6' },
];

const driverPerformance = [
  { id: 'D001', name: 'John Smith', trips: 48, onTime: 46, rating: 4.8, revenue: 2850 },
  { id: 'D002', name: 'Sarah Johnson', trips: 52, onTime: 50, rating: 4.9, revenue: 3120 },
  { id: 'D003', name: 'Mike Davis', trips: 38, onTime: 35, rating: 4.6, revenue: 2240 },
];

const rejectionReasons = [
  { reason: 'No suitable vehicle available', count: 8 },
  { reason: 'Driver unavailable', count: 5 },
  { reason: 'Outside service area', count: 3 },
  { reason: 'Client cancellation', count: 12 },
  { reason: 'Weather conditions', count: 2 },
];

export function Reporting() {
  const [timeRange, setTimeRange] = useState('week');

  const totalTrips = dailyVolumeData.reduce((sum, d) => sum + d.trips, 0);
  const totalOnTime = dailyVolumeData.reduce((sum, d) => sum + d.onTime, 0);
  const onTimeRate = ((totalOnTime / totalTrips) * 100).toFixed(1);

  const totalRevenue = revenueData.reduce((sum, d) => sum + d.revenue, 0);
  const avgRevenue = totalRevenue / revenueData.length;
  const revenueGrowth = ((revenueData[3].revenue - revenueData[0].revenue) / revenueData[0].revenue * 100).toFixed(1);

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl mb-2">Reports & Analytics</h2>
          <p className="text-gray-600">Track operational metrics, performance, and business insights</p>
        </div>
        <div className="flex gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <Calendar className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-gray-600">Total Trips</div>
            <BarChart3 className="w-4 h-4 text-gray-400" />
          </div>
          <div className="text-2xl mb-1">{totalTrips}</div>
          <div className="flex items-center gap-1 text-sm text-green-600">
            <TrendingUp className="w-4 h-4" />
            <span>+12% vs last week</span>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-gray-600">On-Time Rate</div>
            <Clock className="w-4 h-4 text-gray-400" />
          </div>
          <div className="text-2xl mb-1">{onTimeRate}%</div>
          <div className="flex items-center gap-1 text-sm text-green-600">
            <TrendingUp className="w-4 h-4" />
            <span>+2.3% improvement</span>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-gray-600">Total Revenue</div>
            <DollarSign className="w-4 h-4 text-gray-400" />
          </div>
          <div className="text-2xl mb-1">${totalRevenue.toLocaleString()}</div>
          <div className="flex items-center gap-1 text-sm text-green-600">
            <TrendingUp className="w-4 h-4" />
            <span>+{revenueGrowth}% growth</span>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-gray-600">Active Drivers</div>
            <Users className="w-4 h-4 text-gray-400" />
          </div>
          <div className="text-2xl mb-1">{driverPerformance.length}</div>
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <span>All shifts covered</span>
          </div>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* Daily Volume Chart */}
        <Card className="p-6">
          <h3 className="mb-4">Daily Trip Volume</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dailyVolumeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="onTime" stackId="a" fill="#10B981" name="On Time" />
              <Bar dataKey="delayed" stackId="a" fill="#EF4444" name="Delayed" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Revenue Trend */}
        <Card className="p-6">
          <h3 className="mb-4">Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip formatter={(value) => `$${value}`} />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={2} name="Revenue" />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Trip Type Distribution */}
        <Card className="p-6">
          <h3 className="mb-4">Trip Types Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={tripTypeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {tripTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Rejection Reasons */}
        <Card className="p-6">
          <h3 className="mb-4">Trip Rejection Reasons</h3>
          <div className="space-y-3">
            {rejectionReasons.map((item, index) => (
              <div key={index}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700">{item.reason}</span>
                  <span>{item.count}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{
                      width: `${(item.count / Math.max(...rejectionReasons.map(r => r.count))) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Driver Performance Table */}
      <Card className="p-6">
        <h3 className="mb-4">Driver Performance Summary</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Driver</th>
                <th className="text-left py-3 px-4">Total Trips</th>
                <th className="text-left py-3 px-4">On-Time</th>
                <th className="text-left py-3 px-4">On-Time %</th>
                <th className="text-left py-3 px-4">Rating</th>
                <th className="text-left py-3 px-4">Revenue</th>
                <th className="text-left py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {driverPerformance.map((driver) => {
                const onTimePercent = ((driver.onTime / driver.trips) * 100).toFixed(1);
                return (
                  <tr key={driver.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div>
                        <div>{driver.name}</div>
                        <div className="text-sm text-gray-500">{driver.id}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4">{driver.trips}</td>
                    <td className="py-3 px-4">{driver.onTime}</td>
                    <td className="py-3 px-4">
                      <Badge
                        className={
                          parseFloat(onTimePercent) >= 95
                            ? 'bg-green-100 text-green-800'
                            : parseFloat(onTimePercent) >= 90
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }
                      >
                        {onTimePercent}%
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        <span>⭐</span>
                        <span>{driver.rating}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">${driver.revenue.toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <Badge className="bg-green-100 text-green-800">Active</Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Operational Efficiency */}
      <div className="grid grid-cols-3 gap-4 mt-6">
        <Card className="p-4">
          <h4 className="mb-3">Avg Trip Duration</h4>
          <div className="text-2xl mb-1">32 min</div>
          <div className="flex items-center gap-1 text-sm text-green-600">
            <TrendingDown className="w-4 h-4" />
            <span>5% faster</span>
          </div>
        </Card>

        <Card className="p-4">
          <h4 className="mb-3">Avg Distance</h4>
          <div className="text-2xl mb-1">9.2 mi</div>
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <span>Stable</span>
          </div>
        </Card>

        <Card className="p-4">
          <h4 className="mb-3">Vehicle Utilization</h4>
          <div className="text-2xl mb-1">87%</div>
          <div className="flex items-center gap-1 text-sm text-green-600">
            <TrendingUp className="w-4 h-4" />
            <span>+3% increase</span>
          </div>
        </Card>
      </div>
    </div>
  );
}

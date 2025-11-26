import { useEffect, useState } from 'react';
import { BarChart3, Download, Calendar, TrendingUp, TrendingDown, Clock, Users, DollarSign } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';

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

  const [driverData, setDriverData] = useState([]);
  const [driverMinStar, setdriverMinStar] = useState(4.0);

  useEffect(() => {
    async function getData() {
      axios.defaults.headers.common['Authorization'] = localStorage.getItem('authToken');

      await axios
      .get('http://localhost:3000/api/bao-cao/top-tai-xe')
      .then(res => {
        console.log(res.data.data);

        let data = res.data.data.filter(x => {
          let d = x["diem_trung_binh"];
          return driverMinStar <= d;
        })

        setDriverData(data)
      }).catch(e => console.log(e));
    }

    getData()
  }, [driverMinStar]);

  const [topCustomer, setTopCustomer] = useState([]);

  useEffect(() => {
    async function getData() {
      axios.defaults.headers.common['Authorization'] = localStorage.getItem('authToken');

      await axios
      .get('http://localhost:3000/api/bao-cao/top-khach-hang')
      .then(res => {
        console.log(res.data.data);
        setTopCustomer(res.data.data)
      }).catch(e => console.log(e));
    }

    getData()
  }, []);

  const [orders, setOrders] = useState([]);
  const [ordersPageNum, setOrdersPageNum] = useState(1);
  const [ordersPageNext, setOrdersPageNext] = useState(false);
  const [ordersPagePrev, setOrdersPagePrev] = useState(false);
  useEffect(() => {
    async function getData() {
      axios.defaults.headers.common['Authorization'] = localStorage.getItem('authToken');

      await axios
      .get('http://localhost:3000/api/don-hang', {
        params: {
          limit: 5,
          page: ordersPageNum
        }
      })
      .then(res => {
        console.log(res.data);
        setOrders(res.data.data);
        setOrdersPageNext(res.data.pagination.hasNextPage);
        setOrdersPagePrev(res.data.pagination.hasPrevPage);
      }).catch(e => console.log(e));
    }

    getData()
  }, [ordersPageNum]);

  const [trips, setTrips] = useState([]);
  const [tripsPageNum, setTripsPageNum] = useState(1);
  const [tripsPageNext, setTripsPageNext] = useState(false);
  const [tripsPagePrev, setTripePagePrev] = useState(false);
  const [tripsTotalOrders, setTripsTotalOrders] = useState(0);
  const [tripsTotalDist, setTripsTotalDist] = useState(0);
  const [tripsNum, setTripsNum] = useState(0);

  useEffect(() => {
    async function getData() {
      axios.defaults.headers.common['Authorization'] = localStorage.getItem('authToken');

      await axios
      .get('http://localhost:3000/api/chuyen-giao-hang', {
        params: {
          limit: 5,
          page: ordersPageNum
        }
      })
      .then(res => {
        console.log(res.data);
        let data = res.data.data;
        setTrips(data);
        setTripsPageNext(res.data.pagination.hasNextPage);
        setTripePagePrev(res.data.pagination.hasPrevPage);

        setTripsNum(data.length)

        setTripsTotalOrders(data
          .reduce((a: number, c: any) => 
            a + c["so_luong_don_gop"],
          0)
        )

        setTripsTotalDist(data
          .reduce((a: number, c: any) => 
            a + c["donHangs"].reduce((a: number, c: any ) => a + c["quang_duong"], 0), 
          0)  
        )
        
      }).catch(e => console.log(e));
    }

    getData()
  }, [tripsPageNum]);

  return (
    <div className="p-6 gap-4">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl mb-2">Phân tích & Báo cáo</h2>
        </div>
      </div>

      <Card className="p-6 mt-4">
        <div className='flex'>
          <h3 className="mb-4 w-full">Top tài xế</h3>
          <div className='flex g-1'>
            <p className='w-full'>Filter min rating: </p>
            <input type="number" value={driverMinStar} onChange={(e) => setdriverMinStar(e.target.value)} min="0" max="5"></input>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Tài xế</th>
                <th className="text-left py-3 px-4">Số đơn giao</th>
                <th className="text-left py-3 px-4">Rating</th>
              </tr>
            </thead>
            <tbody>
              {driverData.map((driver) => {
                return (
                  <tr className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div>
                        <div>{driver["Ten_tai_xe"]}</div>
                        <div className="text-sm text-gray-500">{driver["Ma_tai_xe"]}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4">{driver["so_don_giao"]}</td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        <span>⭐</span>
                        <span>{driver["diem_trung_binh"]}</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="p-6 mt-4">
        <div className='flex'>
          <h3 className="mb-4 w-full">Top Khách hàng</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Mã khách hàng</th>
                <th className="text-left py-3 px-4">Số đơn hàng</th>
                <th className="text-left py-3 px-4">Thu nhập</th>
              </tr>
            </thead>
            <tbody>
              {topCustomer.map(customer => {
                return (
                  <tr className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                        {customer["Ma_khach_hang"]}
                    </td>
                    <td className="py-3 px-4">{customer["so_don_hang"]}</td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        <span>{customer["total_revenue"]}</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="p-6 mt-4">
        <div className='flex'>
          <h3 className="mb-4 w-full">Đơn hàng</h3>
          <div className='flex px-10 items-center justify-center'>
            <button 
              className='bg-blue-500 hover:bg-gray-800 text-white rounded-xl cursor-pointer p-2'
              onClick={() => { if (ordersPagePrev) {setOrdersPageNum(ordersPageNum-1)} }}
            >Trước</button>
            <div className='flex m-4 w-10 items-center justify-center'>
              <p className='p-5'>{ordersPageNum}</p>
            </div>
            <button 
              className='bg-blue-500 hover:bg-gray-800 text-white rounded-xl cursor-pointer p-2'
              onClick={() => { if (ordersPageNext) {setOrdersPageNum(ordersPageNum+1)} }}
            >Sau</button>
            {/* <input type="number" min="0" max="5"></input> */}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Mã đơn hàng</th>
                <th className="text-left py-3 px-4">Mã khách hàng</th>
                <th className="text-left py-3 px-4">Trạng thái đơn</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => {
                return (
                  <tr className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                        {order["Ma_don_hang"]}
                    </td>
                    <td className="py-3 px-4">{order["Ma_khach_hang"]}</td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        <span>{order["Trang_thai_don"]}</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="p-6 mt-4">
        <div className='flex'>
          <h3 className="mb-4 w-full">Chuyến giao hàng</h3>
          <div className='flex px-10 items-center justify-center'>
            <button 
              className='bg-blue-500 hover:bg-gray-800 text-white rounded-xl cursor-pointer p-2'
              onClick={() => { if (tripsPagePrev) {setTripsPageNum(tripsPageNum-1)} }}
            >Trước</button>
            <div className='flex m-4 w-10 items-center justify-center'>
              <p className='p-5'>{tripsPageNum}</p>
            </div>
            <button 
              className='bg-blue-500 hover:bg-gray-800 text-white rounded-xl cursor-pointer p-2'
              onClick={() => { if (tripsPageNext) {setTripsPageNum(tripsPageNum+1)} }}
            >Sau</button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Mã chuyến giao hàng</th>
                <th className="text-left py-3 px-4">Số lượng đơn</th>
                <th className="text-left py-3 px-4">Tổng quãng đường</th>
              </tr>
            </thead>
            <tbody>
              {trips.map(trip => {
                return (
                  <tr className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                        {trip["DeliveryID"]}
                    </td>

                    <td className="py-3 px-4">{trip["so_luong_don_gop"]}</td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        <span>{trip["donHangs"].reduce((a: number, c: any ) => a + c["quang_duong"], 0)}km</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="p-4">
            <h4 className="mb-3">Tổng đơn hàng xử lý</h4>
            <div className="text-2xl mb-1">{tripsTotalOrders}</div>
          </div>

          <div className="p-4">
            <h4 className="mb-3">Tổng quãng đường</h4>
            <div className="text-2xl mb-1">{tripsTotalDist}km</div>
          </div>

          <div className="p-4">
            <h4 className="mb-3">Trung bình quãng đường mỗi chuyến</h4>
            <div className="text-2xl mb-1">{tripsNum ? tripsTotalDist / tripsNum : "N/A"}km</div>
          </div>

        </div>
      </Card>
    </div>
  );
}

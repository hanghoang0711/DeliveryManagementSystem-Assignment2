// import { useState } from 'react';
// import { Plus, Edit, Trash2, Search, Car, User } from 'lucide-react';
// import { Button } from './ui/button';
// import { Input } from './ui/input';
// import { Badge } from './ui/badge';
// import { Card } from './ui/card';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
// import { Label } from './ui/label';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
// import { Switch } from './ui/switch';


// interface Vehicle {
//   id: string;
//   name: string;
//   type: string;
//   capacity: number;
//   vin: string;
//   license: string;
//   serviceArea: string;
//   status: 'active' | 'inactive' | 'maintenance';
//   features: string[];
// }

// interface Driver {
//   id: string;
//   name: string;
//   vehicleId: string | null;
//   shift: string;
//   phone: string;
//   certifications: string[];
//   status: 'active' | 'inactive' | 'on-break';
// }

// const mockVehicles: Vehicle[] = [
//   {
//     id: 'V001',
//     name: 'Van 1',
//     type: 'Wheelchair Van',
//     capacity: 4,
//     vin: '1HGBH41JXMN109186',
//     license: 'ABC-1234',
//     serviceArea: 'Downtown',
//     status: 'active',
//     features: ['wheelchair', 'stretcher'],
//   },
//   {
//     id: 'V002',
//     name: 'Sedan 2',
//     type: 'Standard Sedan',
//     capacity: 3,
//     vin: '2FMDK3GC8BBA12345',
//     license: 'XYZ-5678',
//     serviceArea: 'North District',
//     status: 'active',
//     features: ['ambulatory'],
//   },
//   {
//     id: 'V003',
//     name: 'Van 3',
//     type: 'Wheelchair Van',
//     capacity: 6,
//     vin: '3VWLL7AJ9DM123456',
//     license: 'DEF-9012',
//     serviceArea: 'West Side',
//     status: 'maintenance',
//     features: ['wheelchair'],
//   },
// ];

// const mockDrivers: Driver[] = [
//   {
//     id: 'D001',
//     name: 'John Smith',
//     vehicleId: 'V001',
//     shift: '6:00 AM - 2:00 PM',
//     phone: '(555) 123-4567',
//     certifications: ['CPR', 'First Aid', 'Wheelchair Lift'],
//     status: 'active',
//   },
//   {
//     id: 'D002',
//     name: 'Sarah Johnson',
//     vehicleId: 'V002',
//     shift: '2:00 PM - 10:00 PM',
//     phone: '(555) 234-5678',
//     certifications: ['CPR', 'First Aid'],
//     status: 'active',
//   },
//   {
//     id: 'D003',
//     name: 'Mike Davis',
//     vehicleId: null,
//     shift: '10:00 PM - 6:00 AM',
//     phone: '(555) 345-6789',
//     certifications: ['CPR', 'First Aid', 'Wheelchair Lift', 'Stretcher'],
//     status: 'inactive',
//   },
// ];

// export function VehicleDriverSetup() {
//   const [vehicles] = useState<Vehicle[]>(mockVehicles);
//   const [drivers] = useState<Driver[]>(mockDrivers);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [isVehicleDialogOpen, setIsVehicleDialogOpen] = useState(false);
//   const [isDriverDialogOpen, setIsDriverDialogOpen] = useState(false);

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case 'active':
//         return 'bg-green-100 text-green-800';
//       case 'inactive':
//         return 'bg-gray-100 text-gray-800';
//       case 'maintenance':
//         return 'bg-orange-100 text-orange-800';
//       case 'on-break':
//         return 'bg-yellow-100 text-yellow-800';
//       default:
//         return 'bg-gray-100 text-gray-800';
//     }
//   };

//   return (
//     <div className="p-6">
//       <div className="mb-6">
//         <h2 className="text-2xl mb-2">Phương tiện & Tài xế</h2>
//         <p className="text-gray-600">Quản lý đội xe và tài xế</p>
//       </div>

//       <Tabs defaultValue="vehicles" className="space-y-6">
//         <TabsList>
//           <TabsTrigger value="vehicles">
//             <Car className="w-4 h-4 mr-2" />
//             Vehicles
//           </TabsTrigger>
//           <TabsTrigger value="drivers">
//             <User className="w-4 h-4 mr-2" />
//             Drivers
//           </TabsTrigger>
//         </TabsList>

//         <TabsContent value="vehicles" className="space-y-4">
//           <div className="flex gap-4">
//             <div className="relative flex-1">
//               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
//               <Input
//                 placeholder="Search vehicles by name, VIN, or license plate..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="pl-10"
//               />
//             </div>
//             <Dialog open={isVehicleDialogOpen} onOpenChange={setIsVehicleDialogOpen}>
//               <DialogTrigger asChild>
//                 <Button>
//                   <Plus className="w-4 h-4 mr-2" />
//                   Add Vehicle
//                 </Button>
//               </DialogTrigger>
//               <DialogContent className="max-w-2xl">
//                 <DialogHeader>
//                   <DialogTitle>Add New Vehicle</DialogTitle>
//                 </DialogHeader>
//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="space-y-2">
//                     <Label htmlFor="vehicle-name">Vehicle Name</Label>
//                     <Input id="vehicle-name" placeholder="Van 4" />
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="vehicle-type">Type</Label>
//                     <Select>
//                       <SelectTrigger id="vehicle-type">
//                         <SelectValue placeholder="Select type" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="wheelchair-van">Wheelchair Van</SelectItem>
//                         <SelectItem value="sedan">Standard Sedan</SelectItem>
//                         <SelectItem value="suv">SUV</SelectItem>
//                         <SelectItem value="minibus">Minibus</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="capacity">Capacity</Label>
//                     <Input id="capacity" type="number" placeholder="4" />
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="vin">VIN</Label>
//                     <Input id="vin" placeholder="1HGBH41JXMN109186" />
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="license">License Plate</Label>
//                     <Input id="license" placeholder="ABC-1234" />
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="service-area">Service Area</Label>
//                     <Input id="service-area" placeholder="Downtown" />
//                   </div>
//                   <div className="col-span-2 space-y-2">
//                     <Label>Features</Label>
//                     <div className="flex gap-4">
//                       <label className="flex items-center gap-2">
//                         <input type="checkbox" className="rounded" />
//                         <span className="text-sm">Wheelchair Access</span>
//                       </label>
//                       <label className="flex items-center gap-2">
//                         <input type="checkbox" className="rounded" />
//                         <span className="text-sm">Stretcher</span>
//                       </label>
//                       <label className="flex items-center gap-2">
//                         <input type="checkbox" className="rounded" />
//                         <span className="text-sm">Ambulatory Only</span>
//                       </label>
//                     </div>
//                   </div>
//                   <div className="col-span-2 flex items-center justify-between">
//                     <Label htmlFor="active-status">Active Status</Label>
//                     <Switch id="active-status" defaultChecked />
//                   </div>
//                 </div>
//                 <div className="flex justify-end gap-2 mt-4">
//                   <Button variant="outline" onClick={() => setIsVehicleDialogOpen(false)}>
//                     Cancel
//                   </Button>
//                   <Button onClick={() => setIsVehicleDialogOpen(false)}>
//                     Add Vehicle
//                   </Button>
//                 </div>
//               </DialogContent>
//             </Dialog>
//           </div>

//           <div className="grid gap-4">
//             {vehicles.map((vehicle) => (
//               <Card key={vehicle.id} className="p-4">
//                 <div className="flex items-start justify-between">
//                   <div className="flex-1">
//                     <div className="flex items-center gap-3 mb-2">
//                       <h3 className="text-lg">{vehicle.name}</h3>
//                       <Badge className={getStatusColor(vehicle.status)}>
//                         {vehicle.status}
//                       </Badge>
//                       <span className="text-gray-500">•</span>
//                       <span className="text-gray-600">{vehicle.type}</span>
//                     </div>
//                     <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
//                       <div>
//                         <span className="text-gray-500">VIN:</span> {vehicle.vin}
//                       </div>
//                       <div>
//                         <span className="text-gray-500">License:</span> {vehicle.license}
//                       </div>
//                       <div>
//                         <span className="text-gray-500">Capacity:</span> {vehicle.capacity} passengers
//                       </div>
//                       <div>
//                         <span className="text-gray-500">Service Area:</span> {vehicle.serviceArea}
//                       </div>
//                       <div className="col-span-2">
//                         <span className="text-gray-500">Features:</span>{' '}
//                         {vehicle.features.map((feature, i) => (
//                           <Badge key={i} variant="outline" className="ml-1">
//                             {feature}
//                           </Badge>
//                         ))}
//                       </div>
//                     </div>
//                   </div>
//                   <div className="flex gap-2">
//                     <Button variant="ghost" size="sm">
//                       <Edit className="w-4 h-4" />
//                     </Button>
//                     <Button variant="ghost" size="sm">
//                       <Trash2 className="w-4 h-4" />
//                     </Button>
//                   </div>
//                 </div>
//               </Card>
//             ))}
//           </div>
//         </TabsContent>

//         <TabsContent value="drivers" className="space-y-4">
//           <div className="flex gap-4">
//             <div className="relative flex-1">
//               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
//               <Input
//                 placeholder="Search drivers by name or phone..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="pl-10"
//               />
//             </div>
//             <Dialog open={isDriverDialogOpen} onOpenChange={setIsDriverDialogOpen}>
//               <DialogTrigger asChild>
//                 <Button>
//                   <Plus className="w-4 h-4 mr-2" />
//                   Add Driver
//                 </Button>
//               </DialogTrigger>
//               <DialogContent className="max-w-2xl">
//                 <DialogHeader>
//                   <DialogTitle>Add New Driver</DialogTitle>
//                 </DialogHeader>
//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="space-y-2">
//                     <Label htmlFor="driver-name">Full Name</Label>
//                     <Input id="driver-name" placeholder="John Smith" />
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="phone">Phone</Label>
//                     <Input id="phone" placeholder="(555) 123-4567" />
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="assign-vehicle">Assign Vehicle</Label>
//                     <Select>
//                       <SelectTrigger id="assign-vehicle">
//                         <SelectValue placeholder="Select vehicle" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         {vehicles.map((v) => (
//                           <SelectItem key={v.id} value={v.id}>
//                             {v.name} - {v.type}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="shift">Shift</Label>
//                     <Input id="shift" placeholder="6:00 AM - 2:00 PM" />
//                   </div>
//                   <div className="col-span-2 space-y-2">
//                     <Label>Certifications</Label>
//                     <div className="flex gap-4">
//                       <label className="flex items-center gap-2">
//                         <input type="checkbox" className="rounded" />
//                         <span className="text-sm">CPR</span>
//                       </label>
//                       <label className="flex items-center gap-2">
//                         <input type="checkbox" className="rounded" />
//                         <span className="text-sm">First Aid</span>
//                       </label>
//                       <label className="flex items-center gap-2">
//                         <input type="checkbox" className="rounded" />
//                         <span className="text-sm">Wheelchair Lift</span>
//                       </label>
//                       <label className="flex items-center gap-2">
//                         <input type="checkbox" className="rounded" />
//                         <span className="text-sm">Stretcher</span>
//                       </label>
//                     </div>
//                   </div>
//                   <div className="col-span-2 flex items-center justify-between">
//                     <Label htmlFor="driver-active">Active Status</Label>
//                     <Switch id="driver-active" defaultChecked />
//                   </div>
//                 </div>
//                 <div className="flex justify-end gap-2 mt-4">
//                   <Button variant="outline" onClick={() => setIsDriverDialogOpen(false)}>
//                     Cancel
//                   </Button>
//                   <Button onClick={() => setIsDriverDialogOpen(false)}>
//                     Add Driver
//                   </Button>
//                 </div>
//               </DialogContent>
//             </Dialog>
//           </div>

//           <div className="grid gap-4">
//             {drivers.map((driver) => {
//               const assignedVehicle = vehicles.find((v) => v.id === driver.vehicleId);
              
//               return (
//                 <Card key={driver.id} className="p-4">
//                   <div className="flex items-start justify-between">
//                     <div className="flex-1">
//                       <div className="flex items-center gap-3 mb-2">
//                         <h3 className="text-lg">{driver.name}</h3>
//                         <Badge className={getStatusColor(driver.status)}>
//                           {driver.status}
//                         </Badge>
//                       </div>
//                       <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
//                         <div>
//                           <span className="text-gray-500">Phone:</span> {driver.phone}
//                         </div>
//                         <div>
//                           <span className="text-gray-500">Shift:</span> {driver.shift}
//                         </div>
//                         <div>
//                           <span className="text-gray-500">Vehicle:</span>{' '}
//                           {assignedVehicle ? assignedVehicle.name : 'Not assigned'}
//                         </div>
//                         <div className="col-span-2">
//                           <span className="text-gray-500">Certifications:</span>{' '}
//                           {driver.certifications.map((cert, i) => (
//                             <Badge key={i} variant="outline" className="ml-1">
//                               {cert}
//                             </Badge>
//                           ))}
//                         </div>
//                       </div>
//                     </div>
//                     <div className="flex gap-2">
//                       <Button variant="ghost" size="sm">
//                         <Edit className="w-4 h-4" />
//                       </Button>
//                       <Button variant="ghost" size="sm">
//                         <Trash2 className="w-4 h-4" />
//                       </Button>
//                     </div>
//                   </div>
//                 </Card>
//               );
//             })}
//           </div>
//         </TabsContent>
//       </Tabs>
//     </div>
//   );
// }


"use client";

import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, Search, User } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Card } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";

import { driverAPI, Driver } from "../api/services"; // 👈 import đúng

export function VehicleDriverSetup() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDriverDialogOpen, setIsDriverDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [driverForm, setDriverForm] = useState<Driver>({
    name: "",
    phone: "",
    status: "active",
    vehicleId: null,
    certifications: [],
    shift: "",
  });

  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    try {
      const res = await driverAPI.getAll();
      setDrivers(res || []);
    } catch (err) {
      console.error("❌ Lỗi load drivers:", err);
    }
  };

  const handleOpenAdd = () => {
    setIsEditing(false);
    setDriverForm({
      name: "",
      phone: "",
      status: "active",
      vehicleId: null,
      certifications: [],
      shift: "",
    });
    setIsDriverDialogOpen(true);
  };

  const handleOpenEdit = (driver: Driver) => {
    setIsEditing(true);
    setDriverForm(driver);
    setIsDriverDialogOpen(true);
  };

  const handleSubmitForm = async () => {
    try {
      if (isEditing && driverForm.id) {
        await driverAPI.update(driverForm.id, driverForm);
      } else {
        await driverAPI.create(driverForm);
      }
      await fetchDrivers();
      setIsDriverDialogOpen(false);
    } catch (err: any) {
      alert(err?.response?.data?.message || "❌ Lỗi khi xử lý tài xế");
    }
  };

  const handleDeleteDriver = async (id?: string) => {
    if (!id) return;
    if (confirm("Bạn có chắc chắn muốn xoá tài xế này không?")) {
      try {
        await driverAPI.delete(id);
        fetchDrivers();
      } catch (err: any) {
        alert(err?.response?.data?.message);
      }
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      case "on-break":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl mb-2">Phương tiện & Tài xế</h2>
        <p className="text-gray-600">Quản lý đội xe và tài xế</p>
      </div>

      <Tabs defaultValue="drivers">
        <TabsList>
          <TabsTrigger value="drivers">
            <User className="w-4 h-4 mr-2" /> Drivers
          </TabsTrigger>
        </TabsList>

        <TabsContent value="drivers" className="space-y-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search driver by name or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Dialog open={isDriverDialogOpen} onOpenChange={setIsDriverDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={handleOpenAdd}>
                  <Plus className="w-4 h-4 mr-2" /> Add Driver
                </Button>
              </DialogTrigger>

              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{isEditing ? "Cập nhật" : "Thêm mới"}</DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Full Name</Label>
                    <Input
                      value={driverForm.name}
                      onChange={(e) =>
                        setDriverForm({ ...driverForm, name: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <Label>Phone</Label>
                    <Input
                      value={driverForm.phone}
                      onChange={(e) =>
                        setDriverForm({ ...driverForm, phone: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <Label>Shift</Label>
                    <Input
                      value={driverForm.shift}
                      onChange={(e) =>
                        setDriverForm({ ...driverForm, shift: e.target.value })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between col-span-2">
                    <Label>Status</Label>
                    <Switch
                      checked={driverForm.status === "active"}
                      onCheckedChange={(v) =>
                        setDriverForm({ ...driverForm, status: v ? "active" : "inactive" })
                      }
                    />
                  </div>
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDriverDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSubmitForm}>
                    {isEditing ? "Cập nhật" : "Thêm mới"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {drivers
              .filter(
                (d) =>
                  d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  d.phone.includes(searchQuery)
              )
              .map((driver) => (
                <Card key={driver.id} className="p-4">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="text-lg">{driver.name}</h3>
                      <Badge className={getStatusColor(driver.status)}>
                        {driver.status}
                      </Badge>
                      <p className="text-sm text-gray-600">📞 {driver.phone}</p>
                      <p className="text-sm text-gray-600">
                        Shift: {driver.shift || "N/A"}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleOpenEdit(driver)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteDriver(driver.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

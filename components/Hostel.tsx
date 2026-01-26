import React from 'react';
import { Language } from '../types';
import { UI_LABELS, MOCK_STUDENTS } from '../constants';
import { Building, Home, PenTool, AlertTriangle, CheckCircle } from 'lucide-react';

interface HostelProps {
  language: Language;
}

const Hostel: React.FC<HostelProps> = ({ language }) => {
  const t = UI_LABELS[language];

  const requests = [
    { id: 1, type: 'Maintenance', detail: 'Leaking tap in Room 302', status: 'Pending', date: '2023-10-24' },
    { id: 2, type: 'Room Change', detail: 'Request move to Block B', status: 'Approved', date: '2023-10-22' },
    { id: 3, type: 'Cleaning', detail: 'Deep cleaning for Room 105', status: 'Completed', date: '2023-10-20' },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">{t.hostelOverview}</h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="bg-white overflow-hidden shadow rounded-lg p-5 flex items-center">
           <div className="bg-purple-100 p-3 rounded-md">
             <Building className="h-6 w-6 text-purple-600" />
           </div>
           <div className="ml-5">
             <dt className="text-sm font-medium text-gray-500">Total Rooms</dt>
             <dd className="text-2xl font-semibold text-gray-900">120</dd>
           </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg p-5 flex items-center">
           <div className="bg-blue-100 p-3 rounded-md">
             <Home className="h-6 w-6 text-blue-600" />
           </div>
           <div className="ml-5">
             <dt className="text-sm font-medium text-gray-500">Occupied</dt>
             <dd className="text-2xl font-semibold text-gray-900">98</dd>
           </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg p-5 flex items-center">
           <div className="bg-green-100 p-3 rounded-md">
             <CheckCircle className="h-6 w-6 text-green-600" />
           </div>
           <div className="ml-5">
             <dt className="text-sm font-medium text-gray-500">{t.occupancyRate}</dt>
             <dd className="text-2xl font-semibold text-gray-900">81.6%</dd>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Room Allocation */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
             <h3 className="text-lg font-medium text-gray-900">{t.roomAllocation}</h3>
          </div>
          <ul className="divide-y divide-gray-200 max-h-80 overflow-y-auto">
            {MOCK_STUDENTS.slice(0, 4).map((student, idx) => (
              <li key={student.id} className="px-6 py-4 flex items-center justify-between">
                <div className="flex items-center">
                   <img className="h-10 w-10 rounded-full" src={student.avatar} alt="" />
                   <div className="ml-3">
                     <p className="text-sm font-medium text-gray-900">{student.name}</p>
                     <p className="text-xs text-gray-500">{student.grade}</p>
                   </div>
                </div>
                <div className="text-sm font-semibold text-gray-700 bg-gray-100 px-3 py-1 rounded-full">
                  Room {101 + idx}
                </div>
              </li>
            ))}
            <li className="px-6 py-4 text-center text-sm text-blue-600 cursor-pointer hover:underline">
              View All Allocations
            </li>
          </ul>
        </div>

        {/* Maintenance Requests */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
             <h3 className="text-lg font-medium text-gray-900">{t.maintenanceRequests}</h3>
             <button className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded hover:bg-blue-100 transition-colors">
               + New Request
             </button>
          </div>
          <div className="p-6 space-y-4">
            {requests.map((req) => (
              <div key={req.id} className="flex items-start p-3 bg-gray-50 rounded-md">
                 <div className="flex-shrink-0 pt-0.5">
                    {req.type === 'Maintenance' ? (
                       <PenTool className="h-5 w-5 text-amber-500" />
                    ) : (
                       <AlertTriangle className="h-5 w-5 text-blue-500" />
                    )}
                 </div>
                 <div className="ml-3 w-0 flex-1">
                    <div className="text-sm font-medium text-gray-900 flex justify-between">
                      {req.type}
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        req.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                        req.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {req.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{req.detail}</p>
                    <p className="text-xs text-gray-400 mt-2">{req.date}</p>
                 </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hostel;

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Language } from '../types';
import { UI_LABELS } from '../constants';
import { Users, BookOpen, Clock, AlertCircle } from 'lucide-react';

interface DashboardProps {
  language: Language;
}

const data = [
  { name: 'Mon', attendance: 95 },
  { name: 'Tue', attendance: 92 },
  { name: 'Wed', attendance: 96 },
  { name: 'Thu', attendance: 91 },
  { name: 'Fri', attendance: 88 },
];

const gradeDist = [
  { grade: 'A', count: 45 },
  { grade: 'B', count: 30 },
  { grade: 'C', count: 15 },
  { grade: 'D', count: 8 },
  { grade: 'F', count: 2 },
];

const StatCard = ({ title, value, icon: Icon, color }: { title: string, value: string, icon: React.ElementType, color: string }) => (
  <div className="bg-white overflow-hidden rounded-lg shadow hover:shadow-md transition-shadow">
    <div className="p-5">
      <div className="flex items-center">
        <div className={`flex-shrink-0 rounded-md p-3 ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div className="ml-5 w-0 flex-1">
          <dl>
            <dt className="truncate text-sm font-medium text-gray-500">{title}</dt>
            <dd>
              <div className="text-lg font-medium text-gray-900">{value}</div>
            </dd>
          </dl>
        </div>
      </div>
    </div>
  </div>
);

const Dashboard: React.FC<DashboardProps> = ({ language }) => {
  const t = UI_LABELS[language];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
        {language === 'en' ? 'Dashboard Overview' : '仪表盘概览'}
      </h2>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title={t.activeStudents} value="1,234" icon={Users} color="bg-blue-500" />
        <StatCard title={t.avgAttendance} value="94.5%" icon={Clock} color="bg-green-500" />
        <StatCard title={t.totalCourses} value="48" icon={BookOpen} color="bg-purple-500" />
        <StatCard title={t.pendingApprovals} value="12" icon={AlertCircle} color="bg-amber-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">{t.attendanceTrend}</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis domain={[80, 100]} />
                <Tooltip />
                <Line type="monotone" dataKey="attendance" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Grade Distribution */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">{t.gradeDistribution}</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={gradeDist}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="grade" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Quick Access / Workflows */}
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-base font-semibold leading-6 text-gray-900">{t.recentActivity}</h3>
        </div>
        <div className="border-t border-gray-200">
          <ul role="list" className="divide-y divide-gray-200">
             {[1, 2, 3].map((i) => (
               <li key={i} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                 <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-blue-600 truncate">New Student Registration</p>
                    <div className="ml-2 flex-shrink-0 flex">
                      <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Approved
                      </p>
                    </div>
                 </div>
                 <div className="mt-2 sm:flex sm:justify-between">
                   <div className="sm:flex">
                     <p className="flex items-center text-sm text-gray-500">
                       Applied by Admin User
                     </p>
                   </div>
                   <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                     <Clock className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                     <p>2 hours ago</p>
                   </div>
                 </div>
               </li>
             ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

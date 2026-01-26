import React, { useState, useMemo } from 'react';
import { MOCK_STUDENTS, UI_LABELS } from '../constants';
import { Language } from '../types';
import { Calendar, Check, X, Clock, AlertCircle, Save, ChevronLeft, ChevronRight, Filter } from 'lucide-react';

interface AttendanceProps {
  language: Language;
}

type Status = 'Present' | 'Absent' | 'Late' | 'Excused';

const Attendance: React.FC<AttendanceProps> = ({ language }) => {
  const t = UI_LABELS[language];
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Get unique classes for filter
  const uniqueClasses = useMemo(() => Array.from(new Set(MOCK_STUDENTS.map(s => s.className))).sort(), []);
  const [selectedClass, setSelectedClass] = useState(uniqueClasses[0] || 'Class 10-A');

  const [attendance, setAttendance] = useState<Record<string, Status>>(() => {
    const initial: Record<string, Status> = {};
    MOCK_STUDENTS.forEach(s => initial[s.id] = 'Present');
    return initial;
  });

  const [remarks, setRemarks] = useState<Record<string, string>>({});

  const handleStatusChange = (id: string, status: Status) => {
    setAttendance(prev => ({ ...prev, [id]: status }));
  };

  const handleRemarkChange = (id: string, value: string) => {
    setRemarks(prev => ({ ...prev, [id]: value }));
  };

  const changeDate = (days: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + days);
    setCurrentDate(newDate);
  };

  const filteredStudents = useMemo(() => {
     return MOCK_STUDENTS.filter(s => s.className === selectedClass);
  }, [selectedClass]);

  const stats = {
    Present: filteredStudents.filter(s => attendance[s.id] === 'Present').length,
    Absent: filteredStudents.filter(s => attendance[s.id] === 'Absent').length,
    Late: filteredStudents.filter(s => attendance[s.id] === 'Late').length,
    Excused: filteredStudents.filter(s => attendance[s.id] === 'Excused').length,
  };

  const statusConfig = {
    Present: { color: 'bg-green-100 text-green-800', icon: Check, label: t.present },
    Absent: { color: 'bg-red-100 text-red-800', icon: X, label: t.absent },
    Late: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, label: t.late },
    Excused: { color: 'bg-gray-100 text-gray-800', icon: AlertCircle, label: t.excused },
  };

  const handleSave = () => {
    // In a real app, this would send data to backend
    alert(`Attendance saved for ${selectedClass} on ${currentDate.toLocaleDateString()}`);
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{t.markAttendance}</h2>
          <div className="flex items-center mt-2 space-x-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <select 
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="block rounded-md border-0 py-1.5 pl-3 pr-8 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-600 sm:text-sm sm:leading-6 cursor-pointer"
            >
                {uniqueClasses.map(cls => (
                    <option key={cls} value={cls}>{cls}</option>
                ))}
            </select>
          </div>
        </div>
        <div className="flex items-center space-x-4 bg-white p-2 rounded-lg shadow-sm border border-gray-200">
          <button onClick={() => changeDate(-1)} className="p-1 hover:bg-gray-100 rounded-full text-gray-500">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="flex items-center space-x-2 px-2">
            <Calendar className="h-4 w-4 text-blue-600" />
            <span className="font-medium text-gray-900">
              {currentDate.toLocaleDateString(language === 'en' ? 'en-US' : 'zh-CN', {
                weekday: 'short', year: 'numeric', month: 'long', day: 'numeric'
              })}
            </span>
          </div>
          <button onClick={() => changeDate(1)} className="p-1 hover:bg-gray-100 rounded-full text-gray-500">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(stats).map(([key, value]) => {
           const config = statusConfig[key as Status];
           return (
             <div key={key} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center justify-between">
               <div>
                 <p className="text-sm font-medium text-gray-500">{config.label}</p>
                 <p className="text-2xl font-bold text-gray-900">{value}</p>
               </div>
               <div className={`p-2 rounded-full ${config.color.split(' ')[0]}`}>
                 <config.icon className={`h-5 w-5 ${config.color.split(' ')[1]}`} />
               </div>
             </div>
           );
        })}
      </div>

      {/* Student List */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.name}</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">{t.remarks}</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => {
                  const currentStatus = attendance[student.id];
                  return (
                    <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <img className="h-10 w-10 rounded-full" src={student.avatar} alt="" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{student.name}</div>
                            <div className="text-xs text-gray-500">{student.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-wrap gap-2">
                          {(Object.keys(statusConfig) as Status[]).map((status) => {
                            const config = statusConfig[status];
                            const isActive = currentStatus === status;
                            return (
                              <button
                                key={status}
                                onClick={() => handleStatusChange(student.id, status)}
                                className={`
                                  relative inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium border transition-all
                                  ${isActive 
                                    ? `${config.color} border-transparent ring-1 ring-offset-1 ring-gray-300` 
                                    : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
                                  }
                                `}
                                title={config.label}
                              >
                                <span className="flex items-center">
                                  {isActive && <config.icon className="h-3 w-3 mr-1" />}
                                  {config.label}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                        <input 
                          type="text" 
                          placeholder={t.remarks}
                          value={remarks[student.id] || ''}
                          onChange={(e) => handleRemarkChange(student.id, e.target.value)}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2 bg-gray-50"
                        />
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                    <td colSpan={3} className="px-6 py-10 text-center text-gray-500">
                        No students found in this class.
                    </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Footer Actions */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end">
          <button 
            onClick={handleSave}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Save className="h-4 w-4 mr-2" />
            {t.saveAttendance}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Attendance;
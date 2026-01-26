import React, { useState } from 'react';
import { Language } from '../types';
import { UI_LABELS } from '../constants';
import { Clock, MapPin, ChevronDown } from 'lucide-react';

interface TimetableProps {
  language: Language;
}

const SCHEDULE = [
  { time: '08:00 - 09:00', mon: { sub: 'Math', room: '101' }, tue: { sub: 'Physics', room: 'Lab A' }, wed: { sub: 'Math', room: '101' }, thu: { sub: 'English', room: '203' }, fri: { sub: 'History', room: '105' } },
  { time: '09:00 - 10:00', mon: { sub: 'English', room: '203' }, tue: { sub: 'Chem', room: 'Lab B' }, wed: { sub: 'Physics', room: 'Lab A' }, thu: { sub: 'Math', room: '101' }, fri: { sub: 'Geography', room: '104' } },
  { time: '10:00 - 10:30', mon: { sub: 'Break', room: '' }, tue: { sub: 'Break', room: '' }, wed: { sub: 'Break', room: '' }, thu: { sub: 'Break', room: '' }, fri: { sub: 'Break', room: '' } },
  { time: '10:30 - 11:30', mon: { sub: 'Biology', room: 'Lab C' }, tue: { sub: 'Math', room: '101' }, wed: { sub: 'English', room: '203' }, thu: { sub: 'Sports', room: 'Field' }, fri: { sub: 'Art', room: 'Studio' } },
  { time: '11:30 - 12:30', mon: { sub: 'History', room: '105' }, tue: { sub: 'History', room: '105' }, wed: { sub: 'Biology', room: 'Lab C' }, thu: { sub: 'Chem', room: 'Lab B' }, fri: { sub: 'Math', room: '101' } },
];

const CLASSES = [
  'Year 10 - Class A',
  'Year 10 - Class B',
  'Year 11 - Class A',
  'Year 11 - Class B',
  'Year 12 - Class A'
];

const Timetable: React.FC<TimetableProps> = ({ language }) => {
  const t = UI_LABELS[language];
  const [selectedClass, setSelectedClass] = useState(CLASSES[0]);

  const days = language === 'en' 
    ? ['Time', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] 
    : ['时间', '星期一', '星期二', '星期三', '星期四', '星期五'];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-900">{t.timetable}</h2>
        
        <div className="flex items-center space-x-3 bg-white p-1 rounded-lg">
            <span className="text-sm font-medium text-gray-700 hidden sm:inline-block pl-2">
              {t.classSelect}:
            </span>
            <div className="relative">
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="appearance-none block w-full rounded-md border-0 py-2 pl-3 pr-8 text-sm font-semibold text-blue-600 focus:ring-2 focus:ring-blue-600 bg-transparent cursor-pointer hover:bg-gray-50 transition-colors"
              >
                {CLASSES.map((cls) => (
                  <option key={cls} value={cls} className="text-gray-900">{cls}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-blue-600">
                <ChevronDown className="h-4 w-4" />
              </div>
            </div>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Weekly Schedule</h3>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {selectedClass}
            </span>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {days.map((day, idx) => (
                  <th key={idx} scope="col" className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${idx === 0 ? 'sticky left-0 bg-gray-50 z-10' : ''}`}>
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {SCHEDULE.map((slot, idx) => (
                <tr key={idx} className={slot.mon.sub === 'Break' ? 'bg-gray-50' : 'hover:bg-gray-50 transition-colors'}>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 sticky left-0 z-10 flex items-center border-r border-transparent group-hover:border-gray-200 ${slot.mon.sub === 'Break' ? 'bg-gray-50' : 'bg-white'}`}>
                    <Clock className="h-4 w-4 mr-2 text-gray-400" />
                    {slot.time}
                  </td>
                  {['mon', 'tue', 'wed', 'thu', 'fri'].map((dayKey) => {
                    const session = (slot as any)[dayKey];
                    if (session.sub === 'Break') {
                      return (
                        <td key={dayKey} className="px-6 py-4 text-center text-xs text-gray-400 font-medium tracking-widest uppercase bg-gray-50">
                          --- BREAK ---
                        </td>
                      );
                    }
                    return (
                      <td key={dayKey} className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">{session.sub}</div>
                        <div className="text-xs text-gray-500 flex items-center mt-1">
                          <MapPin className="h-3 w-3 mr-1" />
                          {session.room}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Timetable;
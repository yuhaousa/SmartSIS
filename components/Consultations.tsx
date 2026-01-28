import React, { useState } from 'react';
import { Language, Teacher } from '../types';
import { UI_LABELS, MOCK_TEACHERS } from '../constants';
import { Clock, MapPin, ChevronLeft, ChevronRight, Check, Calendar as CalendarIcon, ArrowLeft, Filter } from 'lucide-react';

interface ConsultationsProps {
  language: Language;
}

const COMMON_SUBJECTS = [
  'All',
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'English Literature',
  'History',
  'Geography',
  'Computer Science',
  'Art',
  'Music',
  'Physical Education'
];

const Consultations: React.FC<ConsultationsProps> = ({ language }) => {
  const t = UI_LABELS[language];
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isConfirmed, setIsConfirmed] = useState(false);

  // Mock available slots
  const TIME_SLOTS = [
    '09:00', '09:30', '10:00', '10:30', 
    '11:00', '13:00', '13:30', '14:00', 
    '14:30', '15:00', '15:30'
  ];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    return { daysInMonth, firstDay };
  };

  const changeMonth = (offset: number) => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1);
    setCurrentDate(newDate);
    setSelectedDate(null);
    setSelectedTime(null);
  };

  const handleDateClick = (day: number) => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    // Don't allow selecting past dates or today
    if (newDate <= new Date()) return;
    
    // Check if teacher is available on this day of week
    if (selectedTeacher && !selectedTeacher.availableDays.includes(newDate.getDay())) return;

    setSelectedDate(newDate);
    setSelectedTime(null);
  };

  const handleConfirm = () => {
    setIsConfirmed(true);
  };

  const resetFlow = () => {
    setSelectedTeacher(null);
    setSelectedDate(null);
    setSelectedTime(null);
    setIsConfirmed(false);
  };

  // Filter teachers based on selected subject
  const filteredTeachers = MOCK_TEACHERS.filter(teacher => 
    selectedSubject === 'All' || teacher.subject === selectedSubject
  );

  if (isConfirmed && selectedTeacher && selectedDate && selectedTime) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-10rem)] bg-white rounded-lg shadow p-8 text-center animate-in fade-in duration-500">
        <div className="bg-green-100 p-4 rounded-full mb-6">
           <Check className="h-12 w-12 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{t.bookingConfirmed}</h2>
        <p className="text-gray-500 mb-8">{t.bookingSubtitle}</p>
        
        <div className="bg-gray-50 rounded-lg p-6 max-w-md w-full border border-gray-200 mb-8">
           <div className="flex items-center mb-4 border-b pb-4">
              <img src={selectedTeacher.avatar} alt={selectedTeacher.name} className="h-12 w-12 rounded-full mr-4" />
              <div className="text-left">
                 <h3 className="font-bold text-gray-900">{selectedTeacher.name}</h3>
                 <p className="text-sm text-gray-500">{selectedTeacher.subject}</p>
              </div>
           </div>
           <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                 <span className="text-gray-500 flex items-center"><CalendarIcon className="h-4 w-4 mr-2"/> Date</span>
                 <span className="font-medium">{selectedDate.toLocaleDateString(language === 'en' ? 'en-US' : 'zh-CN', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
              </div>
              <div className="flex items-center justify-between">
                 <span className="text-gray-500 flex items-center"><Clock className="h-4 w-4 mr-2"/> Time</span>
                 <span className="font-medium">{selectedTime} ({t.duration})</span>
              </div>
              <div className="flex items-center justify-between">
                 <span className="text-gray-500 flex items-center"><MapPin className="h-4 w-4 mr-2"/> {t.location}</span>
                 <span className="font-medium">{selectedTeacher.officeLocation}</span>
              </div>
           </div>
        </div>

        <button 
           onClick={resetFlow}
           className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
           {t.backToTeachers}
        </button>
      </div>
    );
  }

  // Teacher Selection View
  if (!selectedTeacher) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
           <div>
              <h2 className="text-2xl font-bold text-gray-900">{t.consultationTitle}</h2>
              <p className="text-gray-500">{t.selectTeacher}</p>
           </div>
        </div>
        
        {/* Subject Filter */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-hide">
           <div className="flex items-center text-gray-500 mr-2">
              <Filter className="h-4 w-4 mr-1" />
              <span className="text-sm font-medium">Filter:</span>
           </div>
           {COMMON_SUBJECTS.map(subject => (
             <button
               key={subject}
               onClick={() => setSelectedSubject(subject)}
               className={`
                 whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-colors
                 ${selectedSubject === subject 
                   ? 'bg-blue-600 text-white shadow-sm' 
                   : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                 }
               `}
             >
               {subject}
             </button>
           ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeachers.length > 0 ? (
            filteredTeachers.map(teacher => (
              <div 
                 key={teacher.id}
                 onClick={() => setSelectedTeacher(teacher)}
                 className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md hover:border-blue-400 transition-all cursor-pointer p-6 flex flex-col items-center text-center group"
              >
                 <img 
                   src={teacher.avatar} 
                   alt={teacher.name} 
                   className="h-24 w-24 rounded-full object-cover border-4 border-gray-100 group-hover:border-blue-100 transition-colors mb-4" 
                 />
                 <h3 className="text-lg font-bold text-gray-900">{teacher.name}</h3>
                 <p className="text-blue-600 font-medium text-sm mb-2">{teacher.subject}</p>
                 <div className="flex items-center text-gray-500 text-xs mt-2 bg-gray-50 px-3 py-1 rounded-full">
                    <MapPin className="h-3 w-3 mr-1" />
                    {teacher.officeLocation}
                 </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-12 text-center text-gray-500 bg-white rounded-lg border border-dashed border-gray-300">
               <p>No teachers found for {selectedSubject}.</p>
               <button 
                 onClick={() => setSelectedSubject('All')}
                 className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
               >
                 Clear filter
               </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Booking Interface (Calendly Style)
  const { daysInMonth, firstDay } = getDaysInMonth(currentDate);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDay }, (_, i) => i);

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden h-[calc(100vh-10rem)] min-h-[600px] flex flex-col md:flex-row">
      {/* Left Panel: Context */}
      <div className="w-full md:w-1/3 bg-gray-50 p-6 md:p-8 border-r border-gray-200 flex flex-col">
         <button 
            onClick={() => setSelectedTeacher(null)}
            className="self-start mb-6 p-2 rounded-full bg-white border border-gray-200 hover:bg-gray-100 text-gray-500"
         >
            <ArrowLeft className="h-5 w-5" />
         </button>
         
         <div className="flex-1">
             <img src={selectedTeacher.avatar} alt={selectedTeacher.name} className="h-16 w-16 rounded-full mb-4" />
             <p className="text-gray-500 font-medium text-sm">{selectedTeacher.name}</p>
             <h2 className="text-2xl font-bold text-gray-900 mb-6">{t.consultationTitle}</h2>
             
             <div className="space-y-4 text-gray-600">
                <div className="flex items-center">
                   <Clock className="h-5 w-5 mr-3 text-gray-400" />
                   <span className="font-medium">{t.duration}</span>
                </div>
                <div className="flex items-center">
                   <MapPin className="h-5 w-5 mr-3 text-gray-400" />
                   <span className="font-medium">{selectedTeacher.officeLocation}</span>
                </div>
                <div className="flex items-start">
                   <CalendarIcon className="h-5 w-5 mr-3 text-gray-400 mt-0.5" />
                   <span className="text-sm">
                      {selectedDate 
                         ? selectedDate.toLocaleDateString(language === 'en' ? 'en-US' : 'zh-CN', { weekday: 'long', month: 'long', day: 'numeric' }) 
                         : t.selectDateTime}
                   </span>
                </div>
             </div>
         </div>
      </div>

      {/* Middle Panel: Calendar */}
      <div className={`w-full md:w-1/2 p-6 md:p-8 transition-all duration-300 ${selectedDate ? 'md:w-1/3 border-r border-gray-200' : 'md:w-2/3'}`}>
         <h3 className="text-lg font-bold text-gray-900 mb-6">{t.selectDateTime}</h3>
         
         <div className="flex items-center justify-between mb-6">
            <button onClick={() => changeMonth(-1)} className="p-1 hover:bg-gray-100 rounded-full"><ChevronLeft className="h-5 w-5 text-blue-600" /></button>
            <span className="font-medium text-gray-900">
               {currentDate.toLocaleDateString(language === 'en' ? 'en-US' : 'zh-CN', { month: 'long', year: 'numeric' })}
            </span>
            <button onClick={() => changeMonth(1)} className="p-1 hover:bg-gray-100 rounded-full"><ChevronRight className="h-5 w-5 text-blue-600" /></button>
         </div>

         <div className="grid grid-cols-7 gap-2 text-center text-sm mb-2">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => <div key={d} className="text-gray-400 text-xs font-medium">{d}</div>)}
         </div>

         <div className="grid grid-cols-7 gap-2">
            {blanks.map(i => <div key={`blank-${i}`} />)}
            {days.map(day => {
               const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
               const isToday = new Date().toDateString() === date.toDateString();
               const isPast = date < new Date() && !isToday;
               const dayOfWeek = date.getDay();
               const isAvailable = selectedTeacher.availableDays.includes(dayOfWeek) && !isPast;
               const isSelected = selectedDate?.toDateString() === date.toDateString();

               return (
                  <button
                     key={day}
                     disabled={!isAvailable}
                     onClick={() => handleDateClick(day)}
                     className={`
                        h-10 w-10 rounded-full flex items-center justify-center text-sm font-medium transition-all
                        ${isSelected ? 'bg-blue-600 text-white shadow-md scale-105' : ''}
                        ${!isSelected && isAvailable ? 'text-blue-600 bg-blue-50 hover:bg-blue-100 hover:scale-110 cursor-pointer font-bold' : ''}
                        ${!isSelected && !isAvailable ? 'text-gray-300 cursor-not-allowed' : ''}
                        ${isToday && !isSelected ? 'ring-1 ring-blue-600' : ''}
                     `}
                  >
                     {day}
                  </button>
               );
            })}
         </div>
      </div>

      {/* Right Panel: Time Slots (Conditional) */}
      {selectedDate && (
         <div className="w-full md:w-1/3 p-6 md:p-8 animate-in slide-in-from-right duration-300 overflow-y-auto">
            <h3 className="text-lg font-medium text-gray-900 mb-6 flex justify-between items-center">
               {selectedDate.toLocaleDateString(language === 'en' ? 'en-US' : 'zh-CN', { weekday: 'long', month: 'short', day: 'numeric' })}
            </h3>
            
            <div className="space-y-3">
               {TIME_SLOTS.map(time => {
                  const isSelected = selectedTime === time;
                  
                  return (
                     <div key={time} className="flex gap-2 transition-all">
                        <button
                           onClick={() => setSelectedTime(time)}
                           className={`
                              flex-1 py-3 border rounded-md font-bold text-sm transition-all duration-200
                              ${isSelected 
                                 ? 'w-1/2 border-gray-600 bg-gray-600 text-white cursor-default' 
                                 : 'w-full border-blue-200 text-blue-600 hover:border-blue-600 hover:border-2'
                              }
                           `}
                        >
                           {time}
                        </button>
                        {isSelected && (
                           <button 
                              onClick={handleConfirm}
                              className="w-1/2 py-3 bg-blue-600 text-white font-bold text-sm rounded-md hover:bg-blue-700 animate-in fade-in zoom-in duration-200"
                           >
                              {t.confirmBooking}
                           </button>
                        )}
                     </div>
                  );
               })}
            </div>
         </div>
      )}
    </div>
  );
};

export default Consultations;
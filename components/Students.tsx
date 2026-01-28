import React, { useState, useMemo } from 'react';
import { MOCK_STUDENTS, UI_LABELS } from '../constants';
import { Language, StudentRecord } from '../types';
import { translateText } from '../services/geminiService';
import { Search, MapPin, Mail, Phone, Languages, Users, ChevronRight, ArrowLeft, Filter, Download } from 'lucide-react';

interface StudentsProps {
  language: Language;
}

const Students: React.FC<StudentsProps> = ({ language }) => {
  const t = UI_LABELS[language];
  const [selectedStudent, setSelectedStudent] = useState<StudentRecord | null>(null);
  const [translatedComments, setTranslatedComments] = useState<{[key: string]: string}>({});
  const [loadingTranslation, setLoadingTranslation] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter states
  const [selectedClass, setSelectedClass] = useState('All');
  const [selectedGrade, setSelectedGrade] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  const handleTranslate = async (studentId: string, subjectIndex: number, text: string) => {
    const key = `${studentId}-${subjectIndex}`;
    setLoadingTranslation(key);
    const result = await translateText(text, language === 'en' ? 'zh' : 'en');
    setTranslatedComments(prev => ({
      ...prev,
      [key]: result
    }));
    setLoadingTranslation(null);
  };

  const getDisplayedComment = (studentId: string, subjectIndex: number, original: string) => {
    const key = `${studentId}-${subjectIndex}`;
    return translatedComments[key] || original;
  };

  // Extract unique values for filters
  const uniqueClasses = useMemo(() => ['All', ...Array.from(new Set(MOCK_STUDENTS.map(s => s.className))).sort()], []);
  const uniqueGrades = useMemo(() => ['All', ...Array.from(new Set(MOCK_STUDENTS.map(s => s.grade))).sort()], []);
  const uniqueStatuses = useMemo(() => ['All', ...Array.from(new Set(MOCK_STUDENTS.map(s => s.status))).sort()], []);

  const filteredStudents = MOCK_STUDENTS.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          student.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = selectedClass === 'All' || student.className === selectedClass;
    const matchesGrade = selectedGrade === 'All' || student.grade === selectedGrade;
    const matchesStatus = selectedStatus === 'All' || student.status === selectedStatus;
    
    return matchesSearch && matchesClass && matchesGrade && matchesStatus;
  });

  const handleExportCSV = () => {
    const headers = [t.name, t.studentId, t.email, t.className, t.enrollmentDate, t.expectedGraduationDate, t.status];
    const csvContent = [
      headers.join(','),
      ...filteredStudents.map(student => [
        `"${student.name}"`,
        `"${student.id}"`,
        `"${student.email}"`,
        `"${student.className}"`,
        `"${student.enrollmentDate}"`,
        `"${student.expectedGraduationDate}"`,
        `"${student.status}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `students_export_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (selectedStudent) {
    return (
      <div className="bg-white rounded-lg shadow overflow-hidden h-full flex flex-col">
         {/* Profile Header with Back Button */}
         <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200 flex justify-between items-center sticky top-0 z-10">
            <div className="flex items-center">
               <button 
                 onClick={() => setSelectedStudent(null)}
                 className="mr-4 p-2 rounded-full hover:bg-white text-gray-500 hover:text-gray-900 transition-colors"
                 title="Back to List"
               >
                 <ArrowLeft className="h-5 w-5" />
               </button>
               <div className="flex items-center">
                   <img className="h-12 w-12 rounded-full object-cover border-2 border-white shadow-sm" src={selectedStudent.avatar} alt="" />
                   <div className="ml-4">
                     <h3 className="text-xl font-bold text-gray-900">{selectedStudent.name}</h3>
                     <p className="text-sm text-gray-500">{selectedStudent.id} • {selectedStudent.className}</p>
                   </div>
               </div>
            </div>
            <button className="hidden sm:inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500">
              Edit Profile
            </button>
         </div>

         {/* Detailed Content */}
         <div className="flex-1 overflow-y-auto p-6 space-y-8">
            {/* Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center text-sm uppercase tracking-wide">
                   <Mail className="h-4 w-4 mr-2 text-gray-400"/> Contact Info
                </h4>
                <div className="space-y-1">
                  <p className="text-sm text-gray-600"><span className="font-medium">Email:</span> {selectedStudent.email}</p>
                  <p className="text-sm text-gray-600"><span className="font-medium">Phone:</span> +1 234 567 890</p>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center text-sm uppercase tracking-wide">
                  <MapPin className="h-4 w-4 mr-2 text-gray-400"/> Hostel & Location
                </h4>
                <div className="space-y-1">
                  <p className="text-sm text-gray-600"><span className="font-medium">Hostel:</span> Block A</p>
                  <p className="text-sm text-gray-600"><span className="font-medium">Room:</span> 302</p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center text-sm uppercase tracking-wide">
                  <Users className="h-4 w-4 mr-2 text-gray-400"/> Academic Info
                </h4>
                <div className="space-y-1">
                  <p className="text-sm text-gray-600"><span className="font-medium">Grade:</span> {selectedStudent.grade}</p>
                  <p className="text-sm text-gray-600"><span className="font-medium">Enrolled:</span> {selectedStudent.enrollmentDate}</p>
                  <p className="text-sm text-gray-600"><span className="font-medium">Graduation:</span> {selectedStudent.expectedGraduationDate}</p>
                </div>
              </div>
            </div>

            {/* Academic Records */}
            <div>
               <h4 className="text-lg font-bold text-gray-900 mb-4">{t.academicRecords}</h4>
               <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
                 <table className="min-w-full divide-y divide-gray-300">
                   <thead className="bg-gray-50">
                     <tr>
                       <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Subject</th>
                       <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">{t.score}</th>
                       <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">{t.teacherComment}</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-gray-200 bg-white">
                     {selectedStudent.results.map((result, idx) => (
                       <tr key={idx}>
                         <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                           {result.subject}
                         </td>
                         <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                           <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${result.score >= 90 ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                             {result.score}
                           </span>
                         </td>
                         <td className="px-3 py-4 text-sm text-gray-500 relative group">
                            <p className="pr-8 italic">
                              "{getDisplayedComment(selectedStudent.id, idx, result.teacherComment)}"
                            </p>
                            <div className="mt-2">
                              <button 
                                onClick={() => handleTranslate(selectedStudent.id, idx, result.teacherComment)}
                                disabled={loadingTranslation === `${selectedStudent.id}-${idx}`}
                                className="inline-flex items-center text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors"
                              >
                                <Languages className="h-3 w-3 mr-1" />
                                {loadingTranslation === `${selectedStudent.id}-${idx}` 
                                  ? 'Translating...' 
                                  : (translatedComments[`${selectedStudent.id}-${idx}`] ? t.original : t.translate)
                                }
                              </button>
                            </div>
                         </td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
            </div>
         </div>
      </div>
    );
  }

  // Default List View
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-2xl font-bold text-gray-900">{t.studentList}</h2>
        </div>
        
        {/* Search and Filters Bar */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col lg:flex-row gap-4">
          <div className="relative rounded-md shadow-sm flex-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full rounded-md border-0 py-2 pl-10 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
              placeholder={t.search}
            />
          </div>
          
          <div className="flex flex-wrap gap-4 items-center">
             {/* Class Filter */}
             <div className="flex items-center space-x-2">
               <span className="text-sm text-gray-500 flex items-center"><Filter className="h-3 w-3 mr-1"/> Class:</span>
               <select 
                 value={selectedClass} 
                 onChange={(e) => setSelectedClass(e.target.value)}
                 className="block w-full rounded-md border-0 py-1.5 pl-3 pr-8 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-600 sm:text-sm sm:leading-6"
               >
                 {uniqueClasses.map(c => <option key={c} value={c}>{c === 'All' ? 'All Classes' : c}</option>)}
               </select>
             </div>

             {/* Grade Filter */}
             <div className="flex items-center space-x-2">
               <span className="text-sm text-gray-500 flex items-center"><Filter className="h-3 w-3 mr-1"/> Grade:</span>
               <select 
                 value={selectedGrade} 
                 onChange={(e) => setSelectedGrade(e.target.value)}
                 className="block w-full rounded-md border-0 py-1.5 pl-3 pr-8 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-600 sm:text-sm sm:leading-6"
               >
                 {uniqueGrades.map(g => <option key={g} value={g}>{g === 'All' ? 'All Grades' : g}</option>)}
               </select>
             </div>

             {/* Status Filter */}
             <div className="flex items-center space-x-2">
               <span className="text-sm text-gray-500 flex items-center"><Filter className="h-3 w-3 mr-1"/> Status:</span>
               <select 
                 value={selectedStatus} 
                 onChange={(e) => setSelectedStatus(e.target.value)}
                 className="block w-full rounded-md border-0 py-1.5 pl-3 pr-8 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-600 sm:text-sm sm:leading-6"
               >
                 {uniqueStatuses.map(s => <option key={s} value={s}>{s === 'All' ? 'All Status' : s}</option>)}
               </select>
             </div>

             {/* Export Button */}
             <button
                onClick={handleExportCSV}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
             >
                <Download className="-ml-1 mr-2 h-4 w-4 text-gray-500" />
                {t.exportCSV}
             </button>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.name}</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.studentId}</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">{t.email}</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.className}</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">{t.enrollmentDate}</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden xl:table-cell">{t.expectedGraduationDate}</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">{t.status}</th>
                <th scope="col" className="relative px-6 py-3"><span className="sr-only">{t.actions}</span></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStudents.map((student) => (
                <tr 
                  key={student.id} 
                  className="hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => setSelectedStudent(student)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img className="h-10 w-10 rounded-full" src={student.avatar} alt="" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{student.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {student.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">
                    {student.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {student.className}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden lg:table-cell">
                    {student.enrollmentDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden xl:table-cell">
                    {student.expectedGraduationDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                    <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                      student.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {student.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900">
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredStudents.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            No students found matching your search.
          </div>
        )}
      </div>
    </div>
  );
};

export default Students;
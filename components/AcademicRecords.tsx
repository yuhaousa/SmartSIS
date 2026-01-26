import React, { useMemo, useState } from 'react';
import { UI_LABELS, MOCK_STUDENTS } from '../constants';
import { Language } from '../types';
import { TrendingUp, Award, AlertTriangle, BookOpen, Calculator, Search, Filter } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface AcademicRecordsProps {
  language: Language;
}

const AcademicRecords: React.FC<AcademicRecordsProps> = ({ language }) => {
  const t = UI_LABELS[language];
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('All');

  // Process data for charts and table
  const { allSubjects, studentPerformance, subjectStats, overallStats, uniqueClasses } = useMemo(() => {
    // Get unique classes for dropdown
    const classes = Array.from(new Set(MOCK_STUDENTS.map(s => s.className))).sort();

    // 1. Filter students first
    const filteredStudents = MOCK_STUDENTS.filter(student => {
      const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            student.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesClass = selectedClass === 'All' || student.className === selectedClass;
      return matchesSearch && matchesClass;
    });

    const subjects = new Set<string>();
    
    // 2. Calculate performance based on filtered list
    const performance = filteredStudents.map(student => {
      let totalScore = 0;
      let count = 0;
      const scores: Record<string, number> = {};

      student.results.forEach(r => {
        subjects.add(r.subject);
        scores[r.subject] = r.score;
        totalScore += r.score;
        count++;
      });

      const average = count > 0 ? Math.round(totalScore / count) : 0;
      let grade = 'F';
      if (average >= 90) grade = 'A';
      else if (average >= 80) grade = 'B';
      else if (average >= 70) grade = 'C';
      else if (average >= 60) grade = 'D';

      return {
        ...student,
        scores,
        average,
        grade
      };
    });

    const subStats: any[] = [];
    Array.from(subjects).forEach(sub => {
      const scores = performance.map(p => p.scores[sub]).filter(s => s !== undefined);
      const avg = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
      subStats.push({ subject: sub, average: avg });
    });

    const classAvg = performance.length > 0 
      ? Math.round(performance.reduce((acc, curr) => acc + curr.average, 0) / performance.length) 
      : 0;
      
    const topStudent = performance.length > 0
      ? performance.reduce((prev, current) => (prev.average > current.average) ? prev : current)
      : { name: '-' };

    return {
      allSubjects: Array.from(subjects),
      studentPerformance: performance,
      subjectStats: subStats,
      overallStats: {
        classAverage: classAvg,
        topPerformer: topStudent.name,
        totalSubjects: subjects.size
      },
      uniqueClasses: ['All', ...classes]
    };
  }, [searchTerm, selectedClass]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-900">{t.academicRecords}</h2>
        
        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder={t.search}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 pl-10 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                />
            </div>

            <div className="flex items-center space-x-2 bg-white rounded-md border border-gray-300 px-3 py-1.5 shadow-sm">
               <Filter className="h-4 w-4 text-gray-500" />
               <select 
                 value={selectedClass} 
                 onChange={(e) => setSelectedClass(e.target.value)}
                 className="block w-full border-none p-0 text-gray-900 focus:ring-0 sm:text-sm sm:leading-6 bg-transparent outline-none cursor-pointer"
               >
                 {uniqueClasses.map(c => <option key={c} value={c}>{c === 'All' ? 'All Classes' : c}</option>)}
               </select>
            </div>

            <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors whitespace-nowrap">
                {t.exportGrades}
            </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg p-5 flex items-center">
           <div className="bg-blue-100 p-3 rounded-md">
             <Calculator className="h-6 w-6 text-blue-600" />
           </div>
           <div className="ml-5">
             <dt className="text-sm font-medium text-gray-500">{t.classAverage}</dt>
             <dd className="text-2xl font-semibold text-gray-900">{overallStats.classAverage}%</dd>
           </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg p-5 flex items-center">
           <div className="bg-purple-100 p-3 rounded-md">
             <Award className="h-6 w-6 text-purple-600" />
           </div>
           <div className="ml-5">
             <dt className="text-sm font-medium text-gray-500">{t.topPerformer}</dt>
             <dd className="text-lg font-semibold text-gray-900 truncate max-w-[150px]" title={overallStats.topPerformer}>{overallStats.topPerformer}</dd>
           </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg p-5 flex items-center">
           <div className="bg-green-100 p-3 rounded-md">
             <BookOpen className="h-6 w-6 text-green-600" />
           </div>
           <div className="ml-5">
             <dt className="text-sm font-medium text-gray-500">{t.activeSubjects}</dt>
             <dd className="text-2xl font-semibold text-gray-900">{overallStats.totalSubjects}</dd>
           </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg p-5 flex items-center">
           <div className="bg-amber-100 p-3 rounded-md">
             <AlertTriangle className="h-6 w-6 text-amber-600" />
           </div>
           <div className="ml-5">
             <dt className="text-sm font-medium text-gray-500">{t.needsAttention}</dt>
             <dd className="text-2xl font-semibold text-gray-900">
               {studentPerformance.filter(s => s.average < 70).length}
             </dd>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance Table */}
        <div className="lg:col-span-2 bg-white shadow rounded-lg overflow-hidden border border-gray-200">
           <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
             <h3 className="text-lg font-medium text-gray-900">{t.studentList} & {t.score}</h3>
             <span className="text-xs text-gray-500">
                {t.showing} {studentPerformance.length} {t.studentsSuffix}
             </span>
           </div>
           <div className="overflow-x-auto">
             <table className="min-w-full divide-y divide-gray-200">
               <thead className="bg-gray-50">
                 <tr>
                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-50">{t.name}</th>
                   {allSubjects.map(sub => (
                     <th key={sub} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{sub}</th>
                   ))}
                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.averageScore}</th>
                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.overallGrade}</th>
                 </tr>
               </thead>
               <tbody className="bg-white divide-y divide-gray-200">
                 {studentPerformance.length > 0 ? (
                   studentPerformance.map((student) => (
                     <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                       <td className="px-6 py-4 whitespace-nowrap sticky left-0 bg-white group-hover:bg-gray-50">
                         <div className="flex items-center">
                           <div className="flex-shrink-0 h-8 w-8">
                             <img className="h-8 w-8 rounded-full" src={student.avatar} alt="" />
                           </div>
                           <div className="ml-3">
                             <div className="text-sm font-medium text-gray-900">{student.name}</div>
                             <div className="text-xs text-gray-500">{student.className}</div>
                           </div>
                         </div>
                       </td>
                       {allSubjects.map(sub => (
                         <td key={sub} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                           {student.scores[sub] !== undefined ? (
                             <span className={`font-medium ${student.scores[sub] >= 90 ? 'text-green-600' : student.scores[sub] < 70 ? 'text-red-600' : 'text-gray-900'}`}>
                               {student.scores[sub]}
                             </span>
                           ) : (
                             <span className="text-gray-300">-</span>
                           )}
                         </td>
                       ))}
                       <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                         {student.average}%
                       </td>
                       <td className="px-6 py-4 whitespace-nowrap">
                         <span className={`inline-flex items-center justify-center h-8 w-8 rounded-full text-sm font-bold ${
                           student.grade === 'A' ? 'bg-green-100 text-green-800' :
                           student.grade === 'B' ? 'bg-blue-100 text-blue-800' :
                           student.grade === 'C' ? 'bg-yellow-100 text-yellow-800' :
                           'bg-red-100 text-red-800'
                         }`}>
                           {student.grade}
                         </span>
                       </td>
                     </tr>
                   ))
                 ) : (
                   <tr>
                     <td colSpan={allSubjects.length + 3} className="px-6 py-10 text-center text-gray-500">
                        {t.noRecordsFound}
                     </td>
                   </tr>
                 )}
               </tbody>
             </table>
           </div>
        </div>

        {/* Chart Side */}
        <div className="lg:col-span-1 bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-6">{t.subjectPerformance}</h3>
            <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={subjectStats} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                        <XAxis type="number" domain={[0, 100]} hide />
                        <YAxis dataKey="subject" type="category" width={80} tick={{fontSize: 12}} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                          cursor={{fill: '#f3f4f6'}}
                        />
                        <Bar dataKey="average" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} name={t.avgScoreChart}>
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
            
            <div className="mt-6 border-t border-gray-100 pt-4">
               <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                  <TrendingUp className="h-4 w-4 mr-2 text-blue-500" />
                  {t.performanceInsights}
               </h4>
               <ul className="space-y-3 text-sm text-gray-600">
                  <li className="flex items-start">
                     <span className="h-2 w-2 mt-1.5 rounded-full bg-green-500 mr-2 flex-shrink-0"></span>
                     {t.insightMath} ({
                       subjectStats.length > 0 
                       ? Math.max(...subjectStats.map(s => s.average))
                       : 0
                     }%) {t.semesterSuffix}.
                  </li>
                  <li className="flex items-start">
                     <span className="h-2 w-2 mt-1.5 rounded-full bg-amber-500 mr-2 flex-shrink-0"></span>
                     {t.insightHistory}
                  </li>
                  <li className="flex items-start">
                     <span className="h-2 w-2 mt-1.5 rounded-full bg-blue-500 mr-2 flex-shrink-0"></span>
                     {t.insightScience}
                  </li>
               </ul>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AcademicRecords;
import React, { useMemo, useState } from 'react';
import { UI_LABELS, MOCK_STUDENTS } from '../constants';
import { Language, StudentRecord, ExamResult } from '../types';
import { TrendingUp, Award, AlertTriangle, BookOpen, Calculator, Search, Filter, Calendar, ChevronLeft, ChevronRight, GraduationCap, ChevronDown, ChevronUp, PlusCircle, Edit2, MessageSquare, FileText, X, Printer, Check } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface AcademicRecordsProps {
  language: Language;
}

const CALENDAR_MONTHS = [
  { key: 'Jan', full: 'January', labelZh: '1月' },
  { key: 'Feb', full: 'February', labelZh: '2月' },
  { key: 'Mar', full: 'March', labelZh: '3月' },
  { key: 'Apr', full: 'April', labelZh: '4月' },
  { key: 'May', full: 'May', labelZh: '5月' },
  { key: 'Jun', full: 'June', labelZh: '6月' },
  { key: 'Jul', full: 'July', labelZh: '7月' },
  { key: 'Aug', full: 'August', labelZh: '8月' },
  { key: 'Sep', full: 'September', labelZh: '9月' },
  { key: 'Oct', full: 'October', labelZh: '10月' },
  { key: 'Nov', full: 'November', labelZh: '11月' },
  { key: 'Dec', full: 'December', labelZh: '12月' },
];

const AcademicRecords: React.FC<AcademicRecordsProps> = ({ language }) => {
  const t = UI_LABELS[language];
  const [students, setStudents] = useState<StudentRecord[]>(MOCK_STUDENTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('All');
  const [selectedSemester, setSelectedSemester] = useState('All');
  const [selectedStudent, setSelectedStudent] = useState<StudentRecord | null>(null);
  
  // State for expanded subject in detailed view to show monthly scores
  const [expandedSubjectKey, setExpandedSubjectKey] = useState<string | null>(null);

  // State for Report Modal
  const [reportSemester, setReportSemester] = useState<string | null>(null);

  // State for Editing Monthly Scores
  const [editingCell, setEditingCell] = useState<{
    studentId: string;
    semester: string;
    subject: string;
    monthKey: string;
  } | null>(null);
  const [editScore, setEditScore] = useState<string>('');
  const [editComment, setEditComment] = useState<string>('');

  // State for Editing Semester Comment
  const [editingComment, setEditingComment] = useState<{
    studentId: string;
    semester: string;
    subject: string;
  } | null>(null);
  const [commentText, setCommentText] = useState('');

  // Helper to filter months based on semester context
  const getRelevantMonths = (semester: string) => {
    const s = semester.toLowerCase();
    if (s.includes('fall') || s.includes('autumn')) {
      // Display Aug through Jan for Fall semester
      return CALENDAR_MONTHS.filter(m => ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'].includes(m.key));
    }
    if (s.includes('spring')) {
      // Display Feb through Jul for Spring semester
      return CALENDAR_MONTHS.filter(m => ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'].includes(m.key));
    }
    // Default to all months if semester is generic or unknown
    return CALENDAR_MONTHS;
  };

  // Process data for charts and table
  const { allSubjects, studentPerformance, subjectStats, overallStats, uniqueClasses, uniqueSemesters } = useMemo(() => {
    // Get unique classes for dropdown
    const classes = Array.from(new Set(students.map(s => s.className))).sort();

    // Get unique semesters
    const allSemesters = new Set<string>();
    students.forEach(s => s.results.forEach(r => allSemesters.add(r.semester)));
    const semesters = Array.from(allSemesters).sort();

    // 1. Filter students by Class and Search Term first
    const filteredStudents = students.filter(student => {
      const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            student.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesClass = selectedClass === 'All' || student.className === selectedClass;
      return matchesSearch && matchesClass;
    });

    const activeSubjects = new Set<string>();
    
    // 2. Calculate performance based on filtered list AND selected semester
    const performance = filteredStudents.map(student => {
      let totalScore = 0;
      let count = 0;
      const scores: Record<string, number> = {};

      // Filter results by selected semester
      const filteredResults = student.results.filter(r => 
        selectedSemester === 'All' || r.semester === selectedSemester
      );

      filteredResults.forEach(r => {
        activeSubjects.add(r.subject);
        
        // Ensure score is consistent with monthly average if monthly scores exist
        let subjectScore = r.score;
        if (r.monthlyScores && r.monthlyScores.length > 0) {
           const monthlyTotal = r.monthlyScores.reduce((sum, m) => sum + m.score, 0);
           subjectScore = Math.round(monthlyTotal / r.monthlyScores.length);
        }

        scores[r.subject] = subjectScore;
        totalScore += subjectScore;
        count++;
      });

      const average = count > 0 ? Math.round(totalScore / count) : 0;
      let grade = 'F';
      if (count === 0 && selectedSemester !== 'All') {
          grade = '-'; // No data for this semester
      } else {
        if (average >= 90) grade = 'A';
        else if (average >= 80) grade = 'B';
        else if (average >= 70) grade = 'C';
        else if (average >= 60) grade = 'D';
      }

      return {
        ...student,
        scores,
        average,
        grade,
        hasData: count > 0
      };
    });

    const subStats: any[] = [];
    Array.from(activeSubjects).forEach(sub => {
      const scores = performance.map(p => p.scores[sub]).filter(s => s !== undefined);
      const avg = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
      subStats.push({ subject: sub, average: avg });
    });

    // Calculate class average only from students who have data
    const studentsWithData = performance.filter(p => p.hasData);
    const classAvg = studentsWithData.length > 0 
      ? Math.round(studentsWithData.reduce((acc, curr) => acc + curr.average, 0) / studentsWithData.length) 
      : 0;
      
    const topStudent = studentsWithData.length > 0
      ? studentsWithData.reduce((prev, current) => (prev.average > current.average) ? prev : current)
      : { name: '-' };

    return {
      allSubjects: Array.from(activeSubjects).sort(),
      studentPerformance: performance,
      subjectStats: subStats,
      overallStats: {
        classAverage: classAvg,
        topPerformer: topStudent.name,
        totalSubjects: activeSubjects.size
      },
      uniqueClasses: ['All', ...classes],
      uniqueSemesters: ['All', ...semesters]
    };
  }, [searchTerm, selectedClass, selectedSemester, students]);

  // Helper to determine letter grade for an individual score
  const getGrade = (score: number) => {
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
  };

  const getGradeColor = (score: number) => {
    if (score >= 90) return 'bg-green-100 text-green-800';
    if (score >= 80) return 'bg-blue-100 text-blue-800';
    if (score >= 70) return 'bg-yellow-100 text-yellow-800';
    if (score >= 60) return 'bg-orange-100 text-orange-800';
    return 'bg-red-100 text-red-800';
  };

  const toggleMonthlyView = (semester: string, subject: string) => {
     const key = `${semester}-${subject}`;
     setExpandedSubjectKey(expandedSubjectKey === key ? null : key);
  };

  const startEditing = (studentId: string, semester: string, subject: string, monthKey: string, currentScore?: number, currentComment?: string) => {
    setEditingCell({ studentId, semester, subject, monthKey });
    setEditScore(currentScore !== undefined ? currentScore.toString() : '');
    setEditComment(currentComment || '');
  };

  const handleSaveScore = () => {
    if (!editingCell) return;

    setStudents(prevStudents => {
      return prevStudents.map(student => {
        if (student.id !== editingCell.studentId) return student;

        const newResults = student.results.map(result => {
          if (result.semester !== editingCell.semester || result.subject !== editingCell.subject) return result;

          let newMonthlyScores = [...(result.monthlyScores || [])];
          const monthConfig = CALENDAR_MONTHS.find(m => m.key === editingCell.monthKey);
          const monthFullName = monthConfig ? monthConfig.full : editingCell.monthKey;
          
          // Find existing score index
          const existingIndex = newMonthlyScores.findIndex(ms => 
            ms.month === monthFullName || 
            ms.month.startsWith(editingCell.monthKey) || 
            ms.month === monthConfig?.labelZh
          );

          if (editScore === '') {
             // If score is cleared, remove the entry
             if (existingIndex !== -1) {
               newMonthlyScores.splice(existingIndex, 1);
             }
          } else {
             const newScoreVal = parseInt(editScore, 10);
             const newEntry = {
               month: monthFullName,
               score: Math.min(100, Math.max(0, newScoreVal)), // Clamp between 0-100
               comment: editComment
             };

             if (existingIndex !== -1) {
               newMonthlyScores[existingIndex] = newEntry;
             } else {
               newMonthlyScores.push(newEntry);
             }
          }

          // Recalculate Semester Average
          let newAverage = result.score;
          if (newMonthlyScores.length > 0) {
            const total = newMonthlyScores.reduce((acc, curr) => acc + curr.score, 0);
            newAverage = Math.round(total / newMonthlyScores.length);
          }

          return {
            ...result,
            monthlyScores: newMonthlyScores,
            score: newAverage
          };
        });

        // Update selectedStudent view if currently selected
        if (selectedStudent && selectedStudent.id === student.id) {
           setSelectedStudent({ ...student, results: newResults });
        }

        return { ...student, results: newResults };
      });
    });

    setEditingCell(null);
    setEditScore('');
    setEditComment('');
  };

  const startEditingComment = (studentId: string, semester: string, subject: string, currentComment: string) => {
    setEditingComment({ studentId, semester, subject });
    setCommentText(currentComment);
  };

  const handleSaveComment = () => {
    if (!editingComment) return;

    setStudents(prevStudents => {
      return prevStudents.map(student => {
        if (student.id !== editingComment.studentId) return student;

        const newResults = student.results.map(result => {
          if (result.semester !== editingComment.semester || result.subject !== editingComment.subject) return result;
          return { ...result, teacherComment: commentText };
        });

        if (selectedStudent && selectedStudent.id === student.id) {
             setSelectedStudent({ ...student, results: newResults });
        }
        return { ...student, results: newResults };
      });
    });
    setEditingComment(null);
    setCommentText('');
  };

  // Detailed Student View
  if (selectedStudent) {
    // Group results by semester
    const resultsBySemester: Record<string, ExamResult[]> = {};
    selectedStudent.results.forEach(result => {
      if (!resultsBySemester[result.semester]) {
        resultsBySemester[result.semester] = [];
      }
      resultsBySemester[result.semester].push(result);
    });

    const sortedSemesters = Object.keys(resultsBySemester).sort();

    return (
      <div className="space-y-6">
        {/* Modal for Report Preview */}
        {reportSemester && (
           <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
               <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                  <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setReportSemester(null)}></div>
                  <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                  
                  <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
                     <div className="absolute top-0 right-0 pt-4 pr-4">
                        <button onClick={() => setReportSemester(null)} className="text-gray-400 hover:text-gray-500">
                           <X className="h-6 w-6" />
                        </button>
                     </div>
                     
                     <div className="bg-white px-8 py-10" id="report-content">
                        {/* Report Header */}
                        <div className="text-center border-b-2 border-gray-800 pb-6 mb-8">
                           <div className="flex justify-center mb-4">
                              <div className="h-16 w-16 bg-blue-900 rounded-full flex items-center justify-center text-white">
                                 <GraduationCap className="h-10 w-10" />
                              </div>
                           </div>
                           <h2 className="text-3xl font-bold text-gray-900 uppercase tracking-widest">{t.schoolHeader}</h2>
                           <h3 className="text-xl text-gray-600 mt-2 font-serif italic">{t.semesterReport}</h3>
                        </div>

                        {/* Student Details */}
                        <div className="grid grid-cols-2 gap-x-8 gap-y-4 mb-8 text-sm">
                           <div><span className="font-bold text-gray-500 uppercase tracking-wider block text-xs">{t.name}</span> <span className="text-lg font-medium">{selectedStudent.name}</span></div>
                           <div><span className="font-bold text-gray-500 uppercase tracking-wider block text-xs">{t.studentId}</span> <span className="text-lg font-medium">{selectedStudent.id}</span></div>
                           <div><span className="font-bold text-gray-500 uppercase tracking-wider block text-xs">{t.className}</span> <span className="text-lg font-medium">{selectedStudent.className}</span></div>
                           <div><span className="font-bold text-gray-500 uppercase tracking-wider block text-xs">{t.semester}</span> <span className="text-lg font-medium">{reportSemester}</span></div>
                        </div>

                        {/* Grades Table */}
                        <table className="min-w-full border-collapse mb-8">
                           <thead>
                              <tr className="bg-gray-100 border-b-2 border-gray-300">
                                 <th className="py-3 px-4 text-left font-bold text-gray-700 uppercase text-xs">{t.subject}</th>
                                 <th className="py-3 px-4 text-center font-bold text-gray-700 uppercase text-xs">{t.totalCalculated}</th>
                                 <th className="py-3 px-4 text-center font-bold text-gray-700 uppercase text-xs">{t.grade}</th>
                              </tr>
                           </thead>
                           <tbody>
                              {resultsBySemester[reportSemester].map((res, idx) => {
                                 const calculatedScore = (res.monthlyScores && res.monthlyScores.length > 0)
                                    ? Math.round(res.monthlyScores.reduce((s, m) => s + m.score, 0) / res.monthlyScores.length)
                                    : res.score;
                                 return (
                                    <tr key={idx} className="border-b border-gray-200">
                                       <td className="py-3 px-4 text-sm font-medium text-gray-900">{res.subject}</td>
                                       <td className="py-3 px-4 text-center text-sm text-gray-900">{calculatedScore}</td>
                                       <td className="py-3 px-4 text-center text-sm font-bold text-gray-900">{getGrade(calculatedScore)}</td>
                                    </tr>
                                 );
                              })}
                           </tbody>
                        </table>

                        {/* Teacher Comments Section */}
                        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-8">
                           <h4 className="font-bold text-gray-900 mb-4 uppercase text-xs tracking-wider flex items-center">
                              <MessageSquare className="h-4 w-4 mr-2" />
                              {t.commentsSection}
                           </h4>
                           <div className="space-y-4">
                              {resultsBySemester[reportSemester].map((res, idx) => (
                                 <div key={idx}>
                                    <p className="text-sm">
                                       <span className="font-semibold text-gray-800 mr-2">{res.subject}:</span>
                                       <span className="text-gray-600 italic">"{res.teacherComment}"</span>
                                    </p>
                                 </div>
                              ))}
                           </div>
                        </div>

                        {/* Signatures */}
                        <div className="grid grid-cols-2 gap-16 mt-16">
                           <div className="border-t border-gray-400 pt-2 text-center">
                              <p className="text-sm font-medium text-gray-500">{t.classTeacherSignature}</p>
                           </div>
                           <div className="border-t border-gray-400 pt-2 text-center">
                              <p className="text-sm font-medium text-gray-500">{t.principalSignature}</p>
                           </div>
                        </div>
                        
                        <div className="mt-8 text-center text-xs text-gray-400">
                           {t.generatedOn}: {new Date().toLocaleDateString()}
                        </div>
                     </div>

                     {/* Footer Actions */}
                     <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                        <button
                           type="button"
                           onClick={() => window.print()}
                           className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm items-center"
                        >
                           <Printer className="h-4 w-4 mr-2" />
                           {t.print}
                        </button>
                        <button
                           type="button"
                           onClick={() => setReportSemester(null)}
                           className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                        >
                           {t.close}
                        </button>
                     </div>
                  </div>
               </div>
           </div>
        )}

        <div className="flex items-center space-x-4">
           <button 
             onClick={() => setSelectedStudent(null)}
             className="p-2 rounded-full hover:bg-white text-gray-500 hover:text-gray-900 transition-colors bg-gray-100"
             title={t.backToRecords}
           >
             <ChevronLeft className="h-6 w-6" />
           </button>
           <h2 className="text-2xl font-bold text-gray-900">{t.studentAcademicProfile}</h2>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
           <div className="flex items-center mb-8">
              <img className="h-20 w-20 rounded-full object-cover border-4 border-gray-100" src={selectedStudent.avatar} alt="" />
              <div className="ml-5">
                 <h3 className="text-2xl font-bold text-gray-900">{selectedStudent.name}</h3>
                 <div className="text-gray-500 flex items-center mt-1">
                    <GraduationCap className="h-4 w-4 mr-2" />
                    {selectedStudent.grade} • {selectedStudent.className}
                 </div>
                 <div className="text-gray-400 text-sm mt-1">{selectedStudent.id}</div>
              </div>
           </div>

           <div className="space-y-8">
              {sortedSemesters.length === 0 && (
                <div className="text-center py-10 text-gray-500">
                  {t.noRecordsFound}
                </div>
              )}
              {sortedSemesters.map((sem) => {
                const relevantMonths = getRelevantMonths(sem);
                return (
                <div key={sem} className="border rounded-lg overflow-hidden border-gray-200">
                  <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                    <h4 className="text-lg font-semibold text-gray-800">{sem}</h4>
                    <div className="flex items-center gap-4">
                       <button 
                         onClick={() => setReportSemester(sem)}
                         className="flex items-center text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-3 py-1.5 rounded-md transition-colors"
                       >
                         <FileText className="h-4 w-4 mr-1.5" />
                         {t.reportPreview}
                       </button>
                       <div className="flex items-baseline gap-2 pl-4 border-l border-gray-300">
                          <span className="text-sm text-gray-500 font-medium">{t.averageScore}:</span>
                          <span className="text-2xl font-extrabold text-gray-900">
                             {Math.round(resultsBySemester[sem].reduce((acc, curr) => {
                                 // Dynamic recalculation
                                 const score = (curr.monthlyScores && curr.monthlyScores.length > 0)
                                   ? curr.monthlyScores.reduce((s, m) => s + m.score, 0) / curr.monthlyScores.length
                                   : curr.score;
                                 return acc + score;
                             }, 0) / resultsBySemester[sem].length)}%
                          </span>
                       </div>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                       <thead className="bg-white">
                         <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.subject}</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.totalCalculated}</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.grade}</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">{t.teacherComment}</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">{t.date}</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{t.actions}</th>
                         </tr>
                       </thead>
                       <tbody className="bg-white divide-y divide-gray-200">
                          {resultsBySemester[sem].map((res, idx) => {
                             const calculatedScore = (res.monthlyScores && res.monthlyScores.length > 0)
                                ? Math.round(res.monthlyScores.reduce((s, m) => s + m.score, 0) / res.monthlyScores.length)
                                : res.score;
                             const isExpanded = expandedSubjectKey === `${sem}-${res.subject}`;
                             
                             return (
                               <React.Fragment key={idx}>
                                 <tr className={`hover:bg-gray-50 ${isExpanded ? 'bg-blue-50/50' : ''}`}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{res.subject}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold text-2xl">{calculatedScore}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getGradeColor(calculatedScore)}`}>
                                         {getGrade(calculatedScore)}
                                      </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500 hidden sm:table-cell">
                                      {editingComment?.studentId === selectedStudent.id && 
                                       editingComment?.semester === sem && 
                                       editingComment?.subject === res.subject ? (
                                         <div className="flex flex-col gap-2 min-w-[200px] z-10 relative bg-white p-2 border rounded shadow-md animate-in fade-in zoom-in duration-200">
                                           <textarea 
                                             value={commentText} 
                                             onChange={(e) => setCommentText(e.target.value)}
                                             className="w-full border rounded p-1 text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                             rows={3}
                                             placeholder="Enter detailed semester feedback..."
                                             autoFocus
                                           />
                                           <div className="flex justify-end gap-2">
                                              <button onClick={() => setEditingComment(null)} className="text-gray-400 hover:text-gray-600"><X size={14}/></button>
                                              <button onClick={handleSaveComment} className="text-green-600 hover:text-green-800"><Check size={14}/></button>
                                           </div>
                                         </div>
                                       ) : (
                                         <div 
                                           className="group flex items-start justify-between cursor-pointer p-1.5 hover:bg-gray-100 rounded transition-colors"
                                           onClick={() => startEditingComment(selectedStudent.id, sem, res.subject, res.teacherComment)}
                                           title="Click to edit comment"
                                         >
                                           <span className={`italic max-w-xs truncate ${!res.teacherComment ? 'text-gray-400 not-italic' : ''}`}>
                                             {res.teacherComment ? `"${res.teacherComment}"` : 'Add comment...'}
                                           </span>
                                           <Edit2 className="h-3 w-3 text-gray-300 opacity-0 group-hover:opacity-100 ml-2 mt-1 transition-opacity" />
                                         </div>
                                       )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">{res.date}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                        <button 
                                          onClick={() => toggleMonthlyView(sem, res.subject)}
                                          className="text-blue-600 hover:text-blue-800 flex items-center justify-end w-full"
                                        >
                                           {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                        </button>
                                    </td>
                                 </tr>
                                 {isExpanded && (
                                   <tr className="bg-gray-50">
                                      <td colSpan={6} className="px-6 py-4">
                                         <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                                            <div className="flex justify-between items-center mb-4">
                                              <h5 className="font-semibold text-gray-700 flex items-center">
                                                <Calculator className="h-4 w-4 mr-2 text-blue-500" />
                                                {t.monthlyBreakdown}
                                              </h5>
                                              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                                {t.semester}: {sem}
                                              </span>
                                            </div>
                                            
                                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                              {relevantMonths.map((m) => {
                                                  // Find score matching the month name or code
                                                  const scoreObj = res.monthlyScores?.find(ms => 
                                                      ms.month === m.full || ms.month.startsWith(m.key) || ms.month === m.labelZh
                                                  );
                                                  
                                                  const isEditing = editingCell?.studentId === selectedStudent.id && 
                                                                    editingCell?.semester === sem && 
                                                                    editingCell?.subject === res.subject &&
                                                                    editingCell?.monthKey === m.key;
                                                  
                                                  if (isEditing) {
                                                    return (
                                                      <div key={m.key} className="relative p-2 rounded-md border border-blue-500 bg-white shadow-lg z-10 flex flex-col gap-2 min-h-[140px] animate-in fade-in zoom-in duration-200">
                                                         <div className="flex justify-between items-center">
                                                           <span className="text-xs font-bold text-gray-500">{language === 'zh' ? m.labelZh : m.key}</span>
                                                           <div className="flex gap-1">
                                                              <button onClick={handleSaveScore} className="p-1 hover:bg-green-100 rounded text-green-600 shadow-sm" title="Save"><Check size={14} /></button>
                                                              <button onClick={() => setEditingCell(null)} className="p-1 hover:bg-red-100 rounded text-red-600 shadow-sm" title="Cancel"><X size={14} /></button>
                                                           </div>
                                                         </div>
                                                         <div className="flex-1 flex flex-col gap-2">
                                                            <input
                                                              type="number"
                                                              min="0"
                                                              max="100"
                                                              className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                                              placeholder="0-100"
                                                              value={editScore}
                                                              onChange={(e) => setEditScore(e.target.value)}
                                                              autoFocus
                                                            />
                                                            <textarea
                                                              className="w-full border border-gray-300 rounded px-2 py-1 text-xs resize-none flex-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                                              placeholder="Add monthly comment..."
                                                              value={editComment}
                                                              onChange={(e) => setEditComment(e.target.value)}
                                                            />
                                                         </div>
                                                      </div>
                                                    );
                                                  }

                                                  return (
                                                      <div 
                                                        key={m.key} 
                                                        onClick={() => startEditing(selectedStudent.id, sem, res.subject, m.key, scoreObj?.score, scoreObj?.comment)}
                                                        className={`relative p-3 rounded-md border transition-all duration-200 flex flex-col justify-between cursor-pointer group ${scoreObj ? 'bg-white border-gray-300 shadow-sm min-h-[120px] hover:border-blue-400 hover:shadow-md' : 'bg-gray-50 border-gray-200 border-dashed hover:border-blue-400 hover:bg-blue-50/30 min-h-[100px]'}`}
                                                      >
                                                          <div className="flex justify-between items-start mb-2">
                                                            <span className="text-xs font-bold text-gray-500 uppercase">
                                                                {language === 'zh' ? m.labelZh : m.key}
                                                            </span>
                                                            {scoreObj ? (
                                                              <Edit2 className="h-3 w-3 text-gray-300 group-hover:text-blue-500" />
                                                            ) : (
                                                              <PlusCircle className="h-3 w-3 text-gray-300 group-hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                            )}
                                                          </div>
                                                          
                                                          {scoreObj ? (
                                                              <div className="flex flex-col h-full justify-between">
                                                                  <div>
                                                                    <div className="flex items-baseline justify-between mb-1">
                                                                        <span className="text-xl font-bold text-gray-900">{scoreObj.score}</span>
                                                                    </div>
                                                                    <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden mb-2">
                                                                        <div className={`h-full ${scoreObj.score >= 90 ? 'bg-green-500' : scoreObj.score >= 70 ? 'bg-blue-500' : 'bg-red-500'}`} style={{width: `${scoreObj.score}%`}}></div>
                                                                    </div>
                                                                  </div>
                                                                  
                                                                  <div className="mt-2 pt-2 border-t border-gray-100">
                                                                      {scoreObj.comment && (
                                                                          <p className="text-xs text-gray-600 italic line-clamp-2" title={scoreObj.comment}>"{scoreObj.comment}"</p>
                                                                      )}
                                                                  </div>
                                                              </div>
                                                          ) : (
                                                               <div className="flex flex-col items-center justify-center h-full text-gray-300 group-hover:text-blue-500 transition-colors mt-2">
                                                                   <span className="text-[10px] font-medium opacity-0 group-hover:opacity-100 transition-opacity">{t.enterScore}</span>
                                                               </div>
                                                          )}
                                                      </div>
                                                  )
                                              })}
                                            </div>
                                         </div>
                                      </td>
                                   </tr>
                                 )}
                               </React.Fragment>
                             );
                          })}
                       </tbody>
                    </table>
                  </div>
                </div>
              )})}
           </div>
        </div>
      </div>
    );
  }

  // Main Dashboard View
  return (
    <div className="space-y-6">
      <div className="flex flex-col xl:flex-row xl:justify-between xl:items-center gap-4">
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

            {/* Class Filter */}
            <div className="flex items-center space-x-2 bg-white rounded-md border border-gray-300 px-3 py-1.5 shadow-sm">
               <Filter className="h-4 w-4 text-gray-500" />
               <select 
                 value={selectedClass} 
                 onChange={(e) => setSelectedClass(e.target.value)}
                 className="block w-full border-none p-0 text-gray-900 focus:ring-0 sm:text-sm sm:leading-6 bg-transparent outline-none cursor-pointer"
               >
                 {uniqueClasses.map(c => <option key={c} value={c}>{c === 'All' ? t.classSelect : c}</option>)}
               </select>
            </div>

            {/* Semester Filter */}
            <div className="flex items-center space-x-2 bg-white rounded-md border border-gray-300 px-3 py-1.5 shadow-sm">
               <Calendar className="h-4 w-4 text-gray-500" />
               <select 
                 value={selectedSemester} 
                 onChange={(e) => setSelectedSemester(e.target.value)}
                 className="block w-full border-none p-0 text-gray-900 focus:ring-0 sm:text-sm sm:leading-6 bg-transparent outline-none cursor-pointer"
               >
                 {uniqueSemesters.map(s => (
                   <option key={s} value={s}>
                     {s === 'All' ? t.allSemesters : s}
                   </option>
                 ))}
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
               {studentPerformance.filter(s => s.hasData && s.average < 70).length}
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
                   <th scope="col" className="relative px-6 py-3"><span className="sr-only">{t.actions}</span></th>
                 </tr>
               </thead>
               <tbody className="bg-white divide-y divide-gray-200">
                 {studentPerformance.length > 0 ? (
                   studentPerformance.map((student) => (
                     <tr 
                      key={student.id} 
                      className="hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => setSelectedStudent(student)}
                     >
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
                         {student.hasData ? `${student.average}%` : '-'}
                       </td>
                       <td className="px-6 py-4 whitespace-nowrap">
                         <span className={`inline-flex items-center justify-center h-8 w-8 rounded-full text-sm font-bold ${
                           student.grade === 'A' ? 'bg-green-100 text-green-800' :
                           student.grade === 'B' ? 'bg-blue-100 text-blue-800' :
                           student.grade === 'C' ? 'bg-yellow-100 text-yellow-800' :
                           student.grade === 'D' ? 'bg-red-100 text-red-800' :
                           'bg-gray-100 text-gray-800'
                         }`}>
                           {student.grade}
                         </span>
                       </td>
                       <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                         <ChevronRight className="h-5 w-5 text-gray-400" />
                       </td>
                     </tr>
                   ))
                 ) : (
                   <tr>
                     <td colSpan={allSubjects.length + 4} className="px-6 py-10 text-center text-gray-500">
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
            {subjectStats.length > 0 ? (
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
            ) : (
                <div className="h-80 w-full flex items-center justify-center text-gray-400">
                    <p>No data for this selection</p>
                </div>
            )}
            
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
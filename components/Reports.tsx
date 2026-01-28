import React, { useState } from 'react';
import { Language } from '../types';
import { UI_LABELS } from '../constants';
import { FileText, Download, PieChart, TrendingUp, BarChart, Clock, CheckCircle, Loader2, Eye, X, Printer, AlertTriangle } from 'lucide-react';

interface ReportsProps {
  language: Language;
}

const Reports: React.FC<ReportsProps> = ({ language }) => {
  const t = UI_LABELS[language];
  const [previewReport, setPreviewReport] = useState<any | null>(null);

  const reportTypes = [
    { id: 'academic', title: t.academicPerformance, icon: TrendingUp, color: 'bg-blue-100 text-blue-600' },
    { id: 'attendance', title: t.attendanceSummary, icon: Clock, color: 'bg-green-100 text-green-600' },
    { id: 'hostel', title: t.hostelOccupancy, icon: PieChart, color: 'bg-purple-100 text-purple-600' },
    { id: 'finance', title: t.financialReport, icon: BarChart, color: 'bg-amber-100 text-amber-600' },
    { id: 'behavior', title: t.behaviorReport, icon: AlertTriangle, color: 'bg-red-100 text-red-600' },
  ];

  const recentReports = [
    { id: 1, name: 'Q3 Academic Summary', type: 'Academic', date: '2023-12-24', status: 'Ready', size: '2.4 MB' },
    { id: 2, name: 'December Attendance', type: 'Attendance', date: '2023-12-22', status: 'Ready', size: '1.1 MB' },
    { id: 3, name: 'Hostel Maintenance Log', type: 'Hostel', date: '2023-12-20', status: 'Processing', size: '-' },
    { id: 4, name: 'Annual Financial Overview', type: 'Finance', date: '2023-12-15', status: 'Ready', size: '5.8 MB' },
    { id: 5, name: 'Student Conduct Report', type: 'Behavior', date: '2023-12-10', status: 'Ready', size: '1.5 MB' },
  ];

  const handleGeneratePreview = (typeId: string) => {
    const typeMapping: Record<string, string> = {
      'academic': 'Academic',
      'attendance': 'Attendance',
      'hostel': 'Hostel',
      'finance': 'Finance',
      'behavior': 'Behavior'
    };

    setPreviewReport({
      name: `${typeMapping[typeId]} Report Preview`,
      type: typeMapping[typeId],
      date: new Date().toLocaleDateString(language === 'en' ? 'en-US' : 'zh-CN'),
      status: 'Preview'
    });
  };

  // Mock content generator for preview
  const renderReportContent = (report: any) => {
    switch(report.type) {
      case 'Academic':
        return (
          <div className="space-y-6">
            <div className="border-b pb-4 mb-4">
              <h4 className="text-xl font-bold text-gray-800">Q3 Academic Performance Review</h4>
              <p className="text-sm text-gray-500">Term: Fall 2023 • Generated: {report.date}</p>
            </div>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-50 p-3 rounded-lg text-center">
                 <p className="text-xs text-gray-500 uppercase">Avg GPA</p>
                 <p className="text-2xl font-bold text-blue-700">3.42</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg text-center">
                 <p className="text-xs text-gray-500 uppercase">Pass Rate</p>
                 <p className="text-2xl font-bold text-green-700">96.5%</p>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg text-center">
                 <p className="text-xs text-gray-500 uppercase">Top Class</p>
                 <p className="text-2xl font-bold text-purple-700">10-A</p>
              </div>
            </div>
            <table className="min-w-full text-sm">
               <thead>
                 <tr className="bg-gray-100 text-gray-600 text-left">
                   <th className="p-2">Subject</th>
                   <th className="p-2">Grade A</th>
                   <th className="p-2">Grade B</th>
                   <th className="p-2">Grade C</th>
                   <th className="p-2">Fail</th>
                 </tr>
               </thead>
               <tbody>
                 <tr className="border-b"><td className="p-2 font-medium">Mathematics</td><td className="p-2">45</td><td className="p-2">30</td><td className="p-2">15</td><td className="p-2 text-red-600">5</td></tr>
                 <tr className="border-b"><td className="p-2 font-medium">Science</td><td className="p-2">52</td><td className="p-2">28</td><td className="p-2">10</td><td className="p-2 text-red-600">2</td></tr>
                 <tr className="border-b"><td className="p-2 font-medium">History</td><td className="p-2">38</td><td className="p-2">42</td><td className="p-2">12</td><td className="p-2 text-red-600">1</td></tr>
               </tbody>
            </table>
          </div>
        );
      case 'Attendance':
        return (
          <div className="space-y-6">
            <div className="border-b pb-4 mb-4">
              <h4 className="text-xl font-bold text-gray-800">Attendance Summary</h4>
              <p className="text-sm text-gray-500">Period: December 2023</p>
            </div>
            <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
               <div className="text-center">
                  <p className="text-sm text-gray-500">Total School Days</p>
                  <p className="text-xl font-bold">20</p>
               </div>
               <div className="text-center">
                  <p className="text-sm text-gray-500">Avg Daily Attendance</p>
                  <p className="text-xl font-bold text-green-600">94.8%</p>
               </div>
               <div className="text-center">
                  <p className="text-sm text-gray-500">Total Absences</p>
                  <p className="text-xl font-bold text-red-500">42</p>
               </div>
            </div>
            <div className="mt-4">
               <p className="text-sm font-medium text-gray-500 mb-2">Weekly Trend</p>
               <div className="flex items-end justify-between h-20 space-x-2">
                 {[92, 95, 96, 91, 89].map((val, i) => (
                    <div key={i} className="w-full bg-blue-100 rounded-t-sm relative group">
                       <div className="absolute bottom-0 w-full bg-blue-500 rounded-t-sm transition-all duration-500" style={{height: `${val}%`}}></div>
                       <div className="opacity-0 group-hover:opacity-100 absolute -top-6 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-1 rounded">{val}%</div>
                    </div>
                 ))}
               </div>
               <div className="flex justify-between text-xs text-gray-400 mt-1">
                 <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span>
               </div>
            </div>
            <h5 className="font-semibold text-gray-700 mt-6 flex items-center">
               <AlertTriangle className="h-4 w-4 mr-2 text-amber-500" />
               Low Attendance Alert (Top 3)
            </h5>
            <ul className="space-y-2 mt-2">
              <li className="flex justify-between p-3 bg-red-50 text-red-800 rounded-md border border-red-100">
                <span className="font-medium">John Doe (Class 11-B)</span>
                <span className="font-bold">78%</span>
              </li>
              <li className="flex justify-between p-3 bg-red-50 text-red-800 rounded-md border border-red-100">
                <span className="font-medium">Jane Smith (Class 10-A)</span>
                <span className="font-bold">81%</span>
              </li>
              <li className="flex justify-between p-3 bg-amber-50 text-amber-800 rounded-md border border-amber-100">
                <span className="font-medium">Robert Fox (Class 12-C)</span>
                <span className="font-bold">85%</span>
              </li>
            </ul>
          </div>
        );
      case 'Hostel':
         return (
           <div className="space-y-6">
             <div className="border-b pb-4 mb-4">
              <h4 className="text-xl font-bold text-gray-800">Hostel Maintenance Log</h4>
              <p className="text-sm text-gray-500">Facility: Block A & B</p>
             </div>
             <div className="space-y-3">
               <div className="flex items-start space-x-3 p-3 bg-white border rounded shadow-sm">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Room 101 - HVAC Repair</p>
                    <p className="text-xs text-gray-500">Completed on Dec 18, 2023</p>
                  </div>
               </div>
               <div className="flex items-start space-x-3 p-3 bg-white border rounded shadow-sm">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Block A - Plumbing Check</p>
                    <p className="text-xs text-gray-500">Completed on Dec 19, 2023</p>
                  </div>
               </div>
               <div className="flex items-start space-x-3 p-3 bg-white border rounded shadow-sm opacity-70">
                  <Clock className="h-5 w-5 text-amber-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Room 304 - Window Replacement</p>
                    <p className="text-xs text-gray-500">Scheduled for Dec 25, 2023</p>
                  </div>
               </div>
             </div>
           </div>
         );
      case 'Finance':
         return (
           <div className="space-y-6">
             <div className="border-b pb-4 mb-4">
               <h4 className="text-xl font-bold text-gray-800">Annual Financial Overview</h4>
               <p className="text-sm text-gray-500">Fiscal Year: 2023</p>
             </div>
             <div className="grid grid-cols-2 gap-4">
               <div className="p-4 bg-gray-50 rounded border">
                 <p className="text-sm text-gray-500">Total Revenue</p>
                 <p className="text-2xl font-bold text-gray-900">$1,250,000</p>
               </div>
               <div className="p-4 bg-gray-50 rounded border">
                 <p className="text-sm text-gray-500">Total Expenses</p>
                 <p className="text-2xl font-bold text-gray-900">$980,000</p>
               </div>
             </div>
             <div className="mt-4">
               <p className="font-medium mb-2">Expense Breakdown</p>
               <div className="space-y-2 text-sm">
                 <div className="flex justify-between"><span className="text-gray-600">Staff Salaries</span><span>60%</span></div>
                 <div className="w-full bg-gray-200 rounded-full h-2"><div className="bg-blue-600 h-2 rounded-full" style={{width: '60%'}}></div></div>
                 
                 <div className="flex justify-between"><span className="text-gray-600">Infrastructure</span><span>25%</span></div>
                 <div className="w-full bg-gray-200 rounded-full h-2"><div className="bg-blue-600 h-2 rounded-full" style={{width: '25%'}}></div></div>
                 
                 <div className="flex justify-between"><span className="text-gray-600">Utilities</span><span>15%</span></div>
                 <div className="w-full bg-gray-200 rounded-full h-2"><div className="bg-blue-600 h-2 rounded-full" style={{width: '15%'}}></div></div>
               </div>
             </div>
           </div>
         );
      case 'Behavior':
        return (
          <div className="space-y-6">
            <div className="border-b pb-4 mb-4">
              <h4 className="text-xl font-bold text-gray-800">Student Behavior Report</h4>
              <p className="text-sm text-gray-500">Term 1 2024 • Generated: {report.date}</p>
            </div>
            <div className="grid grid-cols-3 gap-4 mb-2">
              <div className="bg-red-50 p-3 rounded-lg text-center border border-red-100">
                 <p className="text-xs text-gray-500 uppercase">Incidents</p>
                 <p className="text-2xl font-bold text-red-600">12</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg text-center border border-green-100">
                 <p className="text-xs text-gray-500 uppercase">Merits Issued</p>
                 <p className="text-2xl font-bold text-green-600">145</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg text-center border border-blue-100">
                 <p className="text-xs text-gray-500 uppercase">Commendations</p>
                 <p className="text-2xl font-bold text-blue-600">8</p>
              </div>
            </div>
            
            <h5 className="font-semibold text-gray-700 mt-4">Recent Incidents Log</h5>
            <div className="overflow-hidden border rounded-lg">
               <table className="min-w-full divide-y divide-gray-200">
                 <thead className="bg-gray-50">
                    <tr>
                       <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Student</th>
                       <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Type</th>
                       <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Date</th>
                    </tr>
                 </thead>
                 <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                       <td className="px-3 py-2 text-sm">Michael Wang</td>
                       <td className="px-3 py-2 text-sm"><span className="text-amber-600 bg-amber-50 px-1 rounded text-xs">Late Arrival</span></td>
                       <td className="px-3 py-2 text-sm text-gray-500">Dec 10</td>
                    </tr>
                    <tr>
                       <td className="px-3 py-2 text-sm">John Doe</td>
                       <td className="px-3 py-2 text-sm"><span className="text-red-600 bg-red-50 px-1 rounded text-xs">Disruptive</span></td>
                       <td className="px-3 py-2 text-sm text-gray-500">Dec 08</td>
                    </tr>
                    <tr>
                       <td className="px-3 py-2 text-sm">Alice Chen</td>
                       <td className="px-3 py-2 text-sm"><span className="text-green-600 bg-green-50 px-1 rounded text-xs">Helping Peer</span></td>
                       <td className="px-3 py-2 text-sm text-gray-500">Dec 05</td>
                    </tr>
                 </tbody>
               </table>
            </div>
          </div>
        );
      default:
        return <p className="text-center text-gray-500 py-10">Preview not available.</p>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">{t.reportsTitle}</h2>
      </div>

      {/* Report Generation Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
        {reportTypes.map((type) => (
          <button
            key={type.id}
            onClick={() => handleGeneratePreview(type.id)}
            className="bg-white overflow-hidden shadow rounded-lg p-5 flex items-center hover:shadow-md transition-shadow text-left w-full group"
          >
            <div className={`flex-shrink-0 rounded-md p-3 ${type.color} group-hover:scale-110 transition-transform`}>
              <type.icon className="h-6 w-6" />
            </div>
            <div className="ml-5">
              <p className="text-sm font-medium text-gray-900">{type.title}</p>
              <p className="text-xs text-gray-500 mt-1">{t.generateReport}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Recent Reports Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">{t.recentReports}</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.reportType}</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.generatedDate}</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.status}</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{t.actions}</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentReports.map((report) => (
                <tr key={report.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm font-medium text-gray-900">{report.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {report.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {report.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      report.status === 'Ready' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {report.status === 'Ready' ? (
                        <CheckCircle className="h-3 w-3 mr-1" />
                      ) : (
                        <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                      )}
                      {report.status === 'Ready' ? t.ready : t.processing}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {report.status === 'Ready' ? (
                      <div className="flex justify-end space-x-3">
                        <button 
                          onClick={() => setPreviewReport(report)}
                          className="text-gray-600 hover:text-blue-600 inline-flex items-center transition-colors"
                          title={t.preview}
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="text-gray-600 hover:text-blue-600 inline-flex items-center transition-colors" title={t.download}>
                          <Download className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <span className="text-gray-400 cursor-not-allowed">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Preview Modal */}
      {previewReport && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div 
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity backdrop-blur-sm" 
              aria-hidden="true"
              onClick={() => setPreviewReport(null)}
            ></div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex justify-between items-center mb-5 border-b border-gray-200 pb-3">
                  <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                    {t.reportPreview} {previewReport.status === 'Preview' && '(Sample)'}
                  </h3>
                  <button 
                    onClick={() => setPreviewReport(null)}
                    className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                  >
                    <span className="sr-only">{t.close}</span>
                    <X className="h-6 w-6" />
                  </button>
                </div>
                
                {/* Simulated Document View */}
                <div className="bg-white border border-gray-200 shadow-sm p-8 min-h-[400px] max-h-[60vh] overflow-y-auto mx-auto w-full max-w-2xl font-sans">
                   {renderReportContent(previewReport)}
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm items-center"
                  onClick={() => alert("Printing...")}
                >
                  <Printer className="h-4 w-4 mr-2" />
                  {t.print}
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setPreviewReport(null)}
                >
                  {t.close}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;
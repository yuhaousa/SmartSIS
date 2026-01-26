import React from 'react';
import { Language } from '../types';
import { UI_LABELS } from '../constants';
import { FileText, Download, PieChart, TrendingUp, BarChart, Clock, CheckCircle, Loader2 } from 'lucide-react';

interface ReportsProps {
  language: Language;
}

const Reports: React.FC<ReportsProps> = ({ language }) => {
  const t = UI_LABELS[language];

  const reportTypes = [
    { id: 'academic', title: t.academicPerformance, icon: TrendingUp, color: 'bg-blue-100 text-blue-600' },
    { id: 'attendance', title: t.attendanceSummary, icon: Clock, color: 'bg-green-100 text-green-600' },
    { id: 'hostel', title: t.hostelOccupancy, icon: PieChart, color: 'bg-purple-100 text-purple-600' },
    { id: 'finance', title: t.financialReport, icon: BarChart, color: 'bg-amber-100 text-amber-600' },
  ];

  const recentReports = [
    { id: 1, name: 'Q3 Academic Summary', type: 'Academic', date: '2023-12-24', status: 'Ready', size: '2.4 MB' },
    { id: 2, name: 'December Attendance', type: 'Attendance', date: '2023-12-22', status: 'Ready', size: '1.1 MB' },
    { id: 3, name: 'Hostel Maintenance Log', type: 'Hostel', date: '2023-12-20', status: 'Processing', size: '-' },
    { id: 4, name: 'Annual Financial Overview', type: 'Finance', date: '2023-12-15', status: 'Ready', size: '5.8 MB' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">{t.reportsTitle}</h2>
      </div>

      {/* Report Generation Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {reportTypes.map((type) => (
          <button
            key={type.id}
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
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{t.download}</th>
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
                      <button className="text-blue-600 hover:text-blue-900 inline-flex items-center">
                        <Download className="h-4 w-4 mr-1" />
                        <span className="hidden sm:inline">PDF ({report.size})</span>
                      </button>
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
    </div>
  );
};

export default Reports;
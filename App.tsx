
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Students from './components/Students';
import AcademicRecords from './components/AcademicRecords';
import Timetable from './components/Timetable';
import Hostel from './components/Hostel';
import Settings from './components/Settings';
import Attendance from './components/Attendance';
import AIChatbot from './components/AIChatbot';
import Login from './components/Login';
import Reports from './components/Reports';
import Messages from './components/Messages';
import Consultations from './components/Consultations';
import UniversityApplications from './components/UniversityApplications';
import UniversityManagement from './components/UniversityManagement';
import { Language } from './types';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');
  const [language, setLanguage] = useState<Language>('en');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentView('dashboard'); // Reset view on logout
  };

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard language={language} />;
      case 'students':
        return <Students language={language} />;
      case 'academics':
        return <AcademicRecords language={language} />;
      case 'university_management':
        return <UniversityManagement language={language} />;
      case 'university_apps':
        return <UniversityApplications language={language} />;
      case 'consultations':
        return <Consultations language={language} />;
      case 'timetable':
        return <Timetable language={language} />;
      case 'attendance':
        return <Attendance language={language} />;
      case 'hostel':
        return <Hostel language={language} />;
      case 'reports':
        return <Reports language={language} />;
      case 'messages':
        return <Messages language={language} />;
      case 'settings':
        return <Settings language={language} />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-[60vh] text-gray-400">
            <h2 className="text-2xl font-bold mb-2">Coming Soon</h2>
            <p>The {currentView} module is currently under development.</p>
          </div>
        );
    }
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} language={language} />;
  }

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden font-sans">
      <Sidebar 
        currentView={currentView} 
        setCurrentView={(view) => {
          setCurrentView(view);
          setSidebarOpen(false); // Close sidebar on mobile select
        }}
        language={language}
        isOpen={sidebarOpen}
        onLogout={handleLogout}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header 
          language={language} 
          setLanguage={setLanguage} 
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {renderContent()}
        </main>
      </div>

      <AIChatbot language={language} />
    </div>
  );
};

export default App;

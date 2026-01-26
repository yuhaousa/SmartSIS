import React from 'react';
import { NAV_ITEMS, UI_LABELS } from '../constants';
import { NavItem, Language } from '../types';
import { LogOut } from 'lucide-react';

interface SidebarProps {
  currentView: string;
  setCurrentView: (id: string) => void;
  language: Language;
  isOpen: boolean;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView, language, isOpen, onLogout }) => {
  const t = UI_LABELS[language];

  return (
    <div className={`
      fixed inset-y-0 left-0 z-30 w-64 bg-slate-900 text-white transition-transform duration-300 ease-in-out transform
      ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      md:relative md:translate-x-0 flex flex-col
    `}>
      <div className="flex items-center justify-center h-16 bg-slate-800 border-b border-slate-700 flex-shrink-0">
        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">
          Smart SIS
        </h1>
      </div>
      
      <nav className="mt-5 px-2 space-y-1 flex-1 overflow-y-auto">
        {NAV_ITEMS.map((item: NavItem) => (
          <button
            key={item.id}
            onClick={() => setCurrentView(item.id)}
            className={`
              group flex items-center px-4 py-3 text-sm font-medium rounded-md w-full transition-colors
              ${currentView === item.id 
                ? 'bg-blue-600 text-white' 
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'}
            `}
          >
            <item.icon className={`mr-3 flex-shrink-0 h-5 w-5 ${currentView === item.id ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />
            {language === 'en' ? item.labelEn : item.labelZh}
          </button>
        ))}
      </nav>

      <div className="p-4 bg-slate-800 border-t border-slate-700 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <img className="h-8 w-8 rounded-full" src="https://picsum.photos/id/1005/100/100" alt="Admin" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-white">Admin User</p>
              <p className="text-xs font-medium text-slate-400">View Profile</p>
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="text-slate-400 hover:text-white transition-colors p-1 rounded-md hover:bg-slate-700"
            title={t.logout}
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
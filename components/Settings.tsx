import React from 'react';
import { Language } from '../types';
import { UI_LABELS } from '../constants';
import { Bell, Lock, User, Moon, Shield } from 'lucide-react';

interface SettingsProps {
  language: Language;
}

const Settings: React.FC<SettingsProps> = ({ language }) => {
  const t = UI_LABELS[language];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">{t.settings}</h2>

      <div className="bg-white shadow rounded-lg divide-y divide-gray-200">
        
        {/* Profile Section */}
        <div className="p-6">
          <div className="flex items-center mb-4">
            <User className="h-5 w-5 text-gray-400 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">{t.general}</h3>
          </div>
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <div className="mt-1">
                <input type="text" defaultValue="Admin User" className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border" />
              </div>
            </div>
            <div className="sm:col-span-3">
              <label className="block text-sm font-medium text-gray-700">Email Address</label>
              <div className="mt-1">
                <input type="email" defaultValue="admin@smartsis.com" className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border" />
              </div>
            </div>
          </div>
        </div>

        {/* Notifications Section */}
        <div className="p-6">
          <div className="flex items-center mb-4">
            <Bell className="h-5 w-5 text-gray-400 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">{t.notifications}</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">Email Notifications</p>
                <p className="text-xs text-gray-500">Receive weekly summaries and alerts.</p>
              </div>
              <button className="bg-blue-600 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                <span className="translate-x-5 pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"></span>
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">SMS Alerts</p>
                <p className="text-xs text-gray-500">Urgent notifications for attendance and emergencies.</p>
              </div>
              <button className="bg-gray-200 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                <span className="translate-x-0 pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"></span>
              </button>
            </div>
          </div>
        </div>

        {/* Security Section */}
        <div className="p-6">
          <div className="flex items-center mb-4">
            <Shield className="h-5 w-5 text-gray-400 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Security</h3>
          </div>
          <div className="flex items-center justify-between">
             <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none">
               <Lock className="h-4 w-4 mr-2 text-gray-500" />
               Change Password
             </button>
             <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none">
               Two-Factor Authentication
             </button>
          </div>
        </div>

      </div>

      <div className="flex justify-end pt-4">
        <button className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
          {t.save}
        </button>
      </div>
    </div>
  );
};

export default Settings;

import React, { useState, useMemo } from 'react';
import { Language, UniversityApplication, University } from '../types';
import { UI_LABELS, MOCK_UNIVERSITIES } from '../constants';
import { 
  GraduationCap, 
  ChevronRight, 
  ChevronLeft, 
  Check, 
  FileText, 
  User, 
  BookOpen, 
  Building, 
  Clock,
  ArrowRight,
  PlusCircle,
  ExternalLink,
  Search,
  Calendar as CalendarIcon,
  Phone,
  MapPin,
  Upload,
  X,
  File,
  ShieldCheck,
  Briefcase,
  Layers,
  Heart,
  Save,
  Globe,
  ImageOff
} from 'lucide-react';

interface UniversityApplicationsProps {
  language: Language;
}

const UniversityApplications: React.FC<UniversityApplicationsProps> = ({ language }) => {
  const t = UI_LABELS[language];
  const [activeTab, setActiveTab] = useState<'profile' | 'explore' | 'apps'>('explore');
  const [applications, setApplications] = useState<UniversityApplication[]>([]);
  
  // Selection states for new application flow
  const [applyingTo, setApplyingTo] = useState<University | null>(null);
  const [selectedProgramIdx, setSelectedProgramIdx] = useState<number | null>(null);
  const [selectedIntake, setSelectedIntake] = useState('September 2025');

  // Student Profile / Personnel State (Shared across applications)
  const [profile, setProfile] = useState({
    surname: 'Chen',
    givenName: 'Alice',
    dob: '2006-05-12',
    gender: 'Female',
    nationality: 'Malaysian',
    religion: 'Buddhism',
    icPassport: '060512-10-1234',
    passportExpiry: '2030-05-12',
    languages: 'English, Mandarin, Malay',
    mobile: '+60 12-345 6789',
    email: 'alice.chen@smartsis.edu',
    address: 'No. 12, Jalan Ampang, Kuala Lumpur, Malaysia',
    emergencyName: 'John Chen',
    emergencyRelationship: 'Father',
    emergencyPhone: '+60 12-987 6543',
    lastSchool: 'Smart SIS International High',
    highestQualification: 'IGCSE',
    gpa: '3.85',
    englishProficiency: 'IELTS 7.5'
  });

  const [uploadedFiles, setUploadedFiles] = useState<{id: string, name: string, type: string}[]>([]);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (type: string) => {
    const id = Math.random().toString(36).substr(2, 9);
    setUploadedFiles(prev => [...prev, { id, name: `${type}_proof.pdf`, type }]);
  };

  const removeFile = (id: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== id));
  };

  const handleStartApplication = (uni: University) => {
    setApplyingTo(uni);
    setSelectedProgramIdx(0);
  };

  // Image Helper Component with Fallback
  const SafeImage = ({ src, alt, className, iconSize = 24 }: { src: string, alt: string, className: string, iconSize?: number }) => {
    const [failed, setFailed] = useState(false);
    if (failed || !src) {
      return (
        <div className={`${className} bg-gray-200 flex items-center justify-center text-gray-400`}>
          <ImageOff size={iconSize} />
        </div>
      );
    }
    return <img src={src} alt={alt} className={className} onError={() => setFailed(true)} />;
  };

  const submitApplication = () => {
    if (!applyingTo || selectedProgramIdx === null) return;

    const newApp: UniversityApplication = {
      id: `APP${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      studentId: 'STU001',
      universityName: applyingTo.name,
      program: applyingTo.programs[selectedProgramIdx].name,
      intake: selectedIntake,
      status: 'Submitted',
      appliedDate: new Date().toISOString().split('T')[0],
      personalInfo: {
        surname: profile.surname,
        givenName: profile.givenName,
        dob: profile.dob,
        gender: profile.gender,
        nationality: profile.nationality,
        religion: profile.religion,
        icPassport: profile.icPassport,
        passportExpiry: profile.passportExpiry,
        languages: profile.languages
      },
      contactInfo: {
        mobile: profile.mobile,
        email: profile.email,
        address: profile.address
      },
      emergencyContact: {
        name: profile.emergencyName,
        relationship: profile.emergencyRelationship,
        phone: profile.emergencyPhone
      },
      academicInfo: {
        lastSchool: profile.lastSchool,
        highestQualification: profile.highestQualification,
        gpa: profile.gpa,
        englishProficiency: profile.englishProficiency
      },
      documents: uploadedFiles.map(f => ({ ...f, uploadedAt: new Date().toISOString() }))
    };

    setApplications(prev => [newApp, ...prev]);
    setApplyingTo(null);
    setActiveTab('apps');
  };

  const renderProfileTab = () => (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-indigo-600 p-8 text-white">
           <h3 className="text-2xl font-bold flex items-center"><User className="mr-3" /> {t.myProfile}</h3>
           <p className="opacity-80 text-sm mt-1">This information is used for all university applications. Keep it up to date.</p>
        </div>
        
        <div className="p-8 space-y-12">
          {/* Section 1: Personal */}
          <section>
            <h4 className="text-lg font-bold text-gray-900 mb-6 flex items-center border-b pb-2">
              <ShieldCheck className="h-5 w-5 mr-2 text-indigo-600" /> {t.stepPersonal}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{t.surname}</label>
                <input type="text" name="surname" value={profile.surname} onChange={handleProfileChange} className="w-full border-gray-200 rounded-xl p-3 border focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{t.givenName}</label>
                <input type="text" name="givenName" value={profile.givenName} onChange={handleProfileChange} className="w-full border-gray-200 rounded-xl p-3 border focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{t.dob}</label>
                <input type="date" name="dob" value={profile.dob} onChange={handleProfileChange} className="w-full border-gray-200 rounded-xl p-3 border" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{t.gender}</label>
                <select name="gender" value={profile.gender} onChange={handleProfileChange} className="w-full border-gray-200 rounded-xl p-3 border">
                   <option value="Male">Male</option>
                   <option value="Female">Female</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{t.nationality}</label>
                <input type="text" name="nationality" value={profile.nationality} onChange={handleProfileChange} className="w-full border-gray-200 rounded-xl p-3 border" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{t.religion}</label>
                <input type="text" name="religion" value={profile.religion} onChange={handleProfileChange} className="w-full border-gray-200 rounded-xl p-3 border" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{t.languages}</label>
                <input type="text" name="languages" value={profile.languages} onChange={handleProfileChange} className="w-full border-gray-200 rounded-xl p-3 border" />
              </div>
            </div>
          </section>

          {/* Section 2: Contact */}
          <section>
            <h4 className="text-lg font-bold text-gray-900 mb-6 flex items-center border-b pb-2">
              <Phone className="h-5 w-5 mr-2 text-indigo-600" /> {t.stepContact}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{t.mobile}</label>
                <input type="text" name="mobile" value={profile.mobile} onChange={handleProfileChange} className="w-full border-gray-200 rounded-xl p-3 border" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{t.email}</label>
                <input type="email" name="email" value={profile.email} disabled className="w-full border-gray-100 bg-gray-50 rounded-xl p-3 border text-gray-400" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{t.homeAddress}</label>
                <textarea name="address" value={profile.address} onChange={handleProfileChange} rows={2} className="w-full border-gray-200 rounded-xl p-3 border" />
              </div>
            </div>
          </section>

          {/* Section 3: Academic */}
          <section>
            <h4 className="text-lg font-bold text-gray-900 mb-6 flex items-center border-b pb-2">
              <BookOpen className="h-5 w-5 mr-2 text-indigo-600" /> {t.stepAcademic}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{t.lastSchool}</label>
                <input type="text" name="lastSchool" value={profile.lastSchool} onChange={handleProfileChange} className="w-full border-gray-200 rounded-xl p-3 border" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{t.highestQualification}</label>
                <input type="text" name="highestQualification" value={profile.highestQualification} onChange={handleProfileChange} className="w-full border-gray-200 rounded-xl p-3 border" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{t.gpa}</label>
                <input type="text" name="gpa" value={profile.gpa} onChange={handleProfileChange} className="w-full border-gray-200 rounded-xl p-3 border" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{t.englishProficiency}</label>
                <input type="text" name="englishProficiency" value={profile.englishProficiency} onChange={handleProfileChange} className="w-full border-gray-200 rounded-xl p-3 border" />
              </div>
            </div>
          </section>

          {/* Section 4: Uploads */}
          <section>
            <h4 className="text-lg font-bold text-gray-900 mb-6 flex items-center border-b pb-2">
              <Upload className="h-5 w-5 mr-2 text-indigo-600" /> {t.stepUpload}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
               {[
                 { label: t.uploadPhoto, type: 'Photo' },
                 { label: t.uploadIC, type: 'ID' },
                 { label: t.uploadResults, type: 'Transcript' },
                 { label: t.uploadEnglish, type: 'English' }
               ].map((doc) => (
                 <button key={doc.type} onClick={() => handleFileUpload(doc.type)} className="border-2 border-dashed border-gray-200 rounded-2xl p-4 text-center hover:border-indigo-400 hover:bg-indigo-50 transition-all group">
                    <Upload className="h-6 w-6 text-gray-300 group-hover:text-indigo-500 mx-auto mb-2" />
                    <p className="text-xs font-bold text-gray-700">{doc.label}</p>
                 </button>
               ))}
            </div>
            {uploadedFiles.length > 0 && (
              <div className="mt-6 space-y-2">
                 {uploadedFiles.map((file) => (
                   <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                      <div className="flex items-center">
                         <File className="h-4 w-4 text-indigo-500 mr-2" />
                         <span className="text-xs font-medium text-gray-700">{file.name}</span>
                      </div>
                      <button onClick={() => removeFile(file.id)} className="text-red-400 hover:text-red-600"><X size={14} /></button>
                   </div>
                 ))}
              </div>
            )}
          </section>

          <div className="pt-6 border-t flex justify-end">
             <button className="flex items-center px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all active:scale-95">
                <Save className="h-5 w-5 mr-2" /> {t.updateProfile}
             </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderExploreTab = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
       {applyingTo ? (
         <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="p-8 border-b border-gray-100 flex justify-between items-center">
               <button onClick={() => setApplyingTo(null)} className="text-gray-400 hover:text-gray-600"><ChevronLeft className="h-6 w-6" /></button>
               <h3 className="text-xl font-bold">{t.newApplication}</h3>
               <div />
            </div>
            <div className="p-8 space-y-8">
               <div className="flex items-center p-6 bg-blue-50 rounded-2xl border border-blue-100">
                  <div className="h-16 w-16 bg-white rounded-xl p-2 mr-4 shadow-sm overflow-hidden flex items-center justify-center">
                     <SafeImage src={applyingTo.logo} alt="" className="h-full w-full object-contain" />
                  </div>
                  <div>
                     <h4 className="text-lg font-bold text-blue-900">{applyingTo.name}</h4>
                     <p className="text-sm text-blue-700">{applyingTo.location.city}, {applyingTo.location.country}</p>
                  </div>
               </div>

               <div className="space-y-4">
                  <label className="block text-sm font-bold text-gray-700">{t.selectProgram}</label>
                  <div className="grid grid-cols-1 gap-3">
                     {applyingTo.programs.map((p, i) => (
                        <button 
                          key={i} 
                          onClick={() => setSelectedProgramIdx(i)}
                          className={`p-4 rounded-xl border text-left transition-all ${selectedProgramIdx === i ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-600' : 'border-gray-200 hover:border-blue-300'}`}
                        >
                           <div className="flex justify-between items-center">
                              <span className="font-bold text-gray-900">{p.name}</span>
                              <span className="text-xs font-bold text-blue-600">{p.tuition}</span>
                           </div>
                           <p className="text-xs text-gray-500 mt-1">{p.level} • {p.duration}</p>
                        </button>
                     ))}
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                     <label className="block text-sm font-bold text-gray-700 mb-2">{t.intake}</label>
                     <select value={selectedIntake} onChange={(e) => setSelectedIntake(e.target.value)} className="w-full border-gray-200 rounded-xl p-3 border">
                        <option value="February 2025">February 2025</option>
                        <option value="July 2025">July 2025</option>
                        <option value="September 2025">September 2025</option>
                        <option value="January 2026">January 2026</option>
                     </select>
                  </div>
               </div>

               <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 flex items-start text-amber-800 text-xs leading-relaxed">
                  <ShieldCheck className="h-4 w-4 mr-2 flex-shrink-0 mt-0.5" />
                  By submitting, you authorize Smart SIS to share your <strong>Admission Profile</strong> (Personnel Info, Academic History & Documents) with {applyingTo.name} for evaluation.
               </div>

               <button 
                 onClick={submitApplication}
                 className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 flex items-center justify-center"
               >
                 <Check className="h-6 w-6 mr-2" /> {t.submitApp}
               </button>
            </div>
         </div>
       ) : (
         <>
           <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{t.browseUniversities}</h2>
                <p className="text-gray-500">Pick from our suggested high-quality institutions.</p>
              </div>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {MOCK_UNIVERSITIES.map(uni => (
                <div key={uni.id} className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all group flex flex-col">
                   <div className="h-40 relative">
                      <SafeImage src={uni.banner} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" iconSize={32} />
                      <div className="absolute top-4 left-4 bg-white rounded-xl p-1.5 shadow-md h-12 w-12 overflow-hidden flex items-center justify-center">
                         <SafeImage src={uni.logo} alt="" className="h-full w-full object-contain" />
                      </div>
                   </div>
                   <div className="p-6 flex-1 flex flex-col">
                      <h4 className="font-bold text-gray-900 mb-1">{uni.name}</h4>
                      <p className="text-xs text-gray-500 flex items-center mb-4"><MapPin size={12} className="mr-1" /> {uni.location.country}</p>
                      <div className="space-y-2 mb-6">
                         <div className="flex justify-between text-xs"><span className="text-gray-400 uppercase font-bold tracking-tighter">Ranking</span><span className="font-bold text-gray-700">#{uni.worldRanking}</span></div>
                         <div className="flex justify-between text-xs"><span className="text-gray-400 uppercase font-bold tracking-tighter">GPA Req</span><span className="font-bold text-gray-700">{uni.minGPA}+</span></div>
                      </div>
                      <button onClick={() => handleStartApplication(uni)} className="mt-auto w-full py-2.5 bg-gray-50 group-hover:bg-blue-600 text-gray-700 group-hover:text-white rounded-xl text-sm font-bold transition-all">
                         Apply Now
                      </button>
                   </div>
                </div>
              ))}
           </div>
         </>
       )}
    </div>
  );

  const renderAppsTab = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-8 py-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
           <h3 className="font-bold text-gray-900 text-lg">{t.myApplications}</h3>
        </div>
        <div className="divide-y divide-gray-50">
           {applications.length > 0 ? (
             applications.map((app) => (
               <div key={app.id} className="p-8 hover:bg-gray-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                  <div className="flex items-start space-x-5">
                     <div className="bg-indigo-50 p-4 rounded-2xl text-indigo-600">
                        <Building size={24} />
                     </div>
                     <div>
                        <h4 className="font-bold text-gray-900 text-lg">{app.universityName}</h4>
                        <p className="text-sm text-gray-500 font-medium">{app.program}</p>
                        <div className="flex items-center mt-3 space-x-6 text-xs text-gray-400 font-bold">
                           <span className="flex items-center uppercase"><CalendarIcon size={14} className="mr-1.5" /> {app.intake}</span>
                           <span className="flex items-center uppercase"><Clock size={14} className="mr-1.5" /> {app.appliedDate}</span>
                        </div>
                     </div>
                  </div>
                  <div className="flex items-center space-x-6">
                     <span className={`px-4 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest ${
                        app.status === 'Accepted' ? 'bg-green-100 text-green-700' :
                        app.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                        'bg-amber-100 text-amber-700'
                     }`}>
                        {app.status}
                     </span>
                     <button className="h-10 w-10 flex items-center justify-center text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
                        <ExternalLink size={20} />
                     </button>
                  </div>
               </div>
             ))
           ) : (
             <div className="py-24 text-center text-gray-400">
                <GraduationCap className="h-20 w-20 mx-auto mb-4 opacity-5" />
                <p className="text-lg">No active applications. Explore universities to get started.</p>
                <button onClick={() => setActiveTab('explore')} className="mt-4 text-indigo-600 font-bold hover:underline">Browse Institutions</button>
             </div>
           )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-gray-200 gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-6">{t.uniAppTitle}</h2>
          <nav className="flex space-x-8">
            {[
              { id: 'explore', label: t.browseUniversities, icon: Globe },
              { id: 'profile', label: t.myProfile, icon: User },
              { id: 'apps', label: t.myApplications, icon: Layers }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center pb-4 text-sm font-bold transition-all border-b-2 ${activeTab === tab.id ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
              >
                <tab.icon size={18} className="mr-2" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
        <div className="pb-4">
           {activeTab === 'apps' && (
              <button onClick={() => setActiveTab('explore')} className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700">
                <PlusCircle size={16} className="mr-2" /> {t.newApplication}
              </button>
           )}
        </div>
      </div>

      <main className="mt-8">
         {activeTab === 'profile' && renderProfileTab()}
         {activeTab === 'explore' && renderExploreTab()}
         {activeTab === 'apps' && renderAppsTab()}
      </main>

      {/* Counselor Prompt */}
      {activeTab !== 'profile' && (
        <div className="bg-gradient-to-r from-slate-900 to-indigo-950 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl mt-12">
           <div className="relative z-10 max-w-2xl">
              <h3 className="text-2xl font-bold mb-3">Academic Counseling Available</h3>
              <p className="text-indigo-100/70 mb-6 text-sm leading-relaxed">Not sure which program fits your profile? Schedule a session with our university counselor to review your academic history and explore global opportunities.</p>
              <button className="flex items-center px-6 py-3 bg-white text-indigo-900 rounded-xl text-sm font-bold hover:bg-indigo-50 transition-all">
                 Book Consultation <ArrowRight className="ml-2 h-4 w-4" />
              </button>
           </div>
           <div className="absolute -right-10 -bottom-10 opacity-10">
              <GraduationCap size={240} />
           </div>
        </div>
      )}
    </div>
  );
};

export default UniversityApplications;


import React, { useState, useMemo } from 'react';
import { Language, University } from '../types';
import { UI_LABELS, MOCK_UNIVERSITIES } from '../constants';
import { 
  Building, 
  MapPin, 
  Search, 
  Plus, 
  Edit3, 
  Trash2, 
  ChevronLeft, 
  Globe, 
  GraduationCap, 
  Calendar, 
  Award, 
  DollarSign, 
  CheckCircle, 
  ArrowLeft,
  Layout,
  BookOpen,
  Info,
  Filter,
  X,
  Target,
  ImageOff
} from 'lucide-react';

interface UniversityManagementProps {
  language: Language;
}

const UniversityManagement: React.FC<UniversityManagementProps> = ({ language }) => {
  const t = UI_LABELS[language];
  const [universities, setUniversities] = useState<University[]>(MOCK_UNIVERSITIES);
  const [view, setView] = useState<'list' | 'details' | 'form'>('list');
  const [selectedUni, setSelectedUni] = useState<University | null>(null);
  
  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCountry, setFilterCountry] = useState('All');
  const [filterType, setFilterType] = useState('All');
  const [filterRanking, setFilterRanking] = useState('All');
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  // Derived Filter Options
  const countries = useMemo(() => ['All', ...Array.from(new Set(universities.map(u => u.location.country)))].sort(), [universities]);

  const filteredUnis = useMemo(() => {
    return universities.filter(u => {
      const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            u.location.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            u.location.country.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCountry = filterCountry === 'All' || u.location.country === filterCountry;
      const matchesType = filterType === 'All' || u.type === filterType;
      
      let matchesRanking = true;
      if (filterRanking === 'Top50') matchesRanking = u.worldRanking <= 50;
      else if (filterRanking === 'Top100') matchesRanking = u.worldRanking <= 100;

      return matchesSearch && matchesCountry && matchesType && matchesRanking;
    });
  }, [universities, searchTerm, filterCountry, filterType, filterRanking]);

  // Form State
  const [formData, setFormData] = useState<Partial<University>>({
    name: '',
    location: { city: '', state: '', country: '' },
    logo: '',
    banner: '',
    description: '',
    type: 'Private',
    established: 2000,
    ranking: '',
    worldRanking: 100,
    averageTuition: '',
    minGPA: '',
    englishRequirement: '',
    features: [],
    programs: []
  });

  const handleEdit = (uni: University) => {
    setSelectedUni(uni);
    setFormData(uni);
    setView('form');
  };

  const handleAdd = () => {
    setSelectedUni(null);
    setFormData({
      name: '',
      location: { city: '', state: '', country: '' },
      logo: '',
      banner: '',
      description: '',
      type: 'Private',
      established: 2000,
      ranking: '',
      worldRanking: 100,
      averageTuition: '',
      minGPA: '',
      englishRequirement: '',
      features: [],
      programs: []
    });
    setView('form');
  };

  const handleViewDetails = (uni: University) => {
    setSelectedUni(uni);
    setView('details');
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this university?')) {
      setUniversities(prev => prev.filter(u => u.id !== id));
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const uniData = formData as University;
    
    if (selectedUni) {
      setUniversities(prev => prev.map(u => u.id === selectedUni.id ? { ...uniData, id: u.id } : u));
    } else {
      const newUni = { ...uniData, id: `UNI${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}` };
      setUniversities(prev => [...prev, newUni]);
    }
    setView('list');
  };

  const handleProgramAdd = () => {
    setFormData(prev => ({
      ...prev,
      programs: [...(prev.programs || []), { name: '', level: '', tuition: '', duration: '' }]
    }));
  };

  const handleProgramChange = (index: number, field: string, value: string) => {
    const updatedPrograms = [...(formData.programs || [])];
    updatedPrograms[index] = { ...updatedPrograms[index], [field]: value };
    setFormData(prev => ({ ...prev, programs: updatedPrograms }));
  };

  const resetFilters = () => {
    setFilterCountry('All');
    setFilterType('All');
    setFilterRanking('All');
    setSearchTerm('');
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

  if (view === 'details' && selectedUni) {
    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="flex items-center space-x-4">
          <button onClick={() => setView('list')} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <ArrowLeft className="h-6 w-6 text-gray-600" />
          </button>
          <h2 className="text-2xl font-bold text-gray-900">{selectedUni.name} Profile</h2>
        </div>

        {/* Hero Section */}
        <div className="relative h-64 md:h-80 rounded-3xl overflow-hidden shadow-2xl">
          <SafeImage src={selectedUni.banner} alt={selectedUni.name} className="w-full h-full object-cover" iconSize={48} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end">
            <div className="p-8 flex items-center space-x-6 w-full">
               <div className="h-24 w-24 bg-white rounded-2xl p-2 shadow-lg flex-shrink-0 overflow-hidden flex items-center justify-center">
                  <SafeImage src={selectedUni.logo} alt="Logo" className="w-full h-full object-contain" />
               </div>
               <div className="text-white">
                  <h1 className="text-3xl font-extrabold">{selectedUni.name}</h1>
                  <div className="flex flex-wrap items-center mt-2 gap-4 text-sm opacity-90">
                    <span className="flex items-center"><MapPin className="h-4 w-4 mr-1" /> {selectedUni.location.city}, {selectedUni.location.country}</span>
                    <span className="flex items-center"><Award className="h-4 w-4 mr-1" /> {selectedUni.ranking}</span>
                    <span className="flex items-center"><Calendar className="h-4 w-4 mr-1" /> Est. {selectedUni.established}</span>
                  </div>
               </div>
               <div className="ml-auto">
                  <button onClick={() => handleEdit(selectedUni)} className="bg-white/20 hover:bg-white/30 backdrop-blur-md text-white px-6 py-2 rounded-xl font-bold flex items-center transition-all">
                    <Edit3 className="h-4 w-4 mr-2" /> {t.editUniversity}
                  </button>
               </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Info className="h-5 w-5 mr-2 text-blue-600" /> {t.uniDescription}
              </h3>
              <p className="text-gray-600 leading-relaxed text-lg">{selectedUni.description}</p>
              
              <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-4">
                 {selectedUni.features.map((feature, i) => (
                   <div key={i} className="flex items-center p-3 bg-blue-50 rounded-xl text-blue-800 text-sm font-medium">
                      <CheckCircle className="h-4 w-4 mr-2 text-blue-500" />
                      {feature}
                   </div>
                 ))}
              </div>
            </section>

            <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
               <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                 <BookOpen className="h-5 w-5 mr-2 text-blue-600" /> {t.uniPrograms}
               </h3>
               <div className="space-y-4">
                 {selectedUni.programs.map((prog, i) => (
                   <div key={i} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-2xl transition-colors border border-gray-100">
                      <div>
                        <h4 className="font-bold text-gray-900">{prog.name}</h4>
                        <p className="text-sm text-gray-500">{prog.level} • {prog.duration}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-blue-600">{prog.tuition}</p>
                        <p className="text-xs text-gray-400">per year</p>
                      </div>
                   </div>
                 ))}
               </div>
            </section>
          </div>

          {/* Sidebar Requirements */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-indigo-600 to-blue-700 p-8 rounded-3xl text-white shadow-xl">
               <h3 className="text-xl font-bold mb-6 flex items-center">
                 <Globe className="h-5 w-5 mr-2" /> {t.uniRequirements}
               </h3>
               <div className="space-y-6">
                  <div>
                    <p className="text-blue-100 text-xs font-bold uppercase tracking-wider mb-1">{t.requirementGPA}</p>
                    <p className="text-2xl font-bold">{selectedUni.minGPA}+</p>
                  </div>
                  <div>
                    <p className="text-blue-100 text-xs font-bold uppercase tracking-wider mb-1">{t.requirementEnglish}</p>
                    <p className="text-2xl font-bold">{selectedUni.englishRequirement}</p>
                  </div>
                  <div>
                    <p className="text-blue-100 text-xs font-bold uppercase tracking-wider mb-1">{t.uniTuition}</p>
                    <p className="text-2xl font-bold">{selectedUni.averageTuition}</p>
                  </div>
               </div>
               <button className="w-full mt-8 bg-white text-blue-700 py-3 rounded-xl font-bold hover:bg-blue-50 transition-colors flex items-center justify-center">
                 Check My Eligibility <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
               </button>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
               <h4 className="font-bold text-gray-900 mb-4">Quick Stats</h4>
               <div className="space-y-3">
                  <div className="flex justify-between text-sm"><span className="text-gray-500">Type</span><span className="font-medium">{selectedUni.type}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-gray-500">Students</span><span className="font-medium">Approx. 20k</span></div>
                  <div className="flex justify-between text-sm"><span className="text-gray-500">Employment Rate</span><span className="font-medium">92%</span></div>
               </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'form') {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
           <button onClick={() => setView('list')} className="flex items-center text-gray-500 hover:text-gray-900">
             <ChevronLeft className="h-5 w-5" /> {t.backToUniList}
           </button>
           <h2 className="text-2xl font-bold text-gray-900">{selectedUni ? t.editUniversity : t.addUniversity}</h2>
        </div>

        <form onSubmit={handleSave} className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
           <div className="p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t.uniName}</label>
                  <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required className="w-full border-gray-300 rounded-xl p-3 border focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t.uniType}</label>
                  <select value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value as any})} className="w-full border-gray-300 rounded-xl p-3 border focus:ring-2 focus:ring-blue-500 outline-none">
                    <option value="Public">Public</option>
                    <option value="Private">Private</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t.uniEstablished}</label>
                  <input type="number" value={formData.established} onChange={(e) => setFormData({...formData, established: parseInt(e.target.value)})} className="w-full border-gray-300 rounded-xl p-3 border focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t.uniLocation} (City, Country)</label>
                  <div className="grid grid-cols-3 gap-4">
                    <input type="text" placeholder="City" value={formData.location?.city} onChange={(e) => setFormData({...formData, location: { ...formData.location!, city: e.target.value }})} className="border-gray-300 rounded-xl p-3 border focus:ring-2 focus:ring-blue-500 outline-none" />
                    <input type="text" placeholder="State/Prov" value={formData.location?.state} onChange={(e) => setFormData({...formData, location: { ...formData.location!, state: e.target.value }})} className="border-gray-300 rounded-xl p-3 border focus:ring-2 focus:ring-blue-500 outline-none" />
                    <input type="text" placeholder="Country" value={formData.location?.country} onChange={(e) => setFormData({...formData, location: { ...formData.location!, country: e.target.value }})} className="border-gray-300 rounded-xl p-3 border focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                </div>
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">{t.uniRanking}</label>
                   <input type="text" placeholder="e.g. #14 in QS Rankings" value={formData.ranking} onChange={(e) => setFormData({...formData, ranking: e.target.value})} className="w-full border-gray-300 rounded-xl p-3 border" />
                </div>
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Numeric Ranking</label>
                   <input type="number" value={formData.worldRanking} onChange={(e) => setFormData({...formData, worldRanking: parseInt(e.target.value)})} className="w-full border-gray-300 rounded-xl p-3 border" />
                </div>
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">{t.uniLogo} URL</label>
                   <input type="text" value={formData.logo} onChange={(e) => setFormData({...formData, logo: e.target.value})} className="w-full border-gray-300 rounded-xl p-3 border" />
                </div>
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">{t.uniBanner} URL</label>
                   <input type="text" value={formData.banner} onChange={(e) => setFormData({...formData, banner: e.target.value})} className="w-full border-gray-300 rounded-xl p-3 border" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t.uniDescription}</label>
                <textarea rows={4} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full border-gray-300 rounded-xl p-3 border focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t.requirementGPA}</label>
                  <input type="text" value={formData.minGPA} onChange={(e) => setFormData({...formData, minGPA: e.target.value})} className="w-full border-gray-300 rounded-xl p-3 border" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t.requirementEnglish}</label>
                  <input type="text" value={formData.englishRequirement} onChange={(e) => setFormData({...formData, englishRequirement: e.target.value})} className="w-full border-gray-300 rounded-xl p-3 border" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t.uniTuition}</label>
                  <input type="text" value={formData.averageTuition} onChange={(e) => setFormData({...formData, averageTuition: e.target.value})} className="w-full border-gray-300 rounded-xl p-3 border" />
                </div>
              </div>

              <div className="border-t pt-8">
                 <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-gray-900 flex items-center"><BookOpen className="h-5 w-5 mr-2 text-blue-600" /> {t.uniPrograms}</h3>
                    <button type="button" onClick={handleProgramAdd} className="text-blue-600 text-sm font-bold flex items-center hover:text-blue-700"><Plus className="h-4 w-4 mr-1" /> {t.addProgram}</button>
                 </div>
                 <div className="space-y-4">
                    {formData.programs?.map((prog, i) => (
                      <div key={i} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-xl relative group">
                         <input type="text" placeholder={t.programName} value={prog.name} onChange={(e) => handleProgramChange(i, 'name', e.target.value)} className="border-gray-300 rounded-lg p-2 border text-sm" />
                         <input type="text" placeholder={t.programLevel} value={prog.level} onChange={(e) => handleProgramChange(i, 'level', e.target.value)} className="border-gray-300 rounded-lg p-2 border text-sm" />
                         <input type="text" placeholder={t.programTuition} value={prog.tuition} onChange={(e) => handleProgramChange(i, 'tuition', e.target.value)} className="border-gray-300 rounded-lg p-2 border text-sm" />
                         <input type="text" placeholder={t.programDuration} value={prog.duration} onChange={(e) => handleProgramChange(i, 'duration', e.target.value)} className="border-gray-300 rounded-lg p-2 border text-sm" />
                         <button type="button" onClick={() => setFormData(prev => ({ ...prev, programs: prev.programs?.filter((_, idx) => idx !== i) }))} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                           <Trash2 size={12} />
                         </button>
                      </div>
                    ))}
                 </div>
              </div>
           </div>

           <div className="bg-gray-50 p-6 flex justify-end">
              <button type="submit" className="bg-blue-600 text-white px-10 py-3 rounded-xl font-bold hover:bg-blue-700 shadow-lg transition-transform hover:scale-105 active:scale-95 flex items-center">
                <CheckCircle className="h-5 w-5 mr-2" /> {t.saveUniversity}
              </button>
           </div>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">{t.uniManagementTitle}</h2>
          <p className="text-gray-500">Manage, edit, and explore suggested global higher education institutions.</p>
        </div>
        <button onClick={handleAdd} className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 shadow-md transition-all active:scale-95">
          <Plus className="h-4 w-4 mr-2" /> {t.addUniversity}
        </button>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
           <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
           <input 
             type="text" 
             placeholder="Search name, city or country..." 
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
             className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
           />
        </div>
        <button 
           onClick={() => setShowFilterPanel(!showFilterPanel)}
           className={`flex items-center px-6 py-3 rounded-xl text-sm font-bold transition-all border ${showFilterPanel ? 'bg-blue-50 border-blue-600 text-blue-600' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'}`}
        >
          <Filter className="h-4 w-4 mr-2" />
          Filters {(filterCountry !== 'All' || filterType !== 'All' || filterRanking !== 'All') && ' (Active)'}
        </button>
      </div>

      {/* Filter Panel Expansion */}
      {showFilterPanel && (
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6 animate-in slide-in-from-top-4 duration-300">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Country</label>
            <select 
               value={filterCountry} 
               onChange={(e) => setFilterCountry(e.target.value)}
               className="w-full border-gray-300 rounded-xl p-2.5 border text-sm outline-none focus:ring-2 focus:ring-blue-500"
            >
               {countries.map(c => <option key={c} value={c}>{c === 'All' ? t.allCountries : c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Institution Type</label>
            <select 
               value={filterType} 
               onChange={(e) => setFilterType(e.target.value)}
               className="w-full border-gray-300 rounded-xl p-2.5 border text-sm outline-none focus:ring-2 focus:ring-blue-500"
            >
               <option value="All">{t.allTypes}</option>
               <option value="Public">Public</option>
               <option value="Private">Private</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">World Ranking</label>
            <select 
               value={filterRanking} 
               onChange={(e) => setFilterRanking(e.target.value)}
               className="w-full border-gray-300 rounded-xl p-2.5 border text-sm outline-none focus:ring-2 focus:ring-blue-500"
            >
               <option value="All">{t.rankingAll}</option>
               <option value="Top50">{t.rankingTop50}</option>
               <option value="Top100">{t.rankingTop100}</option>
            </select>
          </div>
          <div className="md:col-span-3 flex justify-end pt-2">
            <button onClick={resetFilters} className="text-sm font-bold text-red-500 hover:text-red-700 flex items-center">
              <X className="h-4 w-4 mr-1" /> Reset All
            </button>
          </div>
        </div>
      )}

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredUnis.map(uni => (
          <div key={uni.id} className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl border border-gray-100 transition-all duration-300 flex flex-col">
             <div className="h-48 relative overflow-hidden">
                <SafeImage src={uni.banner} alt={uni.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" iconSize={32} />
                <div className="absolute top-4 left-4 h-16 w-16 bg-white rounded-2xl p-2 shadow-lg flex items-center justify-center overflow-hidden">
                   <SafeImage src={uni.logo} alt="Logo" className="w-full h-full object-contain" />
                </div>
                <div className="absolute top-4 right-4 flex space-x-2">
                   <button onClick={(e) => { e.stopPropagation(); handleEdit(uni); }} className="bg-white/90 backdrop-blur p-2 rounded-xl text-gray-700 hover:text-blue-600 shadow-sm transition-colors">
                      <Edit3 size={18} />
                   </button>
                   <button onClick={(e) => { e.stopPropagation(); handleDelete(uni.id); }} className="bg-white/90 backdrop-blur p-2 rounded-xl text-gray-700 hover:text-red-600 shadow-sm transition-colors">
                      <Trash2 size={18} />
                   </button>
                </div>
                <div className="absolute bottom-4 left-4">
                   <span className="bg-blue-600/90 backdrop-blur text-white px-3 py-1 rounded-lg text-xs font-bold flex items-center">
                     <Target className="h-3 w-3 mr-1" /> Ranking #{uni.worldRanking}
                   </span>
                </div>
             </div>
             <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 line-clamp-1">{uni.name}</h3>
                    <p className="text-sm text-gray-500 flex items-center mt-1"><MapPin className="h-3 w-3 mr-1" /> {uni.location.city}, {uni.location.country}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${uni.type === 'Private' ? 'bg-indigo-100 text-indigo-700' : 'bg-amber-100 text-amber-700'}`}>
                    {uni.type}
                  </span>
                </div>
                <p className="text-gray-600 text-sm line-clamp-2 mb-6 leading-relaxed">{uni.description}</p>
                <div className="mt-auto pt-6 border-t border-gray-50 grid grid-cols-2 gap-4">
                   <div className="text-center">
                      <p className="text-xs text-gray-400 font-medium uppercase tracking-tighter">ESTABLISHED</p>
                      <p className="text-sm font-bold text-gray-800">{uni.established}</p>
                   </div>
                   <div className="text-center border-l border-gray-50">
                      <p className="text-xs text-gray-400 font-medium uppercase tracking-tighter">GPA REQ.</p>
                      <p className="text-sm font-bold text-gray-800">{uni.minGPA}+</p>
                   </div>
                </div>
                <button onClick={() => handleViewDetails(uni)} className="w-full mt-6 py-3 bg-gray-50 group-hover:bg-blue-600 text-gray-700 group-hover:text-white rounded-2xl text-sm font-bold transition-all duration-300 flex items-center justify-center">
                  View Full Profile <ChevronLeft className="h-4 w-4 ml-2 rotate-180" />
                </button>
             </div>
          </div>
        ))}
      </div>
      
      {filteredUnis.length === 0 && (
        <div className="py-20 text-center bg-white rounded-3xl border-2 border-dashed border-gray-100">
           <Layout className="h-16 w-16 mx-auto mb-4 text-gray-200" />
           <p className="text-gray-400 font-medium">No universities found matching your filters.</p>
           <button onClick={resetFilters} className="mt-4 text-blue-600 font-bold hover:underline">Clear all filters</button>
        </div>
      )}
    </div>
  );
};

export default UniversityManagement;

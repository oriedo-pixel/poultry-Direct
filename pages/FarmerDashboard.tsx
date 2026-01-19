
import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  TrendingUp, 
  Zap,
  Syringe,
  Calendar,
  CheckCircle2,
  X,
  Loader2,
  ShieldCheck,
  History,
  Trash2,
  BookOpen
} from 'lucide-react';
import { MOCK_PRODUCTS } from '../mockData';
import { getDailyTip, generateVaccineSchedule } from '../services/geminiService';
import { User, VaccineReminder } from '../types';

// Standard poultry vaccination guide
const STANDARD_VACCINES = [
  { name: "Marek’s Disease", timing: "Day 1 (Hatchery)", method: "Injection", importance: "Prevents paralysis and tumors; must be given at hatch." },
  { name: "Newcastle Disease (ND)", timing: "Day 7, 21, and boosters", method: "Eye drop / Water", importance: "Prevents sudden death and twisted necks. Highly contagious." },
  { name: "Gumboro (IBD)", timing: "Day 10–14 & Day 24", method: "Drinking water", importance: "Protects the immune system. Failure leads to high mortality." },
  { name: "Infectious Bronchitis (IB)", timing: "Often with ND", method: "Eye drop / Spray", importance: "Prevents gasping, coughing, and poor egg quality." },
  { name: "Fowl Pox", timing: "Week 6–8", method: "Wing web stab", importance: "Prevents wart-like scabs on combs and wattles." },
];

const FarmerDashboard: React.FC<{ farmer: User }> = ({ farmer }) => {
  const [dailyTip, setDailyTip] = useState('Loading daily farming tip...');
  const [reminders, setReminders] = useState<VaccineReminder[]>(() => {
    const saved = localStorage.getItem(`reminders_${farmer.id}`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  const [isAddingSchedule, setIsAddingSchedule] = useState(false);
  const [isAddingManual, setIsAddingManual] = useState(false);
  const [loadingSchedule, setLoadingSchedule] = useState(false);
  
  // AI Schedule Form
  const [birdType, setBirdType] = useState('Layers');
  const [birdAge, setBirdAge] = useState(1);

  // Manual Entry Form
  const [manualEntry, setManualEntry] = useState({
    birdType: 'Layers',
    vaccineName: '',
    date: new Date().toISOString().split('T')[0],
    ageWeek: 1,
    method: '',
    importance: ''
  });

  useEffect(() => {
    getDailyTip().then(setDailyTip);
  }, []);

  useEffect(() => {
    localStorage.setItem(`reminders_${farmer.id}`, JSON.stringify(reminders));
  }, [reminders, farmer.id]);

  const loadStandardSchedule = () => {
    const newReminders: VaccineReminder[] = STANDARD_VACCINES.map((v, idx) => ({
      id: `std-${Date.now()}-${idx}`,
      birdType: 'General Poultry',
      vaccineName: v.name,
      scheduledDate: v.timing,
      status: 'PENDING',
      ageWeek: 0,
      description: `Method: ${v.method} | Importance: ${v.importance}`
    }));
    setReminders(prev => [...newReminders, ...prev]);
  };

  const handleCreateSchedule = async () => {
    setLoadingSchedule(true);
    try {
      const schedule = await generateVaccineSchedule(birdType, birdAge);
      
      const newReminders: VaccineReminder[] = schedule.map((item: any, idx: number) => ({
        id: `ai-${Date.now()}-${idx}`,
        birdType: birdType,
        vaccineName: item.vaccineName,
        scheduledDate: `Week ${item.scheduledAgeWeeks}`,
        status: 'PENDING',
        ageWeek: item.scheduledAgeWeeks,
        description: item.description
      }));

      setReminders(prev => [...newReminders, ...prev]);
    } catch (error) {
      console.error("Failed to generate schedule", error);
    } finally {
      setLoadingSchedule(false);
      setIsAddingSchedule(false);
    }
  };

  const handleManualAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualEntry.vaccineName) return;

    const newReminder: VaccineReminder = {
      id: `manual-${Date.now()}`,
      birdType: manualEntry.birdType,
      vaccineName: manualEntry.vaccineName,
      scheduledDate: manualEntry.date,
      status: 'PENDING',
      ageWeek: manualEntry.ageWeek,
      description: `Method: ${manualEntry.method} | Importance: ${manualEntry.importance}`
    };

    setReminders(prev => [newReminder, ...prev]);
    setIsAddingManual(false);
    setManualEntry({
      birdType: 'Layers',
      vaccineName: '',
      date: new Date().toISOString().split('T')[0],
      ageWeek: 1,
      method: '',
      importance: ''
    });
  };

  const toggleReminder = (id: string) => {
    setReminders(prev => prev.map(r => 
      r.id === id ? { ...r, status: r.status === 'PENDING' ? 'COMPLETED' : 'PENDING' } : r
    ));
  };

  const deleteReminder = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setReminders(prev => prev.filter(r => r.id !== id));
  };

  const clearHistory = () => {
    setReminders(prev => prev.filter(r => r.status !== 'COMPLETED'));
  };

  const farmerProducts = MOCK_PRODUCTS.filter(p => p.farmerId === farmer.id);
  const pendingReminders = reminders.filter(r => r.status === 'PENDING');
  const completedReminders = reminders.filter(r => r.status === 'COMPLETED');

  return (
    <div className="p-4 space-y-6">
      {/* Welcome Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Hello, {farmer.name.split(' ')[0]}!</h1>
          <p className="text-gray-500 text-sm">{farmer.farmName}</p>
        </div>
        <div className="w-12 h-12 bg-green-100 rounded-full border-2 border-white shadow-sm flex items-center justify-center">
          <TrendingUp className="text-green-600 w-6 h-6" />
        </div>
      </div>

      {/* AI Daily Tip */}
      <div className="bg-gradient-to-br from-green-600 to-green-700 text-white p-4 rounded-2xl shadow-lg relative overflow-hidden">
        <div className="flex items-center gap-2 mb-2">
          <Zap className="w-4 h-4 fill-white" />
          <span className="text-[10px] font-bold uppercase tracking-wider">Daily AI Insights</span>
        </div>
        <p className="text-sm font-medium leading-relaxed italic">{dailyTip}</p>
        <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
      </div>

      {/* Health Tracker Section */}
      <section className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-red-500" />
            <h2 className="font-bold text-gray-800">Health Tracker</h2>
          </div>
          <div className="flex gap-1.5">
            <button 
              onClick={loadStandardSchedule}
              className="text-[10px] text-green-700 font-bold bg-green-50 px-2 py-1 rounded-md flex items-center gap-1 border border-green-100 whitespace-nowrap"
            >
              Standard Plan
            </button>
            <button 
              onClick={() => setIsAddingManual(true)}
              className="p-1 text-gray-500 bg-gray-50 rounded-lg"
            >
              <Plus className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setIsAddingSchedule(true)}
              className="text-[10px] text-blue-600 font-bold bg-blue-50 px-2 py-1 rounded-md flex items-center gap-1 border border-blue-100 whitespace-nowrap"
            >
              <Zap className="w-3 h-3" />
              AI Planner
            </button>
          </div>
        </div>

        <div className="space-y-6 max-h-[500px] overflow-y-auto pr-1 scrollbar-hide">
          {/* Pending Tasks */}
          <div className="space-y-3">
            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
              <Calendar className="w-3 h-3" /> Upcoming Tasks
            </h3>
            {pendingReminders.length === 0 && (
              <div className="text-center py-6 border border-dashed border-gray-100 rounded-xl">
                 <p className="text-xs text-gray-400 mb-2">No pending vaccination tasks.</p>
                 <button onClick={loadStandardSchedule} className="text-green-600 text-[10px] font-bold bg-green-50 px-3 py-1.5 rounded-full border border-green-100 transition active:scale-95">Populate Tasks</button>
              </div>
            )}
            {pendingReminders.map(reminder => (
              <div 
                key={reminder.id} 
                onClick={() => toggleReminder(reminder.id)}
                className="group flex items-start gap-3 p-3 rounded-xl border border-red-50 bg-white hover:border-red-200 transition-all cursor-pointer relative"
              >
                <div className="mt-1 w-10 h-10 rounded-lg bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                  <Syringe className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h4 className="text-sm font-bold text-gray-800 truncate">
                      {reminder.vaccineName}
                    </h4>
                    <button onClick={(e) => deleteReminder(reminder.id, e)} className="p-1 text-gray-300 hover:text-red-500">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                  <p className="text-[10px] text-gray-500 mt-0.5 font-medium">{reminder.birdType} • {reminder.scheduledDate}</p>
                  <p className="text-[10px] text-gray-400 mt-1 line-clamp-1 italic">{reminder.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Completed History */}
          {completedReminders.length > 0 && (
            <div className="space-y-3 pt-4 border-t border-gray-50">
              <div className="flex justify-between items-center">
                <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <History className="w-3 h-3" /> Completed History
                </h3>
                <button 
                  onClick={clearHistory}
                  className="flex items-center gap-1 text-[10px] font-bold text-red-400 hover:text-red-500 transition"
                >
                  <Trash2 className="w-3 h-3" /> Clear All
                </button>
              </div>
              <div className="space-y-2">
                {completedReminders.map(reminder => (
                  <div 
                    key={reminder.id} 
                    onClick={() => toggleReminder(reminder.id)}
                    className="flex items-center gap-3 p-2 rounded-lg border border-gray-100 bg-gray-50/50 opacity-60 hover:opacity-100 transition-all cursor-pointer group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-gray-400 line-through truncate">
                        {reminder.vaccineName}
                      </h4>
                      <p className="text-[9px] text-gray-400">{reminder.scheduledDate}</p>
                    </div>
                    <button 
                      onClick={(e) => deleteReminder(reminder.id, e)}
                      className="p-1 text-gray-200 group-hover:text-red-300"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Vaccination Reference Guide Table */}
      <section className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="w-5 h-5 text-green-600" />
          <h2 className="font-bold text-gray-800">Vaccination Reference Guide</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="py-2.5 px-3 font-bold text-gray-400 text-[10px] uppercase tracking-wider">Vaccine Name</th>
                <th className="py-2.5 px-3 font-bold text-gray-400 text-[10px] uppercase tracking-wider">Timing</th>
                <th className="py-2.5 px-3 font-bold text-gray-400 text-[10px] uppercase tracking-wider">Method</th>
                <th className="py-2.5 px-3 font-bold text-gray-400 text-[10px] uppercase tracking-wider">Importance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {STANDARD_VACCINES.map((v, i) => (
                <tr key={i} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-3 font-bold text-gray-800 text-xs">{v.name}</td>
                  <td className="py-3 px-3 text-xs text-gray-600 whitespace-nowrap">{v.timing}</td>
                  <td className="py-3 px-3 text-xs text-gray-600">
                    <span className="bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded text-[10px] font-bold whitespace-nowrap">{v.method}</span>
                  </td>
                  <td className="py-3 px-3 text-xs text-gray-500 leading-tight min-w-[150px]">{v.importance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-[9px] text-gray-400 mt-3 text-center italic">
          * Always consult your local avian veterinarian or agricultural extension officer for regional specifics.
        </p>
      </section>

      {/* Product Management Section */}
      <section className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-gray-800">My Listings</h2>
          <button className="text-green-600 text-xs font-bold flex items-center gap-1">
            <Plus className="w-3 h-3" /> Add New
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {farmerProducts.map(p => (
            <div key={p.id} className="p-3 border border-gray-100 rounded-xl bg-gray-50">
              <div className="w-full aspect-square rounded-lg overflow-hidden mb-2">
                <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
              </div>
              <h4 className="text-xs font-bold text-gray-800 truncate">{p.name}</h4>
              <p className="text-[10px] text-gray-500">Stock: {p.stock}</p>
              <p className="text-xs font-bold text-green-700 mt-1">KES {p.price}</p>
            </div>
          ))}
        </div>
      </section>

      {/* AI Health Planner Modal */}
      {isAddingSchedule && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-lg">AI Health Planner</h3>
              <button onClick={() => setIsAddingSchedule(false)} className="p-1 hover:bg-gray-100 rounded-full transition"><X className="w-6 h-6 text-gray-400" /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Bird Type</label>
                <select 
                  value={birdType}
                  onChange={(e) => setBirdType(e.target.value)}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option>Layers</option>
                  <option>Broilers</option>
                  <option>Kienyeji</option>
                  <option>Turkeys</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Current Age (Weeks)</label>
                <input 
                  type="number"
                  min="0"
                  value={birdAge}
                  onChange={(e) => setBirdAge(parseInt(e.target.value) || 0)}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button 
                onClick={handleCreateSchedule}
                disabled={loadingSchedule}
                className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-blue-700 transition disabled:opacity-50"
              >
                {loadingSchedule ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
                Generate Smart Plan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manual Task Modal */}
      {isAddingManual && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-lg">New Vaccination Task</h3>
              <button onClick={() => setIsAddingManual(false)} className="p-1 hover:bg-gray-100 rounded-full transition"><X className="w-6 h-6 text-gray-400" /></button>
            </div>
            <form onSubmit={handleManualAdd} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Vaccine Name</label>
                <input 
                  type="text" 
                  placeholder="e.g., Newcastle Booster" 
                  required
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl mt-1 focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={manualEntry.vaccineName}
                  onChange={e => setManualEntry({...manualEntry, vaccineName: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase">Date</label>
                  <input 
                    type="date"
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl mt-1 text-sm"
                    value={manualEntry.date}
                    onChange={e => setManualEntry({...manualEntry, date: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase">Age (Wks)</label>
                  <input 
                    type="number"
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl mt-1 text-sm"
                    value={manualEntry.ageWeek}
                    onChange={e => setManualEntry({...manualEntry, ageWeek: parseInt(e.target.value) || 0})}
                  />
                </div>
              </div>
              <button type="submit" className="w-full py-3 bg-green-600 text-white font-bold rounded-xl shadow-lg hover:bg-green-700 transition">
                Save Task
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FarmerDashboard;

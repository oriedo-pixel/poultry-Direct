
import React, { useState } from 'react';
import { 
  CloudSun, 
  Stethoscope, 
  BookOpen, 
  Droplet, 
  Thermometer, 
  Search,
  Sparkles,
  Loader2
} from 'lucide-react';
import { diagnoseDisease } from '../services/geminiService';

const Resources: React.FC = () => {
  const [symptoms, setSymptoms] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [loading, setLoading] = useState(false);

  const handleDiagnose = async () => {
    if (!symptoms.trim()) return;
    setLoading(true);
    const result = await diagnoseDisease(symptoms);
    setDiagnosis(result);
    setLoading(false);
  };

  return (
    <div className="p-4 space-y-8">
      {/* Weather Forecast */}
      <section>
        <h2 className="text-xl font-bold mb-4">Farm Weather</h2>
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-5 text-white shadow-lg">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm opacity-80">Nairobi, Kenya</p>
              <p className="text-4xl font-bold mt-1">24°C</p>
              <p className="text-sm font-medium mt-1">Partly Cloudy</p>
            </div>
            <CloudSun className="w-16 h-16 text-yellow-300" />
          </div>
          <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-white/20">
            <div className="flex flex-col items-center gap-1">
              <Droplet className="w-4 h-4 opacity-70" />
              <span className="text-[10px] opacity-70">Humidity</span>
              <span className="text-sm font-bold">62%</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Thermometer className="w-4 h-4 opacity-70" />
              <span className="text-[10px] opacity-70">Wind</span>
              <span className="text-sm font-bold">12km/h</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <CloudSun className="w-4 h-4 opacity-70" />
              <span className="text-[10px] opacity-70">UV Index</span>
              <span className="text-sm font-bold">High</span>
            </div>
          </div>
        </div>
      </section>

      {/* AI Disease Checker */}
      <section className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-red-50 text-red-500 rounded-xl flex items-center justify-center">
            <Stethoscope className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-bold text-gray-900">AI Disease Checker</h2>
            <p className="text-xs text-gray-500">Analyze symptoms instantly</p>
          </div>
        </div>
        
        <textarea
          placeholder="Describe what's wrong with your birds (e.g., coughing, reduced egg production, swelling...)"
          className="w-full min-h-[100px] p-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-50"
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
        />
        
        <button 
          onClick={handleDiagnose}
          disabled={loading || !symptoms}
          className="w-full py-3 bg-red-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 hover:bg-red-700 transition"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
          Run AI Diagnosis
        </button>

        {diagnosis && (
          <div className="mt-4 p-4 bg-orange-50 border border-orange-100 rounded-xl">
            <div className="flex items-center gap-2 text-orange-800 font-bold text-sm mb-2">
              <Sparkles className="w-4 h-4" />
              AI Analysis Result
            </div>
            <div className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
              {diagnosis}
            </div>
            <p className="text-[10px] text-gray-400 mt-4 italic">Note: This is an AI tool and not a replacement for a professional veterinarian.</p>
          </div>
        )}
      </section>

      {/* Educational Hub */}
      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Knowledge Hub</h2>
          <button className="text-green-600 font-bold text-sm">View all</button>
        </div>
        
        <div className="space-y-4">
          {[
            { title: "The Ultimate Guide to Brooding Success", read: "5 min read", img: "https://picsum.photos/seed/brood/400/200" },
            { title: "Natural Alternatives to Synthetic Growth Boosters", read: "8 min read", img: "https://picsum.photos/seed/feed/400/200" }
          ].map((article, i) => (
            <div key={i} className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
              <img src={article.img} alt="article" className="w-full h-32 object-cover" />
              <div className="p-4">
                <h3 className="font-bold text-gray-900 mb-1">{article.title}</h3>
                <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                  <BookOpen className="w-3 h-3" />
                  <span>{article.read}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Vendor Directory */}
      <section className="bg-gray-900 rounded-2xl p-5 text-white shadow-xl">
        <h2 className="text-lg font-bold mb-2">Find Supplies</h2>
        <p className="text-xs text-gray-400 mb-4">Connect with trusted vendors for feed, medicine, and equipment.</p>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search local vendors..."
            className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-sm focus:outline-none focus:bg-white/20"
          />
        </div>
        <div className="flex gap-4 mt-6">
          <div className="text-center flex-1">
            <div className="w-full aspect-square bg-white/10 rounded-xl flex items-center justify-center mb-1">🏥</div>
            <span className="text-[10px] font-medium opacity-80">Drugs</span>
          </div>
          <div className="text-center flex-1">
            <div className="w-full aspect-square bg-white/10 rounded-xl flex items-center justify-center mb-1">🌾</div>
            <span className="text-[10px] font-medium opacity-80">Feed</span>
          </div>
          <div className="text-center flex-1">
            <div className="w-full aspect-square bg-white/10 rounded-xl flex items-center justify-center mb-1">🐣</div>
            <span className="text-[10px] font-medium opacity-80">Chicks</span>
          </div>
          <div className="text-center flex-1">
            <div className="w-full aspect-square bg-white/10 rounded-xl flex items-center justify-center mb-1">🛠️</div>
            <span className="text-[10px] font-medium opacity-80">Tools</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Resources;

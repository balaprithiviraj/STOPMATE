import { Settings, Map, Battery, Share2, ChevronRight, Activity, Instagram } from 'lucide-react';

export default function ProfilePage() {
  return (
    <div className="min-h-full bg-[#050505] p-4 pt-8 pb-20">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Profile
        </h1>
        <button className="text-gray-400 hover:text-white transition-colors">
          <Settings size={24} />
        </button>
      </div>

      {/* Stats Dashboard */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <StatCard title="Total Trips" value="142" icon={<Map size={18} />} />
        <StatCard title="Stops Saved" value="38" icon={<Activity size={18} />} />
        <div className="col-span-2 bg-[#111] border border-white/10 rounded-2xl p-5 flex items-center justify-between shadow-lg">
          <div>
            <h3 className="text-gray-400 text-sm mb-1 font-medium">Distance Traveled</h3>
            <p className="text-3xl font-bold text-white">1,240 <span className="text-base font-medium text-gray-500">km</span></p>
          </div>
          <div className="h-14 w-14 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 border border-blue-500/20">
            <Map size={28} />
          </div>
        </div>
      </div>

      {/* Social Flex */}
      <div className="bg-gradient-to-br from-pink-600/20 via-purple-600/20 to-blue-600/20 border border-purple-500/30 rounded-3xl p-6 mb-8 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity duration-500">
          <Instagram size={120} className="rotate-12 transform translate-x-4 -translate-y-4" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 via-purple-500/10 to-blue-500/10 opacity-50"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <Instagram size={20} className="text-pink-400" />
            <h3 className="text-white font-bold text-lg">Flex Your Journey</h3>
          </div>
          <p className="text-sm text-gray-300 mb-6 max-w-[85%] leading-relaxed">
            Generate a branded, futuristic summary of your travel milestones optimized for Instagram Stories.
          </p>
          <button className="bg-white text-black px-5 py-3 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-gray-100 transition-colors shadow-lg">
            <Share2 size={16} />
            Generate Story
          </button>
        </div>
      </div>

      {/* Settings */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-white mb-4">App Optimization</h3>
        
        <SettingRow 
          icon={<Battery className="text-green-500" />} 
          title="Battery Saver Mode" 
          description="Reduces GPS polling frequency"
          toggle
        />
        <SettingRow 
          icon={<Map className="text-blue-500" />} 
          title="Location Accuracy" 
          description="High accuracy (consumes more power)"
          toggle
          defaultOn
        />
      </div>
    </div>
  );
}

function StatCard({ title, value, icon }: { title: string, value: string, icon: React.ReactNode }) {
  return (
    <div className="bg-[#111] border border-white/5 rounded-2xl p-5 hover:bg-[#151515] transition-colors">
      <div className="text-blue-500 mb-3 bg-blue-500/10 w-8 h-8 rounded-lg flex items-center justify-center">{icon}</div>
      <p className="text-2xl font-bold text-white mb-1">{value}</p>
      <p className="text-xs font-medium text-gray-400">{title}</p>
    </div>
  );
}

function SettingRow({ icon, title, description, toggle, defaultOn = false }: { icon: React.ReactNode, title: string, description: string, toggle?: boolean, defaultOn?: boolean }) {
  return (
    <div className="bg-[#111] border border-white/5 rounded-2xl p-4 flex items-center justify-between hover:bg-[#151515] transition-colors cursor-pointer">
      <div className="flex items-center gap-4">
        <div className="p-2.5 bg-white/5 rounded-xl border border-white/10">
          {icon}
        </div>
        <div>
          <h4 className="text-white font-medium text-sm mb-0.5">{title}</h4>
          <p className="text-xs text-gray-500">{description}</p>
        </div>
      </div>
      {toggle ? (
        <div className={`w-12 h-7 rounded-full p-1 transition-colors duration-300 ${defaultOn ? 'bg-blue-500' : 'bg-gray-800'}`}>
          <div className={`w-5 h-5 bg-white rounded-full transition-transform duration-300 shadow-sm ${defaultOn ? 'translate-x-5' : 'translate-x-0'}`} />
        </div>
      ) : (
        <ChevronRight className="text-gray-500" size={20} />
      )}
    </div>
  );
}

import { useState } from 'react';
import { Search, Bus, Train, Bike, Users, Navigation } from 'lucide-react';
import { motion } from 'framer-motion';

const MOCK_ROUTES = [
  { id: 1, type: 'bus', title: 'Bus 45A', status: 'Live', users: 12, eta: '5 mins' },
  { id: 2, type: 'bus', title: 'Bus 12B', status: 'Ended', users: 0, eta: '--' },
  { id: 3, type: 'train', title: 'Metro Blue Line', status: 'Live', users: 45, eta: '2 mins' },
  { id: 4, type: 'train', title: 'Express Train 90', status: 'Live', users: 120, eta: '15 mins' },
  { id: 5, type: 'bike', title: 'Downtown Cycling Group', status: 'Live', users: 8, eta: '10 mins' },
];

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState<'bus' | 'train' | 'bike'>('bus');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRoutes = MOCK_ROUTES.filter(route => 
    route.type === activeTab && 
    route.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-full bg-[#050505] p-4 pt-8 pb-20">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Community Live
        </h1>
        <p className="text-sm text-[#888] mt-1">Crowdsourced real-time transport tracking</p>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input 
          type="text" 
          placeholder="Search route (e.g. Bus 45A)" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-white placeholder:text-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
        />
      </div>

      <div className="grid grid-cols-3 gap-3 mb-8">
        <TransportMode 
          icon={<Bus />} 
          label="Bus" 
          active={activeTab === 'bus'} 
          onClick={() => setActiveTab('bus')}
        />
        <TransportMode 
          icon={<Train />} 
          label="Train" 
          active={activeTab === 'train'} 
          onClick={() => setActiveTab('train')}
        />
        <TransportMode 
          icon={<Bike />} 
          label="Bike" 
          active={activeTab === 'bike'} 
          onClick={() => setActiveTab('bike')}
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-white">Active Routes Nearby</h3>
          <span className="text-xs font-semibold text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-full">
            {filteredRoutes.length} found
          </span>
        </div>
        
        {filteredRoutes.length > 0 ? (
          filteredRoutes.map(route => (
            <RouteCard key={route.id} {...route} />
          ))
        ) : (
          <div className="text-center py-12 text-gray-500">
            <Navigation className="mx-auto mb-4 opacity-20" size={32} />
            <p className="text-sm">No active routes found for your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function TransportMode({ icon, label, active = false, onClick }: { icon: React.ReactNode, label: string, active?: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all duration-300 ${
        active 
          ? 'bg-blue-600/10 border-blue-500/50 text-blue-400' 
          : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10'
      }`}
    >
      <div className={`mb-2 ${active ? 'scale-110' : ''} transition-transform`}>{icon}</div>
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
}

function RouteCard({ title, status, users, eta }: { title: string, status: string, users: number, eta: string }) {
  const isLive = status === 'Live';
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#111] border border-white/5 rounded-2xl p-5 flex items-center justify-between hover:bg-[#151515] transition-colors"
    >
      <div>
        <div className="flex items-center gap-2 mb-2">
          <h4 className="text-white font-semibold text-base">{title}</h4>
          {isLive && (
            <span className="flex h-2 w-2 relative ml-1">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 text-xs font-medium text-gray-400">
          <span className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-md text-gray-300">
            <Users size={12} /> {users} sharing
          </span>
          <span className="text-gray-600">•</span>
          <span className="text-gray-400">ETA: {eta}</span>
        </div>
      </div>
      <button className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
        isLive 
          ? 'bg-white text-black hover:bg-gray-200' 
          : 'bg-white/5 text-gray-500 cursor-not-allowed'
      }`}>
        Join
      </button>
    </motion.div>
  );
}

import { Shield, Plus, Link as LinkIcon, UserX, ShieldCheck } from 'lucide-react';

export default function GuardianPage() {
  return (
    <div className="min-h-full bg-[#050505] p-4 pt-8 pb-20">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <ShieldCheck size={28} className="text-blue-500" />
          Guardian Mode
        </h1>
        <p className="text-sm text-[#888] mt-1">Share your live journey securely</p>
      </div>

      <div className="bg-[#111] border border-white/10 rounded-3xl p-6 mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"></div>
        
        <div className="flex items-center gap-4 mb-6 relative z-10">
          <div className="p-3.5 bg-blue-500/10 rounded-2xl text-blue-500 border border-blue-500/20">
            <Shield size={28} />
          </div>
          <div>
            <h3 className="text-white font-bold text-lg">Active Protection</h3>
            <p className="text-xs text-blue-400/80 font-medium">End-to-end encrypted sharing</p>
          </div>
        </div>
        
        <button className="w-full py-4 bg-blue-600 text-white font-semibold text-base rounded-2xl flex items-center justify-center gap-2 hover:bg-blue-500 transition-colors shadow-lg shadow-blue-600/20 relative z-10">
          <LinkIcon size={20} />
          Share Live Tracking Link
        </button>
        
        <p className="text-xs text-center text-gray-400 mt-4 relative z-10">
          Guardians can view your journey in any web browser. <br/>No app required.
        </p>
      </div>

      <div>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-semibold text-white">Trusted Contacts <span className="text-blue-500 text-sm ml-1">(2/5)</span></h3>
        </div>

        <div className="space-y-3">
          <ContactCard name="Mom" phone="+1 234 567 8900" />
          <ContactCard name="Alex (Roommate)" phone="+1 987 654 3210" />
          
          <button className="w-full py-5 border border-dashed border-white/20 rounded-2xl text-gray-400 flex items-center justify-center gap-2 hover:border-white/40 hover:text-white hover:bg-white/5 transition-all">
            <Plus size={20} />
            <span className="font-medium">Add Trusted Contact</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function ContactCard({ name, phone }: { name: string, phone: string }) {
  return (
    <div className="bg-[#111] border border-white/5 rounded-2xl p-4 flex items-center justify-between hover:bg-[#151515] transition-colors group">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white font-bold text-sm border border-white/10">
          {name.charAt(0)}
        </div>
        <div>
          <h4 className="text-white font-medium">{name}</h4>
          <p className="text-xs text-gray-400">{phone}</p>
        </div>
      </div>
      <button className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all">
        <UserX size={18} />
      </button>
    </div>
  );
}

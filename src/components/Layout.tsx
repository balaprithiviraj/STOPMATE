import { Outlet, NavLink } from 'react-router-dom';
import { MapPin, Users, Shield, AlertCircle, User } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Layout() {
  return (
    <div className="flex flex-col h-screen bg-[#050505] text-white overflow-hidden font-sans">
      <main className="flex-1 overflow-y-auto relative">
        <Outlet />
      </main>
      
      <nav className="bg-[#0a0a0a]/80 backdrop-blur-2xl border-t border-white/5 pb-safe relative z-50">
        <div className="flex justify-around items-center h-[72px] px-2">
          <NavItem to="/" icon={<MapPin size={24} strokeWidth={2} />} label="Alarm" />
          <NavItem to="/community" icon={<Users size={24} strokeWidth={2} />} label="Community" />
          <NavItem to="/guardian" icon={<Shield size={24} strokeWidth={2} />} label="Guardian" />
          <NavItem to="/sos" icon={<AlertCircle size={24} strokeWidth={2.5} />} label="SOS" className="text-red-500 hover:text-red-400" activeClassName="text-red-500" />
          <NavItem to="/profile" icon={<User size={24} strokeWidth={2} />} label="Profile" />
        </div>
      </nav>
    </div>
  );
}

function NavItem({ to, icon, label, className, activeClassName = "text-white" }: { to: string; icon: React.ReactNode; label: string; className?: string; activeClassName?: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "flex flex-col items-center justify-center w-full h-full space-y-1.5 transition-all duration-300",
          isActive ? activeClassName : "text-[#666666] hover:text-[#999999]",
          className
        )
      }
    >
      {icon}
      <span className="text-[10px] font-medium tracking-wide">{label}</span>
    </NavLink>
  );
}

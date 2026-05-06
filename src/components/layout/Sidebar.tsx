import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Users, MessageCircle, Rocket, 
  UploadCloud, Search, Link, Bot, Plug, 
  CalendarDays, Bell, BarChart3, CreditCard, 
  Settings, UserCog, LogOut, ChevronLeft, ChevronRight,
  Bird, User
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useOrganization } from '../../contexts/OrganizationContext';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (v: boolean) => void;
}

const menuItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/leads', label: 'Leads', icon: Users },
  { path: '/conversations', label: 'Conversas', icon: MessageCircle },
  { path: '/campaigns', label: 'Disparos', icon: Rocket },
  { path: '/kb-upload', label: 'Base de Conhecimento', icon: UploadCloud },
  { path: '/kb-search', label: 'Consulta da Base', icon: Search },
  { path: '/channels', label: 'Canais & Webhooks', icon: Link },
  { path: '/agents', label: 'Agentes', icon: Bot },
  { path: '/integrations', label: 'Integrações', icon: Plug },
  { path: '/calendar', label: 'Calendário', icon: CalendarDays },
  { path: '/notifications', label: 'Notificações', icon: Bell },
  { path: '/reports', label: 'Relatórios', icon: BarChart3 },
  { path: '/billing', label: 'Extrato', icon: CreditCard },
  { path: '/users', label: 'Equipe', icon: UserCog },
];

export function Sidebar({ isCollapsed, setIsCollapsed }: SidebarProps) {
  const navigate = useNavigate();
  const { userProfile, loading } = useOrganization();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <aside className={cn(
      "relative flex flex-col border-r border-[#75AB61]/20 bg-[#1A1A2E]/80 backdrop-blur-xl transition-all duration-300",
      isCollapsed ? "w-20" : "w-64"
    )}>
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-1/2 -translate-y-1/2 flex h-6 w-6 items-center justify-center rounded-full border border-[#75AB61]/30 bg-[#1A1A2E] text-slate-300 hover:text-white z-10"
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      <div className="flex h-16 items-center justify-center border-b border-[#75AB61]/20 px-4">
        <div className="flex items-center justify-center w-full h-full">
          {isCollapsed ? (
            <img src="https://raw.githubusercontent.com/synapiens/uteis/refs/heads/main/LogoHermes/logo_hermes.png" alt="Hermes Nexus" className="h-8 object-contain" />
          ) : (
            <img src="https://raw.githubusercontent.com/synapiens/uteis/refs/heads/main/LogoHermes/logo_hermes_nexus_negat.png" alt="Hermes Nexus" className="h-8 object-contain" />
          )}
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 scrollbar-hide">
        <ul className="space-y-1 px-3">
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) => cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-[#75AB61]/10 text-white border border-[#75AB61]/20" 
                    : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
                )}
                title={isCollapsed ? item.label : undefined}
              >
                <item.icon size={20} className={cn("shrink-0", ({isActive}: any) => isActive ? "text-[#75AB61]" : "")} />
                {!isCollapsed && <span className="truncate">{item.label}</span>}
                {item.path === '/agents' && (
                  <span className="absolute right-4 flex h-2 w-2 rounded-full bg-[#75AB61] animate-pulse"></span>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="border-t border-[#75AB61]/20 p-4">
        <div 
          onClick={() => navigate('/profile')}
          className={cn("flex items-center cursor-pointer group", isCollapsed ? "justify-center" : "gap-3")}
        >
          <div className="h-10 w-10 shrink-0 rounded-full bg-slate-700 overflow-hidden border-2 border-[#75AB61]/50 group-hover:border-[#75AB61] transition-colors flex items-center justify-center">
            {userProfile?.avatar_url ? (
              <img src={userProfile.avatar_url} alt="User" className="h-full w-full object-cover" />
            ) : (
              <User size={18} className="text-slate-400" />
            )}
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-bold text-white group-hover:text-[#75AB61] transition-colors leading-tight">
                {userProfile?.name || user?.email?.split('@')[0] || 'Usuário'}
              </p>
              <p className="truncate text-[10px] text-slate-400 uppercase font-medium">{userProfile?.role || 'Usuário'}</p>
            </div>
          )}
          {!isCollapsed && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                handleSignOut();
              }}
              className="text-slate-400 hover:text-rose-400 transition-colors p-1" 
              title="Sair"
            >
              <LogOut size={16} />
            </button>
          )}
        </div>
        {!isCollapsed && (
           <div className="flex justify-center mt-3 pt-3 border-t border-slate-700/50">
             <img src="https://raw.githubusercontent.com/synapiens/uteis/refs/heads/main/LogoSynapiensNovo/logo_ajust.png" alt="Synapiens" className="h-4 object-contain brightness-90 hover:brightness-110 transition-all opacity-80" />
           </div>
        )}
      </div>
    </aside>
  );
}

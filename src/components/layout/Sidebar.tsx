import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Users, MessageCircle, Rocket, 
  UploadCloud, Search, Link, Bot, Plug, 
  CalendarDays, Bell, BarChart3, CreditCard, 
  Settings, UserCog, LogOut, ChevronLeft, ChevronRight,
  Bird, User, Sun, Moon
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useOrganization } from '../../contexts/OrganizationContext';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

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
  const { theme, toggleTheme } = useTheme();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <aside className={cn(
      "relative flex flex-col border-r border-surface-border bg-surface-base/95 backdrop-blur-xl transition-all duration-300",
      isCollapsed ? "w-20" : "w-64"
    )}>
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-1/2 -translate-y-1/2 flex h-6 w-6 items-center justify-center rounded-full border border-brand-primary/30 bg-surface-base text-brand-light hover:text-brand-tertiary z-10"
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      <div className="flex h-16 items-center justify-center border-b border-surface-border px-4">
        <div className="flex items-center justify-center w-full h-full">
          {isCollapsed ? (
            <img src="https://raw.githubusercontent.com/synapiens/uteis/refs/heads/main/LogoHermes/logo_hermes.png" alt="Hermes Nexus" className="h-8 object-contain" />
          ) : (
            <img 
              src={theme === 'dark' 
                ? "https://raw.githubusercontent.com/synapiens/uteis/refs/heads/main/LogoHermes/logo_hermes_nexus_negat.png" 
                : "https://raw.githubusercontent.com/synapiens/uteis/refs/heads/main/LogoHermes/logo_hermes_nexus.png" /* Assumindo que existe a versão normal */
              } 
              alt="Hermes Nexus" 
              className="h-8 object-contain" 
            />
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
                    ? "bg-brand-primary/20 text-brand-light border border-brand-primary/30" 
                    : "text-brand-muted hover:bg-surface-muted hover:text-brand-light"
                )}
                title={isCollapsed ? item.label : undefined}
              >
                <item.icon size={20} className={cn("shrink-0", isActive => isActive ? "text-brand-primary" : "")} />
                {!isCollapsed && <span className="truncate font-display uppercase tracking-wide text-[11px] font-semibold">{item.label}</span>}
                {item.path === '/agents' && (
                  <span className="absolute right-4 flex h-2 w-2 rounded-full bg-brand-primary animate-pulse"></span>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="border-t border-surface-border p-4">
        <button
          onClick={toggleTheme}
          className={cn(
            "flex w-full items-center justify-between p-2 rounded-xl border border-surface-border hover:bg-surface-muted transition-all mb-4 group",
            isCollapsed ? "justify-center" : "px-4"
          )}
          title={isCollapsed ? (theme === 'dark' ? 'Modo Claro' : 'Modo Escuro') : undefined}
        >
          {!isCollapsed && (
            <span className="text-[10px] font-bold uppercase tracking-widest text-brand-muted group-hover:text-brand-light transition-colors">
              {theme === 'dark' ? 'Modo Claro' : 'Modo Escuro'}
            </span>
          )}
          {theme === 'dark' ? (
            <Sun size={18} className="text-brand-tertiary" />
          ) : (
            <Moon size={18} className="text-brand-primary" />
          )}
        </button>

        <div 
          onClick={() => navigate('/profile')}
          className={cn(
            "flex items-center cursor-pointer group p-2 rounded-2xl transition-all duration-300",
            isCollapsed ? "justify-center" : "gap-3 hover:bg-surface-muted/50"
          )}
        >
          <div className="h-10 w-10 shrink-0 rounded-xl bg-surface-muted overflow-hidden border border-brand-primary/20 group-hover:border-brand-primary/50 transition-all flex items-center justify-center shadow-lg shadow-brand-primary/5">
            {userProfile?.avatar_url ? (
              <img src={userProfile.avatar_url} alt="User" className="h-full w-full object-cover" />
            ) : (
              <User size={18} className="text-brand-muted group-hover:text-brand-primary transition-colors" />
            )}
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="truncate text-xs font-bold text-brand-light group-hover:text-brand-primary transition-colors leading-tight font-display uppercase tracking-wider">
                {userProfile?.name || user?.email?.split('@')[0] || 'Usuário'}
              </p>
              <p className="truncate text-[9px] text-brand-muted uppercase font-bold tracking-[0.1em] opacity-60">
                {userProfile?.role || 'Membro'}
              </p>
            </div>
          )}
          {!isCollapsed && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                handleSignOut();
              }}
              className="text-brand-muted hover:text-status-failure transition-colors p-2 rounded-lg hover:bg-status-failure/10" 
              title="Sair"
            >
              <LogOut size={16} />
            </button>
          )}
        </div>
        {!isCollapsed && (
           <div className="flex justify-center mt-4 pt-4 border-t border-surface-border/50">
             <img src="https://raw.githubusercontent.com/synapiens/uteis/refs/heads/main/LogoSynapiensNovo/logo_ajust.png" alt="Synapiens" className="h-[22px] object-contain brightness-105 hover:scale-105 transition-all" />
           </div>
        )}
      </div>
    </aside>
  );
}

import React from 'react';
import { Bell, Search, Settings, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useOrganization } from '../../contexts/OrganizationContext';
import { useAuth } from '../../contexts/AuthContext';

export function Topbar() {
  const navigate = useNavigate();
  const { organization, userProfile, loading, error } = useOrganization();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <header className="flex h-16 items-center justify-between border-b border-surface-border bg-surface-base/50 px-6 backdrop-blur-md">
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-bold text-brand-light font-display">
          {error ? `Erro: ${error}` : loading ? 'Carregando...' : organization?.name || 'Synapiens Inc.'}
        </h1>
        <span className="rounded-full bg-brand-primary/15 px-2.5 py-0.5 text-[10px] uppercase font-bold text-brand-light border border-brand-primary/30 tracking-wider">
          {loading ? '...' : `Plano ${organization?.plan || 'Enterprise'}`}
        </span>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted" size={16} />
          <input 
            type="text" 
            placeholder="Buscar..."
            className="h-9 w-64 rounded-full border border-surface-border bg-surface-muted/50 pl-9 pr-4 text-sm text-brand-light placeholder-brand-muted/70 focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary transition-all"
          />
        </div>

        <button 
          onClick={() => navigate('/notifications')}
          className="relative flex h-9 w-9 items-center justify-center rounded-full text-brand-muted hover:bg-surface-muted hover:text-brand-light transition-colors"
        >
          <Bell size={20} />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-brand-tertiary shadow-[0_0_8px_rgba(250,210,90,0.5)]"></span>
        </button>
        
        <button 
          onClick={() => navigate('/profile')}
          className="flex items-center gap-3 pl-2 pr-4 py-1.5 rounded-full border border-surface-border bg-surface-muted/30 hover:bg-surface-muted transition-all group"
        >
          <div className="h-7 w-7 rounded-full bg-brand-primary/20 border border-brand-primary/30 overflow-hidden flex items-center justify-center shrink-0 group-hover:border-brand-primary transition-all">
            {userProfile?.avatar_url ? (
              <img src={userProfile.avatar_url} alt="User" className="h-full w-full object-cover" />
            ) : (
              <div className="text-[10px] font-bold text-brand-primary">
                {userProfile?.name?.charAt(0) || user?.email?.charAt(0)?.toUpperCase() || 'U'}
              </div>
            )}
          </div>
          <Settings size={18} className="text-brand-muted group-hover:text-brand-light transition-colors" />
        </button>

        <button 
          onClick={handleSignOut}
          className="flex h-9 w-9 items-center justify-center rounded-full text-status-failure hover:bg-status-failure/10 transition-colors"
          title="Sair"
        >
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
}

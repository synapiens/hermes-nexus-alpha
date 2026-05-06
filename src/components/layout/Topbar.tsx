import React from 'react';
import { Bell, Search, Settings, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useOrganization } from '../../contexts/OrganizationContext';
import { useAuth } from '../../contexts/AuthContext';

export function Topbar() {
  const navigate = useNavigate();
  const { organization, loading, error } = useOrganization();
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <header className="flex h-16 items-center justify-between border-b border-[#75AB61]/20 bg-[#1A1A2E]/50 px-6 backdrop-blur-md">
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-semibold text-white">
          {error ? `Erro: ${error}` : loading ? 'Carregando...' : organization?.name || 'Synapiens Inc.'}
        </h1>
        <span className="rounded-full bg-[#75AB61]/10 px-2.5 py-0.5 text-xs font-medium text-[#75AB61] border border-[#75AB61]/20">
          {loading ? '...' : `Plano ${organization?.plan || 'Enterprise'}`}
        </span>
      </div>

      <div className="flex items-center gap-4">
        {/* ... search and notifications ... */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text" 
            placeholder="Buscar..."
            className="h-9 w-64 rounded-full border border-slate-700 bg-slate-800/50 pl-9 pr-4 text-sm text-white placeholder-slate-400 focus:border-[#75AB61] focus:outline-none focus:ring-1 focus:ring-[#75AB61]"
          />
        </div>

        <button 
          onClick={() => navigate('/notifications')}
          className="relative flex h-9 w-9 items-center justify-center rounded-full text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
        >
          <Bell size={20} />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#75AB61]"></span>
        </button>
        
        <button 
          onClick={() => navigate('/profile')}
          className="flex h-9 w-9 items-center justify-center rounded-full text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
        >
          <Settings size={20} />
        </button>

        <button 
          onClick={handleSignOut}
          className="flex h-9 w-9 items-center justify-center rounded-full text-rose-400 hover:bg-rose-500/10 transition-colors"
          title="Sair"
        >
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
}

import React, { useState } from 'react';
import { Camera, Shield, Key, Smartphone, Monitor, LogOut, Check } from 'lucide-react';
import { cn } from '../lib/utils';

const mockSessions = [
  { id: 1, device: 'MacBook Pro - Chrome', location: 'São Paulo, SP - IP 192.168.1.1', time: 'Ativo agora', isCurrent: true, icon: Monitor },
  { id: 2, device: 'iPhone 13 - Safari', location: 'São Paulo, SP - IP 172.16.0.12', time: 'Último acesso há 2 horas', isCurrent: false, icon: Smartphone },
];

export function Profile() {
  const [activeTab, setActiveTab] = useState<'general' | 'security'>('general');
  const [formData, setFormData] = useState({
    name: 'Admin Synapiens',
    email: 'admin@synapiens.com',
  });

  const [passwordData, setPasswordData] = useState({
    current: '',
    newPass: '',
    confirm: ''
  });

  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, color: 'bg-slate-700', label: 'Muito fraca' };
    if (pass.length < 6) return { score: 1, color: 'bg-rose-500', label: 'Fraca' };
    if (pass.length < 8 || !/\d/.test(pass)) return { score: 2, color: 'bg-yellow-500', label: 'Razoável' };
    if (!/[A-Z]/.test(pass) || !/[!@#$%^&*]/.test(pass)) return { score: 3, color: 'bg-blue-500', label: 'Boa' };
    return { score: 4, color: 'bg-emerald-500', label: 'Forte' };
  };

  const strength = getPasswordStrength(passwordData.newPass);

  return (
    <div className="space-y-6 h-full flex flex-col max-w-4xl mx-auto w-full pb-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Meu Perfil</h1>
          <p className="text-slate-400 text-sm mt-1">Gerencie suas configurações e segurança da conta.</p>
        </div>
      </div>

      <div className="flex items-center gap-1 border-b border-slate-700/50">
        <button
          onClick={() => setActiveTab('general')}
          className={cn(
            "px-4 py-2.5 text-sm font-medium transition-colors relative",
            activeTab === 'general' ? "text-[#75AB61]" : "text-slate-400 hover:text-slate-200"
          )}
        >
          Geral
          {activeTab === 'general' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#75AB61]" />}
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={cn(
            "px-4 py-2.5 text-sm font-medium transition-colors relative",
            activeTab === 'security' ? "text-[#75AB61]" : "text-slate-400 hover:text-slate-200"
          )}
        >
          Segurança
          {activeTab === 'security' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#75AB61]" />}
        </button>
      </div>

      <div className="flex-1">
        {activeTab === 'general' ? (
          <div className="space-y-6 animate-in fade-in">
            {/* Foto e Informações Básicas */}
            <div className="card-surface p-6 rounded-xl border border-slate-700/50 flex flex-col sm:flex-row gap-8 items-start">
              <div className="flex flex-col flex-1 gap-6 w-full">
                <div className="flex items-center gap-6">
                  <div className="relative group">
                    <div className="w-24 h-24 rounded-full bg-slate-800 border-2 border-slate-700 overflow-hidden">
                       <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="Profile" className="w-full h-full object-cover" />
                    </div>
                    <button className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-full text-white">
                      <Camera size={24} />
                    </button>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1">Foto de Perfil</h3>
                    <p className="text-sm text-slate-400 mb-3">Imagem deve ser PNG ou JPG, máx 2MB.</p>
                    <div className="flex gap-2">
                       <button className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-lg border border-slate-600 transition-colors">
                         Alterar
                       </button>
                       <button className="px-3 py-1.5 text-rose-400 hover:bg-rose-400/10 text-xs font-bold rounded-lg transition-colors">
                         Remover
                       </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-700/50 pt-6">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase">Nome Completo</label>
                    <input 
                      type="text" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full h-11 bg-slate-800/50 border border-slate-700 rounded-xl px-4 text-sm text-white focus:border-[#75AB61] focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase">E-mail</label>
                    <input 
                      type="email" 
                      value={formData.email}
                      disabled
                      className="w-full h-11 bg-slate-800/30 border border-slate-700 rounded-xl px-4 text-sm text-slate-500 cursor-not-allowed"
                    />
                    <p className="text-[10px] text-slate-500">Para alterar o e-mail principal, contate o suporte.</p>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button className="px-5 py-2.5 bg-[#75AB61] hover:bg-[#5f8c4e] text-white text-sm font-bold rounded-xl transition-colors shadow-lg shadow-green-900/20">
                     Salvar Alterações
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in">
            {/* Alterar Senha */}
            <div className="card-surface p-6 rounded-xl border border-slate-700/50">
               <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-6">
                 <Key size={20} className="text-[#75AB61]" /> Alterar Senha
               </h3>
               
               <div className="max-w-md space-y-4">
                 <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase">Senha Atual</label>
                    <input 
                      type="password" 
                      value={passwordData.current}
                      onChange={(e) => setPasswordData({...passwordData, current: e.target.value})}
                      className="w-full h-11 bg-slate-800/50 border border-slate-700 rounded-xl px-4 text-sm text-white focus:border-[#75AB61] focus:outline-none"
                    />
                 </div>
                 
                 <div className="space-y-1.5 relative">
                    <label className="text-xs font-bold text-slate-400 uppercase flex justify-between">
                      Nova Senha
                      <span className={cn("text-[10px]", passwordData.newPass ? getPasswordStrength(passwordData.newPass).color.replace('bg-', 'text-') : "text-slate-500")}>
                        {strength.label}
                      </span>
                    </label>
                    <input 
                      type="password" 
                      value={passwordData.newPass}
                      onChange={(e) => setPasswordData({...passwordData, newPass: e.target.value})}
                      className="w-full h-11 bg-slate-800/50 border border-slate-700 rounded-xl px-4 text-sm text-white focus:border-[#75AB61] focus:outline-none"
                    />
                    
                    {/* Indicador de força */}
                    <div className="flex gap-1 mt-2">
                       {[1, 2, 3, 4].map(level => (
                         <div 
                           key={level} 
                           className={cn(
                             "h-1 flex-1 rounded-full bg-slate-700 transition-colors",
                             level <= strength.score ? strength.color : "bg-slate-700"
                           )} 
                         />
                       ))}
                    </div>
                 </div>

                 <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase">Confirmar Nova Senha</label>
                    <input 
                      type="password" 
                      value={passwordData.confirm}
                      onChange={(e) => setPasswordData({...passwordData, confirm: e.target.value})}
                      className={cn(
                        "w-full h-11 bg-slate-800/50 border rounded-xl px-4 text-sm text-white focus:outline-none",
                        passwordData.confirm && passwordData.confirm !== passwordData.newPass ? "border-rose-500 focus:border-rose-500" : "border-slate-700 focus:border-[#75AB61]"
                      )}
                    />
                    {passwordData.confirm && passwordData.confirm !== passwordData.newPass && (
                      <p className="text-[10px] text-rose-500 mt-1">As senhas não coincidem.</p>
                    )}
                 </div>

                 <div className="pt-4">
                  <button 
                    disabled={!passwordData.current || !passwordData.newPass || (passwordData.newPass !== passwordData.confirm)}
                    className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed border border-slate-600 text-white text-sm font-bold rounded-xl transition-colors"
                  >
                     Atualizar Senha
                  </button>
                 </div>
               </div>
            </div>

            {/* Sessões Ativas */}
            <div className="card-surface p-6 rounded-xl border border-slate-700/50">
               <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-2">
                 <Shield size={20} className="text-[#75AB61]" /> Sessões Ativas
               </h3>
               <p className="text-sm text-slate-400 mb-6">Dispositivos onde você está conectado atualmente. Desconecte sessões suspeitas.</p>

               <div className="space-y-4">
                 {mockSessions.map(session => (
                   <div key={session.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-slate-700/50 bg-[#0b1120]/30 hover:bg-[#0b1120]/60 transition-colors">
                     <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
                         <session.icon size={18} className={session.isCurrent ? "text-[#75AB61]" : "text-slate-400"} />
                       </div>
                       <div>
                         <div className="flex items-center gap-2">
                           <p className="text-sm font-bold text-white">{session.device}</p>
                           {session.isCurrent && (
                             <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-[#75AB61]/20 text-[#75AB61]">
                               Esta sessão
                             </span>
                           )}
                         </div>
                         <p className="text-xs text-slate-400">{session.location}</p>
                         <p className="text-[10px] text-slate-500 mt-0.5">{session.time}</p>
                       </div>
                     </div>
                     {!session.isCurrent && (
                       <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-rose-400 hover:bg-rose-400/10 rounded-lg transition-colors border border-transparent hover:border-rose-400/20 shrink-0">
                         <LogOut size={14} /> Encerrar
                       </button>
                     )}
                   </div>
                 ))}
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

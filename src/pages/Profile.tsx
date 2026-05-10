import React, { useState, useEffect } from 'react';
import { Camera, Shield, Key, Smartphone, Monitor, LogOut, Check, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuth } from '../contexts/AuthContext';
import { useOrganization } from '../contexts/OrganizationContext';
import { supabase } from '../lib/supabase';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { toast } from 'react-hot-toast';

const mockSessions = [
  { id: 1, device: 'MacBook Pro - Chrome', location: 'São Paulo, SP - IP 192.168.1.1', time: 'Ativo agora', isCurrent: true, icon: Monitor },
  { id: 2, device: 'iPhone 13 - Safari', location: 'São Paulo, SP - IP 172.16.0.12', time: 'Último acesso há 2 horas', isCurrent: false, icon: Smartphone },
];

export function Profile() {
  const { user } = useAuth();
  const { userProfile, refreshProfile } = useOrganization();
  const [activeTab, setActiveTab] = useState<'general' | 'security'>('general');
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    avatar_url: ''
  });

  useEffect(() => {
    if (userProfile) {
      setFormData({
        name: userProfile.name || '',
        email: userProfile.email || user?.email || '',
        avatar_url: userProfile.avatar_url || ''
      });
    }
  }, [userProfile, user]);

  const [passwordData, setPasswordData] = useState({
    current: '',
    newPass: '',
    confirm: ''
  });

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    try {
      setIsUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Math.random()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('hermes-nexus-assets')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('hermes-nexus-assets')
        .getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, avatar_url: publicUrl }));
      
      // Update supabase profile immediately for the avatar
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          avatar_url: publicUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (updateError) throw updateError;
      
      await refreshProfile();
      toast.success('Foto de perfil atualizada!');
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast.error('Erro ao fazer upload da imagem.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveChanges = async () => {
    if (!user) return;
    
    try {
      setIsSaving(true);
      
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          name: formData.name,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (updateError) throw updateError;
      
      await refreshProfile();
      toast.success('Perfil atualizado com sucesso!');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Erro ao salvar alterações.');
    } finally {
      setIsSaving(false);
    }
  };

  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, color: 'bg-brand-muted', label: 'Muito fraca' };
    if (pass.length < 6) return { score: 1, color: 'bg-status-failure', label: 'Fraca' };
    if (pass.length < 8 || !/\d/.test(pass)) return { score: 2, color: 'bg-status-warning', label: 'Razoável' };
    if (!/[A-Z]/.test(pass) || !/[!@#$%^&*]/.test(pass)) return { score: 3, color: 'bg-brand-primary', label: 'Boa' };
    return { score: 4, color: 'bg-status-success', label: 'Forte' };
  };

  const strength = getPasswordStrength(passwordData.newPass);

  return (
    <div className="space-y-8 h-full flex flex-col max-w-4xl mx-auto w-full pb-10 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="text-3xl font-bold text-brand-light font-display">Configurações de Perfil</h1>
          <p className="text-brand-muted text-sm mt-2 font-medium">Controle seus dados pessoais, foto e segurança da conta.</p>
        </div>
      </div>

      <div className="flex items-center gap-1 border-b border-surface-border">
        <button
          onClick={() => setActiveTab('general')}
          className={cn(
            "px-6 py-4 text-xs font-bold uppercase tracking-widest transition-all relative",
            activeTab === 'general' ? "text-brand-primary" : "text-brand-muted hover:text-brand-light"
          )}
        >
          Informações Gerais
          {activeTab === 'general' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-primary animate-in slide-in-from-left duration-300" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={cn(
            "px-6 py-4 text-xs font-bold uppercase tracking-widest transition-all relative",
            activeTab === 'security' ? "text-brand-primary" : "text-brand-muted hover:text-brand-light"
          )}
        >
          Segurança & Acesso
          {activeTab === 'security' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-primary animate-in slide-in-from-left duration-300" />
          )}
        </button>
      </div>

      <div className="flex-1">
        {activeTab === 'general' ? (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Foto e Informações Básicas */}
            <div className="card-surface p-8 rounded-3xl overflow-hidden shadow-xl bg-surface-base/40">
              <div className="flex flex-col gap-10">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
                  <div className="relative group">
                    <div className="w-32 h-32 rounded-[2rem] bg-surface-muted/30 border-2 border-surface-border overflow-hidden p-1 shadow-inner group-hover:border-brand-primary/50 transition-all">
                       {formData.avatar_url ? (
                         <img src={formData.avatar_url} alt="Profile" className="w-full h-full object-cover rounded-[1.75rem]" />
                       ) : (
                         <div className="w-full h-full flex items-center justify-center text-brand-muted/40 italic text-[10px] font-bold uppercase tracking-widest text-center px-4">
                           Sem Foto
                         </div>
                       )}
                       {isUploading && (
                         <div className="absolute inset-0 bg-surface-base/60 backdrop-blur-sm flex items-center justify-center rounded-[1.75rem]">
                           <Loader2 className="w-8 h-8 text-brand-primary animate-spin" />
                         </div>
                       )}
                    </div>
                    <label className="absolute -bottom-2 -right-2 w-11 h-11 rounded-2xl bg-brand-primary hover:bg-brand-primary/80 text-brand-on-primary flex items-center justify-center cursor-pointer shadow-xl transition-all hover:scale-110 active:scale-95 border-4 border-surface-base">
                      <Camera size={20} />
                      <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} />
                    </label>
                  </div>
                  <div className="text-center sm:text-left pt-2">
                    <h3 className="text-xl font-bold text-brand-light font-display">Identidade Visual</h3>
                    <p className="text-sm text-brand-muted mt-2 font-medium max-w-sm">
                      Sua foto será visível para outros membros da equipe no dashboard e conversas.
                    </p>
                    <div className="flex flex-wrap justify-center sm:justify-start gap-3 mt-5">
                       <label className="cursor-pointer px-5 py-2.5 bg-surface-muted/50 hover:bg-surface-muted text-brand-light text-xs font-bold rounded-xl border border-surface-border transition-all">
                         Upload Nova Foto
                         <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} />
                       </label>
                       {formData.avatar_url && (
                         <button className="px-5 py-2.5 text-status-failure hover:bg-status-failure/10 text-xs font-bold rounded-xl transition-all border border-transparent hover:border-status-failure/20">
                           Remover Foto
                         </button>
                       )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 border-t border-surface-border/50 pt-10">
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-brand-muted uppercase tracking-[0.15em] px-2">Nome Visível</label>
                    <input 
                      type="text" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full h-14 bg-surface-muted/20 border border-surface-border rounded-2xl px-5 text-sm text-brand-light focus:border-brand-primary/50 focus:outline-none focus:ring-1 focus:ring-brand-primary/30 transition-all font-medium"
                      placeholder="Como você deseja ser chamado"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-brand-muted uppercase tracking-[0.15em] px-2 flex justify-between items-center">
                      E-mail Corporativo
                      <Shield size={12} className="text-brand-primary" />
                    </label>
                    <div className="relative group">
                      <input 
                        type="email" 
                        value={formData.email}
                        disabled
                        className="w-full h-14 bg-surface-muted/10 border border-surface-border/50 rounded-2xl px-5 text-sm text-brand-muted cursor-not-allowed font-medium opacity-60"
                      />
                      <div className="absolute inset-0 bg-transparent" title="O e-mail é gerenciado pelo administrador da organização" />
                    </div>
                    <p className="text-[11px] text-brand-muted/50 font-medium px-2 italic">Acesso controlado pela organização.</p>
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button 
                    onClick={handleSaveChanges}
                    disabled={isSaving}
                    className="flex items-center gap-2.5 px-10 py-4 bg-brand-primary hover:bg-brand-primary/80 text-brand-on-primary text-xs font-bold uppercase tracking-[0.2em] rounded-2xl transition-all shadow-xl hover:shadow-brand-primary/20 active:scale-95 font-display disabled:opacity-50"
                  >
                    {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />}
                    Salvar Alterações
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Alterar Senha */}
            <div className="card-surface p-8 rounded-3xl bg-surface-base/40 border border-surface-border shadow-xl">
               <div className="flex items-center gap-5 mb-10">
                 <div className="w-16 h-16 bg-brand-secondary/10 text-brand-secondary rounded-2xl flex items-center justify-center border border-brand-secondary/20 shadow-inner">
                   <Key size={32} />
                 </div>
                 <div>
                   <h3 className="text-xl font-bold text-brand-light font-display">Autenticação</h3>
                   <p className="text-xs text-brand-muted mt-1 font-bold uppercase tracking-widest opacity-60">Segurança da conta</p>
                 </div>
               </div>
               
               <div className="max-w-md space-y-6">
                 <div className="space-y-2.5">
                    <label className="text-[10px] font-bold text-brand-muted uppercase tracking-widest px-2 leading-none">Senha Atual</label>
                    <input 
                      type="password" 
                      value={passwordData.current}
                      onChange={(e) => setPasswordData({...passwordData, current: e.target.value})}
                      className="w-full h-12 bg-surface-muted/30 border border-surface-border rounded-xl px-5 text-sm text-brand-light focus:border-brand-primary/50 focus:outline-none transition-all"
                    />
                 </div>
                 
                 <div className="space-y-2.5 relative">
                    <label className="text-[10px] font-bold text-brand-muted uppercase tracking-widest px-2 leading-none flex justify-between">
                      Nova Senha
                      <span className={cn("text-[9px] font-bold uppercase tracking-widest", passwordData.newPass ? getPasswordStrength(passwordData.newPass).color.replace('bg-', 'text-') : "text-brand-muted/40")}>
                        {strength.label}
                      </span>
                    </label>
                    <input 
                      type="password" 
                      value={passwordData.newPass}
                      onChange={(e) => setPasswordData({...passwordData, newPass: e.target.value})}
                      className="w-full h-12 bg-surface-muted/30 border border-surface-border rounded-xl px-5 text-sm text-brand-light focus:border-brand-primary/50 focus:outline-none transition-all"
                    />
                    
                    {/* Indicador de força */}
                    <div className="flex gap-2 mt-3 px-1">
                       {[1, 2, 3, 4].map(level => (
                         <div 
                           key={level} 
                           className={cn(
                             "h-1.5 flex-1 rounded-full bg-surface-muted/30 transition-all duration-500 shadow-sm",
                             level <= strength.score ? strength.color : "bg-surface-muted/30"
                           )} 
                         />
                       ))}
                    </div>
                 </div>

                 <div className="space-y-2.5">
                    <label className="text-[10px] font-bold text-brand-muted uppercase tracking-widest px-2 leading-none">Confirmar Credencial</label>
                    <input 
                      type="password" 
                      value={passwordData.confirm}
                      onChange={(e) => setPasswordData({...passwordData, confirm: e.target.value})}
                      className={cn(
                        "w-full h-12 bg-surface-muted/30 border rounded-xl px-5 text-sm text-brand-light focus:outline-none transition-all",
                        passwordData.confirm && passwordData.confirm !== passwordData.newPass ? "border-status-failure/50 focus:border-status-failure" : "border-surface-border focus:border-brand-primary"
                      )}
                    />
                    {passwordData.confirm && passwordData.confirm !== passwordData.newPass && (
                      <p className="text-[10px] font-bold text-status-failure mt-2 px-2 uppercase tracking-wide animate-pulse">As senhas não coincidem.</p>
                    )}
                 </div>

                 <div className="pt-6">
                  <button 
                    disabled={!passwordData.current || !passwordData.newPass || (passwordData.newPass !== passwordData.confirm)}
                    className="w-full sm:w-auto px-8 py-4 bg-brand-primary hover:bg-brand-primary/80 disabled:opacity-40 disabled:cursor-not-allowed text-brand-on-primary text-xs font-bold uppercase tracking-[0.2em] rounded-2xl transition-all shadow-xl hover:shadow-brand-primary/20 active:scale-95 font-display"
                  >
                     Redefinir Senha
                  </button>
                 </div>
               </div>
            </div>

            {/* Sessões Ativas */}
            <div className="card-surface p-8 rounded-3xl bg-surface-base/40 border border-surface-border shadow-xl">
               <div className="flex items-center gap-5 mb-2">
                 <div className="w-16 h-16 bg-brand-primary/10 text-brand-primary rounded-2xl flex items-center justify-center border border-brand-primary/20 shadow-inner">
                   <Shield size={32} />
                 </div>
                 <div>
                   <h3 className="text-xl font-bold text-brand-light font-display">Controle de Acesso</h3>
                   <p className="text-xs text-brand-muted mt-1 font-bold uppercase tracking-widest opacity-60">Sessões & Dispositivos</p>
                 </div>
               </div>
               <p className="text-sm text-brand-muted mb-10 font-medium px-2 leading-relaxed italic opacity-60">Histórico de acessos para monitoramento de segurança.</p>

               <div className="space-y-4">
                 {mockSessions.map(session => (
                   <div key={session.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-6 rounded-2xl border border-surface-border/50 bg-surface-muted/10 hover:bg-surface-muted/20 transition-all group">
                     <div className="flex items-center gap-5">
                       <div className="w-12 h-12 rounded-2xl bg-surface-muted/30 border border-surface-border flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                         <session.icon size={22} className={session.isCurrent ? "text-brand-primary" : "text-brand-muted"} />
                       </div>
                       <div>
                         <div className="flex items-center gap-3">
                           <p className="text-sm font-bold text-brand-light font-display uppercase tracking-wider">{session.device}</p>
                           {session.isCurrent && (
                             <span className="px-2 py-0.5 rounded-lg text-[9px] font-bold uppercase tracking-[0.15em] bg-brand-primary/10 text-brand-primary border border-brand-primary/20">
                               Ativo
                             </span>
                           )}
                         </div>
                         <p className="text-[11px] text-brand-muted font-medium mt-1">{session.location}</p>
                         <p className="text-[10px] text-brand-muted/40 font-bold uppercase tracking-widest mt-1.5">{session.time}</p>
                       </div>
                     </div>
                     {!session.isCurrent && (
                       <button className="flex items-center justify-center gap-2.5 px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-status-failure hover:bg-status-failure/10 rounded-xl transition-all border border-transparent hover:border-status-failure/20">
                         <LogOut size={16} /> Encerrar
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


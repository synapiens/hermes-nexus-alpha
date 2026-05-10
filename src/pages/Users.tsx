import React, { useState, useEffect } from 'react';
import { 
  Users as UsersIcon, Plus, Search, Filter, Edit2, Key, ToggleLeft, ToggleRight, Trash2, Shield, User, X, Check, Activity, Camera, Loader2
} from 'lucide-react';
import { cn } from '../lib/utils';
import { supabase } from '../lib/supabase';
import { useOrganization } from '../contexts/OrganizationContext';

export function Users() {
  const { organization } = useOrganization();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (organization?.id) {
      fetchUsers();
    }
  }, [organization?.id]);

  const fetchUsers = async () => {
    if (!organization?.id) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('organization_id', organization.id);
        
      if (error) throw error;

      if (data) {
        // Map database fields to UI component fields
        const formattedUsers = data.map((u: any) => ({
          id: u.id,
          name: u.name || 'Sem nome',
          email: u.email || '',
          role: u.role || 'User',
          status: u.status || 'Ativo',
          lastAccess: u.last_access ? new Date(u.last_access).toLocaleDateString() : '-',
          createdAt: u.created_at ? new Date(u.created_at).toLocaleDateString() : '-',
          avatar: u.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name || 'U')}&background=random`
        }));
        setUsers(formattedUsers);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Modal Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'User',
    avatar_url: '',
    sendEmail: true
  });

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !organization?.id) return;

    try {
      setIsUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `avatars/${organization.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, avatar_url: publicUrl }));
    } catch (err) {
      console.error('Error uploading avatar:', err);
      alert('Erro ao fazer upload da imagem.');
    } finally {
      setIsUploading(false);
    }
  };

  const [passwordFormData, setPasswordFormData] = useState({
    newPass: '',
    confirm: ''
  });

  const handleOpenModal = (user: any = null) => {
    if (user) {
      setSelectedUser(user);
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role,
        avatar_url: user.avatar || '',
        sendEmail: false
      });
    } else {
      setSelectedUser(null);
      setFormData({
        name: '',
        email: '',
        role: 'User',
        avatar_url: '',
        sendEmail: true
      });
    }
    setIsModalOpen(true);
  };

  const handleToggleStatus = async (user: any) => {
    if (!organization?.id) return;
    try {
      const newStatus = user.status === 'Ativo' ? 'Inativo' : 'Ativo';
      const { error } = await supabase
        .from('profiles')
        .update({ status: newStatus })
        .eq('id', user.id)
        .eq('organization_id', organization.id);
      
      if (error) throw error;
      fetchUsers();
    } catch (err) {
      console.error('Error toggling status:', err);
    }
  };

  const handleSaveMember = async () => {
    if (!organization?.id) return;

    try {
      const dbData = {
        name: formData.name,
        email: formData.email,
        role: formData.role,
        avatar_url: formData.avatar_url,
        organization_id: organization.id
      };

      if (selectedUser) {
        const { error } = await supabase
          .from('profiles')
          .update(dbData)
          .eq('id', selectedUser.id)
          .eq('organization_id', organization.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('profiles')
          .insert([dbData]);
        if (error) throw error;
      }

      fetchUsers();
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error saving member:', err);
      alert('Erro ao salvar membro da equipe.');
    }
  };

  const handleDeleteUser = async () => {
    if (!organization?.id || !selectedUser) return;
    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', selectedUser.id)
        .eq('organization_id', organization.id);
      
      if (error) throw error;
      fetchUsers();
      setIsDeleteModalOpen(false);
    } catch (err) {
      console.error('Error deleting user:', err);
      alert('Erro ao excluir usuário.');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="text-3xl font-bold text-brand-light font-display">Gestão da Equipe</h1>
          <p className="text-brand-muted text-sm mt-2 font-medium">Controle de acesso e monitoramento dos colabores da organização.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2.5 bg-brand-primary hover:bg-brand-primary/80 text-brand-on-primary px-6 py-3.5 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all shadow-xl hover:shadow-brand-primary/20 active:scale-95 font-display"
        >
          <Plus size={18} /> Adicionar Membro
        </button>
      </div>

      <div className="flex-1 flex flex-col gap-6">
        {/* Filtros */}
        <div className="card-surface p-6 rounded-2xl border border-surface-border flex flex-col lg:flex-row gap-4 bg-surface-base/40 backdrop-blur-sm">
          <div className="relative flex-1 group">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted transition-colors group-focus-within:text-brand-primary" />
            <input 
              type="text" 
              placeholder="Buscar por nome ou e-mail..."
              className="w-full pl-11 pr-4 h-12 bg-surface-muted/30 border border-surface-border rounded-xl text-sm text-brand-light placeholder-brand-muted/40 focus:border-brand-primary/50 focus:outline-none focus:ring-1 focus:ring-brand-primary/30 transition-all font-medium"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 sm:flex-none">
              <Filter size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted pointer-events-none" />
              <select className="flex-1 pl-11 pr-10 h-12 bg-surface-muted/30 border border-surface-border rounded-xl text-sm text-brand-light font-bold uppercase tracking-widest focus:border-brand-primary/50 focus:outline-none focus:ring-1 focus:ring-brand-primary/30 appearance-none min-w-[180px] cursor-pointer">
                <option>Todos Perfis</option>
                <option>Admin</option>
                <option>User</option>
              </select>
            </div>
            <div className="relative flex-1 sm:flex-none">
              <Filter size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted pointer-events-none" />
              <select className="flex-1 pl-11 pr-10 h-12 bg-surface-muted/30 border border-surface-border rounded-xl text-sm text-brand-light font-bold uppercase tracking-widest focus:border-brand-primary/50 focus:outline-none focus:ring-1 focus:ring-brand-primary/30 appearance-none min-w-[180px] cursor-pointer">
                <option>Todos Status</option>
                <option>Ativo</option>
                <option>Inativo</option>
                <option>Pendente</option>
              </select>
            </div>
          </div>
        </div>

        {/* Lista de Usuários */}
        <div className="card-surface rounded-2xl border border-surface-border overflow-hidden bg-surface-base/40 backdrop-blur-sm shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="border-b border-surface-border bg-surface-muted/20">
                  <th className="p-6 text-[10px] font-bold text-brand-muted uppercase tracking-[0.2em]">Colaborador</th>
                  <th className="p-6 text-[10px] font-bold text-brand-muted uppercase tracking-[0.2em]">E-mail Corporativo</th>
                  <th className="p-6 text-[10px] font-bold text-brand-muted uppercase tracking-[0.2em]">Perfil</th>
                  <th className="p-6 text-[10px] font-bold text-brand-muted uppercase tracking-[0.2em]">Status</th>
                  <th className="p-6 text-[10px] font-bold text-brand-muted uppercase tracking-[0.2em]">Atividade</th>
                  <th className="p-6 text-[10px] font-bold text-brand-muted uppercase tracking-[0.2em] text-right">Controle</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border/50">
                {users.map(user => (
                  <tr key={user.id} className="hover:bg-brand-primary/5 transition-all group">
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-2xl border border-surface-border shadow-sm group-hover:scale-105 transition-transform" />
                          <div className={cn(
                            "absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-surface-base shadow-sm",
                            user.status === 'Ativo' ? "bg-status-success" : "bg-brand-muted/30"
                          )}></div>
                        </div>
                        <span className="text-sm font-bold text-brand-light font-display">{user.name}</span>
                      </div>
                    </td>
                    <td className="p-6 text-sm text-brand-muted font-medium">{user.email}</td>
                    <td className="p-6">
                      <span className={cn(
                        "px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-widest border",
                        user.role === 'Admin' ? "bg-brand-secondary/10 text-brand-secondary border-brand-secondary/20" : "bg-brand-primary/10 text-brand-primary border-brand-primary/20"
                      )}>
                        {user.role}
                      </span>
                    </td>
                    <td className="p-6">
                      <span className={cn(
                        "px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-widest bg-surface-muted/30 border border-surface-border",
                        user.status === 'Ativo' ? "text-status-success" :
                        user.status === 'Inativo' ? "text-brand-muted" :
                        "text-brand-tertiary"
                      )}>
                        {user.status}
                      </span>
                    </td>
                    <td className="p-6 whitespace-nowrap">
                      <div className="text-[11px] text-brand-light font-bold">Acesso {user.lastAccess}</div>
                      <div className="text-[9px] text-brand-muted font-bold uppercase tracking-widest mt-1 opacity-60">Desde {user.createdAt}</div>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center justify-end gap-2 text-brand-muted opacity-60 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleOpenModal(user)} className="p-2.5 hover:text-brand-primary hover:bg-brand-primary/10 rounded-xl transition-all" title="Editar Usuário">
                          <Edit2 size={18} />
                        </button>
                        <button 
                          onClick={() => {
                            setSelectedUser(user);
                            setPasswordFormData({ newPass: '', confirm: '' });
                            setIsPasswordModalOpen(true);
                          }}
                          className="p-2.5 hover:text-brand-secondary hover:bg-brand-secondary/10 rounded-xl transition-all" title="Redefinir Senha"
                        >
                          <Key size={18} />
                        </button>
                        {user.status !== 'Pendente' && (
                          <button 
                            onClick={() => handleToggleStatus(user)}
                            className={cn("p-2.5 rounded-xl transition-all", user.status === 'Ativo' ? "hover:text-brand-tertiary hover:bg-brand-tertiary/10" : "hover:text-status-success hover:bg-status-success/10")} 
                            title={user.status === 'Ativo' ? 'Inativar' : 'Ativar'}
                          >
                            {user.status === 'Ativo' ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                          </button>
                        )}
                        <button onClick={() => { setSelectedUser(user); setIsDeleteModalOpen(true); }} className="p-2.5 hover:text-status-failure hover:bg-status-failure/10 rounded-xl transition-all" title="Excluir">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface-base/80 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="bg-surface-base border border-brand-primary/20 rounded-3xl shadow-2xl w-full max-w-xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300 shadow-brand-primary/5">
            <div className="p-8 border-b border-surface-border flex items-center justify-between sticky top-0 bg-surface-base/90 backdrop-blur-md z-10 rounded-t-3xl">
              <div>
                <h2 className="text-2xl font-bold text-brand-light font-display">
                  {selectedUser ? 'Editar Perfil' : 'Novo Colaborador'}
                </h2>
                <p className="text-xs text-brand-muted mt-1 font-bold uppercase tracking-widest opacity-60">Configurações de acesso e identidade</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-brand-muted hover:text-brand-light p-3 rounded-2xl hover:bg-surface-muted transition-all active:scale-90"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="p-10 overflow-y-auto custom-scrollbar flex-1 space-y-10">
              {/* Avatar Upload Container */}
              <div className="flex flex-col items-center gap-5 relative">
                <div className="relative group">
                  <div className="w-28 h-28 rounded-3xl border-2 border-surface-border overflow-hidden bg-surface-muted/30 shadow-inner group-hover:border-brand-primary/50 transition-all p-1">
                    {formData.avatar_url ? (
                      <img src={formData.avatar_url} alt="Preview" className="w-full h-full object-cover rounded-2xl" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-brand-muted/40 italic text-[10px] font-bold uppercase tracking-widest text-center px-4">
                        Nenhuma imagem selecionada
                      </div>
                    )}
                    {isUploading && (
                      <div className="absolute inset-0 bg-surface-base/60 backdrop-blur-sm flex items-center justify-center rounded-2xl">
                        <Loader2 className="w-8 h-8 text-brand-primary animate-spin" />
                      </div>
                    )}
                  </div>
                  <label className="absolute -bottom-2 -right-2 w-10 h-10 rounded-2xl bg-brand-primary hover:bg-brand-primary/80 text-brand-light flex items-center justify-center cursor-pointer shadow-xl transition-all hover:scale-110 active:scale-95 border-2 border-surface-base">
                    <Camera size={18} />
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      disabled={isUploading}
                    />
                  </label>
                </div>
                <div className="text-center">
                   <p className="text-[10px] text-brand-muted font-bold uppercase tracking-[0.2em]">Avatar do Membro</p>
                   <p className="text-[9px] text-brand-muted/40 font-medium mt-1">PNG ou JPG (Máx 2MB)</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2.5">
                  <label className="text-[10px] font-bold text-brand-muted uppercase tracking-[0.15em] px-2 leading-none">Nome Completo</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Ex: João da Silva"
                    className="w-full h-12 bg-surface-muted/30 border border-surface-border rounded-xl px-4 text-sm text-brand-light placeholder-brand-muted/40 focus:border-brand-primary/50 focus:outline-none focus:ring-1 focus:ring-brand-primary/30 transition-all font-medium"
                  />
                </div>
                <div className="space-y-2.5">
                  <label className="text-[10px] font-bold text-brand-muted uppercase tracking-[0.15em] px-2 leading-none">E-mail Corporativo</label>
                  <input 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="joao@empresa.com"
                    className="w-full h-12 bg-surface-muted/30 border border-surface-border rounded-xl px-4 text-sm text-brand-light placeholder-brand-muted/40 focus:border-brand-primary/50 focus:outline-none focus:ring-1 focus:ring-brand-primary/30 transition-all font-medium"
                  />
                </div>
              </div>

              <div className="space-y-5">
                <label className="text-[10px] font-bold text-brand-muted uppercase tracking-[0.15em] px-2 leading-none">Perfil de Acesso</label>
                <div className="grid grid-cols-1 gap-4">
                  <label className={cn(
                    "relative flex items-start gap-4 p-5 rounded-2xl border cursor-pointer transition-all hover:shadow-lg",
                    formData.role === 'Admin' ? "border-brand-secondary bg-brand-secondary/5 shadow-brand-secondary/5" : "border-surface-border bg-surface-muted/10 hover:border-surface-border/80"
                  )}>
                    <div className="relative flex h-5 w-5 shrink-0 items-center justify-center mt-1">
                      <input 
                        type="radio" 
                        name="role" 
                        value="Admin"
                        checked={formData.role === 'Admin'}
                        onChange={() => setFormData({...formData, role: 'Admin'})}
                        className="peer appearance-none w-5 h-5 rounded-full border border-surface-border checked:bg-brand-secondary checked:border-brand-secondary transition-all" 
                      />
                      <Check size={12} className={cn("absolute text-brand-light font-black transition-opacity", formData.role === 'Admin' ? "opacity-100" : "opacity-0")} />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-bold text-brand-light flex items-center gap-2 font-display uppercase tracking-wider"><Shield size={16} className="text-brand-secondary" /> Administrador</h4>
                      <p className="text-xs text-brand-muted mt-2 leading-relaxed font-medium">Controle total sobre a organização, integrações, faturamento e usuários.</p>
                    </div>
                  </label>
                  
                  <label className={cn(
                    "relative flex items-start gap-4 p-5 rounded-2xl border cursor-pointer transition-all hover:shadow-lg",
                    formData.role === 'User' ? "border-brand-primary bg-brand-primary/5 shadow-brand-primary/5" : "border-surface-border bg-surface-muted/10 hover:border-surface-border/80"
                  )}>
                    <div className="relative flex h-5 w-5 shrink-0 items-center justify-center mt-1">
                      <input 
                        type="radio" 
                        name="role" 
                        value="User"
                        checked={formData.role === 'User'}
                        onChange={() => setFormData({...formData, role: 'User'})}
                        className="peer appearance-none w-5 h-5 rounded-full border border-surface-border checked:bg-brand-primary checked:border-brand-primary transition-all" 
                      />
                      <Check size={12} className={cn("absolute text-brand-light font-black transition-opacity", formData.role === 'User' ? "opacity-100" : "opacity-0")} />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-bold text-brand-light flex items-center gap-2 font-display uppercase tracking-wider"><User size={16} className="text-brand-primary" /> Colaborador</h4>
                      <p className="text-xs text-brand-muted mt-2 leading-relaxed font-medium">Acesso às ferramentas operacionais: Leads, Conversas e Campanhas.</p>
                    </div>
                  </label>
                </div>
              </div>

              {!selectedUser && (
                <div className="pt-6 border-t border-surface-border">
                  <label className="flex items-start gap-4 cursor-pointer group">
                    <div className="w-6 h-6 rounded-lg border border-surface-border bg-surface-muted/30 group-hover:border-brand-primary flex items-center justify-center relative shrink-0 transition-colors">
                      <input 
                        type="checkbox" 
                        checked={formData.sendEmail}
                        onChange={(e) => setFormData({...formData, sendEmail: e.target.checked})}
                        className="opacity-0 absolute inset-0 cursor-pointer peer" 
                      />
                      <Check size={16} className={cn("text-brand-primary transition-all scale-75 peer-checked:scale-100", formData.sendEmail ? "opacity-100" : "opacity-0")} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-brand-light group-hover:text-brand-primary transition-colors font-display uppercase tracking-wider">Notificar por E-mail</p>
                      <p className="text-[11px] text-brand-muted mt-1 leading-relaxed font-medium italic opacity-60">Enviaremos um link de convite para que o membro defina sua senha pessoal.</p>
                    </div>
                  </label>
                </div>
              )}
            </div>

            <div className="p-8 border-t border-surface-border flex justify-end gap-4 rounded-b-3xl bg-surface-muted/20 backdrop-blur-md">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-3 text-xs font-bold uppercase tracking-widest text-brand-muted hover:text-brand-light hover:bg-surface-muted rounded-xl transition-all active:scale-95 border border-transparent hover:border-surface-border"
              >
                Descartar
              </button>
              <button 
                onClick={handleSaveMember}
                className="px-10 py-3 text-xs font-bold uppercase tracking-[0.2em] text-brand-on-primary bg-brand-primary hover:bg-brand-primary/80 rounded-xl transition-all shadow-xl hover:shadow-brand-primary/20 active:scale-95 font-display"
              >
                {selectedUser ? 'Atualizar' : 'Criar Conta'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {isDeleteModalOpen && selectedUser && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-surface-base/80 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="bg-surface-base border border-status-failure/30 rounded-3xl shadow-2xl w-full max-w-md p-10 text-center animate-in zoom-in-95 duration-300 shadow-status-failure/5">
            <div className="w-20 h-20 bg-status-failure/10 text-status-failure rounded-full flex items-center justify-center mx-auto mb-6 border border-status-failure/20 shadow-inner">
              <Trash2 size={32} />
            </div>
            <h3 className="text-2xl font-bold text-brand-light mb-3 font-display">Remover Acesso?</h3>
            <p className="text-brand-muted text-sm mb-10 leading-relaxed font-medium">
              Você está prestes a excluir permanentemente o acesso de <strong>{selectedUser.name}</strong>. Esta ação interromperá todas as sessões ativas do colaborador.
            </p>
            <div className="flex flex-col gap-3">
              <button 
                onClick={handleDeleteUser}
                className="w-full py-4 text-xs font-bold uppercase tracking-[0.2em] text-brand-on-primary bg-status-failure hover:bg-status-failure/80 rounded-2xl transition-all shadow-xl hover:shadow-status-failure/20 active:scale-95 font-display"
              >
                Confirmar Exclusão
              </button>
              <button 
                onClick={() => setIsDeleteModalOpen(false)}
                className="w-full py-4 text-xs font-bold uppercase tracking-widest text-brand-muted hover:text-brand-light transition-all rounded-2xl border border-transparent hover:border-surface-border"
              >
                Cancelar Operação
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Password Modal */}
      {isPasswordModalOpen && selectedUser && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-surface-base/80 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="bg-surface-base border border-brand-secondary/30 rounded-3xl shadow-2xl w-full max-w-md p-10 animate-in zoom-in-95 duration-300 shadow-brand-secondary/5">
            <div className="flex items-center gap-5 mb-10">
              <div className="w-16 h-16 bg-brand-secondary/10 text-brand-secondary rounded-2xl flex items-center justify-center border border-brand-secondary/20 shadow-inner">
                <Key size={32} />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-brand-light font-display">Nova Credencial</h3>
                <p className="text-brand-muted text-[10px] font-bold uppercase tracking-widest mt-1 opacity-60">Redefinindo para {selectedUser.name}</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-2.5">
                <label className="text-[10px] font-bold text-brand-muted uppercase tracking-widest px-2 leading-none">Senha Master</label>
                <input 
                  type="password" 
                  value={passwordFormData.newPass}
                  onChange={(e) => setPasswordFormData({...passwordFormData, newPass: e.target.value})}
                  className="w-full h-12 bg-surface-muted/30 border border-surface-border rounded-xl px-5 text-sm text-brand-light focus:border-brand-secondary/50 focus:outline-none transition-all font-medium"
                  placeholder="Mínimo 8 caracteres"
                />
              </div>
              <div className="space-y-2.5">
                <label className="text-[10px] font-bold text-brand-muted uppercase tracking-widest px-2 leading-none">Confirmar Senha</label>
                <input 
                  type="password" 
                  value={passwordFormData.confirm}
                  onChange={(e) => setPasswordFormData({...passwordFormData, confirm: e.target.value})}
                  className={cn(
                    "w-full h-12 bg-surface-muted/30 border rounded-xl px-5 text-sm text-brand-light focus:outline-none transition-all font-medium",
                    passwordFormData.confirm && passwordFormData.confirm !== passwordFormData.newPass ? "border-status-failure/50 focus:border-status-failure" : "border-surface-border focus:border-brand-secondary"
                  )}
                  placeholder="Repita a nova senha"
                />
                {passwordFormData.confirm && passwordFormData.confirm !== passwordFormData.newPass && (
                  <p className="text-[10px] font-bold text-status-failure mt-2 px-2 uppercase tracking-wide animate-pulse">Divergência detectada nas senhas.</p>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-3 mt-12">
              <button 
                disabled={!passwordFormData.newPass || (passwordFormData.newPass !== passwordFormData.confirm)}
                onClick={() => {
                  setIsPasswordModalOpen(false);
                  // Mock change password success
                }}
                className="w-full py-4 text-xs font-bold uppercase tracking-[0.2em] text-brand-on-primary bg-brand-secondary hover:bg-brand-secondary/80 disabled:opacity-40 disabled:cursor-not-allowed rounded-2xl transition-all shadow-xl hover:shadow-brand-secondary/20 active:scale-95 font-display"
              >
                Override Credenciais
              </button>
              <button 
                onClick={() => setIsPasswordModalOpen(false)}
                className="w-full py-4 text-xs font-bold uppercase tracking-widest text-brand-muted hover:text-brand-light transition-all rounded-2xl border border-transparent hover:border-surface-border"
              >
                Abortar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

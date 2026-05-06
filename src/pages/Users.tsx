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
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Gestão da Equipe</h1>
          <p className="text-slate-400 text-sm mt-1">Gerencie o acesso da sua equipe à plataforma.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-[#75AB61] hover:bg-[#5f8c4e] text-white px-4 py-2.5 rounded-lg text-sm font-bold transition-colors shadow-lg shadow-green-900/20"
        >
          <Plus size={16} /> Adicionar Membro
        </button>
      </div>

      <div className="flex-1 flex flex-col gap-4">
        {/* Filtros */}
        <div className="card-surface p-4 rounded-xl border border-slate-700/50 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Buscar por nome ou e-mail..."
              className="w-full pl-9 pr-4 h-10 bg-[#0b1120] border border-slate-700 rounded-lg text-sm text-white focus:border-[#75AB61] focus:outline-none"
            />
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <select className="pl-9 pr-6 h-10 bg-[#0b1120] border border-slate-700 rounded-lg text-sm text-white focus:border-[#75AB61] focus:outline-none appearance-none min-w-[140px]">
                <option>Todos Perfis</option>
                <option>Admin</option>
                <option>User</option>
              </select>
            </div>
            <div className="relative">
              <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <select className="pl-9 pr-6 h-10 bg-[#0b1120] border border-slate-700 rounded-lg text-sm text-white focus:border-[#75AB61] focus:outline-none appearance-none min-w-[140px]">
                <option>Todos Status</option>
                <option>Ativo</option>
                <option>Inativo</option>
                <option>Pendente de ativação</option>
              </select>
            </div>
          </div>
        </div>

        {/* Lista de Usuários */}
        <div className="card-surface rounded-xl border border-slate-700/50 overflow-hidden flex-1 flex flex-col">
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="border-b border-slate-700/50 bg-[#0b1120]/30">
                  <th className="p-4 text-xs font-semibold text-slate-400">Usuário</th>
                  <th className="p-4 text-xs font-semibold text-slate-400">E-mail</th>
                  <th className="p-4 text-xs font-semibold text-slate-400">Perfil</th>
                  <th className="p-4 text-xs font-semibold text-slate-400">Status</th>
                  <th className="p-4 text-xs font-semibold text-slate-400">Último Acesso / Criação</th>
                  <th className="p-4 text-xs font-semibold text-slate-400 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {users.map(user => (
                  <tr key={user.id} className="hover:bg-slate-800/20 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full border border-slate-600" />
                        <span className="text-sm font-bold text-white">{user.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-slate-300">{user.email}</td>
                    <td className="p-4">
                      <span className={cn(
                        "px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border",
                        user.role === 'Admin' ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20" : "bg-[#75AB61]/10 text-[#75AB61] border-[#75AB61]/20"
                      )}>
                        {user.role}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={cn(
                        "px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider",
                        user.status === 'Ativo' ? "text-emerald-400" :
                        user.status === 'Inativo' ? "text-slate-400" :
                        "text-amber-400"
                      )}>
                        • {user.status}
                      </span>
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <div className="text-sm text-slate-300 font-medium">{user.lastAccess}</div>
                      <div className="text-[10px] text-slate-500 uppercase">Criado em {user.createdAt}</div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-1 text-slate-400">
                        <button onClick={() => handleOpenModal(user)} className="p-1.5 hover:text-white hover:bg-slate-700 rounded transition-colors" title="Editar Usuário">
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => {
                            setSelectedUser(user);
                            setPasswordFormData({ newPass: '', confirm: '' });
                            setIsPasswordModalOpen(true);
                          }}
                          className="p-1.5 hover:text-cyan-400 hover:bg-cyan-400/10 rounded transition-colors" title="Redefinir Senha"
                        >
                          <Key size={16} />
                        </button>
                        {user.status !== 'Pendente' && (
                          <button 
                            onClick={() => handleToggleStatus(user)}
                            className={cn("p-1.5 rounded transition-colors", user.status === 'Ativo' ? "hover:text-amber-400 hover:bg-amber-400/10" : "hover:text-emerald-400 hover:bg-emerald-400/10")} 
                            title={user.status === 'Ativo' ? 'Inativar' : 'Ativar'}
                          >
                            {user.status === 'Ativo' ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                          </button>
                        )}
                        <button onClick={() => { setSelectedUser(user); setIsDeleteModalOpen(true); }} className="p-1.5 hover:text-rose-400 hover:bg-rose-400/10 rounded transition-colors" title="Excluir">
                          <Trash2 size={16} />
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#1A1A2E] border border-[#75AB61]/20 rounded-2xl shadow-2xl w-full max-w-xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-[#75AB61]/20 flex items-center justify-between sticky top-0 bg-[#1A1A2E] z-10 rounded-t-2xl">
              <h2 className="text-xl font-bold text-white">
                {selectedUser ? 'Editar Membro' : 'Novo Membro na Equipe'}
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6">
              {/* Avatar Upload Container */}
              <div className="flex flex-col items-center gap-4 mb-2">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-full border-2 border-slate-700 overflow-hidden bg-slate-800">
                    {formData.avatar_url ? (
                      <img src={formData.avatar_url} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-500 italic text-[10px]">
                        Sem Foto
                      </div>
                    )}
                    {isUploading && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <Loader2 className="w-6 h-6 text-[#75AB61] animate-spin" />
                      </div>
                    )}
                  </div>
                  <label className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[#75AB61] hover:bg-[#5f8c4e] text-white flex items-center justify-center cursor-pointer shadow-lg transition-colors">
                    <Camera size={14} />
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      disabled={isUploading}
                    />
                  </label>
                </div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Foto do Perfil</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase">Nome Completo</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Ex: João da Silva"
                    className="w-full h-11 bg-slate-800/50 border border-slate-700 rounded-xl px-4 text-sm text-white focus:border-[#75AB61] focus:outline-none focus:ring-1 focus:ring-[#75AB61]/50"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase">E-mail</label>
                  <input 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="joao@empresa.com"
                    className="w-full h-11 bg-slate-800/50 border border-slate-700 rounded-xl px-4 text-sm text-white focus:border-[#75AB61] focus:outline-none focus:ring-1 focus:ring-[#75AB61]/50"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-400 uppercase">Perfil de Acesso</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className={cn(
                    "relative flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all",
                    formData.role === 'Admin' ? "border-[#75AB61] bg-[#75AB61]/10" : "border-slate-700 bg-slate-800/30 hover:border-slate-600"
                  )}>
                    <input 
                      type="radio" 
                      name="role" 
                      value="Admin"
                      checked={formData.role === 'Admin'}
                      onChange={() => setFormData({...formData, role: 'Admin'})}
                      className="mt-1 accent-[#75AB61]" 
                    />
                    <div>
                      <h4 className="text-sm font-bold text-white flex items-center gap-1.5"><Shield size={14} className="text-[#75AB61]" /> Admin</h4>
                      <p className="text-xs text-slate-400 mt-1">Acesso total a todas as funcionalidades: Integrações, Faturamento e Gestão de Usuários.</p>
                    </div>
                  </label>
                  <label className={cn(
                    "relative flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all",
                    formData.role === 'User' ? "border-[#75AB61] bg-[#75AB61]/10" : "border-slate-700 bg-slate-800/30 hover:border-slate-600"
                  )}>
                    <input 
                      type="radio" 
                      name="role" 
                      value="User"
                      checked={formData.role === 'User'}
                      onChange={() => setFormData({...formData, role: 'User'})}
                      className="mt-1 accent-[#75AB61]" 
                    />
                    <div>
                      <h4 className="text-sm font-bold text-white flex items-center gap-1.5"><User size={14} className="text-[#75AB61]" /> User</h4>
                      <p className="text-xs text-slate-400 mt-1">Acesso operacional a Leads, Conversas, Campanhas e Qualificação.</p>
                    </div>
                  </label>
                </div>
              </div>

              {!selectedUser && (
                <div className="pt-4 border-t border-slate-700/50">
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <div className="w-5 h-5 rounded border border-slate-600 bg-slate-800 group-hover:border-[#75AB61] flex items-center justify-center relative shrink-0 mt-0.5">
                      <input 
                        type="checkbox" 
                        checked={formData.sendEmail}
                        onChange={(e) => setFormData({...formData, sendEmail: e.target.checked})}
                        className="opacity-0 absolute inset-0 cursor-pointer peer" 
                      />
                      <Check size={14} className={cn("text-[#75AB61] transition-opacity", formData.sendEmail ? "opacity-100" : "opacity-0")} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white group-hover:text-[#75AB61] transition-colors">Enviar e-mail de boas-vindas</p>
                      <p className="text-xs text-slate-400 mt-0.5">O usuário receberá um link para definir a senha e acessar a plataforma.</p>
                    </div>
                  </label>
                </div>
              )}
            </div>

            <div className="p-5 border-t border-[#75AB61]/20 flex justify-end gap-3 rounded-b-2xl bg-[#1A1A2E]">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2.5 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700 rounded-xl transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={handleSaveMember}
                className="px-6 py-2.5 text-sm font-bold text-white bg-[#75AB61] hover:bg-[#5f8c4e] rounded-xl transition-colors shadow-lg shadow-green-900/20"
              >
                {selectedUser ? 'Atualizar Membro' : 'Salvar Membro'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {isDeleteModalOpen && selectedUser && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#1A1A2E] border border-rose-500/30 rounded-2xl shadow-2xl w-full max-w-md p-6 text-center animate-in zoom-in-95">
            <div className="w-16 h-16 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-rose-500/20">
              <Trash2 size={24} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Excluir Usuário</h3>
            <p className="text-slate-400 text-sm mb-6">
              Tem certeza que deseja excluir <strong>{selectedUser.name}</strong>? Esta ação removerá o acesso à plataforma e não poderá ser desfeita. (Histórico de ações será mantido).
            </p>
            <div className="flex gap-3 justify-center">
              <button 
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-5 py-2.5 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700 rounded-xl transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={handleDeleteUser}
                className="px-5 py-2.5 text-sm font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-colors shadow-lg shadow-rose-900/20"
              >
                Sim, Excluir
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Password Modal */}
      {isPasswordModalOpen && selectedUser && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#1A1A2E] border border-cyan-500/30 rounded-2xl shadow-2xl w-full max-w-md p-6 animate-in zoom-in-95">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-cyan-500/10 text-cyan-500 rounded-full flex items-center justify-center border border-cyan-500/20">
                <Key size={18} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Redefinir Senha</h3>
                <p className="text-slate-400 text-xs">Alterar senha para {selectedUser.name}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase">Nova Senha</label>
                <input 
                  type="password" 
                  value={passwordFormData.newPass}
                  onChange={(e) => setPasswordFormData({...passwordFormData, newPass: e.target.value})}
                  className="w-full h-11 bg-slate-800/50 border border-slate-700 rounded-xl px-4 text-sm text-white focus:border-cyan-500 focus:outline-none"
                  placeholder="Mínimo 8 caracteres"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase">Confirmar Nova Senha</label>
                <input 
                  type="password" 
                  value={passwordFormData.confirm}
                  onChange={(e) => setPasswordFormData({...passwordFormData, confirm: e.target.value})}
                  className={cn(
                    "w-full h-11 bg-slate-800/50 border rounded-xl px-4 text-sm text-white focus:outline-none",
                    passwordFormData.confirm && passwordFormData.confirm !== passwordFormData.newPass ? "border-rose-500 focus:border-rose-500" : "border-slate-700 focus:border-cyan-500"
                  )}
                  placeholder="Repita a nova senha"
                />
                {passwordFormData.confirm && passwordFormData.confirm !== passwordFormData.newPass && (
                  <p className="text-[10px] text-rose-500 mt-1">As senhas não coincidem.</p>
                )}
              </div>
            </div>

            <div className="flex gap-3 justify-end mt-8">
              <button 
                onClick={() => setIsPasswordModalOpen(false)}
                className="px-5 py-2.5 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700 rounded-xl transition-colors"
              >
                Cancelar
              </button>
              <button 
                disabled={!passwordFormData.newPass || (passwordFormData.newPass !== passwordFormData.confirm)}
                onClick={() => {
                  setIsPasswordModalOpen(false);
                  // Mock change password success
                }}
                className="px-5 py-2.5 text-sm font-bold text-white bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-colors shadow-lg shadow-cyan-900/20"
              >
                Salvar Nova Senha
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

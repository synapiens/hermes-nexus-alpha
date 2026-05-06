import React, { useState, useEffect } from 'react';
import { Search, Filter, Download, MessageCircle, Thermometer, User, Instagram, Globe, X, Calendar, DollarSign, Activity, Tag, BarChart, Phone, Mail, MapPin, Building, Target, CheckCircle2, Edit2, Save, Plus, RefreshCw } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useOrganization } from '../contexts/OrganizationContext';
import { cn } from '../lib/utils';

export function Leads() {
  const { organization } = useOrganization();
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<any | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<any>({});
  
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    if (organization?.id) {
      fetchLeads();
    }
  }, [organization?.id]);

  const fetchLeads = async () => {
    if (!organization?.id) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('organization_id', organization.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;

      if (data) {
        setLeads(data);
      }
    } catch (err) {
      console.error('Error fetching leads:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatPhone = (phone: string) => {
    if (!phone) return 'S/ contato';
    const cleaned = phone.replace(/\D/g, '');
    let digits = cleaned;
    if (cleaned.startsWith('55') && cleaned.length > 10) {
      digits = cleaned.slice(2);
    }
    if (digits.length !== 11 && digits.length !== 10) return phone;
    const ddd = digits.slice(0, 2);
    const part1 = digits.length === 11 ? digits.slice(2, 7) : digits.slice(2, 6);
    const part2 = digits.length === 11 ? digits.slice(7) : digits.slice(6);
    return `+55 ${ddd} ${part1}-${part2}`;
  };

  const getStatusColor = (status: string) => {
    switch(status) {
        case 'Novo': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
        case 'Em Atendimento': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
        case 'Qualificado': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
        case 'Convertido': return 'bg-[#75AB61]/20 text-[#75AB61] border-[#75AB61]/30';
        case 'Perdido': return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
        default: return 'bg-slate-700/50 text-slate-400 border-slate-600/50';
    }
  };

  const handleEditClick = (lead: any) => {
    setEditForm({ ...lead });
    setIsEditing(true);
  };

  const handleSaveEdit = async () => {
    if (!organization?.id || !editForm?.id) return;

    try {
      const dbUpdate = {
        name: editForm.name,
        email: editForm.email,
        contact: editForm.contact,
        status: editForm.status,
        temperature: editForm.temperature,
        humor: editForm.humor,
        source: editForm.source,
        avatar_url: editForm.avatar_url,
        wht_id: editForm.wht_id,
        wht_lid: editForm.wht_lid,
        wht_cnt_nome: editForm.wht_cnt_nome,
      };

      const { error } = await supabase
        .from('leads')
        .update(dbUpdate)
        .eq('id', editForm.id)
        .eq('organization_id', organization.id);

      if (error) throw error;

      fetchLeads();
      setIsEditing(false);
      setSelectedLead(null);
    } catch (err) {
      console.error('Error updating lead:', err);
      alert('Erro ao atualizar lead.');
    }
  };

  const handleCreateLead = async () => {
    if (!organization?.id) return;

    try {
      const dbLead = {
        organization_id: organization.id,
        name: editForm.name,
        email: editForm.email,
        contact: editForm.contact,
        status: editForm.status || 'Novo',
        temperature: editForm.temperature || 'Frio',
        humor: editForm.humor || 'Neutro',
        source: editForm.source || 'Direto',
        avatar_url: editForm.avatar_url || '',
        wht_id: editForm.wht_id || null,
        wht_lid: editForm.wht_lid || null,
        wht_cnt_nome: editForm.wht_cnt_nome || null,
      };

      const { error } = await supabase
        .from('leads')
        .insert([dbLead]);

      if (error) throw error;

      fetchLeads();
      setIsAdding(false);
      setEditForm({});
    } catch (err) {
      console.error('Error creating lead:', err);
      alert('Erro ao criar lead.');
    }
  };

  return (
    <div className="space-y-6 h-full flex flex-col relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Gestão de Leads</h1>
          <p className="text-slate-400 text-sm mt-1">Acompanhamento e perfil de contatos</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={fetchLeads}
            disabled={loading}
            className="flex items-center justify-center bg-slate-800/50 hover:bg-slate-700 text-slate-300 h-9 w-9 rounded-lg transition-colors border border-slate-700 disabled:opacity-50"
            title="Atualizar leads"
          >
            <RefreshCw size={16} className={cn(loading && "animate-spin")} />
          </button>
          <button 
            onClick={() => { setEditForm({ status: 'Novo', temperature: 'Frio', humor: 'Neutro', source: 'Direto' }); setIsAdding(true); }}
            className="flex items-center gap-2 bg-[#75AB61] hover:bg-[#60914E] text-[#0b1120] font-bold px-3 py-2 rounded-lg text-sm transition-colors shadow-[0_0_15px_rgba(117,171,97,0.3)] border-transparent"
          >
            <Plus size={16} /> Novo Lead
          </button>
          <button className="flex items-center gap-2 bg-slate-800/50 hover:bg-slate-700 text-slate-300 px-3 py-2 rounded-lg text-sm transition-colors border border-slate-700">
            <Download size={16} /> Exportar
          </button>
        </div>
      </div>

      <div className="card-surface rounded-xl p-4 flex flex-wrap gap-3 items-center justify-between">
        <div className="flex items-center gap-3 flex-1 min-w-[200px]">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Buscar por nome, contato..."
              className="w-full h-10 rounded-lg border border-slate-700 bg-slate-800/50 pl-9 pr-4 text-sm text-white placeholder-slate-400 focus:border-[#75AB61] focus:outline-none focus:ring-1 focus:ring-[#75AB61]"
            />
          </div>
          <button className="flex items-center gap-2 bg-slate-800/50 hover:bg-slate-700 text-white px-3 h-10 rounded-lg text-sm border border-slate-700">
            <Filter size={16} /> Filtros
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto pb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {leads.map((lead) => (
            <div key={lead.id} className="card-surface rounded-xl p-5 hover:border-[#75AB61]/50 transition-colors group">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-slate-700 overflow-hidden border border-[#75AB61]/30 flex items-center justify-center">
                    {lead.avatar_url ? (
                      <img src={lead.avatar_url} alt={lead.name} className="h-full w-full object-cover" />
                    ) : (
                      <span className="text-lg font-bold text-white uppercase brand-gradient w-full h-full flex items-center justify-center">
                        {lead.name ? lead.name.charAt(0) : '?'}
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base">{lead.name}</h3>
                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                      <Globe size={12} className="text-slate-500" />
                      <span className="capitalize">{lead.source || 'Direto'}</span>
                    </div>
                  </div>
                </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className={cn("px-2 py-0.5 rounded text-[10px] uppercase font-bold border", getStatusColor(lead.status))}>
                      {lead.status}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm" title={lead.humor}>
                        {lead.humor === 'Satisfeito' ? '😊' : lead.humor === 'Insatisfeito' ? '😠' : '😐'}
                      </span>
                      <div className="flex items-center gap-1">
                        <Thermometer 
                          size={12} 
                          className={
                            lead.temperature === 'Quente' ? 'text-rose-400' : 
                            lead.temperature === 'Morno' ? 'text-amber-400' : 'text-blue-400'
                          } 
                        />
                        <span className="text-[10px] font-bold uppercase text-slate-400">{lead.temperature}</span>
                      </div>
                    </div>
                  </div>
              </div>
              
              <div className="bg-slate-800/30 rounded-lg p-3 border border-slate-700/30 mb-4 h-[70px] flex flex-col justify-center">
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <Phone size={12} className="text-slate-500" />
                  <span>{formatPhone(lead.contact)}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-300 mt-1">
                  <Mail size={12} className="text-slate-500" />
                  <span className="truncate">{lead.email || 'S/ e-mail'}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-end">
                <button 
                  onClick={() => setSelectedLead(lead)}
                  className="text-xs bg-slate-800 hover:bg-slate-700 focus:outline-none text-white px-3 py-1.5 rounded transition-colors border border-slate-700"
                >
                  Ver Perfil
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* LEAD PROFILE MODAL */}
      {(selectedLead || isAdding) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#111A22] border border-slate-700 rounded-2xl w-full max-w-4xl shadow-2xl flex flex-col max-h-full h-[80vh]">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-700/50 bg-[#0b1120]/50 rounded-t-2xl shrink-0">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full overflow-hidden flex items-center justify-center bg-slate-700 border border-[#75AB61]/30">
                  {(isAdding ? false : selectedLead?.avatar_url) ? (
                    <img src={selectedLead.avatar_url} alt="Lead" className="h-full w-full object-cover" />
                  ) : (
                    <User size={24} className="text-slate-400" />
                  )}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white leading-tight">
                    {isAdding ? 'Novo Lead' : (isEditing ? 'Editar Lead' : selectedLead?.name)}
                  </h2>
                  {!isAdding && !isEditing && selectedLead && (
                    <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                      <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider">{selectedLead.status}</span>
                      <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                      <span className="flex items-center gap-1.5">{selectedLead.source}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3">
                {!isAdding && !isEditing && (
                  <button onClick={() => handleEditClick(selectedLead)} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-bold rounded-lg transition-colors border border-slate-700 flex items-center gap-2">
                    <Edit2 size={16} /> Editar
                  </button>
                )}
                {(isEditing || isAdding) && (
                  <button onClick={isAdding ? handleCreateLead : handleSaveEdit} className="px-4 py-2 bg-[#75AB61] hover:bg-[#60914E] text-[#0b1120] text-sm font-bold rounded-lg transition-colors shadow-[0_0_15px_rgba(117,171,97,0.3)] border-transparent flex items-center gap-2">
                    <Save size={16} /> Salvar
                  </button>
                )}

                <button 
                  onClick={() => { setSelectedLead(null); setIsEditing(false); setIsAdding(false); setEditForm({}); }}
                  className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors ml-2"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Modal Content - Scrollable */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
              
              {(isEditing || isAdding) ? (
                // EDIT / CREATE FORM
                <div className="space-y-6">
                  <div className="card-surface rounded-xl p-5 border border-slate-700/50">
                    <h3 className="text-sm font-bold text-white mb-4 border-b border-slate-700/50 pb-2">Informações Principais</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="sm:col-span-2">
                        <label className="block text-xs text-slate-400 font-bold mb-1">Nome Completo</label>
                        <input type="text" value={editForm.name || ''} onChange={e => setEditForm({...editForm, name: e.target.value})} className="w-full h-10 rounded-lg border border-slate-700 bg-slate-800/50 px-3 text-sm text-white focus:border-[#75AB61] focus:outline-none placeholder-slate-600" placeholder="Nome do lead" />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-400 font-bold mb-1">E-mail</label>
                        <input type="email" value={editForm.email || ''} onChange={e => setEditForm({...editForm, email: e.target.value})} className="w-full h-10 rounded-lg border border-slate-700 bg-slate-800/50 px-3 text-sm text-white focus:border-[#75AB61] focus:outline-none placeholder-slate-600" placeholder="email@exemplo.com" />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-400 font-bold mb-1">Contato (Telefone)</label>
                        <input type="text" value={editForm.contact || ''} onChange={e => setEditForm({...editForm, contact: e.target.value})} className="w-full h-10 rounded-lg border border-slate-700 bg-slate-800/50 px-3 text-sm text-white focus:border-[#75AB61] focus:outline-none placeholder-slate-600" placeholder="(00) 00000-0000" />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-400 font-bold mb-1">Status</label>
                        <select value={editForm.status || 'Novo'} onChange={e => setEditForm({...editForm, status: e.target.value})} className="w-full h-10 rounded-lg border border-slate-700 bg-slate-800/50 px-3 text-sm text-white focus:border-[#75AB61] focus:outline-none">
                          <option value="Novo">Novo</option>
                          <option value="Em Atendimento">Em Atendimento</option>
                          <option value="Qualificado">Qualificado</option>
                          <option value="Convertido">Convertido</option>
                          <option value="Perdido">Perdido</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs text-slate-400 font-bold mb-1">Temperatura</label>
                        <select value={editForm.temperature || 'Frio'} onChange={e => setEditForm({...editForm, temperature: e.target.value})} className="w-full h-10 rounded-lg border border-slate-700 bg-slate-800/50 px-3 text-sm text-white focus:border-[#75AB61] focus:outline-none">
                          <option value="Frio">Frio</option>
                          <option value="Morno">Morno</option>
                          <option value="Quente">Quente</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs text-slate-400 font-bold mb-1">Humor (Sentimento)</label>
                        <select value={editForm.humor || 'Neutro'} onChange={e => setEditForm({...editForm, humor: e.target.value})} className="w-full h-10 rounded-lg border border-slate-700 bg-slate-800/50 px-3 text-sm text-white focus:border-[#75AB61] focus:outline-none">
                          <option value="Satisfeito">😊 Satisfeito</option>
                          <option value="Neutro">😐 Neutro</option>
                          <option value="Insatisfeito">😠 Insatisfeito</option>
                        </select>
                      </div>
                      <div>
                         <label className="block text-xs text-slate-400 font-bold mb-1">Origem / Canal</label>
                         <input type="text" value={editForm.source || ''} onChange={e => setEditForm({...editForm, source: e.target.value})} className="w-full h-10 rounded-lg border border-slate-700 bg-slate-800/50 px-3 text-sm text-white focus:border-[#75AB61] focus:outline-none placeholder-slate-600" placeholder="Ex: Instagram, Direto, etc" />
                      </div>
                      <div>
                         <label className="block text-xs text-slate-400 font-bold mb-1">Avatar URL</label>
                         <input type="text" value={editForm.avatar_url || ''} onChange={e => setEditForm({...editForm, avatar_url: e.target.value})} className="w-full h-10 rounded-lg border border-slate-700 bg-slate-800/50 px-3 text-sm text-white focus:border-[#75AB61] focus:outline-none placeholder-slate-600" placeholder="https://..." />
                      </div>
                      <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                           <label className="block text-xs text-slate-400 font-bold mb-1">WhatsApp ID</label>
                           <input type="text" value={editForm.wht_id || ''} onChange={e => setEditForm({...editForm, wht_id: e.target.value})} className="w-full h-10 rounded-lg border border-slate-700 bg-slate-800/50 px-3 text-sm text-white focus:border-[#75AB61] focus:outline-none placeholder-slate-600" placeholder="ID" />
                        </div>
                        <div>
                           <label className="block text-xs text-slate-400 font-bold mb-1">WhatsApp LID</label>
                           <input type="text" value={editForm.wht_lid || ''} onChange={e => setEditForm({...editForm, wht_lid: e.target.value})} className="w-full h-10 rounded-lg border border-slate-700 bg-slate-800/50 px-3 text-sm text-white focus:border-[#75AB61] focus:outline-none placeholder-slate-600" placeholder="LID" />
                        </div>
                        <div>
                           <label className="block text-xs text-slate-400 font-bold mb-1">WhatsApp Nome Contato</label>
                           <input type="text" value={editForm.wht_cnt_nome || ''} onChange={e => setEditForm({...editForm, wht_cnt_nome: e.target.value})} className="w-full h-10 rounded-lg border border-slate-700 bg-slate-800/50 px-3 text-sm text-white focus:border-[#75AB61] focus:outline-none placeholder-slate-600" placeholder="Nome" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                // VIEW PROFILE
                selectedLead && (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="space-y-6">
                      <div className="card-surface rounded-xl p-5 border border-slate-700/50 space-y-4">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Contato</h3>
                        <div className="space-y-3">
                          <div className="flex items-center gap-3 text-sm text-slate-300">
                            <Phone size={16} className="text-slate-500" />
                            <span>{formatPhone(selectedLead.contact)}</span>
                          </div>
                          <div className="flex items-center gap-3 text-sm text-slate-300">
                            <Mail size={16} className="text-slate-500" />
                            <span className="truncate">{selectedLead.email || 'Não informado'}</span>
                          </div>
                        </div>
                      </div>

                      <div className="card-surface rounded-xl p-5 border border-slate-700/50 space-y-4">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Classificação</h3>
                        <div className="grid grid-cols-1 gap-3">
                           <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
                             <span className="block text-[10px] text-slate-400 uppercase font-semibold mb-1">Status Atual</span>
                             <span className={cn("inline-block px-2 py-0.5 rounded text-xs font-bold border mt-1", getStatusColor(selectedLead.status))}>
                                {selectedLead.status}
                             </span>
                           </div>
                           <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
                             <span className="block text-[10px] text-slate-400 uppercase font-semibold mb-1">Temperatura</span>
                             <span className="flex items-center gap-1.5 text-sm font-bold capitalize text-white">
                                <Thermometer size={14} className={selectedLead.temperature === 'Quente' ? 'text-rose-400' : selectedLead.temperature === 'Morno' ? 'text-amber-400' : 'text-blue-400'} />
                                {selectedLead.temperature}
                             </span>
                           </div>
                           <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
                             <span className="block text-[10px] text-slate-400 uppercase font-semibold mb-1">Humor / Sentimento</span>
                             <span className="flex items-center gap-2 text-sm font-bold text-white mt-1">
                                <span className="text-xl">
                                  {selectedLead.humor === 'Satisfeito' ? '😊' : selectedLead.humor === 'Insatisfeito' ? '😠' : '😐'}
                                </span>
                                {selectedLead.humor || 'Neutro'}
                             </span>
                           </div>
                           <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
                             <span className="block text-[10px] text-slate-400 uppercase font-semibold mb-1">Criado em</span>
                             <span className="flex items-center gap-1.5 text-xs font-bold text-white">
                                <Calendar size={14} className="text-slate-500" />
                                {new Date(selectedLead.created_at).toLocaleDateString('pt-BR')}
                             </span>
                           </div>
                        </div>
                      </div>
                    </div>

                    <div className="lg:col-span-2 space-y-6">
                      <div className="card-surface rounded-xl p-6 border border-slate-700/50">
                        <h3 className="text-sm font-bold text-white mb-4">Detalhes Adicionais</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          <div>
                            <span className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Origem do Lead</span>
                            <div className="flex items-center gap-2 text-sm font-bold text-white">
                              <Globe size={16} className="text-blue-400" />
                              {selectedLead.source}
                            </div>
                          </div>
                          <div>
                            <span className="block text-[10px] text-slate-400 uppercase font-bold mb-1">ID Externo (WhatsApp)</span>
                            <div className="text-sm font-mono text-slate-300 bg-slate-800/50 px-2 py-1 rounded border border-slate-700 flex items-center justify-between">
                              {selectedLead.wht_id || 'Não disponível'}
                            </div>
                          </div>
                          <div>
                            <span className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Lead ID WhatsApp (LID)</span>
                            <div className="text-sm font-mono text-slate-300 bg-slate-800/50 px-2 py-1 rounded border border-slate-700 flex items-center justify-between">
                              {selectedLead.wht_lid || 'Não disponível'}
                            </div>
                          </div>
                          <div className="sm:col-span-2">
                             <span className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Nome de Contato WhatsApp</span>
                             <div className="text-sm text-slate-300">
                               {selectedLead.wht_cnt_nome || 'Nenhum'}
                             </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-[#75AB61]/10 rounded-xl p-5 border border-[#75AB61]/20">
                         <div className="flex items-center gap-4">
                           <div className="w-10 h-10 rounded-full bg-[#75AB61]/20 border border-[#75AB61]/30 flex items-center justify-center text-[#75AB61] shrink-0">
                             <MessageCircle size={20} />
                           </div>
                           <div>
                             <h3 className="text-sm font-bold text-white mb-0.5">Integrar com Chat</h3>
                             <p className="text-xs text-slate-400">Você pode iniciar uma conversa com este lead através dos canais conectados.</p>
                           </div>
                         </div>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}



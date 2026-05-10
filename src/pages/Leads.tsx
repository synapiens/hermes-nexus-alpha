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
        case 'Novo': return 'bg-brand-secondary/20 text-brand-secondary border-brand-secondary/30';
        case 'Em Atendimento': return 'bg-brand-tertiary/20 text-brand-tertiary border-brand-tertiary/30';
        case 'Qualificado': return 'bg-brand-primary/20 text-brand-primary border-brand-primary/30';
        case 'Convertido': return 'bg-status-success/20 text-status-success border-status-success/30';
        case 'Perdido': return 'bg-status-failure/20 text-status-failure border-status-failure/30';
        default: return 'bg-surface-muted/50 text-brand-muted border-surface-border';
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
          <h1 className="text-2xl font-bold text-brand-light font-display">Gestão de Leads</h1>
          <p className="text-brand-muted text-sm mt-1">Acompanhamento e perfil de contatos</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={fetchLeads}
            disabled={loading}
            className="flex items-center justify-center bg-surface-muted/50 hover:bg-surface-muted text-brand-muted h-9 w-9 rounded-lg transition-colors border border-surface-border disabled:opacity-50"
            title="Atualizar leads"
          >
            <RefreshCw size={16} className={cn(loading && "animate-spin")} />
          </button>
          <button 
            onClick={() => { setEditForm({ status: 'Novo', temperature: 'Frio', humor: 'Neutro', source: 'Direto' }); setIsAdding(true); }}
            className="flex items-center gap-2 bg-brand-primary hover:bg-brand-primary/80 text-brand-on-primary font-bold px-4 py-2 rounded-lg text-sm transition-all shadow-[0_0_15px_rgba(42,75,51,0.3)] border-transparent"
          >
            <Plus size={16} /> Novo Lead
          </button>
          <button className="flex items-center gap-2 bg-surface-muted/50 hover:bg-surface-muted text-brand-muted px-4 py-2 rounded-lg text-sm transition-colors border border-surface-border">
            <Download size={16} /> Exportar
          </button>
        </div>
      </div>

      <div className="card-surface rounded-xl p-4 flex flex-wrap gap-3 items-center justify-between">
        <div className="flex items-center gap-3 flex-1 min-w-[200px]">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted" size={16} />
            <input 
              type="text" 
              placeholder="Buscar por nome, contato..."
              className="w-full h-10 rounded-lg border border-surface-border bg-surface-muted/50 pl-9 pr-4 text-sm text-brand-light placeholder-brand-muted/70 focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary transition-all"
            />
          </div>
          <button className="flex items-center gap-2 bg-surface-muted/50 hover:bg-surface-muted text-brand-light px-4 h-10 rounded-lg text-sm border border-surface-border">
            <Filter size={16} /> Filtros
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto pb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {leads.map((lead) => (
            <div key={lead.id} className="card-surface rounded-xl p-5 hover:border-brand-primary/50 transition-all group hover:translate-y-[-2px]">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-surface-muted overflow-hidden border border-brand-primary/30 flex items-center justify-center">
                    {lead.avatar_url ? (
                      <img src={lead.avatar_url} alt={lead.name} className="h-full w-full object-cover" />
                    ) : (
                      <span className="text-lg font-bold text-brand-light uppercase bg-brand-primary w-full h-full flex items-center justify-center font-display">
                        {lead.name ? lead.name.charAt(0) : '?'}
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-brand-light text-base font-display">{lead.name}</h3>
                    <div className="flex items-center gap-2 text-[10px] text-brand-muted mt-0.5 font-bold uppercase tracking-wider">
                      <Globe size={11} className="text-brand-primary" />
                      <span>{lead.source || 'Direto'}</span>
                    </div>
                  </div>
                </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <span className={cn("px-2 py-0.5 rounded text-[9px] uppercase font-bold border tracking-tighter", getStatusColor(lead.status))}>
                      {lead.status}
                    </span>
                    <div className="flex items-center gap-2.5">
                      <span className="text-sm bg-surface-muted w-6 h-6 flex items-center justify-center rounded-full" title={lead.humor}>
                        {lead.humor === 'Satisfeito' ? '😊' : lead.humor === 'Insatisfeito' ? '😠' : '😐'}
                      </span>
                      <div className="flex items-center gap-1 bg-surface-muted px-1.5 py-0.5 rounded-full border border-surface-border">
                        <Thermometer 
                          size={11} 
                          className={
                            lead.temperature === 'Quente' ? 'text-status-failure' : 
                            lead.temperature === 'Morno' ? 'text-brand-tertiary' : 'text-brand-secondary'
                          } 
                        />
                        <span className="text-[9px] font-bold uppercase text-brand-muted tracking-tight">{lead.temperature}</span>
                      </div>
                    </div>
                  </div>
              </div>
              
              <div className="bg-surface-muted/30 rounded-lg p-3 border border-surface-border mb-4 h-[70px] flex flex-col justify-center">
                <div className="flex items-center gap-2 text-xs text-brand-light/90 font-medium tracking-tight">
                  <Phone size={12} className="text-brand-primary/70" />
                  <span>{formatPhone(lead.contact)}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-brand-muted mt-1.5">
                  <Mail size={12} className="text-brand-primary/70" />
                  <span className="truncate">{lead.email || 'S/ e-mail'}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-end">
                <button 
                  onClick={() => setSelectedLead(lead)}
                  className="text-[11px] font-bold uppercase tracking-wider bg-surface-muted hover:bg-brand-primary hover:text-brand-light focus:outline-none text-brand-muted px-4 py-2 rounded-lg transition-all border border-surface-border"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-surface-base border border-surface-border rounded-2xl w-full max-w-4xl shadow-[0_0_50px_rgba(42,75,51,0.2)] flex flex-col max-h-full h-[85vh] overflow-hidden">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-surface-border bg-surface-base/80 rounded-t-2xl shrink-0">
              <div className="flex items-center gap-5">
                <div className="h-14 w-14 rounded-full overflow-hidden flex items-center justify-center bg-surface-muted border-2 border-brand-primary/30">
                  {(isAdding ? false : selectedLead?.avatar_url) ? (
                    <img src={selectedLead.avatar_url} alt="Lead" className="h-full w-full object-cover" />
                  ) : (
                    <User size={28} className="text-brand-muted" />
                  )}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-brand-light leading-tight font-display">
                    {isAdding ? 'Novo Lead' : (isEditing ? 'Editar Lead' : selectedLead?.name)}
                  </h2>
                  {!isAdding && !isEditing && selectedLead && (
                    <div className="flex items-center gap-3 text-[10px] text-brand-muted mt-1.5 font-bold uppercase tracking-[0.1em]">
                      <span className="text-brand-primary">{selectedLead.status}</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-surface-border"></span>
                      <span>{selectedLead.source}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3">
                {!isAdding && !isEditing && (
                  <button onClick={() => handleEditClick(selectedLead)} className="px-5 py-2.5 bg-surface-muted hover:bg-surface-border text-brand-light text-xs font-bold uppercase tracking-wider rounded-xl transition-all border border-surface-border flex items-center gap-2">
                    <Edit2 size={16} className="text-brand-primary" /> Editar
                  </button>
                )}
                {(isEditing || isAdding) && (
                  <button onClick={isAdding ? handleCreateLead : handleSaveEdit} className="px-5 py-2.5 bg-brand-primary hover:bg-brand-primary/80 text-brand-on-primary text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-lg border-transparent flex items-center gap-2">
                    <Save size={16} /> Salvar
                  </button>
                )}

                <button 
                  onClick={() => { setSelectedLead(null); setIsEditing(false); setIsAdding(false); setEditForm({}); }}
                  className="p-2.5 text-brand-muted hover:text-brand-light hover:bg-surface-muted rounded-xl transition-all ml-2"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            {/* Modal Content - Scrollable */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
              
              {(isEditing || isAdding) ? (
                // EDIT / CREATE FORM
                <div className="space-y-8">
                  <div className="card-surface rounded-2xl p-6 border border-surface-border">
                    <h3 className="text-xs font-bold text-brand-light uppercase tracking-widest mb-6 border-b border-surface-border pb-3">Informações Principais</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="sm:col-span-2">
                        <label className="block text-[10px] text-brand-muted font-bold uppercase tracking-wider mb-2">Nome Completo</label>
                        <input type="text" value={editForm.name || ''} onChange={e => setEditForm({...editForm, name: e.target.value})} className="w-full h-11 rounded-xl border border-surface-border bg-surface-muted/30 px-4 text-sm text-brand-light focus:border-brand-primary focus:outline-none placeholder-brand-muted/50 transition-all" placeholder="Nome do lead" />
                      </div>
                      <div>
                        <label className="block text-[10px] text-brand-muted font-bold uppercase tracking-wider mb-2">E-mail</label>
                        <input type="email" value={editForm.email || ''} onChange={e => setEditForm({...editForm, email: e.target.value})} className="w-full h-11 rounded-xl border border-surface-border bg-surface-muted/30 px-4 text-sm text-brand-light focus:border-brand-primary focus:outline-none placeholder-brand-muted/50 transition-all" placeholder="email@exemplo.com" />
                      </div>
                      <div>
                        <label className="block text-[10px] text-brand-muted font-bold uppercase tracking-wider mb-2">Contato (Telefone)</label>
                        <input type="text" value={editForm.contact || ''} onChange={e => setEditForm({...editForm, contact: e.target.value})} className="w-full h-11 rounded-xl border border-surface-border bg-surface-muted/30 px-4 text-sm text-brand-light focus:border-brand-primary focus:outline-none placeholder-brand-muted/50 transition-all" placeholder="(00) 00000-0000" />
                      </div>
                      <div>
                        <label className="block text-[10px] text-brand-muted font-bold uppercase tracking-wider mb-2">Status</label>
                        <select value={editForm.status || 'Novo'} onChange={e => setEditForm({...editForm, status: e.target.value})} className="w-full h-11 rounded-xl border border-surface-border bg-surface-muted/30 px-4 text-sm text-brand-light focus:border-brand-primary focus:outline-none transition-all appearance-none">
                          <option value="Novo">Novo</option>
                          <option value="Em Atendimento">Em Atendimento</option>
                          <option value="Qualificado">Qualificado</option>
                          <option value="Convertido">Convertido</option>
                          <option value="Perdido">Perdido</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] text-brand-muted font-bold uppercase tracking-wider mb-2">Temperatura</label>
                        <select value={editForm.temperature || 'Frio'} onChange={e => setEditForm({...editForm, temperature: e.target.value})} className="w-full h-11 rounded-xl border border-surface-border bg-surface-muted/30 px-4 text-sm text-brand-light focus:border-brand-primary focus:outline-none transition-all appearance-none">
                          <option value="Frio">Frio</option>
                          <option value="Morno">Morno</option>
                          <option value="Quente">Quente</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] text-brand-muted font-bold uppercase tracking-wider mb-2">Humor (Sentimento)</label>
                        <select value={editForm.humor || 'Neutro'} onChange={e => setEditForm({...editForm, humor: e.target.value})} className="w-full h-11 rounded-xl border border-surface-border bg-surface-muted/30 px-4 text-sm text-brand-light focus:border-brand-primary focus:outline-none transition-all appearance-none">
                          <option value="Satisfeito">😊 Satisfeito</option>
                          <option value="Neutro">😐 Neutro</option>
                          <option value="Insatisfeito">😠 Insatisfeito</option>
                        </select>
                      </div>
                      <div>
                         <label className="block text-[10px] text-brand-muted font-bold uppercase tracking-wider mb-2">Origem / Canal</label>
                         <input type="text" value={editForm.source || ''} onChange={e => setEditForm({...editForm, source: e.target.value})} className="w-full h-11 rounded-xl border border-surface-border bg-surface-muted/30 px-4 text-sm text-brand-light focus:border-brand-primary focus:outline-none placeholder-brand-muted/50 transition-all" placeholder="Ex: Instagram, Direto, etc" />
                      </div>
                      <div>
                         <label className="block text-[10px] text-brand-muted font-bold uppercase tracking-wider mb-2">Avatar URL</label>
                         <input type="text" value={editForm.avatar_url || ''} onChange={e => setEditForm({...editForm, avatar_url: e.target.value})} className="w-full h-11 rounded-xl border border-surface-border bg-surface-muted/30 px-4 text-sm text-brand-light focus:border-brand-primary focus:outline-none placeholder-brand-muted/50 transition-all" placeholder="https://..." />
                      </div>
                      <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <div>
                           <label className="block text-[10px] text-brand-muted font-bold uppercase tracking-wider mb-2">WhatsApp ID</label>
                           <input type="text" value={editForm.wht_id || ''} onChange={e => setEditForm({...editForm, wht_id: e.target.value})} className="w-full h-11 rounded-xl border border-surface-border bg-surface-muted/30 px-4 text-sm text-brand-light focus:border-brand-primary focus:outline-none placeholder-brand-muted/50 transition-all" placeholder="ID" />
                        </div>
                        <div>
                           <label className="block text-[10px] text-brand-muted font-bold uppercase tracking-wider mb-2">WhatsApp LID</label>
                           <input type="text" value={editForm.wht_lid || ''} onChange={e => setEditForm({...editForm, wht_lid: e.target.value})} className="w-full h-11 rounded-xl border border-surface-border bg-surface-muted/30 px-4 text-sm text-brand-light focus:border-brand-primary focus:outline-none placeholder-brand-muted/50 transition-all" placeholder="LID" />
                        </div>
                        <div>
                           <label className="block text-[10px] text-brand-muted font-bold uppercase tracking-wider mb-2">WhatsApp Nome Contato</label>
                           <input type="text" value={editForm.wht_cnt_nome || ''} onChange={e => setEditForm({...editForm, wht_cnt_nome: e.target.value})} className="w-full h-11 rounded-xl border border-surface-border bg-surface-muted/30 px-4 text-sm text-brand-light focus:border-brand-primary focus:outline-none placeholder-brand-muted/50 transition-all" placeholder="Nome" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                // VIEW PROFILE
                selectedLead && (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="space-y-6">
                      <div className="card-surface rounded-2xl p-6 border border-surface-border space-y-5">
                        <h3 className="text-[10px] font-bold text-brand-muted uppercase tracking-widest mb-2 px-1">Contato</h3>
                        <div className="space-y-4">
                          <div className="flex items-center gap-4 text-sm text-brand-light font-medium">
                            <div className="w-8 h-8 rounded-lg bg-surface-muted flex items-center justify-center border border-surface-border">
                              <Phone size={16} className="text-brand-primary" />
                            </div>
                            <span>{formatPhone(selectedLead.contact)}</span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-brand-light font-medium">
                            <div className="w-8 h-8 rounded-lg bg-surface-muted flex items-center justify-center border border-surface-border">
                              <Mail size={16} className="text-brand-primary" />
                            </div>
                            <span className="truncate">{selectedLead.email || 'Não informado'}</span>
                          </div>
                        </div>
                      </div>

                      <div className="card-surface rounded-2xl p-6 border border-surface-border space-y-6">
                        <h3 className="text-[10px] font-bold text-brand-muted uppercase tracking-widest mb-2 px-1">Classificação</h3>
                        <div className="grid grid-cols-1 gap-4">
                           <div className="bg-surface-muted/30 p-4 rounded-xl border border-surface-border">
                             <span className="block text-[9px] text-brand-muted uppercase font-bold tracking-wider mb-2">Status Atual</span>
                             <span className={cn("inline-block px-3 py-1 rounded text-[10px] font-bold uppercase tracking-tighter border", getStatusColor(selectedLead.status))}>
                                {selectedLead.status}
                             </span>
                           </div>
                           <div className="bg-surface-muted/30 p-4 rounded-xl border border-surface-border">
                             <span className="block text-[9px] text-brand-muted uppercase font-bold tracking-wider mb-2">Temperatura</span>
                             <span className="flex items-center gap-2 text-sm font-bold uppercase tracking-tight text-brand-light font-display">
                                <Thermometer size={16} className={selectedLead.temperature === 'Quente' ? 'text-status-failure' : selectedLead.temperature === 'Morno' ? 'text-brand-tertiary' : 'text-brand-secondary'} />
                                {selectedLead.temperature}
                             </span>
                           </div>
                           <div className="bg-surface-muted/30 p-4 rounded-xl border border-surface-border">
                             <span className="block text-[9px] text-brand-muted uppercase font-bold tracking-wider mb-2">Humor / Sentimento</span>
                             <span className="flex items-center gap-3 text-sm font-bold text-brand-light mt-1 font-display">
                                <span className="text-2xl bg-surface-base w-10 h-10 flex items-center justify-center rounded-full shadow-inner">
                                  {selectedLead.humor === 'Satisfeito' ? '😊' : selectedLead.humor === 'Insatisfeito' ? '😠' : '😐'}
                                </span>
                                {selectedLead.humor || 'Neutro'}
                             </span>
                           </div>
                           <div className="bg-surface-muted/30 p-4 rounded-xl border border-surface-border">
                             <span className="block text-[9px] text-brand-muted uppercase font-bold tracking-wider mb-2">Criado em</span>
                             <span className="flex items-center gap-2 text-xs font-bold text-brand-light font-display">
                                <Calendar size={16} className="text-brand-primary" />
                                {new Date(selectedLead.created_at).toLocaleDateString('pt-BR')}
                             </span>
                           </div>
                        </div>
                      </div>
                    </div>

                    <div className="lg:col-span-2 space-y-8">
                      <div className="card-surface rounded-2xl p-8 border border-surface-border">
                        <h3 className="text-sm font-bold text-brand-light uppercase tracking-widest mb-8 border-b border-surface-border pb-4">Detalhes Adicionais</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                          <div>
                            <span className="block text-[9px] text-brand-muted uppercase font-bold tracking-widest mb-2">Origem do Lead</span>
                            <div className="flex items-center gap-3 text-sm font-bold text-brand-light font-display">
                              <Globe size={18} className="text-brand-secondary" />
                              {selectedLead.source}
                            </div>
                          </div>
                          <div>
                            <span className="block text-[9px] text-brand-muted uppercase font-bold tracking-widest mb-2">ID Externo (WhatsApp)</span>
                            <div className="text-xs font-mono text-brand-muted bg-surface-muted px-3 py-2 rounded-lg border border-surface-border">
                              {selectedLead.wht_id || 'Não disponível'}
                            </div>
                          </div>
                          <div>
                            <span className="block text-[9px] text-brand-muted uppercase font-bold tracking-widest mb-2">Lead ID WhatsApp (LID)</span>
                            <div className="text-xs font-mono text-brand-muted bg-surface-muted px-3 py-2 rounded-lg border border-surface-border">
                              {selectedLead.wht_lid || 'Não disponível'}
                            </div>
                          </div>
                          <div className="sm:col-span-2">
                             <span className="block text-[9px] text-brand-muted uppercase font-bold tracking-widest mb-2">Nome de Contato WhatsApp</span>
                             <div className="text-sm text-brand-light font-medium bg-surface-muted/50 p-3 rounded-lg border border-surface-border">
                               {selectedLead.wht_cnt_nome || 'Nenhum'}
                             </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-brand-primary/10 rounded-2xl p-6 border border-brand-primary/20 flex items-center gap-6 group hover:bg-brand-primary/15 transition-all">
                        <div className="w-14 h-14 rounded-2xl bg-brand-primary/20 border border-brand-primary/30 flex items-center justify-center text-brand-primary shrink-0 group-hover:scale-110 transition-transform">
                          <MessageCircle size={28} />
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-brand-light mb-1 font-display">Integrar com Chat</h3>
                          <p className="text-xs text-brand-muted font-medium leading-relaxed">Inicie conversas instantâneas através dos canais conectados e centralize sua comunicação.</p>
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



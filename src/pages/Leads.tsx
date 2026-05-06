import React, { useState, useEffect } from 'react';
import { Search, Filter, Download, MessageCircle, Thermometer, User, Instagram, Globe, X, Calendar, DollarSign, Activity, Tag, BarChart, Phone, Mail, MapPin, Building, Target, CheckCircle2, Edit2, Save, Plus } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useOrganization } from '../contexts/OrganizationContext';

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
        .eq('organization_id', organization.id);
        
      if (error) throw error;

      if (data) {
        // Map database fields to UI fields
        const formattedLeads = data.map((l: any) => ({
          id: l.id,
          name: l.name || l.full_name || 'Sem nome',
          email: l.email || '',
          phone: l.phone || l.telefone || '',
          company: l.company || l.empresa || '',
          segment: l.segment || l.segmento || '',
          value: l.value || l.valor || 'R$ 0,00',
          location: l.location || l.localizacao || '',
          tags: l.tags || [],
          createdAt: l.created_at ? new Date(l.created_at).toLocaleDateString() : '-',
          channel: l.channel || l.canal || 'whatsapp',
          camp: l.campaign || l.campanha || '',
          temp: l.temperature || l.temperatura || 'morno',
          humor: l.humor || 'neutro',
          lastMsg: l.last_message || l.ultima_mensagem || '',
          time: l.last_message_at ? new Date(l.last_message_at).toLocaleDateString() : '-',
          score: l.score || 50,
          history: l.history || []
        }));
        setLeads(formattedLeads);
      }
    } catch (err) {
      console.error('Error fetching leads:', err);
    } finally {
      setLoading(false);
    }
  };

  const getTypeColor = (type: string) => {
    switch(type) {
        case 'meeting': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
        case 'email': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
        case 'social': return 'bg-pink-500/20 text-pink-400 border-pink-500/30';
        case 'web': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
        case 'deal': return 'bg-[#75AB61]/20 text-[#75AB61] border-[#75AB61]/30';
        default: return 'bg-slate-700/50 text-slate-400 border-slate-600/50';
    }
  };

  const handleEditClick = () => {
    setEditForm({ ...selectedLead });
    setIsEditing(true);
  };

  const handleSaveEdit = async () => {
    if (!organization?.id || !selectedLead?.id) return;

    try {
      const dbUpdate = {
        name: editForm.name,
        email: editForm.email,
        phone: editForm.phone,
        company: editForm.company,
        segment: editForm.segment,
        value: editForm.value,
        location: editForm.location,
        tags: Array.isArray(editForm.tags) ? editForm.tags : (editForm.tags ? editForm.tags.split(',').map((t: string) => t.trim()) : []),
        channel: editForm.channel,
        campaign: editForm.camp,
        temperature: editForm.temp,
        humor: editForm.humor,
        score: parseInt(editForm.score) || 0,
      };

      const { error } = await supabase
        .from('leads')
        .update(dbUpdate)
        .eq('id', selectedLead.id)
        .eq('organization_id', organization.id); // Security check

      if (error) throw error;

      fetchLeads();
      setIsEditing(false);
      setSelectedLead({ ...selectedLead, ...editForm });
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
        phone: editForm.phone,
        company: editForm.company,
        segment: editForm.segment,
        value: editForm.value,
        location: editForm.location,
        tags: editForm.tags ? editForm.tags.split(',').map((t: string) => t.trim()) : [],
        channel: editForm.channel || 'whatsapp',
        campaign: editForm.camp,
        temperature: editForm.temp || 'morno',
        humor: editForm.humor || 'neutro',
        score: parseInt(editForm.score) || 50,
        last_message: 'Lead criado manualmente',
        last_message_at: new Date().toISOString(),
        history: [{ date: new Date().toLocaleString('pt-BR'), action: 'Lead criado manualmente', type: 'social' }],
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
            onClick={() => { setEditForm({ channel: 'whatsapp', temp: 'morno', humor: 'neutro' }); setIsAdding(true); }}
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
              placeholder="Buscar por nome, telefone..."
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
                  <div className="h-10 w-10 rounded-full bg-slate-700 flex items-center justify-center text-lg font-bold text-white uppercase brand-gradient">
                    {lead.name ? lead.name.charAt(0) : '?'}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base">{lead.name || 'Sem nome'}</h3>
                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                      {lead.channel === 'whatsapp' && <MessageCircle size={12} className="text-[#25D366]" />}
                      {lead.channel === 'instagram' && <Instagram size={12} className="text-[#E1306C]" />}
                      {lead.channel === 'web' && <Globe size={12} className="text-[#3B82F6]" />}
                      <span className="capitalize">{lead.channel}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-cyan-900/30 text-cyan-400 border border-cyan-800/50">
                    {lead.camp}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {lead.humor === 'satisfeito' ? '😊' : lead.humor === 'neutro' ? '😐' : '😠'}
                    <Thermometer 
                      size={14} 
                      className={
                        lead.temp === 'quente' ? 'text-red-400' : 
                        lead.temp === 'morno' ? 'text-yellow-400' : 'text-blue-400'
                      } 
                    />
                  </div>
                </div>
              </div>
              
              <div className="bg-slate-800/30 rounded-lg p-3 border border-slate-700/30 mb-4 h-[70px] overflow-hidden">
                <p className="text-sm text-slate-300 truncate">"{lead.lastMsg || 'S/ msg'}"</p>
                <div className="text-right text-[10px] text-slate-500 mt-1">{lead.time}</div>
              </div>
              
              <div className="flex items-center justify-between gap-3">
                <div className="flex-1">
                  <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                    <span>Score de Conversão</span>
                    <span>{lead.score || 0}%</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1">
                    <div 
                      className={`h-1 rounded-full ${(lead.score || 0) > 70 ? 'bg-[#75AB61]' : (lead.score || 0) > 30 ? 'bg-yellow-400' : 'bg-red-400'}`} 
                      style={{ width: `${lead.score || 0}%` }}
                    ></div>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedLead(lead)}
                  className="text-xs bg-slate-800 hover:bg-slate-700 focus:outline-none text-white px-3 py-1.5 rounded transition-colors"
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
          <div className="bg-[#111A22] border border-slate-700 rounded-2xl w-full max-w-4xl shadow-2xl flex flex-col max-h-full h-[90vh]">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-700/50 bg-[#0b1120]/50 rounded-t-2xl shrink-0">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full flex items-center justify-center text-xl font-bold text-white uppercase brand-gradient shadow-lg">
                  {isAdding ? <User size={24} className="text-[#0b1120]" /> : (selectedLead?.name ? selectedLead.name.charAt(0) : '?')}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white leading-tight">
                    {isAdding ? 'Novo Lead' : (isEditing ? 'Editar Lead' : selectedLead?.name)}
                  </h2>
                  {!isAdding && !isEditing && selectedLead && (
                    <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                      <span className="flex items-center gap-1.5"><Building size={12} /> {selectedLead.company}</span>
                      <span className="flex items-center gap-1.5"><Target size={12} /> {selectedLead.segment}</span>
                      <span className="flex items-center gap-1.5"><MapPin size={12} /> {selectedLead.location}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3">
                {!isAdding && !isEditing && (
                  <button onClick={handleEditClick} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-bold rounded-lg transition-colors border border-slate-700 flex items-center gap-2">
                    <Edit2 size={16} /> Editar
                  </button>
                )}
                {(isEditing || isAdding) && (
                  <button onClick={isAdding ? handleCreateLead : handleSaveEdit} className="px-4 py-2 bg-[#75AB61] hover:bg-[#60914E] text-[#0b1120] text-sm font-bold rounded-lg transition-colors shadow-[0_0_15px_rgba(117,171,97,0.3)] border-transparent flex items-center gap-2">
                    <Save size={16} /> Salvar
                  </button>
                )}
                {!isAdding && !isEditing && (
                   <button className="px-4 py-2 bg-[#75AB61] hover:bg-[#60914E] text-[#0b1120] text-sm font-bold rounded-lg transition-colors shadow-[0_0_15px_rgba(117,171,97,0.3)] border-transparent flex items-center gap-2 hidden sm:flex">
                     <MessageCircle size={16} /> Chamar
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
                      <div>
                        <label className="block text-xs text-slate-400 font-bold mb-1">Nome Completo</label>
                        <input type="text" value={editForm.name || ''} onChange={e => setEditForm({...editForm, name: e.target.value})} className="w-full h-10 rounded-lg border border-slate-700 bg-slate-800/50 px-3 text-sm text-white focus:border-[#75AB61] focus:outline-none" />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-400 font-bold mb-1">E-mail</label>
                        <input type="email" value={editForm.email || ''} onChange={e => setEditForm({...editForm, email: e.target.value})} className="w-full h-10 rounded-lg border border-slate-700 bg-slate-800/50 px-3 text-sm text-white focus:border-[#75AB61] focus:outline-none" />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-400 font-bold mb-1">Telefone</label>
                        <input type="text" value={editForm.phone || ''} onChange={e => setEditForm({...editForm, phone: e.target.value})} className="w-full h-10 rounded-lg border border-slate-700 bg-slate-800/50 px-3 text-sm text-white focus:border-[#75AB61] focus:outline-none" />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-400 font-bold mb-1">Empresa</label>
                        <input type="text" value={editForm.company || ''} onChange={e => setEditForm({...editForm, company: e.target.value})} className="w-full h-10 rounded-lg border border-slate-700 bg-slate-800/50 px-3 text-sm text-white focus:border-[#75AB61] focus:outline-none" />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-400 font-bold mb-1">Segmento / ICP</label>
                        <input type="text" value={editForm.segment || ''} onChange={e => setEditForm({...editForm, segment: e.target.value})} className="w-full h-10 rounded-lg border border-slate-700 bg-slate-800/50 px-3 text-sm text-white focus:border-[#75AB61] focus:outline-none" />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-400 font-bold mb-1">Localização</label>
                        <input type="text" value={editForm.location || ''} onChange={e => setEditForm({...editForm, location: e.target.value})} className="w-full h-10 rounded-lg border border-slate-700 bg-slate-800/50 px-3 text-sm text-white focus:border-[#75AB61] focus:outline-none" />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-400 font-bold mb-1">Valor Potencial</label>
                        <input type="text" value={editForm.value || ''} onChange={e => setEditForm({...editForm, value: e.target.value})} className="w-full h-10 rounded-lg border border-slate-700 bg-slate-800/50 px-3 text-sm text-white focus:border-[#75AB61] focus:outline-none" />
                      </div>
                    </div>
                  </div>

                  <div className="card-surface rounded-xl p-5 border border-slate-700/50">
                    <h3 className="text-sm font-bold text-white mb-4 border-b border-slate-700/50 pb-2">Status e Segmentação</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs text-slate-400 font-bold mb-1">Temperatura</label>
                        <select value={editForm.temp || 'morno'} onChange={e => setEditForm({...editForm, temp: e.target.value})} className="w-full h-10 rounded-lg border border-slate-700 bg-slate-800/50 px-3 text-sm text-white focus:border-[#75AB61] focus:outline-none">
                          <option value="quente">Quente</option>
                          <option value="morno">Morno</option>
                          <option value="frio">Frio</option>
                        </select>
                      </div>
                      <div>
                         <label className="block text-xs text-slate-400 font-bold mb-1">Humor</label>
                         <select value={editForm.humor || 'neutro'} onChange={e => setEditForm({...editForm, humor: e.target.value})} className="w-full h-10 rounded-lg border border-slate-700 bg-slate-800/50 px-3 text-sm text-white focus:border-[#75AB61] focus:outline-none">
                           <option value="satisfeito">Satisfeito</option>
                           <option value="neutro">Neutro</option>
                           <option value="insatisfeito">Insatisfeito</option>
                         </select>
                      </div>
                      <div>
                         <label className="block text-xs text-slate-400 font-bold mb-1">Canal de Origem</label>
                         <select value={editForm.channel || 'whatsapp'} onChange={e => setEditForm({...editForm, channel: e.target.value})} className="w-full h-10 rounded-lg border border-slate-700 bg-slate-800/50 px-3 text-sm text-white focus:border-[#75AB61] focus:outline-none">
                           <option value="whatsapp">WhatsApp</option>
                           <option value="instagram">Instagram</option>
                           <option value="web">Site / Web</option>
                         </select>
                      </div>
                      <div>
                        <label className="block text-xs text-slate-400 font-bold mb-1">Campanha (Origem)</label>
                        <input type="text" value={editForm.camp || ''} onChange={e => setEditForm({...editForm, camp: e.target.value})} className="w-full h-10 rounded-lg border border-slate-700 bg-slate-800/50 px-3 text-sm text-white focus:border-[#75AB61] focus:outline-none" />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-400 font-bold mb-1">Tags (separadas por vírgula)</label>
                         <input type="text" value={Array.isArray(editForm.tags) ? editForm.tags.join(', ') : (editForm.tags || '')} onChange={e => setEditForm({...editForm, tags: e.target.value})} className="w-full h-10 rounded-lg border border-slate-700 bg-slate-800/50 px-3 text-sm text-white focus:border-[#75AB61] focus:outline-none" />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-400 font-bold mb-1">Score (0-100)</label>
                        <input type="number" min="0" max="100" value={editForm.score || 0} onChange={e => setEditForm({...editForm, score: e.target.value})} className="w-full h-10 rounded-lg border border-slate-700 bg-slate-800/50 px-3 text-sm text-white focus:border-[#75AB61] focus:outline-none" />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                // VIEW PROFILE
                selectedLead && (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Info & Metrics */}
                    <div className="space-y-6">
                      {/* Contact Info */}
                      <div className="card-surface rounded-xl p-5 border border-slate-700/50 space-y-4">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Contato</h3>
                        <div className="space-y-3">
                          <div className="flex items-center gap-3 text-sm text-slate-300">
                            <Phone size={16} className="text-slate-500" />
                            <span>{selectedLead.phone}</span>
                          </div>
                          <div className="flex items-center gap-3 text-sm text-slate-300">
                            <Mail size={16} className="text-slate-500" />
                            <span className="truncate">{selectedLead.email}</span>
                          </div>
                        </div>
                      </div>

                      {/* Business Metrics */}
                      <div className="card-surface rounded-xl p-5 border border-slate-700/50 space-y-4">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Métricas e Scoring</h3>
                        <div className="space-y-4">
                          
                          <div>
                            <div className="flex justify-between text-xs text-slate-400 mb-1 font-medium">
                              <span>Health Score</span>
                              <span className={selectedLead.score > 70 ? 'text-[#75AB61]' : selectedLead.score > 30 ? 'text-yellow-400' : 'text-red-400'}>
                                {selectedLead.score}%
                              </span>
                            </div>
                            <div className="w-full bg-slate-800 rounded-full h-1.5">
                              <div 
                                className={`h-1.5 rounded-full ${selectedLead.score > 70 ? 'bg-[#75AB61]' : selectedLead.score > 30 ? 'bg-yellow-400' : 'bg-red-400'}`} 
                                style={{ width: `${selectedLead.score}%` }}
                              ></div>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3 pt-2">
                             <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
                               <span className="block text-[10px] text-slate-400 uppercase font-semibold mb-1">Valor Potencial</span>
                               <span className="block text-sm font-bold text-white">{selectedLead.value}</span>
                             </div>
                             <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
                               <span className="block text-[10px] text-slate-400 uppercase font-semibold mb-1">Temperatura</span>
                               <span className="flex items-center gap-1.5 text-sm font-bold capitalize text-white">
                                  <Thermometer size={14} className={selectedLead.temp === 'quente' ? 'text-red-400' : selectedLead.temp === 'morno' ? 'text-yellow-400' : 'text-blue-400'} />
                                  {selectedLead.temp}
                               </span>
                             </div>
                          </div>
                        </div>
                      </div>

                      {/* Tags */}
                      <div className="card-surface rounded-xl p-5 border border-slate-700/50 space-y-4">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                           <Tag size={14} /> Tags Segmentação
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedLead.tags.map((tag, i) => (
                            <span key={i} className="px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700 uppercase tracking-wide">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Right Column - Activity & History */}
                    <div className="lg:col-span-2 space-y-6">
                      
                      {/* Origin & Campaign */}
                      <div className="card-surface rounded-xl p-5 border border-slate-700/50 flex items-center gap-6">
                        <div className="flex-1">
                          <span className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Origem do Lead</span>
                          <div className="flex items-center gap-2 text-sm font-bold text-white capitalize">
                            {selectedLead.channel === 'whatsapp' && <MessageCircle size={16} className="text-[#25D366]" />}
                            {selectedLead.channel === 'instagram' && <Instagram size={16} className="text-[#E1306C]" />}
                            {selectedLead.channel === 'web' && <Globe size={16} className="text-[#3B82F6]" />}
                            {selectedLead.channel}
                          </div>
                        </div>
                        <div className="w-px h-10 bg-slate-700/50"></div>
                        <div className="flex-1">
                          <span className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Campanha Ativa</span>
                          <div className="flex items-center gap-2 text-sm font-bold text-cyan-400">
                            <Target size={16} /> {selectedLead.camp}
                          </div>
                        </div>
                        <div className="w-px h-10 bg-slate-700/50 hidden sm:block"></div>
                        <div className="flex-1 hidden sm:block">
                          <span className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Data Criação</span>
                          <div className="flex items-center gap-2 text-sm font-bold text-white">
                            <Calendar size={16} className="text-slate-500" /> {selectedLead.createdAt}
                          </div>
                        </div>
                      </div>

                      {/* Status do SDR */}
                      <div className="bg-[#75AB61]/10 rounded-xl p-5 border border-[#75AB61]/20">
                         <div className="flex items-start gap-4">
                           <div className="w-10 h-10 rounded-full bg-[#75AB61]/20 border border-[#75AB61]/30 flex items-center justify-center text-[#75AB61] shrink-0">
                             {selectedLead.humor === 'satisfeito' ? '😊' : selectedLead.humor === 'neutro' ? '😐' : '😠'}
                           </div>
                           <div className="w-full">
                             <div className="flex items-center justify-between mb-2">
                               <h3 className="text-sm font-bold text-white">Última Análise do Agente (IA)</h3>
                               <span className="text-[10px] text-slate-400 font-mono">{selectedLead.time}</span>
                             </div>
                             <p className="text-sm text-[#75AB61] font-medium leading-relaxed bg-[#0b1120]/30 p-3 rounded-lg border border-[#75AB61]/10 italic">
                               "{selectedLead.lastMsg}"
                             </p>
                           </div>
                         </div>
                      </div>

                      {/* Linha do Tempo */}
                      <div className="card-surface rounded-xl p-5 border border-slate-700/50">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6 flex items-center gap-2">
                           <Activity size={14} /> Histórico de Interações
                        </h3>
                        
                        <div className="space-y-6 relative before:absolute before:inset-0 before:ml-[1.4rem] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-slate-700 before:to-transparent">
                          {(selectedLead.history || []).map((item, idx) => (
                            <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                              {/* Icon */}
                              <div className={`flex items-center justify-center w-8 h-8 rounded-full border shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 ml-2 md:ml-0 z-10 
                                ${getTypeColor(item.type)}`}
                              >
                                {item.type === 'meeting' && <Calendar size={14} />}
                                {item.type === 'email' && <Mail size={14} />}
                                {item.type === 'deal' && <DollarSign size={14} />}
                                {item.type === 'social' && <Instagram size={14} />}
                                {item.type === 'web' && <Globe size={14} />}
                                {item.type === 'download' && <Download size={14} />}
                              </div>
                              
                              {/* Content */}
                              <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2rem)] bg-slate-800/40 p-4 rounded-xl border border-slate-700/50 ml-4 md:ml-0">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="font-bold text-white text-sm">{item.action}</span>
                                </div>
                                <time className="font-mono text-xs text-slate-400">{item.date}</time>
                              </div>
                            </div>
                          ))}
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



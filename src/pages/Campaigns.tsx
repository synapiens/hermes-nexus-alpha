import React, { useState } from 'react';
import { 
  Rocket, Send, CheckCircle2, Eye, MessageCircle, DollarSign, 
  Filter, Plus, Pause, Play, Copy, X, Calendar, Search, Instagram, 
  Users, Bot, Sparkles, Target, ArrowRight, BarChart3, Clock, AlertTriangle,
  Check, CheckCheck, RefreshCw
} from 'lucide-react';
import { cn } from '../lib/utils';

// --- MOCK DATA ---
const kpis = [
  { label: 'Total Disparado', value: '45.2k', icon: Send, color: 'text-blue-400', bg: 'bg-blue-400/10' },
  { label: 'Entregue', value: '42.1k', icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
  { label: 'Lido', value: '38.5k', icon: Eye, color: 'text-cyan-400', bg: 'bg-cyan-400/10' },
  { label: 'Respondido', value: '12.4k', icon: MessageCircle, color: 'text-purple-400', bg: 'bg-purple-400/10' },
  { label: 'Gerou Conversa', value: '4.2k', icon: Users, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
  { label: 'Vendas', value: '342', icon: DollarSign, color: 'text-[#75AB61]', bg: 'bg-[#75AB61]/10' },
];

const mockCampaigns = [
  {
    id: 1,
    name: 'Oferta VIP - Lançamento',
    description: 'Oferta antecipada para clientes com score > 80',
    channel: 'whatsapp',
    segment: 'Leads Quentes - VIP',
    date: '24 Nov 2026, 09:00',
    status: 'Em andamento',
    progress: { current: 3450, total: 5000 },
    funnel: { sent: 3450, delivered: 3420, read: 2800, replied: 450, convo: 120, sale: 15 }
  },
  {
    id: 2,
    name: 'Recuperação de Carrinho',
    description: 'Lembrete para quem abandonou e não retornou',
    channel: 'instagram',
    segment: 'Abandono D-1',
    date: 'Diário, 18:00',
    status: 'Concluído',
    progress: { current: 1200, total: 1200 },
    funnel: { sent: 1200, delivered: 1190, read: 800, replied: 150, convo: 45, sale: 12 }
  },
  {
    id: 3,
    name: 'Aquecimento Base Fria',
    description: 'Distribuição de conteúdo e e-book gratuito',
    channel: 'whatsapp',
    segment: 'Leads Frios - Geral',
    date: '10 Dez 2026, 14:00',
    status: 'Pausado',
    progress: { current: 15000, total: 40000 },
    funnel: { sent: 15000, delivered: 14800, read: 9000, replied: 1200, convo: 300, sale: 5 }
  },
  {
    id: 4,
    name: 'Convite Webinar B2B',
    description: 'Convite para diretores e gerentes',
    channel: 'whatsapp',
    segment: 'B2B - Cargo: Diretor',
    date: '15 Dez 2026, 10:00',
    status: 'Agendado',
    progress: { current: 0, total: 8500 },
    funnel: { sent: 0, delivered: 0, read: 0, replied: 0, convo: 0, sale: 0 }
  }
];

const statusColors: any = {
  'Em andamento': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'Concluído': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  'Pausado': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  'Agendado': 'bg-slate-500/20 text-slate-400 border-slate-500/30',
  'Falhou': 'bg-red-500/20 text-red-400 border-red-500/30',
};

// --- COMPONENTS ---

export function Campaigns() {
  const [view, setView] = useState<'list' | 'new'>('list');
  const [selectedCampaign, setSelectedCampaign] = useState<any | null>(null);

  // New Campaign Form State
  const [ncAiPersonalize, setNcAiPersonalize] = useState(true);
  const [ncMessage, setNcMessage] = useState('Olá {{nome}}, vi que você se interessou por {{produto}}.');
  const [ncScheduleType, setNcScheduleType] = useState<'now' | 'scheduled' | 'recurring'>('now');
  const [ncScheduledTimes, setNcScheduledTimes] = useState([{ date: '', time: '' }]);
  const [ncRecurrence, setNcRecurrence] = useState('daily');

  return (
    <div className="space-y-6 h-full flex flex-col relative">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            Disparos & Campanhas <Rocket className="text-[#75AB61]" size={24} />
          </h1>
          <p className="text-slate-400 text-sm mt-1">Monitoramento de campanhas do Agente Disparador de MKT</p>
        </div>
        
        {view === 'list' ? (
          <button 
            onClick={() => setView('new')}
            className="flex items-center gap-2 brand-gradient px-4 py-2.5 rounded-lg text-sm font-semibold text-[#0b1120] hover:opacity-90 transition-opacity"
          >
            <Plus size={18} /> Novo Disparo
          </button>
        ) : (
          <button 
            onClick={() => setView('list')}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 px-4 py-2.5 rounded-lg text-sm font-semibold text-white transition-colors border border-slate-700"
          >
            Cancelar
          </button>
        )}
      </div>

      {view === 'list' && (
        <>
          {/* KPIs */}
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
            {kpis.map((kpi, idx) => (
              <div key={idx} className="card-surface p-4 rounded-xl flex flex-col justify-between">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium text-slate-400">{kpi.label}</span>
                  <div className={cn("p-1.5 rounded-md", kpi.bg, kpi.color)}>
                    <kpi.icon size={14} />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white">{kpi.value}</h3>
              </div>
            ))}
          </div>

          {/* FILTERS */}
          <div className="card-surface rounded-xl p-4 flex flex-wrap gap-3 items-center justify-between z-10">
            <div className="flex items-center gap-3 flex-1 min-w-[200px]">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  type="text" 
                  placeholder="Buscar campanha..."
                  className="w-full h-10 rounded-lg border border-slate-700 bg-slate-800/50 pl-9 pr-4 text-sm text-white placeholder-slate-400 focus:border-[#75AB61] focus:outline-none focus:ring-1 focus:ring-[#75AB61]"
                />
              </div>
              <select className="h-10 rounded-lg border border-slate-700 bg-slate-800/50 px-3 text-sm text-slate-300 focus:border-[#75AB61] focus:outline-none">
                <option>Todos os Canais</option>
                <option>WhatsApp</option>
                <option>Instagram</option>
              </select>
              <select className="h-10 rounded-lg border border-slate-700 bg-slate-800/50 px-3 text-sm text-slate-300 focus:border-[#75AB61] focus:outline-none">
                <option>Todos os Status</option>
                <option>Agendado</option>
                <option>Em andamento</option>
                <option>Concluído</option>
                <option>Pausado</option>
              </select>
            </div>
          </div>

          {/* CAMPAIGN LIST */}
          <div className="flex-1 overflow-auto space-y-4 pb-10">
            {mockCampaigns.map((camp) => (
              <div key={camp.id} className="card-surface rounded-xl p-5 border border-[#75AB61]/10 hover:border-[#75AB61]/30 transition-colors">
                
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-5">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center shrink-0 border border-slate-700">
                      {camp.channel === 'whatsapp' ? <MessageCircle className="text-[#25D366]" size={24} /> : <Instagram className="text-[#E1306C]" size={24} />}
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-lg font-bold text-white leading-tight">{camp.name}</h3>
                        <span className={cn("px-2 py-0.5 rounded text-[10px] font-bold uppercase border tracking-wider", statusColors[camp.status])}>
                          {camp.status}
                        </span>
                      </div>
                      <p className="text-sm text-slate-400">{camp.description}</p>
                      
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3 text-xs text-slate-400">
                        <div className="flex items-center gap-1.5">
                          <Target size={14} className="text-indigo-400" />
                          <span className="text-slate-300">Segmento:</span> {camp.segment}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Calendar size={14} className="text-blue-400" />
                          <span className="text-slate-300">Data:</span> {camp.date}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0 border-t md:border-t-0 border-slate-700/50 pt-3 md:pt-0">
                    <button 
                      onClick={() => setSelectedCampaign(camp)}
                      className="px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-white rounded-md transition-colors"
                    >
                      Ver detalhes
                    </button>
                    {camp.status === 'Em andamento' ? (
                      <button className="px-3 py-1.5 text-xs font-medium bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400 rounded-md transition-colors flex items-center gap-1">
                        <Pause size={14} /> Pausar
                      </button>
                    ) : camp.status === 'Pausado' ? (
                      <button className="px-3 py-1.5 text-xs font-medium bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-md transition-colors flex items-center gap-1">
                        <Play size={14} /> Retomar
                      </button>
                    ) : null}
                    <button className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-colors" title="Duplicar">
                      <Copy size={16} />
                    </button>
                  </div>
                </div>

                {/* Progress & Funnel */}
                <div className="bg-slate-800/40 rounded-lg p-4 border border-slate-700/30">
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="font-medium text-slate-300">Progresso do Envio</span>
                      <span className="font-bold text-white">{camp.progress.current.toLocaleString()} / {camp.progress.total.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-[#0b1120] rounded-full h-2 border border-slate-700">
                      <div 
                        className="brand-gradient h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden" 
                        style={{ width: `${(camp.progress.current / camp.progress.total) * 100}%` }}
                      >
                        <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 pt-2 border-t border-slate-700/50">
                    <div className="text-center bg-slate-800/50 rounded-md py-2 border border-slate-700/50 flex flex-col items-center">
                      <div className="flex items-center gap-1 text-[10px] text-slate-500 uppercase font-semibold mb-1">
                        {camp.channel === 'whatsapp' ? <Check size={12} /> : <Send size={12} />}
                        Enviado
                      </div>
                      <p className="text-sm font-bold text-white">{camp.funnel.sent.toLocaleString()}</p>
                    </div>
                    <div className="text-center bg-emerald-900/10 rounded-md py-2 border border-emerald-900/30 flex flex-col items-center">
                      <div className="flex items-center gap-1 text-[10px] text-emerald-500/70 uppercase font-semibold mb-1">
                        {camp.channel === 'whatsapp' ? <CheckCheck size={12} /> : <CheckCircle2 size={12} />}
                        Entregue
                      </div>
                      <p className="text-sm font-bold text-emerald-400">{camp.funnel.delivered.toLocaleString()}</p>
                    </div>
                    <div className="text-center bg-cyan-900/10 rounded-md py-2 border border-cyan-900/30 flex flex-col items-center">
                      <div className="flex items-center gap-1 text-[10px] text-cyan-500/70 uppercase font-semibold mb-1">
                        {camp.channel === 'whatsapp' ? <CheckCheck size={12} className="text-cyan-500" /> : <Eye size={12} />}
                        Lido
                      </div>
                      <p className="text-sm font-bold text-cyan-400">{camp.funnel.read.toLocaleString()}</p>
                    </div>
                    <div className="text-center bg-purple-900/10 rounded-md py-2 border border-purple-900/30 flex flex-col items-center">
                      <div className="flex items-center gap-1 text-[10px] text-purple-500/70 uppercase font-semibold mb-1">
                        <MessageCircle size={12} />
                        Resp.
                      </div>
                      <p className="text-sm font-bold text-purple-400">{camp.funnel.replied.toLocaleString()}</p>
                    </div>
                    <div className="text-center bg-yellow-900/10 rounded-md py-2 border border-yellow-900/30 flex flex-col items-center">
                      <div className="flex items-center gap-1 text-[10px] text-yellow-500/70 uppercase font-semibold mb-1">
                        <Users size={12} />
                        Conversa
                      </div>
                      <p className="text-sm font-bold text-yellow-400">{camp.funnel.convo.toLocaleString()}</p>
                    </div>
                    <div className="text-center bg-[#75AB61]/10 rounded-md py-2 border border-[#75AB61]/30 flex flex-col items-center">
                      <div className="flex items-center gap-1 text-[10px] text-[#75AB61]/70 uppercase font-semibold mb-1">
                        <DollarSign size={12} />
                        Venda
                      </div>
                      <p className="text-sm font-bold text-[#75AB61]">{camp.funnel.sale.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </>
      )}

      {/* NEW CAMPAIGN VIEW */}
      {view === 'new' && (
        <div className="flex-1 overflow-auto animate-in slide-in-from-bottom-4 duration-300 pb-20">
          <div className="max-w-4xl mx-auto space-y-6">
            
            {/* Steps / Setup */}
            <div className="card-surface p-6 rounded-xl space-y-8">
              {/* Channel */}
              <div>
                <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full brand-gradient text-[#0b1120] text-xs">1</span>
                  Canal de Disparo
                </h3>
                <div className="grid grid-cols-2 gap-4 pl-8">
                  <label className="flex items-center gap-3 p-4 border border-[#75AB61] bg-[#75AB61]/10 rounded-xl cursor-pointer transition-colors relative overflow-hidden">
                    <input type="radio" name="channel" className="peer w-4 h-4 text-[#75AB61] bg-slate-800 border-slate-600 focus:ring-[#75AB61]" defaultChecked />
                    <MessageCircle className="text-[#25D366]" size={24} />
                    <span className="font-semibold text-white">WhatsApp</span>
                    <div className="absolute top-0 right-0 p-1 bg-[#75AB61] text-[#0b1120] rounded-bl-lg">
                      <CheckCircle2 size={14} />
                    </div>
                  </label>
                  <label className="flex items-center gap-3 p-4 border border-slate-700 bg-slate-800/30 rounded-xl cursor-pointer hover:bg-slate-800/60 transition-colors">
                    <input type="radio" name="channel" className="w-4 h-4 text-[#75AB61] bg-slate-800 border-slate-600 focus:ring-[#75AB61]" />
                    <Instagram className="text-[#E1306C]" size={24} />
                    <span className="font-semibold text-slate-300">Instagram Direct</span>
                  </label>
                </div>
              </div>

              {/* Segment */}
              <div>
                <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full brand-gradient text-[#0b1120] text-xs">2</span>
                  Segmento Alvo
                </h3>
                <div className="pl-8">
                  <div className="flex gap-2">
                    <select className="flex-1 h-12 rounded-xl border border-slate-700 bg-[#0b1120]/50 px-4 text-sm text-white focus:border-[#75AB61] focus:outline-none focus:ring-1 focus:ring-[#75AB61]">
                      <option value="">Selecione um segmento existente...</option>
                      <option value="1">Leads Quentes - VIP (5.000 contatos)</option>
                      <option value="2">Abandono de Carrinho D-1 (1.200 contatos)</option>
                      <option value="3">Leads Frios - Geral (40.000 contatos)</option>
                    </select>
                    <button className="px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 font-medium text-sm flex items-center gap-2 transition-colors">
                      <Filter size={16} /> Criar Novo
                    </button>
                  </div>
                  <p className="mt-2 text-xs text-[#A2C794] flex items-center gap-1.5">
                    <CheckCircle2 size={14} /> 5.000 contatos validados para disparo no WhatsApp.
                  </p>
                </div>
              </div>

              {/* Message */}
              <div>
                <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full brand-gradient text-[#0b1120] text-xs">3</span>
                  Mensagem e Personalização
                </h3>
                <div className="pl-8 space-y-4">
                  {/* AI Toggle */}
                  <label className="flex items-center justify-between p-4 rounded-xl border border-indigo-500/30 bg-indigo-500/5 cursor-pointer">
                    <div className="flex gap-3">
                      <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-lg h-fit border border-indigo-500/20">
                        <Sparkles size={20} />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-white">Deixar o Agente personalizar a mensagem</h4>
                        <p className="text-xs text-slate-400 mt-1 max-w-[500px]">A IA adaptará dinamicamente o texto base considerando clima, histórico de conversas anteriores e perfil emocional de cada lead.</p>
                      </div>
                    </div>
                    <div className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" checked={ncAiPersonalize} onChange={(e) => setNcAiPersonalize(e.target.checked)} />
                      <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-500"></div>
                    </div>
                  </label>

                  <div className="relative">
                    <div className="absolute top-0 left-0 w-full h-11 bg-[#0b1120] rounded-t-xl border border-slate-700 border-b-0 flex items-center px-4 gap-2">
                      <span className="text-xs font-semibold text-slate-400">Variáveis:</span>
                      <button className="text-[10px] font-mono bg-[#1A1A2E] text-[#75AB61] px-2 py-1 rounded-md border border-[#75AB61]/30 hover:bg-[#75AB61]/10">{'{{nome}}'}</button>
                      <button className="text-[10px] font-mono bg-[#1A1A2E] text-[#75AB61] px-2 py-1 rounded-md border border-[#75AB61]/30 hover:bg-[#75AB61]/10">{'{{produto}}'}</button>
                      <button className="text-[10px] font-mono bg-[#1A1A2E] text-[#75AB61] px-2 py-1 rounded-md border border-[#75AB61]/30 hover:bg-[#75AB61]/10">{'{{saudacao}}'}</button>
                    </div>
                    <textarea 
                      value={ncMessage}
                      onChange={(e) => setNcMessage(e.target.value)}
                      className="w-full h-36 rounded-xl rounded-t-none border border-slate-700 bg-[#0b1120]/50 p-4 pt-4 mt-11 text-sm text-white placeholder-slate-500 focus:border-[#75AB61] focus:outline-none focus:ring-1 focus:ring-[#75AB61] resize-none"
                      placeholder="Escreva a mensagem base..."
                    />
                  </div>
                  
                  {ncAiPersonalize && (
                     <div className="bg-[#0b1120] p-4 rounded-xl border border-slate-800">
                       <h5 className="text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider flex items-center gap-1.5"><Bot size={14}/> Preview Dinâmico (Exemplo IA)</h5>
                       <div className="bg-[#1A1A2E] p-3 rounded-lg border border-indigo-500/20 text-sm text-slate-300 italic border-l-2 border-l-indigo-500">
                         "Bom dia Carlos! Vi que esfriou bastante por aí hoje 🥶. Para ajudar a focar nesse clima, lembra daquele Plano Enterprise que conversamos mês passado? Tem uma condição especial que acho que faz sentido pra você agora..."
                       </div>
                     </div>
                  )}
                </div>
              </div>

              {/* Schedule */}
              <div>
                <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full brand-gradient text-[#0b1120] text-xs">4</span>
                  Agendamento
                </h3>
                <div className="pl-8 flex flex-col gap-4">
                  <div className="flex flex-wrap gap-4">
                    <label className={cn("flex-1 min-w-[140px] flex items-center gap-3 p-4 pr-6 border rounded-xl cursor-pointer transition-colors", ncScheduleType === 'now' ? "border-[#75AB61] bg-[#75AB61]/5" : "border-slate-700 bg-slate-800/30 hover:bg-slate-800/60")}>
                      <input type="radio" name="scheduleType" value="now" checked={ncScheduleType === 'now'} onChange={() => setNcScheduleType('now')} className="w-4 h-4 text-[#75AB61] bg-slate-800 border-slate-600 focus:ring-[#75AB61]" />
                      <Clock className={ncScheduleType === 'now' ? "text-[#75AB61]" : "text-slate-400"} size={20} />
                      <div>
                        <span className={cn("block font-semibold text-sm", ncScheduleType === 'now' ? "text-white" : "text-slate-300")}>Enviar Agora</span>
                        <span className="block text-xs text-slate-400 mt-0.5">Início imediato</span>
                      </div>
                    </label>
                    
                    <label className={cn("flex-1 min-w-[140px] flex items-center gap-3 p-4 pr-6 border rounded-xl cursor-pointer transition-colors", ncScheduleType === 'scheduled' ? "border-[#75AB61] bg-[#75AB61]/5" : "border-slate-700 bg-slate-800/30 hover:bg-slate-800/60")}>
                      <input type="radio" name="scheduleType" value="scheduled" checked={ncScheduleType === 'scheduled'} onChange={() => setNcScheduleType('scheduled')} className="w-4 h-4 text-[#75AB61] bg-slate-800 border-slate-600 focus:ring-[#75AB61]" />
                      <Calendar className={ncScheduleType === 'scheduled' ? "text-[#75AB61]" : "text-slate-400"} size={20} />
                      <div>
                        <span className={cn("block font-semibold text-sm", ncScheduleType === 'scheduled' ? "text-white" : "text-slate-300")}>Agendar Lotes</span>
                        <span className="block text-xs text-slate-400 mt-0.5">Configurar envios precisos</span>
                      </div>
                    </label>

                    <label className={cn("flex-1 min-w-[140px] flex items-center gap-3 p-4 pr-6 border rounded-xl cursor-pointer transition-colors", ncScheduleType === 'recurring' ? "border-[#75AB61] bg-[#75AB61]/5" : "border-slate-700 bg-slate-800/30 hover:bg-slate-800/60")}>
                      <input type="radio" name="scheduleType" value="recurring" checked={ncScheduleType === 'recurring'} onChange={() => setNcScheduleType('recurring')} className="w-4 h-4 text-[#75AB61] bg-slate-800 border-slate-600 focus:ring-[#75AB61]" />
                      <RefreshCw className={ncScheduleType === 'recurring' ? "text-[#75AB61]" : "text-slate-400"} size={20} />
                      <div>
                        <span className={cn("block font-semibold text-sm", ncScheduleType === 'recurring' ? "text-white" : "text-slate-300")}>Recorrente</span>
                        <span className="block text-xs text-slate-400 mt-0.5">Regras de repetição automática</span>
                      </div>
                    </label>
                  </div>

                  {ncScheduleType === 'scheduled' && (
                    <div className="bg-[#1A1A2E]/80 p-4 rounded-xl border border-slate-700 mt-2 mb-2 space-y-4 animate-in fade-in slide-in-from-top-2">
                      <p className="text-xs text-slate-400 font-medium pb-2 border-b border-slate-700/50">Múltiplos horários de envio: Você pode dividir a cadência criando lotes distintos.</p>
                      
                      <div className="space-y-3">
                        {ncScheduledTimes.map((time, idx) => (
                          <div key={idx} className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                            <div className="flex-1 w-full relative">
                              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                              <input 
                                type="date" 
                                className="w-full pl-9 pr-3 h-10 rounded-lg border border-slate-700 bg-[#0b1120] text-sm text-white focus:border-[#75AB61] focus:outline-none focus:ring-1 focus:ring-[#75AB61]" 
                                value={time.date}
                                onChange={(e) => {
                                  const newTimes = [...ncScheduledTimes];
                                  newTimes[idx].date = e.target.value;
                                  setNcScheduledTimes(newTimes);
                                }}
                              />
                            </div>
                            <div className="flex-1 w-full relative">
                              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                              <input 
                                type="time" 
                                className="w-full pl-9 pr-3 h-10 rounded-lg border border-slate-700 bg-[#0b1120] text-sm text-white focus:border-[#75AB61] focus:outline-none focus:ring-1 focus:ring-[#75AB61]" 
                                value={time.time}
                                onChange={(e) => {
                                  const newTimes = [...ncScheduledTimes];
                                  newTimes[idx].time = e.target.value;
                                  setNcScheduledTimes(newTimes);
                                }}
                              />
                            </div>
                            {ncScheduledTimes.length > 1 && (
                              <button 
                                onClick={() => {
                                  setNcScheduledTimes(ncScheduledTimes.filter((_, i) => i !== idx));
                                }}
                                className="h-10 px-3 flex items-center justify-center text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors border border-transparent hover:border-red-500/20"
                              >
                                <X size={16} />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                      
                      <button 
                        onClick={() => setNcScheduledTimes([...ncScheduledTimes, { date: '', time: '' }])}
                        className="text-sm text-[#75AB61] hover:text-[#A2C794] font-medium flex items-center gap-1.5 transition-colors"
                      >
                        <Plus size={16} /> Adicionar Lote
                      </button>
                    </div>
                  )}

                  {ncScheduleType === 'recurring' && (
                    <div className="bg-[#1A1A2E]/80 p-5 rounded-xl border border-slate-700 mt-2 mb-2 grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-top-2">
                      <div>
                         <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase">Regra de Recorrência</label>
                         <select 
                            value={ncRecurrence}
                            onChange={(e) => setNcRecurrence(e.target.value)}
                            className="w-full h-11 rounded-lg border border-slate-700 bg-[#0b1120] px-3 text-sm text-white focus:border-[#75AB61] focus:outline-none focus:ring-1 focus:ring-[#75AB61]"
                         >
                           <option value="daily">Diariamente</option>
                           <option value="weekly">Semanalmente (Escolher dias)</option>
                           <option value="monthly">Mensalmente</option>
                           <option value="custom">Cron Expression Avançado</option>
                         </select>
                      </div>
                      
                      {ncRecurrence === 'weekly' && (
                        <div className="md:col-span-2">
                           <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase">Dias da Semana</label>
                           <div className="flex flex-wrap gap-2">
                             {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'].map(day => (
                               <label key={day} className="flex-1 min-w-[40px] text-center cursor-pointer">
                                 <input type="checkbox" className="sr-only peer" defaultChecked={['Seg','Ter','Qua','Qui','Sex'].includes(day)} />
                                 <div className="px-1 py-2 rounded-lg border border-slate-700 bg-slate-800/30 text-slate-400 text-xs font-medium peer-checked:bg-[#75AB61]/10 peer-checked:text-[#75AB61] peer-checked:border-[#75AB61]/50 transition-colors">
                                   {day}
                                 </div>
                               </label>
                             ))}
                           </div>
                        </div>
                      )}

                      <div className="md:col-span-2 grid grid-cols-2 gap-4 border-t border-slate-700/50 pt-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase">A partir de</label>
                          <input type="date" className="w-full h-10 rounded-lg border border-slate-700 bg-[#0b1120] px-3 text-sm text-white focus:border-[#75AB61] focus:outline-none" />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase">Data Fim (Opcional)</label>
                          <input type="date" className="w-full h-10 rounded-lg border border-slate-700 bg-[#0b1120] px-3 text-sm text-white focus:border-[#75AB61] focus:outline-none" />
                        </div>
                      </div>

                    </div>
                  )}

                </div>
              </div>
              
              {/* Summary & Submit */}
              <div className="pt-6 border-t border-slate-700/50 pl-8">
                <button className="w-full sm:w-auto brand-gradient px-8 py-3.5 rounded-xl font-bold text-[#0b1120] hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(117,171,97,0.3)]">
                  Confirmar e Lançar Campanha <Send size={18} />
                </button>
                <p className="mt-3 text-xs text-slate-500 text-center sm:text-left">
                  Estimativa de duração do envio: <strong className="text-slate-400">~45 minutos</strong> (Throttle rate: 110 msgs/min)
                </p>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* CAMPAIGN DETAILS MODAL */}
      {selectedCampaign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0b1120]/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-[#1A1A2E] border border-[#75AB61]/30 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
            
            <div className="flex items-center justify-between p-5 border-b border-[#75AB61]/20 bg-[#1A1A2E]">
              <div>
                <h2 className="text-xl font-bold text-white leading-tight flex items-center gap-2">
                  {selectedCampaign.channel === 'whatsapp' ? <MessageCircle className="text-[#25D366]" size={20} /> : <Instagram className="text-[#E1306C]" size={20} />}
                  {selectedCampaign.name}
                </h2>
                <div className="flex items-center gap-3 mt-2 text-xs">
                  <span className={cn("px-2 py-0.5 rounded font-bold uppercase", statusColors[selectedCampaign.status])}>
                    {selectedCampaign.status}
                  </span>
                  <span className="text-slate-400 flex items-center gap-1"><Target size={12} className="text-indigo-400"/> {selectedCampaign.segment}</span>
                  <span className="text-slate-400 flex items-center gap-1"><Calendar size={12} className="text-blue-400"/> {selectedCampaign.date}</span>
                </div>
              </div>
              <button 
                onClick={() => setSelectedCampaign(null)}
                className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                title="Fechar"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-auto p-6 space-y-6">
              
              {/* Top info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#0b1120]/50 rounded-xl p-5 border border-slate-700/50">
                  <h3 className="text-sm font-semibold text-slate-300 mb-4 flex items-center gap-2">
                    <Rocket size={16} className="text-[#75AB61]" /> Dashboard da Campanha
                  </h3>
                  
                  <div className="space-y-5">
                    <div>
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className="font-medium text-slate-400">Progresso Geral</span>
                        <span className="font-bold text-white">{selectedCampaign.progress.current.toLocaleString()} / {selectedCampaign.progress.total.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-2">
                        <div className="brand-gradient h-full rounded-full" style={{ width: `${(selectedCampaign.progress.current / selectedCampaign.progress.total) * 100 || 0}%` }}></div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-slate-800/50 p-2.5 rounded-lg border border-slate-700/50">
                        <span className="block text-[10px] text-slate-500 uppercase font-semibold">Custo Est.</span>
                        <span className="block text-sm font-bold text-white">~R$ 380,00</span>
                      </div>
                      <div className="bg-slate-800/50 p-2.5 rounded-lg border border-slate-700/50">
                        <span className="block text-[10px] text-slate-500 uppercase font-semibold">Taxa Abertura</span>
                        <span className="block text-sm font-bold text-white">{Math.round((selectedCampaign.funnel.read / selectedCampaign.funnel.delivered) * 100 || 0)}%</span>
                      </div>
                      <div className="bg-[#75AB61]/10 p-2.5 rounded-lg border border-[#75AB61]/30">
                        <span className="block text-[10px] text-[#75AB61] uppercase font-semibold">ROI (Vendas)</span>
                        <span className="block text-sm font-bold text-[#75AB61]">24x</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-[#0b1120]/50 rounded-xl p-5 border border-slate-700/50 flex flex-col">
                  <h3 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
                    <MessageCircle size={16} className="text-[#75AB61]" /> Template Utilizado
                  </h3>
                  <div className="bg-slate-800/50 border border-slate-700 p-4 rounded-lg relative flex-1 overflow-auto text-sm text-slate-300 leading-relaxed font-mono">
                    <p>Olá {'{{nome}}'}, temos uma condição exclusiva para o {'{{produto}}'} liberada na sua conta final 4832.<br/><br/>Podemos falar sobre isso rapidinho?</p>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <span className="px-2.5 py-1 rounded-md bg-indigo-500/10 text-indigo-400 text-xs font-semibold border border-indigo-500/20 flex items-center gap-1.5"><Sparkles size={12}/> Personalização IA Ativa</span>
                  </div>
                </div>
              </div>

              {/* Funnel Visual */}
              <div>
                <h3 className="text-sm font-bold text-white mb-4">Funil Analítico</h3>
                <div className="bg-[#0b1120]/50 rounded-xl border border-slate-700/50 p-6 flex flex-col items-center py-8">
                  
                  {/* Funnel steps representation */}
                  <div className="w-full max-w-2xl space-y-2.5">
                    {/* Step 1 */}
                    <div className="flex bg-[#1A1A2E] rounded-lg overflow-hidden border border-slate-700/50 h-10 group relative">
                      <div className="bg-slate-700/80 text-white w-32 flex items-center px-4 text-xs font-bold uppercase shrink-0">Enviado</div>
                      <div className="flex-1 flex items-center px-4 relative bg-[#0b1120]">
                        <div className="absolute inset-y-0 left-0 bg-blue-500/20 transition-all duration-500" style={{width: '100%'}}></div>
                        <span className="relative z-10 text-sm font-bold text-white">{selectedCampaign.funnel.sent.toLocaleString()}</span>
                        <span className="relative z-10 ml-auto text-xs font-medium text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded">100%</span>
                      </div>
                    </div>
                    {/* Step 2 */}
                    <div className="flex bg-[#1A1A2E] rounded-lg overflow-hidden border border-emerald-900/40 h-10 group w-[95%] mx-auto">
                      <div className="bg-emerald-900/50 text-emerald-400 w-32 flex items-center px-4 text-xs font-bold uppercase shrink-0">Entregue</div>
                      <div className="flex-1 flex items-center px-4 relative bg-[#0b1120]">
                        <div className="absolute inset-y-0 left-0 bg-emerald-500/20 transition-all duration-500" style={{width: `${(selectedCampaign.funnel.delivered / selectedCampaign.funnel.sent) * 100 || 0}%`}}></div>
                        <span className="relative z-10 text-sm font-bold text-white">{selectedCampaign.funnel.delivered.toLocaleString()}</span>
                        <span className="relative z-10 ml-auto text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">{Math.round((selectedCampaign.funnel.delivered / selectedCampaign.funnel.sent) * 100) || 0}%</span>
                      </div>
                    </div>
                    {/* Step 3 */}
                    <div className="flex bg-[#1A1A2E] rounded-lg overflow-hidden border border-cyan-900/40 h-10 group w-[90%] mx-auto">
                      <div className="bg-cyan-900/50 text-cyan-400 w-32 flex items-center px-4 text-xs font-bold uppercase shrink-0">Lido</div>
                      <div className="flex-1 flex items-center px-4 relative bg-[#0b1120]">
                        <div className="absolute inset-y-0 left-0 bg-cyan-500/20 transition-all duration-500" style={{width: `${(selectedCampaign.funnel.read / selectedCampaign.funnel.delivered) * 100 || 0}%`}}></div>
                        <span className="relative z-10 text-sm font-bold text-white">{selectedCampaign.funnel.read.toLocaleString()}</span>
                        <span className="relative z-10 ml-auto text-xs font-medium text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded">{Math.round((selectedCampaign.funnel.read / selectedCampaign.funnel.delivered) * 100) || 0}%</span>
                      </div>
                    </div>
                    {/* Step 4 */}
                    <div className="flex bg-[#1A1A2E] rounded-lg overflow-hidden border border-purple-900/40 h-10 group w-[85%] mx-auto">
                      <div className="bg-purple-900/50 text-purple-400 w-32 flex items-center px-4 text-xs font-bold uppercase shrink-0">Respondido</div>
                      <div className="flex-1 flex items-center px-4 relative bg-[#0b1120]">
                        <div className="absolute inset-y-0 left-0 bg-purple-500/20 transition-all duration-500" style={{width: `${(selectedCampaign.funnel.replied / selectedCampaign.funnel.read) * 100 || 0}%`}}></div>
                        <span className="relative z-10 text-sm font-bold text-white">{selectedCampaign.funnel.replied.toLocaleString()}</span>
                        <span className="relative z-10 ml-auto text-xs font-medium text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded">{Math.round((selectedCampaign.funnel.replied / selectedCampaign.funnel.read) * 100) || 0}%</span>
                      </div>
                    </div>
                    {/* Step 5 */}
                    <div className="flex bg-[#1A1A2E] rounded-lg overflow-hidden border border-[#75AB61]/30 h-12 group w-[80%] mx-auto shadow-[0_0_15px_rgba(117,171,97,0.15)]">
                      <div className="bg-[#75AB61]/20 text-[#75AB61] w-32 flex items-center px-4 text-sm font-black uppercase shrink-0">Vendas</div>
                      <div className="flex-1 flex items-center px-4 relative bg-[#0b1120]">
                        <div className="absolute inset-y-0 left-0 bg-[#75AB61]/30 transition-all duration-500" style={{width: `${(selectedCampaign.funnel.sale / selectedCampaign.funnel.replied) * 100 || 0}%`}}></div>
                        <span className="relative z-10 text-lg font-bold text-[#A2C794]">{selectedCampaign.funnel.sale.toLocaleString()}</span>
                        <span className="relative z-10 ml-auto text-sm font-bold text-[#75AB61] bg-[#75AB61]/10 px-2.5 py-1 rounded">{Math.round((selectedCampaign.funnel.sale / selectedCampaign.funnel.sent) * 100) || 0}% (Global)</span>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
              
              {/* Table / Timeline placeholder */}
              <div>
                <h3 className="text-sm font-bold text-white mb-4">Linha do Tempo Recente</h3>
                <div className="bg-[#0b1120] rounded-xl border border-slate-800 overflow-hidden text-sm">
                  <div className="grid grid-cols-4 bg-slate-800/80 p-3 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <span>Horário</span>
                    <span className="col-span-2">Evento</span>
                    <span>Status</span>
                  </div>
                  <div className="divide-y divide-slate-800 border-t border-slate-800">
                    {selectedCampaign.status === 'Agendado' ? (
                      <div className="p-6 text-center text-slate-500 text-sm">
                        Nenhum evento registrado ainda.
                      </div>
                    ) : (
                      [1,2,3].map((i) => (
                        <div key={i} className="grid grid-cols-4 p-3 hover:bg-slate-800/30 text-slate-300 transition-colors">
                          <span className="text-slate-400">10:4{i} AM</span>
                          <span className="col-span-2 text-slate-200">Lote #{120+i} de 500 leads processado com sucesso</span>
                          <span className="text-emerald-400 flex items-center gap-1.5 font-medium"><CheckCircle2 size={14}/> Entregue</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

            </div>

            <div className="p-4 border-t border-[#75AB61]/20 bg-[#1A1A2E] flex justify-end gap-3 z-10">
              <button className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-sm font-medium transition-colors border border-slate-700">
                Exportar Relatório (PDF)
              </button>
            </div>
            
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, ChevronLeft, ChevronRight, Filter, 
  Search, Clock, ExternalLink, MessageSquare, CheckCircle2, 
  XCircle, RefreshCw, CheckCircle, Video, Phone, Users, MapPin
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useNavigate } from 'react-router-dom';

interface Event {
  id: string;
  title: string;
  leadName: string;
  leadInitial: string;
  date: string; // ISO date or just day number for mock
  time: string;
  duration: string;
  status: 'confirmed' | 'pending' | 'cancelled' | 'realized';
  type: 'video' | 'phone' | 'in_person';
  channel: 'whatsapp' | 'instagram' | 'web';
  temperature: 'quente' | 'morno' | 'frio';
  description: string;
  excerpt: string;
}

export function Calendar() {
  const navigate = useNavigate();
  const [view, setView] = useState<'month' | 'week' | 'day' | 'list'>('week');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const stats = [
    { label: 'Total do Mês', value: '142', trend: '+12%' },
    { label: 'Confirmados', value: '89', trend: '+5%' },
    { label: 'Pendentes', value: '24', trend: '-2%' },
    { label: 'Taxa de Comparecimento', value: '86%', trend: '+4%' }
  ];

  const mockEvents: Event[] = [
    {
      id: '1',
      title: 'Demo Hermes Nexus',
      leadName: 'Roberto Almeida',
      leadInitial: 'R',
      date: '2026-05-06',
      time: '10:00',
      duration: '30 min',
      status: 'confirmed',
      type: 'video',
      channel: 'whatsapp',
      temperature: 'quente',
      description: 'Apresentação da plataforma e esclarecimento de dúvidas sobre a integração com RD Station.',
      excerpt: 'Lead: "Gostaria de ver como funciona a integração com RD Station."\nSDR: "Perfeito! Vamos agendar uma demonstração rápida. Que tal amanhã às 10h?"'
    },
    {
      id: '2',
      title: 'Call de Descoberta',
      leadName: 'Carla Silva',
      leadInitial: 'C',
      date: '2026-05-06',
      time: '14:30',
      duration: '45 min',
      status: 'pending',
      type: 'phone',
      channel: 'instagram',
      temperature: 'morno',
      description: 'Entender melhor as necessidades do cliente em relação a automação de WhatsApp.',
      excerpt: 'Lead: "Preciso de algo para automatizar meu Instagram."\nSDR: "Legal! Podemos falar sobre isso hoje à tarde?"'
    },
    {
      id: '3',
      title: 'Fechamento de Contrato',
      leadName: 'Marcos Paulo',
      leadInitial: 'M',
      date: '2026-05-07',
      time: '09:00',
      duration: '60 min',
      status: 'realized',
      type: 'video',
      channel: 'web',
      temperature: 'quente',
      description: 'Reunião final para assinatura do contrato e onboarding inicial.',
      excerpt: 'Lead: "Pode mandar o contrato."\nSDR: "Enviado! Vamos fazer uma call para repassar as cláusulas?"'
    },
    {
      id: '4',
      title: 'Dúvidas Técnicas',
      leadName: 'Fernanda Costa',
      leadInitial: 'F',
      date: '2026-05-05',
      time: '16:00',
      duration: '30 min',
      status: 'cancelled',
      type: 'video',
      channel: 'whatsapp',
      temperature: 'frio',
      description: 'Dúvidas sobre a API.',
      excerpt: 'Lead: "A API suporta webhooks?"\nSDR: "Sim! Vamos fazer uma call com um dev nosso?"'
    }
  ];

  const getStatusColor = (status: Event['status']) => {
    switch (status) {
      case 'confirmed': return 'bg-gradient-to-r from-[#75AB61] to-[#A2C794] text-[#0b1120] border-transparent shadow-[0_2px_10px_rgba(117,171,97,0.2)]';
      case 'pending': return 'bg-amber-500/10 text-amber-400 border border-amber-500/30';
      case 'cancelled': return 'bg-red-500/10 text-red-400 border border-red-500/30';
      case 'realized': return 'bg-slate-800 text-slate-400 border border-slate-700';
    }
  };

  const getStatusBg = (status: Event['status']) => {
    switch (status) {
      case 'confirmed': return 'bg-[#75AB61]/10 text-[#75AB61] border-[#75AB61]/30';
      case 'pending': return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'cancelled': return 'bg-red-500/10 text-red-400 border-red-500/30';
      case 'realized': return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  const getTypeIcon = (type: Event['type']) => {
    switch (type) {
      case 'video': return <Video size={14} className="opacity-70" />;
      case 'phone': return <Phone size={14} className="opacity-70" />;
      case 'in_person': return <Users size={14} className="opacity-70" />;
    }
  };

  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const dates = ['3', '4', '5', '6', '7', '8', '9']; // Mock current week
  const hours = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

  return (
    <div className="flex h-full overflow-hidden">
      {/* MAIN CONTENT */}
      <div className={cn("flex-1 px-8 py-6 space-y-6 overflow-y-auto custom-scrollbar transition-all duration-300", selectedEvent ? 'pr-8 xl:pr-[400px]' : '')}>
        
        {/* HEADER */}
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            Agendamentos <CalendarIcon className="text-[#75AB61]" size={24} />
          </h1>
          <p className="text-slate-400 text-sm mt-1">Visão consolidada dos agendamentos gerados pelo Agente SDR via Google Calendar.</p>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <div key={i} className="card-surface p-4 rounded-xl border border-slate-700/50">
              <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">{stat.label}</span>
              <div className="flex items-end justify-between">
                <span className="text-2xl font-bold text-white">{stat.value}</span>
                <span className={cn("text-xs font-semibold px-2 py-0.5 rounded uppercase tracking-wider", stat.trend.startsWith('+') ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400')}>{stat.trend}</span>
              </div>
            </div>
          ))}
        </div>

        {/* TOOLBAR */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 card-surface p-2 rounded-xl border border-slate-700/50">
          <div className="flex items-center gap-2 px-2">
            <button className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors border border-slate-700">
              <ChevronLeft size={18} />
            </button>
            <span className="text-sm font-bold text-white min-w-[140px] text-center">05 a 11 Mai, 2026</span>
            <button className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors border border-slate-700">
              <ChevronRight size={18} />
            </button>
            <button className="text-xs font-bold px-3 text-slate-400 hover:text-white uppercase ml-2 bg-slate-800/50 py-1.5 rounded-lg border border-slate-700">
              Hoje
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2 px-2">
            <div className="flex bg-[#0b1120] p-1 border border-slate-700/50 rounded-lg">
              <button onClick={() => setView('month')} className={cn("px-3 py-1.5 text-xs font-semibold rounded-md transition-colors", view === 'month' ? "bg-slate-800 text-white shadow-sm" : "text-slate-400 hover:text-white")}>Mês</button>
              <button onClick={() => setView('week')} className={cn("px-3 py-1.5 text-xs font-semibold rounded-md transition-colors", view === 'week' ? "bg-slate-800 text-white shadow-sm" : "text-slate-400 hover:text-white")}>Semana</button>
              <button onClick={() => setView('day')} className={cn("px-3 py-1.5 text-xs font-semibold rounded-md transition-colors", view === 'day' ? "bg-slate-800 text-white shadow-sm" : "text-slate-400 hover:text-white")}>Dia</button>
              <button onClick={() => setView('list')} className={cn("px-3 py-1.5 text-xs font-semibold rounded-md transition-colors", view === 'list' ? "bg-slate-800 text-white shadow-sm" : "text-slate-400 hover:text-white")}>Lista</button>
            </div>
            
            <span className="hidden md:block w-px h-6 bg-slate-700"></span>

            <div className="flex gap-2">
              <select className="hidden md:block h-8 rounded-md border border-slate-700 bg-slate-800 px-2 text-xs text-white focus:border-[#75AB61] focus:outline-none placeholder-slate-400">
                <option value="">Todos Agentes</option>
                <option value="1">João Silva (SDR)</option>
                <option value="2">Maria Oliveira (Closer)</option>
              </select>
              
              <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors">
                <Filter size={14} /> <span className="hidden sm:inline">Filtrar</span>
              </button>
            </div>
          </div>
        </div>

            {/* CALENDAR VIEWS MOCK */}
        {view === 'month' && (
          <div className="card-surface border border-slate-700/50 rounded-xl overflow-hidden flex flex-col">
            {/* Header */}
            <div className="grid grid-cols-7 border-b border-slate-700/50 bg-[#0b1120]/50">
              {weekDays.map((day) => (
                <div key={day} className="p-3 text-center border-r border-slate-700/50 last:border-0">
                  <span className="text-xs font-bold uppercase text-slate-400">{day}</span>
                </div>
              ))}
            </div>
            
            {/* Grid */}
            <div className="grid grid-cols-7 grid-rows-5 border-l-0">
              {/* Generate 35 cells for month view */}
              {Array.from({ length: 35 }).map((_, idx) => {
                const dayNumber = idx - 4; // Adjust so the 1st starts somewhere on Friday
                const isCurrentMonth = dayNumber >= 1 && dayNumber <= 31;
                const isToday = dayNumber === 5;
                const eventsForDay = mockEvents.filter(e => {
                   if(e.date === '2026-05-05' && dayNumber === 5) return true;
                   if(e.date === '2026-05-06' && dayNumber === 6) return true;
                   if(e.date === '2026-05-07' && dayNumber === 7) return true;
                   return false;
                });

                return (
                  <div key={idx} className={cn(
                    "h-32 border-b border-r border-slate-700/50 p-1 flex flex-col overflow-hidden transition-colors hover:bg-slate-800/30",
                     !isCurrentMonth && "bg-[#0b1120]/30",
                     isToday && "bg-[#75AB61]/10"
                  )}>
                    <div className="flex justify-start items-start mb-1">
                       <span className={cn(
                         "text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full ml-1 mt-1",
                         isToday ? "bg-[#75AB61] text-[#0b1120]" : isCurrentMonth ? "text-slate-300" : "text-slate-600"
                       )}>
                         {isCurrentMonth ? dayNumber : (dayNumber <= 0 ? 30 + dayNumber : dayNumber - 31)}
                       </span>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto space-y-1 px-1 custom-scrollbar">
                      {eventsForDay.map(evt => (
                        <div 
                          key={evt.id} 
                          onClick={() => setSelectedEvent(evt)}
                          className={cn(
                            "text-[10px] p-1 rounded font-medium truncate cursor-pointer hover:opacity-80 transition-opacity border",
                            getStatusBg(evt.status)
                          )}
                          title={`${evt.time} - ${evt.leadName}`}
                        >
                          <span className="font-mono mr-1 opacity-70">{evt.time}</span>
                          {evt.leadName}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {view === 'day' && (
          <div className="card-surface border border-slate-700/50 rounded-xl overflow-hidden flex flex-col h-[600px]">
            <div className="grid grid-cols-[80px_1fr] border-b border-slate-700/50 bg-[#0b1120]/50 sticky top-0 z-10">
              <div className="p-3 border-r border-slate-700/50 flex items-center justify-center">
                 <Clock size={16} className="text-slate-500" />
              </div>
              <div className="p-3 bg-[#75AB61]/5 border-l-[3px] border-[#75AB61]">
                <div className="text-xs font-bold uppercase mb-1 text-[#75AB61]">Terça-Feira</div>
                <div className="text-xl font-bold font-mono text-white">5 de Maio, 2026</div>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar relative">
              <div className="grid grid-cols-[80px_1fr] min-h-full">
                <div className="border-r border-slate-700/50 bg-[#0b1120]/30">
                  {hours.map((hour) => (
                    <div key={hour} className="h-24 border-b border-slate-700/30 flex justify-center items-start pt-2">
                       <span className="text-[10px] font-mono text-slate-500 font-semibold">{hour}</span>
                    </div>
                  ))}
                </div>
                <div className="relative bg-[#75AB61]/5 border-slate-700/50 border-r">
                  {hours.map((hour) => (
                    <div key={hour} className="h-24 border-b border-slate-700/30"></div>
                  ))}
                  
                  {/* Mock Event for today */}
                  <div 
                    onClick={() => setSelectedEvent(mockEvents[3])}
                    className={cn("absolute left-2 right-4 top-[772px] h-[70px] rounded-lg p-3 cursor-pointer border hover:scale-[1.01] transition-transform shadow-lg flex flex-col justify-center", getStatusColor(mockEvents[3].status))}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5 w-16">
                        {getTypeIcon(mockEvents[3].type)}
                        <span className="text-xs font-bold text-white">{mockEvents[3].time}</span>
                      </div>
                      <div className="w-px h-8 bg-white/20"></div>
                      <div>
                        <span className="block text-sm font-bold text-white mb-0.5">{mockEvents[3].leadName}</span>
                        <span className="text-xs font-medium text-white/80">{mockEvents[3].title}</span>
                      </div>
                      <span className="ml-auto text-xs font-mono text-white/60 bg-white/10 px-2 py-1 rounded">{mockEvents[3].duration}</span>
                    </div>
                  </div>

                  <div className="absolute left-0 right-0 top-[820px] h-px bg-[#75AB61] z-10 pointer-events-none">
                     <div className="absolute -left-1.5 -top-1.5 w-3 h-3 rounded-full border-2 border-[#111A22] bg-[#75AB61]"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {view === 'week' && (
          <div className="card-surface border border-slate-700/50 rounded-xl overflow-hidden flex flex-col h-[600px]">
            {/* Header */}
            <div className="grid grid-cols-8 border-b border-slate-700/50 bg-[#0b1120]/50 sticky top-0 z-10">
              <div className="p-3 text-center border-r border-slate-700/50">
                 <Clock size={16} className="text-slate-500 mx-auto" />
              </div>
              {weekDays.map((day, i) => (
                <div key={day} className={cn("p-3 text-center border-r border-slate-700/50", i === 2 ? 'bg-[#75AB61]/5' : '')}>
                  <div className={cn("text-xs font-bold uppercase mb-1", i === 2 ? 'text-[#75AB61]' : 'text-slate-400')}>{day}</div>
                  <div className={cn("text-xl font-bold font-mono", i === 2 ? 'text-white' : 'text-slate-300')}>{dates[i]}</div>
                </div>
              ))}
            </div>

            {/* Grid */}
            <div className="flex-1 overflow-y-auto custom-scrollbar relative">
              <div className="grid grid-cols-8 min-h-full">
                {/* Time Axis */}
                <div className="border-r border-slate-700/50">
                  {hours.map((hour) => (
                    <div key={hour} className="h-24 border-b border-slate-700/30 flex justify-center items-start pt-2">
                       <span className="text-[10px] font-mono text-slate-500 font-semibold">{hour}</span>
                    </div>
                  ))}
                </div>
                
                {/* Day Columns */}
                {weekDays.map(( day, dayIdx ) => (
                  <div key={day} className={cn("border-r border-slate-700/50 relative", dayIdx === 2 ? 'bg-[#75AB61]/5' : '')}>
                    {hours.map((hour) => (
                      <div key={hour} className="h-24 border-b border-slate-700/30"></div>
                    ))}

                    {/* MOCK EVENTS PLACEMENT */}
                    {dayIdx === 3 && ( // Wednesday 
                      <div 
                        onClick={() => setSelectedEvent(mockEvents[0])}
                        className={cn("absolute left-1 right-1 top-[204px] h-[44px] rounded-md p-2 cursor-pointer border hover:scale-[1.02] transition-transform", getStatusColor(mockEvents[0].status))}
                      >
                        <div className="flex items-center gap-1.5 mb-0.5">
                          {getTypeIcon(mockEvents[0].type)}
                          <span className={cn("text-[10px] font-bold truncate", mockEvents[0].status === 'confirmed' ? "text-[#0b1120]" : "text-white")}>{mockEvents[0].time}</span>
                        </div>
                        <span className={cn("block text-xs font-bold truncate", mockEvents[0].status === 'confirmed' ? "text-[#0b1120]" : "text-white")}>{mockEvents[0].leadName}</span>
                      </div>
                    )}
                    
                    {dayIdx === 3 && ( // Wednesday 
                      <div 
                        onClick={() => setSelectedEvent(mockEvents[1])}
                        className={cn("absolute left-1 right-1 top-[636px] h-[70px] rounded-md p-2 cursor-pointer border hover:scale-[1.02] transition-transform", getStatusColor(mockEvents[1].status))}
                      >
                        <div className="flex items-center gap-1.5 mb-0.5">
                          {getTypeIcon(mockEvents[1].type)}
                          <span className="text-[10px] font-bold text-white truncate">{mockEvents[1].time}</span>
                        </div>
                        <span className="block text-xs font-bold text-white truncate mb-1">{mockEvents[1].leadName}</span>
                        <span className="text-[10px] font-medium opacity-80 truncate block">{mockEvents[1].title}</span>
                      </div>
                    )}
                    
                    {dayIdx === 4 && ( // Thursday 
                      <div 
                        onClick={() => setSelectedEvent(mockEvents[2])}
                        className={cn("absolute left-1 right-1 top-[100px] h-[90px] rounded-md p-2 cursor-pointer hover:scale-[1.02] transition-transform", getStatusColor(mockEvents[2].status))}
                      >
                        <div className="flex items-center gap-1.5 mb-0.5">
                          {getTypeIcon(mockEvents[2].type)}
                          <span className="text-[10px] font-bold truncate">{mockEvents[2].time}</span>
                        </div>
                        <span className="block text-xs font-bold truncate mb-1">{mockEvents[2].leadName}</span>
                        <span className="text-[10px] font-medium opacity-80 truncate block">{mockEvents[2].title}</span>
                      </div>
                    )}

                    {dayIdx === 2 && ( // Tuesday (Today)
                      <div 
                        onClick={() => setSelectedEvent(mockEvents[3])}
                        className={cn("absolute left-1 right-1 top-[772px] h-[44px] rounded-md p-2 cursor-pointer border hover:scale-[1.02] transition-transform", getStatusColor(mockEvents[3].status))}
                      >
                        <div className="flex items-center gap-1.5 mb-0.5">
                          {getTypeIcon(mockEvents[3].type)}
                          <span className="text-[10px] font-bold text-white truncate">{mockEvents[3].time}</span>
                        </div>
                        <span className="block text-xs font-bold text-white truncate">{mockEvents[3].leadName}</span>
                      </div>
                    )}

                    {/* Current Time Line Mock (Only on Today = dayIdx 2) */}
                    {dayIdx === 2 && (
                       <div className="absolute left-0 right-0 top-[820px] h-px bg-[#75AB61] z-10 pointer-events-none">
                         <div className="absolute -left-2 -top-1.5 w-3 h-3 rounded-full bg-[#75AB61]"></div>
                       </div>
                    )}

                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {view === 'list' && (
          <div className="card-surface border border-slate-700/50 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-700/50 bg-[#0b1120]/50">
                    <th className="p-4 text-xs font-semibold text-slate-400 uppercase">Data e Hora</th>
                    <th className="p-4 text-xs font-semibold text-slate-400 uppercase">Lead</th>
                    <th className="p-4 text-xs font-semibold text-slate-400 uppercase">Tipo</th>
                    <th className="p-4 text-xs font-semibold text-slate-400 uppercase">Status</th>
                    <th className="p-4 text-xs font-semibold text-slate-400 uppercase text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {mockEvents.map(event => (
                    <tr key={event.id} className="hover:bg-slate-800/20 transition-colors cursor-pointer" onClick={() => setSelectedEvent(event)}>
                      <td className="p-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-white mb-0.5">{event.date.split('-').reverse().join('/')}</div>
                        <div className="text-xs text-slate-400 font-mono">{event.time} ({event.duration})</div>
                      </td>
                      <td className="p-4 min-w-[200px]">
                         <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-white border border-slate-700 shrink-0">
                             {event.leadInitial}
                           </div>
                           <div>
                             <span className="block text-sm font-bold text-white">{event.leadName}</span>
                             <span className="text-[10px] uppercase text-slate-400">{event.title}</span>
                           </div>
                         </div>
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-slate-300">
                          {getTypeIcon(event.type)}
                          <span className="text-sm">{event.type === 'video' ? 'Google Meet' : event.type === 'phone' ? 'Telefone' : 'Presencial'}</span>
                        </div>
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        <span className={cn("px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border", getStatusBg(event.status))}>
                           {event.status === 'confirmed' ? 'Confirmado' : 
                            event.status === 'pending' ? 'Pendente' : 
                            event.status === 'cancelled' ? 'Cancelado' : 'Realizado'}
                        </span>
                      </td>
                      <td className="p-4 text-right whitespace-nowrap">
                        <button className="text-[#75AB61] hover:text-[#5f8c4e] text-xs font-bold transition-colors">
                          Ver Detalhes
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

      {/* SIDE PANEL */}
      <div 
        className={cn(
          "fixed xl:absolute right-0 top-0 bottom-0 w-[400px] bg-[#111A22] border-l border-slate-700 shadow-2xl transition-transform duration-300 z-50 flex flex-col",
          selectedEvent ? "translate-x-0" : "translate-x-full"
        )}
      >
        {selectedEvent && (
          <>
            <div className="p-4 border-b border-slate-700 flex items-center gap-4 bg-[#0b1120]">
              <button 
                onClick={() => setSelectedEvent(null)}
                className="p-1 text-slate-400 hover:text-white bg-slate-800 rounded-md"
              >
                <ChevronRight size={20} />
              </button>
              <h2 className="text-sm font-bold text-white">Detalhes do Agendamento</h2>
              <div className="ml-auto">
                <button className="text-slate-400 hover:text-white p-1 rounded-md transition-colors" title="Ver no Google Calendar">
                  <ExternalLink size={18} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
              
              {/* Event Header */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className={cn("px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider border", getStatusBg(selectedEvent.status))}>
                    {selectedEvent.status === 'confirmed' ? 'Confirmado' : 
                     selectedEvent.status === 'pending' ? 'Pendente' : 
                     selectedEvent.status === 'cancelled' ? 'Cancelado' : 'Realizado'}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">{selectedEvent.type === 'video' ? 'Google Meet' : 'Telefone / Presencial'}</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{selectedEvent.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{selectedEvent.description}</p>
              </div>

              {/* DateTime Info */}
              <div className="card-surface p-4 rounded-xl border border-slate-700 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
                    <CalendarIcon size={16} />
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold text-slate-500 uppercase">Data</span>
                    <span className="text-sm font-bold text-white">{selectedEvent.date.split('-').reverse().join('/')}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                    <Clock size={16} />
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold text-slate-500 uppercase">Horário e Duração</span>
                    <span className="text-sm font-bold text-white">{selectedEvent.time} <span className="text-slate-400 font-medium">({selectedEvent.duration})</span></span>
                  </div>
                </div>
              </div>

              {/* Lead Info */}
              <div>
                 <h4 className="text-xs font-bold text-slate-400 uppercase mb-3">Informações do Lead</h4>
                 <div className="card-surface p-4 rounded-xl border border-slate-700 flex items-center gap-4 cursor-pointer hover:bg-slate-800/60 transition-colors">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-lg font-bold text-white border border-slate-700">
                        {selectedEvent.leadInitial}
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-[#111A22] flex items-center justify-center text-[#111A22]">
                        <MessageSquare size={10} />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h5 className="text-sm font-bold text-white mb-0.5">{selectedEvent.leadName}</h5>
                      <div className="flex flex-wrap gap-2 text-xs">
                        <span className={cn("px-1.5 py-0.5 rounded font-medium", 
                          selectedEvent.temperature === 'quente' ? 'bg-red-500/10 text-red-500' :
                          selectedEvent.temperature === 'morno' ? 'bg-amber-500/10 text-amber-500' :
                          'bg-blue-500/10 text-blue-500'
                        )}>Temp: {selectedEvent.temperature}</span>
                        <span className="text-slate-400 capitalize">Origem: {selectedEvent.channel}</span>
                      </div>
                    </div>
                 </div>
              </div>

              {/* Context Summary */}
              <div>
                 <h4 className="text-xs font-bold text-slate-400 uppercase mb-3">Contexto da Conversa com SDR</h4>
                 <div className="bg-[#0b1120] p-4 rounded-xl border border-slate-700/80">
                    <p className="text-sm text-slate-300 whitespace-pre-line font-mono leading-relaxed">{selectedEvent.excerpt}</p>
                    <button 
                      onClick={() => navigate('/conversations')}
                      className="mt-4 text-xs font-bold text-[#75AB61] hover:text-[#5f8c4e] flex items-center gap-1 transition-colors"
                    >
                      <MessageSquare size={14} /> Abrir Conversa Completa
                    </button>
                 </div>
              </div>

            </div>

            {/* Actions Footer */}
            <div className="p-4 border-t border-slate-700 bg-[#0b1120]">
              {selectedEvent.status === 'pending' && (
                <div className="grid grid-cols-2 gap-2">
                  <button className="py-2.5 bg-emerald-500/20 text-emerald-500 border border-emerald-500/30 font-bold rounded-lg hover:bg-emerald-500/30 transition-colors text-xs flex items-center justify-center gap-1.5">
                    <CheckCircle2 size={16} /> Confirmar
                  </button>
                  <button className="py-2.5 bg-slate-800 text-slate-300 border border-slate-700 font-bold rounded-lg hover:bg-slate-700 transition-colors text-xs flex items-center justify-center gap-1.5">
                    <RefreshCw size={16} /> Reagendar
                  </button>
                </div>
              )}
              {selectedEvent.status === 'confirmed' && (
                <div className="grid grid-cols-2 gap-2">
                  <button className="py-2.5 brand-gradient text-[#0b1120] font-bold rounded-lg hover:opacity-90 transition-opacity text-xs flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(117,171,97,0.3)] border-transparent">
                    <CheckCircle size={16} /> Marcar Realizado
                  </button>
                  <button className="py-2.5 bg-red-500/10 text-red-400 border border-red-500/20 font-bold rounded-lg hover:bg-red-500/20 transition-colors text-xs flex items-center justify-center gap-1.5">
                    <XCircle size={16} /> Cancelar
                  </button>
                </div>
              )}
               {['realized', 'cancelled'].includes(selectedEvent.status) && (
                 <button className="w-full py-2.5 bg-slate-800 text-slate-300 border border-slate-700 font-bold rounded-lg hover:bg-slate-700 transition-colors text-xs flex items-center justify-center gap-1.5">
                    Histórico Arquivado
                 </button>
               )}
            </div>
          </>
        )}
      </div>

    </div>
  );
}


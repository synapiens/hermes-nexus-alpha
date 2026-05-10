import React, { useState, useEffect } from 'react';
import { 
  Bot, Settings, Upload, Globe, MessageSquare, ListTodo, 
  Thermometer, Calendar, Target, BookOpen, ShoppingCart, 
  CreditCard, SlidersHorizontal, UserCircle, LayoutGrid, Clock, 
  ShieldAlert, Sparkles, Plus, Trash2, GripVertical, Save,
  Users, Scissors, Stethoscope, CalendarCheck, DollarSign, Info
} from 'lucide-react';
import { cn } from '../lib/utils';
import { supabase } from '../lib/supabase';
import { useOrganization } from '../contexts/OrganizationContext';
import toast from 'react-hot-toast';

export function Agents() {
  const { organization } = useOrganization();
  const [activeTab, setActiveTab] = useState<'sdr' | 'knowledge' | 'dispatcher' | 'scheduler'>('sdr');
  const [loading, setLoading] = useState(true);

  // Common States
  const [agentActives, setAgentActives] = useState({ sdr: true, knowledge: true, dispatcher: true, scheduler: true });
  const [agentNames, setAgentNames] = useState({ 
    sdr: 'Julia (Equipe de Atendimento)', 
    knowledge: 'Hermes Assistente', 
    dispatcher: 'Equipe de Novidades',
    scheduler: 'Hermes Agendamento'
  });
  const [agentMsgs, setAgentMsgs] = useState({
    sdr: 'Olá! Meu nome é {{agent_name}}, represento a equipe de atendimento. Para melhor ajudá-lo(a), gostaria de fazer algumas perguntas rápidas.',
    knowledge: 'Olá! Como posso ajudar você a entender melhor nossos produtos ou resolver sua dúvida hoje?',
    dispatcher: 'Esta é apenas uma IA disparadora, sua primeira mensagem será sempre a definida na campanha.',
    scheduler: 'Olá! Sou o {{agent_name}} e estou aqui para ajudar você a agendar um horário em nossa unidade. Qual serviço você procura?'
  });

  // Persona States
  const [agentPersonas, setAgentPersonas] = useState<Record<string, any>>({
    sdr: { tone: 'Neutro', emojiLevel: 'normal', isFixed: false, additional: '' },
    knowledge: { tone: 'Neutro', emojiLevel: 'normal', isFixed: false, additional: '' },
    dispatcher: { tone: 'Neutro', emojiLevel: 'normal', isFixed: false, additional: '' },
    scheduler: { tone: 'Neutro', emojiLevel: 'normal', isFixed: false, additional: '' }
  });

  useEffect(() => {
    if (organization?.id) {
      fetchAgents();
    }
  }, [organization?.id]);

  const fetchAgents = async () => {
    if (!organization?.id) return;

    try {
      setLoading(true);
      // Fetch agents with their personas
      const { data: agentsData, error: agentsError } = await supabase
        .from('agents')
        .select('*, agent_personas(*)')
        .eq('organization_id', organization.id);

      if (agentsError) throw agentsError;
      
      if (agentsData) {
        const actives = { ...agentActives };
        const names = { ...agentNames };
        const msgs = { ...agentMsgs };
        const personas = { ...agentPersonas };
        
        for (const agent of agentsData) {
          const type = agent.type?.toLowerCase() as 'sdr' | 'knowledge' | 'dispatcher' | 'scheduler';
          if (type && actives[type] !== undefined) {
            actives[type] = agent.status === 'ativo';
            names[type] = agent.name || names[type];
            
            // Handle both object and array, and potential property name variations (Supabase/PostgREST quirks)
            const personaData = agent.agent_personas || agent.agent_persona || agent.agents_persona || agent.agents_personas;
            const persona = Array.isArray(personaData) ? personaData[0] : personaData;

            if (persona) {
              msgs[type] = persona.presentation_message || msgs[type];
              personas[type] = {
                tone: persona.tone || 'Neutro',
                emojiLevel: persona.emoji_level || 'normal',
                isFixed: persona.is_presentation_fixed || false,
                additional: persona.additional_persona || ''
              };
            }
            
            if (type === 'scheduler') {
              // Fetch scheduling related data
              const { data: profs } = await supabase
                .from('scheduling_professionals')
                .select('*')
                .eq('agent_id', agent.id);
              
              if (profs && profs.length > 0) {
                setProfessionals(profs.map(p => ({
                  id: p.id,
                  name: p.name,
                  email: p.email,
                  calendarType: p.calendar_type
                })));
                
                setSelectedProfId(profs[0].id);

                const profIds = profs.map(p => p.id);
                
                const { data: svcs } = await supabase
                  .from('scheduling_services')
                  .select('*')
                  .in('professional_id', profIds);
                
                if (svcs) setServices(svcs.map(s => ({
                  id: s.id,
                  professionalId: s.professional_id,
                  name: s.name,
                  shortDescription: s.short_description,
                  description: s.description,
                  duration: s.duration,
                  price: s.price,
                  kb: s.kb,
                  recurrence: s.recurrence
                })));

                const { data: avails } = await supabase
                  .from('scheduling_availability')
                  .select('*')
                  .in('professional_id', profIds);
                
                if (avails) {
                  const availObj: any = {};
                  profIds.forEach(pid => {
                    availObj[pid] = {
                      'Segunda': [], 'Terça': [], 'Quarta': [], 'Quinta': [], 'Sexta': [], 'Sábado': [], 'Domingo': []
                    };
                  });

                  avails.forEach(a => {
                    if (availObj[a.professional_id]) {
                      availObj[a.professional_id][a.day_of_week].push({
                        id: a.id,
                        start: a.start_time.substring(0, 5),
                        end: a.end_time.substring(0, 5)
                      });
                    }
                  });
                  setAvailability(availObj);
                }
              }
            }
          }
        }
        
        setAgentActives(actives);
        setAgentNames(names);
        setAgentMsgs(msgs);
        setAgentPersonas(personas);
      }
    } catch (err) {
      console.error('Error fetching agents:', err);
    } finally {
      setLoading(false);
    }
  };

  const saveAgent = async (type: 'sdr' | 'knowledge' | 'dispatcher' | 'scheduler') => {
    if (!organization?.id) return;

    try {
      // 1. Upsert Agent
      const agentPayload = {
        organization_id: organization.id,
        type,
        name: agentNames[type],
        status: agentActives[type] ? 'ativo' : 'inativo',
        language: 'Português Brasil',
        domain: organization.name.toLowerCase().replace(/\s+/g, '-')
      };

      const { data: agent, error: agentErr } = await supabase
        .from('agents')
        .upsert(agentPayload, { onConflict: 'organization_id,type' })
        .select()
        .single();

      if (agentErr) throw agentErr;

      // 2. Upsert Persona
      const personaPayload = {
        agent_id: agent.id,
        tone: agentPersonas[type].tone,
        presentation_message: agentMsgs[type],
        is_presentation_fixed: agentPersonas[type].isFixed,
        emoji_level: agentPersonas[type].emojiLevel,
        additional_persona: agentPersonas[type].additional
      };

      const { error: personaErr } = await supabase
        .from('agent_personas')
        .upsert(personaPayload, { onConflict: 'agent_id' });

      if (personaErr) throw personaErr;

      // 3. Scheduler Specific
      if (type === 'scheduler') {
        // Sync Professionals
        for (const prof of professionals) {
          const profPayload = {
            agent_id: agent.id,
            name: prof.name,
            email: prof.email,
            calendar_type: prof.calendarType
          };

          let profId = prof.id;
          // If ID is a number, it's a frontend-generated ID (not a UUID from DB)
          const isNew = typeof prof.id === 'number';

          if (isNew) {
            const { data: newProf, error: pErr } = await supabase
              .from('scheduling_professionals')
              .insert(profPayload)
              .select()
              .single();
            if (pErr) throw pErr;
            profId = newProf.id;
          } else {
            const { error: pErr } = await supabase
              .from('scheduling_professionals')
              .update(profPayload)
              .eq('id', prof.id);
            if (pErr) throw pErr;
          }

          // Sync Services for this professional
          const profServices = services.filter(s => s.professionalId === prof.id);
          for (const svc of profServices) {
            const svcPayload = {
              professional_id: profId,
              name: svc.name,
              short_description: svc.shortDescription,
              description: svc.description,
              duration: svc.duration,
              price: svc.price,
              kb: svc.kb,
              recurrence: svc.recurrence
            };

            const isSvcNew = typeof svc.id === 'number';
            if (isSvcNew) {
              const { error: sErr } = await supabase.from('scheduling_services').insert(svcPayload);
              if (sErr) throw sErr;
            } else {
              const { error: sErr } = await supabase.from('scheduling_services').update(svcPayload).eq('id', svc.id);
              if (sErr) throw sErr;
            }
          }

          // Sync Availability
          const profAvail = availability[prof.id];
          if (profAvail) {
            // Simple approach: clear and re-insert for the professional
            const { error: dErr } = await supabase.from('scheduling_availability').delete().eq('professional_id', profId);
            if (dErr) throw dErr;
            
            const availInserts = [];
            for (const day of Object.keys(profAvail)) {
              for (const slot of profAvail[day]) {
                availInserts.push({
                  professional_id: profId,
                  day_of_week: day,
                  start_time: slot.start,
                  end_time: slot.end
                });
              }
            }
            if (availInserts.length > 0) {
              const { error: iErr } = await supabase.from('scheduling_availability').insert(availInserts);
              if (iErr) throw iErr;
            }
          }
        }
      }
      
      toast.success('Agente salvo com sucesso!');
      fetchAgents(); // Refresh to get DB IDs
    } catch (error) {
      console.error('Error saving agent:', error);
      toast.error('Erro ao salvar agente.');
    }
  };
  
  // SDR States
  const [sdrQuestions, setSdrQuestions] = useState([
    'Qual o seu maior desafio atual relacionado a vendas?',
    'Você já possui alguma ferramenta de CRM ou automação?',
    'Qual a sua expectativa de prazo para implementar uma solução?'
  ]);
  const [sdrAction, setSdrAction] = useState('both');

  // Knowledge States
  const [kbSalesEnabled, setKbSalesEnabled] = useState(false);
  const [kbDepth, setKbDepth] = useState(2); // 1: Resumida, 2: Detalhada, 3: Completa

  // Dispatcher States
  const [dispPersonalization, setDispPersonalization] = useState({
    history: true, weather: false, seasonality: true, lastPurchase: false
  });

  // Scheduler States
  const [selectedProfId, setSelectedProfId] = useState<number | null>(1);
  const [professionals, setProfessionals] = useState<any[]>([
    { id: 1, name: 'Dr. Roberto Santos', email: 'roberto@synapiens.com', calendarType: 'shared' }
  ]);
  const [services, setServices] = useState<any[]>([
    { 
      id: 1, 
      professionalId: 1,
      name: 'Consulta Inicial', 
      shortDescription: 'Avaliação técnica preliminar',
      description: 'Primeira conversa para avaliação técnica.', 
      duration: 30, 
      price: 250, 
      kb: 'Focar em entender as dores do cliente e demonstrar a plataforma.',
      recurrence: 3
    }
  ]);
  const [availability, setAvailability] = useState<any>({
    1: {
      'Segunda': [{ start: '08:00', end: '12:00' }, { start: '14:00', end: '18:00' }],
      'Terça': [{ start: '09:00', end: '15:00' }],
      'Quarta': [{ start: '08:00', end: '12:00' }, { start: '14:00', end: '19:00' }],
      'Quinta': [{ start: '09:00', end: '18:00' }],
      'Sexta': [{ start: '08:00', end: '17:00' }],
      'Sábado': [],
      'Domingo': []
    }
  });
  
  const daysOfWeek = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];

  const handleAddSlot = (day: string) => {
    if (!selectedProfId) return;
    const profAvail = availability[selectedProfId] || {
      'Segunda': [], 'Terça': [], 'Quarta': [], 'Quinta': [], 'Sexta': [], 'Sábado': [], 'Domingo': []
    };
    setAvailability({
      ...availability,
      [selectedProfId]: {
        ...profAvail,
        [day]: [...(profAvail[day] || []), { start: '09:00', end: '10:00' }]
      }
    });
  };

  const handleRemoveSlot = (day: string, index: number) => {
    if (!selectedProfId) return;
    const profAvail = { ...availability[selectedProfId] };
    profAvail[day] = profAvail[day].filter((_: any, i: number) => i !== index);
    setAvailability({ ...availability, [selectedProfId]: profAvail });
  };

  const handleSlotChange = (day: string, index: number, field: 'start' | 'end', val: string) => {
    if (!selectedProfId) return;
    const profAvail = { ...availability[selectedProfId] };
    const newDaySlots = [...profAvail[day]];
    newDaySlots[index] = { ...newDaySlots[index], [field]: val };
    profAvail[day] = newDaySlots;
    setAvailability({ ...availability, [selectedProfId]: profAvail });
  };

  const handleQuestionAdd = () => setSdrQuestions([...sdrQuestions, '']);
  const handleQuestionChange = (index: number, val: string) => {
    const newQ = [...sdrQuestions];
    newQ[index] = val;
    setSdrQuestions(newQ);
  };
  const handleQuestionRemove = (index: number) => {
    setSdrQuestions(sdrQuestions.filter((_, i) => i !== index));
  };

  const handleAddProfessional = () => {
    const newId = Date.now();
    setProfessionals([...professionals, { id: newId, name: '', email: '', calendarType: 'shared' }]);
    setAvailability({
      ...availability,
      [newId]: {
        'Segunda': [], 'Terça': [], 'Quarta': [], 'Quinta': [], 'Sexta': [], 'Sábado': [], 'Domingo': []
      }
    });
    setSelectedProfId(newId);
  };

  const handleRemoveProfessional = (id: number) => {
    setProfessionals(professionals.filter(p => p.id !== id));
    const newAvail = { ...availability };
    delete newAvail[id];
    setAvailability(newAvail);
    if (selectedProfId === id) setSelectedProfId(professionals[0]?.id || null);
  };

  const handleProfessionalChange = (id: number, field: string, val: string) => {
    setProfessionals(professionals.map(p => p.id === id ? { ...p, [field]: val } : p));
  };

  const handleAddService = () => {
    setServices([...services, { 
      id: Date.now(), 
      professionalId: selectedProfId || professionals[0]?.id,
      name: '', 
      shortDescription: '',
      description: '', 
      duration: 30, 
      price: 0, 
      kb: '', 
      recurrence: 0 
    }]);
  };

  const handleRemoveService = (id: number) => {
    setServices(services.filter(s => s.id !== id));
  };

  const handleServiceChange = (id: number, field: string, val: any) => {
    setServices(services.map(s => s.id === id ? { ...s, [field]: val } : s));
  };

  const renderCommonSettings = (type: 'sdr' | 'knowledge' | 'dispatcher' | 'scheduler', title: string) => (
    <div className="card-surface rounded-xl p-6 border border-slate-700/50 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-700/50">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl brand-gradient flex items-center justify-center shadow-lg text-[#0b1120]">
            <Bot size={28} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">{title}</h2>
            <p className="text-sm text-slate-400">Configurações globais de identidade</p>
          </div>
        </div>

        <label className="flex items-center gap-3 cursor-pointer bg-[#0b1120]/50 p-2.5 rounded-lg border border-slate-700/50">
          <span className="text-sm font-semibold text-slate-300">Agente Ativo</span>
          <div className="relative inline-flex items-center">
            <input 
              type="checkbox" 
              className="sr-only peer" 
              checked={agentActives[type]} 
              onChange={(e) => setAgentActives({ ...agentActives, [type]: e.target.checked })} 
            />
            <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#75AB61]"></div>
          </div>
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Identidade */}
        <div className="space-y-5">
          <div className="flex items-start gap-4">
            <div className="shrink-0 flex flex-col items-center gap-2">
              <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center border-2 border-slate-700 border-dashed hover:border-[#75AB61] cursor-pointer transition-colors overflow-hidden group relative">
                <UserCircle size={32} className="text-slate-500 group-hover:opacity-0 transition-opacity" />
                <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Upload size={16} className="text-white mb-1" />
                  <span className="text-[10px] text-white font-medium">Upload</span>
                </div>
              </div>
            </div>
            <div className="flex-1 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase">Nome de Apresentação</label>
                <input 
                  type="text" 
                  value={agentNames[type]} 
                  onChange={(e) => setAgentNames({ ...agentNames, [type]: e.target.value })}
                  className="w-full h-11 rounded-lg border border-slate-700 bg-[#0b1120]/50 px-4 text-sm text-white focus:border-[#75AB61] focus:outline-none focus:ring-1 focus:ring-[#75AB61]" 
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase leading-tight"><Globe size={12} className="inline mr-1" /> Idioma Principal</label>
                <select className="w-full h-11 rounded-lg border border-slate-700 bg-[#0b1120]/50 px-3 text-sm text-white focus:border-[#75AB61] focus:outline-none">
                  <option>Português (Brasil)</option>
                  <option>English (US)</option>
                  <option>Español</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Comportamento */}
        <div className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase flex justify-between">
              <span>Tom de Voz e Personalidade</span>
            </label>
            <div className="flex bg-[#0b1120]/50 p-1 border border-slate-700 rounded-lg">
              {['Formal', 'Neutro', 'Casual', 'Descontraído'].map((t) => (
                <button 
                  key={t}
                  onClick={() => setAgentPersonas({
                    ...agentPersonas,
                    [type]: { ...agentPersonas[type], tone: t }
                  })}
                  className={cn(
                    "flex-1 px-2 py-2 text-[10px] sm:text-xs font-medium rounded-md transition-colors",
                    agentPersonas[type]?.tone === t ? "bg-slate-700 text-white shadow-sm" : "text-slate-400 hover:text-white"
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase">Uso de Emojis</label>
            <select 
              value={agentPersonas[type]?.emojiLevel}
              onChange={(e) => setAgentPersonas({
                ...agentPersonas,
                [type]: { ...agentPersonas[type], emojiLevel: e.target.value }
              })}
              className="w-full h-11 rounded-lg border border-slate-700 bg-[#0b1120]/50 px-3 text-sm text-white focus:border-[#75AB61] focus:outline-none"
            >
              <option value="sem emoji">Sem emoji</option>
              <option value="eventual">Eventual</option>
              <option value="normal">Normal</option>
              <option value="constante">Constante</option>
            </select>
          </div>

          <div>
             <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase flex items-center justify-between">
               <span><MessageSquare size={12} className="inline mr-1"/> Mensagem de Apresentação</span>
               <label className="flex items-center gap-2 cursor-pointer">
                 <span className="text-[10px] font-bold text-slate-500 uppercase">Fixa</span>
                 <input 
                  type="checkbox" 
                  checked={agentPersonas[type]?.isFixed}
                  onChange={(e) => setAgentPersonas({
                    ...agentPersonas,
                    [type]: { ...agentPersonas[type], isFixed: e.target.checked }
                  })}
                  className="w-3 h-3 rounded bg-slate-800 border-slate-700 text-[#75AB61] focus:ring-[#75AB61]" 
                />
               </label>
             </label>
             <textarea 
              className="w-full h-20 rounded-lg border border-slate-700 bg-[#0b1120]/50 p-3 text-sm text-white focus:border-[#75AB61] focus:outline-none focus:ring-1 focus:ring-[#75AB61] resize-none"
              value={agentMsgs[type]}
              onChange={(e) => setAgentMsgs({ ...agentMsgs, [type]: e.target.value })}
              placeholder="Ex: Olá! Sou o {{agent_name}}..."
             ></textarea>
             <p className="text-[10px] text-slate-500 mt-1">
               {agentPersonas[type]?.isFixed ? 'A IA usará exatamente esta mensagem.' : 'A IA usará isso como exemplo para criar sua própria abordagem.'}
             </p>
          </div>

          <div>
             <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase leading-tight">Personalidade Complementar</label>
             <textarea 
              className="w-full h-20 rounded-lg border border-slate-700 bg-[#0b1120]/50 p-3 text-sm text-white focus:border-[#75AB61] focus:outline-none focus:ring-1 focus:ring-[#75AB61] resize-none"
              value={agentPersonas[type]?.additional}
              onChange={(e) => setAgentPersonas({
                ...agentPersonas,
                [type]: { ...agentPersonas[type], additional: e.target.value }
              })}
              placeholder="Descreva detalhes como: 'Você é um especialista em vendas que foca em benefícios emocionais'..."
             ></textarea>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10 mt-2">
      
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          Configuração de Agentes <Settings className="text-[#75AB61]" size={24} />
        </h1>
        <p className="text-slate-400 text-sm mt-1">Personalize o comportamento, fluxos e limites de cada Inteligência Artificial.</p>
      </div>

      {/* TABS */}
      <div className="card-surface p-2 rounded-xl flex gap-2 overflow-x-auto">
        <button 
          onClick={() => setActiveTab('sdr')}
          className={cn("flex-1 py-3 px-4 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all min-w-[170px]", activeTab === 'sdr' ? "bg-amber-500/20 text-amber-400 shadow-sm border border-amber-500/30" : "text-slate-400 hover:text-white hover:bg-slate-800/50")}
        >
          <Target size={18} /> Agente SDR
        </button>
        <button 
          onClick={() => setActiveTab('knowledge')}
          className={cn("flex-1 py-3 px-4 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all min-w-[170px]", activeTab === 'knowledge' ? "bg-indigo-500/20 text-indigo-400 shadow-sm border border-indigo-500/30" : "text-slate-400 hover:text-white hover:bg-slate-800/50")}
        >
          <BookOpen size={18} /> Agente Conhecimento
        </button>
        <button 
          onClick={() => setActiveTab('dispatcher')}
          className={cn("flex-1 py-3 px-4 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all min-w-[170px]", activeTab === 'dispatcher' ? "bg-emerald-500/20 text-emerald-400 shadow-sm border border-emerald-500/30" : "text-slate-400 hover:text-white hover:bg-slate-800/50")}
        >
          <Sparkles size={18} /> Agente Disparador
        </button>
        <button 
          onClick={() => setActiveTab('scheduler')}
          className={cn("flex-1 py-3 px-4 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all min-w-[170px]", activeTab === 'scheduler' ? "bg-blue-500/20 text-blue-400 shadow-sm border border-blue-500/30" : "text-slate-400 hover:text-white hover:bg-slate-800/50")}
        >
          <CalendarCheck size={18} /> Agente de Agendamento
        </button>
      </div>

      {/* SDR AGENT */}
      {activeTab === 'sdr' && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
          
          {renderCommonSettings('sdr', 'Agente SDR (Qualificação)')}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Qualification Flux */}
            <div className="card-surface rounded-xl p-6 border border-slate-700/50">
               <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-6 pb-4 border-b border-slate-700/50">
                <ListTodo size={18} className="text-amber-400"/> Fluxo de Qualificação do Lead
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase flex justify-between items-center">
                    Perguntas a serem feitas
                    <button onClick={handleQuestionAdd} className="text-amber-400 hover:text-amber-300 flex items-center gap-1 font-medium capitalize"><Plus size={12} /> Adicionar</button>
                  </label>
                  <div className="space-y-2">
                    {sdrQuestions.map((q, idx) => (
                      <div key={idx} className="flex items-start gap-2 group">
                        <div className="mt-2.5 cursor-grab text-slate-500 hover:text-slate-300">
                          <GripVertical size={16} />
                        </div>
                        <input 
                          type="text" 
                          value={q}
                          onChange={(e) => handleQuestionChange(idx, e.target.value)}
                          className="flex-1 h-10 rounded-lg border border-slate-700 bg-[#0b1120]/50 px-3 text-sm text-white focus:border-amber-500 focus:outline-none" 
                          placeholder="Digite a pergunta de qualificação..."
                        />
                        <button 
                          onClick={() => handleQuestionRemove(idx)}
                          className="mt-1 p-2 text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-700/50">
                  <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase"><Thermometer size={14} className="inline mr-1" /> Critérios de Temperatura</label>
                  <textarea 
                    className="w-full h-24 rounded-lg border border-slate-700 bg-[#0b1120]/50 p-3 text-sm text-white font-mono placeholder-slate-600 focus:border-amber-500 focus:outline-none resize-none"
                    placeholder="Instruções para a IA validar temperatura. Ex:&#10;- Se tiver budget acima de 1k -> QUENTE&#10;- Se não tem budget -> FRIO"
                    defaultValue="- Se o lead responder afirmativamente sobre uso de CRM -> QUENTE&#10;- Se prazo for imediato -> QUENTE&#10;- Se estiver apenas pesquisando -> FRIO"
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Actions & Calendar */}
            <div className="card-surface rounded-xl p-6 border border-slate-700/50 flex flex-col">
              <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-6 pb-4 border-b border-slate-700/50">
                <Calendar size={18} className="text-amber-400"/> Ação de Fechamento (Lead Quente)
              </h3>
              
              <div className="space-y-6 flex-1">
                <div>
                   <label className="block text-xs font-semibold text-slate-400 mb-3 uppercase">Quando o lead for Qualificado como QUENTE</label>
                   <div className="space-y-3">
                     <label className="flex items-center gap-3 p-3 border border-slate-700/50 bg-[#0b1120]/30 rounded-lg cursor-pointer hover:bg-[#0b1120]/60 transition-colors">
                       <input type="radio" name="sdrAction" value="human" checked={sdrAction === 'human'} onChange={(e) => setSdrAction(e.target.value)} className="text-amber-500 focus:ring-amber-500 bg-slate-800 border-slate-600" />
                       <span className="text-sm text-white font-medium">Apenas encaminhar para atendente humano</span>
                     </label>
                     <label className="flex items-center gap-3 p-3 border border-slate-700/50 bg-[#0b1120]/30 rounded-lg cursor-pointer hover:bg-[#0b1120]/60 transition-colors">
                       <input type="radio" name="sdrAction" value="calendar" checked={sdrAction === 'calendar'} onChange={(e) => setSdrAction(e.target.value)} className="text-amber-500 focus:ring-amber-500 bg-slate-800 border-slate-600" />
                       <span className="text-sm text-white font-medium">Apenas agendar reunião automaticamente</span>
                     </label>
                     <label className="flex items-center gap-3 p-3 border border-amber-500/20 bg-amber-500/5 rounded-lg cursor-pointer transition-colors">
                       <input type="radio" name="sdrAction" value="both" checked={sdrAction === 'both'} onChange={(e) => setSdrAction(e.target.value)} className="text-amber-500 focus:ring-amber-500 bg-slate-800 border-slate-600" />
                       <span className="text-sm text-white font-medium">Priorizar agendamento e notificar humano</span>
                     </label>
                   </div>
                </div>

                {['calendar', 'both'].includes(sdrAction) && (
                  <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700/50 space-y-4 animate-in fade-in slide-in-from-top-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-white flex items-center gap-2"><Calendar size={16} className="text-blue-400" /> Google Calendar</span>
                      <button className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-md transition-colors shadow-sm">Conectar Agenda</button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 pt-2">
                       <div>
                          <label className="block text-[10px] font-semibold text-slate-400 mb-1.5 uppercase">Calendário de Destino</label>
                          <select disabled className="w-full h-9 rounded-md border border-slate-700 bg-[#0b1120]/50 px-2 text-xs text-slate-400 opacity-70">
                            <option>Requer conexão...</option>
                          </select>
                       </div>
                       <div>
                          <label className="block text-[10px] font-semibold text-slate-400 mb-1.5 uppercase">Duração (Reunião)</label>
                          <select className="w-full h-9 rounded-md border border-slate-700 bg-[#0b1120]/50 px-2 text-xs text-white focus:border-amber-500 focus:outline-none">
                            <option>15 minutos</option>
                            <option defaultValue>30 minutos</option>
                            <option>45 minutos</option>
                            <option>60 minutos</option>
                          </select>
                       </div>
                    </div>

                    <div>
                       <label className="block text-[10px] font-semibold text-slate-400 mb-1.5 uppercase">Mensagem de Confirmação</label>
                       <textarea 
                        className="w-full h-16 rounded-md border border-slate-700 bg-[#0b1120]/50 p-2 text-xs text-white focus:border-amber-500 focus:outline-none resize-none"
                        defaultValue="Perfeito! Agendei nossa conversa para {{data}} às {{hora}}. O link do Google Meet foi enviado."
                       ></textarea>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="mt-4 pt-4 border-t border-slate-700/50">
                 <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase">Limite de tentativas sem resposta (Follow-up)</label>
                 <select className="w-full h-11 rounded-lg border border-slate-700 bg-[#0b1120]/50 px-3 text-sm text-white focus:border-amber-500 focus:outline-none">
                   <option>Sem limites (Até encerrar)</option>
                   <option>1 tentativa (Encerra a conversa)</option>
                   <option defaultValue>3 tentativas</option>
                 </select>
              </div>

            </div>
          </div>
          
          <div className="flex justify-end mt-6">
            <button 
              onClick={() => saveAgent('sdr')}
              className="bg-amber-500/20 text-amber-400 border border-amber-500/30 px-8 py-3 rounded-xl font-bold hover:bg-amber-500/30 transition-all flex items-center gap-2"
            >
              <Save size={18} /> Salvar Configurações SDR
            </button>
          </div>
        </div>
      )}

      {/* KNOWLEDGE AGENT */}
      {activeTab === 'knowledge' && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
          
          {renderCommonSettings('knowledge', 'Agente de Conhecimento (Suporte/Info)')}
          
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Knowledge Bases Selection */}
            <div className="card-surface rounded-xl p-6 border border-slate-700/50">
               <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-6 pb-4 border-b border-slate-700/50">
                <BookOpen size={18} className="text-indigo-400"/> Fontes de Inteligência Ativas
              </h3>
              
              <div className="space-y-4">
                <p className="text-xs text-slate-400 mb-2">Selecione as bases ou fontes que este agente tem permissão para consultar para formular respostas.</p>
                
                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                  {[
                    {name: 'catalogo_produtos_2026.pdf', type: 'doc'},
                    {name: 'faq_suporte_tecnico.csv', type: 'doc'},
                    {name: 'https://api.loja.com/v1/products', type: 'api'},
                    {name: 'termos_politica_uso.pdf', type: 'doc', active: false},
                    {name: 'pricing_plans_site', type: 'web'}
                  ].map((base, idx) => (
                    <label key={idx} className="flex items-center justify-between p-3 rounded-lg border border-slate-700/50 bg-[#0b1120]/30 cursor-pointer hover:bg-[#0b1120]/50 transition-colors">
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-md bg-slate-800 flex items-center justify-center text-slate-400 shrink-0 border border-slate-700">
                           {base.type === 'api' ? <Globe size={14} className="text-emerald-400" /> : <BookOpen size={14} className="text-blue-400" />}
                         </div>
                         <div>
                           <span className="block text-sm text-white font-medium">{base.name}</span>
                         </div>
                      </div>
                      <input type="checkbox" defaultChecked={base.active !== false} className="w-4 h-4 text-indigo-500 bg-slate-800 border-slate-600 rounded focus:ring-indigo-500" />
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Sales & Deepness */}
            <div className="card-surface rounded-xl p-6 border border-slate-700/50 flex flex-col">
              <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-6 pb-4 border-b border-slate-700/50">
                <ShoppingCart size={18} className="text-indigo-400"/> Capacidade de Venda
              </h3>
              
              <div className="space-y-6 flex-1">
                <label className="flex items-center justify-between p-4 rounded-xl border border-indigo-500/20 bg-indigo-500/5 cursor-pointer transition-colors">
                  <div>
                    <h4 className="text-sm font-bold text-white mb-0.5">Habilitar Fechamento de Vendas</h4>
                    <p className="text-xs text-slate-400 mr-4">Permite ao agente gerar links de checkout e fechar vendas de produtos indexados diretamente no chat.</p>
                  </div>
                  <div className="relative inline-flex items-center shrink-0">
                    <input type="checkbox" className="sr-only peer" checked={kbSalesEnabled} onChange={(e) => setKbSalesEnabled(e.target.checked)} />
                    <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-500"></div>
                  </div>
                </label>

                {kbSalesEnabled && (
                  <div className="space-y-4 pt-2 animate-in fade-in slide-in-from-top-2">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase flex items-center gap-2"><CreditCard size={12}/> Gateway de Pagamento</label>
                        <select className="w-full h-11 rounded-lg border border-slate-700 bg-[#0b1120]/50 px-3 text-sm text-white focus:border-indigo-500 focus:outline-none">
                          <option>Stripe (Principal)</option>
                          <option>Mercado Pago</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase text-right">Valor Máx. (Autônomo)</label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">R$</span>
                          <input type="number" defaultValue="5000" className="w-full h-11 rounded-lg border border-slate-700 bg-[#0b1120]/50 pl-9 pr-3 text-sm text-white focus:border-indigo-500 focus:outline-none text-right" />
                        </div>
                      </div>
                    </div>
                    <div>
                       <label className="block text-[10px] font-semibold text-slate-400 mb-1.5 uppercase">Mensagem após Pagamento Confirmado</label>
                       <textarea 
                        className="w-full h-16 rounded-md border border-slate-700 bg-[#0b1120]/50 p-3 text-xs text-white focus:border-indigo-500 focus:outline-none resize-none"
                        defaultValue="Seu pagamento foi confirmado! O recibo e detalhes foram enviados para o seu email. Há mais algo que eu possa ajudar?"
                       ></textarea>
                    </div>
                  </div>
                )}
                
                <div className="pt-6 border-t border-slate-700/50">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2 mb-4"><SlidersHorizontal size={14} className="text-indigo-400"/> Profundidade de Resposta</h4>
                  
                  <div className="relative pt-2 pb-6 px-4">
                    <input 
                      type="range" 
                      min="1" 
                      max="3" 
                      value={kbDepth}
                      onChange={(e) => setKbDepth(Number(e.target.value))}
                      className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                    />
                    <div className="flex justify-between text-[10px] font-semibold text-slate-400 mt-3 absolute w-full left-0 px-2 uppercase shadow-white">
                      <span className={kbDepth === 1 ? 'text-indigo-400' : ''}>Resumida / Direta</span>
                      <span className={kbDepth === 2 ? 'text-indigo-400' : ''}>Detalhada Normal</span>
                      <span className={kbDepth === 3 ? 'text-indigo-400' : ''}>Completa e Exaustiva</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>

           </div>

           <div className="flex justify-end mt-6">
            <button 
              onClick={() => saveAgent('knowledge')}
              className="bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 px-8 py-3 rounded-xl font-bold hover:bg-indigo-500/30 transition-all flex items-center gap-2"
            >
              <Save size={18} /> Salvar Configurações Info
            </button>
          </div>
        </div>
      )}

      {/* SCHEDULER AGENT */}
      {activeTab === 'scheduler' && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 space-y-6">
          
          {renderCommonSettings('scheduler', 'Agente de Agendamento (Reservas)')}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Professionals Registration */}
            <div className="card-surface rounded-xl p-6 border border-slate-700/50">
               <h3 className="text-sm font-bold text-white flex items-center justify-between mb-6 pb-4 border-b border-slate-700/50">
                <span className="flex items-center gap-2"><Users size={18} className="text-blue-400"/> Cadastro de Profissionais</span>
                <button onClick={handleAddProfessional} className="text-blue-400 hover:text-blue-300 flex items-center gap-1 text-xs font-bold uppercase tracking-widest transition-all"><Plus size={14} /> Adicionar</button>
              </h3>
              
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {professionals.map((prof) => (
                  <div key={prof.id} className={cn("p-4 rounded-xl border transition-all space-y-4 group cursor-pointer", selectedProfId === prof.id ? "border-blue-500/50 bg-blue-500/5" : "border-slate-700/50 bg-[#0b1120]/30 hover:border-slate-600")} onClick={() => setSelectedProfId(prof.id)}>
                    <div className="flex items-center justify-between">
                       <span className="text-[10px] font-bold text-brand-muted uppercase tracking-widest">Identificação</span>
                       <button onClick={(e) => { e.stopPropagation(); handleRemoveProfessional(prof.id); }} className="text-slate-500 hover:text-red-400 opacity-60 group-hover:opacity-100 transition-all">
                         <Trash2 size={14} />
                       </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <input 
                        type="text" 
                        placeholder="Nome do Profissional"
                        value={prof.name}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => handleProfessionalChange(prof.id, 'name', e.target.value)}
                        className="h-10 rounded-lg border border-slate-700 bg-surface-base px-3 text-sm text-white focus:border-blue-500 focus:outline-none"
                      />
                      <input 
                        type="email" 
                        placeholder="Email (Google Calendar)"
                        value={prof.email}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => handleProfessionalChange(prof.id, 'email', e.target.value)}
                        className="h-10 rounded-lg border border-slate-700 bg-surface-base px-3 text-sm text-white focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-3 pt-2 border-t border-slate-700/30">
                       <div className="flex items-center justify-between">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Configuração de Agenda</label>
                          <select 
                            value={prof.calendarType}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) => handleProfessionalChange(prof.id, 'calendarType', e.target.value)}
                            className="bg-transparent text-[10px] font-bold text-blue-400 focus:outline-none cursor-pointer"
                          >
                            <option value="shared" className="bg-[#0b1120]">Agenda Compartilhada</option>
                            <option value="independent" className="bg-[#0b1120]">Agenda Independente</option>
                          </select>
                       </div>
                       <button className="w-full text-[10px] bg-blue-600 hover:bg-blue-500 text-white font-bold h-8 px-3 rounded-lg transition-all flex items-center justify-center gap-1.5 shadow-lg">
                         <CalendarCheck size={12} /> Conectar Google Calendar
                       </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Services/Products Registration */}
            <div className="card-surface rounded-xl p-6 border border-slate-700/50">
               <h3 className="text-sm font-bold text-white flex items-center justify-between mb-6 pb-4 border-b border-slate-700/50">
                <span className="flex items-center gap-2"><Scissors size={18} className="text-blue-400"/> Catálogo de Serviços</span>
                <button onClick={handleAddService} className="text-blue-400 hover:text-blue-300 flex items-center gap-1 text-xs font-bold uppercase tracking-widest transition-all"><Plus size={14} /> Novo Serviço</button>
              </h3>
              
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {services.filter(s => s.professionalId === selectedProfId).map((service) => (
                  <div key={service.id} className="p-4 rounded-xl border border-slate-700/50 bg-[#0b1120]/30 space-y-4 relative group">
                    <button onClick={() => handleRemoveService(service.id)} className="absolute top-4 right-4 text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all">
                      <Trash2 size={14} />
                    </button>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Nome do Serviço</label>
                        <input 
                          type="text" 
                          value={service.name}
                          onChange={(e) => handleServiceChange(service.id, 'name', e.target.value)}
                          className="w-full h-10 rounded-lg border border-slate-700 bg-surface-base px-3 text-sm text-white focus:border-blue-500 focus:outline-none"
                          placeholder="Ex: Corte de Cabelo"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Duração (Minutos)</label>
                        <div className="relative">
                          <Clock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                          <input 
                            type="number" 
                            value={service.duration}
                            onChange={(e) => handleServiceChange(service.id, 'duration', Number(e.target.value))}
                            className="w-full h-10 rounded-lg border border-slate-700 bg-surface-base pl-9 pr-3 text-sm text-white focus:border-blue-500 focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Descrição Resumida (Rápida)</label>
                      <input 
                        type="text" 
                        value={service.shortDescription}
                        onChange={(e) => handleServiceChange(service.id, 'shortDescription', e.target.value)}
                        className="w-full h-10 rounded-lg border border-slate-700 bg-surface-base px-3 text-sm text-white focus:border-blue-500 focus:outline-none"
                        placeholder="Ex: Barboterapia sem navalha"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Valor (R$)</label>
                        <div className="relative">
                          <DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                          <input 
                            type="number" 
                            value={service.price}
                            onChange={(e) => handleServiceChange(service.id, 'price', Number(e.target.value))}
                            className="w-full h-10 rounded-lg border border-slate-700 bg-surface-base pl-9 pr-3 text-sm text-white focus:border-blue-500 focus:outline-none"
                          />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Recorrência (Meses)</label>
                        <input 
                          type="number" 
                          value={service.recurrence}
                          onChange={(e) => handleServiceChange(service.id, 'recurrence', Number(e.target.value))}
                          className="w-full h-10 rounded-lg border border-slate-700 bg-surface-base px-3 text-sm text-white focus:border-blue-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block flex items-center gap-1.5"><Info size={12}/> Base de Conhecimento do Serviço (IA)</label>
                      <textarea 
                        value={service.kb}
                        onChange={(e) => handleServiceChange(service.id, 'kb', e.target.value)}
                        className="w-full h-20 rounded-lg border border-slate-700 bg-surface-base p-3 text-xs text-white focus:border-blue-500 focus:outline-none resize-none"
                        placeholder="Instruções para o agente tirar dúvidas sobre este serviço específico..."
                      />
                    </div>
                  </div>
                ))}
                {services.filter(s => s.professionalId === selectedProfId).length === 0 && (
                  <div className="p-8 text-center border-2 border-dashed border-slate-800 rounded-2xl">
                    <p className="text-slate-500 text-xs font-medium">Nenhum serviço para {professionals.find(p => p.id === selectedProfId)?.name || 'este profissional'}.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Availability Slots */}
            <div className="card-surface rounded-xl p-6 border border-slate-700/50">
               <h3 className="text-sm font-bold text-white flex items-center justify-between mb-6 pb-4 border-b border-slate-700/50">
                <span className="flex items-center gap-2"><Clock size={18} className="text-blue-400"/> Disponibilidade Semanal: <span className="text-blue-200">{professionals.find(p => p.id === selectedProfId)?.name || 'Selecione um Profissional'}</span></span>
              </h3>
              
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {selectedProfId && daysOfWeek.map((day) => {
                  const profAvail = availability[selectedProfId] || {};
                  const slots = profAvail[day] || [];
                  
                  return (
                    <div key={day} className="p-4 rounded-xl border border-slate-700/30 bg-[#0b1120]/20 flex flex-col sm:flex-row gap-4 items-start">
                      <div className="w-24 shrink-0 flex items-center justify-between">
                        <span className="text-xs font-bold text-brand-light uppercase tracking-wider">{day}</span>
                        <button onClick={() => handleAddSlot(day)} className="text-blue-400 hover:text-blue-300 p-1">
                          <Plus size={14} />
                        </button>
                      </div>
                      
                      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {slots.map((slot: any, idx: number) => (
                          <div key={idx} className="flex items-center gap-2 bg-surface-base p-1.5 rounded-lg border border-slate-700/50 group/slot">
                            <input 
                              type="time" 
                              value={slot.start} 
                              onChange={(e) => handleSlotChange(day, idx, 'start', e.target.value)}
                              className="bg-transparent text-[11px] text-white focus:outline-none w-full"
                            />
                            <span className="text-slate-500">-</span>
                            <input 
                              type="time" 
                              value={slot.end} 
                              onChange={(e) => handleSlotChange(day, idx, 'end', e.target.value)}
                              className="bg-transparent text-[11px] text-white focus:outline-none w-full"
                            />
                            <button onClick={() => handleRemoveSlot(day, idx)} className="text-slate-500 hover:text-red-400 opacity-0 group-hover/slot:opacity-100 transition-all p-1">
                              <Trash2 size={12} />
                            </button>
                          </div>
                        ))}
                        {slots.length === 0 && (
                          <span className="text-[10px] text-slate-500 italic mt-1">Nenhum horário cadastrado</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Smart Agent Behavior */}
            <div className="card-surface rounded-xl p-6 border border-slate-700/50 flex flex-col">
              <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-6 pb-4 border-b border-slate-700/50">
                <Sparkles size={18} className="text-blue-400"/> Comportamento do Agente de Agendamento
              </h3>
              
              <div className="space-y-6 flex-1">
                <div className="bg-blue-600/5 border border-blue-500/20 rounded-2xl p-6 space-y-4">
                  <div className="flex items-start gap-4">
                     <div className="w-10 h-10 rounded-xl bg-blue-600/20 flex items-center justify-center text-blue-400 shrink-0">
                       <Bot size={20} />
                     </div>
                     <div>
                       <h4 className="text-sm font-bold text-white">Lógica de Roteamento</h4>
                       <p className="text-xs text-brand-muted mt-1 leading-relaxed">
                         O agente identificará automaticamente o serviço desejado e o profissional disponível. Caso o cliente tenha preferência, a IA respeitará a escolha ou sugerirá alternativas baseadas na agenda individual de cada funcionário.
                       </p>
                     </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-slate-700/50">
                     <label className="flex items-center gap-3 cursor-pointer group">
                       <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-slate-700 bg-surface-base text-blue-600 focus:ring-blue-500" />
                       <span className="text-xs text-brand-light font-medium group-hover:text-blue-400 transition-colors">Respeitar agenda do Google Calendar (Conflitos)</span>
                     </label>
                     <label className="flex items-center gap-3 cursor-pointer group">
                       <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-slate-700 bg-surface-base text-blue-600 focus:ring-blue-500" />
                       <span className="text-xs text-brand-light font-medium group-hover:text-blue-400 transition-colors">Confirmar agendamento via link externo se necessário</span>
                     </label>
                     <label className="flex items-center gap-3 cursor-pointer group">
                       <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-slate-700 bg-surface-base text-blue-600 focus:ring-blue-500" />
                       <span className="text-xs text-brand-light font-medium group-hover:text-blue-400 transition-colors">Sugerir horários próximos caso o escolhido esteja ocupado</span>
                     </label>
                  </div>
                </div>

                <div className="space-y-3 mt-4">
                  <span className="text-[10px] font-bold text-brand-muted uppercase tracking-widest block px-2">Fluxo de Lembretes Automáticos</span>
                  <div className="grid grid-cols-2 gap-4">
                    <select className="h-11 rounded-xl border border-slate-700 bg-surface-base px-3 text-xs text-white focus:border-blue-500 focus:outline-none">
                      <option>Lembrete 24h antes</option>
                      <option defaultValue>Lembrete 1h antes</option>
                      <option>Ambos</option>
                    </select>
                    <select className="h-11 rounded-xl border border-slate-700 bg-surface-base px-3 text-xs text-white focus:border-blue-500 focus:outline-none">
                      <option>Via WhatsApp</option>
                      <option>Via E-mail</option>
                      <option defaultValue>Ambos</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <button 
                  onClick={() => saveAgent('scheduler')}
                  className="w-full h-14 bg-blue-600 hover:bg-blue-500 text-white font-bold uppercase tracking-[0.2em] text-xs rounded-2xl transition-all shadow-xl shadow-blue-900/40 flex items-center justify-center gap-3 active:scale-[0.98]"
                >
                  <Save size={18} /> Salvar Agente de Agendamento
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DISPATCHER AGENT */}
      {activeTab === 'dispatcher' && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
          
          {renderCommonSettings('dispatcher', 'Agente Disparador (Campanhas)')}
          
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Personalization Sources */}
            <div className="card-surface rounded-xl p-6 border border-slate-700/50">
               <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-6 pb-4 border-b border-slate-700/50">
                <LayoutGrid size={18} className="text-[#75AB61]"/> Fontes de Personalização no Disparo
              </h3>
              
              <div className="space-y-4">
                <p className="text-xs text-slate-400 mb-4">Ative quais fontes de dados o agente deve consultar antes de redigir a mensagem final (caso a campanha permita personalização IA).</p>
                
                <label className="flex items-center justify-between p-3 rounded-lg border border-slate-700/50 bg-[#0b1120]/30 cursor-pointer hover:bg-[#0b1120]/50 transition-colors">
                  <div>
                    <h4 className="text-sm font-medium text-white mb-0.5">Histórico de Mensagens Reais</h4>
                    <p className="text-[10px] text-slate-500">Menciona interações anteriores se houver.</p>
                  </div>
                  <div className="relative inline-flex items-center shrink-0">
                    <input type="checkbox" className="sr-only peer" checked={dispPersonalization.history} onChange={(e) => setDispPersonalization({...dispPersonalization, history: e.target.checked})} />
                    <div className="w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#75AB61]"></div>
                  </div>
                </label>
                
                <label className="flex items-center justify-between p-3 rounded-lg border border-slate-700/50 bg-[#0b1120]/30 cursor-pointer hover:bg-[#0b1120]/50 transition-colors">
                  <div>
                    <h4 className="text-sm font-medium text-white mb-0.5">Data / Sazonalidade / Eventos</h4>
                    <p className="text-[10px] text-slate-500">Adapta para Sexta-feira, Natal, Feriados etc.</p>
                  </div>
                  <div className="relative inline-flex items-center shrink-0">
                    <input type="checkbox" className="sr-only peer" checked={dispPersonalization.seasonality} onChange={(e) => setDispPersonalization({...dispPersonalization, seasonality: e.target.checked})} />
                    <div className="w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#75AB61]"></div>
                  </div>
                </label>

                <label className="flex items-center justify-between p-3 rounded-lg border border-slate-700/50 bg-[#0b1120]/30 cursor-pointer hover:bg-[#0b1120]/50 transition-colors">
                  <div>
                    <h4 className="text-sm font-medium text-white mb-0.5">Clima Atual (Localização do Lead)</h4>
                    <p className="text-[10px] text-slate-500">Ex: "Quebrando esse frio do Sul com uma oferta..."</p>
                  </div>
                  <div className="relative inline-flex items-center shrink-0">
                    <input type="checkbox" className="sr-only peer" checked={dispPersonalization.weather} onChange={(e) => setDispPersonalization({...dispPersonalization, weather: e.target.checked})} />
                    <div className="w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#75AB61]"></div>
                  </div>
                </label>

                <label className="flex items-center justify-between p-3 rounded-lg border border-slate-700/50 bg-[#0b1120]/30 cursor-pointer hover:bg-[#0b1120]/50 transition-colors">
                  <div>
                    <h4 className="text-sm font-medium text-white mb-0.5">Dados de Última Compra</h4>
                    <p className="text-[10px] text-slate-500">Se integrado ao CRM ou Gateway.</p>
                  </div>
                  <div className="relative inline-flex items-center shrink-0">
                    <input type="checkbox" className="sr-only peer" checked={dispPersonalization.lastPurchase} onChange={(e) => setDispPersonalization({...dispPersonalization, lastPurchase: e.target.checked})} />
                    <div className="w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#75AB61]"></div>
                  </div>
                </label>

              </div>
            </div>

            {/* Limits and Constraints */}
            <div className="card-surface rounded-xl p-6 border border-slate-700/50 flex flex-col">
              <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-6 pb-4 border-b border-slate-700/50">
                <ShieldAlert size={18} className="text-[#75AB61]"/> Limites e Segurança do Disparo
              </h3>
              
              <div className="space-y-6 flex-1">
                
                <div>
                  <h4 className="text-xs font-semibold text-slate-400 mb-2 uppercase flex items-center gap-1.5"><Clock size={12}/> Horários Permitidos para Envio Automático</h4>
                  <div className="space-y-1.5 max-h-36 overflow-y-auto pr-2 custom-scrollbar border border-slate-700/50 rounded-lg p-2 bg-[#0b1120]/30">
                    {daysOfWeek.map((day) => (
                      <div key={day} className="flex items-center justify-between p-1.5 rounded-md hover:bg-slate-800/30">
                        <label className="flex items-center gap-2 cursor-pointer w-24">
                          <input type="checkbox" defaultChecked={day !== 'Domingo' && day !== 'Sábado'} className="rounded border-slate-600 bg-slate-800 text-[#75AB61] focus:ring-[#75AB61]" />
                          <span className="text-[10px] font-medium text-slate-300">{day}</span>
                        </label>
                        <div className="flex items-center gap-1.5">
                          <input type="time" defaultValue="09:00" className="w-[70px] h-6 rounded border border-slate-700 bg-[#0b1120] px-1 text-[10px] text-white" />
                          <span className="text-slate-500 text-[10px]">-</span>
                          <input type="time" defaultValue="18:00" className="w-[70px] h-6 rounded border border-slate-700 bg-[#0b1120] px-1 text-[10px] text-white" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-400 mb-1.5 uppercase">Frequência Máxima de Contato</label>
                    <select className="w-full h-10 rounded-lg border border-slate-700 bg-[#0b1120]/50 px-3 text-xs text-white focus:border-[#75AB61] focus:outline-none">
                      <option>1 disparo por Semana</option>
                      <option defaultValue>2 disparos por Semana</option>
                      <option>3 disparos por Mês</option>
                      <option>Sem limites (Perigoso)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-400 mb-1.5 uppercase">Retentativa se falhar</label>
                    <select className="w-full h-10 rounded-lg border border-slate-700 bg-[#0b1120]/50 px-3 text-xs text-white focus:border-[#75AB61] focus:outline-none">
                      <option>Não tentar novamente</option>
                      <option defaultValue>Em 24 horas (1 vez)</option>
                    </select>
                  </div>
                </div>

                <div>
                   <label className="block text-[10px] font-semibold text-slate-400 mb-1.5 uppercase">Regras de Exclusão (Blacklist Automática)</label>
                   <div className="space-y-2">
                     <label className="flex items-center gap-2 text-xs text-white">
                        <input type="checkbox" defaultChecked className="rounded border-slate-600 bg-slate-800 text-[#75AB61] focus:ring-[#75AB61]" />
                        Não disparar para leads que tenham uma conversa ativa
                     </label>
                     <label className="flex items-center gap-2 text-xs text-white">
                        <input type="checkbox" defaultChecked className="rounded border-slate-600 bg-slate-800 text-[#75AB61] focus:ring-[#75AB61]" />
                        Não disparar para leads que o SDR qualificou como "Frio" nos últimos 30 dias
                     </label>
                      <label className="flex items-center gap-2 text-xs text-white">
                        <input type="checkbox" className="rounded border-slate-600 bg-slate-800 text-[#75AB61] focus:ring-[#75AB61]" />
                        Não disparar para clientes convertidos
                     </label>
                   </div>
                </div>

              </div>
            </div>

           </div>

           <div className="flex justify-end mt-6">
            <button 
              onClick={() => saveAgent('dispatcher')}
              className="brand-gradient px-8 py-3 rounded-xl font-bold text-[#0b1120] hover:opacity-90 transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(117,171,97,0.3)]"
            >
              <Save size={18} /> Salvar Configurações Disparador
            </button>
          </div>

        </div>
      )}

    </div>
  );
}

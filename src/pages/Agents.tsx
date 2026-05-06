import React, { useState, useEffect } from 'react';
import { 
  Bot, Settings, Upload, Globe, MessageSquare, ListTodo, 
  Thermometer, Calendar, Target, BookOpen, ShoppingCart, 
  CreditCard, SlidersHorizontal, UserCircle, LayoutGrid, Clock, 
  ShieldAlert, Sparkles, Plus, Trash2, GripVertical, Save
} from 'lucide-react';
import { cn } from '../lib/utils';
import { supabase } from '../lib/supabase';
import { useOrganization } from '../contexts/OrganizationContext';

export function Agents() {
  const { organization } = useOrganization();
  const [activeTab, setActiveTab] = useState<'sdr' | 'knowledge' | 'dispatcher'>('sdr');
  const [loading, setLoading] = useState(true);

  // Common States
  const [agentActives, setAgentActives] = useState({ sdr: true, knowledge: true, dispatcher: true });
  const [agentNames, setAgentNames] = useState({ 
    sdr: 'Julia (Equipe de Atendimento)', 
    knowledge: 'Hermes Assistente', 
    dispatcher: 'Equipe de Novidades' 
  });
  const [agentMsgs, setAgentMsgs] = useState({
    sdr: 'Olá! Meu nome é {{agent_name}}, represento a equipe de atendimento. Para melhor ajudá-lo(a), gostaria de fazer algumas perguntas rápidas.',
    knowledge: 'Olá! Como posso ajudar você a entender melhor nossos produtos ou resolver sua dúvida hoje?',
    dispatcher: 'Esta é apenas uma IA disparadora, sua primeira mensagem será sempre a definida na campanha.'
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
      const { data, error } = await supabase
        .from('agents')
        .select('*')
        .eq('organization_id', organization.id);

      if (error) throw error;
      
      if (data && data.length > 0) {
        const actives = { ...agentActives };
        const names = { ...agentNames };
        const msgs = { ...agentMsgs };
        
        data.forEach((agent: any) => {
          const type = agent.type as 'sdr' | 'knowledge' | 'dispatcher';
          if (type && actives[type] !== undefined) {
            actives[type] = agent.active ?? actives[type];
            names[type] = agent.name || names[type];
            msgs[type] = agent.greeting_message || msgs[type];
            
            // Note: we could also restore config JSON here
          }
        });
        
        setAgentActives(actives);
        setAgentNames(names);
        setAgentMsgs(msgs);
      }
    } catch (err) {
      console.error('Error fetching agents:', err);
    } finally {
      setLoading(false);
    }
  };

  const saveAgent = async (type: 'sdr' | 'knowledge' | 'dispatcher') => {
    if (!organization?.id) return;

    try {
      // Very basic save/upsert logic, assuming type is unique per org
      // You should use matching or proper upsert via RPC or unique constraints
      const agentData = {
        organization_id: organization.id,
        type,
        name: agentNames[type],
        active: agentActives[type],
        greeting_message: agentMsgs[type],
        // config: // stringify relevant config
      };

      const { data: existing } = await supabase
        .from('agents')
        .select('id')
        .eq('organization_id', organization.id)
        .eq('type', type)
        .maybeSingle();

      if (existing?.id) {
        await supabase.from('agents').update(agentData).eq('id', existing.id);
      } else {
        await supabase.from('agents').insert([agentData]);
      }
      
      alert('Configurações salvas com sucesso!');
    } catch (error) {
      console.error('Error saving agent:', error);
      alert('Erro ao salvar configurações.');
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
  
  const daysOfWeek = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];

  const handleQuestionAdd = () => setSdrQuestions([...sdrQuestions, '']);
  const handleQuestionChange = (index: number, val: string) => {
    const newQ = [...sdrQuestions];
    newQ[index] = val;
    setSdrQuestions(newQ);
  };
  const handleQuestionRemove = (index: number) => {
    setSdrQuestions(sdrQuestions.filter((_, i) => i !== index));
  };

  const renderCommonSettings = (type: 'sdr' | 'knowledge' | 'dispatcher', title: string) => (
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
              <button className="flex-1 px-2 py-2 text-[10px] sm:text-xs font-medium rounded-md transition-colors text-slate-400 hover:text-white">Formal</button>
              <button className="flex-1 px-2 py-2 text-[10px] sm:text-xs font-medium rounded-md transition-colors bg-slate-700 text-white shadow-sm">Neutro</button>
              <button className="flex-1 px-2 py-2 text-[10px] sm:text-xs font-medium rounded-md transition-colors text-slate-400 hover:text-white">Casual</button>
              <button className="flex-1 px-2 py-2 text-[10px] sm:text-xs font-medium rounded-md transition-colors text-slate-400 hover:text-white">Descontraído</button>
            </div>
          </div>

          <div>
             <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase"><MessageSquare size={12} className="inline mr-1"/> Mensagem de Apresentação Opcional</label>
             <textarea 
              className="w-full h-20 rounded-lg border border-slate-700 bg-[#0b1120]/50 p-3 text-sm text-white focus:border-[#75AB61] focus:outline-none focus:ring-1 focus:ring-[#75AB61] resize-none"
              value={agentMsgs[type]}
              onChange={(e) => setAgentMsgs({ ...agentMsgs, [type]: e.target.value })}
             ></textarea>
             <p className="text-[10px] text-slate-500 mt-1">Deixe em branco para que a IA crie a abordagem a cada interação.</p>
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

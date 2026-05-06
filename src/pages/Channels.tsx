import React, { useState } from 'react';
import { 
  MessageCircle, Instagram, Globe, CheckCircle2, AlertTriangle, 
  Link as LinkIcon, Save, Play, RefreshCw, Copy, Bot, Clock,
  Palette, MessageSquare, ShieldAlert
} from 'lucide-react';
import { cn } from '../lib/utils';

export function Channels() {
  const [activeTab, setActiveTab] = useState<'whatsapp' | 'instagram' | 'web'>('whatsapp');
  
  // WhatsApp States
  const [waConnected, setWaConnected] = useState(true);
  const [waActive, setWaActive] = useState(true);
  
  // Instagram States
  const [igConnected, setIgConnected] = useState(false);
  const [igActive, setIgActive] = useState(false);
  const [igAutoReply, setIgAutoReply] = useState(true);

  // Web States
  const [webActive, setWebActive] = useState(true);
  const [widgetColor, setWidgetColor] = useState('#75AB61');
  const [widgetPosition, setWidgetPosition] = useState('right');

  const daysOfWeek = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          Canais & Webhooks <LinkIcon className="text-[#75AB61]" size={24} />
        </h1>
        <p className="text-slate-400 text-sm mt-1">Conecte e configure os canais de comunicação dos agentes.</p>
      </div>

      {/* TABS */}
      <div className="card-surface p-2 rounded-xl flex gap-2 overflow-x-auto">
        <button 
          onClick={() => setActiveTab('whatsapp')}
          className={cn("flex-1 py-3 px-4 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all min-w-[150px]", activeTab === 'whatsapp' ? "bg-emerald-500/20 text-emerald-400 shadow-sm border border-emerald-500/30" : "text-slate-400 hover:text-white hover:bg-slate-800/50")}
        >
          <MessageCircle size={18} /> WhatsApp
        </button>
        <button 
          onClick={() => setActiveTab('instagram')}
          className={cn("flex-1 py-3 px-4 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all min-w-[150px]", activeTab === 'instagram' ? "bg-purple-500/20 text-purple-400 shadow-sm border border-purple-500/30" : "text-slate-400 hover:text-white hover:bg-slate-800/50")}
        >
          <Instagram size={18} /> Instagram
        </button>
        <button 
          onClick={() => setActiveTab('web')}
          className={cn("flex-1 py-3 px-4 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all min-w-[150px]", activeTab === 'web' ? "bg-blue-500/20 text-blue-400 shadow-sm border border-blue-500/30" : "text-slate-400 hover:text-white hover:bg-slate-800/50")}
        >
          <Globe size={18} /> Web & Widget
        </button>
      </div>

      {/* WHATSAPP CONTENT */}
      {activeTab === 'whatsapp' && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
          
          <div className="card-surface rounded-xl p-6 border border-slate-700/50">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-700/50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#25D366]/20 flex items-center justify-center border border-[#25D366]/30">
                  <MessageCircle className="text-[#25D366]" size={28} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Instância WhatsApp Oficial</h2>
                  <div className="flex items-center gap-2 mt-1">
                    {waConnected ? (
                      <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                        <CheckCircle2 size={12} /> Conectado
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase bg-red-500/10 text-red-400 border border-red-500/20 flex items-center gap-1">
                        <AlertTriangle size={12} /> Desconectado
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <label className="flex items-center gap-3 cursor-pointer bg-[#0b1120]/50 p-2.5 rounded-lg border border-slate-700/50">
                <span className="text-sm font-semibold text-slate-300">Agente Ativo</span>
                <div className="relative inline-flex items-center">
                  <input type="checkbox" className="sr-only peer" checked={waActive} onChange={(e) => setWaActive(e.target.checked)} />
                  <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#25D366]"></div>
                </div>
              </label>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* API Config */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <LinkIcon size={16} className="text-[#75AB61]"/> Configuração da API
                </h3>
                
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase">Endpoint URL (Evolution, Z-API, etc)</label>
                  <input type="url" defaultValue="https://api.whatsapp.empresa.com/v1" className="w-full h-11 rounded-lg border border-slate-700 bg-[#0b1120]/50 px-4 text-sm text-white focus:border-[#75AB61] focus:outline-none" />
                </div>
                
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase">API Key / Token</label>
                  <input type="password" defaultValue="••••••••••••••••••••••••" className="w-full h-11 rounded-lg border border-slate-700 bg-[#0b1120]/50 px-4 text-sm text-white focus:border-[#75AB61] focus:outline-none" />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase">Número da Instância</label>
                  <input type="text" defaultValue="+55 (11) 99999-9999" className="w-full h-11 rounded-lg border border-slate-700 bg-[#0b1120]/50 px-4 text-sm text-white focus:border-[#75AB61] focus:outline-none" />
                </div>

                <div className="pt-2">
                  <button className="px-5 py-2.5 bg-slate-800 text-white text-sm font-semibold rounded-lg border border-slate-700 hover:bg-slate-700 transition-colors flex items-center gap-2">
                    <Play size={16}/> Testar Conexão
                  </button>
                </div>
              </div>

              {/* Agent Settings & Hours */}
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Bot size={16} className="text-[#75AB61]"/> Preferências do Canal
                  </h3>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase">Agente Padrão (Fallback)</label>
                    <select className="w-full h-11 rounded-lg border border-slate-700 bg-[#0b1120]/50 px-3 text-sm text-white focus:border-[#75AB61] focus:outline-none">
                      <option>SDR Inbound (Vendas)</option>
                      <option>Agente de Conhecimento</option>
                      <option>Suporte e Atendimento</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4 pt-6 border-t border-slate-700/50">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-700/50 pb-2">
                    <Clock size={16} className="text-[#75AB61]"/> Horário de Funcionamento do IA
                  </h3>
                  
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                    {daysOfWeek.map((day) => (
                      <div key={day} className="flex items-center justify-between p-2 rounded-lg bg-slate-800/30 border border-slate-700/50">
                        <label className="flex items-center gap-2 cursor-pointer w-24">
                          <input type="checkbox" defaultChecked className="rounded border-slate-600 bg-slate-800 text-[#75AB61] focus:ring-[#75AB61]" />
                          <span className="text-xs font-medium text-slate-300">{day}</span>
                        </label>
                        <div className="flex items-center gap-2 flex-1 max-w-[200px]">
                          <input type="time" defaultValue="08:00" className="w-full h-8 rounded border border-slate-700 bg-[#0b1120] px-2 text-xs text-white" />
                          <span className="text-slate-500 text-xs">às</span>
                          <input type="time" defaultValue="18:00" className="w-full h-8 rounded border border-slate-700 bg-[#0b1120] px-2 text-xs text-white" />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase mt-4">Mensagem de Ausência (Fora do Horário)</label>
                    <textarea 
                      className="w-full h-20 rounded-lg border border-slate-700 bg-[#0b1120]/50 p-3 text-sm text-white focus:border-[#75AB61] focus:outline-none resize-none"
                      defaultValue="Nosso horário de atendimento por IA encerrou. Retornaremos amanhã a partir das 08:00."
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-700/50 flex justify-end">
              <button className="brand-gradient px-8 py-3 rounded-xl font-bold text-[#0b1120] hover:opacity-90 transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(117,171,97,0.3)]">
                <Save size={18} /> Salvar Configurações WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}

      {/* INSTAGRAM CONTENT */}
      {activeTab === 'instagram' && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="card-surface rounded-xl p-6 border border-slate-700/50">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-700/50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#f09433] via-[#e6683c] to-[#bc1888] flex items-center justify-center shadow-lg">
                  <Instagram className="text-white" size={28} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Instagram Direct API</h2>
                  <div className="flex items-center gap-2 mt-1">
                    {igConnected ? (
                      <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                        <CheckCircle2 size={12} /> Conectado via Meta
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-800 text-slate-400 border border-slate-700 flex items-center gap-1">
                        <AlertTriangle size={12} /> Não conectado
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {igConnected && (
                <label className="flex items-center gap-3 cursor-pointer bg-[#0b1120]/50 p-2.5 rounded-lg border border-slate-700/50">
                  <span className="text-sm font-semibold text-slate-300">Agente Ativo</span>
                  <div className="relative inline-flex items-center">
                    <input type="checkbox" className="sr-only peer" checked={igActive} onChange={(e) => setIgActive(e.target.checked)} />
                    <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#E1306C]"></div>
                  </div>
                </label>
              )}
            </div>

            {!igConnected ? (
              <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center border-4 border-[#0b1120] shadow-xl mb-4">
                  <Instagram size={36} className="text-slate-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Conecte sua conta do Instagram</h3>
                <p className="text-slate-400 max-w-md mx-auto mb-8 text-sm">
                  Permita que a plataforma Hermes Nexus acesse suas mensagens do Direct e menções para que os agentes de IA possam interagir com seus seguidores automaticamente.
                </p>
                <button 
                  onClick={() => { setIgConnected(true); setIgActive(true); }}
                  className="bg-gradient-to-r from-[#f09433] via-[#e6683c] to-[#bc1888] px-8 py-3.5 rounded-xl font-bold text-white hover:opacity-90 transition-all flex items-center gap-2 shadow-lg"
                >
                  <LinkIcon size={18} /> Continuar com Facebook / Meta
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in duration-500">
                
                <div className="space-y-6">
                  {/* Account Profile */}
                  <div className="bg-[#0b1120]/50 rounded-xl p-5 border border-slate-700/50 flex items-center gap-4">
                    <img src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=150&q=80" alt="Profile" className="w-16 h-16 rounded-full border-2 border-purple-500/50 object-cover" />
                    <div>
                      <h4 className="text-white font-bold">Synapiens Oficial</h4>
                      <p className="text-sm text-slate-400">@synapiens.tech</p>
                      <button className="text-xs text-red-400 hover:text-red-300 mt-1 font-medium transition-colors">Desconectar conta</button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Bot size={16} className="text-purple-400"/> Preferências do Agente
                    </h3>
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase">Agente Padrão</label>
                      <select className="w-full h-11 rounded-lg border border-slate-700 bg-[#0b1120]/50 px-3 text-sm text-white focus:border-[#75AB61] focus:outline-none">
                        <option>SDR Inbound (Vendas)</option>
                        <option>Suporte e Atendimento</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-slate-700/50">
                     <label className="flex items-center justify-between p-4 rounded-xl border border-slate-700 bg-slate-800/30 cursor-pointer hover:bg-slate-800/50 transition-colors">
                      <div>
                        <h4 className="text-sm font-semibold text-white">Responder Comentários Automaticamente</h4>
                        <p className="text-xs text-slate-400 mt-1">Converte comentadores em leads chamando pro Direct via IA.</p>
                      </div>
                      <div className="relative inline-flex items-center">
                        <input type="checkbox" className="sr-only peer" checked={igAutoReply} onChange={(e) => setIgAutoReply(e.target.checked)} />
                        <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
                      </div>
                    </label>
                    
                    {igAutoReply && (
                      <div className="animate-in fade-in slide-in-from-top-2">
                        <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase">Template de Resposta em Comentários</label>
                        <textarea 
                          className="w-full h-20 rounded-lg border border-slate-700 bg-[#0b1120]/50 p-3 text-sm text-white focus:border-[#75AB61] focus:outline-none resize-none"
                          defaultValue="Te chamei no direct para conversarmos melhor! 😉"
                        ></textarea>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-slate-800/30 rounded-xl p-5 border border-slate-700 flex flex-col items-center justify-center text-center">
                  <img src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&q=80" alt="Instagram preview" className="w-[200px] h-[200px] object-cover rounded-3xl border-4 border-slate-800 shadow-2xl opacity-80" />
                  <p className="mt-6 text-sm text-slate-400 font-medium">Os Agentes responderão diretamente os Stories e Directs no Instagram do cliente.</p>
                </div>
              </div>
            )}
            
            {igConnected && (
              <div className="mt-8 pt-6 border-t border-slate-700/50 flex justify-end">
                <button className="bg-slate-100 px-8 py-3 rounded-xl font-bold text-[#0b1120] hover:bg-white transition-all flex items-center gap-2 shadow-lg">
                  <Save size={18} /> Salvar Configurações Instagram
                </button>
              </div>
            )}

          </div>
        </div>
      )}

      {/* WEBHOOK / WIDGET CONTENT */}
      {activeTab === 'web' && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="card-surface rounded-xl p-6 border border-slate-700/50">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-700/50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#0b1120] flex items-center justify-center border border-slate-700">
                  <Globe className="text-blue-400" size={28} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Chat Widget & Webhook</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      Disponível
                    </span>
                  </div>
                </div>
              </div>

              <label className="flex items-center gap-3 cursor-pointer bg-[#0b1120]/50 p-2.5 rounded-lg border border-slate-700/50">
                <span className="text-sm font-semibold text-slate-300">Agente Ativo</span>
                <div className="relative inline-flex items-center">
                  <input type="checkbox" className="sr-only peer" checked={webActive} onChange={(e) => setWebActive(e.target.checked)} />
                  <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                </div>
              </label>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              
              <div className="space-y-8">
                
                {/* Integration Credentials */}
                <div className="space-y-6">
                   <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <ShieldAlert size={16} className="text-blue-400"/> Credenciais de Webhook
                  </h3>
                  
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase">Webhook URL (Receber Env.</label>
                    <div className="flex gap-2">
                       <input 
                        type="url" 
                        readOnly 
                        value="https://api.hermesnexus.com/wh/v1/app_98h3f2g" 
                        className="flex-1 h-11 rounded-lg border border-slate-700 bg-[#0b1120] px-4 text-sm text-slate-400 opacity-80 cursor-not-allowed" 
                      />
                      <button className="px-4 bg-slate-800 text-white rounded-lg border border-slate-700 hover:bg-slate-700 transition-colors">
                        <Copy size={16} />
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase">Auth Token de Verificação</label>
                    <div className="flex gap-2">
                       <input 
                        type="password" 
                        readOnly 
                        value="hn_tok_92837493874jdskfksdf" 
                        className="flex-1 h-11 rounded-lg border border-slate-700 bg-[#0b1120] px-4 text-sm text-slate-400 opacity-80 cursor-not-allowed font-mono" 
                      />
                      <button className="px-4 bg-red-500/10 text-red-400 rounded-lg border border-red-500/20 hover:bg-red-500/20 transition-colors" title="Regenerar Token (Cuidado)">
                        <RefreshCw size={16} />
                      </button>
                    </div>
                    <p className="text-[10px] text-red-400 mt-1.5">Regerar o token quebrará conexões existentes.</p>
                  </div>
                </div>

                {/* Appearance Settings */}
                <div className="space-y-6 pt-6 border-t border-slate-700/50">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Palette size={16} className="text-blue-400"/> Aparência do Widget
                  </h3>

                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase">Nome do Agente</label>
                        <input type="text" defaultValue="Hermes Bot" className="w-full h-11 rounded-lg border border-slate-700 bg-[#0b1120]/50 px-4 text-sm text-white focus:border-[#75AB61] focus:outline-none" />
                      </div>
                      <div>
                        {/* Custom Color picker mock */}
                        <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase">Cor Destaque</label>
                        <div className="flex items-center gap-3">
                          <input 
                            type="color" 
                            value={widgetColor}
                            onChange={(e) => setWidgetColor(e.target.value)}
                            className="w-11 h-11 rounded-lg cursor-pointer bg-[#0b1120]/50 border border-slate-700" 
                          />
                          <span className="text-sm font-mono text-slate-300 bg-slate-800 px-3 py-1.5 rounded-md border border-slate-700">{widgetColor}</span>
                        </div>
                      </div>
                  </div>

                  <div>
                     <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase">Mensagem de Boas-vindas</label>
                     <textarea 
                      className="w-full h-16 rounded-lg border border-slate-700 bg-[#0b1120]/50 p-3 text-sm text-white focus:border-[#75AB61] focus:outline-none resize-none"
                      defaultValue="Olá! Eu sou o assistente virtual da Synapiens. Como posso ajudar você hoje?"
                     ></textarea>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase">Posição na Tela</label>
                    <div className="flex bg-slate-800 p-1 border border-slate-700 rounded-lg w-fit">
                      <button 
                        onClick={() => setWidgetPosition('left')}
                        className={cn("px-4 py-1.5 text-xs font-medium rounded-md transition-colors", widgetPosition === 'left' ? "bg-slate-600 text-white" : "text-slate-400 hover:text-white")}
                      >
                        Inferior Esquerda
                      </button>
                      <button 
                         onClick={() => setWidgetPosition('right')}
                        className={cn("px-4 py-1.5 text-xs font-medium rounded-md transition-colors", widgetPosition === 'right' ? "bg-slate-600 text-white" : "text-slate-400 hover:text-white")}
                      >
                        Inferior Direita
                      </button>
                    </div>
                  </div>

                </div>

              </div>

              {/* Install guide & Preview */}
              <div className="space-y-6">
                
                <div className="bg-slate-800/40 rounded-xl p-5 border border-slate-700 relative overflow-hidden h-[300px] flex flex-col shadow-inner">
                   <h4 className="text-xs font-bold text-slate-500 mb-4 uppercase text-center">Preview do Widget no seu site</h4>
                   
                   {/* Mock Site BG */}
                   <div className="absolute inset-0 top-12 bg-[#e2e8f0] opacity-5 -z-10"></div> 

                   <div className={cn(
                     "mt-auto flex flex-col",
                     widgetPosition === 'right' ? "items-end" : "items-start"
                   )}>
                     
                     {/* Chat Window Panel Preview */}
                     <div className="w-64 bg-[#1A1A2E] rounded-xl overflow-hidden border border-slate-700 shadow-xl mb-4 opacity-90 transition-all">
                       <div className="p-3 bg-[#111A22] border-b border-slate-700/50 flex items-center gap-3">
                         <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center shrink-0">
                           <Bot size={16} />
                         </div>
                         <div>
                           <p className="text-white text-xs font-bold">Hermes Bot</p>
                           <p className="text-[10px] text-[#75AB61] flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#75AB61]"></span> Online</p>
                         </div>
                       </div>
                       <div className="p-4 bg-[#0b1120] h-32 flex flex-col justify-end">
                         <div className="bg-slate-800 text-slate-200 text-xs p-2.5 rounded-lg rounded-tl-sm self-start max-w-[85%] border border-slate-700/50 shadow-sm leading-relaxed">
                           Olá! Eu sou o assistente virtual da Synapiens. Como posso ajudar você hoje?
                         </div>
                       </div>
                       <div className="p-2.5 bg-[#111A22] border-t border-slate-700/50 flex gap-2">
                         <div className="flex-1 bg-[#0b1120] border border-slate-700 rounded-full h-8 flex items-center px-3 opacity-50">
                           <span className="text-[10px] text-slate-500">Escreva...</span>
                         </div>
                       </div>
                     </div>

                     {/* Floating Button Preview */}
                     <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-colors cursor-pointer mr-2 ml-2 relative"
                      style={{ backgroundColor: widgetColor }}
                     >
                       <MessageSquare size={20} className="text-[#0b1120] fill-current" />
                     </div>
                   </div>

                </div>

                <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-5">
                   <h3 className="text-sm font-bold text-white mb-2">Instalação</h3>
                   <p className="text-xs text-slate-300 mb-3">Copie e cole o snippet abaixo antes do fechamento da tag <code className="text-indigo-400 bg-indigo-900/30 px-1 rounded">&lt;/body&gt;</code> no HTML do seu site.</p>
                   <div className="relative group">
                     <textarea 
                        readOnly 
                        className="w-full h-20 rounded-lg border border-slate-700/50 bg-[#0b1120]/80 p-3 text-[10px] text-slate-400 font-mono resize-none focus:outline-none"
                        value={`<script>
  window.HermesConfig = { 
    id: "app_98h3f2g", position: "${widgetPosition}", color: "${widgetColor}" 
  };
</script>
<script src="https://cdn.hermesnexus.com/widget.js" async></script>`}
                     />
                     <button className="absolute top-2 right-2 p-1.5 bg-slate-800 hover:bg-slate-700 rounded text-slate-400 hover:text-white transition-colors opacity-0 group-hover:opacity-100">
                        <Copy size={14} />
                     </button>
                   </div>
                </div>

              </div>

            </div>

             <div className="mt-8 pt-6 border-t border-slate-700/50 flex justify-end">
                <button className="bg-blue-500 px-8 py-3 rounded-xl font-bold text-white hover:bg-blue-400 transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                  <Save size={18} /> Publicar Widget
                </button>
              </div>

          </div>
        </div>
      )}

    </div>
  );
}

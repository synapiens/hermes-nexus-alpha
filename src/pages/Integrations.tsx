import React, { useState } from 'react';
import { 
  CreditCard, Database, Link as LinkIcon, CheckCircle2, 
  Settings, AlertTriangle, Plus, RefreshCw, X, Save, 
  ShieldCheck, ArrowRightLeft, Unplug
} from 'lucide-react';
import { cn } from '../lib/utils';

interface Integration {
  id: string;
  name: string;
  description: string;
  status: 'connected' | 'disconnected' | 'error';
  type: 'gateway' | 'crm';
  logo?: string;
  color?: string;
}

export function Integrations() {
  const [activeModal, setActiveModal] = useState<Integration | null>(null);
  const [activeTab, setActiveTab] = useState<'gateways' | 'crms' | 'apis'>('gateways');

  const gateways: Integration[] = [
    { id: '1', name: 'Stripe', description: 'Processamento global de pagamentos.', status: 'connected', type: 'gateway', color: 'bg-[#635BFF]' },
    { id: '2', name: 'Mercado Pago', description: 'Pagamentos na América Latina.', status: 'disconnected', type: 'gateway', color: 'bg-[#009EE3]' },
    { id: '3', name: 'PagSeguro', description: 'Solução completa para o Brasil.', status: 'disconnected', type: 'gateway', color: 'bg-[#1ABC9C]' },
    { id: '4', name: 'Asaas', description: 'Gestão de assinaturas e boletos.', status: 'error', type: 'gateway', color: 'bg-[#0A2540]' },
    { id: '5', name: 'Hermes Pay', description: 'Gateway nativo da plataforma.', status: 'disconnected', type: 'gateway', color: 'bg-[#75AB61]' },
  ];

  const crms: Integration[] = [
    { id: 'c1', name: 'RD Station', description: 'Automação de marketing e vendas.', status: 'connected', type: 'crm', color: 'bg-[#364A65]' },
    { id: 'c2', name: 'HubSpot', description: 'Inbound marketing e CRM completo.', status: 'disconnected', type: 'crm', color: 'bg-[#FF7A59]' },
    { id: 'c3', name: 'Salesforce', description: 'Plataforma líder global de CRM.', status: 'disconnected', type: 'crm', color: 'bg-[#00A1E0]' },
    { id: 'c4', name: 'Pipedrive', description: 'CRM focado em vendas e pipeline.', status: 'disconnected', type: 'crm', color: 'bg-[#262626]' },
    { id: 'c5', name: 'Google Sheets', description: 'Sincronização de leads em planilhas.', status: 'connected', type: 'crm', color: 'bg-[#0F9D58]' },
  ];

  const apis = [
    { id: 'a1', name: 'Catálogo de Produtos (ERP)', status: 'connected', lastSync: '10 min atrás', frequency: 'A cada 30 min' },
    { id: 'a2', name: 'Cálculo de Frete (Correios)', status: 'connected', lastSync: '1 hora atrás', frequency: 'Tempo Real' },
    { id: 'a3', name: 'Estoque Múltiplo (Filiais)', status: 'error', lastSync: 'Falhou ontem às 23:00', frequency: 'Diário' },
  ];

  const renderCard = (item: Integration) => (
    <div key={item.id} className="card-surface rounded-xl p-6 border border-slate-700/50 hover:border-slate-600 transition-all flex flex-col group">
      <div className="flex items-start justify-between mb-4">
        <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg", item.color)}>
          {item.name.charAt(0)}
        </div>
        
        {item.status === 'connected' ? (
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
            <CheckCircle2 size={12} /> Conectado
          </span>
        ) : item.status === 'error' ? (
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-semibold">
            <AlertTriangle size={12} /> Erro
          </span>
        ) : (
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800 text-slate-400 border border-slate-700 text-xs font-semibold">
            <Unplug size={12} /> Desconectado
          </span>
        )}
      </div>
      
      <div className="flex-1">
        <h3 className="text-white font-bold mb-1">{item.name}</h3>
        <p className="text-slate-400 text-sm leading-relaxed">{item.description}</p>
      </div>
      
      <button 
        onClick={() => setActiveModal(item)}
        className="mt-6 w-full py-2.5 rounded-lg border border-slate-700 bg-slate-800 text-sm font-semibold text-white hover:bg-slate-700 hover:border-slate-600 transition-colors flex items-center justify-center gap-2"
      >
        <Settings size={16} /> 
        {item.status === 'connected' ? 'Configurar / Mapear' : 'Conectar Agora'}
      </button>
    </div>
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          Integrações e Gateways <LinkIcon className="text-[#75AB61]" size={24} />
        </h1>
        <p className="text-slate-400 text-sm mt-1">Gerencie conexões com CRMs, processadores de pagamento e APIs externas.</p>
      </div>

      {/* TABS */}
      <div className="flex flex-wrap gap-2 pt-2 border-b border-slate-800">
        <button 
          onClick={() => setActiveTab('gateways')}
          className={cn("px-5 py-3 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2", activeTab === 'gateways' ? "border-[#75AB61] text-[#75AB61]" : "border-transparent text-slate-400 hover:text-white")}
        >
          <CreditCard size={18} /> Gateways de Pagamento
        </button>
        <button 
          onClick={() => setActiveTab('crms')}
          className={cn("px-5 py-3 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2", activeTab === 'crms' ? "border-[#75AB61] text-[#75AB61]" : "border-transparent text-slate-400 hover:text-white")}
        >
          <Database size={18} /> CRM e Ferramentas
        </button>
        <button 
          onClick={() => setActiveTab('apis')}
          className={cn("px-5 py-3 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2", activeTab === 'apis' ? "border-[#75AB61] text-[#75AB61]" : "border-transparent text-slate-400 hover:text-white")}
        >
          <LinkIcon size={18} /> APIs de Dados Externos
        </button>
      </div>

      {/* GATEWAYS */}
      {activeTab === 'gateways' && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {gateways.map(renderCard)}
          </div>
        </div>
      )}

      {/* CRMS */}
      {activeTab === 'crms' && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {crms.map(renderCard)}
          </div>
        </div>
      )}

      {/* EXTERNAL APIS */}
      {activeTab === 'apis' && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
          
          <div className="flex justify-between items-center mb-6">
             <h3 className="text-white font-medium">Conexões de Base de Conhecimento</h3>
             <button className="bg-[#75AB61]/10 text-[#75AB61] border border-[#75AB61]/30 hover:bg-[#75AB61]/20 px-4 py-2 rounded-lg text-sm font-bold transition-colors flex items-center gap-2">
               <Plus size={16} /> Adicionar API
             </button>
          </div>

          <div className="card-surface border border-slate-700/50 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-700/50 bg-[#0b1120]/50">
                    <th className="p-4 text-xs font-semibold text-slate-400 uppercase">Nome da API</th>
                    <th className="p-4 text-xs font-semibold text-slate-400 uppercase">Status</th>
                    <th className="p-4 text-xs font-semibold text-slate-400 uppercase">Última Sincronização</th>
                    <th className="p-4 text-xs font-semibold text-slate-400 uppercase">Frequência</th>
                    <th className="p-4 text-xs font-semibold text-slate-400 uppercase text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {apis.map((api) => (
                    <tr key={api.id} className="hover:bg-slate-800/20 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-600 flex items-center justify-center text-slate-400">
                            <Database size={14} />
                          </div>
                          <span className="text-sm font-bold text-white">{api.name}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        {api.status === 'connected' ? (
                          <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] uppercase font-bold tracking-wider">
                            <CheckCircle2 size={10} /> Online
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] uppercase font-bold tracking-wider">
                            <AlertTriangle size={10} /> Falha
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-sm text-slate-300">
                        {api.lastSync}
                      </td>
                      <td className="p-4 text-sm text-slate-400">
                        {api.frequency}
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors" title="Sincronizar Manualmente">
                          <RefreshCw size={16} />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors border border-transparent hover:border-slate-500" title="Configurar">
                          <Settings size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* CONFIGURATION MODAL */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#111A22] border border-slate-700 rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[90vh]">
            
            <div className="flex items-center justify-between p-5 border-b border-slate-700/50">
              <div className="flex items-center gap-3">
                <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold opacity-90", activeModal.color)}>
                  {activeModal.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg leading-tight">Configurar {activeModal.name}</h3>
                  <p className="text-xs text-slate-400">{activeModal.type === 'gateway' ? 'Gateway de Pagamento' : 'CRM & Ferramentas'}</p>
                </div>
              </div>
              <button 
                onClick={() => setActiveModal(null)}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
              
              {activeModal.type === 'gateway' && (
                <div className="space-y-6">
                  
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 flex items-start gap-3">
                    <ShieldCheck className="text-blue-400 shrink-0 mt-0.5" size={18} />
                    <div>
                      <h4 className="text-sm font-bold text-blue-400 mb-1">Ambiente Seguro</h4>
                      <p className="text-xs text-blue-300/70">Suas chaves são criptografadas em repouso. Nunca as compartilhe publicamente.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2 sm:col-span-1">
                      <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase">Ambiente</label>
                      <select className="w-full h-11 rounded-lg border border-slate-700 bg-[#0b1120] px-3 text-sm text-white focus:border-[#75AB61] focus:outline-none">
                        <option value="sandbox">Sandbox (Testes)</option>
                        <option value="production">Produção (Real)</option>
                      </select>
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase">Moeda Padrão</label>
                      <select className="w-full h-11 rounded-lg border border-slate-700 bg-[#0b1120] px-3 text-sm text-white focus:border-[#75AB61] focus:outline-none">
                        <option value="BRL">BRL - Real Brasileiro</option>
                        <option value="USD">USD - Dólar Americano</option>
                        <option value="EUR">EUR - Euro</option>
                      </select>
                    </div>
                  </div>

                  <div>
                     <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase">API Key Pública</label>
                     <input type="text" className="w-full h-11 rounded-lg border border-slate-700 bg-[#0b1120] px-4 text-sm text-white focus:border-[#75AB61] focus:outline-none placeholder-slate-600 font-mono" placeholder="pk_test_..." />
                  </div>

                  <div>
                     <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase">API Key Privada (Secret)</label>
                     <input type="password" className="w-full h-11 rounded-lg border border-slate-700 bg-[#0b1120] px-4 text-sm text-white focus:border-[#75AB61] focus:outline-none placeholder-slate-600 font-mono" placeholder="sk_test_..." />
                  </div>

                  <button className="text-sm font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
                    <RefreshCw size={14} /> Testar Conexão
                  </button>

                </div>
              )}

              {activeModal.type === 'crm' && (
                <div className="space-y-6">
                  
                  {activeModal.status === 'disconnected' ? (
                     <div className="space-y-6">
                        <div className="text-center py-6">
                          <Database className="mx-auto text-slate-500 mb-4" size={48} />
                          <h4 className="text-white font-bold mb-2">Conecte sua conta do {activeModal.name}</h4>
                          <p className="text-slate-400 text-sm max-w-sm mx-auto">Para sincronizar os leads e interações da plataforma diretamente com seu CRM.</p>
                        </div>
                        
                        <div className="flex justify-center">
                           <button className={cn("px-6 py-3 rounded-lg text-white font-bold text-sm shadow-lg hover:opacity-90 transition-opacity flex items-center gap-2", activeModal.color)}>
                             Conectar com {activeModal.name} via OAuth
                           </button>
                        </div>
                     </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                         <div>
                           <h4 className="text-white font-bold text-sm">Conta Conectada</h4>
                           <p className="text-emerald-400 text-xs">Sincronização OK</p>
                         </div>
                         <button className="text-xs text-red-400 hover:bg-red-500/10 px-3 py-1.5 rounded border border-red-500/20 font-semibold transition-colors">
                           Desconectar
                         </button>
                      </div>

                      <div>
                         <h4 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
                           <ArrowRightLeft size={16} className="text-[#75AB61]" /> Mapeamento de Campos
                         </h4>
                         
                         <div className="space-y-3">
                            <div className="flex items-center gap-4 text-[10px] font-semibold text-slate-400 uppercase px-2">
                              <span className="flex-1">Campo em Hermes</span>
                              <span className="w-8"></span>
                              <span className="flex-1">Campo em {activeModal.name}</span>
                            </div>

                            {[
                              { h: 'Nome Completo', c: 'first_name + last_name' },
                              { h: 'Email', c: 'email' },
                              { h: 'Telefone / WhatsApp', c: 'phone' },
                              { h: 'Temperatura (Frio, Morno, Quente)', c: 'lead_status' },
                            ].map((pair, idx) => (
                              <div key={idx} className="flex items-center gap-4 bg-[#0b1120]/50 p-2 rounded-lg border border-slate-700/50">
                                <span className="flex-1 text-sm text-slate-300 font-medium px-2">{pair.h}</span>
                                <ArrowRightLeft size={14} className="text-slate-500 shrink-0" />
                                <select className="flex-1 h-9 rounded-md border border-slate-700 bg-slate-800 px-2 text-sm text-white focus:border-[#75AB61] focus:outline-none">
                                  <option>{pair.c}</option>
                                  <option>custom_field_1</option>
                                  <option>Ignorar este campo</option>
                                </select>
                              </div>
                            ))}
                         </div>
                      </div>
                    </div>
                  )}

                </div>
              )}

            </div>

            <div className="p-5 border-t border-slate-700/50 bg-[#0b1120]/50 flex justify-end gap-3 rounded-b-2xl">
               <button 
                 onClick={() => setActiveModal(null)}
                 className="px-5 py-2.5 rounded-lg text-sm font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
               >
                 Cancelar
               </button>
               <button 
                 className={cn(
                   "px-6 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-all shadow-lg",
                   activeModal.type === 'gateway' || (activeModal.type === 'crm' && activeModal.status === 'connected')
                     ? "bg-[#75AB61] text-[#0b1120] hover:bg-[#60914E]"
                     : "bg-slate-800 text-slate-500 cursor-not-allowed"
                 )}
               >
                 <Save size={16} /> Salvar Configurações
               </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

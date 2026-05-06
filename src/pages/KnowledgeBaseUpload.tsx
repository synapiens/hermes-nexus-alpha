import React, { useState } from 'react';
import { 
  CloudUpload, FileText, FileSpreadsheet, FileBox, Database, 
  Link as LinkIcon, AlertCircle, CheckCircle2, ChevronDown, 
  ChevronUp, Trash2, Loader2, Play
} from 'lucide-react';
import { cn } from '../lib/utils';

const mockQueue = [
  { id: 1, name: 'catalogo_produtos_v2.pdf', type: 'pdf', size: '2.4 MB', date: 'Hoje, 14:30', progress: 100, status: 'processed' },
  { id: 2, name: 'faq_atendimento_2026.csv', type: 'csv', size: '840 KB', date: 'Hoje, 15:10', progress: 45, status: 'processing', stage: 'Vetorizando conteúdo...' },
  { id: 3, name: 'manual_instalacao.pdf', type: 'pdf', size: '12.1 MB', date: 'Ontem, 09:15', progress: 100, status: 'error', errorMsg: 'Arquivo corrompido ou protegido por senha.' },
];

const mockHistory = [
  { id: 101, name: 'Tabela de Preços Q4 2025.csv', date: '10 Nov 2026', status: 'Ativo', records: 1245 },
  { id: 102, name: 'API de Estoque (Shopify)', date: '05 Nov 2026', status: 'Ativo', records: 850 },
  { id: 103, name: 'Base de Dados Postgress - Clientes', date: '20 Out 2026', status: 'Inativo', records: 15400 },
];

export function KnowledgeBaseUpload() {
  const [activeTab, setActiveTab] = useState<'upload' | 'api' | 'db'>('upload');
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          Base de Conhecimento <Database className="text-[#75AB61]" size={24} />
        </h1>
        <p className="text-slate-400 text-sm mt-1">Alimente as IAs com os dados e processos da sua empresa.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* MAIN UPLOAD / CONNECT AREA (Col Span 2) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* TABS */}
          <div className="card-surface p-2 rounded-xl flex gap-2">
            <button 
              onClick={() => setActiveTab('upload')}
              className={cn("flex-1 py-3 px-4 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all", activeTab === 'upload' ? "bg-slate-800 text-white shadow-sm border border-slate-700" : "text-slate-400 hover:text-white hover:bg-slate-800/50")}
            >
              <CloudUpload size={18} /> Upload de Arquivo
            </button>
            <button 
              onClick={() => setActiveTab('api')}
              className={cn("flex-1 py-3 px-4 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all", activeTab === 'api' ? "bg-slate-800 text-white shadow-sm border border-slate-700" : "text-slate-400 hover:text-white hover:bg-slate-800/50")}
            >
              <LinkIcon size={18} /> REST API
            </button>
            <button 
              onClick={() => setActiveTab('db')}
              className={cn("flex-1 py-3 px-4 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all", activeTab === 'db' ? "bg-slate-800 text-white shadow-sm border border-slate-700" : "text-slate-400 hover:text-white hover:bg-slate-800/50")}
            >
              <Database size={18} /> Banco de Dados
            </button>
          </div>

          <div className="card-surface rounded-xl p-8 min-h-[400px]">
            
            {activeTab === 'upload' && (
              <div className="animate-in fade-in duration-300 h-full flex flex-col justify-center">
                <div className="relative group cursor-pointer w-full h-[300px] flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#75AB61]/40 bg-[#75AB61]/5 hover:bg-[#75AB61]/10 transition-colors">
                  
                  {/* Decorative Gradient Border Effect */}
                  <div className="absolute inset-0 rounded-2xl brand-gradient opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none"></div>

                  <div className="p-4 rounded-full bg-[#1A1A2E] border border-[#75AB61]/30 mb-4 group-hover:-translate-y-2 transition-transform duration-300 shadow-[0_0_20px_rgba(117,171,97,0.2)]">
                    <CloudUpload size={40} className="text-[#A2C794] animate-pulse" style={{animationDuration: '3s'}} />
                  </div>
                  
                  <h3 className="text-lg font-bold text-white mb-2 text-center">Arraste arquivos aqui</h3>
                  <p className="text-slate-400 text-sm mb-6 text-center">ou clique para procurar no seu computador</p>
                  
                  <div className="flex gap-3 mb-6">
                    <span className="px-3 py-1 bg-red-500/10 text-red-400 text-xs font-bold rounded-lg border border-red-500/20 flex items-center gap-1.5"><FileText size={14}/> .PDF</span>
                    <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-bold rounded-lg border border-emerald-500/20 flex items-center gap-1.5"><FileSpreadsheet size={14}/> .CSV</span>
                  </div>

                  <button className="px-6 py-2.5 bg-slate-800 text-white text-sm font-semibold rounded-lg border border-slate-700 hover:bg-slate-700 transition-colors z-10">
                    Selecionar Arquivos
                  </button>

                  <p className="absolute bottom-4 text-[10px] text-slate-500">Tamanho máximo: 50MB por arquivo.</p>
                </div>
              </div>
            )}

            {activeTab === 'api' && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-5">
                <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-slate-700/50 pb-3 mb-4">
                  <LinkIcon className="text-[#75AB61]" size={20}/> Conexão API Externa
                </h3>
                
                <div className="flex gap-3">
                  <div className="w-1/4">
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase">Método</label>
                    <select className="w-full h-11 rounded-lg border border-slate-700 bg-slate-800/50 px-3 text-sm text-white focus:border-[#75AB61] focus:outline-none">
                      <option>GET</option>
                      <option>POST</option>
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase">URL do Endpoint</label>
                    <input type="url" placeholder="https://api.empresa.com/v1/produtos" className="w-full h-11 rounded-lg border border-slate-700 bg-[#0b1120]/50 px-4 text-sm text-white placeholder-slate-500 focus:border-[#75AB61] focus:outline-none focus:ring-1 focus:ring-[#75AB61]" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase">Autenticação (Headers)</label>
                  <div className="flex gap-3 mb-2">
                    <input type="text" placeholder="Key (ex: Authorization)" className="w-1/3 h-10 rounded-lg border border-slate-700 bg-[#0b1120]/50 px-3 text-sm text-white placeholder-slate-500" />
                    <input type="text" placeholder="Value (ex: Bearer token...)" className="flex-1 h-10 rounded-lg border border-slate-700 bg-[#0b1120]/50 px-3 text-sm text-white placeholder-slate-500" />
                  </div>
                  <button className="text-xs text-[#75AB61] hover:text-[#A2C794] font-medium">+ Adicionar Header</button>
                </div>

                <div>
                   <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase">Payload de Teste (JSON) - Opcional</label>
                   <textarea className="w-full h-24 rounded-lg border border-slate-700 bg-[#0b1120]/50 p-3 text-sm text-slate-300 font-mono focus:border-[#75AB61] focus:outline-none resize-none" placeholder="{'{}'}"></textarea>
                </div>

                <div className="pt-4 border-t border-slate-700/50 flex justify-end gap-3">
                  <button className="px-5 py-2.5 bg-slate-800 text-white text-sm font-semibold rounded-lg border border-slate-700 hover:bg-slate-700 transition-colors flex items-center gap-2">
                    <Play size={16}/> Testar Conexão
                  </button>
                  <button className="brand-gradient px-6 py-2.5 text-[#0b1120] text-sm font-bold rounded-lg hover:opacity-90 transition-opacity">
                    Salvar & Sincronizar
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'db' && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-5">
                <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-slate-700/50 pb-3 mb-4">
                  <Database className="text-[#75AB61]" size={20}/> Conexão de Banco de Dados
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase">Tipo</label>
                    <select className="w-full h-11 rounded-lg border border-slate-700 bg-slate-800/50 px-3 text-sm text-white focus:border-[#75AB61] focus:outline-none">
                      <option>PostgreSQL</option>
                      <option>MySQL</option>
                      <option>MongoDB</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase">Host / URL</label>
                    <input type="text" placeholder="db.empresa.com" className="w-full h-11 rounded-lg border border-slate-700 bg-[#0b1120]/50 px-4 text-sm text-white placeholder-slate-500 focus:border-[#75AB61] focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase">Porta</label>
                    <input type="text" placeholder="5432" className="w-full h-11 rounded-lg border border-slate-700 bg-[#0b1120]/50 px-4 text-sm text-white placeholder-slate-500 focus:border-[#75AB61] focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase">Nome do Banco</label>
                    <input type="text" placeholder="producao_main" className="w-full h-11 rounded-lg border border-slate-700 bg-[#0b1120]/50 px-4 text-sm text-white placeholder-slate-500 focus:border-[#75AB61] focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase">Usuário (Leitura)</label>
                    <input type="text" placeholder="hermes_reader" className="w-full h-11 rounded-lg border border-slate-700 bg-[#0b1120]/50 px-4 text-sm text-white placeholder-slate-500 focus:border-[#75AB61] focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase">Senha</label>
                    <input type="password" placeholder="••••••••" className="w-full h-11 rounded-lg border border-slate-700 bg-[#0b1120]/50 px-4 text-sm text-white placeholder-slate-500 focus:border-[#75AB61] focus:outline-none" />
                  </div>
                </div>

                <div>
                   <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase">Query / Coleção de Extração</label>
                   <textarea className="w-full h-24 rounded-lg border border-slate-700 bg-[#0b1120]/50 p-3 text-sm text-slate-300 font-mono focus:border-[#75AB61] focus:outline-none resize-none" placeholder="SELECT id, nome, descricao FROM produtos WHERE ativo = true"></textarea>
                   <p className="mt-1 flex items-center justify-between text-[10px] text-slate-500">
                     <span>Execute apenas visualizações (Views) ou Queries simples.</span>
                   </p>
                </div>

                <div className="pt-4 border-t border-slate-700/50 flex justify-end gap-3">
                  <button className="px-5 py-2.5 bg-slate-800 text-white text-sm font-semibold rounded-lg border border-slate-700 hover:bg-slate-700 transition-colors flex items-center gap-2">
                    <Play size={16}/> Testar Conexão
                  </button>
                  <button className="brand-gradient px-6 py-2.5 text-[#0b1120] text-sm font-bold rounded-lg hover:opacity-90 transition-opacity">
                    Salvar Conexão
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* SIDE BAR / QUEUE (Col Span 1) */}
        <div className="space-y-6">
          <div className="card-surface rounded-xl p-5 flex flex-col h-full min-h-[400px]">
            <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider flex justify-between items-center bg-[#0b1120]/50 p-3 rounded-lg border border-slate-700/50">
              <span>Fila de Processamento</span>
              <span className="bg-[#75AB61]/20 text-[#75AB61] px-2 py-0.5 rounded-full text-xs">3 itens</span>
            </h3>
            
            <div className="flex-1 space-y-3 overflow-y-auto pr-1">
              {mockQueue.map((item) => (
                <div key={item.id} className="bg-slate-800/40 rounded-xl border border-slate-700/50 p-4 relative group hover:bg-slate-800/60 transition-colors">
                  
                  {/* Remove btn */}
                  <button className="absolute top-3 right-3 text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Trash2 size={16} />
                  </button>
                  
                  <div className="flex items-start gap-3 mb-3">
                    <div className={cn("p-2 rounded-lg shrink-0", 
                      item.type === 'pdf' ? "bg-red-500/10 text-red-400" : "bg-emerald-500/10 text-emerald-400"
                    )}>
                      {item.type === 'pdf' ? <FileText size={18} /> : <FileSpreadsheet size={18} />}
                    </div>
                    <div className="min-w-0 pr-6">
                      <p className="text-sm font-bold text-white truncate" title={item.name}>{item.name}</p>
                      <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                        <span>{item.size}</span>
                        <span>•</span>
                        <span>{item.date}</span>
                      </div>
                    </div>
                  </div>

                  {/* Progress & Status */}
                  <div>
                    {item.status === 'processing' && (
                      <>
                        <div className="flex justify-between text-xs mb-1.5">
                          <span className="text-yellow-400 font-medium flex items-center gap-1.5">
                            <Loader2 size={12} className="animate-spin" /> {item.stage}
                          </span>
                          <span className="text-slate-300">{item.progress}%</span>
                        </div>
                        <div className="w-full bg-[#0b1120] rounded-full h-1.5 border border-slate-700">
                          <div className="bg-yellow-400 h-full rounded-full relative overflow-hidden" style={{ width: `${item.progress}%` }}>
                            <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                          </div>
                        </div>
                      </>
                    )}

                    {item.status === 'processed' && (
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-[#75AB61]">
                        <CheckCircle2 size={14} /> Indexado e Vetorizado (100%)
                      </div>
                    )}

                    {item.status === 'error' && (
                      <div>
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-red-400 mb-1">
                          <AlertCircle size={14} /> Falla no Processamento
                        </div>
                        <p className="text-[10px] text-red-400/80 leading-tight">{item.errorMsg}</p>
                      </div>
                    )}
                  </div>

                </div>
              ))}
            </div>
            
          </div>
        </div>

      </div>

      {/* HISTORY ACCORDION */}
      <div className="card-surface rounded-xl border border-slate-700/50 mt-6 overflow-hidden">
        <button 
          onClick={() => setIsHistoryOpen(!isHistoryOpen)}
          className="w-full flex items-center justify-between p-5 bg-[#1A1A2E] hover:bg-[#1A1A2E]/80 transition-colors"
        >
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">Histórico de Bases Indexadas</h3>
            <p className="text-xs text-slate-400 mt-1 text-left">Visualize fontes ativas e antigas que alimentam a inteligência das IAs.</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-300">
            {isHistoryOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>
        </button>
        
        {isHistoryOpen && (
          <div className="p-5 border-t border-slate-700/50 bg-[#0b1120]/50 animate-in slide-in-from-top-4 duration-200">
            <div className="w-full overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="text-xs uppercase bg-slate-800/80 text-slate-400 font-bold border-y border-slate-700">
                  <tr>
                    <th className="px-4 py-3">Fonte / Nome</th>
                    <th className="px-4 py-3">Data de Criação</th>
                    <th className="px-4 py-3">Registros (Chunks)</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {mockHistory.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-4 py-4 font-medium text-white flex items-center gap-2">
                        <FileBox size={16} className="text-[#A2C794]"/> {item.name}
                      </td>
                      <td className="px-4 py-4">{item.date}</td>
                      <td className="px-4 py-4">{item.records.toLocaleString()}</td>
                      <td className="px-4 py-4">
                        <span className={cn(
                          "px-2.5 py-1 rounded-md text-[10px] font-bold uppercase",
                          item.status === 'Ativo' ? "bg-[#75AB61]/10 text-[#75AB61] border border-[#75AB61]/20" : "bg-slate-800 text-slate-400 border border-slate-700"
                        )}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <button className="text-xs bg-slate-800 hover:bg-slate-700 text-white px-3 py-1.5 rounded transition-colors">
                          Atualizar via ID
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

    </div>
  );
}

import React, { useState } from 'react';
import { 
  Search, Database, FileText, Calendar, HardDrive, PieChart, 
  Settings, Filter, Edit2, Trash2, X, Save, AlertTriangle, Link as LinkIcon
} from 'lucide-react';
import { cn } from '../lib/utils';

// --- MOCK DATA ---
const stats = [
  { label: 'Total de Registros (Chunks)', value: '184.2k', icon: Database, color: 'text-blue-400', bg: 'bg-blue-400/10' },
  { label: 'Tamanho Total Indexado', value: '4.2 GB', icon: HardDrive, color: 'text-purple-400', bg: 'bg-purple-400/10' },
  { label: 'Última Atualização', value: 'Há 10 min', icon: Calendar, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
  { label: 'Cobertura de Produtos', value: '85%', icon: PieChart, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
];

const mockResults = [
  {
    id: 1,
    source: 'catalogo_produtos_v2.pdf',
    sourceType: 'pdf',
    date: '10 Nov 2026',
    score: 92,
    snippet: 'O <em>Plano Enterprise</em> possui customização ilimitada de relatórios e acesso prioritário ao suporte, além de contar com onboarding dedicado e SLAs de 99.9% de uptime garantido em contrato.',
    fullText: 'O Plano Enterprise possui customização ilimitada de relatórios e acesso prioritário ao suporte, além de contar com onboarding dedicado e SLAs de 99.9% de uptime garantido em contrato. Valor sob consulta mediante volume de licenças.',
    category: 'Planos e Preços',
    tags: 'enterprise, suporte, onboarding, sla',
    product: 'Plataforma Saas'
  },
  {
    id: 2,
    source: 'faq_atendimento.csv',
    sourceType: 'csv',
    date: '08 Nov 2026',
    score: 75,
    snippet: 'Caso o cliente queira fazer downgrade do <em>Plano Enterprise</em> para o Plano Pro, o cancelamento dos benefícios exclusivos ocorrerá no fechamento da fatura corrente.',
    fullText: 'Caso o cliente queira fazer downgrade do Plano Enterprise para o Plano Pro, o cancelamento dos benefícios exclusivos ocorrerá no fechamento da fatura corrente. O cliente deve preencher o formulário Xpto no portal.',
    category: 'Atendimento',
    tags: 'downgrade, cancelamento, faturamento',
    product: 'Gestão de Assinaturas'
  },
  {
    id: 3,
    source: 'https://api.empresa.com/v1/plans',
    sourceType: 'api',
    date: 'Hoje, 08:00',
    score: 64,
    snippet: 'A cota de disparo MKT para o <em>Plano Enterprise</em> é de 50.000 mensagens adicionais ao mês sem custo excedente.',
    fullText: 'A cota de disparo MKT para o Plano Enterprise é de 50.000 mensagens adicionais ao mês sem custo excedente. Mensagens extras são faturadas a R$ 0,08.',
    category: 'Limites de Uso',
    tags: 'disparos, mkt, cota, excedente',
    product: 'Agente Disparador'
  }
];

export function KnowledgeBaseSearch() {
  const [semanticSearch, setSemanticSearch] = useState(true);
  const [editingRecord, setEditingRecord] = useState<any | null>(null);

  // Form states for editing
  const [editCategory, setEditCategory] = useState('');
  const [editTags, setEditTags] = useState('');
  const [editProduct, setEditProduct] = useState('');
  const [editText, setEditText] = useState('');

  const handleEditOpen = (record: any) => {
    setEditingRecord(record);
    setEditCategory(record.category);
    setEditTags(record.tags);
    setEditProduct(record.product);
    setEditText(record.fullText);
  };

  const renderSnippet = (html: string) => {
    // Apenas para fins de UI, vamos emular o destaque transformando <em> em tags span de estilos
    const createMarkup = () => {
      let styledHtml = html.replace(/<em>/g, '<span class="text-cyan-400 font-bold bg-cyan-400/10 px-1 rounded">');
      styledHtml = styledHtml.replace(/<\/em>/g, '</span>');
      return { __html: styledHtml };
    };
    return <div dangerouslySetInnerHTML={createMarkup()} />;
  };

  return (
    <div className="space-y-6 h-full flex flex-col relative w-full overflow-hidden">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            Consulta da Base <Search className="text-[#75AB61]" size={24} />
          </h1>
          <p className="text-slate-400 text-sm mt-1">Pesquise e edite a inteligência vetorizada da plataforma.</p>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="card-surface p-4 rounded-xl flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-slate-400">{stat.label}</span>
              <div className={cn("p-1.5 rounded-md", stat.bg, stat.color)}>
                <stat.icon size={14} />
              </div>
            </div>
            <h3 className="text-xl font-bold text-white">{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* SEARCH BAR AREA */}
      <div className="card-surface rounded-xl p-5 border border-[#75AB61]/20">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="relative flex-1">
            <input 
              type="text" 
              placeholder="Pesquise na base de conhecimento (ex: regras do plano enterprise)..."
              defaultValue="Plano Enterprise"
              className="w-full h-12 rounded-xl border border-slate-700 bg-[#0b1120]/50 pl-4 pr-12 text-sm text-white placeholder-slate-500 focus:border-[#75AB61] focus:outline-none focus:ring-1 focus:ring-[#75AB61]"
            />
            <button className="absolute right-1 top-1 h-10 w-10 flex items-center justify-center rounded-lg brand-gradient text-[#0b1120] hover:opacity-90 transition-opacity">
              <Search size={18} />
            </button>
          </div>
          
          <div className="flex gap-3">
            <select className="h-12 rounded-xl border border-slate-700 bg-[#0b1120]/50 px-3 text-sm text-slate-300 focus:border-[#75AB61] focus:outline-none min-w-[140px]">
              <option>Todas as Fontes</option>
              <option>Arquivos PDF</option>
              <option>APIs</option>
            </select>
            <select className="h-12 rounded-xl border border-slate-700 bg-[#0b1120]/50 px-3 text-sm text-slate-300 focus:border-[#75AB61] focus:outline-none min-w-[160px]">
              <option>Todos os Agentes</option>
              <option>Agente Conhecimento</option>
              <option>Agente Atendimento</option>
            </select>
            <button className="h-12 px-3 bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 text-slate-300 flex items-center justify-center transition-colors px-4">
              <Filter size={18} />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <div className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked={semanticSearch} onChange={e => setSemanticSearch(e.target.checked)} />
              <div className="w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#75AB61]"></div>
            </div>
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Busca Semântica</span>
          </label>
          <span className="text-xs text-slate-500">vs Busca Exata</span>
        </div>
      </div>

      {/* RESULTS */}
      <div className="flex-1 overflow-auto pb-10 pr-2">
        <h3 className="text-white font-medium mb-4">Resultados encontrados ({mockResults.length})</h3>
        <div className="space-y-4">
          {mockResults.map((result) => (
            <div key={result.id} className="card-surface rounded-xl p-5 border border-slate-700/50 hover:border-[#75AB61]/30 transition-colors group shadow-md hover:shadow-lg">
              
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "p-2.5 rounded-lg shrink-0",
                    result.sourceType === 'pdf' ? "bg-red-500/10 border border-red-500/20 text-red-400" : 
                    result.sourceType === 'csv' ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400" : 
                    "bg-blue-500/10 border border-blue-500/20 text-blue-400"
                  )}>
                    {result.sourceType === 'pdf' ? <FileText size={20} /> : 
                     result.sourceType === 'csv' ? <FileText size={20} /> : 
                     <LinkIcon size={20} />}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white mb-1 group-hover:text-[#75AB61] transition-colors">{result.source}</h4>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                      <span className="flex items-center gap-1.5"><Calendar size={12} className="text-slate-500" /> {result.date}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0 mt-2 md:mt-0">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Relevância</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div className={cn("h-full rounded-full ring-1 ring-white/10 ring-inset", result.score > 80 ? 'bg-gradient-to-r from-emerald-500 to-[#75AB61]' : result.score > 60 ? 'bg-gradient-to-r from-yellow-500 to-yellow-400' : 'bg-gradient-to-r from-red-500 to-red-400')} style={{ width: `${result.score}%` }}></div>
                      </div>
                      <span className="text-sm font-bold text-white w-7">{result.score}%</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 border-l border-slate-700/50 pl-4">
                    <button 
                      onClick={() => handleEditOpen(result)}
                      className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors border border-slate-700 hover:border-[#75AB61]/50 hover:text-[#75AB61]" 
                      title="Editar"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      className="p-2 bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded-lg transition-colors border border-slate-700 hover:border-red-500/30"
                      title="Excluir"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex flex-col lg:flex-row gap-4 mb-4">
                 <div className="flex-1 bg-[#0b1120] p-4 rounded-xl border border-slate-700/80 text-sm text-slate-300 leading-relaxed shadow-inner">
                  {renderSnippet(result.snippet)}
                 </div>
                 
                 <div className="lg:w-64 shrink-0 space-y-3 bg-[#111A22]/50 p-4 rounded-xl border border-slate-700/50">
                    <div>
                      <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Metadados</span>
                    </div>
                    
                    <div className="flex items-start gap-2">
                       <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0"></span>
                       <div>
                         <span className="text-[10px] text-slate-500 block mb-0.5">Produto Associado</span>
                         <span className="text-xs font-semibold text-slate-200">{result.product}</span>
                       </div>
                    </div>
                    
                    <div className="flex items-start gap-2">
                       <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5 shrink-0"></span>
                       <div>
                         <span className="text-[10px] text-slate-500 block mb-0.5">Categoria</span>
                         <span className="text-xs font-semibold text-slate-200">{result.category}</span>
                       </div>
                    </div>
                 </div>
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-slate-700/30">
                 <span className="text-[10px] text-slate-500 font-medium tracking-wide border border-slate-700 bg-slate-800 px-2 py-0.5 rounded uppercase">Tags</span>
                 <div className="flex flex-wrap gap-1.5">
                   {result.tags.split(',').map((tag, i) => (
                     <span key={i} className="text-xs text-slate-400 bg-[#0b1120] border border-slate-800 px-2 py-1 rounded-md">
                       #{tag.trim()}
                     </span>
                   ))}
                 </div>
              </div>

            </div>
          ))}
        </div>
      </div>

      {/* EDIT SIDE PANEL (DRAWER) */}
      {editingRecord && (
        <div className="absolute inset-y-0 right-0 w-full max-w-md bg-[#111A22] border-l border-[#75AB61]/30 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 z-50">
          
          <div className="flex items-center justify-between p-5 border-b border-slate-700/50 bg-[#1A1A2E]/50">
            <div>
              <h2 className="text-lg font-bold text-white">Editar Registro</h2>
              <p className="text-xs text-slate-400 mt-0.5">Editando chunk originado de {editingRecord.source}</p>
            </div>
            <button 
              onClick={() => setEditingRecord(null)}
              className="w-8 h-8 rounded-full bg-slate-800/80 flex items-center justify-center text-slate-400 hover:text-white transition-colors border border-slate-700"
            >
              <X size={16} />
            </button>
          </div>

          <div className="flex-1 overflow-auto p-6 space-y-6">
            
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase">Conteúdo do Registro</label>
              <textarea 
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="w-full h-48 rounded-xl border border-slate-700 bg-[#0b1120]/50 p-3 text-sm text-white focus:border-[#75AB61] focus:outline-none focus:ring-1 focus:ring-[#75AB61] resize-none leading-relaxed"
              ></textarea>
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-700/50">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2"><Settings size={14} className="text-[#A2C794]"/> Metadados do Registro</h3>
              
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Categoria</label>
                <input 
                  type="text" 
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value)}
                  className="w-full h-10 rounded-lg border border-slate-700 bg-[#0b1120]/50 px-3 text-sm text-white focus:border-[#75AB61] focus:outline-none" 
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Produto Associado</label>
                <input 
                  type="text" 
                  value={editProduct}
                  onChange={(e) => setEditProduct(e.target.value)}
                  className="w-full h-10 rounded-lg border border-slate-700 bg-[#0b1120]/50 px-3 text-sm text-white focus:border-[#75AB61] focus:outline-none" 
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Tags (separadas por vírgula)</label>
                <input 
                  type="text" 
                  value={editTags}
                  onChange={(e) => setEditTags(e.target.value)}
                  className="w-full h-10 rounded-lg border border-slate-700 bg-[#0b1120]/50 px-3 text-sm text-white focus:border-[#75AB61] focus:outline-none" 
                />
              </div>
            </div>

            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 flex gap-3 text-yellow-500/80 mt-6">
              <AlertTriangle size={16} className="shrink-0 mt-0.5" />
              <p className="text-xs">
                Alterações salvas gravam diretamente na base vetorizada. Alterações são refletidas nos agentes em <strong>até 2 minutos</strong>.
              </p>
            </div>

          </div>

          <div className="p-5 border-t border-slate-700/50 bg-[#1A1A2E]/50 flex gap-3">
            <button 
              onClick={() => setEditingRecord(null)}
              className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-sm font-semibold rounded-lg transition-colors border border-slate-700"
            >
              Cancelar
            </button>
            <button 
              onClick={() => setEditingRecord(null)}
              className="flex-1 py-2.5 brand-gradient text-[#0b1120] text-sm font-bold rounded-lg hover:opacity-90 transition-opacity flex justify-center items-center gap-2 shadow-[0_0_15px_rgba(117,171,97,0.3)]"
            >
              <Save size={16} /> Salvar Alteração
            </button>
          </div>

        </div>
      )}

      {/* Overlay to close drawer */}
      {editingRecord && (
        <div 
          className="absolute inset-0 bg-[#0b1120]/50 backdrop-blur-sm z-40 animate-in fade-in duration-300"
          onClick={() => setEditingRecord(null)}
        ></div>
      )}

    </div>
  );
}

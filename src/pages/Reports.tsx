import React, { useState } from 'react';
import { 
  FileText, CalendarDays, Filter, Download, 
  BarChart2, PieChart, Activity, FileSpreadsheet, 
  File as FilePdf, CheckSquare, Clock, LayoutDashboard, ChevronDown
} from 'lucide-react';
import { cn } from '../lib/utils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, LineChart, Line, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';

const mockHistory = [
  { id: 1, name: 'Desempenho Vendas Q1', type: 'Conversões e Vendas', period: '01/01/2026 - 31/03/2026', date: '05/05/2026', format: 'PDF' },
  { id: 2, name: 'Leads Abril 2026', type: 'Desempenho de Leads', period: '01/04/2026 - 30/04/2026', date: '02/05/2026', format: 'Excel' },
  { id: 3, name: 'Uso da Plataforma (Semanal)', type: 'Uso da Plataforma', period: '24/04/2026 - 30/04/2026', date: '01/05/2026', format: 'CSV' },
];

const mockChartData = [
  { name: 'S1', metricA: 40, metricB: 24 },
  { name: 'S2', metricA: 30, metricB: 13 },
  { name: 'S3', metricA: 20, metricB: 98 },
  { name: 'S4', metricA: 27, metricB: 39 },
];

const pieData = [
  { name: 'WhatsApp', value: 400 },
  { name: 'Instagram', value: 300 },
  { name: 'Web', value: 300 },
];
const COLORS = ['#25D366', '#E1306C', '#3B82F6'];

export function Reports() {
  const [reportType, setReportType] = useState('leads');
  const [chartType, setChartType] = useState('bar');
  const [hasPreview, setHasPreview] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const metricsObj = [
    { id: 'total_leads', label: 'Total de Leads' },
    { id: 'conversion_rate', label: 'Taxa de Conversão' },
    { id: 'response_time', label: 'Tempo de Resposta' },
    { id: 'engagement', label: 'Engajamento' },
  ];

  const handleGeneratePreview = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setHasPreview(true);
    }, 800);
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex flex-col flex-shrink-0">
        <h1 className="text-2xl font-bold text-white">Relatórios Exportáveis</h1>
        <p className="text-slate-400 text-sm mt-1">Geração de relatórios detalhados e customizados</p>
      </div>
      
      <div className="flex-1 overflow-auto custom-scrollbar flex flex-col gap-6 lg:flex-row pb-6">
        
        {/* Configuração (Left 40%) */}
        <div className="w-full lg:w-[40%] flex flex-col gap-4">
          <div className="card-surface p-5 rounded-xl border border-slate-700/50 space-y-6 flex-1">
            <h2 className="text-lg font-bold text-white border-b border-slate-700/50 pb-3 flex items-center gap-2">
              <FileText size={18} className="text-[#75AB61]" /> Configurar Relatório
            </h2>
            
            {/* Tipo */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">Tipo de Relatório</label>
              <div className="relative">
                 <select 
                   value={reportType} onChange={(e) => setReportType(e.target.value)}
                   className="w-full appearance-none h-10 px-3 bg-slate-800 border border-slate-600 rounded-lg text-sm text-white focus:border-[#75AB61] focus:outline-none"
                 >
                   <option value="leads">Desempenho de Leads</option>
                   <option value="conversations">Conversas</option>
                   <option value="marketing">Disparos MKT</option>
                   <option value="sales">Conversões e Vendas</option>
                   <option value="platform">Uso da Plataforma</option>
                   <option value="consolidated">Relatório Consolidado</option>
                 </select>
                 <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Período */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">Período</label>
              <div className="grid grid-cols-2 gap-3 mb-3">
                 <input type="date" className="h-10 px-3 bg-slate-800 border border-slate-600 rounded-lg text-sm text-white focus:border-[#75AB61] focus:outline-none" />
                 <input type="date" className="h-10 px-3 bg-slate-800 border border-slate-600 rounded-lg text-sm text-white focus:border-[#75AB61] focus:outline-none" />
              </div>
              <div className="flex flex-wrap gap-2">
                <button className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 transition-colors border border-slate-700">Este Mês</button>
                <button className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 transition-colors border border-slate-700">Mês Anterior</button>
                <button className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 transition-colors border border-slate-700">Trimestre</button>
                <button className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 transition-colors border border-slate-700">Ano</button>
              </div>
            </div>

            {/* Filtros */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">Filtros Adicionais</label>
              <div className="space-y-3">
                 <div className="flex items-center gap-2">
                    <Filter size={14} className="text-slate-500" />
                    <select className="flex-1 appearance-none h-9 px-3 bg-slate-800 border border-slate-600 rounded-lg text-xs text-white focus:border-[#75AB61] focus:outline-none">
                      <option>Todos os Canais</option>
                      <option>WhatsApp</option>
                      <option>Instagram</option>
                    </select>
                 </div>
                 <div className="flex items-center gap-2">
                    <Filter size={14} className="text-slate-500" />
                    <select className="flex-1 appearance-none h-9 px-3 bg-slate-800 border border-slate-600 rounded-lg text-xs text-white focus:border-[#75AB61] focus:outline-none">
                      <option>Todos os Agentes</option>
                      <option>Agente Vendas</option>
                      <option>SDR</option>
                    </select>
                 </div>
              </div>
            </div>

            {/* Métricas */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">Métricas a Incluir</label>
              <div className="grid grid-cols-2 gap-3">
                {metricsObj.map(m => (
                  <label key={m.id} className="flex items-center gap-2 cursor-pointer group">
                    <div className="w-4 h-4 rounded border border-slate-600 bg-slate-800 group-hover:border-[#75AB61] flex items-center justify-center relative">
                      <input type="checkbox" defaultChecked className="opacity-0 absolute inset-0 cursor-pointer peer" />
                      <CheckSquare size={12} className="text-[#75AB61] opacity-0 peer-checked:opacity-100 transition-opacity" />
                    </div>
                    <span className="text-sm text-slate-300 group-hover:text-white transition-colors">{m.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Formato de Gráficos */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">Formato de Gráficos</label>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => setChartType('bar')} className={cn("px-3 py-2 rounded-lg border text-sm flex items-center gap-2 transition-colors", chartType === 'bar' ? "bg-[#75AB61]/20 border-[#75AB61] text-[#75AB61]" : "bg-slate-800/50 border-slate-700 text-slate-400 hover:text-white hover:bg-slate-700")}>
                  <BarChart2 size={16} /> Barras
                </button>
                <button onClick={() => setChartType('line')} className={cn("px-3 py-2 rounded-lg border text-sm flex items-center gap-2 transition-colors", chartType === 'line' ? "bg-[#75AB61]/20 border-[#75AB61] text-[#75AB61]" : "bg-slate-800/50 border-slate-700 text-slate-400 hover:text-white hover:bg-slate-700")}>
                  <Activity size={16} /> Linhas
                </button>
                <button onClick={() => setChartType('pie')} className={cn("px-3 py-2 rounded-lg border text-sm flex items-center gap-2 transition-colors", chartType === 'pie' ? "bg-[#75AB61]/20 border-[#75AB61] text-[#75AB61]" : "bg-slate-800/50 border-slate-700 text-slate-400 hover:text-white hover:bg-slate-700")}>
                  <PieChart size={16} /> Pizza
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-slate-700/50 space-y-3">
              <button 
                onClick={handleGeneratePreview}
                className="w-full h-11 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                {isGenerating ? <Activity className="animate-spin" size={18} /> : <LayoutDashboard size={18} />}
                {isGenerating ? 'Processando...' : 'Gerar Preview'}
              </button>
              
              <div className="grid grid-cols-3 gap-2">
                <button disabled={!hasPreview} className="col-span-3 sm:col-span-1 h-10 disabled:opacity-50 disabled:cursor-not-allowed bg-[#E53935] hover:bg-[#D32F2F] text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-lg shadow-red-900/20">
                  <FilePdf size={14} /> Exportar PDF
                </button>
                <button disabled={!hasPreview} className="col-span-3 sm:col-span-1 h-10 disabled:opacity-50 disabled:cursor-not-allowed bg-[#107C41] hover:bg-[#0B6631] text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-lg shadow-green-900/20">
                  <FileSpreadsheet size={14} /> Exportar Excel
                </button>
                <button disabled={!hasPreview} className="col-span-3 sm:col-span-1 h-10 disabled:opacity-50 disabled:cursor-not-allowed bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5">
                  <Download size={14} /> Exportar CSV
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Preview & Histórico (Right 60%) */}
        <div className="w-full lg:w-[60%] flex flex-col gap-6">
          
          {/* Preview Panel */}
          <div className="card-surface p-1 rounded-xl border border-slate-700/50 flex-1 min-h-[400px] flex flex-col">
            <div className="p-4 border-b border-slate-700/50 bg-[#0b1120]/30 rounded-t-xl flex items-center justify-between">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <LayoutDashboard size={18} className="text-[#75AB61]" /> Preview do Relatório
              </h2>
              {hasPreview && (
                <span className="text-xs text-slate-400 bg-slate-800 px-2.5 py-1 rounded-md border border-slate-700/50">
                  Est. 3 páginas
                </span>
              )}
            </div>

            <div className="flex-1 p-5 overflow-auto custom-scrollbar relative">
              {!hasPreview ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500">
                  <FileText size={48} className="text-slate-700 mb-4" />
                  <p>Configure o relatório à esquerda para visualizar o preview.</p>
                </div>
              ) : (
                <div className="space-y-6 animate-in fade-in duration-500">
                   {/* Summary Numbers */}
                   <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                     {metricsObj.map((m, i) => (
                       <div key={i} className="bg-slate-800/30 p-4 rounded-xl border border-slate-700/30">
                         <h4 className="text-xs text-slate-400 font-bold mb-1">{m.label}</h4>
                         <span className="text-2xl font-black text-white">{(Math.random() * 500).toFixed(0)}</span>
                       </div>
                     ))}
                   </div>

                   {/* Chart Preview */}
                   <div className="bg-slate-800/30 p-5 rounded-xl border border-slate-700/30 h-64">
                     <ResponsiveContainer width="100%" height="100%">
                        {chartType === 'bar' ? (
                          <BarChart data={mockChartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                            <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                            <RechartsTooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }} />
                            <Bar dataKey="metricA" fill="#75AB61" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="metricB" fill="#2563eb" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        ) : chartType === 'line' ? (
                          <LineChart data={mockChartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                            <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                            <RechartsTooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }} />
                            <Line type="monotone" dataKey="metricA" stroke="#75AB61" strokeWidth={2} />
                            <Line type="monotone" dataKey="metricB" stroke="#2563eb" strokeWidth={2} />
                          </LineChart>
                        ) : (
                          <RechartsPieChart>
                            <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                              {pieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <RechartsTooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }} />
                          </RechartsPieChart>
                        )}
                     </ResponsiveContainer>
                   </div>
                </div>
              )}
            </div>
          </div>

          {/* Histórico */}
          <div className="card-surface p-1 rounded-xl border border-slate-700/50">
             <div className="p-4 border-b border-slate-700/50 bg-[#0b1120]/30 rounded-t-xl">
               <h2 className="text-sm font-bold text-white flex items-center gap-2">
                 <Clock size={16} className="text-[#75AB61]" /> Histórico de Relatórios Gerados
               </h2>
             </div>
             
             <div className="overflow-x-auto p-2">
               <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-700/50">
                      <th className="p-3 text-xs font-semibold text-slate-400">Nome / Tipo</th>
                      <th className="p-3 text-xs font-semibold text-slate-400">Período</th>
                      <th className="p-3 text-xs font-semibold text-slate-400">Data</th>
                      <th className="p-3 text-xs font-semibold text-slate-400">Formato</th>
                      <th className="p-3 text-xs font-semibold text-slate-400"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/20">
                    {mockHistory.map(report => (
                      <tr key={report.id} className="hover:bg-slate-800/20 transition-colors">
                        <td className="p-3 whitespace-nowrap">
                          <div className="text-sm font-bold text-white">{report.name}</div>
                          <div className="text-[10px] text-slate-400 uppercase">{report.type}</div>
                        </td>
                        <td className="p-3 whitespace-nowrap text-sm text-slate-300 font-mono text-xs">{report.period}</td>
                        <td className="p-3 whitespace-nowrap text-sm text-slate-300">{report.date}</td>
                        <td className="p-3 whitespace-nowrap">
                          <span className={cn(
                            "px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider",
                            report.format === 'PDF' ? "bg-red-500/20 text-red-400" :
                            report.format === 'Excel' ? "bg-green-500/20 text-green-400" :
                            "bg-slate-700 text-slate-300"
                          )}>
                            {report.format}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <button className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded transition-colors" title="Download Novamente">
                            <Download size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
               </table>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}

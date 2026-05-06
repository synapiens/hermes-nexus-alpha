import React, { useState } from 'react';
import { 
  CreditCard, FileText, Download, TrendingUp, AlertCircle, CheckCircle2, ChevronDown, ChevronUp, MapPin, Building, CreditCard as CardIcon
} from 'lucide-react';
import { cn } from '../lib/utils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

type TabType = 'consumption' | 'history' | 'payment';

const dailyUsageData = Array.from({ length: 30 }).map((_, i) => ({
  date: `${i + 1}/05`,
  whatsapp: Math.floor(Math.random() * 200) + 50,
  instagram: Math.floor(Math.random() * 100) + 20,
  web: Math.floor(Math.random() * 150) + 30,
}));

const mockDetailedConsumption = [
  { id: 1, date: '05/05/2026 14:30', type: 'Mensagem (IA)', agent: 'SDR Bot', channel: 'WhatsApp', cost: 'R$ 0,05' },
  { id: 2, date: '05/05/2026 14:28', type: 'Disparo MKT', agent: 'Campanha Q3', channel: 'Instagram', cost: 'R$ 0,02' },
  { id: 3, date: '05/05/2026 14:25', type: 'Análise Currículo', agent: 'RH Bot', channel: 'Web', cost: 'R$ 0,15' },
  { id: 4, date: '05/05/2026 14:20', type: 'Mensagem (IA)', agent: 'Vendas Bot', channel: 'WhatsApp', cost: 'R$ 0,05' },
  { id: 5, date: '05/05/2026 14:15', type: 'Transcrição Áudio', agent: 'SDR Bot', channel: 'WhatsApp', cost: 'R$ 0,10' },
];

const mockInvoices = [
  { id: 'INV-2026-04', period: 'Abril 2026', value: 'R$ 1.850,00', status: 'paid', paymentDate: '05/05/2026' },
  { id: 'INV-2026-03', period: 'Março 2026', value: 'R$ 1.620,00', status: 'paid', paymentDate: '05/04/2026' },
  { id: 'INV-2026-02', period: 'Fevereiro 2026', value: 'R$ 1.480,00', status: 'paid', paymentDate: '05/03/2026' },
  { id: 'INV-2026-01', period: 'Janeiro 2026', value: 'R$ 1.200,00', status: 'paid', paymentDate: '05/02/2026' },
];

export function Billing() {
  const [activeTab, setActiveTab] = useState<TabType>('consumption');
  const [expandedInvoice, setExpandedInvoice] = useState<string | null>(null);

  const totalLimit = 50000;
  const currentUsage = 42500;
  const usagePercentage = (currentUsage / totalLimit) * 100;
  
  const progressBarColor = 
    usagePercentage > 90 ? 'bg-red-500' : 
    usagePercentage > 75 ? 'bg-yellow-400' : 
    'bg-[#75AB61]';

  return (
    <div className="space-y-6 h-full flex flex-col relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Extrato de Uso e Pagamento</h1>
          <p className="text-slate-400 text-sm mt-1">Acompanhe seu consumo, faturas e dados de cobrança.</p>
        </div>
      </div>

      {/* Resumo do Plano (Header Fixo) */}
      <div className="card-surface p-5 rounded-xl border border-slate-700/50 flex flex-col lg:flex-row gap-6 relative shrink-0">
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-white">Plano Enterprise</h2>
            <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-[#75AB61]/20 text-[#75AB61] border border-[#75AB61]/30">
              Ativo
            </span>
          </div>
          <p className="text-sm text-slate-400">
            Período atual: <strong className="text-white">01/05/2026 a 31/05/2026</strong> (Próxima cobrança em 05/06/2026)
          </p>
        </div>

        <div className="flex-1 lg:max-w-md">
          <div className="flex justify-between text-sm mb-1.5">
            <span className="text-slate-300 font-medium">Consumo de Mensagens</span>
            <span className="font-bold text-white">
              {currentUsage.toLocaleString('pt-BR')} / {totalLimit.toLocaleString('pt-BR')}
            </span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-1000 ${progressBarColor}`}
              style={{ width: `${usagePercentage}%` }}
            ></div>
          </div>
          {usagePercentage > 75 && (
            <p className="text-xs text-yellow-400 font-medium mt-2 flex items-center gap-1.5 flex-1">
              <AlertCircle size={12} />
              Você está se aproximando do limite do plano. Cada mensagem extra custará R$ 0,08.
            </p>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-slate-700/50">
        <button
          onClick={() => setActiveTab('consumption')}
          className={cn(
            "px-4 py-2.5 text-sm font-medium transition-colors relative",
            activeTab === 'consumption' ? "text-[#75AB61]" : "text-slate-400 hover:text-slate-200"
          )}
        >
          <span className="flex items-center gap-2"><TrendingUp size={16} /> Consumo Atual</span>
          {activeTab === 'consumption' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#75AB61]" />}
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={cn(
            "px-4 py-2.5 text-sm font-medium transition-colors relative",
            activeTab === 'history' ? "text-[#75AB61]" : "text-slate-400 hover:text-slate-200"
          )}
        >
          <span className="flex items-center gap-2"><FileText size={16} /> Histórico de Faturas</span>
          {activeTab === 'history' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#75AB61]" />}
        </button>
        <button
          onClick={() => setActiveTab('payment')}
          className={cn(
            "px-4 py-2.5 text-sm font-medium transition-colors relative",
            activeTab === 'payment' ? "text-[#75AB61]" : "text-slate-400 hover:text-slate-200"
          )}
        >
          <span className="flex items-center gap-2"><CreditCard size={16} /> Dados de Cobrança</span>
          {activeTab === 'payment' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#75AB61]" />}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pb-6">
        
        {/* TAB 1: Consumo Atual */}
        {activeTab === 'consumption' && (
          <div className="space-y-6 animate-in fade-in">
            {/* Gráfico */}
            <div className="card-surface p-5 rounded-xl border border-slate-700/50">
              <h3 className="text-sm font-bold text-white mb-4">Uso de Mensagens (Mês Corrente)</h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dailyUsageData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                    <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#f8fafc' }}
                      itemStyle={{ color: '#cbd5e1' }}
                    />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', color: '#94a3b8' }} />
                    <Bar dataKey="whatsapp" name="WhatsApp" stackId="a" fill="#25D366" radius={[0, 0, 4, 4]} />
                    <Bar dataKey="instagram" name="Instagram" stackId="a" fill="#E1306C" />
                    <Bar dataKey="web" name="Web/App" stackId="a" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Tabela */}
            <div className="card-surface rounded-xl border border-slate-700/50 overflow-hidden">
               <div className="p-4 border-b border-slate-700/50 flex items-center justify-between bg-[#0b1120]/50">
                 <h3 className="text-sm font-bold text-white">Detalhamento Recente</h3>
                 <span className="text-xs text-slate-400">Exibindo as últimas 5 interações</span>
               </div>
               <div className="overflow-x-auto">
                 <table className="w-full text-left border-collapse">
                   <thead>
                     <tr className="border-b border-slate-700/50 bg-[#0b1120]/30">
                       <th className="p-4 text-xs font-semibold text-slate-400">Data e Hora</th>
                       <th className="p-4 text-xs font-semibold text-slate-400">Tipo de Interação</th>
                       <th className="p-4 text-xs font-semibold text-slate-400">Agente</th>
                       <th className="p-4 text-xs font-semibold text-slate-400">Canal</th>
                       <th className="p-4 text-xs font-semibold text-slate-400 text-right">Custo Estimado</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-700/50">
                     {mockDetailedConsumption.map((item) => (
                       <tr key={item.id} className="hover:bg-slate-800/20 transition-colors">
                         <td className="p-4 text-sm text-slate-300 whitespace-nowrap font-mono text-xs">{item.date}</td>
                         <td className="p-4 text-sm font-medium text-white whitespace-nowrap">{item.type}</td>
                         <td className="p-4 text-sm text-slate-300">{item.agent}</td>
                         <td className="p-4 text-sm text-slate-300">{item.channel}</td>
                         <td className="p-4 text-sm text-slate-400 font-mono text-right">{item.cost}</td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
            </div>
          </div>
        )}

        {/* TAB 2: Histórico de Faturas */}
        {activeTab === 'history' && (
          <div className="space-y-4 animate-in fade-in">
             <div className="card-surface rounded-xl border border-slate-700/50 overflow-hidden">
               <div className="divide-y divide-slate-700/50">
                 {mockInvoices.map((invoice) => (
                   <div key={invoice.id} className="group">
                     {/* Fatura Row */}
                     <div 
                       onClick={() => setExpandedInvoice(expandedInvoice === invoice.id ? null : invoice.id)}
                       className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-800/30 transition-colors cursor-pointer"
                     >
                       <div className="flex items-center gap-4">
                         <div className="w-10 h-10 rounded-full bg-[#75AB61]/10 flex items-center justify-center text-[#75AB61] shrink-0">
                           <FileText size={18} />
                         </div>
                         <div>
                           <div className="flex items-center gap-2">
                             <h4 className="font-bold text-white">{invoice.period}</h4>
                             <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#75AB61]/20 text-[#75AB61] border border-[#75AB61]/30">
                               Pago
                             </span>
                           </div>
                           <p className="text-xs text-slate-400 mt-1 font-mono">{invoice.id}</p>
                         </div>
                       </div>
                       
                       <div className="flex items-center gap-6 sm:gap-12">
                         <div className="text-right">
                           <p className="text-xs text-slate-400">Valor</p>
                           <p className="font-bold text-white">{invoice.value}</p>
                         </div>
                         <div className="text-right hidden sm:block">
                           <p className="text-xs text-slate-400">Data Pagto.</p>
                           <p className="font-medium text-slate-300">{invoice.paymentDate}</p>
                         </div>
                         <div className="flex items-center gap-2">
                           <button 
                             onClick={(e) => e.stopPropagation()}
                             className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors border border-slate-700 bg-slate-800"
                             title="Baixar Fatura"
                           >
                             <Download size={16} />
                           </button>
                           <div className="p-1 text-slate-500">
                             {expandedInvoice === invoice.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                           </div>
                         </div>
                       </div>
                     </div>

                     {/* Expandable Detalhamento */}
                     {expandedInvoice === invoice.id && (
                       <div className="bg-[#0b1120]/50 p-5 border-t border-slate-700/50 max-w-4xl animate-in slide-in-from-top-2">
                         <h5 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Detalhamento da Fatura</h5>
                         <div className="space-y-2 text-sm text-slate-300">
                           <div className="flex justify-between py-2 border-b border-slate-700/50">
                             <span>Plano Enterprise (Base)</span>
                             <span className="font-mono">R$ 1.200,00</span>
                           </div>
                           <div className="flex justify-between py-2 border-b border-slate-700/50">
                             <span>Excedente: {Math.floor(Math.random() * 5000)} mensagens</span>
                             <span className="font-mono">R$ {Math.floor(Math.random() * 400).toLocaleString('pt-BR')},00</span>
                           </div>
                           <div className="flex justify-between py-2 border-b border-slate-700/50">
                             <span>WhatsApp (Meta) - {Math.floor(Math.random() * 10000)} envios MKT</span>
                             <span className="font-mono">R$ {Math.floor(Math.random() * 300).toLocaleString('pt-BR')},00</span>
                           </div>
                           <div className="flex justify-between py-2 font-bold text-white pt-4">
                             <span>Total</span>
                             <span className="font-mono">{invoice.value}</span>
                           </div>
                         </div>
                       </div>
                     )}
                   </div>
                 ))}
               </div>
             </div>
          </div>
        )}

        {/* TAB 3: Dados de Cobrança */}
        {activeTab === 'payment' && (
          <div className="max-w-4xl space-y-6 animate-in fade-in">
            {/* Dados da Empresa */}
            <div className="card-surface p-6 rounded-xl border border-slate-700/50">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-slate-800 border border-slate-700 text-slate-400">
                    <Building size={20} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">Dados da Empresa</h3>
                    <p className="text-xs text-slate-400">Informações que constarão na Nota Fiscal</p>
                  </div>
                </div>
                <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-bold rounded-lg border border-slate-600 transition-colors">
                  Atualizar Dados
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Razão Social</label>
                  <p className="text-sm text-slate-200 font-medium">Tech Solutions AI Ltda</p>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">CNPJ</label>
                  <p className="text-sm text-slate-200 font-medium font-mono">45.123.456/0001-99</p>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1 flex items-center gap-1.5">
                    <MapPin size={12} /> Endereço de Cobrança
                  </label>
                  <p className="text-sm text-slate-200">Av. Paulista, 1000 - Conj 501 - Bela Vista, São Paulo - SP, 01310-100</p>
                </div>
              </div>
            </div>

            {/* Forma de Pagamento */}
            <div className="card-surface p-6 rounded-xl border border-slate-700/50">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-slate-800 border border-slate-700 text-slate-400">
                    <CardIcon size={20} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">Forma de Pagamento</h3>
                    <p className="text-xs text-slate-400">Método principal para faturamento mensal</p>
                  </div>
                </div>
                <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-bold rounded-lg border border-slate-600 transition-colors">
                  Trocar Cartão
                </button>
              </div>

              <div className="flex items-center gap-4 bg-[#0b1120]/50 p-4 rounded-lg border border-slate-700/50 inline-flex min-w-[300px]">
                <div className="w-12 h-8 bg-gradient-to-br from-slate-200 to-slate-400 rounded flex items-center justify-center relative overflow-hidden">
                  <div className="absolute right-1 bottom-1 w-5 h-3 bg-red-500/80 rounded-full"></div>
                  <div className="absolute right-4 bottom-1 w-5 h-3 bg-yellow-500/80 rounded-full mix-blend-multiply"></div>
                </div>
                <div>
                  <p className="text-sm font-bold text-white tracking-widest">•••• •••• •••• 1234</p>
                  <p className="text-xs text-slate-400 mt-0.5">Expira em 12/2028</p>
                </div>
              </div>
            </div>

            <div className="flex justify-center pt-4">
              <a href="#" className="flex items-center gap-2 text-sm font-medium text-[#75AB61] hover:text-[#5f8c4e] transition-colors underline-offset-4 hover:underline">
                <AlertCircle size={16} /> Falar com Suporte Financeiro
              </a>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

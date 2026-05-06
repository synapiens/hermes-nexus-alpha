import React from 'react';
import { Users, MessageCircle, Target, Rocket, DollarSign, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { cn } from '../lib/utils';

const data = [
  { name: '01', leads: 400, convs: 240, vendas: 24 },
  { name: '05', leads: 300, convs: 139, vendas: 12 },
  { name: '10', leads: 200, convs: 980, vendas: 22 },
  { name: '15', leads: 278, convs: 390, vendas: 51 },
  { name: '20', leads: 189, convs: 480, vendas: 19 },
  { name: '25', leads: 239, convs: 380, vendas: 45 },
  { name: '30', leads: 349, convs: 430, vendas: 30 },
];

function KpiCard({ title, value, icon: Icon, trend, trendUp }: any) {
  return (
    <div className="card-surface rounded-xl p-5 border-l-2 border-l-[#75AB61]">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-slate-400">{title}</p>
          <h3 className="text-2xl font-bold text-white mt-1">{value}</h3>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#75AB61]/10 text-[#75AB61]">
          <Icon size={20} />
        </div>
      </div>
      <div className="mt-4 flex items-center gap-1.5 text-sm">
        {trendUp ? (
          <span className="text-[#75AB61] flex items-center"><ArrowUpRight size={16} />{trend}</span>
        ) : (
          <span className="text-red-400 flex items-center"><ArrowDownRight size={16} />{trend}</span>
        )}
        <span className="text-slate-500">vs. mês anterior</span>
      </div>
    </div>
  );
}

export function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard Geral</h1>
          <p className="text-slate-400 text-sm mt-1">Visão executiva do desempenho da plataforma</p>
        </div>
        <select className="bg-slate-800/50 border border-slate-700 text-white text-sm rounded-lg focus:ring-[#75AB61] focus:border-[#75AB61] block p-2.5">
          <option>Últimos 30 dias</option>
          <option>Este Mês</option>
          <option>Últimos 7 dias</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <KpiCard title="Total de Leads" value="12.450" icon={Users} trend="12.5%" trendUp={true} />
        <KpiCard title="Conversas Ativas" value="342" icon={MessageCircle} trend="5.2%" trendUp={true} />
        <KpiCard title="Taxa Conversão" value="18.3%" icon={Target} trend="2.1%" trendUp={false} />
        <KpiCard title="Disparos (MKT)" value="45.2k" icon={Rocket} trend="34.5%" trendUp={true} />
        <KpiCard title="Receita Gerada" value="R$ 142k" icon={DollarSign} trend="14.2%" trendUp={true} />
      </div>

      <div className="card-surface rounded-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-white">Linha do Tempo de Atividade</h3>
          <div className="flex gap-2">
            <span className="flex items-center gap-1.5 text-xs text-slate-300">
              <span className="w-3 h-3 rounded-full bg-[#A2C794]"></span> Leads
            </span>
            <span className="flex items-center gap-1.5 text-xs text-slate-300">
              <span className="w-3 h-3 rounded-full bg-[#75AB61]"></span> Vendas
            </span>
          </div>
        </div>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#A2C794" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#A2C794" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorVendas" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#75AB61" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#75AB61" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a3341" vertical={false} />
              <XAxis dataKey="name" stroke="#64748b" tick={{fill: '#64748b', fontSize: 12}} tickLine={false} axisLine={false} />
              <YAxis stroke="#64748b" tick={{fill: '#64748b', fontSize: 12}} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1A1A2E', borderColor: '#2a3341', borderRadius: '8px' }}
                itemStyle={{ color: '#fff' }}
              />
              <Area type="monotone" dataKey="leads" stroke="#A2C794" fillOpacity={1} fill="url(#colorLeads)" />
              <Area type="monotone" dataKey="vendas" stroke="#75AB61" fillOpacity={1} fill="url(#colorVendas)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card-surface rounded-xl p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold text-white mb-4">Status dos Agentes</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-white text-sm">SDR</span>
                <span className="flex h-2 w-2 rounded-full bg-[#75AB61] animate-pulse"></span>
              </div>
              <p className="text-xs text-slate-400">1.240 interações hoje</p>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-white text-sm">Conhecimento</span>
                <span className="flex h-2 w-2 rounded-full bg-[#75AB61] animate-pulse"></span>
              </div>
              <p className="text-xs text-slate-400">842 consultas hoje</p>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-white text-sm">Disparador</span>
                <span className="flex h-2 w-2 rounded-full bg-slate-500"></span>
              </div>
              <p className="text-xs text-slate-400">Pausado</p>
            </div>
          </div>
        </div>
        
        <div className="card-surface rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Origem dos Leads</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-300">WhatsApp</span>
                <span className="text-white font-medium">65%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5">
                <div className="bg-[#75AB61] h-1.5 rounded-full" style={{ width: '65%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-300">Instagram</span>
                <span className="text-white font-medium">25%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5">
                <div className="bg-purple-500 h-1.5 rounded-full" style={{ width: '25%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-300">Web</span>
                <span className="text-white font-medium">10%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5">
                <div className="bg-blue-400 h-1.5 rounded-full" style={{ width: '10%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

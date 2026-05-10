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
    <div className="card-surface rounded-xl p-5 border-l-2 border-l-brand-primary">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-[10px] uppercase font-bold text-brand-muted tracking-wider">{title}</p>
          <h3 className="text-2xl font-bold text-brand-light mt-1 font-display">{value}</h3>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-primary/10 text-brand-primary">
          <Icon size={20} />
        </div>
      </div>
      <div className="mt-4 flex items-center gap-1.5 text-[11px] font-bold">
        {trendUp ? (
          <span className="text-status-success flex items-center tracking-tight"><ArrowUpRight size={14} className="mr-0.5" />{trend}</span>
        ) : (
          <span className="text-status-failure flex items-center tracking-tight"><ArrowDownRight size={14} className="mr-0.5" />{trend}</span>
        )}
        <span className="text-brand-muted/60 uppercase font-medium">vs. anterior</span>
      </div>
    </div>
  );
}

export function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-brand-light font-display">Dashboard Geral</h1>
          <p className="text-brand-muted text-sm mt-1">Visão executiva do desempenho da plataforma</p>
        </div>
        <select className="bg-surface-muted/50 border border-surface-border text-brand-light text-sm rounded-lg focus:ring-brand-primary focus:border-brand-primary block p-2.5 outline-none transition-all">
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
          <h3 className="text-lg font-bold text-brand-light font-display">Linha do Tempo de Atividade</h3>
          <div className="flex gap-4">
            <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-brand-muted">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-muted"></span> Leads
            </span>
            <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-brand-muted">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-primary"></span> Vendas
            </span>
          </div>
        </div>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8F9E85" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#8F9E85" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorVendas" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2A4B33" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#2A4B33" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(143, 158, 133, 0.1)" vertical={false} />
              <XAxis dataKey="name" stroke="#8F9E85" tick={{fill: '#8F9E85', fontSize: 10}} tickLine={false} axisLine={false} />
              <YAxis stroke="#8F9E85" tick={{fill: '#8F9E85', fontSize: 10}} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#161617', borderColor: 'rgba(143, 158, 133, 0.2)', borderRadius: '12px' }}
                itemStyle={{ color: '#F2EFE6', fontSize: '12px' }}
              />
              <Area type="monotone" dataKey="leads" stroke="#8F9E85" strokeWidth={2} fillOpacity={1} fill="url(#colorLeads)" />
              <Area type="monotone" dataKey="vendas" stroke="#2A4B33" strokeWidth={2} fillOpacity={1} fill="url(#colorVendas)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card-surface rounded-xl p-6 lg:col-span-2">
          <h3 className="text-lg font-bold text-brand-light font-display mb-4">Status dos Agentes</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-surface-muted/50 rounded-lg p-4 border border-surface-border">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-brand-light text-sm font-display tracking-tight">SDR</span>
                <span className="flex h-2 w-2 rounded-full bg-status-success animate-pulse shadow-[0_0_8px_rgba(82,245,206,0.5)]"></span>
              </div>
              <p className="text-[10px] text-brand-muted uppercase font-semibold">1.240 interações hoje</p>
            </div>
            <div className="bg-surface-muted/50 rounded-lg p-4 border border-surface-border">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-brand-light text-sm font-display tracking-tight">Conhecimento</span>
                <span className="flex h-2 w-2 rounded-full bg-status-success animate-pulse shadow-[0_0_8px_rgba(82,245,206,0.5)]"></span>
              </div>
              <p className="text-[10px] text-brand-muted uppercase font-semibold">842 consultas hoje</p>
            </div>
            <div className="bg-surface-muted/50 rounded-lg p-4 border border-surface-border">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-brand-light text-sm font-display tracking-tight">Disparador</span>
                <span className="flex h-2 w-2 rounded-full bg-brand-muted"></span>
              </div>
              <p className="text-[10px] text-brand-muted uppercase font-semibold">Pausado</p>
            </div>
          </div>
        </div>
        
        <div className="card-surface rounded-xl p-6">
          <h3 className="text-lg font-bold text-brand-light mb-4 font-display">Origem dos Leads</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-bold uppercase tracking-wider mb-2">
                <span className="text-brand-muted">WhatsApp</span>
                <span className="text-brand-light">65%</span>
              </div>
              <div className="w-full bg-surface-muted rounded-full h-1.5 overflow-hidden">
                <div className="bg-brand-primary h-full rounded-full" style={{ width: '65%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs font-bold uppercase tracking-wider mb-2">
                <span className="text-brand-muted">Instagram</span>
                <span className="text-brand-light">25%</span>
              </div>
              <div className="w-full bg-surface-muted rounded-full h-1.5 overflow-hidden">
                <div className="bg-brand-secondary h-full rounded-full" style={{ width: '25%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs font-bold uppercase tracking-wider mb-2">
                <span className="text-brand-muted">Web</span>
                <span className="text-brand-light">10%</span>
              </div>
              <div className="w-full bg-surface-muted rounded-full h-1.5 overflow-hidden">
                <div className="bg-brand-tertiary h-full rounded-full" style={{ width: '10%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

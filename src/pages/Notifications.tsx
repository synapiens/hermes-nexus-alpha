import React, { useState } from 'react';
import { 
  Bell, CheckCheck, Filter, CalendarDays, DollarSign, Users, MessageCircle, AlertTriangle, Target, Rocket, Settings, ChevronRight
} from 'lucide-react';
import { cn } from '../lib/utils';

type TabType = 'notifications' | 'settings';

const mockNotifications = [
  { id: 1, type: 'lead_qualified', title: 'Novo Lead Qualificado', message: 'Carlos Ferreira avançou para MQL pela qualificação do SDR.', time: 'há 10 min', isRead: false, icon: Users, color: 'text-blue-400', bg: 'bg-blue-400/20' },
  { id: 2, type: 'sale', title: 'Venda Concluída 🎉', message: 'O agente de conhecimento fechou o plano Enterprise com Tech Solutions (R$ 25.000).', time: 'há 1 h', isRead: false, icon: DollarSign, color: 'text-[#75AB61]', bg: 'bg-[#75AB61]/20' },
  { id: 3, type: 'intervention', title: 'Intervenção Humana Necessária', message: 'Beatriz Souza fez uma pergunta técnica sobre API que o agente não sabe responder.', time: 'há 2 h', isRead: true, icon: MessageCircle, color: 'text-yellow-400', bg: 'bg-yellow-400/20' },
  { id: 4, type: 'hot_lead', title: 'Lead Quente Identificado', message: 'Fernanda Lima acessou a página de preços 3 vezes e pediu contato.', time: 'há 4 h', isRead: true, icon: Target, color: 'text-red-400', bg: 'bg-red-400/20' },
  { id: 5, type: 'error', title: 'Erro de Conexão', message: 'Webhook da RD Station falhou ao sincronizar os últimos 5 leads.', time: 'há 1 dia', isRead: true, icon: AlertTriangle, color: 'text-rose-500', bg: 'bg-rose-500/20' },
];

const alertTypes = [
  { id: 'lead_qualified', label: 'Lead qualificado pelo SDR', description: 'Seja avisado quando um novo lead for qualificado' },
  { id: 'sale', label: 'Venda concluída pelo Agente', description: 'Notificação de novas vendas ou fechamentos' },
  { id: 'intervention', label: 'Conversa requer intervenção', description: 'Quando o agente de IA escalar ou não souber responder' },
  { id: 'hot_lead', label: 'Lead com alta temperatura', description: 'Leads que demonstraram forte intenção de compra' },
  { id: 'error', label: 'Erro de conexão de canal', description: 'Falhas em webhooks, WhatsApp ou Instagram' },
  { id: 'goal', label: 'Meta de conversão atingida', description: 'Avisos sobre atingimento de metas da semana/mês' },
  { id: 'campaign', label: 'Campanha de disparo concluída', description: 'Resumo e métricas após finalizar um disparo em massa' },
];

export function Notifications() {
  const [activeTab, setActiveTab] = useState<TabType>('notifications');
  const [notifications, setNotifications] = useState(mockNotifications);
  
  // Settings State
  const [alertSettings, setAlertSettings] = useState<Record<string, { enabled: boolean, channel: string, target: string }>>(
    alertTypes.reduce((acc, curr) => ({
      ...acc,
      [curr.id]: { enabled: curr.id === 'intervention' || curr.id === 'error', channel: 'platform', target: '' }
    }), {})
  );

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  const handleSettingChange = (id: string, field: string, value: any) => {
    setAlertSettings(prev => ({
      ...prev,
      [id]: { ...prev[id], [field]: value }
    }));
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Notificações e Alertas</h1>
          <p className="text-slate-400 text-sm mt-1">Acompanhe eventos importantes e configure avisos da plataforma</p>
        </div>
        {activeTab === 'notifications' && (
          <div className="flex items-center gap-2">
            <button 
              onClick={markAllAsRead}
              className="flex items-center gap-2 bg-slate-800/50 hover:bg-slate-700 text-slate-300 px-3 py-2 rounded-lg text-sm transition-colors border border-slate-700"
            >
              <CheckCheck size={16} /> Marcar todas como lidas
            </button>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-slate-700/50">
        <button
          onClick={() => setActiveTab('notifications')}
          className={cn(
            "px-4 py-2.5 text-sm font-medium transition-colors relative",
            activeTab === 'notifications' ? "text-[#75AB61]" : "text-slate-400 hover:text-slate-200"
          )}
        >
          <span className="flex items-center gap-2"><Bell size={16} /> Central de Notificações</span>
          {activeTab === 'notifications' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#75AB61]" />}
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={cn(
            "px-4 py-2.5 text-sm font-medium transition-colors relative",
            activeTab === 'settings' ? "text-[#75AB61]" : "text-slate-400 hover:text-slate-200"
          )}
        >
          <span className="flex items-center gap-2"><Settings size={16} /> Configuração de Alertas</span>
          {activeTab === 'settings' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#75AB61]" />}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pb-6">
        {activeTab === 'notifications' ? (
          <div className="space-y-4">
             {/* Filters */}
             <div className="flex flex-col sm:flex-row gap-3 mb-6">
               <div className="relative">
                 <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                 <select className="pl-9 pr-4 py-2 bg-[#0b1120] border border-slate-700 rounded-lg text-sm text-white focus:border-[#75AB61] focus:outline-none appearance-none">
                   <option>Todos os tipos</option>
                   <option>Vendas</option>
                   <option>Leads Qualificados</option>
                   <option>Intervenções</option>
                   <option>Erros</option>
                 </select>
               </div>
               <div className="relative">
                 <CalendarDays size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                 <select className="pl-9 pr-4 py-2 bg-[#0b1120] border border-slate-700 rounded-lg text-sm text-white focus:border-[#75AB61] focus:outline-none appearance-none">
                   <option>Últimos 7 dias</option>
                   <option>Hoje</option>
                   <option>Últimos 30 dias</option>
                 </select>
               </div>
             </div>

             {/* Notifications List */}
             <div className="card-surface border border-slate-700/50 rounded-xl overflow-hidden">
               <div className="divide-y divide-slate-700/50">
                 {notifications.map(notification => (
                   <div 
                     key={notification.id} 
                     className={cn(
                       "p-4 flex gap-4 hover:bg-slate-800/30 transition-colors cursor-pointer relative",
                       !notification.isRead && "bg-slate-800/20"
                     )}
                   >
                     {!notification.isRead && (
                       <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#75AB61]"></div>
                     )}
                     <div className={cn("w-10 h-10 rounded-full flex items-center justify-center shrink-0", notification.bg, notification.color)}>
                       <notification.icon size={18} />
                     </div>
                     <div className="flex-1 min-w-0">
                       <div className="flex justify-between items-start mb-1">
                         <h4 className={cn("text-sm font-bold truncate", notification.isRead ? "text-slate-200" : "text-white")}>{notification.title}</h4>
                         <span className="text-xs text-slate-500 whitespace-nowrap ml-2 font-mono">{notification.time}</span>
                       </div>
                       <p className="text-sm text-slate-400 line-clamp-2">{notification.message}</p>
                     </div>
                     <div className="flex items-center justify-center opacity-0 group-hover:opacity-100 text-slate-500">
                        <ChevronRight size={18} />
                     </div>
                   </div>
                 ))}
               </div>
             </div>
          </div>
        ) : (
          <div className="max-w-4xl space-y-4">
             {alertTypes.map(type => (
               <div key={type.id} className="card-surface p-5 rounded-xl border border-slate-700/50">
                 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                   <div>
                     <h3 className="font-bold text-white mb-1">{type.label}</h3>
                     <p className="text-sm text-slate-400">{type.description}</p>
                   </div>
                   <label className="relative inline-flex items-center cursor-pointer shrink-0">
                     <input 
                       type="checkbox" 
                       className="sr-only peer" 
                       checked={alertSettings[type.id].enabled}
                       onChange={(e) => handleSettingChange(type.id, 'enabled', e.target.checked)}
                     />
                     <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#75AB61]"></div>
                   </label>
                 </div>

                 {alertSettings[type.id].enabled && (
                   <div className="bg-[#0b1120]/50 p-4 rounded-lg border border-slate-700/30 flex flex-col sm:flex-row gap-4 mt-4 animate-in fade-in slide-in-from-top-2">
                     <div className="flex-1">
                       <label className="block text-xs text-slate-400 font-bold mb-1.5 uppercase tracking-wide">Canal de Entrega</label>
                       <select 
                         className="w-full h-10 px-3 bg-slate-800 border border-slate-600 rounded-lg text-sm text-white focus:border-[#75AB61] focus:outline-none"
                         value={alertSettings[type.id].channel}
                         onChange={(e) => handleSettingChange(type.id, 'channel', e.target.value)}
                       >
                         <option value="platform">Somente na Plataforma (Sino)</option>
                         <option value="email">E-mail</option>
                         <option value="whatsapp">WhatsApp</option>
                       </select>
                     </div>
                     
                     {alertSettings[type.id].channel !== 'platform' && (
                       <div className="flex-1">
                         <label className="block text-xs text-slate-400 font-bold mb-1.5 uppercase tracking-wide">
                            {alertSettings[type.id].channel === 'email' ? 'Endereço de E-mail' : 'Número do WhatsApp'}
                         </label>
                         <input 
                           type={alertSettings[type.id].channel === 'email' ? 'email' : 'text'}
                           placeholder={alertSettings[type.id].channel === 'email' ? 'exemplo@empresa.com' : '+55 11 99999-9999'}
                           className="w-full h-10 px-3 bg-slate-800 border border-slate-600 rounded-lg text-sm text-white focus:border-[#75AB61] focus:outline-none"
                           value={alertSettings[type.id].target}
                           onChange={(e) => handleSettingChange(type.id, 'target', e.target.value)}
                         />
                       </div>
                     )}
                   </div>
                 )}
               </div>
             ))}
          </div>
        )}
      </div>
    </div>
  );
}

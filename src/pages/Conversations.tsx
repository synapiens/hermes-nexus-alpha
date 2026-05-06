import React from 'react';
import { Search, Filter, MessageCircle, Bot, User, ThumbsUp, Edit2, Send } from 'lucide-react';
import { cn } from '../lib/utils';

export function Conversations() {
  const [activeTab, setActiveTab] = React.useState('chat');

  return (
    <div className="h-[calc(100vh-8rem)] flex gap-4">
      {/* Coluna Esquerda: Lista de conversas */}
      <div className="w-[350px] shrink-0 card-surface rounded-xl flex flex-col border border-[#75AB61]/20 overflow-hidden">
        <div className="p-4 border-b border-[#75AB61]/20">
          <h2 className="text-lg font-bold text-white mb-3">Conversas</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Buscar nas conversas..."
              className="w-full h-9 rounded-lg border border-slate-700 bg-slate-800/50 pl-9 pr-4 text-sm text-white placeholder-slate-400 focus:border-[#75AB61] focus:outline-none focus:ring-1 focus:ring-[#75AB61]"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className={cn(
              "p-4 border-b border-slate-800 cursor-pointer hover:bg-slate-800/50 transition-colors",
              i === 1 && "bg-slate-800/50 border-l-2 border-l-[#75AB61]"
            )}>
              <div className="flex justify-between items-start mb-1">
                <span className="font-medium text-white text-sm flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#75AB61]"></div>
                  Carlos Ferreira
                </span>
                <span className="text-xs text-slate-500">10:45</span>
              </div>
              <p className="text-xs text-slate-400 truncate pr-4">Entendi, como funciona a garantia?</p>
              <div className="flex gap-2 mt-2">
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">SDR</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-900/30 text-emerald-400 border border-emerald-800/50">WhatsApp</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Coluna Direita: Painel Principal */}
      <div className="flex-1 card-surface rounded-xl flex flex-col border border-[#75AB61]/20 overflow-hidden">
        {/* Header do Chat */}
        <div className="h-16 border-b border-[#75AB61]/20 px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#75AB61]/20 flex items-center justify-center text-[#75AB61] font-bold">CF</div>
            <div>
              <h2 className="font-bold text-white leading-tight">Carlos Ferreira</h2>
              <div className="text-xs text-slate-400 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Online no WhatsApp
              </div>
            </div>
          </div>
          <div className="flex bg-slate-800/50 p-1 border border-slate-700 rounded-lg">
            <button 
              onClick={() => setActiveTab('chat')}
              className={cn("px-3 py-1.5 text-xs font-medium rounded-md transition-colors", activeTab === 'chat' ? "bg-slate-700 text-white" : "text-slate-400 hover:text-white")}
            >
              Chat
            </button>
            <button 
              onClick={() => setActiveTab('retreino')}
              className={cn("px-3 py-1.5 text-xs font-medium rounded-md transition-colors", activeTab === 'retreino' ? "bg-slate-700 text-white" : "text-slate-400 hover:text-white")}
            >
              Retreino (1)
            </button>
          </div>
        </div>

        {/* Área de Mensagens */}
        {activeTab === 'chat' ? (
          <>
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Msg Lead */}
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-slate-700 flex shrink-0 items-center justify-center text-xs font-bold text-white">CF</div>
                <div className="max-w-[70%]">
                  <div className="bg-slate-800 p-3 rounded-2xl rounded-tl-sm text-sm text-slate-200">
                    Olá, tenho interesse no plano Enterprise. Como funciona?
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 block">10:40</span>
                </div>
              </div>

              {/* Msg IA */}
              <div className="flex gap-4 flex-row-reverse">
                <div className="w-8 h-8 rounded-full brand-gradient flex shrink-0 items-center justify-center text-[#0b1120]">
                  <Bot size={16} />
                </div>
                <div className="max-w-[70%] flex flex-col items-end">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] text-slate-400">Agente SDR</span>
                  </div>
                  <div className="bg-[#75AB61]/10 border border-[#75AB61]/20 p-3 rounded-2xl rounded-tr-sm text-sm text-slate-200 relative group">
                    Olá Carlos! Ótima escolha. O plano Enterprise inclui acesso completo à plataforma, suporte prioritário e onboarding dedicado. Você tem uma equipe de quantos atendentes atualmente?
                    <div className="absolute top-2 -left-16 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                      <button className="p-1.5 bg-slate-800 rounded-md text-slate-400 hover:text-white hover:bg-slate-700"><ThumbsUp size={14} /></button>
                      <button className="p-1.5 bg-slate-800 rounded-md text-slate-400 hover:text-white hover:bg-slate-700"><Edit2 size={14} /></button>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 block">10:41</span>
                </div>
              </div>

              {/* Msg Lead */}
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-slate-700 flex shrink-0 items-center justify-center text-xs font-bold text-white">CF</div>
                <div className="max-w-[70%]">
                  <div className="bg-slate-800 p-3 rounded-2xl rounded-tl-sm text-sm text-slate-200">
                    Somos 5 aqui. Entendi, como funciona a garantia?
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 block">10:45</span>
                </div>
              </div>
            </div>

            {/* Input / Ações */}
            <div className="p-4 border-t border-[#75AB61]/20 bg-slate-900/50">
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm font-medium border border-slate-700 transition-colors">
                  Assumir Conversa
                </button>
                <div className="relative flex-1">
                  <input 
                    type="text" 
                    placeholder="Digite uma observação interna..."
                    className="w-full h-full rounded-lg border border-slate-700 bg-slate-800/50 pl-4 pr-10 text-sm text-white placeholder-slate-400 focus:border-[#75AB61] focus:outline-none focus:ring-1 focus:ring-[#75AB61]"
                    disabled
                  />
                  <button className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white" disabled>
                    <Send size={16} />
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 p-6 overflow-auto">
            <h3 className="text-white font-medium mb-4">Fila de Retreino</h3>
            <div className="border border-yellow-500/20 bg-yellow-500/5 rounded-lg p-4">
              <p className="text-sm text-slate-300 mb-3"><span className="text-yellow-500 font-medium">Original:</span> O plano Enterprise custa R$ 999 mensais.</p>
              <div className="relative mb-3">
                <textarea 
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm text-white focus:border-[#75AB61] focus:outline-none focus:ring-1 focus:ring-[#75AB61]"
                  rows={2}
                  defaultValue="O plano Enterprise requer orçamento sob medida, fale com nossos consultores."
                ></textarea>
                <span className="absolute top-3 right-3 text-xs text-[#75AB61] bg-[#75AB61]/10 px-2 py-0.5 rounded">Correção</span>
              </div>
              <button className="bg-[#75AB61] text-[#0b1120] px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90">
                Aprovar & Enviar para Retreino
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

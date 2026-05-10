import React from 'react';
import { Search, Filter, MessageCircle, Bot, User, ThumbsUp, Edit2, Send } from 'lucide-react';
import { cn } from '../lib/utils';

export function Conversations() {
  const [activeTab, setActiveTab] = React.useState('chat');

  return (
    <div className="h-[calc(100vh-8rem)] flex gap-4">
      {/* Coluna Esquerda: Lista de conversas */}
      <div className="w-[350px] shrink-0 card-surface rounded-2xl flex flex-col border border-surface-border overflow-hidden bg-surface-base/50 backdrop-blur-sm">
        <div className="p-5 border-b border-surface-border">
          <h2 className="text-base font-bold text-brand-light mb-4 font-display">Conversas</h2>
          <div className="relative group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-muted transition-colors group-focus-within:text-brand-primary" size={16} />
            <input 
              type="text" 
              placeholder="Buscar nas conversas..."
              className="w-full h-10 rounded-xl border border-surface-border bg-surface-muted/30 pl-10 pr-4 text-xs text-brand-light placeholder-brand-muted/40 focus:border-brand-primary/50 focus:outline-none focus:ring-1 focus:ring-brand-primary/30 transition-all font-medium"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className={cn(
              "p-5 border-b border-surface-border/50 cursor-pointer hover:bg-surface-muted/20 transition-all group",
              i === 1 && "bg-brand-primary/5 border-l-4 border-l-brand-primary"
            )}>
              <div className="flex justify-between items-start mb-2">
                <span className={cn("font-bold text-sm flex items-center gap-2 font-display", i === 1 ? "text-brand-light" : "text-brand-muted group-hover:text-brand-light")}>
                  <div className={cn("w-2 h-2 rounded-full", i === 1 ? "bg-brand-primary shadow-[0_0_8px_rgba(42,75,51,0.5)]" : "bg-brand-muted/30")}></div>
                  Carlos Ferreira
                </span>
                <span className="text-[10px] font-bold text-brand-muted/50 uppercase">10:45</span>
              </div>
              <p className="text-xs text-brand-muted truncate pr-4 font-medium leading-relaxed">Entendi, como funciona a garantia?</p>
              <div className="flex gap-2 mt-3">
                <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded-lg bg-surface-muted/50 text-brand-muted border border-surface-border">SDR</span>
                <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded-lg bg-brand-secondary/10 text-brand-secondary border border-brand-secondary/20">WhatsApp</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Coluna Direita: Painel Principal */}
      <div className="flex-1 card-surface rounded-2xl flex flex-col border border-surface-border overflow-hidden bg-surface-base/50 backdrop-blur-sm">
        {/* Header do Chat */}
        <div className="h-20 border-b border-surface-border px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary font-bold text-lg font-display">CF</div>
            <div>
              <h2 className="font-bold text-brand-light text-base font-display">Carlos Ferreira</h2>
              <div className="text-[10px] text-brand-muted font-bold uppercase tracking-wider flex items-center gap-2 mt-1">
                <span className="w-2 h-2 rounded-full bg-status-success shadow-[0_0_8px_rgba(82,196,26,0.4)]"></span> Online no WhatsApp
              </div>
            </div>
          </div>
          <div className="flex bg-surface-muted/30 p-1.5 border border-surface-border rounded-xl">
            <button 
              onClick={() => setActiveTab('chat')}
              className={cn("px-4 py-2 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all", activeTab === 'chat' ? "bg-brand-primary text-brand-on-primary shadow-lg" : "text-brand-muted hover:text-brand-light")}
            >
              Chat
            </button>
            <button 
              onClick={() => setActiveTab('retreino')}
              className={cn("px-4 py-2 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all ml-1", activeTab === 'retreino' ? "bg-brand-primary text-brand-on-primary shadow-lg" : "text-brand-muted hover:text-brand-light")}
            >
              Retreino (1)
            </button>
          </div>
        </div>

        {/* Área de Mensagens */}
        {activeTab === 'chat' ? (
          <>
            <div className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-thin scrollbar-thumb-surface-border">
              {/* Msg Lead */}
              <div className="flex gap-4 group">
                <div className="w-9 h-9 rounded-xl bg-surface-muted flex shrink-0 items-center justify-center text-xs font-bold text-brand-muted border border-surface-border group-hover:border-brand-primary/30 transition-colors uppercase font-display">CF</div>
                <div className="max-w-[70%]">
                  <div className="bg-surface-muted/50 border border-surface-border p-4 rounded-2xl rounded-tl-sm text-sm text-brand-light font-medium leading-relaxed shadow-sm">
                    Olá, tenho interesse no plano Enterprise. Como funciona?
                  </div>
                  <span className="text-[10px] font-bold text-brand-muted/40 mt-2 block uppercase tracking-wider px-1">10:40</span>
                </div>
              </div>

              {/* Msg IA */}
              <div className="flex gap-4 flex-row-reverse group">
                <div className="w-9 h-9 rounded-xl bg-brand-primary/20 border border-brand-primary/30 flex shrink-0 items-center justify-center text-brand-primary shadow-[0_0_15px_rgba(42,75,51,0.2)] group-hover:scale-110 transition-transform">
                  <Bot size={20} />
                </div>
                <div className="max-w-[70%] flex flex-col items-end">
                  <div className="flex items-center gap-2 mb-2 px-1">
                    <span className="text-[9px] font-bold text-brand-muted uppercase tracking-widest opacity-60">Agente SDR</span>
                  </div>
                  <div className="bg-brand-primary/10 border border-brand-primary/20 p-4 rounded-2xl rounded-tr-sm text-sm text-brand-light font-medium leading-relaxed relative group/msg shadow-sm">
                    Olá Carlos! Ótima escolha. O plano Enterprise inclui acesso completo à plataforma, suporte prioritário e onboarding dedicado. Você tem uma equipe de quantos atendentes atualmente?
                    <div className="absolute top-2 -left-20 opacity-0 group-hover/msg:opacity-100 transition-all flex gap-1.5 p-1 bg-surface-base/80 backdrop-blur-md rounded-xl border border-surface-border shadow-xl">
                      <button className="p-2 hover:bg-brand-primary/20 rounded-lg text-brand-muted hover:text-brand-primary transition-colors"><ThumbsUp size={14} /></button>
                      <button className="p-2 hover:bg-brand-primary/20 rounded-lg text-brand-muted hover:text-brand-primary transition-colors"><Edit2 size={14} /></button>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-brand-muted/40 mt-2 block uppercase tracking-wider px-1">10:41</span>
                </div>
              </div>

              {/* Msg Lead */}
              <div className="flex gap-4 group">
                <div className="w-9 h-9 rounded-xl bg-surface-muted flex shrink-0 items-center justify-center text-xs font-bold text-brand-muted border border-surface-border group-hover:border-brand-primary/30 transition-colors uppercase font-display">CF</div>
                <div className="max-w-[70%]">
                  <div className="bg-surface-muted/50 border border-surface-border p-4 rounded-2xl rounded-tl-sm text-sm text-brand-light font-medium leading-relaxed shadow-sm">
                    Somos 5 aqui. Entendi, como funciona a garantia?
                  </div>
                  <span className="text-[10px] font-bold text-brand-muted/40 mt-2 block uppercase tracking-wider px-1">10:45</span>
                </div>
              </div>
            </div>

            {/* Input / Ações */}
            <div className="p-6 border-t border-surface-border bg-surface-muted/10 backdrop-blur-md">
              <div className="flex gap-4">
                <button className="px-6 py-3 bg-surface-muted border border-surface-border hover:bg-surface-border text-brand-light rounded-xl text-xs font-bold uppercase tracking-widest transition-all hover:shadow-lg active:scale-95 shrink-0">
                  Assumir Conversa
                </button>
                <div className="relative flex-1 group">
                  <input 
                    type="text" 
                    placeholder="Digite uma observação interna..."
                    className="w-full h-12 rounded-xl border border-surface-border bg-surface-muted/30 pl-5 pr-12 text-sm text-brand-light placeholder-brand-muted/40 focus:border-brand-primary/50 focus:outline-none focus:ring-1 focus:ring-brand-primary/30 transition-all font-medium"
                    disabled
                  />
                  <button className="absolute right-3.5 top-1/2 -translate-y-1/2 text-brand-muted transition-colors" disabled>
                    <Send size={18} />
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 p-8 overflow-auto">
            <h3 className="text-brand-light font-bold text-base mb-6 font-display uppercase tracking-widest">Fila de Retreino</h3>
            <div className="border border-brand-tertiary/20 bg-brand-tertiary/5 rounded-2xl p-6 shadow-sm">
              <div className="mb-6">
                <span className="text-[9px] font-bold uppercase tracking-widest text-brand-tertiary block mb-2 px-1">Sentença Original</span>
                <p className="text-sm text-brand-muted leading-relaxed italic bg-surface-base/30 p-4 rounded-xl border border-brand-tertiary/10 font-medium">"O plano Enterprise custa R$ 999 mensais."</p>
              </div>
              <div className="relative mb-8">
                <span className="text-[9px] font-bold uppercase tracking-widest text-brand-primary block mb-2 px-1">Nova Orientação (Correção)</span>
                <textarea 
                  className="w-full bg-surface-muted/30 border border-surface-border rounded-xl p-5 text-sm text-brand-light focus:border-brand-primary/50 focus:outline-none focus:ring-1 focus:ring-brand-primary/30 transition-all placeholder-brand-muted/30 font-medium font-display leading-relaxed"
                  rows={3}
                  defaultValue="O plano Enterprise requer orçamento sob medida, fale com nossos consultores para uma proposta personalizada baseada em seu volume de atendimento."
                ></textarea>
                <span className="absolute top-10 right-4 text-[9px] font-bold text-brand-primary bg-brand-primary/10 px-3 py-1.5 rounded-lg border border-brand-primary/20 uppercase tracking-widest">Ajuste Manual</span>
              </div>
              <button className="w-full sm:w-auto bg-brand-primary text-brand-on-primary px-8 py-4 rounded-xl text-xs font-bold uppercase tracking-[0.2em] hover:bg-brand-primary/80 transition-all shadow-xl hover:shadow-brand-primary/20 active:scale-95 font-display">
                Aprovar & Treinar Modelo
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { Mail, Lock, Eye, EyeOff, Loader2, CheckCircle2, ArrowLeft, ShieldCheck, Sun, Moon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { cn } from '../lib/utils';
import { useTheme } from '../contexts/ThemeContext';

type ViewState = 'login' | 'recovery' | 'recovery_sent' | 'reset';

export function Login() {
  const { theme, toggleTheme } = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [view, setView] = useState<ViewState>('login');
  
  // Login Form
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Reset Form
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError(authError.message === 'Invalid login credentials' 
          ? 'E-mail ou senha incorretos. Tente novamente.' 
          : authError.message);
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError('Ocorreu um erro ao tentar entrar. Verifique sua conexão.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRecovery = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const { error: recoveryError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/login?view=reset`,
      });

      if (recoveryError) {
        setError(recoveryError.message);
      } else {
        setView('recovery_sent');
      }
    } catch (err) {
      setError('Erro ao enviar link de recuperação.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      setView('login');
      // Toast message would normally go here
    }, 1500);
  };

  // Password strength logic
  const getPasswordStrength = (pass: string) => {
    let score = 0;
    if (!pass) return { score: 0, text: '', color: 'bg-surface-muted' };
    if (pass.length > 7) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    switch (score) {
      case 0:
      case 1: return { score, text: 'Fraca', color: 'bg-status-failure' };
      case 2: return { score, text: 'Média', color: 'bg-brand-tertiary' };
      case 3: return { score, text: 'Forte', color: 'bg-brand-secondary' };
      case 4: return { score, text: 'Muito Forte', color: 'bg-brand-primary' };
      default: return { score: 0, text: '', color: 'bg-surface-muted' };
    }
  };

  const strength = getPasswordStrength(newPassword);

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-surface-base overflow-hidden transition-colors duration-300">
      {/* Theme Toggle in Login */}
      <div className="absolute top-6 right-6 z-20">
        <button 
          onClick={toggleTheme}
          className="p-3 rounded-2xl bg-surface-muted/30 border border-surface-border text-brand-muted hover:text-brand-light transition-all backdrop-blur-md"
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>

      {/* Background radial gradient and glowing elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--color-surface-muted),_var(--color-surface-base))] z-0 opacity-40"></div>
      
      {/* Subtle animated waves/connections representation */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] z-0 opacity-10 pointer-events-none">
        <div className="absolute inset-0 rounded-full border border-brand-primary/10 bg-brand-primary/5 blur-3xl animate-pulse" style={{ animationDuration: '4s' }}></div>
        <div className="absolute inset-[10%] rounded-full border border-brand-muted/20 bg-brand-muted/5 blur-2xl animate-pulse" style={{ animationDuration: '3s', animationDelay: '1s' }}></div>
      </div>
      
      <div className="relative z-10 w-full max-w-[420px] p-6 lg:p-8">
        <div className="mb-10 flex flex-col items-center">
          <img 
            src={theme === 'dark' 
              ? "https://raw.githubusercontent.com/synapiens/uteis/refs/heads/main/LogoHermes/logo_hermes_nexus_negat.png"
              : "https://raw.githubusercontent.com/synapiens/uteis/refs/heads/main/LogoHermes/logo_hermes_nexus.png"
            } 
            alt="Hermes Nexus" 
            className="h-[80px] object-contain mb-4 drop-shadow-[0_0_15px_rgba(42,75,51,0.4)]" 
          />
          <p className="text-brand-muted text-[10px] uppercase font-bold tracking-[0.2em] opacity-80">Acesso exclusivo à plataforma</p>
        </div>

        {/* Dynamic Card based on ViewState */}
        <div className={cn(
          "rounded-3xl p-8 sm:p-10 transition-all duration-300 relative backdrop-blur-2xl shadow-2xl",
          "bg-surface-base/80 border border-brand-primary/20",
          error ? "border-status-failure/50" : "border-brand-primary/30"
        )}>
          
          {/* LOGIN VIEW */}
          {view === 'login' && (
            <form onSubmit={handleLogin} className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
              <div className="space-y-5">
                <div>
                  <label className="block text-[10px] font-bold text-brand-muted mb-2 uppercase tracking-widest px-1">E-mail corporativo</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-brand-primary transition-colors group-focus-within:text-brand-secondary">
                      <Mail size={18} />
                    </div>
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={cn(
                        "block w-full rounded-2xl border bg-surface-muted/30 p-3.5 pl-11 text-sm text-brand-light placeholder-brand-muted/40 transition-all focus:outline-none focus:ring-1 focus:bg-surface-muted/50",
                        error ? "border-status-failure/50 focus:ring-status-failure/50" : "border-surface-border focus:ring-brand-primary/50 focus:border-brand-primary"
                      )}
                      placeholder="nome@empresa.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-brand-muted mb-2 uppercase tracking-widest px-1">Senha</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-brand-primary transition-colors group-focus-within:text-brand-secondary">
                      <Lock size={18} />
                    </div>
                    <input 
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={cn(
                        "block w-full rounded-2xl border bg-surface-muted/30 p-3.5 pl-11 pr-11 text-sm text-brand-light placeholder-brand-muted/40 transition-all focus:outline-none focus:ring-1 focus:bg-surface-muted/50",
                        error ? "border-status-failure/50 focus:ring-status-failure/50" : "border-surface-border focus:ring-brand-primary/50 focus:border-brand-primary"
                      )}
                      placeholder="Sua senha de acesso"
                      required
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-4 text-brand-muted hover:text-brand-light transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="text-status-failure text-[11px] font-bold uppercase tracking-tight bg-status-failure/10 p-3 rounded-xl border border-status-failure/20 text-center animate-in fade-in slide-in-from-top-1 font-display">
                    {error}
                  </div>
                )}

                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2.5 cursor-pointer group">
                    <div className="relative flex items-center justify-center w-5 h-5">
                      <input type="checkbox" className="peer appearance-none w-5 h-5 rounded-lg border border-surface-border bg-surface-muted/50 checked:bg-brand-primary checked:border-brand-primary transition-all focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 focus:ring-offset-surface-base" />
                      <CheckCircle2 size={14} className="absolute text-brand-light opacity-0 peer-checked:opacity-100 pointer-events-none" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-brand-muted group-hover:text-brand-light transition-colors">Lembrar</span>
                  </label>
                  <button 
                    type="button" 
                    onClick={() => { setView('recovery'); setError(''); }}
                    className="text-xs font-bold uppercase tracking-wider text-brand-muted hover:text-brand-primary transition-colors"
                  >
                    Esqueci a senha
                  </button>
                </div>
              </div>

              <div className="space-y-4 pt-2">
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="relative w-full overflow-hidden rounded-2xl bg-brand-primary hover:bg-brand-primary/80 px-5 py-4 text-xs font-bold uppercase tracking-[0.2em] text-brand-on-primary transition-all hover:shadow-[0_0_25px_rgba(42,75,51,0.5)] focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 focus:ring-offset-surface-base disabled:opacity-70 disabled:cursor-not-allowed group font-display"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-3">
                      <Loader2 size={18} className="animate-spin text-brand-on-primary" />
                      Autenticando...
                    </span>
                  ) : (
                    <span>Entrar na Plataforma</span>
                  )}
                </button>
                
                <button 
                  type="button" 
                  onClick={() => navigate('/dashboard')}
                  className="w-full rounded-2xl border border-dashed border-brand-primary/40 bg-brand-primary/5 px-5 py-3.5 text-[10px] font-bold uppercase tracking-[0.15em] text-brand-primary hover:bg-brand-primary/10 transition-all focus:outline-none flex items-center justify-center gap-2"
                >
                  Modo Desenvolvedor <span className="opacity-50">• Sem Senha</span>
                </button>
              </div>

              {/* Para testar o reset */}
              <button type="button" onClick={() => setView('reset')} className="w-full text-center text-[9px] uppercase font-bold tracking-widest text-brand-muted/30 hover:text-brand-muted/60 transition-colors mt-2">
                Simular Nova Senha
              </button>
            </form>
          )}

          {/* RECOVERY VIEW */}
          {view === 'recovery' && (
            <form onSubmit={handleRecovery} className="space-y-6 animate-in slide-in-from-right-4 fade-in duration-300">
              <button 
                type="button" 
                onClick={() => setView('login')}
                className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-brand-muted hover:text-brand-light transition-colors mb-4"
              >
                <ArrowLeft size={14} className="text-brand-primary" /> Voltar
              </button>
              
              <div>
                <h3 className="text-2xl font-bold text-brand-light mb-2 font-display">Recuperar acesso</h3>
                <p className="text-sm text-brand-muted leading-relaxed">Enviaremos um link de redefinição seguro para o seu e-mail corporativo.</p>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-brand-muted mb-2 uppercase tracking-widest px-1">E-mail corporativo</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-brand-primary">
                    <Mail size={18} />
                  </div>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full rounded-2xl border border-surface-border bg-surface-muted/30 p-3.5 pl-11 text-sm text-brand-light placeholder-brand-muted/40 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all outline-none" 
                    placeholder="nome@empresa.com"
                    required
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full rounded-2xl bg-brand-primary hover:bg-brand-primary/80 px-5 py-4 text-xs font-bold uppercase tracking-[0.2em] text-brand-on-primary transition-all hover:shadow-[0_0_25px_rgba(42,75,51,0.5)] disabled:opacity-70 disabled:cursor-not-allowed font-display"
              >
                {isLoading ? (
                  <Loader2 size={18} className="animate-spin text-brand-on-primary mx-auto" />
                ) : (
                  <span>Enviar Instruções</span>
                )}
              </button>
            </form>
          )}

          {/* RECOVERY SENT SUCCESS */}
          {view === 'recovery_sent' && (
            <div className="space-y-8 text-center py-6 animate-in zoom-in-95 fade-in duration-300">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-brand-primary/10 text-brand-primary mb-2 shadow-inner border border-brand-primary/20">
                <CheckCircle2 size={40} />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-brand-light mb-3 font-display">E-mail enviado!</h3>
                <p className="text-sm text-brand-muted leading-relaxed">
                  Verifique sua caixa de entrada em <strong>{email}</strong> para prosseguir com a redefinição.
                </p>
              </div>
              <button 
                onClick={() => setView('login')}
                className="w-full rounded-2xl bg-surface-muted hover:bg-surface-border px-5 py-4 text-[10px] font-bold uppercase tracking-widest text-brand-light transition-all border border-surface-border"
              >
                Retornar ao Login
              </button>
            </div>
          )}

          {/* RESET PASSWORD VIEW */}
          {view === 'reset' && (
            <form onSubmit={handleReset} className="space-y-6 animate-in slide-in-from-right-4 fade-in duration-300">
              <button 
                type="button" 
                onClick={() => setView('login')}
                className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-brand-muted hover:text-brand-light transition-colors mb-2"
              >
                <ArrowLeft size={14} className="text-brand-primary" /> Cancelar
              </button>

              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2.5 rounded-xl bg-brand-primary/10 border border-brand-primary/20">
                    <ShieldCheck className="text-brand-primary" size={24} />
                  </div>
                  <h3 className="text-2xl font-bold text-brand-light font-display">Nova senha</h3>
                </div>
                <p className="text-sm text-brand-muted leading-relaxed">Defina uma credencial forte e única para garantir a segurança da conta.</p>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-[10px] font-bold text-brand-muted mb-2 uppercase tracking-widest px-1">Nova Senha</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-brand-primary">
                      <Lock size={18} />
                    </div>
                    <input 
                      type={showPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="block w-full rounded-2xl border border-surface-border bg-surface-muted/30 p-3.5 pl-11 pr-11 text-sm text-brand-light placeholder-brand-muted/40 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none transition-all" 
                      placeholder="Mínimo 8 caracteres"
                      required
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-4 text-brand-muted hover:text-brand-light transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  
                  {/* Strength Indicator */}
                  {newPassword && (
                    <div className="mt-3.5 space-y-2 animate-in fade-in">
                      <div className="flex gap-1.5 h-1.5">
                        {[1, 2, 3, 4].map((level) => (
                          <div 
                            key={level} 
                            className={cn(
                              "flex-1 rounded-full transition-all duration-500",
                              strength.score >= level ? strength.color : "bg-surface-muted/50 shadow-inner"
                            )}
                          />
                        ))}
                      </div>
                      <div className="flex justify-between items-center text-[10px] px-1">
                        <span className="text-brand-muted/60 font-bold uppercase tracking-tighter">Nível de Segurança</span>
                        <span className={cn("font-bold uppercase tracking-wider", strength.color.replace('bg-', 'text-'))}>{strength.text}</span>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-brand-muted mb-2 uppercase tracking-widest px-1">Confirmar Senha</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-brand-primary">
                      <Lock size={18} />
                    </div>
                    <input 
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={cn(
                        "block w-full rounded-2xl border bg-surface-muted/30 p-3.5 pl-11 pr-11 text-sm text-brand-light placeholder-brand-muted/40 transition-all focus:outline-none focus:ring-1 focus:bg-surface-muted/50",
                        error ? "border-status-failure/50 focus:ring-status-failure/50" : "border-surface-border focus:ring-brand-primary/50 focus:border-brand-primary"
                      )}
                      placeholder="Repita a nova senha"
                      required
                    />
                    <button 
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-4 text-brand-muted hover:text-brand-light transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="text-status-failure text-[11px] font-bold uppercase tracking-tight bg-status-failure/10 p-3 rounded-xl border border-status-failure/20 text-center font-display">
                    {error}
                  </div>
                )}
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full rounded-2xl bg-brand-primary hover:bg-brand-primary/80 px-5 py-4 text-xs font-bold uppercase tracking-[0.2em] text-brand-on-primary transition-all shadow-lg hover:shadow-[0_0_25px_rgba(42,75,51,0.5)] disabled:opacity-70 disabled:cursor-not-allowed font-display"
              >
                {isLoading ? (
                  <Loader2 size={18} className="animate-spin text-brand-on-primary mx-auto" />
                ) : (
                  <span>Atualizar Credenciais</span>
                )}
              </button>
            </form>
          )}

        </div>

        <div className="mt-12 flex flex-col items-center gap-4 animate-in slide-in-from-bottom-2 fade-in duration-700">
          <div className="flex items-center gap-3">
             <span className="h-[1px] w-8 bg-surface-border"></span>
             <span className="text-brand-muted/50 text-[10px] font-bold uppercase tracking-[0.2em]">Crafted by</span>
             <span className="h-[1px] w-8 bg-surface-border"></span>
          </div>
          <img src="https://raw.githubusercontent.com/synapiens/uteis/refs/heads/main/LogoSynapiensNovo/logo_ajust.png" alt="Synapiens" className="h-[28px] object-contain brightness-105 hover:scale-105 transition-all cursor-pointer" />
        </div>
      </div>
    </div>
  );
}

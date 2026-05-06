import React, { useState, useEffect } from 'react';
import { Mail, Lock, Eye, EyeOff, Loader2, CheckCircle2, ArrowLeft, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { cn } from '../lib/utils';

type ViewState = 'login' | 'recovery' | 'recovery_sent' | 'reset';

export function Login() {
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
    if (!pass) return { score: 0, text: '', color: 'bg-slate-700' };
    if (pass.length > 7) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    switch (score) {
      case 0:
      case 1: return { score, text: 'Fraca', color: 'bg-red-500' };
      case 2: return { score, text: 'Média', color: 'bg-yellow-500' };
      case 3: return { score, text: 'Forte', color: 'bg-emerald-500' };
      case 4: return { score, text: 'Muito Forte', color: 'bg-[#75AB61]' };
      default: return { score: 0, text: '', color: 'bg-slate-700' };
    }
  };

  const strength = getPasswordStrength(newPassword);

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#0b1120] overflow-hidden">
      {/* Background radial gradient and glowing elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#1A1A2E] via-[#0b1120] to-[#0b1120] z-0"></div>
      
      {/* Subtle animated waves/connections representation */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] z-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0 rounded-full border border-[#75AB61]/10 bg-[#75AB61]/5 blur-3xl animate-pulse" style={{ animationDuration: '4s' }}></div>
        <div className="absolute inset-[10%] rounded-full border border-[#A2C794]/20 bg-[#A2C794]/5 blur-2xl animate-pulse" style={{ animationDuration: '3s', animationDelay: '1s' }}></div>
      </div>
      
      <div className="relative z-10 w-full max-w-[420px] p-6 lg:p-8">
        <div className="mb-8 flex flex-col items-center">
          <img src="https://raw.githubusercontent.com/synapiens/uteis/refs/heads/main/LogoHermes/logo_hermes_nexus_negat.png" alt="Hermes Nexus" className="h-[72px] object-contain mb-3 drop-shadow-lg" />
          <p className="text-slate-400 text-sm mt-1 font-medium tracking-wide">Acesso exclusivo à plataforma</p>
        </div>

        {/* Dynamic Card based on ViewState */}
        <div className={cn(
          "rounded-2xl p-6 sm:p-8 transition-all duration-300 relative backdrop-blur-xl shadow-2xl shadow-[#000000]/50",
          "bg-[#111A22]/80 border border-cyan-500/20", // Superfície #75AB61 semitransparente interpretada como fundo escuro com tint verde e borda ciano/verde
          error ? "border-red-500/50 shadow-red-500/10" : "border-[#75AB61]/30"
        )}>
          
          {/* LOGIN VIEW */}
          {view === 'login' && (
            <form onSubmit={handleLogin} className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">E-mail corporativo</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-[#75AB61]">
                      <Mail size={18} />
                    </div>
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={cn(
                        "block w-full rounded-xl border bg-[#0b1120]/50 p-3 pl-10 text-sm text-white placeholder-slate-500 transition-all focus:outline-none focus:ring-2 focus:border-transparent",
                        error ? "border-red-500/50 focus:ring-red-500/50" : "border-slate-700/50 focus:ring-[#75AB61]"
                      )}
                      placeholder="nome@empresa.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">Senha</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-[#75AB61]">
                      <Lock size={18} />
                    </div>
                    <input 
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={cn(
                        "block w-full rounded-xl border bg-[#0b1120]/50 p-3 pl-10 pr-10 text-sm text-white placeholder-slate-500 transition-all focus:outline-none focus:ring-2 focus:border-transparent",
                        error ? "border-red-500/50 focus:ring-red-500/50" : "border-slate-700/50 focus:ring-[#75AB61]"
                      )}
                      placeholder="Sua senha de acesso"
                      required
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-500 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="text-red-400 text-xs font-medium bg-red-400/10 p-2.5 rounded-lg border border-red-400/20 text-center animate-in fade-in slide-in-from-top-1">
                    {error}
                  </div>
                )}

                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <div className="relative flex items-center justify-center w-4 h-4">
                      <input type="checkbox" className="peer appearance-none w-4 h-4 rounded border border-slate-600 bg-slate-800 checked:bg-[#75AB61] checked:border-[#75AB61] transition-colors focus:ring-2 focus:ring-[#75AB61] focus:ring-offset-2 focus:ring-offset-[#111A22]" />
                      <CheckCircle2 size={12} className="absolute text-[#0b1120] opacity-0 peer-checked:opacity-100 pointer-events-none" />
                    </div>
                    <span className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors">Lembrar acesso</span>
                  </label>
                  <button 
                    type="button" 
                    onClick={() => { setView('recovery'); setError(''); }}
                    className="text-sm font-medium text-[#A2C794] hover:text-white transition-colors"
                  >
                    Esqueci minha senha
                  </button>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="relative w-full overflow-hidden rounded-xl bg-[#75AB61] hover:bg-[#A2C794] px-5 py-3.5 text-sm font-bold text-[#0b1120] transition-all hover:shadow-[0_0_20px_rgba(117,171,97,0.4)] focus:outline-none focus:ring-2 focus:ring-[#75AB61] focus:ring-offset-2 focus:ring-offset-[#111A22] disabled:opacity-70 disabled:cursor-not-allowed group"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 size={18} className="animate-spin text-[#0b1120]" />
                    Autenticando...
                  </span>
                ) : (
                  <span>Entrar</span>
                )}
              </button>
              
              <button 
                type="button" 
                onClick={() => navigate('/dashboard')}
                className="w-full mt-3 rounded-xl border border-dashed border-[#75AB61]/50 bg-[#75AB61]/10 px-5 py-3 text-sm font-bold text-[#75AB61] hover:bg-[#75AB61]/20 transition-all focus:outline-none"
              >
                Entrar (Modo Dev - Sem Senha)
              </button>

              {/* Para testar o reset (Isso normalmente seria acessado via link no email) */}
              <button type="button" onClick={() => setView('reset')} className="w-full text-center text-xs text-slate-600 hover:text-slate-400 mt-2">
                (Dev: Simular tela de Nova Senha)
              </button>
            </form>
          )}

          {/* RECOVERY VIEW */}
          {view === 'recovery' && (
            <form onSubmit={handleRecovery} className="space-y-6 animate-in slide-in-from-right-4 fade-in duration-300">
              <button 
                type="button" 
                onClick={() => setView('login')}
                className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors mb-4"
              >
                <ArrowLeft size={16} /> Voltar para o login
              </button>
              
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Recuperar senha</h3>
                <p className="text-sm text-slate-400">Informe seu e-mail cadastrado para receber um link de redefinição.</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">E-mail cadastrado</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-[#75AB61]">
                    <Mail size={18} />
                  </div>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full rounded-xl border border-slate-700/50 bg-[#0b1120]/50 p-3 pl-10 text-sm text-white placeholder-slate-500 focus:border-[#75AB61] focus:ring-2 focus:ring-[#75AB61]/50 focus:outline-none transition-all" 
                    placeholder="nome@empresa.com"
                    required
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full rounded-xl bg-[#75AB61] hover:bg-[#A2C794] px-5 py-3.5 text-sm font-bold text-[#0b1120] transition-all hover:shadow-[0_0_20px_rgba(117,171,97,0.4)] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <Loader2 size={18} className="animate-spin text-[#0b1120] mx-auto" />
                ) : (
                  <span>Enviar link de recuperação</span>
                )}
              </button>
            </form>
          )}

          {/* RECOVERY SENT SUCCESS */}
          {view === 'recovery_sent' && (
            <div className="space-y-6 text-center py-4 animate-in zoom-in-95 fade-in duration-300">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#75AB61]/10 text-[#75AB61] mb-4">
                <CheckCircle2 size={32} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">E-mail enviado!</h3>
              <p className="text-sm text-slate-400 mb-6">
                Caso o e-mail <strong>{email}</strong> esteja cadastrado, você receberá um link com as instruções.
              </p>
              <button 
                onClick={() => setView('login')}
                className="w-full rounded-xl border border-slate-700 bg-slate-800/50 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-700 transition-colors"
              >
                Voltar para o login
              </button>
            </div>
          )}

          {/* RESET PASSWORD VIEW (Mock via email link) */}
          {view === 'reset' && (
            <form onSubmit={handleReset} className="space-y-6 animate-in slide-in-from-right-4 fade-in duration-300">
              <button 
                type="button" 
                onClick={() => setView('login')}
                className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors mb-2"
              >
                <ArrowLeft size={16} /> Voltar
              </button>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <ShieldCheck className="text-[#75AB61]" size={24} />
                  <h3 className="text-xl font-bold text-white">Criar nova senha</h3>
                </div>
                <p className="text-sm text-slate-400">Escolha uma senha forte para sua conta.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">Nova Senha</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-[#75AB61]">
                      <Lock size={18} />
                    </div>
                    <input 
                      type={showPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="block w-full rounded-xl border border-slate-700/50 bg-[#0b1120]/50 p-3 pl-10 pr-10 text-sm text-white placeholder-slate-500 focus:border-[#75AB61] focus:ring-2 focus:ring-[#75AB61]/50 focus:outline-none transition-all" 
                      placeholder="Mínimo de 8 caracteres"
                      required
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-500 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  
                  {/* Password Strength Indicator */}
                  {newPassword && (
                    <div className="mt-2.5 space-y-1.5 animate-in fade-in">
                      <div className="flex gap-1 h-1">
                        {[1, 2, 3, 4].map((level) => (
                          <div 
                            key={level} 
                            className={cn(
                              "flex-1 rounded-full transition-colors duration-300",
                              strength.score >= level ? strength.color : "bg-slate-800"
                            )}
                          />
                        ))}
                      </div>
                      <p className="text-[10px] text-slate-400 text-right">
                        Força da senha: <span className={cn("font-medium", strength.color.replace('bg-', 'text-'))}>{strength.text}</span>
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">Confirmar Nova Senha</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-[#75AB61]">
                      <Lock size={18} />
                    </div>
                    <input 
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={cn(
                        "block w-full rounded-xl border bg-[#0b1120]/50 p-3 pl-10 pr-10 text-sm text-white placeholder-slate-500 transition-all focus:outline-none focus:ring-2",
                        error ? "border-red-500/50 focus:ring-red-500/50" : "border-slate-700/50 focus:border-[#75AB61] focus:ring-[#75AB61]/50"
                      )}
                      placeholder="Repita a senha"
                      required
                    />
                    <button 
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-500 hover:text-white transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="text-red-400 text-xs font-medium bg-red-400/10 p-2.5 rounded-lg border border-red-400/20 text-center">
                    {error}
                  </div>
                )}
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full rounded-xl bg-[#75AB61] hover:bg-[#A2C794] px-5 py-3.5 text-sm font-bold text-[#0b1120] transition-all hover:shadow-[0_0_20px_rgba(117,171,97,0.4)] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <Loader2 size={18} className="animate-spin text-[#0b1120] mx-auto" />
                ) : (
                  <span>Redefinir Senha</span>
                )}
              </button>
            </form>
          )}

        </div>

        <div className="mt-8 flex justify-center items-center gap-2.5 text-slate-500 text-xs font-medium">
          <span className="opacity-70">Powered by</span>
          <img src="https://raw.githubusercontent.com/synapiens/uteis/refs/heads/main/LogoSynapiensNovo/logo_ajust.png" alt="Synapiens" className="h-[22px] object-contain drop-shadow-md brightness-90 saturate-50 hover:saturate-100 hover:brightness-110 transition-all cursor-pointer" />
        </div>
      </div>
    </div>
  );
}

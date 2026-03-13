import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { API_ENDPOINTS } from '../api/config';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await fetch(API_ENDPOINTS.LOGIN, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Erro ao fazer login');

            login(data.token, data.user);
            navigate('/dashboard');
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-[450px] animate-fadeInUp">
            {/* Card Principal com Glassmorphism */}
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white dark:border-slate-800 rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] p-8 md:p-12 relative overflow-hidden">
                {/* Efeito de brilho no topo do card */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50"></div>

                <div className="text-center mb-10 relative z-10">
                    <div className="w-20 h-20 bg-gradient-to-tr from-indigo-600 to-blue-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-indigo-500/20 transform hover:scale-110 transition-transform duration-500">
                        <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor font-bold">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <h2 className="text-4xl font-display font-black text-slate-900 dark:text-white tracking-tight mb-3">ShieldCheck</h2>
                    <p className="text-slate-500 dark:text-slate-400 font-medium text-lg leading-relaxed">
                        Proteja sua identidade digital com inteligência artificial.
                    </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6 relative z-10">
                    {error && (
                        <div className="bg-red-500/10 text-red-600 dark:text-red-400 p-4 rounded-2xl text-sm font-bold border border-red-500/20 flex items-center gap-3 animate-shake">
                            <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="block text-[11px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest ml-1">Endereço de E-mail</label>
                        <div className="relative group">
                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                className="w-full px-6 py-4 rounded-2xl bg-slate-100/50 dark:bg-slate-950/50 border-2 border-transparent focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-500 outline-none transition-all text-slate-800 dark:text-slate-100 font-bold placeholder:text-slate-400 dark:placeholder:text-slate-600"
                                placeholder="exemplo@email.com"
                                required
                            />
                            <div className="absolute inset-0 rounded-2xl border border-indigo-500/0 group-focus-within:border-indigo-500/10 pointer-events-none transition-all"></div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between items-center ml-1">
                            <label className="block text-[11px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">Sua Senha</label>
                            <Link to="/forgot-password" title="Recuperar senha" className="text-[11px] font-black text-slate-400 hover:text-indigo-500 dark:text-slate-500 uppercase tracking-widest transition-colors">Esqueceu?</Link>
                        </div>
                        <div className="relative group">
                            <input
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                className="w-full px-6 py-4 rounded-2xl bg-slate-100/50 dark:bg-slate-950/50 border-2 border-transparent focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-500 outline-none transition-all text-slate-800 dark:text-slate-100 font-bold placeholder:text-slate-400 dark:placeholder:text-slate-600"
                                placeholder="••••••••"
                                required
                            />
                            <div className="absolute inset-0 rounded-2xl border border-indigo-500/0 group-focus-within:border-indigo-500/10 pointer-events-none transition-all"></div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-indigo-600 dark:bg-indigo-500 text-white font-black py-5 rounded-2xl shadow-xl shadow-indigo-500/30 hover:shadow-indigo-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all flex justify-center items-center text-lg mt-8"
                    >
                        {isLoading ? (
                            <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                            <span className="flex items-center gap-2">
                                Entrar no Sistema
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                            </span>
                        )}
                    </button>
                </form>

                <div className="mt-12 text-center relative z-10">
                    <p className="text-slate-500 dark:text-slate-500 font-bold text-sm">
                        Ainda não tem uma conta? <Link to="/register" className="text-indigo-600 dark:text-indigo-400 hover:underline underline-offset-4">Crie agora mesmo</Link>
                    </p>
                </div>
            </div>

            {/* Rodapé sutil com links extras fora do card */}
            <div className="mt-8 flex justify-center gap-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <a href="#" className="hover:text-slate-600 transition-colors">Termos</a>
                <a href="#" className="hover:text-slate-600 transition-colors">Privacidade</a>
                <a href="#" className="hover:text-slate-600 transition-colors">Suporte</a>
            </div>
        </div>
    );
}

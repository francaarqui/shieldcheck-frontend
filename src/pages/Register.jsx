import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { API_ENDPOINTS } from '../api/config';

export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            return setError('As senhas não coincidem.');
        }

        setIsLoading(true);
        setError('');

        try {
            const response = await fetch(API_ENDPOINTS.REGISTER, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Erro ao criar conta');

            login(data.token, data.user);
            navigate('/dashboard'); // Req: redirect to dashboard after registration
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-[480px] animate-fadeInUp">
            {/* Card Principal com Glassmorphism */}
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white dark:border-slate-800 rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] p-8 md:p-12 relative overflow-hidden">
                {/* Efeito de brilho no topo do card */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50"></div>

                <div className="text-center mb-10 relative z-10">
                    <div className="w-20 h-20 bg-gradient-to-tr from-indigo-600 to-blue-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-indigo-500/20 rotate-6 transform hover:rotate-0 transition-transform duration-500">
                        <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor font-bold">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                    </div>
                    <h2 className="text-4xl font-display font-black text-slate-900 dark:text-white tracking-tight mb-3">Sua Segurança</h2>
                    <p className="text-slate-500 dark:text-slate-400 font-medium text-lg leading-relaxed">
                        Crie sua conta e comece a navegar de forma blindada.
                    </p>
                </div>

                <form onSubmit={handleRegister} className="space-y-5 relative z-10">
                    {error && (
                        <div className="bg-red-500/10 text-red-600 dark:text-red-400 p-4 rounded-2xl text-sm font-bold border border-red-500/20 flex items-center gap-3 animate-shake">
                            <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="block text-[11px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest ml-1">Nome Completo</label>
                        <input
                            type="text"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            className="w-full px-6 py-4 rounded-2xl bg-slate-100/50 dark:bg-slate-950/50 border-2 border-transparent focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-500 outline-none transition-all text-slate-800 dark:text-slate-100 font-bold placeholder:text-slate-400 dark:placeholder:text-slate-600"
                            placeholder="Como quer ser chamado?"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-[11px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest ml-1">Endereço de E-mail</label>
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="w-full px-6 py-4 rounded-2xl bg-slate-100/50 dark:bg-slate-950/50 border-2 border-transparent focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-500 outline-none transition-all text-slate-800 dark:text-slate-100 font-bold placeholder:text-slate-400 dark:placeholder:text-slate-600"
                            placeholder="seu@melhor-email.com"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="block text-[11px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest ml-1">Crie uma Senha</label>
                            <input
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                className="w-full px-6 py-4 rounded-2xl bg-slate-100/50 dark:bg-slate-950/50 border-2 border-transparent focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-500 outline-none transition-all text-slate-800 dark:text-slate-100 font-bold placeholder:text-slate-400"
                                placeholder="••••••••"
                                required
                                minLength={6}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-[11px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest ml-1">Confirme</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={e => setConfirmPassword(e.target.value)}
                                className="w-full px-6 py-4 rounded-2xl bg-slate-100/50 dark:bg-slate-950/50 border-2 border-transparent focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-500 outline-none transition-all text-slate-800 dark:text-slate-100 font-bold placeholder:text-slate-400"
                                placeholder="••••••••"
                                required
                            />
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
                                Criar Minha Conta
                                <svg className="w-5 h-5 rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
                            </span>
                        )}
                    </button>
                </form>

                <div className="mt-12 text-center relative z-10">
                    <p className="text-slate-500 dark:text-slate-500 font-bold text-sm">
                        Já possui conta? <Link to="/login" className="text-indigo-600 dark:text-indigo-400 hover:underline underline-offset-4">Fazer login</Link>
                    </p>
                </div>
            </div>
        </div>
    );
    );
}

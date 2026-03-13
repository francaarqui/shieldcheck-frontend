import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { API_ENDPOINTS } from '../api/config';

export default function Dashboard() {
    const { user } = useContext(AuthContext);
    const [stats, setStats] = useState({ total: 0, golpes: 0, seguros: 0, suspeitos: 0 });
    const [recent, setRecent] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!user?.token) return;
            try {
                const [statsRes, histRes] = await Promise.all([
                    fetch(API_ENDPOINTS.INTELLIGENCE_STATS, { headers: { Authorization: `Bearer ${user.token}` } }),
                    fetch(API_ENDPOINTS.HISTORY, { headers: { Authorization: `Bearer ${user.token}` } })
                ]);

                if (statsRes.ok) setStats(await statsRes.json());
                if (histRes.ok) {
                    const histData = await histRes.json();
                    setRecent(histData.slice(0, 5));
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user?.token]);

    return (
        <div className="animate-slide-up space-y-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h2 className="text-4xl font-display font-black text-slate-900 dark:text-white tracking-tight text-center md:text-left">
                        Olá, <span className="text-premium-gradient">{user?.name ? user.name.split(' ')[0] : 'Usuário'}</span> 👋
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg font-medium text-center md:text-left">Proteção total ativa. Aqui está o resumo da sua blindagem digital.</p>
                </div>
                <Link
                    to="/analyze"
                    className="bg-premium-gradient hover:opacity-90 text-white px-8 py-4 rounded-2xl font-black shadow-xl shadow-indigo-200 transition-all hover-lift flex items-center gap-3 text-lg"
                >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                    Nova Varredura AI
                </Link>
            </div>

            {loading ? (
                <div className="h-64 flex flex-col items-center justify-center space-y-4">
                    <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
                    <p className="text-slate-400 font-bold animate-pulse uppercase tracking-[0.2em] text-xs">Sincronizando Dados...</p>
                </div>
            ) : (
                <>
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="glass-card p-8 rounded-[2rem] flex flex-col gap-5 hover-lift relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-150"></div>
                            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-sm">
                                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>
                            <div>
                                <p className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Economia Estimada</p>
                                <div className="flex items-baseline gap-2">
                                    <p className="text-5xl font-display font-black text-slate-900 dark:text-white leading-none">R$ {(stats.golpes * 500).toLocaleString('pt-BR')}</p>
                                    <span className="text-emerald-500 font-black text-xs uppercase animate-pulse">Salvo</span>
                                </div>
                                <p className="text-slate-400 dark:text-slate-500 text-[10px] mt-3 font-bold">Baseado na média de prejuízo por golpe evitado.</p>
                            </div>
                        </div>

                        <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <div className="glass-card p-6 rounded-[2rem] flex flex-col justify-between hover-lift">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Total</p>
                                <p className="text-3xl font-display font-black text-slate-900">{stats.total}</p>
                            </div>
                            <div className="glass-card p-6 rounded-[2rem] flex flex-col justify-between hover-lift border-b-4 border-b-red-500">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Bloqueios</p>
                                <p className="text-3xl font-display font-black text-red-600">{stats.golpes}</p>
                            </div>
                            <div className="glass-card p-6 rounded-[2rem] flex flex-col justify-between hover-lift border-b-4 border-b-emerald-500">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Seguros</p>
                                <p className="text-3xl font-display font-black text-emerald-600">{stats.seguros}</p>
                            </div>
                            <div className="glass-card p-6 rounded-[2rem] flex flex-col justify-between hover-lift border-b-4 border-b-amber-500">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Suspeitos</p>
                                <p className="text-3xl font-display font-black text-amber-600">{stats.suspeitos}</p>
                            </div>
                        </div>
                    </div>

                    {/* Impact Section: Security Pulse */}
                    <div className="glass-card p-8 rounded-[2.5rem] border border-white dark:border-slate-800 bg-mesh shadow-lg overflow-hidden relative transition-all duration-300">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-indigo-500 to-emerald-500 opacity-50"></div>
                        <div className="flex flex-col lg:flex-row items-center gap-10">
                            <div className="flex-1 space-y-4 text-center lg:text-left">
                                <h3 className="text-2xl font-display font-black text-slate-900 dark:text-white tracking-tight">Security Pulse</h3>
                                <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">Sua frequência de proteção está estável. Cada quadrado abaixo representa a saúde das suas últimas interações digitais.</p>
                                <div className="flex flex-wrap justify-center lg:justify-start gap-1 pb-2">
                                    {[...Array(40)].map((_, i) => (
                                        <div
                                            key={i}
                                            className={`w-4 h-4 rounded-sm transition-all hover:scale-125 hover:rotate-12 cursor-help
                                                ${i < stats.seguros ? 'bg-emerald-500 animate-pulse' :
                                                    i < stats.total ? 'bg-slate-300' : 'bg-slate-100'}
                                            `}
                                            style={{ animationDelay: `${i * 0.05}s` }}
                                            title={`Evento de Segurança #${i + 1}`}
                                        ></div>
                                    ))}
                                </div>
                            </div>
                            <div className="w-full lg:w-48 bg-slate-900 rounded-3xl p-6 text-center text-white shadow-xl rotate-2">
                                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Nível de Proteção</p>
                                <p className="text-5xl font-display font-black leading-none">98<span className="text-xl">%</span></p>
                                <p className="text-xs text-indigo-200 mt-2 font-bold uppercase">Escaneamento Ativo</p>
                            </div>
                        </div>
                    </div>

                    {/* Quick History Section */}
                    <div className="glass-card rounded-[2.5rem] overflow-hidden border border-white dark:border-slate-800">
                        <div className="px-8 py-7 bg-slate-900/5 dark:bg-white/5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                            <h3 className="text-xl font-display font-black text-slate-900 dark:text-white flex items-center gap-3">
                                <div className="w-1.5 h-6 bg-indigo-500 rounded-full"></div>
                                Logs Recentes de Proteção
                            </h3>
                            <Link to="/history" className="text-sm font-black text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 uppercase tracking-widest">Painel Completo &rarr;</Link>
                        </div>

                        {recent.length === 0 ? (
                            <div className="p-16 text-center bg-slate-50/50 flex flex-col items-center">
                                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-300 mb-4">
                                    <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" /></svg>
                                </div>
                                <p className="text-slate-500 font-bold max-w-sm leading-relaxed">Sua linha do tempo está limpa. Inicie uma nova análise para proteger seus dados.</p>
                                <Link to="/analyze" className="mt-6 text-indigo-600 font-black uppercase tracking-widest text-xs py-3 px-6 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition-all">Começar agora</Link>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-100 bg-white/40">
                                {recent.map((item) => (
                                    <div key={item.id} className="p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 hover:bg-white/80 dark:hover:bg-slate-800/50 transition-all group">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1.5">
                                                <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-[10px] font-black text-slate-500 dark:text-slate-400 rounded uppercase tracking-wider">{item.type || 'TEXTO'}</span>
                                                <p className="text-xs font-bold text-slate-400 font-mono">{new Date(item.timestamp).toLocaleTimeString()}</p>
                                            </div>
                                            <p className="text-slate-900 dark:text-white font-bold text-lg truncate group-hover:text-indigo-600 transition-colors">{item.content}</p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="text-right hidden sm:block">
                                                <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Avaliação</p>
                                                <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{item.status}</p>
                                            </div>
                                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-display font-black text-lg border-2 shadow-sm
                                                ${item.risk_score > 60 ? 'bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 border-red-100 dark:border-red-900/30' :
                                                    item.risk_score > 30 ? 'bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-900/30' :
                                                        'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/30'}
                                            `}>
                                                {item.risk_score}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}

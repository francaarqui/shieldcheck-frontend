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
                    <h2 className="text-4xl font-display font-black text-slate-900 tracking-tight">
                        Olá, <span className="text-premium-gradient">{user?.name ? user.name.split(' ')[0] : 'Usuário'}</span> 👋
                    </h2>
                    <p className="text-slate-500 mt-2 text-lg font-medium">Proteção total ativa. Aqui está o resumo da sua blindagem digital.</p>
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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="glass-card p-6 rounded-[2rem] flex flex-col gap-4 hover-lift">
                            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Total Analisado</p>
                                <p className="text-4xl font-display font-black text-slate-900">{stats.total}</p>
                            </div>
                        </div>

                        <div className="glass-card p-6 rounded-[2rem] flex flex-col gap-4 hover-lift border-t-4 border-t-red-500">
                            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Fraudes Bloqueadas</p>
                                <p className="text-4xl font-display font-black text-slate-900">{stats.golpes}</p>
                            </div>
                        </div>

                        <div className="glass-card p-6 rounded-[2rem] flex flex-col gap-4 hover-lift border-t-4 border-t-emerald-500">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Interações Seguras</p>
                                <p className="text-4xl font-display font-black text-slate-900">{stats.seguros}</p>
                            </div>
                        </div>

                        <div className="glass-card p-6 rounded-[2rem] flex flex-col gap-4 hover-lift border-t-4 border-t-amber-500">
                            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Suspeitas AI</p>
                                <p className="text-4xl font-display font-black text-slate-900">{stats.suspeitos}</p>
                            </div>
                        </div>
                    </div>

                    {/* Quick History Section */}
                    <div className="glass-card rounded-[2.5rem] overflow-hidden border border-white">
                        <div className="px-8 py-7 bg-slate-900/5 border-b border-slate-100 flex justify-between items-center">
                            <h3 className="text-xl font-display font-black text-slate-900 flex items-center gap-3">
                                <div className="w-1.5 h-6 bg-indigo-500 rounded-full"></div>
                                Logs Recentes de Proteção
                            </h3>
                            <Link to="/history" className="text-sm font-black text-indigo-600 hover:text-indigo-800 uppercase tracking-widest">Painel Completo &rarr;</Link>
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
                                    <div key={item.id} className="p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 hover:bg-white/80 transition-all group">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1.5">
                                                <span className="px-2 py-0.5 bg-slate-100 text-[10px] font-black text-slate-500 rounded uppercase tracking-wider">{item.type || 'TEXTO'}</span>
                                                <p className="text-xs font-bold text-slate-400 font-mono">{new Date(item.timestamp).toLocaleTimeString()}</p>
                                            </div>
                                            <p className="text-slate-900 font-bold text-lg truncate group-hover:text-indigo-600 transition-colors">{item.content}</p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="text-right hidden sm:block">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Avaliação</p>
                                                <p className="text-sm font-bold text-slate-700">{item.status}</p>
                                            </div>
                                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-display font-black text-lg border-2 shadow-sm
                                                ${item.risk_score > 60 ? 'bg-red-50 text-red-600 border-red-100' :
                                                    item.risk_score > 30 ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                                        'bg-emerald-50 text-emerald-600 border-emerald-100'}
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

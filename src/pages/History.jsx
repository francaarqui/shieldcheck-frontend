import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { API_ENDPOINTS } from '../api/config';
import { Link } from 'react-router-dom';

export default function History() {
    const { user } = useContext(AuthContext);
    const [history, setHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            if (!user?.token) return;
            try {
                const response = await fetch(API_ENDPOINTS.HISTORY, {
                    headers: { Authorization: `Bearer ${user.token}` }
                });
                if (response.ok) {
                    const data = await response.json();
                    setHistory(data);
                } else {
                    const errData = await response.json();
                    setError(errData.error || 'Erro ao carregar histórico.');
                }
            } catch (err) {
                console.error(err);
                setError('Falha de conexão com o servidor.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchHistory();
    }, [user?.token]);

    const [error, setError] = useState(null);

    return (
        <div className="animate-slide-up max-w-6xl mx-auto space-y-10 pb-20">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div className="space-y-2">
                    <span className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-slate-200">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" /></svg>
                        Arquivo Digital de Segurança
                    </span>
                    <h2 className="text-5xl font-display font-black text-slate-900 tracking-tight">
                        Histórico de <span className="text-premium-gradient">Varreduras</span>
                    </h2>
                    <p className="text-slate-500 text-lg font-medium">Relatório completo de todas as ameaças interceptadas pelo seu perfil.</p>
                </div>

                <Link
                    to="/analyze"
                    className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black shadow-xl shadow-slate-200 transition-all hover-lift flex items-center gap-3 text-lg"
                >
                    Nova Análise
                </Link>
            </div>

            <div className="glass-card rounded-[2.5rem] overflow-hidden border border-white shadow-2xl">
                {isLoading ? (
                    <div className="h-64 flex flex-col items-center justify-center space-y-4 bg-white/50">
                        <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
                        <p className="text-slate-400 font-black uppercase tracking-[0.2em] text-xs animate-pulse">Recuperando Registros...</p>
                    </div>
                ) : error ? (
                    <div className="p-20 text-center flex flex-col items-center space-y-6 bg-red-50/30">
                        <div className="w-20 h-20 bg-red-100 text-red-500 rounded-full flex items-center justify-center">
                            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-2xl font-display font-black text-red-800">Ops! Algo deu errado</h3>
                            <p className="text-red-600/70 font-medium max-w-sm mx-auto">{error}</p>
                        </div>
                        <button onClick={() => window.location.reload()} className="bg-red-600 text-white px-8 py-3 rounded-xl font-black shadow-lg shadow-red-100 hover:bg-red-700 transition-all">
                            Tentar Novamente
                        </button>
                    </div>
                ) : history.length === 0 ? (
                    <div className="p-20 text-center flex flex-col items-center space-y-6">
                        <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-slate-200">
                            <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-2xl font-display font-black text-slate-800">Seu arquivo está vazio</h3>
                            <p className="text-slate-500 font-medium max-w-sm mx-auto">Inicie uma varredura para começar a construir seu histórico de proteção digital.</p>
                        </div>
                        <Link to="/analyze" className="mt-4 bg-indigo-600 text-white px-10 py-4 rounded-2xl font-black shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all hover-lift">
                            Começar Agora
                        </Link>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-900/5 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] border-b border-slate-100">
                                    <th className="px-8 py-6">Timestamp</th>
                                    <th className="px-8 py-6">Conteúdo Analisado</th>
                                    <th className="px-8 py-6">Categoria</th>
                                    <th className="px-8 py-6 text-right">Avaliação de Risco</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {history.map((item) => {
                                    const date = item.timestamp ? new Date(item.timestamp) : new Date();
                                    const isValidDate = !isNaN(date.getTime());

                                    return (
                                        <tr key={item.id} className="group hover:bg-white/80 transition-all">
                                            <td className="px-8 py-6 whitespace-nowrap">
                                                <div className="flex flex-col">
                                                    <span className="text-slate-900 font-bold">{isValidDate ? date.toLocaleDateString() : '---'}</span>
                                                    <span className="text-[10px] font-black text-slate-400 font-mono uppercase">{isValidDate ? date.toLocaleTimeString() : '---'}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="max-w-md">
                                                    <p className="text-slate-800 font-bold truncate group-hover:text-indigo-600 transition-colors" title={item.content}>
                                                        {item.content}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-lg text-[10px] font-black uppercase tracking-widest border border-slate-200">
                                                    {item.type || 'TEXTO'}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <div className="flex items-center justify-end gap-4">
                                                    <div className="text-right">
                                                        <p className={`text-[10px] font-black uppercase tracking-widest ${item.risk_score > 60 ? 'text-red-500' : item.risk_score > 30 ? 'text-amber-500' : 'text-emerald-500'}`}>
                                                            {item.status}
                                                        </p>
                                                    </div>
                                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-display font-black text-lg border-2 shadow-sm
                                                        ${item.risk_score > 60 ? 'bg-red-50 text-red-600 border-red-100' :
                                                            item.risk_score > 30 ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                                                'bg-emerald-50 text-emerald-600 border-emerald-100'}
                                                    `}>
                                                        {item.risk_score}
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

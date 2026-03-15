import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { API_ENDPOINTS } from '../api/config';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function History() {
    const { t } = useTranslation();
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [history, setHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [filter, setFilter] = useState('ALL'); // 'ALL', 'HIGH', 'MEDIUM', 'LOW'

    const [deleteModal, setDeleteModal] = useState({ show: false, id: null });

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
                const errData = await response.json().catch(() => ({}));
                setError(errData.error || t('tools.history.status.error_title'));
            }
        } catch (err) {
            console.error(err);
            setError(t('tools.history.status.error_title'));
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, [user?.token]);

    const executeDeleteRecord = async () => {
        const id = deleteModal.id;
        if (!id) return;

        try {
            const response = await fetch(`${API_ENDPOINTS.DELETE_HISTORY_ITEM}/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${user?.token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                setHistory(prev => prev.filter(item => item.id !== id));
                setDeleteModal({ show: false, id: null });
            } else {
                const errorData = await response.json().catch(() => ({}));
                console.error('Falha ao excluir:', errorData);
                alert(t('tools.history.modal.delete_error'));
            }
        } catch (err) {
            console.error('Erro de rede ao excluir:', err);
        }
    };

    const filteredHistory = history.filter(item => {
        if (filter === 'ALL') return true;
        if (filter === 'HIGH') return item.risk_score > 60;
        if (filter === 'MEDIUM') return item.risk_score > 30 && item.risk_score <= 60;
        if (filter === 'LOW') return item.risk_score <= 30;
        return true;
    });

    return (
        <div className="animate-slide-up max-w-4xl mx-auto space-y-6 pb-12 px-4 md:px-0">
            <div className="flex justify-start px-2">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 font-black rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all border border-slate-100 dark:border-slate-800 shadow-sm group"
                >
                    <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                    </svg>
                    {t('tools.analyze.back')}
                </button>
            </div>
            {/* Custom Modal */}
            {deleteModal.show && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
                    <div className="glass-card w-full max-w-md p-8 rounded-[2.5rem] border border-white dark:border-slate-800 shadow-2xl space-y-6 animate-scale-up">
                        <div className="w-16 h-16 bg-red-50 dark:bg-red-950/30 text-red-600 rounded-3xl flex items-center justify-center mx-auto border border-red-100 dark:border-red-900/30">
                            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </div>
                        <div className="text-center space-y-2">
                            <h3 className="text-2xl font-display font-black text-slate-900 dark:text-white">{t('tools.history.modal.title')}</h3>
                            <p className="text-slate-500 dark:text-slate-400 font-medium">{t('tools.history.modal.desc')}</p>
                        </div>
                        <div className="flex gap-3 pt-2">
                            <button
                                onClick={() => setDeleteModal({ show: false, id: null })}
                                className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-200 transition-all"
                            >
                                {t('tools.history.modal.cancel')}
                            </button>
                            <button
                                onClick={executeDeleteRecord}
                                className="flex-1 py-4 bg-red-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-red-700 shadow-lg shadow-red-200 dark:shadow-none transition-all"
                            >
                                {t('tools.history.modal.confirm')}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 px-2">
                <div className="space-y-1">
                    <span className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border border-slate-200 dark:border-slate-700">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" /></svg>
                        {t('tools.history.digital_security')}
                    </span>
                    <h2 className="text-4xl font-display font-black text-slate-900 dark:text-white tracking-tight leading-tight" dangerouslySetInnerHTML={{ __html: t('tools.history.title') }}></h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium font-display">{t('tools.history.subtitle')}</p>
                </div>

                <Link
                    to="/analyze"
                    className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-5 py-3 rounded-xl font-black shadow-xl shadow-slate-200 dark:shadow-none transition-all hover-lift flex items-center gap-2 text-sm"
                >
                    {t('tools.history.nova_analise')}
                </Link>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-2 px-2">
                {[
                    { id: 'ALL', label: t('tools.history.filters.all'), count: history.length, color: 'bg-slate-100 dark:bg-slate-800 text-slate-500' },
                    { id: 'HIGH', label: t('tools.history.filters.high'), count: history.filter(h => h.risk_score > 60).length, color: 'bg-red-50 text-red-600' },
                    { id: 'MEDIUM', label: t('tools.history.filters.suspect'), count: history.filter(h => h.risk_score > 30 && h.risk_score <= 60).length, color: 'bg-amber-50 text-amber-600' },
                    { id: 'LOW', label: t('tools.history.filters.safe'), count: history.filter(h => h.risk_score <= 30).length, color: 'bg-emerald-50 text-emerald-600' },
                ].map((btn) => (
                    <button
                        key={btn.id}
                        onClick={() => setFilter(btn.id)}
                        className={`px-4 py-2 rounded-lg font-black text-[9px] uppercase tracking-widest transition-all flex items-center gap-2 border
                            ${filter === btn.id
                                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-transparent shadow-lg scale-105'
                                : `${btn.color} border-transparent dark:border-slate-800 opacity-60 hover:opacity-100`
                            }
                        `}
                    >
                        {btn.label}
                        <span className={`px-1.5 py-0.5 rounded-full text-[8px] bg-black/10 dark:bg-white/10`}>{btn.count}</span>
                    </button>
                ))}
            </div>

            <div className="glass-card rounded-[2rem] overflow-hidden border border-white dark:border-slate-800 shadow-xl">
                {isLoading ? (
                    <div className="h-48 flex flex-col items-center justify-center space-y-3 bg-white/50 dark:bg-slate-900/50">
                        <div className="w-10 h-10 border-4 border-indigo-100 dark:border-slate-700 border-t-indigo-600 rounded-full animate-spin"></div>
                        <p className="text-slate-400 dark:text-slate-500 font-black uppercase tracking-[0.2em] text-[10px] animate-pulse">{t('tools.history.status.loading')}</p>
                    </div>
                ) : error ? (
                    <div className="p-12 text-center flex flex-col items-center space-y-4 bg-red-50/30 dark:bg-red-950/20">
                        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-500 dark:text-red-400 rounded-full flex items-center justify-center">
                            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-xl font-display font-black text-red-800 dark:text-red-400">{t('tools.history.status.error_title')}</h3>
                            <p className="text-red-600/70 dark:text-red-500/70 text-sm font-medium max-w-sm mx-auto">{error}</p>
                        </div>
                        <button onClick={() => fetchHistory()} className="bg-red-600 text-white px-6 py-2 rounded-xl font-black shadow-lg hover:bg-red-700 transition-all text-sm">
                            {t('tools.history.status.retry')}
                        </button>
                    </div>
                ) : filteredHistory.length === 0 ? (
                    <div className="p-16 text-center flex flex-col items-center space-y-4 bg-white dark:bg-slate-900/40">
                        <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800/50 rounded-full flex items-center justify-center text-slate-200 dark:text-slate-700">
                            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-xl font-display font-black text-slate-800 dark:text-slate-200">{t('tools.history.status.empty')}</h3>
                            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium max-w-sm mx-auto">
                                {filter !== 'ALL' ? t('tools.history.status.empty_desc') : t('tools.history.status.clean_timeline')}
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="overflow-x-auto bg-white/40 dark:bg-slate-900/40">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <thead>
                                    <tr className="bg-slate-900/5 dark:bg-slate-800/50 text-slate-400 dark:text-slate-500 text-[9px] font-black uppercase tracking-[0.2em] border-b border-slate-100 dark:border-slate-800">
                                        <th className="px-6 py-4">{t('tools.history.table.timestamp')}</th>
                                        <th className="px-6 py-4">{t('tools.history.table.content')}</th>
                                        <th className="px-6 py-4">{t('tools.history.table.category')}</th>
                                        <th className="px-6 py-4">{t('tools.history.table.risk')}</th>
                                        <th className="px-6 py-4 text-right w-16"></th>
                                    </tr>
                                </thead>
                            </thead>
                            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                                {filteredHistory.map((item) => {
                                    const date = item.timestamp ? new Date(item.timestamp) : new Date();
                                    const isValidDate = !isNaN(date.getTime());

                                    return (
                                        <tr key={item.id} className="group hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-all cursor-default">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex flex-col">
                                                    <span className="text-slate-900 dark:text-white font-bold text-xs">{isValidDate ? date.toLocaleDateString() : '---'}</span>
                                                    <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 font-mono uppercase">{isValidDate ? date.toLocaleTimeString() : '---'}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="max-w-[150px] md:max-w-xs">
                                                    <p className="text-slate-800 dark:text-slate-200 font-bold text-sm truncate" title={item.content}>
                                                        {item.content}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-md text-[9px] font-black uppercase tracking-widest border border-slate-200 dark:border-slate-700">
                                                    {item.type || 'TEXTO'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-display font-black text-[10px] border shadow-sm
                                                        ${item.risk_score > 60 ? 'bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 border-red-100 dark:border-red-900/30' :
                                                            item.risk_score > 30 ? 'bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-900/30' :
                                                                'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/30'}
                                                    `}>
                                                        {item.risk_score}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => setDeleteModal({ show: true, id: item.id })}
                                                    className="p-1.5 text-slate-300 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-md transition-all opacity-0 group-hover:opacity-100"
                                                    title="Apagar Registro"
                                                >
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                </button>
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

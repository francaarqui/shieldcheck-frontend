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
        <div className="animate-slide-up max-w-5xl mx-auto space-y-8 pb-12 px-4 md:px-0">
            <div className="flex justify-start">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-black rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all border border-slate-200 dark:border-slate-700 shadow-sm group text-[10px] uppercase tracking-widest"
                >
                    <svg className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
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

            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div className="space-y-2">
                    <span className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 rounded-lg text-[9px] font-black uppercase tracking-[0.2em] border border-indigo-100/50 dark:border-indigo-900/30">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" /></svg>
                        {t('tools.history.digital_security')}
                    </span>
                    <h2 className="text-4xl lg:text-5xl font-display font-black text-slate-900 dark:text-white tracking-tight leading-none" dangerouslySetInnerHTML={{ __html: t('common.history') }}></h2>
                    <p className="text-slate-500 dark:text-slate-400 text-base font-medium max-w-xl">{t('tools.history.subtitle')}</p>
                </div>

                <Link
                    to="/analyze"
                    className="h-14 px-8 bg-premium-gradient text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    {t('tools.history.nova_analise')}
                </Link>
            </div>

            {/* Premium Filters */}
            <div className="glass-card p-2 rounded-[2rem] border border-white dark:border-slate-800 shadow-xl backdrop-blur-xl">
                <div className="grid grid-cols-2 lg:flex lg:flex-nowrap gap-1.5">
                    {[
                        { id: 'ALL', label: t('tools.history.filters.all'), count: history.length, icon: '📋' },
                        { id: 'HIGH', label: t('tools.history.filters.high'), count: history.filter(h => h.risk_score > 60).length, icon: '🔴', activeColor: 'text-red-500' },
                        { id: 'MEDIUM', label: t('tools.history.filters.suspect'), count: history.filter(h => h.risk_score > 30 && h.risk_score <= 60).length, icon: '🟡', activeColor: 'text-amber-500' },
                        { id: 'LOW', label: t('tools.history.filters.safe'), count: history.filter(h => h.risk_score <= 30).length, icon: '🟢', activeColor: 'text-emerald-500' },
                    ].map((btn) => (
                        <button
                            key={btn.id}
                            onClick={() => setFilter(btn.id)}
                            className={`px-3 py-3 lg:px-6 lg:py-4 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 whitespace-nowrap flex-1
                                ${filter === btn.id
                                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-lg scale-[1.02] z-10'
                                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                                }
                            `}
                        >
                            <span className="text-base">{btn.icon}</span>
                            {btn.label}
                            <span className={`px-1.5 py-0.5 rounded-full text-[8px] ${filter === btn.id ? 'bg-white/20 dark:bg-black/10' : 'bg-slate-200 dark:bg-slate-700'}`}>
                                {btn.count}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="glass-card rounded-[2.5rem] overflow-hidden border border-white dark:border-slate-800 shadow-2xl">
                {isLoading ? (
                    <div className="h-64 flex flex-col items-center justify-center space-y-4 bg-white/50 dark:bg-slate-900/50">
                        <div className="w-12 h-12 border-4 border-indigo-100 dark:border-slate-800 border-t-indigo-600 rounded-full animate-spin"></div>
                        <p className="text-slate-400 dark:text-slate-500 font-black uppercase tracking-[0.3em] text-[10px] animate-pulse">{t('tools.history.status.loading')}</p>
                    </div>
                ) : filteredHistory.length === 0 ? (
                    <div className="p-20 text-center flex flex-col items-center space-y-6 bg-white dark:bg-slate-900/40">
                        <div className="w-24 h-24 bg-slate-50 dark:bg-slate-800/50 rounded-full flex items-center justify-center text-slate-200 dark:text-slate-700 border-4 border-slate-100 dark:border-slate-800">
                            <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-2xl font-display font-black text-slate-800 dark:text-slate-200">{t('tools.history.status.empty')}</h3>
                            <p className="text-slate-500 dark:text-slate-400 font-medium max-w-sm mx-auto leading-relaxed">
                                {filter !== 'ALL' ? t('tools.history.status.empty_desc') : t('tools.history.status.clean_timeline')}
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-slate-950/50 text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] border-b border-slate-100 dark:border-slate-800">
                                    <th className="px-8 py-6">{t('tools.history.table.timestamp')}</th>
                                    <th className="px-8 py-6">{t('tools.history.table.content')}</th>
                                    <th className="px-8 py-6">{t('tools.history.table.category')}</th>
                                    <th className="px-8 py-6">{t('tools.history.table.risk')}</th>
                                    <th className="px-8 py-6 text-right w-16"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                                {filteredHistory.map((item) => {
                                    const date = item.timestamp ? new Date(item.timestamp) : new Date();
                                    const isValidDate = !isNaN(date.getTime());

                                    return (
                                        <tr key={item.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all">
                                            <td className="px-8 py-6 whitespace-nowrap">
                                                <div className="flex flex-col">
                                                    <span className="text-slate-900 dark:text-white font-black text-xs">{isValidDate ? date.toLocaleDateString() : '---'}</span>
                                                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 font-mono uppercase">{isValidDate ? date.toLocaleTimeString() : '---'}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="max-w-xs xl:max-w-md">
                                                    <p className="text-slate-800 dark:text-slate-200 font-bold text-sm truncate" title={item.content}>
                                                        {item.content}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-lg text-[9px] font-black uppercase tracking-widest border border-slate-200/50 dark:border-slate-700/50">
                                                    {item.type ? t(`tools.history.table.types.${item.type.toLowerCase()}`, { defaultValue: item.type }) : t('tools.history.table.types.text')}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-display font-black text-xs border-2 shadow-lg
                                                        ${item.risk_score > 60 ? 'bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 border-white dark:border-red-900/30' :
                                                        item.risk_score > 30 ? 'bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 border-white dark:border-amber-900/30' :
                                                            'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border-white dark:border-emerald-900/30'}
                                                    `}>
                                                    {item.risk_score}
                                                </div>
                                                <span className={`text-[10px] font-black uppercase tracking-widest hidden sm:inline
                                                        ${item.risk_score > 60 ? 'text-red-500' :
                                                        item.risk_score > 30 ? 'text-amber-500' :
                                                            'text-emerald-500'}
                                                    `}>
                                                    {item.risk_score > 60 ? t('tools.history.filters.high') :
                                                        item.risk_score > 30 ? t('tools.history.filters.suspect') :
                                                            t('tools.history.filters.safe')}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <button
                                                    onClick={() => setDeleteModal({ show: true, id: item.id })}
                                                    className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                                                >
                                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
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
        </div >
    );
}

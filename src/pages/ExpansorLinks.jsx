import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../context/AuthContext';
import { API_ENDPOINTS } from '../api/config';

export default function ExpansorLinks() {
    const { t } = useTranslation();
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [showPremiumModal, setShowPremiumModal] = useState(false);

    const expandUrl = async (e) => {
        e.preventDefault();
        if (!url) return;

        setLoading(true);
        setResult(null);
        setError(null);

        try {
            const res = await fetch(`${API_ENDPOINTS.EXPAND_URL}?url=${encodeURIComponent(url)}`, {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            if (res.status === 429) {
                setShowPremiumModal(true);
                throw new Error('Cota diária atingida.');
            }
            if (!res.ok) throw new Error();

            const data = await res.json();
            setResult({
                ...data.analysis,
                expandedUrl: data.expandedUrl,
                originalUrl: url
            });
        } catch (err) {
            setError(t('tools.store_checker.error_link'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="animate-slide-up max-w-5xl mx-auto space-y-12 pb-20 px-4 md:px-0">
            <div className="flex justify-start">
                <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-black rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all border border-slate-200 dark:border-slate-700 shadow-sm group text-[10px] uppercase tracking-widest">
                    <svg className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
                    </svg>
                    {t('tools.analyze.back')}
                </button>
            </div>

            <div className="text-center md:text-left space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-100 dark:border-indigo-900/30">
                    🔗 Advanced URL Inspection
                </div>
                <h2 className="text-4xl lg:text-5xl font-display font-black text-slate-900 dark:text-white tracking-tight">
                    {t('specialized_tools.expansor_links.title')}
                </h2>
                <p className="text-slate-500 dark:text-slate-400 text-lg font-medium max-w-2xl">
                    {t('specialized_tools.expansor_links.subtitle')}
                </p>
            </div>

            {error && (
                <div className="p-6 bg-red-50 dark:bg-red-950/30 border-2 border-red-100 dark:border-red-900/30 rounded-3xl text-red-600 dark:text-red-400 font-bold flex items-center gap-4 animate-bounce mx-auto max-w-xl">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                    <p>{error}</p>
                </div>
            )}

            <div className="glass-card p-10 rounded-[3rem] border border-white dark:border-slate-800 shadow-2xl relative overflow-hidden transition-all duration-300">
                {loading && (
                    <div className="absolute inset-0 z-30 pointer-events-none overflow-hidden rounded-[3rem]">
                        <div className="absolute inset-0 bg-indigo-500/5 backdrop-blur-[2px] animate-pulse"></div>
                        <div className="scan-line animate-scan"></div>
                    </div>
                )}
                <div className="space-y-8">
                    <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-3">
                        <div className="w-2 h-6 bg-indigo-500 rounded-full"></div>
                        {t('specialized_tools.expansor_links.input_label')}
                    </h3>
                    <div className="flex flex-col lg:flex-row gap-4">
                        <input
                            type="url"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder={t('specialized_tools.expansor_links.placeholder')}
                            className="flex-1 h-20 px-8 bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 rounded-3xl focus:ring-8 focus:ring-indigo-100 dark:focus:ring-indigo-950 focus:border-indigo-500 outline-none transition-all text-slate-800 dark:text-slate-100 font-bold text-xl placeholder:text-slate-300"
                        />
                        <button
                            onClick={expandUrl}
                            disabled={loading || !url}
                            className="lg:w-72 h-20 bg-indigo-600 text-white font-black rounded-3xl hover:bg-indigo-700 transition-all shadow-2xl disabled:opacity-50 text-xl"
                        >
                            {t('specialized_tools.common.audit_now')}
                        </button>
                    </div>
                </div>
            </div>

            {result && (
                <div className="animate-slide-up">
                    <div className="glass-card rounded-[3rem] border border-white dark:border-slate-800 shadow-2xl overflow-hidden relative">
                        <div className={`h-4 w-full ${result.trustScore > 70 ? 'bg-emerald-500' : result.trustScore > 40 ? 'bg-amber-500' : 'bg-red-500'}`}></div>
                        <div className="p-10 space-y-10">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-10 border-b border-slate-100 dark:border-slate-800">
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Link Destino Revelado</p>
                                    <h4 className="text-2xl font-display font-black text-indigo-600 break-all">{result.expandedUrl}</h4>
                                </div>
                                <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Score de Segurança</p>
                                    <p className={`text-4xl font-black ${result.trustScore > 70 ? 'text-emerald-500' : 'text-red-500'}`}>{result.trustScore}</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {result.riskFactors.map((factor, idx) => (
                                    <div key={idx} className="flex gap-4 items-center bg-slate-50/50 dark:bg-slate-800/10 border border-slate-100 dark:border-slate-800 p-6 rounded-2xl">
                                        <div className={`p-2 rounded-xl ${result.trustScore > 70 ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                        </div>
                                        <span className="text-lg font-bold text-slate-700 dark:text-slate-300 leading-tight">{factor}</span>
                                    </div>
                                ))}
                            </div>
                            <div className={`p-8 rounded-[2.5rem] border-2 ${result.trustScore > 50 ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-100' : 'bg-red-50/50 dark:bg-red-950/20 border-red-100'}`}>
                                <h4 className="text-xs font-black uppercase tracking-[0.2em] mb-3 opacity-60">Análise da IA</h4>
                                <p className="text-2xl font-bold leading-relaxed">"{result.recommendation}"</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../context/AuthContext';
import { API_ENDPOINTS } from '../api/config';
import { jsPDF } from 'jspdf';

export default function AuditorLoja() {
    const { t } = useTranslation();
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [showPremiumModal, setShowPremiumModal] = useState(false);

    const checkStore = async (e) => {
        e.preventDefault();
        if (!url) return;

        setLoading(true);
        setResult(null);
        setError(null);

        try {
            const res = await fetch(`${API_ENDPOINTS.STORE_CHECK}?url=${encodeURIComponent(url)}`, {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            if (res.status === 429) {
                setShowPremiumModal(true);
                throw new Error(t('tools.store_checker.error_quota'));
            }
            if (!res.ok) throw new Error();

            const data = await res.json();
            setResult(data);
        } catch (err) {
            setError(t('tools.store_checker.error_domain'));
        } finally {
            setLoading(false);
        }
    };

    const generateStoreReport = () => {
        if (!result) return;
        const doc = new jsPDF();
        doc.setFillColor(15, 23, 42);
        doc.rect(0, 0, 210, 40, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(22);
        doc.text(`${t('specialized_tools.common.header')} - ${t('specialized_tools.auditor_loja.title').toUpperCase()}`, 20, 25);

        const statusColor = result.trustScore > 70 ? [16, 185, 129] : result.trustScore > 40 ? [245, 158, 11] : [220, 38, 38];
        doc.setFillColor(...statusColor);
        doc.rect(20, 50, 170, 15, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(12);
        doc.text(`${t('specialized_tools.common.risk_score').toUpperCase()}: ${result.trustScore}% | DOMÍNIO: ${result.domain}`, 30, 60);

        doc.setTextColor(30, 41, 59);
        doc.setFontSize(14);
        doc.text(t('specialized_tools.common.technical_analysis'), 20, 85);
        doc.setFontSize(10);
        doc.text(`Tempo de Registro: ${result.registrationAge}`, 20, 95);

        let y = 105;
        result.riskFactors.forEach(factor => {
            doc.text(`- ${factor}`, 20, y);
            y += 7;
        });

        doc.setFillColor(248, 250, 252);
        doc.rect(20, y + 10, 170, 30, 'F');
        doc.setTextColor(79, 70, 229);
        doc.text('Veredito Final ShieldCheck:', 25, y + 20);
        doc.setTextColor(30, 41, 59);
        const splitRec = doc.splitTextToSize(result.recommendation || '', 160);
        doc.text(splitRec, 25, y + 30);

        doc.save(`StoreAudit_${result.domain}_${Date.now()}.pdf`);
    };

    return (
        <div className="animate-slide-up max-w-5xl mx-auto space-y-12 pb-20 px-4 md:px-0">
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

            <div className="text-center md:text-left space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-100 dark:border-indigo-900/30">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                    </span>
                    {t('specialized_tools.common.header')}
                </div>
                <h2 className="text-4xl lg:text-5xl font-display font-black text-slate-900 dark:text-white tracking-tight">
                    {t('specialized_tools.auditor_loja.title')}
                </h2>
                <p className="text-slate-500 dark:text-slate-400 text-lg font-medium max-w-2xl">
                    {t('specialized_tools.auditor_loja.subtitle')}
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
                        <div className="w-2 h-6 bg-indigo-600 rounded-full"></div>
                        {t('specialized_tools.auditor_loja.input_label')}
                    </h3>
                    <div className="flex flex-col lg:flex-row gap-4">
                        <div className="flex-1 relative group">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-3xl blur opacity-0 group-focus-within:opacity-100 transition duration-500"></div>
                            <input
                                type="url"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                placeholder="Insira a URL da loja (ex: https://loja-exemplo.com)"
                                className="relative w-full h-20 px-8 bg-slate-50/50 dark:bg-slate-950/50 border-2 border-slate-100 dark:border-slate-800 rounded-3xl focus:ring-0 focus:border-indigo-500 outline-none transition-all text-slate-800 dark:text-slate-100 font-bold text-xl placeholder:text-slate-300"
                            />
                        </div>
                        <button
                            onClick={checkStore}
                            disabled={loading || !url}
                            className="lg:w-72 h-20 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black rounded-3xl hover:opacity-90 transition-all shadow-xl disabled:opacity-50 text-xl flex items-center justify-center gap-3 active:scale-95"
                        >
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                            {t('specialized_tools.common.audit_now')}
                        </button>
                    </div>
                </div>
            </div>

            {result && (
                <div className="animate-slide-up">
                    <div className="glass-card rounded-[3rem] border border-white dark:border-slate-800 shadow-2xl overflow-hidden relative">
                        <div className={`h-4 w-full ${result.trustScore > 70 ? 'bg-emerald-500' : result.trustScore > 40 ? 'bg-amber-500' : 'bg-red-500'}`}></div>

                        <div className="p-10 flex flex-col lg:flex-row gap-12">
                            <div className="flex flex-col items-center justify-center space-y-4">
                                <div className={`w-48 h-48 rounded-[2.5rem] flex flex-col items-center justify-center border-4 shadow-2xl relative
                                    ${result.trustScore > 70 ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/30 text-emerald-600 dark:text-emerald-400' :
                                        result.trustScore > 40 ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/30 text-amber-600 dark:text-amber-400' :
                                            'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400'}
                                `}>
                                    <p className="text-[10px] font-black uppercase tracking-widest opacity-60">{t('specialized_tools.common.risk_score')}</p>
                                    <p className="text-8xl font-display font-black leading-none">{result.trustScore}</p>
                                    <p className="text-xs font-bold mt-2 uppercase tracking-tighter">{t('specialized_tools.common.global_index')}</p>
                                </div>

                                {user?.plan === 'PREMIUM' && (
                                    <button
                                        onClick={generateStoreReport}
                                        className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:opacity-90 transition-all shadow-xl flex items-center justify-center gap-2"
                                    >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                        {t('specialized_tools.common.download_report')}
                                    </button>
                                )}
                            </div>

                            <div className="flex-1 space-y-10">
                                <div>
                                    <h4 className="text-3xl font-display font-black text-slate-900 dark:text-white mb-2 break-all">{result.domain}</h4>
                                    <div className="flex gap-2 mb-8">
                                        <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-lg text-[10px] font-black uppercase tracking-widest border border-slate-200 dark:border-slate-700">
                                            {t('specialized_tools.auditor_loja.registration_label')}: {result.registrationAge}
                                        </span>
                                    </div>

                                    <h5 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 mb-6">
                                        <div className="w-1.5 h-4 bg-indigo-500 rounded-full"></div>
                                        {t('specialized_tools.common.technical_analysis')}
                                    </h5>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {result.riskFactors.map((factor, idx) => (
                                        <div key={idx} className="flex gap-4 items-center bg-slate-50/50 dark:bg-slate-800/10 border border-slate-100 dark:border-slate-800 p-5 rounded-2xl group hover:border-indigo-500/30 transition-colors">
                                            <div className={`p-1.5 rounded-lg ${result.trustScore > 70 ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'}`}>
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                            </div>
                                            <span className="text-sm font-bold text-slate-700 dark:text-slate-300 leading-tight">{factor}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className={`p-8 rounded-[2rem] border-2 shadow-sm ${result.trustScore > 50 ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/30' : 'bg-red-50/50 dark:bg-red-950/20 border-red-100 dark:border-red-900/30'}`}>
                                    <h4 className="text-xs font-black uppercase tracking-[0.2em] mb-3 text-indigo-600 dark:text-indigo-400">{t('specialized_tools.common.verdict_title')}</h4>
                                    <p className={`text-xl font-bold leading-relaxed ${result.trustScore > 50 ? 'text-emerald-900 dark:text-emerald-400' : 'text-red-900 dark:text-red-400'}`}>"{result.recommendation}"</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Premium */}
            {showPremiumModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
                    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] max-w-lg w-full p-8 md:p-10 shadow-2xl relative overflow-hidden animate-slide-up border border-slate-200 dark:border-slate-800">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 dark:bg-indigo-950/20 rounded-full blur-3xl -mr-16 -mt-16 opacity-60"></div>
                        <div className="relative z-10 text-center space-y-6">
                            <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center mx-auto shadow-lg shadow-indigo-200 dark:shadow-none rotate-12">
                                <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 11l7-7 7 7M5 19l7-7 7 7" /></svg>
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{t('specialized_tools.common.premium_only')}</h3>
                                <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{t('specialized_tools.common.premium_desc')}</p>
                            </div>
                            <div className="flex flex-col gap-3">
                                <button onClick={() => navigate('/plans')} className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black py-4 rounded-2xl hover:opacity-90 transition-all shadow-lg text-lg">{t('specialized_tools.common.see_plans')}</button>
                                <button onClick={() => setShowPremiumModal(false)} className="text-slate-400 font-bold text-sm hover:text-slate-600 dark:hover:text-slate-200 transition-colors">{t('specialized_tools.common.later')}</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../context/AuthContext';
import { API_ENDPOINTS } from '../api/config';

export default function AnaliseTelefone() {
    const { t } = useTranslation();
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);
    const [genericResult, setGenericResult] = useState(null);
    const [error, setError] = useState(null);
    const [showPremiumModal, setShowPremiumModal] = useState(false);

    const checkItem = async (e) => {
        e.preventDefault();
        if (!phone) return;

        setLoading(true);
        setGenericResult(null);
        setError(null);

        try {
            const res = await fetch(`${API_ENDPOINTS.CHECK_ITEM}?value=${encodeURIComponent(phone)}&type=phone`, {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            if (res.status === 429) {
                setShowPremiumModal(true);
                throw new Error('Cota diária atingida.');
            }
            if (!res.ok) throw new Error();

            const data = await res.json();
            setGenericResult(data);
        } catch (err) {
            setError(t('tools.store_checker.error_generic'));
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
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-100 dark:border-blue-900/30">
                    📞 Digital Identity Audit
                </div>
                <h2 className="text-4xl lg:text-5xl font-display font-black text-slate-900 dark:text-white tracking-tight">
                    {t('specialized_tools.analise_telefone.title')}
                </h2>
                <p className="text-slate-500 dark:text-slate-400 text-lg font-medium max-w-2xl">
                    {t('specialized_tools.analise_telefone.subtitle')}
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
                        <div className="absolute inset-0 bg-blue-500/5 backdrop-blur-[2px] animate-pulse"></div>
                        <div className="scan-line animate-scan bg-blue-500/50"></div>
                    </div>
                )}
                <div className="space-y-8">
                    <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-3">
                        <div className="w-2 h-6 bg-blue-500 rounded-full"></div>
                        {t('specialized_tools.analise_telefone.input_label')}
                    </h3>
                    <div className="flex flex-col lg:flex-row gap-4">
                        <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder={t('specialized_tools.analise_telefone.placeholder')}
                            className="flex-1 h-20 px-8 bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 rounded-3xl focus:ring-8 focus:ring-blue-100 dark:focus:ring-blue-900/20 focus:border-blue-500 outline-none transition-all text-slate-800 dark:text-slate-100 font-bold text-xl placeholder:text-slate-300"
                        />
                        <button
                            onClick={checkItem}
                            disabled={loading || !phone}
                            className="lg:w-72 h-20 bg-blue-600 text-white font-black rounded-3xl hover:bg-blue-700 transition-all shadow-2xl shadow-blue-200 dark:shadow-none disabled:opacity-50 text-xl"
                        >
                            Analisar Número
                        </button>
                    </div>
                </div>
            </div>

            {genericResult && (
                <div className="animate-slide-up">
                    <div className="glass-card rounded-[3rem] border border-white dark:border-slate-800 shadow-2xl overflow-hidden relative">
                        <div className={`h-4 w-full ${genericResult.score > 60 ? 'bg-red-500' : genericResult.score > 30 ? 'bg-amber-500' : 'bg-emerald-500'}`}></div>
                        <div className="p-10 flex flex-col lg:flex-row gap-12">
                            <div className="flex flex-col items-center justify-center space-y-4">
                                <div className={`w-48 h-48 rounded-[2.5rem] flex flex-col items-center justify-center border-4 shadow-2xl relative
                                    ${genericResult.score > 60 ? 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400' :
                                        genericResult.score > 30 ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/30 text-amber-600 dark:text-amber-400' :
                                            'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/30 text-emerald-600 dark:text-emerald-400'}
                                `}>
                                    <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Probabilidade de Fraude</p>
                                    <p className="text-8xl font-display font-black leading-none">{genericResult.score}</p>
                                    <p className="text-xs font-bold mt-2 uppercase tracking-tighter">{genericResult.status}</p>
                                </div>
                                {genericResult.reportedTimes > 0 && (
                                    <div className="px-4 py-2 bg-red-100 text-red-700 rounded-xl text-[10px] font-black uppercase tracking-widest">
                                        Detectado em {genericResult.reportedTimes} campanhas de spam
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 space-y-10">
                                <div><h4 className="text-3xl font-display font-black text-slate-900 dark:text-white mb-2 break-all">{phone}</h4></div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {genericResult.signals.map((signal, idx) => (
                                        <div key={idx} className="flex gap-4 items-center bg-slate-50/50 dark:bg-slate-800/10 border border-slate-100 dark:border-slate-800 p-5 rounded-2xl">
                                            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                            <span className="text-sm font-bold text-slate-700 dark:text-slate-300 leading-tight">{signal}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="p-8 bg-blue-600 rounded-[2rem] text-white shadow-xl">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest mb-3 opacity-60">Protocolo de Defesa</h4>
                                    <p className="text-xl font-bold leading-relaxed">{genericResult.recommendation}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

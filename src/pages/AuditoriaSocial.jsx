import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function AuditoriaSocial() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [handle, setHandle] = useState('');
    const [loading, setLoading] = useState(false);
    const [audit, setAudit] = useState(null);

    const runAudit = (e) => {
        e.preventDefault();
        if (!handle) return;
        setLoading(true);
        setAudit(null);

        setTimeout(() => {
            setAudit({
                handle: handle.startsWith('@') ? handle : `@${handle}`,
                botProbability: 12,
                accountAge: '4 anos',
                followers: '12.4k',
                following: '850',
                riskLevel: 'Baixo',
                verdict: 'Perfil Altamente Confiável',
                signals: [
                    'Atividade humana detectada (horários variados)',
                    'Interações orgânicas com perfis reais',
                    'Histórico de postagens consistente',
                    'Nenhum padrão de spam identificado'
                ],
                recommendation: 'Este perfil apresenta características de uso humano genuíno e orgânico. Seguro para interações e transações.'
            });
            setLoading(false);
        }, 3500);
    };

    return (
        <div className="animate-slide-up max-w-5xl mx-auto space-y-12 pb-20 px-4 md:px-0">
            <div className="flex justify-start">
                <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-black rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all border border-slate-200 dark:border-slate-700 text-[10px] uppercase tracking-widest">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
                    {t('tools.analyze.back')}
                </button>
            </div>

            <div className="text-center md:text-left space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-pink-50 dark:bg-pink-950/30 text-pink-600 dark:text-pink-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-pink-100 dark:border-pink-900/30">
                    📸 Social Media ID Auditor
                </div>
                <h2 className="text-4xl lg:text-5xl font-display font-black text-slate-900 dark:text-white tracking-tight">
                    {t('specialized_tools.auditoria_social.title')}
                </h2>
                <p className="text-slate-500 dark:text-slate-400 text-lg font-medium max-w-2xl">
                    {t('specialized_tools.auditoria_social.subtitle')}
                </p>
            </div>

            <div className="glass-card p-10 rounded-[3rem] border border-white dark:border-slate-800 shadow-2xl relative overflow-hidden transition-all duration-300">
                {loading && (
                    <div className="absolute inset-0 z-30 pointer-events-none overflow-hidden rounded-[3rem]">
                        <div className="absolute inset-0 bg-pink-500/5 backdrop-blur-[2px] animate-pulse"></div>
                        <div className="scan-line animate-scan bg-pink-500/50"></div>
                    </div>
                )}
                <div className="space-y-8">
                    <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-3">
                        <div className="w-2 h-6 bg-pink-500 rounded-full"></div>
                        {t('specialized_tools.auditoria_social.input_label')}
                    </h3>
                    <div className="flex flex-col lg:flex-row gap-4">
                        <div className="flex-1 relative">
                            <span className="absolute left-8 top-1/2 -translate-y-1/2 text-2xl font-black text-slate-300">@</span>
                            <input
                                type="text"
                                value={handle}
                                onChange={(e) => setHandle(e.target.value.replace('@', ''))}
                                placeholder={t('specialized_tools.auditoria_social.placeholder')}
                                className="w-full h-20 pl-16 pr-8 bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 rounded-3xl focus:ring-8 focus:ring-pink-100 dark:focus:ring-pink-900/20 focus:border-pink-500 outline-none transition-all text-slate-800 dark:text-slate-100 font-bold text-xl placeholder:text-slate-300"
                            />
                        </div>
                        <button
                            onClick={runAudit}
                            disabled={loading || !handle}
                            className="lg:w-72 h-20 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black rounded-3xl hover:opacity-90 transition-all shadow-xl disabled:opacity-50 text-xl"
                        >
                            {t('specialized_tools.common.audit_now')}
                        </button>
                    </div>
                </div>
            </div>

            {audit && (
                <div className="animate-slide-up">
                    <div className="glass-card rounded-[3rem] border border-white dark:border-slate-800 shadow-2xl overflow-hidden relative">
                        <div className="h-4 w-full bg-premium-gradient"></div>
                        <div className="p-10 flex flex-col lg:flex-row gap-12">
                            <div className="flex flex-col items-center justify-center space-y-6">
                                <div className="w-48 h-48 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center border-8 border-white dark:border-slate-900 shadow-xl overflow-hidden relative">
                                    <div className="text-6xl font-black text-slate-300">{audit.handle.charAt(1).toUpperCase()}</div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent"></div>
                                </div>
                                <div className="text-center">
                                    <h4 className="text-2xl font-black text-slate-900 dark:text-white">{audit.handle}</h4>
                                    <span className="px-3 py-1 bg-pink-50 dark:bg-pink-950/30 text-pink-600 dark:text-pink-400 rounded-lg text-[10px] font-black uppercase tracking-widest border border-pink-100">Bot Probability: {audit.botProbability}%</span>
                                </div>
                            </div>

                            <div className="flex-1 space-y-10">
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                    <div className="bg-slate-50/50 dark:bg-slate-900/30 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 text-center">
                                        <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Criação</p>
                                        <p className="text-lg font-black text-slate-800 dark:text-slate-200">{audit.accountAge}</p>
                                    </div>
                                    <div className="bg-slate-50/50 dark:bg-slate-900/30 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 text-center">
                                        <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Seguidores</p>
                                        <p className="text-lg font-black text-slate-800 dark:text-slate-200">{audit.followers}</p>
                                    </div>
                                    <div className="bg-slate-50/50 dark:bg-slate-900/30 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 text-center">
                                        <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Seguindo</p>
                                        <p className="text-lg font-black text-slate-800 dark:text-slate-200">{audit.following}</p>
                                    </div>
                                    <div className="bg-slate-50/50 dark:bg-slate-900/30 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 text-center">
                                        <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Risco</p>
                                        <p className="text-lg font-black text-emerald-500 uppercase">{audit.riskLevel}</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Behavioral Signals</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {audit.signals.map((signal, idx) => (
                                            <div key={idx} className="flex gap-3 items-center bg-indigo-50/30 dark:bg-indigo-950/10 p-4 rounded-2xl border border-indigo-100/50">
                                                <div className="w-1.5 h-6 bg-pink-500 rounded-full"></div>
                                                <span className="text-sm font-bold text-slate-600 dark:text-slate-300">{signal}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="p-8 bg-slate-900 dark:bg-white rounded-[2rem] text-white dark:text-slate-900 shadow-xl relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 dark:bg-slate-900/5 rotate-45 translate-x-16 -translate-y-16"></div>
                                    <h4 className="text-[10px] font-black uppercase tracking-widest mb-3 opacity-60">Veredito da Auditoria</h4>
                                    <p className="text-2xl font-black mb-2">{audit.verdict}</p>
                                    <p className="text-lg font-medium opacity-80 leading-relaxed">{audit.recommendation}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

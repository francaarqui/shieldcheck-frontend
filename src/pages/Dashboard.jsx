import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../context/AuthContext';
import { API_ENDPOINTS } from '../api/config';
import ShieldScoreCard from '../components/ShieldScoreCard';

export default function Dashboard() {
    const { t } = useTranslation();
    const { user } = useContext(AuthContext);
    const [stats, setStats] = useState({
        total: 0,
        golpes: 0,
        seguros: 0,
        suspeitos: 0,
        usedToday: 0,
        limit: 3,
        plan: 'FREE'
    });
    const [shieldScore, setShieldScore] = useState(0);
    const [recent, setRecent] = useState([]);
    const [loading, setLoading] = useState(true);


    const [isLogsOpen, setIsLogsOpen] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!user?.token) return;
            try {
                const [statsRes, histRes, scoreRes] = await Promise.all([
                    fetch(API_ENDPOINTS.INTELLIGENCE_STATS, { headers: { Authorization: `Bearer ${user.token}` } }),
                    fetch(API_ENDPOINTS.HISTORY, { headers: { Authorization: `Bearer ${user.token}` } }),
                    fetch(API_ENDPOINTS.SHIELD_SCORE, { headers: { Authorization: `Bearer ${user.token}` } })
                ]);

                if (statsRes.ok) setStats(await statsRes.json());
                if (scoreRes.ok) {
                    const scoreData = await scoreRes.json();
                    setShieldScore(scoreData.score);
                }
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
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-2 justify-center md:justify-start">
                        <h2 className="text-2xl lg:text-4xl font-display font-black text-slate-900 dark:text-white tracking-tight">
                            {t('dashboard.welcome', { name: user?.name ? user.name.split(' ')[0] : 'Usuário' })} 👋
                        </h2>
                        {user?.plan && user.plan !== 'FREE' && (
                            <span className="px-3 py-1 bg-premium-gradient text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg animate-pulse">
                                {user.plan}
                            </span>
                        )}
                        {(!user?.plan || user.plan === 'FREE') && (
                            <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 text-[10px] font-black uppercase tracking-widest rounded-full border border-slate-200 dark:border-slate-700">
                                {t('plans.names.free')}
                            </span>
                        )}
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 text-base lg:text-lg font-medium text-center md:text-left">{t('dashboard.protection_active')}{t('dashboard.protection_subtitle')}</p>
                </div>
                <div className="flex items-center gap-4 w-full md:w-auto">
                    {(!user?.plan || user.plan === 'FREE') && (
                        <Link
                            to="/plans"
                            className="flex-1 md:flex-none border-2 border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 px-6 py-4 rounded-2xl font-black transition-all hover-lift text-center text-sm uppercase tracking-widest"
                        >
                            {t('plans.buttons.upgrade')}
                        </Link>
                    )}
                    <Link
                        to="/analyze"
                        className="flex-1 md:flex-none bg-premium-gradient hover:opacity-90 text-white px-6 lg:px-8 py-4 rounded-2xl font-black shadow-xl shadow-indigo-200 dark:shadow-none transition-all hover-lift flex items-center justify-center gap-3 text-base lg:text-lg"
                    >
                        <svg className="w-5 h-5 lg:w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                        {t('dashboard.scan_now')}
                    </Link>
                </div>
            </div>

            {loading ? (
                <div className="h-64 flex flex-col items-center justify-center space-y-4">
                    <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
                    <p className="text-slate-400 font-bold animate-pulse uppercase tracking-[0.2em] text-xs">{t('dashboard.syncing')}</p>
                </div>
            ) : (
                <>
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                        <div className="glass-card p-6 lg:p-8 rounded-[2rem] flex flex-col gap-4 hover-lift relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-150"></div>
                            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-sm">
                                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">{t('dashboard.scam_economics')}</p>
                                <div className="flex items-baseline gap-2 flex-wrap">
                                    <p className="text-2xl lg:text-4xl font-display font-black text-slate-900 dark:text-white leading-none">R$ {(stats.golpes * 500).toLocaleString('pt-BR')}</p>
                                    <span className="text-emerald-500 font-black text-[10px] uppercase animate-pulse">{t('dashboard.saved')}</span>
                                </div>
                                <p className="text-slate-400 dark:text-slate-500 text-[9px] mt-2 font-bold">{t('dashboard.scam_economics_label')}</p>
                            </div>
                        </div>

                        <div className="glass-card p-6 lg:p-8 rounded-[2rem] flex flex-col gap-4 hover-lift bg-indigo-600 text-white relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
                            <div className="flex justify-between items-start relative z-10">
                                <div className="space-y-1">
                                    <p className="text-[9px] font-black uppercase tracking-widest opacity-80">{t('dashboard.quota_title')}</p>
                                    <h4 className="text-xl font-display font-black">{(stats.usedToday || 0)} / {(stats.limit >= 999 ? '∞' : (stats.limit || 3))}</h4>
                                </div>
                                <div className="px-2 py-0.5 bg-white/20 rounded text-[9px] font-black uppercase tracking-tight">
                                    {stats.plan || 'FREE'}
                                </div>
                            </div>

                            <div className="space-y-1 relative z-10">
                                <div className="w-full h-2.5 bg-white/20 rounded-full overflow-hidden p-0.5">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${Math.min(100, (((stats.usedToday || 0) / (stats.limit || 3)) * 100))}%` }}
                                        transition={{ duration: 1.5, ease: "easeOut" }}
                                        className="h-full bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                                    ></motion.div>
                                </div>
                                <p className="text-[9px] font-bold opacity-80">
                                    {(stats.limit || 3) >= 999 ? t('dashboard.quota_unlimited') : t('dashboard.quota_remaining', { count: Math.max(0, (stats.limit || 3) - (stats.usedToday || 0)) })}
                                </p>
                            </div>

                            {stats.limit < 10 && (
                                <Link to="/plans" className="mt-auto py-2 bg-white text-indigo-600 rounded-xl text-[9px] font-black uppercase tracking-widest text-center hover:bg-slate-50 transition-colors relative z-10">
                                    {t('dashboard.upgrade_quota')}
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Quick Tools Grid */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-display font-black text-slate-900 dark:text-white uppercase tracking-tight">
                                {t('dashboard.quick_tools')}
                            </h3>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                            {[
                                { to: '/auditor-loja', label: t('sidebar.auditor_loja'), icon: '🌐', color: 'bg-blue-50 text-blue-600' },
                                { to: '/consulta-cnpj', label: t('sidebar.consulta_cnpj'), icon: '🏢', color: 'bg-indigo-50 text-indigo-600' },
                                { to: '/verifica-pix', label: t('sidebar.verifica_pix'), icon: '💸', color: 'bg-teal-50 text-teal-600' },
                                { to: '/analise-telefone', label: t('sidebar.analise_telefone'), icon: '📱', color: 'bg-emerald-50 text-emerald-600' },
                                { to: '/expansor-links', label: t('sidebar.expansor_links'), icon: '🔗', color: 'bg-amber-50 text-amber-600' },
                                { to: '/analisador-docs', label: t('sidebar.analisador_docs'), icon: '📄', color: 'bg-purple-50 text-purple-600' },
                                { to: '/auditoria-social', label: t('sidebar.auditoria_social'), icon: '👤', color: 'bg-pink-50 text-pink-600' },
                                { to: '/gerador-senhas', label: t('sidebar.gerador_senhas'), icon: '🔑', color: 'bg-slate-50 text-slate-600' },
                                { to: '/academy-advanced', label: t('sidebar.simulator_plus'), icon: '🎯', color: 'bg-orange-50 text-orange-600' },
                                { to: '/academy', label: t('sidebar.academy_center'), icon: '🎓', color: 'bg-indigo-600 text-white' }
                            ].map((tool, idx) => (
                                <Link
                                    key={idx}
                                    to={tool.to}
                                    className="glass-card p-4 rounded-2xl flex flex-col items-center justify-center gap-3 hover-lift text-center group transition-all"
                                >
                                    <div className={`w-12 h-12 rounded-xl ${tool.color} flex items-center justify-center text-2xl shadow-sm group-hover:scale-110 transition-transform`}>
                                        {tool.icon}
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-tight text-slate-600 dark:text-slate-400">
                                        {tool.label}
                                    </span>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Impact Section: Security Pulse */}
                    <div className="glass-card p-6 lg:p-8 rounded-[2rem] border border-white dark:border-slate-800 bg-mesh shadow-lg overflow-hidden relative transition-all duration-300">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-indigo-500 to-emerald-500 opacity-50"></div>
                        <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-8">
                            <div className="flex-1 space-y-3 text-center lg:text-left">
                                <h3 className="text-lg lg:text-xl font-display font-black text-slate-900 dark:text-white tracking-tight">{t('dashboard.pulse_title')}</h3>
                                <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed text-sm">{t('dashboard.pulse_subtitle')}</p>
                                <div className="flex flex-wrap justify-center lg:justify-start gap-1 pb-1">
                                    {[...Array(30)].map((_, i) => (
                                        <div
                                            key={i}
                                            className={`w-3.5 h-3.5 rounded-sm transition-all hover:scale-125
                                                ${i < stats.seguros ? 'bg-emerald-500' :
                                                    i < stats.total ? 'bg-slate-300' : 'bg-slate-100'}
                                            `}
                                            title={`Evento #${i + 1}`}
                                        ></div>
                                    ))}
                                </div>
                            </div>
                            <div className="w-full lg:w-40 bg-slate-900 rounded-2xl p-5 text-center text-white shadow-xl border-2 border-indigo-500/20">
                                <p className="text-[8px] font-black text-indigo-400 uppercase tracking-widest mb-1">{t('dashboard.shield_score_label')}</p>
                                <p className="text-4xl font-display font-black leading-none">{shieldScore}</p>
                                <div className="mt-2 w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-indigo-500" style={{ width: `${shieldScore}%` }}></div>
                                </div>
                                <p className="text-[8px] text-indigo-200 mt-2 font-bold uppercase">{t('common.shield_score')} AI</p>
                            </div>
                        </div>
                    </div>


                    {/* Quick History Section */}
                    <div className="glass-card rounded-[2.5rem] overflow-hidden border border-white dark:border-slate-800">
                        <div className="px-6 lg:px-8 py-5 lg:py-7 bg-slate-900/5 dark:bg-white/5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                            <h3 className="text-xl font-display font-black text-slate-900 dark:text-white flex items-center gap-3">
                                <button
                                    onClick={() => setIsLogsOpen(!isLogsOpen)}
                                    className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-all"
                                >
                                    <svg className={`w-5 h-5 transition-transform duration-300 ${isLogsOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
                                </button>
                                {t('dashboard.recent_logs_title')}
                            </h3>
                            <Link to="/history" className="text-sm font-black text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 uppercase tracking-widest">{t('dashboard.full_panel')} &rarr;</Link>
                        </div>

                        {isLogsOpen && (
                            <>
                                {recent.length === 0 ? (
                                    <div className="p-16 text-center bg-slate-50/50 flex flex-col items-center">
                                        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-300 mb-4">
                                            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" /></svg>
                                        </div>
                                        <p className="text-slate-500 font-bold max-w-sm leading-relaxed">{t('dashboard.empty_logs')}</p>
                                        <Link to="/analyze" className="mt-6 text-indigo-600 font-black uppercase tracking-widest text-xs py-3 px-6 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition-all">{t('dashboard.start_now')}</Link>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-slate-100 bg-white/40">
                                        {recent.map((item) => (
                                            <div key={item.id} className="p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 hover:bg-white/80 dark:hover:bg-slate-800/50 transition-all group">
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1.5">
                                                        <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-[10px] font-black text-slate-500 dark:text-slate-400 rounded uppercase tracking-wider">{item.type || t('dashboard.types.text')}</span>
                                                        <p className="text-xs font-bold text-slate-400 font-mono">{new Date(item.timestamp).toLocaleTimeString()}</p>
                                                    </div>
                                                    <p className="text-slate-900 dark:text-white font-bold text-base lg:text-lg truncate group-hover:text-indigo-600 transition-colors">{item.content}</p>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <div className="text-right hidden sm:block">
                                                        <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{t('dashboard.evaluation')}</p>
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
                            </>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}

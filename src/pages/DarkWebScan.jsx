import React, { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { API_ENDPOINTS } from '../api/config';
import { useTranslation } from 'react-i18next';

export default function DarkWebScan() {
    const { t } = useTranslation();
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [target, setTarget] = useState('');
    const [scanning, setScanning] = useState(false);
    const [results, setResults] = useState(null);
    const [error, setError] = useState('');

    const handleScan = async (e) => {
        e.preventDefault();
        setScanning(true);
        setResults(null);
        setError('');

        try {
            const response = await fetch(API_ENDPOINTS.DARKWEB_SCAN, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({ target })
            });
            const data = await response.json();
            if (response.ok) {
                setResults(data);
            } else {
                throw new Error(data.error);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setScanning(false);
        }
    };

    return (
        <div className="animate-slide-up max-w-7xl mx-auto space-y-12 pb-20 px-4 md:px-0">
            <div className="flex justify-start">
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
            {/* Header */}
            <div className="text-center space-y-4 max-w-3xl mx-auto">
                <div className="inline-flex px-4 py-2 bg-indigo-50 dark:bg-indigo-950/30 rounded-full text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800">
                    {t('tools.dark_web.badge')}
                </div>
                <h2 className="text-5xl font-display font-black text-slate-900 dark:text-white tracking-tighter">
                    {t('tools.dark_web.title_start')} <span className="text-indigo-600">{t('tools.dark_web.title_highlight')}</span> 🕵️‍♂️
                </h2>
                <p className="text-slate-500 dark:text-slate-400 text-xl font-medium leading-relaxed">
                    {t('tools.dark_web.subtitle')}
                </p>
            </div>

            {/* Scan Interface */}
            <div className="max-w-4xl mx-auto">
                {!results && !scanning && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass-card p-8 md:p-12 rounded-[2.5rem] md:rounded-[4rem] border border-white dark:border-slate-800 shadow-2xl text-center space-y-10"
                    >
                        <div className="w-20 h-20 md:w-24 md:h-24 bg-slate-900 rounded-[2rem] md:rounded-[2.5rem] mx-auto flex items-center justify-center text-4xl md:text-5xl shadow-2xl relative">
                            <div className="absolute inset-0 bg-indigo-500/20 blur-[30px] rounded-full animate-pulse"></div>
                            🔎
                        </div>

                        <form onSubmit={handleScan} className="space-y-6 max-w-xl mx-auto">
                            <div className="relative group">
                                <input
                                    type="text"
                                    required
                                    value={target}
                                    onChange={e => setTarget(e.target.value)}
                                    placeholder={t('tools.dark_web.placeholder')}
                                    className="w-full h-16 md:h-20 bg-slate-50 dark:bg-slate-950 rounded-[1.5rem] md:rounded-[2rem] border-2 border-slate-100 dark:border-slate-800 px-6 md:px-10 text-base md:text-xl font-bold focus:border-indigo-500 outline-none transition-all pr-36 md:pr-44 text-slate-800 dark:text-white shadow-inner"
                                />
                                <button
                                    type="submit"
                                    className="absolute right-2 md:right-3 top-2 md:top-3 bottom-2 md:bottom-3 px-5 md:px-8 bg-indigo-600 text-white rounded-[1rem] md:rounded-[1.5rem] font-black uppercase tracking-widest text-[10px] md:text-xs hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-500/20"
                                >
                                    {t('tools.dark_web.btn_start')}
                                </button>
                            </div>
                            <p className="text-[10px] md:text-xs text-slate-400 font-medium tracking-tight">{t('tools.dark_web.privacy_note')}</p>
                        </form>
                    </motion.div>
                )}

                {/* Scanning Animation */}
                <AnimatePresence>
                    {scanning && (
                        <motion.div
                            key="scanning"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="glass-card p-20 rounded-[4rem] border border-white dark:border-slate-800 shadow-2xl text-center space-y-12 overflow-hidden relative"
                        >
                            {/* Scanning Layers Decor */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
                                <div className="w-[600px] h-[600px] border border-indigo-500 rounded-full animate-ping"></div>
                                <div className="absolute w-[400px] h-[400px] border border-indigo-500 rounded-full animate-ping-slow"></div>
                            </div>

                            <div className="relative z-10 space-y-8">
                                <div className="text-6xl animate-pulse">🛰️</div>
                                <div className="space-y-4">
                                    <h3 className="text-3xl font-display font-black text-slate-900 dark:text-white">{t('tools.dark_web.scanning_title')}</h3>
                                    <p className="text-slate-400 font-mono text-sm">
                                        {t('tools.dark_web.scanning_sub')} <span className="text-indigo-500 font-black">{t('tools.dark_web.active_label')}</span>
                                    </p>
                                </div>
                                <div className="w-full h-3 bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden max-w-md mx-auto border border-slate-200 dark:border-slate-800">
                                    <motion.div
                                        initial={{ width: "0%" }}
                                        animate={{ width: "100%" }}
                                        transition={{ duration: 2, ease: "linear" }}
                                        className="h-full bg-indigo-600 shadow-[0_0_20px_rgba(79,70,229,0.5)]"
                                    ></motion.div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Results View */}
                <AnimatePresence>
                    {results && (
                        <motion.div
                            key="results"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="space-y-8"
                        >
                            <div className={`glass-card p-10 rounded-[3rem] border-2 shadow-2xl text-center space-y-6 ${results.count > 0 ? 'border-red-500/20 bg-red-50/10' : 'border-emerald-500/20 bg-emerald-50/10'}`}>
                                <div className={`text-6xl ${results.count > 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                                    {results.count > 0 ? '⚠️' : '✅'}
                                </div>
                                <h3 className="text-3xl font-display font-black text-slate-900 dark:text-white">
                                    {results.count > 0 ? t('tools.dark_web.found_leaks', { count: results.count }) : t('tools.dark_web.no_leaks')}
                                </h3>
                                <p className="text-slate-500 dark:text-slate-400 font-medium">
                                    {results.count > 0
                                        ? t('tools.dark_web.leaks_desc')
                                        : t('tools.dark_web.clean_desc')
                                    }
                                </p>
                                <button
                                    onClick={() => setResults(null)}
                                    className="text-xs font-black text-indigo-600 uppercase tracking-widest hover:underline"
                                >
                                    {t('tools.dark_web.new_scan')}
                                </button>
                            </div>

                            {results.count > 0 && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {results.leaks.map((leak, i) => (
                                        <div key={i} className="glass-card p-8 rounded-[2.5rem] border border-white dark:border-slate-800 shadow-xl space-y-4 group hover:border-red-500/30 transition-colors">
                                            <div className="flex justify-between items-start">
                                                <div className="w-12 h-12 bg-red-50 dark:bg-red-950/30 rounded-2xl flex items-center justify-center text-xl">💀</div>
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{leak.date}</span>
                                            </div>
                                            <div className="space-y-1">
                                                <h4 className="text-lg font-black text-slate-900 dark:text-white">{leak.source}</h4>
                                                <p className="text-xs text-red-500 font-bold uppercase tracking-widest">{t('tools.dark_web.exposed_data')} {leak.data}</p>
                                            </div>
                                            <p className="text-xs text-slate-500 leading-relaxed">
                                                {t('tools.dark_web.suggestion')}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Recommendations if leaks found */}
                            {results.count > 0 && (
                                <div className="p-10 bg-slate-900 rounded-[3rem] text-white space-y-6">
                                    <h4 className="text-xl font-black">🛡️ {t('tools.dark_web.resilience_guide')}</h4>
                                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {t('tools.dark_web.tips', { returnObjects: true }).map((tip, i) => (
                                            <li key={i} className="flex items-start gap-4">
                                                <span className="w-6 h-6 bg-white/10 rounded flex items-center justify-center text-[10px] font-black">{i + 1}</span>
                                                <span className="text-sm font-medium text-slate-400">{tip}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

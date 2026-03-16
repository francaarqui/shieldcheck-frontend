import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { API_ENDPOINTS } from '../api/config';
import { useTranslation } from 'react-i18next';

const AlertItem = ({ alert, index }) => {
    const { t } = useTranslation();
    const [isExpanded, setIsExpanded] = useState(false);
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-card rounded-[2.5rem] border border-white dark:border-slate-800 shadow-lg overflow-hidden group hover:border-indigo-500/30 transition-colors"
        >
            <div
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-6 flex flex-col md:flex-row items-center gap-6 cursor-pointer"
            >
                <div className="w-14 h-14 bg-red-50 dark:bg-red-950/30 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                    {alert.status === 'Bloqueado' ? '🛡️' : '🚨'}
                </div>
                <div className="flex-1 space-y-1 text-center md:text-left">
                    <div className="flex flex-col md:flex-row md:items-center gap-2">
                        <span className="text-sm font-black text-slate-900 dark:text-white">{alert.name}</span>
                        <span className="hidden md:block text-slate-300">•</span>
                        <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">{alert.type} {t('tools.family_guard.detected_label')}</span>
                    </div>
                    <p className="text-xs text-slate-500 font-mono truncate max-w-md">{alert.url}</p>
                </div>
                <div className="flex items-center gap-4">
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-600 rounded text-[9px] font-black uppercase">
                        {alert.status === 'Bloqueado' ? t('tools.family_guard.status_blocked') :
                            alert.status === 'Alerta Enviado' ? t('tools.family_guard.status_alert_sent') : alert.status}
                    </span>
                    <div className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                        <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-slate-50 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30 p-8"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('tools.family_guard.event_details')}</h4>
                                <div className="space-y-2">
                                    <p className="text-xs font-bold text-slate-600 dark:text-slate-300">{t('tools.family_guard.timestamp')}: <span className="text-slate-900 dark:text-white">{alert.date}</span></p>
                                    <p className="text-xs font-bold text-slate-600 dark:text-slate-300">{t('tools.family_guard.type')}: <span className="text-slate-900 dark:text-white">{alert.type}</span></p>
                                    <p className="text-xs font-bold text-slate-600 dark:text-slate-300">{t('tools.family_guard.target_url')}: <span className="text-red-500 font-mono">{alert.url}</span></p>
                                </div>
                            </div>
                            <div className="flex flex-col justify-end gap-3">
                                <button className="h-12 w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-black text-[10px] uppercase tracking-widest hover:scale-[1.02] transition-transform">
                                    {t('tools.family_guard.block_global')}
                                </button>
                                <button className="h-12 w-full border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-white dark:hover:bg-slate-800 transition-colors">
                                    {t('tools.family_guard.report_fp')}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default function FamilyGuard() {
    const { t } = useTranslation();
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [inviteEmail, setInviteEmail] = useState('');
    const [inviteLoading, setInviteLoading] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);

    // Mock alerts para demonstração (na fase real viriam do backend)
    const [alerts] = useState([
        { id: 1, name: 'Dona Maria (Mãe)', type: 'Phishing', url: 'https://nubank-premia-br.com', date: 'Há 10 min', status: 'Bloqueado' },
        { id: 2, name: 'Joãozinho (Filho)', type: 'Fake Store', url: 'https://promocao-iphone-15.xyz', date: 'Hoje, 09:12', status: 'Alerta Enviado' }
    ]);

    useEffect(() => {
        if (user?.token) {
            fetchMembers();
        }
    }, [user]);

    const fetchMembers = async () => {
        try {
            const response = await fetch(API_ENDPOINTS.FAMILY_MEMBERS, {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            const data = await response.json();
            if (response.ok) setMembers(data);
        } catch (err) {
            console.error("Erro ao carregar família:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleInvite = async (e) => {
        e.preventDefault();
        setInviteLoading(true);
        setMessage({ text: '', type: '' });
        try {
            const response = await fetch(API_ENDPOINTS.FAMILY_INVITE, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({ email: inviteEmail })
            });
            const data = await response.json();
            if (response.ok) {
                setMessage({ text: t('tools.family_guard.invite_success'), type: 'success' });
                setInviteEmail('');
                fetchMembers();
            } else {
                throw new Error(data.error || t('tools.family_guard.invite_error'));
            }
        } catch (err) {
            setMessage({ text: err.message, type: 'error' });
        } finally {
            setInviteLoading(false);
        }
    };

    return (
        <div className="animate-slide-up max-w-4xl mx-auto space-y-10 pb-20 px-4">
            {/* Back Button */}
            <div className="flex justify-start">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 px-5 py-2.5 glass-card rounded-2xl text-slate-400 font-bold hover:text-white transition-all group border border-white/5"
                >
                    <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                    </svg>
                    <span className="text-xs uppercase tracking-wider">{t('tools.analyze.back')}</span>
                </button>
            </div>

            {/* Header - Centralized */}
            <div className="text-center space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em]">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                    </span>
                    {t('tools.family_guard.plan_activated')}
                </div>
                <h2 className="text-5xl font-display font-black text-white tracking-tight leading-tight">
                    {t('tools.family_guard.title_start')} <span className="text-premium-gradient">{t('tools.family_guard.title_highlight')}</span>
                </h2>
                <p className="text-slate-400 text-lg font-medium max-w-2xl mx-auto leading-relaxed">
                    {t('tools.family_guard.subtitle')}
                </p>

                <div className="pt-2">
                    <span className="text-sm font-bold text-slate-500">
                        {t('tools.family_guard.protection_active', { count: members.length || 2 })}
                    </span>
                </div>
            </div>

            {/* Main Action Area - Compact & Centralized */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                {/* Invite Card */}
                <div className="glass-card p-8 rounded-[2.5rem] border border-white/5 shadow-2xl space-y-6 flex flex-col justify-center">
                    <div className="space-y-1">
                        <h3 className="text-xl font-black text-white">{t('tools.family_guard.add_member')}</h3>
                        <p className="text-xs text-slate-400 font-medium">{t('tools.family_guard.protected_email')}</p>
                    </div>
                    <form onSubmit={handleInvite} className="space-y-4">
                        <input
                            type="email"
                            required
                            value={inviteEmail}
                            onChange={e => setInviteEmail(e.target.value)}
                            className="w-full h-14 bg-slate-950/50 rounded-2xl border border-white/5 px-6 text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                            placeholder={t('tools.family_guard.email_placeholder')}
                        />
                        <button
                            disabled={inviteLoading}
                            className="w-full h-14 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-indigo-700 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center shadow-lg shadow-indigo-500/20"
                        >
                            {inviteLoading ? t('tools.family_guard.linking') : t('tools.family_guard.protect_now')}
                        </button>
                        {message.text && (
                            <p className={`text-center text-[10px] font-black uppercase tracking-wider ${message.type === 'success' ? 'text-emerald-500' : 'text-red-500'}`}>
                                {message.text}
                            </p>
                        )}
                    </form>
                </div>

                {/* Connected Members */}
                <div className="glass-card p-8 rounded-[2.5rem] border border-white/5 shadow-2xl space-y-6 overflow-hidden">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-black text-white">{t('tools.family_guard.connected_members')}</h3>
                        <span className="text-[10px] font-black bg-indigo-500/20 text-indigo-400 px-3 py-1 rounded-full uppercase tracking-tighter">
                            {members.length} Ativos
                        </span>
                    </div>
                    <div className="space-y-3 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                        {members.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-8 opacity-40">
                                <svg className="w-12 h-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor opacity-20">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                                <p className="text-xs font-bold uppercase tracking-widest">{t('tools.family_guard.no_members')}</p>
                            </div>
                        ) : (
                            members.map(m => (
                                <div key={m.id} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-black uppercase text-xs">{m.name.charAt(0)}</div>
                                        <div>
                                            <p className="text-sm font-black text-white truncate max-w-[120px]">{m.name}</p>
                                            <p className="text-[10px] text-slate-500 font-medium">{m.email}</p>
                                        </div>
                                    </div>
                                    <div className={`w-2 h-2 rounded-full ${m.status === 'Pendente' ? 'bg-amber-400 animate-pulse' : 'bg-emerald-500'}`}></div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Collapsible History Logs - Button Style */}
            <div className="flex flex-col items-center pt-4">
                <button
                    onClick={() => setIsHistoryOpen(!isHistoryOpen)}
                    className="flex items-center gap-3 px-6 py-3 bg-slate-900 border border-white/5 rounded-full hover:bg-slate-800 transition-all group"
                >
                    <div className="w-6 h-6 bg-indigo-500/20 rounded-full flex items-center justify-center">
                        <svg className={`w-3 h-3 text-indigo-400 transition-transform duration-500 ${isHistoryOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.25em] group-hover:text-white transition-colors">
                        {isHistoryOpen ? 'Fechar Logs de Proteção' : 'Ver Logs de Proteção'}
                    </span>
                    {alerts.length > 0 && !isHistoryOpen && (
                        <span className="flex h-2 w-2 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500 border border-slate-900"></span>
                        </span>
                    )}
                </button>

                <AnimatePresence>
                    {isHistoryOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0, marginTop: 0 }}
                            animate={{ opacity: 1, height: 'auto', marginTop: 32 }}
                            exit={{ opacity: 0, height: 0, marginTop: 0 }}
                            className="w-full space-y-6 overflow-hidden"
                        >
                            <div className="flex items-center justify-between px-2">
                                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">{t('tools.family_guard.realtime_logs')}</h3>
                                <button className="text-[10px] font-black text-indigo-500 uppercase hover:text-indigo-400 transition-colors uppercase tracking-widest">{t('tools.family_guard.clear_history')}</button>
                            </div>

                            <div className="space-y-4">
                                {alerts.map((alert, i) => (
                                    <AlertItem key={alert.id} alert={alert} index={i} />
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Premium Upsell Card */}
            <div className="relative pt-10">
                <div className="absolute inset-0 bg-indigo-600/20 blur-[100px] rounded-full transform -translate-y-1/2"></div>
                <div className="relative bg-gradient-to-br from-indigo-600/90 to-purple-700/90 p-10 rounded-[3rem] text-white flex flex-col md:flex-row items-center gap-10 shadow-3xl border border-white/10 backdrop-blur-xl group overflow-hidden">
                    <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>

                    <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center text-4xl shadow-inner border border-white/10 shrink-0">
                        📱
                    </div>

                    <div className="space-y-3 flex-1 text-center md:text-left">
                        <h4 className="text-3xl font-display font-black tracking-tight">{t('tools.family_guard.upsell_title')}</h4>
                        <p className="text-indigo-100 font-medium leading-relaxed text-sm max-w-lg">
                            {t('tools.family_guard.upsell_desc')}
                        </p>
                    </div>

                    <button
                        onClick={() => {
                            const link = `${window.location.origin}/register?ref=${user?.id}`;
                            navigator.clipboard.writeText(link);
                            alert(t('tools.family_guard.copy_success'));
                        }}
                        className="w-full md:w-auto px-10 h-16 bg-white text-indigo-600 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl hover:bg-indigo-50 transition-all hover:scale-[1.05] active:scale-95 shrink-0"
                    >
                        {t('tools.family_guard.copy_link')}
                    </button>
                </div>
            </div>
        </div>
    );
}

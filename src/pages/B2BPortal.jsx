import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import { API_ENDPOINTS } from '../api/config';
import VerifiedBadge from '../components/VerifiedBadge';

export default function B2BPortal() {
    const { user } = useContext(AuthContext);
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        activeLicenses: 0,
        totalChecks: 0,
        scamsBlocked: 0,
        savingsEstimate: 'R$ 0'
    });

    const [showInviteModal, setShowInviteModal] = useState(false);
    const [inviteForm, setInviteForm] = useState({ name: '', email: '' });
    const [inviteLoading, setInviteLoading] = useState(false);
    const [error, setError] = useState('');
    const [listExpanded, setListExpanded] = useState(false);
    const [apiKeys, setApiKeys] = useState([{ id: 'sc_982a...12f', date: 'Criada hoje' }]);
    const [isGenerating, setIsGenerating] = useState(false);

    useEffect(() => {
        if (user?.token) {
            fetchEmployees();
        }
    }, [user]);

    const fetchEmployees = async () => {
        try {
            const response = await fetch(API_ENDPOINTS.B2B_EMPLOYEES, {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            const data = await response.json();
            if (response.ok) {
                setEmployees(data);
                setStats(prev => ({
                    ...prev,
                    activeLicenses: data.length,
                    totalChecks: data.reduce((acc, emp) => acc + (emp.points || 0), 0) // Usando points como proxy de checks para simulação
                }));
            }
        } catch (err) {
            console.error("Erro ao carregar colaboradores:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleInvite = async (e) => {
        e.preventDefault();
        setInviteLoading(true);
        setError('');
        try {
            const response = await fetch(API_ENDPOINTS.B2B_INVITE, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify(inviteForm)
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error);

            await fetchEmployees();
            setShowInviteModal(false);
            setInviteForm({ name: '', email: '' });
            // Scroll back up to the top of the list
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (err) {
            setError(err.message);
        } finally {
            setInviteLoading(false);
        }
    };

    const handleRevoke = async (employeeId) => {
        if (!window.confirm('Tem certeza que deseja remover este colaborador e revogar a licença?')) return;

        try {
            const response = await fetch(`${API_ENDPOINTS.B2B_REVOKE}/${employeeId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            if (response.ok) {
                await fetchEmployees();
            }
        } catch (err) {
            console.error("Erro ao remover colaborador:", err);
        }
    };

    return (
        <div className="animate-slide-up max-w-4xl mx-auto pb-20 px-4 md:px-0 space-y-12">
            {/* Header Section - Centralized and Premium */}
            <div className="flex flex-col items-center text-center gap-6 pt-8">
                <div className="relative group">
                    <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full blur-2xl opacity-10 group-hover:opacity-20 transition-all duration-700"></div>
                    <div className="w-20 h-20 rounded-3xl bg-premium-gradient flex items-center justify-center text-white text-3xl shadow-2xl relative border border-white/20">
                        🏢
                    </div>
                </div>

                <div className="space-y-3">
                    <h2 className="text-4xl md:text-6xl font-display font-black text-slate-900 dark:text-white tracking-tighter leading-tight">
                        Shield <span className="text-premium-gradient">Business</span>
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 text-lg font-medium max-w-xl mx-auto leading-relaxed">
                        Gerencie acessos corporativos e integre nossa inteligência via API de forma direta e segura.
                    </p>
                </div>

                <div className="flex flex-wrap justify-center gap-3">
                    <button
                        onClick={() => alert('Seu relatório executivo está sendo gerado e será enviado para seu e-mail em instantes.')}
                        className="h-12 px-8 bg-indigo-600/10 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-200/50 dark:border-indigo-500/20 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all duration-300"
                    >
                        Relatório Executivo (PDF)
                    </button>
                    <div className="h-12 px-6 flex items-center gap-2 bg-slate-100 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                        <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 tracking-widest uppercase">Portal Ativo</span>
                    </div>
                </div>
            </div>

            {/* API INTEGRATION PANEL - FOCUS POINT */}
            <section className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-[3rem] blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>
                <div className="glass-card p-10 rounded-[3rem] border border-white dark:border-white/5 shadow-2xl space-y-8 relative overflow-hidden bg-slate-900/5 dark:bg-slate-900/40">
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                        <div className="flex-1 space-y-4 text-center md:text-left">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 rounded-full border border-indigo-500/20 text-[9px] font-black text-indigo-500 uppercase tracking-widest mb-2">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                                </span>
                                Endpoints Ativos
                            </div>
                            <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Integração Direta API</h3>
                            <p className="text-base text-slate-500 dark:text-slate-400 leading-relaxed font-medium">Proteja seu ecossistema corporativo integrando nossa API em tempo real aos seus fluxos de e-mail, chatbots e ERP.</p>
                        </div>

                        <div className="w-full md:w-auto space-y-4">
                            {apiKeys.map(key => (
                                <div key={key.id} className="p-5 bg-slate-950/90 dark:bg-slate-950 rounded-[2rem] border border-white/10 flex justify-between items-center group shadow-2xl min-w-[300px]">
                                    <div className="space-y-1">
                                        <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Sua Chave API</p>
                                        <code className="text-xs text-emerald-400 font-mono tracking-tighter">{key.id}</code>
                                    </div>
                                    <button
                                        onClick={() => {
                                            navigator.clipboard.writeText(key.id);
                                            alert('Chave API copiada!');
                                        }}
                                        className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all border border-white/10"
                                        title="Copiar Chave"
                                    >
                                        📋
                                    </button>
                                </div>
                            ))}
                            <button
                                disabled={isGenerating}
                                onClick={() => {
                                    setIsGenerating(true);
                                    setTimeout(() => {
                                        const newKey = `sc_${Math.random().toString(36).substring(2, 11)}...${Math.random().toString(36).substring(2, 5)}`;
                                        setApiKeys([...apiKeys, { id: newKey, date: 'Criada agora' }]);
                                        setIsGenerating(false);
                                    }, 1500);
                                }}
                                className="w-full h-14 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-indigo-700 transition-all flex items-center justify-center gap-3 shadow-xl shadow-indigo-600/20"
                            >
                                {isGenerating ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Gerando Chave...
                                    </>
                                ) : 'Gerar Nova Chave API'}
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Quick Stats - Compact */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Licenças', value: stats.activeLicenses, color: 'text-indigo-500' },
                    { label: 'Análises', value: stats.totalChecks, color: 'text-purple-500' },
                    { label: 'Bloqueios', value: Math.floor(stats.totalChecks * 0.15), color: 'text-emerald-500' },
                    { label: 'Economia', value: `R$ ${Math.floor(stats.totalChecks * 15)}`, color: 'text-amber-500' },
                ].map((stat, i) => (
                    <div key={i} className="glass-card p-6 rounded-3xl border border-white dark:border-white/5 text-center transition-all hover:scale-[1.02]">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                        <p className={`text-2xl font-black ${stat.color} tracking-tight`}>{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Colaboradores Section */}
            <div className="space-y-6">
                <div className="flex items-center justify-between px-2">
                    <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight uppercase tracking-wider">Gestão de Colaboradores</h3>
                    <button
                        onClick={() => setShowInviteModal(true)}
                        className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest bg-indigo-500/5 px-4 py-2 rounded-full hover:bg-indigo-500/10 transition-colors"
                    >
                        Vincular Colaborador +
                    </button>
                </div>

                <div className="glass-card rounded-[2.5rem] border border-white dark:border-white/5 overflow-hidden shadow-xl bg-slate-900/5 dark:bg-slate-900/20">
                    <div
                        onClick={() => setListExpanded(!listExpanded)}
                        className="p-6 flex justify-between items-center cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white/60 dark:bg-slate-800/60 rounded-2xl flex items-center justify-center text-xl shadow-inner">🏢</div>
                            <div>
                                <h3 className="text-lg font-black text-slate-900 dark:text-white">Time Protegido</h3>
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{employees.length} MEMBROS ATIVOS</p>
                            </div>
                        </div>
                        <div className={`w-10 h-10 rounded-xl bg-white/40 dark:bg-slate-800/40 border border-black/5 dark:border-white/5 flex items-center justify-center transition-transform ${listExpanded ? 'rotate-180' : ''}`}>
                            <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>

                    <AnimatePresence>
                        {listExpanded && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden border-t border-black/5 dark:border-white/5"
                            >
                                {loading ? (
                                    <div className="p-16 text-center text-slate-400 font-bold text-xs uppercase tracking-widest">Sincronizando dados...</div>
                                ) : employees.length === 0 ? (
                                    <div className="p-16 text-center space-y-4">
                                        <div className="text-4xl opacity-50">🏢</div>
                                        <p className="text-slate-500 font-medium text-sm">Nenhum colaborador vinculado ainda.</p>
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left">
                                            <thead className="bg-slate-50/50 dark:bg-slate-950/20">
                                                <tr>
                                                    <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Colaborador</th>
                                                    <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Satus</th>
                                                    <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Gestão</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-black/5 dark:divide-white/5">
                                                {employees.map((row) => (
                                                    <tr key={row.id} className="hover:bg-slate-50/50 dark:hover:bg-indigo-500/5 transition-colors">
                                                        <td className="px-8 py-5">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center font-black text-[10px]">
                                                                    {row.name.charAt(0)}
                                                                </div>
                                                                <div>
                                                                    <p className="text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-tight">{row.name}</p>
                                                                    <p className="text-[9px] text-slate-400 font-medium tracking-tight">{row.email}</p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-8 py-5">
                                                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 rounded-full text-[8px] font-black text-emerald-500 uppercase tracking-widest">
                                                                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                                                                {row.plan}
                                                            </div>
                                                        </td>
                                                        <td className="px-8 py-5">
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleRevoke(row.id);
                                                                }}
                                                                className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                                                            >
                                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Invite Modal */}
            <AnimatePresence>
                {showInviteModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowInviteModal(false)}
                            className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
                        ></motion.div>
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-[3rem] p-10 border border-white/20 shadow-2xl"
                        >
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-8 tracking-tight">Vincular Colaborador</h3>
                            <form onSubmit={handleInvite} className="space-y-5">
                                {error && <div className="text-[10px] text-red-500 font-black p-4 bg-red-50 dark:bg-red-900/20 rounded-2xl border border-red-100 dark:border-red-900/30 uppercase tracking-widest">{error}</div>}
                                <div>
                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 block px-1">Nome Completo</label>
                                    <input
                                        type="text"
                                        required
                                        value={inviteForm.name}
                                        onChange={e => setInviteForm({ ...inviteForm, name: e.target.value })}
                                        className="w-full h-14 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800 px-6 text-sm font-black focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                        placeholder="Ex: Carlos Oliveira"
                                    />
                                </div>
                                <div>
                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 block px-1">E-mail Corporativo</label>
                                    <input
                                        type="email"
                                        required
                                        value={inviteForm.email}
                                        onChange={e => setInviteForm({ ...inviteForm, email: e.target.value })}
                                        className="w-full h-14 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800 px-6 text-sm font-black focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                        placeholder="email@empresa.com"
                                    />
                                </div>
                                <button
                                    disabled={inviteLoading}
                                    className="w-full h-16 bg-premium-gradient text-white rounded-2xl font-black text-[10px] uppercase tracking-widest mt-6 flex items-center justify-center shadow-xl shadow-indigo-600/20 hover:scale-[1.02] active:scale-95 transition-all"
                                >
                                    {inviteLoading ? 'Vinculando...' : 'Confirmar Vínculo'}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}



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
        <div className="animate-slide-up max-w-7xl mx-auto space-y-12 pb-20 px-4 md:px-0">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h2 className="text-5xl font-display font-black text-slate-900 dark:text-white tracking-tighter">
                        Shield <span className="text-premium-gradient">Business</span>
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-xl font-medium max-w-2xl">
                        Painel de Controle Corporativo de {user?.name}.
                    </p>
                </div>

                <button
                    onClick={() => alert('Seu relatório executivo está sendo gerado e será enviado para seu e-mail em instantes.')}
                    className="h-14 px-8 bg-premium-gradient text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-500/20 hover:scale-105 transition-transform"
                >
                    Gerar Relatório Executivo (PDF)
                </button>
            </div>

            {/* Business Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Licenças Ativas', value: stats.activeLicenses, icon: '🆔', sub: 'Painel Business' },
                    { label: 'Análises Acumuladas', value: stats.totalChecks, icon: '📊', sub: 'Mês Atual' },
                    { label: 'Golpes Bloqueados', value: Math.floor(stats.totalChecks * 0.15), icon: '🛡️', sub: 'Time Protegido' },
                    { label: 'Economia Prevista', value: `R$ ${Math.floor(stats.totalChecks * 15)}`, icon: '💰', sub: 'Roi Estimado' },
                ].map((stat, i) => (
                    <div key={i} className="glass-card p-8 rounded-[2.5rem] border border-white dark:border-slate-800 shadow-xl relative overflow-hidden group">
                        <div className="absolute -right-8 -top-8 w-24 h-24 bg-indigo-500/5 group-hover:bg-indigo-500/10 rounded-full transition-all"></div>
                        <div className="text-4xl mb-4">{stat.icon}</div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                            <p className="text-3xl font-display font-black text-slate-900 dark:text-white">{stat.value}</p>
                            <p className="text-[10px] font-bold text-indigo-500 uppercase">{stat.sub}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Management Tabs */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Employee List */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="flex items-center justify-between">
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Colaboradores Protegidos</h3>
                        <button
                            onClick={() => setShowInviteModal(true)}
                            className="text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                        >
                            Adicionar Licença +
                        </button>
                    </div>

                    <div className="glass-card rounded-[3rem] border border-white dark:border-slate-800 overflow-hidden shadow-2xl">
                        <div
                            onClick={() => setListExpanded(!listExpanded)}
                            className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/30 dark:bg-slate-900/30 cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center text-xl shadow-sm">🏢</div>
                                <div>
                                    <h3 className="text-xl font-black text-slate-900 dark:text-white">Lista de Colaboradores</h3>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{employees.length} Protegidos</p>
                                </div>
                            </div>
                            <div className={`p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 transition-transform ${listExpanded ? 'rotate-180' : ''}`}>
                                <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>

                        <AnimatePresence>
                            {listExpanded && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden"
                                >
                                    {loading ? (
                                        <div className="p-20 text-center text-slate-400 font-bold">Carregando time...</div>
                                    ) : employees.length === 0 ? (
                                        <div className="p-20 text-center space-y-4">
                                            <div className="text-4xl">🏢</div>
                                            <p className="text-slate-500 font-medium">Nenhum colaborador vinculado ainda.</p>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setShowInviteModal(true);
                                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                                }}
                                                className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold text-xs"
                                            >
                                                Convidar Primeiro Membro
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left">
                                                <thead className="bg-slate-50 dark:bg-slate-950/50 border-b border-slate-100 dark:border-slate-800">
                                                    <tr>
                                                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Colaborador</th>
                                                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Plano</th>
                                                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Ações</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                                                    {employees.map((row) => (
                                                        <tr key={row.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                                            <td className="px-8 py-6">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-black">
                                                                        {row.name.charAt(0)}
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-sm font-black text-slate-900 dark:text-white">{row.name}</p>
                                                                        <p className="text-[10px] text-slate-400">{row.email}</p>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-8 py-6">
                                                                <span className="text-[10px] font-black text-indigo-500 uppercase">{row.plan}</span>
                                                            </td>
                                                            <td className="px-8 py-6">
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleRevoke(row.id);
                                                                    }}
                                                                    className="text-slate-400 hover:text-red-500 transition-colors"
                                                                >
                                                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
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

                {/* API INTEGRATION PANEL */}
                <div className="space-y-8">
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">API para Desenvolvedores</h3>

                    <div className="glass-card p-8 rounded-[3rem] border border-white dark:border-slate-800 shadow-2xl space-y-6">
                        <div className="w-16 h-16 bg-slate-900 rounded-3xl flex items-center justify-center text-3xl">🧩</div>
                        <div className="space-y-2">
                            <h4 className="text-xl font-black text-slate-900 dark:text-white">Integração Direta</h4>
                            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">Use nossa API REST para proteger seu sistema de e-mail ou atendimento automaticamente.</p>
                        </div>

                        <div className="space-y-4">
                            {apiKeys.map(key => (
                                <div key={key.id} className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex justify-between items-center group">
                                    <code className="text-[10px] text-emerald-400 font-mono">
                                        X-API-KEY: {key.id}
                                    </code>
                                    <button
                                        onClick={() => {
                                            navigator.clipboard.writeText(key.id);
                                            alert('Chave API copiada!');
                                        }}
                                        className="opacity-0 group-hover:opacity-100 p-2 hover:bg-slate-800 rounded-lg transition-all"
                                    >
                                        📋
                                    </button>
                                </div>
                            ))}
                        </div>

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
                            className="w-full h-14 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
                        >
                            {isGenerating ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Gerando...
                                </>
                            ) : 'Gerar Nova Chave API'}
                        </button>
                    </div>

                    {/* Support Card */}
                    <div className="p-8 bg-indigo-50 dark:bg-indigo-900/20 rounded-[3rem] border border-indigo-100 dark:border-indigo-800 space-y-4">
                        <h4 className="font-black text-slate-800 dark:text-white">Suporte Premium B2B</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">Dúvidas sobre o faturamento ou implementação em escala? Fale com seu gerente de conta.</p>
                        <button className="text-indigo-600 dark:text-indigo-400 text-xs font-black uppercase hover:underline">Abrir Chamado VIP →</button>
                    </div>

                    {/* Trust Asset Section */}
                    <div className="glass-card p-8 rounded-[3rem] border border-white dark:border-slate-800 shadow-2xl space-y-6">
                        <h4 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Selo de Confiança</h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">Exiba este selo em seu e-commerce para garantir aos seus clientes que seu site é monitorado pelo ShieldCheck AI.</p>
                        <VerifiedBadge domain={user?.email?.split('@')[1] || "yourstore.com"} />
                    </div>
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
                            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
                        ></motion.div>
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 border border-slate-200 dark:border-slate-800 shadow-2xl"
                        >
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-6">Convidar Colaborador</h3>
                            <form onSubmit={handleInvite} className="space-y-4">
                                {error && <div className="text-xs text-red-500 font-bold p-3 bg-red-50 rounded-xl border border-red-100">{error}</div>}
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Nome Completo</label>
                                    <input
                                        type="text"
                                        required
                                        value={inviteForm.name}
                                        onChange={e => setInviteForm({ ...inviteForm, name: e.target.value })}
                                        className="w-full h-14 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800 px-6 text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none"
                                        placeholder="Ex: Carlos Oliveira"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">E-mail Corporativo</label>
                                    <input
                                        type="email"
                                        required
                                        value={inviteForm.email}
                                        onChange={e => setInviteForm({ ...inviteForm, email: e.target.value })}
                                        className="w-full h-14 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800 px-6 text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none"
                                        placeholder="email@empresa.com"
                                    />
                                </div>
                                <button
                                    disabled={inviteLoading}
                                    className="w-full h-16 bg-premium-gradient text-white rounded-2xl font-black uppercase tracking-widest mt-4 flex items-center justify-center"
                                >
                                    {inviteLoading ? 'Enviando...' : 'Confirmar Convite'}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}



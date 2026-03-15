import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import { API_URL } from '../api/config';

export default function AdminDashboard() {
    const { user } = useContext(AuthContext);
    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [tableExpanded, setTableExpanded] = useState(false);

    useEffect(() => {
        if (user) {
            fetchStats();
            fetchUsers();
        }
    }, [user]);

    const fetchStats = async () => {
        const token = localStorage.getItem('token') || user?.token;
        if (!token) return;
        try {
            const res = await fetch(`${API_URL}/api/admin/stats`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.error) throw new Error(data.error);
            setStats(data);
        } catch (err) {
            setError(err.message);
        }
    };

    const fetchUsers = async () => {
        const token = localStorage.getItem('token') || user?.token;
        if (!token) return;
        try {
            const res = await fetch(`${API_URL}/api/admin/users`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.error) throw new Error(data.error);
            setUsers(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="glass-card p-8 rounded-3xl text-center space-y-4 border border-red-500/20">
                    <div className="text-4xl">🚫</div>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white">Acesso Restrito</h2>
                    <p className="text-slate-500 dark:text-slate-400">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto py-12 px-4 space-y-12">
            <div className="space-y-2">
                <div className="inline-flex gap-2 px-4 py-1.5 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-400 rounded-full text-[10px] font-black uppercase tracking-widest">Painel Administrativo</div>
                <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tight">Torre de <span className="text-premium-gradient">Comando</span></h1>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Total Usuários', value: stats?.totalUsers || 0, icon: '👥', color: 'indigo' },
                    { label: 'Premium (Solo Bot)', value: stats?.premiumUsers || 0, icon: '💎', color: 'amber' },
                    { label: 'Análises Realizadas', value: stats?.totalAnalyses || 0, icon: '🛡️', color: 'emerald' },
                    { label: 'MRR Estimado', value: `R$ ${stats?.mrr?.toFixed(2) || '0.00'}`, icon: '💰', color: 'blue' }
                ].map((kpi, i) => (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        key={kpi.label}
                        className="glass-card p-6 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl overflow-hidden relative group"
                    >
                        <div className={`absolute top-0 right-0 p-4 text-4xl opacity-10 group-hover:scale-125 transition-transform`}>{kpi.icon}</div>
                        <div className="relative z-10 space-y-1">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{kpi.label}</p>
                            <p className="text-3xl font-black text-slate-900 dark:text-white">{kpi.value}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Users Table */}
            <div className="glass-card rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-2xl overflow-hidden">
                <div
                    onClick={() => setTableExpanded(!tableExpanded)}
                    className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/30 dark:bg-slate-900/30 cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center text-xl shadow-sm">👥</div>
                        <div>
                            <h3 className="text-xl font-black text-slate-900 dark:text-white">Gerenciamento de Usuários</h3>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{users.length} Registros Recentes</p>
                        </div>
                    </div>
                    <div className={`p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 transition-transform ${tableExpanded ? 'rotate-180' : ''}`}>
                        <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>

                <AnimatePresence>
                    {tableExpanded && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/50 dark:bg-slate-900/50">
                                            <th className="px-8 py-4">Usuário</th>
                                            <th className="px-8 py-4">E-mail</th>
                                            <th className="px-8 py-4">Plano</th>
                                            <th className="px-8 py-4">Fidelidade</th>
                                            <th className="px-8 py-4">Data Cadastro</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                        {users.map((u) => (
                                            <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-black text-slate-500 text-xs uppercase">
                                                            {u.name[0]}
                                                        </div>
                                                        <span className="font-bold text-slate-900 dark:text-white">{u.name}</span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6 font-medium text-slate-500 dark:text-slate-400">{u.email}</td>
                                                <td className="px-8 py-6">
                                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${u.plan !== 'FREE'
                                                        ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                                                        : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                                                        }`}>
                                                        {u.plan}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                                                        <span className="font-bold text-slate-900 dark:text-white">{u.points} pts</span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6 text-slate-400 font-medium">{new Date(u.created_at).toLocaleDateString('pt-BR')}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

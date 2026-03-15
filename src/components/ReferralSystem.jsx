import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { API_ENDPOINTS } from '../api/config';
import { motion, AnimatePresence } from 'framer-motion';

export default function ReferralSystem() {
    const { user } = useContext(AuthContext);
    const [stats, setStats] = useState({
        totalReferrals: 0,
        conversions: '0%',
        totalEarnings: 0,
        link: ''
    });
    const [referrals, setReferrals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [copySuccess, setCopySuccess] = useState(false);
    const [listExpanded, setListExpanded] = useState(false);

    useEffect(() => {
        if (user?.token) {
            fetchAffiliateData();
        }
    }, [user]);

    const fetchAffiliateData = async () => {
        try {
            console.log('🔍 Buscando dados de afiliado...');
            const res = await fetch(API_ENDPOINTS.AFFILIATE_REFERRALS, {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });

            if (!res.ok) throw new Error('Falha na comunicação com o servidor');

            const data = await res.json();
            console.log('✅ Dados de Afiliado Recebidos:', data);

            // Caso o backend envie o formato consolidado
            if (data.stats) {
                const statsWithDynamicLink = {
                    ...data.stats,
                    link: `${window.location.origin}/register?ref=${data.stats.referralCode}`
                };
                setStats(statsWithDynamicLink);
            }
            if (data.list) {
                setReferrals(data.list);
            }

            // Fallback se o backend enviar apenas a lista (array)
            if (Array.isArray(data)) {
                setReferrals(data);
                const activeCount = data.filter(r => r.status === 'Ativo').length;
                const earnings = data.reduce((sum, r) => {
                    const val = parseFloat(r.reward?.replace('R$ ', '').replace(',', '.')) || 0;
                    return sum + val;
                }, 0);

                // Fallback: Tentamos manter consistência mesmo se o stats não vier
                const referralCodeFallback = user?.id ? `SHIELD${user.id}` : 'INVITE';

                setStats({
                    totalReferrals: data.length,
                    conversions: data.length > 0 ? `${Math.round((activeCount / data.length) * 100)}%` : '0%',
                    totalEarnings: earnings,
                    link: `${window.location.origin}/register?ref=${referralCodeFallback}`
                });
            }
        } catch (err) {
            console.error('❌ Erro no Sistema de Afiliados:', err);
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = () => {
        if (stats?.link) {
            navigator.clipboard.writeText(stats.link);
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center p-12">
            <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="space-y-8 animate-fadeIn">
            {/* Banner de Indicação */}
            <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[80px] rounded-full -mr-20 -mt-20"></div>
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
                    <div className="max-w-md text-center md:text-left">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
                            🤝 Programa de Indicação
                        </div>
                        <h2 className="text-4xl font-black mb-4 tracking-tighter leading-tight">Indique o ShieldCheck e ganhe Recompensas.</h2>
                        <p className="text-indigo-100 font-medium mb-8">
                            Compartilhe seu link exclusivo e ganhe benefícios para cada novo usuário ativo.
                        </p>

                        <div className="bg-white/10 backdrop-blur-md p-2 rounded-2xl flex flex-col sm:flex-row items-center gap-2 border border-white/20">
                            <code className="flex-1 px-4 font-mono font-bold text-sm overflow-hidden text-ellipsis whitespace-nowrap">
                                {stats?.link || 'Gerando link...'}
                            </code>
                            <button
                                onClick={copyToClipboard}
                                className={`w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-xs uppercase transition-all ${copySuccess ? 'bg-emerald-500 text-white shadow-lg' : 'bg-white text-indigo-700 hover:bg-indigo-50'}`}
                            >
                                {copySuccess ? 'Copiado!' : 'Copiar Link'}
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
                        <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20 text-center">
                            <div className="text-3xl font-black mb-1">{stats?.totalReferrals}</div>
                            <div className="text-[10px] font-bold text-indigo-200 uppercase tracking-widest">Indicados</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20 text-center">
                            <div className="text-3xl font-black mb-1">{stats?.conversions}</div>
                            <div className="text-[10px] font-bold text-indigo-200 uppercase tracking-widest">Conversão</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20 text-center col-span-2">
                            <div className="text-2xl font-black mb-1">R$ {parseFloat(stats?.totalEarnings || 0).toFixed(2)}</div>
                            <div className="text-[10px] font-bold text-indigo-200 uppercase tracking-widest">Ganhos Totais</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Lista de Indicações */}
            <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                <div
                    className="p-8 flex items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                    onClick={() => setListExpanded(!listExpanded)}
                >
                    <div>
                        <h3 className="text-xl font-black tracking-tight text-slate-800 dark:text-white">Suas Indicações</h3>
                        <p className="text-sm text-slate-500 font-medium uppercase tracking-widest mt-1">
                            {referrals.length} {referrals.length === 1 ? 'Registro Recente' : 'Registros Recentes'}
                        </p>
                    </div>
                    <div className={`w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center transition-transform ${listExpanded ? 'rotate-180' : ''}`}>
                        <svg className="w-5 h-5 text-slate-600 dark:text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
                    </div>
                </div>

                <AnimatePresence>
                    {listExpanded && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden border-t border-slate-200 dark:border-slate-800"
                        >
                            <div className="p-0 overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50 dark:bg-slate-900/50 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                            <th className="px-8 py-5">Nome</th>
                                            <th className="px-8 py-5">Data</th>
                                            <th className="px-8 py-5">Status</th>
                                            <th className="px-8 py-5 text-right">Recompensa</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                        {referrals.length > 0 ? referrals.map((ref) => (
                                            <tr key={ref.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                                <td className="px-8 py-5 font-bold text-slate-800 dark:text-slate-200">{ref.name}</td>
                                                <td className="px-8 py-5 text-sm font-medium text-slate-500">{ref.date}</td>
                                                <td className="px-8 py-5">
                                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${ref.status === 'Ativo' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                                        {ref.status}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-5 text-right font-black text-slate-800 dark:text-slate-200">{ref.reward}</td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan="4" className="px-8 py-10 text-center text-slate-400 font-medium">Nenhuma indicação encontrada.</td>
                                            </tr>
                                        )}
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

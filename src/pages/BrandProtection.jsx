import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { API_ENDPOINTS } from '../api/config';
import { motion, AnimatePresence } from 'framer-motion';

export default function BrandProtection() {
    const { user } = useContext(AuthContext);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedThreat, setSelectedThreat] = useState(null);
    const [showTakedownModal, setShowTakedownModal] = useState(false);
    const [takedownNotice, setTakedownNotice] = useState('');

    useEffect(() => {
        fetchStatus();
    }, []);

    const fetchStatus = async () => {
        try {
            const res = await fetch(API_ENDPOINTS.BRAND_PROTECTION_STATUS, {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            const result = await res.json();
            setData(result);
        } catch (err) {
            console.error('Error fetching brand protection status:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateTakedown = async (threatId) => {
        try {
            const res = await fetch(`${API_ENDPOINTS.GENERATE_TAKEDOWN}/${threatId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({
                    companyName: 'ShieldCheck AI',
                    contactEmail: user.email
                })
            });
            const result = await res.json();
            setTakedownNotice(result.notice);
            setShowTakedownModal(true);
        } catch (err) {
            console.error('Error generating takedown:', err);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center p-20">
            <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="space-y-8 animate-fadeIn max-w-6xl mx-auto">
            {/* Header Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center justify-center text-center">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Monitoramento Ativo</div>
                    <div className="text-4xl font-black text-indigo-600">{data?.stats?.totalScans}</div>
                    <div className="text-xs font-medium text-slate-500 mt-1">Scans nas últimas 24h</div>
                </div>
                <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center justify-center text-center">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Takedowns Finalizados</div>
                    <div className="text-4xl font-black text-emerald-500">{data?.stats?.takedownsResolved}</div>
                    <div className="text-xs font-medium text-slate-500 mt-1">Desde a ativação do módulo</div>
                </div>
                <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center justify-center text-center border-l-4 border-l-red-500">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Ameaças Ativas</div>
                    <div className="text-4xl font-black text-red-500">{data?.stats?.activeThreats}</div>
                    <div className="text-xs font-medium text-slate-500 mt-1">Requer atenção imediata</div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Monitored Assets */}
                <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                    <div className="p-8 border-b border-slate-100 dark:border-slate-800">
                        <h3 className="text-xl font-black text-slate-900 dark:text-white">Ativos Monitorados</h3>
                    </div>
                    <div className="p-4 space-y-4">
                        {data?.monitoredDomains.map(item => (
                            <div key={item.id} className="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-950 rounded-3xl border border-slate-100 dark:border-slate-800">
                                <div>
                                    <div className="font-bold text-slate-800 dark:text-white">{item.domain}</div>
                                    <div className="text-[10px] text-slate-400 font-bold uppercase mt-1">Último Scan: {new Date(item.lastScan).toLocaleTimeString()}</div>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${item.status === 'Seguro' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                    {item.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Detected Threats */}
                <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                    <div className="p-8 border-b border-slate-100 dark:border-slate-800">
                        <h3 className="text-xl font-black text-slate-900 dark:text-white">Ameaças às Claras</h3>
                    </div>
                    <div className="p-4 space-y-4">
                        {data?.detectedThreats.map(threat => (
                            <div key={threat.id} className="p-6 bg-slate-50 dark:bg-slate-950 rounded-3xl border border-red-100 dark:border-red-900/20 relative group">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-black text-red-500 uppercase tracking-widest">{threat.risk}</span>
                                            <span className="text-slate-300">|</span>
                                            <span className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">{threat.type}</span>
                                        </div>
                                        <div className="font-black text-lg text-slate-900 dark:text-white mt-1">{threat.source}</div>
                                    </div>
                                    <button
                                        onClick={() => handleGenerateTakedown(threat.id)}
                                        className="p-3 bg-red-600 text-white rounded-2xl hover:bg-red-700 transition-all shadow-lg shadow-red-500/20 opacity-0 group-hover:opacity-100"
                                        title="Gerar Takedown"
                                    >
                                        ⚖️
                                    </button>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Detectado em: {new Date(threat.discoveryDate).toLocaleDateString()}</div>
                                    <span className="text-[10px] font-black text-red-500 uppercase tracking-[0.2em]">{threat.status}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Takedown Modal */}
            <AnimatePresence>
                {showTakedownModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white dark:bg-slate-900 w-full max-w-3xl p-10 rounded-[3rem] shadow-2xl"
                        >
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-12 h-12 bg-red-600 rounded-2xl flex items-center justify-center text-xl">⚖️</div>
                                <div>
                                    <h3 className="text-2xl font-black text-slate-900 dark:text-white">Aviso de Takedown (DCMA)</h3>
                                    <p className="text-sm text-slate-500 font-medium">Use este documento para solicitar a suspensão do recurso fraudulento.</p>
                                </div>
                            </div>

                            <div className="bg-slate-50 dark:bg-slate-950 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 mb-8 max-h-[400px] overflow-y-auto">
                                <pre className="whitespace-pre-wrap font-mono text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                    {takedownNotice}
                                </pre>
                            </div>

                            <div className="flex gap-4">
                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(takedownNotice);
                                        // Optional: toast success
                                    }}
                                    className="flex-1 h-16 bg-red-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-red-500/20 hover:bg-red-700 transition-all"
                                >
                                    Copiar Documento
                                </button>
                                <button
                                    onClick={() => setShowTakedownModal(false)}
                                    className="flex-1 h-16 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-2xl font-black uppercase tracking-widest transition-all"
                                >
                                    Fechar
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

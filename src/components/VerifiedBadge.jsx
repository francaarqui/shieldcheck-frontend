import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const VerifiedBadge = ({ domain = "shieldcheck.ai" }) => {
    const [status, setStatus] = useState('loading');
    const [details, setDetails] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const checkStatus = async () => {
            try {
                const res = await fetch(`http://localhost:3000/api/v1/verify-store/${domain}`);
                const data = await res.json();
                setStatus(data.status === 'VERIFIED' ? 'verified' : 'unverified');
                setDetails(data);
            } catch (err) {
                setStatus('unverified');
            }
        };
        checkStatus();
    }, [domain]);

    return (
        <div className="flex flex-col items-center">
            <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => status === 'verified' && setShowModal(true)}
                className={`cursor-pointer px-6 py-3 rounded-2xl flex items-center gap-3 border shadow-lg transition-all ${status === 'verified'
                        ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-600'
                        : status === 'loading'
                            ? 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400'
                            : 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800 text-red-600'
                    }`}
            >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${status === 'verified' ? 'bg-emerald-500' : status === 'loading' ? 'bg-slate-300 animate-pulse' : 'bg-red-500'
                    }`}>
                    {status === 'verified' ? (
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    ) : (
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                    )}
                </div>
                <div className="flex flex-col items-start leading-none">
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-60">ShieldCheck</span>
                    <span className="text-sm font-black uppercase tracking-tighter">
                        {status === 'verified' ? 'E-commerce Verificado' : status === 'loading' ? 'Verificando...' : 'Site Não Verificado'}
                    </span>
                </div>
            </motion.div>

            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white dark:bg-slate-900 w-full max-w-lg p-10 rounded-[3rem] shadow-2xl relative overflow-hidden"
                        >
                            <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/10 blur-[60px] rounded-full"></div>

                            <div className="relative z-10 flex flex-col items-center text-center">
                                <div className="w-20 h-20 rounded-full bg-emerald-500 flex items-center justify-center mb-6 shadow-xl shadow-emerald-500/20">
                                    <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                </div>

                                <h2 className="text-3xl font-display font-black text-slate-900 dark:text-white tracking-tight mb-2">Certificado de Autenticidade</h2>
                                <p className="text-slate-500 dark:text-slate-400 font-medium mb-8">
                                    Este site foi rigorosamente analisado e aprovado pela Inteligência Artificial do ShieldCheck AI.
                                </p>

                                <div className="w-full grid grid-cols-2 gap-4 mb-8">
                                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Score de Segurança</span>
                                        <span className="text-2xl font-black text-emerald-500">{details?.security_score}%</span>
                                    </div>
                                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">ID do Certificado</span>
                                        <span className="text-sm font-black text-slate-900 dark:text-white">{details?.certificate_id}</span>
                                    </div>
                                </div>

                                <div className="w-full p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/50 text-emerald-700 dark:text-emerald-400 text-xs font-bold mb-8">
                                    Data de Verificação: {new Date(details?.verification_date).toLocaleDateString()}
                                </div>

                                <button
                                    onClick={() => setShowModal(false)}
                                    className="w-full py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black uppercase tracking-widest text-xs hover:opacity-90 transition-all font-display"
                                >
                                    Fechar Certificado
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default VerifiedBadge;

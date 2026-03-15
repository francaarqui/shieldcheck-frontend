import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { API_ENDPOINTS } from '../api/config';
import { motion, AnimatePresence } from 'framer-motion';

export default function CommunityHub() {
    const { user } = useContext(AuthContext);
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showSubmitModal, setShowSubmitModal] = useState(false);

    const [formData, setFormData] = useState({
        type: '',
        platform: '',
        target: '',
        description: ''
    });

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        try {
            const res = await fetch(API_ENDPOINTS.COMMUNITY_REPORTS);
            const data = await res.json();
            setReports(data);
        } catch (err) {
            console.error('Error fetching community reports:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleVote = async (reportId, direction) => {
        try {
            const res = await fetch(`${API_ENDPOINTS.COMMUNITY_VOTE}/${reportId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({ direction })
            });
            if (res.ok) {
                // Optimistic update or refetch
                fetchReports();
            }
        } catch (err) {
            console.error('Error voting:', err);
        }
    };

    const handleSubmitReport = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(API_ENDPOINTS.COMMUNITY_REPORTS, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                setShowSubmitModal(false);
                setFormData({ type: '', platform: '', target: '', description: '' });
                fetchReports();
            }
        } catch (err) {
            console.error('Error submitting report:', err);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center p-20">
            <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="space-y-8 animate-fadeIn max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Comunidade Sentinel</h2>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">O wiki coletivo contra golpes e fraudes em tempo real.</p>
                </div>
                <button
                    onClick={() => setShowSubmitModal(true)}
                    className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold shadow-lg shadow-indigo-500/30 transition-all hover:-translate-y-1 active:scale-95 whitespace-nowrap"
                >
                    + Reportar Novo Golpe
                </button>
            </div>

            <div className="grid gap-6">
                {reports.map((report) => (
                    <motion.div
                        layout
                        key={report.id}
                        className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 p-8 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
                    >
                        {/* Status Badge */}
                        <div className="absolute top-8 right-8">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${report.status === 'Verificado' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                                }`}>
                                {report.status}
                            </span>
                        </div>

                        <div className="flex gap-6">
                            {/* Vote Column */}
                            <div className="flex flex-col items-center gap-2">
                                <button
                                    onClick={() => handleVote(report.id, 'up')}
                                    className={`p-2 rounded-xl transition-all ${report.user_voted === 'up' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-indigo-600'}`}
                                >
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" /></svg>
                                </button>
                                <span className="font-black text-slate-900 dark:text-white text-lg">{report.votes}</span>
                                <button
                                    onClick={() => handleVote(report.id, 'down')}
                                    className={`p-2 rounded-xl transition-all ${report.user_voted === 'down' ? 'bg-red-600 text-white shadow-lg' : 'bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-red-600'}`}
                                >
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                                </button>
                            </div>

                            {/* Content Column */}
                            <div className="flex-1 space-y-4">
                                <div className="flex items-center gap-3">
                                    <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded font-bold text-[10px] text-slate-500 uppercase tracking-widest">{report.platform}</span>
                                    <span className="text-slate-300">|</span>
                                    <span className="font-bold text-indigo-600 dark:text-indigo-400 text-sm">{report.type}</span>
                                </div>

                                <div>
                                    <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">{report.target}</h3>
                                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">{report.description}</p>
                                </div>

                                <div className="pt-4 flex items-center justify-between text-[11px] text-slate-400 font-bold uppercase tracking-widest">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[8px]">
                                            👤
                                        </div>
                                        <span>Por: {report.author}</span>
                                    </div>
                                    <span>{new Date(report.timestamp).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Submission Modal */}
            <AnimatePresence>
                {showSubmitModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white dark:bg-slate-900 w-full max-w-2xl p-10 rounded-[3rem] shadow-2xl relative"
                        >
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-xl">📢</div>
                                <div>
                                    <h3 className="text-2xl font-black text-slate-900 dark:text-white">Reportar novo Golpe</h3>
                                    <p className="text-sm text-slate-500 font-medium">Ajude a proteger os outros membros da comunidade.</p>
                                </div>
                            </div>

                            <form onSubmit={handleSubmitReport} className="space-y-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tipo de Golpe</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.type}
                                            onChange={e => setFormData({ ...formData, type: e.target.value })}
                                            className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-slate-800 dark:text-white"
                                            placeholder="Ex: Phishing, Falso Empréstimo"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Plataforma</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.platform}
                                            onChange={e => setFormData({ ...formData, platform: e.target.value })}
                                            className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-slate-800 dark:text-white"
                                            placeholder="Ex: WhatsApp, Instagram"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Alvo do Golpe</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.target}
                                        onChange={e => setFormData({ ...formData, target: e.target.value })}
                                        className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-slate-800 dark:text-white"
                                        placeholder="Ex: Clientes do Banco Itáu, Idosos"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Descrição Detalhada</label>
                                    <textarea
                                        required
                                        rows={4}
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-slate-800 dark:text-white"
                                        placeholder="Explique como o golpe funciona e como identificá-lo..."
                                    />
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="submit"
                                        className="flex-1 h-16 bg-premium-gradient text-white rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-indigo-500/20"
                                    >
                                        Publicar na Comunidade
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowSubmitModal(false)}
                                        className="flex-1 h-16 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-2xl font-black uppercase tracking-widest"
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

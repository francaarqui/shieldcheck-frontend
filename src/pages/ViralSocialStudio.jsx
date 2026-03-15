import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { API_ENDPOINTS } from '../api/config';

export default function ViralSocialStudio() {
    const { user } = useContext(AuthContext);
    const [stats, setStats] = useState(null);
    const [selectedTemplate, setSelectedTemplate] = useState('score'); // 'score', 'alert', 'badge'
    const [isSharing, setIsSharing] = useState(false);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            // Reusing a stats concept or using mock for the viral cards
            const res = await fetch(API_ENDPOINTS.ME, {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            const data = await res.json();
            setStats({
                score: data.shield_score || 85,
                scamsBlocked: 14,
                level: 'Guardião Elite',
                memberSince: 'Março 2024'
            });
        } catch (err) {
            console.error('Error fetching viral stats:', err);
        }
    };

    const handleShare = () => {
        setIsSharing(true);
        setTimeout(() => {
            setIsSharing(false);
            alert('Cartão gerado e otimizado para redes sociais! Iniciando compartilhamento...');
        }, 2000);
    };

    const CardPreview = () => {
        switch (selectedTemplate) {
            case 'score':
                return (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-full aspect-[4/5] max-w-[400px] bg-slate-900 rounded-[3rem] p-10 flex flex-col justify-between text-white shadow-2xl relative overflow-hidden group border-4 border-indigo-500/20"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/20 blur-[80px] rounded-full group-hover:bg-indigo-600/30 transition-all duration-700" />
                        <div className="relative z-10 flex justify-between items-start">
                            <div className="font-display font-black text-2xl tracking-tighter">Shield<span className="text-indigo-500">Check</span></div>
                            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-md border border-white/20">🛡️</div>
                        </div>

                        <div className="relative z-10 flex flex-col items-center text-center py-10">
                            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400 mb-2">Meu Score de Segurança</div>
                            <div className="text-9xl font-black text-white tracking-tighter drop-shadow-2xl">{stats?.score}</div>
                            <div className="mt-4 px-6 py-2 bg-indigo-600 rounded-full font-black text-sm uppercase tracking-widest shadow-lg shadow-indigo-600/30">
                                {stats?.level}
                            </div>
                        </div>

                        <div className="relative z-10 space-y-4 pt-10 border-t border-white/10 text-center">
                            <p className="text-xs font-medium text-slate-400">Eu uso ShieldCheck AI para proteger minha vida digital. E você?</p>
                            <div className="flex justify-center gap-4">
                                <div className="text-center">
                                    <div className="text-lg font-black">{stats?.scamsBlocked}</div>
                                    <div className="text-[8px] font-bold text-slate-500 uppercase">Golpes Evitados</div>
                                </div>
                                <div className="w-[1px] h-8 bg-white/10" />
                                <div className="text-center">
                                    <div className="text-lg font-black">24/7</div>
                                    <div className="text-[8px] font-bold text-slate-500 uppercase">Monitorado</div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                );
            case 'alert':
                return (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-full aspect-[4/5] max-w-[400px] bg-red-600 rounded-[3rem] p-10 flex flex-col justify-between text-white shadow-2xl relative overflow-hidden border-4 border-red-400/20"
                    >
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-white/10 blur-[80px] rounded-full" />
                        <div className="relative z-10 flex justify-between items-start">
                            <div className="font-display font-black text-2xl tracking-tighter">Shield<span className="text-red-200">Alert</span></div>
                            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md border border-white/30">⚠️</div>
                        </div>

                        <div className="relative z-10 flex flex-col items-center text-center py-10 space-y-6">
                            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-red-100 mb-2">Alerta Comunitário</div>
                            <h2 className="text-4xl font-black leading-tight tracking-tighter uppercase">Novo Golpe Detectado no WhatsApp</h2>
                            <p className="text-xs font-bold text-red-100 px-6 leading-relaxed bg-black/10 py-4 rounded-3xl backdrop-blur-sm">Cuidado com o link "sh-check.online". A IA do ShieldCheck confirmou atividade de Phishing em larga escala.</p>
                        </div>

                        <div className="relative z-10 space-y-4 pt-10 text-center">
                            <div className="flex items-center justify-center gap-2 mb-2">
                                <div className="w-2 h-2 bg-white rounded-full animate-ping" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-white">Informação em Tempo Real</span>
                            </div>
                            <div className="text-[10px] font-black uppercase tracking-[0.2em] border-2 border-white/20 py-4 rounded-2xl">
                                Escaneado via ShieldCheck AI
                            </div>
                        </div>
                    </motion.div>
                );
            default:
                return <div className="text-white">Selecione um template</div>;
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-12 pb-20 animate-fadeIn">
            <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="space-y-4 text-center md:text-left">
                    <h2 className="text-5xl font-display font-black text-slate-900 dark:text-white tracking-tighter">Social <span className="text-premium-gradient">Studio</span></h2>
                    <p className="text-slate-500 dark:text-slate-400 text-lg font-medium max-w-md">Transforme sua segurança em orgulho. Gere cartões incríveis para suas redes sociais.</p>
                </div>

                <div className="flex gap-4">
                    <button
                        onClick={() => setSelectedTemplate('score')}
                        className={`px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${selectedTemplate === 'score' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-200' : 'bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-800'}`}
                    >
                        Score Card
                    </button>
                    <button
                        onClick={() => setSelectedTemplate('alert')}
                        className={`px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${selectedTemplate === 'alert' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-200' : 'bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-800'}`}
                    >
                        Alerta Urgente
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                {/* Preview Section */}
                <div className="flex justify-center relative">
                    <CardPreview />
                    {/* Background Glow */}
                    <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-indigo-500/5 blur-[100px] rounded-full" />
                </div>

                {/* Actions & Customization */}
                <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-10 border border-slate-200 dark:border-slate-800 shadow-sm space-y-10">
                    <div className="space-y-6">
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white">Opções de Estúdio</h3>
                        <div className="space-y-4">
                            <div className="p-6 bg-slate-50 dark:bg-slate-950 rounded-3xl border border-slate-100 dark:border-slate-800">
                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Escolha o Tema</div>
                                <div className="flex gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-slate-900 cursor-pointer border-2 border-indigo-500" />
                                    <div className="w-10 h-10 rounded-xl bg-indigo-600 cursor-pointer" />
                                    <div className="w-10 h-10 rounded-xl bg-emerald-600 cursor-pointer" />
                                    <div className="w-10 h-10 rounded-xl bg-amber-500 cursor-pointer" />
                                </div>
                            </div>
                            <div className="p-6 bg-slate-50 dark:bg-slate-950 rounded-3xl border border-slate-100 dark:border-slate-800">
                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Ações Disponíveis</div>
                                <div className="grid grid-cols-2 gap-4">
                                    <button className="h-14 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 flex items-center justify-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
                                        🖼️ PNG em HD
                                    </button>
                                    <button className="h-14 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 flex items-center justify-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
                                        📁 Stories (9:16)
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleShare}
                        disabled={isSharing}
                        className="w-full h-20 bg-premium-gradient text-white rounded-[2rem] font-black uppercase tracking-widest shadow-2xl hover:scale-[1.02] active:scale-95 transition-all text-sm relative overflow-hidden"
                    >
                        {isSharing ? (
                            <div className="flex items-center justify-center gap-4">
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Renderizando...
                            </div>
                        ) : (
                            'Compartilhar no Instagram / LinkedIn'
                        )}
                    </button>

                    <div className="flex items-center gap-4 p-6 bg-indigo-50/50 dark:bg-indigo-950/20 rounded-3xl border border-indigo-100 dark:border-indigo-800/30">
                        <div className="text-2xl text-indigo-600">🚀</div>
                        <p className="text-xs font-medium text-slate-600 dark:text-slate-400">Ao compartilhar, você ganha <strong>+250 XP</strong> de Engajamento ShieldCheck!</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

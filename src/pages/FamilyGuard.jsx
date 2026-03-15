import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { API_ENDPOINTS } from '../api/config';

const AlertItem = ({ alert, index }) => {
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
                        <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">{alert.type} Detectado</span>
                    </div>
                    <p className="text-xs text-slate-500 font-mono truncate max-w-md">{alert.url}</p>
                </div>
                <div className="flex items-center gap-4">
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-600 rounded text-[9px] font-black uppercase">{alert.status}</span>
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
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Detalhes do Evento</h4>
                                <div className="space-y-2">
                                    <p className="text-xs font-bold text-slate-600 dark:text-slate-300">Data/Hora: <span className="text-slate-900 dark:text-white">{alert.date}</span></p>
                                    <p className="text-xs font-bold text-slate-600 dark:text-slate-300">Tipo: <span className="text-slate-900 dark:text-white">{alert.type}</span></p>
                                    <p className="text-xs font-bold text-slate-600 dark:text-slate-300">URL Alvo: <span className="text-red-500 font-mono">{alert.url}</span></p>
                                </div>
                            </div>
                            <div className="flex flex-col justify-end gap-3">
                                <button className="h-12 w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-black text-[10px] uppercase tracking-widest hover:scale-[1.02] transition-transform">
                                    Bloquear Domínio Global
                                </button>
                                <button className="h-12 w-full border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-white dark:hover:bg-slate-800 transition-colors">
                                    Reportar Falso Positivo
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
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [inviteEmail, setInviteEmail] = useState('');
    const [inviteLoading, setInviteLoading] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });

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
                setMessage({ text: 'Convite enviado com sucesso!', type: 'success' });
                setInviteEmail('');
                fetchMembers();
            } else {
                throw new Error(data.error);
            }
        } catch (err) {
            setMessage({ text: err.message, type: 'error' });
        } finally {
            setInviteLoading(false);
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
                    Voltar
                </button>
            </div>
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h2 className="text-4xl font-display font-black text-slate-900 dark:text-white tracking-tighter">
                        Family <span className="text-indigo-600">Guard</span> 🛡️
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg font-medium max-w-xl">
                        Proteja quem você ama. Monitore acessos suspeitos de seus pais ou filhos remotamente.
                    </p>
                </div>
                <div className="px-6 py-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl border border-indigo-100 dark:border-indigo-800">
                    <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Plano Ativado</p>
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Proteção Ativa em 2 Dispositivos</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                {/* Lateral: Add & Members */}
                <div className="space-y-8">
                    <div className="glass-card p-8 rounded-[2.5rem] border border-white dark:border-slate-800 shadow-xl space-y-6">
                        <h3 className="text-xl font-black text-slate-900 dark:text-white">Adicionar Familiar</h3>
                        <form onSubmit={handleInvite} className="space-y-4">
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">E-mail do Protegido</label>
                                <input
                                    type="email"
                                    required
                                    value={inviteEmail}
                                    onChange={e => setInviteEmail(e.target.value)}
                                    className="w-full h-14 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800 px-6 text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none"
                                    placeholder="ex: mae@email.com"
                                />
                            </div>
                            <button
                                disabled={inviteLoading}
                                className="w-full h-14 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-indigo-700 transition-all flex items-center justify-center"
                            >
                                {inviteLoading ? 'Vinculando...' : 'Proteger Agora'}
                            </button>
                            {message.text && (
                                <p className={`text-center text-xs font-bold ${message.type === 'success' ? 'text-emerald-500' : 'text-red-500'}`}>
                                    {message.text}
                                </p>
                            )}
                        </form>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                            Membros Conectados <span className="text-xs bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full">{members.length}</span>
                        </h3>
                        <div className="space-y-3">
                            {members.length === 0 ? (
                                <p className="text-sm text-slate-400 font-medium italic">Nenhum familiar conectado ainda.</p>
                            ) : (
                                members.map(m => (
                                    <div key={m.id} className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-black uppercase">{m.name.charAt(0)}</div>
                                            <div>
                                                <p className="text-sm font-black text-slate-900 dark:text-white truncate max-w-[120px]">{m.name}</p>
                                                <p className="text-[10px] text-slate-400">{m.email}</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-1">
                                            <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase ${m.status === 'Pendente' ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'}`}>
                                                {m.status}
                                            </span>
                                            <div className={`w-2 h-2 rounded-full ${m.status === 'Pendente' ? 'bg-amber-400 animate-pulse' : 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]'}`}></div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Main: Alert Feed */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="flex items-center justify-between">
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Logs de Proteção em Tempo Real</h3>
                        <button className="text-xs font-black text-indigo-600 uppercase hover:underline">Limpar Histórico</button>
                    </div>

                    <div className="space-y-4">
                        {alerts.map((alert, i) => (
                            <AlertItem key={alert.id} alert={alert} index={i} />
                        ))}
                    </div>

                    {/* Upsell Card */}
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 rounded-[3rem] text-white flex flex-col md:flex-row items-center gap-8 shadow-2xl overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L1 7l11 5 11-5-11-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
                        </div>
                        <div className="space-y-4 relative z-10 flex-1">
                            <h4 className="text-2xl font-black">Adicione o Shield ao celular deles!</h4>
                            <p className="text-sm text-indigo-100 font-medium leading-relaxed">
                                Para que você receba estes alertas, instale nosso **Browser Guard** ou conecte o **WhatsApp Bot** no dispositivo do seu familiar.
                            </p>
                        </div>
                        <button
                            onClick={() => {
                                const link = `${window.location.origin}/register?ref=${user?.id}`;
                                navigator.clipboard.writeText(link);
                                alert("Link de instalação (convite) copiado para a área de transferência! Envie para seu familiar.");
                            }}
                            className="h-14 px-8 bg-white text-indigo-600 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-indigo-50 transition-colors relative z-10"
                        >
                            Enviar Link de Instalação
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

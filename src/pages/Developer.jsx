import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { API_ENDPOINTS } from '../api/config';

export default function Developer() {
    const { user } = useContext(AuthContext);
    const [apiKey, setApiKey] = useState(null);
    const [usage, setUsage] = useState(0);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);
    const [regenerating, setRegenerating] = useState(false);

    const isPremium = user?.plan === 'PREMIUM';

    const fetchKey = async () => {
        if (!user?.token || !isPremium) return;
        try {
            const res = await fetch(API_ENDPOINTS.API_KEYS, {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setApiKey(data.apiKey);
                setUsage(data.usage);
            }
        } catch (err) {
            console.error("Erro ao carregar chave de API", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isPremium) {
            fetchKey();
        } else {
            setLoading(false);
        }
    }, [user?.token, isPremium]);

    const handleCopy = () => {
        if (!apiKey) return;
        navigator.clipboard.writeText(apiKey);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleRegenerate = async () => {
        if (!window.confirm("Atenção: A chave atual parará de funcionar imediatamente. Deseja gerar uma nova chave?")) return;

        setRegenerating(true);
        try {
            const res = await fetch(API_ENDPOINTS.REGENERATE_API_KEY, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (res.ok) {
                const data = await res.json();
                setApiKey(data.apiKey);
                setUsage(0);
                alert("Sua chave de API foi atualizada com sucesso!");
            } else {
                alert("Erro ao regerar chave. Tente novamente.");
            }
        } catch (err) {
            console.error(err);
            alert("Erro na conexão com o servidor.");
        } finally {
            setRegenerating(false);
        }
    };

    if (loading) return (
        <div className="flex flex-col justify-center items-center h-full min-h-[50vh] space-y-4">
            <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
            <p className="text-slate-400 font-black uppercase tracking-widest text-xs animate-pulse">Autenticando Acesso Digital...</p>
        </div>
    );

    if (!isPremium) {
        return (
            <div className="animate-slide-up max-w-4xl mx-auto py-12 px-4">
                <div className="glass-card p-12 rounded-[3rem] border border-white dark:border-slate-800 text-center space-y-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                    <div className="w-24 h-24 bg-gradient-to-tr from-slate-800 to-slate-950 dark:from-slate-700 dark:to-slate-900 rounded-3xl flex items-center justify-center mx-auto shadow-2xl rotate-3">
                        <svg className="w-12 h-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                    </div>
                    <div className="space-y-4">
                        <h2 className="text-4xl font-display font-black text-slate-900 dark:text-white tracking-tight">Recurso Exclusivo B2B</h2>
                        <p className="text-slate-500 dark:text-slate-400 text-lg font-medium max-w-lg mx-auto leading-relaxed">
                            O acesso à API é um recurso restrito para parceiros <strong className="text-premium-gradient">Premium e Enterprise</strong>. Integre nossa inteligência no seu negócio.
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                        <Link to="/plans" className="bg-premium-gradient text-white px-10 py-5 rounded-2xl font-black text-lg shadow-xl shadow-indigo-500/20 hover-lift active:scale-95 transition-all">
                            Upgrade para Premium
                        </Link>
                        <button className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-white px-10 py-5 rounded-2xl font-black text-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all">
                            Falar com Suporte
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="animate-slide-up max-w-6xl mx-auto space-y-10 pb-20">
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
                <div className="space-y-4 text-center lg:text-left">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-full border border-indigo-100 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em]">
                        <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
                        B2B Integration Channel
                    </div>
                    <h2 className="text-5xl font-display font-black text-slate-900 dark:text-white tracking-tighter">
                        Portal do <span className="text-premium-gradient">Desenvolvedor</span>
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 text-xl font-medium max-w-2xl leading-relaxed">
                        Gerencie suas credenciais e integre a inteligência do ShieldCheck no seu ecossistema digital.
                    </p>
                </div>

                <div className="flex justify-center lg:justify-end">
                    <div className="glass-card p-6 rounded-3xl border border-white dark:border-slate-800 flex items-center gap-6 shadow-xl">
                        <div className="text-center">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Status API</p>
                            <p className="text-emerald-500 font-bold text-sm">OPERACIONAL</p>
                        </div>
                        <div className="w-px h-10 bg-slate-200 dark:bg-slate-800"></div>
                        <div className="text-center">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Versão</p>
                            <p className="text-slate-900 dark:text-white font-bold text-sm font-mono">v1.2.0</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Credentials Card */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                <div className="xl:col-span-2 space-y-8">
                    <div className="glass-card p-10 md:p-14 rounded-[3.5rem] border border-white dark:border-slate-800 bg-mesh relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-indigo-500/10 transition-colors"></div>

                        <div className="relative z-10 space-y-10">
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-100 dark:border-slate-800">
                                <h3 className="text-2xl font-display font-black text-slate-900 dark:text-white flex items-center gap-3">
                                    <div className="w-12 h-12 bg-slate-900 dark:bg-white rounded-2xl flex items-center justify-center text-white dark:text-slate-900">
                                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z" /></svg>
                                    </div>
                                    Suas Credenciais
                                </h3>
                                <button
                                    onClick={handleRegenerate}
                                    disabled={regenerating}
                                    className="px-6 py-3 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all border border-red-100 dark:border-red-900/30 disabled:opacity-50"
                                >
                                    {regenerating ? 'Regerando...' : 'Regerar Nova Chave'}
                                </button>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-3">
                                    <label className="block text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.25em] ml-1">X-API-KEY (SECRET)</label>
                                    <div className="flex flex-col sm:flex-row items-stretch gap-4">
                                        <div className="flex-1 bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 rounded-2xl px-6 py-5 flex items-center group/key focus-within:border-indigo-500/50 transition-all">
                                            <code className="text-indigo-600 dark:text-indigo-400 font-mono font-black text-lg select-all flex-1 truncate">
                                                {apiKey || '••••••••••••••••••••••••••••'}
                                            </code>
                                        </div>
                                        <button
                                            onClick={handleCopy}
                                            className="bg-indigo-600 text-white px-8 py-5 rounded-2xl font-black text-sm shadow-xl shadow-indigo-200 dark:shadow-none hover-lift active:scale-95 transition-all flex items-center justify-center gap-3"
                                        >
                                            {copied ? (
                                                <><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.5}><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg> Copiado!</>
                                            ) : (
                                                <><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg> Copiar Chave</>
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <div className="p-6 bg-amber-50 dark:bg-amber-950/20 rounded-3xl border border-amber-100 dark:border-amber-900/30 flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center text-amber-600 shrink-0">
                                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" /></svg>
                                    </div>
                                    <div>
                                        <p className="text-amber-900 dark:text-amber-200 font-bold text-sm">Proteja sua credencial</p>
                                        <p className="text-amber-700/80 dark:text-amber-400 font-medium text-xs mt-1 leading-relaxed">
                                            Nunca compartilhe sua chave de API ou a armazene em código frontend visível. Se suspeitar de vazamento, regere-a imediatamente.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Documentation / Snippet Section */}
                    <div className="glass-card rounded-[3rem] border border-white dark:border-slate-800 overflow-hidden shadow-xl">
                        <div className="bg-slate-900 dark:bg-slate-950 px-10 py-8 flex items-center justify-between">
                            <h3 className="text-white text-xl font-display font-black flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                Documentação da API
                            </h3>
                            <button className="text-indigo-400 font-black text-[10px] uppercase tracking-widest hover:text-indigo-300 transition-colors">Abrir Swagger &rarr;</button>
                        </div>
                        <div className="p-10 space-y-8">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <span className="px-3 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase rounded-lg border border-emerald-500/20">Analyze Endpoint</span>
                                    <code className="text-slate-500 font-mono text-sm">{API_ENDPOINTS.B2B_ANALYZE}</code>
                                </div>
                                <div className="bg-slate-950 rounded-3xl p-8 border border-slate-800 shadow-2xl overflow-x-auto relative group">
                                    <div className="absolute top-4 right-6 text-[10px] font-black text-slate-600 uppercase tracking-widest">JavaScript Sample</div>
                                    <pre className="text-sm font-mono leading-relaxed text-slate-300">
                                        {`const request = await fetch("${API_ENDPOINTS.B2B_ANALYZE}", {
  method: "POST",
  headers: {
    "x-api-key": "SUA_CHAVE_AQUI",
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    content: "Este link parece suspeito: malicius-site.com",
    type: "text"
  })
});

const response = await request.json();
console.log(response.score); // Nível de risco 0-100`}
                                    </pre>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar Stats */}
                <div className="space-y-6">
                    <div className="glass-card p-10 rounded-[3rem] border border-white dark:border-slate-800 text-center space-y-6 shadow-xl hover-lift transition-all">
                        <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em]">Consumo Mensal</p>
                        <div className="relative w-40 h-40 mx-auto group">
                            <svg className="w-full h-full -rotate-90">
                                <circle cx="80" cy="80" r="74" className="stroke-slate-100 dark:stroke-slate-800 fill-none" strokeWidth="12" />
                                <circle cx="80" cy="80" r="74" className="stroke-indigo-600 fill-none" strokeWidth="12" strokeDasharray="465" strokeDashoffset={465 - (Math.min(usage, 1000) / 1000 * 465)} strokeLinecap="round" />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-5xl font-display font-black text-slate-900 dark:text-white leading-none group-hover:scale-110 transition-transform">{usage}</span>
                                <span className="text-[10px] font-black text-slate-400 uppercase mt-1">Requisições</span>
                            </div>
                        </div>
                        <div className="pt-2">
                            <p className="text-indigo-600 dark:text-indigo-400 font-black text-sm uppercase tracking-widest">Plano Ilimitado</p>
                            <p className="text-slate-400 dark:text-slate-500 text-[10px] mt-2 font-bold leading-relaxed px-4">Sua cota renova automaticamente no Ciclo de Faturamento.</p>
                        </div>
                    </div>

                    <div className="glass-card p-8 rounded-[3rem] border border-slate-900/5 dark:bg-slate-900/50 shadow-inner">
                        <h4 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-6 px-2">Suporte Developer</h4>
                        <div className="space-y-4">
                            {[
                                { label: 'Webhooks (Soon)', icon: '⚡' },
                                { label: 'API Integrations', icon: '🔌' },
                                { label: 'Admin Access', icon: '🛡️' }
                            ].map((item, idx) => (
                                <div key={idx} className="bg-white dark:bg-slate-800/50 p-4 rounded-2xl flex items-center justify-between border border-slate-100 dark:border-slate-800">
                                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{item.label}</span>
                                    <span className="text-lg">{item.icon}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}


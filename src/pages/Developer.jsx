import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { API_ENDPOINTS } from '../api/config';

export default function Developer() {
    const { user } = useContext(AuthContext);
    const [apiKey, setApiKey] = useState(null);
    const [usage, setUsage] = useState(0);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const fetchKey = async () => {
            if (!user?.token) return;
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

        fetchKey();
    }, [user?.token]);

    const handleCopy = () => {
        navigator.clipboard.writeText(apiKey);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (loading) return (
        <div className="flex justify-center items-center h-full min-h-[50vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-600"></div>
        </div>
    );

    return (
        <div className="animate-slide-up max-w-5xl mx-auto space-y-8 pb-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h2 className="text-4xl font-display font-black text-slate-900 tracking-tight flex items-center gap-3">
                        <span className="p-2 bg-slate-900 text-white rounded-xl">
                            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M14.25 9.75 16.5 12l-2.25 2.25m-4.5 0L7.5 12l2.25-2.25M6 20.25h12A2.25 2.25 0 0 0 20.25 18V6A2.25 2.25 0 0 0 18 3.75H6A2.25 2.25 0 0 0 3.75 6v12A2.25 2.25 0 0 0 6 20.25Z" /></svg>
                        </span>
                        Portal do Desenvolvedor
                    </h2>
                    <p className="text-slate-500 mt-3 text-lg font-medium leading-relaxed max-w-2xl">
                        Integre o motor de IA do <strong className="text-indigo-600">ShieldCheck</strong> no seu ecossistema. Segurança de nível empresarial via API.
                    </p>
                </div>
                <div className="flex gap-2">
                    <span className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold border border-emerald-200 uppercase tracking-widest">Serviço Online</span>
                </div>
            </div>

            <div className="glass-dark rounded-[2rem] shadow-2xl overflow-hidden border border-slate-700/50">
                <div className="p-8 md:p-12 border-b border-slate-800/50 bg-slate-900/40">
                    <div className="flex flex-col lg:flex-row gap-12 items-center">
                        <div className="flex-1 w-full">
                            <h3 className="text-white text-2xl font-bold mb-6 flex items-center gap-3">
                                <div className="w-1.5 h-6 bg-indigo-500 rounded-full"></div>
                                Chave de API REST
                            </h3>
                            <div className="bg-slate-950/80 p-6 rounded-2xl border border-slate-800 ring-1 ring-white/5 shadow-inner">
                                <label className="block text-xs uppercase tracking-[0.2em] text-slate-500 font-black mb-3">Sua Credencial Secreta</label>
                                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                                    <code className="flex-1 bg-slate-900/50 text-emerald-400 px-5 py-3.5 rounded-xl font-mono text-base border border-slate-800 select-all overflow-x-auto">
                                        {apiKey}
                                    </code>
                                    <button
                                        onClick={handleCopy}
                                        className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3.5 rounded-xl transition-all font-bold shadow-lg shadow-indigo-900/40 flex items-center justify-center gap-2"
                                    >
                                        {copied ? (
                                            <><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg> Copiado!</>
                                        ) : (
                                            <><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg> Copiar</>
                                        )}
                                    </button>
                                </div>
                                <div className="mt-4 flex items-start gap-2 text-amber-500/90 text-sm font-medium">
                                    <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3Z" /></svg>
                                    Atenção: Trate esta chave como uma senha. Nunca a exponha em repositórios públicos.
                                </div>
                            </div>
                        </div>

                        <div className="w-full lg:w-72 bg-slate-800/30 p-8 rounded-2xl border border-slate-700/50 flex flex-col items-center text-center">
                            <div className="text-xs uppercase tracking-widest text-slate-400 font-bold mb-4">Uso Mensal (B2B)</div>
                            <div className="relative w-32 h-32 flex items-center justify-center mb-4">
                                <svg className="w-full h-full -rotate-90">
                                    <circle cx="64" cy="64" r="58" className="stroke-slate-700 fill-none" strokeWidth="8" />
                                    <circle cx="64" cy="64" r="58" className="stroke-indigo-500 fill-none" strokeWidth="8" strokeDasharray="364" strokeDashoffset={364 - (Math.min(usage, 1000) / 1000 * 364)} strokeLinecap="round" />
                                </svg>
                                <span className="absolute text-3xl font-black text-white">{usage}</span>
                            </div>
                            <div className="text-indigo-400 font-bold text-sm tracking-wide">Créditos de API ilimitados</div>
                        </div>
                    </div>
                </div>

                <div className="p-8 md:p-12">
                    <h3 className="text-white text-xl font-bold mb-6 flex items-center gap-3">
                        <div className="w-1.5 h-6 bg-emerald-500 rounded-full"></div>
                        Guia de Integração Rápida
                    </h3>
                    <div className="bg-slate-950/60 rounded-2xl p-6 border border-slate-800">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="px-2 py-1 bg-indigo-500/20 text-indigo-400 rounded text-[10px] font-black uppercase">Post</span>
                            <code className="text-slate-400 text-sm font-mono">{API_ENDPOINTS.B2B_ANALYZE}</code>
                        </div>
                        <pre className="text-sm font-mono leading-relaxed text-slate-300 overflow-x-auto whitespace-pre-wrap">
                            {`// Exemplo utilizando Node.js ou Browser
const result = await fetch('${API_ENDPOINTS.B2B_ANALYZE}', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'x-api-key': 'SUA_CHAVE_AQUI'
    },
    body: JSON.stringify({ 
        content: 'Conteúdo para analisar...', 
        type: 'text' 
    })
});

const data = await result.json();
console.log('Risco Detectado:', data.data.score); // 0-100`}
                        </pre>
                    </div>
                </div>
            </div>
        </div>
    );
}

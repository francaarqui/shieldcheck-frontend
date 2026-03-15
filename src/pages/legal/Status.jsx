import React from 'react';
import { Link } from 'react-router-dom';

export default function Status() {
    const systems = [
        { name: 'AI Engine (Multimodal Analysis)', status: 'Operational', uptime: '99.98%', latency: '240ms', color: 'bg-emerald-500' },
        { name: 'WhatsApp Bot API', status: 'Operational', uptime: '99.95%', latency: '120ms', color: 'bg-emerald-500' },
        { name: 'Payment Gateway (Stripe)', status: 'Operational', uptime: '100%', latency: '45ms', color: 'bg-emerald-500' },
        { name: 'Database & Storage', status: 'Operational', uptime: '99.99%', latency: '12ms', color: 'bg-emerald-500' },
        { name: 'Web Dashboard & Portal', status: 'Operational', uptime: '99.97%', latency: '85ms', color: 'bg-emerald-500' },
        { name: 'Affiliate System', status: 'Operational', uptime: '99.99%', latency: '32ms', color: 'bg-emerald-500' },
    ];

    return (
        <div className="max-w-4xl mx-auto px-6 py-12 bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-xl border border-slate-100 dark:border-slate-800 animate-fadeInUp">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">Status do Sistema</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">Monitoramento em tempo real da infraestrutura ShieldCheck AI.</p>
                </div>
                <div className="flex items-center gap-3 px-6 py-3 bg-emerald-500/10 text-emerald-600 rounded-2xl border border-emerald-500/20">
                    <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                    </span>
                    <span className="text-sm font-black uppercase tracking-widest">Sistemas Operacionais</span>
                </div>
            </div>

            <div className="space-y-4">
                {systems.map((system, i) => (
                    <div key={i} className="p-6 bg-slate-50 dark:bg-slate-950 rounded-3xl border border-slate-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 group hover:border-indigo-500/30 transition-all">
                        <div className="flex items-center gap-4">
                            <div className={`w-3 h-3 rounded-full ${system.color}`}></div>
                            <span className="font-bold text-slate-900 dark:text-white">{system.name}</span>
                        </div>
                        <div className="flex items-center gap-8">
                            <div className="text-center">
                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Uptime</div>
                                <div className="text-sm font-black text-slate-900 dark:text-white">{system.uptime}</div>
                            </div>
                            <div className="text-center">
                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Latência</div>
                                <div className="text-sm font-black text-slate-900 dark:text-white">{system.latency}</div>
                            </div>
                            <div className="min-w-[100px] text-right">
                                <span className="text-xs font-black text-emerald-500 uppercase tracking-widest">{system.status}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-12 p-8 bg-indigo-600 rounded-[2.5rem] text-white shadow-xl shadow-indigo-600/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[80px] rounded-full -mr-20 -mt-20"></div>
                <div className="relative z-10 space-y-4">
                    <h3 className="text-xl font-black">Notificações em Tempo Real</h3>
                    <p className="text-indigo-100 font-medium opacity-80 max-w-xl">
                        Inscreva-se para receber alertas imediatos caso qualquer serviço apresente instabilidade técnica.
                    </p>
                    <div className="flex gap-4 pt-2">
                        <input
                            type="email"
                            placeholder="seu@email.com"
                            className="flex-grow bg-white/10 border border-white/20 rounded-2xl px-6 py-3 text-sm font-medium placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/30"
                        />
                        <button className="px-8 py-3 bg-white text-indigo-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-transform">Inscrever</button>
                    </div>
                </div>
            </div>

            <div className="mt-12 pt-8 border-t border-slate-100 dark:border-slate-800 text-center">
                <Link to="/" className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">← Voltar para a Home</Link>
            </div>
        </div>
    );
}

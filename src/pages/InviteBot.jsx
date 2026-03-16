import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export default function InviteBot() {
    const { t } = useTranslation();

    const BOT_NUMBER = "5511910410404";
    const SHARE_TEXT = encodeURIComponent("🛡️ Olá! Recomendo usar o ShieldCheck AI para analisar links, áudios e prints suspeitos. É grátis e me ajuda muito!");
    const WHATSAPP_LINK = `https://wa.me/${BOT_NUMBER}?text=${SHARE_TEXT}`;

    const handleConnect = () => {
        window.location.href = WHATSAPP_LINK;
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-[#0a0c10] relative overflow-hidden font-sans">
            {/* Ultra-Premium Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full -z-10">
                <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-emerald-500/10 blur-[150px] rounded-full"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-indigo-600/10 blur-[150px] rounded-full"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03]"></div>
            </div>

            <div className="max-w-md w-full relative group animate-slide-up">
                {/* Glowing border effect */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500/50 to-indigo-500/50 rounded-[3rem] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>

                <div className="relative bg-slate-900/40 backdrop-blur-3xl p-10 md:p-12 rounded-[3rem] border border-white/10 shadow-3xl text-center space-y-10 overflow-hidden">

                    {/* Animated Verification Shield */}
                    <div className="flex justify-center">
                        <div className="relative">
                            <div className="absolute inset-0 bg-emerald-500 blur-2xl opacity-20 animate-pulse"></div>
                            <div className="relative w-28 h-28 rounded-[2.5rem] bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white shadow-[0_0_50px_rgba(16,185,129,0.3)] transform hover:scale-110 transition-transform duration-500">
                                <svg className="w-14 h-14 drop-shadow-lg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.154-2.048-.445-3z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em]">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                            Convidado VIP
                        </div>
                        <h1 className="text-4xl font-display font-black text-white tracking-tighter leading-tight">
                            ShieldCheck <br />
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-indigo-400">
                                AI Protection
                            </span>
                        </h1>
                        <p className="text-slate-400 font-medium leading-relaxed px-2 text-lg">
                            Você foi convidado para testar a nossa inteligência artificial de segurança direto no WhatsApp.
                        </p>
                    </div>

                    {/* Trust Indicators */}
                    <div className="grid grid-cols-2 gap-4 py-4">
                        <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
                            <div className="text-emerald-500 text-xl">⚡</div>
                            <div className="text-[10px] font-black text-white uppercase">Real-time</div>
                            <div className="text-[9px] text-slate-500 font-bold uppercase">Análise Imediata</div>
                        </div>
                        <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
                            <div className="text-indigo-500 text-xl">🔐</div>
                            <div className="text-[10px] font-black text-white uppercase">Privacy</div>
                            <div className="text-[9px] text-slate-500 font-bold uppercase">Criptografia Ponta-Ponta</div>
                        </div>
                    </div>

                    <div className="pt-2">
                        <button
                            onClick={handleConnect}
                            className="group relative w-full py-6 bg-emerald-500 text-white font-black rounded-[2rem] shadow-2xl shadow-emerald-500/20 transition-all hover:bg-emerald-600 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-4 overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                            <span className="uppercase tracking-[0.15em] text-sm">Acessar Inteligência AI</span>
                            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </button>

                        <div className="mt-8 flex items-center justify-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 opacity-50"></div>
                            <span className="text-[9px] text-slate-500 font-black uppercase tracking-[0.3em]">Cybersecurity verified</span>
                            <div className="w-2 h-2 rounded-full bg-emerald-500 opacity-50"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

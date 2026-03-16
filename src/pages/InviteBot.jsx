import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export default function InviteBot() {
    const { t } = useTranslation();

    // Configurações do Bot - Você pode ajustar o número se mudar no futuro
    const BOT_NUMBER = "5511910410404"; // Exemplo, pegue o real se possível
    const SHARE_TEXT = encodeURIComponent("🛡️ Olá! Recomendo usar o ShieldCheck AI para analisar links, áudios e prints suspeitos. É grátis e me ajuda muito!");
    const WHATSAPP_LINK = `https://wa.me/${BOT_NUMBER}?text=${SHARE_TEXT}`;

    useEffect(() => {
        // Opcional: Auto-redirecionar após alguns segundos se desejar
        // const timer = setTimeout(() => { window.location.href = WHATSAPP_LINK; }, 3000);
        // return () => clearTimeout(timer);
    }, []);

    const handleConnect = () => {
        window.location.href = WHATSAPP_LINK;
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-slate-50 dark:bg-slate-950 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full -z-10">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 blur-[120px] rounded-full animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 blur-[120px] rounded-full animate-pulse [animation-delay:2s]"></div>
            </div>

            <div className="max-w-md w-full glass-card p-10 rounded-[3rem] border border-white dark:border-slate-800 shadow-3xl text-center space-y-8 animate-slide-up">
                <div className="relative inline-block">
                    <div className="w-24 h-24 rounded-[2rem] bg-emerald-500 flex items-center justify-center text-white shadow-2xl shadow-emerald-500/20 translate-y-[-10%] sm:translate-y-0">
                        <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                    </div>
                </div>

                <div className="space-y-4">
                    <h1 className="text-3xl font-display font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                        Você foi convidado <br />
                        <span className="text-emerald-500">ShieldCheck AI</span>
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                        Proteja-se contra golpes e links suspeitos diretamente no seu WhatsApp com nossa IA avançada.
                    </p>
                </div>

                <div className="pt-4">
                    <button
                        onClick={handleConnect}
                        className="w-full py-5 bg-emerald-500 hover:bg-emerald-600 text-white font-black rounded-[2rem] shadow-xl shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3 text-sm uppercase tracking-widest"
                    >
                        <span>Começar no WhatsApp</span>
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </button>
                    <p className="mt-6 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                        🛡️ Verificado & Seguro por ShieldCheck AI
                    </p>
                </div>
            </div>
        </div>
    );
}

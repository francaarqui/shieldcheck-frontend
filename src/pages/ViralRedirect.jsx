import React, { useEffect } from 'react';

export default function ViralRedirect() {
    useEffect(() => {
        const BOT_NUMBER = "5511910410404";
        const SHARE_TEXT = encodeURIComponent("🛡️ Olá! Recomendo usar o ShieldCheck AI para analisar links, áudios e prints suspeitos. É grátis e me ajuda muito! Tente aqui: https://shieldcheckai.com/proteger");

        // Dispara o compartilhamento do WhatsApp
        const whatsappUrl = `https://wa.me/?text=${SHARE_TEXT}`;

        window.location.href = whatsappUrl;
    }, []);

    return (
        <div className="min-h-screen bg-[#0a0c10] flex items-center justify-center">
            <div className="text-center space-y-4">
                <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-emerald-500 font-black uppercase tracking-widest text-xs">Preparando indicação...</p>
            </div>
        </div>
    );
}

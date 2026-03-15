import React from 'react';
import { Link } from 'react-router-dom';

export default function Help() {
    return (
        <div className="max-w-4xl mx-auto px-6 py-12 bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-xl border border-slate-100 dark:border-slate-800 animate-fadeInUp">
            <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-8 tracking-tight">Central de Ajuda</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <div className="p-6 bg-slate-50 dark:bg-slate-950 rounded-3xl border border-slate-100 dark:border-slate-800 hover:border-indigo-500/30 transition-all">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 italic text-indigo-600">Como uso o Bot?</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Basta salvar o número oficial da ShieldCheck AI e encaminhar qualquer link, texto ou áudio suspeito. A IA responderá em segundos.</p>
                </div>
                <div className="p-6 bg-slate-50 dark:bg-slate-950 rounded-3xl border border-slate-100 dark:border-slate-800 hover:border-indigo-500/30 transition-all">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 italic text-indigo-600">O que é o Solo Bot?</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">É um plano focado 100% no seu WhatsApp, ideal para quem quer proteção rápida e barata sem precisar acessar o site.</p>
                </div>
                <div className="p-6 bg-slate-50 dark:bg-slate-950 rounded-3xl border border-slate-100 dark:border-slate-800 hover:border-indigo-500/30 transition-all">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 italic text-indigo-600">Como cancelo minha assinatura?</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Você pode gerenciar e cancelar seu plano a qualquer momento no painel de Configurações do seu portal.</p>
                </div>
                <div className="p-6 bg-slate-50 dark:bg-slate-950 rounded-3xl border border-slate-100 dark:border-slate-800 hover:border-indigo-500/30 transition-all">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 italic text-indigo-600">Os dados estão seguros?</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Sim! Utilizamos criptografia de nível militar e seguimos rigorosamente a LGPD para garantir sua privacidade.</p>
                </div>
            </div>

            <div className="space-y-6">
                <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4">Contato Direto</h2>
                <div className="flex items-center gap-4 p-8 bg-gradient-to-br from-indigo-600 to-blue-500 rounded-[2.5rem] text-white shadow-xl shadow-indigo-500/20">
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor font-bold"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                    </div>
                    <div>
                        <p className="font-black uppercase text-[10px] tracking-widest opacity-80">Suporte WhatsApp</p>
                        <p className="text-2xl font-black">(11) 96516-9481</p>
                    </div>
                </div>
            </div>

            <div className="mt-12 pt-8 border-t border-slate-100 dark:border-slate-800">
                <Link to="/" className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">← Voltar para a Home</Link>
            </div>
        </div>
    );
}

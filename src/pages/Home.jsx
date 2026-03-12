import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
    return (
        <div className="w-full animate-fadeIn">
            {/* Hero Section */}
            <section className="text-center space-y-8 py-20 px-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-full text-xs font-black uppercase tracking-widest border border-red-100 mb-4">
                    <span className="flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                    </span>
                    Proteção em tempo real ativada
                </div>

                <h1 className="text-6xl md:text-8xl font-display font-black text-slate-900 tracking-tighter leading-tight max-w-5xl mx-auto">
                    Não seja a próxima <span className="text-premium-gradient">Vítima de Golpes</span> Digitais.
                </h1>

                <p className="text-xl md:text-2xl text-slate-500 max-w-3xl mx-auto font-medium leading-relaxed">
                    O ShieldCheck AI utiliza inteligência artificial militar para detectar fraudes em links, áudios e mensagens antes que você clique.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
                    <Link to="/register" className="w-full sm:w-auto px-10 py-5 bg-slate-900 text-white font-black rounded-3xl hover:bg-black transition-all shadow-2xl hover-lift text-xl">
                        Começar Proteção Grátis
                    </Link>
                    <Link to="/login" className="w-full sm:w-auto px-10 py-5 bg-white border-2 border-slate-100 text-slate-700 font-black rounded-3xl hover:border-slate-300 transition-all text-xl">
                        Acessar minha conta
                    </Link>
                </div>
            </section>

            {/* Value Proposition */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-8 py-20 max-w-6xl mx-auto px-4">
                <div className="glass-card p-10 rounded-[2.5rem] border border-white shadow-xl space-y-4">
                    <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor font-bold"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">Análise Instantânea</h3>
                    <p className="text-slate-500 font-bold leading-relaxed">Cole um link ou áudio e receba o veredito de risco em menos de 2 segundos.</p>
                </div>

                <div className="glass-card p-10 rounded-[2.5rem] border border-white shadow-xl space-y-4">
                    <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor font-bold"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">Blindagem Multimodal</h3>
                    <p className="text-slate-500 font-bold leading-relaxed">Nossa IA transcreve áudios e lê prints para detectar golpes que enganam os humanos.</p>
                </div>

                <div className="glass-card p-10 rounded-[2.5rem] border border-white shadow-xl space-y-4">
                    <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor font-bold"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">Inteligência Comunitária</h3>
                    <p className="text-slate-500 font-bold leading-relaxed">Cada golpe reportado alimenta nossa rede, protegendo todos os outros usuários instantaneamente.</p>
                </div>
            </section>

            {/* Pricing Section */}
            <section className="py-20 max-w-5xl mx-auto px-4">
                <div className="text-center mb-16 space-y-4">
                    <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">Escolha seu nível de defesa</h2>
                    <p className="text-slate-500 font-medium">Economize até 35% no plano anual e blinde sua família.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-white p-10 rounded-[3rem] border-2 border-slate-100 shadow-xl space-y-8">
                        <div className="space-y-2">
                            <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Plano Grátis</span>
                            <h3 className="text-3xl font-black text-slate-900">Comunitário</h3>
                        </div>
                        <ul className="space-y-4">
                            <li className="flex items-center gap-3 text-slate-600 font-bold">
                                <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                3 Análises de Texto/dia
                            </li>
                            <li className="flex items-center gap-3 text-slate-600 font-bold">
                                <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                1 Análise de Áudio/dia
                            </li>
                            <li className="flex items-center gap-3 text-slate-400 font-bold line-through">
                                Histórico Permanente
                            </li>
                        </ul>
                        <Link to="/register" className="block w-full text-center py-4 border-2 border-slate-200 rounded-2xl font-black hover:bg-slate-50 transition-all text-lg text-slate-700">Começar Agora</Link>
                    </div>

                    <div className="bg-slate-900 p-10 rounded-[3rem] border-4 border-indigo-500 shadow-2xl space-y-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 bg-indigo-500 text-white px-6 py-2 font-black text-[10px] uppercase tracking-[0.2em] rounded-bl-3xl">Recomendado</div>

                        <div className="space-y-2">
                            <span className="text-xs font-black text-indigo-400 uppercase tracking-widest">Plano Premium</span>
                            <h3 className="text-3xl font-black text-white">Blindagem Total</h3>
                        </div>
                        <ul className="space-y-4">
                            <li className="flex items-center gap-3 text-indigo-100 font-bold text-lg">
                                <svg className="w-6 h-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                Análises Ilimitadas
                            </li>
                            <li className="flex items-center gap-3 text-indigo-100 font-bold text-lg">
                                <svg className="w-6 h-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                Histórico Completo
                            </li>
                            <li className="flex items-center gap-3 text-indigo-100 font-bold text-lg">
                                <svg className="w-6 h-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                Suporte Prioritário 24/7
                            </li>
                        </ul>
                        <div className="flex items-baseline gap-2 text-white">
                            <span className="text-5xl font-black tracking-tighter">R$ 149,90</span>
                            <span className="text-indigo-400 font-black uppercase text-[10px]">por ano</span>
                        </div>
                        <Link to="/register" className="block w-full text-center py-5 bg-indigo-600 text-white rounded-2xl font-black hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-500/20 text-xl border-b-4 border-indigo-700">Garantir Proteção Premium</Link>
                    </div>
                </div>
            </section>
        </div>
    );
}

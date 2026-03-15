import React, { useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';

export default function Success() {
    const { t } = useTranslation();
    const { user, setUser } = useContext(AuthContext);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const planFromUrl = params.get('plan');

        if (user && planFromUrl && user.plan !== planFromUrl) {
            const updatedUser = { ...user, plan: planFromUrl.toUpperCase() };
            setUser(updatedUser);
            localStorage.setItem('shieldcheck_user', JSON.stringify(updatedUser));
        }
    }, [user, setUser]);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center items-center p-6 relative overflow-hidden">
            {/* Celebration Background Elements */}
            <div className="absolute top-10 left-10 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-10 right-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

            <div className="glass-card p-10 md:p-16 rounded-[3rem] shadow-2xl max-w-2xl w-full text-center border-t-8 border-t-emerald-500 animate-slide-up relative z-10">
                <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-900/30 rounded-3xl flex items-center justify-center mx-auto mb-8 text-emerald-500 shadow-lg rotate-3 group hover:rotate-0 transition-transform duration-500">
                    <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                </div>

                <div className="space-y-4 mb-10">
                    <h1 className="text-4xl md:text-5xl font-display font-black text-slate-900 dark:text-white tracking-tight">
                        {t('success.title') || 'Assinatura Confirmada!'} 🚀
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 text-xl font-medium max-w-md mx-auto leading-relaxed">
                        Sua blindagem digital foi elevada para o nível <span className="text-premium-gradient font-black">{new URLSearchParams(window.location.search).get('plan') || 'PREMIUM'}</span>.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left mb-12">
                    <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-800">
                        <h3 className="font-black text-slate-900 dark:text-white text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                            Próximos Passos
                        </h3>
                        <ul className="space-y-4">
                            {[
                                { text: 'Salvar número no WhatsApp', icon: '📱' },
                                { text: 'Realizar primeira análise', icon: '🔍' },
                                { text: 'Explorar a Academy', icon: '🎓' }
                            ].map((step, i) => (
                                <li key={i} className="flex items-center gap-3 text-sm font-bold text-slate-600 dark:text-slate-400 group">
                                    <span className="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">{step.icon}</span>
                                    {step.text}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="bg-indigo-600 p-6 rounded-2xl text-white shadow-xl shadow-indigo-200 dark:shadow-none flex flex-col justify-between">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-1">Status da Conta</p>
                            <h4 className="text-lg font-display font-black">Proteção Ilimitada</h4>
                        </div>
                        <p className="text-xs font-medium opacity-90 mt-4 leading-relaxed">Todas as ferramentas de inteligência foram liberadas para o seu e-mail.</p>
                        <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase">ShieldCheck AI</span>
                            <span className="px-2 py-0.5 bg-white/20 rounded text-[8px] font-bold">ATIVA</span>
                        </div>
                    </div>
                </div>

                <Link to="/dashboard" className="w-full inline-flex items-center justify-center bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black py-5 rounded-2xl shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] uppercase tracking-widest text-sm mb-4">
                    Explorar meu Dashboard
                </Link>

                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                    Um recibo foi enviado para seu e-mail.
                </p>
            </div>
        </div>
    );
}

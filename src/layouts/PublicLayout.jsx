import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import Footer from '../components/Footer';
import LanguageSwitcher from '../components/LanguageSwitcher';

export default function PublicLayout() {
    const { t } = useTranslation();
    const { isDarkMode, toggleTheme } = useTheme();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center transition-colors duration-300">
            {/* App brand header */}
            <header className="w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-sm py-4 px-6 fixed top-0 z-[100] transition-all duration-300 border-b border-slate-200/50 dark:border-slate-800/50">
                <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-indigo-600/20 group-hover:scale-110 transition-transform">S</div>
                        <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">ShieldCheck AI</h1>
                    </Link>

                    {/* DESKTOP NAV */}
                    <nav className="hidden lg:flex items-center gap-8">
                        <div className="relative group">
                            <button className="flex items-center gap-1.5 text-xs font-black text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-white transition-all uppercase tracking-widest py-2">
                                {t('nav.solutions') || 'Soluções'}
                                <svg className="w-3 h-3 opacity-50 group-hover:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            {/* Mega Dropdown Mini */}
                            <div className="absolute top-full left-1/2 -translate-x-1/2 w-64 pt-4 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300 z-50">
                                <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-3 grid grid-cols-1 gap-1">
                                    {[
                                        { name: t('footer.links.analyze'), to: '/analyze', color: 'bg-blue-500' },
                                        { name: t('footer.links.stores'), to: '/store-checker', color: 'bg-indigo-500' },
                                        { name: t('landing.scam_map.cta'), to: '/#scam-map', color: 'bg-red-500' }
                                    ].map((item, i) => (
                                        <a key={i} href={item.to} className="flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all group/item">
                                            <div className={`w-2 h-2 rounded-full ${item.color} group-hover/item:scale-150 transition-transform`}></div>
                                            <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">{item.name}</span>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <Link to="/academy" className="text-xs font-black text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-white transition-all uppercase tracking-widest">{t('common.academy')}</Link>
                        <Link to="/community" className="text-xs font-black text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-white transition-all uppercase tracking-widest">{t('tools.sidebar.community') || 'Comunidade'}</Link>
                        <Link to="/#planos" className="text-xs font-black text-indigo-600 dark:text-indigo-400 hover:scale-105 transition-all uppercase tracking-widest">{t('nav.plans')}</Link>
                    </nav>

                    <div className="flex items-center gap-2 md:gap-6">
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all border border-slate-100 dark:border-slate-700 shadow-sm"
                            title={isDarkMode ? t('nav.light_mode') : t('nav.dark_mode')}
                        >
                            {isDarkMode ? (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" /></svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" /></svg>
                            )}
                        </button>
                        <LanguageSwitcher />
                        <Link to="/login" className="hidden md:block text-[11px] font-black text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-white tracking-widest uppercase">{t('nav.login')}</Link>
                        <Link to="/register" className="px-5 py-3 md:px-8 md:py-4 bg-indigo-600 text-white text-[10px] md:text-xs font-black rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 active:scale-95 uppercase tracking-widest">
                            {t('nav.try_free')}
                        </Link>

                        {/* MOBILE MENU TOGGLE */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="lg:hidden p-2 text-slate-600 dark:text-slate-400"
                        >
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* MOBILE MENU OVERLAY */}
                {isMenuOpen && (
                    <div className="lg:hidden absolute top-full left-0 w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-6 animate-slide-down flex flex-col gap-4 shadow-2xl">
                        {[
                            { name: t('footer.links.analyze'), to: '/analyze' },
                            { name: t('footer.links.stores'), to: '/store-checker' },
                            { name: t('common.academy'), to: '/academy' },
                            { name: t('nav.plans'), to: '/#planos' },
                            { name: t('nav.login'), to: '/login' }
                        ].map((link, i) => (
                            <Link
                                key={i}
                                to={link.to}
                                onClick={() => setIsMenuOpen(false)}
                                className="text-base font-black text-slate-900 dark:text-white uppercase tracking-wider py-4 border-b border-slate-50 dark:border-slate-800 last:border-0 flex justify-between items-center"
                            >
                                {link.name}
                                <svg className="w-4 h-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
                            </Link>
                        ))}
                    </div>
                )}
            </header>


            {/* Main content area */}
            <main className="flex-1 w-full flex items-center justify-center relative overflow-hidden">
                {/* Background decorative elements for Premium feel */}
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full"></div>

                <div className="z-10 w-full flex justify-center py-20 px-4">
                    <Outlet />
                </div>
            </main>

            <Footer />
        </div>
    );
}

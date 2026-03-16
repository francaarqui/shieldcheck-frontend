import React, { useContext, useState } from 'react';
import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import LanguageSwitcher from '../components/LanguageSwitcher';
import OnboardingTour from '../components/OnboardingTour';
import MobileMenu from '../components/MobileMenu';

const CategoryHeader = ({ title, isOpen, toggle }) => (
    <button
        onClick={toggle}
        className={`w-full flex items-center justify-between px-5 py-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 group rounded-2xl mb-1
            ${isOpen
                ? 'bg-indigo-50/50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 border border-indigo-100/50 dark:border-indigo-900/30'
                : 'text-slate-500 dark:text-slate-400 hover:bg-white/80 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white border border-transparent'}
        `}
    >
        <span className="flex items-center gap-3">
            <span className={`w-1 h-4 rounded-full transition-all duration-300 ${isOpen ? 'bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]' : 'bg-slate-300 dark:bg-slate-700 group-hover:bg-slate-400'}`}></span>
            {title}
        </span>
        <svg
            className={`w-3.5 h-3.5 transition-transform duration-500 ${isOpen ? 'rotate-180 text-indigo-500' : 'text-slate-400'}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
        >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M19 9l-7 7-7-7" />
        </svg>
    </button>
);

export default function PrivateLayout() {
    const { t } = useTranslation();
    const { user, loading, logout } = useContext(AuthContext);
    const { isDarkMode, toggleTheme } = useTheme();
    const location = useLocation();

    // UI State for categories
    const [openCategories, setOpenCategories] = useState({
        protection: true,
        learning: false,
        business: false,
        management: false
    });
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleCategory = (cat) => {
        setOpenCategories(prev => ({ ...prev, [cat]: !prev[cat] }));
    };

    const getPageTitle = (path) => {
        const routes = {
            '/dashboard': t('common.dashboard'),
            '/analyze': t('common.analyze'),
            '/history': t('common.history'),
            '/family-guard': t('tools.sidebar.family_guard'),
            '/dark-web-scan': t('tools.sidebar.dark_web'),
            '/store-checker': t('tools.sidebar.store_auditor'),
            '/academy': t('tools.sidebar.academy'),
            '/community': t('tools.sidebar.community'),
            '/fraud-dictionary': t('tools.sidebar.fraud_dict'),
            '/brand-protection': t('tools.sidebar.brand_protect'),
            '/b2b-portal': t('tools.sidebar.business_portal'),
            '/enterprise-analytics': t('tools.sidebar.enterprise_analytics'),
            '/privacy-hub': t('tools.sidebar.privacy_hub'),
            '/plans': t('tools.sidebar.plans'),
            '/affiliate': t('tools.sidebar.referral'),
            '/settings': t('common.settings'),
            '/admin': t('common.admin_panel')
        };
        return routes[path] || path.replace('/', '').replace('-', ' ');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
                <p className="text-slate-500 font-medium animate-pulse">{t('common.loading')}</p>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    const categories = [
        {
            id: 'protection',
            title: t('tools.sidebar.protection_title'),
            items: [
                { label: t('common.dashboard'), path: '/dashboard', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg> },
                { label: t('common.analyze'), path: '/analyze', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg> },
                { label: t('common.history'), path: '/history', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
                { label: t('tools.sidebar.family_guard'), path: '/family-guard', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg> },
                { label: t('tools.sidebar.dark_web'), path: '/dark-web-scan', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg> },
                { label: t('tools.sidebar.store_auditor'), path: "/store-checker", icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 3.001 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z" /></svg> },
            ]
        },
        {
            id: 'learning',
            title: t('tools.sidebar.education_title'),
            items: [
                { label: t('tools.sidebar.academy'), path: '/academy', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 0 0 2.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 0 1 2.916.52 6.003 6.003 0 0 1-5.395 4.972m0 0a6.726 6.726 0 0 1-2.749 1.35m0 0a6.772 6.772 0 0 1-3.044 0" /></svg> },
                { label: t('tools.sidebar.community'), path: '/community', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg> },
                { label: t('tools.sidebar.fraud_dict'), path: '/fraud-dictionary', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg> },
            ]
        },
        {
            id: 'business',
            title: t('tools.sidebar.enterprise_title'),
            items: [
                { label: t('tools.sidebar.brand_protect'), path: '/brand-protection', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751A11.956 11.956 0 0 1 12 2.714Z" /></svg> },
                { label: t('tools.sidebar.business_portal'), path: '/b2b-portal', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 16.5h1.5m3 0H15M9 21v-4.5a2.25 2.25 0 0 1 2.25-2.25h1.5a2.25 2.25 0 0 1 2.25 2.25V21" /></svg> },
                { label: t('tools.sidebar.enterprise_analytics'), path: '/enterprise-analytics', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg> },
                { label: t('tools.sidebar.privacy_hub'), path: '/privacy-hub', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg> },
            ]
        },
        {
            id: 'management',
            title: t('tools.sidebar.account_title'),
            items: [
                { label: t('tools.sidebar.plans'), path: '/plans', icon: '💎' },
                { label: t('tools.sidebar.referral'), path: '/affiliate', icon: '🎁' },
                { label: t('common.settings'), path: '/settings', icon: '⚙️' }
            ]
        }
    ];

    // Add Admin if applicable
    if (user?.email?.toLowerCase().includes('tiago') || user?.email === import.meta.env.VITE_ADMIN_EMAIL) {
        const managementCat = categories.find(c => c.id === 'management');
        if (managementCat && !managementCat.items.find(i => i.path === '/admin')) {
            managementCat.items.push({
                label: t('common.admin_panel'), path: '/admin', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
            });
        }
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex transition-colors duration-500 overflow-hidden relative">
            <MobileMenu
                isOpen={isMobileMenuOpen}
                onClose={() => setIsMobileMenuOpen(false)}
                categories={categories}
                user={user}
                logout={logout}
            />
            {/* Sidebar */}
            <aside className="hidden lg:flex w-72 bg-white/40 dark:bg-slate-900/40 backdrop-blur-2xl border-r border-slate-200 dark:border-slate-800 flex-col sticky top-0 h-screen transition-all z-50 overflow-hidden">
                {/* Brand Banner */}
                <div className="p-8 pb-4">
                    <Link to="/dashboard" className="relative group block">
                        <div className="absolute -inset-2 bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-600 rounded-[2.5rem] blur-xl opacity-0 group-hover:opacity-20 transition-all duration-700"></div>
                        <div className="relative p-5 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm rounded-3xl border border-white dark:border-slate-800 flex flex-col items-center text-center gap-3 shadow-xl shadow-indigo-500/5 group-hover:shadow-indigo-500/10 transition-all duration-500">
                            <div className="w-14 h-14 rounded-2xl bg-premium-gradient flex items-center justify-center text-white font-black text-2xl shadow-2xl shadow-indigo-600/30 transform -rotate-6 group-hover:rotate-0 transition-all duration-500">
                                S
                            </div>
                            <div>
                                <h1 className="text-xl font-display font-black text-slate-900 dark:text-white tracking-tighter leading-none">
                                    ShieldCheck <span className="text-indigo-600">AI</span>
                                </h1>
                                <div className="flex items-center gap-1.5 justify-center mt-1.5">
                                    <div className="w-1 h-1 bg-indigo-500 rounded-full animate-pulse"></div>
                                    <p className="text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.4em]">{t('tools.sidebar.elite_protection')}</p>
                                </div>
                            </div>
                        </div>
                    </Link>
                </div>

                <nav className="flex-1 px-4 py-2 overflow-y-auto custom-scrollbar">
                    <div className="space-y-1">
                        {categories.map((category) => (
                            <div key={category.id} className="mb-2">
                                <CategoryHeader
                                    title={category.title}
                                    isOpen={openCategories[category.id]}
                                    toggle={() => toggleCategory(category.id)}
                                />
                                <AnimatePresence initial={false}>
                                    {openCategories[category.id] && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                                            className="overflow-hidden space-y-1 px-2"
                                        >
                                            {category.items.map((item) => {
                                                const isActive = location.pathname.startsWith(item.path);
                                                return (
                                                    <Link
                                                        key={item.path}
                                                        to={item.path}
                                                        className={`group flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 font-bold text-xs
                                                            ${isActive
                                                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-indigo-900/40 translate-x-1'
                                                                : 'text-slate-600 dark:text-slate-400 hover:bg-white/80 dark:hover:bg-slate-800/80 hover:text-indigo-600 dark:hover:text-indigo-400'
                                                            }
                                                        `}
                                                    >
                                                        <span className={`${isActive ? 'text-white' : 'text-slate-400 group-hover:text-indigo-500'} transition-all duration-300`}>
                                                            {item.icon}
                                                        </span>
                                                        {item.label}
                                                        {isActive && (
                                                            <motion.div
                                                                layoutId="activeDot"
                                                                className="ml-auto w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)]"
                                                            />
                                                        )}
                                                    </Link>
                                                );
                                            })}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>
                </nav>

                {/* User Info & Logout */}
                <div className="p-4 border-t border-slate-200/50 dark:border-slate-800/50 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md">
                    <div className="flex items-center gap-3 mb-4 p-3 bg-white/60 dark:bg-slate-800/60 rounded-2xl border border-white dark:border-slate-700/50 shadow-sm">
                        <div className="relative">
                            <div className="w-10 h-10 rounded-xl bg-premium-gradient flex items-center justify-center text-white font-black text-lg border-2 border-white dark:border-slate-800 shadow-md">
                                {user?.name?.charAt(0) || user?.email?.charAt(0) || '?'}
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full shadow-lg"></div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="text-[11px] font-black text-slate-900 dark:text-white truncate">{user?.name || t('tools.sidebar.operator')}</h4>
                            <div className="flex items-center gap-1 mt-0.5">
                                <span className="text-[8px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">{user?.plan || 'PRO'} {t('tools.sidebar.plan_label')}</span>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={logout}
                        className="w-full flex items-center justify-center gap-2 py-3 bg-slate-900 dark:bg-slate-800 text-white dark:text-slate-300 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-red-600 transition-all duration-300 shadow-lg active:scale-95"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                        {t('common.logout')}
                    </button>
                </div>
            </aside>

            {/* Main Content Pane */}
            <main className="flex-1 flex flex-col h-screen overflow-y-auto w-full relative">
                {/* Background Blobs for specific feel */}
                <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/3 -z-10 pointer-events-none"></div>
                <div className="fixed bottom-0 left-0 w-[400px] h-[400px] bg-purple-500/5 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/4 -z-10 pointer-events-none"></div>

                {/* Top bar */}
                <header className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 py-4 px-4 lg:py-5 lg:px-10 flex justify-between items-center sticky top-0 z-40 transition-all duration-500">
                    <div className="flex items-center gap-4">
                        {/* Mobile Hamburger */}
                        <button
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="lg:hidden p-2.5 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-400 shadow-sm"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16m-7 6h7" />
                            </svg>
                        </button>

                        <div className="flex flex-col">
                            <div className="flex items-center gap-2 text-[8px] lg:text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">
                                <span className="hidden sm:inline">ShieldCheck AI</span>
                                <span className="hidden sm:inline text-slate-300">/</span>
                                <span className="text-indigo-600">{getPageTitle(location.pathname)}</span>
                            </div>
                            <h2 className="text-lg lg:text-xl font-black text-slate-900 dark:text-white capitalize leading-tight">
                                {location.pathname === '/' || location.pathname === '/dashboard' ? t('common.command_center') : getPageTitle(location.pathname)}
                            </h2>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 lg:gap-6">
                        <div className="flex items-center gap-2 p-1 bg-slate-100/50 dark:bg-slate-800/50 rounded-2xl border border-slate-200/50 dark:border-slate-700/50">
                            <button
                                onClick={toggleTheme}
                                className="p-2.5 rounded-xl bg-white dark:bg-slate-700 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all shadow-sm border border-slate-100 dark:border-slate-600"
                                title={isDarkMode ? "Light Mode" : "Dark Mode"}
                            >
                                {isDarkMode ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" /></svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" /></svg>
                                )}
                            </button>
                            <LanguageSwitcher />
                        </div>


                        <Link
                            to="/plans"
                            className="relative group flex items-center justify-center p-2.5 bg-yellow-400/10 dark:bg-yellow-400/5 rounded-xl border border-yellow-400/20 shadow-lg shadow-yellow-400/5 hover:scale-110 active:scale-95 transition-all"
                            title={user?.plan || 'Upgrade'}
                        >
                            <div className="absolute -inset-1 bg-yellow-400/20 rounded-full blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-yellow-500 drop-shadow-[0_0_3px_rgba(234,179,8,0.3)]">
                                <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433L10.788 3.21Z" clipRule="evenodd" />
                            </svg>
                        </Link>
                    </div>
                </header>

                <div className="p-4 sm:p-6 lg:p-10 pb-8">
                    <div className="max-w-7xl mx-auto animate-fade-in">
                        <Outlet />
                    </div>
                </div>

                {/* Mobile End of Page Marker */}
                <div className="lg:hidden w-full py-12 flex flex-col items-center gap-4 border-t border-slate-100 dark:border-slate-800">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 font-black text-xs">S</div>
                    <div className="flex flex-col items-center">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">ShieldCheck AI</span>
                        <span className="text-[8px] font-bold text-slate-300 dark:text-slate-600 uppercase tracking-widest mt-1">{t('common.full_protection_active')}</span>
                    </div>
                </div>
            </main>
            <OnboardingTour />
        </div>
    );
}

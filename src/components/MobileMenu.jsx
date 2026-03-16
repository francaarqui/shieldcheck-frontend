import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';

const MobileCategoryHeader = ({ title, isOpen, toggle }) => (
    <button
        onClick={toggle}
        className={`w-full flex items-center justify-between px-4 py-3 text-[9px] font-black uppercase tracking-[0.2em] transition-all duration-300 rounded-xl mb-1
            ${isOpen
                ? 'bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 border border-indigo-100/50 dark:border-indigo-900/30'
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 border border-transparent'}
        `}
    >
        <span className="flex items-center gap-2">
            <span className={`w-1 h-3 rounded-full ${isOpen ? 'bg-indigo-500' : 'bg-slate-300 dark:bg-slate-700'}`}></span>
            {title}
        </span>
        <svg
            className={`w-3 h-3 transition-transform duration-500 ${isOpen ? 'rotate-180 text-indigo-500' : 'text-slate-400'}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
        >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M19 9l-7 7-7-7" />
        </svg>
    </button>
);

export default function MobileMenu({ isOpen, onClose, categories, user, logout }) {
    const { t } = useTranslation();
    const location = useLocation();
    const [openCategories, setOpenCategories] = useState({});

    const toggleCategory = (id) => {
        setOpenCategories(prev => ({ ...prev, [id]: !prev[id] }));
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] lg:hidden"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '-100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '-100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed inset-y-0 left-0 w-[280px] bg-white dark:bg-slate-900 shadow-2xl z-[70] lg:hidden flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-premium-gradient flex items-center justify-center text-white font-black text-sm">
                                    S
                                </div>
                                <span className="font-display font-black text-slate-900 dark:text-white uppercase tracking-tight">ShieldCheck</span>
                            </div>
                            <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Navigation */}
                        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
                            {categories.map((category) => (
                                <div key={category.id} className="space-y-1">
                                    <MobileCategoryHeader
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
                                                className="overflow-hidden space-y-1 px-2 pb-2"
                                            >
                                                {category.items.map((item) => {
                                                    const isActive = location.pathname.startsWith(item.path);
                                                    return (
                                                        <Link
                                                            key={item.path}
                                                            to={item.path}
                                                            onClick={onClose}
                                                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-xs
                                                                ${isActive
                                                                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-none'
                                                                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                                                                }
                                                            `}
                                                        >
                                                            <span className={isActive ? 'text-white' : 'text-slate-400'}>{item.icon}</span>
                                                            {item.label}
                                                        </Link>
                                                    );
                                                })}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ))}
                        </nav>

                        {/* Footer */}
                        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-xl bg-premium-gradient flex items-center justify-center text-white font-black text-lg border-2 border-white dark:border-slate-800">
                                    {user?.name?.charAt(0) || '?'}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-black text-slate-900 dark:text-white truncate">{user?.name || t('tools.sidebar.operator')}</p>
                                    <p className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-widest">{user?.plan || 'PRO'}</p>
                                </div>
                                <LanguageSwitcher />
                            </div>
                            <button
                                onClick={() => { onClose(); logout(); }}
                                className="w-full py-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-red-100 dark:hover:bg-red-900/30 transition-all flex items-center justify-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                                {t('common.logout')}
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

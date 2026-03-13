import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

export default function PublicLayout() {
    const { isDarkMode, toggleTheme } = useTheme();

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center transition-colors duration-300">
            {/* App brand header */}
            <header className="w-full bg-white dark:bg-slate-900 shadow-sm py-4 px-6 flex justify-between items-center absolute top-0 z-50 transition-colors duration-300">
                <Link to="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-md">S</div>
                    <h1 className="text-xl font-bold text-slate-800 dark:text-white tracking-tight">ShieldCheck AI</h1>
                </Link>

                <div className="flex items-center gap-4">
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all border border-slate-100 dark:border-slate-700"
                        title={isDarkMode ? "Mudar para Modo Claro" : "Mudar para Modo Escuro"}
                    >
                        {isDarkMode ? (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" /></svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" /></svg>
                        )}
                    </button>
                    <Link to="/login" className="text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700">Entrar</Link>
                </div>
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

            <footer className="w-full border-t border-slate-200 dark:border-slate-800 py-6 bg-white dark:bg-slate-900 text-center text-slate-500 dark:text-slate-400 text-sm mt-auto transition-colors duration-300">
                <p>&copy; 2026 ShieldCheck AI.</p>
            </footer>
        </div>
    );
}

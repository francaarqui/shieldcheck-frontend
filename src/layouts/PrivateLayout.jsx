import React, { useContext } from 'react';
import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function PrivateLayout() {
    const { user, loading, logout } = useContext(AuthContext);
    const location = useLocation();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <p className="text-slate-500 font-medium animate-pulse">Carregando sistema...</p>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    const navItems = [
        { label: 'Dashboard', path: '/dashboard', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg> },
        { label: 'Nova Análise', path: '/analyze', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg> },
        { label: 'Histórico', path: '/history', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
        { label: 'Planos', path: '/plans', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
        { label: 'Configurações', path: '/settings', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg> },
    ];

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-slate-200 flex flex-col sticky top-0 h-screen transition-all">
                <div className="p-6 flex items-center gap-3 border-b border-slate-100">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-lg">S</div>
                    <div>
                        <h1 className="text-lg font-bold text-slate-800 tracking-tight leading-tight">ShieldCheck O.S</h1>
                        <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md inline-block mt-0.5">V1.0.0</span>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm
                ${location.pathname.startsWith(item.path)
                                    ? 'bg-indigo-50 text-indigo-700 shadow-sm'
                                    : 'text-slate-600 hover:bg-slate-50 hover:text-indigo-600'
                                }
              `}
                        >
                            {item.icon}
                            {item.label}
                        </Link>
                    ))}
                </nav>

                {/* User Card & Logout */}
                <div className="p-4 border-t border-slate-100">
                    <div className="bg-slate-50 rounded-xl p-4 flex flex-col gap-3">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold uppercase">
                                {user?.name?.charAt(0) || user?.email?.charAt(0) || '?'}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-slate-800 truncate">{user?.name || 'Usuário'}</p>
                                <p className="text-xs font-medium text-slate-500 truncate">{user?.email}</p>
                            </div>
                            {user.points !== undefined && (
                                <div className="flex items-center gap-1 text-xs font-bold text-indigo-600 bg-indigo-100 px-2 py-1 rounded-full">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z" clipRule="evenodd" />
                                    </svg>
                                    {user.points} XP
                                </div>
                            )}
                        </div>
                        <Link to="/store-checker" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${location.pathname === '/store-checker' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:bg-indigo-50 hover:text-indigo-700'}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 3.001 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z" /></svg>
                            Verificador de CNPJ
                        </Link>

                        <div className="pt-4 mt-2 border-t border-slate-100">
                            <h4 className="px-4 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Engajamento</h4>
                            <Link to="/academy" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${location.pathname === '/academy' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 0 0 2.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 0 1 2.916.52 6.003 6.003 0 0 1-5.395 4.972m0 0a6.726 6.726 0 0 1-2.749 1.35m0 0a6.772 6.772 0 0 1-3.044 0" /></svg>
                                Academia Anti-Golpe
                            </Link>
                        </div>

                        <div className="pt-4 mt-2 border-t border-slate-100">
                            <h4 className="px-4 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Conta Premium</h4>
                            <Link to="/developer" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${location.pathname === '/developer' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M14.25 9.75 16.5 12l-2.25 2.25m-4.5 0L7.5 12l2.25-2.25M6 20.25h12A2.25 2.25 0 0 0 20.25 18V6A2.25 2.25 0 0 0 18 3.75H6A2.25 2.25 0 0 0 3.75 6v12A2.25 2.25 0 0 0 6 20.25Z" /></svg>
                                API Desenvolvedor
                            </Link>
                        </div>
                        <button
                            onClick={logout}
                            className="w-full mt-1 flex items-center justify-center gap-2 text-xs font-semibold text-red-600 bg-white border border-red-100 hover:bg-red-50 hover:border-red-200 py-2 rounded-lg transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                            Sair do Sistema
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content Pane */}
            <main className="flex-1 flex flex-col h-screen overflow-y-auto w-full">
                {/* Top bar for mobile or extra actions */}
                <header className="bg-white border-b border-slate-200 py-4 px-8 flex justify-between items-center sticky top-0 z-40">
                    <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                        <span className="capitalize">{location.pathname.replace('/', '') || 'Início'}</span>
                    </div>

                    <div>
                        {user?.plan === 'PREMIUM' ? (
                            <span className="text-sm font-bold text-white bg-gradient-to-r from-purple-500 to-indigo-500 shadow-md shadow-indigo-200 px-4 py-1.5 rounded-lg flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-1.026.1-1.096 1.411-.298 1.944l3.708 2.478-1.034 4.545c-.201.884.662 1.625 1.455 1.139l4.135-2.541 4.135 2.541c.793.486 1.656-.255 1.455-1.139l-1.034-4.545 3.708-2.478c.8-.533.729-1.844-.298-1.944l-4.753-.381-1.83-4.401Z" clipRule="evenodd" /></svg>
                                Plano Premium
                            </span>
                        ) : (
                            <span className="text-sm font-bold text-slate-700 bg-slate-100 border border-slate-200 px-4 py-1.5 rounded-lg">Plano Gratuito</span>
                        )}
                    </div>
                </header>

                <div className="p-8 pb-20 w-full max-w-6xl mx-auto flex-1">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}

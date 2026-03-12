import React from 'react';
import { Outlet, Link } from 'react-router-dom';

export default function PublicLayout() {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center">
            {/* App brand header */}
            <header className="w-full bg-white shadow-sm py-4 px-6 flex justify-between items-center absolute top-0 z-50">
                <Link to="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-md">S</div>
                    <h1 className="text-xl font-bold text-slate-800 tracking-tight">ShieldCheck AI</h1>
                </Link>
            </header>

            {/* Main content area */}
            <main className="flex-1 w-full pt-20 pb-10">
                <Outlet />
            </main>

            <footer className="w-full border-t border-slate-200 py-6 bg-white text-center text-slate-500 text-sm mt-auto">
                <p>&copy; 2026 ShieldCheck AI.</p>
            </footer>
        </div>
    );
}

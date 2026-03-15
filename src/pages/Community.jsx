import React from 'react';
import CommunityHub from '../components/CommunityHub';

export default function Community() {
    return (
        <div className="animate-fadeIn max-w-6xl mx-auto p-4 md:p-8">
            <div className="mb-10 text-center md:text-left">
                <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-3">
                    Inteligência <span className="text-indigo-600">Coletiva.</span>
                </h1>
                <p className="text-slate-500 dark:text-slate-400 font-medium text-lg max-w-2xl">
                    Cada reporte salva uma vítima. Junte-se a milhares de Sentinelas para desmascarar fraudadores em tempo real.
                </p>
            </div>

            <CommunityHub />
        </div>
    );
}

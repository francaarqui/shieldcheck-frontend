import React from 'react';
import ReferralSystem from '../components/ReferralSystem';

export default function Affiliate() {
    return (
        <div className="animate-fadeIn max-w-6xl mx-auto p-4 md:p-8">
            <div className="mb-10 text-center md:text-left">
                <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-3">
                    Viralize a <span className="text-indigo-600">Segurança.</span>
                </h1>
                <p className="text-slate-500 dark:text-slate-400 font-medium text-lg max-w-2xl">
                    Ajude-nos a construir uma rede de proteção global e seja recompensado por cada novo escudo ativado.
                </p>
            </div>

            <ReferralSystem />
        </div>
    );
}

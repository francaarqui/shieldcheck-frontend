import React from 'react';
import { Link } from 'react-router-dom';

export default function Cancel() {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4">
            <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl max-w-lg w-full text-center border top-4 border-t-8 border-t-slate-300 animate-fadeInUp">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-500">
                    <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                </div>

                <h1 className="text-3xl font-black text-slate-800 mb-4">Assinatura Cancelada</h1>
                <p className="text-slate-600 mb-8 text-lg">
                    O pagamento não foi concluído ou você decidiu voltar. Nenhuma cobrança foi feita no seu cartão.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                    <Link to="/plans" className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl shadow-md transition-transform transform hover:-translate-y-0.5">
                        Tentar Novamente
                    </Link>
                    <Link to="/dashboard" className="flex-1 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold py-3.5 rounded-xl transition-colors">
                        Voltar ao Painel
                    </Link>
                </div>
            </div>
        </div>
    );
}

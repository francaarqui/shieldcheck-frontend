import React, { useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Success() {
    const { user, setUser } = useContext(AuthContext);

    // Simula a atualização local instantânea para fins de demonstração no frontend
    useEffect(() => {
        if (user && user.plan !== 'PREMIUM') {
            const updatedUser = { ...user, plan: 'PREMIUM' };
            setUser(updatedUser);
            localStorage.setItem('shieldcheck_user', JSON.stringify(updatedUser));
        }
    }, [user, setUser]);

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4">
            <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl max-w-lg w-full text-center border top-4 border-t-8 border-t-green-500 animate-fadeInUp">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-500">
                    <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                </div>

                <h1 className="text-3xl font-black text-slate-800 mb-4">Pagamento Confirmado!</h1>
                <p className="text-slate-600 mb-8 text-lg">
                    Sua conta foi atualizada para o <strong className="text-indigo-600">ShieldCheck Premium</strong> com sucesso. Aproveite o acesso ilimitado à nossa inteligência.
                </p>

                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 mb-8 text-left">
                    <h3 className="font-bold text-slate-700 mb-3 text-sm uppercase tracking-wide">O que foi liberado:</h3>
                    <ul className="space-y-2 text-slate-600 text-sm font-medium">
                        <li className="flex items-center gap-2"><svg className="text-indigo-500 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> Análises Ilimitadas</li>
                        <li className="flex items-center gap-2"><svg className="text-indigo-500 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> API de Desenvolvedor (B2B)</li>
                        <li className="flex items-center gap-2"><svg className="text-indigo-500 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> Exportação de Histórico Avançado</li>
                    </ul>
                </div>

                <Link to="/dashboard" className="w-full inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-md transition-transform transform hover:-translate-y-0.5">
                    Acessar meu Painel Premium
                </Link>
            </div>
        </div>
    );
}

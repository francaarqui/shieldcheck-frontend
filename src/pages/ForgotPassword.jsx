import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!email) return;
        // Mock functionality: Simulate sending a recovery email
        setTimeout(() => {
            setSubmitted(true);
        }, 1000);
    };

    return (
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 p-8 animate-fadeInUp">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-slate-900">Recuperar Senha</h2>
                <p className="text-slate-500 mt-2 text-sm">Enviaremos um link de redefinição para o seu e-mail.</p>
            </div>

            {!submitted ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">E-mail Cadastrado</label>
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-slate-800"
                            placeholder="seuemail@exemplo.com"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl shadow-md transition-transform transform hover:-translate-y-0.5"
                    >
                        Enviar link de recuperação
                    </button>
                </form>
            ) : (
                <div className="text-center py-6">
                    <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <h3 className="font-bold text-slate-800 mb-2">E-mail Enviado!</h3>
                    <p className="text-slate-600 text-sm mb-6">Verifique sua caixa de entrada e siga as instruções para criar uma nova senha.</p>
                </div>
            )}

            <div className="mt-8 text-center text-sm text-slate-500 border-t border-slate-100 pt-6">
                <Link to="/login" className="font-bold text-slate-600 hover:text-slate-900 flex items-center justify-center gap-2">
                    &larr; Voltar para o Login
                </Link>
            </div>
        </div>
    );
}

import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function ResetPassword() {
    const { t } = useTranslation();
    const { token } = useParams();
    const navigate = useNavigate();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            alert('As senhas não coincidem.');
            return;
        }

        setLoading(true);
        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
            const response = await fetch(`${API_URL}/api/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, newPassword }),
            });

            const data = await response.json();
            if (response.ok) {
                setSuccess(true);
                setTimeout(() => navigate('/login'), 3000);
            } else {
                alert(data.error || 'Erro ao redefinir senha.');
            }
        } catch (err) {
            console.error(err);
            alert('Erro de conexão com o servidor.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 p-8 animate-fadeInUp">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-slate-900">Nova Senha</h2>
                <p className="text-slate-500 mt-2 text-sm">Escolha sua nova senha de acesso.</p>
            </div>

            {!success ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Sua nova senha</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={e => setNewPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-slate-800"
                            placeholder="Mínimo 6 caracteres"
                            required
                            minLength={6}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Confirme a nova senha</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-slate-800"
                            placeholder="Repita a senha"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl shadow-md transition-transform transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Processando...' : 'Atualizar Senha'}
                    </button>
                </form>
            ) : (
                <div className="text-center py-6">
                    <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <h3 className="font-bold text-slate-800 mb-2">Senha Atualizada!</h3>
                    <p className="text-slate-600 text-sm mb-6">Sua senha foi alterada com sucesso. Redirecionando para o login...</p>
                </div>
            )}

            <div className="mt-8 text-center text-sm text-slate-500 border-t border-slate-100 pt-6">
                <Link to="/login" className="font-bold text-slate-600 hover:text-slate-900">
                    Ir para o Login
                </Link>
            </div>
        </div>
    );
}

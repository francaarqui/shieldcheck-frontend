import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { API_ENDPOINTS } from '../api/config';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await fetch(API_ENDPOINTS.LOGIN, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Erro ao fazer login');

            login(data.token, data.user);
            navigate('/dashboard');
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 p-8 animate-fadeInUp">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-slate-900">Acesse sua conta</h2>
                <p className="text-slate-500 mt-2 text-sm">Entre no painel do ShieldCheck AI</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium border border-red-100">
                        {error}
                    </div>
                )}

                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">E-mail</label>
                    <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-slate-800"
                        placeholder="seuemail@exemplo.com"
                        required
                    />
                </div>

                <div>
                    <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-semibold text-slate-700">Senha</label>
                        <Link to="/forgot-password" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">Esqueci minha senha</Link>
                    </div>
                    <input
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-slate-800"
                        placeholder="••••••••"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl shadow-md transition-transform transform hover:-translate-y-0.5 flex justify-center items-center"
                >
                    {isLoading ? (
                        <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    ) : 'Entrar no Sistema'}
                </button>
            </form>

            <div className="mt-8 text-center text-sm text-slate-500 border-t border-slate-100 pt-6">
                Ainda não tem conta? <Link to="/register" className="font-bold text-indigo-600 hover:text-indigo-700">Criar nova conta</Link>
            </div>
        </div>
    );
}

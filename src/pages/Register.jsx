import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { API_ENDPOINTS } from '../api/config';

export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            return setError('As senhas não coincidem.');
        }

        setIsLoading(true);
        setError('');

        try {
            const response = await fetch(API_ENDPOINTS.REGISTER, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Erro ao criar conta');

            login(data.token, data.user);
            navigate('/dashboard'); // Req: redirect to dashboard after registration
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 p-8 animate-fadeInUp">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-slate-900">Crie sua conta</h2>
                <p className="text-slate-500 mt-2 text-sm">Comece a usar o ShieldCheck gratuitamente</p>
            </div>

            <form onSubmit={handleRegister} className="space-y-5">
                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium border border-red-100">
                        {error}
                    </div>
                )}

                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nome Completo</label>
                    <input
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-slate-800"
                        placeholder="João da Silva"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">E-mail</label>
                    <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-slate-800"
                        placeholder="seuemail@exemplo.com"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Senha</label>
                    <input
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-slate-800"
                        placeholder="••••••••"
                        required
                        minLength={6}
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Confirmar Senha</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-slate-800"
                        placeholder="••••••••"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 mt-2 rounded-xl shadow-md transition-transform transform hover:-translate-y-0.5 flex justify-center items-center"
                >
                    {isLoading ? 'Criando conta...' : 'Cadastrar agora'}
                </button>
            </form>

            <div className="mt-6 text-center text-sm text-slate-500 border-t border-slate-100 pt-6">
                Já possui conta? <Link to="/login" className="font-bold text-indigo-600 hover:text-indigo-700">Fazer login</Link>
            </div>
        </div>
    );
}

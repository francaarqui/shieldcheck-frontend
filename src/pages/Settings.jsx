import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { API_ENDPOINTS } from '../api/config';

export default function Settings() {
    const { user, setUser } = useContext(AuthContext);

    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [password, setPassword] = useState('');

    const [whatsapp, setWhatsapp] = useState(user?.whatsapp_number || '');

    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [saving, setSaving] = useState(false);

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage('');
        setError('');

        try {
            const response = await fetch(API_ENDPOINTS.SETTINGS, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({ name, email, whatsapp_number: whatsapp, newPassword: password || undefined })
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error);

            setMessage(data.message);
            setUser({ ...user, name, email, whatsapp_number: whatsapp });
            setPassword(''); // Clear password field
        } catch (err) {
            setError(err.message || 'Erro ao atualizar os dados.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="animate-fadeIn max-w-3xl">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-slate-900">Configurações da Conta</h2>
                <p className="text-slate-500 mt-2">Atualize seus dados pessoais e preferências de segurança.</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <form onSubmit={handleSave} className="p-8">
                    {message && <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-xl border border-green-200 font-medium">{message}</div>}
                    {error && <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl border border-red-200 font-medium">{error}</div>}

                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Nome Completo</label>
                            <input
                                type="text"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-slate-800"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Endereço de E-mail</label>
                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-slate-800"
                                required
                            />
                        </div>

                        <div className="pt-6 border-t border-slate-100">
                            <h3 className="text-lg font-bold text-slate-800 mb-4">Integração WhatsApp Bot</h3>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Seu Número de WhatsApp</label>
                            <input
                                type="text"
                                value={whatsapp}
                                onChange={e => setWhatsapp(e.target.value.replace(/\D/g, ''))}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-slate-800"
                                placeholder="DD9XXXXXXXX (Ex: 11999999999)"
                            />
                            <p className="text-xs text-slate-400 mt-2">Ao cadastrar seu número, você poderá enviar mensagens para nosso Bot e ver o resultado aqui no seu dashboard.</p>

                            <div className="mt-6 p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                                <h4 className="text-sm font-bold text-indigo-900 mb-2">Como usar o Bot:</h4>
                                <ul className="text-xs text-indigo-700 space-y-2">
                                    <li className="flex items-start">
                                        <span className="mr-2">1.</span>
                                        <span>Adicione nosso número aos seus contatos: <strong>+55 11 99999-9999</strong> (Exemplo)</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="mr-2">2.</span>
                                        <span>Encaminhe qualquer mensagem suspeita ou link para análise.</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="mr-2">3.</span>
                                        <span>Você também pode enviar áudios! Nossa IA transcreve e analisa o risco de golpe para você.</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-slate-100">
                            <h3 className="text-lg font-bold text-slate-800 mb-4">Segurança</h3>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Nova Senha</label>
                            <input
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-slate-800"
                                placeholder="Deixe em branco para não alterar"
                            />
                            <p className="text-xs text-slate-400 mt-2">Recomendamos usar uma senha forte com pelo menos 8 caracteres.</p>
                        </div>

                        <div className="pt-8 flex justify-end">
                            <button
                                type="submit"
                                disabled={saving}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-xl shadow-md transition-transform transform hover:-translate-y-0.5"
                            >
                                {saving ? 'Salvando...' : 'Salvar Alterações'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

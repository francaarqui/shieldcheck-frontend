import React, { useState, useContext, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

    // MFA State
    const [showMFAModal, setShowMFAModal] = useState(false);
    const [mfaData, setMfaData] = useState(null);
    const [mfaToken, setMfaToken] = useState('');
    const [mfaVerifying, setMfaVerifying] = useState(false);

    const handleMFASetup = async () => {
        try {
            const res = await fetch('http://localhost:3000/api/mfa/setup', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            const data = await res.json();
            setMfaData(data);
            setShowMFAModal(true);
        } catch (err) {
            setError('Falha ao iniciar configuração de 2FA.');
        }
    };

    const handleMFAVerify = async () => {
        setMfaVerifying(true);
        try {
            const res = await fetch('http://localhost:3000/api/mfa/verify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({ token: mfaToken })
            });
            const data = await res.json();
            if (res.ok) {
                setMessage('Autenticação de dois fatores ativada!');
                setShowMFAModal(false);
                setUser({ ...user, mfa_enabled: true });
            } else {
                setError(data.error);
            }
        } catch (err) {
            setError('Erro ao verificar código MFA.');
        } finally {
            setMfaVerifying(false);
        }
    };

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
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold text-slate-800">Integração WhatsApp Bot</h3>
                                <div className={`px-3 py-1 rounded-full text-xs font-bold ${user?.plan !== 'FREE' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-500'}`}>
                                    {user?.plan === 'PRO' ? 'Licenças Ilimitadas' : user?.plan === 'BUSINESS' ? '5 Licenças' : user?.plan === 'PREMIUM' ? '1 Licença' : user?.plan === 'SOLO_BOT' ? '1 Licença (WhatsApp Only)' : 'Modo Free (3 análises/dia)'}
                                </div>
                            </div>

                            <label className="block text-sm font-semibold text-slate-700 mb-2">Seu Número de WhatsApp Primário</label>
                            <input
                                type="text"
                                value={whatsapp}
                                onChange={e => setWhatsapp(e.target.value.replace(/\D/g, ''))}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-slate-800 font-mono"
                                placeholder="DD9XXXXXXXX (Ex: 11999999999)"
                            />
                            <p className="text-xs text-slate-400 mt-2">Este número será reconhecido pelo ShieldCheck AI como sua conta <strong>{user?.plan || 'FREE'}</strong> para análises ilimitadas.</p>

                            <div className="mt-6 p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                                <h4 className="text-sm font-bold text-indigo-900 mb-2">Como usar seu Escudo no Celular:</h4>
                                <ul className="text-xs text-indigo-700 space-y-2">
                                    <li className="flex items-start">
                                        <span className="mr-2">1.</span>
                                        <span>Adicione nosso número oficial aos seus contatos: <strong>+55 11 99999-9999</strong></span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="mr-2">2.</span>
                                        <span>Encaminhe qualquer mensagem suspeita ou áudio para análise instantânea.</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="mr-2">3.</span>
                                        <span><strong>Anti-Clonagem:</strong> Sua licença Premium está amarrada ao número acima. Para trocá-lo, use este painel.</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-slate-100">
                            <h3 className="text-lg font-bold text-slate-800 mb-4">Segurança</h3>
                            <p className="text-xs text-slate-400 mt-2">Recomendamos usar uma senha forte com pelo menos 8 caracteres.</p>
                        </div>

                        {/* ELITE SECURITY (MFA) Section */}
                        <div className="pt-6 border-t border-slate-100">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-lg font-bold text-slate-800">Segurança de Elite (2FA)</h3>
                                <div className={`px-2 py-1 rounded-md text-[10px] font-black uppercase ${user?.mfa_enabled ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                                    {user?.mfa_enabled ? 'ATIVADO' : 'DESATIVADO'}
                                </div>
                            </div>
                            <p className="text-xs text-slate-500 mb-4 font-medium">Proteja sua conta com uma camada extra de segurança usando Google Authenticator ou similar.</p>

                            {!user?.mfa_enabled && (
                                <button
                                    type="button"
                                    onClick={handleMFASetup}
                                    className="px-6 py-3 bg-slate-900 dark:bg-slate-800 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:opacity-90 transition-all"
                                >
                                    Configurar 2FA agora
                                </button>
                            )}
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

            {/* MFA SETUP MODAL */}
            <AnimatePresence>
                {showMFAModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white dark:bg-slate-900 w-full max-w-md p-10 rounded-[3rem] shadow-2xl relative overflow-hidden"
                        >
                            <div className="flex flex-col items-center text-center">
                                <div className="w-16 h-16 bg-indigo-600 rounded-3xl flex items-center justify-center text-3xl mb-6">🔒</div>
                                <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-2">Configurar Camada Extra</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-6">Escaneie o QR Code abaixo com seu app de autenticação.</p>

                                <div className="p-4 bg-white rounded-3xl border-4 border-slate-50 mb-6">
                                    <img src={mfaData?.qrCodeUrl} alt="MFA QR Code" className="w-48 h-48" />
                                </div>

                                <div className="w-full space-y-4">
                                    <div className="text-left">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block text-center">Digite o código de 6 dígitos</label>
                                        <input
                                            type="text"
                                            maxLength={6}
                                            value={mfaToken}
                                            onChange={e => setMfaToken(e.target.value.replace(/\D/g, ''))}
                                            className="w-full h-14 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800 px-6 text-2xl font-black text-center tracking-[0.5em] focus:ring-2 focus:ring-indigo-500 outline-none"
                                            placeholder="000000"
                                        />
                                    </div>
                                    <button
                                        onClick={handleMFAVerify}
                                        disabled={mfaVerifying || mfaToken.length < 6}
                                        className="w-full h-16 bg-premium-gradient text-white rounded-2xl font-black uppercase tracking-widest disabled:opacity-50"
                                    >
                                        {mfaVerifying ? 'Verificando...' : 'Confirmar e Ativar'}
                                    </button>
                                    <button
                                        onClick={() => setShowMFAModal(false)}
                                        className="w-full text-slate-400 text-xs font-bold uppercase tracking-widest hover:text-slate-600"
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

import React, { useState, useContext, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../context/AuthContext';
import { API_ENDPOINTS } from '../api/config';

export default function Settings() {
    const { t } = useTranslation();
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
            setError(t('settings.messages.mfa_setup_fail'));
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
                setMessage(t('settings.messages.mfa_success'));
                setShowMFAModal(false);
                setUser({ ...user, mfa_enabled: true });
            } else {
                setError(data.error);
            }
        } catch (err) {
            setError(t('settings.messages.mfa_error'));
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
            setError(err.message || t('settings.messages.save_error'));
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="animate-fadeIn max-w-3xl">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-slate-900">{t('settings.title')}</h2>
                <p className="text-slate-500 mt-2">{t('settings.subtitle')}</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <form onSubmit={handleSave} className="p-8">
                    {message && <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-xl border border-green-200 font-medium">{message}</div>}
                    {error && <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl border border-red-200 font-medium">{error}</div>}

                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">{t('settings.labels.full_name')}</label>
                            <input
                                type="text"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-slate-800"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">{t('settings.labels.email')}</label>
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
                                <h3 className="text-lg font-bold text-slate-800">{t('settings.labels.integration_title')}</h3>
                                <div className={`px-3 py-1 rounded-full text-xs font-bold ${user?.plan !== 'FREE' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-500'}`}>
                                    {user?.plan === 'PRO' ? t('settings.plans.unlimited') : user?.plan === 'BUSINESS' ? t('settings.plans.licenses_5') : user?.plan === 'PREMIUM' ? t('settings.plans.license_1') : user?.plan === 'SOLO_BOT' ? t('settings.plans.solo_bot') : t('settings.plans.free_mode')}
                                </div>
                            </div>

                            <label className="block text-sm font-semibold text-slate-700 mb-2">{t('settings.labels.whatsapp_number')}</label>
                            <input
                                type="text"
                                value={whatsapp}
                                onChange={e => setWhatsapp(e.target.value.replace(/\D/g, ''))}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-slate-800 font-mono"
                                placeholder={t('settings.labels.whatsapp_placeholder')}
                            />
                            <p className="text-xs text-slate-400 mt-2" dangerouslySetInnerHTML={{ __html: t('settings.labels.whatsapp_note', { plan: user?.plan || 'FREE' }) }}></p>

                            <div className="mt-6 p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                                <h4 className="text-sm font-bold text-indigo-900 mb-2">{t('settings.whatsapp_guide.title')}</h4>
                                <ul className="text-xs text-indigo-700 space-y-2">
                                    <li className="flex items-start">
                                        <span className="mr-2">1.</span>
                                        <span dangerouslySetInnerHTML={{ __html: t('settings.whatsapp_guide.step1') }}></span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="mr-2">2.</span>
                                        <span>{t('settings.whatsapp_guide.step2')}</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="mr-2">3.</span>
                                        <span dangerouslySetInnerHTML={{ __html: t('settings.whatsapp_guide.step3') }}></span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-slate-100">
                            <h3 className="text-lg font-bold text-slate-800 mb-4">{t('settings.labels.security_title')}</h3>
                            <p className="text-xs text-slate-400 mt-2">{t('settings.labels.security_note')}</p>
                        </div>

                        {/* ELITE SECURITY (MFA) Section */}
                        <div className="pt-6 border-t border-slate-100">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-lg font-bold text-slate-800">{t('settings.labels.mfa_title')}</h3>
                                <div className={`px-2 py-1 rounded-md text-[10px] font-black uppercase ${user?.mfa_enabled ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                                    {user?.mfa_enabled ? t('settings.labels.mfa_active') : t('settings.labels.mfa_disabled')}
                                </div>
                            </div>
                            <p className="text-xs text-slate-500 mb-4 font-medium">{t('settings.labels.mfa_note')}</p>

                            {!user?.mfa_enabled && (
                                <button
                                    type="button"
                                    onClick={handleMFASetup}
                                    className="px-6 py-3 bg-slate-900 dark:bg-slate-800 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:opacity-90 transition-all"
                                >
                                    {t('settings.labels.mfa_setup_btn')}
                                </button>
                            )}
                        </div>

                        <div className="pt-8 flex justify-end">
                            <button
                                type="submit"
                                disabled={saving}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-xl shadow-md transition-transform transform hover:-translate-y-0.5"
                            >
                                {saving ? t('settings.labels.saving_btn') : t('settings.labels.save_btn')}
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
                                <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-2">{t('settings.mfa_modal.title')}</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-6">{t('settings.mfa_modal.subtitle')}</p>

                                <div className="p-4 bg-white rounded-3xl border-4 border-slate-50 mb-6">
                                    <img src={mfaData?.qrCodeUrl} alt="MFA QR Code" className="w-48 h-48" />
                                </div>

                                <div className="w-full space-y-4">
                                    <div className="text-left">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block text-center">{t('settings.mfa_modal.code_label')}</label>
                                        <input
                                            type="text"
                                            maxLength={6}
                                            value={mfaToken}
                                            onChange={e => setMfaToken(e.target.value.replace(/\D/g, ''))}
                                            className="w-full h-14 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800 px-6 text-2xl font-black text-center tracking-[0.5em] focus:ring-2 focus:ring-indigo-500 outline-none"
                                            placeholder={t('settings.mfa_modal.placeholder')}
                                        />
                                    </div>
                                    <button
                                        onClick={handleMFAVerify}
                                        disabled={mfaVerifying || mfaToken.length < 6}
                                        className="w-full h-16 bg-premium-gradient text-white rounded-2xl font-black uppercase tracking-widest disabled:opacity-50"
                                    >
                                        {mfaVerifying ? t('settings.mfa_modal.verifying_btn') : t('settings.mfa_modal.confirm_btn')}
                                    </button>
                                    <button
                                        onClick={() => setShowMFAModal(false)}
                                        className="w-full text-slate-400 text-xs font-bold uppercase tracking-widest hover:text-slate-600"
                                    >
                                        {t('settings.mfa_modal.cancel')}
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

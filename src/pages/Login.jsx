import React, { useState, useContext } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import { API_URL, API_ENDPOINTS } from '../api/config';
import { useTranslation } from 'react-i18next';
import { GoogleLogin } from '@react-oauth/google';

export default function Login() {
    const { t } = useTranslation();
    const [searchParams] = useSearchParams();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);

    // MFA State (Phase 6)
    const [mfaRequired, setMfaRequired] = useState(false);
    const [mfaToken, setMfaToken] = useState('');

    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        if (e) e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const body = { email, password };
            if (mfaRequired) {
                body.mfaToken = mfaToken;
            }

            const response = await fetch(API_ENDPOINTS.LOGIN, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            const data = await response.json();

            if (response.ok) {
                if (data.mfaRequired) {
                    setMfaRequired(true);
                    setIsLoading(false);
                    return;
                }
                login(data.token, data.user);

                const plan = searchParams.get('plan');
                const cycle = searchParams.get('cycle');

                if (plan && plan !== 'free') {
                    navigate(`/plans?auto=${plan}&cycle=${cycle || 'monthly'}`);
                } else {
                    navigate('/dashboard');
                }
            } else {
                throw new Error(data.error || t('auth.error_login'));
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        setIsGoogleLoading(true);
        setError('');

        try {
            const response = await fetch(`${API_URL}/api/google-login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ idToken: credentialResponse.credential }),
            });

            const data = await response.json();

            if (response.ok) {
                login(data.token, data.user);
                navigate('/dashboard');
            } else {
                throw new Error(data.error || 'Erro na autenticação com Google.');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setIsGoogleLoading(false);
        }
    };

    return (
        <div className="w-full max-w-6xl mx-auto flex flex-col md:flex-row bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl border border-white/50 dark:border-slate-800 rounded-[3rem] shadow-2xl overflow-hidden animate-fadeIn min-h-[700px]">

            {/* Coluna da Esquerda: Formulário de Login */}
            <div className="w-full md:w-[45%] p-8 md:p-16 flex flex-col justify-center relative overflow-hidden">
                {/* Header do Login */}
                <div className="text-center mb-10">
                    <div className="inline-flex p-4 rounded-3xl bg-gradient-to-br from-indigo-600 to-blue-500 shadow-lg shadow-indigo-500/30 mb-6 transition-all duration-500">
                        <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <h2 className="text-4xl font-display font-black text-slate-900 dark:text-white mb-2 tracking-tight">{t('auth.welcome')}</h2>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">{t('auth.login_subtitle')}</p>
                </div>

                <AnimatePresence mode="wait">
                    {!mfaRequired ? (
                        <motion.form
                            key="login-form"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            onSubmit={handleLogin}
                            className="space-y-5"
                        >
                            {error && (
                                <div className="bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 p-4 rounded-2xl text-sm font-bold border border-red-100 dark:border-red-500/20 flex items-center gap-3 animate-shake">
                                    <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {error}
                                </div>
                            )}

                            {/* Campo E-mail */}
                            <div className="space-y-2">
                                <label className="block text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">{t('auth.email_label')}</label>
                                <div className="relative group">
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        className="w-full pl-12 pr-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-500 outline-none transition-all text-slate-800 dark:text-slate-100 font-medium placeholder:text-slate-400 dark:placeholder:text-slate-600 shadow-sm group-hover:border-slate-300 dark:group-hover:border-slate-700"
                                        placeholder={t('auth.email_placeholder')}
                                        required
                                    />
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-600">
                                        <svg className="w-5 h-5 group-hover:text-indigo-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.206" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* Campo Senha */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-center ml-1">
                                    <label className="block text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{t('auth.password_label')}</label>
                                    <Link to="/forgot-password" title={t('auth.forgot_password')} className="text-[11px] font-black text-indigo-500 hover:text-indigo-600 uppercase tracking-widest transition-colors tracking-widest">{t('auth.forgot_password')}</Link>
                                </div>
                                <div className="relative group">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        className="w-full pl-12 pr-12 py-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-500 outline-none transition-all text-slate-800 dark:text-slate-100 font-medium placeholder:text-slate-400 dark:placeholder:text-slate-600 shadow-sm group-hover:border-slate-300 dark:group-hover:border-slate-700"
                                        placeholder={t('auth.password_placeholder')}
                                        required
                                    />
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-600">
                                        <svg className="w-5 h-5 group-hover:text-indigo-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-lg text-slate-400 hover:text-indigo-500 dark:text-slate-600 dark:hover:text-indigo-400 transition-colors"
                                    >
                                        {showPassword ? (
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" /></svg>
                                        ) : (
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Botão de Submit */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-indigo-600 dark:bg-indigo-500 text-white font-bold py-4 rounded-2xl shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/35 hover:-translate-y-0.5 active:translate-y-0 transition-all flex justify-center items-center text-lg mt-4"
                            >
                                {isLoading ? (
                                    <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    <span className="flex items-center gap-2">
                                        {t('auth.login_button')}
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                    </span>
                                )}
                            </button>

                            <div className="relative my-8">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-slate-200 dark:border-slate-800"></div>
                                </div>
                                <div className="relative flex justify-center text-sm uppercase">
                                    <span className="px-4 bg-white dark:bg-slate-900 text-slate-400 font-bold tracking-widest text-[10px]">{t('auth.or_use')}</span>
                                </div>
                            </div>

                            <div className="w-full flex justify-center">
                                <GoogleLogin
                                    onSuccess={handleGoogleSuccess}
                                    onError={() => setError('Falha no login com Google. Tente novamente.')}
                                    useOneTap
                                    theme={document.documentElement.classList.contains('dark') ? 'filled_black' : 'outline'}
                                    size="large"
                                    width="100%"
                                    shape="circle"
                                />
                            </div>
                        </motion.form>
                    ) : (
                        <motion.form
                            key="mfa-form"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            onSubmit={handleLogin}
                            className="space-y-6"
                        >
                            <div className="text-center">
                                <div className="inline-flex p-4 rounded-3xl bg-emerald-500 shadow-lg shadow-emerald-500/30 mb-6">
                                    <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">{t('auth.mfa_title')}</h3>
                                <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">{t('auth.mfa_subtitle')}</p>
                            </div>

                            {error && (
                                <div className="bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 p-4 rounded-2xl text-sm font-bold border border-red-100 dark:border-red-500/20 text-center animate-shake">
                                    {error}
                                </div>
                            )}

                            <div className="space-y-4">
                                <input
                                    type="text"
                                    maxLength={6}
                                    value={mfaToken}
                                    onChange={e => setMfaToken(e.target.value.replace(/\D/g, ''))}
                                    className="w-full h-16 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 px-6 text-3xl font-black text-center tracking-[0.5em] focus:ring-2 focus:ring-indigo-500 outline-none"
                                    placeholder="000000"
                                    autoFocus
                                    required
                                />
                                <button
                                    type="submit"
                                    disabled={isLoading || mfaToken.length < 6}
                                    className="w-full h-16 bg-premium-gradient text-white rounded-2xl font-black uppercase tracking-widest disabled:opacity-50"
                                >
                                    {isLoading ? t('auth.verifying') : t('auth.mfa_button')}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setMfaRequired(false)}
                                    className="w-full text-slate-400 text-xs font-bold uppercase tracking-widest hover:text-slate-600"
                                >
                                    {t('auth.back_to_login')}
                                </button>
                            </div>
                        </motion.form>
                    )}
                </AnimatePresence>

                <div className="mt-10 text-center">
                    <p className="text-slate-500 dark:text-slate-500 font-medium">
                        {t('auth.new_here')} <Link to="/register" className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline underline-offset-4 transition-all">{t('auth.create_account')}</Link>
                    </p>
                </div>
            </div>

            {/* Coluna da Direita: Painel Informativo (Visível apenas em md+) */}
            <div className="hidden md:flex md:w-[55%] bg-slate-900 dark:bg-slate-950 relative overflow-hidden flex-col justify-between p-16">
                {/* Background Decorativo */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-0 right-0 w-[80%] h-[80%] bg-indigo-600/20 blur-[150px] rounded-full"></div>
                    <div className="absolute bottom-0 left-0 w-[60%] h-[60%] bg-blue-600/10 blur-[120px] rounded-full"></div>
                </div>

                <div className="relative z-10">
                    <div className="w-16 h-1 w-20 bg-indigo-500 rounded-full mb-12"></div>
                    <h1 className="text-5xl font-black text-white leading-[1.1] mb-8 tracking-tighter">
                        {t('auth.marketing_title_line1')} <br /> <span className="text-indigo-400">{t('auth.marketing_title_highlight')}</span>
                    </h1>

                    <div className="space-y-8 mt-12">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20 flex-shrink-0">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                            </div>
                            <div>
                                <h3 className="text-white font-bold text-lg">{t('auth.feature1_title')}</h3>
                                <p className="text-slate-400 text-sm font-medium leading-relaxed">{t('auth.feature1_desc')}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20 flex-shrink-0">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" /></svg>
                            </div>
                            <div>
                                <h3 className="text-white font-bold text-lg">{t('auth.feature2_title')}</h3>
                                <p className="text-slate-400 text-sm font-medium leading-relaxed">{t('auth.feature2_desc')}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-400 border border-purple-500/20 flex-shrink-0">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                            </div>
                            <div>
                                <h3 className="text-white font-bold text-lg">{t('auth.feature3_title')}</h3>
                                <p className="text-slate-400 text-sm font-medium leading-relaxed">{t('auth.feature3_desc')}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="relative z-10 mt-auto">
                    <div className="flex items-center gap-4 p-8 bg-white/5 backdrop-blur-md rounded-[2.5rem] border border-white/10">
                        <div className="flex -space-x-3">
                            <div className="w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center overflow-hidden">
                                <img src="https://ui-avatars.com/api/?name=Tiago&background=6366f1&color=fff" alt="User" />
                            </div>
                            <div className="w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center overflow-hidden text-[10px] font-bold text-white">
                                +10k
                            </div>
                        </div>
                        <div>
                            <p className="text-white text-sm font-bold">{t('auth.social_proof')}</p>
                            <p className="text-slate-400 text-xs">{t('auth.social_proof_desc')}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

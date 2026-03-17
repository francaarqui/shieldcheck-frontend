import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function GeradorSenhas() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [length, setLength] = useState(20);
    const [options, setOptions] = useState({
        uppercase: true,
        numbers: true,
        symbols: true,
        ambiguous: false
    });
    const [strength, setStrength] = useState(0);

    const generatePassword = () => {
        const charset = {
            lowercase: 'abcdefghijklmnopqrstuvwxyz',
            uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
            numbers: '0123456789',
            symbols: '!@#$%^&*()_+~`|}{[]:;?><,./-=',
            ambiguous: 'lI1O0'
        };

        let chars = charset.lowercase;
        if (options.uppercase) chars += charset.uppercase;
        if (options.numbers) chars += charset.numbers;
        if (options.symbols) chars += charset.symbols;

        let generated = '';
        for (let i = 0; i < length; i++) {
            generated += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        setPassword(generated);
        calculateStrength(generated);
    };

    const calculateStrength = (pwd) => {
        let score = pwd.length * 4;
        if (options.uppercase) score += 10;
        if (options.numbers) score += 10;
        if (options.symbols) score += 15;
        setStrength(Math.min(score, 100));
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(password);
        // Could add a toast here
    };

    return (
        <div className="animate-slide-up max-w-5xl mx-auto space-y-12 pb-20 px-4 md:px-0">
            <div className="flex justify-start">
                <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-black rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all border border-slate-200 dark:border-slate-700 text-[10px] uppercase tracking-widest">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
                    {t('tools.analyze.back')}
                </button>
            </div>

            <div className="text-center md:text-left space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-100 dark:border-indigo-900/30">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                    </span>
                    {t('specialized_tools.common.header')}
                </div>
                <h2 className="text-4xl lg:text-5xl font-display font-black text-slate-900 dark:text-white tracking-tight">
                    {t('specialized_tools.gerador_senhas.title')}
                </h2>
                <p className="text-slate-500 dark:text-slate-400 text-lg font-medium max-w-2xl">
                    {t('specialized_tools.gerador_senhas.subtitle')}
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-12 glass-card p-10 rounded-[3rem] border border-white dark:border-slate-800 shadow-2xl space-y-10 group hover:border-indigo-500/30 transition-all duration-500">
                    <div className="relative">
                        <div className="relative flex flex-col md:flex-row items-center gap-4 bg-slate-900 dark:bg-black p-4 rounded-[2.5rem] border-2 border-slate-800 dark:border-slate-800 shadow-inner group-hover:border-indigo-500/20 transition-all">
                            <input
                                type="text"
                                value={password}
                                readOnly
                                className="flex-1 bg-transparent text-white font-mono text-2xl md:text-3xl px-8 py-6 outline-none tracking-[0.2em] placeholder:text-slate-700"
                                placeholder={t('specialized_tools.gerador_senhas.placeholder')}
                            />
                            <div className="flex gap-3 p-2">
                                <button
                                    onClick={copyToClipboard}
                                    className="p-5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-2xl transition-all active:scale-90 border border-slate-700"
                                    title={t('specialized_tools.gerador_senhas.copy_btn')}
                                >
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
                                </button>
                                <button
                                    onClick={generatePassword}
                                    className="px-10 py-5 bg-slate-100 dark:bg-white text-slate-900 font-black rounded-2xl transition-all shadow-xl active:scale-95 text-lg uppercase tracking-widest border border-white"
                                >
                                    {t('specialized_tools.gerador_senhas.generate')}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-end">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('specialized_tools.gerador_senhas.vulnerability') || "Nível de Blindagem"}</p>
                            <span className={`text-sm font-black ${strength > 80 ? 'text-emerald-500' : strength > 40 ? 'text-amber-500' : 'text-slate-400'}`}>
                                {strength > 80 ? t('specialized_tools.gerador_senhas.entropy') : strength > 40 ? t('specialized_tools.gerador_senhas.secure') : t('specialized_tools.gerador_senhas.vulnerable')}
                            </span>
                        </div>
                        <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div
                                className={`h-full transition-all duration-1000 ${strength > 80 ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]' : strength > 40 ? 'bg-amber-500' : 'bg-red-500'}`}
                                style={{ width: `${strength}%` }}
                            ></div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-10 border-t border-slate-100 dark:border-slate-800">
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('specialized_tools.gerador_senhas.length')}: {length}</label>
                            <input
                                type="range"
                                min="8"
                                max="64"
                                value={length}
                                onChange={(e) => setLength(parseInt(e.target.value))}
                                className="w-full accent-indigo-600"
                            />
                        </div>
                        <div className="flex flex-col gap-4">
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <input type="checkbox" checked={options.uppercase} onChange={(e) => setOptions({ ...options, uppercase: e.target.checked })} className="hidden" />
                                <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${options.uppercase ? 'bg-indigo-600 border-indigo-600' : 'border-slate-200 dark:border-slate-700'}`}>
                                    {options.uppercase && <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                                </div>
                                <span className="text-sm font-bold text-slate-600 dark:text-slate-300">{t('specialized_tools.gerador_senhas.uppercase')}</span>
                            </label>
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <input type="checkbox" checked={options.numbers} onChange={(e) => setOptions({ ...options, numbers: e.target.checked })} className="hidden" />
                                <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${options.numbers ? 'bg-indigo-600 border-indigo-600' : 'border-slate-200 dark:border-slate-700'}`}>
                                    {options.numbers && <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                                </div>
                                <span className="text-sm font-bold text-slate-600 dark:text-slate-300">{t('specialized_tools.gerador_senhas.numbers')}</span>
                            </label>
                        </div>
                        <div className="flex flex-col gap-4">
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <input type="checkbox" checked={options.symbols} onChange={(e) => setOptions({ ...options, symbols: e.target.checked })} className="hidden" />
                                <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${options.symbols ? 'bg-indigo-600 border-indigo-600' : 'border-slate-200 dark:border-slate-700'}`}>
                                    {options.symbols && <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                                </div>
                                <span className="text-sm font-bold text-slate-600 dark:text-slate-300">{t('specialized_tools.gerador_senhas.symbols')}</span>
                            </label>
                            <label className="flex items-center gap-3 cursor-pointer group opacity-50">
                                <input type="checkbox" disabled className="hidden" />
                                <div className="w-6 h-6 rounded-lg border-2 border-slate-200 dark:border-slate-700"></div>
                                <span className="text-sm font-bold text-slate-400">Salvar no Vault (Breve)</span>
                            </label>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 text-center flex flex-col justify-center">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{t('specialized_tools.gerador_senhas.pro_tip')}</p>
                            <p className="text-xs font-bold text-slate-600 dark:text-slate-400 leading-tight italic">{t('specialized_tools.gerador_senhas.pro_tip_desc')}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Home() {
    const { t } = useTranslation();
    const [billingCycle, setBillingCycle] = useState('monthly');

    return (
        <div className="w-full space-y-32 pb-32">
            {/* HERO SECTION - CONVERSION FOCUSED */}
            <section className="relative min-h-[90vh] flex items-center justify-center px-4 overflow-hidden pt-48 lg:pt-40">
                {/* Background mesh gradients */}
                <div className="absolute inset-0 -z-10 bg-mesh opacity-30 dark:opacity-20"></div>
                <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-indigo-500/10 blur-[150px] rounded-full animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-600/10 blur-[150px] rounded-full animate-pulse [animation-delay:2s]"></div>

                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 xl:gap-0 items-center relative z-10">
                    <div className="space-y-10 text-center lg:text-left animate-fadeIn">
                        <div className="space-y-6">
                            <h1 className="text-6xl md:text-7xl lg:text-8xl font-display font-black text-slate-900 dark:text-white tracking-tighter leading-[0.9] lg:leading-[1]">
                                {t('landing.hero.title')} <br />
                                <span className="text-premium-gradient">{t('landing.hero.title_highlight')}</span>
                            </h1>

                            <p className="text-xl md:text-2xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto lg:mx-0 font-medium leading-relaxed">
                                {t('landing.hero.subtitle')}
                            </p>
                        </div>

                        {/* IMMEDIATE TEST FIELD */}
                        <div className="relative group max-w-2xl mx-auto lg:mx-0">
                            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-[2.5rem] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                            <div className="relative flex flex-col sm:flex-row items-stretch gap-2 p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.2rem] shadow-2xl transition-all duration-300">
                                <div className="flex-1 flex items-center px-6 py-2">
                                    <svg className="w-6 h-6 text-slate-400 mr-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                                    <input
                                        type="text"
                                        placeholder={t('landing.hero.placeholder')}
                                        className="w-full bg-transparent border-none focus:ring-0 text-slate-900 dark:text-white placeholder:text-slate-400 font-bold text-lg"
                                    />
                                </div>
                                <Link
                                    to="/register"
                                    className="px-10 py-5 bg-indigo-600 text-white font-black rounded-3xl hover:bg-indigo-700 transition-all shadow-xl hover:shadow-indigo-500/20 active:scale-95 text-lg flex items-center justify-center"
                                >
                                    {t('landing.hero.cta_analyze')}
                                </Link>
                            </div>
                        </div>

                        {/* TRUST INDICATORS */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-4">
                            {[
                                { text: t('plans.features.phishing_detect'), icon: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
                                { text: t('plans.features.ocr_basic'), icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z' },
                                { text: t('plans.features.api_dev'), icon: 'M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.789 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4' },
                                { text: t('common.shield_score'), icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.154-2.048-.445-3z' }
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-2 group cursor-default">
                                    <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={item.icon} /></svg>
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                                        {item.text}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* SOCIAL PROOF */}
                        <div className="flex items-center justify-center lg:justify-start gap-4 pt-6">
                            <div className="flex -space-x-4 overflow-hidden">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="inline-block h-10 w-10 rounded-full ring-4 ring-white dark:ring-slate-950 bg-slate-200 dark:bg-slate-800 flex items-center justify-center border-2 border-indigo-500/20 overflow-hidden">
                                        <img src={`https://i.pravatar.cc/100?u=${i * 10}`} alt="User" />
                                    </div>
                                ))}
                            </div>
                            <p className="text-sm font-bold text-slate-500 dark:text-slate-400">
                                <span className="text-indigo-600 dark:text-indigo-400 font-black">+10.000 {t('auth.users')}</span> {t('landing.hero.trust_text')}
                            </p>
                        </div>
                    </div>


                    <div className="hidden lg:block relative p-12">
                        {/* THE MOCKUP IMAGE */}
                        <div className="relative z-10 animate-float">
                            <img
                                src="/assets/landing/abstract-shield.png"
                                alt="ShieldCheck Digital Protection"
                                className="w-full max-w-[600px] mx-auto rounded-[3.5rem] drop-shadow-[0_0_50px_rgba(99,102,241,0.4)]"
                            />
                        </div>

                        {/* Decorative background glow */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-indigo-500/10 dark:bg-indigo-500/20 blur-[150px] -z-10 rounded-full"></div>
                    </div>
                </div>
            </section>

            {/* PROBLEM SECTION */}
            <section className="max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div className="space-y-8">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 rounded-full text-xs font-black uppercase tracking-widest border border-red-500/20">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                            </span>
                            {t('landing.problem_badge') || 'Alerta de Risco'}
                        </div>
                        <h2 className="text-5xl md:text-6xl font-black text-slate-900 dark:text-white leading-tight tracking-tight">
                            {t('landing.problem_title_line1') || 'Os golpes digitais'} <br />
                            {t('landing.problem_title_line2') ? `${t('landing.problem_title_line2')} ` : ''}<span className="text-red-500 underline decoration-red-500/20">{t('landing.problem_title_highlight') || 'invisíveis.'}</span>
                        </h2>
                        <p className="text-xl text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                            {t('landing.problem_desc') || 'Todos os dias, milhões de brasileiros perdem dinheiro para criminosos que usam IA para criar mensagens perfeitas, vozes clonadas e sites que parecem idênticos aos reais.'}
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                                <div className="text-3xl font-black text-slate-900 dark:text-white mb-1">{t('landing.stats.lost_money')}</div>
                                <div className="text-sm font-bold text-slate-400 uppercase tracking-widest">{t('landing.stats.lost_money_label')}</div>
                            </div>
                            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                                <div className="text-3xl font-black text-slate-900 dark:text-white mb-1">{t('landing.stats.scam_ratio')}</div>
                                <div className="text-sm font-bold text-slate-400 uppercase tracking-widest">{t('landing.stats.scam_ratio_label')}</div>
                            </div>
                        </div>
                    </div>
                    <div className="relative">
                        <div className="absolute inset-0 bg-red-500/10 blur-[100px] rounded-full"></div>
                        <div className="relative glass-card bg-slate-950 rounded-[3rem] p-8 border border-red-500/20 shadow-2xl">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 p-4 bg-red-500/10 rounded-2xl border border-red-500/20 animate-pulse">
                                    <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor font-bold"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                    <div className="text-sm font-black text-red-400 uppercase">{t('landing.threat_alert') || 'Ameaça Detectada: Link de Phishing'}</div>
                                </div>
                                <div className="space-y-3 pt-4">
                                    <div className="h-4 w-3/4 bg-slate-800 rounded-full"></div>
                                    <div className="h-4 w-full bg-slate-800 rounded-full"></div>
                                    <div className="h-4 w-5/6 bg-slate-800 rounded-full"></div>
                                </div>
                                <div className="pt-6 flex justify-between items-center">
                                    <div className="text-xs font-bold text-slate-500">{t('landing.risk_score_label') || 'SCORE DE RISCO'}</div>
                                    <div className="text-2xl font-black text-red-500">98/100</div>
                                </div>
                                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-red-500 w-[98%]"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* REAL-TIME INTEL - GLOBAL SCAM MAP */}
            <section className="max-w-7xl mx-auto px-4">
                <div className="bg-slate-900 border border-slate-800 rounded-[4rem] p-12 lg:p-20 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-red-500/10 blur-[120px] -z-10 rounded-full group-hover:bg-red-500/20 transition-all" />
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="space-y-8">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-red-500/20">
                                Global Live Map
                            </div>
                            <h2 className="text-5xl font-black text-white leading-tight tracking-tighter">
                                {t('landing.scam_map.title')} <br />
                                <span className="text-red-500">{t('landing.scam_map.title_highlight')}</span>
                            </h2>
                            <p className="text-xl text-slate-400 font-medium leading-relaxed">
                                {t('landing.scam_map.desc')}
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                                    <div className="text-2xl font-black text-white">2.4k+</div>
                                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{t('landing.scam_map.stats_threats')}</div>
                                </div>
                                <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                                    <div className="text-2xl font-black text-red-500">98%</div>
                                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{t('landing.scam_map.stats_accuracy')}</div>
                                </div>
                            </div>
                            <div className="pt-4">
                                <Link to="/community" className="inline-flex items-center gap-2 text-white font-black uppercase text-sm tracking-widest hover:gap-4 transition-all">
                                    {t('landing.scam_map.cta')} <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                                </Link>
                            </div>
                        </div>
                        <div className="relative h-[400px] w-full bg-slate-800 rounded-[3rem] border border-white/5 overflow-hidden group/map animate-float">
                            <div className="absolute inset-0 opacity-40 bg-[url('https://upload.wikimedia.org/wikipedia/commons/2/2f/Brazil_location_map.svg')] bg-no-repeat bg-center bg-contain p-20 invert" />
                            <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-red-500 rounded-full animate-ping" />
                            <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-red-500 rounded-full animate-ping [animation-delay:1s]" />
                            <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-red-500 rounded-full animate-ping [animation-delay:2s]" />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                            <div className="absolute bottom-8 left-8 right-8 p-6 bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-white/10 flex items-center justify-between">
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black text-slate-500 uppercase">Live Intel</span>
                                    <span className="text-xs font-bold text-white">{t('landing.scam_map.live_label')}: São Paulo, SP</span>
                                </div>
                                <span className="text-red-500 text-xs font-black animate-pulse">● LIVE</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* HOW IT WORKS - 3 STEPS */}
            <section className="max-w-7xl mx-auto px-4 space-y-20">
                <div className="text-center space-y-4">
                    <h2 className="text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">{t('landing.how_it_works.title')}</h2>
                    <p className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-medium">{t('landing.how_it_works.subtitle')}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                    <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 dark:bg-slate-800 -z-10 translate-y-[-100%]"></div>

                    {[
                        { step: '01', title: t('landing.how_it_works.step1_title'), desc: t('landing.how_it_works.step1_desc'), icon: 'M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3' },
                        { step: '02', title: t('landing.how_it_works.step2_title'), desc: t('landing.how_it_works.step2_desc'), icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.989-2.386l-.548-.547z' },
                        { step: '03', title: t('landing.how_it_works.step3_title'), desc: t('landing.how_it_works.step3_desc'), icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' }
                    ].map((item, i) => (
                        <div key={i} className="flex flex-col items-center text-center space-y-6 relative group">
                            <div className="w-20 h-20 rounded-3xl bg-white dark:bg-slate-900 border-4 border-slate-50 dark:border-slate-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-xl group-hover:scale-110 transition-transform duration-500 z-10 relative">
                                <span className="absolute -top-3 -right-3 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs font-black shadow-lg">{item.step}</span>
                                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} /></svg>
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-2xl font-black text-slate-900 dark:text-white">{item.title}</h3>
                                <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed px-4">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>


            {/* ENTERPRISE & BRAND PROTECTION SECTION */}
            <section className="max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div className="order-2 lg:order-1 relative group">
                        <div className="absolute -inset-4 bg-indigo-500/20 blur-[100px] rounded-full group-hover:bg-indigo-500/30 transition-all" />
                        <img
                            src="/assets/landing/brand-shield-mockup.png"
                            alt="Brand Protection Dashboard"
                            className="relative w-full rounded-[3.5rem] shadow-3xl border-4 border-white/10 dark:border-slate-800 transform -rotate-2 hover:rotate-0 transition-all duration-700"
                        />
                        <div className="absolute top-10 right-10 p-6 bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl space-y-4 hidden xl:block animate-float">
                            <div className="flex justify-between items-center gap-10">
                                <h4 className="text-white font-black text-sm uppercase tracking-tighter">Threat Monitor</h4>
                                <div className="px-2 py-1 bg-red-500/20 text-red-500 rounded text-[8px] font-black uppercase">Active</div>
                            </div>
                            <div className="space-y-2">
                                <div className="p-3 bg-white/5 rounded-xl border border-white/5 flex items-center gap-3">
                                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                                    <div className="text-[10px] font-bold text-slate-300">New Clone: itau-fix.net</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="order-1 lg:order-2 space-y-8">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-premium-gradient text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-500/20">
                            {t('landing.brand_protection.badge')}
                        </div>
                        <h2 className="text-5xl md:text-6xl font-black text-slate-900 dark:text-white leading-tight tracking-tighter">
                            {t('landing.brand_protection.title')} <br />
                            <span className="text-premium-gradient">{t('landing.brand_protection.title_highlight')}</span>
                        </h2>
                        <p className="text-xl text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                            {t('landing.brand_protection.desc')}
                        </p>
                        <ul className="space-y-4 pt-4">
                            {t('landing.brand_protection.features', { returnObjects: true })?.map((item, i) => (
                                <li key={i} className="flex items-center gap-4 text-slate-600 dark:text-slate-300 font-bold">
                                    <div className="w-6 h-6 bg-indigo-600/10 rounded-lg flex items-center justify-center text-indigo-600 border border-indigo-600/20">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                    </div>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

            {/* ACADEMY 2.0 & DEEPFAKE LAB */}
            <section className="max-w-7xl mx-auto px-4 bg-slate-50 dark:bg-slate-900/50 rounded-[4rem] p-12 lg:px-24 py-24 relative overflow-hidden border border-slate-200 dark:border-slate-800">
                <div className="absolute top-0 left-0 w-64 h-64 bg-indigo-500/10 blur-[100px] -z-10 rounded-full" />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    <div className="space-y-8 text-center lg:text-left">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest">{t('landing.academy.badge')}</div>
                        <h2 className="text-5xl font-black text-slate-900 dark:text-white leading-tight tracking-tighter">
                            {t('landing.academy.title')} <br />
                            <span className="text-indigo-600">{t('landing.academy.title_highlight')}</span>
                        </h2>
                        <p className="text-xl text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                            {t('landing.academy.desc')}
                        </p>
                        <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                            <div className="px-6 py-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm text-center">
                                <div className="text-2xl font-black text-slate-900 dark:text-white">{t('landing.academy.stats_training')}</div>
                                <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{t('landing.academy.stats_training_label')}</div>
                            </div>
                            <div className="px-6 py-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm text-center">
                                <div className="text-2xl font-black text-indigo-600">{t('landing.academy.stats_certified')}</div>
                                <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{t('landing.academy.stats_certified_label')}</div>
                            </div>
                        </div>
                    </div>
                    <div className="relative group flex justify-center">
                        <div className="absolute inset-0 bg-indigo-600/20 blur-[120px] rounded-full group-hover:bg-indigo-600/40 transition-all" />
                        <img
                            src="/assets/landing/academy-premium-card.png"
                            alt="Shield Academy Certification"
                            className="relative w-full max-w-sm rounded-[3rem] shadow-3xl border-2 border-white/20 transform rotate-6 hover:rotate-0 transition-all duration-1000 animate-float"
                        />
                    </div>
                </div>
            </section>


            {/* WHATSAPP POWER SECTION */}
            <section className="max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center relative z-10">
                    <div className="order-2 lg:order-1 relative group">
                        <div className="absolute -inset-10 bg-emerald-500/10 blur-[120px] rounded-full group-hover:bg-emerald-500/20 transition-all" />
                        <img
                            src="/assets/landing/whatsapp-pro-ui.png"
                            alt="WhatsApp Protection Elite"
                            className="relative w-full max-w-[500px] mx-auto rounded-[3.5rem] shadow-3xl transform rotate-3 hover:rotate-0 transition-all duration-700"
                        />
                    </div>
                    <div className="order-1 lg:order-2 space-y-8">
                        <div className="w-20 h-1 bg-emerald-500 rounded-full"></div>
                        <h2 className="text-5xl md:text-6xl font-black text-slate-900 dark:text-white leading-tight tracking-tight">
                            {t('landing.whatsapp.title')} <br />
                            <span className="text-emerald-400">{t('landing.whatsapp.title_highlight')}</span>
                        </h2>
                        <p className="text-xl text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                            {t('landing.whatsapp.desc')}
                        </p>
                        <ul className="space-y-4">
                            {[
                                t('landing.whatsapp.feature1'),
                                t('landing.whatsapp.feature2'),
                                t('landing.whatsapp.feature3'),
                                t('landing.how_it_works.step3_desc')
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-4 text-slate-700 dark:text-slate-300 font-bold">
                                    <div className="w-6 h-6 bg-emerald-500/10 rounded-lg flex items-center justify-center text-emerald-500 border border-emerald-500/20">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                    </div>
                                    {item}
                                </li>
                            ))}
                        </ul>
                        <div className="pt-4">
                            <Link to="/help" className="inline-flex items-center gap-2 text-emerald-400 font-black uppercase text-sm tracking-widest hover:underline decoration-2">
                                {t('landing.whatsapp.cta')} →
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* BROWSER EXTENSION - PASSIVE PROTECTION */}
            <section className="max-w-7xl mx-auto px-4">
                <div className="flex flex-col lg:flex-row items-center gap-16 p-12 lg:p-20 bg-indigo-50 dark:bg-indigo-950/20 rounded-[4rem] border border-indigo-100 dark:border-indigo-800/50 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-64 h-64 bg-indigo-500/10 blur-[100px] -z-10 rounded-full"></div>
                    <div className="flex-1 space-y-8">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest">{t('landing.browser_guard.badge') || 'Browser Guard'}</div>
                        <h2 className="text-5xl font-black text-slate-900 dark:text-white leading-tight">
                            ShieldCheck <br />
                            <span className="text-premium-gradient">{t('landing.browser_guard.title') || 'Browser Guard'}</span>
                        </h2>
                        <p className="text-xl text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                            {t('landing.browser_guard.desc') || 'Nossa nova extensão para Chrome e Edge protege você passivamente enquanto você navega.'}
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {[
                                { t: t('landing.browser_guard.feature1_title') || 'Alertas em Tempo Real', d: t('landing.browser_guard.feature1_desc') || 'Notificações instantâneas em sites de risco.' },
                                { t: t('landing.browser_guard.feature2_title') || 'Blacklist Global', d: t('landing.browser_guard.feature2_desc') || 'Conectada à nossa base de dados atualizada.' }
                            ].map((item, i) => (
                                <div key={i} className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
                                    <div className="font-black text-indigo-600 text-xs mb-1 uppercase tracking-widest">{item.t}</div>
                                    <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">{item.d}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="flex-1 relative">
                        <div className="glass-card p-4 rounded-[2.5rem] border border-white dark:border-slate-800 shadow-2xl scale-110 lg:scale-125 rotate-2">
                            <div className="bg-slate-900 rounded-[2rem] p-6 space-y-4 text-white">
                                <div className="flex justify-between items-center">
                                    <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">🛡️</div>
                                    <div className="text-[10px] font-black text-indigo-400 uppercase">ShieldCheck Guard</div>
                                </div>
                                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl space-y-2">
                                    <div className="text-xs font-black text-red-500 uppercase">{t('landing.browser_guard.mock_alert') || 'SITE PERIGOSO DETECTADO'}</div>
                                    <div className="text-[10px] text-slate-400 font-mono">amazon-ofertas-hoje.net</div>
                                </div>
                                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-red-500 w-[95%]"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>


            {/* STORE CHECKER - E-COMMERCE TRUST */}
            <section className="max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div className="space-y-8">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 text-blue-500 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-500/20">
                            Safe Shopping
                        </div>
                        <h2 className="text-5xl font-black text-slate-900 dark:text-white leading-tight">
                            {t('landing.store_checker.title')} <br />
                            <span className="text-blue-500">{t('landing.store_checker.title_highlight')}</span>
                        </h2>
                        <p className="text-xl text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                            {t('landing.store_checker.desc')}
                        </p>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                            {t('landing.store_checker.features', { returnObjects: true })?.map((item, i) => (
                                <li key={i} className="flex items-start gap-3">
                                    <div className="flex-shrink-0 w-5 h-5 bg-blue-500/10 rounded-md flex items-center justify-center text-blue-500 border border-blue-500/20">
                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                    </div>
                                    <div className="space-y-0.5">
                                        <div className="text-[10px] font-black text-slate-800 dark:text-white uppercase tracking-tight">{item.t}</div>
                                        <div className="text-[9px] text-slate-500 font-bold">{item.d}</div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        <div className="flex gap-6 pt-4">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" alt="Stripe" className="h-6 opacity-30 grayscale hover:grayscale-0 transition-all" />
                            <img src="https://upload.wikimedia.org/wikipedia/commons/2/24/PayPal_logo.svg" alt="PayPal" className="h-6 opacity-30 grayscale hover:grayscale-0 transition-all" />
                            <img src="https://upload.wikimedia.org/wikipedia/commons/3/39/Google_Pay_Logo.svg" alt="GPay" className="h-6 opacity-30 grayscale hover:grayscale-0 transition-all" />
                        </div>
                        <div className="pt-4">
                            <Link to="/store-checker" className="inline-flex items-center gap-2 text-blue-500 font-black uppercase text-sm tracking-widest hover:gap-4 transition-all">
                                {t('landing.store_checker.cta')} <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                            </Link>
                        </div>
                    </div>
                    <div className="relative group">
                        <div className="absolute inset-0 bg-blue-500/10 blur-[120px] rounded-full group-hover:bg-blue-500/20 transition-all" />
                        <div className="relative glass-card bg-white dark:bg-slate-900 rounded-[3rem] p-1 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
                            <div className="p-8 space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center">🌐</div>
                                        <div className="text-xs font-bold text-slate-900 dark:text-white">iphone-por-metade-do-preco.com</div>
                                    </div>
                                    <div className="px-3 py-1 bg-red-500 text-white rounded-full text-[8px] font-black uppercase">SCAM</div>
                                </div>
                                <div className="space-y-4">
                                    <div className="p-4 bg-red-500/5 border border-red-500/10 rounded-2xl flex items-center justify-between">
                                        <span className="text-xs font-bold text-slate-500">Tempo de Domínio</span>
                                        <span className="text-xs font-black text-red-500">2 dias</span>
                                    </div>
                                    <div className="p-4 bg-red-500/5 border border-red-500/10 rounded-2xl flex items-center justify-between">
                                        <span className="text-xs font-bold text-slate-500">SSL Validado</span>
                                        <span className="text-xs font-black text-red-500">Falso / Auto-assinado</span>
                                    </div>
                                </div>
                                <div className="p-6 bg-red-600 rounded-2xl text-white text-center font-black uppercase text-xs tracking-widest shadow-lg shadow-red-500/20">
                                    Risco de Fraude Critico
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* BENEFITS / VALUE PROPOSITION */}
            <section className="max-w-7xl mx-auto px-4 bg-indigo-600 rounded-[4rem] p-12 lg:p-24 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-mesh opacity-20 pointer-events-none"></div>
                <div className="relative z-10 text-center space-y-16">
                    <div className="space-y-4">
                        <h2 className="text-5xl font-black text-white tracking-tight">{t('landing.benefits.title') || 'Tranquilidade Digital para você'}</h2>
                        <p className="text-xl text-indigo-100 max-w-2xl mx-auto font-medium opacity-80">{t('landing.benefits.subtitle') || 'Não é apenas sobre software, é sobre proteger o que você construiu.'}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { title: t('landing.benefits.item1_title') || 'Economize Dinheiro', desc: t('landing.benefits.item1_desc') || 'Evite prejuízos financeiros em transações falsas.', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
                            { title: t('landing.benefits.item2_title') || 'Proteja a Família', desc: t('landing.benefits.item2_desc') || 'Garanta que seus familiares não caiam em táticas de sequestro digital.', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
                            { title: t('landing.benefits.item3_title') || 'Faro Hacker', desc: t('landing.benefits.item3_desc') || 'Tenha o poder de análise de um especialista na palma da mão.', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.154-2.048-.445-3z' },
                            { title: t('landing.benefits.item4_title') || 'Educacional', desc: t('landing.benefits.item4_desc') || 'Reconheça golpes antes mesmo de usar nossa IA.', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' }
                        ].map((item, i) => (
                            <div key={i} className="flex flex-col items-center text-center space-y-4 p-8 bg-white/10 rounded-[3rem] backdrop-blur-md border border-white/10 hover:bg-white/20 transition-all duration-300">
                                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-xl">
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={item.icon} /></svg>
                                </div>
                                <h3 className="text-xl font-black text-white leading-tight">{item.title}</h3>
                                <p className="text-indigo-100 text-sm font-medium opacity-80 leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* AFFILIATE PROGRAM - VIRAL GROWTH */}
            <section className="max-w-7xl mx-auto px-4">
                <div className="bg-gradient-to-br from-indigo-900 to-slate-950 rounded-[4rem] p-12 lg:p-24 relative overflow-hidden border border-indigo-500/30">
                    <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-indigo-500/20 blur-[150px] rounded-full" />
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
                        <div className="order-2 lg:order-1 relative flex justify-center lg:justify-start">
                            <div className="relative glass-card bg-white/5 border border-white/10 p-8 rounded-[3rem] w-full max-w-sm rotate-[-3deg] hover:rotate-0 transition-transform duration-700">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-12 h-12 bg-premium-gradient rounded-2xl flex items-center justify-center text-white font-black">S</div>
                                    <div>
                                        <h4 className="text-white font-black uppercase text-xs tracking-widest">Carteira Shield</h4>
                                        <p className="text-indigo-400 text-[10px] font-bold">Programa de Afiliados</p>
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
                                        <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Saldo Compartilhável</div>
                                        <div className="text-4xl font-black text-white">R$ 1.240,00</div>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-tighter">
                                            <span className="text-slate-400">Meta Mensal</span>
                                            <span className="text-white">85% Concluído</span>
                                        </div>
                                        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                            <div className="h-full bg-premium-gradient w-[85%]" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="absolute top-[-20px] right-[-20px] p-6 bg-indigo-600 rounded-3xl text-white font-black shadow-2xl animate-bounce-slow flex flex-col items-center">
                                <span className="text-2xl">30%</span>
                                <span className="text-[8px] uppercase tracking-widest">Comissão</span>
                            </div>
                        </div>
                        <div className="order-1 lg:order-2 space-y-8">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/20 text-indigo-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-500/30">
                                Income Program
                            </div>
                            <h2 className="text-5xl font-black text-white leading-tight">
                                {t('landing.affiliate.title')} <br />
                                <span className="text-premium-gradient">{t('landing.affiliate.title_highlight')}</span>
                            </h2>
                            <p className="text-xl text-slate-400 font-medium leading-relaxed">
                                {t('landing.affiliate.desc')}
                            </p>
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {t('landing.affiliate.features', { returnObjects: true })?.map((item, i) => (
                                    <li key={i} className="flex gap-4">
                                        <div className="flex-shrink-0 w-6 h-6 bg-indigo-500/10 rounded-lg flex items-center justify-center text-indigo-400 border border-indigo-500/20">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                        </div>
                                        <div className="space-y-1">
                                            <div className="font-black text-indigo-400 text-[10px] uppercase tracking-widest">{item.t}</div>
                                            <div className="text-[10px] text-slate-500 font-medium leading-tight">{item.d}</div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                            <div className="pt-4">
                                <Link to="/affiliate" className="px-10 py-5 bg-white text-indigo-950 font-black rounded-2xl hover:bg-slate-100 transition-all text-sm uppercase tracking-widest inline-block shadow-xl">
                                    {t('landing.affiliate.cta')}
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FEATURES GRID */}
            <section id="how-it-works" className="max-w-7xl mx-auto px-4 space-y-20">
                <div className="text-center space-y-4">
                    <h2 className="text-5xl font-black text-slate-900 dark:text-white tracking-tight">{t('landing.defenses.title') || 'Três Camadas de Defesa Total'}</h2>
                    <p className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-medium">{t('landing.defenses.subtitle') || 'Nossa tecnologia analisa o DNA das fraudes.'}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="glass-card group p-12 rounded-[3.5rem] border border-white/50 dark:border-slate-800 shadow-xl space-y-6 hover-lift bg-white/40 dark:bg-slate-900/40">
                        <div className="w-16 h-16 bg-indigo-600 rounded-[1.5rem] flex items-center justify-center text-white shadow-2xl group-hover:rotate-12 transition-transform">
                            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        </div>
                        <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{t('landing.defenses.item1_title') || 'Varredura Multimodal'}</h3>
                        <p className="text-slate-500 dark:text-slate-400 font-bold leading-relaxed">{t('landing.defenses.item1_desc') || 'Detectamos links maliciosos camuflados e sites falsos.'}</p>
                    </div>

                    <div className="glass-card group p-12 rounded-[3.5rem] border border-white/50 dark:border-slate-800 shadow-xl space-y-6 hover-lift bg-white/40 dark:bg-slate-900/40">
                        <div className="w-16 h-16 bg-blue-600 rounded-[1.5rem] flex items-center justify-center text-white shadow-2xl group-hover:rotate-12 transition-transform">
                            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                        </div>
                        <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{t('landing.defenses.item2_title') || 'IA Auditiva'}</h3>
                        <p className="text-slate-500 dark:text-slate-400 font-bold leading-relaxed">{t('landing.defenses.item2_desc') || 'Nossa IA transcreve áudios e detecta técnicas de manipulação.'}</p>
                    </div>

                    <div className="glass-card group p-12 rounded-[3.5rem] border border-white/50 dark:border-slate-800 shadow-xl space-y-6 hover-lift bg-white/40 dark:bg-slate-900/40">
                        <div className="w-16 h-16 bg-purple-600 rounded-[1.5rem] flex items-center justify-center text-white shadow-2xl group-hover:rotate-12 transition-transform">
                            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                        </div>
                        <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{t('landing.defenses.item3_title') || 'Audit de Loja'}</h3>
                        <p className="text-slate-500 dark:text-slate-400 font-bold leading-relaxed">{t('landing.defenses.item3_desc') || 'Verificamos sites de e-commerce e CNPJs antes de você comprar.'}</p>
                    </div>
                </div>
            </section>

            {/* TARGET AUDIENCE - WHO IS IT FOR? */}
            <section className="max-w-7xl mx-auto px-4 space-y-20">
                <div className="text-center space-y-4">
                    <h2 className="text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">{t('landing.audience.title') || 'Segurança para todos'}</h2>
                    <p className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-medium">{t('landing.audience.subtitle') || 'O ShieldCheck AI se adapta à sua rotina.'}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {[
                        { title: t('landing.audience.item1_badge') || 'Para Você', audience: t('landing.audience.item1_title') || 'Usuários comuns', desc: t('landing.audience.item1_desc') || 'Evite golpes de PIX e boletos no dia a dia.', path: '/analyze' },
                        { title: t('landing.audience.item2_badge') || 'Para a Família', audience: t('landing.audience.item2_title') || 'Idosos e Filhos', desc: t('landing.audience.item2_desc') || 'Proteja quem você ama.', path: '/family-guard' },
                        { title: t('landing.audience.item3_badge') || 'Para Shops', audience: t('landing.audience.item3_title') || 'Consumidores Online', desc: t('landing.audience.item3_desc') || 'Validamos se a promoção é real.', path: '/store-checker' },
                        { title: t('landing.audience.item4_badge') || 'Para Empresas', audience: t('landing.audience.item4_title') || 'Negócios e Devs', desc: t('landing.audience.item4_desc') || 'Integre nossa IA via API.', path: '/b2b-portal' }
                    ].map((item, i) => (
                        <div key={i} className="group glass-card p-10 rounded-[3.5rem] border border-slate-200 dark:border-slate-800 shadow-xl hover:bg-white dark:hover:bg-slate-900 transition-all duration-500">
                            <div className="text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-4">{item.title}</div>
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4">{item.audience}</h3>
                            <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-8">{item.desc}</p>
                            <Link to={item.path} className="inline-flex items-center gap-2 text-slate-900 dark:text-white font-black text-xs uppercase tracking-widest group-hover:gap-4 transition-all">
                                {t('common.know_more') || 'Saber mais'} <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                            </Link>
                        </div>
                    ))}
                </div>
            </section>


            {/* PRICING INTEGRATED SECTION */}
            <section id="planos" className="max-w-6xl mx-auto px-4 space-y-16">
                <div className="text-center space-y-4">
                    <div className="inline-flex gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-400 rounded-full text-xs font-black uppercase tracking-widest">Pricing</div>
                    <h2 className="text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">{t('plans.title')} <span className="text-premium-gradient">{t('plans.title_highlight')}</span></h2>

                    <div className="flex items-center justify-center pt-8">
                        <div className="bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl flex items-center gap-1 border border-slate-200 dark:border-slate-700">
                            <button
                                onClick={() => setBillingCycle('monthly')}
                                className={`px-8 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${billingCycle === 'monthly' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-md' : 'text-slate-500'}`}
                            >
                                {t('plans.monthly')}
                            </button>
                            <button
                                onClick={() => setBillingCycle('yearly')}
                                className={`px-8 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all relative ${billingCycle === 'yearly' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-md' : 'text-slate-500'}`}
                            >
                                {t('plans.annual')}
                                <span className="absolute -top-3 -right-2 bg-emerald-500 text-white text-[8px] px-2 py-0.5 rounded-full">{t('plans.save_badge')}</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 items-stretch">
                    {/* FREE PLAN */}
                    <div className="glass-card relative flex flex-col p-8 rounded-[2.5rem] border border-white dark:border-slate-800 shadow-xl transition-all duration-500 hover-lift h-full">
                        <div className="space-y-6 flex-grow relative z-10">
                            <div className="space-y-2 text-center">
                                <div className="flex flex-col items-center gap-2">
                                    <h3 className="text-lg font-display font-black text-slate-900 dark:text-white uppercase tracking-tight">{t('plans.names.free')}</h3>
                                </div>
                                <div className="flex items-baseline justify-center gap-1">
                                    <span className="text-3xl font-display font-black text-slate-900 dark:text-white">R$ 0</span>
                                    <span className="text-slate-400 font-bold text-xs tracking-tighter">/{t('plans.billing.always')}</span>
                                </div>
                                <p className="text-slate-500 dark:text-slate-400 text-[13px] font-medium leading-relaxed min-h-[40px] px-2">{t('plans.features.scans_3')}</p>
                            </div>

                            <div className="w-full h-px bg-slate-100 dark:bg-white/5" />

                            <ul className="space-y-3">
                                <li className="flex items-start gap-3 group">
                                    <div className="mt-0.5 w-4 h-4 rounded-md flex items-center justify-center flex-shrink-0 bg-emerald-500 text-white">
                                        <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <span className="text-[13px] font-medium text-slate-700 dark:text-slate-200">{t('plans.features.scans_3')}</span>
                                </li>
                                <li className="flex items-start gap-3 group">
                                    <div className="mt-0.5 w-4 h-4 rounded-md flex items-center justify-center flex-shrink-0 bg-emerald-500 text-white">
                                        <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <span className="text-[13px] font-medium text-slate-700 dark:text-slate-200">{t('plans.features.basic_links')}</span>
                                </li>
                            </ul>
                        </div>
                        <Link to={`/register?plan=free&cycle=${billingCycle}`} className="mt-8 w-full py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 dark:hover:bg-slate-700 text-center">{t('plans.buttons.select')}</Link>
                    </div>

                    {/* SOLO BOT */}
                    <div className="glass-card relative flex flex-col p-8 rounded-[2.5rem] border border-emerald-500 shadow-xl transition-all duration-500 hover-lift h-full">
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-emerald-500 text-white px-6 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl z-20 whitespace-nowrap">{t('plans.badges.free_trial')}</div>

                        <div className="space-y-6 flex-grow relative z-10">
                            <div className="space-y-2 text-center">
                                <div className="flex flex-col items-center gap-2">
                                    <h3 className="text-lg font-display font-black text-slate-900 dark:text-white uppercase tracking-tight">{t('plans.names.solo')}</h3>
                                </div>
                                <div className="flex items-baseline justify-center gap-1">
                                    <span className="text-3xl font-display font-black text-slate-900 dark:text-white">
                                        {billingCycle === 'monthly' ? 'R$ 12,99' : 'R$ 119,90'}
                                    </span>
                                    <span className="text-slate-400 font-bold text-xs tracking-tighter">/{billingCycle === 'monthly' ? t('plans.billing.monthly') : t('plans.billing.yearly')}</span>
                                </div>
                                <p className="text-slate-500 dark:text-slate-400 text-[13px] font-medium leading-relaxed min-h-[40px] px-2">{t('plans.features.wa_premium')}</p>
                            </div>

                            <div className="w-full h-px bg-slate-100 dark:bg-white/5" />

                            <ul className="space-y-3">
                                {[t('plans.features.wa_premium'), t('plans.features.audio_transcribe'), t('plans.features.ai_persuasion')].map((feat, i) => (
                                    <li key={i} className="flex items-start gap-3 group">
                                        <div className="mt-0.5 w-4 h-4 rounded-md flex items-center justify-center flex-shrink-0 bg-emerald-500 text-white">
                                            <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <span className="text-[13px] font-medium text-slate-700 dark:text-slate-200">{feat}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <Link to={`/register?plan=solo_bot&cycle=${billingCycle}`} className="mt-8 w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:opacity-90 text-center">{t('plans.buttons.select')}</Link>
                    </div>

                    {/* PREMIUM FULL */}
                    <div className="glass-card relative flex flex-col p-8 rounded-[2.5rem] border border-indigo-500 dark:border-indigo-400 shadow-xl transition-all duration-500 hover-lift h-full bg-white/50 dark:bg-slate-900/50">
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-6 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl z-20 whitespace-nowrap">{t('plans.badges.full_shield')}</div>

                        <div className="space-y-6 flex-grow relative z-10">
                            <div className="space-y-2 text-center">
                                <div className="flex flex-col items-center gap-2">
                                    <h3 className="text-lg font-display font-black text-slate-900 dark:text-white uppercase tracking-tight">{t('plans.names.premium')}</h3>
                                </div>
                                <div className="flex items-baseline justify-center gap-1">
                                    <span className="text-3xl font-display font-black text-slate-900 dark:text-white">
                                        {billingCycle === 'monthly' ? 'R$ 19,90' : 'R$ 149,90'}
                                    </span>
                                    <span className="text-slate-400 font-bold text-xs tracking-tighter">/{billingCycle === 'monthly' ? t('plans.billing.monthly') : t('plans.billing.yearly')}</span>
                                </div>
                                <p className="text-slate-500 dark:text-slate-400 text-[13px] font-medium leading-relaxed min-h-[40px] px-2">{t('plans.features.wa_full')}</p>
                            </div>

                            <div className="w-full h-px bg-slate-100 dark:bg-white/5" />

                            <ul className="space-y-3">
                                {[t('plans.features.wa_full'), t('plans.features.deepfake_detect'), t('plans.features.brand_protection')].map((feat, i) => (
                                    <li key={i} className="flex items-start gap-3 group">
                                        <div className="mt-0.5 w-4 h-4 rounded-md flex items-center justify-center flex-shrink-0 bg-indigo-600 text-white">
                                            <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <span className="text-[13px] font-medium text-slate-700 dark:text-slate-200">{feat}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <Link to={`/register?plan=premium&cycle=${billingCycle}`} className="mt-8 w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 hover:scale-[1.02] text-center shadow-xl shadow-indigo-100 dark:shadow-none">{t('plans.buttons.upgrade')}</Link>
                    </div>

                    {/* CORPORATE */}
                    <div className="glass-card relative flex flex-col p-8 rounded-[2.5rem] border border-white dark:border-slate-800 shadow-xl transition-all duration-500 hover-lift h-full">
                        <div className="space-y-6 flex-grow relative z-10">
                            <div className="space-y-2 text-center">
                                <div className="flex flex-col items-center gap-2">
                                    <h3 className="text-lg font-display font-black text-slate-900 dark:text-white uppercase tracking-tight">{t('plans.names.business')}</h3>
                                </div>
                                <div className="flex items-baseline justify-center gap-1">
                                    <span className="text-3xl font-display font-black text-slate-900 dark:text-white">
                                        {billingCycle === 'monthly' ? 'R$ 299,00' : 'R$ 2.990,00'}
                                    </span>
                                    <span className="text-slate-400 font-bold text-xs tracking-tighter">/{billingCycle === 'monthly' ? t('plans.billing.monthly') : t('plans.billing.yearly')}</span>
                                </div>
                                <p className="text-slate-500 dark:text-slate-400 text-[13px] font-medium leading-relaxed min-h-[40px] px-2">{t('plans.features.brand_protection')}</p>
                            </div>

                            <div className="w-full h-px bg-slate-100 dark:bg-white/5" />

                            <ul className="space-y-3">
                                {[t('plans.features.brand_protection'), t('plans.features.api_limited'), t('plans.features.wa_5')].map((feat, i) => (
                                    <li key={i} className="flex items-start gap-3 group">
                                        <div className="mt-0.5 w-4 h-4 rounded-md flex items-center justify-center flex-shrink-0 bg-slate-900 dark:bg-white text-white dark:text-slate-900">
                                            <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <span className="text-[13px] font-medium text-slate-700 dark:text-slate-200">{feat}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <Link to={`/register?plan=business&cycle=${billingCycle}`} className="mt-8 w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:opacity-90 text-center">{t('plans.buttons.upgrade')}</Link>
                    </div>

                    {/* ENTERPRISE */}
                    <div className="glass-card relative flex flex-col p-8 rounded-[2.5rem] border border-white dark:border-slate-800 shadow-xl transition-all duration-500 hover-lift h-full">
                        <div className="space-y-6 flex-grow relative z-10">
                            <div className="space-y-2 text-center">
                                <div className="flex flex-col items-center gap-2">
                                    <h3 className="text-lg font-display font-black text-slate-900 dark:text-white uppercase tracking-tight">{t('plans.names.enterprise')}</h3>
                                </div>
                                <div className="flex items-baseline justify-center gap-1">
                                    <span className="text-3xl font-display font-black text-slate-900 dark:text-white">
                                        {billingCycle === 'monthly' ? 'R$ 599,00' : 'R$ 5.990,00'}
                                    </span>
                                    <span className="text-slate-400 font-bold text-xs tracking-tighter">/{billingCycle === 'monthly' ? t('plans.billing.monthly') : t('plans.billing.yearly')}</span>
                                </div>
                                <p className="text-slate-500 dark:text-slate-400 text-[13px] font-medium leading-relaxed min-h-[40px] px-2">{t('plans.features.custom_brand')}</p>
                            </div>

                            <div className="w-full h-px bg-slate-100 dark:bg-white/5" />

                            <ul className="space-y-3">
                                {[t('plans.features.unlimited_takedowns'), t('plans.features.api_dev'), t('plans.features.unlimited_operators')].map((feat, i) => (
                                    <li key={i} className="flex items-start gap-3 group">
                                        <div className="mt-0.5 w-4 h-4 rounded-md flex items-center justify-center flex-shrink-0 bg-slate-100 dark:bg-slate-800 text-slate-400">
                                            <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <span className="text-[13px] font-medium text-slate-700 dark:text-slate-200">{feat}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <Link to={`/register?plan=pro&cycle=${billingCycle}`} className="mt-8 w-full py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 dark:hover:bg-slate-700 text-center">{t('plans.buttons.upgrade')}</Link>
                    </div>
                </div>

            </section>
        </div>
    );
}

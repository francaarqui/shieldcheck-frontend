import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { API_URL } from '../api/config';
import { useTranslation } from 'react-i18next';

export default function Empresas() {
    const { t } = useTranslation();

    const sectors = [
        {
            icon: '🏠',
            title: t('b2b.sectors.real_estate.title'),
            pain: t('b2b.sectors.real_estate.pain'),
            solution: t('b2b.sectors.real_estate.solution'),
        },
        {
            icon: '🛒',
            title: t('b2b.sectors.ecommerce.title'),
            pain: t('b2b.sectors.ecommerce.pain'),
            solution: t('b2b.sectors.ecommerce.solution'),
        },
        {
            icon: '⚖️',
            title: t('b2b.sectors.legal.title'),
            pain: t('b2b.sectors.legal.pain'),
            solution: t('b2b.sectors.legal.solution'),
        },
        {
            icon: '🏥',
            title: t('b2b.sectors.health.title'),
            pain: t('b2b.sectors.health.pain'),
            solution: t('b2b.sectors.health.solution'),
        },
    ];

    const [billing, setBilling] = useState('annual');
    const [loadingPlan, setLoadingPlan] = useState(null);
    const [form, setForm] = useState({ name: '', company: '', email: '', phone: '', business_type: '', message: '' });
    const [status, setStatus] = useState('idle'); // idle | loading | success | error

    const handleSubscribe = async (planType) => {
        const planId = `${planType}_${billing === 'annual' ? 'yearly' : 'monthly'}`;
        setLoadingPlan(planId);

        try {
            const res = await fetch(`${API_URL}/api/checkout/create-session`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ planId, isB2B: true }),
            });
            const data = await res.json();
            if (data.url) {
                window.location.href = data.url;
            } else {
                alert(t('common.error_occurred'));
                setLoadingPlan(null);
            }
        } catch (error) {
            console.error('Erro no checkout B2B:', error);
            alert(t('common.error_occurred'));
            setLoadingPlan(null);
        }
    };

    const plans = [
        {
            id: 'starter',
            name: t('plans.names.starter'),
            subtitle: t('plans.subtitles.starter'),
            monthly: t('plans.prices_b2b.starter_monthly'),
            annual: t('plans.prices_b2b.starter_annual'),
            saving: t('plans.savings.starter'),
            features: [
                t('plans.features.users_5'),
                t('plans.features.scans_500'),
                t('plans.features.api_basic'),
                t('plans.features.monthly_reports'),
                t('plans.features.support_email'),
            ],
            cta: t('plans.buttons.select'),
            action: () => handleSubscribe('starter'),
            highlight: false,
        },
        {
            id: 'pro',
            name: t('plans.names.pro'),
            subtitle: t('plans.subtitles.pro'),
            monthly: t('plans.prices_b2b.pro_monthly'),
            annual: t('plans.prices_b2b.pro_annual'),
            saving: t('plans.savings.pro'),
            features: [
                t('plans.features.users_unlimited'),
                t('plans.features.scans_unlimited'),
                t('plans.features.api_webhook'),
                t('plans.features.custom_dashboard'),
                t('plans.features.support_priority'),
                t('plans.features.sla_guaranteed'),
            ],
            cta: t('plans.buttons.select'),
            action: () => handleSubscribe('pro'),
            highlight: true,
        },
        {
            id: 'enterprise',
            name: t('plans.names.enterprise'),
            subtitle: t('plans.subtitles.enterprise'),
            monthly: t('plans.prices.on_request'),
            annual: null,
            saving: t('plans.savings.custom'),
            features: [
                t('plans.features.whitelabel'),
                t('plans.features.dedicated_infra'),
                t('plans.features.staff_training'),
                t('plans.features.custom_integration'),
                t('plans.features.custom_contract'),
            ],
            cta: t('plans.buttons.contact'),
            action: () => {
                document.getElementById('contato').scrollIntoView({ behavior: 'smooth' });
            },
            highlight: false,
        },
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('loading');
        try {
            const res = await fetch(`${API_URL}/api/leads/b2b`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });
            if (res.ok) {
                setStatus('success');
                setForm({ name: '', company: '', email: '', phone: '', business_type: '', message: '' });
            } else {
                setStatus('error');
            }
        } catch {
            setStatus('error');
        }
    };

    return (
        <div className="w-full animate-fadeIn">

            {/* Hero */}
            <section className="text-center space-y-8 py-24 px-4 relative overflow-hidden bg-gradient-to-b from-slate-900 to-slate-800">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/40 via-slate-900/0 to-slate-900/0"></div>
                <div className="relative z-10 max-w-5xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 text-indigo-300 rounded-full text-xs font-black uppercase tracking-widest border border-indigo-500/20 mb-6">
                        🏢 {t('b2b.hero.badge')}
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-tight">
                        {t('b2b.hero.title_start')}{' '}
                        <span className="text-red-400">{t('b2b.hero.title_highlight')}</span>{' '}
                        {t('b2b.hero.title_end')}
                    </h1>
                    <p className="text-xl text-slate-300 max-w-3xl mx-auto font-medium leading-relaxed mt-6">
                        {t('b2b.hero.desc')}
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
                        <button
                            onClick={() => document.getElementById('contato').scrollIntoView({ behavior: 'smooth' })}
                            className="px-10 py-5 bg-indigo-600 text-white font-black rounded-3xl hover:bg-indigo-500 transition-all shadow-2xl shadow-indigo-500/30 text-xl"
                        >
                            {t('b2b.hero.cta_primary')}
                        </button>
                        <button
                            onClick={() => document.getElementById('planos').scrollIntoView({ behavior: 'smooth' })}
                            className="px-10 py-5 bg-white/10 border border-white/20 text-white font-black rounded-3xl hover:bg-white/20 transition-all text-xl"
                        >
                            {t('b2b.hero.cta_secondary')}
                        </button>
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="py-16 bg-slate-900">
                <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    {[
                        { value: t('b2b.stats.value1'), label: t('b2b.stats.label1') },
                        { value: t('b2b.stats.value2'), label: t('b2b.stats.label2') },
                        { value: t('b2b.stats.value3'), label: t('b2b.stats.label3') },
                    ].map((s, i) => (
                        <div key={i} className="space-y-2">
                            <div className="text-5xl font-black text-indigo-400">{s.value}</div>
                            <div className="text-slate-400 font-medium">{s.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Sectors */}
            <section className="py-24 px-4 bg-white dark:bg-slate-950">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
                            {t('b2b.sectors.title')}
                        </h2>
                        <p className="text-slate-500 mt-4 text-lg">{t('b2b.sectors.subtitle')}</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {sectors.map((s, i) => (
                            <div key={i} className="p-8 rounded-[2rem] border-2 border-slate-100 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-800 transition-all bg-white dark:bg-slate-900 shadow-sm hover:shadow-xl group">
                                <div className="text-4xl mb-4">{s.icon}</div>
                                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">{s.title}</h3>
                                <div className="space-y-3">
                                    <div className="flex gap-3 items-start">
                                        <span className="text-red-500 font-black mt-0.5">⚠</span>
                                        <p className="text-slate-500 dark:text-slate-400">{s.pain}</p>
                                    </div>
                                    <div className="flex gap-3 items-start">
                                        <span className="text-green-500 font-black mt-0.5">✓</span>
                                        <p className="text-slate-700 dark:text-slate-300 font-semibold">{s.solution}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Plans */}
            <section id="planos" className="py-24 px-4 bg-slate-50 dark:bg-slate-900">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-4">
                            {t('plans.title')}
                        </h2>
                        {/* Toggle */}
                        <div className="inline-flex items-center gap-1 bg-slate-200 dark:bg-slate-800 p-1 rounded-2xl">
                            <button
                                onClick={() => setBilling('monthly')}
                                className={`px-6 py-2 rounded-xl font-black text-sm transition-all ${billing === 'monthly' ? 'bg-white dark:bg-slate-700 shadow text-slate-900 dark:text-white' : 'text-slate-500'}`}
                            >
                                {t('plans.monthly')}
                            </button>
                            <button
                                onClick={() => setBilling('annual')}
                                className={`px-6 py-2 rounded-xl font-black text-sm transition-all ${billing === 'annual' ? 'bg-white dark:bg-slate-700 shadow text-slate-900 dark:text-white' : 'text-slate-500'}`}
                            >
                                {t('plans.annual')} <span className="text-green-500 ml-1">{t('plans.save_badge')}</span>
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {plans.map((plan, i) => {
                            const isPlanLoading = loadingPlan === `${plan.id}_${billing === 'annual' ? 'yearly' : 'monthly'}`;
                            return (
                                <div key={i} className={`p-8 rounded-[2.5rem] flex flex-col gap-6 transition-all ${plan.highlight
                                    ? 'bg-slate-900 dark:bg-slate-950 border-4 border-indigo-500 shadow-2xl shadow-indigo-500/20 scale-105 relative'
                                    : 'bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 shadow-xl relative'
                                    }`}>
                                    {plan.highlight && (
                                        <div className="absolute top-0 right-8 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-b-xl">
                                            {t('plans.most_popular')}
                                        </div>
                                    )}
                                    <div>
                                        <p className={`text-xs font-black uppercase tracking-widest mb-1 ${plan.highlight ? 'text-indigo-400' : 'text-slate-400'}`}>{plan.subtitle}</p>
                                        <h3 className={`text-3xl font-black ${plan.highlight ? 'text-white' : 'text-slate-900 dark:text-white'}`}>{plan.name}</h3>
                                    </div>
                                    <div>
                                        <div className={`text-4xl font-black ${plan.highlight ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                                            {plan.annual ? (billing === 'annual' ? plan.annual : plan.monthly) : plan.monthly}
                                        </div>
                                        {plan.annual && (
                                            <div className="text-xs font-bold text-green-400 mt-1">
                                                {billing === 'annual' ? plan.saving : `/${t('plans.monthly').toLowerCase()}`}
                                            </div>
                                        )}
                                    </div>
                                    <ul className="space-y-3 flex-1">
                                        {plan.features.map((f, j) => (
                                            <li key={j} className={`flex items-center gap-3 font-semibold ${plan.highlight ? 'text-indigo-100' : 'text-slate-600 dark:text-slate-300'}`}>
                                                <svg className={`w-5 h-5 flex-shrink-0 ${plan.highlight ? 'text-indigo-400' : 'text-indigo-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                </svg>
                                                {f}
                                            </li>
                                        ))}
                                    </ul>
                                    <button
                                        onClick={plan.action}
                                        disabled={isPlanLoading}
                                        className={`block w-full text-center py-4 rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-2 ${plan.highlight
                                            ? 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-xl shadow-indigo-500/20 border-b-4 border-indigo-700'
                                            : 'border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                                            } ${isPlanLoading ? 'opacity-50 cursor-wait' : ''}`}
                                    >
                                        {isPlanLoading && (
                                            <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                        )}
                                        {plan.cta}
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>


            {/* Pitch Quote */}
            <section className="py-20 px-4 bg-indigo-600">
                <div className="max-w-4xl mx-auto text-center">
                    <blockquote className="text-3xl md:text-4xl font-black text-white leading-tight">
                        "{t('b2b.quote.text')}"
                    </blockquote>
                    <p className="text-indigo-200 mt-6 font-semibold">— {t('b2b.quote.author')}</p>
                </div>
            </section>

            {/* Contact Form */}
            <section id="contato" className="py-24 px-4 bg-white dark:bg-slate-950">
                <div className="max-w-2xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                            {t('b2b.form.title')}
                        </h2>
                        <p className="text-slate-500 mt-3 text-lg">{t('b2b.form.subtitle')}</p>
                    </div>

                    {status === 'success' ? (
                        <div className="text-center p-12 bg-green-50 dark:bg-green-950/30 rounded-[2rem] border-2 border-green-200 dark:border-green-900">
                            <div className="text-6xl mb-4">🎉</div>
                            <h3 className="text-2xl font-black text-green-700 dark:text-green-400">{t('b2b.form.success_title')}</h3>
                            <p className="text-green-600 dark:text-green-500 mt-2">{t('b2b.form.success_desc')}</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-5 bg-slate-50 dark:bg-slate-900 p-8 rounded-[2rem] border-2 border-slate-100 dark:border-slate-800">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-black text-slate-700 dark:text-slate-300 mb-2">{t('b2b.form.name_label')} *</label>
                                    <input
                                        required
                                        value={form.name}
                                        onChange={e => setForm({ ...form, name: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:border-indigo-500 outline-none transition-all"
                                        placeholder={t('b2b.form.name_placeholder')}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-black text-slate-700 dark:text-slate-300 mb-2">{t('b2b.form.company_label')} *</label>
                                    <input
                                        required
                                        value={form.company}
                                        onChange={e => setForm({ ...form, company: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:border-indigo-500 outline-none transition-all"
                                        placeholder={t('b2b.form.company_placeholder')}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-black text-slate-700 dark:text-slate-300 mb-2">{t('b2b.form.email_label')} *</label>
                                    <input
                                        required
                                        type="email"
                                        value={form.email}
                                        onChange={e => setForm({ ...form, email: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:border-indigo-500 outline-none transition-all"
                                        placeholder={t('b2b.form.email_placeholder')}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-black text-slate-700 dark:text-slate-300 mb-2">{t('b2b.form.phone_label')}</label>
                                    <input
                                        value={form.phone}
                                        onChange={e => setForm({ ...form, phone: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:border-indigo-500 outline-none transition-all"
                                        placeholder={t('b2b.form.phone_placeholder')}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-black text-slate-700 dark:text-slate-300 mb-2">{t('b2b.form.business_type_label')}</label>
                                <select
                                    value={form.business_type}
                                    onChange={e => setForm({ ...form, business_type: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:border-indigo-500 outline-none transition-all"
                                >
                                    <option value="">{t('common.select')}...</option>
                                    <option>{t('b2b.sectors.real_estate.title')}</option>
                                    <option>{t('b2b.sectors.ecommerce.title')}</option>
                                    <option>{t('b2b.sectors.legal.title')}</option>
                                    <option>{t('b2b.sectors.health.title')}</option>
                                    <option>Banco / Fintech</option>
                                    <option>{t('common.other')}</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-black text-slate-700 dark:text-slate-300 mb-2">{t('b2b.form.message_label')}</label>
                                <textarea
                                    rows={4}
                                    value={form.message}
                                    onChange={e => setForm({ ...form, message: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:border-indigo-500 outline-none transition-all resize-none"
                                    placeholder={t('b2b.form.message_placeholder')}
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={status === 'loading'}
                                className="w-full py-5 bg-slate-900 dark:bg-indigo-600 text-white font-black rounded-2xl hover:bg-black dark:hover:bg-indigo-500 transition-all text-lg shadow-xl disabled:opacity-50"
                            >
                                {status === 'loading' ? t('common.sending') : `📩 ${t('b2b.form.submit')}`}
                            </button>
                            {status === 'error' && (
                                <p className="text-red-500 text-center font-semibold">{t('common.error_occurred')}</p>
                            )}
                        </form>
                    )}
                </div>
            </section>

            {/* Footer CTA */}
            <section className="py-16 px-4 text-center bg-slate-50 dark:bg-slate-900">
                <p className="text-slate-500 mb-4">{t('b2b.footer_cta.text') || 'Prefere testar antes de contratar?'}</p>
                <Link to="/register" className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-500 transition-all">
                    {t('common.create_free_account')} →
                </Link>
            </section>
        </div>
    );
}

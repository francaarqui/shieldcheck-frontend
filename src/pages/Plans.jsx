import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { API_ENDPOINTS } from '../api/config';
import { useTranslation } from 'react-i18next';

export default function Plans() {
    const { t } = useTranslation();
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' or 'yearly'
    const [loadingPlan, setLoadingPlan] = useState(null);
    const hasTriggeredAuto = React.useRef(false);

    useEffect(() => {
        const autoPlan = searchParams.get('auto');
        const cycle = searchParams.get('cycle');

        if (autoPlan && user && !loadingPlan && !hasTriggeredAuto.current) {
            // Verificamos se já tentamos esse auto-check nesta sessão para evitar loop infinito de reload
            const sessionKey = `wa_auto_checkout_${autoPlan}`;
            if (sessionStorage.getItem(sessionKey)) {
                console.log(`⏳ [AUTORUN] Already attempted auto-checkout for ${autoPlan} in this session. Skipping to avoid loop.`);
                return;
            }

            console.log(`🚀 [AUTORUN] Direct checkout triggered for: ${autoPlan} (${cycle})`);
            hasTriggeredAuto.current = true;
            sessionStorage.setItem(sessionKey, 'true'); // Marca na sessão

            if (cycle) setBillingCycle(cycle);

            // Limpa a URL imediatamente (sem esperar o navigate do React)
            const newUrl = window.location.pathname;
            window.history.replaceState({}, '', newUrl);

            setTimeout(() => {
                handleSubscribe(autoPlan, cycle || 'monthly');
            }, 500);
        }
    }, [user, searchParams, loadingPlan]);

    const handleSubscribe = async (planName, overrideCycle = null) => {
        const actualCycle = overrideCycle || billingCycle;
        const planId = `${planName}_${actualCycle}`;
        console.log(`[SUBSCRIPTION DEBUG] Initiating subscribe for: ${planId} (${planName})`);
        setLoadingPlan(planName);

        try {
            const token = user?.token;
            const waNumber = searchParams.get('wa');

            const response = await fetch(API_ENDPOINTS.CREATE_CHECKOUT_SESSION, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    planId,
                    planName: planName.toUpperCase(), // Passando o nome do plano para o backend
                    waNumber // Enviando o número do WhatsApp capturado da URL
                })
            });

            const data = await response.json();

            if (data.url) {
                console.log(`🚀 [CHECKOUT SUCCESS] Redirecting to: ${data.url}`);
                window.location.href = data.url;
            } else {
                console.error(`❌ [CHECKOUT ERROR] No URL returned:`, data);
                alert(data.error || t('common.error_occurred'));
                setLoadingPlan(null);
            }
        } catch (error) {
            console.error('❌ [CHECKOUT EXCEPTION]:', error);
            alert(t('common.connection_error'));
            setLoadingPlan(null);
        }
    };

    const plans = [
        {
            id: 'free',
            name: t('plans.names.free'),
            price: 'R$ 0',
            period: `/${t('plans.monthly').toLowerCase()}`,
            description: t('plans.features.scans_3'),
            features: [
                { text: t('plans.features.scans_3'), active: true },
                { text: t('plans.features.basic_links'), active: true },
                { text: t('plans.features.phishing_detect'), active: true },
                { text: t('plans.features.academy_demo'), active: true },
                { text: t('plans.features.wa_free'), active: true },
                { text: t('plans.features.deepfake_detect'), active: false },
                { text: t('plans.features.ocr_basic'), active: false }
            ],
            buttonText: t('plans.buttons.select'),
            buttonAction: () => navigate('/analyze'),
            premium: false,
            highlight: false
        },
        {
            id: 'solo_bot',
            name: t('plans.names.solo'),
            price: billingCycle === 'monthly' ? 'R$ 12,99' : 'R$ 119,90',
            period: billingCycle === 'monthly' ? `/${t('plans.monthly').toLowerCase()}` : `/${t('plans.annual').toLowerCase()}`,
            description: t('plans.features.wa_premium'),
            features: [
                { text: t('plans.features.scans_7'), active: true },
                { text: t('plans.features.wa_premium'), active: true },
                { text: t('plans.features.audio_transcribe'), active: true },
                { text: t('plans.features.ai_persuasion'), active: true },
                { text: t('plans.features.training_scenarios'), active: true },
                { text: t('plans.features.fair_use'), active: true },
                { text: t('plans.features.ocr_basic'), active: false }
            ],
            buttonText: t('plans.buttons.upgrade'),
            buttonAction: () => handleSubscribe('solo_bot'),
            premium: true,
            highlight: false,
            savings: billingCycle === 'yearly' ? 'Save 23%' : null
        },
        {
            id: 'premium',
            name: t('plans.names.premium'),
            price: billingCycle === 'monthly' ? 'R$ 19,90' : 'R$ 149,90',
            period: billingCycle === 'monthly' ? `/${t('plans.monthly').toLowerCase()}` : `/${t('plans.annual').toLowerCase()}`,
            description: t('plans.features.wa_full'),
            features: [
                { text: t('plans.features.scans_unlimited'), active: true },
                { text: t('plans.features.wa_full'), active: true },
                { text: t('plans.features.deepfake_detect'), active: true },
                { text: t('plans.features.ocr_basic'), active: true },
                { text: t('plans.features.brand_protection'), active: true },
                { text: t('landing.browser_guard.title'), active: true },
                { text: t('plans.features.academy_expert'), active: true },
                { text: t('plans.features.brand_protection'), active: true }
            ],
            buttonText: t('plans.buttons.upgrade'),
            buttonAction: () => handleSubscribe('premium'),
            premium: true,
            highlight: true,
            savings: billingCycle === 'yearly' ? 'Save 37%' : null
        },
        {
            id: 'business',
            name: t('plans.names.business'),
            price: billingCycle === 'monthly' ? 'R$ 299,00' : 'R$ 2.990,00',
            period: billingCycle === 'monthly' ? `/${t('plans.monthly').toLowerCase()}` : `/${t('plans.annual').toLowerCase()}`,
            description: t('plans.features.brand_protection'),
            features: [
                { text: t('plans.features.brand_protection'), active: true },
                { text: t('plans.features.domain_monitor'), active: true },
                { text: t('plans.features.auto_takedowns'), active: true },
                { text: t('plans.features.api_limited'), active: true },
                { text: t('plans.features.wa_5'), active: true },
                { text: t('plans.features.support_24h'), active: true },
                { text: 'SLA Guaranteed 99.9%', active: true }
            ],
            buttonText: t('plans.buttons.upgrade'),
            buttonAction: () => handleSubscribe('business'),
            premium: true,
            highlight: false,
            savings: billingCycle === 'yearly' ? 'Save 17%' : null
        },
        {
            id: 'pro',
            name: t('plans.names.enterprise'),
            price: billingCycle === 'monthly' ? 'R$ 599,00' : 'R$ 5.990,00',
            period: billingCycle === 'monthly' ? `/${t('plans.monthly').toLowerCase()}` : `/${t('plans.annual').toLowerCase()}`,
            description: t('plans.features.custom_brand'),
            features: [
                { text: t('plans.features.custom_brand'), active: true },
                { text: t('plans.features.unlimited_takedowns'), active: true },
                { text: t('plans.features.api_dev'), active: true },
                { text: t('plans.features.custom_training'), active: true },
                { text: t('plans.features.unlimited_operators'), active: true },
                { text: t('plans.features.low_latency'), active: true },
                { text: t('plans.features.crm_integration'), active: true },
                { text: t('plans.features.risk_consultancy'), active: true }
            ],
            buttonText: t('plans.buttons.upgrade'),
            buttonAction: () => handleSubscribe('pro'),
            premium: true,
            highlight: false,
            savings: billingCycle === 'yearly' ? 'Save 17%' : null
        }
    ];

    return (
        <div className="animate-slide-up max-w-7xl mx-auto space-y-16 pb-20 px-2 lg:px-4">
            {/* Upper Header */}
            <div className="text-center space-y-4 max-w-3xl mx-auto pt-8">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 text-xs font-black uppercase tracking-widest shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
                    {t('landing.hero.badge')}
                </div>
                <h2 className="text-4xl md:text-5xl font-display font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                    {t('plans.title')} <span className="text-premium-gradient">{t('plans.title_highlight')}</span>
                </h2>

                {/* Billing Selector */}
                <div className="flex items-center justify-center mt-8">
                    <div className="bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl flex items-center gap-1 border border-slate-200 dark:border-slate-700 shadow-inner">
                        <button
                            onClick={() => setBillingCycle('monthly')}
                            className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all
                                ${billingCycle === 'monthly'
                                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-md'
                                    : 'text-slate-500 hover:text-slate-700'
                                }
                            `}
                        >
                            {t('plans.monthly')}
                        </button>
                        <button
                            onClick={() => setBillingCycle('yearly')}
                            className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all relative
                                ${billingCycle === 'yearly'
                                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-md'
                                    : 'text-slate-500 hover:text-slate-700'
                                }
                            `}
                        >
                            {t('plans.annual')}
                            <span className="absolute -top-3 -right-2 bg-emerald-500 text-white text-[8px] px-2 py-0.5 rounded-full animate-bounce">
                                {t('plans.save_badge')}
                            </span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Plans Grid - Dynamic Grid columns to support 5 cards better */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 items-stretch">
                {plans.map((plan, index) => {
                    const isPlanLoading = loadingPlan === `${plan.id}_${billingCycle}`;

                    return (
                        <div
                            key={index}
                            className={`glass-card relative flex flex-col p-8 rounded-[2.5rem] border transition-all duration-500 hover-lift h-full
                                ${plan.highlight
                                    ? 'border-indigo-500 dark:border-indigo-400 shadow-2xl shadow-indigo-100 dark:shadow-none bg-white/50 dark:bg-slate-900/50'
                                    : 'border-white dark:border-slate-800 shadow-xl'
                                }
                            `}
                        >
                            {plan.highlight && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-6 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl z-20 whitespace-nowrap">
                                    {t('plans.most_popular') || 'Mais Popular'}
                                </div>
                            )}

                            <div className="space-y-6 flex-grow relative z-10">
                                <div className="space-y-2 text-center">
                                    <div className="flex flex-col items-center gap-2">
                                        <h3 className="text-lg font-display font-black text-slate-900 dark:text-white uppercase tracking-tight">{plan.name}</h3>
                                        {plan.savings && (
                                            <span className="inline-block bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-[8px] font-black px-2 py-1 rounded-md">
                                                {plan.savings}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-baseline justify-center gap-1">
                                        <span className="text-3xl font-display font-black text-slate-900 dark:text-white">{plan.price}</span>
                                        <span className="text-slate-400 font-bold text-xs tracking-tighter">{plan.period}</span>
                                    </div>
                                    <p className="text-slate-500 dark:text-slate-400 text-[13px] font-medium leading-relaxed min-h-[40px] px-2">{plan.description}</p>
                                </div>

                                <div className="w-full h-px bg-slate-100 dark:bg-white/5" />

                                <ul className="space-y-3">
                                    {plan.features.map((feature, fIndex) => (
                                        <li key={fIndex} className={`flex items-start gap-3 group ${!feature.active ? 'opacity-40' : ''}`}>
                                            <div className={`mt-0.5 w-4 h-4 rounded-md flex items-center justify-center flex-shrink-0 transition-all
                                                ${feature.active
                                                    ? plan.premium ? 'bg-indigo-600 text-white' : 'bg-emerald-500 text-white'
                                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}
                                            `}>
                                                <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                            <span className={`text-[13px] font-medium transition-colors ${feature.active ? 'text-slate-700 dark:text-slate-200' : 'text-slate-400 dark:text-slate-500 line-through'}`}>
                                                {feature.text}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <button
                                onClick={plan.buttonAction}
                                disabled={isPlanLoading}
                                className={`mt-8 w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2
                                    ${plan.highlight
                                        ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100 dark:shadow-none hover:bg-indigo-700 hover:scale-[1.02]'
                                        : plan.premium
                                            ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90'
                                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                                    }
                                    ${isPlanLoading ? 'opacity-70 cursor-wait' : ''}
                                `}
                            >
                                {isPlanLoading && (
                                    <svg className="animate-spin h-3 w-3 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                )}
                                {plan.buttonText}
                            </button>
                        </div>
                    );
                })}
            </div>

            {/* Bottom Proof Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-10 border-t border-slate-100 dark:border-slate-800 max-w-5xl mx-auto">
                {[
                    { title: t('plans.ssl_secure') || 'SSL Seguro', desc: t('plans.ssl_secure_desc') || 'Transações criptografadas military-grade.', icon: 'M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.744c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z' },
                    { title: t('plans.guarantee') || 'Garantia', desc: t('plans.guarantee_desc') || '7 dias para cancelamento com reembolso.', icon: 'M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99' },
                    { title: t('plans.flexible_payment') || 'Pagamento flexível', desc: t('plans.flexible_payment_desc') || 'PIX, Cartão e Boleto via Stripe.', icon: 'M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z' }
                ].map((item, i) => (
                    <div key={i} className="flex flex-col items-center text-center space-y-3">
                        <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-indigo-600">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d={item.icon} /></svg>
                        </div>
                        <h4 className="font-black text-slate-800 dark:text-white uppercase text-xs tracking-widest">{item.title}</h4>
                        <p className="text-xs text-slate-500 font-medium">{item.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { API_URL } from '../api/config';

const sectors = [
    {
        icon: '🏠',
        title: 'Imobiliárias',
        pain: 'Clientes enviam boletos e comprovantes PIX falsos para garantir imóveis.',
        solution: 'Valide comprovantes e boletos antes de assinar o contrato.',
    },
    {
        icon: '🛒',
        title: 'E-commerces',
        pain: 'Fraudes em pagamentos e screenshots falsos de transferências prejudicam o caixa.',
        solution: 'Filtre pedidos suspeitos automaticamente antes de liberar o estoque.',
    },
    {
        icon: '⚖️',
        title: 'Escritórios de Advocacia',
        pain: 'Engenharia social e phishing miram dados confidenciais de clientes.',
        solution: 'Analise links e e-mails suspeitos antes de qualquer clique.',
    },
    {
        icon: '🏥',
        title: 'Clínicas e Saúde',
        pain: 'Golpes de planos de saúde falsos e cobranças indevidas.',
        solution: 'Identifique mensagens fraudulentas que se passam por convênios.',
    },
];

const plans = [
    {
        name: 'Starter',
        subtitle: 'Para pequenas empresas',
        monthly: 'R$ 299',
        annual: 'R$ 2.990',
        saving: 'Economize R$ 598/ano',
        features: [
            'Até 5 usuários',
            '500 análises/mês',
            'API de integração',
            'Relatórios mensais',
            'Suporte por e-mail',
        ],
        cta: 'Contratar Starter',
        highlight: false,
    },
    {
        name: 'Pro',
        subtitle: 'Para empresas em crescimento',
        monthly: 'R$ 599',
        annual: 'R$ 5.990',
        saving: 'Economize R$ 1.198/ano',
        features: [
            'Usuários ilimitados',
            'Análises ilimitadas',
            'API + Webhook',
            'Dashboard personalizado',
            'Suporte prioritário 24/7',
            'SLA garantido',
        ],
        cta: 'Contratar Pro',
        highlight: true,
    },
    {
        name: 'Enterprise',
        subtitle: 'Para grandes operações',
        monthly: 'Sob consulta',
        annual: null,
        saving: 'Personalizado',
        features: [
            'Whitelabel completo',
            'Infraestrutura dedicada',
            'Treinamento da equipe',
            'Integração sob medida',
            'Contrato personalizado',
        ],
        cta: 'Falar com Especialista',
        highlight: false,
    },
];

export default function Empresas() {
    const [billing, setBilling] = useState('annual');
    const [form, setForm] = useState({ name: '', company: '', email: '', phone: '', business_type: '', message: '' });
    const [status, setStatus] = useState('idle'); // idle | loading | success | error

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
                        🏢 Solução para Empresas
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-tight">
                        Quanto custa um{' '}
                        <span className="text-red-400">boleto falso</span>{' '}
                        para o seu negócio?
                    </h1>
                    <p className="text-xl text-slate-300 max-w-3xl mx-auto font-medium leading-relaxed mt-6">
                        O ShieldCheck AI analisa documentos, comprovantes e mensagens em tempo real. Bloqueie fraudes antes que elas custam caro.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
                        <a href="#contato" className="px-10 py-5 bg-indigo-600 text-white font-black rounded-3xl hover:bg-indigo-500 transition-all shadow-2xl shadow-indigo-500/30 text-xl">
                            Falar com um Especialista
                        </a>
                        <a href="#planos" className="px-10 py-5 bg-white/10 border border-white/20 text-white font-black rounded-3xl hover:bg-white/20 transition-all text-xl">
                            Ver Planos Empresariais
                        </a>
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="py-16 bg-slate-900">
                <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    {[
                        { value: 'R$ 10 mil', label: 'Prejuízo médio por golpe empresarial no Brasil' },
                        { value: '99%', label: 'De precisão na detecção de fraudes' },
                        { value: '< 2s', label: 'Para analisar qualquer documento ou mensagem' },
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
                            Quem precisa do ShieldCheck?
                        </h2>
                        <p className="text-slate-500 mt-4 text-lg">Qualquer empresa que lida com pagamentos ou documentos de clientes.</p>
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
                            Planos para Empresas
                        </h2>
                        {/* Toggle */}
                        <div className="inline-flex items-center gap-1 bg-slate-200 dark:bg-slate-800 p-1 rounded-2xl">
                            <button
                                onClick={() => setBilling('monthly')}
                                className={`px-6 py-2 rounded-xl font-black text-sm transition-all ${billing === 'monthly' ? 'bg-white dark:bg-slate-700 shadow text-slate-900 dark:text-white' : 'text-slate-500'}`}
                            >
                                Mensal
                            </button>
                            <button
                                onClick={() => setBilling('annual')}
                                className={`px-6 py-2 rounded-xl font-black text-sm transition-all ${billing === 'annual' ? 'bg-white dark:bg-slate-700 shadow text-slate-900 dark:text-white' : 'text-slate-500'}`}
                            >
                                Anual <span className="text-green-500 ml-1">17% OFF</span>
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {plans.map((plan, i) => (
                            <div key={i} className={`p-8 rounded-[2.5rem] flex flex-col gap-6 transition-all ${plan.highlight
                                ? 'bg-slate-900 dark:bg-slate-950 border-4 border-indigo-500 shadow-2xl shadow-indigo-500/20 scale-105'
                                : 'bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 shadow-xl'
                                }`}>
                                {plan.highlight && (
                                    <div className="absolute top-0 right-8 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-b-xl">
                                        Mais Popular
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
                                            {billing === 'annual' ? plan.saving : '/mês'}
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
                                <a
                                    href="#contato"
                                    className={`block text-center py-4 rounded-2xl font-black text-lg transition-all ${plan.highlight
                                        ? 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-xl shadow-indigo-500/20 border-b-4 border-indigo-700'
                                        : 'border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                                        }`}
                                >
                                    {plan.cta}
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pitch Quote */}
            <section className="py-20 px-4 bg-indigo-600">
                <div className="max-w-4xl mx-auto text-center">
                    <blockquote className="text-3xl md:text-4xl font-black text-white leading-tight">
                        "Sua imobiliária perde R$ 10 mil por mês com documentos falsos? O ShieldCheck Pro custa R$ 499/mês e bloqueia 99% dessas fraudes antes do financeiro pagar."
                    </blockquote>
                    <p className="text-indigo-200 mt-6 font-semibold">— ShieldCheck AI, proteção que se paga em um único golpe bloqueado.</p>
                </div>
            </section>

            {/* Contact Form */}
            <section id="contato" className="py-24 px-4 bg-white dark:bg-slate-950">
                <div className="max-w-2xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                            Fale com nossa equipe
                        </h2>
                        <p className="text-slate-500 mt-3 text-lg">Respondemos em até 24 horas úteis. Sem compromisso.</p>
                    </div>

                    {status === 'success' ? (
                        <div className="text-center p-12 bg-green-50 dark:bg-green-950/30 rounded-[2rem] border-2 border-green-200 dark:border-green-900">
                            <div className="text-6xl mb-4">🎉</div>
                            <h3 className="text-2xl font-black text-green-700 dark:text-green-400">Mensagem recebida!</h3>
                            <p className="text-green-600 dark:text-green-500 mt-2">Nossa equipe de vendas vai entrar em contato em breve.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-5 bg-slate-50 dark:bg-slate-900 p-8 rounded-[2rem] border-2 border-slate-100 dark:border-slate-800">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-black text-slate-700 dark:text-slate-300 mb-2">Seu nome *</label>
                                    <input
                                        required
                                        value={form.name}
                                        onChange={e => setForm({ ...form, name: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:border-indigo-500 outline-none transition-all"
                                        placeholder="João Silva"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-black text-slate-700 dark:text-slate-300 mb-2">Empresa *</label>
                                    <input
                                        required
                                        value={form.company}
                                        onChange={e => setForm({ ...form, company: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:border-indigo-500 outline-none transition-all"
                                        placeholder="Minha Empresa Ltda"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-black text-slate-700 dark:text-slate-300 mb-2">E-mail *</label>
                                    <input
                                        required
                                        type="email"
                                        value={form.email}
                                        onChange={e => setForm({ ...form, email: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:border-indigo-500 outline-none transition-all"
                                        placeholder="joao@empresa.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-black text-slate-700 dark:text-slate-300 mb-2">Telefone/WhatsApp</label>
                                    <input
                                        value={form.phone}
                                        onChange={e => setForm({ ...form, phone: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:border-indigo-500 outline-none transition-all"
                                        placeholder="(11) 99999-9999"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-black text-slate-700 dark:text-slate-300 mb-2">Tipo de negócio</label>
                                <select
                                    value={form.business_type}
                                    onChange={e => setForm({ ...form, business_type: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:border-indigo-500 outline-none transition-all"
                                >
                                    <option value="">Selecione...</option>
                                    <option>Imobiliária</option>
                                    <option>E-commerce</option>
                                    <option>Escritório de Advocacia</option>
                                    <option>Clínica / Saúde</option>
                                    <option>Banco / Fintech</option>
                                    <option>Outro</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-black text-slate-700 dark:text-slate-300 mb-2">Como podemos ajudar?</label>
                                <textarea
                                    rows={4}
                                    value={form.message}
                                    onChange={e => setForm({ ...form, message: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:border-indigo-500 outline-none transition-all resize-none"
                                    placeholder="Descreva seu desafio atual com fraudes ou golpes..."
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={status === 'loading'}
                                className="w-full py-5 bg-slate-900 dark:bg-indigo-600 text-white font-black rounded-2xl hover:bg-black dark:hover:bg-indigo-500 transition-all text-lg shadow-xl disabled:opacity-50"
                            >
                                {status === 'loading' ? 'Enviando...' : '📩 Enviar Mensagem'}
                            </button>
                            {status === 'error' && (
                                <p className="text-red-500 text-center font-semibold">Erro ao enviar. Tente novamente.</p>
                            )}
                        </form>
                    )}
                </div>
            </section>

            {/* Footer CTA */}
            <section className="py-16 px-4 text-center bg-slate-50 dark:bg-slate-900">
                <p className="text-slate-500 mb-4">Prefere testar antes de contratar?</p>
                <Link to="/register" className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-500 transition-all">
                    Criar conta grátis →
                </Link>
            </section>
        </div>
    );
}

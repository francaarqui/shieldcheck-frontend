import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../context/AuthContext';
import { API_ENDPOINTS } from '../api/config';
import { jsPDF } from 'jspdf';

export default function StoreChecker() {
    const { t } = useTranslation();
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('store'); // 'store', 'cnpj', 'pix', 'phone', 'link'
    const [url, setUrl] = useState('');
    const [cnpj, setCnpj] = useState('');
    const [pix, setPix] = useState('');
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [cnpjResult, setCnpjResult] = useState(null);
    const [genericResult, setGenericResult] = useState(null);
    const [error, setError] = useState(null);
    const [showPremiumModal, setShowPremiumModal] = useState(false);

    const checkStore = async (e) => {
        e.preventDefault();
        if (!url) return;

        setLoading(true);
        setResult(null);
        setError(null);

        try {
            const res = await fetch(`${API_ENDPOINTS.STORE_CHECK}?url=${encodeURIComponent(url)}`, {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            if (res.status === 429) {
                setShowPremiumModal(true);
                throw new Error('Cota diária atingida.');
            }
            if (!res.ok) throw new Error();

            const data = await res.json();
            setResult(data);
        } catch (err) {
            setError(t('tools.store_checker.error_domain'));
        } finally {
            setLoading(false);
        }
    };

    const checkCnpj = async (e) => {
        e.preventDefault();
        const cleanCnpj = cnpj.replace(/\D/g, '');
        if (cleanCnpj.length !== 14) return setError(t('tools.store_checker.error_cnpj'));

        setLoading(true);
        setCnpjResult(null);
        setError(null);

        try {
            // Using BrasilAPI for real data
            const res = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cleanCnpj}`);
            if (!res.ok) throw new Error(t('tools.store_checker.error_cnpj_not_found'));

            const data = await res.json();
            setCnpjResult(data);
        } catch (err) {
            setError(err.message || 'Erro ao consultar CNPJ.');
        } finally {
            setLoading(false);
        }
    };

    const checkItem = async (e, value, type) => {
        e.preventDefault();
        if (!value) return;

        setLoading(true);
        setGenericResult(null);
        setError(null);

        try {
            const res = await fetch(`${API_ENDPOINTS.CHECK_ITEM}?value=${encodeURIComponent(value)}&type=${type}`, {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            if (res.status === 429) {
                setShowPremiumModal(true);
                throw new Error('Cota diária atingida.');
            }
            if (!res.ok) throw new Error();

            const data = await res.json();
            setGenericResult(data);
        } catch (err) {
            setError(t('tools.store_checker.error_generic'));
        } finally {
            setLoading(false);
        }
    };

    const expandUrl = async (e) => {
        e.preventDefault();
        if (!url) return;

        setLoading(true);
        setResult(null);
        setError(null);

        try {
            const res = await fetch(`${API_ENDPOINTS.EXPAND_URL}?url=${encodeURIComponent(url)}`, {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            if (res.status === 429) {
                setShowPremiumModal(true);
                throw new Error('Cota diária atingida.');
            }
            if (!res.ok) throw new Error();

            const data = await res.json();
            setResult({
                ...data.analysis,
                domain: data.expandedUrl,
                recommendation: `${t('tools.store_checker.results.expansion_msg')} ${data.expandedUrl}. ${data.analysis.recommendation}`,
                isExpanded: true
            });
        } catch (err) {
            setError(t('tools.store_checker.error_link'));
        } finally {
            setLoading(false);
        }
    };

    const generateStoreReport = () => {
        if (!result) return;
        const doc = new jsPDF();
        doc.setFillColor(15, 23, 42);
        doc.rect(0, 0, 210, 40, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(22);
        doc.text('SHIELDCHECK AI - AUDITORIA DE LOJA', 20, 25);

        const statusColor = result.trustScore > 70 ? [16, 185, 129] : result.trustScore > 40 ? [245, 158, 11] : [220, 38, 38];
        doc.setFillColor(...statusColor);
        doc.rect(20, 50, 170, 15, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(12);
        doc.text(`CONFIANÇA: ${result.trustScore}% | DOMÍNIO: ${result.domain}`, 30, 60);

        doc.setTextColor(30, 41, 59);
        doc.setFontSize(14);
        doc.text('Análise Técnica:', 20, 85);
        doc.setFontSize(10);
        doc.text(`Tempo de Registro: ${result.registrationAge}`, 20, 95);

        let y = 105;
        result.riskFactors.forEach(factor => {
            doc.text(`- ${factor}`, 20, y);
            y += 7;
        });

        doc.setFillColor(248, 250, 252);
        doc.rect(20, y + 10, 170, 30, 'F');
        doc.setTextColor(79, 70, 229);
        doc.text('Veredito Final ShieldCheck:', 25, y + 20);
        doc.setTextColor(30, 41, 59);
        const splitRec = doc.splitTextToSize(result.recommendation || '', 160);
        doc.text(splitRec, 25, y + 30);

        doc.save(`StoreAudit_${result.domain}_${Date.now()}.pdf`);
    };

    const generateCnpjReport = () => {
        if (!cnpjResult) return;
        const doc = new jsPDF();
        doc.setFillColor(79, 70, 229); // indigo-600
        doc.rect(0, 0, 210, 40, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(22);
        doc.text('CONSULTA CADASTRAL - SHIELDCHECK', 20, 25);

        doc.setTextColor(30, 41, 59);
        doc.setFontSize(16);
        doc.text(cnpjResult.razao_social || 'DADOS DA EMPRESA', 20, 60);
        doc.setFontSize(12);
        doc.text(`CNPJ: ${cnpjResult.cnpj}`, 20, 70);
        doc.text(`Situação: ${cnpjResult.descricao_situacao_cadastral}`, 20, 80);
        doc.text(`Capital Social: R$ ${cnpjResult.capital_social?.toLocaleString()}`, 20, 90);

        doc.text('Endereço:', 20, 110);
        doc.setFontSize(10);
        doc.text(`${cnpjResult.logradouro}, ${cnpjResult.numero}`, 20, 117);
        doc.text(`${cnpjResult.bairro}, ${cnpjResult.municipio} - ${cnpjResult.uf}`, 20, 124);

        doc.text('Atividade:', 20, 140);
        const splitCnae = doc.splitTextToSize(cnpjResult.cnae_fiscal_descricao || '', 170);
        doc.text(splitCnae, 20, 147);

        doc.save(`CNPJ_Audit_${cnpjResult.cnpj}_${Date.now()}.pdf`);
    };

    return (
        <div className="animate-slide-up max-w-5xl mx-auto space-y-12 pb-20 px-4 md:px-0">
            <div className="flex justify-start">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-black rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all border border-slate-200 dark:border-slate-700 shadow-sm group text-[10px] uppercase tracking-widest"
                >
                    <svg className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
                    </svg>
                    {t('tools.analyze.back')}
                </button>
            </div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 text-center md:text-left">
                <div>
                    <h2 className="text-3xl lg:text-4xl font-display font-black text-slate-900 dark:text-white tracking-tight">
                        {t('tools.store_checker.title_start')} <span className="text-premium-gradient">{t('tools.store_checker.title_highlight')}</span>
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-base lg:text-lg font-medium">{t('tools.store_checker.subtitle')}</p>
                </div>
            </div>

            {/* Selection Tabs */}
            <div className="glass-card p-2 rounded-[2rem] border border-white dark:border-slate-800 shadow-xl backdrop-blur-xl">
                <div className="grid grid-cols-2 lg:flex lg:flex-nowrap gap-1.5">
                    {[
                        { id: 'store', label: t('tools.store_checker.tabs.store'), icon: '🌐' },
                        { id: 'cnpj', label: t('tools.store_checker.tabs.cnpj'), icon: '🏢' },
                        { id: 'pix', label: t('tools.store_checker.tabs.pix'), icon: '💎' },
                        { id: 'phone', label: t('tools.store_checker.tabs.phone'), icon: '📞' },
                        { id: 'link', label: t('tools.store_checker.tabs.link'), icon: '🔗', span: 'col-span-2 lg:col-span-1' },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => { setActiveTab(tab.id); setError(null); }}
                            className={`px-3 py-3 lg:px-6 lg:py-4 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 whitespace-nowrap ${tab.span || ''}
                                ${activeTab === tab.id
                                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-lg scale-[1.02] z-10'
                                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                                }
                            `}
                        >
                            <span className="text-base">{tab.icon}</span>
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {error && (
                <div className="p-6 bg-red-50 dark:bg-red-950/30 border-2 border-red-100 dark:border-red-900/30 rounded-3xl text-red-600 dark:text-red-400 font-bold flex items-center gap-4 animate-bounce mx-auto max-w-xl">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                    <p>{error}</p>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
                {/* Input Area */}
                <div className="md:col-span-2">
                    <div className="glass-card p-10 rounded-[3rem] border border-white dark:border-slate-800 shadow-2xl relative overflow-hidden transition-all duration-300">
                        {loading && (
                            <div className="absolute inset-0 z-30 pointer-events-none overflow-hidden rounded-[3rem]">
                                <div className="absolute inset-0 bg-indigo-500/5 backdrop-blur-[2px] animate-pulse"></div>
                                <div className="scan-line animate-scan"></div>
                            </div>
                        )}

                        {activeTab === 'store' ? (
                            <div className="space-y-8">
                                <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-3">
                                    <div className="w-2 h-6 bg-indigo-600 rounded-full"></div>
                                    {t('tools.store_checker.form.domain_title')}
                                </h3>
                                <div className="flex flex-col lg:flex-row gap-4">
                                    <div className="flex-1 relative group">
                                        <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-3xl blur opacity-0 group-focus-within:opacity-100 transition duration-500"></div>
                                        <input
                                            type="url"
                                            value={url}
                                            onChange={(e) => setUrl(e.target.value)}
                                            placeholder={t('tools.store_checker.form.domain_placeholder')}
                                            className="relative w-full h-20 px-8 bg-slate-50/50 dark:bg-slate-950/50 border-2 border-slate-100 dark:border-slate-800 rounded-3xl focus:ring-0 focus:border-indigo-500 outline-none transition-all text-slate-800 dark:text-slate-100 font-bold text-xl placeholder:text-slate-300"
                                        />
                                    </div>
                                    <button
                                        onClick={checkStore}
                                        disabled={loading || !url}
                                        className="lg:w-72 h-20 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black rounded-3xl hover:opacity-90 transition-all shadow-xl disabled:opacity-50 text-xl flex items-center justify-center gap-3 active:scale-95"
                                    >
                                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                                        {t('tools.store_checker.form.domain_button')}
                                    </button>
                                </div>

                            </div>
                        ) : activeTab === 'cnpj' ? (
                            <div className="space-y-8">
                                <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-3">
                                    <div className="w-2 h-6 bg-purple-600 rounded-full"></div>
                                    {t('tools.store_checker.form.cnpj_title')}
                                </h3>
                                <div className="flex flex-col lg:flex-row gap-4">
                                    <input
                                        type="text"
                                        value={cnpj}
                                        onChange={(e) => setCnpj(e.target.value)}
                                        placeholder={t('tools.store_checker.form.cnpj_placeholder')}
                                        className="flex-1 h-20 px-8 bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 rounded-3xl focus:ring-8 focus:ring-purple-100 dark:focus:ring-purple-900/20 focus:border-purple-500 outline-none transition-all text-slate-800 dark:text-slate-100 font-bold text-xl placeholder:text-slate-300"
                                    />
                                    <button
                                        onClick={checkCnpj}
                                        disabled={loading || !cnpj}
                                        className="lg:w-72 h-20 bg-purple-600 text-white font-black rounded-3xl hover:bg-purple-700 transition-all shadow-2xl shadow-purple-200 dark:shadow-none disabled:opacity-50 text-xl"
                                    >
                                        {t('tools.store_checker.form.cnpj_button')}
                                    </button>
                                </div>
                            </div>
                        ) : activeTab === 'pix' ? (
                            <div className="space-y-8">
                                <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-3">
                                    <div className="w-2 h-6 bg-emerald-500 rounded-full"></div>
                                    {t('tools.store_checker.form.pix_title')}
                                </h3>
                                <div className="flex flex-col lg:flex-row gap-4">
                                    <input
                                        type="text"
                                        value={pix}
                                        onChange={(e) => setPix(e.target.value)}
                                        placeholder={t('tools.store_checker.form.pix_placeholder')}
                                        className="flex-1 h-20 px-8 bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 rounded-3xl focus:ring-8 focus:ring-emerald-100 dark:focus:ring-emerald-900/20 focus:border-emerald-500 outline-none transition-all text-slate-800 dark:text-slate-100 font-bold text-xl placeholder:text-slate-300"
                                    />
                                    <button
                                        onClick={(e) => checkItem(e, pix, 'pix')}
                                        disabled={loading || !pix}
                                        className="lg:w-72 h-20 bg-emerald-600 text-white font-black rounded-3xl hover:bg-emerald-700 transition-all shadow-2xl shadow-emerald-200 dark:shadow-none disabled:opacity-50 text-xl"
                                    >
                                        {t('tools.store_checker.form.pix_button')}
                                    </button>
                                </div>
                            </div>
                        ) : activeTab === 'phone' ? (
                            <div className="space-y-8">
                                <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-3">
                                    <div className="w-2 h-6 bg-blue-500 rounded-full"></div>
                                    {t('tools.store_checker.form.phone_title')}
                                </h3>
                                <div className="flex flex-col lg:flex-row gap-4">
                                    <input
                                        type="tel"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        placeholder={t('tools.store_checker.form.phone_placeholder')}
                                        className="flex-1 h-20 px-8 bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 rounded-3xl focus:ring-8 focus:ring-blue-100 dark:focus:ring-blue-900/20 focus:border-blue-500 outline-none transition-all text-slate-800 dark:text-slate-100 font-bold text-xl placeholder:text-slate-300"
                                    />
                                    <button
                                        onClick={(e) => checkItem(e, phone, 'phone')}
                                        disabled={loading || !phone}
                                        className="lg:w-72 h-20 bg-blue-600 text-white font-black rounded-3xl hover:bg-blue-700 transition-all shadow-2xl shadow-blue-200 dark:shadow-none disabled:opacity-50 text-xl"
                                    >
                                        {t('tools.store_checker.form.phone_button')}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            /* Link Expansion Tab */
                            <div className="space-y-8">
                                <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-3">
                                    <div className="w-2 h-6 bg-indigo-500 rounded-full"></div>
                                    {t('tools.store_checker.form.link_title')}
                                </h3>
                                <div className="flex flex-col lg:flex-row gap-4">
                                    <input
                                        type="url"
                                        value={url}
                                        onChange={(e) => setUrl(e.target.value)}
                                        placeholder={t('tools.store_checker.form.link_placeholder')}
                                        className="flex-1 h-20 px-8 bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 rounded-3xl focus:ring-8 focus:ring-indigo-100 dark:focus:ring-indigo-900/20 focus:border-indigo-500 outline-none transition-all text-slate-800 dark:text-slate-100 font-bold text-xl placeholder:text-slate-300"
                                    />
                                    <button
                                        onClick={expandUrl}
                                        disabled={loading || !url}
                                        className="lg:w-72 h-20 bg-indigo-600 text-white font-black rounded-3xl hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-200 dark:shadow-none disabled:opacity-50 text-xl"
                                    >
                                        {t('tools.store_checker.form.link_button')}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Result Store */}
                {result && activeTab === 'store' && (
                    <div className="md:col-span-2 animate-slide-up">
                        <div className="glass-card rounded-[3rem] border border-white dark:border-slate-800 shadow-2xl overflow-hidden relative">
                            <div className={`h-4 w-full ${result.trustScore > 70 ? 'bg-emerald-500' : result.trustScore > 40 ? 'bg-amber-500' : 'bg-red-500'}`}></div>

                            <div className="p-10 flex flex-col lg:flex-row gap-12">
                                <div className="flex flex-col items-center justify-center space-y-4">
                                    <div className={`w-48 h-48 rounded-[2.5rem] flex flex-col items-center justify-center border-4 shadow-2xl relative
                                        ${result.trustScore > 70 ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/30 text-emerald-600 dark:text-emerald-400' :
                                            result.trustScore > 40 ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/30 text-amber-600 dark:text-amber-400' :
                                                'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400'}
                                    `}>
                                        <p className="text-[10px] font-black uppercase tracking-widest opacity-60">{t('tools.store_checker.results.trust_score')}</p>
                                        <p className="text-8xl font-display font-black leading-none">{result.trustScore}</p>
                                        <p className="text-xs font-bold mt-2 uppercase tracking-tighter">{t('tools.store_checker.results.global_index')}</p>
                                    </div>

                                    {user?.plan === 'PREMIUM' && (
                                        <button
                                            onClick={generateStoreReport}
                                            className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:opacity-90 transition-all shadow-xl flex items-center justify-center gap-2"
                                        >
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                            {t('tools.store_checker.results.pdf_report')}
                                        </button>
                                    )}
                                </div>

                                <div className="flex-1 space-y-10">
                                    <div>
                                        <h4 className="text-3xl font-display font-black text-slate-900 dark:text-white mb-2 break-all">{result.domain}</h4>
                                        <div className="flex gap-2">
                                            <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-lg text-[10px] font-black uppercase tracking-widest border border-slate-200 dark:border-slate-700">{t('tools.store_checker.results.age')}: {result.registrationAge}</span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {result.riskFactors.map((factor, idx) => (
                                            <div key={idx} className="flex gap-4 items-center bg-slate-50/50 dark:bg-slate-800/10 border border-slate-100 dark:border-slate-800 p-5 rounded-2xl">
                                                <div className={`p-1.5 rounded-lg ${result.trustScore > 70 ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                                </div>
                                                <span className="text-sm font-bold text-slate-700 dark:text-slate-300 leading-tight">{factor}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className={`p-8 rounded-[2rem] border-2 shadow-sm ${result.trustScore > 50 ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/30' : 'bg-red-50/50 dark:bg-red-950/20 border-red-100 dark:border-red-900/30'}`}>
                                        <h4 className="text-xs font-black uppercase tracking-[0.2em] mb-3 text-emerald-600">{t('tools.store_checker.results.verdict')}</h4>
                                        <p className="text-xl font-bold leading-relaxed text-emerald-900 dark:text-emerald-400">"{result.recommendation}"</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Result CNPJ */}
                {cnpjResult && activeTab === 'cnpj' && (
                    <div className="md:col-span-2 animate-slide-up">
                        <div className="glass-card rounded-[3rem] border border-white dark:border-slate-800 shadow-2xl p-10 relative overflow-hidden transition-all duration-300">
                            <div className="absolute top-0 right-0 w-1/3 h-full bg-slate-50/50 dark:bg-slate-900/20 skew-x-12 translate-x-1/2"></div>

                            <div className="relative z-10 flex flex-col lg:flex-row gap-12">
                                <div className="flex-1 space-y-10">
                                    <div className="space-y-3">
                                        <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${cnpjResult.descricao_situacao_cadastral === 'Ativa' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-red-50 text-red-700 border-red-100'}`}>
                                            <div className={`w-2 h-2 rounded-full ${cnpjResult.descricao_situacao_cadastral === 'Ativa' ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></div>
                                            {t('tools.store_checker.results.situation')}: {cnpjResult.descricao_situacao_cadastral || t('tools.store_checker.results.active')}
                                        </span>
                                        <h3 className="text-4xl font-display font-black text-slate-900 dark:text-white leading-tight">{cnpjResult.razao_social || cnpjResult.nome_fantasia}</h3>
                                        <p className="text-slate-400 dark:text-slate-500 font-bold font-mono text-xl">{cnpjResult.cnpj}</p>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div className="bg-slate-50/50 dark:bg-slate-900/30 p-6 rounded-3xl border border-slate-100 dark:border-slate-800">
                                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{t('tools.store_checker.results.foundation')}</label>
                                            <p className="text-slate-800 dark:text-slate-200 font-black text-xl">{cnpjResult.data_inicio_atividade || '---'}</p>
                                        </div>
                                        <div className="bg-slate-50/50 dark:bg-slate-900/30 p-6 rounded-3xl border border-slate-100 dark:border-slate-800">
                                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{t('tools.store_checker.results.capital')}</label>
                                            <p className="text-slate-800 dark:text-slate-200 font-black text-xl">R$ {cnpjResult.capital_social?.toLocaleString() || '---'}</p>
                                        </div>
                                        <div className="sm:col-span-2 bg-slate-50/50 dark:bg-slate-900/30 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 flex items-start gap-4">
                                            <div className="bg-indigo-100 dark:bg-indigo-900/30 p-3 rounded-2xl text-indigo-600 dark:text-indigo-400">
                                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{t('tools.store_checker.results.location')}</label>
                                                <p className="text-slate-800 dark:text-slate-200 font-bold">{cnpjResult.logradouro}, {cnpjResult.numero}</p>
                                                <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">{cnpjResult.bairro}, {cnpjResult.municipio} - {cnpjResult.uf}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="w-full lg:w-80 flex flex-col gap-4">
                                    <div className="bg-indigo-600 rounded-[2rem] p-8 text-white shadow-2xl shadow-indigo-200 dark:shadow-none relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
                                        <h4 className="font-black text-xl mb-6 relative z-10 flex items-center justify-between">
                                            {t('tools.store_checker.results.fiscal_score')}
                                            <div className="bg-white/20 p-2 rounded-xl"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 12l2 2 4-4" /></svg></div>
                                        </h4>
                                        <div className="space-y-4 relative z-10">
                                            <div className="flex items-center gap-3">
                                                <div className="w-1.5 h-1.5 bg-indigo-300 rounded-full"></div>
                                                <span className="text-xs font-bold">{t('tools.store_checker.results.verified_rfb')}</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="w-1.5 h-1.5 bg-indigo-300 rounded-full"></div>
                                                <span className="text-xs font-bold">{t('tools.store_checker.results.consistent_activity')}</span>
                                            </div>
                                            <p className="text-[10px] text-indigo-100/60 font-black uppercase tracking-widest pt-6 mt-4 border-t border-white/10">{t('tools.store_checker.results.legitimate_msg')}</p>
                                        </div>
                                    </div>

                                    {user?.plan === 'PREMIUM' && (
                                        <button
                                            onClick={generateCnpjReport}
                                            className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:opacity-90 transition-all flex items-center justify-center gap-2"
                                        >
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                            {t('tools.store_checker.results.export_pdf')}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Result Generic (PIX/Phone) */}
                {genericResult && (activeTab === 'pix' || activeTab === 'phone') && (
                    <div className="md:col-span-2 animate-slide-up">
                        <div className="glass-card rounded-[3rem] border border-white dark:border-slate-800 shadow-2xl overflow-hidden relative">
                            <div className={`h-4 w-full ${genericResult.score > 60 ? 'bg-red-500' : genericResult.score > 30 ? 'bg-amber-500' : 'bg-emerald-500'}`}></div>

                            <div className="p-10 flex flex-col lg:flex-row gap-12">
                                <div className="flex flex-col items-center justify-center space-y-4">
                                    <div className={`w-48 h-48 rounded-[2.5rem] flex flex-col items-center justify-center border-4 shadow-2xl relative
                                        ${genericResult.score > 60 ? 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400' :
                                            genericResult.score > 30 ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/30 text-amber-600 dark:text-amber-400' :
                                                'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/30 text-emerald-600 dark:text-emerald-400'}
                                    `}>
                                        <p className="text-[10px] font-black uppercase tracking-widest opacity-60">{t('tools.store_checker.results.risk')}</p>
                                        <p className="text-8xl font-display font-black leading-none">{genericResult.score}</p>
                                        <p className="text-xs font-bold mt-2 uppercase tracking-tighter">{genericResult.status}</p>
                                    </div>
                                    {genericResult.reportedTimes > 0 && (
                                        <div className="px-4 py-2 bg-red-100 text-red-700 rounded-xl text-[10px] font-black uppercase tracking-widest animate-pulse">
                                            {t('tools.store_checker.results.reported_times', { count: genericResult.reportedTimes })}
                                        </div>
                                    )}
                                </div>

                                <div className="flex-1 space-y-10">
                                    <div>
                                        <h4 className="text-3xl font-display font-black text-slate-900 dark:text-white mb-2 break-all">
                                            {activeTab === 'pix' ? pix : phone}
                                        </h4>
                                        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">{t('tools.store_checker.results.verified_identity')}</p>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {genericResult.signals.map((signal, idx) => (
                                            <div key={idx} className="flex gap-4 items-center bg-slate-50/50 dark:bg-slate-800/10 border border-slate-100 dark:border-slate-800 p-5 rounded-2xl">
                                                <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                                                <span className="text-sm font-bold text-slate-700 dark:text-slate-300 leading-tight">{signal}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="p-8 bg-slate-900 dark:bg-white rounded-[2rem] text-white dark:text-slate-900">
                                        <h4 className="text-[10px] font-black uppercase tracking-widest mb-3 opacity-60">{t('tools.store_checker.results.security_advice')}</h4>
                                        <p className="text-xl font-bold leading-relaxed">{genericResult.recommendation}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Modal Premium */}
            {showPremiumModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
                    <div className="bg-white rounded-[2.5rem] max-w-lg w-full p-8 md:p-10 shadow-2xl relative overflow-hidden animate-slide-up">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full blur-3xl -mr-16 -mt-16 opacity-60"></div>
                        <div className="relative z-10 text-center space-y-6">
                            <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center mx-auto shadow-lg shadow-indigo-200 rotate-12">
                                <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 11l7-7 7 7M5 19l7-7 7 7" /></svg>
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-3xl font-black text-slate-900 tracking-tight">{t('tools.store_checker.premium_modal.title')}</h3>
                                <p className="text-slate-500 font-medium leading-relaxed">{t('tools.store_checker.premium_modal.desc')}</p>
                            </div>
                            <div className="flex flex-col gap-3">
                                <Link to="/plans" className="w-full bg-slate-900 text-white font-black py-4 rounded-2xl hover:bg-black transition-all shadow-lg text-lg">{t('tools.store_checker.premium_modal.cta')}</Link>
                                <button onClick={() => setShowPremiumModal(false)} className="text-slate-400 font-bold text-sm hover:text-slate-600 transition-colors">{t('tools.store_checker.premium_modal.later')}</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

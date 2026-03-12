import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { API_ENDPOINTS } from '../api/config';

export default function StoreChecker() {
    const { user } = useContext(AuthContext);
    const [activeTab, setActiveTab] = useState('store'); // 'store' or 'cnpj'
    const [url, setUrl] = useState('');
    const [cnpj, setCnpj] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [cnpjResult, setCnpjResult] = useState(null);
    const [error, setError] = useState(null);

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
            if (!res.ok) throw new Error();

            const data = await res.json();
            setResult(data);
        } catch (err) {
            setError('Não foi possível realizar a varredura deste domínio no momento.');
        } finally {
            setLoading(false);
        }
    };

    const checkCnpj = async (e) => {
        e.preventDefault();
        const cleanCnpj = cnpj.replace(/\D/g, '');
        if (cleanCnpj.length !== 14) return setError('CNPJ inválido. Digite os 14 dígitos.');

        setLoading(true);
        setCnpjResult(null);
        setError(null);

        try {
            // Using BrasilAPI for real data
            const res = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cleanCnpj}`);
            if (!res.ok) throw new Error('Empresa não encontrada ou erro na base de dados.');

            const data = await res.json();
            setCnpjResult(data);
        } catch (err) {
            setError(err.message || 'Erro ao consultar CNPJ.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="animate-slide-up max-w-5xl mx-auto space-y-10 pb-20">
            <div className="text-center space-y-4">
                <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-xs font-black uppercase tracking-widest border border-indigo-100">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                    </span>
                    Módulo de Inteligência Comercial
                </span>
                <h2 className="text-5xl font-display font-black text-slate-900 tracking-tight">
                    Verificador de <span className="text-premium-gradient">Legitimidade</span>
                </h2>
                <p className="text-slate-500 text-lg max-w-2xl mx-auto font-medium leading-relaxed">
                    Proteja-se contra empresas fantasmas e sites clonados usando nossa base integrada de WHOIS e Receita Federal.
                </p>
            </div>

            {/* Tabs Switcher */}
            <div className="flex justify-center">
                <div className="bg-slate-200/50 p-1 rounded-2xl flex gap-1 border border-white">
                    <button
                        onClick={() => { setActiveTab('store'); setError(null); }}
                        className={`px-8 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${activeTab === 'store' ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-600 hover:text-slate-900'}`}
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
                        Lojas e Sites
                    </button>
                    <button
                        onClick={() => { setActiveTab('cnpj'); setError(null); }}
                        className={`px-8 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${activeTab === 'cnpj' ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-600 hover:text-slate-900'}`}
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                        Consultar CNPJ
                    </button>
                </div>
            </div>

            <div className="glass-card rounded-[2.5rem] p-8 md:p-12 max-w-3xl mx-auto ring-1 ring-white shadow-2xl">
                {activeTab === 'store' ? (
                    <form onSubmit={checkStore} className="space-y-6">
                        <div className="space-y-3">
                            <label className="block text-sm font-black text-slate-800 uppercase tracking-tighter">Endereço da Loja (URL)</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none transition-colors group-focus-within:text-indigo-500 text-slate-400">
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m24.432 0a13.34 13.34 0 0 1 2.228-1.503" /></svg>
                                </div>
                                <input
                                    type="url"
                                    required
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    placeholder="https://loja-suspeita.com.br"
                                    className="w-full pl-14 pr-6 py-5 rounded-2xl border-2 border-slate-100 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-8 focus:ring-indigo-500/5 transition-all font-semibold text-slate-900 text-lg shadow-inner"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-slate-900 text-white font-black py-5 px-8 rounded-2xl hover:bg-black transition-all shadow-xl shadow-slate-200 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-3 text-lg hover-lift"
                        >
                            {loading ? (
                                <><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div> Rastreando Servidores...</>
                            ) : (
                                <>Executar Varredura de Domínio</>
                            )}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={checkCnpj} className="space-y-6">
                        <div className="space-y-3">
                            <label className="block text-sm font-black text-slate-800 uppercase tracking-tighter">CNPJ da Empresa</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-400">
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-9h1.5m-1.5 3h1.5m-1.5 3h1.5M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" /></svg>
                                </div>
                                <input
                                    type="text"
                                    required
                                    value={cnpj}
                                    onChange={(e) => setCnpj(e.target.value)}
                                    placeholder="00.000.000/0001-00"
                                    className="w-full pl-14 pr-6 py-5 rounded-2xl border-2 border-slate-100 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-8 focus:ring-indigo-500/5 transition-all font-semibold text-slate-900 text-lg shadow-inner"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-slate-900 text-white font-black py-5 px-8 rounded-2xl hover:bg-black transition-all shadow-xl shadow-slate-200 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-3 text-lg hover-lift"
                        >
                            {loading ? (
                                <><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div> Consultando Receita Federal...</>
                            ) : (
                                <>Cruzar Dados Cadastrais</>
                            )}
                        </button>
                    </form>
                )}
                {error && (
                    <div className="mt-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm font-bold flex items-center gap-2 animate-bounce">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        {error}
                    </div>
                )}
            </div>

            {/* RESULTS SECTION: STORE */}
            {result && activeTab === 'store' && (
                <div className="animate-slide-up bg-white rounded-[2.5rem] p-8 md:p-12 border border-slate-100 shadow-2xl max-w-5xl mx-auto overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full blur-3xl -mr-32 -mt-32 opacity-50"></div>
                    <div className="flex flex-col md:flex-row gap-12 items-center relative z-10">
                        <div className="w-full md:w-1/3 flex flex-col items-center">
                            <div className={`relative w-48 h-48 rounded-full border-[12px] flex flex-col items-center justify-center shadow-inner
                                ${result.trustScore > 70 ? 'border-emerald-500/20 bg-emerald-50 text-emerald-600' :
                                    result.trustScore > 40 ? 'border-amber-400/20 bg-amber-50 text-amber-600' : 'border-red-500/20 bg-red-50 text-red-600'}
                            `}>
                                <div className="absolute inset-0 rounded-full border-t-[12px] border-current rotate-45 animate-pulse"></div>
                                <span className="text-6xl font-display font-black">{result.trustScore}</span>
                                <span className="text-xs font-black uppercase tracking-[0.2em] mt-1">Trust Score</span>
                            </div>
                            <div className="text-center mt-8">
                                <h3 className="font-display font-black text-slate-900 text-2xl break-all">{result.domain}</h3>
                                <div className={`mt-3 inline-flex border px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest
                                  ${result.trustScore > 70 ? 'border-emerald-200 bg-emerald-100 text-emerald-800' : 'border-red-200 bg-red-100 text-red-800'}
                                `}>
                                    Registro: {result.registrationAge}
                                </div>
                            </div>
                        </div>

                        <div className="w-full md:w-2/3 space-y-8">
                            <div className={`p-8 rounded-3xl border-2 shadow-sm ${result.trustScore > 50 ? 'bg-emerald-50/50 border-emerald-100' : 'bg-red-50/50 border-red-100'}`}>
                                <h4 className={`font-display font-black text-xl mb-3 flex items-center gap-2 ${result.trustScore > 50 ? 'text-emerald-900' : 'text-red-900'}`}>
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    Veredito da Inteligência
                                </h4>
                                <p className={`text-lg leading-relaxed font-semibold ${result.trustScore > 50 ? 'text-emerald-800' : 'text-red-800'}`}>
                                    {result.recommendation}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {result.riskFactors.map((factor, idx) => (
                                    <div key={idx} className="flex gap-4 items-center bg-slate-50 border border-slate-100 p-5 rounded-2xl hover:bg-white transition-all shadow-sm">
                                        <div className={`p-2 rounded-lg ${result.trustScore > 50 ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                                            {result.trustScore > 50 ? (
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                            ) : (
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                                            )}
                                        </div>
                                        <span className="text-sm font-bold text-slate-700">{factor}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* RESULTS SECTION: CNPJ */}
            {cnpjResult && activeTab === 'cnpj' && (
                <div className="animate-slide-up bg-white rounded-[2.5rem] p-8 md:p-12 border border-slate-100 shadow-2xl max-w-5xl mx-auto overflow-hidden">
                    <div className="flex flex-col lg:flex-row gap-10">
                        <div className="flex-1 space-y-6">
                            <div className="space-y-1">
                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${cnpjResult.descricao_situacao_cadastral === 'Ativa' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-red-50 text-red-700 border-red-100'}`}>
                                    Status: {cnpjResult.descricao_situacao_cadastral || 'ATIVA'}
                                </span>
                                <h3 className="text-3xl font-display font-black text-slate-900 leading-tight">{cnpjResult.razao_social || cnpjResult.nome_fantasia}</h3>
                                <p className="text-slate-500 font-bold font-mono text-lg">{cnpjResult.cnpj}</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 group hover:border-indigo-200 transition-all">
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Fundação</label>
                                    <p className="text-slate-800 font-bold text-lg">{cnpjResult.data_inicio_atividade || 'Não informado'}</p>
                                </div>
                                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 group hover:border-indigo-200 transition-all">
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Capital Social</label>
                                    <p className="text-slate-800 font-bold text-lg">R$ {cnpjResult.capital_social?.toLocaleString() || '0,00'}</p>
                                </div>
                                <div className="md:col-span-2 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Localização</label>
                                    <p className="text-slate-800 font-bold">{cnpjResult.logradouro}, {cnpjResult.numero} {cnpjResult.complemento && `- ${cnpjResult.complemento}`}</p>
                                    <p className="text-slate-600 font-medium text-sm">{cnpjResult.bairro}, {cnpjResult.municipio} - {cnpjResult.uf}</p>
                                </div>
                                <div className="md:col-span-2 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Atividade Principal (CNAE)</label>
                                    <p className="text-slate-800 font-bold text-sm leading-relaxed">{cnpjResult.cnae_fiscal_descricao || 'Não informado'}</p>
                                </div>
                            </div>
                        </div>

                        <div className="w-full lg:w-80 space-y-4">
                            <div className="bg-indigo-600 rounded-3xl p-8 text-white shadow-xl shadow-indigo-200">
                                <h4 className="font-black text-xl mb-4">Análise Shield</h4>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-white/20 p-2 rounded-lg"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4" /></svg></div>
                                        <span className="text-xs font-bold leading-tight">Dados Verificados na Base da RFB</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="bg-white/20 p-2 rounded-lg"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" /></svg></div>
                                        <span className="text-xs font-bold leading-tight">Sem Restrições Administrativas</span>
                                    </div>
                                    <p className="text-[10px] text-indigo-100 font-medium pt-4 border-t border-white/20 uppercase tracking-widest">Este CNPJ existe e está ativo. Verifique se condiz com o nome do site que você está acessando.</p>
                                </div>
                            </div>

                            <button className="w-full py-4 text-slate-500 font-bold text-sm hover:text-slate-800 transition-all">Reportar Inconsistência</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

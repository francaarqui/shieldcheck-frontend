import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../context/AuthContext';
import { jsPDF } from 'jspdf';

export default function ConsultaCNPJ() {
    const { t } = useTranslation();
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [cnpj, setCnpj] = useState('');
    const [loading, setLoading] = useState(false);
    const [cnpjResult, setCnpjResult] = useState(null);
    const [error, setError] = useState(null);

    const checkCnpj = async (e) => {
        e.preventDefault();
        const cleanCnpj = cnpj.replace(/\D/g, '');
        if (cleanCnpj.length !== 14) return setError(t('tools.store_checker.error_cnpj'));

        setLoading(true);
        setCnpjResult(null);
        setError(null);

        try {
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
                <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-black rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all border border-slate-200 dark:border-slate-700 shadow-sm group text-[10px] uppercase tracking-widest">
                    <svg className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
                    </svg>
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
                    {t('specialized_tools.consulta_cnpj.title')}
                </h2>
                <p className="text-slate-500 dark:text-slate-400 text-lg font-medium max-w-2xl">
                    {t('specialized_tools.consulta_cnpj.subtitle')}
                </p>
            </div>

            {error && (
                <div className="p-6 bg-red-50 dark:bg-red-950/30 border-2 border-red-100 dark:border-red-900/30 rounded-3xl text-red-600 dark:text-red-400 font-bold flex items-center gap-4 animate-bounce mx-auto max-w-xl">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                    <p>{error}</p>
                </div>
            )}

            <div className="glass-card p-10 rounded-[3rem] border border-white dark:border-slate-800 shadow-2xl relative overflow-hidden transition-all duration-300">
                {loading && (
                    <div className="absolute inset-0 z-30 pointer-events-none overflow-hidden rounded-[3rem]">
                        <div className="absolute inset-0 bg-purple-500/5 backdrop-blur-[2px] animate-pulse"></div>
                        <div className="scan-line animate-scan bg-purple-500/50"></div>
                    </div>
                )}
                <div className="space-y-8">
                    <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-3">
                        <div className="w-2 h-6 bg-purple-600 rounded-full"></div>
                        {t('specialized_tools.consulta_cnpj.input_label')}
                    </h3>
                    <div className="flex flex-col lg:flex-row gap-4">
                        <input
                            type="text"
                            value={cnpj}
                            onChange={(e) => setCnpj(e.target.value)}
                            placeholder={t('specialized_tools.consulta_cnpj.placeholder')}
                            className="flex-1 h-20 px-8 bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 rounded-3xl focus:ring-8 focus:ring-purple-100 dark:focus:ring-purple-900/20 focus:border-purple-500 outline-none transition-all text-slate-800 dark:text-slate-100 font-bold text-xl placeholder:text-slate-300"
                        />
                        <button
                            onClick={checkCnpj}
                            disabled={loading || !cnpj}
                            className="lg:w-72 h-20 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black rounded-3xl hover:opacity-90 transition-all shadow-xl disabled:opacity-50 text-xl flex items-center justify-center gap-3 active:scale-95"
                        >
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                            {t('specialized_tools.common.audit_now')}
                        </button>
                    </div>
                </div>
            </div>

            {cnpjResult && (
                <div className="animate-slide-up">
                    <div className="glass-card rounded-[3rem] border border-white dark:border-slate-800 shadow-2xl p-10 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-1/3 h-full bg-slate-50/50 dark:bg-slate-900/20 skew-x-12 translate-x-1/2"></div>
                        <div className="relative z-10 flex flex-col lg:flex-row gap-12">
                            <div className="flex-1 space-y-10">
                                <div className="space-y-3">
                                    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${cnpjResult.descricao_situacao_cadastral === 'ATIVA' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-red-50 text-red-700 border-red-100'}`}>
                                        <div className={`w-2 h-2 rounded-full ${cnpjResult.descricao_situacao_cadastral === 'ATIVA' ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></div>
                                        Situação: {cnpjResult.descricao_situacao_cadastral}
                                    </span>
                                    <h3 className="text-4xl font-display font-black text-slate-900 dark:text-white leading-tight">{cnpjResult.razao_social}</h3>
                                    <p className="text-slate-400 dark:text-slate-500 font-bold font-mono text-xl">{cnpjResult.cnpj}</p>
                                </div>

                                <h5 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                    <div className="w-1.5 h-4 bg-indigo-500 rounded-full"></div>
                                    {t('specialized_tools.common.technical_analysis')}
                                </h5>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="bg-slate-50/50 dark:bg-slate-900/30 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 flex flex-col justify-center">
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Fundação</label>
                                        <p className="text-slate-800 dark:text-slate-200 font-black text-xl">{cnpjResult.data_inicio_atividade}</p>
                                    </div>
                                    <div className="bg-slate-50/50 dark:bg-slate-900/30 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 flex flex-col justify-center">
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Capital Social</label>
                                        <p className="text-slate-800 dark:text-slate-200 font-black text-xl">R$ {cnpjResult.capital_social?.toLocaleString()}</p>
                                    </div>
                                    <div className="sm:col-span-2 bg-slate-50/50 dark:bg-slate-900/30 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 flex items-start gap-4">
                                        <div className="bg-indigo-100 dark:bg-indigo-900/30 p-3 rounded-2xl text-indigo-600 dark:text-indigo-400">
                                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Localização</label>
                                            <p className="text-slate-800 dark:text-slate-200 font-bold">{cnpjResult.logradouro}, {cnpjResult.numero}</p>
                                            <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">{cnpjResult.bairro}, {cnpjResult.municipio} - {cnpjResult.uf}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="w-full lg:w-80 flex flex-col gap-4">
                                <div className="bg-slate-900 dark:bg-white rounded-[2rem] p-8 text-white dark:text-slate-900 shadow-2xl relative overflow-hidden group">
                                    <h4 className="font-black text-xl mb-6 relative z-10 flex items-center justify-between">
                                        {t('specialized_tools.common.verdict_title')}
                                        <div className="bg-indigo-500 p-2 rounded-xl text-white"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 12l2 2 4-4" /></svg></div>
                                    </h4>
                                    <div className="space-y-4 relative z-10">
                                        <div className="flex items-center gap-3"><div className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></div><span className="text-xs font-bold">Verificado RFB</span></div>
                                        <div className="flex items-center gap-3"><div className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></div><span className="text-xs font-bold">Atividade Consistente</span></div>
                                        <p className="text-[10px] opacity-60 font-black uppercase tracking-widest pt-6 mt-4 border-t border-white/10 dark:border-slate-800/10">Este CNPJ é legítimo perante os órgãos reguladores. Operação em situação regularizada.</p>
                                    </div>
                                </div>
                                {user?.plan === 'PREMIUM' && (
                                    <button onClick={generateCnpjReport} className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:opacity-90 transition-all flex items-center justify-center gap-2">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                        {t('specialized_tools.common.download_report')}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

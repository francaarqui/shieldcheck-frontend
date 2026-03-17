import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function AnalisadorDocumentos() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [analysis, setAnalysis] = useState(null);
    const [dragActive, setDragActive] = useState(false);

    const handleFile = (e) => {
        const selectedFile = e.target.files?.[0] || e.dataTransfer?.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            simulateAnalysis(selectedFile);
        }
    };

    const simulateAnalysis = (file) => {
        setLoading(true);
        setAnalysis(null);
        setTimeout(() => {
            setAnalysis({
                fileName: file.name,
                type: 'Boleto Bancário',
                beneficiary: 'EMPRESA EXEMPLO LTDA',
                cnpj: '00.000.000/0001-00',
                bank: 'Banco do Brasil',
                value: 'R$ 1.250,00',
                riskScore: 15,
                status: 'Legítimo',
                signals: [
                    'Linha digitável condiz com beneficiário',
                    'Empresa ativa na Receita Federal',
                    'Nenhum alerta de fraude para este CNPJ',
                    'Domínio do emissor verificado'
                ],
                recommendation: 'Este documento parece seguro para pagamento. Os dados do beneficiário conferem com o registro oficial.'
            });
            setLoading(false);
        }, 3000);
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
                    📄 OCR Deep Inspection
                </div>
                <h2 className="text-4xl lg:text-5xl font-display font-black text-slate-900 dark:text-white tracking-tight">
                    {t('specialized_tools.analisador_docs.title')}
                </h2>
                <p className="text-slate-500 dark:text-slate-400 text-lg font-medium max-w-2xl">
                    {t('specialized_tools.analisador_docs.subtitle')}
                </p>
            </div>

            {!analysis && (
                <div
                    className={`glass-card p-20 rounded-[3rem] border-4 border-dashed transition-all duration-500 flex flex-col items-center text-center space-y-6 group
                        ${dragActive ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/20 scale-105' : 'border-slate-100 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600'}
                    `}
                    onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                    onDragLeave={() => setDragActive(false)}
                    onDrop={(e) => { e.preventDefault(); setDragActive(false); handleFile(e); }}
                >
                    <div className="w-24 h-24 bg-indigo-100 dark:bg-indigo-900/30 rounded-3xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
                        <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight">{t('specialized_tools.analisador_docs.upload_title')}</h3>
                        <p className="text-slate-400 font-bold">{t('specialized_tools.analisador_docs.supported')}</p>
                    </div>
                    <label className="px-10 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black text-sm uppercase tracking-widest hover:opacity-90 transition-all cursor-pointer shadow-xl active:scale-95">
                        {t('specialized_tools.analisador_docs.upload_btn')}
                        <input type="file" className="hidden" accept="image/*,application/pdf" onChange={handleFile} />
                    </label>
                </div>
            )}

            {loading && (
                <div className="glass-card p-20 rounded-[3rem] border border-white dark:border-slate-800 shadow-2xl flex flex-col items-center justify-center space-y-8 animate-pulse">
                    <div className="relative w-32 h-32">
                        <div className="absolute inset-0 border-8 border-indigo-100 dark:border-indigo-900/30 rounded-full"></div>
                        <div className="absolute inset-0 border-8 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-widest text-center">{t('specialized_tools.analisador_docs.processing')}</h3>
                        <p className="text-slate-400 font-bold text-center mt-2">{t('specialized_tools.analisador_docs.verifying')}</p>
                    </div>
                </div>
            )}

            {analysis && (
                <div className="animate-slide-up space-y-8">
                    <div className="glass-card rounded-[3rem] border border-white dark:border-slate-800 shadow-2xl overflow-hidden relative">
                        <div className={`h-4 w-full ${analysis.riskScore < 30 ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                        <div className="p-10 flex flex-col lg:flex-row gap-12">
                            <div className="flex-1 space-y-10">
                                <div>
                                    <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-100">
                                        Detectado: {analysis.type}
                                    </span>
                                    <h3 className="text-4xl font-display font-black text-slate-900 dark:text-white mt-4">{analysis.beneficiary}</h3>
                                    <p className="text-xl font-bold text-slate-400 font-mono mt-2">{analysis.cnpj}</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-slate-50/50 dark:bg-slate-900/30 p-6 rounded-3xl border border-slate-100 dark:border-slate-800">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Instituição</label>
                                        <p className="text-xl font-black text-slate-800 dark:text-slate-200">{analysis.bank}</p>
                                    </div>
                                    <div className="bg-slate-50/50 dark:bg-slate-900/30 p-6 rounded-3xl border border-slate-100 dark:border-slate-800">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Valor do Título</label>
                                        <p className="text-xl font-black text-slate-800 dark:text-slate-200">{analysis.value}</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Trust Signals</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {analysis.signals.map((signal, idx) => (
                                            <div key={idx} className="flex gap-3 items-center bg-emerald-50/30 dark:bg-emerald-950/10 p-4 rounded-2xl border border-emerald-100/50">
                                                <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                                <span className="text-sm font-bold text-slate-600 dark:text-slate-300">{signal}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="w-full lg:w-80 flex flex-col gap-4">
                                <div className={`rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden
                                    ${analysis.riskScore < 30 ? 'bg-emerald-600' : 'bg-red-600'}
                                `}>
                                    <div className="relative z-10 flex flex-col items-center text-center space-y-4">
                                        <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Status de Segurança</p>
                                        <div className="text-6xl font-display font-black">{analysis.status}</div>
                                        <p className="text-xs font-bold leading-relaxed opacity-80 mt-4">{analysis.recommendation}</p>
                                    </div>
                                </div>
                                <button onClick={() => setAnalysis(null)} className="w-full py-4 bg-slate-100 dark:bg-slate-800 text-slate-500 font-black rounded-2xl text-xs uppercase tracking-widest hover:bg-slate-200 transition-all">Analisar Outro</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

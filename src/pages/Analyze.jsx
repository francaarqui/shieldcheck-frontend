import React, { useState, useEffect, useRef, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import Tesseract from 'tesseract.js';
import { API_ENDPOINTS } from '../api/config';
import { jsPDF } from 'jspdf';

export default function Analyze() {
    const { user } = useContext(AuthContext);
    const [content, setContent] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const fileInputRef = useRef(null);
    const audioInputRef = useRef(null);
    const videoInputRef = useRef(null);
    const [isProcessingMedia, setIsProcessingMedia] = useState(false);
    const [processingStatus, setProcessingStatus] = useState('');
    const [ocrProgress, setOcrProgress] = useState(0);
    const [extractedSource, setExtractedSource] = useState(null);

    const [analysisCount, setAnalysisCount] = useState(0);
    const [showPremiumModal, setShowPremiumModal] = useState(false);
    const MAX_FREE_ANALYSES = 3;

    useEffect(() => {
        if (user?.plan === 'FREE') {
            const storedCount = localStorage.getItem(`shieldcheck_count_${user.id}`);
            const storedDate = localStorage.getItem(`shieldcheck_date_${user.id}`);
            const today = new Date().toDateString();
            if (storedDate === today && storedCount) setAnalysisCount(parseInt(storedCount, 10));
            else {
                localStorage.setItem(`shieldcheck_date_${user.id}`, today);
                localStorage.setItem(`shieldcheck_count_${user.id}`, '0');
                setAnalysisCount(0);
            }
        }
    }, [user]);

    const handleAnalyze = async (textToAnalyze = content) => {
        const cleanText = textToAnalyze.trim();
        if (!cleanText) return;
        if (user?.plan === 'FREE' && analysisCount >= MAX_FREE_ANALYSES) return setShowPremiumModal(true);

        setIsLoading(true);
        setResult(null);
        setError(null);

        try {
            const response = await fetch(API_ENDPOINTS.ANALYZE, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({ content: cleanText, type: extractedSource ? 'media' : 'text' }),
            });

            if (response.status === 429) {
                setShowPremiumModal(true);
                throw new Error('Cota diária atingida.');
            }
            if (!response.ok) throw new Error('Falha no motor de processamento.');
            const data = await response.json();
            setResult(data);

            if (user?.plan === 'FREE') {
                const newCount = analysisCount + 1;
                setAnalysisCount(newCount);
                localStorage.setItem(`shieldcheck_count_${user.id}`, newCount.toString());
            }
        } catch (err) {
            setError('Instabilidade no motor de IA. Tente novamente em alguns segundos.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setIsProcessingMedia(true);
        setProcessingStatus('Reconhecendo Padrões Visuais...');
        try {
            const { data: { text } } = await Tesseract.recognize(file, 'por+eng', { logger: m => m.status === 'recognizing text' && setOcrProgress(Math.round(m.progress * 100)) });
            const cleanedText = text.replace(/\n\s*\n/g, '\n').trim();
            if (!cleanedText) throw new Error('Nenhum texto detectado.');
            setContent(cleanedText);
            setExtractedSource('Imagem');
            handleAnalyze(cleanedText);
        } catch (err) {
            setError('A imagem parece estar ilegível para o motor OCR.');
        } finally {
            setIsProcessingMedia(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const handleMediaUpload = async (file, type) => {
        setIsProcessingMedia(true);
        setProcessingStatus(type === 'audio' ? 'Decodificando Áudio...' : 'Decomponendo Vídeo...');
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('type', type);

            const res = await fetch(API_ENDPOINTS.ANALYZE_MEDIA, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${user.token}` },
                body: formData
            });
            if (res.status === 429) {
                setShowPremiumModal(true);
                throw new Error('Cota diária atingida.');
            }
            if (!res.ok) throw new Error();
            const data = await res.json();
            setContent(data.transcribedText);
            setExtractedSource(type === 'audio' ? 'Áudio' : 'Vídeo');
            setResult(data);
        } catch (err) {
            setError(`Erro ao transcrever arquivo de ${type}.`);
        } finally {
            setIsProcessingMedia(false);
        }
    };

    const generateReport = () => {
        if (!result) return;
        const doc = new jsPDF();

        // Branded Header
        doc.setFillColor(15, 23, 42); // slate-900
        doc.rect(0, 0, 210, 40, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(22);
        doc.text('SHIELDCHECK AI - RELATÓRIO DE SEGURANÇA', 20, 25);

        // Status Bar
        const statusColor = result.score > 60 ? [220, 38, 38] : result.score > 30 ? [245, 158, 11] : [16, 185, 129];
        doc.setFillColor(...statusColor);
        doc.rect(20, 50, 170, 15, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(12);
        doc.text(`VEREDITO: ${result.status.toUpperCase()} | ÍNDICE DE RISCO: ${result.score}%`, 30, 60);

        // Body
        doc.setTextColor(30, 41, 59); // slate-800
        doc.setFontSize(14);
        doc.text('Sumário da Análise:', 20, 85);
        doc.setFontSize(10);
        const splitSummary = doc.splitTextToSize(result.summary || '', 170);
        doc.text(splitSummary, 20, 95);

        // Recommendation
        doc.setFillColor(248, 250, 252); // slate-50
        doc.rect(20, 130, 170, 30, 'F');
        doc.setTextColor(79, 70, 229); // indigo-600
        doc.setFontSize(12);
        doc.text('Protocolo de Segurança Recomendado:', 25, 140);
        doc.setTextColor(30, 41, 59);
        doc.setFontSize(10);
        const splitRec = doc.splitTextToSize(result.recommendation || '', 160);
        doc.text(splitRec, 25, 150);

        // Footer
        doc.setFontSize(8);
        doc.setTextColor(148, 163, 184);
        doc.text(`Gerado em: ${new Date().toLocaleString()} | shieldcheckai.com`, 20, 280);

        doc.save(`ShieldCheck_Relatorio_${Date.now()}.pdf`);
    };

    return (
        <div className="animate-slide-up max-w-5xl mx-auto space-y-12 pb-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div className="flex-1">
                    <h2 className="text-4xl font-display font-black text-slate-900 dark:text-white tracking-tight">
                        Nova <span className="text-premium-gradient">Análise AI</span>
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg font-medium">Copie e cole qualquer mensagem suspeita ou faça upload de um print para ver o risco.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Input Section */}
                <div className="lg:col-span-12 space-y-6">
                    <div className="glass-card p-8 rounded-[2.5rem] border border-white dark:border-slate-800 shadow-xl relative overflow-hidden transition-all duration-300">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>

                        <div className="space-y-6 relative z-10">
                            <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                                Conteúdo da Mensagem
                            </h3>

                            {extractedSource && (
                                <div className="flex justify-between items-center px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest">
                                    <span>Fonte Detectada: {extractedSource}</span>
                                    <button onClick={() => { setContent(''); setExtractedSource(null); setResult(null); }} className="text-indigo-300 hover:text-white underline">Descartar</button>
                                </div>
                            )}

                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="Ex: Oi mãe, mudei de número. Preciso que você pague um boleto de R$ 980 pra mim agora, é urgente!"
                                className="w-full h-48 p-6 bg-slate-50/50 dark:bg-slate-950/50 border-2 border-slate-100 dark:border-slate-800 rounded-2xl focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/20 focus:border-indigo-500 outline-none transition-all text-slate-800 dark:text-slate-200 font-medium placeholder:text-slate-400"
                            />

                            <div className="flex flex-col lg:flex-row gap-6 items-center">
                                <div className="flex gap-3 w-full lg:w-auto">
                                    <input type="file" className="hidden" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" />
                                    <input type="file" className="hidden" ref={audioInputRef} onChange={(e) => handleMediaUpload(e.target.files[0], 'audio')} accept="audio/*" />
                                    <input type="file" className="hidden" ref={videoInputRef} onChange={(e) => handleMediaUpload(e.target.files[0], 'video')} accept="video/*" />

                                    <button onClick={() => fileInputRef.current.click()} className="flex-1 lg:px-6 py-4 bg-white border border-slate-200 rounded-2xl flex flex-col items-center gap-1 hover:border-indigo-500 hover:text-indigo-600 transition-all group shadow-sm">
                                        <svg className="w-6 h-6 text-slate-400 group-hover:text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                        <span className="text-[10px] font-black uppercase tracking-tighter">Print</span>
                                    </button>
                                    <button onClick={() => audioInputRef.current.click()} className="flex-1 lg:px-6 py-4 bg-white border border-slate-200 rounded-2xl flex flex-col items-center gap-1 hover:border-indigo-500 hover:text-indigo-600 transition-all group shadow-sm">
                                        <svg className="w-6 h-6 text-slate-400 group-hover:text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                                        <span className="text-[10px] font-black uppercase tracking-tighter">Áudio</span>
                                    </button>
                                    <button onClick={() => videoInputRef.current.click()} className="flex-1 lg:px-6 py-4 bg-white border border-slate-200 rounded-2xl flex flex-col items-center gap-1 hover:border-indigo-500 hover:text-indigo-600 transition-all group shadow-sm">
                                        <svg className="w-6 h-6 text-slate-400 group-hover:text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 00-2 2z" /></svg>
                                        <span className="text-[10px] font-black uppercase tracking-tighter">Vídeo</span>
                                    </button>
                                </div>

                                <button
                                    onClick={() => handleAnalyze()}
                                    disabled={isLoading || isProcessingMedia || !content.trim()}
                                    className="w-full lg:flex-1 h-20 bg-slate-900 text-white font-black rounded-3xl hover:bg-black transition-all shadow-xl shadow-slate-200 disabled:opacity-50 flex items-center justify-center gap-4 text-xl hover-lift"
                                >
                                    {isLoading || isProcessingMedia ? (
                                        <><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div> {processingStatus || 'Processando IA...'}</>
                                    ) : (
                                        <>Executar Varredura</>
                                    )}
                                </button>
                            </div>

                            {user?.plan === 'FREE' && (
                                <div className="flex items-center justify-center gap-8 py-4 border-t border-slate-100">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Limite Diário Grátis:</p>
                                    <div className="flex gap-1.5">
                                        {[...Array(MAX_FREE_ANALYSES)].map((_, i) => (
                                            <div key={i} className={`w-3 h-3 rounded-full ${i < analysisCount ? 'bg-indigo-200' : 'bg-indigo-500 animate-pulse'}`}></div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Analysis Results */}
                {isLoading ? (
                    <div className="lg:col-span-12">
                        <div className="glass-card p-20 rounded-[3rem] border border-indigo-100 dark:border-indigo-900/30 flex flex-col items-center justify-center space-y-8 relative overflow-hidden">
                            <div className="absolute inset-0 bg-mesh opacity-20"></div>
                            <div className="scan-line animate-scan"></div>

                            <div className="relative">
                                <div className="w-32 h-32 border-8 border-indigo-50 dark:border-indigo-900/20 border-t-indigo-600 rounded-full animate-spin"></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <svg className="w-12 h-12 text-indigo-600 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                                </div>
                            </div>

                            <div className="text-center space-y-2 relative z-10">
                                <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Motor Heurístico Ativo</h3>
                                <p className="text-slate-500 dark:text-slate-400 font-bold animate-pulse">Decompondo padrões de engenharia social...</p>
                            </div>
                        </div>
                    </div>
                ) : result && (
                    <div className="lg:col-span-12 animate-slide-up">
                        <div className="glass-card rounded-[3rem] border border-white dark:border-slate-800 shadow-2xl overflow-hidden relative">
                            <div className={`h-4 w-full ${result.score > 60 ? 'bg-red-500' : result.score > 30 ? 'bg-amber-500' : 'bg-emerald-500'}`}></div>

                            <div className="p-10 flex flex-col lg:flex-row gap-12">
                                {/* Risk Gauge */}
                                <div className="flex flex-col items-center justify-center space-y-4">
                                    <div className={`w-48 h-48 rounded-[2.5rem] flex flex-col items-center justify-center border-4 shadow-2xl relative transition-all duration-500 transform hover:scale-105
                                        ${result.score > 60 ? 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400 shadow-red-100 dark:shadow-none' :
                                            result.score > 30 ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/30 text-amber-600 dark:text-amber-400 shadow-amber-100 dark:shadow-none' :
                                                'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/30 text-emerald-600 dark:text-emerald-400 shadow-emerald-100 dark:shadow-none'}
                                    `}>
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Risk Score</p>
                                        <p className="text-8xl font-display font-black leading-none">{result.score}</p>
                                        <p className="text-xs font-bold mt-2">{result.status}</p>
                                    </div>

                                    {user?.plan === 'PREMIUM' && (
                                        <button
                                            onClick={generateReport}
                                            className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black text-sm uppercase tracking-widest hover:opacity-90 transition-all shadow-xl flex items-center justify-center gap-2"
                                        >
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                            Exportar PDF
                                        </button>
                                    )}
                                </div>

                                {/* Details */}
                                <div className="flex-1 space-y-10">
                                    <div className="space-y-4">
                                        <h4 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Sinais Detectados</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {result.signals.map((signal, idx) => (
                                                <div key={idx} className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                                                    <div className={`w-2 h-2 rounded-full ${result.score > 60 ? 'bg-red-500' : 'bg-amber-500'}`}></div>
                                                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{signal}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="p-8 bg-indigo-50 dark:bg-indigo-900/30 rounded-[2rem] border border-indigo-100 dark:border-indigo-900/30 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-4 opacity-10">
                                            <svg className="w-20 h-20 text-indigo-600" fill="currentColor" viewBox="0 0 24 24"><path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm-1-5h2v2h-2v-2zm0-8h2v6h-2V7z" /></svg>
                                        </div>
                                        <h4 className="text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-3">Recomendação Especialista</h4>
                                        <p className="text-slate-800 dark:text-slate-200 font-bold text-lg leading-relaxed relative z-10">{result.recommendation}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {error && (
                <div className="p-6 bg-red-50 border-2 border-red-100 rounded-3xl text-red-600 font-bold flex items-center gap-4 animate-bounce mx-auto max-w-xl">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                    <p>{error}</p>
                </div>
            )}

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
                                <h3 className="text-3xl font-black text-slate-900 tracking-tight">Cota Diária Atingida</h3>
                                <p className="text-slate-500 font-medium leading-relaxed">
                                    Você atingiu o limite de <span className="text-indigo-600 font-bold">3 análises gratuitas</span> por dia. O que acha de navegar sem limites?
                                </p>
                            </div>

                            <div className="bg-slate-50 rounded-2xl p-6 text-left space-y-3 border border-slate-100">
                                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Vantagens Premium:</p>
                                <div className="flex items-center gap-3 text-slate-700 font-bold text-sm">
                                    <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                    Análises Ilimitadas (Texto/Link)
                                </div>
                                <div className="flex items-center gap-3 text-slate-700 font-bold text-sm">
                                    <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                    Prioridade na fila da Inteligência
                                </div>
                                <div className="flex items-center gap-3 text-slate-700 font-bold text-sm">
                                    <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                    Histórico Avançado Permanente
                                </div>
                            </div>

                            <div className="flex flex-col gap-3">
                                <Link
                                    to="/plans"
                                    className="w-full bg-slate-900 text-white font-black py-4 rounded-2xl hover:bg-black transition-all shadow-lg text-lg"
                                    onClick={() => setShowPremiumModal(false)}
                                >
                                    Ficar Premium Agora
                                </Link>
                                <button
                                    onClick={() => setShowPremiumModal(false)}
                                    className="text-slate-400 font-bold text-sm hover:text-slate-600 transition-colors"
                                >
                                    Talvez mais tarde
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

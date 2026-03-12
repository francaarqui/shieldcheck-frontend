import React, { useState, useEffect, useRef, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import Tesseract from 'tesseract.js';
import { API_ENDPOINTS } from '../api/config';

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
    const MAX_FREE_ANALYSES = 5;

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

    return (
        <div className="animate-slide-up max-w-5xl mx-auto space-y-12 pb-10">
            <div className="text-center space-y-4">
                <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-xs font-black uppercase tracking-widest border border-indigo-100">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                    </span>
                    Shield Intelligence Center
                </span>
                <h2 className="text-5xl font-display font-black text-slate-900 tracking-tight">
                    Blindagem <span className="text-premium-gradient">Multimodal</span>
                </h2>
                <p className="text-slate-500 text-lg max-w-2xl mx-auto font-medium leading-relaxed">
                    Nossa IA analisa padrões de golpes em textos, links, prints, áudios e vídeos em tempo real.
                </p>
            </div>

            <div className="glass-card rounded-[2.5rem] p-8 md:p-10 border border-white shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl -mr-20 -mt-20 opacity-40"></div>

                <div className="relative z-10 space-y-8">
                    {extractedSource && (
                        <div className="flex justify-between items-center px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest">
                            <span>Fonte Detectada: {extractedSource}</span>
                            <button onClick={() => { setContent(''); setExtractedSource(null); setResult(null); }} className="text-indigo-300 hover:text-white underline">Descartar</button>
                        </div>
                    )}

                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="w-full h-48 bg-slate-50/50 border-2 border-slate-100/50 rounded-3xl p-6 text-slate-800 focus:outline-none focus:border-indigo-500/50 focus:bg-white transition-all font-semibold text-lg placeholder:text-slate-300 shadow-inner"
                        placeholder="Cole o link suspeito, relate o ocorrido ou envie um arquivo abaixo..."
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

            {error && (
                <div className="p-6 bg-red-50 border-2 border-red-100 rounded-3xl text-red-600 font-bold flex items-center gap-4 animate-bounce mx-auto max-w-xl">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                    <p>{error}</p>
                </div>
            )}

            {/* AI RESULTS EXPERT VIEW */}
            {result && (
                <div className="animate-slide-up bg-white rounded-[3rem] p-8 md:p-12 border border-slate-100 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-1/2 h-full bg-slate-50/50 skew-x-12 translate-x-1/2"></div>

                    <div className="relative z-10 flex flex-col lg:flex-row gap-16">
                        <div className="w-full lg:w-1/3 flex flex-col items-center justify-center">
                            <div className={`w-64 h-64 rounded-full border-[16px] flex flex-col items-center justify-center shadow-xl mb-10
                                ${result.score > 60 ? 'border-red-500/10 bg-red-50 text-red-600' :
                                    result.score > 30 ? 'border-amber-400/10 bg-amber-50 text-amber-600' : 'border-emerald-500/10 bg-emerald-50 text-emerald-600'}
                            `}>
                                <span className="text-8xl font-display font-black leading-none">{result.score}</span>
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] mt-2 opacity-60">Risk Index</span>
                            </div>

                            <div className={`px-6 py-3 rounded-2xl text-center shadow-sm w-full font-black uppercase tracking-widest border-2
                                ${result.score > 60 ? 'bg-red-600 text-white border-red-700' :
                                    result.score > 30 ? 'bg-amber-500 text-white border-amber-600' : 'bg-emerald-600 text-white border-emerald-700'}
                            `}>
                                {result.status}
                            </div>
                        </div>

                        <div className="flex-1 space-y-10">
                            <div className="space-y-4">
                                <h3 className="text-3xl font-display font-black text-slate-900 border-b-4 border-indigo-500 pb-2 inline-block">Sumário da Inteligência</h3>
                                <p className="text-xl text-slate-600 font-medium leading-relaxed leading-relaxed">{result.summary || "Nenhuma descrição detalhada fornecida pelo motor de análise."}</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {result.signals && result.signals.map((signal, idx) => (
                                    <div key={idx} className="flex gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-100 items-start group hover:bg-white hover:shadow-md transition-all">
                                        <div className={`mt-1 p-1 rounded-md ${result.score > 30 ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}`}>
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        </div>
                                        <p className="text-sm font-bold text-slate-700 leading-tight">{signal}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="p-8 rounded-[2rem] bg-slate-900 text-white shadow-2xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
                                <h4 className="font-black text-xl mb-3 flex items-center gap-2">
                                    <svg className="w-6 h-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                    Protocolo de Segurança
                                </h4>
                                <p className="text-indigo-100/80 font-medium text-lg italic leading-relaxed">"{result.recommendation}"</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

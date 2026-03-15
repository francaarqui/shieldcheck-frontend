import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { API_ENDPOINTS } from '../api/config';

export default function DeepfakeLab() {
    const { user } = useContext(AuthContext);
    const [currentStep, setCurrentStep] = useState(0); // 0: intro, 1: challenge, 2: result
    const [scenarios, setScenarios] = useState([]);
    const [currentChallenge, setCurrentChallenge] = useState(0);
    const [userChoice, setUserChoice] = useState(null);
    const [score, setScore] = useState(0);
    const [showExplanation, setShowExplanation] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isCalling, setIsCalling] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);

    useEffect(() => {
        fetchScenarios();
    }, []);

    const fetchScenarios = async () => {
        try {
            const res = await fetch(API_ENDPOINTS.ACADEMY_AUDIO_SCENARIOS);
            const data = await res.json();
            setScenarios(data);
        } catch (err) {
            console.error('Error fetching scenarios:', err);
        } finally {
            setLoading(false);
        }
    };

    const playAudio = () => {
        if (!scenarios[currentChallenge]) return;

        setIsSpeaking(true);
        const utterance = new SpeechSynthesisUtterance(scenarios[currentChallenge].script);
        utterance.lang = scenarios[currentChallenge].id === 3 ? 'en-US' : 'pt-BR';
        utterance.rate = 0.95; // Slightly slower can feel more "calculated" or "robotic" depending on voice

        utterance.onend = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utterance);
    };

    const handleChoice = (choice) => {
        const challenge = scenarios[currentChallenge];
        setUserChoice(choice);
        if (choice === challenge.isSynthetic) {
            setScore(prev => prev + 1);
        }
        setShowExplanation(true);
    };

    const nextChallenge = () => {
        if (currentChallenge < scenarios.length - 1) {
            setCurrentChallenge(prev => prev + 1);
            setUserChoice(null);
            setShowExplanation(false);
            setIsCalling(false);
        } else {
            setCurrentStep(2);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
            <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    const challenge = scenarios[currentChallenge];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 transition-colors duration-300">
            <div className="max-w-4xl mx-auto">
                {/* Header Navigation */}
                <div className="flex justify-between items-center mb-12">
                    <Link to="/academy" className="text-sm font-black text-slate-400 hover:text-indigo-500 transition-colors flex items-center gap-2 uppercase tracking-widest">
                        ← Academy
                    </Link>
                    <div className="bg-indigo-600/10 text-indigo-600 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border border-indigo-100 dark:border-indigo-900/30">
                        Deepfake Audio Lab 2.0
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {currentStep === 0 && (
                        <motion.div
                            key="intro"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="glass-card p-12 rounded-[4rem] border border-white dark:border-slate-800 shadow-2xl text-center space-y-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl"
                        >
                            <div className="relative mx-auto w-32 h-32">
                                <motion.div
                                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.2, 0.5] }}
                                    transition={{ repeat: Infinity, duration: 2 }}
                                    className="absolute inset-0 bg-indigo-500 rounded-full blur-2xl"
                                />
                                <div className="relative w-full h-full bg-premium-gradient rounded-[2.5rem] flex items-center justify-center text-5xl shadow-2xl">🎙️</div>
                            </div>

                            <div className="space-y-4">
                                <h1 className="text-5xl font-display font-black text-slate-900 dark:text-white tracking-tighter">Sintético ou Humano?</h1>
                                <p className="text-slate-500 dark:text-slate-400 text-xl font-medium max-w-xl mx-auto leading-relaxed">
                                    A clonagem de voz por IA agora leva segundos. Treine sua percepção auditiva em simulações de alta pressão.
                                </p>
                            </div>

                            <button
                                onClick={() => setCurrentStep(1)}
                                className="h-20 px-16 bg-premium-gradient text-white rounded-[2rem] font-black uppercase tracking-widest shadow-2xl hover:scale-105 active:scale-95 transition-all text-lg"
                            >
                                Entrar no Laboratório
                            </button>
                        </motion.div>
                    )}

                    {currentStep === 1 && (
                        <motion.div
                            key="challenge"
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-8"
                        >
                            {/* Progress Info */}
                            <div className="flex justify-between items-end px-4">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Amostra {currentChallenge + 1} de {scenarios.length}</p>
                                <div className="flex gap-2">
                                    {scenarios.map((_, i) => (
                                        <div key={i} className={`w-12 h-1.5 rounded-full transition-all duration-500 ${i <= currentChallenge ? 'bg-indigo-600 shadow-[0_0_10px_rgba(79,70,229,0.5)]' : 'bg-slate-200 dark:bg-slate-800'}`}></div>
                                    ))}
                                </div>
                            </div>

                            {/* Challenge UI: Call Simulation */}
                            <div className="glass-card p-12 rounded-[4rem] border border-white dark:border-slate-800 shadow-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl relative overflow-hidden">
                                {!isCalling ? (
                                    <div className="text-center space-y-10">
                                        <div className="p-8 bg-indigo-50/50 dark:bg-indigo-950/20 rounded-[2.5rem] border border-indigo-100 dark:border-indigo-800/30">
                                            <div className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-4">Novo Alerta de Chamada</div>
                                            <h3 className="text-3xl font-black text-slate-800 dark:text-white leading-tight">Um número desconhecido está ligando para você...</h3>
                                        </div>
                                        <button
                                            onClick={() => {
                                                setIsCalling(true);
                                                setTimeout(playAudio, 1500);
                                            }}
                                            className="w-32 h-32 bg-emerald-500 text-white rounded-full flex items-center justify-center text-4xl shadow-2xl shadow-emerald-500/30 hover:scale-110 active:scale-90 transition-all mx-auto animate-pulse"
                                        >
                                            📞
                                        </button>
                                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Clique para Atender e Analisar</p>
                                    </div>
                                ) : (
                                    <div className="space-y-12">
                                        {/* Call Interface */}
                                        <div className="flex flex-col items-center gap-6">
                                            <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-3xl shadow-inner border-4 border-white dark:border-slate-700">👤</div>
                                            <div className="text-center">
                                                <h4 className="text-2xl font-black text-slate-900 dark:text-white">Número Desconhecido</h4>
                                                <p className="text-emerald-500 font-mono font-bold mt-1">EM CHAMADA...</p>
                                            </div>
                                            {/* Audio Visualization */}
                                            <div className="h-16 flex items-center gap-1.5">
                                                {[...Array(24)].map((_, i) => (
                                                    <motion.div
                                                        key={i}
                                                        animate={{ height: isSpeaking ? [10, 40, 10] : 10 }}
                                                        transition={{ repeat: Infinity, duration: 0.5 + Math.random(), delay: i * 0.05 }}
                                                        className={`w-1.5 rounded-full ${isSpeaking ? 'bg-indigo-500' : 'bg-slate-200 dark:bg-slate-700'}`}
                                                    />
                                                ))}
                                            </div>
                                        </div>

                                        {!showExplanation ? (
                                            <div className="grid grid-cols-2 gap-6 pt-10 border-t border-slate-100 dark:border-slate-800">
                                                <button
                                                    onClick={() => handleChoice(false)}
                                                    className="h-24 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-3xl flex flex-col items-center justify-center hover:border-emerald-500 hover:bg-emerald-50/10 transition-all group shadow-sm"
                                                >
                                                    <span className="text-3xl mb-1">👨‍💼</span>
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover:text-emerald-600 transition-colors">Voz Humana</span>
                                                </button>
                                                <button
                                                    onClick={() => handleChoice(true)}
                                                    className="h-24 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-3xl flex flex-col items-center justify-center hover:border-red-500 hover:bg-red-50/10 transition-all group shadow-sm"
                                                >
                                                    <span className="text-3xl mb-1">🤖</span>
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover:text-red-600 transition-colors">Voz de IA (Deepfake)</span>
                                                </button>
                                                <button
                                                    onClick={playAudio}
                                                    className="col-span-2 h-14 bg-slate-100 dark:bg-slate-950 text-slate-400 dark:text-slate-600 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:text-indigo-500 transition-colors"
                                                >
                                                    Ouvir Novamente 🔄
                                                </button>
                                            </div>
                                        ) : (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                className={`p-10 rounded-[3rem] border-2 shadow-2xl relative overflow-hidden ${userChoice === challenge.isSynthetic ? 'bg-emerald-50/50 border-emerald-200' : 'bg-red-50/50 border-red-200'}`}
                                            >
                                                <div className="absolute top-0 right-0 w-32 h-32 opacity-5 translate-x-8 -translate-y-8">
                                                    {userChoice === challenge.isSynthetic ? '✅' : '❌'}
                                                </div>
                                                <div className="flex items-center gap-6 mb-8">
                                                    <div className={`text-5xl ${userChoice === challenge.isSynthetic ? 'text-emerald-500' : 'text-red-500'}`}>
                                                        {userChoice === challenge.isSynthetic ? '✅' : '❌'}
                                                    </div>
                                                    <div>
                                                        <h4 className="text-2xl font-black text-slate-900 dark:text-white">{userChoice === challenge.isSynthetic ? 'Análise Correta!' : 'Análise Incorreta!'}</h4>
                                                        <p className="text-sm font-medium text-slate-500">A voz era {challenge.isSynthetic ? 'Sintética (Deepfake)' : 'Humana'}.</p>
                                                    </div>
                                                </div>

                                                <div className="space-y-4">
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Padrões de Identificação:</p>
                                                    <div className="flex flex-wrap gap-3">
                                                        {challenge.cues.map((cue, i) => (
                                                            <span key={i} className="px-5 py-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl text-xs font-bold text-slate-700 dark:text-slate-300 shadow-sm">
                                                                🔍 {cue}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>

                                                <button
                                                    onClick={nextChallenge}
                                                    className="w-full h-18 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black uppercase tracking-widest mt-10 shadow-xl hover:opacity-90 active:scale-95 transition-all"
                                                >
                                                    Próxima Simulação →
                                                </button>
                                            </motion.div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {currentStep === 2 && (
                        <motion.div
                            key="final"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="glass-card p-16 rounded-[4rem] bg-premium-gradient text-white text-center space-y-12 shadow-[0_30px_90px_rgba(99,102,241,0.5)]"
                        >
                            <div className="text-9xl animate-bounce">🏆</div>
                            <div className="space-y-4">
                                <h2 className="text-5xl font-display font-black tracking-tighter">Mestre da Percepção!</h2>
                                <p className="text-xl text-indigo-100 font-medium">Você concluiu o Laboratório de Áudio Nível 2.0.</p>
                            </div>

                            <div className="flex justify-center gap-16 ">
                                <div className="text-center">
                                    <p className="text-xs font-black text-indigo-300 uppercase tracking-widest mb-2">Precisão</p>
                                    <p className="text-6xl font-black">{Math.round((score / scenarios.length) * 100)}%</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-xs font-black text-indigo-300 uppercase tracking-widest mb-2">XP Ganho</p>
                                    <p className="text-6xl font-black text-amber-400">+{score * 500}</p>
                                </div>
                            </div>

                            <Link
                                to="/academy"
                                className="inline-flex h-20 px-16 bg-white text-indigo-600 rounded-[2rem] font-black uppercase tracking-widest shadow-2xl hover:scale-105 active:scale-95 transition-all text-lg items-center justify-center"
                            >
                                Reivindicar Certificação
                            </Link>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

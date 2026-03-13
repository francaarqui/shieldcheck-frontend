import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { API_ENDPOINTS } from '../api/config';

export default function Academy() {
    const { user, updateUserPoints } = useContext(AuthContext);
    const [questions, setQuestions] = useState([]);
    const [currentScenário, setCurrentCenario] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [hasAnswered, setHasAnswered] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [totalGained, setTotalGained] = useState(0);
    const [loading, setLoading] = useState(true);

    React.useEffect(() => {
        const fetchQuizzes = async () => {
            if (!user?.token) return;
            try {
                const res = await fetch(API_ENDPOINTS.ACADEMY_QUIZZES, {
                    headers: { 'Authorization': `Bearer ${user.token}` }
                });
                if (res.ok) setQuestions(await res.json());
            } catch (err) {
                console.error("Erro ao carregar treinamentos", err);
            } finally {
                setLoading(false);
            }
        };
        fetchQuizzes();
    }, [user?.token]);

    if (loading) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
                <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
                <p className="text-slate-400 font-black uppercase tracking-[0.2em] text-xs animate-pulse">Carregando Simulador...</p>
            </div>
        );
    }

    if (questions.length === 0) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center text-center px-4">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-300 mb-4">
                    <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18c-2.305 0-4.408.867-6 2.292m0-14.25v14.25" /></svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900">Nenhum treinamento disponível</h3>
                <p className="text-slate-500 max-w-xs mt-2">Novos cenários são adicionados semanalmente pelo nosso time de inteligência.</p>
            </div>
        );
    }

    if (currentScenário >= questions.length) {
        return (
            <div className="animate-slide-up max-w-3xl mx-auto h-[70vh] flex flex-col items-center justify-center text-center space-y-8">
                <div className="relative">
                    <div className="absolute inset-0 bg-amber-400 blur-2xl opacity-20 animate-pulse"></div>
                    <div className="relative w-32 h-32 bg-gradient-to-tr from-amber-400 to-yellow-300 text-white rounded-full flex items-center justify-center shadow-xl shadow-amber-100">
                        <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.25c-2.782 0-5.389.955-7.461 2.564A11.967 11.967 0 005.25 12c0 2.213.598 4.288 1.644 6.068a12.03 12.03 0 0010.212 0c1.046-1.78 1.644-3.855 1.644-6.068 0-3.328-1.353-6.34-3.542-8.516z" /></svg>
                    </div>
                </div>
                <div className="space-y-4">
                    <h2 className="text-5xl font-display font-black text-slate-900">Módulos Concluídos!</h2>
                    <p className="text-xl text-slate-500 font-medium">Sua proficiência em detecção de fraudes aumentou significativamente.</p>
                </div>
                <div className="glass-card p-8 rounded-[2rem] w-full border border-white shadow-lg">
                    <p className="text-sm font-black text-slate-400 uppercase tracking-widest mb-1">XP Acumulado na Sessão</p>
                    <p className="text-6xl font-display font-black text-premium-gradient">+{totalGained} XP</p>
                </div>
                <button onClick={() => window.location.href = '/dashboard'} className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black shadow-xl hover:bg-black transition-all hover-lift">
                    Voltar para Central de Comando
                </button>
            </div>
        );
    }

    const question = questions[currentScenário];
    const handleAnswerSubmit = async () => {
        if (selectedOption === null || submitting) return;
        const option = question.options[selectedOption];
        setHasAnswered(true);

        if (option.isCorrect) {
            setSubmitting(true);
            try {
                const res = await fetch(API_ENDPOINTS.ACADEMY_SUBMIT, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${user.token}` },
                    body: JSON.stringify({ isCorrect: true, pointsAwarded: question.points })
                });
                if (res.ok) {
                    const data = await res.json();
                    setTotalGained(prev => prev + data.pointsAwarded);
                    if (updateUserPoints) updateUserPoints(user.points + data.pointsAwarded);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setSubmitting(false);
            }
        }
    };

    const nextScenario = () => {
        setHasAnswered(false);
        setSelectedOption(null);
        setCurrentCenario(prev => prev + 1);
    };

    return (
        <div className="animate-slide-up max-w-5xl mx-auto space-y-10 pb-20">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div className="space-y-3">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-amber-100 dark:border-amber-900/30">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18c-2.305 0-4.408.867-6 2.292m0-14.25v14.25" /></svg>
                        Simulador de Cenários Reais
                    </div>
                    <h2 className="text-4xl font-display font-black text-slate-900 dark:text-white tracking-tight leading-none">{question.title}</h2>
                </div>
                <div className="glass-card px-6 py-4 rounded-2xl flex flex-col items-end border border-white dark:border-slate-800">
                    <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Recompensa</span>
                    <span className="text-2xl font-display font-black text-amber-500">+{question.points} XP</span>
                </div>
            </div>

            <div className="glass-card rounded-[2.5rem] p-8 md:p-12 border border-white dark:border-slate-800 shadow-2xl space-y-10">
                <div className="relative">
                    <div className="absolute -left-6 top-0 bottom-0 w-1.5 bg-indigo-500 rounded-full shadow-[0_0_15px_rgba(99,102,241,0.5)]"></div>
                    <p className="text-2xl text-slate-700 dark:text-slate-200 font-medium italic leading-relaxed px-4">
                        "{question.context}"
                    </p>
                </div>

                <div className="space-y-4">
                    <h3 className="text-sm font-black text-slate-800 dark:text-slate-300 uppercase tracking-tighter mb-6">Qual sua conduta imediata?</h3>
                    <div className="grid grid-cols-1 gap-4">
                        {question.options.map((opt, idx) => {
                            const isSelected = selectedOption === idx;
                            let btnClass = "bg-slate-50 dark:bg-slate-900/50 border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 hover:border-indigo-300 hover:shadow-md";

                            if (hasAnswered) {
                                if (isSelected && opt.isCorrect) btnClass = "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-500 dark:border-emerald-500/50 text-emerald-900 dark:text-emerald-400 ring-4 ring-emerald-500/10";
                                else if (isSelected && !opt.isCorrect) btnClass = "bg-red-50 dark:bg-red-900/20 border-red-500 dark:border-red-500/50 text-red-900 dark:text-red-400 ring-4 ring-red-500/10";
                                else if (opt.isCorrect) btnClass = "bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-900/30 text-emerald-700 dark:text-emerald-500";
                                else btnClass = "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-300 dark:text-slate-600 opacity-60";
                            } else if (isSelected) {
                                btnClass = "bg-white dark:bg-slate-800 border-indigo-600 dark:border-indigo-500 text-indigo-900 dark:text-indigo-400 ring-4 ring-indigo-600/10 shadow-lg";
                            }

                            return (
                                <button
                                    key={idx}
                                    disabled={hasAnswered}
                                    onClick={() => setSelectedOption(idx)}
                                    className={`w-full text-left p-6 rounded-2xl border-2 transition-all font-bold text-lg flex items-center justify-between group ${btnClass}`}
                                >
                                    <span>{opt.text}</span>
                                    {hasAnswered && opt.isCorrect && <svg className="w-6 h-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                                    {hasAnswered && isSelected && !opt.isCorrect && <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {!hasAnswered ? (
                    <button
                        onClick={handleAnswerSubmit}
                        disabled={selectedOption === null || submitting}
                        className="w-full h-16 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black rounded-2xl hover:bg-black dark:hover:bg-slate-100 transition-all shadow-xl shadow-slate-200 dark:shadow-none disabled:opacity-50 disabled:cursor-not-allowed text-xl"
                    >
                        {submitting ? 'Sincronizando Resposta...' : 'Confirmar Decisão'}
                    </button>
                ) : (
                    <div className={`animate-slide-up p-8 rounded-[2.5rem] border-2 shadow-sm space-y-6 text-center
                        ${question.options[selectedOption].isCorrect ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/30' : 'bg-red-50 dark:bg-red-950/20 border-red-100 dark:border-red-900/30'}
                    `}>
                        <div className="space-y-2">
                            <h4 className={`text-4xl font-display font-black ${question.options[selectedOption].isCorrect ? 'text-emerald-900 dark:text-emerald-400' : 'text-red-900 dark:text-red-400'}`}>
                                {question.options[selectedOption].isCorrect ? 'Vítória Acadêmica!' : 'Falha Crítica!'}
                            </h4>
                            <p className={`text-xl font-bold ${question.options[selectedOption].isCorrect ? 'text-emerald-700 dark:text-emerald-500' : 'text-red-700 dark:text-red-500'}`}>
                                {question.options[selectedOption].feedback}
                            </p>
                        </div>
                        <button
                            onClick={nextScenario}
                            className={`w-full md:w-auto px-12 py-4 rounded-xl font-black text-lg transition-all shadow-md
                                ${question.options[selectedOption].isCorrect ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'bg-slate-900 dark:bg-white hover:bg-black dark:hover:bg-slate-100 text-white dark:text-slate-900'}
                            `}
                        >
                            Próxima Atividade
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

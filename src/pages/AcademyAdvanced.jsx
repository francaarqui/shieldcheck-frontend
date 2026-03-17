import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

export default function AcademyAdvanced() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [step, setStep] = useState(0);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);

    const levels = [
        {
            title: 'Nível 1: O Falso Suporte',
            description: 'Você recebe um e-mail urgente da "Netflix" dizendo que sua conta será suspensa.',
            image: '/scams/email_phishing.png',
            options: [
                { text: 'Clicar no botão "Atualizar Agora" para não perder acesso.', correct: false, reason: 'Botões de urgência extrema em e-mails não solicitados são sinais clássicos de phishing.' },
                { text: 'Verificar o endereço do remetente (ex: @netflix-support-security.com).', correct: true, reason: 'Domínios que tentam imitar o original mas possuem palavras extras são quase sempre falsos.' }
            ]
        },
        {
            title: 'Nível 2: O Golpe do PIX Agendado',
            description: 'Um suposto comprador envia um print de um PIX agendado e pede para você enviar o produto agora.',
            image: '/scams/pix_agendado.png',
            options: [
                { text: 'Enviar o produto, afinal o print parece legítimo.', correct: false, reason: 'PIX agendado pode ser cancelado a qualquer momento. Só confie no saldo na conta.' },
                { text: 'Aguardar o dinheiro cair efetivamente no saldo da conta.', correct: true, reason: 'Nunca entregue produtos ou serviços baseados em agendamentos ou prints.' }
            ]
        },
        {
            title: 'Nível 3: Deepfake de Voz',
            description: 'Seu "filho" liga chorando de um número desconhecido pedindo dinheiro urgente via PIX.',
            image: '/scams/voice_deepfake.png',
            options: [
                { text: 'Fazer o PIX imediatamente para ajudar.', correct: false, reason: 'Vozes podem ser clonadas por IA. Sempre confirme por outro canal ou faça uma pergunta pessoal.' },
                { text: 'Desligar e ligar para o número salvo do seu filho para confirmar.', correct: true, reason: 'Quebrar o fluxo do golpista e verificar a informação de forma independente é a melhor defesa.' }
            ]
        }
    ];

    const handleOption = (correct) => {
        if (correct) setScore(score + 1);
        if (step + 1 < levels.length) {
            setStep(step + 1);
        } else {
            setShowResult(true);
        }
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
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-yellow-50 dark:bg-yellow-950/30 text-yellow-600 dark:text-yellow-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-yellow-100 dark:border-yellow-900/30">
                    🎓 Advanced Scam Simulator
                </div>
                <h2 className="text-4xl lg:text-5xl font-display font-black text-slate-900 dark:text-white tracking-tight">
                    {t('specialized_tools.simulator_plus.title')}
                </h2>
                <p className="text-slate-500 dark:text-slate-400 text-lg font-medium max-w-2xl">
                    {t('specialized_tools.simulator_plus.subtitle')}
                </p>
            </div>

            {!showResult ? (
                <div className="glass-card rounded-[3rem] border border-white dark:border-slate-800 shadow-2xl overflow-hidden min-h-[500px] flex flex-col">
                    <div className="h-2 w-full bg-slate-100 dark:bg-slate-800">
                        <motion.div
                            className="h-full bg-indigo-600"
                            initial={{ width: 0 }}
                            animate={{ width: `${((step + 1) / levels.length) * 100}%` }}
                        />
                    </div>

                    <div className="p-10 lg:p-16 flex-1 flex flex-col lg:flex-row gap-12">
                        <div className="flex-1 space-y-8">
                            <div className="space-y-4">
                                <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 rounded-lg text-[10px] font-black uppercase tracking-widest border border-indigo-100 italic">Desafio {step + 1} de {levels.length}</span>
                                <h3 className="text-4xl font-display font-black text-slate-900 dark:text-white leading-tight">{levels[step].title}</h3>
                                <p className="text-xl font-medium text-slate-500 dark:text-slate-400 leading-relaxed">{levels[step].description}</p>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                {levels[step].options.map((opt, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleOption(opt.correct)}
                                        className="group p-8 bg-slate-50 dark:bg-slate-900/50 border-2 border-slate-100 dark:border-slate-800 rounded-3xl text-left hover:border-indigo-500 hover:bg-white dark:hover:bg-slate-900 transition-all shadow-sm hover:shadow-xl active:scale-[0.98] relative overflow-hidden"
                                    >
                                        <div className="relative z-10 flex items-center justify-between">
                                            <span className="text-lg font-bold text-slate-700 dark:text-slate-200 group-hover:text-indigo-600 transition-colors">{opt.text}</span>
                                            <div className="w-8 h-8 rounded-full border-2 border-slate-200 dark:border-slate-700 flex items-center justify-center group-hover:border-indigo-500 transition-all">
                                                <div className="w-4 h-4 rounded-full bg-indigo-600 opacity-0 group-hover:opacity-100 transition-all scale-0 group-hover:scale-100"></div>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="w-full lg:w-96 bg-slate-100 dark:bg-slate-950 rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center text-center space-y-6">
                            <div className="w-20 h-20 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200 dark:shadow-none rotate-12">
                                <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                            </div>
                            <div>
                                <h4 className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-sm mb-2">{t('specialized_tools.simulator_plus.think_enemy')}</h4>
                                <p className="text-sm font-medium text-slate-400">{t('specialized_tools.simulator_plus.advice')}</p>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="glass-card rounded-[3rem] p-16 text-center space-y-10 animate-scale-in">
                    <div className="relative inline-block">
                        <div className="absolute -inset-4 bg-indigo-500/20 rounded-full blur-2xl animate-pulse"></div>
                        <div className="w-32 h-32 bg-premium-gradient rounded-[2.5rem] flex items-center justify-center text-white text-5xl font-black shadow-2xl relative z-10 rotate-6">
                            {score}/{levels.length}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-4xl font-display font-black text-slate-900 dark:text-white italic">
                            {score === levels.length ? 'Escudo Impenetrável!' : score > 0 ? 'Bom Começo, Recruta!' : 'Vulnerabilidade Crítica!'}
                        </h3>
                        <p className="text-xl font-medium text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
                            {score === levels.length
                                ? 'Você demonstrou um nível excepcional de percepção. Continue afiado!'
                                : 'A engenharia social é sutil. Siga praticando para não ser uma vítima.'}
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button onClick={() => { setStep(0); setScore(0); setShowResult(false); }} className="px-10 py-5 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-500 transition-all shadow-xl uppercase tracking-widest text-sm">Reiniciar Treino</button>
                        <button onClick={() => navigate('/dashboard')} className="px-10 py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black rounded-2xl hover:opacity-90 transition-all shadow-xl uppercase tracking-widest text-sm">Voltar ao Centro de Comando</button>
                    </div>
                </div>
            )}
        </div>
    );
}

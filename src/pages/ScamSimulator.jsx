import React, { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import confetti from 'canvas-confetti';
import { AuthContext } from '../context/AuthContext';

const SCENARIOS = [
    {
        id: 1,
        source: 'WhatsApp',
        sender: '+55 11 98234-5678',
        content: 'Olá! Sou do suporte técnico do banco. Detectamos uma tentativa de acesso suspeita. Por favor, clique no link para validar seu dispositivo: http://banco-seguro-validacao.co/login',
        type: 'scam',
        explanation: 'Bancos nunca enviam links de validação por WhatsApp com domínios suspeitos como ".co".',
        difficulty: 'Fácil'
    },
    {
        id: 2,
        source: 'SMS',
        sender: '28445',
        content: 'PARABENS! Voce foi selecionado para uma vaga de emprego HOME OFFICE ganhando R$ 500 por dia. Entre em contato agora: https://wa.me/message/ABC123XYZ',
        type: 'scam',
        explanation: 'Ofertas de emprego milagrosas via SMS sem processo seletivo são 99% das vezes golpes de recrutamento.',
        difficulty: 'Fácil'
    },
    {
        id: 3,
        source: 'E-mail',
        sender: 'nota.fiscal@fazenda.gov.br',
        content: 'Prezado contribuinte, existe uma pendência em seu CPF. Visualize a nota fiscal em anexo para evitar multas.',
        type: 'scam',
        explanation: 'Órgãos do governo não enviam anexos executáveis ou links de cobrança direta por e-mail sem aviso prévio no portal oficial.',
        difficulty: 'Médio'
    },
    {
        id: 4,
        source: 'WhatsApp',
        sender: 'Mãe',
        content: 'Filho, troquei de número. Salva aí. Preciso pagar um boleto mas meu limite excedeu, consegue transferir R$ 800 pra mim? Te devolvo amanhã cedo.',
        type: 'scam',
        explanation: 'Clonagem de WhatsApp e "novo número" é um dos golpes mais comuns. Sempre peça uma chamada de voz ou vídeo para confirmar.',
        difficulty: 'Difícil'
    }
];

export default function ScamSimulator() {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [isCorrect, setIsCorrect] = useState(null);
    const [gameFinished, setGameFinished] = useState(false);

    const triggerConfetti = () => {
        const duration = 3 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        const randomInRange = (min, max) => Math.random() * (max - min) + min;

        const interval = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
        }, 250);
    };

    const generateCertificate = () => {
        const doc = new jsPDF({
            orientation: 'landscape',
            unit: 'mm',
            format: 'a4'
        });

        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();

        doc.setFillColor(10, 15, 30);
        doc.rect(0, 0, pageWidth, pageHeight, 'F');

        doc.setDrawColor(218, 165, 32);
        doc.setLineWidth(1.5);
        doc.rect(8, 8, pageWidth - 16, pageHeight - 16, 'D');

        doc.setDrawColor(184, 134, 11);
        doc.setLineWidth(0.5);
        doc.rect(10, 10, pageWidth - 20, pageHeight - 20, 'D');

        const cornerSize = 15;
        doc.setLineWidth(2);
        doc.line(8, 8 + cornerSize, 8, 8);
        doc.line(8, 8, 8 + cornerSize, 8);
        doc.line(pageWidth - 8 - cornerSize, 8, pageWidth - 8, 8);
        doc.line(pageWidth - 8, 8, pageWidth - 8, 8 + cornerSize);
        doc.line(8, pageHeight - 8 - cornerSize, 8, pageHeight - 8);
        doc.line(8, pageHeight - 8, 8 + cornerSize, pageHeight - 8);
        doc.line(pageWidth - 8 - cornerSize, pageHeight - 8, pageWidth - 8, pageHeight - 8);
        doc.line(pageWidth - 8, pageHeight - 8, pageWidth - 8, pageHeight - 8 - cornerSize);

        doc.setFillColor(99, 102, 241);
        doc.circle(pageWidth / 2, 35, 12, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(18);
        doc.text('SC', pageWidth / 2, 37, { align: 'center' });

        doc.setTextColor(218, 165, 32);
        doc.setFontSize(32);
        doc.text('SHIELDCHECK ACADEMY', pageWidth / 2, 55, { align: 'center' });

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(148, 163, 184);
        doc.text('CERTIFICADO DE EXCELÊNCIA EM SEGURANÇA DIGITAL', pageWidth / 2, 65, { align: 'center' });

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(16);
        doc.text('Outorgado com distinção a:', pageWidth / 2, 85, { align: 'center' });

        doc.setFontSize(42);
        doc.setFont('times', 'bold');
        doc.setTextColor(255, 255, 255);
        doc.text(user?.name?.toUpperCase() || 'EXPLORADOR DA REDE', pageWidth / 2, 105, { align: 'center' });

        doc.setFontSize(14);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(148, 163, 184);
        doc.text('Por demonstrar habilidades excepcionais na identificação de fraudes,', pageWidth / 2, 120, { align: 'center' });
        doc.text('engenharia social e ameaças cibernéticas avançadas.', pageWidth / 2, 128, { align: 'center' });

        doc.setFillColor(218, 165, 32);
        doc.circle(pageWidth - 45, pageHeight - 45, 18, 'F');
        doc.setDrawColor(255, 255, 255);
        doc.circle(pageWidth - 45, pageHeight - 45, 15, 'D');
        doc.setTextColor(10, 15, 30);
        doc.setFontSize(7);
        doc.setFont('helvetica', 'bold');
        doc.text('ORIGINAL', pageWidth - 45, pageHeight - 48, { align: 'center' });
        doc.setFontSize(9);
        doc.text('SHIELD', pageWidth - 45, pageHeight - 44, { align: 'center' });
        doc.text('CERTIFIED', pageWidth - 45, pageHeight - 40, { align: 'center' });

        doc.setDrawColor(148, 163, 184);
        doc.line(40, pageHeight - 40, 100, pageHeight - 40);
        doc.setTextColor(148, 163, 184);
        doc.setFontSize(8);
        doc.text('DIRETORIA DE INTELIGÊNCIA', 70, pageHeight - 35, { align: 'center' });
        doc.text('ShieldCheck AI Security Lab', 70, pageHeight - 31, { align: 'center' });

        const date = new Date().toLocaleDateString('pt-BR');
        const hash = Math.random().toString(16).substring(2, 12).toUpperCase();
        doc.setTextColor(71, 85, 105);
        doc.setFontSize(7);
        doc.text(`ID de Verificação: SC-${hash} | Emitido em: ${date}`, pageWidth / 2, pageHeight - 15, { align: 'center' });

        doc.save(`Certificado_ShieldCheck_${user?.name || 'User'}.pdf`);
    };

    const currentScenario = SCENARIOS[currentIndex];

    const handleChoice = (choice) => {
        const correct = choice === currentScenario.type;
        setIsCorrect(correct);
        if (correct) setScore(score + 100);
        setShowResult(true);
    };

    const nextScenario = () => {
        setShowResult(false);
        setIsCorrect(null);
        if (currentIndex < SCENARIOS.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            setGameFinished(true);
            triggerConfetti();
        }
    };

    if (gameFinished) {
        return (
            <div className="max-w-4xl mx-auto py-20 px-4 text-center space-y-12">
                <div className="relative inline-block">
                    <div className="absolute inset-0 bg-indigo-500 blur-[100px] opacity-20"></div>
                    <h2 className="text-6xl font-black text-slate-900 dark:text-white relative z-10 text-premium-gradient">Treinamento Concluído!</h2>
                </div>

                <div className="glass-card p-12 rounded-[4rem] border border-white dark:border-slate-800 shadow-2xl space-y-8 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-premium-gradient opacity-5"></div>

                    <div className="relative z-10 space-y-4">
                        <div className="text-8xl font-black text-indigo-600 dark:text-indigo-400">{score}</div>
                        <div className="text-2xl font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Sua Pontuação Total</div>

                        {score >= 300 ? (
                            <p className="text-emerald-500 font-black text-sm uppercase tracking-widest bg-emerald-50 dark:bg-emerald-950/30 px-6 py-2 rounded-full inline-block">🏆 Status: Especialista Elite</p>
                        ) : (
                            <p className="text-amber-500 font-black text-sm uppercase tracking-widest bg-amber-50 dark:bg-amber-950/30 px-6 py-2 rounded-full inline-block">💪 Quase lá! Pratique mais um pouco</p>
                        )}
                    </div>

                    <div className="pt-8 flex flex-col sm:flex-row gap-4 justify-center font-black relative z-10">
                        <button
                            onClick={() => window.location.reload()}
                            className="px-10 py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-3xl hover:opacity-90 transition-all shadow-xl"
                        >
                            Tentar Novamente
                        </button>
                        {score >= 300 && (
                            <button
                                onClick={generateCertificate}
                                className="px-10 py-5 bg-premium-gradient text-white rounded-3xl hover:opacity-90 transition-all shadow-xl flex items-center justify-center gap-3 animate-bounce-subtle"
                            >
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                Baixar Certificado Oficial
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto py-20 px-4 space-y-16">
            <div className="flex justify-start">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 font-black rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all border border-slate-100 dark:border-slate-800 shadow-sm group"
                >
                    <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                    </svg>
                    Voltar
                </button>
            </div>
            <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                <div className="space-y-2">
                    <div className="inline-flex gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-400 rounded-full text-[10px] font-black uppercase tracking-widest">Módulo 01: Detecção de Mensagens</div>
                    <h2 className="text-5xl font-black text-slate-900 dark:text-white tracking-tight">Simulador de <span className="text-premium-gradient">Golpes Reais</span></h2>
                </div>
                <div className="flex items-center gap-8">
                    <div className="text-right">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Cenário</div>
                        <div className="text-3xl font-black text-slate-900 dark:text-white">{currentIndex + 1} <span className="text-slate-300 dark:text-slate-700">/ {SCENARIOS.length}</span></div>
                    </div>
                    <div className="text-right">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Score</div>
                        <div className="text-3xl font-black text-indigo-600 dark:text-indigo-400">{score}</div>
                    </div>
                </div>
            </div>

            <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentIndex + 1) / SCENARIOS.length) * 100}%` }}
                    className="h-full bg-indigo-600"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                <div className="relative group">
                    <div className="absolute inset-0 bg-indigo-500/10 blur-[120px] rounded-full group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative bg-slate-900 rounded-[3rem] p-4 border-[8px] border-slate-800 shadow-2xl w-full max-w-[400px] mx-auto overflow-hidden">
                        <div className="flex justify-between items-center px-6 py-2 text-white/40 text-[10px] font-bold">
                            <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            <div className="flex gap-1 items-center">
                                <div className="w-3 h-3 bg-white/20 rounded-sm"></div>
                                <div className="w-5 h-3 bg-white/40 rounded-sm"></div>
                            </div>
                        </div>

                        <div className="bg-slate-800 p-4 flex items-center gap-3">
                            <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-black text-xs uppercase">
                                {currentScenario?.source[0]}
                            </div>
                            <div>
                                <div className="text-white font-black text-sm">{currentScenario?.sender}</div>
                                <div className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Online</div>
                            </div>
                        </div>

                        <div className="h-[400px] p-6 space-y-4 overflow-y-auto bg-slate-950 pattern-grid">
                            <div className="bg-indigo-600/10 border border-indigo-500/20 p-4 rounded-2xl rounded-tl-none text-white text-sm font-medium leading-relaxed animate-slide-up">
                                {currentScenario?.content}
                            </div>
                        </div>

                        <div className="p-4 bg-slate-900 border-t border-slate-800 flex gap-2">
                            <div className="flex-1 h-10 bg-slate-800 rounded-full px-4 text-white/30 text-xs flex items-center">Escreva uma resposta...</div>
                            <div className="w-10 h-10 bg-indigo-600 rounded-full"></div>
                        </div>
                    </div>
                </div>

                <div className="space-y-10">
                    <div className="space-y-4">
                        <h3 className="text-3xl font-black text-slate-900 dark:text-white leading-tight">Analise a mensagem acima e tome uma decisão.</h3>
                        <p className="text-xl text-slate-500 dark:text-slate-400 font-medium">Lembre-se: golpistas usam urgência e autoridade para te enganar.</p>
                    </div>

                    <div className="flex flex-col gap-4">
                        <button
                            disabled={showResult}
                            onClick={() => handleChoice('scam')}
                            className="group relative p-6 bg-red-500 text-white rounded-3xl font-black text-xl hover:bg-red-600 transition-all flex items-center justify-between disabled:opacity-50"
                        >
                            <span>🚩 ISSO É UM GOLPE</span>
                            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                            </div>
                        </button>

                        <button
                            disabled={showResult}
                            onClick={() => handleChoice('safe')}
                            className="group relative p-6 bg-emerald-500 text-white rounded-3xl font-black text-xl hover:bg-emerald-600 transition-all flex items-center justify-between disabled:opacity-50"
                        >
                            <span>✅ É SEGURO CONFIAR</span>
                            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>
                        </button>
                    </div>

                    <AnimatePresence>
                        {showResult && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className={`p-8 rounded-[2.5rem] border-4 flex flex-col gap-6 shadow-2xl relative overflow-hidden
                                    ${isCorrect ? 'bg-emerald-500 border-emerald-400 text-white' : 'bg-red-500 border-red-400 text-white'}
                                `}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="text-5xl">{isCorrect ? '🏆' : '❌'}</div>
                                    <div>
                                        <h4 className="text-2xl font-black uppercase tracking-tight">{isCorrect ? 'Você acertou!' : 'Você caiu no golpe!'}</h4>
                                        <p className="font-bold opacity-80">{isCorrect ? '+100 Pontos' : '0 Pontos'}</p>
                                    </div>
                                </div>
                                <div className="p-6 bg-black/10 rounded-2xl">
                                    <p className="text-lg font-bold italic leading-relaxed">
                                        "{currentScenario?.explanation}"
                                    </p>
                                </div>
                                <button
                                    onClick={nextScenario}
                                    className="w-full py-4 bg-white text-slate-900 rounded-2xl font-black text-lg hover:shadow-xl transition-all active:scale-95"
                                >
                                    Próximo Cenário →
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}

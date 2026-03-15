import React, { useRef } from 'react';
import { toPng } from 'html-to-image';
import confetti from 'canvas-confetti';
import { motion } from 'framer-motion';

const ShieldScoreCard = ({ score, name }) => {
    const cardRef = useRef(null);

    const handleShare = async () => {
        if (cardRef.current === null) return;

        try {
            const dataUrl = await toPng(cardRef.current, { cacheBust: true });

            // Tentar usar Web Share API se disponível (melhor no mobile)
            if (navigator.share && navigator.canShare) {
                const blob = await (await fetch(dataUrl)).blob();
                const file = new File([blob], `shieldcheck-${name}.png`, { type: blob.type });

                if (navigator.canShare({ files: [file] })) {
                    await navigator.share({
                        files: [file],
                        title: 'Minha Blindagem Digital',
                        text: `Veja meu Shield Score no ShieldCheck AI! Minha nota é ${score}.`
                    });
                } else {
                    downloadImage(dataUrl);
                }
            } else {
                downloadImage(dataUrl);
            }

            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#6366f1', '#a855f7', '#3b82f6']
            });
        } catch (err) {
            console.error('Error sharing score:', err);
            // Fallback para download simples se tudo falhar
            const link = document.createElement('a');
            link.download = `shieldcheck-score-${name}.png`;
            link.href = cardRef.current.toDataURL ? cardRef.current.toDataURL() : '';
            if (link.href) link.click();
        }
    };

    const downloadImage = (dataUrl) => {
        const link = document.createElement('a');
        link.download = `shieldcheck-score-${name}.png`;
        link.href = dataUrl;
        link.click();
    };

    const getStatus = (s) => {
        if (s > 80) return { label: 'Inviolável', color: 'text-emerald-500', bg: 'bg-emerald-500/10' };
        if (s > 50) return { label: 'Protegido', color: 'text-indigo-500', bg: 'bg-indigo-500/10' };
        return { label: 'Vulnerável', color: 'text-red-500', bg: 'bg-red-500/10' };
    };

    const status = getStatus(score);

    return (
        <div className="flex flex-col items-center gap-6">
            <motion.div
                ref={cardRef}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-80 p-8 rounded-[2.5rem] bg-slate-900 text-white relative overflow-hidden shadow-2xl border border-white/10"
            >
                {/* Background Mesh */}
                <div className="absolute inset-0 bg-mesh opacity-20 pointer-events-none"></div>
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-600/20 blur-[60px] rounded-full"></div>
                <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-600/20 blur-[60px] rounded-full"></div>

                <div className="relative z-10 flex flex-col items-center text-center space-y-6">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-black text-xl">S</div>
                        <span className="font-display font-black tracking-tighter text-lg">ShieldCheck AI</span>
                    </div>

                    <div className="py-4">
                        <div className="relative h-32 w-32 flex flex-col items-center justify-center">
                            <svg className="absolute inset-0 w-full h-full -rotate-90">
                                <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="10" fill="transparent" className="text-white/5" />
                                <circle
                                    cx="64"
                                    cy="64"
                                    r="58"
                                    stroke="currentColor"
                                    strokeWidth="10"
                                    fill="transparent"
                                    strokeDasharray="364.4"
                                    strokeDashoffset={364.4 - (364.4 * score) / 100}
                                    className="text-indigo-500 transition-all duration-1000 ease-out"
                                />
                            </svg>
                            <span className="text-4xl font-display font-black">{score}</span>
                            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Score</span>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">Status de Blindagem</p>
                        <h3 className={`text-2xl font-black uppercase tracking-tight ${status.color}`}>{status.label}</h3>
                    </div>

                    <div className="pt-4 border-t border-white/5 w-full">
                        <p className="text-[10px] font-medium text-slate-500 leading-relaxed italic">
                            Este usuário está protegido pela <br />
                            Inteligência Artificial do ShieldCheck.
                        </p>
                    </div>

                    <div className="text-[8px] font-black text-indigo-500 uppercase tracking-[0.4em] pt-2">
                        shieldcheck.ai
                    </div>
                </div>
            </motion.div>

            <button
                onClick={handleShare}
                className="flex items-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black shadow-xl shadow-indigo-500/20 transition-all hover:scale-105 active:scale-95 text-xs uppercase tracking-widest"
            >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                Compartilhar Blindagem
            </button>
        </div>
    );
};

export default ShieldScoreCard;

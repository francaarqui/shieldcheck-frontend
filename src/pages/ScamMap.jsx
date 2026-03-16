import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ScamHeatmap from '../components/ScamHeatmap';

export default function ScamMap() {
    const [points, setPoints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPoint, setSelectedPoint] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // ... points fetch logic ...
        const fetchPoints = async () => {
            const mockPoints = [
                { id: 1, city: 'São Paulo', count: 145, threat: 'Alto', color: 'bg-red-500' },
                { id: 2, city: 'Rio de Janeiro', count: 98, threat: 'Alto', color: 'bg-red-500' },
                { id: 3, city: 'Belo Horizonte', count: 54, threat: 'Médio', color: 'bg-amber-500' },
                { id: 4, city: 'Brasília', count: 42, threat: 'Médio', color: 'bg-amber-500' },
                { id: 5, city: 'Curitiba', count: 31, threat: 'Baixo', color: 'bg-emerald-500' },
                { id: 6, city: 'Salvador', count: 28, threat: 'Baixo', color: 'bg-emerald-500' },
            ];
            setPoints(mockPoints);
            setLoading(false);
        };
        fetchPoints();
    }, []);

    return (
        <div className="animate-slide-up max-w-7xl mx-auto space-y-10 pb-20 px-4 md:px-8 py-8 lg:py-16">
            <div className="flex justify-start">
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-black rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all border border-slate-200 dark:border-slate-700 shadow-sm group text-[10px] uppercase tracking-widest"
                >
                    <svg className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
                    </svg>
                    Voltar
                </button>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 text-center md:text-left">
                <div>
                    <h2 className="text-4xl lg:text-5xl font-display font-black text-slate-900 dark:text-white tracking-tighter">
                        Global <span className="text-premium-gradient">Scam Heatmap</span>
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg lg:text-xl font-medium max-w-2xl">
                        Inteligência global em tempo real. Veja onde os criminosos estão agindo agora em todo o mundo.
                    </p>
                </div>

                <div className="flex gap-4">
                    <div className="glass-card px-5 py-3 rounded-2xl flex flex-col items-center border border-white dark:border-slate-800 shadow-sm">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Ativos Hoje</span>
                        <span className="text-2xl font-display font-black text-red-500">2.451</span>
                    </div>
                    <div className="glass-card px-5 py-3 rounded-2xl flex flex-col items-center border border-white dark:border-slate-800 shadow-sm">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Protegidos</span>
                        <span className="text-2xl font-display font-black text-emerald-500">14k</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 min-h-[600px]">
                {/* MAP AREA (Global Heatmap 2.0) */}
                <div className="lg:col-span-2 h-[400px] lg:h-[700px] rounded-[2.5rem] overflow-hidden border border-slate-200 dark:border-slate-800 shadow-2xl">
                    <ScamHeatmap />
                </div>

                {/* SIDEBAR: RECENT FEED */}
                <div className="space-y-6 h-[400px] lg:h-[700px] overflow-y-auto pr-2 lg:pr-4 custom-scrollbar">
                    <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-3 sticky top-0 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-md py-2 z-10">
                        <div className="w-1.5 h-5 bg-red-600 rounded-full"></div>
                        Últimos Relatos
                    </h3>
                    <div className="space-y-4">
                        {[
                            { time: '2m atrás', loc: 'São Paulo, SP', type: 'WhatsApp', text: 'Golpe do novo número pedindo Pix para mãe.' },
                            { time: '15m atrás', loc: 'Curitiba, PR', type: 'SMS', text: 'Link falso de rastreio dos Correios com taxa.' },
                            { time: '40m atrás', loc: 'Rio de Janeiro, RJ', type: 'E-mail', text: 'Falsa intimação judicial da Polícia Federal.' },
                            { time: '1h atrás', loc: 'Salvador, BA', type: 'Link', text: 'Loja falsa vendendo ar-condicionado 90% OFF.' },
                        ].map((item, i) => (
                            <div key={i} className="glass-card p-6 rounded-3xl border border-white dark:border-slate-800 hover:border-red-500/30 transition-colors group">
                                <div className="flex justify-between items-start mb-3">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.time}</span>
                                    <span className="px-3 py-1 bg-red-50 dark:bg-red-950/30 text-red-600 text-[10px] font-black rounded-full uppercase border border-red-100 dark:border-red-900/30">
                                        {item.type}
                                    </span>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-tighter">{item.loc}</p>
                                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">"{item.text}"</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button className="w-full py-6 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[2rem] font-black uppercase tracking-widest text-xs hover:opacity-90 shadow-2xl transition-all">
                        Contribuir com Denúncia
                    </button>
                </div>
            </div>
        </div>
    );
}

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ScamHeatmap from '../components/ScamHeatmap';

export default function ScamMap() {
    const [points, setPoints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPoint, setSelectedPoint] = useState(null);

    useEffect(() => {
        // Simulating map data for now as we'd need Leaflet/Google Maps for real rendering
        // We'll build a custom SVG map of Brazil or a stylized representation
        const fetchPoints = async () => {
            // Mock data since real coordinates aren't in DB yet
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
        <div className="animate-slide-up max-w-7xl mx-auto space-y-12 pb-20 px-4 md:px-0">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 text-center md:text-left">
                <div>
                    <h2 className="text-5xl font-display font-black text-slate-900 dark:text-white tracking-tighter">
                        Global <span className="text-premium-gradient">Scam Heatmap</span>
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-xl font-medium max-w-2xl">
                        Inteligência global em tempo real. Veja onde os criminosos estão agindo agora em todo o mundo.
                    </p>
                </div>

                <div className="flex gap-4">
                    <div className="glass-card px-6 py-4 rounded-2xl flex flex-col items-center border border-white dark:border-slate-800">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ativos Hoje</span>
                        <span className="text-3xl font-display font-black text-red-500">2.451</span>
                    </div>
                    <div className="glass-card px-6 py-4 rounded-2xl flex flex-col items-center border border-white dark:border-slate-800">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Protegidos</span>
                        <span className="text-3xl font-display font-black text-emerald-500">14k</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 h-[700px]">
                {/* MAP AREA (Global Heatmap 2.0) */}
                <div className="lg:col-span-2">
                    <ScamHeatmap />
                </div>

                {/* SIDEBAR: RECENT FEED */}
                <div className="space-y-8 overflow-y-auto pr-4 custom-scrollbar">
                    <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-3">
                        <div className="w-2 h-6 bg-red-600 rounded-full"></div>
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

import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { API_ENDPOINTS } from '../api/config';

export default function Intelligence() {
    const { user } = useContext(AuthContext);
    const [recentScams, setRecentScams] = useState([]);
    const [trends, setTrends] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchIntelligenceData = async () => {
            if (!user?.token) return;
            try {
                const [recentRes, trendsRes] = await Promise.all([
                    fetch(API_ENDPOINTS.RECENT_SCAMS, {
                        headers: { 'Authorization': `Bearer ${user.token}` }
                    }),
                    fetch(API_ENDPOINTS.TRENDS, {
                        headers: { 'Authorization': `Bearer ${user.token}` }
                    })
                ]);

                if (recentRes.ok) setRecentScams(await recentRes.json());
                if (trendsRes.ok) setTrends(await trendsRes.json());

            } catch (err) {
                console.error("Erro ao carregar dados de inteligência", err);
            } finally {
                setLoading(false);
            }
        };

        fetchIntelligenceData();
    }, [user?.token]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-full min-h-[50vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-12">
            <div>
                <h2 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
                    <svg className="w-8 h-8 text-indigo-600" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5m.75-9 3-3 2.148 2.148A12.061 12.061 0 0 1 16.5 7.605" /></svg>
                    Inteligência e Tendências
                </h2>
                <p className="text-slate-500 mt-2 text-lg">
                    Acompanhe em tempo real os golpes emergentes identificados pela nossa comunidade.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* User Alertas - Golpes Recentes */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                    <div className="bg-slate-50 border-b border-slate-200 p-5 flex items-center gap-3">
                        <div className="bg-red-100 p-2 rounded-lg">
                            <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                        </div>
                        <h3 className="font-bold text-slate-800 text-lg">Radar de Ameaças Recentes</h3>
                    </div>

                    <div className="p-2 flex-grow">
                        {recentScams.length === 0 ? (
                            <div className="p-8 text-center text-slate-500">Nenhuma ameaça recente relatada.</div>
                        ) : (
                            <ul className="divide-y divide-slate-100">
                                {recentScams.map((scam) => (
                                    <li key={scam.id} className="p-4 hover:bg-slate-50 transition-colors">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded">
                                                {new Date(scam.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                            <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
                                                {scam.content_type === 'url' ? 'Link Suspeito' : 'Mensagem / Mídia'}
                                            </span>
                                        </div>
                                        <p className="text-sm text-slate-700 font-medium line-clamp-3 bg-red-50/50 p-3 rounded-lg border border-red-100">
                                            "{scam.content}"
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

                {/* Dashboard Admin - Principais Padrões */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                    <div className="bg-indigo-50 border-b border-indigo-100 p-5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="bg-indigo-600 p-2 rounded-lg">
                                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 1 0 7.5 7.5h-7.5V6Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0 0 13.5 3v7.5Z" /></svg>
                            </div>
                            <h3 className="font-bold text-indigo-950 text-lg">Padrões Mais Denunciados</h3>
                        </div>
                        <span className="text-xs font-bold bg-indigo-200 text-indigo-800 px-2 py-1 rounded-full flex items-center gap-1">
                            <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-pulse"></span>
                            Score Público
                        </span>
                    </div>

                    <div className="p-4 flex-grow">
                        <p className="text-xs text-slate-500 mb-4 px-2">
                            Padrões com <strong className="text-red-500">mais de 3 alertas</strong> passam a penalizar ativamente o score oficial da IA.
                        </p>

                        {trends.length === 0 ? (
                            <div className="p-8 text-center text-slate-500">Base de aprendizado ainda em treinamento inicial.</div>
                        ) : (
                            <div className="space-y-3">
                                {trends.map((trend, idx) => {
                                    const isCritical = trend.report_count >= 3;
                                    return (
                                        <div key={idx} className={`flex items-center justify-between p-3 rounded-xl border ${isCritical ? 'bg-red-50 border-red-200' : 'bg-slate-50 border-slate-200'}`}>
                                            <div className="flex-1 truncate pr-4">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${isCritical ? 'bg-red-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                                                        {trend.pattern_type}
                                                    </span>
                                                    {isCritical && (
                                                        <span className="text-[10px] font-bold text-red-600 flex items-center gap-0.5">
                                                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                                            Ativa no Motor
                                                        </span>
                                                    )}
                                                </div>
                                                <p className={`text-sm font-semibold truncate ${isCritical ? 'text-red-900' : 'text-slate-700'}`}>
                                                    {trend.pattern_text}
                                                </p>
                                            </div>

                                            <div className="flex flex-col items-center justify-center bg-white px-3 py-1.5 rounded-lg shadow-sm w-16 shrink-0 border border-slate-100">
                                                <span className={`text-lg font-black ${isCritical ? 'text-red-600' : 'text-slate-600'}`}>{trend.report_count}</span>
                                                <span className="text-[9px] uppercase font-bold text-slate-400">Alertas</span>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}

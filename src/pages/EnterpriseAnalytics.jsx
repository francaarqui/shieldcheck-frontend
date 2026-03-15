import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { API_ENDPOINTS } from '../api/config';
import { motion } from 'framer-motion';

export default function EnterpriseAnalytics() {
    const { user } = useContext(AuthContext);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const res = await fetch(API_ENDPOINTS.ENTERPRISE_ANALYTICS, {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            const data = await res.json();
            setStats(data);
        } catch (err) {
            console.error('Error fetching enterprise stats:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center p-20">
            <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="space-y-8 animate-fadeIn max-w-6xl mx-auto">
            {/* Main Scorecard */}
            <div className="bg-slate-900 rounded-[3rem] p-12 text-white relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 blur-[100px] rounded-full"></div>

                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
                    <div className="space-y-4">
                        <div className="inline-flex px-4 py-2 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-widest">Enterprise Security Score</div>
                        <h2 className="text-6xl font-black tracking-tighter">
                            {stats?.overallScore}% <span className="text-2xl text-slate-400 font-medium">Global</span>
                        </h2>
                        <p className="text-indigo-200 font-medium max-w-sm">O nível de conscientização da sua organização está acima da média do setor.</p>
                    </div>

                    <div className="grid grid-cols-2 gap-8 w-full md:w-auto">
                        <div className="text-center">
                            <div className="text-3xl font-black mb-1">{stats?.riskTrend}</div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tendência de Risco</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-black mb-1">{stats?.simulatorPerformance?.passRate}</div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Taxa de Aprovação</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Department Risk Table */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                    <div className="p-8 border-b border-slate-100 dark:border-slate-800">
                        <h3 className="text-xl font-black text-slate-900 dark:text-white">Risco por Departamento</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 dark:bg-slate-950 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                                <tr>
                                    <th className="px-8 py-4">Departamento</th>
                                    <th className="px-8 py-4">Usuários</th>
                                    <th className="px-8 py-4">Awareness</th>
                                    <th className="px-8 py-4">Nível de Risco</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {stats?.departmentMetrics.map((dept, i) => (
                                    <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <td className="px-8 py-5 font-bold text-slate-700 dark:text-slate-200">{dept.name}</td>
                                        <td className="px-8 py-5 text-sm text-slate-500">{dept.activeUsers}</td>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-16 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                    <div className="h-full bg-indigo-500" style={{ width: `${dept.awarenessScore}%` }}></div>
                                                </div>
                                                <span className="text-xs font-black text-slate-700 dark:text-slate-300">{dept.awarenessScore}%</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${dept.riskLevel === 'Baixo' ? 'bg-emerald-100 text-emerald-700' :
                                                    dept.riskLevel === 'Médio' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                                                }`}>
                                                {dept.riskLevel}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Exposure Breakdown */}
                <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm p-8 space-y-8">
                    <h3 className="text-xl font-black text-slate-900 dark:text-white">Exposição por Ameaça</h3>

                    <div className="space-y-6">
                        {Object.entries(stats?.threatExposure || {}).map(([threat, value]) => (
                            <div key={threat} className="space-y-2">
                                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                    <span className="text-slate-500">{threat === 'phishing' ? 'Phishing' : threat === 'voiceCloning' ? 'Clonagem de Voz' : 'Engenharia Social'}</span>
                                    <span className="text-indigo-600">{value}%</span>
                                </div>
                                <div className="w-full h-2 bg-slate-50 dark:bg-slate-800 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${value}%` }}
                                        className="h-full bg-premium-gradient"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="p-6 bg-amber-50 dark:bg-amber-900/10 rounded-3xl border border-amber-100 dark:border-amber-900/30">
                        <div className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-2">Insight de IA</div>
                        <p className="text-xs font-medium text-amber-800 dark:text-amber-300 leading-relaxed">
                            O departamento de <strong>Vendas</strong> apresenta alto risco em Phishing. Recomendamos uma rodada extra de simulações focada em <strong>Falsos Links de Pagamento</strong>.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

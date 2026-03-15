import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';

export default function ComplianceHub() {
    const { user } = useContext(AuthContext);
    const [isExporting, setIsExporting] = useState(false);

    const handleExport = () => {
        setIsExporting(true);
        setTimeout(() => {
            setIsExporting(false);
            alert('Seus dados foram compilados e enviados para o seu e-mail cadastrado. (Simulação GDPR/LGPD)');
        }, 3000);
    };

    return (
        <div className="max-w-5xl mx-auto space-y-12 pb-20 animate-fadeIn">
            {/* Header */}
            <div className="text-center space-y-4">
                <div className="inline-flex px-4 py-2 bg-indigo-600/10 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-100 dark:border-indigo-900/30">
                    Soberania de Dados & Transparência
                </div>
                <h2 className="text-5xl font-display font-black text-slate-900 dark:text-white tracking-tighter">Central de <span className="text-premium-gradient">Privacidade</span></h2>
                <p className="text-slate-500 dark:text-slate-400 text-lg font-medium max-w-2xl mx-auto">
                    Gerencie seus direitos de privacidade, exporte seus dados e entenda como protegemos sua soberania digital em conformidade total com LGPD e GDPR.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Data Sovereignty */}
                <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-10 border border-slate-200 dark:border-slate-800 shadow-sm space-y-8">
                    <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-950/30 rounded-2xl flex items-center justify-center text-3xl">🧩</div>
                    <div className="space-y-2">
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white">Portabilidade de Dados</h3>
                        <p className="text-sm text-slate-500 font-medium">Conforme o Art. 18 da LGPD, você tem o direito de solicitar uma cópia completa de todos os seus dados processados pelo ShieldCheck AI.</p>
                    </div>
                    <button
                        onClick={handleExport}
                        disabled={isExporting}
                        className="w-full h-16 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black uppercase tracking-widest text-xs hover:opacity-90 transition-all flex items-center justify-center gap-3 shadow-xl"
                    >
                        {isExporting ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white dark:border-slate-900 border-t-transparent rounded-full animate-spin" />
                                Processando...
                            </>
                        ) : (
                            'Solicitar Exportação (JSON/PDF)'
                        )}
                    </button>
                </div>

                {/* Right to be Forgotten */}
                <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-10 border border-slate-200 dark:border-slate-800 shadow-sm space-y-8 border-l-4 border-l-red-500">
                    <div className="w-16 h-16 bg-red-50 dark:bg-red-950/30 rounded-2xl flex items-center justify-center text-3xl">🗑️</div>
                    <div className="space-y-2">
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white">Direito ao Esquecimento</h3>
                        <p className="text-sm text-slate-500 font-medium">Exclua permanentemente sua conta e todos os logs de análises associados. Esta ação é irreversível e cumpre as normas internacionais de expurgo.</p>
                    </div>
                    <button className="w-full h-16 bg-red-50 dark:bg-red-950 text-red-600 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-red-100 dark:hover:bg-red-900 transition-all">
                        Encerrar Conta e Apagar Logs
                    </button>
                </div>

                {/* Transparency Log */}
                <div className="md:col-span-2 bg-slate-900 rounded-[3rem] p-12 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 blur-[100px] rounded-full"></div>
                    <div className="relative z-10 space-y-8">
                        <div className="flex justify-between items-center">
                            <h3 className="text-2xl font-black">Registro de Transparência Analítica</h3>
                            <span className="px-4 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-500/30">
                                IA Auditável
                            </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
                                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Processamento de Dados</div>
                                <div className="text-2xl font-black">Criptografia Ponta-a-Ponta</div>
                                <p className="text-xs text-slate-400 mt-2">Suas mensagens analisadas não são armazenadas em texto simples.</p>
                            </div>
                            <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
                                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Compartilhamento</div>
                                <div className="text-2xl font-black">Zero Terceiros</div>
                                <p className="text-xs text-slate-400 mt-2">Seus dados nunca são vendidos ou compartilhados com parceiros de marketing.</p>
                            </div>
                            <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
                                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Conformidade</div>
                                <div className="text-2xl font-black text-emerald-400">Certificado 2024</div>
                                <p className="text-xs text-slate-400 mt-2">Auditado para conformidade total com regulação de IA da UE.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-10 bg-indigo-50 dark:bg-indigo-950/20 rounded-[3rem] border border-indigo-100 dark:border-indigo-800/30 flex flex-col md:flex-row items-center gap-8">
                <div className="w-20 h-20 bg-white dark:bg-slate-900 rounded-3xl flex items-center justify-center text-4xl shadow-xl">🛡️</div>
                <div className="flex-1 space-y-2 text-center md:text-left">
                    <h4 className="text-xl font-black text-slate-900 dark:text-white">Escudo de Privacidade ShieldCheck</h4>
                    <p className="text-sm text-slate-500 font-medium">Nossa IA é treinada com princípios de "Privacy by Design", garantindo que a segurança nunca venha às custas da sua intimidade digital.</p>
                </div>
                <button
                    onClick={() => window.open('/terms', '_blank')}
                    className="h-14 px-8 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-indigo-200 dark:shadow-none hover:bg-indigo-700 transition-all"
                >
                    Ver Termos Detalhados
                </button>
            </div>
        </div>
    );
}

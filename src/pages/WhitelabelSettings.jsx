import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function WhitelabelSettings() {
    const { user } = useContext(AuthContext);
    const [logoUrl, setLogoUrl] = useState('');
    const [primaryColor, setPrimaryColor] = useState('#4f46e5');
    const [brandName, setBrandName] = useState('ShieldCheck AI');

    const handleSave = (e) => {
        e.preventDefault();
        // This is a mockup of the B2B action
        alert('Configurações de Whitelabel salvas com sucesso! (Funcionalidade Premium B2B)');
    };

    return (
        <div className="animate-slide-up max-w-4xl mx-auto space-y-8 pb-10">
            <div className="space-y-2">
                <h2 className="text-3xl font-display font-black text-slate-900 dark:text-white tracking-tight">Personalização de Marca (Whitelabel)</h2>
                <p className="text-slate-500 dark:text-slate-400 font-medium">Configure a identidade visual que seus clientes verão ao acessar seu portal.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <form onSubmit={handleSave} className="glass-card p-8 rounded-[2.5rem] border border-white dark:border-slate-800 shadow-xl space-y-6">
                        <div className="space-y-4">
                            <label className="block text-sm font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest">Nome da Sua Marca</label>
                            <input
                                type="text"
                                value={brandName}
                                onChange={(e) => setBrandName(e.target.value)}
                                className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800 transition-all font-bold dark:text-white"
                            />
                        </div>

                        <div className="space-y-4">
                            <label className="block text-sm font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest">URL do Logotipo</label>
                            <input
                                type="url"
                                value={logoUrl}
                                onChange={(e) => setLogoUrl(e.target.value)}
                                placeholder="https://suaempresa.com/logo.png"
                                className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800 transition-all font-bold dark:text-white"
                            />
                        </div>

                        <div className="space-y-4">
                            <label className="block text-sm font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest">Cor Primária</label>
                            <div className="flex gap-4 items-center">
                                <input
                                    type="color"
                                    value={primaryColor}
                                    onChange={(e) => setPrimaryColor(e.target.value)}
                                    className="w-16 h-16 rounded-xl cursor-pointer border-4 border-white dark:border-slate-800 shadow-md"
                                />
                                <span className="font-mono font-black text-slate-500 dark:text-slate-400 uppercase">{primaryColor}</span>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-10 py-4 rounded-2xl font-black hover:bg-black dark:hover:bg-slate-100 transition-all shadow-xl dark:shadow-none hover-lift w-full"
                        >
                            Salvar Identidade Visual
                        </button>
                    </form>
                </div>

                <div className="space-y-6">
                    <div className="glass-card p-8 rounded-[2.5rem] bg-slate-900 dark:bg-slate-950 text-white shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full -mr-16 -mt-16 blur-xl"></div>
                        <h3 className="text-xl font-black mb-4 relative z-10">Preview do Portal</h3>

                        <div className="bg-white/5 rounded-2xl p-4 border border-white/10 space-y-3">
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded bg-white/20 flex items-center justify-center font-bold text-[10px]">L</div>
                                <span className="text-[10px] font-black uppercase tracking-widest">{brandName}</span>
                            </div>
                            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                                <div className="h-full bg-white/40 w-1/3"></div>
                            </div>
                            <div className="h-20 w-full bg-white/5 rounded-xl border border-white/5 flex items-center justify-center">
                                <div className="w-8 h-8 rounded-full border-2 border-white/20 border-t-white/80 animate-spin"></div>
                            </div>
                        </div>

                        <p className="text-[10px] text-slate-400 mt-6 leading-relaxed font-bold uppercase tracking-widest">
                            Assim seus clientes verão o cabeçalho e os elementos de carregamento.
                        </p>
                    </div>

                    <div className="p-6 bg-indigo-50 dark:bg-indigo-950/20 rounded-3xl border border-indigo-100 dark:border-indigo-900/30">
                        <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2">Dica Pro</p>
                        <p className="text-sm font-bold text-indigo-900 dark:text-indigo-300 leading-relaxed">
                            Logotipos com fundo transparente (.png) em alta resolução funcionam melhor para o Whitelabel.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

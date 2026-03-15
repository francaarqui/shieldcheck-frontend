import React from 'react';
import { Link } from 'react-router-dom';

export default function TermsOfUse() {
    return (
        <div className="max-w-4xl mx-auto px-6 py-12 bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-xl border border-slate-100 dark:border-slate-800 animate-fadeInUp">
            <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-8 tracking-tight">Acordo de Uso e Termos</h1>

            <div className="space-y-6 text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                <section>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">1. Objeto do Serviço</h2>
                    <p>
                        O ShieldCheck AI fornece uma ferramenta de auxílio na detecção de fraudes digitais baseada em inteligência artificial. O serviço é uma ferramenta de consulta e não garante 100% de precisão, devendo ser usado como apoio à decisão do usuário.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">2. Planos e Assinaturas</h2>
                    <p>
                        Oferecemos o plano Gratuito (com limitações diárias) e planos Premium (Solo Bot, Premium e Business). A assinatura é renovada automaticamente através do Stripe, podendo ser cancelada pelo usuário a qualquer momento no painel de configurações.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">3. Uso do Bot WhatsApp</h2>
                    <p>
                        Ao utilizar o bot do WhatsApp, o usuário concorda em não enviar conteúdos ilegais, spam ou tentar burlar as travas de licenciamento. A proteção Solo Bot é vinculada ao número de telefone cadastrado.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">4. Limitação de Responsabilidade</h2>
                    <p>
                        O ShieldCheck AI não se responsabiliza por prejuízos financeiros decorrentes de decisões tomadas com base nas análises da ferramenta. O usuário deve manter o bom senso em todas as suas interações digitais.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">5. Atendimento</h2>
                    <p>
                        Qualquer suporte referente ao uso do sistema pode ser solicitado via WhatsApp: <br />
                        <span className="text-indigo-600 dark:text-indigo-400 font-bold">(11) 96516-9481</span>
                    </p>
                </section>
            </div>

            <div className="mt-12 pt-8 border-t border-slate-100 dark:border-slate-800">
                <Link to="/" className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">← Voltar para a Home</Link>
            </div>
        </div>
    );
}

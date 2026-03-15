import React from 'react';
import { Link } from 'react-router-dom';

export default function PrivacyPolicy() {
    return (
        <div className="max-w-4xl mx-auto px-6 py-12 bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-xl border border-slate-100 dark:border-slate-800 animate-fadeInUp">
            <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-8 tracking-tight">Política de Privacidade</h1>

            <div className="space-y-6 text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                <section>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">1. Introdução e LGPD</h2>
                    <p>
                        A ShieldCheck AI está comprometida com a proteção de seus dados pessoais em conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018). Esta política descreve como coletamos, usamos e protegemos suas informações.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">2. Dados Coletados</h2>
                    <p>Coletamos as seguintes informações para o funcionamento do serviço:</p>
                    <ul className="list-disc pl-6 mt-2 space-y-2">
                        <li><strong>Cadastro:</strong> Nome e endereço de e-mail.</li>
                        <li><strong>Integração WhatsApp:</strong> Número de telefone vinculado para análise de mensagens.</li>
                        <li><strong>Análise:</strong> Conteúdos (textos e links) enviados para verificação de fraude.</li>
                        <li><strong>Pagamento:</strong> Informações de faturamento processadas de forma segura pelo Stripe.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">3. Finalidade do Tratamento</h2>
                    <p>
                        Seus dados são utilizados exclusivamente para identificar tentativas de golpes, proteger sua conta, processar assinaturas e melhorar a precisão da nossa inteligência artificial. Jamais vendemos seus dados para terceiros.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">4. Seus Direitos</h2>
                    <p>
                        Sob a LGPD, você tem o direito de acessar, corrigir, anonimizar ou excluir seus dados a qualquer momento através das configurações de sua conta ou entrando em contato com nosso encarregado de dados.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">5. Uso de Cookies</h2>
                    <p>
                        Utilizamos cookies para personalizar sua experiência, manter sua sessão ativa e analisar o tráfego do site. Você pode gerenciar suas preferências de cookies através das configurações do seu navegador.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">6. Conformidade LGPD</h2>
                    <p>
                        Operamos como Controladores de Dados conforme definido na LGPD. Implementamos medidas técnicas e administrativas aptas a proteger os dados pessoais de acessos não autorizados e de situações acidentais ou ilícitas.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">7. Contato Encarregado (DPO)</h2>
                    <p>
                        Para questões sobre privacidade ou exercício de direitos, entre em contato pelo e-mail: <br />
                        <span className="text-indigo-600 dark:text-indigo-400 font-bold">privacidade@shieldcheck.ai</span>
                    </p>
                </section>
            </div>

            <div className="mt-12 pt-8 border-t border-slate-100 dark:border-slate-800">
                <Link to="/" className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">← Voltar para a Home</Link>
            </div>
        </div>
    );
}

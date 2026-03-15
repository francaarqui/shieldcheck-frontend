import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const scamTypes = [
    {
        id: 'phishing',
        title: 'Phishing',
        short: 'O golpe mais comum por e-mail e SMS.',
        description: 'O phishing é uma técnica de engenharia social usada para enganar usuários e obter dados confidenciais, como nomes de usuário, senhas e detalhes de cartão de crédito. Geralmente ocorre através de e-mails ou mensagens que parecem vir de instituições legítimas.',
        prevention: [
            'Verifique sempre o remetente oficial.',
            'Nunca clique em links de urgência ou ameaça.',
            'Use o ShieldCheck AI para validar a URL antes de acessar.'
        ],
        risk: 'Alto',
        icon: '📧'
    },
    {
        id: 'smishing',
        title: 'Smishing',
        short: 'Phishing via mensagens de texto (SMS).',
        description: 'O smishing é a versão do phishing realizada via SMS. Golpistas enviam mensagens sobre entregas pendentes, bloqueios de conta ou sorteios, induzindo o usuário a clicar em um link malicioso.',
        prevention: [
            'Desconfie de avisos de bancos via SMS com links.',
            'Não ligue para números fornecidos na mensagem.',
            'O ShieldCheck pode analisar o texto do SMS em segundos.'
        ],
        risk: 'Crítico',
        icon: '📱'
    },
    {
        id: 'deepfake-voice',
        title: 'Vishing (Deepfake de Voz)',
        short: 'Golpes usando clones de voz via IA.',
        description: 'Criminosos usam inteligência artificial para clonar a voz de familiares ou autoridades. Eles ligam pedindo dinheiro em situações de emergência, tornando o golpe extremamente convincente.',
        prevention: [
            'Crie uma palavra-passe com sua família para emergências.',
            'Tente ligar de volta para o número oficial da pessoa.',
            'Use o Laboratório de Deepfake do ShieldCheck para entender como funciona.'
        ],
        risk: 'Extremo',
        icon: '🎙️'
    },
    {
        id: 'ecommerce-falso',
        title: 'Lojas Falsas',
        short: 'Sites de venda que nunca entregam o produto.',
        description: 'Sites que imitam grandes varejistas ou oferecem produtos com preços absurdamente baixos. O objetivo é coletar o pagamento (geralmente via PIX) e os dados do cartão do cliente.',
        prevention: [
            'Verifique a idade do domínio no Verificador de Lojas ShieldCheck.',
            'Busque por selos de segurança reais (não apenas imagens).',
            'Desconfie de preços mais de 50% abaixo do mercado.'
        ],
        risk: 'Alto',
        icon: '🛍️'
    },
    {
        id: 'golpe-pix',
        title: 'Golpe do PIX (Urubu do PIX)',
        short: 'Promessas de retorno financeiro imediato.',
        description: 'Criminosos prometem multiplicar valores enviados via PIX sob o pretexto de "falhas no sistema" ou "investimentos milagrosos". Após o envio, o golpista desaparece.',
        prevention: [
            'Ninguém duplica dinheiro de graça na internet.',
            'Cuidado com perfis de rede social hackeados oferecendo "oportunidades".',
            'Denuncie a chave PIX em nossa comunidade sentinela.'
        ],
        risk: 'Crítico',
        icon: '💸'
    },
    {
        id: 'whatsapp-clonado',
        title: 'Clonagem de WhatsApp',
        short: 'Invasão e pedido de dinheiro a contatos.',
        description: 'O golpista assume o controle da sua conta de WhatsApp ou cria uma conta falsa com sua foto e pede dinheiro emprestado para seus amigos e familiares alegando uma urgência.',
        prevention: [
            'Ative a Verificação em Duas Etapas.',
            'Nunca compartilhe o código de 6 dígitos que chega via SMS.',
            'Ignore pedidos de dinheiro sem antes ligar para a pessoa e confirmar a voz.'
        ],
        risk: 'Alto',
        icon: '💬'
    },
    {
        id: 'central-falsa',
        title: 'Falsa Central Bancária',
        short: 'Chamadas falsas de "segurança" do banco.',
        description: 'O criminoso liga fingindo ser do setor de segurança do seu banco, informando uma transação suspeita. Ele induz você a transferir o dinheiro para uma "conta segura" ou instalar um aplicativo de acesso remoto.',
        prevention: [
            'Bancos nunca pedem para você transferir dinheiro para evitar fraudes.',
            'Bancos nunca pedem para você instalar aplicativos de suporte remoto (AnyDesk, TeamViewer).',
            'Desligue e ligue você mesmo para o número oficial atrás do seu cartão.'
        ],
        risk: 'Extremo',
        icon: '☎️'
    }
];

const FraudDictionary = () => {
    const [selected, setSelected] = useState(null);
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-32 px-4">
            <div className="max-w-4xl mx-auto space-y-16">
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
                <div className="text-center space-y-4">
                    <h1 className="text-5xl font-display font-black text-slate-900 dark:text-white tracking-tight">Dicionário de Fraudes</h1>
                    <p className="text-xl text-slate-500 dark:text-slate-400 font-medium">Entenda as táticas dos golpistas e aprenda a se proteger.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {scamTypes.map((scam) => (
                        <motion.div
                            key={scam.id}
                            layoutId={scam.id}
                            onClick={() => setSelected(scam)}
                            className="glass-card p-8 rounded-[2.5rem] bg-white cursor-pointer hover:shadow-2xl transition-all border border-slate-100 dark:border-slate-800"
                        >
                            <div className="text-4xl mb-4">{scam.icon}</div>
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">{scam.title}</h2>
                            <p className="text-slate-500 font-medium">{scam.short}</p>
                            <div className="mt-6 flex items-center justify-between">
                                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600">Saber mais →</span>
                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${scam.risk === 'Crítico' || scam.risk === 'Extremo' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'
                                    }`}>Risco: {scam.risk}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <AnimatePresence>
                    {selected && (
                        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
                            <motion.div
                                layoutId={selected.id}
                                className="bg-white dark:bg-slate-900 w-full max-w-2xl p-10 rounded-[3rem] shadow-2xl relative overflow-hidden"
                            >
                                <button
                                    onClick={() => setSelected(null)}
                                    className="absolute top-6 right-6 p-2 bg-slate-100 dark:bg-slate-800 rounded-full hover:bg-slate-200"
                                >
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>

                                <div className="text-6xl mb-6">{selected.icon}</div>
                                <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-4">{selected.title}</h2>
                                <p className="text-lg text-slate-500 dark:text-slate-400 font-medium mb-8 leading-relaxed">
                                    {selected.description}
                                </p>

                                <div className="space-y-4">
                                    <h3 className="text-xl font-black text-indigo-600 uppercase tracking-widest text-sm">Como se proteger:</h3>
                                    <ul className="space-y-3">
                                        {selected.prevention.map((tip, i) => (
                                            <li key={i} className="flex items-start gap-3 text-slate-700 dark:text-slate-200 font-bold italic">
                                                <span className="text-indigo-600">✓</span>
                                                {tip}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="mt-10 pt-8 border-t border-slate-100 dark:border-slate-800">
                                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest text-center">Proteção garantida pelo ShieldCheck AI</p>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default FraudDictionary;

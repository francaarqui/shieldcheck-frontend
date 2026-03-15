import React, { useState, useEffect } from 'react';
import Joyride, { STATUS } from 'react-joyride';
import { useTranslation } from 'react-i18next';

const OnboardingTour = () => {
    const { t } = useTranslation();
    const [run, setRun] = useState(false);

    useEffect(() => {
        const hasSeenTour = localStorage.getItem('shieldcheck_tour_seen');
        if (!hasSeenTour) {
            setRun(true);
        }
    }, []);

    const steps = [
        {
            target: 'body',
            content: 'Bem-vindo ao ShieldCheck AI! Vamos fazer um tour rápido pelas ferramentas que vão proteger sua vida digital.',
            placement: 'center',
            disableBeacon: true,
        },
        {
            target: '.text-4xl.font-display', // Welcome message
            content: 'Aqui você tem uma visão geral da sua segurança e das ameaças que bloqueamos para você.',
        },
        {
            target: '[href="/analyze"]', // Nova Varredura button
            content: 'Sempre que receber algo suspeito, clique aqui para fazer uma varredura completa usando nossa Inteligência Artificial.',
        },
        {
            target: '.bg-slate-900.text-white.relative', // Shield Score Card (we need to make sure this selector works or add an ID)
            content: 'Este é o seu Shield Score. Ele mostra o quão "blindado" você está. Compartilhe-o para incentivar a segurança digital!',
        },
        {
            target: '[href="/family-guard"]',
            content: 'Proteja quem você ama. Aqui você pode monitorar e ser alertado sobre ameaças detectadas nos dispositivos da sua família.',
        },
        {
            target: '[href="/academy"]',
            content: 'Conhecimento é poder. Na nossa academia, você aprende a identificar golpes antes mesmo da IA.',
        },
        {
            target: '.flex.items-center.gap-2.bg-white\\/10', // Language Switcher
            content: 'Você pode mudar o idioma do sistema a qualquer momento aqui.',
        }
    ];

    const handleJoyrideCallback = (data) => {
        const { status } = data;
        if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
            setRun(false);
            localStorage.setItem('shieldcheck_tour_seen', 'true');
        }
    };

    return (
        <Joyride
            steps={steps}
            run={run}
            continuous={true}
            showProgress={true}
            showSkipButton={true}
            callback={handleJoyrideCallback}
            styles={{
                options: {
                    primaryColor: '#6366f1',
                    zIndex: 1000,
                },
            }}
            locale={{
                back: 'Voltar',
                close: 'Fechar',
                last: 'Finalizar',
                next: 'Próximo',
                skip: 'Pular Tour',
            }}
        />
    );
};

export default OnboardingTour;

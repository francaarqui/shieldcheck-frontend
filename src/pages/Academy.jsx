import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../context/AuthContext';

export default function Academy() {
    const { t } = useTranslation();
    const { user } = useContext(AuthContext);

    const COURSES = [
        {
            id: 'simulator',
            title: t('tools.academy.simulator_title'),
            description: t('tools.academy.simulator_desc'),
            icon: '🎯',
            category: t('tools.academy.category_gamification'),
            status: t('tools.academy.available'),
            points: 500,
            link: '/academy/simulator',
            color: 'bg-indigo-600'
        },
        {
            id: 'deepfake',
            title: t('tools.academy.deepfake_title'),
            description: t('tools.academy.deepfake_desc'),
            icon: '🎙️',
            category: t('tools.academy.category_ai'),
            status: t('tools.academy.available'),
            points: 1000,
            link: '/academy/deepfake-lab',
            color: 'bg-purple-600'
        },

        {
            id: 'certification',
            title: t('tools.academy.certification_course_title'),
            description: t('tools.academy.certification_course_desc'),
            icon: '📜',
            category: t('tools.academy.category_certification'),
            status: t('tools.academy.unavailable'),
            points: 2000,
            link: '#',
            color: 'bg-amber-500'
        }
    ];

    return (
        <div className="animate-slide-up max-w-7xl mx-auto space-y-12 pb-20 px-4 md:px-0">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div className="space-y-4">
                    <h2 className="text-5xl font-display font-black text-slate-900 dark:text-white tracking-tighter" dangerouslySetInnerHTML={{ __html: t('tools.academy.title') }}></h2>
                    <p className="text-slate-500 dark:text-slate-400 text-xl font-medium max-w-2xl">
                        {t('tools.academy.subtitle')}
                    </p>
                </div>

                <div className="glass-card px-8 py-6 rounded-[2rem] border border-white dark:border-slate-800 flex items-center gap-6 shadow-xl">
                    <div className="text-right">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2">{t('tools.academy.current_level')}</p>
                        <p className="text-3xl font-display font-black text-slate-900 dark:text-white">{t('tools.academy.explorador')}</p>
                    </div>
                    <div className="w-16 h-16 bg-premium-gradient rounded-2xl flex items-center justify-center text-white text-2xl animate-pulse">
                        🛡️
                    </div>
                </div>
            </div>

            {/* XP PROGRESS BAR SMALL */}
            <div className="glass-card p-6 rounded-[2rem] border border-white dark:border-slate-800 shadow-md">
                <div className="flex justify-between items-center mb-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                    <span>{t('tools.academy.next_level', { level: t('tools.academy.guardiao') })}</span>
                    <span>1.200 / 2.500 XP</span>
                </div>
                <div className="w-full h-3 bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden">
                    <div className="w-[48%] h-full bg-premium-gradient shadow-[0_0_15px_rgba(99,102,241,0.5)]"></div>
                </div>
            </div>

            {/* Courses Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {COURSES.map((course) => (
                    <div
                        key={course.id}
                        className={`glass-card rounded-[3rem] p-8 border border-white dark:border-slate-800 shadow-2xl flex flex-col justify-between transition-all duration-300 hover:scale-[1.02] relative group overflow-hidden
                            ${course.status === 'Disponível' ? 'opacity-100' : 'opacity-70'}
                        `}
                    >
                        {/* Background Decor */}
                        <div className={`absolute -right-16 -top-16 w-48 h-48 ${course.color} opacity-5 blur-[60px] rounded-full`}></div>

                        <div className="space-y-6 relative z-10">
                            <div className="flex justify-between items-start">
                                <div className={`w-16 h-16 ${course.color} rounded-2xl flex items-center justify-center text-3xl shadow-lg shadow-indigo-100 dark:shadow-none`}>
                                    {course.icon}
                                </div>
                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border
                                    ${course.status === 'Disponível' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-100 text-slate-500 border-slate-200'}
                                `}>
                                    {course.status}
                                </span>
                            </div>

                            <div className="space-y-2">
                                <h3 className="text-2xl font-black text-slate-900 dark:text-white leading-tight">{course.title}</h3>
                                <p className="text-slate-500 dark:text-slate-400 font-medium text-sm leading-relaxed">{course.description}</p>
                            </div>

                            <div className="flex items-center gap-4 text-xs font-black text-slate-400 uppercase tracking-widest">
                                <span>{t('tools.academy.reward')}</span>
                                <span className="text-amber-500">+{course.points} XP</span>
                            </div>
                        </div>

                        <div className="mt-10 relative z-10">
                            {course.status === t('tools.academy.available') ? (
                                <Link
                                    to={course.link}
                                    className="w-full h-14 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 hover:opacity-90 transition-all shadow-xl"
                                >
                                    {t('tools.academy.start_training')}
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                </Link>
                            ) : (
                                <button disabled className="w-full h-14 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 cursor-not-allowed">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                                    {t('tools.academy.unavailable')}
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Feature Highlight: CERTIFICATION */}
            <div className="glass-card rounded-[4rem] p-12 bg-slate-900 text-white relative overflow-hidden group">
                <div className="absolute inset-0 bg-premium-gradient opacity-10 group-hover:opacity-20 transition-opacity"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/10 blur-[150px] rounded-full"></div>

                <div className="relative z-10 flex flex-col lg:flex-row items-center gap-16">
                    <div className="flex-1 space-y-8 text-center lg:text-left">
                        <div className="inline-flex px-4 py-2 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-widest">{t('tools.academy.certification.launch')}</div>
                        <h2 className="text-5xl font-display font-black leading-[1.1]">{t('tools.academy.certification.title')}</h2>
                        <p className="text-xl text-slate-400 font-medium">{t('tools.academy.certification.desc')}</p>
                        <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                            <div className="flex items-center gap-3 px-6 py-4 bg-white/5 border border-white/10 rounded-3xl">
                                <span className="text-2xl">🏅</span>
                                <span className="text-sm font-bold">{t('tools.academy.certification.seal')}</span>
                            </div>
                            <div className="flex items-center gap-3 px-6 py-4 bg-white/5 border border-white/10 rounded-3xl">
                                <span className="text-2xl">📁</span>
                                <span className="text-sm font-bold">{t('tools.academy.certification.portfolio')}</span>
                            </div>
                        </div>
                    </div>
                    <div className="w-full lg:w-[400px] aspect-square bg-white/5 border-2 border-white/10 rounded-[3rem] rotate-3 flex items-center justify-center relative shadow-2xl">
                        <div className="absolute inset-4 border border-white/5 rounded-[2.5rem]"></div>
                        <div className="text-8xl animate-bounce">📜</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

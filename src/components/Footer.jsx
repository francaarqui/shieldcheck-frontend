import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Footer() {
    const { t } = useTranslation();

    return (
        <footer className="w-full bg-slate-900 text-slate-400 py-20 border-t border-slate-800 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
                    {/* About Section */}
                    <div className="lg:col-span-1 space-y-6">
                        <Link to="/" className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-indigo-600/20">S</div>
                            <h2 className="text-2xl font-black text-white tracking-tighter">ShieldCheck AI</h2>
                        </Link>
                        <p className="text-sm font-medium leading-relaxed max-w-xs">
                            {t('footer.about')}
                        </p>
                        <div className="space-y-3 pt-2">
                            <div className="flex items-center gap-3 group">
                                <div className="p-2 rounded-lg bg-slate-800/50 text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                </div>
                                <span className="text-xs font-bold uppercase tracking-widest text-slate-300">{t('footer.location')}</span>
                            </div>
                            <div className="flex items-center gap-3 group">
                                <div className="p-2 rounded-lg bg-slate-800/50 text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                </div>
                                <a href="mailto:contato@shieldcheck.ai" className="text-xs font-bold text-slate-300 hover:text-indigo-400 transition-colors">contato@shieldcheck.ai</a>
                            </div>
                        </div>
                    </div>

                    {/* Product Links */}
                    <div className="space-y-6">
                        <h3 className="text-white font-black text-xs uppercase tracking-[0.2em]">{t('footer.titles.product')}</h3>
                        <ul className="space-y-4">
                            <li><Link to="/#how-it-works" className="text-sm font-bold hover:text-indigo-400 transition-colors">{t('footer.links.how_it_works')}</Link></li>
                            <li><Link to="/analyze" className="text-sm font-bold hover:text-indigo-400 transition-colors">{t('footer.links.analyze')}</Link></li>
                            <li><Link to="/store-checker" className="text-sm font-bold hover:text-indigo-400 transition-colors">{t('footer.links.stores')}</Link></li>
                            <li><Link to="/fraud-dictionary" className="text-sm font-bold hover:text-indigo-400 transition-colors">{t('footer.links.fraud_dictionary')}</Link></li>
                            <li><Link to="/academy" className="text-sm font-bold hover:text-indigo-400 transition-colors">{t('footer.links.academy')}</Link></li>
                            <li><Link to="/b2b-portal" className="text-sm font-bold hover:text-indigo-400 transition-colors">{t('footer.links.api')}</Link></li>
                        </ul>
                    </div>

                    {/* Plans Links */}
                    <div className="space-y-6">
                        <h3 className="text-white font-black text-xs uppercase tracking-[0.2em]">{t('footer.titles.plans')}</h3>
                        <ul className="space-y-4">
                            <li><Link to="/#planos" className="text-sm font-bold hover:text-indigo-400 transition-colors">{t('footer.links.plan_free')}</Link></li>
                            <li><Link to="/#planos" className="text-sm font-bold hover:text-indigo-400 transition-colors">{t('footer.links.plan_premium')}</Link></li>
                            <li><Link to="/#planos" className="text-sm font-bold hover:text-indigo-400 transition-colors">{t('footer.links.plan_business')}</Link></li>
                            <li><Link to="/#planos" className="text-sm font-bold hover:text-indigo-400 transition-colors">{t('footer.links.compare_plans')}</Link></li>
                        </ul>
                    </div>

                    {/* Support Links */}
                    <div className="space-y-6">
                        <h3 className="text-white font-black text-xs uppercase tracking-[0.2em]">{t('footer.titles.support')}</h3>
                        <ul className="space-y-4">
                            <li><Link to="/help" className="text-sm font-bold hover:text-indigo-400 transition-colors">{t('footer.links.help_center')}</Link></li>
                            <li><Link to="/help" className="text-sm font-bold hover:text-indigo-400 transition-colors">{t('footer.links.contact')}</Link></li>
                            <li><Link to="/community" className="text-sm font-bold hover:text-indigo-400 transition-colors text-red-400 hover:text-red-500">{t('footer.links.report_scam')}</Link></li>
                            <li><Link to="/status" className="text-sm font-bold hover:text-indigo-400 transition-colors">{t('footer.links.system_status')}</Link></li>
                        </ul>
                    </div>

                    {/* Legal Links */}
                    <div className="space-y-6">
                        <h3 className="text-white font-black text-xs uppercase tracking-[0.2em]">{t('footer.titles.legal')}</h3>
                        <ul className="space-y-4">
                            <li><Link to="/privacy" className="text-sm font-bold hover:text-indigo-400 transition-colors">{t('footer.links.privacy_policy')}</Link></li>
                            <li><Link to="/terms" className="text-sm font-bold hover:text-indigo-400 transition-colors">{t('footer.links.terms_of_use')}</Link></li>
                            <li><Link to="/privacy" className="text-sm font-bold hover:text-indigo-400 transition-colors">{t('footer.links.cookie_policy')}</Link></li>
                            <li><Link to="/privacy" className="text-sm font-bold hover:text-indigo-400 transition-colors">{t('footer.links.lgpd_compliance')}</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="w-full h-px bg-slate-800 mt-20 mb-12"></div>

                <div className="flex flex-col lg:flex-row justify-between items-center gap-10">
                    {/* Social Media */}
                    <div className="flex items-center gap-6">
                        {[
                            { name: 'Instagram', icon: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069z' },
                            { name: 'LinkedIn', icon: 'M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z' },
                            { name: 'YouTube', icon: 'M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z' },
                            { name: 'X', icon: 'M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932 6.064-6.932zm-1.292 19.493h2.039L6.486 3.24H4.298l13.311 17.407z' }
                        ].map((social, i) => (
                            <a key={i} href="#" className="w-10 h-10 rounded-full border border-slate-800 flex items-center justify-center hover:bg-indigo-600 hover:border-indigo-600 hover:text-white transition-all duration-300" title={social.name}>
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d={social.icon} /></svg>
                            </a>
                        ))}
                    </div>

                    {/* Trust Seals */}
                    <div className="flex flex-wrap justify-center gap-6">
                        {[
                            { text: t('footer.seals.ai_protection'), icon: 'M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.744c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z' },
                            { text: t('footer.seals.military_encryption'), icon: 'M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z' },
                            { text: t('footer.seals.lgpd'), icon: 'M12 9v3.75m0-10.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.744c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z' }
                        ].map((seal, i) => (
                            <div key={i} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800/30 border border-slate-800 text-[10px] font-black uppercase tracking-widest text-slate-300">
                                <svg className="w-4 h-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d={seal.icon} /></svg>
                                {seal.text}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-16 text-center">
                    <p className="text-[10px] font-bold text-slate-500 max-w-4xl mx-auto leading-relaxed border-t border-slate-800 pt-8 mt-8">
                        {t('footer.disclaimer')}
                    </p>
                    <p className="mt-8 text-xs font-bold text-slate-600 transition-colors duration-300">
                        {t('footer.copyright')}
                    </p>
                </div>
            </div>
        </footer>
    );
}

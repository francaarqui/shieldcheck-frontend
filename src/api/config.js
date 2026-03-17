// Tenta pegar a URL do servidor do localStorage para facilitar testes locais/mobile
// Caso contrário, usa a variável de ambiente ou o fallback do Render
const getEffectiveApiUrl = () => {
    const savedUrl = localStorage.getItem('shieldcheck_api_url');
    if (savedUrl) return savedUrl;

    // Detecção automática de ambiente local para facilitar testes do usuário
    if (typeof window !== 'undefined') {
        const hostname = window.location.hostname;
        if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.startsWith('192.168.')) {
            return 'http://localhost:3001';
        }
    }

    return import.meta.env.VITE_API_URL || 'https://shieldcheck-api.onrender.com';
};

export const API_URL = getEffectiveApiUrl();
export const API_ENDPOINTS = {
    LOGIN: `${API_URL}/api/login`,
    REGISTER: `${API_URL}/api/register`,
    ANALYZE: `${API_URL}/api/analyze`,
    HISTORY: `${API_URL}/api/history`,
    SCAM_REPORTS: `${API_URL}/api/recent-scams`,
    SCAM_PATTERNS: `${API_URL}/api/scam-patterns`,
    SETTINGS: `${API_URL}/api/users/settings`,
    API_KEYS: `${API_URL}/api/developer/key`,
    REGENERATE_API_KEY: `${API_URL}/api/developer/key/regenerate`,
    INTELLIGENCE_STATS: `${API_URL}/api/intelligence-stats`,
    STORE_CHECK: `${API_URL}/api/check-store`,
    ACADEMY_SUBMIT: `${API_URL}/api/academy/submit`,
    ACADEMY_QUIZZES: `${API_URL}/api/academy/quizzes`,
    ACADEMY_AUDIO_SCENARIOS: `${API_URL}/api/academy/audio-scenarios`,
    REPORT_SCAM: `${API_URL}/api/report-scam`,
    ME: `${API_URL}/api/me`,
    RECENT_SCAMS: `${API_URL}/api/recent-scams`,
    TRENDS: `${API_URL}/api/admin/trends`,
    B2B_ANALYZE: `${API_URL}/api/v1/analyze`,
    ANALYZE_MEDIA: `${API_URL}/api/analyze-media`,
    CHECK_ITEM: `${API_URL}/api/check-item`,
    EXPAND_URL: `${API_URL}/api/expand-url`,
    DELETE_HISTORY_ITEM: `${API_URL}/api/user/history`,
    CREATE_CHECKOUT_SESSION: `${API_URL}/api/create-checkout-session`,
    B2B_EMPLOYEES: `${API_URL}/api/b2b/employees`,
    B2B_INVITE: `${API_URL}/api/b2b/invite`,
    B2B_REVOKE: `${API_URL}/api/b2b/employees`, // + /:id
    EXTENSION_REPORT: `${API_URL}/api/extension/report`,

    // Phase 4
    FAMILY_MEMBERS: `${API_URL}/api/family/members`,
    FAMILY_INVITE: `${API_URL}/api/family/invite`,
    SHIELD_SCORE: `${API_URL}/api/shield-score`,
    DARKWEB_SCAN: `${API_URL}/api/darkweb/scan`,
    ANALYZE_VISION: `${API_URL}/api/analyze-vision`,

    // Phase 6
    AFFILIATE_STATS: `${API_URL}/api/stats`,
    AFFILIATE_REFERRALS: `${API_URL}/api/referrals`,
    VERIFY_STORE: `${API_URL}/api/v1/verify-store`, // + /:domain

    // Community Intelligence Hub
    COMMUNITY_REPORTS: `${API_URL}/api/community/reports`,
    COMMUNITY_VOTE: `${API_URL}/api/community/vote`, // + /:id

    // Phase 7: Brand Protection
    BRAND_PROTECTION_STATUS: `${API_URL}/api/brand-protection/status`,
    GENERATE_TAKEDOWN: `${API_URL}/api/brand-protection/takedown`, // + /:id

    // Phase 7: Enterprise Analytics
    ENTERPRISE_ANALYTICS: `${API_URL}/api/analytics/enterprise`,
    CHECK_SOCIAL: `${API_URL}/api/check-social`,
    ANALYZE_DOC: `${API_URL}/api/analyze-doc`,
};



import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { API_ENDPOINTS } from '../api/config';
import { jsPDF } from 'jspdf';

export default function StoreChecker() {
    const { user } = useContext(AuthContext);
    const [activeTab, setActiveTab] = useState('store');
    const [value, setValue] = useState('');
    const [cnpj, setCnpj] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [cnpjResult, setCnpjResult] = useState(null);
    const [genericResult, setGenericResult] = useState(null);
    const [error, setError] = useState(null);
    const [showPremiumModal, setShowPremiumModal] = useState(false);

    const checkItem = async (e, val, type) => {
        if (e) e.preventDefault();
        const cleanValue = val || value;
        if (!cleanValue) return;
        setLoading(true);
        setGenericResult(null);
        setError(null);
        try {
            const res = await fetch(`${API_ENDPOINTS.CHECK_ITEM}?value=${encodeURIComponent(cleanValue)}&type=${type}`, {
                headers: { 'Authorization': `Bearer ${user?.token || ''}` }
            });
            if (res.status === 429) { setShowPremiumModal(true); return; }
            const data = await res.json();
            setGenericResult(data);
        } catch (err) { setError('Falha na consulta.'); } finally { setLoading(false); }
    };

    const checkStore = async (e) => {
        if (e) e.preventDefault();
        if (!value) return;
        setLoading(true);
        setResult(null);
        setError(null);
        try {
            const res = await fetch(`${API_ENDPOINTS.STORE_CHECK}?url=${encodeURIComponent(value)}`, {
                headers: { 'Authorization': `Bearer ${user?.token || ''}` }
            });
            if (res.status === 429) { setShowPremiumModal(true); return; }
            const data = await res.json();
            setResult(data);
        } catch (err) { setError('Falha na auditoria.'); } finally { setLoading(false); }
    };

    return (
        <div className="p-8 max-w-5xl mx-auto space-y-8">
            <h2 className="text-3xl font-black">Verificador de Segurança</h2>
            <div className="flex gap-2 bg-slate-100 p-2 rounded-xl overflow-x-auto">
                {['store', 'cnpj', 'pix', 'phone', 'link'].map(tab => (
                    <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 rounded-lg font-bold capitalize ${activeTab === tab ? 'bg-white shadow' : ''}`}>{tab}</button>
                ))}
            </div>
            <div className="bg-white p-6 rounded-3xl shadow-xl border border-slate-100">
                <input type="text" value={activeTab === 'cnpj' ? cnpj : value} onChange={(e) => activeTab === 'cnpj' ? setCnpj(e.target.value) : setValue(e.target.value)} className="w-full p-4 bg-slate-50 rounded-xl mb-4" placeholder="Digite aqui..." />
                <button onClick={activeTab === 'store' ? checkStore : (e) => checkItem(e, value, activeTab)} className="w-full p-4 bg-slate-900 text-white rounded-xl font-bold">Analisar Agora</button>
            </div>
            {genericResult && <div className="p-6 bg-slate-50 rounded-2xl"><strong>Resultado:</strong> {genericResult.status} - {genericResult.recommendation}</div>}
            {result && <div className="p-6 bg-slate-50 rounded-2xl"><strong>Score:</strong> {result.trustScore}% - {result.recommendation}</div>}
        </div>
    );
}

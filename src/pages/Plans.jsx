import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function Plans() {
    const { user } = useContext(AuthContext);

    return (
        <div className="animate-fadeIn max-w-5xl mx-auto">
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">Planos e Assinaturas</h2>
                <p className="text-slate-500 mt-3 text-lg">Atualize para o Premium e navegue pela internet de forma 100% blindada.</p>
            </div>

            <div className="max-w-4xl mx-auto mt-8">
                {/* Stripe Pricing Table UI */}
                <stripe-pricing-table
                    pricing-table-id="prctbl_1T9xAF98y67vPsr00QHnkOST"
                    publishable-key="pk_test_51T47Vc98y67vPsr0ZkNSafsEaQLLhQTskQxAs8XERImnxF5fcgEGiiGaXFK6PMVGtN2fS9D7XdwusK5eKSHDanUu00aEm1ECCw"
                    client-reference-id={user?.id}
                >
                </stripe-pricing-table>
            </div>
        </div>
    );
}

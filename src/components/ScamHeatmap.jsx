import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.heat';

const HeatmapLayer = ({ points }) => {
    const map = useMap();

    useEffect(() => {
        if (!points || points.length === 0) return;

        const heatPoints = points.map(p => [p.lat, p.lng, p.intensity]);
        const heatLayer = L.heatLayer(heatPoints, {
            radius: 25,
            blur: 15,
            maxZoom: 17,
            gradient: { 0.4: 'blue', 0.6: 'cyan', 0.7: 'lime', 0.8: 'yellow', 1: 'red' }
        }).addTo(map);

        return () => {
            map.removeLayer(heatLayer);
        };
    }, [map, points]);

    return null;
};

const ScamHeatmap = () => {
    const [points, setPoints] = useState([]);

    useEffect(() => {
        fetch('http://localhost:3000/api/scam-map')
            .then(res => res.json())
            .then(data => setPoints(data))
            .catch(err => console.error('Error fetching heatmap points:', err));
    }, []);

    return (
        <div className="w-full h-[500px] rounded-[3rem] overflow-hidden border border-slate-200 dark:border-slate-800 shadow-2xl relative">
            <div className="absolute top-6 left-6 z-[1000] bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800">
                <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tighter flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                    Inteligência Global em Tempo Real
                </h3>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold mt-1 uppercase tracking-widest">
                    Heatmap de tentativas de fraude detectadas
                </p>
            </div>

            <MapContainer
                center={[20, 0]}
                zoom={2}
                style={{ height: '100%', width: '100%', background: '#0f172a' }}
                scrollWheelZoom={false}
                attributionControl={false}
            >
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                />
                <HeatmapLayer points={points} />
            </MapContainer>
        </div>
    );
};

export default ScamHeatmap;

"use client";

import React from 'react';
import { Activity, Box, Zap, BarChart3, Wifi, Battery, Signal } from 'lucide-react';

const BarChart = ({ data }) => {
    const maxVal = Math.max(...data) || 100;

    return (
        <div className="w-full h-36 flex items-end justify-between gap-2 mt-2 relative px-2">
            {/* Referenciafondo */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
                <div className="w-full h-px bg-white/30 border-t border-dashed"></div>
                <div className="w-full h-px bg-white/30 border-t border-dashed"></div>
                <div className="w-full h-px bg-white/30 border-t border-dashed"></div>
            </div>

            {data.map((value, index) => {
                const heightPercentage = Math.max((value / maxVal) * 80, 10);
                const isSelected = index === 3;

                return (
                    <div key={index} className="w-full h-full flex items-end group relative">
                        <div
                            style={{ height: `${heightPercentage}%` }}
                            className={`w-full rounded-t-sm transition-all duration-1000 ease-out relative ${isSelected
                                ? 'bg-[#00CFFF] shadow-[0_0_20px_rgba(0,207,255,0.4)]'
                                : 'bg-slate-700/80 hover:bg-slate-600'
                                }`}
                        >
                            {/* Pasar el ratón */}
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-black text-[5px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                                {value}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default function PhoneMockup() {
    const chartData = [40, 65, 45, 90, 70, 55];

    return (
        <div className="relative w-[280px] h-[580px] bg-[#050a0c] rounded-[3.5rem] border-[8px] border-[#1a1a1a] shadow-[0_0_60px_-15px_rgba(0,207,255,0.15)] overflow-hidden group transition-transform duration-500 hover:scale-[1.02]">

            {/* Dynamic Island */}
            <div className="absolute top-0 inset-x-0 h-8 bg-black z-20 rounded-b-3xl mx-auto w-32 border-b border-white/10"></div>

            {/* Contenido */}
            <div className="absolute inset-0 bg-[#0a0a10] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#002a33] via-[#0a0a10] to-[#000000] p-6 flex flex-col pt-12">

                {/* Barra de estado */}
                <div className="flex items-center justify-between text-slate-400 mb-6 px-1">
                    <span className="text-[10px] font-bold font-mono">NEWTEX OS</span>
                    <div className="flex gap-2 opacity-70">
                        <Signal size={12} />
                        <Wifi size={12} />
                        <Battery size={12} />
                    </div>
                </div>

                {/* Header App */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-white text-xl font-bold tracking-tight">Hola, Inés</h2>
                        <p className="text-slate-400 text-xs">Resumen de hoy</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#00CFFF] to-blue-600 p-[2px]">
                        <div className="w-full h-full rounded-full bg-black flex items-center justify-center text-xs font-bold text-white">
                            NT
                        </div>
                    </div>
                </div>

                {/* Hero */}
                <div className="flex flex-col gap-4 mb-6">
                    <div className="grid grid-cols-2 gap-3">
                        {/* Card 1 */}
                        <div className="bg-white/5 backdrop-blur-md p-3 rounded-2xl border border-white/10 flex flex-col justify-between h-24 hover:bg-white/10 transition-colors cursor-default">
                            <div className="bg-[#00CFFF]/20 w-8 h-8 rounded-lg flex items-center justify-center text-[#00CFFF]">
                                <Activity size={16} />
                            </div>
                            <div>
                                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Rendimiento</p>
                                <p className="text-lg font-bold text-white">98.2%</p>
                            </div>
                        </div>
                        {/* Card 2 */}
                        <div className="bg-white/5 backdrop-blur-md p-3 rounded-2xl border border-white/10 flex flex-col justify-between h-24 hover:bg-white/10 transition-colors cursor-default">
                            <div className="bg-purple-500/20 w-8 h-8 rounded-lg flex items-center justify-center text-purple-400">
                                <Box size={16} />
                            </div>
                            <div>
                                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Pedidos</p>
                                <p className="text-lg font-bold text-white">+124</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Charts */}
                <div className="flex flex-col gap-2 mb-4">
                    <div className="flex justify-between items-center">
                        <h3 className="text-white text-sm font-bold">Actividad Semanal</h3>
                        <span className="text-[8px] text-[#00CFFF] bg-[#00CFFF]/8 px-2 py-1 rounded-full">+12% vs ayer</span>
                    </div>
                    <BarChart data={chartData} />
                </div>

                {/* Lista Boton */}
                <div className="flex flex-col gap-3 flex-1 overflow-hidden">
                    <h3 className="text-white text-sm font-bold">Sistemas Activos</h3>

                    <div className="w-full bg-white/5 hover:bg-white/10 transition-colors rounded-xl border border-white/5 flex items-center p-3 gap-3 cursor-default">
                        <div className="size-8 rounded-lg bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                            <Zap size={16} className="text-emerald-400" />
                        </div>
                        <div className="flex-1">
                            <p className="text-xs font-bold text-white">Control Stock</p>
                            <p className="text-[10px] text-slate-400">Sincronizado hace 2m</p>
                        </div>
                        <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_5px_#10b981]"></div>
                    </div>

                    <div className="w-full bg-white/5 hover:bg-white/10 transition-colors rounded-xl border border-white/5 flex items-center p-3 gap-3 cursor-default">
                        <div className="size-8 rounded-lg bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                            <BarChart3 size={16} className="text-blue-400" />
                        </div>
                        <div className="flex-1">
                            <p className="text-xs font-bold text-white">CRM Connect</p>
                            <p className="text-[10px] text-slate-400">3 nuevas oportunidades</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Overlay */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-white/5 via-transparent to-transparent opacity-50 rounded-[3rem]"></div>
        </div>
    );
}
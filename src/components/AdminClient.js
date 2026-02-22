"use client";
import React, { useState } from 'react';
import { Shield, Check, X, RefreshCw, Loader2, Lock, Users, Clock, FileText, LayoutDashboard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import InvoiceGenerator from './InvoiceGenerator';

const API_BASE_URL = 'https://api.newtex.es';

const AdminClient = () => {
    // --- ESTADOS ---
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [loginLoading, setLoginLoading] = useState(false);
    const [loginError, setLoginError] = useState('');
    const [view, setView] = useState('demos');

    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState(null);

    // --- LÓGICA ---
    const handleLogin = async (e) => {
        e.preventDefault();
        setLoginLoading(true);
        setLoginError('');
        try {
            const res = await fetch(`${API_BASE_URL}/api/admin/demo/pending`, {
                headers: { 'x-admin-api-key': password }
            });
            if (res.ok) {
                const data = await res.json();
                setRequests(data);
                setIsAuthenticated(true);
            } else {
                throw new Error("API Key inválida o error del servidor.");
            }
        } catch (e) {
            setLoginError(e.message);
        } finally {
            setLoginLoading(false);
        }
    };

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/api/admin/demo/pending`, {
                headers: { 'x-admin-api-key': password }
            });
            if (res.ok) {
                setRequests(await res.json());
            } else {
                alert("Clave incorrecta. Recargando...");
                window.location.reload();
            }
        } catch (e) { console.error(e); } finally { setLoading(false); }
    };

    const handleApprove = async (id, email) => { /* ... (Lógica sin cambios) */ };
    const handleReject = async (id) => { /* ... (Lógica sin cambios) */ };

    // --- RENDER: PANTALLA LOGIN ---
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-[#0A0A12] text-white font-sans relative flex items-center justify-center p-4 overflow-hidden">
                <div className="absolute inset-0 z-0 opacity-40">
                    <motion.div
                        className="absolute top-[-20%] left-[-20%] w-[50vw] h-[50vw] bg-gradient-to-br from-blue-900 via-transparent to-transparent rounded-full"
                        animate={{ x: [0, 100, 0], y: [0, 50, 0] }}
                        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                    />
                    <motion.div
                        className="absolute bottom-[-20%] right-[-20%] w-[40vw] h-[40vw] bg-gradient-to-tl from-[#00CFFF]/70 via-transparent to-transparent rounded-full"
                        animate={{ x: [0, -100, 0], y: [0, -50, 0] }}
                        transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
                    />
                </div>
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-soft-light pointer-events-none"></div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="relative z-10 w-full max-w-sm"
                >
                    <form onSubmit={handleLogin} className="bg-black/20 backdrop-blur-2xl border border-white/10 p-8 rounded-2xl shadow-2xl shadow-black/40">
                        <motion.div
                            className="w-16 h-16 bg-gradient-to-br from-blue-600 to-[#00CFFF] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/20"
                            whileHover={{ scale: 1.1 }}
                        >
                            <Lock size={28} />
                        </motion.div>
                        <h1 className="text-2xl font-bold text-center mb-2">Acceso Admin</h1>
                        <p className="text-slate-400 text-sm text-center mb-6">Panel interno de NEWTEX.</p>
                        <div className="relative group">
                            <input
                                type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white mb-4 focus:border-[#00CFFF] focus:ring-1 focus:ring-[#00CFFF] outline-none transition-all placeholder:text-slate-600"
                                placeholder="API KEY..." autoFocus
                            />
                            <div className="absolute inset-y-0 right-4 flex items-center text-slate-600 group-focus-within:text-[#00CFFF] transition-colors pointer-events-none">
                                <Shield size={16} />
                            </div>
                        </div>
                        <button type="submit" disabled={loginLoading} className="w-full bg-[#00CFFF] hover:bg-white text-black font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,207,255,0.2)] hover:shadow-[0_0_30px_rgba(0,207,255,0.4)] disabled:opacity-50 disabled:cursor-not-allowed">
                            {loginLoading ? <Loader2 className="animate-spin" /> : "Entrar al Panel"}
                        </button>
                        <AnimatePresence>
                            {loginError && (
                                <motion.p initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="text-red-400 text-xs text-center mt-4">{loginError}</motion.p>
                            )}
                        </AnimatePresence>
                    </form>
                </motion.div>
            </div>
        );
    }

    // --- RENDER: DASHBOARD ---
    return (
        <div className="min-h-screen bg-black text-white font-sans p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                    <div>
                        <h1 className="text-3xl font-black tracking-tighter mb-1">NEWTEX <span className="text-[#00CFFF]">ADMIN</span></h1>
                        <p className="text-slate-400 text-sm">Sistema Centralizado de Operaciones</p>
                    </div>
                    <div className="flex items-center gap-3 bg-slate-900 p-1.5 rounded-xl border border-slate-800">
                        <TabButton icon={LayoutDashboard} label="Gestión Demos" active={view === 'demos'} onClick={() => setView('demos')} />
                        <TabButton icon={FileText} label="Facturación" active={view === 'invoices'} onClick={() => setView('invoices')} />
                    </div>
                </header>

                <AnimatePresence mode="wait">
                    {view === 'demos' ? (
                        <motion.div key="demos" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
                            <div className="flex justify-end mb-6">
                                <button onClick={fetchRequests} className="p-2 bg-slate-900 border border-slate-800 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors">
                                    <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
                                </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                                <StatCard icon={Users} label="Solicitudes Pendientes" value={requests.length} color="blue" />
                                <StatCard icon={Check} label="Demos Activas (Mock)" value="--" color="emerald" />
                                <StatCard icon={Clock} label="Tiempo Respuesta (Mock)" value="< 2h" color="purple" />
                            </div>
                            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
                                <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
                                    <h3 className="font-bold text-lg text-white">Cola de Aprobación</h3>
                                    <span className="text-xs bg-blue-900/30 text-blue-400 px-3 py-1 rounded-full border border-blue-500/20 font-mono">{requests.length} NUEVOS</span>
                                </div>
                                {requests.length === 0 ? (
                                    <div className="p-16 text-center text-slate-500 flex flex-col items-center">
                                        <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mb-4"><Check size={32} className="opacity-50" /></div>
                                        <p className="text-lg font-medium">¡Todo limpio!</p>
                                        <p className="text-sm opacity-60">No hay solicitudes pendientes de revisión.</p>
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto"><table className="w-full text-left"> {/* ... (Tu tabla de demos) ... */}</table></div>
                                )}
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div key="invoices" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
                            <InvoiceGenerator />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

// --- SUBCOMPONENTES ---
const StatCard = ({ icon: Icon, label, value, color }) => { /* ... (Sin cambios) */ };
const TabButton = ({ icon: Icon, label, active, onClick }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${active ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
    >
        <Icon size={16} /> {label}
    </button>
);

export default AdminClient;
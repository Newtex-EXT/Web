"use client";
import React, { useState } from 'react';
import { Shield, Check, X, RefreshCw, Loader2, Lock, Users, Clock, FileText, LayoutDashboard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import InvoiceGenerator from './InvoiceGenerator';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.newtex.es';

const AdminClient = () => {

    // ESTADOS 
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [loginLoading, setLoginLoading] = useState(false);
    const [loginError, setLoginError] = useState('');
    const [view, setView] = useState('demos');

    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState(null);

    // LÓGICA DE AUTENTICACIÓN
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
                alert("Clave de sesión expirada o incorrecta. Recargando entorno...");
                window.location.reload();
            }
        } catch (e) {
            console.error("Error fetching requests:", e);
        } finally {
            setLoading(false);
        }
    };

    // LÓGICA DE APROBACIÓN/RECHAZO
    const handleApprove = async (id, email) => {
        if (!confirm(`¿Aprobar acceso a la demo para ${email}? Se enviará un correo automáticamente.`)) return;

        setActionLoading(id);
        try {
            const res = await fetch(`${API_BASE_URL}/api/admin/demo/approve`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-admin-api-key': password
                },
                body: JSON.stringify({
                    cliente_id: id,
                    dias_expiracion: 7,
                    aprobado_por_admin_email: 'admin-dashboard',
                })
            });

            if (res.ok) {
                setRequests(prev => prev.filter(r => r.id !== id));
                alert("Demo aprobada y correo enviado con éxito.");
            } else {
                const errorData = await res.json();
                alert(`Error al aprobar: ${errorData.error}`);
            }
        } catch (e) {
            alert("Error crítico de red al intentar aprobar.");
        } finally {
            setActionLoading(null);
        }
    };

    const handleReject = async (id) => {
        if (!confirm("¿Rechazar esta solicitud de demo de forma definitiva?")) return;

        setActionLoading(id);
        try {
            const res = await fetch(`${API_BASE_URL}/api/admin/demo/reject`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-admin-api-key': password
                },
                body: JSON.stringify({ cliente_id: id })
            });

            if (res.ok) {
                setRequests(prev => prev.filter(r => r.id !== id));
            } else {
                const errorData = await res.json();
                alert(`Error al rechazar: ${errorData.error}`);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setActionLoading(null);
        }
    };

    // RENDER: PANTALLA LOGIN
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

    // RENDER: DASHBOARD
    return (
        <div className="min-h-screen bg-[#0A0A12] text-white font-sans relative overflow-hidden">
            {/* FONDO ARQUITECTÓNICO DEL DASHBOARD */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[50vh] bg-[#00CFFF] opacity-[0.04] blur-[120px] rounded-full"></div>
                <div className="absolute bottom-0 right-0 w-[50vw] h-[50vh] bg-blue-800 opacity-[0.06] blur-[100px] rounded-full"></div>
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.04] mix-blend-screen"></div>
            </div>

            <div className="relative z-10 p-4 md:p-8 max-w-7xl mx-auto h-screen flex flex-col">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 shrink-0">
                    <div>
                        <h1 className="text-3xl font-black tracking-tighter mb-1">NEWTEX <span className="text-[#00CFFF]">ADMIN</span></h1>
                        <p className="text-slate-400 text-sm">Sistema Centralizado de Operaciones</p>
                    </div>
                    <div className="flex items-center gap-3 bg-slate-900/80 backdrop-blur-md p-1.5 rounded-xl border border-slate-800 shadow-lg">
                        <TabButton icon={LayoutDashboard} label="Gestión Demos" active={view === 'demos'} onClick={() => setView('demos')} />
                        <TabButton icon={FileText} label="Facturación" active={view === 'invoices'} onClick={() => setView('invoices')} />
                    </div>
                </header>

                <div className="flex-1 overflow-hidden">
                    <AnimatePresence mode="wait">
                        {view === 'demos' ? (
                            <motion.div key="demos" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }} className="h-full flex flex-col">
                                <div className="flex justify-end mb-6 shrink-0">
                                    <button onClick={fetchRequests} className="p-2 bg-slate-900/80 border border-slate-800 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors backdrop-blur-md shadow-lg">
                                        <RefreshCw size={20} className={loading ? "animate-spin text-[#00CFFF]" : ""} />
                                    </button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 shrink-0">
                                    <StatCard icon={Users} label="Solicitudes Pendientes" value={requests.length} color="blue" />
                                    <StatCard icon={Check} label="Demos Activas (Mock)" value="--" color="emerald" />
                                    <StatCard icon={Clock} label="Tiempo Respuesta (Mock)" value="< 2h" color="purple" />
                                </div>
                                <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col flex-1 min-h-0">
                                    <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-950/50 shrink-0">
                                        <h3 className="font-bold text-lg text-white">Cola de Aprobación</h3>
                                        <span className="text-xs bg-blue-900/30 text-blue-400 px-3 py-1 rounded-full border border-blue-500/20 font-mono">{requests.length} NUEVOS</span>
                                    </div>
                                    {requests.length === 0 ? (
                                        <div className="p-16 text-center text-slate-500 flex flex-col items-center justify-center flex-1">
                                            <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mb-4"><Check size={32} className="opacity-50" /></div>
                                            <p className="text-lg font-medium">Lógica operativa despejada</p>
                                            <p className="text-sm opacity-60">No hay solicitudes pendientes de revisión en la cola.</p>
                                        </div>
                                    ) : (
                                        <div className="overflow-y-auto custom-scrollbar flex-1">
                                            <table className="w-full text-left">
                                                <thead className="bg-slate-950/80 text-slate-500 text-xs uppercase tracking-wider font-bold sticky top-0 z-10 backdrop-blur-md">
                                                    <tr>
                                                        <th className="p-4">Fecha</th>
                                                        <th className="p-4">Cliente / Empresa</th>
                                                        <th className="p-4">Contacto</th>
                                                        <th className="p-4">Servicio</th>
                                                        <th className="p-4 text-right">Acciones</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-800/50 text-sm">
                                                    {requests.map((req) => (
                                                        <tr key={req.id} className="hover:bg-slate-800/40 transition-colors group">
                                                            <td className="p-4 text-slate-400 font-mono text-xs">
                                                                {new Date(req.fecha_solicitud).toLocaleDateString()} <br />
                                                                <span className="text-slate-600">{new Date(req.fecha_solicitud).toLocaleTimeString()}</span>
                                                            </td>
                                                            <td className="p-4">
                                                                <p className="font-bold text-white text-base">{req.nombre}</p>
                                                                <div className="flex items-center gap-2 mt-1">
                                                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                                                                    <p className="text-slate-400 text-xs font-medium uppercase tracking-wide">{req.nombre_empresa}</p>
                                                                </div>
                                                            </td>
                                                            <td className="p-4 text-slate-300">
                                                                <p>{req.correo_electronico}</p>
                                                                <p className="text-slate-500 text-xs mt-0.5 font-mono">{req.telefono}</p>
                                                            </td>
                                                            <td className="p-4">
                                                                <span className="bg-blue-900/20 border border-blue-500/30 px-3 py-1 rounded-full text-xs text-blue-300 font-bold shadow-[0_0_10px_rgba(59,130,246,0.1)]">
                                                                    {req.servicio}
                                                                </span>
                                                            </td>
                                                            <td className="p-4 text-right">
                                                                {actionLoading === req.id ? (
                                                                    <div className="flex justify-end">
                                                                        <Loader2 size={20} className="animate-spin text-[#00CFFF]" />
                                                                    </div>
                                                                ) : (
                                                                    <div className="flex gap-2 justify-end opacity-80 group-hover:opacity-100 transition-opacity">
                                                                        <button
                                                                            onClick={() => handleReject(req.id)}
                                                                            className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-colors border border-red-500/20"
                                                                            title="Rechazar"
                                                                        >
                                                                            <X size={18} />
                                                                        </button>
                                                                        <button
                                                                            onClick={() => handleApprove(req.id, req.correo_electronico)}
                                                                            className="px-4 py-2 bg-[#00CFFF]/10 text-[#00CFFF] hover:bg-[#00CFFF] hover:text-black border border-[#00CFFF]/30 rounded-lg font-bold text-xs flex items-center gap-2 transition-all shadow-lg hover:shadow-[0_0_15px_rgba(0,207,255,0.4)]"
                                                                        >
                                                                            <Check size={14} /> Aprobar Acceso
                                                                        </button>
                                                                    </div>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div key="invoices" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }} className="h-full">
                                <InvoiceGenerator />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

// SUBCOMPONENTES
const StatCard = ({ icon: Icon, label, value, color }) => {
    const colors = {
        blue: "bg-blue-500/10 text-blue-400 border-blue-500/20",
        emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        purple: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    };
    return (
        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 p-5 rounded-xl flex items-center gap-4 shadow-lg hover:border-slate-700 transition-colors">
            <div className={`p-3 rounded-lg border ${colors[color]}`}>
                <Icon size={24} />
            </div>
            <div>
                <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">{label}</p>
                <p className="text-2xl font-mono font-bold text-white mt-1">{value}</p>
            </div>
        </div>
    );
};

const TabButton = ({ icon: Icon, label, active, onClick }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${active ? 'bg-slate-800 text-white shadow-md' : 'text-slate-500 hover:text-slate-300'}`}
    >
        <Icon size={16} /> {label}
    </button>
);

export default AdminClient;
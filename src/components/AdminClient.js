"use client";
import React, { useState, useEffect } from 'react';
import { Shield, Check, X, RefreshCw, Loader2, Lock, Users, Clock } from 'lucide-react';

const API_BASE_URL = 'http://localhost:3001';

const AdminClient = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [requests, setRequests] = useState([]);
    const [actionLoading, setActionLoading] = useState(null);

    // Login 
    const handleLogin = (e) => {
        e.preventDefault();
        if (password.length > 5) {
            setIsAuthenticated(true);
            fetchRequests();
        }
    };

    // Cargar datos
    const fetchRequests = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/api/admin/demo/pending`, {
                headers: { 'x-admin-api-key': password }
            });
            if (res.ok) {
                const data = await res.json();
                setRequests(data);
            } else {
                alert("Clave incorrecta o error de servidor");
                setIsAuthenticated(false);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    // Aprobar
    const handleApprove = async (id, email) => {
        if (!confirm(`¿Aprobar demo para ${email}? Se enviará el correo.`)) return;

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
                alert("✅ Demo aprobada y enviada");
            } else {
                alert("❌ Error al aprobar");
            }
        } catch (e) {
            alert("Error de red");
        } finally {
            setActionLoading(null);
        }
    };

    // Rechazar
    const handleReject = async (id) => {
        if (!confirm("¿Rechazar solicitud?")) return;

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
            }
        } catch (e) {
            console.error(e);
        } finally {
            setActionLoading(null);
        }
    };

    // PANTALLA LOGIN 
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center p-4">
                <form onSubmit={handleLogin} className="bg-slate-900 border border-slate-800 p-8 rounded-2xl w-full max-w-sm text-center">
                    <div className="w-16 h-16 bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-500">
                        <Lock size={32} />
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-2">Acceso Admin</h1>
                    <p className="text-slate-400 text-sm mb-6">Introduce la Admin API Key para gestionar demos.</p>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-black border border-slate-700 rounded-lg px-4 py-3 text-white mb-4 focus:border-blue-500 outline-none"
                        placeholder="API KEY..."
                    />
                    <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg transition-colors">
                        Entrar al Panel
                    </button>
                </form>
            </div>
        );
    }

    // DASHBOARD
    return (
        <div className="min-h-screen bg-black text-white font-sans p-8">
            <div className="max-w-6xl mx-auto">
                <header className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-3xl font-black tracking-tighter mb-1">NEWTEX <span className="text-blue-500">Centro de control</span></h1>
                        <p className="text-slate-400 text-sm">Gestión de Solicitudes Entrantes</p>
                    </div>
                    <button onClick={fetchRequests} className="p-2 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors">
                        <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
                    </button>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <StatCard icon={Users} label="Solicitudes Pendientes" value={requests.length} color="blue" />
                    <StatCard icon={Check} label="Demos Aprobadas" value="-" color="emerald" />
                    <StatCard icon={Clock} label="Lucas marica." value="< 2h" color="purple" />
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
                    <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                        <h3 className="font-bold text-lg">Cola de Aprobación</h3>
                        <span className="text-xs bg-blue-900/30 text-blue-400 px-3 py-1 rounded-full border border-blue-500/20">{requests.length} nuevos</span>
                    </div>

                    {requests.length === 0 ? (
                        <div className="p-12 text-center text-slate-500">
                            <Check size={48} className="mx-auto mb-4 opacity-20" />
                            <p>¡Todo limpio! No hay solicitudes pendientes.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-950 text-slate-400 text-xs uppercase">
                                    <tr>
                                        <th className="p-4">Fecha</th>
                                        <th className="p-4">Cliente / Empresa</th>
                                        <th className="p-4">Contacto</th>
                                        <th className="p-4">Servicio</th>
                                        <th className="p-4 text-right">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800 text-sm">
                                    {requests.map((req) => (
                                        <tr key={req.id} className="hover:bg-slate-800/30 transition-colors">
                                            <td className="p-4 text-slate-400">
                                                {new Date(req.fecha_solicitud).toLocaleDateString()} <br />
                                                <span className="text-[10px]">{new Date(req.fecha_solicitud).toLocaleTimeString()}</span>
                                            </td>
                                            <td className="p-4">
                                                <p className="font-bold text-white">{req.nombre}</p>
                                                <p className="text-slate-500 text-xs">{req.nombre_empresa}</p>
                                            </td>
                                            <td className="p-4 text-slate-300">
                                                {req.correo_electronico} <br />
                                                <span className="text-slate-500">{req.telefono}</span>
                                            </td>
                                            <td className="p-4">
                                                <span className="bg-slate-800 border border-slate-700 px-2 py-1 rounded text-xs text-blue-300 font-medium">
                                                    {req.servicio}
                                                </span>
                                            </td>
                                            <td className="p-4 text-right">
                                                {actionLoading === req.id ? (
                                                    <Loader2 size={20} className="animate-spin text-blue-500 ml-auto" />
                                                ) : (
                                                    <div className="flex gap-2 justify-end">
                                                        <button
                                                            onClick={() => handleReject(req.id)}
                                                            className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-colors border border-red-500/20"
                                                            title="Rechazar"
                                                        >
                                                            <X size={18} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleApprove(req.id, req.correo_electronico)}
                                                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-xs flex items-center gap-2 transition-colors shadow-lg shadow-emerald-900/20"
                                                        >
                                                            <Check size={14} /> Aprobar
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
            </div>
        </div>
    );
};

const StatCard = ({ icon: Icon, label, value, color }) => {
    const colors = {
        blue: "bg-blue-500/10 text-blue-400 border-blue-500/20",
        emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        purple: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    };
    return (
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex items-center gap-4">
            <div className={`p-3 rounded-lg border ${colors[color]}`}>
                <Icon size={24} />
            </div>
            <div>
                <p className="text-xs text-slate-500 uppercase font-bold">{label}</p>
                <p className="text-2xl font-mono font-bold text-white">{value}</p>
            </div>
        </div>
    );
};

export default AdminClient;
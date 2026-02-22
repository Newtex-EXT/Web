"use client";
import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Download, Save, Calculator, FileText, History, RefreshCw } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { motion, AnimatePresence } from 'framer-motion';

const InvoiceGenerator = () => {
    // ESTADOS NAVEGACIÓN
    const [viewTab, setViewTab] = useState('editor');

    // ESTADOS EDITOR
    const [invoiceData, setInvoiceData] = useState({
        number: `NTX-${new Date().getFullYear()}-001`,
        date: new Date().toISOString().split('T')[0],
        clientName: '',
        clientCif: '',
        clientAddress: '',
        clientEmail: '',
        retention: 7,
        iva: 21
    });

    const [items, setItems] = useState([
        { description: 'Servicios de Consultoría Tecnológica', qty: 1, price: 0 }
    ]);

    const [totals, setTotals] = useState({ base: 0, ivaAmount: 0, irpfAmount: 0, total: 0 });
    const [loading, setLoading] = useState(false);

    // ESTADOS HISTORIAL
    const [historyData, setHistoryData] = useState([]);
    const [loadingHistory, setLoadingHistory] = useState(false);

    // CÁLCULOS 
    useEffect(() => {
        const base = items.reduce((acc, item) => acc + (item.qty * item.price), 0);
        const ivaAmount = base * (invoiceData.iva / 100);
        const irpfAmount = base * (invoiceData.retention / 100);
        const total = base + ivaAmount - irpfAmount;
        setTotals({ base, ivaAmount, irpfAmount, total });
    }, [items, invoiceData.iva, invoiceData.retention]);

    useEffect(() => {
        if (viewTab === 'history') {
            fetchHistory();
        }
    }, [viewTab]);

    // MANEJADORES 
    const handleItemChange = (index, field, value) => {
        const newItems = [...items];
        newItems[index][field] = field === 'description' ? value : parseFloat(value) || 0;
        setItems(newItems);
    };

    const addItem = () => setItems([...items, { description: '', qty: 1, price: 0 }]);
    const removeItem = (index) => setItems(items.filter((_, i) => i !== index));

    // FETCH HISTORIAL
    const fetchHistory = async () => {
        setLoadingHistory(true);
        try {
            const ADMIN_API_KEY = process.env.NEXT_PUBLIC_ADMIN_API_KEY;
            const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.newtex.es';

            const response = await fetch(`${API_BASE_URL}/api/admin/invoice/history`, {
                headers: { 'x-admin-api-key': ADMIN_API_KEY }
            });

            if (response.ok) {
                const data = await response.json();
                setHistoryData(data);
            } else {
                throw new Error("Error al cargar historial");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoadingHistory(false);
        }
    };

    // PDF
    const generatePDF = (saveToDb = false, customData = null, customItems = null, customTotals = null) => {
        const dataToUse = customData || invoiceData;
        const itemsToUse = customItems || items;
        const totalsToUse = customTotals || totals;

        const doc = new jsPDF();
        const primaryColor = [0, 207, 255];
        const darkColor = [20, 20, 20];

        doc.setFillColor(...darkColor);
        doc.rect(0, 0, 210, 40, 'F');
        doc.setFontSize(22);
        doc.setTextColor(...primaryColor);
        doc.setFont("helvetica", "bold");
        doc.text("NEWTEX", 15, 20);
        doc.setFontSize(10);
        doc.setTextColor(255, 255, 255);
        doc.setFont("helvetica", "normal");
        doc.text("Ingeniería de Software & Automatización", 15, 26);

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(12);
        doc.text("FACTURA", 180, 15, { align: 'right' });
        doc.setFontSize(10);
        doc.text(`Nº: ${dataToUse.number || dataToUse.numero_factura}`, 180, 22, { align: 'right' });

        const dateStr = customData ? new Date(customData.fecha_emision).toLocaleDateString() : dataToUse.date;
        doc.text(`Fecha: ${dateStr}`, 180, 27, { align: 'right' });

        doc.setTextColor(0, 0, 0);
        doc.setFontSize(9);

        doc.setFont("helvetica", "bold");
        doc.text("DE:", 15, 50);
        doc.setFont("helvetica", "normal");
        doc.text("NEWTEX ESPJ", 15, 55);
        doc.text("NIF: E26701060", 15, 60);
        doc.text("C. Río Jaranda, 7 Bajo C, 10005 Cáceres", 15, 65);
        doc.text("info@newtex.es", 15, 70);

        doc.setFont("helvetica", "bold");
        doc.text("PARA:", 110, 50);
        doc.setFont("helvetica", "normal");
        doc.text(dataToUse.clientName || dataToUse.cliente_nombre || "Cliente Genérico", 110, 55);
        doc.text(dataToUse.clientCif || dataToUse.cliente_cif || "", 110, 60);
        if (dataToUse.clientAddress) doc.text(dataToUse.clientAddress, 110, 65);

        const tableBody = itemsToUse.map(item => [
            item.description,
            item.qty,
            `${parseFloat(item.price).toFixed(2)} €`,
            `${(parseFloat(item.qty) * parseFloat(item.price)).toFixed(2)} €`
        ]);

        autoTable(doc, {
            startY: 80,
            head: [['Descripción', 'Cant.', 'Precio Unit.', 'Total']],
            body: tableBody,
            theme: 'grid',
            headStyles: { fillColor: darkColor, textColor: primaryColor },
            styles: { fontSize: 9 },
            columnStyles: { 0: { cellWidth: 90 }, 3: { halign: 'right' } }
        });

        const finalY = doc.lastAutoTable.finalY + 10;
        const ivaAmountCalc = totalsToUse.ivaAmount || (totalsToUse.base_imponible * (dataToUse.iva_porcentaje / 100));
        const irpfAmountCalc = totalsToUse.irpfAmount || (totalsToUse.base_imponible * (dataToUse.irpf_porcentaje / 100));
        const baseCalc = totalsToUse.base || totalsToUse.base_imponible;
        const totalCalc = totalsToUse.total || totalsToUse.total_factura;

        doc.setFontSize(10);
        doc.text(`Base Imponible:`, 140, finalY);
        doc.text(`${parseFloat(baseCalc).toFixed(2)} €`, 190, finalY, { align: 'right' });
        doc.text(`IVA (${dataToUse.iva || dataToUse.iva_porcentaje}%):`, 140, finalY + 5);
        doc.text(`${parseFloat(ivaAmountCalc).toFixed(2)} €`, 190, finalY + 5, { align: 'right' });
        doc.text(`IRPF (-${dataToUse.retention || dataToUse.irpf_porcentaje}%):`, 140, finalY + 10);
        doc.setTextColor(200, 0, 0);
        doc.text(`-${parseFloat(irpfAmountCalc).toFixed(2)} €`, 190, finalY + 10, { align: 'right' });

        doc.setFillColor(...primaryColor);
        doc.rect(130, finalY + 15, 70, 10, 'F');
        doc.setTextColor(0, 0, 0);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.text(`TOTAL A PAGAR:`, 135, finalY + 21);
        doc.text(`${parseFloat(totalCalc).toFixed(2)} €`, 195, finalY + 21, { align: 'right' });

        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(100);
        doc.text("Forma de Pago: Transferencia Bancaria", 15, 270);
        doc.text("IBAN: ES62 0081 7840 6600 0176 0682 (Banco Sabadell)", 15, 275);
        doc.text("www.newtex.es  |  info@newtex.es  |  +34 608 77 10 56", 15, 280);

        if (saveToDb) return doc.output('blob');
        doc.save(`Factura_${dataToUse.number || dataToUse.numero_factura}.pdf`);
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            const ADMIN_API_KEY = process.env.NEXT_PUBLIC_ADMIN_API_KEY;
            const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.newtex.es';

            const response = await fetch(`${API_BASE_URL}/api/admin/invoice/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-admin-api-key': ADMIN_API_KEY,
                },
                body: JSON.stringify({
                    numero_factura: invoiceData.number,
                    cliente_nombre: invoiceData.clientName,
                    cliente_cif: invoiceData.clientCif,
                    fecha_emision: invoiceData.date,
                    base_imponible: totals.base,
                    iva_porcentaje: invoiceData.iva,
                    irpf_porcentaje: invoiceData.retention,
                    total: totals.total,
                    items_json: items,
                    estado: 'EMITIDA'
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `Error del servidor: ${response.status}`);
            }

            generatePDF(false);
            alert('✅ Factura guardada y descargada.');

            const currentNum = parseInt(invoiceData.number.split('-')[2]);
            const nextNum = (currentNum + 1).toString().padStart(3, '0');
            setInvoiceData(prev => ({ ...prev, number: `NTX-${new Date().getFullYear()}-${nextNum}` }));

        } catch (error) {
            console.error("Error en handleSave:", error);
            alert(`❌ Error al guardar: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleReDownload = (invoiceRecord) => {
        generatePDF(false, invoiceRecord, invoiceRecord.items_json, {
            base_imponible: invoiceRecord.base_imponible,
            total_factura: invoiceRecord.total
        });
    };

    return (
        <div className="w-full h-[calc(100vh-10rem)] bg-black text-white flex flex-col overflow-hidden">

            {/* TABS HEADER */}
            <div className="flex gap-4 border-b border-slate-800 pb-4 mb-4 shrink-0 px-2">
                <button
                    onClick={() => setViewTab('editor')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-colors ${viewTab === 'editor' ? 'bg-[#00CFFF] text-black' : 'text-slate-400 hover:text-white bg-slate-900'}`}
                >
                    <FileText size={16} /> Emitir Nueva
                </button>
                <button
                    onClick={() => setViewTab('history')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-colors ${viewTab === 'history' ? 'bg-[#00CFFF] text-black' : 'text-slate-400 hover:text-white bg-slate-900'}`}
                >
                    <History size={16} /> Historial
                </button>
            </div>

            <AnimatePresence mode="wait">
                {viewTab === 'editor' ? (
                    <motion.div
                        key="editor"
                        initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                        className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0"
                    >
                        {/* PANEL IZQUIERDO: FORMULARIO */}
                        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl h-full flex flex-col shadow-lg">
                            <div className="flex justify-between items-center border-b border-slate-800 pb-3 mb-3 shrink-0">
                                <h2 className="text-lg font-bold flex items-center gap-2 text-white">
                                    Borrador
                                </h2>
                                <input
                                    type="text"
                                    value={invoiceData.number}
                                    onChange={(e) => setInvoiceData({ ...invoiceData, number: e.target.value })}
                                    className="bg-black border border-slate-700 rounded px-2 py-1 text-xs text-right w-36 font-mono text-[#00CFFF] focus:border-[#00CFFF] outline-none"
                                />
                            </div>

                            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-4">
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="col-span-2">
                                        <label className="text-[10px] text-slate-500 uppercase font-bold">Cliente / Empresa</label>
                                        <input className="w-full bg-black/50 border border-slate-700 rounded px-3 py-2 text-sm text-white focus:border-[#00CFFF] outline-none"
                                            placeholder="Nombre del Cliente" value={invoiceData.clientName} onChange={(e) => setInvoiceData({ ...invoiceData, clientName: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] text-slate-500 uppercase font-bold">CIF / NIF</label>
                                        <input className="w-full bg-black/50 border border-slate-700 rounded px-3 py-2 text-sm text-white focus:border-[#00CFFF] outline-none"
                                            placeholder="B-12345678" value={invoiceData.clientCif} onChange={(e) => setInvoiceData({ ...invoiceData, clientCif: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] text-slate-500 uppercase font-bold">Fecha</label>
                                        <input type="date" className="w-full bg-black/50 border border-slate-700 rounded px-3 py-2 text-sm text-white focus:border-[#00CFFF] outline-none"
                                            value={invoiceData.date} onChange={(e) => setInvoiceData({ ...invoiceData, date: e.target.value })}
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="text-[10px] text-slate-500 uppercase font-bold">Dirección</label>
                                        <input className="w-full bg-black/50 border border-slate-700 rounded px-3 py-2 text-sm text-white focus:border-[#00CFFF] outline-none"
                                            placeholder="Dirección completa" value={invoiceData.clientAddress} onChange={(e) => setInvoiceData({ ...invoiceData, clientAddress: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] text-slate-500 uppercase font-bold flex justify-between items-center">
                                        <span>Conceptos</span>
                                        <button onClick={addItem} className="text-[#00CFFF] hover:text-white flex items-center gap-1 transition-colors text-xs">
                                            <Plus size={12} /> Añadir
                                        </button>
                                    </label>
                                    {items.map((item, i) => (
                                        <div key={i} className="flex gap-2 items-center bg-slate-800/30 p-2 rounded border border-slate-700/50">
                                            <input className="flex-1 bg-transparent border-b border-slate-700 text-xs text-white focus:border-[#00CFFF] outline-none placeholder-slate-600"
                                                placeholder="Descripción..." value={item.description} onChange={(e) => handleItemChange(i, 'description', e.target.value)}
                                            />
                                            <input className="w-12 bg-transparent border-b border-slate-700 text-xs text-center text-white focus:border-[#00CFFF] outline-none"
                                                type="number" value={item.qty} onChange={(e) => handleItemChange(i, 'qty', e.target.value)}
                                            />
                                            <input className="w-20 bg-transparent border-b border-slate-700 text-xs text-right text-white focus:border-[#00CFFF] outline-none"
                                                type="number" value={item.price} onChange={(e) => handleItemChange(i, 'price', e.target.value)}
                                            />
                                            <button onClick={() => removeItem(i)} className="text-slate-500 hover:text-red-500 p-1"><Trash2 size={14} /></button>
                                        </div>
                                    ))}
                                </div>

                                <div className="grid grid-cols-2 gap-3 bg-slate-950 p-3 rounded border border-slate-800">
                                    <div>
                                        <label className="text-[10px] text-slate-500 uppercase font-bold">IVA (%)</label>
                                        <input type="number" className="w-full bg-black border border-slate-700 rounded px-2 py-1 text-sm text-white"
                                            value={invoiceData.iva} onChange={(e) => setInvoiceData({ ...invoiceData, iva: parseFloat(e.target.value) })}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] text-slate-500 uppercase font-bold">IRPF (%)</label>
                                        <select className="w-full bg-black border border-slate-700 rounded px-2 py-1 text-sm text-white focus:border-[#00CFFF] outline-none"
                                            value={invoiceData.retention} onChange={(e) => setInvoiceData({ ...invoiceData, retention: parseFloat(e.target.value) })}
                                        >
                                            <option value="0">0% (S.L.)</option>
                                            <option value="7">7% (Nuevo)</option>
                                            <option value="15">15% (Pro)</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-3 border-t border-slate-800 flex gap-3 mt-auto shrink-0">
                                <button onClick={() => generatePDF(false)} className="flex-1 bg-slate-800 hover:bg-slate-700 text-white py-2 rounded-lg flex items-center justify-center gap-2 font-bold text-xs">
                                    <Download size={16} /> Previsualizar
                                </button>
                                <button onClick={handleSave} disabled={loading} className="flex-1 bg-[#00CFFF] hover:bg-blue-400 text-black py-2 rounded-lg flex items-center justify-center gap-2 font-bold text-xs shadow-md">
                                    {loading ? <Calculator className="animate-spin" size={16} /> : <Save size={16} />} Emitir Factura
                                </button>
                            </div>
                        </div>

                        {/* PANEL DERECHO: VISTA PREVIA */}
                        <div className="bg-white text-black rounded-xl shadow-2xl relative font-sans hidden lg:flex flex-col h-full overflow-hidden">
                            <div className="absolute inset-0 border-[8px] border-slate-900 pointer-events-none z-20 rounded-xl"></div>

                            <div className="h-full overflow-y-auto custom-scrollbar p-8 flex flex-col">
                                <div className="flex justify-between items-start border-b-2 border-[#00CFFF] pb-4 mb-6 shrink-0">
                                    <div>
                                        <h1 className="text-3xl font-bold text-[#00CFFF]">NEWTEX</h1>
                                        <p className="text-xs text-gray-500 font-medium">Ingeniería de Software & Automatización</p>
                                    </div>
                                    <div className="text-right">
                                        <h2 className="text-xl font-bold text-gray-800">FACTURA</h2>
                                        <p className="text-sm text-gray-500">Nº {invoiceData.number}</p>
                                        <p className="text-sm text-gray-500">{invoiceData.date}</p>
                                    </div>
                                </div>

                                <div className="flex justify-between mb-8 text-xs shrink-0">
                                    <div>
                                        <p className="font-bold text-gray-800 uppercase mb-1">De:</p>
                                        <p className="font-bold">NEWTEX ESPJ</p>
                                        <p className="text-gray-600">C. Río Jaranda, 7 Bajo C</p>
                                        <p className="text-gray-600">10005 Cáceres</p>
                                        <p className="text-gray-600">info@newtex.es</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-gray-800 uppercase mb-1">Para:</p>
                                        <p className="font-bold">{invoiceData.clientName || "Nombre Cliente"}</p>
                                        <p className="text-gray-600">{invoiceData.clientCif || "CIF/NIF"}</p>
                                        <p className="text-gray-600 max-w-[200px] ml-auto break-words">{invoiceData.clientAddress || "Dirección"}</p>
                                    </div>
                                </div>

                                <table className="w-full mb-8">
                                    <thead>
                                        <tr className="bg-gray-100 text-gray-700 text-xs uppercase">
                                            <th className="py-2 px-2 text-left">Descripción</th>
                                            <th className="py-2 px-2 text-center">Cant.</th>
                                            <th className="py-2 px-2 text-right">Precio</th>
                                            <th className="py-2 px-2 text-right">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm">
                                        {items.map((item, i) => (
                                            <tr key={i} className="border-b border-gray-100 last:border-0">
                                                <td className="py-2 px-2">{item.description || "Servicio..."}</td>
                                                <td className="py-2 px-2 text-center">{item.qty}</td>
                                                <td className="py-2 px-2 text-right">{item.price.toFixed(2)}</td>
                                                <td className="py-2 px-2 text-right font-medium">{(item.qty * item.price).toFixed(2)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                <div className="flex justify-end mb-12 shrink-0">
                                    <div className="w-1/2 space-y-1 text-right text-sm">
                                        <div className="flex justify-between text-gray-600"><span>Base:</span><span>{totals.base.toFixed(2)} €</span></div>
                                        <div className="flex justify-between text-gray-600"><span>IVA ({invoiceData.iva}%):</span><span>{totals.ivaAmount.toFixed(2)} €</span></div>
                                        <div className="flex justify-between text-red-500"><span>IRPF (-{invoiceData.retention}%):</span><span>-{totals.irpfAmount.toFixed(2)} €</span></div>
                                        <div className="flex justify-between text-lg font-bold text-black border-t border-gray-300 pt-2 mt-2">
                                            <span>TOTAL:</span><span className="text-[#00CFFF]">{totals.total.toFixed(2)} €</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-auto pt-4 border-t text-[10px] text-gray-400 text-center shrink-0 pb-2">
                                    <p>NEWTEX ESPJ - NIF: E26701060 - Transferencia Bancaria</p>
                                    <p className="mt-1 font-bold text-gray-500">www.newtex.es | info@newtex.es | +34 608 77 10 56</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                ) : (

                    <motion.div
                        key="history"
                        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                        className="flex-1 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col"
                    >
                        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-950">
                            <h3 className="font-bold text-lg">Registro de Facturas</h3>
                            <button onClick={fetchHistory} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors">
                                <RefreshCw size={18} className={loadingHistory ? "animate-spin" : ""} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
                            {historyData.length === 0 && !loadingHistory ? (
                                <div className="text-center py-20 text-slate-500">
                                    <FileText size={48} className="mx-auto mb-4 opacity-20" />
                                    <p>No hay facturas emitidas todavía.</p>
                                </div>
                            ) : (
                                <table className="w-full text-left">
                                    <thead className="text-xs uppercase text-slate-500 bg-slate-950/50">
                                        <tr>
                                            <th className="p-3">Nº Factura</th>
                                            <th className="p-3">Fecha</th>
                                            <th className="p-3">Cliente</th>
                                            <th className="p-3 text-right">Base</th>
                                            <th className="p-3 text-right">Total</th>
                                            <th className="p-3 text-center">Acción</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-800/50 text-sm">
                                        {historyData.map((inv) => (
                                            <tr key={inv.id} className="hover:bg-slate-800/30 transition-colors">
                                                <td className="p-3 font-mono text-[#00CFFF]">{inv.numero_factura}</td>
                                                <td className="p-3 text-slate-400">{new Date(inv.fecha_emision).toLocaleDateString()}</td>
                                                <td className="p-3 font-bold">{inv.cliente_nombre} <br /><span className="text-[10px] text-slate-500 font-normal">{inv.cliente_cif}</span></td>
                                                <td className="p-3 text-right text-slate-400">{parseFloat(inv.base_imponible).toFixed(2)} €</td>
                                                <td className="p-3 text-right font-bold text-emerald-400">{parseFloat(inv.total).toFixed(2)} €</td>
                                                <td className="p-3 text-center">
                                                    <button
                                                        onClick={() => handleReDownload(inv)}
                                                        className="p-2 bg-slate-800 hover:bg-slate-700 text-white rounded transition-colors inline-flex items-center gap-1 text-xs font-bold"
                                                    >
                                                        <Download size={14} /> PDF
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default InvoiceGenerator;
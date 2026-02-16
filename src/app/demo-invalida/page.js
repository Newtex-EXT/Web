import React from 'react';

export default function DemoInvalidaPage() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-black text-white">
            <div className="text-center p-8 bg-slate-900/90 border border-white/10 rounded-lg shadow-xl">
                <h1 className="text-4xl font-bold text-red-500 mb-4">Acceso Denegado</h1>
                <p className="text-lg text-slate-300 mb-6">
                    El enlace de la demo al que has intentado acceder no es válido, ha caducado o ha sido eliminado.
                </p>
                <p className="text-md text-slate-400">
                    Por favor, solicita una nueva demo si necesitas explorar nuestras soluciones.
                </p>
                <a href="http://localhost:3000/solicitud" className="inline-block mt-8 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300">
                    Solicitar una nueva Demo
                </a>
            </div>
        </div>
    );
}
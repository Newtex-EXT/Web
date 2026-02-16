import React from 'react';

export default function DemoExpiradaPage() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-black text-white p-6">
            <div className="text-center p-8 bg-slate-900/90 border border-white/10 rounded-lg shadow-xl max-w-lg">
                <h1 className="text-4xl font-bold text-red-500 mb-4">¡Demo Expirada!</h1>
                <p className="text-lg text-slate-300 mb-6">
                    El acceso a la demo que has intentado utilizar ya no está disponible porque ha caducado.
                </p>
                <p className="text-md text-slate-400 mb-8">
                    La validez de las demos de NEWTEX es temporal. Si aún deseas explorar nuestras soluciones, puedes solicitar un nuevo acceso.
                </p>
                <a href="http://localhost:3000/solicitud" className="inline-block mt-8 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300">
                    Solicitar una nueva Demo
                </a>
            </div>
        </div>
    );
}
import React from 'react';

export default function DemoErrorPage() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-black text-white p-6">
            <div className="text-center p-8 bg-slate-900/90 border border-white/10 rounded-lg shadow-xl max-w-lg">
                <h1 className="text-4xl font-bold text-red-600 mb-4">Error Inesperado</h1>
                <p className="text-lg text-slate-300 mb-6">
                    Ha ocurrido un problema al intentar acceder a la demo de NEWTEX.
                </p>
                <p className="text-md text-slate-400 mb-8">
                    Por favor, inténtalo de nuevo más tarde o contacta con nuestro equipo de soporte si el problema persiste.
                </p>
                <a href="http://localhost:3000/solicitud" className="inline-block mt-8 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 mr-4">
                    Solicitar una nueva Demo
                </a>
                <a href="http://localhost:3000/contacto" className="inline-block mt-8 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300">
                    Contactar Soporte
                </a>
            </div>
        </div>
    );
}